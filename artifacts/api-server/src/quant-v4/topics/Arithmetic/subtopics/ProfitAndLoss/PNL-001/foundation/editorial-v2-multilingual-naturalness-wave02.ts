import type { StructuredEditorialEntry } from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { buildAllNormalizedMultilingualEditorialLibraries as buildWave01Libraries } from "./editorial-v2-multilingual-normalizer";
import type { NativeEditorialLanguage } from "./editorial-v2-native-stems";

type TextReplacement = readonly [from: string, to: string];

const REPLACEMENTS: Readonly<
  Record<NativeEditorialLanguage, readonly TextReplacement[]>
> = {
  hi: [
    [
      "अज्ञात समूह की प्रति इकाई लागत",
      "जिस समूह की दर ज्ञात करनी है, उसकी प्रति इकाई लागत",
    ],
    ["अज्ञात समूह प्रतिशत", "दूसरे समूह का आवश्यक प्रतिशत"],
    ["अज्ञात समूह", "जिस समूह की दर या मात्रा ज्ञात करनी है"],
    ["व्यावसायिक क्रम", "खरीद, खर्च और बिक्री की जानकारी"],
    [
      "हर गणना को उसके वास्तविक व्यावसायिक अर्थ से जोड़कर देखें।",
      "हर गणना को वास्तविक लेन-देन के अर्थ से जोड़कर देखें।",
    ],
    ["वास्तविक व्यावसायिक अर्थ", "वास्तविक लेन-देन का अर्थ"],
    ["लक्षित परिणाम", "लक्ष्य के अनुसार परिणाम"],
    ["लक्षित", "लक्ष्य के अनुसार"],
    ["पुनर्निर्माण", "वापस निकालना"],
  ],
  pa: [
    [
      "ਅਣਜਾਣ ਸਮੂਹ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ",
      "ਜਿਸ ਸਮੂਹ ਦੀ ਦਰ ਪਤਾ ਕਰਨੀ ਹੈ, ਉਸ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ",
    ],
    ["ਅਣਜਾਣ ਸਮੂਹ ਪ੍ਰਤੀਸ਼ਤ", "ਦੂਜੇ ਸਮੂਹ ਦਾ ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ"],
    ["ਅਣਜਾਣ ਸਮੂਹ", "ਉਹ ਸਮੂਹ ਜਿਸ ਦੀ ਦਰ ਜਾਂ ਮਾਤਰਾ ਪਤਾ ਕਰਨੀ ਹੈ"],
    ["ਵਪਾਰਕ ਕ੍ਰਮ", "ਖਰੀਦ, ਖਰਚ ਅਤੇ ਵਿਕਰੀ ਦੀ ਜਾਣਕਾਰੀ"],
    [
      "ਹਰ ਗਣਨਾ ਨੂੰ ਉਸ ਦੇ ਅਸਲ ਵਪਾਰਕ ਅਰਥ ਨਾਲ ਜੋੜ ਕੇ ਵੇਖੋ।",
      "ਹਰ ਗਿਣਤੀ ਨੂੰ ਅਸਲ ਲੈਣ-ਦੇਣ ਦੇ ਅਰਥ ਨਾਲ ਜੋੜ ਕੇ ਵੇਖੋ।",
    ],
    ["ਵਪਾਰਕ ਅਰਥ", "ਲੈਣ-ਦੇਣ ਦਾ ਅਰਥ"],
    ["ਲਕਸ਼ਿਤ ਨਤੀਜਾ", "ਟੀਚੇ ਅਨੁਸਾਰ ਨਤੀਜਾ"],
    ["ਲਕਸ਼ਿਤ", "ਟੀਚੇ ਅਨੁਸਾਰ"],
    ["ਪੁਨਰਨਿਰਮਾਣ", "ਵਾਪਸ ਕੱਢਣਾ"],
    ["ਪਰਯਾਪਤਾ", "ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ"],
  ],
};

