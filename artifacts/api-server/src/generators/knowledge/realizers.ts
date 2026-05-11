import {
  buildDistractorOptions,
  buildMatchRows,
} from "./distractors";
import type {
  KnowledgeFact,
  KnowledgeLanguage,
  KnowledgeLocalizedBundle,
  KnowledgeQuestionMode,
} from "./types";

const PHRASES = {
  en: {
    direct: "Which of the following is correctly associated with {entity}?",
    reverse: "{fact} is associated with which of the following?",
    fill: "{entity} is associated with ____.",
    match: "Match the following pairs correctly.",
    chronology: "Arrange the following in the correct chronological/order sequence.",
    assertion: "Consider the assertion and reason based on the given fact.",
    explanation:
      "Fact check: {entity} → {fact}. {detail}\nDid You Know: {didYouKnow}",
  },
  hi: {
    direct: "{entity} से सही रूप से संबंधित विकल्प कौन-सा है?",
    reverse: "{fact} निम्नलिखित में से किससे संबंधित है?",
    fill: "{entity} का संबंध ____ से है।",
    match: "निम्नलिखित युग्मों का सही मिलान कीजिए।",
    chronology: "निम्नलिखित को सही कालक्रम/क्रम में व्यवस्थित कीजिए।",
    assertion: "दिए गए तथ्य के आधार पर कथन और कारण पर विचार कीजिए।",
    explanation:
      "तथ्य जाँच: {entity} → {fact}. {detail}\nक्या आप जानते हैं: {didYouKnow}",
  },
  pa: {
    direct: "{entity} ਨਾਲ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਸੰਬੰਧਿਤ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",
    reverse: "{fact} ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?",
    fill: "{entity} ਦਾ ਸੰਬੰਧ ____ ਨਾਲ ਹੈ।",
    match: "ਹੇਠ ਲਿਖੇ ਜੋੜਿਆਂ ਦਾ ਸਹੀ ਮਿਲਾਨ ਕਰੋ।",
    chronology: "ਹੇਠ ਲਿਖਿਆਂ ਨੂੰ ਸਹੀ ਕਾਲਕ੍ਰਮ/ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।",
    assertion: "ਦਿੱਤੇ ਤੱਥ ਦੇ ਆਧਾਰ ਤੇ ਕਥਨ ਅਤੇ ਕਾਰਨ ਤੇ ਵਿਚਾਰ ਕਰੋ।",
    explanation:
      "ਤੱਥ ਜਾਂਚ: {entity} → {fact}. {detail}\nਕੀ ਤੁਸੀਂ ਜਾਣਦੇ ਹੋ: {didYouKnow}",
  },
} as const;

function format(
  template: string,
  values: Record<string, string>,
) {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key: string) => values[key] ?? "",
  );
}

function didYouKnow(
  fact: KnowledgeFact,
  language: KnowledgeLanguage,
) {
  if (fact.pyqMetadata?.wasAsked) {
    const first =
      fact.pyqMetadata.occurrences[0];
    if (language === "hi") {
      return `यह तथ्य पहले ${first?.exam ?? "परीक्षा"} ${first?.year ?? ""} में पूछा जा चुका है।`;
    }
    if (language === "pa") {
      return `ਇਹ ਤੱਥ ਪਹਿਲਾਂ ${first?.exam ?? "ਪਰੀਖਿਆ"} ${first?.year ?? ""} ਵਿੱਚ ਪੁੱਛਿਆ ਜਾ ਚੁੱਕਾ ਹੈ।`;
    }
    return `This fact has appeared previously in ${first?.exam ?? "an exam"} ${first?.year ?? ""}.`;
  }

  return fact.data.detail?.[language] ??
    fact.data.detail?.en ??
    "";
}

function localizedDetail(
  fact: KnowledgeFact,
  language: KnowledgeLanguage,
) {
  return (
    fact.data.detail?.[language] ??
    fact.data.detail?.en ??
    ""
  );
}

