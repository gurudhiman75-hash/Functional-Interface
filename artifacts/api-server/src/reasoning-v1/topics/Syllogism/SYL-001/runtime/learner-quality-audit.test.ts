import type { SylLocale } from "../foundation/types";
import { conclusionDirectlyRestatesPremise } from "./analysis";
import { generateSylQuestion } from "./generator";
import { SYL_QL_REGISTRY } from "./ql-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function semanticKey(conclusion: {
  form: string;
  subject: string;
  predicate: string;
}): string {
  return `${conclusion.form}:${conclusion.subject}:${conclusion.predicate}`;
}

function normalizedText(value: string): string {
  return value
    .toLocaleLowerCase("en-IN")
    .replace(/[^a-z0-9\u0900-\u097f\u0a00-\u0a7f]+/gu, " ")
    .trim();
}

function wordCount(value: string): number {
  return value
    .replace(/[⇒→⊆∩∅≠\\]/gu, " ")
    .split(/\s+/u)
    .filter(Boolean)
    .length;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let generated = 0;
let selectionQuestions = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    const english = generateSylQuestion(definition.qlId, seed, "en-IN");
    const premises = english.structuredPrompt.premises;

    for (const conclusion of english.structuredPrompt.conclusions) {
      assert(
        !conclusionDirectlyRestatesPremise(premises, conclusion),
        `${definition.qlId}/${seed} includes a conclusion that directly repeats a statement: ${semanticKey(conclusion)}.`,
      );
    }

    const correctOption = english.options[english.correctIndex];
    if (english.answerType === "CONCLUSION_TEXT") {
      selectionQuestions += 1;
      assert(
        !english.statements.some((statement) => normalizedText(statement) === normalizedText(correctOption.text)),
        `${definition.qlId}/${seed} correct answer repeats a displayed statement.`,
      );

      const conclusionIndex = english.structuredPrompt.conclusions.findIndex((conclusion) =>
        semanticKey(conclusion) === correctOption.semanticValue);
      assert(conclusionIndex >= 0, `${definition.qlId}/${seed} correct conclusion is missing.`);
      const evaluation = english.reviewLogic.conclusionEvaluations[conclusionIndex];
      const impactIds = evaluation.classification === "UNDETERMINED"
        ? evaluation.modelImpactPremiseIds
        : evaluation.verdictImpactPremiseIds;
      assert(
        premises.every((premise) => impactIds.includes(premise.premiseId)),
        `${definition.qlId}/${seed} correct answer does not require the full statement chain.`,
      );
    }

    const explanation = english.explanation;
    assert(explanation.tier1Concept.heading === "📌 1. Basic Rule", `${definition.qlId}/${seed} English heading is not simplified.`);
    assert(explanation.tier2StepByStep.heading === "📝 2. Check the Conclusions", `${definition.qlId}/${seed} English analysis heading is not simplified.`);
    assert(explanation.tier3Shortcut.heading === "⚡ 3. Fast Method", `${definition.qlId}/${seed} English shortcut heading is not simplified.`);
    assert(explanation.tier4Trap.heading === "⚠️ 4. Common Mistake", `${definition.qlId}/${seed} English warning heading is not simplified.`);
    assert(wordCount(explanation.tier1Concept.coreRule) <= 22, `${definition.qlId}/${seed} core rule is too difficult.`);
    assert(
      explanation.tier1Concept.premiseBreakdown.every((point) => wordCount(point.naturalRule) <= 22),
      `${definition.qlId}/${seed} premise wording is too long.`,
    );
    assert(
      explanation.tier2StepByStep.conclusionSteps.every((step) => wordCount(step.reasoning) <= 22),
      `${definition.qlId}/${seed} conclusion wording is too long.`,
    );
    assert(wordCount(explanation.tier4Trap.studentWarning) <= 22, `${definition.qlId}/${seed} warning is too long.`);
    assert(
      explanation.tier1Concept.premiseBreakdown.every((point) => !/[⊆∩∅≠\\]/u.test(point.compactRule)),
      `${definition.qlId}/${seed} English explanation still uses advanced set symbols.`,
    );

    const learnerText = JSON.stringify({
      tier1: explanation.tier1Concept,
      tier2: explanation.tier2StepByStep,
      tier3: explanation.tier3Shortcut,
      tier4: explanation.tier4Trap.studentWarning,
      caption: explanation.diagramCaption,
    });
    const difficultPhrases = [
      /valid arrangement/i,
      /counter-arrangement/i,
      /configuration/i,
      /quantifier/i,
      /retained model/i,
      /model checker/i,
      /statement boundaries/i,
      /complete relation/i,
      /compulsory/i,
    ];
    for (const pattern of difficultPhrases) {
      assert(!pattern.test(learnerText), `${definition.qlId}/${seed} English explanation contains difficult wording: ${pattern}.`);
    }

    const svg = explanation.overlappingVennSvg;
    assert(svg.includes('data-correct-option-only="true"'), `${definition.qlId}/${seed} diagram is not marked correct-option-only.`);
    if (english.answerType === "CONCLUSION_TEXT" || english.answerType === "MODAL_LABEL") {
      const labels = [...svg.matchAll(/class="card-kicker">([IVX]+) ·/gu)].map((match) => match[1]);
      assert(new Set(labels).size <= 1, `${definition.qlId}/${seed} diagram shows another conclusion besides the selected option.`);
    }

    for (const locale of locales) {
      const question = locale === "en-IN" ? english : generateSylQuestion(definition.qlId, seed, locale);
      assert(
        question.explanation.overlappingVennSvg.includes('data-correct-option-only="true"'),
        `${definition.qlId}/${seed}/${locale} diagram is not correct-option-only.`,
      );
      generated += 1;
    }
  }
}

assert(generated === 18 * 80 * 3, `Expected 4320 localized questions, generated ${generated}.`);
assert(selectionQuestions > 0, "No conclusion-selection questions were audited.");
console.log(JSON.stringify({
  status: "SYL-001 learner-quality audit passed",
  generatedQuestions: generated,
  selectionQuestions,
  guarantees: [
    "no direct statement restatements",
    "correct answer uses the full statement chain",
    "correct-option-only diagrams",
    "simple English explanation profile",
  ],
}, null, 2));
