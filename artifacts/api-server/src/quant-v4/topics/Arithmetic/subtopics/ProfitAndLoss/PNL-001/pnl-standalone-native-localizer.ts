import type { Pnl001NativeDynamicLanguage } from "./pnl-standalone-multilingual-dynamic-types";

type NativePair = Readonly<{ hi: string; pa: string }>;

const pair = (hi: string, pa: string): NativePair => ({ hi, pa });
const pick = (language: Pnl001NativeDynamicLanguage, value: NativePair) =>
  value[language];

const EXACT: Readonly<Record<string, NativePair>> = {
  "All rates are applied to the original cost": pair(
    "सभी दरें मूल लागत पर लगाई गई हैं",
    "ਸਾਰੀਆਂ ਦਰਾਂ ਮੂਲ ਲਾਗਤ ਉੱਤੇ ਲਗਾਈਆਂ ਗਈਆਂ ਹਨ",
  ),
  "Both alternatives are equal": pair(
    "दोनों विकल्प समान हैं",
    "ਦੋਵੇਂ ਵਿਕਲਪ ਬਰਾਬਰ ਹਨ",
  ),
  "Both offers are equal": pair(
    "दोनों प्रस्ताव समान हैं",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਬਰਾਬਰ ਹਨ",
  ),
  "Both offers give the same effective cost": pair(
    "दोनों प्रस्तावों से समान प्रभावी लागत मिलती है",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਨਾਲ ਇੱਕੋ ਅਸਲ ਲਾਗਤ ਬਣਦੀ ਹੈ",
  ),
  "Both offers give the same selling price": pair(
    "दोनों प्रस्तावों से समान विक्रय मूल्य मिलता है",
    "ਦੋਵੇਂ ਪੇਸ਼ਕਸ਼ਾਂ ਨਾਲ ਇੱਕੋ ਵੇਚ ਮੁੱਲ ਮਿਲਦਾ ਹੈ",
  ),
  "Both orders give the same price": pair(
    "दोनों क्रमों से समान मूल्य मिलता है",
    "ਦੋਵੇਂ ਕ੍ਰਮਾਂ ਨਾਲ ਇੱਕੋ ਕੀਮਤ ਮਿਲਦੀ ਹੈ",
  ),
  "Both schemes give the same profit rate": pair(
    "दोनों योजनाओं में लाभ दर समान है",
    "ਦੋਵੇਂ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਮੁਨਾਫ਼ੇ ਦੀ ਦਰ ਇੱਕੋ ਹੈ",
  ),
  "Both statements are correct": pair(
    "दोनों कथन सही हैं",
    "ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ",
  ),
  "Both statements together are required": pair(
    "दोनों कथन साथ में आवश्यक हैं",
    "ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ",
  ),
  "Cannot be determined": pair(
    "निर्धारित नहीं किया जा सकता",
    "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  ),
  "Cashback is calculated on the billed price": pair(
    "कैशबैक बिल की गई कीमत पर निकाला गया है",
    "ਕੈਸ਼ਬੈਕ ਬਿੱਲ ਕੀਤੀ ਕੀਮਤ ਉੱਤੇ ਕੱਢਿਆ ਗਿਆ ਹੈ",
  ),
  "Either statement alone is sufficient": pair(
    "कोई भी एक कथन अकेला पर्याप्त है",
    "ਕੋਈ ਵੀ ਇੱਕ ਕਥਨ ਅਕੇਲਾ ਕਾਫ਼ੀ ਹੈ",
  ),
  "Neither statement is correct": pair(
    "कोई भी कथन सही नहीं है",
    "ਕੋਈ ਵੀ ਕਥਨ ਸਹੀ ਨਹੀਂ ਹੈ",
  ),
  "No profit, no loss": pair(
    "न लाभ, न हानि",
    "ਨਾ ਮੁਨਾਫ਼ਾ, ਨਾ ਘਾਟਾ",
  ),
  "Only the final trader's result is required": pair(
    "केवल अंतिम व्यापारी का परिणाम आवश्यक है",
    "ਕੇਵਲ ਆਖਰੀ ਵਪਾਰੀ ਦਾ ਨਤੀਜਾ ਲੋੜੀਂਦਾ ਹੈ",
  ),
  "Order cannot be compared": pair(
    "क्रमों की तुलना नहीं की जा सकती",
    "ਕ੍ਰਮਾਂ ਦੀ ਤੁਲਨਾ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ",
  ),
  "The better offer cannot be determined": pair(
    "बेहतर प्रस्ताव निर्धारित नहीं किया जा सकता",
    "ਵਧੀਆ ਪੇਸ਼ਕਸ਼ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ",
  ),
  "The cap does not apply": pair(
    "अधिकतम सीमा लागू नहीं होती",
    "ਵੱਧ ਤੋਂ ਵੱਧ ਹੱਦ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦੀ",
  ),
  "The discount and cashback percentages are added": pair(
    "छूट और कैशबैक प्रतिशत सीधे जोड़ दिए गए हैं",
    "ਛੂਟ ਅਤੇ ਕੈਸ਼ਬੈਕ ਪ੍ਰਤੀਸ਼ਤ ਸਿੱਧੇ ਜੋੜੇ ਗਏ ਹਨ",
  ),
  "The signed percentages are added directly": pair(
    "चिह्न सहित प्रतिशत सीधे जोड़ दिए गए हैं",
    "ਚਿੰਨ੍ਹ ਸਮੇਤ ਪ੍ਰਤੀਸ਼ਤ ਸਿੱਧੇ ਜੋੜੇ ਗਏ ਹਨ",
  ),
  "A retailer is planning a promotional sale for a single article.": pair(
    "एक खुदरा विक्रेता एक वस्तु के लिए प्रचारात्मक बिक्री की योजना बना रहा है।",
    "ਇੱਕ ਖੁਦਰਾ ਵਿਕਰੇਤਾ ਇੱਕ ਵਸਤੂ ਲਈ ਪ੍ਰਚਾਰਕ ਵਿਕਰੀ ਦੀ ਯੋਜਨਾ ਬਣਾ ਰਿਹਾ ਹੈ।",
  ),
  "After a loss, the required recovery percentage is measured on the smaller remaining capital.": pair(
    "हानि के बाद आवश्यक वसूली प्रतिशत छोटी बची हुई पूँजी पर मापा जाता है।",
    "ਘਾਟੇ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦਾ ਵਸੂਲੀ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਬਚੀ ਪੂੰਜੀ ਉੱਤੇ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ।",
  ),
  "Each product contributes its selling price less variable cost toward the common fixed cost.": pair(
    "प्रत्येक उत्पाद का विक्रय मूल्य घटाकर परिवर्ती लागत, साझा स्थिर लागत में योगदान देती है।",
    "ਹਰ ਉਤਪਾਦ ਦਾ ਵੇਚ ਮੁੱਲ ਘਟਾ ਕੇ ਬਦਲਦੀ ਲਾਗਤ, ਸਾਂਝੀ ਸਥਿਰ ਲਾਗਤ ਵਿੱਚ ਯੋਗਦਾਨ ਦਿੰਦੀ ਹੈ।",
  ),
  "Markup is calculated on cost price, while the advertised discount is calculated on marked price.": pair(
    "बढ़ोतरी लागत मूल्य पर और घोषित छूट अंकित मूल्य पर निकाली जाती है।",
    "ਵਾਧਾ ਲਾਗਤ ਮੁੱਲ ਉੱਤੇ ਅਤੇ ਦੱਸੀ ਛੂਟ ਅੰਕਿਤ ਕੀਮਤ ਉੱਤੇ ਕੱਢੀ ਜਾਂਦੀ ਹੈ।",
  ),
  "Products must be sold in the fixed bundle mix shown by the question.": pair(
    "उत्पादों को प्रश्न में दिए निश्चित बंडल मिश्रण में बेचना होगा।",
    "ਉਤਪਾਦਾਂ ਨੂੰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਨਿਰਧਾਰਤ ਬੰਡਲ ਮਿਸ਼ਰਣ ਵਿੱਚ ਵੇਚਣਾ ਹੋਵੇਗਾ।",
  ),
  "The business operates from a rented premises.": pair(
    "व्यवसाय किराए के परिसर से चलता है।",
    "ਕਾਰੋਬਾਰ ਕਿਰਾਏ ਦੇ ਸਥਾਨ ਤੋਂ ਚੱਲਦਾ ਹੈ।",
  ),
  "The discount is applied to the marked price, while actual profit is measured on delivered cost.": pair(
    "छूट अंकित मूल्य पर लगती है, जबकि वास्तविक लाभ दी गई मात्रा की लागत पर मापा जाता है।",
    "ਛੂਟ ਅੰਕਿਤ ਕੀਮਤ ਉੱਤੇ ਲੱਗਦੀ ਹੈ, ਜਦਕਿ ਅਸਲ ਮੁਨਾਫ਼ਾ ਦਿੱਤੀ ਮਾਤਰਾ ਦੀ ਲਾਗਤ ਉੱਤੇ ਮਾਪਿਆ ਜਾਂਦਾ ਹੈ।",
  ),
  "The goods are packed in an unbranded container.": pair(
    "सामान बिना ब्रांड वाले डिब्बे में पैक है।",
    "ਸਾਮਾਨ ਬਿਨਾਂ ਬ੍ਰਾਂਡ ਵਾਲੇ ਡੱਬੇ ਵਿੱਚ ਪੈਕ ਹੈ।",
  ),
  "The item was handled by two traders in the same city.": pair(
    "वस्तु का लेन-देन उसी शहर के दो व्यापारियों ने किया।",
    "ਵਸਤੂ ਦਾ ਲੈਣ-ਦੇਣ ਉਸੇ ਸ਼ਹਿਰ ਦੇ ਦੋ ਵਪਾਰੀਆਂ ਨੇ ਕੀਤਾ।",
  ),
  "The retailer first changes the price and then reduces the physical quantity supplied.": pair(
    "खुदरा विक्रेता पहले मूल्य बदलता है और फिर दी जाने वाली वास्तविक मात्रा घटाता है।",
    "ਖੁਦਰਾ ਵਿਕਰੇਤਾ ਪਹਿਲਾਂ ਕੀਮਤ ਬਦਲਦਾ ਹੈ ਅਤੇ ਫਿਰ ਦਿੱਤੀ ਜਾਣ ਵਾਲੀ ਅਸਲ ਮਾਤਰਾ ਘਟਾਉਂਦਾ ਹੈ।",
  ),
  "The same percentage profit after a loss is always sufficient to restore the original capital.": pair(
    "हानि के बाद उतने ही प्रतिशत का लाभ मूल पूँजी बहाल करने के लिए हमेशा पर्याप्त होता है।",
    "ਘਾਟੇ ਤੋਂ ਬਾਅਦ ਉੱਨਾ ਹੀ ਪ੍ਰਤੀਸ਼ਤ ਮੁਨਾਫ਼ਾ ਮੂਲ ਪੂੰਜੀ ਮੁੜ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਹਮੇਸ਼ਾਂ ਕਾਫ਼ੀ ਹੁੰਦਾ ਹੈ।",
  ),
  "The stock is stored in two warehouse sections.": pair(
    "भंडार दो गोदाम खंडों में रखा गया है।",
    "ਸਟਾਕ ਗੋਦਾਮ ਦੇ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਰੱਖਿਆ ਗਿਆ ਹੈ।",
  ),
  "Three traders handle the same consignment in the order stated below.": pair(
    "तीन व्यापारी नीचे दिए क्रम में उसी खेप का लेन-देन करते हैं।",
    "ਤਿੰਨ ਵਪਾਰੀ ਹੇਠਾਂ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਉਸੇ ਖੇਪ ਦਾ ਲੈਣ-ਦੇਣ ਕਰਦੇ ਹਨ।",
  ),
  decrease: pair("कमी", "ਕਮੀ"),
  increase: pair("वृद्धि", "ਵਾਧਾ"),
  loss: pair("हानि", "ਘਾਟਾ"),
  no_change: pair("कोई परिवर्तन नहीं", "ਕੋਈ ਬਦਲਾਅ ਨਹੀਂ"),
  profit: pair("लाभ", "ਮੁਨਾਫ਼ਾ"),
  "purchase price": pair("खरीद मूल्य", "ਖਰੀਦ ਮੁੱਲ"),
  "purchase price plus flat expenses": pair(
    "खरीद मूल्य और निश्चित खर्चों का योग",
    "ਖਰੀਦ ਮੁੱਲ ਅਤੇ ਨਿਰਧਾਰਤ ਖਰਚਿਆਂ ਦਾ ਜੋੜ",
  ),
  "Direct amount": pair("सीधी राशि", "ਸਿੱਧੀ ਰਕਮ"),
  "Factory overhead": pair("कारखाना ऊपरी खर्च", "ਫੈਕਟਰੀ ਦਾ ਵਾਧੂ ਖਰਚ"),
  Labour: pair("श्रम", "ਮਜ਼ਦੂਰੀ"),
  Packaging: pair("पैकिंग", "ਪੈਕਿੰਗ"),
  "Prime cost": pair("मूल उत्पादन लागत", "ਮੂਲ ਉਤਪਾਦਨ ਲਾਗਤ"),
  "Raw material": pair("कच्चा माल", "ਕੱਚਾ ਮਾਲ"),
  "Product A": pair("उत्पाद A", "ਉਤਪਾਦ A"),
  "Product B": pair("उत्पाद B", "ਉਤਪਾਦ B"),
  "Scheme A": pair("योजना A", "ਯੋਜਨਾ A"),
  "Scheme B": pair("योजना B", "ਯੋਜਨਾ B"),
};

function isSymbolic(value: string): boolean {
  const compact = value.replace(/\s+/g, "");
  if (/^[A-DqrxSC]$/u.test(compact)) return true;
  if (/^\{(?:known|missing)\}$/u.test(compact)) return true;
  if (/^[\d.,₹%+\-*/=():;{}_[\]\\]+$/u.test(compact)) return true;
  if (/^[\d.,₹%+\-*/=():;{}_[\]\\A-DqrxSC]+$/u.test(compact)) return true;
  if (/^\d+(?:\.\d+)?[xq]$/u.test(compact)) return true;
  if (/^\d+(?:\.\d+)?x\+\d+(?:\.\d+)?x$/u.test(compact)) return true;
  return false;
}

function directionPair(direction: string): NativePair | null {
  if (direction.toLowerCase() === "profit") return pair("लाभ", "ਮੁਨਾਫ਼ਾ");
  if (direction.toLowerCase() === "loss") return pair("हानि", "ਘਾਟਾ");
  return null;
}

function localizeTransactionSegments(
  value: string,
  language: Pnl001NativeDynamicLanguage,
): string | null {
  const parts = value.split(/;\s*/u);
  if (!parts.length) return null;
  const rendered: string[] = [];
  for (const part of parts) {
    const amount = /^Transaction (\d+): (profit|loss) ₹(.+)$/iu.exec(part);
    if (amount) {
      const result = directionPair(amount[2]!);
      if (!result) return null;
      rendered.push(
        language === "hi"
          ? `लेन-देन ${amount[1]}: ₹${amount[3]} ${result.hi}`
          : `ਲੈਣ-ਦੇਣ ${amount[1]}: ₹${amount[3]} ${result.pa}`,
      );
      continue;
    }
    const rate = /^transaction (\d+): (.+)% (profit|loss)$/iu.exec(part);
    if (rate) {
      const result = directionPair(rate[3]!);
      if (!result) return null;
      rendered.push(
        language === "hi"
          ? `लेन-देन ${rate[1]}: ${rate[2]}% ${result.hi}`
          : `ਲੈਣ-ਦੇਣ ${rate[1]}: ${rate[2]}% ${result.pa}`,
      );
      continue;
    }
    return null;
  }
  return rendered.join("; ");
}

export function localizePnl001StandaloneChoice(
  value: string,
  language: Pnl001NativeDynamicLanguage,
): string {
  const exact = EXACT[value];
  if (exact) return pick(language, exact);
  if (!/[A-Za-z]/u.test(value)) return value;

  let match: RegExpExecArray | null;

  match = /^(\d+(?:\.\d+)?) (bundles|units)$/u.exec(value);
  if (match) {
    const noun = match[2] === "bundles"
      ? pair("बंडल", "ਬੰਡਲ")
      : pair("इकाइयाँ", "ਇਕਾਈਆਂ");
    return `${match[1]} ${pick(language, noun)}`;
  }
  match = /^(.+)% (profit|loss)$/iu.exec(value);
  if (match) {
    const result = directionPair(match[2]!)!;
    return `${match[1]}% ${pick(language, result)}`;
  }
  match = /^₹(.+) (profit|loss)$/iu.exec(value);
  if (match) {
    const result = directionPair(match[2]!)!;
    return `₹${match[1]} ${pick(language, result)}`;
  }
  match = /^(Profit|Loss) ₹(.+?)(?: at (.+)%)?$/u.exec(value);
  if (match) {
    const result = directionPair(match[1]!)!;
    const base = `${pick(language, result)} ₹${match[2]}`;
    return match[3]
      ? language === "hi"
        ? `${base}, ${match[3]}% की दर से`
        : `${base}, ${match[3]}% ਦੀ ਦਰ ਨਾਲ`
      : base;
  }
  match = /^(Profit|Loss) of ₹(.+)$/u.exec(value);
  if (match) {
    const result = directionPair(match[1]!)!;
    return `${pick(language, result)} ₹${match[2]}`;
  }
  match = /^Alternative (\d+)$/u.exec(value);
  if (match) return language === "hi" ? `विकल्प ${match[1]}` : `ਵਿਕਲਪ ${match[1]}`;
  match = /^Statement (\d+) alone is sufficient$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `केवल कथन ${match[1]} पर्याप्त है`
      : `ਕੇਵਲ ਕਥਨ ${match[1]} ਕਾਫ਼ੀ ਹੈ`;
  }
  match = /^Statement (\d+) only$/u.exec(value);
  if (match) return language === "hi" ? `केवल कथन ${match[1]}` : `ਕੇਵਲ ਕਥਨ ${match[1]}`;
  match = /^Statements (\d+) and (\d+) only$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `केवल कथन ${match[1]} और ${match[2]}`
      : `ਕੇਵਲ ਕਥਨ ${match[1]} ਅਤੇ ${match[2]}`;
  }
  match = /^Scheme ([AB]) by (.+)%$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `योजना ${match[1]}, ${match[2]}% से`
      : `ਯੋਜਨਾ ${match[1]}, ${match[2]}% ਨਾਲ`;
  }
  match = /^Billed price ₹(.+); cashback ₹(.+); effective cost ₹(.+)$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `बिल मूल्य ₹${match[1]}; कैशबैक ₹${match[2]}; प्रभावी लागत ₹${match[3]}`
      : `ਬਿੱਲ ਕੀਮਤ ₹${match[1]}; ਕੈਸ਼ਬੈਕ ₹${match[2]}; ਅਸਲ ਲਾਗਤ ₹${match[3]}`;
  }
  match = /^Cashback ₹(.+); effective cost ₹(.+)$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `कैशबैक ₹${match[1]}; प्रभावी लागत ₹${match[2]}`
      : `ਕੈਸ਼ਬੈਕ ₹${match[1]}; ਅਸਲ ਲਾਗਤ ₹${match[2]}`;
  }
  match = /^Coupon (applies|does not apply); effective price ₹(.+)$/u.exec(value);
  if (match) {
    const eligible = match[1] === "applies";
    return language === "hi"
      ? `कूपन ${eligible ? "लागू होगा" : "लागू नहीं होगा"}; प्रभावी मूल्य ₹${match[2]}`
      : `ਕੂਪਨ ${eligible ? "ਲਾਗੂ ਹੋਵੇਗਾ" : "ਲਾਗੂ ਨਹੀਂ ਹੋਵੇਗਾ"}; ਅਸਲ ਕੀਮਤ ₹${match[2]}`;
  }
  match = /^Coupon is (not )?eligible; (coupon|discount) offer is better by ₹(.+)$/u.exec(value);
  if (match) {
    const eligible = !match[1];
    const offer = match[2] === "coupon"
      ? pair("कूपन प्रस्ताव", "ਕੂਪਨ ਪੇਸ਼ਕਸ਼")
      : pair("छूट प्रस्ताव", "ਛੂਟ ਪੇਸ਼ਕਸ਼");
    return language === "hi"
      ? `कूपन ${eligible ? "पात्र है" : "पात्र नहीं है"}; ${offer.hi} ₹${match[3]} से बेहतर है`
      : `ਕੂਪਨ ${eligible ? "ਯੋਗ ਹੈ" : "ਯੋਗ ਨਹੀਂ ਹੈ"}; ${offer.pa} ₹${match[3]} ਨਾਲ ਵਧੀਆ ਹੈ`;
  }
  match = /^(Cashback offer|Discount offer|Coupon then discount|Discount then coupon|Single-discount offer|Successive-discount offer) is better by ₹(.+)$/u.exec(value);
  if (match) {
    const labels: Readonly<Record<string, NativePair>> = {
      "Cashback offer": pair("कैशबैक प्रस्ताव", "ਕੈਸ਼ਬੈਕ ਪੇਸ਼ਕਸ਼"),
      "Discount offer": pair("छूट प्रस्ताव", "ਛੂਟ ਪੇਸ਼ਕਸ਼"),
      "Coupon then discount": pair("पहले कूपन, फिर छूट वाला क्रम", "ਪਹਿਲਾਂ ਕੂਪਨ, ਫਿਰ ਛੂਟ ਵਾਲਾ ਕ੍ਰਮ"),
      "Discount then coupon": pair("पहले छूट, फिर कूपन वाला क्रम", "ਪਹਿਲਾਂ ਛੂਟ, ਫਿਰ ਕੂਪਨ ਵਾਲਾ ਕ੍ਰਮ"),
      "Single-discount offer": pair("एकल छूट प्रस्ताव", "ਇੱਕੋ ਛੂਟ ਦੀ ਪੇਸ਼ਕਸ਼"),
      "Successive-discount offer": pair("क्रमिक छूट प्रस्ताव", "ਲਗਾਤਾਰ ਛੂਟਾਂ ਦੀ ਪੇਸ਼ਕਸ਼"),
    };
    const label = pick(language, labels[match[1]!]!);
    return language === "hi"
      ? `${label} ₹${match[2]} से बेहतर है`
      : `${label} ₹${match[2]} ਨਾਲ ਵਧੀਆ ਹੈ`;
  }
  match = /^The equivalent discount is (.+)%$/u.exec(value);
  if (match) return language === "hi" ? `समतुल्य छूट ${match[1]}% है` : `ਬਰਾਬਰ ਛੂਟ ${match[1]}% ਹੈ`;

  const transactions = localizeTransactionSegments(value, language);
  if (transactions) return transactions;

  throw new Error(`Unsupported PNL-001 standalone dynamic choice: ${value}`);
}

