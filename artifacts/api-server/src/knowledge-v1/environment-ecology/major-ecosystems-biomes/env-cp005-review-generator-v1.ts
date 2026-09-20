import type { KnowledgeV1Difficulty } from "../../types";
import type { EnvCp005ReviewQuestion } from "./env-cp005-review-types";

type Seed = {
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  correct: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceFactIds: readonly string[];
};

const SOURCE_ID = "NCERT-BIOLOGY-XII-ECOLOGY";
const POSITIONS = [0, 1, 2, 3] as const;

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-005-QL-001", qlName:"Ecosystem identification", difficulty:"Easy", stem:"Which ecosystem is dominated mainly by trees?", correct:"Forest ecosystem", distractors:["Grassland ecosystem","Desert ecosystem","Marine ecosystem"], explanation:"Forests are terrestrial ecosystems in which trees are the dominant vegetation.", sourceFactIds:["env-cp005-forest"] },
  { qlId:"ENV-005-QL-001", qlName:"Ecosystem identification", difficulty:"Easy", stem:"Which ecosystem has very low precipitation and sparse vegetation?", correct:"Desert ecosystem", distractors:["Forest ecosystem","Freshwater ecosystem","Grassland ecosystem"], explanation:"Deserts are defined mainly by very low precipitation and usually sparse vegetation.", sourceFactIds:["env-cp005-desert"] },
  { qlId:"ENV-005-QL-001", qlName:"Ecosystem identification", difficulty:"Easy", stem:"Which ecosystem includes oceans and seas?", correct:"Marine ecosystem", distractors:["Freshwater ecosystem","Grassland ecosystem","Tundra biome"], explanation:"Marine ecosystems are saltwater ecosystems that include seas and oceans.", sourceFactIds:["env-cp005-marine"] },
  { qlId:"ENV-005-QL-001", qlName:"Ecosystem identification", difficulty:"Easy", stem:"Lakes, ponds, rivers and streams belong mainly to which ecosystem?", correct:"Freshwater ecosystem", distractors:["Marine ecosystem","Desert ecosystem","Taiga biome"], explanation:"Freshwater ecosystems include lakes, ponds, rivers and streams and have low salinity.", sourceFactIds:["env-cp005-freshwater"] },

  { qlId:"ENV-005-QL-002", qlName:"Forest ecosystem", difficulty:"Easy", stem:"The dominant structural vegetation in a forest is usually:", correct:"Trees", distractors:["Grasses only","Algae only","Lichens only"], explanation:"Tree cover is the defining structural feature of forest ecosystems.", sourceFactIds:["env-cp005-forest-tree-cover"] },
  { qlId:"ENV-005-QL-002", qlName:"Forest ecosystem", difficulty:"Easy", stem:"Which feature best distinguishes a forest from a grassland?", correct:"Greater tree dominance", distractors:["Lower salinity","Presence of ocean water","Permanent frozen ground"], explanation:"Forests are dominated by trees, while grasslands are dominated mainly by grasses.", sourceFactIds:["env-cp005-forest","env-cp005-grassland"] },
  { qlId:"ENV-005-QL-002", qlName:"Forest ecosystem", difficulty:"Easy", stem:"A terrestrial area with dense tree cover is most likely a:", correct:"Forest ecosystem", distractors:["Marine ecosystem","Desert ecosystem","Freshwater ecosystem"], explanation:"Dense tree cover is a typical feature of forest ecosystems.", sourceFactIds:["env-cp005-forest"] },
  { qlId:"ENV-005-QL-002", qlName:"Forest ecosystem", difficulty:"Easy", stem:"Which statement about forests is correct?", correct:"Trees form the dominant vegetation", distractors:["They are defined by high salinity","They are always treeless","They are defined by permafrost"], explanation:"Forests are terrestrial ecosystems dominated by trees and other woody vegetation.", sourceFactIds:["env-cp005-forest"] },

  { qlId:"ENV-005-QL-003", qlName:"Grassland and desert", difficulty:"Easy", stem:"Grasslands are dominated mainly by:", correct:"Grasses", distractors:["Coniferous trees","Ocean water","Permanent ice"], explanation:"Grasslands are terrestrial ecosystems in which grasses are the dominant vegetation.", sourceFactIds:["env-cp005-grassland"] },
  { qlId:"ENV-005-QL-003", qlName:"Grassland and desert", difficulty:"Easy", stem:"The main climatic feature used to identify a desert is:", correct:"Very low precipitation", distractors:["Very high salinity","Permanent snow cover","Dense tree growth"], explanation:"Deserts are defined primarily by low precipitation, not by temperature alone.", sourceFactIds:["env-cp005-desert","env-cp005-desert-temperature"] },
  { qlId:"ENV-005-QL-003", qlName:"Grassland and desert", difficulty:"Easy", stem:"Which statement about deserts is correct?", correct:"They may be hot or cold", distractors:["They are always hot","They always have dense forests","They are always marine"], explanation:"Low precipitation defines deserts, so deserts can occur in both hot and cold regions.", sourceFactIds:["env-cp005-desert-temperature"] },
  { qlId:"ENV-005-QL-003", qlName:"Grassland and desert", difficulty:"Easy", stem:"Compared with forests, grasslands generally have:", correct:"Less tree cover", distractors:["Higher ocean salinity","More permanent ice","No plant life"], explanation:"Grasslands are dominated mainly by grasses and have less tree cover than forests.", sourceFactIds:["env-cp005-grassland-trees","env-cp005-forest-tree-cover"] },

  { qlId:"ENV-005-QL-004", qlName:"Freshwater ecosystem", difficulty:"Medium", stem:"Which is a freshwater ecosystem?", correct:"Pond", distractors:["Ocean","Open sea","Coral reef"], explanation:"Ponds have low-salinity water and are freshwater ecosystems.", sourceFactIds:["env-cp005-freshwater"] },
  { qlId:"ENV-005-QL-004", qlName:"Freshwater ecosystem", difficulty:"Medium", stem:"Freshwater ecosystems are mainly distinguished from marine ecosystems by:", correct:"Lower salinity", distractors:["Absence of water","Permanent permafrost","Dominance of conifers"], explanation:"Freshwater systems contain much less dissolved salt than marine systems.", sourceFactIds:["env-cp005-salinity"] },
  { qlId:"ENV-005-QL-004", qlName:"Freshwater ecosystem", difficulty:"Medium", stem:"Which group contains only freshwater systems?", correct:"Lake, pond, river", distractors:["Sea, ocean, estuary","Ocean, pond, sea","River, ocean, sea"], explanation:"Lakes, ponds and rivers are standard freshwater ecosystems.", sourceFactIds:["env-cp005-freshwater"] },
  { qlId:"ENV-005-QL-004", qlName:"Freshwater ecosystem", difficulty:"Medium", stem:"A river is classified mainly as a:", correct:"Freshwater ecosystem", distractors:["Marine ecosystem","Tundra biome","Desert ecosystem"], explanation:"Rivers are low-salinity inland waters and are freshwater ecosystems.", sourceFactIds:["env-cp005-freshwater"] },

  { qlId:"ENV-005-QL-005", qlName:"Marine ecosystem", difficulty:"Medium", stem:"Which ecosystem has high salinity and includes oceans?", correct:"Marine ecosystem", distractors:["Freshwater ecosystem","Grassland ecosystem","Tundra biome"], explanation:"Marine ecosystems are saltwater systems and include the world's seas and oceans.", sourceFactIds:["env-cp005-marine","env-cp005-salinity"] },
  { qlId:"ENV-005-QL-005", qlName:"Marine ecosystem", difficulty:"Medium", stem:"Which is a marine ecosystem?", correct:"Open ocean", distractors:["River","Pond","Grassland"], explanation:"The open ocean is a high-salinity marine ecosystem.", sourceFactIds:["env-cp005-marine"] },
  { qlId:"ENV-005-QL-005", qlName:"Marine ecosystem", difficulty:"Medium", stem:"Marine water generally contains:", correct:"More dissolved salts than freshwater", distractors:["No dissolved salts","Less salt than rainwater by definition","Permanent frozen soil"], explanation:"Marine ecosystems have much higher salinity than freshwater ecosystems.", sourceFactIds:["env-cp005-salinity"] },
  { qlId:"ENV-005-QL-005", qlName:"Marine ecosystem", difficulty:"Medium", stem:"Which pair is marine?", correct:"Sea and ocean", distractors:["Pond and lake","River and stream","Grassland and forest"], explanation:"Seas and oceans are major marine ecosystems.", sourceFactIds:["env-cp005-marine"] },

  { qlId:"ENV-005-QL-006", qlName:"Tundra biome", difficulty:"Medium", stem:"Which biome is strongly linked with permafrost?", correct:"Tundra", distractors:["Taiga","Grassland","Marine"], explanation:"Permafrost is a characteristic feature of many tundra regions.", sourceFactIds:["env-cp005-tundra","env-cp005-permafrost"] },
  { qlId:"ENV-005-QL-006", qlName:"Tundra biome", difficulty:"Medium", stem:"Tundra is generally:", correct:"Very cold and largely treeless", distractors:["Warm and densely forested","Saltwater and oceanic","Hot with dense rainforest"], explanation:"Tundra is very cold, largely treeless and has a short growing season.", sourceFactIds:["env-cp005-tundra"] },
  { qlId:"ENV-005-QL-006", qlName:"Tundra biome", difficulty:"Medium", stem:"A very short growing season is typical of the:", correct:"Tundra biome", distractors:["Marine ecosystem","Tropical forest","Freshwater pond"], explanation:"The severe cold of tundra produces a very short growing season.", sourceFactIds:["env-cp005-tundra"] },
  { qlId:"ENV-005-QL-006", qlName:"Tundra biome", difficulty:"Medium", stem:"Which feature is least consistent with tundra?", correct:"Dense tall tree cover", distractors:["Very cold climate","Short growing season","Permafrost"], explanation:"Tundra is largely treeless; dense tall forests are not typical of it.", sourceFactIds:["env-cp005-tundra","env-cp005-permafrost"] },

  { qlId:"ENV-005-QL-007", qlName:"Taiga biome", difficulty:"Medium", stem:"Taiga is best described as a:", correct:"Cold conifer-dominated forest biome", distractors:["Treeless polar desert","Tropical grassland","Saltwater ecosystem"], explanation:"Taiga is the boreal forest biome and is dominated largely by coniferous trees.", sourceFactIds:["env-cp005-taiga"] },
  { qlId:"ENV-005-QL-007", qlName:"Taiga biome", difficulty:"Medium", stem:"Which vegetation is most typical of taiga?", correct:"Coniferous trees", distractors:["Mangroves only","Grasses only","Cacti only"], explanation:"Coniferous forests are characteristic of the taiga biome.", sourceFactIds:["env-cp005-taiga"] },
  { qlId:"ENV-005-QL-007", qlName:"Taiga biome", difficulty:"Medium", stem:"Which biome is also called boreal forest?", correct:"Taiga", distractors:["Tundra","Desert","Grassland"], explanation:"Taiga is another name for the boreal forest biome.", sourceFactIds:["env-cp005-taiga"] },
  { qlId:"ENV-005-QL-007", qlName:"Taiga biome", difficulty:"Medium", stem:"Compared with tundra, taiga generally has:", correct:"More tree cover", distractors:["Less vegetation in all cases","Higher ocean salinity","No woody plants"], explanation:"Taiga supports coniferous forests, while tundra is largely treeless.", sourceFactIds:["env-cp005-taiga","env-cp005-tundra"] },

  { qlId:"ENV-005-QL-008", qlName:"Biome comparison", difficulty:"Medium", stem:"Which correctly compares tundra and taiga?", correct:"Tundra is largely treeless; taiga is conifer-dominated", distractors:["Both are marine ecosystems","Taiga is treeless; tundra is densely forested","Both are defined mainly by high salinity"], explanation:"Tundra is largely treeless, while taiga is a cold coniferous forest biome.", sourceFactIds:["env-cp005-tundra","env-cp005-taiga"] },
  { qlId:"ENV-005-QL-008", qlName:"Biome comparison", difficulty:"Medium", stem:"Which correctly compares freshwater and marine ecosystems?", correct:"Freshwater has lower salinity", distractors:["Marine water has lower salinity","Both have identical salinity","Freshwater is always frozen"], explanation:"Freshwater ecosystems have much lower salinity than marine ecosystems.", sourceFactIds:["env-cp005-salinity"] },
  { qlId:"ENV-005-QL-008", qlName:"Biome comparison", difficulty:"Medium", stem:"Which correctly compares grassland and forest?", correct:"Grassland is grass-dominated; forest is tree-dominated", distractors:["Both are defined by ocean salinity","Forest is always treeless","Grassland is always aquatic"], explanation:"Grasses dominate grasslands, while trees dominate forests.", sourceFactIds:["env-cp005-grassland","env-cp005-forest"] },
  { qlId:"ENV-005-QL-008", qlName:"Biome comparison", difficulty:"Medium", stem:"Which correctly describes deserts?", correct:"Low precipitation is the key feature", distractors:["They must always be hot","They must contain oceans","They require permanent permafrost"], explanation:"Deserts are identified primarily by low precipitation and may be hot or cold.", sourceFactIds:["env-cp005-desert-temperature"] },

  { qlId:"ENV-005-QL-009", qlName:"Correct pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Tundra — permafrost", distractors:["Marine — low salinity","Taiga — treeless biome","Desert — dense rainfall"], explanation:"Permafrost is strongly associated with tundra regions.", sourceFactIds:["env-cp005-permafrost"] },
  { qlId:"ENV-005-QL-009", qlName:"Correct pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Taiga — coniferous forest", distractors:["Grassland — ocean water","Freshwater — high salinity","Tundra — dense tall forest"], explanation:"Taiga is a cold boreal forest dominated largely by conifers.", sourceFactIds:["env-cp005-taiga"] },
  { qlId:"ENV-005-QL-009", qlName:"Correct pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Freshwater — low salinity", distractors:["Marine — low salinity","Desert — high rainfall","Tundra — tropical climate"], explanation:"Freshwater systems contain relatively little dissolved salt.", sourceFactIds:["env-cp005-salinity"] },
  { qlId:"ENV-005-QL-009", qlName:"Correct pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Grassland — grass-dominated vegetation", distractors:["Forest — treeless vegetation","Marine — river water","Desert — dense tree cover"], explanation:"Grasslands are dominated mainly by grasses.", sourceFactIds:["env-cp005-grassland"] },

  { qlId:"ENV-005-QL-010", qlName:"Incorrect pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Marine — low salinity", distractors:["Freshwater — low salinity","Taiga — coniferous forest","Tundra — permafrost"], explanation:"Marine ecosystems have high salinity, not low salinity.", sourceFactIds:["env-cp005-salinity"] },
  { qlId:"ENV-005-QL-010", qlName:"Incorrect pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Tundra — dense tall forest", distractors:["Desert — low precipitation","Forest — tree dominance","Grassland — grass dominance"], explanation:"Tundra is largely treeless, so dense tall forest is not a tundra feature.", sourceFactIds:["env-cp005-tundra"] },
  { qlId:"ENV-005-QL-010", qlName:"Incorrect pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Desert — always hot", distractors:["Taiga — boreal forest","Freshwater — rivers and lakes","Marine — seas and oceans"], explanation:"Deserts are defined by low precipitation and can be hot or cold.", sourceFactIds:["env-cp005-desert-temperature"] },
  { qlId:"ENV-005-QL-010", qlName:"Incorrect pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Taiga — largely treeless", distractors:["Tundra — short growing season","Grassland — grasses dominate","Forest — trees dominate"], explanation:"Taiga is forested and dominated largely by coniferous trees.", sourceFactIds:["env-cp005-taiga"] },

  { qlId:"ENV-005-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Tundra is largely treeless.\n2. Taiga is conifer-dominated.\n3. Marine ecosystems have low salinity.\nHow many are correct?", correct:"Only two", distractors:["Only one","All three","None"], explanation:"Statements 1 and 2 are correct. Marine ecosystems have high salinity.", sourceFactIds:["env-cp005-tundra","env-cp005-taiga","env-cp005-salinity"] },
  { qlId:"ENV-005-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Deserts are defined mainly by low precipitation.\n2. All deserts are hot.\n3. Grasslands are dominated mainly by grasses.\nHow many are correct?", correct:"Only two", distractors:["Only one","All three","None"], explanation:"Statements 1 and 3 are correct. Deserts may be hot or cold.", sourceFactIds:["env-cp005-desert-temperature","env-cp005-grassland"] },
  { qlId:"ENV-005-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Rivers are freshwater systems.\n2. Oceans are marine systems.\n3. Freshwater generally has lower salinity than marine water.\nHow many are correct?", correct:"All three", distractors:["Only one","Only two","None"], explanation:"All three statements correctly distinguish freshwater and marine ecosystems.", sourceFactIds:["env-cp005-freshwater","env-cp005-marine","env-cp005-salinity"] },
  { qlId:"ENV-005-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Permafrost is common in tundra.\n2. Taiga is a boreal forest.\n3. Forests are defined by grass dominance.\nHow many are correct?", correct:"Only two", distractors:["Only one","All three","None"], explanation:"Statements 1 and 2 are correct. Forests are dominated by trees, not grasses.", sourceFactIds:["env-cp005-permafrost","env-cp005-taiga","env-cp005-forest"] },

  { qlId:"ENV-005-QL-012", qlName:"Applied biome identification", difficulty:"Hard", stem:"A region is very cold, largely treeless and has permafrost. It is most likely:", correct:"Tundra", distractors:["Taiga","Grassland","Marine ecosystem"], explanation:"Very cold conditions, treeless vegetation and permafrost identify tundra.", sourceFactIds:["env-cp005-tundra","env-cp005-permafrost"] },
  { qlId:"ENV-005-QL-012", qlName:"Applied biome identification", difficulty:"Hard", stem:"A cold region is dominated by coniferous forest. It is most likely:", correct:"Taiga", distractors:["Tundra","Desert","Freshwater ecosystem"], explanation:"A cold conifer-dominated boreal forest is taiga.", sourceFactIds:["env-cp005-taiga"] },
  { qlId:"ENV-005-QL-012", qlName:"Applied biome identification", difficulty:"Hard", stem:"An inland water body has low salinity. It belongs mainly to the:", correct:"Freshwater ecosystem", distractors:["Marine ecosystem","Desert ecosystem","Tundra biome"], explanation:"Low-salinity inland waters are freshwater ecosystems.", sourceFactIds:["env-cp005-freshwater","env-cp005-salinity"] },
  { qlId:"ENV-005-QL-012", qlName:"Applied biome identification", difficulty:"Hard", stem:"A region receives very little precipitation but is cold for much of the year. It can still be a:", correct:"Desert", distractors:["Marine ecosystem","Freshwater ecosystem","Forest only"], explanation:"Deserts are defined by low precipitation, so a desert does not have to be hot.", sourceFactIds:["env-cp005-desert-temperature"] },
]);

function place(correct: string, distractors: readonly string[], index: number): string[] {
  const options = [...distractors];
  options.splice(index, 0, correct);
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("ENV-CP-005 requires four unique options");
  return options;
}

export function generateEnvCp005ReviewBatchV1(): EnvCp005ReviewQuestion[] {
  const counters = new Map<string, number>();
  return S.map((seed, i) => {
    const local = counters.get(seed.qlId) ?? 0;
    counters.set(seed.qlId, local + 1);
    const correctIndex = POSITIONS[local];
    return {
      questionId: `ENV-CP005-V1-${String(i + 1).padStart(3, "0")}`,
      chapterId: "ENV-001",
      cpId: "ENV-CP-005",
      qlId: seed.qlId,
      qlName: seed.qlName,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options: place(seed.correct, seed.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: seed.correct,
      explanation: seed.explanation,
      sourceIds: [SOURCE_ID],
      sourceFactIds: [...seed.sourceFactIds],
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
}
