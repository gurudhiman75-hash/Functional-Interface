import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import type {
  IntCp004LocalizedExplanation,
  IntCp004LocalizedLocale,
  IntCp004LocalizedOption,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_HUMAN_EDITORIAL_V7_VERSION =
  "INT-CP-004-HI-PA-HUMAN-EDITORIAL-v7" as const;

function removeRedundantDivisionByOne(text: string): string {
  return text
    .replace(/([₹\d][₹\d.,%/]*)\s*÷\s*1(?!\d)\s*=\s*([₹\d][₹\d.,%/]*)/gu, "$2")
    .replace(/([₹\d][₹\d.,%/]*)\s*÷\s*1(?!\d)/gu, "$1");
}

function creditInterval(locale: IntCp004LocalizedLocale, frequency: number): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "हर वर्ष";
      case 2: return "हर छमाही";
      case 4: return "हर तिमाही";
      case 12: return "हर महीने";
      default: return "हर बार";
    }
  }
  switch (frequency) {
    case 1: return "ਹਰ ਸਾਲ";
    case 2: return "ਹਰ ਛਿਮਾਹੀ";
    case 4: return "ਹਰ ਤਿਮਾਹੀ";
    case 12: return "ਹਰ ਮਹੀਨੇ";
    default: return "ਹਰ ਵਾਰ";
  }
}

function periodicRateName(locale: IntCp004LocalizedLocale, frequency: number): string {
  if (locale === "hi-IN") {
    switch (frequency) {
      case 1: return "वार्षिक";
      case 2: return "छमाही";
      case 4: return "तिमाही";
      case 12: return "मासिक";
      default: return "प्रति-अंतराल";
    }
  }
  switch (frequency) {
    case 1: return "ਸਾਲਾਨਾ";
    case 2: return "ਛਿਮਾਹੀ";
    case 4: return "ਤਿਮਾਹੀ";
    case 12: return "ਮਾਸਿਕ";
    default: return "ਹਰ ਅੰਤਰਾਲ ਦੀ";
  }
}

type HindiPeriod = Readonly<{ singular: string; oblique: string }>;

function hindiPeriod(raw: string): HindiPeriod {
  switch (raw) {
    case "तिमाहियाँ": return { singular: "तिमाही", oblique: "तिमाहियों" };
    case "छमाहियाँ": return { singular: "छमाही", oblique: "छमाहियों" };
    case "महीने": return { singular: "महीने", oblique: "महीनों" };
    case "वर्ष": return { singular: "वर्ष", oblique: "वर्षों" };
    default: return { singular: raw, oblique: raw };
  }
}

function punjabiPeriod(raw: string): Readonly<{ oblique: string }> {
  switch (raw) {
    case "ਤਿਮਾਹੀਆਂ": return { oblique: "ਤਿਮਾਹੀਆਂ" };
    case "ਛਿਮਾਹੀਆਂ": return { oblique: "ਛਿਮਾਹੀਆਂ" };
    case "ਮਹੀਨੇ": return { oblique: "ਮਹੀਨਿਆਂ" };
    case "ਸਾਲ": return { oblique: "ਸਾਲਾਂ" };
    default: return { oblique: raw };
  }
}

function fixHindiPeriodAgreement(text: string): string {
  return text.replace(
    /(\d+) (तिमाहियाँ|छमाहियाँ|महीने|वर्ष) लिए गए हैं/gu,
    (_match, count: string, rawPeriod: string) => {
      const period = hindiPeriod(rawPeriod);
      return `${count} ${period.oblique} की गणना की गई है`;
    },
  );
}

