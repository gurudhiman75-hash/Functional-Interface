import { createHash } from "node:crypto";
import type { BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import type { BtdCp007LanguageV5 } from "../BTD-CP-007/btd-cp007-hi-pa-localization-v5";
import {
  BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1,
  btdCp008HiPaLearnerPayload,
  buildBtdHiPaFreezeReadinessCandidateV1,
} from "../BTD-CP-008/btd-cp008-hi-pa-freeze-readiness-v1";

export const BTD_CP009_HI_PA_FREEZE_VERSION = "BTD-001-CP009-HI-PA-FREEZE-v1" as const;

export const BTD_CP009_HI_PA_FREEZE_MANIFEST_V1 = Object.freeze({
  chapterId: "BTD-001" as const,
  checkpointId: "BTD-CP-009" as const,
  approvalAuthority: "EXPLICIT_OPERATOR_APPROVAL" as const,
  approvalRecorded: true as const,
  readinessAuthorityHead: "d3abc619ac80788138b7aa0f30244ae0b92ea037" as const,
  sourceLocalizationVersion: "BTD-001-CP007-HI-PA-LOCALIZATION-v5" as const,
  sourceReadinessVersion: "BTD-001-CP008-HI-PA-FREEZE-READINESS-v1" as const,
  qlCount: 20 as const,
  languages: Object.freeze(["hi", "pa"] as const),
  seedsPerQlPerLanguage: 100 as const,
  canonicalQuestionCount: 4000 as const,
  reviewQuestionCount: 120 as const,
  chapterFingerprint: "43f0f013d562f7e31382d14dda4fe1db4300566cd91592290dfc7b1f518a0a87" as const,
  reviewFingerprint: "ed36555d23de2e6f764bbc95c4b9a3ea490e260f6415b14ca14d1cc0224fe48b" as const,
  perQlLanguage: BTD_CP008_HI_PA_FREEZE_READINESS_MANIFEST_V1.perQlLanguage,
});

export const BTD_CP009_HI_PA_FREEZE_BOUNDARY = Object.freeze({
  permanentQlAllocated: true as const,
  multilingualFreezeApproved: true as const,
  multilingualFrozen: true as const,
  contentFreezeStatus: "FROZEN_HI_PA" as const,
  frozenLanguages: Object.freeze(["hi", "pa"] as const),
  questionStudioDiscoverable: false as const,
  questionStudioGenerationEnabled: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

function jsonNative<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

export function btdCp009HiPaLearnerPayload(question: any) {
  return jsonNative(btdCp008HiPaLearnerPayload(question));
}

export function btdCp009HiPaContentFingerprint(question: any): string {
  return createHash("sha256").update(canonicalJson(btdCp009HiPaLearnerPayload(question))).digest("hex");
}

export function buildBtdFrozenHiPaQuestionV1(qlId: BtdPermanentQlId, seed: string, language: BtdCp007LanguageV5) {
  const readiness = buildBtdHiPaFreezeReadinessCandidateV1(qlId, seed, language) as any;
  const learnerPayload = btdCp009HiPaLearnerPayload(readiness);

  return deepFreeze({
    ...readiness,
    checkpointId: "BTD-CP-009" as const,
    freezeVersion: BTD_CP009_HI_PA_FREEZE_VERSION,
    contentFingerprint: createHash("sha256").update(canonicalJson(learnerPayload)).digest("hex"),
    lifecycle: BTD_CP009_HI_PA_FREEZE_BOUNDARY,
  });
}
