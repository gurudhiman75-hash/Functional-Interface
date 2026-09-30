import type { Eng008ExpansionSpec } from "../eng-008-expansion-factory-v1";
import { ENG008_WAVE14_MAINS_SPECS, ENG008_CP004_EXPANSION_WAVE14_V1 } from "../eng-008-expansion-wave14-v1";
import { ENG008_WAVE15_MAINS_SPECS, ENG008_CP004_EXPANSION_WAVE15_V1 } from "../eng-008-expansion-wave15-v1";
import { ENG008_WAVE16_MAINS_SPECS, ENG008_CP004_EXPANSION_WAVE16_V1 } from "../eng-008-expansion-wave16-v1";
import { ENG008_WAVE17_MAINS_SPECS, ENG008_CP004_EXPANSION_WAVE17_V1 } from "../eng-008-expansion-wave17-v1";
import { ENG008_WAVE18_MAINS_SPECS, ENG008_CP004_EXPANSION_WAVE18_V1 } from "../eng-008-expansion-wave18-v1";
import { ENG008_WAVE19_MAINS_SPECS, ENG008_CP004_EXPANSION_WAVE19_V1 } from "../eng-008-expansion-wave19-v1";

type ExistingQuestion={
  id:string;familyId:string;difficulty:string;question:string;correctAnswer:string;
  distractors:readonly [string,string,string];explanation:string;evidence:string;
};
type ExistingPassage={
  id:string;title:string;genre:string;text:string;questions:readonly ExistingQuestion[];
};

const wc=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;
const stableIndex=(id:string,mod:number)=>{let h=0;for(const ch of id)h=(h*33+ch.charCodeAt(0))>>>0;return h%mod;};

const extra=(s:Eng008ExpansionSpec)=>[
  `The case is important because ${s.contrast}.`,
  `That distinction changes what can reasonably be inferred from the evidence.`,
  `The passage therefore separates the headline result from the mechanism that produced it.`,
  `A reader who notices only the first figure or status could miss that ${s.reason}.`,
  `The practical implication is that ${s.inference}.`,
  `The word "${s.keyword}" is used here to mean ${s.keywordMeaning}.`,
  `This does not make the first observation useless; it limits what that observation can prove on its own.`,
  `The discussion remains qualified because the same visible outcome can arise through more than one underlying route.`,
  `The strongest conclusion is the one that stays closest to the evidence and does not assume more than the passage establishes.`,
  `The broader lesson is that ${s.idea}.`,
  `The passage deliberately distinguishes measurement from interpretation.`,
  `The comparison matters because a change in one indicator need not imply the same change in every related indicator.`,
  `The reasoning therefore depends on scope, timing and the relationship between the measures being compared.`,
  `The example is designed to test whether the reader can separate correlation, sequence and direct evidence.`,
  `The final conclusion is cautious rather than absolute because the passage recognises the limits of the available evidence.`,
  `This is why the argument treats context as part of the evidence rather than as an optional detail.`
];

const finish=(paras:string[],s:Eng008ExpansionSpec)=>{
  const pool=extra(s); let i=stableIndex(s.id,pool.length);
  while(wc(paras.join("\n\n"))<450){
    const p=(i+paras.length)%paras.length;
    paras[p]+=" "+pool[i%pool.length];
    i++;
  }
  const text=paras.join("\n\n");
  if(wc(text)>650)throw new Error(`${s.id} remediation generated ${wc(text)} words`);
  const pc=paras.length;
  if(pc<6||pc>8)throw new Error(`${s.id} remediation generated ${pc} paragraphs`);
  return text;
};

