import { strict as assert } from "node:assert";

import {
  applyAvg001Cp005EditorialV2Candidate,
  AVG_001_CP005_EDITORIAL_V2,
} from "./foundation/cp005-editorial-v2";
import {
  applyAvg001Cp005EditorialV2FinalCandidate,
  AVG_001_CP005_EDITORIAL_V2_FINAL,
} from "./foundation/cp005-editorial-v2-final";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-005");
const failures: string[] = [];
const solveModes = new Set<string>();
const canonicalStems = new Map<string, string[]>();
let generated = 0;

function fail(message: string) {
  failures.push(message);
}

function normalizedNumeric(value: string) {
  return value.replace(/[₹,]/g, "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? "";
}

function normalizedStem(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function currencyOptionsAreRound(options: string[]) {
  return options
    .filter((option) => option.startsWith("₹"))
    .every((option) => Number(option.replace(/[₹,]/g, "")) % 1000 === 0);
}

assert.equal(entries.length, 56, `Expected 56 CP-005 QLs; found ${entries.length}`);

for (const entry of entries) {
  solveModes.add(entry.solveMode);
  for (let seedIndex = 0; seedIndex < 5; seedIndex += 1) {
    const seed = `avg-cp005-editorial-v2:${entry.qlId}:${seedIndex}`;
    const original = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const firstPass = applyAvg001Cp005EditorialV2Candidate(original);
    const candidate = applyAvg001Cp005EditorialV2FinalCandidate(original);
    generated += 1;

    if (candidate.mathematicalFingerprint !== original.mathematicalFingerprint) {
      fail(`${entry.qlId}:${seedIndex}: mathematical fingerprint changed`);
    }
    if (
      candidate.solver.exactAnswer.numerator !== original.solver.exactAnswer.numerator ||
      candidate.solver.exactAnswer.denominator !== original.solver.exactAnswer.denominator
    ) {
      fail(`${entry.qlId}:${seedIndex}: exact answer changed`);
    }
    if (normalizedNumeric(candidate.answer) !== normalizedNumeric(original.answer)) {
      fail(`${entry.qlId}:${seedIndex}: answer value changed (${original.answer} -> ${candidate.answer})`);
    }
    if (firstPass.traceability.cp005EditorialV2 !== AVG_001_CP005_EDITORIAL_V2) {
      fail(`${entry.qlId}:${seedIndex}: missing CP-005 v2 base traceability`);
    }
    if (candidate.traceability.cp005EditorialV2Final !== AVG_001_CP005_EDITORIAL_V2_FINAL) {
      fail(`${entry.qlId}:${seedIndex}: missing CP-005 v2 final traceability`);
    }
    if (candidate.traceability.releaseCandidate !== "AVG-001-EN-v2") {
      fail(`${entry.qlId}:${seedIndex}: missing release-candidate trace`);
    }
    if (!candidate.validation.valid || candidate.validation.checks.some((check) => !check.passed)) {
      const failed = candidate.validation.checks
        .filter((check) => !check.passed)
        .map((check) => check.name)
        .join(", ");
      fail(`${entry.qlId}:${seedIndex}: candidate validation failed [${failed}] options=${JSON.stringify(candidate.options)}`);
    }
    if (candidate.options.length !== 4 || new Set(candidate.options).size !== 4) {
      fail(`${entry.qlId}:${seedIndex}: options are not four and unique`);
    }
    if (candidate.options[candidate.correctIndex] !== candidate.answer) {
      fail(`${entry.qlId}:${seedIndex}: correct index does not point to the candidate answer`);
    }
    if (candidate.options.some((option) => /^-|₹-/.test(option))) {
      fail(`${entry.qlId}:${seedIndex}: negative option survived`);
    }
    if (!currencyOptionsAreRound(candidate.options)) {
      fail(`${entry.qlId}:${seedIndex}: currency options are not clean multiples of ₹1,000`);
    }
    if (candidate.stem.length < 100 || /[{}]|undefined|NaN|Infinity|null/.test(candidate.stem)) {
      fail(`${entry.qlId}:${seedIndex}: stem is short or unresolved`);
    }
    if (/\bentry\b|\bfind the (?:new|correct|actual|revised) average\.?$/i.test(candidate.stem)) {
      fail(`${entry.qlId}:${seedIndex}: mechanical correction language survived: ${candidate.stem}`);
    }
    if (/average marks of|average daily output per machine of|average daily sales per shop of|one recorded value had been recorded/i.test(candidate.stem)) {
      fail(`${entry.qlId}:${seedIndex}: awkward context construction survived: ${candidate.stem}`);
    }
    if (/\b1 (?:marks|years|runs|units)\b/.test(`${candidate.stem} ${candidate.options.join(" ")} ${candidate.explanation.lines.join(" ")}`)) {
      fail(`${entry.qlId}:${seedIndex}: singular unit has plural grammar`);
    }
    if (
      candidate.solveMode === "findNumberOfItemsFromTotalCorrection" &&
      /corrected from \d+(?:\.\d+)? (?:students|employees|people|machines|shops|innings|parcels|values) to/i.test(candidate.stem)
    ) {
      fail(`${entry.qlId}:${seedIndex}: count label leaked onto corrected measurement`);
    }
    if (candidate.explanation.lines.length !== 4) {
      fail(`${entry.qlId}:${seedIndex}: explanation does not have exactly four tiers`);
    }
    const prefixes = [
      "📌 Key rule:",
      "📝 Step-by-step solution:",
      "⚡ Exam speed shortcut:",
      "⚠️ Common traps and distractors:",
    ];
    prefixes.forEach((prefix, index) => {
      if (!candidate.explanation.lines[index]?.startsWith(prefix)) {
        fail(`${entry.qlId}:${seedIndex}: explanation tier ${index + 1} is missing`);
      }
    });

    const optionTags = candidate.traceability.cp005OptionTags;
    if (!Array.isArray(optionTags) || optionTags.length !== 4 || optionTags[candidate.correctIndex] !== "CORRECT") {
      fail(`${entry.qlId}:${seedIndex}: option-tag trace is invalid`);
    } else {
      const wrong = candidate.options
        .map((option, index) => ({ option, index, tag: optionTags[index] }))
        .filter(({ index }) => index !== candidate.correctIndex);
      if (wrong.some(({ option, tag }) => !tag || tag === "CORRECT" || !candidate.explanation.lines[3]?.includes(`(${option}) [${tag}]`))) {
        fail(`${entry.qlId}:${seedIndex}: one or more distractor values are not mapped to their traced misconception`);
      }
    }

    if (!candidate.explanation.lines.join(" ").includes(candidate.answer)) {
      fail(`${entry.qlId}:${seedIndex}: explanation omits the qualified answer`);
    }
    if (/Thus, the final value confirms|completed calculation shows|So the required value is/i.test(candidate.explanation.lines.join(" "))) {
      fail(`${entry.qlId}:${seedIndex}: generic explanation filler survived`);
    }

    if (seedIndex === 0) {
      const key = normalizedStem(candidate.stem);
      canonicalStems.set(key, [...(canonicalStems.get(key) ?? []), entry.qlId]);
    }
  }
}

const duplicateStems = [...canonicalStems.entries()].filter(([, qlIds]) => qlIds.length > 1);
for (const [stem, qlIds] of duplicateStems) {
  fail(`cross-QL duplicate stem: ${qlIds.join(", ")} :: ${stem}`);
}

console.log(JSON.stringify({
  candidate: "AVG-001-EN-v2 / CP-005 editorial wave",
  qlCount: entries.length,
  solveModes: [...solveModes].sort(),
  solveModeCount: solveModes.size,
  generated,
  misconceptionOptionCases: generated,
  semanticOptionCases: generated,
  fourTierExplanationCases: generated,
  allDistractorsAnalysedCases: generated,
  duplicateStemGroups: duplicateStems.length,
  fingerprintChanges: 0,
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
