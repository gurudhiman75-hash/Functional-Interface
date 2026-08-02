import {
  broadRelation,
  evaluateCount,
  evaluatePredicate,
  personName,
  relationDisplay,
  relationInModel,
  type BlrCp005Authority,
  type BlrCp005Model,
  type BlrCp005ModelSpace,
  type BlrCp005Option,
  type BlrCp005PrototypeId,
  type BlrCp005QuerySpec,
  type BlrCp005TruthStatus,
  type GeneratedBlrCp005Question,
} from "./cp005-model";
import type { BlrCp005SolvedQuery } from "./cp005-solver";

export const BLR_CP005_EDITORIAL_VERSION =
  "BLR_CP005_ENGLISH_EXAM_GRADE_EDITORIAL_V1" as const;

type EditorialExplanation = Omit<
  GeneratedBlrCp005Question["explanation"],
  "familyTrees"
>;

function compact(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\.\./g, ".")
    .trim();
}

export function examGradeSharedPrompt(original: string): string {
  let text = original;

  text = text.replace(
    /The gender of ([^.]+) is not stated\. No other family member is included in this question\./g,
    "These four are the only named family members.",
  );
  text = text.replace(/ The gender of [^.]+ is not stated\./g, "");
  text = text.replace(/, whose gender is not stated/g, "");
  text = text.replace(/ Nothing states whether [^.]+\./g, "");
  text = text.replace(/ No other family relation is given\./g, "");
  text = text.replace(/ The available clues do not identify which route applies\./g, "");
  text = text.replace(/ The available information does not identify which one\./g, "");
  text = text.replace(
    /The available clues establish only that (.+?) is a male family member of (.+?)\. He may be (.+?)\. No clue distinguishes these three structures\./,
    "$1 may be $3.",
  );
  text = text.replace(
    /have at least one but no more than three children\. ([^.]+) is definitely one of their children; the exact number of additional children is not stated\./,
    "have one, two or three children. $1 is one of them.",
  );

  return compact(text);
}

export function examGradeStem(input: {
  prototypeId: BlrCp005PrototypeId;
  modelSpace: BlrCp005ModelSpace;
  querySpec: BlrCp005QuerySpec;
  originalStem: string;
}): string {
  const { prototypeId, modelSpace, querySpec } = input;

  if (
    prototypeId === "BLR-CP005-PROT-GENDER-NEUTRAL-RELATION" ||
    prototypeId === "BLR-CP005-PROT-BROAD-LINEAGE-RELATION" ||
    prototypeId === "BLR-CP005-PROT-BROAD-AFFINAL-RELATION"
  ) {
    if (querySpec.kind !== "INVARIANT_RELATION") {
      throw new Error(`${prototypeId} must use an invariant-relation query.`);
    }
    return `How is ${personName(modelSpace, querySpec.subjectId)} related to ${personName(modelSpace, querySpec.referenceId)}?`;
  }

  if (
    prototypeId === "BLR-CP005-PROT-SELECT-INVARIANT-FACT" ||
    prototypeId === "BLR-CP005-PROT-SELECT-BROAD-FOLLOWING-CLAIM"
  ) {
    return "Which statement is definitely true?";
  }

  if (prototypeId === "BLR-CP005-PROT-SELECT-UNSUPPORTED-EXACT-RELATION") {
    return "Which statement is impossible?";
  }

  return compact(input.originalStem);
}

function assignmentValue(value: string): string {
  return value.toLocaleLowerCase("en-IN").replaceAll("_", " ");
}

function assignmentSummary(
  modelSpace: BlrCp005ModelSpace,
  model: BlrCp005Model,
): string {
  const entries = Object.entries(model.assignment).map(([variableId, value]) => {
    switch (variableId) {
      case "childGender":
      case "secondChildGender":
        return `the open child is ${assignmentValue(value)}`;
      case "parentGender":
        return `the parent is ${assignmentValue(value)}`;
      case "auntRoute":
        return value === "SPEAKER_SISTER"
          ? "the aunt is the speaker's sister"
          : "the aunt is the husband's sister";
      case "role":
        return `the male relative is the ${assignmentValue(value)}`;
      case "affinalRoute":
        return value === "SISTERS_HUSBAND"
          ? "the route is sister's husband"
          : "the route is husband's brother";
      case "husbandId":
        return `${personName(modelSpace, value)} is the husband`;
      case "childCount":
        return `the couple has ${value} ${value === "1" ? "child" : "children"}`;
      default:
        return `${assignmentValue(variableId)} = ${assignmentValue(value)}`;
    }
  });
  return entries.length ? entries.join("; ") : "all stated facts are fixed";
}

