import type {
  BlrCp003SvgFamilyTreeDiagram,
  BlrCp003SvgFamilyTreeNode,
} from "./cp003-svg-family-tree";

const CARD_WIDTH = 150;
const CARD_HEIGHT = 66;
const SPOUSE_GAP = 40;
const UNIT_GAP = 56;
const ROW_GAP = 146;
const SIDE_PADDING = 70;
const TOP_PADDING = 92;
const BOTTOM_PADDING = 70;

type Position = { x: number; y: number };
type Unit = {
  ids: string[];
  width: number;
  sortKey: string;
  parentAnchor: number | null;
};

function escapeXml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function nodesById(
  diagram: BlrCp003SvgFamilyTreeDiagram,
): Map<string, BlrCp003SvgFamilyTreeNode> {
  return new Map(diagram.nodes.map((node) => [node.id, node]));
}

function parentsByChild(diagram: BlrCp003SvgFamilyTreeDiagram): Map<string, string[]> {
  const parents = new Map<string, string[]>();
  for (const edge of diagram.edges) {
    if (edge.type !== "parent-child") continue;
    const list = parents.get(edge.targetId) ?? [];
    list.push(edge.sourceId);
    parents.set(edge.targetId, list);
  }
  return parents;
}

function partnersByPerson(diagram: BlrCp003SvgFamilyTreeDiagram): Map<string, string> {
  const partners = new Map<string, string>();
  for (const edge of diagram.edges) {
    if (edge.type !== "marriage") continue;
    partners.set(edge.sourceId, edge.targetId);
    partners.set(edge.targetId, edge.sourceId);
  }
  return partners;
}

function conventionalOrder(
  firstId: string,
  secondId: string,
  nodes: Map<string, BlrCp003SvgFamilyTreeNode>,
): [string, string] {
  const first = nodes.get(firstId)!;
  const second = nodes.get(secondId)!;
  if (first.gender === "male" && second.gender === "female") return [firstId, secondId];
  if (second.gender === "male" && first.gender === "female") return [secondId, firstId];
  return first.label.localeCompare(second.label, "en-IN") <= 0
    ? [firstId, secondId]
    : [secondId, firstId];
}

function buildUnits(
  members: BlrCp003SvgFamilyTreeNode[],
  partners: Map<string, string>,
  parents: Map<string, string[]>,
  positions: Map<string, Position>,
  nodes: Map<string, BlrCp003SvgFamilyTreeNode>,
): Unit[] {
  const memberIds = new Set(members.map((member) => member.id));
  const used = new Set<string>();
  const units: Unit[] = [];

  for (const member of [...members].sort((left, right) =>
    left.label.localeCompare(right.label, "en-IN"),
  )) {
    if (used.has(member.id)) continue;
    const partnerId = partners.get(member.id);
    const ids =
      partnerId && memberIds.has(partnerId) && !used.has(partnerId)
        ? [...conventionalOrder(member.id, partnerId, nodes)]
        : [member.id];
    ids.forEach((id) => used.add(id));
    const parentPositions = ids
      .flatMap((id) => parents.get(id) ?? [])
      .map((id) => positions.get(id))
      .filter((position): position is Position => Boolean(position));
    units.push({
      ids,
      width: ids.length === 2 ? CARD_WIDTH * 2 + SPOUSE_GAP : CARD_WIDTH,
      sortKey: ids
        .map((id) => nodes.get(id)?.label ?? id)
        .sort((left, right) => left.localeCompare(right, "en-IN"))
        .join(" "),
      parentAnchor: parentPositions.length
        ? parentPositions.reduce((sum, position) => sum + position.x, 0) /
          parentPositions.length
        : null,
    });
  }

  return units.sort((left, right) => {
    if (left.parentAnchor !== null && right.parentAnchor !== null) {
      const difference = left.parentAnchor - right.parentAnchor;
      if (Math.abs(difference) > 1) return difference;
    } else if (left.parentAnchor !== null) {
      return -1;
    } else if (right.parentAnchor !== null) {
      return 1;
    }
    return left.sortKey.localeCompare(right.sortKey, "en-IN");
  });
}

function rowWidth(units: Unit[]): number {
  return (
    units.reduce((sum, unit) => sum + unit.width, 0) +
    Math.max(units.length - 1, 0) * UNIT_GAP
  );
}

