// Tests if label is an alpha
export function isAlpha(label) {
  return /[A-Za-z]/.test(label) && label.length === 1;
}

// Tests if label is a number
export function isNumericOrShiftedSymbol(label) {
  const numbersTop = '!@#$%^&*()_+|~{}:"<>?1234567890'.split('');
  return label.length === 1 && numbersTop.includes(label[0]);
}

// Tests if label is a number
export function isNumericSymbol(label) {
  const numbersTop = '!@#$%^&*()_+|~{}:"<>?'.split('');
  return label.length !== 1 && numbersTop.includes(label[0]);
}

// Maps the byte value to the keycode
export function getByteForCode(code) {
  const byte = basicKeyToByte[code];
  if (byte) {
    return byte;
  } else if (isLayerCode(code)) {
    return getByteForLayerCode(code);
  }
  throw `Could not find byte for ${code}`;
}

const QK_MO = 0x5100;
const QK_TO = 0x5000;
const QK_OSL = 0x5400;
const QK_TG = 0x5300;
const QK_TT = 0x5800;
const QK_DF = 0x5200;

function isLayerCode(code) {
  return /([A-Za-z]+)\((\d+)\)/.test(code);
}

function getByteForLayerCode(keycode) {
  const [, code, layer] = keycode.match(/([A-Za-z]+)\((\d+)\)/);
  const numLayer = parseInt(layer);
  switch (code) {
    case 'MO': {
      return QK_MO | numLayer;
    }
    case 'TG': {
      return QK_TG | numLayer;
    }
    case 'TO': {
      return QK_TO | numLayer;
    }
    case 'TT': {
      return QK_TT | numLayer;
    }
    case 'DF': {
      return QK_DF | numLayer;
    }
    case 'OSL': {
      return QK_OSL | numLayer;
    }
    default: {
      throw 'Incorrect code';
    }
  }
}

function getCodeForLayerByte(byte) {
  const layer = byte & 0xff;
  if (QK_MO <= byte && (QK_MO | 0xff) >= byte) {
    return `MO(${layer})`;
  } else if (QK_TO <= byte && (QK_TO | 0xff) >= byte) {
    return `TO(${layer})`;
  } else if (QK_OSL <= byte && (QK_OSL | 0xff) >= byte) {
    return `OSL(${layer})`;
  } else if (QK_TG <= byte && (QK_TG | 0xff) >= byte) {
    return `TG(${layer})`;
  } else if (QK_TT <= byte && (QK_TT | 0xff) >= byte) {
    return `TT(${layer})`;
  } else if (QK_DF <= byte && (QK_DF | 0xff) >= byte) {
    return `DF(${layer})`;
  }
}

