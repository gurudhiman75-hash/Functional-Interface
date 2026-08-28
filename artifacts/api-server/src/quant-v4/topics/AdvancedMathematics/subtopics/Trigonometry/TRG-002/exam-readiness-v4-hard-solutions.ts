type AnyExplanation = {
  keyRule: string;
  steps: Array<{ title: string; body: string }>;
  shortcut: string;
  traps: string[];
  [key: string]: any;
};

export const TRG_002_V4_HARD_SOLUTION_REMEDIATION_IDS = [
  "TRG-002-QL-049",
  "TRG-002-QL-051",
  "TRG-002-QL-054",
  "TRG-002-QL-057",
  "TRG-002-QL-062",
  "TRG-002-QL-080",
  "TRG-002-QL-082",
  "TRG-002-QL-090",
  "TRG-002-QL-096",
] as const;

type TargetQlId = typeof TRG_002_V4_HARD_SOLUTION_REMEDIATION_IDS[number];
type Locale = "hi-IN" | "pa-IN";

function isTargetQlId(qlId: string): qlId is TargetQlId {
  return (TRG_002_V4_HARD_SOLUTION_REMEDIATION_IDS as readonly string[]).includes(qlId);
}

function metricFromStem(qlId: string, stem: string) {
  const value = stem.match(/(\d+(?:\.\d+)?)\s*m\b/u)?.[1];
  if (!value) throw new Error(`${qlId}: V4 Hard-solution remediation could not recover the metric given from the learner stem.`);
  return value;
}

