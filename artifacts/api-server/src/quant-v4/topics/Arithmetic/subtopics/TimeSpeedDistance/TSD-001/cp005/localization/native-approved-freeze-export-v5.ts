import {
  TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q,
  TSD_CP005_HI_PA_FREEZE_ID,
  TSD_CP005_HI_PA_FREEZE_STATUS,
  TSD_CP005_HI_PA_PRODUCT_OWNER_APPROVAL_DATE,
} from "./native-approved-freeze-v5";

const exportRows = TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q.map((row, index) => ({
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
  nativeFreezeStatus: row.presentation.lifecycle.nativeReviewStatus,
  multilingualFreezeStatus: row.presentation.lifecycle.multilingualFreezeStatus,
  productOwnerApprovalRecorded: row.presentation.lifecycle.productOwnerApprovalRecorded,
  freezeId: TSD_CP005_HI_PA_FREEZE_ID,
  freezeStatus: TSD_CP005_HI_PA_FREEZE_STATUS,
  productOwnerApprovalDate: TSD_CP005_HI_PA_PRODUCT_OWNER_APPROVAL_DATE,
}));

process.stdout.write(`${JSON.stringify(exportRows, null, 2)}\n`);
