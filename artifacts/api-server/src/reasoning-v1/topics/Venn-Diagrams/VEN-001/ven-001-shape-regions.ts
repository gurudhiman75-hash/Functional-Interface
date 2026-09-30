import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../../../../question-studio/standard-lifecycle.ts";

export const VEN_001_SHAPE_REGION_CP_ID = "VEN-CP011" as const;
type L = QuestionStudioLanguage;
type T = Record<L, string>;
const tr = (en: string, hi: string, pa: string): T => ({ en, hi, pa });
const CONTEXTS = [
  {
    id: "SCHOOL_ACTIVITIES",
    sets: [
      tr(
        "students who read the school newspaper",
        "विद्यालय का समाचार-पत्र पढ़ने वाले विद्यार्थी",
        "ਸਕੂਲ ਦਾ ਅਖ਼ਬਾਰ ਪੜ੍ਹਨ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
      tr(
        "students who play a team sport",
        "टीम खेल खेलने वाले विद्यार्थी",
        "ਟੀਮ ਖੇਡ ਖੇਡਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
      tr(
        "students who attend the science club",
        "विज्ञान क्लब में जाने वाले विद्यार्थी",
        "ਵਿਗਿਆਨ ਕਲੱਬ ਵਿੱਚ ਜਾਣ ਵਾਲੇ ਵਿਦਿਆਰਥੀ",
      ),
    ],
  },
  {
    id: "COMMUNITY_SURVEY",
    sets: [
      tr(
        "residents who use the public library",
        "सार्वजनिक पुस्तकालय का उपयोग करने वाले निवासी",
        "ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who use the sports centre",
        "खेल केंद्र का उपयोग करने वाले निवासी",
        "ਖੇਡ ਕੇਂਦਰ ਵਰਤਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
      tr(
        "residents who attend cultural events",
        "सांस्कृतिक कार्यक्रमों में जाने वाले निवासी",
        "ਸੱਭਿਆਚਾਰਕ ਸਮਾਗਮਾਂ ਵਿੱਚ ਜਾਣ ਵਾਲੇ ਵਸਨੀਕ",
      ),
    ],
  },
  {
    id: "TRAINING_COURSE",
    sets: [
      tr(
        "trainees who completed the safety module",
        "सुरक्षा मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਸੁਰੱਖਿਆ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
      tr(
        "trainees who completed the digital-skills module",
        "डिजिटल-कौशल मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਡਿਜ਼ਿਟਲ-ਹੁਨਰ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
      tr(
        "trainees who completed the first-aid module",
        "प्राथमिक उपचार मॉड्यूल पूरा करने वाले प्रशिक्षु",
        "ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਮੋਡੀਊਲ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਸਿਖਿਆਰਥੀ",
      ),
    ],
  },
  {
    id: "MEDIA_PREFERENCES",
    sets: [
      tr(
        "people who read the daily paper",
        "दैनिक समाचार-पत्र पढ़ने वाले लोग",
        "ਰੋਜ਼ਾਨਾ ਅਖ਼ਬਾਰ ਪੜ੍ਹਨ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who listen to a news podcast",
        "समाचार पॉडकास्ट सुनने वाले लोग",
        "ਖ਼ਬਰਾਂ ਦਾ ਪੌਡਕਾਸਟ ਸੁਣਨ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who watch the evening bulletin",
        "शाम का समाचार बुलेटिन देखने वाले लोग",
        "ਸ਼ਾਮ ਦਾ ਖ਼ਬਰ ਬੁਲੇਟਿਨ ਦੇਖਣ ਵਾਲੇ ਲੋਕ",
      ),
    ],
  },
  {
    id: "HEALTH_CAMP",
    sets: [
      tr(
        "visitors who received a blood-pressure check",
        "रक्तचाप जाँच कराने वाले आगंतुक",
        "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
      tr(
        "visitors who received a vision check",
        "दृष्टि जाँच कराने वाले आगंतुक",
        "ਨਜ਼ਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
      tr(
        "visitors who received a diabetes check",
        "मधुमेह जाँच कराने वाले आगंतुक",
        "ਸ਼ੂਗਰ ਦੀ ਜਾਂਚ ਕਰਵਾਉਣ ਵਾਲੇ ਆਏ ਲੋਕ",
      ),
    ],
  },
  {
    id: "WORKPLACE_TOOLS",
    sets: [
      tr(
        "staff who use the project dashboard",
        "परियोजना डैशबोर्ड का उपयोग करने वाले कर्मचारी",
        "ਪ੍ਰੋਜੈਕਟ ਡੈਸ਼ਬੋਰਡ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
      tr(
        "staff who use the shared calendar",
        "साझा कैलेंडर का उपयोग करने वाले कर्मचारी",
        "ਸਾਂਝਾ ਕੈਲੰਡਰ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
      tr(
        "staff who use the team chat",
        "टीम चैट का उपयोग करने वाले कर्मचारी",
        "ਟੀਮ ਚੈਟ ਵਰਤਣ ਵਾਲੇ ਕਰਮਚਾਰੀ",
      ),
    ],
  },
  {
    id: "TRAVEL_SURVEY",
    sets: [
      tr(
        "travellers who used a bus",
        "बस से यात्रा करने वाले यात्री",
        "ਬੱਸ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
      tr(
        "travellers who used a train",
        "रेलगाड़ी से यात्रा करने वाले यात्री",
        "ਰੇਲ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
      tr(
        "travellers who used a bicycle",
        "साइकिल से यात्रा करने वाले यात्री",
        "ਸਾਈਕਲ ਰਾਹੀਂ ਸਫ਼ਰ ਕਰਨ ਵਾਲੇ ਯਾਤਰੀ",
      ),
    ],
  },
  {
    id: "WEEKEND_HOBBIES",
    sets: [
      tr("people who garden", "बागवानी करने वाले लोग", "ਬਾਗਬਾਨੀ ਕਰਨ ਵਾਲੇ ਲੋਕ"),
      tr(
        "people who cook a new recipe",
        "नई रेसिपी बनाने वाले लोग",
        "ਨਵੀਂ ਰੈਸਿਪੀ ਬਣਾਉਣ ਵਾਲੇ ਲੋਕ",
      ),
      tr(
        "people who take photographs",
        "तस्वीरें लेने वाले लोग",
        "ਤਸਵੀਰਾਂ ਖਿੱਚਣ ਵਾਲੇ ਲੋਕ",
      ),
    ],
  },
] as const;
type Context = (typeof CONTEXTS)[number];
const QUESTIONS: readonly {
  key: string;
  masks: number[];
  label: T;
  pattern: "single" | "pair" | "triple" | "union" | "exactly-one";
}[] = [
  {
    key: "only-A",
    masks: [1],
    label: tr("only the circle", "केवल वृत्त में", "ਸਿਰਫ਼ ਚੱਕਰ ਵਿੱਚ"),
    pattern: "single",
  },
  {
    key: "only-B",
    masks: [2],
    label: tr("only the rectangle", "केवल आयत में", "ਸਿਰਫ਼ ਆਇਤ ਵਿੱਚ"),
    pattern: "single",
  },
  {
    key: "only-C",
    masks: [4],
    label: tr("only the triangle", "केवल त्रिभुज में", "ਸਿਰਫ਼ ਤਿਕੋਣ ਵਿੱਚ"),
    pattern: "single",
  },
  {
    key: "A-and-B-not-C",
    masks: [3],
    label: tr(
      "in both the circle and rectangle, but outside the triangle",
      "वृत्त और आयत दोनों में, लेकिन त्रिभुज के बाहर",
      "ਚੱਕਰ ਅਤੇ ਆਇਤ ਦੋਵਾਂ ਵਿੱਚ, ਪਰ ਤਿਕੋਣ ਤੋਂ ਬਾਹਰ",
    ),
    pattern: "pair",
  },
  {
    key: "A-and-C-not-B",
    masks: [5],
    label: tr(
      "in both the circle and triangle, but outside the rectangle",
      "वृत्त और त्रिभुज दोनों में, लेकिन आयत के बाहर",
      "ਚੱਕਰ ਅਤੇ ਤਿਕੋਣ ਦੋਵਾਂ ਵਿੱਚ, ਪਰ ਆਇਤ ਤੋਂ ਬਾਹਰ",
    ),
    pattern: "pair",
  },
  {
    key: "B-and-C-not-A",
    masks: [6],
    label: tr(
      "in both the rectangle and triangle, but outside the circle",
      "आयत और त्रिभुज दोनों में, लेकिन वृत्त के बाहर",
      "ਆਇਤ ਅਤੇ ਤਿਕੋਣ ਦੋਵਾਂ ਵਿੱਚ, ਪਰ ਚੱਕਰ ਤੋਂ ਬਾਹਰ",
    ),
    pattern: "pair",
  },
  {
    key: "all-three",
    masks: [7],
    label: tr(
      "inside all three shapes",
      "तीनों आकृतियों के भीतर",
      "ਤਿੰਨਾਂ ਆਕਾਰਾਂ ਦੇ ਅੰਦਰ",
    ),
    pattern: "triple",
  },
  {
    key: "at-least-two",
    masks: [3, 5, 6, 7],
    label: tr(
      "inside at least two shapes",
      "कम-से-कम दो आकृतियों के भीतर",
      "ਘੱਟੋ-ਘੱਟ ਦੋ ਆਕਾਰਾਂ ਦੇ ਅੰਦਰ",
    ),
    pattern: "union",
  },
  {
    key: "exactly-one",
    masks: [1, 2, 4],
    label: tr(
      "inside exactly one shape",
      "ठीक एक आकृति के भीतर",
      "ਠੀਕ ਇੱਕ ਆਕਾਰ ਦੇ ਅੰਦਰ",
    ),
    pattern: "exactly-one",
  },
  {
    key: "any-shape",
    masks: [1, 2, 3, 4, 5, 6, 7],
    label: tr(
      "inside at least one shape",
      "कम-से-कम एक आकृति के भीतर",
      "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਆਕਾਰ ਦੇ ਅੰਦਰ",
    ),
    pattern: "union",
  },
];
function hash(s: string): number {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
function regionName(mask: number, l: L): string {
  const en = [
    "outside all three shapes",
    "circle only",
    "rectangle only",
    "circle and rectangle only",
    "triangle only",
    "circle and triangle only",
    "rectangle and triangle only",
    "all three shapes",
  ];
  const hi = [
    "तीनों आकृतियों के बाहर",
    "केवल वृत्त",
    "केवल आयत",
    "वृत्त और आयत, त्रिभुज के बिना",
    "केवल त्रिभुज",
    "वृत्त और त्रिभुज, आयत के बिना",
    "आयत और त्रिभुज, वृत्त के बिना",
    "तीनों आकृतियाँ",
  ];
  const pa = [
    "ਤਿੰਨਾਂ ਆਕਾਰਾਂ ਤੋਂ ਬਾਹਰ",
    "ਸਿਰਫ਼ ਚੱਕਰ",
    "ਸਿਰਫ਼ ਆਇਤ",
    "ਚੱਕਰ ਅਤੇ ਆਇਤ, ਤਿਕੋਣ ਤੋਂ ਬਿਨਾਂ",
    "ਸਿਰਫ਼ ਤਿਕੋਣ",
    "ਚੱਕਰ ਅਤੇ ਤਿਕੋਣ, ਆਇਤ ਤੋਂ ਬਿਨਾਂ",
    "ਆਇਤ ਅਤੇ ਤਿਕੋਣ, ਚੱਕਰ ਤੋਂ ਬਿਨਾਂ",
    "ਤਿੰਨੇ ਆਕਾਰ",
  ];
  return (l === "en" ? en : l === "hi" ? hi : pa)[mask]!;
}
function svg(r: readonly number[], c: Context, l: L): string {
  // These fixed, tested outlines give each of the eight membership masks its own readable interior point.
  const points: readonly (readonly [number, number])[] = [
    [604, 438],
    [401, 145],
    [128, 252],
    [497, 269],
    [271, 410],
    [302, 162],
    [195, 328],
    [324, 287],
  ];
  const names = c.sets.map((x) => x[l]);
  const labels = [
    `Circle = ${names[0]}`,
    `Rectangle = ${names[1]}`,
    `Triangle = ${names[2]}`,
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 500" role="img" aria-label="Counts in circle, triangle and rectangle regions"><rect x="4" y="4" width="632" height="492" rx="10" fill="#fff" stroke="#b8c3cf"/><rect x="76" y="200" width="499" height="174" fill="#d9edf7" fill-opacity=".34" stroke="#7b4ab5" stroke-width="3"/><polygon points="304,95 64,433 538,463" fill="#f7e9c8" fill-opacity=".3" stroke="#d28b21" stroke-width="3"/><circle cx="397" cy="237" r="175" fill="#d4e9d3" fill-opacity=".3" stroke="#25845f" stroke-width="3"/><g font-family="sans-serif" font-size="13" fill="#152536"><text x="8" y="23">${labels[0]}</text><text x="8" y="42">${labels[1]}</text><text x="8" y="61">${labels[2]}</text></g><g font-family="sans-serif" font-size="19" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="#152536">${r.map((v, m) => `<text x="${points[m]![0]}" y="${points[m]![1]}" data-mask="${m}">${v}</text>`).join("")}</g></svg>`;
}
function stem(c: Context, q: (typeof QUESTIONS)[number], l: L): string {
  const title =
    l === "en"
      ? `A survey records three activities: ${c.sets.map((s) => s[l]).join("; ")}. The circle represents the first activity, the rectangle the second, and the triangle the third. The numbers show counts in the separate regions.`
      : l === "hi"
        ? `एक सर्वेक्षण में तीन गतिविधियाँ दर्ज की गईं: ${c.sets.map((s) => s[l]).join("; ")}। वृत्त पहली, आयत दूसरी और त्रिभुज तीसरी गतिविधि दर्शाता है। संख्याएँ अलग-अलग क्षेत्रों की गिनती दिखाती हैं।`
        : `ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ ਤਿੰਨ ਗਤੀਵਿਧੀਆਂ ਦਰਜ ਕੀਤੀਆਂ ਗਈਆਂ: ${c.sets.map((s) => s[l]).join("; ")}। ਚੱਕਰ ਪਹਿਲੀ, ਆਇਤ ਦੂਜੀ ਅਤੇ ਤਿਕੋਣ ਤੀਜੀ ਗਤੀਵਿਧੀ ਦਰਸਾਉਂਦਾ ਹੈ। ਗਿਣਤੀਆਂ ਵੱਖਰੇ ਖੇਤਰਾਂ ਲਈ ਹਨ।`;
  const ask =
    l === "en"
      ? `How many are ${q.label[l]}?`
      : l === "hi"
        ? `कितने लोग ${q.label[l]} हैं?`
        : `ਕਿੰਨੇ ਲੋਕ ${q.label[l]} ਹਨ?`;
  return `${title} ${ask}`;
}
export function isVen001ShapeRegionRequest(
  req: QuestionStudioGenerationRequest,
): boolean {
  const selectors = [
    req.packageId,
    req.patternId,
    req.canonicalProblemId,
    req.questionLanguageId,
  ].map((v) => text(v).toUpperCase());
  return (
    selectors.includes(VEN_001_SHAPE_REGION_CP_ID) ||
    selectors.includes("VEN-001-SHAPE-REGIONS")
  );
}
export function generateVen001ShapeRegionBatch(
  req: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (req.runtimeMode && req.runtimeMode !== "review-only")
    throw new Error("VEN-001 shape-region questions are review-only");
  const l = req.language ?? "en";
  if (!(l === "en" || l === "hi" || l === "pa"))
    throw new Error(`Unsupported VEN-001 language: ${l}`);
  const count = req.count ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 50)
    throw new Error("VEN-CP011 batch count must be 1–50");
  const seed = text(req.seed) || "ven-001-shape-regions-review-v1";
  const questions = Array.from({ length: count }, (_, i) => {
    const c = CONTEXTS[hash(`${seed}:context:${i}`) % CONTEXTS.length]!;
    const q = QUESTIONS[hash(`${seed}:query:${i}`) % QUESTIONS.length]!;
    const regions = Array.from(
      { length: 8 },
      (_, m) => 8 + (hash(`${seed}:${i}:${c.id}:${m}`) % 42),
    );
    const answer = q.masks.reduce((sum, m) => sum + regions[m]!, 0);
    const distractors = [
      ...new Set(
        [
          answer + regions[(q.masks[0]! + 1) % 8]!,
          Math.max(0, answer - regions[(q.masks[0]! + 2) % 8]!),
          answer + regions[(q.masks[0]! + 3) % 8]!,
        ].map(String),
      ),
    ];
    for (let delta = 1; distractors.length < 3; delta++) {
      const v = String(answer + delta);
      if (v !== String(answer) && !distractors.includes(v)) distractors.push(v);
    }
    const options = [String(answer), ...distractors.slice(0, 3)].sort(
      (a, b) => hash(`${seed}:${i}:${a}`) - hash(`${seed}:${i}:${b}`),
    );
    const correctIndex = options.indexOf(String(answer));
    let explanation: string;
    const namedValues = q.masks.map(
      (m) => `${regionName(m, l)}: ${regions[m]}`,
    );
    const calculation = q.masks.map((m) => String(regions[m])).join(" + ");
    if (l === "en")
      explanation = `Use ${namedValues.join(q.masks.length === 2 ? " and " : "; ")}. These are the ${q.label[l]} region${q.masks.length > 1 ? "s" : ""}; the remaining diagram regions do not meet that condition. ${calculation} = ${answer}.`;
    else if (l === "hi")
      explanation = `${namedValues.join("; ")}। यही ${q.label[l]} वाले क्षेत्र हैं; आरेख के बाकी क्षेत्र इस शर्त में नहीं आते। ${calculation} = ${answer}।`;
    else
      explanation = `${namedValues.join("; ")}। ਇਹ ${q.label[l]} ਵਾਲੇ ਖੇਤਰ ਹਨ; ਚਿੱਤਰ ਦੇ ਬਾਕੀ ਖੇਤਰ ਇਸ ਸ਼ਰਤ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦੇ। ${calculation} = ${answer}।`;
    const id = `VEN-CP011:${c.id}:${q.key}:${hash(`${seed}:${i}`)}:${l}`;
    const questionStem = stem(c, q, l);
    return {
      ...lifecycle,
      id,
      questionId: id,
      packageId: "VEN-001",
      patternId: VEN_001_SHAPE_REGION_CP_ID,
      cpId: VEN_001_SHAPE_REGION_CP_ID,
      checkpointId: VEN_001_SHAPE_REGION_CP_ID,
      subject: "Reasoning Ability",
      contentDomain: "Geometric Venn diagram region reading",
      topic: "Venn Diagrams",
      subtopic: "Geometric shape region counts",
      language: l,
      locale: l === "en" ? "en-IN" : l === "hi" ? "hi-IN" : "pa-IN",
      stem: questionStem,
      text: questionStem,
      options,
      optionLabels: ["A", "B", "C", "D"],
      correctIndex,
      correct: correctIndex,
      answer: "ABCD"[correctIndex],
      canonicalAnswer: String(answer),
      explanation,
      stimulusSvgs: [svg(regions, c, l)],
      explanationSvgs: [svg(regions, c, l)],
      optionDetails: options.map((value, j) => ({
        label: "ABCD"[j],
        text: value,
        isCorrect: j === correctIndex,
      })),
      difficulty: "Medium",
      difficultyLabel: "Medium",
      difficultyAuthority: "PROVISIONAL_OPERATION_BASED",
      questionOperation: "GEOMETRIC_REGION_COUNT",
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
      sharedStimulus: questionStem,
      semanticMetadata: {
        scenarioId: c.id,
        queryKey: q.key,
        queryPattern: q.pattern,
        shapeSetLabels: c.sets.map((s) => s[l]),
        exclusiveRegions: regions,
        selectedMasks: q.masks,
      },
      validation: {
        exactlyOneCorrect:
          options.filter((x) => x === String(answer)).length === 1,
        fourUniqueOptions: new Set(options).size === 4,
        allEightRegionsVisible: regions.length === 8,
        localeParityPendingHumanReview: true,
      },
    };
  });
  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: "VEN-001",
      requestedCheckpoint: VEN_001_SHAPE_REGION_CP_ID,
      language: l,
      seed,
      count,
      reviewOnly: true,
      questionBankWritable: false,
    },
  };
}