function fixPunjabiEditorialGrammar(text: string): string {
  return text
    .replace(
      /(\d+) (ਤਿਮਾਹੀਆਂ|ਛਿਮਾਹੀਆਂ|ਮਹੀਨੇ|ਸਾਲ) ਲਏ ਗਏ ਹਨ/gu,
      (_match, count: string, rawPeriod: string) => {
        const period = punjabiPeriod(rawPeriod);
        return `${count} ${period.oblique} ਦੀ ਗਿਣਤੀ ਕੀਤੀ ਗਈ ਹੈ`;
      },
    )
    .replace(/ਵਿਆਜ ਜੋੜਨ ਦਾ ਗੁਣਕ ਨਾਲ/gu, "ਵਿਆਜ ਗੁਣਕ ਨਾਲ")
    .replace(/ਸਾਰੀਆਂ ਮਿਸ਼ਰਤ ਵਿਆਜਆਂ/gu, "ਵਿਆਜ ਜੋੜਨ ਦੇ ਸਾਰੇ ਪੜਾਅ")
    .replace(/ਦੇ ਸਧਾਰਣ ਵਿਆਜ ਬਾਅਦ/gu, "ਦੇ ਸਧਾਰਣ ਵਿਆਜ ਤੋਂ ਬਾਅਦ")
    .replace(/ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ/gu, "ਅਸਲ ਵਾਧਾ ਦਰ")
    .replace(/ਲਿਖੀ ਹੋਈ ਸਾਲਾਨਾ ਦਰ/gu, "ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ")
    .replace(/ਵੱਧ ਰਕਮ ਕਿੰਨੀ ਵੱਧ ਹੋਵੇਗੀ/gu, "ਦੋਵੇਂ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ")
    .replace(/ਹਰ ਵਿਆਜ ਅੰਤਰਾਲ/gu, "ਹਰ ਵਾਰ ਵਿਆਜ ਜੁੜਨ ਦਾ ਅੰਤਰਾਲ")
    .replace(/ਵਾਧਾ ਦਰ ਕਿੰਨਾ/gu, "ਵਾਧਾ ਦਰ ਕਿੰਨੀ")
    .replace(/ਵਾਧਾ ਦਰ ਕਿੰਨੀ ਹੋਵੇਗਾ/gu, "ਵਾਧਾ ਦਰ ਕਿੰਨੀ ਹੋਵੇਗੀ")
    .replace(/ਹਰ ਸੰਭਵ ਕ੍ਰਮ/gu, "ਵਿਆਜ ਜੋੜਨ ਦੇ ਹਰ ਸੰਭਵ ਅੰਤਰਾਲ");
}

function humanizeHindiStem(text: string): string {
  return fixHindiPeriodAgreement(text
    .replace(/^एक राशि (₹[\d,.]+) है। उस पर /u, "$1 पर ")
    .replace(/^एक निवेश (₹[\d,.]+) है।/u, "$1 का निवेश किया गया है।")
    .replace(/प्रत्येक ब्याज-अंतराल की दर/gu, "हर बार ब्याज जुड़ने की दर")
    .replace(/ब्याज जोड़ने का नियम (हर (?:वर्ष|छमाही|तिमाही|महीने)) था/gu, "ब्याज $1 जोड़ा जाता था")
    .replace(/ब्याज जोड़ने की आवृत्ति पहचानिए।/gu, "बताइए कि ब्याज वर्ष में कितनी बार जोड़ा गया था।")
    .replace(/एक वर्ष की वास्तविक प्रतिशत वृद्धि/gu, "एक वर्ष की वास्तविक वृद्धि दर")
    .replace(/लिखी हुई वार्षिक दर/gu, "घोषित वार्षिक दर")
    .replace(/अधिक राशि कितनी अधिक होगी\?/gu, "दोनों राशियों में कितना अंतर होगा?")
    .replace(/एक ही (₹[\d,.]+) राशि/gu, "एक ही मूलधन $1")
    .replace(/1 वर्ष पूरे वर्षों और (\d+) महीने अतिरिक्त समय के बाद/gu, "1 पूरे वर्ष के चक्रवृद्धि ब्याज और अगले $1 महीने के साधारण ब्याज के बाद")
    .replace(/पहले 1 वर्ष तक/gu, "पहले वर्ष")
    .replace(/अगले 1 वर्ष तक/gu, "अगले वर्ष")
    .replace(/पहले 1 वर्ष के लिए/gu, "पहले वर्ष")
    .replace(/अगले 1 वर्ष के लिए/gu, "अगले वर्ष")
    .replace(/शुरुआती 1 वर्ष में/gu, "पहले वर्ष")
    .replace(/बाद के 1 वर्ष में/gu, "अगले वर्ष")
    .replace(/पहले वर्ष ब्याज हर वर्ष/gu, "पहले वर्ष ब्याज वर्ष के अंत में")
    .replace(/अंतिम (\d+) महीने साधारण ब्याज के हैं/gu, "अंतिम $1 महीनों के लिए साधारण ब्याज लगाया गया है")
    .replace(/दोनों चरण क्रमशः (\d+) वर्ष और (\d+) वर्ष के हैं/gu, "पहला चरण $1 वर्ष और दूसरा $2 वर्ष का है"));
}

