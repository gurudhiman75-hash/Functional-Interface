import { relationDisplay, type BlrCp006Graph } from "../BLR-CP-006/cp006-model";
import { optionLabel, type BlrCp007Scenario } from "./cp007-model";
import {
  relationForCodeToken,
  targetForQuery,
} from "./cp007-v2-option-builder";
import type {
  BlrCp007V2ExplanationMode,
  BlrCp007V2FamilyTree,
  BlrCp007V2Option,
  BlrCp007V2Question,
} from "./cp007-v2-model";

function generations(graph: BlrCp006Graph): Map<string, number> {
  const levels = new Map(graph.persons.map((person) => [person.personId, 0]));
  for (let pass = 0; pass < 24; pass += 1) {
    let changed = false;
    for (const edge of graph.parents) {
      const child = levels.get(edge.childId) ?? 0;
      const parent = levels.get(edge.parentId) ?? 0;
      if (parent <= child) {
        levels.set(edge.parentId, child + 1);
        changed = true;
      }
    }
    for (const edge of [...graph.spouses, ...graph.siblings]) {
      const level = Math.max(
        levels.get(edge.personAId) ?? 0,
        levels.get(edge.personBId) ?? 0,
      );
      if ((levels.get(edge.personAId) ?? 0) !== level) {
        levels.set(edge.personAId, level);
        changed = true;
      }
      if ((levels.get(edge.personBId) ?? 0) !== level) {
        levels.set(edge.personBId, level);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return levels;
}

export function blrCp007V2GraphPath(
  graph: BlrCp006Graph,
  start?: string,
  end?: string,
): string[] {
  if (!start || !end) return [];
  if (start === end) return [start];
  const adjacency = new Map<string, Set<string>>();
  const connect = (left: string, right: string) => {
    if (!adjacency.has(left)) adjacency.set(left, new Set());
    if (!adjacency.has(right)) adjacency.set(right, new Set());
    adjacency.get(left)!.add(right);
    adjacency.get(right)!.add(left);
  };
  graph.parents.forEach((edge) => connect(edge.parentId, edge.childId));
  graph.spouses.forEach((edge) => connect(edge.personAId, edge.personBId));
  graph.siblings.forEach((edge) => connect(edge.personAId, edge.personBId));
  const queue: string[][] = [[start]];
  const seen = new Set([start]);
  while (queue.length) {
    const path = queue.shift()!;
    const last = path[path.length - 1]!;
    for (const next of adjacency.get(last) ?? []) {
      if (seen.has(next)) continue;
      const candidate = [...path, next];
      if (next === end) return candidate;
      seen.add(next);
      queue.push(candidate);
    }
  }
  return [];
}

function edgeKey(type: string, left: string, right: string): string {
  return type === "parent-child"
    ? `${type}:${left}>${right}`
    : `${type}:${[left, right].sort().join("~")}`;
}

function directEvidence(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
): Map<string, string> {
  const evidence = new Map<string, string>();
  for (const statement of selected.statements) {
    const relation = relationForCodeToken(scenario, statement.token);
    if (relation === "FATHER" || relation === "MOTHER") {
      evidence.set(
        edgeKey("parent-child", statement.leftId, statement.rightId),
        relationDisplay(relation),
      );
    } else if (relation === "SON" || relation === "DAUGHTER") {
      evidence.set(
        edgeKey("parent-child", statement.rightId, statement.leftId),
        relationDisplay(relation),
      );
    } else if (relation === "BROTHER" || relation === "SISTER") {
      evidence.set(
        edgeKey("sibling", statement.leftId, statement.rightId),
        relationDisplay(relation),
      );
    } else {
      evidence.set(
        edgeKey("marriage", statement.leftId, statement.rightId),
        relationDisplay(relation),
      );
    }
  }
  return evidence;
}

function pathEdgeKeys(graph: BlrCp006Graph, path: readonly string[]): Set<string> {
  const result = new Set<string>();
  for (let index = 1; index < path.length; index += 1) {
    const left = path[index - 1]!;
    const right = path[index]!;
    const parent = graph.parents.find(
      (edge) =>
        (edge.parentId === left && edge.childId === right) ||
        (edge.parentId === right && edge.childId === left),
    );
    if (parent) {
      result.add(edgeKey("parent-child", parent.parentId, parent.childId));
      continue;
    }
    const spouse = graph.spouses.find(
      (edge) =>
        [edge.personAId, edge.personBId].includes(left) &&
        [edge.personAId, edge.personBId].includes(right),
    );
    if (spouse) {
      result.add(edgeKey("marriage", spouse.personAId, spouse.personBId));
      continue;
    }
    result.add(edgeKey("sibling", left, right));
  }
  return result;
}

export function buildBlrCp007V2FamilyTree(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
  graph: BlrCp006Graph,
): BlrCp007V2FamilyTree {
  const target =
    targetForQuery(scenario.query) ??
    (scenario.query.kind === "SELECT_VALIDITY" ? selected.claim : undefined);
  const path = blrCp007V2GraphPath(
    graph,
    target?.subjectId,
    target?.referenceId,
  );
  const highlightedEdges = pathEdgeKeys(graph, path);
  const codedEdges = directEvidence(scenario, selected);
  const levels = generations(graph);
  const nodes = graph.persons.map((person) => ({
    id: person.personId,
    label: person.label,
    gender:
      person.gender === "MALE"
        ? ("male" as const)
        : person.gender === "FEMALE"
          ? ("female" as const)
          : ("unknown" as const),
    generation: levels.get(person.personId) ?? 0,
    isQueryEndpoint:
      person.personId === target?.subjectId ||
      person.personId === target?.referenceId,
    isOnDecisivePath: path.includes(person.personId),
  }));
  const edges: BlrCp007V2FamilyTree["edges"] = [
    ...graph.spouses.map((edge, index) => {
      const key = edgeKey("marriage", edge.personAId, edge.personBId);
      return {
        id: `marriage-${index}`,
        type: "marriage" as const,
        sourceId: edge.personAId,
        targetId: edge.personBId,
        directed: false,
        relationLabel: codedEdges.get(key) ?? "Spouse (inferred)",
        evidence: codedEdges.has(key) ? ("CODED" as const) : ("INFERRED" as const),
        isOnDecisivePath: highlightedEdges.has(key),
      };
    }),
    ...graph.parents.map((edge, index) => {
      const key = edgeKey("parent-child", edge.parentId, edge.childId);
      return {
        id: `parent-${index}`,
        type: "parent-child" as const,
        sourceId: edge.parentId,
        targetId: edge.childId,
        directed: true,
        relationLabel: codedEdges.get(key) ?? "Parent (inferred)",
        evidence: codedEdges.has(key) ? ("CODED" as const) : ("INFERRED" as const),
        isOnDecisivePath: highlightedEdges.has(key),
      };
    }),
    ...graph.siblings.map((edge, index) => {
      const key = edgeKey("sibling", edge.personAId, edge.personBId);
      return {
        id: `sibling-${index}`,
        type: "sibling" as const,
        sourceId: edge.personAId,
        targetId: edge.personBId,
        directed: false,
        relationLabel: codedEdges.get(key) ?? "Sibling (inferred)",
        evidence: codedEdges.has(key) ? ("CODED" as const) : ("INFERRED" as const),
        isOnDecisivePath: highlightedEdges.has(key),
      };
    }),
  ];
  const actual = selected.actualRelation
    ? relationDisplay(selected.actualRelation).toLocaleLowerCase("en-IN")
    : "required relation";
  const description =
    scenario.query.kind === "SELECT_VALIDITY" &&
    selected.statementValidity === "INVALID" &&
    selected.claim
      ? `${selected.claim.subjectId} was claimed to be the ${relationDisplay(
          selected.claim.relationId,
        ).toLocaleLowerCase("en-IN")} of ${selected.claim.referenceId}, but the decoded graph gives ${actual}.`
      : target
        ? `${target.subjectId} is the ${actual} of ${target.referenceId}.`
        : "Completed coded family graph.";
  return {
    kind: "blood-relation-family-tree-v2",
    version: 2,
    title: "Completed coded family graph",
    description,
    nodes,
    edges,
    query: {
      subjectId: target?.subjectId,
      referenceId: target?.referenceId,
      answerLabel: selected.text,
      pathPersonIds: path,
    },
    legend: [
      "Arrow: parent to child",
      "Two-way line: sibling or spouse",
      "Solid: coded assertion",
      "Dashed: inferred relation",
      "Highlighted: decisive query path",
    ],
    accessibleSummary: description,
    asciiFallback:
      edges
        .map((edge) => {
          const connector = edge.directed ? "→" : "↔";
          return `${edge.sourceId} ${connector} ${edge.targetId} [${edge.relationLabel}; ${edge.evidence.toLocaleLowerCase("en-IN")}]`;
        })
        .join("\n") || "One direct coded assertion.",
  };
}

function optionExplanation(
  scenario: BlrCp007Scenario,
  option: BlrCp007V2Option,
): string {
  const target = targetForQuery(scenario.query);
  const decoded = option.decodedAssertions.join(" ");
  if (scenario.query.kind === "SELECT_VALIDITY" && option.claim) {
    const claimed = relationDisplay(option.claim.relationId).toLocaleLowerCase("en-IN");
    const actual = option.actualRelation
      ? relationDisplay(option.actualRelation).toLocaleLowerCase("en-IN")
      : "no supported relation";
    if (option.isCorrect && option.statementValidity === "INVALID") {
      return `Correct choice: the statement is invalid. ${decoded} It claims ${claimed}, but the decoded relation is ${actual}.`;
    }
    if (option.isCorrect) {
      return `Correct choice: the statement is valid. ${decoded} The decoded relation is ${actual}, exactly as stated.`;
    }
    if (option.statementValidity === "VALID") {
      return `Not the answer: this statement is valid. ${decoded} It should not be selected in an “incorrect statement” question.`;
    }
    return `Not correct: this statement is invalid. ${decoded} It claims ${claimed}, but the decoded relation is ${actual}.`;
  }

  if (option.isCorrect) {
    if (scenario.query.kind === "MISSING_TOKEN") {
      const token = (option.completionValue as { kind: "TOKEN"; token: string }).token;
      return `Correct: ${token} means “is the ${relationDisplay(
        relationForCodeToken(scenario, token),
      ).toLocaleLowerCase("en-IN")} of,” which completes the required link.`;
    }
    if (scenario.query.kind === "MISSING_TOKEN_PAIR") {
      const pair = (
        option.completionValue as {
          kind: "TOKEN_PAIR";
          tokens: readonly [string, string];
        }
      ).tokens;
      return `Correct: ${pair[0]} belongs in the first blank and ${pair[1]} in the second. In this order, the decoded links match the stem.`;
    }
    if (scenario.query.kind === "MISSING_PERSON") {
      return `Correct: substituting ${option.text} keeps the family graph valid and gives the required relation.`;
    }
    return `Correct: ${decoded} Therefore the requested relation is established.`;
  }

  if (scenario.query.kind === "MISSING_TOKEN") {
    const token = (option.completionValue as { kind: "TOKEN"; token: string }).token;
    return `Wrong token: ${token} means “is the ${relationDisplay(
      relationForCodeToken(scenario, token),
    ).toLocaleLowerCase("en-IN")} of,” not the relation required at the blank.`;
  }
  if (scenario.query.kind === "MISSING_TOKEN_PAIR") {
    if (option.failureCode === "TOKENS_SWAPPED") {
      return "Wrong order: the two required tokens have been placed in the opposite blanks.";
    }
    if (option.failureCode === "FIRST_TOKEN_WRONG") {
      return "The second token is correct, but the first token gives the wrong first link.";
    }
    if (option.failureCode === "SECOND_TOKEN_WRONG") {
      return "The first token is correct, but the second token gives the wrong second link.";
    }
    return "Both tokens change the direct links required by the stem.";
  }
  if (scenario.query.kind === "MISSING_PERSON") {
    const actual = option.actualRelation
      ? relationDisplay(option.actualRelation).toLocaleLowerCase("en-IN")
      : "no connected relation";
    return `Wrong person: substituting ${option.text} leaves a valid graph, but the query gives ${actual}, not the required relation.`;
  }

  const actual = option.actualRelation
    ? relationDisplay(option.actualRelation).toLocaleLowerCase("en-IN")
    : "no connected relation";
  if (option.failureCode === "REVERSED_DIRECTION") {
    return `Reversed direction: ${decoded} The relation runs opposite to the direction asked.`;
  }
  if (option.failureCode === "WRONG_GENDER") {
    return `Wrong gendered relation: ${decoded} The path gives ${actual}.`;
  }
  if (option.failureCode === "WRONG_GENERATION") {
    return `Wrong generation: ${decoded} The path gives ${actual}, at a different generation level.`;
  }
  if (option.failureCode === "DISCONNECTED_PATH") {
    return `Broken path: ${decoded} The queried people are not connected by the required route.`;
  }
  return `Wrong relation: ${decoded} The graph gives ${actual}, not the relation asked.`;
}

function explanationMode(
  scenario: BlrCp007Scenario,
  selected: BlrCp007V2Option,
): BlrCp007V2ExplanationMode {
  if (scenario.query.kind === "MISSING_TOKEN") return "MISSING_TOKEN";
  if (scenario.query.kind === "MISSING_TOKEN_PAIR") return "ORDERED_TOKEN_PAIR";
  if (scenario.query.kind === "MISSING_PERSON") return "MISSING_PERSON";
  if (scenario.query.kind === "SELECT_VALIDITY") {
    return scenario.query.desiredStatus === "INVALID"
      ? "INVALID_STATEMENT_CHECK"
      : "VALID_STATEMENT_CHECK";
  }
  if (selected.statements.length === 1) return "DIRECT_LOOKUP_MINIMAL";
  if (selected.statements.length === 2) return "TWO_LINK_PATH";
  return "THREE_LINK_OR_AFFINAL_PATH";
}

export function buildBlrCp007V2Explanation(
  scenario: BlrCp007Scenario,
  options: readonly BlrCp007V2Option[],
  selected: BlrCp007V2Option,
  graph: BlrCp006Graph,
): BlrCp007V2Question["explanation"] {
  const target = targetForQuery(scenario.query);
  const mode = explanationMode(scenario, selected);
  const steps: string[] = [];
  if (scenario.query.kind === "SELECT_VALIDITY" && selected.claim) {
    steps.push(...selected.decodedAssertions);
    steps.push(
      `The option claims ${relationDisplay(
        selected.claim.relationId,
      ).toLocaleLowerCase("en-IN")}; the decoded result is ${selected.actualRelation ? relationDisplay(selected.actualRelation).toLocaleLowerCase("en-IN") : "not supported"}.`,
    );
  } else if (scenario.query.kind === "MISSING_TOKEN") {
    const token = (selected.completionValue as { kind: "TOKEN"; token: string }).token;
    steps.push(
      `The blank needs the relation “${relationDisplay(
        relationForCodeToken(scenario, token),
      ).toLocaleLowerCase("en-IN")} of”.`,
      `${token} is the code for that relation.`,
    );
  } else if (scenario.query.kind === "MISSING_TOKEN_PAIR") {
    const pair = (
      selected.completionValue as {
        kind: "TOKEN_PAIR";
        tokens: readonly [string, string];
      }
    ).tokens;
    steps.push(
      `Use ${pair[0]} in the first blank and ${pair[1]} in the second.`,
      ...selected.decodedAssertions,
    );
  } else if (scenario.query.kind === "MISSING_PERSON") {
    steps.push(
      `Put ${selected.text} at the question mark.`,
      ...selected.decodedAssertions,
      `${target!.subjectId} is then the ${relationDisplay(
        target!.relationId,
      ).toLocaleLowerCase("en-IN")} of ${target!.referenceId}.`,
    );
  } else {
    steps.push(...selected.decodedAssertions);
    if (target) {
      steps.push(
        `${target.subjectId} is therefore the ${relationDisplay(
          target.relationId,
        ).toLocaleLowerCase("en-IN")} of ${target.referenceId}.`,
      );
    }
  }

  const conclusion =
    scenario.query.kind === "SELECT_VALIDITY"
      ? selected.statementValidity === "INVALID"
        ? `${selected.text} is the correct choice because its interpretation is invalid.`
        : `${selected.text} is the correct choice because its interpretation is valid.`
      : `${selected.text} is the only option that completes the required coded relation.`;
  const shortcut =
    mode === "ORDERED_TOKEN_PAIR"
      ? "Write the required relation above each blank before replacing it with a code."
      : mode === "INVALID_STATEMENT_CHECK"
        ? "Decode first; compare the decoded relation with the written claim only after that."
        : undefined;

  return {
    mode,
    steps,
    conclusion,
    shortcut,
    optionAnalysis: options.map((option, index) => ({
      optionLabel: optionLabel(index),
      optionText: option.text,
      isCorrect: option.isCorrect,
      statementValidity: option.statementValidity,
      failureCode: option.failureCode,
      explanation: optionExplanation(scenario, option),
    })),
    familyTree: buildBlrCp007V2FamilyTree(scenario, selected, graph),
  };
}
