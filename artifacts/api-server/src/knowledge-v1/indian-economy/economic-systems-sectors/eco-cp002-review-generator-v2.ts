import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  ECO_CP002_ACTIVITY_ROWS_V1 as activities,
  ECO_CP002_OWNERSHIP_ROWS_V1 as ownershipRows,
  ECO_CP002_SYSTEM_ROWS_V1 as systems,
  ECO_CP002_WORK_ROWS_V1 as workRows,
} from "./eco-cp002-facts";
import type { EcoCp002ReviewQuestion } from "./eco-cp002-review-types";

const qlNames: Record<number, string> = {
  1: "Identify an economic system from its main feature",
  2: "Identify the main feature of an economic system",
  3: "Classify an activity as primary, secondary or tertiary",
  4: "Classify an enterprise by ownership",
  5: "Classify work as organised or unorganised",
  6: "Keep activity and ownership classifications separate",
  7: "Identify a correctly matched sector and activity",
  8: "Identify an incorrectly matched sector and activity",
  9: "Evaluate statements about sector classification",
  10: "Distinguish nearby sector-classification concepts",
};

const countsByQl: Record<number, number> = { 1: 3, 2: 3, 3: 8, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 5, 10: 3 };

const difficultyForVariant = (ql: number, rowIndex: number): KnowledgeV1Difficulty => {
  if ([1, 2, 4].includes(ql)) return "Easy";
  if (ql === 3) return rowIndex < 4 ? "Easy" : "Medium";
  if (ql === 5) return rowIndex < 2 ? "Easy" : "Medium";
  if (ql === 6) return rowIndex < 2 ? "Medium" : "Hard";
  if (ql === 7) return "Medium";
  if (ql === 8) return rowIndex < 2 ? "Medium" : "Hard";
  if (ql === 9) return rowIndex < 2 ? "Medium" : "Hard";
  return "Hard";
};

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const distractors = deterministicShuffle([...new Set(values)], seed).filter((value) => value !== correct).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`Insufficient distractors for ${correct}`);
  return moveCorrect(deterministicShuffle([...distractors, correct], `${seed}:final`), correct, target);
}

