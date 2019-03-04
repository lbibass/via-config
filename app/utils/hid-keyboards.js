// @flow
import {canConnect} from './keyboard-api';
import {DEVICE_META_MAP} from './device-meta';
import type {Device} from './device-meta';

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
  // JS bitwise operations is only 32-bit so we lose numbers if we shift too high
  const vendorProductId = vendorId * 65536 + productId;
  return DEVICE_META_MAP[vendorProductId] !== undefined;
}

export function getKeyboards(): Device[] {
  const usbDevices = scanDevices();
  return usbDevices.filter((device: Device) => {
    const validVendorProduct = isValidVendorProduct(device);
    const validInterface = isValidInterface(device);
    // attempt connection
    return validVendorProduct && validInterface && canConnect(device);
  });
}
