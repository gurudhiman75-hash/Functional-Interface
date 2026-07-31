import type { Explanation } from "./types";

type SupportedLocale = "en-IN" | "hi-IN" | "pa-IN";

type PlainLanguageQuestion = {
  readonly intendedClassId: string;
  readonly intendedClassLabel: string;
  readonly answer: string;
  readonly evidenceByOption: readonly string[];
  readonly explanation: Explanation;
  readonly metadata: {
    readonly locale: string;
    readonly [key: string]: unknown;
  };
};

const SIMPLE_LABELS: Readonly<Record<SupportedLocale, Readonly<Record<string, string>>>> = {
  "en-IN": {
    CLS_AQUATIC_ANIMALS: "animals that live in water",
    CLS_FLYING_ANIMALS: "animals that can fly",
    CLS_COMPUTER_PARTS: "computer parts",
    CLS_CIRCLE_COMPONENTS: "parts of a circle",
  },
  "hi-IN": {
    CLS_TROPICAL_FRUITS: "गर्म इलाकों के फल",
    CLS_MAMMALS: "दूध पिलाने वाले जानवर",
    CLS_AQUATIC_ANIMALS: "पानी में रहने वाले जानवर",
    CLS_FLYING_ANIMALS: "उड़ने वाले जानवर",
    CLS_SPORTS_EQUIPMENT: "खेल का सामान",
  },
  "pa-IN": {},
};

const TEXT_REPLACEMENTS: Readonly<Record<SupportedLocale, readonly (readonly [string, string])[]>> = {
  "en-IN": [
    ["aquatic animals", "animals that live in water"],
    ["animals capable of flight", "animals that can fly"],
    ["computer components", "computer parts"],
    ["parts or elements of a circle", "parts of a circle"],
  ],
  "hi-IN": [
    ["उष्णकटिबंधीय फल", "गर्म इलाकों के फल"],
    ["स्तनधारी जानवर", "दूध पिलाने वाले जानवर"],
    ["जलीय जानवर", "पानी में रहने वाले जानवर"],
    ["उड़ सकने वाले जानवर", "उड़ने वाले जानवर"],
    ["खेल उपकरण", "खेल का सामान"],
  ],
  "pa-IN": [],
};

const HINDI_MEMBERSHIP: Readonly<Record<string, (answer: string) => string>> = {
  "फल": (answer) => `${answer} एक फल है।`,
  "खट्टे फल": (answer) => `${answer} खट्टा फल है।`,
  "गर्म इलाकों के फल": (answer) => `${answer} गर्म इलाके का फल है।`,
  "सब्जियाँ": (answer) => `${answer} एक सब्ज़ी है।`,
  "अनाज": (answer) => `${answer} अनाज है।`,
  "मसाले": (answer) => `${answer} एक मसाला है।`,
  "फूल": (answer) => `${answer} एक फूल है।`,
  "पेड़": (answer) => `${answer} एक पेड़ है।`,
  "पक्षी": (answer) => `${answer} एक पक्षी है।`,
  "दूध पिलाने वाले जानवर": (answer) => `${answer} दूध पिलाने वाला जानवर है।`,
  "पानी में रहने वाले जानवर": (answer) => `${answer} पानी में रहने वाला जानवर है।`,
  "उड़ने वाले जानवर": (answer) => `${answer} उड़ने वाला जीव है।`,
  "नदियाँ": (answer) => `${answer} एक नदी है।`,
  "पर्वत श्रेणियाँ": (answer) => `${answer} एक पर्वत-श्रृंखला है।`,
  "वाद्य यंत्र": (answer) => `${answer} एक वाद्य यंत्र है।`,
  "खेल का सामान": (answer) => `${answer} खेल का सामान है।`,
  "लिखने के साधन": (answer) => `${answer} लिखने का साधन है।`,
  "काटने के औज़ार": (answer) => `${answer} काटने का औज़ार है।`,
  "मापने के यंत्र": (answer) => `${answer} मापने का यंत्र है।`,
  "रसोई के औज़ार": (answer) => `${answer} रसोई का औज़ार है।`,
  "पेड़ के भाग": (answer) => `${answer} पेड़ का भाग है।`,
  "जहाज़ के भाग": (answer) => `${answer} जहाज़ का भाग है।`,
  "कंप्यूटर के भाग": (answer) => `${answer} कंप्यूटर का भाग है।`,
  "वृत्त के भाग": (answer) => `${answer} वृत्त का भाग है।`,
};

