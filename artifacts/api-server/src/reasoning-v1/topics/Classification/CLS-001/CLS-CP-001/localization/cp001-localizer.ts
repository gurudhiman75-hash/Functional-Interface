import { CLASS_BY_ID, ENTITY_BY_LABEL } from "../semantic-dataset.en";
import type { GeneratedClsCp001EnglishQuestion } from "../cp001-runtime";
import {
  localizedClassLabel,
  localizedEntityLabel,
  type ClsCp001TranslatedLocale,
} from "./cp001-language-pack";

export type GeneratedClsCp001LocalizedQuestion = Omit<
  GeneratedClsCp001EnglishQuestion,
  "stem" | "givens" | "options" | "answer" | "intendedClassLabel" | "evidenceByOption" | "explanation" | "metadata"
> & {
  readonly stem: string;
  readonly givens: readonly string[];
  readonly options: readonly string[];
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
    readonly localizationVersion: "cls-cp001-localization-v1";
  };
};

function englishEntity(label: string) {
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
  if (question.task === "SELECT_CLASS_MEMBER") {
    const group = formatList(givens, locale);
    const hindi = [
      `${group} एक ही वर्ग के सदस्य हैं। उसी वर्ग का एक और सदस्य चुनिए।`,
      `दिए गए शब्द ${group} एक समान वर्ग बनाते हैं। कौन-सा विकल्प इस वर्ग में जोड़ा जा सकता है?`,
      `${group} को ध्यान से देखिए। इनमें जिस वर्ग की समानता है, उसी वर्ग का विकल्प चुनिए।`,
      `कौन-सा विकल्प ${group} के साथ उसी वर्ग में आएगा?`,
    ];
    const punjabi = [
      `${group} ਇੱਕੋ ਵਰਗ ਦੇ ਮੈਂਬਰ ਹਨ। ਇਸੇ ਵਰਗ ਦਾ ਇੱਕ ਹੋਰ ਮੈਂਬਰ ਚੁਣੋ।`,
      `ਦਿੱਤੇ ਸ਼ਬਦ ${group} ਇੱਕ ਸਾਂਝਾ ਵਰਗ ਬਣਾਉਂਦੇ ਹਨ। ਕਿਹੜਾ ਵਿਕਲਪ ਇਸ ਵਰਗ ਵਿੱਚ ਜੋੜਿਆ ਜਾ ਸਕਦਾ ਹੈ?`,
      `${group} ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ। ਇਨ੍ਹਾਂ ਦੇ ਸਾਂਝੇ ਵਰਗ ਵਾਲਾ ਵਿਕਲਪ ਚੁਣੋ।`,
      `ਕਿਹੜਾ ਵਿਕਲਪ ${group} ਦੇ ਨਾਲ ਇੱਕੋ ਵਰਗ ਵਿੱਚ ਆਵੇਗਾ?`,
    ];
    const templates = locale === "hi-IN" ? hindi : punjabi;
    return templates[question.seed % templates.length]!;
  }

  const hindi = [
    "निम्नलिखित चार विकल्पों में से तीन एक ही वर्ग में आते हैं। अलग विकल्प चुनिए।",
    "तीन विकल्पों में एक समान विशेषता है। वह विकल्प चुनिए जो इस समूह में नहीं आता।",
    "बाकी तीनों से अलग विकल्प चुनिए।",
    "कौन-सा विकल्प बाकी तीनों के साथ एक ही वर्ग में नहीं आता?",
  ];
  const punjabi = [
    "ਹੇਠਾਂ ਦਿੱਤੇ ਚਾਰ ਵਿਕਲਪਾਂ ਵਿੱਚੋਂ ਤਿੰਨ ਇੱਕੋ ਵਰਗ ਨਾਲ ਸਬੰਧਤ ਹਨ। ਵੱਖਰਾ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਤਿੰਨ ਵਿਕਲਪਾਂ ਵਿੱਚ ਇੱਕ ਸਾਂਝੀ ਵਿਸ਼ੇਸ਼ਤਾ ਹੈ। ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜੋ ਇਸ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।",
    "ਬਾਕੀ ਤਿੰਨਾਂ ਤੋਂ ਵੱਖਰਾ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਕਿਹੜਾ ਵਿਕਲਪ ਬਾਕੀ ਤਿੰਨਾਂ ਨਾਲ ਇੱਕੋ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ?",
  ];
  const templates = locale === "hi-IN" ? hindi : punjabi;
  return templates[question.seed % templates.length]!;
}

