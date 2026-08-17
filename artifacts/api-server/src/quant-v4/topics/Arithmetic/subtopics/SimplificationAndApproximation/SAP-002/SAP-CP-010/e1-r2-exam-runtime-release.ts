import {
  cubeRoot,
  e1r2Math,
  squareRoot,
  type SapE1R2Package,
} from "../../SAP-E1-R2-TYPES";
import {
  SAP_CP010_E1_R2_STRUCTURES,
  generateSapCp010E1R2 as generateFinal,
  type SapCp010E1R2Structure,
} from "./e1-r2-exam-runtime-final";

export { SAP_CP010_E1_R2_STRUCTURES };
export type { SapCp010E1R2Structure };

const DECIMAL_OFFSETS = Object.freeze([-0.42, -0.31, -0.18, -0.07, 0.06, 0.14, 0.27, 0.39]);
const SQUARE_OFFSETS = Object.freeze([-1.75, -1.2, -0.65, -0.25, 0.35, 0.8, 1.35, 1.85]);
const CUBE_OFFSETS = Object.freeze([-3.2, -2.1, -1.1, -0.35, 0.45, 1.25, 2.2, 3.1]);

function trim(value: number, places = 2): string {
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function offset(seed: number, salt: number): number {
  return DECIMAL_OFFSETS[(seed * 3 + salt * 5) % DECIMAL_OFFSETS.length]!;
}

function squareOffset(seed: number): number {
  return SQUARE_OFFSETS[(seed * 5 + 1) % SQUARE_OFFSETS.length]!;
}

function cubeOffset(seed: number): number {
  return CUBE_OFFSETS[(seed * 7 + 2) % CUBE_OFFSETS.length]!;
}

function withPresentation(base: SapE1R2Package, stem: string, steps: readonly string[], difficulty: "MEDIUM" | "HARD", displayData: Readonly<Record<string, number | string>>): SapE1R2Package {
  const explanation = Object.freeze({ ...base.explanation, steps: Object.freeze(steps) });
  const data = Object.freeze({ ...base.oracle.data, ...displayData, presentationVersion: "BANK_DIVERSE_OFFSETS_V3" });
  const payload = JSON.stringify({ profile: base.profile, checkpointId: base.checkpointId, structureId: base.structureId, seed: base.seed, stem, answer: base.canonicalAnswer, data });
  const errors = [...base.validation.errors];
  if (/\bround\b|For estimation, take|Using cancellation|using suitable approximation|nearest whole number/i.test(stem)) errors.push("Release stem leaked solving guidance.");
  if (/[√∛∜]/.test(stem)) errors.push("Release stem leaked Unicode radical.");
  return Object.freeze({
    ...base,
    stem,
    difficulty,
    explanation,
    oracle: Object.freeze({ ...base.oracle, data }),
    canonicalPayloadKey: payload,
    generationIdentity: `${base.generationIdentity}:BANK-DIVERSE-V3:${payload}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function diversifyUnguided(base: SapE1R2Package): SapE1R2Package {
  const d = base.oracle.data;
  const seed = base.seed;
  switch (base.structureId) {
    case "CP010-R2-APPROX-SQUARE-PRODUCT": {
      const a = Number(d.a), b = Number(d.b), m = Number(d.m), c = Number(d.c);
      const x = trim(a + offset(seed, 0)), y = trim(b + offset(seed, 1)), z = trim(m + offset(seed, 2)), w = trim(c + offset(seed, 3));
      const stem = `What approximate value should come in place of ? in ${e1r2Math(`(${x})^{2} + ${y} \\times ${z} - ${w} = ?`)}?`;
      return withPresentation(base, stem, [`Use nearby convenient values: ${x} ≈ ${a}, ${y} ≈ ${b}, ${z} ≈ ${m}, ${w} ≈ ${c}.`, `${a}² + ${b} × ${m} - ${c} = ${base.canonicalAnswer}.`], "MEDIUM", { x, y, z, w });
    }
    case "CP010-R2-APPROX-ROOT-TIMES-DECIMAL": {
      const a = Number(d.a), m = Number(d.m), c = Number(d.c);
      const rootN = trim(a * a + squareOffset(seed));
      const mult = trim(m + offset(seed, 1)), off = trim(c + offset(seed, 3));
      const stem = `Find the approximate value of ${e1r2Math(`${squareRoot(rootN)} \\times ${mult} + ${off}`)}.`;
      return withPresentation(base, stem, [`${rootN} is close to ${a * a}, so ${e1r2Math(squareRoot(rootN))} ≈ ${a}; also ${mult} ≈ ${m} and ${off} ≈ ${c}.`, `${a} × ${m} + ${c} = ${base.canonicalAnswer}.`], "MEDIUM", { displayRoot: rootN, displayMultiplier: mult, displayOffset: off });
    }
    case "CP010-R2-APPROX-CUBEROOT-MIXED": {
      const u = Number(d.u), m = Number(d.m), c = Number(d.c);
      const rootN = trim(u ** 3 + cubeOffset(seed));
      const mult = trim(m + offset(seed, 2)), off = trim(c + offset(seed, 4));
      const stem = `What is the approximate value of ${e1r2Math(`${cubeRoot(rootN)} \\times ${mult} - ${off}`)}?`;
      return withPresentation(base, stem, [`${rootN} is close to ${u ** 3}, so ${e1r2Math(cubeRoot(rootN))} ≈ ${u}; also ${mult} ≈ ${m} and ${off} ≈ ${c}.`, `${u} × ${m} - ${c} = ${base.canonicalAnswer}.`], "MEDIUM", { displayCube: rootN, displayMultiplier: mult, displayOffset: off });
    }
    case "CP010-R2-APPROX-POWER-QUOTIENT": {
      const x = Number(d.x), m = Number(d.m), c = Number(d.c), baseN = m * x;
      const powerBase = trim(baseN + offset(seed, 0)), divisor = trim(m + offset(seed, 2)), off = trim(c + offset(seed, 5));
      const stem = `What approximate value should replace ? in ${e1r2Math(`\\frac{(${powerBase})^{2}}{${divisor}} + ${off} = ?`)}?`;
      return withPresentation(base, stem, [`Take ${powerBase} ≈ ${baseN}, ${divisor} ≈ ${m}, and ${off} ≈ ${c}.`, `${baseN}² ÷ ${m} + ${c} = ${base.canonicalAnswer}.`], "HARD", { displayBase: powerBase, displayDivisor: divisor, displayOffset: off });
    }
    case "CP010-R2-APPROX-ROOT-CUBE-COMBO": {
      const a = Number(d.a), u = Number(d.u), m = Number(d.m), c = Number(d.c);
      const sq = trim(a * a + squareOffset(seed)), cu = trim(u ** 3 + cubeOffset(seed)), mult = trim(m + offset(seed, 3)), off = trim(c + offset(seed, 6));
      const stem = `Find the approximate value of ${e1r2Math(`${squareRoot(sq)} + ${cubeRoot(cu)} \\times ${mult} - ${off}`)}.`;
      return withPresentation(base, stem, [`${e1r2Math(squareRoot(sq))} ≈ ${a} and ${e1r2Math(cubeRoot(cu))} ≈ ${u}; also ${mult} ≈ ${m} and ${off} ≈ ${c}.`, `${a} + ${u} × ${m} - ${c} = ${base.canonicalAnswer}.`], "HARD", { displaySquare: sq, displayCube: cu, displayMultiplier: mult, displayOffset: off });
    }
    case "CP010-R2-APPROX-ROOT-QUOTIENT": {
      const q = Number(d.q), x = Number(d.x), m = Number(d.m), c = Number(d.c), rootBase = q * x;
      const sq = trim(rootBase * rootBase + squareOffset(seed)), mult = trim(m + offset(seed, 1)), divisor = trim(q + offset(seed, 4)), off = trim(c + offset(seed, 7));
      const stem = `What is the approximate value of ${e1r2Math(`\\frac{${squareRoot(sq)} \\times ${mult}}{${divisor}} - ${off}`)}?`;
      return withPresentation(base, stem, [`${e1r2Math(squareRoot(sq))} ≈ ${rootBase}, ${mult} ≈ ${m}, ${divisor} ≈ ${q}, and ${off} ≈ ${c}.`, `${rootBase} × ${m} ÷ ${q} - ${c} = ${base.canonicalAnswer}.`], "HARD", { displaySquare: sq, displayMultiplier: mult, displayDivisor: divisor, displayOffset: off });
    }
    default:
      return base;
  }
}

function recalibrateSupplied(base: SapE1R2Package): SapE1R2Package {
  if (!base.structureId.includes("SUPPLIED-ROOT")) return base;
  const hard = base.structureId === "CP010-R2-SUPPLIED-ROOT-DIFFERENCE" || base.structureId === "CP010-R2-SUPPLIED-ROOT-QUOTIENT";
  return Object.freeze({ ...base, difficulty: hard ? "HARD" : "MEDIUM" });
}

export function generateSapCp010E1R2(structureId: SapCp010E1R2Structure, seed: number): SapE1R2Package {
  return recalibrateSupplied(diversifyUnguided(generateFinal(structureId, seed)));
}
