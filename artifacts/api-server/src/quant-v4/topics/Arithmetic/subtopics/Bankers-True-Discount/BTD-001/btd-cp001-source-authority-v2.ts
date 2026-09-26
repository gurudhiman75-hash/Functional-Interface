import { BTD_001_SOURCE_BOUNDARY } from "./btd-cp001-source-bound-foundation-v1";

export const BTD_001_SOURCE_AUTHORITY_V2 = Object.freeze({
  ...BTD_001_SOURCE_BOUNDARY,
  authorityVersion: "BTD-001-CP001-SOURCE-AUTHORITY-v2" as const,
  officialPaperProvenanceRecovered: true as const,
  officialExamEvidence: Object.freeze([
    Object.freeze({
      authorityId: "OFFICIAL-GPSC-GOA-JSO-BATCH8-2026-Q27" as const,
      authorityClass: "OFFICIAL_GOVERNMENT_EXAM_QUESTION_PAPER" as const,
      publisher: "Goa Public Service Commission" as const,
      exam: "Prescreening test of Junior Scale Officer of Goa Civil Service Batch 8" as const,
      examCode: "GPSC092025018" as const,
      examDate: "2026-06-14" as const,
      exportedDate: "2026-06-15" as const,
      questionNumber: 27 as const,
      sourceUrl: "https://gpsc.goa.gov.in/wp-content/uploads/2026/06/QP_GPSC092025018.pdf" as const,
      semantic: "BD:TD ratio plus a numerical relation between annual rate and bill term; solve annual rate" as const,
      observedRatio: "6:5" as const,
      observedRelation: "annual interest rate is numerically 5 times the number of years for which the bill is due" as const,
      observedCorrectAnswer: "10%" as const,
    }),
  ] as const),
  provenanceNotes: Object.freeze([
    "The earlier third-party evidence remains useful for breadth discovery but no longer carries the sole provenance burden.",
    "Official GPSC evidence establishes that Banker's Discount / True Discount is an active government-exam arithmetic family and supplies a coupled ratio-rate-time inverse not represented by the original eight prototypes.",
    "Official source recovery does not itself allocate a permanent QL or authorize learner delivery.",
  ] as const),
  permanentQlAllocationAuthorized: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});
