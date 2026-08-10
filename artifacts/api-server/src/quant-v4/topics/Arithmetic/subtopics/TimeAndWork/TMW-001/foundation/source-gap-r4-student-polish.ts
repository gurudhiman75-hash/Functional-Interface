import {
  add,
  divide,
  formatRational,
  multiply,
  rational,
  reciprocal,
  subtract,
  toLatex,
} from "./rational";
import type { Rational } from "./types";
import type { Tmw001ChapterLanguage } from "./chapter-localized-runtime";
import type { TmwR4GeneratedQuestion } from "./source-gap-r4-runtime";
import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";

const ONE = rational(1);
const TWO = rational(2);

function rp(question: TmwR4GeneratedQuestion, key: string): Rational {
  const value = question.parameters[key];
  if (!value || typeof value === "number" || typeof value === "string") {
    throw new Error(`${question.questionLanguageId}: missing rational parameter ${key}`);
  }
  return value;
}

function m(value: Rational): string {
  return `\\(${toLatex(value)}\\)`;
}

function eq(value: string): string {
  return `\\(${value}\\)`;
}

function answerSentence(question: TmwR4GeneratedQuestion): string {
  const answer = question.solution.answerText;
  if (question.language === "hi") return `अतः उत्तर: ${answer}।`;
  if (question.language === "pa") return `ਇਸ ਲਈ ਉੱਤਰ: ${answer}।`;
  return `Therefore, the answer is ${answer}.`;
}

function resultSentence(question: TmwR4GeneratedQuestion): string {
  const answer = question.solution.answerText;
  if (question.language === "hi") return `अतः आवश्यक मान: ${answer}।`;
  if (question.language === "pa") return `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮੁੱਲ: ${answer}।`;
  return `Therefore, the required value is ${answer}.`;
}

