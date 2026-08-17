import type { TmwCp004GeneratedQuestion } from "./cp004-types";
import { cp004Actor } from "./localization-cp004-language";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function replaceAll(value: string, replacements: readonly (readonly [string, string])[]): string {
  return replacements.reduce((updated, [from, to]) => updated.replaceAll(from, to), value);
}

function replaceLearnerText(
  question: TmwLocalizedQuestion,
  replacements: readonly (readonly [string, string])[],
): TmwLocalizedQuestion {
  return {
    ...question,
    stem: replaceAll(question.stem, replacements),
    explanation: {
      ...question.explanation,
      opening: replaceAll(question.explanation.opening, replacements),
      shortcut: {
        ...question.explanation.shortcut,
        title: replaceAll(question.explanation.shortcut.title, replacements),
        steps: question.explanation.shortcut.steps.map((step) => replaceAll(step, replacements)),
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: replaceAll(question.explanation.commonTrap.explanation, replacements),
      },
      conclusion: replaceAll(question.explanation.conclusion, replacements),
    },
  };
}

function withOpening(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
  hi: string,
  pa: string,
): TmwLocalizedQuestion {
  return {
    ...question,
    explanation: {
      ...question.explanation,
      opening: copy(language, hi, pa),
    },
  };
}

function withShortcut(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
  titleHi: string,
  titlePa: string,
  stepHi: string,
  stepPa: string,
): TmwLocalizedQuestion {
  return {
    ...question,
    explanation: {
      ...question.explanation,
      shortcut: {
        title: copy(language, titleHi, titlePa),
        steps: [copy(language, stepHi, stepPa)],
      },
    },
  };
}

function withTrap(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
  hi: string,
  pa: string,
): TmwLocalizedQuestion {
  return {
    ...question,
    explanation: {
      ...question.explanation,
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: copy(language, hi, pa),
      },
    },
  };
}

function withConclusion(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
  hi: string,
  pa: string,
): TmwLocalizedQuestion {
  return {
    ...question,
    explanation: {
      ...question.explanation,
      conclusion: copy(language, hi, pa),
    },
  };
}

function participationReplacements(
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): readonly (readonly [string, string])[] {
  const actors = (["actorA", "actorB", "actorC"] as const)
    .map((key) => cp004Actor(source.parameters, language, key));
  const replacements: Array<readonly [string, string]> = [];

  for (const actor of actors) {
    if (language === "hi") {
      replacements.push(
        [`${actor} की भागीदारी शुरू हो जाती है`, `${actor} को भी काम में लगा दिया जाता है`],
        [`${actor} की भागीदारी शुरू होती है`, `${actor} को भी काम में लगा दिया जाता है`],
        [`${actor} की भागीदारी बाद में शुरू होती है`, `${actor} को बाद में काम में लगाया जाता है`],
        [`${actor} की भागीदारी समाप्त हो जाती है`, `${actor} को काम से हटा दिया जाता है`],
        [`${actor} की भागीदारी समाप्त होती है`, `${actor} को काम से हटा दिया जाता है`],
        [`बाद में ${actor} की भागीदारी समाप्त हो जाती है`, `बाद में ${actor} को काम से हटा दिया जाता है`],
        [`${actor} की भागीदारी कितने समय बाद शुरू हुई`, `${actor} को कितने समय बाद काम में लगाया गया`],
        [`${actor} की भागीदारी कितने समय बाद समाप्त हुई`, `${actor} को कितने समय बाद काम से हटाया गया`],
        [`${actor} की भागीदारी शुरू होने का समय`, `${actor} को काम में लगाने का समय`],
        [`${actor} की भागीदारी समाप्त होने का समय`, `${actor} को काम से हटाने का समय`],
      );
    } else {
      replacements.push(
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੋ ਜਾਂਦੀ ਹੈ`, `${actor} ਨੂੰ ਵੀ ਕੰਮ ਵਿੱਚ ਲਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`],
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ`, `${actor} ਨੂੰ ਵੀ ਕੰਮ ਵਿੱਚ ਲਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`],
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਬਾਅਦ ਵਿੱਚ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ`, `${actor} ਨੂੰ ਬਾਅਦ ਵਿੱਚ ਕੰਮ ਵਿੱਚ ਲਾਇਆ ਜਾਂਦਾ ਹੈ`],
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ`, `${actor} ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`],
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੁੰਦੀ ਹੈ`, `${actor} ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`],
        [`ਬਾਅਦ ਵਿੱਚ ${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ`, `ਬਾਅਦ ਵਿੱਚ ${actor} ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ`],
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਸ਼ੁਰੂ ਹੋਈ`, `${actor} ਨੂੰ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਕੰਮ ਵਿੱਚ ਲਾਇਆ ਗਿਆ`],
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਖਤਮ ਹੋਈ`, `${actor} ਨੂੰ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਕੰਮ ਤੋਂ ਹਟਾਇਆ ਗਿਆ`],
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੋਣ ਦਾ ਸਮਾਂ`, `${actor} ਨੂੰ ਕੰਮ ਵਿੱਚ ਲਾਉਣ ਦਾ ਸਮਾਂ`],
        [`${actor} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋਣ ਦਾ ਸਮਾਂ`, `${actor} ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾਉਣ ਦਾ ਸਮਾਂ`],
      );
    }
  }

  return replacements;
}

