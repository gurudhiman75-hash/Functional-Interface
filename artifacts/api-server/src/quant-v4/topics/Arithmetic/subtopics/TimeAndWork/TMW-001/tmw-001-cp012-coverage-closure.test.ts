import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { add, compare, equals, rational, reciprocal, subtract } from "./foundation/rational";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const qls = ["TMW-QL-212", "TMW-QL-213", "TMW-QL-214", "TMW-QL-215"] as const;
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4"] as const;
let checked = 0;

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp012:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      checked += 1;

      assert(question.canonicalProblemId === "TMW-CP-012", `${qlId}:${language}: wrong canonical problem ID`);
      assert(question.questionLanguageId === qlId, `${qlId}:${language}: wrong QL identity`);
      assert(question.language === language, `${qlId}:${language}: language identity mismatch`);
      assert(question.learnerExplanationVersion === "TMW_COVERAGE_V1", `${qlId}:${language}: wrong learner explanation version`);
      assert(question.publiclyPublishable === false, `${qlId}:${language}: publication lock was lost`);
      assert(question.validation?.valid, `${qlId}:${language}:${seedSuffix}: ${question.validation?.errors?.join(" | ")}`);
      assert(question.options.length === 4, `${qlId}:${language}: expected four options`);
      assert(new Set(question.options).size === 4, `${qlId}:${language}: options are not unique`);
      assert(question.options[question.correctIndex] === question.solution.answerText, `${qlId}:${language}: correct option and answer text differ`);
      assert(question.optionAudit[question.correctIndex]?.misconceptionId === "CORRECT", `${qlId}:${language}: correct option audit is wrong`);
      assert(question.explanation.steps.length >= 3, `${qlId}:${language}: learner working is too brief`);
      assert(question.explanation.givens.length >= 2, `${qlId}:${language}: learner givens are incomplete`);
      const learner = [question.stem, question.explanation.opening, question.explanation.formula, ...question.explanation.steps, question.explanation.conclusion].join(" ");
      assert(!/Continue the calculation|After simplification|Substitute the work, rate and time/i.test(learner), `${qlId}:${language}: generic legacy learner wording returned`);
      assert(!/undefined|null|NaN|Infinity|\{\{|\$\{/.test(learner), `${qlId}:${language}: unresolved learner value`);
      assert(question.stem.trim().split(/\s+/u).filter(Boolean).length <= 70, `${qlId}:${language}: stem exceeds 70 whitespace tokens`);

      const p = question.parameters;
      const answer = question.solution.answer;
      if (qlId === "TMW-QL-212") {
        assert(
          equals(add(reciprocal(p.subgroupTime), reciprocal(answer)), reciprocal(p.allTogetherTime)),
          `${qlId}:${language}: subgroup inverse invariant failed`,
        );
        assert(/A.*B.*C/s.test(question.stem), `${qlId}:${language}: three-agent ownership is not explicit`);
      } else if (qlId === "TMW-QL-213") {
        assert(equals(answer, p.changedCombinedTime), `${qlId}:${language}: changed team time mismatch`);
        assert(compare(p.changedCombinedTime, p.originalCombinedTime) < 0, `${qlId}:${language}: efficiency increase did not reduce completion time`);
      } else if (qlId === "TMW-QL-214") {
        assert(equals(add(answer, p.changedCombinedTime), p.originalCombinedTime), `${qlId}:${language}: time-saved invariant failed`);
        assert(compare(answer, rational(0)) > 0, `${qlId}:${language}: time saved is not positive`);
      } else {
        assert(equals(answer, subtract(p.changedCombinedTime, p.originalCombinedTime)), `${qlId}:${language}: delay invariant failed`);
        assert(compare(p.changedCombinedTime, p.originalCombinedTime) > 0, `${qlId}:${language}: efficiency decrease did not delay completion`);
      }
    }
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-012",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  checked,
  coverage: [
    "all-together + subgroup -> excluded individual",
    "new combined time after one member becomes more efficient",
    "time saved after one member becomes more efficient",
    "delay after one member becomes less efficient",
  ],
  verdict: "PASS",
}, null, 2));
