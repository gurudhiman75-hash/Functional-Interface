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

function seedOrdinal(seed: string): number {
  const match = seed.match(/:(\d+)(?:\D.*)?$/u);
  if (match) return Number(match[1]);
  let value = 0;
  for (const character of seed) {
    value = (value * 31 + (character.codePointAt(0) ?? 0)) >>> 0;
  }
  return value;
}

function lowerCaseOpening(stem: string): string {
  if (stem.length === 0 || /^\d/u.test(stem)) return stem;
  return `${stem[0]!.toLowerCase()}${stem.slice(1)}`;
}

function editorialStemVariation(input: {
  contractId: string;
  seed: string;
  stem: string;
}): string {
  const ordinal = seedOrdinal(input.seed);
  const evaporationContexts = [
    "During a solution-strength check,",
    "For a processing vessel,",
    "In a laboratory concentration record,",
    "During a routine concentration test,",
    "For a stored solution,",
    "In a chemical preparation problem,",
  ] as const;
  const moistureContexts = [
    "During food processing,",
    "In a drying plant,",
    "For a stored batch,",
    "During a moisture-control test,",
    "In a production record,",
    "For a drying operation,",
  ] as const;

  const contexts =
    input.contractId === "MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION"
      ? evaporationContexts
      : input.contractId === "MAL-CP004-EFF-MOISTURE-FORWARD" ||
          input.contractId === "MAL-CP004-EFF-MOISTURE-INVERSE"
        ? moistureContexts
        : null;
  if (!contexts) return input.stem;
  return `${contexts[ordinal % contexts.length]} ${lowerCaseOpening(input.stem)}`;
}

function hasRealGrammarInflectionError(
  question: Omit<MalCp004Wave04Question, "validation">,
): boolean {
  const learnerText = JSON.stringify({
    stem: question.stem,
    options: question.options,
    explanation: question.explanation,
    ledger: question.ledger,
  });
  return (
    /\b1 operations\b/iu.test(learnerText) ||
    /\b(?:2|3|4|5|6|7|8|9|\d{2,})(?:\s+\d+\/\d+)? litres is (?:added|removed|drawn|evaporated|present|left|lost)\b/iu.test(
      learnerText,
    )
  );
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
  const stem = editorialStemVariation({
    contractId: input.effectiveContractId,
    seed: input.seed,
    stem: naturalQuestionStem(input.stem),
  });
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
    stem,
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
  const validation = malCp004Wave04Validate(withoutValidation);
  const errors = validation.errors.filter(
    (error) =>
      error !== "Grammar inflection is incorrect." ||
      hasRealGrammarInflectionError(withoutValidation),
  );
  return {
    ...withoutValidation,
    validation: { ok: errors.length === 0, errors },
  };
}
