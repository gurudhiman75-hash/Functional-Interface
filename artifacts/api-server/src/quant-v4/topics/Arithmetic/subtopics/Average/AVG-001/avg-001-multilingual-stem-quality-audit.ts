import { strict as assert } from "node:assert";

import {
  getAvg001Cp001LocalizedQlIds,
  runAvg001Cp001LocalizationPilot,
} from "./foundation/cp001-localization-pilot-runtime";
import {
  getAvg001Cp002LocalizedQlIds,
  runAvg001Cp002LocalizationPilot,
} from "./foundation/cp002-localization-pilot-runtime";
import {
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot,
} from "./foundation/cp003-localization-review-runtime";
import type { Avg001QuestionPackage } from "./foundation/types";

const languages = ["hi", "pa"] as const;
type Language = (typeof languages)[number];

const failures: string[] = [];
const stems = new Map<Language, Map<string, string[]>>([
  ["hi", new Map()],
  ["pa", new Map()],
]);
const skeletons = new Map<Language, Map<string, string[]>>([
  ["hi", new Map()],
  ["pa", new Map()],
]);
let generated = 0;

function fail(message: string) {
  failures.push(message);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function skeleton(value: string) {
  return normalize(value)
    .replace(/₹?\d[\d,]*(?:\.\d+)?(?:\/\d+)?/g, "{n}")
    .replace(/[?।]/g, ".");
}

function isAge(pkg: Avg001QuestionPackage) {
  if (pkg.solveMode === "findInningsValueOrNewCricketAverage") return false;
  return pkg.parameters.contextDomain === "Family" || /age|teacher|child|newborn|afteryears|elapsedyears|retir|playerage/i.test(pkg.parameters.scenarioVariant);
}

function contextChecks(pkg: Avg001QuestionPackage, language: Language) {
  const text = pkg.stem;
  const scenario = pkg.parameters.scenarioVariant;
  const check = (condition: boolean, label: string) => {
    if (!condition) fail(`${pkg.questionLanguageId}:${language}: ${label} :: ${text}`);
  };

  if (pkg.canonicalProblemId === "AVG-CP-001") {
    check(!/संयुक्त स्कोर|ਮਿਲਿਆ-ਜੁਲਿਆ ਸਕੋਰ|एक प्रणाली|ਇੱਕ ਪ੍ਰਣਾਲੀ|फेरी नाव|ਫੈਰੀ ਕਿਸ਼ਤੀ/.test(text), "machine-like CP-001 phrase");
    check(!/\d+\.0\b/.test(text), "unnecessary decimal .0");
  }

  if (pkg.canonicalProblemId === "AVG-CP-002") {
    check(!/अंक-श्रृंखला|मूल्य-श्रृंखला|उत्पादन-श्रृंखला|ਅੰਕਾਂ ਦੀ ਲੜੀ|ਕੀਮਤਾਂ ਦੀ ਲੜੀ|ਉਤਪਾਦਨ ਲੜੀ/.test(text), "translated series label");
    check(!/समान अंतर वाली समान|ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੀ ਬਰਾਬਰ/.test(text), "redundant equal-difference phrase");
  }

  if (pkg.canonicalProblemId !== "AVG-CP-003") return;

  check(!/(स्कोर|दिन|मशीन|पार्सल|कीमत|बिक्री).*समूह में शामिल/.test(text), "non-person joins a group in Hindi");
  check(!/(ਸਕੋਰ|ਦਿਨ|ਮਸ਼ੀਨ|ਪਾਰਸਲ|ਕੀਮਤ|ਵਿਕਰੀ).*ਸਮੂਹ ਵਿੱਚ ਸ਼ਾਮਲ/.test(text), "non-person joins a group in Punjabi");
  check(!/मशीन[^।?]*(होता|जाता) है/.test(text), "Hindi machine gender mismatch");
  check(!/ਮਸ਼ੀਨ[^।?]*(ਹੁੰਦਾ|ਜਾਂਦਾ) ਹੈ/.test(text), "Punjabi machine gender mismatch");
  check(!/एक बच्चा के|ਇੱਕ ਬੱਚਾ ਦੇ/.test(text), "child oblique-case error");

  if (!isAge(pkg) && !pkg.solveMode.includes("OriginalCount")) {
    check(!/एक नया सदस्य|नए सदस्य का मूल्य|हटाए गए सदस्य का मूल्य/.test(text), "generic Hindi member wording outside age questions");
    check(!/ਇੱਕ ਨਵਾਂ ਮੈਂਬਰ|ਨਵੇਂ ਮੈਂਬਰ ਦਾ ਮੁੱਲ|ਹਟਾਏ ਗਏ ਮੈਂਬਰ ਦਾ ਮੁੱਲ/.test(text), "generic Punjabi member wording outside age questions");
  }

  if (/salary/i.test(scenario) && !isAge(pkg)) {
    check(language === "hi" ? /वेतन/.test(text) : /ਤਨਖਾਹ/.test(text), "salary context missing");
  }
  if (/sales|day/i.test(scenario) && !isAge(pkg)) {
    check(language === "hi" ? /बिक्री/.test(text) : /ਵਿਕਰੀ/.test(text), "sales context missing");
  }
  if (/price/i.test(scenario)) {
    check(language === "hi" ? /कीमत/.test(text) : /ਕੀਮਤ/.test(text), "price context missing");
  }
  if (/machine|output/i.test(scenario)) {
    check(language === "hi" ? /मशीन|उत्पादन/.test(text) : /ਮਸ਼ੀਨ|ਉਤਪਾਦਨ/.test(text), "machine/output context missing");
  }
  if (/parcel/i.test(scenario)) {
    check(language === "hi" ? /पार्सल/.test(text) : /ਪਾਰਸਲ/.test(text), "parcel context missing");
  }
  if (/test|score|reading/i.test(scenario) && pkg.solveMode !== "findInningsValueOrNewCricketAverage") {
    check(language === "hi" ? /अंक|परीक्षा/.test(text) : /ਅੰਕ|ਪ੍ਰੀਖਿਆ/.test(text), "marks context missing");
  }
}

const groups = [
  {
    cp: "AVG-CP-001",
    qlIds: getAvg001Cp001LocalizedQlIds(),
    run: runAvg001Cp001LocalizationPilot,
  },
  {
    cp: "AVG-CP-002",
    qlIds: getAvg001Cp002LocalizedQlIds(),
    run: runAvg001Cp002LocalizationPilot,
  },
  {
    cp: "AVG-CP-003",
    qlIds: getAvg001Cp003LocalizedQlIds(),
    run: runAvg001Cp003LocalizationPilot,
  },
] as const;

for (const group of groups) {
  for (const questionLanguageId of group.qlIds) {
    for (const language of languages) {
      for (let seedIndex = 0; seedIndex < 2; seedIndex += 1) {
        const seed = `avg-multilingual-stem-quality:${questionLanguageId}:${seedIndex}`;
        const pkg = group.run({ questionLanguageId, seed, language });
        generated += 1;

        if (!pkg.validation.valid) {
          const failed = pkg.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",");
          fail(`${questionLanguageId}:${language}:${seedIndex}: package validation failed [${failed}]`);
        }
        if (pkg.canonicalProblemId !== group.cp) fail(`${questionLanguageId}:${language}: wrong canonical problem`);
        if (/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem)) fail(`${questionLanguageId}:${language}: unresolved stem token`);
        if (/\b(the|average|find|member|value|group|score|salary|sales|machine|therefore)\b/i.test(pkg.stem)) {
          fail(`${questionLanguageId}:${language}: English prose remains in stem :: ${pkg.stem}`);
        }
        if (pkg.stem.length < 25 || pkg.stem.length > 260) fail(`${questionLanguageId}:${language}: implausible stem length ${pkg.stem.length}`);
        contextChecks(pkg, language);

        if (seedIndex === 0) {
          const normalized = normalize(pkg.stem);
          const stemMap = stems.get(language)!;
          stemMap.set(normalized, [...(stemMap.get(normalized) ?? []), questionLanguageId]);
          const stemSkeleton = skeleton(pkg.stem);
          const skeletonMap = skeletons.get(language)!;
          skeletonMap.set(stemSkeleton, [...(skeletonMap.get(stemSkeleton) ?? []), questionLanguageId]);
        }
      }
    }
  }
}

for (const language of languages) {
  for (const [stem, qlIds] of stems.get(language)!) {
    if (qlIds.length > 1) fail(`${language}: exact duplicate stem ${qlIds.join(", ")} :: ${stem}`);
  }
  for (const [stemSkeleton, qlIds] of skeletons.get(language)!) {
    if (qlIds.length > 3) fail(`${language}: stem skeleton repeated ${qlIds.length} times (${qlIds.join(", ")}) :: ${stemSkeleton}`);
  }
}

console.log(JSON.stringify({
  scope: groups.map((group) => ({ cp: group.cp, qlCount: group.qlIds.length })),
  languages,
  generated,
  exactDuplicateGroups: Object.fromEntries(languages.map((language) => [language, [...stems.get(language)!.values()].filter((ids) => ids.length > 1).length])),
  excessiveSkeletonGroups: Object.fromEntries(languages.map((language) => [language, [...skeletons.get(language)!.values()].filter((ids) => ids.length > 3).length])),
  failureCount: failures.length,
  failures: failures.slice(0, 300),
  verdict: failures.length ? "FAIL" : "PASS — CONTEXT-FIRST STEM QUALITY",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