const OPENING_VARIANTS: Readonly<Record<NativeEditorialLanguage, readonly string[]>> = {
  hi: [
    "{opening} प्रश्न की अंतिम मांग को भी साथ रखें: “{target}”।",
    "यहाँ पूछा गया है: “{target}”। {opening}",
    "{opening} गणना का हर चरण इसी मांग तक पहुँचना चाहिए: “{target}”।",
    "पहले प्रश्न की मांग पढ़ें—“{target}”। {opening}",
    "{opening} उत्तर किस रूप में चाहिए, यह मांग साफ करती है: “{target}”।",
    "दिए आँकड़ों को इस अंतिम मांग के अनुसार व्यवस्थित करें: “{target}”। {opening}",
    "{opening} बीच की गणना करते समय अंतिम मांग न भूलें: “{target}”।",
    "इस सवाल का लक्ष्य है: “{target}”। {opening}",
  ],
  pa: [
    "{opening} ਸਵਾਲ ਦੀ ਅੰਤਿਮ ਮੰਗ ਵੀ ਨਾਲ ਰੱਖੋ: “{target}”।",
    "ਇੱਥੇ ਪੁੱਛਿਆ ਗਿਆ ਹੈ: “{target}”। {opening}",
    "{opening} ਗਿਣਤੀ ਦਾ ਹਰ ਪੜਾਅ ਇਸ ਮੰਗ ਤੱਕ ਪਹੁੰਚਣਾ ਚਾਹੀਦਾ ਹੈ: “{target}”।",
    "ਪਹਿਲਾਂ ਸਵਾਲ ਦੀ ਮੰਗ ਪੜ੍ਹੋ—“{target}”। {opening}",
    "{opening} ਉੱਤਰ ਕਿਸ ਰੂਪ ਵਿੱਚ ਚਾਹੀਦਾ ਹੈ, ਇਹ ਮੰਗ ਸਾਫ਼ ਕਰਦੀ ਹੈ: “{target}”।",
    "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਨੂੰ ਇਸ ਅੰਤਿਮ ਮੰਗ ਅਨੁਸਾਰ ਲਗਾਓ: “{target}”। {opening}",
    "{opening} ਵਿਚਕਾਰਲੀ ਗਿਣਤੀ ਕਰਦੇ ਸਮੇਂ ਅੰਤਿਮ ਮੰਗ ਨਾ ਭੁੱਲੋ: “{target}”।",
    "ਇਸ ਸਵਾਲ ਦਾ ਟੀਚਾ ਹੈ: “{target}”। {opening}",
  ],
};

const CONCEPT_VARIANTS: Readonly<Record<NativeEditorialLanguage, readonly string[]>> = {
  hi: [
    "इस नियम को इसी मांग पर लागू करना है: “{target}”।",
    "इसी आधार से “{target}” का उत्तर निकलेगा।",
    "अवधारणा तभी पूरी होती है जब वह इस मांग तक पहुँचे: “{target}”।",
    "यहाँ नियम का उपयोग खास तौर पर “{target}” के लिए किया गया है।",
    "इस प्रश्न में हर राशि को “{target}” से जोड़कर पढ़ें।",
    "सही आधार चुनने का उद्देश्य “{target}” को निश्चित करना है।",
    "लेन-देन का अर्थ समझने के बाद “{target}” सीधे तय किया जा सकता है।",
    "इस अवधारणा की अंतिम जाँच “{target}” के अनुसार करें।",
  ],
  pa: [
    "ਇਹ ਨਿਯਮ ਇਸੇ ਮੰਗ ਉੱਤੇ ਲਾਗੂ ਕਰਨਾ ਹੈ: “{target}”।",
    "ਇਸੇ ਆਧਾਰ ਤੋਂ “{target}” ਦਾ ਉੱਤਰ ਨਿਕਲੇਗਾ।",
    "ਧਾਰਨਾ ਤਦੋਂ ਪੂਰੀ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਇਹ ਇਸ ਮੰਗ ਤੱਕ ਪਹੁੰਚੇ: “{target}”।",
    "ਇੱਥੇ ਨਿਯਮ ਖਾਸ ਤੌਰ 'ਤੇ “{target}” ਲਈ ਵਰਤਿਆ ਗਿਆ ਹੈ।",
    "ਇਸ ਸਵਾਲ ਵਿੱਚ ਹਰ ਰਕਮ ਨੂੰ “{target}” ਨਾਲ ਜੋੜ ਕੇ ਪੜ੍ਹੋ।",
    "ਸਹੀ ਆਧਾਰ ਚੁਣਨ ਦਾ ਮਕਸਦ “{target}” ਨੂੰ ਪੱਕਾ ਕਰਨਾ ਹੈ।",
    "ਲੈਣ-ਦੇਣ ਦਾ ਅਰਥ ਸਮਝਣ ਤੋਂ ਬਾਅਦ “{target}” ਸਿੱਧਾ ਤੈਅ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
    "ਇਸ ਧਾਰਨਾ ਦੀ ਅੰਤਿਮ ਜਾਂਚ “{target}” ਅਨੁਸਾਰ ਕਰੋ।",
  ],
};

