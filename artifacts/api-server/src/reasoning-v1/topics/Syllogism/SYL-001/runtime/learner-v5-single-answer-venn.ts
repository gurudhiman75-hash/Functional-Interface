import type {
  CanonicalConclusion,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { TermAssignment } from "./localization";
import { resolveModelTargetV5 } from "./learner-v5-model-target-remediation";
import type {
  SylDiagramOmissionReasonV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";

interface CircleShape {
  term: TermId;
  cx: number;
  cy: number;
  r: number;
}

interface Point {
  x: number;
  y: number;
}

type RelationForm = "ALL" | "NO" | "SOME" | "SOME_NOT" | "IDENTITY";

interface Relation {
  form: RelationForm;
  subject: TermId;
  predicate: TermId;
  source: "PREMISE" | "TARGET";
}

interface WitnessRequirement {
  inside: readonly TermId[];
  outside: readonly TermId[];
}

export interface SingleAnswerVennResultV5 {
  enabled: boolean;
  omissionReason: SylDiagramOmissionReasonV5;
  svg: string | null;
  caption: string | null;
  accessibleDescription: string | null;
  semanticSignature: string;
  modelSignature: string | null;
}

const WIDTH = 340;
const HEIGHT = 210;
const EPSILON = 2;

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
}

function labelFor(term: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[term]?.labels[locale] ?? term;
}

function normalizePremise(premise: SurfacePremise): readonly Relation[] {
  switch (premise.form) {
    case "ALL":
    case "ARE_ONLY":
      return [{ form: "ALL", subject: premise.subject, predicate: premise.predicate, source: "PREMISE" }];
    case "ONLY":
      return [{ form: "ALL", subject: premise.predicate, predicate: premise.subject, source: "PREMISE" }];
    case "IDENTITY":
      return [{ form: "IDENTITY", subject: premise.subject, predicate: premise.predicate, source: "PREMISE" }];
    case "NO":
    case "SOME":
    case "SOME_NOT":
      return [{ form: premise.form, subject: premise.subject, predicate: premise.predicate, source: "PREMISE" }];
    case "A_FEW":
      return [{ form: "SOME", subject: premise.subject, predicate: premise.predicate, source: "PREMISE" }];
    case "NOT_ALL":
      return [{ form: "SOME_NOT", subject: premise.subject, predicate: premise.predicate, source: "PREMISE" }];
    case "ONLY_A_FEW":
      return [
        { form: "SOME", subject: premise.subject, predicate: premise.predicate, source: "PREMISE" },
        { form: "SOME_NOT", subject: premise.subject, predicate: premise.predicate, source: "PREMISE" },
      ];
    case "FEW":
      return [];
  }
}

function conclusionRelation(conclusion: CanonicalConclusion): Relation {
  return {
    form: conclusion.form,
    subject: conclusion.subject,
    predicate: conclusion.predicate,
    source: "TARGET",
  };
}

function negatedConclusionRelation(conclusion: CanonicalConclusion): Relation {
  switch (conclusion.form) {
    case "ALL":
      return { form: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate, source: "TARGET" };
    case "NO":
      return { form: "SOME", subject: conclusion.subject, predicate: conclusion.predicate, source: "TARGET" };
    case "SOME":
      return { form: "NO", subject: conclusion.subject, predicate: conclusion.predicate, source: "TARGET" };
    case "SOME_NOT":
      return { form: "ALL", subject: conclusion.subject, predicate: conclusion.predicate, source: "TARGET" };
  }
}

function shouldUseTargetRelation(presentation: SylLearnerPresentationV5): boolean {
  return new Set([
    "DIRECT_CHAIN",
    "WITNESS_TRANSFER",
    "DIRECT_CONTRADICTION",
    "COUNTEREXAMPLE",
    "POSSIBILITY_MODEL",
    "POSSIBLE_NOT_DEFINITE",
    "DUAL_MODEL",
  ]).has(presentation.learnerExplanation.mode);
}

function targetRelation(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): Relation | null {
  if (!shouldUseTargetRelation(presentation)) return null;
  const target = resolveModelTargetV5(question).canonical;
  if (
    presentation.learnerExplanation.mode === "COUNTEREXAMPLE"
    || presentation.learnerExplanation.mode === "DIRECT_CONTRADICTION"
  ) {
    return negatedConclusionRelation(target);
  }
  return conclusionRelation(target);
}

function collectTerms(
  question: GeneratedSylQuestionV4,
  target: Relation | null,
): readonly TermId[] {
  const result: TermId[] = [];
  const add = (term: TermId) => {
    if (!result.includes(term)) result.push(term);
  };
  for (const premise of question.structuredPrompt.premises) {
    add(premise.subject);
    add(premise.predicate);
  }
  if (target) {
    add(target.subject);
    add(target.predicate);
  }
  return result;
}

function permutations<T>(values: readonly T[]): readonly (readonly T[])[] {
  if (values.length <= 1) return [values];
  const result: T[][] = [];
  values.forEach((value, index) => {
    const remaining = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const tail of permutations(remaining)) result.push([value, ...tail]);
  });
  return result;
}

