import { listSifAuthorities } from "./authorities.ts";
import type { SifCandidateAuthority, SifCpId, SifLocale, SifLocalizedText, SifScenarioAuthority } from "./types.ts";

export const SIF_BANKING_THREE_INFERENCE_PROFILE_ID = "SIF-BANKING-3I" as const;

type ThreeInferenceAuthority = {
  readonly id: string;
  readonly baseScenarioId: string;
  readonly cpId: SifCpId;
  readonly third: SifCandidateAuthority;
};

type GeneratedThreeInferenceQuestion = {
  readonly profileId: typeof SIF_BANKING_THREE_INFERENCE_PROFILE_ID;
  readonly authorityId: string;
  readonly baseScenarioId: string;
  readonly cpId: SifCpId;
  readonly locale: SifLocale;
  readonly difficulty: SifScenarioAuthority["difficulty"];
  readonly statement: string;
  readonly inferences: readonly [string, string, string];
  readonly optionSubsets: readonly (readonly number[])[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly correctSubset: readonly number[];
  readonly explanation: string;
  readonly distractorTypes: readonly string[];
  readonly reviewOnly: true;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly mockEligible: false;
  readonly publiclyPublishable: false;
};

const t = (en: string, hi: string, pa: string): SifLocalizedText => ({
  "en-IN": en,
  "hi-IN": hi,
  "pa-IN": pa,
});

function candidate(
  id: string,
  text: SifLocalizedText,
  follows: boolean,
  strength: SifCandidateAuthority["strength"],
  supportFactIds: readonly string[],
  distractorType?: SifCandidateAuthority["distractorType"],
): SifCandidateAuthority {
  return { id, text, follows, strength, supportFactIds, ...(distractorType ? { distractorType } : {}) };
}

const OVERLAYS: readonly ThreeInferenceAuthority[] = [
  {
    id: "SIF-B3I-001",
    baseScenarioId: "SIF-CP002-ONLY-II",
    cpId: "SIF-CP002",
    third: candidate(
      "III",
      t(
        "The inspection was in progress when the morning bus left.",
        "सुबह की बस के रवाना होते समय निरीक्षण चल रहा था।",
        "ਸਵੇਰ ਦੀ ਬੱਸ ਚੱਲਣ ਵੇਲੇ ਜਾਂਚ ਜਾਰੀ ਸੀ।",
      ),
      false,
      "UNSUPPORTED_OR_CONTRADICTED",
      ["F1"],
      "TIME_DISTORTION",
    ),
  },
  {
    id: "SIF-B3I-002",
    baseScenarioId: "SIF-CP010-IF_THEN-LIBRARY-HOLD",
    cpId: "SIF-CP010",
    third: candidate(
      "III",
      t(
        "The stated cancellation rule applies to Neel's reservation.",
        "बताया गया रद्दीकरण नियम नील के आरक्षण पर लागू होता है।",
        "ਦੱਸਿਆ ਰੱਦ ਕਰਨ ਵਾਲਾ ਨਿਯਮ ਨੀਲ ਦੇ ਰਾਖਵੇਂਕਰਨ 'ਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।",
      ),
      true,
      "CERTAIN",
      ["F1", "F2"],
    ),
  },
  {
    id: "SIF-B3I-003",
    baseScenarioId: "SIF-CP015-POSITION",
    cpId: "SIF-CP015",
    third: candidate(
      "III",
      t(
        "The association wanted the bus service to be withdrawn.",
        "संघ बस सेवा को वापस लेना चाहता था।",
        "ਸੰਘ ਬੱਸ ਸੇਵਾ ਨੂੰ ਵਾਪਸ ਲੈਣਾ ਚਾਹੁੰਦਾ ਸੀ।",
      ),
      false,
      "UNSUPPORTED_OR_CONTRADICTED",
      ["F1", "F2"],
      "STRONGER_CLAIM",
    ),
  },
  {
    id: "SIF-B3I-004",
    baseScenarioId: "SIF-CP016-ADVANCED",
    cpId: "SIF-CP016",
    third: candidate(
      "III",
      t(
        "Home delivery had been introduced at fewer than half of the retailer's branches.",
        "विक्रेता की आधी से कम शाखाओं में होम डिलीवरी शुरू की गई थी।",
        "ਵਿਕਰੇਤਾ ਦੀਆਂ ਅੱਧ ਤੋਂ ਘੱਟ ਸ਼ਾਖਾਵਾਂ ਵਿੱਚ ਘਰ ਡਿਲਿਵਰੀ ਸ਼ੁਰੂ ਕੀਤੀ ਗਈ ਸੀ।",
      ),
      true,
      "CERTAIN",
      ["F1"],
    ),
  },
  {
    id: "SIF-B3I-005",
    baseScenarioId: "SIF-CP017-MIXED",
    cpId: "SIF-CP017",
    third: candidate(
      "III",
      t(
        "Every verified customer of the bank joined the pilot service.",
        "बैंक का हर सत्यापित ग्राहक पायलट सेवा में शामिल हुआ।",
        "ਬੈਂਕ ਦਾ ਹਰ ਤਸਦੀਕਸ਼ੁਦਾ ਗਾਹਕ ਪਾਇਲਟ ਸੇਵਾ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਇਆ।",
      ),
      false,
      "UNSUPPORTED_OR_CONTRADICTED",
      ["F1", "F2"],
      "SCOPE_CHANGE",
    ),
  },
] as const;

function findBase(overlay: ThreeInferenceAuthority): SifScenarioAuthority {
  const match = listSifAuthorities(overlay.cpId).find((entry) => entry.id === overlay.baseScenarioId);
  if (!match) throw new Error(`${overlay.id}: missing base scenario ${overlay.baseScenarioId}`);
  return match;
}

function subsetFor(candidates: readonly SifCandidateAuthority[]): readonly number[] {
  return candidates.flatMap((candidate, index) => candidate.follows ? [index + 1] : []);
}

function subsetLabel(subset: readonly number[], locale: SifLocale): string {
  const roman = ["I", "II", "III"];
  if (subset.length === 0) {
    if (locale === "hi-IN") return "कोई भी अनुमान सही नहीं है";
    if (locale === "pa-IN") return "ਕੋਈ ਵੀ ਅਨੁਮਾਨ ਸਹੀ ਨਹੀਂ ਹੈ";
    return "None of the inferences follow";
  }
  if (subset.length === 3) {
    if (locale === "hi-IN") return "तीनों अनुमान सही हैं";
    if (locale === "pa-IN") return "ਤਿੰਨੇ ਅਨੁਮਾਨ ਸਹੀ ਹਨ";
    return "All I, II and III follow";
  }
  const labels = subset.map((value) => roman[value - 1]).join(locale === "en-IN" ? " and " : ", ");
  if (locale === "hi-IN") return subset.length === 1 ? `केवल ${labels} सही है` : `केवल ${labels} सही हैं`;
  if (locale === "pa-IN") return subset.length === 1 ? `ਕੇਵਲ ${labels} ਸਹੀ ਹੈ` : `ਕੇਵਲ ${labels} ਸਹੀ ਹਨ`;
  return subset.length === 1 ? `Only ${labels} follows` : `Only ${labels} follow`;
}

const ALL_SUBSETS: readonly (readonly number[])[] = [
  [], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3],
];

