import type{Eng013AuthorityV1}from"./eng-013-authorities-v1";
import{ENG013_ACTIVE_AUTHORITIES_V2}from"./eng-013-active-v2";
import{ENG013_BREADTH2_SSC_STANDARD_V3}from"./eng-013-breadth2-ssc-standard-v3";
import{ENG013_BREADTH2_SSC_ADVANCED_V3}from"./eng-013-breadth2-ssc-advanced-v3";
import{ENG013_BREADTH2_BANKING_PRELIMS_V3}from"./eng-013-breadth2-banking-prelims-v3";
import{ENG013_BREADTH2_BANKING_MAINS_V3}from"./eng-013-breadth2-banking-mains-v3";

export const ENG013_ACTIVE_AUTHORITIES_V3:readonly Eng013AuthorityV1[]=[
 ...ENG013_ACTIVE_AUTHORITIES_V2,
 ...ENG013_BREADTH2_SSC_STANDARD_V3,
 ...ENG013_BREADTH2_SSC_ADVANCED_V3,
 ...ENG013_BREADTH2_BANKING_PRELIMS_V3,
 ...ENG013_BREADTH2_BANKING_MAINS_V3
];

export const ENG013_ACTIVE_COUNTS_V3={
 cp001:96,
 cp002:96,
 cp003:96,
 cp004:96,
 total:384,
 breadthWave1Added:144,
 breadthWave2Added:144
}as const;
