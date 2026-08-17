import type {
  CanonicalConclusion,
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { ExactVennResultV5 } from "./learner-v5-exact-venn";
import { resolveModelTargetV5 } from "./learner-v5-model-target-remediation";
import type {
  SylLearnerExplanationModeV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";

interface Shape {
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

interface Authority {
  subset: ReadonlySet<string>;
  disjoint: ReadonlySet<string>;
}

export interface ProofWitnessRequirementV5 {
  inside: readonly TermId[];
  outside: readonly TermId[];
  source: "PREMISE" | "TARGET";
}

const POINT_MARGIN = 5;

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
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
  return { ...conclusion, source: "TARGET" };
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

function usesTarget(mode: SylLearnerExplanationModeV5): boolean {
  return new Set<SylLearnerExplanationModeV5>([
    "DIRECT_CHAIN",
    "WITNESS_TRANSFER",
    "DIRECT_CONTRADICTION",
    "COUNTEREXAMPLE",
    "POSSIBILITY_MODEL",
    "POSSIBLE_NOT_DEFINITE",
    "DUAL_MODEL",
  ]).has(mode);
}

export function selectedDiagramTargetV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): Relation | null {
  const mode = presentation.learnerExplanation.mode;
  if (!usesTarget(mode)) return null;
  const canonical = resolveModelTargetV5(question).canonical;
  return mode === "COUNTEREXAMPLE" || mode === "DIRECT_CONTRADICTION"
    ? negatedConclusionRelation(canonical)
    : conclusionRelation(canonical);
}

function collectTerms(question: GeneratedSylQuestionV4, target: Relation | null): readonly TermId[] {
  const result: TermId[] = [];
  const add = (term: TermId) => {
    if (!result.includes(term)) result.push(term);
  };
  question.structuredPrompt.premises.forEach((premise) => {
    add(premise.subject);
    add(premise.predicate);
  });
  if (target) {
    add(target.subject);
    add(target.predicate);
  }
  return result;
}

function buildAuthority(terms: readonly TermId[], relations: readonly Relation[]): Authority {
  const subset = new Set<string>();
  const disjoint = new Set<string>();
  terms.forEach((term) => subset.add(relationKey(term, term)));

  for (const relation of relations) {
    if (relation.form === "ALL") subset.add(relationKey(relation.subject, relation.predicate));
    if (relation.form === "IDENTITY") {
      subset.add(relationKey(relation.subject, relation.predicate));
      subset.add(relationKey(relation.predicate, relation.subject));
    }
    if (relation.form === "NO") disjoint.add(pairKey(relation.subject, relation.predicate));
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const left of terms) {
      for (const middle of terms) {
        if (!subset.has(relationKey(left, middle))) continue;
        for (const right of terms) {
          if (subset.has(relationKey(middle, right)) && !subset.has(relationKey(left, right))) {
            subset.add(relationKey(left, right));
            changed = true;
          }
        }
      }
    }
  }

  changed = true;
  while (changed) {
    changed = false;
    for (const pair of [...disjoint]) {
      const [left, right] = pair.split("|") as [TermId, TermId];
      const leftSubsets = terms.filter((term) => subset.has(relationKey(term, left)));
      const rightSubsets = terms.filter((term) => subset.has(relationKey(term, right)));
      for (const a of leftSubsets) {
        for (const b of rightSubsets) {
          if (a === b) continue;
          const derived = pairKey(a, b);
          if (!disjoint.has(derived)) {
            disjoint.add(derived);
            changed = true;
          }
        }
      }
    }
  }

  return { subset, disjoint };
}

function baseWitness(relation: Relation): ProofWitnessRequirementV5 | null {
  if (relation.form === "SOME") {
    return {
      inside: [relation.subject, relation.predicate],
      outside: [],
      source: relation.source,
    };
  }
  if (relation.form === "SOME_NOT") {
    return {
      inside: [relation.subject],
      outside: [relation.predicate],
      source: relation.source,
    };
  }
  return null;
}

function completeWitness(
  requirement: ProofWitnessRequirementV5,
  terms: readonly TermId[],
  authority: Authority,
): ProofWitnessRequirementV5 | null {
  const inside = new Set(requirement.inside);
  const outside = new Set(requirement.outside);
  let changed = true;

  while (changed) {
    changed = false;

    for (const memberOf of [...inside]) {
      for (const term of terms) {
        if (authority.subset.has(relationKey(memberOf, term)) && !inside.has(term)) {
          inside.add(term);
          changed = true;
        }
        if (authority.disjoint.has(pairKey(memberOf, term)) && !outside.has(term)) {
          outside.add(term);
          changed = true;
        }
      }
    }

    for (const excludedFrom of [...outside]) {
      for (const term of terms) {
        if (authority.subset.has(relationKey(term, excludedFrom)) && !outside.has(term)) {
          outside.add(term);
          changed = true;
        }
      }
    }
  }

  if ([...inside].some((term) => outside.has(term))) return null;

  return {
    inside: terms.filter((term) => inside.has(term)),
    outside: terms.filter((term) => outside.has(term)),
    source: requirement.source,
  };
}

function satisfiesExistentialTarget(
  requirement: ProofWitnessRequirementV5,
  target: Relation,
): boolean {
  if (target.form === "SOME") {
    return requirement.inside.includes(target.subject)
      && requirement.inside.includes(target.predicate);
  }
  if (target.form === "SOME_NOT") {
    return requirement.inside.includes(target.subject)
      && requirement.outside.includes(target.predicate);
  }
  return false;
}

function requirementKey(requirement: ProofWitnessRequirementV5): string {
  return `${requirement.inside.join(",")}|${requirement.outside.join(",")}`;
}

export function expectedProofWitnessesV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): readonly ProofWitnessRequirementV5[] {
  const target = selectedDiagramTargetV5(question, presentation);
  const terms = collectTerms(question, target);
  const premiseRelations = question.structuredPrompt.premises.flatMap(normalizePremise);
  const premiseAuthority = buildAuthority(terms, premiseRelations);
  const modelAuthority = buildAuthority(terms, [...premiseRelations, ...(target ? [target] : [])]);

  const premiseWitnesses = premiseRelations
    .map(baseWitness)
    .filter((value): value is ProofWitnessRequirementV5 => value !== null)
    .map((requirement) => completeWitness(requirement, terms, premiseAuthority))
    .filter((value): value is ProofWitnessRequirementV5 => value !== null);

  const uniquePremiseWitnesses = [...new Map(
    premiseWitnesses.map((requirement) => [requirementKey(requirement), requirement]),
  ).values()];

  if (target?.form === "SOME" || target?.form === "SOME_NOT") {
    const premiseProof = uniquePremiseWitnesses.find((requirement) =>
      satisfiesExistentialTarget(requirement, target));
    if (premiseProof) return [premiseProof];

    const targetBase = baseWitness(target);
    const targetWitness = targetBase
      ? completeWitness(targetBase, terms, modelAuthority)
      : null;
    return targetWitness ? [targetWitness] : [];
  }

  if (target) return [];
  return uniquePremiseWitnesses.slice(0, 2);
}

