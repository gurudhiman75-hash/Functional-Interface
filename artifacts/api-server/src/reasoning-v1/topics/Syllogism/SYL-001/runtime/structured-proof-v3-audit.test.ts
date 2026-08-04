import type { SylLocale } from "../foundation/types";
import { generateSylQuestion } from "./generator";
import { SYL_QL_REGISTRY } from "./ql-registry";
import {
  SYL_EXISTENCE_POLICY,
  SYL_STRUCTURED_PROOF_AUTHORITY,
} from "./structured-proof-v3-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, message: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`);
  }
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const titleIds = new Set<string>();
const descriptionIds = new Set<string>();
const logicIds = new Map<string, string>();
const localizedIds = new Set<string>();
const reviewIds = new Set<string>();
const proofTypes = new Set<string>();
const diagramModes = new Set<string>();
const reasonCodes = new Set<string>();
const taskStatuses = new Set<string>();
let generated = 0;
let optionsReviewed = 0;
let existenceDependent = 0;

assert(SYL_QL_REGISTRY.length >= 18, "V3 cannot remove an existing review archetype without an explicit merge/split decision.");

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    let baselineLogicId: string | null = null;
    for (const locale of locales) {
      const question = generateSylQuestion(definition.qlId, seed, locale);
      const proof = question.structuredProofV3;
      const key = `${definition.qlId}:${seed}`;

      assert(proof.authority === SYL_STRUCTURED_PROOF_AUTHORITY, `${key}/${locale} V3 authority mismatch.`);
      assert(proof.schemaVersion === "syl-structured-proof-v3", `${key}/${locale} schema mismatch.`);
      assert(proof.provisionalQlAuthority, `${key}/${locale} incorrectly freezes the current QL inventory.`);
      assert(proof.humanReview.status === "REVISE", `${key}/${locale} human review must remain REVISE.`);
      assert(proof.humanReview.contentVersion === proof.identity.reviewVersionId, `${key}/${locale} review is not tied to the immutable review version.`);
      assert(proof.existencePolicy.policyId === SYL_EXISTENCE_POLICY, `${key}/${locale} existence policy mismatch.`);
      assert(proof.existencePolicy.visibleToStudent, `${key}/${locale} existence policy is hidden.`);
      assert(proof.existencePolicy.studentDirection.trim().length > 20, `${key}/${locale} existence policy direction is missing.`);
      if (proof.existencePolicy.dependentAnswer) existenceDependent += 1;

      if (baselineLogicId === null) baselineLogicId = proof.identity.logicContentId;
      assert(proof.identity.logicContentId === baselineLogicId, `${key}/${locale} logic ID changed across locale.`);
      logicIds.set(key, proof.identity.logicContentId);
      assert(!localizedIds.has(proof.identity.localizedRecordId), `${key}/${locale} localized ID collision.`);
      assert(!reviewIds.has(proof.identity.reviewVersionId), `${key}/${locale} review ID collision.`);
      localizedIds.add(proof.identity.localizedRecordId);
      reviewIds.add(proof.identity.reviewVersionId);
      assert(proof.identity.questionLanguageId.endsWith(locale), `${key}/${locale} language ID lacks locale.`);

      assert(proof.statementMeanings.length === question.statements.length, `${key}/${locale} statement meaning count mismatch.`);
      equal(
        proof.statementMeanings.map((entry) => entry.statement),
        question.statements,
        `${key}/${locale} statement order mismatch`,
      );
      assert(proof.combinedReasoning.decisivePremiseIds.length >= 1, `${key}/${locale} has no decisive premise.`);
      assert(proof.combinedReasoning.reasoningSteps.length >= 2, `${key}/${locale} combined proof is too thin.`);
      assert(proof.combinedReasoning.reasoningSteps.at(-1)?.premiseIds.length === proof.combinedReasoning.decisivePremiseIds.length, `${key}/${locale} final reasoning step omits decisive premises.`);

      assert(proof.visibleOptionAnalysis.length === question.options.length, `${key}/${locale} option analysis count mismatch.`);
      for (let index = 0; index < question.options.length; index += 1) {
        const option = question.options[index];
        const analysis = proof.visibleOptionAnalysis[index];
        assert(analysis.displayIndex === index + 1, `${key}/${locale} option display index mismatch.`);
        assert(analysis.optionId === option.optionId, `${key}/${locale} option ID mismatch.`);
        assert(analysis.text === option.text, `${key}/${locale} option text mismatch.`);
        assert(analysis.semanticValue === option.semanticValue, `${key}/${locale} semantic option mismatch.`);
        assert(analysis.isCorrectForTask === option.isCorrect, `${key}/${locale} task-key mismatch.`);
        assert(analysis.studentVerdict.trim().length > 5, `${key}/${locale} blank student verdict.`);
        assert(analysis.studentReason.trim().length > 30, `${key}/${locale} option reason is too thin.`);
        assert(analysis.premiseIdsUsed.length >= 1, `${key}/${locale} option reason has no premise evidence.`);
        assert(!/The statements allow this relation, but they do not force it\.?/i.test(analysis.studentReason), `${key}/${locale} retained generic fallback reason.`);
        assert(!/Use Statements? \d+(?: and \d+)? together\.?$/i.test(analysis.studentReason), `${key}/${locale} retained verdict-only statement reference.`);
        reasonCodes.add(analysis.reasonCode);
        taskStatuses.add(analysis.taskStatus);
        optionsReviewed += 1;
      }
      assert(proof.visibleOptionAnalysis.filter((entry) => entry.isCorrectForTask).length === 1, `${key}/${locale} must have one keyed option analysis.`);
      const keyed = proof.visibleOptionAnalysis[question.correctIndex];
      assert(keyed.isCorrectForTask, `${key}/${locale} correct index does not point to keyed analysis.`);
      assert(proof.correctOptionProof.displayIndex === question.correctIndex + 1, `${key}/${locale} proof option index mismatch.`);
      assert(proof.correctOptionProof.optionId === question.options[question.correctIndex].optionId, `${key}/${locale} proof option ID mismatch.`);
      assert(proof.correctOptionProof.text === question.options[question.correctIndex].text, `${key}/${locale} proof option text mismatch.`);
      assert(proof.correctOptionProof.premiseIdsUsed.length >= 1, `${key}/${locale} correct proof lacks premise path.`);
      assert(proof.correctOptionProof.reasoningSteps.length >= 2, `${key}/${locale} correct proof lacks reasoning steps.`);
      assert(proof.correctOptionProof.studentProof.length > 45, `${key}/${locale} correct proof is too short.`);
      proofTypes.add(proof.correctOptionProof.proofType);

      if (definition.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION") {
        assert(proof.correctOptionProof.proofType === "COUNTERMODEL", `${key}/${locale} non-following task lacks countermodel proof.`);
        assert(proof.correctOptionProof.proofModel !== null, `${key}/${locale} non-following task lacks complete countermodel.`);
      }
      if (definition.taskKind === "SELECT_GENUINE_POSSIBILITY") {
        assert(proof.correctOptionProof.proofType === "SATISFYING_MODEL", `${key}/${locale} possibility task lacks satisfying-model proof.`);
        assert(proof.correctOptionProof.proofModel !== null, `${key}/${locale} possibility task lacks complete satisfying model.`);
      }
      if (definition.taskKind.includes("MODAL") && question.reviewLogic.conclusionEvaluations[0]?.classification === "UNDETERMINED") {
        assert(proof.correctOptionProof.proofType === "TRUE_FALSE_MODELS", `${key}/${locale} modal possibility lacks two-model proof.`);
        assert(proof.correctOptionProof.proofModel !== null && proof.correctOptionProof.counterModel !== null, `${key}/${locale} modal possibility lacks true/false models.`);
      }

      const diagram = proof.diagramSpec;
      assert(diagram.diagramCount === 1, `${key}/${locale} diagram count is not one.`);
      assert(diagram.correctOptionOnly, `${key}/${locale} diagram is not keyed-option-only.`);
      assert(diagram.allRelevantPremisesIncluded, `${key}/${locale} integrated diagram omits a decisive premise.`);
      assert(diagram.relevantPremiseIds.length === proof.combinedReasoning.decisivePremiseIds.length, `${key}/${locale} diagram/premise proof mismatch.`);
      assert(diagram.correctOptionDisplayIndex === question.correctIndex + 1, `${key}/${locale} diagram option index mismatch.`);
      assert(diagram.correctOptionText === question.options[question.correctIndex].text, `${key}/${locale} diagram option text mismatch.`);
      assert(diagram.locale === locale, `${key}/${locale} diagram locale mismatch.`);
      assert(diagram.textAlternative.trim().length > 30, `${key}/${locale} diagram text alternative is too thin.`);
      assert(!titleIds.has(diagram.titleId), `${key}/${locale} duplicate SVG title ID.`);
      assert(!descriptionIds.has(diagram.descriptionId), `${key}/${locale} duplicate SVG description ID.`);
      titleIds.add(diagram.titleId);
      descriptionIds.add(diagram.descriptionId);
      diagramModes.add(diagram.mode);

      const svg = proof.integratedDiagramSvg;
      assert((svg.match(/<svg\b/gu) ?? []).length === 1, `${key}/${locale} must contain exactly one SVG artifact.`);
      assert(svg.includes('data-diagram-count="1"'), `${key}/${locale} SVG lacks diagram-count contract.`);
      assert(svg.includes('data-correct-option-only="true"'), `${key}/${locale} SVG lacks keyed-option-only contract.`);
      assert(svg.includes(`lang="${locale}"`), `${key}/${locale} SVG language metadata mismatch.`);
      assert(svg.includes(`aria-labelledby="${diagram.titleId} ${diagram.descriptionId}"`), `${key}/${locale} SVG accessibility reference mismatch.`);
      assert(svg.includes(`<title id="${diagram.titleId}">`), `${key}/${locale} SVG title missing.`);
      assert(svg.includes(`<desc id="${diagram.descriptionId}">`), `${key}/${locale} SVG description missing.`);
      assert(!svg.includes("card-kicker") && !svg.includes("premiseCards"), `${key}/${locale} retained separate premise-card diagram architecture.`);
      for (const premiseId of diagram.relevantPremiseIds) {
        assert(svg.includes(`data-premise-id="${premiseId}"`), `${key}/${locale} SVG omits decisive premise ${premiseId}.`);
      }
      assert(svg.includes(`${question.correctIndex + 1}:`), `${key}/${locale} SVG lacks visible correct-option reference.`);

      assert(proof.finalAnswer.includes(String(question.correctIndex + 1)), `${key}/${locale} final answer lacks visible index.`);
      assert(proof.finalAnswer.includes(question.options[question.correctIndex].text), `${key}/${locale} final answer text mismatch.`);
      assert(proof.validationEvidence.some((entry) => entry.validatorId === "SYL_VISIBLE_OPTION_ALIGNMENT_V1" && entry.status === "PASS"), `${key}/${locale} option alignment evidence missing.`);
      assert(proof.validationEvidence.some((entry) => entry.validatorId === "SYL_NATIVE_EDITORIAL_REVIEW_V1" && entry.status === "NOT_RUN" && entry.scope === "HUMAN"), `${key}/${locale} native review is overclaimed.`);
      assert(!proof.validationEvidence.some((entry) => entry.scope === "HUMAN" && entry.status === "PASS"), `${key}/${locale} automated runtime claims human approval.`);

      generated += 1;
    }
  }
}

