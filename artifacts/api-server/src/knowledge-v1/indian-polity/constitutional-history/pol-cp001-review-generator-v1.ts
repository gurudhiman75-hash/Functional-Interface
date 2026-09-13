import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  POL_CP001_ACT_ROWS_V1,
  POL_CP001_REFORM_ROWS_V1,
  type PolCp001ActRow,
} from "./pol-cp001-facts";
import type { PolCp001ReviewQuestion } from "./pol-cp001-review-types";

const rows = POL_CP001_ACT_ROWS_V1;

const qlNames: Record<number, string> = {
  1: "Identify the Act from a defining provision",
  2: "Identify the defining provision of an Act",
  3: "Map an enactment year to the correct Act",
  4: "Identify the correctly matched Act–provision pair",
  5: "Identify the incorrectly matched Act–provision pair",
  6: "Identify the Act from a constitutional milestone",
  7: "Map a named constitutional reform to its Act",
  8: "Evaluate two statements about constitutional development",
  9: "Count correct statements about constitutional development",
  10: "Arrange constitutional Acts in chronological order",
  11: "Identify the Act lying between two constitutional milestones",
  12: "Distinguish two nearby constitutional reforms",
};

const difficultyForQl = (ql: number): KnowledgeV1Difficulty => {
  if ([1, 2, 3, 7].includes(ql)) return "Easy";
  if ([4, 5, 6, 8, 11].includes(ql)) return "Medium";
  return "Hard";
};

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function chooseFour(
  values: readonly string[],
  correct: string,
  seed: string,
  target: number,
) {
  const candidates = deterministicShuffle([...new Set(values)], seed);
  const output = candidates.filter((value) => value !== correct).slice(0, 3);
  output.push(correct);
  return moveCorrect(deterministicShuffle(output, `${seed}:final`), correct, target);
}

