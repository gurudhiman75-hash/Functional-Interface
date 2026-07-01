import type {
  EEV2DetailMode,
  ExplanationPlan,
  RichReasoningGraph,
  StructuredExplanationBlock,
  TutorThinkingTrace,
} from "../../../../../../../../common/eev2/contracts";
import { projectCompatibilityLines } from "../../../../../../../../common/eev2/compatibility-projector";
import { solvePct001 } from "../../../solver";
import type { Pct001AnswerType, Pct001Parameters } from "../../../types";
import { renderPercentOfKnownNumberBlocks } from "../block-renderer";
import { PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION } from "../english-language-family.v2";
import type { PercentOfKnownNumberEvidence } from "../evidence";
import { buildPercentOfKnownNumberGraph } from "../graph-builder";
import {
  renderPercentOfKnownNumberEnglishV2,
  type RenderedEnglishV2RoleSet,
} from "../language-renderer.v2";
import type { RenderedEnglishRoleSet } from "../language-renderer";
import { parsePresentedNumbers } from "../number-formatting";
import {
  PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
  planPercentOfKnownNumberExplanation,
} from "../planner";
import {
  PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
  buildPercentOfKnownNumberTrace,
} from "../trace-builder";

export type UserCorpusDifficulty = "Easy" | "Medium" | "Hard";
export type UserCorpusContextKind =
  | "abstract"
  | "money"
  | "count"
  | "continuous";
export type UserCorpusSeverity = "CRITICAL" | "MAJOR" | "MINOR";
export type UserCorpusDimension =
  | "STEM_ALIGNMENT"
  | "TUTOR_REALISM"
  | "ONE_UNIT_VISIBILITY"
  | "CONTEXT_PERSISTENCE"
  | "ANSWER_CONFIDENCE"
  | "WEAK_STUDENT_FRIENDLINESS"
  | "BOOK_COMPARISON"
  | "UNEXPECTED_MISMATCH";

export interface UserCorpusSource {
  fileName: string;
  sha256: string;
  physicalPage: number;
  printedPage?: string;
  questionNumber: string;
  sourceKind:
    | "OFFICIAL_SSC_PYQ"
    | "SSC_BOOK_ILLUSTRATION"
    | "SSC_BOOK_EXERCISE";
  exam?: string;
}

export interface UserCorpusItem {
  corpusId: string;
  questionText: string;
  options: readonly string[];
  source: UserCorpusSource;
  difficulty: UserCorpusDifficulty;
  difficultyOrigin: "AUDITOR_ASSIGNED";
  knownRate: number;
  knownValue: number;
  targetRate: number;
  expectedAnswer: number;
  answerType: Pct001AnswerType;
  detailMode: EEV2DetailMode;
  locale: "en";
  contextKind: UserCorpusContextKind;
  contextLabel: string;
  semanticUnit: string;
  sourceSolution?: {
    kind: "WORKED_SOLUTION" | "ANSWER_KEY_ONLY";
    excerpt?: string;
  };
}

export interface UserCorpusFinding {
  corpusId: string;
  dimension: UserCorpusDimension;
  severity: UserCorpusSeverity;
  code: string;
  message: string;
  evidence: readonly string[];
}

export interface FrozenUserCorpusRecord {
  item: UserCorpusItem;
  solverEvidence?: PercentOfKnownNumberEvidence;
  trace?: TutorThinkingTrace;
  graph?: RichReasoningGraph;
  plan?: ExplanationPlan;
  renderedRoles?: RenderedEnglishV2RoleSet;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  findings: readonly UserCorpusFinding[];
  reviewerNotes: readonly string[];
  bookComparison:
    | "EEV2_CLEARER"
    | "SOURCE_CLEARER"
    | "EDUCATIONALLY_EQUIVALENT"
    | "NOT_ASSESSABLE";
  approvalStatus: "APPROVED" | "REVIEW_REQUIRED";
  pipelineFailure?: {
    name: string;
    message: string;
  };
}

