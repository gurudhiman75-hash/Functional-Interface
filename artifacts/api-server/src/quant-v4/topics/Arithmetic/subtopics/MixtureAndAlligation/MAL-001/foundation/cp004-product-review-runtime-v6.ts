import {
  runMalCp004EnglishAlligationV2Pipeline,
  type MalCp004AlligationQuestion,
} from "./cp004-alligation-help-v2";
import type { MalCp004PermanentQlId } from "./cp004-permanent-runtime";
import {
  MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
  type MalCp004ProductReviewQuestion,
} from "./cp004-product-review-remediation-v3";
import { runMalCp004EnglishProductReviewV5Pipeline } from "./cp004-product-review-runtime-v5";
import type { MalCp004Wave04OptionAudit } from "./cp004-unified-runtime-wave04-types";
import {
  addRational,
  divideRational,
  formatRational,
  rational,
} from "./rational";

export const MAL_CP004_PRODUCT_REVIEW_RUNTIME_V6 =
  "MAL-CP004-EN-PRODUCT-REVIEW-RUNTIME-V6" as const;

type BaseQuestion = MalCp004AlligationQuestion;

function exact(question: BaseQuestion, key: string) {
  const value = question.exactState[key];
  if (!value || typeof value === "string") {
    throw new Error(`${question.questionId}: '${key}' is not an exact rational.`);
  }
  return value;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function rebuildQl045Options(
  question: BaseQuestion,
  requestedSeed: string,
): {
  options: string[];
  correctIndex: number;
  optionAudit: MalCp004Wave04OptionAudit[];
} {
  const evaporated = exact(question, "evaporated");
  const finalTotal = exact(question, "finalTotal");
  const candidates = [
    {
      value: finalTotal,
      misconceptionId: "reported_final_volume",
    },
    {
      value: addRational(finalTotal, divideRational(evaporated, rational(2))),
      misconceptionId: "restored_only_half_the_evaporated_amount",
    },
    {
      value: addRational(question.answerValue, evaporated),
      misconceptionId: "added_the_evaporated_amount_twice",
    },
  ] as const;

  const texts = candidates.map(
    (entry) => `${formatRational(entry.value)} ${question.answerUnit}`,
  );
  if (new Set(texts).size !== 3 || texts.includes(question.answer)) {
    throw new Error(`${question.questionId}: guaranteed QL-045 options collided.`);
  }

  const correctIndex = hash(`${requestedSeed}:mal-cp004-ql045-options-v6`) % 4;
  const options: string[] = [];
  const optionAudit: MalCp004Wave04OptionAudit[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(question.answer);
      optionAudit.push({
        text: question.answer,
        value: question.answerValue,
        misconceptionId: "correct",
        isCorrect: true,
      });
      continue;
    }
    const entry = candidates[wrong++]!;
    const text = `${formatRational(entry.value)} ${question.answerUnit}`;
    options.push(text);
    optionAudit.push({
      text,
      value: entry.value,
      misconceptionId: entry.misconceptionId,
      isCorrect: false,
    });
  }
  return { options, correctIndex, optionAudit };
}

function buildQl045(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  const requestedSeed =
    input.seed ?? `mal-cp004-product-review-v6:${input.questionLanguageId}:default`;
  const base = runMalCp004EnglishAlligationV2Pipeline({
    questionLanguageId: input.questionLanguageId,
    seed: requestedSeed,
    language: "en",
  });
  const options = rebuildQl045Options(base, requestedSeed);

  const question = {
    ...base,
    ...options,
    allocationStatus: "V2_PRESENTATION_CANDIDATE",
    releaseStatus: "PRESENTATION_CANDIDATE",
    runtimeMode: "REVIEW_ONLY",
    reviewStatus: "PENDING_PRODUCT_REVIEW",
    questionBankStatus: "V1_RELEASE_ONLY",
    testEligibility: "V1_RELEASE_ONLY",
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: true,
    questionBankWritable: false,
    testEligible: false,
    parameters: {
      ...base.parameters,
      requestedSeed,
      selectedSeed: requestedSeed,
      valueQualitySelectionAttempt: 0,
      valueQualityPolicy: "SOURCE_STATE_UNCHANGED",
      productReviewRemediationId: MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
      productReviewRuntimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V6,
    },
    traceability: {
      ...base.traceability,
      releaseId: "MAL-CP004-EN-v2-CANDIDATE",
      sourceReleasedId: "MAL-CP004-EN-v1",
      runtimeMode: "REVIEW_ONLY",
      reviewStatus: "PENDING_PRODUCT_REVIEW",
      questionBankStatus: "V1_RELEASE_ONLY",
      testEligibility: "V1_RELEASE_ONLY",
      publiclyPublishable: false,
      requestedSeed,
      selectedSeed: requestedSeed,
      productReviewRemediationId: MAL_CP004_PRODUCT_REVIEW_REMEDIATION_ID,
      productReviewRuntimeId: MAL_CP004_PRODUCT_REVIEW_RUNTIME_V6,
    },
    validation: {
      ...base.validation,
      checks: [
        ...base.validation.checks,
        {
          name: "QL045_GUARANTEED_DISTRACTOR_DIVERSITY_V6",
          passed: true,
          message:
            "Final volume, half-restoration and double-restoration errors remain distinct for every valid evaporation state.",
        },
      ],
    },
  } as unknown as MalCp004ProductReviewQuestion;

  if (
    question.options.length !== 4 ||
    new Set(question.options).size !== 4 ||
    question.options[question.correctIndex] !== question.answer
  ) {
    throw new Error(`${question.questionId}: V6 option package is invalid.`);
  }
  return question;
}

export function runMalCp004EnglishProductReviewV6Pipeline(input: {
  questionLanguageId: MalCp004PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp004ProductReviewQuestion {
  if (input.questionLanguageId === "MAL-QL-045") return buildQl045(input);
  return runMalCp004EnglishProductReviewV5Pipeline(input);
}

export function malCp004ProductReviewV6Stable(
  question: MalCp004ProductReviewQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
