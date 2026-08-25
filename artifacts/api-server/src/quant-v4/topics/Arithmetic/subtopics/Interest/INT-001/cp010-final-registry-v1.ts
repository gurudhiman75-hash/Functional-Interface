import { generateIntCp010ProductionCandidateV2 } from "./cp010-production-authoring-candidate-v2-realism";
import { generateIntCp010LocalizedCandidate, type IntCp010LocalizationLanguage } from "./cp010-localization-authoring-candidate-v1";
import type { IntCp010CandidateAuthorityId } from "./cp010-production-authoring-candidate-v1";

export const INT_CP010_FINAL_REGISTRY_VERSION = "INT-CP-010-FINAL-REGISTRY-v1" as const;
export const INT_CP010_COMPLETION_STATUS = "CP_COMPLETE_AUTHORITY_FROZEN_DELIVERY_CLOSED" as const;
export const INT_CP010_NEXT_FREE_QL = "INT-QL-132" as const;

export const INT_CP010_FINAL_AUTHORITIES = Object.freeze([
  Object.freeze({
    permanentQlId: "INT-QL-130" as const,
    authorityId: "INT-CP010-AUTH-01" as const,
    sourcePrototypeId: "INT-CP010-PROT-003" as const,
    title: "Variable-rate reducing-balance loan — equal end-year instalment",
    solveContract: "Given opening debt and a changing annual rate sequence, solve the one equal year-end instalment that reduces the final balance exactly to zero.",
  }),
  Object.freeze({
    permanentQlId: "INT-QL-131" as const,
    authorityId: "INT-CP010-AUTH-02" as const,
    sourcePrototypeId: "INT-CP010-PROT-004" as const,
    title: "Variable-rate reducing-balance loan — opening debt from unequal repayments",
    solveContract: "Given a changing annual rate sequence and heterogeneous year-end repayments that exactly clear the debt, reconstruct the opening debt.",
  }),
] as const);

export type IntCp010PermanentQlId = (typeof INT_CP010_FINAL_AUTHORITIES)[number]["permanentQlId"];

export const INT_CP010_SOURCE_HOLDS_FINAL = Object.freeze([
  Object.freeze({ prototypeId: "INT-CP010-PROT-001" as const, disposition: "SOURCE_HOLD_NOT_ALLOCATED" as const }),
  Object.freeze({ prototypeId: "INT-CP010-PROT-002" as const, disposition: "SOURCE_HOLD_NOT_ALLOCATED" as const }),
] as const);

export const INT_CP010_FINAL_GOVERNANCE = Object.freeze({
  productOwnerAuthorityCountApproved: true as const,
  approvalBasis: "PRODUCT_OWNER_DIRECTIVE_FINISH_CP" as const,
  permanentQlCount: 2 as const,
  permanentQlRange: "INT-QL-130..INT-QL-131" as const,
  nextFreeQl: INT_CP010_NEXT_FREE_QL,
  sourceHoldPrototypeCount: 2 as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
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
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function entryFor(qlId: IntCp010PermanentQlId) {
  const entry = INT_CP010_FINAL_AUTHORITIES.find((item) => item.permanentQlId === qlId);
  if (!entry) throw new Error(`Unknown CP010 permanent QL: ${qlId}`);
  return entry;
}

function permanentLifecycle(sourceLifecycle: any) {
  return deepFreeze({
    ...sourceLifecycle,
    active: false as const,
    permanentIdentityAllocated: true as const,
    stagingStatus: "NOT_STAGED" as const,
    registrationStatus: "NOT_REGISTERED" as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  });
}

function normalizedEnglishStem(stem: string) {
  return stem
    .replace(/\bA education loan\b/gu, "An education loan")
    .replace(/\ba education loan\b/gu, "an education loan")
    .replace(/\bfarm-machinery finance\b/gu, "farm-machinery loan")
    .replace(/\bvehicle finance\b/gu, "vehicle loan")
    .replace(/\bworkshop-equipment finance\b/gu, "workshop-equipment loan");
}

function normalizedExplanation(source: any, authorityId: IntCp010CandidateAuthorityId) {
  if (authorityId !== "INT-CP010-AUTH-02") return source.explanation;
  const steps = [...source.explanation.steps];
  if (steps.length < 4) throw new Error("CP010 AUTH-02 explanation is too short to normalize");
  const given = steps[0]!;
  const conclusion = steps.at(-1)!;
  const reverseRecurrence = steps.slice(1, -1).reverse();
  return deepFreeze({
    ...source.explanation,
    steps: Object.freeze([given, ...reverseRecurrence, conclusion]),
  });
}

export function generateIntCp010PermanentEnglish(qlId: IntCp010PermanentQlId, seed: string | number) {
  const entry = entryFor(qlId);
  const source = generateIntCp010ProductionCandidateV2(entry.authorityId as IntCp010CandidateAuthorityId, seed) as any;
  if (source.sourcePrototypeId !== entry.sourcePrototypeId) throw new Error(`${qlId}/${seed}: source prototype drift`);
  return deepFreeze({
    ...source,
    finalRegistryVersion: INT_CP010_FINAL_REGISTRY_VERSION,
    completionStatus: INT_CP010_COMPLETION_STATUS,
    permanentQlId: qlId,
    permanentIdentityAllocated: true as const,
    stem: normalizedEnglishStem(source.stem),
    explanation: normalizedExplanation(source, entry.authorityId),
    lifecycle: permanentLifecycle(source.lifecycle),
  });
}

export function generateIntCp010PermanentLocalized(
  qlId: IntCp010PermanentQlId,
  seed: string | number,
  language: IntCp010LocalizationLanguage,
) {
  const entry = entryFor(qlId);
  const source = generateIntCp010LocalizedCandidate(entry.authorityId as IntCp010CandidateAuthorityId, seed, language) as any;
  if (source.sourcePrototypeId !== entry.sourcePrototypeId) throw new Error(`${qlId}/${seed}/${language}: source prototype drift`);
  return deepFreeze({
    ...source,
    finalRegistryVersion: INT_CP010_FINAL_REGISTRY_VERSION,
    completionStatus: INT_CP010_COMPLETION_STATUS,
    permanentQlId: qlId,
    permanentIdentityAllocated: true as const,
    explanation: normalizedExplanation(source, entry.authorityId),
    lifecycle: permanentLifecycle(source.lifecycle),
  });
}
