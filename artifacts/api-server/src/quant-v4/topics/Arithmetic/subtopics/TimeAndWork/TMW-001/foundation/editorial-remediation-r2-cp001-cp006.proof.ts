import assert from "node:assert/strict";
import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./chapter-localized-runtime";

const QL_IDS = [
  "TMW-QL-016",
  "TMW-QL-028",
  "TMW-QL-086",
  "TMW-QL-108",
  "TMW-QL-115",
  "TMW-QL-119",
  "TMW-QL-121",
] as const;

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const SEED_SUFFIXES = ["0", "1", "2"] as const;

function occurrences(text: string, token: string): number {
  if (!token) return 0;
  return text.split(token).length - 1;
}

function assertNoLegacyFinding(qlId: string, language: Tmw001ChapterLanguage, question: any): void {
  const stem = String(question.stem ?? "");
  const conclusion = String(question.explanation?.conclusion ?? "");
  const answer = String(question.solution?.answerText ?? "");

  assert.ok(stem.trim(), `${qlId}/${language}: empty stem`);
  assert.equal(question.publiclyPublishable, false, `${qlId}/${language}: publication lock changed`);

  switch (qlId) {
    case "TMW-QL-016":
      if (language === "en") assert.doesNotMatch(conclusion, /\bthe first\b/i, `${qlId}/${language}: vague 'first' remains`);
      assert.ok(conclusion.includes(answer), `${qlId}/${language}: conclusion must retain the solved difference`);
      break;

    case "TMW-QL-028":
      if (language === "en") assert.doesNotMatch(stem, /reverses part of the completed work/i, `${qlId}/${language}: mechanical destructive wording remains`);
      if (language === "hi") assert.doesNotMatch(stem, /सतत पुनःकार्य प्रक्रिया/, `${qlId}/${language}: mechanical rework wording remains`);
      if (language === "pa") assert.doesNotMatch(stem, /ਲਗਾਤਾਰ ਮੁੜ-ਕੰਮ ਪ੍ਰਕਿਰਿਆ/, `${qlId}/${language}: mechanical rework wording remains`);
      break;

    case "TMW-QL-086":
      if (language === "en") {
        assert.doesNotMatch(stem, /After how many complete days and what fraction of the next day/i, `${qlId}/${language}: composite prompt remains`);
        assert.match(stem, /exact total time/i, `${qlId}/${language}: TIME contract not explicit`);
      }
      if (language === "hi") assert.doesNotMatch(stem, /कितने पूरे दिनों और अगली बारी के कितने समय/, `${qlId}/${language}: composite prompt remains`);
      if (language === "pa") assert.doesNotMatch(stem, /ਕਿੰਨੇ ਪੂਰੇ ਦਿਨਾਂ ਅਤੇ ਅਗਲੀ ਵਾਰੀ ਦੇ ਕਿੰਨੇ ਸਮੇਂ/, `${qlId}/${language}: composite prompt remains`);
      assert.ok(question.options?.includes(answer), `${qlId}/${language}: solved total time missing from options`);
      break;

    case "TMW-QL-108":
      assert.ok(conclusion.includes(answer), `${qlId}/${language}: solved daily hours missing from conclusion`);
      if (language === "en") assert.ok(occurrences(conclusion.toLowerCase(), "per day") <= 1, `${qlId}/${language}: 'per day' repeated`);
      if (language === "hi") assert.ok(occurrences(conclusion, "प्रतिदिन") <= 1, `${qlId}/${language}: daily wording repeated`);
      if (language === "pa") assert.ok(occurrences(conclusion, "ਰੋਜ਼ਾਨਾ") <= 1, `${qlId}/${language}: daily wording repeated`);
      break;

    case "TMW-QL-115":
      assert.ok(conclusion.includes(answer), `${qlId}/${language}: solved additional days missing from conclusion`);
      if (language === "en") assert.match(conclusion, /\bmore\b/i, `${qlId}/${language}: answer is not stated as additional time`);
      if (language === "hi") assert.match(conclusion, /और/, `${qlId}/${language}: answer is not stated as additional time`);
      if (language === "pa") assert.match(conclusion, /ਹੋਰ/, `${qlId}/${language}: answer is not stated as additional time`);
      break;

    case "TMW-QL-119":
      assert.ok(conclusion.includes(answer), `${qlId}/${language}: solved overtime missing from conclusion`);
      if (language === "en") assert.ok(occurrences(conclusion.toLowerCase(), "per day") <= 1, `${qlId}/${language}: 'per day' repeated`);
      break;

    case "TMW-QL-121":
      if (language === "en") assert.doesNotMatch(stem, /area\s*(?:or|\/)\s*volume/i, `${qlId}/${language}: area/volume ambiguity remains`);
      if (language === "hi") assert.doesNotMatch(stem, /क्षेत्रफल\s*(?:या|\/)\s*आयतन/, `${qlId}/${language}: area/volume ambiguity remains`);
      if (language === "pa") assert.doesNotMatch(stem, /ਖੇਤਰਫਲ\s*(?:ਜਾਂ|\/)\s*ਆਇਤਨ/, `${qlId}/${language}: area/volume ambiguity remains`);
      break;
  }
}

export interface Tmw001R2Cp001To006ProofResult {
  cases: number;
  qls: number;
  languages: number;
  seedsPerQlLanguage: number;
}

export function runTmw001R2Cp001To006Proof(): Tmw001R2Cp001To006ProofResult {
  let cases = 0;
  for (const qlId of QL_IDS) {
    for (const language of LANGUAGES) {
      for (const suffix of SEED_SUFFIXES) {
        const question = runTmw001ChapterPipeline({
          questionLanguageId: qlId,
          seed: `tmw-r2-proof:${qlId}:${language}:${suffix}`,
          language,
        });
        assertNoLegacyFinding(qlId, language, question);
        cases += 1;
      }
    }
  }

  return {
    cases,
    qls: QL_IDS.length,
    languages: LANGUAGES.length,
    seedsPerQlLanguage: SEED_SUFFIXES.length,
  };
}
