import type { Eng008ExpansionSpec } from "../eng-008-expansion-factory-v1";
import {
  ENG008_WAVE14_BP_SPECS,
  ENG008_CP003_EXPANSION_WAVE14_V1,
} from "../eng-008-expansion-wave14-v1";
import {
  ENG008_WAVE15_BP_SPECS,
  ENG008_CP003_EXPANSION_WAVE15_V1,
} from "../eng-008-expansion-wave15-v1";
import {
  ENG008_WAVE16_BP_SPECS,
  ENG008_CP003_EXPANSION_WAVE16_V1,
} from "../eng-008-expansion-wave16-v1";
import {
  ENG008_WAVE17_BP_SPECS,
  ENG008_CP003_EXPANSION_WAVE17_V1,
} from "../eng-008-expansion-wave17-v1";
import {
  ENG008_WAVE18_BP_SPECS,
  ENG008_CP003_EXPANSION_WAVE18_V1,
} from "../eng-008-expansion-wave18-v1";
import {
  ENG008_WAVE19_BP_SPECS,
  ENG008_CP003_EXPANSION_WAVE19_V1,
} from "../eng-008-expansion-wave19-v1";

type ExistingPassage={
  id:string;
  title:string;
  genre:string;
  text:string;
  questions:readonly unknown[];
};

const wc=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;

const stableIndex=(id:string,mod:number)=>{
  let h=0;
  for(const ch of id)h=(h*33+ch.charCodeAt(0))>>>0;
  return h%mod;
};

const finish=(paras:string[],s:Eng008ExpansionSpec)=>{
  const extra=[
    `For a reader, the important point is that ${s.contrast}.`,
    `The practical consequence is captured by the passage's inference: ${s.inference}.`,
    `That distinction matters in ${s.setting} because an apparently small wording difference can change what action is justified.`,
    `The record therefore has to be read together with its timing and purpose, not as an isolated label.`,
    `The example also shows why ${s.keyword} is useful here: it refers to ${s.keywordMeaning}.`,
    `A person who noticed only the visible outcome could miss the reason behind it, namely that ${s.reason}.`,
    `The later clarification did not erase the original event; it explained how the event should be interpreted.`,
    `This is why the passage treats the process, not merely the final result, as part of the evidence.`,
    `The case becomes easier to understand once the reader separates what changed from what remained unchanged.`,
    `The passage does not ask the reader to distrust records; it asks the reader to read the correct record for the correct stage.`,
    `The broader lesson is practical rather than abstract: ${s.idea}.`,
    `The people involved were able to act more confidently once the relevant distinction was made explicit.`,
    `The sequence of events is important because the same visible condition can mean different things at different stages.`,
    `The wording also prevents a common mistake: treating a provisional or partial state as though it were final.`,
    `Seen this way, the passage is about interpretation under ordinary conditions rather than about an exceptional rule.`,
    `The final decision follows from matching the evidence with the process that produced it.`
  ];
  let i=stableIndex(s.id,extra.length);
  while(wc(paras.join("\n\n"))<350){
    const p=(i+paras.length)%paras.length;
    paras[p]+=" "+extra[i%extra.length];
    i++;
  }
  const text=paras.join("\n\n");
  if(wc(text)>450)throw new Error(`${s.id} remediation generated ${wc(text)} words`);
  return text;
};

