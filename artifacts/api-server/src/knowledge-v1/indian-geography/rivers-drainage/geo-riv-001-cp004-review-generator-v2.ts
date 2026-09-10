import { deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import { GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp004-editorial-review-v1";
import { generateGeoRiv001Cp004ReviewV1 } from "./geo-riv-001-cp004-review-generator-v1";
import type { GeoRiv001Cp004ReviewQuestion } from "./geo-riv-001-cp004-review-types";

function byId(id: string) {
  const fact = GEO_RIV_001_CP004_REVIEWABLE_FACTS_V1.find((entry) => entry.factId === `geo-riv-001-cp004-${id}`);
  if (!fact) throw new Error(`Missing CP004 V2 fact ${id}`);
  return fact;
}

function dibangCorrectPair(seed: string): GeoRiv001Cp004ReviewQuestion {
  const fact = byId("dibang-joins-siang");
  const answer = "Dibang — joins Siang/Dihang";
  const rows = deterministicShuffle([
    { text: answer, correct: true },
    { text: "Dibang — tributary of Subansiri", correct: false },
    { text: "Dibang — south-bank tributary near Kopili", correct: false },
    { text: "Dibang — another name of Kameng", correct: false },
  ], `${seed}:cp004-v2-dibang-options`);
  const options = rows.map((row) => row.text);
  const correctIndex = rows.findIndex((row) => row.correct);
  const explanation = "The Dibang joins the Siang/Dihang in the upper Brahmaputra system. Together with the Lohit, it contributes to the name transition to Brahmaputra downstream.";
  assertKnowledgeQuestionValid({ stem: "Which of the following pairs is correctly matched?", explanation, options, correctIndex, canonicalAnswer: answer });
  return {
    questionId: `GEO-RIV-001-CP004-V2-GEO-RIV-001-QL-032-${seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP004",
    qlId: "GEO-RIV-001-QL-032",
    qlName: "Correct pair",
    difficulty: "Medium",
    stem: "Which of the following pairs is correctly matched?",
    options,
    correctIndex,
    canonicalAnswer: answer,
    explanation,
    sourceIds: [fact.source.sourceId],
    sourceFactIds: [fact.factId],
    solverAuthority: "RELATION_CLASS_COMPOSER",
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function reviseInherited(question: GeoRiv001Cp004ReviewQuestion): GeoRiv001Cp004ReviewQuestion {
  let stem = question.stem;
  let explanation = question.explanation;
  if (/Chema Yundung Glacier is associated with the source of which river\?/i.test(stem)) {
    stem = "Chema Yundung Glacier is the conventional source glacier of which river?";
    explanation = "Chema Yundung Glacier is the conventional source-glacier association for the Brahmaputra mainstream.";
  }
  if (question.canonicalAnswer === "Teesta — rises in Sikkim" && question.qlId === "GEO-RIV-001-QL-032") {
    explanation = "The Teesta rises in Sikkim and later joins the Brahmaputra/Jamuna system in Bangladesh.";
  }
  return {
    ...question,
    questionId: question.questionId.replace("CP004-V1", "CP004-V2"),
    stem,
    explanation,
  };
}

export function generateGeoRiv001Cp004ReviewV2(qlId: string, seed: string): GeoRiv001Cp004ReviewQuestion {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP004 V2 review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-032") {
    const match = seed.match(/(\d+)$/);
    if (match && Number(match[1]) % 7 === 0) return dibangCorrectPair(seed);
  }
  return reviseInherited(generateGeoRiv001Cp004ReviewV1(qlId, seed));
}