const METHODS: Record<string, Record<Tmw001ChapterLanguage, string>> = {
  "TMW-QL-212": {
    en: "Convert the efficiency comparison into B's rate, add A's and B's rates, then invert the total rate.",
    hi: "B की अधिक दक्षता को उसकी दर में बदलें, A और B की दरें जोड़ें, फिर संयुक्त दर का व्युत्क्रम लें।",
    pa: "B ਦੀ ਵੱਧ ਦੱਖਤਾ ਨੂੰ ਉਸ ਦੀ ਦਰ ਵਿੱਚ ਬਦਲੋ, A ਅਤੇ B ਦੀਆਂ ਦਰਾਂ ਜੋੜੋ, ਫਿਰ ਕੁੱਲ ਦਰ ਦਾ ਉਲਟ ਲਓ।",
  },
  "TMW-QL-213": {
    en: "First convert each fraction-of-work statement into work per day; only then add the two rates.",
    hi: "पहले प्रत्येक आंशिक काम को प्रतिदिन की दर में बदलें; उसके बाद ही दोनों दरें जोड़ें।",
    pa: "ਪਹਿਲਾਂ ਹਰ ਅਧੂਰੇ ਕੰਮ ਵਾਲੀ ਜਾਣਕਾਰੀ ਨੂੰ ਪ੍ਰਤੀ ਦਿਨ ਦਰ ਵਿੱਚ ਬਦਲੋ; ਫਿਰ ਦੋਵੇਂ ਦਰਾਂ ਜੋੜੋ।",
  },
  "TMW-QL-214": {
    en: "Find A's output rate and the A+B rate, subtract to get B's rate, then scale it to the new target output.",
    hi: "A की उत्पादन दर और A+B की संयुक्त दर निकालें, घटाकर B की दर पाएँ, फिर नए लक्ष्य उत्पादन का समय निकालें।",
    pa: "A ਦੀ ਉਤਪਾਦਨ ਦਰ ਅਤੇ A+B ਦੀ ਸਾਂਝੀ ਦਰ ਕੱਢੋ, ਘਟਾ ਕੇ B ਦੀ ਦਰ ਲੱਭੋ, ਫਿਰ ਨਵੇਂ ਟਾਰਗੇਟ ਉਤਪਾਦਨ ਦਾ ਸਮਾਂ ਕੱਢੋ।",
  },
  "TMW-QL-215": {
    en: "Express each person's active time in terms of the unknown total time and make their completed work add to 1.",
    hi: "अज्ञात कुल समय के अनुसार हर व्यक्ति की सक्रिय अवधि लिखें और तीनों का किया काम जोड़कर 1 के बराबर रखें।",
    pa: "ਅਣਜਾਣ ਕੁੱਲ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਹਰ ਵਿਅਕਤੀ ਦਾ ਕੰਮ ਕਰਨ ਵਾਲਾ ਸਮਾਂ ਲਿਖੋ ਅਤੇ ਤਿੰਨਾਂ ਦਾ ਕੰਮ ਜੋੜ ਕੇ 1 ਦੇ ਬਰਾਬਰ ਰੱਖੋ।",
  },
  "TMW-QL-216": {
    en: "Use the first combined stage to find the remaining fraction, then use B's finishing time to recover B's solo rate.",
    hi: "पहले संयुक्त चरण से शेष काम निकालें, फिर B द्वारा शेष काम पूरा करने के समय से B की अकेली दर पाएँ।",
    pa: "ਪਹਿਲੇ ਸਾਂਝੇ ਪੜਾਅ ਤੋਂ ਬਾਕੀ ਕੰਮ ਕੱਢੋ, ਫਿਰ B ਦੇ ਬਾਕੀ ਕੰਮ ਦੇ ਸਮੇਂ ਤੋਂ B ਦੀ ਇਕੱਲੀ ਦਰ ਲੱਭੋ।",
  },
  "TMW-QL-217": {
    en: "For the same job, equate original worker-days to the worker-days after adding the extra workers.",
    hi: "एक ही काम के लिए मूल कर्मचारी-दिन और अतिरिक्त कर्मचारियों वाली स्थिति के कर्मचारी-दिन बराबर रखें।",
    pa: "ਇੱਕੋ ਕੰਮ ਲਈ ਮੂਲ ਕਰਮਚਾਰੀ-ਦਿਨ ਅਤੇ ਵਾਧੂ ਕਰਮਚਾਰੀਆਂ ਵਾਲੀ ਹਾਲਤ ਦੇ ਕਰਮਚਾਰੀ-ਦਿਨ ਬਰਾਬਰ ਰੱਖੋ।",
  },
  "TMW-QL-218": {
    en: "Split the worker-day total at the unknown leaving day and equate it to the original planned worker-days.",
    hi: "अज्ञात छोड़ने वाले दिन पर कर्मचारी-दिन को दो चरणों में बाँटें और कुल को मूल योजना के कर्मचारी-दिनों के बराबर रखें।",
    pa: "ਅਣਜਾਣ ਛੱਡਣ ਵਾਲੇ ਦਿਨ ਤੇ ਕਰਮਚਾਰੀ-ਦਿਨ ਦੋ ਪੜਾਵਾਂ ਵਿੱਚ ਵੰਡੋ ਅਤੇ ਕੁੱਲ ਨੂੰ ਮੂਲ ਯੋਜਨਾ ਦੇ ਕਰਮਚਾਰੀ-ਦਿਨਾਂ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।",
  },
  "TMW-QL-219": {
    en: "Convert each mixed crew into relative work-units per day, find the work left at the crew-change point, then use the new crew rate.",
    hi: "हर मिश्रित दल को सापेक्ष कार्य-इकाई प्रति दिन में बदलें, दल बदलने तक शेष काम निकालें, फिर नए दल की दर लगाएँ।",
    pa: "ਹਰ ਮਿਲੀ-ਜੁਲੀ ਟੀਮ ਨੂੰ ਸਾਪੇਖ ਕੰਮ-ਇਕਾਈ ਪ੍ਰਤੀ ਦਿਨ ਵਿੱਚ ਬਦਲੋ, ਟੀਮ ਬਦਲਣ ਤੱਕ ਬਾਕੀ ਕੰਮ ਕੱਢੋ, ਫਿਰ ਨਵੀਂ ਟੀਮ ਦੀ ਦਰ ਵਰਤੋ।",
  },
  "TMW-QL-220": {
    en: "Because both work for the same duration, their payment ratio equals their rate ratio; use A's known solo rate to recover the joint rate.",
    hi: "दोनों ने समान अवधि काम किया है, इसलिए भुगतान अनुपात ही दर अनुपात है; A की अकेली दर से संयुक्त दर निकालें।",
    pa: "ਦੋਵੇਂ ਨੇ ਇੱਕੋ ਸਮਾਂ ਕੰਮ ਕੀਤਾ ਹੈ, ਇਸ ਲਈ ਭੁਗਤਾਨ ਅਨੁਪਾਤ ਹੀ ਦਰ ਅਨੁਪਾਤ ਹੈ; A ਦੀ ਇਕੱਲੀ ਦਰ ਤੋਂ ਸਾਂਝੀ ਦਰ ਕੱਢੋ।",
  },
  "TMW-QL-221": {
    en: "Add the three overlapping subset rates. Every pipe is counted exactly twice, so divide that sum by 2 before finding the time.",
    hi: "तीनों ओवरलैप वाली संयुक्त दरें जोड़ें। हर पाइप ठीक दो बार गिना जाता है, इसलिए योग को 2 से भाग देकर चारों की दर पाएँ।",
    pa: "ਤਿੰਨਾਂ ਓਵਰਲੈਪ ਵਾਲੀਆਂ ਸਾਂਝੀਆਂ ਦਰਾਂ ਜੋੜੋ। ਹਰ ਪਾਈਪ ਦੋ ਵਾਰ ਗਿਣਿਆ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਜੋੜ ਨੂੰ 2 ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਚਾਰਾਂ ਦੀ ਦਰ ਲੱਭੋ।",
  },
  "TMW-QL-222": {
    en: "Translate 'A has the same rate as B+C' into a rate equation, combine it with the A+B rate, and isolate B.",
    hi: "‘A की दर = B+C की दर’ को समीकरण में लिखें, A+B की दी दर के साथ मिलाकर B की दर अलग करें।",
    pa: "‘A ਦੀ ਦਰ = B+C ਦੀ ਦਰ’ ਨੂੰ ਸਮੀਕਰਨ ਵਿੱਚ ਲਿਖੋ, A+B ਦੀ ਦਿੱਤੀ ਦਰ ਨਾਲ ਮਿਲਾ ਕੇ B ਦੀ ਦਰ ਅਲੱਗ ਕਰੋ।",
  },
  "TMW-QL-223": {
    en: "Recover A's and C's individual rates from the three pairwise rates, then reverse the rate ratio to obtain the solo-time ratio.",
    hi: "तीन जोड़ी-दरों से A और C की अलग-अलग दरें निकालें, फिर अकेले समय के अनुपात के लिए दर-अनुपात को उलटें।",
    pa: "ਤਿੰਨ ਜੋੜੀ ਦਰਾਂ ਤੋਂ A ਅਤੇ C ਦੀਆਂ ਵੱਖ-ਵੱਖ ਦਰਾਂ ਕੱਢੋ, ਫਿਰ ਇਕੱਲੇ ਸਮੇਂ ਦੇ ਅਨੁਪਾਤ ਲਈ ਦਰ ਅਨੁਪਾਤ ਉਲਟੋ।",
  },
  "TMW-QL-224": {
    en: "Use the two known mixed crews to solve the per-person rates, then form the target crew's rate and invert it.",
    hi: "दो ज्ञात मिश्रित दलों से प्रति-व्यक्ति दरें निकालें, फिर लक्ष्य दल की कुल दर बनाकर उसका व्युत्क्रम लें।",
    pa: "ਦੋ ਜਾਣੀਆਂ ਮਿਲੀ-ਜੁਲੀ ਟੀਮਾਂ ਤੋਂ ਪ੍ਰਤੀ-ਵਿਅਕਤੀ ਦਰਾਂ ਕੱਢੋ, ਫਿਰ ਟਾਰਗੇਟ ਟੀਮ ਦੀ ਕੁੱਲ ਦਰ ਬਣਾਕੇ ਉਸ ਦਾ ਉਲਟ ਲਓ।",
  },
  "TMW-QL-225": {
    en: "Use the first two progress stages to recover the two category rates, then compare the final required rate with the current crew rate.",
    hi: "पहले दो प्रगति चरणों से दोनों श्रेणियों की दरें निकालें, फिर अंतिम आवश्यक दर की तुलना मौजूदा दल की दर से करें।",
    pa: "ਪਹਿਲੇ ਦੋ ਤਰੱਕੀ ਪੜਾਵਾਂ ਤੋਂ ਦੋਵੇਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀਆਂ ਦਰਾਂ ਕੱਢੋ, ਫਿਰ ਆਖਰੀ ਲੋੜੀਂਦੀ ਦਰ ਦੀ ਮੌਜੂਦਾ ਟੀਮ ਦੀ ਦਰ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",
  },
  "TMW-QL-226": {
    en: "Subtract A's and B's rates from the three-person rate to get C's rate, then convert C's contribution into C's payment share.",
    hi: "तीनों की संयुक्त दर में से A और B की दरें घटाकर C की दर निकालें, फिर C के योगदान को भुगतान हिस्से में बदलें।",
    pa: "ਤਿੰਨਾਂ ਦੀ ਸਾਂਝੀ ਦਰ ਵਿੱਚੋਂ A ਅਤੇ B ਦੀਆਂ ਦਰਾਂ ਘਟਾ ਕੇ C ਦੀ ਦਰ ਕੱਢੋ, ਫਿਰ C ਦੇ ਯੋਗਦਾਨ ਨੂੰ ਭੁਗਤਾਨ ਹਿੱਸੇ ਵਿੱਚ ਬਦਲੋ।",
  },
  "TMW-QL-227": {
    en: "Use A's first-stage work to find the remainder, recover B's rate from the handoff stage, then add A's and B's rates.",
    hi: "A के पहले चरण का काम निकालकर शेष काम पाएँ, हस्तांतरण चरण से B की दर निकालें, फिर A और B की दरें जोड़ें।",
    pa: "A ਦੇ ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਕੱਢ ਕੇ ਬਾਕੀ ਕੰਮ ਲੱਭੋ, ਹਵਾਲਗੀ ਪੜਾਅ ਤੋਂ B ਦੀ ਦਰ ਕੱਢੋ, ਫਿਰ A ਅਤੇ B ਦੀਆਂ ਦਰਾਂ ਜੋੜੋ।",
  },
  "TMW-QL-228": {
    en: "Write the shrinking daily workforce as an arithmetic sequence and equate its total worker-days to the planned worker-days.",
    hi: "हर दिन घटती कर्मचारी संख्या को समानांतर श्रेणी की तरह लिखें और उसके कुल कर्मचारी-दिन को नियोजित कर्मचारी-दिनों के बराबर रखें।",
    pa: "ਹਰ ਦਿਨ ਘਟਦੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਨੂੰ ਸਮਾਨ ਅੰਤਰ ਵਾਲੀ ਲੜੀ ਵਾਂਗ ਲਿਖੋ ਅਤੇ ਉਸ ਦੇ ਕੁੱਲ ਕਰਮਚਾਰੀ-ਦਿਨ ਯੋਜਿਤ ਕਰਮਚਾਰੀ-ਦਿਨਾਂ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।",
  },
  "TMW-QL-229": {
    en: "The half-and-half handoff gives the sum of the two solo times; the combined time gives their product. Solve the resulting quadratic and use the efficiency ordering to choose the correct root.",
    hi: "आधा-आधा काम वाली स्थिति से दोनों अकेले समयों का योग मिलता है और संयुक्त समय से उनका गुणनफल; द्विघात हल करके दक्षता क्रम से सही मूल चुनें।",
    pa: "ਅੱਧਾ-ਅੱਧਾ ਕੰਮ ਵਾਲੀ ਹਾਲਤ ਤੋਂ ਦੋਵੇਂ ਇਕੱਲੇ ਸਮਿਆਂ ਦਾ ਜੋੜ ਮਿਲਦਾ ਹੈ ਅਤੇ ਸਾਂਝੇ ਸਮੇਂ ਤੋਂ ਉਨ੍ਹਾਂ ਦਾ ਗੁਣਨਫਲ; ਦੋਘਾਤ ਹੱਲ ਕਰਕੇ ਦੱਖਤਾ ਕ੍ਰਮ ਨਾਲ ਸਹੀ ਮੂਲ ਚੁਣੋ।",
  },
};

