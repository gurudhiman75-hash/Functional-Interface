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

function gcd(a: bigint, b: bigint) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) [x, y] = [y, x % y];
  return x;
}

function reduced(n: bigint, d: bigint) {
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return { n: (n / divisor) * sign, d: (d / divisor) * sign };
}

function terminatingDecimal(n: bigint, d: bigint): string | null {
  const r = reduced(n, d);
  let denominator = r.d;
  while (denominator % 2n === 0n) denominator /= 2n;
  while (denominator % 5n === 0n) denominator /= 5n;
  if (denominator !== 1n) return null;

  const value = Number(r.n) / Number(r.d);
  if (!Number.isFinite(value)) return null;
  return value.toFixed(8).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, "").replace(/\.$/, "");
}

function formatRational(n: bigint, d: bigint, preferDecimal = false) {
  const r = reduced(n, d);
  if (r.d === 1n) return String(r.n);
  if (preferDecimal) {
    const decimal = terminatingDecimal(r.n, r.d);
    if (decimal) return decimal;
  }
  return `${r.n}/${r.d}`;
}

function piValue(policy: DirectQuestion["piPolicy"]) {
  return policy === "PI_22_OVER_7" ? "22/7" : policy === "PI_3_14" ? "3.14" : "π";
}

function withPi(n: bigint, d: bigint, policy: DirectQuestion["piPolicy"]) {
  if (policy === "EXACT_PI") {
    const coefficient = formatRational(n, d);
    return coefficient === "1" ? "π" : coefficient === "-1" ? "-π" : `${coefficient}π`;
  }
  if (policy === "PI_22_OVER_7") return formatRational(n * 22n, d * 7n);
  return formatRational(n * 157n, d * 50n, true);
}

function decimaliseTerminatingFractions(value: string) {
  return value.replace(/(-?\d+)\/(\d+)/g, (whole, nRaw, dRaw) => {
    const n = BigInt(nRaw);
    const d = BigInt(dRaw);
    if (d === 0n) return whole;
    return terminatingDecimal(n, d) ?? whole;
  });
}

function displayForQuestion(value: string, question: MenCp009QuestionV2) {
  const plain = toPlainStudentMath(value);
  return "piPolicy" in question && question.piPolicy === "PI_3_14"
    ? decimaliseTerminatingFractions(plain)
    : plain;
}

function cleanEnglishStem(value: string) {
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
    .replace(/Find surface area : volume\./, "What is the ratio surface area : volume?")
    .replace(/Find curved surface area : volume\./, "What is the ratio curved surface area : volume?")
    .replace(/Find total surface area : volume\./, "What is the ratio total surface area : volume?")
    .replace(/\s+/g, " ")
    .trim();
}

function baseUnit(stem: string) {
  const match = stem.match(/\b(cm|m)\b/);
  return match?.[1] ?? "";
}

function firstValueAfter(stem: string, label: string) {
  const start = stem.toLowerCase().indexOf(label.toLowerCase());
  if (start < 0) return "the given value";
  const tail = stem.slice(start + label.length).trim();
  const end = tail.indexOf(".");
  return (end >= 0 ? tail.slice(0, end) : tail).trim();
}

