import type {
  OpsPilotCandidateId,
  OpsPilotExplanationStep,
  OpsPilotQuestion,
} from "./representative-pilots";

export type OpsPilotRuntimeLocale = "en-IN" | "hi-IN" | "pa-IN";

export type LocalizedOpsPilotQuestion = Omit<OpsPilotQuestion, "locale" | "stem" | "explanation"> & {
  locale: OpsPilotRuntimeLocale;
  stem: string;
  explanation: {
    ruleStatement: string;
    steps: readonly OpsPilotExplanationStep[];
    conclusion: string;
  };
};

const HI_RULES: Readonly<Record<OpsPilotCandidateId, string>> = {
  "OPS-CAND-001": "पहले प्रत्येक दिए गए चिह्न को उसके निर्धारित गणितीय संक्रिया से बदलिए, फिर सामान्य संक्रिया-क्रम के अनुसार हल कीजिए।",
  "OPS-CAND-003": "एक ही दिए गए चिह्न-मान को प्रत्येक विकल्प पर अलग-अलग लागू करके सत्य समीकरण चुनिए।",
  "OPS-CAND-010": "रिक्त स्थान पर प्रत्येक अनुमत गणितीय चिह्न रखकर जाँचिए कि केवल कौन-सा चिह्न समीकरण को सत्य बनाता है।",
  "OPS-CAND-012": "हर विकल्प के चिह्नों को उसी क्रम में रखकर पूरे समीकरण का सटीक मान जाँचिए।",
  "OPS-CAND-014": "दोनों चिह्नों को पूरे व्यंजक में एक साथ आपस में बदलिए और फिर बदले हुए व्यंजक का मान ज्ञात कीजिए।",
  "OPS-CAND-016": "मूल समीकरण पर प्रत्येक संभावित चिह्न-युग्म का वैश्विक परस्पर बदलाव लागू करके अद्वितीय सही युग्म खोजिए।",
  "OPS-CAND-018": "जब बराबर का चिह्न भी बदला जाता है, तब नई समीकरण-सीमा निर्धारित करके दोनों पक्षों को दोबारा हल करना आवश्यक है।",
  "OPS-CAND-020": "अलग-अलग अंकों को नहीं, बल्कि पूरी संख्याओं को एक इकाई के रूप में आपस में बदलिए।",
  "OPS-CAND-023": "दोनों अंकों की प्रत्येक उपस्थिति को पूरे प्रश्न में आपस में बदलकर सभी संख्याएँ फिर से बनाइए।",
  "OPS-CAND-026": "हर संयुक्त विकल्प को मूल समीकरण पर लागू कीजिए; केवल चिह्न या केवल संख्या बदलना पर्याप्त नहीं है।",
  "OPS-CAND-030": "सभी उदाहरणों से चिह्नों का अद्वितीय गणितीय अर्थ निर्धारित करके उसी नियम को लक्ष्य व्यंजक पर लागू कीजिए।",
  "OPS-CAND-034": "गणितीय तथा संबंध-सूचक चिह्नों के अर्थ एक साथ निर्धारित कीजिए और हर कथन की सत्यता जाँचिए।",
};