function polishStem(question: TmwR4GeneratedQuestion): string {
  let stem = question.stem;
  if (question.language === "en") {
    stem = stem.replace(/\b1 men\b/g, "1 man").replace(/\b1 women\b/g, "1 woman");
  } else if (question.language === "hi") {
    stem = stem.replace(/1 महिलाएँ/g, "1 महिला");
  } else {
    stem = stem.replace(/1 ਔਰਤਾਂ/g, "1 ਔਰਤ");
  }

  if (question.questionLanguageId === "TMW-QL-219") {
    const ratio = divide(rp(question, "efficiencyA"), rp(question, "efficiencyB"));
    const shown = ratio.denominator === 1 ? String(ratio.numerator) : m(ratio);
    if (question.language === "en") {
      stem = stem.replace(/A man's daily efficiency is [^.]+ times a woman's\./, `A man's daily efficiency is ${shown} times a woman's.`);
    } else if (question.language === "hi") {
      stem = stem.replace(/एक पुरुष की दैनिक क्षमता एक महिला की [^।]+ गुना है।/, `एक पुरुष की दैनिक क्षमता एक महिला की ${shown} गुना है।`);
    } else {
      stem = stem.replace(/ਇੱਕ ਮਰਦ ਦੀ ਰੋਜ਼ਾਨਾ ਸਮਰੱਥਾ ਇੱਕ ਔਰਤ ਦੀ [^।]+ ਗੁਣਾ ਹੈ।/, `ਇੱਕ ਮਰਦ ਦੀ ਰੋਜ਼ਾਨਾ ਸਮਰੱਥਾ ਇੱਕ ਔਰਤ ਦੀ ${shown} ਗੁਣਾ ਹੈ।`);
    }
  }
  return stem;
}

