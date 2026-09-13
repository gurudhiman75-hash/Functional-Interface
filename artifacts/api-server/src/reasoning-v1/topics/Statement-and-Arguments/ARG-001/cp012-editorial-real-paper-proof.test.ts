import assert from "node:assert/strict";

import {
  ARG_CP007_EXAM_PROFILES,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
} from "./cp007-exam-profile-generator-v2.ts";
import { ARG_CP010_AUTHORITY } from "./cp010-correlated-real-paper-generator.ts";
import {
  ARG_CP012_AUTHORITY,
  ARG_CP012_CHECKPOINT_ID,
  generateArgCp012RealPaperQuestion,
} from "./cp012-editorial-real-paper-remediation.ts";
import { ARG_QL_IDS, type ArgLocale } from "./types.ts";

const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly ArgLocale[];
const PROFILE_DIFFICULTIES: readonly [ArgCp007ExamProfile, ArgCp007Difficulty][] = [
  ["SSC_RECENT_2X4", "Easy"],
  ["SSC_RECENT_2X4", "Medium"],
  ["BANKING_CLASSIC_2X5", "Medium"],
  ["BANKING_CLASSIC_2X5", "Hard"],
  ["BANKING_COMBO_3X5", "Medium"],
  ["BANKING_COMBO_3X5", "Hard"],
  ["BANKING_COMBO_4X5", "Hard"],
];

assert.equal(ARG_CP012_CHECKPOINT_ID, "ARG-CP-012");
assert.equal(ARG_CP012_AUTHORITY, "ARG_CP012_EDITORIAL_REAL_PAPER_REMEDIATION_V1");

function strongCount(question: ReturnType<typeof generateArgCp012RealPaperQuestion>): number {
  return question.argumentStrengths.filter((strength) => strength === "STRONG").length;
}

function assertLocked(question: ReturnType<typeof generateArgCp012RealPaperQuestion>): void {
  assert.equal(question.metadata.reviewOnly, true);
  assert.equal(question.metadata.manualApprovalRequired, true);
  assert.equal(question.metadata.persistenceAllowed, false);
  assert.equal(question.metadata.questionBankWritable, false);
  assert.equal(question.metadata.testEligible, false);
  assert.equal(question.metadata.mockEligible, false);
  assert.equal(question.metadata.publicEligible, false);
  assert.equal(question.metadata.automaticStudentPublication, false);
  assert.equal(question.metadata.learnerRelease, "LOCKED");
}

// Shape, authority, answer integrity and deterministic replay across every profile/QL/locale.
for (const [profile, difficulty] of PROFILE_DIFFICULTIES) {
  const profileMeta = ARG_CP007_EXAM_PROFILES[profile];
  for (const qlId of ARG_QL_IDS) {
    for (const locale of LOCALES) {
      for (let seed = 0; seed < 24; seed += 1) {
        const input = { qlId, locale, seed, profile, difficulty } as const;
        const first = generateArgCp012RealPaperQuestion(input);
        const replay = generateArgCp012RealPaperQuestion(input);
        assert.deepEqual(first, replay, `non-deterministic CP012 replay ${profile}/${difficulty}/${qlId}/${locale}/${seed}`);
        assert.equal(first.checkpointId, ARG_CP012_CHECKPOINT_ID);
        assert.equal(first.authority, ARG_CP012_AUTHORITY);
        assert.equal(first.profile, profile);
        assert.equal(first.difficultyLabel, difficulty);
        assert.equal(first.arguments.length, profileMeta.argumentCount);
        assert.equal(first.argumentStrengths.length, profileMeta.argumentCount);
        assert.equal(first.options.length, profileMeta.optionCount);
        assert.ok(first.correctIndex >= 0 && first.correctIndex < first.options.length);
        assert.equal(first.answer, first.options[first.correctIndex]);
        assert.equal(new Set(first.options).size, first.options.length, "options must remain unique");
        assert.equal(first.metadata.supersedesRealPaperAuthority, ARG_CP010_AUTHORITY);
        assert.equal(first.metadata.answerCardinalityAntiGaming, true);
        assertLocked(first);
      }
    }
  }
}

