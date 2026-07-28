import { CLASS_BY_ID, ENTITY_BY_LABEL } from "../semantic-dataset.en";
import type { GeneratedClsCp001EnglishQuestion } from "../cp001-runtime";
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
  if (question.task === "SELECT_COHERENT_GROUP") {
    const hindi = [
      "केवल एक विकल्प के सभी शब्द एक ही स्पष्ट वर्ग में आते हैं। वह विकल्प चुनिए।",
      "उस विकल्प को चुनिए जिसके सभी शब्द मिलकर एक अर्थपूर्ण वर्ग बनाते हैं।",
      "किस विकल्प में दिए गए सभी शब्द एक समान वर्ग से जुड़े हैं?",
      "वह एकमात्र शब्द-समूह चुनिए जिसके सभी सदस्य एक ही वर्ग में आते हैं।",
    ];
    const punjabi = [
      "ਕੇਵਲ ਇੱਕ ਵਿਕਲਪ ਦੇ ਸਾਰੇ ਸ਼ਬਦ ਇੱਕੋ ਸਪਸ਼ਟ ਵਰਗ ਵਿੱਚ ਆਉਂਦੇ ਹਨ। ਉਹ ਵਿਕਲਪ ਚੁਣੋ।",
      "ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਦੇ ਸਾਰੇ ਸ਼ਬਦ ਮਿਲ ਕੇ ਇੱਕ ਅਰਥਪੂਰਨ ਵਰਗ ਬਣਾਉਂਦੇ ਹਨ।",
      "ਕਿਹੜੇ ਵਿਕਲਪ ਦੇ ਸਾਰੇ ਸ਼ਬਦ ਇੱਕੋ ਵਰਗ ਨਾਲ ਸਬੰਧਤ ਹਨ?",
      "ਉਹ ਇਕੱਲਾ ਸ਼ਬਦ-ਸਮੂਹ ਚੁਣੋ ਜਿਸ ਦੇ ਸਾਰੇ ਮੈਂਬਰ ਇੱਕੋ ਵਰਗ ਵਿੱਚ ਆਉਂਦੇ ਹਨ।",
    ];
    const templates = locale === "hi-IN" ? hindi : punjabi;
    return templates[question.seed % templates.length]!;
  }

  if (question.task === "SELECT_CLASS_MEMBER") {
    const group = formatList(givens, locale);
    const hindi = [
      `${group} एक ही वर्ग के सदस्य हैं। उसी वर्ग का एक और सदस्य चुनिए।`,
      `दिए गए शब्द ${group} एक समान वर्ग बनाते हैं। कौन-सा विकल्प इस वर्ग में जोड़ा जा सकता है?`,
      `${group} को ध्यान से देखिए। इनके साझा वर्ग वाला विकल्प चुनिए।`,
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
    "अधिकांश विकल्प एक ही वर्ग में आते हैं। अलग विकल्प चुनिए।",
    "बाकी विकल्पों से अलग विकल्प चुनिए।",
    "निम्नलिखित में से अलग विकल्प कौन-सा है?",
    "कौन-सा विकल्प अन्य विकल्पों के साथ एक ही वर्ग में नहीं आता?",
  ];
  const punjabi = [
    "ਜ਼ਿਆਦਾਤਰ ਵਿਕਲਪ ਇੱਕੋ ਵਰਗ ਨਾਲ ਸਬੰਧਤ ਹਨ। ਵੱਖਰਾ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਬਾਕੀ ਵਿਕਲਪਾਂ ਤੋਂ ਵੱਖਰਾ ਵਿਕਲਪ ਚੁਣੋ।",
    "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਵੱਖਰਾ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",
    "ਕਿਹੜਾ ਵਿਕਲਪ ਹੋਰ ਵਿਕਲਪਾਂ ਨਾਲ ਇੱਕੋ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ?",
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
  const child = localizedClassLabel(question.intendedClassId, locale);
  return locale === "hi-IN"
    ? `ये सभी किसी बड़े सामान्य वर्ग में भी आ सकते हैं, लेकिन सही उत्तर तय करने वाला अधिक सटीक वर्ग ${child} है।`
    : `ਇਹ ਸਾਰੇ ਕਿਸੇ ਵੱਡੇ ਆਮ ਵਰਗ ਵਿੱਚ ਵੀ ਆ ਸਕਦੇ ਹਨ, ਪਰ ਸਹੀ ਜਵਾਬ ਤੈਅ ਕਰਨ ਵਾਲਾ ਹੋਰ ਸਪਸ਼ਟ ਵਰਗ ${child} ਹੈ।`;
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

function coherentGroupExplanation(
  question: GeneratedClsCp001EnglishQuestion,
  localizedGroups: readonly (readonly string[])[],
  localizedOptions: readonly string[],
  locale: ClsCp001TranslatedLocale,
): GeneratedClsCp001LocalizedQuestion["explanation"] {
  const classLabel = localizedClassLabel(question.intendedClassId, locale);
  const correctGroup = localizedGroups[question.correctIndex]!;
  const answer = localizedOptions[question.correctIndex]!;
  const groupList = formatList(correctGroup, locale);
  const optionChecks = localizedGroups.map((group, index) => {
    const display = group.join(", ");
    if (index === question.correctIndex) {
      return locale === "hi-IN"
        ? `${display}: इन तीनों का साझा वर्ग ${classLabel} है।`
        : `${display}: ਇਨ੍ਹਾਂ ਤਿੰਨਾਂ ਦਾ ਸਾਂਝਾ ਵਰਗ ${classLabel} ਹੈ।`;
    }
    return locale === "hi-IN"
      ? `${display}: ये सभी शब्द एक ही सटीक वर्ग में नहीं आते।`
      : `${display}: ਇਹ ਸਾਰੇ ਸ਼ਬਦ ਇੱਕੋ ਸਪਸ਼ਟ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ।`;
  });

  return {
    coreRule: locale === "hi-IN"
      ? [
        `${groupList} — इन तीनों का साझा वर्ग ${classLabel} है।`,
        "अन्य प्रत्येक विकल्प में अलग-अलग वर्गों के शब्द मिले हुए हैं।",
        `${answer} ही एकमात्र पूरा और सही शब्द-समूह है।`,
      ]
      : [
        `${groupList} — ਇਨ੍ਹਾਂ ਤਿੰਨਾਂ ਦਾ ਸਾਂਝਾ ਵਰਗ ${classLabel} ਹੈ।`,
        "ਹਰ ਹੋਰ ਵਿਕਲਪ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਵਰਗਾਂ ਦੇ ਸ਼ਬਦ ਮਿਲੇ ਹੋਏ ਹਨ।",
        `${answer} ਹੀ ਇਕੱਲਾ ਪੂਰਾ ਅਤੇ ਸਹੀ ਸ਼ਬਦ-ਸਮੂਹ ਹੈ।`,
      ],
    optionChecks,
    examSpeedShortcut: locale === "hi-IN"
      ? [
        "हर विकल्प को अपने भीतर जाँचिए; अलग-अलग विकल्पों के समान स्थान वाले शब्दों की तुलना न करें।",
        "सही विकल्प में तीनों शब्द एक ही सटीक वर्ग के सदस्य होने चाहिए।",
      ]
      : [
        "ਹਰ ਵਿਕਲਪ ਨੂੰ ਉਸ ਦੇ ਅੰਦਰ ਜਾਂਚੋ; ਵੱਖ-ਵੱਖ ਵਿਕਲਪਾਂ ਵਿੱਚ ਇੱਕੋ ਥਾਂ ਵਾਲੇ ਸ਼ਬਦਾਂ ਦੀ ਤੁਲਨਾ ਨਾ ਕਰੋ।",
        "ਸਹੀ ਵਿਕਲਪ ਦੇ ਤਿੰਨੇ ਸ਼ਬਦ ਇੱਕੋ ਸਪਸ਼ਟ ਵਰਗ ਦੇ ਮੈਂਬਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
      ],
    commonTraps: locale === "hi-IN"
      ? [
        "केवल दो संबंधित शब्द होने से कोई समूह सही नहीं हो जाता।",
        "बहुत व्यापक समानता स्वीकार न करें जिससे कई मिले-जुले समूह सही लगने लगें।",
      ]
      : [
        "ਸਿਰਫ਼ ਦੋ ਸੰਬੰਧਿਤ ਸ਼ਬਦ ਹੋਣ ਨਾਲ ਕੋਈ ਸਮੂਹ ਸਹੀ ਨਹੀਂ ਬਣ ਜਾਂਦਾ।",
        "ਬਹੁਤ ਵੱਡੀ ਸਮਾਨਤਾ ਨੂੰ ਨਾ ਮੰਨੋ ਜਿਸ ਨਾਲ ਕਈ ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਸਹੀ ਲੱਗਣ ਲੱਗ ਪੈਣ।",
      ],
  };
}

function itemExplanation(
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
        ? `${label}: यह पहचाने गए साझा वर्ग में आता है।`
        : `${label}: यह पहचाने गए साझा वर्ग में नहीं आता।`;
    }
    return member
      ? `${label}: ਇਹ ਪਛਾਣੇ ਗਏ ਸਾਂਝੇ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`
      : `${label}: ਇਹ ਪਛਾਣੇ ਗਏ ਸਾਂਝੇ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।`;
  });
  const hierarchy = hierarchyLine(question, locale);

  if (question.task === "SELECT_CLASS_MEMBER") {
    const group = formatList(localizedGivens, locale);
    return {
      coreRule: locale === "hi-IN"
        ? [
          `${group} — इन सभी का साझा वर्ग ${classLabel} है।`,
          ...(hierarchy ? [hierarchy] : []),
          `${answer} ही वह विकल्प है जो इसी वर्ग में आता है।`,
        ]
        : [
          `${group} — ਇਨ੍ਹਾਂ ਸਾਰਿਆਂ ਦਾ ਸਾਂਝਾ ਵਰਗ ${classLabel} ਹੈ।`,
          ...(hierarchy ? [hierarchy] : []),
          `${answer} ਹੀ ਉਹ ਵਿਕਲਪ ਹੈ ਜੋ ਇਸੇ ਵਰਗ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।`,
        ],
      optionChecks,
      examSpeedShortcut: locale === "hi-IN"
        ? [
          "पहले दिए गए शब्दों का सबसे सटीक साझा वर्ग पहचानिए।",
          "फिर हर विकल्प को उसी वर्ग से मिलाइए; केवल संबंधित होना पर्याप्त नहीं है।",
        ]
        : [
          "ਪਹਿਲਾਂ ਦਿੱਤੇ ਸ਼ਬਦਾਂ ਦਾ ਸਭ ਤੋਂ ਸਪਸ਼ਟ ਸਾਂਝਾ ਵਰਗ ਪਛਾਣੋ।",
          "ਫਿਰ ਹਰ ਵਿਕਲਪ ਨੂੰ ਉਸੇ ਵਰਗ ਨਾਲ ਮਿਲਾਓ; ਸਿਰਫ਼ ਸੰਬੰਧਿਤ ਹੋਣਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
        ],
      commonTraps: locale === "hi-IN"
        ? [
          "बड़े सामान्य वर्ग के बजाय ठीक वही छोटा वर्ग देखिए जो दिए गए शब्द बनाते हैं।",
          "सिर्फ आकार, रंग, स्थान या उपयोग की हल्की समानता पर उत्तर न चुनें।",
        ]
        : [
          "ਵੱਡੇ ਆਮ ਵਰਗ ਦੀ ਬਜਾਏ ਠੀਕ ਉਹੀ ਛੋਟਾ ਵਰਗ ਵੇਖੋ ਜੋ ਦਿੱਤੇ ਸ਼ਬਦ ਬਣਾਉਂਦੇ ਹਨ।",
          "ਸਿਰਫ਼ ਆਕਾਰ, ਰੰਗ, ਥਾਂ ਜਾਂ ਵਰਤੋਂ ਦੀ ਹਲਕੀ ਸਮਾਨਤਾ ਦੇ ਆਧਾਰ ਤੇ ਜਵਾਬ ਨਾ ਚੁਣੋ।",
        ],
    };
  }

  const positive = localizedOptions.filter((_, index) => index !== question.correctIndex);
  const positiveList = formatList(positive, locale);
  return {
    coreRule: locale === "hi-IN"
      ? [
        `${positiveList} — इन सभी का साझा वर्ग ${classLabel} है।`,
        ...(hierarchy ? [hierarchy] : []),
        `${answer} इस वर्ग में नहीं आता, इसलिए यही अलग विकल्प है।`,
        competitionLine(question, locale),
      ]
      : [
        `${positiveList} — ਇਨ੍ਹਾਂ ਸਾਰਿਆਂ ਦਾ ਸਾਂਝਾ ਵਰਗ ${classLabel} ਹੈ।`,
        ...(hierarchy ? [hierarchy] : []),
        `${answer} ਇਸ ਵਰਗ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ, ਇਸ ਲਈ ਇਹੀ ਵੱਖਰਾ ਵਿਕਲਪ ਹੈ।`,
        competitionLine(question, locale),
      ],
    optionChecks,
    examSpeedShortcut: locale === "hi-IN"
      ? [
        "अधिकांश विकल्पों पर लागू होने वाला सबसे सटीक वर्ग खोजिए।",
        "समान विकल्पों की पुष्टि करने के बाद ही शेष विकल्प को अलग मानिए।",
      ]
      : [
        "ਜ਼ਿਆਦਾਤਰ ਵਿਕਲਪਾਂ ਉੱਤੇ ਲਾਗੂ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਸਪਸ਼ਟ ਵਰਗ ਲੱਭੋ।",
        "ਇੱਕੋ ਵਰਗ ਵਾਲੇ ਵਿਕਲਪਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨ ਤੋਂ ਬਾਅਦ ਹੀ ਬਚੇ ਵਿਕਲਪ ਨੂੰ ਵੱਖਰਾ ਮੰਨੋ।",
      ],
    commonTraps: locale === "hi-IN"
      ? [
        "बहुत बड़े वर्ग पर न रुकें; वह सभी विकल्पों को भी शामिल कर सकता है।",
        "यदि कोई दूसरा उचित वर्ग अलग उत्तर देता हो, तो प्रश्न अस्पष्ट होगा।",
      ]
      : [
        "ਬਹੁਤ ਵੱਡੇ ਵਰਗ ਉੱਤੇ ਨਾ ਰੁਕੋ; ਉਹ ਸਾਰੇ ਵਿਕਲਪਾਂ ਨੂੰ ਵੀ ਸ਼ਾਮਲ ਕਰ ਸਕਦਾ ਹੈ।",
        "ਜੇ ਕੋਈ ਹੋਰ ਢੁੱਕਵਾਂ ਵਰਗ ਵੱਖਰਾ ਜਵਾਬ ਦੇਵੇ, ਤਾਂ ਪ੍ਰਸ਼ਨ ਅਸਪਸ਼ਟ ਹੋਵੇਗਾ।",
      ],
  };
}

