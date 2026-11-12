import { Fragment, useId, type ReactNode } from 'react';

/**
 * Lightweight, text-only explanation diagram support for existing MAL-001
 * markers. No images, HTML injection, external fonts, or network requests.
 * The raw explanation stays untouched for editing/persistence.
 */
const ALLIGATION_MARKER = /\[\[EXAMTREE_ALLIGATION_SVG_V1:([A-Za-z0-9_-]+)\]\]/g;
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
export type AlligationData = Cross | Deviation | Sequence;
export type ExplanationPart =
  | { kind: 'text'; text: string }
  | { kind: 'diagram'; data: AlligationData }
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

export function decodeAlligationMarker(encoded: string): AlligationData | null {
  if (!encoded || encoded.length > MAX_MARKER_LENGTH) return null;
  try {
    const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/')
      .padEnd(Math.ceil(encoded.length / 4) * 4, '='));
    const utf8 = Uint8Array.from(binary, char => char.charCodeAt(0));
    const data: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(utf8));
    return isAlligationData(data) ? data : null;
  } catch {
    return null;
  }
}

export function splitAlligationExplanation(explanation: string): ExplanationPart[] {
  const parts: ExplanationPart[] = [];
  let start = 0;
  for (const match of explanation.matchAll(ALLIGATION_MARKER)) {
    const at = match.index ?? 0;
    if (at > start) parts.push({ kind: 'text', text: explanation.slice(start, at) });
    const diagram = decodeAlligationMarker(match[1] ?? '');
    parts.push(diagram ? { kind: 'diagram', data: diagram } : { kind: 'invalid-diagram' });
    start = at + match[0].length;
  }
  if (start < explanation.length) parts.push({ kind: 'text', text: explanation.slice(start) });
  return parts;
}

function clip(text: string, max = 28) {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function CrossSvg({ data }: { data: Cross }) {
  const id = useId();
  const description = `${data.lower.label}: ${data.lower.value}; ${data.higher.label}: ${data.higher.value}; ${data.mean.label}: ${data.mean.value}; differences ${data.lowerPart.value} and ${data.higherPart.value}`;
  return <figure className="my-2 max-w-2xl rounded-lg border bg-background p-2">
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
    {data.rangePartition && <figcaption className="mt-1 border-t pt-2 text-xs leading-relaxed">
      Quantity ratio: {data.rangePartition.quantityRatio} · Total parts: {data.rangePartition.totalParts}
      · Price gap: {data.rangePartition.priceGap} · Value per part: {data.rangePartition.valuePerPart}
    </figcaption>}
  </figure>;
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

export function ExplanationDiagrams({ explanation }: { explanation: string }) {
  const parts = splitAlligationExplanation(explanation);
  if (!parts.length) return <p className="mt-2 text-xs text-muted-foreground">No explanation recorded.</p>;
  return <div className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
    {parts.map((part, i) => part.kind === 'text'
      ? <div className="whitespace-pre-wrap break-words" key={i}>{part.text}</div>
      : part.kind === 'diagram'
        ? <Diagram key={i} data={part.data} />
        : <p key={i} role="alert" className="rounded-md border border-destructive/30 p-2 text-destructive">
          Diagram data could not be displayed. Original marker is retained in the editable explanation.
        </p>)}
  </div>;
}
