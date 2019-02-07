// @flow
import {canConnect} from './keyboard-api';
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
    0x41450807, // AEGIS
    0x89684853, // HS60 ISO
    0x89684854, // HS60 ANSI
    0x89684855, // HS60 HHKB
    0x47050160, // Plain60
    0x4e580044, // 268.2
    0xcb101256, // Iris
    0x44435350, // Snagpad
    0x21FFAA01, // aanzee
    0xA1030001, // Lunar
    0xCA0457F5, // Satisfaction75
  ];
  // JS bitwise operations is only 32-bit so we lose numbers if we shift too high
  const vendorProductId = vendorId * 65536 + productId;
  return VALID_VENDOR_PRODUCT_IDS.includes(vendorProductId);
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
