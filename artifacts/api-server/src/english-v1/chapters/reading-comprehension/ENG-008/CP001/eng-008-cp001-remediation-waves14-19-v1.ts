import type { Eng008ExpansionSpec } from "../eng-008-expansion-factory-v1";
import { ENG008_WAVE14_FOUNDATION_SPECS, ENG008_CP001_EXPANSION_WAVE14_V1 } from "../eng-008-expansion-wave14-v1";
import { ENG008_WAVE15_FOUNDATION_SPECS, ENG008_CP001_EXPANSION_WAVE15_V1 } from "../eng-008-expansion-wave15-v1";
import { ENG008_WAVE16_FOUNDATION_SPECS, ENG008_CP001_EXPANSION_WAVE16_V1 } from "../eng-008-expansion-wave16-v1";
import { ENG008_WAVE17_FOUNDATION_SPECS, ENG008_CP001_EXPANSION_WAVE17_V1 } from "../eng-008-expansion-wave17-v1";
import { ENG008_WAVE18_FOUNDATION_SPECS, ENG008_CP001_EXPANSION_WAVE18_V1 } from "../eng-008-expansion-wave18-v1";
import { ENG008_WAVE19_FOUNDATION_SPECS, ENG008_CP001_EXPANSION_WAVE19_V1 } from "../eng-008-expansion-wave19-v1";

type ExistingQuestion={id:string;familyId:string;difficulty:string;question:string;correctAnswer:string;distractors:readonly [string,string,string];explanation:string;evidence:string};
type ExistingPassage={id:string;title:string;genre:string;text:string;questions:readonly ExistingQuestion[]};

const wc=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;
const stableIndex=(id:string,mod:number)=>{let h=0;for(const ch of id)h=(h*33+ch.charCodeAt(0))>>>0;return h%mod;};

const finish=(paras:string[],s:Eng008ExpansionSpec)=>{
  const extra=[
    `The important difference was that ${s.contrast}.`,
    `That is why ${s.inference}.`,
    `The word "${s.keyword}" means ${s.keywordMeaning} here.`,
    `The people involved understood the situation better once the relevant condition was made explicit.`,
    `The example shows that a correct detail can still be misleading when it is separated from its context.`,
    `The broader lesson is that ${s.idea}.`,
    `No new rule was needed; the existing information simply had to be read more carefully.`,
    `The final decision became easier once the sequence of events was clear.`
  ];
  let i=stableIndex(s.id,extra.length);
  while(wc(paras.join("\n\n"))<180){paras[(i+paras.length)%paras.length]+=" "+extra[i%extra.length];i++;}
  const text=paras.join("\n\n");
  if(wc(text)>250)throw new Error(`${s.id} remediation generated ${wc(text)} words`);
  return text;
};

