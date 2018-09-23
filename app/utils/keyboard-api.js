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

export class Keyboard {
  constructor(kbAddr) {
    if (cache[kbAddr]) {
      this.hid = cache[kbAddr];
    } else {
      cache[kbAddr] = this.hid = new HID.HID(kbAddr);
    }
  }

  getByteBuffer() {
    return new Promise((res, rej) => {
      this.hid.once('data', data => {
        res(data);
      });
    });
  }

  getProtocolVersion() {
    this.readCommand(GET_PROTOCOL_VERSION, []);
  }

  async readLayout(columns, rows) {
    const res = [];
    try {
      for (let i = 0; i < columns; i++) {
        res[i] = [];
        for (let j = 0; j < rows; j++) {
          const buffer = await this.readCommand(DYNAMIC_KEYMAP_GET_KEYCODE, [
            0,
            i,
            j
          ]);
          const twoByte = (buffer[4] << 8) | buffer[5];
          res[i][j] = twoByte;
        }
      }
      return res;
    } catch (e) {}
  }

  setRGBMode(brightness = 0) {
    const bytes = [0xa, brightness];
    this.writeCommand(BACKLIGHT_CONFIG_SET_VALUE, bytes);
  }

  readCommand(command, bytes, bytesToRead) {
    this.hid.write([...[COMMAND_START, command], ...bytes]);
    return this.getByteBuffer().then(buffer => {
      return buffer;
    });
  }

  writeCommand(command, bytes) {
    this.hid.write([...[COMMAND_START, command], ...bytes]);
  }
}