function sources(...actRows: PolCp001ActRow[]) {
  return {
    sourceIds: [...new Set(actRows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(actRows.flatMap((row) => row.sourceFactIds))],
  };
}

function trueStatement(row: PolCp001ActRow) {
  return `${row.title} ${row.definingFeature}.`;
}

function falseStatement(row: PolCp001ActRow, donor: PolCp001ActRow) {
  return `${row.title} ${donor.definingFeature}.`;
}

function makeQuestion(
  ql: number,
  rowIndex: number,
  globalIndex: number,
): PolCp001ReviewQuestion {
  const row = rows[rowIndex % rows.length];
  const qlId = `POL-001-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const difficulty = difficultyForQl(ql);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let usedRows: PolCp001ActRow[] = [row];

  if (ql === 1) {
    stem = `Which Act ${row.definingFeature}?`;
    correct = row.title;
    options = chooseFour(rows.map((candidate) => candidate.title), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.title} ${row.definingFeature}.`;
  } else if (ql === 2) {
    stem = `Which of the following was a major provision of the ${row.title}?`;
    correct = row.compactFeature;
    options = chooseFour(rows.map((candidate) => candidate.compactFeature), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `A key feature of the ${row.title} was ${row.compactFeature}.`;
  } else if (ql === 3) {
    stem = `Which of the following Acts was enacted in ${row.year}?`;
    correct = row.title;
    options = chooseFour(rows.map((candidate) => candidate.title), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.title} was enacted in ${row.year}.`;
  } else if (ql === 4) {
    stem = "Which of the following pairs is correctly matched?";
    correct = `${row.title} — ${row.compactFeature}`;
    const wrongPairs = rows
      .filter((candidate) => candidate.id !== row.id)
      .slice(0, 8)
      .map((candidate, offset) => {
        let donor = rows[(rowIndex + offset + 2) % rows.length];
        if (donor.id === candidate.id) {
          donor = rows[(donor.sequenceRank + 1) % rows.length];
        }
        return `${candidate.title} — ${donor.compactFeature}`;
      });
    options = chooseFour([correct, ...wrongPairs], correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.title} is correctly matched with ${row.compactFeature}.`;
  } else if (ql === 5) {
    stem = "Which of the following pairs is incorrectly matched?";
    const donor = rows[(rowIndex + 3) % rows.length];
    correct = `${row.title} — ${donor.compactFeature}`;
    const truePairs = rows
      .filter((candidate) => candidate.id !== row.id && candidate.id !== donor.id)
      .slice(0, 3)
      .map((candidate) => `${candidate.title} — ${candidate.compactFeature}`);
    options = moveCorrect(
      deterministicShuffle([correct, ...truePairs], `${qlId}:${row.id}`),
      correct,
      correctTarget,
    );
    explanation = `${donor.compactFeature} belongs to the ${donor.title}, not the ${row.title}. The ${row.title} is linked with ${row.compactFeature}.`;
    usedRows.push(donor);
  } else if (ql === 6) {
    const milestoneRows = rows.filter((candidate) => candidate.milestone);
    const target = milestoneRows[rowIndex % milestoneRows.length];
    stem = `Which Act ${target.milestone}?`;
    correct = target.title;
    options = chooseFour(milestoneRows.map((candidate) => candidate.title), correct, `${qlId}:${target.id}`, correctTarget);
    explanation = `${target.title} ${target.milestone}.`;
    usedRows = [target];
  } else if (ql === 7) {
    const target = POL_CP001_REFORM_ROWS_V1[rowIndex % POL_CP001_REFORM_ROWS_V1.length];
    stem = `The ${target.reformName} are associated with which Act?`;
    correct = target.title;
    options = chooseFour(rows.map((candidate) => candidate.title), correct, `${qlId}:${target.id}`, correctTarget);
    explanation = `The ${target.reformName} were embodied in the ${target.title}.`;
    usedRows = [target];
  } else if (ql === 8) {
    const second = rows[(rowIndex + 1) % rows.length];
    const donor = rows[(rowIndex + 4) % rows.length];
    const mode = rowIndex % 4;
    const firstTrue = mode === 0 || mode === 1;
    const secondTrue = mode === 0 || mode === 2;
    const s1 = firstTrue ? trueStatement(row) : falseStatement(row, donor);
    const s2 = secondTrue ? trueStatement(second) : falseStatement(second, row);
    stem = `Consider the following statements:\nI. ${s1}\nII. ${s2}\nWhich of the statements given above is/are correct?`;
    correct =
      firstTrue && secondTrue
        ? "Both I and II"
        : firstTrue
          ? "I only"
          : secondTrue
            ? "II only"
            : "Neither I nor II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = `The ${row.title} is correctly linked with ${row.compactFeature}; the ${second.title} is correctly linked with ${second.compactFeature}.`;
    usedRows = [row, second, donor];
  } else if (ql === 9) {
    const second = rows[(rowIndex + 2) % rows.length];
    const third = rows[(rowIndex + 4) % rows.length];
    const donor = rows[(rowIndex + 6) % rows.length];
    const falseAt = rowIndex % 4;
    const targets = [row, second, third];
    const statements = targets.map((target, index) =>
      falseAt < 3 && index === falseAt ? falseStatement(target, donor) : trueStatement(target),
    );
    const count = falseAt < 3 ? 2 : 3;
    stem = `Consider the following statements:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nHow many of the statements given above are correct?`;
    correct = ["None", "Only one", "Only two", "All three"][count];
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = `${row.title}: ${row.compactFeature}; ${second.title}: ${second.compactFeature}; ${third.title}: ${third.compactFeature}.`;
    usedRows = [row, second, third, donor];
  } else if (ql === 10) {
    const selected = [row, rows[(rowIndex + 3) % rows.length], rows[(rowIndex + 6) % rows.length], rows[(rowIndex + 9) % rows.length]]
      .sort((a, b) => a.sequenceRank - b.sequenceRank);
    correct = selected.map((candidate) => candidate.title).join(" → ");
    const alt1 = [selected[1], selected[0], selected[2], selected[3]].map((candidate) => candidate.title).join(" → ");
    const alt2 = [selected[0], selected[2], selected[1], selected[3]].map((candidate) => candidate.title).join(" → ");
    const alt3 = [...selected].reverse().map((candidate) => candidate.title).join(" → ");
    stem = "Which option gives the correct chronological order of these constitutional Acts?";
    options = moveCorrect(deterministicShuffle([correct, alt1, alt2, alt3], `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `The correct order by enactment year is ${correct}.`;
    usedRows = selected;
  } else if (ql === 11) {
    const ordered = [...rows].sort((a, b) => a.sequenceRank - b.sequenceRank);
    const leftIndex = rowIndex % (ordered.length - 2);
    const left = ordered[leftIndex];
    const middle = ordered[leftIndex + 1];
    const right = ordered[leftIndex + 2];
    stem = `Which Act came after the ${left.title} but before the ${right.title}?`;
    correct = middle.title;
    options = chooseFour(rows.map((candidate) => candidate.title), correct, `${qlId}:${middle.id}`, correctTarget);
    explanation = `${left.title} (${left.year}) was followed by ${middle.title} (${middle.year}), and then by ${right.title} (${right.year}).`;
    usedRows = [left, middle, right];
  } else {
    const comparisonPairs: readonly [string, string][] = [
      ["indian-councils-act-1909", "government-of-india-act-1919"],
      ["government-of-india-act-1919", "government-of-india-act-1935"],
      ["regulating-act-1773", "pitts-india-act-1784"],
      ["charter-act-1813", "charter-act-1833"],
      ["charter-act-1833", "charter-act-1853"],
      ["government-of-india-act-1858", "indian-councils-act-1861"],
    ];
    const [leftId, rightId] = comparisonPairs[rowIndex % comparisonPairs.length];
    const left = rows.find((candidate) => candidate.id === leftId)!;
    const right = rows.find((candidate) => candidate.id === rightId)!;
    stem = `Which option correctly distinguishes the ${left.title} from the ${right.title}?`;
    correct = `${left.title}: ${left.compactFeature}; ${right.title}: ${right.compactFeature}`;
    const candidates = [
      correct,
      `${left.title}: ${right.compactFeature}; ${right.title}: ${left.compactFeature}`,
      `${left.title}: ${rows[(left.sequenceRank + 2) % rows.length].compactFeature}; ${right.title}: ${right.compactFeature}`,
      `${left.title}: ${left.compactFeature}; ${right.title}: ${rows[(right.sequenceRank + 3) % rows.length].compactFeature}`,
    ];
    options = moveCorrect(deterministicShuffle(candidates, `${qlId}:${left.id}:${right.id}`), correct, correctTarget);
    explanation = `The ${left.title} is identified by ${left.compactFeature}, whereas the ${right.title} is identified by ${right.compactFeature}.`;
    usedRows = [left, right];
  }

  const metadata = sources(...usedRows);
  return {
    questionId: `POL-CP001-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-001",
    qlId,
    qlName: qlNames[ql],
    difficulty,
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    ...metadata,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generatePolCp001ReviewBatchV1() {
  const questions: PolCp001ReviewQuestion[] = [];
  let globalIndex = 0;
  const countsByQl: Record<number, number> = {
    1: 4,
    2: 4,
    3: 3,
    4: 4,
    5: 4,
    6: 4,
    7: 2,
    8: 4,
    9: 3,
    10: 3,
    11: 4,
    12: 3,
  };

  for (let ql = 1; ql <= 12; ql += 1) {
    const count = countsByQl[ql];
    for (let rowIndex = 0; rowIndex < count; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex + ql, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