const makeText=(s:Eng008ExpansionSpec)=>{
  const variants=[
    [
      `In ${s.setting}, ${s.fact}. At first, the situation seemed simple because most people noticed only the most visible detail. ${s.detail}`,
      `The confusion was cleared up when the surrounding record was checked. ${s.reason}. That showed why the first assumption was understandable but incomplete.`,
      `After the difference was explained, ${s.inference}. The change made the process easier to follow without creating a new rule.`,
      `In the passage, "${s.keyword}" means ${s.keywordMeaning}. This matters because ${s.contrast}.`,
      `The episode supports a simple lesson: ${s.idea}. Careful reading of the full situation matters more than reacting to one clue.`
    ],
    [
      `${s.fact}. This ordinary event in ${s.setting} caused confusion because the visible result appeared to give a complete answer. ${s.detail}`,
      `A closer check showed that ${s.reason}. The earlier conclusion therefore had to be corrected rather than simply accepted.`,
      `${s.inference}. Once that point was understood, the sequence of events became much easier to explain.`,
      `The word "${s.keyword}" is used to mean ${s.keywordMeaning}. The definition helps the reader understand why ${s.contrast}.`,
      `The main idea is that ${s.idea}. The passage shows how small pieces of context can prevent a larger misunderstanding.`
    ],
    [
      `A routine situation at ${s.setting} became puzzling when ${s.fact}. People first relied on what they could see immediately. ${s.detail}`,
      `The problem was that ${s.reason}. The record therefore needed to be read as part of a process, not as an isolated label.`,
      `Once the process was understood, ${s.inference}. The solution came from clearer interpretation rather than from changing the basic rule.`,
      `Here, "${s.keyword}" means ${s.keywordMeaning}. It is important because ${s.contrast}.`,
      `The broader lesson is that ${s.idea}. The passage rewards a reader who checks the whole sequence before deciding what happened.`
    ],
    [
      `At ${s.setting}, a small mistake in interpretation followed after ${s.fact}. The fact itself was correct, but it did not explain everything. ${s.detail}`,
      `The missing context was that ${s.reason}. Once this was noticed, the apparent contradiction could be resolved.`,
      `${s.inference}. This practical result followed directly from understanding which part of the process each detail described.`,
      `The passage uses "${s.keyword}" to mean ${s.keywordMeaning}. That meaning fits the contrast that ${s.contrast}.`,
      `The incident illustrates that ${s.idea}. A clear label or condition can sometimes prevent more confusion than an additional rule.`
    ],
    [
      `The passage describes a simple problem in ${s.setting}: ${s.fact}. Several people initially read the situation too quickly. ${s.detail}`,
      `Their first interpretation was incomplete because ${s.reason}. The governing record gave the missing piece of information.`,
      `After that check, ${s.inference}. The process did not become more complicated; it became easier to understand.`,
      `"${s.keyword}" means ${s.keywordMeaning} in this context. The definition matters because ${s.contrast}.`,
      `The passage ends with the broader idea that ${s.idea}. It shows why everyday records need enough context to be used correctly.`
    ],
    [
      `A small but useful example from ${s.setting} begins when ${s.fact}. The visible detail encouraged a quick conclusion. ${s.detail}`,
      `That conclusion changed after people realised that ${s.reason}. The difference between the two stages was more important than it first appeared.`,
      `${s.inference}. The correction helped users apply the existing process more consistently.`,
      `The term "${s.keyword}" means ${s.keywordMeaning}. It clarifies the passage's central contrast: ${s.contrast}.`,
      `The main lesson is that ${s.idea}. The passage therefore favours careful interpretation over guesswork.`
    ]
  ] as const;
  return finish([...variants[stableIndex(s.id,variants.length)]],s);
};

const prompts:Record<string,readonly string[]>={
 "RC-F01":["Which fact is stated in the passage?","Which detail is directly mentioned?","According to the passage, what happened?","Which statement is explicitly given?"],
 "RC-F02":["Why was the first assumption incomplete?","What caused the initial misunderstanding?","Why did the first interpretation need correction?","What explains the confusion described?"],
 "RC-F03":["What is the central idea of the passage?","Which statement best summarises the passage?","What broader lesson does the passage develop?","Which option best captures the main idea?"],
 "RC-F04":["Which title best suits the passage?","Choose the most appropriate title.","Which heading best reflects the passage?","Which title best captures the incident?"],
 "RC-F05":["What does the key word mean in context?","Which meaning best fits the key word?","How is the highlighted word used here?","Which option gives the contextual meaning?"],
 "RC-F06":["Which inference is best supported?","What can reasonably be inferred?","Which conclusion follows from the passage?","Which statement is supported by the passage?"]
};

const wrongs=(familyId:string,s:Eng008ExpansionSpec):readonly [string,string,string]=>{
 switch(familyId){
  case "RC-F01":return ["the passage says no record existed","the passage says the process was cancelled entirely","the passage says every visible detail meant exactly the same thing"];
  case "RC-F02":return ["because the governing record had been destroyed","because everyone already understood the same stage correctly","because the rule had no conditions or timing"];
  case "RC-F03":return ["visible labels should always be accepted without context","similar-looking outcomes must always have the same cause","records become useful only when all stages are removed"];
  case "RC-F04":return [`Why ${s.subject} Should Be Ignored`,"A Rule With No Record","When Every Detail Means the Same Thing"];
  case "RC-F05":return ["an unrelated exception that cancels the rule","a permanent ending of the process","a decorative label with no practical meaning"];
  case "RC-F06":return ["the first visible clue makes all later evidence unnecessary","every future case must produce the same result","the passage shows that timing and conditions never matter"];
  default:return ["an unsupported claim","a reversed conclusion","an unrelated detail"];
 }
};