const PA_RULES: Readonly<Record<OpsPilotCandidateId, string>> = {
  "OPS-CAND-001": "ਪਹਿਲਾਂ ਹਰ ਦਿੱਤੇ ਚਿੰਨ੍ਹ ਨੂੰ ਉਸ ਦੀ ਨਿਰਧਾਰਤ ਗਣਿਤੀ ਕਿਰਿਆ ਨਾਲ ਬਦਲੋ, ਫਿਰ ਆਮ ਕਿਰਿਆ-ਕ੍ਰਮ ਅਨੁਸਾਰ ਹੱਲ ਕਰੋ।",
  "OPS-CAND-003": "ਦਿੱਤੇ ਚਿੰਨ੍ਹ-ਅਰਥ ਨੂੰ ਹਰ ਵਿਕਲਪ ਉੱਤੇ ਵੱਖਰੇ ਤੌਰ ਤੇ ਲਾਗੂ ਕਰਕੇ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।",
  "OPS-CAND-010": "ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਹਰ ਮਨਜ਼ੂਰ ਗਣਿਤੀ ਚਿੰਨ੍ਹ ਰੱਖ ਕੇ ਜਾਂਚੋ ਕਿ ਕੇਵਲ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਸਮੀਕਰਨ ਨੂੰ ਸਹੀ ਬਣਾਉਂਦਾ ਹੈ।",
  "OPS-CAND-012": "ਹਰ ਵਿਕਲਪ ਦੇ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖ ਕੇ ਪੂਰੇ ਸਮੀਕਰਨ ਦੀ ਸਹੀ ਜਾਂਚ ਕਰੋ।",
  "OPS-CAND-014": "ਦੋਵੇਂ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਪੂਰੇ ਵਿਅੰਜਕ ਵਿੱਚ ਇਕੱਠੇ ਆਪਸ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਫਿਰ ਬਦਲੇ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ।",
  "OPS-CAND-016": "ਮੂਲ ਸਮੀਕਰਨ ਉੱਤੇ ਹਰ ਸੰਭਵ ਚਿੰਨ੍ਹ-ਜੋੜੇ ਦਾ ਵਿਸ਼ਵ ਪੱਧਰੀ ਆਪਸੀ ਬਦਲਾਅ ਲਾਗੂ ਕਰਕੇ ਇਕੋ ਸਹੀ ਜੋੜਾ ਲੱਭੋ।",
  "OPS-CAND-018": "ਜਦੋਂ ਬਰਾਬਰੀ ਦਾ ਚਿੰਨ੍ਹ ਵੀ ਬਦਲਦਾ ਹੈ, ਤਾਂ ਨਵੀਂ ਸਮੀਕਰਨ-ਹੱਦ ਲੱਭ ਕੇ ਦੋਵੇਂ ਪਾਸੇ ਮੁੜ ਹੱਲ ਕਰਨੇ ਲਾਜ਼ਮੀ ਹਨ।",
  "OPS-CAND-020": "ਵੱਖਰੇ ਅੰਕਾਂ ਨੂੰ ਨਹੀਂ, ਸਗੋਂ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਨੂੰ ਇਕਾਈ ਵਜੋਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ।",
  "OPS-CAND-023": "ਦੋਵੇਂ ਅੰਕਾਂ ਦੀ ਹਰ ਮੌਜੂਦਗੀ ਨੂੰ ਪੂਰੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਆਪਸ ਵਿੱਚ ਬਦਲ ਕੇ ਸਾਰੀਆਂ ਸੰਖਿਆਵਾਂ ਮੁੜ ਬਣਾਓ।",
  "OPS-CAND-026": "ਹਰ ਸੰਯੁਕਤ ਵਿਕਲਪ ਨੂੰ ਮੂਲ ਸਮੀਕਰਨ ਉੱਤੇ ਲਾਗੂ ਕਰੋ; ਕੇਵਲ ਚਿੰਨ੍ਹ ਜਾਂ ਕੇਵਲ ਸੰਖਿਆ ਬਦਲਣਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
  "OPS-CAND-030": "ਸਾਰੇ ਉਦਾਹਰਣਾਂ ਤੋਂ ਚਿੰਨ੍ਹਾਂ ਦਾ ਇਕੋ ਗਣਿਤੀ ਅਰਥ ਨਿਰਧਾਰਤ ਕਰਕੇ ਉਹੀ ਨਿਯਮ ਲਕਸ਼ ਵਿਅੰਜਕ ਉੱਤੇ ਲਾਗੂ ਕਰੋ।",
  "OPS-CAND-034": "ਗਣਿਤੀ ਅਤੇ ਸੰਬੰਧ-ਸੂਚਕ ਚਿੰਨ੍ਹਾਂ ਦੇ ਅਰਥ ਇਕੱਠੇ ਨਿਰਧਾਰਤ ਕਰੋ ਅਤੇ ਹਰ ਕਥਨ ਦੀ ਸੱਚਾਈ ਜਾਂਚੋ।",
};

