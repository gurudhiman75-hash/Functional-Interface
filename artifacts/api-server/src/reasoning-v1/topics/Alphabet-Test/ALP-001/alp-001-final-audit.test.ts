import { CLASS_WORDS, WORDS, type C } from "./completion/shared";
import { buildCp010 } from "./completion/cp010";
import { completionDifficulty } from "./completion/difficulty-v2";
import { categorySignature, repeatedOccurrenceCount } from "./completion/mixed-row";
import { ALP_001_QLS } from "./ql-registry";
import { ALP_001_QUESTION_STUDIO_REGISTRY } from "./question-studio-registry";
import { generateAlp001Question } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function ql(id: string) {
  const value = ALP_001_QLS.find((candidate) => candidate.qlId === id);
  if (!value) throw new Error(`Missing ${id}`);
  return value;
}

assert(WORDS.length >= 180, `ALP CP006 source pool is too small: ${WORDS.length}`);
assert(new Set(WORDS).size === WORDS.length, "ALP CP006 source pool contains duplicates.");
assert(CLASS_WORDS.length >= 160, `ALP CP007 class-word pool is too small: ${CLASS_WORDS.length}`);
assert(new Set(CLASS_WORDS).size === CLASS_WORDS.length, "ALP CP007 class-word pool contains duplicates.");

const advanced = ALP_001_QLS.filter((candidate) => Number(candidate.checkpointId.slice(-3)) >= 6);
const fatigueScope = advanced.filter((candidate) => candidate.checkpointId === "ALP-CP-006" || candidate.checkpointId === "ALP-CP-007");
const blockedLegacyLabels = new Set(["SOURCE_ROW_EARLY", "OPPOSITE_REFERENCE", "WRONG_FINAL_CONDITION", "DOMAIN_VALID_FALLBACK"]);
let checkedDistractors = 0;

for (const candidate of advanced) {
  for (let seed = 0; seed < 32; seed += 1) {
    const question = generateAlp001Question(candidate.qlId, seed, "en-IN");
    assert(["EASY", "MEDIUM", "HARD"].includes(question.difficulty), `${candidate.qlId} returned invalid difficulty.`);
    for (const option of question.options) {
      if (option.errorLabel === null) continue;
      checkedDistractors += 1;
      assert(!blockedLegacyLabels.has(option.errorLabel), `${candidate.qlId} seed ${seed} retained legacy/fallback distractor label ${option.errorLabel}.`);
    }
  }
}

// Difficulty must be allowed to vary when the generated reasoning structure
// varies; the previous remediation incorrectly forced one difficulty per QL.
for (const id of ["ALP-QL-130", "ALP-QL-155"]) {
  const levels = new Set<string>();
  for (let seed = 0; seed < 80; seed += 1) levels.add(generateAlp001Question(id, seed, "en-IN").difficulty);
  assert(levels.size >= 2, `${id} did not expose instance-derived difficulty variation: ${[...levels].join(", ")}`);
}

// Row length itself must not promote an otherwise identical reasoning state.
const directQl = ql("ALP-QL-131");
const language = { en: "same operation", hi: "same operation", pa: "same operation" };
const shortDirect: C = { source: ["A", "1", "#", "B", "2", "$"], answer: "#", pool: ["A", "1", "#", "B"], operation: language, query: language, working: language, shortcut: language };
const longDirect: C = { ...shortDirect, source: ["A", "1", "#", "B", "2", "$", "C", "3", "%", "D", "4", "&", "E", "5", "*"] };
assert(completionDifficulty(directQl, shortDirect) === completionDifficulty(directQl, longDirect), "ALP difficulty is still being promoted by row length alone.");

// The old fixed 8+8+8 unique mixed-row fingerprint must be gone.
const mixedLengths = new Set<number>();
const mixedProfiles = new Set<string>();
let mixedRowsWithRepeats = 0;
for (let seed = 0; seed < 100; seed += 1) {
  const question = generateAlp001Question("ALP-QL-131", seed, "en-IN");
  const row = question.structuredPrompt.sequence ?? [];
  mixedLengths.add(row.length);
  mixedProfiles.add(categorySignature(row));
  if (repeatedOccurrenceCount(row) > 0) mixedRowsWithRepeats += 1;
}
assert(mixedLengths.size >= 5, `Mixed rows still have weak length diversity: ${[...mixedLengths].join(", ")}`);
assert(mixedProfiles.size >= 12, `Mixed rows still have weak category-profile diversity: ${mixedProfiles.size}`);
assert(mixedRowsWithRepeats >= 20, `Mixed rows rarely exercise repeated-token occurrences: ${mixedRowsWithRepeats}/100`);

// Digit rows must also admit realistic repeated digits where the query is
// occurrence-safe, rather than always being a permutation of distinct digits.
let repeatedDigitRows = 0;
const digitLengths = new Set<number>();
for (let seed = 0; seed < 100; seed += 1) {
  const question = generateAlp001Question("ALP-QL-119", seed, "en-IN");
  const row = question.structuredPrompt.sequence ?? [];
  digitLengths.add(row.length);
  if (repeatedOccurrenceCount(row) > 0) repeatedDigitRows += 1;
}
assert(digitLengths.size >= 3, `Digit rows still have fixed length: ${[...digitLengths].join(", ")}`);
assert(repeatedDigitRows >= 15, `Digit rows rarely exercise repeated digits: ${repeatedDigitRows}/100`);