const PUNJABI_MEMBERSHIP: Readonly<Record<string, (answer: string) => string>> = {
  "ਫਲ": (answer) => `${answer} ਇੱਕ ਫਲ ਹੈ।`,
  "ਖੱਟੇ ਫਲ": (answer) => `${answer} ਖੱਟਾ ਫਲ ਹੈ।`,
  "ਗਰਮ ਇਲਾਕਿਆਂ ਦੇ ਫਲ": (answer) => `${answer} ਗਰਮ ਇਲਾਕੇ ਦਾ ਫਲ ਹੈ।`,
  "ਸਬਜ਼ੀਆਂ": (answer) => `${answer} ਇੱਕ ਸਬਜ਼ੀ ਹੈ।`,
  "ਅਨਾਜ": (answer) => `${answer} ਅਨਾਜ ਹੈ।`,
  "ਮਸਾਲੇ": (answer) => `${answer} ਇੱਕ ਮਸਾਲਾ ਹੈ।`,
  "ਫੁੱਲ": (answer) => `${answer} ਇੱਕ ਫੁੱਲ ਹੈ।`,
  "ਦਰੱਖਤ": (answer) => `${answer} ਇੱਕ ਦਰੱਖਤ ਹੈ।`,
  "ਪੰਛੀ": (answer) => `${answer} ਇੱਕ ਪੰਛੀ ਹੈ।`,
  "ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲੇ ਜਾਨਵਰ": (answer) => `${answer} ਦੁੱਧ ਪਿਲਾਉਣ ਵਾਲਾ ਜਾਨਵਰ ਹੈ।`,
  "ਪਾਣੀ ਵਿੱਚ ਰਹਿਣ ਵਾਲੇ ਜਾਨਵਰ": (answer) => `${answer} ਪਾਣੀ ਵਿੱਚ ਰਹਿਣ ਵਾਲਾ ਜਾਨਵਰ ਹੈ।`,
  "ਉੱਡ ਸਕਣ ਵਾਲੇ ਜਾਨਵਰ": (answer) => `${answer} ਉੱਡ ਸਕਣ ਵਾਲਾ ਜੀਵ ਹੈ।`,
  "ਦਰਿਆ": (answer) => `${answer} ਇੱਕ ਦਰਿਆ ਹੈ।`,
  "ਪਹਾੜੀ ਲੜੀਆਂ": (answer) => `${answer} ਇੱਕ ਪਹਾੜੀ ਲੜੀ ਹੈ।`,
  "ਸਾਜ਼": (answer) => `${answer} ਇੱਕ ਸਾਜ਼ ਹੈ।`,
  "ਖੇਡਾਂ ਦਾ ਸਾਮਾਨ": (answer) => `${answer} ਖੇਡਾਂ ਦਾ ਸਾਮਾਨ ਹੈ।`,
  "ਲਿਖਣ ਵਾਲੇ ਸੰਦ": (answer) => `${answer} ਲਿਖਣ ਵਾਲਾ ਸੰਦ ਹੈ।`,
  "ਕੱਟਣ ਵਾਲੇ ਸੰਦ": (answer) => `${answer} ਕੱਟਣ ਵਾਲਾ ਸੰਦ ਹੈ।`,
  "ਮਾਪਣ ਵਾਲੇ ਯੰਤਰ": (answer) => `${answer} ਮਾਪਣ ਵਾਲਾ ਯੰਤਰ ਹੈ।`,
  "ਰਸੋਈ ਦੇ ਸੰਦ": (answer) => `${answer} ਰਸੋਈ ਦਾ ਸੰਦ ਹੈ।`,
  "ਦਰੱਖਤ ਦੇ ਹਿੱਸੇ": (answer) => `${answer} ਦਰੱਖਤ ਦਾ ਹਿੱਸਾ ਹੈ।`,
  "ਜਹਾਜ਼ ਦੇ ਹਿੱਸੇ": (answer) => `${answer} ਜਹਾਜ਼ ਦਾ ਹਿੱਸਾ ਹੈ।`,
  "ਕੰਪਿਊਟਰ ਦੇ ਹਿੱਸੇ": (answer) => `${answer} ਕੰਪਿਊਟਰ ਦਾ ਹਿੱਸਾ ਹੈ।`,
  "ਚੱਕਰ ਦੇ ਹਿੱਸੇ": (answer) => `${answer} ਚੱਕਰ ਦਾ ਹਿੱਸਾ ਹੈ।`,
};

