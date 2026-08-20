import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP009_PERMANENT_ALLOCATION, type NumCp009PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp009Localized } from "./runtime.ts";
import { generateNumCp009LocalizedHumanFinal } from "./runtime-human-final.ts";
import type { NumCp009LocalizedLanguage } from "./types.ts";

const languages = ["hi", "pa"] as const satisfies readonly NumCp009LocalizedLanguage[];
const targetScript = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;
const residualEnglish = /\b(?:what|which|find|last|unit|digit|digits|power|powers|cycle|answer|complete|set|positive|integer|choose|final|term|terms|sum|difference|product|residue|modulo|possible|impossible|range|count|given|only|therefore|because|position|positions)\b/iu;
const terminologyDefect = /परस्पर सहभाज्य|सहभाज्य चक्र|शॉर्टकट|ਆਪਸ ਵਿੱਚ ਸਹਭਾਜੀ|ਸਹਭਾਜੀ ਚੱਕਰ|ਛੋਟਾ ਰਸਤਾ/u;
const implementationLeak = /prototype|generator|fingerprint|hidden state|source seed|authority package|question studio|question bank/iu;

let packages = 0;
let structuralParityChecks = 0;
let wordingChecks = 0;
let frozenLifecycleChecks = 0;
const stemDiversity = new Map<string, number>();
const reviewRows: unknown[] = [];
const reviewMarkdown: string[] = [
  "# NUM-CP-009 Hindi/Punjabi frozen human review",
  "",
  "One frozen learner-facing question per permanent QL and language after the final editorial layer.",
  "",
];

