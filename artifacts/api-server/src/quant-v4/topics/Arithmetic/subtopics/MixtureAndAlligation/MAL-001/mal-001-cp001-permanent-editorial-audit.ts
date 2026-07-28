import { MAL_CP001_PERMANENT_QL_IDS } from "./foundation/cp001-permanent-allocation";
import { runMalCp001PermanentPipeline } from "./foundation/cp001-permanent-runtime";
import { MAL_CP001_TEACHER_LAYOUT_ID } from "./foundation/cp001-teacher-explanation";

function fail(message: string): never {
  throw new Error(message);
}

const forbiddenStemPatterns = [
  ["generic monetary average-value wording", /\b(?:weighted\s+)?average value(?: per unit)?\b/iu],
  ["generic worth-per-unit wording", /\bworth per unit\b/iu],
  ["unnamed added component", /\bWhat quantity should be added\?/u],
  ["generic third-grade reference", /\bquantity of the third grade\b/iu],
  ["vague quantity reference", /\bwhat is that quantity\?/iu],
  ["lowercase sentence start", /\.\s+a\s+\d/u],
  ["lowercase question after full stop", /\.\s+(?:what|how)\b/u],
  ["capitalised question word after comma", /,\s+(?:What|How)\b/u],
  ["awkward quantity-worth construction", /\bto obtain \d+(?:\s+\d+\/\d+)? (?:kg|litres) worth\b/iu],
  ["unnatural unknown-price tail", /\bwhat price must [^?]+ have\?/iu],
  ["generic unknown-value tail", /\bwhat is the value of [^?]+ per unit\?/iu],
] as const;