function requestedStatus(query: BlrCp005QuerySpec): BlrCp005TruthStatus | undefined {
  if (query.kind === "CLAIM_STATUS" || query.kind === "PERSON_STATUS") {
    return query.requestedStatus;
  }
  if (query.kind === "COUNT_STATUS") return query.requestedStatus;
  return undefined;
}

function relationAudit(
  modelSpace: BlrCp005ModelSpace,
  query: Extract<BlrCp005QuerySpec, { kind: "INVARIANT_RELATION" | "RELATION_UNCERTAINTY" }>,
  solved: BlrCp005SolvedQuery,
): string[] {
  const subject = personName(modelSpace, query.subjectId);
  const reference = personName(modelSpace, query.referenceId);
  const invariant = solved.answer.kind === "RELATION" ? solved.answer.relationId : null;

  const lines = modelSpace.models.map((model, index) => {
    const exact = relationInModel(model, query.subjectId, query.referenceId);
    const exactText = relationDisplay(exact);
    const reduction = invariant && invariant !== exact
      ? ` The exact label is ${exactText}, which reduces to the invariant ${relationDisplay(invariant)}.`
      : "";
    return `Model ${index + 1} (${assignmentSummary(modelSpace, model)}): ${subject} is ${exactText} of ${reference}.${reduction}`;
  });

  if (solved.answer.kind === "RELATION_SET") {
    lines.push(
      `Complete outcome set: ${solved.answer.relationIds.map(relationDisplay).join(" or ")}. Both outcomes must be retained.`,
    );
  } else if (solved.answer.kind === "INDETERMINATE") {
    lines.push(
      `Complete outcome set: ${solved.answer.survivingValues.map(String).map((value) => relationDisplay(value as never)).join(", ")}. Three materially different relations survive, so no exact one-of-two answer exists.`,
    );
  } else {
    lines.push(
      `${relationDisplay(solved.answer.relationId)} is the only exact or broad relation preserved across all ${modelSpace.models.length} models.`,
    );
  }
  return lines;
}

function claimAudit(
  modelSpace: BlrCp005ModelSpace,
  query: Extract<BlrCp005QuerySpec, { kind: "CLAIM_STATUS" }>,
  solved: BlrCp005SolvedQuery,
): string[] {
  const lines = modelSpace.models.map((model, index) => {
    const trueClaims = query.claims
      .filter((claim) => evaluatePredicate(model, claim.predicate))
      .map((claim) => claim.text);
    return `Model ${index + 1} (${assignmentSummary(modelSpace, model)}): true statement${trueClaims.length === 1 ? "" : "s"} — ${trueClaims.join("; ") || "none of the offered statements"}.`;
  });
  lines.push(
    `Across all models: ${query.claims.map((claim) => `${claim.text} = ${solved.claimStatuses[claim.claimId]}`).join(" | ")}.`,
  );
  return lines;
}

function matchingCandidates(
  modelSpace: BlrCp005ModelSpace,
  model: BlrCp005Model,
  referenceId: string,
  relationId: Extract<BlrCp005QuerySpec, { kind: "PERSON_STATUS" | "PERSON_UNCERTAINTY" }>["relationId"],
  candidatePersonIds: readonly string[],
): string[] {
  return [...new Set(candidatePersonIds)]
    .filter((personId) => {
      try {
        const exact = relationInModel(model, personId, referenceId);
        return exact === relationId || broadRelation(exact) === relationId;
      } catch {
        return false;
      }
    })
    .map((personId) => personName(modelSpace, personId));
}

