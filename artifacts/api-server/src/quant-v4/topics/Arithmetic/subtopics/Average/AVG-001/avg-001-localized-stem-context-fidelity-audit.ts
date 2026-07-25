import { strict as assert } from "node:assert";

import { runAvg001Cp001LocalizationPilot } from "./foundation/cp001-localization-quality-runtime";
import { runAvg001Cp002LocalizationPilot } from "./foundation/cp002-localization-quality-runtime";
import { getAvg001QuestionEntries } from "./foundation/library";
import {
  avg001LocalizedContextTokens,
  AVG_001_LOCALIZED_STEM_CONTEXT_FIDELITY,
} from "./foundation/localized-stem-context-fidelity";

const failures: string[] = [];
const exactStems = new Map<string, Map<string, string[]>>([
  ["hi", new Map()],
  ["pa", new Map()],
]);
const forbiddenGrammar = {
  hi: /(?:\b\d+ एक विभाग|की \d+ दिनों की ऑर्डरों|वस्तुएँ बनाए|मध्य कीमत|सबसे (?:छोटा|बड़ा) कीमत|पहला [₹\d,.]+ इकाइयाँ|अंतिम [₹\d,.]+ इकाइयाँ है)/,
  pa: /(?:\b\d+ ਇੱਕ ਵਿਭਾਗ|ਦੀ \d+ ਦਿਨਾਂ ਦੀ ਆਰਡਰਾਂ|ਵਸਤਾਂ ਬਣਾਏ|ਵਿਚਕਾਰਲਾ ਕੀਮਤ|ਸਭ ਤੋਂ (?:ਛੋਟਾ|ਵੱਡਾ) ਕੀਮਤ|ਪਹਿਲਾ [₹\d,.]+ ਇਕਾਈਆਂ|ਆਖਰੀ [₹\d,.]+ ਇਕਾਈਆਂ ਹੈ|ਅੰਤਿਮ [₹\d,.]+ ਇਕਾਈਆਂ ਹੈ)/,
};
let generated = 0;

function fail(message: string) {
  failures.push(message);
}

function addStem(language: string, stem: string, qlId: string) {
  const map = exactStems.get(language)!;
  map.set(stem, [...(map.get(stem) ?? []), qlId]);
}

function runner(cpId: string) {
  return cpId === "AVG-CP-001"
    ? runAvg001Cp001LocalizationPilot
    : runAvg001Cp002LocalizationPilot;
}

const entries = getAvg001QuestionEntries().filter((entry) =>
  entry.cpId === "AVG-CP-001" || entry.cpId === "AVG-CP-002",
);

for (const entry of entries) {
  for (const language of ["hi", "pa"] as const) {
    for (let seedIndex = 0; seedIndex < 2; seedIndex += 1) {
      const seed = `avg-localized-context-fidelity:${entry.qlId}:${seedIndex}`;
      const localized = runner(entry.cpId)({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const repeated = runner(entry.cpId)({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const scope = `${entry.qlId}:${language}:${seedIndex}`;
      generated += 1;

      if (
        localized.traceability.localizedStemContextFidelity !==
        AVG_001_LOCALIZED_STEM_CONTEXT_FIDELITY
      ) {
        fail(`${scope}: context-fidelity marker missing`);
      }
      if (localized.traceability.localizedStemGrammarGuard !== "AVG-001 localized stem grammar guard v1") {
        fail(`${scope}: grammar-guard marker missing`);
      }
      if (!localized.validation.valid || localized.validation.checks.some((check) => !check.passed)) {
        const failed = localized.validation.checks
          .filter((check) => !check.passed)
          .map((check) => check.name)
          .join(",");
        fail(`${scope}: localized validation failed [${failed}]`);
      }
      if (localized.stem !== repeated.stem) {
        fail(`${scope}: stem is not deterministic`);
      }
      if (forbiddenGrammar[language].test(localized.stem)) {
        fail(`${scope}: known grammar defect remains :: ${localized.stem}`);
      }

      const tokens = avg001LocalizedContextTokens(entry.qlId, language);
      if (tokens.length && !tokens.some((token) => localized.stem.includes(token))) {
        fail(`${scope}: expected scenario token missing [${tokens.join("|")}] :: ${localized.stem}`);
      }

      if (seedIndex === 0) addStem(language, localized.stem, entry.qlId);
    }
  }
}

for (const [language, stems] of exactStems) {
  for (const [stem, qlIds] of stems) {
    if (qlIds.length > 1) {
      fail(`${language}: exact duplicate localized stems ${qlIds.join(", ")} :: ${stem}`);
    }
  }
}

console.log(JSON.stringify({
  release: AVG_001_LOCALIZED_STEM_CONTEXT_FIDELITY,
  qlCount: entries.length,
  languages: ["hi", "pa"],
  generated,
  exactStemGroups: Object.fromEntries(
    [...exactStems].map(([language, stems]) => [language, stems.size]),
  ),
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  verdict: failures.length ? "FAIL" : "PASS — CONTEXT AND GRAMMAR VERIFIED",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
