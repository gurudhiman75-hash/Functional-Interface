import{ENG011_SETS_V1,type Eng011SetV1}from"./eng-011-authorities-v1";
import{ENG011_PRODUCTION_EXPANSION_V2}from"./eng-011-production-expansion-v2";

export const ENG011_ACTIVE_SETS_V2:readonly Eng011SetV1[]=[
 ...ENG011_SETS_V1,
 ...ENG011_PRODUCTION_EXPANSION_V2
];
