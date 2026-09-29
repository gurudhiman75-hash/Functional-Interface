import{ENG011_SETS_V1,type Eng011SetV1}from"./eng-011-authorities-v1";
import{ENG011_PRODUCTION_EXPANSION_V2}from"./eng-011-production-expansion-v2";
import{ENG011_SATURATION_EXPANSION_V3}from"./eng-011-saturation-expansion-v3";

export const ENG011_ACTIVE_SETS_V2:readonly Eng011SetV1[]=[
 ...ENG011_SETS_V1,
 ...ENG011_PRODUCTION_EXPANSION_V2,
 ...ENG011_SATURATION_EXPANSION_V3
];