function hierarchyLine(
  question: GeneratedClsCp001EnglishQuestion,
  locale: ClsCp001TranslatedLocale,
): string | null {
  const semanticClass = CLASS_BY_ID.get(question.intendedClassId);
  if (!semanticClass || semanticClass.parentClassIds.length === 0) return null;
  const parentLabels = semanticClass.parentClassIds.map((classId) => localizedClassLabel(classId, locale));
  const parent = formatList(parentLabels, locale);
  const child = localizedClassLabel(question.intendedClassId, locale);
  return locale === "hi-IN"
    ? `ये शब्द ${parent} जैसे बड़े वर्ग से भी जुड़े हैं, लेकिन सही उत्तर तय करने वाला अधिक सटीक वर्ग ${child} है।`
    : `ਇਹ ਸ਼ਬਦ ${parent} ਵਰਗੇ ਵੱਡੇ ਵਰਗ ਨਾਲ ਵੀ ਜੁੜੇ ਹਨ, ਪਰ ਸਹੀ ਜਵਾਬ ਤੈਅ ਕਰਨ ਵਾਲਾ ਹੋਰ ਸਪਸ਼ਟ ਵਰਗ ${child} ਹੈ।`;
}

function competitionLine(
  question: GeneratedClsCp001EnglishQuestion,
  locale: ClsCp001TranslatedLocale,
): string {
  const sameAnswerCompetition = question.ambiguityAudit.competingClassIds.length > 1;
  if (locale === "hi-IN") {
    return sameAnswerCompetition
      ? "एक व्यापक वर्ग भी इसी विकल्प को अलग दिखाता है, इसलिए उत्तर नहीं बदलता।"
      : "कोई दूसरा उचित वर्ग किसी अन्य विकल्प को अलग नहीं करता।";
  }
  return sameAnswerCompetition
    ? "ਇੱਕ ਵੱਡਾ ਵਰਗ ਵੀ ਇਸੇ ਵਿਕਲਪ ਨੂੰ ਵੱਖਰਾ ਦਿਖਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਜਵਾਬ ਨਹੀਂ ਬਦਲਦਾ।"
    : "ਕੋਈ ਹੋਰ ਢੁੱਕਵਾਂ ਵਰਗ ਕਿਸੇ ਦੂਜੇ ਵਿਕਲਪ ਨੂੰ ਵੱਖਰਾ ਨਹੀਂ ਕਰਦਾ।";
}

