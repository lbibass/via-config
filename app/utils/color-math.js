export function getRGBPrime(hue, c, x) {
  if (hue >= 0 && hue < 60) {
    return [c, x, 0];
  } else if (hue >= 60 && hue < 120) {
    return [x, c, 0];
  } else if (hue >= 120 && hue < 180) {
    return [0, c, x];
  } else if (hue >= 180 && hue < 240) {
    return [0, x, c];
  } else if (hue >= 240 && hue < 300) {
    return [x, 0, c];
  } else if (hue >= 300 && hue < 360) {
    return [c, 0, x];
  } else if (hue === 360) {
    return [c, x, 0];
  }
}

export function toDegrees(rad) {
  return rad * (180 / Math.PI);
}

export function calcHue(x, y) {
  if (x < 200 && y < 200) {
    const nX = 200 - x;
    const nY = 200 - y;
    return 2 * Math.PI - Math.atan(nX / nY);
  } else if (x > 200 && y < 200) {
    const nX = x - 200;
    const nY = 200 - y;
    return Math.atan(nX / nY);
  } else if (x < 200 && y > 200) {
    const nX = 200 - x;
    const nY = y - 200;
    return Math.PI + Math.atan(nX / nY);
  } else if (x > 200 && y > 200) {
    const nX = x - 200;
    const nY = y - 200;
    return 0.5 * Math.PI + Math.atan(nY / nX);
  } else if (x === 200) {
    return y > 200 ? Math.PI : 0;
  } else if (y === 200) {
    return x >= 200 ? 0.5 * Math.PI : 1.5 * Math.PI;
  }
}

export function calcMagnitude(x, y) {
  if (x < 200 && y < 200) {
    const nX = 200 - x;
    const nY = 200 - y;
    return Math.sqrt(nX * nX + nY * nY) / 200;
  } else if (x > 200 && y < 200) {
    const nX = x - 200;
    const nY = 200 - y;
    return Math.sqrt(nX * nX + nY * nY) / 200;
  } else if (x < 200 && y > 200) {
    const nX = 200 - x;
    const nY = y - 200;
    return Math.sqrt(nX * nX + nY * nY) / 200;
  } else if (x > 200 && y > 200) {
    const nX = x - 200;
    const nY = y - 200;
    return Math.sqrt(nX * nX + nY * nY) / 200;
  } else if (x === 200) {
    return y > 200 ? (y - 200) / 200 : (200 - y) / 200;
  } else if (y === 200) {
    return x > 200 ? (x - 200) / 200 : (200 - x) / 200;
  }
}
