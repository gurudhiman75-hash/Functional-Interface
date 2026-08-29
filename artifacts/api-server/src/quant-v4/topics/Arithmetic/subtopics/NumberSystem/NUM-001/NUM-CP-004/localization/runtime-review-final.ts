import type { NumCp004PermanentQlId } from "../permanent/allocation";
import { runNumCp004LocalizedFinalForQl } from "./runtime-final";
import type { NumCp004LocalizedQuestion, NumCp004TranslatedLanguage } from "./types";

type State = Readonly<Record<string, unknown>>;
type FactorRow = Readonly<{ prime: number; exponent: number }>;
type NaturalConcept = Readonly<{ hi: string; pa: string }>;

const NATURAL_CONCEPTS: Readonly<Record<NumCp004PermanentQlId, NaturalConcept>> = Object.freeze({
  "NUM-QL-018": { hi: "अभाज्य संख्या के ठीक दो धनात्मक भाजक होते हैं; 1 इकाई है, जबकि संयोज्य संख्या के दो से अधिक धनात्मक भाजक होते हैं।", pa: "ਅਭਾਜ ਸੰਖਿਆ ਦੇ ਠੀਕ ਦੋ ਧਨਾਤਮਕ ਭਾਜਕ ਹੁੰਦੇ ਹਨ; 1 ਇਕਾਈ ਹੈ, ਜਦਕਿ ਸੰਯੁਕਤ ਸੰਖਿਆ ਦੇ ਦੋ ਤੋਂ ਵੱਧ ਧਨਾਤਮਕ ਭਾਜਕ ਹੁੰਦੇ ਹਨ।" },
  "NUM-QL-019": { hi: "बंद अंतराल की हर संख्या की अभाज्यता जाँचकर सभी अभाज्य संख्याएँ चुनी जाती हैं।", pa: "ਬੰਦ ਅੰਤਰਾਲ ਦੀ ਹਰ ਸੰਖਿਆ ਦੀ ਅਭਾਜਤਾ ਜਾਂਚ ਕੇ ਸਾਰੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਚੁਣੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।" },
  "NUM-QL-020": { hi: "अंतराल की अभाज्य संख्याएँ पहचानकर उनकी कुल संख्या गिनी जाती है।", pa: "ਅੰਤਰਾਲ ਦੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਪਛਾਣ ਕੇ ਉਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।" },
  "NUM-QL-021": { hi: "दी गई संख्या से आगे या पीछे क्रम से जाँचते हुए पहली मिलने वाली अभाज्य संख्या ही निकटतम सीमा-अभाज्य होती है।", pa: "ਦਿੱਤੀ ਸੰਖਿਆ ਤੋਂ ਅੱਗੇ ਜਾਂ ਪਿੱਛੇ ਕ੍ਰਮਵਾਰ ਜਾਂਚਦੇ ਹੋਏ ਪਹਿਲੀ ਮਿਲਣ ਵਾਲੀ ਅਭਾਜ ਸੰਖਿਆ ਹੀ ਨੇੜਲੀ ਸੀਮਾ-ਅਭਾਜ ਹੁੰਦੀ ਹੈ।" },
  "NUM-QL-022": { hi: "पहले दिए अंतराल की अभाज्य संख्याएँ निकालें, फिर अंक-योग की शर्त लगाकर एकमात्र मान चुनें।", pa: "ਪਹਿਲਾਂ ਦਿੱਤੇ ਅੰਤਰਾਲ ਦੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਕੱਢੋ, ਫਿਰ ਅੰਕ-ਜੋੜ ਦੀ ਸ਼ਰਤ ਲਗਾ ਕੇ ਇਕੋ ਮੁੱਲ ਚੁਣੋ।" },
  "NUM-QL-023": { hi: "हर कथन को अभाज्य, संयोज्य और इकाई की मूल परिभाषाओं से जाँचना चाहिए।", pa: "ਹਰ ਕਥਨ ਨੂੰ ਅਭਾਜ, ਸੰਯੁਕਤ ਅਤੇ ਇਕਾਈ ਦੀਆਂ ਮੂਲ ਪਰਿਭਾਸ਼ਾਵਾਂ ਨਾਲ ਜਾਂਚਣਾ ਚਾਹੀਦਾ ਹੈ।" },
  "NUM-QL-024": { hi: "पूर्ण अभाज्य गुणनखंडन में संख्या को केवल अभाज्य घातों के गुणनफल के रूप में लिखा जाता है।", pa: "ਪੂਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡਨ ਵਿੱਚ ਸੰਖਿਆ ਨੂੰ ਕੇਵਲ ਅਭਾਜ ਘਾਤਾਂ ਦੇ ਗੁਣਨਫਲ ਵਜੋਂ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।" },
  "NUM-QL-025": { hi: "पूर्ण अभाज्य गुणनखंडन से सबसे छोटा या सबसे बड़ा अभाज्य आधार सीधे पहचाना जा सकता है।", pa: "ਪੂਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡਨ ਤੋਂ ਸਭ ਤੋਂ ਛੋਟਾ ਜਾਂ ਸਭ ਤੋਂ ਵੱਡਾ ਅਭਾਜ ਆਧਾਰ ਸਿੱਧਾ ਪਛਾਣਿਆ ਜਾ ਸਕਦਾ ਹੈ।" },
  "NUM-QL-026": { hi: "भिन्न अभाज्य गुणनखंडों की संख्या के लिए केवल अलग-अलग अभाज्य आधार गिने जाते हैं, उनके घातांक नहीं।", pa: "ਵੱਖਰੇ ਅਭਾਜ ਗੁਣਨਖੰਡਾਂ ਦੀ ਗਿਣਤੀ ਲਈ ਕੇਵਲ ਵੱਖਰੇ ਅਭਾਜ ਆਧਾਰ ਗਿਣੇ ਜਾਂਦੇ ਹਨ, ਉਨ੍ਹਾਂ ਦੀਆਂ ਘਾਤਾਂ ਨਹੀਂ।" },
  "NUM-QL-027": { hi: "दोहराव सहित अभाज्य गुणनखंडों की कुल संख्या सभी अभाज्य घातांकों के योग से मिलती है।", pa: "ਦੁਹਰਾਵੇ ਸਮੇਤ ਅਭਾਜ ਗੁਣਨਖੰਡਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਸਾਰੀਆਂ ਅਭਾਜ ਘਾਤਾਂ ਦੇ ਜੋੜ ਤੋਂ ਮਿਲਦੀ ਹੈ।" },
  "NUM-QL-028": { hi: "दिए अभाज्य घातों को गुणा करके मूल पूर्णांक बनाया जाता है।", pa: "ਦਿੱਤੀਆਂ ਅਭਾਜ ਘਾਤਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਮੂਲ ਪੂਰਨ ਅੰਕ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ।" },
  "NUM-QL-029": { hi: "दो अभाज्य-गुणनखंड संरचनाओं की तुलना उसी विशेषता पर करें जो प्रश्न में पूछी गई है।", pa: "ਦੋ ਅਭਾਜ-ਗੁਣਨਖੰਡ ਬਣਤਰਾਂ ਦੀ ਤੁਲਨਾ ਕੇਵਲ ਉਸੇ ਵਿਸ਼ੇਸ਼ਤਾ ਅਨੁਸਾਰ ਕਰੋ ਜੋ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੀ ਗਈ ਹੈ।" },
  "NUM-QL-030": { hi: "ज्ञात अभाज्य घातों का गुणनफल हटाने पर बची घात से गायब अभाज्य संख्या मिलती है।", pa: "ਜਾਣੀਆਂ ਅਭਾਜ ਘਾਤਾਂ ਦਾ ਗੁਣਨਫਲ ਹਟਾਉਣ ਤੋਂ ਬਾਅਦ ਬਚੀ ਘਾਤ ਤੋਂ ਗੁੰਮ ਅਭਾਜ ਸੰਖਿਆ ਮਿਲਦੀ ਹੈ।" },
  "NUM-QL-031": { hi: "ज्ञात अभाज्य घातों का गुणनफल हटाकर बची शक्ति से गायब घातांक निकाला जाता है।", pa: "ਜਾਣੀਆਂ ਅਭਾਜ ਘਾਤਾਂ ਦਾ ਗੁਣਨਫਲ ਹਟਾ ਕੇ ਬਚੀ ਸ਼ਕਤੀ ਤੋਂ ਗੁੰਮ ਘਾਤ ਕੱਢੀ ਜਾਂਦੀ ਹੈ।" },
  "NUM-QL-032": { hi: "दो संख्याएँ तभी सह-अभाज्य हैं जब उनका HCF ठीक 1 हो।", pa: "ਦੋ ਸੰਖਿਆਵਾਂ ਤਦੋਂ ਹੀ ਸਹਿ-ਅਭਾਜ ਹਨ ਜਦੋਂ ਉਨ੍ਹਾਂ ਦਾ HCF ਠੀਕ 1 ਹੋਵੇ।" },
  "NUM-QL-033": { hi: "हर उम्मीदवार का दी गई संख्या के साथ HCF निकालें; HCF 1 वाले सभी उम्मीदवार सह-अभाज्य हैं।", pa: "ਹਰ ਉਮੀਦਵਾਰ ਦਾ ਦਿੱਤੀ ਸੰਖਿਆ ਨਾਲ HCF ਕੱਢੋ; HCF 1 ਵਾਲੇ ਸਾਰੇ ਉਮੀਦਵਾਰ ਸਹਿ-ਅਭਾਜ ਹਨ।" },
  "NUM-QL-034": { hi: "हर उम्मीदवार का HCF जाँचकर केवल HCF 1 वाले मानों की संख्या गिनें।", pa: "ਹਰ ਉਮੀਦਵਾਰ ਦਾ HCF ਜਾਂਚ ਕੇ ਕੇਵਲ HCF 1 ਵਾਲੇ ਮੁੱਲਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।" },
  "NUM-QL-035": { hi: "वही मान चुनें जिसका दी गई संख्या के साथ HCF 1 हो।", pa: "ਉਹੀ ਮੁੱਲ ਚੁਣੋ ਜਿਸਦਾ ਦਿੱਤੀ ਸੰਖਿਆ ਨਾਲ HCF 1 ਹੋਵੇ।" },
  "NUM-QL-036": { hi: "युग्मवार सह-अभाज्यता के लिए हर जोड़े का HCF 1 होना चाहिए; सामूहिक सह-अभाज्यता में सभी संख्याओं का HCF 1 होता है।", pa: "ਜੋੜੇ-ਜੋੜੇ ਸਹਿ-ਅਭਾਜਤਾ ਲਈ ਹਰ ਜੋੜੇ ਦਾ HCF 1 ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ; ਸਮੂਹਕ ਸਹਿ-ਅਭਾਜਤਾ ਵਿੱਚ ਸਾਰੀਆਂ ਸੰਖਿਆਵਾਂ ਦਾ HCF 1 ਹੁੰਦਾ ਹੈ।" },
  "NUM-QL-037": { hi: "सह-अभाज्यता का कोई भी दावा संबंधित संख्याओं का HCF निकालकर जाँचा जा सकता है।", pa: "ਸਹਿ-ਅਭਾਜਤਾ ਦਾ ਕੋਈ ਵੀ ਦਾਅਵਾ ਸੰਬੰਧਤ ਸੰਖਿਆਵਾਂ ਦਾ HCF ਕੱਢ ਕੇ ਜਾਂਚਿਆ ਜਾ ਸਕਦਾ ਹੈ।" },
  "NUM-QL-038": { hi: "क्रमागत अभाज्य संख्याएँ अभाज्य क्रम में एक-दूसरे के ठीक बाद आती हैं और दी गई योग या अन्य शर्त भी पूरी करती हैं।", pa: "ਲਗਾਤਾਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਅਭਾਜ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ-ਦੂਜੇ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਆਉਂਦੀਆਂ ਹਨ ਅਤੇ ਦਿੱਤੀ ਜੋੜ ਜਾਂ ਹੋਰ ਸ਼ਰਤ ਵੀ ਪੂਰੀ ਕਰਦੀਆਂ ਹਨ।" },
  "NUM-QL-039": { hi: "तीन क्रमागत अभाज्य संख्याओं को अभाज्य क्रम और दी गई योग-शर्त दोनों पूरा करनी होती हैं।", pa: "ਤਿੰਨ ਲਗਾਤਾਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਨੂੰ ਅਭਾਜ ਕ੍ਰਮ ਅਤੇ ਦਿੱਤੀ ਜੋੜ-ਸ਼ਰਤ ਦੋਵੇਂ ਪੂਰੀਆਂ ਕਰਨੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।" },
  "NUM-QL-040": { hi: "सबसे छोटा अभाज्य भाजक वह पहला अभाज्य है जो संख्या को बिना शेष के विभाजित करे।", pa: "ਸਭ ਤੋਂ ਛੋਟਾ ਅਭਾਜ ਭਾਜਕ ਉਹ ਪਹਿਲਾ ਅਭਾਜ ਹੈ ਜੋ ਸੰਖਿਆ ਨੂੰ ਬਿਨਾਂ ਬਾਕੀ ਦੇ ਭਾਗ ਦੇਵੇ।" },
  "NUM-QL-041": { hi: "पहले व्यंजक का मान निकालें, फिर विकल्पों में दी अभाज्य संख्याओं से पूर्ण विभाजन जाँचें।", pa: "ਪਹਿਲਾਂ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਕੱਢੋ, ਫਿਰ ਵਿਕਲਪਾਂ ਵਿੱਚ ਦਿੱਤੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਨਾਲ ਪੂਰਾ ਭਾਗ ਜਾਂਚੋ।" },
  "NUM-QL-042": { hi: "संभव अभाज्य संरचना को अभाज्य और संयोज्य संख्याओं के मूल नियमों का पालन करना चाहिए।", pa: "ਸੰਭਵ ਅਭਾਜ ਬਣਤਰ ਨੂੰ ਅਭਾਜ ਅਤੇ ਸੰਯੁਕਤ ਸੰਖਿਆਵਾਂ ਦੇ ਮੂਲ ਨਿਯਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।" },
  "NUM-QL-043": { hi: "गुणनखंड वृक्ष में हर ऊपरी नोड अपने दोनों बच्चे नोडों के गुणनफल के बराबर होता है।", pa: "ਗੁਣਨਖੰਡ ਦਰੱਖਤ ਵਿੱਚ ਹਰ ਉੱਪਰਲਾ ਨੋਡ ਆਪਣੇ ਦੋਵੇਂ ਬੱਚੇ ਨੋਡਾਂ ਦੇ ਗੁਣਨਫਲ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ।" },
  "NUM-QL-044": { hi: "हर कथन को अलग जाँचें; कोई कथन अकेले एक ही संभव मान छोड़े तो वह पर्याप्त है।", pa: "ਹਰ ਕਥਨ ਨੂੰ ਵੱਖਰਾ ਜਾਂਚੋ; ਕੋਈ ਕਥਨ ਇਕੱਲਾ ਇੱਕ ਹੀ ਸੰਭਵ ਮੁੱਲ ਛੱਡੇ ਤਾਂ ਉਹ ਕਾਫ਼ੀ ਹੈ।" },
  "NUM-QL-045": { hi: "दी गई संख्या के ठीक नीचे और ऊपर निकटतम अभाज्य खोजकर दोनों दूरियाँ तुलना करें।", pa: "ਦਿੱਤੀ ਸੰਖਿਆ ਦੇ ਤੁਰੰਤ ਹੇਠਾਂ ਅਤੇ ਉੱਪਰ ਨੇੜਲੇ ਅਭਾਜ ਲੱਭ ਕੇ ਦੋਵੇਂ ਦੂਰੀਆਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।" },
});