const makeText=(s:Eng008ExpansionSpec)=>{
  const v=stableIndex(s.id,8);
  const variants:string[][]=[
    [
      `A report from ${s.setting} drew attention to a result that looked clear at first: ${s.fact}. The headline figure was easy to repeat, but it did not explain how the result had been produced. ${s.detail}`,
      `The first complication was that ${s.reason}. This meant that the visible outcome could not be interpreted safely without looking at the structure behind it.`,
      `Once that structure was examined, ${s.inference}. The passage therefore asks the reader to distinguish what the evidence shows directly from what would require an additional assumption.`,
      `A second issue concerns language. In this context, "${s.keyword}" means ${s.keywordMeaning}. That definition matters because the argument depends on how the term is being measured or applied.`,
      `The passage also emphasises that ${s.contrast}. Treating the two as interchangeable would erase the very distinction the discussion is trying to make.`,
      `The author does not reject the original indicator. Instead, the argument places it within a wider set of conditions and asks what can actually be concluded from it.`,
      `The broader principle is that ${s.idea}. That principle gives the passage its analytical rather than absolute tone.`
    ],
    [
      `${s.fact}. In ${s.setting}, that observation prompted a stronger claim than the evidence could safely support. ${s.detail}`,
      `The claim became less certain after analysts noted that ${s.reason}. The passage uses this point to show that a single outcome can contain several layers of explanation.`,
      `${s.inference}. This is the passage's practical inference, but it is deliberately narrower than saying that one cause explains every case.`,
      `The discussion then turns to the term "${s.keyword}", which means ${s.keywordMeaning}. The term helps define exactly what is being compared.`,
      `${s.contrast}. This contrast prevents the reader from treating related indicators as if they measured the same thing.`,
      `For that reason, the author repeatedly returns to the limits of the headline measure. The issue is not whether the measure is false, but whether it is sufficient.`,
      `The passage ultimately argues that ${s.idea}. The conclusion follows from comparison and qualification rather than from a dramatic reversal of the original fact.`
    ],
    [
      `The central question in ${s.setting} was how to interpret a result after ${s.fact}. The observation itself was not disputed. What mattered was whether it justified the conclusion people wanted to draw from it. ${s.detail}`,
      `That question became harder because ${s.reason}. A fair analysis therefore had to separate the recorded outcome from the factors that could shape it.`,
      `The evidence supports the inference that ${s.inference}. It does not support a broader claim that every related outcome must move in the same direction.`,
      `The passage uses "${s.keyword}" to mean ${s.keywordMeaning}. The definition gives the reader a precise way to understand one of the key measures or concepts in the discussion.`,
      `Another important point is that ${s.contrast}. This difference explains why simple comparisons can be misleading even when all the underlying numbers are accurate.`,
      `The author's method is therefore comparative and qualified. Each claim is tested against scope, composition, timing or the design of the measure being used.`,
      `The wider lesson is that ${s.idea}. The strongest reading is the one that preserves the evidence while refusing to turn a limited result into an unlimited conclusion.`
    ],
    [
      `A debate in ${s.setting} centred on a familiar problem: ${s.fact}. Different readers could cite the same result while still disagreeing about what it meant. ${s.detail}`,
      `The disagreement existed because ${s.reason}. The passage makes this mechanism explicit instead of allowing the headline result to stand alone.`,
      `${s.inference}. That inference is important because it shows how the same evidence can support a cautious conclusion without supporting an absolute one.`,
      `In the passage, "${s.keyword}" means ${s.keywordMeaning}. The word is used as part of the reasoning, not simply as technical vocabulary.`,
      `${s.contrast}. Once this distinction is recognised, the apparent conflict between the two observations becomes easier to understand.`,
      `The author therefore treats measurement and interpretation as separate steps. A number, rate, label or status can be accurate while still requiring context before it answers a policy or analytical question.`,
      `The passage's larger point is that ${s.idea}. Its tone remains measured because the argument acknowledges both the usefulness and the limitations of the available evidence.`
    ],
    [
      `In ${s.setting}, decision-makers examined a result after ${s.fact}. The immediate temptation was to read the change as a complete explanation of performance or behaviour. ${s.detail}`,
      `That reading weakened once it became clear that ${s.reason}. The passage therefore shifts attention from the result alone to the way the result was produced.`,
      `From the evidence, the safer inference is that ${s.inference}. This conclusion stays within what the passage establishes and avoids extending the claim beyond the observed conditions.`,
      `The key term "${s.keyword}" means ${s.keywordMeaning}. Understanding that definition is necessary because the argument depends on a specific rather than casual use of the word.`,
      `The passage also notes that ${s.contrast}. This is not a side detail; it is the reason a simple one-number interpretation would be incomplete.`,
      `A careful reader is therefore expected to ask what the measure includes, what it leaves out, and whether the comparison is like-for-like.`,
      `The broader conclusion is that ${s.idea}. The author favours evidence that is interpreted with context over evidence that is repeated without qualification.`
    ],
    [
      `The passage considers a case from ${s.setting} in which ${s.fact}. The result appeared to point in one direction, but the surrounding evidence complicated that interpretation. ${s.detail}`,
      `The complication arose because ${s.reason}. That mechanism makes the passage more than a description of a single outcome; it becomes an argument about how outcomes should be read.`,
      `${s.inference}. The passage supports this inference because it follows directly from the relationship between the measured result and the process behind it.`,
      `The term "${s.keyword}" is used to mean ${s.keywordMeaning}. It provides a precise label for a concept that would otherwise be easy to treat too loosely.`,
      `${s.contrast}. The reader is expected to hold both sides of this contrast in mind rather than choose one and ignore the other.`,
      `This is why the author avoids sweeping language. The passage does not say the first indicator is meaningless; it says that the indicator answers only one part of the larger question.`,
      `The central lesson is that ${s.idea}. That lesson explains both the structure of the evidence and the qualified tone of the conclusion.`
    ],
    [
      `A single statistic or status from ${s.setting} became the centre of attention when ${s.fact}. On the surface, the result seemed to invite a simple judgment. ${s.detail}`,
      `A deeper review showed that ${s.reason}. This changed the interpretation because the measured result and the underlying condition were not perfectly interchangeable.`,
      `The passage therefore supports the inference that ${s.inference}. It stops short of claiming that the same pattern must hold under every other set of conditions.`,
      `"${s.keyword}" in this discussion means ${s.keywordMeaning}. The author defines the concept through its role in the argument rather than through an abstract dictionary description.`,
      `A further distinction is that ${s.contrast}. This gives the reader a reason to resist a headline-only interpretation.`,
      `The discussion is analytical because it compares alternatives, tests what each measure can show, and identifies what remains uncertain.`,
      `The final lesson is that ${s.idea}. The passage rewards a reader who recognises both the strength of the evidence and the boundary around it.`
    ],
    [
      `The case described in ${s.setting} begins with an apparently straightforward fact: ${s.fact}. Yet the passage treats the fact as the beginning of the analysis rather than the end. ${s.detail}`,
      `The reason is that ${s.reason}. Without that context, a reader could mistake a change in one measure for a change in the broader condition it only partly represents.`,
      `${s.inference}. This is the most defensible inference because it connects the observation to the mechanism without adding an unsupported claim.`,
      `The word "${s.keyword}" means ${s.keywordMeaning} in the passage. Its precise meaning is necessary to understand the scope of the comparison.`,
      `${s.contrast}. The contrast shows why the passage repeatedly separates related but non-identical outcomes.`,
      `The author's reasoning remains cautious throughout. Evidence is accepted, but each piece is interpreted according to what it actually measures and the conditions under which it was produced.`,
      `The broader principle is that ${s.idea}. That principle gives the passage its final conclusion and explains why the tone is analytical and qualified.`
    ]
  ];
  return finish(variants[v].map(x=>x),s);
};

