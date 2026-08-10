import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { validateTmwLearnerExplanationV2 } from "./foundation/learner-explanation-contract";
import { normalizeTmwLearnerDisplayTextR2 } from "./foundation/learner-explanation-r2-cp001-cp006";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const SEEDS = ["0", "1", "2"] as const;
const QL_IDS = Array.from({ length: 127 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);

function hasUnsafeNotation(value: string): boolean {
  return /_\{[^}]*[A-Za-z\u0900-\u097F\u0A00-\u0A7F][^}]*\}/u.test(value)
    || /_[A-Za-z\u0900-\u097F\u0A00-\u0A7F]+/u.test(value)
    || /\\text\{/u.test(value);
}

function assertLearnerV2(question: any, qlId: string, language: Tmw001ChapterLanguage, seed: string): void {
  const label = `${qlId}:${language}:${seed}`;
  const learnerSnapshot = JSON.stringify(question.learnerExplanation ?? null);
  assert(question.validation?.valid, `${label}: source validation failed: ${(question.validation?.errors ?? []).join(" | ")} | learner=${learnerSnapshot}`);
  assert(question.publiclyPublishable === false, `${label}: publication lock changed`);
  assert(question.options?.length === 4, `${label}: expected four options`);
  assert(new Set(question.options).size === 4, `${label}: options are not unique`);
  assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: correct option does not equal solved answer`);

  assert(question.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: learner explanation version missing`);
  const learner = question.learnerExplanation;
  assert(learner, `${label}: learner explanation missing`);

  const contractErrors = validateTmwLearnerExplanationV2(learner);
  assert(contractErrors.length === 0, `${label}: learner V2 contract failed: ${contractErrors.join(" | ")}`);
  assert(learner.solution.length >= 2 && learner.solution.length <= 5, `${label}: learner solution must contain 2-5 steps`);
  assert(!("formula" in learner), `${label}: learner V2 exposes a formula block`);
  assert(!("givens" in learner), `${label}: learner V2 exposes a givens block`);
  assert(!("shortcut" in learner), `${label}: learner V2 should not force a shortcut`);
  assert(!("commonMistake" in learner), `${label}: learner V2 should not force a common-mistake block`);

  const visible = [learner.method, ...learner.solution, learner.answer].join(" ");
  const normalizedAnswer = normalizeTmwLearnerDisplayTextR2(question.solution.answerText);
  assert(visible.includes(normalizedAnswer), `${label}: learner V2 omits the normalized solved answer text ${normalizedAnswer}`);
  assert(!/10[- ]Second|10[- ]सेकंड|10[- ]ਸੈਕਿੰਡ/i.test(visible), `${label}: generic 10-second claim leaked into learner V2`);
  assert(!hasUnsafeNotation(visible), `${label}: word-based or localized subscript leaked into learner V2: ${visible}`);
  assert(!/\bFormula\b|\bGivens\b|\bShortcut\b/i.test(visible), `${label}: legacy section label leaked into learner V2`);
  assert(learner.method.length <= 280, `${label}: method is too long for the learner view`);
  for (const step of learner.solution) assert(step.length <= 320, `${label}: learner solution step is too long`);

  const workingSteps = learner.solution.slice(0, -1);
  assert(
    workingSteps.some((step: string) => /\\\([\s\S]*\d[\s\S]*\\\)/.test(step)),
    `${label}: learner solution has no concrete calculation before the final answer | learner=${learnerSnapshot}`,
  );

  if (language === "hi") assert(/[\u0900-\u097F]/.test(visible), `${label}: Hindi learner explanation has no Devanagari text`);
  if (language === "pa") assert(/[\u0A00-\u0A7F]/.test(visible), `${label}: Punjabi learner explanation has no Gurmukhi text`);
}

let cases = 0;
for (const qlId of QL_IDS) {
  for (const language of LANGUAGES) {
    for (const seedSuffix of SEEDS) {
      const seed = `tmw-r2-learner:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, seed, language });
      assertLearnerV2(question, qlId, language, seed);
      cases += 1;
    }
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  remediation: "R2-learner-explanation-cp001-cp006",
  qls: QL_IDS.length,
  languages: LANGUAGES.length,
  seedsPerQlLanguage: SEEDS.length,
  cases,
  expectedCases: 127 * 3 * 3,
  verdict: "PASS",
}, null, 2));
