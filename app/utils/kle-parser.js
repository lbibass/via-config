// @flow
type KeyColor = string;
type LegendColor = string;
type Margin = number;
type Label = number;
type Size = number;
type Formatting = {c: KeyColor, t: LegendColor};
type Dimensions = {margin: Margin, size: Size};
type RowPosition = number;
export type Result = Formatting & Dimensions & {label: string};
type ColorCount = {[key: string]: number};
type KLEDimensions = {a: number, x: number, w: number};
type OtherKLEProps = {[key: string]: any};
type KLEElem = $Shape<KLEDimensions & Formatting> | OtherKLEProps | string;
type InnerReduceState = Formatting &
  Dimensions & {colorCount: ColorCount, res: Result[]};
type OuterReduceState = {
  colorCount: ColorCount,
  prevFormatting: Formatting,
  res: Result[][],
  rowPositions: RowPosition[]
};
export type ParsedKLE = {
  res: Result[][],
  colorMap: {[k: string]: string},
  rowPositions: RowPosition[]
};

//{c, t, label: n, size, margin}

export const LAYOUT_M60_A = `[{c:"#4d525a",t:"#e2e2e2"},"Esc",{c:"#e2e2e2",t:"#363636"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=","|\n\\",{c:"#4d525a",t:"#e2e2e2"},"n"],
[{w:1.5},"Tab",{c:"#e2e2e2",t:"#363636"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#4d525a",t:"#e2e2e2",w:1.5},"Backspace"],
[{c:"#f5cb01",t:"#4d525a",w:1.75},"Control",{c:"#e2e2e2",t:"#363636"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#4d525a",t:"#e2e2e2",w:2.25},"Enter"],
[{w:2.25},"Shift",{c:"#e2e2e2",t:"#363636"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#4d525a",t:"#e2e2e2",w:1.75},"Shift",{c:"#f5cb01",t:"#4d525a"},"Fn"],
[{x:1.5,c:"#4d525a",t:"#e2e2e2"},"Alt",{w:1.5},"Meta",{c:"#e2e2e2",t:"#363636",a:7,w:7},"",{c:"#4d525a",t:"#e2e2e2",a:4,w:1.5},"Meta","Alt"]`;

export const LAYOUT_U80_A = `[{c:"#afb0ae",t:"#505557"},"Esc",{x:1,c:"#505557",t:"#aeb0b0"},"F1","F2","F3","F4",{x:0.5,c:"#6b7173"},"F5","F6","F7","F8",{x:0.5,c:"#505557"},"F9","F10","F11","F12",{x:0.25,c:"#6b7173"},"PrtSc","Scroll Lock","Pause\nBreak"],
[{y:0.25},"~\n\`",{c:"#505557"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#6b7173",w:2},"Backspace",{x:0.25},"Insert","Home","PgUp"],
[{w:1.5},"Tab",{c:"#505557"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#6b7173",w:1.5},"|\n\\",{x:0.25},"Delete","End","PgDn"],
[{w:1.75},"Caps Lock",{c:"#505557"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#afb0ae",t:"#505557",w:2.25},"Enter"],
[{c:"#6b7173",t:"#aeb0b0",w:2.25},"Shift",{c:"#505557"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#6b7173",w:2.75},"Shift",{x:1.25},"↑"],
[{w:1.25},"Ctrl",{w:1.25},"Win",{w:1.25},"Alt",{c:"#505557",a:7,w:6.25},"",{c:"#6b7173",a:4,w:1.25},"Alt",{w:1.25},"Win",{w:1.25},"Menu",{w:1.25},"Ctrl",{x:0.25},"←","↓","→"]`;

export const LAYOUT_M6_A = `[{c:"#505557",t:"#d9d7d7",a:7},"x","x","x"],
["x","x","x"]`;

export const LAYOUT_M6_B = `[{c:"#505557",t:"#d9d7d7",a:7},"x","x","x"],
["x","x","x"]`;

export const LAYOUT_M10_B = `[{c:"#505557",t:"#d9d7d7",a:7},"x","x","x"],
["x","x","x"],
["x","x","x"],
[{x:1,w:2},"x"]`;

