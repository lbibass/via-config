// @flow
import {KeyboardAPI} from './keyboard-api';

export type Device = {
  productId: number,
  vendorId: number,
  interface: number,
  usage?: number,
  usagePage?: number,
  path: string
};

export type DeviceMeta = {
  name: string,
  layout: string,
  lights: boolean
};

export type DeviceMetaMap = {[key: number]: DeviceMeta};

import {
  parseKLERaw,
  LAYOUT_M6_A,
  LAYOUT_M6_B,
  LAYOUT_M10_B,
  LAYOUT_M60_A,
  LAYOUT_U80_A,
  LAYOUT_zeal60_all,
  LAYOUT_zeal65_split_bs,
  LAYOUT_zeal65_split_bs_olivia,
  LAYOUT_KOYU,
  LAYOUT_WT8_A,
  LAYOUT_WT60_A,
  LAYOUT_WT65_A,
  LAYOUT_WT80_A,
  LAYOUT_AEGIS
} from './kle-parser';

const HID = require('node-hid');
const IS_OSX = require('os').platform() === 'darwin';

function scanDevices(): Device[] {
  const devices = HID.devices();
  return devices;
}

function isValidInterface(device: Device) {
  return IS_OSX ? isValidInterfaceOSX(device) : isValidInterfaceNonOSX(device);
}

function isValidInterfaceNonOSX(device: Device) {
  const VALID_INTERFACE_IDS = [0x0001];
  return VALID_INTERFACE_IDS.includes(device.interface);
}

function isValidInterfaceOSX({usage, usagePage}: Device) {
  const VALID_USAGE_IDS = [0x0061];
  const VALID_USAGE_PAGE_IDS = [0xff60];
  return (
    VALID_USAGE_IDS.includes(usage) && VALID_USAGE_PAGE_IDS.includes(usagePage)
  );
}

function isValidVendorProduct({productId, vendorId}: Device) {
  const VALID_VENDOR_PRODUCT_IDS = [
    0x5241006a, // RAMA WORKS M6-A
    0x5241006b, // RAMA WORKS M6-B
    0x524100ab, // RAMA WORKS M10-B
    0x5241060a, // RAMA WORKS M60-A
    0x52414b59, // RAMA WORKS KOYU
    0x5241080a, // RAMA WORKS U80-A
    0x5a450060, // Zeal60
    0x5a450065, // Zeal65
    0x6582008a, // WT8-A
    0x6582060a, // WT60-A
    0x6582065a, // WT65-A
    0x6582080a, // WT80-A
    0x41450807 // AEGIS
  ];
  // JS bitwise operations is only 32-bit so we lose numbers if we shift too high
  const vendorProductId = vendorId * 65536 + productId;
  return VALID_VENDOR_PRODUCT_IDS.includes(vendorProductId);
}

const hid_device: DeviceMetaMap = {
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
  [0x524100ab]: {
    name: 'RAMA WORKS M10-B',
    layout: LAYOUT_M10_B,
    lights: false
  },
  [0x5241060a]: {
    name: 'RAMA WORKS M60-A',
    layout: LAYOUT_M60_A,
    lights: true
  },
  [0x52414b59]: {
    name: 'RAMA WORKS KOYU',
    layout: LAYOUT_KOYU,
    lights: true
  },
  [0x6582080a]: {
    name: 'RAMA WORKS U80-A',
    layout: LAYOUT_U80_A,
    lights: true
  },
  [0x5a450060]: {
    name: 'ZEAL60',
    layout: LAYOUT_zeal60_all,
    lights: true
  },
  [0x5a450065]: {
    name: 'ZEAL65',
    layout: LAYOUT_zeal65_split_bs_olivia,
    lights: true
  },
  [0x6582008a]: {
    name: 'WT8-A',
    layout: LAYOUT_WT8_A,
    lights: false
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
  },
  [0x41450807]: {
    name: 'AEGIS',
    layout: LAYOUT_AEGIS,
    lights: false
  }
};

export function getKeyboardFromDevice({
  productId,
  vendorId
}: Device): DeviceMeta {
  const vendorProductId = vendorId * 65536 + productId;
  return hid_device[vendorProductId];
}

export function getLayoutFromDevice(device: Device) {
  const kb = getKeyboardFromDevice(device);
  return parseKLERaw(kb.layout);
}

export const canConnect = (device: Device) => {
  try {
    new KeyboardAPI(device);
    return true;
  } catch (e) {
    console.error('Skipped ', device, e);
    return false;
  }
};

export function getKeyboards(): Device[] {
  const usbDevices = scanDevices();
  return usbDevices.filter((device: Device) => {
    const validVendorProduct = isValidVendorProduct(device);
    const validInterface = isValidInterface(device);
    // attempt connection
    return validVendorProduct && validInterface && canConnect(device);
  });
}