function humanizePunjabiStem(text: string): string {
  return fixPunjabiEditorialGrammar(text
    .replace(/^ਇੱਕ ਰਕਮ (₹[\d,.]+) ਹੈ। ਇਸ ਉੱਤੇ /u, "$1 ਦੀ ਰਕਮ ਉੱਤੇ ")
    .replace(/^ਇੱਕ ਨਿਵੇਸ਼ (₹[\d,.]+) ਹੈ।/u, "$1 ਦਾ ਨਿਵੇਸ਼ ਕੀਤਾ ਗਿਆ ਹੈ।")
    .replace(/ਹਰ ਵਿਆਜ ਅੰਤਰਾਲ ਦੀ ਦਰ/gu, "ਹਰ ਵਾਰ ਵਿਆਜ ਜੁੜਨ ਦੀ ਦਰ")
    .replace(/ਇੱਕ ਸਾਲ ਦੀ ਅਸਲ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ/gu, "ਇੱਕ ਸਾਲ ਦੀ ਅਸਲ ਵਾਧਾ ਦਰ")
    .replace(/ਇੱਕ ਯੋਜਨਾ ਦੀ ਅਸਲ ਸਾਲਾਨਾ ਵਾਧਾ/gu, "ਇੱਕ ਯੋਜਨਾ ਵਿੱਚ ਅਸਲ ਸਾਲਾਨਾ ਵਾਧਾ ਦਰ")
    .replace(/ਲਿਖੀ ਹੋਈ ਸਾਲਾਨਾ ਦਰ/gu, "ਘੋਸ਼ਿਤ ਸਾਲਾਨਾ ਦਰ")
    .replace(/ਵੱਧ ਰਕਮ ਕਿੰਨੀ ਵੱਧ ਹੋਵੇਗੀ\?/gu, "ਦੋਵੇਂ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?")
    .replace(/ਇੱਕੋ (₹[\d,.]+) ਰਕਮ/gu, "ਇੱਕੋ ਮੂਲਧਨ $1")
    .replace(/1 ਪੂਰੇ ਸਾਲ ਦੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ (\d+) ਮਹੀਨਿਆਂ ਦੇ ਵਾਧੂ ਸਮੇਂ ਬਾਅਦ/gu, "1 ਸਾਲ ਦੇ ਮਿਸ਼ਰਤ ਵਿਆਜ ਅਤੇ ਅਗਲੇ $1 ਮਹੀਨਿਆਂ ਦੇ ਸਧਾਰਣ ਵਿਆਜ ਤੋਂ ਬਾਅਦ")
    .replace(/ਪਹਿਲੇ 1 ਸਾਲ ਲਈ/gu, "ਪਹਿਲੇ ਸਾਲ")
    .replace(/ਅਗਲੇ 1 ਸਾਲ ਲਈ/gu, "ਅਗਲੇ ਸਾਲ")
    .replace(/ਸ਼ੁਰੂਆਤੀ 1 ਸਾਲ ਵਿੱਚ/gu, "ਪਹਿਲੇ ਸਾਲ")
    .replace(/ਬਾਅਦ ਦੇ 1 ਸਾਲ ਵਿੱਚ/gu, "ਅਗਲੇ ਸਾਲ")
    .replace(/ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਹਰ ਸਾਲ/gu, "ਪਹਿਲੇ ਸਾਲ ਵਿਆਜ ਸਾਲ ਦੇ ਅੰਤ ਵਿੱਚ")
    .replace(/ਅੰਤਿਮ (\d+) ਮਹੀਨੇ ਸਧਾਰਣ ਵਿਆਜ ਦੇ ਹਨ/gu, "ਅੰਤਿਮ $1 ਮਹੀਨਿਆਂ ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਲਾਇਆ ਗਿਆ ਹੈ")
    .replace(/ਦੋਵੇਂ ਪੜਾਅ ਕ੍ਰਮਵਾਰ (\d+) ਅਤੇ (\d+) ਸਾਲਾਂ ਦੇ ਹਨ/gu, "ਪਹਿਲਾ ਪੜਾਅ $1 ਸਾਲ ਅਤੇ ਦੂਜਾ $2 ਸਾਲ ਦਾ ਹੈ"));
}

