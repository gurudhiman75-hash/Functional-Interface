import assert from "node:assert/strict";
import { type ClsCp007LocalizedLocale } from "./cp007-localized-runtime";
import {
  generateClsCp007LocalizedClusterQuestionV2,
  generateClsCp007LocalizedPairQuestionV2,
} from "./cp007-localized-runtime-v2";
import {
  generateClsCp007LocalizedClusterQuestionV3,
  generateClsCp007LocalizedPairQuestionV3,
} from "./cp007-localized-runtime-v3";
import type { ClsCp007PrototypeId } from "./types";

const PROTOTYPES: readonly ClsCp007PrototypeId[] = [
  "CLS-CP007-PROT-001", "CLS-CP007-PROT-002", "CLS-CP007-PROT-003",
  "CLS-CP007-PROT-004", "CLS-CP007-PROT-005", "CLS-CP007-PROT-006",
  "CLS-CP007-PROT-007", "CLS-CP007-PROT-008", "CLS-CP007-PROT-009",
  "CLS-CP007-PROT-010", "CLS-CP007-PROT-011", "CLS-CP007-PROT-012",
  "CLS-CP007-PROT-013",
];
const LOCALES: readonly ClsCp007LocalizedLocale[] = ["hi-IN", "pa-IN"];

function verifyCompact(
  v2: ReturnType<typeof generateClsCp007LocalizedClusterQuestionV2> | ReturnType<typeof generateClsCp007LocalizedPairQuestionV2>,
  v3: ReturnType<typeof generateClsCp007LocalizedClusterQuestionV3> | ReturnType<typeof generateClsCp007LocalizedPairQuestionV3>,
  context: string,
): void {
  assert.deepEqual(v3.items, v2.items, `${context}: item state drift`);
  assert.deepEqual(v3.options, v2.options, `${context}: options drift`);
  assert.equal(v3.correctIndex, v2.correctIndex, `${context}: answer-position drift`);
  assert.equal(v3.answer, v2.answer, `${context}: answer drift`);
  assert.equal(v3.intendedRuleId, v2.intendedRuleId, `${context}: rule drift`);
  assert.equal(v3.intendedRuleValue, v2.intendedRuleValue, `${context}: rule-value drift`);
  assert.deepEqual(v3.ambiguityAudit, v2.ambiguityAudit, `${context}: ambiguity drift`);
  assert.equal(v3.difficulty, v2.difficulty, `${context}: difficulty drift`);
  assert.equal(v3.permanentQlId, v2.permanentQlId, `${context}: QL drift`);
  assert.deepEqual(v3.evidenceByOption, v2.evidenceByOption, `${context}: QA evidence drift`);
  assert.deepEqual(v3.explanation.coreConcept, v2.explanation.coreConcept, `${context}: concept drift`);
  assert.equal(v3.metadata.runtimeVersion, "cls-cp007-multilingual-review-v3");
  assert.equal(v3.metadata.editorialVersion, "compact-learner-explanation-v3");
  assert.equal(v3.explanation.examSpeedShortcut.length, 0);
  assert.equal(v3.explanation.commonTrapWarning.length, 0);
  assert.equal(v3.explanation.stepByStep.length, 3, `${context}: learner explanation should have exactly three steps`);

  const representativeIndex = v2.evidenceByOption.findIndex((_, index) => index !== v2.correctIndex);
  assert.equal(v3.explanation.stepByStep[0], v2.evidenceByOption[representativeIndex], `${context}: representative evidence mismatch`);
  assert.equal(v3.explanation.stepByStep[1], v2.evidenceByOption[v2.correctIndex], `${context}: outlier evidence mismatch`);
  assert.ok(v3.explanation.stepByStep[2]!.includes(v3.answer), `${context}: conclusion must name the answer`);

  if (v3.options.length > 3) {
    const omittedEvidence = v2.evidenceByOption.filter((_, index) => index !== representativeIndex && index !== v2.correctIndex);
    for (const line of omittedEvidence) {
      assert.ok(!v3.explanation.stepByStep.includes(line), `${context}: routine option-by-option analysis leaked into learner explanation`);
    }
  }
}

let singleChecked = 0;
let pairChecked = 0;

for (const locale of LOCALES) {
  for (const prototypeId of PROTOTYPES) {
    for (let seed = 0; seed < 20; seed += 1) {
      const optionCount = seed % 4 === 0 ? 5 : 4;
      const v2 = generateClsCp007LocalizedClusterQuestionV2(locale, prototypeId, seed, optionCount);
      const v3 = generateClsCp007LocalizedClusterQuestionV3(locale, prototypeId, seed, optionCount);
      verifyCompact(v2, v3, `${locale}/${prototypeId}/${seed}`);
      singleChecked += 1;
    }
  }

  for (let seed = 0; seed < 200; seed += 1) {
    const optionCount = seed % 3 === 0 ? 5 : 4;
    const v2 = generateClsCp007LocalizedPairQuestionV2(locale, seed, optionCount);
    const v3 = generateClsCp007LocalizedPairQuestionV3(locale, seed, optionCount);
    verifyCompact(v2, v3, `${locale}/PAIR/${seed}`);
    pairChecked += 1;
  }
}

assert.equal(singleChecked, LOCALES.length * PROTOTYPES.length * 20);
assert.equal(pairChecked, LOCALES.length * 200);

console.log("CLS-CP-007 compact learner-explanation V3 audit passed.", {
  singleChecked,
  pairChecked,
  total: singleChecked + pairChecked,
  mathematicalStateChanges: 0,
  optionByOptionLearnerAnalysis: false,
});
