import type { Eng008ExpansionSpec } from "../eng-008-expansion-factory-v1";
import { ENG008_WAVE14_EDITORIAL_SPECS, ENG008_CP002_EXPANSION_WAVE14_V1 } from "../eng-008-expansion-wave14-v1";
import { ENG008_WAVE15_EDITORIAL_SPECS, ENG008_CP002_EXPANSION_WAVE15_V1 } from "../eng-008-expansion-wave15-v1";
import { ENG008_WAVE16_EDITORIAL_SPECS, ENG008_CP002_EXPANSION_WAVE16_V1 } from "../eng-008-expansion-wave16-v1";
import { ENG008_WAVE17_EDITORIAL_SPECS, ENG008_CP002_EXPANSION_WAVE17_V1 } from "../eng-008-expansion-wave17-v1";
import { ENG008_WAVE18_EDITORIAL_SPECS, ENG008_CP002_EXPANSION_WAVE18_V1 } from "../eng-008-expansion-wave18-v1";
import { ENG008_WAVE19_EDITORIAL_SPECS, ENG008_CP002_EXPANSION_WAVE19_V1 } from "../eng-008-expansion-wave19-v1";

type ExistingQuestion={
  id:string;familyId:string;difficulty:string;question:string;correctAnswer:string;
  distractors:readonly [string,string,string];explanation:string;evidence:string;
};
type ExistingPassage={id:string;title:string;genre:string;text:string;questions:readonly ExistingQuestion[]};

const wc=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;
const stableIndex=(id:string,mod:number)=>{let h=0;for(const ch of id)h=(h*33+ch.charCodeAt(0))>>>0;return h%mod;};

const finish=(paras:string[],s:Eng008ExpansionSpec)=>{
  const extra=[
    `The practical issue is that ${s.contrast}.`,
    `That is why the passage treats ${s.reason} as more than a minor detail.`,
    `The likely consequence is that ${s.inference}.`,
    `The term "${s.keyword}" means ${s.keywordMeaning} in this discussion.`,
    `The argument does not reject useful information; it asks readers to recognise what the information can and cannot show.`,
    `The broader lesson is that ${s.idea}.`,
    `Clear communication matters most when one label can be read in more than one way.`,
    `A small amount of context can prevent an apparently precise message from becoming misleading.`,
    `The author therefore prefers qualified clarity to false precision.`,
    `The example shows how design choices can influence interpretation even when the underlying facts do not change.`
  ];
  let i=stableIndex(s.id,extra.length);
  while(wc(paras.join("\n\n"))<220){paras[(i+paras.length)%paras.length]+=" "+extra[i%extra.length];i++;}
  const text=paras.join("\n\n");
  if(wc(text)>350)throw new Error(`${s.id} remediation generated ${wc(text)} words`);
  return text;
};

