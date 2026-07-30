import { useMemo, useState } from "react";
import { Eye, Focus, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  FamilyTreeDiagramData,
  FamilyTreeNode,
} from "./family-tree-types";

const CARD_WIDTH = 150;
const CARD_HEIGHT = 68;
const SPOUSE_GAP = 40;
const UNIT_GAP = 58;
const ROW_GAP = 150;
const SIDE_PADDING = 72;
const TOP_PADDING = 96;
const BOTTOM_PADDING = 78;

type Position = { x: number; y: number };

type GenerationUnit = {
  ids: string[];
  width: number;
  sortKey: string;
  parentAnchor: number | null;
};

type FamilyTreeLayout = {
  width: number;
  height: number;
  levels: number[];
  positions: Map<string, Position>;
};

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function nodeMap(data: FamilyTreeDiagramData): Map<string, FamilyTreeNode> {
  return new Map(data.nodes.map((node) => [node.id, node]));
}

function parentMap(data: FamilyTreeDiagramData): Map<string, string[]> {
  const parents = new Map<string, string[]>();
  for (const edge of data.edges) {
    if (edge.type !== "parent-child") continue;
    const current = parents.get(edge.targetId) ?? [];
    current.push(edge.sourceId);
    parents.set(edge.targetId, current);
  }
  return parents;
}

function partnerMap(data: FamilyTreeDiagramData): Map<string, string> {
  const partners = new Map<string, string>();
  for (const edge of data.edges) {
    if (edge.type !== "marriage") continue;
    partners.set(edge.sourceId, edge.targetId);
    partners.set(edge.targetId, edge.sourceId);
  }
  return partners;
}

function conventionalCoupleOrder(
  firstId: string,
  secondId: string,
  nodes: Map<string, FamilyTreeNode>,
): [string, string] {
  const first = nodes.get(firstId)!;
  const second = nodes.get(secondId)!;
  if (first.gender === "male" && second.gender === "female") return [firstId, secondId];
  if (second.gender === "male" && first.gender === "female") return [secondId, firstId];
  return first.label.localeCompare(second.label, "en-IN") <= 0
    ? [firstId, secondId]
    : [secondId, firstId];
}

