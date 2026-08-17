import type {
  SurfacePremise,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { ExactVennResultV5 } from "./learner-v5-exact-venn";
import type {
  SylLearnerExplanationModeV5,
  SylLearnerPresentationV5,
} from "./learner-v5-types";
import {
  selectedDiagramTargetV5,
  type ProofWitnessRequirementV5,
} from "./learner-v5-witness-proof";

interface Shape {
  cx: number;
  cy: number;
  r: number;
}

interface Point {
  x: number;
  y: number;
}

interface Authority {
  subset: ReadonlySet<string>;
  disjoint: ReadonlySet<string>;
}

const POINT_MARGIN = 5;

function relationKey(subject: TermId, predicate: TermId): string {
  return `${subject}>${predicate}`;
}

function pairKey(left: TermId, right: TermId): string {
  return [left, right].sort().join("|");
}

function collectTerms(question: GeneratedSylQuestionV4): readonly TermId[] {
  return [...new Set(question.structuredPrompt.premises.flatMap((premise) => [
    premise.subject,
    premise.predicate,
  ]))] as TermId[];
}

function buildPremiseAuthority(
  terms: readonly TermId[],
  premises: readonly SurfacePremise[],
): Authority {
  const subset = new Set<string>();
  const disjoint = new Set<string>();
  terms.forEach((term) => subset.add(relationKey(term, term)));

  for (const premise of premises) {
    if (premise.form === "ALL" || premise.form === "ARE_ONLY") {
      subset.add(relationKey(premise.subject, premise.predicate));
    } else if (premise.form === "ONLY") {
      subset.add(relationKey(premise.predicate, premise.subject));
    } else if (premise.form === "IDENTITY") {
      subset.add(relationKey(premise.subject, premise.predicate));
      subset.add(relationKey(premise.predicate, premise.subject));
    } else if (premise.form === "NO") {
      disjoint.add(pairKey(premise.subject, premise.predicate));
    }
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

function rawPremiseWitnesses(
  premise: SurfacePremise,
): readonly ProofWitnessRequirementV5[] {
  switch (premise.form) {
    case "SOME":
    case "A_FEW":
      return [{
        inside: [premise.subject, premise.predicate],
        outside: [],
        source: "PREMISE",
      }];
    case "SOME_NOT":
    case "NOT_ALL":
      return [{
        inside: [premise.subject],
        outside: [premise.predicate],
        source: "PREMISE",
      }];
    case "ONLY_A_FEW":
      return [
        {
          inside: [premise.subject, premise.predicate],
          outside: [],
          source: "PREMISE",
        },
        {
          inside: [premise.subject],
          outside: [premise.predicate],
          source: "PREMISE",
        },
      ];
    default:
      return [];
  }
}

function completeRequirement(
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

function targetRequirement(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): ProofWitnessRequirementV5 | null {
  const target = selectedDiagramTargetV5(question, presentation);
  if (target?.form === "SOME") {
    return {
      inside: [target.subject, target.predicate],
      outside: [],
      source: "TARGET",
    };
  }
  if (target?.form === "SOME_NOT") {
    return {
      inside: [target.subject],
      outside: [target.predicate],
      source: "TARGET",
    };
  }
  return null;
}

function satisfies(
  candidate: ProofWitnessRequirementV5,
  requirement: ProofWitnessRequirementV5,
): boolean {
  return requirement.inside.every((term) => candidate.inside.includes(term))
    && requirement.outside.every((term) => candidate.outside.includes(term));
}

function key(requirement: ProofWitnessRequirementV5): string {
  return `${requirement.source}:${requirement.inside.join(",")}|${requirement.outside.join(",")}`;
}

export function expectedCompleteExistentialWitnessesV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
): readonly ProofWitnessRequirementV5[] | null {
  const terms = collectTerms(question);
  const authority = buildPremiseAuthority(terms, question.structuredPrompt.premises);
  const premiseRequirements = question.structuredPrompt.premises
    .flatMap(rawPremiseWitnesses)
    .map((requirement) => completeRequirement(requirement, terms, authority))
    .filter((value): value is ProofWitnessRequirementV5 => value !== null);

  const distinctPremiseRequirements = [...new Map(
    premiseRequirements.map((requirement) => [key(requirement), requirement]),
  ).values()];

  const target = targetRequirement(question, presentation);
  const selected = [...distinctPremiseRequirements];
  if (target && !selected.some((candidate) => satisfies(candidate, target))) {
    selected.push(target);
  }

  return selected.length <= 2 ? selected : null;
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
  occupied: readonly Point[],
): Point | null {
  let best: { point: Point; score: number } | null = null;
  for (let y = 34; y <= 186; y += 2) {
    for (let x = 20; x <= 320; x += 2) {
      const point = { x, y };
      if (occupied.some((other) => Math.hypot(x - other.x, y - other.y) < 28)) continue;
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

function witnessMarkup(
  requirement: ProofWitnessRequirementV5,
  point: Point,
): string {
  return `<g data-witness="decisive" data-source="${requirement.source}" data-x="${point.x}" data-y="${point.y}" data-inside="${esc(requirement.inside.join(","))}" data-outside="${esc(requirement.outside.join(","))}"><circle cx="${point.x}" cy="${point.y}" r="11" class="witness-halo"/><text x="${point.x}" y="${point.y + 7}" text-anchor="middle" class="witness">×</text></g>`;
}

function localizedCaption(
  locale: SylLocale,
  answer: string,
  mode: SylLearnerExplanationModeV5,
  count: number,
): string {
  const counterexample = mode === "COUNTEREXAMPLE" || mode === "DIRECT_CONTRADICTION";
  const possibility = mode === "POSSIBILITY_MODEL"
    || mode === "POSSIBLE_NOT_DEFINITE"
    || mode === "DUAL_MODEL";

  if (locale === "hi-IN") {
    if (counterexample) return `× चिह्न कथनों के आवश्यक सदस्य और वह प्रति-उदाहरण दिखाते हैं जिसमें “${answer}” असत्य है।`;
    if (possibility) return `× चिह्न कथनों के आवश्यक सदस्य और वह वैध व्यवस्था दिखाते हैं जिसमें “${answer}” सत्य है।`;
    if (count > 1) return `नीले × चिह्न कथनों के सभी आवश्यक सदस्यों को दिखाते हैं, जिनसे “${answer}” निकलता है।`;
    if (count === 1) return `नीला × कथनों से प्राप्त निर्णायक सदस्य दिखाता है, जिससे “${answer}” निकलता है।`;
    return `वृत्तों की स्थिति दिखाती है कि “${answer}” क्यों निकलता है।`;
  }

  if (locale === "pa-IN") {
    if (counterexample) return `× ਨਿਸ਼ਾਨ ਕਥਨਾਂ ਦੇ ਲਾਜ਼ਮੀ ਮੈਂਬਰ ਅਤੇ ਉਹ ਵਿਰੋਧੀ ਉਦਾਹਰਨ ਦਿਖਾਉਂਦੇ ਹਨ ਜਿਸ ਵਿੱਚ “${answer}” ਗਲਤ ਹੈ।`;
    if (possibility) return `× ਨਿਸ਼ਾਨ ਕਥਨਾਂ ਦੇ ਲਾਜ਼ਮੀ ਮੈਂਬਰ ਅਤੇ ਉਹ ਵੈਧ ਬਣਤਰ ਦਿਖਾਉਂਦੇ ਹਨ ਜਿਸ ਵਿੱਚ “${answer}” ਸਹੀ ਹੈ।`;
    if (count > 1) return `ਨੀਲੇ × ਨਿਸ਼ਾਨ ਕਥਨਾਂ ਦੇ ਸਾਰੇ ਲਾਜ਼ਮੀ ਮੈਂਬਰ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਿਨ੍ਹਾਂ ਤੋਂ “${answer}” ਨਿਕਲਦਾ ਹੈ।`;
    if (count === 1) return `ਨੀਲਾ × ਕਥਨਾਂ ਤੋਂ ਮਿਲਿਆ ਫੈਸਲਾਕੁਨ ਮੈਂਬਰ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਿਸ ਤੋਂ “${answer}” ਨਿਕਲਦਾ ਹੈ।`;
    return `ਗੋਲਾਂ ਦੀ ਸਥਿਤੀ ਦਿਖਾਉਂਦੀ ਹੈ ਕਿ “${answer}” ਕਿਉਂ ਨਿਕਲਦਾ ਹੈ।`;
  }

  if (counterexample) return `The × marks show every required premise witness and the counterexample in which “${answer}” is false.`;
  if (possibility) return `The × marks show every required premise witness and a valid arrangement in which “${answer}” is true.`;
  if (count > 1) return `The blue × marks show all required premise members establishing why “${answer}” follows.`;
  if (count === 1) return `The blue × is the complete premise-derived member showing why “${answer}” follows.`;
  return `The circle placement shows why “${answer}” follows.`;
}

function replaceTitleAndDescription(svg: string, caption: string): string {
  const description = `${caption} Every existential premise is represented; only forced relations are used.`;
  return svg
    .replace(/(<title\b[^>]*>)[\s\S]*?(<\/title>)/u, `$1${esc(caption)}$2`)
    .replace(/(<desc\b[^>]*>)[\s\S]*?(<\/desc>)/u, `$1${esc(description)}$2`);
}

function omitted(
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

export function enforceExistentialCompletenessV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  rendered: ExactVennResultV5,
): ExactVennResultV5 {
  if (!rendered.enabled || !rendered.svg) return rendered;
  const requirements = expectedCompleteExistentialWitnessesV5(question, presentation);
  if (!requirements) return omitted(question, rendered, "more-than-two-distinct-existential-witnesses");

  const shapes = parseShapes(rendered.svg);
  const points: Point[] = [];
  for (const requirement of requirements) {
    const point = witnessPoint(requirement, shapes, points);
    if (!point) return omitted(question, rendered, "existential-witness-not-placeable");
    points.push(point);
  }

  const withoutWitnesses = rendered.svg.replace(
    /\s*<g data-witness="decisive"[\s\S]*?<\/g>/gu,
    "",
  );
  const marks = requirements.map((requirement, index) =>
    witnessMarkup(requirement, points[index]));
  const caption = localizedCaption(
    question.locale,
    presentation.answer.text,
    presentation.learnerExplanation.mode,
    marks.length,
  );
  const svgWithMarks = withoutWitnesses.replace(
    /\s*<\/svg>/u,
    `${marks.length > 0 ? `\n  ${marks.join("\n  ")}` : ""}\n</svg>`,
  );
  const svg = replaceTitleAndDescription(svgWithMarks, caption);

  return {
    ...rendered,
    svg,
    caption,
    accessibleDescription: `${caption} Every existential premise is represented; only forced relations are used.`,
    semanticSignature: `${rendered.semanticSignature}:existential-complete-v3`,
  };
}