function math(value: string | number): string {
  return `\\(${String(value)}\\)`;
}

function integer(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`Expected integer ${label}`);
  return value;
}

function integers(value: unknown, label: string): number[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`Expected integer array ${label}`);
  }
  return [...value] as number[];
}

function factorRows(value: unknown, label: string): FactorRow[] {
  if (!Array.isArray(value)) throw new Error(`Expected factor array ${label}`);
  return value.map((row, index) => {
    if (!row || typeof row !== "object") throw new Error(`Expected factor row ${label}/${index}`);
    const record = row as Readonly<Record<string, unknown>>;
    return Object.freeze({
      prime: integer(record.prime, `${label}/${index}/prime`),
      exponent: integer(record.exponent, `${label}/${index}/exponent`),
    });
  });
}

function set(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function isPrime(value: number): boolean {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function primeFactors(value: number): FactorRow[] {
  let remaining = Math.abs(value);
  const rows: FactorRow[] = [];
  for (let divisor = 2; divisor * divisor <= remaining; divisor += divisor === 2 ? 1 : 2) {
    if (remaining % divisor !== 0) continue;
    let exponent = 0;
    while (remaining % divisor === 0) {
      remaining /= divisor;
      exponent += 1;
    }
    rows.push(Object.freeze({ prime: divisor, exponent }));
  }
  if (remaining > 1) rows.push(Object.freeze({ prime: remaining, exponent: 1 }));
  return rows;
}

function factorExpression(rows: readonly FactorRow[]): string {
  if (rows.length === 0) return "1";
  return rows.map(({ prime, exponent }) => exponent === 1 ? String(prime) : `${prime}^{${exponent}}`).join(" \\times ");
}

function factorValue(rows: readonly FactorRow[]): number {
  return rows.reduce((product, row) => product * (row.prime ** row.exponent), 1);
}

function primesBetween(lower: number, upper: number): number[] {
  const values: number[] = [];
  for (let value = lower; value <= upper; value += 1) if (isPrime(value)) values.push(value);
  return values;
}

function digitSum(value: number): number {
  return String(Math.abs(value)).split("").reduce((sum, digit) => sum + Number(digit), 0);
}

function previousPrime(value: number): number {
  for (let candidate = value - 1; candidate >= 2; candidate -= 1) if (isPrime(candidate)) return candidate;
  throw new Error(`No previous prime below ${value}`);
}

function nextPrime(value: number): number {
  for (let candidate = value + 1; candidate < Number.MAX_SAFE_INTEGER; candidate += 1) if (isPrime(candidate)) return candidate;
  throw new Error(`No next prime above ${value}`);
}

function humanPolish(value: string, language: NumCp004TranslatedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/\band\b/giu, "और")
      .replaceAll("से सख़्ती से बड़ी", "से बड़ी")
      .replaceAll("दिए हैं। में किस", "दिए हैं। इनमें किस")
      .replaceAll("पूर्ण अभाज्य गुणनखंड क्या है?", "पूर्ण अभाज्य गुणनखंडन क्या है?")
      .replaceAll("का अभाज्य गुणनखंड ", "का अभाज्य गुणनखंडन ")
      .replaceAll("कौन-सा पर्याप्त जानकारी निष्कर्ष सही है?", "कौन-सा निष्कर्ष सही है?")
      .replaceAll("कौन-सा पर्याप्तता निष्कर्ष सही है?", "कौन-सा निष्कर्ष सही है?")
      .replaceAll("। है।", "।");
  }

  return value
    .replace(/\band\b/giu, "ਅਤੇ")
    .replaceAll("ਤੋਂ ਸਖ਼ਤੀ ਨਾਲ ਵੱਡੀ", "ਤੋਂ ਵੱਡੀ")
    .replaceAll("ਦਿੱਤੇ ਹਨ। ਵਿੱਚੋਂ ਕਿਸ", "ਦਿੱਤੇ ਹਨ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਸ")
    .replaceAll("ਪੂਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ਕੀ ਹੈ?", "ਪੂਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡਨ ਕੀ ਹੈ?")
    .replaceAll("ਦਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ", "ਦਾ ਅਭਾਜ ਗੁਣਨਖੰਡਨ ")
    .replaceAll("ਕਿਹੜਾ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ ਨਤੀਜਾ ਸਹੀ ਹੈ?", "ਕਿਹੜਾ ਨਤੀਜਾ ਸਹੀ ਹੈ?")
    .replaceAll("ਕਿਹੜਾ ਪਰਯਾਪਤਾ ਨਤੀਜਾ ਸਹੀ ਹੈ?", "ਕਿਹੜਾ ਨਤੀਜਾ ਸਹੀ ਹੈ?")
    .replaceAll("। ਹੈ।", "।");
}

