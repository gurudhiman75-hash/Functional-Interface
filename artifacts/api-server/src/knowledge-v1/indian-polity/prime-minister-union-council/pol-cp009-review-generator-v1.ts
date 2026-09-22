import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  POL_CP009_ANTI_DEFECTION_V1,
  POL_CP009_ARTICLE75_V1,
  POL_CP009_ARTICLE77_V1,
  POL_CP009_ARTICLE78_DUTIES_V1,
  POL_CP009_ARTICLE88_V1,
  POL_CP009_ARTICLES_V1,
  POL_CP009_APPOINTMENT_V1,
  POL_CP009_CABINET_V1,
} from "./pol-cp009-facts";
import type { PolCp009ReviewQuestion } from "./pol-cp009-review-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const qlNames: Record<number, string> = {
  1: "Article to subject",
  2: "Subject to Article",
  3: "Appointment of Prime Minister and Ministers",
  4: "Prime Minister at head of Council and ministerial advice",
  5: "Collective responsibility",
  6: "Six-month parliamentary membership rule",
  7: "Council of Ministers size cap and Ninety-first Amendment",
  8: "Ministerial oaths",
  9: "Tenure during pleasure of President",
  10: "Conduct of Government business under Article 77",
  11: "Prime Minister duties under Article 78",
  12: "Article 78 application scenarios",
  13: "Rights of Ministers in Parliament under Article 88",
  14: "Cabinet and Council of Ministers distinction",
  15: "Anti-defection bar on ministerial appointment",
  16: "Ministerial salaries and allowances",
  17: "Integrated Council of Ministers statements",
  18: "President–Prime Minister–Council constitutional distinctions",
};

const difficulty = (ql: number): KnowledgeV1Difficulty =>
  [1, 2, 3, 4, 5].includes(ql) ? "Easy" : [12, 17, 18].includes(ql) ? "Hard" : "Medium";

function moveCorrect(options: string[], correct: string, target: number) {
  const i = options.indexOf(correct);
  if (i < 0) throw new Error(`Missing correct option: ${correct}`);
  [options[i], options[target]] = [options[target], options[i]];
  return options;
}

function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const wrong = deterministicShuffle([...new Set(values.filter(v => v !== correct))], seed).slice(0, 3);
  if (wrong.length < 3) throw new Error(`Insufficient distractors for ${seed}`);
  return moveCorrect(deterministicShuffle([...wrong, correct], `${seed}:options`), correct, target);
}

function article(n: string) {
  return POL_CP009_ARTICLES_V1.find(x => x.article === n)!;
}

