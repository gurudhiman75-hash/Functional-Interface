import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { validateTmwLearnerExplanationV2 } from "./foundation/learner-explanation-contract";
import { normalizeTmwLearnerDisplayTextR2 } from "./foundation/learner-explanation-r2-cp001-cp006";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const SEEDS = ["0", "1", "2"] as const;
const QL_IDS = Array.from({ length: 211 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);

const CP011_NON_RATE_MODES = new Set([
  "findOutputFromArithmeticDailyRates",
  "findCompletionTimeFromArithmeticDailyRates",
  "findInitialRateFromArithmeticTotal",
  "findOutputFromGeometricDailyRates",
  "findCompletionTimeFromGeometricDailyRates",
  "findInitialRateFromGeometricTotal",
  "findMultiplierFromGeometricTotal",
  "findCompletionTimeAfterThresholdRateSwitch",
  "findUnknownThresholdDay",
  "findOutputWithVaryingCrewByDay",
  "findCombinedVariableAgentOutput",
  "findSignedNetVariableOutput",
  "findCompletionTimeFromExplicitRateTable",
  "findOutputAfterThresholdRateSwitch",
  "findCompletionTimeWithVaryingCrewByDay",
]);

function mathContainsProse(value: string): boolean {
  const matches = value.matchAll(/\\\(([\s\S]*?)\\\)/g);
  for (const match of matches) {
    const noCommands = match[1].replace(/\\[A-Za-z]+/g, "");
    if (/[A-Za-z]{2,}/.test(noCommands)) return true;
  }
  return false;
}

function canonicalDisplay(value: string): string {
  return normalizeTmwLearnerDisplayTextR2(value)
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "")
    .replace(/\\frac\{(-?\d+)\}\{(\d+)\}/g, "$1/$2")
    .replace(/\\%/g, "%")
    .replace(/\\,/g, " ")
    .replace(/[.।]+$/u, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function primaryAnswerEvidence(value: string): string | null {
  const canonical = canonicalDisplay(value);
  return canonical.match(/-?\d+\s*:\s*-?\d+(?:\s*:\s*-?\d+)?/)?.[0]?.replace(/\s/g, "")
    ?? canonical.match(/-?\d+\/\d+/)?.[0]
    ?? canonical.match(/-?\d+(?:\.\d+)?%/)?.[0]
    ?? canonical.match(/-?\d+(?:\.\d+)?/)?.[0]
    ?? null;
}

function assertQuestion(question: any, qlId: string, language: Tmw001ChapterLanguage, seed: string): void {
  const label = `${qlId}:${language}:${seed}`;
  assert(question.validation?.valid, `${label}: validation failed: ${(question.validation?.errors ?? []).join(" | ")}`);
  assert(question.publiclyPublishable === false, `${label}: publication lock changed`);
  assert(question.options?.length === 4, `${label}: expected four options`);
  assert(new Set(question.options).size === 4, `${label}: options are not unique`);
  const solved = question.solution?.answerText ?? question.answerText;
  assert(question.options[question.correctIndex] === solved, `${label}: correct option does not equal solved answer`);

  assert(question.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: learner version changed unexpectedly`);
  const learner = question.learnerExplanation;
  assert(learner, `${label}: learner explanation missing`);
  const contractErrors = validateTmwLearnerExplanationV2(learner);
  assert(contractErrors.length === 0, `${label}: learner contract failed: ${contractErrors.join(" | ")}`);

  const visible = [learner.method, ...learner.solution, learner.answer].join(" ");
  const evidence = primaryAnswerEvidence(solved);
  const normalizedAnswerLine = canonicalDisplay(learner.answer).replace(/\s/g, "");
  if (evidence) {
    assert(
      normalizedAnswerLine.includes(evidence.replace(/\s/g, "")),
      `${label}: learner answer omits solved-value evidence ${evidence} | answer=${normalizedAnswerLine}`,
    );
  }
  assert(!/After simplification, the required value is/i.test(visible), `${label}: mechanical final boilerplate remains`);
  assert(!/Continue the calculation with the remaining quantity/i.test(visible), `${label}: mechanical continuation boilerplate remains`);
  assert(!mathContainsProse(visible), `${label}: explanatory prose remains inside MathJax: ${visible}`);
  assert(!/\\\(\s*-?\d+(?:\.\d+)?\s*=\s*\\frac\{\d+\}\{\d+\}\s*\\\)/.test(visible), `${label}: suspicious manufactured numeric=fraction equality remains`);
  assert(learner.solution.length >= 2 && learner.solution.length <= 5, `${label}: learner solution must have 2-5 steps`);
  assert(learner.method.length <= 300, `${label}: method too long`);
  for (const step of learner.solution) assert(step.length <= 340, `${label}: solution step too long: ${step}`);
  assert(learner.solution.slice(0, -1).some((step: string) => /\\\([\s\S]*\d[\s\S]*\\\)/.test(step)), `${label}: no concrete calculation before answer`);

  if (language === "hi") assert(/[\u0900-\u097F]/.test(visible), `${label}: Hindi learner explanation lacks Devanagari`);
  if (language === "pa") assert(/[\u0A00-\u0A7F]/.test(visible), `${label}: Punjabi learner explanation lacks Gurmukhi`);

  if (question.canonicalProblemId === "TMW-CP-011" && CP011_NON_RATE_MODES.has(question.solveMode)) {
    if (language === "en") assert(!/Therefore, the required rate is/i.test(learner.answer), `${label}: CP011 non-rate answer is mislabeled as a rate`);
    if (language === "hi") assert(!/अतः आवश्यक दर .* है।/u.test(learner.answer), `${label}: CP011 non-rate Hindi answer is mislabeled as a rate`);
    if (language === "pa") assert(!/ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਦਰ .* ਹੈ।/u.test(learner.answer), `${label}: CP011 non-rate Punjabi answer is mislabeled as a rate`);
  }

  if (qlId === "TMW-QL-145" && language === "en") {
    assert(!/1 components per hour/.test(question.stem), `${label}: singular/plural grammar defect remains`);
  }
}

let cases = 0;
for (const qlId of QL_IDS) {
  for (const language of LANGUAGES) {
    for (const seedSuffix of SEEDS) {
      const seed = `tmw-r4:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, seed, language });
      assertQuestion(question, qlId, language, seed);
      cases += 1;
    }
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  remediation: "R4-exam-readiness",
  qls: QL_IDS.length,
  languages: LANGUAGES.length,
  seedsPerQlLanguage: SEEDS.length,
  cases,
  expectedCases: 211 * 3 * 3,
  verdict: "PASS",
}, null, 2));
