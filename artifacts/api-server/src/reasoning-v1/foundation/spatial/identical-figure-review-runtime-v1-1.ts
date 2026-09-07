import {
  generateIdenticalFigureReviewQuestionV1,
  type IdenticalFigureLanguageV1,
  type IdenticalFigureQlIdV1,
} from "./identical-figure-review-runtime-v1";

export type { IdenticalFigureLanguageV1, IdenticalFigureQlIdV1 };

type BaseQuestionV1 = ReturnType<typeof generateIdenticalFigureReviewQuestionV1>;
type GroupRowV1 = BaseQuestionV1["explanation"]["groupTable"][number];

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

function parseFirstMember(row: GroupRowV1): string {
  return row.members.split(",")[0]?.trim() || "1";
}

function learnerKeyLabel(semanticKey: string, language: IdenticalFigureLanguageV1): string {
  const [family, value] = semanticKey.split(":");
  const outer = {
    CIRCLE: { en: "outer circle", hi: "बाहरी वृत्त", pa: "ਬਾਹਰੀ ਵ੍ਰਿੱਤ" },
    SQUARE: { en: "outer square", hi: "बाहरी वर्ग", pa: "ਬਾਹਰੀ ਵਰਗ" },
    TRIANGLE: { en: "outer triangle", hi: "बाहरी त्रिभुज", pa: "ਬਾਹਰੀ ਤਿਕੋਣ" },
  } as const;
  const inner = {
    DOT: { en: "central dot", hi: "केंद्रीय बिंदु", pa: "ਕੇਂਦਰੀ ਬਿੰਦੂ" },
    CROSS: { en: "central cross", hi: "केंद्रीय क्रॉस", pa: "ਕੇਂਦਰੀ ਕਰਾਸ" },
    DIAMOND: { en: "central diamond", hi: "केंद्रीय हीरे का चिन्ह", pa: "ਕੇਂਦਰੀ ਹੀਰੇ ਦਾ ਨਿਸ਼ਾਨ" },
  } as const;
  const partition = {
    NONE: { en: "no internal dividing lines", hi: "कोई आंतरिक विभाजन रेखा नहीं", pa: "ਕੋਈ ਅੰਦਰੂਨੀ ਵੰਡ ਰੇਖਾ ਨਹੀਂ" },
    PLUS: { en: "the same + internal division", hi: "समान + आंतरिक विभाजन", pa: "ਇੱਕੋ + ਅੰਦਰੂਨੀ ਵੰਡ" },
    X: { en: "the same × internal division", hi: "समान × आंतरिक विभाजन", pa: "ਇੱਕੋ × ਅੰਦਰੂਨੀ ਵੰਡ" },
  } as const;
  const topology = {
    CONTAINED: { en: "one shape fully inside the other", hi: "एक आकृति पूरी तरह दूसरी के अंदर", pa: "ਇੱਕ ਆਕ੍ਰਿਤੀ ਪੂਰੀ ਤਰ੍ਹਾਂ ਦੂਜੀ ਦੇ ਅੰਦਰ" },
    PARTIAL_OVERLAP: { en: "partial overlap", hi: "आंशिक अतिव्यापन", pa: "ਅੰਸ਼ਿਕ ਓਵਰਲੈਪ" },
    CROSSING: { en: "crossing intersection", hi: "एक-दूसरे को काटती आकृतियाँ", pa: "ਇੱਕ-ਦੂਜੇ ਨੂੰ ਕੱਟਦੀਆਂ ਆਕ੍ਰਿਤੀਆਂ" },
  } as const;

  if (family === "OUTER" && value in outer) return outer[value as keyof typeof outer][language];
  if (family === "INNER" && value in inner) return inner[value as keyof typeof inner][language];
  if (family === "PARTITION" && value in partition) return partition[value as keyof typeof partition][language];
  if (family === "TOPOLOGY" && value in topology) return topology[value as keyof typeof topology][language];
  if (semanticKey.startsWith("TRANSFORM:ROTATION_ONLY:")) {
    return language === "en" ? "the same endpoint-mark arrangement after rotation" : language === "hi" ? "घुमाने पर वही सिरा-चिह्न विन्यास" : "ਘੁੰਮਾਉਣ ਤੇ ਉਹੀ ਸਿਰਾ-ਨਿਸ਼ਾਨ ਬਣਤਰ";
  }
  if (semanticKey.startsWith("TRANSFORM:ROTATION_OR_REFLECTION:")) {
    return language === "en" ? "the same endpoint-mark arrangement after rotation/reflection" : language === "hi" ? "घुमाव/दर्पण-प्रतिबिंब पर वही सिरा-चिह्न विन्यास" : "ਘੁੰਮਾਓ/ਦਰਪਣ-ਪਰਛਾਵੇਂ ਨਾਲ ਉਹੀ ਸਿਰਾ-ਨਿਸ਼ਾਨ ਬਣਤਰ";
  }
  return language === "en" ? "the same defining relation" : language === "hi" ? "एक ही निर्णायक संबंध" : "ਇੱਕੋ ਨਿਰਣਾਇਕ ਸੰਬੰਧ";
}

