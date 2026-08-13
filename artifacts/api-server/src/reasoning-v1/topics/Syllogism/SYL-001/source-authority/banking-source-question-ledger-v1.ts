export type SylBankingSourceClassV1 =
  | "INDEPENDENT_PYP_ARCHIVE"
  | "MEMORY_BASED_TRANSCRIPTION";

export type SylBankingEvidenceTagV1 =
  | "ORDINARY_POSSIBILITY"
  | "CAN_NEVER_BE"
  | "EITHER_OR"
  | "ONLY_A_FEW"
  | "ONLY"
  | "MULTI_CONCLUSION_ADVANCED"
  | "REVERSE_SELECTION"
  | "CODED_SYLLOGISM";

export interface SylBankingSourceQuestionEvidenceV1 {
  evidenceId: string;
  examSeries:
    | "RBI_GRADE_B"
    | "SBI_CLERK"
    | "SBI_PO"
    | "IBPS_PO"
    | "IBPS_CLERK"
    | "IBPS_RRB_PO"
    | "IBPS_RRB_ASSISTANT"
    | "BANK_OF_INDIA_PO";
  paperDate: string;
  shift: string;
  sourceClass: SylBankingSourceClassV1;
  sourceUrl: string;
  tags: readonly SylBankingEvidenceTagV1[];
  observedShape: string;
}

