// @flow
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

export const DEVICE_META_MAP: DeviceMetaMap = {
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
  return DEVICE_META_MAP[vendorProductId];
}

export function getLayoutFromDevice(device: Device) {
  const kb = getKeyboardFromDevice(device);
  return parseKLERaw(kb.layout);
}
