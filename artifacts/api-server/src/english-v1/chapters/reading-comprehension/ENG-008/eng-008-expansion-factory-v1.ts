export type Eng008ExpansionSpec={
 id:string;title:string;genre:string;subject:string;setting:string;fact:string;reason:string;idea:string;
 inference:string;keyword:string;keywordMeaning:string;contrast:string;detail:string;
};

type Q={id:string;familyId:string;difficulty:string;question:string;correctAnswer:string;distractors:readonly[string,string,string];explanation:string;evidence:string};

const wc=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;
const sentence=(s:Eng008ExpansionSpec,i:number)=>[
  `The case also shows that ${s.subject} works best when people can distinguish the main rule from a convenient shortcut.`,
  `A small change in procedure made the ${s.setting} easier to understand without changing the underlying purpose.`,
  `The people involved compared the visible result with the record behind it before drawing a conclusion.`,
  `This mattered because a familiar label can hide an important difference in timing, scope or responsibility.`,
  `The revised process kept the useful part of the old system while making the key decision easier to verify.`,
  `The example therefore rewards careful reading of evidence rather than a quick assumption based on one clue.`,
  `What looked like a minor detail became important once the participants compared what happened with what the rule actually required.`,
  `The final arrangement reduced avoidable confusion because the decisive information was made explicit at the point where it was needed.`
][i%8];

function fit(paragraphs:string[],s:Eng008ExpansionSpec,min:number,max:number){
 let i=0;
 while(wc(paragraphs.join("\n\n"))<min){paragraphs[paragraphs.length-1]+=" "+sentence(s,i++);}
 let text=paragraphs.join("\n\n");
 if(wc(text)>max)throw new Error(`${s.id} generated ${wc(text)} words > ${max}`);
 return text;
}
const d=(a:string,b:string,c:string):readonly[string,string,string]=>[a,b,c];
const q=(id:string,familyId:string,difficulty:string,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string):Q=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export function buildFoundation(s:Eng008ExpansionSpec){
 const p=[
  `In ${s.setting}, ${s.fact}. At first, several people treated the situation as routine because they focused on the most visible detail. ${s.detail}`,
  `The confusion was resolved when someone checked the governing record. ${s.reason}. That check showed why the first assumption was incomplete rather than entirely unreasonable.`,
  `Afterwards, the process was adjusted so that the relevant information appeared more clearly. ${s.inference}. The change did not add a new rule; it made the existing rule easier to apply consistently.`,
  `The episode illustrates a broader point: ${s.idea}. In this context, “${s.keyword}” means ${s.keywordMeaning}. ${s.contrast}.`
 ];
 const text=fit(p,s,180,250), k=s.id.split("-").pop()!;
 return {id:s.id,title:s.title,genre:s.genre,text,questions:[
  q(`${k}-Q1`,"RC-F01","easy","Which fact is stated in the passage?",s.fact,d("A different rule applied without any record","The issue was never checked","No procedure was changed"),"The passage states this fact directly before explaining how the confusion was resolved.",s.fact),
  q(`${k}-Q2`,"RC-F02","medium","Why was the first assumption incomplete?",s.reason,d("The record had been destroyed","No one knew the rule","The visible detail was always decisive"),"The passage explains that checking the governing record revealed information missing from the first impression.",s.reason),
  q(`${k}-Q3`,"RC-F03","hard","What is the central idea of the passage?",s.idea,d("Procedures should never change","Visible labels are always unreliable","Records are unnecessary when people agree"),"The final paragraph generalises the incident into this broader lesson.",s.idea),
  q(`${k}-Q4`,"RC-F04","medium","Which title best suits the passage?",s.title,d("A Rule Without Records","Why Procedures Should Be Ignored","An Unrelated Administrative Error"),"The title names the particular situation through which the passage develops its main point.",s.title),
  q(`${k}-Q5`,"RC-F05","easy",`In context, “${s.keyword}” most nearly means:`,s.keywordMeaning,d("an unrelated exception","a permanent cancellation","a decorative label"),"The surrounding sentences use the word in this specific practical sense.",`${s.keyword}” means ${s.keywordMeaning}`),
  q(`${k}-Q6`,"RC-F06","medium","Which inference is best supported?",s.inference,d("The original procedure had no purpose","The participants stopped using records","The change created a completely new system"),"The passage supports this conclusion through the correction made after the incident.",s.inference)
 ]};
}

