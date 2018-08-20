const sample= `[{c:"#ffe9d4",t:"#ba8080",a:6},"Esc",{c:"#f7f2ea",a:4},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=",{c:"#ba8080",t:"#f7f2ea",a:6,w:2},"Backspace","Home"],
[{w:1.5},"Tab",{c:"#f7f2ea",t:"#ba8080",a:4,f:7},"Q","W","E","R","T","Y","U","I","O","P",{f:3},"{\n[","}\n]",{c:"#ba8080",t:"#f7f2ea",w:1.5},"|\n\\",{a:6},"PgUp"],
[{w:1.75},"Caps Lock",{c:"#f7f2ea",t:"#ba8080",a:4,f:7},"A","S","D","F","G","H","J","K","L",{f:3},":\n;","\"\n'",{c:"#ffe9d4",a:6,w:2.25},"Enter",{c:"#ba8080",t:"#f7f2ea"},"PgDn"],
[{w:2.25},"Shift",{c:"#f7f2ea",t:"#ba8080",a:4,f:7},"Z","X","C","V","B","N","M",{f:3},"<\n,",">\n.","?\n/",{c:"#ba8080",t:"#f7f2ea",a:6,w:1.75},"Shift","↑","Fn"],
[{w:1.5},"Ctrl",{w:1.5},"Alt",{c:"#f7f2ea",t:"#ba8080",a:7,w:7},"",{c:"#ba8080",t:"#f7f2ea",a:6,w:1.5},"Alt",{w:1.5},"Ctrl","←","↓","→"]`;

export function parseKLERaw() {
  const kleArr = sample.split(',\n');
  return kleArr.map(kle => {
    const row = kle
      .replace(/\n/g, '\\n')
      .replace(/\\/g, '\\\\')
      .replace(/\"\"(?!,)/g, '"\\"')
      .replace(/([{,])([A-Za-z])(:)/g, '$1"$2"$3');
    return JSON.parse(row)
      .reduce(({size, res}, n) => {
        if (typeof n !== 'string' && n.w > 1) { // Check if object and there exists width
          return {size: 100 * n.w, res};
        } else if (typeof n === 'string') {
          console.log(size);
          return {size: 100, res: [...res, {label: n, size}]};
        }
        return {size, res};
      }, {size: 100, res: []}).res;
  });
}
