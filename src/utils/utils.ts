export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase()
}