function polishedReason(row: GroupRowV1, language: IdenticalFigureLanguageV1): string {
  const key = learnerKeyLabel(row.semanticKey, language);
  const first = parseFirstMember(row);
  if (row.semanticKey.startsWith("TRANSFORM:ROTATION_ONLY:")) {
    return language === "en"
      ? `all match Figure ${first} by rotation only`
      : language === "hi"
        ? `सभी आकृतियाँ केवल घुमाने पर आकृति ${first} से मेल खाती हैं`
        : `ਸਾਰੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਕੇਵਲ ਘੁੰਮਾਉਣ ਨਾਲ ਆਕ੍ਰਿਤੀ ${first} ਨਾਲ ਮਿਲਦੀਆਂ ਹਨ`;
  }
  if (row.semanticKey.startsWith("TRANSFORM:ROTATION_OR_REFLECTION:")) {
    return language === "en"
      ? `all match Figure ${first} by rotation or mirror reflection`
      : language === "hi"
        ? `सभी आकृतियाँ घुमाव या दर्पण-प्रतिबिंब पर आकृति ${first} से मेल खाती हैं`
        : `ਸਾਰੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਘੁੰਮਾਓ ਜਾਂ ਦਰਪਣ-ਪਰਛਾਵੇਂ ਨਾਲ ਆਕ੍ਰਿਤੀ ${first} ਨਾਲ ਮਿਲਦੀਆਂ ਹਨ`;
  }
  return language === "en"
    ? `all show ${key}`
    : language === "hi"
      ? `सभी में ${key} है`
      : `ਸਾਰਿਆਂ ਵਿੱਚ ${key} ਹੈ`;
}

function polishedGroupTable(language: IdenticalFigureLanguageV1, base: BaseQuestionV1) {
  return Object.freeze(base.explanation.groupTable.map((row) => Object.freeze({
    ...row,
    reason: polishedReason(row, language),
  })));
}

function failureDescriptions(language: IdenticalFigureLanguageV1, base: BaseQuestionV1): string {
  const keyByNumber = new Map(base.solveFacts.semanticKeysByFigure.map((row) => [row.number, row.key] as const));
  return base.solveFacts.distractorFailures.map((failure) => {
    const labels = [...new Set(failure.mixedGroup.map((number) => learnerKeyLabel(keyByNumber.get(number) ?? "", language)))];
    if (language === "hi") return `${failure.option}: समूह (${failure.mixedGroup.join(", ")}) में ${labels.join(" और ")} मिल गए हैं`;
    if (language === "pa") return `${failure.option}: ਗਰੁੱਪ (${failure.mixedGroup.join(", ")}) ਵਿੱਚ ${labels.join(" ਅਤੇ ")} ਮਿਲੇ ਹੋਏ ਹਨ`;
    return `${failure.option}: group (${failure.mixedGroup.join(", ")}) mixes ${labels.join(" and ")}`;
  }).join(language === "en" ? "; " : "; ");
}