function structuralStem(
  question: NumCp004LocalizedQuestion,
  language: NumCp004TranslatedLanguage,
): string {
  const state = question.hiddenState as State;
  const mode = typeof state.mode === "string" ? state.mode : "";
  const hi = language === "hi";

  if (mode === "FACTOR_TREE") {
    const root = integer(state.root, "root");
    const right = integer(state.right, "right");
    const [left, second] = integers(state.children, "children");
    if (left === undefined || second === undefined) throw new Error("Expected two factor-tree children");
    return hi
      ? `एक गुणनखंड वृक्ष में ${math(`${root} \\to m \\times ${right}`)} है और गायब नोड ${math(`${left} \\times ${second}`)} में बँटता है। ${math("m")} क्या है?`
      : `ਇੱਕ ਗੁਣਨਖੰਡ ਦਰੱਖਤ ਵਿੱਚ ${math(`${root} \\to m \\times ${right}`)} ਹੈ ਅਤੇ ਗੁੰਮ ਨੋਡ ${math(`${left} \\times ${second}`)} ਵਿੱਚ ਵੰਡਦਾ ਹੈ। ${math("m")} ਕੀ ਹੈ?`;
  }

  if (mode === "DATA_SUFFICIENCY") {
    const candidates = integers(state.candidates, "candidates");
    const statementI = integers(state.statementI, "statementI");
    const statementII = integers(state.statementII, "statementII");
    return hi
      ? `एक अभाज्य संख्या ${math("p")} ${set(candidates)} में से चुनी गई है।\n\nकथन I के बाद संभावित मान ${set(statementI)} हैं।\nकथन II के बाद संभावित मान ${set(statementII)} हैं।\n\n${math("p")} को एकमात्र रूप से तय करने के लिए कौन-सा निष्कर्ष सही है?`
      : `ਇੱਕ ਅਭਾਜ ਸੰਖਿਆ ${math("p")} ${set(candidates)} ਵਿੱਚੋਂ ਚੁਣੀ ਗਈ ਹੈ।\n\nਕਥਨ I ਤੋਂ ਬਾਅਦ ਸੰਭਵ ਮੁੱਲ ${set(statementI)} ਹਨ।\nਕਥਨ II ਤੋਂ ਬਾਅਦ ਸੰਭਵ ਮੁੱਲ ${set(statementII)} ਹਨ।\n\n${math("p")} ਨੂੰ ਇਕੋ ਤਰ੍ਹਾਂ ਨਿਰਧਾਰਤ ਕਰਨ ਲਈ ਕਿਹੜਾ ਨਤੀਜਾ ਸਹੀ ਹੈ?`;
  }

  return question.stem;
}

