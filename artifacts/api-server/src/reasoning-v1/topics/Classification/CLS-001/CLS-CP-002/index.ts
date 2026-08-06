export {
  CLS_CP002_PERMANENT_CONTRACT,
  CLS_CP002_QL_ID,
  CLS_CP002_SOLVE_CONTRACT_ID,
} from "./cp002-permanent-contract";
export type {
  ClsCp002QlId,
  ClsCp002SolveContractId,
} from "./cp002-permanent-contract";
export { generateClsCp002EnglishQuestion } from "./cp002-permanent-runtime";
export type {
  ClsCp002FrozenLifecycle,
  GeneratedClsCp002EnglishQuestion,
} from "./cp002-permanent-runtime";
export { generateClsCp002Question } from "./cp002-multilingual-runtime";
export type { GeneratedClsCp002PermanentQuestion } from "./cp002-multilingual-runtime";
export type {
  ClsCp002Locale,
  ClsCp002TranslatedLocale,
} from "./localization/cp002-language-pack";
export {
  auditClsCp002DisplayedPairs,
  generateClsCp002Prototype,
  getClsCp002PrototypeDefinitions,
  getClsCp002RelationRegistry,
  independentlyVerifyClsCp002Question,
} from "./runtime";
export {
  CLS_CP002_CLASS_RELATION_IDS,
  CLS_CP002_FACTS,
  CLS_CP002_LEXICAL_RELATION_IDS,
  CLS_CP002_PROTOTYPES,
  CLS_CP002_RELATIONS,
  CLS_CP002_SEMANTIC_RELATION_IDS,
} from "./relation-registry";
export type {
  ClsCp002AmbiguityAudit,
  ClsCp002AmbiguityResult,
  ClsCp002Difficulty,
  ClsCp002DifficultyFeatures,
  ClsCp002Explanation,
  ClsCp002GenerationProfile,
  ClsCp002Pair,
  ClsCp002PrototypeDefinition,
  ClsCp002PrototypeId,
  ClsCp002RelationDefinition,
  ClsCp002RelationFact,
  ClsCp002RelationFamily,
  ClsCp002RelationSupport,
  GeneratedClsCp002Question,
} from "./types";