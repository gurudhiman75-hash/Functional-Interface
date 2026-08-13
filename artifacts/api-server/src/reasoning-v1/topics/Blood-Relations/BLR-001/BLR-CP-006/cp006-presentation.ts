import {
  optionLabel,
  relationDisplay,
  rotate,
  semanticFingerprint,
  type BlrCp006Authority,
  type BlrCp006FamilyTree,
  type BlrCp006Graph,
  type BlrCp006Option,
  type BlrCp006Query,
  type BlrCp006Relation,
  type BlrCp006Scenario,
} from "./cp006-model";
import { pairKey, relationOf } from "./cp006-graph";

const RELATION_DISTRACTORS: Partial<Record<BlrCp006Relation, readonly BlrCp006Relation[]>> = {
  FATHER: ["MOTHER", "GRANDFATHER", "BROTHER"],
  MOTHER: ["FATHER", "GRANDMOTHER", "SISTER"],
  PARENT: ["CHILD", "GRANDPARENT", "SIBLING"],
  SON: ["DAUGHTER", "GRANDSON", "BROTHER"],
  DAUGHTER: ["SON", "GRANDDAUGHTER", "SISTER"],
  CHILD: ["PARENT", "GRANDCHILD", "SIBLING"],
  BROTHER: ["SISTER", "FATHER", "UNCLE"],
  SISTER: ["BROTHER", "MOTHER", "AUNT"],
  SIBLING: ["COUSIN", "PARENT", "SPOUSE"],
  HUSBAND: ["BROTHER", "SON", "FATHER"],
  WIFE: ["SISTER", "DAUGHTER", "MOTHER"],
  SPOUSE: ["SIBLING", "PARENT", "CHILD"],
  GRANDFATHER: ["FATHER", "GRANDMOTHER", "UNCLE"],
  GRANDMOTHER: ["MOTHER", "GRANDFATHER", "AUNT"],
  GRANDPARENT: ["PARENT", "GRANDCHILD", "UNCLE_OR_AUNT"],
  GRANDSON: ["SON", "GRANDDAUGHTER", "NEPHEW"],
  GRANDDAUGHTER: ["DAUGHTER", "GRANDSON", "NIECE"],
  GRANDCHILD: ["CHILD", "GRANDPARENT", "NEPHEW_OR_NIECE"],
  UNCLE: ["FATHER", "BROTHER", "BROTHER_IN_LAW"],
  AUNT: ["MOTHER", "SISTER", "SISTER_IN_LAW"],
  UNCLE_OR_AUNT: ["PARENT", "SIBLING", "PARENT_IN_LAW"],
  NEPHEW: ["SON", "BROTHER", "SON_IN_LAW"],
  NIECE: ["DAUGHTER", "SISTER", "DAUGHTER_IN_LAW"],
  NEPHEW_OR_NIECE: ["CHILD", "SIBLING", "CHILD_IN_LAW"],
  COUSIN: ["SIBLING", "NEPHEW_OR_NIECE", "CHILD"],
  FATHER_IN_LAW: ["FATHER", "GRANDFATHER", "BROTHER_IN_LAW"],
  MOTHER_IN_LAW: ["MOTHER", "GRANDMOTHER", "SISTER_IN_LAW"],
  PARENT_IN_LAW: ["PARENT", "GRANDPARENT", "SIBLING_IN_LAW"],
  SON_IN_LAW: ["SON", "BROTHER_IN_LAW", "NEPHEW"],
  DAUGHTER_IN_LAW: ["DAUGHTER", "SISTER_IN_LAW", "NIECE"],
  CHILD_IN_LAW: ["CHILD", "SIBLING_IN_LAW", "NEPHEW_OR_NIECE"],
  BROTHER_IN_LAW: ["BROTHER", "UNCLE", "FATHER_IN_LAW"],
  SISTER_IN_LAW: ["SISTER", "AUNT", "MOTHER_IN_LAW"],
  SIBLING_IN_LAW: ["SIBLING", "PARENT_IN_LAW", "CHILD_IN_LAW"],
};

function stableOptions(options: readonly BlrCp006Option[], seed: number, prototypeId: string): {
  options: BlrCp006Option[];
  correctIndex: number;
} {
  const offset = Number.parseInt(semanticFingerprint([seed, prototypeId]).slice(0, 8), 16) % options.length;
  const rotated = rotate(options, offset);
  return {
    options: rotated,
    correctIndex: rotated.findIndex((option) => option.isCorrect),
  };
}

