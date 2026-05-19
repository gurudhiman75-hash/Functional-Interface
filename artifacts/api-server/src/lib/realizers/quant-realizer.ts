import type {
  NativeRealizerInput,
  NativeRealizerResult,
  RealizedLanguageBundle,
  RealizerLanguage,
} from "./types";
import {
  detectCoverageCategory,
  validateNativeBundle,
} from "./coverage";
import {
  isPercentageNativeInput,
  realizePercentagePedagogy,
} from "./percentage-pedagogy-realizer";

type QuantTemplateCategory =
  | "percentage"
  | "averages"
  | "profitLoss";

type QuantTemplateContext = {
  values: Record<string, unknown>;
  list: string;
  unit?: string;
  scenarioType?: string;
  motifId?: string;
  answer: number | string;
  isProfit?: boolean;
};

type QuantTemplate = {
  question: (
    context: QuantTemplateContext,
  ) => string | null;
  explanation: (
    context: QuantTemplateContext,
  ) => string | null;
};

const SCRIPT_CHECK: Record<
  Exclude<RealizerLanguage, "en">,
  RegExp
> = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
};

const UNIT_LABELS: Record<
  string,
  Record<RealizerLanguage, string>
> = {
  "km/h": {
    en: "km/h",
    hi: "किमी/घंटा",
    pa: "ਕਿਮੀ/ਘੰਟਾ",
  },
  kg: {
    en: "kg",
    hi: "किग्रा",
    pa: "ਕਿਲੋਗ੍ਰਾਮ",
  },
  km: {
    en: "km",
    hi: "किमी",
    pa: "ਕਿਮੀ",
  },
  m: {
    en: "m",
    hi: "मीटर",
    pa: "ਮੀਟਰ",
  },
  rupees: {
    en: "Rs.",
    hi: "रु.",
    pa: "ਰੁ.",
  },
  percent: {
    en: "%",
    hi: "%",
    pa: "%",
  },
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => String(item))
    : [];
}

function asRecord(
  value: unknown,
): Record<string, unknown> {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }
  if (typeof value === "string") {
    const parsed = Number(
      value.replace(/,/g, ""),
    );
    return Number.isFinite(parsed)
      ? parsed
      : null;
  }
  return null;
}

function pickNumber(
  values: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const candidate = asNumber(values[key]);
    if (candidate !== null) {
      return candidate;
    }
  }
  return null;
}

function extractNumberList(
  logic: Record<string, unknown>,
  values: Record<string, unknown>,
): number[] {
  const candidates = [
    values.list,
    values.numbers,
    values.items,
    logic.list,
    logic.numbers,
    logic.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const numbers = candidate
        .map(asNumber)
        .filter(
          (item): item is number =>
            item !== null,
        );
      if (numbers.length) {
        return numbers;
      }
    }
  }

  return [];
}

function stripMathDelimiters(value: string) {
  return value.replace(/\$/g, "");
}

function parseStemValues(
  input: NativeRealizerInput,
): Record<string, unknown> {
  const stem = stripMathDelimiters(
    input.question.text ?? "",
  );

  const percentageMatch = stem.match(
    /what\s+is\s+([-+]?\d+(?:\.\d+)?)\s*%\s+of\s+([-+]?\d+(?:\.\d+)?)/iu,
  );
  if (percentageMatch) {
    return {
      percent: Number(percentageMatch[1]),
      base: Number(percentageMatch[2]),
    };
  }

  const averageListMatch = stem.match(
    /average\s+of\s+([0-9.,\sand]+?)(?:\?|\.|$)/iu,
  );
  if (averageListMatch) {
    const numbers =
      averageListMatch[1]
        ?.match(/[-+]?\d+(?:\.\d+)?/gu)
        ?.map(Number) ?? [];
    if (numbers.length) {
      return { list: numbers };
    }
  }

  const profitLossMatch = stem.match(
    /bought\s+for\s+(?:rs\.?|₹)?\s*([-+]?\d+(?:\.\d+)?).*sold\s+for\s+(?:rs\.?|₹)?\s*([-+]?\d+(?:\.\d+)?)/iu,
  );
  if (profitLossMatch) {
    return {
      cp: Number(profitLossMatch[1]),
      sp: Number(profitLossMatch[2]),
    };
  }

  return {};
}

function extractStemNumbers(
  input: NativeRealizerInput,
): number[] {
  return (
    stripMathDelimiters(
      input.question.text ?? "",
    )
      .match(/[-+]?\d+(?:\.\d+)?/gu)
      ?.map(Number) ?? []
  );
}

function getQuantMotifId(
  input: NativeRealizerInput,
  logic: Record<string, unknown>,
) {
  const debug = asRecord(
    input.question.debugMetadata,
  );
  return String(
    logic.motifId ??
      logic.scenarioType ??
      debug.selectedMotif ??
      "",
  );
}

function nativePair(
  language: RealizerLanguage,
  hi: string,
  pa: string,
) {
  return language === "pa" ? pa : hi;
}

