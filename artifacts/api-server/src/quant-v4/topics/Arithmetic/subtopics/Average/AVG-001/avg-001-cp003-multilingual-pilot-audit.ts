import { strict as assert } from "node:assert";

import { getAvg001QuestionEntries } from "./foundation/library";
import {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot,
} from "./foundation/cp003-localization-quality-runtime";
import { runAvg001Pipeline } from "./foundation/pipeline";

const CP003_AUTHORSHIP = "AVG-CP-003 context-authored explanations v1";
const CP003_CONTEXT_FINALIZER = "AVG-CP-003 localized context finalizer v2";
const CP003_GRAMMAR_FINALIZER = "AVG-CP-003 localized explanation grammar finalizer v2";
const CP003_EQUATION_LABEL_FINALIZER = "AVG-CP-003 localized equation labels v1";
const cpEntries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-003");
const localizedQlIds = getAvg001Cp003LocalizedQlIds();
const failures: string[] = [];
const stemsByLanguage = new Map<string, Map<string, string[]>>([
  ["hi", new Map()],
  ["pa", new Map()],
]);
let generated = 0;

const fail = (message: string) => failures.push(message);
const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();
const proseOnly = (lines: string[]) => lines.join("\n").replace(/\$\$[\s\S]*?\$\$/g, "");
const hindiRunWord = /(?:^|[^\u0900-\u097F])रन(?:$|[^\u0900-\u097F])|रनों/;
const punjabiRunWord = /ਦੌੜ|ਪਾਰੀ|ਬੱਲੇਬਾਜ਼/;
const forbiddenGrammar = {
  hi: /(?:0 वर्ष बीतने|पहले 0 वर्ष बाद|पुराना अंक के साथ|पुराना माप के साथ|ज्ञात नया अंक|ज्ञात नया माप|नए सदस्य का आयु|नए शिक्षक का आयु|अगले दिन का बिक्री|का अंतर को|नई औसत दैनिक बिक्री|आयु के अंतर से आवश्यक आयु|एक नई संख्या [\d,.]+ को समूह|जिसके बाद रन का औसत|जोड़ा गया मान|हटाया गया मान|नया मान|पुराना मान)/,
  pa: /(?:0 ਸਾਲ ਬੀਤਣ|ਪਹਿਲਾਂ 0 ਸਾਲ ਬਾਅਦ|ਪੁਰਾਣਾ ਅੰਕ ਨਾਲ|ਪੁਰਾਣਾ ਮਾਪ ਨਾਲ|ਜਾਣੀ ਨਵਾਂ ਅੰਕ|ਜਾਣੀ ਨਵਾਂ ਮਾਪ|ਜਾਣੀ ਹੋਈ ਨਵੇਂ|ਨਵੇਂ ਮੈਂਬਰ ਦਾ ਉਮਰ|ਨਵੇਂ ਅਧਿਆਪਕ ਦਾ ਉਮਰ|ਅਗਲੇ ਦਿਨ ਦਾ ਵਿਕਰੀ|ਦਾ ਫਰਕ ਨੂੰ|ਨਵੀਂ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ|ਉਮਰ ਦੇ ਫਰਕ ਤੋਂ ਲੋੜੀਂਦੀ ਉਮਰ|ਇੱਕ ਨਵੀਂ ਸੰਖਿਆ [\d,.]+ ਨੂੰ ਸਮੂਹ|ਜਿਸ ਤੋਂ ਬਾਅਦ ਦੌੜਾਂ ਦੀ ਔਸਤ|ਟੀਮ ਦਾ ਔਸਤ ਸਕੋਰ [\d,.]+ ਹੋ ਜਾਂਦੀ ਹੈ|ਜੋੜਿਆ ਮੁੱਲ|ਹਟਾਇਆ ਮੁੱਲ|ਨਵਾਂ ਮੁੱਲ|ਪੁਰਾਣਾ ਮੁੱਲ)/,
};

if (cpEntries.length !== 98) fail(`expected 98 CP-003 QLs; got ${cpEntries.length}`);
if (localizedQlIds.length !== 98) fail(`expected 98 localized QL IDs; got ${localizedQlIds.length}`);
if (new Set(localizedQlIds).size !== 98) fail("localized QL IDs are not unique");
if (JSON.stringify(localizedQlIds) !== JSON.stringify(cpEntries.map((entry) => entry.qlId))) {
  fail("localized QL IDs do not match the active CP-003 QL order");
}

