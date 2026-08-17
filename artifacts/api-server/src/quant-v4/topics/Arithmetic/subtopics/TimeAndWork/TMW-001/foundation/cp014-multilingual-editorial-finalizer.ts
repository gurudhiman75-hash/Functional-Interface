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

function polishLocalizedSurface(question: AnyQuestion, language: Exclude<TmwLanguage, "en">): AnyQuestion {
  return deepMapStrings(question, (value) => {
    let text = value;
    if (language === "hi") {
      text = text
        .replace(
          /एक inlet अकेला टंकी को (\d+) घंटे में भरता है और outlet अकेला उसे (\d+) घंटे में खाली करता है।/gu,
          "भराव पाइप से टंकी $1 घंटे में भर जाती है और निकासी पाइप से $2 घंटे में खाली हो जाती है।",
        )
        .replace(/\binlet\b/giu, "भराव पाइप")
        .replace(/\boutlet\b/giu, "निकासी पाइप")
        .replace(/\bnet\b/giu, "शुद्ध")
        .replace(/(\d+) h\b/gu, "$1 घंटे")
        .replace(/दल योगदान रिकॉर्ड/gu, "दल का योगदान विवरण")
        .replace(/परियोजना केसलेट/gu, "परियोजना संबंधी जानकारी")
        .replace(/कुशल योगदान =/gu, "कुशल कामगारों का योगदान =")
        .replace(/सहायक योगदान =/gu, "सहायकों का योगदान =")
        .replace(/इकाइयाँ\/दिन/gu, "इकाइयाँ प्रति दिन");
    } else {
      text = text
        .replace(
          /ਇੱਕ inlet ਇਕੱਲਾ ਟੈਂਕ ਨੂੰ (\d+) ਘੰਟਿਆਂ ਵਿੱਚ ਭਰਦਾ ਹੈ ਅਤੇ outlet ਇਕੱਲਾ ਇਸ ਨੂੰ (\d+) ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਕਰਦਾ ਹੈ।/gu,
          "ਭਰਾਵ ਪਾਈਪ ਨਾਲ ਟੈਂਕ $1 ਘੰਟਿਆਂ ਵਿੱਚ ਭਰ ਜਾਂਦਾ ਹੈ ਅਤੇ ਨਿਕਾਸੀ ਪਾਈਪ ਨਾਲ $2 ਘੰਟਿਆਂ ਵਿੱਚ ਖਾਲੀ ਹੋ ਜਾਂਦਾ ਹੈ।",
        )
        .replace(/\binlet\b/giu, "ਭਰਾਵ ਪਾਈਪ")
        .replace(/\boutlet\b/giu, "ਨਿਕਾਸੀ ਪਾਈਪ")
        .replace(/\bnet\b/giu, "ਸ਼ੁੱਧ")
        .replace(/(\d+) h\b/gu, "$1 ਘੰਟੇ")
        .replace(/ਪੜਾਅਾਂ/gu, "ਪੜਾਵਾਂ")
        .replace(/ਅਵਧੀ/gu, "ਅੰਤਰਾਲ")
        .replace(/ਰਿਣਾਤਮਕ/gu, "ਨਕਾਰਾਤਮਕ")
        .replace(/ਟੀਮ ਯੋਗਦਾਨ ਰਿਕਾਰਡ/gu, "ਟੀਮ ਦੇ ਯੋਗਦਾਨ ਦਾ ਵੇਰਵਾ")
        .replace(/ਪ੍ਰੋਜੈਕਟ ਕੇਸਲੈਟ/gu, "ਪ੍ਰੋਜੈਕਟ ਸੰਬੰਧੀ ਜਾਣਕਾਰੀ")
        .replace(/ਕੁਸ਼ਲ ਯੋਗਦਾਨ =/gu, "ਕੁਸ਼ਲ ਮਜ਼ਦੂਰਾਂ ਦਾ ਯੋਗਦਾਨ =")
        .replace(/ਸਹਾਇਕ ਯੋਗਦਾਨ =/gu, "ਸਹਾਇਕਾਂ ਦਾ ਯੋਗਦਾਨ =")
        .replace(/ਇਕਾਈਆਂ\/ਦਿਨ/gu, "ਇਕਾਈਆਂ ਪ੍ਰਤੀ ਦਿਨ")
        .replace(/ਦਰਾਂ ਤੇ/gu, "ਦਰਾਂ 'ਤੇ");
    }
    return text;
  });
}

