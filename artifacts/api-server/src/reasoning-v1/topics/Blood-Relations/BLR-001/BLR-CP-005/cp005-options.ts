import {
  optionLabel,
  personName,
  relationDisplay,
  stableOptions,
  type BlrCp005Authority,
  type BlrCp005Option,
  type BlrCp005PrototypeId,
  type BlrCp005RelationAnswerId,
  type BlrCp005TruthStatus,
} from "./cp005-model";
import { BLR_CP005_PROTOTYPE_CASES } from "./cp005-scenarios";
import { solveBlrCp005Query } from "./cp005-solver";

const RELATION_DISTRACTOR_MAP: Partial<Record<BlrCp005RelationAnswerId, readonly BlrCp005RelationAnswerId[]>> = {
  FATHER: ["MOTHER", "PARENT", "FATHER_IN_LAW"],
  MOTHER: ["FATHER", "PARENT", "MOTHER_IN_LAW"],
  SON: ["DAUGHTER", "CHILD", "BROTHER"],
  DAUGHTER: ["SON", "CHILD", "SISTER"],
  BROTHER: ["SISTER", "SIBLING", "UNCLE"],
  SISTER: ["BROTHER", "SIBLING", "AUNT"],
  HUSBAND: ["BROTHER", "SPOUSE", "SON_IN_LAW"],
  WIFE: ["SISTER", "SPOUSE", "DAUGHTER_IN_LAW"],
  UNCLE: ["FATHER", "BROTHER", "BROTHER_IN_LAW"],
  AUNT: ["MOTHER", "SISTER", "SISTER_IN_LAW"],
  BROTHER_IN_LAW: ["BROTHER", "HUSBAND", "FATHER_IN_LAW"],
  SISTER_IN_LAW: ["SISTER", "WIFE", "MOTHER_IN_LAW"],
  FATHER_IN_LAW: ["FATHER", "GRANDFATHER", "BROTHER_IN_LAW"],
  MOTHER_IN_LAW: ["MOTHER", "GRANDMOTHER", "SISTER_IN_LAW"],
  CHILD: ["SON", "DAUGHTER", "SIBLING"],
  PARENT: ["FATHER", "MOTHER", "GRANDPARENT"],
  SIBLING: ["BROTHER", "SISTER", "COUSIN"],
  SPOUSE: ["HUSBAND", "WIFE", "SIBLING_IN_LAW"],
  UNCLE_OR_AUNT: ["UNCLE", "AUNT", "PARENT"],
  PARENT_IN_LAW: ["FATHER_IN_LAW", "MOTHER_IN_LAW", "PARENT"],
  SIBLING_IN_LAW: ["BROTHER_IN_LAW", "SISTER_IN_LAW", "SIBLING"],
};

const RELATION_DISTRACTOR_FALLBACK: readonly BlrCp005RelationAnswerId[] = [
  "FATHER", "MOTHER", "SON", "DAUGHTER", "BROTHER", "SISTER", "UNCLE", "AUNT",
  "GRANDFATHER", "GRANDMOTHER", "FATHER_IN_LAW", "MOTHER_IN_LAW", "BROTHER_IN_LAW",
  "SISTER_IN_LAW", "CHILD", "SIBLING", "PARENT", "PARENT_IN_LAW",
];

function textOption(
  text: string,
  semanticKey: string,
  isCorrect: boolean,
  errorLabel?: string,
  modelStatus?: BlrCp005TruthStatus,
): BlrCp005Option {
  return { text, semanticKey, isCorrect, errorLabel, modelStatus };
}

function relationOptions(
  correct: BlrCp005RelationAnswerId,
  key: readonly (string | number)[],
): { options: BlrCp005Option[]; correctIndex: number } {
  const preferred = RELATION_DISTRACTOR_MAP[correct] ?? [];
  const distractors = [...preferred, ...RELATION_DISTRACTOR_FALLBACK]
    .filter((value, index, values) => value !== correct && values.indexOf(value) === index)
    .slice(0, 3);
  return stableOptions([
    textOption(relationDisplay(correct), `RELATION:${correct}`, true),
    ...distractors.map((value) => textOption(relationDisplay(value), `RELATION:${value}`, false, "NOT_INVARIANT_ACROSS_MODELS")),
  ], key);
}