const makeText=(s:Eng008ExpansionSpec)=>{
  const variants=[
    [
      `${s.subject} is easy to misunderstand when a single visible result is treated as the whole story. In ${s.setting}, ${s.fact}. ${s.detail}`,
      `The difficulty is that ${s.reason}. Without that context, users can draw a conclusion that feels reasonable but is still incomplete.`,
      `A clearer approach would make the relevant stage, date or condition explicit. ${s.inference}. This improves interpretation without pretending that uncertainty can be removed entirely.`,
      `In this discussion, "${s.keyword}" means ${s.keywordMeaning}. The definition matters because ${s.contrast}.`,
      `The wider point is that ${s.idea}. Good public communication should help readers distinguish a useful indicator from a complete conclusion.`
    ],
    [
      `A familiar problem in ${s.setting} appears when ${s.fact}. The information may be accurate, yet its meaning can still be unclear if the user does not know the stage or condition behind it. ${s.detail}`,
      `${s.reason}. This is why the passage argues for design that reveals the decision path rather than presenting one status as self-explanatory.`,
      `${s.inference}. The aim is not to overload users with detail but to make the decisive distinction visible at the moment it matters.`,
      `The word "${s.keyword}" is used to mean ${s.keywordMeaning}. That meaning helps explain why ${s.contrast}.`,
      `${s.idea}. The passage therefore favours practical clarity over labels that look precise but conceal important limits.`
    ],
    [
      `Public-facing systems often fail not because they lack data, but because they present the data without enough context. ${s.fact}. In ${s.setting}, this created room for users to read one signal too broadly. ${s.detail}`,
      `The reason is that ${s.reason}. A user needs to know what the signal refers to, when it was produced and what remains unresolved.`,
      `Once those distinctions are made visible, ${s.inference}. The improvement comes from interpretation, not from inventing a new rule.`,
      `Here, "${s.keyword}" means ${s.keywordMeaning}. The passage uses the term to sharpen the contrast that ${s.contrast}.`,
      `The argument ultimately supports the view that ${s.idea}. Clear systems do not eliminate uncertainty; they show users where the uncertainty begins and ends.`
    ],
    [
      `${s.fact}. That observation from ${s.setting} illustrates a larger communication problem: users often receive the result before they receive the context needed to interpret it. ${s.detail}`,
      `The passage explains that ${s.reason}. The result is a gap between what the system technically says and what a reasonable user may think it says.`,
      `${s.inference}. A better design would therefore distinguish the current state from the conditions or limits attached to it.`,
      `The key word "${s.keyword}" means ${s.keywordMeaning}. This matters because ${s.contrast}.`,
      `The broader lesson is that ${s.idea}. The passage is measured rather than alarmist: it argues for better signalling, not for abandoning the underlying system.`
    ],
    [
      `In ${s.setting}, ${s.fact}. The case looks minor, but it reveals how easily a correct status can become misleading when the reader assumes more than the status actually says. ${s.detail}`,
      `That risk exists because ${s.reason}. The passage therefore treats timing, scope and wording as parts of the message rather than optional additions.`,
      `A more transparent design would support the inference that ${s.inference}. It would also reduce the need for users to guess what a label means after a problem occurs.`,
      `"${s.keyword}" means ${s.keywordMeaning} in this context. The definition is important because ${s.contrast}.`,
      `The central idea is that ${s.idea}. The strongest communication is often the one that states a limit clearly instead of hiding it behind a simple label.`
    ],
    [
      `The passage examines ${s.subject} through a practical example from ${s.setting}. ${s.fact}. The difficulty arose not from the absence of information, but from the way the information was framed. ${s.detail}`,
      `${s.reason}. This explains why two users can look at the same status and still reach different conclusions.`,
      `${s.inference}. Making that distinction explicit would improve decisions without requiring the system to predict every possible outcome.`,
      `The term "${s.keyword}" means ${s.keywordMeaning}. It reinforces the passage's contrast: ${s.contrast}.`,
      `The wider lesson is that ${s.idea}. The author argues for communication that is simple enough to use but precise enough to prevent false certainty.`
    ]
  ] as const;
  return finish([...variants[stableIndex(s.id,variants.length)]],s);
};

const prompts:Record<string,readonly string[]>={
  "RC2-F01":["Which fact does the passage emphasise?","Which detail is directly stated?","What is the starting fact of the discussion?","Which statement is explicitly mentioned?"],
  "RC2-F02":["What can be inferred from the discussion?","Which inference is best supported?","What conclusion follows from the passage?","Which statement can reasonably be inferred?"],
  "RC2-F03":["Which statement best summarises the passage?","What is the central idea?","Which option best captures the author's main point?","What broader lesson does the passage develop?"],
  "RC2-F04":["What is the author's tone?","How would the tone best be described?","Which description best fits the author's approach?","What tone does the passage maintain?"],
  "RC2-F05":["Why does the author call for clearer decision paths?","What mainly justifies clearer signalling?","Why does the passage favour more explicit context?","What problem is clearer communication meant to solve?"],
  "RC2-F06":["Which conclusion follows most logically?","Which conclusion best fits the argument?","What follows from the passage's reasoning?","Which conclusion stays closest to the evidence?"],
  "RC2-F07":["Which statement is supported by the passage?","Which option is consistent with the passage?","Which statement does the passage support?","Which claim is supported by the information given?"],
  "RC2-F08":["What does the key word mean in context?","Which meaning best fits the key word?","How is the highlighted word used here?","Which option gives the contextual meaning?"]
};

const wrongs=(familyId:string,s:Eng008ExpansionSpec):readonly [string,string,string]=>{
  switch(familyId){
    case "RC2-F01":return ["the passage says the original information was completely fabricated","the system contained no record or status at all","every user interpreted the same signal in exactly the same way"];
    case "RC2-F02":return ["clearer labels would remove the need for any evidence","the passage proves one rule works identically in every context","users should ignore timing whenever a status looks precise"];
    case "RC2-F03":return ["simple labels should replace all contextual information","uncertainty should be hidden so systems appear decisive","a visible result is always enough for a final conclusion"];
    case "RC2-F04":return ["angry and accusatory","celebratory and absolute","sarcastic and dismissive"];
    case "RC2-F05":return ["because users should be prevented from seeing any provisional information","because the author wants every process reduced to a single fixed rule","because dates, stages and definitions never affect interpretation"];
    case "RC2-F06":return ["the first visible signal should always override later context","all uncertainty disappears once a label is added","every similar case must produce the same outcome"];
    case "RC2-F07":return ["the passage rejects all status information as useless","the passage says timing can never affect meaning","the passage claims all related measures are interchangeable"];
    case "RC2-F08":return ["an unrelated exception that cancels the rule","a permanent ending of the process","a decorative label with no practical function"];
    default:return ["an unsupported claim","a reversed conclusion","an unrelated detail"];
  }
};

