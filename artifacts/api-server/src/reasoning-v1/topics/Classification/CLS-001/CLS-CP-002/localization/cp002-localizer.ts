import type { GeneratedClsCp002EnglishQuestion } from "../cp002-permanent-runtime";
import {
  CLS_CP002_CLASS_RELATION_IDS,
  CLS_CP002_LEXICAL_RELATION_IDS,
  CLS_CP002_SEMANTIC_RELATION_IDS,
  matchingRelationIds,
  relationDefinition,
} from "../relation-registry";
import type {
  ClsCp002Explanation,
  ClsCp002Pair,
} from "../types";
import {
  canonicalizeClsCp002StudentPair,
  localizeClsCp002StudentPair,
  localizedClsCp002StudentClassLabel,
  localizedClsCp002StudentRelationLabel,
  localizedClsCp002StudentRelationRule,
} from "./cp002-student-presentation";
import type { ClsCp002TranslatedLocale } from "./cp002-language-pack";

export type GeneratedClsCp002LocalizedQuestion = Omit<
  GeneratedClsCp002EnglishQuestion,
  "stem" | "pairs" | "options" | "answer" | "intendedRelationLabel" | "evidenceByOption" | "explanation" | "metadata"
> & {
  readonly stem: string;
  readonly pairs: readonly ClsCp002Pair[];
  readonly options: readonly string[];
  readonly answer: string;
  readonly intendedRelationLabel: string;
  readonly evidenceByOption: readonly string[];
  readonly explanation: ClsCp002Explanation;
  readonly metadata: Omit<GeneratedClsCp002EnglishQuestion["metadata"], "locale"> & {
    readonly locale: ClsCp002TranslatedLocale;
    readonly localizationVersion: "cls-cp002-localization-v1";
  };
};

const ALL_RELATION_IDS = [
  ...CLS_CP002_SEMANTIC_RELATION_IDS,
  ...CLS_CP002_LEXICAL_RELATION_IDS,
  ...CLS_CP002_CLASS_RELATION_IDS,
];

function display(pair: ClsCp002Pair): string {
  return `${pair.left} : ${pair.right}`;
}

