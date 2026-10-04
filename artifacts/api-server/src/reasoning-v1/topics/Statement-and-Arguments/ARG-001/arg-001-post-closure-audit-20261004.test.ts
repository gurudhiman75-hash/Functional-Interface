import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
  ARG_CP015_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
  assertArgCp015FinalAnswerIntegrity,
} from "./cp015-post-closure-answer-proof.ts";
import {
  ARG_CP015_QUESTION_STUDIO_PACKAGE,
  generateArgCp015QuestionStudioBatch,
} from "./cp015-perceived-diversity-expansion.ts";
import { ARG_QL_IDS } from "./types.ts";

type Language = "en" | "hi" | "pa";
type Difficulty = "Easy" | "Medium" | "Hard";
type Question = Readonly<Record<string, any>>;

const LANGUAGES = ["en", "hi", "pa"] as const;
const CELLS = [
  { profileMode: "core" as const, difficulty: "Easy" as const },
  { profileMode: "core" as const, difficulty: "Medium" as const },
  { profileMode: "core" as const, difficulty: "Hard" as const },
  { profileMode: "real-paper" as const, examProfile: "SSC_RECENT_2X4", difficulty: "Easy" as const },
  { profileMode: "real-paper" as const, examProfile: "SSC_RECENT_2X4", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_CLASSIC_2X5", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_CLASSIC_2X5", difficulty: "Hard" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_COMBO_3X5", difficulty: "Medium" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_COMBO_3X5", difficulty: "Hard" as const },
  { profileMode: "real-paper" as const, examProfile: "BANKING_COMBO_4X5", difficulty: "Hard" as const },
] as const;

let audited = 0;
const fingerprints: string[] = [];
const profileCounts = new Map<string, number>();
const answerIndexCounts = new Map<number, number>();
let bankingEitherDistractors = 0;
let contextualizedProvenanceSurfaces = 0;
let residualProvenanceSurfaces = 0;

for (const language of LANGUAGES) {
  for (const qlId of ARG_QL_IDS) {
    for (let cellIndex = 0; cellIndex < CELLS.length; cellIndex += 1) {
      const cell = CELLS[cellIndex]!;
      for (let seedIndex = 0; seedIndex < 16; seedIndex += 1) {
        const batch = generateArgCp015QuestionStudioBatch({
          profileMode: cell.profileMode,
          examProfile: "examProfile" in cell ? cell.examProfile : undefined,
          qlId,
          language,
          difficulty: cell.difficulty,
          seed: `ARG-POST-CLOSURE:${language}:${qlId}:${cellIndex}:${seedIndex}`,
          count: 1,
        });
        const question = batch.questions[0] as Question;
        assertArgCp015FinalAnswerIntegrity(question);
        if (Array.isArray(question.preArgumentContextualizationArguments)) {
          contextualizedProvenanceSurfaces += 1;
        }
        if (Array.isArray(question.preResidualArgumentDiversityArguments)) {
          residualProvenanceSurfaces += 1;
        }

        assert.equal(batch.generationContext.postClosureAnswerProofVerified, true);
        assert.equal(
          batch.generationContext.postClosureAnswerProofAuthority,
          ARG_CP015_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
        );
        assert.equal(question.questionBankWritable, true);
        assert.equal(question.testEligible, true);
        assert.equal(question.mockTestEligible, true);
        assert.equal(question.publiclyPublishable, false);
        assert.equal(question.publicReleaseAuthorized, false);
        assert.equal(question.studentDeliveryAuthorized, false);
        assert.equal(question.automaticStudentPublication, false);

        const profile = String(question.examProfile ?? "CORE");
        profileCounts.set(profile, (profileCounts.get(profile) ?? 0) + 1);
        const correctIndex = Number(question.correctIndex);
        answerIndexCounts.set(correctIndex, (answerIndexCounts.get(correctIndex) ?? 0) + 1);
        if (
          profile === "BANKING_CLASSIC_2X5"
          && (question.options as readonly string[]).some((option) => /Either|या\s+तो|ਜਾਂ/.test(option))
        ) {
          bankingEitherDistractors += 1;
          assert.notEqual(correctIndex, 2);
        }

        fingerprints.push(createHash("sha256").update(JSON.stringify([
          question.qlId,
          question.statement,
          question.arguments,
          question.argumentStrengths,
          question.options,
          question.correctIndex,
          question.explanation,
        ])).digest("hex"));
        audited += 1;
      }
    }
  }
}

assert.equal(audited, LANGUAGES.length * ARG_QL_IDS.length * CELLS.length * 16);
assert.ok(new Set(fingerprints).size > audited * 0.9, "ARG post-closure audit has unexpectedly low learner-surface diversity");
assert.ok(bankingEitherDistractors > 0);
for (const index of [0, 1, 2, 3, 4]) {
  if (index === 4) {
    assert.ok((answerIndexCounts.get(index) ?? 0) > 0, "Banking profiles must exercise answer option 5");
  } else {
    assert.ok((answerIndexCounts.get(index) ?? 0) > 0, `answer position ${index + 1} was not exercised`);
  }
}

