export type Pnl001NativeReviewLanguage = "hi" | "pa";

type Pair = Readonly<{ hi: string; pa: string }>;
const pair = (hi: string, pa: string): Pair => ({ hi, pa });

const EXACT: Readonly<Record<string, Pair>> = {
  "All three amounts are equal": pair(
    "तीनों राशियाँ समान हैं",
    "ਤਿੰਨੋਂ ਰਕਮਾਂ ਬਰਾਬਰ ਹਨ",
  ),
  "Both are equally profitable": pair(
    "दोनों समान रूप से लाभदायक हैं",
    "ਦੋਵੇਂ ਇੱਕੋ ਜਿਹਾ ਮੁਨਾਫ਼ਾ ਦਿੰਦੇ ਹਨ",
  ),
  "Both offers are equal": pair(
    "दोनों प्रस्ताव समान हैं",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ",
  ),
  "Both offers are equal; difference ₹0": pair(
    "दोनों प्रस्ताव समान हैं; अंतर ₹0",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ; ਫ਼ਰਕ ₹0",
  ),
  "Both orders give the same price": pair(
    "दोनों क्रमों से समान मूल्य मिलता है",
    "ਦੋਵੇਂ ਕ੍ਰਮਾਂ ਨਾਲ ਇੱਕੋ ਕੀਮਤ ਮਿਲਦੀ ਹੈ",
  ),
  "The second discount is calculated on the marked price": pair(
    "दूसरी छूट अंकित मूल्य पर निकाली गई है",
    "ਦੂਜੀ ਛੂਟ ਅੰਕਿਤ ਕੀਮਤ ਉੱਤੇ ਕੱਢੀ ਗਈ ਹੈ",
  ),
  "The two changes cancel exactly.": pair(
    "दोनों परिवर्तन एक-दूसरे को ठीक-ठीक समाप्त कर देते हैं।",
    "ਦੋਵੇਂ ਬਦਲਾਅ ਇੱਕ-ਦੂਜੇ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਰੱਦ ਕਰ ਦਿੰਦੇ ਹਨ।",
  ),
  "The two rates leave an overall 10% profit.": pair(
    "दोनों दरों से कुल 10% लाभ होता है।",
    "ਦੋਵੇਂ ਦਰਾਂ ਨਾਲ ਕੁੱਲ 10% ਮੁਨਾਫ਼ਾ ਹੁੰਦਾ ਹੈ।",
  ),
  "There is no overcharge because the listed price is unchanged.": pair(
    "सूचीबद्ध मूल्य नहीं बदला, इसलिए कोई अतिरिक्त वसूली नहीं है।",
    "ਦਰਸਾਈ ਕੀਮਤ ਨਹੀਂ ਬਦਲੀ, ਇਸ ਲਈ ਕੋਈ ਵਾਧੂ ਵਸੂਲੀ ਨਹੀਂ ਹੈ।",
  ),
  "There is no profit or loss": pair(
    "न लाभ है, न हानि",
    "ਨਾ ਮੁਨਾਫ਼ਾ ਹੈ, ਨਾ ਘਾਟਾ",
  ),
};

