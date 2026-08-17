import assert from "node:assert/strict";
import { classifyConclusionPrimary } from "../foundation/primary-solver";
import { modelSatisfiesConstraints } from "../foundation/region-model";
import type { SylLocale, TermId } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import {
  modelSatisfiesConclusionV5,
  modelSignatureV5,
  resolveModelTargetV5,
} from "./learner-v5-model-target-remediation";
import { requiresConcreteModelsV5 } from "./learner-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("en-IN")
    .replace(/[“”"'’.!?।,:;—–-]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

let records = 0;
let modelRecords = 0;
let selectedConclusionModelRecords = 0;
let dualModelRecords = 0;
let distinctDualModelPairs = 0;
let targetTextMismatches = 0;
let modelTruthMismatches = 0;
let unsafeLegacyCaptions = 0;
let modelTargetDiagramsOmitted = 0;
let ql009EitherOrDiagramsRetained = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      const presentation = question.learnerPresentationV5;
      const mode = presentation.learnerExplanation.mode;
      records += 1;

      const captionText = [
        presentation.diagram.caption ?? "",
        presentation.diagram.accessibleDescription ?? "",
      ].join(" ");
      if (/always shown separately|हमेशा अलग|ਹਮੇਸ਼ਾਂ ਵੱਖ/iu.test(captionText)) {
        unsafeLegacyCaptions += 1;
      }
      assert.ok(
        !/always shown separately|हमेशा अलग|ਹਮੇਸ਼ਾਂ ਵੱਖ/iu.test(captionText),
        `${definition.qlId}/${seed}/${locale}: model caption still presents an unstated separation as a rule`,
      );

      if (presentation.diagram.omissionReason === "MODEL_TARGET_MISMATCH") {
        modelTargetDiagramsOmitted += 1;
        assert.equal(presentation.diagram.enabled, false);
        assert.equal(presentation.diagram.svg, null);
      }

      if (
        definition.qlId === "SYL-QL-009"
        && (question.metadata.pairStatus === "EITHER_OR" || question.metadata.pairStatus === "EITHER_OR_FOLLOWS")
        && question.learnerPresentationV4.diagram.enabled
        && question.learnerPresentationV4.diagram.mode === "VENN_EITHER_OR"
      ) {
        ql009EitherOrDiagramsRetained += 1;
        assert.notEqual(
          presentation.diagram.omissionReason,
          "ANSWER_MODE_MISMATCH",
          `${definition.qlId}/${seed}/${locale}: genuine pair-classification either-or diagram was wrongly discarded`,
        );
      }

      if (!requiresConcreteModelsV5(mode)) continue;
      modelRecords += 1;
      const target = resolveModelTargetV5(question);
      const narrative = normalize([
        ...presentation.learnerExplanation.shortReasoning,
        presentation.learnerExplanation.conclusion,
      ].join(" "));
      const targetText = normalize(target.rendered);
      if (!narrative.includes(targetText)) targetTextMismatches += 1;
      assert.ok(
        narrative.includes(targetText),
        `${definition.qlId}/${seed}/${locale}: model narrative does not name its exact target conclusion`,
      );

      if (definition.qlId === "SYL-QL-002" || definition.qlId === "SYL-QL-005") {
        selectedConclusionModelRecords += 1;
        const markedAnswer = normalize(question.options[question.correctIndex]?.text ?? "");
        assert.equal(
          targetText,
          markedAnswer,
          `${definition.qlId}/${seed}/${locale}: model target is not the marked conclusion option`,
        );
      }

      const termOrder = Object.keys(question.structuredPrompt.termKeysById).sort() as TermId[];
      const profile = classifyConclusionPrimary(
        question.structuredPrompt.normalizedConstraints,
        target.canonical,
        termOrder,
      );

      if (mode === "COUNTEREXAMPLE") {
        const model = profile.counterModel;
        const valid = Boolean(
          model
          && modelSatisfiesConstraints(model, question.structuredPrompt.normalizedConstraints)
          && !modelSatisfiesConclusionV5(model, target.canonical),
        );
        if (!valid) modelTruthMismatches += 1;
        assert.ok(valid, `${definition.qlId}/${seed}/${locale}: narrated countermodel does not falsify the marked conclusion`);
      } else if (mode === "POSSIBILITY_MODEL") {
        const model = profile.witnessModel;
        const valid = Boolean(
          model
          && modelSatisfiesConstraints(model, question.structuredPrompt.normalizedConstraints)
          && modelSatisfiesConclusionV5(model, target.canonical),
        );
        if (!valid) modelTruthMismatches += 1;
        assert.ok(valid, `${definition.qlId}/${seed}/${locale}: narrated possibility model does not satisfy the marked conclusion`);
      } else {
        dualModelRecords += 1;
        const trueModel = profile.witnessModel;
        const falseModel = profile.counterModel;
        const trueValid = Boolean(
          trueModel
          && modelSatisfiesConstraints(trueModel, question.structuredPrompt.normalizedConstraints)
          && modelSatisfiesConclusionV5(trueModel, target.canonical),
        );
        const falseValid = Boolean(
          falseModel
          && modelSatisfiesConstraints(falseModel, question.structuredPrompt.normalizedConstraints)
          && !modelSatisfiesConclusionV5(falseModel, target.canonical),
        );
        if (!trueValid || !falseValid) modelTruthMismatches += 1;
        assert.ok(trueValid, `${definition.qlId}/${seed}/${locale}: first dual model does not make the conclusion true`);
        assert.ok(falseValid, `${definition.qlId}/${seed}/${locale}: second dual model does not make the conclusion false`);
        assert.ok(trueModel && falseModel);
        const signaturesDiffer = modelSignatureV5(trueModel) !== modelSignatureV5(falseModel);
        if (signaturesDiffer) distinctDualModelPairs += 1;
        assert.ok(signaturesDiffer, `${definition.qlId}/${seed}/${locale}: true and false models are identical`);
      }
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.ok(modelRecords > 0);
assert.ok(selectedConclusionModelRecords > 0);
assert.ok(dualModelRecords > 0);
assert.equal(distinctDualModelPairs, dualModelRecords);
assert.equal(targetTextMismatches, 0);
assert.equal(modelTruthMismatches, 0);
assert.equal(unsafeLegacyCaptions, 0);
assert.ok(ql009EitherOrDiagramsRetained > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_MODEL_TARGET_BINDING",
  records,
  modelRecords,
  selectedConclusionModelRecords,
  dualModelRecords,
  distinctDualModelPairs,
  targetTextMismatches,
  modelTruthMismatches,
  unsafeLegacyCaptions,
  modelTargetDiagramsOmitted,
  ql009EitherOrDiagramsRetained,
}, null, 2));
