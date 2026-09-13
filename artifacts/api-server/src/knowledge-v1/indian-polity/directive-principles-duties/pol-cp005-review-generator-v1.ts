import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  POL_CP005_AMENDMENT_LINKS_V1,
  POL_CP005_ARTICLE39_CLAUSES_V1,
  POL_CP005_BOUNDARY_FACTS_V1,
  POL_CP005_DPSP_ARTICLES_V1,
  POL_CP005_DUTIES_V1,
  type PolCp005Sourced,
} from "./pol-cp005-facts";
import type { PolCp005ReviewQuestion } from "./pol-cp005-review-types";

const qlNames: Record<number, string> = {
  1: "DPSP Article to subject",
  2: "DPSP subject to Article",
  3: "Nature and application of Directive Principles",
  4: "Article 39 clause mapping",
  5: "Social and economic Directive Principles",
  6: "High-yield DPSP Article identification",
  7: "Environment, public health and agriculture",
  8: "Directive Principles added by amendments",
  9: "Amendment to constitutional addition",
  10: "Part IV and Part IVA boundaries",
  11: "Fundamental Duty clause to duty",
  12: "Fundamental Duty to clause",
  13: "Identify a Fundamental Duty",
  14: "Identify what is not a Fundamental Duty",
  15: "History of Fundamental Duties",
  16: "Article 45 and Article 51A(k) education distinction",
  17: "State directive versus citizen duty",
  18: "DPSP multi-statement evaluation",
  19: "Fundamental Duties multi-statement evaluation",
  20: "Integrated DPSP and Fundamental Duties evaluation",
};

const difficultyForQl = (ql: number): KnowledgeV1Difficulty => {
  if ([1, 2, 6, 10, 11].includes(ql)) return "Easy";
  if ([17, 18, 19, 20].includes(ql)) return "Hard";
  return "Medium";
};

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

function metadata(items: readonly PolCp005Sourced[]) {
  return {
    sourceIds: [...new Set(items.flatMap((item) => [...item.sourceIds]))],
    sourceFactIds: [...new Set(items.flatMap((item) => [...item.sourceFactIds]))],
  };
}

