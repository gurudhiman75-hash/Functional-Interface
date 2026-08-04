import type { SylLocale } from "../foundation/types";
import { generateSylQuestion } from "./generator";
import { SYL_QL_REGISTRY } from "./ql-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const allSvgIds = new Set<string>();
let records = 0;
let options = 0;

const genericEnglishReasons = [
  /^Use Statements? \d+(?: and \d+)? together\.?/iu,
  /^The statements allow this relation, but they do not force it\.?$/iu,
  /^This conclusion cannot be true\.?$/iu,
  /^The conclusion results .* do not match this option\.?$/iu,
];

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestion(definition.qlId, seed, locale);
      const proof = question.structuredProofV3;
      const key = `${definition.qlId}/${seed}/${locale}`;

      if (locale === "en-IN") {
        for (const meaning of proof.statementMeanings) {
          assert(!/At least one (?!member\b)[A-Za-z]+s\b/iu.test(meaning.meaning), `${key} uses a plural category as one member: ${meaning.meaning}`);
          assert(!/Every [A-Za-z]+s\b/iu.test(meaning.meaning), `${key} uses an unidiomatic plural after Every: ${meaning.meaning}`);
        }
        const learnerText = JSON.stringify({
          statementMeanings: proof.statementMeanings,
          combinedReasoning: proof.combinedReasoning,
          visibleOptionAnalysis: proof.visibleOptionAnalysis,
          correctOptionProof: proof.correctOptionProof,
          fastRule: proof.fastRule,
        });
        assert(!/Statements? \d+(?: and \d+)+ (?:blocks|forces|makes)\b/iu.test(learnerText), `${key} has subject–verb disagreement.`);
        assert(!/[.!?]\s+definitely follows\b/iu.test(learnerText), `${key} has broken final-answer punctuation.`);
        assert(!/at least one [a-z]+s (?:is|stays|must)\b/iu.test(learnerText), `${key} treats a plural category name as one object.`);
        assert(!/\bevery [A-Za-z]+s\b/iu.test(learnerText), `${key} uses a plural category directly after Every.`);
        assert(!/\banother [A-Za-z]+s\b/iu.test(learnerText), `${key} uses a plural category as another single member.`);
        assert(!/This option needs [^.]+ must [^.]+\./iu.test(learnerText), `${key} has a double-verb option explanation.`);
        assert(!/This option requires that [^.]+ must [^.]+\./iu.test(learnerText), `${key} retains a double-modal option explanation.`);
        assert(!/\b[a-z)] (?:At least one member|No member|Every member|One member|Together,|Therefore,|Combining these relations)/u.test(learnerText), `${key} joins proof sentences without punctuation.`);
        for (const analysis of proof.visibleOptionAnalysis) {
          for (const pattern of genericEnglishReasons) {
            assert(!pattern.test(analysis.studentReason.trim()), `${key}/option-${analysis.displayIndex} retained generic reasoning: ${analysis.studentReason}`);
          }
          assert(analysis.studentReason.split(/\s+/u).length >= 9, `${key}/option-${analysis.displayIndex} explanation is too thin.`);
        }
      } else {
        const script = locale === "hi-IN" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
        for (const analysis of proof.visibleOptionAnalysis) {
          assert(script.test(analysis.studentVerdict), `${key}/option-${analysis.displayIndex} verdict is not localized.`);
          assert(script.test(analysis.studentReason), `${key}/option-${analysis.displayIndex} reason is not localized.`);
          assert(!/\b(?:Option|Statement|member|definitely follows|possible but not definite)\b/iu.test(analysis.studentReason), `${key}/option-${analysis.displayIndex} leaks English teaching prose.`);
        }
        assert(proof.statementMeanings.every((entry) => script.test(entry.meaning)), `${key} has a non-localized statement meaning.`);
        assert(script.test(proof.correctOptionProof.studentProof), `${key} correct proof is not localized.`);
      }

      assert(proof.combinedReasoning.summary.length > 45, `${key} combined reasoning is too short.`);
      assert(proof.correctOptionProof.studentProof.length > 45, `${key} correct proof is too short.`);
      assert(proof.correctOptionProof.premiseIdsUsed.length === proof.diagramSpec.relevantPremiseIds.length, `${key} proof and diagram premise counts differ.`);
      assert(proof.correctOptionProof.premiseIdsUsed.every((id) => proof.diagramSpec.relevantPremiseIds.includes(id)), `${key} proof and diagram premise IDs differ.`);
      assert(proof.combinedReasoning.reasoningSteps.at(-1)?.premiseIds.length === proof.diagramSpec.relevantPremiseIds.length, `${key} final reasoning step omits a diagram premise.`);

      const svg = proof.integratedDiagramSvg;
      assert(svg.includes('viewBox="0 0 360 '), `${key} does not use the mobile-first 360-unit diagram canvas.`);
      assert(!svg.includes('viewBox="0 0 720 '), `${key} retained the unreadable 720-unit diagram canvas.`);
      assert(svg.includes('data-diagram-version="syl-integrated-diagram-v3-mobile"'), `${key} lacks the mobile diagram version contract.`);
      assert(svg.includes('.node-label{font-size:10.5px'), `${key} node labels are below the mobile readability contract.`);
      assert(svg.includes('.edge-label{font-size:8.5px'), `${key} relation labels are below the mobile readability contract.`);
      assert(svg.includes('.answer-text{font-size:10px'), `${key} answer text is below the mobile readability contract.`);
      const ids = [...svg.matchAll(/(?:^|\s)id="([^"]+)"/gu)].map((match) => match[1]);
      assert(ids.length >= 4, `${key} SVG lacks expected accessibility/marker IDs.`);
      assert(new Set(ids).size === ids.length, `${key} SVG repeats an internal ID.`);
      for (const id of ids) {
        assert(!allSvgIds.has(id), `${key} SVG ID is not globally unique: ${id}`);
        allSvgIds.add(id);
      }
      assert(!/\sid="arrow(?:-back)?"/u.test(svg), `${key} retains global marker IDs.`);
      assert(!/url\(#arrow(?:-back)?\)/u.test(svg), `${key} retains global marker references.`);
      assert(svg.includes(`lang="${locale}"`), `${key} SVG lang is incorrect.`);
      assert(svg.includes(`aria-labelledby="${proof.diagramSpec.titleId} ${proof.diagramSpec.descriptionId}"`), `${key} SVG accessibility references are inconsistent.`);

      assert(proof.identity.reviewVersionId === proof.humanReview.contentVersion, `${key} human review points to stale content.`);
      const contentHashes = new Set(proof.validationEvidence.map((entry) => entry.contentHash));
      assert(contentHashes.size === 1, `${key} validators do not share the final content hash.`);
      assert([...contentHashes][0]?.length === 64, `${key} final validation hash is invalid.`);

      options += proof.visibleOptionAnalysis.length;
      records += 1;
    }
  }
}

assert(records === SYL_QL_REGISTRY.length * 80 * 3, `Expected ${SYL_QL_REGISTRY.length * 80 * 3} records, audited ${records}.`);
assert(options > records * 3, "Visible option audit coverage is unexpectedly low.");
console.log(JSON.stringify({
  status: "SYL-001 structured-proof V3 language/accessibility audit passed",
  records,
  options,
  globallyUniqueSvgIds: allSvgIds.size,
  mobileDiagramCanvas: 360,
}, null, 2));