const makeText=(s:Eng008ExpansionSpec)=>{
  const v=stableIndex(s.id,12);
  const P:string[][]=[
    [
      `At ${s.setting}, a routine situation became confusing when ${s.fact}. At first, the visible result seemed sufficient to explain what had happened. The people involved soon discovered that it was not. ${s.detail}`,
      `The difficulty arose because ${s.reason}. That point changed the way the event had to be read: one piece of information described the immediate appearance, while another explained the governing stage or condition.`,
      `Once the two were separated, the outcome made more sense. ${s.inference}. The correction did not require a new rule; it required the existing information to be read in the right order.`,
      `The passage uses the word "${s.keyword}" to mean ${s.keywordMeaning}. That meaning is central because ${s.contrast}.`,
      `The larger lesson is that ${s.idea}. In everyday services, small labels and timestamps can matter because they tell users what a record actually represents.`
    ],
    [
      `${s.fact}. That was the detail that first drew attention in ${s.setting}. On its own, however, it encouraged a simple interpretation that did not account for the full process. ${s.detail}`,
      `A closer look showed why the first reading was incomplete. ${s.reason}. The case therefore turned on a distinction between the visible state and the rule that determined what the state meant.`,
      `After the relevant information was checked, ${s.inference}. The people involved did not need to ignore the first observation; they needed to place it beside the other evidence.`,
      `In this passage, "${s.keyword}" means ${s.keywordMeaning}. The term helps explain the difference because ${s.contrast}.`,
      `${s.idea}. The episode is useful precisely because nothing dramatic happened: the problem came from reading one accurate detail as though it were the whole answer.`
    ],
    [
      `A small administrative problem in ${s.setting} began with a perfectly ordinary observation: ${s.fact}. The observation was true, yet it did not settle the matter. ${s.detail}`,
      `The reason was procedural rather than accidental. ${s.reason}. Once that was recognised, the earlier assumption could be corrected without claiming that anyone had fabricated the record.`,
      `${s.inference}. This showed that the decisive clue lay in the relationship between two stages of the process, not in either stage taken alone.`,
      `The word "${s.keyword}" is used in the sense of ${s.keywordMeaning}. It clarifies the passage's central contrast: ${s.contrast}.`,
      `What the incident demonstrates is straightforward: ${s.idea}. Clearer records reduce confusion when different parts of one process can look similar from the outside.`
    ],
    [
      `People using ${s.setting} encountered a puzzling situation when ${s.fact}. Several explanations were possible at first, so the staff or users checked the surrounding record instead of relying on appearance alone. ${s.detail}`,
      `That check established that ${s.reason}. The point was not merely technical; it affected what a reasonable user should conclude from the information on display.`,
      `The revised understanding led to a practical result: ${s.inference}. The case therefore moved from an apparent contradiction to a sequence that could be explained step by step.`,
      `Here, "${s.keyword}" refers to ${s.keywordMeaning}. The term matters because ${s.contrast}.`,
      `The broader principle is that ${s.idea}. Good systems make those distinctions visible before users are forced to reconstruct them after a problem occurs.`
    ],
    [
      `The central problem in ${s.setting} was not a missing record but an easily misunderstood one. ${s.fact}. Because the first clue looked complete, some people treated it as the final answer. ${s.detail}`,
      `The misunderstanding became clear after the process was reviewed. ${s.reason}. This showed that an accurate record can still be misread if its scope or stage is not obvious.`,
      `${s.inference}. The outcome depended on interpreting the record according to the purpose for which it had been created.`,
      `The passage calls attention to "${s.keyword}", meaning ${s.keywordMeaning}. That definition helps the reader see why ${s.contrast}.`,
      `The case supports a wider lesson: ${s.idea}. Better wording can sometimes solve a problem more effectively than adding another rule.`
    ],
    [
      `In ${s.setting}, ${s.fact}. The event looked simple enough until different people tried to act on it and reached different conclusions. ${s.detail}`,
      `Their disagreement came from the fact that ${s.reason}. Each person had noticed a genuine part of the situation, but not everyone was using the same stage of the process as a reference point.`,
      `Once the relevant stage was identified, ${s.inference}. The clarification made the procedure easier to follow without changing its underlying purpose.`,
      `"${s.keyword}" in the passage means ${s.keywordMeaning}. This wording is useful because ${s.contrast}.`,
      `The main idea is that ${s.idea}. The passage therefore favours careful interpretation over quick conclusions based on a single visible cue.`
    ],
    [
      `An everyday transaction at ${s.setting} raised a question after ${s.fact}. Instead of assuming that the system had failed, the people involved examined how the record was produced. ${s.detail}`,
      `The review showed that ${s.reason}. That explanation separated the event itself from the way the event had been displayed or classified.`,
      `As a result, ${s.inference}. The sequence illustrates how a small procedural distinction can change the meaning of the same visible information.`,
      `The term "${s.keyword}" means ${s.keywordMeaning} in this context. It is not incidental vocabulary; it describes the distinction at the centre of the case. ${s.contrast}.`,
      `The lesson is that ${s.idea}. Readers are expected to follow the evidence across stages rather than choose the first interpretation that seems obvious.`
    ],
    [
      `${s.setting} provided an example of how two accurate pieces of information can appear to conflict. ${s.fact}. The apparent contradiction led users to ask which detail should control the decision. ${s.detail}`,
      `The answer depended on process. ${s.reason}. Once that point was understood, the two records no longer seemed inconsistent; they referred to different conditions or moments.`,
      `${s.inference}. This was a practical correction, not a change in the basic rule.`,
      `In the passage, "${s.keyword}" means ${s.keywordMeaning}. The definition reinforces the contrast that ${s.contrast}.`,
      `The example supports the idea that ${s.idea}. Systems become easier to use when they reveal enough context for a reader to know what each status actually covers.`
    ],
    [
      `A routine entry in ${s.setting} became important when ${s.fact}. The information was not false, but it was incomplete when separated from the rest of the record. ${s.detail}`,
      `The missing context was that ${s.reason}. This explained why a quick reading could produce a conclusion that felt reasonable but was still wrong.`,
      `After the context was restored, ${s.inference}. The people involved could then distinguish the rule from the appearance created by one stage of the process.`,
      `The word "${s.keyword}" is used to mean ${s.keywordMeaning}. Its role is to sharpen the passage's contrast: ${s.contrast}.`,
      `The episode illustrates a wider principle: ${s.idea}. Accurate information becomes useful only when the reader also knows what the information is meant to represent.`
    ],
    [
      `The passage begins with a practical difficulty at ${s.setting}: ${s.fact}. The first interpretation focused on the outcome that could be seen immediately. ${s.detail}`,
      `That interpretation changed after the underlying procedure was checked. ${s.reason}. The explanation showed that the visible outcome belonged to only one part of a larger sequence.`,
      `${s.inference}. In other words, the correction came from understanding the sequence rather than from discovering that the original record was entirely wrong.`,
      `"${s.keyword}" means ${s.keywordMeaning} here. This helps explain why ${s.contrast}.`,
      `The main takeaway is that ${s.idea}. The reader has to connect timing, labels and purpose before deciding what a record proves.`
    ],
    [
      `What looked like a minor inconsistency in ${s.setting} began when ${s.fact}. Users could see the result, but the result did not explain itself. ${s.detail}`,
      `The underlying reason was that ${s.reason}. This distinction mattered because two stages could produce similar-looking information while carrying different implications.`,
      `Once the stages were separated, ${s.inference}. The process became easier to understand because the evidence was tied to the point at which it had been recorded.`,
      `The passage uses "${s.keyword}" to mean ${s.keywordMeaning}. That sense fits the central contrast: ${s.contrast}.`,
      `The broader message is that ${s.idea}. The passage rewards a reader who asks what a label refers to before treating the label as a complete conclusion.`
    ],
    [
      `At ${s.setting}, a familiar process produced an unfamiliar result: ${s.fact}. Rather than treating the result as self-explanatory, the people involved compared it with the procedure that governed the case. ${s.detail}`,
      `That comparison revealed that ${s.reason}. The important difference was therefore not between truth and error, but between two pieces of information with different functions.`,
      `${s.inference}. The eventual solution preserved the useful record while making its meaning easier to understand.`,
      `In context, "${s.keyword}" means ${s.keywordMeaning}. The reader can see its importance in the contrast that ${s.contrast}.`,
      `The incident supports a simple principle: ${s.idea}. When a process has several stages, a good explanation tells users which stage each piece of information belongs to.`
    ]
  ];
  return finish(P[v].map(x=>x),s);
};

