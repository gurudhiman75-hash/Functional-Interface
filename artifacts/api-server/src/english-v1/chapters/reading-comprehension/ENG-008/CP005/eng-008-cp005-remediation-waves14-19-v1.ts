import type { Eng008ExpansionSpec } from "../eng-008-expansion-factory-v1";
import { ENG008_WAVE14_RESEARCH_SPECS, ENG008_CP005_EXPANSION_WAVE14_V1 } from "../eng-008-expansion-wave14-v1";
import { ENG008_WAVE15_RESEARCH_SPECS, ENG008_CP005_EXPANSION_WAVE15_V1 } from "../eng-008-expansion-wave15-v1";
import { ENG008_WAVE16_RESEARCH_SPECS, ENG008_CP005_EXPANSION_WAVE16_V1 } from "../eng-008-expansion-wave16-v1";
import { ENG008_WAVE17_RESEARCH_SPECS, ENG008_CP005_EXPANSION_WAVE17_V1 } from "../eng-008-expansion-wave17-v1";
import { ENG008_WAVE18_RESEARCH_SPECS, ENG008_CP005_EXPANSION_WAVE18_V1 } from "../eng-008-expansion-wave18-v1";
import { ENG008_WAVE19_RESEARCH_SPECS, ENG008_CP005_EXPANSION_WAVE19_V1 } from "../eng-008-expansion-wave19-v1";

type ExistingQuestion={id:string;familyId:string;difficulty:string;question:string;correctAnswer:string;distractors:readonly [string,string,string];explanation:string;evidence:string};
type ExistingPassage={id:string;title:string;genre:string;text:string;questions:readonly ExistingQuestion[]};

const wc=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;
const stableIndex=(id:string,mod:number)=>{let h=0;for(const ch of id)h=(h*33+ch.charCodeAt(0))>>>0;return h%mod;};

const finish=(paras:string[],s:Eng008ExpansionSpec)=>{
  const extra=[
    `The important limitation is that ${s.contrast}.`,
    `That point matters because a measured association does not automatically establish a complete causal explanation.`,
    `The reported result supports the inference that ${s.inference}.`,
    `The term "${s.keyword}" means ${s.keywordMeaning} in this study.`,
    `The passage therefore separates what the data show from what remains uncertain.`,
    `A stronger claim would require evidence beyond the comparison described here.`,
    `The broader lesson is that ${s.idea}.`,
    `The study is useful precisely because its conclusion stays within the limits of the design.`,
    `The comparison helps identify a pattern, but it does not make every alternative explanation disappear.`,
    `The reader is expected to distinguish the observed result from the interpretation placed on that result.`,
    `The design provides evidence for a relationship while leaving some questions open for further study.`,
    `This is why the passage treats method and limitation as part of the finding rather than as footnotes.`
  ];
  let i=stableIndex(s.id,extra.length);
  while(wc(paras.join("\n\n"))<380){paras[(i+paras.length)%paras.length]+=" "+extra[i%extra.length];i++;}
  const text=paras.join("\n\n");
  if(wc(text)>520)throw new Error(`${s.id} remediation generated ${wc(text)} words`);
  const pc=paras.length;if(pc<6||pc>8)throw new Error(`${s.id} remediation generated ${pc} paragraphs`);
  return text;
};

