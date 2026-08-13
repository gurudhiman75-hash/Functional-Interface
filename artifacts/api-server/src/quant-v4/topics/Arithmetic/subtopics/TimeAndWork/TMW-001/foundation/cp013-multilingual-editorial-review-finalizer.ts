import type { TmwLanguage } from "./types";

function local(language: TmwLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function polishTerms(value: string, language: TmwLanguage): string {
  if (language === "hi") {
    return value
      .replace(/\binlet\b/gi, "इनलेट")
      .replace(/\bleak\b/gi, "रिसाव")
      .replace(/\bnet\b/gi, "शुद्ध");
  }
  if (language === "pa") {
    return value
      .replace(/\binlet\b/gi, "ਇਨਲੈੱਟ")
      .replace(/\bleak\b/gi, "ਰਿਸਾਅ")
      .replace(/\bnet\b/gi, "ਸ਼ੁੱਧ");
  }
  return value;
}

function mapStrings(values: readonly string[], language: TmwLanguage): string[] {
  return values.map((value) => polishTerms(value, language));
}

export function finalizeTmwCp013MultilingualEditorialReview(question: any, language: TmwLanguage): any {
  if (question?.canonicalProblemId !== "TMW-CP-013") return question;

  const explanation = question.explanation;
  const trapText = explanation.commonTrap.optionText;
  const shortcutTitle = local(
    language,
    "Data-Sufficiency Decision Rule",
    "डेटा-पर्याप्तता निर्णय नियम",
    "ਡਾਟਾ-ਪੂਰਤਾ ਫੈਸਲਾ ਨਿਯਮ",
  );
  const shortcutSteps = [
    local(
      language,
      "Check Statement I alone and decide whether it fixes exactly one value for the target.",
      "पहले केवल कथन I जाँचें और देखें कि क्या उससे लक्ष्य का ठीक एक मान निश्चित होता है।",
      "ਪਹਿਲਾਂ ਕੇਵਲ ਕਥਨ I ਜਾਂਚੋ ਅਤੇ ਵੇਖੋ ਕਿ ਕੀ ਇਸ ਨਾਲ ਲਕਸ਼ ਦਾ ਠੀਕ ਇੱਕ ਮੁੱਲ ਨਿਸ਼ਚਿਤ ਹੁੰਦਾ ਹੈ।",
    ),
    local(
      language,
      "Then reset and check Statement II alone; combine the statements only when neither is sufficient by itself.",
      "फिर नई शुरुआत करके केवल कथन II जाँचें; दोनों कथनों को तभी मिलाएँ जब कोई भी अकेले पर्याप्त न हो।",
      "ਫਿਰ ਨਵੀਂ ਸ਼ੁਰੂਆਤ ਕਰਕੇ ਕੇਵਲ ਕਥਨ II ਜਾਂਚੋ; ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਤਦੋਂ ਹੀ ਮਿਲਾਓ ਜਦੋਂ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਾ ਹੋਵੇ।",
    ),
  ];
  const trapExplanation = local(
    language,
    `Choosing ${trapText} can result from combining the statements too early. First decide whether Statement I or Statement II already fixes the target uniquely on its own.`,
    `${trapText} चुनने की गलती तब हो सकती है जब दोनों कथनों को बहुत जल्दी मिला दिया जाए। पहले जाँचें कि कथन I या कथन II अकेले ही लक्ष्य का एक निश्चित मान देता है या नहीं।`,
    `${trapText} ਚੁਣਨ ਦੀ ਗਲਤੀ ਤਦੋਂ ਹੋ ਸਕਦੀ ਹੈ ਜਦੋਂ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਬਹੁਤ ਜਲਦੀ ਮਿਲਾ ਦਿੱਤਾ ਜਾਵੇ। ਪਹਿਲਾਂ ਜਾਂਚੋ ਕਿ ਕਥਨ I ਜਾਂ ਕਥਨ II ਇਕੱਲਾ ਹੀ ਲਕਸ਼ ਦਾ ਇੱਕ ਨਿਸ਼ਚਿਤ ਮੁੱਲ ਦਿੰਦਾ ਹੈ ਜਾਂ ਨਹੀਂ।`,
  );

  return {
    ...question,
    stem: polishTerms(question.stem, language),
    explanation: {
      ...explanation,
      opening: polishTerms(explanation.opening, language),
      givens: mapStrings(explanation.givens, language),
      steps: mapStrings(explanation.steps, language),
      shortcut: {
        ...explanation.shortcut,
        title: shortcutTitle,
        steps: shortcutSteps,
      },
      commonTrap: {
        ...explanation.commonTrap,
        explanation: trapExplanation,
      },
      conclusion: polishTerms(explanation.conclusion, language),
    },
  };
}
