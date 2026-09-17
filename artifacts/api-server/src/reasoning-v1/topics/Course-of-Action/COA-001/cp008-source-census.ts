export type CoaSourceEvidenceLevel =
  | "OFFICIAL_PAPER_REPRODUCTION"
  | "MEMORY_BASED_REPRODUCTION"
  | "PRACTICE_REFERENCE";

export type CoaObservedProfile =
  | "TWO_ACTION_FOUR_WAY"
  | "TWO_ACTION_FIVE_CODE"
  | "THREE_ACTION_COMBINATION"
  | "SINGLE_BEST_ACTION";

export type CoaSourceCensusEntry = Readonly<{
  id: string;
  exam: string;
  examDate: string;
  evidenceLevel: CoaSourceEvidenceLevel;
  observedProfile: CoaObservedProfile;
  eitherOptionPresent: boolean;
  eitherObservedAsCorrect: boolean;
  sourceUrl: string;
  auditNote: string;
}>;

/**
 * CP008 source census.
 *
 * These are public reproductions used to audit presentation shape and learner
 * operation. They are not copied into learner-facing authority and they are not
 * labelled as first-party official PDFs unless the evidence level says so.
 */
export const COA_CP008_SOURCE_CENSUS: readonly CoaSourceCensusEntry[] = Object.freeze([
  {
    id: "COA-SRC-001",
    exam: "SSC CGL 2025 Shift 3",
    examDate: "2025-09-19",
    evidenceLevel: "OFFICIAL_PAPER_REPRODUCTION",
    observedProfile: "TWO_ACTION_FOUR_WAY",
    eitherOptionPresent: false,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/consider-the-following-statement-and-choose-the-op--690b2b4b9b71212a5ba09022",
    auditNote: "Recent SSC reproduction uses two actions with Only I / Only II / Both / Neither.",
  },
  {
    id: "COA-SRC-002",
    exam: "RRB NTPC CBT 2 Level-2",
    examDate: "2022-06-13",
    evidenceLevel: "OFFICIAL_PAPER_REPRODUCTION",
    observedProfile: "TWO_ACTION_FOUR_WAY",
    eitherOptionPresent: false,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/read-the-given-statement-and-courses-of-action-car--62b3ea88da6508c0c6b46b0e",
    auditNote: "Two independently judged courses with four outcome choices.",
  },
  {
    id: "COA-SRC-003",
    exam: "RRB ALP CBT-I 2024 Shift 3",
    examDate: "2024-11-27",
    evidenceLevel: "OFFICIAL_PAPER_REPRODUCTION",
    observedProfile: "TWO_ACTION_FOUR_WAY",
    eitherOptionPresent: false,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/in-this-question-a-statement-is-followed-by-two-c--675994551800e812ea9f2bd9",
    auditNote: "Strict action can be correct when the statement justifies it; four-way paired format observed.",
  },
  {
    id: "COA-SRC-004",
    exam: "Punjab Civil Service 2018 CSAT",
    examDate: "2018",
    evidenceLevel: "OFFICIAL_PAPER_REPRODUCTION",
    observedProfile: "TWO_ACTION_FOUR_WAY",
    eitherOptionPresent: false,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/directions-in-the-question-given-below-is--678680579de47e4f62b08b98",
    auditNote: "Punjab-state target evidence confirms the standard paired four-way form.",
  },
  {
    id: "COA-SRC-005",
    exam: "IBPS PO Mains Memory Based 2021",
    examDate: "2021-02-04",
    evidenceLevel: "MEMORY_BASED_REPRODUCTION",
    observedProfile: "TWO_ACTION_FIVE_CODE",
    eitherOptionPresent: true,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/direction-in-the-question-below-are-given-a-state--5f60d413df10bed46fcdbc91",
    auditNote: "Banking mains memory-based material uses the conventional five-code presentation including Either I or II.",
  },
  {
    id: "COA-SRC-006",
    exam: "RBI Grade B 2019 Memory Based",
    examDate: "2019-11-09",
    evidenceLevel: "MEMORY_BASED_REPRODUCTION",
    observedProfile: "TWO_ACTION_FIVE_CODE",
    eitherOptionPresent: true,
    eitherObservedAsCorrect: true,
    sourceUrl: "https://testbook.com/question-answer/directionsin-the-question-below-are-given-a--5d97b857f60d5d721e0e949e",
    auditNote: "Reproduction marks Either I or II as correct where two alternative resolution routes are mutually exclusive.",
  },
  {
    id: "COA-SRC-007",
    exam: "NHPC JE Civil 2022 Shift 2",
    examDate: "2022-04-04",
    evidenceLevel: "OFFICIAL_PAPER_REPRODUCTION",
    observedProfile: "THREE_ACTION_COMBINATION",
    eitherOptionPresent: false,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/a-statement-is-followed-by-three-courses-of-action--625e16c8a127f46c416a02ae",
    auditNote: "Official-paper reproduction uses three courses and combination-code answers.",
  },
  {
    id: "COA-SRC-008",
    exam: "Telangana Police SI Mains 2016",
    examDate: "2016",
    evidenceLevel: "OFFICIAL_PAPER_REPRODUCTION",
    observedProfile: "THREE_ACTION_COMBINATION",
    eitherOptionPresent: false,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/candidates-who-appeared-for-an-examination-are-agi--60950cb183020cf77f27e9e8",
    auditNote: "Three-course form includes investigation-before-cancellation style reasoning.",
  },
  {
    id: "COA-SRC-009",
    exam: "OPSC OAS Prelims CSAT 2023",
    examDate: "2023-10-15",
    evidenceLevel: "OFFICIAL_PAPER_REPRODUCTION",
    observedProfile: "THREE_ACTION_COMBINATION",
    eitherOptionPresent: false,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/statement-one-aspirant-was-killed-due-to-stamped--6a070b45148548c17073d2b3",
    auditNote: "Recent official-paper reproduction confirms three-course combination remains materially current.",
  },
  {
    id: "COA-SRC-010",
    exam: "CGPSC Civil Service 2020 CSAT",
    examDate: "2020",
    evidenceLevel: "OFFICIAL_PAPER_REPRODUCTION",
    observedProfile: "SINGLE_BEST_ACTION",
    eitherOptionPresent: false,
    eitherObservedAsCorrect: false,
    sourceUrl: "https://testbook.com/question-answer/read-the-situation-and-choose-the-best-course-of-a--6142e301ce2a8ca9ae9acf6d",
    auditNote: "Single-best reaction is situational-judgment / decision-making shaped and should not be merged into core paired Course-of-Action semantics.",
  },
]);

export const COA_CP008_PROFILE_DECISIONS = Object.freeze({
  TWO_ACTION_FOUR_WAY: "SOURCE_SUPPORTED_CORE" as const,
  TWO_ACTION_FIVE_CODE: "SOURCE_SUPPORTED_MEMORY_BASED_WITH_DEDICATED_EITHER_AUTHORITY_ONLY" as const,
  THREE_ACTION_COMBINATION: "SOURCE_SUPPORTED_CORE_VARIANT" as const,
  SINGLE_BEST_ACTION: "EXCLUDE_TO_DECISION_MAKING" as const,
});
