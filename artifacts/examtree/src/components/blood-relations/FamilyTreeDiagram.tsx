import { useMemo, useState } from "react";
import { Eye, Focus, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  FamilyTreeDiagramData,
  FamilyTreeEdge,
  FamilyTreeNode,
} from "./family-tree-types";

const CARD_WIDTH = 148;
const CARD_HEIGHT = 66;
const SPOUSE_GAP = 42;
const UNIT_GAP = 58;
const ROW_GAP = 144;
const SIDE_PADDING = 72;
const TOP_PADDING = 94;
const BOTTOM_PADDING = 76;

type Position = {
  x: number;
  y: number;
};

type GenerationUnit = {
  ids: string[];
  width: number;
};

type Layout = {
  width: number;
  height: number;
  levels: number[];
  positions: Map<string, Position>;
};

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function nodeById(data: FamilyTreeDiagramData): Map<string, FamilyTreeNode> {
  return new Map(data.nodes.map((node) => [node.id, node]));
}

function marriagePartnerMap(data: FamilyTreeDiagramData): Map<string, string> {
  const partners = new Map<string, string>();
  for (const edge of data.edges) {
    if (edge.type !== "marriage") continue;
    partners.set(edge.sourceId, edge.targetId);
    partners.set(edge.targetId, edge.sourceId);
  }
  return partners;
}