function baseTemplates(count: number): readonly (readonly Omit<CircleShape, "term">[])[] {
  if (count === 1) {
    return [[{ cx: 170, cy: 108, r: 72 }]];
  }
  if (count === 2) {
    return [
      [{ cx: 170, cy: 108, r: 76 }, { cx: 170, cy: 108, r: 76 }],
      [{ cx: 170, cy: 108, r: 78 }, { cx: 170, cy: 112, r: 44 }],
      [{ cx: 132, cy: 108, r: 62 }, { cx: 208, cy: 108, r: 62 }],
      [{ cx: 95, cy: 108, r: 56 }, { cx: 245, cy: 108, r: 56 }],
    ];
  }
  return [
    [
      { cx: 170, cy: 108, r: 88 },
      { cx: 170, cy: 112, r: 61 },
      { cx: 170, cy: 116, r: 34 },
    ],
    [
      { cx: 170, cy: 108, r: 90 },
      { cx: 132, cy: 119, r: 31 },
      { cx: 208, cy: 119, r: 31 },
    ],
    [
      { cx: 170, cy: 108, r: 90 },
      { cx: 151, cy: 118, r: 42 },
      { cx: 189, cy: 118, r: 42 },
    ],
    [
      { cx: 105, cy: 108, r: 72 },
      { cx: 105, cy: 113, r: 41 },
      { cx: 258, cy: 108, r: 54 },
    ],
    [
      { cx: 132, cy: 108, r: 78 },
      { cx: 101, cy: 111, r: 34 },
      { cx: 220, cy: 108, r: 57 },
    ],
    [
      { cx: 87, cy: 108, r: 54 },
      { cx: 151, cy: 108, r: 54 },
      { cx: 270, cy: 108, r: 48 },
    ],
    [
      { cx: 151, cy: 108, r: 55 },
      { cx: 211, cy: 108, r: 55 },
      { cx: 78, cy: 108, r: 55 },
    ],
    [
      { cx: 126, cy: 91, r: 62 },
      { cx: 214, cy: 91, r: 62 },
      { cx: 170, cy: 143, r: 62 },
    ],
    [
      { cx: 61, cy: 108, r: 46 },
      { cx: 170, cy: 108, r: 46 },
      { cx: 279, cy: 108, r: 46 },
    ],
    [
      { cx: 104, cy: 108, r: 62 },
      { cx: 104, cy: 108, r: 62 },
      { cx: 250, cy: 108, r: 54 },
    ],
    [
      { cx: 139, cy: 108, r: 62 },
      { cx: 139, cy: 108, r: 62 },
      { cx: 211, cy: 108, r: 62 },
    ],
    [
      { cx: 129, cy: 108, r: 70 },
      { cx: 211, cy: 108, r: 70 },
      { cx: 170, cy: 114, r: 31 },
    ],
  ];
}

function distance(left: CircleShape, right: CircleShape): number {
  return Math.hypot(left.cx - right.cx, left.cy - right.cy);
}

function contains(outer: CircleShape, inner: CircleShape): boolean {
  return distance(outer, inner) + inner.r <= outer.r + EPSILON;
}

function disjoint(left: CircleShape, right: CircleShape): boolean {
  return distance(left, right) >= left.r + right.r + 3;
}

function hasCommonArea(left: CircleShape, right: CircleShape): boolean {
  return distance(left, right) < left.r + right.r - 5;
}

