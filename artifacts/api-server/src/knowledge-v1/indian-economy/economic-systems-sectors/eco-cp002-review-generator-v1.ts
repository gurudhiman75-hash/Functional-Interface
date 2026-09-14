import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  ECO_CP002_ACTIVITY_ROWS_V1,
  ECO_CP002_OWNERSHIP_ROWS_V1,
  ECO_CP002_SYSTEM_ROWS_V1,
  ECO_CP002_WORK_ROWS_V1,
} from "./eco-cp002-facts";
import type { EcoCp002ReviewQuestion } from "./eco-cp002-review-types";

const systems = ECO_CP002_SYSTEM_ROWS_V1;
const activities = ECO_CP002_ACTIVITY_ROWS_V1;
const ownershipRows = ECO_CP002_OWNERSHIP_ROWS_V1;
const workRows = ECO_CP002_WORK_ROWS_V1;

const qlNames: Record<number, string> = {
  1: "Identify an economic system from its main feature",
  2: "Identify the main feature of an economic system",
  3: "Classify an activity by primary, secondary or tertiary sector",
  4: "Classify an activity by public or private ownership",
  5: "Classify work as organised or unorganised",
  6: "Keep activity and ownership classifications separate",
  7: "Identify a correctly matched category and example",
  8: "Identify an incorrectly matched category and example",
  9: "Evaluate two statements about sector classification",
  10: "Distinguish nearby classification concepts",
};

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
  const distractors = deterministicShuffle([...new Set(values)], seed)
    .filter((value) => value !== correct)
    .slice(0, 3);
  if (distractors.length !== 3) throw new Error(`Insufficient distractors for ${correct}`);
  return moveCorrect(deterministicShuffle([...distractors, correct], `${seed}:final`), correct, target);
}

