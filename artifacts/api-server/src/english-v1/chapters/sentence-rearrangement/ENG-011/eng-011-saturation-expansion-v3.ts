import type{Eng011SetV1,Eng011CpId,Eng011Difficulty}from"./eng-011-authorities-v1";
import{
 ENG011_STD_THEMES_V2,ENG011_ADV_THEMES_V2,ENG011_BP_THEMES_V2,ENG011_BM_THEMES_V2,
 type Eng011ProductionTheme
}from"./eng-011-production-expansion-v2";

function build(theme:Eng011ProductionTheme,cpId:Eng011CpId,difficulty:Eng011Difficulty,prefix:string,index:number,count:4|5|6):Eng011SetV1[]{
 const four=[
  [theme.time,theme.subject,theme.verb,theme.object],
  [theme.condition,theme.subject,theme.verb,theme.object],
  [theme.subject,theme.verb,theme.object,theme.time],
  [theme.subject,theme.verb,theme.object,theme.reason],
  [theme.subject,theme.verb,theme.object,theme.contrast],
  [theme.subject,theme.verb,theme.object,theme.condition],
  [theme.place,theme.subject,theme.verb,theme.object],
  [theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.reason,theme.subject,theme.verb,theme.object]
 ];
 const five=[
  [theme.time,theme.subject,theme.verb,theme.object,theme.condition],
  [theme.reason,theme.subject,theme.verb,theme.object,theme.place],
  [theme.contrast,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.condition,theme.subject,theme.verb,theme.object,theme.time],
  [theme.place,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.subject,theme.verb,theme.object,theme.reason,theme.purpose],
  [theme.subject,theme.verb,theme.object,theme.condition,theme.place],
  [theme.time,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.reason,theme.subject,theme.verb,theme.object,theme.condition]
 ];
 const six=[
  [theme.time,theme.reason,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.contrast,theme.condition,theme.subject,theme.verb,theme.object,theme.place],
  [theme.place,theme.time,theme.subject,theme.verb,theme.object,theme.purpose],
  [theme.reason,theme.subject,theme.verb,theme.object,theme.condition,theme.place],
  [theme.condition,theme.subject,theme.verb,theme.object,theme.purpose,theme.time],
  [theme.subject,theme.verb,theme.object,theme.reason,theme.condition,theme.place],
  [theme.time,theme.contrast,theme.subject,theme.verb,theme.object,theme.condition],
  [theme.place,theme.subject,theme.verb,theme.object,theme.purpose,theme.condition],
  [theme.reason,theme.contrast,theme.subject,theme.verb,theme.object,theme.purpose]
 ];
 const source=count===4?four:count===5?five:six;
 return source.map((fragments,v)=>({
  id:`${prefix}-${String(index+1).padStart(2,"0")}-${v+1}`,
  cpId,difficulty,topic:theme.topic,fragments,
  order:Array.from({length:fragments.length},(_,i)=>i+1),
  explanation:"Identify the core subject and verb first. Then connect the object and attach the remaining time, reason, condition, contrast, place or purpose phrase where the grammar and meaning require it."
 }));
}
export const ENG011_SATURATION_EXPANSION_V3:readonly Eng011SetV1[]=[
 ...ENG011_STD_THEMES_V2.flatMap((t,i)=>build(t,"ENG-011-CP001",i%3===0?"easy":"medium","SR-SAT-S",i,4)),
 ...ENG011_ADV_THEMES_V2.flatMap((t,i)=>build(t,"ENG-011-CP002",i%3===0?"medium":"hard","SR-SAT-A",i,5)),
 ...ENG011_BP_THEMES_V2.flatMap((t,i)=>build(t,"ENG-011-CP003",i%3===0?"medium":"hard","SR-SAT-BP",i,5)),
 ...ENG011_BM_THEMES_V2.flatMap((t,i)=>build(t,"ENG-011-CP004",i%4===0?"medium":"hard","SR-SAT-BM",i,6))
];
export const ENG011_SATURATION_COUNTS_V3={
 cp001:ENG011_STD_THEMES_V2.length*9,
 cp002:ENG011_ADV_THEMES_V2.length*9,
 cp003:ENG011_BP_THEMES_V2.length*9,
 cp004:ENG011_BM_THEMES_V2.length*9,
 total:(ENG011_STD_THEMES_V2.length+ENG011_ADV_THEMES_V2.length+ENG011_BP_THEMES_V2.length+ENG011_BM_THEMES_V2.length)*9
}as const;
