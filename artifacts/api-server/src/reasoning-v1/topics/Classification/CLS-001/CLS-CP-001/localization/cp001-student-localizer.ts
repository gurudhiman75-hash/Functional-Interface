import {
  CLASS_BY_ID,
  ENTITY_BY_LABEL,
} from "../semantic-dataset.en";
import type { GeneratedClsCp001EnglishQuestion } from "../cp001-runtime";
import type {
  PrototypeFamily,
  SemanticClass,
  SemanticEntity,
} from "../types";
import {
  localizedClassLabel,
  localizedEntityLabel,
  type ClsCp001TranslatedLocale,
} from "./cp001-language-pack";

export type GeneratedClsCp001LocalizedQuestion = Omit<
  GeneratedClsCp001EnglishQuestion,
  "stem" | "givens" | "options" | "optionGroups" | "answer" | "intendedClassLabel" | "evidenceByOption" | "explanation" | "metadata"
> & {
  readonly stem: string;
  readonly givens: readonly string[];
  readonly options: readonly string[];
  readonly optionGroups: readonly (readonly string[])[];
  readonly answer: string;
  readonly intendedClassLabel: string;
  readonly evidenceByOption: readonly string[];
  readonly explanation: {
    readonly coreRule: readonly string[];
    readonly optionChecks: readonly string[];
    readonly examSpeedShortcut: readonly string[];
    readonly commonTraps: readonly string[];
  };
  readonly metadata: Omit<GeneratedClsCp001EnglishQuestion["metadata"], "locale"> & {
    readonly locale: ClsCp001TranslatedLocale;
    readonly localizationVersion: "cls-cp001-localization-v2";
  };
};

const ENTITY_OVERRIDES: Readonly<Record<string, Partial<Record<ClsCp001TranslatedLocale, string>>>> = {
  Whale: { "pa-IN": "ਵ੍ਹੇਲ" },
  Bee: { "pa-IN": "ਮਧੂਮੱਖੀ" },
};

function studentEntityLabel(label: string, locale: ClsCp001TranslatedLocale): string {
  return ENTITY_OVERRIDES[label]?.[locale] ?? localizedEntityLabel(label, locale);
}

function englishEntity(label: string): SemanticEntity {
  const entity = ENTITY_BY_LABEL.get(label.trim().toLocaleLowerCase("en-IN"));
  if (!entity) throw new Error(`Unknown CLS-CP-001 displayed entity '${label}'`);
  return entity;
}

function formatList(labels: readonly string[], locale: ClsCp001TranslatedLocale): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0]!;
  const conjunction = locale === "hi-IN" ? " और " : " ਅਤੇ ";
  return `${labels.slice(0, -1).join(", ")}${conjunction}${labels.at(-1)}`;
}

