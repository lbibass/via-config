// @flow
import type {ParsedKLE} from './kle-parser';
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
  LAYOUT_WT75_A,
  LAYOUT_WT80_A,
  LAYOUT_AEGIS,
  LAYOUT_STANDARD_60_ANSI,
  LAYOUT_STANDARD_60_ISO,
  LAYOUT_STANDARD_60_HHKB,
  LAYOUT_PLAIN60,
  LAYOUT_268_2,
  LAYOUT_IRIS,
  LAYOUT_SNAGPAD,
  LAYOUT_AANZEE,
  LAYOUT_LUNAR,
  LAYOUT_G60
} from './kle-parser';
import {
  parseLayout,
  MATRIX_M6_A,
  MATRIX_M6_B,
  MATRIX_M10_B,
  MATRIX_M60_A,
  MATRIX_KOYU,
  MATRIX_WT80_A_no_splits,
  MATRIX_ZEAL60,
  MATRIX_ZEAL65,
  MATRIX_WT8_A,
  MATRIX_WT60_A,
  MATRIX_WT65_A,
  MATRIX_WT75_A,
  MATRIX_AEGIS,
  MATRIX_STANDARD_60_ISO,
  MATRIX_STANDARD_60_ANSI,
  MATRIX_STANDARD_60_HHKB,
  MATRIX_IRIS,
  MATRIX_PLAIN60,
  MATRIX_268_2,
  MATRIX_SNAGPAD,
  MATRIX_AANZEE,
  MATRIX_LUNAR,
  MATRIX_G60
} from './layout-parser';
import KEYBOARDS from '../keyboards';

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
  matrixLayout: string,
  lights: boolean,
  overrideMatrixIndexing?: boolean,
  customConfig?: any,
  vendorProductId?: number
};

type Return_<R, Fn: () => R> = R;
type Return<T> = Return_<*, T>;

export type ParsedMatrix = any;
export type CompiledDeviceMeta = DeviceMeta & {
  compiledLayout: ParsedKLE,
  compiledMatrixLayout: Return<typeof parseLayout>
};

export type DeviceMetaMap = {[key: number]: DeviceMeta};
export type CompiledDeviceMetaMap = {[key: number]: CompiledDeviceMeta};

