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
  type PolCp004Sourced,
} from "./pol-cp004-facts";
import type { PolCp004ReviewQuestion } from "./pol-cp004-review-types";

const qlNames: Record<number, string> = {
  1:"Article → subject",2:"Subject → Article",3:"Fundamental Right group",4:"Who can claim the right",5:"Equality Articles 14–18",
  6:"Article 19 freedoms",7:"Not an Article 19 freedom",8:"Article 19(2) restriction grounds",9:"Article 20 protections",10:"Articles 21 and 21A",
  11:"Article 22 safeguards",12:"Articles 23 and 24",13:"Religion Articles 25–28",14:"Articles 29 and 30",15:"Article 32 remedies",
  16:"Writ → purpose",17:"Writ scenario",18:"Articles 33–35",19:"Part III and property",20:"Integrated statements",
};

const difficulty = (ql: number): KnowledgeV1Difficulty => [1,2,3,6,10,15].includes(ql) ? "Easy" : [17,20].includes(ql) ? "Hard" : "Medium";
const article = (n: string) => POL_CP004_ARTICLES_V1.find((r) => r.article === n)!;

function meta(items: readonly PolCp004Sourced[]) {
  return {
    sourceIds: [...new Set(items.flatMap((i) => [...i.sourceIds]))],
    sourceFactIds: [...new Set(items.flatMap((i) => [...i.sourceFactIds]))],
  };
}

function options(correct: string, pool: readonly string[], target: number, offset = 0) {
  const unique = [...new Set(pool.filter((v) => v !== correct))];
  if (unique.length < 3) throw new Error(`Need three distractors for ${correct}`);
  const wrong = [unique[offset % unique.length], unique[(offset + 1) % unique.length], unique[(offset + 2) % unique.length]];
  if (new Set(wrong).size < 3) throw new Error(`Duplicate distractors for ${correct}`);
  const out = [...wrong, correct];
  const ci = out.indexOf(correct);
  [out[ci], out[target]] = [out[target], out[ci]];
  return out;
}

function push(
  out: PolCp004ReviewQuestion[], ql: number, stem: string, correct: string, distractors: readonly string[], explanation: string, used: readonly PolCp004Sourced[], offset = 0,
) {
  const index = out.length;
  const target = index % 4;
  const opts = options(correct, distractors, target, offset);
  out.push({
    questionId:`POL-CP004-V2-${String(index+1).padStart(3,"0")}`,chapterId:"POL-001",cpId:"POL-CP-004",
    qlId:`POL-004-QL-${String(ql).padStart(3,"0")}`,qlName:qlNames[ql],difficulty:difficulty(ql),stem,options:opts,correctIndex:target,
    canonicalAnswer:correct,explanation,...meta(used),reviewOnly:true,runtimeRegistered:false,
  });
}

