import type { TmwLanguage } from "./types";

type AnyQuestion = Record<string, any>;

function tr(language: TmwLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function deepMapStrings(value: any, transform: (text: string) => string): any {
  if (typeof value === "string") return transform(value);
  if (Array.isArray(value)) return value.map((item) => deepMapStrings(item, transform));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, deepMapStrings(item, transform)]));
  }
  return value;
}

function learnerMethod(mode: string, language: TmwLanguage): string {
  if (mode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup") {
    return tr(
      language,
      "Convert the two completion times to work rates, subtract the A+B rate from the A+B+C rate, then take the reciprocal of C's rate.",
      "दोनों पूरा करने के समयों को कार्य-दर में बदलें, A+B की दर को A+B+C की दर से घटाएँ और फिर C की दर का व्युत्क्रम लें।",
      "ਦੋਵੇਂ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮਿਆਂ ਨੂੰ ਕੰਮ-ਦਰਾਂ ਵਿੱਚ ਬਦਲੋ, A+B ਦੀ ਦਰ ਨੂੰ A+B+C ਦੀ ਦਰ ਵਿੱਚੋਂ ਘਟਾਓ ਅਤੇ ਫਿਰ C ਦੀ ਦਰ ਦਾ ਉਲਟ ਲਓ।",
    );
  }
  if (mode === "findNewCombinedTimeAfterMemberEfficiencyIncrease") {
    return tr(
      language,
      "Keep total work fixed in efficiency units, change only A's efficiency by the stated percentage, add B's unchanged efficiency, and divide the same work by the new team efficiency.",
      "कुल काम को दक्षता-इकाइयों में स्थिर रखें, केवल A की दक्षता को दिए प्रतिशत से बदलें, B की अपरिवर्तित दक्षता जोड़ें और उसी काम को नई टीम-दक्षता से भाग दें।",
      "ਕੁੱਲ ਕੰਮ ਨੂੰ ਕੁਸ਼ਲਤਾ-ਇਕਾਈਆਂ ਵਿੱਚ ਸਥਿਰ ਰੱਖੋ, ਸਿਰਫ਼ A ਦੀ ਕੁਸ਼ਲਤਾ ਨੂੰ ਦਿੱਤੇ ਪ੍ਰਤੀਸ਼ਤ ਨਾਲ ਬਦਲੋ, B ਦੀ ਨਾ-ਬਦਲੀ ਕੁਸ਼ਲਤਾ ਜੋੜੋ ਅਤੇ ਉਸੇ ਕੰਮ ਨੂੰ ਨਵੀਂ ਟੀਮ-ਕੁਸ਼ਲਤਾ ਨਾਲ ਭਾਗ ਦਿਓ।",
    );
  }
  if (mode === "findTimeSavedAfterMemberEfficiencyIncrease") {
    return tr(
      language,
      "Find the new team time after changing only A's efficiency, then subtract the new time from the original time to obtain the saving.",
      "केवल A की दक्षता बदलने के बाद टीम का नया समय निकालें, फिर समय-बचत के लिए मूल समय में से नया समय घटाएँ।",
      "ਸਿਰਫ਼ A ਦੀ ਕੁਸ਼ਲਤਾ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਟੀਮ ਦਾ ਨਵਾਂ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਸਮਾਂ-ਬਚਤ ਲਈ ਮੂਲ ਸਮੇਂ ਵਿੱਚੋਂ ਨਵਾਂ ਸਮਾਂ ਘਟਾਓ।",
    );
  }
  return tr(
    language,
    "Find the new team time after reducing only A's efficiency, then subtract the original time from the new time to obtain the delay.",
    "केवल A की दक्षता घटाने के बाद टीम का नया समय निकालें, फिर देरी के लिए नए समय में से मूल समय घटाएँ।",
    "ਸਿਰਫ਼ A ਦੀ ਕੁਸ਼ਲਤਾ ਘਟਾਉਣ ਤੋਂ ਬਾਅਦ ਟੀਮ ਦਾ ਨਵਾਂ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ ਦੇਰੀ ਲਈ ਨਵੇਂ ਸਮੇਂ ਵਿੱਚੋਂ ਮੂਲ ਸਮਾਂ ਘਟਾਓ।",
  );
}