export function buildOptions(
  scenarioValue: BlrCp006Scenario,
  graph: BlrCp006Graph,
  answer: string,
  seed: number,
): { options: BlrCp006Option[]; correctIndex: number } {
  const query = scenarioValue.query;
  if (query.kind === "RELATION") {
    const correctRelation = relationOf(graph, query.subjectId, query.referenceId);
    const distractors = RELATION_DISTRACTORS[correctRelation] ?? ["PARENT", "SIBLING", "COUSIN"];
    return stableOptions([
      { text: relationDisplay(correctRelation), semanticKey: `REL:${correctRelation}`, isCorrect: true },
      ...distractors.slice(0, 3).map((relationId, index) => ({
        text: relationDisplay(relationId),
        semanticKey: `REL:${relationId}`,
        isCorrect: false,
        errorLabel: [
          "QUERY_DIRECTION_REVERSAL",
          "GENERATION_LEVEL_ERROR",
          "BLOOD_AFFINAL_CONFUSION",
        ][index],
      })),
    ], seed, scenarioValue.prototypeId);
  }
  if (query.kind === "IDENTIFY_PERSON") {
    return stableOptions([...new Set(query.candidateIds)].map((personId) => ({
      text: personId,
      semanticKey: `PERSON:${personId}`,
      isCorrect: personId === answer,
      errorLabel: personId === answer ? undefined : "INCOMPLETE_DECODED_PATH",
    })), seed, scenarioValue.prototypeId);
  }
  if (query.kind === "GENDER") {
    const values = ["Male", "Female", "Cannot be determined", "The statements are contradictory"];
    return stableOptions(values.map((value) => ({
      text: value,
      semanticKey: `GENDER:${value}`,
      isCorrect: value === answer,
      errorLabel: value === answer ? undefined : value === "Cannot be determined"
        ? "IGNORED_EXPLICIT_GENDER_CODE"
        : value === "The statements are contradictory"
          ? "FALSE_CONTRADICTION"
          : "CODE_DIRECTION_GENDER_SWAP",
    })), seed, scenarioValue.prototypeId);
  }
  return stableOptions(query.candidatePairs.map(([leftId, rightId]) => {
    const text = `${leftId} and ${rightId}`;
    return {
      text,
      semanticKey: `PAIR:${pairKey(leftId, rightId)}`,
      isCorrect: text === answer,
      errorLabel: text === answer ? undefined : "PAIR_RELATION_MISMATCH",
    };
  }), seed, scenarioValue.prototypeId);
}

export function promptFor(input: BlrCp006Scenario): string {
  const keyRows = input.codeKey
    .map((entry) => `• “X ${entry.token} Y” means “X is the ${relationDisplay(entry.relationId).toLocaleLowerCase("en-IN")} of Y”.`)
    .join("\n");
  const statements = input.expressionLines.map((line) => `• ${line}`).join("\n");
  return [
    "Study the following relation code and coded statements.",
    "",
    keyRows,
    "",
    "Coded statements:",
    statements,
    "",
    "Each adjacent coded pair is a separate family assertion. The symbols are relation codes, not arithmetic operators.",
  ].join("\n");
}

function graphPath(graph: BlrCp006Graph, start: string, end: string): string[] {
  const adjacency = new Map<string, Set<string>>();
  const connect = (a: string, b: string) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a)!.add(b);
    adjacency.get(b)!.add(a);
  };
  graph.parents.forEach((edge) => connect(edge.parentId, edge.childId));
  graph.spouses.forEach((edge) => connect(edge.personAId, edge.personBId));
  graph.siblings.forEach((edge) => connect(edge.personAId, edge.personBId));
  const queue: string[][] = [[start]];
  const seen = new Set([start]);
  while (queue.length) {
    const path = queue.shift()!;
    const last = path.at(-1)!;
    if (last === end) return path;
    for (const next of adjacency.get(last) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push([...path, next]);
    }
  }
  return [start, end];
}

