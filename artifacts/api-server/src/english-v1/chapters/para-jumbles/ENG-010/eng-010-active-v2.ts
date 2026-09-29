import{ENG010_SETS_V1,type Eng010SetV1}from"./eng-010-authorities-v1";
import{ENG010_SSC_AUTHENTIC_V2}from"./eng-010-ssc-authentic-v2";

const banking=ENG010_SETS_V1.filter(x=>x.cpId==="ENG-010-CP003"||x.cpId==="ENG-010-CP004");
export const ENG010_ACTIVE_SETS_V2:readonly Eng010SetV1[]=[
...ENG010_SSC_AUTHENTIC_V2 as readonly Eng010SetV1[],
...banking
];

export const ENG010_RETIRED_SSC_EXTENDED_V1=ENG010_SETS_V1.filter(x=>x.cpId==="ENG-010-CP001"||x.cpId==="ENG-010-CP002");
