import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP001_DIVISION_ROWS_V1 } from "./geo-phy-001-cp001-facts";
import type { GeoPhy001Cp001ReviewQuestion } from "./geo-phy-001-cp001-review-types";

const rows = GEO_PHY_001_CP001_DIVISION_ROWS_V1;
const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-001": "Identify physiographic division from description",
  "GEO-PHY-001-QL-002": "Identify defining feature of a division",
  "GEO-PHY-001-QL-003": "Correctly matched division–feature pair",
  "GEO-PHY-001-QL-004": "Incorrectly matched division–feature pair",
  "GEO-PHY-001-QL-005": "Identify division from broad location",
  "GEO-PHY-001-QL-006": "Compare major physiographic divisions",
  "GEO-PHY-001-QL-007": "Statement I/II on physical divisions",
  "GEO-PHY-001-QL-008": "Three-statement correct-count task",
  "GEO-PHY-001-QL-009": "Three-division description matching",
};

function targetDifficulty(ql: number): KnowledgeV1Difficulty {
  if ([1, 2, 5].includes(ql)) return "Easy";
  if ([3, 4, 6, 7].includes(ql)) return "Medium";
  return "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const current = options.indexOf(correct);
  if (current < 0) throw new Error(`Missing correct option ${correct}`);
  [options[current], options[target]] = [options[target], options[current]];
  return options;
}

function optionSet(values: string[], seed: string, correct: string, target: number) {
  const shuffled = deterministicShuffle([...values], seed).slice(0, 4);
  if (!shuffled.includes(correct)) shuffled[0] = correct;
  return moveCorrect(shuffled, correct, target);
}

