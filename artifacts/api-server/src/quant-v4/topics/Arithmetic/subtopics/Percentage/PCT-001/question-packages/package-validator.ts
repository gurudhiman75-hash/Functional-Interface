import { getQuestionEntry, getTaskKind } from "../library";
import {
  PCT_001_QUESTION_PACKAGE_SCHEMA_VERSION,
  type QuestionPackage,
  type QuestionPackageAssetKind,
  type QuestionPackageValidationFailure,
  type QuestionPackageValidationResult,
} from "./types";

const REQUIRED_ASSETS: readonly QuestionPackageAssetKind[] = [
  "stem",
  "variables",
  "explanationPolicies",
  "hints",
  "misconceptions",
  "realism",
  "validation",
];

export function validateQuestionPackage(
  questionPackage: QuestionPackage,
): QuestionPackageValidationResult {
  const failures: QuestionPackageValidationFailure[] = [];
  const { metadata, assets } = questionPackage;
  if (
    metadata.schemaVersion !== PCT_001_QUESTION_PACKAGE_SCHEMA_VERSION ||
    metadata.canonicalProblemId !== "PCT-CP-002" ||
    metadata.taskKind !== "percentOfKnownNumber" ||
    getTaskKind("PCT-CP-002", metadata.qlId) !== metadata.taskKind
  ) {
    failures.push({
      code: "INVALID_METADATA",
      message: `Invalid metadata for ${metadata.questionId}.`,
    });
  }
  getQuestionEntry("PCT-CP-002", metadata.qlId, "en");
  for (const asset of REQUIRED_ASSETS) {
    if (!questionPackage.assetPresence[asset]) {
      failures.push({
        code: "MISSING_ASSET",
        asset,
        message: `${metadata.questionId} is missing ${asset}.`,
      });
    } else if (assets[asset] === null) {
      failures.push({
        code: "EMPTY_ASSET",
        asset,
        message: `${metadata.questionId} requires human-authored ${asset}.`,
      });
    }
  }
  if (metadata.status !== "APPROVED" && metadata.status !== "ACTIVE") {
    failures.push({
      code: "UNAPPROVED_STATUS",
      message: `${metadata.questionId} is not approved for generation.`,
    });
  }
  return {
    valid: failures.length === 0,
    generationReady: failures.length === 0,
    failures,
  };
}