function localizeDynamicSentence(
  value: string,
  language: Pnl001NativeDynamicLanguage,
): string | null {
  let match: RegExpExecArray | null;

  match = /^(\d+(?:\.\d+)?) (bundles|units)$/u.exec(value);
  if (match) return localizePnl001StandaloneChoice(value, language);
  match = /^(\d+(?:\.\d+)?) units at ₹(.+) each$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `${match[1]} इकाइयाँ, प्रत्येक ₹${match[2]}`
      : `${match[1]} ਇਕਾਈਆਂ, ਹਰ ਇੱਕ ₹${match[2]}`;
  }
  match = /^sold at ₹(.+) each$/iu.exec(value);
  if (match) return language === "hi" ? `प्रत्येक ₹${match[1]} में बेचा` : `ਹਰ ਇੱਕ ₹${match[1]} ਵਿੱਚ ਵੇਚਿਆ`;
  match = /^(Group|Known group|Fixed group|Sold group|Lot|Transfer) (\d+)$/u.exec(value);
  if (match) {
    const labels: Readonly<Record<string, NativePair>> = {
      Group: pair("समूह", "ਸਮੂਹ"),
      "Known group": pair("ज्ञात समूह", "ਪਤਾ ਦਿੱਤਾ ਸਮੂਹ"),
      "Fixed group": pair("निश्चित समूह", "ਨਿਰਧਾਰਤ ਸਮੂਹ"),
      "Sold group": pair("बेचा गया समूह", "ਵੇਚਿਆ ਗਿਆ ਸਮੂਹ"),
      Lot: pair("लॉट", "ਲਾਟ"),
      Transfer: pair("हस्तांतरण", "ਤਬਾਦਲਾ"),
    };
    return `${pick(language, labels[match[1]!]!)} ${match[2]}`;
  }
  match = /^Charge ₹(.+) against cost ₹(.+)$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `लागत ₹${match[2]} के बदले ₹${match[1]} वसूलें`
      : `ਲਾਗਤ ₹${match[2]} ਦੇ ਬਦਲੇ ₹${match[1]} ਵਸੂਲੋ`;
  }
  match = /^Deliver (.+) of (.+) units$/u.exec(value);
  if (match) return language === "hi" ? `${match[2]} में से ${match[1]} इकाइयाँ दें` : `${match[2]} ਵਿੱਚੋਂ ${match[1]} ਇਕਾਈਆਂ ਦਿਓ`;
  match = /^cost ₹(.+) per (.+) units, charge ₹(.+), deliver (.+) units$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `${match[2]} इकाइयों की लागत ₹${match[1]}, वसूली ₹${match[3]}, दी गई मात्रा ${match[4]} इकाइयाँ`
      : `${match[2]} ਇਕਾਈਆਂ ਦੀ ਲਾਗਤ ₹${match[1]}, ਵਸੂਲੀ ₹${match[3]}, ਦਿੱਤੀ ਮਾਤਰਾ ${match[4]} ਇਕਾਈਆਂ`;
  }
  match = /^The dealer bought (.+) units at ₹(.+) each\.$/u.exec(value);
  if (match) return language === "hi" ? `व्यापारी ने ${match[1]} इकाइयाँ ₹${match[2]} प्रति इकाई खरीदीं।` : `ਵਪਾਰੀ ਨੇ ${match[1]} ਇਕਾਈਆਂ ₹${match[2]} ਪ੍ਰਤੀ ਇਕਾਈ ਖਰੀਦੀਆਂ।`;
  match = /^The dealer bought (.+) units at ₹(.+) each and sold (.+) units at ₹(.+) each\.$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `व्यापारी ने ${match[1]} इकाइयाँ ₹${match[2]} प्रति इकाई खरीदीं और ${match[3]} इकाइयाँ ₹${match[4]} प्रति इकाई बेचीं।`
      : `ਵਪਾਰੀ ਨੇ ${match[1]} ਇਕਾਈਆਂ ₹${match[2]} ਪ੍ਰਤੀ ਇਕਾਈ ਖਰੀਦੀਆਂ ਅਤੇ ${match[3]} ਇਕਾਈਆਂ ₹${match[4]} ਪ੍ਰਤੀ ਇਕਾਈ ਵੇਚੀਆਂ।`;
  }
  match = /^(.+) units were sold at ₹(.+) each\.$/u.exec(value);
  if (match) return language === "hi" ? `${match[1]} इकाइयाँ ₹${match[2]} प्रति इकाई बेची गईं।` : `${match[1]} ਇਕਾਈਆਂ ₹${match[2]} ਪ੍ਰਤੀ ਇਕਾਈ ਵੇਚੀਆਂ ਗਈਆਂ।`;
  match = /^(.+) units were sold at ₹(.+) each, while (.+) units recovered ₹(.+) each\.$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `${match[1]} इकाइयाँ ₹${match[2]} प्रति इकाई बेची गईं, जबकि ${match[3]} इकाइयों से ₹${match[4]} प्रति इकाई वसूले गए।`
      : `${match[1]} ਇਕਾਈਆਂ ₹${match[2]} ਪ੍ਰਤੀ ਇਕਾਈ ਵੇਚੀਆਂ ਗਈਆਂ, ਜਦਕਿ ${match[3]} ਇਕਾਈਆਂ ਤੋਂ ₹${match[4]} ਪ੍ਰਤੀ ਇਕਾਈ ਵਸੂਲੇ ਗਏ।`;
  }
  match = /^Fixed cost is ₹(.+), variable cost is ₹(.+) per unit, and selling price is ₹(.+) per unit\.$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `स्थिर लागत ₹${match[1]}, परिवर्ती लागत ₹${match[2]} प्रति इकाई और विक्रय मूल्य ₹${match[3]} प्रति इकाई है।`
      : `ਸਥਿਰ ਲਾਗਤ ₹${match[1]}, ਬਦਲਦੀ ਲਾਗਤ ₹${match[2]} ਪ੍ਰਤੀ ਇਕਾਈ ਅਤੇ ਵੇਚ ਮੁੱਲ ₹${match[3]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`;
  }
  match = /^Fixed cost is ₹(.+)\.$/u.exec(value);
  if (match) return language === "hi" ? `स्थिर लागत ₹${match[1]} है।` : `ਸਥਿਰ ਲਾਗਤ ₹${match[1]} ਹੈ।`;
  match = /^Variable cost is ₹(.+) and selling price is ₹(.+) per unit\.$/u.exec(value);
  if (match) return language === "hi" ? `परिवर्ती लागत ₹${match[1]} और विक्रय मूल्य ₹${match[2]} प्रति इकाई है।` : `ਬਦਲਦੀ ਲਾਗਤ ₹${match[1]} ਅਤੇ ਵੇਚ ਮੁੱਲ ₹${match[2]} ਪ੍ਰਤੀ ਇਕਾਈ ਹੈ।`;
  match = /^The (marked price|final selling price|nominal cost|selling amount) is ₹(.+)\.$/u.exec(value);
  if (match) {
    const labels: Readonly<Record<string, NativePair>> = {
      "marked price": pair("अंकित मूल्य", "ਅੰਕਿਤ ਕੀਮਤ"),
      "final selling price": pair("अंतिम विक्रय मूल्य", "ਅੰਤਿਮ ਵੇਚ ਮੁੱਲ"),
      "nominal cost": pair("नाममात्र लागत", "ਨਾਂਮਾਤਰ ਲਾਗਤ"),
      "selling amount": pair("विक्रय राशि", "ਵੇਚ ਰਕਮ"),
    };
    return `${pick(language, labels[match[1]!]!)} ₹${match[2]} ${language === "hi" ? "है।" : "ਹੈ।"}`;
  }
  match = /^The nominal cost is ₹(.+) and the selling amount is ₹(.+)\.$/u.exec(value);
  if (match) return language === "hi" ? `नाममात्र लागत ₹${match[1]} और विक्रय राशि ₹${match[2]} है।` : `ਨਾਂਮਾਤਰ ਲਾਗਤ ₹${match[1]} ਅਤੇ ਵੇਚ ਰਕਮ ₹${match[2]} ਹੈ।`;
  match = /^The cost price is ₹(.+), and the target result is (.+)% (profit|loss)\.$/u.exec(value);
  if (match) {
    const result = directionPair(match[3]!)!;
    return language === "hi"
      ? `लागत मूल्य ₹${match[1]} है और लक्ष्य ${match[2]}% ${result.hi} है।`
      : `ਲਾਗਤ ਮੁੱਲ ₹${match[1]} ਹੈ ਅਤੇ ਟੀਚਾ ${match[2]}% ${result.pa} ਹੈ।`;
  }
  match = /^The stock has (.+) units with total purchase cost ₹(.+); selling (.+) units brought in ₹(.+)\.$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `भंडार में ${match[1]} इकाइयाँ हैं जिनकी कुल खरीद लागत ₹${match[2]} है; ${match[3]} इकाइयाँ बेचने से ₹${match[4]} मिले।`
      : `ਸਟਾਕ ਵਿੱਚ ${match[1]} ਇਕਾਈਆਂ ਹਨ ਜਿਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਖਰੀਦ ਲਾਗਤ ₹${match[2]} ਹੈ; ${match[3]} ਇਕਾਈਆਂ ਵੇਚਣ ਨਾਲ ₹${match[4]} ਮਿਲੇ।`;
  }
  match = /^The selected result belongs to transaction (\d+); every percentage uses that trader's purchase price\.$/u.exec(value);
  if (match) return language === "hi" ? `चुना गया परिणाम लेन-देन ${match[1]} का है; हर प्रतिशत उस व्यापारी के खरीद मूल्य पर आधारित है।` : `ਚੁਣਿਆ ਨਤੀਜਾ ਲੈਣ-ਦੇਣ ${match[1]} ਦਾ ਹੈ; ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਉਸ ਵਪਾਰੀ ਦੇ ਖਰੀਦ ਮੁੱਲ ਉੱਤੇ ਆਧਾਰਿਤ ਹੈ।`;
  match = /^Product A: (.+) unit\(s\), selling price ₹(.+), variable cost ₹(.+); Product B: (.+) unit\(s\), selling price ₹(.+), variable cost ₹(.+)$/u.exec(value);
  if (match) {
    return language === "hi"
      ? `उत्पाद A: ${match[1]} इकाई, विक्रय मूल्य ₹${match[2]}, परिवर्ती लागत ₹${match[3]}; उत्पाद B: ${match[4]} इकाई, विक्रय मूल्य ₹${match[5]}, परिवर्ती लागत ₹${match[6]}`
      : `ਉਤਪਾਦ A: ${match[1]} ਇਕਾਈ, ਵੇਚ ਮੁੱਲ ₹${match[2]}, ਬਦਲਦੀ ਲਾਗਤ ₹${match[3]}; ਉਤਪਾਦ B: ${match[4]} ਇਕਾਈ, ਵੇਚ ਮੁੱਲ ₹${match[5]}, ਬਦਲਦੀ ਲਾਗਤ ₹${match[6]}`;
  }
  match = /^A (.+)% loss is exactly recovered by a (.+)% profit on the remaining capital\.$/u.exec(value);
  if (match) return language === "hi" ? `${match[1]}% हानि की ठीक भरपाई शेष पूँजी पर ${match[2]}% लाभ से होती है।` : `${match[1]}% ਘਾਟੇ ਦੀ ਠੀਕ ਭਰਪਾਈ ਬਾਕੀ ਪੂੰਜੀ ਉੱਤੇ ${match[2]}% ਮੁਨਾਫ਼ੇ ਨਾਲ ਹੁੰਦੀ ਹੈ।`;

  const stages = localizeTransactionSegments(value.replace(/^The stages are /u, "").replace(/\.$/u, ""), language);
  if (stages && value.startsWith("The stages are ")) {
    return language === "hi" ? `चरण हैं: ${stages}।` : `ਪੜਾਅ ਹਨ: ${stages}।`;
  }
  match = /^The final selling price is ₹(.+) and the stages are (.+)\.$/u.exec(value);
  if (match) {
    const localizedStages = localizeTransactionSegments(match[2]!, language);
    if (localizedStages) {
      return language === "hi"
        ? `अंतिम विक्रय मूल्य ₹${match[1]} है और चरण हैं: ${localizedStages}।`
        : `ਅੰਤਿਮ ਵੇਚ ਮੁੱਲ ₹${match[1]} ਹੈ ਅਤੇ ਪੜਾਅ ਹਨ: ${localizedStages}।`;
    }
  }
  const transactionSegments = localizeTransactionSegments(value, language);
  if (transactionSegments) return transactionSegments;

  try {
    return localizePnl001StandaloneChoice(value, language);
  } catch {
    return null;
  }
}

export function localizePnl001StandaloneContext(
  value: unknown,
  language: Pnl001NativeDynamicLanguage,
): unknown {
  if (typeof value === "string") {
    const exact = EXACT[value];
    if (exact) return pick(language, exact);
    if (!/[A-Za-z]/u.test(value) || isSymbolic(value)) return value;
    const localized = localizeDynamicSentence(value, language);
    if (localized) return localized;
    throw new Error(`Unsupported PNL-001 standalone dynamic context text: ${value}`);
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizePnl001StandaloneContext(item, language));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        localizePnl001StandaloneContext(item, language),
      ]),
    );
  }
  return value;
}
