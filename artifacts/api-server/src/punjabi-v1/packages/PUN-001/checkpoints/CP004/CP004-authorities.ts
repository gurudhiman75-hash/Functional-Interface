export type CP004AuthorityStatus = "REVIEW_PENDING";
export type CP004GenderKind = "MORPHOLOGICAL_PAIR" | "LEXICAL_COUNTERPART";
export type CP004GenderDomain = "ANIMAL" | "KINSHIP" | "OCCUPATION" | "GENERAL_HUMAN";
export type CP004GenderRule = "A_TO_I" | "I_TO_AN" | "SUFFIX_NI" | "SUFFIX_ANI" | "LEXICAL";
export type CP004NumberRule = "MASC_A_TO_E" | "FEM_CONSONANT_TO_AAN" | "FEM_I_TO_IAN" | "VOWEL_TO_VAAN" | "IRREGULAR";

export interface CP004GenderPair {
  id:string; donorIds:readonly string[]; priorApprovedIds:readonly string[];
  masculine:string; feminine:string; kind:CP004GenderKind; domain:CP004GenderDomain;
  rule:CP004GenderRule; transformSafe:boolean; sourceStatus:CP004AuthorityStatus;
}
export interface CP004NumberPair {
  id:string; donorIds:readonly string[]; priorApprovedIds:readonly string[];
  singular:string; plural:string; rule:CP004NumberRule; directSafe:boolean; sourceStatus:CP004AuthorityStatus;
}
export type CP004AgreementDimension = "GENDER" | "NUMBER";
export interface CP004AgreementContext {
  id:string; dimension:CP004AgreementDimension; targetPa:string; correct:string;
  incorrect:readonly [string,string,string,string]; principlePa:string; sourceStatus:CP004AuthorityStatus;
}

