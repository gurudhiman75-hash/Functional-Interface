import { letterPosition } from "../foundation/alphabet";
import {
  ANA_CP008_ENGLISH_PROTOTYPES,
  renderDirectEnglishPrototype,
  renderOddPairEnglishPrototype,
  type ProvisionalEnglishPrototypeId,
} from "./provisional-language-templates.en";
import { renderMixedToken } from "./foundation/mixed-token";
import { provisionalMixedRuleById } from "./provisional-rule-definitions";

export type ProvisionalMixedLocale = "hi-IN" | "pa-IN";

interface LocalizedDirectExplanation {
  ruleStatement: string;
  sourceDemonstration: string;
  targetApplication: string;
  conclusion: string;
  closestTrapRejection: string;
}

export interface LocalizedDirectPrototype {
  prototypeId: ProvisionalEnglishPrototypeId;
  locale: ProvisionalMixedLocale;
  task: "DIRECT_COMPLETION";
  stem: string;
  source: ReturnType<typeof renderDirectEnglishPrototype>["source"];
  target: ReturnType<typeof renderDirectEnglishPrototype>["target"];
  correctAnswer: ReturnType<typeof renderDirectEnglishPrototype>["correctAnswer"];
  explanation: LocalizedDirectExplanation;
  metadata: {
    permanentQlId: null;
    publiclyPublishable: false;
    maturity: "LANGUAGE_PROTOTYPE";
  };
}

export interface LocalizedOddPairPrototype {
  prototypeId: ProvisionalEnglishPrototypeId;
  locale: ProvisionalMixedLocale;
  task: "ODD_PAIR_SELECTION";
  stem: string;
  options: ReturnType<typeof renderOddPairEnglishPrototype>["options"];
  correctIndex: number;
  explanation: {
    commonRule: string;
    validPairDemonstrations: readonly [string, string, string];
    oddPairRejection: string;
    conclusion: string;
  };
  metadata: {
    permanentQlId: null;
    publiclyPublishable: false;
    maturity: "LANGUAGE_PROTOTYPE";
  };
}

function hi(locale: ProvisionalMixedLocale): boolean {
  return locale === "hi-IN";
}

