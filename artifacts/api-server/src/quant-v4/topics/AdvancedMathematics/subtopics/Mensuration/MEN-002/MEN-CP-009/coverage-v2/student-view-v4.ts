import type { MenCp009QuestionV2 } from "./runtime";
import {
  buildMenCp009StudentView,
  toPlainStudentMath,
  type MenCp009StudentOption,
} from "./student-view-v3";

export const MEN_CP_009_STUDENT_VIEW_V4_AUTHORITY =
  "MEN-CP009-STUDENT-VIEW-V4-TEACHING" as const;

export interface MenCp009StudentViewV4 {
  authority: typeof MEN_CP_009_STUDENT_VIEW_V4_AUTHORITY;
  permanentQlId: string;
  familyId: string;
  solveMode: string;
  seed: string;
  difficulty: string;
  target: string;
  stem: string;
  options: MenCp009StudentOption[];
  correctIndex: number;
  answer: string;
  explanationLines: string[];
  showDiagram: false;
  diagramReason: string;
  sourceValidationPassed: boolean;
  sourceVerificationPassed: boolean;
  lifecycleStatus: "REVIEW_CANDIDATE_NOT_APPROVED";
}

type DirectQuestion = Extract<MenCp009QuestionV2, { piPolicy: unknown }>;
type CoverageQuestion = Exclude<MenCp009QuestionV2, DirectQuestion>;

function gcd(a: bigint, b: bigint) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

function reduce(n: bigint, d: bigint) {
  const sign = d < 0n ? -1n : 1n;
  const g = gcd(n, d);
  return { n: (n / g) * sign, d: (d / g) * sign };
}

function trimDecimal(value: string) {
  return value.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
}

function terminatingDecimal(n: bigint, d: bigint): string | null {
  const r = reduce(n, d);
  let denominator = r.d;
  while (denominator % 2n === 0n) denominator /= 2n;
  while (denominator % 5n === 0n) denominator /= 5n;
  if (denominator !== 1n) return null;
  const value = Number(r.n) / Number(r.d);
  return Number.isFinite(value) ? trimDecimal(value.toFixed(8)) : null;
}

function rationalText(n: bigint, d: bigint, preferDecimal = false) {
  const r = reduce(n, d);
  if (r.d === 1n) return String(r.n);
  if (preferDecimal) return terminatingDecimal(r.n, r.d) ?? `${r.n}/${r.d}`;
  return `${r.n}/${r.d}`;
}

function piText(policy: DirectQuestion["piPolicy"]) {
  return policy === "PI_22_OVER_7" ? "22/7" : policy === "PI_3_14" ? "3.14" : "π";
}

function evaluatePiMultiple(n: bigint, d: bigint, policy: DirectQuestion["piPolicy"]) {
  if (policy === "EXACT_PI") {
    const coefficient = rationalText(n, d);
    return coefficient === "1" ? "π" : `${coefficient}π`;
  }
  if (policy === "PI_22_OVER_7") return rationalText(n * 22n, d * 7n);
  return rationalText(n * 157n, d * 50n, true);
}

function decimaliseTerminatingFractions(value: string) {
  return value.replace(/(-?\d+)\/(\d+)/g, (whole, nRaw, dRaw) => {
    const d = BigInt(dRaw);
    if (d === 0n) return whole;
    return terminatingDecimal(BigInt(nRaw), d) ?? whole;
  });
}

function learnerDisplay(value: string, question: MenCp009QuestionV2) {
  const plain = toPlainStudentMath(value);
  return "piPolicy" in question && question.piPolicy === "PI_3_14"
    ? decimaliseTerminatingFractions(plain)
    : plain;
}

