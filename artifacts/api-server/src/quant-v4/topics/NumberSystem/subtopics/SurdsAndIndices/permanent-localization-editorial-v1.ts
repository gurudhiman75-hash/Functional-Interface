import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";

type Bilingual = readonly [hi: string, pa: string];

const EXACT: Readonly<Record<string, Bilingual>> = {
  "For the same base, multiplication adds exponents.": [
    "समान आधार वाली घातों के गुणा में घातांक जुड़ते हैं।",
    "ਇੱਕੋ ਅਧਾਰ ਵਾਲੀਆਂ ਘਾਤਾਂ ਦੇ ਗੁਣਨ ਵਿੱਚ ਘਾਤਾਂਕ ਜੋੜੇ ਜਾਂਦੇ ਹਨ।",
  ],
  "For the same base, division subtracts the denominator exponent.": [
    "समान आधार वाली घातों के भाग में हर वाली घात का घातांक घटाया जाता है।",
    "ਇੱਕੋ ਅਧਾਰ ਵਾਲੀਆਂ ਘਾਤਾਂ ਦੇ ਭਾਗ ਵਿੱਚ ਹਰ ਵਾਲੀ ਘਾਤ ਦਾ ਘਾਤਾਂਕ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ।",
  ],
  "A power raised to another power multiplies the exponents.": [
    "एक घात को दूसरी घात तक उठाने पर घातांकों का गुणा होता है।",
    "ਇੱਕ ਘਾਤ ਨੂੰ ਦੂਜੀ ਘਾਤ ਤੱਕ ਚੁੱਕਣ ਤੇ ਘਾਤਾਂਕਾਂ ਦਾ ਗੁਣਾ ਹੁੰਦਾ ਹੈ।",
  ],
  "When the exponent is the same, multiply the bases and retain that exponent.": [
    "घातांक समान हो तो आधारों का गुणा कीजिए और वही घातांक रखिए।",
    "ਘਾਤਾਂਕ ਇੱਕੋ ਹੋਵੇ ਤਾਂ ਅਧਾਰਾਂ ਦਾ ਗੁਣਾ ਕਰੋ ਅਤੇ ਉਹੀ ਘਾਤਾਂਕ ਰੱਖੋ।",
  ],
  "When equal exponents are divided, divide the bases and retain the exponent.": [
    "समान घातांक वाली घातों का भाग करते समय आधारों का भाग कीजिए और वही घातांक रखिए।",
    "ਇੱਕੋ ਘਾਤਾਂਕ ਵਾਲੀਆਂ ਘਾਤਾਂ ਦਾ ਭਾਗ ਕਰਦੇ ਸਮੇਂ ਅਧਾਰਾਂ ਦਾ ਭਾਗ ਕਰੋ ਅਤੇ ਉਹੀ ਘਾਤਾਂਕ ਰੱਖੋ।",
  ],
  "Reduce the expression to one same-base exponent and choose the matching form.": [
    "व्यंजक को समान आधार की एक घात में बदलिए और उससे मेल खाने वाला रूप चुनिए।",
    "ਵਿਅੰਜਕ ਨੂੰ ਇੱਕੋ ਅਧਾਰ ਦੀ ਇੱਕ ਘਾਤ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਉਸ ਨਾਲ ਮਿਲਦਾ ਰੂਪ ਚੁਣੋ।",
  ],
  "The denominator of the fractional exponent gives the root index.": [
    "भिन्नात्मक घातांक का हर मूल का क्रम बताता है।",
    "ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਦਾ ਹਰ ਮੂਲ ਦਾ ਕ੍ਰਮ ਦੱਸਦਾ ਹੈ।",
  ],
  "Convert every factor to the same base, preserving signed and fractional exponent contributions.": [
    "हर गुणनखंड को एक ही आधार में बदलिए और चिह्नित तथा भिन्नात्मक घातांकों के योगदान को यथावत रखिए।",
    "ਹਰੇਕ ਗੁਣਨਖੰਡ ਨੂੰ ਇੱਕੋ ਅਧਾਰ ਵਿੱਚ ਬਦਲੋ ਅਤੇ ਚਿੰਨ੍ਹ ਵਾਲੇ ਤੇ ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕਾਂ ਦੇ ਯੋਗਦਾਨ ਨੂੰ ਜਿਉਂ ਦਾ ਤਿਉਂ ਰੱਖੋ।",
  ],
  "Split the target as a^x × a^k and substitute the known relation.": [
    "लक्ष्य को a^x × a^k के रूप में लिखकर दिए गए संबंध का मान रखिए।",
    "ਲਕਸ਼ ਨੂੰ a^x × a^k ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖ ਕੇ ਦਿੱਤੇ ਸੰਬੰਧ ਦਾ ਮੁੱਲ ਰੱਖੋ।",
  ],
  "Write the target as a^x ÷ a^k and substitute the supplied value.": [
    "लक्ष्य को a^x ÷ a^k के रूप में लिखकर दिया गया मान रखिए।",
    "ਲਕਸ਼ ਨੂੰ a^x ÷ a^k ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖ ਕੇ ਦਿੱਤਾ ਮੁੱਲ ਰੱਖੋ।",
  ],
  "Multiply the supplied relations to add exponents.": [
    "दिए गए संबंधों का गुणा करके घातांक जोड़िए।",
    "ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਦਾ ਗੁਣਾ ਕਰਕੇ ਘਾਤਾਂਕ ਜੋੜੋ।",
  ],
  "Divide the supplied relations to subtract exponents.": [
    "दिए गए संबंधों का भाग करके घातांक घटाइए।",
    "ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਦਾ ਭਾਗ ਕਰਕੇ ਘਾਤਾਂਕ ਘਟਾਓ।",
  ],
  "Divide the transformed relation by the original one; the quotient equals a^k.": [
    "रूपांतरित संबंध को मूल संबंध से भाग दीजिए; भागफल a^k के बराबर होगा।",
    "ਰੂਪਾਂਤਰਿਤ ਸੰਬੰਧ ਨੂੰ ਮੂਲ ਸੰਬੰਧ ਨਾਲ ਭਾਗ ਕਰੋ; ਭਾਗਫਲ a^k ਦੇ ਬਰਾਬਰ ਹੋਵੇਗਾ।",
  ],
  "Find the unknown exponent exactly.": [
    "अज्ञात घातांक का सटीक मान ज्ञात कीजिए।",
    "ਅਣਜਾਣ ਘਾਤਾਂਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
  ],
  "Equal positive bases greater than 1 have equal exponents.": [
    "1 से बड़े समान धनात्मक आधारों की बराबरी में उनके घातांक भी बराबर होते हैं।",
    "1 ਤੋਂ ਵੱਡੇ ਇੱਕੋ ਧਨਾਤਮਕ ਅਧਾਰਾਂ ਦੀ ਬਰਾਬਰੀ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦੇ ਘਾਤਾਂਕ ਵੀ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ।",
  ],
  "Equate the exponents, then solve the resulting linear equation.": [
    "घातांक बराबर कीजिए, फिर प्राप्त रैखिक समीकरण हल कीजिए।",
    "ਘਾਤਾਂਕ ਬਰਾਬਰ ਕਰੋ, ਫਿਰ ਮਿਲਿਆ ਰੇਖੀ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।",
  ],
  "Factor a^x from the difference and solve the remaining exact power equation.": [
    "अंतर में a^x को गुणनखंड के रूप में बाहर निकालिए और शेष सटीक घात समीकरण हल कीजिए।",
    "ਅੰਤਰ ਵਿੱਚੋਂ a^x ਨੂੰ ਗੁਣਨਖੰਡ ਵਜੋਂ ਬਾਹਰ ਕੱਢੋ ਅਤੇ ਬਚਿਆ ਸਟੀਕ ਘਾਤ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।",
  ],
  "Substitute y=a^x, factor the quadratic, then retain the root that is an exact power of the base.": [
    "y=a^x रखिए, द्विघात का गुणनखंड कीजिए और केवल वही मूल रखिए जो आधार की सटीक घात हो।",
    "y=a^x ਰੱਖੋ, ਦੁਘਾਤੀ ਦਾ ਗੁਣਨਖੰਡ ਕਰੋ ਅਤੇ ਕੇਵਲ ਉਹੀ ਮੂਲ ਰੱਖੋ ਜੋ ਅਧਾਰ ਦੀ ਸਟੀਕ ਘਾਤ ਹੋਵੇ।",
  ],
  "With a common positive exponent, the larger positive base gives the larger value.": [
    "समान धनात्मक घातांक होने पर बड़ा धनात्मक आधार बड़ा मान देता है।",
    "ਇੱਕੋ ਧਨਾਤਮਕ ਘਾਤਾਂਕ ਹੋਣ ਤੇ ਵੱਡਾ ਧਨਾਤਮਕ ਅਧਾਰ ਵੱਡਾ ਮੁੱਲ ਦਿੰਦਾ ਹੈ।",
  ],
  "The condition is satisfied, so denesting is possible.": [
    "शर्त पूरी होती है, इसलिए करणी को सरल रूप में खोला जा सकता है।",
    "ਸ਼ਰਤ ਪੂਰੀ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਕਰਣੀ ਨੂੰ ਸਰਲ ਰੂਪ ਵਿੱਚ ਖੋਲ੍ਹਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
  ],
};

