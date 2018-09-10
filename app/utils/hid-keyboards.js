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

function isValidVendor({vendorId}) {
  const VALID_VENDOR_IDS = [0xfeed];
  return VALID_VENDOR_IDS.includes(vendorId);
}

function isValidProduct({productId}) {
  // Currently allows Zeal60, Zeal65
  const VALID_PRODUCT_IDS = [0x6065, 0x6060];
  return VALID_PRODUCT_IDS.includes(productId);
}

export function getKeyboards() {
  const usbDevices = scanDevices();
  return usbDevices.filter(device => {
    const validVendor = isValidVendor(device);
    const validProduct = isValidProduct(device);
    const validInterface = isValidInterface(device);
    return validVendor && validProduct && validInterface;
  });
}
