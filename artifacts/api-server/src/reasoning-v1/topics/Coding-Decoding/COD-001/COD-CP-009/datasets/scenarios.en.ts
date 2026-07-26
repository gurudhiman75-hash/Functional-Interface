import type { SentenceCodeTopologyKind } from "../topology-generator";

export interface EnglishSentenceCodeScenario {
  id: string;
  topologyKind: SentenceCodeTopologyKind;
  theme: string;
  roleLexemeIds: Readonly<Record<string, string>>;
  status: "REVIEWED";
}

export const ENGLISH_SENTENCE_CODE_SCENARIOS: readonly EnglishSentenceCodeScenario[] = [
  {
    id: "DIRECT-BIRDS",
    topologyKind: "DIRECT_SINGLE_INTERSECTION",
    theme: "nature",
    roleLexemeIds: { TARGET: "birds", LEFT_ONLY: "fly", RIGHT_ONLY: "sing" },
    status: "REVIEWED",
  },
  {
    id: "DIRECT-FLOWERS",
    topologyKind: "DIRECT_SINGLE_INTERSECTION",
    theme: "nature",
    roleLexemeIds: { TARGET: "flowers", LEFT_ONLY: "bloom", RIGHT_ONLY: "fade" },
    status: "REVIEWED",
  },
  {
    id: "DIRECT-CHILDREN",
    topologyKind: "DIRECT_SINGLE_INTERSECTION",
    theme: "people",
    roleLexemeIds: { TARGET: "children", LEFT_ONLY: "learn", RIGHT_ONLY: "play" },
    status: "REVIEWED",
  },
  {
    id: "DIRECT-STARS",
    topologyKind: "DIRECT_SINGLE_INTERSECTION",
    theme: "nature",
    roleLexemeIds: { TARGET: "stars", LEFT_ONLY: "shine", RIGHT_ONLY: "twinkle" },
    status: "REVIEWED",
  },
  {
    id: "DIRECT-RIVERS",
    topologyKind: "DIRECT_SINGLE_INTERSECTION",
    theme: "nature",
    roleLexemeIds: { TARGET: "rivers", LEFT_ONLY: "flow", RIGHT_ONLY: "merge" },
    status: "REVIEWED",
  },

  {
    id: "CHAINED-CHILDREN-LEARN",
    topologyKind: "CHAINED_SINGLETON_PROPAGATION",
    theme: "education",
    roleLexemeIds: { TARGET: "children", HELPER: "learn", ROW_1_ONLY: "quickly", ROW_2_ONLY: "daily", ROW_3_ONLY: "adults" },
    status: "REVIEWED",
  },
  {
    id: "CHAINED-BIRDS-SING",
    topologyKind: "CHAINED_SINGLETON_PROPAGATION",
    theme: "nature",
    roleLexemeIds: { TARGET: "birds", HELPER: "sing", ROW_1_ONLY: "sweetly", ROW_2_ONLY: "daily", ROW_3_ONLY: "children" },
    status: "REVIEWED",
  },
  {
    id: "CHAINED-PLANTS-GROW",
    topologyKind: "CHAINED_SINGLETON_PROPAGATION",
    theme: "nature",
    roleLexemeIds: { TARGET: "plants", HELPER: "grow", ROW_1_ONLY: "quickly", ROW_2_ONLY: "well", ROW_3_ONLY: "flowers" },
    status: "REVIEWED",
  },
  {
    id: "CHAINED-WORKERS-ACT",
    topologyKind: "CHAINED_SINGLETON_PROPAGATION",
    theme: "work",
    roleLexemeIds: { TARGET: "workers", HELPER: "act", ROW_1_ONLY: "carefully", ROW_2_ONLY: "quickly", ROW_3_ONLY: "leaders" },
    status: "REVIEWED",
  },
  {
    id: "CHAINED-STUDENTS-READ",
    topologyKind: "CHAINED_SINGLETON_PROPAGATION",
    theme: "education",
    roleLexemeIds: { TARGET: "students", HELPER: "read", ROW_1_ONLY: "quietly", ROW_2_ONLY: "daily", ROW_3_ONLY: "teachers" },
    status: "REVIEWED",
  },

  {
    id: "DIFFERENCE-STUDENTS-SOLVE",
    topologyKind: "SET_DIFFERENCE_ELIMINATION",
    theme: "education",
    roleLexemeIds: { TARGET: "students", SHARED_A: "solve", SHARED_B: "problems", ROW_1_ONLY: "quickly", ROW_2_ONLY: "carefully", ROW_3_ONLY: "teachers" },
    status: "REVIEWED",
  },
  {
    id: "DIFFERENCE-BIRDS-BUILD",
    topologyKind: "SET_DIFFERENCE_ELIMINATION",
    theme: "nature",
    roleLexemeIds: { TARGET: "birds", SHARED_A: "build", SHARED_B: "nests", ROW_1_ONLY: "quickly", ROW_2_ONLY: "carefully", ROW_3_ONLY: "sparrows" },
    status: "REVIEWED",
  },
  {
    id: "DIFFERENCE-WORKERS-COMPLETE",
    topologyKind: "SET_DIFFERENCE_ELIMINATION",
    theme: "work",
    roleLexemeIds: { TARGET: "workers", SHARED_A: "complete", SHARED_B: "tasks", ROW_1_ONLY: "early", ROW_2_ONLY: "safely", ROW_3_ONLY: "teams" },
    status: "REVIEWED",
  },
  {
    id: "DIFFERENCE-CHILDREN-READ",
    topologyKind: "SET_DIFFERENCE_ELIMINATION",
    theme: "education",
    roleLexemeIds: { TARGET: "children", SHARED_A: "read", SHARED_B: "books", ROW_1_ONLY: "daily", ROW_2_ONLY: "quietly", ROW_3_ONLY: "adults" },
    status: "REVIEWED",
  },
  {
    id: "DIFFERENCE-DRIVERS-FOLLOW",
    topologyKind: "SET_DIFFERENCE_ELIMINATION",
    theme: "civic",
    roleLexemeIds: { TARGET: "drivers", SHARED_A: "follow", SHARED_B: "rules", ROW_1_ONLY: "carefully", ROW_2_ONLY: "strictly", ROW_3_ONLY: "citizens" },
    status: "REVIEWED",
  },

  {
    id: "FORK-FRUITS",
    topologyKind: "FORKED_EVIDENCE_JOIN",
    theme: "food",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "apple", MISSING_ROW_2: "mango", MISSING_ROW_3: "orange", MISSING_ROW_4: "banana" },
    status: "REVIEWED",
  },
  {
    id: "FORK-DRINKS",
    topologyKind: "FORKED_EVIDENCE_JOIN",
    theme: "drinks",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "tea", MISSING_ROW_2: "coffee", MISSING_ROW_3: "milk", MISSING_ROW_4: "juice" },
    status: "REVIEWED",
  },
  {
    id: "FORK-COLOURS",
    topologyKind: "FORKED_EVIDENCE_JOIN",
    theme: "colours",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "red", MISSING_ROW_2: "blue", MISSING_ROW_3: "green", MISSING_ROW_4: "yellow" },
    status: "REVIEWED",
  },
  {
    id: "FORK-SPORTS",
    topologyKind: "FORKED_EVIDENCE_JOIN",
    theme: "sports",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "cricket", MISSING_ROW_2: "hockey", MISSING_ROW_3: "tennis", MISSING_ROW_4: "football" },
    status: "REVIEWED",
  },
  {
    id: "FORK-TRANSPORT",
    topologyKind: "FORKED_EVIDENCE_JOIN",
    theme: "transport",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "buses", MISSING_ROW_2: "trains", MISSING_ROW_3: "cars", MISSING_ROW_4: "bicycles" },
    status: "REVIEWED",
  },

  {
    id: "GLOBAL-DRINKS",
    topologyKind: "GLOBAL_BIJECTION_DEDUCTION",
    theme: "drinks",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "tea", MISSING_ROW_2: "coffee", MISSING_ROW_3: "milk" },
    status: "REVIEWED",
  },
  {
    id: "GLOBAL-COLOURS",
    topologyKind: "GLOBAL_BIJECTION_DEDUCTION",
    theme: "colours",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "red", MISSING_ROW_2: "blue", MISSING_ROW_3: "green" },
    status: "REVIEWED",
  },
  {
    id: "GLOBAL-STATIONERY",
    topologyKind: "GLOBAL_BIJECTION_DEDUCTION",
    theme: "stationery",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "books", MISSING_ROW_2: "pens", MISSING_ROW_3: "pencils" },
    status: "REVIEWED",
  },
  {
    id: "GLOBAL-TRANSPORT",
    topologyKind: "GLOBAL_BIJECTION_DEDUCTION",
    theme: "transport",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "buses", MISSING_ROW_2: "trains", MISSING_ROW_3: "cars" },
    status: "REVIEWED",
  },
  {
    id: "GLOBAL-FRUITS",
    topologyKind: "GLOBAL_BIJECTION_DEDUCTION",
    theme: "food",
    roleLexemeIds: { TARGET: "and", MISSING_ROW_1: "apples", MISSING_ROW_2: "mangoes", MISSING_ROW_3: "oranges" },
    status: "REVIEWED",
  },

  {
    id: "PARTIAL-CHILDREN-PLAY",
    topologyKind: "CONTROLLED_PARTIAL_INFORMATION",
    theme: "people",
    roleLexemeIds: { TARGET: "children", TARGET_PARTNER: "play", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },
  {
    id: "PARTIAL-STUDENTS-STUDY",
    topologyKind: "CONTROLLED_PARTIAL_INFORMATION",
    theme: "education",
    roleLexemeIds: { TARGET: "students", TARGET_PARTNER: "study", MISSING_ROW_1: "quietly", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },
  {
    id: "PARTIAL-BIRDS-FLY",
    topologyKind: "CONTROLLED_PARTIAL_INFORMATION",
    theme: "nature",
    roleLexemeIds: { TARGET: "birds", TARGET_PARTNER: "fly", MISSING_ROW_1: "high", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },
  {
    id: "PARTIAL-TEAMS-PRACTISE",
    topologyKind: "CONTROLLED_PARTIAL_INFORMATION",
    theme: "sports",
    roleLexemeIds: { TARGET: "teams", TARGET_PARTNER: "practise", MISSING_ROW_1: "daily", MISSING_ROW_2: "outside", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },
  {
    id: "PARTIAL-WORKERS-WORK",
    topologyKind: "CONTROLLED_PARTIAL_INFORMATION",
    theme: "work",
    roleLexemeIds: { TARGET: "workers", TARGET_PARTNER: "work", MISSING_ROW_1: "safely", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },

  {
    id: "PHRASE-DOGS-RUN",
    topologyKind: "PHRASE_SET_COMPOSITION",
    theme: "nature",
    roleLexemeIds: { PHRASE_A: "dogs", PHRASE_B: "run", MISSING_ROW_1: "fast", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },
  {
    id: "PHRASE-PLAYERS-TRAIN",
    topologyKind: "PHRASE_SET_COMPOSITION",
    theme: "sports",
    roleLexemeIds: { PHRASE_A: "players", PHRASE_B: "train", MISSING_ROW_1: "hard", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },
  {
    id: "PHRASE-FRIENDS-MEET",
    topologyKind: "PHRASE_SET_COMPOSITION",
    theme: "people",
    roleLexemeIds: { PHRASE_A: "friends", PHRASE_B: "meet", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },
  {
    id: "PHRASE-ARTISTS-WORK",
    topologyKind: "PHRASE_SET_COMPOSITION",
    theme: "work",
    roleLexemeIds: { PHRASE_A: "artists", PHRASE_B: "work", MISSING_ROW_1: "quietly", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },
  {
    id: "PHRASE-CHILDREN-READ",
    topologyKind: "PHRASE_SET_COMPOSITION",
    theme: "education",
    roleLexemeIds: { PHRASE_A: "children", PHRASE_B: "read", MISSING_ROW_1: "quietly", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" },
    status: "REVIEWED",
  },

  {
    id: "MISSING-PLAYERS-TRAIN",
    topologyKind: "MISSING_MEMBER_COMPLETION",
    theme: "sports",
    roleLexemeIds: { TARGET: "players", HELPER: "train", ROW_1_ONLY: "hard", ROW_2_ONLY: "daily", ROW_3_ONLY: "athletes" },
    status: "REVIEWED",
  },
  {
    id: "MISSING-PLANES-FLY",
    topologyKind: "MISSING_MEMBER_COMPLETION",
    theme: "transport",
    roleLexemeIds: { TARGET: "planes", HELPER: "fly", ROW_1_ONLY: "high", ROW_2_ONLY: "daily", ROW_3_ONLY: "birds" },
    status: "REVIEWED",
  },
  {
    id: "MISSING-ARTISTS-WORK",
    topologyKind: "MISSING_MEMBER_COMPLETION",
    theme: "work",
    roleLexemeIds: { TARGET: "artists", HELPER: "work", ROW_1_ONLY: "quietly", ROW_2_ONLY: "daily", ROW_3_ONLY: "workers" },
    status: "REVIEWED",
  },
  {
    id: "MISSING-TEAMS-PRACTISE",
    topologyKind: "MISSING_MEMBER_COMPLETION",
    theme: "sports",
    roleLexemeIds: { TARGET: "teams", HELPER: "practise", ROW_1_ONLY: "outside", ROW_2_ONLY: "daily", ROW_3_ONLY: "players" },
    status: "REVIEWED",
  },
  {
    id: "MISSING-FLOWERS-BLOOM",
    topologyKind: "MISSING_MEMBER_COMPLETION",
    theme: "nature",
    roleLexemeIds: { TARGET: "flowers", HELPER: "bloom", ROW_1_ONLY: "quickly", ROW_2_ONLY: "daily", ROW_3_ONLY: "plants" },
    status: "REVIEWED",
  },
] as const;

export function EnglishScenariosForTopology(kind: SentenceCodeTopologyKind): readonly EnglishSentenceCodeScenario[] {
  return ENGLISH_SENTENCE_CODE_SCENARIOS.filter((scenario) => scenario.topologyKind === kind);
}

export function getEnglishSentenceCodeScenario(id: string): EnglishSentenceCodeScenario {
  const found = ENGLISH_SENTENCE_CODE_SCENARIOS.find((scenario) => scenario.id === id);
  if (!found) throw new Error(`Unknown English sentence-code scenario '${id}'`);
  return found;
}
