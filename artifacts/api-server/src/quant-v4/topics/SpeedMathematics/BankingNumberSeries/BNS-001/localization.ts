import type { Bns001Language, Bns001Question } from "./types";

export function localizeBns001(question: Bns001Question, language: Bns001Language): Bns001Question {
  if (language === "en") return question;
  const hi = language === "hi";
  const series = question.proof.fullSeries;
  const target = question.taskKind === "NEXT_TERM" ? 6 : question.proof.hiddenIndex!;
  const start = target === 2 ? 3 : 0;
  const a = series[start]!, b = series[start + 1]!, c = series[start + 2]!;
  const previous = series[target - 1]!, expected = series[target]!;
  const working: string[] = [];
  let keyRule: string;
  if (question.patternKind === "INTERLEAVED_ARITHMETIC") {
    keyRule = hi ? "विषम और सम स्थानों के पदों की अलग-अलग शृंखलाएँ बनाएँ।" : "ਟਾਂਕ ਅਤੇ ਜਿਸਤ ਸਥਾਨਾਂ ਦੇ ਪਦਾਂ ਦੀਆਂ ਵੱਖ-ਵੱਖ ਲੜੀਆਂ ਬਣਾਓ।";
    const positions = question.visibleSeries.map((_n, i) => i).filter((i) => i % 2 === target % 2 && i !== target);
    const first = positions[0]!, second = positions[1]!;
    const jumps = (second - first) / 2;
    const increment = (series[second]! - series[first]!) / jumps;
    working.push(keyRule,
      `${hi ? "इस पंक्ति में प्रति चरण अंतर" : "ਇਸ ਲੜੀ ਵਿੱਚ ਹਰ ਕਦਮ ਦਾ ਅੰਤਰ"} = (${series[second]} − ${series[first]}) ÷ ${jumps} = ${increment}.`,
      `${hi ? "आवश्यक पद" : "ਲੋੜੀਂਦਾ ਪਦ"} = ${series[target - 2]} + ${increment} = ${expected}.`);
    if (target + 2 < question.visibleSeries.length) working.push(`${hi ? "अगला पद जाँचें" : "ਅਗਲਾ ਪਦ ਜਾਂਚੋ"}: ${expected} + ${increment} = ${series[target + 2]}.`);
  } else if (question.patternKind === "ARITHMETIC_DIFFERENCE" || question.patternKind === "PROGRESSIVE_DIFFERENCE") {
    const delta = b - a, rise = c - 2 * b + a;
    const offset = target - 1 - start;
    const step = delta + offset * rise;
    keyRule = rise === 0
      ? (hi ? `हर बार ${delta} जोड़ें।` : `ਹਰ ਵਾਰ ${delta} ਜੋੜੋ।`)
      : (hi ? `लगातार पदों के अंतर हर बार ${rise} बढ़ते हैं।` : `ਲਗਾਤਾਰ ਪਦਾਂ ਦੇ ਅੰਤਰ ਹਰ ਵਾਰ ${rise} ਵਧਦੇ ਹਨ।`);
    working.push(`${hi ? "दिखाई देने वाले पदों के अंतर" : "ਦਿੱਤੇ ਹੋਏ ਪਦਾਂ ਦੇ ਅੰਤਰ"}: ${b} − ${a} = ${delta}; ${c} − ${b} = ${c - b}.`);
    if (rise !== 0) working.push(`${hi ? "आवश्यक अंतर" : "ਲੋੜੀਂਦਾ ਅੰਤਰ"} = ${delta} ${offset < 0 ? "−" : "+"} ${Math.abs(offset)} × ${rise} = ${step}.`);
    working.push(`${hi ? "आवश्यक पद" : "ਲੋੜੀਂਦਾ ਪਦ"} = ${previous} + ${step} = ${expected}.`);
    if (target + 1 < question.visibleSeries.length) working.push(`${hi ? "अगला चरण जाँचें" : "ਅਗਲਾ ਕਦਮ ਜਾਂਚੋ"}: ${expected} + ${step + rise} = ${series[target + 1]}.`);
  } else {
    const multiplier = question.patternKind === "GEOMETRIC_MULTIPLICATION" ? b / a : (c - b) / (b - a);
    const addend = question.patternKind === "GEOMETRIC_MULTIPLICATION" ? 0 : b - a * multiplier;
    keyRule = addend === 0
      ? (hi ? `हर पद को ${multiplier} से गुणा करें।` : `ਹਰ ਪਦ ਨੂੰ ${multiplier} ਨਾਲ ਗੁਣਾ ਕਰੋ।`)
      : (hi ? `हर पद को ${multiplier} से गुणा करके ${Math.abs(addend)} ${addend < 0 ? "घटाएँ" : "जोड़ें"}।` : `ਹਰ ਪਦ ਨੂੰ ${multiplier} ਨਾਲ ਗੁਣਾ ਕਰਕੇ ${Math.abs(addend)} ${addend < 0 ? "ਘਟਾਓ" : "ਜੋੜੋ"}।`);
    if (addend === 0) working.push(`${hi ? "दिखाई देने वाले पदों का अनुपात" : "ਦਿੱਤੇ ਹੋਏ ਪਦਾਂ ਦਾ ਅਨੁਪਾਤ"}: ${b} ÷ ${a} = ${multiplier}; ${c} ÷ ${b} = ${multiplier}.`);
    else working.push(`${hi ? "दो अंतरों का अनुपात" : "ਦੋ ਅੰਤਰਾਂ ਦਾ ਅਨੁਪਾਤ"}: (${c} − ${b}) ÷ (${b} − ${a}) = ${multiplier}.`,
      `${hi ? "जोड़ी जाने वाली संख्या" : "ਜੋੜੀ ਜਾਣ ਵਾਲੀ ਸੰਖਿਆ"} = ${b} − ${a} × ${multiplier} = ${addend}.`);
    const op = `× ${multiplier}${addend ? ` ${addend < 0 ? "−" : "+"} ${Math.abs(addend)}` : ""}`;
    working.push(`${hi ? "आवश्यक पद" : "ਲੋੜੀਂਦਾ ਪਦ"} = ${previous} ${op} = ${expected}.`);
    if (target + 1 < question.visibleSeries.length) working.push(`${hi ? "अगला चरण जाँचें" : "ਅਗਲਾ ਕਦਮ ਜਾਂਚੋ"}: ${expected} ${op} = ${series[target + 1]}.`);
  }
  if (question.taskKind === "WRONG_TERM") working.push(hi
    ? `स्थान ${target + 1} पर ${expected} होना चाहिए। इसलिए गलत संख्या ${question.answer} है; इसे ${expected} से बदलें।`
    : `ਸਥਾਨ ${target + 1} ਉੱਤੇ ${expected} ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਇਸ ਲਈ ਗਲਤ ਸੰਖਿਆ ${question.answer} ਹੈ; ਇਸ ਦੀ ਥਾਂ ${expected} ਰੱਖੋ।`);
  const prompt = question.taskKind === "NEXT_TERM"
    ? (hi ? "शृंखला में अगली संख्या क्या होगी?" : "ਲੜੀ ਵਿੱਚ ਅਗਲੀ ਸੰਖਿਆ ਕੀ ਹੋਵੇਗੀ?")
    : question.taskKind === "MISSING_TERM"
      ? (hi ? "शृंखला में प्रश्न चिह्न की जगह कौन-सी संख्या आएगी?" : "ਲੜੀ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜੀ ਸੰਖਿਆ ਆਵੇਗੀ?")
      : (hi ? "शृंखला में कौन-सी संख्या गलत है?" : "ਲੜੀ ਵਿੱਚ ਕਿਹੜੀ ਸੰਖਿਆ ਗਲਤ ਹੈ?");
  return { ...question, language, questionId: `${question.questionId}-${language}`,
    stem: `${prompt} ${question.visibleSeries.join(", ")}${question.taskKind === "NEXT_TERM" ? ", ?" : ""}`,
    explanation: { keyRule, working,
      shortcut: hi ? "पहले लगातार पदों या एकांतर पदों का नियम पहचानें।" : "ਪਹਿਲਾਂ ਲਗਾਤਾਰ ਪਦਾਂ ਜਾਂ ਇੱਕ ਛੱਡ ਕੇ ਆਉਣ ਵਾਲੇ ਪਦਾਂ ਦਾ ਨਿਯਮ ਪਛਾਣੋ।",
      trap: question.taskKind === "WRONG_TERM"
        ? (hi ? "उत्तर में गलत दी गई संख्या चुनें, उसकी जगह आने वाली संख्या नहीं।" : "ਉੱਤਰ ਵਿੱਚ ਦਿੱਤੀ ਹੋਈ ਗਲਤ ਸੰਖਿਆ ਚੁਣੋ, ਉਸ ਦੀ ਥਾਂ ਆਉਣ ਵਾਲੀ ਸੰਖਿਆ ਨਹੀਂ।")
        : (hi ? "नियम को सभी दिए गए पदों पर जाँचें।" : "ਨਿਯਮ ਨੂੰ ਸਾਰੇ ਦਿੱਤੇ ਹੋਏ ਪਦਾਂ ਉੱਤੇ ਜਾਂਚੋ।") },
  };
}