for (const allocation of NUM_CP009_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp009PermanentQlId;
  for (const language of languages) {
    const stems = new Set<string>();
    for (let seed = 1; seed <= 120; seed += 1) {
      const candidate = generateNumCp009Localized(qlId, seed, language);
      const first = generateNumCp009LocalizedHumanFinal(qlId, seed, language);
      const second = generateNumCp009LocalizedHumanFinal(qlId, seed, language);
      const label = `${qlId}/${language}/${seed}`;

      assert.deepEqual(first, second, `${label}: human-final deterministic replay drift`);
      assert.equal(first.permanentQlId, candidate.permanentQlId, `${label}: permanent QL drift`);
      assert.equal(first.authorityId, candidate.authorityId, `${label}: authority drift`);
      assert.equal(first.temporaryPrototypeId, candidate.temporaryPrototypeId, `${label}: prototype drift`);
      assert.equal(first.seed, candidate.seed, `${label}: seed drift`);
      assert.equal(first.sourceSeed, candidate.sourceSeed, `${label}: source-seed drift`);
      assert.equal(first.locale, candidate.locale, `${label}: locale drift`);
      assert.equal(first.language, candidate.language, `${label}: language drift`);
      assert.equal(first.difficulty, candidate.difficulty, `${label}: difficulty drift`);
      assert.equal(first.answerSemantic, candidate.answerSemantic, `${label}: answer-semantic drift`);
      assert.equal(first.sourceAnswerSemantic, candidate.sourceAnswerSemantic, `${label}: source semantic drift`);
      assert.equal(first.representation, candidate.representation, `${label}: representation drift`);
      assert.deepEqual(first.hiddenState, candidate.hiddenState, `${label}: hidden-state drift`);
      assert.equal(first.mathematicalFingerprint, candidate.mathematicalFingerprint, `${label}: fingerprint drift`);
      assert.equal(first.correctIndex, candidate.correctIndex, `${label}: correct-index drift`);
      assert.deepEqual(first.sourceAncestry, candidate.sourceAncestry, `${label}: source ancestry drift`);
      assert.deepEqual(first.prototypeAncestry, candidate.prototypeAncestry, `${label}: prototype ancestry drift`);
      assert.deepEqual(first.localization, candidate.localization, `${label}: localization metadata drift`);
      assert.equal(first.canonicalAnswer, candidate.canonicalAnswer, `${label}: canonical-answer drift`);
      assert.equal(first.verifierAnswer, candidate.verifierAnswer, `${label}: verifier-answer drift`);
      assert.equal(first.canonicalAnswer, first.verifierAnswer, `${label}: verifier mismatch`);
      assert.ok(first.explanation.finalAnswer.includes(first.canonicalAnswer), `${label}: explanation answer binding`);
      assert.equal(first.options.length, candidate.options.length, `${label}: option-count drift`);
      for (let index = 0; index < candidate.options.length; index += 1) {
        assert.equal(first.options[index]?.value, candidate.options[index]?.value, `${label}: option-value drift ${index}`);
        assert.equal(first.options[index]?.isCorrect, candidate.options[index]?.isCorrect, `${label}: option-key drift ${index}`);
        assert.equal(first.options[index]?.misconceptionId, candidate.options[index]?.misconceptionId, `${label}: misconception drift ${index}`);
      }
      assert.equal(first.options[first.correctIndex]?.value, first.canonicalAnswer, `${label}: correct option binding`);
      structuralParityChecks += 1;

      assert.equal(candidate.lifecycle.reviewStatus, "MULTILINGUAL_REVIEW_CANDIDATE", `${label}: candidate layer unexpectedly frozen`);
      assert.equal(candidate.lifecycle.localizationStatus, "HI_PA_REVIEW_CANDIDATE", `${label}: candidate localization unexpectedly frozen`);
      assert.equal(first.lifecycle.permanentQlId, qlId, `${label}: lifecycle QL drift`);
      assert.equal(first.lifecycle.maturity, "PERMANENT_AUTHORITY", `${label}: maturity drift`);
      assert.equal(first.lifecycle.reviewStatus, "MULTILINGUAL_FROZEN", `${label}: multilingual freeze missing`);
      assert.equal(first.lifecycle.englishAuthorityStatus, "ENGLISH_FROZEN", `${label}: English freeze regression`);
      assert.equal(first.lifecycle.localizationStatus, "HI_PA_FROZEN", `${label}: Hindi/Punjabi freeze missing`);
      assert.equal(first.lifecycle.questionBankStatus, "NOT_STORED", `${label}: Question Bank status drift`);
      assert.equal(first.lifecycle.testEligibility, "INELIGIBLE", `${label}: test-eligibility label drift`);
      assert.equal(first.lifecycle.active, false, `${label}: active gate opened`);
      assert.equal(first.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
      assert.equal(first.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
      assert.equal(first.lifecycle.testEligible, false, `${label}: test gate opened`);
      assert.equal(first.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
      frozenLifecycleChecks += 1;

      const learnerText = [first.stem, first.explanation.coreConcept, first.explanation.strategy, ...first.explanation.steps, first.explanation.finalAnswer].join(" ");
      assert.match(learnerText, targetScript[language], `${label}: target script missing`);
      assert.doesNotMatch(learnerText, residualEnglish, `${label}: residual English learner vocabulary`);
      assert.doesNotMatch(learnerText, terminologyDefect, `${label}: superseded localization terminology`);
      assert.doesNotMatch(learnerText, implementationLeak, `${label}: implementation vocabulary leak`);
      assert.doesNotMatch(learnerText, /\b(?:undefined|null|NaN)\b/u, `${label}: malformed learner value`);
      assert.doesNotMatch(learnerText, /\uFFFD/u, `${label}: Unicode replacement character`);
      assert.ok(first.stem.trim().length >= 20, `${label}: stem too thin`);
      assert.ok(first.explanation.coreConcept.trim().length >= 20, `${label}: concept too thin`);
      assert.ok(first.explanation.strategy.trim().length >= 20, `${label}: strategy too thin`);
      assert.ok(first.explanation.steps.length >= 2 && first.explanation.steps.length <= 6, `${label}: explanation-step count`);
      wordingChecks += 1;
      packages += 1;
      stems.add(first.stem);
    }
    assert.ok(stems.size >= 60, `${qlId}/${language}: frozen stem diversity too low (${stems.size})`);
    stemDiversity.set(`${qlId}/${language}`, stems.size);

    const sampleSeed = 1 + ((Number(qlId.slice(-3)) * 7 + (language === "hi" ? 5 : 17)) % 120);
    const q = generateNumCp009LocalizedHumanFinal(qlId, sampleSeed, language);
    reviewRows.push({ qlId, language, seed: sampleSeed, prototypeId: q.temporaryPrototypeId, difficulty: q.difficulty, lifecycle: q.lifecycle, stem: q.stem, options: q.options, explanation: q.explanation });
    reviewMarkdown.push(`## ${qlId} · ${language === "hi" ? "Hindi" : "Punjabi"} · seed ${sampleSeed}`);
    reviewMarkdown.push("");
    reviewMarkdown.push(q.stem);
    reviewMarkdown.push("");
    q.options.forEach((option, index) => reviewMarkdown.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`));
    reviewMarkdown.push("");
    reviewMarkdown.push(`**Concept / ਧਾਰਣਾ:** ${q.explanation.coreConcept}`);
    reviewMarkdown.push("");
    reviewMarkdown.push(`**Approach / ਤਰੀਕਾ:** ${q.explanation.strategy}`);
    reviewMarkdown.push("");
    q.explanation.steps.forEach((step, index) => reviewMarkdown.push(`${index + 1}. ${step}`));
    reviewMarkdown.push("");
    reviewMarkdown.push(`**Answer / ਉੱਤਰ:** ${q.explanation.finalAnswer}`);
    reviewMarkdown.push("");
  }
}

assert.equal(packages, 12 * 120 * 2);
assert.equal(structuralParityChecks, packages);
assert.equal(wordingChecks, packages);
assert.equal(frozenLifecycleChecks, packages);

const outDir = resolve("dist/quant-v4/num-002-cp009-hi-pa-localization");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "num-cp009-hi-pa-human-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "num-cp009-hi-pa-human-review.md"), `${reviewMarkdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP009_HI_PA_MULTILINGUAL_FROZEN",
  permanentAuthorities: NUM_CP009_PERMANENT_ALLOCATION.length,
  languages,
  packages,
  structuralParityChecks,
  wordingChecks,
  frozenLifecycleChecks,
  stemDiversity: Object.fromEntries(stemDiversity),
  frozenReviewSamples: reviewRows.length,
  answerKeyChanges: 0,
  downstreamLifecycleActivations: 0,
  nextAvailableQl: "NUM-QL-197",
}, null, 2));