function sources(...rows: readonly { sourceIds: readonly string[]; sourceFactIds: readonly string[] }[]) {
  return {
    sourceIds: [...new Set(rows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(rows.flatMap((row) => row.sourceFactIds))],
  };
}

const activityAxis = ["Primary sector", "Secondary sector", "Tertiary sector", "Cannot be determined from the activity given"];
const ownershipAxis = ["Public sector", "Private sector", "Both public and private sectors", "Cannot be determined from ownership information"];
const workAxis = ["Organised sector", "Unorganised sector", "Both organised and unorganised sectors", "Cannot be determined from the employment conditions given"];

const distinctionRows = Object.freeze([
  {
    stem: "Which statement correctly distinguishes activity from ownership classification?",
    correct: "Primary, secondary and tertiary classify the type of activity; public and private classify ownership.",
    options: [
      "Primary, secondary and tertiary classify the type of activity; public and private classify ownership.",
      "Primary and public mean the same thing.",
      "Tertiary and private mean the same thing.",
      "Ownership decides whether an activity is primary, secondary or tertiary.",
    ],
    rows: [activities[0], ownershipRows[0]],
  },
  {
    stem: "Which statement about service activities and ownership is correct?",
    correct: "A service can belong to either the public sector or the private sector.",
    options: [
      "A service can belong to either the public sector or the private sector.",
      "Every service belongs to the public sector.",
      "Every private activity belongs to the secondary sector.",
      "Every government activity belongs to the primary sector.",
    ],
    rows: [activities.find((row) => row.id === "hospital")!, ownershipRows[0], ownershipRows[3]],
  },
  {
    stem: "What do organised and unorganised sectors mainly classify?",
    correct: "Employment conditions and the degree of formality of work.",
    options: [
      "Employment conditions and the degree of formality of work.",
      "Whether output is agricultural or industrial.",
      "Whether an enterprise is publicly or privately owned.",
      "Whether an activity produces goods or services.",
    ],
    rows: [workRows[0], activities[0], ownershipRows[0]],
  },
]);

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): EcoCp002ReviewQuestion {
  const qlId = `ECO-002-QL-${String(ql).padStart(3, "0")}`;
  const target = globalIndex % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let metadata = sources(systems[0]);

  if (ql === 1) {
    const row = systems[rowIndex % systems.length];
    stem = `Which economic system is characterised by ${row.compactMeaning}?`;
    correct = row.system;
    options = moveCorrect([...systems.map((item) => item.system), "Traditional economy"], correct, target);
    explanation = `${row.system} is characterised by ${row.compactMeaning}.`;
    metadata = sources(row);
  } else if (ql === 2) {
    const row = systems[rowIndex % systems.length];
    stem = `What is a main feature of a ${row.system.toLowerCase()}?`;
    correct = row.compactMeaning;
    options = chooseFour([...systems.map((item) => item.compactMeaning), "ownership is unrelated to economic decisions"], correct, `${qlId}:${row.id}`, target);
    explanation = `${row.system} has ${row.compactMeaning}.`;
    metadata = sources(row);
  } else if (ql === 3) {
    const row = activities[rowIndex % activities.length];
    stem = `Which sector includes ${row.activity}?`;
    correct = row.sector;
    options = moveCorrect([...activityAxis], correct, target);
    explanation = `${row.activity} belongs to the ${row.sector.toLowerCase()} because ${row.reason}.`;
    metadata = sources(row);
  } else if (ql === 4) {
    const row = ownershipRows[rowIndex % ownershipRows.length];
    stem = `Which ownership category applies to ${row.description}?`;
    correct = row.ownership;
    options = moveCorrect([...ownershipAxis], correct, target);
    explanation = `${row.ownership} is determined by who owns or controls the enterprise.`;
    metadata = sources(row);
  } else if (ql === 5) {
    const row = workRows[rowIndex % workRows.length];
    stem = `How is ${row.description} classified by employment conditions?`;
    correct = row.classification;
    options = moveCorrect([...workAxis], correct, target);
    explanation = `${row.classification}: ${row.reason}.`;
    metadata = sources(row);
  } else if (ql === 6) {
    const activity = activities[(rowIndex * 2) % activities.length];
    const owner = ownershipRows[rowIndex % ownershipRows.length];
    const otherOwner = owner.ownership === "Public sector" ? "Private sector" : "Public sector";
    const sectors = ["Primary sector", "Secondary sector", "Tertiary sector"];
    const otherSector = sectors[(sectors.indexOf(activity.sector) + 1) % sectors.length];
    stem = `A ${owner.ownership === "Public sector" ? "government-owned" : "privately owned"} unit is ${activity.activity}. Which classification is correct?`;
    correct = `${activity.sector}; ${owner.ownership}`;
    options = moveCorrect([correct, `${activity.sector}; ${otherOwner}`, `${otherSector}; ${owner.ownership}`, `${otherSector}; ${otherOwner}`], correct, target);
    explanation = `${activity.sector} describes the activity. ${owner.ownership} describes ownership.`;
    metadata = sources(activity, owner);
  } else if (ql === 7) {
    const row = activities[rowIndex % activities.length];
    correct = `${row.sector} — ${row.activity}`;
    const wrongPairs = activities.filter((item) => item.sector !== row.sector).slice(0, 3).map((item) => `${row.sector} — ${item.activity}`);
    stem = "Which pair is correctly matched?";
    options = moveCorrect(deterministicShuffle([correct, ...wrongPairs], `${qlId}:${row.id}`), correct, target);
    explanation = `${row.activity} belongs to the ${row.sector.toLowerCase()}.`;
    metadata = sources(row, ...activities.filter((item) => item.sector !== row.sector).slice(0, 3));
  } else if (ql === 8) {
    const row = activities[rowIndex % activities.length];
    const donor = activities.find((item) => item.sector !== row.sector)!;
    correct = `${row.sector} — ${donor.activity}`;
    const trueRows = activities.filter((item) => item.id !== donor.id && item.id !== row.id).slice(0, 3);
    const truePairs = trueRows.map((item) => `${item.sector} — ${item.activity}`);
    stem = "Which pair is incorrectly matched?";
    options = moveCorrect(deterministicShuffle([correct, ...truePairs], `${qlId}:${row.id}`), correct, target);
    explanation = `${donor.activity} belongs to the ${donor.sector.toLowerCase()}, not the ${row.sector.toLowerCase()}.`;
    metadata = sources(row, donor, ...trueRows);
  } else if (ql === 9) {
    const first = activities[rowIndex % activities.length];
    const second = activities[(rowIndex + 4) % activities.length];
    const secondFalse = rowIndex % 2 === 1;
    const wrongSector = second.sector === "Primary sector" ? "Secondary sector" : "Primary sector";
    stem = `Consider the statements. I. ${first.activity} belongs to the ${first.sector.toLowerCase()}. II. ${second.activity} belongs to the ${(secondFalse ? wrongSector : second.sector).toLowerCase()}. Which option is correct?`;
    correct = secondFalse ? "I only" : "Both I and II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, target);
    explanation = `${first.activity} is ${first.sector.toLowerCase()}; ${second.activity} is ${second.sector.toLowerCase()}.`;
    metadata = sources(first, second);
  } else {
    const row = distinctionRows[rowIndex % distinctionRows.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, target);
    explanation = row.correct;
    metadata = sources(...row.rows);
  }

  return {
    questionId: `ECO-CP002-V2-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-002",
    qlId,
    qlName: qlNames[ql],
    difficulty: difficultyForVariant(ql, rowIndex),
    stem,
    options,
    correctIndex: target,
    canonicalAnswer: correct,
    explanation,
    ...metadata,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateEcoCp002ReviewBatchV2() {
  const questions: EcoCp002ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 10; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}

export const ECO_CP002_REVIEW_V2 = generateEcoCp002ReviewBatchV2();
