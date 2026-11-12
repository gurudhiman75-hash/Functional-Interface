import { Fragment, useId, useState, type ReactNode } from 'react';

/**
 * Lightweight, text-only explanation diagram support for existing MAL-001
 * markers. No images, HTML injection, external fonts, or network requests.
 * The raw explanation stays untouched for editing/persistence.
 */
const DIAGRAM_MARKER = /\[\[(EXAMTREE_ALLIGATION_SVG_V1|EXAMTREE_RATIO_ADJUSTMENT_SVG_V1):([A-Za-z0-9+/_-]+={0,2})\]\]/g;
const MAX_MARKER_LENGTH = 32768;

type LabelValue = { label: string; value: string; quantity?: string };
type Cross = {
  version: 1;
  kind: 'cross';
  title: string;
  lower: LabelValue;
  higher: LabelValue;
  mean: LabelValue;
  lowerPart: LabelValue & { expression: string };
  higherPart: LabelValue & { expression: string };
  rangePartition?: {
    quantityRatio: string; totalParts: string; priceGap: string;
    valuePerPart: string; meanDistanceFromLowerParts: string;
  };
};
type DeviationRow = LabelValue & { quantity: string; deviation: string };
type Deviation = {
  version: 1; kind: 'deviation'; title: string; target: LabelValue;
  below: DeviationRow[]; above: DeviationRow[];
};
type Sequence = {
  version: 1; kind: 'sequence'; title: string;
  stages: Array<{ label: string; diagram: Cross }>;
};
export type RatioAdjustmentData = {
  version: 1; kind: 'TWO_COMPONENT' | 'THREE_COMPONENT';
  title: string; quantityUnit: string;
  before: Array<{ label: string; quantity: string }>;
  operation: string;
  after: Array<{ label: string; quantity: string }>;
  beforeRatio: string; afterRatio: string; targetRatio?: string; note: string;
};
export type AlligationData = Cross | Deviation | Sequence;
export type ExplanationPart =
  | { kind: 'text'; text: string }
  | { kind: 'diagram'; data: AlligationData }
  | { kind: 'ratio-adjustment'; data: RatioAdjustmentData }
  | { kind: 'invalid-diagram' };

const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const textField = (value: unknown) => typeof value === 'string' && value.length <= 500;
const labelValue = (value: unknown): value is LabelValue =>
  record(value) && textField(value.label) && textField(value.value) &&
  (value.quantity === undefined || textField(value.quantity));
const part = (value: unknown): value is Cross['lowerPart'] =>
  labelValue(value) && 'expression' in value && textField(value.expression);
const cross = (value: unknown): value is Cross =>
  record(value) && value.version === 1 && value.kind === 'cross' &&
  textField(value.title) && labelValue(value.lower) && labelValue(value.higher) &&
  labelValue(value.mean) && part(value.lowerPart) && part(value.higherPart);
const deviationRow = (value: unknown): value is DeviationRow =>
  labelValue(value) && 'quantity' in value && textField(value.quantity) &&
  'deviation' in value && textField(value.deviation);
export function isAlligationData(value: unknown): value is AlligationData {
  if (!record(value) || value.version !== 1 || !textField(value.title)) return false;
  if (value.kind === 'cross') return cross(value);
  if (value.kind === 'deviation') return labelValue(value.target) &&
    Array.isArray(value.below) && value.below.length <= 12 && value.below.every(deviationRow) &&
    Array.isArray(value.above) && value.above.length <= 12 && value.above.every(deviationRow);
  if (value.kind === 'sequence') return Array.isArray(value.stages) &&
    value.stages.length > 0 && value.stages.length <= 8 &&
    value.stages.every((stage: unknown) =>
      record(stage) && textField(stage.label) && cross(stage.diagram));
  return false;
}