function cleanFinalBody(body: string, locale: Locale) {
  if (locale === "hi-IN") {
    return body
      .replace(/^(?:दोनों )?समीकरण हल(?: और सटीक रूप सरल)? करने पर\s*/u, "")
      .replace(/^हल करने पर\s*/u, "")
      .replace(/^समीकरण हल करने से\s*/u, "")
      .trim();
  }
  return body
    .replace(/^ਦੋਵੇਂ ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ 'ਤੇ\s*/u, "")
    .replace(/^ਸਮੀਕਰਨ ਹੱਲ ਕਰਨ 'ਤੇ\s*/u, "")
    .replace(/^ਹੱਲ ਕਰਨ 'ਤੇ\s*/u, "")
    .replace(/^ਸਮੀਕਰਨ ਹੱਲ ਕਰਕੇ ਅਤੇ ਸਟੀਕ ਰੂਪ ਸਧਾਰਨ ਕਰਨ 'ਤੇ\s*/u, "")
    .trim();
}

function algebraBody(qlId: TargetQlId, locale: Locale, metric: string) {
  if (locale === "hi-IN") {
    switch (qlId) {
      case "TRG-002-QL-049":
        return `tan60°=√3 और tan30°=1/√3 रखने पर x√3=(x+${metric})/√3, यानी 3x=x+${metric} और 2x=${metric}।`;
      case "TRG-002-QL-051":
        return `tan45°=1 और tan30°=1/√3 रखने पर x=(x+${metric})/√3। इसलिए x(√3−1)=${metric}; यहाँ x निकट दूरी है और माँगी दूर दूरी x+${metric} है।`;
      case "TRG-002-QL-054":
        return `tan60°=√3 और tan45°=1 रखने पर x√3=x+${metric}। इसलिए x(√3−1)=${metric}; इसी से निकट दूरी का सटीक मान मिलता है।`;
      case "TRG-002-QL-057":
        return `tan60°=√3 और tan30°=1/√3 रखने पर x√3=(x+${metric})/√3, इसलिए 3x=x+${metric} और 2x=${metric}। प्रारंभिक दूरी x+${metric} होगी।`;
      case "TRG-002-QL-062":
        return `tan45°=1 और tan30°=1/√3 रखने पर x=(x+${metric})/√3, इसलिए x(√3−1)=${metric}। 45° वाले पहले बिंदु पर ऊँचाई भी x के बराबर है।`;
      case "TRG-002-QL-080":
        return `30° वाले बिंदु की दूरी d₃₀ और 60° वाले बिंदु की दूरी d₆₀ मानें। d₃₀/√3=d₆₀√3 से d₃₀=3d₆₀; फिर d₃₀+d₆₀=${metric} से 4d₆₀=${metric}।`;
      case "TRG-002-QL-082":
        return `30° वाले बिंदु की दूरी d₃₀ और 60° वाले बिंदु की दूरी d₆₀ मानें। d₃₀/√3=d₆₀√3 से d₃₀=3d₆₀; फिर d₃₀+d₆₀=${metric} से 4d₆₀=${metric} और d₃₀=3d₆₀।`;
      case "TRG-002-QL-090":
        return `tan30°=1/√3 से h/d=1/√3, इसलिए d=h√3। अब tan60°=√3 से (${metric}−h)/d=√3; d=h√3 रखने पर ${metric}−h=3h, यानी 4h=${metric}।`;
      case "TRG-002-QL-096":
        return `tan45°=1 से इमारत की ऊँचाई d और tan60°=√3 से कुल ऊँचाई d√3 है। इसलिए ${metric}=d(√3−1), अतः d=${metric}/(√3−1)=${metric}(√3+1)/2।`;
    }
  }

  switch (qlId) {
    case "TRG-002-QL-049":
      return `tan60°=√3 ਅਤੇ tan30°=1/√3 ਰੱਖਣ 'ਤੇ x√3=(x+${metric})/√3, ਅਰਥਾਤ 3x=x+${metric} ਅਤੇ 2x=${metric}।`;
    case "TRG-002-QL-051":
      return `tan45°=1 ਅਤੇ tan30°=1/√3 ਰੱਖਣ 'ਤੇ x=(x+${metric})/√3। ਇਸ ਲਈ x(√3−1)=${metric}; ਇੱਥੇ x ਨੇੜਲੀ ਦੂਰੀ ਹੈ ਅਤੇ ਮੰਗੀ ਦੂਰਲੀ ਦੂਰੀ x+${metric} ਹੈ।`;
    case "TRG-002-QL-054":
      return `tan60°=√3 ਅਤੇ tan45°=1 ਰੱਖਣ 'ਤੇ x√3=x+${metric}। ਇਸ ਲਈ x(√3−1)=${metric}; ਇੱਥੋਂ ਨੇੜਲੀ ਦੂਰੀ ਦਾ ਸਟੀਕ ਮੁੱਲ ਮਿਲਦਾ ਹੈ।`;
    case "TRG-002-QL-057":
      return `tan60°=√3 ਅਤੇ tan30°=1/√3 ਰੱਖਣ 'ਤੇ x√3=(x+${metric})/√3, ਇਸ ਲਈ 3x=x+${metric} ਅਤੇ 2x=${metric}। ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ x+${metric} ਹੋਵੇਗੀ।`;
    case "TRG-002-QL-062":
      return `tan45°=1 ਅਤੇ tan30°=1/√3 ਰੱਖਣ 'ਤੇ x=(x+${metric})/√3, ਇਸ ਲਈ x(√3−1)=${metric}। 45° ਵਾਲੇ ਪਹਿਲੇ ਬਿੰਦੂ 'ਤੇ ਉਚਾਈ ਵੀ x ਦੇ ਬਰਾਬਰ ਹੈ।`;
    case "TRG-002-QL-080":
      return `30° ਵਾਲੇ ਬਿੰਦੂ ਦੀ ਦੂਰੀ d₃₀ ਅਤੇ 60° ਵਾਲੇ ਬਿੰਦੂ ਦੀ ਦੂਰੀ d₆₀ ਮੰਨੋ। d₃₀/√3=d₆₀√3 ਤੋਂ d₃₀=3d₆₀; ਫਿਰ d₃₀+d₆₀=${metric} ਤੋਂ 4d₆₀=${metric}।`;
    case "TRG-002-QL-082":
      return `30° ਵਾਲੇ ਬਿੰਦੂ ਦੀ ਦੂਰੀ d₃₀ ਅਤੇ 60° ਵਾਲੇ ਬਿੰਦੂ ਦੀ ਦੂਰੀ d₆₀ ਮੰਨੋ। d₃₀/√3=d₆₀√3 ਤੋਂ d₃₀=3d₆₀; ਫਿਰ d₃₀+d₆₀=${metric} ਤੋਂ 4d₆₀=${metric} ਅਤੇ d₃₀=3d₆₀।`;
    case "TRG-002-QL-090":
      return `tan30°=1/√3 ਤੋਂ h/d=1/√3, ਇਸ ਲਈ d=h√3। ਹੁਣ tan60°=√3 ਤੋਂ (${metric}−h)/d=√3; d=h√3 ਰੱਖਣ 'ਤੇ ${metric}−h=3h, ਅਰਥਾਤ 4h=${metric}।`;
    case "TRG-002-QL-096":
      return `tan45°=1 ਤੋਂ ਇਮਾਰਤ ਦੀ ਉਚਾਈ d ਅਤੇ tan60°=√3 ਤੋਂ ਕੁੱਲ ਉਚਾਈ d√3 ਹੈ। ਇਸ ਲਈ ${metric}=d(√3−1), ਇਸ ਕਰਕੇ d=${metric}/(√3−1)=${metric}(√3+1)/2।`;
  }
}

export function deepenTrg002V4HardSolution(
  qlId: string,
  locale: Locale,
  stem: string,
  explanation: AnyExplanation,
) {
  if (!isTargetQlId(qlId)) return { explanation, remediated: false } as const;
  if (explanation.steps.length < 3) throw new Error(`${qlId}:${locale}: expected at least three existing explanation steps before V4 Hard remediation.`);

  const metric = metricFromStem(qlId, stem);
  const originalFinal = explanation.steps[explanation.steps.length - 1];
  const finalBody = cleanFinalBody(originalFinal.body, locale);
  const algebra = algebraBody(qlId, locale, metric);
  const algebraTitle = locale === "hi-IN" ? "सटीक सरलीकरण" : "ਸਟੀਕ ਸਰਲੀਕਰਨ";
  const answerTitle = locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ";
  const answerPrefix = locale === "hi-IN" ? "अतः " : "ਇਸ ਲਈ ";

  return {
    explanation: {
      ...explanation,
      steps: [
        ...explanation.steps.slice(0, -1),
        { title: algebraTitle, body: algebra },
        { title: answerTitle, body: `${answerPrefix}${finalBody}` },
      ],
    },
    remediated: true,
  } as const;
}