function explanation(ql: number, row: number, answer: string): string {
  const table: Record<number, string[]> = {
    1: [
      "Article 74 deals with the Council of Ministers advising the President, with the Prime Minister at its head.",
      "Article 75 contains the main rules on appointment, responsibility, oath, size and membership of Union Ministers.",
      "Article 77 deals with how executive business of the Government of India is formally conducted.",
      "Article 78 lists the Prime Minister's duties to keep the President informed about Union government business.",
    ],
    2: [
      "Article 74 is the main provision on ministerial aid and advice to the President.",
      "Article 75 governs appointment of Ministers and the Council's responsibility to Lok Sabha.",
      "Article 88 gives Ministers participation rights in Parliament but does not itself give a right to vote.",
      "Article 352(3) gives the constitutional meaning of the Union Cabinet for the Emergency provision.",
    ],
    3: [
      "The President appoints the Prime Minister under Article 75. The Constitution states this appointment directly.",
      "Other Union Ministers are appointed by the President on the advice of the Prime Minister.",
      "The Prime Minister's advice is required for appointing the other Ministers in the Union Council.",
      "Article 75 separates the Prime Minister's appointment from the appointment of the other Ministers.",
    ],
    4: [
      "Article 74 places the Prime Minister at the head of the Council of Ministers that advises the President.",
      "The Council of Ministers aids and advises the President, while the Prime Minister heads that Council.",
      "The President may ask the Council to reconsider its advice once, but must accept the advice returned afterward.",
      "Courts cannot inquire into what advice Ministers actually gave the President under Article 74(2).",
    ],
    5: [
      "Article 75 makes the Council of Ministers collectively responsible to Lok Sabha, the House of the People.",
      "Collective responsibility means the Council answers to Lok Sabha as a body, not only as separate Ministers.",
      "The Constitution names Lok Sabha, not Rajya Sabha, as the House to which the Council is collectively responsible.",
      "A loss of Lok Sabha confidence affects the Council collectively because Article 75 fixes collective responsibility there.",
    ],
    6: [
      "A Minister may remain outside Parliament only for six consecutive months before ceasing to be a Minister.",
      "The six-month rule applies when a Minister is not a member of either House of Parliament.",
      "A Minister can enter office without being an MP, but must become a member within six consecutive months.",
      "Article 75 uses membership of either House, so Lok Sabha or Rajya Sabha membership satisfies the rule.",
    ],
    7: [
      "The Union Council of Ministers, including the Prime Minister, cannot exceed fifteen per cent of Lok Sabha's total membership.",
      "The fifteen per cent ceiling was inserted by the Ninety-first Constitutional Amendment and applies to the Union Council.",
      "The size limit is calculated from the total membership of Lok Sabha, not from Rajya Sabha membership.",
      "The Prime Minister is included while counting Ministers for the constitutional fifteen per cent ceiling.",
    ],
    8: [
      "Before entering office, a Union Minister takes both the oath of office and the oath of secrecy.",
      "The President administers the oaths of office and secrecy to Union Ministers under Article 75.",
      "The forms of ministerial oaths are given in the Third Schedule of the Constitution.",
      "A Minister takes the required oaths before entering office, not after beginning ministerial duties.",
    ],
    9: [
      "Article 75 says Ministers hold office during the pleasure of the President within India's parliamentary system.",
      "The constitutional wording is pleasure of the President; it should not be read as unlimited personal presidential discretion.",
      "The pleasure clause appears in Article 75 along with appointment and collective-responsibility rules.",
      "Union Ministers do not have a fixed constitutional term separate from the working of the parliamentary government.",
    ],
    10: [
      "Article 77 requires executive action of the Government of India to be expressed in the President's name.",
      "Orders issued in the President's name are authenticated in the manner laid down by the prescribed rules.",
      "The President makes rules for convenient transaction of Union government business and its allocation among Ministers.",
      "Article 77 concerns formal conduct and allocation of government business, not appointment of the Prime Minister.",
    ],
    11: [
      "Article 78 requires the Prime Minister to communicate Council decisions on Union administration and proposed legislation to the President.",
      "The Prime Minister must provide information on Union administration and legislative proposals when the President asks for it.",
      "The President may require the Prime Minister to place an individual Minister's decision before the Council for consideration.",
      "Article 78 makes the Prime Minister the constitutional link for specified information between the Council and the President.",
    ],
    12: [
      "If the President asks about a legislative proposal, the Prime Minister must provide the requested information under Article 78.",
      "A decision made by one Minister can be placed before the full Council if the President requires it.",
      "Council decisions about Union administration must be communicated to the President by the Prime Minister.",
      "Article 78 does not let the President personally run ministries; it creates specified information and reconsideration duties for the Prime Minister.",
    ],
    13: [
      "A Union Minister may speak and take part in either House of Parliament under Article 88.",
      "Article 88 also allows a Minister to participate in a joint sitting of the two Houses.",
      "A Minister may take part in a parliamentary committee when named as a member of that committee.",
      "Article 88 does not itself give a Minister a right to vote merely because the Minister may participate there.",
    ],
    14: [
      "The Constitution defines the Union Cabinet for Article 352 as the Prime Minister plus Ministers of Cabinet rank.",
      "The Cabinet is the Cabinet-rank group within the wider Council of Ministers, not a second name for every Minister.",
      "Article 352(3) expressly refers to Ministers of Cabinet rank when defining the Union Cabinet.",
      "The Council of Ministers is wider, while the Cabinet refers to the Prime Minister and Cabinet-rank Ministers.",
    ],
    15: [
      "Article 75(1B) links Tenth Schedule disqualification with a temporary bar on appointment as a Minister.",
      "The ministerial disqualification rule was inserted by the Ninety-first Amendment along with the size-cap provision.",
      "A member disqualified under paragraph 2 of the Tenth Schedule can also be barred from ministerial appointment for the stated period.",
      "The Article 75(1B) rule connects anti-defection disqualification with eligibility to become a Union Minister.",
    ],
    16: [
      "Parliament may determine the salaries and allowances of Union Ministers by law under Article 75.",
      "Until Parliament determines ministerial salaries and allowances by law, the Constitution refers to the Second Schedule.",
      "Ministerial salaries are not fixed by the President personally; Article 75 gives Parliament the law-making role.",
      "Article 75 covers salaries and allowances as one of its additional rules concerning Union Ministers.",
    ],
    17: [
      "Statements 1 and 2 are correct. A non-MP Minister cannot remain outside Parliament indefinitely; under Article 75, the Minister must become a member of either House within six consecutive months.",
      "Only the first and third statements are correct; collective responsibility is to Lok Sabha, not Rajya Sabha.",
      "All three are correct: the fifteen per cent cap includes the Prime Minister, ministerial oaths are administered by the President, and Article 78 lists PM duties.",
      "Only two statements are correct; Article 88 allows participation in either House but does not itself create a voting right there.",
    ],
    18: [
      "The President appoints the Prime Minister, while other Ministers are appointed on the Prime Minister's advice.",
      "The President may return ministerial advice once for reconsideration, but must accept the advice sent back afterward.",
      "The Council is collectively responsible to Lok Sabha, while Article 78 gives the Prime Minister specific duties toward the President.",
      "The Cabinet is narrower than the Council of Ministers because the constitutional definition refers to Cabinet-rank Ministers.",
    ],
  };
  const text = table[ql][row];
  if (!text) throw new Error(`Missing explanation ${ql}/${row}/${answer}`);
  return text;
}

