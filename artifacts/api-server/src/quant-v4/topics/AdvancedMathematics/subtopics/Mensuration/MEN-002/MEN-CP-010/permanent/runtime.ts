import {
  generateMenCp010PermanentEnglishQuestion as generateUnscheduledMenCp010PermanentEnglishQuestion,
  listMenCp010PermanentEnglishSources,
  type MenCp010PermanentEnglishQuestion,
} from "./runtime-v1";
import type { MenCp010PermanentQlId } from "./allocation";

const LABELS = ["A", "B", "C", "D"] as const;

function hash(text: string) {
  let h = 2166136261 >>> 0;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/**
 * Permanent English questions own their answer-position schedule at the
 * permanent layer. Source-wave shuffling remains useful for discovery, but it
 * must not make a permanent QL accidentally miss A/B/C/D coverage.
 */
function scheduledCorrectIndex(qlId: MenCp010PermanentQlId, seed: string) {
  const numericSuffix = /(\d+)(?!.*\d)/.exec(seed)?.[1];
  if (numericSuffix !== undefined) return Number(BigInt(numericSuffix) % 4n);
  return hash(`${qlId}:${seed}:permanent-answer-position`) % 4;
}

function scheduleOptions(
  q: MenCp010PermanentEnglishQuestion,
  targetIndex: number,
): MenCp010PermanentEnglishQuestion {
  const correct = q.options.find((option) => option.isCorrect);
  const wrong = q.options.filter((option) => !option.isCorrect);
  if (!correct || wrong.length !== 3) {
    throw new Error(`Cannot schedule options for ${q.permanentQlId}/${q.seed}`);
  }

  let wrongIndex = 0;
  const options = LABELS.map((label, index) => {
    const source = index === targetIndex ? correct : wrong[wrongIndex++]!;
    return { ...source, label };
  });

  return { ...q, options, correctIndex: targetIndex };
}

function rationalToDecimal(text: string) {
  const match = /^(-?\d+)\/(\d+)$/.exec(text.trim());
  if (!match) return text;
  const value = Number(match[1]) / Number(match[2]);
  if (!Number.isFinite(value)) return text;
  return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function decimalizeLeadingFraction(text: string) {
  const match = /^(-?\d+\/\d+)(\s.*)?$/.exec(text.trim());
  if (!match) return text;
  return `${rationalToDecimal(match[1]!)}${match[2] ?? ""}`;
}

function naturalPercentChange(text: string) {
  if (!text.endsWith("%")) return text;
  const numeric = rationalToDecimal(text.slice(0, -1));
  if (numeric.startsWith("-")) return `${numeric.slice(1)}% decrease`;
  if (numeric === "0") return "no change";
  return `${numeric}% increase`;
}

function answerUnitForSource(sourceId: string): string | null {
  if (sourceId === "CP010-D2-APP-BUCKET-CAPACITY-LITRES") return "litres";
  if (
    sourceId === "V3-REGULAR-PYRAMID-LSA" ||
    sourceId === "V3-REGULAR-PYRAMID-TSA" ||
    sourceId === "V3-REGULAR-FRUSTUM-LSA"
  ) return "cm²";
  if (sourceId === "V3-REGULAR-FRUSTUM-VOLUME") return "cm³";
  if (
    sourceId.includes("SIDE-FROM-VOLUME") ||
    sourceId.includes("LENGTH-FROM-VOLUME") ||
    sourceId.includes("HEIGHT-FROM-VOLUME") ||
    sourceId.includes("OUTER-RADIUS") ||
    sourceId.includes("LOWER-SIDE") ||
    sourceId.includes("FULL-HEIGHT-FROM-FRUSTUM") ||
    sourceId.includes("REMOVED-TOP-HEIGHT") ||
    sourceId.includes("CROSS-SECTION-SIDE") ||
    sourceId.includes("INVERSE-SLANT") ||
    sourceId === "V3-SURD-SLANT-REPRESENTATION"
  ) return "cm";
  return null;
}

function appendUnit(text: string, unit: string) {
  const trimmed = text.trim();
  if (/\b(?:cm|m|litres?)\b|[²³₹%]/.test(trimmed)) return trimmed;
  return `${trimmed} ${unit}`;
}

function editorialStem(q: MenCp010PermanentEnglishQuestion) {
  let stem = q.stem.replace(/pyramid\/frustum/g, "pyramid or frustum");
  switch (q.sourceId) {
    case "CP010-D2-INV-SQUARE-PYRAMID-SIDE-FROM-VOLUME":
      stem = stem.replace(
        /For a right square pyramid, volume = (\d+), vertical height = (\d+)\. Find base side\./,
        "A right square pyramid has volume $1 cm³ and vertical height $2 cm. Find the side of its square base.",
      );
      break;
    case "CP010-D2-INV-RECT-PYRAMID-LENGTH-FROM-VOLUME":
      stem = stem.replace(
        /For a right pyramid with a rectangular base, volume = (\d+), b=(\d+), vertical height = (\d+)\. Find the missing base length\./,
        "A right pyramid has volume $1 cm³, rectangular-base breadth $2 cm and vertical height $3 cm. Find the other base length.",
      );
      break;
    case "CP010-D2-INV-CONICAL-FRUSTUM-HEIGHT-FROM-VOLUME":
      stem = stem.replace(
        /For a conical frustum, volume = ([0-9]+π), larger radius = (\d+), smaller radius = (\d+)\. Find the vertical height\./,
        "A conical frustum has volume $1 cm³, larger radius $2 cm and smaller radius $3 cm. Find its vertical height.",
      );
      break;
    case "CP010-D2-INV-SQUARE-FRUSTUM-HEIGHT-FROM-VOLUME":
      stem = stem.replace(
        /For a right square-pyramid frustum, volume = (\d+), lower side=(\d+), upper side=(\d+)\. Find the vertical height\./,
        "A right square-pyramid frustum has volume $1 cm³, lower-base side $2 cm and upper-base side $3 cm. Find its vertical height.",
      );
      break;
    case "CP010-D2-INV-CONICAL-FRUSTUM-OUTER-RADIUS":
      stem = stem.replace(
        /For a conical frustum, smaller radius = (\d+), vertical height = (\d+), slant height = (\d+)\. Find the larger radius\./,
        "A conical frustum has smaller radius $1 cm, vertical height $2 cm and slant height $3 cm. Find its larger radius.",
      );
      break;
    case "CP010-D2-INV-SQUARE-FRUSTUM-LOWER-SIDE":
      stem = stem.replace(
        /For a right square-pyramid frustum, upper side=(\d+), vertical height = (\d+), slant height = (\d+)\. Find lower side\./,
        "A right square-pyramid frustum has upper-base side $1 cm, vertical height $2 cm and slant height $3 cm. Find its lower-base side.",
      );
      break;
    case "CP010-D2-RATIO-VOLUME-FROM-LINEAR":
      stem = stem.replace("Find volume ratio.", "Find the ratio of their volumes, first to second.");
      break;
    case "CP010-D2-RATIO-AREA-FROM-LINEAR":
      stem = stem.replace("Find surface-area ratio.", "Find the ratio of their surface areas, first to second.");
      break;
    case "CP010-D2-RATIO-LINEAR-FROM-VOLUME":
      stem = stem.replace(/Two similar solids have volume ratio ([0-9:]+)\. Find linear ratio\./, "The volumes of two similar solids are in the ratio $1. Find the ratio of their corresponding linear dimensions.");
      break;
    case "CP010-D2-RATIO-LINEAR-FROM-AREA":
      stem = stem.replace(/Two similar solids have surface-area ratio ([0-9:]+)\. Find linear ratio\./, "The surface areas of two similar solids are in the ratio $1. Find the ratio of their corresponding linear dimensions.");
      break;
    case "CP010-D2-RATIO-PYRAMID-TO-PRISM":
      stem = stem.replace(
        /A pyramid and a prism share base area (\d+) and height (\d+)\. Find pyramid:prism volume ratio\./,
        "A pyramid and a prism have the same base area, $1 cm², and the same height, $2 cm. Find the ratio of the pyramid's volume to the prism's volume.",
      );
      break;
    case "CP010-D2-SIMILAR-FULL-HEIGHT-FROM-FRUSTUM":
      stem = stem.replace(
        /A frustum has corresponding radii\/sides (\d+) and (\d+), frustum height (\d+)\. Find full parent-solid height\./,
        "A frustum has corresponding larger and smaller linear dimensions $1 cm and $2 cm, and frustum height $3 cm. Find the height of the complete parent solid.",
      );
      break;
    case "CP010-D2-SIMILAR-REMOVED-TOP-HEIGHT":
      stem = stem.replace(
        /A frustum has corresponding radii\/sides (\d+) and (\d+), frustum height (\d+)\. Find removed top height\./,
        "A frustum has corresponding larger and smaller linear dimensions $1 cm and $2 cm, and frustum height $3 cm. Find the height of the removed smaller top solid.",
      );
      break;
    case "CP010-D2-SIMILAR-CROSS-SECTION-SIDE":
      stem = stem.replace(
        /For a right square pyramid, base side=(\d+), height=(\d+)\. A parallel section is (\d+) from apex\. Find section side\./,
        "A right square pyramid has base side $1 cm and height $2 cm. A cross-section parallel to the base is $3 cm from the apex. Find the side of the square cross-section.",
      );
      break;
    case "CP010-D2-APP-BUCKET-CAPACITY-LITRES":
      stem = stem.replace(/, π=22\/7\. Find capacity in litres\./, ". Use π = 22/7. Find its capacity in litres.");
      break;
    case "CP010-D2-APP-SURFACE-COST":
      stem = stem.replace(
        /Square-pyramid lateral covering: a=(\d+) m, slant height = (\d+) m, rate=₹(\d+)\/m²\. Find cost\./,
        "The four triangular faces of a square pyramid with base side $1 m and slant height $2 m are covered at ₹$3 per m². Find the total covering cost.",
      );
      break;
    case "CP010-D2-SCALE-VOLUME-PERCENT-CHANGE":
      stem = stem.replace(/Every linear dimension of a similar pyramid or frustum becomes (\d+)% of original\. Find volume percentage change\./, "Each linear dimension of a similar pyramid or frustum becomes $1% of its original value. By what percentage does its volume increase or decrease?");
      break;
    case "CP010-D2-SCALE-AREA-PERCENT-CHANGE":
      stem = stem.replace(/Every linear dimension of a similar pyramid or frustum becomes (\d+)% of original\. Find surface-area percentage change\./, "Each linear dimension of a similar pyramid or frustum becomes $1% of its original value. By what percentage does its surface area increase or decrease?");
      break;
    case "V3-SURD-SLANT-REPRESENTATION":
      stem = stem.replace(/vertical height (\d+), half-base side (\d+)\./, "vertical height $1 cm and half-base side $2 cm.");
      break;
    case "V3-REGULAR-PYRAMID-LSA":
      stem = stem.replace(/base perimeter (\d+), face slant height (\d+)\./, "base perimeter $1 cm and face slant height $2 cm.");
      break;
    case "V3-REGULAR-PYRAMID-TSA":
      stem = stem
        .replace(/base area (\d+),/, "base area $1 cm²,")
        .replace(/base perimeter (\d+),/, "base perimeter $1 cm,")
        .replace(/slant height (\d+)\./, "slant height $1 cm.");
      break;
    case "V3-REGULAR-FRUSTUM-LSA":
      stem = stem.replace(/perimeters (\d+) and (\d+), slant height (\d+)\./, "base perimeters $1 cm and $2 cm, and slant height $3 cm.");
      break;
    case "V3-REGULAR-FRUSTUM-VOLUME":
      stem = stem.replace(/base areas (\d+) and (\d+), height (\d+)\./, "parallel-base areas $1 cm² and $2 cm², and vertical height $3 cm.");
      break;
    case "V3-PYRAMID-LSA-INVERSE-SLANT":
      stem = stem.replace(/side (\d+), LSA (\d+)\./, "base side $1 cm and lateral surface area $2 cm².");
      break;
    case "V3-PYRAMID-TSA-INVERSE-SLANT":
      stem = stem.replace(/side (\d+), TSA (\d+)\./, "base side $1 cm and total surface area $2 cm².");
      break;
    case "V3-CONICAL-FRUSTUM-CSA-INVERSE-SLANT":
      stem = stem.replace(/larger radius = (\d+), smaller radius = (\d+), CSA = ([0-9]+π)\./, "larger radius $1 cm, smaller radius $2 cm and curved surface area $3 cm².");
      break;
    case "V3-CONICAL-FRUSTUM-TSA-INVERSE-SLANT":
      stem = stem.replace(/larger radius = (\d+), smaller radius = (\d+), TSA = ([0-9]+π)\./, "larger radius $1 cm, smaller radius $2 cm and total surface area $3 cm².");
      break;
    case "V3-POLYGONAL-FRUSTUM-LSA-INVERSE-SLANT":
      stem = stem.replace(/perimeters (\d+), (\d+), LSA (\d+)\./, "base perimeters $1 cm and $2 cm, and lateral surface area $3 cm².");
      break;
    case "V3-POLYGONAL-FRUSTUM-TSA-INVERSE-SLANT":
      stem = stem.replace(/perimeters (\d+), (\d+), base areas (\d+), (\d+), TSA (\d+)\./, "base perimeters $1 cm and $2 cm, base areas $3 cm² and $4 cm², and total surface area $5 cm².");
      break;
  }
  return stem.replace(/\s+/g, " ").trim();
}

function editorialDisplay(q: MenCp010PermanentEnglishQuestion, display: string) {
  if (q.sourceId === "CP010-D2-SCALE-VOLUME-PERCENT-CHANGE" || q.sourceId === "CP010-D2-SCALE-AREA-PERCENT-CHANGE") {
    return naturalPercentChange(display);
  }
  if (q.sourceId === "CP010-D2-APP-BUCKET-CAPACITY-LITRES") {
    return appendUnit(rationalToDecimal(display), "litres");
  }
  if (q.sourceWave === "WAVE01" && q.stem.includes("π = 3.14")) {
    return decimalizeLeadingFraction(display);
  }
  const unit = answerUnitForSource(q.sourceId);
  return unit ? appendUnit(display, unit) : display;
}

function extractQuantities(stem: string) {
  return stem.match(/₹?\d+(?:\/\d+)?(?:\.\d+)?(?:π)?(?::\d+(?:\/\d+)?)?(?:\s*(?:cm³|m³|cm²|m²|cm|m|litres?|%))?/g) ?? [];
}

function individualizedExplanation(
  q: MenCp010PermanentEnglishQuestion,
  stem: string,
  answer: string,
): MenCp010PermanentEnglishQuestion["explanation"] {
  const relation = q.explanation.steps.find((step) => step.title.toLowerCase().includes("relation"))?.body
    ?? q.explanation.steps.find((step) => step.title.toLowerCase().includes("formula"))?.body
    ?? q.explanation.keyRule;
  const quantities = extractQuantities(stem);
  const givenText = quantities.length ? quantities.join(", ") : "the stated dimensions";
  return {
    keyRule: q.explanation.keyRule,
    steps: [
      {
        title: "Read this question's data",
        body: `The numerical data to use are ${givenText}. Keep corresponding dimensions in the same order.`,
      },
      {
        title: "Apply the correct relation",
        body: relation,
      },
      {
        title: "Substitute the given values",
        body: `Substituting ${givenText} into the governing relation and simplifying gives ${answer}.`,
      },
      {
        title: "Verify the result",
        body: `Putting ${answer} back into the same geometric or similarity relation reproduces the stated data, so this is the required value.`,
      },
    ],
    shortcut: q.explanation.shortcut,
    traps: q.explanation.traps,
  };
}

function editorialize(q: MenCp010PermanentEnglishQuestion): MenCp010PermanentEnglishQuestion {
  const stem = editorialStem(q);
  const options = q.options.map((option) => ({ ...option, display: editorialDisplay(q, option.display) }));
  const answer = editorialDisplay(q, q.answer);
  return {
    ...q,
    stem,
    options,
    answer,
    explanation: individualizedExplanation(q, stem, answer),
  };
}

export function generateMenCp010PermanentEnglishQuestion(
  qlId: MenCp010PermanentQlId,
  seed: string,
): MenCp010PermanentEnglishQuestion {
  const raw = generateUnscheduledMenCp010PermanentEnglishQuestion(qlId, seed);
  const q = editorialize(raw);
  return scheduleOptions(q, scheduledCorrectIndex(qlId, seed));
}

export { listMenCp010PermanentEnglishSources };
export type { MenCp010PermanentEnglishQuestion };
