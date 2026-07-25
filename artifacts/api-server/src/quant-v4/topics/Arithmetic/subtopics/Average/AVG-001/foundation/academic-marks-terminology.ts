import type { Avg001QuestionPackage } from "./types";

const ACADEMIC_MARK_QL_IDS = new Set([
  "AVG-QL-007", "AVG-QL-019", "AVG-QL-025", "AVG-QL-031", "AVG-QL-037",
  "AVG-QL-043", "AVG-QL-056", "AVG-QL-061", "AVG-QL-067", "AVG-QL-080",
  "AVG-QL-093", "AVG-QL-098", "AVG-QL-110", "AVG-QL-124", "AVG-QL-137",
  "AVG-QL-149", "AVG-QL-162", "AVG-QL-175", "AVG-QL-187", "AVG-QL-192",
  "AVG-QL-209", "AVG-QL-216", "AVG-QL-231", "AVG-QL-248", "AVG-QL-255",
  "AVG-QL-274", "AVG-QL-282", "AVG-QL-290", "AVG-QL-374",
]);

function normalizeAcademicMarks(text: string) {
  return text
    .replace(/\b(A student|A candidate) scores (?=(?:a total of )?[\d{])/gi, "$1 obtains ")
    .replace(/\bAfter scoring ([\d,.{}]+)(?!\s+marks)\b/gi, "After obtaining $1 marks")
    .replace(/\bmarks scored by\b/gi, "marks obtained by")
    .replace(
      /\bThe average score of ([\d,.{}]+) students was reported as ([\d,.{}]+) marks\b/gi,
      "The reported average of $1 students was $2 marks",
    )
    .replace(
      /\bThe reported average score for ([\d,.{}]+) students is ([\d,.{}]+) marks\b/gi,
      "The reported average of $1 students is $2 marks",
    )
    .replace(
      /\bThe average score of ([\d,.{}]+) students was ([\d,.{}]+) marks\b/gi,
      "The average of $1 students was $2 marks",
    )
    .replace(
      /\b([\d,.{}]+) students have an average score of ([\d,.{}]+)\b/gi,
      "$1 students have an average of $2 marks",
    )
    .replace(
      /\bThe average score in ([\d,.{}]+) tests is ([\d,.{}]+)\b/gi,
      "The average in $1 tests is $2 marks",
    )
    .replace(
      /\bThe total score in the first ([\d,.{}]+) tests is ([\d,.{}]+)\b/gi,
      "The total for the first $1 tests is $2 marks",
    )
    .replace(
      /\bThe combined score in ([\d,.{}]+) practice tests is ([\d,.{}]+)\b/gi,
      "The total in $1 practice tests is $2 marks",
    )
    .replace(
      /\bThe combined score of a batch is ([\d,.{}]+)\b/gi,
      "The total marks of a batch are $1",
    )
    .replace(/\bIf the average score is ([\d,.{}]+)\b/gi, "If the average is $1 marks")
    .replace(
      /\bA student's ([\d,.{}]+) scores increase by ([\d,.{}]+) each test\b/gi,
      "A student's marks in $1 tests increase by $2 each time",
    )
    .replace(/\baverage score per test\b/gi, "average marks per test")
    .replace(/\bnext test score\b/gi, "marks in the next test")
    .replace(/\blast test score\b/gi, "marks in the last test")
    .replace(/\bscore in the remaining test\b/gi, "marks in the remaining test")
    .replace(/\bnext-test score\b/gi, "marks in the next test")
    .replace(/\bincoming test score\b/gi, "marks in the new test")
    .replace(/\bscores\b/gi, "marks")
    .replace(/\bscore\b/gi, "mark")
    .replace(/\ban average mark of\b/gi, "an average of")
    .replace(/\baverage mark of\b/gi, "average of")
    .replace(/\baverage mark for\b/gi, "average for")
    .replace(/\bcombined mark\b/gi, "total marks")
    .replace(/\bWhat is their total marks\?/gi, "What are their total marks?")
    .replace(/\baverage mark when both groups\b/gi, "average marks when both groups");
}

export function applyAvg001AcademicMarksTerminology(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.language !== "en" || !ACADEMIC_MARK_QL_IDS.has(pkg.questionLanguageId)) return pkg;

  return {
    ...pkg,
    stem: normalizeAcademicMarks(pkg.stem),
    explanation: {
      ...pkg.explanation,
      lines: pkg.explanation.lines.map(normalizeAcademicMarks),
    },
    traceability: {
      ...pkg.traceability,
      academicMarksTerminology: "AVG-001 academic contexts use marks v1",
    },
  };
}