/** Exhaustive audited gender concepts. Duplicate donor rows are provenance, not separate authorities. */
export const CP004_GENDER_PAIRS: readonly CP004GenderPair[] = [
  {id:"GEN-R001",donorIds:["GEN-083"],priorApprovedIds:[],masculine:"ਊਠ",feminine:"ਡਾਚੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R002",donorIds:["GEN-090"],priorApprovedIds:[],masculine:"ਸੱਪ",feminine:"ਸਪਨੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_NI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R003",donorIds:["GEN-060"],priorApprovedIds:[],masculine:"ਸੂਰ",feminine:"ਸੂਰਨੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_NI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R004",donorIds:["GEN-003"],priorApprovedIds:["GEN-013"],masculine:"ਸ਼ੇਰ",feminine:"ਸ਼ੇਰਨੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_NI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R005",donorIds:["GEN-016","GEN-047","GEN-089"],priorApprovedIds:["GEN-012"],masculine:"ਹਿਰਨ",feminine:"ਹਿਰਨੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_NI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R006",donorIds:["GEN-086"],priorApprovedIds:[],masculine:"ਕੱਟਾ",feminine:"ਕੱਟੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R007",donorIds:["GEN-080"],priorApprovedIds:["GEN-010"],masculine:"ਕਬੂਤਰ",feminine:"ਕਬੂਤਰੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R008",donorIds:["GEN-015"],priorApprovedIds:["GEN-009"],masculine:"ਕੁੱਕੜ",feminine:"ਕੁੱਕੜੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R009",donorIds:["GEN-001"],priorApprovedIds:["GEN-001"],masculine:"ਘੋੜਾ",feminine:"ਘੋੜੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R010",donorIds:["GEN-087"],priorApprovedIds:["GEN-008"],masculine:"ਚੂਹਾ",feminine:"ਚੂਹੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R011",donorIds:["GEN-084"],priorApprovedIds:[],masculine:"ਝੋਟਾ",feminine:"ਮੱਝ",domain:"ANIMAL" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R012",donorIds:["GEN-008","GEN-065"],priorApprovedIds:[],masculine:"ਬਲਦ",feminine:"ਗਾਂ",domain:"ANIMAL" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R013",donorIds:["GEN-088"],priorApprovedIds:[],masculine:"ਬਾਂਦਰ",feminine:"ਬਾਂਦਰੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R014",donorIds:["GEN-045"],priorApprovedIds:["GEN-007"],masculine:"ਬਿੱਲਾ",feminine:"ਬਿੱਲੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R015",donorIds:["GEN-017","GEN-046","GEN-082"],priorApprovedIds:["GEN-011"],masculine:"ਮੋਰ",feminine:"ਮੋਰਨੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_NI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R016",donorIds:["GEN-085"],priorApprovedIds:[],masculine:"ਵੱਛਾ",feminine:"ਵੱਛੀ",domain:"ANIMAL" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R017",donorIds:[],priorApprovedIds:["GEN-016"],masculine:"ਨਰ",feminine:"ਨਾਰੀ",domain:"GENERAL_HUMAN" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R018",donorIds:["GEN-031","GEN-061"],priorApprovedIds:[],masculine:"ਪੁਰਖ",feminine:"ਇਸਤਰੀ",domain:"GENERAL_HUMAN" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R019",donorIds:["GEN-014"],priorApprovedIds:["GEN-006"],masculine:"ਬੱਚਾ",feminine:"ਬੱਚੀ",domain:"GENERAL_HUMAN" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R020",donorIds:["GEN-034","GEN-066"],priorApprovedIds:[],masculine:"ਮਰਦ",feminine:"ਔਰਤ",domain:"GENERAL_HUMAN" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R021",donorIds:[],priorApprovedIds:["GEN-025"],masculine:"ਮੁੰਡਾ",feminine:"ਕੁੜੀ",domain:"GENERAL_HUMAN" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R022",donorIds:["GEN-033"],priorApprovedIds:["GEN-024"],masculine:"ਰਾਜਾ",feminine:"ਰਾਣੀ",domain:"GENERAL_HUMAN" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R023",donorIds:["GEN-038","GEN-071"],priorApprovedIds:[],masculine:"ਸਹੁਰਾ",feminine:"ਸੱਸ",domain:"KINSHIP" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R024",donorIds:["GEN-011","GEN-042","GEN-076"],priorApprovedIds:["GEN-003"],masculine:"ਚਾਚਾ",feminine:"ਚਾਚੀ",domain:"KINSHIP" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R025",donorIds:["GEN-075"],priorApprovedIds:["GEN-026"],masculine:"ਤਾਇਆ",feminine:"ਤਾਈ",domain:"KINSHIP" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R026",donorIds:["GEN-002"],priorApprovedIds:["GEN-002"],masculine:"ਦਾਦਾ",feminine:"ਦਾਦੀ",domain:"KINSHIP" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R027",donorIds:["GEN-013","GEN-044","GEN-077"],priorApprovedIds:["GEN-005"],masculine:"ਨਾਨਾ",feminine:"ਨਾਨੀ",domain:"KINSHIP" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R028",donorIds:["GEN-032","GEN-070"],priorApprovedIds:["GEN-022"],masculine:"ਪਤੀ",feminine:"ਪਤਨੀ",domain:"KINSHIP" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R029",donorIds:["GEN-035","GEN-067"],priorApprovedIds:["GEN-023"],masculine:"ਪਿਤਾ",feminine:"ਮਾਤਾ",domain:"KINSHIP" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R030",donorIds:["GEN-068"],priorApprovedIds:[],masculine:"ਪੁੱਤਰ",feminine:"ਧੀ",domain:"KINSHIP" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R031",donorIds:["GEN-040","GEN-074"],priorApprovedIds:[],masculine:"ਫੁੱਫੜ",feminine:"ਭੂਆ",domain:"KINSHIP" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R032",donorIds:["GEN-009","GEN-069"],priorApprovedIds:["GEN-021"],masculine:"ਭਰਾ",feminine:"ਭੈਣ",domain:"KINSHIP" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R033",donorIds:["GEN-041","GEN-073"],priorApprovedIds:[],masculine:"ਮਾਸੜ",feminine:"ਮਾਸੀ",domain:"KINSHIP" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R034",donorIds:["GEN-012","GEN-043","GEN-078"],priorApprovedIds:["GEN-004"],masculine:"ਮਾਮਾ",feminine:"ਮਾਮੀ",domain:"KINSHIP" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R035",donorIds:["GEN-018"],priorApprovedIds:[],masculine:"ਸਰਦਾਰ",feminine:"ਸਰਦਾਰਨੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_NI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R036",donorIds:["GEN-019"],priorApprovedIds:[],masculine:"ਸੂਫ਼ੀ",feminine:"ਸੂਫ਼ਣ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"I_TO_AN" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R037",donorIds:["GEN-005"],priorApprovedIds:["GEN-015"],masculine:"ਸੇਠ",feminine:"ਸੇਠਾਣੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_ANI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R038",donorIds:["GEN-036"],priorApprovedIds:[],masculine:"ਕਵੀ",feminine:"ਕਵਿੱਤਰੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R039",donorIds:["GEN-057"],priorApprovedIds:[],masculine:"ਕੁਮ੍ਹਾਰ",feminine:"ਕੁਮ੍ਹਾਰੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R040",donorIds:["GEN-050"],priorApprovedIds:[],masculine:"ਖੱਤਰੀ",feminine:"ਖਤਰਾਣੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_ANI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R041",donorIds:["GEN-030"],priorApprovedIds:[],masculine:"ਗੁਆਲਾ",feminine:"ਗੁਆਲਣ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"I_TO_AN" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R042",donorIds:["GEN-059"],priorApprovedIds:[],masculine:"ਗ਼ੁਲਾਮ",feminine:"ਬਾਂਦੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R043",donorIds:["GEN-052"],priorApprovedIds:[],masculine:"ਚੌਧਰੀ",feminine:"ਚੌਧਰਾਣੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_ANI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R044",donorIds:["GEN-020","GEN-049"],priorApprovedIds:[],masculine:"ਜੱਟ",feminine:"ਜੱਟੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R045",donorIds:["GEN-023"],priorApprovedIds:[],masculine:"ਜੇਠ",feminine:"ਜੇਠਾਣੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_ANI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R046",donorIds:["GEN-025","GEN-058"],priorApprovedIds:[],masculine:"ਤਰਖਾਣ",feminine:"ਤਰਖਾਣੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R047",donorIds:["GEN-027","GEN-054"],priorApprovedIds:["GEN-019"],masculine:"ਤੇਲੀ",feminine:"ਤੇਲਣ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"I_TO_AN" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R048",donorIds:["GEN-006"],priorApprovedIds:["GEN-017"],masculine:"ਧੋਬੀ",feminine:"ਧੋਬਣ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"I_TO_AN" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R049",donorIds:["GEN-064"],priorApprovedIds:[],masculine:"ਨਵਾਬ",feminine:"ਬੇਗ਼ਮ",domain:"OCCUPATION" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R050",donorIds:["GEN-028"],priorApprovedIds:["GEN-020"],masculine:"ਨਾਈ",feminine:"ਨਾਇਣ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"I_TO_AN" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R051",donorIds:["GEN-022"],priorApprovedIds:["GEN-014"],masculine:"ਨੌਕਰ",feminine:"ਨੌਕਰਾਣੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_ANI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R052",donorIds:["GEN-021","GEN-051"],priorApprovedIds:[],masculine:"ਪੰਡਿਤ",feminine:"ਪੰਡਤਾਣੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_ANI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R053",donorIds:["GEN-063"],priorApprovedIds:[],masculine:"ਬਾਦਸ਼ਾਹ",feminine:"ਮਲਿਕਾ",domain:"OCCUPATION" as CP004GenderDomain,kind:"LEXICAL_COUNTERPART" as CP004GenderKind,rule:"LEXICAL" as CP004GenderRule,transformSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R054",donorIds:["GEN-029"],priorApprovedIds:["GEN-018"],masculine:"ਮਾਲੀ",feminine:"ਮਾਲਣ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"I_TO_AN" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R055",donorIds:["GEN-024","GEN-053"],priorApprovedIds:[],masculine:"ਮੁਗ਼ਲ",feminine:"ਮੁਗ਼ਲਾਣੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"SUFFIX_ANI" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R056",donorIds:["GEN-007"],priorApprovedIds:[],masculine:"ਮੋਚੀ",feminine:"ਮੋਚਣ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"I_TO_AN" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R057",donorIds:["GEN-079"],priorApprovedIds:[],masculine:"ਰਾਜਕੁਮਾਰ",feminine:"ਰਾਜਕੁਮਾਰੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"GEN-R058",donorIds:["GEN-056"],priorApprovedIds:[],masculine:"ਲੁਹਾਰ",feminine:"ਲੁਹਾਰੀ",domain:"OCCUPATION" as CP004GenderDomain,kind:"MORPHOLOGICAL_PAIR" as CP004GenderKind,rule:"A_TO_I" as CP004GenderRule,transformSafe:true,sourceStatus:"REVIEW_PENDING"},
] as const;

