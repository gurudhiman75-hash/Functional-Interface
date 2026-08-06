import type { MalCp003Wave12ContractId, MalCp003Wave12UnifiedQuestion } from "./cp003-unified-runtime-wave12-editorial";
import { divide, formatNumber, hash, parseNumber, quantity, rational, subtract, type Rational } from "./cp003-editorial-v2-core";

export const BANNED_OPENERS = [
  "In a competitive-exam mixture problem, ",
  "In a competitive-exam vessel problem, ",
  "Consider this repeated remove-and-refill process: ",
  "During an equal-replacement process, ",
  "For a repeated-replacement calculation, ",
  "A storekeeper records this repeated operation: ",
  "A technician performs the same replacement repeatedly. ",
] as const;

export const TECHNICAL_PHRASES = [
  /homogeneous sample/giu,
  /observed retained fraction/giu,
  /exact operation root/giu,
  /stage-specific retained fraction/giu,
  /unique integer exponent/giu,
] as const;

export function cleanText(value: string): string {
  let result = value;
  for (const opener of BANNED_OPENERS) result = result.replace(opener, "");
  result = result
    .replace(/well-mixed contents/giu, "mixture")
    .replace(/well-mixed liquid/giu, "mixture")
    .replace(/well-mixed samples/giu, "samples")
    .replace(/concentrated solution/giu, "acid")
    .replace(/original solution/giu, "original liquid")
    .replace(/(\d+(?:\s+\d+\/\d+)?) litres is removed/giu, "$1 litres are removed")
    .replace(/\b1 operations\b/gu, "1 operation")
    .replace(/\bA (8\d?)-litre/gu, "An $1-litre");
  for (const phrase of TECHNICAL_PHRASES) result = result.replace(phrase, "retained fraction");
  return result.trim().replace(/^([a-z])/u, (letter) => letter.toUpperCase());
}

export function operationCountFrom(question: MalCp003Wave12UnifiedQuestion): number {
  const diagram = question.diagram as any;
  if (diagram?.type === "THREE_COMPONENT_STAGE_TABLE" && Array.isArray(diagram.rows)) return 2;
  if (Array.isArray(diagram?.stages) && diagram.stages.length > 0) {
    return Number(diagram.stages.at(-1)?.stage ?? diagram.stages.length);
  }
  const match = question.stem.match(/after\s+(\d+)\s+(?:such\s+)?(?:operations|replacements)/iu);
  if (match) return Number(match[1]);
  const answerCount = question.answer.match(/(\d+)\s+operations?/iu);
  return answerCount ? Number(answerCount[1]) : 1;
}

export function retainedFractionFrom(question: MalCp003Wave12UnifiedQuestion): Rational {
  const diagram = question.diagram as any;
  const row = Array.isArray(diagram?.stages) ? diagram.stages[0] : undefined;
  const raw = row?.retainedFraction ?? row?.retainedOriginalFractionAfterStage;
  if (raw) return parseNumber(String(raw));
  const formula = `${question.explanation.formula}\n${question.explanation.steps.join("\n")}`;
  const match = formula.match(/(?:=|fraction[^\d]*)(\d+)\/(\d+)/iu);
  if (!match) throw new Error(`Cannot recover retained fraction for ${question.seed}.`);
  return rational(BigInt(match[1]!), BigInt(match[2]!));
}

export function capacityFromStem(stem: string): Rational | null {
  const patterns = [
    /(?:fixed volume of|total volume of|volume)\s+(\d+(?:\s+\d+\/\d+)?)\s+litres/iu,
    /(?:contains|holding|holds)\s+(\d+(?:\s+\d+\/\d+)?)\s+litres/iu,
    /a[n]?\s+(\d+(?:\s+\d+\/\d+)?)-litre/iu,
  ];
  for (const pattern of patterns) {
    const match = stem.match(pattern);
    if (match) return parseNumber(match[1]!);
  }
  return null;
}

export function initialOriginalFromStem(stem: string): Rational | null {
  const match = stem.match(/contains\s+(\d+(?:\s+\d+\/\d+)?)\s+litres of/iu);
  return match ? parseNumber(match[1]!) : null;
}

export function componentNames(stem: string): { original: string; refill: string } {
  const original =
    stem.match(/litres of (.+?)(?:\.| in a total| and |\. Each|\. In each)/iu)?.[1]?.trim() ??
    stem.match(/original (.+?) (?:remains|to become|falls)/iu)?.[1]?.trim() ??
    "liquid A";
  const refill =
    stem.match(/replaced with (.+?)(?:\.| in each| after|,)/iu)?.[1]?.trim() ??
    stem.match(/restored with (.+?) after/iu)?.[1]?.trim() ??
    "water";
  return {
    original: original.replace(/^the\s+/iu, "").replace(/^original\s+/iu, ""),
    refill: refill.replace(/^the\s+/iu, ""),
  };
}