const expectedModeCounts = {
  findNewAverageAfterAddition: 13,
  findNewAverageAfterRemoval: 12,
  findNewAverageAfterReplacement: 13,
  findAddedMemberValueFromShift: 13,
  findRemovedMemberValueFromShift: 12,
  findReplacementValueFromShift: 11,
  findInningsValueOrNewCricketAverage: 12,
  findOriginalCountFromJoiningMemberShift: 6,
  findOriginalCountFromLeavingMemberShift: 6,
};
for (const [mode, expected] of Object.entries(expectedModeCounts)) {
  const actual = cpEntries.filter((entry) => entry.solveMode === mode).length;
  if (actual !== expected) fail(`${mode}: expected ${expected} QLs; got ${actual}`);
}

for (const entry of cpEntries) {
  for (const language of AVG_001_CP003_MULTILINGUAL_PILOT.languages) {
    for (let seedIndex = 0; seedIndex < 3; seedIndex += 1) {
      const seed = `avg-cp003-localization:${entry.qlId}:${seedIndex}`;
      const english = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
      const localized = runAvg001Cp003LocalizationPilot({ questionLanguageId: entry.qlId, seed, language });
      const repeated = runAvg001Cp003LocalizationPilot({ questionLanguageId: entry.qlId, seed, language });
      generated += 1;
      const scope = `${entry.qlId}:${language}:${seedIndex}`;

      if (localized.language !== language) fail(`${scope}: wrong language`);
      if (localized.canonicalProblemId !== "AVG-CP-003") fail(`${scope}: wrong CP`);
      if (localized.maturity !== "MANUAL_REVIEW" || localized.publiclyPublishable) fail(`${scope}: wrong release boundary`);
      const failedChecks = localized.validation.checks.filter((check) => !check.passed).map((check) => check.name);
      if (!localized.validation.valid || failedChecks.length) fail(`${scope}: localization validation failed [${failedChecks.join(",")}]`);
      if (localized.traceability.localizationReleaseId !== AVG_001_CP003_MULTILINGUAL_PILOT.releaseId) fail(`${scope}: missing localization release ID`);
      if (localized.traceability.sourceEnglishReleaseId !== english.traceability.releaseId) fail(`${scope}: wrong English source release`);
      if (localized.traceability.cp003ExplanationAuthorship !== CP003_AUTHORSHIP) fail(`${scope}: authorship marker missing`);
      if (localized.traceability.cp003ExplanationContextFinalizer !== CP003_CONTEXT_FINALIZER) fail(`${scope}: context finalizer marker missing`);
      if (localized.traceability.cp003ExplanationGrammarFinalizer !== CP003_GRAMMAR_FINALIZER) fail(`${scope}: grammar finalizer marker missing`);
      if (localized.traceability.cp003EquationLabelFinalizer !== CP003_EQUATION_LABEL_FINALIZER) fail(`${scope}: equation-label finalizer marker missing`);
      if (localized.answer !== english.answer) fail(`${scope}: answer changed`);
      if (localized.correctIndex !== english.correctIndex) fail(`${scope}: correct index changed`);
      if (JSON.stringify(localized.options) !== JSON.stringify(english.options)) fail(`${scope}: options changed`);
      if (localized.mathematicalFingerprint !== english.mathematicalFingerprint) fail(`${scope}: fingerprint changed`);
      if (JSON.stringify(localized.parameters.values) !== JSON.stringify(english.parameters.values)) fail(`${scope}: parameters changed`);
      if (localized.stem === english.stem) fail(`${scope}: English stem fallback`);
      if (/[{}]|undefined|NaN|Infinity|null/.test(localized.stem)) fail(`${scope}: unresolved/internal stem token`);
      if (/[A-Za-z]/.test(localized.stem)) fail(`${scope}: Latin text remains in stem`);

      const fullExplanation = localized.explanation.lines.join("\n");
      const prose = proseOnly(localized.explanation.lines);
      const devanagariLetters = /[\u0900-\u0963\u0970-\u097F]/;
      const gurmukhiLetters = /[\u0A01-\u0A74]/;
      const expectedScript = language === "hi" ? devanagariLetters : gurmukhiLetters;
      const wrongScript = language === "hi" ? gurmukhiLetters : devanagariLetters;
      if (!expectedScript.test(localized.stem) || !expectedScript.test(prose)) fail(`${scope}: expected script missing`);
      if (wrongScript.test(`${localized.stem}\n${prose}`)) fail(`${scope}: cross-script contamination`);
      if (/\b(average|find|total|member|student|employee|score|runs|years|therefore|so)\b/i.test(prose)) fail(`${scope}: English prose fallback`);
      if (localized.explanation.lines.length < 4 || localized.explanation.lines.length > 8) fail(`${scope}: explanation line count`);
      if (!localized.explanation.lines.some((line) => line.includes(localized.answer))) fail(`${scope}: answer evidence missing`);
      if (!localized.explanation.lines.some((line) => /×|÷|\\times|\\div|\+|-/.test(line))) fail(`${scope}: substituted arithmetic missing`);
      const grammarMatch = `${localized.stem}\n${fullExplanation}`.match(forbiddenGrammar[language]);
      if (grammarMatch) fail(`${scope}: known language defect remains [${grammarMatch[0]}]`);

      const marksContext = language === "hi" ? /अंक|परीक्षा/.test(localized.stem) : /ਅੰਕ|ਪ੍ਰੀਖਿਆ/.test(localized.stem);
      const outputContext = language === "hi" ? /उत्पादन|मशीन/.test(localized.stem) : /ਉਤਪਾਦਨ|ਮਸ਼ੀਨ/.test(localized.stem);
      const readingContext = language === "hi" ? /माप|प्रेक्षण/.test(localized.stem) : /ਮਾਪ|ਪ੍ਰੇਖਣ/.test(localized.stem);
      const explanationHasRuns = language === "hi" ? hindiRunWord.test(fullExplanation) : punjabiRunWord.test(fullExplanation);
      if ((marksContext || outputContext || readingContext) && explanationHasRuns) fail(`${scope}: cricket wording leaked into non-cricket explanation`);
      if (outputContext && (language === "hi" ? /अतिरिक्त अंक|अंक-अंतर/.test(fullExplanation) : /ਵਾਧੂ ਅੰਕ|ਅੰਕ-ਫਰਕ/.test(fullExplanation))) fail(`${scope}: marks wording leaked into output explanation`);

      const yearsElapsed = Number(localized.parameters.values.yearsElapsed ?? 0);
      if (yearsElapsed > 0 && !localized.stem.includes(String(yearsElapsed))) fail(`${scope}: elapsed years missing`);
      if (yearsElapsed > 0 && !fullExplanation.includes(String(yearsElapsed))) fail(`${scope}: elapsed years not explained`);
      if (/cricket/i.test(entry.scenarioVariant) && !localized.stem.includes(String(localized.parameters.values.inningsCount))) fail(`${scope}: innings count missing`);

      if (
        localized.stem !== repeated.stem ||
        localized.answer !== repeated.answer ||
        localized.correctIndex !== repeated.correctIndex ||
        JSON.stringify(localized.options) !== JSON.stringify(repeated.options) ||
        JSON.stringify(localized.explanation) !== JSON.stringify(repeated.explanation)
      ) fail(`${scope}: generation is not deterministic`);

      if (seedIndex === 0) {
        const stem = normalize(localized.stem);
        const languageMap = stemsByLanguage.get(language)!;
        languageMap.set(stem, [...(languageMap.get(stem) ?? []), entry.qlId]);
      }
    }
  }
}

