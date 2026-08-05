import {
  relationDisplay,
  type BlrCp006Graph,
  type BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007Scenario } from "./cp007-model";
import type {
  BlrCp007V2Option,
  BlrCp007V2Question,
} from "./cp007-v2-model";
import {
  relationForCodeToken,
  targetForQuery,
} from "./cp007-v2-option-builder";
import {
  blrCp007V2GraphPath,
  buildBlrCp007V2Explanation,
} from "./cp007-v2-presentation";

const GENDER_NEUTRAL_SUPPORT: Readonly<
  Partial<Record<BlrCp006Relation, readonly BlrCp006Relation[]>>
> = {
  PARENT: ["FATHER", "MOTHER"],
  CHILD: ["SON", "DAUGHTER"],
  SIBLING: ["BROTHER", "SISTER"],
  SPOUSE: ["HUSBAND", "WIFE"],
  GRANDPARENT: ["GRANDFATHER", "GRANDMOTHER"],
  GRANDCHILD: ["GRANDSON", "GRANDDAUGHTER"],
  UNCLE_OR_AUNT: ["UNCLE", "AUNT"],
  NEPHEW_OR_NIECE: ["NEPHEW", "NIECE"],
  PARENT_IN_LAW: ["FATHER_IN_LAW", "MOTHER_IN_LAW"],
  SIBLING_IN_LAW: ["BROTHER_IN_LAW", "SISTER_IN_LAW"],
  CHILD_IN_LAW: ["SON_IN_LAW", "DAUGHTER_IN_LAW"],
};

function lowerRelation(relation?: BlrCp006Relation): string {
  return relation
    ? relationDisplay(relation).toLocaleLowerCase("en-IN")
    : "no supported relation";
}

function genderIsNotProved(
  actual: BlrCp006Relation | undefined,
  claimed: BlrCp006Relation,
): boolean {
  return Boolean(
    actual && GENDER_NEUTRAL_SUPPORT[actual]?.includes(claimed),
  );
}

function targetForExplanation(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
) {
  return (
    targetForQuery(scenario.query) ??
    (scenario.query.kind === "SELECT_VALIDITY" ? selected.claim : undefined)
  );
}

function decisiveAssertions(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
  graph: BlrCp006Graph,
): readonly string[] {
  const target = targetForExplanation(scenario, selected);
  if (!target) return selected.decodedAssertions;
  if (
    scenario.query.kind !== "MISSING_PERSON" &&
    scenario.query.kind !== "MISSING_TOKEN_PAIR"
  ) {
    return selected.decodedAssertions;
  }
  const path = new Set(
    blrCp007V2GraphPath(graph, target.subjectId, target.referenceId),
  );
  const focused = selected.statements.flatMap((statement, index) =>
    path.has(statement.leftId) && path.has(statement.rightId)
      ? [selected.decodedAssertions[index]!]
      : [],
  );
  return focused.length ? focused : selected.decodedAssertions;
}

function pairEvidence(
  scenario: BlrCp007Scenario,
  option: BlrCp007V2Option,
): string {
  if (scenario.query.kind !== "MISSING_TOKEN_PAIR") {
    return option.decodedAssertions.join(" ");
  }
  return scenario.query.blankStatementIndices
    .map((index) => option.decodedAssertions[index])
    .filter(Boolean)
    .join(" ");
}

function validityExplanation(
  scenario: BlrCp007Scenario,
  option: BlrCp007V2Option,
): string {
  if (scenario.query.kind !== "SELECT_VALIDITY" || !option.claim) {
    throw new Error(`${scenario.scenarioId}: validity explanation called for another task.`);
  }
  const decoded = option.decodedAssertions.join(" ");
  const claimed = lowerRelation(option.claim.relationId);
  const actual = lowerRelation(option.actualRelation);
  const unsupportedGender = genderIsNotProved(
    option.actualRelation,
    option.claim.relationId,
  );

  if (option.statementValidity === "VALID") {
    return option.isCorrect
      ? `Correct choice: ${decoded} The decoded relation is ${actual}, exactly as stated.`
      : `Not the answer: ${decoded} This interpretation is valid, so it cannot be selected in an “incorrect statement” question.`;
  }

  const reason = unsupportedGender
    ? `The code establishes only ${actual}; the person's gender is not given, so ${claimed} is not proved.`
    : `The option claims ${claimed}, but the decoded relation is ${actual}.`;
  return option.isCorrect
    ? `Correct choice: the statement is not valid. ${decoded} ${reason}`
    : `Not correct: the interpretation is not supported. ${decoded} ${reason}`;
}

