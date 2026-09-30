import type{Eng011SetV1,Eng011CpId,Eng011Difficulty}from"./eng-011-authorities-v1";
import{
 ENG011_STD_THEMES_V2,ENG011_ADV_THEMES_V2,ENG011_BP_THEMES_V2,ENG011_BM_THEMES_V2,
 type Eng011ProductionTheme
}from"./eng-011-production-expansion-v2";

const SATURATION_SUBJECT_CUES=[
 "in routine practice",
 "under the revised approach",
 "during regular review",
 "for day-to-day use",
 "in ordinary conditions",
 "as part of routine planning",
 "during periodic checks",
 "under normal operating conditions",
 "in practical terms"
]as const;

function build(theme:Eng011ProductionTheme,cpId:Eng011CpId,difficulty:Eng011Difficulty,prefix:string,index:number,profile:"standard"|"advanced"|"prelims"|"mains"):Eng011SetV1[]{
 const standard=[
  [theme.reason,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.contrast,theme.subject,theme.verb,theme.object,theme.condition],
  [theme.time,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.condition,theme.subject,theme.verb,theme.object,theme.place],
  [theme.subject,theme.verb,theme.object,theme.purpose,theme.time],
  [theme.reason,theme.subject,theme.verb,theme.object,theme.condition],
  [theme.place,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.contrast,theme.subject,theme.verb,theme.object,theme.place],
  [theme.time,theme.subject,theme.verb,theme.object,theme.condition]
 ];
 const advanced=[
  [theme.place,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.contrast,theme.subject,theme.verb,theme.object,theme.place],
  [theme.time,theme.subject,theme.verb,theme.object,theme.condition],
  [theme.subject,theme.verb,theme.object,theme.reason,theme.purpose],
  [theme.subject,theme.verb,theme.object,theme.condition,theme.time],
  [theme.subject,theme.verb,theme.object,theme.contrast,theme.purpose],
  [theme.condition,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.place,theme.subject,theme.verb,theme.object,theme.condition],
  [theme.contrast,theme.subject,theme.verb,theme.object,theme.time]
 ];
 const mains=[
  [theme.place,theme.contrast,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.time,theme.reason,theme.subject,theme.verb,theme.object,theme.condition],
  [theme.contrast,theme.subject,theme.verb,theme.object,theme.condition,theme.place],
  [theme.condition,theme.subject,theme.verb,theme.object,theme.purpose,theme.time],
  [theme.place,theme.subject,theme.verb,theme.object,theme.reason,theme.condition],
  [theme.subject,theme.verb,theme.object,theme.reason,theme.condition,theme.place],
  [theme.time,theme.subject,theme.verb,theme.object,theme.condition,theme.place],
  [theme.contrast,theme.subject,theme.verb,theme.object,theme.purpose,theme.time],
  [theme.place,theme.subject,theme.verb,theme.object,theme.purpose,theme.condition]
 ];
 const source=profile==="standard"?standard:profile==="mains"?mains:advanced;
 return source.map((fragments,v)=>{
  const cue=SATURATION_SUBJECT_CUES[v]!;
  const distinct=fragments.map(part=>part===theme.subject?`${cue}, ${theme.subject}`:part);
  return{
   id:`${prefix}-${String(index+1).padStart(2,"0")}-${v+1}`,
   cpId,difficulty,topic:theme.topic,fragments:distinct,
   order:Array.from({length:distinct.length},(_,i)=>i+1),
   explanation:`Start with the main grammatical link: "${cue}, ${theme.subject}" leads into "${theme.verb}" and then "${theme.object}". Attach the remaining time, reason, condition, contrast, place or purpose phrase where the grammar and meaning require it. The cue is part of the sentence, so the set is not interchangeable with another saturation variant.`
  };
 });
}
export const ENG011_SATURATION_EXPANSION_V3:readonly Eng011SetV1[]=[
 ...ENG011_STD_THEMES_V2.flatMap((t,i)=>build(t,"ENG-011-CP001",i%3===0?"easy":"medium","SR-SAT-S",i,"standard")),
 ...ENG011_ADV_THEMES_V2.flatMap((t,i)=>build(t,"ENG-011-CP002",i%3===0?"medium":"hard","SR-SAT-A",i,"advanced")),
 ...ENG011_BP_THEMES_V2.flatMap((t,i)=>build(t,"ENG-011-CP003",i%3===0?"medium":"hard","SR-SAT-BP",i,"prelims")),
 ...ENG011_BM_THEMES_V2.flatMap((t,i)=>build(t,"ENG-011-CP004",i%4===0?"medium":"hard","SR-SAT-BM",i,"mains"))
];
export const ENG011_SATURATION_COUNTS_V3={
 cp001:ENG011_STD_THEMES_V2.length*9,
 cp002:ENG011_ADV_THEMES_V2.length*9,
 cp003:ENG011_BP_THEMES_V2.length*9,
 cp004:ENG011_BM_THEMES_V2.length*9,
 total:(ENG011_STD_THEMES_V2.length+ENG011_ADV_THEMES_V2.length+ENG011_BP_THEMES_V2.length+ENG011_BM_THEMES_V2.length)*9
}as const;
