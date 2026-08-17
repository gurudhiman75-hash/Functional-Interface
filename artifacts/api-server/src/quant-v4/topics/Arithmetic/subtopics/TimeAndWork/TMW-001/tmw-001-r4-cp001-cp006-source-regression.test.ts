import { runTmwCp001Pipeline } from "./foundation/cp001-runtime";
import { runTmwCp002Pipeline } from "./foundation/cp002-runtime";
import { runTmwCp003Pipeline } from "./foundation/cp003-runtime";
import { runTmwCp004Pipeline } from "./foundation/cp004-runtime";
import { runTmwCp005Pipeline } from "./foundation/cp005-runtime";
import { runTmwCp006Pipeline } from "./foundation/cp006-runtime";

type Language = "en" | "hi" | "pa";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function runSource(qlId: string, seed: string, language: Language): any {
  const ordinal = Number(qlId.slice(-3));
  const base = { questionLanguageId: qlId, seed };
  if (ordinal <= 20) return language === "en" ? runTmwCp001Pipeline({ ...base, language: "en" }) : runTmwCp001Pipeline({ ...base, language });
  if (ordinal <= 34) return language === "en" ? runTmwCp002Pipeline({ ...base, language: "en" }) : runTmwCp002Pipeline({ ...base, language });
  if (ordinal <= 57) return language === "en" ? runTmwCp003Pipeline({ ...base, language: "en" }) : runTmwCp003Pipeline({ ...base, language });
  if (ordinal <= 81) return language === "en" ? runTmwCp004Pipeline({ ...base, language: "en" }) : runTmwCp004Pipeline({ ...base, language });
  if (ordinal <= 105) return language === "en" ? runTmwCp005Pipeline({ ...base, language: "en" }) : runTmwCp005Pipeline({ ...base, language });
  return language === "en" ? runTmwCp006Pipeline({ ...base, language: "en" }) : runTmwCp006Pipeline({ ...base, language });
}

function solvedAnswer(question: any): string {
  return question.solution?.answerText ?? question.answerText;
}

const qls = Array.from({ length: 127 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);
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
  regression: "R4-CP001-CP006-source-correctness",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  cases,
  expectedCases: 127 * 3 * 3,
  verdict: "PASS",
}, null, 2));