// CP010's 3x5 shortcut was difficulty-predictable: Medium always two strong, Hard always one.
// CP012 must expose both one-strong and two-strong surfaces inside every QL/locale/difficulty.
for (const difficulty of ["Medium", "Hard"] as const) {
  for (const qlId of ARG_QL_IDS) {
    for (const locale of LOCALES) {
      const counts = new Set<number>();
      for (let seed = 0; seed < 64; seed += 1) {
        counts.add(strongCount(generateArgCp012RealPaperQuestion({
          qlId,
          locale,
          seed,
          profile: "BANKING_COMBO_3X5",
          difficulty,
        })));
      }
      assert.deepEqual([...counts].sort(), [1, 2], `3x5 cardinality breadth missing for ${difficulty}/${qlId}/${locale}`);
    }
  }
}

// CP010's 4x5 surface always contained exactly two strong arguments.
// CP012 must cycle one-, two- and three-strong states inside every QL and locale.
for (const qlId of ARG_QL_IDS) {
  for (const locale of LOCALES) {
    const counts = new Set<number>();
    const modes = new Set<string>();
    for (let seed = 0; seed < 96; seed += 1) {
      const question = generateArgCp012RealPaperQuestion({
        qlId,
        locale,
        seed,
        profile: "BANKING_COMBO_4X5",
        difficulty: "Hard",
      });
      counts.add(strongCount(question));
      modes.add(String(question.metadata.cardinalityMode));
    }
    assert.deepEqual([...counts].sort(), [1, 2, 3], `4x5 cardinality breadth missing for ${qlId}/${locale}`);
    assert.deepEqual(
      [...modes].sort(),
      ["FOUR_ARGUMENT_ONE_STRONG", "FOUR_ARGUMENT_THREE_STRONG", "FOUR_ARGUMENT_TWO_STRONG"].sort(),
      `4x5 remediation modes missing for ${qlId}/${locale}`,
    );
  }
}

// QL001 grievance-contact scenarios were correlated by actor/object in CP010 but one generic
// justification still claimed that a grievance contact helps users "understand the decision process".
// CP012 must use a grievance/clarification mechanism instead, in all three locales.
for (const [seed, scenarioName] of [[2, "LICENSING_GRIEVANCE_CONTACT"], [3, "SCHOLARSHIP_GRIEVANCE_CONTACT"]] as const) {
  for (const locale of LOCALES) {
    const question = generateArgCp012RealPaperQuestion({
      qlId: "ARG-QL-001",
      locale,
      seed,
      profile: "BANKING_COMBO_4X5",
      difficulty: "Hard",
    });
    assert.equal(question.metadata.correlatedScenarioId, scenarioName);
    assert.ok(!question.arguments.some((argument) => argument.includes("understand the decision process")));
    assert.ok(!question.arguments.some((argument) => argument.includes("निर्णय प्रक्रिया")));
    assert.ok(!question.arguments.some((argument) => argument.includes("ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ")));
  }
}

// Remove literal-calque explanation language found during the manual Hindi/Punjabi editorial pass.
for (const locale of ["hi-IN", "pa-IN"] as const) {
  for (let seed = 0; seed < 24; seed += 1) {
    const question = generateArgCp012RealPaperQuestion({
      qlId: "ARG-QL-005",
      locale,
      seed,
      profile: "BANKING_COMBO_4X5",
      difficulty: "Hard",
    });
    assert.ok(!question.explanation.includes("सूचित-नोटिस"));
    assert.ok(!question.explanation.includes("अनुपातिकता सुरक्षा"));
    assert.ok(!question.explanation.includes("ਜਾਣਕਾਰੀ-ਨੋਟਿਸ"));
    assert.ok(!question.explanation.includes("ਅਨੁਪਾਤਿਕਤਾ ਸੁਰੱਖਿਆ"));
  }
}

console.log("ARG-001 CP012 real-paper editorial remediation: PASS (correlated copy fixed; 3x5/4x5 cardinality anti-gaming restored; trilingual wording improved; learner gates locked)");
