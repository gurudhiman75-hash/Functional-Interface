import type{Eng012AuthorityV1,Eng012Pair}from"./eng-012-authorities-v1";
import{ENG012_AUTHORITIES_V1}from"./eng-012-authorities-v1";
import{ENG012_BANKING_AUTHORITIES_V1}from"./eng-012-banking-authorities-v1";
import{ENG012_PRODUCTION_SSC_V2}from"./eng-012-production-ssc-v2";

const PAIRS:readonly Eng012Pair[]=[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]];
function same(a:Eng012Pair,b:Eng012Pair){return a[0]===b[0]&&a[1]===b[1];}
function alternate(cp:"ENG-012-CP003"|"ENG-012-CP004",limit:number,prefix:string){
 const out:Eng012AuthorityV1[]=[];
 for(const a of ENG012_BANKING_AUTHORITIES_V1.filter(x=>x.cpId===cp)){
  for(const swap of PAIRS.filter(p=>!same(p,a.swap))){
   out.push({...a,id:`${prefix}-${a.id}-${swap[0]}${swap[1]}`,swap,cue1:`${a.natural[swap[0]-1]} fits its original position`,cue2:`${a.natural[swap[1]-1]} fits its original position`});
   if(out.length===limit)return out;
  }
 }
 return out;
}
const bp=alternate("ENG-012-CP003",76,"WS-PROD-BP");
const bm=alternate("ENG-012-CP004",86,"WS-PROD-BM");

export const ENG012_ACTIVE_AUTHORITIES_V2:readonly Eng012AuthorityV1[]=[
 ...ENG012_AUTHORITIES_V1,
 ...ENG012_BANKING_AUTHORITIES_V1,
 ...ENG012_PRODUCTION_SSC_V2,
 ...bp,
 ...bm
];
export const ENG012_ACTIVE_COUNTS_V2={cp001:120,cp002:120,cp003:100,cp004:110,total:450,surfaces:1350}as const;