// Todo remove duplicates
export const basicKeyToByte = {
  KC_LCTL: 0x00e0,
  KC_RCTL: 0x00e4,
  KC_LSFT: 0x00e1,
  KC_RSFT: 0x00e5,
  KC_ESC: 0x0029,
  KC_BSPC: 0x002a,
  KC_ENT: 0x0028,
  KC_DEL: 0x004c,
  KC_INS: 0x0049,
  KC_CAPS: 0x0039,
  KC_RGHT: 0x004f,
  KC_PGDN: 0x004e,
  KC_PSCR: 0x0046,
  KC_SLCK: 0x0047,
  KC_PAUS: 0x0048,
  KC_NLCK: 0x0053,
  KC_SPC: 0x002c,
  KC_MINS: 0x002d,
  KC_EQL: 0x002e,
  KC_GRV: 0x0035,
  KC_RBRC: 0x0030,
  KC_LBRC: 0x002f,
  KC_COMM: 0x0036,
  KC_BSLS: 0x0031,
  KC_SLSH: 0x0038,
  KC_SCLN: 0x0033,
  KC_QUOT: 0x0034,
  KC_APP: 0x0065,
  KC_NUHS: 0x0032,
  KC_NUBS: 0x0064,
  // LOCKING
  KC_LCAP: 0x0082,
  KC_LNUM: 0x0083,
  KC_LSCR: 0x0084,
  // END-LOCKING
  KC_ERAS: 0x0099,
  KC_CLR: 0x009c,
  KC_ZKHK: 0x0035,
  KC_RO: 0x0087,
  KC_KANA: 0x0088,
  KC_JYEN: 0x0089,
  KC_HENK: 0x008a,
  KC_MHEN: 0x008b,
  KC_P1: 0x0059,
  KC_P2: 0x005a,
  KC_P3: 0x005b,
  KC_P4: 0x005c,
  KC_P5: 0x005d,
  KC_P6: 0x005e,
  KC_P7: 0x005f,
  KC_P8: 0x0060,
  KC_P9: 0x0061,
  KC_P0: 0x0062,
  KC_PDOT: 0x0063,
  KC_PCMM: 0x0085,
  KC_PSLS: 0x0054,
  KC_PAST: 0x0055,
  KC_PMNS: 0x0056,
  KC_PPLS: 0x0057,
  KC_PEQL: 0x0067,
  KC_PENT: 0x0058,
  KC_MS_U: 0x00f0,
  KC_MS_D: 0x00f1,
  KC_MS_L: 0x00f2,
  KC_MS_R: 0x00f3,
  KC_BTN1: 0x00f4,
  KC_BTN2: 0x00f5,
  KC_BTN3: 0x00f6,
  KC_BTN4: 0x00f7,
  KC_BTN5: 0x00f8,
  KC_WH_U: 0x00f9,
  KC_WH_D: 0x00fa,
  KC_WH_L: 0x00fb,
  KC_WH_R: 0x00fc,
  KC_ACL0: 0x00fd,
  KC_ACL1: 0x00fe,
  KC_ACL2: 0x00ff,
  KC_PWR: 0x00a5,
  KC_SLEP: 0x00a6,
  KC_WAKE: 0x00a7,
  KC_MUTE: 0x00a8,
  KC_VOLU: 0x00a9,
  KC_VOLD: 0x00aa,
  KC_MNXT: 0x00ab,
  KC_MPRV: 0x00ac,
  KC_MFFD: 0x00bb,
  KC_MRWD: 0x00bc,
  KC_MSTP: 0x00ad,
  KC_MPLY: 0x00ae,
  KC_MSEL: 0x00af,
  KC_EJCT: 0x00b0,
  KC_CALC: 0x00b2,
  KC_MYCM: 0x00b3,
  KC_WSCH: 0x00b4,
  KC_WHOM: 0x00b5,
  KC_WBAK: 0x00b6,
  KC_WFWD: 0x00b7,
  KC_WSTP: 0x00b8,
  KC_WREF: 0x00b9,
  KC_WFAV: 0x00ba,
  KC_TRNS: 0x0001,
  KC_NO: 0x0000,
  KC_A: 0x0004,
  KC_B: 0x0005,
  KC_C: 0x0006,
  KC_D: 0x0007,
  KC_E: 0x0008,
  KC_F: 0x0009,
  KC_G: 0x000a,
  KC_H: 0x000b,
  KC_I: 0x000c,
  KC_J: 0x000d,
  KC_K: 0x000e,
  KC_L: 0x000f,
  KC_M: 0x0010,
  KC_N: 0x0011,
  KC_O: 0x0012,
  KC_P: 0x0013,
  KC_Q: 0x0014,
  KC_R: 0x0015,
  KC_S: 0x0016,
  KC_T: 0x0017,
  KC_U: 0x0018,
  KC_V: 0x0019,
  KC_W: 0x001a,
  KC_X: 0x001b,
  KC_Y: 0x001c,
  KC_Z: 0x001d,
  KC_1: 0x001e,
  KC_2: 0x001f,
  KC_3: 0x0020,
  KC_4: 0x0021,
  KC_5: 0x0022,
  KC_6: 0x0023,
  KC_7: 0x0024,
  KC_8: 0x0025,
  KC_9: 0x0026,
  KC_0: 0x0027,
  KC_TAB: 0x002b,
  KC_DOT: 0x0037,
  KC_F1: 0x003a,
  KC_F2: 0x003b,
  KC_F3: 0x003c,
  KC_F4: 0x003d,
  KC_F5: 0x003e,
  KC_F6: 0x003f,
  KC_F7: 0x0040,
  KC_F8: 0x0041,
  KC_F9: 0x0042,
  KC_F10: 0x0043,
  KC_F11: 0x0044,
  KC_F12: 0x0045,
  KC_HOME: 0x004a,
  KC_PGUP: 0x004b,
  KC_END: 0x004d,
  KC_LEFT: 0x0050,
  KC_DOWN: 0x0051,
  KC_UP: 0x0052,
  KC_POWER: 0x0066,
  KC_F13: 0x0068,
  KC_F14: 0x0069,
  KC_F15: 0x006a,
  KC_F16: 0x006b,
  KC_F17: 0x006c,
  KC_F18: 0x006d,
  KC_F19: 0x006e,
  KC_F20: 0x006f,
  KC_F21: 0x0070,
  KC_F22: 0x0071,
  KC_F23: 0x0072,
  KC_F24: 0x0073,
  KC_EXECUTE: 0x0074,
  KC_HELP: 0x0075,
  KC_MENU: 0x0076,
  KC_SELECT: 0x0077,
  KC_STOP: 0x0078,
  KC_AGAIN: 0x0079,
  KC_UNDO: 0x007a,
  KC_CUT: 0x007b,
  KC_COPY: 0x007c,
  KC_PASTE: 0x007d,
  KC_FIND: 0x007e,
  //MACONLY
  KC__MUTE: 0x007f,
  KC__VOLUP: 0x0080,
  KC__VOLDOWN: 0x0081,
  //MACONLYEND
  KC_KP_EQUAL_AS400: 0x0086,
  // INTERNATIONAL
  KC_INT6: 0x008c,
  KC_INT7: 0x008d,
  KC_INT8: 0x008e,
  KC_INT9: 0x008f,
  KC_HAEN: 0x0090,
  KC_HANJ: 0x0091,
  KC_LANG3: 0x0092,
  KC_LANG4: 0x0093,
  KC_LANG5: 0x0094,
  KC_LANG6: 0x0095,
  KC_LANG7: 0x0096,
  KC_LANG8: 0x0097,
  KC_LANG9: 0x0098,
  // SOMETHING WEIRD
  KC_SYSREQ: 0x009a,
  KC_CANCEL: 0x009b,
  KC_CLEAR: 0x009c,
  KC_PRIOR: 0x009d,
  KC_RETURN: 0x009e,
  KC_SEPARATOR: 0x009f,
  KC_OUT: 0x00a0,
  KC_OPER: 0x00a1,
  KC_CLEAR_AGAIN: 0x00a2,
  KC_CRSEL: 0x00a3,
  KC_EXSEL: 0x00a4,
  KC_LSHIFT: 0x00e1,
  KC_LALT: 0x00e2,
  KC_LGUI: 0x00e3,
  KC_RCTRL: 0x00e4,
  KC_RSHIFT: 0x00e5,
  KC_RALT: 0x00e6,
  KC_RGUI: 0x00e7,
  //SYSTEM
  //MEDIA
  // APP
  KC_MAIL: 0x00b1,
  KC_WWW_SEARCH: 0x00b4,
  KC_WWW_HOME: 0x00b5,
  KC_WWW_BACK: 0x00b6,
  KC_WWW_FORWARD: 0x00b7,
  KC_WWW_STOP: 0x00b8,
  KC_WWW_REFRESH: 0x00b9,
  KC_WWW_FAVORITES: 0x00ba,
  KC_FN0: 0x00c0,
  KC_FN1: 0x00c1,
  KC_FN2: 0x00c2,
  KC_FN3: 0x00c3,
  KC_FN4: 0x00c4,
  KC_FN5: 0x00c5,
  KC_FN6: 0x00c6,
  KC_FN7: 0x00c7,
  KC_FN8: 0x00c8,
  KC_FN9: 0x00c9,
  KC_FN10: 0x00ca,
  KC_FN11: 0x00cb,
  KC_FN12: 0x00cc,
  KC_FN13: 0x00cd,
  KC_FN14: 0x00ce,
  KC_FN15: 0x00cf,
  KC_FN16: 0x00d0,
  KC_FN17: 0x00d1,
  KC_FN18: 0x00d2,
  KC_FN19: 0x00d3,
  KC_FN20: 0x00d4,
  KC_FN21: 0x00d5,
  KC_FN22: 0x00d6,
  KC_FN23: 0x00d7,
  KC_FN24: 0x00d8,
  KC_FN25: 0x00d9,
  KC_FN26: 0x00da,
  KC_FN27: 0x00db,
  KC_FN28: 0x00dc,
  KC_FN29: 0x00dd,
  KC_FN30: 0x00de,
  KC_FN31: 0x00df,
  KC_MS_UP: 0x00f0,
  KC_MS_DOWN: 0x00f1,
  KC_MS_LEFT: 0x00f2,
  KC_MS_RIGHT: 0x00f3,
  KC_MS_BTN1: 0x00f4,
  KC_MS_BTN2: 0x00f5,
  KC_MS_BTN3: 0x00f6,
  KC_MS_BTN4: 0x00f7,
  KC_MS_BTN5: 0x00f8,
  KC_MS_WH_UP: 0x00f9,
  KC_MS_WH_DOWN: 0x00fa,
  KC_MS_WH_LEFT: 0x00fb,
  KC_MS_WH_RIGHT: 0x00fc,
  KC_MS_ACCEL0: 0x00fd,
  KC_MS_ACCEL1: 0x00fe,
  KC_MS_ACCEL2: 0x00ff,
  RESET: 0x5c00,
  DEBUG: 0x5c01,
  KC_GESC: 0x5c15,
  GRAVE_ESC: 0x5c15,
  BL_ON: 0x5cb9,
  BL_OFF: 0x5cba,
  BL_DEC: 0x5cbb,
  BL_INC: 0x5cbc,
  BL_TOGG: 0x5cbd,
  BL_STEP: 0x5cbe,
  BL_BRTG: 0x5cbf,
  RGB_TOG: 0x5cc0,
  RGB_MOD: 0x5cc1,
  RGB_SMOD: 0x5cc1,
  RGB_RMOD: 0x5cc2,
  RGB_HUI: 0x5cc3,
  RGB_HUD: 0x5cc4,
  RGB_SAI: 0x5cc5,
  RGB_SAD: 0x5cc6,
  RGB_VAI: 0x5cc7,
  RGB_VAD: 0x5cc8,
  RGB_SPI: 0x5cc9,
  RGB_SPD: 0x5cca,
  RGB_M_P: 0x5ccb,
  RGB_M_B: 0x5ccc,
  RGB_M_R: 0x5ccd,
  RGB_M_SW: 0x5cce,
  RGB_M_SN: 0x5ccf,
  RGB_M_K: 0x5cd0,
  RGB_M_X: 0x5cd1,
  RGB_M_G: 0x5cd2,
  KC_LSPO: 0x5cd4,
  KC_RSPC: 0x5cd5,
  KC_TILD: 0x0235,
  KC_EXLM: 0x021e,
  KC_AT: 0x021f,
  KC_HASH: 0x0220,
  KC_DLR: 0x0221,
  KC_PERC: 0x0222,
  KC_CIRC: 0x0223,
  KC_AMPR: 0x0224,
  KC_ASTR: 0x0225,
  KC_LPRN: 0x0226,
  KC_RPRN: 0x0227,
  KC_UNDS: 0x022d,
  KC_PLUS: 0x022e,
  KC_LCBR: 0x022f,
  KC_RCBR: 0x0230,
  KC_LABK: 0x0236,
  KC_RABK: 0x0237,
  KC_COLN: 0x0233,
  KC_PIPE: 0x0231,
  KC_LT: 0x0236,
  KC_GT: 0x0237,
  KC_QUES: 0x0238,
  KC_DQUO: 0x0234,
  BR_INC: 0x5f00,
  BR_DEC: 0x5f01,
  EF_INC: 0x5f02,
  EF_DEC: 0x5f03,
  ES_INC: 0x5f04,
  ES_DEC: 0x5f05,
  H1_INC: 0x5f06,
  H1_DEC: 0x5f07,
  S1_INC: 0x5f08,
  S1_DEC: 0x5f09,
  H2_INC: 0x5f0a,
  H2_DEC: 0x5f0b,
  S2_INC: 0x5f0c,
  S2_DEC: 0x5f0d,
  S2_INC: 0x5f0c,
  S2_DEC: 0x5f0d,
  FN_MO13: 0x5f10,
  FN_MO23: 0x5f11,
  FN_TT13: 0x2f31,
  FN_TT23: 0x2f32,
  TG_NKRO: 0x5c14,
  MOD_LCTL: 0x0001,
  MOD_LSFT: 0x0002,
  MOD_LALT: 0x0004,
  MOD_LGUI: 0x0008,
  MOD_RCTL: 0x0011,
  MOD_RSFT: 0x0012,
  MOD_RALT: 0x0014,
  MOD_RGUI: 0x0018,
  MOD_HYPR: 0x000f,
  MOD_MEH: 0x0007
};