function relationSatisfied(relation: Relation, shapes: ReadonlyMap<TermId, CircleShape>): boolean {
  const subject = shapes.get(relation.subject);
  const predicate = shapes.get(relation.predicate);
  if (!subject || !predicate) return false;
  switch (relation.form) {
    case "ALL":
      return contains(predicate, subject);
    case "IDENTITY":
      return contains(subject, predicate) && contains(predicate, subject);
    case "NO":
      return disjoint(subject, predicate);
    case "SOME":
      return hasCommonArea(subject, predicate);
    case "SOME_NOT":
      return !contains(predicate, subject);
  }
}

function pointInside(point: Point, shape: CircleShape): boolean {
  return Math.hypot(point.x - shape.cx, point.y - shape.cy) <= shape.r - 4;
}

function witnessPoint(
  requirement: WitnessRequirement,
  shapes: ReadonlyMap<TermId, CircleShape>,
): Point | null {
  let best: { point: Point; score: number } | null = null;
  for (let y = 34; y <= 184; y += 4) {
    for (let x = 24; x <= 316; x += 4) {
      const point = { x, y };
      if (!requirement.inside.every((term) => {
        const shape = shapes.get(term);
        return Boolean(shape && pointInside(point, shape));
      })) continue;
      if (!requirement.outside.every((term) => {
        const shape = shapes.get(term);
        return Boolean(shape && !pointInside(point, shape));
      })) continue;

      const margins = [
        ...requirement.inside.map((term) => {
          const shape = shapes.get(term)!;
          return shape.r - Math.hypot(x - shape.cx, y - shape.cy);
        }),
        ...requirement.outside.map((term) => {
          const shape = shapes.get(term)!;
          return Math.hypot(x - shape.cx, y - shape.cy) - shape.r;
        }),
      ];
      const score = margins.length > 0 ? Math.min(...margins) : 0;
      if (!best || score > best.score) best = { point, score };
    }
  }
  return best?.point ?? null;
}

function witnessRequirements(relations: readonly Relation[]): readonly WitnessRequirement[] {
  const targetRelations = relations.filter((relation) => relation.source === "TARGET");
  const source = targetRelations.length > 0
    ? targetRelations
    : relations.filter((relation) => relation.form === "SOME" || relation.form === "SOME_NOT");
  const requirements: WitnessRequirement[] = [];
  for (const relation of source) {
    if (relation.form === "SOME") {
      requirements.push({ inside: [relation.subject, relation.predicate], outside: [] });
    } else if (relation.form === "SOME_NOT") {
      requirements.push({ inside: [relation.subject], outside: [relation.predicate] });
    }
    if (requirements.length === 2) break;
  }
  return requirements;
}

function unforcedGeometryPenalty(
  terms: readonly TermId[],
  relations: readonly Relation[],
  shapes: ReadonlyMap<TermId, CircleShape>,
): number {
  const forcedPairs = new Set(relations.map((relation) => pairKey(relation.subject, relation.predicate)));
  let penalty = 0;
  for (let left = 0; left < terms.length; left += 1) {
    for (let right = left + 1; right < terms.length; right += 1) {
      if (forcedPairs.has(pairKey(terms[left], terms[right]))) continue;
      const a = shapes.get(terms[left])!;
      const b = shapes.get(terms[right])!;
      if (contains(a, b) || contains(b, a)) penalty += 8;
      else if (disjoint(a, b)) penalty += 5;
      else penalty += 1;
    }
  }
  return penalty;
}

function selectLayout(
  terms: readonly TermId[],
  relations: readonly Relation[],
  requirements: readonly WitnessRequirement[],
): { shapes: ReadonlyMap<TermId, CircleShape>; witnesses: readonly Point[] } | null {
  const candidates: Array<{
    shapes: ReadonlyMap<TermId, CircleShape>;
    witnesses: readonly Point[];
    score: number;
  }> = [];
  for (const template of baseTemplates(terms.length)) {
    for (const order of permutations(terms)) {
      const map = new Map<TermId, CircleShape>();
      order.forEach((term, index) => map.set(term, { term, ...template[index] }));
      if (!relations.every((relation) => relationSatisfied(relation, map))) continue;
      const witnesses = requirements.map((requirement) => witnessPoint(requirement, map));
      if (witnesses.some((point) => point === null)) continue;
      candidates.push({
        shapes: map,
        witnesses: witnesses as readonly Point[],
        score: unforcedGeometryPenalty(terms, relations, map),
      });
    }
  }
  candidates.sort((left, right) => left.score - right.score);
  return candidates[0] ?? null;
}

