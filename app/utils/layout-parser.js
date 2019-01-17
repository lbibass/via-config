export const MATRIX_M6_A = `
#define LAYOUT(                         \
    K00, K01, K02, K03, K04, K05)       \
    {                                   \
        {K00, K01, K02, K03, K04, K05}, \
    }
`;

export const MATRIX_M6_B = `
#define LAYOUT(                         \
    K00, K01, K02, K03, K04, K05)       \
    {                                   \
        {K00, K01, K02, K03, K04, K05}, \
    }
`;

export const MATRIX_M10_B = `
#define LAYOUT(                         \
  K00, K01, K02, K03, K04, K05, K06, K07, K08, K09 )       \
  {                                   \
      {K00, K01, K02, K03, K04, K05, K06, K07, K08, K09}, \
  }
`;

export const MATRIX_M60_A = `
#define LAYOUT_60_hhkb( \
    K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D, K2D, \
    K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K1D, \
    K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C,      \
    K30,      K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C, K3D, \
         K41, K42,                     K47,                K4B, K4C       \
) { \
    { K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D }, \
    { K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K1D }, \
    { K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C, K2D }, \
    { K30, XXX, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C, K3D }, \
    { XXX, K41, K42, XXX, XXX, XXX, XXX, K47, XXX, XXX, XXX, K4B, K4C, XXX }  \
}
`;

export const MATRIX_KOYU = `
#define LAYOUT_all( \
    K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, K013, K213, K014, \
    K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113,       K114, \
    K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212,             K214, \
    K300, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312,             K313, K314, \
    K400, K401, K402,                   K407,                         K411,       K412, K413, K414  \
) { \
    { K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, K013, K014 }, \
    { K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113, K114 }, \
    { K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212, K213, K214 }, \
    { K300, ____, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312, K313, K314 }, \
    { K400, K401, K402, ____, ____, ____, ____, K407, ____, ____, ____, K411, K412, K413, K414 }  \
}
`;

export const MATRIX_ZEAL60 = `
#define LAYOUT_60_all( \
    K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D, K2D, \
    K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K1D, \
    K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C,      \
    K30, K31, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C, K3D, \
    K40, K41, K42,                     K47,           K4A, K4B, K4C, K4D  \
) { \
    { K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D }, \
    { K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K1D }, \
    { K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C, K2D }, \
    { K30, K31, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C, K3D }, \
    { K40, K41, K42, XXX, XXX, XXX, XXX, K47, XXX, XXX, K4A, K4B, K4C, K4D }  \
}
`;

export const MATRIX_ZEAL65 = `
#define LAYOUT_65_split_bs( \
    K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D, K2D, K0E, \
    K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K1D, K1E, \
    K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C,      K2E, \
    K30,      K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C, K3D, K3E, \
    K40, K41,                          K47,           K4A, K4B, K4C, K4D, K4E  \
) { \
    { K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D, K0E }, \
    { K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K1D, K1E }, \
    { K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C, K2D, K2E }, \
    { K30, XXX, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C, K3D, K3E }, \
    { K40, K41, XXX, XXX, XXX, XXX, XXX, K47, XXX, XXX, K4A, K4B, K4C, K4D, K4E }  \
}
`;

export const MATRIX_WT8_A = `
#define LAYOUT(                                   \
  K00, K01, K02, K03, K04, K05, K06, K07 )       \
  {                                              \
      {K00, K01, K02, K03, K04, K05, K06, K07 }, \
  }
`;

export const MATRIX_WT60_A = `
#define LAYOUT_60_ansi_split_bs_rshift( \
  K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, K013, K213, \
  K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113,       \
  K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212,             \
  K300,       K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312, K313,       \
  K400, K401, K402,                   K406,                   K410, K411, K412, K413        \
) { \
  { K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, K013 }, \
  { K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113 }, \
  { K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212, K213 }, \
  { K300, ____, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312, K313 }, \
  { K400, K401, K402, ____, ____, ____, K406, ____, ____, ____, K410, K411, K412, K413 }  \
}
`;

