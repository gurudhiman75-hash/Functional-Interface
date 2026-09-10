import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp003-editorial-review-v1";
import { generateGeoRiv001Cp003ReviewV1 } from "./geo-riv-001-cp003-review-generator-v1";
import type { GeoRiv001Cp003ReviewQuestion } from "./geo-riv-001-cp003-review-types";

const FACTS = GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1;

function byId(id: string) {
  const fact = FACTS.find((entry) => entry.factId === `geo-riv-001-cp003-${id}`);
  if (!fact) throw new Error(`Missing CP003 V2 fact ${id}`);
  return fact;
}

function unique<T>(items: readonly T[]) {
  return [...new Set(items)];
}

function sourceIds(facts: readonly KnowledgeFact[]) {
  return unique(facts.map((fact) => fact.source.sourceId));
}

function optionsFor(correct: string, pool: readonly string[], seed: string) {
  const distractors = deterministicShuffle(
    unique(pool.filter((value) => value !== correct)),
    `${seed}:distractors`,
  ).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP003 V2 requires three distractors for ${correct}`);
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

function finalizeQl021(args: {
  seed: string;
  stem: string;
  answer: string;
  pool: readonly string[];
  explanation: string;
  facts: readonly KnowledgeFact[];
  difficulty?: GeoRiv001Cp003ReviewQuestion["difficulty"];
  solverAuthority?: GeoRiv001Cp003ReviewQuestion["solverAuthority"];
}) {
  const optionData = optionsFor(args.answer, args.pool, `${args.seed}:ql021-v2`);
  assertKnowledgeQuestionValid({
    stem: args.stem,
    explanation: args.explanation,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer: args.answer,
  });
  return {
    questionId: `GEO-RIV-001-CP003-V2-GEO-RIV-001-QL-021-${args.seed}`,
    chapterId: "GEO-RIV-001" as const,
    cpId: "GEO-RIV-001-CP003" as const,
    qlId: "GEO-RIV-001-QL-021",
    qlName: "Tributary and bank-side identification",
    difficulty: args.difficulty ?? "Medium",
    stem: args.stem,
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer: args.answer,
    explanation: args.explanation,
    sourceIds: sourceIds(args.facts),
    sourceFactIds: unique(args.facts.map((fact) => fact.factId)),
    solverAuthority: args.solverAuthority ?? "CANONICAL_FACT_RELATION",
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  } satisfies GeoRiv001Cp003ReviewQuestion;
}

const PARENT_MODES = [
  ["Chambal", "Yamuna", "chambal-yamuna", "Medium"],
  ["Betwa", "Yamuna", "betwa-yamuna", "Medium"],
  ["Ken", "Yamuna", "ken-yamuna", "Medium"],
  ["Dhauliganga", "Alaknanda", "dhauliganga-alaknanda", "Medium"],
  ["Nandakini", "Alaknanda", "nandakini-alaknanda", "Medium"],
  ["Pindar", "Alaknanda", "pindar-alaknanda", "Medium"],
  ["Mandakini", "Alaknanda", "mandakini-alaknanda", "Medium"],
  ["Ramganga", "Ganga", "ramganga-ganga", "Easy"],
  ["Gomti", "Ganga", "gomti-ganga", "Easy"],
  ["Ghaghara", "Ganga", "ghaghara-ganga", "Easy"],
  ["Gandak", "Ganga", "gandak-ganga", "Easy"],
  ["Kosi", "Ganga", "kosi-ganga", "Easy"],
  ["Sone", "Ganga", "sone-ganga", "Easy"],
] as const;

const LEFT_BANK = ["Ramganga", "Gomti", "Ghaghara", "Gandak", "Kosi"] as const;
const RIGHT_BANK = ["Yamuna", "Sone"] as const;
const BANK_FACT_IDS = [
  "yamuna-ganga-bank",
  "ramganga-ganga-bank",
  "gomti-ganga-bank",
  "ghaghara-ganga-bank",
  "gandak-ganga-bank",
  "kosi-ganga-bank",
  "sone-ganga-bank",
  "chambal-yamuna",
] as const;

function bankQuestion(mode: "right-one" | "left-one" | "right-pair" | "left-pair", seed: string) {
  const facts = BANK_FACT_IDS.map(byId);
  if (mode === "right-one") {
    const answer = deterministicPick(RIGHT_BANK, `${seed}:answer`);
    return finalizeQl021({
      seed,
      stem: "Which of the following is a right-bank tributary of the Ganga?",
      answer,
      pool: [answer, ...LEFT_BANK],
      explanation: `${answer} joins the Ganga from its right bank.`,
      facts,
      solverAuthority: "RELATION_CLASS_COMPOSER",
    });
  }
  if (mode === "left-one") {
    const answer = deterministicPick(LEFT_BANK, `${seed}:answer`);
    return finalizeQl021({
      seed,
      stem: "Which of the following is a left-bank tributary of the Ganga?",
      answer,
      pool: [answer, ...RIGHT_BANK, "Chambal"],
      explanation: `${answer} joins the Ganga from its left bank.`,
      facts,
      solverAuthority: "RELATION_CLASS_COMPOSER",
    });
  }
  if (mode === "right-pair") {
    const answer = "Yamuna and Sone";
    return finalizeQl021({
      seed,
      stem: "Which pair consists of right-bank tributaries of the Ganga?",
      answer,
      pool: [
        answer,
        "Ramganga and Gomti",
        "Ghaghara and Gandak",
        "Kosi and Gomti",
        "Yamuna and Ghaghara",
      ],
      explanation: "Yamuna and Sone both join the Ganga from its right bank.",
      facts,
      difficulty: "Medium",
      solverAuthority: "RELATION_CLASS_COMPOSER",
    });
  }
  const answer = deterministicPick(
    ["Ramganga and Gomti", "Ghaghara and Gandak", "Gandak and Kosi"] as const,
    `${seed}:answer`,
  );
  return finalizeQl021({
    seed,
    stem: "Which pair consists only of left-bank tributaries of the Ganga?",
    answer,
    pool: [
      answer,
      "Yamuna and Sone",
      "Sone and Kosi",
      "Yamuna and Ghaghara",
      "Chambal and Gomti",
    ],
    explanation: `${answer} both join the Ganga from its left bank.`,
    facts,
    difficulty: "Medium",
    solverAuthority: "RELATION_CLASS_COMPOSER",
  });
}

export function generateGeoRiv001Cp003Ql021V2(seed: string) {
  const family = deterministicPick(["parent", "parent", "parent", "bank"] as const, `${seed}:family`);
  if (family === "bank") {
    const mode = deterministicPick(["right-one", "left-one", "right-pair", "left-pair"] as const, `${seed}:bank-mode`);
    return bankQuestion(mode, seed);
  }
  const [river, parent, factId, difficulty] = deterministicPick(PARENT_MODES, `${seed}:parent-mode`);
  return finalizeQl021({
    seed,
    stem: `${river} is a tributary of which river?`,
    answer: parent,
    pool: ["Ganga", "Yamuna", "Alaknanda", "Ghaghara", "Gandak"],
    explanation: `${river} is a tributary of the ${parent}.`,
    facts: [byId(factId)],
    difficulty,
  });
}

const PAIR_FACT_SENTENCE: Record<string, string> = {
  Bhagirathi: "Bhagirathi originates from Gangotri Glacier.",
  Yamuna: "Yamuna originates from Yamunotri Glacier.",
  Sone: "Sone rises in the Amarkantak plateau region.",
  Kosi: "Kosi is known as the Sorrow of Bihar.",
  Gandak: "Gandak is also known as Narayani.",
  Ghaghara: "Ghaghara is known as Karnali in its upper course.",
  Dhauliganga: "Dhauliganga joins the Alaknanda at Vishnuprayag.",
  Nandakini: "Nandakini joins the Alaknanda at Nandprayag.",
  Pindar: "Pindar joins the Alaknanda at Karnaprayag.",
  Mandakini: "Mandakini joins the Alaknanda at Rudraprayag.",
  Ramganga: "Ramganga joins the Ganga near Kannauj.",
  Gomti: "Gomti joins the Ganga at Audihar.",
  Ganga: "The Ganga enters the Gangetic Plains at Haridwar.",
};

function statementPairConclusion(answer: string) {
  if (answer === "Both Statement I and Statement II are correct") return "Hence, both statements are correct.";
  if (answer === "Only Statement I is correct") return "Hence, only Statement I is correct.";
  if (answer === "Only Statement II is correct") return "Hence, only Statement II is correct.";
  return "Hence, neither statement is correct.";
}

function reviseInherited(question: GeoRiv001Cp003ReviewQuestion): GeoRiv001Cp003ReviewQuestion {
  let explanation = question.explanation;

  if (question.qlId === "GEO-RIV-001-QL-023" || question.qlId === "GEO-RIV-001-QL-024") {
    const river = question.canonicalAnswer.split(" — ")[0]?.trim() ?? "";
    const factSentence = PAIR_FACT_SENTENCE[river];
    if (!factSentence) throw new Error(`CP003 V2 missing pair explanation for ${river}`);
    explanation = question.qlId.endsWith("023")
      ? factSentence
      : `This pair is incorrect. ${factSentence}`;
  }

  if (question.qlId === "GEO-RIV-001-QL-026") {
    const base = explanation.replace(/\s+Hence,.*$/i, "").trim();
    explanation = `${base} ${statementPairConclusion(question.canonicalAnswer)}`;
  }

  if (question.qlId === "GEO-RIV-001-QL-019" && question.canonicalAnswer === "Gandak") {
    explanation = "The Gandak is also known as Narayani.";
  }
  if (question.qlId === "GEO-RIV-001-QL-020" && question.canonicalAnswer === "Gandak") {
    explanation = "Narayani is another name used for the Gandak.";
  }

  return {
    ...question,
    questionId: question.questionId.replace(/CP003-V1/g, "CP003-V2"),
    explanation,
  };
}

export function generateGeoRiv001Cp003ReviewV2(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP003 V2 review generation requires an explicit seed");
  if (qlId === "GEO-RIV-001-QL-021") return generateGeoRiv001Cp003Ql021V2(seed);
  return reviseInherited(generateGeoRiv001Cp003ReviewV1(qlId, seed));
}
