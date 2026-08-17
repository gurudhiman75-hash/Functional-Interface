import type { SapTranslationLanguage } from "./types";

const MATH = /\\\([\s\S]*?\\\)/gu;
const LATIN_WORD = /[A-Za-z]{3,}/u;

function H(language: SapTranslationLanguage, hi: string, pa: string) {
  return language === "hi" ? hi : pa;
}

function tidy(value: string) {
  return value
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+([,.;:?!।])/gu, "$1")
    .replace(/([([{])\s+/gu, "$1")
    .replace(/\s+([)\]}])/gu, "$1")
    .replace(/\s+\?/gu, "?")
    .trim();
}

function mapOutsideMath(value: string, transform: (segment: string) => string) {
  const parts: string[] = [];
  let cursor = 0;
  for (const match of value.matchAll(MATH)) {
    const index = match.index ?? 0;
    parts.push(transform(value.slice(cursor, index)));
    parts.push(match[0]);
    cursor = index + match[0].length;
  }
  parts.push(transform(value.slice(cursor)));
  return parts.join("");
}

function stepLines(body: string, language: SapTranslationLanguage) {
  return body.split("\n").map((line) => line
    .replace(/^Step\s+(\d+)\s*:/u, (_m, n) => H(language, `चरण ${n}:`, `ਕਦਮ ${n}:`))
    .replace(/reduce the preceding fraction\.?/giu, H(language, "पिछली भिन्न को सरल कीजिए।", "ਪਿਛਲੀ ਭਿੰਨ ਨੂੰ ਸਰਲ ਕਰੋ।"))
    .replace(/The value is/giu, H(language, "मान है", "ਮੁੱਲ ਹੈ"))
  ).join("\n");
}

