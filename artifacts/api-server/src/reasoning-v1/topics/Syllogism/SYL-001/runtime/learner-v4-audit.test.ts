import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { learnerCopyV4 } from "./learner-v4-localization";
import type { SylLearnerExplanationModeV4 } from "./learner-v4-types";
import { SYL_QL_REGISTRY } from "./ql-registry";
import { renderLearnerQuestionV4 } from "./review-renderer-v4";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizedSentence(value: string): string {
  return value.toLocaleLowerCase("en-IN").replace(/[.!?।\s]+/gu, " ").trim();
}

function words(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function learnerHtmlOnly(html: string): string {
  return html.split('<details class="administrator-proof">')[0] ?? html;
}

function expectedMaterialExistenceNote(question: ReturnType<typeof generateSylQuestionV4>): boolean {
  if (!question.structuredProofV3.existencePolicy.dependentAnswer) return false;
  const decisiveIds = new Set(question.structuredProofV3.correctOptionProof.premiseIdsUsed);
  return !question.structuredPrompt.premises.some((premise) =>
    decisiveIds.has(premise.premiseId)
    && ["SOME", "SOME_NOT", "A_FEW", "NOT_ALL", "ONLY_A_FEW"].includes(premise.form));
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const limits: Readonly<Record<SylLearnerExplanationModeV4, number>> = {
  DIRECT_CHAIN: 70,
  WITNESS_TRANSFER: 90,
  DIRECT_CONTRADICTION: 65,
  POSSIBLE_NOT_DEFINITE: 70,
  COUNTEREXAMPLE: 55,
  POSSIBILITY_MODEL: 45,
  DUAL_MODEL: 60,
  CONCLUSION_MASK: 125,
  EITHER_OR: 65,
};

const bannedReasonCodes = [
  "DIRECT_CONTRADICTION",
  "REVERSAL_ERROR",
  "POSSIBILITY_MISTAKEN_FOR_CERTAINTY",
  "CERTAINTY_NOT_REQUESTED",
  "FORCED_WITNESS_TRANSFER",
  "WITNESS_MISMATCH",
  "ONLY_DIRECTION_ERROR",
  "ONLY_A_FEW_TWO_FACTS",
  "NOT_ALL_NORMALIZATION",
  "VALID_COUNTERMODEL",
  "VALID_SATISFYING_MODEL",
  "IMPOSSIBLE_IN_ALL_MODELS",
  "MASK_MISMATCH",
  "EITHER_OR_NOT_EXCLUSIVE",
  "EITHER_OR_NOT_EXHAUSTIVE",
  "PAIR_CLASSIFICATION_MISMATCH",
  "TASK_NOT_REQUESTED",
  "COMPLETE_PROOF",
] as const;

const modes = new Set<string>();
const wordCounts = new Set<number>();
let records = 0;
let options = 0;
let shortcuts = 0;
let dependentNotes = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV4(definition.qlId, seed, locale);
      const v4 = question.learnerPresentationV4;
      const key = `${definition.qlId}/${seed}/${locale}`;
      const explanation = v4.learnerExplanation;
      const html = renderLearnerQuestionV4(question);
      const learner = learnerHtmlOnly(html);

      assert(v4.authority === "SYL_001_LEARNER_EXPLANATION_V4", `${key} has the wrong V4 authority.`);
      assert(v4.schemaVersion === "syl-learner-v4", `${key} has the wrong schema.`);
      assert(v4.answer.displayIndex === question.correctIndex + 1, `${key} answer display index changed.`);
      assert(v4.answer.text === question.options[question.correctIndex]?.text, `${key} answer text changed.`);
      assert(question.options[question.correctIndex]?.isCorrect === true, `${key} V3 answer key changed.`);
      assert(v4.lifecycle.reviewStatus === "REVISE", `${key} is not REVISE.`);
      assert(v4.lifecycle.public === false, `${key} became public.`);
      assert(v4.lifecycle.questionStudioEnabled === false, `${key} entered Question Studio.`);
      assert(v4.lifecycle.questionBankStatus === "NOT_STORED", `${key} entered Question Bank.`);
      assert(v4.lifecycle.testEligibility === "INELIGIBLE", `${key} became test-eligible.`);
      assert(v4.administratorProof.nativeEditorialStatus === "NOT_RUN", `${key} claims native editorial completion.`);

      assert((learner.match(/data-answer-card="1"/gu) ?? []).length === 1, `${key} does not render exactly one answer card.`);
      assert(!/Understand the statements|Combine the statements|Check each visible option|Why the correct option is right|Fast exam rule|Final answer/iu.test(learner), `${key} retained the V3 seven-section template.`);
      assert(!/\bSYL-[A-Z0-9-]+-P\d+\b/u.test(learner), `${key} exposes premise IDs in the learner view.`);
      for (const reasonCode of bannedReasonCodes) {
        assert(!learner.includes(reasonCode), `${key} exposes internal reason code ${reasonCode}.`);
      }
      assert(!/\b(?:structured proof|model impact|verdict impact|normalized constraints|valid model universe|conclusion evaluation authority)\b/iu.test(learner), `${key} exposes technical proof language.`);
      assert(!/।।|!!|\?\?|۔۔/u.test(learner), `${key} contains duplicate punctuation.`);

      const proofSentences = [...explanation.shortReasoning, explanation.conclusion]
        .map(normalizedSentence)
        .filter(Boolean);
      assert(new Set(proofSentences).size === proofSentences.length, `${key} repeats a proof sentence in the learner explanation.`);
      const copy = learnerCopyV4(locale);
      assert(explanation.wordCount === words([
        ...explanation.shortReasoning,
        ...explanation.conclusionResults.map((entry) => `${entry.label} ${entry.follows ? copy.follows : copy.doesNotFollow} ${entry.shortReason ?? ""}`),
        explanation.conclusion,
      ].join(" ")), `${key} word-count evidence is stale.`);
      assert(explanation.wordCount <= limits[explanation.mode], `${key} ${explanation.mode} explanation is too long (${explanation.wordCount}).`);
      assert(explanation.wordCount >= 4, `${key} explanation is too thin.`);

      if (question.difficulty === "EASY" && explanation.mode === "DIRECT_CHAIN") {
        assert(explanation.wordCount <= 70, `${key} easy direct-chain explanation exceeds 70 words.`);
      }

      if (explanation.showShortcut) {
        shortcuts += 1;
        assert(Boolean(explanation.shortcut), `${key} shortcut flag has no shortcut.`);
        assert(explanation.shortcut!.includes("⇒"), `${key} shortcut is not a specific relation rule.`);
        assert(!/check every|carefully|read the question|ਧਿਆਨ ਨਾਲ|ध्यान से/iu.test(explanation.shortcut!), `${key} retained a generic shortcut.`);
      } else {
        assert(explanation.shortcut === null, `${key} hides a non-null shortcut.`);
      }

      const dependent = expectedMaterialExistenceNote(question);
      assert(Boolean(explanation.existenceNote) === dependent, `${key} existence note visibility is wrong.`);
      if (dependent) dependentNotes += 1;

      if (explanation.mode === "COUNTEREXAMPLE") {
        assert(/does not definitely follow|निश्चित रूप से नहीं निकलता|ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਨਹੀਂ ਨਿਕਲਦਾ/u.test(explanation.conclusion), `${key} non-following conclusion is phrased affirmatively.`);
      }
      if (explanation.mode === "DIRECT_CONTRADICTION") {
        assert(/impossible|असंभव|ਅਸੰਭਵ/iu.test(explanation.conclusion), `${key} impossible conclusion is not stated as impossible.`);
        assert(explanation.shortReasoning.length >= 2, `${key} impossible explanation omits its decisive proof.`);
      }
      if (explanation.mode === "POSSIBILITY_MODEL") {
        assert(/possible|संभव|ਸੰਭਵ/iu.test(explanation.conclusion), `${key} possibility conclusion is not stated as possible.`);
      }
      if (explanation.mode === "DUAL_MODEL") {
        assert(/possible|संभव|ਸੰਭਵ/iu.test(explanation.conclusion) && /not definite|निश्चित नहीं|ਨਿਸ਼ਚਿਤ ਨਹੀਂ/iu.test(explanation.conclusion), `${key} dual-model conclusion does not say possible but not definite.`);
      }

      assert(v4.optionAnalysis.length === question.options.length - 1, `${key} does not explain every wrong option.`);
      for (const entry of v4.optionAnalysis) {
        assert(entry.displayIndex !== v4.answer.displayIndex, `${key} includes the correct option in collapsed wrong options.`);
        assert(words(entry.studentReason) >= 7, `${key}/option-${entry.displayIndex} wrong-option reason is too generic.`);
        assert(!/not the required answer|अपेक्षित उत्तर नहीं|ਲੋੜੀਂਦਾ ਜਵਾਬ ਨਹੀਂ/iu.test(entry.studentReason), `${key}/option-${entry.displayIndex} uses a generic wrong-option reason.`);
        assert(!/\bSYL-[A-Z0-9-]+\b/u.test(entry.studentReason), `${key}/option-${entry.displayIndex} exposes an internal ID.`);
        assert(!/।।|!!|\?\?|۔۔/u.test(entry.studentReason), `${key}/option-${entry.displayIndex} contains duplicate punctuation.`);
        options += 1;
      }

      if (locale === "hi-IN") {
        const visible = [
          v4.answer.label,
          ...explanation.shortReasoning,
          explanation.conclusion,
          explanation.existenceNote ?? "",
          ...v4.optionAnalysis.flatMap((entry) => [entry.verdictLabel, entry.studentReason]),
        ].join(" ");
        assert(/[\u0900-\u097F]/u.test(visible), `${key} Hindi learner copy is not localized.`);
        assert(!/\b(?:Option|Premises|Reason|Answer depends|Administrator proof)\b/u.test(visible), `${key} leaks English learner labels.`);
      }
      if (locale === "pa-IN") {
        const visible = [
          v4.answer.label,
          ...explanation.shortReasoning,
          explanation.conclusion,
          explanation.existenceNote ?? "",
          ...v4.optionAnalysis.flatMap((entry) => [entry.verdictLabel, entry.studentReason]),
        ].join(" ");
        assert(/[\u0A00-\u0A7F]/u.test(visible), `${key} Punjabi learner copy is not localized.`);
        assert(!/\b(?:Option|Premises|Reason|Answer depends|Administrator proof)\b/u.test(visible), `${key} leaks English learner labels.`);
      }

      modes.add(explanation.mode);
      wordCounts.add(explanation.wordCount);
      records += 1;
    }
  }
}

assert(records === SYL_QL_REGISTRY.length * 80 * locales.length, `Expected ${SYL_QL_REGISTRY.length * 80 * locales.length} V4 records, audited ${records}.`);
assert(modes.size >= 8, `Adaptive renderer covered only ${modes.size} explanation modes.`);
assert(wordCounts.size >= 20, "Explanation length is still effectively fixed.");
assert(shortcuts > 0 && shortcuts < records, "Shortcuts are either absent everywhere or forced everywhere.");
assert(dependentNotes > 0 && dependentNotes < records, "Existence notes are either absent everywhere or shown everywhere.");
assert(options > records * 2, "Wrong-option audit coverage is unexpectedly low.");

console.log(JSON.stringify({
  status: "SYL-001 V4 learner explanation audit passed",
  records,
  wrongOptionsReviewed: options,
  explanationModes: [...modes].sort(),
  distinctExplanationWordCounts: wordCounts.size,
  shortcuts,
  dependentNotes,
}, null, 2));