function signed(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function digitSum(number: number): number {
  return [...String(Math.abs(number))].reduce((sum, digit) => sum + Number(digit), 0);
}

function localizedRuleStatement(
  prototypeId: ProvisionalEnglishPrototypeId,
  locale: ProvisionalMixedLocale,
): string {
  const hindi = hi(locale);
  const values: Record<ProvisionalEnglishPrototypeId, [string, string]> = {
    PROTO_POSITION_SUM_TO_NUMBER: [
      "दोनों अक्षरों के सामान्य वर्णमाला-स्थान लिखकर उन्हें जोड़ते हैं।",
      "ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਦੋਵੇਂ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਲਿਖ ਕੇ ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜਦੇ ਹਾਂ।",
    ],
    PROTO_POSITION_PRODUCT_TO_NUMBER: [
      "दोनों अक्षरों के सामान्य वर्णमाला-स्थान लिखकर उनका गुणा करते हैं।",
      "ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਦੋਵੇਂ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਲਿਖ ਕੇ ਉਨ੍ਹਾਂ ਦਾ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_POSITION_SUM_TO_LETTER: [
      "दोनों अक्षरों के स्थान जोड़कर उस योग के स्थान वाला अक्षर लेते हैं।",
      "ਦੋਵੇਂ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਜੋੜਦੇ ਹਾਂ ਅਤੇ ਜੋ ਨੰਬਰ ਬਣੇ, ਉਸ ਥਾਂ ਵਾਲਾ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ।",
    ],
    PROTO_SINGLE_LETTER_POSITION_SQUARE: [
      "अक्षर के सामान्य वर्णमाला-स्थान का वर्ग करते हैं।",
      "ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਅੱਖਰ ਦੀ ਥਾਂ ਦਾ ਵਰਗ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_INDEPENDENT_LETTER_NUMBER_DELTA: [
      "अक्षर और पूरी संख्या पर दो अलग-अलग निश्चित परिवर्तन लगते हैं।",
      "ਅੱਖਰ ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਤੈਅ ਬਦਲਾਅ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।",
    ],
    PROTO_SHARED_CLUSTER_NUMBER_DELTA: [
      "दोनों अक्षरों और पूरी संख्या पर एक ही चिन्हित परिवर्तन लगाया जाता है।",
      "ਦੋਵੇਂ ਅੱਖਰਾਂ ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਬਦਲਾਅ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
    ],
    PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA: [
      "दोनों अक्षर-स्थानों की चाल अलग है और संख्या की चाल भी अलग निश्चित है।",
      "ਦੋਵੇਂ ਅੱਖਰਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਥਾਵਾਂ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ਵੀ ਵੱਖਰਾ ਤੈਅ ਬਦਲਾਅ ਹੁੰਦਾ ਹੈ।",
    ],
    PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST: [
      "दोनों अक्षरों पर निश्चित चाल लगाकर संख्या को दिए गए सही गुणक से गुणा करते हैं।",
      "ਦੋਵੇਂ ਅੱਖਰਾਂ ਨੂੰ ਤੈਅ ਥਾਵਾਂ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਕਰਕੇ ਗਿਣਤੀ ਨੂੰ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_EXACT_MULTIPLIER_NUMBER_FIRST: [
      "पहले लिखी संख्या को सही गुणक से गुणा करते हैं, अक्षरों को बदलते हैं और संख्या-पहले क्रम बनाए रखते हैं।",
      "ਪਹਿਲਾਂ ਦਿੱਤੀ ਗਿਣਤੀ ਨੂੰ ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ, ਫਿਰ ਅੱਖਰ ਬਦਲਦੇ ਹਾਂ ਅਤੇ ਜਵਾਬ ਵਿੱਚ ਗਿਣਤੀ ਪਹਿਲਾਂ ਲਿਖਦੇ ਹਾਂ।",
    ],
    PROTO_DIRECT_CUBE_CLUSTER_FIRST: [
      "अक्षरों पर निश्चित चाल लगाकर दी गई संख्या का सीधे घन करते हैं।",
      "ਅੱਖਰਾਂ ਨੂੰ ਤੈਅ ਥਾਵਾਂ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਕਰਕੇ ਦਿੱਤੀ ਗਿਣਤੀ ਦਾ ਘਣ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST: [
      "दी गई संख्या को पूर्ण वर्ग मानकर उसका आधार निकालते हैं और उसी आधार का घन करते हैं।",
      "ਪਹਿਲਾਂ ਪਤਾ ਕਰਦੇ ਹਾਂ ਕਿ ਦਿੱਤੀ ਗਿਣਤੀ ਕਿਸ ਗਿਣਤੀ ਦਾ ਵਰਗ ਹੈ, ਫਿਰ ਉਸ ਗਿਣਤੀ ਦਾ ਘਣ ਕਰਦੇ ਹਾਂ।",
    ],
    PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST: [
      "संख्या में एक जोड़कर बने पूर्ण घन का सही घनमूल लेते हैं।",
      "ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਜੋੜ ਕੇ ਬਣੇ ਪੂਰਨ ਘਣ ਦਾ ਸਹੀ ਘਣਮੂਲ ਲੈਂਦੇ ਹਾਂ।",
    ],
    PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST: [
      "पहली संख्या में एक जोड़कर सही वर्गमूल लेते हैं और संख्या-पहले क्रम बनाए रखते हैं।",
      "ਪਹਿਲੀ ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਜੋੜ ਕੇ ਉਸ ਦਾ ਵਰਗਮੂਲ ਲੈਂਦੇ ਹਾਂ ਅਤੇ ਜਵਾਬ ਵਿੱਚ ਗਿਣਤੀ ਪਹਿਲਾਂ ਲਿਖਦੇ ਹਾਂ।",
    ],
    PROTO_DIGIT_SUM_SQUARE_SUCCESSOR: [
      "संख्या को एक बढ़ाकर नई संख्या के अंकों के योग का वर्ग निकालते हैं और उससे जुड़ा अक्षर लेते हैं।",
      "ਗਿਣਤੀ ਨੂੰ ਇੱਕ ਵਧਾ ਕੇ ਨਵੀਂ ਗਿਣਤੀ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ਕੱਢਦੇ ਹਾਂ, ਉਸ ਜੋੜ ਦਾ ਵਰਗ ਕਰਦੇ ਹਾਂ ਅਤੇ ਉਸ ਨਾਲ ਜੁੜਿਆ ਅੱਖਰ ਲੈਂਦੇ ਹਾਂ।",
    ],
  };
  return values[prototypeId][hindi ? 0 : 1];
}

function localizedTrap(
  prototypeId: ProvisionalEnglishPrototypeId,
  locale: ProvisionalMixedLocale,
): string {
  const hindi = hi(locale);
  const values: Record<ProvisionalEnglishPrototypeId, [string, string]> = {
    PROTO_POSITION_SUM_TO_NUMBER: [
      "निकटतम गलती स्थानों का गुणा करना या उनके बीच का अंतर गिनना है; यहाँ सामान्य स्थानों को जोड़ना है।",
      "ਇੱਥੇ ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਜੋੜਣੀਆਂ ਹਨ; ਉਨ੍ਹਾਂ ਦਾ ਗੁਣਾ ਕਰਨਾ ਜਾਂ ਫਰਕ ਕੱਢਣਾ ਗਲਤ ਹੋਵੇਗਾ।",
    ],
    PROTO_POSITION_PRODUCT_TO_NUMBER: [
      "स्थान जोड़ देने से गलत उत्तर मिलेगा; दोनों स्थान गुणन के गुणक हैं।",
      "ਅੱਖਰਾਂ ਦੀਆਂ ਥਾਵਾਂ ਜੋੜਨ ਨਾਲ ਗਲਤ ਜਵਾਬ ਆਵੇਗਾ; ਇੱਥੇ ਦੋਵਾਂ ਦਾ ਗੁਣਾ ਕਰਨਾ ਹੈ।",
    ],
    PROTO_POSITION_SUM_TO_LETTER: [
      "सिर्फ संख्यात्मक योग पर रुकना गलत है; अंतिम चरण में उसी स्थान का अक्षर लेना है।",
      "ਸਿਰਫ਼ ਜੋੜ ਕੱਢ ਕੇ ਰੁਕਣਾ ਗਲਤ ਹੈ; ਅਖੀਰ ਵਿੱਚ ਉਸ ਨੰਬਰ ਵਾਲਾ ਅੱਖਰ ਲੈਣਾ ਹੈ।",
    ],
    PROTO_SINGLE_LETTER_POSITION_SQUARE: [
      "केवल अक्षर का स्थान या उसका दुगुना लेना स्रोत में दिखाए गए वर्ग को पूरा नहीं करता।",
      "ਸਿਰਫ਼ ਅੱਖਰ ਦੀ ਥਾਂ ਜਾਂ ਉਸ ਦਾ ਦੁੱਗਣਾ ਲੈਣਾ ਗਲਤ ਹੈ; ਪਹਿਲੇ ਜੋੜੇ ਵਿੱਚ ਥਾਂ ਦਾ ਵਰਗ ਕੀਤਾ ਗਿਆ ਹੈ।",
    ],
    PROTO_INDEPENDENT_LETTER_NUMBER_DELTA: [
      "अक्षर और संख्या पर एक ही परिवर्तन थोपना गलत है; दोनों की चाल स्वतंत्र है।",
      "ਅੱਖਰ ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ਇੱਕੋ ਬਦਲਾਅ ਕਰਨਾ ਗਲਤ ਹੈ; ਦੋਵਾਂ ਲਈ ਵੱਖਰੇ ਬਦਲਾਅ ਹਨ।",
    ],
    PROTO_SHARED_CLUSTER_NUMBER_DELTA: [
      "दो अक्षरों पर अलग-अलग चाल लगाना या संख्या को न बदलना गलत है; तीनों पर एक ही परिवर्तन लगता है।",
      "ਦੋ ਅੱਖਰਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਤਰੀਕੇ ਨਾਲ ਬਦਲਣਾ ਜਾਂ ਗਿਣਤੀ ਨੂੰ ਨਾ ਬਦਲਣਾ ਗਲਤ ਹੈ; ਤਿੰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਬਦਲਾਅ ਹੁੰਦਾ ਹੈ।",
    ],
    PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA: [
      "दोनों अक्षरों के लिए एक समान चाल लेना गलत है; प्रत्येक स्थान और संख्या की अपनी निश्चित चाल है।",
      "ਦੋਵੇਂ ਅੱਖਰਾਂ ਨੂੰ ਇੱਕੋ ਜਿੰਨੀਆਂ ਥਾਵਾਂ ਬਦਲਣਾ ਗਲਤ ਹੈ; ਹਰ ਅੱਖਰ ਅਤੇ ਗਿਣਤੀ ਦਾ ਬਦਲਾਅ ਵੱਖਰਾ ਹੈ।",
    ],
    PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST: [
      "गुणक को संख्या में जोड़ना गलत है; संख्या का सही और पूर्ण गुणा करना आवश्यक है।",
      "ਗੁਣਾ ਕਰਨ ਵਾਲੀ ਗਿਣਤੀ ਨੂੰ ਜੋੜਨਾ ਗਲਤ ਹੈ; ਦਿੱਤੀ ਗਿਣਤੀ ਦਾ ਪੂਰਾ ਗੁਣਾ ਕਰਨਾ ਹੈ।",
    ],
    PROTO_EXACT_MULTIPLIER_NUMBER_FIRST: [
      "सही भागों को उल्टे क्रम में लिखना भी गलत है; उत्तर में संख्या पहले ही रहनी चाहिए।",
      "ਸਹੀ ਹਿੱਸਿਆਂ ਨੂੰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਣਾ ਵੀ ਗਲਤ ਹੈ; ਜਵਾਬ ਵਿੱਚ ਗਿਣਤੀ ਪਹਿਲਾਂ ਹੀ ਰਹਿਣੀ ਚਾਹੀਦੀ ਹੈ।",
    ],
    PROTO_DIRECT_CUBE_CLUSTER_FIRST: [
      "संख्या का वर्ग करना या उसे तीन से गुणा करना घन करने के समान नहीं है।",
      "ਗਿਣਤੀ ਦਾ ਵਰਗ ਕਰਨਾ ਜਾਂ ਉਸ ਨੂੰ ਤਿੰਨ ਨਾਲ ਗੁਣਾ ਕਰਨਾ, ਉਸ ਦਾ ਘਣ ਕਰਨ ਦੇ ਬਰਾਬਰ ਨਹੀਂ ਹੈ।",
    ],
    PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST: [
      "दिए गए पूर्ण वर्ग का सीधे घन करना गलत है; पहले उसका वर्गमूल आधार निकालना है।",
      "ਦਿੱਤੇ ਪੂਰਨ ਵਰਗ ਦਾ ਸਿੱਧਾ ਘਣ ਕਰਨਾ ਗਲਤ ਹੈ; ਪਹਿਲਾਂ ਉਸ ਦਾ ਵਰਗਮੂਲ ਕੱਢਣਾ ਹੈ।",
    ],
    PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST: [
      "मूल संख्या का घनमूल लेना या अनुमानित मान को गोल करना गलत है; पहले एक जोड़ना और सही घनमूल लेना है।",
      "ਪਹਿਲੀ ਗਿਣਤੀ ਦਾ ਘਣਮੂਲ ਲੈਣਾ ਜਾਂ ਅੰਦਾਜ਼ੇ ਵਾਲਾ ਜਵਾਬ ਲੈਣਾ ਗਲਤ ਹੈ; ਪਹਿਲਾਂ ਇੱਕ ਜੋੜ ਕੇ ਸਹੀ ਘਣਮੂਲ ਲੈਣਾ ਹੈ।",
    ],
    PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST: [
      "एक जोड़े बिना वर्गमूल लेना या अक्षरों को संख्या से पहले लिखना दोनों गलत हैं।",
      "ਇੱਕ ਜੋੜੇ ਬਿਨਾਂ ਵਰਗਮੂਲ ਲੈਣਾ ਜਾਂ ਅੱਖਰਾਂ ਨੂੰ ਗਿਣਤੀ ਤੋਂ ਪਹਿਲਾਂ ਲਿਖਣਾ ਦੋਵੇਂ ਗਲਤ ਹਨ।",
    ],
    PROTO_DIGIT_SUM_SQUARE_SUCCESSOR: [
      "पुराने अक्षर पर निश्चित वर्णमाला-चाल लगाना गलत है; अक्षर नई संख्या से दोबारा निकाला जाता है।",
      "ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਤੈਅ ਥਾਵਾਂ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਕਰਨਾ ਗਲਤ ਹੈ; ਨਵਾਂ ਅੱਖਰ ਨਵੀਂ ਗਿਣਤੀ ਤੋਂ ਮੁੜ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ।",
    ],
  };
  return values[prototypeId][hindi ? 0 : 1];
}

function punjabiShiftTrace(letter: string, output: string, shift: number): string {
  if (shift > 0) return `${letter} ਤੋਂ ${shift} ਥਾਂ ਅੱਗੇ ਜਾਣ 'ਤੇ ${output}`;
  if (shift < 0) return `${letter} ਤੋਂ ${Math.abs(shift)} ਥਾਂ ਪਿੱਛੇ ਜਾਣ 'ਤੇ ${output}`;
  return `${letter} ਨਹੀਂ ਬਦਲਦਾ`;
}

function positionTrace(
  input: string,
  output: string,
  shifts: readonly number[],
  locale: ProvisionalMixedLocale,
): string {
  return [...input]
    .map((letter, index) => hi(locale)
      ? `${letter} को ${signed(shifts[index])} बदलने पर ${output[index]}`
      : punjabiShiftTrace(letter, output[index], shifts[index]))
    .join(hi(locale) ? ", और " : ", ਅਤੇ ");
}

function localizedDemonstration(
  prototypeId: ProvisionalEnglishPrototypeId,
  evidence: ReturnType<typeof renderDirectEnglishPrototype>["source"],
  locale: ProvisionalMixedLocale,
): string {
  const definition = ANA_CP008_ENGLISH_PROTOTYPES.find((entry) => entry.prototypeId === prototypeId);
  if (!definition) throw new Error(`Missing prototype ${prototypeId}`);
  const { input, output } = evidence;
  const context = definition.context;
  const hindi = hi(locale);

  switch (context.kind) {
    case "LETTER_GROUP_SCALAR": {
      if (input.kind !== "LETTER_GROUP" || output.kind !== "NUMBER") throw new Error("Localized scalar token mismatch.");
      const p1 = letterPosition(input.letters[0]);
      const p2 = letterPosition(input.letters[1]);
      const op = context.aggregate === "SUM" ? "+" : "×";
      return hindi
        ? `${input.letters} में ${input.letters[0]}=${p1} और ${input.letters[1]}=${p2}; इसलिए ${p1} ${op} ${p2} = ${output.number}।`
        : `${input.letters} ਵਿੱਚ ${input.letters[0]}=${p1} ਅਤੇ ${input.letters[1]}=${p2}; ਇਸ ਲਈ ${p1} ${op} ${p2} = ${output.number}।`;
    }
    case "LETTER_GROUP_TO_LETTER": {
      if (input.kind !== "LETTER_GROUP" || output.kind !== "LETTER") throw new Error("Localized derived-letter mismatch.");
      const p1 = letterPosition(input.letters[0]);
      const p2 = letterPosition(input.letters[1]);
      const total = p1 + p2;
      return hindi
        ? `${input.letters} में ${input.letters[0]}=${p1} और ${input.letters[1]}=${p2}; योग ${total} है और ${total}वाँ अक्षर ${output.letter} है।`
        : `${input.letters} ਵਿੱਚ ${input.letters[0]}=${p1} ਅਤੇ ${input.letters[1]}=${p2}; ਜੋੜ ${total} ਹੈ, ਇਸ ਲਈ ${total}ਵਾਂ ਅੱਖਰ ${output.letter} ਲੈਂਦੇ ਹਾਂ।`;
    }
    case "SINGLE_LETTER_POSITION_POWER": {
      if (input.kind !== "LETTER" || output.kind !== "NUMBER") throw new Error("Localized position-power mismatch.");
      const position = letterPosition(input.letter);
      return hindi
        ? `${input.letter} वर्णमाला का ${position}वाँ अक्षर है और ${position}² = ${output.number}।`
        : `${input.letter} ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ${position}ਵਾਂ ਅੱਖਰ ਹੈ ਅਤੇ ${position}² = ${output.number}।`;
    }
    case "INDEPENDENT_LETTER_NUMBER": {
      if (input.kind !== "LETTER_NUMBER" || output.kind !== "LETTER_NUMBER") throw new Error("Localized independent-token mismatch.");
      const sign = context.numberOperation === "ADD" ? "+" : "−";
      return hindi
        ? `${renderMixedToken(input)} में ${input.letter}${signed(context.letterShift)}=${output.letter}, जबकि ${input.number} ${sign} ${context.numberAmount} = ${output.number}; इसलिए ${renderMixedToken(output)} मिलता है।`
        : `${renderMixedToken(input)} ਵਿੱਚ ਅੱਖਰ ਬਦਲਣ ਨਾਲ ${input.letter}${signed(context.letterShift)}=${output.letter} ਅਤੇ ਗਿਣਤੀ ਬਦਲਣ ਨਾਲ ${input.number} ${sign} ${context.numberAmount} = ${output.number}; ਇਸ ਲਈ ${renderMixedToken(output)} ਮਿਲਦਾ ਹੈ।`;
    }
    case "CLUSTER_NUMBER_SHARED_DELTA": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized shared-delta mismatch.");
      return hindi
        ? `${renderMixedToken(input)} में ${positionTrace(input.letters, output.letters, [context.delta, context.delta], locale)}, और ${input.number}${signed(context.delta)}=${output.number}; परिणाम ${renderMixedToken(output)} है।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${positionTrace(input.letters, output.letters, [context.delta, context.delta], locale)} ਅਤੇ ${input.number}${signed(context.delta)}=${output.number}; ਇਸ ਲਈ ${renderMixedToken(output)} ਮਿਲਦਾ ਹੈ।`;
    }
    case "CLUSTER_NUMBER_INDEPENDENT_VECTOR": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized vector-delta mismatch.");
      return hi(locale)
        ? `${renderMixedToken(input)} में ${positionTrace(input.letters, output.letters, context.letterShifts, locale)}, और संख्या ${input.number}${signed(context.numberDelta)}=${output.number}; इसलिए ${renderMixedToken(output)} मिलता है।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${positionTrace(input.letters, output.letters, context.letterShifts, locale)} ਅਤੇ ਗਿਣਤੀ ਵਿੱਚ ${input.number}${signed(context.numberDelta)}=${output.number}; ਇਸ ਲਈ ${renderMixedToken(output)} ਮਿਲਦਾ ਹੈ।`;
    }
    case "CLUSTER_NUMBER_VECTOR_MULTIPLIER": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized cluster multiplier mismatch.");
      const arithmetic = context.denominator === 1
        ? `${input.number} × ${context.numerator} = ${output.number}`
        : `${input.number} × ${context.numerator} ÷ ${context.denominator} = ${output.number}`;
      return hindi
        ? `${renderMixedToken(input)} में ${positionTrace(input.letters, output.letters, context.letterShifts, locale)}, और ${arithmetic}; परिणाम ${renderMixedToken(output)} है।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${positionTrace(input.letters, output.letters, context.letterShifts, locale)} ਅਤੇ ${arithmetic}; ਇਸ ਲਈ ${renderMixedToken(output)} ਮਿਲਦਾ ਹੈ।`;
    }
    case "NUMBER_CLUSTER_VECTOR_MULTIPLIER": {
      if (input.kind !== "NUMBER_CLUSTER" || output.kind !== "NUMBER_CLUSTER") throw new Error("Localized number-first multiplier mismatch.");
      const arithmetic = context.denominator === 1
        ? `${input.number} × ${context.numerator} = ${output.number}`
        : `${input.number} × ${context.numerator} ÷ ${context.denominator} = ${output.number}`;
      return hindi
        ? `${renderMixedToken(input)} में ${arithmetic}, और ${positionTrace(input.letters, output.letters, context.letterShifts, locale)}; संख्या-पहले क्रम में परिणाम ${renderMixedToken(output)} है।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${arithmetic} ਅਤੇ ${positionTrace(input.letters, output.letters, context.letterShifts, locale)}; ਇਸ ਲਈ ਜਵਾਬ ਵਿੱਚ ਗਿਣਤੀ ਪਹਿਲਾਂ ਲਿਖ ਕੇ ${renderMixedToken(output)} ਮਿਲਦਾ ਹੈ।`;
    }
    case "CLUSTER_NUMBER_VECTOR_POWER": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized power mismatch.");
      const numeric = context.transform === "CUBE"
        ? `${input.number}³=${output.number}`
        : `${input.number}=${Math.sqrt(input.number)}² और ${Math.sqrt(input.number)}³=${output.number}`;
      return hindi
        ? `${renderMixedToken(input)} में ${positionTrace(input.letters, output.letters, context.letterShifts, locale)}, और ${numeric}; परिणाम ${renderMixedToken(output)} है।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${positionTrace(input.letters, output.letters, context.letterShifts, locale)} ਅਤੇ ${numeric.replace(" और ", " ਅਤੇ ")}; ਇਸ ਲਈ ${renderMixedToken(output)} ਮਿਲਦਾ ਹੈ।`;
    }
    case "CLUSTER_NUMBER_VECTOR_ROOT": {
      if (input.kind !== "CLUSTER_NUMBER" || output.kind !== "CLUSTER_NUMBER") throw new Error("Localized cube-root mismatch.");
      return hindi
        ? `${renderMixedToken(input)} में ${input.number}+1=${input.number + 1}=${output.number}³, इसलिए सही घनमूल ${output.number}; साथ में ${positionTrace(input.letters, output.letters, context.letterShifts, locale)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${input.number}+1=${input.number + 1}=${output.number}³, ਇਸ ਲਈ ਘਣਮੂਲ ${output.number} ਹੈ; ਅੱਖਰਾਂ ਵਿੱਚ ${positionTrace(input.letters, output.letters, context.letterShifts, locale)}।`;
    }
    case "NUMBER_CLUSTER_VECTOR_ROOT": {
      if (input.kind !== "NUMBER_CLUSTER" || output.kind !== "NUMBER_CLUSTER") throw new Error("Localized square-root mismatch.");
      return hindi
        ? `${renderMixedToken(input)} में ${input.number}+1=${input.number + 1}=${output.number}², इसलिए सही वर्गमूल ${output.number}; ${positionTrace(input.letters, output.letters, context.letterShifts, locale)} और संख्या-पहले क्रम में ${renderMixedToken(output)}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${input.number}+1=${input.number + 1}=${output.number}², ਇਸ ਲਈ ਵਰਗਮੂਲ ${output.number} ਹੈ; ${positionTrace(input.letters, output.letters, context.letterShifts, locale)} ਅਤੇ ਜਵਾਬ ਵਿੱਚ ਗਿਣਤੀ ਪਹਿਲਾਂ ਲਿਖ ਕੇ ${renderMixedToken(output)} ਮਿਲਦਾ ਹੈ।`;
    }
    case "NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR": {
      if (input.kind !== "NUMBER_LETTER" || output.kind !== "NUMBER_LETTER") throw new Error("Localized digit-square mismatch.");
      const firstSum = digitSum(input.number);
      const secondSum = digitSum(output.number);
      return hindi
        ? `${renderMixedToken(input)} में ${input.number} के अंकों का योग ${firstSum} और ${firstSum}²=${firstSum * firstSum}, इसलिए अक्षर ${input.letter}; संख्या ${output.number} होने पर योग ${secondSum} और ${secondSum}²=${secondSum * secondSum}, इसलिए ${output.letter}।`
        : `${renderMixedToken(input)} ਵਿੱਚ ${input.number} ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${firstSum} ਹੈ ਅਤੇ ${firstSum}²=${firstSum * firstSum}, ਇਸ ਲਈ ਅੱਖਰ ${input.letter} ਹੈ; ਗਿਣਤੀ ${output.number} ਹੋਣ 'ਤੇ ਜੋੜ ${secondSum} ਹੈ ਅਤੇ ${secondSum}²=${secondSum * secondSum}, ਇਸ ਲਈ ${output.letter}।`;
    }
  }
}