// QL-138/140 were semantic duplicates in the old registry. Permanent IDs are
// preserved, but their canonical identities now cover source-backed compound scans.
assert(ql("ALP-QL-137").ruleId !== ql("ALP-QL-138").ruleId, "QL-137/138 remain semantic duplicates.");
assert(ql("ALP-QL-139").ruleId !== ql("ALP-QL-140").ruleId, "QL-139/140 remain semantic duplicates.");
assert(ql("ALP-QL-138").presentationMode === "COMPOUND_WINDOW", "QL-138 is not registered as a compound three-token scan.");
assert(ql("ALP-QL-140").presentationMode === "CENTRE_FLANK_WINDOW", "QL-140 is not registered as a centre-flank scan.");

let sawZab = false;
let sawSymbolLetterDigit = false;
for (let seed = 0; seed < 40; seed += 1) {
  const q138 = generateAlp001Question("ALP-QL-138", seed, "en-IN");
  assert(Number(q138.answer) >= 1, `QL-138 seed ${seed} failed to embed a valid compound window.`);
  sawZab ||= /preceded by Z/.test(q138.stem);
  sawSymbolLetterDigit ||= /preceded by a symbol/.test(q138.stem);
  assert(q138.explanation.steps.some((step) => /three-element|three-token|three/.test(step)), `QL-138 seed ${seed} lacks three-window pedagogy.`);

  const q140 = generateAlp001Question("ALP-QL-140", seed, "en-IN");
  assert(Number(q140.answer) >= 1, `QL-140 seed ${seed} failed to embed a valid flanked-symbol window.`);
  assert(/letter on one side and a digit on the other/.test(q140.stem), `QL-140 seed ${seed} rendered the wrong semantic stem.`);
}
assert(sawZab && sawSymbolLetterDigit, "QL-138 did not expose both source-backed compound-window variants.");

// CP010 unchanged-position composition must include the source-backed case in
// which letters are alphabetically sorted only within existing letter slots.
const q155 = ql("ALP-QL-155");
const unchangedOperations = new Set<string>();
for (let seed = 0; seed < 80; seed += 1) unchangedOperations.add(buildCp010(q155, seed).operation.en);
assert([...unchangedOperations].some((value) => value.includes("sort only the letters")), "CP010 still cannot compose sort-letters-in-place -> count unchanged.");
assert([...unchangedOperations].some((value) => value.includes("sort only the digits")), "CP010 lacks the symmetric sort-digits-in-place -> count unchanged composition.");

for (const candidate of fatigueScope) {
  const visible = new Set<string>();
  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateAlp001Question(candidate.qlId, seed, "en-IN");
    visible.add(`${question.stem}|${question.options.map((option) => option.value).join("|")}`);
  }
  assert(visible.size >= 95, `${candidate.qlId} fails the 100-question fatigue gate: ${visible.size} distinct visible instances.`);
}

const hardCp7 = ALP_001_QUESTION_STUDIO_REGISTRY.generateControlled({
  seed: 17,
  locale: "en-IN",
  examProfile: "SSC_CGL_TIER_I",
  checkpointId: "ALP-CP-007",
  difficulty: "HARD",
});
assert(hardCp7.difficulty === "HARD", "Controlled ALP generation failed requested HARD difficulty.");
assert(hardCp7.options.length === 4, "SSC CGL profile must retain four options.");
assert(hardCp7.deliveryProfile.examProfile === "SSC_CGL_TIER_I", "Controlled generation lost exam profile metadata.");

const mediumCp6 = ALP_001_QUESTION_STUDIO_REGISTRY.generateControlled({
  seed: 29,
  locale: "pa-IN",
  examProfile: "PUNJAB_STATE_4_OPTION",
  checkpointId: "ALP-CP-006",
  difficulty: "MEDIUM",
});
assert(mediumCp6.difficulty === "MEDIUM", "Controlled ALP generation failed requested MEDIUM difficulty.");
assert(mediumCp6.options.length === 4, "Punjab four-option profile must retain four options.");

let bankingRejected = false;
try {
  ALP_001_QUESTION_STUDIO_REGISTRY.generateControlled({
    seed: 1,
    locale: "en-IN",
    examProfile: "BANKING_GENERIC_5_OPTION",
  });
} catch (error) {
  bankingRejected = /requires 5 options/.test(String(error));
}
assert(bankingRejected, "Five-option Banking profile must fail closed until shared profile support exists.");

console.log("ALP-001 final-audit remediation gate passed.", {
  wordPool: WORDS.length,
  classWordPool: CLASS_WORDS.length,
  fatigueQls: fatigueScope.length,
  checkedDistractors,
  mixedLengths: [...mixedLengths].sort((a, b) => a - b),
  mixedProfiles: mixedProfiles.size,
  mixedRowsWithRepeats,
  repeatedDigitRows,
  controlledHardQl: hardCp7.qlId,
  controlledMediumQl: mediumCp6.qlId,
});