function naturalEnglishStem(value: string) {
  return value
    .replace(/\bTake π =/g, "Use π =")
    .replace(/^A sphere has radius /, "A sphere has a radius of ")
    .replace(/^A sphere has diameter /, "A sphere has a diameter of ")
    .replace(/^A hemispherical dome has radius /, "A hemispherical dome has a radius of ")
    .replace(/^A solid hemisphere has radius /, "A solid hemisphere has a radius of ")
    .replace(/^A hemispherical vessel has internal radius /, "A hemispherical vessel has an inner radius of ")
    .replace(/\. Find its surface area\./, ". What is its surface area?")
    .replace(/\. Find its volume\./, ". What is its volume?")
    .replace(/\. Find its radius\./, ". What is its radius?")
    .replace(/\. Find its diameter\./, ". What is its diameter?")
    .replace(/\. Find its curved surface area\./, ". What is its curved surface area?")
    .replace(/\. Find its total surface area\./, ". What is its total surface area?")
    .replace(/\. Find its capacity in litres\./, ". What is its capacity in litres?")
    .replace(/\. Find the cost\./, ". What is the cost?")
    .replace(/Find the percentage increase in its surface area\./, "By what percentage does its surface area increase?")
    .replace(/Find the percentage increase in its volume\./, "By what percentage does its volume increase?")
    .replace(/Find the ratio of their surface areas, in the order given\./, "What is the ratio of their surface areas, in the same order?")
    .replace(/Find the ratio of their volumes, in the order given\./, "What is the ratio of their volumes, in the same order?")
    .replace(/Find their radius ratio\./, "What is the ratio of their radii?")
    .replace(/Find surface area : volume\./, "What is surface area : volume?")
    .replace(/Find curved surface area : volume\./, "What is curved surface area : volume?")
    .replace(/Find total surface area : volume\./, "What is total surface area : volume?")
    .replace(/\s+/g, " ")
    .trim();
}

function baseUnit(stem: string) {
  return stem.match(/\b(cm|m)\b/)?.[1] ?? "";
}

function oldGiven(stem: string, label: string) {
  const index = stem.toLowerCase().indexOf(label.toLowerCase());
  if (index < 0) return "the given value";
  const tail = stem.slice(index + label.length).trim();
  return tail.slice(0, tail.indexOf(".") >= 0 ? tail.indexOf(".") : undefined).trim();
}

