import type { Pnl001NativeReviewLanguage } from "./question-studio-native-choice-localizer";

type NativePair = Readonly<{ hi: string; pa: string }>;
type Rule = Readonly<{
  pattern: RegExp;
  render: (match: RegExpExecArray) => NativePair;
}>;

const pair = (hi: string, pa: string): NativePair => ({ hi, pa });

const SYMBOLIC = /^(?:[ABC](?: → [BCD])?|\{known\}|\{missing\}|x|\d+(?:\.\d+)?x|S\}\{0\.8xC\})$/u;

const EXACT: Readonly<Record<string, NativePair>> = {
  "A dealer buys 100 articles at ₹150 each.": pair(
    "एक व्यापारी 100 वस्तुएँ ₹150 प्रति वस्तु की दर से खरीदता है।",
    "ਇੱਕ ਵਪਾਰੀ 100 ਵਸਤਾਂ ₹150 ਪ੍ਰਤੀ ਵਸਤੂ ਦੀ ਦਰ ਨਾਲ ਖਰੀਦਦਾ ਹੈ।",
  ),
  "A generator passes through a two-stage dealer chain.": pair(
    "एक जनरेटर दो चरणों वाली व्यापारी शृंखला से गुजरता है।",
    "ਇੱਕ ਜਨਰੇਟਰ ਦੋ ਪੜਾਅ ਵਾਲੀ ਵਪਾਰੀ ਲੜੀ ਵਿੱਚੋਂ ਲੰਘਦਾ ਹੈ।",
  ),
  "A retailer is setting the selling terms for a product.": pair(
    "एक खुदरा विक्रेता किसी उत्पाद की बिक्री शर्तें तय कर रहा है।",
    "ਇੱਕ ਖੁਦਰਾ ਵਿਕਰੇਤਾ ਕਿਸੇ ਉਤਪਾਦ ਦੀ ਵਿਕਰੀ ਦੀਆਂ ਸ਼ਰਤਾਂ ਤੈਅ ਕਰ ਰਿਹਾ ਹੈ।",
  ),
  "A seller combines a price offer with a short-quantity practice.": pair(
    "एक विक्रेता मूल्य प्रस्ताव के साथ कम मात्रा देने की चाल अपनाता है।",
    "ਇੱਕ ਵਿਕਰੇਤਾ ਕੀਮਤ ਦੀ ਪੇਸ਼ਕਸ਼ ਨਾਲ ਘੱਟ ਮਾਤਰਾ ਦੇਣ ਦੀ ਚਾਲ ਵਰਤਦਾ ਹੈ।",
  ),
  "Calculate the result of the selected transaction.": pair(
    "चुने गए लेन-देन का परिणाम निकालिए।",
    "ਚੁਣੇ ਹੋਏ ਲੈਣ-ਦੇਣ ਦਾ ਨਤੀਜਾ ਕੱਢੋ।",
  ),
  "Charged at cost price": pair("लागत मूल्य पर शुल्क", "ਲਾਗਤ ਮੁੱਲ ਅਨੁਸਾਰ ਵਸੂਲੀ"),
  "Direct amount": pair("सीधी राशि", "ਸਿੱਧੀ ਰਕਮ"),
  "Factory overhead": pair("कारखाना ऊपरी खर्च", "ਫੈਕਟਰੀ ਦਾ ਵਾਧੂ ਖਰਚ"),
  "Fixed group": pair("निश्चित समूह", "ਨਿਰਧਾਰਤ ਸਮੂਹ"),
  "Group 1": pair("समूह 1", "ਸਮੂਹ 1"),
  "Group 2": pair("समूह 2", "ਸਮੂਹ 2"),
  "Known group": pair("ज्ञात समूह", "ਪਤਾ ਦਿੱਤਾ ਸਮੂਹ"),
  Labour: pair("श्रम", "ਮਜ਼ਦੂਰੀ"),
  "Lot A": pair("लॉट A", "ਲਾਟ A"),
  "Lot B": pair("लॉट B", "ਲਾਟ B"),
  Material: pair("सामग्री", "ਸਮੱਗਰੀ"),
  Packaging: pair("पैकिंग", "ਪੈਕਿੰਗ"),
  "Prime cost": pair("मूल उत्पादन लागत", "ਮੂਲ ਉਤਪਾਦਨ ਲਾਗਤ"),
  "Sold group": pair("बेचा गया समूह", "ਵੇਚਿਆ ਗਿਆ ਸਮੂਹ"),
  loss: pair("हानि", "ਘਾਟਾ"),
  profit: pair("लाभ", "ਮੁਨਾਫ਼ਾ"),
  "purchase price plus flat expense": pair(
    "खरीद मूल्य और निश्चित खर्च का योग",
    "ਖਰੀਦ ਮੁੱਲ ਅਤੇ ਨਿਰਧਾਰਤ ਖਰਚ ਦਾ ਜੋੜ",
  ),
  "purchase price plus flat expenses": pair(
    "खरीद मूल्य और निश्चित खर्चों का योग",
    "ਖਰੀਦ ਮੁੱਲ ਅਤੇ ਨਿਰਧਾਰਤ ਖਰਚਿਆਂ ਦਾ ਜੋੜ",
  ),
  "The cost of 100 true units is ₹1,000.": pair(
    "100 वास्तविक इकाइयों की लागत ₹1,000 है।",
    "100 ਅਸਲ ਇਕਾਈਆਂ ਦੀ ਲਾਗਤ ₹1,000 ਹੈ।",
  ),
  "The cost price is ₹4,000, and the target result is a profit of 20%.": pair(
    "लागत मूल्य ₹4,000 है और लक्ष्य 20% लाभ है।",
    "ਲਾਗਤ ਮੁੱਲ ₹4,000 ਹੈ ਅਤੇ ਟੀਚਾ 20% ਮੁਨਾਫ਼ਾ ਹੈ।",
  ),
  "The dealer sells 50 at ₹180 each, 30 at ₹135 each, and recovers ₹75 each on the remaining 20.": pair(
    "व्यापारी 50 वस्तुएँ ₹180 प्रति वस्तु, 30 वस्तुएँ ₹135 प्रति वस्तु बेचता है और शेष 20 पर ₹75 प्रति वस्तु वसूल करता है।",
    "ਵਪਾਰੀ 50 ਵਸਤਾਂ ₹180 ਪ੍ਰਤੀ ਵਸਤੂ, 30 ਵਸਤਾਂ ₹135 ਪ੍ਰਤੀ ਵਸਤੂ ਵੇਚਦਾ ਹੈ ਅਤੇ ਬਾਕੀ 20 ਤੋਂ ₹75 ਪ੍ਰਤੀ ਵਸਤੂ ਵਸੂਲ ਕਰਦਾ ਹੈ।",
  ),
  "The final selling price is ₹13,200.": pair(
    "अंतिम विक्रय मूल्य ₹13,200 है।",
    "ਅੰਤਿਮ ਵੇਚ ਮੁੱਲ ₹13,200 ਹੈ।",
  ),
  "The fixed cost is ₹10,000.": pair(
    "स्थिर लागत ₹10,000 है।",
    "ਸਥਿਰ ਲਾਗਤ ₹10,000 ਹੈ।",
  ),
  "The marked price is ₹6,000.": pair(
    "अंकित मूल्य ₹6,000 है।",
    "ਅੰਕਿਤ ਕੀਮਤ ₹6,000 ਹੈ।",
  ),
  "The quoted selling price equals the cost of 100 true units.": pair(
    "बताया गया विक्रय मूल्य 100 वास्तविक इकाइयों की लागत के बराबर है।",
    "ਦੱਸੀ ਗਈ ਵੇਚ ਕੀਮਤ 100 ਅਸਲ ਇਕਾਈਆਂ ਦੀ ਲਾਗਤ ਦੇ ਬਰਾਬਰ ਹੈ।",
  ),
  "The selling price is ₹75 per unit and the variable cost is ₹50 per unit.": pair(
    "विक्रय मूल्य ₹75 प्रति इकाई और परिवर्ती लागत ₹50 प्रति इकाई है।",
    "ਵੇਚ ਮੁੱਲ ₹75 ਪ੍ਰਤੀ ਇਕਾਈ ਅਤੇ ਬਦਲਦੀ ਲਾਗਤ ₹50 ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।",
  ),
  "The stock contained 100 articles costing ₹100 each.": pair(
    "भंडार में 100 वस्तुएँ थीं, प्रत्येक की लागत ₹100 थी।",
    "ਭੰਡਾਰ ਵਿੱਚ 100 ਵਸਤਾਂ ਸਨ, ਹਰ ਇੱਕ ਦੀ ਲਾਗਤ ₹100 ਸੀ।",
  ),
  "The two stages are 20% profit and 10% profit.": pair(
    "दो चरणों में क्रमशः 20% लाभ और 10% लाभ है।",
    "ਦੋ ਪੜਾਵਾਂ ਵਿੱਚ ਕ੍ਰਮਵਾਰ 20% ਮੁਨਾਫ਼ਾ ਅਤੇ 10% ਮੁਨਾਫ਼ਾ ਹੈ।",
  ),
  "Use the cost, markup and discount given below.": pair(
    "नीचे दी गई लागत, बढ़ोतरी और छूट का उपयोग कीजिए।",
    "ਹੇਠਾਂ ਦਿੱਤੀ ਲਾਗਤ, ਵਾਧੇ ਅਤੇ ਛੂਟ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
  ),
  "Use the stated cost, markup, discount and delivered quantity.": pair(
    "दी गई लागत, बढ़ोतरी, छूट और दी गई मात्रा का उपयोग कीजिए।",
    "ਦਿੱਤੀ ਲਾਗਤ, ਵਾਧੇ, ਛੂਟ ਅਤੇ ਦਿੱਤੀ ਮਾਤਰਾ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
  ),
};

