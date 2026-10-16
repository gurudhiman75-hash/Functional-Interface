type Lang = "hi" | "pa";
type Pair = readonly [string, string];
const terms: Record<string, Pair> = {
  Dept: ["विभाग", "ਵਿਭਾਗ"],
  Segment: ["खंड", "ਖੰਡ"],
  Batch: ["बैच", "ਬੈਚ"],
  Unit: ["इकाई", "ਇਕਾਈ"],
  claims: ["दावे", "ਦਾਅਵੇ"],
  cases: ["मामले", "ਮਾਮਲੇ"],
  Branch: ["शाखा", "ਸ਼ਾਖਾ"],
  Course: ["पाठ्यक्रम", "ਕੋਰਸ"],
  Plant: ["संयंत्र", "ਪਲਾਂਟ"],
  Centre: ["केंद्र", "ਕੇਂਦਰ"],
  Category: ["श्रेणी", "ਸ਼੍ਰੇਣੀ"],
  Product: ["उत्पाद", "ਉਤਪਾਦ"],
  Team: ["दल", "ਟੀਮ"],
  Route: ["मार्ग", "ਰਸਤਾ"],
  Partner: ["साझेदार", "ਭਾਈਵਾਲ"],
  Container: ["पात्र", "ਭਾਂਡਾ"],
  Loan: ["ऋण", "ਕਰਜ਼ਾ"],
  Group: ["समूह", "ਸਮੂਹ"],
  Fiction: ["कथा-साहित्य", "ਗਲਪ"],
  Science: ["विज्ञान", "ਵਿਗਿਆਨ"],
  History: ["इतिहास", "ਇਤਿਹਾਸ"],
  Commerce: ["वाणिज्य", "ਵਣਜ"],
  General: ["सामान्य", "ਆਮ"],
  Sales: ["बिक्री", "ਵਿਕਰੀ"],
  Accounts: ["लेखा", "ਲੇਖਾ"],
  Operations: ["संचालन", "ਸੰਚਾਲਨ"],
  Support: ["सहायता", "ਸਹਾਇਤਾ"],
  Administration: ["प्रशासन", "ਪ੍ਰਸ਼ਾਸਨ"],
  Cricket: ["क्रिकेट", "ਕ੍ਰਿਕਟ"],
  Football: ["फुटबॉल", "ਫੁੱਟਬਾਲ"],
  Badminton: ["बैडमिंटन", "ਬੈਡਮਿੰਟਨ"],
  Athletics: ["एथलेटिक्स", "ਅਥਲੈਟਿਕਸ"],
  Volleyball: ["वॉलीबॉल", "ਵਾਲੀਬਾਲ"],
  Approved: ["स्वीकृत", "ਮਨਜ਼ੂਰ"],
  Pending: ["लंबित", "ਬਕਾਇਆ"],
  Rejected: ["अस्वीकृत", "ਨਾਮਨਜ਼ੂਰ"],
  Online: ["ऑनलाइन", "ਆਨਲਾਈਨ"],
  Retail: ["खुदरा", "ਪ੍ਰਚੂਨ"],
  Distributor: ["वितरक", "ਵਿਤਰਕ"],
  Passed: ["उत्तीर्ण", "ਪਾਸ"],
  Reappear: ["पुनर्परीक्षा", "ਮੁੜ-ਪ੍ਰੀਖਿਆ"],
  Absent: ["अनुपस्थित", "ਗ਼ੈਰਹਾਜ਼ਰ"],
  applications: ["आवेदन", "ਅਰਜ਼ੀਆਂ"],
  students: ["विद्यार्थी", "ਵਿਦਿਆਰਥੀ"],
  units: ["इकाइयाँ", "ਇਕਾਈਆਂ"],
  orders: ["ऑर्डर", "ਆਰਡਰ"],
  books: ["पुस्तकें", "ਕਿਤਾਬਾਂ"],
  employees: ["कर्मचारी", "ਕਰਮਚਾਰੀ"],
  participants: ["प्रतिभागी", "ਭਾਗੀਦਾਰ"],
  candidates: ["अभ्यर्थी", "ਉਮੀਦਵਾਰ"],
  items: ["वस्तुएँ", "ਵਸਤੂਆਂ"],
  Applications: ["आवेदन", "ਅਰਜ਼ੀਆਂ"],
  Students: ["विद्यार्थी", "ਵਿਦਿਆਰਥੀ"],
  Production: ["उत्पादन", "ਉਤਪਾਦਨ"],
  Orders: ["ऑर्डर", "ਆਰਡਰ"],
  Workers: ["श्रमिक", "ਕਾਮੇ"],
  Days: ["दिन", "ਦਿਨ"],
  "Speed (km/h)": ["गति (किमी/घंटा)", "ਚਾਲ (ਕਿਮੀ/ਘੰਟਾ)"],
  "Time (hours)": ["समय (घंटे)", "ਸਮਾਂ (ਘੰਟੇ)"],
  "Capital (₹ thousand)": ["पूँजी (₹ हजार)", "ਪੂੰਜੀ (₹ ਹਜ਼ਾਰ)"],
  "Months invested": ["निवेश अवधि (महीने)", "ਨਿਵੇਸ਼ ਅਵਧੀ (ਮਹੀਨੇ)"],
  "Quantity (litres)": ["मात्रा (लीटर)", "ਮਾਤਰਾ (ਲੀਟਰ)"],
  "Pure component (%)": ["शुद्ध घटक (%)", "ਸ਼ੁੱਧ ਭਾਗ (%)"],
  "Principal (₹ thousand)": ["मूलधन (₹ हजार)", "ਮੂਲਧਨ (₹ ਹਜ਼ਾਰ)"],
  "Rate (% p.a.)": ["वार्षिक दर (%)", "ਸਾਲਾਨਾ ਦਰ (%)"],
  "Time (years)": ["समय (वर्ष)", "ਸਮਾਂ (ਸਾਲ)"],
  "Eligible candidates": ["पात्र अभ्यर्थी", "ਯੋਗ ਉਮੀਦਵਾਰ"],
  "Selection rate (%)": ["चयन दर (%)", "ਚੋਣ ਦਰ (%)"],
};
const cp = (l: Lang) => (h: string, p: string) => (l === "hi" ? h : p);
function label(s: string, l: Lang) {
  if (terms[s]) return terms[s]![l === "hi" ? 0 : 1];
  const m = s.match(
    /^(Branch|Course|Plant|Centre|Category|Product|Team|Route|Partner|Container|Loan|Group|Segment|Batch|Unit|Dept) ([A-Z])$/,
  );
  if (m) return `${terms[m[1]!]![l === "hi" ? 0 : 1]} ${m[2]}`;
  if (/^[\d.%°: /+×−=()]+$/.test(s)) return s;
  throw new Error(`Unauthored DI label: ${s}`);
}
function refs(text: string, labels: string[]) {
  return labels
    .flatMap((name) =>
      [
        ...text.matchAll(
          new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        ),
      ].map((m) => ({ name, index: m.index! })),
    )
    .sort((a, b) => a.index - b.index)
    .filter((a, i, all) => i === 0 || a.index !== all[i - 1]!.index)
    .map((x) => x.name);
}
function textLabels(text: string, names: string[], l: Lang) {
  let out = text;
  for (const name of [...names].sort((a, b) => b.length - a.length))
    out = out.split(name).join(label(name, l));
  return out;
}
function working(step: string, names: string[], l: Lang) {
  const t = cp(l);
  let out = textLabels(step, names, l);
  const replacements: Record<string, Pair> = {
    "Simple interest": ["साधारण ब्याज", "ਸਧਾਰਨ ਵਿਆਜ"],
    "Capital-time product": ["पूँजी-समय गुणनफल", "ਪੂੰਜੀ-ਸਮਾਂ ਗੁਣਨਫਲ"],
    "₹ thousand": ["₹ हजार", "₹ ਹਜ਼ਾਰ"],
    "worker-days": ["श्रम-दिन", "ਕਾਮਾ-ਦਿਨ"],
    "eligible candidates": ["पात्र अभ्यर्थी", "ਯੋਗ ਉਮੀਦਵਾਰ"],
    "selected candidates": ["चुने अभ्यर्थी", "ਚੁਣੇ ਉਮੀਦਵਾਰ"],
    "litres of pure component": ["लीटर शुद्ध घटक", "ਲੀਟਰ ਸ਼ੁੱਧ ਭਾਗ"],
    litres: ["लीटर", "ਲੀਟਰ"],
    workers: ["श्रमिक", "ਕਾਮੇ"],
    days: ["दिन", "ਦਿਨ"],
    hours: ["घंटे", "ਘੰਟੇ"],
    "Using the stated relations,": ["दिए संबंधों से,", "ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਤੋਂ,"],
    "First group": ["पहला समूह", "ਪਹਿਲਾ ਸਮੂਹ"],
    "Second group": ["दूसरा समूह", "ਦੂਜਾ ਸਮੂਹ"],
    "First total": ["पहला योग", "ਪਹਿਲਾ ਜੋੜ"],
    "Second total": ["दूसरा योग", "ਦੂਜਾ ਜੋੜ"],
    "Period 1": ["अवधि 1", "ਅਵਧੀ 1"],
    "Period 2": ["अवधि 2", "ਅਵਧੀ 2"],
    "Largest change": ["अधिकतम परिवर्तन", "ਵੱਧੋ-ਵੱਧ ਬਦਲਾਅ"],
    "Grand total": ["कुल योग", "ਕੁੱਲ ਜੋੜ"],
    "Excluded total": ["हटाया गया योग", "ਹਟਾਇਆ ਜੋੜ"],
    "Required ratio": ["अभीष्ट अनुपात", "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ"],
    "Percentage excess": ["प्रतिशत अधिकता", "ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ"],
    "Relative increase": ["सापेक्ष वृद्धि", "ਸਾਪੇਖ ਵਾਧਾ"],
    "Combined share": ["संयुक्त हिस्सा", "ਸਾਂਝਾ ਹਿੱਸਾ"],
    "Remaining share": ["शेष हिस्सा", "ਬਾਕੀ ਹਿੱਸਾ"],
    "Central angle": ["केंद्रीय कोण", "ਕੇਂਦਰੀ ਕੋਣ"],
    Difference: ["अंतर", "ਫ਼ਰਕ"],
    Highest: ["अधिकतम", "ਵੱਧੋ-ਵੱਧ"],
    Lowest: ["न्यूनतम", "ਘੱਟੋ-ਘੱਟ"],
    Average: ["औसत", "ਔਸਤ"],
    Remaining: ["शेष", "ਬਾਕੀ"],
    Excluded: ["हटाया गया", "ਹਟਾਇਆ"],
    Total: ["कुल", "ਕੁੱਲ"],
    Sum: ["योग", "ਜੋੜ"],
    Ratio: ["अनुपात", "ਅਨੁਪਾਤ"],
    Share: ["हिस्सा", "ਹਿੱਸਾ"],
    Angle: ["कोण", "ਕੋਣ"],
    change: ["परिवर्तन", "ਬਦਲਾਅ"],
    total: ["कुल", "ਕੁੱਲ"],
    "percentage points": ["प्रतिशत अंक", "ਪ੍ਰਤੀਸ਼ਤ ਅੰਕ"],
    value: ["मान", "ਮੁੱਲ"],
  };
  for (const [en, p] of Object.entries(replacements))
    out = out.split(en).join(t(...p));
  if (out.includes(" for ")) {
    const [a, b] = out.split(" for ");
    out = `${b?.split(" = ")[0]}${t(" में ", " ਵਿੱਚ ")}${a} = ${b?.split(" = ")[1]}`;
  }
  out = out
    .replace(
      /(\d+(?:\.\d+)?%) of (\d+(?:\.\d+)?)/g,
      (_, a, b) => `${b} × ${a.replace("%", "")}/100`,
    )
    .replace(/ is shown at /g, t(" का मान = ", " ਦਾ ਮੁੱਲ = "))
    .replace(/ is labelled /g, t(" का अंकित प्रतिशत = ", " ਦਾ ਦਰਜ ਪ੍ਰਤੀਸ਼ਤ = "))
    .replace(/ in the chart\./g, ".");
  if (/Adding the five/.test(out))
    return (
      t("सभी पाँच संबंधित मानों को जोड़िए।", "ਸਾਰੇ ਪੰਜ ਸੰਬੰਧਿਤ ਮੁੱਲ ਜੋੜੋ।") +
      " " +
      out.match(/\d+(?:\.\d+)?\.?$/)?.[0]
    );
  if (/ has the (highest|lowest) labelled percentage/.test(step))
    return (
      t(
        "अंकित प्रतिशतों की तुलना करने पर",
        "ਦਰਜ ਪ੍ਰਤੀਸ਼ਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ ਉੱਤੇ",
      ) +
      ": " +
      textLabels(step.split(" has ")[0]!, names, l) +
      t(" अभीष्ट श्रेणी है।", " ਲੋੜੀਂਦੀ ਸ਼੍ਰੇਣੀ ਹੈ।")
    );
  if (step.startsWith("Therefore,"))
    return (
      t(
        "उपरोक्त मानों की तुलना से अभीष्ट उत्तर",
        "ਉਪਰੋਕਤ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਨਾਲ ਲੋੜੀਂਦਾ ਉੱਤਰ",
      ) +
      ": " +
      textLabels(
        step.replace(/^Therefore, /, "").split(" has ")[0]!,
        names,
        l,
      ) +
      "."
    );
  // These are authored arithmetic lines; reject any untranslated narrative.
  if (/[A-Za-z]{3,}/.test(out))
    throw new Error(`Unauthored DI working: ${step} -> ${out}`);
  return out;
}
function questionStem(
  q: any,
  names: string[],
  l: Lang,
  measure: string,
  mode: string,
) {
  const t = cp(l),
    r = refs(q.stem, names).map((n) => label(n, l)),
    a = r[0],
    b = r[1],
    c = r[2],
    d = r[3],
    join = r.join(t(", ", ", "));
  const k = q.kind;
  const ask = (h: string, p: string) => t(h, p);
  if (
    [
      "DIRECT_VALUE",
      "ROW_DERIVED_VALUE",
      "RECOVER_SINGLE_CATEGORY",
      "SECTOR_COUNT_FROM_TOTAL",
    ].includes(k)
  )
    return ask(
      `${a} के लिए ${measure} कितने हैं?`,
      `${a} ਲਈ ${measure} ਕਿੰਨੇ ਹਨ?`,
    );
  if (["HIGHEST_VALUE", "LOWEST_VALUE", "MAXIMUM_DERIVED_VALUE"].includes(k))
    return ask(
      `${measure} का ${k === "LOWEST_VALUE" ? "न्यूनतम" : "अधिकतम"} ${k === "MAXIMUM_DERIVED_VALUE" ? "मान किस श्रेणी में है" : "मान क्या है"}?`,
      `${measure} ਦਾ ${k === "LOWEST_VALUE" ? "ਘੱਟੋ-ਘੱਟ" : "ਵੱਧੋ-ਵੱਧ"} ${k === "MAXIMUM_DERIVED_VALUE" ? "ਮੁੱਲ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਹੈ" : "ਮੁੱਲ ਕੀ ਹੈ"}?`,
    );
  if (
    [
      "CATEGORY_DIFFERENCE",
      "DERIVED_DIFFERENCE",
      "DIFFERENCE_IN_COUNTS",
    ].includes(k)
  )
    return ask(
      `${a} और ${b} के ${measure} में कितना अंतर है?`,
      `${a} ਅਤੇ ${b} ਦੇ ${measure} ਵਿੱਚ ਕਿੰਨਾ ਫ਼ਰਕ ਹੈ?`,
    );
  if (["CATEGORY_RATIO", "DERIVED_RATIO", "RATIO_OF_TWO_SECTORS"].includes(k))
    return ask(
      `${a} के ${measure} का ${b} के ${measure} से अनुपात क्या है?`,
      `${a} ਦੇ ${measure} ਦਾ ${b} ਦੇ ${measure} ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
    );
  if (
    [
      "THREE_CATEGORY_TOTAL",
      "FOUR_CATEGORY_TOTAL",
      "GROUP_TOTAL",
      "THREE_ROW_DERIVED_TOTAL",
      "FOUR_ROW_DERIVED_TOTAL",
      "COMBINED_TWO_CATEGORIES",
      "TWO_ROW_DERIVED_TOTAL",
    ].includes(k)
  )
    return ask(
      `${join} के ${measure} का कुल योग क्या है?`,
      `${join} ਦੇ ${measure} ਦਾ ਕੁੱਲ ਜੋੜ ਕੀ ਹੈ?`,
    );
  if (["THREE_CATEGORY_AVERAGE", "AVERAGE_DERIVED_VALUE"].includes(k))
    return ask(
      `${join} के ${measure} का औसत क्या है?`,
      `${join} ਦੇ ${measure} ਦਾ ਔਸਤ ਕੀ ਹੈ?`,
    );
  if (["SERIES_TOTAL", "GRAND_TOTAL"].includes(k))
    return ask(
      `सभी पाँच श्रेणियों में कुल ${measure} कितने हैं?`,
      `ਸਾਰੀਆਂ ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਕੁੱਲ ${measure} ਕਿੰਨੇ ਹਨ?`,
    );
  if (["TWO_GROUP_RATIO", "GROUP_RATIO", "GROUP_DERIVED_RATIO"].includes(k))
    return ask(
      `(${a} + ${b}) के संयुक्त ${measure} का (${c} + ${d}) के संयुक्त ${measure} से अनुपात क्या है?`,
      `(${a} + ${b}) ਦੇ ਸਾਂਝੇ ${measure} ਦਾ (${c} + ${d}) ਦੇ ਸਾਂਝੇ ${measure} ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
    );
  if (
    [
      "REMAINDER_AFTER_TWO",
      "REMAINDER_AFTER_GROUP",
      "REMAINDER_DERIVED_TOTAL",
      "REMAINDER_AFTER_TWO_SECTORS_COUNT",
    ].includes(k)
  )
    return ask(
      `${a} और ${b} को हटाने पर शेष ${measure} कितने हैं?`,
      `${a} ਅਤੇ ${b} ਨੂੰ ਹਟਾਉਣ ਉੱਤੇ ਬਾਕੀ ${measure} ਕਿੰਨੇ ਹਨ?`,
    );
  if (["CATEGORY_SHARE_OF_TOTAL", "DIRECT_SECTOR_PERCENT"].includes(k))
    return ask(
      `${a} का कुल में ${k === "CATEGORY_SHARE_OF_TOTAL" ? "लगभग " : ""}कितना प्रतिशत हिस्सा है?`,
      `${a} ਦਾ ਕੁੱਲ ਵਿੱਚ ${k === "CATEGORY_SHARE_OF_TOTAL" ? "ਲਗਭਗ " : ""}ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਹੈ?`,
    );
  if (["DERIVED_PERCENT_EXCESS", "RELATIVE_SECTOR_PERCENT_EXCESS"].includes(k))
    return ask(
      `${a} का मान ${b} से ${k === "DERIVED_PERCENT_EXCESS" ? "लगभग " : ""}कितने प्रतिशत अधिक है?`,
      `${a} ਦਾ ਮੁੱਲ ${b} ਤੋਂ ${k === "DERIVED_PERCENT_EXCESS" ? "ਲਗਭਗ " : ""}ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?`,
    );
  if (
    [
      "LARGEST_SECTOR_IDENTIFICATION",
      "SMALLEST_SECTOR_IDENTIFICATION",
    ].includes(k)
  )
    return ask(
      `किस श्रेणी का हिस्सा सबसे ${k === "LARGEST_SECTOR_IDENTIFICATION" ? "बड़ा" : "छोटा"} है?`,
      `ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਦਾ ਹਿੱਸਾ ਸਭ ਤੋਂ ${k === "LARGEST_SECTOR_IDENTIFICATION" ? "ਵੱਡਾ" : "ਛੋਟਾ"} ਹੈ?`,
    );
  if (k === "SECTOR_ANGLE_DEGREES")
    return ask(`${a} का केंद्रीय कोण क्या है?`, `${a} ਦਾ ਕੇਂਦਰੀ ਕੋਣ ਕੀ ਹੈ?`);
  if (k === "COMBINED_SECTOR_PERCENT" || k === "COMBINED_SECTOR_ANGLE")
    return ask(
      `${a} और ${b} का संयुक्त ${k === "COMBINED_SECTOR_PERCENT" ? "प्रतिशत हिस्सा" : "केंद्रीय कोण"} क्या है?`,
      `${a} ਅਤੇ ${b} ਦਾ ਸਾਂਝਾ ${k === "COMBINED_SECTOR_PERCENT" ? "ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ" : "ਕੇਂਦਰੀ ਕੋਣ"} ਕੀ ਹੈ?`,
    );
  if (k === "DIRECT_SEGMENT_VALUE")
    return ask(
      `${b} में ${a} के ${measure} कितने हैं?`,
      `${b} ਵਿੱਚ ${a} ਦੇ ${measure} ਕਿੰਨੇ ਹਨ?`,
    );
  if (k === "CATEGORY_TOTAL")
    return ask(
      `${a} में सभी खंडों को मिलाकर कुल ${measure} कितने हैं?`,
      `${a} ਵਿੱਚ ਸਾਰੇ ਖੰਡ ਮਿਲਾ ਕੇ ਕੁੱਲ ${measure} ਕਿੰਨੇ ਹਨ?`,
    );
  if (
    k === "WITHIN_CATEGORY_SEGMENT_DIFFERENCE" ||
    k === "WITHIN_CATEGORY_SEGMENT_RATIO"
  )
    return ask(
      `${c} में ${a} और ${b} का ${k.endsWith("RATIO") ? "अनुपात" : "अंतर"} क्या है?`,
      `${c} ਵਿੱਚ ${a} ਅਤੇ ${b} ਦਾ ${k.endsWith("RATIO") ? "ਅਨੁਪਾਤ" : "ਫ਼ਰਕ"} ਕੀ ਹੈ?`,
    );
  if (k === "TWO_CATEGORY_COMBINED_TOTAL")
    return ask(
      `${a} और ${b} के सभी खंडों का संयुक्त योग क्या है?`,
      `${a} ਅਤੇ ${b} ਦੇ ਸਾਰੇ ਖੰਡਾਂ ਦਾ ਸਾਂਝਾ ਜੋੜ ਕੀ ਹੈ?`,
    );
  if (k === "SEGMENT_TOTAL_ACROSS_CATEGORIES")
    return ask(
      `सभी पाँच श्रेणियों में ${a} के कुल ${measure} कितने हैं?`,
      `ਸਾਰੀਆਂ ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ${a} ਦੇ ਕੁੱਲ ${measure} ਕਿੰਨੇ ਹਨ?`,
    );
  if (k === "TWO_CATEGORY_GROUP_RATIO" && mode !== "COMPARATIVE_DOUBLE_PIE_V1")
    return ask(
      `(${a} + ${b}) के कुल का (${c} + ${d}) के कुल से अनुपात क्या है?`,
      `(${a} + ${b}) ਦੇ ਕੁੱਲ ਦਾ (${c} + ${d}) ਦੇ ਕੁੱਲ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
    );
  if (k === "THREE_SEGMENT_CROSS_TOTAL")
    return ask(
      `${b} के ${a}, ${d} के ${c} और ${r[5]} के ${r[4]} का कुल योग क्या है?`,
      `${b} ਦੇ ${a}, ${d} ਦੇ ${c} ਅਤੇ ${r[5]} ਦੇ ${r[4]} ਦਾ ਕੁੱਲ ਜੋੜ ਕੀ ਹੈ?`,
    );
  if (k === "CATEGORY_TOTAL_DIFFERENCE")
    return ask(
      `${a} और ${b} के कुल ${measure} का अंतर क्या है?`,
      `${a} ਅਤੇ ${b} ਦੇ ਕੁੱਲ ${measure} ਦਾ ਫ਼ਰਕ ਕੀ ਹੈ?`,
    );
  if (
    k === "SAME_CATEGORY_COUNT_DIFFERENCE" ||
    k === "SAME_CATEGORY_COUNT_RATIO"
  )
    return ask(
      `${a} की अवधि 1 और अवधि 2 की गणनाओं का ${k.endsWith("RATIO") ? "अनुपात" : "अंतर"} क्या है?`,
      `${a} ਦੀ ਅਵਧੀ 1 ਅਤੇ ਅਵਧੀ 2 ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ${k.endsWith("RATIO") ? "ਅਨੁਪਾਤ" : "ਫ਼ਰਕ"} ਕੀ ਹੈ?`,
    );
  if (k === "SAME_CATEGORY_COMBINED_COUNT")
    return ask(
      `दोनों अवधियों में ${a} की संयुक्त गणना क्या है?`,
      `ਦੋਵੇਂ ਅਵਧੀਆਂ ਵਿੱਚ ${a} ਦੀ ਸਾਂਝੀ ਗਿਣਤੀ ਕੀ ਹੈ?`,
    );
  if (k === "CROSS_CATEGORY_COUNT_SUM")
    return ask(
      `अवधि 1 में ${a} और अवधि 2 में ${b} की गणनाओं का योग क्या है?`,
      `ਅਵਧੀ 1 ਵਿੱਚ ${a} ਅਤੇ ਅਵਧੀ 2 ਵਿੱਚ ${b} ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਜੋੜ ਕੀ ਹੈ?`,
    );
  if (k === "LARGEST_ABSOLUTE_CHANGE")
    return ask(
      "दोनों अवधियों के बीच किसी श्रेणी की गणना में सबसे बड़ा निरपेक्ष परिवर्तन क्या है?",
      "ਦੋਵੇਂ ਅਵਧੀਆਂ ਵਿਚਕਾਰ ਕਿਸੇ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ ਨਿਰਪੇਖ ਬਦਲਾਅ ਕੀ ਹੈ?",
    );
  if (k === "COMBINED_TOTAL_ACROSS_PIES")
    return ask(
      "दोनों वृत्त आरेखों का संयुक्त कुल क्या है?",
      "ਦੋਵੇਂ ਚੱਕਰ ਚਿੱਤਰਾਂ ਦਾ ਸਾਂਝਾ ਕੁੱਲ ਕੀ ਹੈ?",
    );
  if (k === "TWO_CATEGORY_GROUP_RATIO")
    return ask(
      `दोनों अवधियों में ${a} की संयुक्त गणना का ${b} की संयुक्त गणना से अनुपात क्या है?`,
      `ਦੋਵੇਂ ਅਵਧੀਆਂ ਵਿੱਚ ${a} ਦੀ ਸਾਂਝੀ ਗਿਣਤੀ ਦਾ ${b} ਦੀ ਸਾਂਝੀ ਗਿਣਤੀ ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
    );
  if (k === "CROSS_PIE_GROUP_DIFFERENCE")
    return ask(
      `अवधि 1 के (${a}+${b}) और अवधि 2 के (${c}+${d}) के कुल का अंतर क्या है?`,
      `ਅਵਧੀ 1 ਦੇ (${a}+${b}) ਅਤੇ ਅਵਧੀ 2 ਦੇ (${c}+${d}) ਦੇ ਕੁੱਲ ਦਾ ਫ਼ਰਕ ਕੀ ਹੈ?`,
    );
  if (k === "THREE_VALUE_CROSS_TOTAL")
    return ask(
      `अवधि 1 के ${a}, अवधि 2 के ${b} और अवधि 1 के ${c} का योग क्या है?`,
      `ਅਵਧੀ 1 ਦੇ ${a}, ਅਵਧੀ 2 ਦੇ ${b} ਅਤੇ ਅਵਧੀ 1 ਦੇ ${c} ਦਾ ਜੋੜ ਕੀ ਹੈ?`,
    );
  if (k === "FOUR_VALUE_CROSS_RATIO")
    return ask(
      `(अवधि 1 ${a} + अवधि 2 ${b}) का (अवधि 1 ${c} + अवधि 2 ${d}) से अनुपात क्या है?`,
      `(ਅਵਧੀ 1 ${a} + ਅਵਧੀ 2 ${b}) ਦਾ (ਅਵਧੀ 1 ${c} + ਅਵਧੀ 2 ${d}) ਨਾਲ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
    );
  throw new Error(`Unauthored DI task ${k}`);
}
export function localizeDiExtensionSet<
  T extends { mode: string; questions: readonly any[] },
>(source: T, l: Lang): T {
  const t = cp(l),
    set: any = structuredClone(source),
    s: any = (source as any).stimulus;
  let names: string[] = [],
    measure = t("संख्या", "ਗਿਣਤੀ");
  if (s) {
    names =
      s.points?.map((p: any) => p.category) ??
      s.categories ??
      s.rows?.map((r: any) => r.label) ??
      s.slices?.map((p: any) => p.category) ??
      [];
    names = [...names, ...(s.segmentLabels ?? [])];
    measure = s.unit ? label(s.unit, l) : measure;
  } else names = (source as any).left.slices.map((p: any) => p.category);
  if (s?.domain) {
    const measures: Record<string, Pair> = {
      TIME_WORK: ["श्रम-दिन", "ਕਾਮਾ-ਦਿਨ"],
      TIME_SPEED_DISTANCE: ["दूरी (किमी)", "ਦੂਰੀ (ਕਿਮੀ)"],
      PARTNERSHIP: ["पूँजी-समय गुणनफल", "ਪੂੰਜੀ-ਸਮਾਂ ਗੁਣਨਫਲ"],
      MIXTURE_ALLIGATION: [
        "शुद्ध घटक की मात्रा (लीटर)",
        "ਸ਼ੁੱਧ ਭਾਗ ਦੀ ਮਾਤਰਾ (ਲੀਟਰ)",
      ],
      INTEREST_LOAN: ["साधारण ब्याज (₹ हजार)", "ਸਧਾਰਨ ਵਿਆਜ (₹ ਹਜ਼ਾਰ)"],
      PROBABILITY_SELECTION: [
        "चुने अभ्यर्थियों की संख्या",
        "ਚੁਣੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ",
      ],
    };
    measure = t(...measures[s.domain]!);
  }
  const numericOption = (v: string) => (names.includes(v) ? label(v, l) : v);
  set.questions = source.questions.map((q: any) => ({
    ...q,
    stem: questionStem(q, names, l, measure, source.mode),
    options: q.options.map(numericOption),
    answer: numericOption(q.answer),
    explanation: {
      keyIdea: t(
        ...(
          {
            SINGLE_SERIES_BAR_V1: [
              "अभीष्ट श्रेणियों के स्तंभों से मान पढ़िए; प्रश्न के अनुसार योग, अंतर, औसत या अनुपात निकालिए।",
              "ਲੋੜੀਂਦੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਕਾਲਮਾਂ ਤੋਂ ਮੁੱਲ ਪੜ੍ਹੋ; ਪ੍ਰਸ਼ਨ ਅਨੁਸਾਰ ਜੋੜ, ਫ਼ਰਕ, ਔਸਤ ਜਾਂ ਅਨੁਪਾਤ ਕੱਢੋ।",
            ],
            STACKED_BAR_V1: [
              "बताए गए खंडों के मान लीजिए। किसी पूरी श्रेणी का कुल निकालने के लिए उसके तीनों खंड जोड़िए।",
              "ਦੱਸੇ ਖੰਡਾਂ ਦੇ ਮੁੱਲ ਲਓ। ਕਿਸੇ ਪੂਰੀ ਸ਼੍ਰੇਣੀ ਦਾ ਕੁੱਲ ਕੱਢਣ ਲਈ ਉਸ ਦੇ ਤਿੰਨੇ ਖੰਡ ਜੋੜੋ।",
            ],
            FULLY_VISIBLE_PIE_V1: [
              "श्रेणी की संख्या = कुल × उसका प्रतिशत/100; केंद्रीय कोण = प्रतिशत × 360/100।",
              "ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ = ਕੁੱਲ × ਉਸ ਦਾ ਪ੍ਰਤੀਸ਼ਤ/100; ਕੇਂਦਰੀ ਕੋਣ = ਪ੍ਰਤੀਸ਼ਤ × 360/100।",
            ],
            COMPARATIVE_DOUBLE_PIE_V1: [
              "प्रत्येक अवधि में संख्या निकालने के लिए उसी अवधि के कुल को संबंधित प्रतिशत से गुणा करके 100 से भाग दीजिए।",
              "ਹਰੇਕ ਅਵਧੀ ਵਿੱਚ ਗਿਣਤੀ ਕੱਢਣ ਲਈ ਉਸੇ ਅਵਧੀ ਦੇ ਕੁੱਲ ਨੂੰ ਸੰਬੰਧਿਤ ਪ੍ਰਤੀਸ਼ਤ ਨਾਲ ਗੁਣਾ ਕਰਕੇ 100 ਨਾਲ ਭਾਗ ਦਿਓ।",
            ],
            ADVANCED_CASELET_TOPOLOGIES_V1: [
              "कुल और दिए संबंधों से पहले श्रेणियों की संख्याएँ निकालिए, फिर अभीष्ट गणना कीजिए।",
              "ਕੁੱਲ ਅਤੇ ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਤੋਂ ਪਹਿਲਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਕੱਢੋ, ਫਿਰ ਲੋੜੀਂਦੀ ਗਣਨਾ ਕਰੋ।",
            ],
            ADVANCED_ARITHMETIC_DOMAINS_V1: [
              "तालिका के साथ दिया नियम लगाकर प्रत्येक आवश्यक पंक्ति का व्युत्पन्न मान निकालिए।",
              "ਸਾਰਣੀ ਨਾਲ ਦਿੱਤਾ ਨਿਯਮ ਲਗਾ ਕੇ ਹਰੇਕ ਲੋੜੀਂਦੀ ਕਤਾਰ ਦਾ ਪ੍ਰਾਪਤ ਮੁੱਲ ਕੱਢੋ।",
            ],
          } as Record<string, Pair>
        )[
          source.mode === "RING_DONUT_V1" ? "FULLY_VISIBLE_PIE_V1" : source.mode
        ]!,
      ),
      steps: q.explanation.steps.map((line: string) => working(line, names, l)),
    },
  }));
  function stimulus(raw: any): any {
    const out = {
      ...raw,
      title: t("दिए गए आँकड़ों का वितरण", "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੀ ਵੰਡ"),
      instruction: t(
        "आँकड़ों का अध्ययन करके प्रश्नों के उत्तर दीजिए।",
        "ਅੰਕੜਿਆਂ ਦਾ ਅਧਿਐਨ ਕਰਕੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।",
      ),
    };
    for (const k of ["unit", "seriesLabel", "columnA", "columnB", "columnC"])
      if (raw[k]) out[k] = label(raw[k], l);
    if (raw.points)
      out.points = raw.points.map((p: any) => ({
        ...p,
        category: label(p.category, l),
      }));
    if (raw.slices)
      out.slices = raw.slices.map((p: any) => ({
        ...p,
        category: label(p.category, l),
      }));
    if (raw.segmentLabels)
      out.segmentLabels = raw.segmentLabels.map((x: string) => label(x, l));
    if (raw.categories)
      out.categories = raw.categories.map((x: string) => label(x, l));
    if (raw.rows)
      out.rows = raw.rows.map((r: any) => ({ ...r, label: label(r.label, l) }));
    if (raw.description)
      out.description = t(
        "दिए गए आँकड़ों का चित्रात्मक निरूपण।",
        "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੀ ਚਿੱਤਰਾਤਮਕ ਪੇਸ਼ਕਾਰੀ।",
      );
    if (raw.totalLabel) out.totalLabel = t("कुल संख्या", "ਕੁੱਲ ਗਿਣਤੀ");
    return out;
  }
  if (s) set.stimulus = stimulus(s);
  else {
    set.left = stimulus((source as any).left);
    set.right = stimulus((source as any).right);
    set.left.title = t("अवधि 1", "ਅਵਧੀ 1");
    set.right.title = t("अवधि 2", "ਅਵਧੀ 2");
  }
  if (s?.domain) {
    const notes: Record<string, Pair> = {
      TIME_WORK: [
        "प्रत्येक श्रमिक का प्रतिदिन समान कार्य मानिए। कुल श्रम-दिन = श्रमिक × दिन।",
        "ਹਰੇਕ ਕਾਮੇ ਦਾ ਹਰ ਦਿਨ ਬਰਾਬਰ ਕੰਮ ਮੰਨੋ। ਕੁੱਲ ਕਾਮਾ-ਦਿਨ = ਕਾਮੇ × ਦਿਨ।",
      ],
      TIME_SPEED_DISTANCE: ["दूरी = गति × समय।", "ਦੂਰੀ = ਚਾਲ × ਸਮਾਂ।"],
      PARTNERSHIP: [
        "लाभ-विभाजन अनुपात, पूँजी × निवेश अवधि के समानुपाती है।",
        "ਲਾਭ-ਵੰਡ ਅਨੁਪਾਤ, ਪੂੰਜੀ × ਨਿਵੇਸ਼ ਅਵਧੀ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੈ।",
      ],
      MIXTURE_ALLIGATION: [
        "शुद्ध घटक = मात्रा × शुद्ध घटक प्रतिशत/100।",
        "ਸ਼ੁੱਧ ਭਾਗ = ਮਾਤਰਾ × ਸ਼ੁੱਧ ਭਾਗ ਪ੍ਰਤੀਸ਼ਤ/100।",
      ],
      INTEREST_LOAN: [
        "साधारण ब्याज = मूलधन × वार्षिक दर × वर्ष/100। राशि ₹ हजार में है।",
        "ਸਧਾਰਨ ਵਿਆਜ = ਮੂਲਧਨ × ਸਾਲਾਨਾ ਦਰ × ਸਾਲ/100। ਰਕਮ ₹ ਹਜ਼ਾਰ ਵਿੱਚ ਹੈ।",
      ],
      PROBABILITY_SELECTION: [
        "चुने अभ्यर्थी = पात्र अभ्यर्थी × चयन दर/100।",
        "ਚੁਣੇ ਉਮੀਦਵਾਰ = ਯੋਗ ਉਮੀਦਵਾਰ × ਚੋਣ ਦਰ/100।",
      ],
    };
    set.stimulus.note = t(...notes[s.domain]!);
    set.stimulus.title = t(
      ...(
        {
          TIME_WORK: ["पाँच दलों का कार्य विवरण", "ਪੰਜ ਟੀਮਾਂ ਦਾ ਕੰਮ ਵੇਰਵਾ"],
          TIME_SPEED_DISTANCE: [
            "पाँच मार्गों का यात्रा विवरण",
            "ਪੰਜ ਰਸਤਿਆਂ ਦਾ ਯਾਤਰਾ ਵੇਰਵਾ",
          ],
          PARTNERSHIP: [
            "पाँच साझेदारों का निवेश विवरण",
            "ਪੰਜ ਭਾਈਵਾਲਾਂ ਦਾ ਨਿਵੇਸ਼ ਵੇਰਵਾ",
          ],
          MIXTURE_ALLIGATION: [
            "पाँच पात्रों के मिश्रण",
            "ਪੰਜ ਭਾਂਡਿਆਂ ਦੇ ਮਿਸ਼ਰਣ",
          ],
          INTEREST_LOAN: [
            "पाँच ऋणों का साधारण ब्याज विवरण",
            "ਪੰਜ ਕਰਜ਼ਿਆਂ ਦਾ ਸਧਾਰਨ ਵਿਆਜ ਵੇਰਵਾ",
          ],
          PROBABILITY_SELECTION: [
            "पाँच समूहों में अभ्यर्थियों का चयन",
            "ਪੰਜ ਸਮੂਹਾਂ ਵਿੱਚ ਉਮੀਦਵਾਰਾਂ ਦੀ ਚੋਣ",
          ],
        } as Record<string, Pair>
      )[s.domain]!,
    );
  }
  if (s?.topology) {
    const labels = s.categories.map((x: string) => label(x, l)),
      v = (source as any).resolvedValues as number[],
      T = s.totalValue,
      [a, b, c, d, e] = labels;
    let text = "",
      resolve = "";
    const total = t(
      `पाँच श्रेणियों में कुल ${T} ${label(s.unit, l)} हैं। `,
      `ਪੰਜ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਕੁੱਲ ${T} ${label(s.unit, l)} ਹਨ। `,
    );
    if (s.topology === "PERCENT_DISTRIBUTION") {
      const p = v.map((x) => (100 * x) / T);
      text =
        total +
        t(
          `${a}, ${b}, ${c} और ${d} के हिस्से क्रमशः ${p.slice(0, 4).join("%, ")}% हैं। शेष ${e} में हैं।`,
          `${a}, ${b}, ${c} ਅਤੇ ${d} ਦੇ ਹਿੱਸੇ ਕ੍ਰਮਵਾਰ ${p.slice(0, 4).join("%, ")}% ਹਨ। ਬਾਕੀ ${e} ਵਿੱਚ ਹਨ।`,
        );
      resolve =
        t("शेष प्रतिशत", "ਬਾਕੀ ਪ੍ਰਤੀਸ਼ਤ") +
        ` = 100 − (${p.slice(0, 4).join("+")}) = ${p[4]}%.`;
    } else if (s.topology === "RATIO_NETWORK") {
      text =
        total +
        t(
          `${a}:${b} = 3:4 और ${b}:${c} = 4:5 हैं। ${d}, ${b} का आधा है और ${e}, ${a} का दोगुना है।`,
          `${a}:${b} = 3:4 ਅਤੇ ${b}:${c} = 4:5 ਹਨ। ${d}, ${b} ਦਾ ਅੱਧਾ ਹੈ ਅਤੇ ${e}, ${a} ਦਾ ਦੁੱਗਣਾ ਹੈ।`,
        );
      resolve =
        t(
          "पाँचों श्रेणियों का अनुपात 3:4:5:2:6 है।",
          "ਪੰਜਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਅਨੁਪਾਤ 3:4:5:2:6 ਹੈ।",
        ) + ` k = ${T}/(3+4+5+2+6) = ${T / 20}.`;
    } else if (s.topology === "TWO_STAGE_ALLOCATION") {
      text =
        total +
        t(
          `समूह I में कुल का 60% है, जो ${a}, ${b} और ${c} में 25:35:40 के अनुपात में बँटा है। शेष 40% समूह II में है, जो ${d} और ${e} में 2:3 के अनुपात में बँटा है।`,
          `ਸਮੂਹ I ਵਿੱਚ ਕੁੱਲ ਦਾ 60% ਹੈ, ਜੋ ${a}, ${b} ਅਤੇ ${c} ਵਿੱਚ 25:35:40 ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਹੈ। ਬਾਕੀ 40% ਸਮੂਹ II ਵਿੱਚ ਹੈ, ਜੋ ${d} ਅਤੇ ${e} ਵਿੱਚ 2:3 ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਿਆ ਹੈ।`,
        );
      resolve =
        t(
          "पहले दोनों समूहों का कुल निकालिए।",
          "ਪਹਿਲਾਂ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦਾ ਕੁੱਲ ਕੱਢੋ।",
        ) + ` I = ${T}×60/100 = ${T * 0.6}; II = ${T}×40/100 = ${T * 0.4}.`;
    } else if (s.topology === "TWO_GROUP_COMPARISON") {
      text =
        total +
        t(
          `${b}, ${a} से 40 अधिक और ${c}, ${a} से 80 अधिक है। ${d} और ${e} का संयुक्त योग ${v[3]! + v[4]!} है; ${e}, ${d} से 80 अधिक है।`,
          `${b}, ${a} ਤੋਂ 40 ਵੱਧ ਅਤੇ ${c}, ${a} ਤੋਂ 80 ਵੱਧ ਹੈ। ${d} ਅਤੇ ${e} ਦਾ ਸਾਂਝਾ ਜੋੜ ${v[3]! + v[4]!} ਹੈ; ${e}, ${d} ਤੋਂ 80 ਵੱਧ ਹੈ।`,
        );
      resolve = `${a} = (${T} − ${v[3]! + v[4]!} − 40 − 80)/3 = ${v[0]}. ${d} = (${v[3]! + v[4]!}−80)/2 = ${v[3]}.`;
    } else {
      text =
        total +
        t(
          `${b}, ${a} से 50% अधिक है। ${c}, ${a} का दोगुना है। ${d}, ${c} से 25% अधिक और ${e}, ${d} से 20% अधिक है।`,
          `${b}, ${a} ਤੋਂ 50% ਵੱਧ ਹੈ। ${c}, ${a} ਦਾ ਦੁੱਗਣਾ ਹੈ। ${d}, ${c} ਤੋਂ 25% ਵੱਧ ਅਤੇ ${e}, ${d} ਤੋਂ 20% ਵੱਧ ਹੈ।`,
        );
      resolve = `${a}=x; ${b}=1.5x; ${c}=2x; ${d}=2.5x; ${e}=3x. x = ${T}/10 = ${v[0]}.`;
    }
    set.stimulus.learnerText = text;
    for (const q of set.questions)
      q.explanation.steps.unshift(
        resolve,
        ...labels.map((name: string, i: number) => `${name} = ${v[i]}.`),
      );
  }
  return set;
}
