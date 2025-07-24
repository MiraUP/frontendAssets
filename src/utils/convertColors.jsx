/**
 * Funções para conversão de cores
 * @param {string} rgbString - Código de cor em RGB ou RGBA -> Converte para hexadecimal
 * @param {string} hexString - Código de cor em hexadecimal -> Converte para RGB ou RGBA
 */

// Converte cor em Hexadecimal
export function toHEX(rgbString) {
  const match = rgbString.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
  );

  if (!match) {
    throw new Error('Formato inválido. Use rgb(r,g,b) ou rgba(r,g,b,a)');
  }

  const [, r, g, b, a] = match;

  const toHex = (val) => {
    const hex = parseInt(val).toString(16);
    return hex.padStart(2, '0');
  };

  const rHex = toHex(r);
  const gHex = toHex(g);
  const bHex = toHex(b);

  let aHex = '';
  if (a !== undefined) {
    const alpha = Math.round(parseFloat(a) * 255);
    aHex = toHex(alpha);
  }

  return `#${rHex}${gHex}${bHex}${aHex}`;
}

// Converte cor em RGB ou RGBA
export function toRGB(hexString) {
  let sanitizedHex = hexString.replace(/^#/, '');

  if (![3, 4, 6, 8].includes(sanitizedHex.length)) {
    throw new Error('Formato HEX inválido');
  }

  // Expande formatos curtos como #abc ou #abcd
  if (sanitizedHex.length === 3 || sanitizedHex.length === 4) {
    sanitizedHex = sanitizedHex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const r = parseInt(sanitizedHex.slice(0, 2), 16);
  const g = parseInt(sanitizedHex.slice(2, 4), 16);
  const b = parseInt(sanitizedHex.slice(4, 6), 16);

  if (sanitizedHex.length === 8) {
    const a = parseInt(sanitizedHex.slice(6, 8), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }

  return `rgb(${r}, ${g}, ${b})`;
}