export function humanizeCp004LocalizedStemV7(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  stem: string,
): string {
  let humanized = locale === "hi-IN" ? humanizeHindiStem(stem) : humanizePunjabiStem(stem);
  if (source.qlId === "INT-QL-073" || source.qlId === "INT-QL-074") {
    const credit = creditInterval(locale, source.mathematicalState.frequency);
    if (locale === "hi-IN") {
      humanized = humanized
        .replace(/हर बार ब्याज जुड़ने पर दर/gu, `${credit} की ब्याज दर`)
        .replace(/हर बार ब्याज जुड़ने की दर/gu, `${credit} की ब्याज दर`)
        .replace(/हर बार ([\d.]+%) ब्याज/gu, `${credit} $1 की दर से ब्याज`);
    } else {
      humanized = humanized
        .replace(/ਹਰ ਵਾਰ ਵਿਆਜ ਜੁੜਨ ਸਮੇਂ ਦਰ/gu, `${credit} ਦੀ ਵਿਆਜ ਦਰ`)
        .replace(/ਹਰ ਵਾਰ ਵਿਆਜ ਜੁੜਨ ਦੀ ਦਰ/gu, `${credit} ਦੀ ਵਿਆਜ ਦਰ`)
        .replace(/ਹਰ ਵਾਰ ([\d.]+%) ਵਿਆਜ/gu, `${credit} $1 ਦੀ ਦਰ ਨਾਲ ਵਿਆਜ`);
    }
  }
  return humanized;
}

function humanizeHindiFeedback(text: string): string {
  let result = text.replace(
    /यह परिणाम साधारण ब्याज लगाने से आता है। यहाँ ([\d.]+%) की दर से कुल (\d+) (तिमाहियाँ|छमाहियाँ|महीने|वर्ष) चक्रवृद्धि करनी है।/gu,
    (_match, rate: string, count: string, rawPeriod: string) => {
      const period = hindiPeriod(rawPeriod);
      return `यह साधारण ब्याज का परिणाम है। सही हल में ${rate} की दर से ${count} ${period.oblique} तक ब्याज मूलधन में जोड़ना होगा।`;
    },
  );

  result = result.replace(
    /इसमें केवल (\d+) (तिमाहियाँ|छमाहियाँ|महीने|वर्ष) लिए गए हैं, जबकि प्रश्न में कुल (\d+) (तिमाहियाँ|छमाहियाँ|महीने|वर्ष) हैं।/gu,
    (_match, used: string, usedRaw: string, expected: string, expectedRaw: string) => {
      const usedPeriod = hindiPeriod(usedRaw);
      const expectedPeriod = hindiPeriod(expectedRaw);
      return `इसमें केवल ${used} ${usedPeriod.oblique} की गणना की गई है, जबकि प्रश्न में ${expected} ${expectedPeriod.oblique} की गणना करनी है।`;
    },
  );

  return fixHindiPeriodAgreement(removeRedundantDivisionByOne(result
    .replace(/कुल (\d+) तिमाहियाँ लेने पर/gu, "$1 तिमाहियों के लिए गणना करने पर")
    .replace(/कुल (\d+) छमाहियाँ लेने पर/gu, "$1 छमाहियों के लिए गणना करने पर")
    .replace(/कुल (\d+) महीने लेने पर/gu, "$1 महीनों के लिए गणना करने पर")
    .replace(/कुल (\d+) वर्ष लेने पर/gu, "$1 वर्षों के लिए गणना करने पर")
    .replace(/इस दर को प्रश्न में दिए ब्याज जोड़ने का नियम से जाँचने पर/gu, "इस दर से प्रश्न के अनुसार ब्याज जोड़ने पर")
    .replace(/पूरे चक्रवृद्धि गुणक हटाइए/gu, "पूरे चक्रवृद्धि गुणक से भाग दीजिए")));
}