assert(generated === SYL_QL_REGISTRY.length * 80 * 3, `Generated ${generated} V3 records unexpectedly.`);
assert(logicIds.size === SYL_QL_REGISTRY.length * 80, "Logic IDs are not one-per-logical-question.");
assert(localizedIds.size === generated, "Localized record IDs are not unique.");
assert(reviewIds.size === generated, "Review version IDs are not unique.");
assert(titleIds.size === generated && descriptionIds.size === generated, "SVG accessibility IDs are not globally unique.");
assert(existenceDependent > 0, "Existence-dependent answers were not identified.");
assert(proofTypes.has("COUNTERMODEL"), "V3 proof audit lacks countermodel coverage.");
assert(proofTypes.has("SATISFYING_MODEL"), "V3 proof audit lacks satisfying-model coverage.");
assert(proofTypes.has("TRUE_FALSE_MODELS"), "V3 proof audit lacks dual-model coverage.");
assert(proofTypes.has("MASK_DERIVATION"), "V3 proof audit lacks mask proof coverage.");
assert(diagramModes.has("COMPLETE_COUNTERMODEL"), "V3 diagram audit lacks countermodel mode.");
assert(diagramModes.has("COMPLETE_POSSIBILITY_MODEL"), "V3 diagram audit lacks possibility mode.");
assert(diagramModes.has("DUAL_TRUE_FALSE_MODEL"), "V3 diagram audit lacks dual-model mode.");
assert(reasonCodes.size >= 8, `V3 option reasons are too repetitive: ${[...reasonCodes].join(", ")}.`);
assert(taskStatuses.has("TRUE_BUT_NOT_REQUESTED"), "V3 audit lacks truth/task-separation coverage.");
assert(taskStatuses.has("POSSIBLE_BUT_TASK_REQUIRES_CERTAINTY"), "V3 audit lacks possible-versus-definite task coverage.");

console.log(JSON.stringify({
  status: "SYL-001 structured-proof V3 audit passed",
  authority: SYL_STRUCTURED_PROOF_AUTHORITY,
  provisionalQlCount: SYL_QL_REGISTRY.length,
  generatedRecords: generated,
  visibleOptionsReviewed: optionsReviewed,
  existenceDependentRecords: existenceDependent,
  proofTypes: [...proofTypes].sort(),
  diagramModes: [...diagramModes].sort(),
  reasonCodes: [...reasonCodes].sort(),
  taskStatuses: [...taskStatuses].sort(),
}, null, 2));
