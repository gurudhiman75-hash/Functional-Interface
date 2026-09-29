import type{Eng013AuthorityV1,Eng013CpId,Eng013Difficulty}from"./eng-013-authorities-v1";

export type Eng013Breadth3SpecV4=readonly[
 id:string,
 word:string,
 difficulty:Eng013Difficulty,
 correct1:string,
 correct2:string,
 correct3:string,
 incorrect:string,
 explanation:string
];

export function makeEng013Breadth3AuthoritiesV4(
 cpId:Eng013CpId,
 specs:readonly Eng013Breadth3SpecV4[]
):readonly Eng013AuthorityV1[]{
 return specs.map(([id,word,difficulty,c1,c2,c3,bad,explanation])=>({
  id,cpId,difficulty,word,mode:"incorrect"as const,
  sentences:[c1,c2,c3,bad]as const,
  answerIndex:3 as const,
  explanation
 }));
}
