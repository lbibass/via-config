import {M6A, M6B, HHKB, LAYOUT_zeal60_all, LAYOUT_zeal65_split_bs, parseKLERaw} from './kle-parser';

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
    0xfeed6060,
    0xfeed6065,
    0x5241006a,
    0x5241006b,
    0x5241060a
  ];
  // JS bitwise operations is only 32-bit so we lose numbers if we shift too high
  const vendorProductId = vendorId * 65536 + productId;
  return VALID_VENDOR_PRODUCT_IDS.includes(vendorProductId);
}

const hid_device = {
  [0x5241006a]: {name: 'M6A', layout: M6A, rows: 2, cols: 3},
  [0x5241006b]: {name: 'M6B', layout: M6B, rows: 2, cols: 3},
  [0xfeed6065]: {name: 'ZEAL65', layout: LAYOUT_zeal65_split_bs, rows: 5, cols: 15},
  [0xfeed6060]: {name: 'ZEAL60', layout: LAYOUT_zeal60_all, rows: 5, cols: 14},
  [0x5241060a]: {name: 'M60A', layout: HHKB, rows: 5, cols: 14}
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