export const SYL_BANKING_SOURCE_QUESTION_LEDGER_V1: readonly SylBankingSourceQuestionEvidenceV1[] = Object.freeze([
  {
    evidenceId: "BANK-PYQ-RBI-2023-07-09-S2-REV-01",
    examSeries: "RBI_GRADE_B",
    paperDate: "2023-07-09",
    shift: "Shift 2",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-below-two-conclusions-are-given-followed-by-five",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW", "REVERSE_SELECTION"],
    observedShape: "reverse statement selection with a possibility conclusion and only-a-few premises",
  },
  {
    evidenceId: "BANK-PYQ-RBI-2023-07-09-S2-REV-02",
    examSeries: "RBI_GRADE_B",
    paperDate: "2023-07-09",
    shift: "Shift 2",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-two-conclsuions-are-given-followed-by",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW", "REVERSE_SELECTION"],
    observedShape: "reverse statement selection combining definite and possibility conclusions",
  },
  {
    evidenceId: "BANK-PYQ-RBI-2022-05-28-S1-01",
    examSeries: "RBI_GRADE_B",
    paperDate: "2022-05-28",
    shift: "Shift 1",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-questions-given-below-four-statements-are-given-followed-by",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW", "MULTI_CONCLUSION_ADVANCED"],
    observedShape: "four statements with multiple conclusions including a possibility proposition",
  },
  {
    evidenceId: "BANK-PYQ-RBI-2022-05-28-S1-02",
    examSeries: "RBI_GRADE_B",
    paperDate: "2022-05-28",
    shift: "Shift 1",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-questions-given-below-four-statements-are-given-followed-by-1784821-445196",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW", "ONLY", "MULTI_CONCLUSION_ADVANCED"],
    observedShape: "four-statement advanced set using only-a-few, only and a possibility conclusion",
  },
  {
    evidenceId: "BANK-PYQ-RBI-2024-09-08-S2-01",
    examSeries: "RBI_GRADE_B",
    paperDate: "2024-09-08",
    shift: "Shift 2",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-four-statements-are-given-followed-by-1784821-383780",
    tags: ["ORDINARY_POSSIBILITY", "CAN_NEVER_BE", "ONLY_A_FEW", "MULTI_CONCLUSION_ADVANCED"],
    observedShape: "four-conclusion set mixing possibility and can-never language",
  },
  {
    evidenceId: "BANK-PYQ-SBI-CLERK-2025-02-22-S4-01",
    examSeries: "SBI_CLERK",
    paperDate: "2025-02-22",
    shift: "Slot 4",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-a-set-of-statements-is-given-followed-by",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "two-conclusion five-option shell with only-a-few and a possibility conclusion",
  },
  {
    evidenceId: "BANK-PYQ-SBI-CLERK-2025-02-22-S4-02",
    examSeries: "SBI_CLERK",
    paperDate: "2025-02-22",
    shift: "Slot 4",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-a-set-of-statements-are-given-followed-by",
    tags: ["CAN_NEVER_BE", "ONLY_A_FEW"],
    observedShape: "two can-never conclusions inside a normal five-option conclusion shell",
  },
  {
    evidenceId: "BANK-PYQ-SBI-CLERK-2025-02-27-S3-01",
    examSeries: "SBI_CLERK",
    paperDate: "2025-02-27",
    shift: "Slot 3",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-a-set-of-statements-is-given-followed-by-2482-215154",
    tags: ["CAN_NEVER_BE", "ONLY_A_FEW"],
    observedShape: "can-never conclusion paired with an ordinary existential conclusion",
  },
  {
    evidenceId: "BANK-PYQ-SBI-CLERK-2025-09-20-S2-01",
    examSeries: "SBI_CLERK",
    paperDate: "2025-09-20",
    shift: "Shift 2",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/direction-in-the-question-below-are-given-two-sta--5fa67b5f3185ec4c7e0aaad3",
    tags: ["CAN_NEVER_BE", "ONLY_A_FEW"],
    observedShape: "can-never conclusion paired with a definite relation in a five-option shell",
  },
  {
    evidenceId: "BANK-PYQ-SBI-CLERK-2024-02-25-MAINS-01",
    examSeries: "SBI_CLERK",
    paperDate: "2024-02-25",
    shift: "Mains Shift 1",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/statementss3-t2-h5-b3-j6conclusio--637dbb521797bfdbf16d4d99",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW", "MULTI_CONCLUSION_ADVANCED", "CODED_SYLLOGISM"],
    observedShape: "coded syllogism with two possibility conclusions in a three-conclusion set",
  },
  {
    evidenceId: "BANK-PYQ-SBI-PO-2023-11-06-S2-01",
    examSeries: "SBI_PO",
    paperDate: "2023-11-06",
    shift: "Shift 2",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/direction-in-the-question-below-are-given-three-s--6661ab6d2c33074b1b4b0f48",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "possibility conclusion combined with a definite conclusion under only-a-few premises",
  },
  {
    evidenceId: "BANK-PYQ-SBI-PO-2022-12-17-S2-01",
    examSeries: "SBI_PO",
    paperDate: "2022-12-17",
    shift: "Shift 2",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/direction-in-the-question-below-are-given-three-s--5f5b6c4aa5187ba220e666a0",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "ordinary possibility tested against a chain that makes the proposed relation impossible",
  },
  {
    evidenceId: "BANK-PYQ-SBI-PO-2021-11-21-S3-01",
    examSeries: "SBI_PO",
    paperDate: "2021-11-21",
    shift: "Shift 3",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/directionin-the-question-below-are-given-th--60db101b78358753ac89efd3",
    tags: ["CAN_NEVER_BE", "ONLY_A_FEW"],
    observedShape: "both all-can-never and some-can-never conclusions in the same two-conclusion shell",
  },
  {
    evidenceId: "BANK-PYQ-SBI-PO-2021-01-29-MAINS-01",
    examSeries: "SBI_PO",
    paperDate: "2021-01-29",
    shift: "Mains",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/in-the-following-question-some-conclusions-are-gi--6013e8a527532f69f239e1c3",
    tags: ["CAN_NEVER_BE", "ONLY_A_FEW", "REVERSE_SELECTION"],
    observedShape: "reverse statement selection requiring a can-never conclusion to be definitely true",
  },
  {
    evidenceId: "BANK-PYQ-IBPS-PO-2023-09-23-S2-01",
    examSeries: "IBPS_PO",
    paperDate: "2023-09-23",
    shift: "Shift 2",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/directionsin-the-question-below-are-given-s--6447a3a42c4c7d7c16af98a6",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW", "MULTI_CONCLUSION_ADVANCED"],
    observedShape: "three conclusions mixing possibility and definite consequences",
  },
  {
    evidenceId: "BANK-PYQ-IBPS-CLERK-2024-08-24-S2-01",
    examSeries: "IBPS_CLERK",
    paperDate: "2024-08-24",
    shift: "Shift 2",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-287411",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "possibility conclusion paired with a definite consequence in a five-option shell",
  },
  {
    evidenceId: "BANK-PYQ-IBPS-CLERK-2024-08-24-S4-01",
    examSeries: "IBPS_CLERK",
    paperDate: "2024-08-24",
    shift: "Shift 4",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-335455",
    tags: ["ORDINARY_POSSIBILITY", "CAN_NEVER_BE", "ONLY_A_FEW"],
    observedShape: "possibility and can-never conclusions together in the ordinary two-conclusion shell",
  },
  {
    evidenceId: "BANK-PYQ-IBPS-CLERK-2024-08-25-S2-01",
    examSeries: "IBPS_CLERK",
    paperDate: "2024-08-25",
    shift: "Shift 2",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-383780",
    tags: ["EITHER_OR", "ONLY_A_FEW"],
    observedShape: "genuine complementary some-versus-no pair resolved through the either-or option",
  },
  {
    evidenceId: "BANK-PYQ-IBPS-CLERK-2024-08-24-S2-02",
    examSeries: "IBPS_CLERK",
    paperDate: "2024-08-24",
    shift: "Shift 2",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-2482-287515",
    tags: ["EITHER_OR", "ONLY_A_FEW"],
    observedShape: "genuine complementary some-versus-no pair with either-or as the correct semantic answer",
  },
  {
    evidenceId: "BANK-PYQ-IBPS-CLERK-2024-08-31-S1-01",
    examSeries: "IBPS_CLERK",
    paperDate: "2024-08-31",
    shift: "Shift 1",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-three-statements-are-given-followed-two-2482-464560",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "ordinary possibility paired with an entailed some-not consequence",
  },
  {
    evidenceId: "BANK-PYQ-RRB-PO-2024-08-03-S1-01",
    examSeries: "IBPS_RRB_PO",
    paperDate: "2024-08-03",
    shift: "Shift 1",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-1784821-478304",
    tags: ["CAN_NEVER_BE", "ONLY_A_FEW"],
    observedShape: "can-never conclusion derived through an only-a-few witness and a disjointness constraint",
  },
  {
    evidenceId: "BANK-PYQ-RRB-PO-2024-08-03-S4-01",
    examSeries: "IBPS_RRB_PO",
    paperDate: "2024-08-03",
    shift: "Shift 4",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-1784821-507600",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "possibility conclusion over a three-statement only-a-few chain",
  },
  {
    evidenceId: "BANK-PYQ-RRB-PO-2024-08-04-S2-01",
    examSeries: "IBPS_RRB_PO",
    paperDate: "2024-08-04",
    shift: "Shift 2",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-three-statements-are-given-and-two-1784821-526458",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "possibility conclusion over mixed only-a-few and no relations",
  },
  {
    evidenceId: "BANK-PYQ-RRB-PO-2024-08-04-S3-01",
    examSeries: "IBPS_RRB_PO",
    paperDate: "2024-08-04",
    shift: "Shift 3",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-given-below-two-statements-are-given-followed-by-1784821-537641",
    tags: ["ORDINARY_POSSIBILITY", "CAN_NEVER_BE", "ONLY_A_FEW"],
    observedShape: "possibility and can-never propositions evaluated side by side",
  },
  {
    evidenceId: "BANK-PYQ-RRB-PO-2022-08-20-S2-01",
    examSeries: "IBPS_RRB_PO",
    paperDate: "2022-08-20",
    shift: "Shift 2",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/in-the-question-below-there-are-two-statements-fol--605d54626cc210a205cd8080",
    tags: ["ORDINARY_POSSIBILITY", "CAN_NEVER_BE", "ONLY_A_FEW"],
    observedShape: "some-can-never and ordinary possibility conclusions in the same shell",
  },
  {
    evidenceId: "BANK-PYQ-RRB-ASST-2024-08-10-S2-01",
    examSeries: "IBPS_RRB_ASSISTANT",
    paperDate: "2024-08-10",
    shift: "Shift 2",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-question-below-two-statements-are-given-followed-by",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "two-conclusion shell with only-a-few and a universal possibility conclusion",
  },
  {
    evidenceId: "BANK-PYQ-RRB-ASST-2024-08-17-S3-01",
    examSeries: "IBPS_RRB_ASSISTANT",
    paperDate: "2024-08-17",
    shift: "Shift 3",
    sourceClass: "INDEPENDENT_PYP_ARCHIVE",
    sourceUrl: "https://www.oliveboard.in/question-answer/pyq-in-the-following-question-two-statements-are-given-and-two-1784821-602971",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW"],
    observedShape: "tests the distinction between an already-definite relation and a possibility proposition",
  },
  {
    evidenceId: "BANK-PYQ-BOI-PO-2023-03-19-S1-01",
    examSeries: "BANK_OF_INDIA_PO",
    paperDate: "2023-03-19",
    shift: "Shift 1",
    sourceClass: "MEMORY_BASED_TRANSCRIPTION",
    sourceUrl: "https://testbook.com/question-answer/statement-a-b-c-d-ei-e-bii-e-a--637b4afe16aecd8cf2c4bfae",
    tags: ["ORDINARY_POSSIBILITY", "ONLY_A_FEW", "ONLY", "MULTI_CONCLUSION_ADVANCED", "CODED_SYLLOGISM"],
    observedShape: "coded multi-conclusion syllogism using only, only-a-few and possibility",
  },
]);