function localStem(
  question: GeneratedClsCp001EnglishQuestion,
  givens: readonly string[],
  locale: ClsCp001TranslatedLocale,
): string {
  if (question.task === "SELECT_COHERENT_GROUP") {
    const hindi = [
      "उस विकल्प को चुनिए जिसमें तीनों शब्द एक ही वर्ग के हैं।",
      "किस विकल्प के तीनों शब्द एक ही समूह में आते हैं?",
      "वह शब्द-समूह चुनिए जिसके तीनों शब्द आपस में सही तरह जुड़े हैं।",
      "केवल एक विकल्प में तीनों शब्द एक ही वर्ग के हैं। उसे चुनिए।",
    ];
    const punjabi = [
      "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਦੇ ਤਿੰਨੇ ਸ਼ਬਦ ਇੱਕੋ ਵਰਗ ਦੇ ਹਨ।",
      "ਕਿਹੜੇ ਵਿਕਲਪ ਦੇ ਤਿੰਨੇ ਸ਼ਬਦ ਇੱਕੋ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ ਹਨ?",
      "ਉਹ ਸ਼ਬਦ-ਸਮੂਹ ਚੁਣੋ ਜਿਸ ਦੇ ਤਿੰਨੇ ਸ਼ਬਦ ਆਪਸ ਵਿੱਚ ਠੀਕ ਤਰ੍ਹਾਂ ਜੁੜਦੇ ਹਨ।",
      "ਕੇਵਲ ਇੱਕ ਵਿਕਲਪ ਦੇ ਤਿੰਨੇ ਸ਼ਬਦ ਇੱਕੋ ਵਰਗ ਦੇ ਹਨ। ਉਹ ਚੁਣੋ।",
    ];
    const templates = locale === "hi-IN" ? hindi : punjabi;
    return templates[question.seed % templates.length]!;
  }

  if (question.task === "SELECT_CLASS_MEMBER") {
    const group = formatList(givens, locale);
    const hindi = [
      `${group} एक ही वर्ग के हैं। उसी वर्ग का एक और शब्द चुनिए।`,
      `${group} का साझा समूह पहचानिए और उसी समूह वाला विकल्प चुनिए।`,
      `कौन-सा विकल्प ${group} के साथ रखा जा सकता है?`,
      `${group} जैसे वर्ग का एक और सदस्य चुनिए।`,
    ];
    const punjabi = [
      `${group} ਇੱਕੋ ਵਰਗ ਦੇ ਹਨ। ਇਸੇ ਵਰਗ ਦਾ ਇੱਕ ਹੋਰ ਸ਼ਬਦ ਚੁਣੋ।`,
      `${group} ਦਾ ਸਾਂਝਾ ਸਮੂਹ ਪਛਾਣੋ ਅਤੇ ਉਸੇ ਸਮੂਹ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`,
      `ਕਿਹੜਾ ਵਿਕਲਪ ${group} ਦੇ ਨਾਲ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ?`,
      `${group} ਵਰਗਾ ਇੱਕ ਹੋਰ ਮੈਂਬਰ ਚੁਣੋ।`,
    ];
    const templates = locale === "hi-IN" ? hindi : punjabi;
    return templates[question.seed % templates.length]!;
  }

  const hindi = [
    "इनमें से अलग शब्द चुनिए।",
    "कौन-सा शब्द बाकी शब्दों के समूह में नहीं आता?",
    "अधिकांश शब्द एक ही वर्ग के हैं। अलग शब्द पहचानिए।",
    "निम्नलिखित में से विषम (अलग) शब्द चुनिए।",
  ];
  const punjabi = [
    "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।",
    "ਕਿਹੜਾ ਸ਼ਬਦ ਬਾਕੀ ਸ਼ਬਦਾਂ ਦੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ?",
    "ਜ਼ਿਆਦਾਤਰ ਸ਼ਬਦ ਇੱਕੋ ਵਰਗ ਦੇ ਹਨ। ਵੱਖਰਾ ਸ਼ਬਦ ਪਛਾਣੋ।",
    "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਸ਼ਬਦ ਚੁਣੋ।",
  ];
  const templates = locale === "hi-IN" ? hindi : punjabi;
  return templates[question.seed % templates.length]!;
}

function bestAlternativeClass(entity: SemanticEntity, intendedClassId: string): SemanticClass | null {
  const candidates = [...new Set([...entity.directClassIds, ...entity.classIds])]
    .filter((classId) => classId !== intendedClassId)
    .map((classId) => CLASS_BY_ID.get(classId))
    .filter((value): value is SemanticClass => Boolean(value))
    .filter((semanticClass) => semanticClass.qualityRank >= 90)
    .sort((left, right) =>
      right.qualityRank - left.qualityRank
      || right.hierarchyDepth - left.hierarchyDepth
      || left.classId.localeCompare(right.classId),
    );
  return candidates[0] ?? null;
}