const evidenceFor=(familyId:string,s:Eng008ExpansionSpec)=>{
  switch(familyId){
    case "RC2-F01":return s.fact;
    case "RC2-F02":return s.inference;
    case "RC2-F03":return s.idea;
    case "RC2-F04":return "The passage weighs limits and practical improvements without exaggeration.";
    case "RC2-F05":return s.reason;
    case "RC2-F06":return s.inference;
    case "RC2-F07":return s.fact;
    case "RC2-F08":return `${s.keyword}: ${s.keywordMeaning}`;
    default:return s.detail;
  }
};

const explanationFor=(familyId:string,s:Eng008ExpansionSpec,answer:string)=>{
  switch(familyId){
    case "RC2-F01":return `The passage explicitly states that ${s.fact}. The other options contradict the existence, purpose or interpretation of the information described.`;
    case "RC2-F02":return `The supported inference is that ${s.inference}. It follows from the passage's explanation of the problem without extending the claim beyond the evidence.`;
    case "RC2-F03":return `The passage develops the broader idea that ${s.idea}. The example, contrast and proposed improvement all support this main point.`;
    case "RC2-F04":return `The tone is “${answer}” because the author identifies a practical weakness, explains its limits and proposes a measured improvement rather than using emotional or absolute language.`;
    case "RC2-F05":return `Clearer decision paths are needed because ${s.reason}. The passage argues that users need enough context to know what a status actually represents.`;
    case "RC2-F06":return `The logical conclusion is that ${s.inference}. This is the conclusion that follows from the stated distinction while staying within the scope of the passage.`;
    case "RC2-F07":return `The supported statement is grounded in the passage's stated fact: ${s.fact}. The distractors make claims the passage does not support.`;
    case "RC2-F08":return `In context, “${s.keyword}” means ${s.keywordMeaning}. The surrounding sentences use the word in this practical sense.`;
    default:return `The answer follows from the passage evidence: ${evidenceFor(familyId,s)}.`;
  }
};

const remediateQuestions=(s:Eng008ExpansionSpec,qs:readonly ExistingQuestion[])=>qs.map(q=>{
  const pv=prompts[q.familyId]??[q.question];
  let question=pv[stableIndex(s.id+q.familyId,pv.length)]!;
  if(q.familyId==="RC2-F08")question=question.replace("the key word",`“${s.keyword}”`);
  const distractors=wrongs(q.familyId,s);
  if(new Set([q.correctAnswer,...distractors].map(x=>x.toLowerCase())).size!==4)throw new Error(`${s.id} ${q.familyId} option collision`);
  return {...q,question,distractors,explanation:explanationFor(q.familyId,s,q.correctAnswer),evidence:evidenceFor(q.familyId,s)};
});

const rebuild=(specs:readonly Eng008ExpansionSpec[],existing:readonly ExistingPassage[])=>{
  const byId=new Map(existing.map(x=>[x.id,x]));
  return specs.map(s=>{
    const old=byId.get(s.id);
    if(!old)throw new Error("Missing existing CP002 passage "+s.id);
    return {...old,text:makeText(s),questions:remediateQuestions(s,old.questions)};
  });
};

export const ENG008_CP002_REMEDIATED_WAVE14_V1=rebuild(ENG008_WAVE14_EDITORIAL_SPECS,ENG008_CP002_EXPANSION_WAVE14_V1) as any;
export const ENG008_CP002_REMEDIATED_WAVE15_V1=rebuild(ENG008_WAVE15_EDITORIAL_SPECS,ENG008_CP002_EXPANSION_WAVE15_V1) as any;
export const ENG008_CP002_REMEDIATED_WAVE16_V1=rebuild(ENG008_WAVE16_EDITORIAL_SPECS,ENG008_CP002_EXPANSION_WAVE16_V1) as any;
export const ENG008_CP002_REMEDIATED_WAVE17_V1=rebuild(ENG008_WAVE17_EDITORIAL_SPECS,ENG008_CP002_EXPANSION_WAVE17_V1) as any;
export const ENG008_CP002_REMEDIATED_WAVE18_V1=rebuild(ENG008_WAVE18_EDITORIAL_SPECS,ENG008_CP002_EXPANSION_WAVE18_V1) as any;
export const ENG008_CP002_REMEDIATED_WAVE19_V1=rebuild(ENG008_WAVE19_EDITORIAL_SPECS,ENG008_CP002_EXPANSION_WAVE19_V1) as any;