function pick(locale: SriLocalizedLocaleV1, value: Bilingual): string {
  return locale === "hi-IN" ? value[0] : value[1];
}

function localizeLawFragment(text: string, locale: SriLocalizedLocaleV1): string {
  let match: RegExpMatchArray | null;
  match = text.match(/^For a ≠ 0, (.+)$/u);
  if (match) return locale === "hi-IN" ? `a ≠ 0 के लिए, ${match[1]}` : `a ≠ 0 ਲਈ, ${match[1]}`;
  match = text.match(/^For all real a,b, (.+)$/u);
  if (match) return locale === "hi-IN" ? `सभी वास्तविक a,b के लिए, ${match[1]}` : `ਸਭ ਵਾਸਤਵਿਕ a,b ਲਈ, ${match[1]}`;
  match = text.match(/^For real a,b and integer n, (.+) whenever both sides are defined$/u);
  if (match) {
    return locale === "hi-IN"
      ? `वास्तविक a,b और पूर्णांक n के लिए, ${match[1]} जब दोनों पक्ष परिभाषित हों`
      : `ਵਾਸਤਵਿਕ a,b ਅਤੇ ਪੂਰਨ ਅੰਕ n ਲਈ, ${match[1]} ਜਦੋਂ ਦੋਵੇਂ ਪਾਸੇ ਪਰਿਭਾਸ਼ਿਤ ਹੋਣ`;
  }
  return text;
}

