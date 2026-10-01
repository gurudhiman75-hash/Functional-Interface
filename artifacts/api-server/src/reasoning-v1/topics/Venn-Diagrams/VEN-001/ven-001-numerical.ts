import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../../../../question-studio/standard-lifecycle.ts";
import { ven001QlForOperation } from "./ql-registry.ts";

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
export type VenNumericalSourceSupport =
  | "STRONG_LIBRARY_SUPPORT"
  | "DIRECT_OPERATION_SUPPORT"
  | "DERIVED_EXTENSION"
  | "SOURCE_GAP_OPEN";

export function venNumericalSourceSupport(cp: string, queryKey: string): {
  status: VenNumericalSourceSupport;
  note: string;
} {
  if (["VEN-CP005", "VEN-CP006", "VEN-CP009"].includes(cp)) {
    return {
      status: "STRONG_LIBRARY_SUPPORT",
      note: "Core headcount and populated-Venn counting operations are repeatedly represented in the Examtree reasoning source Library.",
    };
  }
  if (cp === "VEN-CP007") {
    if (["percentage-count", "percentage-three-count"].includes(queryKey)) {
      return {
        status: "STRONG_LIBRARY_SUPPORT",
        note: "Percentage-based two-set and three-set Venn operations are directly represented in the Examtree Library.",
      };
    }
    if (["percentage-total", "percentage-three-total"].includes(queryKey)) {
      return {
        status: "DIRECT_OPERATION_SUPPORT",
        note: "The governing percentage/inclusion-exclusion operation is source-backed; recovering the total is the algebraic inverse of the observed task.",
      };
    }
    return {
      status: "DERIVED_EXTENSION",
      note: "Ratio-form Venn questions are currently a controlled generator extension; dedicated exam-pattern evidence was not located in the Library pass.",
    };
  }
  if (cp === "VEN-CP008") {
    if (queryKey === "missing-pair") {
      return {
        status: "STRONG_LIBRARY_SUPPORT",
        note: "Recovering a missing two-set intersection from totals/union is directly represented in the Examtree Library.",
      };
    }
    if (queryKey === "missing-triple") {
      return {
        status: "DIRECT_OPERATION_SUPPORT",
        note: "Three-set inclusion-exclusion is source-backed, but the exact explicit-x centre formulation is less directly evidenced.",
      };
    }
    return {
      status: "DERIVED_EXTENSION",
      note: "The solve-for-total/region-equation form is a controlled inverse/constraint extension of source-backed inclusion-exclusion operations.",
    };
  }
  if (cp === "VEN-CP010") {
    return {
      status: "SOURCE_GAP_OPEN",
      note: "A dedicated Library pass did not locate exam-pattern evidence for explicit minimum/maximum overlap-bound questions; keep review-only pending source evidence.",
    };
  }
  return {
    status: "DIRECT_OPERATION_SUPPORT",
    note: "Source support is inherited from the chapter-level numerical Venn evidence set.",
  };
}
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
      "ਲਾਈਵ ਆਨਲਾਈਨ ਕਲਾਸਾਂ|ਰਿਕਾਰਡ ਕੀਤੇ ਪਾਠ|ਡਿਜ਼ੀਟਲ ਨੋਟਸ",
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
    `Among ${total} people,`,
    `कुल ${total} लोगों में,`,
    `ਕੁੱਲ ${total} ਲੋਕਾਂ ਵਿੱਚ,`,
  )[l];
}
function surveyIntro(l: L, _seed: string | number) {
  return tx(
    "The figures show that",
    "आँकड़ों के अनुसार",
    "ਅੰਕੜਿਆਂ ਅਨੁਸਾਰ",
  )[l];
}
function groupReference(c: Context, i: number, l: L) {
  const name = c.names[l].split("|")[i];
  return tx(
    `Group ${"ABC"[i]} consists of people who ${c.verb.en} ${name}`,
    `समूह ${"ABC"[i]} में वे लोग हैं जो ${name} ${c.verb.hi}`,
    `${"ABC"[i]} ਸਮੂਹ ਵਿੱਚ ਉਹ ਲੋਕ ਹਨ ਜੋ ${name} ${c.verb.pa}`,
  )[l];
}
function percentStatement(c: Context, mask: number, percent: number, l: L) {
  const members = [0, 1, 2].filter((i) => mask & (1 << i));
  const names = c.names[l].split("|");
  if (l === "en") {
    const group =
      members.length === 1
        ? names[members[0]]
        : members.length === 2
          ? `both ${names[members[0]]} and ${names[members[1]]}`
          : `all three: ${join(
              members.map((i) => names[i]),
              l,
            )}`;
    return `${percent}% of respondents ${c.verb.en} ${group}`;
  }
  if (l === "hi") {
    const group =
      members.length === 1
        ? `${names[members[0]]} ${c.verb.hi}`
        : members.length === 2
          ? `${names[members[0]]} और ${names[members[1]]} दोनों ${c.verb.hi}`
          : `${join(
              members.map((i) => names[i]),
              l,
            )} तीनों ${c.verb.hi}`;
    return `${percent}% लोग ${group}`;
  }
  const group =
    members.length === 1
      ? `${names[members[0]]} ${c.verb.pa}`
      : members.length === 2
        ? `${names[members[0]]} ਅਤੇ ${names[members[1]]} ਦੋਵੇਂ ${c.verb.pa}`
        : `${join(
            members.map((i) => names[i]),
            l,
          )} ਤਿੰਨੇ ${c.verb.pa}`;
  return `${percent}% ਲੋਕ ${group}`;
}
function regionName(c: Context, mask: number, l: L) {
  const names = c.names[l].split("|");
  const members = [0, 1, 2].filter((i) => mask & (1 << i));
  if (!members.length) return labels[0][l];
  if (members.length === 1)
    return tx(
      `Only ${names[members[0]]}`,
      `केवल ${names[members[0]]}`,
      `ਸਿਰਫ਼ ${names[members[0]]}`,
    )[l];
  if (members.length === 3)
    return tx(`All three groups`, `तीनों समूह`, `ਤਿੰਨੇ ਸਮੂਹ`)[l];
  const selected = join(
    members.map((i) => names[i]),
    l,
  );
  return tx(`${selected} only`, `केवल ${selected}`, `ਸਿਰਫ਼ ${selected}`)[l];
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
    omit === "total" ? surveyIntro(l, r.join("|")) : prefix(sum(r), l);
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
  const names = c.names[l].split("|");
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
      `${names[0]} और ${names[1]} वाले समूहों में आते हैं, लेकिन ${names[2]} वाले समूह में नहीं`,
      `${names[0]} ਅਤੇ ${names[1]} ਵਾਲੇ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ${names[2]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ`,
    ),
    onlyBC: tx(
      `${activity(c, [1, 2], l)}, but do not ${a}`,
      `${names[1]} और ${names[2]} वाले समूहों में आते हैं, लेकिन ${names[0]} वाले समूह में नहीं`,
      `${names[1]} ਅਤੇ ${names[2]} ਵਾਲੇ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ${names[0]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ`,
    ),
    onlyAC: tx(
      `${activity(c, [0, 2], l)}, but do not ${b}`,
      `${names[0]} और ${names[2]} वाले समूहों में आते हैं, लेकिन ${names[1]} वाले समूह में नहीं`,
      `${names[0]} ਅਤੇ ${names[2]} ਵਾਲੇ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ${names[1]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ`,
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
      `belong to the ${names[0]} group, the ${names[1]} group, or both, but not the ${names[2]} group`,
      `${names[0]} या ${names[1]} वाले समूह में, या दोनों में आते हैं, लेकिन ${names[2]} वाले समूह में नहीं`,
      `${names[0]} ਜਾਂ ${names[1]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ, ਜਾਂ ਦੋਵਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ${names[2]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ`,
    ),
    AnotB: tx(
      `belong to the ${names[0]} group but not the ${names[1]} group, whether or not they also belong to the ${names[2]} group`,
      `${names[0]} वाले समूह में आते हैं, लेकिन ${names[1]} वाले समूह में नहीं; ${names[2]} वाले समूह में हो सकते हैं`,
      `${names[0]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ${names[1]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ; ${names[2]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ`,
    ),
    inclusiveAB: tx(
      `belong to both the ${names[0]} and ${names[1]} groups, including those also in the ${names[2]} group`,
      `${names[0]} और ${names[1]} वाले दोनों समूहों में आते हैं, ${names[2]} वाले समूह में आने वालों सहित`,
      `${names[0]} ਅਤੇ ${names[1]} ਵਾਲੇ ਦੋਵਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ${names[2]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਸਮੇਤ`,
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
      `${c.names.hi.split("|")[0]} वाले समूह में आते हैं, लेकिन ${c.names.hi.split("|")[1]} वाले समूह में नहीं`,
      `${c.names.pa.split("|")[0]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ${c.names.pa.split("|")[1]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ`,
    )[l];
  if (sets === 2 && q === "onlyB")
    label = tx(
      `${activity(c, [1], l)} but do not ${activity(c, [0], l)}`,
      `${c.names.hi.split("|")[1]} वाले समूह में आते हैं, लेकिन ${c.names.hi.split("|")[0]} वाले समूह में नहीं`,
      `${c.names.pa.split("|")[1]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਪਰ ${c.names.pa.split("|")[0]} ਵਾਲੇ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ`,
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
function explanationRegion(c: Context, mask: number, l: L) {
  const members = [0, 1, 2].filter((i) => mask & (1 << i));
  const names = c.names[l].split("|");
  if (!members.length)
    return tx(
      "None of these groups",
      "इनमें से किसी समूह में नहीं",
      "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ",
    )[l];
  if (members.length === 1)
    return tx(
      `Only ${names[members[0]]}`,
      `केवल ${names[members[0]]}`,
      `ਸਿਰਫ਼ ${names[members[0]]}`,
    )[l];
  if (members.length === 3)
    return tx(`All three groups`, `तीनों समूह`, `ਤਿੰਨੇ ਸਮੂਹ`)[l];
  const selected = join(
    members.map((i) => names[i]),
    l,
  );
  const excluded = names.find((_, i) => !members.includes(i)) ?? names[2];
  return tx(
    `Only ${selected} (not ${excluded})`,
    `केवल ${selected} (${excluded} वाले समूह को छोड़कर)`,
    `ਸਿਰਫ਼ ${selected} (${excluded} ਵਾਲੇ ਸਮੂਹ ਤੋਂ ਬਿਨਾਂ)`,
  )[l];
}
function derivation(c: Context, r: State, sets: 2 | 3, l: L) {
  const a = membershipTotal(r, 1),
    b = membershipTotal(r, 2),
    ab = membershipTotal(r, 3);
  if (sets === 2) {
    const first = c.names[l].split("|")[0],
      second = c.names[l].split("|")[1];
    return `${tx(`There are ${a} people who ${c.verb.en} ${first} and ${b} who ${c.verb.en} ${second}. The overlap is counted in both totals.`, `${a} लोग ${first} ${c.verb[l]} और ${b} लोग ${second} ${c.verb[l]}। साझा लोगों को दोनों कुल संख्याओं में गिना गया है।`, `${a} ਲੋਕ ${first} ${c.verb[l]} ਅਤੇ ${b} ਲੋਕ ${second} ${c.verb[l]}। ਸਾਂਝੇ ਲੋਕ ਦੋਵਾਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹਨ।`)[l]} ${explanationRegion(c, 1, l)} = ${a} − ${ab} = ${r[1]}; ${explanationRegion(c, 2, l)} = ${b} − ${ab} = ${r[2]}. ${tx("The number in at least one group", "कम-से-कम एक समूह में आने वाले लोग", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਲੋਕ")[l]} = ${a} + ${b} − ${ab} = ${sum(r) - r[0]}. ${explanationRegion(c, 0, l)} = ${sum(r)} − ${sum(r) - r[0]} = ${r[0]}.`;
  }
  const cTotal = membershipTotal(r, 4),
    ac = membershipTotal(r, 5),
    bc = membershipTotal(r, 6),
    t = r[7];
  return `${tx(`First place ${t} people in the region common to all three groups: ${c.names.en.split("|").join(", ")}.`, `पहले तीनों समूहों—${c.names.hi.split("|").join(", ")}—के साझा क्षेत्र में ${t} लोगों को रखें।`, `ਪਹਿਲਾਂ ਤਿੰਨਾਂ ਸਮੂਹਾਂ—${c.names.pa.split("|").join(", ")}—ਦੇ ਸਾਂਝੇ ਖੇਤਰ ਵਿੱਚ ${t} ਲੋਕ ਰੱਖੋ।`)[l]} ${explanationRegion(c, 3, l)} = ${ab} − ${t} = ${r[3]}; ${explanationRegion(c, 5, l)} = ${ac} − ${t} = ${r[5]}; ${explanationRegion(c, 6, l)} = ${bc} − ${t} = ${r[6]}. ${explanationRegion(c, 1, l)} = ${a} − ${r[3]} − ${r[5]} − ${t} = ${r[1]}; ${explanationRegion(c, 2, l)} = ${b} − ${r[3]} − ${r[6]} − ${t} = ${r[2]}; ${explanationRegion(c, 4, l)} = ${cTotal} − ${r[5]} − ${r[6]} − ${t} = ${r[4]}. ${explanationRegion(c, 0, l)} = ${sum(r)} − (${r.slice(1).join(" + ")}) = ${r[0]}.`;
}
function requestedRegions(c: Context, r: State, q: string, l: L) {
  const masks = QUERY_MASKS[q];
  if (masks.length === 1)
    return `${explanationRegion(c, masks[0], l)} = ${r[masks[0]]}.`;
  return `${masks.map((m) => `${explanationRegion(c, m, l)} (${r[m]})`).join(" + ")} = ${sum(masks.map((m) => r[m]))}.`;
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
    stem = `${data(c, r, sets, l, omit)} ${query(c, q, sets, l)}`;
    answer = sum(QUERY_MASKS[q].map((m) => r[m]));
    if (sets === 2) {
      const a = membershipTotal(r, 1),
        b = membershipTotal(r, 2),
        both = r[3],
        union = sum(r) - r[0],
        names = c.names[l].split("|");
      if (q === "both")
        explanation = `${
          tx(
            `The totals for ${names[0]} and ${names[1]} are given, along with the number in neither group. First find the number in at least one group, then use inclusion–exclusion to find the overlap.`,
            `${names[0]} और ${names[1]} की कुल संख्याएँ तथा दोनों में से किसी समूह में न आने वालों की संख्या दी है। पहले कम-से-कम एक समूह में आने वालों की संख्या निकालें, फिर साझा लोगों की संख्या निकालें।`,
            `${names[0]} ਅਤੇ ${names[1]} ਦੀਆਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਅਤੇ ਦੋਵਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਦਿੱਤੀ ਹੈ। ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਸਾਂਝੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`,
          )[l]
        } ${tx("At least one", "कम-से-कम एक", "ਘੱਟੋ-ਘੱਟ ਇੱਕ")[l]} = ${sum(r)} − ${r[0]} = ${union}. ${tx("Both", "दोनों", "ਦੋਵੇਂ")[l]} = ${a} + ${b} − ${union} = ${answer}.`;
      else if (q === "total2")
        explanation = `${tx(`Add the ${names[0]} and ${names[1]} totals and subtract their overlap once to find how many are in at least one group:`, `${names[0]} और ${names[1]} की कुल संख्याएँ जोड़ें और साझा लोगों को एक बार घटाएँ:`, `${names[0]} ਅਤੇ ${names[1]} ਦੀਆਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਜੋੜੋ ਅਤੇ ਸਾਂਝੇ ਲੋਕ ਇੱਕ ਵਾਰ ਘਟਾਓ:`)[l]} ${a} + ${b} − ${both} = ${union}. ${tx("Then add those in neither group:", "फिर दोनों में से किसी समूह में न आने वालों को जोड़ें:", "ਫਿਰ ਦੋਵਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਨੂੰ ਜੋੜੋ:")[l]} ${union} + ${r[0]} = ${answer}.`;
      else if (q === "onlyA")
        explanation = `${tx(`To find people in ${names[0]} but not ${names[1]}, subtract the overlap from the ${names[0]} total:`, `केवल ${names[0]} वाले लोगों के लिए ${names[0]} और ${names[1]} के साझा लोगों को ${names[0]} की कुल संख्या में से घटाएँ:`, `ਸਿਰਫ਼ ${names[0]} ਵਾਲੇ ਲੋਕ ਕੱਢਣ ਲਈ ${names[0]} ਅਤੇ ${names[1]} ਦੇ ਸਾਂਝੇ ਲੋਕ ${names[0]} ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਵਿੱਚੋਂ ਘਟਾਓ:`)[l]} ${a} − ${both} = ${answer}.`;
      else if (q === "onlyB")
        explanation = `${tx(`To find people in ${names[1]} but not ${names[0]}, subtract the overlap from the ${names[1]} total:`, `केवल ${names[1]} वाले लोगों के लिए ${names[0]} और ${names[1]} के साझा लोगों को ${names[1]} की कुल संख्या में से घटाएँ:`, `ਸਿਰਫ਼ ${names[1]} ਵਾਲੇ ਲੋਕ ਕੱਢਣ ਲਈ ${names[0]} ਅਤੇ ${names[1]} ਦੇ ਸਾਂਝੇ ਲੋਕ ${names[1]} ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਵਿੱਚੋਂ ਘਟਾਓ:`)[l]} ${b} − ${both} = ${answer}.`;
      else if (q === "exactOne2") {
        const onlyA = a - both,
          onlyB = b - both;
        explanation = `${tx(`Remove the ${names[0]}–${names[1]} overlap from each group total, then add the two exclusive parts:`, `${names[0]} और ${names[1]} के साझा लोगों को दोनों समूहों की कुल संख्याओं से घटाएँ, फिर दोनों केवल-वाले हिस्से जोड़ें:`, `${names[0]} ਅਤੇ ${names[1]} ਦੇ ਸਾਂਝੇ ਲੋਕ ਦੋਵਾਂ ਸਮੂਹਾਂ ਦੀਆਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਵਿੱਚੋਂ ਘਟਾਓ, ਫਿਰ ਦੋਵੇਂ ਸਿਰਫ਼-ਵਾਲੇ ਹਿੱਸੇ ਜੋੜੋ:`)[l]} (${a} − ${both}) + (${b} − ${both}) = ${onlyA} + ${onlyB} = ${answer}.`;
      } else if (q === "union2")
        explanation = `${tx(`Add the ${names[0]} and ${names[1]} totals and subtract their overlap once because those people were counted in both totals:`, `${names[0]} और ${names[1]} की कुल संख्याएँ जोड़ें और साझा लोगों को एक बार घटाएँ, क्योंकि वे दोनों कुल संख्याओं में गिने गए हैं:`, `${names[0]} ਅਤੇ ${names[1]} ਦੀਆਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਜੋੜੋ ਅਤੇ ਸਾਂਝੇ ਲੋਕ ਇੱਕ ਵਾਰ ਘਟਾਓ, ਕਿਉਂਕਿ ਉਹ ਦੋਵਾਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਵਿੱਚ ਗਿਣੇ ਗਏ ਹਨ:`)[l]} ${a} + ${b} − ${both} = ${answer}.`;
      else if (q === "none")
        explanation = `${tx(`First find how many people belong to at least one of the two groups (${names[0]} or ${names[1]}):`, `पहले ${names[0]} या ${names[1]} वाले कम-से-कम एक समूह में आने वालों की संख्या निकालें:`, `ਪਹਿਲਾਂ ${names[0]} ਜਾਂ ${names[1]} ਵਾਲੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ:`)[l]} ${a} + ${b} − ${both} = ${union}. ${tx("Subtract this from the surveyed total to find those in neither group:", "दोनों में से किसी समूह में न आने वालों के लिए इसे कुल संख्या में से घटाएँ:", "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਲਈ ਇਸ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਵਿੱਚੋਂ ਘਟਾਓ:")[l]} ${sum(r)} − ${union} = ${answer}.`;
      else
        explanation = derivation(c, r, 2, l);
    } else {
      const regionWork =
        q === "none"
          ? (() => {
              const names = c.names[l].split("|");
              const a = membershipTotal(r, 1),
                b = membershipTotal(r, 2),
                cTotal = membershipTotal(r, 4),
                ab = membershipTotal(r, 3),
                ac = membershipTotal(r, 5),
                bc = membershipTotal(r, 6),
                all = r[7],
                union = a + b + cTotal - ab - ac - bc + all;
              return `${
                tx(
                  `For ${names.join(", ")}, each pair count includes the people in all three groups. Add the three group totals, subtract the three pair counts, then add the all-three count back once. Subtract this union from the total to find those in none of the groups.`,
                  `${names.join(", ")} के तीनों समूहों की कुल संख्याएँ जोड़ें और तीनों जोड़ियों की संख्याएँ घटाएँ। तीनों समूहों में आने वालों की संख्या एक बार फिर जोड़ें। फिर किसी भी समूह में न आने वालों के लिए इस संघ को कुल संख्या में से घटाएँ।`,
                  `${names.join(", ")} ਦੇ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਦੀਆਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਜੋੜੋ ਅਤੇ ਤਿੰਨਾਂ ਜੋੜਿਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਘਟਾਓ। ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਇੱਕ ਵਾਰ ਮੁੜ ਜੋੜੋ। ਫਿਰ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਲਈ ਇਸ ਜੋੜ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਵਿੱਚੋਂ ਘਟਾਓ।`,
                )[l]
              } ${a} + ${b} + ${cTotal} − ${ab} − ${ac} − ${bc} + ${all} = ${union}. ${sum(r)} − ${union} = ${r[0]}.`;
            })()
          : `${
              tx(
                `For ${c.names.en.split("|").join(", ")}, each pair count also includes the people in all three groups. Subtract the all-three count from each pair count to get the pair-only regions; then remove those overlaps from each group total to get the only-one-group regions.`,
                `${c.names.hi.split("|").join(", ")} की हर जोड़ी की संख्या में तीनों समूहों में आने वाले लोग भी शामिल हैं। केवल दो समूहों में आने वालों के लिए हर जोड़ी की संख्या में से तीनों वाले लोगों की संख्या घटाएँ; फिर हर समूह की कुल संख्या में से उसके साझा हिस्से घटाएँ।`,
                `${c.names.pa.split("|").join(", ")} ਦੀ ਹਰ ਜੋੜੀ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਲੋਕ ਵੀ ਸ਼ਾਮਲ ਹਨ। ਸਿਰਫ਼ ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਲਈ ਹਰ ਜੋੜੀ ਦੀ ਗਿਣਤੀ ਵਿੱਚੋਂ ਤਿੰਨਾਂ ਵਾਲੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਘਟਾਓ; ਫਿਰ ਹਰ ਸਮੂਹ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਵਿੱਚੋਂ ਉਸਦੇ ਸਾਂਝੇ ਹਿੱਸੇ ਘਟਾਓ।`,
              )[l]
            } ${derivation(c, r, 3, l)} ${requestedRegions(c, r, q, l)}`;
      explanation = regionWork;
    }
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
      const names = c.names[l].split("|");
      stem = `${mode === 0 ? prefix(sum(r), l) : surveyIntro(l, seed)} ${percentStatement(c, 1, a, l)}; ${percentStatement(c, 2, b, l)}; ${tx(`${p[0]}% belong to neither group.`, `${p[0]}% लोग किसी भी समूह में नहीं आते।`, `${p[0]}% ਲੋਕ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ।`)[l]}`;
      if (mode === 0) {
        answer = r[3];
        stem += " " + query(c, "both", 2, l);
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
          `${p[0]}% are in neither group, so ${100 - p[0]}% are in at least one group. The totals for ${names[0]} and ${names[1]} count the overlap twice; subtract the at-least-one percentage to isolate the overlap.`,
          `${p[0]}% लोग किसी भी समूह में नहीं आते, इसलिए ${100 - p[0]}% कम-से-कम एक समूह में आते हैं। ${names[0]} और ${names[1]} की कुल संख्याओं में साझा लोग दो बार गिने जाते हैं; साझा प्रतिशत निकालने के लिए कम-से-कम एक समूह का प्रतिशत घटाएँ।`,
          `${p[0]}% ਲੋਕ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ, ਇਸ ਲਈ ${100 - p[0]}% ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਂਦੇ ਹਨ। ${names[0]} ਅਤੇ ${names[1]} ਦੀਆਂ ਕੁੱਲ ਗਿਣਤੀਆਂ ਵਿੱਚ ਸਾਂਝੇ ਲੋਕ ਦੋ ਵਾਰ ਗਿਣੇ ਜਾਂਦੇ ਹਨ; ਸਾਂਝਾ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭਣ ਲਈ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਓ।`,
        )[l] +
        ` ${a}% + ${b}% − ${100 - p[0]}% = ${p[3]}%. ` +
        (mode === 0
          ? `${tx("So the overlap count is", "इसलिए साझा लोगों की संख्या", "ਇਸ ਲਈ ਸਾਂਝੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ")[l]} ${sum(r)} × ${p[3]}/100 = ${answer}.`
          : `${tx("The given overlap count is", "दी गई साझा संख्या", "ਦਿੱਤੀ ਸਾਂਝੀ ਗਿਣਤੀ")[l]} ${r[3]}; ${tx("divide by its percentage as a fraction of 100 to recover the survey total", "सर्वेक्षण का कुल निकालने के लिए इसे साझा प्रतिशत के भिन्न से भाग दें", "ਸਰਵੇਖਣ ਦਾ ਕੁੱਲ ਲੱਭਣ ਲਈ ਇਸ ਨੂੰ ਸਾਂਝੇ ਪ੍ਰਤੀਸ਼ਤ ਦੇ ਭਿੰਨ ਨਾਲ ਭਾਗ ਦਿਓ")[l]}: ${r[3]} × 100/${p[3]} = ${answer}.`);
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
      const names = c.names[l].split("|");
      stem =
        `${data(c, r, modelSets, l)} ` +
        tx(
          mode === 2
            ? `What is the ratio of people who ${c.verb.en} ${names[0]} only to people who ${c.verb.en} ${names[1]} only?`
            : "What is the ratio of people in exactly two groups to people in all three?",
          mode === 2
            ? `केवल ${names[0]} वाले और केवल ${names[1]} वाले लोगों की संख्या का अनुपात क्या है?`
            : "ठीक दो समूहों में आने वालों और तीनों समूहों में आने वालों की संख्या का अनुपात क्या है?",
          mode === 2
            ? `ਸਿਰਫ਼ ${names[0]} ਵਾਲੇ ਅਤੇ ਸਿਰਫ਼ ${names[1]} ਵਾਲੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`
            : "ਠੀਕ ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਅਤੇ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?",
        )[l];
      const common = gcd(x, y);
      if (mode === 2) {
        const aTotal = membershipTotal(r, 1),
          bTotal = membershipTotal(r, 2),
          overlap = r[3];
        const ratioWork =
          common === 1
            ? tx(
                `The ratio ${x}:${y} is already in simplest form. Therefore, the ratio is ${answer}.`,
                `${x}:${y} का अनुपात पहले से सरल रूप में है। अतः अनुपात ${answer}.`,
                `${x}:${y} ਦਾ ਅਨੁਪਾਤ ਪਹਿਲਾਂ ਹੀ ਸਰਲ ਰੂਪ ਵਿੱਚ ਹੈ। ਇਸ ਲਈ ਅਨੁਪਾਤ ${answer}.`,
              )[l]
            : tx(
                `Divide both terms by their highest common factor ${common}: ${x} ÷ ${common} : ${y} ÷ ${common} = ${answer}.`,
                `दोनों पदों को महत्तम समापवर्तक ${common} से भाग दें: ${x} ÷ ${common} : ${y} ÷ ${common} = ${answer}।`,
                `ਦੋਵਾਂ ਪਦਾਂ ਨੂੰ ਮਹੱਤਮ ਸਾਂਝੇ ਗੁਣਨਖੰਡ ${common} ਨਾਲ ਭਾਗ ਦਿਓ: ${x} ÷ ${common} : ${y} ÷ ${common} = ${answer}।`,
              )[l];
        explanation = `${tx(
          `Subtract the overlap from each group total: only ${names[0]} = ${aTotal} − ${overlap} = ${x}; only ${names[1]} = ${bTotal} − ${overlap} = ${y}.`,
          `हर समूह की कुल संख्या में से साझा लोगों को घटाएँ: केवल ${names[0]} = ${aTotal} − ${overlap} = ${x}; केवल ${names[1]} = ${bTotal} − ${overlap} = ${y}।`,
          `ਹਰ ਸਮੂਹ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਵਿੱਚੋਂ ਸਾਂਝੇ ਲੋਕ ਘਟਾਓ: ਸਿਰਫ਼ ${names[0]} = ${aTotal} − ${overlap} = ${x}; ਸਿਰਫ਼ ${names[1]} = ${bTotal} − ${overlap} = ${y}।`,
        )[l]} ${ratioWork}`;
      } else {
        const ab = membershipTotal(r, 3),
          ac = membershipTotal(r, 5),
          bc = membershipTotal(r, 6),
          triple = r[7];
        const ratioWork =
          common === 1
            ? tx(
                `The ratio ${x}:${y} is already in simplest form. Therefore, the ratio is ${answer}.`,
                `${x}:${y} का अनुपात पहले से सरल रूप में है। अतः अनुपात ${answer}.`,
                `${x}:${y} ਦਾ ਅਨੁਪਾਤ ਪਹਿਲਾਂ ਹੀ ਸਰਲ ਰੂਪ ਵਿੱਚ ਹੈ। ਇਸ ਲਈ ਅਨੁਪਾਤ ${answer}.`,
              )[l]
            : tx(
                `Divide both terms by their highest common factor ${common}: ${x} ÷ ${common} : ${y} ÷ ${common} = ${answer}.`,
                `दोनों पदों को महत्तम समापवर्तक ${common} से भाग दें: ${x} ÷ ${common} : ${y} ÷ ${common} = ${answer}।`,
                `ਦੋਵਾਂ ਪਦਾਂ ਨੂੰ ਮਹੱਤਮ ਸਾਂਝੇ ਗੁਣਨਖੰਡ ${common} ਨਾਲ ਭਾਗ ਦਿਓ: ${x} ÷ ${common} : ${y} ÷ ${common} = ${answer}।`,
              )[l];
        explanation = `${tx(
          `Each pair total includes the all-three group. Subtract the all-three count from each pair, then add the three pair-only regions:`,
          `हर जोड़ी की संख्या में तीनों समूहों में आने वाले लोग भी शामिल हैं। हर जोड़ी में से तीनों वाले लोगों को घटाकर तीन केवल-जोड़ी क्षेत्रों को जोड़ें:`,
          `ਹਰ ਜੋੜੇ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਲੋਕ ਵੀ ਸ਼ਾਮਲ ਹਨ। ਹਰ ਜੋੜੇ ਵਿੱਚੋਂ ਤਿੰਨਾਂ ਵਾਲੇ ਲੋਕ ਘਟਾ ਕੇ ਤਿੰਨ ਸਿਰਫ਼-ਜੋੜੀ ਖੇਤਰ ਜੋੜੋ:`,
        )[l]} (${ab} − ${triple}) + (${ac} − ${triple}) + (${bc} − ${triple}) = ${x}. ${tx("All three groups", "तीनों समूह", "ਤਿੰਨੇ ਸਮੂਹ")[l]} = ${y}. ${ratioWork}`;
      }
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
      stem = `${mode === 4 ? prefix(sum(r), l) : surveyIntro(l, hash(seed))} ${percentStatement(c, 1, a, l)}; ${percentStatement(c, 2, b, l)}; ${percentStatement(c, 4, cv, l)}; ${percentStatement(c, 3, ab, l)}; ${percentStatement(c, 5, ac, l)}; ${percentStatement(c, 6, bc, l)}; ${percentStatement(c, 7, t, l)}. ${
        tx(
          "Each pairwise percentage includes people in all three groups.",
          "हर जोड़ी के प्रतिशत में तीनों समूहों के लोग भी शामिल हैं।",
          "ਹਰ ਜੋੜੇ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਦੇ ਲੋਕ ਵੀ ਸ਼ਾਮਲ ਹਨ।",
        )[l]
      }`;
      const union = a + b + cv - ab - ac - bc + t,
        none = 100 - union;
      explanation =
        tx(
          `For ${c.names.en.split("|").join(", ")}, add the three group percentages. Each pair percentage includes the all-three group, so subtract the three pair percentages and then add the all-three percentage back once.`,
          `${c.names.hi.split("|").join(", ")} के तीनों समूहों के प्रतिशत जोड़ें। तीनों जोड़ी-प्रतिशत घटाएँ और अंत में तीनों समूहों में आने वालों का प्रतिशत एक बार फिर जोड़ें।`,
          `${c.names.pa.split("|").join(", ")} ਦੇ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਜੋੜੋ। ਤਿੰਨਾਂ ਜੋੜਿਆਂ ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਓ ਅਤੇ ਅੰਤ ਵਿੱਚ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਇੱਕ ਵਾਰ ਮੁੜ ਜੋੜੋ।`,
        )[l] +
        ` ${a}% + ${b}% + ${cv}% − ${ab}% − ${ac}% − ${bc}% + ${t}% = ${union}%. ${tx("So the percentage in none is", "इसलिए किसी भी समूह में न आने वालों का प्रतिशत", "ਇਸ ਲਈ ਕਿਸੇ ਵੀ ਸਮੂਹ ਵਿੱਚ ਨਾ ਆਉਣ ਵਾਲਿਆਂ ਦਾ ਪ੍ਰਤੀਸ਼ਤ")[l]} 100% − ${union}% = ${none}%. `;
      if (mode === 4) {
        answer = r[0];
        stem += " " + query(c, "none", 3, l);
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
      stem = tx(
        `For ${c.names.en.split("|")[0]} and ${c.names.en.split("|")[1]}, the four disjoint regions—only ${c.names.en.split("|")[0]}, only ${c.names.en.split("|")[1]}, both groups, and neither group—are in the ratio 2:3:1:1. The both-groups region contains ${x} people. How many people were surveyed?`,
        `${c.names.hi.split("|")[0]} और ${c.names.hi.split("|")[1]} के चार अलग हिस्सों—केवल ${c.names.hi.split("|")[0]}, केवल ${c.names.hi.split("|")[1]}, दोनों समूह और कोई भी समूह नहीं—की संख्याओं का अनुपात 2:3:1:1 है। दोनों समूहों वाले हिस्से में ${x} लोग हैं। कुल कितने लोगों का सर्वेक्षण किया गया?`,
        `${c.names.pa.split("|")[0]} ਅਤੇ ${c.names.pa.split("|")[1]} ਦੇ ਚਾਰ ਵੱਖਰੇ ਹਿੱਸਿਆਂ—ਸਿਰਫ਼ ${c.names.pa.split("|")[0]}, ਸਿਰਫ਼ ${c.names.pa.split("|")[1]}, ਦੋਵੇਂ ਸਮੂਹ ਅਤੇ ਕੋਈ ਵੀ ਸਮੂਹ ਨਹੀਂ—ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ 2:3:1:1 ਹੈ। ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਾਲੇ ਹਿੱਸੇ ਵਿੱਚ ${x} ਲੋਕ ਹਨ। ਕੁੱਲ ਕਿੰਨੇ ਲੋਕਾਂ ਦਾ ਸਰਵੇਖਣ ਕੀਤਾ ਗਿਆ?`,
      )[l];
      explanation =
        tx(
          `The overlap between ${c.names.en.split("|")[0]} and ${c.names.en.split("|")[1]} is the one-part section of the 2:3:1:1 ratio.`,
          `${c.names.hi.split("|")[0]} और ${c.names.hi.split("|")[1]} दोनों समूहों में आने वालों की संख्या 2:3:1:1 के अनुपात का एक भाग है।`,
          `${c.names.pa.split("|")[0]} ਅਤੇ ${c.names.pa.split("|")[1]} ਦੋਵਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ 2:3:1:1 ਦੇ ਅਨੁਪਾਤ ਦਾ ਇੱਕ ਹਿੱਸਾ ਹੈ।`,
        )[l] +
        ` ${tx("So one part", "इसलिए एक भाग", "ਇਸ ਲਈ ਇੱਕ ਹਿੱਸਾ")[l]} = ${x}. ${tx("The four disjoint sections together make the total:", "चारों अलग-अलग हिस्सों का योग कुल संख्या है:", "ਚਾਰੇ ਵੱਖ-ਵੱਖ ਹਿੱਸਿਆਂ ਦਾ ਜੋੜ ਕੁੱਲ ਗਿਣਤੀ ਹੈ:")[l]} (2 + 3 + 1 + 1) × ${x} = ${answer}.`;
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
        `${data(c, r, 2, l, "pair")} ` +
        tx(
          "If x people belong to both groups, find x.",
          "यदि x लोग दोनों समूहों में आते हैं, तो x का मान क्या है?",
          "ਜੇ x ਲੋਕ ਦੋਵਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਤਾਂ x ਦਾ ਮੁੱਲ ਕੀ ਹੈ?",
        )[l];
      const a = membershipTotal(r, 1),
        b = membershipTotal(r, 2),
        union = sum(r) - r[0],
        names = c.names[l].split("|");
      explanation = `${
        tx(
          `Subtract those doing neither from the total to find how many do ${names[0]} or ${names[1]}. Adding the two activity totals counts people doing both twice, so subtract the union once to leave the overlap.`,
          `कोई भी गतिविधि न करने वालों को कुल संख्या से घटाकर ${names[0]} या ${names[1]} करने वालों की संख्या निकालें। दोनों गतिविधियों के कुल जोड़ने पर साझा लोग दो बार गिने जाते हैं; साझा संख्या के लिए संघ एक बार घटाएँ।`,
          `ਕੋਈ ਵੀ ਕੰਮ ਨਾ ਕਰਨ ਵਾਲਿਆਂ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਵਿੱਚੋਂ ਘਟਾ ਕੇ ${names[0]} ਜਾਂ ${names[1]} ਕਰਨ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ। ਦੋਵਾਂ ਕੰਮਾਂ ਦੇ ਕੁੱਲ ਜੋੜਨ ਨਾਲ ਸਾਂਝੇ ਲੋਕ ਦੋ ਵਾਰ ਗਿਣੇ ਜਾਂਦੇ ਹਨ; ਸਾਂਝੀ ਗਿਣਤੀ ਲਈ ਸੰਘ ਇੱਕ ਵਾਰ ਘਟਾਓ।`,
        )[l]
      } ${tx(`People doing ${names[0]} or ${names[1]}`, `${names[0]} या ${names[1]} करने वाले लोग`, `${names[0]} ਜਾਂ ${names[1]} ਕਰਨ ਵਾਲੇ ਲੋਕ`)[l]} = ${sum(r)} − ${r[0]} = ${union}. x = ${a} + ${b} − ${union} = ${answer}.`;
      formula = "x=n(A)+n(B)-N+n(\\text{neither})";
    }
    if (mode === 1) {
      const names = c.names[l].split("|");
      answer = r[7];
      difficulty = "Hard";
      stem =
        `${data(c, r, 3, l, "triple")} ` +
        tx(
          "If x people belong to all three groups, find x.",
          "यदि x लोग तीनों समूहों में आते हैं, तो x का मान क्या है?",
          "ਜੇ x ਲੋਕ ਤਿੰਨਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਂਦੇ ਹਨ, ਤਾਂ x ਦਾ ਮੁੱਲ ਕੀ ਹੈ?",
        )[l];
      const a = membershipTotal(r, 1),
        b = membershipTotal(r, 2),
        cTotal = membershipTotal(r, 4),
        ab = membershipTotal(r, 3),
        ac = membershipTotal(r, 5),
        bc = membershipTotal(r, 6),
        union = sum(r) - r[0],
        withoutCentre = a + b + cTotal - ab - ac - bc;
      explanation = `${
        tx(
          `Each pair count includes people doing all three activities (${names.join(", ")}), so the centre is counted three times in the pair totals. Add the three activity totals, subtract the pair totals, and add x once. This must equal the surveyed total minus those doing none; solve that equation for x.`,
          `${names.join(", ")} तीनों गतिविधियाँ करने वाले लोग हर जोड़ी की संख्या में शामिल हैं, इसलिए जोड़ी-संख्याओं में केंद्र तीन बार गिना जाता है। तीनों गतिविधियों के कुल जोड़ें, जोड़ी-संख्याएँ घटाएँ और x एक बार जोड़ें। यह सर्वेक्षण की कुल संख्या में से कोई भी गतिविधि न करने वालों को घटाने के बराबर होगा; इस समीकरण से x निकालें।`,
          `${names.join(", ")} ਤਿੰਨੇ ਕੰਮ ਕਰਨ ਵਾਲੇ ਹਰ ਜੋੜੇ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ਹਨ, ਇਸ ਲਈ ਜੋੜਿਆਂ ਦੇ ਕੁੱਲ ਵਿੱਚ ਕੇਂਦਰ ਤਿੰਨ ਵਾਰ ਗਿਣਿਆ ਜਾਂਦਾ ਹੈ। ਤਿੰਨਾਂ ਕੰਮਾਂ ਦੇ ਕੁੱਲ ਜੋੜੋ, ਜੋੜਿਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਘਟਾਓ ਅਤੇ x ਇੱਕ ਵਾਰ ਜੋੜੋ। ਇਹ ਸਰਵੇਖਣ ਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਕੰਮ ਨਾ ਕਰਨ ਵਾਲਿਆਂ ਨੂੰ ਘਟਾਉਣ ਦੇ ਬਰਾਬਰ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ; ਇਸ ਸਮੀਕਰਨ ਤੋਂ x ਕੱਢੋ।`,
        )[l]
      } ${tx("People in at least one activity", "कम-से-कम एक गतिविधि करने वाले लोग", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਕੰਮ ਕਰਨ ਵਾਲੇ ਲੋਕ")[l]} = ${sum(r)} − ${r[0]} = ${union}. ${tx("Three activity totals minus the three pair totals", "तीनों गतिविधियों के कुल में से तीन जोड़ी-कुल घटाने पर", "ਤਿੰਨਾਂ ਕੰਮਾਂ ਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਤਿੰਨ ਜੋੜਿਆਂ ਦੇ ਕੁੱਲ ਘਟਾਉਣ ਤੇ")[l]}: ${a} + ${b} + ${cTotal} − ${ab} − ${ac} − ${bc} = ${withoutCentre}. x = ${union} − ${withoutCentre} = ${answer}.`;
      formula = "x=N-n_0-n(A)-n(B)-n(C)+n(A\\cap B)+n(A\\cap C)+n(B\\cap C)";
    }
    if (mode === 2) {
      answer = sum(r);
      stem =
        `${data(c, r, 3, l, "total")} ` +
        tx(
          "The total number surveyed is x. Find x.",
          "सर्वेक्षण में कुल लोगों की संख्या x है। x का मान क्या है?",
          "ਸਰਵੇਖਣ ਵਿੱਚ ਲੋਕਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ x ਹੈ। x ਦਾ ਮੁੱਲ ਕੀ ਹੈ?",
        )[l];
      const union = sum(r) - r[0];
      explanation = `${
        tx(
          `First use inclusion–exclusion for ${c.names.en.split("|").join(", ")} to count people doing at least one activity. Add those doing none to get the surveyed total.`,
          `${c.names.hi.split("|").join(", ")} में से कम-से-कम एक गतिविधि करने वालों की संख्या समावेशन–बहिष्करण से निकालें। कुल संख्या पाने के लिए कोई भी गतिविधि न करने वालों को जोड़ें।`,
          `${c.names.pa.split("|").join(", ")} ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਕੰਮ ਕਰਨ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਸਮਾਵੇਸ਼–ਬਹਿਸ਼ਕਰਨ ਨਾਲ ਕੱਢੋ। ਕੁੱਲ ਗਿਣਤੀ ਲਈ ਕੋਈ ਵੀ ਕੰਮ ਨਾ ਕਰਨ ਵਾਲਿਆਂ ਨੂੰ ਜੋੜੋ।`,
        )[l]
      } ${tx("People in at least one activity", "कम-से-कम एक गतिविधि करने वाले लोग", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਕੰਮ ਕਰਨ ਵਾਲੇ ਲੋਕ")[l]} = ${membershipTotal(r, 1)} + ${membershipTotal(r, 2)} + ${membershipTotal(r, 4)} − ${membershipTotal(r, 3)} − ${membershipTotal(r, 5)} − ${membershipTotal(r, 6)} + ${r[7]} = ${union}. x = ${union} + ${r[0]} = ${answer}.`;
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
        `${prefix(sum(r), l)} ` +
        tx(
          "The mutually exclusive region counts are:",
          "अलग-अलग क्षेत्रों की संख्याएँ हैं:",
          "ਵੱਖ-ਵੱਖ ਖੇਤਰਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਹਨ:",
        )[l] +
        " " +
        co
          .map(
            (a, i) =>
              `${regionName(c, i, l)}: ${a === 1 ? "" : a}x${constants[i] ? ` + ${constants[i]}` : ""}`,
          )
          .join("; ") +
        ". " +
        tx("Find x.", "x का मान क्या है?", "x ਦਾ ਮੁੱਲ ਕੀ ਹੈ?")[l];
      explanation =
        tx(
          `Each person belongs to exactly one of the eight non-overlapping regions for ${c.names.en.split("|").join(", ")}. Add the eight region expressions: combine the x terms, then the fixed counts. Subtract the fixed-count total from the surveyed total and divide by the x coefficient.`,
          `${c.names.hi.split("|").join(", ")} के लिए हर व्यक्ति आठ अलग-अलग क्षेत्रों में से ठीक एक में आता है। आठों क्षेत्र-समीकरण जोड़ें: पहले x वाले पद और फिर स्थिर संख्याएँ जोड़ें। स्थिर संख्याओं का योग कुल संख्या में से घटाकर x के गुणांक से भाग दें।`,
          `${c.names.pa.split("|").join(", ")} ਲਈ ਹਰ ਵਿਅਕਤੀ ਅੱਠ ਵੱਖ-ਵੱਖ ਖੇਤਰਾਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਵਿੱਚ ਆਉਂਦਾ ਹੈ। ਅੱਠਾਂ ਖੇਤਰਾਂ ਦੇ ਸਮੀਕਰਨ ਜੋੜੋ: ਪਹਿਲਾਂ x ਵਾਲੇ ਪਦ ਅਤੇ ਫਿਰ ਸਥਿਰ ਅੰਕ ਜੋੜੋ। ਸਥਿਰ ਅੰਕਾਂ ਦਾ ਜੋੜ ਕੁੱਲ ਵਿੱਚੋਂ ਘਟਾ ਕੇ x ਦੇ ਗੁਣਾਂਕ ਨਾਲ ਭਾਗ ਦਿਓ।`,
        )[l] +
        ` ${sum(co)}x + ${sum(constants)} = ${sum(r)}. ${sum(co)}x = ${sum(r)} − ${sum(constants)} = ${sum(co) * x}. x = ${sum(co) * x}/${sum(co)} = ${x}.`;
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
      `${prefix(n, l)} ${counts.map((k, i) => countStatement(c, 1 << i, k, l)).join("; ")}. ` +
      tx(
        `What is the ${maximum ? "maximum" : "minimum"} possible number of people ${intersection ? "who belong to every one of these groups" : "who belong to at least one of these groups"}?`,
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
            "The number common to all groups cannot exceed the smallest group. The maximum is reached when every member of the smallest group also belongs to each of the other groups.",
            "सभी समूहों में साझा लोगों की संख्या सबसे छोटे समूह से अधिक नहीं हो सकती। अधिकतम मान तब मिलता है जब सबसे छोटे समूह का हर व्यक्ति बाकी सभी समूहों में भी शामिल हो।",
            "ਸਾਰੇ ਸਮੂਹਾਂ ਵਿੱਚ ਸਾਂਝੇ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਸਭ ਤੋਂ ਛੋਟੇ ਸਮੂਹ ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋ ਸਕਦੀ। ਵੱਧ ਤੋਂ ਵੱਧ ਗਿਣਤੀ ਤਦ ਮਿਲਦੀ ਹੈ ਜਦੋਂ ਸਭ ਤੋਂ ਛੋਟੇ ਸਮੂਹ ਦਾ ਹਰ ਵਿਅਕਤੀ ਬਾਕੀ ਸਾਰੇ ਸਮੂਹਾਂ ਵਿੱਚ ਵੀ ਹੋਵੇ।",
          )
        : tx(
            `If nobody belongs to every group, each person can be counted in at most ${modelSets - 1 === 1 ? "one group total" : `${modelSets - 1} group totals`}. Across ${n} people, that allows at most ${modelSets - 1} × ${n} group-count entries without an all-group overlap. Any excess must come from people in every group; if there is no excess, the minimum is 0.`,
            `यदि कोई व्यक्ति सभी समूहों में न हो, तो हर व्यक्ति अधिक-से-अधिक ${modelSets - 1 === 1 ? "एक समूह की" : `${modelSets - 1} समूहों की`} गिनती में आ सकता है। ${n} लोगों के लिए बिना साझा व्यक्ति के अधिकतम ${modelSets - 1} × ${n} समूह-गिनतियाँ हो सकती हैं। इससे अधिक गिनती सभी समूहों में आने वाले लोगों से ही आएगी; अतिरिक्त गिनती न हो तो न्यूनतम मान 0 होगा।`,
            `ਜੇ ਕੋਈ ਵਿਅਕਤੀ ਸਾਰੇ ਸਮੂਹਾਂ ਵਿੱਚ ਨਾ ਹੋਵੇ, ਤਾਂ ਹਰ ਵਿਅਕਤੀ ਵੱਧ ਤੋਂ ਵੱਧ ${modelSets - 1 === 1 ? "ਇੱਕ ਸਮੂਹ ਦੀ" : `${modelSets - 1} ਸਮੂਹਾਂ ਦੀ`} ਗਿਣਤੀ ਵਿੱਚ ਆ ਸਕਦਾ ਹੈ। ${n} ਲੋਕਾਂ ਲਈ ਬਿਨਾਂ ਸਾਂਝੇ ਵਿਅਕਤੀ ਦੇ ਵੱਧ ਤੋਂ ਵੱਧ ${modelSets - 1} × ${n} ਸਮੂਹ-ਗਿਣਤੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ। ਇਸ ਤੋਂ ਵੱਧ ਗਿਣਤੀ ਸਾਰੇ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਲੋਕਾਂ ਕਰਕੇ ਹੀ ਹੋਵੇਗੀ; ਵਾਧੂ ਗਿਣਤੀ ਨਾ ਹੋਵੇ ਤਾਂ ਘੱਟ ਤੋਂ ਘੱਟ ਮਾਨ 0 ਹੋਵੇਗਾ।`,
          )
      : maximum
        ? tx(
            "The number in at least one group cannot exceed the total population or the sum of the group sizes. To maximize it, keep the groups separate as far as the population allows.",
            "कम-से-कम एक समूह में आने वालों की संख्या कुल लोगों की संख्या या समूह-संख्याओं के योग से अधिक नहीं हो सकती। अधिकतम के लिए समूहों को जहाँ तक संभव हो अलग रखें।",
            "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੁੱਲ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਜਾਂ ਸਮੂਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦੇ ਜੋੜ ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋ ਸਕਦੀ। ਵੱਧ ਤੋਂ ਵੱਧ ਗਿਣਤੀ ਲਈ ਸਮੂਹਾਂ ਨੂੰ ਜਿੱਥੋਂ ਤੱਕ ਸੰਭਵ ਹੋਵੇ ਵੱਖ ਰੱਖੋ।",
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
    explanation = `${
      tx(
        `Among ${n} people, the group totals are ${counts.map((k, i) => `${c.names.en.split("|")[i]} = ${k}`).join("; ")}.`,
        `कुल ${n} लोगों में समूह-संख्याएँ हैं: ${counts.map((k, i) => `${c.names.hi.split("|")[i]} = ${k}`).join("; ")}।`,
        `ਕੁੱਲ ${n} ਲੋਕਾਂ ਵਿੱਚ ਸਮੂਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਹਨ: ${counts.map((k, i) => `${c.names.pa.split("|")[i]} = ${k}`).join("; ")}।`,
      )[l]
    } ${reason[l].replaceAll("k−1", String(modelSets - 1)).replaceAll(`(${modelSets - 1})N`, `${modelSets - 1} × ${n}`)} ${tx("Using the given group sizes:", "दी गई समूह-संख्याओं से:", "ਦਿੱਤੀਆਂ ਸਮੂਹ-ਗਿਣਤੀਆਂ ਨਾਲ:")[l]} ${calculation} = ${answer}.`;
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
      cp === "VEN-CP009" ? data(context, item.regions!, 3, lang) : undefined;
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
      qlId: ven001QlForOperation(item.operation),
      permanentQlId: ven001QlForOperation(item.operation),
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
        sourceSupport: venNumericalSourceSupport(cp, item.queryKey).status,
        sourceSupportNote: venNumericalSourceSupport(cp, item.queryKey).note,
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