function localizePercentageMotifQuestion(
  motifId: string,
  numbers: number[],
  language: RealizerLanguage,
) {
  if (language === "en") return null;

  const t = (hi: string, pa: string) =>
    nativePair(language, hi, pa);
  const n = (index: number) =>
    String(numbers[index] ?? "");

  switch (motifId) {
    case "perc_cheaper_dearer_chain":
      return t(
        `दुकान A, दुकान B से ${n(0)}% सस्ती है और दुकान C से ${n(1)}% महंगी है। दुकान C, दुकान B से कितने प्रतिशत सस्ती है?`,
        `ਦੁਕਾਨ A, ਦੁਕਾਨ B ਨਾਲੋਂ ${n(0)}% ਸਸਤੀ ਹੈ ਅਤੇ ਦੁਕਾਨ C ਨਾਲੋਂ ${n(1)}% ਮਹਿੰਗੀ ਹੈ। ਦੁਕਾਨ C, ਦੁਕਾਨ B ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਸਸਤੀ ਹੈ?`,
      );
    case "perc_collection_ticket_change":
      return t(
        `टिकट की कीमत कम करने पर बिक्री ${n(0)}% बढ़ी, लेकिन कुल वसूली ${n(1)}% घट गई। टिकट की कीमत में कितने प्रतिशत कमी हुई?`,
        `ਟਿਕਟ ਦੀ ਕੀਮਤ ਘਟਾਉਣ ਤੋਂ ਬਾਅਦ ਵਿਕਰੀ ${n(0)}% ਵਧੀ, ਪਰ ਕੁੱਲ ਵਸੂਲੀ ${n(1)}% ਘਟ ਗਈ। ਟਿਕਟ ਦੀ ਕੀਮਤ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ ਹੋਈ?`,
      );
    case "perc_fraction_value_change":
      return t(
        `किसी भिन्न का अंश ${n(0)}% बढ़ाया गया और हर ${n(1)}% घटाया गया। भिन्न के मान में कितने प्रतिशत परिवर्तन होगा?`,
        `ਕਿਸੇ ਭਿੰਨ ਦਾ ਅੰਸ਼ ${n(0)}% ਵਧਾਇਆ ਗਿਆ ਅਤੇ ਹਰ ${n(1)}% ਘਟਾਇਆ ਗਿਆ। ਭਿੰਨ ਦੇ ਮੁੱਲ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਹੋਵੇਗਾ?`,
      );
    case "perc_income_savings_expense":
      return t(
        `एक व्यक्ति की आय ${n(0)} है। वह इसका ${n(1)}% बचाता है। यदि आय ${n(2)}% बढ़े लेकिन बचत समान रहे, तो खर्च में कितने प्रतिशत वृद्धि होगी?`,
        `ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਆਮਦਨ ${n(0)} ਹੈ। ਉਹ ਇਸ ਦਾ ${n(1)}% ਬਚਾਉਂਦਾ ਹੈ। ਜੇ ਆਮਦਨ ${n(2)}% ਵਧੇ ਪਰ ਬਚਤ ਉਹੀ ਰਹੇ, ਤਾਂ ਖਰਚ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਹੋਵੇਗਾ?`,
      );
    case "perc_weighted_group_change":
      return t(
        `एक केंद्र में ${n(0)} विद्यार्थियों वाले पहले समूह में ${n(1)}% वृद्धि होती है और ${n(2)} विद्यार्थियों वाले दूसरे समूह में ${n(3)}% वृद्धि होती है। कुल विद्यार्थियों में कितने प्रतिशत वृद्धि होगी?`,
        `ਇੱਕ ਕੇਂਦਰ ਵਿੱਚ ${n(0)} ਵਿਦਿਆਰਥੀਆਂ ਵਾਲੇ ਪਹਿਲੇ ਸਮੂਹ ਵਿੱਚ ${n(1)}% ਵਾਧਾ ਹੁੰਦਾ ਹੈ ਅਤੇ ${n(2)} ਵਿਦਿਆਰਥੀਆਂ ਵਾਲੇ ਦੂਜੇ ਸਮੂਹ ਵਿੱਚ ${n(3)}% ਵਾਧਾ ਹੁੰਦਾ ਹੈ। ਕੁੱਲ ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਹੋਵੇਗਾ?`,
      );
    case "perc_basic_of":
      return t(`${n(1)} का ${n(0)}% कितना है?`, `${n(1)} ਦਾ ${n(0)}% ਕਿੰਨਾ ਹੈ?`);
    case "perc_reverse_find":
      return t(`${n(0)}, किस संख्या का ${n(1)}% है?`, `${n(0)}, ਕਿਹੜੀ ਸੰਖਿਆ ਦਾ ${n(1)}% ਹੈ?`);
    case "perc_fraction_to_perc":
      return t(`${n(0)}/${n(1)} को प्रतिशत में बदलिए।`, `${n(0)}/${n(1)} ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।`);
    case "perc_decimal_to_perc":
      return t(`${n(0)} को प्रतिशत में बदलिए।`, `${n(0)} ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।`);
    case "perc_basic_sum":
      return t(`${n(1)} का ${n(0)}% और ${n(3)} का ${n(2)}% जोड़िए।`, `${n(1)} ਦਾ ${n(0)}% ਅਤੇ ${n(3)} ਦਾ ${n(2)}% ਜੋੜੋ।`);
    case "perc_marks_calc":
      return t(`एक विद्यार्थी ने ${n(0)} में से ${n(1)} अंक लिए। प्रतिशत ज्ञात कीजिए।`, `ਇੱਕ ਵਿਦਿਆਰਥੀ ਨੇ ${n(1)} ਵਿੱਚੋਂ ${n(0)} ਅੰਕ ਲਏ। ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`);
    case "perc_a_more_than_b":
      return t(`यदि A, B से ${n(0)}% अधिक है, तो B, A से कितने प्रतिशत कम है?`, `ਜੇ A, B ਤੋਂ ${n(0)}% ਵੱਧ ਹੈ, ਤਾਂ B, A ਤੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੈ?`);
    case "perc_price_increase":
      return t(`${n(0)} की कीमत ${n(1)}% बढ़ाई गई। नई कीमत ज्ञात कीजिए।`, `${n(0)} ਦੀ ਕੀਮਤ ${n(1)}% ਵਧਾਈ ਗਈ। ਨਵੀਂ ਕੀਮਤ ਪਤਾ ਕਰੋ।`);
    case "perc_price_decrease":
      return t(`${n(0)} की कीमत ${n(1)}% घटाई गई। नई कीमत ज्ञात कीजिए।`, `${n(0)} ਦੀ ਕੀਮਤ ${n(1)}% ਘਟਾਈ ਗਈ। ਨਵੀਂ ਕੀਮਤ ਪਤਾ ਕਰੋ।`);
    case "perc_salary_hike":
      return t(`वेतन ${n(0)} से ${n(1)} हो गया। प्रतिशत वृद्धि ज्ञात कीजिए।`, `ਤਨਖਾਹ ${n(0)} ਤੋਂ ${n(1)} ਹੋ ਗਈ। ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`);
    case "perc_population_growth":
      return t(`${n(0)} की जनसंख्या ${n(1)}% वार्षिक दर से 2 वर्ष बढ़ती है। अंतिम जनसंख्या ज्ञात कीजिए।`, `${n(0)} ਦੀ ਆਬਾਦੀ ${n(1)}% ਸਾਲਾਨਾ ਦਰ ਨਾਲ 2 ਸਾਲ ਵਧਦੀ ਹੈ। ਅੰਤਿਮ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।`);
    case "perc_machine_depreciation":
      return t(`${n(0)} मूल्य की मशीन हर वर्ष ${n(1)}% घटती है। 2 वर्ष बाद मूल्य ज्ञात कीजिए।`, `${n(0)} ਮੁੱਲ ਦੀ ਮਸ਼ੀਨ ਹਰ ਸਾਲ ${n(1)}% ਘਟਦੀ ਹੈ। 2 ਸਾਲ ਬਾਅਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।`);
    case "perc_sequential_spend":
      return t(`आय का ${n(0)}% किराये पर और शेष का ${n(1)}% भोजन पर खर्च होता है। आय ${n(2)} हो तो बची राशि ज्ञात कीजिए।`, `ਆਮਦਨ ਦਾ ${n(0)}% ਕਿਰਾਏ ਤੇ ਅਤੇ ਬਾਕੀ ਦਾ ${n(1)}% ਭੋਜਨ ਤੇ ਖਰਚ ਹੁੰਦਾ ਹੈ। ਆਮਦਨ ${n(2)} ਹੋਵੇ ਤਾਂ ਬਚੀ ਰਕਮ ਪਤਾ ਕਰੋ।`);
    case "perc_successive_hike":
      return t(`${n(0)} पर क्रमशः ${n(1)}% और ${n(2)}% वृद्धि होती है। अंतिम मान ज्ञात कीजिए।`, `${n(0)} ਤੇ ਲਗਾਤਾਰ ${n(1)}% ਅਤੇ ${n(2)}% ਵਾਧਾ ਹੁੰਦਾ ਹੈ। ਅੰਤਿਮ ਮੁੱਲ ਪਤਾ ਕਰੋ।`);
    case "perc_restore_value":
      return t(`${n(0)}% कटौती के बाद मूल मान वापस पाने के लिए कितने प्रतिशत वृद्धि चाहिए?`, `${n(0)}% ਕਟੌਤੀ ਤੋਂ ਬਾਅਦ ਮੂਲ ਮੁੱਲ ਵਾਪਸ ਕਰਨ ਲਈ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਦੀ ਲੋੜ ਹੈ?`);
    case "perc_compound_error":
      return t(`एक मान ${n(0)}% बढ़ता है और फिर ${n(0)}% घटता है। शुद्ध प्रतिशत परिवर्तन ज्ञात कीजिए।`, `ਇੱਕ ਮੁੱਲ ${n(0)}% ਵਧਦਾ ਹੈ ਅਤੇ ਫਿਰ ${n(0)}% ਘਟਦਾ ਹੈ। ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`);
    case "perc_vote_election":
      return t(`विजेता को ${n(0)}% वोट मिले और जीत का अंतर ${n(1)} वोट था। कुल वोट ज्ञात कीजिए।`, `ਜੇਤੂ ਨੂੰ ${n(0)}% ਵੋਟਾਂ ਮਿਲੀਆਂ ਅਤੇ ਜਿੱਤ ਦਾ ਅੰਤਰ ${n(1)} ਵੋਟਾਂ ਸੀ। ਕੁੱਲ ਵੋਟਾਂ ਪਤਾ ਕਰੋ।`);
    case "perc_exam_pass_fail":
      return t(`उम्मीदवार ने ${n(0)}% अंक लिए और ${n(1)} अंकों से असफल हुआ। पास प्रतिशत ${n(2)} है। अधिकतम अंक ज्ञात कीजिए।`, `ਉਮੀਦਵਾਰ ਨੇ ${n(0)}% ਅੰਕ ਲਏ ਅਤੇ ${n(1)} ਅੰਕਾਂ ਨਾਲ ਫੇਲ੍ਹ ਹੋਇਆ। ਪਾਸ ਪ੍ਰਤੀਸ਼ਤ ${n(2)} ਹੈ। ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ ਪਤਾ ਕਰੋ।`);
    case "perc_rect_length_increase":
      return t(`आयत की लंबाई ${n(0)}% बढ़ी और चौड़ाई ${n(1)}% घटी। क्षेत्रफल में प्रतिशत परिवर्तन ज्ञात कीजिए।`, `ਆਯਤ ਦੀ ਲੰਬਾਈ ${n(0)}% ਵਧੀ ਅਤੇ ਚੌੜਾਈ ${n(1)}% ਘਟੀ। ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`);
    case "perc_circle_radius_change":
      return t(`वृत्त की त्रिज्या ${n(0)}% बढ़ाई गई। क्षेत्रफल में प्रतिशत परिवर्तन ज्ञात कीजिए।`, `ਵ੍ਰਿੱਤ ਦੀ ਤ੍ਰਿਜਿਆ ${n(0)}% ਵਧਾਈ ਗਈ। ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`);
    case "perc_cube_volume_change":
      return t(`घन की भुजा ${n(0)}% बढ़ाई गई। आयतन में प्रतिशत परिवर्तन ज्ञात कीजिए।`, `ਘਣ ਦੀ ਭੁਜਾ ${n(0)}% ਵਧਾਈ ਗਈ। ਆਇਤਨ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`);
    case "perc_square_perimeter":
      return t(`वर्ग का परिमाप ${n(0)}% बढ़ता है। भुजा में प्रतिशत वृद्धि ज्ञात कीजिए।`, `ਵਰਗ ਦਾ ਪਰਿਮਾਪ ${n(0)}% ਵਧਦਾ ਹੈ। ਭੁਜਾ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`);
    case "perc_mixture_replacement":
      return t(`एक बर्तन में दूध और पानी का अनुपात ${n(0)}:${n(1)} है। ${n(2)} लीटर मिश्रण निकालकर पानी भर दिया जाता है। यदि नया अनुपात ${n(3)}:${n(4)} है, तो मूल मिश्रण की मात्रा ज्ञात कीजिए।`, `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਦੁੱਧ ਅਤੇ ਪਾਣੀ ਦਾ ਅਨੁਪਾਤ ${n(0)}:${n(1)} ਹੈ। ${n(2)} ਲੀਟਰ ਮਿਸ਼ਰਣ ਕੱਢ ਕੇ ਪਾਣੀ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਜੇ ਨਵਾਂ ਅਨੁਪਾਤ ${n(3)}:${n(4)} ਹੈ, ਤਾਂ ਮੂਲ ਮਿਸ਼ਰਣ ਦੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।`);
    case "perc_mixture_water_add":
      return t(`${n(0)} L मिश्रण में ${n(1)}% पानी है। पानी को ${n(2)}% करने के लिए कितना पानी मिलाया जाए?`, `${n(0)} L ਮਿਸ਼ਰਣ ਵਿੱਚ ${n(1)}% ਪਾਣੀ ਹੈ। ਪਾਣੀ ਨੂੰ ${n(2)}% ਕਰਨ ਲਈ ਕਿੰਨਾ ਪਾਣੀ ਮਿਲਾਇਆ ਜਾਵੇ?`);
    case "perc_fruit_dry_weight":
      return t(`ताजा फल ${n(0)} kg है और उसमें ${n(1)}% पानी है। सूखे फल में ${n(2)}% पानी है। सूखा वजन ज्ञात कीजिए।`, `ਤਾਜ਼ਾ ਫਲ ${n(0)} kg ਹੈ ਅਤੇ ਉਸ ਵਿੱਚ ${n(1)}% ਪਾਣੀ ਹੈ। ਸੁੱਕੇ ਫਲ ਵਿੱਚ ${n(2)}% ਪਾਣੀ ਹੈ। ਸੁੱਕਾ ਵਜ਼ਨ ਪਤਾ ਕਰੋ।`);
    case "perc_tax_income":
      return t(`आय ${n(0)} बढ़ती है और कर दर 20% से 15% हो जाती है। कुल कर समान रहे तो मूल आय ज्ञात कीजिए।`, `ਆਮਦਨ ${n(0)} ਵਧਦੀ ਹੈ ਅਤੇ ਕਰ ਦਰ 20% ਤੋਂ 15% ਹੋ ਜਾਂਦੀ ਹੈ। ਕੁੱਲ ਕਰ ਸਮਾਨ ਰਹੇ ਤਾਂ ਮੂਲ ਆਮਦਨ ਪਤਾ ਕਰੋ।`);
    case "perc_election_invalid":
      return t(`${n(0)}% मतदाताओं ने वोट नहीं डाला और डाले गए वोटों में से ${n(1)}% अमान्य थे। विजेता को वैध वोटों के ${n(2)}% मिले। कुल मतदाता ${n(3)} हैं। विजेता के वोट ज्ञात कीजिए।`, `${n(0)}% ਵੋਟਰਾਂ ਨੇ ਵੋਟ ਨਹੀਂ ਪਾਈ ਅਤੇ ਪਈਆਂ ਵੋਟਾਂ ਵਿੱਚੋਂ ${n(1)}% ਅਵੈਧ ਸਨ। ਜੇਤੂ ਨੂੰ ਵੈਧ ਵੋਟਾਂ ਦੇ ${n(2)}% ਮਿਲੇ। ਕੁੱਲ ਵੋਟਰ ${n(3)} ਹਨ। ਜੇਤੂ ਦੀਆਂ ਵੋਟਾਂ ਪਤਾ ਕਰੋ।`);
    case "perc_sales_commission":
      return t(`नियत वेतन ${n(0)} है और ${n(2)} से ऊपर बिक्री पर ${n(1)}% कमीशन मिलता है। बिक्री ${n(3)} हो तो कुल आय ज्ञात कीजिए।`, `ਨਿਸ਼ਚਿਤ ਤਨਖਾਹ ${n(0)} ਹੈ ਅਤੇ ${n(2)} ਤੋਂ ਵੱਧ ਵਿਕਰੀ ਤੇ ${n(1)}% ਕਮਿਸ਼ਨ ਮਿਲਦਾ ਹੈ। ਵਿਕਰੀ ${n(3)} ਹੋਵੇ ਤਾਂ ਕੁੱਲ ਆਮਦਨ ਪਤਾ ਕਰੋ।`);
    case "perc_price_consumption":
      return t(`चीनी की कीमत ${n(0)}% बढ़ती है। बजट समान रखने के लिए खपत कितने प्रतिशत घटानी होगी?`, `ਚੀਨੀ ਦੀ ਕੀਮਤ ${n(0)}% ਵਧਦੀ ਹੈ। ਬਜਟ ਸਮਾਨ ਰੱਖਣ ਲਈ ਖਪਤ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਉਣੀ ਹੋਵੇਗੀ?`);
    case "perc_population_gender":
      return t(`कुल जनसंख्या ${n(0)} है। पुरुष ${n(1)}% और महिलाएँ ${n(2)}% बढ़ती हैं, जिससे नई जनसंख्या ${n(3)} हो जाती है। मूल पुरुष जनसंख्या ज्ञात कीजिए।`, `ਕੁੱਲ ਆਬਾਦੀ ${n(0)} ਹੈ। ਮਰਦ ${n(1)}% ਅਤੇ ਔਰਤਾਂ ${n(2)}% ਵਧਦੀਆਂ ਹਨ, ਜਿਸ ਨਾਲ ਨਵੀਂ ਆਬਾਦੀ ${n(3)} ਹੋ ਜਾਂਦੀ ਹੈ। ਮੂਲ ਮਰਦ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।`);
    case "perc_alloy_composition":
      return t(`मिश्रधातु A में ${n(0)}% तांबा और B में ${n(1)}% तांबा है। ${n(2)}% तांबा पाने के लिए उन्हें किस अनुपात में मिलाएँ?`, `ਮਿਸ਼ਰ ਧਾਤ A ਵਿੱਚ ${n(0)}% ਤਾਂਬਾ ਅਤੇ B ਵਿੱਚ ${n(1)}% ਤਾਂਬਾ ਹੈ। ${n(2)}% ਤਾਂਬਾ ਲੈਣ ਲਈ ਉਨ੍ਹਾਂ ਨੂੰ ਕਿਸ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਵੇ?`);
    default:
      return null;
  }
}

