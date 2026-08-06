import {
  generateMalCp003Wave12EditorialQuestion,
  type MalCp003Wave12ContractId,
  type MalCp003Wave12UnifiedQuestion,
} from "./cp003-unified-runtime-wave12-editorial";
import { canonicalOption, parseNumber } from "./cp003-editorial-v2-core";
import { BANNED_OPENERS, cleanStem, cleanStep, cleanText, operationCountFrom, retainedFractionFrom, rootName } from "./cp003-editorial-v2-language";
import { conceptualOptions } from "./cp003-editorial-v2-options";
import { diagramFor, ql034Variant } from "./cp003-editorial-v2-three-component";

export interface MalCp003EditorialV2Metadata {
  version: 2;
  openingPatternId: string;
  retainedFractionKey: string;
  operationCount: number;
  numericalQuality: "CLEAN_INTEGER" | "SIMPLE_FRACTION" | "MANAGEABLE_MIXED" | "RATIO" | "COUNT";
  distractorPatternId: string;
  mathematicalSkeleton: string;
  initialComponentsExplicit: boolean;
  grammarVerified: true;
  arbitraryPlusMinusOneRejected: true;
  equivalentOptionsRejected: true;
}

export type MalCp003EditorialV2Question = MalCp003Wave12UnifiedQuestion & {
  editorialMetadata: MalCp003EditorialV2Metadata;
};

function verificationFor(question: MalCp003Wave12UnifiedQuestion): string {
  const diagram = question.diagram as any;
  switch (question.contractId) {
    case "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE":
      return question.representationVariant === "FINAL_REFILL_QUANTITY"
        ? "The original liquid and the replacement liquid together equal the vessel capacity."
        : "The original liquid decreases after every operation, as it must.";
    case "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL":
      return `Applying the retained fraction for all ${operationCountFrom(question)} operations to the calculated initial amount reproduces the stated final amount.`;
    case "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL":
      return "Using the calculated removal quantity in every operation reproduces the given final amount.";
    case "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL":
      return "The retained-fraction power for this operation count matches the stated final amount exactly; the previous power does not.";
    case "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL":
      return "Applying each stated removal in order gives the calculated final quantity; no stage is skipped or averaged.";
    case "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER": {
      const finalRow = Array.isArray(diagram?.rows) ? diagram.rows.at(-1) : undefined;
      return finalRow
        ? "The final quantities in the table add to the vessel capacity."
        : "The three final component quantities add to the vessel capacity.";
    }
    case "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO":
      return "The two final component fractions add to 1, and the ratio is written in the order asked.";
    case "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO":
      return "Using the calculated capacity with the stated removal quantity reproduces the given final ratio.";
    case "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD":
      return cleanText(question.explanation.verification)
        .replace(/stage/giu, "operation")
        .replace(/threshold ledger/giu, "calculation");
  }
}