function commonNaturalnessReplacements(
  language: TmwLocalizedLanguage,
): readonly (readonly [string, string])[] {
  return language === "hi"
    ? [
        [
          "हर चरण को अलग रखें। उस चरण में सक्रिय सदस्यों की संयुक्त दर से हुआ काम निकालें, फिर ठीक शेष काम अगले चरण में ले जाएँ।",
          "हर चरण को अलग रखें। उस समय काम कर रहे सदस्यों की संयुक्त दर से हुआ काम निकालें और बचा हुआ काम अगले चरण में ले जाएँ।",
        ],
        [
          "सदस्य बदलने पर पहले किया गया काम बना रहता है। पूरे काम में से उसे घटाकर शेष भाग पर नए सदस्य की दर लगाएँ।",
          "सदस्य बदलने पर पहले किया गया काम नहीं मिटता। उसे पूरे काम में से घटाएँ और बचे हुए काम पर नए सदस्य की दर लगाएँ।",
        ],
        [", फिर कार्य-दल बदल जाता है। उस समय तक", "। इस अवधि में"],
        ["घटना तक काम का", "दिए समय तक काम का"],
        ["बदली हुई चरणबद्ध स्थिति", "वास्तविक स्थिति"],
        ["बिना बदलाव वाली संदर्भ स्थिति", "तुलना वाली स्थिति"],
      ]
    : [
        [
          "ਹਰ ਪੜਾਅ ਨੂੰ ਵੱਖ ਰੱਖੋ। ਉਸ ਪੜਾਅ ਵਿੱਚ ਸਰਗਰਮ ਮੈਂਬਰਾਂ ਦੀ ਸਾਂਝੀ ਦਰ ਨਾਲ ਹੋਇਆ ਕੰਮ ਕੱਢੋ, ਫਿਰ ਸਹੀ ਬਾਕੀ ਕੰਮ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਲੈ ਜਾਓ।",
          "ਹਰ ਪੜਾਅ ਨੂੰ ਵੱਖ ਰੱਖੋ। ਉਸ ਵੇਲੇ ਕੰਮ ਕਰ ਰਹੇ ਮੈਂਬਰਾਂ ਦੀ ਸਾਂਝੀ ਦਰ ਨਾਲ ਹੋਇਆ ਕੰਮ ਕੱਢੋ ਅਤੇ ਬਚਿਆ ਹੋਇਆ ਕੰਮ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਲੈ ਜਾਓ।",
        ],
        [
          "ਮੈਂਬਰ ਬਦਲਣ ਉੱਤੇ ਪਹਿਲਾਂ ਕੀਤਾ ਕੰਮ ਬਣਿਆ ਰਹਿੰਦਾ ਹੈ। ਸਾਰੇ ਕੰਮ ਵਿੱਚੋਂ ਉਹ ਘਟਾ ਕੇ ਬਾਕੀ ਹਿੱਸੇ ਉੱਤੇ ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਦਰ ਲਗਾਓ।",
          "ਮੈਂਬਰ ਬਦਲਣ ਉੱਤੇ ਪਹਿਲਾਂ ਕੀਤਾ ਕੰਮ ਮਿਟਦਾ ਨਹੀਂ। ਉਸ ਨੂੰ ਸਾਰੇ ਕੰਮ ਵਿੱਚੋਂ ਘਟਾਓ ਅਤੇ ਬਚੇ ਕੰਮ ਉੱਤੇ ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਦਰ ਲਗਾਓ।",
        ],
        [", ਫਿਰ ਟੀਮ ਬਦਲ ਜਾਂਦੀ ਹੈ। ਉਸ ਵੇਲੇ ਤੱਕ", "। ਇਸ ਸਮੇਂ ਦੌਰਾਨ"],
        ["ਘਟਨਾ ਤੱਕ ਕੰਮ ਦਾ", "ਦਿੱਤੇ ਸਮੇਂ ਤੱਕ ਕੰਮ ਦਾ"],
        ["ਬਦਲੀ ਹੋਈ ਪੜਾਅਵਾਰ ਸਥਿਤੀ", "ਅਸਲ ਸਥਿਤੀ"],
        ["ਬਿਨਾਂ ਬਦਲਾਅ ਵਾਲੀ ਹਵਾਲਾ ਸਥਿਤੀ", "ਤੁਲਨਾ ਵਾਲੀ ਸਥਿਤੀ"],
      ];
}