function naturalExplanation(
  language: IdenticalFigureLanguageV1,
  base: BaseQuestionV1,
) {
  const rows = polishedGroupTable(language, base);
  const groups = rows
    .map((row, index) => `${index + 1}: (${row.members}) — ${row.reason}`)
    .join("; ");
  const failures = failureDescriptions(language, base);
  const rotationOnly = base.solveFacts.transformPolicy === "ROTATION_ONLY";

  if (language === "hi") {
    const rule = base.qlId === "SPA-QL-061"
      ? "सभी 9 आकृतियों का एक-एक बार उपयोग करें। समूह बनाते समय उस गुण पर ध्यान दें जो तीनों में समान रहता है—बाहरी आकृति, बीच का चिन्ह या अंदर की विभाजन रेखाएँ।"
      : base.qlId === "SPA-QL-062"
        ? "सभी 9 आकृतियों का एक-एक बार उपयोग करें। कौन-सी आकृतियाँ बनी हैं, यह बदल सकता है; समूह दो आकृतियों के आपसी संबंध—अंदर, आंशिक ओवरलैप या काटने—से बनेगा।"
        : rotationOnly
          ? "सभी 9 आकृतियों का एक-एक बार उपयोग करें। सिरों के बिंदु, छोटी रेखा और तीर का क्रम केवल घुमाने पर वही रहना चाहिए; दर्पण-प्रतिबिंब मान्य नहीं है।"
          : "सभी 9 आकृतियों का एक-एक बार उपयोग करें। सिरों के बिंदु, छोटी रेखा और तीर का विन्यास घुमाव या दर्पण-प्रतिबिंब के बाद समान हो सकता है।";
    const application = base.qlId === "SPA-QL-061"
      ? `विकल्प ${base.answer} में तीनों समूहों के भीतर एक साफ साझा गुण मिलता है और कोई आकृति दोबारा उपयोग नहीं हुई।`
      : base.qlId === "SPA-QL-062"
        ? `विकल्प ${base.answer} में हर समूह एक ही आपसी संबंध रखता है, भले ही वृत्त, वर्ग या त्रिभुज बदल जाए।`
        : `विकल्प ${base.answer} में हर समूह की तीनों आकृतियाँ प्रश्न में बताई गई रूपांतरण-शर्त के अनुसार एक-दूसरे से मेल खाती हैं।`;
    return Object.freeze({
      observation: `पहले तीन-तीन आकृतियों में दोहरने वाला संबंध पहचानें। सही समूह हैं: ${groups}।`,
      rule,
      application,
      check: `बाकी विकल्प कम-से-कम एक समूह में नियम तोड़ते हैं: ${failures}। इसलिए विकल्प ${base.answer} ही सही है।`,
      groupTable: rows,
      solutionSvg: base.explanation.solutionSvg,
    });
  }

  if (language === "pa") {
    const rule = base.qlId === "SPA-QL-061"
      ? "ਸਾਰੀਆਂ 9 ਆਕ੍ਰਿਤੀਆਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਵਾਰ ਵਰਤੋ। ਗਰੁੱਪ ਬਣਾਉਂਦੇ ਸਮੇਂ ਉਹ ਗੁਣ ਵੇਖੋ ਜੋ ਤਿੰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਰਹਿੰਦਾ ਹੈ—ਬਾਹਰੀ ਆਕ੍ਰਿਤੀ, ਵਿਚਕਾਰਲਾ ਨਿਸ਼ਾਨ ਜਾਂ ਅੰਦਰਲੀ ਵੰਡ ਰੇਖਾ।"
      : base.qlId === "SPA-QL-062"
        ? "ਸਾਰੀਆਂ 9 ਆਕ੍ਰਿਤੀਆਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਵਾਰ ਵਰਤੋ। ਵਰਤੀਆਂ ਆਕ੍ਰਿਤੀਆਂ ਬਦਲ ਸਕਦੀਆਂ ਹਨ; ਗਰੁੱਪ ਦੋ ਆਕ੍ਰਿਤੀਆਂ ਦੇ ਆਪਸੀ ਸੰਬੰਧ—ਅੰਦਰ, ਅੰਸ਼ਿਕ ਓਵਰਲੈਪ ਜਾਂ ਕੱਟਣ—ਅਨੁਸਾਰ ਬਣੇਗਾ।"
        : rotationOnly
          ? "ਸਾਰੀਆਂ 9 ਆਕ੍ਰਿਤੀਆਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਵਾਰ ਵਰਤੋ। ਸਿਰਿਆਂ ਦੇ ਬਿੰਦੂ, ਛੋਟੀ ਰੇਖਾ ਅਤੇ ਤੀਰ ਦਾ ਕ੍ਰਮ ਕੇਵਲ ਘੁੰਮਾਉਣ ਨਾਲ ਇੱਕੋ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ; ਦਰਪਣ-ਪਰਛਾਵਾਂ ਮੰਨਿਆ ਨਹੀਂ ਜਾਵੇਗਾ।"
          : "ਸਾਰੀਆਂ 9 ਆਕ੍ਰਿਤੀਆਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਵਾਰ ਵਰਤੋ। ਸਿਰਿਆਂ ਦੇ ਬਿੰਦੂ, ਛੋਟੀ ਰੇਖਾ ਅਤੇ ਤੀਰ ਦੀ ਬਣਤਰ ਘੁੰਮਾਓ ਜਾਂ ਦਰਪਣ-ਪਰਛਾਵੇਂ ਤੋਂ ਬਾਅਦ ਇੱਕੋ ਹੋ ਸਕਦੀ ਹੈ।";
    const application = base.qlId === "SPA-QL-061"
      ? `ਵਿਕਲਪ ${base.answer} ਵਿੱਚ ਹਰ ਗਰੁੱਪ ਦੇ ਤਿੰਨਾਂ ਮੈਂਬਰਾਂ ਵਿੱਚ ਇੱਕ ਸਾਫ਼ ਸਾਂਝਾ ਗੁਣ ਹੈ ਅਤੇ ਕੋਈ ਆਕ੍ਰਿਤੀ ਦੁਬਾਰਾ ਨਹੀਂ ਵਰਤੀ ਗਈ।`
      : base.qlId === "SPA-QL-062"
        ? `ਵਿਕਲਪ ${base.answer} ਵਿੱਚ ਹਰ ਗਰੁੱਪ ਇੱਕੋ ਆਪਸੀ ਸੰਬੰਧ ਰੱਖਦਾ ਹੈ, ਭਾਵੇਂ ਵ੍ਰਿੱਤ, ਵਰਗ ਜਾਂ ਤਿਕੋਣ ਬਦਲ ਜਾਣ।`
        : `ਵਿਕਲਪ ${base.answer} ਵਿੱਚ ਹਰ ਗਰੁੱਪ ਦੀਆਂ ਤਿੰਨਾਂ ਆਕ੍ਰਿਤੀਆਂ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਰੂਪਾਂਤਰ-ਸ਼ਰਤ ਅਨੁਸਾਰ ਇੱਕ-ਦੂਜੇ ਨਾਲ ਮਿਲਦੀਆਂ ਹਨ।`;
    return Object.freeze({
      observation: `ਪਹਿਲਾਂ ਤਿੰਨ-ਤਿੰਨ ਆਕ੍ਰਿਤੀਆਂ ਵਿੱਚ ਦੁਹਰਾਉਂਦਾ ਸੰਬੰਧ ਪਛਾਣੋ। ਸਹੀ ਗਰੁੱਪ ਹਨ: ${groups}।`,
      rule,
      application,
      check: `ਬਾਕੀ ਵਿਕਲਪ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਗਰੁੱਪ ਵਿੱਚ ਨਿਯਮ ਤੋੜਦੇ ਹਨ: ${failures}। ਇਸ ਲਈ ਵਿਕਲਪ ${base.answer} ਹੀ ਸਹੀ ਹੈ।`,
      groupTable: rows,
      solutionSvg: base.explanation.solutionSvg,
    });
  }

  const rule = base.qlId === "SPA-QL-061"
    ? "Use all nine figures once. Group by the feature that stays the same within each set—outer shape, central mark, or internal division—not by every decorative detail."
    : base.qlId === "SPA-QL-062"
      ? "Use all nine figures once. Group by the relationship between the two shapes—contained, partly overlapping, or crossing—even when the actual shape types change."
      : rotationOnly
        ? "Use all nine figures once. The endpoint dots, ticks and arrow must keep the same cyclic order after rotation; a mirror image does not count."
        : "Use all nine figures once. The endpoint dots, ticks and arrow may match after rotation or mirror reflection, as stated in the question.";
  const application = base.qlId === "SPA-QL-061"
    ? `Option ${base.answer} forms three clean sets with one repeated feature in each set, and every numbered figure is used exactly once.`
    : base.qlId === "SPA-QL-062"
      ? `Option ${base.answer} keeps one topology relation within each group even though the circle, square and triangle combinations change.`
      : `In option ${base.answer}, all three figures in each group reduce to the same endpoint-mark arrangement under the allowed transformation.`;

  return Object.freeze({
    observation: `Look for the relation that repeats within each set of three. The correct groups are ${groups}.`,
    rule,
    application,
    check: `The other options each break the grouping rule at least once: ${failures}. Therefore option ${base.answer} is the only complete grouping.`,
    groupTable: rows,
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
      explanationNamesFamilySpecificRule: true as const,
      distractorCheckNamesActualMismatch: true as const,
    }),
  });
}
