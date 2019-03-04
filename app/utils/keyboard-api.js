// @flow
import {getKeyboardFromDevice, getMatrixLayoutFromDevice} from './device-meta';
import {MatrixLayout} from './layout-parser';

const HID = require('node-hid');

// Zeal60 API Command IDs
const COMMAND_START = 0x00; // This is really a HID Report ID
const GET_PROTOCOL_VERSION = 0x01;
const GET_KEYBOARD_VALUE = 0x02;
const SET_KEYBOARD_VALUE = 0x03;
const DYNAMIC_KEYMAP_GET_KEYCODE = 0x04;
const DYNAMIC_KEYMAP_SET_KEYCODE = 0x05;
const DYNAMIC_KEYMAP_CLEAR_ALL = 0x06;
const BACKLIGHT_CONFIG_SET_VALUE = 0x07;
const BACKLIGHT_CONFIG_GET_VALUE = 0x08;
const BACKLIGHT_CONFIG_SAVE = 0x09;
const EEPROM_RESET = 0x0a;
const BOOTLOADER_JUMP = 0x0b;
const DYNAMIC_KEYMAP_MACRO_GET_COUNT = 0x0c;
const DYNAMIC_KEYMAP_MACRO_GET_BUFFER_SIZE = 0x0d;
const DYNAMIC_KEYMAP_MACRO_GET_BUFFER = 0x0e;
const DYNAMIC_KEYMAP_MACRO_SET_BUFFER = 0x0f;
const DYNAMIC_KEYMAP_MACRO_RESET = 0x10;
const DYNAMIC_KEYMAP_GET_LAYER_COUNT = 0x11;
const DYNAMIC_KEYMAP_GET_BUFFER = 0x12;
const DYNAMIC_KEYMAP_SET_BUFFER = 0x13;

// RGB Backlight Value IDs
const BACKLIGHT_USE_SPLIT_BACKSPACE = 0x01;
const BACKLIGHT_USE_SPLIT_LEFT_SHIFT = 0x02;
const BACKLIGHT_USE_SPLIT_RIGHT_SHIFT = 0x03;
const BACKLIGHT_USE_7U_SPACEBAR = 0x04;
const BACKLIGHT_USE_ISO_ENTER = 0x05;
const BACKLIGHT_DISABLE_HHKB_BLOCKER_LEDS = 0x06;
const BACKLIGHT_DISABLE_WHEN_USB_SUSPENDEd = 0x07;
const BACKLIGHT_DISABLE_AFTER_TIMEOUT = 0x08;
const BACKLIGHT_BRIGHTNESS = 0x09;
const BACKLIGHT_EFFECT = 0x0a;
const BACKLIGHT_EFFECT_SPEED = 0x0b;
const BACKLIGHT_COLOR_1 = 0x0c;
const BACKLIGHT_COLOR_2 = 0x0d;
const BACKLIGHT_CAPS_LOCK_INDICATOR_COLOR = 0x0e;
const BACKLIGHT_CAPS_LOCK_INDICATOR_ROW_Col = 0x0f;
const BACKLIGHT_LAYER_1_INDICATOR_COLOR = 0x10;
const BACKLIGHT_LAYER_1_INDICATOR_ROW_COL = 0x11;
const BACKLIGHT_LAYER_2_INDICATOR_COLOR = 0x12;
const BACKLIGHT_LAYER_2_INDICATOR_ROW_COL = 0x13;
const BACKLIGHT_LAYER_3_INDICATOR_COLOR = 0x14;
const BACKLIGHT_LAYER_3_INDICATOR_ROW_COL = 0x15;
const BACKLIGHT_ALPHAS_MODS = 0x16;
const BACKLIGHT_CUSTOM_COLOR = 0x17;

const PROTOCOL_ALPHA = 7;
const PROTOCOL_BETA = 8;
const PROTOCOL_GAMMA = 9;

export const BACKLIGHT_PROTOCOL_NONE = 0;
export const BACKLIGHT_PROTOCOL_WILBA = 1;

const cache: {[addr: string]: {device: Device, hid: HID}} = {};

function eqArr(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((val, idx) => arr2[idx] === val);
}

export type Device = {
  productId: number,
  vendorId: number,
  interface: number,
  usage?: number,
  usagePage?: number,
  path: string
};
type Command = number;
type HIDAddress = string;
type KB = {path: string};
type Props = {kbAddr: HIDAddress};
type MatrixEntry = {row: number, col: number};
type MatrixEntries = Array<MatrixEntry>;
type Matrix = {rows: number, cols: number, layout: MatrixEntries};
type Layer = number;
type Row = number;
type Column = number;
type CommandQueueArgs = [string, number, Array<number>] | (() => Promise<void>);
type CommandQueueEntry = {res: (val?: any) => void, args: CommandQueueArgs};
type CommandQueue = Array<CommandQueueEntry>;

const commandQueue: CommandQueue = [];
let isFlushing = false;

