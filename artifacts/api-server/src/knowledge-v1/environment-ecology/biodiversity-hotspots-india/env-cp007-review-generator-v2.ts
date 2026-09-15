import type { KnowledgeV1Difficulty } from "../../types";
import type { EnvCp007ReviewQuestion } from "./env-cp007-review-types";

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

const SOURCE_IDS = ["CONSERVATION-INTERNATIONAL-BIODIVERSITY-HOTSPOTS", "MOEFCC-INDIA-BIODIVERSITY-HOTSPOTS"] as const;
const POSITIONS = [0, 1, 2, 3] as const;

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-007-QL-001", qlName:"Hotspot concept", difficulty:"Easy", stem:"Which of the following best describes a biodiversity hotspot?", correct:"A region with high endemism and severe habitat loss", distractors:["A region with only high rainfall","A region with only a large animal population","A region with no human activity"], explanation:"A hotspot has high endemism and heavy habitat loss.", sourceFactIds:["env-cp007-hotspot-concept"] },
  { qlId:"ENV-007-QL-001", qlName:"Hotspot concept", difficulty:"Easy", stem:"Biodiversity hotspots are identified mainly on the basis of:", correct:"Endemism and habitat loss", distractors:["Rainfall and altitude","Population and migration","Soil type and salinity"], explanation:"Hotspot status depends on endemism and habitat loss.", sourceFactIds:["env-cp007-hotspot-concept","env-cp007-both-criteria"] },
  { qlId:"ENV-007-QL-001", qlName:"Hotspot concept", difficulty:"Easy", stem:"Why are biodiversity hotspots important for conservation?", correct:"They contain unique species and are highly threatened", distractors:["They contain only desert species","They have no endemic species","They are all national parks"], explanation:"Hotspots contain unique species in highly threatened habitats.", sourceFactIds:["env-cp007-hotspot-concept"] },
  { qlId:"ENV-007-QL-001", qlName:"Hotspot concept", difficulty:"Easy", stem:"Which condition alone is NOT sufficient for a region to qualify as a biodiversity hotspot?", correct:"High species diversity", distractors:["High endemism with severe habitat loss","Meeting both hotspot criteria","Required endemic plants with required vegetation loss"], explanation:"High diversity alone is not enough. Both hotspot criteria must be met.", sourceFactIds:["env-cp007-both-criteria"] },

  { qlId:"ENV-007-QL-002", qlName:"Endemic-plant criterion", difficulty:"Easy", stem:"For hotspot status, the minimum number of endemic vascular plant species required is:", correct:"1,500", distractors:["500","1,000","2,500"], explanation:"The minimum is 1,500 endemic vascular plant species.", sourceFactIds:["env-cp007-endemic-threshold"] },
  { qlId:"ENV-007-QL-002", qlName:"Endemic-plant criterion", difficulty:"Easy", stem:"In the hotspot criteria, the figure 1,500 refers to:", correct:"Endemic vascular plant species", distractors:["Endemic mammals","Migratory bird species","Marine fish species"], explanation:"The 1,500 threshold applies to endemic vascular plants.", sourceFactIds:["env-cp007-endemic-threshold"] },
  { qlId:"ENV-007-QL-002", qlName:"Endemic-plant criterion", difficulty:"Easy", stem:"A region has 1,490 endemic vascular plant species. Which statement is correct?", correct:"It does not meet the plant criterion", distractors:["It meets the plant criterion","It automatically becomes a hotspot","It needs no habitat-loss test"], explanation:"The plant threshold is at least 1,500 species.", sourceFactIds:["env-cp007-endemic-threshold"] },
  { qlId:"ENV-007-QL-002", qlName:"Endemic-plant criterion", difficulty:"Easy", stem:"A region has 1,600 endemic vascular plant species but has lost only 40% of its original vegetation. It:", correct:"Meets only the plant criterion", distractors:["Meets both hotspot criteria","Fails the plant criterion","Automatically qualifies as a hotspot"], explanation:"It meets the plant threshold, but not the 70% habitat-loss threshold.", sourceFactIds:["env-cp007-endemic-threshold","env-cp007-loss-threshold","env-cp007-both-criteria"] },

  { qlId:"ENV-007-QL-003", qlName:"Habitat-loss criterion", difficulty:"Easy", stem:"A biodiversity hotspot must have lost at least what percentage of its original natural vegetation?", correct:"70%", distractors:["30%","50%","60%"], explanation:"At least 70% of the original vegetation must be lost.", sourceFactIds:["env-cp007-loss-threshold"] },
  { qlId:"ENV-007-QL-003", qlName:"Habitat-loss criterion", difficulty:"Easy", stem:"Under the hotspot criterion, a region can retain at most what percentage of its original vegetation?", correct:"30%", distractors:["40%","50%","70%"], explanation:"If at least 70% is lost, 30% or less remains.", sourceFactIds:["env-cp007-remaining-threshold"] },
  { qlId:"ENV-007-QL-003", qlName:"Habitat-loss criterion", difficulty:"Easy", stem:"A region has lost 65% of its original natural vegetation. It:", correct:"Does not meet the habitat-loss criterion", distractors:["Meets the habitat-loss criterion","Automatically becomes a hotspot","Needs no endemic-plant test"], explanation:"The required vegetation loss is at least 70%.", sourceFactIds:["env-cp007-loss-threshold"] },
  { qlId:"ENV-007-QL-003", qlName:"Habitat-loss criterion", difficulty:"Easy", stem:"A region has lost 75% of its original natural vegetation. Which statement is correct?", correct:"It meets the habitat-loss criterion", distractors:["It fails the habitat-loss criterion","It automatically qualifies as a hotspot","It must retain at least 75% vegetation"], explanation:"A 75% loss is above the required 70% threshold.", sourceFactIds:["env-cp007-loss-threshold"] },

  { qlId:"ENV-007-QL-004", qlName:"India hotspot identification", difficulty:"Medium", stem:"Which of the following correctly lists the biodiversity hotspots represented in India?", correct:"Himalaya, Indo-Burma, Western Ghats-Sri Lanka and Sundaland", distractors:["Himalaya, Thar, Deccan and Sundaland","Indo-Burma, Aravalli, Deccan and Himalaya","Western Ghats, Thar, Gangetic Plain and Sundaland"], explanation:"India is represented in these four global hotspots.", sourceFactIds:["env-cp007-india-four"] },
  { qlId:"ENV-007-QL-004", qlName:"India hotspot identification", difficulty:"Medium", stem:"Which of the following is NOT a biodiversity hotspot represented in India?", correct:"Thar Desert", distractors:["Himalaya","Indo-Burma","Sundaland"], explanation:"Thar Desert is not among India’s four represented global hotspots.", sourceFactIds:["env-cp007-india-four"] },
  { qlId:"ENV-007-QL-004", qlName:"India hotspot identification", difficulty:"Medium", stem:"The Western Ghats of India form part of which global biodiversity hotspot?", correct:"Western Ghats-Sri Lanka", distractors:["Himalaya","Indo-Burma","Sundaland"], explanation:"The Western Ghats form the Indian part of the Western Ghats-Sri Lanka hotspot.", sourceFactIds:["env-cp007-western-ghats"] },
  { qlId:"ENV-007-QL-004", qlName:"India hotspot identification", difficulty:"Medium", stem:"The Nicobar Islands are included in which global biodiversity hotspot?", correct:"Sundaland", distractors:["Himalaya","Indo-Burma","Western Ghats-Sri Lanka"], explanation:"The Nicobar Islands are India’s part of the Sundaland hotspot.", sourceFactIds:["env-cp007-sundaland"] },

  { qlId:"ENV-007-QL-005", qlName:"Himalaya hotspot", difficulty:"Medium", stem:"The Indian Himalayan region is part of which biodiversity hotspot?", correct:"Himalaya", distractors:["Indo-Burma","Sundaland","Western Ghats-Sri Lanka"], explanation:"The Indian Himalayan region lies in the Himalaya hotspot.", sourceFactIds:["env-cp007-himalaya"] },
  { qlId:"ENV-007-QL-005", qlName:"Himalaya hotspot", difficulty:"Medium", stem:"Which Indian region is correctly linked with the Himalaya biodiversity hotspot?", correct:"Indian Himalayan region", distractors:["Nicobar Islands","Western Ghats","Thar Desert"], explanation:"The Indian Himalayan region is part of the Himalaya hotspot.", sourceFactIds:["env-cp007-himalaya"] },
  { qlId:"ENV-007-QL-005", qlName:"Himalaya hotspot", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Indian Himalaya — Himalaya hotspot", distractors:["Indian Himalaya — Sundaland","Indian Himalaya — Western Ghats-Sri Lanka","Indian Himalaya — Deccan hotspot"], explanation:"The Indian Himalaya belongs to the Himalaya hotspot.", sourceFactIds:["env-cp007-himalaya"] },
  { qlId:"ENV-007-QL-005", qlName:"Himalaya hotspot", difficulty:"Medium", stem:"Which hotspot is represented by the Himalayan region of India?", correct:"Himalaya", distractors:["Sundaland","Indo-Burma only","Western Ghats-Sri Lanka"], explanation:"The Himalayan region of India represents the Himalaya hotspot.", sourceFactIds:["env-cp007-himalaya"] },

  { qlId:"ENV-007-QL-006", qlName:"Indo-Burma hotspot in India", difficulty:"Medium", stem:"Parts of north-eastern India fall within which biodiversity hotspot?", correct:"Indo-Burma", distractors:["Sundaland","Himalaya only","Western Ghats-Sri Lanka"], explanation:"Parts of north-eastern India lie in the Indo-Burma hotspot.", sourceFactIds:["env-cp007-indo-burma"] },
  { qlId:"ENV-007-QL-006", qlName:"Indo-Burma hotspot in India", difficulty:"Medium", stem:"Parts of Assam and Meghalaya are included in which biodiversity hotspot?", correct:"Indo-Burma", distractors:["Sundaland","Western Ghats-Sri Lanka","Mediterranean Basin"], explanation:"Parts of Assam and Meghalaya lie in the Indo-Burma hotspot.", sourceFactIds:["env-cp007-indo-burma"] },
  { qlId:"ENV-007-QL-006", qlName:"Indo-Burma hotspot in India", difficulty:"Medium", stem:"The Indo-Burma hotspot is represented in India mainly by:", correct:"Parts of north-eastern India", distractors:["Western Ghats only","Nicobar Islands only","Thar Desert"], explanation:"Its Indian part lies mainly in the north-east.", sourceFactIds:["env-cp007-indo-burma"] },
  { qlId:"ENV-007-QL-006", qlName:"Indo-Burma hotspot in India", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Indo-Burma — parts of north-eastern India", distractors:["Indo-Burma — Western Ghats only","Indo-Burma — Nicobar Islands only","Indo-Burma — Thar Desert"], explanation:"Parts of north-eastern India are within the Indo-Burma hotspot.", sourceFactIds:["env-cp007-indo-burma"] },

  { qlId:"ENV-007-QL-007", qlName:"Western Ghats-Sri Lanka", difficulty:"Medium", stem:"Which biodiversity hotspot includes the Western Ghats of India?", correct:"Western Ghats-Sri Lanka", distractors:["Himalaya","Indo-Burma","Sundaland"], explanation:"The Western Ghats are part of the Western Ghats-Sri Lanka hotspot.", sourceFactIds:["env-cp007-western-ghats"] },
  { qlId:"ENV-007-QL-007", qlName:"Western Ghats-Sri Lanka", difficulty:"Medium", stem:"Which Indian region forms part of the Western Ghats-Sri Lanka hotspot?", correct:"Western Ghats", distractors:["Nicobar Islands","Thar Desert","Gangetic Plain"], explanation:"The Western Ghats form the Indian part of this hotspot.", sourceFactIds:["env-cp007-western-ghats"] },
  { qlId:"ENV-007-QL-007", qlName:"Western Ghats-Sri Lanka", difficulty:"Medium", stem:"Which hotspot name includes both an Indian mountain chain and Sri Lanka?", correct:"Western Ghats-Sri Lanka", distractors:["Himalaya","Sundaland","Indo-Burma"], explanation:"The hotspot is named Western Ghats-Sri Lanka.", sourceFactIds:["env-cp007-western-ghats"] },
  { qlId:"ENV-007-QL-007", qlName:"Western Ghats-Sri Lanka", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Western Ghats — Western Ghats-Sri Lanka", distractors:["Western Ghats — Sundaland","Western Ghats — Himalaya","Western Ghats — Indo-Burma"], explanation:"The Western Ghats belong to the Western Ghats-Sri Lanka hotspot.", sourceFactIds:["env-cp007-western-ghats"] },

  { qlId:"ENV-007-QL-008", qlName:"Sundaland and Nicobar", difficulty:"Medium", stem:"Which Indian island group forms part of the Sundaland biodiversity hotspot?", correct:"Nicobar Islands", distractors:["Lakshadweep","Diu","Majuli"], explanation:"The Nicobar Islands are part of the Sundaland hotspot.", sourceFactIds:["env-cp007-sundaland"] },
  { qlId:"ENV-007-QL-008", qlName:"Sundaland and Nicobar", difficulty:"Medium", stem:"Sundaland is represented in India through which island group?", correct:"Nicobar Islands", distractors:["Lakshadweep","Diu","Majuli"], explanation:"In India, Sundaland is represented by the Nicobar Islands.", sourceFactIds:["env-cp007-sundaland"] },
  { qlId:"ENV-007-QL-008", qlName:"Sundaland and Nicobar", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Nicobar Islands — Sundaland", distractors:["Nicobar Islands — Himalaya","Nicobar Islands — Indo-Burma","Nicobar Islands — Western Ghats-Sri Lanka"], explanation:"The Nicobar Islands belong to the Sundaland hotspot.", sourceFactIds:["env-cp007-sundaland"] },
  { qlId:"ENV-007-QL-008", qlName:"Sundaland and Nicobar", difficulty:"Medium", stem:"Which hotspot represented in India is linked with the Nicobar Islands?", correct:"Sundaland", distractors:["Himalaya","Indo-Burma","Western Ghats-Sri Lanka"], explanation:"The Nicobar Islands are India’s part of Sundaland.", sourceFactIds:["env-cp007-sundaland"] },

  { qlId:"ENV-007-QL-009", qlName:"Correct hotspot pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Indian Himalaya — Himalaya", distractors:["Indian Himalaya — Sundaland","Western Ghats — Indo-Burma","Nicobar Islands — Himalaya"], explanation:"The Indian Himalaya belongs to the Himalaya hotspot.", sourceFactIds:["env-cp007-himalaya"] },
  { qlId:"ENV-007-QL-009", qlName:"Correct hotspot pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"North-eastern India — Indo-Burma", distractors:["North-eastern India — Sundaland","Western Ghats — Himalaya","Nicobar Islands — Western Ghats-Sri Lanka"], explanation:"Parts of north-eastern India lie in Indo-Burma.", sourceFactIds:["env-cp007-indo-burma"] },
  { qlId:"ENV-007-QL-009", qlName:"Correct hotspot pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Western Ghats — Western Ghats-Sri Lanka", distractors:["Western Ghats — Sundaland","Western Ghats — Himalaya","Western Ghats — Indo-Burma"], explanation:"The Western Ghats belong to the Western Ghats-Sri Lanka hotspot.", sourceFactIds:["env-cp007-western-ghats"] },
  { qlId:"ENV-007-QL-009", qlName:"Correct hotspot pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Nicobar Islands — Sundaland", distractors:["Nicobar Islands — Himalaya","Nicobar Islands — Indo-Burma","Nicobar Islands — Western Ghats-Sri Lanka"], explanation:"The Nicobar Islands belong to Sundaland.", sourceFactIds:["env-cp007-sundaland"] },

  { qlId:"ENV-007-QL-010", qlName:"Incorrect hotspot pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Western Ghats — Sundaland", distractors:["Nicobar Islands — Sundaland","North-eastern India — Indo-Burma","Indian Himalaya — Himalaya"], explanation:"The Western Ghats belong to Western Ghats-Sri Lanka, not Sundaland.", sourceFactIds:["env-cp007-western-ghats","env-cp007-sundaland"] },
  { qlId:"ENV-007-QL-010", qlName:"Incorrect hotspot pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Nicobar Islands — Himalaya", distractors:["Western Ghats — Western Ghats-Sri Lanka","North-eastern India — Indo-Burma","Indian Himalaya — Himalaya"], explanation:"The Nicobar Islands belong to Sundaland, not Himalaya.", sourceFactIds:["env-cp007-sundaland","env-cp007-himalaya"] },
  { qlId:"ENV-007-QL-010", qlName:"Incorrect hotspot pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Indo-Burma — Western Ghats", distractors:["Sundaland — Nicobar Islands","Himalaya — Indian Himalayan region","Western Ghats-Sri Lanka — Western Ghats"], explanation:"Indo-Burma is represented in parts of north-eastern India.", sourceFactIds:["env-cp007-indo-burma"] },
  { qlId:"ENV-007-QL-010", qlName:"Incorrect hotspot pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Sundaland — Western Ghats", distractors:["Sundaland — Nicobar Islands","Indo-Burma — north-eastern India","Himalaya — Indian Himalayan region"], explanation:"Sundaland is represented in India by the Nicobar Islands.", sourceFactIds:["env-cp007-sundaland"] },

  { qlId:"ENV-007-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. A hotspot must have at least 1,500 endemic vascular plant species.\n2. It must have lost at least 70% of its original vegetation.\n3. Meeting either one condition is sufficient.\nHow many statements are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct. Both criteria are required.", sourceFactIds:["env-cp007-endemic-threshold","env-cp007-loss-threshold","env-cp007-both-criteria"] },
  { qlId:"ENV-007-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Western Ghats are part of Western Ghats-Sri Lanka.\n2. Nicobar Islands are part of Sundaland.\n3. Parts of north-eastern India are part of Indo-Burma.\nHow many statements are correct?", correct:"Three", distractors:["One","Two","None"], explanation:"All three India-hotspot links are correct.", sourceFactIds:["env-cp007-western-ghats","env-cp007-sundaland","env-cp007-indo-burma"] },
  { qlId:"ENV-007-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. A 65% loss of original vegetation meets the hotspot loss criterion.\n2. 1,600 endemic vascular plant species meet the plant criterion.\n3. Both criteria are required for hotspot status.\nHow many statements are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 2 and 3 are correct. The loss threshold is 70%.", sourceFactIds:["env-cp007-endemic-threshold","env-cp007-loss-threshold","env-cp007-both-criteria"] },
  { qlId:"ENV-007-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. India is represented in the Himalaya hotspot.\n2. Sundaland is represented in India by the Nicobar Islands.\n3. Thar Desert is one of India’s four represented global hotspots.\nHow many statements are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct. Thar Desert is not one of the four.", sourceFactIds:["env-cp007-india-four","env-cp007-himalaya","env-cp007-sundaland"] },

  { qlId:"ENV-007-QL-012", qlName:"Applied hotspot identification", difficulty:"Hard", stem:"A region has 1,800 endemic vascular plant species and has lost 50% of its original vegetation. It:", correct:"Does not qualify as a hotspot", distractors:["Qualifies as a hotspot","Meets both hotspot criteria","Fails the endemic-plant criterion"], explanation:"It passes the plant test but fails the 70% habitat-loss test.", sourceFactIds:["env-cp007-endemic-threshold","env-cp007-loss-threshold","env-cp007-both-criteria"] },
  { qlId:"ENV-007-QL-012", qlName:"Applied hotspot identification", difficulty:"Hard", stem:"A region has 1,700 endemic vascular plant species and has lost 72% of its original vegetation. It:", correct:"Qualifies under both hotspot criteria", distractors:["Meets only the plant criterion","Meets only the habitat-loss criterion","Fails both criteria"], explanation:"It passes both the 1,500-species and 70% loss thresholds.", sourceFactIds:["env-cp007-endemic-threshold","env-cp007-loss-threshold","env-cp007-both-criteria"] },
  { qlId:"ENV-007-QL-012", qlName:"Applied hotspot identification", difficulty:"Hard", stem:"A region has 1,450 endemic vascular plant species and has lost 80% of its original vegetation. It:", correct:"Does not qualify as a hotspot", distractors:["Qualifies as a hotspot","Meets both criteria","Fails the habitat-loss criterion"], explanation:"It passes the loss test but fails the 1,500-species plant test.", sourceFactIds:["env-cp007-endemic-threshold","env-cp007-loss-threshold","env-cp007-both-criteria"] },
  { qlId:"ENV-007-QL-012", qlName:"Applied hotspot identification", difficulty:"Hard", stem:"A region has 1,600 endemic vascular plant species and has lost exactly 70% of its original vegetation. It:", correct:"Qualifies under both hotspot criteria", distractors:["Fails because loss must exceed 70%","Meets only the plant criterion","Fails because 1,600 species are too many"], explanation:"Both minimum thresholds are met.", sourceFactIds:["env-cp007-endemic-threshold","env-cp007-loss-threshold","env-cp007-both-criteria"] },
]);

function place(correct: string, distractors: readonly string[], index: number): string[] {
  const options = [...distractors];
  options.splice(index, 0, correct);
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("ENV-CP-007 V2 requires four unique options");
  return options;
}

export function generateEnvCp007ReviewBatchV2(): EnvCp007ReviewQuestion[] {
  const counters = new Map<string, number>();
  return S.map((seed, i) => {
    const local = counters.get(seed.qlId) ?? 0;
    counters.set(seed.qlId, local + 1);
    const correctIndex = POSITIONS[local];
    return {
      questionId: `ENV-CP007-V2-${String(i + 1).padStart(3, "0")}`,
      chapterId: "ENV-001",
      cpId: "ENV-CP-007",
      qlId: seed.qlId,
      qlName: seed.qlName,
      difficulty: seed.difficulty,
      stem: seed.stem,
      options: place(seed.correct, seed.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: seed.correct,
      explanation: seed.explanation,
      sourceIds: [...SOURCE_IDS],
      sourceFactIds: [...seed.sourceFactIds],
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
}