export function buildEditorial(s:Eng008ExpansionSpec){
 const p=[
  `${s.subject} often looks simple when reduced to one visible outcome. Yet ${s.fact}. The difficulty is not that people lack information; it is that a single indicator can be mistaken for the whole decision.`,
  `${s.reason}. This is why a sound rule should identify what is being measured, when it is measured and what remains outside the measure.`,
  `A better approach is to make the decision path explicit. ${s.detail}. Clear labels, dates or definitions can prevent users from treating provisional information as final.`,
  `The same principle matters when conditions change. ${s.inference}. A system should therefore show both the current state and the limits of what can be concluded from it.`,
  `None of this requires excessive complexity. The objective is to make important distinctions visible at the moment of choice. In this discussion, “${s.keyword}” means ${s.keywordMeaning}.`,
  `${s.contrast}. The broader lesson is that ${s.idea}. Good communication does not eliminate uncertainty; it prevents uncertainty from being disguised as certainty.`
 ];
 const text=fit(p,s,220,350), k=s.id.split("-").pop()!;
 const dif=["easy","medium","medium","hard","medium","hard","medium","easy"];
 return {id:s.id,title:s.title,genre:s.genre,text,questions:Array.from({length:8},(_,i)=>{
   const fam=`RC2-F0${i+1}`,id=`${k}-Q${i+1}`,difficulty=dif[i]!;
   const qs=[
    ["Which fact does the passage emphasise?",s.fact],
    ["What can be inferred from the discussion?",s.inference],
    ["Which statement best summarises the passage?",s.idea],
    ["What is the author's tone?","Measured and practical"],
    ["Why does the author call for clearer decision paths?",s.reason],
    ["Which conclusion follows most logically?",s.inference],
    ["Which statement is supported by the passage?",s.fact],
    [`In context, “${s.keyword}” most nearly means:`,s.keywordMeaning]
   ][i] as [string,string];
   return q(id,fam,difficulty,qs[0],qs[1],d("An absolute rule with no exceptions","A conclusion not supported by the passage","A detail that reverses the author's argument"),"The answer follows from the passage's stated distinction and the evidence used to support it.",i===7?`${s.keyword} means ${s.keywordMeaning}`:i===3?"The discussion weighs limits and practical improvements":i===4?s.reason:i===2?s.idea:i===1||i===5?s.inference:s.fact);
 })};
}

function longText(s:Eng008ExpansionSpec,paras:number,min:number,max:number){
 const base=[
  `In ${s.setting}, ${s.fact}. The situation attracted attention because the visible result seemed straightforward, yet the underlying process contained more than one stage. ${s.detail}`,
  `A closer review showed that ${s.reason}. Participants who relied only on the first signal reached different conclusions from those who checked the record, timing and scope of the rule.`,
  `The organisers then separated the stages more clearly. They recorded what happened, when it happened and which condition controlled the next step. This made the evidence easier to compare and reduced disputes based on memory.`,
  `${s.inference}. The case is useful because it does not suggest that every problem needs more paperwork. Instead, it shows that the decisive information should be available where the decision is made.`,
  `Another lesson concerned language. The term “${s.keyword}” was used to mean ${s.keywordMeaning}. Once that meaning was stated clearly, people were less likely to confuse it with a nearby but different idea.`,
  `${s.contrast}. That contrast matters because similar-looking outcomes can arise from different causes, and the appropriate response depends on identifying the cause rather than reacting only to appearance.`,
  `Taken together, the evidence supports a broader conclusion: ${s.idea}. The strongest decision was not the fastest one; it was the one that matched the record, the timing and the purpose of the procedure.`
 ].slice(0,paras);
 return fit(base,s,min,max);
}