export const LAYOUT_zeal60_all = `[{c:"#ba8080",t:"#ffe6d4"},"x",{c:"#f7f2ea",t:"#ba8080"},"x","x","x","x","x","x","x","x","x","x","x","x","x",{c:"#ffe6d4"},"x"],
[{w:1.5},"x",{c:"#f7f2ea"},"x","x","x","x","x","x","x","x","x","x","x","x",{c:"#ffe6d4",w:1.5},"x"],
[{w:1.75},"x",{c:"#f7f2ea"},"x","x","x","x","x","x","x","x","x","x","x",{c:"#ba8080",t:"#ffe6d4",w:2.25},"x"],
[{c:"#ffe6d4",t:"#ba8080",w:1.25},"x","x",{c:"#f7f2ea"},"x","x","x","x","x","x","x","x","x","x",{c:"#ffe6d4",w:1.75},"x","x"],
[{w:1.25},"x",{w:1.25},"x",{w:1.25},"x",{c:"#f7f2ea",w:6.25},"x",{c:"#ffe6d4",w:1.25},"x",{w:1.25},"x",{w:1.25},"x",{w:1.25},"x"]`;

export const LAYOUT_zeal65_split_bs = `["x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"],
[{w:1.5},"x","x","x","x","x","x","x","x","x","x","x","x","x",{w:1.5},"x","x"],
[{w:1.75},"x","x","x","x","x","x","x","x","x","x","x","x",{w:2.25},"x","x"],
[{w:2.25},"x","x","x","x","x","x","x","x","x","x","x",{w:1.75},"x","x","x"],
[{w:1.5},"x",{w:1.5},"x",{w:7},"x",{w:1.5},"x",{w:1.5},"x","x","x","x"]`;

export const LAYOUT_zeal65_split_bs_olivia = `[{c:"#DEBFB3",t:"#363636"},"Esc",{c:"#ebebeb"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#363636",t:"#DEBFB3"},"PrtSc","Pause\nBreak","Num Lock"],
[{w:1.5},"Tab",{c:"#ebebeb",t:"#363636"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#363636",t:"#DEBFB3",w:1.5},"|\n\\","Insert"],
[{w:1.75},"Caps Lock",{c:"#ebebeb",t:"#363636"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#363636",t:"#DEBFB3",w:2.25},"Enter","Home"],
[{w:2.25},"Shift",{c:"#ebebeb",t:"#363636"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#363636",t:"#DEBFB3",w:1.75},"Shift",{c:"#DEBFB3",t:"#363636"},"↑",{c:"#363636",t:"#DEBFB3"},"/"],
[{w:1.5},"Ctrl",{w:1.5},"Alt",{c:"#DEBFB3",t:"#363636",a:7,w:7},"",{c:"#363636",t:"#DEBFB3",a:4,w:1.5},"Alt",{w:1.5},"Ctrl",{c:"#DEBFB3",t:"#363636"},"←","↓","→"]`;

export const LAYOUT_268_2 = `[{c:"#DEBFB3",t:"#363636"},"Esc",{c:"#ebebeb"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#363636",t:"#DEBFB3"},"PrtSc","Pause\nBreak","Num Lock"],
[{w:1.5},"Tab",{c:"#ebebeb",t:"#363636"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#363636",t:"#DEBFB3",w:1.5},"x","Insert"],
[{w:1.75},"Caps Lock",{c:"#ebebeb",t:"#363636"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#363636",t:"#DEBFB3",w:2.25},"Enter","Home"],
[{w:2.25},"Shift",{c:"#ebebeb",t:"#363636"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#363636",t:"#DEBFB3",w:1.75},"Shift",{c:"#DEBFB3",t:"#363636"},"↑",{c:"#363636",t:"#DEBFB3"},"/"],
[{w:1.25},"Ctrl",{w:1.25},"x",{w:1.25},"Alt",{c:"#DEBFB3",t:"#363636",a:7,w:6.25},"",{c:"#363636",t:"#DEBFB3",a:4,w:1.25},"Alt",{w:1.25},"Alt",{x:0.5,c:"#DEBFB3",t:"#363636"},"←","↓","→"]`;

