import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import { validateTmwLearnerExplanationV2 } from "./foundation/learner-explanation-contract";

type Language = "en" | "hi" | "pa";
type Rational = { n: number; d: number };

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function reduce(n: number, d: number): Rational {
  assert(Number.isInteger(n) && Number.isInteger(d) && d !== 0, `Invalid rational ${n}/${d}`);
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: sign * n / g, d: Math.abs(d) / g };
}

function key(value: Rational): string {
  return `${value.n}/${value.d}`;
}

function expectedAnswer(question: any): Rational {
  const p = question.parameters;
  if (question.questionLanguageId === "TMW-QL-212") {
    const numerator = p.subgroupTime - p.allTime;
    const denominator = p.allTime * p.subgroupTime;
    const residual = reduce(numerator, denominator);
    return reduce(residual.d, residual.n);
  }

  const multiplier = p.direction === "INCREASE" ? 100 + p.percent : 100 - p.percent;
  const oldWorkTimesHundred = (p.a + p.b) * p.oldTime * 100;
  const newRateTimesHundred = p.a * multiplier + p.b * 100;
  const newTime = reduce(oldWorkTimesHundred, newRateTimesHundred);
  if (question.questionLanguageId === "TMW-QL-213") return newTime;

  const impactNumerator = Math.abs(p.oldTime * newTime.d - newTime.n);
  return reduce(impactNumerator, newTime.d);
}

function balancedMath(value: string): boolean {
  return (value.match(/\\\(/g) ?? []).length === (value.match(/\\\)/g) ?? []).length;
}

function hasNestedInlineMath(value: string): boolean {
  for (const match of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    if (/\\\(|\\\)/.test(match[1])) return true;
  }
  return false;
}

function mathContainsProse(value: string): boolean {
  for (const match of value.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    const noCommands = match[1].replace(/\\[A-Za-z]+/g, "");
    if (/[A-Za-z]{2,}/.test(noCommands)) return true;
  }
  return false;
}

const QLS = ["TMW-QL-212", "TMW-QL-213", "TMW-QL-214"] as const;
const LANGUAGES: readonly Language[] = ["en", "hi", "pa"];
const SEED_COUNT = 60;
const directions = new Set<string>();
const parameterSignatures = new Map<string, Set<string>>(QLS.map((qlId) => [qlId, new Set<string>()]));
const answerPositions = new Map<string, Set<number>>(QLS.map((qlId) => [qlId, new Set<number>()]));
let cases = 0;

for (const qlId of QLS) {
  for (const language of LANGUAGES) {
    for (let i = 0; i < SEED_COUNT; i += 1) {
      const seed = `tmw-cp012:${qlId}:${language}:${i}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, seed, language });
      const label = `${qlId}:${language}:${i}`;

      assert(question.canonicalProblemId === "TMW-CP-012", `${label}: wrong checkpoint routing`);
      assert(question.publiclyPublishable === false, `${label}: publication lock changed`);
      assert(question.validation?.valid, `${label}: ${(question.validation?.errors ?? []).join(" | ")}`);
      assert(question.options?.length === 4, `${label}: expected four options`);
      assert(new Set(question.options).size === 4, `${label}: options are not unique`);
      assert(question.correctIndex >= 0 && question.correctIndex < 4, `${label}: invalid correct index`);
      assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: correct option is not answer-aligned`);

      const independent = expectedAnswer(question);
      assert(question.solution.answerKey === key(independent), `${label}: independent mathematics disagrees: expected ${key(independent)}, got ${question.solution.answerKey}`);

      assert(question.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: learner version missing`);
      const learner = question.learnerExplanation;
      const learnerErrors = validateTmwLearnerExplanationV2(learner);
      assert(learnerErrors.length === 0, `${label}: learner contract failed: ${learnerErrors.join(" | ")}`);
      const visible = [learner.method, ...learner.solution, learner.answer].join(" ");
      assert(learner.answer.includes(question.solution.answerText), `${label}: learner answer omits solved answer`);
      assert(balancedMath(visible), `${label}: unbalanced MathJax`);
      assert(!hasNestedInlineMath(visible), `${label}: nested inline MathJax remains`);
      assert(!mathContainsProse(visible), `${label}: prose remains inside MathJax`);
      assert(learner.solution.length >= 2 && learner.solution.length <= 5, `${label}: expected 2-5 solution steps`);
      assert(question.stem.trim().endsWith("?"), `${label}: stem target is not an explicit question`);

      if (language === "hi") {
        assert(/[\u0900-\u097F]/u.test(question.stem), `${label}: Hindi stem lacks Devanagari`);
        assert(/[\u0900-\u097F]/u.test(visible), `${label}: Hindi explanation lacks Devanagari`);
      }
      if (language === "pa") {
        assert(/[\u0A00-\u0A7F]/u.test(question.stem), `${label}: Punjabi stem lacks Gurmukhi`);
        assert(/[\u0A00-\u0A7F]/u.test(visible), `${label}: Punjabi explanation lacks Gurmukhi`);
      }

      if (qlId === "TMW-QL-212") {
        assert(question.solveMode === "findExcludedAgentTimeFromAllTogetherAndSubgroup", `${label}: wrong solve mode`);
        if (language === "en") {
          assert(/A, B and C together/i.test(question.stem) && /A and B together/i.test(question.stem), `${label}: missing all-together/subgroup structure`);
          assert(/C alone/i.test(learner.answer), `${label}: answer does not name excluded agent`);
        }
      } else {
        directions.add(question.parameters.direction);
        if (language === "en") assert(/from the start/i.test(question.stem), `${label}: from-start efficiency change is not explicit`);
        if (qlId === "TMW-QL-213" && language === "en") {
          assert(/new team completion time/i.test(learner.answer), `${label}: new-team-time answer semantics missing`);
        }
        if (qlId === "TMW-QL-214" && language === "en") {
          const expectedWord = question.parameters.direction === "INCREASE" ? "saved" : "delayed";
          assert(new RegExp(expectedWord, "i").test(learner.answer), `${label}: schedule-impact direction is mislabeled`);
        }
      }

      parameterSignatures.get(qlId)?.add(JSON.stringify(question.parameters));
      answerPositions.get(qlId)?.add(question.correctIndex);
      cases += 1;
    }
  }
}

assert(directions.has("INCREASE") && directions.has("DECREASE"), "CP-012 efficiency pool did not exercise both increase and decrease cases");
for (const qlId of QLS) {
  const signatures = parameterSignatures.get(qlId)?.size ?? 0;
  assert(signatures >= (qlId === "TMW-QL-212" ? 6 : 5), `${qlId}: insufficient parameter diversity (${signatures})`);
  const positions = answerPositions.get(qlId)?.size ?? 0;
  assert(positions === 4, `${qlId}: answer shuffling did not exercise all four positions (${positions})`);
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-012",
  qls: QLS.length,
  languages: LANGUAGES.length,
  seedsPerQlLanguage: SEED_COUNT,
  cases,
  expectedCases: QLS.length * LANGUAGES.length * SEED_COUNT,
  directions: [...directions].sort(),
  parameterDiversity: Object.fromEntries([...parameterSignatures].map(([qlId, values]) => [qlId, values.size])),
  answerPositionDiversity: Object.fromEntries([...answerPositions].map(([qlId, values]) => [qlId, [...values].sort()])),
  verdict: "PASS",
}, null, 2));
