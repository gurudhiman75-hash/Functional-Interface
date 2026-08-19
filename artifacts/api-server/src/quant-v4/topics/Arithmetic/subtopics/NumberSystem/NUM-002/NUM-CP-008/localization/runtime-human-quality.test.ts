import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP008_PERMANENT_ALLOCATION } from "../permanent-allocation.ts";
import type { NumCp008PermanentQlId } from "../permanent-runtime.ts";
import { generateNumCp008Localized } from "./runtime.ts";
import { generateNumCp008LocalizedHumanFinal } from "./runtime-human-final.ts";
import type { NumCp008LocalizedLanguage } from "./types.ts";

const languages = ["hi", "pa"] as const satisfies readonly NumCp008LocalizedLanguage[];
const targetScript = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
} as const;
const ambiguousReduction = /से घटा(?:ने|एँ)|क्रमिक वर्गीकरण|घटे हुए समीकरण|ਨਾਲ ਘਟਾ(?:ਉਣ|ਓ)|ਘਟੇ ਸਮੀਕਰਨ/u;
const implementationLeak = /prototype|generator|fingerprint|hidden state|authority package/iu;

let packages = 0;
let structuralParityChecks = 0;
let wordingChecks = 0;

for (const allocation of NUM_CP008_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp008PermanentQlId;
  for (const language of languages) {
    for (let seed = 1; seed <= 120; seed += 1) {
      const source = generateNumCp008Localized(qlId, seed, language);
      const first = generateNumCp008LocalizedHumanFinal(qlId, seed, language);
      const second = generateNumCp008LocalizedHumanFinal(qlId, seed, language);
      const label = `${qlId}/${language}/${seed}`;

      assert.deepEqual(first, second, `${label}: human-final deterministic replay drift`);
      assert.equal(first.permanentQlId, source.permanentQlId, `${label}: permanent QL drift`);
      assert.equal(first.temporaryPrototypeId, source.temporaryPrototypeId, `${label}: prototype drift`);
      assert.equal(first.seed, source.seed, `${label}: seed drift`);
      assert.equal(first.locale, source.locale, `${label}: locale drift`);
      assert.equal(first.language, source.language, `${label}: language drift`);
      assert.equal(first.difficulty, source.difficulty, `${label}: difficulty drift`);
      assert.equal(first.answerSemantic, source.answerSemantic, `${label}: answer semantic drift`);
      assert.equal(first.representation, source.representation, `${label}: representation drift`);
      assert.deepEqual(first.hiddenState, source.hiddenState, `${label}: hidden-state drift`);
      assert.equal(first.mathematicalFingerprint, source.mathematicalFingerprint, `${label}: mathematical fingerprint drift`);
      assert.equal(first.correctIndex, source.correctIndex, `${label}: correct-index drift`);
      assert.deepEqual(first.sourceAncestry, source.sourceAncestry, `${label}: source ancestry drift`);
      assert.deepEqual(first.prototypeAncestry, source.prototypeAncestry, `${label}: prototype ancestry drift`);
      assert.deepEqual(first.localization, source.localization, `${label}: localization metadata drift`);
      assert.deepEqual(first.lifecycle, source.lifecycle, `${label}: lifecycle drift`);
      assert.equal(first.canonicalAnswer, source.canonicalAnswer, `${label}: canonical-answer drift`);
      assert.equal(first.verifierAnswer, source.verifierAnswer, `${label}: verifier-answer drift`);
      assert.equal(first.explanation.finalAnswer, first.canonicalAnswer, `${label}: explanation answer binding`);
      assert.equal(first.options.length, source.options.length, `${label}: option count drift`);
      for (let index = 0; index < source.options.length; index += 1) {
        assert.equal(first.options[index]?.isCorrect, source.options[index]?.isCorrect, `${label}: option key drift ${index}`);
        assert.equal(first.options[index]?.misconceptionId, source.options[index]?.misconceptionId, `${label}: misconception drift ${index}`);
      }
      assert.equal(first.options[first.correctIndex]?.value, first.canonicalAnswer, `${label}: correct option binding`);
      structuralParityChecks += 1;

      const learnerText = [
        first.stem,
        ...first.options.map((option) => option.value),
        first.explanation.coreConcept,
        first.explanation.strategy,
        ...first.explanation.steps,
        first.explanation.finalAnswer,
      ].join(" ");
      assert.match(learnerText, targetScript[language], `${label}: target script missing`);
      assert.doesNotMatch(learnerText, ambiguousReduction, `${label}: ambiguous modular-reduction wording`);
      assert.doesNotMatch(learnerText, implementationLeak, `${label}: implementation vocabulary leak`);
      assert.doesNotMatch(learnerText, /\b(?:undefined|null|NaN)\b/u, `${label}: malformed learner value`);
      assert.ok(first.explanation.steps.length >= 2, `${label}: explanation too thin`);
      assert.ok(first.explanation.coreConcept.trim().length >= 20, `${label}: concept too thin`);
      assert.ok(first.explanation.strategy.trim().length >= 20, `${label}: strategy too thin`);
      wordingChecks += 1;
      packages += 1;
    }
  }
}

assert.equal(packages, 19 * 120 * 2);
assert.equal(structuralParityChecks, packages);
assert.equal(wordingChecks, packages);

const sampleSpecs = [
  { qlId: "NUM-QL-170", seed: 1, label: "compatible CRT" },
  { qlId: "NUM-QL-174", seed: 2, label: "complete bounded set" },
  { qlId: "NUM-QL-182", seed: 37, label: "data sufficiency" },
  { qlId: "NUM-QL-184", seed: 5, label: "bounded multiplicity" },
] as const;

const samples: unknown[] = [];
const markdown: string[] = [
  "# NUM-CP-008 Hindi/Punjabi human-quality spot review",
  "",
  "Advanced representative modes after learner-wording hardening.",
  "",
];

for (const spec of sampleSpecs) {
  for (const language of languages) {
    const q = generateNumCp008LocalizedHumanFinal(spec.qlId, spec.seed, language);
    const row = {
      label: spec.label,
      qlId: spec.qlId,
      seed: spec.seed,
      language,
      prototypeId: q.temporaryPrototypeId,
      difficulty: q.difficulty,
      stem: q.stem,
      options: q.options,
      explanation: q.explanation,
    };
    samples.push(row);
    markdown.push(`## ${spec.label} · ${spec.qlId} · ${language === "hi" ? "Hindi" : "Punjabi"}`);
    markdown.push("");
    markdown.push(q.stem);
    markdown.push("");
    q.options.forEach((option, index) => markdown.push(`${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`));
    markdown.push("");
    markdown.push(`**Concept:** ${q.explanation.coreConcept}`);
    markdown.push("");
    markdown.push(`**Approach:** ${q.explanation.strategy}`);
    markdown.push("");
    q.explanation.steps.forEach((step, index) => markdown.push(`${index + 1}. ${step}`));
    markdown.push("");
    markdown.push(`**Answer:** ${q.explanation.finalAnswer}`);
    markdown.push("");
  }
}

const outDir = resolve("dist/quant-v4/num-002-cp008-hi-pa-localization");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "num-cp008-hi-pa-human-review.json"), `${JSON.stringify(samples, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "num-cp008-hi-pa-human-review.md"), `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_HI_PA_HUMAN_QUALITY_V2",
  packages,
  structuralParityChecks,
  wordingChecks,
  advancedReviewSamples: samples.length,
  downstreamLifecycleActivations: 0,
}, null, 2));
for (const sample of samples) console.log("HUMAN_REVIEW_SAMPLE", JSON.stringify(sample, null, 2));