export function localizeClsCp001Question(
  question: GeneratedClsCp001EnglishQuestion,
  locale: ClsCp001TranslatedLocale,
): GeneratedClsCp001LocalizedQuestion {
  const givens = question.givens.map((label) => localizedEntityLabel(label, locale));
  const optionGroups = question.optionGroups.map((group) =>
    group.map((label) => localizedEntityLabel(label, locale)),
  );
  const options = question.task === "SELECT_COHERENT_GROUP"
    ? optionGroups.map((group) => group.join(", "))
    : question.options.map((label) => localizedEntityLabel(label, locale));
  const answer = options[question.correctIndex]!;

  if (new Set(options).size !== options.length) {
    throw new Error(`${question.qlId}/${question.seed}/${locale} produced duplicate localized options`);
  }
  if (optionGroups.some((group) => new Set(group).size !== group.length)) {
    throw new Error(`${question.qlId}/${question.seed}/${locale} produced a duplicate word inside a localized group`);
  }

  const explanation = question.task === "SELECT_COHERENT_GROUP"
    ? coherentGroupExplanation(question, optionGroups, options, locale)
    : itemExplanation(question, givens, options, locale);

  return {
    ...question,
    stem: localStem(question, givens, locale),
    givens,
    options,
    optionGroups,
    answer,
    intendedClassLabel: localizedClassLabel(question.intendedClassId, locale),
    evidenceByOption: explanation.optionChecks,
    explanation,
    metadata: {
      ...question.metadata,
      locale,
      localizationVersion: "cls-cp001-localization-v1",
    },
  };
}