function generationMap(graph: BlrCp006Graph): Map<string, number> {
  const generations = new Map<string, number>();
  const first = graph.persons[0]?.personId;
  if (!first) return generations;
  generations.set(first, 0);
  let changed = true;
  for (let iteration = 0; iteration < 20 && changed; iteration += 1) {
    changed = false;
    for (const edge of graph.parents) {
      const parent = generations.get(edge.parentId);
      const child = generations.get(edge.childId);
      if (parent !== undefined && child === undefined) {
        generations.set(edge.childId, parent - 1);
        changed = true;
      } else if (child !== undefined && parent === undefined) {
        generations.set(edge.parentId, child + 1);
        changed = true;
      }
    }
    for (const edge of [...graph.spouses, ...graph.siblings]) {
      const a = generations.get(edge.personAId);
      const b = generations.get(edge.personBId);
      if (a !== undefined && b === undefined) {
        generations.set(edge.personBId, a);
        changed = true;
      } else if (b !== undefined && a === undefined) {
        generations.set(edge.personAId, b);
        changed = true;
      }
    }
    for (const person of graph.persons) {
      if (generations.has(person.personId)) continue;
      const connected = graph.parents.some((edge) =>
        edge.parentId === person.personId || edge.childId === person.personId
      ) || graph.spouses.some((edge) =>
        edge.personAId === person.personId || edge.personBId === person.personId
      ) || graph.siblings.some((edge) =>
        edge.personAId === person.personId || edge.personBId === person.personId
      );
      if (!connected) generations.set(person.personId, 0);
    }
  }
  const max = Math.max(...generations.values());
  for (const [id, value] of generations) generations.set(id, value - max);
  return generations;
}

export function familyTree(
  graph: BlrCp006Graph,
  query: BlrCp006Query,
  answer: string,
): BlrCp006FamilyTree {
  const generations = generationMap(graph);
  const subjectId = query.kind === "RELATION" ? query.subjectId : undefined;
  const referenceId = query.kind === "RELATION" ? query.referenceId : undefined;
  const pathPersonIds = subjectId && referenceId ? graphPath(graph, subjectId, referenceId) : [];
  const nodes = graph.persons.map((person) => ({
    id: person.personId,
    label: person.label,
    gender: person.gender === "MALE" ? "male" as const
      : person.gender === "FEMALE" ? "female" as const
      : "unknown" as const,
    generation: generations.get(person.personId) ?? 0,
  }));
  const edges: BlrCp006FamilyTree["edges"][number][] = [
    ...graph.parents.map((edge, index) => ({
      id: `parent-${index}`,
      type: "parent-child" as const,
      sourceId: edge.parentId,
      targetId: edge.childId,
    })),
    ...graph.spouses.map((edge, index) => ({
      id: `marriage-${index}`,
      type: "marriage" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
    })),
    ...graph.siblings.map((edge, index) => ({
      id: `sibling-${index}`,
      type: "sibling" as const,
      sourceId: edge.personAId,
      targetId: edge.personBId,
    })),
  ];
  const rows = [...new Set(nodes.map((node) => node.generation))]
    .sort((a, b) => b - a)
    .map((generation) => {
      const people = nodes
        .filter((node) => node.generation === generation)
        .map((node) => `[${node.label}] (${node.gender === "male" ? "+" : node.gender === "female" ? "-" : "?"})`)
        .join("   ");
      return `Generation ${generation}: ${people}`;
    });
  const asciiFallback = [
    "============================================================",
    "CODED RELATION FAMILY MAP",
    "============================================================",
    ...rows,
    "",
    "Decoded edges:",
    ...graph.parents.map((edge) => `${edge.parentId} -> child ${edge.childId}`),
    ...graph.spouses.map((edge) => `${edge.personAId} == spouse == ${edge.personBId}`),
    ...graph.siblings.map((edge) => `${edge.personAId} -- sibling -- ${edge.personBId}`),
    "",
    "Key: (+) Male | (-) Female | (?) Gender not established",
  ].join("\n");
  return {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Decoded family relation map",
    nodes,
    edges,
    query: { subjectId, referenceId, answerLabel: answer, pathPersonIds },
    accessibleSummary: `Decoded family graph with ${nodes.length} people and ${edges.length} relation edges.`,
    asciiFallback,
  };
}

export function coreConcept(authority: BlrCp006Authority): readonly string[] {
  if (authority === "RESOLVE_CODED_RELATION" || authority === "RESOLVE_CODED_FAMILY_SET_RELATION") {
    return [
      "Replace every token with its supplied directed kinship meaning before tracing the family path.",
      "Treat adjacent coded pairs as separate relation assertions; ordinary arithmetic precedence never applies.",
    ];
  }
  if (authority === "IDENTIFY_PERSON_FROM_CODED_GRAPH") {
    return [
      "Decode the complete graph first, then test each named candidate against the requested relation.",
      "A person is correct only when the full decoded route and query direction both match.",
    ];
  }
  if (authority === "DETERMINE_GENDER_FROM_CODED_GRAPH") {
    return [
      "Gender comes only from decoded gender-bearing relations such as brother, sister, father, mother, husband or wife.",
      "A letter label or name never supplies gender evidence.",
    ];
  }
  return [
    "Decode all statements once and classify each offered pair on the resulting family graph.",
    "Pair order is ignored only when the requested relation itself is symmetric, such as sibling or spouse.",
  ];
}