function isRatioAdjustmentData(value: unknown): value is RatioAdjustmentData {
  if (!record(value) || value.version !== 1 ||
      !['TWO_COMPONENT', 'THREE_COMPONENT'].includes(String(value.kind)) ||
      !textField(value.title) || !textField(value.quantityUnit) ||
      !textField(value.operation) || !textField(value.beforeRatio) ||
      !textField(value.afterRatio) || !textField(value.note) ||
      (value.targetRatio !== undefined && !textField(value.targetRatio))) return false;
  const expected = value.kind === 'THREE_COMPONENT' ? 3 : 2;
  const row = (item: unknown) => record(item) && textField(item.label) && textField(item.quantity);
  return Array.isArray(value.before) && value.before.length === expected &&
    value.before.every(row) && Array.isArray(value.after) &&
    value.after.length === expected && value.after.every(row);
}

function decodeDiagramJson(encoded: string): unknown {
  if (!encoded || encoded.length > MAX_MARKER_LENGTH) return null;
  try {
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
    const utf8 = Uint8Array.from(binary, char => char.charCodeAt(0));
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(utf8)) as unknown;
  } catch { return null; }
}

export function decodeAlligationMarker(encoded: string): AlligationData | null {
  const data = decodeDiagramJson(encoded);
  return isAlligationData(data) ? data : null;
}

export function decodeRatioAdjustmentMarker(encoded: string): RatioAdjustmentData | null {
  const data = decodeDiagramJson(encoded);
  return isRatioAdjustmentData(data) ? data : null;
}

export function splitAlligationExplanation(explanation: string): ExplanationPart[] {
  const parts: ExplanationPart[] = [];
  let start = 0;
  for (const match of explanation.matchAll(DIAGRAM_MARKER)) {
    const at = match.index ?? 0;
    if (at > start) parts.push({ kind: 'text', text: explanation.slice(start, at) });
    const kind = match[1];
    const encoded = match[2] ?? '';
    if (kind === 'EXAMTREE_RATIO_ADJUSTMENT_SVG_V1') {
      const diagram = decodeRatioAdjustmentMarker(encoded);
      parts.push(diagram ? { kind: 'ratio-adjustment', data: diagram } : { kind: 'invalid-diagram' });
    } else {
      const diagram = decodeAlligationMarker(encoded);
      parts.push(diagram ? { kind: 'diagram', data: diagram } : { kind: 'invalid-diagram' });
    }
    start = at + match[0].length;
  }
  if (start < explanation.length) parts.push({ kind: 'text', text: explanation.slice(start) });
  return parts;
}