const CONCLUSION_VARIANTS: Readonly<Record<NativeEditorialLanguage, readonly string[]>> = {
  hi: [
    "यही परिणाम प्रश्न की अंतिम मांग—“{target}”—को पूरा करता है।",
    "इससे “{target}” का उत्तर निश्चित हो जाता है।",
    "अंतिम मान सीधे मांगी गई बात देता है: “{target}”।",
    "इस गणना के बाद “{target}” स्पष्ट रूप से मिल जाता है।",
    "प्राप्त परिणाम को प्रश्न की मांग “{target}” के रूप में पढ़ें।",
    "इसी मान से “{target}” का सही निष्कर्ष निकलता है।",
    "अब प्रश्न में मांगा गया परिणाम—“{target}”—पूरी तरह तय है।",
    "अंतिम जाँच भी “{target}” के साथ मेल खाती है।",
  ],
  pa: [
    "ਇਹੀ ਨਤੀਜਾ ਸਵਾਲ ਦੀ ਅੰਤਿਮ ਮੰਗ—“{target}”—ਨੂੰ ਪੂਰਾ ਕਰਦਾ ਹੈ।",
    "ਇਸ ਨਾਲ “{target}” ਦਾ ਉੱਤਰ ਪੱਕਾ ਹੋ ਜਾਂਦਾ ਹੈ।",
    "ਅੰਤਿਮ ਮੁੱਲ ਸਿੱਧਾ ਮੰਗੀ ਗਈ ਗੱਲ ਦਿੰਦਾ ਹੈ: “{target}”।",
    "ਇਸ ਗਿਣਤੀ ਤੋਂ ਬਾਅਦ “{target}” ਸਪਸ਼ਟ ਤੌਰ 'ਤੇ ਮਿਲ ਜਾਂਦਾ ਹੈ।",
    "ਮਿਲੇ ਨਤੀਜੇ ਨੂੰ ਸਵਾਲ ਦੀ ਮੰਗ “{target}” ਦੇ ਰੂਪ ਵਿੱਚ ਪੜ੍ਹੋ।",
    "ਇਸੇ ਮੁੱਲ ਤੋਂ “{target}” ਦਾ ਸਹੀ ਨਿਸ਼ਕਰਸ਼ ਨਿਕਲਦਾ ਹੈ।",
    "ਹੁਣ ਸਵਾਲ ਵਿੱਚ ਮੰਗਿਆ ਨਤੀਜਾ—“{target}”—ਪੂਰੀ ਤਰ੍ਹਾਂ ਤੈਅ ਹੈ।",
    "ਅੰਤਿਮ ਜਾਂਚ ਵੀ “{target}” ਨਾਲ ਮੇਲ ਖਾਂਦੀ ਹੈ।",
  ],
};

const TRAP_VARIANTS: Readonly<Record<NativeEditorialLanguage, readonly string[]>> = {
  hi: [
    "जाँचते समय प्रश्न की मांग—“{target}”—से आधार न बदलें।",
    "गलत विकल्प अक्सर “{target}” के बजाय किसी बीच की राशि को उत्तर मान लेता है।",
    "हर प्रतिशत को उसी राशि पर लगाएँ जो “{target}” निकालने के लिए जरूरी है।",
    "अंतिम विकल्प चुनने से पहले उसे “{target}” से अवश्य मिलाएँ।",
    "बीच का सही मान भी अंतिम उत्तर नहीं है, जब तक वह “{target}” न देता हो।",
    "इकाई, दिशा और आधार तीनों को “{target}” के अनुसार जाँचें।",
    "उलटी गणना में भी लक्ष्य “{target}” ही रहना चाहिए।",
    "किसी परिचित सूत्र को लगाने से पहले देखें कि वह सच में “{target}” देता है या नहीं।",
  ],
  pa: [
    "ਜਾਂਚਦੇ ਸਮੇਂ ਸਵਾਲ ਦੀ ਮੰਗ—“{target}”—ਤੋਂ ਆਧਾਰ ਨਾ ਬਦਲੋ।",
    "ਗਲਤ ਵਿਕਲਪ ਅਕਸਰ “{target}” ਦੀ ਥਾਂ ਕਿਸੇ ਵਿਚਕਾਰਲੀ ਰਕਮ ਨੂੰ ਉੱਤਰ ਮੰਨ ਲੈਂਦਾ ਹੈ।",
    "ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਉਸੇ ਰਕਮ ਉੱਤੇ ਲਗਾਓ ਜੋ “{target}” ਕੱਢਣ ਲਈ ਲੋੜੀਂਦੀ ਹੈ।",
    "ਅੰਤਿਮ ਵਿਕਲਪ ਚੁਣਨ ਤੋਂ ਪਹਿਲਾਂ ਉਸ ਨੂੰ “{target}” ਨਾਲ ਜ਼ਰੂਰ ਮਿਲਾਓ।",
    "ਵਿਚਕਾਰਲਾ ਸਹੀ ਮੁੱਲ ਵੀ ਅੰਤਿਮ ਉੱਤਰ ਨਹੀਂ, ਜਦ ਤੱਕ ਉਹ “{target}” ਨਾ ਦੇਵੇ।",
    "ਇਕਾਈ, ਦਿਸ਼ਾ ਅਤੇ ਆਧਾਰ ਤਿੰਨਾਂ ਨੂੰ “{target}” ਅਨੁਸਾਰ ਜਾਂਚੋ।",
    "ਉਲਟੀ ਗਿਣਤੀ ਵਿੱਚ ਵੀ ਟੀਚਾ “{target}” ਹੀ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।",
    "ਕੋਈ ਜਾਣਿਆ ਸੂਤਰ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਉਹ ਸੱਚਮੁੱਚ “{target}” ਦਿੰਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।",
  ],
};