function directTeaching(
  question: DirectQuestion,
  stem: string,
  answer: string,
): string[] {
  const s = question.state;
  const r = s.radius;
  const d = s.diameter;
  const r2 = r * r;
  const r3 = r2 * r;
  const p = piValue(question.piPolicy);
  const u = baseUnit(stem);
  const areaUnit = u ? `${u}²` : "square units";
  const volumeUnit = u ? `${u}³` : "cubic units";
  const piGiven = question.piPolicy === "EXACT_PI" ? "" : ` and π = ${p}`;

  switch (question.familyId) {
    case "SPHERE_SURFACE_FROM_RADIUS": {
      const result = `${withPi(4n * r2, 1n, question.piPolicy)} ${areaUnit}`;
      return [
        "For a sphere, surface area is S = 4πr².",
        `Here r = ${r} ${u}${piGiven}.`,
        `Putting the values into the formula: S = 4 × ${p} × ${r}².`,
        `${r}² = ${r2}, so S = 4 × ${p} × ${r2} = ${result}.`,
        `So the surface area is ${answer}.`,
      ];
    }
    case "SPHERE_SURFACE_FROM_DIAMETER": {
      const d2 = d * d;
      const result = `${withPi(d2, 1n, question.piPolicy)} ${areaUnit}`;
      return [
        "Since the diameter is given, use the direct form S = πd².",
        `Here d = ${d} ${u}${piGiven}.`,
        `Substitute the values: S = ${p} × ${d}².`,
        `${d}² = ${d2}, so S = ${p} × ${d2} = ${result}.`,
        `So the surface area is ${answer}.`,
      ];
    }
    case "SPHERE_VOLUME_FROM_RADIUS": {
      const result = `${withPi(4n * r3, 3n, question.piPolicy)} ${volumeUnit}`;
      return [
        "For a sphere, volume is V = 4/3 × πr³.",
        `Here r = ${r} ${u}${piGiven}.`,
        `Substitute the values: V = 4/3 × ${p} × ${r}³.`,
        `${r}³ = ${r3}, so V = 4/3 × ${p} × ${r3} = ${result}.`,
        `So the volume is ${answer}.`,
      ];
    }
    case "SPHERE_VOLUME_FROM_DIAMETER": {
      const d3 = d * d * d;
      const result = `${withPi(d3, 6n, question.piPolicy)} ${volumeUnit}`;
      return [
        "With diameter d, sphere volume can be written as V = πd³/6.",
        `Here d = ${d} ${u}${piGiven}.`,
        `Substitute the values: V = ${p} × ${d}³ ÷ 6.`,
        `${d}³ = ${d3}, so V = ${p} × ${d3} ÷ 6 = ${result}.`,
        `So the volume is ${answer}.`,
      ];
    }
    case "SPHERE_RADIUS_FROM_SURFACE":
    case "SPHERE_DIAMETER_FROM_SURFACE": {
      const given = displayForQuestion(firstValueAfter(buildMenCp009StudentView(question).stem, "surface area"), question);
      const diameterAsked = question.familyId === "SPHERE_DIAMETER_FROM_SURFACE";
      return [
        "Start with the sphere surface-area formula S = 4πr².",
        `Using S = ${given}${piGiven}, r² = S ÷ (4π) = ${r2}.`,
        `Therefore r = √${r2} = ${r} ${u}.`,
        ...(diameterAsked ? [`Diameter = 2r = 2 × ${r} = ${d} ${u}.`] : []),
        `So the ${diameterAsked ? "diameter" : "radius"} is ${answer}.`,
      ];
    }
    case "SPHERE_RADIUS_FROM_VOLUME":
    case "SPHERE_DIAMETER_FROM_VOLUME": {
      const given = displayForQuestion(firstValueAfter(buildMenCp009StudentView(question).stem, "volume"), question);
      const diameterAsked = question.familyId === "SPHERE_DIAMETER_FROM_VOLUME";
      return [
        "Start with the sphere volume formula V = 4/3 × πr³.",
        `Using V = ${given}${piGiven}, r³ = 3V ÷ (4π) = ${r3}.`,
        `Therefore r = ∛${r3} = ${r} ${u}.`,
        ...(diameterAsked ? [`Diameter = 2r = 2 × ${r} = ${d} ${u}.`] : []),
        `So the ${diameterAsked ? "diameter" : "radius"} is ${answer}.`,
      ];
    }
    case "HEMISPHERE_CSA_FROM_RADIUS": {
      const result = `${withPi(2n * r2, 1n, question.piPolicy)} ${areaUnit}`;
      return [
        "Only the curved part is needed, so use hemisphere CSA = 2πr².",
        `Here r = ${r} ${u}${piGiven}.`,
        `Substitute: CSA = 2 × ${p} × ${r}².`,
        `${r}² = ${r2}, so CSA = 2 × ${p} × ${r2} = ${result}.`,
        `So the curved surface area is ${answer}.`,
      ];
    }
    case "HEMISPHERE_TSA_FROM_RADIUS": {
      const result = `${withPi(3n * r2, 1n, question.piPolicy)} ${areaUnit}`;
      return [
        "Total surface area includes the curved part and the circular base, so TSA = 3πr².",
        `Here r = ${r} ${u}${piGiven}.`,
        `Substitute: TSA = 3 × ${p} × ${r}².`,
        `${r}² = ${r2}, so TSA = 3 × ${p} × ${r2} = ${result}.`,
        `So the total surface area is ${answer}.`,
      ];
    }
    case "HEMISPHERE_VOLUME_FROM_RADIUS": {
      const result = `${withPi(2n * r3, 3n, question.piPolicy)} ${volumeUnit}`;
      return [
        "A hemisphere is half a sphere, so its volume is V = 2/3 × πr³.",
        `Here r = ${r} ${u}${piGiven}.`,
        `Substitute: V = 2/3 × ${p} × ${r}³.`,
        `${r}³ = ${r3}, so V = 2/3 × ${p} × ${r3} = ${result}.`,
        `So the volume is ${answer}.`,
      ];
    }
    case "HEMISPHERE_RADIUS_FROM_CSA": {
      const given = displayForQuestion(firstValueAfter(buildMenCp009StudentView(question).stem, "curved area"), question);
      return [
        "For a hemisphere, curved surface area is 2πr².",
        `Using CSA = ${given}${piGiven}, r² = CSA ÷ (2π) = ${r2}.`,
        `So r = √${r2} = ${r} ${u}.`,
        `Therefore, the radius is ${answer}.`,
      ];
    }
    case "HEMISPHERE_RADIUS_FROM_TSA": {
      const given = displayForQuestion(firstValueAfter(buildMenCp009StudentView(question).stem, "total area"), question);
      return [
        "For a solid hemisphere, total surface area is 3πr².",
        `Using TSA = ${given}${piGiven}, r² = TSA ÷ (3π) = ${r2}.`,
        `So r = √${r2} = ${r} ${u}.`,
        `Therefore, the radius is ${answer}.`,
      ];
    }
    case "HEMISPHERE_RADIUS_FROM_VOLUME": {
      const given = displayForQuestion(firstValueAfter(buildMenCp009StudentView(question).stem, "volume"), question);
      return [
        "For a hemisphere, volume is V = 2/3 × πr³.",
        `Using V = ${given}${piGiven}, r³ = 3V ÷ (2π) = ${r3}.`,
        `So r = ∛${r3} = ${r} ${u}.`,
        `Therefore, the radius is ${answer}.`,
      ];
    }
    case "HEMISPHERE_CAPACITY_LITRES": {
      const cm3 = `${withPi(2n * r3, 3n, question.piPolicy)} cm³`;
      const litres = `${withPi(2n * r3, 3000n, question.piPolicy)} litres`;
      return [
        "Capacity comes from the inside volume of the hemisphere: V = 2/3 × πr³.",
        `Here r = ${r} cm${piGiven}.`,
        `Substitute: V = 2/3 × ${p} × ${r}³ = 2/3 × ${p} × ${r3} = ${cm3}.`,
        `Since 1000 cm³ = 1 litre, divide by 1000: capacity = ${litres}.`,
        `So the capacity is ${answer}.`,
      ];
    }
    case "SPHERE_PAINTING_COST": {
      const rate = s.rate!;
      const area = `${withPi(4n * r2, 1n, question.piPolicy)} m²`;
      const cost = `₹${withPi(4n * r2 * rate, 1n, question.piPolicy)}`;
      return [
        "First find the area to be painted. For a sphere, surface area = 4πr².",
        `With r = ${r} m${piGiven}, area = 4 × ${p} × ${r}² = ${area}.`,
        `Painting rate = ₹${rate} per m², so cost = area × rate.`,
        `Cost = ${area.replace(" m²", "")} × ${rate} = ${cost}.`,
        `So the painting cost is ${answer}.`,
      ];
    }
    case "HEMISPHERE_INNER_POLISHING_COST": {
      const rate = s.rate!;
      const area = `${withPi(2n * r2, 1n, question.piPolicy)} m²`;
      const cost = `₹${withPi(2n * r2 * rate, 1n, question.piPolicy)}`;
      return [
        "Only the inside curved surface is polished, so use area = 2πr².",
        `With r = ${r} m${piGiven}, curved area = 2 × ${p} × ${r}² = ${area}.`,
        `Polishing rate = ₹${rate} per m², so cost = area × rate.`,
        `Cost = ${area.replace(" m²", "")} × ${rate} = ${cost}.`,
        `So the polishing cost is ${answer}.`,
      ];
    }
    case "SPHERE_SURFACE_RATIO": {
      const r2b = s.secondRadius!;
      return [
        "Sphere surface area depends on r², so square the radius ratio.",
        `The radii are ${r} and ${r2b}, so the radius ratio is ${r}:${r2b}.`,
        `Surface-area ratio = ${r}²:${r2b}² = ${r * r}:${r2b * r2b}.`,
        `Reduce the ratio to get ${answer}.`,
      ];
    }
    case "SPHERE_VOLUME_RATIO": {
      const r2b = s.secondRadius!;
      return [
        "Sphere volume depends on r³, so cube the radius ratio.",
        `The radii are ${r} and ${r2b}, so the radius ratio is ${r}:${r2b}.`,
        `Volume ratio = ${r}³:${r2b}³ = ${r * r * r}:${r2b * r2b * r2b}.`,
        `Reduce the ratio to get ${answer}.`,
      ];
    }
    case "RADIUS_RATIO_FROM_SURFACE_RATIO": {
      const r2b = s.secondRadius!;
      return [
        "Surface-area ratio is the square of the radius ratio.",
        `So take the square root of both terms of the given area ratio.`,
        `√(${r * r}:${r2b * r2b}) = ${r}:${r2b}.`,
        `Therefore, the radius ratio is ${answer}.`,
      ];
    }
    case "RADIUS_RATIO_FROM_VOLUME_RATIO": {
      const r2b = s.secondRadius!;
      return [
        "Volume ratio is the cube of the radius ratio.",
        "So take the cube root of both terms of the given volume ratio.",
        `∛(${r * r * r}:${r2b * r2b * r2b}) = ${r}:${r2b}.`,
        `Therefore, the radius ratio is ${answer}.`,
      ];
    }
    case "SPHERE_SURFACE_PERCENT_CHANGE": {
      const change = Number(s.percentageChange!);
      const factor = 1 + change / 100;
      const areaFactor = factor * factor;
      const increase = (areaFactor - 1) * 100;
      return [
        "Surface area is proportional to r², so the change in radius must be squared.",
        `A ${change}% increase makes the new radius ${factor.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} times the old radius.`,
        `New area factor = ${factor.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}² = ${areaFactor.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}.`,
        `Increase = (${areaFactor.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")} − 1) × 100 = ${increase.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}%.`,
        `So the surface area increases by ${answer}.`,
      ];
    }
    case "SPHERE_VOLUME_PERCENT_CHANGE": {
      const change = Number(s.percentageChange!);
      const factor = 1 + change / 100;
      const volumeFactor = factor * factor * factor;
      const increase = (volumeFactor - 1) * 100;
      return [
        "Volume is proportional to r³, so the change in radius must be cubed.",
        `A ${change}% increase makes the new radius ${factor.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} times the old radius.`,
        `New volume factor = ${factor.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}³ = ${volumeFactor.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")}.`,
        `Increase = (${volumeFactor.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")} − 1) × 100 = ${increase.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}%.`,
        `So the volume increases by ${answer}.`,
      ];
    }
    case "SPHERE_HEMISPHERE_MEASURE_RATIO": {
      if (/volume/i.test(stem)) {
        return [
          "For the same radius, sphere volume is 4/3 × πr³ and hemisphere volume is 2/3 × πr³.",
          "Put them in the required order: 4/3 × πr³ : 2/3 × πr³.",
          "Cancel πr³ and the common factor 1/3, leaving 4:2 = 2:1.",
          `So the required ratio is ${answer}.`,
        ];
      }
      return [
        "For the same radius, sphere surface area is 4πr² and hemisphere total area is 3πr².",
        "Put them in the required order: 4πr² : 3πr².",
        "Cancel the common πr², leaving 4:3.",
        `So the required ratio is ${answer}.`,
      ];
    }
    default:
      return [
        "Use the formula that matches the measure asked in the question.",
        ...buildMenCp009StudentView(question).explanationLines.slice(1, -1),
        `So the answer is ${answer}.`,
      ];
  }
}