function humanizePunjabiFeedback(text: string): string {
  let result = text.replace(
    /ਇਹ ਨਤੀਜਾ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਉਣ ਨਾਲ ਆਉਂਦਾ ਹੈ। ਇੱਥੇ ([\d.]+%) ਦੀ ਦਰ ਨਾਲ ਕੁੱਲ (\d+) (ਤਿਮਾਹੀਆਂ|ਛਿਮਾਹੀਆਂ|ਮਹੀਨੇ|ਸਾਲ) ਵਿਆਜ ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਨਾ ਹੈ।/gu,
    (_match, rate: string, count: string, rawPeriod: string) => {
      const period = punjabiPeriod(rawPeriod);
      return `ਇਹ ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਨਤੀਜਾ ਹੈ। ਸਹੀ ਹੱਲ ਵਿੱਚ ${rate} ਦੀ ਦਰ ਨਾਲ ${count} ${period.oblique} ਤੱਕ ਵਿਆਜ ਮੂਲਧਨ ਵਿੱਚ ਜੋੜਨਾ ਹੋਵੇਗਾ।`;
    },
  );

  result = result.replace(
    /ਇਸ ਵਿੱਚ ਕੇਵਲ (\d+) (ਤਿਮਾਹੀਆਂ|ਛਿਮਾਹੀਆਂ|ਮਹੀਨੇ|ਸਾਲ) ਲਏ ਗਏ ਹਨ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਕੁੱਲ (\d+) (ਤਿਮਾਹੀਆਂ|ਛਿਮਾਹੀਆਂ|ਮਹੀਨੇ|ਸਾਲ) ਹਨ।/gu,
    (_match, used: string, usedRaw: string, expected: string, expectedRaw: string) => {
      const usedPeriod = punjabiPeriod(usedRaw);
      const expectedPeriod = punjabiPeriod(expectedRaw);
      return `ਇਸ ਵਿੱਚ ਕੇਵਲ ${used} ${usedPeriod.oblique} ਦੀ ਗਿਣਤੀ ਕੀਤੀ ਗਈ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ${expected} ${expectedPeriod.oblique} ਦੀ ਗਿਣਤੀ ਕਰਨੀ ਹੈ।`;
    },
  );

  return fixPunjabiEditorialGrammar(removeRedundantDivisionByOne(result
    .replace(/ਕੁੱਲ (\d+) ਤਿਮਾਹੀਆਂ ਲੈਣ ਉੱਤੇ/gu, "$1 ਤਿਮਾਹੀਆਂ ਲਈ ਗਿਣਤੀ ਕਰਨ ਉੱਤੇ")
    .replace(/ਕੁੱਲ (\d+) ਛਿਮਾਹੀਆਂ ਲੈਣ ਉੱਤੇ/gu, "$1 ਛਿਮਾਹੀਆਂ ਲਈ ਗਿਣਤੀ ਕਰਨ ਉੱਤੇ")
    .replace(/ਕੁੱਲ (\d+) ਮਹੀਨੇ ਲੈਣ ਉੱਤੇ/gu, "$1 ਮਹੀਨਿਆਂ ਲਈ ਗਿਣਤੀ ਕਰਨ ਉੱਤੇ")
    .replace(/ਕੁੱਲ (\d+) ਸਾਲ ਲੈਣ ਉੱਤੇ/gu, "$1 ਸਾਲਾਂ ਲਈ ਗਿਣਤੀ ਕਰਨ ਉੱਤੇ")
    .replace(/ਇਸ ਦਰ ਨੂੰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ ਨਾਲ ਜਾਂਚਣ ਉੱਤੇ/gu, "ਇਸ ਦਰ ਨਾਲ ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ਵਿਆਜ ਜੋੜਨ ਉੱਤੇ")
    .replace(/ਪੂਰਾ ਵਿਆਜ ਜੋੜਨ ਦਾ ਗੁਣਕ ਹਟਾਓ/gu, "ਪੂਰੇ ਵਿਆਜ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦਿਓ")));
}

