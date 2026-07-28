import { MAL_CP001_PERMANENT_QL_IDS } from "./foundation/cp001-permanent-allocation";
import { runMalCp001PermanentPipeline } from "./foundation/cp001-permanent-runtime";

function fail(message: string): never {
  throw new Error(message);
}

const forbiddenStemPatterns = [
  ["generic monetary average-value wording", /\b(?:weighted\s+)?average value(?: per unit)?\b/iu],
  ["generic worth-per-unit wording", /\bworth per unit\b/iu],
  ["unnamed added component", /\bWhat quantity should be added\?/u],
  ["generic third-grade reference", /\bquantity of the third grade\b/iu],
  ["vague quantity reference", /\bwhat is that quantity\?/iu],
  ["lowercase sentence start", /\.\s+a\s+\d/iu],
  ["unnatural unknown-price tail", /\bwhat price must [^?]+ have\?/iu],
  ["generic unknown-value tail", /\bwhat is the value of [^?]+ per unit\?/iu],
] as const;

function expectedNamedAnswerLabel(question: any): string | null {
  const request = question.parameters?.request;
  if (!request) return null;
  switch (request.mode) {
    case "UNKNOWN_COMPONENT_VALUE":
      return request.unknownComponentLabel;
    case "SOURCE_VALUE_FROM_RATIO":
      return request.knownSide === "LOWER"
        ? request.higherComponentLabel
        : request.lowerComponentLabel;
    case "ADD_SOURCE_TO_REACH_TARGET":
      return request.addedComponentLabel;
    case "UNKNOWN_COMPONENT_QUANTITY":
      return request.unknownComponentLabel;
    case "COMPONENT_SHARE_FROM_TARGET":
      return request.requestedSide === "LOWER"
        ? request.lowerComponentLabel
        : request.higherComponentLabel;
    default:
      return null;
  }
}

let generatedQuestionCount = 0;
let namedAnswerContractCount = 0;
let forbiddenPatternMatchCount = 0;
let pluralVerbMismatchCount = 0;
let commonTrapCasingMismatchCount = 0;

for (const qlId of MAL_CP001_PERMANENT_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `permanent-editorial-${qlId}-${index}`;
    const question: any = runMalCp001PermanentPipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });
    generatedQuestionCount += 1;

    for (const [label, pattern] of forbiddenStemPatterns) {
      if (pattern.test(question.stem)) {
        forbiddenPatternMatchCount += 1;
        fail(`${qlId}/${seed}: ${label}: ${question.stem}`);
      }
    }

    const expectedLabel = expectedNamedAnswerLabel(question);
    if (expectedLabel) {
      namedAnswerContractCount += 1;
      if (!question.stem.includes(expectedLabel)) {
        fail(`${qlId}/${seed}: stem omits requested component ${expectedLabel}: ${question.stem}`);
      }
      if (!question.explanation.conclusion.includes(expectedLabel)) {
        fail(
          `${qlId}/${seed}: conclusion omits requested component ${expectedLabel}: ${question.explanation.conclusion}`,
        );
      }
    }

    if (/(?:leaves|beans) costs\b/iu.test(question.explanation.conclusion)) {
      pluralVerbMismatchCount += 1;
      fail(`${qlId}/${seed}: plural material uses singular cost verb: ${question.explanation.conclusion}`);
    }

    if (!/^Common trap:\s+[a-z]/u.test(question.explanation.commonTrap)) {
      commonTrapCasingMismatchCount += 1;
      fail(`${qlId}/${seed}: common-trap casing is not normalised: ${question.explanation.commonTrap}`);
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_CP001_PERMANENT_ENGLISH_EDITORIAL_AUDIT",
  permanentQlCount: MAL_CP001_PERMANENT_QL_IDS.length,
  generatedQuestionCount,
  namedAnswerContractCount,
  forbiddenPatternMatchCount,
  pluralVerbMismatchCount,
  commonTrapCasingMismatchCount,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
}, null, 2));
