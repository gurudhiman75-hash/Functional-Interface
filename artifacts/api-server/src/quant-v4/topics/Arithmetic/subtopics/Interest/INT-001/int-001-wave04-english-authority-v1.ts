import { hash } from "./cp003-exam-model";
import {
  buildIntCp010SequentialReopenPackageV2,
  type IntCp010SequentialReopenPrototypeId,
} from "./cp010-sequential-mixed-source-reopen-v2";
import {
  INT_001_WAVE03_AUTHORITY_CONTRACTS,
  INT_001_WAVE03_QL_IDS,
  type Int001Wave03QlId,
} from "./int-001-wave03-permanent-allocation-v1";

export const INT_001_WAVE04_ENGLISH_AUTHORITY_VERSION = "INT-001-WAVE04-ENGLISH-AUTHORITY-v1" as const;
export const INT_001_WAVE04_ENGLISH_RELEASE = "INT-001-WAVE04-EN-v1-review-candidate" as const;

export const INT_001_WAVE04_ENGLISH_GOVERNANCE = Object.freeze({
  permanentQlIds: INT_001_WAVE03_QL_IDS,
  permanentQlCount: 3 as const,
  language: "en" as const,
  release: INT_001_WAVE04_ENGLISH_RELEASE,
  permanentIdentityFrozen: true as const,
  learnerContentFrozen: false as const,
  reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
  localeReviewStatus: "PENDING_HUMAN_REVIEW" as const,
  questionStudioDiscoverable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function prototypeFor(qlId: Int001Wave03QlId, seed: string): IntCp010SequentialReopenPrototypeId {
  switch (qlId) {
    case "INT-QL-132":
      return hash(`${seed}:INT-QL-132:stage-order`) % 2 === 0
        ? "INT-CP010-REOPEN-PROT-001"
        : "INT-CP010-REOPEN-PROT-002";
    case "INT-QL-133":
      return "INT-CP010-REOPEN-PROT-003";
    case "INT-QL-134":
      return "INT-CP010-REOPEN-PROT-004";
  }
}

function questionTypeFor(qlId: Int001Wave03QlId) {
  switch (qlId) {
    case "INT-QL-132": return "SEQUENTIAL_SI_CI_FINAL_AMOUNT" as const;
    case "INT-QL-133": return "SEQUENTIAL_SI_CI_OPENING_PRINCIPAL" as const;
    case "INT-QL-134": return "SCHEME_RETURN_DIFFERENCE_COMMON_PRINCIPAL" as const;
  }
}

function whatAskedFor(qlId: Int001Wave03QlId) {
  switch (qlId) {
    case "INT-QL-132": return "Find the final amount after the two stated interest stages.";
    case "INT-QL-133": return "Find the opening principal that leads to the stated final amount.";
    case "INT-QL-134": return "Find the common principal from the known difference between the two scheme returns.";
  }
}

function shortcutFor(qlId: Int001Wave03QlId) {
  switch (qlId) {
    case "INT-QL-132": return "Use one multiplier for each stage and multiply the stage factors; the maturity of the first stage is the principal of the second.";
    case "INT-QL-133": return "Multiply the two stage factors first, then divide the final amount by that exact combined factor.";
    case "INT-QL-134": return "Because both schemes use the same principal, divide the known return difference by the difference of their exact amount factors.";
  }
}

function commonTrapFor(qlId: Int001Wave03QlId) {
  switch (qlId) {
    case "INT-QL-132": return "Do not apply one interest method to the entire duration or stop after the first stage.";
    case "INT-QL-133": return "Do not reverse only one stage or treat all years as simple/compound interest.";
    case "INT-QL-134": return "Do not subtract the nominal annual rates directly; compare the complete SI and CI amount factors for the stated duration and frequency.";
  }
}

export function generateInt001Wave04EnglishCandidate(qlId: Int001Wave03QlId, seed: string | number) {
  const requestedSeed = String(seed);
  const prototypeId = prototypeFor(qlId, requestedSeed);
  const contract = INT_001_WAVE03_AUTHORITY_CONTRACTS[qlId];
  if (!(contract.sourcePrototypeIds as readonly string[]).includes(prototypeId)) {
    throw new Error(`${qlId}/${requestedSeed}: prototype escaped the permanent Wave03 authority mapping`);
  }

  const source = buildIntCp010SequentialReopenPackageV2(prototypeId, requestedSeed) as any;
  if (source.prototypeId !== prototypeId || source.state?.prototypeId !== prototypeId) {
    throw new Error(`${qlId}/${requestedSeed}: source prototype identity drift`);
  }
  if (!source.presentation?.prompt || !Array.isArray(source.options) || source.options.length !== 4) {
    throw new Error(`${qlId}/${requestedSeed}: incomplete learner package`);
  }
  if (!Number.isInteger(source.correctIndex) || source.correctIndex < 0 || source.correctIndex > 3) {
    throw new Error(`${qlId}/${requestedSeed}: invalid answer index`);
  }

  const options = Object.freeze(source.options.map((option: any) => deepFreeze({
    text: String(option.text),
    value: option.value,
    misconceptionId: String(option.misconceptionId),
    isCorrect: Boolean(option.isCorrect),
  })));
  if (new Set(options.map((option) => option.text)).size !== 4) {
    throw new Error(`${qlId}/${requestedSeed}: duplicate displayed option text`);
  }
  if (options.filter((option) => option.isCorrect).length !== 1 || !options[source.correctIndex]?.isCorrect) {
    throw new Error(`${qlId}/${requestedSeed}: displayed answer ownership drift`);
  }

  const explanation = deepFreeze({
    whatAsked: whatAskedFor(qlId),
    keyIdea: String(source.explanation.keyIdea),
    steps: Object.freeze([...source.explanation.steps].map(String)),
    shortcut: shortcutFor(qlId),
    commonTrap: commonTrapFor(qlId),
    finalAnswer: String(source.explanation.finalAnswer),
  });

  return deepFreeze({
    authorityVersion: INT_001_WAVE04_ENGLISH_AUTHORITY_VERSION,
    release: INT_001_WAVE04_ENGLISH_RELEASE,
    checkpointId: contract.checkpointId,
    permanentQlId: qlId,
    qlId,
    permanentIdentityAllocated: true as const,
    questionType: questionTypeFor(qlId),
    title: contract.title,
    solveContract: contract.givenUnknown,
    answerSemantic: contract.answerSemantic,
    language: "en" as const,
    requestedSeed,
    effectiveSeed: String(source.effectiveSeed ?? requestedSeed),
    sourcePrototypeId: prototypeId,
    stemFamilyId: String(source.presentation.stemFamilyId),
    stem: String(source.presentation.prompt),
    options,
    correctIndex: source.correctIndex as number,
    answer: source.answer,
    mathematicalState: source.state,
    mathematicalFingerprint: String(source.mathematicalFingerprint),
    explanation,
    provenance: deepFreeze({
      wave03PermanentAuthority: true as const,
      sourcePrototypeId: prototypeId,
      sourceAuthorityContract: contract.givenUnknown,
      packagingRemediationVersion: String(source.packagingRemediationVersion ?? "NONE"),
      seedResolutionAttempts: Number(source.seedResolutionAttempts ?? 1),
    }),
    lifecycle: deepFreeze({
      permanentIdentityFrozen: true as const,
      learnerContentFrozen: false as const,
      reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
      localeReviewStatus: "PENDING_HUMAN_REVIEW" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
}