function conclusion(mode: string, answer: string, language: TmwLanguage): string {
  if (mode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup") {
    return tr(language, `Therefore, C alone completes the work in ${answer}.`, `अतः C अकेला काम ${answer} में पूरा करता है।`, `ਇਸ ਲਈ C ਇਕੱਲਾ ਕੰਮ ${answer} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ।`);
  }
  if (mode === "findNewCombinedTimeAfterMemberEfficiencyIncrease") {
    return tr(language, `Therefore, their new combined completion time is ${answer}.`, `अतः दोनों का नया संयुक्त समय ${answer} है।`, `ਇਸ ਲਈ ਦੋਵਾਂ ਦਾ ਨਵਾਂ ਸਾਂਝਾ ਸਮਾਂ ${answer} ਹੈ।`);
  }
  if (mode === "findTimeSavedAfterMemberEfficiencyIncrease") {
    return tr(language, `Therefore, the time saved is ${answer}.`, `अतः बचा हुआ समय ${answer} है।`, `ਇਸ ਲਈ ਬਚਿਆ ਹੋਇਆ ਸਮਾਂ ${answer} ਹੈ।`);
  }
  return tr(language, `Therefore, completion is delayed by ${answer}.`, `अतः काम पूरा होने में ${answer} की देरी होती है।`, `ਇਸ ਲਈ ਕੰਮ ਪੂਰਾ ਹੋਣ ਵਿੱਚ ${answer} ਦੀ ਦੇਰੀ ਹੁੰਦੀ ਹੈ।`);
}

function shortcut(mode: string, language: TmwLanguage): { title: string; steps: string[] } {
  if (mode === "findExcludedIndividualTimeFromAllTogetherAndSubgroup") {
    return {
      title: tr(language, "Quick Rate-Subtraction Method", "त्वरित दर-घटाव विधि", "ਤੇਜ਼ ਦਰ-ਘਟਾਓ ਵਿਧੀ"),
      steps: [
        tr(language, "Subtract work rates, not completion times: rate of C = rate of (A+B+C) − rate of (A+B).", "पूरा करने के समय नहीं, कार्य-दरें घटाएँ: C की दर = (A+B+C) की दर − (A+B) की दर।", "ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਨਹੀਂ, ਕੰਮ-ਦਰਾਂ ਘਟਾਓ: C ਦੀ ਦਰ = (A+B+C) ਦੀ ਦਰ − (A+B) ਦੀ ਦਰ।"),
        tr(language, "Take the reciprocal of C's remaining rate to get C's solo completion time.", "C की बची हुई दर का व्युत्क्रम लेने पर C का अकेले पूरा करने का समय मिलता है।", "C ਦੀ ਬਚੀ ਹੋਈ ਦਰ ਦਾ ਉਲਟ ਲੈਣ ਨਾਲ C ਦਾ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ਮਿਲਦਾ ਹੈ।"),
      ],
    };
  }
  return {
    title: tr(language, "Quick Efficiency-Unit Method", "त्वरित दक्षता-इकाई विधि", "ਤੇਜ਼ ਕੁਸ਼ਲਤਾ-ਇਕਾਈ ਵਿਧੀ"),
    steps: [
      tr(language, "Keep total work fixed: original time × original team efficiency = total work units.", "कुल काम स्थिर रखें: मूल समय × मूल टीम-दक्षता = कुल कार्य-इकाइयाँ।", "ਕੁੱਲ ਕੰਮ ਸਥਿਰ ਰੱਖੋ: ਮੂਲ ਸਮਾਂ × ਮੂਲ ਟੀਮ-ਕੁਸ਼ਲਤਾ = ਕੁੱਲ ਕੰਮ-ਇਕਾਈਆਂ।"),
      tr(language, "Change only A's efficiency, add B's unchanged efficiency, find the new time, and compare with the original time if saving or delay is asked.", "केवल A की दक्षता बदलें, B की अपरिवर्तित दक्षता जोड़ें, नया समय निकालें और समय-बचत या देरी पूछी हो तो मूल समय से तुलना करें।", "ਸਿਰਫ਼ A ਦੀ ਕੁਸ਼ਲਤਾ ਬਦਲੋ, B ਦੀ ਨਾ-ਬਦਲੀ ਕੁਸ਼ਲਤਾ ਜੋੜੋ, ਨਵਾਂ ਸਮਾਂ ਕੱਢੋ ਅਤੇ ਜੇ ਸਮਾਂ-ਬਚਤ ਜਾਂ ਦੇਰੀ ਪੁੱਛੀ ਹੋਵੇ ਤਾਂ ਮੂਲ ਸਮੇਂ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।"),
    ],
  };
}

