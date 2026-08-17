import type {
  CanonicalConclusion,
  CanonicalModel,
  SylLocale,
  TermId,
} from "../foundation/types";
import { modelSatisfiesConstraints } from "../foundation/region-model";
import { generateSylQuestionV4 } from "./generator-v4";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import { SYL_QL_REGISTRY } from "./ql-registry";
import { renderLearnerQuestionV4 } from "./review-renderer-v4";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function parseConclusion(value: string): CanonicalConclusion | null {
  const [form, subject, predicate] = value.split(":");
  if (!["ALL", "NO", "SOME", "SOME_NOT"].includes(form) || !subject || !predicate) return null;
  return {
    conclusionId: `V4-PARSED-${form}-${subject}-${predicate}`,
    form: form as CanonicalConclusion["form"],
    subject: subject as TermId,
    predicate: predicate as TermId,
  };
}

function modelMakesConclusion(model: CanonicalModel, conclusion: CanonicalConclusion): boolean {
  const regions = model.occupiedRegions;
  const hasSubject = regions.some((region) => region.memberTerms.includes(conclusion.subject));
  const hasPredicate = regions.some((region) => region.memberTerms.includes(conclusion.predicate));
  switch (conclusion.form) {
    case "ALL":
      return hasSubject && regions.every((region) =>
        !region.memberTerms.includes(conclusion.subject)
        || region.memberTerms.includes(conclusion.predicate));
    case "NO":
      return hasSubject
        && hasPredicate
        && regions.every((region) =>
          !(region.memberTerms.includes(conclusion.subject)
            && region.memberTerms.includes(conclusion.predicate)));
    case "SOME":
      return regions.some((region) =>
        region.memberTerms.includes(conclusion.subject)
        && region.memberTerms.includes(conclusion.predicate));
    case "SOME_NOT":
      return regions.some((region) =>
        region.memberTerms.includes(conclusion.subject)
        && !region.memberTerms.includes(conclusion.predicate));
  }
}

function correctConclusion(question: GeneratedSylQuestionV4): CanonicalConclusion | null {
  const analysis = question.structuredProofV3.visibleOptionAnalysis
    .find((entry) => entry.displayIndex === question.correctIndex + 1);
  const direct = analysis ? parseConclusion(analysis.semanticValue) : null;
  if (direct) return direct;

  const diagramConclusionIds = new Set(question.structuredProofV3.diagramSpec.conclusionIds);
  const diagramConclusion = question.structuredPrompt.conclusions
    .find((conclusion) => diagramConclusionIds.has(conclusion.conclusionId));
  if (diagramConclusion) return diagramConclusion;

  return question.structuredPrompt.conclusions.length === 1
    ? question.structuredPrompt.conclusions[0]
    : null;
}