function native(language: Pnl001NativeReviewLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function localizeStructuredChoice(
  value: string,
  language: Pnl001NativeReviewLanguage,
): string | null {
  let match: RegExpExecArray | null;

  match = /^₹(.+) profit; ₹(.+) loss; ₹(.+) profit$/u.exec(value);
  if (match) {
    return native(
      language,
      `₹${match[1]} लाभ; ₹${match[2]} हानि; ₹${match[3]} लाभ`,
      `₹${match[1]} ਮੁਨਾਫ਼ਾ; ₹${match[2]} ਘਾਟਾ; ₹${match[3]} ਮੁਨਾਫ਼ਾ`,
    );
  }
  match = /^₹(.+) profit; ₹(.+) profit; ₹(.+) loss$/u.exec(value);
  if (match) {
    return native(
      language,
      `₹${match[1]} लाभ; ₹${match[2]} लाभ; ₹${match[3]} हानि`,
      `₹${match[1]} ਮੁਨਾਫ਼ਾ; ₹${match[2]} ਮੁਨਾਫ਼ਾ; ₹${match[3]} ਘਾਟਾ`,
    );
  }
  match = /^₹(.+) profit; (.+)% profit$/u.exec(value);
  if (match) {
    return native(
      language,
      `₹${match[1]} लाभ; ${match[2]}% लाभ`,
      `₹${match[1]} ਮੁਨਾਫ਼ਾ; ${match[2]}% ਮੁਨਾਫ਼ਾ`,
    );
  }
  match = /^₹(.+) loss; (.+)% loss$/u.exec(value);
  if (match) {
    return native(
      language,
      `₹${match[1]} हानि; ${match[2]}% हानि`,
      `₹${match[1]} ਘਾਟਾ; ${match[2]}% ਘਾਟਾ`,
    );
  }
  match = /^Billed ₹(.+); cashback ₹(.+); effective cost ₹(.+)$/u.exec(value);
  if (match) {
    return native(
      language,
      `बिल राशि ₹${match[1]}; कैशबैक ₹${match[2]}; प्रभावी लागत ₹${match[3]}`,
      `ਬਿੱਲ ਰਕਮ ₹${match[1]}; ਕੈਸ਼ਬੈਕ ₹${match[2]}; ਅਸਲ ਲਾਗਤ ₹${match[3]}`,
    );
  }
  match = /^Cashback ₹(.+); effective cost ₹(.+)$/u.exec(value);
  if (match) {
    return native(
      language,
      `कैशबैक ₹${match[1]}; प्रभावी लागत ₹${match[2]}`,
      `ਕੈਸ਼ਬੈਕ ₹${match[1]}; ਅਸਲ ਲਾਗਤ ₹${match[2]}`,
    );
  }
  match = /^Coupon applies; effective price ₹(.+)$/u.exec(value);
  if (match) {
    return native(
      language,
      `कूपन लागू होगा; प्रभावी मूल्य ₹${match[1]}`,
      `ਕੂਪਨ ਲਾਗੂ ਹੋਵੇਗਾ; ਅਸਲ ਕੀਮਤ ₹${match[1]}`,
    );
  }
  match = /^Coupon does not apply; price ₹(.+)$/u.exec(value);
  if (match) {
    return native(
      language,
      `कूपन लागू नहीं होगा; मूल्य ₹${match[1]}`,
      `ਕੂਪਨ ਲਾਗੂ ਨਹੀਂ ਹੋਵੇਗਾ; ਕੀਮਤ ₹${match[1]}`,
    );
  }
  match = /^The equivalent discount is (.+)%$/u.exec(value);
  if (match) {
    return native(
      language,
      `समतुल्य छूट ${match[1]}% है`,
      `ਬਰਾਬਰ ਛੂਟ ${match[1]}% ਹੈ`,
    );
  }
  match = /^(.+)% discount is better by ₹(.+)$/u.exec(value);
  if (match) {
    return native(
      language,
      `${match[1]}% छूट ₹${match[2]} से बेहतर है`,
      `${match[1]}% ਛੂਟ ₹${match[2]} ਨਾਲ ਵਧੀਆ ਹੈ`,
    );
  }
  match = /^₹(.+) cashback is better by ₹(.+)$/u.exec(value);
  if (match) {
    return native(
      language,
      `₹${match[1]} कैशबैक ₹${match[2]} से बेहतर है`,
      `₹${match[1]} ਕੈਸ਼ਬੈਕ ₹${match[2]} ਨਾਲ ਵਧੀਆ ਹੈ`,
    );
  }
  match = /^(Coupon then discount|Discount then coupon|Single discount|Successive discounts|Shop A|Shop B) is better by ₹(.+)$/u.exec(value);
  if (match) {
    const labels: Readonly<Record<string, Pair>> = {
      "Coupon then discount": pair("पहले कूपन, फिर छूट वाला क्रम", "ਪਹਿਲਾਂ ਕੂਪਨ, ਫਿਰ ਛੂਟ ਵਾਲਾ ਕ੍ਰਮ"),
      "Discount then coupon": pair("पहले छूट, फिर कूपन वाला क्रम", "ਪਹਿਲਾਂ ਛੂਟ, ਫਿਰ ਕੂਪਨ ਵਾਲਾ ਕ੍ਰਮ"),
      "Single discount": pair("एकल छूट", "ਇੱਕੋ ਛੂਟ"),
      "Successive discounts": pair("क्रमिक छूटें", "ਲਗਾਤਾਰ ਛੂਟਾਂ"),
      "Shop A": pair("दुकान A", "ਦੁਕਾਨ A"),
      "Shop B": pair("दुकान B", "ਦੁਕਾਨ B"),
    };
    const label = labels[match[1]!]!;
    return `${label[language]} ${native(language, "₹", "₹")}${match[2]} ${native(language, "से बेहतर है", "ਨਾਲ ਵਧੀਆ ਹੈ")}`;
  }
  match = /^Scheme ([AB]), by (.+) percentage points$/u.exec(value);
  if (match) {
    return native(
      language,
      `योजना ${match[1]}, ${match[2]} प्रतिशत अंक से`,
      `ਯੋਜਨਾ ${match[1]}, ${match[2]} ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ ਨਾਲ`,
    );
  }
  match = /^(First|Second|Third) transaction: ₹(.+) (profit|loss)$/u.exec(value);
  if (match) {
    const order = match[1] === "First"
      ? pair("पहला", "ਪਹਿਲਾ")
      : match[1] === "Second"
        ? pair("दूसरा", "ਦੂਜਾ")
        : pair("तीसरा", "ਤੀਜਾ");
    const result = match[3] === "profit"
      ? pair("लाभ", "ਮੁਨਾਫ਼ਾ")
      : pair("हानि", "ਘਾਟਾ");
    return `${order[language]} ${native(language, "लेन-देन", "ਲੈਣ-ਦੇਣ")}: ₹${match[2]} ${result[language]}`;
  }
  match = /^₹(.+) profit in each transaction$/u.exec(value);
  if (match) {
    return native(
      language,
      `प्रत्येक लेन-देन में ₹${match[1]} लाभ`,
      `ਹਰ ਲੈਣ-ਦੇਣ ਵਿੱਚ ₹${match[1]} ਮੁਨਾਫ਼ਾ`,
    );
  }
  match = /^A (.+)% profit on the remaining capital is required\.$/u.exec(value);
  if (match) return native(language, `शेष पूँजी पर ${match[1]}% लाभ आवश्यक है।`, `ਬਾਕੀ ਪੂੰਜੀ ਉੱਤੇ ${match[1]}% ਮੁਨਾਫ਼ਾ ਚਾਹੀਦਾ ਹੈ।`);
  match = /^A (.+)% profit is required\.$/u.exec(value);
  if (match) return native(language, `${match[1]}% लाभ आवश्यक है।`, `${match[1]}% ਮੁਨਾਫ਼ਾ ਚਾਹੀਦਾ ਹੈ।`);
  match = /^A (.+)% profit is sufficient\.$/u.exec(value);
  if (match) return native(language, `${match[1]}% लाभ पर्याप्त है।`, `${match[1]}% ਮੁਨਾਫ਼ਾ ਕਾਫ਼ੀ ਹੈ।`);
  match = /^Both give (.+)% profit$/u.exec(value);
  if (match) return native(language, `दोनों में ${match[1]}% लाभ मिलता है`, `ਦੋਵਾਂ ਵਿੱਚ ${match[1]}% ਮੁਨਾਫ਼ਾ ਮਿਲਦਾ ਹੈ`);
  match = /^The final selling price is (.+)% above the original cost\.$/u.exec(value);
  if (match) return native(language, `अंतिम विक्रय मूल्य मूल लागत से ${match[1]}% अधिक है।`, `ਅੰਤਿਮ ਵੇਚ ਮੁੱਲ ਮੂਲ ਲਾਗਤ ਤੋਂ ${match[1]}% ਵੱਧ ਹੈ।`);
  match = /^The overall result is a (.+)% (profit|loss)$/u.exec(value);
  if (match) {
    const result = match[2] === "profit" ? pair("लाभ", "ਮੁਨਾਫ਼ਾ") : pair("हानि", "ਘਾਟਾ");
    return native(language, `कुल परिणाम ${match[1]}% ${result.hi} है`, `ਕੁੱਲ ਨਤੀਜਾ ${match[1]}% ${result.pa} ਹੈ`);
  }
  match = /^The customer receives (.+)% less quantity\.$/u.exec(value);
  if (match) return native(language, `ग्राहक को ${match[1]}% कम मात्रा मिलती है।`, `ਗਾਹਕ ਨੂੰ ${match[1]}% ਘੱਟ ਮਾਤਰਾ ਮਿਲਦੀ ਹੈ।`);
  match = /^The effective price is only (.+)% higher\.$/u.exec(value);
  if (match) return native(language, `प्रभावी मूल्य केवल ${match[1]}% अधिक है।`, `ਅਸਲ ਕੀਮਤ ਕੇਵਲ ${match[1]}% ਵੱਧ ਹੈ।`);
  match = /^The effective price per true unit is (.+)% higher\.$/u.exec(value);
  if (match) return native(language, `वास्तविक प्रति इकाई प्रभावी मूल्य ${match[1]}% अधिक है।`, `ਅਸਲ ਪ੍ਰਤੀ ਇਕਾਈ ਕੀਮਤ ${match[1]}% ਵੱਧ ਹੈ।`);
  match = /^Statement ([12I]+) alone is sufficient(\.)?$/u.exec(value);
  if (match) return native(language, `केवल कथन ${match[1]} पर्याप्त है${match[2] ?? ""}`, `ਕੇਵਲ ਬਿਆਨ ${match[1]} ਕਾਫ਼ੀ ਹੈ${match[2] ?? ""}`);
  if (value === "Statement I alone is sufficient, but Statement II alone is not sufficient.") {
    return native(language, "केवल कथन I पर्याप्त है, लेकिन केवल कथन II पर्याप्त नहीं है।", "ਕੇਵਲ ਬਿਆਨ I ਕਾਫ਼ੀ ਹੈ, ਪਰ ਕੇਵਲ ਬਿਆਨ II ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ।");
  }
  match = /^Both statements together are required(\.)?$/u.exec(value);
  if (match) return native(language, `दोनों कथनों की साथ में आवश्यकता है${match[1] ?? ""}`, `ਦੋਵੇਂ ਬਿਆਨ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ${match[1] ?? ""}`);
  match = /^Both statements together are sufficient, but neither alone is sufficient(\.)?$/u.exec(value);
  if (match) return native(language, `दोनों कथन साथ में पर्याप्त हैं, पर कोई भी अकेला पर्याप्त नहीं है${match[1] ?? ""}`, `ਦੋਵੇਂ ਬਿਆਨ ਇਕੱਠੇ ਕਾਫ਼ੀ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ${match[1] ?? ""}`);
  match = /^Either statement alone is sufficient(\.)?$/u.exec(value);
  if (match) return native(language, `कोई भी एक कथन अकेले पर्याप्त है${match[1] ?? ""}`, `ਕੋਈ ਵੀ ਇੱਕ ਬਿਆਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਹੈ${match[1] ?? ""}`);
  match = /^No profit, no loss(?: \((.+)\))?$/u.exec(value);
  if (match) return native(language, `न लाभ, न हानि${match[1] ? ` (${match[1]})` : ""}`, `ਨਾ ਮੁਨਾਫ਼ਾ, ਨਾ ਘਾਟਾ${match[1] ? ` (${match[1]})` : ""}`);
  return null;
}

function localizeCompactChoice(
  value: string,
  language: Pnl001NativeReviewLanguage,
): string | null {
  const substitutions: readonly [RegExp, Pair][] = [
    [/ profit$/u, pair(" लाभ", " ਮੁਨਾਫ਼ਾ")],
    [/ loss$/u, pair(" हानि", " ਘਾਟਾ")],
    [/ units$/u, pair(" इकाइयाँ", " ਇਕਾਈਆਂ")],
    [/ articles$/u, pair(" वस्तुएँ", " ਵਸਤਾਂ")],
    [/ bundles$/u, pair(" बंडल", " ਬੰਡਲ")],
  ];
  for (const [pattern, replacement] of substitutions) {
    if (pattern.test(value)) return value.replace(pattern, replacement[language]);
  }
  return null;
}

export function localizePnl001CanonicalChoiceV2(
  value: string,
  language: Pnl001NativeReviewLanguage,
): string {
  if (!/[A-Za-z]/u.test(value)) return value;
  const exact = EXACT[value];
  if (exact) return exact[language];
  const structured = localizeStructuredChoice(value, language);
  if (structured) return structured;
  const compact = localizeCompactChoice(value, language);
  if (compact) return compact;
  throw new Error(`Unsupported PNL-001 canonical textual choice: ${value}`);
}