function humanEvidence(question: NumCp004LocalizedQuestion, language: NumCp004TranslatedLanguage): string {
  const state = question.hiddenState as State;
  const mode = typeof state.mode === "string" ? state.mode : "";
  const hi = language === "hi";

  if (mode === "CLASSIFY") {
    const value = integer(state.value, "value");
    if (value === 1) return hi ? `${math(1)} का केवल एक धनात्मक भाजक है, इसलिए यह इकाई है; अभाज्य या संयोज्य नहीं।` : `${math(1)} ਦਾ ਕੇਵਲ ਇੱਕ ਧਨਾਤਮਕ ਭਾਜਕ ਹੈ, ਇਸ ਲਈ ਇਹ ਇਕਾਈ ਹੈ; ਅਭਾਜ ਜਾਂ ਸੰਯੁਕਤ ਨਹੀਂ।`;
    if (isPrime(value)) return hi ? `${math(value)} को ${math(`\\sqrt{${value}}`)} तक किसी अभाज्य संख्या से पूरा भाग नहीं मिलता, इसलिए यह अभाज्य है।` : `${math(value)} ਨੂੰ ${math(`\\sqrt{${value}}`)} ਤੱਕ ਕਿਸੇ ਅਭਾਜ ਸੰਖਿਆ ਨਾਲ ਪੂਰਾ ਭਾਗ ਨਹੀਂ ਮਿਲਦਾ, ਇਸ ਲਈ ਇਹ ਅਭਾਜ ਹੈ।`;
    return hi ? `${math(`${value}=${factorExpression(primeFactors(value))}`)}, इसलिए इसके 1 और स्वयं के अलावा भी भाजक हैं।` : `${math(`${value}=${factorExpression(primeFactors(value))}`)}, ਇਸ ਲਈ 1 ਅਤੇ ਆਪਣੇ ਆਪ ਤੋਂ ਇਲਾਵਾ ਵੀ ਇਸਦੇ ਭਾਜਕ ਹਨ।`;
  }

  if (mode === "INTERVAL_SET" || mode === "INTERVAL_COUNT") {
    const lower = integer(state.lower, "lower");
    const upper = integer(state.upper, "upper");
    const primes = primesBetween(lower, upper);
    return mode === "INTERVAL_SET"
      ? (hi ? `${math(lower)} से ${math(upper)} तक जाँचने पर अभाज्य संख्याएँ ${math(`\\{${primes.join(", ")}\\}`)} मिलती हैं।` : `${math(lower)} ਤੋਂ ${math(upper)} ਤੱਕ ਜਾਂਚਣ ਤੇ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ${math(`\\{${primes.join(", ")}\\}`)} ਮਿਲਦੀਆਂ ਹਨ।`)
      : (hi ? `${math(lower)} से ${math(upper)} तक अभाज्य संख्याएँ ${math(`\\{${primes.join(", ")}\\}`)} हैं, इसलिए कुल ${math(primes.length)} हैं।` : `${math(lower)} ਤੋਂ ${math(upper)} ਤੱਕ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ${math(`\\{${primes.join(", ")}\\}`)} ਹਨ, ਇਸ ਲਈ ਕੁੱਲ ${math(primes.length)} ਹਨ।`);
  }

  if (mode === "ADJACENT_PRIME") {
    const direction = String(state.direction);
    if (direction !== "NEXT" && direction !== "PREVIOUS") {
      return humanPolish(question.explanation.solution[1] ?? "", language);
    }
    const value = integer(state.value, "value");
    const step = direction === "PREVIOUS" ? -1 : 1;
    const target = direction === "PREVIOUS" ? previousPrime(value) : nextPrime(value);
    const skipped: string[] = [];
    for (let candidate = value + step; candidate !== target; candidate += step) skipped.push(`${candidate}=${factorExpression(primeFactors(candidate))}`);
    const skippedText = skipped.length > 0 ? math(skipped.join(",\\; ")) : "";
    return hi
      ? `${skippedText ? `${skippedText} संयोज्य हैं; ` : ""}${math(target)} पहली अभाज्य संख्या है।`
      : `${skippedText ? `${skippedText} ਸੰਯੁਕਤ ਹਨ; ` : ""}${math(target)} ਪਹਿਲੀ ਅਭਾਜ ਸੰਖਿਆ ਹੈ।`;
  }

  if (mode === "DIGIT_RANGE_PRIME") {
    const lower = integer(state.lower, "lower");
    const upper = integer(state.upper, "upper");
    const required = integer(state.digitSum, "digitSum");
    const primes = primesBetween(lower, upper);
    const matches = primes.filter((value) => digitSum(value) === required);
    return hi
      ? `अंतराल की अभाज्य संख्याएँ ${math(`\\{${primes.join(", ")}\\}`)} हैं; इनमें अंक-योग ${math(required)} केवल ${math(`\\{${matches.join(", ")}\\}`)} का है।`
      : `ਅੰਤਰਾਲ ਦੀਆਂ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ${math(`\\{${primes.join(", ")}\\}`)} ਹਨ; ਇਨ੍ਹਾਂ ਵਿੱਚ ਅੰਕ-ਜੋੜ ${math(required)} ਕੇਵਲ ${math(`\\{${matches.join(", ")}\\}`)} ਦਾ ਹੈ।`;
  }

  if (mode === "PRIME_CLAIM") {
    const claims = Array.isArray(state.claims) ? state.claims : [];
    const checks = claims.map((row) => {
      const record = row as Readonly<Record<string, unknown>>;
      const value = integer(record.value, "claim/value");
      if (value === 1) return hi ? `${math(1)} इकाई है` : `${math(1)} ਇਕਾਈ ਹੈ`;
      if (isPrime(value)) return hi ? `${math(value)} अभाज्य है` : `${math(value)} ਅਭਾਜ ਹੈ`;
      return math(`${value}=${factorExpression(primeFactors(value))}`);
    });
    return hi ? `${checks.join("; ")}। इसलिए केवल अभाज्यता की परिभाषा पूरा करने वाला कथन सही है।` : `${checks.join("; ")}। ਇਸ ਲਈ ਕੇਵਲ ਅਭਾਜਤਾ ਦੀ ਪਰਿਭਾਸ਼ਾ ਪੂਰੀ ਕਰਨ ਵਾਲਾ ਕਥਨ ਸਹੀ ਹੈ।`;
  }

  if (["FACTORISATION", "PRIME_FACTOR_EXTREMUM", "DISTINCT_FACTOR_COUNT", "MULTIPLICITY_COUNT", "LEAST_PRIME_DIVISOR"].includes(mode)) {
    const value = integer(state.value, "value");
    const rows = primeFactors(value);
    if (mode === "FACTORISATION") return hi ? `${math(`${value}=${factorExpression(rows)}`)}; यही पूर्ण अभाज्य गुणनखंडन है।` : `${math(`${value}=${factorExpression(rows)}`)}; ਇਹੀ ਪੂਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡਨ ਹੈ।`;
    if (mode === "PRIME_FACTOR_EXTREMUM") {
      const primes = rows.map((row) => row.prime);
      const answer = String(state.direction) === "LARGEST" ? Math.max(...primes) : Math.min(...primes);
      return hi ? `${math(`${value}=${factorExpression(rows)}`)}, इसलिए माँगा गया अभाज्य गुणनखंड ${math(answer)} है।` : `${math(`${value}=${factorExpression(rows)}`)}, ਇਸ ਲਈ ਮੰਗਿਆ ਅਭਾਜ ਗੁਣਨਖੰਡ ${math(answer)} ਹੈ।`;
    }
    if (mode === "DISTINCT_FACTOR_COUNT") return hi ? `${math(`${value}=${factorExpression(rows)}`)} में ${math(rows.length)} अलग अभाज्य आधार हैं।` : `${math(`${value}=${factorExpression(rows)}`)} ਵਿੱਚ ${math(rows.length)} ਵੱਖਰੇ ਅਭਾਜ ਆਧਾਰ ਹਨ।`;
    if (mode === "MULTIPLICITY_COUNT") {
      const exponents = rows.map((row) => row.exponent);
      return hi ? `${math(`${value}=${factorExpression(rows)}`)} और ${math(`${exponents.join("+")}=${exponents.reduce((sum, value) => sum + value, 0)}`)}।` : `${math(`${value}=${factorExpression(rows)}`)} ਅਤੇ ${math(`${exponents.join("+")}=${exponents.reduce((sum, value) => sum + value, 0)}`)}।`;
    }
    return hi ? `${math(`${value}=${factorExpression(rows)}`)}, इसलिए पहला अभाज्य भाजक ${math(rows[0]!.prime)} है।` : `${math(`${value}=${factorExpression(rows)}`)}, ਇਸ ਲਈ ਪਹਿਲਾ ਅਭਾਜ ਭਾਜਕ ${math(rows[0]!.prime)} ਹੈ।`;
  }

  if (mode === "RECONSTRUCT_INTEGER") {
    const rows = factorRows(state.factors, "factors");
    const value = factorValue(rows);
    return hi ? `${math(`${factorExpression(rows)}=${value}`)}; अतः यही मूल पूर्णांक है।` : `${math(`${factorExpression(rows)}=${value}`)}; ਇਸ ਲਈ ਇਹੀ ਮੂਲ ਪੂਰਨ ਅੰਕ ਹੈ।`;
  }

  if (mode === "COMPARE_STRUCTURES") {
    const rowsA = factorRows(state.factorsA, "factorsA");
    const rowsB = factorRows(state.factorsB, "factorsB");
    const target = String(state.target);
    const score = (rows: readonly FactorRow[]): number => target === "DISTINCT" ? rows.length : target === "MULTIPLICITY" ? rows.reduce((sum, row) => sum + row.exponent, 0) : factorValue(rows);
    const scoreA = score(rowsA);
    const scoreB = score(rowsB);
    return hi ? `A के लिए माँगा गया मान ${math(scoreA)} और B के लिए ${math(scoreB)} है; ${math(`${scoreA}${scoreA === scoreB ? "=" : scoreA > scoreB ? ">" : "<"}${scoreB}`)}।` : `A ਲਈ ਮੰਗਿਆ ਮੁੱਲ ${math(scoreA)} ਅਤੇ B ਲਈ ${math(scoreB)} ਹੈ; ${math(`${scoreA}${scoreA === scoreB ? "=" : scoreA > scoreB ? ">" : "<"}${scoreB}`)}।`;
  }

  if (mode === "MISSING_PRIME" || mode === "MISSING_EXPONENT") {
    const value = integer(state.value, "value");
    const rows = factorRows(state.factors, "factors");
    const hiddenIndex = integer(state.hiddenIndex, "hiddenIndex");
    const hidden = rows[hiddenIndex]!;
    const knownRows = rows.filter((_row, index) => index !== hiddenIndex);
    const knownProduct = factorValue(knownRows);
    const remaining = value / knownProduct;
    if (mode === "MISSING_PRIME") return hi ? `${math(`${value}\\div${knownProduct}=${remaining}`)} और ${math(`${remaining}=${hidden.prime}^{${hidden.exponent}}`)}, इसलिए गायब अभाज्य ${math(hidden.prime)} है।` : `${math(`${value}\\div${knownProduct}=${remaining}`)} ਅਤੇ ${math(`${remaining}=${hidden.prime}^{${hidden.exponent}}`)}, ਇਸ ਲਈ ਗੁੰਮ ਅਭਾਜ ${math(hidden.prime)} ਹੈ।`;
    return hi ? `${math(`${value}\\div${knownProduct}=${remaining}`)} और ${math(`${remaining}=${hidden.prime}^{${hidden.exponent}}`)}, इसलिए घातांक ${math(hidden.exponent)} है।` : `${math(`${value}\\div${knownProduct}=${remaining}`)} ਅਤੇ ${math(`${remaining}=${hidden.prime}^{${hidden.exponent}}`)}, ਇਸ ਲਈ ਘਾਤ ${math(hidden.exponent)} ਹੈ।`;
  }

  if (mode === "SELECT_COPRIME_PAIR") {
    const pairs = Array.isArray(state.pairs) ? state.pairs.map((pair, index) => integers(pair, `pairs/${index}`)) : [];
    const checks = pairs.map(([a, b]) => math(`\\operatorname{HCF}(${a},${b})=${gcd(a!, b!)}`));
    return hi ? `${checks.join(", ")}। केवल HCF ${math(1)} वाला युग्म सह-अभाज्य है।` : `${checks.join(", ")}। ਕੇਵਲ HCF ${math(1)} ਵਾਲਾ ਜੋੜਾ ਸਹਿ-ਅਭਾਜ ਹੈ।`;
  }

  if (mode === "COPRIME_SET" || mode === "COPRIME_COUNT" || mode === "COPRIME_UNKNOWN") {
    const fixed = integer(state.fixed, "fixed");
    const candidates = integers(state.candidates, "candidates");
    const valid = candidates.filter((value) => gcd(fixed, value) === 1);
    const checks = candidates.map((value) => `HCF(${fixed},${value})=${gcd(fixed, value)}`).join(", ");
    if (mode === "COPRIME_SET") return hi ? `${math(checks)}; इसलिए HCF ${math(1)} वाले मान ${math(`\\{${valid.join(", ")}\\}`)} हैं।` : `${math(checks)}; ਇਸ ਲਈ HCF ${math(1)} ਵਾਲੇ ਮੁੱਲ ${math(`\\{${valid.join(", ")}\\}`)} ਹਨ।`;
    if (mode === "COPRIME_COUNT") return hi ? `${math(checks)}; HCF ${math(1)} वाले ${math(valid.length)} मान हैं।` : `${math(checks)}; HCF ${math(1)} ਵਾਲੇ ${math(valid.length)} ਮੁੱਲ ਹਨ।`;
    return hi ? `${math(checks)}; केवल ${math(`x=${valid[0]}`)} पर HCF ${math(1)} है।` : `${math(checks)}; ਕੇਵਲ ${math(`x=${valid[0]}`)} ਉੱਤੇ HCF ${math(1)} ਹੈ।`;
  }

  if (mode === "COPRIME_CLASS") {
    const [a, b, c] = integers(state.values, "values");
    if (a === undefined || b === undefined || c === undefined) throw new Error("Expected three co-prime-class values");
    return hi ? `${math(`\\operatorname{HCF}(${a},${b})=${gcd(a, b)}`)}, ${math(`\\operatorname{HCF}(${a},${c})=${gcd(a, c)}`)}, ${math(`\\operatorname{HCF}(${b},${c})=${gcd(b, c)}`)}; तीनों का HCF ${math(gcd(gcd(a, b), c))} है।` : `${math(`\\operatorname{HCF}(${a},${b})=${gcd(a, b)}`)}, ${math(`\\operatorname{HCF}(${a},${c})=${gcd(a, c)}`)}, ${math(`\\operatorname{HCF}(${b},${c})=${gcd(b, c)}`)}; ਤਿੰਨਾਂ ਦਾ HCF ${math(gcd(gcd(a, b), c))} ਹੈ।`;
  }

  if (mode === "COPRIME_CLAIM") {
    const claims = Array.isArray(state.claims) ? state.claims : [];
    const evidence: string[] = [];
    for (const row of claims) {
      const claim = row as Readonly<Record<string, unknown>>;
      const kind = String(claim.kind);
      const values = integers(claim.values, "claim/values");
      if (kind === "PAIR" && values.length === 2) evidence.push(math(`\\operatorname{HCF}(${values[0]},${values[1]})=${gcd(values[0]!, values[1]!)}`));
      else if (kind === "PAIRWISE_TRIPLE" && values.length === 3) evidence.push(`${math(`\\operatorname{HCF}(${values[0]},${values[1]})=${gcd(values[0]!, values[1]!)}`)}, ${math(`\\operatorname{HCF}(${values[0]},${values[2]})=${gcd(values[0]!, values[2]!)}`)}, ${math(`\\operatorname{HCF}(${values[1]},${values[2]})=${gcd(values[1]!, values[2]!)}`)}`);
      else if (kind === "UNIVERSAL_ODD") evidence.push(hi ? `${math(9)} और ${math(15)} दोनों विषम हैं, पर ${math("\\operatorname{HCF}(9,15)=3")}` : `${math(9)} ਅਤੇ ${math(15)} ਦੋਵੇਂ ਵਿਸਮ ਹਨ, ਪਰ ${math("\\operatorname{HCF}(9,15)=3")}`);
    }
    return hi ? `HCF जाँच: ${evidence.join("; ")}।` : `HCF ਜਾਂਚ: ${evidence.join("; ")}।`;
  }

  if (mode === "PRIME_PAIR") {
    const first = integer(state.first, "first");
    const second = integer(state.second, "second");
    const relation = String(state.relation);
    const target = integer(state.target, "target");
    const relationCheck = relation === "SUM" ? `${first}+${second}=${first + second}` : relation === "DIFFERENCE" ? `${second}-${first}=${second - first}` : `${first}\\times${second}=${first * second}`;
    return hi ? `${math(first)} और ${math(second)} अभाज्य क्रम में लगातार हैं; ${math(relationCheck)} दी गई शर्त ${math(target)} पूरी करता है।` : `${math(first)} ਅਤੇ ${math(second)} ਅਭਾਜ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਤਾਰ ਹਨ; ${math(relationCheck)} ਦਿੱਤੀ ਸ਼ਰਤ ${math(target)} ਪੂਰੀ ਕਰਦਾ ਹੈ।`;
  }

  if (mode === "PRIME_TRIPLE") {
    const first = integer(state.first, "first");
    const second = integer(state.second, "second");
    const third = integer(state.third, "third");
    const sum = integer(state.sum, "sum");
    return hi ? `${math(first)}, ${math(second)}, ${math(third)} अभाज्य क्रम में लगातार हैं और ${math(`${first}+${second}+${third}=${sum}`)}।` : `${math(first)}, ${math(second)}, ${math(third)} ਅਭਾਜ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਤਾਰ ਹਨ ਅਤੇ ${math(`${first}+${second}+${third}=${sum}`)}।`;
  }

  if (mode === "EXPRESSION_PRIME_DIVISOR") {
    const a = integer(state.a, "a");
    const b = integer(state.b, "b");
    const listed = integers(state.listed, "listed");
    const value = a + b;
    const divisor = listed.find((candidate) => value % candidate === 0);
    if (divisor === undefined) throw new Error(`No listed prime divides ${value}`);
    return hi ? `${math(`${a}+${b}=${value}`)} और ${math(`${value}\\div${divisor}=${value / divisor}`)}, इसलिए ${math(divisor)} पूर्ण भाजक है।` : `${math(`${a}+${b}=${value}`)} ਅਤੇ ${math(`${value}\\div${divisor}=${value / divisor}`)}, ਇਸ ਲਈ ${math(divisor)} ਪੂਰਾ ਭਾਜਕ ਹੈ।`;
  }

  if (mode === "FEASIBILITY") {
    const prime = integer(state.prime, "prime");
    return hi ? `${math(`${prime}^{2}`)} का केवल एक भिन्न अभाज्य गुणनखंड ${math(prime)} है; 2 ही एकमात्र सम अभाज्य है और दो अभाज्यों का गुणनफल संयोज्य होता है।` : `${math(`${prime}^{2}`)} ਦਾ ਕੇਵਲ ਇੱਕ ਵੱਖਰਾ ਅਭਾਜ ਗੁਣਨਖੰਡ ${math(prime)} ਹੈ; 2 ਹੀ ਇਕੱਲਾ ਸਮ ਅਭਾਜ ਹੈ ਅਤੇ ਦੋ ਅਭਾਜਾਂ ਦਾ ਗੁਣਨਫਲ ਸੰਯੁਕਤ ਹੁੰਦਾ ਹੈ।`;
  }

  if (mode === "FACTOR_TREE") {
    const root = integer(state.root, "root");
    const right = integer(state.right, "right");
    const [left, second] = integers(state.children, "children");
    if (left === undefined || second === undefined) throw new Error("Expected two factor-tree children");
    const missing = left * second;
    return hi ? `${math(`${left}\\times${second}=${missing}`)} और ${math(`${missing}\\times${right}=${root}`)}, इसलिए गायब नोड ${math(missing)} है।` : `${math(`${left}\\times${second}=${missing}`)} ਅਤੇ ${math(`${missing}\\times${right}=${root}`)}, ਇਸ ਲਈ ਗੁੰਮ ਨੋਡ ${math(missing)} ਹੈ।`;
  }

  if (mode === "DATA_SUFFICIENCY") {
    const statementI = integers(state.statementI, "statementI");
    const statementII = integers(state.statementII, "statementII");
    const intersection = statementI.filter((value) => statementII.includes(value));
    return hi ? `कथन I ${math(statementI.length)} संभव मान छोड़ता है, कथन II ${math(statementII.length)} और दोनों मिलकर ${math(intersection.length)}; इसलिए जो कथन अकेले एक मान छोड़ता है वही पर्याप्त है।` : `ਕਥਨ I ${math(statementI.length)} ਸੰਭਵ ਮੁੱਲ ਛੱਡਦਾ ਹੈ, ਕਥਨ II ${math(statementII.length)} ਅਤੇ ਦੋਵੇਂ ਮਿਲ ਕੇ ${math(intersection.length)}; ਇਸ ਲਈ ਜੋ ਕਥਨ ਇਕੱਲਾ ਇੱਕ ਮੁੱਲ ਛੱਡਦਾ ਹੈ ਉਹੀ ਕਾਫ਼ੀ ਹੈ।`;
  }

  if (mode === "PRIME_ADJUSTMENT") {
    const value = integer(state.value, "value");
    const lower = previousPrime(value);
    const upper = nextPrime(value);
    const lowerDelta = lower - value;
    const upperDelta = upper - value;
    return hi ? `नीचे ${math(lower)} तक बदलाव ${math(lowerDelta)} है और ऊपर ${math(upper)} तक ${math(`+${upperDelta}`)}; छोटी निरपेक्ष दूरी वाला बदलाव चुनें।` : `ਹੇਠਾਂ ${math(lower)} ਤੱਕ ਬਦਲਾਅ ${math(lowerDelta)} ਹੈ ਅਤੇ ਉੱਪਰ ${math(upper)} ਤੱਕ ${math(`+${upperDelta}`)}; ਛੋਟੀ ਪਰਮ ਦੂਰੀ ਵਾਲਾ ਬਦਲਾਅ ਚੁਣੋ।`;
  }

  return humanPolish(question.explanation.solution[1] ?? "", language);
}

export function runNumCp004LocalizedReviewFinalForQl(
  questionLanguageId: NumCp004PermanentQlId,
  seed: number,
  language: NumCp004TranslatedLanguage,
): NumCp004LocalizedQuestion {
  const question = runNumCp004LocalizedFinalForQl(questionLanguageId, seed, language);
  const answer = humanPolish(question.answer, language).trim();
  const options = question.options.map((option) => Object.freeze({ ...option, value: humanPolish(option.value, language) }));
  const solution = question.explanation.solution.map((line) => humanPolish(line, language));
  solution[1] = humanEvidence(question, language);
  solution[2] = language === "hi" ? `अतः सही उत्तर: ${answer}` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ: ${answer}`;
  const naturalConcept = NATURAL_CONCEPTS[questionLanguageId];

  return Object.freeze({
    ...question,
    stem: humanPolish(structuralStem(question, language), language),
    options: Object.freeze(options),
    answer,
    canonicalAnswer: answer,
    explanation: Object.freeze({
      concept: language === "hi" ? naturalConcept.hi : naturalConcept.pa,
      solution: Object.freeze(solution),
      finalAnswer: answer,
    }),
  });
}