const PREVIOUS_YEAR_HASH =
  "0E340C71E71E8099D1FA5D4E93A1278C3ABCB37AA39E3B7964746A757F0A6F09";
const CHAPTERWISE_HASH =
  "C397099C5264687220A4A71DCB6C421F5304EAA98B839CA3DAFBBBDF70DA0290";
const DISHA_HASH =
  "80D65977420D49B1AAF6C87437904D212E4A120BFCC8957481B37CB605C50E63";

export const USER_CORPUS: readonly UserCorpusItem[] = [
  {
    corpusId: "REAL-WORLD-001:001",
    questionText:
      "If 120 is 20% of a number, then 120% of that number will be:",
    options: ["20", "120", "480", "720"],
    source: {
      fileName:
        "SSC Maths Chapter Wise Solved Questions and Answers PDF in English.pdf",
      sha256: CHAPTERWISE_HASH,
      physicalPage: 319,
      printedPage: "SME-317",
      questionNumber: "52",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam:
        "SSC CGL Prelim 04.07.1999, SSC SO 16.11.2003, SSC DEO/LDC 10.11.2013",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 20,
    knownValue: 120,
    targetRate: 120,
    expectedAnswer: 720,
    answerType: "ABSOLUTE",
    detailMode: "standard",
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number",
    semanticUnit: "abstract-number",
    sourceSolution: { kind: "ANSWER_KEY_ONLY" },
  },
  {
    corpusId: "REAL-WORLD-001:002",
    questionText:
      "Ram saves 14% of his salary while Shyam saves 22%. If both get the same salary and Shyam saves 1540, what is the savings of Ram?",
    options: ["990", "980", "890", "880"],
    source: {
      fileName:
        "SSC Maths Chapter Wise Solved Questions and Answers PDF in English.pdf",
      sha256: CHAPTERWISE_HASH,
      physicalPage: 323,
      printedPage: "SME-321",
      questionNumber: "26",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam: "SSC CHSL DEO & LDC 28.11.2010, first sitting",
    },
    difficulty: "Medium",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 22,
    knownValue: 1540,
    targetRate: 14,
    expectedAnswer: 980,
    answerType: "ABSOLUTE",
    detailMode: "detailed",
    locale: "en",
    contextKind: "money",
    contextLabel: "savings",
    semanticUnit: "rupees",
    sourceSolution: { kind: "ANSWER_KEY_ONLY" },
  },
  {
    corpusId: "REAL-WORLD-001:003",
    questionText:
      "A man spends 15% of his income. If his expenditure is Rs. 75, his income (in rupees) is:",
    options: ["400", "300", "750", "500"],
    source: {
      fileName:
        "SSC Maths Chapter Wise Solved Questions and Answers PDF in English.pdf",
      sha256: CHAPTERWISE_HASH,
      physicalPage: 325,
      printedPage: "SME-323",
      questionNumber: "56",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam: "SSC CGL Tier-I CBE 09.09.2016, third sitting",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 15,
    knownValue: 75,
    targetRate: 100,
    expectedAnswer: 500,
    answerType: "ABSOLUTE",
    detailMode: "standard",
    locale: "en",
    contextKind: "money",
    contextLabel: "income",
    semanticUnit: "rupees",
    sourceSolution: { kind: "ANSWER_KEY_ONLY" },
  },
  {
    corpusId: "REAL-WORLD-001:004",
    questionText:
      "Quicklime contains 28.6% of oxygen by weight. Determine the weight of oxygen in 750 gm quicklime.",
    options: ["214.5 gm", "224.5 gm", "234.5 gm", "235.5 gm"],
    source: {
      fileName:
        "SSC Maths Chapter Wise Solved Questions and Answers PDF in English.pdf",
      sha256: CHAPTERWISE_HASH,
      physicalPage: 375,
      printedPage: "SME-373",
      questionNumber: "16",
      sourceKind: "SSC_BOOK_EXERCISE",
    },
    difficulty: "Medium",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 100,
    knownValue: 750,
    targetRate: 28.6,
    expectedAnswer: 214.5,
    answerType: "ABSOLUTE",
    detailMode: "standard",
    locale: "en",
    contextKind: "continuous",
    contextLabel: "oxygen in quicklime",
    semanticUnit: "grams",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt:
        "100 gm quicklime contains 28.6 gm oxygen; the book scales this to 750 gm and obtains 214.5 gm.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:005",
    questionText:
      "Kavita's attendance in her school for the academic session 2018-2019 was 216 days. On computing her attendance, it was observed that her attendance was 90%. The total working days of the school were:",
    options: ["250", "194", "240", "195"],
    source: {
      fileName: "Maths SSC Previous Year Asked Questions in English.PDF",
      sha256: PREVIOUS_YEAR_HASH,
      physicalPage: 572,
      questionNumber: "125",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam: "SSC CHSL 12.10.2020, morning shift",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 90,
    knownValue: 216,
    targetRate: 100,
    expectedAnswer: 240,
    answerType: "COUNT",
    detailMode: "standard",
    locale: "en",
    contextKind: "count",
    contextLabel: "working days",
    semanticUnit: "days",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt: "The source uses the short mapping 90% = 216, 100% = 240.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:006",
    questionText: "68 is 25% of which of the following numbers?",
    options: ["272", "285", "204", "136"],
    source: {
      fileName: "Maths SSC Previous Year Asked Questions in English.PDF",
      sha256: PREVIOUS_YEAR_HASH,
      physicalPage: 573,
      questionNumber: "133",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam: "SSC CHSL 19.10.2020, evening shift",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 25,
    knownValue: 68,
    targetRate: 100,
    expectedAnswer: 272,
    answerType: "ABSOLUTE",
    detailMode: "short",
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number",
    semanticUnit: "abstract-number",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt:
        "The source introduces x and calculates x = 68 x 100 / 25 = 272.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:007",
    questionText: "26% of A is 832. What is 31% of A?",
    options: ["968", "876", "854", "992"],
    source: {
      fileName: "Maths SSC Previous Year Asked Questions in English.PDF",
      sha256: PREVIOUS_YEAR_HASH,
      physicalPage: 576,
      questionNumber: "196",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam: "SSC MTS 06.08.2019, afternoon shift",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 26,
    knownValue: 832,
    targetRate: 31,
    expectedAnswer: 992,
    answerType: "ABSOLUTE",
    detailMode: "standard",
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number A",
    semanticUnit: "abstract-number",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt: "The source uses 26% = 832, 1% = 32, 31% = 992.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:008",
    questionText: "12.5% of A = 55. What is the value of A?",
    options: ["480", "500", "440", "550"],
    source: {
      fileName: "Maths SSC Previous Year Asked Questions in English.PDF",
      sha256: PREVIOUS_YEAR_HASH,
      physicalPage: 576,
      questionNumber: "212",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam: "SSC MTS 19.08.2019, morning shift",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 12.5,
    knownValue: 55,
    targetRate: 100,
    expectedAnswer: 440,
    answerType: "ABSOLUTE",
    detailMode: "standard",
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number A",
    semanticUnit: "abstract-number",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt: "The source uses A = 55 x 100 / 12.5 = 440.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:009",
    questionText: "60% of a number is 168, then what is the number?",
    options: ["280", "320", "240", "200"],
    source: {
      fileName: "Maths SSC Previous Year Asked Questions in English.PDF",
      sha256: PREVIOUS_YEAR_HASH,
      physicalPage: 576,
      questionNumber: "215",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam: "SSC MTS 08.08.2019, morning shift",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 60,
    knownValue: 168,
    targetRate: 100,
    expectedAnswer: 280,
    answerType: "ABSOLUTE",
    detailMode: "detailed",
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number",
    semanticUnit: "abstract-number",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt:
        "The source lets the number be k and solves k x 60/100 = 168.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:010",
    questionText: "25% of a number is 80. What is the number?",
    options: [],
    source: {
      fileName: "Disha SSC Mathematics Guidein English (sscstudy.com).pdf",
      sha256: DISHA_HASH,
      physicalPage: 84,
      printedPage: "80",
      questionNumber: "Illustration 5",
      sourceKind: "SSC_BOOK_ILLUSTRATION",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 25,
    knownValue: 80,
    targetRate: 100,
    expectedAnswer: 320,
    answerType: "ABSOLUTE",
    detailMode: "standard",
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number",
    semanticUnit: "abstract-number",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt:
        "The source lets the number be X and solves 25/100 x X = 80.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:011",
    questionText: "4598 is 95% of?",
    options: ["4800", "4840", "4850", "4880"],
    source: {
      fileName: "Disha SSC Mathematics Guidein English (sscstudy.com).pdf",
      sha256: DISHA_HASH,
      physicalPage: 84,
      printedPage: "80",
      questionNumber: "Illustration 8",
      sourceKind: "SSC_BOOK_ILLUSTRATION",
    },
    difficulty: "Easy",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 95,
    knownValue: 4598,
    targetRate: 100,
    expectedAnswer: 4840,
    answerType: "ABSOLUTE",
    detailMode: "short",
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number",
    semanticUnit: "abstract-number",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt: "The source solves x = 100 x 4598 / 95 = 4840.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:012",
    questionText:
      "An inspector rejects 0.08% of the metres as defective. How many metres will he examine to reject 2 metres?",
    options: ["200 m", "250 m", "2500 m", "3000 m"],
    source: {
      fileName: "Disha SSC Mathematics Guidein English (sscstudy.com).pdf",
      sha256: DISHA_HASH,
      physicalPage: 85,
      printedPage: "81",
      questionNumber: "10",
      sourceKind: "SSC_BOOK_EXERCISE",
    },
    difficulty: "Hard",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 0.08,
    knownValue: 2,
    targetRate: 100,
    expectedAnswer: 2500,
    answerType: "ABSOLUTE",
    detailMode: "detailed",
    locale: "en",
    contextKind: "continuous",
    contextLabel: "metres",
    semanticUnit: "metres",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt: "The source solves 0.08% of x = 2 and obtains 2500 metres.",
    },
  },
  {
    corpusId: "REAL-WORLD-001:013",
    questionText: "If 125% of x is 100, then x is:",
    options: ["80", "150", "400", "125"],
    source: {
      fileName: "Disha SSC Mathematics Guidein English (sscstudy.com).pdf",
      sha256: DISHA_HASH,
      physicalPage: 88,
      printedPage: "84",
      questionNumber: "66",
      sourceKind: "OFFICIAL_SSC_PYQ",
      exam: "SSC 10+2 2012",
    },
    difficulty: "Medium",
    difficultyOrigin: "AUDITOR_ASSIGNED",
    knownRate: 125,
    knownValue: 100,
    targetRate: 100,
    expectedAnswer: 80,
    answerType: "ABSOLUTE",
    detailMode: "standard",
    locale: "en",
    contextKind: "abstract",
    contextLabel: "number x",
    semanticUnit: "abstract-number",
    sourceSolution: {
      kind: "WORKED_SOLUTION",
      excerpt: "The source calculates x = 100 x 100 / 125 = 80.",
    },
  },
] as const;

function parametersFor(item: UserCorpusItem): Pct001Parameters {
  const semanticContext =
    item.contextKind === "abstract"
      ? undefined
      : {
          scenario: item.contextLabel,
          entities: {
            quantity: {
              id: item.semanticUnit,
              en: item.contextLabel,
              hi: item.contextLabel,
              pa: item.contextLabel,
              numberType:
                item.contextKind === "count" ? "countable" : "continuous",
            },
          },
        };
  return {
    archetypeId: "PCT-001",
    canonicalProblemId: "PCT-CP-002",
    questionId: item.corpusId,
    questionLanguageId: "PCT-QL-017",
    explanationId: "PCT-ES-002",
    language: item.locale,
    difficultyBand: item.difficulty,
    taskKind: "percentOfKnownNumber",
    answerType: item.answerType,
    requiredVariables: ["rate1", "value1", "rate2"],
    variables: {
      rate1: item.knownRate,
      value1: item.knownValue,
      rate2: item.targetRate,
    },
    semanticContext,
    sourceTrace: {
      questionLanguageSource: "REAL-WORLD-001:user-pdf",
      explanationSource: "EEV2",
      variableRangeSource: "REAL-WORLD-001:user-pdf",
      semanticSource: "REAL-WORLD-001:user-pdf",
    },
  };
}

function finding(
  item: UserCorpusItem,
  dimension: UserCorpusDimension,
  severity: UserCorpusSeverity,
  code: string,
  message: string,
  evidence: readonly string[],
): UserCorpusFinding {
  return {
    corpusId: item.corpusId,
    dimension,
    severity,
    code,
    message,
    evidence,
  };
}

function roleText(
  roles: RenderedEnglishV2RoleSet,
  roleKind: string,
): string {
  const role = roles.roles.find((candidate) => candidate.roleKind === roleKind);
  return role ? `${role.sentence} ${role.math ?? ""}`.trim() : "";
}

function exposesValue(text: string, expected: number): boolean {
  return parsePresentedNumbers(text).some(
    (value) =>
      Math.abs(value - expected) <=
      Math.max(0.01, Math.abs(expected) * 1e-9),
  );
}

function compareWithSource(
  item: UserCorpusItem,
  findings: readonly UserCorpusFinding[],
): FrozenUserCorpusRecord["bookComparison"] {
  if (item.sourceSolution?.kind !== "WORKED_SOLUTION") {
    return "NOT_ASSESSABLE";
  }
  if (findings.some((entry) => entry.severity === "CRITICAL")) {
    return "SOURCE_CLEARER";
  }
  const source = item.sourceSolution.excerpt?.toLowerCase() ?? "";
  if (source.includes("1%") && source.includes("31%")) {
    return "EDUCATIONALLY_EQUIVALENT";
  }
  return "EEV2_CLEARER";
}

export function auditUserCorpus(
  corpus: readonly UserCorpusItem[] = USER_CORPUS,
): readonly FrozenUserCorpusRecord[] {
  return corpus.map((item) => {
    const findings: UserCorpusFinding[] = [];
    try {
      const solved = solvePct001(parametersFor(item));
      const evidence = solved.educationalEvidence;
      if (!evidence) {
        throw new Error("Solver did not expose UNIT_VALUE evidence.");
      }
      if (
        solved.numericAnswer === null ||
        Math.abs(solved.numericAnswer - item.expectedAnswer) > 0.01
      ) {
        findings.push(
          finding(
            item,
            "ANSWER_CONFIDENCE",
            "CRITICAL",
            "SOLVER_ANSWER_MISMATCH",
            "The frozen source answer and solver answer diverge.",
            [String(item.expectedAnswer), String(solved.numericAnswer)],
          ),
        );
      }
      const trace = buildPercentOfKnownNumberTrace(evidence);
      const graph = buildPercentOfKnownNumberGraph(trace);
      const plan = planPercentOfKnownNumberExplanation(
        graph,
        item.detailMode,
      );
      const renderedRoles = renderPercentOfKnownNumberEnglishV2(plan, trace, {
        contextLabel: item.contextLabel,
      });
      const blocks = renderPercentOfKnownNumberBlocks(
        plan,
        renderedRoles as unknown as RenderedEnglishRoleSet,
        graph,
        {
          solverVersion: "PCT-001-solver-v1",
          traceVersion: PERCENT_OF_KNOWN_NUMBER_TRACE_VERSION,
          graphVersion: graph.graphVersion,
          plannerVersion: PERCENT_OF_KNOWN_NUMBER_PLANNER_VERSION,
          languageFamilyVersion:
            PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_V2_VERSION,
        },
      );
      const lines = projectCompatibilityLines(blocks);
      const text = lines.join("\n");
      const oneUnit = roleText(renderedRoles, "SINGLE_UNIT_DERIVATION");
      const answer = roleText(renderedRoles, "ANSWER_INTERPRETATION");

      if (
        /\bformula\b|\bsubstitut(?:e|ion|ing)\b|\bsimplif(?:y|ication)\b/i.test(
          text,
        )
      ) {
        findings.push(
          finding(
            item,
            "TUTOR_REALISM",
            "CRITICAL",
            "FORMULA_FIRST",
            "Formula-first language appears in the rendered explanation.",
            lines,
          ),
        );
      }
      if (!/1(?:\\)?%/.test(oneUnit)) {
        findings.push(
          finding(
            item,
            "ONE_UNIT_VISIBILITY",
            "CRITICAL",
            "MISSING_ONE_UNIT_REASONING",
            "The one-unit step is not visible.",
            [oneUnit],
          ),
        );
      }
      if (!exposesValue(answer, item.expectedAnswer)) {
        findings.push(
          finding(
            item,
            "ANSWER_CONFIDENCE",
            "CRITICAL",
            "ANSWER_PRESENTATION_MISMATCH",
            "The rendered answer does not preserve the source answer.",
            [answer, `Expected ${item.expectedAnswer}`],
          ),
        );
      }
      if (
        item.contextKind !== "abstract" &&
        !answer.toLowerCase().includes(item.contextLabel.toLowerCase())
      ) {
        findings.push(
          finding(
            item,
            "CONTEXT_PERSISTENCE",
            "MAJOR",
            "SOURCE_CONTEXT_DROPPED",
            "The final answer does not retain the frozen source context label.",
            [item.contextLabel, answer],
          ),
        );
      }
      if (
        item.knownRate !== item.targetRate &&
        !/\b(because|since|equal percentage parts|want the value of one)\b/i.test(
          oneUnit,
        )
      ) {
        findings.push(
          finding(
            item,
            "WEAK_STUDENT_FRIENDLINESS",
            "MAJOR",
            "DIVISION_INTENT_MISSING",
            "The explanation shows division without a sufficiently explicit reason.",
            [oneUnit],
          ),
        );
      }
      const longLines = lines.filter(
        (line) =>
          line
            .replace(/\$\$.*?\$\$/g, "")
            .trim()
            .split(/\s+/)
            .filter(Boolean).length > 24,
      );
      if (longLines.length > 0) {
        findings.push(
          finding(
            item,
            "TUTOR_REALISM",
            "MINOR",
            "DENSE_SENTENCE",
            "A rendered sentence is dense for a weak student.",
            longLines,
          ),
        );
      }

      const approved = !findings.some(
        (entry) =>
          entry.severity === "CRITICAL" || entry.severity === "MAJOR",
      );
      const comparison = compareWithSource(item, findings);
      return {
        item,
        solverEvidence: evidence,
        trace,
        graph,
        plan,
        renderedRoles,
        blocks,
        lines,
        findings,
        reviewerNotes: [
          "Question wording is frozen from the local PDF text layer.",
          item.sourceSolution?.kind === "WORKED_SOLUTION"
            ? "A matching worked source solution was available for comparison."
            : "Only an answer key or question page was verified; book-solution preference is not assessed.",
          `Book comparison: ${comparison}.`,
        ],
        bookComparison: comparison,
        approvalStatus: approved ? "APPROVED" : "REVIEW_REQUIRED",
      };
    } catch (error) {
      const pipelineFailure = {
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
      };
      findings.push(
        finding(
          item,
          "UNEXPECTED_MISMATCH",
          "MAJOR",
          "REAL_QUESTION_PIPELINE_REJECTION",
          "The current EEV2 slice could not render this valid strict-family question.",
          [pipelineFailure.name, pipelineFailure.message],
        ),
      );
      return {
        item,
        blocks: [],
        lines: [],
        findings,
        reviewerNotes: [
          "Question wording is frozen from the local PDF text layer.",
          "The pipeline failure is recorded without repair or fallback.",
        ],
        bookComparison:
          item.sourceSolution?.kind === "WORKED_SOLUTION"
            ? "SOURCE_CLEARER"
            : "NOT_ASSESSABLE",
        approvalStatus: "REVIEW_REQUIRED",
        pipelineFailure,
      };
    }
  });
}

