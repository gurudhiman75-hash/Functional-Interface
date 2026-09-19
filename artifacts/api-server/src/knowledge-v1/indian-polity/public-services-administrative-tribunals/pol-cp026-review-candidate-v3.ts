import type { PolCp026ReviewQuestion } from "./pol-cp026-types";
import { generatePolCp026ReviewBatchV1 } from "./pol-cp026-review-candidate-v1";

type Replacement = {
  stem: string;
  answer: string;
  distractors: [string,string,string];
  explanation: string;
};

const R: Replacement[] = [
  {
    stem: "Articles 309–314 belong to which constitutional chapter?",
    answer: "Part XIV, Chapter I — Services",
    distractors: ["Part XIVA — Tribunals", "Part XV — Elections", "Part XVII — Official Language"],
    explanation: "Articles 309–314 form Chapter I of Part XIV, the Services chapter. Public Service Commissions are outside this CP's ownership.",
  },
  {
    stem: "Which sequence correctly describes the closing portion of the Services chapter?",
    answer: "Article 312A — specified service conditions; Article 313 — transitional laws; Article 314 — omitted",
    distractors: [
      "Article 312A — tribunals; Article 313 — elections; Article 314 — Finance Commission",
      "Article 312A — Governor; Article 313 — High Courts; Article 314 — languages",
      "Article 312A — emergency; Article 313 — citizenship; Article 314 — taxation",
    ],
    explanation: "The closing sequence is Article 312A on specified service conditions, Article 313 on transitional service laws, followed by omitted Article 314.",
  },
  {
    stem: "Which statement correctly distinguishes Articles 313 and 314?",
    answer: "Article 313 continues certain existing service laws; Article 314 is omitted",
    distractors: [
      "Both Articles are omitted",
      "Article 313 creates All-India Services; Article 314 creates tribunals",
      "Article 313 concerns elections; Article 314 concerns taxation",
    ],
    explanation: "Article 313 preserves applicable pre-Constitution service laws subject to constitutional consistency, whereas Article 314 is omitted in the current text.",
  },
  {
    stem: "The Services chapter in Part XIV ends, in the current numbering, with:",
    answer: "Omitted Article 314",
    distractors: ["Article 312 only", "Article 323A", "Article 324"],
    explanation: "Chapter I of Part XIV runs through Article 314. Article 314 remains in the numbering but is shown as omitted.",
  },
];

function place(answer:string,distractors:[string,string,string],correctIndex:0|1|2|3):[string,string,string,string]{
  const options=[...distractors];
  options.splice(correctIndex,0,answer);
  if(new Set(options).size!==4) throw new Error("CP026 V3 replacement contains duplicate options");
  return options as [string,string,string,string];
}

export function generatePolCp026ReviewBatchV3(): PolCp026ReviewQuestion[] {
  return generatePolCp026ReviewBatchV1().map((q,index)=>{
    const questionId=`POL-CP026-V3-${String(index+1).padStart(3,"0")}`;
    if(index<48 || index>51) return {...q,questionId};
    const r=R[index-48];
    const words=r.explanation.trim().split(/\s+/).length;
    if(words<13 || words>42) throw new Error(`CP026 V3 explanation length ${words} at ${index+1}`);
    return {
      ...q,
      questionId,
      stem:r.stem,
      options:place(r.answer,r.distractors,q.correctIndex),
      explanation:r.explanation,
    };
  });
}