export const MATRIX_WT65_A = `
#define LAYOUT_all( \
  K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, K013, K213, K014, \
  K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113,       K114, \
  K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212,             K214, \
  K300, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312,             K313, K314, \
  K400, K401, K402,                   K406,                   K410, K411,       K412, K413, K414  \
) { \
  { K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, K013, K014 }, \
  { K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113, K114 }, \
  { K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212, K213, K214 }, \
  { K300, ____, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312, K313, K314 }, \
  { K400, K401, K402, ____, ____, ____, K406, ____, ____, ____, K410, K411, K412, K413, K414 }  \
}
`;

export const MATRIX_WT80_A_all = `
#define LAYOUT_all( \
    K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012,             K014, K015, K016, \
    K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113, K313, K114, K115, K116, \
    K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212, K213,       K214, K215, K216, \
    K300, K301, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312,                               \
    K400,       K402, K403, K404, K405, K406, K407, K408, K409, K410, K411, K412, K413,             K415,       \
    K500, K501, K502,                   K506,                   K510, K511, K512, K513,       K514, K515, K516  \
) { \
    { K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, ____, K014, K015, K016 }, \
    { K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113, K114, K115, K116 }, \
    { K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212, K213, K214, K215, K216 }, \
    { K300, K301, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312, K313, ____, ____, ____ }, \
    { K400, ____, K402, K403, K404, K405, K406, K407, K408, K409, K410, K411, K412, K413, ____, K415, ____ }, \
    { K500, K501, K502, ____, ____, ____, K506, ____, ____, ____, K510, K511, K512, K513, K514, K515, K516 }  \
}
`;

export const MATRIX_WT80_A_no_splits = `
#define LAYOUT_no_split( \
  K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012,             K014, K015, K016, \
  K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113,       K114, K115, K116, \
  K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212, K213,       K214, K215, K216, \
  K300, K301, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312,                               \
  K400,       K402, K403, K404, K405, K406, K407, K408, K409, K410, K411, K412,                   K415,       \
  K500, K501, K502,                   K506,                   K510, K511, K512, K513,       K514, K515, K516  \
) { \
  { K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, ____, K014, K015, K016 }, \
  { K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, K113, K114, K115, K116 }, \
  { K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212, K213, K214, K215, K216 }, \
  { K300, K301, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312, K313, ____, ____, ____ }, \
  { K400, ____, K402, K403, K404, K405, K406, K407, K408, K409, K410, K411, K412, K413, ____, K415, ____ }, \
  { K500, K501, K502, ____, ____, ____, K506, ____, ____, ____, K510, K511, K512, K513, K514, K515, K516 }  \
}
`;

export const MATRIX_AEGIS = `
#define LAYOUT_aegis( \
  K0000, K0100, K0001, K0101,        K0002, K0102, K0003, K0103, K0004, K0104, K0005, K0105, K0006, K0106, K0007, K0107, K0008, \
  K0200, K0300, K0201, K0301,        K0202, K0302, K0203, K0303, K0204, K0304, K0205, K0305, K0206, K0306, K0207, K0307, K0208, K0308, K0108, \
  K0400, K0500, K0401, K0501,        K0402, K0502, K0403, K0503, K0404, K0504, K0405, K0505, K0406, K0506, K0407, K0507, K0408, K0508, \
  K0600, K0700, K0601, K0701,        K0602, K0702, K0603, K0703, K0604, K0704, K0605, K0705, K0606, K0706, K0607, K0707, K0608, \
  K0800, K0900, K0801, K0901,        K0802, K0902, K0803, K0903, K0804, K0904, K0805, K0905, K0806, K0906, K0807, K0907, K0808, K0908, \
  K1000, K1100, K1001,        K1101, K1002, K1102, K1003, K1103,                      K1105,                      K1107, K1008, K1108 \
) { \
  { K0000, K0001, K0002, K0003, K0004, K0005, K0006, K0007, K0008 }, \
  { K0100, K0101, K0102, K0103, K0104, K0105, K0106, K0107, K0108 }, \
  { K0200, K0201, K0202, K0203, K0204, K0205, K0206, K0207, K0208 }, \
  { K0300, K0301, K0302, K0303, K0304, K0305, K0306, K0307, K0308 }, \
  { K0400, K0401, K0402, K0403, K0404, K0405, K0406, K0407, K0408 }, \
  { K0500, K0501, K0502, K0503, K0504, K0505, K0506, K0507, K0508 }, \
  { K0600, K0601, K0602, K0603, K0604, K0605, K0606, K0607, K0608 }, \
  { K0700, K0701, K0702, K0703, K0704, K0705, K0706, K0707, _____ }, \
  { K0800, K0801, K0802, K0803, K0804, K0805, K0806, K0807, K0808 }, \
  { K0900, K0901, K0902, K0903, K0904, K0905, K0906, K0907, K0908 }, \
  { K1000, K1001, K1002, K1003, _____, _____, _____, _____, K1008 }, \
  { K1100, K1101, K1102, K1103, _____, K1105, _____, K1107, K1108 } \
}
`;

