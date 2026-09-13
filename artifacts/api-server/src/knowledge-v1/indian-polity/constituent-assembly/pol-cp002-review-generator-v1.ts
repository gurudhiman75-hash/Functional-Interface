import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  POL_CP002_COMMITTEE_ROWS_V1,
  POL_CP002_COMPOSITION_ROWS_V1,
  POL_CP002_ELECTION_METHOD_V1,
  POL_CP002_INFLUENCE_ROWS_V1,
  POL_CP002_MILESTONES_V1,
  POL_CP002_ROLE_ROWS_V1,
} from "./pol-cp002-facts";
import type { PolCp002ReviewQuestion } from "./pol-cp002-review-types";

type Sourced = {
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const qlNames: Record<number, string> = {
  1: "Identify a constitution-making milestone date",
  2: "Identify the event associated with a date",
  3: "Identify a Constituent Assembly office-holder from the role",
  4: "Identify the role of a Constituent Assembly figure",
  5: "Identify the chairperson of a major Constituent Assembly committee",
  6: "Identify the correctly matched committee–chair pair",
  7: "Recall a Constituent Assembly composition or drafting count",
  8: "Identify the Cabinet Mission election method for provincial representatives",
  9: "Identify the correctly matched milestone–date pair",
  10: "Evaluate two statements on constitution-making",
  11: "Count correct statements on Constituent Assembly roles and committees",
  12: "Arrange constitution-making milestones chronologically",
  13: "Identify the constitutional source of a borrowed feature",
  14: "Identify a feature associated with a constitutional source",
  15: "Distinguish adoption, signing and commencement",
  16: "Order the drafting process from constitutional advice to adoption",
};

const difficultyForQl = (ql: number): KnowledgeV1Difficulty => {
  if ([1, 2, 3, 4, 7].includes(ql)) return "Easy";
  if ([5, 6, 8, 9, 10, 13, 14].includes(ql)) return "Medium";
  return "Hard";
};

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const candidates = deterministicShuffle([...new Set(values.filter((value) => value !== correct))], seed).slice(0, 3);
  if (candidates.length < 3) throw new Error(`Insufficient distractors for ${seed}`);
  const options = deterministicShuffle([...candidates, correct], `${seed}:options`);
  return moveCorrect(options, correct, target);
}

function metadata(items: readonly Sourced[]) {
  return {
    sourceIds: [...new Set(items.flatMap((item) => [...item.sourceIds]))],
    sourceFactIds: [...new Set(items.flatMap((item) => [...item.sourceFactIds]))],
  };
}

