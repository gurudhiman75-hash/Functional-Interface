import {
  generateIdenticalFigureReviewQuestionV1,
  type IdenticalFigureLanguageV1,
  type IdenticalFigureQlIdV1,
} from "./identical-figure-review-runtime-v1";

export type { IdenticalFigureLanguageV1, IdenticalFigureQlIdV1 };

function hash32(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(text: string): string {
  return `idf-v1-1-${hash32(text).toString(16).padStart(8, "0")}`;
}

/**
 * V1 generated correct numbered-bank semantics, but the nested figure's white
 * canvas was painted after each number and obscured most of the 1..9 label.
 * Paint a compact clean label plate last so numbering remains fully readable
 * without touching the semantic figure state or answer construction.
 */
function paintNumberLabelsAboveArtwork(svg: string): string {
  const labels = Array.from({ length: 9 }, (_, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = col * 92;
    const y = row * 92;
    return `<g data-idf-number-label="${index + 1}"><rect x="${x + 4}" y="${y + 4}" width="14" height="14" rx="1.5" fill="white" stroke="none"/><text x="${x + 7}" y="${y + 15}" font-size="10" font-family="Arial" font-weight="700" fill="#111827">${index + 1}</text></g>`;
  }).join("");
  if (!svg.endsWith("</svg>")) throw new Error("IDF-001 V1.1 expected an SVG question bank.");
  return svg.replace("</svg>", `<g data-idf-number-overlay="true">${labels}</g></svg>`);
}

function naturalExplanation(
  language: IdenticalFigureLanguageV1,
  base: ReturnType<typeof generateIdenticalFigureReviewQuestionV1>,
) {
  const groups = base.explanation.groupTable
    .map((row, index) => `${index + 1}: (${row.members}) — ${row.reason}`)
    .join("; ");
  const failures = base.solveFacts.distractorFailures
    .map((failure) => `${failure.option}: (${failure.mixedGroup.join(", ")})`)
    .join("; ");

  if (language === "hi") {
    return Object.freeze({
      observation: `पहले देखें कि किन तीन आकृतियों में एक ही मुख्य गुण या संबंध बना रहता है। सही समूह हैं: ${groups}।`,
      rule: "हर क्रमांकित आकृति का केवल एक बार उपयोग होना चाहिए और किसी भी समूह की तीनों आकृतियों में एक ही निर्णायक गुण या संबंध होना चाहिए।",
      application: `विकल्प ${base.answer} में तीनों समूह इस नियम को पूरा करते हैं। आकृतियाँ अलग जगह या दिशा में हो सकती हैं, लेकिन समूह बनाने वाला मुख्य गुण नहीं बदलता।`,
      check: `बाकी विकल्पों में कम-से-कम एक गलत मिश्रित समूह बनता है (${failures})। इसलिए विकल्प ${base.answer} ही सही है।`,
      groupTable: base.explanation.groupTable,
      solutionSvg: base.explanation.solutionSvg,
    });
  }

  if (language === "pa") {
    return Object.freeze({
      observation: `ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਕਿਹੜੀਆਂ ਤਿੰਨ ਆਕ੍ਰਿਤੀਆਂ ਵਿੱਚ ਇੱਕੋ ਮੁੱਖ ਗੁਣ ਜਾਂ ਸੰਬੰਧ ਬਣਿਆ ਰਹਿੰਦਾ ਹੈ। ਸਹੀ ਗਰੁੱਪ ਹਨ: ${groups}।`,
      rule: "ਹਰ ਨੰਬਰ ਵਾਲੀ ਆਕ੍ਰਿਤੀ ਸਿਰਫ਼ ਇੱਕ ਵਾਰ ਵਰਤੀ ਜਾਵੇ ਅਤੇ ਇੱਕ ਗਰੁੱਪ ਦੀਆਂ ਤਿੰਨਾਂ ਆਕ੍ਰਿਤੀਆਂ ਵਿੱਚ ਇੱਕੋ ਨਿਰਣਾਇਕ ਗੁਣ ਜਾਂ ਸੰਬੰਧ ਹੋਵੇ।",
      application: `ਵਿਕਲਪ ${base.answer} ਵਿੱਚ ਤਿੰਨੇ ਗਰੁੱਪ ਇਹ ਨਿਯਮ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਆਕ੍ਰਿਤੀਆਂ ਦੀ ਥਾਂ ਜਾਂ ਦਿਸ਼ਾ ਬਦਲ ਸਕਦੀ ਹੈ, ਪਰ ਗਰੁੱਪ ਬਣਾਉਣ ਵਾਲਾ ਮੁੱਖ ਗੁਣ ਨਹੀਂ ਬਦਲਦਾ।`,
      check: `ਬਾਕੀ ਵਿਕਲਪਾਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਗਲਤ ਮਿਲਿਆ-ਜੁਲਿਆ ਗਰੁੱਪ ਬਣਦਾ ਹੈ (${failures})। ਇਸ ਲਈ ਵਿਕਲਪ ${base.answer} ਹੀ ਸਹੀ ਹੈ।`,
      groupTable: base.explanation.groupTable,
      solutionSvg: base.explanation.solutionSvg,
    });
  }

  return Object.freeze({
    observation: `First identify the one feature or relation that stays common within each set of three. The correct groups are ${groups}.`,
    rule: "Use every numbered figure exactly once. All three figures in a group must share the same defining feature or relation.",
    application: `Option ${base.answer} satisfies the rule in all three groups. A figure may move or turn, but the feature that defines its group must stay the same.`,
    check: `Every other option contains at least one mixed group whose members do not follow one common rule (${failures}). Therefore option ${base.answer} is the only correct answer.`,
    groupTable: base.explanation.groupTable,
    solutionSvg: base.explanation.solutionSvg,
  });
}

export function generateIdenticalFigureReviewQuestionV1_1(input: Readonly<{
  qlId: IdenticalFigureQlIdV1;
  seed: string;
  language: IdenticalFigureLanguageV1;
}>) {
  const base = generateIdenticalFigureReviewQuestionV1(input);
  const stimulusSvg = paintNumberLabelsAboveArtwork(base.stimulusSvg);
  const explanation = naturalExplanation(input.language, base);
  const presentationFingerprint = fingerprint(`${base.geometryFingerprint}|${stimulusSvg}`);
  const contentFingerprint = fingerprint(`${base.contentFingerprint}|${presentationFingerprint}|${explanation.observation}|${explanation.rule}|${explanation.application}|${explanation.check}`);

  return Object.freeze({
    ...base,
    version: "SPA-IDF-001-REVIEW-QUESTION-V1.1" as const,
    stimulusSvg,
    explanation,
    contentFingerprint,
    presentationFingerprint,
    validation: Object.freeze({
      ...base.validation,
      numberLabelsPaintedAboveArtwork: true as const,
      allNineNumberLabelsVisibleByConstruction: true as const,
      explanationUsesLearnerFacingLanguage: true as const,
    }),
  });
}