function naturalStem(base: any, current: string, language: SapTranslationLanguage) {
  const english = String(base.stem ?? "").trim();
  const qlId = String(base.questionLanguageId ?? "");

  let match = /^Without changing the grouping, compare (.+) and (.+)\.$/su.exec(english);
  if (match) return H(language,
    `समूहबद्धता बदले बिना ${match[1]} और ${match[2]} की तुलना कीजिए।`,
    `ਸਮੂਹਬੰਦੀ ਬਦਲੇ ਬਿਨਾਂ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`,
  );

  match = /^Which of the following is a valid first step in simplifying (.+)\?$/su.exec(english);
  if (match) return H(language,
    `${match[1]} को सरल करने के लिए सही पहला कदम कौन-सा है?`,
    `${match[1]} ਨੂੰ ਸਰਲ ਕਰਨ ਲਈ ਸਹੀ ਪਹਿਲਾ ਕਦਮ ਕਿਹੜਾ ਹੈ?`,
  );

  match = /^The following steps were used for (.+):\n([\s\S]+)\nIdentify the earliest incorrect step\.$/u.exec(english);
  if (match) return H(language,
    `${match[1]} को हल करने के लिए ये चरण लिखे गए हैं:\n${stepLines(match[2], language)}\nसबसे पहला गलत चरण कौन-सा है?`,
    `${match[1]} ਨੂੰ ਹੱਲ ਕਰਨ ਲਈ ਇਹ ਕਦਮ ਲਿਖੇ ਗਏ ਹਨ:\n${stepLines(match[2], language)}\nਸਭ ਤੋਂ ਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ?`,
  );

  match = /^After replacing (.+) by (.+) in (.+), what value is obtained\?$/su.exec(english);
  if (match) return H(language,
    `${match[3]} में ${match[1]} के स्थान पर ${match[2]} रखने पर अंतिम मान क्या होगा?`,
    `${match[3]} ਵਿੱਚ ${match[1]} ਦੀ ਥਾਂ ${match[2]} ਰੱਖਣ ਤੇ ਅੰਤਿਮ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?`,
  );

  match = /^A = (.+); B = (.+)\. Choose the correct relation between A and B\.$/su.exec(english);
  if (match) return H(language,
    `A = ${match[1]} तथा B = ${match[2]}। A और B के बीच सही संबंध चुनिए।`,
    `A = ${match[1]} ਅਤੇ B = ${match[2]}। A ਅਤੇ B ਵਿਚਕਾਰ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।`,
  );

  match = /^Which is the first step that changes the value of the expression\?\n([\s\S]+)$/u.exec(english);
  if (match) return H(language,
    `इस हल में पहली बार व्यंजक का मान किस चरण पर बदलता है?\n${stepLines(match[1], language)}`,
    `ਇਸ ਹੱਲ ਵਿੱਚ ਪਹਿਲੀ ਵਾਰ ਵਿਆੰਜਕ ਦਾ ਮੁੱਲ ਕਿਹੜੇ ਕਦਮ ਤੇ ਬਦਲਦਾ ਹੈ?\n${stepLines(match[1], language)}`,
  );

  match = /^Find the value of □:\s*(.+)$/su.exec(english);
  if (match) return H(language, `□ का मान ज्ञात कीजिए: ${match[1]}`, `□ ਦਾ ਮੁੱਲ ਕੱਢੋ: ${match[1]}`);

  match = /^Find the percentage represented by □:\s*(.+)$/su.exec(english);
  if (match) return H(language, `□ द्वारा दर्शाया गया प्रतिशत ज्ञात कीजिए: ${match[1]}`, `□ ਦੁਆਰਾ ਦਰਸਾਇਆ ਪ੍ਰਤੀਸ਼ਤ ਕੱਢੋ: ${match[1]}`);

  match = /^A student records the following working for (.+)\.\n([\s\S]+)\nWhich is the first incorrect step\?$/u.exec(english);
  if (match) return H(language,
    `एक विद्यार्थी ${match[1]} के लिए यह गणना लिखता है:\n${stepLines(match[2], language)}\nपहला गलत चरण कौन-सा है?`,
    `ਇੱਕ ਵਿਦਿਆਰਥੀ ${match[1]} ਲਈ ਇਹ ਗਣਨਾ ਲਿਖਦਾ ਹੈ:\n${stepLines(match[2], language)}\nਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ?`,
  );

  match = /^A student evaluates (.+):\s*\n([\s\S]+)\nWhich is the first incorrect step\?$/u.exec(english);
  if (match) return H(language,
    `एक विद्यार्थी ${match[1]} का मान इस प्रकार निकालता है:\n${stepLines(match[2], language)}\nपहला गलत चरण कौन-सा है?`,
    `ਇੱਕ ਵਿਦਿਆਰਥੀ ${match[1]} ਦਾ ਮੁੱਲ ਇਸ ਤਰ੍ਹਾਂ ਕੱਢਦਾ ਹੈ:\n${stepLines(match[2], language)}\nਪਹਿਲਾ ਗਲਤ ਕਦਮ ਕਿਹੜਾ ਹੈ?`,
  );

  match = /^Choose the correct comparison between (.+) and (.+)\.$/su.exec(english);
  if (match) return H(language,
    `${match[1]} और ${match[2]} के बीच सही तुलना चुनिए।`,
    `${match[1]} ਅਤੇ ${match[2]} ਵਿਚਕਾਰ ਸਹੀ ਤੁਲਨਾ ਚੁਣੋ।`,
  );

  match = /^For integer x from (\d+) to (\d+), E = (.+)\. Can x be determined uniquely\? Statement I: (.+)\. Statement II: (.+)\.$/su.exec(english);
  if (match) return H(language,
    `पूर्णांक x के लिए ${match[1]} से ${match[2]} तक, E = ${match[3]}। क्या x का एकमात्र मान निश्चित किया जा सकता है? कथन I: ${match[4]}। कथन II: ${match[5]}।`,
    `ਪੂਰਨ ਅੰਕ x ਲਈ ${match[1]} ਤੋਂ ${match[2]} ਤੱਕ, E = ${match[3]}। ਕੀ x ਦਾ ਇਕੋ ਮੁੱਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ? ਕਥਨ I: ${match[4]}। ਕਥਨ II: ${match[5]}।`,
  );

  match = /^Take (.+) to the nearest integer and (.+) to the nearest whole number\. If A = (.+) and B = (.+), compare A and B\.$/su.exec(english);
  if (match) return H(language,
    `${match[1]} को निकटतम पूर्णांक और ${match[2]} को निकटतम पूर्णांक तक लीजिए। यदि A = ${match[3]} और B = ${match[4]}, तो A और B की तुलना कीजिए।`,
    `${match[1]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਅਤੇ ${match[2]} ਨੂੰ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਤੱਕ ਲਵੋ। ਜੇ A = ${match[3]} ਅਤੇ B = ${match[4]}, ਤਾਂ A ਅਤੇ B ਦੀ ਤੁਲਨਾ ਕਰੋ।`,
  );

  match = /^For estimating (.+) to the nearest integer, a student uses (.+)\. Which correction is appropriate\?$/su.exec(english);
  if (match) return H(language,
    `${match[1]} का निकटतम पूर्णांक अनुमान निकालते समय एक विद्यार्थी ${match[2]} लेता है। सही सुधार कौन-सा है?`,
    `${match[1]} ਦਾ ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੂਰਨ ਅੰਕ ਅੰਦਾਜ਼ਾ ਕੱਢਦੇ ਸਮੇਂ ਇੱਕ ਵਿਦਿਆਰਥੀ ${match[2]} ਲੈਂਦਾ ਹੈ। ਸਹੀ ਸੁਧਾਰ ਕਿਹੜਾ ਹੈ?`,
  );

  if (qlId === "SAP-QL-063") {
    const expression = english.replace(/^Simplify\s+/u, "").replace(/\.$/u, "");
    return H(language, `सरल कीजिए: ${expression}`, `ਸਰਲ ਕਰੋ: ${expression}`);
  }

  return residualText(current, language);
}

