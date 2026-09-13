import {
  GEO_PHY_001_CP004_CENTRAL_HIGHLANDS_FACTS_V1 as central,
  GEO_PHY_001_CP004_DECCAN_FACTS_V1 as deccan,
  GEO_PHY_001_CP004_FOUNDATION_FACTS_V1 as foundation,
} from "./geo-phy-001-cp004-facts";
import { generateGeoPhy001Cp004ReviewBatchV2 } from "./geo-phy-001-cp004-review-generator-v2";
import type { GeoPhy001Cp004ReviewQuestion } from "./geo-phy-001-cp004-review-types";

function withCorrectAt(options: string[], correct: string, target: number) {
  const unique = [...new Set([correct, ...options.filter((option) => option !== correct)])].slice(0, 4);
  if (unique.length !== 4) throw new Error(`Need four distinct options for ${correct}`);
  const current = unique.indexOf(correct);
  [unique[current], unique[target]] = [unique[target], unique[current]];
  return unique;
}

function replaceQuestion(
  question: GeoPhy001Cp004ReviewQuestion,
  patch: {
    stem: string;
    answer: string;
    options: string[];
    explanation: string;
    sourceFactIds: readonly string[];
  },
): GeoPhy001Cp004ReviewQuestion {
  return {
    ...question,
    stem: patch.stem,
    canonicalAnswer: patch.answer,
    options: withCorrectAt(patch.options, patch.answer, question.correctIndex),
    explanation: patch.explanation,
    sourceFactIds: [...new Set(patch.sourceFactIds)],
    sourceIds: [...question.sourceIds],
  };
}

export function generateGeoPhy001Cp004ReviewBatchV3(): GeoPhy001Cp004ReviewQuestion[] {
  return generateGeoPhy001Cp004ReviewBatchV2().map((question, index) => {
    if (index === 5) {
      const fact = foundation[4];
      return replaceQuestion(question, {
        stem: "Which plateau contains the volcanic black-soil region known as the Deccan Trap?",
        answer: "Peninsular Plateau",
        options: ["Peninsular Plateau", "Northern Plains", "Himalayan Mountains", "Coastal Plains"],
        explanation: "The Deccan Trap is a volcanic-origin black-soil region of the Peninsular Plateau and is formed from igneous rocks.",
        sourceFactIds: fact.sourceFactIds,
      });
    }

    if (index === 11) {
      const fact = central[4];
      return replaceQuestion(question, {
        stem: "The Chambal, Sind, Betwa and Ken generally flow in which direction across the Central Highlands?",
        answer: "Southwest to northeast",
        options: ["Southwest to northeast", "Northeast to southwest", "East to west", "North to south"],
        explanation: "Across the Central Highlands, the Chambal, Sind, Betwa and Ken generally flow from southwest to northeast, showing the broad slope of the region.",
        sourceFactIds: fact.sourceFactIds,
      });
    }

    if (index === 16) {
      const fact = deccan[3];
      return replaceQuestion(question, {
        stem: "Which group forms prominent eastern extensions of the Deccan Plateau?",
        answer: "Mahadev Hills, Kaimur Hills and Maikal Range",
        options: [
          "Mahadev Hills, Kaimur Hills and Maikal Range",
          "Garo Hills, Khasi Hills and Jaintia Hills",
          "Aravalli Range, Vindhya Range and Western Ghats",
          "Shiwaliks, Himachal and Himadri",
        ],
        explanation: "The Mahadev Hills, Kaimur Hills and Maikal Range form prominent eastern extensions of the Deccan Plateau.",
        sourceFactIds: fact.sourceFactIds,
      });
    }

    if (index === 17) {
      const fact = deccan[5];
      return replaceQuestion(question, {
        stem: "The northeastern extension of the Peninsular Plateau is separated from the Chotanagpur Plateau mainly by what?",
        answer: "A fault",
        options: ["A fault", "A glacial valley", "A sand-dune belt", "A coastal lagoon"],
        explanation: "The northeastern plateau extension is separated from the Chotanagpur Plateau by a fault, even though both belong to the broader Peninsular Plateau system.",
        sourceFactIds: fact.sourceFactIds,
      });
    }

    if (index === 35) {
      const fact = foundation[4];
      const answer = "Deccan Trap — volcanic-origin black-soil region";
      return replaceQuestion(question, {
        stem: "Which of the following pairs is correctly matched?",
        answer,
        options: [
          answer,
          "Bhabar — old crystalline plateau surface",
          "Terai — volcanic black-soil region",
          "Khadar — western edge of the Deccan Plateau",
        ],
        explanation: "The Deccan Trap is a volcanic-origin region associated with igneous rocks and black soil. The other pairs mix features of unrelated landforms.",
        sourceFactIds: fact.sourceFactIds,
      });
    }

    if (index === 41) {
      const trap = foundation[4];
      const answer = "Deccan Trap — young alluvium deposited by rivers";
      return replaceQuestion(question, {
        stem: "Which of the following pairs is incorrectly matched?",
        answer,
        options: [
          answer,
          "Central Highlands — mainly north of the Narmada",
          "Deccan Plateau — mainly south of the Narmada",
          "Western Ghats — western edge of the Deccan Plateau",
        ],
        explanation: "The Deccan Trap is not young river alluvium. It is a volcanic-origin region of igneous rocks associated with black soil.",
        sourceFactIds: trap.sourceFactIds,
      });
    }

    if (index === 47) {
      const rivers = central[4];
      const trap = foundation[4];
      const answer = "Both I and II";
      return replaceQuestion(question, {
        stem: "Consider the following statements: I. The Chambal, Sind, Betwa and Ken generally flow from southwest to northeast across the Central Highlands. II. The Deccan Trap is of volcanic origin and is associated with black soil. Which is correct?",
        answer,
        options: ["I only", "II only", answer, "Neither I nor II"],
        explanation: "Both statements are correct. The named Central Highlands rivers generally flow southwest to northeast, while the Deccan Trap is a volcanic-origin black-soil region.",
        sourceFactIds: [...rivers.sourceFactIds, ...trap.sourceFactIds],
      });
    }

    if (index === 53) {
      const south = deccan[0];
      const eastern = deccan[3];
      const fault = deccan[5];
      const answer = "All three";
      return replaceQuestion(question, {
        stem: "Consider the following statements: 1. The Deccan Plateau lies south of the Narmada River. 2. The Mahadev Hills, Kaimur Hills and Maikal Range form eastern extensions of the Deccan Plateau. 3. The northeastern plateau extension is separated from the Chotanagpur Plateau by a fault. How many are correct?",
        answer,
        options: ["Only one", "Only two", answer, "None"],
        explanation: "All three statements are correct: the Deccan lies south of the Narmada, Mahadev–Kaimur–Maikal form eastern extensions, and a fault separates the northeastern extension from Chotanagpur.",
        sourceFactIds: [...south.sourceFactIds, ...eastern.sourceFactIds, ...fault.sourceFactIds],
      });
    }

    return {
      ...question,
      options: [...question.options],
      sourceIds: [...question.sourceIds],
      sourceFactIds: [...question.sourceFactIds],
    };
  });
}
