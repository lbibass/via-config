const HID = require('node-hid');

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

const cache = {};

function eqArr(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((val, idx) => arr2[idx] === val);
}

let commandQueue = [];
let isFlushing = false;

export class KeyboardAPI {
  constructor(kb) {
    const {path} = kb;
    this.kbAddr = path;
    this._i = 0;
    if (!cache[path]) {
      cache[path] = new HID.HID(path);
    }
  }

  refresh(kbAddr) {
    cache[kbAddr] = new HID.HID(kbAddr);
  }

  async getByteBuffer(kbAddr) {
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

  async getKey(layer, row, col) {
    const buffer = await this.hidCommand(DYNAMIC_KEYMAP_GET_KEYCODE, [
      layer,
      row,
      col
    ]);
    return (buffer[4] << 8) | buffer[5];
  }

  async readLayout(columns, rows, layer = 0) {
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

  async readMatrix(matrix, layer) {
    const res = [];
    for (let i = 0; i < matrix.length; i++) {
      const {row, col} = matrix[i];
      res[i] = this.getKey(layer, row, col);
    }
    return Promise.all(res);
  }

  async getRGBMode() {
    const bytes = [0xa];
    const val = await this.hidCommand(BACKLIGHT_CONFIG_GET_VALUE, bytes);
    return val;
  }

  async setRGBMode(brightness = 0) {
    const bytes = [0xa, brightness];
    await this.hidCommand(BACKLIGHT_CONFIG_SET_VALUE, bytes);
  }

  async setKey(layer, row, column, val) {
    const key = parseInt(val);
    const hi = (key & 0xff00) >> 8;
    const lo = key & 0xff;
    const res = await this.hidCommand(
      DYNAMIC_KEYMAP_SET_KEYCODE,
      [layer, row, column, hi, lo].map(val => parseInt(val))
    );
    return res;
  }

  async hidCommand(command, bytes = []): Promise<any> {
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
      const ans = await this._hidCommand(...args);
      res(ans);
    }
    isFlushing = false;
  }

  getHID(addr) {
    return cache[addr];
  }

  async _hidCommand(kbAddr, command, bytes = []): Promise<any> {
    const commandBytes = [...[COMMAND_START, command], ...bytes];
    try {
      this.getHID(kbAddr).write(commandBytes);
    } catch (ex) {
      console.log('Retrying...');
      this.refresh(kbAddr);
      this.getHID(kbAddr).write(commandBytes);
    }
    const buffer = await this.getByteBuffer(kbAddr);
    const bufferCommandBytes = buffer.slice(0, commandBytes.length - 1);
    if (!eqArr(commandBytes.slice(1), bufferCommandBytes)) {
      throw 'Receiving incorrect response for command';
    }
    return buffer;
  }
}