export const LAYOUT_KOYU = `[{c:"#DEBFB3",t:"#363636"},"",{c:"#ebebeb"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#363636",t:"#DEBFB3"},"PrtSc","Pause\nBreak","Num Lock"],
[{w:1.5},"Tab",{c:"#ebebeb",t:"#363636"},"","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#363636",t:"#DEBFB3",w:1.5},"|\n\\","Insert"],
[{w:1.75},"Caps Lock",{c:"#ebebeb",t:"#363636"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#363636",t:"#DEBFB3",w:2.25},"Enter","Home"],
[{w:2.25},"Shift",{c:"#ebebeb",t:"#363636"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#363636",t:"#DEBFB3",w:1.75},"Shift",{c:"#DEBFB3",t:"#363636"},"↑",{c:"#363636",t:"#DEBFB3"},"/"],
[{w:1.5},"Ctrl","Win",{w:1.5},"Alt",{c:"#DEBFB3",t:"#363636",a:7,w:7},"",{c:"#363636",t:"#DEBFB3",a:4,w:1.5},"Ctrl",{x:0.5,c:"#DEBFB3",t:"#363636"},"←","↓","→"]`;

export const LAYOUT_WT8_A = `[{c:"#505557",t:"#d9d7d7",a:7},"x","x","x","x"],
["x","x","x","x"]`;

export const LAYOUT_WT60_A = `[{c:"#ba8080",t:"#ffe6d4"},"x",{c:"#f7f2ea",t:"#ba8080"},"x","x","x","x","x","x","x","x","x","x","x","x","x",{c:"#ffe6d4"},"x"],
[{w:1.5},"x",{c:"#f7f2ea"},"x","x","x","x","x","x","x","x","x","x","x","x",{c:"#ffe6d4",w:1.5},"x"],
[{w:1.75},"x",{c:"#f7f2ea"},"x","x","x","x","x","x","x","x","x","x","x",{c:"#ba8080",t:"#ffe6d4",w:2.25},"x"],
[{c:"#ffe6d4",t:"#ba8080",w:2.25},"x",{c:"#f7f2ea"},"x","x","x","x","x","x","x","x","x","x",{c:"#ffe6d4",w:1.75},"x","x"],
[{w:1.25},"x",{w:1.25},"x",{w:1.25},"x",{c:"#f7f2ea",w:6.25},"x",{c:"#ffe6d4",w:1.25},"x",{w:1.25},"x",{w:1.25},"x",{w:1.25},"x"]`;

export const LAYOUT_WT65_A = `[{c:"#c28080",t:"#fff5f0",a:6},"Esc",{c:"#fff5f0",t:"#c28080",a:4},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#91c4c3",a:6},"Backspace","Backspace","Home"],
[{w:1.5},"Tab",{c:"#fff5f0",a:4,f:7},"Q","W","E","R","T","Y","U","I","O","P",{f:3},"{\n[","}\n]",{c:"#91c4c3",w:1.5},"|\n\\",{a:6},"PgUp"],
[{w:1.75},"Caps Lock",{c:"#fff5f0",a:4,f:7},"A","S","D","F","G","H","J","K","L",{f:3},":\n;","\"\n'",{c:"#c28080",t:"#fff5f0",a:6,w:2.25},"Enter",{c:"#91c4c3",t:"#c28080"},"PgDn"],
[{w:2.25},"Shift",{c:"#fff5f0",a:4,f:7},"Z","X","C","V","B","N","M",{f:3},"<\n,",">\n.","?\n/",{c:"#91c4c3",a:6,w:1.75},"Shift","↑","Fn"],
[{w:1.25},"Ctrl",{w:1.25},"Win",{w:1.25},"Alt",{c:"#fff5f0",a:7,w:6.25},"",{c:"#91c4c3",a:6,w:1.25},"Alt",{w:1.25},"Fn",{x:0.5},"←","↓","→"]`;

export const LAYOUT_WT80_A = `[{c:"#afb0ae",t:"#505557"},"Esc",{x:1,c:"#505557",t:"#aeb0b0"},"F1","F2","F3","F4",{x:0.5,c:"#6b7173"},"F5","F6","F7","F8",{x:0.5,c:"#505557"},"F9","F10","F11","F12",{x:0.25,c:"#6b7173"},"PrtSc","Scroll Lock","Pause\nBreak"],
[{y:0.25},"~\n\`",{c:"#505557"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#6b7173",w:2},"Backspace",{x:0.25},"Insert","Home","PgUp"],
[{w:1.5},"Tab",{c:"#505557"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#6b7173",w:1.5},"|\n\\",{x:0.25},"Delete","End","PgDn"],
[{w:1.75},"Caps Lock",{c:"#505557"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#afb0ae",t:"#505557",w:2.25},"Enter"],
[{c:"#6b7173",t:"#aeb0b0",w:2.25},"Shift",{c:"#505557"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#6b7173",w:2.75},"Shift",{x:1.25},"↑"],
[{w:1.25},"Ctrl",{w:1.25},"Win",{w:1.25},"Alt",{c:"#505557",a:7,w:6.25},"",{c:"#6b7173",a:4,w:1.25},"Alt",{w:1.25},"Win",{w:1.25},"Menu",{w:1.25},"Ctrl",{x:0.25},"←","↓","→"]`;

