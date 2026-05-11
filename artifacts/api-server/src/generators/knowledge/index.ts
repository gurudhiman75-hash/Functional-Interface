import {
  buildMatchRows,
  getSemanticDistractorFacts,
} from "./distractors";
import {
  COMPUTER_FACTS,
  STATIC_KNOWLEDGE_REPOSITORY,
  filterFacts,
  getRuntimeKnowledgeRepository,
} from "./repository";
import {
  buildKnowledgeOptionMetadata,
  realizeKnowledgeFact,
} from "./realizers";
import type {
  KnowledgeDifficulty,
  KnowledgeEngineFamily,
  KnowledgeFact,
  KnowledgePatternLike,
  KnowledgeQuestionMode,
  KnowledgeScenario,
} from "./types";

export type {
  FactExtractionCandidate,
  KnowledgeFact,
  KnowledgeFactType,
  KnowledgeLanguage,
  KnowledgeLocalizedBundle,
  KnowledgeQuestionMode,
  KnowledgeScenario,
  KnowledgeSubject,
  LocalizedText,
} from "./types";
export {
  buildFactExtractionPrompt,
  createDraftFactCandidate,
  extractFactCandidatesFromText,
  validateFactCandidate,
} from "./extraction";
export {
  approveKnowledgeFact,
  listApprovedKnowledgeFacts,
  listExtractionCandidates,
  updateExtractionCandidate,
  upsertExtractionCandidates,
} from "./extraction-store";
export {
  COMPUTER_FACTS,
  FULL_KNOWLEDGE_REPOSITORY,
  STATIC_KNOWLEDGE_REPOSITORY,
  filterFacts,
  getFactByEntityId,
  getRuntimeKnowledgeRepository,
} from "./repository";

type Difficulty =
  | "Easy"
  | "Medium"
  | "Hard";

function normalizeDifficulty(
  difficulty?: string,
): Difficulty {
  if (/hard/i.test(difficulty ?? "")) {
    return "Hard";
  }

  if (/easy/i.test(difficulty ?? "")) {
    return "Easy";
  }

  return "Medium";
}

function toRepositoryDifficulty(
  difficulty: Difficulty,
): KnowledgeDifficulty {
  if (difficulty === "Hard") return "hard";
  if (difficulty === "Easy") return "easy";
  return "moderate";
}

function hashText(value: string) {
  return [...value].reduce(
    (hash, char) =>
      (hash * 31 + char.charCodeAt(0)) %
      9973,
    17,
  );
}