function optionText(baseOption: string, current: string, qlId: string, language: SapTranslationLanguage) {
  if (qlId === "SAP-QL-014") {
    let match = /^Divide (.+) by (.+) before applying the (square|power|factorial)$/u.exec(baseOption);
    if (match) return H(language,
      `${match[3] === "factorial" ? "फैक्टोरियल" : match[3] === "square" ? "वर्ग" : "घात"} लगाने से पहले ${match[1]} को ${match[2]} से भाग दें`,
      `${match[3] === "factorial" ? "ਫੈਕਟੋਰੀਅਲ" : match[3] === "square" ? "ਵਰਗ" : "ਘਾਤ"} ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ${match[1]} ਨੂੰ ${match[2]} ਨਾਲ ਭਾਗ ਕਰੋ`,
    );
    match = /^Add (.+) before applying the (square|power|factorial)$/u.exec(baseOption);
    if (match) return H(language,
      `${match[2] === "factorial" ? "फैक्टोरियल" : match[2] === "square" ? "वर्ग" : "घात"} लगाने से पहले ${match[1]} जोड़ें`,
      `${match[2] === "factorial" ? "ਫੈਕਟੋਰੀਅਲ" : match[2] === "square" ? "ਵਰਗ" : "ਘਾਤ"} ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ${match[1]} ਜੋੜੋ`,
    );
    match = /^Evaluate the (square|power|factorial) and omit (.+)$/u.exec(baseOption);
    if (match) return H(language,
      `${match[1] === "factorial" ? "फैक्टोरियल" : match[1] === "square" ? "वर्ग" : "घात"} निकालें लेकिन ${match[2]} छोड़ दें`,
      `${match[1] === "factorial" ? "ਫੈਕਟੋਰੀਅਲ" : match[1] === "square" ? "ਵਰਗ" : "ਘਾਤ"} ਕੱਢੋ ਪਰ ${match[2]} ਛੱਡ ਦਿਓ`,
    );
    match = /^Calculate (.+) before (division|multiplication|addition|subtraction)$/u.exec(baseOption);
    if (match) return H(language,
      `${match[2] === "division" ? "भाग" : match[2] === "multiplication" ? "गुणा" : match[2] === "addition" ? "जोड़" : "घटाव"} से पहले ${match[1]} की गणना करें`,
      `${match[2] === "division" ? "ਭਾਗ" : match[2] === "multiplication" ? "ਗੁਣਾ" : match[2] === "addition" ? "ਜੋੜ" : "ਘਟਾਓ"} ਤੋਂ ਪਹਿਲਾਂ ${match[1]} ਦੀ ਗਣਨਾ ਕਰੋ`,
    );
    match = /^Increase the factorial input to (.+) before applying factorial$/u.exec(baseOption);
    if (match) return H(language, `फैक्टोरियल लगाने से पहले संख्या को ${match[1]} कर दें`, `ਫੈਕਟੋਰੀਅਲ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸੰਖਿਆ ਨੂੰ ${match[1]} ਕਰ ਦਿਓ`);
    match = /^Treat (.+) as (.+) and remove the divisor$/u.exec(baseOption);
    if (match) return H(language, `${match[1]} को ${match[2]} मानकर भाजक हटा दें`, `${match[1]} ਨੂੰ ${match[2]} ਮੰਨ ਕੇ ਭਾਜਕ ਹਟਾ ਦਿਓ`);
  }

  if (qlId === "SAP-QL-182") {
    let match = /^Keep (.+); it is already nearer\.$/u.exec(baseOption);
    if (match) return H(language, `${match[1]} ही रखें; वही अधिक निकट है`, `${match[1]} ਹੀ ਰੱਖੋ; ਉਹੀ ਵੱਧ ਨੇੜੇ ਹੈ`);
    match = /^Use (.+) instead\.$/u.exec(baseOption);
    if (match) return H(language, `इसके स्थान पर ${match[1]} लें`, `ਇਸ ਦੀ ਥਾਂ ${match[1]} ਲਵੋ`);
    match = /^Use (.+); (.+) gives the nearer integer root estimate\.$/su.exec(baseOption);
    if (match) return H(language, `${match[1]} लें; ${match[2]} से निकटतम पूर्णांक मूल का बेहतर अनुमान मिलता है`, `${match[1]} ਲਵੋ; ${match[2]} ਨਾਲ ਸਭ ਤੋਂ ਨੇੜਲੇ ਪੂਰਨ ਅੰਕ ਮੂਲ ਦਾ ਵਧੀਆ ਅੰਦਾਜ਼ਾ ਮਿਲਦਾ ਹੈ`);
  }

  return residualText(current, language);
}

