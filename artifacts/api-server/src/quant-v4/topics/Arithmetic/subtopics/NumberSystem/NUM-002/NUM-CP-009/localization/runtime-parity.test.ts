import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP009_PERMANENT_ALLOCATION, type NumCp009PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp009Permanent } from "../permanent-runtime.ts";
import { generateNumCp009Localized, localizeNumCp009Answer } from "./runtime.ts";
import type { NumCp009LocalizedLanguage } from "./types.ts";

const languages = ["hi", "pa"] as const satisfies readonly NumCp009LocalizedLanguage[];
const scriptPattern = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;
const residualEnglish = /\b(?:what|which|find|last|unit|digit|digits|power|powers|cycle|answer|complete|set|positive|integer|choose|final|term|terms|sum|difference|product|residue|modulo|possible|impossible|range|count|given|only|therefore|because|position|positions)\b/iu;
const implementationLeak = /prototype|generator|fingerprint|hidden state|source seed|authority package|question studio|question bank/iu;

let packages = 0;
let replayChecks = 0;
let semanticParityChecks = 0;
let optionParityChecks = 0;
let languageQualityChecks = 0;
const stemDiversity = new Map<string, number>();
const prototypeReach = new Map<string, readonly string[]>();
const reviewRows: unknown[] = [];
const reviewMarkdown: string[] = [
  "# NUM-CP-009 Hindi/Punjabi localization review candidate",
  "",
  "One learner-facing sample per permanent QL and language. Mathematics and answer keys are inherited unchanged from frozen English authority.",
  "",
];

