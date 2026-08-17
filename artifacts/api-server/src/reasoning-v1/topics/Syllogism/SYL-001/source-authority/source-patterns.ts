import type { SourcePatternAuthority } from "../runtime/types";

export const SYL_SOURCE_PATTERNS: readonly SourcePatternAuthority[] = Object.freeze([
  {
    sourcePatternId: "SYL-SRC-SSC-CORE-001",
    examProfile: "SSC",
    forms: ["ALL", "NO", "SOME", "SOME_NOT"],
    tasks: ["definite conclusion", "multiple conclusions", "complementary pair"],
    status: "VERIFIED",
    evidenceUrls: [
      "https://sathee.iitk.ac.in/sathee-ssc/student-corner/preparation-guide/reasoning/syllogisms/",
      "https://testbook.com/questions/rpf-constable-syllogism-questions--65fbd8a585131d8702d53438",
    ],
    note: "Classical A/E/I/O syllogism with definite-conclusion and complementary-pair questions.",
  },
  {
    sourcePatternId: "SYL-SRC-BANK-CORE-001",
    examProfile: "BANKING",
    forms: ["ALL", "NO", "SOME", "SOME_NOT"],
    tasks: ["four/five-option combination", "possibility", "either-or"],
    status: "VERIFIED",
    evidenceUrls: [
      "https://testbook.com/questions/rbi-assistant-syllogism-questions--64f9e59d5a90c6547313f6cc",
      "https://testbook.com/questions/rbi-grade-b-syllogism-questions--66335a86dde389094bd3215b",
    ],
    note: "Banking combination formats and satisfiability-based possibility questions.",
  },
  {
    sourcePatternId: "SYL-SRC-BANK-ONLY-001",
    examProfile: "BANKING",
    forms: ["ONLY", "ARE_ONLY", "IDENTITY"],
    tasks: ["directional only", "identity distinction", "possibility"],
    status: "VERIFIED",
    evidenceUrls: [
      "https://sathee.iitk.ac.in/sathee-railway-exams/student-corner/quick-revision/reasoning/reasoning-syllogism-master/",
      "https://www.practicemock.com/blog/download-pdf-syllogism-only-few-concepts-questions/",
    ],
    note: "Only A are B is normalised as all B are A; identity requires explicit bidirectionality.",
  },
  {
    sourcePatternId: "SYL-SRC-BANK-FEW-001",
    examProfile: "BANKING",
    forms: ["A_FEW", "ONLY_A_FEW", "NOT_ALL", "SOME_NOT"],
    tasks: ["only-a-few definite consequence", "only-a-few possibility", "not-all"],
    status: "VERIFIED",
    evidenceUrls: [
      "https://www.practicemock.com/blog/download-pdf-syllogism-only-few-concepts-questions/",
      "https://testbook.com/questions/nabard-grade-a-syllogism-questions--64f72cc913eb150f1ba6e309",
    ],
    note: "Only a few creates both overlap and subject-outside-predicate witnesses. Plain FEW remains excluded.",
  },
  {
    sourcePatternId: "SYL-SRC-MULTILINGUAL-MIXED-001",
    examProfile: "CROSS_EXAM",
    forms: ["ALL", "NO", "SOME", "SOME_NOT", "ONLY", "ONLY_A_FEW"],
    tasks: ["mixed definite conclusion", "mixed combination", "multilingual review"],
    status: "VERIFIED",
    evidenceUrls: [
      "https://testbook.com/question-answer/read-the-given-statements-and-conclusions-carefull--62f23d72bd298380e5128371",
      "https://testbook.com/question-answer/direction-in-the-question-below-are-given-two-sta--5fa67b5f3185ec4c7e0aaad3",
    ],
    note: "Cross-exam mixed forms adapted for English, Hindi and Punjabi delivery; this authority does not claim Punjab-PYQ provenance.",
  },
  {
    sourcePatternId: "SYL-SRC-CROSS-ADV-001",
    examProfile: "CROSS_EXAM",
    forms: ["ALL", "NO", "SOME", "SOME_NOT", "ONLY", "ARE_ONLY", "ONLY_A_FEW", "IDENTITY"],
    tasks: ["three conclusions", "advanced mixed modal classification"],
    status: "VERIFIED",
    evidenceUrls: [
      "https://www.afterboards.in/past-year-questions/jipmat/logical-reasoning/syllogism",
      "https://testbook.com/question-answer/two-statements-are-given-followed-by-four-conclus--623194da71c7322dde1494d2",
    ],
    note: "Advanced bounded combinations with no more than five terms or five premises.",
  },
]);
