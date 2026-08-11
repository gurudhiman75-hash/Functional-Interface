import { generateMenCp009ApprovedEnglishView } from "../approved/english";
import {
  translateMenCp009Display,
  translateMenCp009Explanation,
  translateMenCp009Stem,
} from "./editorial";
import {
  MEN_CP_009_MULTILINGUAL_DRAFT_AUTHORITY,
  type MenCp009NativeDraftView,
  type MenCp009NativeLanguage,
} from "./types";

function mathKey(value: string) {
  return value
    .replace(/\b(?:times|litres)\b/gi, "")
    .replace(/(?:गुना|लीटर|ਗੁਣਾ|ਲੀਟਰ)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateMenCp009NativeDraftView(
  qlId: string,
  seed: string,
  language: MenCp009NativeLanguage,
): MenCp009NativeDraftView {
  if (language !== "hi" && language !== "pa") {
    throw new Error(`Unsupported MEN-CP-009 native language: ${String(language)}`);
  }

  const source = generateMenCp009ApprovedEnglishView(qlId, seed);
  if (!source.approvalValidation.valid) {
    throw new Error(`MEN-CP-009 English approval validation failed for ${qlId} ${seed}.`);
  }

  const stem = translateMenCp009Stem(source, language);
  const options = source.options.map((option) => ({
    label: option.label,
    display: translateMenCp009Display(option.display, language),
    isCorrect: option.isCorrect,
  }));
  const answer = translateMenCp009Display(source.answer, language);
  const explanationLines = translateMenCp009Explanation(source, language);

  const optionMathParity =
    options.length === source.options.length &&
    options.every(
      (option, index) =>
        option.label === source.options[index]!.label &&
        mathKey(option.display) === mathKey(source.options[index]!.display),
    );
  const answerMathParity = mathKey(answer) === mathKey(source.answer);
  const correctIndexParity = source.correctIndex >= 0 && source.correctIndex === options.findIndex((option) => option.isCorrect);
  const correctOptionParity = options.every(
    (option, index) => option.isCorrect === source.options[index]!.isCorrect,
  );
  const parity = {
    valid: optionMathParity && answerMathParity && correctIndexParity && correctOptionParity,
    optionMathParity,
    answerMathParity,
    correctIndexParity,
    correctOptionParity,
  };

  if (!parity.valid) {
    throw new Error(`MEN-CP-009 native parity failed for ${qlId} ${seed} ${language}.`);
  }

  return {
    authority: MEN_CP_009_MULTILINGUAL_DRAFT_AUTHORITY,
    sourceEnglishReleaseId: source.releaseId,
    sourceEnglishAuthority: source.authority,
    permanentQlId: source.permanentQlId,
    familyId: source.familyId,
    solveMode: source.solveMode,
    seed: source.seed,
    difficulty: source.difficulty,
    target: source.target,
    language,
    stem,
    options,
    correctIndex: source.correctIndex,
    answer,
    explanationLines,
    showDiagram: false,
    sourceValidationPassed: source.sourceValidationPassed,
    sourceVerificationPassed: source.sourceVerificationPassed,
    parity,
    reviewStatus: "PENDING_NATIVE_EDITORIAL",
    humanReviewStatus: "PENDING_HUMAN_REVIEW",
    active: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    testEligible: false,
    publiclyPublishable: false,
  };
}
