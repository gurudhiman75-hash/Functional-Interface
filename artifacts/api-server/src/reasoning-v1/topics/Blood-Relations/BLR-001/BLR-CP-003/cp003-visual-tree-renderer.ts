import type {
  BlrGender,
  FamilyGraph,
  FamilyPerson,
  ParentEdge,
  SpouseEdge,
} from "../foundation/types";

const TREE_RULE = "===================================================================";

function genderMarker(gender: BlrGender): string {
  if (gender === "MALE") return "(+)";
  if (gender === "FEMALE") return "(-)";
  return "(?)";
}

function personById(graph: FamilyGraph, personId: string): FamilyPerson {
  const person = graph.persons.find((entry) => entry.personId === personId);
  if (!person) throw new Error(`Unknown family-tree person '${personId}'.`);
  return person;
}

function personNode(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  personId: string,
): string {
  const person = personById(graph, personId);
  return `[${names[personId] ?? person.name}] ${genderMarker(person.gender)}`;
}

function neighbourConstraints(
  graph: FamilyGraph,
  personId: string,
): readonly { personId: string; delta: number }[] {
  const neighbours: { personId: string; delta: number }[] = [];

  for (const edge of graph.parentEdges) {
    if (edge.parentId === personId) {
      neighbours.push({ personId: edge.childId, delta: -1 });
    } else if (edge.childId === personId) {
      neighbours.push({ personId: edge.parentId, delta: 1 });
    }
  }
  for (const edge of graph.spouseEdges) {
    if (edge.personAId === personId) {
      neighbours.push({ personId: edge.personBId, delta: 0 });
    } else if (edge.personBId === personId) {
      neighbours.push({ personId: edge.personAId, delta: 0 });
    }
  }
  for (const edge of graph.siblingEdges) {
    if (edge.personAId === personId) {
      neighbours.push({ personId: edge.personBId, delta: 0 });
    } else if (edge.personBId === personId) {
      neighbours.push({ personId: edge.personAId, delta: 0 });
    }
  }

  return neighbours;
}

export function blrCp003VisualGenerationMap(
  graph: FamilyGraph,
): ReadonlyMap<string, number> {
  const raw = new Map<string, number>();

  for (const person of graph.persons) {
    if (raw.has(person.personId)) continue;
    raw.set(person.personId, 0);
    const queue = [person.personId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentLevel = raw.get(currentId)!;
      for (const neighbour of neighbourConstraints(graph, currentId)) {
        const expected = currentLevel + neighbour.delta;
        const existing = raw.get(neighbour.personId);
        if (existing === undefined) {
          raw.set(neighbour.personId, expected);
          queue.push(neighbour.personId);
        } else if (existing !== expected) {
          throw new Error(
            `Inconsistent generation placement for '${neighbour.personId}': ${existing} versus ${expected}.`,
          );
        }
      }
    }
  }

  const highest = Math.max(...raw.values());
  return new Map(
    [...raw.entries()].map(([personId, level]) => [personId, level - highest + 1]),
  );
}

function sameSpouseEdge(edge: SpouseEdge, personAId: string, personBId: string): boolean {
  return (
    (edge.personAId === personAId && edge.personBId === personBId) ||
    (edge.personAId === personBId && edge.personBId === personAId)
  );
}

function areSpouses(graph: FamilyGraph, personAId: string, personBId: string): boolean {
  return graph.spouseEdges.some((edge) => sameSpouseEdge(edge, personAId, personBId));
}

function orderedCouple(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  edge: SpouseEdge,
): readonly [string, string] {
  const first = personById(graph, edge.personAId);
  const second = personById(graph, edge.personBId);
  if (first.gender === "MALE" && second.gender === "FEMALE") {
    return [first.personId, second.personId];
  }
  if (second.gender === "MALE" && first.gender === "FEMALE") {
    return [second.personId, first.personId];
  }
  return [first.personId, second.personId].sort((left, right) =>
    (names[left] ?? left).localeCompare(names[right] ?? right, "en-IN"),
  ) as [string, string];
}

function generationLabel(level: number): string {
  if (level === 1) return "Generation +1 (oldest displayed)";
  if (level === 0) return "Generation 0";
  return `Generation ${level}`;
}

function generationSection(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  generationByPerson: ReadonlyMap<string, number>,
): string[] {
  const levels = [...new Set(generationByPerson.values())].sort((left, right) => right - left);
  const lines: string[] = [];

  for (const level of levels) {
    lines.push(`${generationLabel(level)}:`);
    const members = graph.persons
      .filter((person) => generationByPerson.get(person.personId) === level)
      .map((person) => person.personId);
    const rendered = new Set<string>();

    for (const edge of graph.spouseEdges) {
      if (!members.includes(edge.personAId) || !members.includes(edge.personBId)) continue;
      const [left, right] = orderedCouple(graph, names, edge);
      lines.push(`  ${personNode(graph, names, left)} ======== ${personNode(graph, names, right)}`);
      rendered.add(left);
      rendered.add(right);
    }

    for (const personId of members
      .filter((entry) => !rendered.has(entry))
      .sort((left, right) =>
        (names[left] ?? left).localeCompare(names[right] ?? right, "en-IN"),
      )) {
      lines.push(`  ${personNode(graph, names, personId)}`);
    }
    lines.push("");
  }

  return lines;
}