export function applyTmwCp004EditorialReviewRemediation(
  question: TmwLocalizedQuestion,
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  let updated = replaceLearnerText(question, [
    ...commonNaturalnessReplacements(language),
    ...participationReplacements(source, language),
  ]);
  const answer = updated.solution.answerText;
  const actorA = cp004Actor(source.parameters, language, "actorA");
  const actorB = cp004Actor(source.parameters, language, "actorB");
  const actorC = cp004Actor(source.parameters, language, "actorC");

  if (source.questionLanguageId === "TMW-QL-063") {
    updated = replaceLearnerText(updated, language === "hi"
      ? [[`${actorB} की और उसके`, `${actorB} को काम में लगाया जाता है और उसके`]]
      : [[`${actorB} ਦੀ ਅਤੇ ਉਸ ਤੋਂ`, `${actorB} ਨੂੰ ਕੰਮ ਵਿੱਚ ਲਾਇਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਉਸ ਤੋਂ`]]);
  }
  if (source.questionLanguageId === "TMW-QL-064") {
    updated = replaceLearnerText(updated, language === "hi"
      ? [[`${actorC} की और उसके`, `${actorC} को काम से हटा दिया जाता है और उसके`]]
      : [[`${actorC} ਦੀ ਅਤੇ ਉਸ ਤੋਂ`, `${actorC} ਨੂੰ ਕੰਮ ਤੋਂ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਉਸ ਤੋਂ`]]);
  }

  switch (source.solveMode) {
    case "findWorkCompletedBeforeEvent":
      updated = withOpening(
        updated,
        language,
        "दिए समय में दोनों की संयुक्त दर से कितना काम हुआ, बस वही निकालना है।",
        "ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ਦੋਵਾਂ ਦੀ ਸਾਂਝੀ ਦਰ ਨਾਲ ਕਿੰਨਾ ਕੰਮ ਹੋਇਆ, ਸਿਰਫ਼ ਉਹੀ ਕੱਢਣਾ ਹੈ।",
      );
      break;
    case "findJoinTimeFromFinalCompletion":
      updated = withOpening(
        updated,
        language,
        "जुड़ने का समय x मानें। पहले x समय अकेली दर और बाकी समय संयुक्त दर से हुए काम का योग 1 रखें।",
        "ਜੁੜਨ ਦਾ ਸਮਾਂ x ਮੰਨੋ। ਪਹਿਲਾਂ x ਸਮੇਂ ਲਈ ਇਕੱਲੀ ਦਰ ਅਤੇ ਬਾਕੀ ਸਮੇਂ ਲਈ ਸਾਂਝੀ ਦਰ ਨਾਲ ਹੋਏ ਕੰਮ ਦਾ ਜੋੜ 1 ਰੱਖੋ।",
      );
      updated = withConclusion(
        updated,
        language,
        `अतः ${actorB} को शुरू से ${answer} बाद काम में लगाया गया।`,
        `ਇਸ ਲਈ ${actorB} ਨੂੰ ਸ਼ੁਰੂ ਤੋਂ ${answer} ਬਾਅਦ ਕੰਮ ਵਿੱਚ ਲਾਇਆ ਗਿਆ।`,
      );
      break;
    case "findLeaveTimeFromFinalCompletion":
      updated = withOpening(
        updated,
        language,
        "हटाने का समय x मानें। पहले x समय संयुक्त दर और बाकी समय अकेली दर से हुए काम का योग 1 रखें।",
        "ਕੰਮ ਤੋਂ ਹਟਾਉਣ ਦਾ ਸਮਾਂ x ਮੰਨੋ। ਪਹਿਲਾਂ x ਸਮੇਂ ਲਈ ਸਾਂਝੀ ਦਰ ਅਤੇ ਬਾਕੀ ਸਮੇਂ ਲਈ ਇਕੱਲੀ ਦਰ ਨਾਲ ਹੋਏ ਕੰਮ ਦਾ ਜੋੜ 1 ਰੱਖੋ।",
      );
      updated = withConclusion(
        updated,
        language,
        `अतः ${actorA} को शुरू से ${answer} बाद काम से हटाया गया।`,
        `ਇਸ ਲਈ ${actorA} ਨੂੰ ਸ਼ੁਰੂ ਤੋਂ ${answer} ਬਾਅਦ ਕੰਮ ਤੋਂ ਹਟਾਇਆ ਗਿਆ।`,
      );
      break;
    case "findUnknownInitialPhaseDuration":
      updated = withOpening(
        updated,
        language,
        "पहले चरण की अवधि x मानें। पहले और अंतिम चरण में हुए काम का योग 1 रखकर x निकालें।",
        "ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਮਿਆਦ x ਮੰਨੋ। ਪਹਿਲੇ ਅਤੇ ਆਖ਼ਰੀ ਪੜਾਅ ਵਿੱਚ ਹੋਏ ਕੰਮ ਦਾ ਜੋੜ 1 ਰੱਖ ਕੇ x ਕੱਢੋ।",
      );
      break;
    case "findUnknownFinalPhaseDuration":
      updated = withOpening(
        updated,
        language,
        "पहले चरण में हुआ काम 1 में से घटाएँ। बचे हुए काम को अंतिम सदस्य की दर से भाग देने पर अंतिम चरण का समय मिलेगा।",
        "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਹੋਇਆ ਕੰਮ 1 ਵਿੱਚੋਂ ਘਟਾਓ। ਬਚੇ ਕੰਮ ਨੂੰ ਆਖ਼ਰੀ ਮੈਂਬਰ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਆਖ਼ਰੀ ਪੜਾਅ ਦਾ ਸਮਾਂ ਮਿਲੇਗਾ।",
      );
      break;
    case "findEventTimeAtSpecifiedCompletionFraction":
      updated = withOpening(
        updated,
        language,
        "लक्षित काम के भाग को अकेली दैनिक दर से भाग दें; इससे उस भाग के पूरा होने का समय मिलेगा।",
        "ਟੀਚੇ ਵਾਲੇ ਕੰਮ ਦੇ ਹਿੱਸੇ ਨੂੰ ਇਕੱਲੀ ਰੋਜ਼ਾਨਾ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ; ਇਸ ਨਾਲ ਉਸ ਹਿੱਸੇ ਦੇ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਮਿਲੇਗਾ।",
      );
      break;
    case "findRequiredRemainingRateForDeadline":
      updated = withOpening(
        updated,
        language,
        "पहले चरण में हुआ काम 1 में से घटाएँ। बचे हुए काम को उपलब्ध बाकी समय से भाग देने पर आवश्यक दैनिक दर मिलेगी।",
        "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਹੋਇਆ ਕੰਮ 1 ਵਿੱਚੋਂ ਘਟਾਓ। ਬਚੇ ਕੰਮ ਨੂੰ ਉਪਲਬਧ ਬਾਕੀ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇਣ ਉੱਤੇ ਲੋੜੀਂਦੀ ਰੋਜ਼ਾਨਾ ਦਰ ਮਿਲੇਗੀ।",
      );
      break;
    case "findCompletionWithChangedDailyHours":
      updated = withOpening(
        updated,
        language,
        "पहले चरण में हुआ काम जस का तस रहता है। बाद के चरण की दैनिक दर को नए और पुराने घंटों के अनुपात से बदलें।",
        "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਹੋਇਆ ਕੰਮ ਜਿਉਂ ਦਾ ਤਿਉਂ ਰਹਿੰਦਾ ਹੈ। ਬਾਅਦਲੇ ਪੜਾਅ ਦੀ ਰੋਜ਼ਾਨਾ ਦਰ ਨੂੰ ਨਵੇਂ ਅਤੇ ਪੁਰਾਣੇ ਘੰਟਿਆਂ ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਬਦਲੋ।",
      );
      updated = withTrap(
        updated,
        language,
        "यह केवल काम के घंटे बदलने का दिन है; प्रश्न पूरे काम के समाप्त होने का कुल समय पूछता है।",
        "ਇਹ ਸਿਰਫ਼ ਕੰਮ ਦੇ ਘੰਟੇ ਬਦਲਣ ਵਾਲਾ ਦਿਨ ਹੈ; ਪ੍ਰਸ਼ਨ ਸਾਰਾ ਕੰਮ ਮੁਕੰਮਲ ਹੋਣ ਦਾ ਕੁੱਲ ਸਮਾਂ ਪੁੱਛਦਾ ਹੈ।",
      );
      break;
    case "findCompletionWithMidProjectEfficiencyChange":
      updated = withOpening(
        updated,
        language,
        "पहले चरण में हुआ काम जस का तस रहता है। बाद के चरण की दर को दिए कार्यक्षमता-गुणक से बदलकर बचे हुए काम पर लगाएँ।",
        "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਹੋਇਆ ਕੰਮ ਜਿਉਂ ਦਾ ਤਿਉਂ ਰਹਿੰਦਾ ਹੈ। ਬਾਅਦਲੇ ਪੜਾਅ ਦੀ ਦਰ ਨੂੰ ਦਿੱਤੇ ਕਾਰਗੁਜ਼ਾਰੀ-ਗੁਣਕ ਨਾਲ ਬਦਲ ਕੇ ਬਚੇ ਕੰਮ ਉੱਤੇ ਲਗਾਓ।",
      );
      updated = withTrap(
        updated,
        language,
        "यह केवल कार्यक्षमता बदलने का दिन है; प्रश्न शुरू से पूरा होने का कुल समय पूछता है।",
        "ਇਹ ਸਿਰਫ਼ ਕਾਰਗੁਜ਼ਾਰੀ ਬਦਲਣ ਵਾਲਾ ਦਿਨ ਹੈ; ਪ੍ਰਸ਼ਨ ਸ਼ੁਰੂ ਤੋਂ ਪੂਰਾ ਹੋਣ ਦਾ ਕੁੱਲ ਸਮਾਂ ਪੁੱਛਦਾ ਹੈ।",
      );
      break;
    case "findCompletionWithNegativeWorkerActivatedLater":
      updated = withOpening(
        updated,
        language,
        "बिगाड़ने वाली प्रक्रिया शुरू होने के बाद काम करने वालों की संयुक्त दर में से बिगाड़ की दर घटाएँ। यही शुद्ध दर बचे हुए काम पर लगेगी।",
        "ਕੰਮ ਖਰਾਬ ਕਰਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਕੰਮ ਕਰਨ ਵਾਲਿਆਂ ਦੀ ਸਾਂਝੀ ਦਰ ਵਿੱਚੋਂ ਖਰਾਬੀ ਦੀ ਦਰ ਘਟਾਓ। ਇਹੀ ਸ਼ੁੱਧ ਦਰ ਬਚੇ ਕੰਮ ਉੱਤੇ ਲੱਗੇਗੀ।",
      );
      updated = withShortcut(
        updated,
        language,
        "10-सेकंड काम की दर − बिगाड़ की दर",
        "10-ਸਕਿੰਟ ਕੰਮ ਦੀ ਦਰ − ਖਰਾਬੀ ਦੀ ਦਰ",
        `बिगाड़ शुरू होने के बाद शुद्ध दर = संयुक्त काम की दर − बिगाड़ की दर; कुल समय ${answer} है।`,
        `ਖਰਾਬੀ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਸ਼ੁੱਧ ਦਰ = ਸਾਂਝੀ ਕੰਮ ਦੀ ਦਰ − ਖਰਾਬੀ ਦੀ ਦਰ; ਕੁੱਲ ਸਮਾਂ ${answer} ਹੈ।`,
      );
      updated = withTrap(
        updated,
        language,
        "यह केवल बिगाड़ने वाली प्रक्रिया शुरू होने तक का समय है; उसके बाद की शुद्ध दर से बाकी काम भी पूरा करना होगा।",
        "ਇਹ ਸਿਰਫ਼ ਕੰਮ ਖਰਾਬ ਕਰਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਹੋਣ ਤੱਕ ਦਾ ਸਮਾਂ ਹੈ; ਉਸ ਤੋਂ ਬਾਅਦ ਦੀ ਸ਼ੁੱਧ ਦਰ ਨਾਲ ਬਾਕੀ ਕੰਮ ਵੀ ਪੂਰਾ ਕਰਨਾ ਪਵੇਗਾ।",
      );
      break;
    case "findWorkerCountAddedAfterPartialProgress":
    case "findWorkerCountRemovedAfterPartialProgress":
      updated = withOpening(
        updated,
        language,
        "पहले चरण में कर्मचारियों ने जितना काम किया, उसे पूरे काम में से घटाएँ। बचे काम और बाकी समय से बाद में आवश्यक कुल कर्मचारी निकालें।",
        "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਨੇ ਜਿੰਨਾ ਕੰਮ ਕੀਤਾ, ਉਸ ਨੂੰ ਸਾਰੇ ਕੰਮ ਵਿੱਚੋਂ ਘਟਾਓ। ਬਚੇ ਕੰਮ ਅਤੇ ਬਾਕੀ ਸਮੇਂ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦੇ ਕੁੱਲ ਕਰਮਚਾਰੀ ਕੱਢੋ।",
      );
      break;
    case "findDelayAfterWorkerLeaves":
      updated = withOpening(
        updated,
        language,
        "पहले वास्तविक स्थिति का कुल समय निकालें। फिर दोनों के अंत तक साथ काम करने का समय निकालकर दोनों का अंतर लें।",
        "ਪਹਿਲਾਂ ਅਸਲ ਸਥਿਤੀ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ। ਫਿਰ ਦੋਵਾਂ ਦੇ ਅੰਤ ਤੱਕ ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਦਾ ਸਮਾਂ ਕੱਢ ਕੇ ਦੋਵਾਂ ਦਾ ਅੰਤਰ ਲਵੋ।",
      );
      updated = withShortcut(
        updated,
        language,
        "10-सेकंड वास्तविक समय − साथ वाला समय",
        "10-ਸਕਿੰਟ ਅਸਲ ਸਮਾਂ − ਇਕੱਠੇ ਵਾਲਾ ਸਮਾਂ",
        `सदस्य हटने वाली वास्तविक स्थिति का कुल समय − दोनों के साथ काम करने का समय = ${answer} देरी।`,
        `ਮੈਂਬਰ ਹਟਣ ਵਾਲੀ ਅਸਲ ਸਥਿਤੀ ਦਾ ਕੁੱਲ ਸਮਾਂ − ਦੋਵਾਂ ਦੇ ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਦਾ ਸਮਾਂ = ${answer} ਦੇਰੀ।`,
      );
      break;
    case "findEarlyCompletionAfterWorkerJoins":
      updated = withOpening(
        updated,
        language,
        "पहले अकेले पूरा होने का समय निकालें। फिर बाद में दूसरा सदस्य जुड़ने वाली वास्तविक स्थिति का कुल समय निकालकर अंतर लें।",
        "ਪਹਿਲਾਂ ਇਕੱਲੇ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਕੱਢੋ। ਫਿਰ ਬਾਅਦ ਵਿੱਚ ਦੂਜਾ ਮੈਂਬਰ ਜੁੜਨ ਵਾਲੀ ਅਸਲ ਸਥਿਤੀ ਦਾ ਕੁੱਲ ਸਮਾਂ ਕੱਢ ਕੇ ਅੰਤਰ ਲਵੋ।",
      );
      updated = withShortcut(
        updated,
        language,
        "10-सेकंड अकेले का समय − वास्तविक समय",
        "10-ਸਕਿੰਟ ਇਕੱਲੇ ਦਾ ਸਮਾਂ − ਅਸਲ ਸਮਾਂ",
        `अकेले पूरा होने का समय − बाद में सदस्य जुड़ने वाली स्थिति का कुल समय = ${answer} बचत।`,
        `ਇਕੱਲੇ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ − ਬਾਅਦ ਵਿੱਚ ਮੈਂਬਰ ਜੁੜਨ ਵਾਲੀ ਸਥਿਤੀ ਦਾ ਕੁੱਲ ਸਮਾਂ = ${answer} ਬਚਤ।`,
      );
      break;
  }

  return updated;
}
