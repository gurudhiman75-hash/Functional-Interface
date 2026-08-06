import { stableHash } from "../foundation/prng";
import type { ComparisonConstraint } from "../foundation/types";
import type { IneCp002Scenario } from "./types";

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length <= 1) return [[...values]];
  const result: T[][] = [];
  values.forEach((value, index) => {
    const remainder = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const tail of permutations(remainder)) result.push([value, ...tail]);
  });
  return result;
}

function normalizedEdge(
  statement: ComparisonConstraint,
  mappedId: Readonly<Record<string, number>>,
  irrelevant: boolean,
): string {
  let left = mappedId[statement.leftId]!;
  let right = mappedId[statement.rightId]!;
  let relation: "GT" | "GE" | "EQ";
  if (statement.relation === "LESS_THAN") {
    [left, right] = [right, left];
    relation = "GT";
  } else if (statement.relation === "LESS_THAN_OR_EQUAL") {
    [left, right] = [right, left];
    relation = "GE";
  } else if (statement.relation === "GREATER_THAN") {
    relation = "GT";
  } else if (statement.relation === "GREATER_THAN_OR_EQUAL") {
    relation = "GE";
  } else {
    relation = "EQ";
    if (right < left) [left, right] = [right, left];
  }
  return `${irrelevant ? "I" : "R"}:${left}:${relation}:${right}`;
}

export function canonicalIneCp002GraphFingerprint(
  scenario: IneCp002Scenario,
): string {
  const entityIds = new Set<string>();
  for (const statement of scenario.statements) {
    entityIds.add(statement.leftId);
    entityIds.add(statement.rightId);
  }
  if (scenario.query) {
    entityIds.add(scenario.query.leftId);
    entityIds.add(scenario.query.rightId);
  }
  for (const pair of scenario.candidatePairs ?? []) {
    entityIds.add(pair.leftId);
    entityIds.add(pair.rightId);
  }
  const ids = [...entityIds].sort();
  if (ids.length > 6) {
    throw new Error(
      "Canonical CP-002 profiling supports at most six entities.",
    );
  }
  const irrelevantIds = new Set(scenario.irrelevantStatementIds);
  let canonical = "";
  for (const ordering of permutations(ids)) {
    const mappedId = Object.fromEntries(
      ordering.map((entityId, index) => [entityId, index]),
    ) as Readonly<Record<string, number>>;
    const edges = scenario.statements
      .map((statement) =>
        normalizedEdge(
          statement,
          mappedId,
          irrelevantIds.has(statement.sourceStatementId),
        ),
      )
      .sort();
    const query = scenario.query
      ? `Q:${mappedId[scenario.query.leftId]}:${mappedId[scenario.query.rightId]}`
      : "Q:-";
    const pairs = (scenario.candidatePairs ?? [])
      .map((pair) => `P:${mappedId[pair.leftId]}:${mappedId[pair.rightId]}`)
      .sort();
    const signature = [scenario.taskKind, ...edges, query, ...pairs].join("|");
    if (!canonical || signature < canonical) canonical = signature;
  }
  return stableHash([canonical]);
}