const forbiddenExplanationPatterns = [
  ["robotic weighted-contribution phrase", /\bweighted contribution\b/iu],
  ["robotic reconstruction word", /\breconstruct(?:ed|ion)?\b/iu],
  ["robotic isolate word", /\bisolat(?:e|ed|ing)\b/iu],
  ["internal topology word", /\btopology\b/iu],
  ["internal scalar word", /\bscalar\b/iu],
  ["internal evidence word", /\bevidence\b/iu],
  ["internal determinacy word", /\bdeterminacy\b/iu],
  ["dry matrix wording", /\bmatrix\b/iu],
  ["unexplained source-variable wording", /\bsource variables?\b/iu],
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

function isSourceValueRequest(question: any): boolean {
  const mode = question.parameters?.request?.mode;
  return mode === "UNKNOWN_COMPONENT_VALUE" || mode === "SOURCE_VALUE_FROM_RATIO";
}

function explanationText(question: any): string {
  const explanation = question.explanation;
  return [
    explanation.coreConcept,
    explanation.formula,
    ...explanation.steps,
    explanation.examShortcut,
    explanation.verification,
    explanation.conclusion,
    explanation.commonTrap,
  ].join("\n");
}

let generatedQuestionCount = 0;
let namedAnswerContractCount = 0;
let sourceValueUnitContractCount = 0;
let fourTierLayoutCount = 0;
let numberedStepCount = 0;
let simpleVocabularyViolationCount = 0;
let forbiddenPatternMatchCount = 0;
let pluralVerbMismatchCount = 0;
let conclusionSentenceCaseMismatchCount = 0;
let commonTrapCasingMismatchCount = 0;
let commonTrapHyphenationMismatchCount = 0;

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

    const explanation = question.explanation;
    if (
      explanation.layoutId !== MAL_CP001_TEACHER_LAYOUT_ID ||
      explanation.languageLevel !== "SIMPLE_ENGLISH" ||
      explanation.sectionTitles.coreConcept !== "📌 Core Concept & Formula" ||
      explanation.sectionTitles.steps !== "📝 Step-by-Step Solution" ||
      explanation.sectionTitles.shortcut !== "⚡ 10-Second Exam Shortcut" ||
      explanation.sectionTitles.trap !== "⚠️ Common Trap & Mistake Warning"
    ) {
      fail(`${qlId}/${seed}: four-tier teacher layout metadata is incomplete.`);
    }
    fourTierLayoutCount += 1;

    if (!explanation.formula.includes("\\(") || !explanation.formula.includes("\\)")) {
      fail(`${qlId}/${seed}: formula is not MathJax-ready: ${explanation.formula}`);
    }
    if (!Array.isArray(explanation.steps) || explanation.steps.length < 5) {
      fail(`${qlId}/${seed}: explanation has fewer than five visible steps.`);
    }
    explanation.steps.forEach((step: string, stepIndex: number) => {
      if (!step.startsWith(`Step ${stepIndex + 1}: `)) {
        fail(`${qlId}/${seed}: step numbering is broken: ${step}`);
      }
      if (!/[=×÷−+]|ratio|quantity|price|value/iu.test(step)) {
        fail(`${qlId}/${seed}: step does not show useful working: ${step}`);
      }
      numberedStepCount += 1;
    });
    if (explanation.examShortcut.length < 45) {
      fail(`${qlId}/${seed}: exam shortcut is too short to teach the method.`);
    }
    if (!/^Common trap:\s+(?:do not|a |an |the |read |keep |leaving |equal )/u.test(explanation.commonTrap)) {
      commonTrapCasingMismatchCount += 1;
      fail(`${qlId}/${seed}: common-trap wording is not friendly and sentence-cased: ${explanation.commonTrap}`);
    }

    const fullExplanation = explanationText(question);
    for (const [label, pattern] of forbiddenExplanationPatterns) {
      if (pattern.test(fullExplanation)) {
        simpleVocabularyViolationCount += 1;
        fail(`${qlId}/${seed}: ${label}: ${fullExplanation}`);
      }
    }

    const expectedLabel = expectedNamedAnswerLabel(question);
    if (expectedLabel) {
      namedAnswerContractCount += 1;
      if (!question.stem.includes(expectedLabel)) {
        fail(`${qlId}/${seed}: stem omits requested component ${expectedLabel}: ${question.stem}`);
      }
      if (!explanation.conclusion.toLowerCase().includes(expectedLabel.toLowerCase())) {
        fail(
          `${qlId}/${seed}: conclusion omits requested component ${expectedLabel}: ${explanation.conclusion}`,
        );
      }
    }

    if (isSourceValueRequest(question)) {
      sourceValueUnitContractCount += 1;
      const unit = question.parameters.context.quantityUnit === "kg" ? "kg" : "litre";
      if (!new RegExp(`per ${unit}\\?$`, "u").test(question.stem)) {
        fail(`${qlId}/${seed}: source-value prompt omits terminal unit: ${question.stem}`);
      }
      if (!new RegExp(`per ${unit}`, "u").test(explanation.conclusion)) {
        fail(`${qlId}/${seed}: source-value conclusion omits unit: ${explanation.conclusion}`);
      }
    }

    if (/(?:leaves|beans) costs\b/iu.test(explanation.conclusion)) {
      pluralVerbMismatchCount += 1;
      fail(`${qlId}/${seed}: plural material uses singular cost verb: ${explanation.conclusion}`);
    }

    if (!/^[A-Z]/u.test(explanation.conclusion)) {
      conclusionSentenceCaseMismatchCount += 1;
      fail(`${qlId}/${seed}: conclusion does not start with a capital letter: ${explanation.conclusion}`);
    }

    if (/\btwo stage\b/iu.test(explanation.commonTrap)) {
      commonTrapHyphenationMismatchCount += 1;
      fail(`${qlId}/${seed}: two-stage wording is not hyphenated: ${explanation.commonTrap}`);
    }
  }
}

console.log(JSON.stringify({
  status: "PASS_CP001_PERMANENT_SIMPLE_TEACHER_EXPLANATION_AUDIT",
  permanentQlCount: MAL_CP001_PERMANENT_QL_IDS.length,
  generatedQuestionCount,
  fourTierLayoutCount,
  numberedStepCount,
  namedAnswerContractCount,
  sourceValueUnitContractCount,
  simpleVocabularyViolationCount,
  forbiddenPatternMatchCount,
  pluralVerbMismatchCount,
  conclusionSentenceCaseMismatchCount,
  commonTrapCasingMismatchCount,
  commonTrapHyphenationMismatchCount,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
}, null, 2));