function numericOptions(
  correct: number,
  key: readonly (string | number)[],
): { options: BlrCp005Option[]; correctIndex: number } {
  const values = new Set<number>([correct]);
  for (const value of [Math.max(0, correct - 1), correct + 1, Math.max(0, correct - 2), correct + 2, 0, 1, 2, 3, 4, 5]) {
    values.add(value);
    if (values.size === 4) break;
  }
  return stableOptions([...values].map((value) => textOption(String(value), `NUMBER:${value}`, value === correct, value === correct ? undefined : "WRONG_MODEL_BOUND")), key);
}

export function coreConcept(authority: BlrCp005Authority): readonly string[] {
  if (authority === "RESOLVE_INVARIANT_RELATION") return [
    "List every valid family model allowed by the clues.",
    "Accept an exact relation only if it survives in every model; otherwise reduce to a common broad relation when one exists.",
  ];
  if (authority === "RESOLVE_RELATION_UNCERTAINTY") return [
    "The relation answer is the complete set of surviving exact outcomes.",
    "Use ‘cannot be determined’ only when several materially different outcomes remain and no single offered broad answer is entailed.",
  ];
  if (authority === "SELECT_CLAIM_BY_MODEL_STATUS") return [
    "Definite means true in every valid model; possible means true in some but not all; impossible means true in none.",
    "Classify every option against the complete model space before selecting one.",
  ];
  if (authority === "IDENTIFY_PERSON_BY_MODEL_STATUS") return [
    "Test each named candidate in every valid family model.",
    "Do not treat a person who works in one model as definitely correct.",
  ];
  if (authority === "RESOLVE_PERSON_IDENTITY_UNCERTAINTY") return [
    "Collect all people who satisfy the target role in at least one valid model.",
    "A one-of-two answer is a formal set; three or more surviving identities remain indeterminate.",
  ];
  if (authority === "DETERMINE_COUNT_BOUND") return [
    "Compute the requested count separately in every valid model.",
    "The minimum and maximum are boundaries of the complete attainable set, not guesses from one diagram.",
  ];
  if (authority === "SELECT_COUNT_BY_MODEL_STATUS") return [
    "A count is possible when it occurs in at least one valid model and impossible when it occurs in none.",
    "The count universe must remain the same across all models.",
  ];
  return [
    "Compare the count across every valid model.",
    "Give an exact number only when all models agree; otherwise the exact count cannot be determined.",
  ];
}

export function shortcut(authority: BlrCp005Authority): string {
  if (authority.includes("COUNT")) return "Write the count from each valid model in one row, then read the minimum, maximum, membership or agreement directly.";
  if (authority.includes("PERSON")) return "Make one column per candidate and mark ✓ in every model where that person fits the role.";
  return "Use a three-state grid: all models = definite, some models = possible, no models = impossible.";
}

