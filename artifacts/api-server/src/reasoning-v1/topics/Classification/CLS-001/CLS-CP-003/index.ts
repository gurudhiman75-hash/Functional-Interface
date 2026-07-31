export {
  CLS_CP003_ENGLISH_CONTRACTS,
  CLS_CP003_ENGLISH_QL_IDS,
  getClsCp003EnglishContract,
} from "./cp003-english-contracts";
export type {
  ClsCp003EnglishContract,
  ClsCp003EnglishQlId,
  ClsCp003EnglishSolveContractId,
} from "./cp003-english-contracts";
export { generateClsCp003EnglishQuestion } from "./cp003-english-runtime";
export type { GeneratedClsCp003EnglishQuestion } from "./cp003-english-runtime";
export { generateClsCp003DiscoveryQuestion } from "./discovery-runtime";
export {
  analyzeClsCp003Word,
  auditClsCp003DisplayedJumbles,
  auditClsCp003DisplayedWords,
  generateClsCp003Prototype,
  getClsCp003DatasetSummary,
  getClsCp003PrototypeDefinitions,
  independentlyVerifyClsCp003Question,
} from "./runtime";
export {
  CLS_CP003_JUMBLE_WORDS,
  CLS_CP003_PROTOTYPES,
  CLS_CP003_WORDS,
} from "./word-dataset.en";
export type {
  ClsCp003AmbiguityAudit,
  ClsCp003AuditResult,
  ClsCp003BoundaryClass,
  ClsCp003Difficulty,
  ClsCp003DifficultyFeatures,
  ClsCp003Explanation,
  ClsCp003GenerationProfile,
  ClsCp003JumbleEntry,
  ClsCp003PrototypeDefinition,
  ClsCp003PrototypeId,
  ClsCp003RepeatedTopology,
  ClsCp003RuleId,
  ClsCp003RuleSupport,
  ClsCp003Task,
  ClsCp003WordEntry,
  ClsCp003WordFeatures,
  GeneratedClsCp003Question,
} from "./types";
