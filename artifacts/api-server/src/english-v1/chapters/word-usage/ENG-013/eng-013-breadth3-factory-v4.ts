import type{Eng013AuthorityV1,Eng013CpId,Eng013Difficulty}from"./eng-013-authorities-v1";

export type Eng013BreadthRecordV4=readonly[
 word:string,
 template:string,
 forms:readonly[string,string,string,string],
 explanation:string,
 difficulty?:Eng013Difficulty
];

export function buildEng013BreadthAuthoritiesV4(
 prefix:string,
 cpId:Eng013CpId,
 records:readonly Eng013BreadthRecordV4[]
):Eng013AuthorityV1[]{
 return records.map((r,i)=>({
  id:`${prefix}-${String(i+1).padStart(3,"0")}`,
  cpId,
  difficulty:r[4]??(cpId==="ENG-013-CP001"?"medium":"hard"),
  word:r[0],
  mode:"correct",
  sentences:r[2].map(form=>r[1].replace("{x}",form)) as readonly[string,string,string,string],
  answerIndex:0,
  explanation:r[3]
 }));
}