const HI_LABELS: Readonly<Record<string, string>> = {
  "Apply mapping": "चिह्न-मान लागू करें",
  "Evaluate exactly": "सटीक मान निकालें",
  "Transform common left side": "समान बाएँ पक्ष को बदलें",
  "Insert unique operator": "अद्वितीय चिह्न रखें",
  "Insert selected sequence": "चुना हुआ क्रम रखें",
  "Apply simultaneous interchange": "एक साथ परस्पर बदलाव करें",
  "Evaluate transformed expression": "बदले व्यंजक का मान निकालें",
  "Apply unique repair": "अद्वितीय सुधार लागू करें",
  "Relocate relation boundary": "समीकरण-सीमा पुनः निर्धारित करें",
  "Apply whole-number swap": "पूरी संख्याओं का बदलाव लागू करें",
  "Apply global digit swap": "अंकों का वैश्विक बदलाव लागू करें",
  "Apply both simultaneous swaps": "दोनों बदलाव एक साथ लागू करें",
  "Infer mapping": "चिह्नों का अर्थ निर्धारित करें",
  "Apply to target": "लक्ष्य पर लागू करें",
  "Infer mixed mapping": "मिश्रित चिह्न-मान निर्धारित करें",
  "Validate options": "विकल्पों की जाँच करें",
};

const PA_LABELS: Readonly<Record<string, string>> = {
  "Apply mapping": "ਚਿੰਨ੍ਹ-ਅਰਥ ਲਾਗੂ ਕਰੋ",
  "Evaluate exactly": "ਸਹੀ ਮੁੱਲ ਕੱਢੋ",
  "Transform common left side": "ਸਾਂਝਾ ਖੱਬਾ ਪਾਸਾ ਬਦਲੋ",
  "Insert unique operator": "ਇਕੋ ਸਹੀ ਚਿੰਨ੍ਹ ਰੱਖੋ",
  "Insert selected sequence": "ਚੁਣਿਆ ਕ੍ਰਮ ਰੱਖੋ",
  "Apply simultaneous interchange": "ਇਕੱਠਾ ਆਪਸੀ ਬਦਲਾਅ ਕਰੋ",
  "Evaluate transformed expression": "ਬਦਲੇ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ",
  "Apply unique repair": "ਇਕੋ ਸਹੀ ਸੁਧਾਰ ਲਾਗੂ ਕਰੋ",
  "Relocate relation boundary": "ਸਮੀਕਰਨ-ਹੱਦ ਮੁੜ ਨਿਰਧਾਰਤ ਕਰੋ",
  "Apply whole-number swap": "ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਦਾ ਬਦਲਾਅ ਲਾਗੂ ਕਰੋ",
  "Apply global digit swap": "ਅੰਕਾਂ ਦਾ ਵਿਸ਼ਵ ਪੱਧਰੀ ਬਦਲਾਅ ਲਾਗੂ ਕਰੋ",
  "Apply both simultaneous swaps": "ਦੋਵੇਂ ਬਦਲਾਅ ਇਕੱਠੇ ਲਾਗੂ ਕਰੋ",
  "Infer mapping": "ਚਿੰਨ੍ਹਾਂ ਦੇ ਅਰਥ ਨਿਰਧਾਰਤ ਕਰੋ",
  "Apply to target": "ਲਕਸ਼ ਉੱਤੇ ਲਾਗੂ ਕਰੋ",
  "Infer mixed mapping": "ਮਿਸ਼ਰਤ ਚਿੰਨ੍ਹ-ਅਰਥ ਨਿਰਧਾਰਤ ਕਰੋ",
  "Validate options": "ਵਿਕਲਪਾਂ ਦੀ ਜਾਂਚ ਕਰੋ",
};

function translateMappingText(value: string, locale: "hi-IN" | "pa-IN"): string {
  return value.split(", ").map((entry) => {
    const [token, meaning] = entry.split(" means ");
    return locale === "hi-IN"
      ? `${token} का अर्थ ${meaning} है`
      : `${token} ਦਾ ਅਰਥ ${meaning} ਹੈ`;
  }).join(", ");
}