function directExplanation(question: DirectQuestion, stem: string, answer: string): string[] {
  const old = buildMenCp009StudentView(question);
  const s = question.state;
  const r = s.radius;
  const d = s.diameter;
  const r2 = r * r;
  const r3 = r2 * r;
  const p = piText(question.piPolicy);
  const unit = baseUnit(stem);
  const areaUnit = unit ? `${unit}²` : "square units";
  const volumeUnit = unit ? `${unit}³` : "cubic units";
  const piPhrase = question.piPolicy === "EXACT_PI" ? "" : ` and π = ${p}`;

  switch (question.familyId) {
    case "SPHERE_SURFACE_FROM_RADIUS":
      return [
        "For a sphere, surface area is S = 4πr².",
        `Here r = ${r} ${unit}${piPhrase}.`,
        `Putting the values into the formula gives S = 4 × ${p} × ${r}².`,
        `${r}² = ${r2}, so S = 4 × ${p} × ${r2} = ${evaluatePiMultiple(4n * r2, 1n, question.piPolicy)} ${areaUnit}.`,
        `So the surface area is ${answer}.`,
      ];
    case "SPHERE_SURFACE_FROM_DIAMETER": {
      const d2 = d * d;
      return [
        "Because the diameter is given, use the direct form S = πd².",
        `Here d = ${d} ${unit}${piPhrase}.`,
        `Putting the values into the formula gives S = ${p} × ${d}².`,
        `${d}² = ${d2}, so S = ${p} × ${d2} = ${evaluatePiMultiple(d2, 1n, question.piPolicy)} ${areaUnit}.`,
        `So the surface area is ${answer}.`,
      ];
    }
    case "SPHERE_VOLUME_FROM_RADIUS":
      return [
        "For a sphere, volume is V = 4/3 × πr³.",
        `Here r = ${r} ${unit}${piPhrase}.`,
        `Putting the values into the formula gives V = 4/3 × ${p} × ${r}³.`,
        `${r}³ = ${r3}, so V = 4/3 × ${p} × ${r3} = ${evaluatePiMultiple(4n * r3, 3n, question.piPolicy)} ${volumeUnit}.`,
        `So the volume is ${answer}.`,
      ];
    case "SPHERE_VOLUME_FROM_DIAMETER": {
      const d3 = d * d * d;
      return [
        "When diameter is given, sphere volume can be written as V = πd³/6.",
        `Here d = ${d} ${unit}${piPhrase}.`,
        `Putting the values into the formula gives V = ${p} × ${d}³ ÷ 6.`,
        `${d}³ = ${d3}, so V = ${p} × ${d3} ÷ 6 = ${evaluatePiMultiple(d3, 6n, question.piPolicy)} ${volumeUnit}.`,
        `So the volume is ${answer}.`,
      ];
    }
    case "SPHERE_RADIUS_FROM_SURFACE":
    case "SPHERE_DIAMETER_FROM_SURFACE": {
      const diameterAsked = question.familyId === "SPHERE_DIAMETER_FROM_SURFACE";
      const given = learnerDisplay(oldGiven(old.stem, "surface area"), question);
      return [
        "Start with the sphere formula S = 4πr².",
        `Here S = ${given}${piPhrase}. Rearranging gives r² = S ÷ (4π).`,
        `Substituting the given values gives r² = ${r2}.`,
        `So r = √${r2} = ${r} ${unit}.${diameterAsked ? ` Then d = 2r = ${d} ${unit}.` : ""}`.trim(),
        `Therefore, the ${diameterAsked ? "diameter" : "radius"} is ${answer}.`,
      ];
    }
    case "SPHERE_RADIUS_FROM_VOLUME":
    case "SPHERE_DIAMETER_FROM_VOLUME": {
      const diameterAsked = question.familyId === "SPHERE_DIAMETER_FROM_VOLUME";
      const given = learnerDisplay(oldGiven(old.stem, "volume"), question);
      return [
        "Start with the sphere formula V = 4/3 × πr³.",
        `Here V = ${given}${piPhrase}. Rearranging gives r³ = 3V ÷ (4π).`,
        `Substituting the given values gives r³ = ${r3}.`,
        `So r = ∛${r3} = ${r} ${unit}.${diameterAsked ? ` Then d = 2r = ${d} ${unit}.` : ""}`.trim(),
        `Therefore, the ${diameterAsked ? "diameter" : "radius"} is ${answer}.`,
      ];
    }
    case "HEMISPHERE_CSA_FROM_RADIUS":
      return [
        "Only the curved part is needed, so use hemisphere CSA = 2πr².",
        `Here r = ${r} ${unit}${piPhrase}.`,
        `Substitute the values: CSA = 2 × ${p} × ${r}².`,
        `${r}² = ${r2}, so CSA = 2 × ${p} × ${r2} = ${evaluatePiMultiple(2n * r2, 1n, question.piPolicy)} ${areaUnit}.`,
        `So the curved surface area is ${answer}.`,
      ];
    case "HEMISPHERE_TSA_FROM_RADIUS":
      return [
        "Total surface area includes the curved part and the circular base, so TSA = 3πr².",
        `Here r = ${r} ${unit}${piPhrase}.`,
        `Substitute the values: TSA = 3 × ${p} × ${r}².`,
        `${r}² = ${r2}, so TSA = 3 × ${p} × ${r2} = ${evaluatePiMultiple(3n * r2, 1n, question.piPolicy)} ${areaUnit}.`,
        `So the total surface area is ${answer}.`,
      ];
    case "HEMISPHERE_VOLUME_FROM_RADIUS":
      return [
        "A hemisphere is half a sphere, so its volume is V = 2/3 × πr³.",
        `Here r = ${r} ${unit}${piPhrase}.`,
        `Substitute the values: V = 2/3 × ${p} × ${r}³.`,
        `${r}³ = ${r3}, so V = 2/3 × ${p} × ${r3} = ${evaluatePiMultiple(2n * r3, 3n, question.piPolicy)} ${volumeUnit}.`,
        `So the volume is ${answer}.`,
      ];
    case "HEMISPHERE_RADIUS_FROM_CSA": {
      const given = learnerDisplay(oldGiven(old.stem, "curved area"), question);
      return [
        "For a hemisphere, curved surface area is CSA = 2πr².",
        `Here CSA = ${given}${piPhrase}. Rearranging gives r² = CSA ÷ (2π).`,
        `Substituting the values gives r² = ${r2}.`,
        `So r = √${r2} = ${r} ${unit}.`,
        `Therefore, the radius is ${answer}.`,
      ];
    }
    case "HEMISPHERE_RADIUS_FROM_TSA": {
      const given = learnerDisplay(oldGiven(old.stem, "total area"), question);
      return [
        "For a solid hemisphere, total surface area is TSA = 3πr².",
        `Here TSA = ${given}${piPhrase}. Rearranging gives r² = TSA ÷ (3π).`,
        `Substituting the values gives r² = ${r2}.`,
        `So r = √${r2} = ${r} ${unit}.`,
        `Therefore, the radius is ${answer}.`,
      ];
    }
    case "HEMISPHERE_RADIUS_FROM_VOLUME": {
      const given = learnerDisplay(oldGiven(old.stem, "volume"), question);
      return [
        "For a hemisphere, volume is V = 2/3 × πr³.",
        `Here V = ${given}${piPhrase}. Rearranging gives r³ = 3V ÷ (2π).`,
        `Substituting the values gives r³ = ${r3}.`,
        `So r = ∛${r3} = ${r} ${unit}.`,
        `Therefore, the radius is ${answer}.`,
      ];
    }
    case "HEMISPHERE_CAPACITY_LITRES":
      return [
        "Capacity comes from the inside volume of the hemisphere, so use V = 2/3 × πr³.",
        `Here r = ${r} cm${piPhrase}.`,
        `Substitute: V = 2/3 × ${p} × ${r}³ = 2/3 × ${p} × ${r3} = ${evaluatePiMultiple(2n * r3, 3n, question.piPolicy)} cm³.`,
        `Now convert cubic centimetres to litres by dividing by 1000: ${evaluatePiMultiple(2n * r3, 3000n, question.piPolicy)} litres.`,
        `So the capacity is ${answer}.`,
      ];
    case "SPHERE_PAINTING_COST": {
      const rate = s.rate!;
      const area = evaluatePiMultiple(4n * r2, 1n, question.piPolicy);
      return [
        "First find the surface area that will be painted: S = 4πr².",
        `With r = ${r} m${piPhrase}, area = 4 × ${p} × ${r}² = ${area} m².`,
        `The rate is ₹${rate} per m², so cost = area × rate.`,
        `Cost = ${area} × ${rate} = ₹${evaluatePiMultiple(4n * r2 * rate, 1n, question.piPolicy)}.`,
        `So the painting cost is ${answer}.`,
      ];
    }
    case "HEMISPHERE_INNER_POLISHING_COST": {
      const rate = s.rate!;
      const area = evaluatePiMultiple(2n * r2, 1n, question.piPolicy);
      return [
        "Only the inside curved surface is polished, so use area = 2πr².",
        `With r = ${r} m${piPhrase}, curved area = 2 × ${p} × ${r}² = ${area} m².`,
        `The rate is ₹${rate} per m², so cost = area × rate.`,
        `Cost = ${area} × ${rate} = ₹${evaluatePiMultiple(2n * r2 * rate, 1n, question.piPolicy)}.`,
        `So the polishing cost is ${answer}.`,
      ];
    }
    case "SPHERE_SURFACE_RATIO": {
      const other = s.secondRadius!;
      return [
        "Surface area of a sphere depends on r², so square the radius ratio.",
        `The radii are ${r} and ${other}, so start with ${r}:${other}.`,
        `Surface-area ratio = ${r}²:${other}² = ${r * r}:${other * other}.`,
        `Reduce this ratio to get ${answer}.`,
      ];
    }
    case "SPHERE_VOLUME_RATIO": {
      const other = s.secondRadius!;
      return [
        "Volume of a sphere depends on r³, so cube the radius ratio.",
        `The radii are ${r} and ${other}, so start with ${r}:${other}.`,
        `Volume ratio = ${r}³:${other}³ = ${r * r * r}:${other * other * other}.`,
        `Reduce this ratio to get ${answer}.`,
      ];
    }
    case "RADIUS_RATIO_FROM_SURFACE_RATIO": {
      const other = s.secondRadius!;
      return [
        "Surface-area ratio is the square of the radius ratio.",
        "So take the square root of both terms of the given surface-area ratio.",
        `√(${r * r}:${other * other}) = ${r}:${other}.`,
        `Therefore, the radius ratio is ${answer}.`,
      ];
    }
    case "RADIUS_RATIO_FROM_VOLUME_RATIO": {
      const other = s.secondRadius!;
      return [
        "Volume ratio is the cube of the radius ratio.",
        "So take the cube root of both terms of the given volume ratio.",
        `∛(${r * r * r}:${other * other * other}) = ${r}:${other}.`,
        `Therefore, the radius ratio is ${answer}.`,
      ];
    }
    case "SPHERE_SURFACE_PERCENT_CHANGE": {
      const change = Number(s.percentageChange!);
      const factor = 1 + change / 100;
      const resultFactor = factor * factor;
      const increase = (resultFactor - 1) * 100;
      return [
        "Surface area depends on r², so the radius-change factor must be squared.",
        `A ${change}% increase makes the new radius ${trimDecimal(factor.toFixed(4))} times the old radius.`,
        `New surface-area factor = ${trimDecimal(factor.toFixed(4))}² = ${trimDecimal(resultFactor.toFixed(6))}.`,
        `Percentage increase = (${trimDecimal(resultFactor.toFixed(6))} − 1) × 100 = ${trimDecimal(increase.toFixed(6))}%.`,
        `So the surface area increases by ${answer}.`,
      ];
    }
    case "SPHERE_VOLUME_PERCENT_CHANGE": {
      const change = Number(s.percentageChange!);
      const factor = 1 + change / 100;
      const resultFactor = factor * factor * factor;
      const increase = (resultFactor - 1) * 100;
      return [
        "Volume depends on r³, so the radius-change factor must be cubed.",
        `A ${change}% increase makes the new radius ${trimDecimal(factor.toFixed(4))} times the old radius.`,
        `New volume factor = ${trimDecimal(factor.toFixed(4))}³ = ${trimDecimal(resultFactor.toFixed(6))}.`,
        `Percentage increase = (${trimDecimal(resultFactor.toFixed(6))} − 1) × 100 = ${trimDecimal(increase.toFixed(6))}%.`,
        `So the volume increases by ${answer}.`,
      ];
    }
    case "SPHERE_HEMISPHERE_MEASURE_RATIO":
      return /volume/i.test(stem)
        ? [
            "For the same radius, sphere volume is 4/3 × πr³ and hemisphere volume is 2/3 × πr³.",
            "Write them in the required order: 4/3 × πr³ : 2/3 × πr³.",
            "Cancel πr³ and the common factor 1/3. This leaves 4:2 = 2:1.",
            `So the required ratio is ${answer}.`,
          ]
        : [
            "For the same radius, sphere surface area is 4πr² and hemisphere total area is 3πr².",
            "Write them in the required order: 4πr² : 3πr².",
            "Cancel the common πr². This leaves 4:3.",
            `So the required ratio is ${answer}.`,
          ];
    default:
      return [
        "Use the mensuration formula that matches the quantity asked in the question.",
        ...old.explanationLines.slice(1, -1),
        `So the answer is ${answer}.`,
      ];
  }
}

