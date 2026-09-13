import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  POL_CP004_ARTICLE19_FREEDOMS_V1,
  POL_CP004_ARTICLE19_SPEECH_RESTRICTIONS_V1,
  POL_CP004_ARTICLE20_PROTECTIONS_V1,
  POL_CP004_ARTICLE22_SAFEGUARDS_V1,
  POL_CP004_ARTICLES_V1,
  POL_CP004_BOUNDARY_FACTS_V1,
  POL_CP004_RIGHT_HOLDERS_V1,
  POL_CP004_WRITS_V1,
  type PolCp004ArticleRow,
  type PolCp004Sourced,
} from "./pol-cp004-facts";
import type { PolCp004ReviewQuestion } from "./pol-cp004-review-types";

const qlNames: Record<number, string> = {
  1: "Article to Fundamental Right subject",
  2: "Fundamental Right subject to Article",
  3: "Fundamental Rights group identification",
  4: "Citizen-only and person-based rights",
  5: "Right to Equality Articles 14–18",
  6: "Freedoms under Article 19",
  7: "Rights not included in Article 19",
  8: "Restrictions on speech and expression",
  9: "Article 20 protections",
  10: "Articles 21 and 21A",
  11: "Article 22 arrest safeguards",
  12: "Rights against exploitation",
  13: "Freedom of religion Articles 25–28",
  14: "Cultural and educational rights",
  15: "Article 32 constitutional remedies",
  16: "Constitutional writ and purpose",
  17: "Writ application scenarios",
  18: "Special provisions Articles 33–35",
  19: "Part III and right-to-property boundaries",
  20: "Integrated Fundamental Rights statements",
};

const difficultyForQl = (ql: number): KnowledgeV1Difficulty => {
  if ([1, 2, 3, 6, 10, 15].includes(ql)) return "Easy";
  if ([17, 20].includes(ql)) return "Hard";
  return "Medium";
};

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const wrong = deterministicShuffle([...new Set(values.filter((value) => value !== correct))], seed).slice(0, 3);
  if (wrong.length < 3) throw new Error(`Insufficient distractors for ${seed}`);
  return moveCorrect(deterministicShuffle([...wrong, correct], `${seed}:options`), correct, target);
}

function metadata(items: readonly PolCp004Sourced[]) {
  return {
    sourceIds: [...new Set(items.flatMap((item) => [...item.sourceIds]))],
    sourceFactIds: [...new Set(items.flatMap((item) => [...item.sourceFactIds]))],
  };
}

const article = (number: string) => POL_CP004_ARTICLES_V1.find((row) => row.article === number)!;
const articleLabel = (row: PolCp004ArticleRow) => `Article ${row.article}`;