function polishPipeMath(question: AnyQuestion): AnyQuestion {
  if (!question.explanation || !Array.isArray(question.explanation.steps)) return question;
  const fix = (line: string): string => line.replace(/(\d+)\/(\d+)/gu, "\\frac{$1}{$2}");
  return {
    ...question,
    explanation: {
      ...question.explanation,
      steps: question.explanation.steps.map((line: string) => fix(line)),
    },
  };
}

function learnerMethod(mode: string, language: TmwLanguage): string {
  switch (mode) {
    case "tableWorkforceSchedule":
      return tr(
        language,
        "Read each stage separately, convert it to worker-days (workers × days), add the two stage contributions, then divide the total worker-days by the size of the fresh crew.",
        "हर चरण को अलग पढ़ें, उसे कामगार-दिन (कामगार × दिन) में बदलें, दोनों चरणों का काम जोड़ें और फिर कुल कामगार-दिन को नई टीम के कामगारों की संख्या से भाग दें।",
        "ਹਰ ਪੜਾਅ ਨੂੰ ਵੱਖ ਪੜ੍ਹੋ, ਉਸ ਨੂੰ ਮਜ਼ਦੂਰ-ਦਿਨ (ਮਜ਼ਦੂਰ × ਦਿਨ) ਵਿੱਚ ਬਦਲੋ, ਦੋਵੇਂ ਪੜਾਵਾਂ ਦਾ ਕੰਮ ਜੋੜੋ ਅਤੇ ਫਿਰ ਕੁੱਲ ਮਜ਼ਦੂਰ-ਦਿਨਾਂ ਨੂੰ ਨਵੀਂ ਟੀਮ ਦੇ ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
      );
    case "tableHeterogeneousContribution":
      return tr(
        language,
        "Use the helper's one-day output as the base unit. For each worker type calculate count × relative efficiency × days worked, then add the contributions.",
        "एक सहायक के एक दिन के उत्पादन को आधार इकाई मानें। हर कामगार प्रकार के लिए संख्या × सापेक्ष दक्षता × काम के दिन निकालें और दोनों योगदान जोड़ें।",
        "ਇੱਕ ਸਹਾਇਕ ਦੇ ਇੱਕ ਦਿਨ ਦੇ ਉਤਪਾਦਨ ਨੂੰ ਆਧਾਰ ਇਕਾਈ ਮੰਨੋ। ਹਰ ਮਜ਼ਦੂਰ ਕਿਸਮ ਲਈ ਗਿਣਤੀ × ਸਾਪੇਖ ਕੁਸ਼ਲਤਾ × ਕੰਮ ਦੇ ਦਿਨ ਕੱਢੋ ਅਤੇ ਦੋਵੇਂ ਯੋਗਦਾਨ ਜੋੜੋ।",
      );
    case "tablePipeOperatingSchedule":
      return tr(
        language,
        "Convert the filling and emptying times to per-hour tank rates. Apply the active-pipe rate separately in each interval; when both pipes are open, subtract the outlet rate from the inlet rate, then add the filled fractions from the intervals.",
        "भराव और निकासी पाइप के दिए समय से उनकी प्रति घंटे की दर निकालें। हर अंतराल में केवल चालू पाइपों की दर लें; दोनों खुले हों तो निकासी पाइप की दर को भराव पाइप की दर से घटाएँ, फिर सभी अंतरालों में भरे भाग जोड़ें।",
        "ਭਰਾਵ ਅਤੇ ਨਿਕਾਸੀ ਪਾਈਪ ਦੇ ਦਿੱਤੇ ਸਮਿਆਂ ਤੋਂ ਉਹਨਾਂ ਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ ਕੱਢੋ। ਹਰ ਅੰਤਰਾਲ ਵਿੱਚ ਸਿਰਫ਼ ਚਾਲੂ ਪਾਈਪਾਂ ਦੀ ਦਰ ਲਓ; ਦੋਵੇਂ ਖੁੱਲ੍ਹੇ ਹੋਣ ਤਾਂ ਨਿਕਾਸੀ ਪਾਈਪ ਦੀ ਦਰ ਨੂੰ ਭਰਾਵ ਪਾਈਪ ਦੀ ਦਰ ਵਿੱਚੋਂ ਘਟਾਓ, ਫਿਰ ਸਾਰੇ ਅੰਤਰਾਲਾਂ ਵਿੱਚ ਭਰੇ ਹਿੱਸੇ ਜੋੜੋ।",
      );
    case "caseletStageOneOutput":
      return tr(
        language,
        "Use only Team A's stated rate during the first stage because Team B has not joined yet. Multiply Team A's daily output by the number of first-stage days.",
        "पहले चरण में केवल टीम A की दी हुई दर लें, क्योंकि टीम B अभी जुड़ी नहीं है। टीम A का प्रतिदिन उत्पादन पहले चरण के दिनों से गुणा करें।",
        "ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਸਿਰਫ਼ ਟੀਮ A ਦੀ ਦਿੱਤੀ ਦਰ ਲਓ, ਕਿਉਂਕਿ ਟੀਮ B ਹਾਲੇ ਸ਼ਾਮਲ ਨਹੀਂ ਹੋਈ। ਟੀਮ A ਦਾ ਪ੍ਰਤੀ ਦਿਨ ਉਤਪਾਦਨ ਪਹਿਲੇ ਪੜਾਅ ਦੇ ਦਿਨਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
      );
    default:
      return tr(
        language,
        "First calculate Team A's output during the A-only stage and subtract it from the total project. From the next day both teams work, so divide the remaining work by the combined rate A + B.",
        "पहले केवल टीम A वाले चरण में हुआ काम निकालकर कुल परियोजना से घटाएँ। अगले दिन से दोनों टीमें साथ काम करती हैं, इसलिए शेष काम को A+B की संयुक्त दर से भाग दें।",
        "ਪਹਿਲਾਂ ਸਿਰਫ਼ ਟੀਮ A ਵਾਲੇ ਪੜਾਅ ਵਿੱਚ ਹੋਇਆ ਕੰਮ ਕੱਢ ਕੇ ਕੁੱਲ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚੋਂ ਘਟਾਓ। ਅਗਲੇ ਦਿਨ ਤੋਂ ਦੋਵੇਂ ਟੀਮਾਂ ਇਕੱਠੇ ਕੰਮ ਕਰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਬਾਕੀ ਕੰਮ ਨੂੰ A+B ਦੀ ਸਾਂਝੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।",
      );
  }
}