export function humanizeCp004LocalizedOptionV7(
  _source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  option: IntCp004LocalizedOption,
): IntCp004LocalizedOption {
  return Object.freeze({
    ...option,
    feedback: locale === "hi-IN"
      ? humanizeHindiFeedback(option.feedback)
      : humanizePunjabiFeedback(option.feedback),
  });
}

function humanizeHindiExplanationText(text: string): string {
  return fixHindiPeriodAgreement(removeRedundantDivisionByOne(text
    .replace(/हर (महीने|तिमाही|छमाही|वर्ष) की दर पहले से = ([\d.]+%)।/gu, "हर $1 की ब्याज दर $2 सीधे दी गई है।")
    .replace(/प्रत्येक संभावित ब्याज जोड़ने का क्रम से/gu, "ब्याज जोड़ने के प्रत्येक संभावित अंतराल के अनुसार")
    .replace(/ब्याज-आवृत्ति/gu, "ब्याज जोड़ने का अंतराल")
    .replace(/इस दर को प्रश्न में दिए ब्याज जोड़ने का नियम से/gu, "इस दर से प्रश्न के अनुसार ब्याज जोड़ने पर")));
}

function humanizePunjabiExplanationText(text: string): string {
  return fixPunjabiEditorialGrammar(removeRedundantDivisionByOne(text
    .replace(/ਹਰ (ਮਹੀਨੇ|ਤਿੰਨ ਮਹੀਨੇ|ਛੇ ਮਹੀਨੇ|ਸਾਲ) ਦੀ ਦਰ ਪਹਿਲਾਂ ਹੀ = ([\d.]+%)।/gu, "ਹਰ $1 ਦੀ ਵਿਆਜ ਦਰ $2 ਸਿੱਧੀ ਦਿੱਤੀ ਗਈ ਹੈ।")
    .replace(/ਇੱਕ ਸਾਲ ਦੇ ਅੰਦਰ ਹੋਈਆਂ ਸਾਰੀਆਂ ਮਿਸ਼ਰਤ ਵਿਆਜਆਂ ਸ਼ਾਮਲ ਕਰੋ/gu, "ਇੱਕ ਸਾਲ ਦੇ ਅੰਦਰ ਵਿਆਜ ਜੋੜਨ ਦੇ ਸਾਰੇ ਪੜਾਅ ਸ਼ਾਮਲ ਕਰੋ")
    .replace(/ਪੂਰੇ ਇੱਕ ਸਾਲ ਦੇ ਵਿਆਜ ਜੋੜਨ ਦਾ ਗੁਣਕ ਨਾਲ/gu, "ਪੂਰੇ ਇੱਕ ਸਾਲ ਦੇ ਵਿਆਜ ਗੁਣਕ ਨਾਲ")
    .replace(/ਇਸ ਦਰ ਨੂੰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਵਿਆਜ ਜੋੜਨ ਦਾ ਨਿਯਮ ਨਾਲ/gu, "ਇਸ ਦਰ ਨਾਲ ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ਵਿਆਜ ਜੋੜਨ ਉੱਤੇ")));
}