const evidenceTagCounts = SYL_BANKING_SOURCE_QUESTION_LEDGER_V1.reduce<Record<SylBankingEvidenceTagV1, number>>(
  (counts, entry) => {
    for (const tag of entry.tags) counts[tag] += 1;
    return counts;
  },
  {
    ORDINARY_POSSIBILITY: 0,
    CAN_NEVER_BE: 0,
    EITHER_OR: 0,
    ONLY_A_FEW: 0,
    ONLY: 0,
    MULTI_CONCLUSION_ADVANCED: 0,
    REVERSE_SELECTION: 0,
    CODED_SYLLOGISM: 0,
  },
);

const sourceClassCounts = SYL_BANKING_SOURCE_QUESTION_LEDGER_V1.reduce<Record<SylBankingSourceClassV1, number>>(
  (counts, entry) => {
    counts[entry.sourceClass] += 1;
    return counts;
  },
  { INDEPENDENT_PYP_ARCHIVE: 0, MEMORY_BASED_TRANSCRIPTION: 0 },
);

export const SYL_BANKING_SOURCE_LEDGER_SUMMARY_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_SOURCE_LEDGER_V1",
  status: "EXPANDED_QUESTION_LEVEL_COVERAGE_NOT_FREQUENCY_CENSUS",
  questionCount: SYL_BANKING_SOURCE_QUESTION_LEDGER_V1.length,
  examSeriesCount: new Set(SYL_BANKING_SOURCE_QUESTION_LEDGER_V1.map((entry) => entry.examSeries)).size,
  years: [...new Set(SYL_BANKING_SOURCE_QUESTION_LEDGER_V1.map((entry) => Number(entry.paperDate.slice(0, 4))))].sort(),
  evidenceTagCounts,
  sourceClassCounts,
  authorityBoundary: [
    "This ledger proves repeated question-level occurrence and task-shape coverage across independently archived PYP pages and memory-based transcriptions.",
    "It is not a systematic census of every syllogism question from every Banking paper and therefore must not be converted directly into production frequency weights.",
  ].join(" "),
  coverageGuards: {
    ordinaryPossibilityRequired: true,
    canNeverBeRequired: true,
    eitherOrRequired: true,
    onlyAFewRequired: true,
    onlyRequired: true,
    multiConclusionAdvancedRequired: true,
  },
  modalSubfamilyWeightFrozen: false,
  productionFrequencyWeightingPermitted: false,
});