for (const allocation of NUM_CP009_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp009PermanentQlId;
  const allowedPrototypes = new Set(allocation.sourceSlices.map((slice) => slice.prototypeId));
  const sourcePrototypeReach = new Set<string>();

  for (const language of languages) {
    const stems = new Set<string>();
    const localePrototypeReach = new Set<string>();

    for (let seed = 1; seed <= 120; seed += 1) {
      const source = generateNumCp009Permanent(qlId, seed);
      const first = generateNumCp009Localized(qlId, seed, language);
      const second = generateNumCp009Localized(qlId, seed, language);
      const label = `${qlId}/${language}/${seed}`;

      assert.deepEqual(first, second, `${label}: deterministic replay drift`);
      replayChecks += 1;

      assert.equal(first.permanentQlId, source.permanentQlId, `${label}: permanent QL drift`);
      assert.equal(first.authorityId, source.authorityId, `${label}: authority drift`);
      assert.equal(first.temporaryPrototypeId, source.temporaryPrototypeId, `${label}: prototype drift`);
      assert.ok(allowedPrototypes.has(first.temporaryPrototypeId), `${label}: prototype outside authority`);
      assert.equal(first.seed, source.seed, `${label}: seed drift`);
      assert.equal(first.sourceSeed, source.sourceSeed, `${label}: source-seed drift`);
      assert.equal(first.difficulty, source.difficulty, `${label}: difficulty drift`);
      assert.equal(first.answerSemantic, source.answerSemantic, `${label}: answer-semantic drift`);
      assert.equal(first.sourceAnswerSemantic, source.sourceAnswerSemantic, `${label}: source answer-semantic drift`);
      assert.equal(first.representation, source.representation, `${label}: representation drift`);
      assert.deepEqual(first.hiddenState, source.hiddenState, `${label}: mathematical-state drift`);
      assert.equal(first.mathematicalFingerprint, source.mathematicalFingerprint, `${label}: fingerprint drift`);
      assert.equal(first.correctIndex, source.correctIndex, `${label}: correct-index drift`);
      assert.deepEqual(first.sourceAncestry, source.sourceAncestry, `${label}: source-ancestry drift`);
      assert.deepEqual(first.prototypeAncestry, source.prototypeAncestry, `${label}: prototype-ancestry drift`);
      assert.equal(first.canonicalAnswer, localizeNumCp009Answer(source.canonicalAnswer, language), `${label}: canonical-answer drift`);
      assert.equal(first.verifierAnswer, localizeNumCp009Answer(source.verifierAnswer, language), `${label}: verifier-answer drift`);
      assert.equal(first.canonicalAnswer, source.canonicalAnswer, `${label}: answer key must remain byte-identical`);
      assert.equal(first.canonicalAnswer, first.verifierAnswer, `${label}: localized verifier mismatch`);
      semanticParityChecks += 1;

      assert.equal(first.options.length, source.options.length, `${label}: option-count drift`);
      assert.equal(new Set(first.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
      assert.equal(first.options.filter((option) => option.isCorrect).length, 1, `${label}: keyed-answer count`);
      assert.equal(first.options[first.correctIndex]?.value, first.canonicalAnswer, `${label}: correct-option binding`);
      for (let index = 0; index < source.options.length; index += 1) {
        assert.equal(first.options[index]?.value, source.options[index]?.value, `${label}: option-value drift ${index}`);
        assert.equal(first.options[index]?.isCorrect, source.options[index]?.isCorrect, `${label}: option-key drift ${index}`);
        assert.equal(first.options[index]?.misconceptionId, source.options[index]?.misconceptionId, `${label}: misconception drift ${index}`);
      }
      optionParityChecks += 1;

      assert.equal(first.locale, language === "hi" ? "hi-IN" : "pa-IN", `${label}: locale drift`);
      assert.equal(first.language, language, `${label}: language drift`);
      assert.equal(first.localization.version, "num-cp009-hi-pa-human-v1");
      assert.equal(first.localization.canonicalLocale, "en-IN");
      assert.equal(first.localization.canonicalQuestionId, qlId);
      assert.equal(first.localization.mathematicalStatePreserved, true);
      assert.equal(first.localization.optionOrderPreserved, true);
      assert.equal(first.localization.correctIndexPreserved, true);
      assert.equal(first.localization.misconceptionMappingPreserved, true);
      assert.equal(first.localization.answerKeyPreserved, true);
      assert.equal(first.localization.englishAuthorityFrozen, true);
      assert.equal(first.localization.lifecycleLocked, true);

      assert.equal(first.lifecycle.maturity, "PERMANENT_AUTHORITY");
      assert.equal(first.lifecycle.reviewStatus, "MULTILINGUAL_REVIEW_CANDIDATE");
      assert.equal(first.lifecycle.englishAuthorityStatus, "ENGLISH_FROZEN");
      assert.equal(first.lifecycle.localizationStatus, "HI_PA_REVIEW_CANDIDATE");
      assert.equal(first.lifecycle.questionBankStatus, "NOT_STORED");
      assert.equal(first.lifecycle.testEligibility, "INELIGIBLE");
      assert.equal(first.lifecycle.active, false);
      assert.equal(first.lifecycle.questionStudioDiscoverable, false);
      assert.equal(first.lifecycle.questionBankWritable, false);
      assert.equal(first.lifecycle.testEligible, false);
      assert.equal(first.lifecycle.publiclyPublishable, false);

      assert.ok(first.explanation.finalAnswer.includes(first.canonicalAnswer), `${label}: explanation answer binding`);
      assert.ok(first.explanation.coreConcept.trim().length >= 20, `${label}: concept too thin`);
      assert.ok(first.explanation.strategy.trim().length >= 20, `${label}: strategy too thin`);
      assert.ok(first.explanation.steps.length >= 2 && first.explanation.steps.length <= 6, `${label}: explanation-step count`);
      assert.ok(first.stem.trim().length >= 20, `${label}: stem too thin`);
      assert.notEqual(first.stem, source.stem, `${label}: untranslated English stem`);

      const learnerText = [
        first.stem,
        first.explanation.coreConcept,
        first.explanation.strategy,
        ...first.explanation.steps,
        first.explanation.finalAnswer,
      ].join(" ");
      assert.match(learnerText, scriptPattern[language], `${label}: target script missing`);
      assert.doesNotMatch(learnerText, residualEnglish, `${label}: residual English learner vocabulary`);
      assert.doesNotMatch(learnerText, implementationLeak, `${label}: implementation vocabulary leak`);
      assert.doesNotMatch(learnerText, /\b(?:undefined|null|NaN)\b/u, `${label}: malformed learner value`);
      assert.doesNotMatch(learnerText, /\uFFFD/u, `${label}: Unicode replacement character`);
      languageQualityChecks += 1;

      stems.add(first.stem);
      localePrototypeReach.add(first.temporaryPrototypeId);
      sourcePrototypeReach.add(source.temporaryPrototypeId);
      packages += 1;
    }

    assert.ok(stems.size >= 60, `${qlId}/${language}: insufficient localized stem diversity (${stems.size})`);
    assert.deepEqual([...localePrototypeReach].sort(), [...allowedPrototypes].sort(), `${qlId}/${language}: prototype reach drift`);
    stemDiversity.set(`${qlId}/${language}`, stems.size);

    const sampleSeed = 1 + ((Number(qlId.slice(-3)) + (language === "hi" ? 7 : 19)) % 120);
    const sample = generateNumCp009Localized(qlId, sampleSeed, language);
    reviewRows.push({ qlId, language, seed: sampleSeed, prototypeId: sample.temporaryPrototypeId, difficulty: sample.difficulty, stem: sample.stem, options: sample.options, explanation: sample.explanation });
    reviewMarkdown.push(`## ${qlId} · ${language === "hi" ? "Hindi" : "Punjabi"} · seed ${sampleSeed}`);
    reviewMarkdown.push("");
    reviewMarkdown.push(sample.stem);
    reviewMarkdown.push("");
    sample.options.forEach((option, index) => reviewMarkdown.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`));
    reviewMarkdown.push("");
    reviewMarkdown.push(`**Concept / ਧਾਰਣਾ:** ${sample.explanation.coreConcept}`);
    reviewMarkdown.push("");
    reviewMarkdown.push(`**Approach / ਤਰੀਕਾ:** ${sample.explanation.strategy}`);
    reviewMarkdown.push("");
    sample.explanation.steps.forEach((step, index) => reviewMarkdown.push(`${index + 1}. ${step}`));
    reviewMarkdown.push("");
    reviewMarkdown.push(`**Answer / ਉੱਤਰ:** ${sample.explanation.finalAnswer}`);
    reviewMarkdown.push("");
  }

  assert.deepEqual([...sourcePrototypeReach].sort(), [...allowedPrototypes].sort(), `${qlId}: source prototype coverage drift`);
  prototypeReach.set(qlId, [...sourcePrototypeReach].sort());
}

assert.equal(packages, 12 * 120 * 2);
assert.equal(replayChecks, packages);
assert.equal(semanticParityChecks, packages);
assert.equal(optionParityChecks, packages);
assert.equal(languageQualityChecks, packages);

const outDir = resolve("dist/quant-v4/num-002-cp009-hi-pa-localization");
mkdirSync(outDir, { recursive: true });
const audit = {
  status: "PASS_NUM_CP009_HI_PA_REVIEW_CANDIDATE",
  permanentAuthorities: NUM_CP009_PERMANENT_ALLOCATION.length,
  languages,
  packages,
  replayChecks,
  semanticParityChecks,
  optionParityChecks,
  languageQualityChecks,
  stemDiversity: Object.fromEntries(stemDiversity),
  prototypeReach: Object.fromEntries(prototypeReach),
  answerKeyChanges: 0,
  downstreamLifecycleActivations: 0,
  nextAvailableQl: "NUM-QL-197",
};
writeFileSync(resolve(outDir, "num-cp009-hi-pa-audit.json"), `${JSON.stringify(audit, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "num-cp009-hi-pa-review.json"), `${JSON.stringify(reviewRows, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "num-cp009-hi-pa-review.md"), `${reviewMarkdown.join("\n")}\n`, "utf8");
console.log(JSON.stringify(audit, null, 2));