function personAudit(
  modelSpace: BlrCp005ModelSpace,
  query: Extract<BlrCp005QuerySpec, { kind: "PERSON_STATUS" | "PERSON_UNCERTAINTY" }>,
  solved: BlrCp005SolvedQuery,
): string[] {
  const lines = modelSpace.models.map((model, index) => {
    const matches = matchingCandidates(
      modelSpace,
      model,
      query.referenceId,
      query.relationId,
      query.candidatePersonIds,
    );
    return `Model ${index + 1} (${assignmentSummary(modelSpace, model)}): matching candidate${matches.length === 1 ? "" : "s"} — ${matches.join(" or ") || "none"}.`;
  });

  if (query.kind === "PERSON_STATUS") {
    lines.push(
      `Candidate status audit: ${[...new Set(query.candidatePersonIds)].map((personId) => `${personName(modelSpace, personId)} = ${solved.personStatuses[personId]}`).join(" | ")}.`,
    );
  } else if (solved.answer.kind === "PERSON_SET") {
    lines.push(
      `Complete surviving identity set: ${solved.answer.personIds.map((personId) => personName(modelSpace, personId)).join(" or ")}.`,
    );
  } else {
    lines.push(
      `At least three named candidates survive: ${solved.answer.survivingValues.map((personId) => personName(modelSpace, String(personId))).join(", ")}.`,
    );
  }
  return lines;
}

function countAudit(
  modelSpace: BlrCp005ModelSpace,
  query: Extract<BlrCp005QuerySpec, { kind: "COUNT_BOUND" | "COUNT_STATUS" | "COUNT_DETERMINACY" }>,
  solved: BlrCp005SolvedQuery,
): string[] {
  const counts = modelSpace.models.map((model) => evaluateCount(model, query.countSpec));
  const lines = modelSpace.models.map(
    (model, index) => `Model ${index + 1} (${assignmentSummary(modelSpace, model)}): required count = ${counts[index]}.`,
  );
  lines.push(`Attainable count set: {${[...new Set(counts)].sort((a, b) => a - b).join(", ")}}.`);
  if (query.kind === "COUNT_STATUS") {
    lines.push(
      `Option status audit: ${query.candidateValues.map((value) => `${value} = ${solved.countOutcomes.includes(value) ? "POSSIBLE" : "IMPOSSIBLE"}`).join(" | ")}.`,
    );
  }
  return lines;
}

function buildModelAudit(
  modelSpace: BlrCp005ModelSpace,
  query: BlrCp005QuerySpec,
  solved: BlrCp005SolvedQuery,
): string[] {
  if (query.kind === "INVARIANT_RELATION" || query.kind === "RELATION_UNCERTAINTY") {
    return relationAudit(modelSpace, query, solved);
  }
  if (query.kind === "CLAIM_STATUS") return claimAudit(modelSpace, query, solved);
  if (query.kind === "PERSON_STATUS" || query.kind === "PERSON_UNCERTAINTY") {
    return personAudit(modelSpace, query, solved);
  }
  return countAudit(modelSpace, query, solved);
}

