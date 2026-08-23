import type {
  KnowledgeEligibilityIssue,
  KnowledgeEligibilityResult,
  KnowledgeFact,
} from "./types";

function validDate(value: string | undefined) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function requiredText(
  issues: KnowledgeEligibilityIssue[],
  field: string,
  value: unknown,
) {
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({
      code: "MISSING_REQUIRED_FIELD",
      field,
      message: `${field} is required`,
    });
  }
}

export function validateKnowledgeFactEligibility(
  fact: KnowledgeFact,
  options: {
    asOf: string;
    minimumConfidence?: number;
  },
): KnowledgeEligibilityResult {
  const issues: KnowledgeEligibilityIssue[] = [];
  const minimumConfidence = options.minimumConfidence ?? 0.9;
  const asOf = validDate(options.asOf);

  if (asOf === null) {
    issues.push({
      code: "INVALID_AS_OF",
      field: "asOf",
      message: "Generation asOf must be a valid date or timestamp",
    });
  }

  requiredText(issues, "factId", fact.factId);
  requiredText(issues, "entityId", fact.entityId);
  requiredText(issues, "subject", fact.subject);
  requiredText(issues, "chapterId", fact.chapterId);
  requiredText(issues, "cpId", fact.cpId);
  requiredText(issues, "relation", fact.relation);
  requiredText(issues, "contextGroupId", fact.contextGroupId);
  requiredText(issues, "entity.canonicalName", fact.entity.canonicalName);
  requiredText(issues, "entity.label.en", fact.entity.label.en);
  requiredText(issues, "source.sourceId", fact.source.sourceId);
  requiredText(issues, "source.title", fact.source.title);

  if (fact.review.status !== "APPROVED") {
    issues.push({
      code: "FACT_NOT_APPROVED",
      field: "review.status",
      message: `Fact ${fact.factId} is not editorially approved`,
    });
  }

  if (
    !Number.isFinite(fact.review.confidence) ||
    fact.review.confidence < minimumConfidence ||
    fact.review.confidence > 1
  ) {
    issues.push({
      code: "CONFIDENCE_BELOW_GATE",
      field: "review.confidence",
      message: `Fact confidence must be between ${minimumConfidence} and 1`,
    });
  }

  if (fact.review.status === "APPROVED" && !validDate(fact.review.reviewedAt)) {
    issues.push({
      code: "MISSING_REVIEW_TIMESTAMP",
      field: "review.reviewedAt",
      message: "Approved facts require a valid reviewedAt timestamp",
    });
  }

  const validFrom = validDate(fact.freshness.validFrom);
  const validUntil = validDate(fact.freshness.validUntil);
  const lastVerifiedAt = validDate(fact.freshness.lastVerifiedAt);

  if (fact.freshness.validFrom && validFrom === null) {
    issues.push({
      code: "INVALID_VALID_FROM",
      field: "freshness.validFrom",
      message: "validFrom must be a valid date or timestamp",
    });
  }
  if (fact.freshness.validUntil && validUntil === null) {
    issues.push({
      code: "INVALID_VALID_UNTIL",
      field: "freshness.validUntil",
      message: "validUntil must be a valid date or timestamp",
    });
  }
  if (fact.freshness.lastVerifiedAt && lastVerifiedAt === null) {
    issues.push({
      code: "INVALID_LAST_VERIFIED",
      field: "freshness.lastVerifiedAt",
      message: "lastVerifiedAt must be a valid date or timestamp",
    });
  }

  if (
    validFrom !== null &&
    validUntil !== null &&
    validFrom > validUntil
  ) {
    issues.push({
      code: "INVALID_VALIDITY_WINDOW",
      field: "freshness",
      message: "validFrom cannot be after validUntil",
    });
  }

  if (asOf !== null && validFrom !== null && asOf < validFrom) {
    issues.push({
      code: "FACT_NOT_YET_VALID",
      field: "freshness.validFrom",
      message: `Fact ${fact.factId} is not valid at the requested generation date`,
    });
  }

  if (asOf !== null && validUntil !== null && asOf > validUntil) {
    issues.push({
      code: "FACT_EXPIRED",
      field: "freshness.validUntil",
      message: `Fact ${fact.factId} has expired for the requested generation date`,
    });
  }

  if (
    fact.freshness.class !== "IMMUTABLE" &&
    lastVerifiedAt === null
  ) {
    issues.push({
      code: "MUTABLE_FACT_NOT_VERIFIED",
      field: "freshness.lastVerifiedAt",
      message: `${fact.freshness.class} facts require lastVerifiedAt`,
    });
  }

  if (
    (fact.freshness.class === "CURRENT" ||
      fact.freshness.class === "EVENT") &&
    validFrom === null
  ) {
    issues.push({
      code: "MISSING_VALID_FROM",
      field: "freshness.validFrom",
      message: `${fact.freshness.class} facts require validFrom`,
    });
  }

  if (fact.freshness.class === "EVENT" && validUntil === null) {
    issues.push({
      code: "EVENT_WITHOUT_EXPIRY",
      field: "freshness.validUntil",
      message: "EVENT facts require an explicit validUntil archive boundary",
    });
  }

  return {
    eligible: issues.length === 0,
    issues,
  };
}

export function assertKnowledgeFactEligible(
  fact: KnowledgeFact,
  options: {
    asOf: string;
    minimumConfidence?: number;
  },
) {
  const result = validateKnowledgeFactEligibility(fact, options);
  if (!result.eligible) {
    const summary = result.issues
      .map((issue) => `${issue.code}:${issue.field}`)
      .join(", ");
    throw new Error(`Knowledge fact ${fact.factId} is not generation-eligible: ${summary}`);
  }
}