function localizedExplanation(
  question: GeneratedClsCp001EnglishQuestion,
  localizedGivens: readonly string[],
  localizedOptions: readonly string[],
  locale: ClsCp001TranslatedLocale,
): GeneratedClsCp001LocalizedQuestion["explanation"] {
  const classLabel = localizedClassLabel(question.intendedClassId, locale);
  const answer = localizedOptions[question.correctIndex]!;
  const optionChecks = question.options.map((englishLabel, index) => {
    const member = englishEntity(englishLabel).classIds.includes(question.intendedClassId);
    const label = localizedOptions[index]!;
    if (locale === "hi-IN") {
      return member
        ? `${label} ${classLabel} के वर्ग में आता है।`
        : `${label} ${classLabel} के वर्ग में नहीं आता।`;
    }
    return member
      ? `${label} ${classLabel} ਦੇ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`
      : `${label} ${classLabel} ਦੇ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।`;
  });

  const hierarchy = hierarchyLine(question, locale);

  if (question.task === "SELECT_CLASS_MEMBER") {
    const group = formatList(localizedGivens, locale);
    const coreRule = locale === "hi-IN"
      ? [
        `${group} — ये सभी ${classLabel} हैं।`,
        ...(hierarchy ? [hierarchy] : []),
        `${answer} ही वह विकल्प है जो इसी वर्ग में आता है।`,
      ]
      : [
        `${group} — ਇਹ ਸਾਰੇ ${classLabel} ਹਨ।`,
        ...(hierarchy ? [hierarchy] : []),
        `${answer} ਹੀ ਉਹ ਵਿਕਲਪ ਹੈ ਜੋ ਇਸੇ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`,
      ];

    return {
      coreRule,
      optionChecks,
      examSpeedShortcut: locale === "hi-IN"
        ? [
          "पहले दिए गए तीन शब्दों का सबसे सटीक साझा वर्ग पहचानिए।",
          "फिर हर विकल्प को उसी वर्ग से मिलाइए; केवल संबंधित होना पर्याप्त नहीं है।",
        ]
        : [
          "ਪਹਿਲਾਂ ਦਿੱਤੇ ਤਿੰਨ ਸ਼ਬਦਾਂ ਦਾ ਸਭ ਤੋਂ ਸਪਸ਼ਟ ਸਾਂਝਾ ਵਰਗ ਪਛਾਣੋ।",
          "ਫਿਰ ਹਰ ਵਿਕਲਪ ਨੂੰ ਉਸੇ ਵਰਗ ਨਾਲ ਮਿਲਾਓ; ਸਿਰਫ਼ ਸੰਬੰਧਿਤ ਹੋਣਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
        ],
      commonTraps: locale === "hi-IN"
        ? [
          "किसी बड़े सामान्य वर्ग का सदस्य चुनने के बजाय ठीक वही छोटा वर्ग देखिए जो दिए गए शब्द बनाते हैं।",
          "सिर्फ आकार, रंग, स्थान या उपयोग की हल्की समानता पर उत्तर न चुनें।",
        ]
        : [
          "ਕਿਸੇ ਵੱਡੇ ਆਮ ਵਰਗ ਦਾ ਮੈਂਬਰ ਚੁਣਨ ਦੀ ਬਜਾਏ ਠੀਕ ਉਹੀ ਛੋਟਾ ਵਰਗ ਵੇਖੋ ਜੋ ਦਿੱਤੇ ਸ਼ਬਦ ਬਣਾਉਂਦੇ ਹਨ।",
          "ਸਿਰਫ਼ ਆਕਾਰ, ਰੰਗ, ਥਾਂ ਜਾਂ ਵਰਤੋਂ ਦੀ ਹਲਕੀ ਸਮਾਨਤਾ ਦੇ ਆਧਾਰ ਤੇ ਜਵਾਬ ਨਾ ਚੁਣੋ।",
        ],
    };
  }

  const positive = localizedOptions.filter((_, index) => index !== question.correctIndex);
  const positiveList = formatList(positive, locale);
  const coreRule = locale === "hi-IN"
    ? [
      `${positiveList} — ये तीनों ${classLabel} हैं।`,
      ...(hierarchy ? [hierarchy] : []),
      `${answer} ${classLabel} नहीं है, इसलिए यही अलग विकल्प है।`,
      competitionLine(question, locale),
    ]
    : [
      `${positiveList} — ਇਹ ਤਿੰਨੇ ${classLabel} ਹਨ।`,
      ...(hierarchy ? [hierarchy] : []),
      `${answer} ${classLabel} ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਇਹੀ ਵੱਖਰਾ ਵਿਕਲਪ ਹੈ।`,
      competitionLine(question, locale),
    ];

  return {
    coreRule,
    optionChecks,
    examSpeedShortcut: locale === "hi-IN"
      ? [
        "पहले तीन विकल्पों पर लागू होने वाला सबसे सटीक वर्ग खोजिए।",
        "तीनों की पुष्टि करने के बाद ही चौथे विकल्प को अलग मानिए।",
      ]
      : [
        "ਪਹਿਲਾਂ ਤਿੰਨ ਵਿਕਲਪਾਂ ਉੱਤੇ ਲਾਗੂ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਸਪਸ਼ਟ ਵਰਗ ਲੱਭੋ।",
        "ਤਿੰਨਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹੀ ਚੌਥੇ ਵਿਕਲਪ ਨੂੰ ਵੱਖਰਾ ਮੰਨੋ।",
      ],
    commonTraps: locale === "hi-IN"
      ? [
        "बहुत बड़े वर्ग पर न रुकें; वह चारों विकल्पों को भी शामिल कर सकता है।",
        "यदि कोई दूसरा उचित वर्ग अलग उत्तर देता हो, तो प्रश्न अस्पष्ट होगा और उसे स्वीकार नहीं करना चाहिए।",
      ]
      : [
        "ਬਹੁਤ ਵੱਡੇ ਵਰਗ ਉੱਤੇ ਨਾ ਰੁਕੋ; ਉਹ ਚਾਰੇ ਵਿਕਲਪਾਂ ਨੂੰ ਵੀ ਸ਼ਾਮਲ ਕਰ ਸਕਦਾ ਹੈ।",
        "ਜੇ ਕੋਈ ਹੋਰ ਢੁੱਕਵਾਂ ਵਰਗ ਵੱਖਰਾ ਜਵਾਬ ਦੇਵੇ, ਤਾਂ ਪ੍ਰਸ਼ਨ ਅਸਪਸ਼ਟ ਹੋਵੇਗਾ ਅਤੇ ਉਸਨੂੰ ਸਵੀਕਾਰ ਨਹੀਂ ਕਰਨਾ ਚਾਹੀਦਾ।",
      ],
  };
}

export function localizeClsCp001Question(
  question: GeneratedClsCp001EnglishQuestion,
  locale: ClsCp001TranslatedLocale,
): GeneratedClsCp001LocalizedQuestion {
  const givens = question.givens.map((label) => localizedEntityLabel(label, locale));
  const options = question.options.map((label) => localizedEntityLabel(label, locale));
  const answer = options[question.correctIndex]!;

  if (new Set(options).size !== options.length) {
    throw new Error(`${question.qlId}/${question.seed}/${locale} produced duplicate localized options`);
  }

  return {
    ...question,
    stem: localStem(question, givens, locale),
    givens,
    options,
    answer,
    intendedClassLabel: localizedClassLabel(question.intendedClassId, locale),
    evidenceByOption: localizedExplanation(question, givens, options, locale).optionChecks,
    explanation: localizedExplanation(question, givens, options, locale),
    metadata: {
      ...question.metadata,
      locale,
      localizationVersion: "cls-cp001-localization-v1",
    },
  };
}