function coreConcept(authority: BlrCp005Authority): readonly string[] {
  switch (authority) {
    case "RESOLVE_INVARIANT_RELATION":
      return [
        "Build every family model permitted by the clues; never fill an open gender, side or route from a name or social assumption.",
        "An exact relation is definite only when the same exact label survives every model. If exact labels differ but share one structural class, answer with that invariant broad relation.",
      ];
    case "RESOLVE_RELATION_UNCERTAINTY":
      return [
        "Record the exact relation produced by each valid model.",
        "Exactly two surviving relations form a formal ‘X or Y’ answer; three or more materially different outcomes require ‘Cannot be determined’.",
      ];
    case "SELECT_CLAIM_BY_MODEL_STATUS":
      return [
        "Definite means true in all valid models, possible means true in at least one but not all, and impossible means true in none.",
        "Each option must be tested against the complete model space, not against the first convenient diagram.",
      ];
    case "IDENTIFY_PERSON_BY_MODEL_STATUS":
      return [
        "Test every named candidate separately in every valid model.",
        "A candidate is definite only with an all-model match, possible with a some-model match, and impossible with no match.",
      ];
    case "RESOLVE_PERSON_IDENTITY_UNCERTAINTY":
      return [
        "Collect the complete set of named people who can occupy the required family role.",
        "Two surviving identities give a precise one-of-two answer; three or more leave the identity indeterminate.",
      ];
    case "DETERMINE_COUNT_BOUND":
      return [
        "Evaluate the same count universe in every valid family model.",
        "The minimum is the smallest attainable count and the maximum is the largest; neither may be inferred from a single diagram.",
      ];
    case "SELECT_COUNT_BY_MODEL_STATUS":
      return [
        "A number is possible when at least one valid model produces it and impossible when no valid model does.",
        "Keep the counted set unchanged while moving from model to model.",
      ];
    case "RESOLVE_COUNT_DETERMINACY":
      return [
        "Compute the requested count independently in every valid model.",
        "Return an exact number only when all model counts agree; otherwise the exact count cannot be determined.",
      ];
  }
}

function shortcut(authority: BlrCp005Authority): string {
  switch (authority) {
    case "RESOLVE_INVARIANT_RELATION":
      return "Lock generation and the subject's known gender first. Same exact label in every model = exact answer; only gendered labels change = choose their common broad relation.";
    case "RESOLVE_RELATION_UNCERTAINTY":
      return "Write one exact relation per model. Two unique labels → choose ‘X or Y’; three or more → ‘Cannot be determined’.";
    case "SELECT_CLAIM_BY_MODEL_STATUS":
      return "Use ✓/× under each model: all ✓ = definite, mixed = possible, all × = impossible.";
    case "IDENTIFY_PERSON_BY_MODEL_STATUS":
      return "Make one column per person. The required all/some/none pattern identifies the answer in seconds.";
    case "RESOLVE_PERSON_IDENTITY_UNCERTAINTY":
      return "Circle every candidate who works in at least one model: two circles give a one-of-two answer; three or more mean indeterminate.";
    case "DETERMINE_COUNT_BOUND":
      return "Write the model counts in ascending order; the first is the minimum and the last is the maximum.";
    case "SELECT_COUNT_BY_MODEL_STATUS":
      return "List the attainable counts once. A listed option is possible; an absent option is impossible.";
    case "RESOLVE_COUNT_DETERMINACY":
      return "Compare the model counts: all equal gives that number; any mismatch gives ‘Cannot be determined’.";
  }
}

function conclusion(
  authority: BlrCp005Authority,
  solved: BlrCp005SolvedQuery,
  answerLabel: string,
  modelCount: number,
): string {
  switch (authority) {
    case "RESOLVE_INVARIANT_RELATION":
      return `${answerLabel} is the exact or broad relation preserved across all ${modelCount} valid family models.`;
    case "RESOLVE_RELATION_UNCERTAINTY":
      return solved.answer.kind === "RELATION_SET"
        ? `The complete exact-relation set is ${answerLabel}; neither surviving model may be discarded.`
        : `At least three materially different relations survive, so the exact relation cannot be determined.`;
    case "SELECT_CLAIM_BY_MODEL_STATUS":
      return `${answerLabel} is the only statement with the truth status demanded by the stem.`;
    case "IDENTIFY_PERSON_BY_MODEL_STATUS":
      return `${answerLabel} is the only candidate with the required all-model, some-model or no-model pattern.`;
    case "RESOLVE_PERSON_IDENTITY_UNCERTAINTY":
      return solved.answer.kind === "PERSON_SET"
        ? `${answerLabel} is the complete surviving identity set.`
        : `Three or more named candidates remain possible, so one identity cannot be fixed.`;
    case "DETERMINE_COUNT_BOUND":
      return `${answerLabel} is the requested boundary of the complete attainable count set.`;
    case "SELECT_COUNT_BY_MODEL_STATUS":
      return `${answerLabel} is the only offered number with the required possible or impossible status.`;
    case "RESOLVE_COUNT_DETERMINACY":
      return solved.answer.kind === "NUMBER"
        ? `Every valid model gives the same count, ${answerLabel}.`
        : `The model counts differ, so the exact count cannot be determined.`;
  }
}