/** Exhaustive audited number concepts. Invariable pairs are retained but marked directSafe=false. */
export const CP004_NUMBER_PAIRS: readonly CP004NumberPair[] = [
  {id:"NUM-R001",donorIds:["NUM-004","NUM-041","NUM-063"],priorApprovedIds:["NUM-010"],singular:"ਅੱਖ",plural:"ਅੱਖਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R002",donorIds:["NUM-066"],priorApprovedIds:[],singular:"ਇੱਟ",plural:"ਇੱਟਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R003",donorIds:["NUM-019","NUM-039","NUM-068"],priorApprovedIds:["NUM-014"],singular:"ਸੜਕ",plural:"ਸੜਕਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R004",donorIds:["NUM-061"],priorApprovedIds:[],singular:"ਕੰਧ",plural:"ਕੰਧਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R005",donorIds:["NUM-070"],priorApprovedIds:[],singular:"ਕਮੀਜ਼",plural:"ਕਮੀਜ਼ਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R006",donorIds:["NUM-017"],priorApprovedIds:["NUM-013"],singular:"ਕਲਮ",plural:"ਕਲਮਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R007",donorIds:["NUM-003","NUM-040"],priorApprovedIds:["NUM-009"],singular:"ਕਿਤਾਬ",plural:"ਕਿਤਾਬਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R008",donorIds:[],priorApprovedIds:["NUM-012"],singular:"ਗੱਲ",plural:"ਗੱਲਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R009",donorIds:["NUM-062"],priorApprovedIds:[],singular:"ਛੱਤ",plural:"ਛੱਤਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R010",donorIds:["NUM-069"],priorApprovedIds:[],singular:"ਦਵਾਤ",plural:"ਦਵਾਤਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R011",donorIds:[],priorApprovedIds:["NUM-016"],singular:"ਦੁਕਾਨ",plural:"ਦੁਕਾਨਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R012",donorIds:["NUM-067"],priorApprovedIds:[],singular:"ਪੁਸਤਕ",plural:"ਪੁਸਤਕਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R013",donorIds:["NUM-064"],priorApprovedIds:[],singular:"ਬਾਂਹ",plural:"ਬਾਹਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R014",donorIds:[],priorApprovedIds:["NUM-015"],singular:"ਭੈਣ",plural:"ਭੈਣਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R015",donorIds:["NUM-042"],priorApprovedIds:[],singular:"ਮੱਝ",plural:"ਮੱਝਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R016",donorIds:["NUM-018"],priorApprovedIds:["NUM-011"],singular:"ਰਾਤ",plural:"ਰਾਤਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R017",donorIds:["NUM-065"],priorApprovedIds:[],singular:"ਲੱਤ",plural:"ਲੱਤਾਂ",rule:"FEM_CONSONANT_TO_AAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R018",donorIds:["NUM-045"],priorApprovedIds:[],singular:"ਸੂਈ",plural:"ਸੂਈਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R019",donorIds:[],priorApprovedIds:["NUM-032"],singular:"ਕਹਾਣੀ",plural:"ਕਹਾਣੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R020",donorIds:["NUM-024"],priorApprovedIds:["NUM-019"],singular:"ਕਾਪੀ",plural:"ਕਾਪੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R021",donorIds:["NUM-006"],priorApprovedIds:["NUM-018"],singular:"ਕੁਰਸੀ",plural:"ਕੁਰਸੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R022",donorIds:["NUM-005","NUM-036"],priorApprovedIds:["NUM-017"],singular:"ਕੁੜੀ",plural:"ਕੁੜੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R023",donorIds:[],priorApprovedIds:["NUM-026"],singular:"ਖਿੜਕੀ",plural:"ਖਿੜਕੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R024",donorIds:[],priorApprovedIds:["NUM-023"],singular:"ਗੱਡੀ",plural:"ਗੱਡੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R025",donorIds:["NUM-025"],priorApprovedIds:[],singular:"ਗਲੀ",plural:"ਗਲੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R026",donorIds:[],priorApprovedIds:["NUM-020"],singular:"ਚਾਬੀ",plural:"ਚਾਬੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R027",donorIds:[],priorApprovedIds:["NUM-025"],singular:"ਚਿੜੀ",plural:"ਚਿੜੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R028",donorIds:[],priorApprovedIds:["NUM-024"],singular:"ਟੋਪੀ",plural:"ਟੋਪੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R029",donorIds:["NUM-037"],priorApprovedIds:[],singular:"ਤਖ਼ਤੀ",plural:"ਤਖ਼ਤੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R030",donorIds:["NUM-022"],priorApprovedIds:[],singular:"ਥਾਲੀ",plural:"ਥਾਲੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R031",donorIds:[],priorApprovedIds:["NUM-031"],singular:"ਦਵਾਈ",plural:"ਦਵਾਈਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R032",donorIds:["NUM-023"],priorApprovedIds:["NUM-021"],singular:"ਨਦੀ",plural:"ਨਦੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R033",donorIds:["NUM-021","NUM-038"],priorApprovedIds:["NUM-022"],singular:"ਰੋਟੀ",plural:"ਰੋਟੀਆਂ",rule:"FEM_I_TO_IAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R034",donorIds:["NUM-034"],priorApprovedIds:[],singular:"ਸ਼ਹਿਰ",plural:"ਸ਼ਹਿਰ",rule:"IRREGULAR" as CP004NumberRule,directSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R035",donorIds:["NUM-031"],priorApprovedIds:[],singular:"ਸ਼ੇਰ",plural:"ਸ਼ੇਰ",rule:"IRREGULAR" as CP004NumberRule,directSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R036",donorIds:["NUM-009"],priorApprovedIds:[],singular:"ਹਾਥੀ",plural:"ਹਾਥੀ",rule:"IRREGULAR" as CP004NumberRule,directSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R037",donorIds:["NUM-043"],priorApprovedIds:["NUM-028"],singular:"ਗਾਂ",plural:"ਗਾਵਾਂ",rule:"IRREGULAR" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R038",donorIds:["NUM-032"],priorApprovedIds:[],singular:"ਘਰ",plural:"ਘਰ",rule:"IRREGULAR" as CP004NumberRule,directSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R039",donorIds:[],priorApprovedIds:["NUM-029"],singular:"ਥਾਂ",plural:"ਥਾਵਾਂ",rule:"IRREGULAR" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R040",donorIds:["NUM-010"],priorApprovedIds:[],singular:"ਦਰੱਖ਼ਤ",plural:"ਦਰੱਖ਼ਤ",rule:"IRREGULAR" as CP004NumberRule,directSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R041",donorIds:["NUM-035"],priorApprovedIds:[],singular:"ਪਿੰਡ",plural:"ਪਿੰਡ",rule:"IRREGULAR" as CP004NumberRule,directSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R042",donorIds:["NUM-033"],priorApprovedIds:[],singular:"ਫੁੱਲ",plural:"ਫੁੱਲ",rule:"IRREGULAR" as CP004NumberRule,directSafe:false,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R043",donorIds:["NUM-027"],priorApprovedIds:["NUM-027"],singular:"ਮਾਂ",plural:"ਮਾਵਾਂ",rule:"IRREGULAR" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R044",donorIds:["NUM-002","NUM-050"],priorApprovedIds:["NUM-002"],singular:"ਕਮਰਾ",plural:"ਕਮਰੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R045",donorIds:["NUM-048"],priorApprovedIds:["NUM-005"],singular:"ਕੁੱਤਾ",plural:"ਕੁੱਤੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R046",donorIds:["NUM-011","NUM-046"],priorApprovedIds:["NUM-003"],singular:"ਘੋੜਾ",plural:"ਘੋੜੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R047",donorIds:["NUM-013"],priorApprovedIds:[],singular:"ਚਰਖਾ",plural:"ਚਰਖੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R048",donorIds:["NUM-015"],priorApprovedIds:[],singular:"ਤਾਰਾ",plural:"ਤਾਰੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R049",donorIds:["NUM-049"],priorApprovedIds:[],singular:"ਦਰਵਾਜ਼ਾ",plural:"ਦਰਵਾਜ਼ੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R050",donorIds:["NUM-014"],priorApprovedIds:[],singular:"ਪੱਖਾ",plural:"ਪੱਖੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R051",donorIds:[],priorApprovedIds:["NUM-008"],singular:"ਪੱਤਾ",plural:"ਪੱਤੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R052",donorIds:["NUM-012"],priorApprovedIds:["NUM-004"],singular:"ਬੱਚਾ",plural:"ਬੱਚੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R053",donorIds:[],priorApprovedIds:["NUM-007"],singular:"ਬੂਟਾ",plural:"ਬੂਟੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R054",donorIds:["NUM-001","NUM-047"],priorApprovedIds:["NUM-001"],singular:"ਮੁੰਡਾ",plural:"ਮੁੰਡੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R055",donorIds:[],priorApprovedIds:["NUM-006"],singular:"ਰਸਤਾ",plural:"ਰਸਤੇ",rule:"MASC_A_TO_E" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R056",donorIds:["NUM-030","NUM-058"],priorApprovedIds:[],singular:"ਸਜ਼ਾ",plural:"ਸਜ਼ਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R057",donorIds:["NUM-026","NUM-052"],priorApprovedIds:[],singular:"ਸਭਾ",plural:"ਸਭਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R058",donorIds:["NUM-007","NUM-051"],priorApprovedIds:["NUM-030"],singular:"ਹਵਾ",plural:"ਹਵਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R059",donorIds:["NUM-057"],priorApprovedIds:[],singular:"ਕਲਾ",plural:"ਕਲਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R060",donorIds:["NUM-008","NUM-053"],priorApprovedIds:[],singular:"ਕਵਿਤਾ",plural:"ਕਵਿਤਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R061",donorIds:["NUM-054"],priorApprovedIds:[],singular:"ਘਟਨਾ",plural:"ਘਟਨਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R062",donorIds:["NUM-044"],priorApprovedIds:[],singular:"ਛਾਂ",plural:"ਛਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R063",donorIds:["NUM-055"],priorApprovedIds:[],singular:"ਦਿਸ਼ਾ",plural:"ਦਿਸ਼ਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R064",donorIds:["NUM-059"],priorApprovedIds:[],singular:"ਦੁਆ",plural:"ਦੁਆਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R065",donorIds:["NUM-028"],priorApprovedIds:[],singular:"ਭਾਸ਼ਾ",plural:"ਭਾਸ਼ਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
  {id:"NUM-R066",donorIds:["NUM-056"],priorApprovedIds:[],singular:"ਯੋਜਨਾ",plural:"ਯੋਜਨਾਵਾਂ",rule:"VOWEL_TO_VAAN" as CP004NumberRule,directSafe:true,sourceStatus:"REVIEW_PENDING"},
] as const;

export const CP004_AGREEMENT_CONTEXTS: readonly CP004AgreementContext[] = [
  { id:"CTX-G01", dimension:"GENDER", targetPa:"ਪੁਲਿੰਗ ਇਕਵਚਨ", correct:"ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਿਹਾ ਹੈ।", incorrect:["ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੀ ਹੈ।","ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।","ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਿਹਾ ਹੈ।","ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੀਆਂ ਹਨ।"], principlePa:"‘ਮੁੰਡਾ’ ਪੁਲਿੰਗ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ਕਿਰਿਆ ਨਾਲ ‘ਰਿਹਾ ਹੈ’ ਆਉਂਦਾ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G02", dimension:"GENDER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ", correct:"ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।", incorrect:["ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹ ਰਿਹਾ ਹੈ।","ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੇ ਹਨ।","ਕੁੜੀਆਂ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।","ਕੁੜੀ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀਆਂ ਹਨ।"], principlePa:"‘ਕੁੜੀ’ ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ਕਿਰਿਆ ਨਾਲ ‘ਰਹੀ ਹੈ’ ਆਉਂਦਾ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G03", dimension:"GENDER", targetPa:"ਪੁਲਿੰਗ ਇਕਵਚਨ", correct:"ਮੇਰਾ ਭਰਾ ਘਰ ਆਇਆ ਹੈ।", incorrect:["ਮੇਰੀ ਭਰਾ ਘਰ ਆਇਆ ਹੈ।","ਮੇਰਾ ਭਰਾ ਘਰ ਆਈ ਹੈ।","ਮੇਰੇ ਭਰਾ ਘਰ ਆਈ ਹੈ।","ਮੇਰੀ ਭਰਾ ਘਰ ਆਈ ਹੈ।"], principlePa:"‘ਭਰਾ’ ਪੁਲਿੰਗ ਇਕਵਚਨ ਹੈ; ਇਸ ਲਈ ‘ਮੇਰਾ’ ਅਤੇ ‘ਆਇਆ’ ਦੋਵੇਂ ਉਸ ਨਾਲ ਮਿਲਦੇ ਹਨ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G04", dimension:"GENDER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ", correct:"ਮੇਰੀ ਭੈਣ ਘਰ ਆਈ ਹੈ।", incorrect:["ਮੇਰਾ ਭੈਣ ਘਰ ਆਈ ਹੈ।","ਮੇਰੀ ਭੈਣ ਘਰ ਆਇਆ ਹੈ।","ਮੇਰੇ ਭੈਣ ਘਰ ਆਏ ਹਨ।","ਮੇਰਾ ਭੈਣ ਘਰ ਆਇਆ ਹੈ।"], principlePa:"‘ਭੈਣ’ ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਹੈ; ਇਸ ਲਈ ‘ਮੇਰੀ’ ਅਤੇ ‘ਆਈ’ ਦੋਵੇਂ ਉਸ ਨਾਲ ਮਿਲਦੇ ਹਨ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G05", dimension:"GENDER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ", correct:"ਘੋੜੀ ਤੇਜ਼ ਦੌੜੀ।", incorrect:["ਘੋੜੀ ਤੇਜ਼ ਦੌੜਿਆ।","ਘੋੜਾ ਤੇਜ਼ ਦੌੜੀ।","ਘੋੜੀ ਤੇਜ਼ ਦੌੜੇ।","ਘੋੜੀਆਂ ਤੇਜ਼ ਦੌੜੀ।"], principlePa:"‘ਘੋੜੀ’ ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਦੌੜੀ’ ਸਹੀ ਰੂਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-G06", dimension:"GENDER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ", correct:"ਬੱਚੀ ਹੱਸ ਰਹੀ ਹੈ।", incorrect:["ਬੱਚੀ ਹੱਸ ਰਿਹਾ ਹੈ।","ਬੱਚਾ ਹੱਸ ਰਹੀ ਹੈ।","ਬੱਚੀ ਹੱਸ ਰਹੇ ਹਨ।","ਬੱਚੀਆਂ ਹੱਸ ਰਹੀ ਹੈ।"], principlePa:"‘ਬੱਚੀ’ ਇਸਤਰੀ ਲਿੰਗ ਇਕਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਹੱਸ ਰਹੀ ਹੈ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N01", dimension:"NUMBER", targetPa:"ਪੁਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।", incorrect:["ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਿਹਾ ਹੈ।","ਮੁੰਡਾ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹਨ।","ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਹੀ ਹੈ।","ਮੁੰਡੇ ਮੈਦਾਨ ਵਿੱਚ ਖੇਡ ਰਿਹਾ ਹਨ।"], principlePa:"‘ਮੁੰਡੇ’ ਪੁਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਖੇਡ ਰਹੇ ਹਨ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N02", dimension:"NUMBER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਕੁੜੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਰਹੀਆਂ ਹਨ।", incorrect:["ਕੁੜੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਰਹੀ ਹੈ।","ਕੁੜੀ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਰਹੀਆਂ ਹਨ।","ਕੁੜੀਆਂ ਕਿਤਾਬਾਂ ਪੜ੍ਹ ਰਹੇ ਹਨ।","ਕੁੜੀਆਂ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।"], principlePa:"‘ਕੁੜੀਆਂ’ ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਪੜ੍ਹ ਰਹੀਆਂ ਹਨ’ ਸਹੀ ਰੂਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N03", dimension:"NUMBER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਕਿਤਾਬਾਂ ਮੇਜ਼ ਉੱਤੇ ਪਈਆਂ ਹਨ।", incorrect:["ਕਿਤਾਬਾਂ ਮੇਜ਼ ਉੱਤੇ ਪਈ ਹੈ।","ਕਿਤਾਬ ਮੇਜ਼ ਉੱਤੇ ਪਈਆਂ ਹਨ।","ਕਿਤਾਬਾਂ ਮੇਜ਼ ਉੱਤੇ ਪਿਆ ਹੈ।","ਕਿਤਾਬਾਂ ਮੇਜ਼ ਉੱਤੇ ਪਏ ਹਨ।"], principlePa:"‘ਕਿਤਾਬਾਂ’ ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਪਈਆਂ ਹਨ’ ਸਹੀ ਰੂਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N04", dimension:"NUMBER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਗੱਡੀਆਂ ਬਾਹਰ ਖੜ੍ਹੀਆਂ ਹਨ।", incorrect:["ਗੱਡੀਆਂ ਬਾਹਰ ਖੜ੍ਹੀ ਹੈ।","ਗੱਡੀ ਬਾਹਰ ਖੜ੍ਹੀਆਂ ਹਨ।","ਗੱਡੀਆਂ ਬਾਹਰ ਖੜ੍ਹੇ ਹਨ।","ਗੱਡੀਆਂ ਬਾਹਰ ਖੜ੍ਹਾ ਹੈ।"], principlePa:"‘ਗੱਡੀਆਂ’ ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਖੜ੍ਹੀਆਂ ਹਨ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N05", dimension:"NUMBER", targetPa:"ਪੁਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਬੱਚੇ ਕਮਰੇ ਵਿੱਚ ਬੈਠੇ ਹਨ।", incorrect:["ਬੱਚੇ ਕਮਰੇ ਵਿੱਚ ਬੈਠਾ ਹੈ।","ਬੱਚਾ ਕਮਰੇ ਵਿੱਚ ਬੈਠੇ ਹਨ।","ਬੱਚੇ ਕਮਰੇ ਵਿੱਚ ਬੈਠੀ ਹੈ।","ਬੱਚੇ ਕਮਰੇ ਵਿੱਚ ਬੈਠਾ ਹਨ।"], principlePa:"‘ਬੱਚੇ’ ਪੁਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਬੈਠੇ ਹਨ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
  { id:"CTX-N06", dimension:"NUMBER", targetPa:"ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ", correct:"ਚਿੜੀਆਂ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠੀਆਂ ਹਨ।", incorrect:["ਚਿੜੀਆਂ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠੀ ਹੈ।","ਚਿੜੀ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠੀਆਂ ਹਨ।","ਚਿੜੀਆਂ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠੇ ਹਨ।","ਚਿੜੀਆਂ ਦਰੱਖਤ ਉੱਤੇ ਬੈਠਾ ਹੈ।"], principlePa:"‘ਚਿੜੀਆਂ’ ਇਸਤਰੀ ਲਿੰਗ ਬਹੁਵਚਨ ਹੈ, ਇਸ ਲਈ ‘ਬੈਠੀਆਂ ਹਨ’ ਸਹੀ ਮਿਲਾਪ ਹੈ।", sourceStatus:"REVIEW_PENDING" },
] as const;

export const CP004_TRANSFORM_SAFE_GENDER_PAIRS = CP004_GENDER_PAIRS.filter((x)=>x.transformSafe);
export const CP004_DIRECT_NUMBER_PAIRS = CP004_NUMBER_PAIRS.filter((x)=>x.directSafe);