export const LAYOUT_AEGIS = `[{a:7},"","","","",{x:0.5,a:4},"Esc",{x:1},"F1","F2","F3","F4",{x:0.5},"F5","F6","F7","F8",{x:0.5},"F9","F10","F11","F12"],
["Num Lock","/","*","-",{x:0.5},"Esc","!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=","~\n\`","|\n\\"],
["7\nHome","8\n↑","9\nPgUp","+",{x:0.5,w:1.5},"Tab\nCaps","Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{w:1.5},"Backspace\nDelete"],
["4\n←","5","6\n→",{a:7},"",{x:0.5,a:4,w:1.75},"Control","A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{w:2.25},"Enter"],
["1\nEnd","2\n↓","3\nPgDn",{a:7},"",{x:0.25,a:4},"↑",{x:0.25,w:1.25},"Shift","Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{w:1.75},"Shift","Fn"],
["0\nIns",{a:7},"",{a:4},".\nDel",{x:0.25},"←","↓","→",{x:0.25,w:1.25},"Win",{w:1.25},"Alt",{a:7,w:6.25},"",{a:4,w:1.5},"Alt",{w:1.25},"Win",{w:1.5},"Layout"]`;

export const LAYOUT_STANDARD_60_ANSI = `[{c:"#4d525a",t:"#e2e2e2"},"Esc",{c:"#e2e2e2",t:"#363636"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#4d525a",t:"#e2e2e2",w:2},"Backspace"],
[{w:1.5},"Tab",{c:"#e2e2e2",t:"#363636"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#4d525a",t:"#e2e2e2",w:1.5},"|\n\\"],
[{w:1.75},"Caps Lock",{c:"#e2e2e2",t:"#363636"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#4d525a",t:"#e2e2e2",w:2.25},"Enter"],
[{w:2.25},"Shift",{c:"#e2e2e2",t:"#363636"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#4d525a",t:"#e2e2e2",w:2.75},"Shift"],
[{w:1.25},"Ctrl",{w:1.25},"Win",{w:1.25},"Alt",{c:"#e2e2e2",t:"#363636",a:7,w:6.25},"x",{c:"#4d525a",t:"#e2e2e2",a:4,w:1.25},"Alt",{w:1.25},"Fn",{w:1.25},"Win",{w:1.25},"Ctrl"]`;

export const LAYOUT_STANDARD_60_ISO = `[{c:"#4d525a",t:"#e2e2e2"},"Esc",{c:"#e2e2e2",t:"#363636"},"!\n1","\"\n2","£\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#4d525a",t:"#e2e2e2",w:2},"Backspace"],
[{w:1.5},"Tab",{c:"#e2e2e2",t:"#363636"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]"],
[{c:"#4d525a",t:"#e2e2e2",w:1.75},"Caps Lock",{c:"#e2e2e2",t:"#363636"},"A","S","D","F","G","H","J","K","L",":\n;","@\n'","~\n#",{c:"#4d525a",t:"#e2e2e2",w:1.25},"Enter"],
[{w:1.25},"Shift",{c:"#e2e2e2",t:"#363636"},"|\n\\","Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#4d525a",t:"#e2e2e2",w:2.75},"Shift"],
[{w:1.25},"Ctrl",{w:1.25},"Win",{w:1.25},"Alt",{c:"#e2e2e2",t:"#363636",a:7,w:6.25},"x",{c:"#4d525a",t:"#e2e2e2",a:4,w:1.25},"Alt",{w:1.25},"Fn",{w:1.25},"Win",{w:1.25},"Ctrl"]`;