const prompts:Record<string,readonly string[]>={
  "BM-F01":["Which fact is central to the passage?","Which finding forms the starting point of the discussion?","What is directly reported in the passage?","Which observation does the argument begin with?"],
  "BM-F02":["Why is the headline result insufficient on its own?","What mainly complicates the first interpretation?","Why does the passage qualify the initial reading?","What explains why the first conclusion may be incomplete?"],
  "BM-F03":["Which option best summarises the argument?","What is the central idea of the passage?","Which statement best captures the author's main point?","What broader principle does the passage develop?"],
  "BM-F04":["What is the author's tone?","How would the tone of the passage best be described?","Which description best fits the author's approach?","What tone does the passage maintain?"],
  "BM-F05":["Which inference is best supported?","What can reasonably be inferred from the passage?","Which conclusion follows most directly from the evidence?","Which inference stays within the evidence given?"],
  "BM-F06":["Why is the stated contrast important?","What role does the contrast play in the argument?","Why does the author distinguish the two conditions?","What does the contrast help establish?"],
  "BM-F07":["What does the key term mean in context?","Which meaning best fits the key term in the passage?","How is the highlighted term being used?","Which option gives the contextual meaning of the term?"],
  "BM-F08":["Which principle best extends the passage to another case?","Which general principle is most consistent with the passage?","What broader lesson can be applied beyond this example?","Which principle follows from the reasoning used here?"],
  "BM-F09":["Which conclusion would the author most likely accept?","Which conclusion is most consistent with the passage?","What would the author most likely agree with?","Which statement best reflects the passage's final position?"],
  "BM-F10":["Which title best captures the passage?","Choose the most appropriate title.","Which heading best reflects the passage as a whole?","Which title most accurately represents the discussion?"]
};