function conclusion(mode: string, answer: string, language: TmwLanguage): string {
  switch (mode) {
    case "tableWorkforceSchedule": {
      const localizedAnswer = language === "pa" ? answer.replace(/ ਦਿਨ$/u, " ਦਿਨਾਂ") : answer;
      return tr(language, `Therefore, the fresh crew completes the same total work in ${answer}.`, `अतः नई टीम उसी कुल काम को ${answer} में पूरा करेगी।`, `ਇਸ ਲਈ ਨਵੀਂ ਟੀਮ ਉਹੀ ਕੁੱਲ ਕੰਮ ${localizedAnswer} ਵਿੱਚ ਪੂਰਾ ਕਰੇਗੀ।`);
    }
    case "tableHeterogeneousContribution":
      return tr(language, `Therefore, the crew's total contribution is ${answer}.`, `अतः कुल योगदान = ${answer}।`, `ਇਸ ਲਈ ਕੁੱਲ ਯੋਗਦਾਨ = ${answer}।`);
    case "tablePipeOperatingSchedule":
      return tr(language, `Therefore, the fraction of the tank filled at the end of the schedule is ${answer}.`, `अतः समय-सारणी के अंत में टंकी का भरा हुआ भाग ${answer} है।`, `ਇਸ ਲਈ ਸਮਾਂ-ਸਾਰਣੀ ਦੇ ਅੰਤ ਵਿੱਚ ਟੈਂਕ ਦਾ ਭਰਿਆ ਹੋਇਆ ਹਿੱਸਾ ${answer} ਹੈ।`);
    case "caseletStageOneOutput":
      return tr(language, `Therefore, the work completed by the end of the first stage is ${answer}.`, `अतः पहले चरण के अंत तक पूरा हुआ काम ${answer} है।`, `ਇਸ ਲਈ ਪਹਿਲੇ ਪੜਾਅ ਦੇ ਅੰਤ ਤੱਕ ਪੂਰਾ ਹੋਇਆ ਕੰਮ ${answer} ਹੈ।`);
    default:
      return tr(language, `Therefore, after the first stage the project needs ${answer} more to finish.`, `अतः पहले चरण के बाद परियोजना पूरी होने में ${answer} और लगेंगे।`, `ਇਸ ਲਈ ਪਹਿਲੇ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ਪ੍ਰੋਜੈਕਟ ਪੂਰਾ ਹੋਣ ਵਿੱਚ ${answer} ਹੋਰ ਲੱਗਣਗੇ।`);
  }
}