export const MATRIX_STANDARD_60_ISO = `
#define LAYOUT_60_iso( \
    K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D, \
    K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C,      \
    K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C, K2D, \
    K30, K31, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B,      K3D, \
    K40, K41, K42,                K46,                K4A, K4B, K4C, K4D  \
) { \
    { K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D }, \
    { K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, XXX }, \
    { K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C, K2D }, \
    { K30, K31, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, XXX, K3D }, \
    { K40, K41, K42, XXX, XXX, XXX, K46, XXX, XXX, XXX, K4A, K4B, K4C, K4D }  \
}
`;

export const MATRIX_STANDARD_60_ANSI = `
#define LAYOUT_60_ansi( \
    K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D, \
    K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K2C, \
    K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B,      K2D, \
    K30,      K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B,      K3D, \
    K40, K41, K42,                K46,                K4A, K4B, K4C, K4D  \
) { \
    { K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D }, \
    { K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, XXX }, \
    { K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C, K2D }, \
    { K30, XXX, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, XXX, K3D }, \
    { K40, K41, K42, XXX, XXX, XXX, K46, XXX, XXX, XXX, K4A, K4B, K4C, K4D }  \
}
`;

export const MATRIX_STANDARD_60_HHKB = `
#define LAYOUT_60_hhkb( \
    K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D, K1D, \
    K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K2C,      \
    K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B,      K2D,      \
    K30, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C,      K3D,      \
    K40, K41, K42,                K46,                     K4B, K4C, K4D       \
) { \
    { K00, K01, K02, K03, K04, K05, K06, K07, K08, K09, K0A, K0B, K0C, K0D }, \
    { K10, K11, K12, K13, K14, K15, K16, K17, K18, K19, K1A, K1B, K1C, K1D }, \
    { K20, K21, K22, K23, K24, K25, K26, K27, K28, K29, K2A, K2B, K2C, K2D }, \
    { K30, XXX, K32, K33, K34, K35, K36, K37, K38, K39, K3A, K3B, K3C, K3D }, \
    { K40, K41, K42, XXX, XXX, XXX, K46, XXX, XXX, XXX, XXX, K4B, K4C, K4D }  \
}
;`
export const MATRIX_BNB87_ALL = `
#define LAYOUT_all( \
	K000, K001, K002, K003, K004, K005, K006, K007, K008, K009, K010, K011, K012, \
	K100, K101, K102, K103, K104, K105, K106, K107, K108, K109, K110, K111, K112, \
	K200, K201, K202, K203, K204, K205, K206, K207, K208, K209, K210, K211, K212, \
	K300, K301, K302, K303, K304, K305, K306, K307, K308, K309, K310, K311, K312, \
	K400, K401, K402, K403, K404, K405, K406, K407, K408, K409, K410, K411, K412, \
	K500, K501, K502, K503, K504, K505, K506, K507, K508, K509, K510,             \
	K600, K601, K602, K603, K604, K605, K606, K607, K608, K609, K610, K611  \
) { \
	{ K000,  K001,  K002,  K003,  K004,  K005,  K006,  K007,  K008,  K009,  K010,  K011,  K012 }, \
	{ K100,  K101,  K102,  K103,  K104,  K105,  K106,  K107,  K108,  K109,  K110,  K111,  K112 }, \
	{ K200,  K201,  K202,  K203,  K204,  K205,  K206,  K207,  K208,  K209,  K210,  K211,  K212 }, \
	{ K300,  K301,  K302,  K303,  K304,  K305,  K306,  K307,  K308,  K309,  K310,  K311,  K312 }, \
	{ K400,  K401,  K402,  K403,  K404,  K405,  K406,  K407,  K408,  K409,  K410,  K411,  K412 }, \
	{ K500,  K501,  K502,  K503,  K504,  K505,  K506,  K507,  K508,  K509,  K510,  KC_NO, KC_NO }, \
	{ K600,  K601,  K602,  K603,  K604,  K605,  K606,  K607,  K608,  K609,  K610,  K611,  KC_NO }  \
}

`;

