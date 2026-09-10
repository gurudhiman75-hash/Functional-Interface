import { deterministicShuffle } from "../../deterministic";
import { GEO_RIV_001_CP006_FACTS_V1 } from "./geo-riv-001-cp006-facts";
import { generateGeoRiv001Cp006ReviewQuestionsV1 } from "./geo-riv-001-cp006-review-generator-v1";
import type { GeoRiv001Cp006ReviewQuestion } from "./geo-riv-001-cp006-review-types";

function fact(id: string) {
  const found = GEO_RIV_001_CP006_FACTS_V1.find((entry) => entry.factId === `geo-riv-001-cp006-${id}`);
  if (!found) throw new Error(`Missing CP006 fact ${id}`);
  return found;
}

function bankQuestion(key: string, stem: string, answer: string, pool: string[], explanation: string, factIds: string[]): GeoRiv001Cp006ReviewQuestion {
  const facts = factIds.map(fact);
  const distractors = deterministicShuffle([...new Set(pool.filter((x) => x !== answer))], `cp006-v2:${key}:d`).slice(0, 3);
  const options = deterministicShuffle([answer, ...distractors], `cp006-v2:${key}:o`);
  return {
    questionId: `GEO-RIV-001-CP006-V2-GEO-RIV-001-QL-049-${key}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP006",
    qlId: "GEO-RIV-001-QL-049",
    qlName: "Bank-side identification",
    difficulty: "Medium",
    stem,
    options,
    correctIndex: options.indexOf(answer),
    canonicalAnswer: answer,
    explanation,
    sourceIds: [...new Set(facts.map((x) => x.source.sourceId))],
    sourceFactIds: facts.map((x) => x.factId),
    solverAuthority: "RELATION_CLASS_COMPOSER",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

const bankQuestions = [
  bankQuestion("049-01", "Which of the following is a left-bank tributary of the Narmada?", "Tawa", ["Tawa", "Hiran", "Barna", "Aner", "Sei"], "Tawa is a left-bank tributary of the Narmada.", ["narmada-tawa-bank"]),
  bankQuestion("049-02", "Which of the following is a right-bank tributary of the Narmada?", "Hiran", ["Hiran", "Tawa", "Burhner", "Purna", "Anas"], "Hiran is a right-bank tributary of the Narmada.", ["narmada-hiran-bank"]),
  bankQuestion("049-03", "Which of the following is a left-bank tributary of the Tapi?", "Purna", ["Purna", "Aner", "Gomai", "Hiran", "Sei"], "Purna is a left-bank tributary of the Tapi.", ["tapi-purna-bank"]),
  bankQuestion("049-04", "Which of the following is a right-bank tributary of the Mahi?", "Som", ["Som", "Anas", "Panam", "Watrak", "Tawa"], "Som joins the Mahi from the right bank.", ["mahi-som-bank"]),
  bankQuestion("049-05", "Which of the following is a left-bank tributary of the Sabarmati?", "Watrak", ["Watrak", "Sei", "Som", "Aner", "Hiran"], "Watrak joins the Sabarmati from the left bank.", ["sabarmati-watrak-bank"]),
  bankQuestion("049-06", "Which of the following is the notable right-bank tributary of the Luni?", "Jojari", ["Jojari", "Jawai", "Bandi", "Purna", "Panam"], "Jojari is the notable right-bank tributary of the Luni; the main listed Luni tributaries are otherwise predominantly left-bank.", ["luni-jojari-bank", "luni-jawai-bank", "luni-bandi-bank"]),
];

export function generateGeoRiv001Cp006ReviewQuestionsV2(): GeoRiv001Cp006ReviewQuestion[] {
  return [
    ...generateGeoRiv001Cp006ReviewQuestionsV1().filter((q) => q.qlId !== "GEO-RIV-001-QL-049"),
    ...bankQuestions,
  ];
}
