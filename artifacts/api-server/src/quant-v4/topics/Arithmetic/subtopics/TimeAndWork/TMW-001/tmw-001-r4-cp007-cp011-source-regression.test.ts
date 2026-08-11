import { runTmwCp007Pipeline } from "./foundation/cp007-runtime";
import { runTmwCp007LocalizedPipeline } from "./foundation/cp007-localized-runtime";
import { runTmwCp008Pipeline } from "./foundation/cp008-runtime";
import { runTmwCp008LocalizedPipeline } from "./foundation/cp008-localized-runtime";
import { runTmwCp009Pipeline } from "./foundation/cp009-runtime";
import { runTmwCp009LocalizedPipeline } from "./foundation/cp009-localized-runtime";
import { runTmwCp010Pipeline } from "./foundation/cp010-runtime";
import { runTmwCp010LocalizedPipeline } from "./foundation/cp010-localized-runtime";
import { runTmwCp011Pipeline } from "./foundation/cp011-runtime";
import { runTmwCp011LocalizedPipeline } from "./foundation/cp011-localized-runtime";

type Language = "en" | "hi" | "pa";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function runSource(qlId: string, seed: string, language: Language): any {
  const ordinal = Number(qlId.slice(-3));
  const base = { questionLanguageId: qlId, seed };
  if (ordinal <= 143) return language === "en" ? runTmwCp007Pipeline(base) : runTmwCp007LocalizedPipeline({ ...base, language });
  if (ordinal <= 156) return language === "en" ? runTmwCp008Pipeline(base) : runTmwCp008LocalizedPipeline({ ...base, language });
  if (ordinal <= 174) return language === "en" ? runTmwCp009Pipeline(base) : runTmwCp009LocalizedPipeline({ ...base, language });
  if (ordinal <= 192) return language === "en" ? runTmwCp010Pipeline(base) : runTmwCp010LocalizedPipeline({ ...base, language });
  return language === "en" ? runTmwCp011Pipeline(qlId, seed) : runTmwCp011LocalizedPipeline({ ...base, language });
}

function solvedAnswer(question: any): string {
  return question.solution?.answerText ?? question.answerText;
}

const qls = Array.from({ length: 84 }, (_, index) => `TMW-QL-${String(index + 128).padStart(3, "0")}`);
const languages: readonly Language[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2"] as const;

let cases = 0;
for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-r4-source:${qlId}:${language}:${seedSuffix}`;
      const question = runSource(qlId, seed, language);
      const label = `${qlId}:${language}:${seedSuffix}`;
      assert(question.validation?.valid, `${label}: source validation failed: ${(question.validation?.errors ?? []).join(" | ")}`);
      assert(question.publiclyPublishable === false, `${label}: publication lock changed`);
      assert(Array.isArray(question.options) && question.options.length === 4, `${label}: expected four options`);
      assert(new Set(question.options).size === 4, `${label}: source options are not unique`);
      assert(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4, `${label}: invalid correctIndex`);
      assert(question.options[question.correctIndex] === solvedAnswer(question), `${label}: source correct option does not equal solved answer`);
      cases += 1;
    }
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  regression: "R4-CP007-CP011-source-correctness",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  cases,
  expectedCases: 84 * 3 * 3,
  verdict: "PASS",
}, null, 2));