const makeText=(s:Eng008ExpansionSpec)=>{
  const variants=[
    [
      `A study in ${s.setting} examined ${s.subject}. Researchers reported that ${s.fact}. ${s.detail}`,
      `The comparison was designed this way because ${s.reason}. That design allowed the researchers to observe a pattern while keeping the main comparison reasonably clear.`,
      `The result supports the inference that ${s.inference}. However, the passage does not treat this as proof of every possible explanation for the pattern.`,
      `One limitation is that ${s.contrast}. This matters because two related outcomes can move together without measuring exactly the same thing.`,
      `The word "${s.keyword}" is used to mean ${s.keywordMeaning}. Understanding the term helps define what was actually recorded or compared.`,
      `The broader conclusion is that ${s.idea}. The study therefore offers useful evidence while keeping its claims within the boundaries of the design.`
    ],
    [
      `Researchers working in ${s.setting} investigated ${s.subject}. Their main finding was that ${s.fact}. ${s.detail}`,
      `The reason for the chosen comparison was that ${s.reason}. The method aimed to make the observed difference easier to interpret without claiming that all outside influences had been removed.`,
      `${s.inference}. This is the strongest conclusion the passage supports from the reported evidence.`,
      `The study also highlights an important contrast: ${s.contrast}. That contrast prevents the reader from treating one measured outcome as a complete substitute for another.`,
      `In context, "${s.keyword}" means ${s.keywordMeaning}. The definition is part of the evidence because the meaning of the measure affects how the result should be read.`,
      `The broader lesson is that ${s.idea}. A careful evaluation reports both the observed pattern and the limits of the conclusion drawn from it.`
    ],
    [
      `The passage describes a research exercise from ${s.setting} focused on ${s.subject}. The study found that ${s.fact}. ${s.detail}`,
      `The comparison was useful because ${s.reason}. It created a basis for examining the relationship without turning the design into a stronger experiment than it really was.`,
      `From the evidence, it is reasonable to infer that ${s.inference}. The passage stops short of saying that the same result must appear in every population or setting.`,
      `${s.contrast}. This limitation is central to the interpretation because the two outcomes answer different questions.`,
      `The term "${s.keyword}" means ${s.keywordMeaning} here. The word is used in a technical but practical sense tied directly to the study design.`,
      `The main idea is that ${s.idea}. The passage values a conclusion that fits the evidence more than a dramatic claim that goes beyond it.`
    ],
    [
      `In ${s.setting}, a study of ${s.subject} produced a clear observational result: ${s.fact}. ${s.detail}`,
      `The researchers used this comparison because ${s.reason}. The design therefore created evidence about a relationship while preserving an important distinction between observation and causation.`,
      `The evidence supports the inference that ${s.inference}. It does not establish a broader claim unless the passage supplies additional evidence for that claim.`,
      `A key limitation is that ${s.contrast}. This means that improvement in one recorded outcome should not automatically be treated as improvement in every related outcome.`,
      `The word "${s.keyword}" is used to mean ${s.keywordMeaning}. The definition shows exactly what the study counted, observed or classified.`,
      `The wider lesson is that ${s.idea}. Good research communication makes the finding useful by explaining both what the data show and what they cannot prove.`
    ],
    [
      `A research team in ${s.setting} explored ${s.subject}. The reported finding was that ${s.fact}. ${s.detail}`,
      `The method was chosen because ${s.reason}. This gave the researchers a meaningful comparison without eliminating every possible source of difference.`,
      `The passage therefore supports the inference that ${s.inference}. That inference stays close to the data rather than turning an observed pattern into an absolute rule.`,
      `The most important caution is that ${s.contrast}. The passage uses this contrast to define the boundary around the study's conclusion.`,
      `Here, "${s.keyword}" means ${s.keywordMeaning}. The term helps the reader understand exactly what aspect of the behaviour, outcome or measurement was under discussion.`,
      `The central lesson is that ${s.idea}. The study is informative because its conclusion is proportionate to the evidence available.`
    ],
    [
      `The passage reviews a study carried out in ${s.setting} on ${s.subject}. Researchers observed that ${s.fact}. ${s.detail}`,
      `They structured the comparison this way because ${s.reason}. The design made the main relationship visible while leaving room for other influences that were not directly tested.`,
      `${s.inference}. This conclusion is justified by the evidence described, but a stronger causal or universal claim would require more.`,
      `The passage also stresses that ${s.contrast}. That distinction keeps the interpretation from becoming broader than the measured outcome.`,
      `The key term "${s.keyword}" means ${s.keywordMeaning}. Its meaning is important because research conclusions depend on what the measure actually represents.`,
      `The broader point is that ${s.idea}. A useful study does not need to answer every question; it needs to state clearly what its evidence supports.`
    ]
  ] as const;
  return finish([...variants[stableIndex(s.id,variants.length)]],s);
};

const prompts:Record<string,readonly string[]>={
 "RS-F01":["What did the study or survey report?","Which result was directly reported?","What was the main observed finding?","Which statement describes the reported result?"],
 "RS-F02":["Why was the comparison designed this way?","What was the main reason for the study design?","Why did the researchers use this comparison?","What explains the chosen comparison?"],
 "RS-F03":["Which statement best summarises the findings?","What is the central idea of the study?","Which option best captures the reported conclusion?","What broader point do the findings support?"],
 "RS-F04":["Which inference is supported by the evidence?","What can reasonably be inferred?","Which conclusion follows from the study?","Which inference stays within the evidence?"],
 "RS-F05":["What limitation or contrast matters most?","Which limitation is most important for interpretation?","What contrast limits the conclusion?","Which caution is central to the study?"],
 "RS-F06":["What does the key term mean in context?","Which meaning best fits the key term?","How is the highlighted term used?","Which option gives the contextual meaning?"],
 "RS-F07":["Which conclusion is justified without going beyond the evidence?","Which conclusion is supported without overclaiming?","What can be concluded safely from the evidence?","Which conclusion remains within the study's scope?"],
 "RS-F08":["Which broader lesson follows from the study?","What general lesson does the passage support?","Which principle best extends the findings?","What broader conclusion is consistent with the study?"]
};

