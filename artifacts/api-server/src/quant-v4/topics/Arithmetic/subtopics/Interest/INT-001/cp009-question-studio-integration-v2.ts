import {
  INT_CP009_QUESTION_STUDIO_CP_ID,
  INT_CP009_QUESTION_STUDIO_LANGUAGES,
  INT_CP009_QUESTION_STUDIO_PACKAGE_ID,
  generateIntCp009QuestionStudioBatch as generateV1,
  isIntCp009QuestionStudioRequest,
  listIntCp009QuestionStudioPackages,
  type IntCp009QuestionStudioRequest,
} from "./cp009-question-studio-integration-v1";

export {
  INT_CP009_QUESTION_STUDIO_CP_ID,
  INT_CP009_QUESTION_STUDIO_LANGUAGES,
  INT_CP009_QUESTION_STUDIO_PACKAGE_ID,
  isIntCp009QuestionStudioRequest,
  listIntCp009QuestionStudioPackages,
};
export type { IntCp009QuestionStudioRequest };
export const INT_CP009_QUESTION_STUDIO_INTEGRATION_VERSION = "INT-CP-009-QS-v2-json-safe" as const;

function toJsonSafe(value: unknown): any {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return Object.freeze(value.map(toJsonSafe));
  if (value && typeof value === "object") {
    return Object.freeze(Object.fromEntries(
      Reflect.ownKeys(value as object)
        .filter((key): key is string => typeof key === "string")
        .map((key) => [key, toJsonSafe((value as Record<string, unknown>)[key])]),
    ));
  }
  return value;
}

export async function generateIntCp009QuestionStudioBatch(request: IntCp009QuestionStudioRequest = {}) {
  const batch = await generateV1(request) as any;
  const safe = toJsonSafe({
    ...batch,
    integrationVersion: INT_CP009_QUESTION_STUDIO_INTEGRATION_VERSION,
  });
  JSON.stringify(safe);
  return safe;
}