function trapExplanation(question: AnyQuestion, language: TmwLanguage): string {
  const trap = question.explanation?.commonTrap ?? {};
  const option = trap.optionText ?? tr(language, "that option", "उस विकल्प", "ਉਸ ਵਿਕਲਪ");
  switch (trap.misconceptionId) {
    case "SUBGROUP_TIME_REPORTED":
      return tr(language, `Choosing ${option} merely reports the A+B time. C's rate must be isolated by subtracting rates.`, `${option} चुनना केवल A+B का समय लिख देता है। C की दर निकालने के लिए कार्य-दरें घटानी होंगी।`, `${option} ਚੁਣਨਾ ਸਿਰਫ਼ A+B ਦਾ ਸਮਾਂ ਲਿਖ ਦਿੰਦਾ ਹੈ। C ਦੀ ਦਰ ਕੱਢਣ ਲਈ ਕੰਮ-ਦਰਾਂ ਘਟਾਉਣੀਆਂ ਪੈਣਗੀਆਂ।`);
    case "ALL_TOGETHER_TIME_REPORTED":
      return tr(language, `Choosing ${option} merely reports the all-together time. It is not C's solo time.`, `${option} चुनना केवल तीनों का संयुक्त समय लिख देता है; यह C का अकेले का समय नहीं है।`, `${option} ਚੁਣਨਾ ਸਿਰਫ਼ ਤਿੰਨਾਂ ਦਾ ਸਾਂਝਾ ਸਮਾਂ ਲਿਖ ਦਿੰਦਾ ਹੈ; ਇਹ C ਦਾ ਇਕੱਲੇ ਦਾ ਸਮਾਂ ਨਹੀਂ ਹੈ।`);
    case "SUBTRACT_TIMES_INSTEAD_OF_RATES":
      return tr(language, `Choosing ${option} comes from combining completion times directly. Work rates, not times, must be subtracted.`, `${option} चुनना पूरा करने के समयों पर सीधे क्रिया करने की गलती से मिलता है। सही तरीका कार्य-दरों को घटाना है।`, `${option} ਚੁਣਨਾ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮਿਆਂ ਉੱਤੇ ਸਿੱਧੀ ਕ੍ਰਿਆ ਕਰਨ ਦੀ ਗਲਤੀ ਤੋਂ ਮਿਲਦਾ ਹੈ। ਸਹੀ ਤਰੀਕਾ ਕੰਮ-ਦਰਾਂ ਨੂੰ ਘਟਾਉਣਾ ਹੈ।`);
    case "ORIGINAL_TIME_REPORTED":
      return tr(language, `Choosing ${option} keeps the original team time and ignores A's changed efficiency.`, `${option} चुनना मूल संयुक्त समय को ही रखता है और A की बदली दक्षता को नज़रअंदाज़ करता है।`, `${option} ਚੁਣਨਾ ਮੂਲ ਸਾਂਝੇ ਸਮੇਂ ਨੂੰ ਹੀ ਰੱਖਦਾ ਹੈ ਅਤੇ A ਦੀ ਬਦਲੀ ਕੁਸ਼ਲਤਾ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ।`);
    case "CHANGED_TIME_REPORTED":
      return tr(language, `Choosing ${option} reports the new completion time itself, but the question asks for the difference from the original time.`, `${option} चुनना नया पूरा करने का समय ही बता देता है, जबकि प्रश्न मूल समय से अंतर पूछता है।`, `${option} ਚੁਣਨਾ ਨਵਾਂ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ਹੀ ਦੱਸ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਸਵਾਲ ਮੂਲ ਸਮੇਂ ਨਾਲ ਅੰਤਰ ਪੁੱਛਦਾ ਹੈ।`);
    case "PERCENT_APPLIED_DIRECTLY_TO_TIME":
      return tr(language, `Choosing ${option} applies A's efficiency percentage directly to the completion time. Efficiency changes the team rate, not time by the same percentage.`, `${option} चुनना A की दक्षता का प्रतिशत सीधे पूरा करने के समय पर लगा देता है। दक्षता टीम-दर बदलती है; समय उसी प्रतिशत से सीधे नहीं बदलता।`, `${option} ਚੁਣਨਾ A ਦੀ ਕੁਸ਼ਲਤਾ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਸਿੱਧਾ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਉੱਤੇ ਲਾ ਦਿੰਦਾ ਹੈ। ਕੁਸ਼ਲਤਾ ਟੀਮ-ਦਰ ਬਦਲਦੀ ਹੈ; ਸਮਾਂ ਉਸੇ ਪ੍ਰਤੀਸ਼ਤ ਨਾਲ ਸਿੱਧਾ ਨਹੀਂ ਬਦਲਦਾ।`);
    case "WHOLE_TEAM_PERCENT_CHANGED":
      return tr(language, `Choosing ${option} treats A's percentage change as if it applied to the whole team's efficiency. B's efficiency is unchanged.`, `${option} चुनना A की दक्षता में बदलाव को पूरी टीम पर लागू मान लेता है, जबकि B की दक्षता नहीं बदलती।`, `${option} ਚੁਣਨਾ A ਦੀ ਕੁਸ਼ਲਤਾ ਦੇ ਬਦਲਾਅ ਨੂੰ ਪੂਰੀ ਟੀਮ ਉੱਤੇ ਲਾਗੂ ਮੰਨ ਲੈਂਦਾ ਹੈ, ਜਦਕਿ B ਦੀ ਕੁਸ਼ਲਤਾ ਨਹੀਂ ਬਦਲਦੀ।`);
    default:
      return tr(language, `Choosing ${option} comes from changing the wrong quantity. Keep total work fixed and change only the rate stated in the question.`, `${option} चुनना गलत राशि बदलने से मिलता है। कुल काम स्थिर रखें और केवल प्रश्न में दी गई दर बदलें।`, `${option} ਚੁਣਨਾ ਗਲਤ ਮਾਤਰਾ ਬਦਲਣ ਨਾਲ ਮਿਲਦਾ ਹੈ। ਕੁੱਲ ਕੰਮ ਸਥਿਰ ਰੱਖੋ ਅਤੇ ਸਿਰਫ਼ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਦਰ ਬਦਲੋ।`);
  }
}

