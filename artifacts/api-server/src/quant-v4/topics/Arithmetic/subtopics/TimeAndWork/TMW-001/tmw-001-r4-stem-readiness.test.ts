import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const qls = Array.from({ length: 18 }, (_, index) => `TMW-QL-${String(175 + index).padStart(3, "0")}`);
const seeds = ["0", "1", "2"] as const;
const maxima: Record<Tmw001ChapterLanguage, { words: number; qlId: string; stem: string }> = {
  en: { words: 0, qlId: "", stem: "" },
  hi: { words: 0, qlId: "", stem: "" },
  pa: { words: 0, qlId: "", stem: "" },
};

for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-r4-stem:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, seed, language });
      const words = question.stem.trim().split(/\s+/u).filter(Boolean).length;
      if (words > maxima[language].words) maxima[language] = { words, qlId, stem: question.stem };
      assert(question.validation?.valid, `${qlId}:${language}:${seedSuffix}: generated question invalid`);
      if (language === "en") assert(words <= 70, `${qlId}: English CP010 stem is ${words} words (>70): ${question.stem}`);
      else assert(words <= 95, `${qlId}:${language}: localized CP010 stem is ${words} whitespace tokens (>95): ${question.stem}`);
    }
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  check: "R4-CP010-stem-readiness",
  qls: qls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  maxima,
  verdict: "PASS",
}, null, 2));