function pair(rowIndex: number) {
  const row = rows[rowIndex];
  return `${row.division} — ${row.contrastDescription}`;
}

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): GeoPhy001Cp001ReviewQuestion {
  const row = rows[rowIndex];
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const sourceIds = [...row.sourceIds];
  const sourceFactIds = [...row.sourceFactIds];
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";

  if (ql === 1) {
    stem = `Which major physiographic division of India is described as ${row.primaryDescription}?`;
    correct = row.division;
    options = optionSet(rows.map((r) => r.division), `${qlId}:${row.id}`, correct, correctTarget);
    explanation = `${row.division} is ${row.primaryDescription}.`;
  } else if (ql === 2) {
    stem = `Which of the following best describes ${row.division}?`;
    correct = row.primaryDescription;
    options = optionSet(rows.map((r) => r.primaryDescription), `${qlId}:${row.id}`, correct, correctTarget);
    explanation = `${row.division} is described in NCERT as ${row.primaryDescription}.`;
  } else if (ql === 3) {
    stem = "Which of the following pairs is correctly matched?";
    correct = pair(rowIndex);
    const wrong = rows.filter((_, i) => i !== rowIndex).map((r, i) => `${r.division} — ${rows[(rowIndex + i + 2) % rows.length].contrastDescription}`);
    options = optionSet([correct, ...wrong], `${qlId}:${row.id}`, correct, correctTarget);
    explanation = `${row.division} is correctly associated with the description “${row.contrastDescription}”.`;
  } else if (ql === 4) {
    stem = "Which of the following pairs is incorrectly matched?";
    const wrongDescription = rows[(rowIndex + 1) % rows.length].contrastDescription;
    correct = `${row.division} — ${wrongDescription}`;
    const truePairs = rows.filter((_, i) => i !== rowIndex).map((r) => `${r.division} — ${r.contrastDescription}`);
    options = optionSet([correct, ...truePairs], `${qlId}:${row.id}`, correct, correctTarget);
    explanation = `${row.division} is not a ${wrongDescription}; it is a ${row.contrastDescription}.`;
  } else if (ql === 5) {
    stem = `Which major physiographic division is broadly associated with ${row.broadLocation}?`;
    correct = row.division;
    options = optionSet(rows.map((r) => r.division), `${qlId}:${row.id}`, correct, correctTarget);
    explanation = `${row.division} is broadly associated with ${row.broadLocation}.`;
  } else if (ql === 6) {
    const other = rows[(rowIndex + 3) % rows.length];
    stem = `Which option correctly distinguishes ${row.division} from ${other.division}?`;
    correct = `${row.division}: ${row.contrastDescription}; ${other.division}: ${other.contrastDescription}`;
    const candidates = [
      correct,
      `${row.division}: ${other.contrastDescription}; ${other.division}: ${row.contrastDescription}`,
      `${row.division}: ${rows[(rowIndex + 1) % rows.length].contrastDescription}; ${other.division}: ${other.contrastDescription}`,
      `${row.division}: ${row.contrastDescription}; ${other.division}: ${rows[(rowIndex + 2) % rows.length].contrastDescription}`,
    ];
    options = moveCorrect(deterministicShuffle(candidates, `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `${row.division} is a ${row.contrastDescription}, while ${other.division} is a ${other.contrastDescription}.`;
    sourceIds.push(...other.sourceIds);
    sourceFactIds.push(...other.sourceFactIds);
  } else if (ql === 7) {
    const second = rows[(rowIndex + 1) % rows.length];
    const mode = rowIndex % 4;
    const s1True = mode === 0 || mode === 2;
    const s2True = mode === 0 || mode === 1;
    const s1 = s1True ? `${row.division} is a ${row.contrastDescription}.` : `${row.division} is a ${second.contrastDescription}.`;
    const s2 = s2True ? `${second.division} is a ${second.contrastDescription}.` : `${second.division} is a ${row.contrastDescription}.`;
    stem = `Consider the following statements:\nI. ${s1}\nII. ${s2}\nWhich of the statements given above is/are correct?`;
    correct = s1True && s2True ? "Both I and II" : s1True ? "I only" : s2True ? "II only" : "Neither I nor II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = `${row.division} is a ${row.contrastDescription}; ${second.division} is a ${second.contrastDescription}.`;
    sourceIds.push(...second.sourceIds);
    sourceFactIds.push(...second.sourceFactIds);
  } else if (ql === 8) {
    const second = rows[(rowIndex + 1) % rows.length];
    const third = rows[(rowIndex + 2) % rows.length];
    const falseAt = rowIndex % 4;
    const statements = [row, second, third].map((r, i) => {
      if (falseAt < 3 && i === falseAt) return `${r.division} is a ${rows[(rowIndex + i + 3) % rows.length].contrastDescription}.`;
      return `${r.division} is a ${r.contrastDescription}.`;
    });
    const count = falseAt < 3 ? 2 : 3;
    stem = `Consider the following statements:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nHow many of the statements given above are correct?`;
    correct = ["None", "Only one", "Only two", "All three"][count];
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = `The correct descriptions are: ${row.division} — ${row.contrastDescription}; ${second.division} — ${second.contrastDescription}; ${third.division} — ${third.contrastDescription}.`;
    sourceIds.push(...second.sourceIds, ...third.sourceIds);
    sourceFactIds.push(...second.sourceFactIds, ...third.sourceFactIds);
  } else {
    const a = row;
    const b = rows[(rowIndex + 2) % rows.length];
    const c = rows[(rowIndex + 4) % rows.length];
    stem = `Match the descriptions with the correct physiographic divisions:\n1. ${a.contrastDescription}\n2. ${b.contrastDescription}\n3. ${c.contrastDescription}`;
    correct = `1-${a.division}; 2-${b.division}; 3-${c.division}`;
    const candidates = [
      correct,
      `1-${b.division}; 2-${a.division}; 3-${c.division}`,
      `1-${c.division}; 2-${b.division}; 3-${a.division}`,
      `1-${a.division}; 2-${c.division}; 3-${b.division}`,
    ];
    options = moveCorrect(deterministicShuffle(candidates, `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `${a.contrastDescription} refers to ${a.division}; ${b.contrastDescription} refers to ${b.division}; ${c.contrastDescription} refers to ${c.division}.`;
    sourceIds.push(...b.sourceIds, ...c.sourceIds);
    sourceFactIds.push(...b.sourceFactIds, ...c.sourceFactIds);
  }

  return {
    questionId: `GEO-PHY-001-CP001-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "GEO-PHY-001",
    cpId: "GEO-PHY-001-CP001",
    qlId,
    qlName: qlNames[qlId],
    difficulty: targetDifficulty(ql),
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    sourceIds: [...new Set(sourceIds)],
    sourceFactIds: [...new Set(sourceFactIds)],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoPhy001Cp001ReviewBatchV1() {
  const questions: GeoPhy001Cp001ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 9; ql += 1) {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