function splitLabel(value: string): readonly string[] {
  const characters = [...value];
  if (characters.length <= 13) return [value];
  const midpoint = Math.ceil(characters.length / 2);
  return [characters.slice(0, midpoint).join(""), characters.slice(midpoint).join("")];
}

function renderLabel(shape: CircleShape, text: string, duplicateIndex: number): string {
  const lines = splitLabel(text);
  const baseY = Math.max(24, shape.cy - shape.r + 17 + duplicateIndex * 18);
  const tspans = lines.map((line, index) =>
    `<tspan x="${shape.cx}" dy="${index === 0 ? 0 : 14}">${esc(line)}</tspan>`).join("");
  return `<text x="${shape.cx}" y="${baseY}" text-anchor="middle" class="set-label">${tspans}</text>`;
}

function localizedCaption(
  locale: SylLocale,
  answer: string,
  mode: SylLearnerPresentationV5["learnerExplanation"]["mode"],
  hasWitness: boolean,
): string {
  const counterexample = mode === "COUNTEREXAMPLE" || mode === "DIRECT_CONTRADICTION";
  const possibility = mode === "POSSIBILITY_MODEL" || mode === "POSSIBLE_NOT_DEFINITE" || mode === "DUAL_MODEL";
  if (locale === "hi-IN") {
    if (counterexample) return `प्रति-उदाहरण: कथन सही रहते हैं, लेकिन “${answer}” असत्य है।`;
    if (possibility) return `एक वैध व्यवस्था जिसमें “${answer}” सत्य है।`;
    return hasWitness
      ? `नीला × वह निर्णायक सदस्य दिखाता है जिससे “${answer}” निकलता है।`
      : `वृत्तों की स्थिति दिखाती है कि “${answer}” क्यों निकलता है।`;
  }
  if (locale === "pa-IN") {
    if (counterexample) return `ਵਿਰੋਧੀ ਉਦਾਹਰਨ: ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ, ਪਰ “${answer}” ਗਲਤ ਹੈ।`;
    if (possibility) return `ਇੱਕ ਵੈਧ ਬਣਤਰ ਜਿਸ ਵਿੱਚ “${answer}” ਸਹੀ ਹੈ।`;
    return hasWitness
      ? `ਨੀਲਾ × ਉਹ ਫੈਸਲਾਕੁਨ ਵਸਤੂ ਦਿਖਾਉਂਦਾ ਹੈ ਜਿਸ ਤੋਂ “${answer}” ਨਿਕਲਦਾ ਹੈ।`
      : `ਗੋਲਾਂ ਦੀ ਸਥਿਤੀ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ “${answer}” ਕਿਉਂ ਨਿਕਲਦਾ ਹੈ।`;
  }
  if (counterexample) return `Counterexample: the statements remain true, but “${answer}” is false.`;
  if (possibility) return `One valid arrangement in which “${answer}” is true.`;
  return hasWitness
    ? `The blue × is the decisive member showing why “${answer}” follows.`
    : `The circle placement shows why “${answer}” follows.`;
}