function explanationFor(question: MalCp003Wave12UnifiedQuestion) {
  const count = operationCountFrom(question);
  const coreConceptByContract: Record<MalCp003Wave12ContractId, string> = {
    "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE":
      "Each removal is taken from the current mixture, so the original liquid is multiplied by the fraction left after every operation.",
    "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL":
      "Work backwards: divide the final amount by the total fraction retained over all operations.",
    "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL":
      `First find the one-operation retained fraction by taking the ${rootName(count)} of the total retained fraction.`,
    "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL":
      "Compare successive powers of the one-operation retained fraction until the stated final amount is reached exactly.",
    "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL":
      "Different removals give different retained fractions. Apply them one after another in the order stated.",
    "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER":
      "At each operation, reduce every liquid already present in the same proportion, then add the new liquid.",
    "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO":
      "Find the fraction of the original liquid left; the remaining fraction belongs to the replacement liquid.",
    "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO":
      `Convert the final ratio to the original-liquid fraction, take its ${rootName(count)}, and use the one-operation removal fraction to find capacity.`,
    "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD":
      "Check consecutive operations. The required answer is the first operation that satisfies the strict condition.",
  };

  const formulaByContract: Record<MalCp003Wave12ContractId, string> = {
    "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE": "\\[Q_n=Q_0\\left(1-\\frac{x}{V}\\right)^n\\]",
    "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL": "\\[Q_0=\\frac{Q_n}{\\left(1-\\frac{x}{V}\\right)^n}\\]",
    "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL": `\\[1-\\frac{x}{V}=${rootName(count)}\\left(\\frac{Q_n}{Q_0}\\right)\\]`,
    "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL": "\\[Q_n=Q_0r^n\\]",
    "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL": "\\[Q=Q_0\\left(1-\\frac{x_1}{V}\\right)\\left(1-\\frac{x_2}{V}\\right)\\cdots\\]",
    "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER": "quantity after removal = quantity before × fraction left; then add the new liquid",
    "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO": "original fraction : replacement fraction",
    "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO": "one-operation fraction left = root of final original fraction",
    "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD": "\\[Q_n=Q_0r^n\\] and check both \\(n-1\\) and \\(n\\)",
  };

  const shortcuts: Partial<Record<MalCp003Wave12ContractId, string>> = {
    "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE": cleanText(question.explanation.examShortcut),
    "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO": "Use the retained fraction and its complement directly; litre quantities are unnecessary unless asked.",
    "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO": cleanText(question.explanation.examShortcut),
  };

  const trapByContract: Record<MalCp003Wave12ContractId, string> = {
    "MAL-CP003-CONTRACT-EQUAL-REPLACEMENT-FINAL-STATE":
      "Do not subtract the same amount from the original liquid every time. Later removals contain both liquids.",
    "MAL-CP003-CONTRACT-INITIAL-COMPOSITION-FROM-FINAL":
      "Do not multiply the final amount by the retained fraction; the calculation must be reversed by division.",
    "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL":
      `Do not treat the total retained fraction as the one-operation fraction; take the ${rootName(count)} first.`,
    "MAL-CP003-CONTRACT-EXACT-OPERATION-COUNT-FROM-FINAL":
      "Do not use linear subtraction. Repeated replacement changes the amount multiplicatively.",
    "MAL-CP003-CONTRACT-UNEQUAL-STAGE-FINAL-ORIGINAL":
      "Do not average the removal quantities or reuse the first retained fraction for every operation.",
    "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER":
      "Do not assume that a liquid added earlier remains untouched; it is also present in later removed samples.",
    "MAL-CP003-CONTRACT-FINAL-COMPONENT-RATIO":
      "Write the ratio in the exact order requested; reversing the two components changes the answer.",
    "MAL-CP003-CONTRACT-VESSEL-CAPACITY-FROM-FINAL-RATIO":
      `Do not use the final fraction as the one-operation fraction; take the ${rootName(count)} first.`,
    "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD":
      "For a strict condition such as ‘below’, equality is not enough. The previous operation must fail and the selected operation must succeed.",
  };

  return {
    coreConcept: coreConceptByContract[question.contractId],
    formula: formulaByContract[question.contractId],
    steps: question.explanation.steps.map((step) => cleanStep(step, count)).slice(0, 5),
    verification: verificationFor(question),
    conclusion: cleanText(question.explanation.conclusion).replace(/^Therefore,\s*/iu, ""),
    examShortcut: shortcuts[question.contractId] ?? "",
    commonTrap: trapByContract[question.contractId],
  };
}

function mixedDenominators(value: string): number[] {
  return [...value.matchAll(/\d+\s+(\d+)\/(\d+)/gu)].map((match) => Number(match[2]));
}

function numericalQuality(question: MalCp003Wave12UnifiedQuestion): MalCp003EditorialV2Metadata["numericalQuality"] | null {
  const learnerText = `${question.stem}\n${question.answer}`;
  const denominators = mixedDenominators(learnerText);
  if (denominators.some((denominator) => denominator > 64)) return null;
  if (/operations?/iu.test(question.answer)) return "COUNT";
  if (/\d+\s*:\s*\d+/u.test(question.answer)) return "RATIO";
  const answer = parseNumber(question.answer);
  if (answer.denominator === 1n) return "CLEAN_INTEGER";
  if (answer.numerator > answer.denominator) return answer.denominator <= 32n ? "MANAGEABLE_MIXED" : null;
  return answer.denominator <= 4096n ? "SIMPLE_FRACTION" : null;
}

function openingPattern(stem: string): string {
  const first = stem.split(/[.,]/u)[0]!.trim().toLowerCase();
  return first.replace(/\d+(?:\s+\d+\/\d+)?/gu, "#").replace(/\b(?:milk|water|wine|juice|syrup|oil|acid|solution|solvent|liquid a|liquid b)\b/gu, "liquid");
}

