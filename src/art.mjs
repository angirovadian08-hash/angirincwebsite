// Angir logo mark (used for favicon / app icons).
const C = { redDeep: "#8d0d0c", hot: "#ffb347" };

export function logoSVG(size = 512) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
<rect width="512" height="512" rx="96" fill="${C.redDeep}"/>
<path d="M256 92 L408 420 L344 420 L314 352 L198 352 L168 420 L104 420 Z M222 298 L290 298 L256 218 Z" fill="#fff"/>
<rect x="132" y="440" width="248" height="18" rx="9" fill="#fff" opacity="0.9"/>
<circle cx="392" cy="128" r="18" fill="${C.hot}"/><g stroke="${C.hot}" stroke-width="8" stroke-linecap="round"><line x1="392" y1="92" x2="392" y2="70"/><line x1="420" y1="104" x2="438" y2="88"/><line x1="428" y1="132" x2="452" y2="132"/></g>
</svg>`;
}
