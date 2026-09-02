import { createHash } from "node:crypto";
import { generateIntCp009Localized, type IntCp009Language } from "./cp009-localization-v2";
import { type IntCp009PermanentQlId } from "./cp009-production-runtime-v1";

export const INT_CP009_FINAL_FREEZE_VERSION = "INT-CP-009-MULTILINGUAL-FREEZE-v1" as const;
export const INT_CP009_RELEASE_ID = "INT-CP-009-QL125-129-EN-HI-PA-FROZEN-v1" as const;

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

export function generateIntCp009Frozen(qlId: IntCp009PermanentQlId, seed: string | number, language: IntCp009Language = "en") {
  const source = generateIntCp009Localized(qlId, seed, language) as any;
  const freezeFingerprint = createHash("sha256")
    .update(stable({ releaseId: INT_CP009_RELEASE_ID, qlId, language, sourceFingerprint: source.mathematicalFingerprint, stem: source.stem, options: source.options, explanation: source.explanation }))
    .digest("hex");

  return deepFreeze({
    ...source,
    freezeVersion: INT_CP009_FINAL_FREEZE_VERSION,
    releaseId: INT_CP009_RELEASE_ID,
    freezeFingerprint,
    lifecycle: deepFreeze({
      ...source.lifecycle,
      active: true as const,
      permanentIdentityAllocated: true as const,
      productionRuntimeReady: true as const,
      englishContentFrozen: true as const,
      localizationFrozen: true as const,
      learnerContentFrozen: true as const,
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
