import { CLASS_WORDS, WORDS } from "./completion/shared";
import { ALP_001_QLS } from "./ql-registry";
import { ALP_001_QUESTION_STUDIO_REGISTRY } from "./question-studio-registry";
import { generateAlp001Question } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(WORDS.length >= 180, `ALP CP006 source pool is too small: ${WORDS.length}`);
assert(new Set(WORDS).size === WORDS.length, "ALP CP006 source pool contains duplicates.");
assert(CLASS_WORDS.length >= 160, `ALP CP007 class-word pool is too small: ${CLASS_WORDS.length}`);
assert(new Set(CLASS_WORDS).size === CLASS_WORDS.length, "ALP CP007 class-word pool contains duplicates.");

const advanced = ALP_001_QLS.filter((ql) => Number(ql.checkpointId.slice(-3)) >= 6);
const fatigueScope = advanced.filter((ql) => ql.checkpointId === "ALP-CP-006" || ql.checkpointId === "ALP-CP-007");
const blockedLegacyLabels = new Set(["SOURCE_ROW_EARLY", "OPPOSITE_REFERENCE", "WRONG_FINAL_CONDITION", "DOMAIN_VALID_FALLBACK"]);
let checkedDistractors = 0;

for (const ql of advanced) {
  const structuralDifficulties = new Set<string>();
  for (let seed = 0; seed < 24; seed += 1) {
    const question = generateAlp001Question(ql.qlId, seed, "en-IN");
    structuralDifficulties.add(question.difficulty);
    for (const option of question.options) {
      if (option.errorLabel === null) continue;
      checkedDistractors += 1;
      assert(!blockedLegacyLabels.has(option.errorLabel), `${ql.qlId} seed ${seed} retained legacy/fallback distractor label ${option.errorLabel}.`);
    }
  }
  assert(structuralDifficulties.size === 1, `${ql.qlId} changes difficulty merely because the seed changes: ${[...structuralDifficulties].join(", ")}`);
}

for (const ql of fatigueScope) {
  const visible = new Set<string>();
  for (let seed = 0; seed < 100; seed += 1) {
    const question = generateAlp001Question(ql.qlId, seed, "en-IN");
    visible.add(`${question.stem}|${question.options.map((option) => option.value).join("|")}`);
  }
  assert(visible.size >= 95, `${ql.qlId} fails the 100-question fatigue gate: ${visible.size} distinct visible instances.`);
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
  controlledHardQl: hardCp7.qlId,
  controlledMediumQl: mediumCp6.qlId,
});
