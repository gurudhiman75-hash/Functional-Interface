import { ENV_CP020_REVIEW_V1 } from "./env-cp020-review-generator-v1";
import type { EnvCp020ReviewQuestion } from "./env-cp020-review-types";

function cleanLearnerText(value: string): string {
  return value
    .replace(/most strongly associated with conservation of/gi, "best known for conservation of")
    .replace(/strongly associated with acid rain/gi, "a major contributor to acid rain")
    .replace(/closely associated with/gi, "best known for")
    .replace(/especially associated with/gi, "especially known for")
    .replace(/associated with/gi, "linked to")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateEnvCp020ReviewV2(): readonly EnvCp020ReviewQuestion[] {
  return Object.freeze(
    ENV_CP020_REVIEW_V1.map((q) =>
      Object.freeze({
        ...q,
        stem: cleanLearnerText(q.stem),
        explanation: cleanLearnerText(q.explanation),
      }),
    ),
  );
}

export const ENV_CP020_REVIEW_V2 = generateEnvCp020ReviewV2();
