import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const EXPECTED = {
  "TMW-QL-216": "I_ONLY",
  "TMW-QL-217": "II_ONLY",
  "TMW-QL-218": "TOGETHER_ONLY",
  "TMW-QL-219": "EVEN_TOGETHER_INSUFFICIENT",
  "TMW-QL-220": "EITHER_ALONE",
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
      const seed = `tmw-cp013:${qlId}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      checked += 1;
      classCounts.set(question.canonicalClass, (classCounts.get(question.canonicalClass) ?? 0) + 1);

      assert(question.canonicalProblemId === "TMW-CP-013", `${qlId}:${language}: wrong checkpoint`);
      assert(question.questionLanguageId === qlId, `${qlId}:${language}: wrong QL identity`);
      assert(question.language === language, `${qlId}:${language}: language mismatch`);
      assert(question.representation === "DATA_SUFFICIENCY", `${qlId}:${language}: wrong representation`);
      assert(question.answerSemantic === "DATA_SUFFICIENCY_CLASS", `${qlId}:${language}: wrong answer semantic`);
      assert(question.learnerExplanationVersion === "TMW_DS_V2", `${qlId}:${language}: wrong learner version`);
      assert(question.publiclyPublishable === false, `${qlId}:${language}: publication lock lost`);
      assert(question.validation?.valid, `${qlId}:${language}:${seedSuffix}: ${question.validation?.errors?.join(" | ")}`);
      assert(question.canonicalClass === EXPECTED[qlId], `${qlId}:${language}: expected ${EXPECTED[qlId]}, got ${question.canonicalClass}`);
      assert(question.canonicalAnswer === question.verifierAnswer, `${qlId}:${language}: verifier disagrees`);
      assert(question.options.length === 5, `${qlId}:${language}: expected five banking-style options`);
      assert(new Set(question.options).size === 5, `${qlId}:${language}: options are not unique`);
      assert(question.correctIndex >= 0 && question.correctIndex < 5, `${qlId}:${language}: invalid correctIndex`);
      assert(question.options[question.correctIndex] === question.canonicalAnswer, `${qlId}:${language}: answer-option mismatch`);
      assert(question.optionAudit[question.correctIndex]?.misconceptionId === "CORRECT", `${qlId}:${language}: correct audit mismatch`);
      assert(/Statement I:|कथन I:|ਕਥਨ I:/.test(question.stem), `${qlId}:${language}: Statement I missing`);
      assert(/Statement II:|कथन II:|ਕਥਨ II:/.test(question.stem), `${qlId}:${language}: Statement II missing`);
      assert(question.explanation.steps.length >= 2, `${qlId}:${language}: DS explanation is too thin`);
      assert(question.explanation.givens.length === 2, `${qlId}:${language}: independent statement checks missing`);
      assert(question.explanation.shortcut.steps.length === 3, `${qlId}:${language}: three-stage DS rule missing`);
      assert(question.learnerExplanation?.solution?.length >= 4, `${qlId}:${language}: learner explanation missing`);
      assert(question.stem.trim().split(/\s+/u).filter(Boolean).length <= 105, `${qlId}:${language}: DS stem too long`);

      const state = question.hiddenState;
      const independentlyVerified = state.iUnique && state.iiUnique
        ? "EITHER_ALONE"
        : state.iUnique
          ? "I_ONLY"
          : state.iiUnique
            ? "II_ONLY"
            : state.combinedUnique
              ? "TOGETHER_ONLY"
              : "EVEN_TOGETHER_INSUFFICIENT";
      assert(independentlyVerified === question.canonicalClass, `${qlId}:${language}: independent DS verifier failed`);
    }
  }
}

assert((classCounts.get("I_ONLY") ?? 0) === 15, "I_ONLY coverage mismatch");
assert((classCounts.get("II_ONLY") ?? 0) === 30, "II_ONLY coverage mismatch");
assert((classCounts.get("EITHER_ALONE") ?? 0) === 15, "EITHER_ALONE coverage mismatch");
assert((classCounts.get("TOGETHER_ONLY") ?? 0) === 30, "TOGETHER_ONLY coverage mismatch");
assert((classCounts.get("EVEN_TOGETHER_INSUFFICIENT") ?? 0) === 30, "EVEN_TOGETHER coverage mismatch");

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-013",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  checked,
  classCounts: Object.fromEntries(classCounts),
  optionScheme: "FIVE_CLASS_BANKING_DS",
  verdict: "PASS",
}, null, 2));