import { MAL_CP001_PERMANENT_QL_IDS } from "./foundation/cp001-permanent-allocation";
import { runMalCp001EnglishReleasePipeline } from "./foundation/cp001-release";

function fail(message: string): never {
  throw new Error(message);
}

const forbiddenLearnerPatterns = [
  ["wrong article before required quantity", /\ban real quantity\b/iu],
  ["unnecessary actual-unit wording", /\bactual kilograms or litres\b/iu],
  ["unnecessary real-quantity wording", /\breal quantity\b/iu],
  ["less familiar mean-price wording", /\bmean price\b/iu],
  ["unnecessary actual-quantity wording", /\bactual quantity\b/iu],
  ["unnatural normal-two-item wording", /\bnormal two-item\b/iu],
  ["bad simplified article", /\ban (?:normal|first|required)\b/iu],
] as const;

let generatedQuestionCount = 0;
let learnerTextBlockCount = 0;
let violationCount = 0;

for (const qlId of MAL_CP001_PERMANENT_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `release-language-final-${qlId}-${index}`;
    const question = runMalCp001EnglishReleasePipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });
    generatedQuestionCount += 1;

    const learnerBlocks = [
      question.stem,
      ...question.options,
      question.explanation.coreConcept,
      question.explanation.formula,
      ...question.explanation.steps,
      question.explanation.examShortcut,
      question.explanation.verification,
      question.explanation.conclusion,
      question.explanation.commonTrap,
    ];
    learnerTextBlockCount += learnerBlocks.length;
    const learnerText = learnerBlocks.join("\n");

    for (const [label, pattern] of forbiddenLearnerPatterns) {
      if (pattern.test(learnerText)) {
        violationCount += 1;
        fail(`${qlId}/${seed}: ${label}: ${learnerText}`);
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP001_RELEASE_LANGUAGE_FINAL_AUDIT",
      permanentQlCount: MAL_CP001_PERMANENT_QL_IDS.length,
      generatedQuestionCount,
      learnerTextBlockCount,
      forbiddenPatternCount: forbiddenLearnerPatterns.length,
      violationCount,
      publiclyPublishable: true,
      questionStudioDiscoverable: true,
      questionBankWritable: true,
      testEligible: true,
    },
    null,
    2,
  ),
);
