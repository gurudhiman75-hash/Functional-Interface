import {
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./rational";
import { MAL_CP004_DISCOVERY_REGISTRY } from "./cp004-discovery-registry";
import { solveMalCp004 } from "./cp004-solver";
import {
  MAL_CP004_DISCOVERY_RUNTIME_ID,
  MAL_CP004_ID,
  type MalCp004DiscoveryPrototypeId,
  type MalCp004DiscoveryQuestion,
  type MalCp004OptionAudit,
  type MalCp004SolveRequest,
} from "./cp004-types";
import type { Rational } from "./types";

export function hash(value: string): number {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

export function pick<T>(values: readonly T[], seed: string): T {
  if (values.length === 0) throw new Error("Cannot pick from an empty list.");
  return values[hash(seed) % values.length]!;
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const result = [...values];
  let state = hash(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = next() % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

export function percentText(fraction: Rational): string {
  return `${formatRational(multiplyRational(fraction, rational(100)))}%`;
}

export function quantityText(value: Rational, unit: "litres" | "kg"): string {
  return `${formatRational(value)} ${unit}`;
}

function canonicalOption(text: string): string {
  return text.toLowerCase().replace(/\s+/gu, " ").trim();
}

export function buildOptions(
  answer: string,
  distractors: readonly { text: string; misconceptionId: string }[],
  seed: string,
): {
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004OptionAudit[];
} {
  const unique = new Map<string, { text: string; misconceptionId: string }>();
  unique.set(canonicalOption(answer), { text: answer, misconceptionId: "correct" });
  for (const distractor of distractors) {
    const key = canonicalOption(distractor.text);
    if (!unique.has(key)) unique.set(key, distractor);
  }
  if (unique.size < 4) {
    throw new Error(`Insufficient unique options for ${seed}.`);
  }
  const selected = shuffle([...unique.values()].slice(0, 4), seed);
  const correctIndex = selected.findIndex(
    (item) => canonicalOption(item.text) === canonicalOption(answer),
  );
  if (correctIndex < 0) throw new Error("Correct option was lost.");
  return {
    options: selected.map((item) => item.text),
    correctIndex,
    optionAudit: selected.map((item) => ({
      text: item.text,
      misconceptionId: item.misconceptionId,
      isCorrect: canonicalOption(item.text) === canonicalOption(answer),
    })),
  };
}

function requestFingerprint(request: MalCp004SolveRequest): string {
  const fields: string[] = [request.mode];
  for (const [key, value] of Object.entries(request)) {
    if (key !== "mode") fields.push(`${key}=${rationalKey(value as Rational)}`);
  }
  return fields.join("|");
}

function validateQuestion(
  question: Omit<MalCp004DiscoveryQuestion, "validation">,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!question.stem.endsWith("?")) errors.push("Stem is not interrogative.");
  if (question.options.length !== 4) errors.push("Question does not have four options.");
  if (new Set(question.options.map(canonicalOption)).size !== 4) errors.push("Options are duplicate or equivalent.");
  if (question.options[question.correctIndex] !== question.answer) errors.push("Correct option does not match the canonical answer.");
  if (question.optionAudit.filter((option) => option.isCorrect).length !== 1) errors.push("Option audit does not contain exactly one correct answer.");
  if (new Set(question.optionAudit.map((option) => option.misconceptionId)).size !== 4) errors.push("Distractor authorities are not distinct.");
  if (question.sourceEvidenceIds.length === 0) errors.push("Source evidence is missing.");
  if (question.permanentQlId !== null) errors.push("Permanent QL leaked into discovery.");
  if (question.active || question.publiclyPublishable || question.questionStudioDiscoverable || question.questionBankWritable || question.testEligible) errors.push("A discovery delivery flag became enabled.");
  if (question.ledger.rows.length === 0) errors.push("Conservation ledger is empty.");
  if (!question.explanation.calculation.some((step) => /\d/u.test(step))) errors.push("Explanation is not number-specific.");
  const learnerText = JSON.stringify({ stem: question.stem, options: question.options, explanation: question.explanation, ledger: question.ledger });
  if (/alligation|stage strip|competitive-exam/iu.test(learnerText)) errors.push("Student-facing output contains unrelated or artificial language.");
  return { ok: errors.length === 0, errors };
}

export function packageQuestion(input: {
  prototypeId: MalCp004DiscoveryPrototypeId;
  seed: string;
  request: MalCp004SolveRequest;
  stem: string;
  answer: string;
  options: ReturnType<typeof buildOptions>;
  explanation: MalCp004DiscoveryQuestion["explanation"];
  ledger: MalCp004DiscoveryQuestion["ledger"];
}): MalCp004DiscoveryQuestion {
  const registry = MAL_CP004_DISCOVERY_REGISTRY.find(
    (entry) => entry.prototypeId === input.prototypeId,
  );
  if (!registry) throw new Error(`Missing CP-004 registry entry ${input.prototypeId}.`);
  const solution = solveMalCp004(input.request);
  const withoutValidation: Omit<MalCp004DiscoveryQuestion, "validation"> = {
    archetypeId: "MAL-001",
    canonicalProblemId: MAL_CP004_ID,
    runtimeId: MAL_CP004_DISCOVERY_RUNTIME_ID,
    prototypeId: input.prototypeId,
    permanentQlId: null,
    questionLanguageId: `${input.prototypeId}-EN-DISCOVERY`,
    language: "en",
    seed: input.seed,
    difficulty: registry.baseDifficulty,
    sourceEvidenceIds: [...registry.legacyFamilyAuthorities, "MAL-001-LEGACY-87-FAMILY-DISPOSITION-LEDGER", "MAL-001-END-TO-END-DESIGN"],
    sourceEvidenceStatus: registry.sourceEvidenceStatus,
    request: input.request,
    solution,
    stem: input.stem,
    answer: input.answer,
    ...input.options,
    explanation: input.explanation,
    ledger: input.ledger,
    mathematicalFingerprint: `${input.prototypeId}|${requestFingerprint(input.request)}|${input.answer}`,
    maturity: "DISCOVERY_PROTOTYPE",
    allocationStatus: "UNALLOCATED_OPEN_DISCOVERY",
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  };
  return { ...withoutValidation, validation: validateQuestion(withoutValidation) };
}
