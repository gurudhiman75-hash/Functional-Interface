import {
  ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID,
  ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertArg001Cp005QuestionStudioPersistenceAllowed,
  previewArg001Cp005QuestionStudioReview,
} from "./question-studio-review.ts";
import { generateArgCp004Question } from "./cp004-generator.ts";
import { ARG_QL_IDS, type ArgLocale } from "./types.ts";
import {
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../question-studio-review-registry.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount === 6, "ARG CP005 must expose six QLs");
assert(ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.semanticSurfaceCapacityPerQl === 2048, "ARG CP005 saturation drift");
assert(ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly === true, "ARG CP005 review-only lock opened");
assert(ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable === false, "ARG CP005 Question Bank gate opened");
assert(ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible === false, "ARG CP005 test gate opened");
assert(ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible === false, "ARG CP005 mock gate opened");
assert(ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable === false, "ARG CP005 public gate opened");
assert(ARG_001_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication === false, "ARG CP005 automatic publication gate opened");

const listed = listReasoningV1QuestionStudioReviewPackages();
assert(
  listed.some((entry) => entry.packageId === ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID),
  "ARG CP005 package missing from shared Question Studio registry",
);

const locales = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly ArgLocale[];
const seeds = [0, 1, 17, 63, 255, 511, 1024, 1537, 2047] as const;
let previewCount = 0;

for (const qlId of ARG_QL_IDS) {
  for (const locale of locales) {
    for (const seed of seeds) {
      const direct = previewArg001Cp005QuestionStudioReview({ qlId, locale, seed });
      const shared = previewReasoningV1QuestionStudioReview({
        packageId: ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID,
        qlId,
        locale,
        seed,
      });
      const cp004 = generateArgCp004Question({ qlId, locale, seed });

      assert(direct.packageId === ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID, `${qlId}/${locale}/${seed}: direct package drift`);
      assert(shared.packageId === ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID, `${qlId}/${locale}/${seed}: shared package drift`);
      assert(direct.question.checkpointId === "ARG-CP-005", `${qlId}/${locale}/${seed}: checkpoint drift`);
      assert(direct.question.version === "CP005", `${qlId}/${locale}/${seed}: version drift`);
      assert(direct.question.metadata.questionStudioRegistered === true, `${qlId}/${locale}/${seed}: Question Studio flag not opened`);
      assert(direct.question.metadata.reviewOnly === true, `${qlId}/${locale}/${seed}: review-only flag opened`);
      assert(direct.question.metadata.questionBankWritable === false, `${qlId}/${locale}/${seed}: Question Bank flag opened`);
      assert(direct.question.metadata.testEligible === false && direct.question.metadata.mockEligible === false, `${qlId}/${locale}/${seed}: learner test flag opened`);
      assert(direct.question.metadata.publicEligible === false && direct.question.metadata.automaticStudentPublication === false, `${qlId}/${locale}/${seed}: public flag opened`);

      assert(direct.question.statement === cp004.statement, `${qlId}/${locale}/${seed}: CP005 changed certified statement`);
      assert(direct.question.arguments[0] === cp004.arguments[0] && direct.question.arguments[1] === cp004.arguments[1], `${qlId}/${locale}/${seed}: CP005 changed certified arguments`);
      assert(direct.question.correctIndex === cp004.correctIndex, `${qlId}/${locale}/${seed}: correct-index drift`);
      assert(direct.question.answerClass === cp004.answerClass, `${qlId}/${locale}/${seed}: answer-class drift`);
      assert(direct.question.explanation === cp004.explanation, `${qlId}/${locale}/${seed}: explanation drift`);
      previewCount += 1;
    }
  }
}

let directPersistenceBlocked = false;
try {
  assertArg001Cp005QuestionStudioPersistenceAllowed();
} catch {
  directPersistenceBlocked = true;
}
assert(directPersistenceBlocked, "Direct ARG CP005 persistence guard did not block");

let sharedPersistenceBlocked = false;
try {
  persistReasoningV1QuestionStudioReview({
    packageId: ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "ARG-QL-001",
    locale: "en-IN",
    seed: 0,
  });
} catch {
  sharedPersistenceBlocked = true;
}
assert(sharedPersistenceBlocked, "Shared ARG CP005 persistence route did not block");

console.log(JSON.stringify({
  chapter: "ARG-001",
  checkpoint: "ARG-CP-005",
  packageId: ARG_001_CP005_QUESTION_STUDIO_PACKAGE_ID,
  previewSamplesVerified: previewCount,
  qls: 6,
  locales: locales.length,
  semanticSurfaceCapacityPerQl: 2048,
  questionStudio: "REGISTERED_REVIEW_ONLY",
  persistence: "BLOCKED",
  learnerRelease: "LOCKED",
}, null, 2));