export const canConnect = (device: Device) => {
  try {
    new KeyboardAPI(device);
    return true;
  } catch (e) {
    console.error('Skipped ', device, e);
    return false;
  }
};

export class KeyboardAPI {
  kbAddr: HIDAddress;

  constructor(device: Device) {
    const {path} = device;
    this.kbAddr = path;
    if (!cache[path]) {
      cache[path] = {device, hid: new HID.HID(path)};
    } else {
      cache[path] = {...cache[path], device};
    }
  }

  getDevice() {
    return cache[this.kbAddr].device;
  }

  getMatrix() {
    const device = this.getDevice();
    const keyboard = getKeyboardFromDevice(device);
    return getMatrixLayoutFromDevice(device);
  }

  refresh(kbAddr: HIDAddress) {
    this.kbAddr = kbAddr;
    cache[kbAddr] = {...cache[kbAddr], hid: new HID.HID(kbAddr)};
  }

  async getByteBuffer(kbAddr: string) {
    return new Promise((res, rej) => {
      this.getHID().read((err, data) => {
        res(data);
      });
    });
  }

  async getBacklightProtocolVersion() {
    const protocol = await this.getProtocolVersion();
    return getKeyboardFromDevice(this.getDevice()).lights
      ? BACKLIGHT_PROTOCOL_WILBA
      : BACKLIGHT_PROTOCOL_NONE;
  }

  async getProtocolVersion() {
    const [_, hi, lo] = await this.hidCommand(GET_PROTOCOL_VERSION);
    return (hi << 8) | lo;
  }

  async getKey(layer: Layer, row: Row, col: Column) {
    const buffer = await this.hidCommand(DYNAMIC_KEYMAP_GET_KEYCODE, [
      layer,
      row,
      col
    ]);
    return (buffer[4] << 8) | buffer[5];
  }

  async getLayerCount() {
    const version = await this.getProtocolVersion();
    if (version === PROTOCOL_BETA) {
      const [_, hi] = await this.hidCommand(DYNAMIC_KEYMAP_GET_LAYER_COUNT);
      return hi;
    } else if (version === PROTOCOL_ALPHA) {
      return 4;
    }
  }

  async readMatrix(layer: number) {
    const matrix = this.getMatrix();
    const version = await this.getProtocolVersion();
    if (version >= PROTOCOL_BETA) {
      return this.fastReadMatrix(matrix, layer);
    } else if (version === PROTOCOL_ALPHA) {
      return this.slowReadMatrix(matrix.layout, layer);
    }
  }
  /*
void *dynamic_keymap_key_to_eeprom_address(uint8_t layer, uint8_t row, uint8_t column)
( layer * MATRIX_ROWS * MATRIX_COLS * 2 ) +
    ( row * MATRIX_COLS * 2 ) + ( column * 2 );
    */

  async getKeymapBuffer(offset: number, size: number) {
    // size must be <=14
    const res = await this.hidCommand(DYNAMIC_KEYMAP_GET_BUFFER, [
      offset >> 8,
      offset & 255,
      size
    ]);
    return [...res].slice(4, size + 4);
  }

  keymapBufferToKeycodes(buffer: any) {
    const keycodes = Array.from(buffer).reduce(
      (p, n, idx) =>
        idx % 2 === 0
          ? [...p, (n || 0) << 8]
          : [...p.slice(0, -1), p[p.length - 1] + (n || 0)],
      []
    );
    return keycodes;
  }

  async fastReadMatrix({rows, cols, layout}: Matrix, layer: number): number[] {
    const length = rows * cols;
    const MAX_KEYCODES_PARTIAL = 14;
    const bufferList = new Array(Math.ceil(length / MAX_KEYCODES_PARTIAL)).fill(
      0
    );
    const {res: promiseRes} = bufferList.reduce(
      ({res, remaining}: {res: Promise<any>[], remaining: number}, n) =>
        remaining < MAX_KEYCODES_PARTIAL
          ? {
              res: [
                ...res,
                this.getKeymapBuffer(
                  layer * length * 2 + 2 * (length - remaining),
                  remaining * 2
                )
              ],
              remaining: 0
            }
          : {
              res: [
                ...res,
                this.getKeymapBuffer(
                  layer * length * 2 + 2 * (length - remaining),
                  MAX_KEYCODES_PARTIAL * 2
                )
              ],
              remaining: remaining - MAX_KEYCODES_PARTIAL
            },
      {res: [], remaining: length}
    );
    const yieldedRes = await Promise.all(promiseRes);
    const keycodesArr: number[] = [].concat(
      ...yieldedRes.map(this.keymapBufferToKeycodes.bind(this))
    );
    return layout.map(
      ({row, col}: MatrixEntry) => keycodesArr[row * cols + col]
    );
  }

  async slowReadMatrix(matrix: MatrixEntries, layer: number) {
    const res = [];
    for (let i = 0; i < matrix.length; i++) {
      const {row, col} = matrix[i];
      res[i] = this.getKey(layer, row, col);
    }
    return Promise.all(res);
  }