function makeQuestion(ql: number, rowIndex: number, globalIndex: number): PolCp004ReviewQuestion {
  const qlId = `POL-004-QL-${String(ql).padStart(3, "0")}`;
  const correctTarget = globalIndex % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let explanation = "";
  let used: PolCp004Sourced[] = [];

  if (ql === 1) {
    const rows = POL_CP004_ARTICLES_V1.filter((row) => !["12", "13", "33", "34", "35"].includes(row.article));
    const row = rows[(rowIndex * 4) % rows.length];
    stem = `${articleLabel(row)} deals with:`;
    correct = row.subject;
    options = chooseFour(rows.map((item) => item.subject), correct, `${qlId}:${row.article}`, correctTarget);
    explanation = `${articleLabel(row)} deals with ${row.subject.toLowerCase()}.`;
    used = [row];
  } else if (ql === 2) {
    const rows = POL_CP004_ARTICLES_V1.filter((row) => !["12", "13", "33", "34", "35"].includes(row.article));
    const row = rows[(rowIndex * 5 + 2) % rows.length];
    stem = `${row.subject} is provided under:`;
    correct = articleLabel(row);
    options = chooseFour(rows.map(articleLabel), correct, `${qlId}:${row.article}`, correctTarget);
    explanation = `${row.subject} is covered by ${articleLabel(row)}.`;
    used = [row];
  } else if (ql === 3) {
    const variants = [
      ["Right to Equality", "Articles 14–18", "Articles 19–22", "Articles 23–24", "Articles 25–28"],
      ["Right to Freedom", "Articles 19–22", "Articles 14–18", "Articles 25–28", "Articles 29–30"],
      ["Right against Exploitation", "Articles 23–24", "Articles 19–22", "Articles 25–28", "Articles 29–30"],
    ];
    const [name, answer, ...wrong] = variants[rowIndex % variants.length];
    stem = `${name} is mainly covered by:`;
    correct = answer;
    options = moveCorrect([answer, ...wrong], correct, correctTarget);
    explanation = `${name} is mainly covered by ${answer}.`;
    used = [article(answer.includes("14") ? "14" : answer.includes("19") ? "19" : "23")];
  } else if (ql === 4) {
    const row = POL_CP004_RIGHT_HOLDERS_V1[rowIndex % POL_CP004_RIGHT_HOLDERS_V1.length];
    stem = `${row.right} is available to:`;
    correct = row.holder;
    options = moveCorrect([correct, "Citizens only", "All persons", "Religious and linguistic minorities"].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4), correct, correctTarget);
    while (options.length < 4) options.push(options.length === 3 ? "Only public servants" : "Only natural-born citizens");
    const a = row.right.match(/Article (\d+A?)/)?.[1] ?? "14";
    const ar = article(a);
    explanation = `${articleLabel(ar)}: ${ar.simpleRule}`;
    used = [ar];
  } else if (ql === 5) {
    const rows = POL_CP004_ARTICLES_V1.filter((row) => row.group === "equality");
    const row = rows[rowIndex % rows.length];
    stem = `${articleLabel(row)} provides for:`;
    correct = row.subject;
    options = chooseFour(rows.map((item) => item.subject), correct, `${qlId}:${row.article}`, correctTarget);
    explanation = row.simpleRule;
    used = [row];
  } else if (ql === 6) {
    const freedom = POL_CP004_ARTICLE19_FREEDOMS_V1[rowIndex % POL_CP004_ARTICLE19_FREEDOMS_V1.length];
    stem = "Which of the following is a freedom under Article 19?";
    correct = freedom;
    const wrong = ["Right to vote in every election", "Right to strike", "Right to property as a Fundamental Right", "Right to free higher education"];
    options = moveCorrect(deterministicShuffle([correct, ...wrong], `${qlId}:${rowIndex}`).slice(0, 4), correct, correctTarget);
    explanation = `Article 19 includes ${freedom.toLowerCase()}.`;
    used = [article("19")];
  } else if (ql === 7) {
    const wrongRights = ["Right to property", "Right to strike", "Right to vote"];
    correct = wrongRights[rowIndex % wrongRights.length];
    stem = "Which of the following is NOT one of the six freedoms under Article 19?";
    options = chooseFour([...POL_CP004_ARTICLE19_FREEDOMS_V1, ...wrongRights], correct, `${qlId}:${rowIndex}`, correctTarget);
    explanation = `Article 19 contains six listed freedoms. ${correct} is not one of them.`;
    used = [article("19")];
  } else if (ql === 8) {
    const ground = POL_CP004_ARTICLE19_SPEECH_RESTRICTIONS_V1[rowIndex % POL_CP004_ARTICLE19_SPEECH_RESTRICTIONS_V1.length];
    stem = "A restriction on freedom of speech under Article 19(2) may be based on:";
    correct = ground;
    const wrong = ["Administrative convenience alone", "Any criticism of government", "A general dislike of dissent", "Any peaceful disagreement"];
    options = moveCorrect(deterministicShuffle([correct, ...wrong], `${qlId}:${rowIndex}`).slice(0, 4), correct, correctTarget);
    explanation = `${ground} is one of the constitutional grounds listed in Article 19(2).`;
    used = [article("19")];
  } else if (ql === 9) {
    const row = POL_CP004_ARTICLE20_PROTECTIONS_V1[rowIndex % POL_CP004_ARTICLE20_PROTECTIONS_V1.length];
    if (rowIndex % 2 === 0) {
      stem = `${row.label} under Article 20 means:`;
      correct = row.meaning;
      options = chooseFour(POL_CP004_ARTICLE20_PROTECTIONS_V1.map((item) => item.meaning), correct, `${qlId}:${row.label}`, correctTarget);
    } else {
      stem = `${row.meaning} This protection is known as:`;
      correct = row.label;
      options = chooseFour([...POL_CP004_ARTICLE20_PROTECTIONS_V1.map((item) => item.label), "Preventive detention"], correct, `${qlId}:${row.label}`, correctTarget);
    }
    explanation = `Article 20 protects against ${row.label.toLowerCase()}.`;
    used = [article("20")];
  } else if (ql === 10) {
    const variants = [
      ["Protection of life and personal liberty is provided by:", "Article 21", "Article 20", "Article 21A", "Article 22"],
      ["Free and compulsory education for children aged six to fourteen is provided by:", "Article 21A", "Article 21", "Article 24", "Article 30"],
      ["The age group specifically mentioned in Article 21A is:", "6 to 14 years", "5 to 14 years", "6 to 16 years", "8 to 18 years"],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length];
    stem = s; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = rowIndex % 3 === 1 || rowIndex % 3 === 2 ? article("21A").simpleRule : article("21").simpleRule;
    used = [article("21"), article("21A")];
  } else if (ql === 11) {
    const safeguard = POL_CP004_ARTICLE22_SAFEGUARDS_V1[rowIndex % POL_CP004_ARTICLE22_SAFEGUARDS_V1.length];
    stem = "Which safeguard is provided by Article 22 for an arrested person?";
    correct = safeguard;
    const wrong = ["Automatic release in every case after twelve hours.", "A constitutional right to choose the trial judge.", "A right to avoid all questioning by any authority.", "A right to demand trial only by the Supreme Court."];
    options = moveCorrect(deterministicShuffle([correct, ...wrong], `${qlId}:${rowIndex}`).slice(0, 4), correct, correctTarget);
    explanation = article("22").simpleRule;
    used = [article("22")];
  } else if (ql === 12) {
    const variants = [
      ["Traffic in human beings and begar are prohibited by:", "Article 23", "Article 24", "Article 21", "Article 19"],
      ["Employment of children below fourteen in factories and mines is prohibited by:", "Article 24", "Article 23", "Article 21A", "Article 29"],
      ["Articles 23 and 24 together form the:", "Right against Exploitation", "Right to Equality", "Right to Freedom of Religion", "Cultural and Educational Rights"],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length]; stem = s; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = `${article("23").simpleRule} ${article("24").simpleRule}`;
    used = [article("23"), article("24")];
  } else if (ql === 13) {
    const rows = POL_CP004_ARTICLES_V1.filter((row) => row.group === "religion");
    const row = rows[rowIndex % rows.length];
    stem = `${articleLabel(row)} deals with:`;
    correct = row.subject;
    options = chooseFour(rows.map((item) => item.subject), correct, `${qlId}:${row.article}`, correctTarget);
    explanation = row.simpleRule;
    used = [row];
  } else if (ql === 14) {
    const variants = [
      ["The right to conserve a distinct language, script or culture is protected by:", "Article 29", "Article 28", "Article 30", "Article 32"],
      ["Religious and linguistic minorities may establish and administer educational institutions under:", "Article 30", "Article 29", "Article 25", "Article 21A"],
      ["Articles 29 and 30 are known as:", "Cultural and Educational Rights", "Right against Exploitation", "Right to Constitutional Remedies", "Right to Equality"],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length]; stem = s; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = `${article("29").simpleRule} ${article("30").simpleRule}`;
    used = [article("29"), article("30")];
  } else if (ql === 15) {
    const variants = [
      ["The right to move the Supreme Court for enforcement of Fundamental Rights is guaranteed by:", "Article 32", "Article 21", "Article 30", "Article 35"],
      ["Under Article 32, the Supreme Court may issue:", "Constitutional writs", "Money Bills", "Ordinances", "Election notifications"],
      ["Article 32 is mainly connected with:", "Enforcement of Fundamental Rights", "Creation of new States", "Citizenship at commencement", "Public employment reservations"],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length]; stem = s; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = article("32").simpleRule;
    used = [article("32")];
  } else if (ql === 16) {
    const row = POL_CP004_WRITS_V1[rowIndex % POL_CP004_WRITS_V1.length];
    stem = `${row.writ} is mainly used:`;
    correct = row.purpose;
    options = chooseFour(POL_CP004_WRITS_V1.map((item) => item.purpose), correct, `${qlId}:${row.writ}`, correctTarget);
    explanation = `${row.writ}: ${row.purpose}.`;
    used = [row];
  } else if (ql === 17) {
    const rows = POL_CP004_WRITS_V1;
    const row = rows[rowIndex % 4 === 0 ? 0 : rowIndex % 4 === 1 ? 1 : rowIndex % 4 === 2 ? 2 : 4];
    const scenarios: Record<string, string> = {
      "Habeas Corpus": "A person is allegedly held without lawful authority. Which writ is most appropriate?",
      "Mandamus": "A public authority refuses to perform a legal public duty. Which writ is most appropriate?",
      "Prohibition": "A lower tribunal is about to continue a case beyond its jurisdiction. Which writ is most appropriate?",
      "Quo Warranto": "The legal authority of a person to hold a public office is challenged. Which writ is most appropriate?",
    };
    stem = scenarios[row.writ]; correct = row.writ;
    options = chooseFour(rows.map((item) => item.writ), correct, `${qlId}:${row.writ}`, correctTarget);
    explanation = `${row.writ} is used ${row.purpose.toLowerCase()}.`;
    used = [row];
  } else if (ql === 18) {
    const rows = [article("33"), article("34"), article("35")];
    const row = rows[rowIndex % rows.length];
    stem = `${articleLabel(row)} deals with:`;
    correct = row.subject;
    options = moveCorrect([correct, ...rows.filter((item) => item.article !== row.article).map((item) => item.subject), "Right to education"], correct, correctTarget);
    explanation = row.simpleRule;
    used = [row];
  } else if (ql === 19) {
    const variants = [
      ["Fundamental Rights are mainly contained in:", "Part III", "Part II", "Part IV", "Part IVA"],
      ["The right to property is presently protected under:", "Article 300A", "Article 19", "Article 31 as a Fundamental Right", "Article 32"],
      ["Which statement is correct about the right to property?", "It is a constitutional right, not a Fundamental Right.", "It is one of the six Article 19 freedoms.", "It is guaranteed by Article 32 as a separate Fundamental Right.", "It is available only to citizens as an Article 19 right."],
    ];
    const [s, a, ...wrong] = variants[rowIndex % variants.length]; stem = s; correct = a; options = moveCorrect([a, ...wrong], a, correctTarget);
    explanation = POL_CP004_BOUNDARY_FACTS_V1[rowIndex % 3 === 0 ? 1 : 0].statement;
    used = [POL_CP004_BOUNDARY_FACTS_V1[rowIndex % 3 === 0 ? 1 : 0]];
  } else {
    const modes = rowIndex % 4;
    const blocks = [
      { statements: ["Article 14 is available to all persons.", "Article 19 freedoms are available only to citizens.", "Article 30 protects religious and linguistic minorities."], correct: "All three", exp: "All three statements are correct." },
      { statements: ["Article 17 abolishes untouchability.", "Article 24 deals with child labour in specified hazardous employment.", "Article 27 guarantees equality in public employment."], correct: "Only two", exp: "Statements 1 and 2 are correct. Equality of opportunity in public employment is under Article 16." },
      { statements: ["Article 20 protects against double jeopardy.", "Article 21A covers children aged six to fourteen.", "Article 32 deals with admission of new States."], correct: "Only two", exp: "Statements 1 and 2 are correct. Article 32 deals with constitutional remedies." },
      { statements: ["Habeas Corpus concerns unlawful detention.", "Quo Warranto questions authority to hold a public office.", "Mandamus is used to quash an order already passed by a lower court."], correct: "Only two", exp: "Statements 1 and 2 are correct. Mandamus commands performance of a public duty; Certiorari is associated with quashing an order." },
    ];
    const block = blocks[modes];
    stem = `Consider the following statements:\n1. ${block.statements[0]}\n2. ${block.statements[1]}\n3. ${block.statements[2]}\nHow many statements are correct?`;
    correct = block.correct;
    options = moveCorrect(["None", "Only one", "Only two", "All three"], correct, correctTarget);
    explanation = block.exp;
    used = [article("14"), article("19"), article("20"), article("21A"), article("24"), article("30"), article("32"), POL_CP004_WRITS_V1[0], POL_CP004_WRITS_V1[1], POL_CP004_WRITS_V1[4]];
  }

  const meta = metadata(used);
  return {
    questionId: `POL-CP004-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "POL-001",
    cpId: "POL-CP-004",
    qlId,
    qlName: qlNames[ql],
    difficulty: difficultyForQl(ql),
    stem,
    options,
    correctIndex: correctTarget,
    canonicalAnswer: correct,
    explanation,
    ...meta,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generatePolCp004ReviewBatchV1() {
  const counts: Record<number, number> = { 1:4,2:4,3:3,4:4,5:4,6:4,7:3,8:3,9:4,10:3,11:4,12:3,13:4,14:3,15:3,16:5,17:4,18:3,19:3,20:4 };
  const output: PolCp004ReviewQuestion[] = [];
  let globalIndex = 0;
  for (let ql = 1; ql <= 20; ql += 1) {
    for (let rowIndex = 0; rowIndex < counts[ql]; rowIndex += 1) {
      output.push(makeQuestion(ql, rowIndex, globalIndex));
      globalIndex += 1;
    }
  }
  return output;
}
