import type { SentenceCodeTopologyKind } from "../topology-generator";

export interface EnglishSentenceCodeScenario {
  id: string;
  topologyKind: SentenceCodeTopologyKind;
  theme: string;
  roleLexemeIds: Readonly<Record<string, string>>;
  status: "REVIEWED";
}

function scenario(
  id: string,
  topologyKind: SentenceCodeTopologyKind,
  theme: string,
  roleLexemeIds: Readonly<Record<string, string>>,
): EnglishSentenceCodeScenario {
  return { id, topologyKind, theme, roleLexemeIds, status: "REVIEWED" };
}

export const ENGLISH_SENTENCE_CODE_SCENARIOS: readonly EnglishSentenceCodeScenario[] = [
  scenario("DIRECT-BIRDS", "DIRECT_SINGLE_INTERSECTION", "nature", { TARGET: "birds", LEFT_ONLY: "fly", RIGHT_ONLY: "sing" }),
  scenario("DIRECT-FLOWERS", "DIRECT_SINGLE_INTERSECTION", "nature", { TARGET: "flowers", LEFT_ONLY: "bloom", RIGHT_ONLY: "fade" }),
  scenario("DIRECT-CHILDREN", "DIRECT_SINGLE_INTERSECTION", "people", { TARGET: "children", LEFT_ONLY: "learn", RIGHT_ONLY: "play" }),
  scenario("DIRECT-STARS", "DIRECT_SINGLE_INTERSECTION", "nature", { TARGET: "stars", LEFT_ONLY: "shine", RIGHT_ONLY: "twinkle" }),
  scenario("DIRECT-RIVERS", "DIRECT_SINGLE_INTERSECTION", "nature", { TARGET: "rivers", LEFT_ONLY: "flow", RIGHT_ONLY: "merge" }),

  scenario("CHAINED-CHILDREN-LEARN", "CHAINED_SINGLETON_PROPAGATION", "education", { TARGET: "children", HELPER: "learn", ROW_1_ONLY: "quickly", ROW_2_ONLY: "daily", ROW_3_ONLY: "adults" }),
  scenario("CHAINED-BIRDS-SING", "CHAINED_SINGLETON_PROPAGATION", "nature", { TARGET: "birds", HELPER: "sing", ROW_1_ONLY: "sweetly", ROW_2_ONLY: "daily", ROW_3_ONLY: "children" }),
  scenario("CHAINED-PLANTS-GROW", "CHAINED_SINGLETON_PROPAGATION", "nature", { TARGET: "plants", HELPER: "grow", ROW_1_ONLY: "quickly", ROW_2_ONLY: "well", ROW_3_ONLY: "flowers" }),
  scenario("CHAINED-WORKERS-ACT", "CHAINED_SINGLETON_PROPAGATION", "work", { TARGET: "workers", HELPER: "act", ROW_1_ONLY: "carefully", ROW_2_ONLY: "quickly", ROW_3_ONLY: "leaders" }),
  scenario("CHAINED-STUDENTS-READ", "CHAINED_SINGLETON_PROPAGATION", "education", { TARGET: "students", HELPER: "read", ROW_1_ONLY: "quietly", ROW_2_ONLY: "daily", ROW_3_ONLY: "teachers" }),

  scenario("DIFFERENCE-STUDENTS-SOLVE", "SET_DIFFERENCE_ELIMINATION", "education", { TARGET: "students", SHARED_A: "solve", SHARED_B: "problems", ROW_1_ONLY: "quickly", ROW_2_ONLY: "carefully", ROW_3_ONLY: "teachers" }),
  scenario("DIFFERENCE-BIRDS-BUILD", "SET_DIFFERENCE_ELIMINATION", "nature", { TARGET: "birds", SHARED_A: "build", SHARED_B: "nests", ROW_1_ONLY: "quickly", ROW_2_ONLY: "carefully", ROW_3_ONLY: "sparrows" }),
  scenario("DIFFERENCE-WORKERS-COMPLETE", "SET_DIFFERENCE_ELIMINATION", "work", { TARGET: "workers", SHARED_A: "complete", SHARED_B: "tasks", ROW_1_ONLY: "early", ROW_2_ONLY: "safely", ROW_3_ONLY: "teams" }),
  scenario("DIFFERENCE-CHILDREN-READ", "SET_DIFFERENCE_ELIMINATION", "education", { TARGET: "children", SHARED_A: "read", SHARED_B: "books", ROW_1_ONLY: "daily", ROW_2_ONLY: "quietly", ROW_3_ONLY: "adults" }),
  scenario("DIFFERENCE-DRIVERS-FOLLOW", "SET_DIFFERENCE_ELIMINATION", "civic", { TARGET: "drivers", SHARED_A: "follow", SHARED_B: "rules", ROW_1_ONLY: "carefully", ROW_2_ONLY: "strictly", ROW_3_ONLY: "citizens" }),

  scenario("FORK-STUDENTS-SOLVE", "FORKED_EVIDENCE_JOIN", "education", { TARGET: "students", SHARED_A: "solve", SHARED_B: "problems", ROW_1_ONLY: "quickly", ROW_2_ONLY: "teachers", ROW_3_ONLY: "carefully", ROW_4_ONLY: "difficult" }),
  scenario("FORK-BIRDS-BUILD", "FORKED_EVIDENCE_JOIN", "nature", { TARGET: "birds", SHARED_A: "build", SHARED_B: "nests", ROW_1_ONLY: "quickly", ROW_2_ONLY: "sparrows", ROW_3_ONLY: "carefully", ROW_4_ONLY: "strong" }),
  scenario("FORK-WORKERS-COMPLETE", "FORKED_EVIDENCE_JOIN", "work", { TARGET: "workers", SHARED_A: "complete", SHARED_B: "tasks", ROW_1_ONLY: "early", ROW_2_ONLY: "teams", ROW_3_ONLY: "safely", ROW_4_ONLY: "urgent" }),
  scenario("FORK-CHILDREN-READ", "FORKED_EVIDENCE_JOIN", "education", { TARGET: "children", SHARED_A: "read", SHARED_B: "books", ROW_1_ONLY: "daily", ROW_2_ONLY: "adults", ROW_3_ONLY: "quietly", ROW_4_ONLY: "useful" }),
  scenario("FORK-DRIVERS-FOLLOW", "FORKED_EVIDENCE_JOIN", "civic", { TARGET: "drivers", SHARED_A: "follow", SHARED_B: "rules", ROW_1_ONLY: "carefully", ROW_2_ONLY: "citizens", ROW_3_ONLY: "strictly", ROW_4_ONLY: "important" }),

  scenario("GLOBAL-DRINKS", "GLOBAL_BIJECTION_DEDUCTION", "drinks", { TARGET: "and", MISSING_ROW_1: "tea", MISSING_ROW_2: "coffee", MISSING_ROW_3: "milk" }),
  scenario("GLOBAL-COLOURS", "GLOBAL_BIJECTION_DEDUCTION", "colours", { TARGET: "and", MISSING_ROW_1: "red", MISSING_ROW_2: "blue", MISSING_ROW_3: "green" }),
  scenario("GLOBAL-STATIONERY", "GLOBAL_BIJECTION_DEDUCTION", "stationery", { TARGET: "and", MISSING_ROW_1: "books", MISSING_ROW_2: "pens", MISSING_ROW_3: "pencils" }),
  scenario("GLOBAL-TRANSPORT", "GLOBAL_BIJECTION_DEDUCTION", "transport", { TARGET: "and", MISSING_ROW_1: "buses", MISSING_ROW_2: "trains", MISSING_ROW_3: "cars" }),
  scenario("GLOBAL-FRUITS", "GLOBAL_BIJECTION_DEDUCTION", "food", { TARGET: "and", MISSING_ROW_1: "apples", MISSING_ROW_2: "mangoes", MISSING_ROW_3: "oranges" }),

  scenario("PARTIAL-CHILDREN-PLAY", "CONTROLLED_PARTIAL_INFORMATION", "people", { TARGET: "children", TARGET_PARTNER: "play", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PARTIAL-STUDENTS-STUDY", "CONTROLLED_PARTIAL_INFORMATION", "education", { TARGET: "students", TARGET_PARTNER: "study", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PARTIAL-BIRDS-FLY", "CONTROLLED_PARTIAL_INFORMATION", "nature", { TARGET: "birds", TARGET_PARTNER: "fly", MISSING_ROW_1: "high", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PARTIAL-TEAMS-PRACTISE", "CONTROLLED_PARTIAL_INFORMATION", "sports", { TARGET: "teams", TARGET_PARTNER: "practise", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PARTIAL-WORKERS-WORK", "CONTROLLED_PARTIAL_INFORMATION", "work", { TARGET: "workers", TARGET_PARTNER: "work", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),

  scenario("PARTIAL3-CHILDREN-PLAY-GAMES", "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION", "people", { TARGET: "children", TARGET_PARTNER_A: "play", TARGET_PARTNER_B: "games", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PARTIAL3-BIRDS-BUILD-NESTS", "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION", "nature", { TARGET: "birds", TARGET_PARTNER_A: "build", TARGET_PARTNER_B: "nests", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PARTIAL3-WORKERS-COMPLETE-TASKS", "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION", "work", { TARGET: "workers", TARGET_PARTNER_A: "complete", TARGET_PARTNER_B: "tasks", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PARTIAL3-TEAMS-PRACTISE-SKILLS", "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION", "sports", { TARGET: "teams", TARGET_PARTNER_A: "practise", TARGET_PARTNER_B: "skills", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PARTIAL3-FRIENDS-READ-BOOKS", "CONTROLLED_THREE_WAY_PARTIAL_INFORMATION", "people", { TARGET: "friends", TARGET_PARTNER_A: "read", TARGET_PARTNER_B: "books", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),

  scenario("PHRASE-DOGS-RUN", "PHRASE_SET_COMPOSITION", "nature", { PHRASE_A: "dogs", PHRASE_B: "run", MISSING_ROW_1: "fast", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PHRASE-PLAYERS-TRAIN", "PHRASE_SET_COMPOSITION", "sports", { PHRASE_A: "players", PHRASE_B: "train", MISSING_ROW_1: "hard", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PHRASE-FRIENDS-MEET", "PHRASE_SET_COMPOSITION", "people", { PHRASE_A: "friends", PHRASE_B: "meet", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PHRASE-ARTISTS-WORK", "PHRASE_SET_COMPOSITION", "work", { PHRASE_A: "artists", PHRASE_B: "work", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),
  scenario("PHRASE-CHILDREN-READ", "PHRASE_SET_COMPOSITION", "education", { PHRASE_A: "children", PHRASE_B: "read", MISSING_ROW_1: "outside", MISSING_ROW_2: "daily", MISSING_ROW_3: "together" }),

  scenario("MISSING-PLAYERS-TRAIN", "MISSING_MEMBER_COMPLETION", "sports", { TARGET: "players", HELPER: "train", ROW_1_ONLY: "hard", ROW_2_ONLY: "daily", ROW_3_ONLY: "athletes" }),
  scenario("MISSING-PLANES-FLY", "MISSING_MEMBER_COMPLETION", "transport", { TARGET: "planes", HELPER: "fly", ROW_1_ONLY: "high", ROW_2_ONLY: "daily", ROW_3_ONLY: "birds" }),
  scenario("MISSING-ARTISTS-WORK", "MISSING_MEMBER_COMPLETION", "work", { TARGET: "artists", HELPER: "work", ROW_1_ONLY: "quietly", ROW_2_ONLY: "daily", ROW_3_ONLY: "workers" }),
  scenario("MISSING-TEAMS-PRACTISE", "MISSING_MEMBER_COMPLETION", "sports", { TARGET: "teams", HELPER: "practise", ROW_1_ONLY: "outside", ROW_2_ONLY: "daily", ROW_3_ONLY: "players" }),
  scenario("MISSING-FLOWERS-BLOOM", "MISSING_MEMBER_COMPLETION", "nature", { TARGET: "flowers", HELPER: "bloom", ROW_1_ONLY: "quickly", ROW_2_ONLY: "daily", ROW_3_ONLY: "plants" }),
] as const;

export function EnglishScenariosForTopology(kind: SentenceCodeTopologyKind): readonly EnglishSentenceCodeScenario[] {
  return ENGLISH_SENTENCE_CODE_SCENARIOS.filter((entry) => entry.topologyKind === kind);
}

export function getEnglishSentenceCodeScenario(id: string): EnglishSentenceCodeScenario {
  const found = ENGLISH_SENTENCE_CODE_SCENARIOS.find((entry) => entry.id === id);
  if (!found) throw new Error(`Unknown English sentence-code scenario '${id}'`);
  return found;
}