function refinedOptionExplanation(
  scenario: BlrCp007Scenario,
  option: BlrCp007V2Option,
): string {
  const target = targetForQuery(scenario.query);
  const decoded = option.decodedAssertions.join(" ");

  if (scenario.query.kind === "SELECT_VALIDITY") {
    return validityExplanation(scenario, option);
  }

  if (scenario.query.kind === "MISSING_TOKEN") {
    const token = (option.completionValue as { kind: "TOKEN"; token: string }).token;
    const blank = option.decodedAssertions[scenario.query.blankStatementIndex]!;
    return option.isCorrect
      ? `Correct: ${token} gives the required missing statement, “${blank}”`
      : `Not correct: ${token} makes the blank read “${blank}” which does not produce the required relation.`;
  }

  if (scenario.query.kind === "MISSING_TOKEN_PAIR") {
    const evidence = pairEvidence(scenario, option);
    const targetRelation = lowerRelation(scenario.query.target.relationId);
    const actual = lowerRelation(option.actualRelation);
    if (option.isCorrect) {
      return `Correct: ${evidence} Together, these links make ${scenario.query.target.subjectId} the ${targetRelation} of ${scenario.query.target.referenceId}.`;
    }
    const lead =
      option.failureCode === "TOKENS_SWAPPED"
        ? "The required codes are in the opposite blanks."
        : option.failureCode === "FIRST_TOKEN_WRONG"
          ? "The first blank has the wrong relation."
          : option.failureCode === "SECOND_TOKEN_WRONG"
            ? "The second blank has the wrong relation."
            : "Both blanks use the wrong relations.";
    return `${lead} ${evidence} The completed chain gives ${actual}, not ${targetRelation}.`;
  }

  if (scenario.query.kind === "MISSING_PERSON") {
    const actual = lowerRelation(option.actualRelation);
    const required = lowerRelation(scenario.query.target.relationId);
    return option.isCorrect
      ? `Correct: replacing ? with ${option.text} completes the decisive family chain and makes ${scenario.query.target.subjectId} the ${required} of ${scenario.query.target.referenceId}.`
      : `Not correct: replacing ? with ${option.text} keeps the family graph valid, but it makes ${scenario.query.target.subjectId} the ${actual} of ${scenario.query.target.referenceId}, not the ${required}.`;
  }

  const actual = lowerRelation(option.actualRelation);
  const required = target ? lowerRelation(target.relationId) : "required relation";
  if (option.isCorrect) {
    return `Correct: ${decoded} Therefore ${target!.subjectId} is the ${required} of ${target!.referenceId}.`;
  }
  if (option.failureCode === "REVERSED_DIRECTION") {
    return `Not correct: ${decoded} This establishes the relation in the reverse direction; the graph makes ${target!.subjectId} the ${actual} of ${target!.referenceId}.`;
  }
  if (option.failureCode === "WRONG_GENDER") {
    return `Not correct: ${decoded} The family path is relevant, but it gives ${actual}, not the required gendered relation ${required}.`;
  }
  if (option.failureCode === "DISCONNECTED_PATH") {
    return `Not correct: ${decoded} These statements do not establish a supported relation from ${target!.subjectId} to ${target!.referenceId}.`;
  }
  return `Not correct: ${decoded} The completed graph makes ${target!.subjectId} the ${actual} of ${target!.referenceId}, not the ${required}.`;
}