export function shortcut(authority: BlrCp006Authority): string {
  if (authority === "DETERMINE_GENDER_FROM_CODED_GRAPH") {
    return "Circle the target, then look only for a decoded gender-bearing word attached to that person; never use the person's label.";
  }
  if (authority === "SELECT_CODED_RELATION_PAIR") {
    return "Decode the three short statements, mark P for parent-child, S for sibling and M for marriage, then match the requested pair type.";
  }
  if (authority === "IDENTIFY_PERSON_FROM_CODED_GRAPH") {
    return "Write the decoded role beside each candidate and eliminate every person whose generation, direction or gender disagrees.";
  }
  return "Rewrite the code as arrows first, then trace only from the asked subject to the asked reference.";
}

export function optionExplanation(
  option: BlrCp006Option,
  index: number,
  answer: string,
): string {
  const label = optionLabel(index);
  if (option.isCorrect) {
    return `Option ${label} is correct. After decoding all relation codes and tracing the required family path, the answer is ${answer}.`;
  }

  if (option.semanticKey.startsWith("REL:")) {
    return `Option ${label} is incorrect. Decoding gives the relation ${answer}, not ${option.text}.`;
  }

  const code = option.errorLabel ?? "DECODED_RELATION_MISMATCH";
  const messages: Record<string, string> = {
    INCOMPLETE_DECODED_PATH: "This person matches only part of the decoded relation chain, not the complete relation asked in the question.",
    IGNORED_EXPLICIT_GENDER_CODE: "A decoded gender-bearing relation fixes the person's gender, so it cannot be left undetermined.",
    FALSE_CONTRADICTION: "The supplied code key and statements form a consistent family relationship; they do not contradict one another.",
    CODE_DIRECTION_GENDER_SWAP: "The decoded relation establishes a different gender from this option.",
    PAIR_RELATION_MISMATCH: "This pair has a different relationship from the one asked in the question.",
    QUERY_DIRECTION_REVERSAL: "This does not match the relation obtained in the direction asked by the question.",
    GENERATION_LEVEL_ERROR: "This does not match the generation obtained after decoding the complete relation chain.",
    BLOOD_AFFINAL_CONFUSION: "This does not match the complete decoded relationship.",
    DECODED_RELATION_MISMATCH: "This does not match the complete decoded relationship.",
  };
  return `Option ${label} is incorrect. ${messages[code] ?? messages.DECODED_RELATION_MISMATCH}`;
}

export function graphAuditLines(
  scenarioValue: BlrCp006Scenario,
  graph: BlrCp006Graph,
  answer: string,
): string[] {
  const query = scenarioValue.query;
  if (query.kind === "RELATION") {
    const path = graphPath(graph, query.subjectId, query.referenceId);
    return [
      `Trace the query in the stated direction: ${path.join(" → ")}.`,
      `The decoded path gives ${query.subjectId} as ${answer.toLocaleLowerCase("en-IN")} of ${query.referenceId}.`,
    ];
  }
  if (query.kind === "IDENTIFY_PERSON") {
    return [
      `Test candidates ${query.candidateIds.join(", ")} against ${relationDisplay(query.relationId).toLocaleLowerCase("en-IN")} of ${query.referenceId}.`,
      `${answer} alone satisfies the complete decoded relation.`,
    ];
  }
  if (query.kind === "GENDER") {
    return [
      `The decoded relation attached to ${query.personId} fixes the target's gender.`,
      `The required gender is ${answer}; the letter label itself contributes no gender evidence.`,
    ];
  }
  return [
    "Classify the offered pairs as sibling, spouse, parent-child or non-matching after decoding.",
    `${answer} is the only pair with the requested relation.`,
  ];
}

export function difficultyFor(scenarioValue: BlrCp006Scenario): "EASY" | "MEDIUM" | "HARD" {
  if (scenarioValue.statements.length <= 1) return "EASY";
  if (scenarioValue.statements.length <= 3 && scenarioValue.query.kind !== "IDENTIFY_PERSON") return "MEDIUM";
  return "HARD";
}
