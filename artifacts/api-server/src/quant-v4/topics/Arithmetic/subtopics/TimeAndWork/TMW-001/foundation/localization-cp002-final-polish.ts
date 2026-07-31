import type { TmwCp002Parameters, TmwCp002SolveMode } from "./cp002-types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

const destructiveModes: readonly TmwCp002SolveMode[] = [
  "findNetTimeWithDestructiveAgent",
  "findDestructiveTimeFromPositiveAndNetTimes",
  "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes",
];

const identicalModes: readonly TmwCp002SolveMode[] = [
  "findIdenticalAgentCountFromSingleAndCombinedTime",
  "findCombinedTimeFromIdenticalAgentCount",
];

function naturalize(value: string, language: TmwLocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replaceAll("रिवर्क", "दोबारा काम")
      .replaceAll("रीवर्क", "दोबारा काम")
      .replaceAll("दोबारा काम काम घटाता है", "दोबारा करने के लिए वापस गया काम कुल प्रगति घटाता है")
      .replaceAll("दोबारा काम दर", "दोबारा काम की दर")
      .replaceAll("परिमाण-अंतर", "अंतर")
      .replaceAll("परिमाण", "मान")
      .replaceAll("निष्फल", "वापस");
  }
  return value
    .replaceAll("ਰੀਵਰਕ", "ਮੁੜ ਕੰਮ")
    .replaceAll("ਮੁੜ ਕੰਮ ਕੰਮ ਘਟਾਉਂਦਾ ਹੈ", "ਮੁੜ ਕਰਨ ਲਈ ਵਾਪਸ ਗਿਆ ਕੰਮ ਕੁੱਲ ਤਰੱਕੀ ਘਟਾਉਂਦਾ ਹੈ")
    .replaceAll("ਮੁੜ ਕੰਮ ਦਰ", "ਮੁੜ ਕੰਮ ਦੀ ਦਰ")
    .replaceAll("ਬੇਅਸਰ", "ਵਾਪਸ");
}

function naturalizeStem(
  value: string,
  language: TmwLocalizedLanguage,
  mode: TmwCp002SolveMode,
  parameters: TmwCp002Parameters,
): string {
  let stem = naturalize(value, language);
  if (language === "hi") {
    stem = stem
      .replaceAll(" का काम में ", " के काम में ")
      .replaceAll(" का ऑर्डर में ", " के ऑर्डर में ")
      .replaceAll("एक मशीन अकेले", "एक मशीन अकेली")
      .replace(/कई मशीनें (.+?) पूरा करते हैं/g, "कई मशीनें $1 पूरा करती हैं");
    if (identicalModes.includes(mode) && parameters.context.agentNoun === "machine") {
      stem = stem.replaceAll("समान क्षमता वाले", "समान क्षमता वाली");
    }
    if (destructiveModes.includes(mode)) {
      stem = stem.replace(
        /^(.+?) और (.+?) अकेले यह काम क्रमशः (.+?) और (.+?) में करते हैं।/,
        "$1 को अकेले यह काम पूरा करने में $3 और $2 को $4 लगते हैं।",
      );
    }
  } else {
    stem = stem
      .replaceAll(" ਦਾ ਕੰਮ ਵਿੱਚ ", " ਦੇ ਕੰਮ ਵਿੱਚ ")
      .replaceAll(" ਦਾ ਆਰਡਰ ਵਿੱਚ ", " ਦੇ ਆਰਡਰ ਵਿੱਚ ")
      .replaceAll("ਇੱਕ ਟੀਮ ਇਕੱਲਾ", "ਇੱਕ ਟੀਮ ਇਕੱਲੀ")
      .replaceAll("ਇੱਕ ਮਸ਼ੀਨ ਇਕੱਲਾ", "ਇੱਕ ਮਸ਼ੀਨ ਇਕੱਲੀ")
      .replace(/ਕਈ ਟੀਮਾਂ (.+?) ਪੂਰਾ ਕਰਦੇ ਹਨ/g, "ਕਈ ਟੀਮਾਂ $1 ਪੂਰਾ ਕਰਦੀਆਂ ਹਨ")
      .replace(/ਕਈ ਮਸ਼ੀਨਾਂ (.+?) ਪੂਰਾ ਕਰਦੇ ਹਨ/g, "ਕਈ ਮਸ਼ੀਨਾਂ $1 ਪੂਰਾ ਕਰਦੀਆਂ ਹਨ");
    if (identicalModes.includes(mode) && ["machine", "crew"].includes(parameters.context.agentNoun)) {
      stem = stem.replaceAll("ਇਕੋ ਸਮਰੱਥਾ ਵਾਲੇ", "ਇਕੋ ਸਮਰੱਥਾ ਵਾਲੀਆਂ");
    }
    if (destructiveModes.includes(mode)) {
      stem = stem.replace(
        /^(.+?) ਅਤੇ (.+?) ਇਕੱਲੇ ਇਹ ਕੰਮ ਕ੍ਰਮਵਾਰ (.+?) ਅਤੇ (.+?) ਵਿੱਚ ਕਰਦੇ ਹਨ।/,
        "$1 ਨੂੰ ਇਕੱਲੇ ਇਹ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ $3 ਅਤੇ $2 ਨੂੰ $4 ਲੱਗਦੇ ਹਨ।",
      );
    }
  }

  if (mode === "findMissingRateFromSignedNetRate" && parameters.context.outputNoun === "applications") {
    if (language === "hi") {
      stem = stem.replace(
        /इकाई ([AB]) (.+?) आवेदन प्रति (दिन|घंटा|मिनट|पाली) पूरा करती है/g,
        "इकाई $1 प्रति $3 $2 आवेदन पूरे करती है",
      );
    } else {
      stem = stem.replace(
        /ਇਕਾਈ ([AB]) (.+?) ਅਰਜ਼ੀਆਂ ਪ੍ਰਤੀ (ਦਿਨ|ਘੰਟਾ|ਮਿੰਟ|ਪਾਲੀ) ਪੂਰੇ ਕਰਦੀ ਹੈ/g,
        "ਇਕਾਈ $1 ਪ੍ਰਤੀ $3 $2 ਅਰਜ਼ੀਆਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ",
      );
    }
  }
  return stem;
}