function quickMethod(
  family: PrototypeFamily,
  task: GeneratedClsCp001EnglishQuestion["task"],
  locale: ClsCp001TranslatedLocale,
): string {
  if (locale === "hi-IN") {
    if (task === "SELECT_COHERENT_GROUP") return "हर विकल्प को अलग जाँचिए: क्या उसके तीनों शब्द एक ही समूह में आते हैं?";
    if (task === "SELECT_CLASS_MEMBER") return "पहले दिए गए शब्दों का समूह पहचानिए, फिर उसी समूह वाला विकल्प चुनिए।";
    if (family === "PART_WHOLE") return "पूछिए: हर शब्द किस बड़ी चीज़ का भाग है?";
    if (family === "FUNCTIONAL_USE") return "पूछिए: हर वस्तु का मुख्य उपयोग क्या है?";
    if (family === "HIERARCHY_CATEGORY") return "पहले बड़ा समूह पहचानिए, फिर देखें कि अधिकतर शब्द कोई छोटा साफ समूह बनाते हैं या नहीं।";
    if (family === "CROSS_CUTTING_CATEGORY") return "वह एक साफ समानता खोजिए जो अधिकतर शब्दों को जोड़ती है।";
    return "पहले साझा वर्ग का नाम सोचिए; उससे बाहर वाला शब्द उत्तर होगा।";
  }

  if (task === "SELECT_COHERENT_GROUP") return "ਹਰ ਵਿਕਲਪ ਨੂੰ ਵੱਖਰਾ ਜਾਂਚੋ: ਕੀ ਉਸ ਦੇ ਤਿੰਨੇ ਸ਼ਬਦ ਇੱਕੋ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ ਹਨ?";
  if (task === "SELECT_CLASS_MEMBER") return "ਪਹਿਲਾਂ ਦਿੱਤੇ ਸ਼ਬਦਾਂ ਦਾ ਸਮੂਹ ਪਛਾਣੋ, ਫਿਰ ਉਸੇ ਸਮੂਹ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।";
  if (family === "PART_WHOLE") return "ਪੁੱਛੋ: ਹਰ ਸ਼ਬਦ ਕਿਸ ਵੱਡੀ ਚੀਜ਼ ਦਾ ਹਿੱਸਾ ਹੈ?";
  if (family === "FUNCTIONAL_USE") return "ਪੁੱਛੋ: ਹਰ ਚੀਜ਼ ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?";
  if (family === "HIERARCHY_CATEGORY") return "ਪਹਿਲਾਂ ਵੱਡਾ ਸਮੂਹ ਪਛਾਣੋ, ਫਿਰ ਵੇਖੋ ਕਿ ਜ਼ਿਆਦਾਤਰ ਸ਼ਬਦ ਕੋਈ ਛੋਟਾ ਸਾਫ਼ ਸਮੂਹ ਬਣਾਉਂਦੇ ਹਨ ਜਾਂ ਨਹੀਂ।";
  if (family === "CROSS_CUTTING_CATEGORY") return "ਉਹ ਇੱਕ ਸਾਫ਼ ਸਾਂਝ ਲੱਭੋ ਜੋ ਜ਼ਿਆਦਾਤਰ ਸ਼ਬਦਾਂ ਨੂੰ ਜੋੜਦੀ ਹੈ।";
  return "ਪਹਿਲਾਂ ਸਾਂਝੇ ਵਰਗ ਦਾ ਨਾਮ ਸੋਚੋ; ਉਸ ਤੋਂ ਬਾਹਰ ਵਾਲਾ ਸ਼ਬਦ ਜਵਾਬ ਹੋਵੇਗਾ।";
}

function trapLine(
  question: GeneratedClsCp001EnglishQuestion,
  locale: ClsCp001TranslatedLocale,
): string {
  if (locale === "hi-IN") {
    if (question.family === "PART_WHOLE") return "सिर्फ बनावट या आकार न देखें; यह देखें कि शब्द किस बड़ी चीज़ का भाग है।";
    if (question.family === "FUNCTIONAL_USE") return "हर सम्भव उपयोग न गिनें; वस्तु के मुख्य उपयोग को देखें।";
    if (question.family === "HIERARCHY_CATEGORY" || question.generationProfile === "HIERARCHY_CLASS_MEMBER") {
      return "बहुत बड़े समूह पर न रुकें; छोटा और साफ समूह चुनें।";
    }
    if (question.family === "CROSS_CUTTING_CATEGORY") {
      return "किसी एक अतिरिक्त गुण से भ्रमित न हों; वह समानता लें जो अधिकतर शब्दों को साफ जोड़ती है।";
    }
    return "सिर्फ रंग, आकार या स्थान की हल्की समानता पर उत्तर न चुनें।";
  }

  if (question.family === "PART_WHOLE") return "ਸਿਰਫ਼ ਬਣਾਵਟ ਜਾਂ ਆਕਾਰ ਨਾ ਵੇਖੋ; ਇਹ ਵੇਖੋ ਕਿ ਸ਼ਬਦ ਕਿਸ ਵੱਡੀ ਚੀਜ਼ ਦਾ ਹਿੱਸਾ ਹੈ।";
  if (question.family === "FUNCTIONAL_USE") return "ਹਰ ਸੰਭਵ ਵਰਤੋਂ ਨਾ ਗਿਣੋ; ਚੀਜ਼ ਦੇ ਮੁੱਖ ਕੰਮ ਨੂੰ ਵੇਖੋ।";
  if (question.family === "HIERARCHY_CATEGORY" || question.generationProfile === "HIERARCHY_CLASS_MEMBER") {
    return "ਬਹੁਤ ਵੱਡੇ ਸਮੂਹ ਉੱਤੇ ਨਾ ਰੁਕੋ; ਛੋਟਾ ਅਤੇ ਸਾਫ਼ ਸਮੂਹ ਚੁਣੋ।";
  }
  if (question.family === "CROSS_CUTTING_CATEGORY") {
    return "ਕਿਸੇ ਇੱਕ ਵਾਧੂ ਗੁਣ ਕਰਕੇ ਨਾ ਭੁੱਲੋ; ਉਹ ਸਾਂਝ ਲਓ ਜੋ ਜ਼ਿਆਦਾਤਰ ਸ਼ਬਦਾਂ ਨੂੰ ਸਾਫ਼ ਜੋੜਦੀ ਹੈ।";
  }
  return "ਸਿਰਫ਼ ਰੰਗ, ਆਕਾਰ ਜਾਂ ਥਾਂ ਦੀ ਹਲਕੀ ਸਮਾਨਤਾ ਦੇ ਆਧਾਰ ਤੇ ਜਵਾਬ ਨਾ ਚੁਣੋ।";
}

