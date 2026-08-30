import { createHash } from "node:crypto";

import { type Trg001LocalizedLocale } from "./localization-v1";
import { generateLocalizedTrg001QuestionNativeReviewFinal3Human } from "./localization-native-v5-pedagogic-review-final3-human";
import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";

type AnyQuestion = Record<string, any>;
type Locale = Trg001LocalizedLocale;
type NativeRule = Readonly<{ hi: string; pa: string }>;

export const TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL4_VERSION =
  "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL4" as const;

const TRIG_DEGREE = /\b(sin|cos|tan|cot|sec|cosec)\s*(\d+)°/giu;

const FINAL4_KEY_RULE_OVERRIDES: Readonly<Record<string, NativeRule>> = Object.freeze({
  "TRG-001-QL-017": {
    hi: "sinθ से सामने वाली भुजा:कर्ण का अनुपात मिलता है; इसी अनुपात से न्यूनकोण वाला समकोण त्रिभुज बनाकर तीसरी भुजा निकालें।",
    pa: "sinθ ਤੋਂ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ:ਕਰਣ ਦਾ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ; ਇਸੇ ਅਨੁਪਾਤ ਨਾਲ ਨਿਊਨ ਕੋਣ ਵਾਲਾ ਸਮਕੋਣ ਤਿਕੋਣ ਬਣਾ ਕੇ ਤੀਜੀ ਭੁਜਾ ਕੱਢੋ।",
  },
  "TRG-001-QL-024": {
    hi: "cosecθ=1/sinθ का प्रयोग करें।",
    pa: "cosecθ=1/sinθ ਵਰਤੋ।",
  },
  "TRG-001-QL-029": {
    hi: "secθ=1/cosθ का प्रयोग करें।",
    pa: "secθ=1/cosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-030": {
    hi: "cosecθ=1/sinθ का प्रयोग करें।",
    pa: "cosecθ=1/sinθ ਵਰਤੋ।",
  },
  "TRG-001-QL-032": {
    hi: "secθ=1/cosθ का प्रयोग करें।",
    pa: "secθ=1/cosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-035": {
    hi: "sinθ/cosθ=tanθ का प्रयोग करें।",
    pa: "sinθ/cosθ=tanθ ਵਰਤੋ।",
  },
  "TRG-001-QL-036": {
    hi: "एक ही कोण पर tanθ और cotθ परस्पर व्युत्क्रम हैं; इसलिए tanθ·cotθ=1।",
    pa: "ਇੱਕੋ ਕੋਣ ਉੱਤੇ tanθ ਅਤੇ cotθ ਪਰਸਪਰ ਹਨ; ਇਸ ਲਈ tanθ·cotθ=1।",
  },
  "TRG-001-QL-037": {
    hi: "secθ=1/cosθ और cosecθ=1/sinθ से दोनों व्युत्क्रम फलनों के सटीक मान निकालें।",
    pa: "secθ=1/cosθ ਅਤੇ cosecθ=1/sinθ ਨਾਲ ਦੋਵੇਂ ਪਰਸਪਰ ਫੰਕਸ਼ਨਾਂ ਦੇ ਸਹੀ ਮਾਨ ਕੱਢੋ।",
  },
  "TRG-001-QL-053": {
    hi: "sin(90°−θ)=cosθ का प्रयोग करें।",
    pa: "sin(90°−θ)=cosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-054": {
    hi: "tan(90°−θ)=cotθ का प्रयोग करें।",
    pa: "tan(90°−θ)=cotθ ਵਰਤੋ।",
  },
  "TRG-001-QL-055": {
    hi: "cosec(90°−θ)=secθ का प्रयोग करें।",
    pa: "cosec(90°−θ)=secθ ਵਰਤੋ।",
  },
  "TRG-001-QL-056": {
    hi: "sec(90°−θ)=cosecθ का प्रयोग करें।",
    pa: "sec(90°−θ)=cosecθ ਵਰਤੋ।",
  },
  "TRG-001-QL-057": {
    hi: "cos(90°−θ)=sinθ का प्रयोग करें।",
    pa: "cos(90°−θ)=sinθ ਵਰਤੋ।",
  },
  "TRG-001-QL-058": {
    hi: "cot(90°−θ)=tanθ का प्रयोग करें।",
    pa: "cot(90°−θ)=tanθ ਵਰਤੋ।",
  },
  "TRG-001-QL-059": {
    hi: "cos(180°−θ)=−cosθ का प्रयोग करें।",
    pa: "cos(180°−θ)=−cosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-060": {
    hi: "sin(180°+θ)=−sinθ का प्रयोग करें।",
    pa: "sin(180°+θ)=−sinθ ਵਰਤੋ।",
  },
  "TRG-001-QL-061": {
    hi: "tan(180°−θ)=−tanθ का प्रयोग करें।",
    pa: "tan(180°−θ)=−tanθ ਵਰਤੋ।",
  },
  "TRG-001-QL-062": {
    hi: "sin(90°+θ)=cosθ का प्रयोग करें।",
    pa: "sin(90°+θ)=cosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-063": {
    hi: "cos(90°+θ)=−sinθ का प्रयोग करें।",
    pa: "cos(90°+θ)=−sinθ ਵਰਤੋ।",
  },
  "TRG-001-QL-064": {
    hi: "cos(360°−θ)=cosθ का प्रयोग करें।",
    pa: "cos(360°−θ)=cosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-065": {
    hi: "sin(360°+θ)=sinθ; एक पूरा चक्कर जोड़ने या घटाने पर sin का मान नहीं बदलता।",
    pa: "sin(360°+θ)=sinθ; ਇੱਕ ਪੂਰਾ ਚੱਕਰ ਜੋੜਣ ਜਾਂ ਘਟਾਉਣ ਨਾਲ sin ਦਾ ਮਾਨ ਨਹੀਂ ਬਦਲਦਾ।",
  },
  "TRG-001-QL-066": {
    hi: "sin(270°+θ)=−cosθ का प्रयोग करें।",
    pa: "sin(270°+θ)=−cosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-074": {
    hi: "1−cos²θ=sin²θ का प्रयोग करें।",
    pa: "1−cos²θ=sin²θ ਵਰਤੋ।",
  },
  "TRG-001-QL-075": {
    hi: "1−sin²θ=cos²θ का प्रयोग करें।",
    pa: "1−sin²θ=cos²θ ਵਰਤੋ।",
  },
  "TRG-001-QL-085": {
    hi: "1+tan²θ=sec²θ; इसलिए 1/(1+tan²θ)=1/sec²θ=cos²θ।",
    pa: "1+tan²θ=sec²θ; ਇਸ ਲਈ 1/(1+tan²θ)=1/sec²θ=cos²θ।",
  },
  "TRG-001-QL-086": {
    hi: "tanθ/secθ=(sinθ/cosθ)/(1/cosθ)=sinθ।",
    pa: "tanθ/secθ=(sinθ/cosθ)/(1/cosθ)=sinθ।",
  },
  "TRG-001-QL-087": {
    hi: "1−cos²θ=sin²θ का प्रयोग करें।",
    pa: "1−cos²θ=sin²θ ਵਰਤੋ।",
  },
  "TRG-001-QL-088": {
    hi: "sec²θ−1=tan²θ का प्रयोग करें।",
    pa: "sec²θ−1=tan²θ ਵਰਤੋ।",
  },
  "TRG-001-QL-089": {
    hi: "1+tan²θ=sec²θ का प्रयोग करें।",
    pa: "1+tan²θ=sec²θ ਵਰਤੋ।",
  },
  "TRG-001-QL-090": {
    hi: "1+cot²θ=cosec²θ का प्रयोग करें।",
    pa: "1+cot²θ=cosec²θ ਵਰਤੋ।",
  },
  "TRG-001-QL-091": {
    hi: "secθ−cosθ को समान हर में लिखें: secθ−cosθ=(1−cos²θ)/cosθ=sin²θ/cosθ।",
    pa: "secθ−cosθ ਨੂੰ ਸਾਂਝੇ ਹਰ ਵਿੱਚ ਲਿਖੋ: secθ−cosθ=(1−cos²θ)/cosθ=sin²θ/cosθ।",
  },
  "TRG-001-QL-092": {
    hi: "sin²θ=1−cos²θ का प्रयोग करें।",
    pa: "sin²θ=1−cos²θ ਵਰਤੋ।",
  },
  "TRG-001-QL-096": {
    hi: "1+tan²θ=sec²θ का प्रयोग करें।",
    pa: "1+tan²θ=sec²θ ਵਰਤੋ।",
  },
  "TRG-001-QL-109": {
    hi: "(sinθ+cosθ)²=sin²θ+cos²θ+2sinθcosθ=1+2sinθcosθ का प्रयोग करें।",
    pa: "(sinθ+cosθ)²=sin²θ+cos²θ+2sinθcosθ=1+2sinθcosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-112": {
    hi: "वर्ग का विस्तार करें और sin²θ+cos²θ=1 का प्रयोग करें।",
    pa: "ਵਰਗ ਦਾ ਵਿਸਤਾਰ ਕਰੋ ਅਤੇ sin²θ+cos²θ=1 ਵਰਤੋ।",
  },
  "TRG-001-QL-116": {
    hi: "दिए गए रैखिक संबंधों से पहले tanθ निकालें, फिर tan²θ लें।",
    pa: "ਦਿੱਤੇ ਰੇਖੀ ਸੰਬੰਧਾਂ ਤੋਂ ਪਹਿਲਾਂ tanθ ਕੱਢੋ, ਫਿਰ tan²θ ਲਓ।",
  },
  "TRG-001-QL-121": {
    hi: "हर घटक का सटीक मान अलग-अलग निकालें और फिर उन्हें जोड़ें।",
    pa: "ਹਰ ਘਟਕ ਦਾ ਸਹੀ ਮਾਨ ਵੱਖ-ਵੱਖ ਕੱਢੋ ਅਤੇ ਫਿਰ ਉਹਨਾਂ ਨੂੰ ਜੋੜੋ।",
  },
  "TRG-001-QL-122": {
    hi: "पहले दो अलग मूल सर्वसमिकाएँ लागू करें, फिर व्युत्क्रम गुणकों को काटें।",
    pa: "ਪਹਿਲਾਂ ਦੋ ਵੱਖਰੀਆਂ ਮੂਲ ਸਰਬਸਮਿਕਾਵਾਂ ਲਗਾਓ, ਫਿਰ ਪਰਸਪਰ ਗੁਣਕ ਕੱਟੋ।",
  },
  "TRG-001-QL-123": {
    hi: "दोनों सर्वसमिका-कारकों को सरल करें, फिर भागफल को sin और cos के रूप में लिखें।",
    pa: "ਦੋਵੇਂ ਸਰਬਸਮਿਕਾ-ਕਾਰਕ ਸਰਲ ਕਰੋ, ਫਿਰ ਭਾਗਫਲ ਨੂੰ sin ਅਤੇ cos ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
  },
  "TRG-001-QL-124": {
    hi: "(tanθ+cotθ) के पूरे योग का वर्ग लें और tanθ·cotθ=1 का प्रयोग करें।",
    pa: "(tanθ+cotθ) ਦੇ ਪੂਰੇ ਜੋੜ ਦਾ ਵਰਗ ਲਓ ਅਤੇ tanθ·cotθ=1 ਵਰਤੋ।",
  },
  "TRG-001-QL-125": {
    hi: "दोनों पाइथागोरस सर्वसमिकाओं को व्युत्क्रम वर्गों में बदलें, फिर उनके अनुपात को सरल करें।",
    pa: "ਦੋਵੇਂ ਪਾਇਥਾਗੋਰਸ ਸਰਬਸਮਿਕਾਵਾਂ ਨੂੰ ਪਰਸਪਰ ਵਰਗਾਂ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਉਹਨਾਂ ਦੇ ਅਨੁਪਾਤ ਨੂੰ ਸਰਲ ਕਰੋ।",
  },
  "TRG-001-QL-126": {
    hi: "sec²θ−1=tan²θ और cosec²θ−1=cot²θ का प्रयोग करें, फिर व्युत्क्रम अनुपात को सरल करें।",
    pa: "sec²θ−1=tan²θ ਅਤੇ cosec²θ−1=cot²θ ਵਰਤੋ, ਫਿਰ ਪਰਸਪਰ ਅਨੁਪਾਤ ਨੂੰ ਸਰਲ ਕਰੋ।",
  },
  "TRG-001-QL-131": {
    hi: "sin2θ=2sinθcosθ का प्रयोग करें।",
    pa: "sin2θ=2sinθcosθ ਵਰਤੋ।",
  },
  "TRG-001-QL-132": {
    hi: "cos2θ=(1−tan²θ)/(1+tan²θ) का प्रयोग करें।",
    pa: "cos2θ=(1−tan²θ)/(1+tan²θ) ਵਰਤੋ।",
  },
  "TRG-001-QL-133": {
    hi: "tan2θ=2tanθ/(1−tan²θ) का प्रयोग करें।",
    pa: "tan2θ=2tanθ/(1−tan²θ) ਵਰਤੋ।",
  },
  "TRG-001-QL-142": {
    hi: "व्युत्क्रम और भागफल वाले कारक को समान हर में लिखें, फिर वर्गों के अंतर का प्रयोग करें।",
    pa: "ਪਰਸਪਰ ਅਤੇ ਭਾਗਫਲ ਵਾਲੇ ਕਾਰਕ ਨੂੰ ਸਾਂਝੇ ਹਰ ਵਿੱਚ ਲਿਖੋ, ਫਿਰ ਵਰਗਾਂ ਦੇ ਅੰਤਰ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
  },
  "TRG-001-QL-143": {
    hi: "वर्ग का विस्तार करें और व्युत्क्रम सर्वसमिकाओं का प्रयोग करें।",
    pa: "ਵਰਗ ਦਾ ਵਿਸਤਾਰ ਕਰੋ ਅਤੇ ਪਰਸਪਰ ਸਰਬਸਮਿਕਾਵਾਂ ਵਰਤੋ।",
  },
  "TRG-001-QL-144": {
    hi: "1−cos2θ=2sin²θ और sin2θ=2sinθcosθ का प्रयोग करें।",
    pa: "1−cos2θ=2sin²θ ਅਤੇ sin2θ=2sinθcosθ ਵਰਤੋ।",
  },
});

export const TRG_001_FINAL4_KEY_RULE_OVERRIDE_IDS = Object.freeze(
  Object.keys(FINAL4_KEY_RULE_OVERRIDES),
) as readonly string[];

export function trg001Final4ExpectedKeyRule(qlId: string, locale: Locale) {
  const rule = FINAL4_KEY_RULE_OVERRIDES[qlId];
  if (!rule) return null;
  return locale === "hi-IN" ? rule.hi : rule.pa;
}

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function learnerStrings(question: AnyQuestion) {
  return [
    question.stem,
    ...question.options.map((option: AnyQuestion) => option.display),
    question.answer,
    question.explanation?.keyRule,
    ...question.explanation.steps.flatMap((step: AnyQuestion) => [step.title, step.body]),
    question.explanation?.shortcut,
    ...question.explanation.traps,
  ].map((value) => String(value ?? ""));
}

export function trg001TrigDegreeAtoms(value: unknown) {
  const text = Array.isArray(value) ? value.map(String).join("\n") : String(value ?? "");
  return Array.from(text.matchAll(TRIG_DEGREE), (match) => `${match[1].toLowerCase()}${match[2]}°`);
}

function canonicalTrigDegreeAuthority(source: AnyQuestion) {
  const atoms = new Set<string>();
  const byFunction = new Map<string, Set<string>>();
  for (const atom of trg001TrigDegreeAtoms(learnerStrings(source))) {
    atoms.add(atom);
    const match = atom.match(/^(sin|cos|tan|cot|sec|cosec)(\d+)°$/u);
    if (!match) continue;
    const set = byFunction.get(match[1]) ?? new Set<string>();
    set.add(match[2]);
    byFunction.set(match[1], set);
  }
  return { atoms, byFunction };
}

function repairTrigDegreeProvenance(value: unknown, authority: ReturnType<typeof canonicalTrigDegreeAuthority>) {
  let corrected = 0;
  const text = String(value ?? "").replace(TRIG_DEGREE, (match, rawFunction: string, rawAngle: string) => {
    const fn = rawFunction.toLowerCase();
    const atom = `${fn}${rawAngle}°`;
    if (authority.atoms.has(atom)) return match;
    const candidates = [...(authority.byFunction.get(fn) ?? [])];
    if (candidates.length !== 1) return match;
    corrected += 1;
    return `${fn}${candidates[0]}°`;
  });
  return { text, corrected };
}

function ql121StepCorrection(qlId: string, locale: Locale, stepIndex: number, body: string) {
  if (qlId !== "TRG-001-QL-121" || stepIndex !== 1) return body;
  return locale === "hi-IN"
    ? "पहले गुणनफल वाले पद को सरल करें; केवल जिस त्रिकोणमितीय पद पर वर्ग लगा है, उसी का वर्ग लें।"
    : "ਪਹਿਲਾਂ ਗੁਣਨਫਲ ਵਾਲੇ ਪਦ ਨੂੰ ਸਰਲ ਕਰੋ; ਕੇਵਲ ਜਿਸ ਤਿਕੋਣਮਿਤੀ ਪਦ ਉੱਤੇ ਵਰਗ ਲੱਗਾ ਹੈ, ਉਸੇ ਦਾ ਵਰਗ ਲਓ।";
}

function mapExplanation(
  explanation: AnyQuestion,
  authority: ReturnType<typeof canonicalTrigDegreeAuthority>,
  qlId: string,
  locale: Locale,
) {
  let corrected = 0;
  const repair = (value: unknown) => {
    const result = repairTrigDegreeProvenance(value, authority);
    corrected += result.corrected;
    return result.text;
  };
  const expectedKeyRule = trg001Final4ExpectedKeyRule(qlId, locale);
  return {
    explanation: {
      ...explanation,
      keyRule: repair(expectedKeyRule ?? explanation.keyRule),
      steps: explanation.steps.map((step: AnyQuestion, index: number) => ({
        ...step,
        title: repair(step.title),
        body: repair(ql121StepCorrection(qlId, locale, index, step.body)),
      })),
      shortcut: repair(explanation.shortcut),
      traps: explanation.traps.map((trap: unknown) => repair(trap)),
    },
    corrected,
  };
}

export function finalizeLocalizedTrg001QuestionNativeReviewFinal4(
  source: AnyQuestion,
  localized: AnyQuestion,
  locale: Locale,
) {
  const authority = canonicalTrigDegreeAuthority(source);
  let corrected = 0;
  const repair = (value: unknown) => {
    const result = repairTrigDegreeProvenance(value, authority);
    corrected += result.corrected;
    return result.text;
  };

  const stem = repair(localized.stem);
  const options = localized.options.map((option: AnyQuestion) => ({
    ...option,
    display: repair(option.display),
  }));
  const localizedAnswerDisplay = repair(options[localized.correctIndex]?.display ?? localized.localizedAnswerDisplay);
  const explanationResult = mapExplanation(localized.explanation, authority, source.qlId, locale);
  corrected += explanationResult.corrected;
  const explanation = explanationResult.explanation;

  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL4_VERSION,
    locale,
    qlId: localized.qlId,
    seed: localized.seed,
    canonicalSemanticFingerprint: localized.localizationProof.canonicalSemanticFingerprint,
    stem,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
    explanation,
    correctedTrigDegreeAtoms: corrected,
  });

  return {
    ...localized,
    stem,
    options,
    localizedAnswerDisplay,
    explanation,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL4" as const,
    humanReviewStatus: "PENDING" as const,
    frozen: false as const,
    freezeEligible: false as const,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false as const,
    questionStudioDiscoverable: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    localizationLifecycle: {
      ...localized.localizationLifecycle,
      version: TRG_001_LOCALIZATION_NATIVE_REVIEW_FINAL4_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V5_PEDAGOGIC_REVIEW_FINAL4" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint,
      final4CanonicalTrigAngleGuard: true as const,
      final4CorrectedTrigDegreeAtoms: corrected,
      final4ExactKeyRuleFidelity: Boolean(trg001Final4ExpectedKeyRule(source.qlId, locale)),
      final4Ql121PedagogicCorrection: source.qlId === "TRG-001-QL-121",
      learnerSurfaceSource:
        "FINAL3_HUMAN_POLISH_PLUS_CANONICAL_TRIG_DEGREE_PROVENANCE_AND_EXACT_RULE_FIDELITY" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeReviewFinal4(
  qlId: string,
  seed: string,
  locale: Locale,
) {
  const source = generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion;
  const localized = generateLocalizedTrg001QuestionNativeReviewFinal3Human(qlId, seed, locale) as AnyQuestion;
  return finalizeLocalizedTrg001QuestionNativeReviewFinal4(source, localized, locale);
}
