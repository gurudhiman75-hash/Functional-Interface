import {
  deterministicShuffle,
  hashKnowledgeSeed,
} from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import { generateGeoRiv001Cp002ReviewV2 } from "./geo-riv-001-cp002-review-generator-v2";
import type { GeoRiv001Cp002ReviewQuestion } from "./geo-riv-001-cp002-review-types";

const FACTS = GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1;

function mixedPick<T>(items: readonly T[], seed: string): T {
  if (!items.length) throw new Error("CP002 V3 cannot pick from empty pool");
  const hash = hashKnowledgeSeed(seed);
  const mixed = (hash ^ (hash >>> 16) ^ (hash << 7)) >>> 0;
  return items[mixed % items.length]!;
}

function byId(factId: string) {
  const fact = FACTS.find((entry) => entry.factId === factId);
  if (!fact) throw new Error(`Missing CP002 V3 fact ${factId}`);
  return fact;
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return [...new Set(facts.map((fact) => fact.source.sourceId))];
}

function optionsFor(correct: string, pool: readonly string[], seed: string) {
  const distractors = deterministicShuffle(
    [...new Set(pool.filter((value) => value !== correct))],
    `${seed}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP002 V3 requires three distractors for ${correct}`);
  const records = deterministicShuffle(
    [
      { text: correct, correct: true },
      ...distractors.map((text) => ({ text, correct: false })),
    ],
    `${seed}:options`,
  );
  return {
    options: records.map((record) => record.text),
    correctIndex: records.findIndex((record) => record.correct),
  };
}

type Ql013Mode = {
  id: string;
  stem: string;
  answer: string;
  explanation: string;
  facts: KnowledgeFact[];
  pool: string[];
  difficulty: GeoRiv001Cp002ReviewQuestion["difficulty"];
};

const PLACE_POOL = ["Tandi", "Trimmu", "Harike", "Panjnad", "below Leh", "Skardu"];

function ql013Modes(): Ql013Mode[] {
  const formation = byId("geo-riv-001-cp002-chenab-formed-chandra-bhaga");
  const tandi = byId("geo-riv-001-cp002-chenab-formation-tandi");
  const jhelumPlace = byId("geo-riv-001-cp002-jhelum-chenab-confluence-trimmu");
  const jhelumJoin = byId("geo-riv-001-cp002-jhelum-joins-chenab-trimmu");
  const beasPlace = byId("geo-riv-001-cp002-beas-satluj-confluence-harike");
  const beasJoin = byId("geo-riv-001-cp002-beas-joins-satluj");
  const satlujPlace = byId("geo-riv-001-cp002-satluj-chenab-confluence-panjnad");
  const satlujJoin = byId("geo-riv-001-cp002-satluj-joins-chenab-panjnad");

  return [
    {
      id: "formation-pair",
      stem: "Which two rivers join to form the Chenab River?",
      answer: "Chandra and Bhaga",
      explanation: "The Chandra and Bhaga rivers meet at Tandi and form the Chenab, also called Chandrabhaga.",
      facts: [formation, tandi],
      pool: ["Chandra and Bhaga", "Ravi and Beas", "Jhelum and Ravi", "Spiti and Beas"],
      difficulty: "Medium",
    },
    {
      id: "tandi",
      stem: "At which place do the Chandra and Bhaga rivers meet to form the Chenab?",
      answer: "Tandi",
      explanation: "The Chandra and Bhaga rivers meet at Tandi in Himachal Pradesh to form the Chenab.",
      facts: [formation, tandi],
      pool: PLACE_POOL,
      difficulty: "Medium",
    },
    {
      id: "trimmu",
      stem: "At which place does the Jhelum join the Chenab?",
      answer: "Trimmu",
      explanation: "The Jhelum joins the Chenab at Trimmu.",
      facts: [jhelumPlace, jhelumJoin],
      pool: PLACE_POOL,
      difficulty: "Hard",
    },
    {
      id: "harike",
      stem: "At which place does the Beas join the Satluj?",
      answer: "Harike",
      explanation: "The Beas joins the Satluj at Harike.",
      facts: [beasPlace, beasJoin],
      pool: PLACE_POOL,
      difficulty: "Medium",
    },
    {
      id: "panjnad",
      stem: "At which place does the Satluj join the Chenab?",
      answer: "Panjnad",
      explanation: "The Satluj joins the Chenab at Panjnad.",
      facts: [satlujPlace, satlujJoin],
      pool: PLACE_POOL,
      difficulty: "Hard",
    },
  ];
}

export function generateGeoRiv001Cp002Ql013V3(seed: string) {
  const mode = mixedPick(ql013Modes(), `${seed}:ql013-mode`);
  const optionData = optionsFor(mode.answer, mode.pool, `${seed}:${mode.id}`);
  assertKnowledgeQuestionValid({
    stem: mode.stem,
    explanation: mode.explanation,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer: mode.answer,
  });
  return {
    questionId: `GEO-RIV-001-CP002-V3-GEO-RIV-001-QL-013-${seed}`,
    chapterId: "GEO-RIV-001" as const,
    cpId: "GEO-RIV-001-CP002" as const,
    qlId: "GEO-RIV-001-QL-013",
    qlName: "Confluence and formation",
    difficulty: mode.difficulty,
    stem: mode.stem,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer: mode.answer,
    explanation: mode.explanation,
    sourceIds: sourceIds(mode.facts),
    sourceFactIds: [...new Set(mode.facts.map((fact) => fact.factId))],
    solverAuthority: "RELATION_CLASS_COMPOSER" as const,
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  } satisfies GeoRiv001Cp002ReviewQuestion;
}

export function generateGeoRiv001Cp002ReviewV3(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP002 V3 review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-013") return generateGeoRiv001Cp002Ql013V3(seed);
  const base = generateGeoRiv001Cp002ReviewV2(qlId, seed);
  return {
    ...base,
    questionId: base.questionId.replace(/CP002-V2/g, "CP002-V3"),
  };
}