for (const [language, stems] of stemsByLanguage) {
  for (const [stem, qlIds] of stems) {
    if (qlIds.length > 1) fail(`${language}: exact cross-QL duplicate ${qlIds.join(", ")} :: ${stem}`);
  }
}

const outsideEntry = getAvg001QuestionEntries().find((entry) => entry.cpId !== "AVG-CP-003");
if (outsideEntry) {
  assert.throws(
    () => runAvg001Cp003LocalizationPilot({ questionLanguageId: outsideEntry.qlId, seed: "outside-pilot", language: "hi" }),
    /outside the AVG-001 CP-003 multilingual pilot/,
  );
}

console.log(JSON.stringify({
  releaseId: AVG_001_CP003_MULTILINGUAL_PILOT.releaseId,
  status: AVG_001_CP003_MULTILINGUAL_PILOT.status,
  editorialStatus: AVG_001_CP003_MULTILINGUAL_PILOT.editorialStatus,
  qualityRuntime: "cp003-localization-quality-runtime",
  qlCount: cpEntries.length,
  modeCounts: Object.fromEntries(Object.keys(expectedModeCounts).map((mode) => [mode, cpEntries.filter((entry) => entry.solveMode === mode).length])),
  languages: AVG_001_CP003_MULTILINGUAL_PILOT.languages,
  generated,
  duplicateStemGroups: Object.fromEntries([...stemsByLanguage].map(([language, stems]) => [language, [...stems.values()].filter((ids) => ids.length > 1).length])),
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  verdict: failures.length ? "FAIL" : "PASS — READY FOR MANUAL LANGUAGE REVIEW",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