function inferQuestionMode(
  pattern: KnowledgePatternLike,
  difficulty: Difficulty,
): KnowledgeQuestionMode {
  const text = [
    pattern.id,
    pattern.topic,
    pattern.subtopic,
    ...(pattern.supportedMotifs ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (/match|column|comparison/.test(text)) {
    return "match-following";
  }

  if (/chrono|sequence|order/.test(text)) {
    return "chronology";
  }

  if (/assertion|reason/.test(text)) {
    return "assertion-reason";
  }

  if (/reverse|description/.test(text)) {
    return "reverse-recall";
  }

  if (/blank|fill/.test(text)) {
    return "fill-blank";
  }

  if (difficulty === "Hard") {
    return "reverse-recall";
  }

  return "recall";
}

function inferFilters(
  facts: KnowledgeFact[],
  pattern: KnowledgePatternLike,
) {
  const text = [
    pattern.id,
    pattern.topic,
    pattern.subtopic,
    ...(pattern.supportedMotifs ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (/park|environment/.test(text)) {
    return filterFacts(facts, {
      topic: "Environment",
      reviewedOnly: true,
    });
  }
  if (/power|river|punjab/.test(text)) {
    return filterFacts(facts, {
      subject: "Punjab GK",
      reviewedOnly: true,
    });
  }
  if (/pol|article|constitution/.test(text)) {
    return filterFacts(facts, {
      topic: "Polity",
      reviewedOnly: true,
    });
  }
  if (/his|battle|modern/.test(text)) {
    return filterFacts(facts, {
      topic: "History",
      reviewedOnly: true,
    });
  }
  if (/hardware|cpu|memory/.test(text)) {
    return filterFacts(facts, {
      topic: "Hardware",
      reviewedOnly: true,
    });
  }
  if (/internet|network/.test(text)) {
    return filterFacts(facts, {
      topic: "Internet",
      reviewedOnly: true,
    });
  }
  if (/security|malware/.test(text)) {
    return filterFacts(facts, {
      topic: "Security",
      reviewedOnly: true,
    });
  }

  return facts.filter(
    (fact) => fact.verification.reviewed,
  );
}

function pickFact(
  facts: KnowledgeFact[],
  pattern: KnowledgePatternLike,
  difficulty: Difficulty,
) {
  const pool =
    inferFilters(facts, pattern).filter(
      (fact) =>
        fact.difficulty ===
          toRepositoryDifficulty(difficulty) ||
        difficulty === "Medium",
    );
  const candidates = pool.length
    ? pool
    : inferFilters(facts, pattern);
  const safePool = candidates.length
    ? candidates
    : facts;

  return safePool[
    hashText(
      `${pattern.id}:${pattern.topic}:${pattern.subtopic}:${difficulty}`,
    ) % safePool.length
  ]!;
}

function correctIndexForMode(
  mode: KnowledgeQuestionMode,
) {
  return mode === "chronology" ||
    mode === "match-following"
    ? 0
    : 0;
}

function buildReasoningSteps(
  fact: KnowledgeFact,
  mode: KnowledgeQuestionMode,
) {
  return [
    `Retrieve structured fact ${fact.factId} from the knowledge repository.`,
    `Use semantic group ${fact.contextGroupId} and fact type ${fact.factType} for the question mode ${mode}.`,
    "Build distractors from the same group/category or curated distractor pool.",
    "Realize the same fact independently in English, Hindi, and Punjabi.",
  ];
}

function makeScenario(
  engine: KnowledgeEngineFamily,
  facts: KnowledgeFact[],
  pattern: KnowledgePatternLike,
): KnowledgeScenario {
  const difficulty =
    normalizeDifficulty(
      pattern.difficulty,
    );
  const fact = pickFact(
    facts,
    pattern,
    difficulty,
  );
  const mode = inferQuestionMode(
    pattern,
    difficulty,
  );
  const content = {
    en: realizeKnowledgeFact(
      facts,
      fact,
      mode,
      "en",
    ),
    hi: realizeKnowledgeFact(
      facts,
      fact,
      mode,
      "hi",
    ),
    pa: realizeKnowledgeFact(
      facts,
      fact,
      mode,
      "pa",
    ),
  };
  const correct = correctIndexForMode(mode);
  const matchRows =
    mode === "match-following"
      ? buildMatchRows(facts, fact)
      : undefined;
  const matchMatrix = matchRows
    ? {
        left: matchRows.map(
          (row) => row.data.entity.en,
        ),
        right: [...matchRows]
          .reverse()
          .map((row) => row.data.fact.en),
        answerKey: Object.fromEntries(
          matchRows.map((row) => [
            row.data.entity.en,
            row.data.fact.en,
          ]),
        ),
      }
    : undefined;
  const closeDistractors =
    getSemanticDistractorFacts(
      facts,
      fact,
      3,
    );

  return {
    id: `${engine}-${fact.factId}-${mode}`,
    engine,
    mode,
    stem: content.en.question,
    options: content.en.options,
    correct,
    explanation: content.en.explanation,
    reasoningSteps:
      buildReasoningSteps(fact, mode),
    ruleApplied:
      "Structured multilingual knowledge repository with semantic distractor retrieval",
    category: `${fact.subject}:${fact.topic}:${fact.subtopic}`,
    difficulty,
    structuralSignature: [
      engine,
      fact.factType,
      fact.contextGroupId,
      mode,
      fact.factId,
    ].join(":"),
    factSnapshot: fact,
    logic: {
      source: "knowledge-repository",
      factId: fact.factId,
      entityId: fact.entityId,
      factType: fact.factType,
      contextGroupId:
        fact.contextGroupId,
      mode,
      subject: fact.subject,
      topic: fact.topic,
      subtopic: fact.subtopic,
      answerKey:
        content.en.options[correct] ?? "",
    },
    content,
    matchMatrix,
    optionMetadata:
      buildKnowledgeOptionMetadata(
        content.en.options,
        correct,
      ).map((metadata, index) => ({
        ...metadata,
        rationale:
          index === correct
            ? `Correct for fact ${fact.factId}.`
            : `Close trap from ${
                closeDistractors[index - 1]
                  ?.contextGroupId ??
                fact.contextGroupId
              }.`,
      })),
  };
}

export class GeneralKnowledgeEngine {
  generate(
    pattern: KnowledgePatternLike,
  ) {
    return makeScenario(
      "GeneralKnowledgeEngine",
      getRuntimeKnowledgeRepository(),
      pattern,
    );
  }
}

export class ComputerAwarenessEngine {
  generate(
    pattern: KnowledgePatternLike,
  ) {
    return makeScenario(
      "ComputerAwarenessEngine",
      COMPUTER_FACTS,
      pattern,
    );
  }
}

export function createGeneralKnowledgeScenario(
  pattern: KnowledgePatternLike,
) {
  return new GeneralKnowledgeEngine().generate(
    pattern,
  );
}

export function createComputerAwarenessScenario(
  pattern: KnowledgePatternLike,
) {
  return new ComputerAwarenessEngine().generate(
    pattern,
  );
}