function coverageExplanation(question: CoverageQuestion, answer: string): string[] {
  const r = question.radius;
  switch (question.familyId) {
    case "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO":
      return [
        question.shape === "SPHERE"
          ? "For a sphere, surface area = 4πr² and volume = 4/3 × πr³."
          : "For a hemisphere, curved surface area = 2πr² and volume = 2/3 × πr³.",
        "Write area : volume and cancel the common π and r².",
        `The ratio becomes 3:r = 3:${r}.`,
        `After reducing, the required ratio is ${answer}.`,
      ];
    case "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO":
      return [
        "For these matching area and volume formulas, area : volume simplifies to 3:r.",
        `Match the given ratio ${question.givenRatio} with 3:r.`,
        `This gives r = ${r} cm.`,
        `So the radius is ${answer}.`,
      ];
    case "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO":
      return [
        "For a solid hemisphere, TSA = 3πr² and volume = 2/3 × πr³.",
        "Dividing TSA by volume cancels π and r², leaving 9:2r.",
        `With r = ${r} cm, the ratio is 9:${2 * r}.`,
        `After reducing, the required ratio is ${answer}.`,
      ];
    case "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO":
      return [
        "For a solid hemisphere, TSA : volume simplifies to 9:2r.",
        `Match the given ratio ${question.givenRatio} with 9:2r.`,
        `Solving the ratio gives 2r = ${2 * r}, so r = ${r} cm.`,
        `So the radius is ${answer}.`,
      ];
    default:
      return ["Work through the matching formulas step by step.", `So the answer is ${answer}.`];
  }
}

