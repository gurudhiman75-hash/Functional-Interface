import { verifySolverAgreement } from "../foundation/solver-agreement";
import type { SylLocale } from "../foundation/types";
import { SYL_SOURCE_PATTERNS } from "../source-authority/source-patterns";
import { generateSylQuestion } from "./generator";
import { SYL_QL_REGISTRY } from "./ql-registry";
import { SYL_SCENARIOS } from "./scenarios";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function equal(actual: unknown, expected: unknown, message: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`);
  }
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const qlIds = SYL_QL_REGISTRY.map((entry) => entry.qlId);
assert(SYL_QL_REGISTRY.length === 18, "SYL-001 must expose exactly 18 evidence-derived review-runtime QLs.");
equal(qlIds, Array.from({ length: 18 }, (_, index) => `SYL-QL-${String(index + 1).padStart(3, "0")}`), "QL IDs must be contiguous");
assert(new Set(qlIds).size === qlIds.length, "QL IDs must be unique.");
assert(new Set(SYL_SCENARIOS.map((entry) => entry.scenarioId)).size === SYL_SCENARIOS.length, "Scenario IDs must be unique.");
assert(SYL_SCENARIOS.length === 36, "The review-runtime scenario authority must contain 36 source-shaped scenarios.");
assert(SYL_SCENARIOS.every((entry) => entry.premises.length >= 2 && entry.premises.length <= 3), "Every V1 scenario must use two or three relevant premises.");
assert(SYL_SCENARIOS.every((entry) => entry.premises.every((premise) => premise.form !== "FEW")), "Unresolved FEW semantics must remain excluded.");
assert(SYL_SOURCE_PATTERNS.length === 6, "Six source-pattern authorities must be frozen.");
assert(SYL_SOURCE_PATTERNS.every((entry) => entry.status === "VERIFIED"), "Every source authority must be verified.");
assert(SYL_SOURCE_PATTERNS.every((entry) => entry.evidenceUrls.length >= 1), "Every source authority must retain evidence URLs.");
assert(SYL_SCENARIOS.some((entry) => entry.premises.some((premise) => premise.form === "NOT_ALL")), "CP-006 must implement the not-all surface authority.");

const cpCounts = new Map<string, number>();
for (const definition of SYL_QL_REGISTRY) {
  cpCounts.set(definition.checkpointId, (cpCounts.get(definition.checkpointId) ?? 0) + 1);
  assert(definition.sourcePatternIds.length >= 1, `${definition.qlId} lacks source authority.`);
  assert(definition.status === "IMPLEMENTED_MULTILINGUAL_REVIEW_RUNTIME", `${definition.qlId} has an invalid lifecycle status.`);
  assert(definition.answerTemplateId.endsWith("_V1"), `${definition.qlId} lacks a versioned answer template.`);
  assert((definition.optionCount === 5) === (definition.answerTemplateId === "BANK_FIVE_OPTION_V1"), `${definition.qlId} answer template and option count disagree.`);
  for (const sourcePatternId of definition.sourcePatternIds) {
    assert(SYL_SOURCE_PATTERNS.some((entry) => entry.sourcePatternId === sourcePatternId), `${definition.qlId} references unknown source ${sourcePatternId}.`);
  }
}
equal([...cpCounts.entries()], [
  ["SYL-CP-001", 2],
  ["SYL-CP-002", 2],
  ["SYL-CP-003", 3],
  ["SYL-CP-004", 2],
  ["SYL-CP-005", 3],
  ["SYL-CP-006", 3],
  ["SYL-CP-007", 3],
], "Checkpoint QL boundaries must match the approved implementation audit");

let generatedCount = 0;
const allEnglishStems = new Map<string, string>();
const answerCoverage = new Map<string, Set<number>>();
const scenarioCoverage = new Map<string, Set<string>>();
const semanticAnswerCoverage = new Map<string, Set<string>>();
const diagramModeCoverage = new Set<string>();
const pedagogyLeakPatterns = [
  /canBeTrue/i,
  /canBeFalse/i,
  /occupied witness regions/i,
  /places witnesses in these regions/i,
  /मान्य सदस्य-क्षेत्र/u,
  /सदस्य इन क्षेत्रों में रखे/u,
  /ਮੰਨੇ ਹੋਏ ਮੈਂਬਰ-ਖੇਤਰ/u,
  /ਮੈਂਬਰ ਇਨ੍ਹਾਂ ਖੇਤਰਾਂ ਵਿੱਚ ਰੱਖੇ/u,
];

for (const definition of SYL_QL_REGISTRY) {
  const positions = new Set<number>();
  const scenarios = new Set<string>();
  const semanticAnswers = new Set<string>();
  const qlStems = new Set<string>();

  for (let seed = 0; seed < 80; seed += 1) {
    const english = generateSylQuestion(definition.qlId, seed, "en-IN");
    const replay = generateSylQuestion(definition.qlId, seed, "en-IN");
    equal(english, replay, `${definition.qlId}/${seed} must be deterministic`);

    const baselineSemanticOptions = english.options.map((entry) => ({
      semanticValue: entry.semanticValue,
      isCorrect: entry.isCorrect,
      errorLabel: entry.errorLabel,
    }));
    const termOrder = Object.keys(english.structuredPrompt.termKeysById).sort();
    assert(termOrder.length >= 2 && termOrder.length <= 5, `${definition.qlId}/${seed} term bound failed.`);
    assert(english.structuredPrompt.premises.length >= 2, `${definition.qlId}/${seed} lacks premises.`);
    assert(english.structuredPrompt.normalizedConstraints.length >= english.structuredPrompt.premises.length, `${definition.qlId}/${seed} normalization missing constraints.`);

    for (let index = 0; index < english.structuredPrompt.conclusions.length; index += 1) {
      const conclusion = english.structuredPrompt.conclusions[index];
      const agreement = verifySolverAgreement(
        english.structuredPrompt.normalizedConstraints,
        conclusion,
        termOrder,
      );
      assert(agreement.agreed, `${definition.qlId}/${seed}/${conclusion.conclusionId} solver disagreement.`);
      const stored = english.reviewLogic.conclusionEvaluations[index];
      equal(
        [agreement.primary.classification, agreement.primary.canBeTrue, agreement.primary.canBeFalse],
        [stored.classification, stored.canBeTrue, stored.canBeFalse],
        `${definition.qlId}/${seed}/${conclusion.conclusionId} stored truth profile mismatch`,
      );
    }

    assert(english.options.length === definition.optionCount, `${definition.qlId}/${seed} option count mismatch.`);
    assert(new Set(english.options.map((entry) => entry.text)).size === english.options.length, `${definition.qlId}/${seed} duplicate English options.`);
    assert(new Set(english.options.map((entry) => entry.semanticValue)).size === english.options.length, `${definition.qlId}/${seed} duplicate semantic options.`);
    assert(english.options.filter((entry) => entry.isCorrect).length === 1, `${definition.qlId}/${seed} must have one correct option.`);
    assert(english.correctIndex >= 0 && english.correctIndex < english.options.length, `${definition.qlId}/${seed} correct index invalid.`);
    assert(english.options[english.correctIndex].isCorrect, `${definition.qlId}/${seed} correct index does not point to answer.`);

    const explanation = english.explanation;
    const studentExplanationText = JSON.stringify({
      tier1Concept: explanation.tier1Concept,
      tier2StepByStep: explanation.tier2StepByStep,
      tier3Shortcut: explanation.tier3Shortcut,
      studentWarning: explanation.tier4Trap.studentWarning,
      finalAnswer: explanation.finalAnswer,
      diagramTitle: explanation.diagramTitle,
      diagramCaption: explanation.diagramCaption,
    });
    assert(explanation.schemaVersion === "syl-pedagogy-v2", `${definition.qlId}/${seed} explanation schema mismatch.`);
    assert(explanation.tier1Concept.premiseBreakdown.length === english.statements.length, `${definition.qlId}/${seed} premise teaching count mismatch.`);
    equal(
      explanation.tier1Concept.premiseBreakdown.map((entry) => entry.statement),
      english.statements,
      `${definition.qlId}/${seed} explanation premise order must match the displayed stem`,
    );
    assert(explanation.tier2StepByStep.conclusionSteps.length === english.conclusions.length, `${definition.qlId}/${seed} conclusion teaching count mismatch.`);
    equal(
      explanation.tier2StepByStep.conclusionSteps.map((entry) => entry.conclusion),
      english.conclusions,
      `${definition.qlId}/${seed} explanation conclusion order mismatch`,
    );
    assert(explanation.tier3Shortcut.shortcut.length > 18, `${definition.qlId}/${seed} shortcut too short.`);
    assert(explanation.tier4Trap.studentWarning.length > 25, `${definition.qlId}/${seed} student warning too short.`);
    assert(/^[A-Z0-9_]+$/.test(explanation.tier4Trap.diagnosticTag), `${definition.qlId}/${seed} invalid diagnostic tag.`);
    for (const pattern of pedagogyLeakPatterns) {
      assert(!pattern.test(studentExplanationText), `${definition.qlId}/${seed} leaked solver/debug wording: ${pattern}.`);
    }

    const svg = explanation.overlappingVennSvg;
    assert(svg.includes('role="img"'), `${definition.qlId}/${seed} diagram lacks accessibility role.`);
    assert(svg.includes("<title"), `${definition.qlId}/${seed} diagram lacks title.`);
    assert(svg.includes('data-diagram-mode="'), `${definition.qlId}/${seed} diagram lacks a mode contract.`);
    assert(svg.includes('data-relation="'), `${definition.qlId}/${seed} diagram lacks relation geometry.`);
    assert(svg.includes("<circle"), `${definition.qlId}/${seed} diagram lacks set geometry.`);
    assert(!svg.includes("Occupied witness regions"), `${definition.qlId}/${seed} retained legacy witness list.`);
    assert(!/cx="160"[^>]*><\/circle>.*cx="305"[^>]*><\/circle>.*cx="450"/s.test(svg), `${definition.qlId}/${seed} retained isolated three-circle layout.`);
    assert(!svg.includes("…"), `${definition.qlId}/${seed} diagram contains clipped relation captions.`);
    if (english.metadata.premiseForms.some((form) => form === "SOME" || form === "A_FEW" || form === "ONLY_A_FEW")) {
      assert(svg.includes('data-relation="SOME"') || svg.includes('data-relation="ONLY_A_FEW"'), `${definition.qlId}/${seed} overlap premise lacks overlapping relation card.`);
      assert(svg.includes('class="witness"'), `${definition.qlId}/${seed} existential overlap lacks a witness mark.`);
    }
    if (english.metadata.premiseForms.includes("NO")) {
      assert(svg.includes('data-relation="NO"'), `${definition.qlId}/${seed} NO premise lacks a disjoint relation card.`);
      assert(svg.includes('class="cross-mark"'), `${definition.qlId}/${seed} NO relation lacks an exclusion mark.`);
    }
    if (english.metadata.premiseForms.some((form) => form === "ALL" || form === "ONLY" || form === "ARE_ONLY")) {
      assert(svg.includes('data-relation="ALL"'), `${definition.qlId}/${seed} inclusion premise lacks nested relation geometry.`);
    }
    diagramModeCoverage.add(explanation.diagramMode);

    assert(!/SYL-QL-|SYL-SC-|C-(ALL|NO|SOME)/.test(english.stem), `${definition.qlId}/${seed} leaked internal identity.`);
    assert(!english.options.some((entry) => /SYL-|MASK_/.test(entry.text)), `${definition.qlId}/${seed} leaked internal option identity.`);
    assert(english.metadata.runtimeVersion === "syl-001-pedagogy-runtime-v2", `${definition.qlId}/${seed} runtime version mismatch.`);
    assert(english.metadata.studentExplanationNaturalized, `${definition.qlId}/${seed} naturalized explanation gate false.`);
    assert(english.metadata.overlappingDiagramValidated, `${definition.qlId}/${seed} overlapping diagram gate false.`);
    assert(english.metadata.localePedagogyParityPassed, `${definition.qlId}/${seed} locale pedagogy gate false.`);
    assert(english.metadata.answerTemplateId === definition.answerTemplateId, `${definition.qlId}/${seed} answer-template metadata mismatch.`);
    assert(english.metadata.solverAgreementPassed, `${definition.qlId}/${seed} solver gate false.`);
    assert(english.metadata.premiseRelevancePassed, `${definition.qlId}/${seed} premise relevance false.`);
    assert(!english.metadata.questionStudioVisible && !english.metadata.questionBankWritable && !english.metadata.testEligible && !english.metadata.publiclyPublishable, `${definition.qlId}/${seed} lifecycle lock opened.`);
    assert(!english.metadata.premiseForms.includes("FEW"), `${definition.qlId}/${seed} admitted unresolved FEW.`);

    const correctSemantic = english.options[english.correctIndex].semanticValue;
    const classes = english.reviewLogic.conclusionEvaluations.map((entry) => entry.classification);
    if (["SELECT_DEFINITE_CONCLUSION", "ONLY_SELECT_DEFINITE_CONCLUSION", "FEW_SELECT_DEFINITE_CONCLUSION"].includes(definition.taskKind)) {
      const correctIndex = english.structuredPrompt.conclusions.findIndex((conclusion) => `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}` === correctSemantic);
      assert(correctIndex >= 0 && classes[correctIndex] === "ENTAILED", `${definition.qlId}/${seed} selected non-entailed conclusion.`);
    }
    if (definition.taskKind === "SELECT_NON_FOLLOWING_CONCLUSION") {
      const correctIndex = english.structuredPrompt.conclusions.findIndex((conclusion) => `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}` === correctSemantic);
      assert(correctIndex >= 0 && classes[correctIndex] !== "ENTAILED", `${definition.qlId}/${seed} selected a following conclusion.`);
    }
    if (definition.taskKind === "SELECT_GENUINE_POSSIBILITY") {
      const correctIndex = english.structuredPrompt.conclusions.findIndex((conclusion) => `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}` === correctSemantic);
      assert(correctIndex >= 0 && classes[correctIndex] === "UNDETERMINED", `${definition.qlId}/${seed} selected a non-possibility.`);
    }
    if (definition.taskKind === "SELECT_IMPOSSIBLE_CONCLUSION") {
      const correctIndex = english.structuredPrompt.conclusions.findIndex((conclusion) => `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}` === correctSemantic);
      assert(correctIndex >= 0 && classes[correctIndex] === "CONTRADICTED", `${definition.qlId}/${seed} selected a possible conclusion.`);
    }
    if (definition.renderer === "MODAL_CLASSIFICATION") {
      const expected = classes[0] === "ENTAILED"
        ? "DEFINITELY_TRUE"
        : classes[0] === "UNDETERMINED"
          ? "POSSIBLY_TRUE_NOT_DEFINITE"
          : "IMPOSSIBLE";
      assert(correctSemantic === expected, `${definition.qlId}/${seed} modal answer mismatch.`);
    }
    if (definition.taskKind.includes("THREE_CONCLUSION")) {
      const expectedMask = classes.reduce((mask, classification, index) =>
        classification === "ENTAILED" ? mask | (1 << index) : mask, 0);
      assert(correctSemantic === `MASK_${expectedMask}`, `${definition.qlId}/${seed} three-conclusion mask mismatch.`);
    }
    if (definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") {
      assert(correctSemantic === english.metadata.pairStatus, `${definition.qlId}/${seed} pair classification mismatch.`);
    }
    if (definition.renderer === "CONCLUSION_COMBINATION" && !definition.taskKind.includes("THREE_CONCLUSION")) {
      assert(correctSemantic === english.metadata.pairStatus, `${definition.qlId}/${seed} pair combination mismatch.`);
    }

    positions.add(english.correctIndex);
    scenarios.add(english.scenarioId);
    semanticAnswers.add(correctSemantic);
    qlStems.add(english.stem);
    const priorQl = allEnglishStems.get(english.stem);
    assert(!priorQl || priorQl === definition.qlId, `Cross-QL exact stem collision: ${priorQl}/${definition.qlId}.`);
    allEnglishStems.set(english.stem, definition.qlId);

    const englishPedagogyShape = {
      premiseCount: english.explanation.tier1Concept.premiseBreakdown.length,
      verdicts: english.explanation.tier2StepByStep.conclusionSteps.map((entry) => entry.verdict),
      diagramRole: english.explanation.diagramRole,
      diagramMode: english.explanation.diagramMode,
      diagnosticTag: english.explanation.tier4Trap.diagnosticTag,
    };

    for (const locale of locales) {
      const question = locale === "en-IN" ? english : generateSylQuestion(definition.qlId, seed, locale);
      const semanticOptions = question.options.map((entry) => ({
        semanticValue: entry.semanticValue,
        isCorrect: entry.isCorrect,
        errorLabel: entry.errorLabel,
      }));
      equal(semanticOptions, baselineSemanticOptions, `${definition.qlId}/${seed}/${locale} semantic option parity`);
      assert(question.correctIndex === english.correctIndex, `${definition.qlId}/${seed}/${locale} correct-index parity failed.`);
      assert(question.scenarioId === english.scenarioId, `${definition.qlId}/${seed}/${locale} scenario parity failed.`);
      equal(question.metadata.selectedConclusionClasses, english.metadata.selectedConclusionClasses, `${definition.qlId}/${seed}/${locale} truth-class parity`);
      equal(question.structuredPrompt, english.structuredPrompt, `${definition.qlId}/${seed}/${locale} structured-prompt parity`);
      equal({
        premiseCount: question.explanation.tier1Concept.premiseBreakdown.length,
        verdicts: question.explanation.tier2StepByStep.conclusionSteps.map((entry) => entry.verdict),
        diagramRole: question.explanation.diagramRole,
        diagramMode: question.explanation.diagramMode,
        diagnosticTag: question.explanation.tier4Trap.diagnosticTag,
      }, englishPedagogyShape, `${definition.qlId}/${seed}/${locale} pedagogy structure parity`);
      assert(question.options.every((entry) => entry.text.trim().length > 0), `${definition.qlId}/${seed}/${locale} blank option.`);
      assert(new Set(question.options.map((entry) => entry.text)).size === question.options.length, `${definition.qlId}/${seed}/${locale} duplicate localized options.`);
      if (locale === "hi-IN") {
        assert(/[\u0900-\u097F]/u.test(question.stem), `${definition.qlId}/${seed} Hindi script missing.`);
        assert(question.explanation.tier1Concept.heading.includes("स्तर 1"), `${definition.qlId}/${seed} Hindi pedagogy header missing.`);
        assert(question.explanation.tier1Concept.premiseBreakdown.every((entry) => /[\u0900-\u097F]/u.test(entry.compactRule)), `${definition.qlId}/${seed} Hindi compact rules leaked English category names.`);
        assert(!/मान्य व्यवस्था|सदस्य-क्षेत्र/u.test(JSON.stringify(question.explanation)), `${definition.qlId}/${seed} robotic Hindi pedagogy leaked.`);
      }
      if (locale === "pa-IN") {
        assert(/[\u0A00-\u0A7F]/u.test(question.stem), `${definition.qlId}/${seed} Punjabi script missing.`);
        assert(!/[\u0900-\u0963\u0966-\u097F]/u.test(question.stem), `${definition.qlId}/${seed} Devanagari leaked into Punjabi stem.`);
        assert(question.explanation.tier1Concept.heading.includes("ਪੱਧਰ 1"), `${definition.qlId}/${seed} Punjabi pedagogy header missing.`);
        assert(question.explanation.tier1Concept.premiseBreakdown.every((entry) => /[\u0A00-\u0A7F]/u.test(entry.compactRule)), `${definition.qlId}/${seed} Punjabi compact rules leaked English category names.`);
        assert(!/ਮੰਨੀ ਹੋਈ ਬਣਤਰ|ਮੈਂਬਰ-ਖੇਤਰ|ਸਮੂਹ-ਸੰਬੰਧ ਸਬੂਤ/u.test(JSON.stringify(question.explanation)), `${definition.qlId}/${seed} robotic Punjabi pedagogy leaked.`);
      }
      generatedCount += 1;
    }
  }

  assert(positions.size === definition.optionCount, `${definition.qlId} does not reach every answer position.`);
  assert(scenarios.size >= 4, `${definition.qlId} has weak scenario diversity: ${scenarios.size}.`);
  assert(qlStems.size >= 76, `${definition.qlId} has weak stem diversity: ${qlStems.size}/80.`);
  if (definition.renderer === "MODAL_CLASSIFICATION") assert(semanticAnswers.size === 3, `${definition.qlId} must cover all three modal answers.`);
  if (definition.taskKind === "TWO_CONCLUSION_EITHER_OR" || definition.taskKind === "CLASSIFY_CONCLUSION_PAIR") assert(semanticAnswers.size === 5, `${definition.qlId} must cover all five pair statuses.`);
  if (definition.taskKind.includes("THREE_CONCLUSION")) assert(semanticAnswers.size === 8, `${definition.qlId} must cover all eight follow masks.`);
  answerCoverage.set(definition.qlId, positions);
  scenarioCoverage.set(definition.qlId, scenarios);
  semanticAnswerCoverage.set(definition.qlId, semanticAnswers);
}

assert(generatedCount === 18 * 80 * 3, `Expected 4320 questions, generated ${generatedCount}.`);
assert(diagramModeCoverage.has("FORCED_WITH_FOCUS"), "Diagram audit lacks forced-focus coverage.");
assert(diagramModeCoverage.has("TRUE_FALSE_COMPARISON"), "Diagram audit lacks standalone possibility comparison coverage.");
assert(diagramModeCoverage.has("FORCED_AND_TRUE_FALSE_COMPARISON"), "Diagram audit lacks combined forced-and-possible comparison coverage.");
assert(diagramModeCoverage.has("EITHER_OR_COMPARISON"), "Diagram audit lacks either-or comparison coverage.");
console.log(JSON.stringify({
  status: "SYL-001 pedagogy-remodeled multilingual chapter audit passed",
  explanationSchema: "syl-pedagogy-v2",
  qls: SYL_QL_REGISTRY.length,
  scenarios: SYL_SCENARIOS.length,
  sourcePatterns: SYL_SOURCE_PATTERNS.length,
  generatedQuestions: generatedCount,
  diagramModes: [...diagramModeCoverage].sort(),
  answerPositions: Object.fromEntries([...answerCoverage].map(([qlId, values]) => [qlId, [...values].sort()])),
  scenarioCounts: Object.fromEntries([...scenarioCoverage].map(([qlId, values]) => [qlId, values.size])),
  semanticAnswerCounts: Object.fromEntries([...semanticAnswerCoverage].map(([qlId, values]) => [qlId, values.size])),
}, null, 2));
