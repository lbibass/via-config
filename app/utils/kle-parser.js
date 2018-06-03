const sample= `[{c:"#8f9173",t:"#3a3b31",p:"OEM"},"Esc",{c:"#d8d2c3"},"!\n1","@\n2","#\n3","$\n4","%\n5","^\n6","&\n7","*\n8","(\n9",")\n0","_\n-","+\n=","|\n\\",{c:"#3a3b31",t:"#8f9173"},"~\n\`"],
[{w:1.5},"Tab",{c:"#d8d2c3",t:"#3a3b31"},"Q","W","E","R","T","Y","U","I","O","P","{\n[","}\n]",{c:"#3a3b31",t:"#8f9173",w:1.5},"Backspace"],
[{w:1.75},"Control",{c:"#d8d2c3",t:"#3a3b31"},"A","S","D","F","G","H","J","K","L",":\n;","\"\n'",{c:"#3a3b31",t:"#8f9173",w:2.25},"Enter"],
[{w:2.25},"Shift",{c:"#d8d2c3",t:"#3a3b31"},"Z","X","C","V","B","N","M","<\n,",">\n.","?\n/",{c:"#3a3b31",t:"#8f9173",w:1.75},"Shift","Fn"],
[{x:1.5},"Alt",{w:1.5},"Meta",{c:"#8f9173",t:"#000000",a:7,w:6.25},"",{c:"#3a3b31",t:"#8f9173",a:4,w:1.5},"Meta","Alt"]`;

export function parseKLERaw() {
  const kleArr = sample.split(',\n');
  return kleArr.map(kle => {
    const row = kle
      .replace(/\n/g, '\\n')
      .replace(/\\/g, '\\\\')
      .replace(/\"\"(?!,)/g, '"\\"')
      .replace(/([{,])([A-Za-z])(:)/g, '$1"$2"$3');
    return JSON.parse(row)
      .map(entry => typeof entry !== 'string' ? entry : entry.replace('\\n', '\n'));
  });
}