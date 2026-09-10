import { deterministicShuffle } from "../../deterministic";
import { GEO_RIV_001_CP006_FACTS_V1 } from "./geo-riv-001-cp006-facts";
import { generateGeoRiv001Cp006ReviewQuestionsV3 } from "./geo-riv-001-cp006-review-generator-v3";
import type { GeoRiv001Cp006ReviewQuestion } from "./geo-riv-001-cp006-review-types";

function westCoastQuestion(): GeoRiv001Cp006ReviewQuestion {
  const fact = GEO_RIV_001_CP006_FACTS_V1.find((f) => f.factId === "geo-riv-001-cp006-periyar-west");
  if (!fact) throw new Error("Missing CP006 Periyar fact");
  const answer = "Periyar";
  const options = deterministicShuffle([answer, "Godavari", "Krishna", "Mahanadi"], "cp006-v4:periyar:options");
  return {
    questionId: "GEO-RIV-001-CP006-V4-GEO-RIV-001-QL-047-047-06",
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP006",
    qlId: "GEO-RIV-001-QL-047",
    qlName: "Reverse association",
    difficulty: "Medium",
    stem: "Which of the following is an independent west-flowing river draining towards the Arabian Sea?",
    options,
    correctIndex: options.indexOf(answer),
    canonicalAnswer: answer,
    explanation: "Periyar is one of the major independent west-flowing rivers of the Tadri-to-Kanyakumari basin group draining towards the Arabian Sea.",
    sourceIds: [fact.source.sourceId],
    sourceFactIds: [fact.factId],
    solverAuthority: "CANONICAL_FACT_RELATION",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoRiv001Cp006ReviewQuestionsV4() {
  return generateGeoRiv001Cp006ReviewQuestionsV3().map((q) =>
    q.qlId === "GEO-RIV-001-QL-047" && q.questionId.endsWith("047-06") ? westCoastQuestion() : q,
  );
}