function renderSvg(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
  terms: readonly TermId[],
  layout: { shapes: ReadonlyMap<TermId, CircleShape>; witnesses: readonly Point[] },
  requirements: readonly WitnessRequirement[],
): { svg: string; caption: string; description: string } {
  const id = `${question.qlId}-${question.seed}-${question.locale}`.replace(/[^a-zA-Z0-9_-]/gu, "-");
  const answer = presentation.answer.text;
  const caption = localizedCaption(
    question.locale,
    answer,
    presentation.learnerExplanation.mode,
    layout.witnesses.length > 0,
  );
  const duplicateCounts = new Map<string, number>();
  const circles = terms.map((term, index) => {
    const shape = layout.shapes.get(term)!;
    const geometryKey = `${shape.cx}:${shape.cy}:${shape.r}`;
    const duplicateIndex = duplicateCounts.get(geometryKey) ?? 0;
    duplicateCounts.set(geometryKey, duplicateIndex + 1);
    const dash = duplicateIndex > 0 ? ' stroke-dasharray="6 4"' : "";
    return `<g data-set="${esc(term)}" data-cx="${shape.cx}" data-cy="${shape.cy}" data-r="${shape.r}">
      <circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" class="set-circle set-${index + 1}"${dash}/>
      ${renderLabel(shape, labelFor(term, question.locale, assignment), duplicateIndex)}
    </g>`;
  }).join("\n");
  const witnesses = layout.witnesses.map((point, index) => {
    const requirement = requirements[index];
    return `<g data-witness="decisive" data-x="${point.x}" data-y="${point.y}" data-inside="${esc(requirement.inside.join(","))}" data-outside="${esc(requirement.outside.join(","))}">
      <circle cx="${point.x}" cy="${point.y}" r="11" class="witness-halo"/>
      <text x="${point.x}" y="${point.y + 7}" text-anchor="middle" class="witness">×</text>
    </g>`;
  }).join("\n");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="100%" role="img" lang="${question.locale}" aria-labelledby="${id}-title ${id}-desc" data-diagram-count="1" data-learner-safe-venn="true" class="examtree-venn-svg">
  <title id="${id}-title">${esc(caption)}</title>
  <desc id="${id}-desc">${esc(caption)} One valid arrangement is shown; unstated relations must not be treated as additional conclusions.</desc>
  <style>
    .set-circle{fill:#f8fafc;fill-opacity:.55;stroke:#334155;stroke-width:2.2}
    .set-2{stroke:#475569}.set-3{stroke:#64748b}
    .set-label{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:13px;font-weight:700;fill:#0f172a}
    .witness-halo{fill:#dbeafe;stroke:#2563eb;stroke-width:1.5}
    .witness{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:22px;font-weight:800;fill:#1d4ed8}
  </style>
  ${circles}
  ${witnesses}
</svg>`;
  return {
    svg,
    caption,
    description: `${caption} One valid arrangement is shown; only the highlighted witness or forced boundary relation is decisive.`,
  };
}

export function renderSingleAnswerVennV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
): SingleAnswerVennResultV5 {
  const premises = question.structuredPrompt.premises;
  if (premises.some((premise) => premise.form === "FEW")) {
    return {
      enabled: false,
      omissionReason: "NO_STABLE_SIMPLE_VENN",
      svg: null,
      caption: null,
      accessibleDescription: null,
      semanticSignature: `syl-v5:learner-safe-venn:omitted:plain-few:${question.qlId}:${question.seed}:${question.locale}`,
      modelSignature: null,
    };
  }

  const target = targetRelation(question, presentation);
  const terms = collectTerms(question, target);
  if (terms.length > 3) {
    return {
      enabled: false,
      omissionReason: "MORE_THAN_THREE_TERMS",
      svg: null,
      caption: null,
      accessibleDescription: null,
      semanticSignature: `syl-v5:learner-safe-venn:omitted:more-than-three-terms:${question.qlId}:${question.seed}:${question.locale}`,
      modelSignature: null,
    };
  }

  const relations = [
    ...premises.flatMap(normalizePremise),
    ...(target ? [target] : []),
  ];
  const requirements = witnessRequirements(relations);
  const layout = selectLayout(terms, relations, requirements);
  if (!layout) {
    return {
      enabled: false,
      omissionReason: "NO_STABLE_SIMPLE_VENN",
      svg: null,
      caption: null,
      accessibleDescription: null,
      semanticSignature: `syl-v5:learner-safe-venn:omitted:no-stable-template:${question.qlId}:${question.seed}:${question.locale}`,
      modelSignature: null,
    };
  }

  const rendered = renderSvg(question, presentation, assignment, terms, layout, requirements);
  return {
    enabled: true,
    omissionReason: null,
    svg: rendered.svg,
    caption: rendered.caption,
    accessibleDescription: rendered.description,
    semanticSignature: `syl-v5:learner-safe-venn:enabled:${question.qlId}:${question.seed}:${question.locale}`,
    modelSignature: null,
  };
}