function coverageTeaching(
  question: Exclude<MenCp009QuestionV2, DirectQuestion>,
  answer: string,
): string[] {
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
        "Divide TSA by volume; π and r² cancel, giving 9:2r.",
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
      return [`Work through the matching mensuration formulas step by step.`, `So the answer is ${answer}.`];
  }
}

export function buildMenCp009TeachingExplanation(
  question: MenCp009QuestionV2,
  stem: string,
  answer: string,
) {
  return "state" in question
    ? directTeaching(question, stem, answer)
    : coverageTeaching(question, answer);
}

export function buildMenCp009StudentViewV4(
  question: MenCp009QuestionV2,
): MenCp009StudentViewV4 {
  const old = buildMenCp009StudentView(question);
  const stem = cleanEnglishStem(displayForQuestion(old.stem, question));
  const options = old.options.map((option) => ({
    ...option,
    display: displayForQuestion(option.display, question),
  }));
  const answer = displayForQuestion(old.answer, question);
  const explanationLines = buildMenCp009TeachingExplanation(question, stem, answer)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return {
    authority: MEN_CP_009_STUDENT_VIEW_V4_AUTHORITY,
    permanentQlId: old.permanentQlId,
    familyId: old.familyId,
    solveMode: old.solveMode,
    seed: old.seed,
    difficulty: old.difficulty,
    target: old.target,
    stem,
    options,
    correctIndex: old.correctIndex,
    answer,
    explanationLines,
    showDiagram: false,
    diagramReason:
      "A generic sphere or hemisphere picture does not add information to these direct measurement questions, so the learner view stays text-first.",
    sourceValidationPassed: old.sourceValidationPassed,
    sourceVerificationPassed: old.sourceVerificationPassed,
    lifecycleStatus: "REVIEW_CANDIDATE_NOT_APPROVED",
  };
}