const RULES: readonly Rule[] = [
  {
    pattern: /^₹(.+) and ₹(.+)$/u,
    render: (m) => pair(`₹${m[1]} और ₹${m[2]}`, `₹${m[1]} ਅਤੇ ₹${m[2]}`),
  },
  {
    pattern: /^₹(.+) coupon$/u,
    render: (m) => pair(`₹${m[1]} का कूपन`, `₹${m[1]} ਦਾ ਕੂਪਨ`),
  },
  {
    pattern: /^₹(.+) for repairs and ₹(.+) for transport$/u,
    render: (m) =>
      pair(
        `मरम्मत के लिए ₹${m[1]} और परिवहन के लिए ₹${m[2]}`,
        `ਮੁਰੰਮਤ ਲਈ ₹${m[1]} ਅਤੇ ਆਵਾਜਾਈ ਲਈ ₹${m[2]}`,
      ),
  },
  {
    pattern: /^(\d+) articles at ₹(.+) each$/u,
    render: (m) => pair(`${m[1]} वस्तुएँ, प्रत्येक ₹${m[2]}`, `${m[1]} ਵਸਤਾਂ, ਹਰ ਇੱਕ ₹${m[2]}`),
  },
  {
    pattern: /^(\d+) articles at ₹(.+) cost each$/u,
    render: (m) => pair(`${m[1]} वस्तुएँ, प्रत्येक की लागत ₹${m[2]}`, `${m[1]} ਵਸਤਾਂ, ਹਰ ਇੱਕ ਦੀ ਲਾਗਤ ₹${m[2]}`),
  },
  {
    pattern: /^(\d+) units at ₹(.+) each$/u,
    render: (m) => pair(`${m[1]} इकाइयाँ, प्रत्येक ₹${m[2]}`, `${m[1]} ਇਕਾਈਆਂ, ਹਰ ਇੱਕ ₹${m[2]}`),
  },
  {
    pattern: /^(\d+) articles$/u,
    render: (m) => pair(`${m[1]} वस्तुएँ`, `${m[1]} ਵਸਤਾਂ`),
  },
  {
    pattern: /^(\d+)% discount$/u,
    render: (m) => pair(`${m[1]}% छूट`, `${m[1]}% ਛੂਟ`),
  },
  {
    pattern: /^(\d+)% profit$/u,
    render: (m) => pair(`${m[1]}% लाभ`, `${m[1]}% ਮੁਨਾਫ਼ਾ`),
  },
  {
    pattern: /^(\d+)% loss$/u,
    render: (m) => pair(`${m[1]}% हानि`, `${m[1]}% ਘਾਟਾ`),
  },
  {
    pattern: /^(\d+)% profit followed by (\d+)% loss$/u,
    render: (m) =>
      pair(
        `पहले ${m[1]}% लाभ, फिर ${m[2]}% हानि`,
        `ਪਹਿਲਾਂ ${m[1]}% ਮੁਨਾਫ਼ਾ, ਫਿਰ ${m[2]}% ਘਾਟਾ`,
      ),
  },
  {
    pattern: /^(\d+)% profit, (\d+)% loss, and (\d+)% profit$/u,
    render: (m) =>
      pair(
        `${m[1]}% लाभ, ${m[2]}% हानि और ${m[3]}% लाभ`,
        `${m[1]}% ਮੁਨਾਫ਼ਾ, ${m[2]}% ਘਾਟਾ ਅਤੇ ${m[3]}% ਮੁਨਾਫ਼ਾ`,
      ),
  },
  {
    pattern: /^(\d+)% profit, (\d+)% profit, and (\d+)% loss$/u,
    render: (m) =>
      pair(
        `${m[1]}% लाभ, ${m[2]}% लाभ और ${m[3]}% हानि`,
        `${m[1]}% ਮੁਨਾਫ਼ਾ, ${m[2]}% ਮੁਨਾਫ਼ਾ ਅਤੇ ${m[3]}% ਘਾਟਾ`,
      ),
  },
  {
    pattern: /^one stage at (\d+)% profit$/u,
    render: (m) => pair(`एक चरण में ${m[1]}% लाभ`, `ਇੱਕ ਪੜਾਅ ਵਿੱਚ ${m[1]}% ਮੁਨਾਫ਼ਾ`),
  },
  {
    pattern: /^Sold at ₹(.+) each$/u,
    render: (m) => pair(`प्रत्येक ₹${m[1]} में बेचा`, `ਹਰ ਇੱਕ ₹${m[1]} ਵਿੱਚ ਵੇਚਿਆ`),
  },
  {
    pattern: /^Sold at (\d+)% profit$/u,
    render: (m) => pair(`${m[1]}% लाभ पर बेचा`, `${m[1]}% ਮੁਨਾਫ਼ੇ ਉੱਤੇ ਵੇਚਿਆ`),
  },
  {
    pattern: /^Sold at (\d+)% loss$/u,
    render: (m) => pair(`${m[1]}% हानि पर बेचा`, `${m[1]}% ਘਾਟੇ ਉੱਤੇ ਵੇਚਿਆ`),
  },
  {
    pattern: /^(\d+) units supplied for every (\d+) units charged$/u,
    render: (m) =>
      pair(
        `${m[2]} इकाइयों का शुल्क लेकर ${m[1]} इकाइयाँ दी गईं`,
        `${m[2]} ਇਕਾਈਆਂ ਦੀ ਰਕਮ ਲੈ ਕੇ ${m[1]} ਇਕਾਈਆਂ ਦਿੱਤੀਆਂ`,
      ),
  },
  {
    pattern: /^Price raised by (\d+)%$/u,
    render: (m) => pair(`मूल्य ${m[1]}% बढ़ाया`, `ਕੀਮਤ ${m[1]}% ਵਧਾਈ`),
  },
  {
    pattern: /^Quantity reduced by (\d+)%$/u,
    render: (m) => pair(`मात्रा ${m[1]}% घटाई`, `ਮਾਤਰਾ ${m[1]}% ਘਟਾਈ`),
  },
  {
    pattern: /^Scheme A: charge for (\d+) units and supply (\d+) units$/u,
    render: (m) =>
      pair(
        `योजना A: ${m[1]} इकाइयों की राशि लेकर ${m[2]} इकाइयाँ दें`,
        `ਯੋਜਨਾ A: ${m[1]} ਇਕਾਈਆਂ ਦੀ ਰਕਮ ਲੈ ਕੇ ${m[2]} ਇਕਾਈਆਂ ਦਿਓ`,
      ),
  },
  {
    pattern: /^Scheme B: supply the full quantity and charge (\d+)% above cost$/u,
    render: (m) =>
      pair(
        `योजना B: पूरी मात्रा दें और लागत से ${m[1]}% अधिक लें`,
        `ਯੋਜਨਾ B: ਪੂਰੀ ਮਾਤਰਾ ਦਿਓ ਅਤੇ ਲਾਗਤ ਤੋਂ ${m[1]}% ਵੱਧ ਲਵੋ`,
      ),
  },
  {
    pattern: /^A: 60x at 20% profit; B: 40x at r% loss$/u,
    render: () => pair("A: 60x पर 20% लाभ; B: 40x पर r% हानि", "A: 60x ਉੱਤੇ 20% ਮੁਨਾਫ਼ਾ; B: 40x ਉੱਤੇ r% ਘਾਟਾ"),
  },
  {
    pattern: /^2 units of A and 1 unit of B$/u,
    render: () => pair("A की 2 इकाइयाँ और B की 1 इकाई", "A ਦੀਆਂ 2 ਇਕਾਈਆਂ ਅਤੇ B ਦੀ 1 ਇਕਾਈ"),
  },
  {
    pattern: /^2 units of A at ₹100 each with variable cost ₹60 each, and 1 unit of B at ₹200 with variable cost ₹120$/u,
    render: () =>
      pair(
        "A की 2 इकाइयाँ: प्रति इकाई मूल्य ₹100 और परिवर्ती लागत ₹60; B की 1 इकाई: मूल्य ₹200 और परिवर्ती लागत ₹120",
        "A ਦੀਆਂ 2 ਇਕਾਈਆਂ: ਪ੍ਰਤੀ ਇਕਾਈ ਕੀਮਤ ₹100 ਅਤੇ ਬਦਲਦੀ ਲਾਗਤ ₹60; B ਦੀ 1 ਇਕਾਈ: ਕੀਮਤ ₹200 ਅਤੇ ਬਦਲਦੀ ਲਾਗਤ ₹120",
      ),
  },
  {
    pattern: /^Product A sells for ₹100 per unit and has a variable cost of ₹60 per unit\.$/u,
    render: () => pair("उत्पाद A का विक्रय मूल्य ₹100 प्रति इकाई और परिवर्ती लागत ₹60 प्रति इकाई है।", "ਉਤਪਾਦ A ਦਾ ਵੇਚ ਮੁੱਲ ₹100 ਪ੍ਰਤੀ ਇਕਾਈ ਅਤੇ ਬਦਲਦੀ ਲਾਗਤ ₹60 ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।"),
  },
  {
    pattern: /^Product B sells for ₹200 per unit and has a variable cost of ₹120 per unit\.$/u,
    render: () => pair("उत्पाद B का विक्रय मूल्य ₹200 प्रति इकाई और परिवर्ती लागत ₹120 प्रति इकाई है।", "ਉਤਪਾਦ B ਦਾ ਵੇਚ ਮੁੱਲ ₹200 ਪ੍ਰਤੀ ਇਕਾਈ ਅਤੇ ਬਦਲਦੀ ਲਾਗਤ ₹120 ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।"),
  },
  {
    pattern: /^(\d+) articles were sold at ₹(.+) each\.$/u,
    render: (m) => pair(`${m[1]} वस्तुएँ ₹${m[2]} प्रति वस्तु बेची गईं।`, `${m[1]} ਵਸਤਾਂ ₹${m[2]} ਪ੍ਰਤੀ ਵਸਤੂ ਵੇਚੀਆਂ ਗਈਆਂ।`),
  },
];

export function localizePnl001CanonicalContextText(
  value: string,
  language: Pnl001NativeReviewLanguage,
): string {
  if (!/[A-Za-z]/u.test(value)) return value;
  if (SYMBOLIC.test(value)) return value;
  const exact = EXACT[value];
  if (exact) return exact[language];
  for (const rule of RULES) {
    const match = rule.pattern.exec(value);
    if (match) return rule.render(match)[language];
  }
  throw new Error(`Unsupported PNL-001 canonical context text: ${value}`);
}

export function localizePnl001CanonicalContext(
  value: unknown,
  language: Pnl001NativeReviewLanguage,
): unknown {
  if (typeof value === "string") {
    return localizePnl001CanonicalContextText(value, language);
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizePnl001CanonicalContext(item, language));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        localizePnl001CanonicalContext(item, language),
      ]),
    );
  }
  return value;
}

export function isPnl001SymbolicContextText(value: string): boolean {
  return SYMBOLIC.test(value);
}
