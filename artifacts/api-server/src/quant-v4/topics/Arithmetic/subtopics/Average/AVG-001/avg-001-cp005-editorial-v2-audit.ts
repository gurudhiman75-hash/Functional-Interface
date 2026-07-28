import { strict as assert } from "node:assert";

import {
  applyAvg001Cp005EditorialV2Candidate,
  AVG_001_CP005_EDITORIAL_V2,
} from "./foundation/cp005-editorial-v2";
import {
  applyAvg001Cp005EditorialV2FinalCandidate,
  AVG_001_CP005_EDITORIAL_V2_FINAL,
} from "./foundation/cp005-editorial-v2-final";
import {
  applyAvg001Cp005EditorialV2ApprovedCandidate,
  AVG_001_CP005_EDITORIAL_V2_APPROVED,
} from "./foundation/cp005-editorial-v2-approved";
import {
  applyAvg001Cp005EditorialV2ReviewedCandidate,
  AVG_001_CP005_EDITORIAL_V2_REVIEWED,
} from "./foundation/cp005-editorial-v2-reviewed";
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

function displayBlocks(text: string) {
  return [...text.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((match) => match[1]!);
}

function mathJaxUnitsAreSafe(text: string) {
  return displayBlocks(text).every((block) => {
    const withoutText = block.replace(/\\text\{[^}]*\}/g, "");
    return (
      !/₹|\b(?:marks?|years?|runs?|units?|kg)\b/.test(withoutText) &&
      !/\\text\{₹\}-/.test(block)
    );
  });
}

assert.equal(entries.length, 56, `Expected 56 CP-005 QLs; found ${entries.length}`);