function clip(text: string, max = 28) {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

/**
 * All diagrams share one scrollable vector surface and an optional larger
 * reading mode. Keep the *same* SVG node mounted while expanding so its ARIA
 * labels remain unique and no additional image requests are made.
 */
function DiagramSurface({ title, children, footer }: {
  title: string; children: ReactNode; footer?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return <figure
    role={expanded ? 'dialog' : undefined}
    aria-modal={expanded ? true : undefined}
    aria-label={expanded ? title : undefined}
    onKeyDown={expanded ? (event) => { if (event.key === 'Escape') setExpanded(false); } : undefined}
    className={expanded
      ? 'fixed inset-0 z-[100] m-0 flex flex-col overflow-hidden bg-background p-3 shadow-2xl sm:inset-4 sm:rounded-xl sm:border'
      : 'my-2 max-w-2xl overflow-hidden rounded-lg border bg-background p-2'}>
    <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
      <span className="min-w-0 truncate text-xs font-semibold text-foreground">{title}</span>
      <button type="button" aria-label={expanded ? 'Close enlarged diagram' : 'Enlarge diagram'}
        className="shrink-0 rounded-md border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        onClick={() => setExpanded(value => !value)}>
        {expanded ? 'Close' : 'Enlarge'}
      </button>
    </div>
    <div className="min-h-0 w-full flex-1 overflow-auto overscroll-contain">
      <div className={expanded
        ? 'mx-auto w-full min-w-[680px] max-w-[1000px]'
        : 'mx-auto w-full min-w-[480px] max-w-[640px]'}>
        {children}
      </div>
    </div>
    {footer && <figcaption className="mt-2 shrink-0 border-t pt-2 text-xs leading-relaxed text-foreground">{footer}</figcaption>}
  </figure>;
}

function CrossSvg({ data }: { data: Cross }) {
  const id = useId();
  const description = `${data.lower.label}: ${data.lower.value}; ${data.higher.label}: ${data.higher.value}; ${data.mean.label}: ${data.mean.value}; differences ${data.lowerPart.value} and ${data.higherPart.value}`;
  return <DiagramSurface title={data.title} footer={data.rangePartition ? <>Quantity ratio: {data.rangePartition.quantityRatio} · Total parts: {data.rangePartition.totalParts} · Price gap: {data.rangePartition.priceGap} · Value per part: {data.rangePartition.valuePerPart}</> : undefined}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 314" width="100%"
      className="mx-auto block h-auto w-full max-w-[600px] text-foreground"
      role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{data.title}</title>
      <desc id={`${id}-desc`}>{description}</desc>
      <text x="300" y="24" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="600">{clip(data.title, 55)}</text>
      <g fill="currentColor" textAnchor="middle">
        <text x="110" y="52" fontSize="13" fontWeight="600">{clip(data.lower.label, 24)}</text>
        <text x="110" y="77" fontSize="17" fontWeight="700">{clip(data.lower.value, 22)}</text>
        {data.lower.quantity && <text x="110" y="96" fontSize="12">{clip(data.lower.quantity, 22)}</text>}
        <text x="490" y="52" fontSize="13" fontWeight="600">{clip(data.higher.label, 24)}</text>
        <text x="490" y="77" fontSize="17" fontWeight="700">{clip(data.higher.value, 22)}</text>
        {data.higher.quantity && <text x="490" y="96" fontSize="12">{clip(data.higher.quantity, 22)}</text>}
      </g>
      <g stroke="currentColor" strokeWidth="2.4" opacity=".6">
        <line x1="165" y1="108" x2="437" y2="232" />
        <line x1="437" y1="108" x2="165" y2="232" />
      </g>
      <rect x="218" y="145" width="164" height="57" rx="9" className="fill-background stroke-primary" strokeWidth="2" />
      <g textAnchor="middle" fill="currentColor">
        <text x="300" y="166" fontSize="12">{clip(data.mean.label, 24)}</text>
        <text x="300" y="188" fontSize="17" fontWeight="700">{clip(data.mean.value, 23)}</text>
        <text x="110" y="261" fontSize="12">{clip(data.lowerPart.label, 26)}</text>
        <text x="110" y="286" fontSize="19" fontWeight="700">{clip(data.lowerPart.value, 23)}</text>
        <text x="110" y="307" fontSize="12">{clip(data.lowerPart.expression, 23)}</text>
        <text x="490" y="261" fontSize="12">{clip(data.higherPart.label, 26)}</text>
        <text x="490" y="286" fontSize="19" fontWeight="700">{clip(data.higherPart.value, 23)}</text>
        <text x="490" y="307" fontSize="12">{clip(data.higherPart.expression, 23)}</text>
      </g>
    </svg>
  </DiagramSurface>;
}

function DeviationView({ data }: { data: Deviation }) {
  return <figure className="my-2 max-w-2xl rounded-lg border bg-background p-3 text-xs">
    <figcaption className="mb-2 font-semibold">{data.title}</figcaption>
    <div className="mb-3 rounded-md border px-3 py-2 text-center">{data.target.label}: <strong>{data.target.value}</strong></div>
    <div className="grid grid-cols-2 gap-3">
      {([{ label: 'Below target', entries: data.below }, { label: 'Above target', entries: data.above }] as const)
        .map(group => <div key={group.label} className="space-y-2">
          <strong>{group.label}</strong>
          {group.entries.map((row, index) => <div key={index} className="rounded-md border p-2">
            <div>{row.label}: {row.value}</div>
            <div>{row.quantity} · Difference {row.deviation}</div>
          </div>)}
        </div>)}
    </div>
  </figure>;
}

function Diagram({ data }: { data: AlligationData }): ReactNode {
  if (data.kind === 'cross') return <CrossSvg data={data} />;
  if (data.kind === 'deviation') return <DeviationView data={data} />;
  return <div className="space-y-3" aria-label={data.title}>
    {data.stages.map((stage, index) => <Fragment key={index}>
      <h4 className="text-xs font-semibold">{stage.label}</h4>
      <CrossSvg data={stage.diagram} />
    </Fragment>)}
  </div>;
}

function RatioAdjustmentSvg({ data }: { data: RatioAdjustmentData }) {
  const id = useId();
  return <DiagramSurface title={data.title} footer={data.operation}>
    <svg viewBox="0 0 640 300" width="100%" role="img"
      className="mx-auto block h-auto w-full max-w-[640px] text-foreground"
      aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{data.title}</title>
      <desc id={`${id}-desc`}>{data.beforeRatio} to {data.afterRatio}: {data.operation}. {data.note}</desc>
      <text x="320" y="25" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="600">{clip(data.title, 60)}</text>
      {([
        { x: 12, label: 'Before', rows: data.before, ratio: data.beforeRatio },
        { x: 432, label: 'After', rows: data.after, ratio: data.afterRatio },
      ] as const).map(group => <g key={group.label}>
        <rect x={group.x} y="44" width="196" height="214" rx="9" className="fill-background stroke-primary" strokeWidth="1.5" />
        <text x={group.x + 98} y="65" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="600">{group.label}</text>
        {group.rows.map((row, i) => <g key={i}>
          <text x={group.x + 98} y={90 + i * 44} textAnchor="middle" fill="currentColor" fontSize="12">
            {clip(row.label, 25)}
          </text>
          <text x={group.x + 98} y={107 + i * 44} textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="600">
            {clip(row.quantity, 25)}
          </text>
        </g>)}
        <text x={group.x + 98} y="242" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="600">
          {group.ratio}
        </text>
      </g>)}
      <line x1="228" y1="152" x2="412" y2="152" stroke="currentColor" strokeWidth="2.4" />
      <path d="M412 152 l-12 -8 v16 z" fill="currentColor" />
      <rect x="238" y="113" width="164" height="76" rx="8" className="fill-background stroke-primary" strokeWidth="1.5" />
      <text x="320" y="133" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600">Operation</text>
      <text x="320" y="155" textAnchor="middle" fill="currentColor" fontSize="11">{clip(data.operation, 29)}</text>
      {data.targetRatio && <text x="320" y="175" textAnchor="middle" fill="currentColor" fontSize="11">
        Target: {clip(data.targetRatio, 20)}
      </text>}
      <text x="320" y="288" textAnchor="middle" fill="currentColor" fontSize="11">{clip(data.note, 95)}</text>
    </svg>
  </DiagramSurface>;
}

export function ExplanationDiagrams({ explanation }: { explanation: string }) {
  const parts = splitAlligationExplanation(explanation);
  if (!parts.length) return <p className="mt-2 text-xs text-muted-foreground">No explanation recorded.</p>;
  return <div className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
    {parts.map((part, i) => part.kind === 'text'
      ? <div className="whitespace-pre-wrap break-words" key={i}>{part.text}</div>
      : part.kind === 'diagram'
        ? <Diagram key={i} data={part.data} />
        : part.kind === 'ratio-adjustment'
          ? <RatioAdjustmentSvg key={i} data={part.data} />
        : <p key={i} role="alert" className="rounded-md border border-destructive/30 p-2 text-destructive">
          Diagram data could not be displayed. Original marker is retained in the editable explanation.
        </p>)}
  </div>;
}