const keycodesList = getKeycodes().reduce((p, n) => p.concat(n.keycodes), []);

console.log(
  'correct list',
  Object.keys(basicKeyToByte).filter(key =>
    keycodesList.map(({code}) => code).includes(key)
  )
);
console.log(
  'missing list',
  Object.keys(basicKeyToByte).filter(
    key => !keycodesList.map(({code}) => code).includes(key)
  )
);

export const byteToKey = Object.keys(basicKeyToByte).reduce((p, n) => {
  const key = basicKeyToByte[n];
  if (key in p) {
    const basicKeycode = keycodesList.find(({code}) => code === n);
    if (basicKeycode) {
      return {...p, [key]: basicKeycode.code};
      console.log('replacing:', p[key], ' with: ', n);
    }
    console.log('skipping:', n);
    return p;
  }
  return {...p, [key]: n};
}, {});

export function keycodeInMaster(keycode) {
  return keycode in basicKeyToByte || isLayerCode(keycode);
}

function shorten(str) {
  return str.replace(/[aeiou ]/gi, '');
}

export function getLabelForByte(byte, size = 100) {
  const keycode = byteToKey[byte];
  const basicKeycode = keycodesList.find(({code}) => code === keycode);
  if (basicKeycode) {
    const {name, shortName} = basicKeycode;
    if (size <= 150 && shortName) {
      return shortName;
    }
    return size === 100 && name.length > 5 ? shorten(name) : name;
  } else if (keycode) {
    console.log(`Add map for ${keycode}`);
    return keycode
      .replace('KC_', '')
      .replace('FN_', '')
      .replace(/_/g, ' ');
  } else if (isLayerKey(byte)) {
    return getCodeForLayerByte(byte);
  } else {
    return '0x' + Number(byte).toString(16);
  }
}