function normalizeText(value: string) {
  return value.normalize("NFC");
}

export function formatQuantUnit(
  value: number | string,
  unit: string | undefined,
  language: RealizerLanguage,
): string {
  if (!unit) return String(value);

  const normalizedUnit =
    unit.trim().toLowerCase();
  const label =
    UNIT_LABELS[normalizedUnit]?.[
      language
    ] ?? unit;

  if (
    normalizedUnit === "rupees" ||
    normalizedUnit === "rs" ||
    normalizedUnit === "rs."
  ) {
    return language === "en"
      ? `Rs. ${value}`
      : `₹${value}`;
  }

  return `${value} ${label}`;
}

function joinNativeList(
  items: Array<number | string>,
  language: RealizerLanguage,
): string {
  const conjunction =
    language === "pa"
      ? "ਅਤੇ"
      : language === "hi"
        ? "और"
        : "and";
  const values = items.map(String);

  if (values.length <= 1) {
    return values.join("");
  }

  if (values.length === 2) {
    return `${values[0]} ${conjunction} ${values[1]}`;
  }

  return `${values
    .slice(0, -1)
    .join(", ")} ${conjunction} ${
    values[values.length - 1]
  }`;
}

function optionWithUnit(
  option: string,
  unit: string | undefined,
  language: RealizerLanguage,
) {
  const numeric = asNumber(
    option.replace(/[^\d.-]/g, ""),
  );
  if (numeric === null || !unit) {
    return option;
  }
  return formatQuantUnit(
    option,
    unit,
    language,
  );
}

