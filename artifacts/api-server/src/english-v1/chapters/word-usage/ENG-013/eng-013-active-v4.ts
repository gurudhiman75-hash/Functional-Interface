import type{Eng013AuthorityV1}from"./eng-013-authorities-v1";
import{ENG013_ACTIVE_AUTHORITIES_V3}from"./eng-013-active-v3";
import{ENG013_BREADTH3_SSC_STANDARD_V4}from"./eng-013-breadth3-ssc-standard-v4";
import{ENG013_BREADTH3_SSC_ADVANCED_V4}from"./eng-013-breadth3-ssc-advanced-v4";
import{ENG013_BREADTH3_BANKING_PRELIMS_V4}from"./eng-013-breadth3-banking-prelims-v4";
import{ENG013_BREADTH3_BANKING_MAINS_V4}from"./eng-013-breadth3-banking-mains-v4";

export const ENG013_BREADTH3_AUTHORITIES_V4:readonly Eng013AuthorityV1[]=[
 ...ENG013_BREADTH3_SSC_STANDARD_V4,
 ...ENG013_BREADTH3_SSC_ADVANCED_V4,
 ...ENG013_BREADTH3_BANKING_PRELIMS_V4,
 ...ENG013_BREADTH3_BANKING_MAINS_V4
];

export const ENG013_ACTIVE_AUTHORITIES_V4:readonly Eng013AuthorityV1[]=[
 ...ENG013_ACTIVE_AUTHORITIES_V3,
 ...ENG013_BREADTH3_AUTHORITIES_V4
];

export const ENG013_ACTIVE_COUNTS_V4={
 cp001:192,
 cp002:192,
 cp003:192,
 cp004:192,
 total:768,
 breadthWave1Added:144,
 breadthWave2Added:144,
 breadthWave3Added:384
}as const;
