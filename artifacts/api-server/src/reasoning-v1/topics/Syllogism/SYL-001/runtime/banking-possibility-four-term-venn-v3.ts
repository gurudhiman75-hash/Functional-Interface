import type { TermId } from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import { exactVennHasUnauthorisedContainmentDirectionV5 } from "./learner-v5-directional-containment-safety";
import type { ExactVennResultV5 } from "./learner-v5-exact-venn";
import { exactVennAddsUnstatedStrongRelationV5 } from "./learner-v5-exact-venn-safety";
import { enforceExistentialCompletenessV5 } from "./learner-v5-existential-completeness";
import type { SylLearnerPresentationV5 } from "./learner-v5-types";
import { correctExactVennWitnessProofV5 } from "./learner-v5-witness-proof";
import { finalizeWitnessClosureV5 } from "./learner-v5-witness-closure-finalizer";
import type { TermAssignment } from "./localization";

interface Shape {
  term: TermId;
  cx: number;
  cy: number;
  r: number;
  labelY: number;
}

interface Core009Roles {
  a: TermId;
  b: TermId;
  c: TermId;
  d: TermId;
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function splitLabel(value: string): readonly string[] {
  const characters = [...value];
  if (characters.length <= 13) return [value];
  const midpoint = Math.ceil(characters.length / 2);
  return [characters.slice(0, midpoint).join(""), characters.slice(midpoint).join("")];
}

function omitted(question: GeneratedSylQuestionV4, detail: string): ExactVennResultV5 {
  return {
    enabled: false,
    omissionReason: "NO_STABLE_SIMPLE_VENN",
    svg: null,
    caption: null,
    accessibleDescription: null,
    semanticSignature: `syl-v5:banking-four-term-omitted:${detail}:${question.seed}:${question.locale}`,
    modelSignature: null,
  };
}

function resolveCore009Roles(question: GeneratedSylQuestionV4): Core009Roles | null {
  if (question.scenarioId !== "SYL-SC-CORE-009") return null;
  const premises = question.structuredPrompt.premises;
  const no = premises.find((premise) => premise.form === "NO");
  const some = premises.find((premise) => premise.form === "SOME");
  const all = premises.find((premise) => premise.form === "ALL");
  if (!no || !some || !all) return null;

  const c = some.subject;
  const a = some.predicate;
  if (all.subject !== c) return null;
  const d = all.predicate;
  const b = no.subject === a
    ? no.predicate
    : no.predicate === a
      ? no.subject
      : null;
  if (!b) return null;

  if (new Set([a, b, c, d]).size !== 4) return null;
  return { a, b, c, d };
}

function buildShapes(roles: Core009Roles): ReadonlyMap<TermId, Shape> {
  // Exam-style four-term arrangement for:
  //   No A are B.
  //   Some C are A.
  //   All C are D.
  // A and B are disjoint. C sits inside D but straddles both A and B so the
  // unstated C-B relation stays open. D also properly overlaps A and B, keeping
  // A-D and B-D open. The witness pass later places × in C∩A, hence also in D.
  return new Map<TermId, Shape>([
    [roles.a, { term: roles.a, cx: 95, cy: 112, r: 55, labelY: 74 }],
    [roles.b, { term: roles.b, cx: 245, cy: 112, r: 55, labelY: 74 }],
    [roles.c, { term: roles.c, cx: 170, cy: 122, r: 58, labelY: 84 }],
    [roles.d, { term: roles.d, cx: 170, cy: 104, r: 84, labelY: 40 }],
  ]);
}

function renderRaw(
  question: GeneratedSylQuestionV4,
  assignment: TermAssignment,
  roles: Core009Roles,
): ExactVennResultV5 {
  const id = `bank-four-v3-${question.seed}-${question.locale}`.replace(/[^a-zA-Z0-9_-]/gu, "-");
  const shapes = buildShapes(roles);
  // Outer D first, then the disjoint A/B pair, then inner C for readable arcs.
  const drawOrder: readonly TermId[] = [roles.d, roles.a, roles.b, roles.c];
  const circles: string[] = [];
  const labels: string[] = [];

  drawOrder.forEach((term, index) => {
    const shape = shapes.get(term)!;
    circles.push(
      `<g data-set="${esc(term)}" data-cx="${shape.cx}" data-cy="${shape.cy}" data-r="${shape.r}"><circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" class="set-circle set-${index + 1}"/></g>`,
    );
    const value = assignment[term]?.labels[question.locale] ?? term;
    const lines = splitLabel(value);
    labels.push(
      `<text x="${shape.cx}" y="${shape.labelY}" text-anchor="middle" class="set-label">${lines.map((line, lineIndex) => `<tspan x="${shape.cx}" dy="${lineIndex === 0 ? 0 : 14}">${esc(line)}</tspan>`).join("")}</text>`,
    );
  });

  const caption = "Combined four-term premise arrangement.";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 220" width="100%" role="img" lang="${question.locale}" aria-labelledby="${id}-title ${id}-desc" data-diagram-count="1" data-learner-safe-venn="true" data-supplemental-four-term="core-009" class="examtree-venn-svg">
  <title id="${id}-title">${caption}</title>
  <desc id="${id}-desc">${caption}</desc>
  <style>
    .set-circle{fill:#f8fafc;fill-opacity:.34;stroke:#334155;stroke-width:2.2}
    .set-2{stroke:#475569}.set-3{stroke:#64748b}.set-4{stroke:#334155}
    .set-label{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:13px;font-weight:700;fill:#0f172a}
    .witness-halo{fill:#dbeafe;stroke:#2563eb;stroke-width:1.5}
    .witness{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:22px;font-weight:800;fill:#1d4ed8}
  </style>
  ${circles.join("\n  ")}
  ${labels.join("\n  ")}
</svg>`;

  return {
    enabled: true,
    omissionReason: null,
    svg,
    caption,
    accessibleDescription: caption,
    semanticSignature: `syl-v5:banking-four-term-core-009-v3:${question.seed}:${question.locale}`,
    modelSignature: "banking-four-term-core-009-v3",
  };
}

export function renderBankingFourTermPremiseVennV3(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  assignment: TermAssignment,
): ExactVennResultV5 {
  if (presentation.learnerExplanation.mode !== "CONCLUSION_MASK") {
    return omitted(question, "not-premise-only");
  }
  const terms = [...new Set(question.structuredPrompt.premises.flatMap((premise) => [
    premise.subject,
    premise.predicate,
  ]))] as TermId[];
  if (terms.length !== 4) return omitted(question, "not-four-terms");

  const roles = resolveCore009Roles(question);
  if (!roles) return omitted(question, "unsupported-four-term-pattern");

  let rendered = renderRaw(question, assignment, roles);
  rendered = correctExactVennWitnessProofV5(question, presentation, rendered);
  rendered = enforceExistentialCompletenessV5(question, presentation, rendered);
  rendered = finalizeWitnessClosureV5(question, presentation, rendered);
  if (!rendered.enabled || !rendered.svg) return rendered;

  if (
    exactVennAddsUnstatedStrongRelationV5(question, presentation, rendered.svg)
    || exactVennHasUnauthorisedContainmentDirectionV5(question, presentation, rendered.svg)
  ) {
    return omitted(question, "post-safety-rejected");
  }

  return {
    ...rendered,
    semanticSignature: `${rendered.semanticSignature}:post-safety-pass`,
  };
}