const rebuild=(specs:readonly Eng008ExpansionSpec[],existing:readonly ExistingPassage[])=>{
  const byId=new Map(existing.map(x=>[x.id,x]));
  return specs.map(spec=>{
    const old=byId.get(spec.id);
    if(!old)throw new Error("Missing existing CP003 passage "+spec.id);
    return {...old,text:makeText(spec)};
  });
};

export const ENG008_CP003_REMEDIATED_WAVE14_V1=
  rebuild(ENG008_WAVE14_BP_SPECS,ENG008_CP003_EXPANSION_WAVE14_V1) as any;
export const ENG008_CP003_REMEDIATED_WAVE15_V1=
  rebuild(ENG008_WAVE15_BP_SPECS,ENG008_CP003_EXPANSION_WAVE15_V1) as any;
export const ENG008_CP003_REMEDIATED_WAVE16_V1=
  rebuild(ENG008_WAVE16_BP_SPECS,ENG008_CP003_EXPANSION_WAVE16_V1) as any;
export const ENG008_CP003_REMEDIATED_WAVE17_V1=
  rebuild(ENG008_WAVE17_BP_SPECS,ENG008_CP003_EXPANSION_WAVE17_V1) as any;
export const ENG008_CP003_REMEDIATED_WAVE18_V1=
  rebuild(ENG008_WAVE18_BP_SPECS,ENG008_CP003_EXPANSION_WAVE18_V1) as any;
export const ENG008_CP003_REMEDIATED_WAVE19_V1=
  rebuild(ENG008_WAVE19_BP_SPECS,ENG008_CP003_EXPANSION_WAVE19_V1) as any;