export function finalizeTmwCp002LocalizedQuestion(
  question: TmwLocalizedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const mode = question.solveMode as TmwCp002SolveMode;
  const parameters = question.parameters as TmwCp002Parameters;
  const answerText = question.solution.answerText;
  let title = naturalize(question.explanation.shortcut.title, language);
  let shortcutSteps = question.explanation.shortcut.steps.map((line) => naturalize(line, language));
  const trapExplanation = naturalize(question.explanation.commonTrap.explanation, language);
  let conclusion = naturalize(question.explanation.conclusion, language);

  if (question.solution.answerType === "FRACTION") {
    shortcutSteps = [copy(
      language,
      `दरें जोड़कर समय से गुणा करने पर ${answerText} पूरा होता है।`,
      `ਦਰਾਂ ਜੋੜ ਕੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ${answerText} ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`,
    )];
  }

  if (destructiveModes.includes(mode)) {
    title = copy(language, "10-सेकंड वापस जाने वाली दर", "10-ਸਕਿੰਟ ਵਾਪਸ ਜਾਣ ਵਾਲੀ ਦਰ");
    shortcutSteps = [copy(
      language,
      "काम पूरा करने वाली दरें जोड़ें, वापस जाने वाली दर घटाएँ और शुद्ध दर का उलटा लें।",
      "ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਾਲੀਆਂ ਦਰਾਂ ਜੋੜੋ, ਵਾਪਸ ਜਾਣ ਵਾਲੀ ਦਰ ਘਟਾਓ ਅਤੇ ਸ਼ੁੱਧ ਦਰ ਦਾ ਉਲਟ ਲਵੋ।",
    )];
  }

  if (mode === "findNetTimeWithDestructiveAgent") {
    conclusion = copy(
      language,
      `अतः इस प्रक्रिया के बावजूद काम ${answerText} में पूरा होगा।`,
      `ਇਸ ਲਈ ਇਸ ਪ੍ਰਕਿਰਿਆ ਦੇ ਬਾਵਜੂਦ ਕੰਮ ${answerText} ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ।`,
    );
  }
  if (mode === "findDestructiveTimeFromPositiveAndNetTimes") {
    conclusion = copy(
      language,
      `अतः वापस भेजने वाली प्रक्रिया अकेले पूरे काम जितना काम ${answerText} में वापस भेजेगी।`,
      `ਇਸ ਲਈ ਵਾਪਸ ਭੇਜਣ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਇਕੱਲੀ ਪੂਰੇ ਕੰਮ ਜਿੰਨਾ ਕੰਮ ${answerText} ਵਿੱਚ ਵਾਪਸ ਭੇਜੇਗੀ।`,
    );
  }
  if (mode === "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes") {
    conclusion = copy(
      language,
      `अतः पहले सदस्य को अकेले काम पूरा करने में ${answerText} लगेंगे।`,
      `ਇਸ ਲਈ ਪਹਿਲੇ ਮੈਂਬਰ ਨੂੰ ਇਕੱਲੇ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${answerText} ਲੱਗਣਗੇ।`,
    );
  }

  if (mode === "findMissingRateFromSignedNetRate") {
    title = language === "hi" ? "10-सेकंड +/− दर" : "10-ਸਕਿੰਟ +/− ਦਰ";
    shortcutSteps = [copy(
      language,
      "+ और − चिह्न सही रखकर अज्ञात दर को शुद्ध दर के संबंध से अलग करें।",
      "+ ਅਤੇ − ਚਿੰਨ੍ਹ ਸਹੀ ਰੱਖ ਕੇ ਅਣਜਾਣ ਦਰ ਨੂੰ ਸ਼ੁੱਧ ਦਰ ਦੇ ਸੰਬੰਧ ਤੋਂ ਅਲੱਗ ਕਰੋ।",
    )];
  }

  return {
    ...question,
    stem: naturalizeStem(question.stem, language, mode, parameters),
    explanation: {
      ...question.explanation,
      shortcut: {
        title,
        steps: shortcutSteps,
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: trapExplanation,
      },
      conclusion,
    },
  };
}