function isLayerKey(byte) {
  return [QK_DF, QK_MO, QK_OSL, QK_TG, QK_TO, QK_TT].some(
    code => byte >= code && byte <= (code | 0xff)
  );
}

export function getKeycodeForByte(byte) {
  const keycode = byteToKey[byte];
  const basicKeycode = keycodesList.find(({code}) => code === keycode);
  return (basicKeycode && basicKeycode.code) || keycode;
}

export function getOtherMenu() {
  const otherKeycodes = Object.keys(basicKeyToByte).filter(
    key => !keycodesList.map(({code}) => code).includes(key)
  );

  return {
    label: 'Other',
    keycodes: otherKeycodes.map(code => ({
      name: code.replace('KC_', '').replace(/_/g, ' '),
      code: code
    }))
  };
}

// Flat map that #@!$
function flatMap(arr, fn) {
  return [].concat(...arr.map(fn));
}

export function buildLayerMenu() {
  const menu = {
    label: 'Layers',
    width: 'label',
    keycodes: [
      {
        name: 'MO',
        code: 'MO(layer)',
        type: 'layer',
        layer: 0,
        title: 'Momentary turn layer on'
      },
      {
        name: 'TG',
        code: 'TG(layer)',
        type: 'layer',
        layer: 0,
        title: 'Toggle layer on/off'
      },
      {
        name: 'TO',
        code: 'TO(layer)',
        type: 'layer',
        layer: 0,
        title: 'Turn on layer when pressed'
      },
      {
        name: 'TT',
        code: 'TT(layer)',
        type: 'layer',
        layer: 0,
        title:
          "Normally acts like MO unless it's tapped multple times which toggles layer on"
      },
      {
        name: 'DF',
        code: 'DF(layer)',
        type: 'layer',
        layer: 0,
        title: 'Sets the default layer'
      },
      {
        name: 'OSL',
        code: 'OSL(layer)',
        type: 'layer',
        layer: 0,
        title: 'Switch to layer for one keypress'
      }
    ]
  };

  // Statically generate layer codes from 0-3 instead of making it an input
  return {
    ...menu,
    keycodes: flatMap(menu.keycodes, keycode => {
      let res = [];
      for (let idx = 0; idx < 4; idx++) {
        const newTitle = keycode.title.replace('layer', `layer ${idx}`);
        const newCode = keycode.code.replace('layer', idx);
        const newName = keycode.name + `(${idx})`;
        res = [
          ...res,
          {...keycode, name: newName, title: newTitle, code: newCode}
        ];
      }
      return res;
    })
  };
}