const wrongs=(familyId:string,s:Eng008ExpansionSpec):readonly [string,string,string]=>{
  switch(familyId){
    case "BM-F01":return ["the passage says the original result was fabricated","the passage reports that no measurement or record existed","the passage says every related indicator moved identically"];
    case "BM-F02":return ["because the author rejects all quantitative evidence","because the governing data were intentionally hidden from every reader","because the passage assumes all groups and conditions are identical"];
    case "BM-F03":return ["one headline indicator is always enough for a complete judgment","related measures can safely be treated as identical","context should be ignored when a result appears numerically clear"];
    case "BM-F04":return ["emotional and accusatory","celebratory and unqualified","sarcastic and dismissive"];
    case "BM-F05":return ["the evidence proves the same outcome must occur in every setting","the first visible result makes all later analysis unnecessary","the passage establishes a causal claim stronger than the evidence described"];
    case "BM-F06":return ["it shows the two conditions are interchangeable","it proves the first measure should be discarded entirely","it removes the need to consider timing, scope or composition"];
    case "BM-F07":return ["an unrelated exception that cancels the argument","a decorative technical label with no analytical role","a permanent ending of the process being discussed"];
    case "BM-F08":return ["prefer the simplest headline even when relevant context is available","treat every related measure as if it captured the same outcome","extend a limited finding to all populations without further evidence"];
    case "BM-F09":return ["the original indicator should never be used again","one observed relationship proves every possible causal mechanism","all uncertainty disappears once one measure improves"];
    case "BM-F10":return [`Why ${s.subject} Should Be Ignored`,"One Number Explains Everything","Evidence Without Context"];
    default:return ["an unsupported claim","a reversed conclusion","an unrelated preference"];
  }
};

const evidenceFor=(familyId:string,s:Eng008ExpansionSpec)=>{
  switch(familyId){
    case "BM-F01":return s.fact;
    case "BM-F02":return s.reason;
    case "BM-F03":return s.idea;
    case "BM-F04":return "The passage compares evidence, qualifies claims and states limits.";
    case "BM-F05":return s.inference;
    case "BM-F06":return s.contrast;
    case "BM-F07":return `${s.keyword}: ${s.keywordMeaning}`;
    case "BM-F08":return s.idea;
    case "BM-F09":return s.inference;
    case "BM-F10":return s.title;
    default:return s.detail;
  }
};