type NearMiss = {
  readonly optionIndex: number;
  readonly matchingEnglishLabels: readonly [string, string];
  readonly outsiderEnglishLabel: string;
  readonly semanticClass: SemanticClass;
};

function bestNearMiss(question: GeneratedClsCp001EnglishQuestion): NearMiss | null {
  let best: NearMiss | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const [optionIndex, group] of question.optionGroups.entries()) {
    if (optionIndex === question.correctIndex || group.length !== 3) continue;
    const entities = group.map(englishEntity);
    const pairs: readonly (readonly [number, number, number])[] = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 2, 0],
    ];

    for (const [leftIndex, rightIndex, outsiderIndex] of pairs) {
      const left = entities[leftIndex]!;
      const right = entities[rightIndex]!;
      const outsider = entities[outsiderIndex]!;
      const shared = left.classIds
        .filter((classId) => right.classIds.includes(classId) && !outsider.classIds.includes(classId))
        .map((classId) => CLASS_BY_ID.get(classId))
        .filter((value): value is SemanticClass => Boolean(value))
        .filter((semanticClass) => semanticClass.qualityRank >= 90)
        .sort((leftClass, rightClass) =>
          rightClass.qualityRank - leftClass.qualityRank
          || rightClass.hierarchyDepth - leftClass.hierarchyDepth,
        )[0];
      if (!shared) continue;
      const score = shared.qualityRank * 10 + shared.hierarchyDepth;
      if (score <= bestScore) continue;
      bestScore = score;
      best = {
        optionIndex,
        matchingEnglishLabels: [left.label, right.label],
        outsiderEnglishLabel: outsider.label,
        semanticClass: shared,
      };
    }
  }
  return best;
}

function nearMissTrap(
  question: GeneratedClsCp001EnglishQuestion,
  locale: ClsCp001TranslatedLocale,
): string {
  const nearMiss = bestNearMiss(question);
  if (!nearMiss) {
    return locale === "hi-IN"
      ? "केवल दो शब्द मिलने से समूह सही नहीं हो जाता; तीनों शब्द साथ होने चाहिए।"
      : "ਸਿਰਫ਼ ਦੋ ਸ਼ਬਦ ਮਿਲਣ ਨਾਲ ਸਮੂਹ ਸਹੀ ਨਹੀਂ ਬਣਦਾ; ਤਿੰਨੇ ਸ਼ਬਦ ਇਕੱਠੇ ਮਿਲਣੇ ਚਾਹੀਦੇ ਹਨ।";
  }

  const matching = nearMiss.matchingEnglishLabels.map((label) => studentEntityLabel(label, locale));
  const outsider = studentEntityLabel(nearMiss.outsiderEnglishLabel, locale);
  const classLabel = localizedClassLabel(nearMiss.semanticClass.classId, locale);
  const optionLetter = String.fromCharCode(65 + nearMiss.optionIndex);

  return locale === "hi-IN"
    ? `विकल्प ${optionLetter} से न उलझें: ${formatList(matching, locale)} ${classLabel} हैं, लेकिन ${outsider} उस समूह को तोड़ देता है।`
    : `ਵਿਕਲਪ ${optionLetter} ਨਾਲ ਨਾ ਉਲਝੋ: ${formatList(matching, locale)} ${classLabel} ਹਨ, ਪਰ ${outsider} ਉਸ ਸਮੂਹ ਨੂੰ ਤੋੜ ਦਿੰਦਾ ਹੈ।`;
}