export function getKeycodes() {
  return [
    {
      label: 'Basic',
      keycodes: [
        {name: 'Esc', code: 'KC_ESC', keys: 'esc'},
        {name: 'F1', code: 'KC_F1'},
        {name: 'F2', code: 'KC_F2'},
        {name: 'F3', code: 'KC_F3'},
        {name: 'F4', code: 'KC_F4'},
        {name: 'F5', code: 'KC_F5'},
        {name: 'F6', code: 'KC_F6'},
        {name: 'F7', code: 'KC_F7'},
        {name: 'F8', code: 'KC_F8'},
        {name: 'F9', code: 'KC_F9'},
        {name: 'F10', code: 'KC_F10'},
        {name: 'F11', code: 'KC_F11'},
        {name: 'F12', code: 'KC_F12'},
        {name: 'F13', code: 'KC_F13'},
        {name: 'F14', code: 'KC_F14'},
        {name: 'F15', code: 'KC_F15'},
        {name: 'F16', code: 'KC_F16'},
        {name: 'F17', code: 'KC_F17'},
        {name: 'F18', code: 'KC_F18'},
        {name: 'F19', code: 'KC_F19'},
        {name: 'F20', code: 'KC_F20'},
        {name: 'F21', code: 'KC_F21'},
        {name: 'F22', code: 'KC_F22'},
        {name: 'F23', code: 'KC_F23'},
        {name: 'F24', code: 'KC_F24'},
        {name: 'Print Screen', code: 'KC_PSCR', shortName: 'Print'},
        {name: 'Locking Scroll Lock', code: 'KC_LSCR', shortName: 'Scroll'},
        {name: 'Scroll Lock', code: 'KC_SLCK', shortName: 'Scroll'},
        {name: 'Pause', code: 'KC_PAUS'},
        {name: '~\n`', code: 'KC_GRV', keys: '`'},
        {name: '!\n1', code: 'KC_1', keys: '1'},
        {name: '@\n2', code: 'KC_2', keys: '2'},
        {name: '#\n3', code: 'KC_3', keys: '3'},
        {name: '$\n4', code: 'KC_4', keys: '4'},
        {name: '%\n5', code: 'KC_5', keys: '5'},
        {name: '^\n6', code: 'KC_6', keys: '6'},
        {name: '&\n7', code: 'KC_7', keys: '7'},
        {name: '*\n8', code: 'KC_8', keys: '8'},
        {name: '(\n9', code: 'KC_9', keys: '9'},
        {name: ')\n0', code: 'KC_0', keys: '0'},
        {name: '_\n-', code: 'KC_MINS', keys: '-'},
        {name: '+\n=', code: 'KC_EQL', keys: '='},
        {
          name: 'Back Space',
          code: 'KC_BSPC',
          keys: 'backspace',
          width: 2000,
          shortName: '⌫'
        },
        {name: 'Insert', code: 'KC_INS', keys: 'insert', shortName: 'Ins'},
        {name: 'Home', code: 'KC_HOME', keys: 'home'},
        {name: 'Page Up', code: 'KC_PGUP', keys: 'pageup', shortName: 'PgUp'},
        {name: 'Locking Num Lock', code: 'KC_LNUM', keys: 'num'},
        {name: 'Num Lock', code: 'KC_NLCK', keys: 'num'},
        {name: '/', code: 'KC_PSLS', keys: 'num_divide'},
        {name: '*', code: 'KC_PAST', keys: 'num_multiply'},
        {name: '-', code: 'KC_PMNS', keys: 'num_subtract'},
        {name: 'Tab', code: 'KC_TAB', keys: 'tab', width: 1500},
        {name: 'q', code: 'KC_Q', keys: 'q'},
        {name: 'w', code: 'KC_W', keys: 'w'},
        {name: 'e', code: 'KC_E', keys: 'e'},
        {name: 'r', code: 'KC_R', keys: 'r'},
        {name: 't', code: 'KC_T', keys: 't'},
        {name: 'y', code: 'KC_Y', keys: 'y'},
        {name: 'u', code: 'KC_U', keys: 'u'},
        {name: 'i', code: 'KC_I', keys: 'i'},
        {name: 'o', code: 'KC_O', keys: 'o'},
        {name: 'p', code: 'KC_P', keys: 'p'},
        {name: '{\n[', code: 'KC_LBRC', keys: '['},
        {name: '}\n]', code: 'KC_RBRC', keys: ']'},
        {name: '|\n\\', code: 'KC_BSLS', keys: '\\', width: 1500},
        {name: 'Del', code: 'KC_DEL', keys: 'delete'},
        {name: 'End', code: 'KC_END', keys: 'end'},
        {
          name: 'Page Down',
          code: 'KC_PGDN',
          keys: 'pagedown',
          shortName: 'PgDn'
        },
        {name: '7', code: 'KC_P7', keys: 'num_7'},
        {name: '8', code: 'KC_P8', keys: 'num_8'},
        {name: '9', code: 'KC_P9', keys: 'num_9'},
        {name: '+', code: 'KC_PPLS', keys: 'num_add'},
        {
          name: 'Locking Caps Lock',
          code: 'KC_LCAP',
          keys: 'caps_lock',
          width: 1750
        },
        {name: 'Caps Lock', code: 'KC_CAPS', keys: 'caps_lock', width: 1750},
        {name: 'a', code: 'KC_A', keys: 'a'},
        {name: 's', code: 'KC_S', keys: 's'},
        {name: 'd', code: 'KC_D', keys: 'd'},
        {name: 'f', code: 'KC_F', keys: 'f'},
        {name: 'g', code: 'KC_G', keys: 'g'},
        {name: 'h', code: 'KC_H', keys: 'h'},
        {name: 'j', code: 'KC_J', keys: 'j'},
        {name: 'k', code: 'KC_K', keys: 'k'},
        {name: 'l', code: 'KC_L', keys: 'l'},
        {name: ':\n;', code: 'KC_SCLN', keys: ';'},
        {name: '"\n\'', code: 'KC_QUOT', keys: "'"},
        {name: 'Enter', code: 'KC_ENT', keys: 'enter', width: 2250},
        {name: '4', code: 'KC_P4', keys: 'num_4'},
        {name: '5', code: 'KC_P5', keys: 'num_5'},
        {name: '6', code: 'KC_P6', keys: 'num_6'},
        {name: ',', code: 'KC_PCMM'},
        {
          name: 'Left Shift',
          code: 'KC_LSFT',
          keys: 'shift',
          width: 2250,
          shortName: 'LShft'
        },
        {name: 'z', code: 'KC_Z', keys: 'z'},
        {name: 'x', code: 'KC_X', keys: 'x'},
        {name: 'c', code: 'KC_C', keys: 'c'},
        {name: 'v', code: 'KC_V', keys: 'v'},
        {name: 'b', code: 'KC_B', keys: 'b'},
        {name: 'n', code: 'KC_N', keys: 'n'},
        {name: 'm', code: 'KC_M', keys: 'm'},
        {name: '<\n,', code: 'KC_COMM', keys: ','},
        {name: '>\n.', code: 'KC_DOT', keys: '.'},
        {name: '?\n/', code: 'KC_SLSH', keys: '/'},
        {name: 'Right Shift', code: 'KC_RSFT', width: 2750, shortName: 'RShft'},
        {name: 'Up', code: 'KC_UP', keys: 'up', shortName: '↑'},
        {name: '1', code: 'KC_P1', keys: 'num_1'},
        {name: '2', code: 'KC_P2', keys: 'num_2'},
        {name: '3', code: 'KC_P3', keys: 'num_3'},
        {name: '=', code: 'KC_PEQL'},
        {name: 'Left Ctrl', code: 'KC_LCTL', keys: 'ctrl', width: 1250},
        {
          name: 'Left OS',
          code: 'KC_LGUI',
          keys: 'cmd',
          width: 1250,
          shortName: 'LOS'
        },
        {
          name: 'Left Alt',
          code: 'KC_LALT',
          keys: 'alt',
          width: 1250,
          shortName: 'LAlt'
        },
        {name: 'Space', code: 'KC_SPC', keys: 'space', width: 6250},
        {name: 'Right Alt', code: 'KC_RALT', width: 1250, shortName: 'RAlt'},
        {name: 'Right OS', code: 'KC_RGUI', width: 1250, shortName: 'ROS'},
        {name: 'Menu', code: 'KC_APP', width: 1250, shortName: 'RApp'},
        {name: 'Right Ctrl', code: 'KC_RCTL', width: 1250, shortName: 'RCtl'},
        {name: 'Left', code: 'KC_LEFT', keys: 'left', shortName: '←'},
        {name: 'Down', code: 'KC_DOWN', keys: 'down', shortName: '↓'},
        {name: 'Right', code: 'KC_RGHT', keys: 'right', shortName: '→'},
        {name: '0', code: 'KC_P0', width: 2000, keys: 'num_0'},
        {name: '.', code: 'KC_PDOT', keys: 'num_decimal'},
        {name: 'Enter', code: 'KC_PENT', keys: 'num_enter'}
      ]
    },
    {
      label: 'Intl',
      width: 'label',
      keycodes: [
        {name: 'NUHS', code: 'KC_NUHS', title: 'Non-US # and ~'},
        {name: 'NUBS', code: 'KC_NUBS', title: 'Non-US \\ and |'},
        {name: 'Ro', code: 'KC_RO', title: 'JIS \\ and |'},
        {name: '¥', code: 'KC_JYEN', title: 'JPN Yen'},
        {name: '無変換', code: 'KC_MHEN', title: 'JIS Muhenkan'},
        {name: '漢字', code: 'KC_HANJ', title: 'Hanja'},
        {name: '한영', code: 'KC_HAEN', title: 'HanYeong'},
        {name: '変換', code: 'KC_HENK', title: 'JIS Henkan'},
        {name: 'かな', code: 'KC_KANA', title: 'JIS Katakana/Hiragana'}
      ]
    },
    {
      label: 'QMK',
      width: 'label',
      keycodes: [
        {name: '', code: 'KC_NO', title: 'Nothing'},
        {name: '▽', code: 'KC_TRNS', title: 'Pass-through'},
        {name: 'Reset', code: 'RESET', title: 'Reset the keyboard'},
        {name: 'Debug', code: 'DEBUG', title: 'Toggle debug mode'},
        {
          name: 'Any',
          code: 'text',
          type: 'text',
          title: 'Manually enter any QMK keycode'
        }
      ]
    },
    buildLayerMenu(),
    {
      label: 'Mod+_',
      width: 'label',
      detailed: '(A = Alt, C = Control, G = Windows/Command, S = Shift)',
      keycodes: [
        {name: 'LSft', code: 'LSFT(kc)', type: 'container'},
        {name: 'LCtl', code: 'LCTL(kc)', type: 'container'},
        {name: 'LAlt', code: 'LALT(kc)', type: 'container'},
        {name: 'LGui', code: 'LGUI(kc)', type: 'container'},
        {name: 'RSft', code: 'RSFT(kc)', type: 'container'},
        {name: 'RCtl', code: 'RCTL(kc)', type: 'container'},
        {name: 'RAlt', code: 'RALT(kc)', type: 'container'},
        {name: 'RGui', code: 'RGUI(kc)', type: 'container'},
        {
          name: 'Hyper',
          code: 'HYPR(kc)',
          type: 'container',
          title: 'LCTL + LSFT + LALT + LGUI'
        },
        {
          name: 'Meh',
          code: 'MEH(kc)',
          type: 'container',
          title: 'LCTL + LSFT + LALT'
        },
        {
          name: 'LCAG',
          code: 'LCAG(kc)',
          type: 'container',
          title: 'LCTL + LALT + LGUI'
        },
        {
          name: 'ALTG',
          code: 'ALTG(kc)',
          type: 'container',
          title: 'RCTL + RALT'
        },
        {
          name: 'SGUI',
          code: 'SCMD(kc)',
          type: 'container',
          title: 'LGUI + LSFT'
        },
        {name: 'LCA', code: 'LCA(kc)', type: 'container', title: 'LCTL + LALT'},
        {
          name: 'LSft_T',
          code: 'LSFT_T(kc)',
          type: 'container',
          title: 'Shift when held, kc when tapped'
        },
        {
          name: 'LCtl_T',
          code: 'LCTL_T(kc)',
          type: 'container',
          title: 'Control when held, kc when tapped'
        },
        {
          name: 'LAlt_T',
          code: 'LALT_T(kc)',
          type: 'container',
          title: 'Alt when held, kc when tapped'
        },
        {
          name: 'LGui_T',
          code: 'LGUI_T(kc)',
          type: 'container',
          title: 'Gui when held, kc when tapped'
        },
        {
          name: 'RSft_T',
          code: 'RSFT_T(kc)',
          type: 'container',
          title: 'Shift when held, kc when tapped'
        },
        {
          name: 'RCtl_T',
          code: 'RCTL_T(kc)',
          type: 'container',
          title: 'Control when held, kc when tapped'
        },
        {
          name: 'RAlt_T',
          code: 'RALT_T(kc)',
          type: 'container',
          title: 'Alt when held, kc when tapped'
        },
        {
          name: 'RGui_T',
          code: 'RGUI_T(kc)',
          type: 'container',
          title: 'Gui when held, kc when tapped'
        },
        {
          name: 'CS_T',
          code: 'C_S_T(kc)',
          type: 'container',
          title: 'Control + Shift when held, kc when tapped'
        },
        {
          name: 'All_T',
          code: 'ALL_T(kc)',
          type: 'container',
          title: 'LCTL + LSFT + LALT + LGUI when held, kc when tapped'
        },
        {
          name: 'Meh_T',
          code: 'MEH_T(kc)',
          type: 'container',
          title: 'LCTL + LSFT + LALT when held, kc when tapped'
        },
        {
          name: 'LCAG_T',
          code: 'LCAG_T(kc)',
          type: 'container',
          title: 'LCTL + LALT + LGUI when held, kc when tapped'
        },
        {
          name: 'RCAG_T',
          code: 'RCAG_T(kc)',
          type: 'container',
          title: 'RCTL + RALT + RGUI when held, kc when tapped'
        },
        {
          name: 'SGUI_T',
          code: 'SCMD_T(kc)',
          type: 'container',
          title: 'LGUI + LSFT when held, kc when tapped'
        },
        {
          name: 'LCA_T',
          code: 'LCA_T(kc)',
          type: 'container',
          title: 'LCTL + LALT when held, kc when tapped'
        }
      ]
    },
    {
      label: 'Special',
      width: 'label',
      keycodes: [
        {
          name: 'Esc/~',
          code: 'KC_GESC',
          title: 'Esc normally, but ~ when shift/gui is pressed'
        },
        {
          name: 'LS/(',
          code: 'KC_LSPO',
          title: 'Left shift when held, ( when tapped'
        },
        {
          name: 'RS/)',
          code: 'KC_RSPC',
          title: 'Right shift when held, ) when tapped'
        }
      ]
    },
    {
      label: 'symbols',
      width: 'label',
      keycodes: [
        {name: '~', code: 'KC_TILD', keys: '`'},
        {name: '!', code: 'KC_EXLM', keys: '!'},
        {name: '@', code: 'KC_AT', keys: '@'},
        {name: '#', code: 'KC_HASH', keys: '#'},
        {name: '$', code: 'KC_DLR', keys: '$'},
        {name: '%', code: 'KC_PERC', keys: '%'},
        {name: '^', code: 'KC_CIRC', keys: '^'},
        {name: '&', code: 'KC_AMPR', keys: '&'},
        {name: '*', code: 'KC_ASTR', keys: '*'},
        {name: '(', code: 'KC_LPRN', keys: '('},
        {name: ')', code: 'KC_RPRN', keys: ')'},
        {name: '_', code: 'KC_UNDS', keys: '_'},
        {name: '+', code: 'KC_PLUS', keys: '+'},
        {name: '{', code: 'KC_LCBR', keys: '{'},
        {name: '}', code: 'KC_RCBR', keys: '}'},
        {name: '<', code: 'KC_LT', keys: '<'},
        {name: '>', code: 'KC_GT', keys: '>'},
        {name: ':', code: 'KC_COLN', keys: ':'},
        {name: '|', code: 'KC_PIPE', keys: '|'},
        {name: '?', code: 'KC_QUES', keys: '?'},
        {name: '"', code: 'KC_DQUO', keys: '"'}
      ]
    },
    {
      label: 'App',
      width: 'label',
      keycodes: [
        {name: 'Power', code: 'KC_PWR'},
        {name: 'Sleep', code: 'KC_SLEP'},
        {name: 'Wake', code: 'KC_WAKE'},
        {name: 'Calc', code: 'KC_CALC'},
        {name: 'Mail', code: 'KC_MAIL'},
        {name: 'Help', code: 'KC_HELP'},
        {name: 'Stop', code: 'KC_STOP'},
        {name: 'Alt Erase', code: 'KC_ERAS'},
        {name: 'Again', code: 'KC_AGAIN'},
        {name: 'Menu', code: 'KC_MENU'},
        {name: 'Undo', code: 'KC_UNDO'},
        {name: 'Select', code: 'KC_SELECT'},
        {name: 'Exec', code: 'KC_EXECUTE'},
        {name: 'Cut', code: 'KC_CUT'},
        {name: 'Copy', code: 'KC_COPY'},
        {name: 'Paste', code: 'KC_PASTE'},
        {name: 'Find', code: 'KC_FIND'},
        {name: 'My Comp', code: 'KC_MYCM'}
      ]
    },
    {
      label: 'Magic',
      width: 'label',
      keycodes: [
        {name: 'Swap C/Caps', code: 'MAGIC_SWAP_CONTROL_CAPSLOCK'},
        {name: 'Caps>C', code: 'MAGIC_CAPSLOCK_TO_CONTROL'},
        {name: 'Swap LA/LO', code: 'MAGIC_SWAP_LALT_LGUI'},
        {name: 'Swap RA/RO', code: 'MAGIC_SWAP_RALT_RGUI'},
        {name: 'No O', code: 'MAGIC_NO_GUI'},
        {name: 'Swap `/Esc', code: 'MAGIC_SWAP_GRAVE_ESC'},
        {name: 'Swap \\/BS', code: 'MAGIC_SWAP_BACKSLASH_BACKSPACE'},
        {name: 'NKRO', code: 'MAGIC_HOST_NKRO'},
        {name: 'Swap A/O', code: 'MAGIC_SWAP_ALT_GUI'},
        {name: 'Rev C/Caps', code: 'MAGIC_UNSWAP_CONTROL_CAPSLOCK'},
        {name: 'Rev Caps>C', code: 'MAGIC_UNCAPSLOCK_TO_CONTROL'},
        {name: 'Rev LA/LO', code: 'MAGIC_UNSWAP_LALT_LGUI'},
        {name: 'Rev RA/RO', code: 'MAGIC_UNSWAP_RALT_RGUI'},
        {name: 'Rev No O', code: 'MAGIC_UNNO_GUI'},
        {name: 'Rev `/Esc', code: 'MAGIC_UNSWAP_GRAVE_ESC'},
        {name: 'Rev \\/BS', code: 'MAGIC_UNSWAP_BACKSLASH_BACKSPACE'},
        {name: 'Rev NKRO', code: 'MAGIC_UNHOST_NKRO'},
        {name: 'Rev A/O', code: 'MAGIC_UNSWAP_ALT_GUI'},
        {name: 'Togg NKRO', code: 'MAGIC_TOGGLE_NKRO'}
      ]
    },
    {
      label: 'Lighting',
      width: 'label',
      keycodes: [
        {name: 'BL Toggle', code: 'BL_TOGG'},
        {name: 'BL +', code: 'BL_INC'},
        {name: 'BL -', code: 'BL_DEC'},
        {name: 'BL Cycle', code: 'BL_STEP'},
        {name: 'RGB Toggle', code: 'RGB_TOG'},
        {name: 'RGB Mode +', code: 'RGB_MOD'},
        {name: 'RGB Mode -', code: 'RGB_RMOD'},
        {name: 'Hue +', code: 'RGB_HUI'},
        {name: 'Hue -', code: 'RGB_HUD'},
        {name: 'Sat +', code: 'RGB_SAI'},
        {name: 'Sat -', code: 'RGB_SAD'},
        {name: 'Bright +', code: 'RGB_VAI'},
        {name: 'Bright -', code: 'RGB_VAD'},
        {name: 'Effect +', code: 'RGB_SPI'},
        {name: 'Effect -', code: 'RGB_SPD'},
        {name: 'RGB Mode P', code: 'RGB_M_P', title: 'Plain'},
        {name: 'RGB Mode B', code: 'RGB_M_B', title: 'Breathe'},
        {name: 'RGB Mode R', code: 'RGB_M_R', title: 'Rainbow'},
        {name: 'RGB Mode SW', code: 'RGB_M_SW', title: 'Swirl'},
        {name: 'RGB Mode SN', code: 'RGB_M_SN', title: 'Snake'},
        {name: 'RGB Mode K', code: 'RGB_M_K', title: 'Knight'},
        {name: 'RGB Mode X', code: 'RGB_M_X', title: 'Xmas'},
        {name: 'RGB Mode G', code: 'RGB_M_G', title: 'Gradient'}
      ]
    },
    {
      label: 'Media',
      width: 'label',
      keycodes: [
        {name: 'Previous', code: 'KC_MPRV', title: 'Media Previous'},
        {name: 'Select', code: 'KC_MSEL', title: 'Media Select'},
        {name: 'Eject', code: 'KC_EJCT', title: 'Media Eject'},
        {name: 'Next', code: 'KC_MNXT', title: 'Media Next'},
        {name: 'Mute', code: 'KC_MUTE', title: 'Mute Audio'},
        {name: 'Vol -', code: 'KC_VOLD', title: 'Volume Down'},
        {name: 'Vol +', code: 'KC_VOLU', title: 'Volume Up'},
        {name: 'Media Stop', code: 'KC_MSTP', title: 'Media Stop'},
        {name: 'Play', code: 'KC_MPLY', title: 'Play/Pause'},
        {name: 'Rewind', code: 'KC_MRWD', title: 'Rewind'},
        {name: 'Fast Forward', code: 'KC_MFFD', title: 'Fast Forward'}
      ]
    }
  ];
}