export const LAYOUT_STANDARD_60_HHKB = `[{c:"#4d525a",t:"#e2e2e2"},"Esc",{c:"#e2e2e2",t:"#363636"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=","n",{c:"#4d525a",t:"#e2e2e2"},"n"],
[{w:1.5},"Tab",{c:"#e2e2e2",t:"#363636"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#4d525a",t:"#e2e2e2",w:1.5},"|\n\\"],
[{w:1.75},"Caps Lock",{c:"#e2e2e2",t:"#363636"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#4d525a",t:"#e2e2e2",w:2.25},"Enter"],
[{w:2.25},"Shift",{c:"#e2e2e2",t:"#363636"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#4d525a",t:"#e2e2e2",w:1.75},"Shift","Fn"],
[{w:1.5},"Ctrl","Win",{w:1.5},"Alt",{c:"#e2e2e2",t:"#363636",a:7,w:7},"x",{c:"#4d525a",t:"#e2e2e2",a:4,w:1.5},"Alt","Win",{w:1.5},"Ctrl"]`;

export const LAYOUT_IRIS = `[{c:"#bd760f"},"Esc",{c:"#c4c8c5"},"!\n1","@\n2","#\n3","$\n4","%\n5",{x:2.75},"^\n6","&\n7","*\n8","(\n9",")\n0",{c:"#006d59"},"Back"],
["Tab",{c:"#c4c8c5"},"Q","W","E","R","T",{x:2.75},"Y","U","I","O","P",{c:"#006d59"},"Del"],
["Ctrl",{c:"#c4c8c5"},"A","S","D","F","G",{x:2.75},"H","J","K","L",":\n;",{c:"#006d59"},"\"\n'"],
["Shift",{c:"#c4c8c5"},"Z","X","C","V","B",{c:"#006d59"},"Space",{x:0.75},"Enter",{c:"#c4c8c5"},"N","M","<\n,",">\n.","?\n/",{c:"#006d59"},"Right"],
[{x:3.5},"Ctrl","Alt","Space",{x:1.75},"Enter","Win","Alt"]`;

export const LAYOUT_PLAIN60 = `["Esc","!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=","|\n\\","Back space"],
[{w:1.5},"Tab","Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{w:1.5},"|\n\\"],
[{w:1.75},"Caps Lock","A","S","D","F","G","H","J","K","L",":\n;","\"\n'","ISO",{w:1.25},"Enter"],
[{w:1.25},"Shift","ISO","Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{w:1.75},"Shift","Fn"],
[{w:1.25},"Ctrl",{w:1.25},"Win",{w:1.25},"Alt",{a:7,w:6.25},"",{a:4,w:1.25},"Alt",{w:1.25},"Win",{w:1.25},"Menu",{w:1.25},"Ctrl"]`;

export const LAYOUT_SNAGPAD = `[{c:"#505557",t:"#d9d7d7",a:7},"x","x","x","x"],
["x","x","x","x"],
["x","x","x","x"],
["x","x","x","x"],
["x","x","x","x"]`;

export const LAYOUT_AANZEE = `[{c:"",t:"",p:"GMK",a:6},"Esc",{a:4,f:5},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{a:7,f:3},"","",{a:6},"Home"],
[{a:4,w:1.5},"⇤\n⇥\n\n\n\n\nTab",{f:7},"Q","W","E","R","T","Y","U","I","O","P",{f:5},"{\n[","}\n]",{f:3,w:1.5},"|\n\\",{a:6},"PgUp"],
[{w:1.75},"Caps Lock",{a:4,f:7},"A","S","D","F","G","H","J","K","L",{f:5},":\n;","\"\n'",{a:6,f:3,w:2.25},"↵ Enter","PgDn"],
[{w:2.25},"⇧ Shift",{a:4,f:7},"Z","X","C","V","B","N","M",{f:5},"<\n,",">\n.","?\n/",{a:6,f:3,w:1.75},"⇧ Shift",{a:4,f:9},"↑",{a:6,f:3},"Fn"],
[{w:1.25},"Ctrl",{w:1.25},"Win",{w:1.25},"Alt",{a:7,w:6.25},"",{a:6,w:1.25},"Alt",{w:1.25},"Win",{x:0.5,a:4,f:9},"←","↓","→"]`;

export const LAYOUT_LUNAR = `[{a:7},"","","","","","","","","","","","","","","",""],
[{w:1.5},"","","","","","","","","","","","","",{w:1.5},"",""],
[{w:1.75},"","","","","","","","","","","","",{w:2.25},"",""],
[{w:2.25},"","","","","","","","","","","",{w:1.75},"","",""],
[{w:1.5},"",{w:1.25},"",{w:1.5},"",{w:2.25},"",{w:1.5},"",{w:2.75},"",{w:1.25},"","","","",""]`;

