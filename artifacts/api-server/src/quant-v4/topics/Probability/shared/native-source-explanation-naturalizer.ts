import type { ProbabilityNativeLanguage } from "../multilingual-foundation";

function pick(language: ProbabilityNativeLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function objectForms(
  language: ProbabilityNativeLanguage,
  object: string,
): Readonly<{ plural: string; oblique: string; singular: string }> {
  const key = object.toLowerCase();
  const hi: Record<string, { plural: string; oblique: string; singular: string }> = {
    balls: { plural: "गेंदें", oblique: "गेंदों", singular: "गेंद" },
    ball: { plural: "गेंदें", oblique: "गेंदों", singular: "गेंद" },
    marbles: { plural: "कंचे", oblique: "कंचों", singular: "कंचा" },
    marble: { plural: "कंचे", oblique: "कंचों", singular: "कंचा" },
    pens: { plural: "पेन", oblique: "पेनों", singular: "पेन" },
    pen: { plural: "पेन", oblique: "पेनों", singular: "पेन" },
    "coloured stones": { plural: "रंगीन पत्थर", oblique: "रंगीन पत्थरों", singular: "रंगीन पत्थर" },
    "coloured stone": { plural: "रंगीन पत्थर", oblique: "रंगीन पत्थरों", singular: "रंगीन पत्थर" },
    stones: { plural: "पत्थर", oblique: "पत्थरों", singular: "पत्थर" },
    stone: { plural: "पत्थर", oblique: "पत्थरों", singular: "पत्थर" },
  };
  const pa: Record<string, { plural: string; oblique: string; singular: string }> = {
    balls: { plural: "ਗੇਂਦਾਂ", oblique: "ਗੇਂਦਾਂ", singular: "ਗੇਂਦ" },
    ball: { plural: "ਗੇਂਦਾਂ", oblique: "ਗੇਂਦਾਂ", singular: "ਗੇਂਦ" },
    marbles: { plural: "ਕੰਚੇ", oblique: "ਕੰਚਿਆਂ", singular: "ਕੰਚਾ" },
    marble: { plural: "ਕੰਚੇ", oblique: "ਕੰਚਿਆਂ", singular: "ਕੰਚਾ" },
    pens: { plural: "ਪੈਨ", oblique: "ਪੈਨਾਂ", singular: "ਪੈਨ" },
    pen: { plural: "ਪੈਨ", oblique: "ਪੈਨਾਂ", singular: "ਪੈਨ" },
    "coloured stones": { plural: "ਰੰਗੀਨ ਪੱਥਰ", oblique: "ਰੰਗੀਨ ਪੱਥਰਾਂ", singular: "ਰੰਗੀਨ ਪੱਥਰ" },
    "coloured stone": { plural: "ਰੰਗੀਨ ਪੱਥਰ", oblique: "ਰੰਗੀਨ ਪੱਥਰਾਂ", singular: "ਰੰਗੀਨ ਪੱਥਰ" },
    stones: { plural: "ਪੱਥਰ", oblique: "ਪੱਥਰਾਂ", singular: "ਪੱਥਰ" },
    stone: { plural: "ਪੱਥਰ", oblique: "ਪੱਥਰਾਂ", singular: "ਪੱਥਰ" },
  };
  const value = (language === "hi" ? hi : pa)[key];
  if (!value) throw new Error(`Unsupported Probability native explanation object ${object}.`);
  return value;
}

function colour(language: ProbabilityNativeLanguage, value: string): string {
  const key = value.toLowerCase();
  const hi: Record<string, string> = { red: "लाल", blue: "नीला", green: "हरा", black: "काला" };
  const pa: Record<string, string> = { red: "ਲਾਲ", blue: "ਨੀਲਾ", green: "ਹਰਾ", black: "ਕਾਲਾ" };
  return (language === "hi" ? hi : pa)[key] ?? value;
}

/**
 * Naturalises recurring English Probability explanation sentences after MathJax has
 * been replaced by opaque ¤N¤ placeholders. The placeholders and all numeric facts
 * are copied verbatim so the caller can restore/check English-authority mathematics.
 */
export function naturalizeProbabilityExplanationBody(
  value: string,
  language: ProbabilityNativeLanguage,
): string | null {
  let m: RegExpMatchArray | null;

  m = value.match(/^The (box|pouch) contains (\d+) (pens|coloured stones) altogether: (\d+) red, (\d+) blue and (\d+) green\.$/u);
  if (m) {
    const containerHi = m[1] === "box" ? "बॉक्स" : "पाउच";
    const containerPa = m[1] === "box" ? "ਬਾਕਸ" : "ਪਾਊਚ";
    const objectHi = m[3] === "pens" ? "पेन" : "रंगीन पत्थर";
    const objectPa = m[3] === "pens" ? "ਪੈਨ" : "ਰੰਗੀਨ ਪੱਥਰ";
    return pick(
      language,
      containerHi + " में कुल " + m[2] + " " + objectHi + " हैं—" + m[4] + " लाल, " + m[5] + " नीले और " + m[6] + " हरे।",
      containerPa + " ਵਿੱਚ ਕੁੱਲ " + m[2] + " " + objectPa + " ਹਨ—" + m[4] + " ਲਾਲ, " + m[5] + " ਨੀਲੇ ਅਤੇ " + m[6] + " ਹਰੇ।",
    );
  }

  m = value.match(/^(\d+) of the (\d+) (pens|coloured stones) are (red|blue|green)\.$/u);
  if (m) {
    const objectHi = m[3] === "pens" ? "पेन" : "रंगीन पत्थरों";
    const objectPa = m[3] === "pens" ? "ਪੈਨਾਂ" : "ਰੰਗੀਨ ਪੱਥਰਾਂ";
    const colourHi: Record<string, string> = { red: "लाल", blue: "नीले", green: "हरे" };
    const colourPa: Record<string, string> = { red: "ਲਾਲ", blue: "ਨੀਲੇ", green: "ਹਰੇ" };
    return language === "hi"
      ? "कुल " + m[2] + " " + objectHi + " में से " + m[1] + " " + colourHi[m[4]!] + " हैं।"
      : "ਕੁੱਲ " + m[2] + " " + objectPa + " ਵਿੱਚੋਂ " + m[1] + " " + colourPa[m[4]!] + " ਹਨ।";
  }

  m = value.match(/^The deck has (\d+) (black|red) cards\.$/u);
  if (m) {
    const colourHi = m[2] === "black" ? "काले" : "लाल";
    const colourPa = m[2] === "black" ? "ਕਾਲੇ" : "ਲਾਲ";
    return language === "hi"
      ? "ताश की गड्डी में " + m[1] + " " + colourHi + " पत्ते हैं।"
      : "ਤਾਸ਼ ਦੀ ਗੱਡੀ ਵਿੱਚ " + m[1] + " " + colourPa + " ਪੱਤੇ ਹਨ।";
  }

  m = value.match(/^A deck has (\d+) (diamonds|spades|hearts|clubs), so cards that are not (diamonds|spades|hearts|clubs) = (\d+) - (\d+) = (\d+)\.$/u);
  if (m) {
    const suitHi: Record<string, string> = { diamonds: "डायमंड", spades: "स्पेड", hearts: "हार्ट", clubs: "क्लब" };
    const suitPa: Record<string, string> = { diamonds: "ਡਾਇਮੰਡ", spades: "ਸਪੇਡ", hearts: "ਹਾਰਟ", clubs: "ਕਲੱਬ" };
    const hi = suitHi[m[2]!]!;
    const pa = suitPa[m[2]!]!;
    return language === "hi"
      ? "एक ताश की गड्डी में " + m[1] + " " + hi + " होते हैं। इसलिए " + hi + " न होने वाले पत्तों की संख्या = " + m[4] + " - " + m[5] + " = " + m[6] + "।"
      : "ਤਾਸ਼ ਦੀ ਇੱਕ ਗੱਡੀ ਵਿੱਚ " + m[1] + " " + pa + " ਹੁੰਦੇ ਹਨ। ਇਸ ਲਈ " + pa + " ਨਾ ਹੋਣ ਵਾਲੇ ਪੱਤਿਆਂ ਦੀ ਗਿਣਤੀ = " + m[4] + " - " + m[5] + " = " + m[6] + "।";
  }

  if (value === "Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.") {
    return pick(
      language,
      "पत्ता फेस कार्ड दिया गया है, इसलिए अब कुल संभावित पत्ते केवल 12 गुलाम, बेगम और बादशाह हैं।",
      "ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਦਿੱਤਾ ਹੋਇਆ ਹੈ, ਇਸ ਲਈ ਹੁਣ ਕੁੱਲ ਸੰਭਵ ਪੱਤੇ ਕੇਵਲ 12 ਗੁਲਾਮ, ਬੇਗਮ ਅਤੇ ਬਾਦਸ਼ਾਹ ਹਨ।",
    );
  }

  m = value.match(/^The first marble is replaced, so the container again has (\d+) red and (\d+) blue marbles before the second selection\.$/u);
  if (m) return pick(
    language,
    "पहला कंचा वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी जार में फिर " + m[1] + " लाल और " + m[2] + " नीले कंचे होते हैं।",
    "ਪਹਿਲਾ ਕੰਚਾ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਉਸੇ ਜਾਰ ਵਿੱਚ ਫਿਰ " + m[1] + " ਲਾਲ ਅਤੇ " + m[2] + " ਨੀਲੇ ਕੰਚੇ ਹੁੰਦੇ ਹਨ।",
  );

  m = value.match(/^The first stone is replaced, so the container again has (\d+) red and (\d+) blue coloured stones before the second selection\.$/u);
  if (m) return pick(
    language,
    "पहला पत्थर वापस रख दिया जाता है, इसलिए दूसरे चयन से पहले उसी पाउच में फिर " + m[1] + " लाल और " + m[2] + " नीले रंगीन पत्थर होते हैं।",
    "ਪਹਿਲਾ ਪੱਥਰ ਵਾਪਸ ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਉਸੇ ਪਾਊਚ ਵਿੱਚ ਫਿਰ " + m[1] + " ਲਾਲ ਅਤੇ " + m[2] + " ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ ਹੁੰਦੇ ਹਨ।",
  );

  m = value.match(/^Among them, (.+) are divisible by (\d+)\. So the probability is (.+)\.$/u);
  if (m) return pick(
    language,
    "इनमें से " + m[1] + " संख्याएँ " + m[2] + " से विभाज्य हैं। इसलिए प्रायिकता " + m[3] + " है।",
    "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ " + m[1] + " ਸੰਖਿਆਵਾਂ " + m[2] + " ਨਾਲ ਭਾਗਯੋਗ ਹਨ। ਇਸ ਲਈ ਸੰਭਾਵਨਾ " + m[3] + " ਹੈ।",
  );

  m = value.match(/^First find those satisfying at least one condition: (.+)\.$/u);
  if (m) return pick(
    language,
    "पहले कम-से-कम एक शर्त पूरी करने वालों की संख्या ज्ञात करें: " + m[1] + "।",
    "ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ: " + m[1] + "।",
  );

  m = value.match(/^People satisfying neither condition = (.+)\.$/u);
  if (m) return pick(
    language,
    "किसी भी शर्त को पूरा न करने वाले लोगों की संख्या = " + m[1] + "।",
    "ਕਿਸੇ ਵੀ ਸ਼ਰਤ ਨੂੰ ਪੂਰਾ ਨਾ ਕਰਨ ਵਾਲੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ = " + m[1] + "।",
  );

  m = value.match(/^Apply (.+)\.$/u);
  if (m) return pick(
    language,
    "सूत्र लगाएँ: " + m[1] + "।",
    "ਸੂਤਰ ਲਗਾਓ: " + m[1] + "।",
  );

  m = value.match(/^In counts, the overlap is (.+)\.$/u);
  if (m) return pick(
    language,
    "संख्याओं के रूप में साझा भाग = " + m[1] + "।",
    "ਗਿਣਤੀਆਂ ਦੇ ਰੂਪ ਵਿੱਚ ਸਾਂਝਾ ਹਿੱਸਾ = " + m[1] + "।",
  );

  if (value === "Use symmetry at the first post. Every person is equally likely to receive that post, so compare the number of women with the total number of people.") {
    return pick(
      language,
      "पहले पद के लिए सममिति का उपयोग करें। हर व्यक्ति के उस पद पर चुने जाने की संभावना समान है, इसलिए महिलाओं की संख्या की तुलना कुल लोगों की संख्या से करें।",
      "ਪਹਿਲੇ ਅਹੁਦੇ ਲਈ ਸਮਮਿਤੀ ਵਰਤੋ। ਹਰ ਵਿਅਕਤੀ ਦੇ ਉਸ ਅਹੁਦੇ ਲਈ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਔਰਤਾਂ ਦੀ ਗਿਣਤੀ ਦੀ ਤੁਲਨਾ ਕੁੱਲ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਕਰੋ।",
    );
  }

  m = value.match(/^There are (\d+) people altogether: (\d+) men \+ (\d+) women = (\d+)\.$/u);
  if (m) return pick(
    language,
    "कुल " + m[1] + " लोग हैं: " + m[2] + " पुरुष + " + m[3] + " महिलाएँ = " + m[4] + "।",
    "ਕੁੱਲ " + m[1] + " ਲੋਕ ਹਨ: " + m[2] + " ਮਰਦ + " + m[3] + " ਔਰਤਾਂ = " + m[4] + "।",
  );

  m = value.match(/^(\d+) of the (\d+) people are women, so (.+)\.$/u);
  if (m) return pick(
    language,
    m[2] + " लोगों में " + m[1] + " महिलाएँ हैं, इसलिए " + m[3] + "।",
    m[2] + " ਲੋਕਾਂ ਵਿੱਚ " + m[1] + " ਔਰਤਾਂ ਹਨ, ਇਸ ਲਈ " + m[3] + "।",
  );

  if (value === "Assignments to the remaining posts do not change the probability for the first post.") {
    return pick(
      language,
      "बाकी पदों का आवंटन पहले पद की प्रायिकता को नहीं बदलता।",
      "ਬਾਕੀ ਅਹੁਦਿਆਂ ਦੀ ਵੰਡ ਪਹਿਲੇ ਅਹੁਦੇ ਦੀ ਸੰਭਾਵਨਾ ਨੂੰ ਨਹੀਂ ਬਦਲਦੀ।",
    );
  }

  m = value.match(/^Any of the (\d+) people can receive the first post\.$/u);
  if (m) return pick(
    language,
    m[1] + " लोगों में से कोई भी पहला पद प्राप्त कर सकता है।",
    m[1] + " ਲੋਕਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਨੂੰ ਵੀ ਪਹਿਲਾ ਅਹੁਦਾ ਮਿਲ ਸਕਦਾ ਹੈ।",
  );

  m = value.match(/^(\d+) of these (\d+) people are women, and the remaining posts do not affect who receives the first post\.$/u);
  if (m) return pick(
    language,
    "इन " + m[2] + " लोगों में " + m[1] + " महिलाएँ हैं। बाकी पदों का आवंटन इस बात को प्रभावित नहीं करता कि पहला पद किसे मिलता है।",
    "ਇਨ੍ਹਾਂ " + m[2] + " ਲੋਕਾਂ ਵਿੱਚ " + m[1] + " ਔਰਤਾਂ ਹਨ। ਬਾਕੀ ਅਹੁਦਿਆਂ ਦੀ ਵੰਡ ਇਸ ਗੱਲ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਨਹੀਂ ਕਰਦੀ ਕਿ ਪਹਿਲਾ ਅਹੁਦਾ ਕਿਸ ਨੂੰ ਮਿਲਦਾ ਹੈ।",
  );

  m = value.match(/^The unit digit has (\d+) even choices\. After fixing it, the remaining (\d+) positions can be filled in (.+) ways\.$/u);
  if (m) return pick(
    language,
    "इकाई स्थान के लिए " + m[1] + " सम अंकों के विकल्प हैं। इसे तय करने के बाद बाकी " + m[2] + " स्थानों को " + m[3] + " तरीकों से भरा जा सकता है।",
    "ਇਕਾਈ ਸਥਾਨ ਲਈ " + m[1] + " ਜੋੜੇ ਅੰਕਾਂ ਦੀਆਂ ਚੋਣਾਂ ਹਨ। ਇਸ ਨੂੰ ਨਿਰਧਾਰਤ ਕਰਨ ਤੋਂ ਬਾਅਦ ਬਾਕੀ " + m[2] + " ਸਥਾਨ " + m[3] + " ਤਰੀਕਿਆਂ ਨਾਲ ਭਰੇ ਜਾ ਸਕਦੇ ਹਨ।",
  );

  m = value.match(/^Use the complement\. Committees containing no woman are all-men committees: (.+)\.$/u);
  if (m) return pick(
    language,
    "पूरक घटना का उपयोग करें। जिस समिति में कोई महिला नहीं है, वह केवल पुरुषों की समिति होगी: " + m[1] + "।",
    "ਪੂਰਕ ਘਟਨਾ ਵਰਤੋ। ਜਿਸ ਕਮੇਟੀ ਵਿੱਚ ਕੋਈ ਔਰਤ ਨਹੀਂ ਹੈ, ਉਹ ਕੇਵਲ ਮਰਦਾਂ ਦੀ ਕਮੇਟੀ ਹੋਵੇਗੀ: " + m[1] + "।",
  );

  m = value.match(/^Committees with at least one woman = (.+)\.$/u);
  if (m) return pick(
    language,
    "कम-से-कम एक महिला वाली समितियाँ = " + m[1] + "।",
    "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਔਰਤ ਵਾਲੀਆਂ ਕਮੇਟੀਆਂ = " + m[1] + "।",
  );

  m = value.match(/^Ways to choose (\d+) (woman|women): (.+)\.$/u);
  if (m) return pick(
    language,
    m[1] + " महिला चुनने के तरीके: " + m[3] + "।",
    m[1] + " ਔਰਤ ਚੁਣਨ ਦੇ ਤਰੀਕੇ: " + m[3] + "।",
  );

  m = value.match(/^Ways to choose (\d+) (man|men): (.+)\.$/u);
  if (m) return pick(
    language,
    m[1] + " पुरुष चुनने के तरीके: " + m[3] + "।",
    m[1] + " ਮਰਦ ਚੁਣਨ ਦੇ ਤਰੀਕੇ: " + m[3] + "।",
  );

  if (value === "No division by the total number of committees is needed because the question asks for a count, not a probability.") {
    return pick(
      language,
      "यहाँ कुल समितियों की संख्या से भाग देने की आवश्यकता नहीं है, क्योंकि प्रश्न प्रायिकता नहीं बल्कि समितियों की संख्या पूछता है।",
      "ਇੱਥੇ ਕੁੱਲ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦੇਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ, ਕਿਉਂਕਿ ਪ੍ਰਸ਼ਨ ਸੰਭਾਵਨਾ ਨਹੀਂ ਸਗੋਂ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਪੁੱਛਦਾ ਹੈ।",
    );
  }

  m = value.match(/^The required number of committees is (\d+)\.$/u);
  if (m) return pick(
    language,
    "आवश्यक समितियों की संख्या " + m[1] + " है।",
    "ਲੋੜੀਂਦੀਆਂ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ " + m[1] + " ਹੈ।",
  );

  if (value === "The order in which committee members are named is irrelevant, so each committee must be counted only once.") {
    return pick(
      language,
      "समिति के सदस्यों को किस क्रम में लिखा गया है, इससे फर्क नहीं पड़ता; इसलिए प्रत्येक समिति को केवल एक बार गिनें।",
      "ਕਮੇਟੀ ਦੇ ਮੈਂਬਰਾਂ ਨੂੰ ਕਿਸ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਿਆ ਗਿਆ ਹੈ, ਇਸ ਨਾਲ ਫਰਕ ਨਹੀਂ ਪੈਂਦਾ; ਇਸ ਲਈ ਹਰ ਕਮੇਟੀ ਨੂੰ ਕੇਵਲ ਇੱਕ ਵਾਰ ਗਿਣੋ।",
    );
  }

  if (value === "Out of the 36 ordered pairs, 18 have one odd and one even face, while the other 18 have equal parity.") {
    return pick(
      language,
      "36 क्रमित युग्मों में से 18 में एक फलक विषम और दूसरा सम है, जबकि बाकी 18 में दोनों फलकों की सम-विषम प्रकृति समान है।",
      "36 ਕ੍ਰਮਿਤ ਜੋੜਿਆਂ ਵਿੱਚੋਂ 18 ਵਿੱਚ ਇੱਕ ਪਾਸਾ ਟਾਂਕ ਅਤੇ ਦੂਜਾ ਜੋੜਾ ਹੈ, ਜਦਕਿ ਬਾਕੀ 18 ਵਿੱਚ ਦੋਵੇਂ ਪਾਸਿਆਂ ਦੀ ਸਮ-ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਇੱਕੋ ਹੈ।",
    );
  }

  if (value === "Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Same parity means odd-odd or even-even.") {
    return pick(
      language,
      "विषम फलक 1, 3, 5 हैं और सम फलक 2, 4, 6 हैं। समान सम-विषम प्रकृति के लिए दोनों परिणाम या तो विषम-विषम होंगे या सम-सम।",
      "ਟਾਂਕ ਪਾਸੇ 1, 3, 5 ਹਨ ਅਤੇ ਜੋੜੇ ਪਾਸੇ 2, 4, 6 ਹਨ। ਇੱਕੋ ਸਮ-ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਲਈ ਦੋਵੇਂ ਨਤੀਜੇ ਜਾਂ ਤਾਂ ਟਾਂਕ-ਟਾਂਕ ਹੋਣਗੇ ਜਾਂ ਜੋੜਾ-ਜੋੜਾ।",
    );
  }

  if (value === "Odd faces are 1, 3, 5 and even faces are 2, 4, 6. Different parity means odd-even or even-odd.") {
    return pick(
      language,
      "विषम फलक 1, 3, 5 हैं और सम फलक 2, 4, 6 हैं। अलग सम-विषम प्रकृति के लिए एक परिणाम विषम और दूसरा सम होगा।",
      "ਟਾਂਕ ਪਾਸੇ 1, 3, 5 ਹਨ ਅਤੇ ਜੋੜੇ ਪਾਸੇ 2, 4, 6 ਹਨ। ਵੱਖ ਸਮ-ਵਿਸਮ ਪ੍ਰਕਿਰਤੀ ਲਈ ਇੱਕ ਨਤੀਜਾ ਟਾਂਕ ਅਤੇ ਦੂਜਾ ਜੋੜਾ ਹੋਵੇਗਾ।",
    );
  }

  m = value.match(/^Required ordered pairs = 3 × 3 \+ 3 × 3 = 18\. ((?:So|Hence) the probability is .+)$/u);
  if (m) {
    const hiTail = m[1].replace(/^(?:So|Hence) the probability is/u, "अतः प्रायिकता");
    const paTail = m[1].replace(/^(?:So|Hence) the probability is/u, "ਇਸ ਲਈ ਸੰਭਾਵਨਾ");
    return pick(
      language,
      "आवश्यक क्रमित युग्म = 3 × 3 + 3 × 3 = 18। " + hiTail,
      "ਲੋੜੀਂਦੇ ਕ੍ਰਮਿਤ ਜੋੜੇ = 3 × 3 + 3 × 3 = 18। " + paTail,
    );
  }

  if (value === "Parity questions become quick once the odd and even face counts are separated.") {
    return pick(
      language,
      "विषम और सम फलकों की संख्या अलग कर लेने पर सम-विषम वाले प्रश्न जल्दी हल हो जाते हैं।",
      "ਟਾਂਕ ਅਤੇ ਜੋੜੇ ਪਾਸਿਆਂ ਦੀ ਗਿਣਤੀ ਵੱਖ ਕਰ ਲੈਣ ਨਾਲ ਸਮ-ਵਿਸਮ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਤੇਜ਼ੀ ਨਾਲ ਹੱਲ ਹੋ ਜਾਂਦੇ ਹਨ।",
    );
  }

  m = value.match(/^The required probability is (.+)\.$/u);
  if (m) return pick(language, `आवश्यक प्रायिकता ${m[1]} है।`, `ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ${m[1]} ਹੈ।`);

  m = value.match(/^The required probability is (.+) = (.+)\.$/u);
  if (m) return pick(language, `आवश्यक प्रायिकता ${m[1]} = ${m[2]} है।`, `ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ ${m[1]} = ${m[2]} ਹੈ।`);

  if (value === "The probability is valid because every admissible arrangement is treated as equally likely.") {
    return pick(
      language,
      "यह प्रायिकता सही है क्योंकि प्रत्येक मान्य व्यवस्था को समान रूप से संभावित माना गया है।",
      "ਇਹ ਸੰਭਾਵਨਾ ਸਹੀ ਹੈ ਕਿਉਂਕਿ ਹਰ ਮਨਜ਼ੂਰ ਵਿਉਂਤ ਨੂੰ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲਾ ਮੰਨਿਆ ਗਿਆ ਹੈ।",
    );
  }

  m = value.match(/^The probability is (.+)\.$/u);
  if (m) return pick(language, `प्रायिकता ${m[1]} है।`, `ਸੰਭਾਵਨਾ ${m[1]} ਹੈ।`);

  m = value.match(/^The probability is (.+) = (.+)\.$/u);
  if (m) return pick(language, `प्रायिकता ${m[1]} = ${m[2]} है।`, `ਸੰਭਾਵਨਾ ${m[1]} = ${m[2]} ਹੈ।`);

  m = value.match(/^The probability is (.+) = (\d+)\.$/u);
  if (m) return pick(language, `प्रायिकता ${m[1]} = ${m[2]} है।`, `ਸੰਭਾਵਨਾ ${m[1]} = ${m[2]} ਹੈ।`);

  m = value.match(/^The required number is (\d+)\.$/u);
  if (m) return pick(language, `आवश्यक संख्या ${m[1]} है।`, `ਲੋੜੀਂਦੀ ਗਿਣਤੀ ${m[1]} ਹੈ।`);

  m = value.match(/^Probability = favourable cases (.+) total cases = (.+)\.$/u);
  if (m) return pick(
    language,
    `प्रायिकता = अनुकूल स्थितियाँ ${m[1]} कुल स्थितियाँ = ${m[2]}।`,
    `ਸੰਭਾਵਨਾ = ਅਨੁਕੂਲ ਮਾਮਲੇ ${m[1]} ਕੁੱਲ ਮਾਮਲੇ = ${m[2]}।`,
  );

  m = value.match(/^Divide the numerator and denominator by (\d+): \((\d+) (.+) (\d+)\)\/\((\d+) (.+) (\d+)\) = (.+)\.$/u);
  if (m) return pick(
    language,
    `अंश और हर दोनों को ${m[1]} से भाग दें: (${m[2]} ${m[3]} ${m[4]})/(${m[5]} ${m[6]} ${m[7]}) = ${m[8]}।`,
    `ਅੰਸ਼ ਅਤੇ ਹਰ ਦੋਵਾਂ ਨੂੰ ${m[1]} ਨਾਲ ਭਾਗ ਦਿਓ: (${m[2]} ${m[3]} ${m[4]})/(${m[5]} ${m[6]} ${m[7]}) = ${m[8]}।`,
  );

  if (value === "For one random selection, use ¤0¤ = favourable cases ¤1¤ total equally likely cases.") {
    return pick(
      language,
      "एक यादृच्छिक चयन में ¤0¤ = अनुकूल स्थितियों की संख्या ¤1¤ कुल समान-संभावित स्थितियों की संख्या।",
      "ਇੱਕ ਬੇਤਰਤੀਬ ਚੋਣ ਵਿੱਚ ¤0¤ = ਅਨੁਕੂਲ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ¤1¤ ਕੁੱਲ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ।",
    );
  }

  m = value.match(/^There are (\d+) lottery tickets in all, and (\d+) are prize-winning\.$/u);
  if (m) return pick(language, `कुल ${m[1]} लॉटरी टिकट हैं, जिनमें से ${m[2]} इनाम वाले हैं।`, `ਕੁੱਲ ${m[1]} ਲਾਟਰੀ ਟਿਕਟ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${m[2]} ਇਨਾਮ ਵਾਲੇ ਹਨ।`);

  m = value.match(/^The batch has (\d+) bulbs, of which (\d+) are defective\.$/u);
  if (m) return pick(language, `बैच में कुल ${m[1]} बल्ब हैं, जिनमें से ${m[2]} खराब हैं।`, `ਬੈਚ ਵਿੱਚ ਕੁੱਲ ${m[1]} ਬਲਬ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${m[2]} ਖਰਾਬ ਹਨ।`);

  m = value.match(/^The shelf has (\d+) books, of which (\d+) are Mathematics books\.$/u);
  if (m) return pick(language, `शेल्फ पर कुल ${m[1]} किताबें हैं, जिनमें से ${m[2]} गणित की किताबें हैं।`, `ਸ਼ੈਲਫ਼ ਉੱਤੇ ਕੁੱਲ ${m[1]} ਕਿਤਾਬਾਂ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${m[2]} ਗਣਿਤ ਦੀਆਂ ਕਿਤਾਬਾਂ ਹਨ।`);

  m = value.match(/^The bag has (\d+) balls altogether\. (\d+) of them are (red|blue|green)\.$/u);
  if (m) {
    const c = colour(language, m[3]);
    return language === "hi"
      ? `बैग में कुल ${m[1]} गेंदें हैं। उनमें से ${m[2]} ${c} हैं।`
      : `ਬੈਗ ਵਿੱਚ ਕੁੱਲ ${m[1]} ਗੇਂਦਾਂ ਹਨ। ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ ${m[2]} ${c} ਹਨ।`;
  }

  m = value.match(/^The (bag|jar|box|pouch) (?:has|contains) (\d+) (balls|marbles|pens|coloured stones), of which (\d+) are (red|blue|green)\.$/iu);
  if (m) {
    const containerHi: Record<string, string> = { bag: "बैग", jar: "जार", box: "बॉक्स", pouch: "पाउच" };
    const containerPa: Record<string, string> = { bag: "ਬੈਗ", jar: "ਜਾਰ", box: "ਬਾਕਸ", pouch: "ਪਾਊਚ" };
    const object = objectForms(language, m[3]);
    const c = colour(language, m[5]);
    return language === "hi"
      ? `${containerHi[m[1].toLowerCase()]} में कुल ${m[2]} ${object.plural} हैं, जिनमें से ${m[4]} ${c} हैं।`
      : `${containerPa[m[1].toLowerCase()]} ਵਿੱਚ ਕੁੱਲ ${m[2]} ${object.plural} ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ ${m[4]} ${c} ਹਨ।`;
  }

  m = value.match(/^(Prize-winning tickets|Defective bulbs|Qualified candidates|Female employees|Male employees|Red balls|Approved applications|Successful applications|Red coloured stones) make up (.+) of all (\d+) (tickets|bulbs|candidates|employees|balls|applications|coloured stones)\.$/u);
  if (m) {
    const hiSubject = {
      "Prize-winning tickets": "इनाम वाले टिकट",
      "Defective bulbs": "खराब बल्ब",
      "Qualified candidates": "योग्य अभ्यर्थी",
      "Female employees": "महिला कर्मचारी",
      "Male employees": "पुरुष कर्मचारी",
      "Red balls": "लाल गेंदें",
      "Approved applications": "स्वीकृत आवेदन",
      "Successful applications": "सफल आवेदन",
      "Red coloured stones": "लाल रंगीन पत्थर",
    }[m[1]];
    const paSubject = {
      "Prize-winning tickets": "ਇਨਾਮ ਵਾਲੇ ਟਿਕਟ",
      "Defective bulbs": "ਖਰਾਬ ਬਲਬ",
      "Qualified candidates": "ਯੋਗ ਉਮੀਦਵਾਰ",
      "Female employees": "ਮਹਿਲਾ ਕਰਮਚਾਰੀ",
      "Male employees": "ਪੁਰਸ਼ ਕਰਮਚਾਰੀ",
      "Red balls": "ਲਾਲ ਗੇਂਦਾਂ",
      "Approved applications": "ਮਨਜ਼ੂਰ ਅਰਜ਼ੀਆਂ",
      "Successful applications": "ਸਫਲ ਅਰਜ਼ੀਆਂ",
      "Red coloured stones": "ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ",
    }[m[1]];
    const hiTotal = { tickets: "टिकटों", bulbs: "बल्बों", candidates: "अभ्यर्थियों", employees: "कर्मचारियों", balls: "गेंदों", applications: "आवेदनों", "coloured stones": "रंगीन पत्थरों" }[m[4]];
    const paTotal = { tickets: "ਟਿਕਟਾਂ", bulbs: "ਬਲਬਾਂ", candidates: "ਉਮੀਦਵਾਰਾਂ", employees: "ਕਰਮਚਾਰੀਆਂ", balls: "ਗੇਂਦਾਂ", applications: "ਅਰਜ਼ੀਆਂ", "coloured stones": "ਰੰਗੀਨ ਪੱਥਰਾਂ" }[m[4]];
    return language === "hi"
      ? `कुल ${m[3]} ${hiTotal} में ${hiSubject} का भाग ${m[2]} है।`
      : `ਕੁੱਲ ${m[3]} ${paTotal} ਵਿੱਚ ${paSubject} ਦਾ ਹਿੱਸਾ ${m[2]} ਹੈ।`;
  }

  m = value.match(/^(Female|Male) employees make up (.+) of all (\d+) employees\.$/u);
  if (m) {
    const hiSubject = m[1] === "Female" ? "महिला कर्मचारियों" : "पुरुष कर्मचारियों";
    const paSubject = m[1] === "Female" ? "ਮਹਿਲਾ ਕਰਮਚਾਰੀਆਂ" : "ਪੁਰਸ਼ ਕਰਮਚਾਰੀਆਂ";
    return language === "hi"
      ? `कुल ${m[3]} कर्मचारियों में ${hiSubject} का भाग ${m[2]} है।`
      : `ਕੁੱਲ ${m[3]} ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ${paSubject} ਦਾ ਹਿੱਸਾ ${m[2]} ਹੈ।`;
  }

  m = value.match(/^(Defective bulbs|Qualified candidates|Red coloured stones) make up (.+) of all (\d+) (bulbs|candidates|coloured stones)\.$/u);
  if (m) {
    const hiSubject: Record<string, string> = {
      "Defective bulbs": "खराब बल्ब",
      "Qualified candidates": "योग्य अभ्यर्थी",
      "Red coloured stones": "लाल रंगीन पत्थर",
    };
    const paSubject: Record<string, string> = {
      "Defective bulbs": "ਖਰਾਬ ਬਲਬ",
      "Qualified candidates": "ਯੋਗ ਉਮੀਦਵਾਰ",
      "Red coloured stones": "ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ",
    };
    const hiObj: Record<string, string> = { bulbs: "बल्बों", candidates: "अभ्यर्थियों", "coloured stones": "रंगीन पत्थरों" };
    const paObj: Record<string, string> = { bulbs: "ਬਲਬਾਂ", candidates: "ਉਮੀਦਵਾਰਾਂ", "coloured stones": "ਰੰਗੀਨ ਪੱਥਰਾਂ" };
    return language === "hi"
      ? `कुल ${m[3]} ${hiObj[m[4]]} में ${hiSubject[m[1]]} का भाग ${m[2]} है।`
      : `ਕੁੱਲ ${m[3]} ${paObj[m[4]]} ਵਿੱਚ ${paSubject[m[1]]} ਦਾ ਹਿੱਸਾ ${m[2]} ਹੈ।`;
  }

  if (value === "Use ¤0¤ = favourable cases ¤1¤ total cases and rearrange the relation to find the missing count.") {
    return pick(
      language,
      "¤0¤ = अनुकूल स्थितियाँ ¤1¤ कुल स्थितियाँ लिखें और अज्ञात संख्या ज्ञात करने के लिए संबंध को पुनर्व्यवस्थित करें।",
      "¤0¤ = ਅਨੁਕੂਲ ਮਾਮਲੇ ¤1¤ ਕੁੱਲ ਮਾਮਲੇ ਲਿਖੋ ਅਤੇ ਅਣਜਾਣ ਗਿਣਤੀ ਕੱਢਣ ਲਈ ਸੰਬੰਧ ਨੂੰ ਦੁਬਾਰਾ ਲਿਖੋ।",
    );
  }

  m = value.match(/^With (\d+) fair tosses there are (.+) equally likely H\/T sequences; count the sequences satisfying the stated head condition\.$/u);
  if (m) return pick(
    language,
    `${m[1]} निष्पक्ष उछालों में ${m[2]} समान-संभावित चित/पट क्रम होते हैं; दी गई चित संबंधी शर्त पूरी करने वाले क्रम गिनें।`,
    `${m[1]} ਨਿਰਪੱਖ ਉਛਾਲਾਂ ਵਿੱਚ ${m[2]} ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਚਿੱਤ/ਪੱਟ ਕ੍ਰਮ ਹੁੰਦੇ ਹਨ; ਦਿੱਤੀ ਚਿੱਤ ਵਾਲੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਕ੍ਰਮ ਗਿਣੋ।`,
  );

  m = value.match(/^(\d+) of the (\d+) H\/T sequences work\. So the probability is (.+?)(?: = (.+))?\.$/u);
  if (m) return pick(
    language,
    `${m[2]} चित/पट क्रमों में से ${m[1]} अनुकूल हैं। अतः प्रायिकता ${m[3]}${m[4] ? ` = ${m[4]}` : ""} है।`,
    `${m[2]} ਚਿੱਤ/ਪੱਟ ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ${m[1]} ਅਨੁਕੂਲ ਹਨ। ਇਸ ਲਈ ਸੰਭਾਵਨਾ ${m[3]}${m[4] ? ` = ${m[4]}` : ""} ਹੈ।`,
  );

  if (value === "Sequences with the same number of heads but in different positions are distinct outcomes.") {
    return pick(
      language,
      "चित की संख्या समान होने पर भी अलग-अलग स्थानों पर चित आने वाले क्रम अलग परिणाम माने जाते हैं।",
      "ਚਿੱਤਾਂ ਦੀ ਗਿਣਤੀ ਇੱਕੋ ਹੋਵੇ ਤਾਂ ਵੀ ਵੱਖ-ਵੱਖ ਸਥਾਨਾਂ ਤੇ ਚਿੱਤ ਆਉਣ ਵਾਲੇ ਕ੍ਰਮ ਵੱਖ ਨਤੀਜੇ ਮੰਨੇ ਜਾਂਦੇ ਹਨ।",
    );
  }

  m = value.match(/^Use the complement\. With (\d+) fair tosses there are (.+) equally likely H\/T sequences, and it is shorter to exclude the sequence with no head\.$/u);
  if (m) return pick(
    language,
    `पूरक घटना का उपयोग करें। ${m[1]} निष्पक्ष उछालों में ${m[2]} समान-संभावित चित/पट क्रम होते हैं; कोई चित न आने वाले क्रम को हटाना आसान है।`,
    `ਪੂਰਕ ਘਟਨਾ ਵਰਤੋ। ${m[1]} ਨਿਰਪੱਖ ਉਛਾਲਾਂ ਵਿੱਚ ${m[2]} ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਚਿੱਤ/ਪੱਟ ਕ੍ਰਮ ਹੁੰਦੇ ਹਨ; ਕੋਈ ਚਿੱਤ ਨਾ ਆਉਣ ਵਾਲੇ ਕ੍ਰਮ ਨੂੰ ਹਟਾਉਣਾ ਆਸਾਨ ਹੈ।`,
  );

  m = value.match(/^Out of (\d+) sequences, (\d+) works\. So the probability is (.+)\.$/u);
  if (m) return pick(
    language,
    `${m[1]} क्रमों में से ${m[2]} अनुकूल है। अतः प्रायिकता ${m[3]} है।`,
    `${m[1]} ਕ੍ਰਮਾਂ ਵਿੱਚੋਂ ${m[2]} ਅਨੁਕੂਲ ਹੈ। ਇਸ ਲਈ ਸੰਭਾਵਨਾ ${m[3]} ਹੈ।`,
  );

  if (value === "For exactly one head, the favourable sequences are HTT, THT, TTH.") {
    return pick(
      language,
      "ठीक एक चित के लिए अनुकूल क्रम चित-पट-पट, पट-चित-पट और पट-पट-चित हैं।",
      "ਠੀਕ ਇੱਕ ਚਿੱਤ ਲਈ ਅਨੁਕੂਲ ਕ੍ਰਮ ਚਿੱਤ-ਪੱਟ-ਪੱਟ, ਪੱਟ-ਚਿੱਤ-ਪੱਟ ਅਤੇ ਪੱਟ-ਪੱਟ-ਚਿੱਤ ਹਨ।",
    );
  }

  if (value === "The only sequence with no head is TTT.") {
    return pick(language, "कोई चित न आने वाला एकमात्र क्रम पट-पट-पट है।", "ਕੋਈ ਚਿੱਤ ਨਾ ਆਉਣ ਵਾਲਾ ਇਕੱਲਾ ਕ੍ਰਮ ਪੱਟ-ਪੱਟ-ਪੱਟ ਹੈ।");
  }

  if (value === "No heads means every toss must be a tail. Only TTT works.") {
    return pick(
      language,
      "कोई चित न आने का अर्थ है कि हर उछाल पर पट आए। इसलिए केवल पट-पट-पट क्रम अनुकूल है।",
      "ਕੋਈ ਚਿੱਤ ਨਾ ਆਉਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ਹਰ ਉਛਾਲ ਤੇ ਪੱਟ ਆਵੇ। ਇਸ ਲਈ ਕੇਵਲ ਪੱਟ-ਪੱਟ-ਪੱਟ ਕ੍ਰਮ ਅਨੁਕੂਲ ਹੈ।",
    );
  }

  m = value.match(/^A fair die has six equally likely faces; list the faces satisfying the condition and divide their count by (\d+)\.$/u);
  if (m) return pick(
    language,
    `एक निष्पक्ष पासे के छह फलक समान-संभावित होते हैं। शर्त पूरी करने वाले फलक गिनें और उनकी संख्या को ${m[1]} से भाग दें।`,
    `ਇੱਕ ਨਿਰਪੱਖ ਪਾਸੇ ਦੇ ਛੇ ਪਾਸੇ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਹੁੰਦੇ ਹਨ। ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਪਾਸੇ ਗਿਣੋ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ${m[1]} ਨਾਲ ਭਾਗ ਦਿਓ।`,
  );

  m = value.match(/^The favourable faces are (.+); there are (\d+)\.$/u);
  if (m) return pick(
    language,
    `अनुकूल फलक ${m[1]} हैं; इनकी संख्या ${m[2]} है।`,
    `ਅਨੁਕੂਲ ਪਾਸੇ ${m[1]} ਹਨ; ਇਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ${m[2]} ਹੈ।`,
  );

  m = value.match(/^Treat the outcomes as ordered pairs\. Two fair dice produce (\d+) (.+) (\d+) = (\d+) equally likely pairs \(first die, second die\)\.$/u);
  if (m) return pick(
    language,
    `परिणामों को क्रमित युग्म मानें। दो निष्पक्ष पासों के ${m[1]} ${m[2]} ${m[3]} = ${m[4]} समान-संभावित क्रमित युग्म (पहला पासा, दूसरा पासा) होते हैं।`,
    `ਨਤੀਜਿਆਂ ਨੂੰ ਕ੍ਰਮਿਤ ਜੋੜੇ ਮੰਨੋ। ਦੋ ਨਿਰਪੱਖ ਪਾਸਿਆਂ ਦੇ ${m[1]} ${m[2]} ${m[3]} = ${m[4]} ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਕ੍ਰਮਿਤ ਜੋੜੇ (ਪਹਿਲਾ ਪਾਸਾ, ਦੂਜਾ ਪਾਸਾ) ਹੁੰਦੇ ਹਨ।`,
  );

  if (value === "For distinguishable dice, (a,b) and (b,a) are different outcomes unless a = b.") {
    return pick(
      language,
      "अलग पहचाने जाने वाले पासों में (a,b) और (b,a) अलग परिणाम हैं; केवल a = b होने पर वे समान होते हैं।",
      "ਵੱਖ ਪਛਾਣਯੋਗ ਪਾਸਿਆਂ ਵਿੱਚ (a,b) ਅਤੇ (b,a) ਵੱਖ ਨਤੀਜੇ ਹਨ; ਕੇਵਲ a = b ਹੋਣ ਤੇ ਉਹ ਇੱਕੋ ਹੁੰਦੇ ਹਨ।",
    );
  }

  if (value === "The spinner sectors are equal, so probability is favourable sectors ¤0¤ total sectors.") {
    return pick(
      language,
      "स्पिनर के सभी खंड समान हैं, इसलिए प्रायिकता = अनुकूल खंडों की संख्या ¤0¤ कुल खंडों की संख्या।",
      "ਸਪਿਨਰ ਦੇ ਸਾਰੇ ਖੰਡ ਬਰਾਬਰ ਹਨ, ਇਸ ਲਈ ਸੰਭਾਵਨਾ = ਅਨੁਕੂਲ ਖੰਡਾਂ ਦੀ ਗਿਣਤੀ ¤0¤ ਕੁੱਲ ਖੰਡਾਂ ਦੀ ਗਿਣਤੀ।",
    );
  }

  m = value.match(/^(\d+) of the (\d+) equal sectors are shaded\.$/u);
  if (m) return pick(language, `${m[2]} समान खंडों में से ${m[1]} छायांकित हैं।`, `${m[2]} ਬਰਾਬਰ ਖੰਡਾਂ ਵਿੱਚੋਂ ${m[1]} ਛਾਇਆ ਕੀਤੇ ਹਨ।`);

  m = value.match(/^The marked part is (.+) of all (\d+) sectors\.$/u);
  if (m) return pick(language, `कुल ${m[2]} खंडों का चिह्नित भाग ${m[1]} है।`, `ਕੁੱਲ ${m[2]} ਖੰਡਾਂ ਦਾ ਨਿਸ਼ਾਨਿਤ ਹਿੱਸਾ ${m[1]} ਹੈ।`);

  if (value === "Every integer in the stated range is equally likely; list or count those satisfying the number property.") {
    return pick(
      language,
      "दी गई सीमा का प्रत्येक पूर्णांक समान-संभावित है; संख्या की शर्त पूरी करने वाले पूर्णांक गिनें।",
      "ਦਿੱਤੀ ਸੀਮਾ ਦਾ ਹਰ ਪੂਰਨ ਅੰਕ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲਾ ਹੈ; ਸੰਖਿਆ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਪੂਰਨ ਅੰਕ ਗਿਣੋ।",
    );
  }

  m = value.match(/^Use the standard (\d+)-card deck counts, and count any card belonging to two required groups only once\.$/u);
  if (m) return pick(
    language,
    `${m[1]} पत्तों की मानक ताश-गड्डी की ज्ञात संख्याओं का उपयोग करें और दोनों आवश्यक समूहों में आने वाले पत्ते को केवल एक बार गिनें।`,
    `${m[1]} ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਤਾਸ਼-ਗੱਡੀ ਦੀਆਂ ਜਾਣੀਆਂ ਗਿਣਤੀਆਂ ਵਰਤੋ ਅਤੇ ਦੋਵੇਂ ਲੋੜੀਂਦੇ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਪੱਤੇ ਨੂੰ ਕੇਵਲ ਇੱਕ ਵਾਰ ਗਿਣੋ।`,
  );

  m = value.match(/^Each suit has a jack, queen and king, so there are (\d+) (.+) (\d+) = (\d+) face cards\.$/u);
  if (m) return pick(
    language,
    `हर सूट में एक गुलाम, एक बेगम और एक बादशाह होता है; इसलिए फेस कार्डों की कुल संख्या ${m[1]} ${m[2]} ${m[3]} = ${m[4]} है।`,
    `ਹਰ ਸੂਟ ਵਿੱਚ ਇੱਕ ਗੁਲਾਮ, ਇੱਕ ਬੇਗਮ ਅਤੇ ਇੱਕ ਬਾਦਸ਼ਾਹ ਹੁੰਦਾ ਹੈ; ਇਸ ਲਈ ਫੇਸ ਕਾਰਡਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ${m[1]} ${m[2]} ${m[3]} = ${m[4]} ਹੈ।`,
  );

  if (value === "The card common to the rank and suit groups must be subtracted once after the two counts are added.") {
    return pick(
      language,
      "रैंक और सूट दोनों समूहों में आने वाले साझा पत्ते को दोनों संख्याएँ जोड़ने के बाद एक बार घटाना होगा।",
      "ਰੈਂਕ ਅਤੇ ਸੂਟ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਸਾਂਝੇ ਪੱਤੇ ਨੂੰ ਦੋਵੇਂ ਗਿਣਤੀਆਂ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਇੱਕ ਵਾਰ ਘਟਾਉਣਾ ਪਵੇਗਾ।",
    );
  }

  if (value === "Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.") {
    return pick(
      language,
      "दी गई शर्त से अनुमत पत्तों को ही नया कुल समूह मानें; उस सीमित समूह से बाहर के पत्ते अब संभव नहीं हैं।",
      "ਦਿੱਤੀ ਸ਼ਰਤ ਨਾਲ ਮਨਜ਼ੂਰ ਪੱਤਿਆਂ ਨੂੰ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਮੰਨੋ; ਉਸ ਸੀਮਿਤ ਸਮੂਹ ਤੋਂ ਬਾਹਰ ਦੇ ਪੱਤੇ ਹੁਣ ਸੰਭਵ ਨਹੀਂ ਹਨ।",
    );
  }

  m = value.match(/^Knowing that the card is a face card reduces the sample space to the (\d+) jacks, queens and kings\.$/u);
  if (m) return pick(
    language,
    `पत्ता फेस कार्ड है—इस शर्त के बाद कुल समूह केवल ${m[1]} गुलाम, बेगम और बादशाह पत्तों तक सीमित हो जाता है।`,
    `ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਹੈ—ਇਸ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਸਮੂਹ ਕੇਵਲ ${m[1]} ਗੁਲਾਮ, ਬੇਗਮ ਅਤੇ ਬਾਦਸ਼ਾਹ ਪੱਤਿਆਂ ਤੱਕ ਸੀਮਿਤ ਹੋ ਜਾਂਦਾ ਹੈ।`,
  );

  m = value.match(/^Exactly (\d+) of these (\d+) face cards are kings\.$/u);
  if (m) return pick(language, `इन ${m[2]} फेस कार्डों में ठीक ${m[1]} बादशाह हैं।`, `ਇਨ੍ਹਾਂ ${m[2]} ਫੇਸ ਕਾਰਡਾਂ ਵਿੱਚ ਠੀਕ ${m[1]} ਬਾਦਸ਼ਾਹ ਹਨ।`);

  m = value.match(/^Since the (pens|balls|marbles|coloured stones) are selected together, order does not matter\. Use (.+) = n!\/\[r!\(n-r\)!\], then use probability = favourable selections (.+) total selections\.$/u);
  if (m) {
    const o = objectForms(language, m[1]);
    return language === "hi"
      ? `${o.plural} एक साथ चुने जाते हैं, इसलिए क्रम महत्वपूर्ण नहीं है। संचय ${m[2]} = n!/[r!(n-r)!] का उपयोग करें; फिर प्रायिकता = अनुकूल चयन ${m[3]} कुल चयन।`
      : `${o.plural} ਇੱਕੋ ਵੇਲੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੈ। ਸੰਚਯ ${m[2]} = n!/[r!(n-r)!] ਵਰਤੋ; ਫਿਰ ਸੰਭਾਵਨਾ = ਅਨੁਕੂਲ ਚੋਣਾਂ ${m[3]} ਕੁੱਲ ਚੋਣਾਂ।`;
  }

  m = value.match(/^Total possible selections of (pens|balls|marbles|coloured stones) = (.+)\.$/u);
  if (m) {
    const o = objectForms(language, m[1]);
    return language === "hi" ? `${o.oblique} के कुल संभावित चयन = ${m[2]}।` : `${o.oblique} ਦੀਆਂ ਕੁੱਲ ਸੰਭਵ ਚੋਣਾਂ = ${m[2]}।`;
  }

  m = value.match(/^Ways to choose the (red|blue) (balls|pens|marbles|coloured stones): (.+) = (\d+)\.$/u);
  if (m) {
    const o = objectForms(language, m[2]);
    const c = colour(language, m[1]);
    return language === "hi" ? `${c} ${o.oblique} को चुनने के तरीके: ${m[3]} = ${m[4]}।` : `${c} ${o.oblique} ਨੂੰ ਚੁਣਨ ਦੇ ਤਰੀਕੇ: ${m[3]} = ${m[4]}।`;
  }

  m = value.match(/^Favourable selections of (pens|balls|marbles|coloured stones) = (.+)\.$/u);
  if (m) {
    const o = objectForms(language, m[1]);
    return language === "hi" ? `${o.oblique} के अनुकूल चयन = ${m[2]}।` : `${o.oblique} ਦੀਆਂ ਅਨੁਕੂਲ ਚੋਣਾਂ = ${m[2]}।`;
  }

  m = value.match(/^(.+) is used because selecting the same (pens|balls|marbles|coloured stones) in a different order does not create a new selection\.$/u);
  if (m) {
    const o = objectForms(language, m[2]);
    return language === "hi"
      ? `${m[1]} का उपयोग इसलिए किया गया है क्योंकि उन्हीं ${o.oblique} को अलग क्रम में चुनने से नया चयन नहीं बनता।`
      : `${m[1]} ਇਸ ਲਈ ਵਰਤਿਆ ਗਿਆ ਹੈ ਕਿਉਂਕਿ ਉਹੀ ${o.oblique} ਨੂੰ ਵੱਖ ਕ੍ਰਮ ਵਿੱਚ ਚੁਣਨ ਨਾਲ ਨਵੀਂ ਚੋਣ ਨਹੀਂ ਬਣਦੀ।`;
  }

  if (value === "Follow the two selections in order. Replacement restores the original contents, so the second-stage probability uses the same denominator.") {
    return pick(
      language,
      "दोनों चयनों को क्रम से देखें। वस्तु वापस रखने पर मूल संरचना फिर से बन जाती है, इसलिए दूसरे चयन में भी वही हर रहता है।",
      "ਦੋਵੇਂ ਚੋਣਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਲਵੋ। ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਨਾਲ ਮੂਲ ਬਣਤਰ ਮੁੜ ਬਣ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਦੂਜੀ ਚੋਣ ਵਿੱਚ ਵੀ ਉਹੀ ਹਰ ਰਹਿੰਦਾ ਹੈ।",
    );
  }

  if (value === "Replacement makes the two stage probabilities use the original composition each time.") {
    return pick(
      language,
      "वस्तु वापस रखने के कारण दोनों चरणों में प्रायिकता मूल संरचना के आधार पर ही निकाली जाती है।",
      "ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਕਾਰਨ ਦੋਵੇਂ ਪੜਾਵਾਂ ਵਿੱਚ ਸੰਭਾਵਨਾ ਮੂਲ ਬਣਤਰ ਦੇ ਆਧਾਰ ਤੇ ਹੀ ਕੱਢੀ ਜਾਂਦੀ ਹੈ।",
    );
  }

  if (value === "Follow the selections in order and multiply the stage probabilities. Without replacement, update both the remaining favourable count and the total before the second selection.") {
    return pick(
      language,
      "चयनों को क्रम से लें और दोनों चरणों की प्रायिकताओं को गुणा करें। बिना वापस रखे चयन में दूसरे चयन से पहले अनुकूल वस्तुओं की बची संख्या और कुल संख्या दोनों बदलें।",
      "ਚੋਣਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਲਵੋ ਅਤੇ ਦੋਵੇਂ ਪੜਾਵਾਂ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ। ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਅਨੁਕੂਲ ਵਸਤੂਆਂ ਦੀ ਬਚੀ ਗਿਣਤੀ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਦੋਵੇਂ ਬਦਲੋ।",
    );
  }

  if (value === "Because the first object is not returned, the second probability is based on one fewer object.") {
    return pick(
      language,
      "पहली वस्तु वापस नहीं रखी जाती, इसलिए दूसरी प्रायिकता एक वस्तु कम होने के बाद की कुल संख्या पर आधारित है।",
      "ਪਹਿਲੀ ਵਸਤੂ ਵਾਪਸ ਨਹੀਂ ਰੱਖੀ ਜਾਂਦੀ, ਇਸ ਲਈ ਦੂਜੀ ਸੰਭਾਵਨਾ ਇੱਕ ਵਸਤੂ ਘੱਟ ਹੋਣ ਤੋਂ ਬਾਅਦ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਤੇ ਆਧਾਰਿਤ ਹੈ।",
    );
  }

  m = value.match(/^On the first selection, (.+) = (.+)\.$/u);
  if (m) return pick(language, `पहले चयन में ${m[1]} = ${m[2]}।`, `ਪਹਿਲੀ ਚੋਣ ਵਿੱਚ ${m[1]} = ${m[2]}।`);

  m = value.match(/^After one red (pen|ball|marble|coloured stone) is removed, (\d+) red (pens|balls|marbles|coloured stones) remain among (\d+) (pens|balls|marbles|coloured stones)\.$/u);
  if (m) {
    const singular = objectForms(language, m[1]);
    const plural = objectForms(language, m[3]);
    return language === "hi"
      ? `एक लाल ${singular.singular} निकालने के बाद कुल ${m[4]} ${plural.oblique} में ${m[2]} लाल ${plural.plural} बचते हैं।`
      : `ਇੱਕ ਲਾਲ ${singular.singular} ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ${m[4]} ${plural.oblique} ਵਿੱਚ ${m[2]} ਲਾਲ ${plural.plural} ਬਚਦੇ ਹਨ।`;
  }

  m = value.match(/^The first (marble|stone|ball|pen) is replaced, so the container again has (\d+) red and (\d+) blue (marbles|coloured stones|balls|pens) before the second selection\.$/u);
  if (m) {
    const first = objectForms(language, m[1]);
    const o = objectForms(language, m[4]);
    const feminine = m[1] === "ball";
    return language === "hi"
      ? `${feminine ? "पहली" : "पहला"} ${first.singular} वापस ${feminine ? "रख दी जाती है" : "रख दिया जाता है"}, इसलिए दूसरे चयन से पहले उसी पात्र में फिर ${m[2]} लाल और ${m[3]} नीले ${o.plural} होते हैं।`
      : `${feminine ? "ਪਹਿਲੀ" : "ਪਹਿਲਾ"} ${first.singular} ਵਾਪਸ ${feminine ? "ਰੱਖ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ" : "ਰੱਖ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ"}, ਇਸ ਲਈ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਉਸੇ ਪਾਤਰ ਵਿੱਚ ਫਿਰ ${m[2]} ਲਾਲ ਅਤੇ ${m[3]} ਨੀਲੇ ${o.plural} ਹੁੰਦੇ ਹਨ।`;
  }

  if (value === "The order is fixed: a red marble must occur first and a blue marble second.") {
    return pick(language, "क्रम निश्चित है: पहले लाल कंचा और फिर नीला कंचा आना चाहिए।", "ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਹੈ: ਪਹਿਲਾਂ ਲਾਲ ਕੰਚਾ ਅਤੇ ਫਿਰ ਨੀਲਾ ਕੰਚਾ ਆਉਣਾ ਚਾਹੀਦਾ ਹੈ।");
  }

  m = value.match(/^The (pens|balls|marbles|coloured stones) can have the same colour in two mutually exclusive orders: red-red or blue-blue\. Calculate both probabilities and add them\.$/u);
  if (m) {
    const o = objectForms(language, m[1]);
    return language === "hi"
      ? `${o.plural} का रंग समान होने के दो परस्पर अपवर्ती क्रम हैं: लाल-लाल या नीला-नीला। दोनों की प्रायिकताएँ निकालकर जोड़ें।`
      : `${o.plural} ਦਾ ਰੰਗ ਇੱਕੋ ਹੋਣ ਦੇ ਦੋ ਪਰਸਪਰ ਅਲੱਗ ਕ੍ਰਮ ਹਨ: ਲਾਲ-ਲਾਲ ਜਾਂ ਨੀਲਾ-ਨੀਲਾ। ਦੋਵਾਂ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਕੱਢ ਕੇ ਜੋੜੋ।`;
  }

  m = value.match(/^Different colours can occur in two mutually exclusive orders for the (pens|balls|marbles|coloured stones): red-blue or blue-red\. Calculate both and add them\.$/u);
  if (m) {
    const o = objectForms(language, m[1]);
    return language === "hi"
      ? `${o.plural} के अलग रंग आने के दो परस्पर अपवर्ती क्रम हैं: लाल-नीला या नीला-लाल। दोनों प्रायिकताएँ निकालकर जोड़ें।`
      : `${o.plural} ਦੇ ਵੱਖ ਰੰਗ ਆਉਣ ਦੇ ਦੋ ਪਰਸਪਰ ਅਲੱਗ ਕ੍ਰਮ ਹਨ: ਲਾਲ-ਨੀਲਾ ਜਾਂ ਨੀਲਾ-ਲਾਲ। ਦੋਵੇਂ ਸੰਭਾਵਨਾਵਾਂ ਕੱਢ ਕੇ ਜੋੜੋ।`;
  }

  if (value === "Red-red and blue-blue cannot occur together, so their probabilities are added.") {
    return pick(language, "लाल-लाल और नीला-नीला एक साथ नहीं हो सकते, इसलिए उनकी प्रायिकताएँ जोड़ी जाती हैं।", "ਲਾਲ-ਲਾਲ ਅਤੇ ਨੀਲਾ-ਨੀਲਾ ਇਕੱਠੇ ਨਹੀਂ ਹੋ ਸਕਦੇ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।");
  }

  if (value === "Both possible colour orders must be included because the draws are successive.") {
    return pick(language, "चयन क्रमिक हैं, इसलिए रंगों के दोनों संभावित क्रम शामिल करने होंगे।", "ਚੋਣਾਂ ਲਗਾਤਾਰ ਹਨ, ਇਸ ਲਈ ਰੰਗਾਂ ਦੇ ਦੋਵੇਂ ਸੰਭਵ ਕ੍ਰਮ ਸ਼ਾਮਲ ਕਰਨੇ ਪੈਣਗੇ।");
  }

  m = value.match(/^(\d+) (prize-winning|defective|qualified|female|red|approved|successful) (tickets|bulbs|candidates|employees|applications|balls|people) represent (.+) of the full group\.$/u);
  if (m) {
    const hiDescription = { "prize-winning": "इनाम वाले", defective: "खराब", qualified: "योग्य", female: "महिला", red: "लाल", approved: "स्वीकृत", successful: "सफल" }[m[2]];
    const paDescription = { "prize-winning": "ਇਨਾਮ ਵਾਲੇ", defective: "ਖਰਾਬ", qualified: "ਯੋਗ", female: "ਮਹਿਲਾ", red: "ਲਾਲ", approved: "ਮਨਜ਼ੂਰ", successful: "ਸਫਲ" }[m[2]];
    const hiNoun = { tickets: "टिकट", bulbs: "बल्ब", candidates: "अभ्यर्थी", employees: "कर्मचारी", applications: "आवेदन", balls: "गेंदें", people: "लोग" }[m[3]];
    const paNoun = { tickets: "ਟਿਕਟ", bulbs: "ਬਲਬ", candidates: "ਉਮੀਦਵਾਰ", employees: "ਕਰਮਚਾਰੀ", applications: "ਅਰਜ਼ੀਆਂ", balls: "ਗੇਂਦਾਂ", people: "ਲੋਕ" }[m[3]];
    return language === "hi"
      ? `${m[1]} ${hiDescription} ${hiNoun} पूरे समूह का ${m[4]} भाग हैं।`
      : `${m[1]} ${paDescription} ${paNoun} ਪੂਰੇ ਸਮੂਹ ਦਾ ${m[4]} ਹਿੱਸਾ ਹਨ।`;
  }

  m = value.match(/^Total (tickets|bulbs|candidates|employees|applications|balls|people) = (.+)\.$/u);
  if (m) {
    const hiNoun = { tickets: "टिकट", bulbs: "बल्ब", candidates: "अभ्यर्थी", employees: "कर्मचारी", applications: "आवेदन", balls: "गेंदें", people: "लोग" }[m[1]];
    const paNoun = { tickets: "ਟਿਕਟ", bulbs: "ਬਲਬ", candidates: "ਉਮੀਦਵਾਰ", employees: "ਕਰਮਚਾਰੀ", applications: "ਅਰਜ਼ੀਆਂ", balls: "ਗੇਂਦਾਂ", people: "ਲੋਕ" }[m[1]];
    return language === "hi" ? `कुल ${hiNoun} = ${m[2]}।` : `ਕੁੱਲ ${paNoun} = ${m[2]}।`;
  }

  if (value === "Use the complement: at least one red ball fails only when both selected balls are blue.") {
    return pick(language, "पूरक घटना लें: कम-से-कम एक लाल गेंद न मिलने की एकमात्र स्थिति दोनों गेंदों का नीला होना है।", "ਪੂਰਕ ਘਟਨਾ ਲਵੋ: ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਨਾ ਮਿਲਣ ਦੀ ਇਕੱਲੀ ਸਥਿਤੀ ਦੋਵੇਂ ਗੇਂਦਾਂ ਦਾ ਨੀਲਾ ਹੋਣਾ ਹੈ।");
  }

  if (value === "First restrict the sample space to the outcomes allowed by the given condition, then use favourable cases ¤0¤ restricted total.") {
    return pick(
      language,
      "पहले दी गई शर्त के अनुसार कुल संभावित परिणामों को सीमित करें। फिर प्रायिकता = अनुकूल स्थितियाँ ¤0¤ सीमित कुल स्थितियाँ लें।",
      "ਪਹਿਲਾਂ ਦਿੱਤੀ ਸ਼ਰਤ ਅਨੁਸਾਰ ਕੁੱਲ ਸੰਭਵ ਨਤੀਜਿਆਂ ਨੂੰ ਸੀਮਿਤ ਕਰੋ। ਫਿਰ ਸੰਭਾਵਨਾ = ਅਨੁਕੂਲ ਮਾਮਲੇ ¤0¤ ਸੀਮਿਤ ਕੁੱਲ ਮਾਮਲੇ ਲਵੋ।",
    );
  }

  m = value.match(/^The given condition restricts the sample space to the (\d+) people who satisfy the first condition\.$/u);
  if (m) return pick(language, `दी गई शर्त के बाद कुल समूह केवल उन ${m[1]} लोगों तक सीमित है जो पहली शर्त पूरी करते हैं।`, `ਦਿੱਤੀ ਸ਼ਰਤ ਤੋਂ ਬਾਅਦ ਕੁੱਲ ਸਮੂਹ ਕੇਵਲ ਉਹਨਾਂ ${m[1]} ਲੋਕਾਂ ਤੱਕ ਸੀਮਿਤ ਹੈ ਜੋ ਪਹਿਲੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ।`);

  m = value.match(/^(\d+) of these (\d+) people also satisfy the second condition\.$/u);
  if (m) return pick(language, `इन ${m[2]} लोगों में से ${m[1]} दूसरी शर्त भी पूरी करते हैं।`, `ਇਨ੍ਹਾਂ ${m[2]} ਲੋਕਾਂ ਵਿੱਚੋਂ ${m[1]} ਦੂਜੀ ਸ਼ਰਤ ਵੀ ਪੂਰੀ ਕਰਦੇ ਹਨ।`);

  if (value === "The group named in the condition becomes the new sample space and therefore the new denominator.") {
    return pick(language, "शर्त में दिया गया समूह ही नया कुल समूह बन जाता है; इसलिए वही नया हर होगा।", "ਸ਼ਰਤ ਵਿੱਚ ਦਿੱਤਾ ਸਮੂਹ ਹੀ ਨਵਾਂ ਕੁੱਲ ਸਮੂਹ ਬਣ ਜਾਂਦਾ ਹੈ; ਇਸ ਲਈ ਉਹੀ ਨਵਾਂ ਹਰ ਹੋਵੇਗਾ।");
  }

  if (value === "The condition tells us that the first selected ball was red and was not replaced.") {
    return pick(language, "शर्त से ज्ञात है कि पहली चुनी गई गेंद लाल थी और उसे वापस नहीं रखा गया।", "ਸ਼ਰਤ ਤੋਂ ਪਤਾ ਹੈ ਕਿ ਪਹਿਲੀ ਚੁਣੀ ਗੇਂਦ ਲਾਲ ਸੀ ਅਤੇ ਉਸ ਨੂੰ ਵਾਪਸ ਨਹੀਂ ਰੱਖਿਆ ਗਿਆ।");
  }

  m = value.match(/^(\d+) red balls remain among (\d+) balls for the second selection\.$/u);
  if (m) return pick(language, `दूसरे चयन के लिए कुल ${m[2]} गेंदों में ${m[1]} लाल गेंदें बची हैं।`, `ਦੂਜੀ ਚੋਣ ਲਈ ਕੁੱਲ ${m[2]} ਗੇਂਦਾਂ ਵਿੱਚ ${m[1]} ਲਾਲ ਗੇਂਦਾਂ ਬਚੀਆਂ ਹਨ।`);

  if (value === "After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.") {
    return pick(language, "पहले चयन की जानकारी मिलने के बाद दूसरा चयन केवल बची वस्तुओं में से होता है; इसलिए दोनों बची संख्याओं का उपयोग करें।", "ਪਹਿਲੀ ਚੋਣ ਦੀ ਜਾਣਕਾਰੀ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਦੂਜੀ ਚੋਣ ਕੇਵਲ ਬਚੀਆਂ ਵਸਤੂਆਂ ਵਿੱਚੋਂ ਹੁੰਦੀ ਹੈ; ਇਸ ਲਈ ਦੋਵੇਂ ਬਚੀਆਂ ਗਿਣਤੀਆਂ ਵਰਤੋ।");
  }

  m = value.match(/^Because the selection is made only from the restricted group, let the required number be x\. Then x\/(\d+) = (.+)\.$/u);
  if (m) return pick(language, `चयन केवल सीमित समूह में से है। आवश्यक संख्या x मानें; तब x/${m[1]} = ${m[2]}।`, `ਚੋਣ ਕੇਵਲ ਸੀਮਿਤ ਸਮੂਹ ਵਿੱਚੋਂ ਹੈ। ਲੋੜੀਂਦੀ ਗਿਣਤੀ x ਮੰਨੋ; ਤਦ x/${m[1]} = ${m[2]}।`);

  m = value.match(/^(\d+) people satisfy the required condition\.$/u);
  if (m) return pick(language, `${m[1]} लोग आवश्यक शर्त पूरी करते हैं।`, `${m[1]} ਲੋਕ ਲੋੜੀਂਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ।`);

  if (value === "The shortlisted group is the complete sample space here, so its size is the denominator of the probability relation.") {
    return pick(language, "यहाँ शॉर्टलिस्ट समूह ही पूरा कुल समूह है, इसलिए उसकी संख्या प्रायिकता संबंध का हर है।", "ਇੱਥੇ ਸ਼ਾਰਟਲਿਸਟ ਸਮੂਹ ਹੀ ਪੂਰਾ ਕੁੱਲ ਸਮੂਹ ਹੈ, ਇਸ ਲਈ ਉਸ ਦੀ ਗਿਣਤੀ ਸੰਭਾਵਨਾ ਸੰਬੰਧ ਦਾ ਹਰ ਹੈ।");
  }

  if (value === "A committee is an unordered selection. Use ¤0¤ = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.") {
    return pick(
      language,
      "समिति का चयन क्रमरहित होता है। इसलिए ¤0¤ = n!/[r!(n-r)!] का उपयोग करें। यदि प्रायिकता पूछी गई है, तो आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें।",
      "ਕਮੇਟੀ ਦੀ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ। ਇਸ ਲਈ ¤0¤ = n!/[r!(n-r)!] ਵਰਤੋ। ਜੇ ਸੰਭਾਵਨਾ ਪੁੱਛੀ ਗਈ ਹੈ, ਤਾਂ ਲੋੜੀਂਦੀਆਂ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਕੁੱਲ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
    );
  }

  if (value === "A committee is an unordered selection. Choose the required women and men separately with combinations, then multiply the independent choices.") {
    return pick(
      language,
      "समिति में क्रम महत्वपूर्ण नहीं होता। आवश्यक महिलाओं और पुरुषों को अलग-अलग संचय से चुनें और दोनों चयन के तरीकों को गुणा करें।",
      "ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ। ਲੋੜੀਂਦੀਆਂ ਔਰਤਾਂ ਅਤੇ ਮਰਦਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਸੰਚਯ ਨਾਲ ਚੁਣੋ ਅਤੇ ਦੋਵਾਂ ਚੋਣਾਂ ਦੇ ਤਰੀਕਿਆਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।",
    );
  }

  m = value.match(/^Choose (\d+) (man|men|woman|women) from (\d+): (.+)\.$/u);
  if (m) {
    const nounHi = m[2].startsWith("w") ? "महिलाओं" : "पुरुषों";
    const nounPa = m[2].startsWith("w") ? "ਔਰਤਾਂ" : "ਮਰਦਾਂ";
    return language === "hi"
      ? `${m[3]} ${nounHi} में से ${m[1]} चुनने के तरीके: ${m[4]}।`
      : `${m[3]} ${nounPa} ਵਿੱਚੋਂ ${m[1]} ਚੁਣਨ ਦੇ ਤਰੀਕੇ: ${m[4]}।`;
  }

  if (value === "Combinations count each committee once because changing the order of the same members does not create a different committee.") {
    return pick(language, "संचय प्रत्येक समिति को केवल एक बार गिनता है, क्योंकि उन्हीं सदस्यों का क्रम बदलने से नई समिति नहीं बनती।", "ਸੰਚਯ ਹਰ ਕਮੇਟੀ ਨੂੰ ਕੇਵਲ ਇੱਕ ਵਾਰ ਗਿਣਦਾ ਹੈ, ਕਿਉਂਕਿ ਉਹੀ ਮੈਂਬਰਾਂ ਦਾ ਕ੍ਰਮ ਬਦਲਣ ਨਾਲ ਨਵੀਂ ਕਮੇਟੀ ਨਹੀਂ ਬਣਦੀ।");
  }

  m = value.match(/^Total committees = (.+)\.$/u);
  if (m) return pick(language, `कुल समितियाँ = ${m[1]}।`, `ਕੁੱਲ ਕਮੇਟੀਆਂ = ${m[1]}।`);

  m = value.match(/^Required committees = (.+)\.$/u);
  if (m) return pick(language, `आवश्यक समितियाँ = ${m[1]}।`, `ਲੋੜੀਂਦੀਆਂ ਕਮੇਟੀਆਂ = ${m[1]}।`);

  m = value.match(/^Required number = (.+)\.$/u);
  if (m) return pick(language, `आवश्यक संख्या = ${m[1]}।`, `ਲੋੜੀਂਦੀ ਗਿਣਤੀ = ${m[1]}।`);

  if (value === "Use symmetry: in a random queue, every candidate is equally likely to occupy the first position.") {
    return pick(language, "सममिति का उपयोग करें: यादृच्छिक कतार में हर अभ्यर्थी के पहले स्थान पर आने की संभावना समान है।", "ਸਮਮਿਤੀ ਵਰਤੋ: ਬੇਤਰਤੀਬ ਕਤਾਰ ਵਿੱਚ ਹਰ ਉਮੀਦਵਾਰ ਦੇ ਪਹਿਲੇ ਸਥਾਨ ਤੇ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਬਰਾਬਰ ਹੈ।");
  }

  m = value.match(/^Each of the (\d+) candidates can occupy the first position in the queue\.$/u);
  if (m) return pick(language, `${m[1]} में से प्रत्येक अभ्यर्थी पहले स्थान पर आ सकता है।`, `${m[1]} ਵਿੱਚੋਂ ਹਰ ਉਮੀਦਵਾਰ ਪਹਿਲੇ ਸਥਾਨ ਤੇ ਆ ਸਕਦਾ ਹੈ।`);

  m = value.match(/^Only one of these (\d+) possibilities places the specified candidate first\.$/u);
  if (m) return pick(language, `इन ${m[1]} संभावनाओं में केवल एक में निर्दिष्ट अभ्यर्थी पहले स्थान पर आता है।`, `ਇਨ੍ਹਾਂ ${m[1]} ਸੰਭਾਵਨਾਵਾਂ ਵਿੱਚ ਕੇਵਲ ਇੱਕ ਵਿੱਚ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ ਪਹਿਲੇ ਸਥਾਨ ਤੇ ਆਉਂਦਾ ਹੈ।`);

  if (value === "For n distinct people, total linear arrangements = n!. To count two specified people together, treat them as one block and multiply by 2 for their internal order.") {
    return pick(language, "n अलग व्यक्तियों की कुल रैखिक व्यवस्थाएँ n! होती हैं। दो निर्दिष्ट व्यक्तियों को साथ रखने के लिए उन्हें एक ब्लॉक मानें और उनके आंतरिक क्रम के लिए 2 से गुणा करें।", "n ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਕੁੱਲ ਰੇਖੀ ਵਿਉਂਤਾਂ n! ਹੁੰਦੀਆਂ ਹਨ। ਦੋ ਨਿਰਧਾਰਤ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇਕੱਠੇ ਰੱਖਣ ਲਈ ਉਨ੍ਹਾਂ ਨੂੰ ਇੱਕ ਬਲਾਕ ਮੰਨੋ ਅਤੇ ਅੰਦਰੂਨੀ ਕ੍ਰਮ ਲਈ 2 ਨਾਲ ਗੁਣਾ ਕਰੋ।");
  }

  if (value === "The two specified people can appear inside the block in either order.") {
    return pick(language, "ब्लॉक के अंदर दोनों निर्दिष्ट व्यक्ति किसी भी क्रम में आ सकते हैं।", "ਬਲਾਕ ਦੇ ਅੰਦਰ ਦੋਵੇਂ ਨਿਰਧਾਰਤ ਵਿਅਕਤੀ ਕਿਸੇ ਵੀ ਕ੍ਰਮ ਵਿੱਚ ਆ ਸਕਦੇ ਹਨ।");
  }

  if (value === "Position matters, so use permutations. For an even number, first fix an even unit digit and then arrange the remaining digits.") {
    return pick(language, "स्थान का क्रम महत्वपूर्ण है, इसलिए क्रमचय का उपयोग करें। सम संख्या के लिए पहले इकाई स्थान पर सम अंक तय करें, फिर बाकी अंकों को व्यवस्थित करें।", "ਸਥਾਨ ਦਾ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਇਸ ਲਈ ਕ੍ਰਮਚਯ ਵਰਤੋ। ਜੋੜੀ ਸੰਖਿਆ ਲਈ ਪਹਿਲਾਂ ਇਕਾਈ ਸਥਾਨ ਤੇ ਜੋੜਾ ਅੰਕ ਨਿਰਧਾਰਤ ਕਰੋ, ਫਿਰ ਬਾਕੀ ਅੰਕ ਲਗਾਓ।");
  }

  if (value === "Once the unit digit is fixed, it cannot be reused in the other positions.") {
    return pick(language, "इकाई अंक तय हो जाने के बाद उसे अन्य स्थानों पर दोबारा उपयोग नहीं किया जा सकता।", "ਇਕਾਈ ਅੰਕ ਨਿਰਧਾਰਤ ਹੋਣ ਤੋਂ ਬਾਅਦ ਉਸ ਨੂੰ ਹੋਰ ਸਥਾਨਾਂ ਤੇ ਮੁੜ ਵਰਤਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।");
  }

  if (value === "Use inclusion–exclusion so that members belonging to both groups are not counted twice.") {
    return pick(language, "समावेशन–बहिष्करण का उपयोग करें, ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए।", "ਸਮਾਵੇਸ਼–ਬਹਿਸ਼ਕਰਨ ਵਰਤੋ, ਤਾਂ ਜੋ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਮੈਂਬਰ ਦੋ ਵਾਰ ਨਾ ਗਿਣੇ ਜਾਣ।");
  }

  m = value.match(/^Use n\(A (.+) B\) = n\(A\) \+ n\(B\) - n\(A (.+) B\), because the (\d+) people in both groups would otherwise be counted twice\.$/u);
  if (m) return pick(
    language,
    `n(A ${m[1]} B) = n(A) + n(B) - n(A ${m[2]} B) का उपयोग करें, क्योंकि दोनों समूहों में आने वाले ${m[3]} लोग अन्यथा दो बार गिने जाते।`,
    `n(A ${m[1]} B) = n(A) + n(B) - n(A ${m[2]} B) ਵਰਤੋ, ਕਿਉਂਕਿ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ${m[3]} ਲੋਕ ਨਹੀਂ ਤਾਂ ਦੋ ਵਾਰ ਗਿਣੇ ਜਾਂਦੇ।`,
  );

  if (value === "Adding two group counts includes their overlap twice; inclusion–exclusion corrects that double counting.") {
    return pick(language, "दोनों समूहों की संख्याएँ सीधे जोड़ने पर साझा भाग दो बार गिना जाता है; समावेशन–बहिष्करण इस दोहरी गिनती को ठीक करता है।", "ਦੋਵੇਂ ਸਮੂਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਸਿੱਧੀਆਂ ਜੋੜਨ ਤੇ ਸਾਂਝਾ ਹਿੱਸਾ ਦੋ ਵਾਰ ਗਿਣਿਆ ਜਾਂਦਾ ਹੈ; ਸਮਾਵੇਸ਼–ਬਹਿਸ਼ਕਰਨ ਇਸ ਦੋਹਰੀ ਗਿਣਤੀ ਨੂੰ ਠੀਕ ਕਰਦਾ ਹੈ।");
  }

  if (value === "For exactly one condition, remove the overlap once from each group.") {
    return pick(language, "ठीक एक शर्त पूरी करने वालों के लिए साझा भाग को दोनों समूहों से एक-एक बार हटाएँ।", "ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲਿਆਂ ਲਈ ਸਾਂਝੇ ਹਿੱਸੇ ਨੂੰ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚੋਂ ਇੱਕ-ਇੱਕ ਵਾਰ ਹਟਾਓ।");
  }

  if (value === "The required event is the overlap of the two groups; compare that overlap with the complete group.") {
    return pick(language, "आवश्यक घटना दोनों समूहों का साझा भाग है; उसकी संख्या की तुलना पूरे समूह से करें।", "ਲੋੜੀਂਦੀ ਘਟਨਾ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਹੈ; ਇਸ ਦੀ ਗਿਣਤੀ ਦੀ ਤੁਲਨਾ ਪੂਰੇ ਸਮੂਹ ਨਾਲ ਕਰੋ।");
  }

  if (value === "The intersection means the people who satisfy both cricket and football.") {
    return pick(language, "प्रतिच्छेद उन लोगों को दर्शाता है जो क्रिकेट और फुटबॉल दोनों की शर्त पूरी करते हैं।", "ਸਾਂਝਾ ਹਿੱਸਾ ਉਹਨਾਂ ਲੋਕਾਂ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ ਜੋ ਕ੍ਰਿਕਟ ਅਤੇ ਫੁੱਟਬਾਲ ਦੋਵੇਂ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ।");
  }

  m = value.match(/^The question gives this overlap directly as (\d+) out of (\d+)\.$/u);
  if (m) return pick(language, `प्रश्न में यह साझा भाग सीधे ${m[2]} में से ${m[1]} दिया गया है।`, `ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਇਹ ਸਾਂਝਾ ਹਿੱਸਾ ਸਿੱਧਾ ${m[2]} ਵਿੱਚੋਂ ${m[1]} ਦਿੱਤਾ ਗਿਆ ਹੈ।`);

  if (value === "Use inclusion–exclusion to find those in at least one group, then subtract that count from the total.") {
    return pick(language, "पहले समावेशन–बहिष्करण से कम-से-कम एक समूह में आने वालों की संख्या ज्ञात करें, फिर उसे कुल से घटाएँ।", "ਪਹਿਲਾਂ ਸਮਾਵੇਸ਼–ਬਹਿਸ਼ਕਰਨ ਨਾਲ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਉਸ ਨੂੰ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾਓ।");
  }

  if (value === "The events are mutually exclusive, so add their probabilities; there is no overlap to subtract.") {
    return pick(language, "घटनाएँ परस्पर अपवर्ती हैं, इसलिए उनकी प्रायिकताएँ जोड़ें; घटाने के लिए कोई साझा भाग नहीं है।", "ਘਟਨਾਵਾਂ ਪਰਸਪਰ ਅਲੱਗ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਜੋੜੋ; ਘਟਾਉਣ ਲਈ ਕੋਈ ਸਾਂਝਾ ਹਿੱਸਾ ਨਹੀਂ ਹੈ।");
  }

  if (value === "The two events are mutually exclusive, so they cannot happen together and there is no overlap to subtract.") {
    return pick(language, "दोनों घटनाएँ परस्पर अपवर्ती हैं, इसलिए वे एक साथ घटित नहीं हो सकतीं और घटाने के लिए कोई साझा भाग नहीं है।", "ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਪਰਸਪਰ ਅਲੱਗ ਹਨ, ਇਸ ਲਈ ਉਹ ਇਕੱਠੇ ਨਹੀਂ ਘਟ ਸਕਦੀਆਂ ਅਤੇ ਘਟਾਉਣ ਲਈ ਕੋਈ ਸਾਂਝਾ ਹਿੱਸਾ ਨਹੀਂ ਹੈ।");
  }

  if (value === "The events are independent, so multiply their probabilities to obtain the probability that both occur.") {
    return pick(language, "घटनाएँ स्वतंत्र हैं, इसलिए दोनों के एक साथ घटित होने की प्रायिकता के लिए उनकी प्रायिकताओं को गुणा करें।", "ਘਟਨਾਵਾਂ ਸੁਤੰਤਰ ਹਨ, ਇਸ ਲਈ ਦੋਵੇਂ ਇਕੱਠੇ ਘਟਣ ਦੀ ਸੰਭਾਵਨਾ ਲਈ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ।");
  }

  if (value === "The two results are independent, so the outcome of one does not change the probability of the other.") {
    return pick(language, "दोनों परिणाम स्वतंत्र हैं, इसलिए एक परिणाम दूसरे की प्रायिकता को नहीं बदलता।", "ਦੋਵੇਂ ਨਤੀਜੇ ਸੁਤੰਤਰ ਹਨ, ਇਸ ਲਈ ਇੱਕ ਨਤੀਜਾ ਦੂਜੇ ਦੀ ਸੰਭਾਵਨਾ ਨੂੰ ਨਹੀਂ ਬਦਲਦਾ।");
  }

  if (value === "The required event is the opposite of the given event, so use ¤0¤ = 1 − ¤1¤.") {
    return pick(language, "आवश्यक घटना दी गई घटना की पूरक घटना है, इसलिए ¤0¤ = 1 − ¤1¤ का उपयोग करें।", "ਲੋੜੀਂਦੀ ਘਟਨਾ ਦਿੱਤੀ ਘਟਨਾ ਦੀ ਪੂਰਕ ਘਟਨਾ ਹੈ, ਇਸ ਲਈ ¤0¤ = 1 − ¤1¤ ਵਰਤੋ।");
  }

  if (value === "An event and its opposite have total probability 1.") {
    return pick(language, "किसी घटना और उसकी पूरक घटना की कुल प्रायिकता 1 होती है।", "ਕਿਸੇ ਘਟਨਾ ਅਤੇ ਉਸ ਦੀ ਪੂਰਕ ਘਟਨਾ ਦੀ ਕੁੱਲ ਸੰਭਾਵਨਾ 1 ਹੁੰਦੀ ਹੈ।");
  }

  return null;
}