export function humanizeCp004LocalizedExplanationV7(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  explanation: IntCp004LocalizedExplanation,
): IntCp004LocalizedExplanation {
  const humanize = locale === "hi-IN"
    ? humanizeHindiExplanationText
    : humanizePunjabiExplanationText;

  let steps = explanation.steps.map((step) => humanize(step));
  let commonMistake = humanize(explanation.commonMistake);

  if (source.qlId === "INT-QL-073" || source.qlId === "INT-QL-074") {
    const rateName = periodicRateName(locale, source.mathematicalState.frequency);
    if (locale === "hi-IN") {
      commonMistake = commonMistake.replace(
        /([\d.]+%) पहले से हर बार की दर है; इसे (\d+) से दोबारा न बाँटें।/gu,
        `$1 सीधे ${rateName} ब्याज दर है; इसे $2 से दोबारा न बाँटें।`,
      );
    } else {
      commonMistake = commonMistake.replace(
        /([\d.]+%) ਪਹਿਲਾਂ ਹੀ ਹਰ ਵਾਰ ਦੀ ਦਰ ਹੈ; ਇਸ ਨੂੰ (\d+) ਨਾਲ ਦੁਬਾਰਾ ਨਾ ਵੰਡੋ।/gu,
        `$1 ਸਿੱਧੀ ${rateName} ਵਿਆਜ ਦਰ ਹੈ; ਇਸ ਨੂੰ $2 ਨਾਲ ਦੁਬਾਰਾ ਨਾ ਵੰਡੋ।`,
      );
    }
  }

  if (source.mathematicalState.frequency === 1) {
    if (locale === "hi-IN") {
      steps = steps.map((step) => step.replace(
        /हर वर्ष की दर = ([\d.]+%) ÷ 1 = ([\d.]+%)।/gu,
        "ब्याज वर्ष में एक बार जुड़ता है, इसलिए प्रत्येक वर्ष की दर $2 है।",
      ));
      commonMistake = commonMistake
        .replace(
          /([\d.]+%) वार्षिक दर को सीधे हर बार पर न लगाएँ; हर वर्ष की दर \1 और कुल (\d+) वर्ष हैं।/gu,
          "ब्याज वर्ष में एक बार जुड़ता है। इसलिए उसी वार्षिक दर को हर वर्ष लगाएँ और कुल $2 वर्षों की गणना करें।",
        )
        .replace(/([\d.]+%) पहले से हर बार की दर है; इसे 1 से दोबारा न बाँटें।/gu, "$1 सीधे वार्षिक दर है; इसे अलग से विभाजित करने की आवश्यकता नहीं है।");
    } else {
      steps = steps.map((step) => step.replace(
        /ਹਰ ਸਾਲ ਦੀ ਦਰ = ([\d.]+%) ÷ 1 = ([\d.]+%)।/gu,
        "ਵਿਆਜ ਸਾਲ ਵਿੱਚ ਇੱਕ ਵਾਰ ਜੁੜਦਾ ਹੈ, ਇਸ ਲਈ ਹਰ ਸਾਲ ਦੀ ਦਰ $2 ਹੀ ਰਹੇਗੀ।",
      ));
      commonMistake = commonMistake
        .replace(
          /([\d.]+%) ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਸਿੱਧਾ ਹਰ ਵਾਰ ਉੱਤੇ ਨਾ ਲਗਾਓ; ਹਰ ਸਾਲ ਦੀ ਦਰ \1 ਅਤੇ ਕੁੱਲ (\d+) ਸਾਲ ਹਨ।/gu,
          "ਵਿਆਜ ਸਾਲ ਵਿੱਚ ਇੱਕ ਵਾਰ ਜੁੜਦਾ ਹੈ। ਇਸ ਲਈ ਇਹੀ ਸਾਲਾਨਾ ਦਰ ਹਰ ਸਾਲ ਲਗਾਓ ਅਤੇ ਕੁੱਲ $2 ਸਾਲਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।",
        )
        .replace(/([\d.]+%) ਪਹਿਲਾਂ ਹੀ ਹਰ ਵਾਰ ਦੀ ਦਰ ਹੈ; ਇਸ ਨੂੰ 1 ਨਾਲ ਦੁਬਾਰਾ ਨਾ ਵੰਡੋ।/gu, "$1 ਸਿੱਧੀ ਸਾਲਾਨਾ ਦਰ ਹੈ; ਇਸ ਨੂੰ ਵੱਖਰੇ ਤੌਰ ਉੱਤੇ ਵੰਡਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।");
    }
  }

  return Object.freeze({
    whatAsked: humanize(explanation.whatAsked),
    steps: Object.freeze(steps.map((step) => humanize(step))),
    finalAnswer: humanize(explanation.finalAnswer),
    commonMistake: humanize(commonMistake),
  });
}
