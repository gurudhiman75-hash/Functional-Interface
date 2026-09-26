import {
  clockTimeToHandAnglesExact,
  rationalToNumber,
  type ExactRationalInput,
} from "../../../../foundation/temporal";
import { stableFingerprint } from "./utils";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function handEnd(angleDeg: number, length: number): { x: number; y: number } {
  const radians = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: 100 + length * Math.cos(radians),
    y: 100 + length * Math.sin(radians),
  };
}

export interface ClockSvgSpec {
  hour: number;
  minute: number;
  second?: ExactRationalInput;
  showNumerals?: boolean;
  showMinuteTicks?: boolean;
  highlightArc?: "SMALLER" | "REFLEX" | null;
  ariaLabel?: string;
  partialDialMissingNumeral?: number | null;
}

export function clockDiagramSemanticKey(spec: ClockSvgSpec): string {
  const angles = clockTimeToHandAnglesExact({ hour: spec.hour, minute: spec.minute, second: spec.second ?? 0 });
  return `CLOCK_DIAGRAM:${angles.hourAngleDeg.numerator}/${angles.hourAngleDeg.denominator}|${angles.minuteAngleDeg.numerator}/${angles.minuteAngleDeg.denominator}|${angles.secondAngleDeg.numerator}/${angles.secondAngleDeg.denominator}|N${spec.showNumerals === false ? 0 : 1}|M${spec.partialDialMissingNumeral ?? 0}`;
}

export function renderClockSvg(spec: ClockSvgSpec): { svg: string; fingerprint: string; semanticKey: string } {
  const angles = clockTimeToHandAnglesExact({ hour: spec.hour, minute: spec.minute, second: spec.second ?? 0 });
  const hourEnd = handEnd(rationalToNumber(angles.hourAngleDeg), 48);
  const minuteEnd = handEnd(rationalToNumber(angles.minuteAngleDeg), 72);
  const secondValue = rationalToNumber(angles.secondAngleDeg);
  const includeSecond = secondValue !== 0 || spec.second !== undefined;
  const secondEnd = handEnd(secondValue, 78);
  const label = spec.ariaLabel ?? `Analog clock showing ${spec.hour}:${spec.minute.toString().padStart(2, "0")}`;
  const ticks: string[] = [];
  for (let index = 0; index < 60; index += 1) {
    if (!spec.showMinuteTicks && index % 5 !== 0) continue;
    const outer = handEnd(index * 6, 88);
    const inner = handEnd(index * 6, index % 5 === 0 ? 80 : 84);
    ticks.push(`<line x1="${inner.x.toFixed(3)}" y1="${inner.y.toFixed(3)}" x2="${outer.x.toFixed(3)}" y2="${outer.y.toFixed(3)}" stroke="currentColor" stroke-width="${index % 5 === 0 ? 2 : 1}"/>`);
  }
  const numerals: string[] = [];
  if (spec.showNumerals !== false) {
    for (let numeral = 1; numeral <= 12; numeral += 1) {
      if (spec.partialDialMissingNumeral === numeral) continue;
      const point = handEnd(numeral * 30, 67);
      numerals.push(`<text x="${point.x.toFixed(3)}" y="${(point.y + 4).toFixed(3)}" text-anchor="middle" font-size="13" font-family="system-ui,sans-serif">${numeral}</text>`);
    }
  }
  const semanticKey = clockDiagramSemanticKey(spec);
  const fingerprint = stableFingerprint([semanticKey, label]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="${escapeXml(label)}" data-clock-fingerprint="${fingerprint}" style="max-width:200px;width:100%;height:auto;color:#111"><circle cx="100" cy="100" r="92" fill="white" stroke="currentColor" stroke-width="3"/>${ticks.join("")}${numerals.join("")}<line x1="100" y1="100" x2="${hourEnd.x.toFixed(3)}" y2="${hourEnd.y.toFixed(3)}" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><line x1="100" y1="100" x2="${minuteEnd.x.toFixed(3)}" y2="${minuteEnd.y.toFixed(3)}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>${includeSecond ? `<line x1="100" y1="100" x2="${secondEnd.x.toFixed(3)}" y2="${secondEnd.y.toFixed(3)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>` : ""}<circle cx="100" cy="100" r="5" fill="currentColor"/></svg>`;
  if (/<script|foreignObject|javascript:/i.test(svg)) {
    throw new Error("Unsafe clock SVG output.");
  }
  return { svg, fingerprint, semanticKey };
}

export function renderClockFromAnglesSvg(input: {
  hourAngleDeg: number;
  minuteAngleDeg: number;
  ariaLabel: string;
}): { svg: string; fingerprint: string; semanticKey: string } {
  const hourEnd = handEnd(input.hourAngleDeg, 48);
  const minuteEnd = handEnd(input.minuteAngleDeg, 72);
  const semanticKey = `CLOCK_ANGLES:${input.hourAngleDeg.toFixed(6)}|${input.minuteAngleDeg.toFixed(6)}`;
  const fingerprint = stableFingerprint([semanticKey, input.ariaLabel]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="${escapeXml(input.ariaLabel)}" data-clock-fingerprint="${fingerprint}" style="max-width:200px;width:100%;height:auto;color:#111"><circle cx="100" cy="100" r="92" fill="white" stroke="currentColor" stroke-width="3"/><line x1="100" y1="100" x2="${hourEnd.x.toFixed(3)}" y2="${hourEnd.y.toFixed(3)}" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><line x1="100" y1="100" x2="${minuteEnd.x.toFixed(3)}" y2="${minuteEnd.y.toFixed(3)}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="100" r="5" fill="currentColor"/></svg>`;
  return { svg, fingerprint, semanticKey };
}