function make(ql: number, row: number, globalIndex: number): PolCp009ReviewQuestion {
  const qlId = `POL-009-QL-${String(ql).padStart(3, "0")}`;
  const target = globalIndex % 4;
  let stem = "";
  let correct = "";
  let options: string[] = [];
  let sourceFactIds: readonly string[] = ["pol-cp009-review"];

  if (ql === 1) {
    const nums = ["74", "75", "77", "78"];
    const a = article(nums[row]);
    stem = `Article ${a.article} deals with:`;
    correct = a.subject;
    options = chooseFour(POL_CP009_ARTICLES_V1.map(x => x.subject), correct, `${qlId}:${row}`, target);
    sourceFactIds = a.sourceFactIds;
  } else if (ql === 2) {
    const nums = ["74", "75", "88", "352(3)"];
    const a = article(nums[row]);
    stem = `${a.subject} is mainly covered by:`;
    correct = `Article ${a.article}`;
    options = chooseFour(POL_CP009_ARTICLES_V1.map(x => `Article ${x.article}`), correct, `${qlId}:${row}`, target);
    sourceFactIds = a.sourceFactIds;
  } else if (ql === 3) {
    const variants = [
      ["Who appoints the Prime Minister?", "President"],
      ["Other Union Ministers are appointed by the President on the advice of the:", "Prime Minister"],
      ["Whose advice is required for appointment of other Union Ministers?", "Prime Minister"],
      ["Appointment of the Prime Minister and other Union Ministers is mainly covered by:", "Article 75"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Chief Justice of India", "Speaker of Lok Sabha", "Rajya Sabha Chairman", "Lok Sabha", "Article 74", "Article 78"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_APPOINTMENT_V1.sourceFactIds;
  } else if (ql === 4) {
    const variants = [
      ["Who heads the Union Council of Ministers?", "Prime Minister"],
      ["The Council of Ministers aids and advises the:", "President"],
      ["The President may return ministerial advice for reconsideration:", "Once"],
      ["Whether Ministers advised the President in a particular way can be examined by a court:", "No"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Vice-President", "Speaker of Lok Sabha", "Chief Justice of India", "Twice", "Without limit", "Yes", "Only during an emergency"], correct, `${qlId}:${row}`, target);
    sourceFactIds = article("74").sourceFactIds;
  } else if (ql === 5) {
    const variants = [
      ["The Union Council of Ministers is collectively responsible to:", "Lok Sabha"],
      ["Collective responsibility of the Union Council is provided in:", "Article 75"],
      ["Which House can hold the Union Council collectively responsible?", "Lok Sabha"],
      ["Collective responsibility means the Council answers politically as:", "A body"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Rajya Sabha", "Both Houses equally", "President alone", "Article 74", "Article 78", "Separate Ministers only"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ARTICLE75_V1.sourceFactIds;
  } else if (ql === 6) {
    const variants = [
      ["A Minister who is not an MP can continue for a maximum of:", "Six consecutive months"],
      ["The six-month rule requires membership of:", "Either House of Parliament"],
      ["A non-MP appointed Minister must become an MP within:", "Six consecutive months"],
      ["For the six-month rule, membership of Rajya Sabha is sufficient:", "Yes"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Three months", "One year", "Lok Sabha only", "Rajya Sabha only", "No", "Only after a general election"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ARTICLE75_V1.sourceFactIds;
  } else if (ql === 7) {
    const variants = [
      ["The Union Council of Ministers cannot exceed:", "15% of the total membership of Lok Sabha"],
      ["The 15% limit on the Union Council was inserted by the:", "Ninety-first Amendment"],
      ["The constitutional ministerial size cap is based on membership of:", "Lok Sabha"],
      ["While calculating the 15% cap, the Prime Minister is:", "Included"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "10% of Lok Sabha", "20% of Parliament", "Rajya Sabha", "Both Houses together", "Excluded", "Fifty-second Amendment", "Forty-second Amendment"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ARTICLE75_V1.sourceFactIds;
  } else if (ql === 8) {
    const variants = [
      ["A Union Minister takes:", "Oaths of office and secrecy"],
      ["Who administers the oath to a Union Minister?", "President"],
      ["Forms of ministerial oaths are given in the:", "Third Schedule"],
      ["A Minister takes the required oaths:", "Before entering office"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Oath of office only", "Prime Minister", "Chief Justice of India", "Second Schedule", "Fourth Schedule", "After six months"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ARTICLE75_V1.sourceFactIds;
  } else if (ql === 9) {
    const variants = [
      ["Union Ministers hold office during the pleasure of the:", "President"],
      ["The pleasure clause for Union Ministers appears in:", "Article 75"],
      ["The pleasure clause should be read within India's:", "Parliamentary system"],
      ["A separate fixed constitutional term for each Union Minister is:", "Not provided"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Prime Minister", "Lok Sabha Speaker", "Article 74", "Article 78", "Presidential system", "Five years", "Provided for all Ministers"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ARTICLE75_V1.sourceFactIds;
  } else if (ql === 10) {
    const variants = [
      ["Union executive action is expressed to be taken in the name of the:", "President"],
      ["Orders made in the President's name are authenticated according to:", "Rules made for that purpose"],
      ["Rules for allocation of Union government business among Ministers are made by the:", "President"],
      ["Conduct of Government of India business is mainly covered by:", "Article 77"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Prime Minister personally", "Speaker of Lok Sabha", "Election Commission", "Article 75", "Article 78", "Cabinet Secretary alone"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ARTICLE77_V1.sourceFactIds;
  } else if (ql === 11) {
    const variants = [
      ["Who communicates Council decisions to the President?", "Prime Minister"],
      ["Who must provide Union administration information when the President asks?", "Prime Minister"],
      ["The President may require an individual Minister's decision to be placed before the:", "Council of Ministers"],
      ["The Prime Minister's information duties to the President are under:", "Article 78"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Home Minister", "Cabinet Secretary", "Lok Sabha Speaker", "Rajya Sabha", "Article 77", "Article 88"], correct, `${qlId}:${row}`, target);
    sourceFactIds = ["pol-cp009-art78"];
  } else if (ql === 12) {
    const variants = [
      ["The President asks for details of a proposed Union law. Who must provide them?", "Prime Minister"],
      ["A Minister decides a matter not considered by the Council. The President may require it to be placed before:", "Council of Ministers"],
      ["Council decisions on Union administration must be communicated to the President by the:", "Prime Minister"],
      ["Article 78 mainly creates:", "Specified information duties of the Prime Minister towards the President"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Attorney-General", "Speaker of Lok Sabha", "Rajya Sabha", "Supreme Court", "Direct presidential control of all ministries", "A voting right for the President in Parliament"], correct, `${qlId}:${row}`, target);
    sourceFactIds = ["pol-cp009-art78"];
  } else if (ql === 13) {
    const variants = [
      ["A Union Minister may speak in:", "Either House of Parliament"],
      ["A Union Minister may take part in a joint sitting:", "Yes"],
      ["A Minister may take part in a parliamentary committee when:", "Named as a member of that committee"],
      ["Article 88 by itself gives a Minister a right to vote in either House:", "No"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Lok Sabha only", "Rajya Sabha only", "No", "Only with the President's permission", "Every committee automatically", "Yes"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ARTICLE88_V1.sourceFactIds;
  } else if (ql === 14) {
    const variants = [
      ["For Article 352, the Union Cabinet includes:", "Prime Minister and Ministers of Cabinet rank"],
      ["The Cabinet is best described as:", "The Cabinet-rank group within the wider Council of Ministers"],
      ["The constitutional Cabinet definition appears in:", "Article 352(3)"],
      ["Compared with the Council of Ministers, the Cabinet is:", "Narrower"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Every Union Minister", "Only the Prime Minister", "All MPs of the ruling party", "The entire Parliament", "Article 75(5)", "Wider", "Exactly identical in membership"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_CABINET_V1.sourceFactIds;
  } else if (ql === 15) {
    const variants = [
      ["Article 75(1B) links ministerial appointment with disqualification under the:", "Tenth Schedule"],
      ["The anti-defection bar on ministerial appointment was inserted by the:", "Ninety-first Amendment"],
      ["A member disqualified under paragraph 2 of the Tenth Schedule may also be barred from becoming a:", "Minister"],
      ["Article 75(1B) mainly concerns:", "Ministerial eligibility after specified anti-defection disqualification"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Ninth Schedule", "Seventh Schedule", "Fifty-second Amendment", "Forty-fourth Amendment", "Governor", "Judge", "Election Commissioner"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ANTI_DEFECTION_V1.sourceFactIds;
  } else if (ql === 16) {
    const variants = [
      ["Who may determine salaries and allowances of Union Ministers by law?", "Parliament"],
      ["Until Parliament determines them by law, ministerial salaries refer to the:", "Second Schedule"],
      ["Ministerial salaries are mainly dealt with in:", "Article 75"],
      ["The President alone fixes Union Ministers' salaries under Article 75:", "No"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "President", "Supreme Court", "Finance Commission", "Third Schedule", "Article 78", "Yes"], correct, `${qlId}:${row}`, target);
    sourceFactIds = POL_CP009_ARTICLE75_V1.sourceFactIds;
  } else if (ql === 17) {
    const sets = [
      [["The President appoints the Prime Minister.", "The Council is collectively responsible to Lok Sabha.", "A non-MP Minister can remain outside Parliament indefinitely."], "Statements 1 and 2 only"],
      [["Other Ministers are appointed on the Prime Minister's advice.", "The Council is collectively responsible to Rajya Sabha.", "Article 78 gives the Prime Minister duties towards the President."], "Statements 1 and 3 only"],
      [["The 15% cap includes the Prime Minister.", "The President administers ministerial oaths.", "Article 78 lists duties of the Prime Minister towards the President."], "All three"],
      [["Article 88 allows a Minister to speak in either House.", "Article 88 itself gives a Minister a vote in either House.", "A Minister may take part in a joint sitting."], "Statements 1 and 3 only"],
    ];
    const [statements, ans] = sets[row] as [string[], string];
    stem = `Consider the following statements:\n1. ${statements[0]}\n2. ${statements[1]}\n3. ${statements[2]}\nWhich are correct?`;
    correct = ans;
    options = moveCorrect(["Statement 1 only", "Statements 1 and 2 only", "Statements 1 and 3 only", "All three"], correct, target);
    sourceFactIds = ["pol-cp009-integrated"];
  } else {
    const variants = [
      ["Who appoints the Prime Minister, and on whose advice are other Ministers appointed?", "President; Prime Minister"],
      ["After reconsideration, returned ministerial advice is:", "Binding on the President"],
      ["Collective responsibility and Prime Minister's information duties are mainly linked to:", "Lok Sabha and the President respectively"],
      ["Which statement correctly distinguishes Cabinet from Council of Ministers?", "Cabinet is the Cabinet-rank group within the wider Council"],
    ];
    [stem, correct] = variants[row];
    options = chooseFour([correct, "Prime Minister; President", "Lok Sabha; Rajya Sabha", "Not binding on the President", "Rajya Sabha and Supreme Court respectively", "Cabinet includes every Minister automatically", "Council is narrower than Cabinet"], correct, `${qlId}:${row}`, target);
    sourceFactIds = ["pol-cp009-integrated-distinction"];
  }

  const exp = explanation(ql, row, correct);
  const words = exp.trim().split(/\s+/).length;
  if (words < 11 || words > 30) throw new Error(`Explanation length ${qlId}/${row}: ${words}`);
  if (!stem.startsWith("Consider the following statements") && stem.trim().split(/\s+/).length > 28) throw new Error(`Long stem ${qlId}/${row}`);

  return {
    questionId: `POL-CP009-V1-${String(globalIndex + 1).padStart(3, "0")}`,
    qlId,
    qlName: qlNames[ql],
    difficulty: difficulty(ql),
    stem,
    options,
    correctIndex: options.indexOf(correct),
    canonicalAnswer: correct,
    explanation: exp,
    sourceIds: [C],
    sourceFactIds,
    reviewOnly: true,
    runtimeEligible: false,
  };
}

export function generatePolCp009ReviewBatchV1(): PolCp009ReviewQuestion[] {
  const questions: PolCp009ReviewQuestion[] = [];
  for (let ql = 1; ql <= 18; ql += 1) {
    for (let row = 0; row < 4; row += 1) questions.push(make(ql, row, questions.length));
  }
  return questions;
}