const STEP_TITLE_VARIANTS: Readonly<Record<NativeEditorialLanguage, readonly string[]>> = {
  hi: [
    "दिए आँकड़ों से — {title}",
    "सही आधार पर — {title}",
    "इस चरण में {title}",
    "अब {title}",
    "प्रश्न की शर्त के अनुसार — {title}",
    "संबंधित राशि पर — {title}",
    "जाँच के साथ — {title}",
    "क्रमवार — {title}",
  ],
  pa: [
    "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ — {title}",
    "ਸਹੀ ਆਧਾਰ ਉੱਤੇ — {title}",
    "ਇਸ ਪੜਾਅ ਵਿੱਚ {title}",
    "ਹੁਣ {title}",
    "ਸਵਾਲ ਦੀ ਸ਼ਰਤ ਅਨੁਸਾਰ — {title}",
    "ਸਬੰਧਤ ਰਕਮ ਉੱਤੇ — {title}",
    "ਜਾਂਚ ਸਮੇਤ — {title}",
    "ਕ੍ਰਮਵਾਰ — {title}",
  ],
};

function qlNumber(qlId: string): number {
  const value = Number(qlId.split("-").at(-1));
  return Number.isFinite(value) ? value : 1;
}

function applyReplacements(
  language: NativeEditorialLanguage,
  value: string,
): string {
  return REPLACEMENTS[language].reduce(
    (output, [from, to]) => output.split(from).join(to),
    value,
  );
}

function mapText<T>(
  language: NativeEditorialLanguage,
  value: T,
  propertyName = "",
): T {
  if (typeof value === "string") {
    return (/latex/i.test(propertyName)
      ? value
      : applyReplacements(language, value)) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => mapText(language, item, propertyName)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        mapText(language, item, key),
      ]),
    ) as T;
  }
  return value;
}

function targetText(
  language: NativeEditorialLanguage,
  entry: StructuredEditorialEntry,
): string {
  const fallback =
    language === "hi" ? "मांगा गया परिणाम ज्ञात कीजिए" : "ਮੰਗਿਆ ਨਤੀਜਾ ਪਤਾ ਕਰੋ";
  return (entry.stem.prompt.trim() || fallback)
    .replace(/[?？।.]+$/u, "")
    .trim();
}

function fill(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  return Object.entries(values).reduce(
    (output, [key, value]) => output.split(`{${key}}`).join(value),
    template,
  );
}

function naturalizeEntry(
  language: NativeEditorialLanguage,
  qlId: string,
  sourceEntry: StructuredEditorialEntry,
): StructuredEditorialEntry {
  const entry = mapText(language, sourceEntry);
  const target = targetText(language, entry);
  const variant = qlNumber(qlId) % OPENING_VARIANTS[language].length;

  return {
    ...entry,
    explanation: {
      ...entry.explanation,
      opening: fill(OPENING_VARIANTS[language][variant]!, {
        opening: entry.explanation.opening,
        target,
      }),
      concept: `${entry.explanation.concept} ${fill(CONCEPT_VARIANTS[language][variant]!, { target })}`,
      steps: entry.explanation.steps.map((step, stepIndex) => ({
        ...step,
        title: fill(
          STEP_TITLE_VARIANTS[language][
            (variant + stepIndex) % STEP_TITLE_VARIANTS[language].length
          ]!,
          { title: step.title },
        ),
      })),
      conclusion: `${entry.explanation.conclusion} ${fill(CONCLUSION_VARIANTS[language][variant]!, { target })}`,
      commonTrap: entry.explanation.commonTrap
        ? `${entry.explanation.commonTrap} ${fill(TRAP_VARIANTS[language][variant]!, { target })}`
        : entry.explanation.commonTrap,
    },
  };
}

function naturalizeLibrary(library: EditorialLibraryFile): EditorialLibraryFile {
  const language = library.language as NativeEditorialLanguage;
  return {
    ...library,
    entries: Object.fromEntries(
      Object.entries(library.entries).map(([qlId, entry]) => [
        qlId,
        naturalizeEntry(language, qlId, entry),
      ]),
    ),
  };
}

export function buildAllNormalizedMultilingualEditorialLibraries(): readonly EditorialLibraryFile[] {
  return buildWave01Libraries().map(naturalizeLibrary);
}