const QUANT_TEMPLATES: Record<
  RealizerLanguage,
  Record<QuantTemplateCategory, QuantTemplate>
> = {
  en: {
    percentage: {
      question: ({ values }) => {
        const base = pickNumber(values, [
          "base",
          "value",
          "val1",
          "amount",
          "principal",
        ]);
        const percent = pickNumber(values, [
          "percent",
          "percentage",
          "val2",
          "rate",
        ]);
        if (
          base === null ||
          percent === null
        ) {
          return null;
        }
        return `What is ${percent}% of ${base}?`;
      },
      explanation: ({
        values,
        answer,
      }) => {
        const base = pickNumber(values, [
          "base",
          "value",
          "val1",
          "amount",
          "principal",
        ]);
        const percent = pickNumber(values, [
          "percent",
          "percentage",
          "val2",
          "rate",
        ]);
        if (
          base === null ||
          percent === null
        ) {
          return null;
        }
        return `Use Percentage = Base x Rate / 100.\nSubstitution: ${base} x ${percent} / 100 = ${answer}.`;
      },
    },
    averages: {
      question: ({ list, values }) => {
        if (list) {
          return `Find the average of ${list}.`;
        }
        const count = pickNumber(values, [
          "count",
          "n",
        ]);
        const average = pickNumber(values, [
          "average",
          "avg",
        ]);
        const knownSum = pickNumber(values, [
          "knownSum",
          "sum",
        ]);
        if (
          count === null ||
          average === null ||
          knownSum === null
        ) {
          return null;
        }
        return `The average of ${count} numbers is ${average}. If the sum of all but one number is ${knownSum}, find the missing number.`;
      },
      explanation: ({
        values,
        answer,
      }) => {
        const count = pickNumber(values, [
          "count",
          "n",
        ]);
        const average = pickNumber(values, [
          "average",
          "avg",
        ]);
        const totalSum =
          pickNumber(values, [
            "totalSum",
          ]) ??
          (count !== null &&
          average !== null
            ? count * average
            : null);
        const knownSum = pickNumber(values, [
          "knownSum",
          "sum",
        ]);
        if (
          count === null ||
          average === null ||
          totalSum === null
        ) {
          return null;
        }
        if (knownSum !== null) {
          return `Use Total = Average x Count.\nSubstitution: ${average} x ${count} = ${totalSum}.\nMissing number = ${totalSum} - ${knownSum} = ${answer}.`;
        }
        return `Use Average = Sum / Count.\nSubstitution gives the average as ${answer}.`;
      },
    },
    profitLoss: {
      question: ({
        values,
        isProfit,
      }) => {
        const cp = pickNumber(values, [
          "cp",
          "costPrice",
        ]);
        const sp = pickNumber(values, [
          "sp",
          "sellingPrice",
        ]);
        if (cp === null || sp === null) {
          return null;
        }
        return `An article is bought for Rs. ${cp} and sold for Rs. ${sp}. Find the ${isProfit ? "profit" : "loss"} percentage.`;
      },
      explanation: ({
        values,
        answer,
        isProfit,
      }) => {
        const cp = pickNumber(values, [
          "cp",
          "costPrice",
        ]);
        const sp = pickNumber(values, [
          "sp",
          "sellingPrice",
        ]);
        if (cp === null || sp === null) {
          return null;
        }
        const diff = Math.abs(sp - cp);
        const label = isProfit
          ? "Profit"
          : "Loss";
        return `${label} = |${sp} - ${cp}| = ${diff}.\n${label}% = (${diff}/${cp}) x 100 = ${answer}%.`;
      },
    },
  },
  hi: {
    percentage: {
      question: ({ values }) => {
        const base = pickNumber(values, [
          "base",
          "value",
          "val1",
          "amount",
          "principal",
        ]);
        const percent = pickNumber(values, [
          "percent",
          "percentage",
          "val2",
          "rate",
        ]);
        if (
          base === null ||
          percent === null
        ) {
          return null;
        }
        return `${base} का ${percent}% कितना है?`;
      },
      explanation: ({
        values,
        answer,
      }) => {
        const base = pickNumber(values, [
          "base",
          "value",
          "val1",
          "amount",
          "principal",
        ]);
        const percent = pickNumber(values, [
          "percent",
          "percentage",
          "val2",
          "rate",
        ]);
        if (
          base === null ||
          percent === null
        ) {
          return null;
        }
        return `सूत्र: प्रतिशत मान = आधार × दर / 100।\nप्रतिस्थापन: ${base} × ${percent} / 100 = ${answer}।`;
      },
    },
    averages: {
      question: ({ list, values }) => {
        if (list) {
          return `${list} का औसत ज्ञात कीजिए।`;
        }
        const count = pickNumber(values, [
          "count",
          "n",
        ]);
        const average = pickNumber(values, [
          "average",
          "avg",
        ]);
        const knownSum = pickNumber(values, [
          "knownSum",
          "sum",
        ]);
        if (
          count === null ||
          average === null ||
          knownSum === null
        ) {
          return null;
        }
        return `${count} संख्याओं का औसत ${average} है। यदि एक संख्या को छोड़कर बाकी संख्याओं का योग ${knownSum} है, तो छूटी हुई संख्या ज्ञात कीजिए।`;
      },
      explanation: ({
        values,
        answer,
      }) => {
        const count = pickNumber(values, [
          "count",
          "n",
        ]);
        const average = pickNumber(values, [
          "average",
          "avg",
        ]);
        const totalSum =
          pickNumber(values, [
            "totalSum",
          ]) ??
          (count !== null &&
          average !== null
            ? count * average
            : null);
        const knownSum = pickNumber(values, [
          "knownSum",
          "sum",
        ]);
        if (
          count === null ||
          average === null ||
          totalSum === null
        ) {
          return null;
        }
        if (knownSum !== null) {
          return `सूत्र: कुल योग = औसत × संख्या।\nप्रतिस्थापन: ${average} × ${count} = ${totalSum}।\nछूटी हुई संख्या = ${totalSum} - ${knownSum} = ${answer}।`;
        }
        return `सूत्र: औसत = योग / संख्या।\nप्रतिस्थापन से औसत ${answer} प्राप्त होता है।`;
      },
    },
    profitLoss: {
      question: ({
        values,
        isProfit,
      }) => {
        const cp = pickNumber(values, [
          "cp",
          "costPrice",
        ]);
        const sp = pickNumber(values, [
          "sp",
          "sellingPrice",
        ]);
        if (cp === null || sp === null) {
          return null;
        }
        return `एक वस्तु ₹${cp} में खरीदी गई और ₹${sp} में बेची गई। ${isProfit ? "लाभ" : "हानि"} प्रतिशत ज्ञात कीजिए।`;
      },
      explanation: ({
        values,
        answer,
        isProfit,
      }) => {
        const cp = pickNumber(values, [
          "cp",
          "costPrice",
        ]);
        const sp = pickNumber(values, [
          "sp",
          "sellingPrice",
        ]);
        if (cp === null || sp === null) {
          return null;
        }
        const diff = Math.abs(sp - cp);
        const label = isProfit
          ? "लाभ"
          : "हानि";
        return `${label} = |${sp} - ${cp}| = ${diff}।\n${label}% = (${diff}/${cp}) × 100 = ${answer}%।`;
      },
    },
  },
  pa: {
    percentage: {
      question: ({ values }) => {
        const base = pickNumber(values, [
          "base",
          "value",
          "val1",
          "amount",
          "principal",
        ]);
        const percent = pickNumber(values, [
          "percent",
          "percentage",
          "val2",
          "rate",
        ]);
        if (
          base === null ||
          percent === null
        ) {
          return null;
        }
        return `${base} ਦਾ ${percent}% ਕਿੰਨਾ ਹੈ?`;
      },
      explanation: ({
        values,
        answer,
      }) => {
        const base = pickNumber(values, [
          "base",
          "value",
          "val1",
          "amount",
          "principal",
        ]);
        const percent = pickNumber(values, [
          "percent",
          "percentage",
          "val2",
          "rate",
        ]);
        if (
          base === null ||
          percent === null
        ) {
          return null;
        }
        return `ਸੂਤਰ: ਪ੍ਰਤੀਸ਼ਤ ਮੁੱਲ = ਆਧਾਰ × ਦਰ / 100।\nਮੁੱਲ ਰੱਖਣ ਤੇ: ${base} × ${percent} / 100 = ${answer}।`;
      },
    },
    averages: {
      question: ({ list, values }) => {
        if (list) {
          return `${list} ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`;
        }
        const count = pickNumber(values, [
          "count",
          "n",
        ]);
        const average = pickNumber(values, [
          "average",
          "avg",
        ]);
        const knownSum = pickNumber(values, [
          "knownSum",
          "sum",
        ]);
        if (
          count === null ||
          average === null ||
          knownSum === null
        ) {
          return null;
        }
        return `${count} ਸੰਖਿਆਵਾਂ ਦੀ ਔਸਤ ${average} ਹੈ। ਜੇ ਇੱਕ ਸੰਖਿਆ ਤੋਂ ਇਲਾਵਾ ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਦਾ ਜੋੜ ${knownSum} ਹੈ, ਤਾਂ ਛੁੱਟੀ ਹੋਈ ਸੰਖਿਆ ਪਤਾ ਕਰੋ।`;
      },
      explanation: ({
        values,
        answer,
      }) => {
        const count = pickNumber(values, [
          "count",
          "n",
        ]);
        const average = pickNumber(values, [
          "average",
          "avg",
        ]);
        const totalSum =
          pickNumber(values, [
            "totalSum",
          ]) ??
          (count !== null &&
          average !== null
            ? count * average
            : null);
        const knownSum = pickNumber(values, [
          "knownSum",
          "sum",
        ]);
        if (
          count === null ||
          average === null ||
          totalSum === null
        ) {
          return null;
        }
        if (knownSum !== null) {
          return `ਸੂਤਰ: ਕੁੱਲ ਜੋੜ = ਔਸਤ × ਗਿਣਤੀ।\nਮੁੱਲ ਰੱਖਣ ਤੇ: ${average} × ${count} = ${totalSum}।\nਛੁੱਟੀ ਹੋਈ ਸੰਖਿਆ = ${totalSum} - ${knownSum} = ${answer}।`;
        }
        return `ਸੂਤਰ: ਔਸਤ = ਜੋੜ / ਗਿਣਤੀ।\nਮੁੱਲ ਰੱਖਣ ਤੇ ਔਸਤ ${answer} ਮਿਲਦੀ ਹੈ।`;
      },
    },
    profitLoss: {
      question: ({
        values,
        isProfit,
      }) => {
        const cp = pickNumber(values, [
          "cp",
          "costPrice",
        ]);
        const sp = pickNumber(values, [
          "sp",
          "sellingPrice",
        ]);
        if (cp === null || sp === null) {
          return null;
        }
        return `ਇੱਕ ਵਸਤੂ ₹${cp} ਵਿੱਚ ਖਰੀਦੀ ਗਈ ਅਤੇ ₹${sp} ਵਿੱਚ ਵੇਚੀ ਗਈ। ${isProfit ? "ਲਾਭ" : "ਹਾਨੀ"} ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`;
      },
      explanation: ({
        values,
        answer,
        isProfit,
      }) => {
        const cp = pickNumber(values, [
          "cp",
          "costPrice",
        ]);
        const sp = pickNumber(values, [
          "sp",
          "sellingPrice",
        ]);
        if (cp === null || sp === null) {
          return null;
        }
        const diff = Math.abs(sp - cp);
        const label = isProfit
          ? "ਲਾਭ"
          : "ਹਾਨੀ";
        return `${label} = |${sp} - ${cp}| = ${diff}।\n${label}% = (${diff}/${cp}) × 100 = ${answer}%।`;
      },
    },
  },
};