export const LAYOUT_SATISFACTION75 = `[{c:"#09b084",a:7},"",{x:0.5,c:"#cccccc"},"","","","",{x:0.25,c:"#09b084"},"","","","",{x:0.25,c:"#cccccc"},"","","",""],
[{y:0.25,c:"#09b084"},"",{c:"#cccccc"},"","","","","","","","","","","","",{c:"#09b084",w:2},"",{x:0.5},""],
[{w:1.5},"",{c:"#cccccc"},"","","","","","","","","","","","",{c:"#09b084",w:1.5},"",{x:0.5},""],
[{w:1.75},"",{c:"#cccccc"},"","","","","","","","","","","",{c:"#09b084",w:2.25},"",{x:0.5},""],
[{a:4,w:2.25},"",{c:"#cccccc",a:7},"","","","","","","","","","",{c:"#09b084",a:4,w:1.75},"",{x:1.5},"70"],
[{y:-0.75,x:14.25},"69"],
[{y:-0.25,w:1.25},"",{a:7,w:1.25},"",{w:1.25},"",{c:"#cccccc",w:6.25},"",{c:"#09b084"},"","",{a:4},""],
[{y:-0.75,x:13.25},"","",""]`;


export function parseKLERaw(kle: string): ParsedKLE {
  const kleArr = kle.split(',\n');
  const parsedKLE: OuterReduceState = kleArr.reduce(
    (prev: OuterReduceState, kle: string) => {
      const row = kle
        .replace(/\n/g, '\\n')
        .replace(/\\/g, '\\\\')
        .replace(/\"\\(?!,)/g, '\\\\')
        .replace(/([{,])([A-Za-z][0-9A-Za-z]?)(:)/g, '$1"$2"$3');
      const rowPosRegex = /"y":(-?\d+\.\d+)/mi;
      const rowPosResult = rowPosRegex.exec(row);
      const rowPosition = rowPosResult !== null ? Number.parseFloat(rowPosResult[1]) : 0;
      const parsedRow: InnerReduceState = JSON.parse(row).reduce(
        (
          {size, margin, res, c, t, colorCount}: InnerReduceState,
          n: KLEElem
        ) => {
          // Check if object and apply formatting
          if (typeof n !== 'string') {
            let obj = {size, margin, colorCount, c, t, res};
            if (n.w > 1) {
              obj = {...obj, size: 100 * n.w};
            }
            if (n.x > 0) {
              obj = {...obj, margin: 100 * n.x};
            }
            if (typeof n.c === 'string') {
              obj = {...obj, c: n.c};
            }
            if (typeof n.t === 'string') {
              obj = {...obj, t: n.t};
            }
            return obj;
          } else if (typeof n === 'string') {
            const colorCountKey = `${c}:${t}`;
            const newColorCount = {
              ...colorCount,
              [colorCountKey]:
                colorCount[colorCountKey] === undefined
                  ? 1
                  : colorCount[colorCountKey] + 1
            };
            return {
              margin: 0,
              size: 100,
              c,
              colorCount: newColorCount,
              t,
              res: [...res, {c, t, label: n, size, margin}]
            };
          }
          return {margin, size, c, t, res, colorCount};
        },
        {
          ...prev.prevFormatting,
          colorCount: prev.colorCount,
          margin: 0,
          size: 100,
          res: []
        }
      );
      return {
        colorCount: parsedRow.colorCount,
        prevFormatting: {c: parsedRow.c, t: parsedRow.t},
        res: [...prev.res, parsedRow.res],
        rowPositions: [...prev.rowPositions, rowPosition]
      };
    },
    {prevFormatting: {c: '#f5f5f5', t: '#444444'}, res: [], rowPositions: [], colorCount: {}}
  );

  const {colorCount, res, rowPositions} = parsedKLE;
  const colorCountKeys = Object.keys(colorCount);
  colorCountKeys.sort((a, b) => colorCount[b] - colorCount[a]);
  if (colorCountKeys.length > 3) {
    console.error('Please correct layout:', parsedKLE);
  }
  return {
    res,
    rowPositions,
    colorMap: {
      [colorCountKeys[0]]: 'alphas',
      [colorCountKeys[1]]: 'mods',
      [colorCountKeys[2]]: 'accents'
    }
  };
}