const LS = {
  START: 1,
  DEFINE: 2,
  LAYOUT1D_START: 3,
  LAYOUT1D_END: 4,
  LAYOUT2D_START: 5,
  LAYOUT2D_ROW_START: 6,
  LAYOUT2D_COL_START: 7,
  LAYOUT2D_COL_CONTINUE: 8,
  LAYOUT2D_COL_END: 9,
  LAYOUT2D_ROW_END: 10,
  LAYOUT2D_END: 11
};

export const MatrixLayout = {
  'RAMA WORKS M6-A': parseLayout(MATRIX_M6_A),
  'RAMA WORKS M6-B': parseLayout(MATRIX_M6_B),
  'RAMA WORKS M10-B': parseLayout(MATRIX_M10_B),
  'RAMA WORKS M60-A': parseLayout(MATRIX_M60_A),
  'RAMA WORKS KOYU': parseLayout(MATRIX_KOYU),
  'RAMA WORKS U80-A': parseLayout(MATRIX_WT80_A_no_splits),
  ZEAL60: parseLayout(MATRIX_ZEAL60),
  ZEAL65: parseLayout(MATRIX_ZEAL65),
  'WT8-A': parseLayout(MATRIX_WT8_A),
  'WT60-A': parseLayout(MATRIX_WT60_A),
  'WT65-A': parseLayout(MATRIX_WT65_A),
  'WT80-A': parseLayout(MATRIX_WT80_A_no_splits),
  AEGIS: parseLayout(MATRIX_AEGIS),
  'HS60 V2 ISO': parseLayout(MATRIX_STANDARD_60_ISO),
  'HS60 V2 ANSI': parseLayout(MATRIX_STANDARD_60_ANSI),
  'HS60 V2 HHKB': parseLayout(MATRIX_STANDARD_60_HHKB)
};

function error(state, nextToken) {
  console.error('Current State', state, 'Next: ', nextToken);
}

