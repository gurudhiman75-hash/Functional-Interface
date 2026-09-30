// Authored, exam-style variants for dynamic review candidates only.
// Canonical frozen editorial libraries and solver/explanation authority are unchanged.
export type AuthoredStemLanguage = "en" | "hi" | "pa";
const STEMS: Record<string, Record<AuthoredStemLanguage, readonly [string, string]>> = {
  "PNL-QL-001": {
    "en": [
      "A mixer bought for ₹{costPrice} is sold for ₹{sellingPrice}. Determine the profit or loss amount.",
      "A retailer pays ₹{costPrice} for a mixer and receives ₹{sellingPrice} on sale. What is the profit or loss?"
    ],
    "hi": [
      "एक मिक्सर ₹{costPrice} में खरीदा और ₹{sellingPrice} में बेचा गया। लाभ या हानि की राशि ज्ञात कीजिए।",
      "एक विक्रेता मिक्सर के लिए ₹{costPrice} देता है और उसे ₹{sellingPrice} में बेचता है। लाभ या हानि कितनी है?"
    ],
    "pa": [
      "ਇੱਕ ਮਿਕਸਰ ₹{costPrice} ਵਿੱਚ ਖਰੀਦ ਕੇ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਿਆ ਗਿਆ। ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਵਿਕਰੇਤਾ ਮਿਕਸਰ ਲਈ ₹{costPrice} ਦਿੰਦਾ ਹੈ ਅਤੇ ਉਸਨੂੰ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਦਾ ਹੈ। ਲਾਭ ਜਾਂ ਘਾਟਾ ਕਿੰਨਾ ਹੈ?"
    ]
  },
  "PNL-QL-005": {
    "en": [
      "An appliance costs ₹{costPrice}. What selling price will give a profit of {profitPercent}%?",
      "A dealer buys an appliance for ₹{costPrice} and wants a {profitPercent}% profit. Find the required selling price."
    ],
    "hi": [
      "एक उपकरण का क्रय मूल्य ₹{costPrice} है। {profitPercent}% लाभ के लिए उसका विक्रय मूल्य क्या होना चाहिए?",
      "एक डीलर उपकरण ₹{costPrice} में खरीदता है और {profitPercent}% लाभ चाहता है। आवश्यक विक्रय मूल्य ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਉਪਕਰਣ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{costPrice} ਹੈ। {profitPercent}% ਲਾਭ ਲਈ ਇਸਦਾ ਵਿਕਰੀ ਮੁੱਲ ਕਿੰਨਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?",
      "ਇੱਕ ਡੀਲਰ ਉਪਕਰਣ ₹{costPrice} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ ਅਤੇ {profitPercent}% ਲਾਭ ਚਾਹੁੰਦਾ ਹੈ। ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-037": {
    "en": [
      "A jacket marked at ₹{markedPrice} is sold after a {discountPercent}% discount. Find the selling price.",
      "The listed price of a jacket is ₹{markedPrice}. After allowing {discountPercent}% off, what price does the customer pay?"
    ],
    "hi": [
      "एक जैकेट का अंकित मूल्य ₹{markedPrice} है और उस पर {discountPercent}% छूट दी जाती है। विक्रय मूल्य ज्ञात कीजिए।",
      "एक जैकेट का सूची मूल्य ₹{markedPrice} है। {discountPercent}% छूट के बाद ग्राहक कितना भुगतान करेगा?"
    ],
    "pa": [
      "ਇੱਕ ਜੈਕਟ ਦਾ ਅੰਕਿਤ ਮੁੱਲ ₹{markedPrice} ਹੈ ਅਤੇ ਇਸ 'ਤੇ {discountPercent}% ਛੂਟ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਜੈਕਟ ਦੀ ਸੂਚੀ ਕੀਮਤ ₹{markedPrice} ਹੈ। {discountPercent}% ਛੂਟ ਤੋਂ ਬਾਅਦ ਗਾਹਕ ਕਿੰਨਾ ਭੁਗਤਾਨ ਕਰੇਗਾ?"
    ]
  },
  "PNL-QL-038": {
    "en": [
      "A tablet marked at ₹{markedPrice} is sold for ₹{sellingPrice}. What discount percentage was allowed?",
      "The marked price of a tablet is ₹{markedPrice}, but the customer pays ₹{sellingPrice}. Find the rate of discount."
    ],
    "hi": [
      "एक टैबलेट का अंकित मूल्य ₹{markedPrice} है और वह ₹{sellingPrice} में बेचा गया। छूट प्रतिशत ज्ञात कीजिए।",
      "एक टैबलेट का अंकित मूल्य ₹{markedPrice} है, पर ग्राहक ₹{sellingPrice} देता है। छूट की दर ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਟੈਬਲੈਟ ਦਾ ਅੰਕਿਤ ਮੁੱਲ ₹{markedPrice} ਹੈ ਅਤੇ ਇਹ ₹{sellingPrice} ਵਿੱਚ ਵੇਚਿਆ ਗਿਆ। ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
      "ਇੱਕ ਟੈਬਲੈਟ ਦਾ ਅੰਕਿਤ ਮੁੱਲ ₹{markedPrice} ਹੈ, ਪਰ ਗਾਹਕ ₹{sellingPrice} ਭਰਦਾ ਹੈ। ਛੂਟ ਦੀ ਦਰ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-002": {
    "en": [
      "A study table costs a shopkeeper ₹{costPrice} and is sold for ₹{sellingPrice}. Find the profit or loss.",
      "The purchase price of a study table is ₹{costPrice}, while its selling price is ₹{sellingPrice}. Determine the gain or loss amount."
    ],
    "hi": [
      "एक दुकानदार ने स्टडी टेबल ₹{costPrice} में खरीदी और ₹{sellingPrice} में बेची। लाभ या हानि ज्ञात कीजिए।",
      "स्टडी टेबल का क्रय मूल्य ₹{costPrice} और विक्रय मूल्य ₹{sellingPrice} है। लाभ या हानि की राशि ज्ञात कीजिए।"
    ],
    "pa": [
      "ਇੱਕ ਦੁਕਾਨਦਾਰ ਨੇ ਸਟਡੀ ਟੇਬਲ ₹{costPrice} ਵਿੱਚ ਖਰੀਦੀ ਅਤੇ ₹{sellingPrice} ਵਿੱਚ ਵੇਚੀ। ਲਾਭ ਜਾਂ ਘਾਟਾ ਪਤਾ ਕਰੋ।",
      "ਸਟਡੀ ਟੇਬਲ ਦਾ ਖਰੀਦ ਮੁੱਲ ₹{costPrice} ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ₹{sellingPrice} ਹੈ। ਲਾਭ ਜਾਂ ਘਾਟੇ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।"
    ]
  },
  "PNL-QL-006": {
    "en": [
      "A machine costing ₹{costPrice} is sold at a loss of {lossPercent}%. Find its selling price.",
      "If a machine bought for ₹{costPrice} is sold at {lossPercent}% loss, what amount is received?"
    ],
    "hi": [
      "₹{costPrice} की मशीन को {lossPercent}% हानि पर बेचा जाता है। उसका विक्रय मूल्य ज्ञात कीजिए।",
      "₹{costPrice} में खरीदी गई मशीन को {lossPercent}% हानि पर बेचने पर कितनी राशि मिलेगी?"
    ],
    "pa": [
      "₹{costPrice} ਦੀ ਮਸ਼ੀਨ ਨੂੰ {lossPercent}% ਘਾਟੇ 'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਇਸਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "₹{costPrice} ਵਿੱਚ ਖਰੀਦੀ ਮਸ਼ੀਨ ਨੂੰ {lossPercent}% ਘਾਟੇ 'ਤੇ ਵੇਚਣ ਨਾਲ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ?"
    ]
  },
  "PNL-QL-039": {
    "en": [
      "A bookshelf is sold for ₹{sellingPrice} after a discount of {discountPercent}%. Find its marked price.",
      "After {discountPercent}% is reduced from the marked price, a bookshelf sells for ₹{sellingPrice}. What was its marked price?"
    ],
    "hi": [
      "एक बुकशेल्फ़ {discountPercent}% छूट के बाद ₹{sellingPrice} में बेची जाती है। उसका अंकित मूल्य ज्ञात कीजिए।",
      "अंकित मूल्य पर {discountPercent}% छूट देने के बाद बुकशेल्फ़ ₹{sellingPrice} में बिकती है। मूल अंकित मूल्य क्या था?"
    ],
    "pa": [
      "ਇੱਕ ਬੁੱਕਸ਼ੈਲਫ਼ {discountPercent}% ਛੂਟ ਤੋਂ ਬਾਅਦ ₹{sellingPrice} ਵਿੱਚ ਵੇਚੀ ਜਾਂਦੀ ਹੈ। ਇਸਦਾ ਅੰਕਿਤ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "ਅੰਕਿਤ ਮੁੱਲ 'ਤੇ {discountPercent}% ਛੂਟ ਦੇਣ ਤੋਂ ਬਾਅਦ ਬੁੱਕਸ਼ੈਲਫ਼ ₹{sellingPrice} ਵਿੱਚ ਵਿਕਦੀ ਹੈ। ਮੂਲ ਅੰਕਿਤ ਮੁੱਲ ਕੀ ਸੀ?"
    ]
  },
  "PNL-QL-040": {
    "en": [
      "An appliance set marked at ₹{markedPrice} gets successive discounts of {firstDiscountPercent}% and {secondDiscountPercent}%. Find the final selling price.",
      "Two discounts, {firstDiscountPercent}% followed by {secondDiscountPercent}%, are offered on an item marked ₹{markedPrice}. What is the final price?"
    ],
    "hi": [
      "₹{markedPrice} अंकित मूल्य वाले उपकरण सेट पर क्रमशः {firstDiscountPercent}% और {secondDiscountPercent}% छूट मिलती है। अंतिम विक्रय मूल्य ज्ञात कीजिए।",
      "₹{markedPrice} अंकित मूल्य वाली वस्तु पर पहले {firstDiscountPercent}% और फिर {secondDiscountPercent}% छूट दी जाती है। अंतिम मूल्य क्या होगा?"
    ],
    "pa": [
      "₹{markedPrice} ਅੰਕਿਤ ਮੁੱਲ ਵਾਲੇ ਉਪਕਰਣ ਸੈੱਟ 'ਤੇ ਲਗਾਤਾਰ {firstDiscountPercent}% ਅਤੇ {secondDiscountPercent}% ਛੂਟ ਮਿਲਦੀ ਹੈ। ਅੰਤਿਮ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
      "₹{markedPrice} ਅੰਕਿਤ ਮੁੱਲ ਵਾਲੀ ਵਸਤੂ 'ਤੇ ਪਹਿਲਾਂ {firstDiscountPercent}% ਅਤੇ ਫਿਰ {secondDiscountPercent}% ਛੂਟ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਅੰਤਿਮ ਕੀਮਤ ਕੀ ਹੋਵੇਗੀ?"
    ]
  }
};

function hash(value: string): number {
  let h = 2166136261;
  for (const character of value) {
    h ^= character.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function selectPnlAuthoredStem(input: Readonly<{
  qlId: string;
  seed: string;
  language: AuthoredStemLanguage;
  variables: Readonly<Record<string, unknown>>;
  canonicalStem: string;
}>): Readonly<{ stem: string; variant: number }> {
  const variants = STEMS[input.qlId]?.[input.language];
  if (!variants) return { stem: input.canonicalStem, variant: 0 };
  const variant = hash(input.seed + ":" + input.qlId + ":authored-stem") % 3;
  if (variant === 0) return { stem: input.canonicalStem, variant };
  const stem = variants[variant - 1]!.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (token, key: string) =>
    key in input.variables ? String(input.variables[key]) : token,
  );
  if (/\{[A-Za-z][A-Za-z0-9_]*\}/.test(stem)) {
    throw new Error(input.qlId + "/" + input.language + ": authored stem has unresolved variables.");
  }
  return { stem, variant };
}