for (const entry of entries) {
  solveModes.add(entry.solveMode);
  for (let seedIndex = 0; seedIndex < 5; seedIndex += 1) {
    const seed = `avg-cp005-editorial-v2:${entry.qlId}:${seedIndex}`;
    const original = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const firstPass = applyAvg001Cp005EditorialV2Candidate(original);
    const finalPass = applyAvg001Cp005EditorialV2FinalCandidate(original);
    const approvedPass = applyAvg001Cp005EditorialV2ApprovedCandidate(original);
    const candidate = applyAvg001Cp005EditorialV2ReviewedCandidate(original);
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
      fail(`${entry.qlId}:${seedIndex}: missing CP-005 base traceability`);
    }
    if (finalPass.traceability.cp005EditorialV2Final !== AVG_001_CP005_EDITORIAL_V2_FINAL) {
      fail(`${entry.qlId}:${seedIndex}: missing CP-005 final traceability`);
    }
    if (approvedPass.traceability.cp005EditorialV2Approved !== AVG_001_CP005_EDITORIAL_V2_APPROVED) {
      fail(`${entry.qlId}:${seedIndex}: missing CP-005 approved traceability`);
    }
    if (candidate.traceability.cp005EditorialV2Reviewed !== AVG_001_CP005_EDITORIAL_V2_REVIEWED) {
      fail(`${entry.qlId}:${seedIndex}: missing CP-005 reviewed traceability`);
    }
    if (candidate.traceability.releaseCandidate !== "AVG-001-EN-v2") {
      fail(`${entry.qlId}:${seedIndex}: missing release-candidate trace`);
    }

    if (!candidate.validation.valid || candidate.validation.checks.some((check) => !check.passed)) {
      const failed = candidate.validation.checks
        .filter((check) => !check.passed)
        .map((check) => check.name)
        .join(", ");
      fail(`${entry.qlId}:${seedIndex}: candidate validation failed [${failed}]`);
    }

    if (candidate.options.length !== 4 || new Set(candidate.options).size !== 4) {
      fail(`${entry.qlId}:${seedIndex}: options are not four and unique`);
    }
    if (candidate.options[candidate.correctIndex] !== candidate.answer) {
      fail(`${entry.qlId}:${seedIndex}: correct index does not point to the answer`);
    }
    if (candidate.options.some((option) => /^-|₹-/.test(option))) {
      fail(`${entry.qlId}:${seedIndex}: negative option survived`);
    }
    if (!currencyOptionsAreRound(candidate.options)) {
      fail(`${entry.qlId}:${seedIndex}: currency options are not clean multiples of ₹1,000`);
    }

    const allText = `${candidate.stem} ${candidate.options.join(" ")} ${candidate.explanation.lines.join(" ")}`;
    if (candidate.stem.length < 100 || /[{}]|undefined|NaN|Infinity|null/.test(candidate.stem)) {
      fail(`${entry.qlId}:${seedIndex}: stem is short or unresolved`);
    }
    if (/\bentry\b|\bfind the (?:new|correct|actual|revised) average\.?$/i.test(candidate.stem)) {
      fail(`${entry.qlId}:${seedIndex}: mechanical correction language survived`);
    }
    if (/average marks of|average daily output per machine of|average daily sales per shop of|one recorded value had been recorded/i.test(candidate.stem)) {
      fail(`${entry.qlId}:${seedIndex}: awkward context construction survived`);
    }
    if (/\bA (?:inspection|average|organisation|employee|inning|age|audit|error)\b/.test(candidate.stem)) {
      fail(`${entry.qlId}:${seedIndex}: incorrect indefinite article survived`);
    }
    if (/\b1(?:\.0+)? (?:marks|years|runs|units)\b/.test(allText) || /\b1(?:\.0+)?\\text\{ (?:marks|years|runs|units)\}/.test(allText)) {
      fail(`${entry.qlId}:${seedIndex}: singular unit has plural grammar`);
    }
    if (
      candidate.solveMode === "findNumberOfItemsFromTotalCorrection" &&
      /corrected from \d+(?:\.\d+)? (?:students|employees|people|machines|shops|innings|parcels|values) to/i.test(candidate.stem)
    ) {
      fail(`${entry.qlId}:${seedIndex}: count label leaked onto a corrected measurement`);
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

    const explanationText = candidate.explanation.lines.join("\n");
    if (!mathJaxUnitsAreSafe(explanationText)) {
      fail(`${entry.qlId}:${seedIndex}: raw or incorrectly signed unit text survived inside MathJax`);
    }
    const shortcut = candidate.explanation.lines[2] ?? "";
    if (
      !shortcut.includes("$$") ||
      (shortcut.match(/-?\d+(?:\.\d+)?/g)?.length ?? 0) < 3 ||
      /Do not rebuild the full total|Combine positive and negative corrections before dividing|Average shift × count/.test(shortcut)
    ) {
      fail(`${entry.qlId}:${seedIndex}: shortcut is not a worked numerical shortcut`);
    }

    const optionTags = candidate.traceability.cp005OptionTags;
    if (!Array.isArray(optionTags) || optionTags.length !== 4 || optionTags[candidate.correctIndex] !== "CORRECT") {
      fail(`${entry.qlId}:${seedIndex}: option-tag trace is invalid`);
    } else {
      const wrong = candidate.options
        .map((option, index) => ({ option, index, tag: optionTags[index] }))
        .filter(({ index }) => index !== candidate.correctIndex);
      if (
        wrong.some(
          ({ option, tag }) =>
            !tag || tag === "CORRECT" || !candidate.explanation.lines[3]?.includes(`(${option}) [${tag}]`),
        )
      ) {
        fail(`${entry.qlId}:${seedIndex}: a distractor is not mapped to its misconception`);
      }
    }

    if (!explanationText.includes(candidate.answer)) {
      fail(`${entry.qlId}:${seedIndex}: explanation omits the qualified answer`);
    }
    if (/Thus, the final value confirms|completed calculation shows|So the required value is/i.test(explanationText)) {
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
  candidate: "AVG-001-EN-v2 / CP-005 reviewed editorial wave",
  qlCount: entries.length,
  solveModes: [...solveModes].sort(),
  solveModeCount: solveModes.size,
  generated,
  misconceptionOptionCases: generated,
  mathJaxUnitCases: generated,
  numericalShortcutCases: generated,
  fourTierExplanationCases: generated,
  allDistractorsAnalysedCases: generated,
  duplicateStemGroups: duplicateStems.length,
  fingerprintChanges: 0,
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
