import type { OutlastItem } from "./items";
import { laneDefs, laneOverlays, laneMicro, bodyAttrs } from "./decay";

/* Split out of Lane.tsx so that file exports only a component — Fast Refresh
 * stops working on a module that mixes components with plain functions. */

/** Builds the inner markup for a lane. `p` prefixes every id so two lanes can
 *  share a document without their gradients colliding. */
export function laneMarkup(p: string, item: OutlastItem): string {
  const b = item.base;
  const cy = b.cy ?? 400;
  const caustic = item.caustic
    ? `<ellipse cx="${item.caustic.cx}" cy="402" rx="${item.caustic.rx}"
                ry="${item.caustic.ry}" fill="url(#${p}causticG)"/>`
    : "";

  return `
    <defs>
      <radialGradient id="${p}castG">
        <stop offset="0" stop-color="#000000" stop-opacity=".62"/>
        <stop offset=".5" stop-color="#000000" stop-opacity=".34"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${p}causticG">
        <stop offset="0" stop-color="#D6F5CB" stop-opacity=".55"/>
        <stop offset=".38" stop-color="#7EC478" stop-opacity=".30"/>
        <stop offset=".72" stop-color="#4E8E4C" stop-opacity=".12"/>
        <stop offset="1" stop-color="#4E8E4C" stop-opacity="0"/>
      </radialGradient>
      ${item.defs.replace(/\{p\}/g, p)}
      ${laneDefs(p, item)}
    </defs>
    <ellipse id="${p}cast" cx="${b.cx + 28}" cy="${cy + 3}"
             rx="${Math.round(b.rx * 1.3)}" ry="15" fill="url(#${p}castG)"/>
    <ellipse id="${p}contact" cx="${b.cx + 2}" cy="${cy}"
             rx="${b.rx}" ry="9" fill="#04070A" opacity=".85"/>
    ${caustic}
    <g id="${p}body" ${bodyAttrs(p, item)}>
      <g transform="translate(150 ${cy}) scale(${item.scale ?? 1}) translate(-150 ${-cy})">
        ${item.body.replace(/\{p\}/g, p)}
        ${laneOverlays(p, item)}
      </g>
    </g>
    ${laneMicro(p, item)}
    <text id="${p}mark" x="150" y="44" text-anchor="middle" font-size="14"
          font-weight="700" letter-spacing=".18em" opacity="0"></text>`;
}