export function buildPrelims(s:Eng008ExpansionSpec){
 const text=longText(s,5,350,450), k=s.id.split("-").pop()!, dif=["easy","medium","medium","medium","easy","easy","medium","medium","medium"];
 const prompts=[
 ["Which fact is stated in the passage?",s.fact],["Why did participants reach different conclusions?",s.reason],["What is the central idea?",s.idea],["Which statement is supported?",s.inference],
 [`In context, “${s.keyword}” is closest in meaning to:`,s.keywordMeaning],["Which option is opposite in meaning to the key idea?","a conclusion based only on appearance"],
 ["What did the revised process achieve?",s.inference],["Why is the contrast in the passage important?",s.contrast],["Which title best suits the passage?",s.title]
 ] as const;
 return {id:s.id,title:s.title,genre:s.genre,text,questions:prompts.map((x,i)=>q(`${k}-Q${i+1}`,`BP-F0${i+1}`,dif[i]!,x[0],x[1],d("It removed the need for evidence","It made every case identical","It required people to ignore timing"),"The passage supports this answer by linking the stated rule with the evidence and the later correction.",i===4?`${s.keyword} means ${s.keywordMeaning}`:i===8?s.title:i===2?s.idea:i===1?s.reason:s.inference))};
}

export function buildMains(s:Eng008ExpansionSpec){
 const text=longText(s,7,450,650), k=s.id.split("-").pop()!, dif=["medium","medium","medium","hard","hard","hard","hard","hard","hard","hard"];
 const answers=[s.fact,s.reason,s.idea,"Analytical and qualified",s.inference,s.contrast,s.keywordMeaning,s.idea,s.inference,s.title];
 const prompts=["Which fact is central to the passage?","Why did the initial interpretation fail?","Which option best summarises the argument?","What is the author's tone?","Which inference is best supported?","Why is the stated contrast important?",`What does “${s.keyword}” mean in context?`,"Which principle best extends the passage to another case?","Which conclusion would the author most likely accept?","Which title best captures the passage?"];
 return {id:s.id,title:s.title,genre:s.genre,text,questions:prompts.map((p,i)=>q(`${k}-Q${i+1}`,`BM-F${String(i+1).padStart(2,"0")}`,dif[i]!,p,answers[i]!,d("A claim the passage rejects","A conclusion based on one visible clue","An unrelated administrative preference"),"The answer is supported by the passage's comparison of evidence, procedure and outcome rather than by an isolated detail.",i===6?`${s.keyword} means ${s.keywordMeaning}`:i===9?s.title:i===1?s.reason:i===2||i===7?s.idea:i===5?s.contrast:s.inference))};
}

export function buildResearch(s:Eng008ExpansionSpec){
 const text=longText(s,7,380,520), k=s.id.split("-").pop()!, dif=["medium","medium","medium","medium","hard","hard","hard","hard"];
 const answers=[s.fact,s.reason,s.idea,s.inference,s.contrast,s.keywordMeaning,s.inference,s.idea];
 const prompts=["What did the study or survey report?","Why was the comparison designed this way?","Which statement best summarises the findings?","Which inference is supported by the evidence?","What limitation or contrast matters most?",`In context, what does “${s.keyword}” mean?`,"Which conclusion is justified without going beyond the evidence?","Which broader lesson follows from the study?"];
 return {id:s.id,title:s.title,genre:s.genre,text,questions:prompts.map((p,i)=>q(`${k}-Q${i+1}`,`RS-F0${i+1}`,dif[i]!,p,answers[i]!,d("A result not measured by the study","A claim that reverses the evidence","A conclusion requiring data the passage does not provide"),"The answer stays within the evidence described in the passage and does not extend beyond the reported comparison.",i===5?`${s.keyword} means ${s.keywordMeaning}`:i===4?s.contrast:i===0?s.fact:i===1?s.reason:i===2||i===7?s.idea:s.inference))};
}