function detectQuantTemplateCategory(
  input: NativeRealizerInput,
  logic: Record<string, unknown>,
): QuantTemplateCategory | null {
  const haystack = [
    logic.topicCluster,
    logic.scenarioType,
    logic.motifId,
    logic.scenarioLogicBranch,
    input.patternId,
    input.question.section,
    input.question.topic,
    input.question.text,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    haystack.includes("profit") ||
    haystack.includes("loss") ||
    haystack.includes("discount")
  ) {
    return "profitLoss";
  }

  if (
    haystack.includes("average") ||
    haystack.includes("averages") ||
    haystack.includes("mean")
  ) {
    return "averages";
  }

  if (
    haystack.includes("percentage") ||
    haystack.includes("percent") ||
    haystack.includes("%")
  ) {
    return "percentage";
  }

  return null;
}

function makeUnsupported(
  language: RealizerLanguage,
  reason: string,
): NativeRealizerResult {
  return {
    supported: false,
    language,
    reason,
    coverageCategory: "quant",
    coveragePercent: 0,
    validation: {
      passed: false,
      diagnostics: [reason],
    },
  };
}

function buildTemplateContext(
  input: NativeRealizerInput,
  logic: Record<string, unknown>,
  language: RealizerLanguage,
): QuantTemplateContext {
  const motifId = getQuantMotifId(
    input,
    logic,
  );
  const values = {
    ...parseStemValues(input),
    ...asRecord(logic.values),
  };
  const listValues =
    extractNumberList(logic, values);
  const list = listValues.length
    ? joinNativeList(listValues, language)
    : "";
  const cp = pickNumber(values, [
    "cp",
    "costPrice",
  ]);
  const sp = pickNumber(values, [
    "sp",
    "sellingPrice",
  ]);
  const answer =
    asNumber(logic.correctAnswer) ??
    input.question.options[
      input.question.correct
    ] ??
    "";

  return {
    values,
    list,
    unit:
      typeof logic.unit === "string"
        ? logic.unit
        : typeof values.unit === "string"
          ? values.unit
          : undefined,
    scenarioType:
      typeof logic.scenarioType ===
      "string"
        ? logic.scenarioType
        : undefined,
    motifId,
    answer,
    isProfit:
      cp !== null && sp !== null
        ? sp >= cp
        : undefined,
  };
}