function shortcut(mode: string, language: TmwLanguage): { title: string; steps: string[] } {
  switch (mode) {
    case "tableWorkforceSchedule":
      return {
        title: tr(language, "Quick Worker-Day Method", "त्वरित कामगार-दिन विधि", "ਤੇਜ਼ ਮਜ਼ਦੂਰ-ਦਿਨ ਵਿਧੀ"),
        steps: [
          tr(language, "For each row, compute workers × days; these are directly addable because worker efficiency is equal.", "हर पंक्ति के लिए कामगार × दिन निकालें; समान दक्षता होने से इन कामगार-दिनों को सीधे जोड़ा जा सकता है।", "ਹਰ ਕਤਾਰ ਲਈ ਮਜ਼ਦੂਰ × ਦਿਨ ਕੱਢੋ; ਇੱਕੋ ਕੁਸ਼ਲਤਾ ਹੋਣ ਕਰਕੇ ਇਹ ਮਜ਼ਦੂਰ-ਦਿਨ ਸਿੱਧੇ ਜੋੜੇ ਜਾ ਸਕਦੇ ਹਨ।"),
          tr(language, "Add the row totals and divide by the new number of workers.", "पंक्तियों के काम जोड़कर नई टीम के कामगारों की संख्या से भाग दें।", "ਕਤਾਰਾਂ ਦੇ ਕੰਮ ਜੋੜ ਕੇ ਨਵੀਂ ਟੀਮ ਦੇ ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।"),
        ],
      };
    case "tableHeterogeneousContribution":
      return {
        title: tr(language, "Quick Contribution-Unit Method", "त्वरित योगदान-इकाई विधि", "ਤੇਜ਼ ਯੋਗਦਾਨ-ਇਕਾਈ ਵਿਧੀ"),
        steps: [
          tr(language, "For every row compute count × relative efficiency × days.", "हर पंक्ति में संख्या × सापेक्ष दक्षता × दिन निकालें।", "ਹਰ ਕਤਾਰ ਵਿੱਚ ਗਿਣਤੀ × ਸਾਪੇਖ ਕੁਸ਼ਲਤਾ × ਦਿਨ ਕੱਢੋ।"),
          tr(language, "Because all rows use the same helper-day base unit, add their contributions directly.", "सभी पंक्तियाँ एक ही सहायक-दिन आधार इकाई में हैं, इसलिए उनके योगदान सीधे जोड़ें।", "ਸਾਰੀਆਂ ਕਤਾਰਾਂ ਇੱਕੋ ਸਹਾਇਕ-ਦਿਨ ਆਧਾਰ ਇਕਾਈ ਵਿੱਚ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਯੋਗਦਾਨ ਸਿੱਧੇ ਜੋੜੋ।"),
        ],
      };
    case "tablePipeOperatingSchedule":
      return {
        title: tr(language, "Quick Interval-Rate Method", "त्वरित अंतराल-दर विधि", "ਤੇਜ਼ ਅੰਤਰਾਲ-ਦਰ ਵਿਧੀ"),
        steps: [
          tr(language, "Write inlet rate as positive and outlet rate as negative; use only the pipes active in that interval.", "भराव पाइप की दर धनात्मक और निकासी पाइप की दर ऋणात्मक लें; हर अंतराल में केवल चालू पाइपों की दर लें।", "ਭਰਾਵ ਪਾਈਪ ਦੀ ਦਰ ਧਨਾਤਮਕ ਅਤੇ ਨਿਕਾਸੀ ਪਾਈਪ ਦੀ ਦਰ ਨਕਾਰਾਤਮਕ ਲਓ; ਹਰ ਅੰਤਰਾਲ ਵਿੱਚ ਸਿਰਫ਼ ਚਾਲੂ ਪਾਈਪਾਂ ਦੀ ਦਰ ਲਓ।"),
          tr(language, "Multiply each interval's net rate by its duration and add the resulting tank fractions.", "हर अंतराल की शुद्ध दर को उसके समय से गुणा करें और प्राप्त टंकी-भागों को जोड़ें।", "ਹਰ ਅੰਤਰਾਲ ਦੀ ਸ਼ੁੱਧ ਦਰ ਨੂੰ ਉਸ ਦੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰੋ ਅਤੇ ਮਿਲੇ ਟੈਂਕ-ਹਿੱਸਿਆਂ ਨੂੰ ਜੋੜੋ।"),
        ],
      };
    case "caseletStageOneOutput":
      return {
        title: tr(language, "Quick First-Stage Method", "त्वरित प्रथम-चरण विधि", "ਤੇਜ਼ ਪਹਿਲਾ-ਪੜਾਅ ਵਿਧੀ"),
        steps: [
          tr(language, "Underline who is actually working before the change point: only Team A.", "बदलाव के बिंदु से पहले कौन काम कर रहा है, यह चिन्हित करें: केवल टीम A।", "ਬਦਲਾਅ ਦੇ ਬਿੰਦੂ ਤੋਂ ਪਹਿਲਾਂ ਕੌਣ ਕੰਮ ਕਰ ਰਿਹਾ ਹੈ, ਇਹ ਨਿਸ਼ਾਨ ਲਗਾਓ: ਸਿਰਫ਼ ਟੀਮ A।"),
          tr(language, "Stage-one output = Team A's daily rate × first-stage days; do not use Team B's rate yet.", "पहले चरण का काम = टीम A की दैनिक दर × पहले चरण के दिन; अभी टीम B की दर न लें।", "ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ = ਟੀਮ A ਦੀ ਰੋਜ਼ਾਨਾ ਦਰ × ਪਹਿਲੇ ਪੜਾਅ ਦੇ ਦਿਨ; ਹਾਲੇ ਟੀਮ B ਦੀ ਦਰ ਨਾ ਲਓ।"),
        ],
      };
    default:
      return {
        title: tr(language, "Quick Remaining-Work Method", "त्वरित शेष-काम विधि", "ਤੇਜ਼ ਬਾਕੀ-ਕੰਮ ਵਿਧੀ"),
        steps: [
          tr(language, "Subtract Team A's first-stage output from the total project to get the remaining work.", "कुल परियोजना में से टीम A के पहले चरण का काम घटाकर शेष काम निकालें।", "ਕੁੱਲ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚੋਂ ਟੀਮ A ਦੇ ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਘਟਾ ਕੇ ਬਾਕੀ ਕੰਮ ਕੱਢੋ।"),
          tr(language, "After the change point both teams work, so additional time = remaining work ÷ (rate A + rate B).", "बदलाव के बाद दोनों टीमें काम करती हैं, इसलिए अतिरिक्त समय = शेष काम ÷ (A की दर + B की दर)।", "ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਦੋਵੇਂ ਟੀਮਾਂ ਕੰਮ ਕਰਦੀਆਂ ਹਨ, ਇਸ ਲਈ ਵਾਧੂ ਸਮਾਂ = ਬਾਕੀ ਕੰਮ ÷ (A ਦੀ ਦਰ + B ਦੀ ਦਰ)।"),
        ],
      };
  }
}