function orientCouple(
  unit: Unit,
  centre: number,
  parents: Map<string, string[]>,
  nodes: Map<string, BlrCp003SvgFamilyTreeNode>,
): string[] {
  if (unit.ids.length !== 2 || unit.parentAnchor === null) return unit.ids;
  const familyMembers = unit.ids.filter((id) => (parents.get(id)?.length ?? 0) > 0);
  if (familyMembers.length !== 1) return unit.ids;
  const familyMember = familyMembers[0]!;
  const spouse = unit.ids.find((id) => id !== familyMember)!;
  if (unit.parentAnchor > centre + 1) return [spouse, familyMember];
  if (unit.parentAnchor < centre - 1) return [familyMember, spouse];
  return conventionalOrder(familyMember, spouse, nodes);
}

function placeUnits(
  units: Unit[],
  width: number,
  y: number,
  positions: Map<string, Position>,
  parents: Map<string, string[]>,
  nodes: Map<string, BlrCp003SvgFamilyTreeNode>,
): void {
  if (!units.length) return;
  if (units.every((unit) => unit.parentAnchor === null)) {
    let cursor = (width - rowWidth(units)) / 2;
    for (const unit of units) {
      const centre = cursor + unit.width / 2;
      const ids = orientCouple(unit, centre, parents, nodes);
      if (ids.length === 2) {
        const offset = (CARD_WIDTH + SPOUSE_GAP) / 2;
        positions.set(ids[0]!, { x: centre - offset, y });
        positions.set(ids[1]!, { x: centre + offset, y });
      } else {
        positions.set(ids[0]!, { x: centre, y });
      }
      cursor += unit.width + UNIT_GAP;
    }
    return;
  }

  const placed = units.map((unit) => ({ unit, centre: 0 }));
  let cursor = SIDE_PADDING;
  for (const entry of placed) {
    const minimumCentre = cursor + entry.unit.width / 2;
    entry.centre = Math.max(minimumCentre, entry.unit.parentAnchor ?? minimumCentre);
    cursor = entry.centre + entry.unit.width / 2 + UNIT_GAP;
  }
  const firstLeft = placed[0]!.centre - placed[0]!.unit.width / 2;
  const last = placed.at(-1)!;
  const lastRight = last.centre + last.unit.width / 2;
  let shift = 0;
  if (lastRight > width - SIDE_PADDING) shift -= lastRight - (width - SIDE_PADDING);
  if (firstLeft + shift < SIDE_PADDING) shift += SIDE_PADDING - (firstLeft + shift);

  for (const entry of placed) {
    const centre = entry.centre + shift;
    const ids = orientCouple(entry.unit, centre, parents, nodes);
    if (ids.length === 2) {
      const offset = (CARD_WIDTH + SPOUSE_GAP) / 2;
      positions.set(ids[0]!, { x: centre - offset, y });
      positions.set(ids[1]!, { x: centre + offset, y });
    } else {
      positions.set(ids[0]!, { x: centre, y });
    }
  }
}

function layout(diagram: BlrCp003SvgFamilyTreeDiagram) {
  const nodes = nodesById(diagram);
  const parents = parentsByChild(diagram);
  const partners = partnersByPerson(diagram);
  const levels = [...new Set(diagram.nodes.map((node) => node.generation))].sort(
    (left, right) => right - left,
  );
  const initialRows = levels.map((level) =>
    buildUnits(
      diagram.nodes.filter((node) => node.generation === level),
      partners,
      parents,
      new Map(),
      nodes,
    ),
  );
  const width = Math.max(760, ...initialRows.map(rowWidth)) + SIDE_PADDING * 2;
  const height =
    TOP_PADDING + Math.max(levels.length - 1, 0) * ROW_GAP + CARD_HEIGHT + BOTTOM_PADDING;
  const positions = new Map<string, Position>();

  levels.forEach((level, index) => {
    const units = buildUnits(
      diagram.nodes.filter((node) => node.generation === level),
      partners,
      parents,
      positions,
      nodes,
    );
    placeUnits(
      units,
      width,
      TOP_PADDING + index * ROW_GAP + CARD_HEIGHT / 2,
      positions,
      parents,
      nodes,
    );
  });
  return { width, height, levels, positions, nodes, parents };
}

function parentGroups(diagram: BlrCp003SvgFamilyTreeDiagram) {
  const parents = parentsByChild(diagram);
  const groups = new Map<string, { parentIds: string[]; childIds: string[] }>();
  for (const [childId, parentIds] of parents) {
    const uniqueParents = [...new Set(parentIds)].sort();
    const key = uniqueParents.join("::");
    const group = groups.get(key) ?? { parentIds: uniqueParents, childIds: [] };
    group.childIds.push(childId);
    groups.set(key, group);
  }
  return [...groups.values()];
}

