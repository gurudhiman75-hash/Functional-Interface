import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  POL_CP003_ARTICLE5_CONDITIONS_V1,
  POL_CP003_ARTICLE6_RULES_V1,
  POL_CP003_CITIZENSHIP_ARTICLES_V1,
  POL_CP003_PREAMBLE_OBJECTIVES_V1,
  POL_CP003_PREAMBLE_STATUS_TERMS_V1,
  POL_CP003_SCENARIO_ROWS_V1,
  POL_CP003_UNION_ARTICLES_V1,
  type PolCp003Sourced,
} from "./pol-cp003-facts";
import type { PolCp003ReviewQuestion } from "./pol-cp003-review-types";

const qlNames: Record<number, string> = {
  1: "Identify a Preamble objective from its constitutional wording",
  2: "Identify the constitutional wording attached to a Preamble objective",
  3: "Distinguish original and current Preamble status terms",
  4: "Identify the Forty-second Amendment's Preamble changes",
  5: "Map Articles 1–4 to their constitutional subjects",
  6: "Identify the Article from a Union-and-territory provision",
  7: "Test the components of the territory of India under Article 1",
  8: "Apply Article 3 to State reorganisation procedure",
  9: "Distinguish Article 4 laws from Article 368 amendments",
  10: "Map Articles 5–11 to citizenship subjects",
  11: "Identify the citizenship Article from its constitutional rule",
  12: "Evaluate Article 5 commencement-citizenship conditions",
  13: "Classify commencement-citizenship scenarios under Articles 5–8",
  14: "Distinguish Articles 9, 10 and 11",
  15: "Integrated multi-statement evaluation across the CP",
  16: "Integrated Preamble–Union–Citizenship comparison",
};

function difficultyForQl(ql: number): KnowledgeV1Difficulty {
  if ([1, 2, 3, 4].includes(ql)) return "Easy";
  if ([5, 6, 7, 8, 9, 10, 11].includes(ql)) return "Medium";
  return "Hard";
}

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const wrong = deterministicShuffle(
    [...new Set(values.filter((value) => value !== correct))],
    seed,
  ).slice(0, 3);
  if (wrong.length < 3) throw new Error(`Insufficient distractors for ${seed}`);
  return moveCorrect(
    deterministicShuffle([...wrong, correct], `${seed}:options`),
    correct,
    target,
  );
}

function metadata(items: readonly PolCp003Sourced[]) {
  return {
    sourceIds: [...new Set(items.flatMap((item) => [...item.sourceIds]))],
    sourceFactIds: [...new Set(items.flatMap((item) => [...item.sourceFactIds]))],
  };
}