function evidenceLines(
  question: GeneratedClsCp001EnglishQuestion,
  localizedOptions: readonly string[],
  localizedGroups: readonly (readonly string[])[],
  locale: ClsCp001TranslatedLocale,
): string[] {
  const classLabel = localizedClassLabel(question.intendedClassId, locale);
  if (question.task === "SELECT_COHERENT_GROUP") {
    return localizedGroups.map((group, index) => {
      const display = group.join(", ");
      if (index === question.correctIndex) {
        return locale === "hi-IN"
          ? `${display}: तीनों शब्द ${classLabel} हैं।`
          : `${display}: ਤਿੰਨੇ ਸ਼ਬਦ ${classLabel} ਹਨ।`;
      }
      return locale === "hi-IN"
        ? `${display}: तीनों शब्द एक ही समूह में नहीं आते।`
        : `${display}: ਤਿੰਨੇ ਸ਼ਬਦ ਇੱਕੋ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ।`;
    });
  }

  return question.options.map((englishLabel, index) => {
    const member = englishEntity(englishLabel).classIds.includes(question.intendedClassId);
    const label = localizedOptions[index]!;
    if (locale === "hi-IN") {
      return member ? `${label}: साझा वर्ग में आता है।` : `${label}: साझा वर्ग में नहीं आता।`;
    }
    return member ? `${label}: ਸਾਂਝੇ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।` : `${label}: ਸਾਂਝੇ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।`;
  });
}