function optionMetadata(
  options: string[],
  correct: number,
) {
  return options.map((option, index) => ({
    option,
    isCorrect: index === correct,
    distractorType:
      index === correct
        ? "Correct_Knowledge_Association"
        : "Semantic_Close_Distractor",
    rationale:
      index === correct
        ? "Matches the stored structured knowledge fact."
        : "Selected from the same semantic group/category where possible.",
  }));
}

export function realizeKnowledgeFact(
  facts: KnowledgeFact[],
  fact: KnowledgeFact,
  mode: KnowledgeQuestionMode,
  language: KnowledgeLanguage,
): KnowledgeLocalizedBundle {
  const phrase = PHRASES[language];
  const values = {
    entity: fact.data.entity[language],
    fact: fact.data.fact[language],
    detail: localizedDetail(fact, language),
    didYouKnow: didYouKnow(fact, language),
  };

  if (mode === "reverse-recall") {
    return {
      question: format(phrase.reverse, values),
      options: buildDistractorOptions(
        facts,
        fact,
        "entity",
        language,
      ),
      explanation: format(
        phrase.explanation,
        values,
      ),
    };
  }

  if (mode === "fill-blank") {
    return {
      question: format(phrase.fill, values),
      options: buildDistractorOptions(
        facts,
        fact,
        "fact",
        language,
      ),
      explanation: format(
        phrase.explanation,
        values,
      ),
    };
  }

  if (mode === "match-following") {
    const rows =
      buildMatchRows(facts, fact) ?? [fact];
    const left = rows
      .map(
        (row, index) =>
          `${index + 1}. ${row.data.entity[language]}`,
      )
      .join("\n");
    const right = [...rows]
      .reverse()
      .map(
        (row, index) =>
          `${String.fromCharCode(65 + index)}. ${row.data.fact[language]}`,
      )
      .join("\n");

    return {
      question: `${phrase.match}\n${left}\n${right}`,
      options: [
        "1-D, 2-C, 3-B, 4-A",
        "1-A, 2-B, 3-C, 4-D",
        "1-B, 2-A, 3-D, 4-C",
        "1-C, 2-D, 3-A, 4-B",
      ],
      explanation: format(
        phrase.explanation,
        values,
      ),
    };
  }

  if (mode === "chronology") {
    const rows =
      buildMatchRows(facts, fact) ?? [fact];
    const ordered = [...rows].sort(
      (a, b) =>
        (a.sequenceIndex ?? 0) -
        (b.sequenceIndex ?? 0),
    );
    const labels = rows
      .map(
        (row, index) =>
          `${String.fromCharCode(65 + index)}. ${row.data.entity[language]}`,
      )
      .join("\n");
    const correctOrder = ordered
      .map((row) =>
        String.fromCharCode(
          65 + rows.indexOf(row),
        ),
      )
      .join("-");

    return {
      question: `${phrase.chronology}\n${labels}`,
      options: [
        correctOrder,
        correctOrder.split("-").reverse().join("-"),
        [...correctOrder.split("-")]
          .sort()
          .join("-"),
        correctOrder
          .split("-")
          .slice(1)
          .concat(correctOrder.split("-")[0] ?? "")
          .join("-"),
      ],
      explanation: format(
        phrase.explanation,
        values,
      ),
    };
  }

  if (mode === "assertion-reason") {
    return {
      question: `${phrase.assertion}\nAssertion: ${fact.data.entity[language]} → ${fact.data.fact[language]}\nReason: ${localizedDetail(fact, language)}`,
      options: [
        "Both Assertion and Reason are true, and Reason explains Assertion.",
        "Both are true, but Reason does not explain Assertion.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true.",
      ],
      explanation: format(
        phrase.explanation,
        values,
      ),
    };
  }

  return {
    question: format(phrase.direct, values),
    options: buildDistractorOptions(
      facts,
      fact,
      "fact",
      language,
    ),
    explanation: format(
      phrase.explanation,
      values,
    ),
  };
}

export function buildKnowledgeOptionMetadata(
  options: string[],
  correct: number,
) {
  return optionMetadata(options, correct);
}