function directStem(
  sourceText: string,
  targetText: string,
  locale: ProvisionalMixedLocale,
  index: number,
): string {
  const hiStems = [
    `उस पद को चुनिए जो सादृश्य पूरा करता है: ${sourceText} :: ${targetText}`,
    `ऐसा लुप्त पद ज्ञात कीजिए जिससे दोनों युग्मों में एक ही संबंध रहे: ${sourceText} :: ${targetText}`,
    `प्रश्नवाचक चिह्न के स्थान पर आने वाला सही पद चुनिए: ${sourceText} :: ${targetText}`,
  ];
  const paStems = [
    `ਦੋਵੇਂ ਜੋੜਿਆਂ ਲਈ ਇੱਕੋ ਨਿਯਮ ਵਰਤ ਕੇ ਸਹੀ ਜਵਾਬ ਚੁਣੋ: ${sourceText} :: ${targetText}`,
    `ਖਾਲੀ ਥਾਂ ਲਈ ਉਹ ਜਵਾਬ ਲੱਭੋ ਜਿਸ ਨਾਲ ਦੋਵੇਂ ਜੋੜਿਆਂ ਵਿੱਚ ਇੱਕੋ ਸੰਬੰਧ ਬਣੇ: ${sourceText} :: ${targetText}`,
    `ਪ੍ਰਸ਼ਨ-ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਆਉਣ ਵਾਲਾ ਸਹੀ ਜਵਾਬ ਚੁਣੋ: ${sourceText} :: ${targetText}`,
  ];
  return (hi(locale) ? hiStems : paStems)[index % 3];
}