function requestedStatusText(query: BlrCp005QuerySpec): string | undefined {
  return requestedStatus(query)?.toLocaleLowerCase("en-IN");
}

function diagnosticExplanation(
  option: BlrCp005Option,
  optionIndex: number,
  correctIndex: number,
  query: BlrCp005QuerySpec,
  modelCount: number,
): string {
  const label = String.fromCharCode(65 + optionIndex);
  if (optionIndex === correctIndex) {
    const statusText = option.modelStatus
      ? ` It is ${option.modelStatus.toLocaleLowerCase("en-IN")} in exactly the sense requested.`
      : "";
    return `Option ${label} is correct. It is the only choice that matches the complete ${modelCount}-model audit.${statusText} [CORRECT_COMPLETE_MODEL_MATCH]`;
  }

  const status = requestedStatusText(query);
  if (option.modelStatus && status) {
    return `Option ${label} is incorrect. It is ${option.modelStatus.toLocaleLowerCase("en-IN")}, not ${status}. [${option.errorLabel ?? `STATUS_IS_${option.modelStatus}`}]`;
  }

  const code = option.errorLabel ?? "FAILED_COMPLETE_MODEL_AUDIT";
  const explanations: Readonly<Record<string, string>> = {
    NOT_INVARIANT_ACROSS_MODELS:
      "This relation fails in at least one valid model or is broader/narrower than the strongest invariant relation.",
    OMITTED_SURVIVING_MODEL:
      "This keeps one valid outcome but discards another model that the clues also permit.",
    IGNORED_EXACT_TWO_OUTCOME_SET:
      "Exactly two outcomes survive, so the precise one-of-two set must be selected instead of indeterminacy.",
    SELECTED_ONE_SURVIVING_MODEL:
      "This chooses one model's answer as though the other valid models did not exist.",
    OMITTED_SURVIVING_PERSON:
      "This names only one candidate and omits another person who fills the role in a valid model.",
    IGNORED_EXACT_TWO_PERSON_SET:
      "Exactly two named candidates survive, so their formal one-of-two set is determinable.",
    SELECTED_ONE_POSSIBLE_PERSON:
      "This selects one possible person even though several named candidates remain valid.",
    WRONG_MODEL_BOUND:
      "This number is not the requested minimum or maximum of the attainable count set.",
    SELECTED_ONE_MODEL_COUNT:
      "This is only one model's count; another valid model gives a different count.",
    COUNT_NOT_ATTAINABLE:
      "No valid model produces this count.",
    WRONG_MODEL_COUNT:
      "This number disagrees with the invariant count obtained in every valid model.",
    IGNORED_INVARIANT_COUNT:
      "All valid models agree, so the count is determinable.",
  };
  return `Option ${label} is incorrect. ${explanations[code] ?? "Its model status or value does not satisfy the stem across the complete model space."} [${code}]`;
}

export function buildCp005EditorialExplanation(input: {
  authority: BlrCp005Authority;
  modelSpace: BlrCp005ModelSpace;
  querySpec: BlrCp005QuerySpec;
  solved: BlrCp005SolvedQuery;
  options: readonly BlrCp005Option[];
  correctIndex: number;
  answerLabel: string;
}): EditorialExplanation {
  return {
    coreConcept: coreConcept(input.authority),
    modelAudit: buildModelAudit(input.modelSpace, input.querySpec, input.solved),
    conclusion: conclusion(
      input.authority,
      input.solved,
      input.answerLabel,
      input.modelSpace.models.length,
    ),
    examShortcut: shortcut(input.authority),
    optionAnalysis: input.options.map((option, index) => ({
      optionLabel: String.fromCharCode(65 + index) as "A" | "B" | "C" | "D",
      optionText: option.text,
      isCorrect: option.isCorrect,
      explanation: diagnosticExplanation(
        option,
        index,
        input.correctIndex,
        input.querySpec,
        input.modelSpace.models.length,
      ),
    })),
  };
}
