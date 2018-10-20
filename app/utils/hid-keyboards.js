import {
  parseKLERaw,
  LAYOUT_M6_A,
  LAYOUT_M6_B,
  LAYOUT_M60_A,
  LAYOUT_U80_A,
  LAYOUT_zeal60_all,
  LAYOUT_zeal65_split_bs,
  LAYOUT_zeal65_split_bs_olivia,
  LAYOUT_KOYU,
  LAYOUT_WT60_A,
  LAYOUT_WT65_A,
  LAYOUT_WT80_A
} from './kle-parser';

const HID = require('node-hid');
const IS_OSX = require('os').platform() === 'darwin';

function scanDevices() {
  const devices = HID.devices();
  return devices;
}

function isValidInterface(device) {
  return IS_OSX ? isValidInterfaceOSX(device) : isValidInterfaceNonOSX(device);
}

function isValidInterfaceNonOSX(device) {
  const VALID_INTERFACE_IDS = [0x0001];
  return VALID_INTERFACE_IDS.includes(device.interface);
}

function isValidInterfaceOSX({usage, usagePage}) {
  const VALID_USAGE_IDS = [0x0061];
  const VALID_USAGE_PAGE_IDS = [0xff60];
  return (
    VALID_USAGE_IDS.includes(usage) && VALID_USAGE_PAGE_IDS.includes(usagePage)
  );
}

function isValidVendorProduct({productId, vendorId}) {
  const VALID_VENDOR_PRODUCT_IDS = [
    0x5241006a, // RAMA WORKS M6-A
    0x5241006b, // RAMA WORKS M6-B
    0x5241060a, // RAMA WORKS M60-A
    0x5241080a, // RAMA WORKS U80-A
    0xfeed6060, // Zeal60
    0xfeed6065, // Zeal65
    0x6582060a, // WT60-A
    0x6582065a, // WT65-A
    0x6582080a // WT80-A
  ];
  // JS bitwise operations is only 32-bit so we lose numbers if we shift too high
  const vendorProductId = vendorId * 65536 + productId;
  return VALID_VENDOR_PRODUCT_IDS.includes(vendorProductId);
}

const hid_device = {
  [0x5241006a]: {
    name: 'RAMA WORKS M6-A',
    layout: LAYOUT_M6_A,
    lights: false
  },
  [0x5241006b]: {
    name: 'RAMA WORKS M6-B',
    layout: LAYOUT_M6_B,
    lights: true
  },
  [0x5241060a]: {
    name: 'RAMA WORKS M60-A',
    layout: LAYOUT_M60_A,
    lights: true
  },
  [0x6582080a]: {
    name: 'RAMA WORKS U80-A',
    layout: LAYOUT_U80_A,
    lights: true
  },
  [0xfeed6060]: {
    name: 'ZEAL60',
    layout: LAYOUT_zeal60_all,
    lights: true
  },
  [0xfeed6065]: {
    name: 'ZEAL65',
    layout: LAYOUT_zeal65_split_bs_olivia,
    lights: true
  },
  [0x6582060a]: {
    name: 'WT60-A',
    layout: LAYOUT_WT60_A,
    lights: false
  },
  [0x6582065a]: {
    name: 'WT65-A',
    layout: LAYOUT_WT65_A,
    lights: false
  },
  [0x6582080a]: {
    name: 'WT80-A',
    layout: LAYOUT_WT80_A,
    lights: false
  }
};

export function getKeyboardFromDevice({productId, vendorId}) {
  const vendorProductId = vendorId * 65536 + productId;
  return hid_device[vendorProductId];
}

export function getLayoutFromDevice({productId, vendorId}) {
  const device = getKeyboardFromDevice({productId, vendorId});
  if (device) {
    return parseKLERaw(device.layout);
  }
}

export function getKeyboards() {
  const usbDevices = scanDevices();
  return usbDevices.filter(device => {
    const validVendorProduct = isValidVendorProduct(device);
    const validInterface = isValidInterface(device);
    return validVendorProduct && validInterface;
  });
}
