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

const QL_NAMES: Record<number, string> = {
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

const dpsp = (article: string) => POL_CP005_DPSP_ARTICLES_V1.find((row) => row.article === article)!;
const duty = (clause: string) => POL_CP005_DUTIES_V1.find((row) => row.clause === clause)!;

function metadata(items: readonly PolCp005Sourced[]) {
  return {
    sourceIds: [...new Set(items.flatMap((item) => [...item.sourceIds]))],
    sourceFactIds: [...new Set(items.flatMap((item) => [...item.sourceFactIds]))],
  };
}

function moveCorrect(options: string[], correct: string, target: number) {
  const current = options.indexOf(correct);
  if (current < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[current], options[target]] = [options[target], options[current]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const wrong = deterministicShuffle([...new Set(values.filter((value) => value !== correct))], seed).slice(0, 3);
  if (wrong.length < 3) throw new Error(`Insufficient distractors for ${seed}`);
  return moveCorrect(deterministicShuffle([...wrong, correct], `${seed}:options`), correct, target);
}

export function generatePolCp005ReviewBatchV2(): PolCp005ReviewQuestion[] {
  const questions: PolCp005ReviewQuestion[] = [];

  const add = (
    ql: number,
    stem: string,
    correct: string,
    candidates: readonly string[],
    explanation: string,
    used: readonly PolCp005Sourced[],
    seed: string,
  ) => {
    const globalIndex = questions.length;
    const target = globalIndex % 4;
    const options = chooseFour(candidates, correct, `POL-005-QL-${String(ql).padStart(3, "0")}:${seed}`, target);
    const sourceMeta = metadata(used);
    questions.push({
      questionId: `POL-CP005-V2-${String(globalIndex + 1).padStart(3, "0")}`,
      chapterId: "POL-001",
      cpId: "POL-CP-005",
      qlId: `POL-005-QL-${String(ql).padStart(3, "0")}`,
      qlName: QL_NAMES[ql],
      difficulty: difficultyForQl(ql),
      stem,
      options,
      correctIndex: target,
      canonicalAnswer: correct,
      explanation,
      ...sourceMeta,
      reviewOnly: true,
      runtimeRegistered: false,
    });
  };

  const dpspRows = POL_CP005_DPSP_ARTICLES_V1.filter((row) => !["36", "37"].includes(row.article));
  ["38", "40", "44", "48A", "50"].forEach((articleNumber) => {
    const row = dpsp(articleNumber);
    add(1, `Article ${row.article} deals with:`, row.subject, dpspRows.map((item) => item.subject), row.simpleRule, [row], row.article);
  });

  ["39A", "42", "43B", "45", "51"].forEach((articleNumber) => {
    const row = dpsp(articleNumber);
    add(2, `${row.subject} is provided under:`, `Article ${row.article}`, dpspRows.map((item) => `Article ${item.article}`), row.simpleRule, [row], row.article);
  });

  add(3, "Which statement about Directive Principles is correct?", "They are not enforceable by courts but are fundamental in governance.", [
    "They are not enforceable by courts but are fundamental in governance.",
    "They are enforceable in the same way as Fundamental Rights.",
    "They apply only during a national emergency.",
    "They are contained in Part III of the Constitution.",
  ], dpsp("37").simpleRule, [dpsp("37")], "nature");
  add(3, "Article 37 describes Directive Principles as:", "Non-justiciable but fundamental in the governance of the country", [
    "Non-justiciable but fundamental in the governance of the country",
    "Enforceable against every private person",
    "Temporary principles that expire after ten years",
    "Judicial remedies enforceable only by the Supreme Court",
  ], dpsp("37").simpleRule, [dpsp("37")], "article37");
  add(3, "Under Article 37, applying Directive Principles while making laws is:", "A duty of the State", [
    "A duty of the State",
    "A duty only of the judiciary",
    "Optional only for local governments",
    "A duty only during financial emergency",
  ], dpsp("37").simpleRule, [dpsp("37")], "state-duty");

  ["39(a)", "39(b)", "39(c)", "39(d)", "39(f)"].forEach((clause) => {
    const row = POL_CP005_ARTICLE39_CLAUSES_V1.find((item) => item.clause === clause)!;
    add(4, `${row.clause} is related to:`, row.subject, POL_CP005_ARTICLE39_CLAUSES_V1.map((item) => item.subject), `${row.clause} deals with ${row.subject.toLowerCase()}.`, [row], clause);
  });

  const socialEconomic = [dpsp("38"), dpsp("41"), dpsp("42"), dpsp("43")];
  socialEconomic.forEach((row, index) => {
    const wrongPairs = socialEconomic
      .filter((item) => item.article !== row.article)
      .map((item) => {
        const itemIndex = socialEconomic.findIndex((candidate) => candidate.article === item.article);
        const donor = socialEconomic[(itemIndex + 1) % socialEconomic.length];
        return `Article ${item.article} — ${donor.subject}`;
      });
    const correct = `Article ${row.article} — ${row.subject}`;
    add(5, "Which Article–Directive Principle pair is correctly matched?", correct, [correct, ...wrongPairs], row.simpleRule, [row], `${row.article}:${index}`);
  });

  [dpsp("40"), dpsp("44"), dpsp("50"), dpsp("51")].forEach((row) => {
    add(6, `${row.subject} is connected with:`, `Article ${row.article}`, ["Article 40", "Article 44", "Article 50", "Article 51"], row.simpleRule, [row], row.article);
  });

  [dpsp("47"), dpsp("48"), dpsp("48A"), dpsp("49")].forEach((row) => {
    add(7, `Article ${row.article} deals with:`, row.subject, [dpsp("47").subject, dpsp("48").subject, dpsp("48A").subject, dpsp("49").subject], row.simpleRule, [row], row.article);
  });

  [dpsp("39A"), dpsp("43A"), dpsp("48A")].forEach((row) => {
    add(8, `${row.subject} was added by the:`, "Forty-second Amendment", [
      "Forty-second Amendment", "Forty-fourth Amendment", "Eighty-sixth Amendment", "Ninety-seventh Amendment",
    ], `The Forty-second Amendment added Article ${row.article}.`, [row], row.article);
  });

  const amendmentCandidates = [
    ...POL_CP005_AMENDMENT_LINKS_V1.map((item) => item.additions),
    "Articles 44 and 50 on uniform civil code and separation of judiciary",
  ];
  POL_CP005_AMENDMENT_LINKS_V1.forEach((row) => {
    add(9, `${row.amendment} is correctly linked with:`, row.additions, amendmentCandidates, `${row.amendment}: ${row.additions}.`, [row], row.amendment);
  });

  add(10, "Directive Principles of State Policy are contained in:", "Part IV", ["Part II", "Part III", "Part IV", "Part IVA"], POL_CP005_BOUNDARY_FACTS_V1[0].statement, [POL_CP005_BOUNDARY_FACTS_V1[0]], "part-iv");
  add(10, "Fundamental Duties are contained in:", "Part IVA", ["Part III", "Part IV", "Part IVA", "Part V"], POL_CP005_BOUNDARY_FACTS_V1[2].statement, [POL_CP005_BOUNDARY_FACTS_V1[2]], "part-iva");
  add(10, "Fundamental Duties are listed under:", "Article 51A", ["Article 50", "Article 51", "Article 51A", "Article 52"], "Fundamental Duties are listed in Article 51A in Part IVA.", [POL_CP005_BOUNDARY_FACTS_V1[2]], "article-51a");

  ["51A(a)", "51A(c)", "51A(e)", "51A(g)", "51A(i)"].forEach((clause) => {
    const row = duty(clause);
    add(11, `${row.clause} requires a citizen to:`, row.duty, POL_CP005_DUTIES_V1.map((item) => item.duty), `${row.clause}: ${row.duty}.`, [row], clause);
  });

  ["51A(b)", "51A(d)", "51A(f)", "51A(h)", "51A(k)"].forEach((clause) => {
    const row = duty(clause);
    add(12, `The duty to ${row.duty.charAt(0).toLowerCase()}${row.duty.slice(1)} is in:`, row.clause, POL_CP005_DUTIES_V1.map((item) => item.clause), `${row.clause}: ${row.duty}.`, [row], clause);
  });

  ["51A(a)", "51A(g)", "51A(h)", "51A(j)"].forEach((clause) => {
    const row = duty(clause);
    add(13, "Which of the following is a Fundamental Duty?", row.duty, [
      row.duty,
      "Vote in every election",
      "Pay every tax directly listed in the Constitution",
      "Join the armed forces for a fixed compulsory period",
    ], `${row.clause}: ${row.duty}.`, [row], clause);
  });

  const notDuties = [
    "Voting in every election",
    "Paying taxes as an expressly listed Fundamental Duty",
    "Compulsory military service for every adult citizen",
  ];
  notDuties.forEach((notDuty, index) => {
    const real = POL_CP005_DUTIES_V1.slice(index * 2, index * 2 + 3).map((item) => item.duty);
    add(14, "Which of the following is NOT expressly listed as a Fundamental Duty in Article 51A?", notDuty, [notDuty, ...real], `${notDuty} is not expressly listed in Article 51A.`, [POL_CP005_BOUNDARY_FACTS_V1[3]], String(index));
  });

  add(15, "Fundamental Duties were inserted into the Constitution by the:", "Forty-second Amendment", ["Forty-second Amendment", "Forty-fourth Amendment", "Eighty-sixth Amendment", "Ninety-seventh Amendment"], POL_CP005_BOUNDARY_FACTS_V1[4].statement, [POL_CP005_BOUNDARY_FACTS_V1[4]], "inserted");
  add(15, "How many Fundamental Duties were originally added by the Forty-second Amendment?", "10", ["8", "10", "11", "12"], POL_CP005_BOUNDARY_FACTS_V1[4].statement, [POL_CP005_BOUNDARY_FACTS_V1[4]], "original-count");
  add(15, "The eleventh Fundamental Duty, Article 51A(k), was added by the:", "Eighty-sixth Amendment", ["Forty-second Amendment", "Forty-fourth Amendment", "Eighty-sixth Amendment", "Ninety-seventh Amendment"], POL_CP005_BOUNDARY_FACTS_V1[4].statement, [POL_CP005_BOUNDARY_FACTS_V1[4]], "eleventh");

  add(16, "Article 45 now deals with:", "Early childhood care and education below six years", [
    "Early childhood care and education below six years",
    "Free and compulsory education from six to fourteen years",
    "Equal justice and free legal aid",
    "Village panchayats",
  ], dpsp("45").simpleRule, [dpsp("45")], "article45");
  add(16, "A parent's or guardian's duty to provide education opportunities to a child aged six to fourteen is under:", "Article 51A(k)", ["Article 45", "Article 51A(k)", "Article 39A", "Article 43A"], `${duty("51A(k)").clause}: ${duty("51A(k)").duty}.`, [duty("51A(k)")], "duty-k");
  add(16, "The Eighty-sixth Amendment changed Article 45 and also added:", "Article 51A(k)", ["Article 39A", "Article 43B", "Article 48A", "Article 51A(k)"], "The Eighty-sixth Amendment gave Article 45 its present early-childhood focus and added Article 51A(k).", [dpsp("45"), duty("51A(k)")], "86th");

  add(17, "Protect and improve the natural environment is:", "Both a State directive and a citizen duty", [
    "Both a State directive and a citizen duty",
    "Only a Fundamental Right",
    "Only a State directive",
    "Only a citizen duty",
  ], "Article 48A directs the State to protect the environment, while Article 51A(g) makes environmental protection a Fundamental Duty of citizens.", [dpsp("48A"), duty("51A(g)")], "environment");
  add(17, "Organise village panchayats is:", "A Directive Principle for the State", [
    "A Directive Principle for the State",
    "A Fundamental Duty of every citizen",
    "A Fundamental Right of citizens",
    "A constitutional duty of the Supreme Court",
  ], dpsp("40").simpleRule, [dpsp("40")], "panchayat");
  add(17, "Develop scientific temper is:", "A Fundamental Duty of citizens", [
    "A Fundamental Duty of citizens",
    "A Directive Principle for the State",
    "A Fundamental Right",
    "A power of the President",
  ], `${duty("51A(h)").clause}: ${duty("51A(h)").duty}.`, [duty("51A(h)")], "scientific-temper");

  const countOptions = ["None", "Only one", "Only two", "All three"];
  const addStatementCount = (ql: number, statements: string[], correct: string, explanation: string, used: readonly PolCp005Sourced[], seed: string) => {
    add(ql, `Consider the following statements:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nHow many statements are correct?`, correct, countOptions, explanation, used, seed);
  };

  addStatementCount(18, ["Article 40 concerns village panchayats.", "Article 44 concerns a uniform civil code.", "Article 50 concerns separation of judiciary from executive."], "All three", "All three Article–subject pairs are correct.", [dpsp("40"), dpsp("44"), dpsp("50")], "set1");
  addStatementCount(18, ["Article 39A concerns equal justice and free legal aid.", "Article 43A concerns workers' participation in management.", "Article 48A concerns protection of environment, forests and wildlife."], "All three", "All three Article–subject pairs are correct.", [dpsp("39A"), dpsp("43A"), dpsp("48A")], "set2");
  addStatementCount(18, ["Article 47 concerns public health.", "Article 49 concerns monuments of national importance.", "Article 51 concerns international peace and security."], "All three", "All three Article–subject pairs are correct.", [dpsp("47"), dpsp("49"), dpsp("51")], "set3");

  addStatementCount(19, ["Respect the National Flag and National Anthem is a Fundamental Duty.", "Protect the natural environment is a Fundamental Duty.", "Develop scientific temper is a Fundamental Duty."], "All three", "All three are listed Fundamental Duties.", [duty("51A(a)"), duty("51A(g)"), duty("51A(h)")], "duties1");
  addStatementCount(19, ["Safeguard public property is a Fundamental Duty.", "Strive towards excellence is a Fundamental Duty.", "Voting in every election is expressly listed as a Fundamental Duty."], "Only two", "Statements 1 and 2 are correct. Voting is not expressly listed in Article 51A.", [duty("51A(i)"), duty("51A(j)"), POL_CP005_BOUNDARY_FACTS_V1[3]], "duties2");
  addStatementCount(19, ["Article 51A(k) concerns education opportunities for children aged six to fourteen.", "It was added by the Eighty-sixth Amendment.", "It was one of the original ten duties added in 1976."], "Only two", "Statements 1 and 2 are correct. Article 51A(k) was added later by the Eighty-sixth Amendment.", [duty("51A(k)"), POL_CP005_BOUNDARY_FACTS_V1[4]], "duties3");

  addStatementCount(20, ["Directive Principles are non-justiciable.", "Fundamental Duties are in Part IVA.", "Article 48A and Article 51A(g) both concern environmental protection."], "All three", "All three statements are correct.", [dpsp("37"), POL_CP005_BOUNDARY_FACTS_V1[2], dpsp("48A"), duty("51A(g)")], "integrated1");
  addStatementCount(20, ["Article 45 deals with early childhood care below six years.", "Article 51A(k) concerns education opportunities for children aged six to fourteen.", "Both provisions were given their present form by the Eighty-sixth Amendment."], "All three", "All three statements are correct.", [dpsp("45"), duty("51A(k)")], "integrated2");
  addStatementCount(20, ["Article 43B concerns co-operative societies.", "It was added by the Ninety-seventh Amendment.", "Fundamental Duties are contained in Part IV."], "Only two", "Statements 1 and 2 are correct. Fundamental Duties are in Part IVA, not Part IV.", [dpsp("43B"), POL_CP005_BOUNDARY_FACTS_V1[2]], "integrated3");

  return questions;
}