const dpsp = (article: string) => POL_CP005_DPSP_ARTICLES_V1.find((row) => row.article === article)!;
const duty = (clause: string) => POL_CP005_DUTIES_V1.find((row) => row.clause === clause)!;

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): PolCp005ReviewQuestion {
  const qlId = `POL-005-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let used: PolCp005Sourced[] = [];

  if (ql === 1) {
    const rows = POL_CP005_DPSP_ARTICLES_V1.filter((row) => !["36", "37"].includes(row.article));
    const row = rows[(rowIndex * 3) % rows.length];
    stem = `Article ${row.article} deals with:`;
    correct = row.subject;
    options = chooseFour(rows.map((item) => item.subject), correct, `${qlId}:${row.article}`, correctTarget);
    explanation = row.simpleRule;
    used = [row];
  } else if (ql === 2) {
    const rows = POL_CP005_DPSP_ARTICLES_V1.filter((row) => !["36", "37"].includes(row.article));
    const row = rows[(rowIndex * 4 + 1) % rows.length];
    stem = `${row.subject} is provided under:`;
    correct = `Article ${row.article}`;
    options = chooseFour(rows.map((item) => `Article ${item.article}`), correct, `${qlId}:${row.article}`, correctTarget);
    explanation = row.simpleRule;
    used = [row];
  } else if (ql === 3) {
    const variants = [
      {
        stem: "Which statement about Directive Principles is correct?",
        correct: "They are not enforceable by courts but are fundamental in governance.",
        wrong: ["They are enforceable in the same way as Fundamental Rights.", "They apply only during a national emergency.", "They are contained in Part III of the Constitution."],
        explanation: dpsp("37").simpleRule,
      },
      {
        stem: "Article 37 describes Directive Principles as:",
        correct: "Non-justiciable but fundamental in the governance of the country",
        wrong: ["Legally enforceable against every private person", "Temporary provisions that expire after ten years", "Judicial remedies enforceable only by the Supreme Court"],
        explanation: dpsp("37").simpleRule,
      },
      {
        stem: "Under Article 37, applying Directive Principles while making laws is:",
        correct: "A duty of the State",
        wrong: ["A duty only of the judiciary", "Optional only for local governments", "A duty only during financial emergency"],
        explanation: dpsp("37").simpleRule,
      },
    ];
    const row = variants[rowIndex % variants.length];
    stem = row.stem; correct = row.correct; options = moveCorrect([correct, ...row.wrong], correct, correctTarget); explanation = row.explanation; used = [dpsp("37")];
  } else if (ql === 4) {
    const row = POL_CP005_ARTICLE39_CLAUSES_V1[rowIndex % POL_CP005_ARTICLE39_CLAUSES_V1.length];
    stem = `${row.clause} is related to:`;
    correct = row.subject;
    options = chooseFour(POL_CP005_ARTICLE39_CLAUSES_V1.map((item) => item.subject), correct, `${qlId}:${row.clause}`, correctTarget);
    explanation = `${row.clause} deals with ${row.subject.toLowerCase()}.`;
    used = [row];
  } else if (ql === 5) {
    const rows = [dpsp("38"), dpsp("41"), dpsp("42"), dpsp("43")];
    const row = rows[rowIndex % rows.length];
    stem = `Which Article is correctly matched with its Directive Principle?`;
    correct = `Article ${row.article} — ${row.subject}`;
    const wrong = rows.filter((item) => item.article !== row.article).map((item, index) => {
      const donor = rows[(index + rowIndex + 1) % rows.length];
      return `Article ${item.article} — ${donor.subject}`;
    });
    options = chooseFour([correct, ...wrong, ...rows.map((item) => `Article ${item.article} — ${item.subject}`)], correct, `${qlId}:${row.article}`, correctTarget);
    explanation = row.simpleRule;
    used = [row];
  } else if (ql === 6) {
    const rows = [dpsp("40"), dpsp("44"), dpsp("50"), dpsp("51")];
    const row = rows[rowIndex % rows.length];
    stem = `${row.subject} is connected with:`;
    correct = `Article ${row.article}`;
    options = chooseFour(rows.map((item) => `Article ${item.article}`), correct, `${qlId}:${row.article}`, correctTarget);
    explanation = row.simpleRule;
    used = [row];
  } else if (ql === 7) {
    const rows = [dpsp("47"), dpsp("48"), dpsp("48A"), dpsp("49")];
    const row = rows[rowIndex % rows.length];
    stem = `Article ${row.article} deals with:`;
    correct = row.subject;
    options = chooseFour(rows.map((item) => item.subject), correct, `${qlId}:${row.article}`, correctTarget);
    explanation = row.simpleRule;
    used = [row];
  } else if (ql === 8) {
    const rows = [dpsp("39A"), dpsp("43A"), dpsp("48A")];
    const row = rows[rowIndex % rows.length];
    stem = `${row.subject} was added by the:`;
    correct = "Forty-second Amendment";
    options = moveCorrect([correct, "Forty-fourth Amendment", "Eighty-sixth Amendment", "Ninety-seventh Amendment"], correct, correctTarget);
    explanation = `The Forty-second Amendment added Article ${row.article}.`;
    used = [row];
  } else if (ql === 9) {
    const row = POL_CP005_AMENDMENT_LINKS_V1[rowIndex % POL_CP005_AMENDMENT_LINKS_V1.length];
    stem = `${row.amendment} is correctly linked with:`;
    correct = row.additions;
    options = chooseFour(POL_CP005_AMENDMENT_LINKS_V1.map((item) => item.additions), correct, `${qlId}:${row.amendment}`, correctTarget);
    explanation = `${row.amendment}: ${row.additions}.`;
    used = [row];
  } else if (ql === 10) {
    const variants = [
      ["Directive Principles of State Policy are contained in:", "Part IV", "Part III", "Part IVA", "Part V"],
      ["Fundamental Duties are contained in:", "Part IVA", "Part IV", "Part III", "Part II"],
      ["Fundamental Duties are listed under:", "Article 51A", "Article 50", "Article 51", "Article 52"],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length]; stem = s; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = rowIndex % 3 === 0 ? POL_CP005_BOUNDARY_FACTS_V1[0].statement : rowIndex % 3 === 1 ? POL_CP005_BOUNDARY_FACTS_V1[2].statement : "Fundamental Duties are listed in Article 51A in Part IVA.";
    used = [POL_CP005_BOUNDARY_FACTS_V1[rowIndex % 3 === 0 ? 0 : 2]];
  } else if (ql === 11) {
    const row = POL_CP005_DUTIES_V1[(rowIndex * 2) % POL_CP005_DUTIES_V1.length];
    stem = `${row.clause} requires a citizen to:`;
    correct = row.duty;
    options = chooseFour(POL_CP005_DUTIES_V1.map((item) => item.duty), correct, `${qlId}:${row.clause}`, correctTarget);
    explanation = `${row.clause}: ${row.duty}.`;
    used = [row];
  } else if (ql === 12) {
    const row = POL_CP005_DUTIES_V1[(rowIndex * 2 + 1) % POL_CP005_DUTIES_V1.length];
    stem = `The duty to ${row.duty.charAt(0).toLowerCase()}${row.duty.slice(1)} is in:`;
    correct = row.clause;
    options = chooseFour(POL_CP005_DUTIES_V1.map((item) => item.clause), correct, `${qlId}:${row.clause}`, correctTarget);
    explanation = `${row.clause}: ${row.duty}.`;
    used = [row];
  } else if (ql === 13) {
    const row = POL_CP005_DUTIES_V1[rowIndex % POL_CP005_DUTIES_V1.length];
    stem = "Which of the following is a Fundamental Duty?";
    correct = row.duty;
    options = moveCorrect([correct, "To vote in every election", "To pay every tax directly listed in the Constitution", "To join the armed forces for a fixed period"], correct, correctTarget);
    explanation = `${row.clause}: ${row.duty}.`;
    used = [row];
  } else if (ql === 14) {
    const notDuty = ["Voting in every election", "Paying taxes as an expressly listed Fundamental Duty", "Compulsory military service for every adult citizen"][rowIndex % 3];
    stem = "Which of the following is NOT expressly listed as a Fundamental Duty in Article 51A?";
    correct = notDuty;
    const real = POL_CP005_DUTIES_V1.slice(rowIndex, rowIndex + 3).map((item) => item.duty);
    options = moveCorrect([correct, ...real], correct, correctTarget);
    explanation = `${notDuty} is not expressly listed in Article 51A.`;
    used = [POL_CP005_BOUNDARY_FACTS_V1[3]];
  } else if (ql === 15) {
    const variants = [
      ["Fundamental Duties were inserted into the Constitution by the:", "Forty-second Amendment", "Forty-fourth Amendment", "Eighty-sixth Amendment", "Ninety-seventh Amendment"],
      ["How many Fundamental Duties were originally added by the Forty-second Amendment?", "10", "8", "11", "12"],
      ["The eleventh Fundamental Duty, Article 51A(k), was added by the:", "Eighty-sixth Amendment", "Forty-second Amendment", "Forty-fourth Amendment", "Ninety-seventh Amendment"],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length]; stem = s; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = POL_CP005_BOUNDARY_FACTS_V1[4].statement;
    used = [POL_CP005_BOUNDARY_FACTS_V1[4]];
  } else if (ql === 16) {
    const variants = [
      ["Article 45 now deals with:", "Early childhood care and education below six years", "Free and compulsory education from six to fourteen years", "Equal justice and free legal aid", "Village panchayats"],
      ["A parent's or guardian's duty to provide education opportunities to a child aged six to fourteen is under:", "Article 51A(k)", "Article 45", "Article 39A", "Article 43A"],
      ["The Eighty-sixth Amendment changed Article 45 and also added:", "Article 51A(k)", "Article 48A", "Article 43B", "Article 39A"],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length]; stem = s; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = "The Eighty-sixth Amendment gave Article 45 its present early-childhood focus and added Fundamental Duty 51A(k) for parents or guardians of children aged six to fourteen.";
    used = [dpsp("45"), duty("51A(k)")];
  } else if (ql === 17) {
    const variants = [
      ["Protect and improve the natural environment", "Both a State directive and a citizen duty", "Only a Fundamental Right", "Only a State directive", "Only a citizen duty"],
      ["Organise village panchayats", "A Directive Principle for the State", "A Fundamental Duty of every citizen", "A Fundamental Right of citizens", "A constitutional duty of the Supreme Court"],
      ["Develop scientific temper", "A Fundamental Duty of citizens", "A Directive Principle for the State", "A Fundamental Right", "A power of the President"],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length]; stem = `${s} is:`; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = rowIndex % 3 === 0 ? "Article 48A directs the State to protect the environment, while Article 51A(g) makes environmental protection a Fundamental Duty of citizens." : rowIndex % 3 === 1 ? dpsp("40").simpleRule : `${duty("51A(h)").clause}: ${duty("51A(h)").duty}.`;
    used = rowIndex % 3 === 0 ? [dpsp("48A"), duty("51A(g)")] : rowIndex % 3 === 1 ? [dpsp("40")] : [duty("51A(h)")];
  } else if (ql === 18) {
    const blocks = [
      ["Article 40 concerns village panchayats.", "Article 44 concerns a uniform civil code.", "Article 50 concerns separation of judiciary from executive."],
      ["Article 39A concerns equal justice and free legal aid.", "Article 43A concerns workers' participation in management.", "Article 48A concerns protection of environment, forests and wildlife."],
      ["Article 47 concerns public health.", "Article 49 concerns monuments of national importance.", "Article 51 concerns international peace and security."],
    ];
    const ss = blocks[rowIndex % blocks.length];
    stem = `Consider the following statements:\n1. ${ss[0]}\n2. ${ss[1]}\n3. ${ss[2]}\nHow many statements are correct?`;
    correct = "All three";
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = "All three Article–subject pairs are correct.";
    used = rowIndex % 3 === 0 ? [dpsp("40"), dpsp("44"), dpsp("50")] : rowIndex % 3 === 1 ? [dpsp("39A"), dpsp("43A"), dpsp("48A")] : [dpsp("47"), dpsp("49"), dpsp("51")];
  } else if (ql === 19) {
    const blocks = [
      ["Respect the National Flag and National Anthem is a Fundamental Duty.", "Protect the natural environment is a Fundamental Duty.", "Develop scientific temper is a Fundamental Duty."],
      ["Safeguard public property is a Fundamental Duty.", "Strive towards excellence is a Fundamental Duty.", "Voting in every election is expressly listed as a Fundamental Duty."],
      ["Article 51A(k) concerns education opportunities for children aged six to fourteen.", "It was added by the Eighty-sixth Amendment.", "It was one of the original ten duties added in 1976."],
    ];
    const ss = blocks[rowIndex % blocks.length];
    stem = `Consider the following statements:\n1. ${ss[0]}\n2. ${ss[1]}\n3. ${ss[2]}\nHow many statements are correct?`;
    correct = rowIndex % 3 === 0 ? "All three" : "Only two";
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = rowIndex % 3 === 0 ? "All three are listed Fundamental Duties." : rowIndex % 3 === 1 ? "Statements 1 and 2 are correct. Voting is not expressly listed in Article 51A." : "Statements 1 and 2 are correct. Article 51A(k) was added later by the Eighty-sixth Amendment.";
    used = rowIndex % 3 === 2 ? [duty("51A(k)"), POL_CP005_BOUNDARY_FACTS_V1[4]] : [POL_CP005_BOUNDARY_FACTS_V1[3]];
  } else {
    const blocks = [
      ["Directive Principles are non-justiciable.", "Fundamental Duties are in Part IVA.", "Article 48A and Article 51A(g) both concern environmental protection."],
      ["Article 45 deals with early childhood care below six years.", "Article 51A(k) concerns education opportunities for children aged six to fourteen.", "Both provisions were given their present form by the Eighty-sixth Amendment."],
      ["Article 43B concerns co-operative societies.", "It was added by the Ninety-seventh Amendment.", "Fundamental Duties are contained in Part IV."],
    ];
    const ss = blocks[rowIndex % blocks.length];
    stem = `Consider the following statements:\n1. ${ss[0]}\n2. ${ss[1]}\n3. ${ss[2]}\nHow many statements are correct?`;
    correct = rowIndex % 3 === 2 ? "Only two" : "All three";
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = rowIndex % 3 === 2 ? "Statements 1 and 2 are correct. Fundamental Duties are in Part IVA, not Part IV." : "All three statements are correct.";
    used = rowIndex % 3 === 0 ? [dpsp("37"), duty("51A(g)"), dpsp("48A")] : rowIndex % 3 === 1 ? [dpsp("45"), duty("51A(k)")] : [dpsp("43B"), POL_CP005_BOUNDARY_FACTS_V1[2]];
  }

  const sourceMeta = metadata(used);
  return {
    questionId: `POL-CP005-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-005",
    qlId,
    qlName: qlNames[ql],
    difficulty: difficultyForQl(ql),
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

export function generatePolCp005ReviewBatchV1() {
  const countsByQl: Record<number, number> = {
    1: 5, 2: 5, 3: 3, 4: 5, 5: 4,
    6: 4, 7: 4, 8: 3, 9: 3, 10: 3,
    11: 5, 12: 5, 13: 4, 14: 3, 15: 3,
    16: 3, 17: 3, 18: 3, 19: 3, 20: 3,
  };
  const questions: PolCp005ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 20; ql += 1) {
    for (let rowIndex = 0; rowIndex < countsByQl[ql]; rowIndex += 1) {
      questions.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return questions;
}
