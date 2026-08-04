import type { SapCp002PrototypeId } from "../SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import {
  generateSapCp002ExamReadinessV2Package as generateBasePackage,
} from "./runtime";
import type {
  SapCp002ExamReadinessV2Package,
  SapCp002V2Explanation,
  SapCp002V2Validation,
} from "./types";

const BANNED = /(?:the denominator work is kept exact throughout|quick substitution or reverse calculation|therefore the exact answer remains|greatest common factor leaves the value unchanged)/i;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/[^a-z0-9/<>+=-]+/g, " ")
    .trim();
}

function ensureSentence(text: string): string {
  const value = text.trim().replace(/\s+/g, " ");
  if (!value) return value;
  return /[.!?:]$/.test(value) ? value : `${value}.`;
}

function sanitizeExplanation(explanation: SapCp002V2Explanation): SapCp002V2Explanation {
  const finalHash = normalize(explanation.finalAnswer);
  const seen = new Set<string>();
  const steps: string[] = [];
  for (const raw of explanation.stepByStep) {
    const sentence = ensureSentence(raw);
    const hash = normalize(sentence);
    if (!hash || hash === finalHash || BANNED.test(sentence)) continue;
    if (hash.length >= 18 && seen.has(hash)) continue;
    if (hash.length >= 18) seen.add(hash);
    steps.push(sentence);
  }
  const traps: string[] = [];
  for (const raw of explanation.commonTraps) {
    const sentence = ensureSentence(raw);
    const hash = normalize(sentence);
    if (!hash || BANNED.test(sentence)) continue;
    if (hash.length >= 18 && seen.has(hash)) continue;
    if (hash.length >= 18) seen.add(hash);
    traps.push(sentence);
  }
  while (traps.length < 3) {
    traps.push([
      "Do not change a numerator or denominator without applying an equivalent operation.",
      "Preserve the displayed sign and the scope of every bracket or fraction bar.",
      "Check that the selected option satisfies the complete instruction, not only part of it.",
    ][traps.length]!);
  }
  return Object.freeze({
    ...explanation,
    coreConcept: ensureSentence(explanation.coreConcept),
    givenDataAndStrategy: ensureSentence(explanation.givenDataAndStrategy),
    stepByStep: Object.freeze(steps),
    examSpeedMethod: ensureSentence(explanation.examSpeedMethod),
    commonTraps: Object.freeze(traps.slice(0, 3)),
    finalAnswer: ensureSentence(explanation.finalAnswer),
  });
}

function hashes(explanation: SapCp002V2Explanation): readonly string[] {
  return Object.freeze([
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].map(normalize).filter((value) => value.length >= 18));
}

function revalidate(
  pkg: SapCp002ExamReadinessV2Package,
  explanation: SapCp002V2Explanation,
): SapCp002V2Validation {
  const errors = pkg.validation.errors.filter((error) => !(
    error.includes("repeated sentence")
    || error.includes("Banned generic explanation")
    || error.includes("150-word")
    || error.includes("solution steps")
    || error.includes("trap explanations")
  ));
  const sentenceHashes = hashes(explanation);
  if (new Set(sentenceHashes).size !== sentenceHashes.length) errors.push("The final explanation contains a repeated sentence.");
  const text = [
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.examSpeedMethod,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].join(" ");
  if (BANNED.test(text)) errors.push("The final explanation contains banned generic boilerplate.");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 150) errors.push("The final explanation exceeds 150 words.");
  if (explanation.stepByStep.length < 2) errors.push("The final explanation needs at least two material steps.");
  if (explanation.commonTraps.length !== 3) errors.push("The final explanation needs exactly three concrete traps.");
  if ((pkg.taskDirection === "COMPARISON" || pkg.taskDirection === "DIAGNOSIS")
    && /numerator and denominator|greatest common factor/i.test(explanation.finalAnswer)) {
    errors.push("A nonnumeric conclusion contains fraction-reduction boilerplate.");
  }
  return Object.freeze({
    ...pkg.validation,
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    sentenceHashes,
    explanationWordCount: wordCount,
  });
}

export function generateSapCp002FinalExamReadinessV2Package(
  prototypeId: SapCp002PrototypeId,
  seed: number,
): SapCp002ExamReadinessV2Package {
  const pkg = generateBasePackage(prototypeId, seed);
  const explanation = sanitizeExplanation(pkg.explanation);
  const validation = revalidate(pkg, explanation);
  return Object.freeze({ ...pkg, explanation, validation });
}

export function generateSapCp002FinalExamReadinessV2Sweep(
  seedsPerPrototype: number,
): readonly SapCp002ExamReadinessV2Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-002 final v2 sweep size must be a positive integer.");
  }
  const prototypeIds: readonly SapCp002PrototypeId[] = Object.freeze([
    "SAP-CP002-PROT-FRACTION-SUM-DIFFERENCE",
    "SAP-CP002-PROT-FRACTION-PRODUCT-CANCELLATION",
    "SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL",
    "SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN",
    "SAP-CP002-PROT-MIXED-NUMBERS-CONVERT-EVALUATE",
    "SAP-CP002-PROT-FRACTION-OF-FRACTION",
    "SAP-CP002-PROT-NESTED-COMPLEX-FRACTION",
    "SAP-CP002-PROT-SIGNED-FRACTION-BRACKETS",
    "SAP-CP002-PROT-FRACTION-EXPRESSION-INTEGER-PART",
    "SAP-CP002-PROT-PRODUCT-SUM-DIFFERENCE",
    "SAP-CP002-PROT-RECIPROCAL-EXPRESSION",
    "SAP-CP002-PROT-FRACTION-COMPLEMENT",
    "SAP-CP002-PROT-BOUNDED-CONTINUED-FRACTION",
    "SAP-CP002-PROT-MISSING-NUMERATOR",
    "SAP-CP002-PROT-MISSING-DENOMINATOR",
    "SAP-CP002-PROT-MISSING-FRACTION-OPERAND",
    "SAP-CP002-PROT-COMPARE-EVALUATED-FRACTIONS",
    "SAP-CP002-PROT-SELECT-EQUIVALENT-REDUCED-FRACTION",
    "SAP-CP002-PROT-IDENTIFY-INCORRECT-FRACTION-STEP",
  ]);
  const packages: SapCp002ExamReadinessV2Package[] = [];
  for (const prototypeId of prototypeIds) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp002FinalExamReadinessV2Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}