export function buildOptions(
  prototypeId: BlrCp005PrototypeId,
  seed: number,
  built: ReturnType<(typeof BLR_CP005_PROTOTYPE_CASES)[number]["build"]>,
  solved: ReturnType<typeof solveBlrCp005Query>,
): { options: BlrCp005Option[]; correctIndex: number } {
  const key = [prototypeId, seed, built.modelSpace.groupKey];
  const query = built.querySpec;
  const answer = solved.answer;

  if (answer.kind === "RELATION") return relationOptions(answer.relationId, key);

  if (answer.kind === "RELATION_SET") {
    const correctText = answer.relationIds.map(relationDisplay).join(" or ");
    return stableOptions([
      textOption(correctText, `RELATION_SET:${answer.relationIds.join(":")}`, true),
      textOption(relationDisplay(answer.relationIds[0]!), `RELATION:${answer.relationIds[0]}`, false, "OMITTED_SURVIVING_MODEL"),
      textOption(relationDisplay(answer.relationIds[1]!), `RELATION:${answer.relationIds[1]}`, false, "OMITTED_SURVIVING_MODEL"),
      textOption("Cannot be determined", "INDETERMINATE", false, "IGNORED_EXACT_TWO_OUTCOME_SET"),
    ], key);
  }

  if (query.kind === "RELATION_UNCERTAINTY" && answer.kind === "INDETERMINATE") {
    const relations = solved.relationOutcomes.slice(0, 3) as BlrCp005RelationAnswerId[];
    return stableOptions([
      textOption("Cannot be determined", "INDETERMINATE", true),
      ...relations.map((relationId) => textOption(relationDisplay(relationId), `RELATION:${relationId}`, false, "SELECTED_ONE_SURVIVING_MODEL")),
    ], key);
  }

  if (query.kind === "CLAIM_STATUS" && answer.kind === "CLAIM") {
    return stableOptions(query.claims.map((claim) => {
      const status = solved.claimStatuses[claim.claimId]!;
      return textOption(claim.text, `CLAIM:${claim.claimId}`, claim.claimId === answer.claimId, status === query.requestedStatus ? undefined : `CLAIM_IS_${status}`, status);
    }), key);
  }

  if (query.kind === "PERSON_STATUS" && answer.kind === "PERSON") {
    return stableOptions([...new Set(query.candidatePersonIds)].map((personId) => {
      const status = solved.personStatuses[personId]!;
      return textOption(personName(built.modelSpace, personId), `PERSON:${personId}`, personId === answer.personId, status === query.requestedStatus ? undefined : `PERSON_IS_${status}`, status);
    }), key);
  }

  if (query.kind === "PERSON_UNCERTAINTY") {
    if (answer.kind === "PERSON_SET") {
      const names = answer.personIds.map((personId) => personName(built.modelSpace, personId));
      return stableOptions([
        textOption(names.join(" or "), `PERSON_SET:${answer.personIds.join(":")}`, true),
        textOption(names[0]!, `PERSON:${answer.personIds[0]}`, false, "OMITTED_SURVIVING_PERSON"),
        textOption(names[1]!, `PERSON:${answer.personIds[1]}`, false, "OMITTED_SURVIVING_PERSON"),
        textOption("Cannot be determined", "INDETERMINATE", false, "IGNORED_EXACT_TWO_PERSON_SET"),
      ], key);
    }
    const possibleIds = answer.kind === "INDETERMINATE" ? answer.survivingValues.map(String).slice(0, 3) : [];
    return stableOptions([
      textOption("Cannot be determined", "INDETERMINATE", true),
      ...possibleIds.map((personId) => textOption(personName(built.modelSpace, personId), `PERSON:${personId}`, false, "SELECTED_ONE_POSSIBLE_PERSON")),
    ], key);
  }

  if (query.kind === "COUNT_STATUS" && answer.kind === "NUMBER") {
    return stableOptions(query.candidateValues.map((value) => {
      const status = solved.countOutcomes.includes(value) ? "POSSIBLE" : "IMPOSSIBLE";
      return textOption(
        String(value),
        `NUMBER:${value}`,
        value === answer.value,
        status === query.requestedStatus ? undefined : `COUNT_IS_${status}`,
        status,
      );
    }), key);
  }

  if (query.kind === "COUNT_DETERMINACY" && answer.kind === "INDETERMINATE") {
    const counts = answer.survivingValues.map(Number);
    const filler = Math.max(...counts) + 1;
    return stableOptions([
      textOption("Cannot be determined", "INDETERMINATE", true),
      ...counts.slice(0, 2).map((value) => textOption(String(value), `NUMBER:${value}`, false, "SELECTED_ONE_MODEL_COUNT")),
      textOption(String(filler), `NUMBER:${filler}`, false, "COUNT_NOT_ATTAINABLE"),
    ], key);
  }

  if (answer.kind === "NUMBER") {
    if (query.kind === "COUNT_DETERMINACY") {
      const wrongValues = [Math.max(0, answer.value - 1), answer.value + 1, answer.value + 2]
        .filter((value, index, values) => value !== answer.value && values.indexOf(value) === index)
        .slice(0, 2);
      return stableOptions([
        textOption(String(answer.value), `NUMBER:${answer.value}`, true),
        ...wrongValues.map((value) => textOption(String(value), `NUMBER:${value}`, false, "WRONG_MODEL_COUNT")),
        textOption("Cannot be determined", "INDETERMINATE", false, "IGNORED_INVARIANT_COUNT"),
      ], key);
    }
    return numericOptions(answer.value, key);
  }

  throw new Error(`Unsupported CP-005 option build for ${prototypeId}.`);
}