const wrongs=(familyId:string,s:Eng008ExpansionSpec):readonly [string,string,string]=>{
 switch(familyId){
  case "RS-F01":return ["the study reported the exact opposite pattern","the passage says no observations were collected","the study found every group had identical outcomes"];
  case "RS-F02":return ["to guarantee that every outside influence was removed","to avoid collecting any comparable information","to prove the conclusion before the observations were made"];
  case "RS-F03":return ["one observed relationship proves a universal causal law","all related outcomes can be treated as identical","limitations should be ignored when a result is statistically interesting"];
  case "RS-F04":return ["the same effect must occur in every population","the study proves every plausible mechanism","no unmeasured factor could have influenced the result"];
  case "RS-F05":return ["the passage says the compared outcomes are exactly the same","the study proves timing and context never matter","the researchers measured every possible consequence of the intervention"];
  case "RS-F06":return ["an unrelated exception that cancels the study","a permanent ending of the measured process","a decorative label with no research meaning"];
  case "RS-F07":return ["the evidence establishes more than the study measured","the observed pattern proves long-term effects not examined","the result removes the need for further evidence"];
  case "RS-F08":return ["a single result should always be generalised to every context","research limits are unimportant once a pattern appears","related outcomes can always be substituted for one another"];
  default:return ["an unsupported claim","a reversed conclusion","an unrelated detail"];
 }
};

const evidenceFor=(familyId:string,s:Eng008ExpansionSpec)=>{
 switch(familyId){
  case "RS-F01":return s.fact;
  case "RS-F02":return s.reason;
  case "RS-F03":return s.idea;
  case "RS-F04":return s.inference;
  case "RS-F05":return s.contrast;
  case "RS-F06":return `${s.keyword}: ${s.keywordMeaning}`;
  case "RS-F07":return s.inference;
  case "RS-F08":return s.idea;
  default:return s.detail;
 }
};

const explanationFor=(familyId:string,s:Eng008ExpansionSpec,answer:string)=>{
 switch(familyId){
  case "RS-F01":return `The passage reports that ${s.fact}. The distractors either reverse the result, deny the observations or make the groups artificially identical.`;
  case "RS-F02":return `The comparison was designed this way because ${s.reason}. That reason explains what the design can clarify without claiming that every outside influence disappeared.`;
  case "RS-F03":return `The findings support the broader idea that ${s.idea}. The result, method and limitation all point toward this measured conclusion.`;
  case "RS-F04":return `The supported inference is that ${s.inference}. It follows from the evidence described without assuming a stronger causal or universal result.`;
  case "RS-F05":return `The important limitation is that ${s.contrast}. This distinction sets the boundary around what the observed result can safely establish.`;
  case "RS-F06":return `In context, “${s.keyword}” means ${s.keywordMeaning}. The passage uses the term in this specific research sense.`;
  case "RS-F07":return `The justified conclusion is that ${s.inference}. It stays within the evidence rather than extending the study to outcomes or populations that were not measured.`;
  case "RS-F08":return `The broader lesson is that ${s.idea}. This is the principle that best preserves both the finding and the study's stated limits.`;
  default:return `The answer follows from the passage evidence: ${evidenceFor(familyId,s)}.`;
 }
};

const remediateQuestions=(s:Eng008ExpansionSpec,qs:readonly ExistingQuestion[])=>qs.map(q=>{
 const pv=prompts[q.familyId]??[q.question];
 let question=pv[stableIndex(s.id+q.familyId,pv.length)]!;
 if(q.familyId==="RS-F06")question=question.replace("the key term",`“${s.keyword}”`);
 const distractors=wrongs(q.familyId,s);
 if(new Set([q.correctAnswer,...distractors].map(x=>x.toLowerCase())).size!==4)throw new Error(`${s.id} ${q.familyId} option collision`);
 return {...q,question,distractors,explanation:explanationFor(q.familyId,s,q.correctAnswer),evidence:evidenceFor(q.familyId,s)};
});

const rebuild=(specs:readonly Eng008ExpansionSpec[],existing:readonly ExistingPassage[])=>{
 const byId=new Map(existing.map(x=>[x.id,x]));
 return specs.map(s=>{const old=byId.get(s.id);if(!old)throw new Error("Missing existing CP005 passage "+s.id);return {...old,text:makeText(s),questions:remediateQuestions(s,old.questions)};});
};

export const ENG008_CP005_REMEDIATED_WAVE14_V1=rebuild(ENG008_WAVE14_RESEARCH_SPECS,ENG008_CP005_EXPANSION_WAVE14_V1) as any;
export const ENG008_CP005_REMEDIATED_WAVE15_V1=rebuild(ENG008_WAVE15_RESEARCH_SPECS,ENG008_CP005_EXPANSION_WAVE15_V1) as any;
export const ENG008_CP005_REMEDIATED_WAVE16_V1=rebuild(ENG008_WAVE16_RESEARCH_SPECS,ENG008_CP005_EXPANSION_WAVE16_V1) as any;
export const ENG008_CP005_REMEDIATED_WAVE17_V1=rebuild(ENG008_WAVE17_RESEARCH_SPECS,ENG008_CP005_EXPANSION_WAVE17_V1) as any;
export const ENG008_CP005_REMEDIATED_WAVE18_V1=rebuild(ENG008_WAVE18_RESEARCH_SPECS,ENG008_CP005_EXPANSION_WAVE18_V1) as any;
export const ENG008_CP005_REMEDIATED_WAVE19_V1=rebuild(ENG008_WAVE19_RESEARCH_SPECS,ENG008_CP005_EXPANSION_WAVE19_V1) as any;