const LEGACY_DEVICE_META_MAP: DeviceMetaMap = {
  0x5241006a: {
    name: 'RAMA WORKS M6-A',
    layout: LAYOUT_M6_A,
    matrixLayout: MATRIX_M6_A,
    lights: false
  },
  0x5241006b: {
    name: 'RAMA WORKS M6-B',
    layout: LAYOUT_M6_B,
    matrixLayout: MATRIX_M6_B,
    lights: true
  },
  0x524100ab: {
    name: 'RAMA WORKS M10-B',
    layout: LAYOUT_M10_B,
    matrixLayout: MATRIX_M10_B,
    lights: false
  },
  0x5241060a: {
    name: 'RAMA WORKS M60-A',
    layout: LAYOUT_M60_A,
    matrixLayout: MATRIX_M60_A,
    lights: true
  },
  0x52414b59: {
    name: 'RAMA WORKS KOYU',
    layout: LAYOUT_KOYU,
    matrixLayout: MATRIX_KOYU,
    lights: true
  },
  0x6582080a: {
    name: 'RAMA WORKS U80-A',
    layout: LAYOUT_U80_A,
    matrixLayout: MATRIX_WT80_A_no_splits,
    lights: true
  },
  0x5a450060: {
    name: 'ZEAL60',
    layout: LAYOUT_zeal60_all,
    matrixLayout: MATRIX_ZEAL60,
    lights: true
  },
  0x5a450065: {
    name: 'ZEAL65',
    layout: LAYOUT_zeal65_split_bs_olivia,
    matrixLayout: MATRIX_ZEAL65,
    lights: true
  },
  0x6582008a: {
    name: 'WT8-A',
    layout: LAYOUT_WT8_A,
    matrixLayout: MATRIX_WT8_A,
    lights: false
  },
  0x6582060a: {
    name: 'WT60-A',
    layout: LAYOUT_WT60_A,
    matrixLayout: MATRIX_WT60_A,
    lights: false
  },
  0x6582065a: {
    name: 'WT65-A',
    layout: LAYOUT_WT65_A,
    matrixLayout: MATRIX_WT65_A,
    lights: false
  },
  0x6582075a: {
    name: 'WT75-A',
    layout: LAYOUT_WT75_A,
    matrixLayout: MATRIX_WT75_A,
    lights: false
  },
  0x6582080a: {
    name: 'WT80-A',
    layout: LAYOUT_WT80_A,
    matrixLayout: MATRIX_WT80_A_no_splits,
    lights: false
  },
  0x41450807: {
    name: 'AEGIS',
    layout: LAYOUT_AEGIS,
    matrixLayout: MATRIX_AEGIS,
    lights: false,
    overrideMatrixIndexing: true
  },
  0x89684853: {
    name: 'HS60 V2 ISO',
    layout: LAYOUT_STANDARD_60_ISO,
    matrixLayout: MATRIX_STANDARD_60_ISO,
    lights: true
  },
  0x89684854: {
    name: 'HS60 V2 ANSI',
    layout: LAYOUT_STANDARD_60_ANSI,
    matrixLayout: MATRIX_STANDARD_60_ANSI,
    lights: true
  },
  0x89684855: {
    name: 'HS60 V2 HHKB',
    layout: LAYOUT_STANDARD_60_HHKB,
    matrixLayout: MATRIX_STANDARD_60_HHKB,
    lights: true
  },
  0x4e580044: {
    name: 'Noxary 268.2',
    layout: LAYOUT_268_2,
    matrixLayout: MATRIX_268_2,
    lights: false
  },
  0xcb101256: {
    name: 'IRIS',
    layout: LAYOUT_IRIS,
    matrixLayout: MATRIX_IRIS,
    lights: false
  },
  0x47050160: {
    name: 'PLAIN60',
    layout: LAYOUT_PLAIN60,
    matrixLayout: MATRIX_PLAIN60,
    lights: false
  },
  0x44435350: {
    name: 'Snagpad',
    layout: LAYOUT_SNAGPAD,
    matrixLayout: MATRIX_SNAGPAD,
    lights: false
  },
  0x21ffaa01: {
    name: 'aanzee',
    layout: LAYOUT_AANZEE,
    matrixLayout: MATRIX_AANZEE,
    lights: false
  },
  0xa1030001: {
    name: 'Lunar',
    layout: LAYOUT_LUNAR,
    matrixLayout: MATRIX_LUNAR,
    lights: false
  },
  0x65826080: {
    name: 'BIOI G60',
    layout: LAYOUT_G60,
    matrixLayout: MATRIX_G60,
    lights: false
  }
};

export const DEVICE_META_MAP: DeviceMetaMap = {
  ...LEGACY_DEVICE_META_MAP,
  ...KEYBOARDS.reduce(
    (accum, deviceMeta) => ({
      ...accum,
      [deviceMeta.vendorProductId]: deviceMeta
    }),
    {}
  )
};

const COMPILED_DEVICE_META_MAP: CompiledDeviceMetaMap = Object.entries(
  DEVICE_META_MAP
).reduce(
  (p, [k, v]: [string, *]) => ({
    ...p,
    [k]: {
      ...v,
      compiledLayout: parseKLERaw(v.layout),
      compiledMatrixLayout: parseLayout(v.matrixLayout)
    }
  }),
  {}
);

export function getKeyboardFromDevice({
  productId,
  vendorId
}: Device): CompiledDeviceMeta {
  const vendorProductId = vendorId * 65536 + productId;
  return COMPILED_DEVICE_META_MAP[vendorProductId];
}

export function getLayoutFromDevice(device: Device) {
  const kb = getKeyboardFromDevice(device);
  return kb.compiledLayout;
}

export function getMatrixLayoutFromDevice(device: Device) {
  const kb = getKeyboardFromDevice(device);
  return kb.compiledMatrixLayout;
}
