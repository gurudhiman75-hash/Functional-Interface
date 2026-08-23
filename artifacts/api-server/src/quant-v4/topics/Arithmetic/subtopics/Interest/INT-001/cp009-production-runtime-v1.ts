import { createHash } from "node:crypto";
import { eq } from "./cp003-exam-model";
import {
  buildIntCp009ExamReadyPolishedPackage,
  solveIntCp009Prototype,
  verifyIntCp009PrototypeAnswer,
  type IntCp009PrototypeId,
} from "./cp009-dated-cash-flow-exam-ready-v3-polish";
import {
  INT_CP009_PERMANENT_QL_IDS,
  getIntCp009PermanentAuthority,
  type IntCp009PermanentQlId,
} from "./cp009-permanent-allocation-v1";

export const INT_CP009_PRODUCTION_RUNTIME_VERSION = "INT-CP-009-PRODUCTION-RUNTIME-v1" as const;
export { INT_CP009_PERMANENT_QL_IDS };
export type { IntCp009PermanentQlId };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

function stableIndex(value: string, modulo: number) {
  const digest = createHash("sha256").update(value).digest();
  return digest.readUInt32BE(0) % modulo;
}

function resolvePrototype(qlId: IntCp009PermanentQlId, seed: string): IntCp009PrototypeId {
  const authority = getIntCp009PermanentAuthority(qlId);
  return authority.sourcePrototypeIds[stableIndex(`${qlId}:${seed}:source-variant`, authority.sourcePrototypeIds.length)]!;
}

export function getIntCp009PrototypeForPermanentQl(qlId: IntCp009PermanentQlId, seed: string | number) {
  return resolvePrototype(qlId, String(seed));
}

export function generateIntCp009Permanent(qlId: IntCp009PermanentQlId, seed: string | number) {
  const sourceSeed = String(seed);
  const authority = getIntCp009PermanentAuthority(qlId);
  const prototypeId = resolvePrototype(qlId, sourceSeed);
  const source = buildIntCp009ExamReadyPolishedPackage(prototypeId, `permanent:${qlId}:${sourceSeed}`) as any;

  const canonical = solveIntCp009Prototype(source.mathematicalState);
  if (!eq(canonical, source.answer)) throw new Error(`${qlId}/${sourceSeed}: canonical answer drift.`);
  if (!verifyIntCp009PrototypeAnswer(source.mathematicalState, source.answer)) throw new Error(`${qlId}/${sourceSeed}: independent verifier rejected answer.`);
  if (source.options[source.correctIndex]?.text !== source.correctAnswer) throw new Error(`${qlId}/${sourceSeed}: option ownership drift.`);

  const fingerprint = createHash("sha256")
    .update(stable({ qlId, prototypeId, state: source.mathematicalState, answer: source.answer }))
    .digest("hex");

  return deepFreeze({
    productionRuntimeVersion: INT_CP009_PRODUCTION_RUNTIME_VERSION,
    checkpointId: "INT-CP-009" as const,
    permanentQlId: qlId,
    authorityId: authority.authorityId,
    solveContract: authority.solveContract,
    sourcePrototypeId: prototypeId,
    sourceVariantCount: authority.sourcePrototypeIds.length,
    sourceSeed,
    locale: "en-IN" as const,
    stem: source.presentation.prompt,
    stemFamilyId: source.presentation.stemFamilyId,
    options: source.options,
    correctIndex: source.correctIndex,
    correctAnswer: source.correctAnswer,
    answer: source.answer,
    answerSemantic: source.answerSemantic,
    permanentAnswerSemantic: authority.answerSemantic,
    explanation: source.explanation,
    mathematicalState: source.mathematicalState,
    difficultyBand: authority.baselineDifficulty,
    mathematicalFingerprint: fingerprint,
    lifecycle: deepFreeze({
      active: true as const,
      permanentIdentityAllocated: true as const,
      productionRuntimeReady: true as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
    sourcePackage: source,
  });
}