function orderCouple(
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

function generationUnits(
  generationNodes: FamilyTreeNode[],
  partners: Map<string, string>,
  nodes: Map<string, FamilyTreeNode>,
): GenerationUnit[] {
  const generationIds = new Set(generationNodes.map((node) => node.id));
  const used = new Set<string>();
  const units: GenerationUnit[] = [];

  for (const node of [...generationNodes].sort((left, right) =>
    left.label.localeCompare(right.label, "en-IN"),
  )) {
    if (used.has(node.id)) continue;
    const partnerId = partners.get(node.id);
    if (partnerId && generationIds.has(partnerId) && !used.has(partnerId)) {
      const [leftId, rightId] = orderCouple(node.id, partnerId, nodes);
      units.push({ ids: [leftId, rightId], width: CARD_WIDTH * 2 + SPOUSE_GAP });
      used.add(leftId);
      used.add(rightId);
    } else {
      units.push({ ids: [node.id], width: CARD_WIDTH });
      used.add(node.id);
    }
  }

  return units;
}

function buildLayout(data: FamilyTreeDiagramData): Layout {
  const nodes = nodeById(data);
  const partners = marriagePartnerMap(data);
  const levels = [...new Set(data.nodes.map((node) => node.generation))].sort(
    (left, right) => right - left,
  );
  const rows = levels.map((level) => {
    const members = data.nodes.filter((node) => node.generation === level);
    const units = generationUnits(members, partners, nodes);
    const width =
      units.reduce((sum, unit) => sum + unit.width, 0) +
      Math.max(units.length - 1, 0) * UNIT_GAP;
    return { level, units, width };
  });

  const contentWidth = Math.max(660, ...rows.map((row) => row.width));
  const width = contentWidth + SIDE_PADDING * 2;
  const height = TOP_PADDING + Math.max(levels.length - 1, 0) * ROW_GAP + CARD_HEIGHT + BOTTOM_PADDING;
  const positions = new Map<string, Position>();

  rows.forEach((row, rowIndex) => {
    let cursor = (width - row.width) / 2;
    const y = TOP_PADDING + rowIndex * ROW_GAP + CARD_HEIGHT / 2;
    for (const unit of row.units) {
      if (unit.ids.length === 2) {
        positions.set(unit.ids[0]!, { x: cursor + CARD_WIDTH / 2, y });
        positions.set(unit.ids[1]!, {
          x: cursor + CARD_WIDTH + SPOUSE_GAP + CARD_WIDTH / 2,
          y,
        });
      } else {
        positions.set(unit.ids[0]!, { x: cursor + CARD_WIDTH / 2, y });
      }
      cursor += unit.width + UNIT_GAP;
    }
  });

  return { width, height, levels, positions };
}

function genderSymbol(gender: FamilyTreeNode["gender"]): string {
  if (gender === "male") return "♂";
  if (gender === "female") return "♀";
  return "•";
}

function nodePalette(gender: FamilyTreeNode["gender"]) {
  if (gender === "male") {
    return { fill: "#eff6ff", stroke: "#60a5fa", badge: "#2563eb", badgeFill: "#dbeafe" };
  }
  if (gender === "female") {
    return { fill: "#fff1f2", stroke: "#fb7185", badge: "#e11d48", badgeFill: "#ffe4e6" };
  }
  return { fill: "#f8fafc", stroke: "#94a3b8", badge: "#475569", badgeFill: "#e2e8f0" };
}

function edgeIsHighlighted(edge: FamilyTreeEdge, pathIds: Set<string>): boolean {
  return pathIds.has(edge.sourceId) && pathIds.has(edge.targetId);
}

function parentGroups(data: FamilyTreeDiagramData) {
  const parentsByChild = new Map<string, string[]>();
  for (const edge of data.edges) {
    if (edge.type !== "parent-child") continue;
    const parents = parentsByChild.get(edge.targetId) ?? [];
    parents.push(edge.sourceId);
    parentsByChild.set(edge.targetId, parents);
  }

  const groups = new Map<string, { parentIds: string[]; childIds: string[] }>();
  for (const [childId, parentIds] of parentsByChild) {
    const sorted = [...new Set(parentIds)].sort();
    const key = sorted.join("::");
    const group = groups.get(key) ?? { parentIds: sorted, childIds: [] };
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

function queryBanner(data: FamilyTreeDiagramData, nodes: Map<string, FamilyTreeNode>) {
  const subject = data.query?.subjectId ? nodes.get(data.query.subjectId)?.label : null;
  const reference = data.query?.referenceId ? nodes.get(data.query.referenceId)?.label : null;
  if (!subject && !reference && !data.query?.answerLabel) return null;
  return [
    subject && reference ? `${subject} → ${reference}` : null,
    data.query?.answerLabel ? `Answer: ${data.query.answerLabel}` : null,
  ]
    .filter(Boolean)
    .join("  •  ");
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
  const nodes = useMemo(() => nodeById(data), [data]);
  const marriagePairs = useMemo(
    () => new Set(data.edges.filter((edge) => edge.type === "marriage").map((edge) => pairKey(edge.sourceId, edge.targetId))),
    [data],
  );
  const pathIds = useMemo(
    () => new Set(focusPath ? data.query?.pathPersonIds ?? [] : []),
    [data.query?.pathPersonIds, focusPath],
  );
  const banner = queryBanner(data, nodes);
  const minWidth = Math.min(Math.max(layout.width, 720), 1180);

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
          {banner ? (
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{banner}</p>
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
              <Focus className="h-4 w-4" />
              Answer path
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
              <Network className="h-4 w-4" />
              Full family
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
          style={{ minWidth: `${minWidth}px` }}
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
            const y = TOP_PADDING + index * ROW_GAP - 39;
            return (
              <g key={level}>
                <rect
                  x="14"
                  y={y}
                  width={layout.width - 28}
                  height={CARD_HEIGHT + 78}
                  rx="16"
                  fill={index % 2 === 0 ? "#ffffff" : "#f8fafc"}
                  stroke="#e2e8f0"
                />
                <text x="32" y={y + 24} className="fill-slate-500 text-[12px] font-semibold uppercase tracking-wider">
                  {generationLabel(level)}
                </text>
              </g>
            );
          })}

          {parentGroups(data).map((group) => {
            const parentPositions = group.parentIds
              .map((id) => layout.positions.get(id))
              .filter((value): value is Position => Boolean(value));
            const childPositions = group.childIds
              .map((id) => layout.positions.get(id))
              .filter((value): value is Position => Boolean(value));
            if (!parentPositions.length || !childPositions.length) return null;
            const parentX = parentPositions.reduce((sum, position) => sum + position.x, 0) / parentPositions.length;
            const parentY = Math.max(...parentPositions.map((position) => position.y)) + CARD_HEIGHT / 2;
            const childTop = Math.min(...childPositions.map((position) => position.y - CARD_HEIGHT / 2));
            const branchY = parentY + Math.max((childTop - parentY) * 0.52, 24);
            const childXs = childPositions.map((position) => position.x);
            const highlighted = focusPath && group.childIds.some((childId) =>
              pathIds.has(childId) && group.parentIds.some((parentId) => pathIds.has(parentId)),
            );
            const stroke = highlighted ? "#4f46e5" : "#64748b";
            const strokeWidth = highlighted ? 4 : 2.2;
            return (
              <g key={`parents-${group.parentIds.join("-")}`}>
                <path
                  d={`M ${parentX} ${parentY} V ${branchY}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {childXs.length > 1 ? (
                  <path
                    d={`M ${Math.min(...childXs)} ${branchY} H ${Math.max(...childXs)}`}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />
                ) : null}
                {childPositions.map((position, index) => (
                  <path
                    key={`${group.childIds[index]}-lineage`}
                    d={`M ${position.x} ${branchY} V ${position.y - CARD_HEIGHT / 2}`}
                    fill="none"
                    stroke={
                      focusPath && pathIds.has(group.childIds[index]!) && group.parentIds.some((id) => pathIds.has(id))
                        ? "#4f46e5"
                        : stroke
                    }
                    strokeWidth={
                      focusPath && pathIds.has(group.childIds[index]!) && group.parentIds.some((id) => pathIds.has(id))
                        ? 4
                        : strokeWidth
                    }
                    strokeLinecap="round"
                  />
                ))}
              </g>
            );
          })}

          {data.edges.filter((edge) => edge.type === "marriage").map((edge) => {
            const source = layout.positions.get(edge.sourceId);
            const target = layout.positions.get(edge.targetId);
            if (!source || !target) return null;
            const left = source.x <= target.x ? source : target;
            const right = source.x <= target.x ? target : source;
            const highlighted = focusPath && edgeIsHighlighted(edge, pathIds);
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

          {data.edges.filter((edge) => edge.type === "sibling").map((edge) => {
            if (marriagePairs.has(pairKey(edge.sourceId, edge.targetId))) return null;
            const source = layout.positions.get(edge.sourceId);
            const target = layout.positions.get(edge.targetId);
            if (!source || !target || source.y !== target.y) return null;
            const highlighted = focusPath && edgeIsHighlighted(edge, pathIds);
            return (
              <line
                key={edge.id}
                x1={Math.min(source.x, target.x) + CARD_WIDTH / 2}
                y1={source.y + CARD_HEIGHT / 2 + 13}
                x2={Math.max(source.x, target.x) - CARD_WIDTH / 2}
                y2={target.y + CARD_HEIGHT / 2 + 13}
                stroke={highlighted ? "#4f46e5" : "#94a3b8"}
                strokeWidth={highlighted ? 4 : 2}
                strokeDasharray="7 6"
                strokeLinecap="round"
              />
            );
          })}

          {data.nodes.map((node) => {
            const position = layout.positions.get(node.id);
            if (!position) return null;
            const palette = nodePalette(node.gender);
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
                  rx="14"
                  fill={palette.fill}
                  stroke={highlighted ? "#4f46e5" : palette.stroke}
                  strokeWidth={highlighted ? 4 : 2}
                  filter={highlighted ? "url(#family-tree-focus)" : "url(#family-tree-shadow)"}
                />
                <circle
                  cx={position.x - CARD_WIDTH / 2 + 24}
                  cy={position.y}
                  r="15"
                  fill={palette.badgeFill}
                  stroke={palette.stroke}
                />
                <text
                  x={position.x - CARD_WIDTH / 2 + 24}
                  y={position.y + 5}
                  textAnchor="middle"
                  className="text-[18px] font-bold"
                  fill={palette.badge}
                >
                  {genderSymbol(node.gender)}
                </text>
                <text
                  x={position.x - CARD_WIDTH / 2 + 48}
                  y={position.y - (node.roleLabel ? 4 : -4)}
                  className="fill-slate-950 text-[14px] font-bold"
                >
                  {node.label.length > 13 ? `${node.label.slice(0, 12)}…` : node.label}
                </text>
                {node.roleLabel ? (
                  <text
                    x={position.x - CARD_WIDTH / 2 + 48}
                    y={position.y + 17}
                    className="fill-slate-500 text-[10px] font-medium"
                  >
                    {node.roleLabel.length > 18 ? `${node.roleLabel.slice(0, 17)}…` : node.roleLabel}
                  </text>
                ) : null}
                {isSubject || isReference ? (
                  <g>
                    <rect
                      x={position.x + CARD_WIDTH / 2 - 44}
                      y={position.y - CARD_HEIGHT / 2 - 10}
                      width="42"
                      height="19"
                      rx="9.5"
                      fill={isSubject ? "#4f46e5" : "#0f766e"}
                    />
                    <text
                      x={position.x + CARD_WIDTH / 2 - 23}
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
        <span><strong className="text-blue-600">♂</strong> Male</span>
        <span><strong className="text-rose-600">♀</strong> Female</span>
        <span><span className="mr-1 inline-block h-0.5 w-7 bg-rose-600 align-middle" /> Married</span>
        <span><span className="mr-1 inline-block h-5 w-0.5 bg-slate-500 align-middle" /> Parent–child</span>
        {data.query?.pathPersonIds?.length ? (
          <span><span className="mr-1 inline-block h-0.5 w-7 bg-indigo-600 align-middle" /> Answer path</span>
        ) : null}
      </div>

      {data.asciiFallback ? (
        <details className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          <summary className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Eye className="h-4 w-4" />
            Plain-text fallback
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
            {data.asciiFallback}
          </pre>
        </details>
      ) : null}
    </section>
  );
}