export function conclusionFor(
  authority: BlrCp005Authority,
  solved: ReturnType<typeof solveBlrCp005Query>,
  answerLabel: string,
  modelCount: number,
): string {
  if (authority === "RESOLVE_INVARIANT_RELATION") {
    return `${answerLabel} is preserved in all ${modelCount} valid family models.`;
  }
  if (authority === "RESOLVE_RELATION_UNCERTAINTY") {
    return solved.answer.kind === "RELATION_SET"
      ? `Exactly two relations survive the complete model space: ${answerLabel}.`
      : `Several materially different relations survive, so the exact relation cannot be determined.`;
  }
  if (authority === "SELECT_CLAIM_BY_MODEL_STATUS") {
    return `${answerLabel} alone has the truth status requested in the question.`;
  }
  if (authority === "IDENTIFY_PERSON_BY_MODEL_STATUS") {
    return `${answerLabel} is the only candidate whose role has the requested status across all models.`;
  }
  if (authority === "RESOLVE_PERSON_IDENTITY_UNCERTAINTY") {
    return solved.answer.kind === "PERSON_SET"
      ? `The complete surviving identity set is ${answerLabel}.`
      : `At least three named candidates remain possible, so one identity cannot be fixed.`;
  }
  if (authority === "DETERMINE_COUNT_BOUND") {
    return `${answerLabel} is the requested boundary of the attainable count set.`;
  }
  if (authority === "SELECT_COUNT_BY_MODEL_STATUS") {
    return `${answerLabel} is the only offered count with the requested possible/impossible status.`;
  }
  return solved.answer.kind === "NUMBER"
    ? `Every valid model gives the same count, ${answerLabel}.`
    : `The valid models give different counts, so the exact count cannot be determined.`;
}

export function optionExplanation(
  option: BlrCp005Option,
  optionIndex: number,
  requestedStatus: BlrCp005TruthStatus | undefined,
  modelCount: number,
): string {
  const label = optionLabel(optionIndex);
  if (option.isCorrect) {
    if (option.modelStatus) {
      return `Option ${label} is ${option.modelStatus.toLocaleLowerCase("en-IN")} across the complete ${modelCount}-model space, exactly as requested.`;
    }
    return `Option ${label} matches the answer obtained after all ${modelCount} valid models are compared.`;
  }
  if (option.modelStatus && requestedStatus) {
    return `Option ${label} is ${option.modelStatus.toLocaleLowerCase("en-IN")}, not ${requestedStatus.toLocaleLowerCase("en-IN")}.`;
  }
  const explanations: Readonly<Record<string, string>> = {
    NOT_INVARIANT_ACROSS_MODELS: "This relation is not preserved in every valid model.",
    OMITTED_SURVIVING_MODEL: "This selects only one surviving outcome and omits another valid model.",
    IGNORED_EXACT_TWO_OUTCOME_SET: "Exactly two outcomes survive, so the formal one-of-two set is more precise than indeterminacy.",
    SELECTED_ONE_SURVIVING_MODEL: "This is supported by one model only and cannot represent the whole model space.",
    OMITTED_SURVIVING_PERSON: "This names only one of the two surviving candidates.",
    IGNORED_EXACT_TWO_PERSON_SET: "Exactly two named candidates survive, so the one-of-two set is determinable.",
    SELECTED_ONE_POSSIBLE_PERSON: "This person is possible, but at least two other people also remain possible.",
    WRONG_MODEL_BOUND: "This value is not the requested minimum or maximum of the attainable counts.",
    SELECTED_ONE_MODEL_COUNT: "This count occurs in one model but not in every model.",
    COUNT_NOT_ATTAINABLE: "No valid model produces this count.",
    WRONG_MODEL_COUNT: "This count disagrees with the invariant count in every valid model.",
    IGNORED_INVARIANT_COUNT: "All valid models agree, so the count is determinable.",
  };
  return `Option ${label} is incorrect. ${explanations[option.errorLabel ?? ""] ?? "It does not satisfy the requested model-space condition."}`;
}
