export const ZEAL65 = `[{c:"#ffe9d4",t:"#ba8080",a:6},"Esc",{c:"#f7f2ea",a:4},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#ba8080",t:"#f7f2ea",a:6,w:2},"Backspace","Home"],
[{w:1.5},"Tab",{c:"#f7f2ea",t:"#ba8080",a:4,f:7},"Q","W","E","R","T","Y","U","I","O","P",{f:3},"{\n[","}\n]",{c:"#ba8080",t:"#f7f2ea",w:1.5},"|\n\\",{a:6},"PgUp"],
[{w:1.75},"Caps Lock",{c:"#f7f2ea",t:"#ba8080",a:4,f:7},"A","S","D","F","G","H","J","K","L",{f:3},":\n;","\"\n'",{c:"#ffe9d4",a:6,w:2.25},"Enter",{c:"#ba8080",t:"#f7f2ea"},"PgDn"],
[{w:2.25},"Shift",{c:"#f7f2ea",t:"#ba8080",a:4,f:7},"Z","X","C","V","B","N","M",{f:3},"<\n,",">\n.","?\n/",{c:"#ba8080",t:"#f7f2ea",a:6,w:1.75},"Shift","↑","Fn"],
[{w:1.5},"Ctrl",{w:1.5},"Alt",{c:"#f7f2ea",t:"#ba8080",a:7,w:7},"",{c:"#ba8080",t:"#f7f2ea",a:6,w:1.5},"Alt",{w:1.5},"Ctrl","←","↓","→"]`;

export const HHKB = `[{c:"#9c9c9c",t:"#f7f2ea",p:"OEM"},"Esc",{c:"#d6b2b2"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=","|\n\\",{c:"#f7f2ea",t:"#9c9c9c"},"~\n\`"],
[{w:1.5},"Tab",{c:"#7890a1",t:"#f7f2ea"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#f7f2ea",t:"#9c9c9c",w:1.5},"Delete"],
[{w:1.75},"Control",{c:"#dae8f5"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#f7f2ea",w:2.25},"Enter"],
[{w:2.25},"Shift",{c:"#dae8f5"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#f7f2ea",w:1.75},"Shift","Fn"],
[{x:1.5},"LAlt",{w:1.5},"LMeta",{c:"#9c9c9c",t:"#f7f2ea",a:7,w:7},"",{c:"#f7f2ea",t:"#9c9c9c",a:4,w:1.5},"RMeta","RAlt"]`;

export const M6A = `["Q","W","E"],
["Z","X","C"]`;

export const M6B = `["Q","W","E"],
["Z","X","C"]`;

export const LAYOUT_zeal60_all = `["x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"],
[{w:1.5},"x","x","x","x","x","x","x","x","x","x","x","x","x",{w:1.5},"x"],
[{w:1.75},"x","x","x","x","x","x","x","x","x","x","x","x",{w:2.25},"x"],
[{w:1.25},"x","x","x","x","x","x","x","x","x","x","x","x",{w:1.75},"x","x"],
[{w:1.25},"x",{w:1.25},"x",{w:1.25},"x",{w:6.25},"x",{w:1.25},"x",{w:1.25},"x",{w:1.25},"x",{w:1.25},"x"]`;

export const LAYOUT_zeal65_split_bs = `["x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"],
[{w:1.5},"x","x","x","x","x","x","x","x","x","x","x","x","x",{w:1.5},"x","x"],
[{w:1.75},"x","x","x","x","x","x","x","x","x","x","x","x",{w:2.25},"x","x"],
[{w:2.25},"x","x","x","x","x","x","x","x","x","x","x",{w:1.75},"x","x","x"],
[{w:1.5},"x",{w:1.5},"x",{w:7},"x",{w:1.5},"x",{w:1.5},"x","x","x","x"]`;

export function parseKLERaw(kle: string) {
  const kleArr = kle.split(',\n');
  return kleArr.map(kle => {
    const row = kle
      .replace(/\n/g, '\\n')
      .replace(/\\/g, '\\\\')
      .replace(/\"\"(?!,)/g, '"\\"')
      .replace(/([{,])([A-Za-z])(:)/g, '$1"$2"$3');
    return JSON.parse(row).reduce(
      ({size, margin, res}, n) => {
        // Check if object and apply formatting
        if (typeof n !== 'string') {
          let obj = {res};
          if (n.w > 1) {
            obj = {...obj, size: 100 * n.w};
          }
          if (n.x > 0) {
            obj = {...obj, margin: 100 * n.x};
          }
          return obj;
        } else if (typeof n === 'string') {
          return {
            margin: 0,
            size: 100,
            res: [...res, {label: n, size, margin}]
          };
        }
        return {margin, size, res};
      },
      {margin: 0, size: 100, res: []}
    ).res;
  });
}