function buildExplanation(
  question: GeneratedClsCp001EnglishQuestion,
  localizedGivens: readonly string[],
  localizedOptions: readonly string[],
  localizedGroups: readonly (readonly string[])[],
  locale: ClsCp001TranslatedLocale,
): GeneratedClsCp001LocalizedQuestion["explanation"] {
  const classLabel = localizedClassLabel(question.intendedClassId, locale);
  const answer = localizedOptions[question.correctIndex]!;

  if (question.task === "SELECT_COHERENT_GROUP") {
    const correctGroup = localizedGroups[question.correctIndex]!;
    const optionLetter = String.fromCharCode(65 + question.correctIndex);
    return {
      coreRule: [
        locale === "hi-IN"
          ? `सही विकल्प में तीनों शब्द एक ही साफ समूह—${classLabel}—के होने चाहिए।`
          : `ਸਹੀ ਵਿਕਲਪ ਦੇ ਤਿੰਨੇ ਸ਼ਬਦ ਇੱਕੋ ਸਾਫ਼ ਸਮੂਹ—${classLabel}—ਦੇ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।`,
      ],
      optionChecks: locale === "hi-IN"
        ? [
          `${formatList(correctGroup, locale)} — ये तीनों ${classLabel} हैं।`,
          "बाकी विकल्पों में कम-से-कम एक शब्द अलग समूह का है।",
          `इसलिए विकल्प ${optionLetter} (${answer}) सही है।`,
        ]
        : [
          `${formatList(correctGroup, locale)} — ਇਹ ਤਿੰਨੇ ${classLabel} ਹਨ।`,
          "ਬਾਕੀ ਵਿਕਲਪਾਂ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਬਦ ਵੱਖਰੇ ਸਮੂਹ ਦਾ ਹੈ।",
          `ਇਸ ਲਈ ਵਿਕਲਪ ${optionLetter} (${answer}) ਸਹੀ ਹੈ।`,
        ],
      examSpeedShortcut: [quickMethod(question.family, question.task, locale)],
      commonTraps: [nearMissTrap(question, locale)],
    };
  }

  if (question.task === "SELECT_CLASS_MEMBER") {
    const group = formatList(localizedGivens, locale);
    return {
      coreRule: [
        locale === "hi-IN"
          ? `दिए गए शब्द ${classLabel} हैं; उसी समूह का एक और सदस्य चुनना है।`
          : `ਦਿੱਤੇ ਸ਼ਬਦ ${classLabel} ਹਨ; ਉਸੇ ਸਮੂਹ ਦਾ ਇੱਕ ਹੋਰ ਮੈਂਬਰ ਚੁਣਨਾ ਹੈ।`,
      ],
      optionChecks: locale === "hi-IN"
        ? [
          `${group} — ये सभी ${classLabel} हैं।`,
          `${answer} भी इसी समूह में आता है; बाकी विकल्प नहीं आते।`,
          `इसलिए ${answer} सही उत्तर है।`,
        ]
        : [
          `${group} — ਇਹ ਸਾਰੇ ${classLabel} ਹਨ।`,
          `${answer} ਵੀ ਇਸੇ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦਾ ਹੈ; ਬਾਕੀ ਵਿਕਲਪ ਨਹੀਂ ਆਉਂਦੇ।`,
          `ਇਸ ਲਈ ${answer} ਸਹੀ ਜਵਾਬ ਹੈ।`,
        ],
      examSpeedShortcut: [quickMethod(question.family, question.task, locale)],
      commonTraps: [trapLine(question, locale)],
    };
  }

  const positive = localizedOptions.filter((_, index) => index !== question.correctIndex);
  const answerEntity = englishEntity(question.answer);
  const alternativeClass = bestAlternativeClass(answerEntity, question.intendedClassId);
  const alternativeLabel = alternativeClass
    ? localizedClassLabel(alternativeClass.classId, locale)
    : null;

  return {
    coreRule: [
      locale === "hi-IN"
        ? `अधिकांश शब्द ${classLabel} हैं; एक शब्द अलग समूह का है।`
        : `ਜ਼ਿਆਦਾਤਰ ਸ਼ਬਦ ${classLabel} ਹਨ; ਇੱਕ ਸ਼ਬਦ ਵੱਖਰੇ ਸਮੂਹ ਦਾ ਹੈ।`,
    ],
    optionChecks: locale === "hi-IN"
      ? [
        `${formatList(positive, locale)} — ये सभी ${classLabel} हैं।`,
        alternativeLabel
          ? `${answer} का संबंध ${alternativeLabel} से है, इसलिए यह इस समूह में नहीं आता।`
          : `${answer} इस समूह में नहीं आता।`,
        `इसलिए ${answer} विषम (अलग) शब्द है।`,
      ]
      : [
        `${formatList(positive, locale)} — ਇਹ ਸਾਰੇ ${classLabel} ਹਨ।`,
        alternativeLabel
          ? `${answer} ਦਾ ਸਬੰਧ ${alternativeLabel} ਨਾਲ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਸ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।`
          : `${answer} ਇਸ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।`,
        `ਇਸ ਲਈ ${answer} ਵੱਖਰਾ ਸ਼ਬਦ ਹੈ।`,
      ],
    examSpeedShortcut: [quickMethod(question.family, question.task, locale)],
    commonTraps: [trapLine(question, locale)],
  };
}

export function localizeClsCp001Question(
  question: GeneratedClsCp001EnglishQuestion,
  locale: ClsCp001TranslatedLocale,
): GeneratedClsCp001LocalizedQuestion {
  const givens = question.givens.map((label) => studentEntityLabel(label, locale));
  const optionGroups = question.optionGroups.map((group) =>
    group.map((label) => studentEntityLabel(label, locale)),
  );
  const options = question.task === "SELECT_COHERENT_GROUP"
    ? optionGroups.map((group) => group.join(", "))
    : question.options.map((label) => studentEntityLabel(label, locale));
  const answer = options[question.correctIndex]!;

  if (new Set(options).size !== options.length) {
    throw new Error(`${question.qlId}/${question.seed}/${locale} produced duplicate localized options`);
  }
  if (optionGroups.some((group) => new Set(group).size !== group.length)) {
    throw new Error(`${question.qlId}/${question.seed}/${locale} produced a duplicate word inside a localized group`);
  }

  const explanation = buildExplanation(question, givens, options, optionGroups, locale);

  return {
    ...question,
    stem: localStem(question, givens, locale),
    givens,
    options,
    optionGroups,
    answer,
    intendedClassLabel: localizedClassLabel(question.intendedClassId, locale),
    evidenceByOption: evidenceLines(question, options, optionGroups, locale),
    explanation,
    metadata: {
      ...question.metadata,
      locale,
      localizationVersion: "cls-cp001-localization-v2",
    },
  };
}