function steps(question: TmwR4GeneratedQuestion): string[] {
  const id = question.questionLanguageId;
  const p = (key: string): Rational => rp(question, key);
  const answer = resultSentence(question);

  switch (id) {
    case "TMW-QL-212": {
      const a = reciprocal(p("soloTime"));
      const b = multiply(p("efficiencyMultiplier"), a);
      const total = add(a, b);
      return [eq(`a=${toLatex(a)},\\quad b=${toLatex(b)}`), eq(`a+b=${toLatex(total)},\\quad T=\\frac{1}{a+b}=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-213": {
      const a = divide(p("fractionA"), p("timeA"));
      const b = divide(p("fractionB"), p("timeB"));
      const total = add(a, b);
      return [eq(`a=${toLatex(a)},\\quad b=${toLatex(b)}`), eq(`a+b=${toLatex(total)},\\quad T=${toLatex(reciprocal(total))}`), answer];
    }
    case "TMW-QL-214": {
      const a = divide(p("outputA"), p("timeA"));
      const together = divide(p("combinedOutput"), p("combinedTime"));
      const b = subtract(together, a);
      return [eq(`a=${toLatex(a)},\\quad a+b=${toLatex(together)}`), eq(`b=${toLatex(b)}`), eq(`T=\\frac{${toLatex(p("targetOutput"))}}{${toLatex(b)}}=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-215": {
      return [eq(`\\frac{${toLatex(p("leaveAfterA"))}}{${toLatex(p("timeA"))}}+\\frac{T-${toLatex(p("leaveBeforeCompletionB"))}}{${toLatex(p("timeB"))}}+\\frac{T}{${toLatex(p("timeC"))}}=1`), eq(`T=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-216": {
      const done = divide(p("togetherDuration"), p("combinedTime"));
      const remaining = subtract(ONE, done);
      const b = divide(remaining, p("soloFinishDuration"));
      return [eq(`W=${toLatex(done)},\\quad W_{left}=${toLatex(remaining)}`.replace("W_{left}", "L")), eq(`b=\\frac{${toLatex(remaining)}}{${toLatex(p("soloFinishDuration"))}}=${toLatex(b)}`), eq(`T=\\frac1b=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-217": {
      const revisedDays = subtract(p("plannedDays"), p("timeSaved"));
      return [eq(`x\\times ${toLatex(p("plannedDays"))}=(x+${toLatex(p("addedWorkers"))})\\times ${toLatex(revisedDays)}`), eq(`x=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-218": {
      const remainingWorkers = subtract(p("workers"), p("workersLeave"));
      return [eq(`${toLatex(p("workers"))}\\times ${toLatex(p("plannedDays"))}=${toLatex(p("workers"))}x+${toLatex(remainingWorkers)}(${toLatex(p("finalDays"))}-x)`), eq(`x=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-219": {
      const r1 = add(multiply(p("countAInitial"), p("efficiencyA")), multiply(p("countBInitial"), p("efficiencyB")));
      const r2 = add(multiply(p("countAChanged"), p("efficiencyA")), multiply(p("countBChanged"), p("efficiencyB")));
      const totalWork = multiply(r1, p("originalCompletionDays"));
      const done = multiply(r1, p("eventDays"));
      const left = subtract(totalWork, done);
      return [eq(`R_1=${toLatex(r1)},\\quad R_2=${toLatex(r2)}`.replace("R_1", "P").replace("R_2", "Q")), eq(`W=${toLatex(totalWork)},\\quad L=${toLatex(left)}`), eq(`T=\\frac{L}{Q}=\\frac{${toLatex(left)}}{${toLatex(r2)}}=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-220": {
      const a = reciprocal(p("soloTimeA"));
      const b = multiply(a, divide(p("paymentB"), p("paymentA")));
      const total = add(a, b);
      return [eq(`a=${toLatex(a)},\\quad a:b=${toLatex(p("paymentA"))}:${toLatex(p("paymentB"))}`), eq(`b=${toLatex(b)},\\quad a+b=${toLatex(total)}`), eq(`T=\\frac1{a+b}=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-221": {
      const sum = add(add(reciprocal(p("timeABC")), reciprocal(p("timeBCD"))), reciprocal(p("timeAD")));
      const all = divide(sum, TWO);
      return [eq(`2R=\\frac1{${toLatex(p("timeABC"))}}+\\frac1{${toLatex(p("timeBCD"))}}+\\frac1{${toLatex(p("timeAD"))}}=${toLatex(sum)}`), eq(`R=${toLatex(all)},\\quad T=\\frac1R=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-222": {
      const c = reciprocal(p("soloTimeC"));
      const totalAB = reciprocal(p("combinedABTime"));
      const b = divide(subtract(totalAB, c), TWO);
      const a = add(b, c);
      return [eq(`c=${toLatex(c)},\\quad a=b+c`), eq(`a+b=${toLatex(totalAB)}\\Rightarrow 2b+c=${toLatex(totalAB)}`), eq(`b=${toLatex(b)},\\quad T_B=\\frac1b=${toLatex(question.solution.answer)}`.replace("T_B", "T")), answer];
    }
    case "TMW-QL-223": {
      const ab = reciprocal(p("timeAB"));
      const bc = reciprocal(p("timeBC"));
      const ac = reciprocal(p("timeAC"));
      const a = divide(subtract(add(ab, ac), bc), TWO);
      const c = divide(subtract(add(bc, ac), ab), TWO);
      return [eq(`a=\\frac{${toLatex(ab)}+${toLatex(ac)}-${toLatex(bc)}}2=${toLatex(a)}`), eq(`c=\\frac{${toLatex(bc)}+${toLatex(ac)}-${toLatex(ab)}}2=${toLatex(c)}`), eq(`T_A:T_C=c:a=${Math.abs(question.solution.answer.numerator)}:${question.solution.answer.denominator}`.replace("T_A", "U").replace("T_C", "V")), answer];
    }
    case "TMW-QL-224": {
      const a1 = p("crew1A"), b1 = p("crew1B"), a2 = p("crew2A"), b2 = p("crew2B");
      const s1 = reciprocal(p("time1")), s2 = reciprocal(p("time2"));
      const det = subtract(multiply(a1, b2), multiply(a2, b1));
      const man = divide(subtract(multiply(s1, b2), multiply(s2, b1)), det);
      const woman = divide(subtract(multiply(a1, s2), multiply(a2, s1)), det);
      const target = add(multiply(p("targetA"), man), multiply(p("targetB"), woman));
      return [eq(`${toLatex(a1)}m+${toLatex(b1)}w=${toLatex(s1)},\\quad ${toLatex(a2)}m+${toLatex(b2)}w=${toLatex(s2)}`), eq(`m=${toLatex(man)},\\quad w=${toLatex(woman)}`), eq(`R=${toLatex(p("targetA"))}m+${toLatex(p("targetB"))}w=${toLatex(target)},\\quad T=\\frac1R=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-225": {
      const a1 = p("initialA"), b1 = p("initialB"), a2 = add(a1, p("addedA")), b2 = add(b1, p("addedB"));
      const s1 = divide(p("fraction1"), p("phase1Days"));
      const s2 = divide(p("fraction2"), p("phase2Days"));
      const det = subtract(multiply(a1, b2), multiply(a2, b1));
      const man = divide(subtract(multiply(s1, b2), multiply(s2, b1)), det);
      const woman = divide(subtract(multiply(a1, s2), multiply(a2, s1)), det);
      const left = subtract(subtract(ONE, p("fraction1")), p("fraction2"));
      const required = divide(left, p("finalDays"));
      const current = add(multiply(a2, man), multiply(b2, woman));
      return [eq(`${toLatex(a1)}m+${toLatex(b1)}w=${toLatex(s1)},\\quad ${toLatex(a2)}m+${toLatex(b2)}w=${toLatex(s2)}`), eq(`m=${toLatex(man)},\\quad w=${toLatex(woman)}`), eq(`L=${toLatex(left)},\\quad R=${toLatex(required)},\\quad C=${toLatex(current)}`), eq(`n=\\frac{R-C}{w}=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-226": {
      const a = reciprocal(p("soloTimeA")), b = reciprocal(p("soloTimeB")), all = reciprocal(p("jointTime"));
      const c = subtract(subtract(all, a), b);
      const fraction = multiply(c, p("jointTime"));
      return [eq(`a=${toLatex(a)},\\quad b=${toLatex(b)},\\quad a+b+c=${toLatex(all)}`), eq(`c=${toLatex(c)},\\quad C\\text{-share}=${toLatex(fraction)}`.replace("C\\text{-share}", "s")), eq(`P=${toLatex(p("totalPayment"))}\\times ${toLatex(fraction)}=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-227": {
      const a = reciprocal(p("soloTimeA"));
      const done = multiply(a, p("initialSoloDays"));
      const left = subtract(ONE, done);
      const b = divide(left, p("replacementFinishDays"));
      return [eq(`a=${toLatex(a)},\\quad L=1-${toLatex(done)}=${toLatex(left)}`), eq(`b=\\frac{${toLatex(left)}}{${toLatex(p("replacementFinishDays"))}}=${toLatex(b)}`), eq(`T=\\frac1{a+b}=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-228": {
      const n = p("actualDays"), drop = p("dailyDrop"), planned = p("plannedDays");
      return [eq(`${toLatex(planned)}x=${toLatex(n)}x-${toLatex(drop)}\\times\\frac{${toLatex(n)}(${toLatex(subtract(n, ONE))})}{2}`), eq(`x=${toLatex(question.solution.answer)}`), answer];
    }
    case "TMW-QL-229": {
      const sum = multiply(TWO, p("halfHandoffTotal"));
      const product = multiply(sum, p("combinedTime"));
      const other = subtract(sum, question.solution.answer);
      return [eq(`u+v=${toLatex(sum)},\\quad uv=${toLatex(product)}`), eq(`z^2-${toLatex(sum)}z+${toLatex(product)}=0\\Rightarrow z=${toLatex(other)},${toLatex(question.solution.answer)}`), question.language === "en" ? `B is more efficient, so B has the smaller solo time; A therefore takes ${question.solution.answerText}.` : question.language === "hi" ? `B अधिक दक्ष है, इसलिए B का अकेला समय छोटा होगा; अतः A का अकेला समय ${question.solution.answerText} है।` : `B ਵੱਧ ਦੱਖ ਹੈ, ਇਸ ਲਈ B ਦਾ ਇਕੱਲਾ ਸਮਾਂ ਛੋਟਾ ਹੋਵੇਗਾ; ਇਸ ਕਰਕੇ A ਦਾ ਇਕੱਲਾ ਸਮਾਂ ${question.solution.answerText} ਹੈ।`, answer];
    }
    default:
      return question.learnerExplanation.solution;
  }
}

function unsafeNotation(value: string): boolean {
  return /_\{[^}]*[A-Za-z\u0900-\u097F\u0A00-\u0A7F][^}]*\}/u.test(value)
    || /_[A-Za-z\u0900-\u097F\u0A00-\u0A7F]+/u.test(value)
    || /\\text\{/u.test(value);
}

export function polishTmwR4StudentPackage(question: TmwR4GeneratedQuestion): TmwR4GeneratedQuestion {
  const learnerExplanation: TmwLearnerExplanationV2 = {
    method: METHODS[question.questionLanguageId]?.[question.language] ?? question.learnerExplanation.method,
    solution: steps(question),
    answer: answerSentence(question),
  };
  const errors = validateTmwLearnerExplanationV2(learnerExplanation);
  const visible = [learnerExplanation.method, ...learnerExplanation.solution, learnerExplanation.answer].join(" ");
  if (unsafeNotation(visible)) errors.push("R4 polished learner output contains unsafe word/localized subscript or text-math notation");
  if (learnerExplanation.solution.some((step) => step.length > 320)) errors.push("R4 polished learner step is too long");
  if (question.language === "hi" && !/[\u0900-\u097F]/.test(visible)) errors.push("R4 polished Hindi learner output lacks Devanagari");
  if (question.language === "pa" && !/[\u0A00-\u0A7F]/.test(visible)) errors.push("R4 polished Punjabi learner output lacks Gurmukhi");

  return {
    ...question,
    stem: polishStem(question),
    learnerExplanation,
    validation: {
      valid: errors.length === 0,
      errors,
    },
  };
}
