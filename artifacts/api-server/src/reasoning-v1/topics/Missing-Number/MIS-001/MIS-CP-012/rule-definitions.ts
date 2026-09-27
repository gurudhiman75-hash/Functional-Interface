export type MisCp012CandidateId='MIS-CAND-079'|'MIS-CAND-080'|'MIS-CAND-081'|'MIS-CAND-082'|'MIS-CAND-083';
export type MisCp012ProfileId='SUM_VS_PRODUCT'|'SQUARE_PLUS_SECOND_VS_PRODUCT'|'ROW_VS_COLUMN_PRODUCTS'|'COMPOUND_RULE_COMPETITION'|'ROW_VS_DIAGONAL_PRODUCTS';
export interface MisCp012Profile{
 readonly candidateId:MisCp012CandidateId;readonly profileId:MisCp012ProfileId;readonly label:string;
 readonly semanticAuthorityCandidateId:string;readonly createsNewSemanticAuthority:false;
 readonly intendedRule:string;readonly competingRule:string;readonly renderer:'TABLE_2'|'TABLE_3'|'SVG_BOX';readonly difficulty:'Hard';
}
export const MIS_CP012_PROFILES:readonly MisCp012Profile[]=Object.freeze([
 {candidateId:'MIS-CAND-079',profileId:'SUM_VS_PRODUCT',label:'sum survives product competition',semanticAuthorityCandidateId:'MIS-CAND-001',createsNewSemanticAuthority:false,intendedRule:'SUM',competingRule:'PRODUCT',renderer:'TABLE_2',difficulty:'Hard'},
 {candidateId:'MIS-CAND-080',profileId:'SQUARE_PLUS_SECOND_VS_PRODUCT',label:'a²+b survives product competition',semanticAuthorityCandidateId:'MIS-CAND-017',createsNewSemanticAuthority:false,intendedRule:'SQUARE_FIRST_PLUS_SECOND',competingRule:'PRODUCT',renderer:'TABLE_2',difficulty:'Hard'},
 {candidateId:'MIS-CAND-081',profileId:'ROW_VS_COLUMN_PRODUCTS',label:'row-pair products survive column-pair competition',semanticAuthorityCandidateId:'MIS-CAND-051',createsNewSemanticAuthority:false,intendedRule:'ROW_PRODUCTS_SUM',competingRule:'COLUMN_PRODUCTS_SUM',renderer:'SVG_BOX',difficulty:'Hard'},
 {candidateId:'MIS-CAND-082',profileId:'COMPOUND_RULE_COMPETITION',label:'ab−c² survives a²+bc competition',semanticAuthorityCandidateId:'MIS-CAND-075',createsNewSemanticAuthority:false,intendedRule:'PAIR_PRODUCT_MINUS_THIRD_SQUARE',competingRule:'FIRST_SQUARE_PLUS_PAIR_PRODUCT',renderer:'TABLE_3',difficulty:'Hard'},
 {candidateId:'MIS-CAND-083',profileId:'ROW_VS_DIAGONAL_PRODUCTS',label:'row-pair products survive diagonal-pair competition',semanticAuthorityCandidateId:'MIS-CAND-051',createsNewSemanticAuthority:false,intendedRule:'ROW_PRODUCTS_SUM',competingRule:'DIAGONAL_PRODUCTS_SUM',renderer:'SVG_BOX',difficulty:'Hard'},
]);
export function misCp012ProfileByCandidateId(id:string):MisCp012Profile{const p=MIS_CP012_PROFILES.find(x=>x.candidateId===id);if(!p)throw new Error('Unknown MIS-CP-012 candidate: '+id);return p;}