/**
 * Human-review editorial authority for learner-facing SRI localization.
 * Every mathematical capture is emitted unchanged and in source order.
 * This runs before token/prefix fallback localization so coherent sentence
 * templates win over word-by-word substitutions.
 */
export function localizeSriEditorialSurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  const exact = EXACT[text];
  if (exact) return pick(locale, exact);

  let match: RegExpMatchArray | null;

  match = text.match(/^So the expression is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `अतः व्यंजक ${match[1]} है।` : `ਇਸ ਲਈ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^Which expression is equivalent to (.+)\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के समतुल्य व्यंजक कौन-सा है?` : `${match[1]} ਦੇ ਸਮਤੁੱਲ ਵਿਅੰਜਕ ਕਿਹੜਾ ਹੈ?`;

  match = text.match(/^Which option is equivalent to (.+)\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के समतुल्य विकल्प कौन-सा है?` : `${match[1]} ਦੇ ਸਮਤੁੱਲ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?`;

  match = text.match(/^Equivalent form: (.+)$/u);
  if (match) return locale === "hi-IN" ? `समतुल्य रूप: ${match[1]}` : `ਸਮਤੁੱਲ ਰੂਪ: ${match[1]}`;

  match = text.match(/^(.+) = (\d+)(?:st|nd|rd|th) root of (.+)$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} = ${match[2]}वाँ मूल ${match[3]}` : `${match[1]} = ${match[2]}ਵਾਂ ਮੂਲ ${match[3]}`;

  match = text.match(/^(.+?=.+?) and (.+?=.+?)$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} और ${match[2]}` : `${match[1]} ਅਤੇ ${match[2]}`;

  match = text.match(/^Net exponent of (.+) = (.+)$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का कुल घातांक = ${match[2]}` : `${match[1]} ਦਾ ਕੁੱਲ ਘਾਤਾਂਕ = ${match[2]}`;

  match = text.match(/^The value of (.+) is (.+)\. What is (.+)\?$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} का मान ${match[2]} है। ${match[3]} का मान क्या है?`
    : `${match[1]} ਦਾ ਮੁੱਲ ${match[2]} ਹੈ। ${match[3]} ਦਾ ਮੁੱਲ ਕੀ ਹੈ?`;

  match = text.match(/^The supplied value is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया मान ${match[1]} है।` : `ਦਿੱਤਾ ਮੁੱਲ ${match[1]} ਹੈ।`;

  match = text.match(/^For (X=.+) and (Y=.+), determine n when (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `${match[1]} और ${match[2]} के लिए, जब ${match[3]} हो तब n ज्ञात कीजिए।`
    : `${match[1]} ਅਤੇ ${match[2]} ਲਈ, ਜਦੋਂ ${match[3]} ਹੋਵੇ ਤਾਂ n ਪਤਾ ਕਰੋ।`;

  match = text.match(/^So (.+), giving (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `अतः ${match[1]}, जिससे ${match[2]} मिलता है।` : `ਇਸ ਲਈ ${match[1]}, ਜਿਸ ਤੋਂ ${match[2]} ਮਿਲਦਾ ਹੈ।`;

  match = text.match(/^The given equation is the mixed radical-index equation (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया मिश्रित करणी-घातांक समीकरण ${match[1]} है।` : `ਦਿੱਤਾ ਮਿਸ਼ਰਤ ਕਰਣੀ-ਘਾਤਾਂਕ ਸਮੀਕਰਨ ${match[1]} ਹੈ।`;

  match = text.match(/^The given equation is (.+) for integer x\.$/u);
  if (match) return locale === "hi-IN" ? `पूर्णांक x के लिए दिया गया समीकरण ${match[1]} है।` : `ਪੂਰਨ ਅੰਕ x ਲਈ ਦਿੱਤਾ ਸਮੀਕਰਨ ${match[1]} ਹੈ।`;

  match = text.match(/^The given equation is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया समीकरण ${match[1]} है।` : `ਦਿੱਤਾ ਸਮੀਕਰਨ ${match[1]} ਹੈ।`;

  match = text.match(/^Determine x when (.+) and (.+) are equal\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} और ${match[2]} बराबर हों तो x ज्ञात कीजिए।` : `${match[1]} ਅਤੇ ${match[2]} ਬਰਾਬਰ ਹੋਣ ਤਾਂ x ਪਤਾ ਕਰੋ।`;

  match = text.match(/^The two equal power expressions are (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दो बराबर घात व्यंजक ${match[1]} और ${match[2]} हैं।` : `ਦੋ ਬਰਾਬਰ ਘਾਤ ਵਿਅੰਜਕ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;

  match = text.match(/^Determine x from (.+) by using a common base\.$/u);
  if (match) return locale === "hi-IN" ? `समान आधार का उपयोग करके ${match[1]} से x ज्ञात कीजिए।` : `ਸਾਂਝੇ ਅਧਾਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਤੋਂ x ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Using y=(.+), determine the integer x satisfying (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `y=${match[1]} रखकर ${match[2]} को संतुष्ट करने वाला पूर्णांक x ज्ञात कीजिए।` : `y=${match[1]} ਰੱਖ ਕੇ ${match[2]} ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲਾ ਪੂਰਨ ਅੰਕ x ਪਤਾ ਕਰੋ।`;

  match = text.match(/^The substitution is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `प्रतिस्थापन ${match[1]} है।` : `ਬਦਲੀ ${match[1]} ਹੈ।`;

  match = text.match(/^The roots are (.+) and (.+); only (.+) is an exact power of (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `मूल ${match[1]} और ${match[2]} हैं; केवल ${match[3]} ही ${match[4]} की सटीक घात है।`
    : `ਮੂਲ ${match[1]} ਅਤੇ ${match[2]} ਹਨ; ਕੇਵਲ ${match[3]} ਹੀ ${match[4]} ਦੀ ਸਟੀਕ ਘਾਤ ਹੈ।`;

  match = text.match(/^(.+) < (.+) and exponent (.+) is positive\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} < ${match[2]} और घातांक ${match[3]} धनात्मक है।` : `${match[1]} < ${match[2]} ਅਤੇ ਘਾਤਾਂਕ ${match[3]} ਧਨਾਤਮਕ ਹੈ।`;

  match = text.match(/^The two expressions have the same exponent (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दोनों व्यंजकों का घातांक ${match[1]} समान है।` : `ਦੋਵੇਂ ਵਿਅੰਜਕਾਂ ਦਾ ਘਾਤਾਂਕ ${match[1]} ਇੱਕੋ ਹੈ।`;

  match = text.match(/^State whether (.+) is greater than, less than, or equal to (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `बताइए कि ${match[1]}, ${match[2]} से बड़ा, छोटा या बराबर है।`
    : `ਦੱਸੋ ਕਿ ${match[1]}, ${match[2]} ਤੋਂ ਵੱਡਾ, ਛੋਟਾ ਜਾਂ ਬਰਾਬਰ ਹੈ।`;

  match = text.match(/^The displayed statements are I: (.+?)\. II: (.+)\.$/u);
  if (match) {
    const first = localizeLawFragment(match[1], locale);
    const second = localizeLawFragment(match[2], locale);
    return locale === "hi-IN" ? `दिखाए गए कथन हैं— I: ${first}। II: ${second}।` : `ਦਿਖਾਏ ਗਏ ਕਥਨ ਹਨ— I: ${first}। II: ${second}।`;
  }

  match = text.match(/^The supplied information is Statement I: (.+?)\. Statement II: (.+)\.$/u);
  if (match) {
    const first = localizeLawFragment(match[1], locale);
    const second = localizeLawFragment(match[2], locale);
    return locale === "hi-IN" ? `दिए गए कथन हैं— कथन I: ${first}। कथन II: ${second}।` : `ਦਿੱਤੇ ਕਥਨ ਹਨ— ਕਥਨ I: ${first}। ਕਥਨ II: ${second}।`;
  }

  match = text.match(/^The two labelled quantities are A=(.+) and B=(.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दो नामित राशियाँ A=${match[1]} और B=${match[2]} हैं।` : `ਦੋ ਨਾਮਿਤ ਰਾਸ਼ੀਆਂ A=${match[1]} ਅਤੇ B=${match[2]} ਹਨ।`;

  match = text.match(/^The surd expression to simplify is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सरल किया जाने वाला करणी व्यंजक ${match[1]} है।` : `ਸਰਲ ਕੀਤਾ ਜਾਣ ਵਾਲਾ ਕਰਣੀ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^The given surd expression is (.+) to index-free radicand form\.$/u);
  if (match) return locale === "hi-IN" ? `घातांक-रहित करणीगत रूप में लिखा जाने वाला करणी व्यंजक ${match[1]} है।` : `ਘਾਤਾਂਕ-ਰਹਿਤ ਕਰਣੀਗਤ ਰੂਪ ਵਿੱਚ ਲਿਖਿਆ ਜਾਣ ਵਾਲਾ ਕਰਣੀ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^The given surd expression is (.+) to one surd term\.$/u);
  if (match) return locale === "hi-IN" ? `एक करणी पद में मिलाया जाने वाला करणी व्यंजक ${match[1]} है।` : `ਇੱਕ ਕਰਣੀ ਪਦ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਣ ਵਾਲਾ ਕਰਣੀ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^The given surd expression is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया करणी व्यंजक ${match[1]} है।` : `ਦਿੱਤਾ ਕਰਣੀ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^The given radical form is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया करणी रूप ${match[1]} है।` : `ਦਿੱਤਾ ਕਰਣੀ ਰੂਪ ${match[1]} ਹੈ।`;

  match = text.match(/^The fractional-index expression is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `भिन्नात्मक घातांक व्यंजक ${match[1]} है।` : `ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^Find the exact product of (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} और ${match[2]} का सटीक गुणनफल ज्ञात कीजिए।` : `${match[1]} ਅਤੇ ${match[2]} ਦਾ ਸਟੀਕ ਗੁਣਨਫਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^The factors are (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `गुणनखंड ${match[1]} और ${match[2]} हैं।` : `ਗੁਣਨਖੰਡ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;

  match = text.match(/^Remove the radical from the denominator of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के हर से करणी हटाइए।` : `${match[1]} ਦੇ ਹਰ ਤੋਂ ਕਰਣੀ ਹਟਾਓ।`;

  match = text.match(/^The given expression is and combine (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया व्यंजक ${match[1]} है; परिमेयकरण करके पदों को मिलाइए।` : `ਦਿੱਤਾ ਵਿਅੰਜਕ ${match[1]} ਹੈ; ਪਰਿਮੇਯਕਰਨ ਕਰਕੇ ਪਦਾਂ ਨੂੰ ਮਿਲਾਓ।`;

  match = text.match(/^Determine A\+B from the rationalised form of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के परिमेयकृत रूप से A+B ज्ञात कीजिए।` : `${match[1]} ਦੇ ਪਰਿਮੇਯਕ੍ਰਿਤ ਰੂਪ ਤੋਂ A+B ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Write (.+) as a difference of two simple square roots\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को दो सरल वर्गमूलों के अंतर के रूप में लिखिए।` : `${match[1]} ਨੂੰ ਦੋ ਸਰਲ ਵਰਗਮੂਲਾਂ ਦੇ ਅੰਤਰ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Squaring (.+) gives (.+)\. Determine A and B\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का वर्ग करने पर ${match[2]} मिलता है। A और B ज्ञात कीजिए।` : `${match[1]} ਦਾ ਵਰਗ ਕਰਨ ਤੇ ${match[2]} ਮਿਲਦਾ ਹੈ। A ਅਤੇ B ਪਤਾ ਕਰੋ।`;

  match = text.match(/^The supplied information is Squaring (.+) gives (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया है कि ${match[1]} का वर्ग ${match[2]} है।` : `ਦਿੱਤਾ ਹੈ ਕਿ ${match[1]} ਦਾ ਵਰਗ ${match[2]} ਹੈ।`;

  match = text.match(/^The supplied surd expression is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया करणी व्यंजक ${match[1]} है।` : `ਦਿੱਤਾ ਕਰਣੀ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^The denesting relation is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `करणी-सरलीकरण संबंध ${match[1]} है।` : `ਕਰਣੀ-ਸਰਲੀਕਰਨ ਸੰਬੰਧ ${match[1]} ਹੈ।`;

  match = text.match(/^The denested form of (.+) is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सरल करणी रूप ${match[2]} है।` : `${match[1]} ਦਾ ਸਰਲ ਕਰਣੀ ਰੂਪ ${match[2]} ਹੈ।`;

  match = text.match(/^Check: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `जाँच: ${match[1]}।` : `ਜਾਂਚ: ${match[1]}।`;

  match = text.match(/^The supplied information is Let x denote (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `मान लीजिए x से ${match[1]} दर्शाया गया है।` : `ਮੰਨੋ x ਨਾਲ ${match[1]} ਦਰਸਾਇਆ ਗਿਆ ਹੈ।`;

  match = text.match(/^The positive root is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `धनात्मक मूल ${match[1]} है।` : `ਧਨਾਤਮਕ ਮੂਲ ${match[1]} ਹੈ।`;

  match = text.match(/^Find the positive value of the repeating radical (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `आवर्ती करणी ${match[1]} का धनात्मक मान ज्ञात कीजिए।` : `ਦੁਹਰਾਉਂਦੀ ਕਰਣੀ ${match[1]} ਦਾ ਧਨਾਤਮਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^The repeating radical satisfies (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया आवर्ती करणी व्यंजक ${match[1]} है।` : `ਦਿੱਤਾ ਦੁਹਰਾਉਂਦਾ ਕਰਣੀ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^The quantities to compare are (.+) or (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `तुलना की जाने वाली राशियाँ ${match[1]} और ${match[2]} हैं।` : `ਤੁਲਨਾ ਲਈ ਰਾਸ਼ੀਆਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;

  match = text.match(/^The supplied surd value is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिया गया करणी मान ${match[1]} है।` : `ਦਿੱਤਾ ਕਰਣੀ ਮੁੱਲ ${match[1]} ਹੈ।`;

  match = text.match(/^The equation is (.+) with the restriction (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `समीकरण ${match[1]} है और प्रतिबंध ${match[2]} है।` : `ਸਮੀਕਰਨ ${match[1]} ਹੈ ਅਤੇ ਪਾਬੰਦੀ ${match[2]} ਹੈ।`;

  match = text.match(/^The variable is restricted to (.+) and satisfies (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `चर ${match[1]} तक सीमित है और ${match[2]} को संतुष्ट करता है।` : `ਚਲ ${match[1]} ਤੱਕ ਸੀਮਿਤ ਹੈ ਅਤੇ ${match[2]} ਨੂੰ ਪੂਰਾ ਕਰਦਾ ਹੈ।`;

  match = text.match(/^The displayed surd statements are I\. (.+) II\. (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `दिखाए गए करणी कथन हैं— I. ${match[1]} II. ${match[2]}।` : `ਦਿਖਾਏ ਗਏ ਕਰਣੀ ਕਥਨ ਹਨ— I. ${match[1]} II. ${match[2]}।`;

  match = text.match(/^The radical under review is (.+); the displayed statements are I\. (.+) II\. (.+)\.$/u);
  if (match) return locale === "hi-IN"
    ? `जाँची जाने वाली करणी ${match[1]} है; कथन हैं— I. ${match[2]} II. ${match[3]}।`
    : `ਜਾਂਚੀ ਜਾਣ ਵਾਲੀ ਕਰਣੀ ${match[1]} ਹੈ; ਕਥਨ ਹਨ— I. ${match[2]} II. ${match[3]}।`;

  match = text.match(/^The radical to rewrite is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `पुनर्लिखी जाने वाली करणी ${match[1]} है।` : `ਮੁੜ ਲਿਖੀ ਜਾਣ ਵਾਲੀ ਕਰਣੀ ${match[1]} ਹੈ।`;

  return undefined;
}
