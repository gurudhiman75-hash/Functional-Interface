import { generateMenCp009ApprovedEnglishView } from "../approved/english";
import { generateMenCp009QuestionV2 } from "../coverage-v2/runtime";
import { buildMenCp009StudentViewV4Final } from "../coverage-v2/student-view-v4-final";
import { generateMenCp009NativeDraftView } from "./runtime";
import {
  simplifyMenCp009NativeStemV2,
  translateMenCp009DisplayV2,
  translateMenCp009TeachingExplanationV2,
  type MenCp009NativeV2Language,
} from "./editorial-v2";
import { cleanMenCp009NativeTeachingLineV2 } from "./teaching-cleanup-v2";
import { applyMenCp009NativeWordGuardV2 } from "./native-word-guard-v2";
import { naturalizeMenCp009NativeTeachingV3 } from "./post-teaching-naturalizer-v3";
import {
  polishMenCp009NativeTeachingV4,
  buildMenCp009NativeFinalLineV4,
} from "./final-polish-v4";
import { naturalizeMenCp009NativeStemV3 } from "./stem-naturalizer-v3";
import { normalizeMenCp009PunjabiSurfaceOrthography } from "./punjabi-surface-orthography-v1";
import {
  MEN_CP_009_MULTILINGUAL_TEACHING_V2_AUTHORITY,
  type MenCp009NativeTeachingV2View,
} from "./types-v2";

function normalizeNativeSurfaceOrthography(
  value: string,
  language: MenCp009NativeV2Language,
) {
  return language === "pa"
    ? normalizeMenCp009PunjabiSurfaceOrthography(value)
    : value;
}

export function generateMenCp009NativeTeachingV2(
  qlId: string,
  seed: string,
  language: MenCp009NativeV2Language,
): MenCp009NativeTeachingV2View {
  if (language !== "hi" && language !== "pa") {
    throw new Error(`Unsupported MEN-CP-009 V2 native language: ${String(language)}`);
  }

  const approved = generateMenCp009ApprovedEnglishView(qlId, seed);
  if (!approved.approvalValidation.valid) {
    throw new Error(`MEN-CP-009 approved English validation failed for ${qlId} ${seed}.`);
  }

  const raw = generateMenCp009QuestionV2(qlId, seed);
  const english = buildMenCp009StudentViewV4Final(raw);
  const nativeV1 = generateMenCp009NativeDraftView(qlId, seed, language);

  if (
    english.permanentQlId !== approved.permanentQlId ||
    english.correctIndex !== approved.correctIndex ||
    english.options.length !== approved.options.length
  ) {
    throw new Error(`MEN-CP-009 V4 candidate changed mathematical ownership for ${qlId} ${seed}.`);
  }

  const options = english.options.map((option) => ({
    label: option.label,
    display: normalizeNativeSurfaceOrthography(
      translateMenCp009DisplayV2(option.display, language),
      language,
    ),
    isCorrect: option.isCorrect,
  }));
  const answer = normalizeNativeSurfaceOrthography(
    translateMenCp009DisplayV2(english.answer, language),
    language,
  );
  const stem = normalizeNativeSurfaceOrthography(
    naturalizeMenCp009NativeStemV3(
      simplifyMenCp009NativeStemV2(nativeV1.stem, language),
      language,
    ),
    language,
  );
  const explanationLines = translateMenCp009TeachingExplanationV2(
    english.explanationLines,
    language,
  ).map((line) =>
    normalizeNativeSurfaceOrthography(
      polishMenCp009NativeTeachingV4(
        naturalizeMenCp009NativeTeachingV3(
          applyMenCp009NativeWordGuardV2(
            cleanMenCp009NativeTeachingLineV2(line, language),
            language,
          ),
          language,
        ),
        language,
      ),
      language,
    ),
  );
  explanationLines[explanationLines.length - 1] = normalizeNativeSurfaceOrthography(
    buildMenCp009NativeFinalLineV4(
      english.familyId,
      answer,
      language,
    ),
    language,
  );

  const parity = {
    valid:
      english.correctIndex === options.findIndex((option) => option.isCorrect) &&
      english.options.every((option, index) => option.isCorrect === options[index]!.isCorrect) &&
      english.options.length === options.length,
    correctIndexParity: english.correctIndex === options.findIndex((option) => option.isCorrect),
    correctOptionParity: english.options.every(
      (option, index) => option.isCorrect === options[index]!.isCorrect,
    ),
    optionCountParity: english.options.length === options.length,
  };

  if (!parity.valid) {
    throw new Error(`MEN-CP-009 V2 native parity failed for ${qlId} ${seed} ${language}.`);
  }

  return {
    authority: MEN_CP_009_MULTILINGUAL_TEACHING_V2_AUTHORITY,
    sourceMathReleaseId: "MEN-CP009-EN-V3-APPROVED",
    sourceLearnerCandidateAuthority: english.authority,
    permanentQlId: english.permanentQlId,
    familyId: english.familyId,
    solveMode: english.solveMode,
    seed: english.seed,
    difficulty: english.difficulty,
    target: english.target,
    language,
    stem,
    options,
    correctIndex: english.correctIndex,
    answer,
    explanationLines,
    showDiagram: false,
    sourceValidationPassed: english.sourceValidationPassed,
    sourceVerificationPassed: english.sourceVerificationPassed,
    parity,
    reviewStatus: "PENDING_EDITORIAL_REVIEW_V2",
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