function trapExplanation(question: AnyQuestion, mode: string, language: TmwLanguage): string {
  const option = question.explanation?.commonTrap?.optionText ?? tr(language, "that option", "उस विकल्प", "ਉਸ ਵਿਕਲਪ");
  switch (mode) {
    case "tableWorkforceSchedule":
      return tr(language, `Choosing ${option} comes from treating a row's worker count or days as work by itself. Each row contributes workers × days before the row totals are added.`, `${option} चुनना किसी पंक्ति में केवल कामगारों की संख्या या केवल दिनों को काम मानने से मिलता है। पहले हर पंक्ति में कामगार × दिन निकालकर फिर दोनों चरण जोड़ने होते हैं।`, `${option} ਚੁਣਨਾ ਕਿਸੇ ਕਤਾਰ ਵਿੱਚ ਸਿਰਫ਼ ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ ਜਾਂ ਸਿਰਫ਼ ਦਿਨਾਂ ਨੂੰ ਕੰਮ ਮੰਨਣ ਨਾਲ ਮਿਲਦਾ ਹੈ। ਪਹਿਲਾਂ ਹਰ ਕਤਾਰ ਵਿੱਚ ਮਜ਼ਦੂਰ × ਦਿਨ ਕੱਢ ਕੇ ਫਿਰ ਦੋਵੇਂ ਪੜਾਅ ਜੋੜਣੇ ਹਨ।`);
    case "tableHeterogeneousContribution":
      return tr(language, `Choosing ${option} ignores at least one of count, relative efficiency or days worked. Every row's contribution is count × efficiency × days in the same base unit.`, `${option} चुनना संख्या, सापेक्ष दक्षता या काम के दिनों में से किसी एक को छोड़ने की गलती से मिलता है। हर पंक्ति का योगदान संख्या × दक्षता × दिन है।`, `${option} ਚੁਣਨਾ ਗਿਣਤੀ, ਸਾਪੇਖ ਕੁਸ਼ਲਤਾ ਜਾਂ ਕੰਮ ਦੇ ਦਿਨਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਨੂੰ ਛੱਡਣ ਦੀ ਗਲਤੀ ਨਾਲ ਮਿਲਦਾ ਹੈ। ਹਰ ਕਤਾਰ ਦਾ ਯੋਗਦਾਨ ਗਿਣਤੀ × ਕੁਸ਼ਲਤਾ × ਦਿਨ ਹੈ।`);
    case "tablePipeOperatingSchedule":
      return tr(language, `Choosing ${option} comes from mishandling the pipe direction or schedule. The outlet removes water, so its rate is subtracted only during the interval in which it is open.`, `${option} चुनना पाइप की दिशा या समय-सारणी को गलत पढ़ने से मिलता है। निकासी पाइप पानी निकालता है, इसलिए उसकी दर केवल उसी अंतराल में घटाई जाती है जिसमें वह चालू है।`, `${option} ਚੁਣਨਾ ਪਾਈਪ ਦੀ ਦਿਸ਼ਾ ਜਾਂ ਸਮਾਂ-ਸਾਰਣੀ ਨੂੰ ਗਲਤ ਪੜ੍ਹਨ ਨਾਲ ਮਿਲਦਾ ਹੈ। ਨਿਕਾਸੀ ਪਾਈਪ ਪਾਣੀ ਕੱਢਦਾ ਹੈ, ਇਸ ਲਈ ਉਸ ਦੀ ਦਰ ਸਿਰਫ਼ ਉਸੇ ਅੰਤਰਾਲ ਵਿੱਚ ਘਟਾਈ ਜਾਂਦੀ ਹੈ ਜਿਸ ਵਿੱਚ ਉਹ ਚਾਲੂ ਹੈ।`);
    case "caseletStageOneOutput":
      return tr(language, `Choosing ${option} uses Team B before it joins. During the first stage only Team A works, so only A's rate belongs in the calculation.`, `${option} चुनना टीम B को उसके जुड़ने से पहले ही काम में शामिल कर देता है। पहले चरण में केवल टीम A काम करती है, इसलिए केवल A की दर लें।`, `${option} ਚੁਣਨਾ ਟੀਮ B ਨੂੰ ਉਸ ਦੇ ਸ਼ਾਮਲ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਕੰਮ ਵਿੱਚ ਜੋੜ ਦਿੰਦਾ ਹੈ। ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਸਿਰਫ਼ ਟੀਮ A ਕੰਮ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਸਿਰਫ਼ A ਦੀ ਦਰ ਲਓ।`);
    default:
      return tr(language, `Choosing ${option} skips the stage change. First remove Team A's first-stage output from the project; only the remainder is completed at the combined A+B rate.`, `${option} चुनना चरण-परिवर्तन को नज़रअंदाज़ करता है। पहले टीम A के प्रारंभिक काम को कुल परियोजना से घटाएँ; केवल शेष काम A+B की संयुक्त दर से होता है।`, `${option} ਚੁਣਨਾ ਪੜਾਅ-ਬਦਲਾਅ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ। ਪਹਿਲਾਂ ਟੀਮ A ਦੇ ਸ਼ੁਰੂਆਤੀ ਕੰਮ ਨੂੰ ਕੁੱਲ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚੋਂ ਘਟਾਓ; ਸਿਰਫ਼ ਬਾਕੀ ਕੰਮ A+B ਦੀ ਸਾਂਝੀ ਦਰ ਨਾਲ ਹੁੰਦਾ ਹੈ।`);
  }
}