const articleLabel = (article: number) => `Article ${article}`;

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): PolCp003ReviewQuestion {
  const qlId = `POL-003-QL-${String(ql).padStart(3, "0")}`;
  const difficulty = difficultyForQl(ql);
  const correctTarget = globalIndex % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let used: PolCp003Sourced[] = [];

  if (ql === 1) {
    const row = POL_CP003_PREAMBLE_OBJECTIVES_V1[rowIndex % POL_CP003_PREAMBLE_OBJECTIVES_V1.length];
    stem = `Which Preamble objective is expressed through the words “${row.wording}”?`;
    correct = row.concept;
    options = chooseFour(POL_CP003_PREAMBLE_OBJECTIVES_V1.map((item) => item.concept), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `In the Preamble, ${row.concept} is linked with ${row.wording}.`;
    used = [row];
  } else if (ql === 2) {
    const row = POL_CP003_PREAMBLE_OBJECTIVES_V1[rowIndex % POL_CP003_PREAMBLE_OBJECTIVES_V1.length];
    stem = `Which wording in the Preamble is attached to ${row.concept}?`;
    correct = row.wording;
    options = chooseFour(POL_CP003_PREAMBLE_OBJECTIVES_V1.map((item) => item.wording), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `The Preamble connects ${row.concept} with ${row.wording}.`;
    used = [row];
  } else if (ql === 3) {
    const modes = rowIndex % 3;
    const source = POL_CP003_PREAMBLE_STATUS_TERMS_V1;
    if (modes === 0) {
      stem = "Which pair of words was not part of the original Preamble adopted in 1949?";
      correct = "Socialist and Secular";
      options = moveCorrect([
        "Socialist and Secular",
        "Sovereign and Democratic",
        "Democratic and Republic",
        "Sovereign and Republic",
      ], correct, correctTarget);
      explanation = "The original formulation was ‘Sovereign Democratic Republic’. ‘Socialist’ and ‘Secular’ were added later by the Forty-second Amendment.";
    } else if (modes === 1) {
      stem = "Which expression correctly states the present constitutional description of India in the Preamble?";
      correct = "Sovereign Socialist Secular Democratic Republic";
      options = moveCorrect([
        correct,
        "Sovereign Federal Secular Democratic Republic",
        "Socialist Secular Parliamentary Federation",
        "Sovereign Socialist Democratic Federation",
      ], correct, correctTarget);
      explanation = "The present Preamble describes India as a Sovereign Socialist Secular Democratic Republic.";
    } else {
      stem = "Which one of the following words formed part of the original Preamble adopted in 1949?";
      correct = "Democratic";
      options = moveCorrect(["Democratic", "Socialist", "Secular", "Integrity"], correct, correctTarget);
      explanation = "‘Democratic’ formed part of the original Preamble. ‘Socialist’, ‘Secular’ and the reference to ‘integrity’ were introduced by the Forty-second Amendment.";
    }
    used = [source];
  } else if (ql === 4) {
    const source = POL_CP003_PREAMBLE_STATUS_TERMS_V1;
    const modes = rowIndex % 3;
    if (modes === 0) {
      stem = "Which constitutional amendment inserted the words ‘Socialist’ and ‘Secular’ into the Preamble?";
      correct = "Forty-second Amendment";
      options = moveCorrect(["Forty-second Amendment", "Twenty-fourth Amendment", "Forty-fourth Amendment", "Fifty-second Amendment"], correct, correctTarget);
      explanation = "The Constitution (Forty-second Amendment) Act, 1976 inserted ‘Socialist’ and ‘Secular’ into the Preamble.";
    } else if (modes === 1) {
      stem = "What change did the Forty-second Amendment make to the Preamble's fraternity clause?";
      correct = "It changed ‘unity of the Nation’ to ‘unity and integrity of the Nation’.";
      options = moveCorrect([
        correct,
        "It replaced ‘dignity of the individual’ with ‘dignity of citizens’.",
        "It removed the reference to unity of the Nation.",
        "It added the word ‘federal’ before ‘Nation’.",
      ], correct, correctTarget);
      explanation = source.integrityChange;
    } else {
      stem = "Which set contains only changes made to the Preamble by the Forty-second Amendment?";
      correct = "Socialist, Secular, and integrity";
      options = moveCorrect([
        correct,
        "Democratic, Republic, and liberty",
        "Sovereign, Socialist, and equality",
        "Republic, integrity, and justice",
      ], correct, correctTarget);
      explanation = "The Forty-second Amendment added ‘Socialist’ and ‘Secular’ and changed ‘unity of the Nation’ to ‘unity and integrity of the Nation’.";
    }
    used = [source];
  } else if (ql === 5) {
    const row = POL_CP003_UNION_ARTICLES_V1[rowIndex % POL_CP003_UNION_ARTICLES_V1.length];
    stem = `What is the principal subject of Article ${row.article}?`;
    correct = row.subject;
    options = chooseFour(POL_CP003_UNION_ARTICLES_V1.map((item) => item.subject), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `Article ${row.article} deals with ${row.subject.toLowerCase()}.`;
    used = [row];
  } else if (ql === 6) {
    const row = POL_CP003_UNION_ARTICLES_V1[rowIndex % POL_CP003_UNION_ARTICLES_V1.length];
    stem = `Which Article contains the rule on ${row.subject.toLowerCase()}?`;
    correct = articleLabel(row.article);
    options = chooseFour(POL_CP003_UNION_ARTICLES_V1.map((item) => articleLabel(item.article)), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${articleLabel(row.article)} deals with ${row.subject.toLowerCase()}.`;
    used = [row];
  } else if (ql === 7) {
    const row = POL_CP003_UNION_ARTICLES_V1[0];
    const modes = rowIndex % 4;
    if (modes === 0) {
      stem = "Under Article 1, which of the following forms part of the territory of India?";
      correct = "Territories of the States, Union territories in the First Schedule, and territories that may be acquired";
      options = moveCorrect([
        correct,
        "Only the territories of the States",
        "Only States and Union territories, never acquired territory",
        "States and territories administered by neighbouring countries",
      ], correct, correctTarget);
    } else if (modes === 1) {
      stem = "Article 1 describes India as:";
      correct = "a Union of States";
      options = moveCorrect(["a Union of States", "a Federation of Provinces", "a Confederation of States", "a Union of Republics"], correct, correctTarget);
    } else if (modes === 2) {
      stem = "Which Schedule is expressly linked by Article 1 with the States and Union territories?";
      correct = "First Schedule";
      options = moveCorrect(["First Schedule", "Second Schedule", "Fourth Schedule", "Seventh Schedule"], correct, correctTarget);
    } else {
      stem = "Which statement correctly reflects Article 1 of the Constitution?";
      correct = "India and Bharat are constitutionally used in the expression ‘India, that is Bharat’.";
      options = moveCorrect([
        correct,
        "Only the name Bharat is constitutionally recognised.",
        "Only the name India is constitutionally recognised.",
        "The Constitution describes India as a confederation.",
      ], correct, correctTarget);
    }
    explanation = row.rule;
    used = [row];
  } else if (ql === 8) {
    const row = POL_CP003_UNION_ARTICLES_V1[2];
    const modes = rowIndex % 4;
    if (modes === 0) {
      stem = "A Bill under Article 3 to alter the boundary of an existing State may be introduced only on whose recommendation?";
      correct = "The President";
      options = moveCorrect(["The President", "The Prime Minister", "The Speaker of the Lok Sabha", "The Chief Justice of India"], correct, correctTarget);
    } else if (modes === 1) {
      stem = "When a proposal under Article 3 affects a State, what must the President do before Parliament considers the Bill?";
      correct = "Refer it to the State Legislature for expressing its views within the specified period";
      options = moveCorrect([
        correct,
        "Obtain the State Legislature's binding consent",
        "Refer it to the Supreme Court for approval",
        "Put the proposal to a statewide referendum",
      ], correct, correctTarget);
    } else if (modes === 2) {
      stem = "Which of the following can Parliament do under Article 3?";
      correct = "Alter the name of an existing State";
      options = moveCorrect([
        correct,
        "Amend the basic structure of the Constitution by ordinary law",
        "Abolish Parliament itself",
        "Change a Fundamental Right without using the amendment process",
      ], correct, correctTarget);
    } else {
      stem = "Under Article 3, the affected State Legislature's role is best described as:";
      correct = "expressing its views on the proposal referred by the President";
      options = moveCorrect([
        correct,
        "giving a constitutionally binding veto",
        "ratifying the Bill after Parliament passes it",
        "authorising the President to introduce the Bill",
      ], correct, correctTarget);
    }
    explanation = row.rule;
    used = [row];
  } else if (ql === 9) {
    const row = POL_CP003_UNION_ARTICLES_V1[3];
    const modes = rowIndex % 4;
    if (modes === 0) {
      stem = "A law made under Articles 2 or 3 may make necessary changes to which Schedules under Article 4?";
      correct = "First and Fourth Schedules";
      options = moveCorrect(["First and Fourth Schedules", "Second and Third Schedules", "Fifth and Sixth Schedules", "Seventh and Eighth Schedules"], correct, correctTarget);
    } else if (modes === 1) {
      stem = "For the purposes of Article 368, a law made under Articles 2 or 3 and covered by Article 4 is:";
      correct = "not deemed to be a constitutional amendment";
      options = moveCorrect([
        correct,
        "always treated as a constitutional amendment requiring special majority",
        "valid only after ratification by half the States",
        "treated as an amendment only when a State name is changed",
      ], correct, correctTarget);
    } else if (modes === 2) {
      stem = "Which Article allows supplemental, incidental and consequential provisions in laws made under Articles 2 and 3?";
      correct = "Article 4";
      options = moveCorrect(["Article 4", "Article 1", "Article 2", "Article 3"], correct, correctTarget);
    } else {
      stem = "Which statement correctly distinguishes Article 4 from Article 368?";
      correct = "Article 4 says qualifying laws under Articles 2 and 3 are not deemed constitutional amendments for Article 368 purposes.";
      options = moveCorrect([
        correct,
        "Article 4 requires every State-reorganisation law to follow Article 368.",
        "Article 4 removes Parliament's power to amend the First Schedule.",
        "Article 4 applies only to Fundamental Rights amendments.",
      ], correct, correctTarget);
    }
    explanation = row.rule;
    used = [row];
  } else if (ql === 10) {
    const row = POL_CP003_CITIZENSHIP_ARTICLES_V1[rowIndex % POL_CP003_CITIZENSHIP_ARTICLES_V1.length];
    stem = `What is the subject of Article ${row.article} in Part II of the Constitution?`;
    correct = row.subject;
    options = chooseFour(POL_CP003_CITIZENSHIP_ARTICLES_V1.map((item) => item.subject), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `Article ${row.article} deals with ${row.subject.toLowerCase()}.`;
    used = [row];
  } else if (ql === 11) {
    const row = POL_CP003_CITIZENSHIP_ARTICLES_V1[rowIndex % POL_CP003_CITIZENSHIP_ARTICLES_V1.length];
    stem = `Which Article is described by the following rule? ${row.rule}`;
    correct = articleLabel(row.article);
    options = chooseFour(POL_CP003_CITIZENSHIP_ARTICLES_V1.map((item) => articleLabel(item.article)), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = `${articleLabel(row.article)}: ${row.subject}.`;
    used = [row];
  } else if (ql === 12) {
    const row = POL_CP003_CITIZENSHIP_ARTICLES_V1[0];
    const falsePool = [
      "Domicile in India was irrelevant under Article 5.",
      "Article 5 required ten years of ordinary residence in every case.",
      "Only birth in India could qualify a person under Article 5.",
      "Article 5 dealt only with citizenship acquired after 1950.",
    ];
    const trueStatements = POL_CP003_ARTICLE5_CONDITIONS_V1;
    const mode = rowIndex % 3;
    const statements = mode === 0
      ? [trueStatements[0], trueStatements[1], falsePool[1]]
      : mode === 1
        ? [trueStatements[0], trueStatements[2], trueStatements[3]]
        : [falsePool[0], trueStatements[3], falsePool[2]];
    const count = mode === 0 ? 2 : mode === 1 ? 3 : 1;
    stem = `Consider the following statements about Article 5:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nHow many of the statements are correct?`;
    correct = ["None", "Only one", "Only two", "All three"][count];
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = row.rule;
    used = [row];
  } else if (ql === 13) {
    const row = POL_CP003_SCENARIO_ROWS_V1[rowIndex % POL_CP003_SCENARIO_ROWS_V1.length];
    stem = `${row.scenario}\nWhich Article most directly governs this situation?`;
    correct = articleLabel(row.article);
    options = chooseFour(POL_CP003_SCENARIO_ROWS_V1.map((item) => articleLabel(item.article)), correct, `${qlId}:${row.id}`, correctTarget);
    explanation = row.explanation;
    used = [row];
  } else if (ql === 14) {
    const rows = POL_CP003_CITIZENSHIP_ARTICLES_V1.filter((item) => [9, 10, 11].includes(item.article));
    const row = rows[rowIndex % rows.length];
    stem = `Which Article deals with ${row.subject.toLowerCase()}?`;
    correct = articleLabel(row.article);
    options = moveCorrect([
      articleLabel(9),
      articleLabel(10),
      articleLabel(11),
      articleLabel(8),
    ], correct, correctTarget);
    explanation = row.rule;
    used = [row];
  } else if (ql === 15) {
    const union3 = POL_CP003_UNION_ARTICLES_V1[2];
    const citizen11 = POL_CP003_CITIZENSHIP_ARTICLES_V1[6];
    const preamble = POL_CP003_PREAMBLE_STATUS_TERMS_V1;
    const mode = rowIndex % 2;
    const statements = mode === 0
      ? [
          "The Preamble currently describes India as a Sovereign Socialist Secular Democratic Republic.",
          "Article 3 gives an affected State Legislature a binding veto over a State-reorganisation Bill.",
          "Article 11 preserves Parliament's power to legislate on acquisition and termination of citizenship.",
        ]
      : [
          "A law covered by Article 4 is not deemed a constitutional amendment for Article 368 purposes.",
          "Article 8 concerns certain persons of Indian origin residing outside India.",
          "The words Socialist and Secular formed part of the original Preamble adopted in 1949.",
        ];
    correct = "Only two";
    stem = `Consider the following statements:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nHow many of the statements are correct?`;
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = mode === 0
      ? "Statements 1 and 3 are correct. Under Article 3 the State Legislature expresses its views; its consent is not made a binding condition by the Article."
      : "Statements 1 and 2 are correct. ‘Socialist’ and ‘Secular’ were inserted by the Forty-second Amendment, not by the original Preamble.";
    used = [union3, citizen11, preamble];
  } else {
    const a4 = POL_CP003_UNION_ARTICLES_V1[3];
    const a11 = POL_CP003_CITIZENSHIP_ARTICLES_V1[6];
    const preamble = POL_CP003_PREAMBLE_STATUS_TERMS_V1;
    stem = "Which option correctly distinguishes three constitutional ideas in this CP?";
    correct = "Preamble — constitutional ideals; Article 4 — consequences of laws under Articles 2 and 3; Article 11 — Parliament's legislative power over citizenship";
    options = moveCorrect([
      correct,
      "Preamble — acquisition of citizenship; Article 4 — Fundamental Rights; Article 11 — State boundaries",
      "Preamble — State reorganisation procedure; Article 4 — citizenship at commencement; Article 11 — constitutional amendment procedure",
      "Preamble — parliamentary privileges; Article 4 — emergency powers; Article 11 — judicial review",
    ], correct, correctTarget);
    explanation = "The Preamble states the Constitution's foundational ideals; Article 4 governs consequential provisions of laws under Articles 2 and 3; Article 11 preserves Parliament's power to legislate on citizenship.";
    used = [a4, a11, preamble];
  }

  const sourceMeta = metadata(used);
  return {
    questionId: `POL-CP003-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-003",
    qlId,
    qlName: qlNames[ql],
    difficulty,
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    ...sourceMeta,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generatePolCp003ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 4,
    2: 4,
    3: 3,
    4: 3,
    5: 4,
    6: 4,
    7: 4,
    8: 4,
    9: 4,
    10: 3,
    11: 3,
    12: 3,
    13: 3,
    14: 3,
    15: 2,
    16: 1,
  };

  const questions: PolCp003ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 16; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex + ql, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