function buildNativeBundle(
  input: NativeRealizerInput,
  language: RealizerLanguage,
): RealizedLanguageBundle | null {
  const logic = asRecord(input.logic);
  const motifId = getQuantMotifId(
    input,
    logic,
  );
  const percentagePedagogyBundle =
    realizePercentagePedagogy(
      input,
      language,
    );

  if (percentagePedagogyBundle) {
    return percentagePedagogyBundle;
  }

  if (isPercentageNativeInput(input)) {
    return null;
  }

  const context = buildTemplateContext(
    input,
    logic,
    language,
  );
  const percentageQuestion =
    localizePercentageMotifQuestion(
      motifId,
      extractStemNumbers(input),
      language,
    );

  if (
    language !== "en" &&
    percentageQuestion
  ) {
    const answer =
      input.question.options[
        input.question.correct
      ] ?? "";
    const explanation =
      language === "pa"
        ? `ਸੂਤਰ ਵਿੱਚ ਦਿੱਤੇ ਪ੍ਰਤੀਸ਼ਤ ਮੁੱਲਾਂ ਨੂੰ ਰੱਖੋ।\nਅੰਤਿਮ ਉੱਤਰ = ${answer}।`
        : `सूत्र में दिए गए प्रतिशत मान रखें।\nअंतिम उत्तर = ${answer}।`;

    return {
      question: normalizeText(
        percentageQuestion,
      ),
      options: localizeQuantOptions(
        asStringArray(
          input.question.options,
        ),
        context,
        language,
      ),
      explanation:
        normalizeText(explanation),
    };
  }

  const category =
    detectQuantTemplateCategory(
      input,
      logic,
    );

  if (!category) return null;

  const templates =
    QUANT_TEMPLATES[language][
      category
    ];
  const question =
    templates.question(context);
  const explanation =
    templates.explanation(context);

  if (!question || !explanation) {
    return null;
  }

  return {
    question: normalizeText(question),
    options: localizeQuantOptions(
      asStringArray(input.question.options),
      context,
      language,
    ),
    explanation:
      normalizeText(explanation),
  };
}