export function explicitInitialComponents(stem: string, contractId: MalCp003Wave12ContractId): string {
  if (
    contractId !== "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL" &&
    contractId !== "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL" &&
    contractId !== "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL"
  ) {
    return stem;
  }
  const capacity = capacityFromStem(stem);
  const names = componentNames(stem);
  if (!capacity) return stem;

  if (contractId === "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL") {
    const firstSentence = stem.match(/^.*?\./u)?.[0] ?? "";
    const container = firstSentence.match(/\b(tank|vessel|container|drum|can|cask)\b/iu)?.[1] ?? "vessel";
    const article = /^[aeiou]/iu.test(formatNumber(capacity)) ? "An" : "A";
    return stem.replace(
      firstSentence,
      `${article} ${formatNumber(capacity)}-litre ${container} is filled with ${names.original} and ${names.refill}.`,
    );
  }

  const original = initialOriginalFromStem(stem);
  if (!original) return stem;
  const other = subtract(capacity, original);
  const firstSentence = stem.match(/^.*?\./u)?.[0] ?? "";
  const container = firstSentence.match(/\b(tank|vessel|container|drum|can|cask)\b/iu)?.[1] ?? "vessel";
  const article = /^[aeiou]/iu.test(formatNumber(capacity)) ? "An" : "A";
  const replacement = names.refill === names.original ? "water" : names.refill;
  return stem.replace(
    firstSentence,
    `${article} ${formatNumber(capacity)}-litre ${container} contains ${quantity(original)} of ${names.original} and ${quantity(other)} of ${replacement}.`,
  );
}

export function fixUnequalStagePunctuation(stem: string): string {
  const match = stem.match(/Successive samples of (.+?) are removed, and/iu);
  if (!match) return stem;
  const values = match[1]!.split(",").map((value) => value.trim()).filter(Boolean);
  if (values.length < 2) return stem;
  const list = values.length === 2
    ? `${values[0]} and ${values[1]}`
    : `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
  return stem.replace(match[0], `Samples of ${list} are removed successively, and`);
}

export function cleanStem(question: MalCp003Wave12UnifiedQuestion): string {
  let stem = cleanText(question.stem);
  stem = explicitInitialComponents(stem, question.contractId);
  if (question.contractId === "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL") {
    stem = fixUnequalStagePunctuation(stem);
  }
  return cleanText(stem);
}

export function varyOpening(stem: string, seed: string): string {
  const firstSentence = stem.match(/^.*?\./u)?.[0];
  if (!firstSentence) return stem;
  const sentence = firstSentence.slice(0, -1);
  const initiallyContains = sentence.match(/^(?:A|An) (.+?) initially contains (.+)$/u);
  const contains = sentence.match(/^(?:A|An) (.+?) contains (.+)$/u);
  const filled = sentence.match(/^(?:A|An) (.+?) is filled with (.+)$/u);
  const match = initiallyContains ?? contains ?? filled;
  if (!match) return stem;
  const subject = match[1]!;
  const contents = match[2]!;
  const article = /^[aeiou]/iu.test(subject) ? "an" : "a";
  const variants = [
    `${article[0]!.toUpperCase()}${article.slice(1)} ${subject} initially contains ${contents}.`,
    `Initially, ${article} ${subject} contains ${contents}.`,
    `At first, the ${subject} contains ${contents}.`,
    `Before any replacement, ${article} ${subject} contains ${contents}.`,
    `${article[0]!.toUpperCase()}${article.slice(1)} ${subject} starts with ${contents}.`,
    `The ${subject} is initially filled with ${contents}.`,
  ];
  return stem.replace(firstSentence, variants[hash(`${seed}:opening`) % variants.length]!);
}

export function rootName(operationCount: number): string {
  if (operationCount === 2) return "square root";
  if (operationCount === 3) return "cube root";
  if (operationCount === 4) return "fourth root";
  return `${operationCount}${operationCount % 10 === 1 && operationCount % 100 !== 11 ? "st" : operationCount % 10 === 2 && operationCount % 100 !== 12 ? "nd" : operationCount % 10 === 3 && operationCount % 100 !== 13 ? "rd" : "th"} root`;
}

export function cleanStep(step: string, operationCount: number): string {
  return cleanText(step)
    .replace(/\bStage\b/gu, "Operation")
    .replace(/\bstage\b/gu, "operation")
    .replace(new RegExp(`${operationCount}(?:st|nd|rd|th) root`, "giu"), rootName(operationCount))
    .replace(/operation-specific/giu, "for that operation");
}