function refinedSteps(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
  graph: BlrCp006Graph,
): readonly string[] {
  const target = targetForExplanation(scenario, selected);

  if (scenario.query.kind === "SELECT_VALIDITY" && selected.claim) {
    const steps = [...selected.decodedAssertions];
    if (genderIsNotProved(selected.actualRelation, selected.claim.relationId)) {
      steps.push(
        `This proves only ${lowerRelation(selected.actualRelation)}; the gender needed for ${lowerRelation(selected.claim.relationId)} is not established.`,
      );
    } else {
      steps.push(
        `The written claim is ${lowerRelation(selected.claim.relationId)}; the decoded result is ${lowerRelation(selected.actualRelation)}.`,
      );
    }
    return steps;
  }

  if (scenario.query.kind === "MISSING_TOKEN") {
    const token = (selected.completionValue as { kind: "TOKEN"; token: string }).token;
    const blank = selected.decodedAssertions[scenario.query.blankStatementIndex]!;
    return [
      `The missing statement must be “${blank}”`,
      `${token} means “is the ${lowerRelation(relationForCodeToken(scenario, token))} of”.`,
    ];
  }

  if (scenario.query.kind === "MISSING_TOKEN_PAIR") {
    const pair = (
      selected.completionValue as {
        kind: "TOKEN_PAIR";
        tokens: readonly [string, string];
      }
    ).tokens;
    return [
      `Place ${pair[0]} in the first blank and ${pair[1]} in the second.`,
      ...decisiveAssertions(scenario, selected, graph),
      `${scenario.query.target.subjectId} is therefore the ${lowerRelation(scenario.query.target.relationId)} of ${scenario.query.target.referenceId}.`,
    ];
  }

  if (scenario.query.kind === "MISSING_PERSON") {
    return [
      `Replace ? with ${selected.text}.`,
      ...decisiveAssertions(scenario, selected, graph),
      `${scenario.query.target.subjectId} is therefore the ${lowerRelation(scenario.query.target.relationId)} of ${scenario.query.target.referenceId}.`,
    ];
  }

  const steps = [...selected.decodedAssertions];
  if (target && selected.decodedAssertions.length > 1) {
    steps.push(
      `${target.subjectId} is therefore the ${lowerRelation(target.relationId)} of ${target.referenceId}.`,
    );
  }
  return steps;
}

function refinedConclusion(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
): string {
  if (scenario.query.kind === "SELECT_VALIDITY") {
    return selected.statementValidity === "INVALID"
      ? `Therefore, ${selected.text} is the incorrect statement and is the required answer.`
      : `Therefore, ${selected.text} is the correctly interpreted statement.`;
  }
  if (scenario.query.kind === "MISSING_TOKEN") {
    const token = (selected.completionValue as { kind: "TOKEN"; token: string }).token;
    return `Therefore, the missing code is ${token}.`;
  }
  if (scenario.query.kind === "MISSING_TOKEN_PAIR") {
    const pair = (
      selected.completionValue as {
        kind: "TOKEN_PAIR";
        tokens: readonly [string, string];
      }
    ).tokens;
    return `Therefore, the missing codes are ${pair[0]} and ${pair[1]}, in that order.`;
  }
  if (scenario.query.kind === "MISSING_PERSON") {
    return `Therefore, ${selected.text} must replace ?.`;
  }
  return `Therefore, ${selected.text} correctly represents the required relation.`;
}

export function buildAccessibleBlrCp007V2Explanation(
  scenario: BlrCp007Scenario,
  options: readonly BlrCp007V2Option[],
  selected: BlrCp007V2Option,
  graph: BlrCp006Graph,
): BlrCp007V2Question["explanation"] {
  const explanation = buildBlrCp007V2Explanation(
    scenario,
    options,
    selected,
    graph,
  );
  const target = targetForExplanation(scenario, selected);
  const evidence = decisiveAssertions(scenario, selected, graph).join(" ");
  const summary =
    scenario.query.kind === "SELECT_VALIDITY" &&
    selected.statementValidity === "INVALID" &&
    selected.claim
      ? genderIsNotProved(selected.actualRelation, selected.claim.relationId)
        ? `${evidence} The graph establishes only ${lowerRelation(selected.actualRelation)}; the gender required to claim ${lowerRelation(selected.claim.relationId)} is not given.`
        : `${evidence} The option claims ${lowerRelation(selected.claim.relationId)}, but the decoded graph gives ${lowerRelation(selected.actualRelation)}.`
      : target
        ? `${evidence} Therefore ${target.subjectId} is the ${lowerRelation(selected.actualRelation ?? target.relationId)} of ${target.referenceId}.`
        : `The completed family graph contains ${graph.persons.length} people and ${explanation.familyTree.edges.length} labelled family links.`;

  return {
    ...explanation,
    steps: refinedSteps(scenario, selected, graph),
    conclusion: refinedConclusion(scenario, selected),
    optionAnalysis: options.map((option, index) => ({
      ...explanation.optionAnalysis[index]!,
      explanation: refinedOptionExplanation(scenario, option),
    })),
    familyTree: {
      ...explanation.familyTree,
      description: summary,
      accessibleSummary: summary,
    },
  };
}