function badge(node: BlrCp003SvgFamilyTreeNode) {
  if (node.gender === "male") {
    return { letter: "M", name: "MALE", fill: "#dbeafe", ink: "#1d4ed8", stroke: "#60a5fa", card: "#eff6ff" };
  }
  if (node.gender === "female") {
    return { letter: "F", name: "FEMALE", fill: "#ffe4e6", ink: "#be123c", stroke: "#fb7185", card: "#fff1f2" };
  }
  return { letter: "?", name: "NOT STATED", fill: "#e2e8f0", ink: "#475569", stroke: "#94a3b8", card: "#f8fafc" };
}

function pathPairs(diagram: BlrCp003SvgFamilyTreeDiagram): Set<string> {
  const ids = diagram.query?.pathPersonIds ?? [];
  return new Set(ids.slice(0, -1).map((id, index) => pairKey(id, ids[index + 1]!)));
}

export function renderBlrCp003SvgFamilyTreeMarkup(
  diagram: BlrCp003SvgFamilyTreeDiagram,
): string {
  const tree = layout(diagram);
  const highlightedPairs = pathPairs(diagram);
  const marriagePairs = new Set(
    diagram.edges
      .filter((edge) => edge.type === "marriage")
      .map((edge) => pairKey(edge.sourceId, edge.targetId)),
  );
  const directParentPairs = new Set(
    diagram.edges
      .filter((edge) => edge.type === "parent-child")
      .map((edge) => pairKey(edge.sourceId, edge.targetId)),
  );

  const bands = tree.levels
    .map((level, index) => {
      const y = TOP_PADDING + index * ROW_GAP - 39;
      const label = level > 0 ? `Generation +${level}` : `Generation ${level}`;
      return `<g><rect x="14" y="${y}" width="${tree.width - 28}" height="${CARD_HEIGHT + 80}" rx="18" fill="${index % 2 === 0 ? "#ffffff" : "#f8fafc"}" stroke="#e2e8f0"/><text x="32" y="${y + 25}" font-size="12" font-weight="700" fill="#64748b">${escapeXml(label)}</text></g>`;
    })
    .join("");

  const lineage = parentGroups(diagram)
    .map((group) => {
      const parentPositions = group.parentIds
        .map((id) => tree.positions.get(id))
        .filter((position): position is Position => Boolean(position));
      const childPositions = group.childIds
        .map((id) => tree.positions.get(id))
        .filter((position): position is Position => Boolean(position));
      if (!parentPositions.length || !childPositions.length) return "";
      const parentX =
        parentPositions.reduce((sum, position) => sum + position.x, 0) /
        parentPositions.length;
      const parentBottom = Math.max(...parentPositions.map((position) => position.y)) + CARD_HEIGHT / 2;
      const childTop = Math.min(...childPositions.map((position) => position.y - CARD_HEIGHT / 2));
      const branchY = parentBottom + Math.max((childTop - parentBottom) * 0.5, 24);
      const childXs = childPositions.map((position) => position.x);
      const horizontalStart = Math.min(parentX, ...childXs);
      const horizontalEnd = Math.max(parentX, ...childXs);
      const siblingHighlighted = group.childIds.some((firstId, firstIndex) =>
        group.childIds.slice(firstIndex + 1).some((secondId) =>
          highlightedPairs.has(pairKey(firstId, secondId)),
        ),
      );
      const parentHighlighted = group.parentIds.some((parentId) =>
        group.childIds.some((childId) => highlightedPairs.has(pairKey(parentId, childId))),
      );
      const highlighted = siblingHighlighted || parentHighlighted;
      const stroke = highlighted ? "#4f46e5" : "#64748b";
      const strokeWidth = highlighted ? 4 : 2.2;
      const children = childPositions
        .map((position, index) => {
          const childId = group.childIds[index]!;
          const childHighlighted =
            siblingHighlighted ||
            group.parentIds.some((parentId) => highlightedPairs.has(pairKey(parentId, childId)));
          return `<path d="M ${position.x} ${branchY} V ${position.y - CARD_HEIGHT / 2}" fill="none" stroke="${childHighlighted ? "#4f46e5" : stroke}" stroke-width="${childHighlighted ? 4 : strokeWidth}" stroke-linecap="round"/>`;
        })
        .join("");
      return `<g><path d="M ${parentX} ${parentBottom} V ${branchY}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>${horizontalEnd - horizontalStart > 1 ? `<path d="M ${horizontalStart} ${branchY} H ${horizontalEnd}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>` : ""}${children}</g>`;
    })
    .join("");

  const marriages = diagram.edges
    .filter((edge) => edge.type === "marriage")
    .map((edge) => {
      const source = tree.positions.get(edge.sourceId);
      const target = tree.positions.get(edge.targetId);
      if (!source || !target) return "";
      const left = source.x <= target.x ? source : target;
      const right = source.x <= target.x ? target : source;
      const highlighted = highlightedPairs.has(pairKey(edge.sourceId, edge.targetId));
      const colour = highlighted ? "#4f46e5" : "#e11d48";
      return `<g><line x1="${left.x + CARD_WIDTH / 2}" y1="${left.y}" x2="${right.x - CARD_WIDTH / 2}" y2="${right.y}" stroke="${colour}" stroke-width="${highlighted ? 5 : 3}" stroke-linecap="round"/><circle cx="${(left.x + right.x) / 2}" cy="${left.y}" r="5" fill="${colour}"/></g>`;
    })
    .join("");

  const siblingPath = (diagram.query?.pathPersonIds ?? [])
    .slice(0, -1)
    .map((firstId, index) => {
      const secondId = diagram.query!.pathPersonIds![index + 1]!;
      const key = pairKey(firstId, secondId);
      if (marriagePairs.has(key) || directParentPairs.has(key)) return "";
      const first = tree.positions.get(firstId);
      const second = tree.positions.get(secondId);
      if (!first || !second || Math.abs(first.y - second.y) > 1) return "";
      const left = first.x <= second.x ? first : second;
      const right = first.x <= second.x ? second : first;
      return `<g><line x1="${left.x + CARD_WIDTH / 2}" y1="${left.y + CARD_HEIGHT / 2 + 12}" x2="${right.x - CARD_WIDTH / 2}" y2="${right.y + CARD_HEIGHT / 2 + 12}" stroke="#4f46e5" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round"/><text x="${(left.x + right.x) / 2}" y="${left.y + CARD_HEIGHT / 2 + 29}" text-anchor="middle" font-size="10" font-weight="700" fill="#4f46e5">SIBLINGS</text></g>`;
    })
    .join("");

  const highlightedNodes = new Set(diagram.query?.pathPersonIds ?? []);
  const cards = diagram.nodes
    .map((node) => {
      const position = tree.positions.get(node.id)!;
      const colours = badge(node);
      const highlighted = highlightedNodes.has(node.id);
      const subject = diagram.query?.subjectId === node.id;
      const reference = diagram.query?.referenceId === node.id;
      return `<g><rect x="${position.x - CARD_WIDTH / 2}" y="${position.y - CARD_HEIGHT / 2}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="15" fill="${colours.card}" stroke="${highlighted ? "#4f46e5" : colours.stroke}" stroke-width="${highlighted ? 4 : 2}"/><circle cx="${position.x - CARD_WIDTH / 2 + 25}" cy="${position.y}" r="16" fill="${colours.fill}" stroke="${colours.stroke}"/><text x="${position.x - CARD_WIDTH / 2 + 25}" y="${position.y + 5}" text-anchor="middle" font-size="13" font-weight="800" fill="${colours.ink}">${colours.letter}</text><text x="${position.x - CARD_WIDTH / 2 + 51}" y="${position.y - 3}" font-size="14" font-weight="700" fill="#0f172a">${escapeXml(node.label)}</text><text x="${position.x - CARD_WIDTH / 2 + 51}" y="${position.y + 16}" font-size="9" font-weight="700" fill="#64748b">${colours.name}</text>${subject || reference ? `<rect x="${position.x + CARD_WIDTH / 2 - 46}" y="${position.y - CARD_HEIGHT / 2 - 10}" width="44" height="20" rx="10" fill="${subject ? "#4f46e5" : "#0f766e"}"/><text x="${position.x + CARD_WIDTH / 2 - 24}" y="${position.y - CARD_HEIGHT / 2 + 4}" text-anchor="middle" font-size="9" font-weight="700" fill="#ffffff">${subject ? "START" : "TARGET"}</text>` : ""}</g>`;
    })
    .join("");

  const answer = diagram.query?.answerLabel
    ? `<text x="${tree.width / 2}" y="28" text-anchor="middle" font-size="16" font-weight="700" fill="#3730a3">Answer: ${escapeXml(diagram.query.answerLabel)}</text>`
    : "";

  return `<div class="svg-family-tree"><svg viewBox="0 0 ${tree.width} ${tree.height}" role="img" aria-label="${escapeXml(diagram.accessibleSummary)}">${answer}${bands}${lineage}${marriages}${siblingPath}${cards}</svg><div class="svg-tree-key"><span><b>M</b> Male</span><span><b>F</b> Female</span><span>━━ Married</span><span>│ Parent–child</span><span class="answer-key">━━ Answer path</span></div></div>`;
}