function parseShapes(svg: string): ReadonlyMap<TermId, Shape> {
  const shapes = new Map<TermId, Shape>();
  for (const match of svg.matchAll(
    /<g data-set="([^"]+)" data-cx="([\d.]+)" data-cy="([\d.]+)" data-r="([\d.]+)">/gu,
  )) {
    shapes.set(match[1], {
      cx: Number(match[2]),
      cy: Number(match[3]),
      r: Number(match[4]),
    });
  }
  return shapes;
}

function inside(point: Point, shape: Shape): boolean {
  return Math.hypot(point.x - shape.cx, point.y - shape.cy) <= shape.r - POINT_MARGIN;
}

function witnessPoint(
  requirement: ProofWitnessRequirementV5,
  shapes: ReadonlyMap<TermId, Shape>,
): Point | null {
  let best: { point: Point; score: number } | null = null;
  for (let y = 34; y <= 186; y += 2) {
    for (let x = 20; x <= 320; x += 2) {
      const point = { x, y };
      if (!requirement.inside.every((term) => {
        const shape = shapes.get(term);
        return Boolean(shape && inside(point, shape));
      })) continue;
      if (!requirement.outside.every((term) => {
        const shape = shapes.get(term);
        return Boolean(shape && !inside(point, shape));
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

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function localizedCaption(
  locale: SylLocale,
  answer: string,
  mode: SylLearnerExplanationModeV5,
  hasWitness: boolean,
): string {
  const counterexample = mode === "COUNTEREXAMPLE" || mode === "DIRECT_CONTRADICTION";
  const possibility = mode === "POSSIBILITY_MODEL"
    || mode === "POSSIBLE_NOT_DEFINITE"
    || mode === "DUAL_MODEL";

  if (locale === "hi-IN") {
    if (counterexample) return `प्रति-उदाहरण: कथन सही रहते हैं, लेकिन “${answer}” असत्य है।`;
    if (possibility) return `एक वैध व्यवस्था जिसमें “${answer}” सत्य है।`;
    return hasWitness
      ? `नीला × कथनों से प्राप्त निर्णायक सदस्य दिखाता है, जिससे “${answer}” निकलता है।`
      : `वृत्तों की स्थिति दिखाती है कि “${answer}” क्यों निकलता है।`;
  }

  if (locale === "pa-IN") {
    if (counterexample) return `ਵਿਰੋਧੀ ਉਦਾਹਰਨ: ਕਥਨ ਸਹੀ ਰਹਿੰਦੇ ਹਨ, ਪਰ “${answer}” ਗਲਤ ਹੈ।`;
    if (possibility) return `ਇੱਕ ਵੈਧ ਬਣਤਰ ਜਿਸ ਵਿੱਚ “${answer}” ਸਹੀ ਹੈ।`;
    return hasWitness
      ? `ਨੀਲਾ × ਕਥਨਾਂ ਤੋਂ ਮਿਲਿਆ ਫੈਸਲਾਕੁਨ ਮੈਂਬਰ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਿਸ ਤੋਂ “${answer}” ਨਿਕਲਦਾ ਹੈ।`
      : `ਗੋਲਾਂ ਦੀ ਸਥਿਤੀ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ “${answer}” ਕਿਉਂ ਨਿਕਲਦਾ ਹੈ।`;
  }

  if (counterexample) return `Counterexample: the statements remain true, but “${answer}” is false.`;
  if (possibility) return `One valid arrangement in which “${answer}” is true.`;
  return hasWitness
    ? `The blue × is the complete premise-derived member showing why “${answer}” follows.`
    : `The circle placement shows why “${answer}” follows.`;
}

function replaceTitleAndDescription(svg: string, caption: string): string {
  const description = `${caption} Only the highlighted premise-derived membership and forced circle relations are decisive.`;
  return svg
    .replace(/(<title\b[^>]*>)[\s\S]*?(<\/title>)/u, `$1${esc(caption)}$2`)
    .replace(/(<desc\b[^>]*>)[\s\S]*?(<\/desc>)/u, `$1${esc(description)}$2`);
}

function witnessSvg(
  requirement: ProofWitnessRequirementV5,
  point: Point,
): string {
  return `<g data-witness="decisive" data-source="${requirement.source}" data-x="${point.x}" data-y="${point.y}" data-inside="${esc(requirement.inside.join(","))}" data-outside="${esc(requirement.outside.join(","))}"><circle cx="${point.x}" cy="${point.y}" r="11" class="witness-halo"/><text x="${point.x}" y="${point.y + 7}" text-anchor="middle" class="witness">×</text></g>`;
}

function omit(
  question: GeneratedSylQuestionV4,
  rendered: ExactVennResultV5,
  detail: string,
): ExactVennResultV5 {
  return {
    ...rendered,
    enabled: false,
    omissionReason: "NO_STABLE_SIMPLE_VENN",
    svg: null,
    caption: null,
    accessibleDescription: null,
    semanticSignature: `syl-v5:exact-venn:omitted:${detail}:${question.qlId}:${question.seed}:${question.locale}`,
  };
}

export function correctExactVennWitnessProofV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  rendered: ExactVennResultV5,
): ExactVennResultV5 {
  if (!rendered.enabled || !rendered.svg) return rendered;

  const requirements = expectedProofWitnessesV5(question, presentation);
  const shapes = parseShapes(rendered.svg);
  const points = requirements.map((requirement) => witnessPoint(requirement, shapes));
  if (points.some((point) => point === null)) {
    return omit(question, rendered, "complete-proof-witness-not-placeable");
  }

  const withoutWitnesses = rendered.svg.replace(
    /\s*<g data-witness="decisive"[\s\S]*?<\/g>/gu,
    "",
  );
  const witnessMarkup = requirements.map((requirement, index) =>
    witnessSvg(requirement, points[index] as Point));
  const caption = localizedCaption(
    question.locale,
    presentation.answer.text,
    presentation.learnerExplanation.mode,
    witnessMarkup.length > 0,
  );
  const svgWithWitnesses = withoutWitnesses.replace(
    /\s*<\/svg>/u,
    `${witnessMarkup.length > 0 ? `\n  ${witnessMarkup.join("\n  ")}` : ""}\n</svg>`,
  );
  const svg = replaceTitleAndDescription(svgWithWitnesses, caption);

  return {
    ...rendered,
    svg,
    caption,
    accessibleDescription: `${caption} Only the highlighted premise-derived membership and forced circle relations are decisive.`,
    semanticSignature: `${rendered.semanticSignature}:proof-witness-v2`,
  };
}