  async getRGBMode() {
    const bytes = [BACKLIGHT_EFFECT];
    const [, , val] = await this.hidCommand(BACKLIGHT_CONFIG_GET_VALUE, bytes);
    return val;
  }

  async getBrightness() {
    const bytes = [BACKLIGHT_BRIGHTNESS];
    const [, , brightness] = await this.hidCommand(
      BACKLIGHT_CONFIG_GET_VALUE,
      bytes
    );
    return brightness;
  }

  async getColor(colorNumber: number) {
    const bytes = [colorNumber === 1 ? BACKLIGHT_COLOR_1 : BACKLIGHT_COLOR_2];
    const [, , hue, sat] = await this.hidCommand(
      BACKLIGHT_CONFIG_GET_VALUE,
      bytes
    );
    return {hue, sat};
  }

  async setColor(colorNumber: number, hue: number, sat: number) {
    const bytes = [
      colorNumber === 1 ? BACKLIGHT_COLOR_1 : BACKLIGHT_COLOR_2,
      hue,
      sat
    ];
    await this.hidCommand(BACKLIGHT_CONFIG_SET_VALUE, bytes);
  }

  async getCustomColor(colorNumber: number) {
    const bytes = [BACKLIGHT_CUSTOM_COLOR, colorNumber];
    const [, , , hue, sat] = await this.hidCommand(
      BACKLIGHT_CONFIG_GET_VALUE,
      bytes
    );
    return {hue, sat};
  }

  async setCustomColor(colorNumber: number, hue: number, sat: number) {
    const bytes = [BACKLIGHT_CUSTOM_COLOR, colorNumber, hue, sat];
    await this.hidCommand(BACKLIGHT_CONFIG_SET_VALUE, bytes);
  }

  async setBrightness(brightness: number) {
    const bytes = [BACKLIGHT_BRIGHTNESS, brightness];
    await this.hidCommand(BACKLIGHT_CONFIG_SET_VALUE, bytes);
  }

  async setRGBMode(effect: number) {
    const bytes = [BACKLIGHT_EFFECT, effect];
    await this.hidCommand(BACKLIGHT_CONFIG_SET_VALUE, bytes);
  }

  async saveLighting() {
    await this.hidCommand(BACKLIGHT_CONFIG_SAVE);
  }

  async resetEEPROM() {
    const bytes = [];
    await this.hidCommand(EEPROM_RESET);
  }

  async jumpToBootloader() {
    await this.hidCommand(BOOTLOADER_JUMP);
  }

  async setKey(layer: Layer, row: Row, column: Column, val: number) {
    const key = parseInt(val);
    const hi = (key & 0xff00) >> 8;
    const lo = key & 0xff;
    const res = await this.hidCommand(
      DYNAMIC_KEYMAP_SET_KEYCODE,
      [layer, row, column, hi, lo].map(val => parseInt(val))
    );
    return (res[4] << 8) | res[5];
  }

  async timeout(time: number) {
    return new Promise((res, rej) => {
      commandQueue.push({
        res,
        args: () => new Promise((r, j) => setTimeout(() => r() || res(), time))
      });
      if (!isFlushing) {
        this.flushQueue();
      }
    });
  }

  async hidCommand(command: Command, bytes: Array<number> = []): Promise<any> {
    return new Promise((res, rej) => {
      commandQueue.push({res, args: [this.kbAddr, command, bytes]});
      if (!isFlushing) {
        this.flushQueue();
      }
    });
  }

  async flushQueue() {
    if (isFlushing === true) {
      return;
    }
    isFlushing = true;
    while (commandQueue.length !== 0) {
      const {res, args} = commandQueue.shift();
      // This allows us to queue promises in between hid commands, useful for timeouts
      if (typeof args === 'function') {
        await args();
        res();
      } else {
        const ans = await this._hidCommand(...args);
        res(ans);
      }
    }
    isFlushing = false;
  }

  getHID() {
    return cache[this.kbAddr].hid;
  }

  async _hidCommand(
    kbAddr: HIDAddress,
    command: Command,
    bytes: Array<number> = []
  ): Promise<any> {
    const commandBytes = [...[COMMAND_START, command], ...bytes];
    const paddedArray = new Array(33).fill(0);
    commandBytes.forEach((val, idx) => (paddedArray[idx] = val));
    try {
      this.getHID().write(paddedArray);
    } catch (ex) {
      console.log('Retrying...');
      this.refresh(kbAddr);
      this.getHID().write(paddedArray);
    }
    const buffer = await this.getByteBuffer(kbAddr);
    const bufferCommandBytes = buffer.slice(0, commandBytes.length - 1);
    if (!eqArr(commandBytes.slice(1), bufferCommandBytes)) {
      console.error('Command:', commandBytes, ' Resp:', buffer);
      throw 'Receiving incorrect response for command';
    }
    return buffer;
  }
}