function tokenizer(state, next) {
  const tnext = next.trim();
  const {prev, res} = state;
  // skip empty strings
  if (tnext === '') {
    return state;
  }

  if (prev === LS.START) {
    // skip
    if (tnext === '#define') {
      return {...state, prev: LS.DEFINE};
    }
  } else if (prev === LS.DEFINE) {
    const parenIdx = tnext.indexOf('(');
    const length = tnext.length;
    // If the ( is the last character of the token we're good :)
    if (parenIdx === length - 1) {
      const name = tnext.slice(0, length - 1);
      return {
        ...state,
        prev: LS.LAYOUT1D_START,
        res: {
          name,
          layout1D: [],
          layout2D: []
        }
      };
    }
  } else if (prev === LS.LAYOUT1D_START) {
    const commaIdx = tnext.indexOf(',');

    if (commaIdx === 0) {
      return tokenizer(state, tnext.slice(1));
    }

    const parenIdx = tnext.indexOf(')');
    const length = tnext.length;
    if (parenIdx === 0) {
      return tokenizer(
        {
          ...state,
          prev: LS.LAYOUT1D_END,
          res: {...res, layout2D: [[]]}
        },
        tnext.slice(1)
      );
    } else if (commaIdx === length - 1) {
      const keycode = tnext.slice(0, length - 1);
      const {layout1D} = res;
      return {
        ...state,
        prev: LS.LAYOUT1D_START,
        res: {...res, layout1D: [...layout1D, keycode]}
      };
    } else if (parenIdx === length - 1) {
      const keycode = tnext.slice(0, length - 1);
      const {layout1D} = res;
      return {
        ...state,
        prev: LS.LAYOUT1D_END,
        res: {...res, layout1D: [...layout1D, keycode], layout2D: [[]]}
      };
    } else if (parenIdx === -1 && commaIdx === -1) {
      const keycode = tnext;
      const {layout1D} = res;
      return {
        ...state,
        prev: LS.LAYOUT1D_START,
        res: {...res, layout1D: [...layout1D, keycode], layout2D: [[]]}
      };
    }
  } else if (prev === LS.LAYOUT1D_END) {
    const parenIdx = tnext.indexOf('{');
    const length = tnext.length;
    if (tnext[0] === '{') {
      return tokenizer(
        {
          ...state,
          prev: LS.LAYOUT2D_START
        },
        tnext.slice(1)
      );
    }
  } else if (prev === LS.LAYOUT2D_START) {
    if (tnext[0] === '{') {
      return tokenizer(
        {
          ...state,
          prev: LS.LAYOUT2D_COL_START
        },
        tnext.slice(1)
      );
    }
  } else if (prev === LS.LAYOUT2D_COL_END) {
    if (tnext[0] === ',') {
      return tokenizer(
        {
          ...state,
          prev: LS.LAYOUT2D_COL_END
        },
        tnext.slice(1)
      );
    } else if (tnext[0] === '}') {
      return state;
    } else if (tnext[0] === '{') {
      return tokenizer(
        {
          ...state,
          prev: LS.LAYOUT2D_COL_START,
          res: {...res, layout2D: [...res.layout2D, []]}
        },
        tnext.slice(1)
      );
    }
  } else if (prev === LS.LAYOUT2D_COL_START) {
    const commaIdx = tnext.indexOf(',');
    const bracketIdx = tnext.indexOf('}');
    if (commaIdx === 0) {
      return tokenizer(state, tnext.slice(1));
    }

    if (bracketIdx === 0) {
      const {layout2D} = res;
      return tokenizer(
        {
          ...state,
          prev: LS.LAYOUT2D_COL_END,
          res: {...res, layout2D: [...layout2D]}
        },
        tnext.slice(bracketIdx)
      );
    } else if (bracketIdx > 0) {
      const {layout2D} = res;
      const lastRow = layout2D[layout2D.length - 1];
      layout2D[layout2D.length - 1] = [...lastRow, tnext.slice(0, bracketIdx)];
      return tokenizer(
        {
          ...state,
          prev: LS.LAYOUT2D_COL_END,
          res: {...res, layout2D: [...layout2D]}
        },
        tnext.slice(bracketIdx)
      );
    } else if (commaIdx !== -1) {
      const {layout2D} = res;
      const lastRow = layout2D[layout2D.length - 1];
      layout2D[layout2D.length - 1] = [...lastRow, tnext.slice(0, commaIdx)];
      return tokenizer(
        {
          ...state,
          prev: LS.LAYOUT2D_COL_START,
          res: {...res, layout2D}
        },
        tnext.slice(commaIdx)
      );
    } else if (bracketIdx === -1 && commaIdx === -1) {
      const {layout2D} = res;
      const lastRow = layout2D[layout2D.length - 1];
      layout2D[layout2D.length - 1] = [...lastRow, tnext];
      return {
        ...state,
        prev: LS.LAYOUT2D_COL_START,
        res: {...res, layout2D}
      };
    }
  }
  error(state, tnext);
  throw 'Bad Token found';
}

export function parseLayout(layout) {
  const tokens = layout.split(/\s+/g);
  const {res} = tokens.reduce(tokenizer, {prev: LS.START, res: {}});
  const {layout1D, layout2D} = res;
  const [rows, cols] = [layout2D.length, layout2D[0].length];
  const indexMap = Object.assign(
    {},
    ...layout2D.map((arr, i) =>
      Object.assign(
        {},
        ...arr.map((val, j) => ({
          [val]: {col: j, row: i}
        }))
      )
    )
  );
  return {rows, cols, layout: layout1D.map(val => indexMap[val])};
}