const evidenceFor=(familyId:string,s:Eng008ExpansionSpec)=>{
 switch(familyId){
  case "RC-F01":return s.fact;
  case "RC-F02":return s.reason;
  case "RC-F03":return s.idea;
  case "RC-F04":return s.title;
  case "RC-F05":return `${s.keyword}: ${s.keywordMeaning}`;
  case "RC-F06":return s.inference;
  default:return s.detail;
 }
};

const explanationFor=(familyId:string,s:Eng008ExpansionSpec,answer:string)=>{
 switch(familyId){
  case "RC-F01":return `The passage states directly that ${s.fact}. The other options contradict the record or turn a limited event into an absolute claim.`;
  case "RC-F02":return `The first assumption was incomplete because ${s.reason}. That is the missing condition that changes how the visible result should be understood.`;
  case "RC-F03":return `The passage moves from the incident to the wider idea that ${s.idea}. The correction and final contrast both support this central lesson.`;
  case "RC-F04":return `“${s.title}” is the best title because it names the specific situation while also matching the passage's main idea: ${s.idea}.`;
  case "RC-F05":return `In context, “${s.keyword}” means ${s.keywordMeaning}. The surrounding sentences use the word in this practical sense.`;
  case "RC-F06":return `The supported inference is that ${s.inference}. It follows from the correction described in the passage without adding an unsupported claim.`;
  default:return `The answer follows from the passage evidence: ${evidenceFor(familyId,s)}.`;
 }
};

const remediateQuestions=(s:Eng008ExpansionSpec,qs:readonly ExistingQuestion[])=>qs.map(q=>{
 const pv=prompts[q.familyId]??[q.question];
 let question=pv[stableIndex(s.id+q.familyId,pv.length)]!;
 if(q.familyId==="RC-F05")question=question.replace("the key word",`“${s.keyword}”`);
 const distractors=wrongs(q.familyId,s);
 if(new Set([q.correctAnswer,...distractors].map(x=>x.toLowerCase())).size!==4)throw new Error(`${s.id} ${q.familyId} option collision`);
 return {...q,question,distractors,explanation:explanationFor(q.familyId,s,q.correctAnswer),evidence:evidenceFor(q.familyId,s)};
});

const rebuild=(specs:readonly Eng008ExpansionSpec[],existing:readonly ExistingPassage[])=>{
 const byId=new Map(existing.map(x=>[x.id,x]));
 return specs.map(s=>{const old=byId.get(s.id);if(!old)throw new Error("Missing existing CP001 passage "+s.id);return {...old,text:makeText(s),questions:remediateQuestions(s,old.questions)};});
};

export const ENG008_CP001_REMEDIATED_WAVE14_V1=rebuild(ENG008_WAVE14_FOUNDATION_SPECS,ENG008_CP001_EXPANSION_WAVE14_V1) as any;
export const ENG008_CP001_REMEDIATED_WAVE15_V1=rebuild(ENG008_WAVE15_FOUNDATION_SPECS,ENG008_CP001_EXPANSION_WAVE15_V1) as any;
export const ENG008_CP001_REMEDIATED_WAVE16_V1=rebuild(ENG008_WAVE16_FOUNDATION_SPECS,ENG008_CP001_EXPANSION_WAVE16_V1) as any;
export const ENG008_CP001_REMEDIATED_WAVE17_V1=rebuild(ENG008_WAVE17_FOUNDATION_SPECS,ENG008_CP001_EXPANSION_WAVE17_V1) as any;
export const ENG008_CP001_REMEDIATED_WAVE18_V1=rebuild(ENG008_WAVE18_FOUNDATION_SPECS,ENG008_CP001_EXPANSION_WAVE18_V1) as any;
export const ENG008_CP001_REMEDIATED_WAVE19_V1=rebuild(ENG008_WAVE19_FOUNDATION_SPECS,ENG008_CP001_EXPANSION_WAVE19_V1) as any;