function supportedLocale(value: string): SupportedLocale {
  if (value === "hi-IN" || value === "pa-IN") return value;
  return "en-IN";
}

function replaceAllKnown(text: string, locale: SupportedLocale): string {
  let result = text;
  for (const [from, to] of TEXT_REPLACEMENTS[locale]) {
    result = result.split(from).join(to);
  }
  return result;
}

function polishNearMiss(text: string, locale: SupportedLocale): string {
  if (locale === "en-IN") {
    return text.replace(/; ([^.;]+) breaks that group\./u, ", but $1 does not belong to that group.");
  }
  if (locale === "hi-IN") {
    return text.replace(/, लेकिन (.+) उस समूह को तोड़ देता है।$/u, ", लेकिन $1 उस समूह का हिस्सा नहीं है।");
  }
  return text.replace(/, ਪਰ (.+) ਉਸ ਸਮੂਹ ਨੂੰ ਤੋੜ ਦਿੰਦਾ ਹੈ।$/u, ", ਪਰ $1 ਉਸ ਸਮੂਹ ਦਾ ਹਿੱਸਾ ਨਹੀਂ ਹੈ।");
}

function polishLocalizedOutlierLine(
  text: string,
  answer: string,
  locale: SupportedLocale,
): string {
  if (locale === "hi-IN") {
    const match = text.match(/^(.+) का संबंध (.+) से है, इसलिए यह इस समूह में नहीं आता।$/u);
    if (!match || match[1] !== answer) return text;
    const classLabel = match[2]!;
    return HINDI_MEMBERSHIP[classLabel]?.(answer)
      ?? `${answer} दूसरे समूह में आता है, इसलिए यह अलग है।`;
  }
  if (locale === "pa-IN") {
    const match = text.match(/^(.+) ਦਾ ਸਬੰਧ (.+) ਨਾਲ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਸ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।$/u);
    if (!match || match[1] !== answer) return text;
    const classLabel = match[2]!;
    return PUNJABI_MEMBERSHIP[classLabel]?.(answer)
      ?? `${answer} ਵੱਖਰੇ ਸਮੂਹ ਦਾ ਹਿੱਸਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਵੱਖਰਾ ਹੈ।`;
  }
  return text;
}

function polishLine(text: string, answer: string, locale: SupportedLocale): string {
  const replaced = replaceAllKnown(text, locale);
  const membershipPolished = polishLocalizedOutlierLine(replaced, answer, locale);
  return polishNearMiss(membershipPolished, locale);
}

export function polishClsCp001PlainLanguage<T extends PlainLanguageQuestion>(question: T): T {
  const locale = supportedLocale(question.metadata.locale);
  const simpleClassLabel = SIMPLE_LABELS[locale][question.intendedClassId]
    ?? replaceAllKnown(question.intendedClassLabel, locale);
  const mapLines = (lines: readonly string[]) =>
    lines.map((line) => polishLine(line, question.answer, locale));

  return {
    ...question,
    intendedClassLabel: simpleClassLabel,
    evidenceByOption: question.evidenceByOption.map((line) => replaceAllKnown(line, locale)),
    explanation: {
      coreRule: mapLines(question.explanation.coreRule),
      optionChecks: mapLines(question.explanation.optionChecks),
      examSpeedShortcut: mapLines(question.explanation.examSpeedShortcut),
      commonTraps: mapLines(question.explanation.commonTraps),
    },
  };
}