function falseMilestoneStatement(targetIndex: number, donorOffset = 2) {
  const target = POL_CP002_MILESTONES_V1[targetIndex % POL_CP002_MILESTONES_V1.length];
  const donor = POL_CP002_MILESTONES_V1[(targetIndex + donorOffset) % POL_CP002_MILESTONES_V1.length];
  return {
    text: `${target.event} on ${donor.displayDate}.`,
    target,
    donor,
  };
}

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): PolCp002ReviewQuestion {
  const qlId = `POL-002-QL-${String(ql).padStart(3, "0")}`;
  const difficulty = difficultyForQl(ql);
  const correctTarget = globalIndex % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let used: Sourced[] = [];

  if (ql === 1) {
    const row = POL_CP002_MILESTONES_V1[rowIndex % POL_CP002_MILESTONES_V1.length];
    stem = `On which date did the following occur: ${row.event.toLowerCase()}?`;
    correct = row.displayDate;
    options = chooseFour(POL_CP002_MILESTONES_V1.map((item) => item.displayDate), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.event} on ${row.displayDate}. ${row.detail}`;
    used = [row];
  } else if (ql === 2) {
    const row = POL_CP002_MILESTONES_V1[rowIndex % POL_CP002_MILESTONES_V1.length];
    stem = `Which event in the making of the Constitution took place on ${row.displayDate}?`;
    correct = row.event;
    options = chooseFour(POL_CP002_MILESTONES_V1.map((item) => item.event), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.event} on ${row.displayDate}.`;
    used = [row];
  } else if (ql === 3) {
    const row = POL_CP002_ROLE_ROWS_V1[rowIndex % POL_CP002_ROLE_ROWS_V1.length];
    stem = `Who served as the ${row.role.toLowerCase()}?`;
    correct = row.person;
    options = chooseFour(POL_CP002_ROLE_ROWS_V1.map((item) => item.person), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.person} served as the ${row.role.toLowerCase()}. ${row.detail}`;
    used = [row];
  } else if (ql === 4) {
    const row = POL_CP002_ROLE_ROWS_V1[rowIndex % POL_CP002_ROLE_ROWS_V1.length];
    stem = `What was ${row.person}'s role in the making of the Constitution?`;
    correct = row.role;
    options = chooseFour(POL_CP002_ROLE_ROWS_V1.map((item) => item.role), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.person} was the ${row.role.toLowerCase()}. ${row.detail}`;
    used = [row];
  } else if (ql === 5) {
    const row = POL_CP002_COMMITTEE_ROWS_V1[rowIndex % POL_CP002_COMMITTEE_ROWS_V1.length];
    const personPool = [...POL_CP002_ROLE_ROWS_V1.map((item) => item.person), "Vallabhbhai Patel"];
    stem = `Who chaired the ${row.committee}?`;
    correct = row.chair;
    options = chooseFour(personPool, correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.chair} chaired the ${row.committee}, which dealt with ${row.function}.`;
    used = [row];
  } else if (ql === 6) {
    const row = POL_CP002_COMMITTEE_ROWS_V1[rowIndex % POL_CP002_COMMITTEE_ROWS_V1.length];
    const personPool = [...new Set([...POL_CP002_ROLE_ROWS_V1.map((item) => item.person), "Vallabhbhai Patel"])];
    stem = "Which of the following committee–chairperson pairs is correctly matched?";
    correct = `${row.committee} — ${row.chair}`;
    const wrongPairs = POL_CP002_COMMITTEE_ROWS_V1
      .filter((item) => item.id !== row.id)
      .map((item, offset) => {
        const wrongPeople = personPool.filter((person) => person !== item.chair);
        const wrongPerson = wrongPeople[(rowIndex + offset) % wrongPeople.length];
        return `${item.committee} — ${wrongPerson}`;
      });
    options = chooseFour([correct, ...wrongPairs], correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.committee} was chaired by ${row.chair}.`;
    used = [row];
  } else if (ql === 7) {
    const row = POL_CP002_COMPOSITION_ROWS_V1[rowIndex % POL_CP002_COMPOSITION_ROWS_V1.length];
    stem = `What was the ${row.label.toLowerCase()}?`;
    correct = row.value;
    options = chooseFour(POL_CP002_COMPOSITION_ROWS_V1.map((item) => item.value), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = row.explanation;
    used = [row];
  } else if (ql === 8) {
    const row = POL_CP002_ELECTION_METHOD_V1;
    stem = row.question;
    correct = row.answer;
    options = moveCorrect(
      deterministicShuffle([
        correct,
        "By direct election on the basis of universal adult franchise",
        "By nomination of all provincial representatives by the Governor-General",
        "By Provincial Legislative Assemblies using a simple plurality vote",
      ], `${qlId}:method`),
      correct,
      correctTarget,
    );
    explanation = row.explanation;
    used = [row];
  } else if (ql === 9) {
    const row = POL_CP002_MILESTONES_V1[rowIndex % POL_CP002_MILESTONES_V1.length];
    stem = "Which of the following constitution-making milestone–date pairs is correctly matched?";
    correct = `${row.event} — ${row.displayDate}`;
    const wrongPairs = POL_CP002_MILESTONES_V1
      .filter((item) => item.id !== row.id)
      .map((item, offset) => `${item.event} — ${POL_CP002_MILESTONES_V1[(rowIndex + offset + 2) % POL_CP002_MILESTONES_V1.length].displayDate}`)
      .filter((pair) => !POL_CP002_MILESTONES_V1.some((item) => pair === `${item.event} — ${item.displayDate}`));
    options = chooseFour([correct, ...wrongPairs], correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${row.event} on ${row.displayDate}.`;
    used = [row];
  } else if (ql === 10) {
    const first = POL_CP002_MILESTONES_V1[rowIndex % POL_CP002_MILESTONES_V1.length];
    const secondIndex = (rowIndex + 3) % POL_CP002_MILESTONES_V1.length;
    const second = POL_CP002_MILESTONES_V1[secondIndex];
    const mode = rowIndex % 4;
    const firstTrue = mode === 0 || mode === 1;
    const secondTrue = mode === 0 || mode === 2;
    const falseFirst = falseMilestoneStatement(rowIndex, 2);
    const falseSecond = falseMilestoneStatement(secondIndex, 2);
    const s1 = firstTrue ? `${first.event} on ${first.displayDate}.` : falseFirst.text;
    const s2 = secondTrue ? `${second.event} on ${second.displayDate}.` : falseSecond.text;
    stem = `Consider the following statements:\nI. ${s1}\nII. ${s2}\nWhich of the statements given above is/are correct?`;
    correct = firstTrue && secondTrue ? "Both I and II" : firstTrue ? "I only" : secondTrue ? "II only" : "Neither I nor II";
    options = moveCorrect(["I only", "II only", "Both I and II", "Neither I nor II"], correct, correctTarget);
    explanation = `${first.event} on ${first.displayDate}. ${second.event} on ${second.displayDate}.`;
    used = [first, second, falseFirst.donor, falseSecond.donor];
  } else if (ql === 11) {
    const roles = POL_CP002_ROLE_ROWS_V1;
    const committees = POL_CP002_COMMITTEE_ROWS_V1;
    const role = roles[rowIndex % roles.length];
    const committee = committees[(rowIndex + 1) % committees.length];
    const secondRole = roles[(rowIndex + 2) % roles.length];
    const falseAt = rowIndex % 3;
    const donorRole = roles[(rowIndex + 3) % roles.length];
    const differentChair = committees.map((item) => item.chair).find((chair) => chair !== committee.chair)!;
    const statements = [
      falseAt === 0 ? `${role.person} was the ${donorRole.role.toLowerCase()}.` : `${role.person} was the ${role.role.toLowerCase()}.`,
      falseAt === 1 ? `${committee.committee} was chaired by ${differentChair}.` : `${committee.committee} was chaired by ${committee.chair}.`,
      falseAt === 2 ? `${secondRole.person} was the ${donorRole.role.toLowerCase()}.` : `${secondRole.person} was the ${secondRole.role.toLowerCase()}.`,
    ];
    stem = `Consider the following statements:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nHow many of the statements given above are correct?`;
    correct = "Only two";
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = `${role.person}: ${role.role}; ${committee.committee}: chaired by ${committee.chair}; ${secondRole.person}: ${secondRole.role}.`;
    used = [role, committee, secondRole, donorRole];
  } else if (ql === 12) {
    const start = rowIndex % 4;
    const selected = [
      POL_CP002_MILESTONES_V1[start],
      POL_CP002_MILESTONES_V1[start + 2],
      POL_CP002_MILESTONES_V1[start + 4],
      POL_CP002_MILESTONES_V1[start + 5],
    ].sort((a, b) => a.sequenceRank - b.sequenceRank);
    correct = selected.map((item) => item.event).join(" → ");
    const alt1 = [selected[1], selected[0], selected[2], selected[3]].map((item) => item.event).join(" → ");
    const alt2 = [selected[0], selected[2], selected[1], selected[3]].map((item) => item.event).join(" → ");
    const alt3 = [...selected].reverse().map((item) => item.event).join(" → ");
    stem = "Which option gives the correct chronological order of these constitution-making milestones?";
    options = moveCorrect(deterministicShuffle([correct, alt1, alt2, alt3], `${qlId}:${rowIndex}`), correct, correctTarget);
    explanation = `The correct sequence is ${selected.map((item) => `${item.event} (${item.displayDate})`).join("; then ")}.`;
    used = selected;
  } else if (ql === 13) {
    const row = POL_CP002_INFLUENCE_ROWS_V1[rowIndex % POL_CP002_INFLUENCE_ROWS_V1.length];
    stem = `The Indian Constitution's ${row.feature.toLowerCase()} drew major inspiration from which source?`;
    correct = row.source;
    options = chooseFour(POL_CP002_INFLUENCE_ROWS_V1.map((item) => item.source), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = row.explanation;
    used = [row];
  } else if (ql === 14) {
    const row = POL_CP002_INFLUENCE_ROWS_V1[rowIndex % POL_CP002_INFLUENCE_ROWS_V1.length];
    stem = `Which constitutional feature is correctly associated with ${row.source}?`;
    correct = row.feature;
    options = chooseFour(POL_CP002_INFLUENCE_ROWS_V1.map((item) => item.feature), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = row.explanation;
    used = [row];
  } else if (ql === 15) {
    const adopted = POL_CP002_MILESTONES_V1.find((item) => item.id === "constitution-adopted")!;
    const signed = POL_CP002_MILESTONES_V1.find((item) => item.id === "constitution-signed")!;
    const commenced = POL_CP002_MILESTONES_V1.find((item) => item.id === "constitution-commenced")!;
    stem = "Which option correctly matches the adoption, signing and commencement of the Constitution?";
    correct = `Adopted — ${adopted.displayDate}; Signed — ${signed.displayDate}; Came into force — ${commenced.displayDate}`;
    const candidates = [
      correct,
      `Adopted — ${signed.displayDate}; Signed — ${adopted.displayDate}; Came into force — ${commenced.displayDate}`,
      `Adopted — ${adopted.displayDate}; Signed — ${commenced.displayDate}; Came into force — ${signed.displayDate}`,
      `Adopted — ${commenced.displayDate}; Signed — ${signed.displayDate}; Came into force — ${adopted.displayDate}`,
    ];
    options = moveCorrect(deterministicShuffle(candidates, `${qlId}:triple`), correct, correctTarget);
    explanation = `The Constitution was adopted on ${adopted.displayDate}, signed by members on ${signed.displayDate}, and came into force in full on ${commenced.displayDate}.`;
    used = [adopted, signed, commenced];
  } else {
    const bnRau = POL_CP002_ROLE_ROWS_V1.find((item) => item.id === "bn-rau")!;
    const drafting = POL_CP002_MILESTONES_V1.find((item) => item.id === "drafting-committee-appointed")!;
    const draft = POL_CP002_MILESTONES_V1.find((item) => item.id === "draft-submitted")!;
    const adopted = POL_CP002_MILESTONES_V1.find((item) => item.id === "constitution-adopted")!;
    stem = "Which option best represents the correct sequence in the preparation of the Constitution?";
    correct = "B. N. Rau prepared a rough draft → Drafting Committee scrutinised and revised the draft → Draft Constitution was submitted in February 1948 → Constitution was adopted in November 1949";
    const candidates = [
      correct,
      "Drafting Committee was appointed → Constitution was adopted → B. N. Rau prepared a rough draft → Draft Constitution was submitted",
      "Draft Constitution was submitted → B. N. Rau prepared a rough draft → Drafting Committee was appointed → Constitution was adopted",
      "B. N. Rau prepared a rough draft → Constitution was adopted → Drafting Committee was appointed → Draft Constitution was submitted",
    ];
    options = moveCorrect(deterministicShuffle(candidates, `${qlId}:process`), correct, correctTarget);
    explanation = `B. N. Rau prepared a rough draft for the Drafting Committee. The Drafting Committee was appointed on ${drafting.displayDate}, submitted its Draft on ${draft.displayDate}, and the Constitution was adopted on ${adopted.displayDate}.`;
    used = [bnRau, drafting, draft, adopted];
  }

  const sourceMeta = metadata(used);
  const semanticSignature = [qlId, correct, [...sourceMeta.sourceFactIds].sort().join(",")].join("|");

  return {
    questionId: `POL-CP002-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-002",
    qlId,
    qlName: qlNames[ql],
    difficulty,
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    ...sourceMeta,
    semanticSignature,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generatePolCp002ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 3,
    2: 3,
    3: 4,
    4: 4,
    5: 4,
    6: 4,
    7: 4,
    8: 1,
    9: 3,
    10: 4,
    11: 3,
    12: 3,
    13: 4,
    14: 4,
    15: 1,
    16: 1,
  };

  const questions: PolCp002ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 16; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex + ql, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