function count(value: string, pattern: RegExp): number {
  return [...value.matchAll(pattern)].length;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const relationCoverage = new Set<string>();
const modeCoverage = new Set<string>();
const globalSvgIds = new Set<string>();
let records = 0;
let enabled = 0;
let omitted = 0;
let countermodels = 0;
let possibilityModels = 0;
let dualModels = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    const variants = locales.map((locale) => generateSylQuestionV4(definition.qlId, seed, locale));
    const baseline = variants[0];
    const keyBase = `${definition.qlId}/${seed}`;

    for (const question of variants) {
      const key = `${keyBase}/${question.locale}`;
      const v4 = question.learnerPresentationV4;
      const diagram = v4.diagram;
      const html = renderLearnerQuestionV4(question);

      assert(question.correctIndex === baseline.correctIndex, `${key} answer index differs across locales.`);
      assert(v4.learnerExplanation.mode === baseline.learnerPresentationV4.learnerExplanation.mode, `${key} explanation mode differs across locales.`);
      assert(diagram.mode === baseline.learnerPresentationV4.diagram.mode, `${key} diagram mode differs across locales.`);
      assert(diagram.enabled === baseline.learnerPresentationV4.diagram.enabled, `${key} diagram visibility differs across locales.`);
      assert(diagram.semanticSignature === baseline.learnerPresentationV4.diagram.semanticSignature, `${key} diagram semantics differ across locales.`);
      assert(diagram.modelSignature === baseline.learnerPresentationV4.diagram.modelSignature, `${key} diagram model differs across locales.`);
      assert(v4.learnerExplanation.showDiagram === diagram.enabled, `${key} explanation and diagram visibility disagree.`);
      assert(v4.administratorProof.nativeEditorialStatus === "NOT_RUN", `${key} claims native editorial completion.`);

      modeCoverage.add(diagram.mode);
      if (!diagram.enabled) {
        omitted += 1;
        assert(diagram.mode === "OMITTED_NOT_USEFUL", `${key} disabled diagram has a visible mode.`);
        assert(diagram.diagramCount === 0, `${key} disabled diagram count is not zero.`);
        assert(diagram.svg === null && diagram.caption === null, `${key} disabled diagram retains learner SVG content.`);
        assert(Boolean(diagram.omissionReason), `${key} omitted diagram has no reason.`);
        assert(count(html, /data-diagram-component="1"/gu) === 0, `${key} rendered an omitted diagram.`);
        records += 1;
        continue;
      }

      enabled += 1;
      assert(diagram.diagramCount === 1, `${key} enabled diagram count is not one.`);
      assert(diagram.omissionReason === null, `${key} enabled diagram has an omission reason.`);
      assert(Boolean(diagram.svg && diagram.caption && diagram.accessibleDescription), `${key} enabled diagram is incomplete.`);
      const svg = diagram.svg!;
      assert(count(svg, /<svg\b/gu) === 1, `${key} contains more than one SVG.`);
      assert(count(html, /data-diagram-component="1"/gu) === 1, `${key} does not render exactly one diagram component.`);
      assert(svg.includes('viewBox="0 0 360 '), `${key} is not a 360-unit mobile diagram.`);
      assert(svg.includes('data-venn-v4="true"'), `${key} is not marked as a Venn diagram.`);
      assert(svg.includes('data-answer-sentence="false"'), `${key} may contain the full answer sentence.`);
      assert(!svg.includes(question.learnerPresentationV4.answer.text), `${key} embeds the full answer sentence in the SVG.`);
      assert(!/marker-(?:start|end)=|class="edge|data-relation="(?:FORWARD|BACKWARD)"/u.test(svg), `${key} retained the node-and-arrow grammar.`);
      assert(/<title id="syl-v4-title-/u.test(svg), `${key} lacks an accessible title.`);
      assert(/<desc id="syl-v4-desc-/u.test(svg), `${key} lacks an accessible description.`);
      assert(svg.includes(`lang="${question.locale}"`), `${key} SVG language is wrong.`);
      assert(!/\bwidth="\d{4,}/u.test(svg), `${key} requests a wide fixed SVG.`);
      assert(!/overflow-x|white-space:\s*nowrap/iu.test(svg), `${key} may require horizontal scrolling.`);
      assert(/(?:9\.5|11|12|14|15|25)px/u.test(svg), `${key} has no legible label-size evidence.`);
      const ids = [...svg.matchAll(/(?:^|\s)id="([^"]+)"/gu)].map((match) => match[1]);
      assert(new Set(ids).size === ids.length, `${key} repeats an internal SVG ID.`);
      for (const id of ids) {
        assert(!globalSvgIds.has(id), `${key} reuses SVG ID ${id}.`);
        globalSvgIds.add(id);
      }

      const setColors = [...svg.matchAll(/\.(?:set-a|set-b|set-c)\{[^}]*?(#[0-9a-f]{6})/giu)].map((match) => match[1].toLowerCase());
      assert(new Set(setColors).size <= 3, `${key} uses more than three primary set colours.`);

      for (const match of svg.matchAll(/data-relation="([^"]+)"/gu)) relationCoverage.add(match[1]);
      if (diagram.mode === "VENN_OVERLAP") {
        assert(/data-relation="SOME"/u.test(svg), `${key} SOME diagram lacks overlap semantics.`);
        assert(/data-witness-region="[^"]+&[^"]+"/u.test(svg), `${key} SOME witness is not in the overlap.`);
      }
      if (diagram.mode === "VENN_SUBJECT_ONLY_WITNESS") {
        assert(/data-relation="SOME_NOT"/u.test(svg), `${key} SOME_NOT diagram lacks subject-only semantics.`);
        assert(/data-witness-region="[^"]+&![^"]+"/u.test(svg), `${key} SOME_NOT witness is not in the subject-only region.`);
      }
      if (diagram.mode === "VENN_ONLY_A_FEW") {
        assert(/data-relation="ONLY_A_FEW"/u.test(svg), `${key} ONLY_A_FEW diagram lacks its relation.`);
        assert(count(svg, /data-witness-region=/gu) >= 2, `${key} ONLY_A_FEW diagram lacks two witnesses.`);
      }
      if (diagram.mode === "VENN_CONTAINMENT") {
        assert(/data-relation="(?:ALL|IDENTITY)"/u.test(svg), `${key} containment diagram lacks containment semantics.`);
      }
      if (diagram.mode === "VENN_SEPARATION") {
        assert(/data-relation="NO"/u.test(svg), `${key} separation diagram lacks NO semantics.`);
      }
      if (diagram.mode === "VENN_IMPOSSIBLE") {
        assert(/data-(?:forbidden-region|invalid-conclusion)=/u.test(svg), `${key} impossible diagram does not show why the conclusion fails.`);
      }
      if (diagram.mode === "VENN_COUNTEREXAMPLE" || diagram.mode === "VENN_POSSIBILITY") {
        assert(/viewBox="0 0 360 318"/u.test(svg), `${key} full model canvas does not reserve readable label space.`);
      }
      if (diagram.mode === "VENN_DUAL_MODEL") {
        assert(count(svg, /data-model-panel=/gu) === 2, `${key} dual model is not split into two panels.`);
        assert(!/scale\(/u.test(svg), `${key} dual model shrinks labels through SVG scaling.`);
        assert(/viewBox="0 0 360 214"/u.test(svg), `${key} dual model canvas is not mobile-readable.`);
      }

      if (question.locale === "hi-IN") {
        assert(/[\u0900-\u097F]/u.test(`${diagram.caption} ${diagram.accessibleDescription}`), `${key} Hindi caption is not localized.`);
        assert(!/\b(?:CAN BE TRUE|CAN BE FALSE|ONE VALID ARRANGEMENT|FORBIDDEN OVERLAP)\b/u.test(svg), `${key} Hindi SVG leaks English labels.`);
      }
      if (question.locale === "pa-IN") {
        assert(/[\u0A00-\u0A7F]/u.test(`${diagram.caption} ${diagram.accessibleDescription}`), `${key} Punjabi caption is not localized.`);
        assert(!/\b(?:CAN BE TRUE|CAN BE FALSE|ONE VALID ARRANGEMENT|FORBIDDEN OVERLAP)\b/u.test(svg), `${key} Punjabi SVG leaks English labels.`);
      }

      const conclusion = correctConclusion(question);
      if (diagram.mode === "VENN_COUNTEREXAMPLE") {
        const model = question.structuredProofV3.correctOptionProof.counterModel
          ?? question.structuredProofV3.diagramSpec.model;
        assert(Boolean(model && conclusion), `${key} counterexample lacks a model or tested conclusion.`);
        assert(modelSatisfiesConstraints(model!, question.structuredPrompt.normalizedConstraints), `${key} countermodel violates a premise.`);
        assert(modelMakesConclusion(model!, conclusion!) === false, `${key} countermodel does not falsify the conclusion.`);
        countermodels += 1;
      }
      if (diagram.mode === "VENN_POSSIBILITY") {
        const model = question.structuredProofV3.correctOptionProof.proofModel
          ?? question.structuredProofV3.diagramSpec.model;
        assert(Boolean(model && conclusion), `${key} possibility diagram lacks a model or tested conclusion.`);
        assert(modelSatisfiesConstraints(model!, question.structuredPrompt.normalizedConstraints), `${key} possibility model violates a premise.`);
        assert(modelMakesConclusion(model!, conclusion!) === true, `${key} possibility model does not satisfy the conclusion.`);
        possibilityModels += 1;
      }
      if (diagram.mode === "VENN_DUAL_MODEL") {
        const trueModel = question.structuredProofV3.correctOptionProof.proofModel
          ?? question.structuredProofV3.diagramSpec.model;
        const falseModel = question.structuredProofV3.correctOptionProof.counterModel
          ?? question.structuredProofV3.diagramSpec.alternateModel;
        assert(Boolean(trueModel && falseModel && conclusion), `${key} dual diagram lacks two models or a tested conclusion.`);
        assert(modelSatisfiesConstraints(trueModel!, question.structuredPrompt.normalizedConstraints), `${key} true model violates a premise.`);
        assert(modelSatisfiesConstraints(falseModel!, question.structuredPrompt.normalizedConstraints), `${key} false model violates a premise.`);
        assert(modelMakesConclusion(trueModel!, conclusion!) === true, `${key} first dual model does not make the conclusion true.`);
        assert(modelMakesConclusion(falseModel!, conclusion!) === false, `${key} second dual model does not make the conclusion false.`);
        dualModels += 1;
      }

      const onlyPremise = question.structuredPrompt.premises.find((premise) => premise.form === "ONLY");
      if (onlyPremise && /data-relation="ALL"/u.test(svg) && svg.includes(`data-inner="${onlyPremise.predicate}"`)) {
        assert(svg.includes(`data-outer="${onlyPremise.subject}"`), `${key} ONLY containment was not reversed correctly.`);
      }

      records += 1;
    }
  }
}

assert(records === SYL_QL_REGISTRY.length * 80 * locales.length, `Expected ${SYL_QL_REGISTRY.length * 80 * locales.length} diagram/parity records, audited ${records}.`);
assert(enabled > 0, "V4 rendered no Venn diagrams.");
assert(omitted > 0, "V4 never omits an unhelpful diagram.");
assert(modeCoverage.size >= 8, `V4 covered only ${modeCoverage.size} diagram modes.`);
assert(relationCoverage.has("ALL") || relationCoverage.has("ALL_CHAIN"), "No containment relation was rendered.");
assert(relationCoverage.has("NO"), "No separation relation was rendered.");
assert(relationCoverage.has("SOME") || relationCoverage.has("WITNESS_TRANSFER"), "No overlap relation was rendered.");
assert(relationCoverage.has("SOME_NOT") || modeCoverage.has("VENN_COUNTEREXAMPLE"), "No subject-only witness was rendered.");
assert(countermodels > 0, "No countermodel was validated.");
assert(possibilityModels > 0, "No possibility model was validated.");
assert(dualModels > 0, "No dual model was validated.");

console.log(JSON.stringify({
  status: "SYL-001 V4 Venn and locale parity audit passed",
  records,
  enabledDiagrams: enabled,
  omittedDiagrams: omitted,
  diagramModes: [...modeCoverage].sort(),
  relationCoverage: [...relationCoverage].sort(),
  countermodels,
  possibilityModels,
  dualModels,
  globallyUniqueSvgIds: globalSvgIds.size,
}, null, 2));
