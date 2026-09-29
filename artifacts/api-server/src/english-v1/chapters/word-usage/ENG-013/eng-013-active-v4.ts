import type{Eng013AuthorityV1}from"./eng-013-authorities-v1";
import{ENG013_ACTIVE_AUTHORITIES_V3}from"./eng-013-active-v3";
import{ENG013_BREADTH3_SSC_STANDARD_A_V4}from"./eng-013-breadth3-ssc-standard-a-v4";
import{ENG013_BREADTH3_SSC_STANDARD_B_V4}from"./eng-013-breadth3-ssc-standard-b-v4";
import{ENG013_BREADTH3_SSC_ADVANCED_A_V4}from"./eng-013-breadth3-ssc-advanced-a-v4";
import{ENG013_BREADTH3_SSC_ADVANCED_B_V4}from"./eng-013-breadth3-ssc-advanced-b-v4";
import{ENG013_BREADTH3_BANKING_PRELIMS_A_V4}from"./eng-013-breadth3-banking-prelims-a-v4";
import{ENG013_BREADTH3_BANKING_PRELIMS_B_V4}from"./eng-013-breadth3-banking-prelims-b-v4";
import{ENG013_BREADTH3_BANKING_MAINS_A_V4}from"./eng-013-breadth3-banking-mains-a-v4";
import{ENG013_BREADTH3_BANKING_MAINS_B_V4}from"./eng-013-breadth3-banking-mains-b-v4";

export const ENG013_BREADTH3_AUTHORITIES_V4:readonly Eng013AuthorityV1[]=[
 ...ENG013_BREADTH3_SSC_STANDARD_A_V4,
 ...ENG013_BREADTH3_SSC_STANDARD_B_V4,
 ...ENG013_BREADTH3_SSC_ADVANCED_A_V4,
 ...ENG013_BREADTH3_SSC_ADVANCED_B_V4,
 ...ENG013_BREADTH3_BANKING_PRELIMS_A_V4,
 ...ENG013_BREADTH3_BANKING_PRELIMS_B_V4,
 ...ENG013_BREADTH3_BANKING_MAINS_A_V4,
 ...ENG013_BREADTH3_BANKING_MAINS_B_V4
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
 previous:384,
 breadthWave3Added:384
}as const;