export function finalizeTmwCp012MultilingualEditorialReview(
  question: AnyQuestion,
  qlId: string,
  language: TmwLanguage,
): AnyQuestion {
  if (question?.canonicalProblemId !== "TMW-CP-012") return question;
  const cleaned = language === "en"
    ? deepMapStrings(question, (value) => value.replaceAll("required saved", "required time saved"))
    : question;
  const mode = cleaned.solveMode ?? "";
  const answer = cleaned.solution?.answerText ?? "";
  const finalConclusion = conclusion(mode, answer, language);
  const finalShortcut = shortcut(mode, language);
  const legacySteps = Array.isArray(cleaned.explanation?.steps) ? cleaned.explanation.steps.slice(0, 4) : [];
  const learnerExplanation = {
    method: learnerMethod(mode, language),
    solution: [...legacySteps, finalConclusion],
    answer: finalConclusion,
  };

  return {
    ...cleaned,
    learnerExplanationVersion: "TMW_COVERAGE_V1",
    learnerExplanation,
    explanation: {
      ...cleaned.explanation,
      shortcut: {
        ...(cleaned.explanation?.shortcut ?? {}),
        title: finalShortcut.title,
        steps: finalShortcut.steps,
      },
      commonTrap: {
        ...(cleaned.explanation?.commonTrap ?? {}),
        explanation: trapExplanation(cleaned, language),
      },
      conclusion: finalConclusion,
    },
    editorialStatus: "ASSISTANT_EDITORIAL_REVIEW",
  };
}
