import type { Qcp001Language, Qcp001Operand, Qcp001WordState } from "./types";
const say = (l: Qcp001Language, en: string, hi: string, pa: string) =>
  l === "en" ? en : l === "hi" ? hi : pa;
export function wordStatePrompt(s: Qcp001WordState, l: Qcp001Language): string {
  if (s.kind === "PROFIT_LOSS") {
    const profit = s.direction === "PROFIT";
    const change = say(
      l,
      profit ? "profit" : "loss",
      profit ? "लाभ" : "हानि",
      profit ? "ਲਾਭ" : "ਨੁਕਸਾਨ",
    );
    if (s.task === "COST_PRICE")
      return say(
        l,
        `The cost price (in ₹) of an article sold for ₹${s.amount} at ${s.rate}% ${change}.`,
        `₹${s.amount} में ${s.rate}% ${change} पर बेची गई वस्तु का क्रय मूल्य (₹ में)।`,
        `₹${s.amount} ਵਿੱਚ ${s.rate}% ${change} ਉੱਤੇ ਵੇਚੀ ਗਈ ਵਸਤੂ ਦੀ ਖਰੀਦ ਕੀਮਤ (₹ ਵਿੱਚ)।`,
      );
    const target =
      s.task === "SELLING_PRICE"
        ? say(l, "selling price", "विक्रय मूल्य", "ਵੇਚਣ ਦੀ ਕੀਮਤ")
        : say(l, `${change} amount`, `${change} की राशि`, `${change} ਦੀ ਰਕਮ`);
    return say(
      l,
      `The ${target} (in ₹) when an article costing ₹${s.amount} is sold at ${s.rate}% ${change}.`,
      `₹${s.amount} की वस्तु को ${s.rate}% ${change} पर बेचने से ${target} (₹ में)।`,
      `₹${s.amount} ਦੀ ਵਸਤੂ ਨੂੰ ${s.rate}% ${change} ਉੱਤੇ ਵੇਚਣ ਨਾਲ ${target} (₹ ਵਿੱਚ)।`,
    );
  }
  if (s.kind === "INTEREST") {
    const period = say(
      l,
      `at ${s.rate}% per annum for ${s.years} years under simple interest`,
      `${s.years} वर्ष के लिए ${s.rate}% वार्षिक साधारण ब्याज पर`,
      `${s.years} ਸਾਲ ਲਈ ${s.rate}% ਸਾਲਾਨਾ ਸਧਾਰਨ ਵਿਆਜ ਉੱਤੇ`,
    );
    if (s.task === "PRINCIPAL")
      return say(
        l,
        `The principal (in ₹) that earns ₹${s.amount} ${period}.`,
        `${period} ₹${s.amount} ब्याज देने वाला मूलधन (₹ में)।`,
        `${period} ₹${s.amount} ਵਿਆਜ ਦੇਣ ਵਾਲਾ ਮੂਲਧਨ (₹ ਵਿੱਚ)।`,
      );
    const target =
      s.task === "AMOUNT"
        ? say(l, "total amount", "कुल मिश्रधन", "ਕੁੱਲ ਰਕਮ")
        : say(l, "interest earned", "प्राप्त ब्याज", "ਮਿਲਿਆ ਵਿਆਜ");
    return say(
      l,
      `The ${target} (in ₹) on ₹${s.amount} ${period}.`,
      `${period} ₹${s.amount} पर ${target} (₹ में)।`,
      `${period} ₹${s.amount} ਉੱਤੇ ${target} (₹ ਵਿੱਚ)।`,
    );
  }
  const components = s.prices
    .map((price, i) =>
      say(
        l,
        `${s.quantities[i]} kg at ₹${price}/kg`,
        `${s.quantities[i]} kg, ₹${price}/kg की दर से`,
        `${s.quantities[i]} kg, ₹${price}/kg ਦੀ ਦਰ ਨਾਲ`,
      ),
    )
    .join(say(l, " and ", " और ", " ਅਤੇ "));
  if (s.task === "MEAN")
    return say(
      l,
      `The cost (in ₹) of 1 kg of a blend made by mixing ${components}.`,
      `${components} मिलाकर बने मिश्रण के 1 kg की लागत (₹ में)।`,
      `${components} ਮਿਲਾ ਕੇ ਬਣੇ ਮਿਸ਼ਰਣ ਦੇ 1 kg ਦੀ ਲਾਗਤ (₹ ਵਿੱਚ)।`,
    );
  const unknown = s.quantities[s.prices.length];
  return say(
    l,
    `The cost (in ₹) of 1 kg of the second variety, if ${components} is mixed with ${unknown} kg of it and the blend costs ₹${s.mean}/kg.`,
    `दूसरी किस्म के 1 kg की लागत (₹ में), यदि ${components} में दूसरी किस्म के ${unknown} kg मिलाने पर मिश्रण की लागत ₹${s.mean}/kg हो।`,
    `ਦੂਜੀ ਕਿਸਮ ਦੇ 1 kg ਦੀ ਲਾਗਤ (₹ ਵਿੱਚ), ਜੇ ${components} ਵਿੱਚ ਦੂਜੀ ਕਿਸਮ ਦੇ ${unknown} kg ਮਿਲਾਉਣ ਉੱਤੇ ਮਿਸ਼ਰਣ ਦੀ ਲਾਗਤ ₹${s.mean}/kg ਹੋਵੇ।`,
  );
}
export function wordOperandPrompt(o: Qcp001Operand, l: Qcp001Language): string {
  const states = o.states as readonly Qcp001WordState[];
  if (states.length === 1) return wordStatePrompt(states[0]!, l);
  return (
    say(
      l,
      "Any one of the following independent cases may apply:",
      "निम्न स्वतंत्र स्थितियों में से कोई एक संभव है:",
      "ਹੇਠ ਲਿਖੀਆਂ ਸੁਤੰਤਰ ਸਥਿਤੀਆਂ ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਸੰਭਵ ਹੈ:",
    ) +
    "\n" +
    states.map((s, i) => `${i + 1}. ${wordStatePrompt(s, l)}`).join("\n")
  );
}
export function wordWorking(
  s: Qcp001WordState,
  value: number,
  l: Qcp001Language,
): string {
  const result = say(l, "Result", "मान", "ਮੁੱਲ");
  if (s.kind === "PROFIT_LOSS") {
    const sign = s.direction === "PROFIT" ? "+" : "−";
    return `${s.task === "PROFIT_AMOUNT" ? `${s.amount} × ${s.rate} / 100` : s.task === "SELLING_PRICE" ? `${s.amount} × (100 ${sign} ${s.rate}) / 100` : `${s.amount} × 100 / (100 ${sign} ${s.rate})`} = ₹${value}`;
  }
  if (s.kind === "INTEREST")
    return `${s.task === "INTEREST" ? `${s.amount} × ${s.rate} × ${s.years} / 100` : s.task === "AMOUNT" ? `${s.amount} + ${s.amount} × ${s.rate} × ${s.years} / 100` : `${s.amount} × 100 / (${s.rate} × ${s.years})`} = ₹${value}`;
  const total = s.quantities.reduce((a, b) => a + b, 0),
    weighted = s.prices.map((v, i) => `${s.quantities[i]} × ${v}`).join(" + ");
  return `${s.task === "MEAN" ? `(${weighted}) / ${total}` : `(${total} × ${s.mean} − (${weighted})) / ${s.quantities[s.prices.length]}`} = ₹${value}; ${result} = ${value}`;
}