function list(values: readonly string[], locale: ClsCp002TranslatedLocale): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  const conjunction = locale === "hi-IN" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${conjunction}${values.at(-1)}`;
}

function localizedStem(seed: number, locale: ClsCp002TranslatedLocale): string {
  const hindi = [
    "उस शब्द-जोड़ी को चुनिए जिसका आपसी संबंध बाकी जोड़ियों से अलग है।",
    "तीन या चार जोड़ियों में एक समान संबंध है। अलग संबंध वाली जोड़ी चुनिए।",
    "दोनों शब्दों के आपसी संबंध के आधार पर विषम जोड़ी पहचानिए।",
    "कौन-सी शब्द-जोड़ी बाकी जोड़ियों वाला संबंध नहीं बनाती?",
  ];
  const punjabi = [
    "ਉਹ ਸ਼ਬਦ-ਜੋੜੀ ਚੁਣੋ ਜਿਸ ਦਾ ਆਪਸੀ ਰਿਸ਼ਤਾ ਬਾਕੀ ਜੋੜੀਆਂ ਤੋਂ ਵੱਖਰਾ ਹੈ।",
    "ਤਿੰਨ ਜਾਂ ਚਾਰ ਜੋੜੀਆਂ ਵਿੱਚ ਇੱਕੋ ਰਿਸ਼ਤਾ ਹੈ। ਵੱਖਰੇ ਰਿਸ਼ਤੇ ਵਾਲੀ ਜੋੜੀ ਚੁਣੋ।",
    "ਦੋਵੇਂ ਸ਼ਬਦਾਂ ਦੇ ਆਪਸੀ ਰਿਸ਼ਤੇ ਦੇ ਆਧਾਰ ਤੇ ਵੱਖਰੀ ਜੋੜੀ ਪਛਾਣੋ।",
    "ਕਿਹੜੀ ਸ਼ਬਦ-ਜੋੜੀ ਬਾਕੀ ਜੋੜੀਆਂ ਵਾਲਾ ਰਿਸ਼ਤਾ ਨਹੀਂ ਬਣਾਉਂਦੀ?",
  ];
  const templates = locale === "hi-IN" ? hindi : punjabi;
  return templates[seed % templates.length]!;
}

function bestAlternativeRelation(canonicalPair: ClsCp002Pair, intendedRelationId: string): string | null {
  return matchingRelationIds(canonicalPair, ALL_RELATION_IDS)
    .filter((relationId) => relationId !== intendedRelationId)
    .sort((leftId, rightId) => {
      const left = relationDefinition(leftId);
      const right = relationDefinition(rightId);
      return right.qualityRank - left.qualityRank || leftId.localeCompare(rightId);
    })[0] ?? null;
}

function localizedAlternativeReason(
  pair: ClsCp002Pair,
  relationId: string,
  locale: ClsCp002TranslatedLocale,
): string {
  const pairText = display(pair);
  if (relationId.startsWith("PAIR_CLASS_")) {
    const classId = relationId.slice("PAIR_CLASS_".length);
    const classLabel = localizedClsCp002StudentClassLabel(classId, locale);
    return locale === "hi-IN"
      ? `${pairText} में दोनों शब्द ${classLabel} हैं, इसलिए यह जोड़ी अलग है।`
      : `${pairText} ਦੇ ਦੋਵੇਂ ਸ਼ਬਦ ${classLabel} ਹਨ, ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
  }

  if (locale === "hi-IN") {
    switch (relationId) {
      case "LEX_SYNONYM": return `${pairText} के दोनों शब्दों का अर्थ समान है, इसलिए यह जोड़ी अलग है।`;
      case "LEX_ANTONYM": return `${pairText} के दोनों शब्दों का अर्थ विपरीत है, इसलिए यह जोड़ी अलग है।`;
      case "SEM_PART_WHOLE": return `${pair.left}, ${pair.right} का भाग है; इसलिए ${pairText} अलग है।`;
      case "SEM_MATERIAL_PRODUCT": return `${pair.right}, ${pair.left} से बनता है; इसलिए ${pairText} अलग है।`;
      case "SEM_PRODUCT_MATERIAL": return `${pair.right} वह सामग्री है जिससे ${pair.left} बनता है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_WORKER_WORKPLACE": return `${pair.right}, ${pair.left} का सामान्य कार्यस्थल है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_WORKER_TOOL": return `${pair.right}, ${pair.left} का मुख्य औज़ार है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_WORKER_PRODUCT": return `${pair.right}, ${pair.left} द्वारा बनाया जाता है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_INSTRUMENT_MEASUREMENT": return `${pair.left}, ${pair.right} को मापता है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_QUANTITY_UNIT": return `${pair.right}, ${pair.left} की इकाई है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_OBJECT_FUNCTION": return `${pair.right}, ${pair.left} का मुख्य काम है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_MEMBER_CLASS": return `${pair.left}, ${pair.right} का सदस्य है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_INDIVIDUAL_GROUP": return `${pair.right} वह समूह है जिसमें ${pair.left} आता है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_PLACE_PURPOSE": return `${pair.right}, ${pair.left} का मुख्य काम है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_CONTAINER_CONTENT": return `${pair.left} में सामान्यतः ${pair.right} रखा जाता है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_OBJECT_SOUND": return `${pair.right}, ${pair.left} की खास आवाज़ है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_ANIMAL_YOUNG": return `${pair.right}, ${pair.left} का बच्चा है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_MALE_FEMALE": return `${pair.right}, ${pair.left} का मादा रूप है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_ANIMAL_SOUND": return `${pair.right}, ${pair.left} की आवाज़ है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_ANIMAL_MOVEMENT": return `${pair.right}, ${pair.left} की खास चाल है; इसलिए यह जोड़ी अलग है।`;
      case "SEM_KIN_ONE_GENERATION_DOWN": return `${pair.right} का रिश्ता ${pair.left} से एक पीढ़ी नीचे है; इसलिए यह जोड़ी अलग है।`;
      default: {
        const label = localizedClsCp002StudentRelationLabel(relationId, locale);
        return `${pairText} में ${label} वाला संबंध है, इसलिए यह जोड़ी अलग है।`;
      }
    }
  }

  switch (relationId) {
    case "LEX_SYNONYM": return `${pairText} ਦੇ ਦੋਵੇਂ ਸ਼ਬਦਾਂ ਦਾ ਅਰਥ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "LEX_ANTONYM": return `${pairText} ਦੇ ਦੋਵੇਂ ਸ਼ਬਦਾਂ ਦਾ ਅਰਥ ਉਲਟ ਹੈ, ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_PART_WHOLE": return `${pair.left}, ${pair.right} ਦਾ ਹਿੱਸਾ ਹੈ; ਇਸ ਲਈ ${pairText} ਵੱਖਰੀ ਹੈ।`;
    case "SEM_MATERIAL_PRODUCT": return `${pair.right}, ${pair.left} ਤੋਂ ਬਣਦਾ ਹੈ; ਇਸ ਲਈ ${pairText} ਵੱਖਰੀ ਹੈ।`;
    case "SEM_PRODUCT_MATERIAL": return `${pair.right} ਉਹ ਸਮੱਗਰੀ ਹੈ ਜਿਸ ਤੋਂ ${pair.left} ਬਣਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_WORKER_WORKPLACE": return `${pair.right}, ${pair.left} ਦਾ ਆਮ ਕੰਮ ਕਰਨ ਵਾਲਾ ਸਥਾਨ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_WORKER_TOOL": return `${pair.right}, ${pair.left} ਦਾ ਮੁੱਖ ਸੰਦ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_WORKER_PRODUCT": return `${pair.right}, ${pair.left} ਵੱਲੋਂ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_INSTRUMENT_MEASUREMENT": return `${pair.left}, ${pair.right} ਨੂੰ ਮਾਪਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_QUANTITY_UNIT": return `${pair.right}, ${pair.left} ਦੀ ਇਕਾਈ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_OBJECT_FUNCTION": return `${pair.right}, ${pair.left} ਦਾ ਮੁੱਖ ਕੰਮ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_MEMBER_CLASS": return `${pair.left}, ${pair.right} ਦਾ ਮੈਂਬਰ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_INDIVIDUAL_GROUP": return `${pair.right} ਉਹ ਸਮੂਹ ਹੈ ਜਿਸ ਵਿੱਚ ${pair.left} ਆਉਂਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_PLACE_PURPOSE": return `${pair.right}, ${pair.left} ਦਾ ਮੁੱਖ ਕੰਮ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_CONTAINER_CONTENT": return `${pair.left} ਵਿੱਚ ਆਮ ਤੌਰ ਤੇ ${pair.right} ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_OBJECT_SOUND": return `${pair.right}, ${pair.left} ਦੀ ਖਾਸ ਆਵਾਜ਼ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_ANIMAL_YOUNG": return `${pair.right}, ${pair.left} ਦਾ ਬੱਚਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_MALE_FEMALE": return `${pair.right}, ${pair.left} ਦਾ ਮਾਦਾ ਰੂਪ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_ANIMAL_SOUND": return `${pair.right}, ${pair.left} ਦੀ ਆਵਾਜ਼ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_ANIMAL_MOVEMENT": return `${pair.right}, ${pair.left} ਦੀ ਖਾਸ ਚਾਲ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    case "SEM_KIN_ONE_GENERATION_DOWN": return `${pair.right} ਦਾ ਰਿਸ਼ਤਾ ${pair.left} ਨਾਲੋਂ ਇੱਕ ਪੀੜ੍ਹੀ ਹੇਠਾਂ ਹੈ; ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    default: {
      const label = localizedClsCp002StudentRelationLabel(relationId, locale);
      return `${pairText} ਵਿੱਚ ${label} ਵਾਲਾ ਰਿਸ਼ਤਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਜੋੜੀ ਵੱਖਰੀ ਹੈ।`;
    }
  }
}

