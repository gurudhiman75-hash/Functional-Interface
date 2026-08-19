import {
  TSD_CP005_NATIVE_EDITORIAL_REVIEW_V5,
  TSD_CP005_NATIVE_EDITORIAL_V5_STATUS,
} from "./native-review-editorial-v5";

const exportRows = TSD_CP005_NATIVE_EDITORIAL_REVIEW_V5.map((row, index) => ({
  questionNo: Math.floor(index / 2) + 1,
  language: row.presentation.language,
  permanentQlId: row.source.permanentQlId,
  authorityKey: row.source.authorityKey,
  solveMode: row.source.solveMode,
  difficulty: row.source.difficulty,
  objectContextId: row.source.objectContextId,
  objectFamily: row.source.objectFamily,
  endpointFamily: row.source.endpointFamily,
  stem: row.presentation.stem,
  options: row.presentation.options,
  correctOption: row.presentation.correctIndex + 1,
  answer: row.presentation.answerText,
  explanation: row.presentation.explanation,
  nativeReviewStatus: TSD_CP005_NATIVE_EDITORIAL_V5_STATUS,
  multilingualFreezeStatus: row.presentation.lifecycle.multilingualFreezeStatus,
}));

process.stdout.write(`${JSON.stringify(exportRows, null, 2)}\n`);
