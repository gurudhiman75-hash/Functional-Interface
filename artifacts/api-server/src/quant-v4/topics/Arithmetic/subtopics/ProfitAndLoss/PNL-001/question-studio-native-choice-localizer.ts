export type Pnl001NativeReviewLanguage = "hi" | "pa";

type LocalizedText = Readonly<{
  hi: string;
  pa: string;
}>;

type Rule = Readonly<{
  pattern: RegExp;
  render: (match: RegExpExecArray) => LocalizedText;
}>;

function localized(hi: string, pa: string): LocalizedText {
  return { hi, pa };
}

const RULES: readonly Rule[] = [
  {
    pattern: /^₹(.+) profit; ₹(.+) loss; ₹(.+) profit$/u,
    render: (match) =>
      localized(
        `₹${match[1]} लाभ; ₹${match[2]} हानि; ₹${match[3]} लाभ`,
        `₹${match[1]} ਮੁਨਾਫ਼ਾ; ₹${match[2]} ਘਾਟਾ; ₹${match[3]} ਮੁਨਾਫ਼ਾ`,
      ),
  },
  {
    pattern: /^₹(.+) profit; ₹(.+) profit; ₹(.+) loss$/u,
    render: (match) =>
      localized(
        `₹${match[1]} लाभ; ₹${match[2]} लाभ; ₹${match[3]} हानि`,
        `₹${match[1]} ਮੁਨਾਫ਼ਾ; ₹${match[2]} ਮੁਨਾਫ਼ਾ; ₹${match[3]} ਘਾਟਾ`,
      ),
  },
  {
    pattern: /^₹(.+) profit; (.+)% profit$/u,
    render: (match) =>
      localized(
        `₹${match[1]} लाभ; ${match[2]}% लाभ`,
        `₹${match[1]} ਮੁਨਾਫ਼ਾ; ${match[2]}% ਮੁਨਾਫ਼ਾ`,
      ),
  },
  {
    pattern: /^₹(.+) loss; (.+)% loss$/u,
    render: (match) =>
      localized(
        `₹${match[1]} हानि; ${match[2]}% हानि`,
        `₹${match[1]} ਘਾਟਾ; ${match[2]}% ਘਾਟਾ`,
      ),
  },
  {
    pattern: /^Billed ₹(.+); cashback ₹(.+); effective cost ₹(.+)$/u,
    render: (match) =>
      localized(
        `बिल राशि ₹${match[1]}; कैशबैक ₹${match[2]}; प्रभावी लागत ₹${match[3]}`,
        `ਬਿੱਲ ਰਕਮ ₹${match[1]}; ਕੈਸ਼ਬੈਕ ₹${match[2]}; ਅਸਲ ਲਾਗਤ ₹${match[3]}`,
      ),
  },
  {
    pattern: /^Cashback ₹(.+); effective cost ₹(.+)$/u,
    render: (match) =>
      localized(
        `कैशबैक ₹${match[1]}; प्रभावी लागत ₹${match[2]}`,
        `ਕੈਸ਼ਬੈਕ ₹${match[1]}; ਅਸਲ ਲਾਗਤ ₹${match[2]}`,
      ),
  },
  {
    pattern: /^Coupon applies; effective price ₹(.+)$/u,
    render: (match) =>
      localized(
        `कूपन लागू होगा; प्रभावी मूल्य ₹${match[1]}`,
        `ਕੂਪਨ ਲਾਗੂ ਹੋਵੇਗਾ; ਅਸਲ ਕੀਮਤ ₹${match[1]}`,
      ),
  },
  {
    pattern: /^Coupon does not apply; price ₹(.+)$/u,
    render: (match) =>
      localized(
        `कूपन लागू नहीं होगा; मूल्य ₹${match[1]}`,
        `ਕੂਪਨ ਲਾਗੂ ਨਹੀਂ ਹੋਵੇਗਾ; ਕੀਮਤ ₹${match[1]}`,
      ),
  },
  {
    pattern: /^The equivalent discount is (.+)%$/u,
    render: (match) =>
      localized(
        `समतुल्य छूट ${match[1]}% है`,
        `ਬਰਾਬਰ ਛੂਟ ${match[1]}% ਹੈ`,
      ),
  },
  {
    pattern: /^(.+)% discount is better by ₹(.+)$/u,
    render: (match) =>
      localized(
        `${match[1]}% छूट ₹${match[2]} से बेहतर है`,
        `${match[1]}% ਛੂਟ ₹${match[2]} ਨਾਲ ਵਧੀਆ ਹੈ`,
      ),
  },
  {
    pattern: /^₹(.+) cashback is better by ₹(.+)$/u,
    render: (match) =>
      localized(
        `₹${match[1]} कैशबैक ₹${match[2]} से बेहतर है`,
        `₹${match[1]} ਕੈਸ਼ਬੈਕ ₹${match[2]} ਨਾਲ ਵਧੀਆ ਹੈ`,
      ),
  },
  {
    pattern: /^Coupon then discount is better by ₹(.+)$/u,
    render: (match) =>
      localized(
        `पहले कूपन, फिर छूट वाला क्रम ₹${match[1]} से बेहतर है`,
        `ਪਹਿਲਾਂ ਕੂਪਨ, ਫਿਰ ਛੂਟ ਵਾਲਾ ਕ੍ਰਮ ₹${match[1]} ਨਾਲ ਵਧੀਆ ਹੈ`,
      ),
  },
  {
    pattern: /^Discount then coupon is better by ₹(.+)$/u,
    render: (match) =>
      localized(
        `पहले छूट, फिर कूपन वाला क्रम ₹${match[1]} से बेहतर है`,
        `ਪਹਿਲਾਂ ਛੂਟ, ਫਿਰ ਕੂਪਨ ਵਾਲਾ ਕ੍ਰਮ ₹${match[1]} ਨਾਲ ਵਧੀਆ ਹੈ`,
      ),
  },
  {
    pattern: /^Single discount is better by ₹(.+)$/u,
    render: (match) =>
      localized(
        `एकल छूट ₹${match[1]} से बेहतर है`,
        `ਇੱਕੋ ਛੂਟ ₹${match[1]} ਨਾਲ ਵਧੀਆ ਹੈ`,
      ),
  },
  {
    pattern: /^Successive discounts are better by ₹(.+)$/u,
    render: (match) =>
      localized(
        `क्रमिक छूटें ₹${match[1]} से बेहतर हैं`,
        `ਲਗਾਤਾਰ ਛੂਟਾਂ ₹${match[1]} ਨਾਲ ਵਧੀਆ ਹਨ`,
      ),
  },
  {
    pattern: /^Shop A is better by ₹(.+)$/u,
    render: (match) =>
      localized(
        `दुकान A ₹${match[1]} से बेहतर है`,
        `ਦੁਕਾਨ A ₹${match[1]} ਨਾਲ ਵਧੀਆ ਹੈ`,
      ),
  },
  {
    pattern: /^Shop B is better by ₹(.+)$/u,
    render: (match) =>
      localized(
        `दुकान B ₹${match[1]} से बेहतर है`,
        `ਦੁਕਾਨ B ₹${match[1]} ਨਾਲ ਵਧੀਆ ਹੈ`,
      ),
  },
  {
    pattern: /^Scheme A, by (.+) percentage points$/u,
    render: (match) =>
      localized(
        `योजना A, ${match[1]} प्रतिशत अंक से`,
        `ਯੋਜਨਾ A, ${match[1]} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਨਾਲ`,
      ),
  },
  {
    pattern: /^Scheme B, by (.+) percentage points$/u,
    render: (match) =>
      localized(
        `योजना B, ${match[1]} प्रतिशत अंक से`,
        `ਯੋਜਨਾ B, ${match[1]} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਨਾਲ`,
      ),
  },
  {
    pattern: /^First transaction: ₹(.+) profit$/u,
    render: (match) =>
      localized(
        `पहला लेन-देन: ₹${match[1]} लाभ`,
        `ਪਹਿਲਾ ਲੈਣ-ਦੇਣ: ₹${match[1]} ਮੁਨਾਫ਼ਾ`,
      ),
  },
  {
    pattern: /^Second transaction: ₹(.+) profit$/u,
    render: (match) =>
      localized(
        `दूसरा लेन-देन: ₹${match[1]} लाभ`,
        `ਦੂਜਾ ਲੈਣ-ਦੇਣ: ₹${match[1]} ਮੁਨਾਫ਼ਾ`,
      ),
  },
  {
    pattern: /^Third transaction: ₹(.+) loss$/u,
    render: (match) =>
      localized(
        `तीसरा लेन-देन: ₹${match[1]} हानि`,
        `ਤੀਜਾ ਲੈਣ-ਦੇਣ: ₹${match[1]} ਘਾਟਾ`,
      ),
  },
  {
    pattern: /^₹(.+) profit in each transaction$/u,
    render: (match) =>
      localized(
        `प्रत्येक लेन-देन में ₹${match[1]} लाभ`,
        `ਹਰ ਲੈਣ-ਦੇਣ ਵਿੱਚ ₹${match[1]} ਮੁਨਾਫ਼ਾ`,
      ),
  },
  {
    pattern: /^A (.+)% profit on the remaining capital is required\.$/u,
    render: (match) =>
      localized(
        `शेष पूँजी पर ${match[1]}% लाभ आवश्यक है।`,
        `ਬਾਕੀ ਪੂੰਜੀ ਉੱਤੇ ${match[1]}% ਮੁਨਾਫ਼ਾ ਚਾਹੀਦਾ ਹੈ।`,
      ),
  },
  {
    pattern: /^A (.+)% profit is required\.$/u,
    render: (match) =>
      localized(
        `${match[1]}% लाभ आवश्यक है।`,
        `${match[1]}% ਮੁਨਾਫ਼ਾ ਚਾਹੀਦਾ ਹੈ।`,
      ),
  },
  {
    pattern: /^A (.+)% profit is sufficient\.$/u,
    render: (match) =>
      localized(
        `${match[1]}% लाभ पर्याप्त है।`,
        `${match[1]}% ਮੁਨਾਫ਼ਾ ਕਾਫ਼ੀ ਹੈ।`,
      ),
  },
  {
    pattern: /^Both give (.+)% profit$/u,
    render: (match) =>
      localized(
        `दोनों में ${match[1]}% लाभ मिलता है`,
        `ਦੋਵਾਂ ਵਿੱਚ ${match[1]}% ਮੁਨਾਫ਼ਾ ਮਿਲਦਾ ਹੈ`,
      ),
  },
  {
    pattern: /^The final selling price is (.+)% above the original cost\.$/u,
    render: (match) =>
      localized(
        `अंतिम विक्रय मूल्य मूल लागत से ${match[1]}% अधिक है।`,
        `ਅੰਤਿਮ ਵੇਚ ਮੁੱਲ ਮੂਲ ਲਾਗਤ ਤੋਂ ${match[1]}% ਵੱਧ ਹੈ।`,
      ),
  },
  {
    pattern: /^The overall result is a (.+)% loss$/u,
    render: (match) =>
      localized(
        `कुल परिणाम ${match[1]}% हानि है`,
        `ਕੁੱਲ ਨਤੀਜਾ ${match[1]}% ਘਾਟਾ ਹੈ`,
      ),
  },
  {
    pattern: /^The overall result is a (.+)% profit$/u,
    render: (match) =>
      localized(
        `कुल परिणाम ${match[1]}% लाभ है`,
        `ਕੁੱਲ ਨਤੀਜਾ ${match[1]}% ਮੁਨਾਫ਼ਾ ਹੈ`,
      ),
  },
  {
    pattern: /^The customer receives (.+)% less quantity\.$/u,
    render: (match) =>
      localized(
        `ग्राहक को ${match[1]}% कम मात्रा मिलती है।`,
        `ਗਾਹਕ ਨੂੰ ${match[1]}% ਘੱਟ ਮਾਤਰਾ ਮਿਲਦੀ ਹੈ।`,
      ),
  },
  {
    pattern: /^The effective price is only (.+)% higher\.$/u,
    render: (match) =>
      localized(
        `प्रभावी मूल्य केवल ${match[1]}% अधिक है।`,
        `ਅਸਲ ਕੀਮਤ ਕੇਵਲ ${match[1]}% ਵੱਧ ਹੈ।`,
      ),
  },
  {
    pattern: /^The effective price per true unit is (.+)% higher\.$/u,
    render: (match) =>
      localized(
        `वास्तविक प्रति इकाई प्रभावी मूल्य ${match[1]}% अधिक है।`,
        `ਅਸਲ ਪ੍ਰਤੀ ਇਕਾਈ ਕੀਮਤ ${match[1]}% ਵੱਧ ਹੈ।`,
      ),
  },
  {
    pattern: /^Statement ([12]) alone is sufficient$/u,
    render: (match) =>
      localized(
        `केवल कथन ${match[1]} पर्याप्त है`,
        `ਕੇਵਲ ਬਿਆਨ ${match[1]} ਕਾਫ਼ੀ ਹੈ`,
      ),
  },
  {
    pattern: /^Statement (I|II) alone is sufficient(\.)?$/u,
    render: (match) =>
      localized(
        `केवल कथन ${match[1]} पर्याप्त है${match[2] ?? ""}`,
        `ਕੇਵਲ ਬਿਆਨ ${match[1]} ਕਾਫ਼ੀ ਹੈ${match[2] ?? ""}`,
      ),
  },
  {
    pattern: /^Statement I alone is sufficient, but Statement II alone is not sufficient\.$/u,
    render: () =>
      localized(
        "केवल कथन I पर्याप्त है, लेकिन केवल कथन II पर्याप्त नहीं है।",
        "ਕੇਵਲ ਬਿਆਨ I ਕਾਫ਼ੀ ਹੈ, ਪਰ ਕੇਵਲ ਬਿਆਨ II ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।",
      ),
  },
  {
    pattern: /^Both statements together are required(\.)?$/u,
    render: (match) =>
      localized(
        `दोनों कथनों की साथ में आवश्यकता है${match[1] ?? ""}`,
        `ਦੋਵੇਂ ਬਿਆਨ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ${match[1] ?? ""}`,
      ),
  },
  {
    pattern: /^Both statements together are sufficient, but neither alone is sufficient(\.)?$/u,
    render: (match) =>
      localized(
        `दोनों कथन साथ में पर्याप्त हैं, पर कोई भी अकेला पर्याप्त नहीं है${match[1] ?? ""}`,
        `ਦੋਵੇਂ ਬਿਆਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ${match[1] ?? ""}`,
      ),
  },
  {
    pattern: /^Either statement alone is sufficient(\.)?$/u,
    render: (match) =>
      localized(
        `कोई भी एक कथन अकेले पर्याप्त है${match[1] ?? ""}`,
        `ਕੋਈ ਵੀ ਇੱਕ ਬਿਆਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ${match[1] ?? ""}`,
      ),
  },
  {
    pattern: /^No profit, no loss(?: \((.+)\))?$/u,
    render: (match) =>
      localized(
        `न लाभ, न हानि${match[1] ? ` (${match[1]})` : ""}`,
        `ਨਾ ਮੁਨਾਫ਼ਾ, ਨਾ ਘਾਟਾ${match[1] ? ` (${match[1]})` : ""}`,
      ),
  },
  {
    pattern: /^(.+)% profit$/u,
    render: (match) =>
      localized(`${match[1]}% लाभ`, `${match[1]}% ਮੁਨਾਫ਼ਾ`),
  },
  {
    pattern: /^(.+)% loss$/u,
    render: (match) =>
      localized(`${match[1]}% हानि`, `${match[1]}% ਘਾਟਾ`),
  },
  {
    pattern: /^₹(.+) profit$/u,
    render: (match) =>
      localized(`₹${match[1]} लाभ`, `₹${match[1]} ਮੁਨਾਫ਼ਾ`),
  },
  {
    pattern: /^₹(.+) loss$/u,
    render: (match) =>
      localized(`₹${match[1]} हानि`, `₹${match[1]} ਘਾਟਾ`),
  },
  {
    pattern: /^(.+) units$/u,
    render: (match) =>
      localized(`${match[1]} इकाइयाँ`, `${match[1]} ਇਕਾਈਆਂ`),
  },
  {
    pattern: /^(.+) articles$/u,
    render: (match) =>
      localized(`${match[1]} वस्तुएँ`, `${match[1]} ਵਸਤਾਂ`),
  },
  {
    pattern: /^(.+) bundles$/u,
    render: (match) =>
      localized(`${match[1]} बंडल`, `${match[1]} ਬੰਡਲ`),
  },
];

