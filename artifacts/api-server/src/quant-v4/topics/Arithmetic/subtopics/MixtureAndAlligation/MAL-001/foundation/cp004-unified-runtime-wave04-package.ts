import {
  MAL_CP004_WAVE04_RUNTIME_ID,
  type MalCp004Wave04Question,
} from "./cp004-unified-runtime-wave04-types";
import {
  malCp004Wave04StateFingerprint,
  malCp004Wave04Validate,
} from "./cp004-unified-runtime-wave04-core";

function naturalQuestionStem(stem: string): string {
  const normalized = stem
    .replace(/\b1 litres\b/gu, "1 litre")
    .replace(
      /\b(?!1\b)(\d+(?:\s+\d+\/\d+)?|\d+\/\d+) litres is\b/gu,
      "$1 litres are",
    )
    .replace(/\. Find the ([^.]+)\.$/u, ". What is the $1?")
    .replace(/\. Determine the ([^.]+)\.$/u, ". What is the $1?")
    .replace(/\. Find its ([^.]+)\.$/u, ". What is its $1?")
    .replace(
      /\. Given ([^,]+), calculate the ([^.]+)\.$/u,
      ". Given $1, what is the $2?",
    )
    .replace(/\. Calculate the ([^.]+)\.$/u, ". What is the $1?");
  if (normalized.endsWith("?")) return normalized;
  return normalized.endsWith(".")
    ? `${normalized.slice(0, -1)}?`
    : `${normalized}?`;
}

export function malCp004Wave04Package(
  input: Omit<
    MalCp004Wave04Question,
    | "archetypeId"
    | "canonicalProblemId"
    | "runtimeId"
    | "permanentQlId"
    | "questionLanguageId"
    | "language"
    | "mathematicalFingerprint"
    | "validation"
    | "maturity"
    | "allocationStatus"
    | "active"
    | "publiclyPublishable"
    | "questionStudioDiscoverable"
    | "questionBankWritable"
    | "testEligible"
  >,
): MalCp004Wave04Question {
  const withoutValidation: Omit<MalCp004Wave04Question, "validation"> = {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-004",
    runtimeId: MAL_CP004_WAVE04_RUNTIME_ID,
    effectiveContractId: input.effectiveContractId,
    representationVariant: input.representationVariant,
    permanentQlId: null,
    questionLanguageId: `${input.effectiveContractId}-${input.representationVariant}-EN-DISCOVERY`,
    language: "en",
    seed: input.seed,
    difficulty: input.difficulty,
    sourceEvidenceIds: input.sourceEvidenceIds,
    sourceMatchKind: input.sourceMatchKind,
    stem: naturalQuestionStem(input.stem),
    answer: input.answer,
    answerValue: input.answerValue,
    answerUnit: input.answerUnit,
    options: input.options,
    correctIndex: input.correctIndex,
    optionAudit: input.optionAudit,
    explanation: input.explanation,
    ledger: input.ledger,
    exactState: input.exactState,
    mathematicalFingerprint: [
      input.effectiveContractId,
      input.representationVariant,
      malCp004Wave04StateFingerprint(input.exactState),
    ].join("|"),
    maturity: "SOURCE_BACKED_UNIFIED_DISCOVERY",
    allocationStatus: "UNALLOCATED_OPEN_DISCOVERY",
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  };
  return {
    ...withoutValidation,
    validation: malCp004Wave04Validate(withoutValidation),
  };
}