function validateRemediated(question: MalCp003EditorialV2Question): string[] {
  const errors: string[] = [];
  const learnerText = JSON.stringify({
    stem: question.stem,
    options: question.options,
    explanation: question.explanation,
  });
  if (BANNED_OPENERS.some((opener) => question.stem.includes(opener.trim()))) errors.push("Artificial opener remains.");
  if (/homogeneous sample|observed retained fraction|exact operation root|stage-specific retained fraction|unique integer exponent/iu.test(learnerText)) {
    errors.push("Internal technical language remains.");
  }
  if (/\b\d+ litres is removed\b/iu.test(question.stem)) errors.push("Plural grammar is incorrect.");
  if (/\b1 operations\b/iu.test(learnerText)) errors.push("Singular operation grammar is incorrect.");
  if (/\bA 8\d?-litre\b/u.test(question.stem)) errors.push("Article before numeric adjective is incorrect.");
  if (/\b(?:2th|3th) root\b/iu.test(learnerText)) errors.push("Root ordinal is incorrect.");
  if (question.options.length !== 4 || new Set(question.options.map(canonicalOption)).size !== 4) {
    errors.push("Options are duplicate or equivalent.");
  }
  if (question.optionAudit.some((option) => /ARITHMETIC_SLIP|PLAUSIBLE/iu.test(option.misconceptionId))) {
    errors.push("Generic arithmetic distractor remains.");
  }
  if (question.optionAudit.filter((option) => option.isCorrect).length !== 1) errors.push("Correct option count is not one.");
  if (question.options[question.correctIndex] !== question.answer) errors.push("Correct option index is wrong.");
  if (!question.explanation.steps.some((step) => /\d/u.test(step))) errors.push("Explanation is not number-specific.");
  if (/stage strip|threshold ledger/iu.test(question.explanation.verification)) errors.push("Unsupported visual reference remains.");
  if (question.contractId === "MAL-CP003-CONTRACT-THREE-COMPONENT-STAGE-LEDGER" && /mathbf|indicator/iu.test(question.explanation.formula)) {
    errors.push("Advanced component notation remains.");
  }
  if (!question.editorialMetadata.initialComponentsExplicit) errors.push("Initial components are not explicit.");
  return errors;
}

function remediate(
  base: MalCp003Wave12UnifiedQuestion,
  seed: string,
): MalCp003EditorialV2Question {
  const cleanedStem = cleanStem(base);
  const baseWithStem = ql034Variant({ ...base, stem: cleanedStem }, seed);
  const quality = numericalQuality(baseWithStem);
  if (!quality) throw new Error("Numerical values are not exam-friendly.");
  const options = conceptualOptions(baseWithStem, `${seed}:conceptual-options`);
  const explanation = explanationFor(baseWithStem);
  const operationCount = operationCountFrom(baseWithStem);
  const retained = retainedFractionFrom(baseWithStem);
  const optionPattern = options.optionAudit
    .map((option) => option.misconceptionId)
    .join("|");
  const metadata: MalCp003EditorialV2Metadata = {
    version: 2,
    openingPatternId: openingPattern(cleanedStem),
    retainedFractionKey: `${retained.numerator}/${retained.denominator}`,
    operationCount,
    numericalQuality: quality,
    distractorPatternId: optionPattern,
    mathematicalSkeleton: [base.contractId, base.mathematicalFingerprint, operationCount, base.representationVariant].join("|"),
    initialComponentsExplicit: !/in a total volume/iu.test(cleanedStem),
    grammarVerified: true,
    arbitraryPlusMinusOneRejected: true,
    equivalentOptionsRejected: true,
  };
  const withoutValidation: MalCp003EditorialV2Question = {
    ...base,
    stem: cleanedStem,
    ...options,
    explanation,
    diagram: diagramFor(baseWithStem),
    sourceEvidenceIds: [...new Set([...base.sourceEvidenceIds, "MAL-CP003-EDITORIAL-REMEDIATION-V2"])],
    mathematicalFingerprint: `${base.mathematicalFingerprint}|editorial-v2`,
    editorialMetadata: metadata,
    validation: { ok: true, errors: [] },
  };
  const errors = validateRemediated(withoutValidation);
  return {
    ...withoutValidation,
    validation: { ok: errors.length === 0, errors },
  };
}

export function generateMalCp003EditorialV2Question(
  contractId: MalCp003Wave12ContractId,
  seed = `mal-cp003-editorial-v2:${contractId}:default`,
): MalCp003EditorialV2Question {
  const failures: string[] = [];
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const candidateSeed = `${seed}:candidate-${attempt}`;
    try {
      const base = generateMalCp003Wave12EditorialQuestion(contractId, candidateSeed);
      if (!base.validation.ok) {
        failures.push(`candidate-${attempt}: ${base.validation.errors.join("; ")}`);
        continue;
      }
      const remediated = remediate(base, candidateSeed);
      if (remediated.validation.ok) return remediated;
      failures.push(`candidate-${attempt}: ${remediated.validation.errors.join("; ")}`);
    } catch (error) {
      failures.push(`candidate-${attempt}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  throw new Error(
    `${contractId}/${seed}: no editorially acceptable V2 candidate found. ${failures.slice(-8).join(" | ")}`,
  );
}

export function malCp003EditorialV2Stable(question: MalCp003EditorialV2Question): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