function oddPairReason(
  question: GeneratedClsCp002EnglishQuestion,
  localizedOddPair: ClsCp002Pair,
  canonicalOddPair: ClsCp002Pair,
  locale: ClsCp002TranslatedLocale,
): string {
  const pairText = display(localizedOddPair);
  if (question.generationProfile === "REVERSED_DIRECTION") {
    return locale === "hi-IN"
      ? `${pairText} में संबंध की दिशा उलट गई है।`
      : `${pairText} ਵਿੱਚ ਰਿਸ਼ਤੇ ਦੀ ਦਿਸ਼ਾ ਉਲਟੀ ਹੋ ਗਈ ਹੈ।`;
  }
  if (question.generationProfile === "CATEGORY_SAFE_FALSE_PAIR") {
    return locale === "hi-IN"
      ? `${pairText} के शब्द सही प्रकार के हैं, लेकिन उनके बीच सही संबंध नहीं बनता।`
      : `${pairText} ਦੇ ਸ਼ਬਦ ਸਹੀ ਕਿਸਮ ਦੇ ਹਨ, ਪਰ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਸਹੀ ਰਿਸ਼ਤਾ ਨਹੀਂ ਬਣਦਾ।`;
  }

  const alternative = bestAlternativeRelation(canonicalOddPair, question.intendedRelationId);
  return alternative
    ? localizedAlternativeReason(localizedOddPair, alternative, locale)
    : locale === "hi-IN"
      ? `${pairText} बाकी जोड़ियों वाला संबंध नहीं बनाती।`
      : `${pairText} ਬਾਕੀ ਜੋੜੀਆਂ ਵਾਲਾ ਰਿਸ਼ਤਾ ਨਹੀਂ ਬਣਾਉਂਦੀ।`;
}