// The proof must fail closed when only the answer index is corrupted.
{
  const sample = generateArgCp015QuestionStudioBatch({
    profileMode: "real-paper",
    examProfile: "BANKING_COMBO_3X5",
    qlId: "ARG-QL-006",
    language: "en",
    difficulty: "Hard",
    seed: "ARG-POST-CLOSURE-DRIFT",
    count: 1,
  }).questions[0] as Question;
  const wrongIndex = (Number(sample.correctIndex) + 1) % (sample.options as readonly unknown[]).length;
  assert.throws(
    () => assertArgCp015FinalAnswerIntegrity({
      ...sample,
      correctIndex: wrongIndex,
      correct: wrongIndex,
      answer: (sample.options as readonly string[])[wrongIndex],
      canonicalAnswer: (sample.options as readonly string[])[wrongIndex],
    }),
    /runtime correct index .* disagrees with independently parsed option semantics/i,
  );

  const driftedStrengths = [...(sample.argumentStrengths as readonly string[])];
  driftedStrengths[0] = driftedStrengths[0] === "STRONG" ? "WEAK" : "STRONG";
  assert.throws(
    () => assertArgCp015FinalAnswerIntegrity({
      ...sample,
      argumentStrengths: driftedStrengths,
    }),
    /contextualized role .* expects (?:STRONG|WEAK)|runtime correct index .* disagrees with independently parsed option semantics|expected exactly one option for strong-set/i,
  );
}

assert.ok(
  contextualizedProvenanceSurfaces > 0,
  "ARG post-closure audit did not exercise contextualized combo provenance",
);
assert.ok(
  residualProvenanceSurfaces > 0,
  "ARG post-closure audit did not exercise residual combo provenance",
);

// Provenance proof must fail closed when a transformed argument is tampered with
// while the carried strength vector and answer metadata are left untouched.
{
  let sample: Question | undefined;
  for (let seedIndex = 0; seedIndex < 128 && !sample; seedIndex += 1) {
    const question = generateArgCp015QuestionStudioBatch({
      profileMode: "real-paper",
      examProfile: "BANKING_COMBO_4X5",
      qlId: "ARG-QL-004",
      language: "en",
      difficulty: "Hard",
      seed: `ARG-POST-CLOSURE-PROVENANCE-DRIFT:${seedIndex}`,
      count: 1,
    }).questions[0] as Question;
    if (Array.isArray(question.postResidualArgumentDiversityArguments)) sample = question;
  }
  assert.ok(sample, "ARG provenance drift test could not locate a residual-rewrite sample");
  const tampered = [...(sample!.postResidualArgumentDiversityArguments as readonly string[])];
  tampered[0] = `${tampered[0]} This sentence was not produced by the approved rewrite family.`;
  assert.throws(
    () => assertArgCp015FinalAnswerIntegrity({
      ...sample!,
      postResidualArgumentDiversityArguments: tampered,
    }),
    /outside the approved semantic variant family/i,
  );
}

assert.equal(ARG_CP015_QUESTION_STUDIO_PACKAGE.questionBankWritable, true);
assert.equal(ARG_CP015_QUESTION_STUDIO_PACKAGE.testEligible, true);
assert.equal(ARG_CP015_QUESTION_STUDIO_PACKAGE.mockTestEligible, true);
assert.equal(ARG_CP015_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_CP015_QUESTION_STUDIO_PACKAGE.publicReleaseAuthorized, false);
assert.equal(ARG_CP015_QUESTION_STUDIO_PACKAGE.studentDeliveryAuthorized, false);
assert.equal(ARG_CP015_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(
  ARG_CP015_QUESTION_STUDIO_PACKAGE.postClosureAnswerProofAuthority,
  ARG_CP015_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
);

console.log(JSON.stringify({
  status: "PASS_ARG_001_POST_CLOSURE_AUDIT_20261004",
  qlCount: ARG_QL_IDS.length,
  languages: LANGUAGES,
  cells: CELLS.length,
  generatedLearnerSurfaces: audited,
  uniqueSurfaceFingerprints: new Set(fingerprints).size,
  profileCounts: Object.fromEntries(profileCounts),
  answerIndexCounts: Object.fromEntries([...answerIndexCounts].sort(([a], [b]) => a - b)),
  bankingEitherDistractors,
  contextualizedProvenanceSurfaces,
  residualProvenanceSurfaces,
  answerProofAuthority: ARG_CP015_POST_CLOSURE_ANSWER_PROOF_AUTHORITY,
  lifecycle: {
    questionBankWritable: true,
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
  },
}, null, 2));
