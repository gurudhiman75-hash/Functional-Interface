import {
  generateDotSituationReviewQuestionV1,
  type DotSituationLanguageV1,
} from "./dot-situation-review-runtime-v1";

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  return `dot-${hash32(text).toString(16).padStart(8, "0")}`;
}

function stemFor(language: DotSituationLanguageV1, variant: number, dotCount: number): string {
  const singular = dotCount === 1;
  const en = singular
    ? [
        "Study the position of the dot in the question figure. In which option can the dot be placed so that its relation to all the figures remains unchanged?",
        "Which alternative provides a region corresponding exactly to the position of the dot in the question figure?",
        "Select the option in which the dot can be placed with the same inside-outside relation to the figures as in the question figure.",
      ]
    : [
        "Study the positions of the dots in the question figure. In which option can all the dots be placed so that their relations to the figures remain unchanged?",
        "Choose the alternative that provides corresponding regions for all the dots shown in the question figure.",
        "Select the option in which every dot can be placed with the same inside-outside relation to the figures as in the question figure.",
      ];
  const hi = singular
    ? [
        "प्रश्न आकृति में बिंदु की स्थिति ध्यान से देखिए। किस विकल्प में बिंदु को इस प्रकार रखा जा सकता है कि सभी आकृतियों के साथ उसका संबंध वही रहे?",
        "उस विकल्प को चुनिए जिसमें प्रश्न आकृति के बिंदु के ठीक समान क्षेत्र उपलब्ध हो।",
        "किस विकल्प में बिंदु को आकृतियों के साथ उसी अंदर-बाहर संबंध में रखा जा सकता है जैसा प्रश्न आकृति में है?",
      ]
    : [
        "प्रश्न आकृति में सभी बिंदुओं की स्थितियाँ ध्यान से देखिए। किस विकल्प में सभी बिंदुओं को इस प्रकार रखा जा सकता है कि आकृतियों के साथ उनके संबंध वही रहें?",
        "उस विकल्प को चुनिए जिसमें प्रश्न आकृति के सभी बिंदुओं के लिए समान क्षेत्र उपलब्ध हों।",
        "किस विकल्प में प्रत्येक बिंदु को आकृतियों के साथ उसी अंदर-बाहर संबंध में रखा जा सकता है जैसा प्रश्न आकृति में है?",
      ];
  const pa = singular
    ? [
        "ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਬਿੰਦੂ ਦੀ ਸਥਿਤੀ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਬਿੰਦੂ ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ ਕਿ ਸਾਰੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਨਾਲ ਉਸਦਾ ਸੰਬੰਧ ਉਹੀ ਰਹੇ?",
        "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਦੇ ਬਿੰਦੂ ਦੇ ਬਿਲਕੁਲ ਸਮਾਨ ਖੇਤਰ ਮੌਜੂਦ ਹੋਵੇ।",
        "ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਬਿੰਦੂ ਨੂੰ ਆਕ੍ਰਿਤੀਆਂ ਨਾਲ ਉਸੇ ਅੰਦਰ-ਬਾਹਰ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ ਜੋ ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਹੈ?",
      ]
    : [
        "ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਸਾਰੇ ਬਿੰਦੂਆਂ ਦੀਆਂ ਸਥਿਤੀਆਂ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਸਾਰੇ ਬਿੰਦੂ ਇਸ ਤਰ੍ਹਾਂ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ ਕਿ ਆਕ੍ਰਿਤੀਆਂ ਨਾਲ ਉਨ੍ਹਾਂ ਦੇ ਸੰਬੰਧ ਉਹੀ ਰਹਿਣ?",
        "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਦੇ ਸਾਰੇ ਬਿੰਦੂਆਂ ਲਈ ਸਮਾਨ ਖੇਤਰ ਮੌਜੂਦ ਹੋਣ।",
        "ਕਿਹੜੇ ਵਿਕਲਪ ਵਿੱਚ ਹਰ ਬਿੰਦੂ ਨੂੰ ਆਕ੍ਰਿਤੀਆਂ ਨਾਲ ਉਸੇ ਅੰਦਰ-ਬਾਹਰ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ ਜੋ ਪ੍ਰਸ਼ਨ ਆਕ੍ਰਿਤੀ ਵਿੱਚ ਹੈ?",
      ];
  return (language === "hi" ? hi : language === "pa" ? pa : en)[variant % 3];
}

function englishList(items: readonly string[]): string {
  const withArticles = items.map((item) => `the ${item}`);
  if (withArticles.length <= 1) return withArticles[0] ?? "";
  if (withArticles.length === 2) return `${withArticles[0]} and ${withArticles[1]}`;
  return `${withArticles.slice(0, -1).join(", ")}, and ${withArticles.at(-1)}`;
}

function englishRelation(row: Readonly<{ dot: string; inside: readonly string[]; outside: readonly string[] }>): string {
  const inside = englishList(row.inside);
  const outside = englishList(row.outside);
  if (!outside) return `Dot ${row.dot} must lie inside ${inside}.`;
  return `Dot ${row.dot} must lie inside ${inside} and outside ${outside}.`;
}

export function generateDotSituationReviewQuestionV1_1(input: Readonly<{
  qlId?: "SPA-QL-054";
  seed: string;
  language: DotSituationLanguageV1;
}>) {
  const base = generateDotSituationReviewQuestionV1(input);
  const stem = stemFor(input.language, hash32(input.seed), base.solveFacts.dotCount);
  const explanation = input.language === "en"
    ? Object.freeze({
        observation: base.explanation.membershipTable.map((row) => englishRelation(row)).join(" "),
        rule: "Match the complete region-membership of every dot: note which figures contain it and which figures do not. Ignore the dot's absolute position; only these inside-outside relations matter.",
        application: `Option ${base.answer} contains a matching region for every required dot relation. The solution figure shows one valid placement of the dots in that option.`,
        check: `${base.solveFacts.distractorFailures.map((failure) => {
          const row = base.explanation.membershipTable.find((candidate) => candidate.dot === failure.dot);
          if (!row) return `Option ${failure.option} fails a required dot relation.`;
          const relation = englishRelation(row).replace(/^Dot \d+ must lie /, "").replace(/\.$/, "");
          return `Option ${failure.option} fails Dot ${failure.dot}: it has no region that is ${relation}.`;
        }).join(" ")} Therefore only option ${base.answer} satisfies all the dot conditions.`,
        membershipTable: base.explanation.membershipTable,
      })
    : base.explanation;
  const contentFingerprint = fingerprint([
    base.geometryFingerprint,
    input.language,
    stem,
    explanation.observation,
    explanation.rule,
    explanation.application,
    explanation.check,
  ].join("|"));

  return Object.freeze({
    ...base,
    version: "SPA-DOT-001-REVIEW-QUESTION-V1.1" as const,
    stem,
    explanation,
    contentFingerprint,
    validation: Object.freeze({
      ...base.validation,
      editorialStemGrammarReviewed: true as const,
      examStyleStemOverlayApplied: true as const,
    }),
  });
}
