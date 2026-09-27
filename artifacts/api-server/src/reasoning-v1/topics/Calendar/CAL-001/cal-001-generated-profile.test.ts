import assert from "node:assert/strict";
import { CALENDAR_PERMANENT_QL_IDS } from "./permanent-contracts.ts";
import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { runCal001QuestionStudioPipeline } from "./question-studio-runtime.ts";

const languages = ["en", "hi", "pa"] as const;
const seedsPerQl = 12;
let learnerSurfaces = 0;
let prototypePackages = 0;

for (const qlId of CALENDAR_PERMANENT_QL_IDS) {
  for (const language of languages) {
    const stems = new Set<string>();
    const fingerprints = new Set<string>();
    const answerPositions = new Set<number>();

    for (let seedIndex = 0; seedIndex < seedsPerQl; seedIndex++) {
      const pkg = runCal001QuestionStudioPipeline(qlId, {
        language,
        seed: `cal-profile:${qlId}:${language}:${seedIndex}`,
      });

      stems.add(pkg.stem);
      fingerprints.add(pkg.traceability.mathematicalFingerprint);
      answerPositions.add(pkg.correctIndex);

      assert(pkg.stem.trim().length >= 12, `${qlId} ${language}: stem is too thin.`);
      assert(pkg.explanation.lines.length >= 2 && pkg.explanation.lines.length <= 8,
        `${qlId} ${language}: learner explanation is not concise.`);
      assert.equal(pkg.options.length, 4, `${qlId} ${language}: wrong option count.`);
      assert.equal(new Set(pkg.options).size, 4, `${qlId} ${language}: duplicate option display.`);
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer, `${qlId} ${language}: answer mismatch.`);

      const learnerText = [pkg.stem, ...pkg.explanation.lines].join(" ");
      assert(!/prototype|authority|fingerprint|generationAttempt|CAL-PQL|CAL-QL/i.test(learnerText),
        `${qlId} ${language}: internal implementation vocabulary leaked.`);

      learnerSurfaces++;
    }

    // Calendar instances should materially vary across repeated generation.
    assert(stems.size >= 3, `${qlId} ${language}: weak visible stem diversity (${stems.size}/${seedsPerQl}).`);
    assert(fingerprints.size >= 3, `${qlId} ${language}: weak semantic instance diversity (${fingerprints.size}/${seedsPerQl}).`);
    assert(answerPositions.size >= 2, `${qlId} ${language}: answer position is overly fixed.`);
  }
}

// Normal (non-source-gap) Calendar authorities must continue to derive every
// wrong option from an explicit learner misconception, not arbitrary neighbours.
for (const definition of CALENDAR_PROTOTYPES) {
  for (let seed = 0; seed < 8; seed++) {
    const pkg = generateCalendarQuestion(definition.id, 91000 + seed, "en-IN");
    for (const option of pkg.options) {
      if (option.isCorrect) continue;
      assert(option.misconceptionId, `${definition.id}: distractor has no misconception provenance.`);
      assert(option.derivation && Object.keys(option.derivation).length > 0,
        `${definition.id}: distractor has no derivation evidence.`);
    }
    prototypePackages++;
  }
}

console.log(JSON.stringify({
  status: "PASS_CAL_001_GENERATED_PROFILE",
  qlCount: CALENDAR_PERMANENT_QL_IDS.length,
  languages,
  seedsPerQl,
  learnerSurfaces,
  prototypePackages,
  minimumStemVariantsPerQlLocale: 3,
  minimumFingerprintVariantsPerQlLocale: 3,
  misconceptionDerivedDistractors: true,
}, null, 2));
