import type { KnowledgeV1Difficulty } from "../../types";
import type { EnvCp010ReviewQuestion } from "./env-cp010-review-types";

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

const SOURCE_IDS = [
  "UTTARAKHAND-TOURISM-CORBETT",
  "UNESCO-KAZIRANGA",
  "GUJARAT-FOREST-GIR",
  "UNESCO-KEOLADEO",
  "UNESCO-SUNDARBANS",
  "HIMACHAL-TOURISM-GHNP",
  "KERALA-FOREST-SILENT-VALLEY",
  "MP-GOV-KANHA",
  "RAJASTHAN-FOREST-RANTHAMBORE",
  "LADAKH-GOV-HEMIS",
] as const;
const POSITIONS = [0, 1, 2, 3] as const;

const S: readonly Seed[] = Object.freeze([
  { qlId:"ENV-010-QL-001", qlName:"Protected area — State/UT", difficulty:"Easy", stem:"Kaziranga National Park is located in which State?", correct:"Assam", distractors:["Gujarat","Rajasthan","Uttarakhand"], explanation:"Kaziranga National Park is in Assam.", sourceFactIds:["env-cp010-kaziranga-state"] },
  { qlId:"ENV-010-QL-001", qlName:"Protected area — State/UT", difficulty:"Easy", stem:"Gir National Park is located in which State?", correct:"Gujarat", distractors:["Assam","Kerala","Madhya Pradesh"], explanation:"Gir National Park is in Gujarat.", sourceFactIds:["env-cp010-gir-state"] },
  { qlId:"ENV-010-QL-001", qlName:"Protected area — State/UT", difficulty:"Easy", stem:"Keoladeo National Park is located in which State?", correct:"Rajasthan", distractors:["Gujarat","West Bengal","Himachal Pradesh"], explanation:"Keoladeo National Park is in Rajasthan.", sourceFactIds:["env-cp010-keoladeo-state"] },
  { qlId:"ENV-010-QL-001", qlName:"Protected area — State/UT", difficulty:"Easy", stem:"Sundarbans National Park is located in which State?", correct:"West Bengal", distractors:["Assam","Odisha","Kerala"], explanation:"Sundarbans National Park is in West Bengal.", sourceFactIds:["env-cp010-sundarbans-state"] },

  { qlId:"ENV-010-QL-002", qlName:"Signature wildlife association", difficulty:"Easy", stem:"Kaziranga National Park is best known for conservation of the:", correct:"Indian one-horned rhinoceros", distractors:["Asiatic lion","Hard-ground barasingha","Snow leopard"], explanation:"Kaziranga is a major stronghold of the one-horned rhinoceros.", sourceFactIds:["env-cp010-kaziranga-rhino"] },
  { qlId:"ENV-010-QL-002", qlName:"Signature wildlife association", difficulty:"Easy", stem:"Gir National Park is the principal wild refuge of the:", correct:"Asiatic lion", distractors:["One-horned rhinoceros","Hard-ground barasingha","Snow leopard"], explanation:"Gir is the last natural home of the Asiatic lion.", sourceFactIds:["env-cp010-gir-lion"] },
  { qlId:"ENV-010-QL-002", qlName:"Signature wildlife association", difficulty:"Easy", stem:"Kanha National Park is especially known for conserving the:", correct:"Hard-ground barasingha", distractors:["Asiatic lion","One-horned rhinoceros","Hangul"], explanation:"Kanha is strongly identified with hard-ground barasingha conservation.", sourceFactIds:["env-cp010-kanha-barasingha"] },
  { qlId:"ENV-010-QL-002", qlName:"Signature wildlife association", difficulty:"Easy", stem:"Hemis National Park is well known as habitat of the:", correct:"Snow leopard", distractors:["Asiatic lion","One-horned rhinoceros","Barasingha"], explanation:"Hemis is a well-known snow-leopard habitat in Ladakh.", sourceFactIds:["env-cp010-hemis-snow-leopard"] },

  { qlId:"ENV-010-QL-003", qlName:"Landscape / river association", difficulty:"Easy", stem:"Which protected area is noted for a tidal mangrove ecosystem in a major delta?", correct:"Sundarbans National Park", distractors:["Kanha National Park","Ranthambore National Park","Silent Valley National Park"], explanation:"The Sundarbans form a tidal mangrove ecosystem in the Ganges-Brahmaputra delta.", sourceFactIds:["env-cp010-sundarbans-delta"] },
  { qlId:"ENV-010-QL-003", qlName:"Landscape / river association", difficulty:"Easy", stem:"Which national park protects tropical moist evergreen rainforest in Kerala?", correct:"Silent Valley National Park", distractors:["Gir National Park","Keoladeo National Park","Kaziranga National Park"], explanation:"Silent Valley protects tropical moist evergreen forest in Kerala.", sourceFactIds:["env-cp010-silent-state","env-cp010-silent-evergreen"] },
  { qlId:"ENV-010-QL-003", qlName:"Landscape / river association", difficulty:"Easy", stem:"Which national park has a dry-deciduous forest landscape in Rajasthan?", correct:"Ranthambore National Park", distractors:["Sundarbans National Park","Great Himalayan National Park","Silent Valley National Park"], explanation:"Ranthambore is a dry-deciduous forest landscape in Rajasthan.", sourceFactIds:["env-cp010-ranthambore-state","env-cp010-ranthambore-forest"] },
  { qlId:"ENV-010-QL-003", qlName:"Landscape / river association", difficulty:"Easy", stem:"High ridges, glaciers and alpine meadows are typical of which national park?", correct:"Great Himalayan National Park", distractors:["Keoladeo National Park","Gir National Park","Kaziranga National Park"], explanation:"Great Himalayan National Park has glaciers, alpine meadows and high mountain ridges.", sourceFactIds:["env-cp010-ghnp-landscape"] },

  { qlId:"ENV-010-QL-004", qlName:"Corbett and Kaziranga", difficulty:"Medium", stem:"Which national park is recognised as India's first national park?", correct:"Jim Corbett National Park", distractors:["Kaziranga National Park","Gir National Park","Kanha National Park"], explanation:"Corbett was India's first national park, created in 1936.", sourceFactIds:["env-cp010-corbett-first"] },
  { qlId:"ENV-010-QL-004", qlName:"Corbett and Kaziranga", difficulty:"Medium", stem:"The Ramganga River is an important feature of which national park landscape?", correct:"Jim Corbett National Park", distractors:["Keoladeo National Park","Gir National Park","Hemis National Park"], explanation:"The Ramganga is an important river of the Corbett landscape.", sourceFactIds:["env-cp010-corbett-river"] },
  { qlId:"ENV-010-QL-004", qlName:"Corbett and Kaziranga", difficulty:"Medium", stem:"The Brahmaputra Valley floodplain is a defining landscape of:", correct:"Kaziranga National Park", distractors:["Jim Corbett National Park","Gir National Park","Silent Valley National Park"], explanation:"Kaziranga lies in the Brahmaputra Valley floodplain.", sourceFactIds:["env-cp010-kaziranga-floodplain"] },
  { qlId:"ENV-010-QL-004", qlName:"Corbett and Kaziranga", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Corbett — Uttarakhand", distractors:["Corbett — Assam","Kaziranga — Gujarat","Kaziranga — Rajasthan"], explanation:"Corbett is in Uttarakhand, while Kaziranga is in Assam.", sourceFactIds:["env-cp010-corbett-state","env-cp010-kaziranga-state"] },

  { qlId:"ENV-010-QL-005", qlName:"Gir and Keoladeo", difficulty:"Medium", stem:"Gir National Park lies in which broad region of Gujarat?", correct:"Saurashtra", distractors:["Kachchh desert","Malwa plateau","Brahmaputra valley"], explanation:"Gir lies in the Saurashtra region of Gujarat.", sourceFactIds:["env-cp010-gir-saurashtra"] },
  { qlId:"ENV-010-QL-005", qlName:"Gir and Keoladeo", difficulty:"Medium", stem:"Keoladeo National Park is located at:", correct:"Bharatpur", distractors:["Sawai Madhopur","Junagadh","Kullu"], explanation:"Keoladeo National Park is at Bharatpur in Rajasthan.", sourceFactIds:["env-cp010-keoladeo-state"] },
  { qlId:"ENV-010-QL-005", qlName:"Gir and Keoladeo", difficulty:"Medium", stem:"Which protected area is a managed wetland famous for migratory waterbirds?", correct:"Keoladeo National Park", distractors:["Gir National Park","Hemis National Park","Jim Corbett National Park"], explanation:"Keoladeo is a managed wetland important for migratory waterbirds.", sourceFactIds:["env-cp010-keoladeo-wetland"] },
  { qlId:"ENV-010-QL-005", qlName:"Gir and Keoladeo", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Gir — Asiatic lion", distractors:["Gir — one-horned rhinoceros","Keoladeo — snow leopard","Keoladeo — hard-ground barasingha"], explanation:"Gir is the principal wild refuge of the Asiatic lion.", sourceFactIds:["env-cp010-gir-lion"] },

  { qlId:"ENV-010-QL-006", qlName:"Sundarbans and Great Himalayan", difficulty:"Medium", stem:"The Indian Sundarbans protected area is located in:", correct:"West Bengal", distractors:["Himachal Pradesh","Assam","Gujarat"], explanation:"Sundarbans National Park is in West Bengal.", sourceFactIds:["env-cp010-sundarbans-state"] },
  { qlId:"ENV-010-QL-006", qlName:"Sundarbans and Great Himalayan", difficulty:"Medium", stem:"Which national park is located in Kullu district?", correct:"Great Himalayan National Park", distractors:["Sundarbans National Park","Kanha National Park","Gir National Park"], explanation:"Great Himalayan National Park is in Kullu district of Himachal Pradesh.", sourceFactIds:["env-cp010-ghnp-state"] },
  { qlId:"ENV-010-QL-006", qlName:"Sundarbans and Great Himalayan", difficulty:"Medium", stem:"Which protected area is part of a vast mangrove system shared by India and Bangladesh?", correct:"Sundarbans National Park", distractors:["Great Himalayan National Park","Silent Valley National Park","Ranthambore National Park"], explanation:"The Sundarbans mangrove system extends across India and Bangladesh.", sourceFactIds:["env-cp010-sundarbans-delta"] },
  { qlId:"ENV-010-QL-006", qlName:"Sundarbans and Great Himalayan", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Great Himalayan National Park — Himachal Pradesh", distractors:["Great Himalayan National Park — Ladakh","Sundarbans National Park — Assam","Sundarbans National Park — Odisha"], explanation:"Great Himalayan National Park is in Himachal Pradesh.", sourceFactIds:["env-cp010-ghnp-state"] },

  { qlId:"ENV-010-QL-007", qlName:"Silent Valley and Kanha", difficulty:"Medium", stem:"Silent Valley National Park lies in the:", correct:"Nilgiri Hills of the Western Ghats", distractors:["Aravalli range","Brahmaputra floodplain","Saurashtra plateau"], explanation:"Silent Valley lies in the Nilgiri Hills of the Western Ghats.", sourceFactIds:["env-cp010-silent-state"] },
  { qlId:"ENV-010-QL-007", qlName:"Silent Valley and Kanha", difficulty:"Medium", stem:"The Kunthipuzha River flows through which national park?", correct:"Silent Valley National Park", distractors:["Kanha National Park","Gir National Park","Ranthambore National Park"], explanation:"The Kunthipuzha River flows through Silent Valley.", sourceFactIds:["env-cp010-silent-river"] },
  { qlId:"ENV-010-QL-007", qlName:"Silent Valley and Kanha", difficulty:"Medium", stem:"Kanha National Park extends across Mandla and Balaghat districts of:", correct:"Madhya Pradesh", distractors:["Rajasthan","Gujarat","Kerala"], explanation:"Kanha lies in Mandla and Balaghat districts of Madhya Pradesh.", sourceFactIds:["env-cp010-kanha-state"] },
  { qlId:"ENV-010-QL-007", qlName:"Silent Valley and Kanha", difficulty:"Medium", stem:"Sal and bamboo forests with open meadows are characteristic of:", correct:"Kanha National Park", distractors:["Keoladeo National Park","Sundarbans National Park","Hemis National Park"], explanation:"Kanha has extensive sal and bamboo forests with open meadows.", sourceFactIds:["env-cp010-kanha-forest"] },

  { qlId:"ENV-010-QL-008", qlName:"Ranthambore and Hemis", difficulty:"Medium", stem:"Ranthambore National Park is located in which district of Rajasthan?", correct:"Sawai Madhopur", distractors:["Bharatpur","Jaisalmer","Udaipur"], explanation:"Ranthambore National Park is in Sawai Madhopur district.", sourceFactIds:["env-cp010-ranthambore-state"] },
  { qlId:"ENV-010-QL-008", qlName:"Ranthambore and Hemis", difficulty:"Medium", stem:"Ranthambore lies near the junction of which two mountain ranges?", correct:"Aravalli and Vindhya", distractors:["Himalaya and Karakoram","Satpura and Western Ghats","Nilgiri and Aravalli"], explanation:"Ranthambore lies at the junction of the Aravalli and Vindhya ranges.", sourceFactIds:["env-cp010-ranthambore-ranges"] },
  { qlId:"ENV-010-QL-008", qlName:"Ranthambore and Hemis", difficulty:"Medium", stem:"Hemis National Park is located in which Union Territory?", correct:"Ladakh", distractors:["Jammu and Kashmir","Chandigarh","Puducherry"], explanation:"Hemis National Park is in Ladakh.", sourceFactIds:["env-cp010-hemis-ut"] },
  { qlId:"ENV-010-QL-008", qlName:"Ranthambore and Hemis", difficulty:"Medium", stem:"Which description best fits Hemis National Park?", correct:"High-altitude Himalayan protected area", distractors:["Tidal mangrove delta","Lowland wetland bird park","Dry-deciduous Aravalli-Vindhya forest"], explanation:"Hemis is a high-altitude Himalayan protected area in Ladakh.", sourceFactIds:["env-cp010-hemis-high-altitude"] },

  { qlId:"ENV-010-QL-009", qlName:"Reverse location identification", difficulty:"Medium", stem:"Which national park is located in Uttarakhand?", correct:"Jim Corbett National Park", distractors:["Gir National Park","Kaziranga National Park","Kanha National Park"], explanation:"Jim Corbett National Park is in Uttarakhand.", sourceFactIds:["env-cp010-corbett-state"] },
  { qlId:"ENV-010-QL-009", qlName:"Reverse location identification", difficulty:"Medium", stem:"Which national park is located in Himachal Pradesh?", correct:"Great Himalayan National Park", distractors:["Hemis National Park","Silent Valley National Park","Keoladeo National Park"], explanation:"Great Himalayan National Park is in Himachal Pradesh.", sourceFactIds:["env-cp010-ghnp-state"] },
  { qlId:"ENV-010-QL-009", qlName:"Reverse location identification", difficulty:"Medium", stem:"Which national park is located in Kerala?", correct:"Silent Valley National Park", distractors:["Ranthambore National Park","Gir National Park","Kaziranga National Park"], explanation:"Silent Valley National Park is in Kerala.", sourceFactIds:["env-cp010-silent-state"] },
  { qlId:"ENV-010-QL-009", qlName:"Reverse location identification", difficulty:"Medium", stem:"Which national park spans Mandla and Balaghat districts?", correct:"Kanha National Park", distractors:["Corbett National Park","Keoladeo National Park","Hemis National Park"], explanation:"Kanha spans Mandla and Balaghat districts in Madhya Pradesh.", sourceFactIds:["env-cp010-kanha-state"] },

  { qlId:"ENV-010-QL-010", qlName:"Correct / incorrect pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Kaziranga — Brahmaputra floodplain", distractors:["Gir — Ganges delta","Hemis — Bharatpur wetland","Keoladeo — Saurashtra"], explanation:"Kaziranga represents the Brahmaputra Valley floodplain.", sourceFactIds:["env-cp010-kaziranga-floodplain"] },
  { qlId:"ENV-010-QL-010", qlName:"Correct / incorrect pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Silent Valley — Rajasthan", distractors:["Gir — Gujarat","Keoladeo — Rajasthan","Sundarbans — West Bengal"], explanation:"Silent Valley is in Kerala, not Rajasthan.", sourceFactIds:["env-cp010-silent-state","env-cp010-gir-state","env-cp010-keoladeo-state","env-cp010-sundarbans-state"] },
  { qlId:"ENV-010-QL-010", qlName:"Correct / incorrect pair", difficulty:"Medium", stem:"Which pair is correctly matched?", correct:"Kanha — hard-ground barasingha", distractors:["Gir — snow leopard","Hemis — Asiatic lion","Keoladeo — one-horned rhinoceros"], explanation:"Kanha is well known for hard-ground barasingha conservation.", sourceFactIds:["env-cp010-kanha-barasingha"] },
  { qlId:"ENV-010-QL-010", qlName:"Correct / incorrect pair", difficulty:"Medium", stem:"Which pair is incorrectly matched?", correct:"Ranthambore — West Bengal", distractors:["Corbett — Uttarakhand","Hemis — Ladakh","Kaziranga — Assam"], explanation:"Ranthambore is in Rajasthan, not West Bengal.", sourceFactIds:["env-cp010-ranthambore-state","env-cp010-corbett-state","env-cp010-hemis-ut","env-cp010-kaziranga-state"] },

  { qlId:"ENV-010-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Kaziranga lies in Assam.\n2. Gir is a principal wild refuge of the Asiatic lion.\n3. Keoladeo is in Gujarat.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct. Keoladeo is in Rajasthan.", sourceFactIds:["env-cp010-kaziranga-state","env-cp010-gir-lion","env-cp010-keoladeo-state"] },
  { qlId:"ENV-010-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Sundarbans is a tidal mangrove ecosystem.\n2. Great Himalayan National Park is in Himachal Pradesh.\n3. Hemis is in Kerala.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct. Hemis is in Ladakh.", sourceFactIds:["env-cp010-sundarbans-delta","env-cp010-ghnp-state","env-cp010-hemis-ut"] },
  { qlId:"ENV-010-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Silent Valley protects evergreen rainforest.\n2. Kanha is linked with hard-ground barasingha.\n3. Ranthambore lies in Assam.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct. Ranthambore is in Rajasthan.", sourceFactIds:["env-cp010-silent-evergreen","env-cp010-kanha-barasingha","env-cp010-ranthambore-state"] },
  { qlId:"ENV-010-QL-011", qlName:"Statement evaluation", difficulty:"Hard", stem:"Consider the following statements:\n1. Corbett is India's first national park.\n2. Ramganga is important in the Corbett landscape.\n3. Corbett is in West Bengal.\nHow many are correct?", correct:"Two", distractors:["One","Three","None"], explanation:"Statements 1 and 2 are correct. Corbett is in Uttarakhand.", sourceFactIds:["env-cp010-corbett-first","env-cp010-corbett-river","env-cp010-corbett-state"] },

  { qlId:"ENV-010-QL-012", qlName:"Applied protected-area clues", difficulty:"Hard", stem:"A protected area is in Assam, lies on the Brahmaputra floodplain and is famous for the one-horned rhinoceros. Identify it.", correct:"Kaziranga National Park", distractors:["Gir National Park","Kanha National Park","Keoladeo National Park"], explanation:"These clues identify Kaziranga National Park.", sourceFactIds:["env-cp010-kaziranga-state","env-cp010-kaziranga-floodplain","env-cp010-kaziranga-rhino"] },
  { qlId:"ENV-010-QL-012", qlName:"Applied protected-area clues", difficulty:"Hard", stem:"A protected area in Rajasthan is a managed wetland important for migratory waterbirds. Identify it.", correct:"Keoladeo National Park", distractors:["Ranthambore National Park","Gir National Park","Hemis National Park"], explanation:"Keoladeo is the well-known wetland bird park at Bharatpur.", sourceFactIds:["env-cp010-keoladeo-state","env-cp010-keoladeo-wetland"] },
  { qlId:"ENV-010-QL-012", qlName:"Applied protected-area clues", difficulty:"Hard", stem:"A Kerala national park in the Nilgiri Hills protects tropical moist evergreen forest and is crossed by the Kunthipuzha. Identify it.", correct:"Silent Valley National Park", distractors:["Kanha National Park","Jim Corbett National Park","Sundarbans National Park"], explanation:"These clues identify Silent Valley National Park.", sourceFactIds:["env-cp010-silent-state","env-cp010-silent-evergreen","env-cp010-silent-river"] },
  { qlId:"ENV-010-QL-012", qlName:"Applied protected-area clues", difficulty:"Hard", stem:"A Ladakh protected area is high-altitude Himalayan habitat well known for snow leopards. Identify it.", correct:"Hemis National Park", distractors:["Great Himalayan National Park","Gir National Park","Ranthambore National Park"], explanation:"These clues identify Hemis National Park.", sourceFactIds:["env-cp010-hemis-ut","env-cp010-hemis-high-altitude","env-cp010-hemis-snow-leopard"] },
]);

function place(correct: string, distractors: readonly string[], index: number): string[] {
  const options = [...distractors];
  options.splice(index, 0, correct);
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("ENV-CP-010 requires four unique options");
  return options;
}

export function generateEnvCp010ReviewBatchV1(): EnvCp010ReviewQuestion[] {
  const counters = new Map<string, number>();
  return S.map((seed, i) => {
    const local = counters.get(seed.qlId) ?? 0;
    counters.set(seed.qlId, local + 1);
    const correctIndex = POSITIONS[local];
    return {
      questionId: `ENV-CP010-V1-${String(i + 1).padStart(3, "0")}`,
      chapterId: "ENV-001",
      cpId: "ENV-CP-010",
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