function rowUnits(
  members: FamilyTreeNode[],
  partners: Map<string, string>,
  nodes: Map<string, FamilyTreeNode>,
  parents: Map<string, string[]>,
  positions: Map<string, Position>,
): GenerationUnit[] {
  const memberIds = new Set(members.map((member) => member.id));
  const used = new Set<string>();
  const units: GenerationUnit[] = [];

  for (const member of [...members].sort((left, right) =>
    left.label.localeCompare(right.label, "en-IN"),
  )) {
    if (used.has(member.id)) continue;
    const partnerId = partners.get(member.id);
    const ids =
      partnerId && memberIds.has(partnerId) && !used.has(partnerId)
        ? [...conventionalCoupleOrder(member.id, partnerId, nodes)]
        : [member.id];
    ids.forEach((id) => used.add(id));

    const parentPositions = ids
      .flatMap((id) => parents.get(id) ?? [])
      .map((parentId) => positions.get(parentId))
      .filter((position): position is Position => Boolean(position));
    const parentAnchor = parentPositions.length
      ? parentPositions.reduce((sum, position) => sum + position.x, 0) /
        parentPositions.length
      : null;
    const sortKey = ids
      .map((id) => nodes.get(id)?.label ?? id)
      .sort((left, right) => left.localeCompare(right, "en-IN"))
      .join(" ");
    units.push({
      ids,
      width: ids.length === 2 ? CARD_WIDTH * 2 + SPOUSE_GAP : CARD_WIDTH,
      sortKey,
      parentAnchor,
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

function totalUnitsWidth(units: GenerationUnit[]): number {
  return (
    units.reduce((sum, unit) => sum + unit.width, 0) +
    Math.max(units.length - 1, 0) * UNIT_GAP
  );
}

function orientCouple(
  unit: GenerationUnit,
  centre: number,
  parents: Map<string, string[]>,
  nodes: Map<string, FamilyTreeNode>,
): string[] {
  if (unit.ids.length !== 2 || unit.parentAnchor === null) return unit.ids;
  const withDisplayedParents = unit.ids.filter((id) => (parents.get(id)?.length ?? 0) > 0);
  if (withDisplayedParents.length !== 1) return unit.ids;

  const familyMember = withDisplayedParents[0]!;
  const spouse = unit.ids.find((id) => id !== familyMember)!;
  if (unit.parentAnchor > centre + 1) return [spouse, familyMember];
  if (unit.parentAnchor < centre - 1) return [familyMember, spouse];
  return conventionalCoupleOrder(familyMember, spouse, nodes);
}

function positionRow(
  units: GenerationUnit[],
  y: number,
  width: number,
  positions: Map<string, Position>,
  parents: Map<string, string[]>,
  nodes: Map<string, FamilyTreeNode>,
): void {
  if (!units.length) return;
  const rowWidth = totalUnitsWidth(units);

  if (units.every((unit) => unit.parentAnchor === null)) {
    let cursor = (width - rowWidth) / 2;
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

function buildLayout(data: FamilyTreeDiagramData): FamilyTreeLayout {
  const nodes = nodeMap(data);
  const parents = parentMap(data);
  const partners = partnerMap(data);
  const levels = [...new Set(data.nodes.map((node) => node.generation))].sort(
    (left, right) => right - left,
  );
  const provisionalUnits = levels.map((level) => {
    const members = data.nodes.filter((node) => node.generation === level);
    return rowUnits(members, partners, nodes, parents, new Map());
  });
  const widestRow = Math.max(660, ...provisionalUnits.map(totalUnitsWidth));
  const width = widestRow + SIDE_PADDING * 2;
  const height =
    TOP_PADDING + Math.max(levels.length - 1, 0) * ROW_GAP + CARD_HEIGHT + BOTTOM_PADDING;
  const positions = new Map<string, Position>();

  levels.forEach((level, rowIndex) => {
    const members = data.nodes.filter((node) => node.generation === level);
    const units = rowUnits(members, partners, nodes, parents, positions);
    positionRow(
      units,
      TOP_PADDING + rowIndex * ROW_GAP + CARD_HEIGHT / 2,
      width,
      positions,
      parents,
      nodes,
    );
  });

  return { width, height, levels, positions };
}

function parentGroups(data: FamilyTreeDiagramData) {
  const parentsByChild = parentMap(data);
  const groups = new Map<string, { parentIds: string[]; childIds: string[] }>();
  for (const [childId, parentIds] of parentsByChild) {
    const uniqueParents = [...new Set(parentIds)].sort();
    const key = uniqueParents.join("::");
    const group = groups.get(key) ?? { parentIds: uniqueParents, childIds: [] };
    group.childIds.push(childId);
    groups.set(key, group);
  }
  return [...groups.values()];
}

function generationLabel(level: number): string {
  if (level > 0) return `Generation +${level}`;
  if (level === 0) return "Generation 0";
  return `Generation ${level}`;
}

function genderBadge(node: FamilyTreeNode) {
  if (node.gender === "male") {
    return { letter: "M", name: "Male", fill: "#dbeafe", ink: "#1d4ed8", stroke: "#60a5fa", card: "#eff6ff" };
  }
  if (node.gender === "female") {
    return { letter: "F", name: "Female", fill: "#ffe4e6", ink: "#be123c", stroke: "#fb7185", card: "#fff1f2" };
  }
  return { letter: "?", name: "Gender not stated", fill: "#e2e8f0", ink: "#475569", stroke: "#94a3b8", card: "#f8fafc" };
}

function adjacentPathPairs(data: FamilyTreeDiagramData): Set<string> {
  const ids = data.query?.pathPersonIds ?? [];
  return new Set(ids.slice(0, -1).map((id, index) => pairKey(id, ids[index + 1]!)));
}

function queryHeader(data: FamilyTreeDiagramData, nodes: Map<string, FamilyTreeNode>): string | null {
  const subject = data.query?.subjectId ? nodes.get(data.query.subjectId)?.label : null;
  const reference = data.query?.referenceId ? nodes.get(data.query.referenceId)?.label : null;
  const parts = [
    subject && reference ? `${subject} → ${reference}` : null,
    data.query?.answerLabel ? `Answer: ${data.query.answerLabel}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join("  •  ") : null;
}

export default function FamilyTreeDiagram({
  data,
  className,
}: {
  data: FamilyTreeDiagramData;
  className?: string;
}) {
  const [focusPath, setFocusPath] = useState(Boolean(data.query?.pathPersonIds?.length));
  const layout = useMemo(() => buildLayout(data), [data]);
  const nodes = useMemo(() => nodeMap(data), [data]);
  const pathIds = useMemo(
    () => new Set(focusPath ? data.query?.pathPersonIds ?? [] : []),
    [data.query?.pathPersonIds, focusPath],
  );
  const pathPairs = useMemo(
    () => (focusPath ? adjacentPathPairs(data) : new Set<string>()),
    [data, focusPath],
  );
  const header = queryHeader(data, nodes);
  const minimumWidth = Math.min(Math.max(layout.width, 720), 1180);
  const marriagePairs = new Set(
    data.edges
      .filter((edge) => edge.type === "marriage")
      .map((edge) => pairKey(edge.sourceId, edge.targetId)),
  );
  const directParentPairs = new Set(
    data.edges
      .filter((edge) => edge.type === "parent-child")
      .map((edge) => pairKey(edge.sourceId, edge.targetId)),
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-4 py-3 dark:border-slate-800 dark:from-indigo-950/40 dark:via-slate-950 dark:to-sky-950/30 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">
            Visual family tree
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-950 dark:text-slate-100">
            {data.title ?? "Blood-relation solution map"}
          </h3>
          {header ? (
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{header}</p>
          ) : null}
        </div>
        {data.query?.pathPersonIds?.length ? (
          <div className="inline-flex self-start rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:self-auto">
            <button
              type="button"
              onClick={() => setFocusPath(true)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-xs font-semibold transition",
                focusPath
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <Focus className="h-4 w-4" /> Answer path
            </button>
            <button
              type="button"
              onClick={() => setFocusPath(false)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-xs font-semibold transition",
                !focusPath
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              <Network className="h-4 w-4" /> Full family
            </button>
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto bg-slate-50 p-3 dark:bg-slate-900/60">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="img"
          aria-label={data.accessibleSummary ?? "Blood-relation family tree"}
          className="h-auto w-full"
          style={{ minWidth: `${minimumWidth}px` }}
        >
          <defs>
            <filter id="family-tree-shadow" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.12" />
            </filter>
            <filter id="family-tree-focus" x="-35%" y="-35%" width="170%" height="170%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#4f46e5" floodOpacity="0.42" />
            </filter>
          </defs>

          {layout.levels.map((level, index) => {
            const y = TOP_PADDING + index * ROW_GAP - 40;
            return (
              <g key={level}>
                <rect
                  x="14"
                  y={y}
                  width={layout.width - 28}
                  height={CARD_HEIGHT + 82}
                  rx="18"
                  fill={index % 2 === 0 ? "#ffffff" : "#f8fafc"}
                  stroke="#e2e8f0"
                />
                <text x="32" y={y + 25} className="fill-slate-500 text-[12px] font-semibold uppercase tracking-wider">
                  {generationLabel(level)}
                </text>
              </g>
            );
          })}

          {parentGroups(data).map((group) => {
            const parentPositions = group.parentIds
              .map((id) => layout.positions.get(id))
              .filter((position): position is Position => Boolean(position));
            const childPositions = group.childIds
              .map((id) => layout.positions.get(id))
              .filter((position): position is Position => Boolean(position));
            if (!parentPositions.length || !childPositions.length) return null;

            const parentX =
              parentPositions.reduce((sum, position) => sum + position.x, 0) /
              parentPositions.length;
            const parentBottom = Math.max(...parentPositions.map((position) => position.y)) + CARD_HEIGHT / 2;
            const childTop = Math.min(...childPositions.map((position) => position.y - CARD_HEIGHT / 2));
            const branchY = parentBottom + Math.max((childTop - parentBottom) * 0.5, 24);
            const childXs = childPositions.map((position) => position.x);
            const horizontalStart = Math.min(parentX, ...childXs);
            const horizontalEnd = Math.max(parentX, ...childXs);
            const siblingPathHighlighted = group.childIds.some((firstId, firstIndex) =>
              group.childIds.slice(firstIndex + 1).some((secondId) => pathPairs.has(pairKey(firstId, secondId))),
            );
            const parentChildHighlighted = group.parentIds.some((parentId) =>
              group.childIds.some((childId) => pathPairs.has(pairKey(parentId, childId))),
            );
            const groupHighlighted = focusPath && (siblingPathHighlighted || parentChildHighlighted);
            const baseStroke = groupHighlighted ? "#4f46e5" : "#64748b";
            const baseWidth = groupHighlighted ? 4 : 2.2;

            return (
              <g key={`family-${group.parentIds.join("-")}-${group.childIds.join("-")}`}>
                <path
                  d={`M ${parentX} ${parentBottom} V ${branchY}`}
                  fill="none"
                  stroke={baseStroke}
                  strokeWidth={baseWidth}
                  strokeLinecap="round"
                />
                {horizontalEnd - horizontalStart > 1 ? (
                  <path
                    d={`M ${horizontalStart} ${branchY} H ${horizontalEnd}`}
                    fill="none"
                    stroke={baseStroke}
                    strokeWidth={baseWidth}
                    strokeLinecap="round"
                  />
                ) : null}
                {childPositions.map((position, index) => {
                  const childId = group.childIds[index]!;
                  const highlighted =
                    focusPath &&
                    (group.parentIds.some((parentId) => pathPairs.has(pairKey(parentId, childId))) ||
                      siblingPathHighlighted);
                  return (
                    <path
                      key={`${childId}-lineage`}
                      d={`M ${position.x} ${branchY} V ${position.y - CARD_HEIGHT / 2}`}
                      fill="none"
                      stroke={highlighted ? "#4f46e5" : baseStroke}
                      strokeWidth={highlighted ? 4 : baseWidth}
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            );
          })}

          {data.edges.filter((edge) => edge.type === "marriage").map((edge) => {
            const source = layout.positions.get(edge.sourceId);
            const target = layout.positions.get(edge.targetId);
            if (!source || !target) return null;
            const left = source.x <= target.x ? source : target;
            const right = source.x <= target.x ? target : source;
            const highlighted = focusPath && pathPairs.has(pairKey(edge.sourceId, edge.targetId));
            return (
              <g key={edge.id}>
                <line
                  x1={left.x + CARD_WIDTH / 2}
                  y1={left.y}
                  x2={right.x - CARD_WIDTH / 2}
                  y2={right.y}
                  stroke={highlighted ? "#4f46e5" : "#e11d48"}
                  strokeWidth={highlighted ? 5 : 3}
                  strokeLinecap="round"
                />
                <circle cx={(left.x + right.x) / 2} cy={left.y} r="5" fill={highlighted ? "#4f46e5" : "#e11d48"} />
              </g>
            );
          })}

          {focusPath
            ? (data.query?.pathPersonIds ?? []).slice(0, -1).map((firstId, index) => {
                const secondId = data.query!.pathPersonIds![index + 1]!;
                if (marriagePairs.has(pairKey(firstId, secondId)) || directParentPairs.has(pairKey(firstId, secondId))) {
                  return null;
                }
                const first = layout.positions.get(firstId);
                const second = layout.positions.get(secondId);
                if (!first || !second || Math.abs(first.y - second.y) > 1) return null;
                const left = first.x <= second.x ? first : second;
                const right = first.x <= second.x ? second : first;
                return (
                  <g key={`path-sibling-${firstId}-${secondId}`}>
                    <line
                      x1={left.x + CARD_WIDTH / 2}
                      y1={left.y + CARD_HEIGHT / 2 + 12}
                      x2={right.x - CARD_WIDTH / 2}
                      y2={right.y + CARD_HEIGHT / 2 + 12}
                      stroke="#4f46e5"
                      strokeWidth="4"
                      strokeDasharray="8 6"
                      strokeLinecap="round"
                    />
                    <text
                      x={(left.x + right.x) / 2}
                      y={left.y + CARD_HEIGHT / 2 + 29}
                      textAnchor="middle"
                      className="fill-indigo-600 text-[10px] font-bold uppercase tracking-wide"
                    >
                      siblings
                    </text>
                  </g>
                );
              })
            : null}

          {data.nodes.map((node) => {
            const position = layout.positions.get(node.id);
            if (!position) return null;
            const badge = genderBadge(node);
            const highlighted = focusPath && pathIds.has(node.id);
            const isSubject = data.query?.subjectId === node.id;
            const isReference = data.query?.referenceId === node.id;
            return (
              <g key={node.id}>
                <rect
                  x={position.x - CARD_WIDTH / 2}
                  y={position.y - CARD_HEIGHT / 2}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  rx="15"
                  fill={badge.card}
                  stroke={highlighted ? "#4f46e5" : badge.stroke}
                  strokeWidth={highlighted ? 4 : 2}
                  filter={highlighted ? "url(#family-tree-focus)" : "url(#family-tree-shadow)"}
                />
                <circle
                  cx={position.x - CARD_WIDTH / 2 + 25}
                  cy={position.y}
                  r="16"
                  fill={badge.fill}
                  stroke={badge.stroke}
                />
                <text
                  x={position.x - CARD_WIDTH / 2 + 25}
                  y={position.y + 5}
                  textAnchor="middle"
                  className="text-[13px] font-extrabold"
                  fill={badge.ink}
                >
                  {badge.letter}
                </text>
                <text
                  x={position.x - CARD_WIDTH / 2 + 51}
                  y={position.y - 3}
                  className="fill-slate-950 text-[14px] font-bold"
                >
                  {node.label.length > 12 ? `${node.label.slice(0, 11)}…` : node.label}
                </text>
                <text
                  x={position.x - CARD_WIDTH / 2 + 51}
                  y={position.y + 16}
                  className="fill-slate-500 text-[9px] font-semibold uppercase tracking-wide"
                >
                  {node.roleLabel ?? badge.name}
                </text>
                {isSubject || isReference ? (
                  <g>
                    <rect
                      x={position.x + CARD_WIDTH / 2 - 46}
                      y={position.y - CARD_HEIGHT / 2 - 10}
                      width="44"
                      height="20"
                      rx="10"
                      fill={isSubject ? "#4f46e5" : "#0f766e"}
                    />
                    <text
                      x={position.x + CARD_WIDTH / 2 - 24}
                      y={position.y - CARD_HEIGHT / 2 + 4}
                      textAnchor="middle"
                      className="fill-white text-[9px] font-bold uppercase tracking-wide"
                    >
                      {isSubject ? "Start" : "Target"}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 px-4 py-3 text-xs font-medium text-slate-600 dark:border-slate-800 dark:text-slate-300">
        <span><strong className="text-blue-700">M</strong> Male</span>
        <span><strong className="text-rose-700">F</strong> Female</span>
        <span><span className="mr-1 inline-block h-0.5 w-7 bg-rose-600 align-middle" /> Married</span>
        <span><span className="mr-1 inline-block h-5 w-0.5 bg-slate-500 align-middle" /> Parent–child</span>
        {data.query?.pathPersonIds?.length ? (
          <span><span className="mr-1 inline-block h-0.5 w-7 bg-indigo-600 align-middle" /> Answer path</span>
        ) : null}
      </div>

      {data.asciiFallback ? (
        <details className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          <summary className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Eye className="h-4 w-4" /> Plain-text fallback
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
            {data.asciiFallback}
          </pre>
        </details>
      ) : null}
    </section>
  );
}
