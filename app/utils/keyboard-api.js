// @flow
const HID = require('node-hid');
const debounce = require('lodash.debounce');
const COMMAND_START = 0x00;
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

const cache = {};

function eqArr(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((val, idx) => arr2[idx] === val);
}

type Command = number;
type HIDAddress = string;
type KB = {path: string};
type Props = {kbAddr: HIDAddress};
type MatrixEntry = {row: number, col: number};
type Matrix = Array<MatrixEntry>;
type Layer = number;
type Row = number;
type Column = number;
type CommandQueueArgs = [string, number, Array<number>] | (() => Promise<void>);
type CommandQueueEntry = {res: (val?: any) => void, args: CommandQueueArgs};
type CommandQueue = Array<CommandQueueEntry>;

let commandQueue: CommandQueue = [];
let isFlushing = false;

export class KeyboardAPI {
  kbAddr: HIDAddress;

  constructor(kb: KB) {
    const {path} = kb;
    this.kbAddr = path;
    if (!cache[path]) {
      cache[path] = new HID.HID(path);
    }
  }

  refresh(kbAddr: HIDAddress) {
    cache[kbAddr] = new HID.HID(kbAddr);
  }

  async getByteBuffer(kbAddr: string) {
    return new Promise((res, rej) => {
      this.getHID(kbAddr).read((err, data) => {
        res(data);
      });
    });
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

  async readLayout(columns: number, rows: number, layer: Layer = 0) {
    const res = [];
    try {
      for (let i = 0; i < columns; i++) {
        res[i] = [];
        for (let j = 0; j < rows; j++) {
          res[i][j] = await this.getKey(layer, i, j);
        }
      }
      return res;
    } catch (e) {}
  }

  async readMatrix(matrix: Matrix, layer: number) {
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
      sat,
      255
    ];
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

  getHID(addr: string) {
    return cache[addr];
  }

  async _hidCommand(
    kbAddr: HIDAddress,
    command: Command,
    bytes: Array<number> = []
  ): Promise<any> {
    const commandBytes = [...[COMMAND_START, command], ...bytes];
    try {
      const paddedArray = new Array(32).fill(0);
      commandBytes.forEach((val, idx) => (paddedArray[idx] = val));
      console.log(commandBytes, this.getHID(kbAddr).write(commandBytes));
    } catch (ex) {
      console.log('Retrying...');
      this.refresh(kbAddr);
      this.getHID(kbAddr).write(commandBytes);
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
