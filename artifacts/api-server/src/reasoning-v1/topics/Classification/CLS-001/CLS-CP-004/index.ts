export {
  CLS_CP004_ENGLISH_CONTRACT,
  CLS_CP004_ENGLISH_QL_ID,
  CLS_CP004_ENGLISH_SOLVE_CONTRACT_ID,
} from "./cp004-english-contract";
export type {
  ClsCp004EnglishQlId,
  ClsCp004EnglishSolveContractId,
} from "./cp004-english-contract";
export { generateClsCp004EnglishQuestion } from "./cp004-english-runtime";
export type { GeneratedClsCp004EnglishQuestion } from "./cp004-english-runtime";
export { generateClsCp004DiscoveryQuestion } from "./discovery-runtime";
export {
  analyzeClsCp004Number,
  auditClsCp004DisplayedNumbers,
  generateClsCp004Prototype,
  getClsCp004DomainSummary,
  getClsCp004PrototypeDefinitions,
  independentlyVerifyClsCp004Question,
} from "./runtime";
export {
  CLS_CP004_DIVISIBILITY_RULE_IDS,
  CLS_CP004_DOMAIN_MAXIMUM,
  CLS_CP004_DOMAIN_MINIMUM,
  CLS_CP004_NUMBER_DOMAIN,
  CLS_CP004_PROTOTYPES,
  CLS_CP004_RULE_IDS,
  clsCp004DivisorForRule,
  clsCp004RuleValue,
} from "./number-domain";
export type {
  ClsCp004AmbiguityAudit,
  ClsCp004AuditResult,
  ClsCp004Difficulty,
  ClsCp004DifficultyFeatures,
  ClsCp004DigitParityComposition,
  ClsCp004Explanation,
  ClsCp004GenerationProfile,
  ClsCp004NearPowerClass,
  ClsCp004NumberFeatures,
  ClsCp004Parity,
  ClsCp004PrimalityClass,
  ClsCp004PrototypeDefinition,
  ClsCp004PrototypeId,
  ClsCp004RuleId,
  ClsCp004RuleSupport,
  GeneratedClsCp004Question,
} from "./types";