function oddStem(locale: ProvisionalMixedLocale, index: number): string {
  const hiStems = [
    "निम्न में से तीन युग्म एक ही संबंध का पालन करते हैं। उस युग्म को चुनिए जो समूह से भिन्न है।",
    "उस युग्म को चुनिए जिसमें अक्षर-संख्या संबंध अन्य तीन युग्मों से अलग है।",
    "तीन विकल्पों में एक ही नियम लगा है। वह विकल्प पहचानिए जिसमें यह नियम नहीं लगा है।",
  ];
  const paStems = [
    "ਹੇਠਾਂ ਦਿੱਤੇ ਤਿੰਨ ਜੋੜੇ ਇੱਕੋ ਨਿਯਮ ਨਾਲ ਬਣੇ ਹਨ। ਬਾਕੀਆਂ ਤੋਂ ਵੱਖਰਾ ਜੋੜਾ ਚੁਣੋ।",
    "ਉਹ ਜੋੜਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਅੱਖਰ ਅਤੇ ਗਿਣਤੀ ਦਾ ਸੰਬੰਧ ਬਾਕੀ ਤਿੰਨਾਂ ਤੋਂ ਵੱਖਰਾ ਹੈ।",
    "ਤਿੰਨ ਵਿਕਲਪ ਇੱਕੋ ਨਿਯਮ ਨਾਲ ਬਣੇ ਹਨ। ਉਹ ਵਿਕਲਪ ਚੁਣੋ ਜਿਸ ਉੱਤੇ ਇਹ ਨਿਯਮ ਨਹੀਂ ਲੱਗਦਾ।",
  ];
  return (hi(locale) ? hiStems : paStems)[index % 3];
}