const explanationFor=(familyId:string,s:Eng008ExpansionSpec,answer:string)=>{
  switch(familyId){
    case "BM-F01":return `The passage begins from the reported fact that ${s.fact}. The other options either deny the existence of evidence or turn a qualified comparison into an absolute one.`;
    case "BM-F02":return `The first interpretation needs qualification because ${s.reason}. That mechanism is the reason the headline result cannot answer the whole analytical question by itself.`;
    case "BM-F03":return `The passage develops the broader idea that ${s.idea}. Each paragraph adds either evidence, a limitation or a contrast that supports this central argument.`;
    case "BM-F04":return `The tone is “${answer}” because the author weighs evidence, distinguishes related measures and repeatedly states the limits of what can be concluded.`;
    case "BM-F05":return `The supported inference is that ${s.inference}. It follows from the evidence described without extending the claim to conditions the passage does not examine.`;
    case "BM-F06":return `The contrast matters because ${s.contrast}. It prevents the reader from treating two related but non-identical measures or conditions as interchangeable.`;
    case "BM-F07":return `In context, “${s.keyword}” means ${s.keywordMeaning}. The surrounding discussion uses the term in that precise analytical sense.`;
    case "BM-F08":return `The principle that best extends the passage is that ${s.idea}. It preserves the same evidence-first reasoning beyond the specific example.`;
    case "BM-F09":return `The author would most likely accept that ${s.inference}. That conclusion matches the passage's cautious reasoning and stays within the stated evidence.`;
    case "BM-F10":return `“${s.title}” is the best title because it names the subject while also matching the passage's main analytical concern: ${s.idea}.`;
    default:return `The answer follows from the passage evidence: ${evidenceFor(familyId,s)}.`;
  }
};

const remediateQuestions=(s:Eng008ExpansionSpec,qs:readonly ExistingQuestion[])=>qs.map(q=>{
  const pv=prompts[q.familyId]??[q.question];
  let question=pv[stableIndex(s.id+q.familyId,pv.length)]!;
  if(q.familyId==="BM-F07")question=question.replace("the key term",`“${s.keyword}”`);
  const distractors=wrongs(q.familyId,s);
  if(new Set([q.correctAnswer,...distractors].map(x=>x.toLowerCase())).size!==4)throw new Error(`${s.id} ${q.familyId} option collision`);
  return {...q,question,distractors,explanation:explanationFor(q.familyId,s,q.correctAnswer),evidence:evidenceFor(q.familyId,s)};
});

const rebuild=(specs:readonly Eng008ExpansionSpec[],existing:readonly ExistingPassage[])=>{
  const byId=new Map(existing.map(x=>[x.id,x]));
  return specs.map(s=>{
    const old=byId.get(s.id);
    if(!old)throw new Error("Missing existing CP004 passage "+s.id);
    return {...old,text:makeText(s),questions:remediateQuestions(s,old.questions)};
  });
};

export const ENG008_CP004_REMEDIATED_WAVE14_V1=rebuild(ENG008_WAVE14_MAINS_SPECS,ENG008_CP004_EXPANSION_WAVE14_V1) as any;
export const ENG008_CP004_REMEDIATED_WAVE15_V1=rebuild(ENG008_WAVE15_MAINS_SPECS,ENG008_CP004_EXPANSION_WAVE15_V1) as any;
export const ENG008_CP004_REMEDIATED_WAVE16_V1=rebuild(ENG008_WAVE16_MAINS_SPECS,ENG008_CP004_EXPANSION_WAVE16_V1) as any;
export const ENG008_CP004_REMEDIATED_WAVE17_V1=rebuild(ENG008_WAVE17_MAINS_SPECS,ENG008_CP004_EXPANSION_WAVE17_V1) as any;
export const ENG008_CP004_REMEDIATED_WAVE18_V1=rebuild(ENG008_WAVE18_MAINS_SPECS,ENG008_CP004_EXPANSION_WAVE18_V1) as any;
export const ENG008_CP004_REMEDIATED_WAVE19_V1=rebuild(ENG008_WAVE19_MAINS_SPECS,ENG008_CP004_EXPANSION_WAVE19_V1) as any;
