export const QUANT_V4_EXTERNAL_CORPUS_SOURCES_V1 = Object.freeze([
  Object.freeze({
    sourceId: "DISHA_SSC_MATHEMATICS_GUIDE_ENGLISH",
    title: "Disha SSC Mathematics Guide in English",
    sourceKind: "UPLOADED_BOOK_PDF" as const,
    targetExamFamily: ["SSC"] as const,
    trigSection: Object.freeze({
      bookPages: "399-424",
      pdfPagesObserved: "404-421+",
      extractionMode: "INDEXED_TEXT" as const,
      auditStatus: "ACTIVE_CORPUS" as const,
    }),
    sourceContentMayBeCopiedToProduction: false as const,
  }),
  Object.freeze({
    sourceId: "RAKESH_YADAV_MATHS_7300",
    title: "Rakesh Yadav Maths 7300 Book",
    sourceKind: "UPLOADED_BOOK_PDF" as const,
    targetExamFamily: ["SSC", "IBPS", "OTHER_COMPETITIVE"] as const,
    trigSection: Object.freeze({
      indexedChapterPages: "676-713",
      heightDistancePages: "714-727",
      extractionMode: "PAGE_IMAGE_MANUAL_REVIEW_REQUIRED" as const,
      auditStatus: "REGISTERED_PENDING_PAGE_IMAGE_EXTRACTION" as const,
    }),
    sourceContentMayBeCopiedToProduction: false as const,
  }),
]);

export const QUANT_V4_EXTERNAL_CORPUS_SOURCE_POLICY_V1 = Object.freeze({
  uploadedBooksAreAuditEvidenceOnly: true as const,
  copySourceQuestionWordingIntoProduction: false as const,
  abstractArchetypeExtractionAllowed: true as const,
  multiSourceConfirmationPreferredForNewAuthority: true as const,
  scannedSourcesMayRemainRegisteredPendingManualExtraction: true as const,
});
