import{ENG013_AUTHORITIES_V1,type Eng013AuthorityV1}from"./eng-013-authorities-v1";
import{ENG013_BANKING_AUTHORITIES_V1}from"./eng-013-banking-authorities-v1";
import{ENG013_BREADTH_SSC_STANDARD_V2}from"./eng-013-breadth-ssc-standard-v2";
import{ENG013_BREADTH_SSC_ADVANCED_V2}from"./eng-013-breadth-ssc-advanced-v2";
import{ENG013_BREADTH_BANKING_PRELIMS_V2}from"./eng-013-breadth-banking-prelims-v2";
import{ENG013_BREADTH_BANKING_MAINS_V2}from"./eng-013-breadth-banking-mains-v2";

export const ENG013_ACTIVE_AUTHORITIES_V2:readonly Eng013AuthorityV1[]=[
 ...ENG013_AUTHORITIES_V1,
 ...ENG013_BANKING_AUTHORITIES_V1,
 ...ENG013_BREADTH_SSC_STANDARD_V2,
 ...ENG013_BREADTH_SSC_ADVANCED_V2,
 ...ENG013_BREADTH_BANKING_PRELIMS_V2,
 ...ENG013_BREADTH_BANKING_MAINS_V2
];

export const ENG013_ACTIVE_COUNTS_V2={
 cp001:60,
 cp002:60,
 cp003:60,
 cp004:60,
 total:240,
 breadthAdded:144
}as const;
