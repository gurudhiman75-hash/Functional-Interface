import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../../../../question-studio/standard-lifecycle.ts";

type L = QuestionStudioLanguage;
type Text = Record<L, string>;
type State = number[]; // index is the membership bitmask: A=1, B=2, C=4; 0=none.
const tx = (en: string, hi: string, pa: string): Text => ({ en, hi, pa });
export const NUMERICAL_CP_IDS = [
  "VEN-CP005",
  "VEN-CP006",
  "VEN-CP007",
  "VEN-CP008",
  "VEN-CP009",
  "VEN-CP010",
] as const;
// Each context supplies full grammatical activity phrases and localized object names.
export const NUMERICAL_CONTEXTS = [
  {
    id: "NEWSPAPERS",
    names: tx(
      "newspaper A|newspaper B|newspaper C",
      "समाचार-पत्र A|समाचार-पत्र B|समाचार-पत्र C",
      "ਅਖ਼ਬਾਰ A|ਅਖ਼ਬਾਰ B|ਅਖ਼ਬਾਰ C",
    ),
    verb: tx("read", "पढ़ते हैं", "ਪੜ੍ਹਦੇ ਹਨ"),
  },
  {
    id: "BEVERAGES",
    names: tx("tea|coffee|milk", "चाय|कॉफ़ी|दूध", "ਚਾਹ|ਕੌਫ਼ੀ|ਦੁੱਧ"),
    verb: tx("drink", "पीते हैं", "ਪੀਂਦੇ ਹਨ"),
  },
  {
    id: "SPORTS",
    names: tx(
      "cricket|football|hockey",
      "क्रिकेट|फ़ुटबॉल|हॉकी",
      "ਕ੍ਰਿਕਟ|ਫੁੱਟਬਾਲ|ਹਾਕੀ",
    ),
    verb: tx("play", "खेलते हैं", "ਖੇਡਦੇ ਹਨ"),
  },
  {
    id: "LANGUAGES",
    names: tx(
      "Hindi|English|Punjabi",
      "हिन्दी|अंग्रेज़ी|पंजाबी",
      "ਹਿੰਦੀ|ਅੰਗਰੇਜ਼ੀ|ਪੰਜਾਬੀ",
    ),
    verb: tx("speak", "बोलते हैं", "ਬੋਲਦੇ ਹਨ"),
  },
  {
    id: "TRANSPORT",
    names: tx(
      "buses|trains|bicycles",
      "बसों|ट्रेनों|साइकिलों",
      "ਬੱਸਾਂ|ਰੇਲਾਂ|ਸਾਈਕਲਾਂ",
    ),
    verb: tx("use", "का उपयोग करते हैं", "ਵਰਤਦੇ ਹਨ"),
  },
  {
    id: "FACILITIES",
    names: tx(
      "the library|the science lab|the sports centre",
      "पुस्तकालय|विज्ञान प्रयोगशाला|खेल केंद्र",
      "ਲਾਇਬ੍ਰੇਰੀ|ਵਿਗਿਆਨ ਲੈਬ|ਖੇਡ ਕੇਂਦਰ",
    ),
    verb: tx("use", "का उपयोग करते हैं", "ਵਰਤਦੇ ਹਨ"),
  },
  {
    id: "MEDIA",
    names: tx(
      "news programmes|sports programmes|documentaries",
      "समाचार कार्यक्रम|खेल कार्यक्रम|वृत्तचित्र",
      "ਖ਼ਬਰਾਂ ਦੇ ਪ੍ਰੋਗਰਾਮ|ਖੇਡਾਂ ਦੇ ਪ੍ਰੋਗਰਾਮ|ਦਸਤਾਵੇਜ਼ੀ ਪ੍ਰੋਗਰਾਮ",
    ),
    verb: tx("watch", "देखते हैं", "ਦੇਖਦੇ ਹਨ"),
  },
  {
    id: "SUBJECTS",
    names: tx(
      "mathematics|science|English",
      "गणित|विज्ञान|अंग्रेज़ी",
      "ਗਣਿਤ|ਵਿਗਿਆਨ|ਅੰਗਰੇਜ਼ੀ",
    ),
    verb: tx("study", "पढ़ते हैं", "ਪੜ੍ਹਦੇ ਹਨ"),
  },
  {
    id: "DEVICES",
    names: tx(
      "a laptop|a smartphone|a tablet",
      "लैपटॉप|स्मार्टफ़ोन|टैबलेट",
      "ਲੈਪਟਾਪ|ਸਮਾਰਟਫ਼ੋਨ|ਟੈਬਲੈੱਟ",
    ),
    verb: tx("own", "रखते हैं", "ਰੱਖਦੇ ਹਨ"),
  },
  {
    id: "PAYMENTS",
    names: tx("cash|cards|UPI", "नकद|कार्ड|UPI", "ਨਕਦ|ਕਾਰਡ|UPI"),
    verb: tx("use", "का उपयोग करते हैं", "ਵਰਤਦੇ ਹਨ"),
  },
  {
    id: "SHOPPING",
    names: tx(
      "local shops|supermarkets|online stores",
      "स्थानीय दुकानों|सुपरमार्केट|ऑनलाइन दुकानों",
      "ਸਥਾਨਕ ਦੁਕਾਨਾਂ|ਸੁਪਰਮਾਰਕੀਟਾਂ|ਆਨਲਾਈਨ ਦੁਕਾਨਾਂ",
    ),
    verb: tx("shop at", "से खरीदारी करते हैं", "ਤੋਂ ਖ਼ਰੀਦਦਾਰੀ ਕਰਦੇ ਹਨ"),
  },
  {
    id: "TRAINING",
    names: tx(
      "first-aid training|fire-safety training|computer training",
      "प्राथमिक उपचार प्रशिक्षण|अग्नि-सुरक्षा प्रशिक्षण|कंप्यूटर प्रशिक्षण",
      "ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਦੀ ਸਿਖਲਾਈ|ਅੱਗ ਤੋਂ ਸੁਰੱਖਿਆ ਦੀ ਸਿਖਲਾਈ|ਕੰਪਿਊਟਰ ਦੀ ਸਿਖਲਾਈ",
    ),
    verb: tx("have completed", "पूरा कर चुके हैं", "ਪੂਰੀ ਕਰ ਚੁੱਕੇ ਹਨ"),
  },
  {
    id: "DOCUMENTS",
    names: tx(
      "a voter ID|a driving licence|a passport",
      "मतदाता पहचान-पत्र|ड्राइविंग लाइसेंस|पासपोर्ट",
      "ਵੋਟਰ ਪਛਾਣ-ਪੱਤਰ|ਡਰਾਈਵਿੰਗ ਲਾਇਸੈਂਸ|ਪਾਸਪੋਰਟ",
    ),
    verb: tx("hold", "रखते हैं", "ਰੱਖਦੇ ਹਨ"),
  },
  {
    id: "READING",
    names: tx(
      "novels|biographies|poetry",
      "उपन्यास|जीवनियाँ|कविताएँ",
      "ਨਾਵਲ|ਜੀਵਨੀਆਂ|ਕਵਿਤਾਵਾਂ",
    ),
    verb: tx("read", "पढ़ते हैं", "ਪੜ੍ਹਦੇ ਹਨ"),
  },
  {
    id: "VOLUNTEERING",
    names: tx(
      "literacy drives|clean-up drives|tree-planting drives",
      "साक्षरता अभियानों|सफाई अभियानों|वृक्षारोपण अभियानों",
      "ਸਾਖਰਤਾ ਮੁਹਿੰਮਾਂ|ਸਫ਼ਾਈ ਮੁਹਿੰਮਾਂ|ਰੁੱਖ ਲਾਉਣ ਦੀਆਂ ਮੁਹਿੰਮਾਂ",
    ),
    verb: tx("participate in", "में भाग लेते हैं", "ਵਿੱਚ ਹਿੱਸਾ ਲੈਂਦੇ ਹਨ"),
  },
  {
    id: "LEARNING",
    names: tx(
      "live online classes|recorded lessons|digital notes",
      "लाइव ऑनलाइन कक्षाओं|रिकॉर्ड किए गए पाठों|डिजिटल नोट्स",
      "ਲਾਈਵ ਆਨਲਾਈਨ ਕਲਾਸਾਂ|ਰਿਕਾਰਡ ਕੀਤੇ ਪਾਠਾਂ|ਡਿਜ਼ੀਟਲ ਨੋਟਸ",
    ),
    verb: tx("use", "का उपयोग करते हैं", "ਵਰਤਦੇ ਹਨ"),
  },
  {
    id: "EXERCISE",
    names: tx(
      "yoga|swimming|cycling",
      "योग|तैराकी|साइकिल चलाने",
      "ਯੋਗ|ਤੈਰਾਕੀ|ਸਾਈਕਲ ਚਲਾਉਣ",
    ),
    verb: tx("practise", "का अभ्यास करते हैं", "ਦਾ ਅਭਿਆਸ ਕਰਦੇ ਹਨ"),
  },
  {
    id: "MEMBERSHIPS",
    names: tx(
      "the chess club|the music club|the drama club",
      "शतरंज क्लब|संगीत क्लब|नाटक क्लब",
      "ਸ਼ਤਰੰਜ ਕਲੱਬ|ਸੰਗੀਤ ਕਲੱਬ|ਨਾਟਕ ਕਲੱਬ",
    ),
    verb: tx("belong to", "के सदस्य हैं", "ਦੇ ਮੈਂਬਰ ਹਨ"),
  },
  {
    id: "EXAMS",
    names: tx(
      "mathematics|English|science",
      "गणित|अंग्रेज़ी|विज्ञान",
      "ਗਣਿਤ|ਅੰਗਰੇਜ਼ੀ|ਵਿਗਿਆਨ",
    ),
    verb: tx("passed", "में उत्तीर्ण हुए", "ਵਿੱਚ ਪਾਸ ਹੋਏ"),
  },
  {
    id: "NEWS_SOURCES",
    names: tx(
      "daily newspapers|news magazines|news websites",
      "दैनिक समाचार-पत्र|समाचार पत्रिकाएँ|समाचार वेबसाइट",
      "ਰੋਜ਼ਾਨਾ ਅਖ਼ਬਾਰ|ਖ਼ਬਰਾਂ ਦੇ ਰਸਾਲੇ|ਖ਼ਬਰਾਂ ਦੀਆਂ ਵੈੱਬਸਾਈਟਾਂ",
    ),
    verb: tx("read", "पढ़ते हैं", "ਪੜ੍ਹਦੇ ਹਨ"),
  },
];
type Context = (typeof NUMERICAL_CONTEXTS)[number];
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const sum = (x: readonly number[]) => x.reduce((a, b) => a + b, 0);
export function membershipTotal(r: State, mask: number) {
  return sum(r.filter((_, i) => (i & mask) === mask));
}
export function numericalState(seed: string, sets: 2 | 3): State {
  let n = hash(seed);
  const next = () => {
    n ^= n << 13;
    n ^= n >>> 17;
    n ^= n << 5;
    return n >>> 0;
  };
  return Array.from({ length: 1 << sets }, () => next() % 35); // permits zeros and disjoint populations.
}
function join(a: string[], l: L) {
  return a.join(l === "en" ? " and " : l === "hi" ? " और " : " ਅਤੇ ");
}
function activity(c: Context, idx: number[], l: L) {
  const names = c.names[l].split("|");
  const obj = join(
    idx.map((i) => names[i]),
    l,
  );
  return l === "en" ? `${c.verb[l]} ${obj}` : `${obj} ${c.verb[l]}`;
}
function groupedActivity(c: Context, mask: number, l: L) {
  return activity(
    c,
    [0, 1, 2].filter((i) => mask & (1 << i)),
    l,
  );
}
function prefix(total: number, l: L) {
  return tx(
    `In a survey of ${total} people,`,
    `${total} लोगों का सर्वेक्षण किया गया।`,
    `${total} ਲੋਕਾਂ ਦਾ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ।`,
  )[l];
}
function countStatement(
  c: Context,
  mask: number,
  count: number | string,
  l: L,
) {
  return `${count} ${groupedActivity(c, mask, l)}`;
}
function data(
  c: Context,
  r: State,
  sets: 2 | 3,
  l: L,
  omit: "total" | "pair" | "triple" | "none" | "" = "",
) {
  const singles = [1, 2, ...(sets === 3 ? [4] : [])];
  const pairs = sets === 3 ? [3, 6, 5] : [3];
  const start =
    omit === "total"
      ? tx("In a surveyed group,", "एक सर्वेक्षण में,", "ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ,")[l]
      : prefix(sum(r), l);
  const clauses = singles.map((m) =>
    countStatement(c, m, membershipTotal(r, m), l),
  );
  if (omit !== "pair")
    clauses.push(
      ...pairs.map((m) => countStatement(c, m, membershipTotal(r, m), l)),
    );
  if (sets === 3 && omit !== "triple")
    clauses.push(countStatement(c, 7, r[7], l));
  if (omit === "total" || omit === "pair" || omit === "triple")
    clauses.push(
      tx(
        `${r[0]} belong to none of these groups`,
        `${r[0]} इनमें से किसी समूह में नहीं आते`,
        `${r[0]} ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ`,
      )[l],
    );
  const inclusion =
    sets === 3
      ? tx(
          "Each pairwise count includes people in all three groups.",
          "हर जोड़ी की संख्या में तीनों समूहों के लोग भी शामिल हैं।",
          "ਹਰ ਜੋੜੇ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਦੇ ਲੋਕ ਵੀ ਸ਼ਾਮਲ ਹਨ।",
        )[l]
      : "";
  return `${start} ${clauses.join("; ")}. ${inclusion}`.trim();
}
export const QUERY_MASKS: Record<string, number[]> = {
  onlyA: [1],
  onlyB: [2],
  onlyC: [4],
  both: [3],
  onlyAB: [3],
  onlyBC: [6],
  onlyAC: [5],
  all: [7],
  none: [0],
  union2: [1, 2, 3],
  union3: [1, 2, 3, 4, 5, 6, 7],
  exactOne2: [1, 2],
  exactOne3: [1, 2, 4],
  exactTwo: [3, 5, 6],
  atLeastTwo: [3, 5, 6, 7],
  atMostOne: [0, 1, 2, 4],
  atMostTwo: [0, 1, 2, 3, 4, 5, 6],
  AorBnotC: [1, 2, 3],
  AnotB: [1, 5],
  inclusiveAB: [3, 7],
  total2: [0, 1, 2, 3],
  total3: [0, 1, 2, 3, 4, 5, 6, 7],
};
function target(c: Context, q: string, l: L) {
  const a = activity(c, [0], l),
    b = activity(c, [1], l),
    d = activity(c, [2], l);
  const description: Record<string, Text> = {
    onlyA: tx(
      `${a}, but neither ${b} nor ${d}`,
      `${a}, लेकिन न ${b} और न ${d}`,
      `${a}, ਪਰ ਨਾ ${b} ਅਤੇ ਨਾ ${d}`,
    ),
    onlyB: tx(
      `${b}, but neither ${a} nor ${d}`,
      `${b}, लेकिन न ${a} और न ${d}`,
      `${b}, ਪਰ ਨਾ ${a} ਅਤੇ ਨਾ ${d}`,
    ),
    onlyC: tx(
      `${d}, but neither ${a} nor ${b}`,
      `${d}, लेकिन न ${a} और न ${b}`,
      `${d}, ਪਰ ਨਾ ${a} ਅਤੇ ਨਾ ${b}`,
    ),
    onlyAB: tx(
      `${activity(c, [0, 1], l)}, but do not ${d}`,
      `${activity(c, [0, 1], l)}, लेकिन तीसरे समूह में नहीं आते`,
      `${activity(c, [0, 1], l)}, ਪਰ ਤੀਜੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ`,
    ),
    onlyBC: tx(
      `${activity(c, [1, 2], l)}, but do not ${a}`,
      `${activity(c, [1, 2], l)}, लेकिन पहले समूह में नहीं आते`,
      `${activity(c, [1, 2], l)}, ਪਰ ਪਹਿਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ`,
    ),
    onlyAC: tx(
      `${activity(c, [0, 2], l)}, but do not ${b}`,
      `${activity(c, [0, 2], l)}, लेकिन दूसरे समूह में नहीं आते`,
      `${activity(c, [0, 2], l)}, ਪਰ ਦੂਜੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ`,
    ),
    all: tx(
      activity(c, [0, 1, 2], l),
      activity(c, [0, 1, 2], l),
      activity(c, [0, 1, 2], l),
    ),
    none: tx(
      "belong to none of these groups",
      "इनमें से किसी समूह में नहीं आते",
      "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ",
    ),
    union2: tx(
      "belong to at least one of the two groups",
      "दोनों में से कम-से-कम एक समूह में आते",
      "ਦੋਵਾਂ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ",
    ),
    union3: tx(
      "belong to at least one of the three groups",
      "तीनों में से कम-से-कम एक समूह में आते",
      "ਤਿੰਨਾਂ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ",
    ),
    exactOne2: tx(
      "belong to exactly one of the two groups",
      "दोनों में से केवल एक समूह में आते",
      "ਦੋਵਾਂ ਵਿੱਚੋਂ ਸਿਰਫ਼ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ",
    ),
    exactOne3: tx(
      "belong to exactly one of the three groups",
      "तीनों में से केवल एक समूह में आते",
      "ਤਿੰਨਾਂ ਵਿੱਚੋਂ ਸਿਰਫ਼ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ",
    ),
    exactTwo: tx(
      "belong to exactly two groups",
      "ठीक दो समूहों में आते",
      "ਠੀਕ ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ",
    ),
    atLeastTwo: tx(
      "belong to at least two groups",
      "कम-से-कम दो समूहों में आते",
      "ਘੱਟੋ-ਘੱਟ ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ",
    ),
    atMostOne: tx(
      "belong to at most one group, including those in none",
      "अधिक-से-अधिक एक समूह में आते, किसी समूह में न आने वालों सहित",
      "ਵੱਧ ਤੋਂ ਵੱਧ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ, ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਸਮੇਤ",
    ),
    atMostTwo: tx(
      "belong to at most two groups, including those in none",
      "अधिक-से-अधिक दो समूहों में आते, किसी समूह में न आने वालों सहित",
      "ਵੱਧ ਤੋਂ ਵੱਧ ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ, ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਸਮੇਤ",
    ),
    AorBnotC: tx(
      "belong to A or B or both, but not C",
      "A या B या दोनों में आते, लेकिन C में नहीं",
      "A ਜਾਂ B ਜਾਂ ਦੋਵਾਂ ਵਿੱਚ ਆਉਂਦੇ, ਪਰ C ਵਿੱਚ ਨਹੀਂ",
    ),
    AnotB: tx(
      "belong to A but not B, whether or not they belong to C",
      "A में आते, लेकिन B में नहीं; वे C में आ सकते हैं",
      "A ਵਿੱਚ ਆਉਂਦੇ, ਪਰ B ਵਿੱਚ ਨਹੀਂ; ਉਹ C ਵਿੱਚ ਆ ਸਕਦੇ ਹਨ",
    ),
    inclusiveAB: tx(
      "belong to both A and B, including those also in C",
      "A और B दोनों में आते, C में आने वालों सहित",
      "A ਅਤੇ B ਦੋਵਾਂ ਵਿੱਚ ਆਉਂਦੇ, C ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਸਮੇਤ",
    ),
    both: tx(
      activity(c, [0, 1], l),
      activity(c, [0, 1], l),
      activity(c, [0, 1], l),
    ),
  };
  return description[q]?.[l] ?? q;
}
function query(c: Context, q: string, sets: 2 | 3, l: L) {
  if (q.startsWith("total"))
    return tx(
      "How many people were surveyed?",
      "कुल कितने लोगों का सर्वेक्षण किया गया?",
      "ਕੁੱਲ ਕਿੰਨੇ ਲੋਕਾਂ ਦਾ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ?",
    )[l];
  if (q === "atMostOne" || q === "atMostTwo") {
    const n = q === "atMostOne" ? "one" : "two";
    return tx(
      `How many people belong to at most ${n} groups, including those in none?`,
      `कितने लोग अधिक-से-अधिक ${q === "atMostOne" ? "एक" : "दो"} समूहों में आते हैं (किसी भी समूह में न आने वालों सहित)?`,
      `ਕਿੰਨੇ ਲੋਕ ਵੱਧ ਤੋਂ ਵੱਧ ${q === "atMostOne" ? "ਇੱਕ" : "ਦੋ"} ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ (ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਸਮੇਤ)?`,
    )[l];
  }
  let label = target(c, q, l);
  if (sets === 2 && q === "onlyA")
    label = tx(
      `${activity(c, [0], l)} but do not ${activity(c, [1], l)}`,
      `पहले समूह में आते हैं, लेकिन दूसरे में नहीं`,
      `ਪਹਿਲੇ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ਦੂਜੇ ਵਿੱਚ ਨਹੀਂ`,
    )[l];
  if (sets === 2 && q === "onlyB")
    label = tx(
      `${activity(c, [1], l)} but do not ${activity(c, [0], l)}`,
      `दूसरे समूह में आते हैं, लेकिन पहले में नहीं`,
      `ਦੂਜੇ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ਪਹਿਲੇ ਵਿੱਚ ਨਹੀਂ`,
    )[l];
  return tx(
    `How many people ${label}?`,
    `कितने लोग ${label}${label.endsWith("हैं") ? "" : " हैं"}?`,
    `ਕਿੰਨੇ ਲੋਕ ${label}${label.endsWith("ਹਨ") ? "" : " ਹਨ"}?`,
  )[l];
}
const labels: Record<number, Text> = {
  0: tx("None", "कोई नहीं", "ਕੋਈ ਨਹੀਂ"),
  1: tx("Only A", "केवल A", "ਸਿਰਫ਼ A"),
  2: tx("Only B", "केवल B", "ਸਿਰਫ਼ B"),
  3: tx("A and B only", "केवल A और B", "ਸਿਰਫ਼ A ਅਤੇ B"),
  4: tx("Only C", "केवल C", "ਸਿਰਫ਼ C"),
  5: tx("A and C only", "केवल A और C", "ਸਿਰਫ਼ A ਅਤੇ C"),
  6: tx("B and C only", "केवल B और C", "ਸਿਰਫ਼ B ਅਤੇ C"),
  7: tx("All three", "तीनों", "ਤਿੰਨੇ"),
};
function legend(c: Context, sets: 2 | 3, l: L) {
  const names = c.names[l].split("|").slice(0, sets);
  return names
    .map((n, i) => {
      const clause = tx(`people who ${c.verb.en} ${n}`, `जो ${n} ${c.verb.hi}`, `ਜੋ ${n} ${c.verb.pa}`)[l];
      return `${"ABC"[i]} = ${clause}`;
    })
    .join("; ");
}
function derivation(r: State, sets: 2 | 3, l: L) {
  const a = membershipTotal(r, 1),
    b = membershipTotal(r, 2),
    ab = membershipTotal(r, 3);
  if (sets === 2)
    return `${labels[1][l]} = ${a} − ${ab} = ${r[1]}; ${labels[2][l]} = ${b} − ${ab} = ${r[2]}. ${tx("At least one", "कम-से-कम एक", "ਘੱਟੋ-ਘੱਟ ਇੱਕ")[l]} = ${a} + ${b} − ${ab} = ${sum(r) - r[0]}. ${labels[0][l]} = ${sum(r)} − ${sum(r) - r[0]} = ${r[0]}.`;
  const c = membershipTotal(r, 4),
    ac = membershipTotal(r, 5),
    bc = membershipTotal(r, 6),
    t = r[7];
  return `${tx("Start with the all-three region", "पहले तीनों का साझा भाग लें", "ਪਹਿਲਾਂ ਤਿੰਨਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਲਓ")[l]}: ${t}. ${labels[3][l]} = ${ab} − ${t} = ${r[3]}; ${labels[5][l]} = ${ac} − ${t} = ${r[5]}; ${labels[6][l]} = ${bc} − ${t} = ${r[6]}. ${labels[1][l]} = ${a} − ${r[3]} − ${r[5]} − ${t} = ${r[1]}; ${labels[2][l]} = ${b} − ${r[3]} − ${r[6]} − ${t} = ${r[2]}; ${labels[4][l]} = ${c} − ${r[5]} − ${r[6]} − ${t} = ${r[4]}. ${labels[0][l]} = ${sum(r)} − (${r.slice(1).join(" + ")}) = ${r[0]}.`;
}
function diagram(r: State, sets: 2 | 3) {
  const circles =
    sets === 3
      ? '<circle cx="200" cy="150" r="130"/><circle cx="360" cy="150" r="130"/><circle cx="280" cy="280" r="130"/>'
      : '<circle cx="210" cy="220" r="130"/><circle cx="350" cy="220" r="130"/>';
  const points =
    sets === 3
      ? [
          [505, 380],
          [125, 125],
          [435, 125],
          [280, 85],
          [280, 365],
          [190, 265],
          [370, 265],
          [280, 205],
        ]
      : [
          [505, 380],
          [135, 220],
          [425, 220],
          [280, 220],
        ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 460" role="img" aria-label="Solved Venn region counts"><rect x="15" y="5" width="530" height="445" rx="8" fill="white" stroke="#bbb"/><g fill="none" stroke="#17324d" stroke-width="2">${circles}</g><g font-family="sans-serif" font-size="20" text-anchor="middle" fill="#17324d"><text x="120" y="17">A</text><text x="440" y="17">B</text>${sets === 3 ? '<text x="280" y="439">C</text>' : ""}${points.map(([x, y], m) => `<text x="${x}" y="${y}" data-mask="${m}">${r[m]}</text>`).join("")}</g></svg>`;
}
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
function ratio(a: number, b: number) {
  const g = gcd(a, b);
  return `${a / g}:${b / g}`;
}
type Item = {
  stem: string;
  answer: number | string;
  explanation: string;
  operation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  regions?: State;
  sets: 2 | 3;
  queryKey: string;
  formula: string;
  caseletId?: string;
  sharedStimulus?: string;
  traps: (number | string)[];
};
const TWO_QUERIES = [
  "onlyA",
  "onlyB",
  "both",
  "none",
  "union2",
  "exactOne2",
  "total2",
];
const THREE_QUERIES = [
  "onlyA",
  "onlyB",
  "onlyC",
  "onlyAB",
  "onlyBC",
  "onlyAC",
  "all",
  "none",
  "union3",
  "exactOne3",
  "exactTwo",
  "atLeastTwo",
  "atMostOne",
  "atMostTwo",
  "AorBnotC",
  "AnotB",
  "inclusiveAB",
];
export function numericalBound(
  n: number,
  counts: number[],
  intersection: boolean,
  maximum: boolean,
): number {
  if (
    !Number.isInteger(n) ||
    n < 0 ||
    counts.length < 2 ||
    counts.length > 3 ||
    counts.some((x) => !Number.isInteger(x) || x < 0 || x > n)
  )
    throw new Error("Infeasible marginal counts");
  return intersection
    ? maximum
      ? Math.min(...counts)
      : Math.max(0, sum(counts) - (counts.length - 1) * n)
    : maximum
      ? Math.min(n, sum(counts))
      : Math.max(...counts);
}
export function buildNumericalItem(
  cp: string,
  v: number,
  c: Context,
  seed: string,
  l: L,
): Item {
  const sets: 2 | 3 = cp === "VEN-CP005" ? 2 : 3;
  let r = numericalState(seed, sets);
  let q = "";
  let stem = "";
  let explanation = "";
  let answer: number | string = 0;
  let formula = "";
  let difficulty: Item["difficulty"] = "Medium";
  let modelSets = sets;
  const special = cp === "VEN-CP007" || cp === "VEN-CP008";
  if (cp === "VEN-CP005" || cp === "VEN-CP006" || cp === "VEN-CP009") {
    if (cp === "VEN-CP005") {
      q = TWO_QUERIES[v % TWO_QUERIES.length];
      difficulty = q === "both" || q === "total2" ? "Medium" : "Easy";
    } else
      q =
        cp === "VEN-CP009"
          ? ["onlyA", "exactTwo", "atLeastTwo", "none", "union3"][v % 5]
          : THREE_QUERIES[v % THREE_QUERIES.length];
    const omit = q === "both" ? "pair" : q === "total2" ? "total" : "";
    stem = `${legend(c, sets, l)}. ${data(c, r, sets, l, omit)} ${query(c, q, sets, l)}`;
    answer = sum(QUERY_MASKS[q].map((m) => r[m]));
    explanation = `${derivation(r, sets, l)} ${tx("Required count", "आवश्यक संख्या", "ਲੋੜੀਂਦੀ ਗਿਣਤੀ")[l]} = ${QUERY_MASKS[q].map((m) => r[m]).join(" + ")} = ${answer}.`;
    if (q === "both")
      explanation =
        `${membershipTotal(r, 1)} + ${membershipTotal(r, 2)} − (${sum(r)} − ${r[0]}) = ${answer}. ` +
        explanation;
    if (q === "total2")
      explanation = `${tx("At least one", "कम-से-कम एक", "ਘੱਟੋ-ਘੱਟ ਇੱਕ")[l]} = ${membershipTotal(r, 1)} + ${membershipTotal(r, 2)} − ${r[3]} = ${sum(r) - r[0]}. ${tx("Total", "कुल", "ਕੁੱਲ")[l]} = ${sum(r) - r[0]} + ${r[0]} = ${answer}.`;
    formula =
      sets === 2
        ? "n(A\\cup B)=n(A)+n(B)-n(A\\cap B)"
        : "n(A\\cup B\\cup C)=n(A)+n(B)+n(C)-n(A\\cap B)-n(A\\cap C)-n(B\\cap C)+n(A\\cap B\\cap C)";
  }
  if (special && cp === "VEN-CP007") {
    const mode = v % 7;
    q = [
      "percentage-count",
      "percentage-total",
      "ratio-two",
      "ratio-three",
      "percentage-three-count",
      "percentage-three-total",
      "ratio-given-total",
    ][mode];
    if (mode < 2) {
      modelSets = 2;
      const delta = (hash(seed) % 3) * 5,
        p = [15, 25 + delta, 35 - delta, 25],
        scale = 2 + (hash(seed + "scale") % 9);
      r = p.map((x) => x * scale);
      const a = p[1] + p[3],
        b = p[2] + p[3];
      stem =
        `${legend(c, 2, l)}. ` +
        tx(
          `In a survey, ${a}% belong to A, ${b}% belong to B, and ${p[0]}% belong to neither.`,
          `एक सर्वेक्षण में ${a}% लोग A में, ${b}% लोग B में आते हैं और ${p[0]}% किसी भी समूह में नहीं आते।`,
          `ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ ${a}% ਲੋਕ A ਵਿੱਚ, ${b}% ਲੋਕ B ਵਿੱਚ ਆਉਂਦੇ ਹਨ ਅਤੇ ${p[0]}% ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ।`,
        )[l];
      if (mode === 0) {
        answer = r[3];
        stem += " " + prefix(sum(r), l) + " " + query(c, "both", 2, l);
      } else {
        answer = sum(r);
        difficulty = "Hard";
        stem +=
          " " +
          tx(
            `${r[3]} people belong to both groups. How many people were surveyed?`,
            `${r[3]} लोग दोनों समूहों में आते हैं। कुल कितने लोगों का सर्वेक्षण किया गया?`,
            `${r[3]} ਲੋਕ ਦੋਵਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ। ਕੁੱਲ ਕਿੰਨੇ ਲੋਕਾਂ ਦਾ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ?`,
          )[l];
      }
      explanation =
        tx(
          "Both-group percentage",
          "दोनों समूहों का प्रतिशत",
          "ਦੋਵਾਂ ਸਮੂਹਾਂ ਦਾ ਪ੍ਰਤੀਸ਼ਤ",
        )[l] +
        ` = ${a} + ${b} − (100 − ${p[0]}) = ${p[3]}%. ` +
        (mode === 0
          ? `${sum(r)} × ${p[3]}/100 = ${answer}.`
          : `${r[3]} × 100/${p[3]} = ${answer}.`);
      formula =
        mode === 0
          ? "n(A\\cap B)=N(p_A+p_B+p_0-100)/100"
          : "N=100n(A\\cap B)/(p_A+p_B+p_0-100)";
    } else if (mode < 4) {
      modelSets = mode === 2 ? 2 : 3;
      r = numericalState(seed, modelSets).map((x) => x + 1);
      const x = mode === 2 ? r[1] : r[3] + r[5] + r[6],
        y = mode === 2 ? r[2] : r[7];
      answer = ratio(x, y);
      difficulty = mode === 3 ? "Hard" : "Medium";
      stem =
        `${legend(c, modelSets, l)}. ${data(c, r, modelSets, l)} ` +
        tx(
          mode === 2
            ? "What is the ratio of people in A only to people in B only?"
            : "What is the ratio of people in exactly two groups to people in all three?",
          mode === 2
            ? "केवल A में आने वालों और केवल B में आने वालों की संख्या का अनुपात क्या है?"
            : "ठीक दो समूहों में आने वालों और तीनों समूहों में आने वालों की संख्या का अनुपात क्या है?",
          mode === 2
            ? "ਸਿਰਫ਼ A ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਅਤੇ ਸਿਰਫ਼ B ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?"
            : "ਠੀਕ ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਅਤੇ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?",
        )[l];
      explanation = `${derivation(r, modelSets, l)} ${tx("Required ratio", "आवश्यक अनुपात", "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ")[l]} = ${x}:${y} = ${answer}.`;
      formula = "\\text{ratio}=a:b";
    }
    if (mode === 4 || mode === 5) {
      const delta = (hash(seed) % 3) * 2,
        p = [10, 15 + delta, 20 - delta, 10, 15, 10, 10, 10],
        scale = 2 + (hash(seed + "scale") % 9);
      r = p.map((x) => x * scale);
      modelSets = 3;
      const a = membershipTotal(p, 1),
        b = membershipTotal(p, 2),
        cv = membershipTotal(p, 4),
        ab = membershipTotal(p, 3),
        ac = membershipTotal(p, 5),
        bc = membershipTotal(p, 6),
        t = p[7];
      stem =
        `${legend(c, 3, l)}. ` +
        tx(
          `In a survey, ${a}% belong to A, ${b}% to B, ${cv}% to C, ${ab}% to both A and B, ${ac}% to both A and C, ${bc}% to both B and C, and ${t}% to all three. Pairwise percentages include the all-three group.`,
          `एक सर्वेक्षण में ${a}% लोग A में, ${b}% B में, ${cv}% C में, ${ab}% A और B दोनों में, ${ac}% A और C दोनों में, ${bc}% B और C दोनों में और ${t}% तीनों में आते हैं। हर जोड़ी के प्रतिशत में तीनों का साझा भाग भी शामिल है।`,
          `ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ ${a}% ਲੋਕ A ਵਿੱਚ, ${b}% B ਵਿੱਚ, ${cv}% C ਵਿੱਚ, ${ab}% A ਅਤੇ B ਦੋਵਾਂ ਵਿੱਚ, ${ac}% A ਅਤੇ C ਦੋਵਾਂ ਵਿੱਚ, ${bc}% B ਅਤੇ C ਦੋਵਾਂ ਵਿੱਚ ਅਤੇ ${t}% ਤਿੰਨਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ। ਹਰ ਜੋੜੇ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਤਿੰਨਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਵੀ ਸ਼ਾਮਲ ਹੈ।`,
        )[l];
      const union = a + b + cv - ab - ac - bc + t,
        none = 100 - union;
      explanation =
        tx("At least one", "कम-से-कम एक", "ਘੱਟੋ-ਘੱਟ ਇੱਕ")[l] +
        ` = ${a} + ${b} + ${cv} − ${ab} − ${ac} − ${bc} + ${t} = ${union}%. ${labels[0][l]} = 100 − ${union} = ${none}%. `;
      if (mode === 4) {
        answer = r[0];
        stem += " " + prefix(sum(r), l) + " " + query(c, "none", 3, l);
        explanation += `${sum(r)} × ${none}/100 = ${answer}.`;
      } else {
        answer = sum(r);
        difficulty = "Hard";
        stem +=
          " " +
          tx(
            `${r[0]} people belong to none of the groups. How many people were surveyed?`,
            `${r[0]} लोग किसी समूह में नहीं आते हैं। कुल कितने लोगों का सर्वेक्षण किया गया?`,
            `${r[0]} ਲੋਕ ਕਿਸੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ ਹਨ। ਕੁੱਲ ਕਿੰਨੇ ਲੋਕਾਂ ਦਾ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ?`,
          )[l];
        explanation += `${r[0]} × 100/${none} = ${answer}.`;
      }
      formula = "p_{union}=p_A+p_B+p_C-p_{AB}-p_{AC}-p_{BC}+p_{ABC}";
    }
    if (mode === 6) {
      modelSets = 2;
      const x = 2 + (hash(seed) % 20),
        co = [1, 2, 3, 1];
      r = co.map((a) => a * x);
      answer = sum(r);
      difficulty = "Hard";
      stem =
        `${legend(c, 2, l)}. ` +
        tx(
          `The numbers in A only, B only, both, and neither are in the ratio 2:3:1:1. ${x} people belong to both groups. How many people were surveyed?`,
          `केवल A, केवल B, दोनों और किसी भी समूह में न आने वालों की संख्याओं का अनुपात 2:3:1:1 है। ${x} लोग दोनों समूहों में आते हैं। कुल कितने लोगों का सर्वेक्षण किया गया?`,
          `ਸਿਰਫ਼ A, ਸਿਰਫ਼ B, ਦੋਵਾਂ ਅਤੇ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ 2:3:1:1 ਹੈ। ${x} ਲੋਕ ਦੋਵਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ। ਕੁੱਲ ਕਿੰਨੇ ਲੋਕਾਂ ਦਾ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ?`,
        )[l];
      explanation =
        tx(
          "One ratio part is the both-group count.",
          "अनुपात का एक भाग दोनों समूहों की संख्या है।",
          "ਅਨੁਪਾਤ ਦਾ ਇੱਕ ਹਿੱਸਾ ਦੋਵਾਂ ਸਮੂਹਾਂ ਦੀ ਗਿਣਤੀ ਹੈ।",
        )[l] +
        ` 1 ${tx("part", "भाग", "ਹਿੱਸਾ")[l]} = ${x}. ${tx("Total", "कुल", "ਕੁੱਲ")[l]} = (2 + 3 + 1 + 1) × ${x} = ${answer}.`;
      formula = "N=(2+3+1+1)x";
    }
  }
  if (special && cp === "VEN-CP008") {
    const mode = v % 4;
    q = ["missing-pair", "missing-triple", "missing-total", "region-equation"][
      mode
    ];
    if (mode === 0) {
      modelSets = 2;
      r = numericalState(seed, 2);
      answer = r[3];
      stem =
        `${legend(c, 2, l)}. ${data(c, r, 2, l, "pair")} ` +
        tx(
          "If x people belong to both groups, find x.",
          "यदि x लोग दोनों समूहों में आते हैं, तो x का मान क्या है?",
          "ਜੇ x ਲੋਕ ਦੋਵਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਤਾਂ x ਦਾ ਮੁੱਲ ਕੀ ਹੈ?",
        )[l];
      explanation = `${membershipTotal(r, 1)} + ${membershipTotal(r, 2)} − x = ${sum(r)} − ${r[0]}. x = ${membershipTotal(r, 1)} + ${membershipTotal(r, 2)} − (${sum(r)} − ${r[0]}) = ${answer}.`;
      formula = "x=n(A)+n(B)-N+n(\\text{neither})";
    }
    if (mode === 1) {
      answer = r[7];
      difficulty = "Hard";
      stem =
        `${legend(c, 3, l)}. ${data(c, r, 3, l, "triple")} ` +
        tx(
          "If x people belong to all three groups, find x.",
          "यदि x लोग तीनों समूहों में आते हैं, तो x का मान क्या है?",
          "ਜੇ x ਲੋਕ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਤਾਂ x ਦਾ ਮੁੱਲ ਕੀ ਹੈ?",
        )[l];
      explanation = `${membershipTotal(r, 1)} + ${membershipTotal(r, 2)} + ${membershipTotal(r, 4)} − ${membershipTotal(r, 3)} − ${membershipTotal(r, 5)} − ${membershipTotal(r, 6)} + x = ${sum(r)} − ${r[0]}. x = (${sum(r)} − ${r[0]}) − (${membershipTotal(r, 1)} + ${membershipTotal(r, 2)} + ${membershipTotal(r, 4)} − ${membershipTotal(r, 3)} − ${membershipTotal(r, 5)} − ${membershipTotal(r, 6)}) = ${answer}.`;
      formula = "x=N-n_0-n(A)-n(B)-n(C)+n(A\\cap B)+n(A\\cap C)+n(B\\cap C)";
    }
    if (mode === 2) {
      answer = sum(r);
      stem =
        `${legend(c, 3, l)}. ${data(c, r, 3, l, "total")} ` +
        tx(
          "The total number surveyed is x. Find x.",
          "सर्वेक्षण में कुल लोगों की संख्या x है। x का मान क्या है?",
          "ਸਰਵੇਖਣ ਵਿੱਚ ਲੋਕਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ x ਹੈ। x ਦਾ ਮੁੱਲ ਕੀ ਹੈ?",
        )[l];
      explanation = `${membershipTotal(r, 1)} + ${membershipTotal(r, 2)} + ${membershipTotal(r, 4)} − ${membershipTotal(r, 3)} − ${membershipTotal(r, 5)} − ${membershipTotal(r, 6)} + ${r[7]} = ${sum(r) - r[0]}. x = ${sum(r) - r[0]} + ${r[0]} = ${answer}.`;
      formula = "x=n(A\\cup B\\cup C)+n_0";
    }
    if (mode === 3) {
      difficulty = "Hard";
      const x = 2 + (hash(seed) % 20),
        co = r.map((_, i) => 1 + (i % 4)),
        constants = r.map((t) => t % 5);
      r = co.map((a, i) => a * x + constants[i]);
      answer = x;
      stem =
        `${legend(c, 3, l)}. ${prefix(sum(r), l)} ` +
        tx(
          "The mutually exclusive region counts are:",
          "अलग-अलग क्षेत्रों की संख्याएँ हैं:",
          "ਵੱਖ-ਵੱਖ ਖੇਤਰਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਹਨ:",
        )[l] +
        " " +
        co
          .map(
            (a, i) =>
              `${labels[i][l]}: ${a === 1 ? "" : a}x${constants[i] ? ` + ${constants[i]}` : ""}`,
          )
          .join("; ") +
        ". " +
        tx("Find x.", "x का मान क्या है?", "x ਦਾ ਮੁੱਲ ਕੀ ਹੈ?")[l];
      explanation =
        tx(
          "These eight regions partition the surveyed population.",
          "ये आठ क्षेत्र सर्वेक्षण के सभी लोगों को अलग-अलग बाँटते हैं।",
          "ਇਹ ਅੱਠ ਖੇਤਰ ਸਰਵੇਖਣ ਦੇ ਸਾਰੇ ਲੋਕਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਵੰਡਦੇ ਹਨ।",
        )[l] +
        ` ${sum(co)}x + ${sum(constants)} = ${sum(r)}. x = (${sum(r)} − ${sum(constants)})/${sum(co)} = ${x}.`;
      formula = "N=\\sum_{i=0}^{7}(a_i x+b_i)";
    }
  }
  if (cp === "VEN-CP010") {
    const mode = v % 8;
    modelSets = [0, 1, 4, 5].includes(mode) ? 2 : 3;
    r = numericalState(seed, modelSets);
    const n = sum(r),
      a = membershipTotal(r, 1),
      b = membershipTotal(r, 2),
      cval = modelSets === 3 ? membershipTotal(r, 4) : 0;
    const counts = modelSets === 3 ? [a, b, cval] : [a, b];
    const maximum = mode % 2 === 1,
      intersection = mode < 4;
    answer = numericalBound(n, counts, intersection, maximum);
    q = `${maximum ? "maximum" : "minimum"}-${intersection ? "intersection" : "union"}-${modelSets}`;
    difficulty = maximum && intersection ? "Medium" : "Hard";
    stem =
      `${legend(c, modelSets, l)}. ${prefix(n, l)} ${counts.map((k, i) => countStatement(c, 1 << i, k, l)).join("; ")}. ` +
      tx(
        `What is the ${maximum ? "maximum" : "minimum"} possible number of people who belong to every one of these groups?`,
        `इन ${intersection ? "सभी समूहों में" : "समूहों में से कम-से-कम एक में"} आने वाले लोगों की ${maximum ? "अधिकतम" : "न्यूनतम"} संभव संख्या क्या है?`,
        `ਇਨ੍ਹਾਂ ${intersection ? "ਸਾਰੇ ਸਮੂਹਾਂ ਵਿੱਚ" : "ਸਮੂਹਾਂ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਵਿੱਚ"} ਆਉਣ ਵਾਲੇ ਲੋਕਾਂ ਦੀ ${maximum ? "ਵੱਧ ਤੋਂ ਵੱਧ" : "ਘੱਟ ਤੋਂ ਘੱਟ"} ਸੰਭਵ ਗਿਣਤੀ ਕੀ ਹੈ?`,
      )[l];
    formula = intersection
      ? maximum
        ? modelSets === 2
          ? "\\min(n(A),n(B))"
          : "\\min(n(A),n(B),n(C))"
        : `\\max(0,\\sum n(A_i)-${modelSets - 1}N)`
      : maximum
        ? "\\min(N,\\sum n(A_i))"
        : "\\max_i n(A_i)";
    const reason = intersection
      ? maximum
        ? tx(
            "The common population cannot exceed the smallest group. Nesting the smaller groups attains this bound.",
            "साझा संख्या सबसे छोटे समूह से अधिक नहीं हो सकती। छोटे समूहों को बड़े समूहों के भीतर रखने पर यह सीमा मिलती है।",
            "ਸਾਂਝੀ ਗਿਣਤੀ ਸਭ ਤੋਂ ਛੋਟੇ ਸਮੂਹ ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋ ਸਕਦੀ। ਛੋਟੇ ਸਮੂਹਾਂ ਨੂੰ ਵੱਡਿਆਂ ਅੰਦਰ ਰੱਖ ਕੇ ਇਹ ਹੱਦ ਮਿਲਦੀ ਹੈ।",
          )
        : tx(
            "Avoiding the common region allows each person to appear in at most k−1 groups. Any memberships beyond (k−1)N force a common member; the count cannot be negative.",
            "सभी समूहों के साझा भाग से बाहर हर व्यक्ति अधिक-से-अधिक k−1 समूहों में आ सकता है। (k−1)N से अधिक सदस्यताएँ साझा भाग में लोगों को आवश्यक बनाती हैं; संख्या ऋणात्मक नहीं हो सकती।",
            "ਸਾਰੇ ਸਮੂਹਾਂ ਦੇ ਸਾਂਝੇ ਹਿੱਸੇ ਤੋਂ ਬਾਹਰ ਹਰ ਵਿਅਕਤੀ ਵੱਧ ਤੋਂ ਵੱਧ k−1 ਸਮੂਹਾਂ ਵਿੱਚ ਆ ਸਕਦਾ ਹੈ। (k−1)N ਤੋਂ ਵੱਧ ਮੈਂਬਰਸ਼ਿਪਾਂ ਸਾਂਝੇ ਹਿੱਸੇ ਵਿੱਚ ਲੋਕਾਂ ਨੂੰ ਲਾਜ਼ਮੀ ਬਣਾਉਂਦੀਆਂ ਹਨ; ਗਿਣਤੀ ਰਿਣਾਤਮਕ ਨਹੀਂ ਹੋ ਸਕਦੀ।",
          )
      : maximum
        ? tx(
            "The union cannot exceed the population or the sum of individual group sizes. Spread memberships to attain this limit.",
            "कम-से-कम एक समूह में आने वालों की संख्या कुल जनसंख्या या समूहों की संख्याओं के योग से अधिक नहीं हो सकती। सदस्यताओं को फैलाकर यह सीमा मिलती है।",
            "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੁੱਲ ਲੋਕਾਂ ਜਾਂ ਸਮੂਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦੇ ਜੋੜ ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋ ਸਕਦੀ। ਮੈਂਬਰਸ਼ਿਪਾਂ ਨੂੰ ਫੈਲਾ ਕੇ ਇਹ ਹੱਦ ਮਿਲਦੀ ਹੈ।",
          )
        : tx(
            "The union must include the largest group. Nest the other groups inside it to attain the minimum.",
            "कम-से-कम एक समूह में आने वालों में सबसे बड़ा समूह शामिल होगा। अन्य समूहों को इसके भीतर रखने पर न्यूनतम संख्या मिलती है।",
            "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ ਸਮੂਹ ਸ਼ਾਮਲ ਹੋਵੇਗਾ। ਬਾਕੀ ਸਮੂਹਾਂ ਨੂੰ ਇਸ ਅੰਦਰ ਰੱਖਣ ਨਾਲ ਘੱਟ ਤੋਂ ਘੱਟ ਗਿਣਤੀ ਮਿਲਦੀ ਹੈ।",
          );
    const calculation = intersection
      ? maximum
        ? `min(${counts.join(", ")})`
        : `max(0, ${counts.join(" + ")} − ${modelSets - 1} × ${n})`
      : maximum
        ? `min(${n}, ${counts.join(" + ")})`
        : `max(${counts.join(", ")})`;
    explanation = `${reason[l].replaceAll("k−1", String(modelSets - 1)).replaceAll(`(${modelSets - 1})N`, `${modelSets - 1} × ${n}`)} ${calculation} = ${answer}.`;
    r = []; // Hidden construction is not the unique solution and must never appear as a solved distribution.
  }
  const numeric = typeof answer === "number";
  const traps: (number | string)[] = [];
  if (numeric) {
    traps.push(
      sum(r),
      sum(r) - r[0],
      membershipTotal(r, 1),
      membershipTotal(r, 2),
      r[7] ?? 0,
      Math.abs(Number(answer) - (r[7] ?? 0)),
      Number(answer) + 1,
      Math.max(0, Number(answer) - 1),
      Number(answer) + 5,
      Number(answer) + 2,
      Number(answer) + 10,
    );
  } else {
    const [a, b] = String(answer).split(":").map(Number);
    traps.push(
      ratio(b, a),
      ratio(a + 1, b),
      ratio(a, b + 1),
      ratio(a + 2, b + 1),
    );
  }
  return {
    stem,
    answer,
    explanation,
    operation:
      cp === "VEN-CP010"
        ? "OVERLAP_BOUNDS"
        : cp === "VEN-CP009"
          ? "CASELET_COUNT"
          : cp === "VEN-CP008"
            ? "SOLVE_UNKNOWN"
            : cp === "VEN-CP007"
              ? "PERCENTAGE_RATIO"
              : "SET_COUNT",
    difficulty,
    regions: r.length ? r : undefined,
    sets: modelSets,
    queryKey: q,
    formula,
    traps,
  };
}
function selectors(r: QuestionStudioGenerationRequest) {
  return [r.patternId, r.canonicalProblemId, r.questionLanguageId]
    .filter(Boolean)
    .map((s) => s!.trim().toUpperCase());
}
export function isVen001NumericalRequest(r: QuestionStudioGenerationRequest) {
  return selectors(r).some((s) =>
    NUMERICAL_CP_IDS.includes(s as (typeof NUMERICAL_CP_IDS)[number]),
  );
}
export function generateVen001NumericalBatch(
  req: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (req.runtimeMode && req.runtimeMode !== "review-only")
    throw new Error(
      "VEN-001 numerical content supports review-only generation",
    );
  if (req.packageId && req.packageId !== "VEN-001")
    throw new Error("Numerical Venn selectors require package VEN-001");
  const cp = selectors(req).find((s) =>
    NUMERICAL_CP_IDS.includes(s as (typeof NUMERICAL_CP_IDS)[number]),
  );
  if (!cp) throw new Error("Select VEN-CP005 through VEN-CP010");
  const lang = req.language ?? "en";
  if (!["en", "hi", "pa"].includes(lang))
    throw new Error("Unsupported numerical Venn language");
  const count = req.count ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 50)
    throw new Error("Numerical Venn count must be 1–50");
  const difficulty =
    req.difficulty && req.difficulty !== "Mixed" ? req.difficulty : undefined;
  if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty))
    throw new Error("Unknown numerical Venn difficulty");
  const seed = req.seed?.trim() || "ven-numerical-v1";
  const questions = [];
  const seen = new Set<string>();
  for (let attempt = 0; questions.length < count && attempt < 5000; attempt++) {
    const group = cp === "VEN-CP009" ? Math.floor(attempt / 5) : attempt;
    const context =
      NUMERICAL_CONTEXTS[(hash(seed) + group) % NUMERICAL_CONTEXTS.length];
    const dataSeed = `${seed}:${cp}:${group}`;
    const variant = cp === "VEN-CP009" ? attempt % 5 : attempt;
    const item = buildNumericalItem(cp, variant, context, dataSeed, lang);
    if (difficulty && item.difficulty !== difficulty) continue;
    if (seen.has(item.stem)) continue;
    seen.add(item.stem);
    const options = [
      String(item.answer),
      ...item.traps
        .filter(
          (x) =>
            x !== undefined &&
            (typeof x !== "number" || Number.isFinite(x)) &&
            String(x) !== String(item.answer),
        )
        .map(String),
    ]
      .filter((s, i, a) => a.indexOf(s) === i)
      .slice(0, 4);
    if (options.length !== 4)
      throw new Error("Unable to form unique numerical options");
    const rotation = hash(dataSeed + variant) % 4;
    for (let k = 0; k < rotation; k++) options.push(options.shift()!);
    const correctIndex = options.indexOf(String(item.answer));
    const id = `${cp}:${context.id}:${hash(dataSeed + variant)}:${lang}`;
    const sharedStimulus =
      cp === "VEN-CP009"
        ? `${legend(context, 3, lang)}. ${data(context, item.regions!, 3, lang)}`
        : undefined;
    questions.push({
      ...lifecycle,
      id,
      questionId: id,
      packageId: "VEN-001",
      patternId: cp,
      cpId: cp,
      checkpointId: cp,
      subject: "Reasoning Ability",
      contentDomain: "Quantitative set counting",
      topic: "Venn Diagrams",
      subtopic: "Numerical Venn Diagrams",
      language: lang,
      locale: lang === "en" ? "en-IN" : lang === "hi" ? "hi-IN" : "pa-IN",
      stem: item.stem,
      text: item.stem,
      options,
      optionLabels: ["A", "B", "C", "D"],
      correctIndex,
      correct: correctIndex,
      answer: "ABCD"[correctIndex],
      canonicalAnswer: String(item.answer),
      explanation: item.explanation,
      explanationSvgs: item.regions ? [diagram(item.regions, item.sets)] : [],
      optionDetails: options.map((text, i) => ({
        label: "ABCD"[i],
        text,
        isCorrect: i === correctIndex,
      })),
      difficulty: item.difficulty,
      difficultyLabel: item.difficulty,
      difficultyAuthority: "PROVISIONAL_OPERATION_BASED",
      questionOperation: item.operation,
      generationSeed: seed,
      reviewStatus: "REVIEW_CANDIDATE_TRILINGUAL",
      runtimeMode: "review-only",
      reviewOnly: true,
      readOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
      caseletId: cp === "VEN-CP009" ? `${cp}:${hash(dataSeed)}` : undefined,
      sharedStimulus,
      semanticMetadata: {
        scenarioId: context.id,
        queryKey: item.queryKey,
        sets: item.sets,
        exclusiveRegions: item.regions,
        formulaLatex: item.formula,
      },
      validation: {
        exactlyOneCorrect: true,
        nonnegativeRegions: item.regions?.every((n) => n >= 0) ?? true,
        localeParityPendingHumanReview: true,
      },
    });
  }
  if (questions.length < count)
    throw new Error(
      `${cp} has no supported ${difficulty ?? "requested"} question batch`,
    );
  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: "VEN-001",
      requestedCheckpoint: cp,
      language: lang,
      seed,
      count,
      reviewOnly: true,
      questionBankWritable: false,
      productionReleaseAuthorized: false,
      contextPoolSize: NUMERICAL_CONTEXTS.length,
    },
  };
}