function residualText(value: string, language: SapTranslationLanguage) {
  const transformed = mapOutsideMath(String(value ?? ""), (segment) => {
    let s = segment;
    const hi = language === "hi";
    const rep = (pattern: RegExp, hiText: string, paText: string) => { s = s.replace(pattern, hi ? hiText : paText); };

    rep(/\bLeft expression\b/giu, "बायाँ व्यंजक", "ਖੱਬਾ ਵਿਆੰਜਕ");
    rep(/\bRight expression\b/giu, "दायाँ व्यंजक", "ਸੱਜਾ ਵਿਆੰਜਕ");
    rep(/\bLeft\b/giu, "बायाँ मान", "ਖੱਬਾ ਮੁੱਲ");
    rep(/\bRight\b/giu, "दायाँ मान", "ਸੱਜਾ ਮੁੱਲ");
    rep(/Original expression:\s*/giu, "मूल व्यंजक: ", "ਮੂਲ ਵਿਆੰਜਕ: ");
    rep(/Original exact value\s*=\s*/giu, "मूल सटीक मान = ", "ਮੂਲ ਸਟੀਕ ਮੁੱਲ = ");
    rep(/Original value:\s*/giu, "मूल मान: ", "ਮੂਲ ਮੁੱਲ: ");
    rep(/After substitution:\s*/giu, "प्रतिस्थापन के बाद: ", "ਬਦਲੀ ਤੋਂ ਬਾਅਦ: ");
    rep(/Final exact value:\s*/giu, "अंतिम सटीक मान: ", "ਅੰਤਿਮ ਸਟੀਕ ਮੁੱਲ: ");
    rep(/Step\s+(\d+)\s+value\s*=\s*/giu, hi ? "चरण $1 का मान = " : "ਕਦਮ $1 ਦਾ ਮੁੱਲ = ", hi ? "चरण $1 का मान = " : "ਕਦਮ $1 ਦਾ ਮੁੱਲ = ");
    rep(/Step\s+(\d+)\s+is correct:\s*/giu, hi ? "चरण $1 सही है: " : "ਕਦਮ $1 ਸਹੀ ਹੈ: ", hi ? "चरण $1 सही है: " : "ਕਦਮ $1 ਸਹੀ ਹੈ: ");
    rep(/Step\s+(\d+)\s+should be\s*/giu, hi ? "चरण $1 में " : "ਕਦਮ $1 ਵਿੱਚ ", hi ? "चरण $1 में " : "ਕਦਮ $1 ਵਿੱਚ ");
    rep(/\bnot\b/giu, "नहीं", "ਨਹੀਂ");
    rep(/First calculate\s+/giu, "पहले गणना कीजिए: ", "ਪਹਿਲਾਂ ਗਣਨਾ ਕਰੋ: ");
    rep(/\breduce the preceding fraction\b/giu, "पिछली भिन्न को सरल कीजिए", "ਪਿਛਲੀ ਭਿੰਨ ਨੂੰ ਸਰਲ ਕਰੋ");
    rep(/\bthe result is\b/giu, "परिणाम है", "ਨਤੀਜਾ ਹੈ");
    rep(/\bcheck:\s*/giu, "जाँच: ", "ਜਾਂਚ: ");
    rep(/\bConsider the displayed calculation for\s+/giu, "दिखाई गई गणना पर विचार कीजिए: ", "ਦਿਖਾਈ ਗਈ ਗਣਨਾ ਨੂੰ ਵੇਖੋ: ");
    rep(/,\s*because\s+/giu, ", क्योंकि ", ", ਕਿਉਂਕਿ ");
    rep(/\bCancel\s+/giu, "काटिए ", "ਕੱਟੋ ");
    rep(/\bUse\s+/giu, "उपयोग कीजिए: ", "ਵਰਤੋ: ");
    rep(/\bThen\s+/giu, "फिर ", "ਫਿਰ ");
    rep(/\bTherefore\s+/giu, "अतः ", "ਇਸ ਲਈ ");
    rep(/\bThus\s*/giu, "अतः ", "ਇਸ ਲਈ ");
    rep(/\bAnswer:\s*/giu, "उत्तर: ", "ਉੱਤਰ: ");
    rep(/\bA student evaluates\s+/giu, "एक विद्यार्थी इसका मान निकालता है: ", "ਇੱਕ ਵਿਦਿਆਰਥੀ ਇਸ ਦਾ ਮੁੱਲ ਕੱਢਦਾ ਹੈ: ");
    rep(/\bThe value is\b/giu, "मान है", "ਮੁੱਲ ਹੈ");
    rep(/\bSubstitute\s+/giu, "मान रखिए: ", "ਮੁੱਲ ਰੱਖੋ: ");
    rep(/\bsubstituting\s+/giu, "मान रखने पर ", "ਮੁੱਲ ਰੱਖਣ ਤੇ ");
    rep(/\bfor the missing value in the original question reproduces the displayed equality\b/giu,
      "को मूल प्रश्न में रखने पर दी गई समानता फिर सही मिलती है",
      "ਨੂੰ ਮੂਲ ਸਵਾਲ ਵਿੱਚ ਰੱਖਣ ਤੇ ਦਿੱਤੀ ਸਮਾਨਤਾ ਮੁੜ ਸਹੀ ਮਿਲਦੀ ਹੈ");
    rep(/\bso the equality is restored exactly\b/giu, "अतः समानता बिल्कुल सही मिलती है", "ਇਸ ਲਈ ਸਮਾਨਤਾ ਬਿਲਕੁਲ ਸਹੀ ਮਿਲਦੀ ਹੈ");
    rep(/\bboth sides are equal\b/giu, "दोनों पक्ष बराबर हैं", "ਦੋਵੇਂ ਪਾਸੇ ਬਰਾਬਰ ਹਨ");
    rep(/\bexactly\b/giu, "बिल्कुल सही", "ਬਿਲਕੁਲ ਸਹੀ");
    rep(/\bCross-multiplication of these exact rationals confirms\b/giu, "इन सटीक परिमेयों का क्रॉस-गुणन पुष्टि करता है कि", "ਇਨ੍ਹਾਂ ਸਟੀਕ ਪਰਿਮੇਯਾਂ ਦਾ ਕਰਾਸ-ਗੁਣਾ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹੈ ਕਿ");
    rep(/\bSorting those four integers independently reproduces\b/giu, "इन चार पूर्णांकों को क्रम में रखने पर मिलता है", "ਇਨ੍ਹਾਂ ਚਾਰ ਪੂਰਨ ਅੰਕਾਂ ਨੂੰ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਣ ਤੇ ਮਿਲਦਾ ਹੈ");
    rep(/\bWrite\s+/giu, "लिखिए: ", "ਲਿਖੋ: ");
    rep(/\bFor x=/giu, "x = ", "x = ");
    rep(/,\s*the left side is\s+/giu, ", बायाँ पक्ष = ", ", ਖੱਬਾ ਪਾਸਾ = ");
    rep(/\bSince\s+/giu, "क्योंकि ", "ਕਿਉਂਕਿ ");
    rep(/\bMultiply by\s+/giu, "से गुणा कीजिए: ", "ਨਾਲ ਗੁਣਾ ਕਰੋ: ");
    rep(/\bWith\s+/giu, "जब ", "ਜਦੋਂ ");
    rep(/\bRemove\s+/giu, "हटाइए ", "ਹਟਾਓ ");
    rep(/\bInside the bracket,\s*/giu, "कोष्ठक के भीतर, ", "ਬਰੈਕਟ ਦੇ ਅੰਦਰ, ");
    rep(/\bDirect integer comparison of those two exact fixed-point values gives\b/giu, "दोनों सटीक दशमलव मानों की सीधी तुलना से मिलता है", "ਦੋਵੇਂ ਸਟੀਕ ਦਸ਼ਮਲਵ ਮੁੱਲਾਂ ਦੀ ਸਿੱਧੀ ਤੁਲਨਾ ਨਾਲ ਮਿਲਦਾ ਹੈ");
    rep(/\bAbsolute error\b/giu, "निरपेक्ष त्रुटि", "ਨਿਰਪੇਖ ਗਲਤੀ");
    rep(/\bExact sum\b/giu, "सटीक योग", "ਸਟੀਕ ਜੋੜ");
    rep(/\bExact difference\b/giu, "सटीक अंतर", "ਸਟੀਕ ਅੰਤਰ");
    rep(/\bExact value before rounding\b/giu, "पूर्णांकन से पहले सटीक मान", "ਰਾਊਂਡਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਸਟੀਕ ਮੁੱਲ");
    rep(/\bRounded expression\b/giu, "पूर्णांकित व्यंजक", "ਰਾਊਂਡ ਕੀਤਾ ਵਿਆੰਜਕ");
    rep(/\bDeclared estimate\b/giu, "दिया गया अनुमान", "ਦਿੱਤਾ ਅੰਦਾਜ਼ਾ");
    rep(/\bApproved estimate\b/giu, "सही अनुमान", "ਸਹੀ ਅੰਦਾਜ਼ਾ");
    rep(/\bEstimate\s*−\s*exact sum\b/giu, "अनुमान − सटीक योग", "ਅੰਦਾਜ਼ਾ − ਸਟੀਕ ਜੋੜ");
    rep(/\bComparing these two estimates confirms\b/giu, "इन दोनों अनुमानों की तुलना से पुष्टि होती है कि", "ਇਨ੍ਹਾਂ ਦੋਵੇਂ ਅੰਦਾਜ਼ਿਆਂ ਦੀ ਤੁਲਨਾ ਨਾਲ ਪੁਸ਼ਟੀ ਹੁੰਦੀ ਹੈ ਕਿ");
    rep(/\bThe student's addition\b/giu, "विद्यार्थी का जोड़", "ਵਿਦਿਆਰਥੀ ਦਾ ਜੋੜ");
    rep(/\bis arithmetically correct\b/giu, "अंकगणित की दृष्टि से सही है", "ਅੰਕਗਣਿਤ ਅਨੁਸਾਰ ਸਹੀ ਹੈ");
    rep(/\bThe final scale matches\b/giu, "अंतिम दशमलव-स्थान मेल खाता है", "ਅੰਤਿਮ ਦਸ਼ਮਲਵ-ਥਾਂ ਮਿਲਦੀ ਹੈ");
    rep(/\bmeans\b/giu, "का अर्थ है", "ਦਾ ਅਰਥ ਹੈ");
    rep(/\bThe answer is of the same order as\b/giu, "उत्तर का परिमाण लगभग इसी स्तर का है जैसा", "ਉੱਤਰ ਦਾ ਪਰਿਮਾਣ ਲਗਭਗ ਇਸੇ ਪੱਧਰ ਦਾ ਹੈ ਜਿਵੇਂ");
    rep(/\bchoose\b/giu, "चुनिए", "ਚੁਣੋ");
    rep(/\bexact quotient\b/giu, "सटीक भागफल", "ਸਟੀਕ ਭਾਗਫਲ");
    rep(/\bRounded product\b/giu, "पूर्णांकित गुणनफल", "ਰਾਊਂਡ ਕੀਤਾ ਗੁਣਨਫਲ");
    rep(/\bis nearer than\b/giu, "की तुलना में अधिक निकट है", "ਦੇ ਮੁਕਾਬਲੇ ਵੱਧ ਨੇੜੇ ਹੈ");
    rep(/\bis (\d+(?:\.\d+)?) below it\b/giu, hi ? "उससे $1 कम है" : "ਉਸ ਤੋਂ $1 ਘੱਟ ਹੈ", hi ? "उससे $1 कम है" : "ਉਸ ਤੋਂ $1 ਘੱਟ ਹੈ");
    rep(/\bDirect check:\s*/giu, "सीधी जाँच: ", "ਸਿੱਧੀ ਜਾਂਚ: ");
    rep(/\bIndependent endpoint check:\s*/giu, "अंतिम पदों से स्वतंत्र जाँच: ", "ਅੰਤਲੇ ਪਦਾਂ ਨਾਲ ਸੁਤੰਤਰ ਜਾਂਚ: ");
    rep(/\bThe equation is\b/giu, "समीकरण है", "ਸਮੀਕਰਨ ਹੈ");
    rep(/\bgiving\b/giu, "जिससे", "ਜਿਸ ਨਾਲ");
    rep(/\balso\b/giu, "और", "ਅਤੇ");
    rep(/\bwhile\b/giu, "जबकि", "ਜਦਕਿ");
    rep(/\bthe denominator is\b/giu, "हर है", "ਹਰ ਹੈ");
    rep(/\btherefore\b/giu, "अतः", "ਇਸ ਲਈ");
    rep(/\bof\b/giu, "का", "ਦਾ");
    rep(/\btens\b/giu, "दशक", "ਦਹਾਕਾ");
    rep(/\bunits\b/giu, "इकाई", "ਇਕਾਈ");
    rep(/\bEvaluate\s+/giu, "गणना कीजिए: ", "ਗਣਨਾ ਕਰੋ: ");
    rep(/\bSubtract\s+/giu, "घटाइए ", "ਘਟਾਓ ");
    rep(/\bfrom\b/giu, "में से", "ਵਿੱਚੋਂ");
    rep(/\band\b/giu, "और", "ਅਤੇ");
    rep(/\bnot\b/giu, "नहीं", "ਨਹੀਂ");

    return s;
  });
  return tidy(transformed);
}

function extraEvidence(base: any, localizedAnswer: string, language: SapTranslationLanguage) {
  const qlId = String(base.questionLanguageId ?? "");
  const Hx = (hi: string, pa: string) => H(language, hi, pa);
  if (qlId === "SAP-QL-014") return Hx(`सही पहला कदम है: ${localizedAnswer}।`, `ਸਹੀ ਪਹਿਲਾ ਕਦਮ ਹੈ: ${localizedAnswer}।`);
  if (qlId === "SAP-QL-033") return Hx(`व्यंजक का मान पहली बार ${localizedAnswer} पर बदलता है।`, `ਵਿਆੰਜਕ ਦਾ ਮੁੱਲ ਪਹਿਲੀ ਵਾਰ ${localizedAnswer} ਤੇ ਬਦਲਦਾ ਹੈ।`);
  if (qlId === "SAP-QL-052") return Hx(`दिखाई गई समानताओं को क्रम से जाँचने पर पहली त्रुटि ${localizedAnswer} पर मिलती है।`, `ਦਿੱਤੀਆਂ ਸਮਾਨਤਾਵਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਜਾਂਚਣ ਤੇ ਪਹਿਲੀ ਗਲਤੀ ${localizedAnswer} ਤੇ ਮਿਲਦੀ ਹੈ।`);
  if (qlId === "SAP-QL-112") return Hx("दोनों कथनों से मिलने वाले संभव x-मानों की संख्या अलग-अलग और साथ में जाँचिए।", "ਦੋਵੇਂ ਕਥਨਾਂ ਤੋਂ ਮਿਲਣ ਵਾਲੇ ਸੰਭਵ x-ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਵੱਖ-ਵੱਖ ਅਤੇ ਇਕੱਠੇ ਜਾਂਚੋ।");
  return undefined;
}

function conceptLine(base: any, current: any, language: SapTranslationLanguage) {
  const first = String(current.explanation?.lines?.[0] ?? "");
  if (first && !LATIN_WORD.test(mapOutsideMath(first, (s) => s))) return residualText(first, language);
  const cp = String(base.canonicalProblemId ?? "");
  const map: Record<string, string> = language === "hi" ? {
    "SAP-CP-001": "कोष्ठक और घात के बाद गुणा/भाग कीजिए; फिर जोड़/घटाव बाएँ से दाएँ कीजिए।",
    "SAP-CP-002": "भिन्नों में पहले आवश्यक समान हर या व्युत्क्रम का उपयोग कीजिए, फिर उत्तर को न्यूनतम रूप में लिखिए।",
    "SAP-CP-003": "दशमलव, भिन्न और प्रतिशत को सुविधाजनक सटीक रूप में बदलकर गणना कीजिए।",
    "SAP-CP-004": "घात, मूल या फैक्टोरियल का मान पहले निकालिए; फिर शेष गणना कीजिए।",
    "SAP-CP-005": "बड़ी गणना से पहले वैध काट-छाँट या टेलिस्कोपिंग संरचना पहचानिए।",
    "SAP-CP-006": "ज्ञात पद हटाकर अज्ञात मान को अकेला कीजिए और उत्तर को मूल समानता में जाँचिए।",
    "SAP-CP-007": "निर्धारित स्थान तक पूर्णांकन करते समय उसके दाएँ वाले अंक से निर्णय कीजिए।",
    "SAP-CP-008": "दिए गए नियम के अनुसार पदों को पूर्णांकित करके वही संक्रिया कीजिए।",
    "SAP-CP-009": "उपयुक्त निकट मान चुनकर गुणनफल, भागफल, अनुपात या प्रतिशत का अनुमान लगाइए।",
    "SAP-CP-010": "मूल या घात को पास के पूर्ण वर्ग, घन या घात से बाँधकर अनुमान लगाइए।",
    "SAP-CP-011": "अनुमान, त्रुटि, दूरी या सीमा की गणना करके सही विकल्प चुनिए।",
    "SAP-CP-012": "निकट मान लेकर समीकरण सरल कीजिए और अज्ञात मान को अलग कीजिए।",
  } : {
    "SAP-CP-001": "ਬਰੈਕਟ ਅਤੇ ਘਾਤ ਤੋਂ ਬਾਅਦ ਗੁਣਾ/ਭਾਗ ਕਰੋ; ਫਿਰ ਜੋੜ/ਘਟਾਓ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਕਰੋ।",
    "SAP-CP-002": "ਭਿੰਨਾਂ ਵਿੱਚ ਪਹਿਲਾਂ ਲੋੜੀਂਦਾ ਇੱਕੋ ਹਰ ਜਾਂ ਉਲਟ ਭਿੰਨ ਵਰਤੋ, ਫਿਰ ਉੱਤਰ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
    "SAP-CP-003": "ਦਸ਼ਮਲਵ, ਭਿੰਨ ਅਤੇ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਸੁਵਿਧਾਜਨਕ ਸਟੀਕ ਰੂਪ ਵਿੱਚ ਬਦਲ ਕੇ ਗਣਨਾ ਕਰੋ।",
    "SAP-CP-004": "ਘਾਤ, ਮੂਲ ਜਾਂ ਫੈਕਟੋਰੀਅਲ ਦਾ ਮੁੱਲ ਪਹਿਲਾਂ ਕੱਢੋ; ਫਿਰ ਬਾਕੀ ਗਣਨਾ ਕਰੋ।",
    "SAP-CP-005": "ਵੱਡੀ ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ਵੈਧ ਕਟੌਤੀ ਜਾਂ ਟੈਲੀਸਕੋਪਿੰਗ ਬਣਤਰ ਪਛਾਣੋ।",
    "SAP-CP-006": "ਜਾਣੇ ਪਦ ਹਟਾ ਕੇ ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਇਕੱਲਾ ਕਰੋ ਅਤੇ ਉੱਤਰ ਨੂੰ ਮੂਲ ਸਮਾਨਤਾ ਵਿੱਚ ਜਾਂਚੋ।",
    "SAP-CP-007": "ਨਿਰਧਾਰਤ ਸਥਾਨ ਤੱਕ ਰਾਊਂਡ ਕਰਦੇ ਸਮੇਂ ਉਸ ਦੇ ਸੱਜੇ ਅੰਕ ਤੋਂ ਫ਼ੈਸਲਾ ਕਰੋ।",
    "SAP-CP-008": "ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਪਦਾਂ ਨੂੰ ਰਾਊਂਡ ਕਰਕੇ ਉਹੀ ਕਿਰਿਆ ਕਰੋ।",
    "SAP-CP-009": "ਢੁੱਕਵੇਂ ਨੇੜਲੇ ਮੁੱਲ ਚੁਣ ਕੇ ਗੁਣਨਫਲ, ਭਾਗਫਲ, ਅਨੁਪਾਤ ਜਾਂ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
    "SAP-CP-010": "ਮੂਲ ਜਾਂ ਘਾਤ ਨੂੰ ਨੇੜਲੇ ਪੂਰਨ ਵਰਗ, ਘਣ ਜਾਂ ਘਾਤ ਨਾਲ ਬੰਨ੍ਹ ਕੇ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
    "SAP-CP-011": "ਅੰਦਾਜ਼ਾ, ਗਲਤੀ, ਦੂਰੀ ਜਾਂ ਹੱਦ ਦੀ ਗਣਨਾ ਕਰਕੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
    "SAP-CP-012": "ਨੇੜਲੇ ਮੁੱਲ ਲੈ ਕੇ ਸਮੀਕਰਨ ਸਰਲ ਕਰੋ ਅਤੇ ਅਣਜਾਣ ਮੁੱਲ ਨੂੰ ਅਲੱਗ ਕਰੋ।",
  };
  return map[cp] ?? H(language, "दिए गए नियम से प्रश्न हल कीजिए।", "ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਸਵਾਲ ਹੱਲ ਕਰੋ।");
}

function conclusion(answer: string, language: SapTranslationLanguage) {
  return H(language, `अतः सही उत्तर ${answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`);
}

function explanationV2(base: any, current: any, answer: string, language: SapTranslationLanguage) {
  const sourceLines = [...(current.explanation?.lines ?? [])].map(String);
  const middle = sourceLines.slice(1, -1)
    .map((line) => residualText(line, language))
    .filter((line) => line && !LATIN_WORD.test(mapOutsideMath(line, (s) => s)));
  const extra = extraEvidence(base, answer, language);
  const evidence = [...middle];
  if (extra && !evidence.includes(extra)) evidence.push(extra);
  if (!evidence.length) {
    evidence.push(H(language,
      `दिए गए मानों पर यह नियम लागू करने पर ${answer} प्राप्त होता है।`,
      `ਦਿੱਤੇ ਮੁੱਲਾਂ ਉੱਤੇ ਇਹ ਨਿਯਮ ਲਾਗੂ ਕਰਨ ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`,
    ));
  }
  return Object.freeze({ lines: Object.freeze([conceptLine(base, current, language), ...evidence.slice(0, 5), conclusion(answer, language)]) });
}

function badProse(value: string, language: SapTranslationLanguage) {
  const prose = mapOutsideMath(value, (segment) => segment);
  if (LATIN_WORD.test(prose)) return true;
  if (language === "hi" && /[\u0A00-\u0A7F]/u.test(prose)) return true;
  if (language === "pa" && /[\u0900-\u097F]/u.test(prose.replace(/[।॥]/gu, ""))) return true;
  return false;
}

export function applySapAuthoredPresentationV2(base: any, current: any, language: SapTranslationLanguage) {
  const qlId = String(base.questionLanguageId ?? "");
  const options = Object.freeze(base.options.map((option: unknown, index: number) =>
    optionText(String(option ?? ""), String(current.options?.[index] ?? option ?? ""), qlId, language),
  ));
  const correctIndex = Number(base.correctIndex);
  const answer = options[correctIndex];
  const stem = naturalStem(base, String(current.stem ?? ""), language);
  const explanation = explanationV2(base, current, answer, language);
  const learnerText = [stem, ...options, ...explanation.lines].join("\n");
  const errors: string[] = [];
  if (badProse(learnerText, language)) errors.push("V2 authored presentation still contains Latin/wrong-script learner prose.");
  if (options.length !== base.options.length) errors.push("V2 authored presentation changed option count.");
  if (options[correctIndex] !== answer) errors.push("V2 authored presentation lost answer binding.");

  return Object.freeze({
    ...current,
    stem,
    options,
    correctIndex,
    answer,
    explanation,
    traceability: Object.freeze({
      ...(current.traceability ?? {}),
      localizationAuthorship: "SAP-CP-AUTHORED-PRESENTATION-V2",
      localizationFamily: String(base.canonicalProblemId ?? ""),
      canonicalEnglishStem: base.stem,
      canonicalEnglishOptions: Object.freeze([...base.options]),
      canonicalEnglishAnswer: base.answer,
    }),
    localizationValidation: Object.freeze({
      ...(current.localizationValidation ?? {}),
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      authoredPresentation: true,
      naturalnessOk: errors.length === 0,
      authoredVersion: "V2",
    }),
    validation: Object.freeze({
      ok: Boolean(base.validation?.ok) && errors.length === 0,
      errors: Object.freeze([...(base.validation?.errors ?? []), ...errors]),
    }),
  });
}