export function renderLocalizedDirectPrototype(
  prototypeId: ProvisionalEnglishPrototypeId,
  locale: ProvisionalMixedLocale,
): LocalizedDirectPrototype {
  const english = renderDirectEnglishPrototype(prototypeId);
  const index = ANA_CP008_ENGLISH_PROTOTYPES.findIndex((entry) => entry.prototypeId === prototypeId);
  const sourceText = `${renderMixedToken(english.source.input)} : ${renderMixedToken(english.source.output)}`;
  const targetText = `${renderMixedToken(english.target.input)} : ?`;
  return {
    prototypeId,
    locale,
    task: "DIRECT_COMPLETION",
    stem: directStem(sourceText, targetText, locale, index),
    source: english.source,
    target: english.target,
    correctAnswer: english.correctAnswer,
    explanation: {
      ruleStatement: localizedRuleStatement(prototypeId, locale),
      sourceDemonstration: localizedDemonstration(prototypeId, english.source, locale),
      targetApplication: localizedDemonstration(prototypeId, english.target, locale),
      conclusion: hi(locale)
        ? `अतः ${renderMixedToken(english.correctAnswer)} सादृश्य को पूरा करता है।`
        : `ਇਸ ਲਈ ${renderMixedToken(english.correctAnswer)} ਸਹੀ ਜਵਾਬ ਹੈ ਅਤੇ ਦੋਵੇਂ ਜੋੜਿਆਂ ਵਿੱਚ ਇੱਕੋ ਸੰਬੰਧ ਬਣਦਾ ਹੈ।`,
      closestTrapRejection: localizedTrap(prototypeId, locale),
    },
    metadata: {
      permanentQlId: null,
      publiclyPublishable: false,
      maturity: "LANGUAGE_PROTOTYPE",
    },
  };
}