interface ParentGroup {
  parentIds: readonly string[];
  childIds: string[];
}

function parentGroups(graph: FamilyGraph): ParentGroup[] {
  const parentsByChild = new Map<string, string[]>();
  for (const edge of graph.parentEdges) {
    const parents = parentsByChild.get(edge.childId) ?? [];
    parents.push(edge.parentId);
    parentsByChild.set(edge.childId, parents);
  }

  const groups = new Map<string, ParentGroup>();
  for (const [childId, parentIds] of parentsByChild) {
    const uniqueParents = [...new Set(parentIds)].sort();
    const key = uniqueParents.join("::");
    const group = groups.get(key) ?? { parentIds: uniqueParents, childIds: [] };
    group.childIds.push(childId);
    groups.set(key, group);
  }
  return [...groups.values()];
}

function parentHeading(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  parentIds: readonly string[],
): string {
  if (parentIds.length === 2 && areSpouses(graph, parentIds[0]!, parentIds[1]!)) {
    const edge = graph.spouseEdges.find((entry) =>
      sameSpouseEdge(entry, parentIds[0]!, parentIds[1]!),
    )!;
    const [left, right] = orderedCouple(graph, names, edge);
    return `${personNode(graph, names, left)} ======== ${personNode(graph, names, right)}`;
  }
  if (parentIds.length === 2) {
    return `${personNode(graph, names, parentIds[0]!)}    ${personNode(graph, names, parentIds[1]!)}`;
  }
  return personNode(graph, names, parentIds[0]!);
}

function lineageSection(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
  generationByPerson: ReadonlyMap<string, number>,
): string[] {
  const groups = parentGroups(graph).sort((left, right) => {
    const leftLevel = Math.max(...left.parentIds.map((id) => generationByPerson.get(id) ?? 0));
    const rightLevel = Math.max(...right.parentIds.map((id) => generationByPerson.get(id) ?? 0));
    if (leftLevel !== rightLevel) return rightLevel - leftLevel;
    return parentHeading(graph, names, left.parentIds).localeCompare(
      parentHeading(graph, names, right.parentIds),
      "en-IN",
    );
  });
  const lines = ["Parent–child lineage:"];

  for (const group of groups) {
    lines.push(`  ${parentHeading(graph, names, group.parentIds)}`);
    lines.push("                         │");
    const children = group.childIds.sort((left, right) =>
      (names[left] ?? left).localeCompare(names[right] ?? right, "en-IN"),
    );
    children.forEach((childId, index) => {
      const branch = index === children.length - 1 ? "└──" : "├──";
      lines.push(`                         ${branch} ${personNode(graph, names, childId)}`);
    });
    lines.push("");
  }

  return lines;
}

function siblingSection(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
): string[] {
  const groups = parentGroups(graph).filter((group) => group.childIds.length > 1);
  if (groups.length === 0 && graph.siblingEdges.length === 0) return [];
  const lines = ["Sibling lines:"];
  const seen = new Set<string>();

  for (const group of groups) {
    const childIds = [...group.childIds].sort((left, right) =>
      (names[left] ?? left).localeCompare(names[right] ?? right, "en-IN"),
    );
    const key = childIds.join("::");
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(`  ${childIds.map((id) => personNode(graph, names, id)).join(" ── ")}`);
  }
  for (const edge of graph.siblingEdges) {
    const childIds = [edge.personAId, edge.personBId].sort();
    const key = childIds.join("::");
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(`  ${childIds.map((id) => personNode(graph, names, id)).join(" ── ")}`);
  }
  lines.push("");
  return lines;
}

export function renderBlrCp003VisualFamilyTree(
  graph: FamilyGraph,
  names: Readonly<Record<string, string>>,
): string {
  const generationByPerson = blrCp003VisualGenerationMap(graph);
  const lines = [
    TREE_RULE,
    "                       VISUAL FAMILY TREE GRID",
    TREE_RULE,
    ...generationSection(graph, names, generationByPerson),
    ...lineageSection(graph, names, generationByPerson),
    ...siblingSection(graph, names),
    TREE_RULE,
    "Key: (+) = Male  |  (-) = Female  |  ======== = Married couple",
    "     │ = Parent–child lineage  |  ── = Siblings",
    TREE_RULE,
  ];
  return lines.join("\n");
}