function requireMatch(stem: string, pattern: RegExp, candidateId: string): RegExpMatchArray {
  const match = stem.match(pattern);
  if (!match) throw new Error(`Unable to localize ${candidateId} stem: ${stem}`);
  return match;
}

function localizeStem(question: OpsPilotQuestion, locale: "hi-IN" | "pa-IN"): string {
  const hi = locale === "hi-IN";
  switch (question.candidateId) {
    case "OPS-CAND-001": {
      const match = requireMatch(question.stem, /^If (.+), evaluate (.+)\.$/, question.candidateId);
      const mapping = translateMappingText(match[1], locale);
      return hi ? `यदि ${mapping}, तो ${match[2]} का मान ज्ञात कीजिए।` : `ਜੇ ${mapping}, ਤਾਂ ${match[2]} ਦਾ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-003": {
      const match = requireMatch(question.stem, /^If (.+), select the equation that is true\.$/, question.candidateId);
      const mapping = translateMappingText(match[1], locale);
      return hi ? `यदि ${mapping}, तो सत्य समीकरण चुनिए।` : `ਜੇ ${mapping}, ਤਾਂ ਸਹੀ ਸਮੀਕਰਨ ਚੁਣੋ।`;
    }
    case "OPS-CAND-010": {
      const match = requireMatch(question.stem, /^Which operator replaces the blank in (.+)\?$/, question.candidateId);
      return hi ? `${match[1]} में रिक्त स्थान पर कौन-सा गणितीय चिह्न आएगा?` : `${match[1]} ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਕਿਹੜਾ ਗਣਿਤੀ ਚਿੰਨ੍ਹ ਆਵੇਗਾ?`;
    }
    case "OPS-CAND-012": {
      const match = requireMatch(question.stem, /^Select the ordered pair of operators that makes (.+) true\.$/, question.candidateId);
      return hi ? `${match[1]} को सत्य बनाने वाला गणितीय चिह्नों का सही क्रम चुनिए।` : `${match[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਵਾਲਾ ਗਣਿਤੀ ਚਿੰਨ੍ਹਾਂ ਦਾ ਠੀਕ ਕ੍ਰਮ ਚੁਣੋ।`;
    }
    case "OPS-CAND-014": {
      const match = requireMatch(question.stem, /^Interchange (.+) and (.+) throughout (.+), then evaluate it\.$/, question.candidateId);
      return hi ? `${match[3]} में ${match[1]} और ${match[2]} को हर स्थान पर आपस में बदलकर मान ज्ञात कीजिए।` : `${match[3]} ਵਿੱਚ ${match[1]} ਅਤੇ ${match[2]} ਨੂੰ ਹਰ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਕੇ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-016":
    case "OPS-CAND-018": {
      const match = requireMatch(question.stem, /^Which pair of (?:operators|signs) must be interchanged to make (.+) correct\?$/, question.candidateId);
      return hi ? `${match[1]} को सही बनाने के लिए किन दो चिह्नों को आपस में बदलना होगा?` : `${match[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੇ ਦੋ ਚਿੰਨ੍ਹ ਆਪਸ ਵਿੱਚ ਬਦਲਣੇ ਹੋਣਗੇ?`;
    }
    case "OPS-CAND-020": {
      const match = requireMatch(question.stem, /^Which two complete numbers must be interchanged to make (.+) correct\?$/, question.candidateId);
      return hi ? `${match[1]} को सही बनाने के लिए किन दो पूरी संख्याओं को आपस में बदलना होगा?` : `${match[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੀਆਂ ਦੋ ਪੂਰੀਆਂ ਸੰਖਿਆਵਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲਣੀਆਂ ਹੋਣਗੀਆਂ?`;
    }
    case "OPS-CAND-023": {
      const match = requireMatch(question.stem, /^Which two digits must be interchanged globally to make (.+) correct\?$/, question.candidateId);
      return hi ? `${match[1]} को सही बनाने के लिए किन दो अंकों को पूरे प्रश्न में आपस में बदलना होगा?` : `${match[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜੇ ਦੋ ਅੰਕ ਪੂਰੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਆਪਸ ਵਿੱਚ ਬਦਲਣੇ ਹੋਣਗੇ?`;
    }
    case "OPS-CAND-026": {
      const match = requireMatch(question.stem, /^Which operator pair and whole-number pair must both be interchanged to make (.+) correct\?$/, question.candidateId);
      return hi ? `${match[1]} को सही बनाने के लिए कौन-सा चिह्न-युग्म और पूरी संख्या-युग्म दोनों आपस में बदलने होंगे?` : `${match[1]} ਨੂੰ ਸਹੀ ਬਣਾਉਣ ਲਈ ਕਿਹੜਾ ਚਿੰਨ੍ਹ-ਜੋੜਾ ਅਤੇ ਪੂਰੀ ਸੰਖਿਆ-ਜੋੜਾ ਦੋਵੇਂ ਆਪਸ ਵਿੱਚ ਬਦਲਣੇ ਹੋਣਗੇ?`;
    }
    case "OPS-CAND-030": {
      const match = requireMatch(question.stem, /^Given (.+), evaluate (.+)\.$/, question.candidateId);
      const facts = hi ? match[1].replace(" and ", " तथा ") : match[1].replace(" and ", " ਅਤੇ ");
      return hi ? `${facts} दिए हैं। इनके आधार पर ${match[2]} का मान ज्ञात कीजिए।` : `${facts} ਦਿੱਤੇ ਹਨ। ਇਨ੍ਹਾਂ ਦੇ ਆਧਾਰ ਉੱਤੇ ${match[2]} ਦਾ ਮੁੱਲ ਕੱਢੋ।`;
    }
    case "OPS-CAND-034": {
      const match = requireMatch(question.stem, /^From the facts (.+), infer A, B and C, then select the true statement\.$/, question.candidateId);
      const facts = hi
        ? match[1].replace(" is true and ", " सत्य है तथा ").replace(/ is true$/, " सत्य है")
        : match[1].replace(" is true and ", " ਸਹੀ ਹੈ ਅਤੇ ").replace(/ is true$/, " ਸਹੀ ਹੈ");
      return hi ? `${facts}। इन तथ्यों से A, B और C के अर्थ निर्धारित करके सत्य कथन चुनिए।` : `${facts}। ਇਨ੍ਹਾਂ ਤੱਥਾਂ ਤੋਂ A, B ਅਤੇ C ਦੇ ਅਰਥ ਨਿਰਧਾਰਤ ਕਰਕੇ ਸਹੀ ਕਥਨ ਚੁਣੋ।`;
    }
  }
}

function localizeSteps(steps: readonly OpsPilotExplanationStep[], locale: "hi-IN" | "pa-IN"): readonly OpsPilotExplanationStep[] {
  const labels = locale === "hi-IN" ? HI_LABELS : PA_LABELS;
  return steps.map((step) => ({
    label: labels[step.label] ?? (locale === "hi-IN" ? "समाधान चरण" : "ਹੱਲ ਦਾ ਪੜਾਅ"),
    expression: step.expression,
    result: step.result === "Both sides are equal"
      ? locale === "hi-IN" ? "दोनों पक्ष बराबर हैं" : "ਦੋਵੇਂ ਪਾਸੇ ਬਰਾਬਰ ਹਨ"
      : step.result === "True"
        ? locale === "hi-IN" ? "सत्य" : "ਸਹੀ"
        : step.result,
  }));
}

export function localizeOpsPilotQuestion(
  question: OpsPilotQuestion,
  locale: OpsPilotRuntimeLocale,
): LocalizedOpsPilotQuestion {
  if (locale === "en-IN") return question;
  const rules = locale === "hi-IN" ? HI_RULES : PA_RULES;
  return {
    ...question,
    locale,
    stem: localizeStem(question, locale),
    explanation: {
      ruleStatement: rules[question.candidateId],
      steps: localizeSteps(question.explanation.steps, locale),
      conclusion: locale === "hi-IN"
        ? `अतः सही उत्तर ${question.answer} है।`
        : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${question.answer} ਹੈ।`,
    },
  };
}