function hammingDistance(left: readonly number[], right: readonly number[]): number {
  return [1, 2, 3].filter((value) => left.includes(value) !== right.includes(value)).length;
}

function optionSubsets(correct: readonly number[], seed: number): readonly (readonly number[])[] {
  const wrong = ALL_SUBSETS
    .filter((subset) => JSON.stringify(subset) !== JSON.stringify(correct))
    .sort((a, b) => hammingDistance(a, correct) - hammingDistance(b, correct) || JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const selected = [correct, ...wrong.slice(0, 4)];
  const offset = Math.abs(seed) % selected.length;
  return selected.map((_, index) => selected[(index + offset) % selected.length]!);
}

function explanationFor(base: SifScenarioAuthority, third: SifCandidateAuthority, locale: SifLocale, correct: readonly number[]): string {
  const thirdResult = third.follows
    ? locale === "en-IN" ? "Inference III is supported by the stated facts."
      : locale === "hi-IN" ? "अनुमान III दिए गए तथ्यों से समर्थित है।"
      : "ਅਨੁਮਾਨ III ਦਿੱਤੇ ਤੱਥਾਂ ਨਾਲ ਸਮਰਥਿਤ ਹੈ।"
    : locale === "en-IN" ? "Inference III goes beyond or conflicts with the stated facts."
      : locale === "hi-IN" ? "अनुमान III दिए गए तथ्यों से आगे जाता है या उनसे मेल नहीं खाता।"
      : "ਅਨੁਮਾਨ III ਦਿੱਤੇ ਤੱਥਾਂ ਤੋਂ ਅੱਗੇ ਜਾਂਦਾ ਹੈ ਜਾਂ ਉਨ੍ਹਾਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ।";
  const answer = subsetLabel(correct, locale);
  return `${base.explanation[locale]} ${thirdResult} ${locale === "en-IN" ? "Therefore" : locale === "hi-IN" ? "अतः" : "ਇਸ ਲਈ"}, ${answer}.`;
}

export function listSifBankingThreeInferenceAuthorities(): readonly ThreeInferenceAuthority[] {
  return OVERLAYS;
}

export function generateSifBankingThreeInferenceQuestion(input: {
  readonly locale: SifLocale;
  readonly seed: number;
}): GeneratedThreeInferenceQuestion {
  const overlay = OVERLAYS[Math.abs(input.seed) % OVERLAYS.length]!;
  const base = findBase(overlay);
  const candidates = [base.candidates[0], base.candidates[1], overlay.third] as const;
  const correctSubset = subsetFor(candidates);
  const subsets = optionSubsets(correctSubset, input.seed);
  const options = subsets.map((subset) => subsetLabel(subset, input.locale));
  const correctIndex = subsets.findIndex((subset) => JSON.stringify(subset) === JSON.stringify(correctSubset));
  if (correctIndex < 0) throw new Error(`${overlay.id}: correct subset missing from options`);

  return {
    profileId: SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
    authorityId: overlay.id,
    baseScenarioId: base.id,
    cpId: base.cpId,
    locale: input.locale,
    difficulty: base.difficulty,
    statement: base.statement[input.locale],
    inferences: [
      base.candidates[0].text[input.locale],
      base.candidates[1].text[input.locale],
      overlay.third.text[input.locale],
    ],
    optionSubsets: subsets,
    options,
    correctIndex,
    correctSubset,
    explanation: explanationFor(base, overlay.third, input.locale, correctSubset),
    distractorTypes: candidates.flatMap((entry) => entry.follows || !entry.distractorType ? [] : [entry.distractorType]),
    reviewOnly: true,
    questionBankWritable: false,
    testEligible: false,
    mockEligible: false,
    publiclyPublishable: false,
  };
}