export function finalizeTmwCp014MultilingualEditorialReview(
  question: AnyQuestion,
  qlId: string,
  language: TmwLanguage,
): AnyQuestion {
  if (question?.canonicalProblemId !== "TMW-CP-014") return question;
  const mode = question.solveMode ?? "";
  let cleaned = question;
  if (language !== "en") cleaned = polishLocalizedSurface(cleaned, language);
  if (qlId === "TMW-QL-226") cleaned = polishPipeMath(cleaned);

  const answer = cleaned.solution?.answerText ?? "";
  const finalConclusion = conclusion(mode, answer, language);
  const finalShortcut = shortcut(mode, language);
  const legacySteps = Array.isArray(cleaned.explanation?.steps) ? cleaned.explanation.steps.slice(0, 5) : [];
  const learnerExplanation = {
    method: learnerMethod(mode, language),
    solution: [...legacySteps, finalConclusion],
    answer: finalConclusion,
  };

  return {
    ...cleaned,
    learnerExplanationVersion: "TMW_PRESENTATION_V1",
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
        explanation: trapExplanation(cleaned, mode, language),
      },
      conclusion: finalConclusion,
    },
    editorialStatus: "ASSISTANT_EDITORIAL_REVIEW",
    publiclyPublishable: false,
  };
}
