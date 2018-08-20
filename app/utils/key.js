export function isAlpha(label) {
  return /[A-Z]/.test(label) && label.length === 1;
}

export function isNumericSymbol(label) {
  const numbersTop = '!@#$%^&*()_+|~{}:"<>?'.split('');
  //  const numbersBottom = "1234567890-=\\`[];',./".split("");
  return numbersTop.includes(label[0]);
}