const EXACT: Readonly<Record<string, LocalizedText>> = {
  "All three amounts are equal": localized(
    "तीनों राशियाँ समान हैं",
    "ਤਿੰਨੋਂ ਰਕਮਾਂ ਬਰਾਬਰ ਹਨ",
  ),
  "Both are equally profitable": localized(
    "दोनों समान रूप से लाभदायक हैं",
    "ਦੋਵੇਂ ਇੱਕੋ ਜਿਹਾ ਮੁਨਾਫ਼ਾ ਦਿੰਦੇ ਹਨ",
  ),
  "Both offers are equal": localized(
    "दोनों प्रस्ताव समान हैं",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ",
  ),
  "Both offers are equal; difference ₹0": localized(
    "दोनों प्रस्ताव समान हैं; अंतर ₹0",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ; ਫ਼ਰਕ ₹0",
  ),
  "Both orders give the same price": localized(
    "दोनों क्रमों से समान मूल्य मिलता है",
    "ਦੋਵੇਂ ਕ੍ਰਮਾਂ ਨਾਲ ਇੱਕੋ ਕੀਮਤ ਮਿਲਦੀ ਹੈ",
  ),
  "Both offers are equal": localized(
    "दोनों प्रस्ताव समान हैं",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ",
  ),
  "Both are equally profitable": localized(
    "दोनों समान रूप से लाभदायक हैं",
    "ਦੋਵੇਂ ਇੱਕੋ ਜਿਹਾ ਮੁਨਾਫ਼ਾ ਦਿੰਦੇ ਹਨ",
  ),
  "Both offers are equal": localized(
    "दोनों प्रस्ताव समान हैं",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ",
  ),
  "Both offers are equal; difference ₹0": localized(
    "दोनों प्रस्ताव समान हैं; अंतर ₹0",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ; ਫ਼ਰਕ ₹0",
  ),
  "Both orders give the same price": localized(
    "दोनों क्रमों से समान मूल्य मिलता है",
    "ਦੋਵੇਂ ਕ੍ਰਮਾਂ ਨਾਲ ਇੱਕੋ ਕੀਮਤ ਮਿਲਦੀ ਹੈ",
  ),
  "Both offers are equal": localized(
    "दोनों प्रस्ताव समान हैं",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ",
  ),
  "The second discount is calculated on the marked price": localized(
    "दूसरी छूट अंकित मूल्य पर निकाली गई है",
    "ਦੂਜੀ ਛੂਟ ਅੰਕਿਤ ਕੀਮਤ ਉੱਤੇ ਕੱਢੀ ਗਈ ਹੈ",
  ),
  "The two changes cancel exactly.": localized(
    "दोनों परिवर्तन एक-दूसरे को ठीक-ठीक समाप्त कर देते हैं।",
    "ਦੋਵੇਂ ਬਦਲਾਅ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਰੱਦ ਕਰ ਦਿੰਦੇ ਹਨ।",
  ),
  "The two rates leave an overall 10% profit.": localized(
    "दोनों दरों से कुल 10% लाभ होता है।",
    "ਦੋਵੇਂ ਦਰਾਂ ਨਾਲ ਕੁੱਲ 10% ਮੁਨਾਫ਼ਾ ਹੁੰਦਾ ਹੈ।",
  ),
  "There is no overcharge because the listed price is unchanged.": localized(
    "सूचीबद्ध मूल्य नहीं बदला, इसलिए कोई अतिरिक्त वसूली नहीं है।",
    "ਦਰਸਾਈ ਕੀਮਤ ਨਹੀਂ ਬਦਲੀ, ਇਸ ਲਈ ਕੋਈ ਵਾਧੂ ਵਸੂਲੀ ਨਹੀਂ ਹੈ।",
  ),
  "There is no profit or loss": localized(
    "न लाभ है, न हानि",
    "ਨਾ ਮੁਨਾਫ਼ਾ ਹੈ, ਨਾ ਘਾਟਾ",
  ),
};

export function localizePnl001CanonicalChoice(
  value: string,
  language: Pnl001NativeReviewLanguage,
): string {
  if (!/[A-Za-z]/u.test(value)) return value;
  const exact = EXACT[value];
  if (exact) return exact[language];
  for (const rule of RULES) {
    const match = rule.pattern.exec(value);
    if (match) return rule.render(match)[language];
  }
  throw new Error(`Unsupported PNL-001 canonical textual choice: ${value}`);
}