export function buildMenCp009TeachingExplanation(
  question: MenCp009QuestionV2,
  stem: string,
  answer: string,
) {
  return "state" in question
    ? directExplanation(question, stem, answer)
    : coverageExplanation(question, answer);
}

export function buildMenCp009StudentViewV4(
  question: MenCp009QuestionV2,
): MenCp009StudentViewV4 {
  const previous = buildMenCp009StudentView(question);
  const stem = naturalEnglishStem(learnerDisplay(previous.stem, question));
  const options = previous.options.map((option) => ({
    ...option,
    display: learnerDisplay(option.display, question),
  }));
  const answer = learnerDisplay(previous.answer, question);
  const explanationLines = buildMenCp009TeachingExplanation(question, stem, answer)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return {
    authority: MEN_CP_009_STUDENT_VIEW_V4_AUTHORITY,
    permanentQlId: previous.permanentQlId,
    familyId: previous.familyId,
    solveMode: previous.solveMode,
    seed: previous.seed,
    difficulty: previous.difficulty,
    target: previous.target,
    stem,
    options,
    correctIndex: previous.correctIndex,
    answer,
    explanationLines,
    showDiagram: false,
    diagramReason:
      "These questions do not need a generic shape picture; the learner view focuses on the reasoning and calculation.",
    sourceValidationPassed: previous.sourceValidationPassed,
    sourceVerificationPassed: previous.sourceVerificationPassed,
    lifecycleStatus: "REVIEW_CANDIDATE_NOT_APPROVED",
  };
}