function localizedExplanation(
  question: GeneratedClsCp002EnglishQuestion,
  localizedPairs: readonly ClsCp002Pair[],
  locale: ClsCp002TranslatedLocale,
): ClsCp002Explanation {
  const common = localizedPairs
    .filter((_, index) => index !== question.correctIndex)
    .map(display);
  const oddPair = localizedPairs[question.correctIndex]!;
  const odd = display(oddPair);
  const canonicalOdd = question.pairs[question.correctIndex]!;
  const rule = localizedClsCp002StudentRelationRule(question.intendedRelationId, locale);

  if (locale === "hi-IN") {
    return {
      coreConcept: [`बाकी जोड़ियों में यह समान संबंध है: ${rule}`],
      stepByStep: [
        `${list(common, locale)} — इन सभी में यही संबंध है।`,
        oddPairReason(question, oddPair, canonicalOdd, locale),
        `इसलिए ${odd} विषम जोड़ी है।`,
      ],
      examSpeedShortcut: [
        relationDefinition(question.intendedRelationId).directionSensitive
          ? "हर जोड़ी को बाएँ से दाएँ पढ़कर उसका संबंध एक छोटे वाक्य में बोलिए।"
          : "हर जोड़ी के दोनों शब्दों का अर्थ-संबंध पहचानकर बाकी विकल्पों से मिलाइए।",
      ],
      commonTrapWarning: [
        question.generationProfile === "REVERSED_DIRECTION"
          ? "शब्दों का क्रम नज़रअंदाज़ न करें; दिशा बदलने से संबंध बदल सकता है।"
          : question.generationProfile === "CATEGORY_SAFE_FALSE_PAIR"
            ? "सिर्फ सही प्रकार के शब्द देखकर जोड़ी को सही न मानें; वास्तविक संबंध भी जाँचें।"
            : question.generationProfile === "LEXICAL_POLARITY"
              ? "समान अर्थ और विपरीत अर्थ वाले शब्दों में भ्रम न करें।"
              : question.generationProfile === "CLASS_PAIR_CONTRAST"
                ? "हर जोड़ी के दोनों शब्द जाँचें; केवल एक शब्द का मिलना पर्याप्त नहीं है।"
                : "बहुत ढीला संबंध न लें; बाकी सभी जोड़ियों पर एक ही साफ नियम लगना चाहिए।",
      ],
    };
  }

  return {
    coreConcept: [`ਬਾਕੀ ਜੋੜੀਆਂ ਵਿੱਚ ਇਹ ਸਾਂਝਾ ਰਿਸ਼ਤਾ ਹੈ: ${rule}`],
    stepByStep: [
      `${list(common, locale)} — ਇਨ੍ਹਾਂ ਸਭ ਵਿੱਚ ਇਹੀ ਰਿਸ਼ਤਾ ਹੈ।`,
      oddPairReason(question, oddPair, canonicalOdd, locale),
      `ਇਸ ਲਈ ${odd} ਵੱਖਰੀ ਜੋੜੀ ਹੈ।`,
    ],
    examSpeedShortcut: [
      relationDefinition(question.intendedRelationId).directionSensitive
        ? "ਹਰ ਜੋੜੀ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਪੜ੍ਹ ਕੇ ਉਸਦਾ ਰਿਸ਼ਤਾ ਇੱਕ ਛੋਟੇ ਵਾਕ ਵਿੱਚ ਦੱਸੋ।"
        : "ਹਰ ਜੋੜੀ ਦੇ ਦੋਵੇਂ ਸ਼ਬਦਾਂ ਦਾ ਅਰਥਕ ਰਿਸ਼ਤਾ ਪਛਾਣ ਕੇ ਬਾਕੀ ਵਿਕਲਪਾਂ ਨਾਲ ਮਿਲਾਓ।",
    ],
    commonTrapWarning: [
      question.generationProfile === "REVERSED_DIRECTION"
        ? "ਸ਼ਬਦਾਂ ਦਾ ਕ੍ਰਮ ਅਣਡਿੱਠਾ ਨਾ ਕਰੋ; ਦਿਸ਼ਾ ਬਦਲਣ ਨਾਲ ਰਿਸ਼ਤਾ ਬਦਲ ਸਕਦਾ ਹੈ।"
        : question.generationProfile === "CATEGORY_SAFE_FALSE_PAIR"
          ? "ਸਿਰਫ਼ ਸਹੀ ਕਿਸਮ ਦੇ ਸ਼ਬਦ ਵੇਖ ਕੇ ਜੋੜੀ ਨੂੰ ਸਹੀ ਨਾ ਮੰਨੋ; ਅਸਲ ਰਿਸ਼ਤਾ ਵੀ ਜਾਂਚੋ।"
          : question.generationProfile === "LEXICAL_POLARITY"
            ? "ਇੱਕੋ ਅਰਥ ਅਤੇ ਉਲਟ ਅਰਥ ਵਾਲੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਗਲਤੀ ਨਾ ਕਰੋ।"
            : question.generationProfile === "CLASS_PAIR_CONTRAST"
              ? "ਹਰ ਜੋੜੀ ਦੇ ਦੋਵੇਂ ਸ਼ਬਦ ਜਾਂਚੋ; ਸਿਰਫ਼ ਇੱਕ ਸ਼ਬਦ ਦਾ ਮਿਲਣਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।"
              : "ਬਹੁਤ ਢਿੱਲਾ ਰਿਸ਼ਤਾ ਨਾ ਲਓ; ਬਾਕੀ ਸਾਰੀਆਂ ਜੋੜੀਆਂ ਉੱਤੇ ਇੱਕੋ ਸਾਫ਼ ਨਿਯਮ ਲੱਗਣਾ ਚਾਹੀਦਾ ਹੈ।",
    ],
  };
}