function sources(...rows: readonly { sourceIds: readonly string[]; sourceFactIds: readonly string[] }[]) {
  return {
    sourceIds: [...new Set(rows.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(rows.flatMap((row) => row.sourceFactIds))],
  };
}

const sectorOptions = ["Primary sector", "Secondary sector", "Tertiary sector", "None of these"];
const ownershipOptions = ["Public sector", "Private sector", "Cooperative sector", "Foreign sector"];
const workOptions = ["Organised sector", "Unorganised sector", "Primary sector", "Public sector"];

const distinctionRows = Object.freeze([
  {
    stem: "Which statement is correct?",
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
    stem: "Which statement is correct?",
    correct: "A service can be in either the public sector or the private sector.",
    options: [
      "A service can be in either the public sector or the private sector.",
      "Every service belongs to the public sector.",
      "Every private activity belongs to the secondary sector.",
      "Every government activity belongs to the primary sector.",
    ],
    rows: [activities.find((row) => row.id === "hospital")!, ownershipRows[0], ownershipRows[3]],
  },
  {
    stem: "Which statement is correct?",
    correct: "Organised and unorganised classify work conditions, not the type of economic activity.",
    options: [
      "Organised and unorganised classify work conditions, not the type of economic activity.",
      "Organised means public sector only.",
      "Unorganised means primary sector only.",
      "Organised and tertiary mean the same thing.",
    ],
    rows: [workRows[0], activities[0]],
  },
]);

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): EcoCp002ReviewQuestion {
  const qlId = `ECO-002-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  const difficulty = difficultyForVariant(ql, rowIndex);
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let metadata = sources(systems[0]);

  if (ql === 1) {
    const row = systems[rowIndex % systems.length];
    stem = `Which system has ${row.compactMeaning}?`;
    correct = row.system;
    options = moveCorrect([...systems.map((item) => item.system), "Traditional economy"], correct, correctTarget);
    explanation = `${row.system} has ${row.compactMeaning}.`;
    metadata = sources(row);
  } else if (ql === 2) {
    const row = systems[rowIndex % systems.length];
    stem = `What is a main feature of a ${row.system.toLowerCase()}?`;
    correct = row.compactMeaning;
    options = chooseFour(
      [
        ...systems.map((item) => item.compactMeaning),
        "economic activity is classified only by occupation",
      ],
      correct,
      `${qlId}:${row.id}`,
      correctTarget,
    );
    explanation = `${row.system} means ${row.compactMeaning}.`;
    metadata = sources(row);
  } else if (ql === 3) {
    const row = activities[rowIndex % activities.length];
    stem = `${row.activity[0].toUpperCase()}${row.activity.slice(1)} belongs to which sector?`;
    correct = row.sector;
    options = moveCorrect([...sectorOptions], correct, correctTarget);
    explanation = `${row.sector}: ${row.reason}.`;
    metadata = sources(row);
  } else if (ql === 4) {
    const row = ownershipRows[rowIndex % ownershipRows.length];
    stem = `${row.description[0].toUpperCase()}${row.description.slice(1)} belongs to:`;
    correct = row.ownership;
    options = moveCorrect([...ownershipOptions], correct, correctTarget);
    explanation = `${row.ownership} is based on who owns or controls the enterprise.`;
    metadata = sources(row);
  } else if (ql === 5) {
    const row = workRows[rowIndex % workRows.length];
    stem = `${row.description[0].toUpperCase()}${row.description.slice(1)} belongs to:`;
    correct = row.classification;
    options = moveCorrect([...workOptions], correct, correctTarget);
    explanation = `${row.classification}: ${row.reason}.`;
    metadata = sources(row);
  } else if (ql === 6) {
    const activity = activities[(rowIndex * 2) % activities.length];
    const owner = ownershipRows[rowIndex % ownershipRows.length];
    stem = `A ${owner.ownership === "Public sector" ? "government-owned" : "privately owned"} unit is ${activity.activity}. Which classification is correct?`;
    correct = `${activity.sector}; ${owner.ownership}`;
    options = moveCorrect(
      [
        correct,
        `${activity.sector}; ${owner.ownership === "Public sector" ? "Private sector" : "Public sector"}`,
        `${activity.sector === "Primary sector" ? "Secondary sector" : "Primary sector"}; ${owner.ownership}`,
        `Organised sector; ${activity.sector}`,
      ],
      correct,
      correctTarget,
    );
    explanation = `${activity.sector} tells the type of activity. ${owner.ownership} tells the ownership.`;
    metadata = sources(activity, owner);
  } else if (ql === 7) {
    const row = activities[rowIndex % activities.length];
    correct = `${row.sector} — ${row.activity}`;
    const wrongPairs = activities
      .filter((item) => item.sector !== row.sector)
      .slice(0, 3)
      .map((item) => `${row.sector} — ${item.activity}`);
    stem = "Which pair is correctly matched?";
    options = moveCorrect(deterministicShuffle([correct, ...wrongPairs], `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `${row.activity} belongs to the ${row.sector.toLowerCase()}.`;
    metadata = sources(row, ...activities.filter((item) => item.sector !== row.sector).slice(0, 3));
  } else if (ql === 8) {
    const row = activities[rowIndex % activities.length];
    const donor = activities.find((item) => item.sector !== row.sector)!;
    correct = `${row.sector} — ${donor.activity}`;
    const truePairs = activities
      .filter((item) => item.id !== row.id && item.sector === item.sector)
      .slice(0, 3)
      .map((item) => `${item.sector} — ${item.activity}`);
    stem = "Which pair is incorrectly matched?";
    options = moveCorrect(deterministicShuffle([correct, ...truePairs], `${qlId}:${row.id}`), correct, correctTarget);
    explanation = `${donor.activity} belongs to the ${donor.sector.toLowerCase()}, not the ${row.sector.toLowerCase()}.`;
    metadata = sources(row, donor, ...activities.slice(0, 3));
  } else if (ql === 9) {
    const first = activities[rowIndex % activities.length];
    const second = activities[(rowIndex + 4) % activities.length];
    const makeSecondFalse = rowIndex % 2 === 1;
    const wrongSector = second.sector === "Primary sector" ? "Secondary sector" : "Primary sector";
    stem = `Consider the statements:\nI. ${first.activity} belongs to the ${first.sector.toLowerCase()}.\nII. ${second.activity} belongs to the ${(makeSecondFalse ? wrongSector : second.sector).toLowerCase()}.\nWhich is correct?`;
    correct = makeSecondFalse ? "I only" : "Both I and II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = `${first.activity} is ${first.sector.toLowerCase()}; ${second.activity} is ${second.sector.toLowerCase()}.`;
    metadata = sources(first, second);
  } else {
    const row = distinctionRows[rowIndex % distinctionRows.length];
    stem = row.stem;
    correct = row.correct;
    options = moveCorrect([...row.options], correct, correctTarget);
    explanation = row.correct;
    metadata = sources(...row.rows);
  }

  return {
    questionId: `ECO-CP002-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-002",
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

export function generateEcoCp002ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 3,
    2: 3,
    3: 8,
    4: 4,
    5: 4,
    6: 4,
    7: 4,
    8: 4,
    9: 5,
    10: 3,
  };

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
