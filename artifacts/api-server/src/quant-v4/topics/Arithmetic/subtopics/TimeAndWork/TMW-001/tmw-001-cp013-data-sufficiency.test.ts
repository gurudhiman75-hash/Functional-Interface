import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const EXPECTED = {
  "TMW-QL-216": "I_ONLY",
  "TMW-QL-217": "II_ONLY",
  "TMW-QL-218": "TOGETHER_ONLY",
  "TMW-QL-219": "EVEN_TOGETHER_INSUFFICIENT",
  "TMW-QL-220": "I_ONLY",
  "TMW-QL-221": "II_ONLY",
  "TMW-QL-222": "TOGETHER_ONLY",
  "TMW-QL-223": "EVEN_TOGETHER_INSUFFICIENT",
} as const;

const qls = Object.keys(EXPECTED) as Array<keyof typeof EXPECTED>;
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4"] as const;
let checked = 0;
const classCounts = new Map<string, number>();

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp013:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      checked += 1;
      classCounts.set(question.canonicalClass, (classCounts.get(question.canonicalClass) ?? 0) + 1);

      assert(question.canonicalProblemId === "TMW-CP-013", `${qlId}:${language}: wrong checkpoint`);
      assert(question.questionLanguageId === qlId, `${qlId}:${language}: wrong QL identity`);
      assert(question.language === language, `${qlId}:${language}: language mismatch`);
      assert(question.representation === "DATA_SUFFICIENCY", `${qlId}:${language}: wrong representation`);
      assert(question.answerSemantic === "DATA_SUFFICIENCY_CLASS", `${qlId}:${language}: wrong answer semantic`);
      assert(question.learnerExplanationVersion === "TMW_DS_V1", `${qlId}:${language}: wrong learner version`);
      assert(question.publiclyPublishable === false, `${qlId}:${language}: publication lock lost`);
      assert(question.validation?.valid, `${qlId}:${language}:${seedSuffix}: ${question.validation?.errors?.join(" | ")}`);
      assert(question.canonicalClass === EXPECTED[qlId], `${qlId}:${language}: expected ${EXPECTED[qlId]}, got ${question.canonicalClass}`);
      assert(question.canonicalAnswer === question.verifierAnswer, `${qlId}:${language}: verifier disagrees`);
      assert(question.options.length === 4, `${qlId}:${language}: expected four options`);
      assert(new Set(question.options).size === 4, `${qlId}:${language}: options are not unique`);
      assert(question.options[question.correctIndex] === question.canonicalAnswer, `${qlId}:${language}: answer-option mismatch`);
      assert(question.optionAudit[question.correctIndex]?.misconceptionId === "CORRECT", `${qlId}:${language}: correct audit mismatch`);
      assert(/Statement I:|कथन I:|ਕਥਨ I:/.test(question.stem), `${qlId}:${language}: Statement I missing`);
      assert(/Statement II:|कथन II:|ਕਥਨ II:/.test(question.stem), `${qlId}:${language}: Statement II missing`);
      assert(question.explanation.steps.length >= 4, `${qlId}:${language}: DS explanation is too thin`);
      assert(question.explanation.givens.length === 2, `${qlId}:${language}: DS candidate-set givens missing`);
      assert(question.stem.trim().split(/\s+/u).filter(Boolean).length <= 95, `${qlId}:${language}: DS stem too long`);

      const state = question.hiddenState;
      const iUnique = state.iCandidates.length === 1;
      const iiUnique = state.iiCandidates.length === 1;
      const combinedUnique = state.combinedCandidates.length === 1;
      if (question.canonicalClass === "I_ONLY") {
        assert(iUnique && !iiUnique, `${qlId}:${language}: I_ONLY candidate-set proof failed`);
      } else if (question.canonicalClass === "II_ONLY") {
        assert(!iUnique && iiUnique, `${qlId}:${language}: II_ONLY candidate-set proof failed`);
      } else if (question.canonicalClass === "TOGETHER_ONLY") {
        assert(!iUnique && !iiUnique && combinedUnique, `${qlId}:${language}: TOGETHER_ONLY candidate-set proof failed`);
      } else {
        assert(!iUnique && !iiUnique && !combinedUnique, `${qlId}:${language}: EVEN_TOGETHER candidate-set proof failed`);
      }
    }
  }
}

for (const expectedClass of ["I_ONLY", "II_ONLY", "TOGETHER_ONLY", "EVEN_TOGETHER_INSUFFICIENT"] as const) {
  assert((classCounts.get(expectedClass) ?? 0) === 30, `Expected 30 ${expectedClass} cases, got ${classCounts.get(expectedClass) ?? 0}`);
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-013",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  checked,
  classCounts: Object.fromEntries(classCounts),
  families: [
    "combined rates",
    "efficiency relation",
    "staged participation",
    "workforce schedule",
    "heterogeneous workers",
    "wage contribution",
    "pipes and leak",
    "variable productivity",
  ],
  verdict: "PASS",
}, null, 2));