export function localizeClsCp002Question(
  question: GeneratedClsCp002EnglishQuestion,
  locale: ClsCp002TranslatedLocale,
): GeneratedClsCp002LocalizedQuestion {
  const pairs = question.pairs.map((pair) =>
    localizeClsCp002StudentPair(pair, question.metadata.sourceRelationFactIds, locale),
  );
  const options = pairs.map(display);
  if (new Set(options).size !== options.length) {
    throw new Error(`${question.qlId}/${question.seed}/${locale} produced duplicate localized pairs`);
  }

  const reconstructed = pairs.map((pair) =>
    canonicalizeClsCp002StudentPair(pair, question.metadata.sourceRelationFactIds, locale),
  );
  if (JSON.stringify(reconstructed) !== JSON.stringify(question.pairs)) {
    throw new Error(`${question.qlId}/${question.seed}/${locale} failed canonical pair reconstruction`);
  }

  const intendedRelationLabel = localizedClsCp002StudentRelationLabel(question.intendedRelationId, locale);
  const explanation = localizedExplanation(question, pairs, locale);
  const evidenceByOption = pairs.map((pair, index) => {
    const pairText = display(pair);
    if (index === question.correctIndex) {
      return locale === "hi-IN"
        ? `${pairText} साझा संबंध नहीं बनाती।`
        : `${pairText} ਸਾਂਝਾ ਰਿਸ਼ਤਾ ਨਹੀਂ ਬਣਾਉਂਦੀ।`;
    }
    return locale === "hi-IN"
      ? `${pairText} साझा संबंध बनाती है।`
      : `${pairText} ਸਾਂਝਾ ਰਿਸ਼ਤਾ ਬਣਾਉਂਦੀ ਹੈ।`;
  });

  return {
    ...question,
    stem: localizedStem(question.seed, locale),
    pairs,
    options,
    answer: options[question.correctIndex]!,
    intendedRelationLabel,
    evidenceByOption,
    explanation,
    metadata: {
      ...question.metadata,
      locale,
      localizationVersion: "cls-cp002-localization-v1",
    },
  };
}