export function renderLocalizedOddPairPrototype(
  prototypeId: ProvisionalEnglishPrototypeId,
  locale: ProvisionalMixedLocale,
): LocalizedOddPairPrototype {
  const english = renderOddPairEnglishPrototype(prototypeId);
  const index = ANA_CP008_ENGLISH_PROTOTYPES.findIndex((entry) => entry.prototypeId === prototypeId);
  const definition = ANA_CP008_ENGLISH_PROTOTYPES[index];
  const validPairDemonstrations = english.options.slice(0, 3).map((option) =>
    localizedDemonstration(prototypeId, option, locale),
  ) as [string, string, string];
  const odd = english.options[english.correctIndex];
  const expected = definition
    ? renderDirectEnglishPrototype(prototypeId)
    : null;
  if (!expected) throw new Error(`Missing localized prototype ${prototypeId}`);
  const intendedOutput = (() => {
    const directDefinition = ANA_CP008_ENGLISH_PROTOTYPES.find((entry) => entry.prototypeId === prototypeId);
    if (!directDefinition) throw new Error(`Missing definition ${prototypeId}`);
    const output = provisionalMixedRuleById(directDefinition.ruleId).apply(odd.input, directDefinition.context);
    if (!output) throw new Error(`Cannot calculate localized odd-pair expectation for ${prototypeId}`);
    return output;
  })();

  return {
    prototypeId,
    locale,
    task: "ODD_PAIR_SELECTION",
    stem: oddStem(locale, index),
    options: english.options,
    correctIndex: english.correctIndex,
    explanation: {
      commonRule: localizedRuleStatement(prototypeId, locale),
      validPairDemonstrations,
      oddPairRejection: hi(locale)
        ? `${renderMixedToken(odd.input)} पर यही नियम लगाने से ${renderMixedToken(intendedOutput)} मिलना चाहिए, ${renderMixedToken(odd.output)} नहीं।`
        : `${renderMixedToken(odd.input)} ਉੱਤੇ ਇਹੋ ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ${renderMixedToken(intendedOutput)} ਮਿਲਣਾ ਚਾਹੀਦਾ ਹੈ, ${renderMixedToken(odd.output)} ਨਹੀਂ।`,
      conclusion: hi(locale)
        ? `अतः ${renderMixedToken(odd.input)} : ${renderMixedToken(odd.output)} वह युग्म है जो सामान्य नियम का पालन नहीं करता।`
        : `ਇਸ ਲਈ ${renderMixedToken(odd.input)} : ${renderMixedToken(odd.output)} ਬਾਕੀ ਜੋੜਿਆਂ ਵਾਲੇ ਨਿਯਮ ਨਾਲ ਨਹੀਂ ਬਣਦਾ।`,
    },
    metadata: {
      permanentQlId: null,
      publiclyPublishable: false,
      maturity: "LANGUAGE_PROTOTYPE",
    },
  };
}

export function renderAllLocalizedDirectPrototypes(
  locale: ProvisionalMixedLocale,
): readonly LocalizedDirectPrototype[] {
  return ANA_CP008_ENGLISH_PROTOTYPES.map((prototype) =>
    renderLocalizedDirectPrototype(prototype.prototypeId, locale),
  );
}

export function renderAllLocalizedOddPairPrototypes(
  locale: ProvisionalMixedLocale,
): readonly LocalizedOddPairPrototype[] {
  return ANA_CP008_ENGLISH_PROTOTYPES.map((prototype) =>
    renderLocalizedOddPairPrototype(prototype.prototypeId, locale),
  );
}
