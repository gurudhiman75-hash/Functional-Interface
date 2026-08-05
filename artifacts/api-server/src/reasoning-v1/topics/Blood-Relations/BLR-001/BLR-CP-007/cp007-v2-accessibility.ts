import { relationDisplay, type BlrCp006Graph } from "../BLR-CP-006/cp006-model";
import type { BlrCp007Scenario } from "./cp007-model";
import type {
  BlrCp007V2Option,
  BlrCp007V2Question,
} from "./cp007-v2-model";
import { targetForQuery } from "./cp007-v2-option-builder";
import { buildBlrCp007V2Explanation } from "./cp007-v2-presentation";

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
  const target =
    targetForQuery(scenario.query) ??
    (scenario.query.kind === "SELECT_VALIDITY" ? selected.claim : undefined);
  const decodedEvidence = selected.decodedAssertions.join(" ");
  const actual = selected.actualRelation
    ? relationDisplay(selected.actualRelation).toLocaleLowerCase("en-IN")
    : "required relation";
  const summary =
    scenario.query.kind === "SELECT_VALIDITY" &&
    selected.statementValidity === "INVALID" &&
    selected.claim
      ? `The coded statements decode as follows: ${decodedEvidence} The option claims that ${selected.claim.subjectId} is the ${relationDisplay(selected.claim.relationId).toLocaleLowerCase("en-IN")} of ${selected.claim.referenceId}, but the decoded graph gives ${actual}.`
      : target
        ? `The coded statements decode as follows: ${decodedEvidence} Therefore ${target.subjectId} is the ${actual} of ${target.referenceId}. The highlighted diagram path shows this conclusion.`
        : `The completed family graph contains ${graph.persons.length} people and ${explanation.familyTree.edges.length} labelled family links derived from the selected coded option.`;
  return {
    ...explanation,
    familyTree: {
      ...explanation.familyTree,
      description: summary,
      accessibleSummary: summary,
    },
  };
}