export function quantRealizer(
  input: NativeRealizerInput,
  language: RealizerLanguage = "en",
): NativeRealizerResult {
  const coverageCategory =
    detectCoverageCategory(input);

  if (coverageCategory !== "quant") {
    return {
      supported: false,
      language,
      reason:
        "Quant realizer received a non-Quant logic object.",
      coverageCategory,
      coveragePercent: 0,
    };
  }

  if (language === "en") {
    const bundle =
      buildNativeBundle(input, "en") ?? {
        question:
          input.question.text ?? "",
        options: asStringArray(
          input.question.options,
        ),
        explanation:
          input.question.explanation ??
          "",
      };

    return {
      supported: true,
      language: "en",
      bundle,
      source: "canonical",
      coverageCategory: "quant",
      coveragePercent: 100,
      validation: validateNativeBundle(
        "en",
        bundle,
      ),
    };
  }

  const bundle = buildNativeBundle(
    input,
    language,
  );

  if (!bundle) {
    return makeUnsupported(
      language,
      `No native Quant template registered for ${language}.`,
    );
  }

  const validation = validateNativeBundle(
    language,
    bundle,
  );
  const scriptRegex =
    SCRIPT_CHECK[language];
  const combined = `${bundle.question}\n${bundle.explanation}`;

  if (
    !validation.passed ||
    !scriptRegex.test(combined)
  ) {
    return makeUnsupported(
      language,
      `Native Quant ${language} realization failed validation.`,
    );
  }

  return {
    supported: true,
    language,
    bundle,
    source: "native-realizer",
    coverageCategory: "quant",
    coveragePercent: 70,
    validation,
  };
}
