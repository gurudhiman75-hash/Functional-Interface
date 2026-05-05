import type {
  Scenario,
} from "./domain-adapters";
import type {
  ExtractedPatternIntelligence,
} from "./pattern-extractors";
import type {
  StructuralSignature,
} from "./structural-signatures";
import type {
  GeneratedQuestion,
} from "./generator-engine";
import type {
  CorpusAlignmentScore,
} from "./corpus-alignment";

export type OriginalityScore = {
  score: number;
  penalties: string[];
  diagnostics: string[];
};

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function round(
  value: number,
  digits = 2,
) {
  return Number(value.toFixed(digits));
}

function normalizeText(
  value: string,
) {
  return value
    .toLowerCase()
    .replace(/\d+/g, "#")
    .replace(/\b[a-z][a-z]+\b/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function getPrimaryQuestion(
  question?: GeneratedQuestion,
) {
  if (!question) {
    return undefined;
  }

  return "questionType" in question &&
    question.questionType === "di"
    ? question.questions[0]
    : question;
}

function getNormalizedClueTemplates(
  question?: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  return (
    primaryQuestion?.debugMetadata
      ?.generatedClues ?? []
  ).map(normalizeText);
}

function getRepeatedTemplateRatio(
  templates: string[],
) {
  if (!templates.length) {
    return 0;
  }

  const frequencies =
    templates.reduce(
      (accumulator, template) => {
        accumulator[template] =
          (accumulator[template] ?? 0) + 1;
        return accumulator;
      },
      {} as Record<string, number>,
    );
  const repeatedCount = Object.values(
    frequencies,
  ).reduce(
    (sum, count) =>
      sum + Math.max(0, count - 1),
    0,
  );

  return repeatedCount / templates.length;
}

function getFormulaCompositionPenalty(
  scenario: Scenario,
  extracted: ExtractedPatternIntelligence,
) {
  if (
    extracted.domain !== "quant" &&
    extracted.domain !== "di"
  ) {
    return 0;
  }

  const expressions =
    scenario.constraints
      .map((constraint) =>
        normalizeText(
          constraint.expression ?? "",
        ),
      )
      .filter(Boolean);

  if (!expressions.length) {
    return 0;
  }

  return getRepeatedTemplateRatio(
    expressions,
  );
}

function getDistractorOrderingPenalty(
  question?: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const distractorOrder = (
    primaryQuestion?.optionMetadata ?? []
  )
    .filter((option) => !option.isCorrect)
    .map(
      (option) =>
        option.distractorType ??
        option.reasoningTrap ??
        "generic-distractor",
    );

  return getRepeatedTemplateRatio(
    distractorOrder.map(
      normalizeText,
    ),
  );
}

function getWordingPatternPenalty(
  question?: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const normalizedQuestion =
    normalizeText(
      primaryQuestion?.text ?? "",
    );

  if (!normalizedQuestion) {
    return 0;
  }

  const clauseCount =
    normalizedQuestion.split(
      /[,;:]/,
    ).length;
  const repeatedTokens =
    getRepeatedTemplateRatio(
      normalizedQuestion.split(" "),
    );

  return clamp(
    repeatedTokens * 0.7 +
      Math.max(
        0,
        clauseCount - 4,
      ) *
        0.06,
    0,
    1,
  );
}

export function buildOriginalityScore(
  scenario: Scenario,
  extracted: ExtractedPatternIntelligence,
  signature: StructuralSignature,
  corpusAlignment: CorpusAlignmentScore,
  question?: GeneratedQuestion,
): OriginalityScore {
  const penalties: string[] = [];
  const diagnostics: string[] = [
    "PYQ-derived intelligence is treated as calibration guidance only, not as a template source.",
  ];
  const clueTemplatePenalty =
    getRepeatedTemplateRatio(
      getNormalizedClueTemplates(
        question,
      ),
    );
  const formulaPenalty =
    getFormulaCompositionPenalty(
      scenario,
      extracted,
    );
  const distractorOrderingPenalty =
    getDistractorOrderingPenalty(
      question,
    );
  const wordingPatternPenalty =
    getWordingPatternPenalty(
      question,
    );
  const corpusSimilarityPressure =
    clamp(
      Math.max(
        0,
        (corpusAlignment.score - 8.2) /
          1.8,
      ),
      0,
      1,
    );
  const motifHashPenalty =
    signature.motifHash.endsWith(
      "0",
    )
      ? 0.05
      : 0;
  const originalityBase =
    10 -
    clueTemplatePenalty * 3 -
    formulaPenalty * 2.4 -
    distractorOrderingPenalty * 2 -
    wordingPatternPenalty * 1.8 -
    corpusSimilarityPressure * 2.4 -
    motifHashPenalty;

  if (corpusSimilarityPressure > 0.45) {
    penalties.push(
      "High corpus-alignment pressure suggests the generation may be too close to PYQ-derived structural behavior.",
    );
  }

  if (clueTemplatePenalty > 0.22) {
    penalties.push(
      "Repeated clue topology or wording templates reduce originality.",
    );
  }

  if (formulaPenalty > 0.2) {
    penalties.push(
      "Formula composition appears too repetitive.",
    );
  }

  if (
    distractorOrderingPenalty > 0.24
  ) {
    penalties.push(
      "Distractor ordering looks mechanically repeated.",
    );
  }

  if (wordingPatternPenalty > 0.26) {
    penalties.push(
      "Wording normalization indicates a repeated surface template pattern.",
    );
  }

  diagnostics.push(
    `Clue topology penalty ${round(clueTemplatePenalty, 3)}, formula repetition penalty ${round(formulaPenalty, 3)}, distractor ordering penalty ${round(distractorOrderingPenalty, 3)}.`,
  );
  diagnostics.push(
    `Corpus alignment pressure ${round(corpusSimilarityPressure, 3)} while preserving topic weighting and realism guidance only.`,
  );

  return {
    score: round(
      clamp(
        originalityBase,
        0,
        10,
      ),
    ),
    penalties,
    diagnostics,
  };
}