export function generatePolCp004ReviewBatchV2() {
  const out: PolCp004ReviewQuestion[] = [];
  const core = POL_CP004_ARTICLES_V1.filter((r) => !["12","13","33","34","35"].includes(r.article));

  // QL 1 — 4
  ["14","19","25","32"].forEach((n,i)=>{const r=article(n);push(out,1,`Article ${n} deals with:`,r.subject,core.map(x=>x.subject),r.simpleRule,[r],i+2)});

  // QL 2 — 4
  ["17","21A","24","30"].forEach((n,i)=>{const r=article(n);push(out,2,`${r.subject} is provided under:`,`Article ${n}`,core.map(x=>`Article ${x.article}`),r.simpleRule,[r],i+3)});

  // QL 3 — 3
  const groups = [
    ["Right to Equality","Articles 14–18"],["Right to Freedom","Articles 19–22"],["Right against Exploitation","Articles 23–24"],
  ] as const;
  const groupPool=["Articles 14–18","Articles 19–22","Articles 23–24","Articles 25–28","Articles 29–30"];
  groups.forEach(([name,ans],i)=>push(out,3,`${name} is mainly covered by:`,ans,groupPool,`${name} is mainly covered by ${ans}.`,[article(i===0?"14":i===1?"19":"23")],i));

  // QL 4 — 4
  [0,1,3,6].forEach((idx,i)=>{const r=POL_CP004_RIGHT_HOLDERS_V1[idx]; const a=r.right.match(/Article (\d+A?)/)?.[1] ?? "14"; const ar=article(a);
    push(out,4,`${r.right} is available to:`,r.holder,["All persons","Citizens","Citizens only","Religious and linguistic minorities","Only public servants"],ar.simpleRule,[ar],i+1)});

  // QL 5 — 4
  ["14","16","17","18"].forEach((n,i)=>{const r=article(n); const rows=POL_CP004_ARTICLES_V1.filter(x=>x.group==="equality");
    push(out,5,`Article ${n} provides for:`,r.subject,rows.map(x=>x.subject),r.simpleRule,[r],i)});

  // QL 6 — 4
  const non19=["Right to vote","Right to strike","Right to property as a Fundamental Right","Right to free higher education"];
  [0,1,4,5].forEach((idx,i)=>{const f=POL_CP004_ARTICLE19_FREEDOMS_V1[idx];push(out,6,"Which of the following is a freedom under Article 19?",f,non19,`Article 19 includes ${f.toLowerCase()}.`,[article("19")],i)});

  // QL 7 — 3
  ["Right to property","Right to strike","Right to vote"].forEach((ans,i)=>push(out,7,"Which of the following is NOT one of the six freedoms under Article 19?",ans,POL_CP004_ARTICLE19_FREEDOMS_V1,`Article 19 lists six freedoms. ${ans} is not one of them.`,[article("19")],i));

  // QL 8 — 3
  [0,3,6].forEach((idx,i)=>{const g=POL_CP004_ARTICLE19_SPEECH_RESTRICTIONS_V1[idx];push(out,8,"A restriction on freedom of speech under Article 19(2) may be based on:",g,["Administrative convenience alone","Any criticism of government","A general dislike of dissent","Any peaceful disagreement"],`${g} is a ground listed in Article 19(2).`,[article("19")],i)});

  // QL 9 — 4
  const art20Pool=[...POL_CP004_ARTICLE20_PROTECTIONS_V1.map(x=>x.meaning),"A person must be released after twelve hours in every criminal case."];
  [0,1,2,0].forEach((idx,i)=>{const r=POL_CP004_ARTICLE20_PROTECTIONS_V1[idx]; if(i<3) push(out,9,`${r.label} under Article 20 means:`,r.meaning,art20Pool,`Article 20 protects against ${r.label.toLowerCase()}.`,[article("20")],i);
    else push(out,9,"Being prosecuted and punished for the same offence more than once is called:","Double jeopardy",["Self-incrimination","Preventive detention","Ex post facto punishment","Judicial review"],"Double jeopardy is one of the protections under Article 20.",[article("20")],0)});

  // QL 10 — 3
  push(out,10,"Protection of life and personal liberty is provided by:","Article 21",["Article 20","Article 21A","Article 22","Article 24"],article("21").simpleRule,[article("21")]);
  push(out,10,"Free and compulsory education for children aged six to fourteen is provided by:","Article 21A",["Article 21","Article 24","Article 30","Article 19"],article("21A").simpleRule,[article("21A")]);
  push(out,10,"The age group mentioned in Article 21A is:","6 to 14 years",["5 to 14 years","6 to 16 years","8 to 18 years","5 to 18 years"],article("21A").simpleRule,[article("21A")]);

  // QL 11 — 4
  const bad22=["Automatic release in every case after twelve hours.","A right to choose the trial judge.","A right to demand trial only by the Supreme Court.","A right to avoid every form of questioning."];
  POL_CP004_ARTICLE22_SAFEGUARDS_V1.forEach((s,i)=>push(out,11,"Which safeguard is provided by Article 22 for an arrested person?",s,bad22,article("22").simpleRule,[article("22")],i));

  // QL 12 — 3
  push(out,12,"Traffic in human beings and begar are prohibited by:","Article 23",["Article 24","Article 21","Article 19","Article 25"],article("23").simpleRule,[article("23")]);
  push(out,12,"Employment of children below fourteen in factories and mines is prohibited by:","Article 24",["Article 23","Article 21A","Article 29","Article 30"],article("24").simpleRule,[article("24")]);
  push(out,12,"Articles 23 and 24 together form the:","Right against Exploitation",["Right to Equality","Right to Freedom of Religion","Cultural and Educational Rights","Right to Constitutional Remedies"],"Articles 23 and 24 protect against exploitation.",[article("23"),article("24")]);

  // QL 13 — 4
  ["25","26","27","28"].forEach((n,i)=>{const r=article(n);const rows=POL_CP004_ARTICLES_V1.filter(x=>x.group==="religion");push(out,13,`Article ${n} deals with:`,r.subject,rows.map(x=>x.subject),r.simpleRule,[r],i)});

  // QL 14 — 3
  push(out,14,"The right to conserve a distinct language, script or culture is protected by:","Article 29",["Article 28","Article 30","Article 32","Article 21A"],article("29").simpleRule,[article("29")]);
  push(out,14,"Religious and linguistic minorities may establish and administer educational institutions under:","Article 30",["Article 29","Article 25","Article 21A","Article 28"],article("30").simpleRule,[article("30")]);
  push(out,14,"Articles 29 and 30 are known as:","Cultural and Educational Rights",["Right against Exploitation","Right to Constitutional Remedies","Right to Equality","Right to Freedom"],"Articles 29 and 30 protect cultural and educational rights.",[article("29"),article("30")]);

  // QL 15 — 3
  push(out,15,"The right to move the Supreme Court for enforcement of Fundamental Rights is guaranteed by:","Article 32",["Article 21","Article 30","Article 35","Article 19"],article("32").simpleRule,[article("32")]);
  push(out,15,"Under Article 32, the Supreme Court may issue:","Constitutional writs",["Money Bills","Ordinances","Election notifications","Finance Commission reports"],article("32").simpleRule,[article("32")]);
  push(out,15,"Article 32 is mainly connected with:","Enforcement of Fundamental Rights",["Creation of new States","Citizenship at commencement","Public employment reservations","Official language"],article("32").simpleRule,[article("32")]);

  // QL 16 — 5
  POL_CP004_WRITS_V1.forEach((r,i)=>push(out,16,`${r.writ} is mainly used:`,r.purpose,POL_CP004_WRITS_V1.map(x=>x.purpose),`${r.writ}: ${r.purpose}.`,[r],i));

  // QL 17 — 4
  const scenarios=[
    ["A person is allegedly held without lawful authority. Which writ is most appropriate?","Habeas Corpus"],
    ["A public authority refuses to perform a legal public duty. Which writ is most appropriate?","Mandamus"],
    ["A lower tribunal is about to continue a case beyond its jurisdiction. Which writ is most appropriate?","Prohibition"],
    ["The legal authority of a person to hold a public office is challenged. Which writ is most appropriate?","Quo Warranto"],
  ] as const;
  scenarios.forEach(([s,a],i)=>{const r=POL_CP004_WRITS_V1.find(x=>x.writ===a)!;push(out,17,s,a,POL_CP004_WRITS_V1.map(x=>x.writ),`${a}: ${r.purpose}.`,[r],i)});

  // QL 18 — 3
  ["33","34","35"].forEach((n,i)=>{const r=article(n);push(out,18,`Article ${n} deals with:`,r.subject,[article("33").subject,article("34").subject,article("35").subject,"Right to education"],r.simpleRule,[r],i)});

  // QL 19 — 3
  push(out,19,"Fundamental Rights are mainly contained in:","Part III",["Part II","Part IV","Part IVA","Part V"],POL_CP004_BOUNDARY_FACTS_V1[1].statement,[POL_CP004_BOUNDARY_FACTS_V1[1]]);
  push(out,19,"The right to property is presently protected under:","Article 300A",["Article 19","Article 31 as a Fundamental Right","Article 32","Article 21A"],POL_CP004_BOUNDARY_FACTS_V1[0].statement,[POL_CP004_BOUNDARY_FACTS_V1[0]]);
  push(out,19,"Which statement about the right to property is correct?","It is a constitutional right, not a Fundamental Right.",["It is one of the six Article 19 freedoms.","It is a separate Fundamental Right under Article 32.","It is available only to citizens under Article 19.","It is part of the Right against Exploitation."],POL_CP004_BOUNDARY_FACTS_V1[0].statement,[POL_CP004_BOUNDARY_FACTS_V1[0]]);

  // QL 20 — 4
  const blocks=[
    {s:["Article 14 is available to all persons.","Article 19 freedoms are available only to citizens.","Article 30 protects religious and linguistic minorities."],a:"All three",e:"All three statements are correct.",u:[article("14"),article("19"),article("30")]},
    {s:["Article 17 abolishes untouchability.","Article 24 prohibits specified child labour.","Article 27 guarantees equality in public employment."],a:"Only two",e:"Statements 1 and 2 are correct. Equality of opportunity in public employment is under Article 16.",u:[article("17"),article("24"),article("16"),article("27")]},
    {s:["Article 20 protects against double jeopardy.","Article 21A covers children aged six to fourteen.","Article 32 deals with admission of new States."],a:"Only two",e:"Statements 1 and 2 are correct. Article 32 deals with constitutional remedies.",u:[article("20"),article("21A"),article("32")]},
    {s:["Habeas Corpus concerns unlawful detention.","Quo Warranto questions authority to hold a public office.","Mandamus is used to quash an order already made by a lower court."],a:"Only two",e:"Statements 1 and 2 are correct. Mandamus commands performance of a public duty; Certiorari is used to quash an order on recognised grounds.",u:[POL_CP004_WRITS_V1[0],POL_CP004_WRITS_V1[1],POL_CP004_WRITS_V1[3],POL_CP004_WRITS_V1[4]]},
  ];
  blocks.forEach((b,i)=>push(out,20,`Consider the following statements:\n1. ${b.s[0]}\n2. ${b.s[1]}\n3. ${b.s[2]}\nHow many statements are correct?`,b.a,["None","Only one","Only two","All three"],b.e,b.u,i));

  if (out.length !== 72) throw new Error(`Expected 72 questions, got ${out.length}`);
  return out;
}
