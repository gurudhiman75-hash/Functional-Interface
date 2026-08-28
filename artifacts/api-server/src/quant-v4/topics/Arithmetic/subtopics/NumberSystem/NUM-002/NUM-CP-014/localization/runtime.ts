import type { NumCp014PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp014Permanent, type NumCp014PermanentPackage } from "../permanent-runtime.ts";

export type NumCp014LocalizedLanguage = "hi" | "pa";
export type NumCp014LocalizedLocale = "hi-IN" | "pa-IN";

export interface NumCp014LocalizedPackage extends Omit<NumCp014PermanentPackage, "locale" | "stem" | "options" | "canonicalAnswer" | "verifierAnswer" | "explanation" | "representationPayload" | "lifecycle"> {
  readonly language: NumCp014LocalizedLanguage;
  readonly locale: NumCp014LocalizedLocale;
  readonly stem: string;
  readonly options: readonly Readonly<{ value: string; isCorrect: boolean; misconceptionId: string }>[];
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly representationPayload?: readonly string[];
  readonly explanation: Readonly<{
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1";
    fullDerivation: readonly string[];
    examShortcut: readonly string[];
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  readonly lifecycle: Readonly<{
    permanentQlId: NumCp014PermanentQlId;
    maturity: "PERMANENT_AUTHORITY";
    reviewStatus: "MULTILINGUAL_FROZEN";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}

function list(values: readonly unknown[]) {
  return `{${values.map(String).join(", ")}}`;
}
function shifted(variable: string, shift: number) {
  return shift >= 0 ? `${variable} + ${shift}` : `${variable} - ${Math.abs(shift)}`;
}
function localAnswer(value: string, language: NumCp014LocalizedLanguage) {
  const maps = language === "hi"
    ? { NO_SOLUTION: "कोई हल नहीं", ONE_SOLUTION: "एक हल", MULTIPLE_SOLUTIONS: "एक से अधिक हल", INDETERMINATE: "निर्धारित नहीं" }
    : { NO_SOLUTION: "ਕੋਈ ਹੱਲ ਨਹੀਂ", ONE_SOLUTION: "ਇੱਕ ਹੱਲ", MULTIPLE_SOLUTIONS: "ਇੱਕ ਤੋਂ ਵੱਧ ਹੱਲ", INDETERMINATE: "ਨਿਰਧਾਰਤ ਨਹੀਂ" };
  return (maps as Record<string, string>)[value] ?? value;
}

function engineName(engine: string, language: NumCp014LocalizedLanguage) {
  const hi: Record<string, string> = {
    DIVISIBILITY: "विभाज्यता", REMAINDER: "शेषफल", HCF_LCM: "म.स. (HCF)", PRIME_STRUCTURE: "अभाज्य संख्या",
    DIVISOR_FUNCTION: "भाजकों की संख्या", PERFECT_POWER: "पूर्ण घात", FACTORIAL_VALUATION: "फैक्टोरियल में अभाज्य घात",
    TERMINAL_DIGIT_CYCLE: "इकाई-अंक चक्र", TERMINAL_CYCLE: "इकाई-अंक चक्र", POSITIONAL_BASE: "स्थानिक आधार",
  };
  const pa: Record<string, string> = {
    DIVISIBILITY: "ਵਿਭਾਜਯਤਾ", REMAINDER: "ਬਾਕੀ", HCF_LCM: "ਮ.ਸ. (HCF)", PRIME_STRUCTURE: "ਅਭਾਜ ਸੰਖਿਆ",
    DIVISOR_FUNCTION: "ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ", PERFECT_POWER: "ਪੂਰਨ ਘਾਤ", FACTORIAL_VALUATION: "ਫੈਕਟੋਰੀਅਲ ਵਿੱਚ ਅਭਾਜ ਘਾਤ",
    TERMINAL_DIGIT_CYCLE: "ਇਕਾਈ ਅੰਕ ਚੱਕਰ", TERMINAL_CYCLE: "ਇਕਾਈ ਅੰਕ ਚੱਕਰ", POSITIONAL_BASE: "ਸਥਾਨਿਕ ਆਧਾਰ",
  };
  return (language === "hi" ? hi : pa)[engine] ?? engine;
}

function localizedStem(q: NumCp014PermanentPackage, language: NumCp014LocalizedLanguage) {
  const s: any = q.hiddenState;
  const hi = language === "hi";
  switch (q.sourcePrototypeId) {
    case "NUM-CP014-PROT-001":
      return hi ? `चार अंकों की संख्या 472x में x एक अंक है। संख्या ${s.divisor} से विभाज्य है और ${s.remainderModulus} से भाग देने पर शेष ${s.requiredRemainder} बचता है। x ज्ञात कीजिए।`
        : `ਚਾਰ ਅੰਕਾਂ ਦੀ ਸੰਖਿਆ 472x ਵਿੱਚ x ਇੱਕ ਅੰਕ ਹੈ। ਸੰਖਿਆ ${s.divisor} ਨਾਲ ਵੰਡਣਯੋਗ ਹੈ ਅਤੇ ${s.remainderModulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${s.requiredRemainder} ਰਹਿੰਦਾ ਹੈ। x ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-002": {
      const sh = shifted("n", Number(s.shift));
      return hi ? `पूर्णांक n, ${s.lo} से ${s.hi} के बीच है। यदि म.स.(n, ${s.anchor}) = ${s.hcf} है और ${sh} अभाज्य है, तो n ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ n, ${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਹੈ। ਜੇ ਮ.ਸ.(n, ${s.anchor}) = ${s.hcf} ਹੈ ਅਤੇ ${sh} ਅਭਾਜ ਹੈ, ਤਾਂ n ਪਤਾ ਕਰੋ।`;
    }
    case "NUM-CP014-PROT-003":
      return hi ? `पूर्णांक n, ${s.lo} से ${s.hi} के बीच है। उसके ठीक ${s.tau} धनात्मक भाजक हैं और वह पूर्ण घन है। n ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ n, ${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਹੈ। ਇਸ ਦੇ ਠੀਕ ${s.tau} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ ਅਤੇ ਇਹ ਪੂਰਨ ਘਣ ਹੈ। n ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-004":
      return hi ? `पूर्णांक n, ${s.lo} से ${s.hi} के बीच है। n! में ${s.valuationPrime} की घात ठीक ${s.valuation} है और ${s.cycleBase}^n का इकाई अंक ${s.terminalDigit} है। n ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ n, ${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਹੈ। n! ਵਿੱਚ ${s.valuationPrime} ਦੀ ਘਾਤ ਠੀਕ ${s.valuation} ਹੈ ਅਤੇ ${s.cycleBase}^n ਦਾ ਇਕਾਈ ਅੰਕ ${s.terminalDigit} ਹੈ। n ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-005":
      return hi ? `अंक (1${s.digit})_b को पूर्णांक आधार b में लिखा गया है, जहाँ ${s.lo} ≤ b ≤ ${s.hi}। अंक-संख्या वैध है और उसका दशमलव मान ${s.divisor} से विभाज्य है। b ज्ञात कीजिए।`
        : `ਅੰਕ-ਰੂਪ (1${s.digit})_b ਨੂੰ ਪੂਰਨ ਅੰਕ ਆਧਾਰ b ਵਿੱਚ ਲਿਖਿਆ ਗਿਆ ਹੈ, ਜਿੱਥੇ ${s.lo} ≤ b ≤ ${s.hi}। ਇਹ ਰੂਪ ਵੈਧ ਹੈ ਅਤੇ ਇਸ ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ${s.divisor} ਨਾਲ ਵੰਡਣਯੋਗ ਹੈ। b ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-006":
      return hi ? `पूर्णांक n, ${s.lo} से ${s.hi} के बीच है। वह पूर्ण वर्ग है और ${s.modulus} से भाग देने पर शेष ${s.remainder} देता है। n ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ n, ${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਹੈ। ਇਹ ਪੂਰਨ ਵਰਗ ਹੈ ਅਤੇ ${s.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${s.remainder} ਦਿੰਦਾ ਹੈ। n ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-007":
      return hi ? `${s.lo} से ${s.hi} के बीच वह सबसे छोटा पूर्णांक n ज्ञात कीजिए जो पूर्ण वर्ग हो और ${s.modulus} से भाग देने पर शेष ${s.remainder} दे।`
        : `${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ n ਪਤਾ ਕਰੋ ਜੋ ਪੂਰਨ ਵਰਗ ਹੋਵੇ ਅਤੇ ${s.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${s.remainder} ਦੇਵੇ।`;
    case "NUM-CP014-PROT-008": {
      const sh = shifted("n", Number(s.shift));
      return hi ? `${s.lo} से ${s.hi} के बीच सबसे बड़ा पूर्णांक n ज्ञात कीजिए जिसके लिए म.स.(n, ${s.anchor}) = ${s.hcf} हो और ${sh} अभाज्य हो।`
        : `${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ n ਪਤਾ ਕਰੋ ਜਿਸ ਲਈ ਮ.ਸ.(n, ${s.anchor}) = ${s.hcf} ਹੋਵੇ ਅਤੇ ${sh} ਅਭਾਜ ਹੋਵੇ।`;
    }
    case "NUM-CP014-PROT-009":
      return hi ? `2 ≤ b ≤ ${s.hi} वाले कितने पूर्णांक आधार b के लिए (1${s.digit})_b वैध है और उसका दशमलव मान ${s.divisor} से विभाज्य है?`
        : `2 ≤ b ≤ ${s.hi} ਵਾਲੇ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ ਆਧਾਰ b ਲਈ (1${s.digit})_b ਵੈਧ ਹੈ ਅਤੇ ਇਸ ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ${s.divisor} ਨਾਲ ਵੰਡਣਯੋਗ ਹੈ?`;
    case "NUM-CP014-PROT-010":
      return hi ? `${s.lo} से ${s.hi} के बीच ऐसे पूर्णांक n, जो पूर्ण घन हों और n ≡ ${s.remainder} (mod ${s.modulus}) पूरा करें, उनके हलों की श्रेणी बताइए।`
        : `${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਉਹ ਪੂਰਨ ਅੰਕ n ਜੋ ਪੂਰਨ ਘਣ ਹੋਣ ਅਤੇ n ≡ ${s.remainder} (mod ${s.modulus}) ਪੂਰਾ ਕਰਨ, ਉਨ੍ਹਾਂ ਦੇ ਹੱਲਾਂ ਦੀ ਸ਼੍ਰੇਣੀ ਦੱਸੋ।`;
    case "NUM-CP014-PROT-011": {
      const sh = shifted("n", Number(s.shift));
      return hi ? `पूर्णांक n, ${s.lo} से ${s.hi} के बीच है। म.स.(n, ${s.anchor}) = ${s.hcf}, ${sh} अभाज्य है और ${s.modulus} से भाग देने पर शेष ${s.remainder} मिलता है। n ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ n, ${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਹੈ। ਮ.ਸ.(n, ${s.anchor}) = ${s.hcf}, ${sh} ਅਭਾਜ ਹੈ ਅਤੇ ${s.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${s.remainder} ਮਿਲਦਾ ਹੈ। n ਪਤਾ ਕਰੋ।`;
    }
    case "NUM-CP014-PROT-012":
      return hi ? `कितने क्रमबद्ध अंक-युग्म (x, y), जहाँ 0 ≤ x,y ≤ 9, संख्या 5xy को ${s.divisor} से विभाज्य बनाते हैं और ${s.modulus} से भाग देने पर शेष ${s.remainder} देते हैं?`
        : `ਕਿੰਨੇ ਕ੍ਰਮਬੱਧ ਅੰਕ-ਜੋੜੇ (x, y), ਜਿੱਥੇ 0 ≤ x,y ≤ 9, ਸੰਖਿਆ 5xy ਨੂੰ ${s.divisor} ਨਾਲ ਵੰਡਣਯੋਗ ਬਣਾਉਂਦੇ ਹਨ ਅਤੇ ${s.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${s.remainder} ਦਿੰਦੇ ਹਨ?`;
    case "NUM-CP014-PROT-013":
      return hi ? `चार अंकों की संख्या ${s.pattern} एक पूर्ण वर्ग भी है और ${s.divisor} से विभाज्य भी। x ज्ञात कीजिए।`
        : `ਚਾਰ ਅੰਕਾਂ ਦੀ ਸੰਖਿਆ ${s.pattern} ਪੂਰਨ ਵਰਗ ਵੀ ਹੈ ਅਤੇ ${s.divisor} ਨਾਲ ਵੰਡਣਯੋਗ ਵੀ। x ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-014":
      return hi ? `पूर्णांक n, ${s.lo} से ${s.hi} के बीच है। उसके ठीक ${s.divisorCount} धनात्मक भाजक हैं और म.स.(n, ${s.anchor}) = ${s.hcf} है। n ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ n, ${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਹੈ। ਇਸ ਦੇ ਠੀਕ ${s.divisorCount} ਧਨਾਤਮਕ ਭਾਜਕ ਹਨ ਅਤੇ ਮ.ਸ.(n, ${s.anchor}) = ${s.hcf} ਹੈ। n ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-015":
      return hi ? `${s.lo} से ${s.hi} के बीच वह पूर्णांक n ज्ञात कीजिए जिसके ठीक ${s.divisorCount} धनात्मक भाजक हों और ${s.modulus} से भाग देने पर शेष ${s.remainder} मिले।`
        : `${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਉਹ ਪੂਰਨ ਅੰਕ n ਪਤਾ ਕਰੋ ਜਿਸ ਦੇ ਠੀਕ ${s.divisorCount} ਧਨਾਤਮਕ ਭਾਜਕ ਹੋਣ ਅਤੇ ${s.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${s.remainder} ਮਿਲੇ।`;
    case "NUM-CP014-PROT-016": {
      const power = s.powerKind === "SQUARE" ? (hi ? "पूर्ण वर्ग" : "ਪੂਰਨ ਵਰਗ") : (hi ? "पूर्ण घन" : "ਪੂਰਨ ਘਣ");
      return hi ? `पूर्णांक n, ${s.lo} से ${s.hi} के बीच है। वह ${power} है और म.स.(n, ${s.anchor}) = ${s.hcf} है। n ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ n, ${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਹੈ। ਇਹ ${power} ਹੈ ਅਤੇ ਮ.ਸ.(n, ${s.anchor}) = ${s.hcf} ਹੈ। n ਪਤਾ ਕਰੋ।`;
    }
    case "NUM-CP014-PROT-017":
      return hi ? `पूर्णांक आधार b के लिए 2 ≤ b ≤ ${s.maxBase} है। (1${s.digit})_b वैध है और उसके दशमलव मान का ${s.anchor} के साथ म.स. ${s.hcf} है। b ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ ਆਧਾਰ b ਲਈ 2 ≤ b ≤ ${s.maxBase} ਹੈ। (1${s.digit})_b ਵੈਧ ਹੈ ਅਤੇ ਇਸ ਦੇ ਦਸ਼ਮਲਵ ਮੁੱਲ ਦਾ ${s.anchor} ਨਾਲ ਮ.ਸ. ${s.hcf} ਹੈ। b ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-018":
      return hi ? `पूर्णांक घात n, ${s.lo} से ${s.hi} के बीच है। ${s.powerBase}^n का इकाई अंक ${s.terminalDigit} है और n को ${s.modulus} से भाग देने पर शेष ${s.remainder} मिलता है। n ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ ਘਾਤ n, ${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਹੈ। ${s.powerBase}^n ਦਾ ਇਕਾਈ ਅੰਕ ${s.terminalDigit} ਹੈ ਅਤੇ n ਨੂੰ ${s.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${s.remainder} ਮਿਲਦਾ ਹੈ। n ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-019":
      return hi ? `पूर्णांक d, 2 से ${s.maxDivisor} के बीच है। d, ${s.number} का भाजक है और म.स.(d, ${s.anchor}) = ${s.hcf} है। d ज्ञात कीजिए।`
        : `ਪੂਰਨ ਅੰਕ d, 2 ਤੋਂ ${s.maxDivisor} ਦੇ ਵਿਚਕਾਰ ਹੈ। d, ${s.number} ਦਾ ਭਾਜਕ ਹੈ ਅਤੇ ਮ.ਸ.(d, ${s.anchor}) = ${s.hcf} ਹੈ। d ਪਤਾ ਕਰੋ।`;
    case "NUM-CP014-PROT-020":
      return hi ? `${s.lo} से ${s.hi} के बीच उन सभी पूर्णांकों n का पूरा समुच्चय लिखिए जो पूर्ण वर्ग हैं और n ≡ ${s.remainder} (mod ${s.modulus}) पूरा करते हैं।`
        : `${s.lo} ਤੋਂ ${s.hi} ਦੇ ਵਿਚਕਾਰ ਉਹਨਾਂ ਸਾਰੇ ਪੂਰਨ ਅੰਕਾਂ n ਦਾ ਪੂਰਾ ਸਮੂਹ ਲਿਖੋ ਜੋ ਪੂਰਨ ਵਰਗ ਹਨ ਅਤੇ n ≡ ${s.remainder} (mod ${s.modulus}) ਪੂਰਾ ਕਰਦੇ ਹਨ।`;
    default:
      throw new Error(`Missing CP014 localized stem for ${q.sourcePrototypeId}`);
  }
}

function fullCandidates(q: NumCp014PermanentPackage): string[] {
  const a: any = q.ablation;
  return [...(a.fullCandidates ?? [])].map(String);
}
function removedSets(q: NumCp014PermanentPackage) {
  const a: any = q.ablation;
  if (a.componentRemovedCandidates) {
    return Object.entries(a.componentRemovedCandidates).map(([engine, values]) => ({ engine, values: [...(values as readonly unknown[])].map(String) }));
  }
  const out: Array<{ engine: string; values: string[] }> = [];
  if (a.componentA && a.withoutA) out.push({ engine: String(a.componentA), values: [...a.withoutA].map(String) });
  if (a.componentB && a.withoutB) out.push({ engine: String(a.componentB), values: [...a.withoutB].map(String) });
  return out;
}

function verification(q: NumCp014PermanentPackage, language: NumCp014LocalizedLanguage) {
  const s: any = q.hiddenState;
  const hi = language === "hi";
  const answer = localAnswer(q.canonicalAnswer, language);
  switch (q.sourcePrototypeId) {
    case "NUM-CP014-PROT-001": return hi ? `जाँच: 4 + 7 + 2 + ${answer} = ${13 + Number(q.canonicalAnswer)} और 472${answer} दोनों दी गई भाग/शेष शर्तें पूरी करते हैं।` : `ਜਾਂਚ: 4 + 7 + 2 + ${answer} = ${13 + Number(q.canonicalAnswer)} ਅਤੇ 472${answer} ਦੋਵੇਂ ਦਿੱਤੀਆਂ ਭਾਗ/ਬਾਕੀ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੇ ਹਨ।`;
    case "NUM-CP014-PROT-003": return hi ? `जाँच: ${s.cubeRoot}³ = ${s.cubeRoot} × ${s.cubeRoot} × ${s.cubeRoot} = ${answer}, और τ(${answer}) = ${s.tau}।` : `ਜਾਂਚ: ${s.cubeRoot}³ = ${s.cubeRoot} × ${s.cubeRoot} × ${s.cubeRoot} = ${answer}, ਅਤੇ τ(${answer}) = ${s.tau}।`;
    case "NUM-CP014-PROT-005": return hi ? `जाँच: (1${s.digit})_${answer} = ${answer} + ${s.digit} = ${Number(q.canonicalAnswer) + Number(s.digit)}, जो ${s.divisor} से विभाज्य है और ${s.digit} < ${answer} है।` : `ਜਾਂਚ: (1${s.digit})_${answer} = ${answer} + ${s.digit} = ${Number(q.canonicalAnswer) + Number(s.digit)}, ਜੋ ${s.divisor} ਨਾਲ ਵੰਡਣਯੋਗ ਹੈ ਅਤੇ ${s.digit} < ${answer} ਹੈ।`;
    case "NUM-CP014-PROT-006": return hi ? `जाँच: ${s.squareRoot}² = ${answer} और ${answer} mod ${s.modulus} = ${s.remainder}।` : `ਜਾਂਚ: ${s.squareRoot}² = ${answer} ਅਤੇ ${answer} mod ${s.modulus} = ${s.remainder}।`;
    case "NUM-CP014-PROT-009": return hi ? `वैधता के लिए b > ${s.digit}; फिर (1${s.digit})_b = b + ${s.digit} पर ${s.divisor} की विभाज्यता लगती है। दोनों से ठीक ${answer} आधार बचते हैं।` : `ਵੈਧਤਾ ਲਈ b > ${s.digit}; ਫਿਰ (1${s.digit})_b = b + ${s.digit} ਉੱਤੇ ${s.divisor} ਦੀ ਵਿਭਾਜਯਤਾ ਲੱਗਦੀ ਹੈ। ਦੋਵੇਂ ਨਾਲ ਠੀਕ ${answer} ਆਧਾਰ ਬਚਦੇ ਹਨ।`;
    case "NUM-CP014-PROT-017": return hi ? `जाँच: (1${s.digit})_b = b + ${s.digit}; b = ${answer} रखने पर अंक वैध है और अपेक्षित म.स. ${s.hcf} मिलता है।` : `ਜਾਂਚ: (1${s.digit})_b = b + ${s.digit}; b = ${answer} ਰੱਖਣ ਤੇ ਅੰਕ-ਰੂਪ ਵੈਧ ਹੈ ਅਤੇ ਲੋੜੀਂਦਾ ਮ.ਸ. ${s.hcf} ਮਿਲਦਾ ਹੈ।`;
    case "NUM-CP014-PROT-018": return hi ? `जाँच: n = ${answer} पर ${s.powerBase}^n का इकाई अंक ${s.terminalDigit} है और ${answer} mod ${s.modulus} = ${s.remainder}।` : `ਜਾਂਚ: n = ${answer} ਉੱਤੇ ${s.powerBase}^n ਦਾ ਇਕਾਈ ਅੰਕ ${s.terminalDigit} ਹੈ ਅਤੇ ${answer} mod ${s.modulus} = ${s.remainder}।`;
    case "NUM-CP014-PROT-019": return hi ? `जाँच: ${s.number} ÷ ${answer} पूर्णांक है और म.स.(${answer}, ${s.anchor}) = ${s.hcf}।` : `ਜਾਂਚ: ${s.number} ÷ ${answer} ਪੂਰਨ ਅੰਕ ਹੈ ਅਤੇ ਮ.ਸ.(${answer}, ${s.anchor}) = ${s.hcf}।`;
    case "NUM-CP014-PROT-020": return hi ? `जाँच: उत्तर-समुच्चय का हर सदस्य पूर्ण वर्ग है और ${s.modulus} से भाग देने पर शेष ${s.remainder} देता है; कोई वैध सदस्य छोड़ा नहीं गया।` : `ਜਾਂਚ: ਉੱਤਰ-ਸਮੂਹ ਦਾ ਹਰ ਮੈਂਬਰ ਪੂਰਨ ਵਰਗ ਹੈ ਅਤੇ ${s.modulus} ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ${s.remainder} ਦਿੰਦਾ ਹੈ; ਕੋਈ ਵੈਧ ਮੈਂਬਰ ਛੱਡਿਆ ਨਹੀਂ ਗਿਆ।`;
    default: return hi ? `अंतिम मान ${answer} को मूल दोनों/सभी शर्तों में रखने पर हर शर्त पूरी होती है।` : `ਅੰਤਿਮ ਮੁੱਲ ${answer} ਨੂੰ ਮੂਲ ਦੋਵੇਂ/ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਵਿੱਚ ਰੱਖਣ ਤੇ ਹਰ ਸ਼ਰਤ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।`;
  }
}

function localizedExplanation(q: NumCp014PermanentPackage, language: NumCp014LocalizedLanguage, finalAnswer: string) {
  const hi = language === "hi";
  const engines = q.componentEngines.map((engine) => engineName(engine, language));
  const full = fullCandidates(q);
  const removed = removedSets(q);
  const derivation: string[] = [];
  derivation.push(hi
    ? `यह वास्तविक मिश्रित प्रश्न है: ${engines.join(" + ")} की सभी शर्तें आवश्यक हैं; किसी एक शर्त से उत्तर अकेले तय नहीं होता।`
    : `ਇਹ ਅਸਲ ਮਿਲਿਆ-ਜੁਲਿਆ ਪ੍ਰਸ਼ਨ ਹੈ: ${engines.join(" + ")} ਦੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਲਾਜ਼ਮੀ ਹਨ; ਕਿਸੇ ਇੱਕ ਸ਼ਰਤ ਨਾਲ ਉੱਤਰ ਇਕੱਲਾ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੁੰਦਾ।`);
  derivation.push(hi
    ? `पूरे दिए गए सीमित क्षेत्र पर सभी शर्तें लगाने से साझा संभावित मान ${list(full)} मिलते हैं।`
    : `ਪੂਰੇ ਦਿੱਤੇ ਸੀਮਿਤ ਖੇਤਰ ਉੱਤੇ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਲਗਾਉਣ ਨਾਲ ਸਾਂਝੇ ਸੰਭਾਵੀ ਮੁੱਲ ${list(full)} ਮਿਲਦੇ ਹਨ।`);
  for (const item of removed) {
    derivation.push(hi
      ? `यदि ${engineName(item.engine, language)} वाली शर्त हटाएँ, तो ${list(item.values)} संभावनाएँ बचती हैं; इसलिए यह शर्त सजावटी नहीं, वास्तव में आवश्यक है।`
      : `ਜੇ ${engineName(item.engine, language)} ਵਾਲੀ ਸ਼ਰਤ ਹਟਾਈਏ, ਤਾਂ ${list(item.values)} ਸੰਭਾਵਨਾਵਾਂ ਬਚਦੀਆਂ ਹਨ; ਇਸ ਲਈ ਇਹ ਸ਼ਰਤ ਸਿਰਫ਼ ਸਜਾਵਟੀ ਨਹੀਂ, ਅਸਲ ਵਿੱਚ ਲਾਜ਼ਮੀ ਹੈ।`);
  }
  derivation.push(verification(q, language));
  derivation.push(hi ? `अतः सही उत्तर ${finalAnswer} है।` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${finalAnswer} ਹੈ।`);

  const shortcut = hi
    ? [
        `तेज़ विधि: पहले वह शर्त लगाइए जो संभावित मानों की सूची सबसे जल्दी छोटी करती है।`,
        `बचे हुए थोड़े मानों पर दूसरी (और जहाँ लागू हो तीसरी) शर्त जाँचिए; साझा परिणाम ${finalAnswer} है।`,
      ]
    : [
        `ਤੇਜ਼ ਤਰੀਕਾ: ਪਹਿਲਾਂ ਉਹ ਸ਼ਰਤ ਲਗਾਓ ਜੋ ਸੰਭਾਵੀ ਮੁੱਲਾਂ ਦੀ ਸੂਚੀ ਸਭ ਤੋਂ ਜਲਦੀ ਛੋਟੀ ਕਰਦੀ ਹੈ।`,
        `ਬਚੇ ਹੋਏ ਥੋੜ੍ਹੇ ਮੁੱਲਾਂ ਉੱਤੇ ਦੂਜੀ (ਅਤੇ ਜਿੱਥੇ ਲਾਗੂ ਹੋ ਤੀਜੀ) ਸ਼ਰਤ ਜਾਂਚੋ; ਸਾਂਝਾ ਨਤੀਜਾ ${finalAnswer} ਹੈ।`,
      ];
  return Object.freeze({
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1" as const,
    fullDerivation: Object.freeze(derivation),
    examShortcut: Object.freeze(shortcut),
    coreConcept: derivation[0]!,
    strategy: shortcut[0]!,
    steps: Object.freeze(derivation.slice(1)),
    finalAnswer,
  });
}

function localizedRepresentation(q: NumCp014PermanentPackage, language: NumCp014LocalizedLanguage) {
  if (q.representation === "STANDARD_SYNTHESIS") return undefined;
  const hi = language === "hi";
  const full = fullCandidates(q);
  const removed = removedSets(q);
  const a = removed[0]?.values ?? [];
  const b = removed[1]?.values ?? [];
  if (q.representation === "CONSTRAINT_TABLE") return Object.freeze(hi
    ? [`क्षेत्र | पूरा सीमित क्षेत्र`, `एक शर्त हटाने पर | ${list(a)}`, `दूसरी शर्त हटाने पर | ${list(b)}`, `सभी शर्तें | ${list(full)}`]
    : [`ਖੇਤਰ | ਪੂਰਾ ਸੀਮਿਤ ਖੇਤਰ`, `ਇੱਕ ਸ਼ਰਤ ਹਟਾਉਣ ਤੇ | ${list(a)}`, `ਦੂਜੀ ਸ਼ਰਤ ਹਟਾਉਣ ਤੇ | ${list(b)}`, `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ | ${list(full)}`]);
  if (q.representation === "ELIMINATION_GRID") return Object.freeze(hi
    ? [`आरंभ: सभी संभावनाएँ`, `पहला छनाव: ${list(a)}`, `दूसरा छनाव: ${list(b)}`, `साझा परिणाम: ${list(full)}`]
    : [`ਸ਼ੁਰੂਆਤ: ਸਾਰੀਆਂ ਸੰਭਾਵਨਾਵਾਂ`, `ਪਹਿਲੀ ਛਾਂਟ: ${list(a)}`, `ਦੂਜੀ ਛਾਂਟ: ${list(b)}`, `ਸਾਂਝਾ ਨਤੀਜਾ: ${list(full)}`]);
  if (q.representation === "MINI_CASELET") return Object.freeze(hi
    ? [`दिया गया सीमित क्षेत्र लें।`, `पहली आवश्यक शर्त संभावनाओं को सीमित करती है।`, `दूसरी आवश्यक शर्त स्वतंत्र रूप से जाँची जाती है।`, `दोनों का साझा परिणाम ${list(full)} है।`]
    : [`ਦਿੱਤਾ ਸੀਮਿਤ ਖੇਤਰ ਲਓ।`, `ਪਹਿਲੀ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਸੰਭਾਵਨਾਵਾਂ ਘਟਾਉਂਦੀ ਹੈ।`, `ਦੂਜੀ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਅਲੱਗ ਤੌਰ ਤੇ ਜਾਂਚੀ ਜਾਂਦੀ ਹੈ।`, `ਦੋਵਾਂ ਦਾ ਸਾਂਝਾ ਨਤੀਜਾ ${list(full)} ਹੈ।`]);
  return Object.freeze(hi
    ? [`आरंभ → पूरा क्षेत्र`, `→ पहली शर्त`, `→ अगली आवश्यक शर्त`, `→ साझा परिणाम ${list(full)}`]
    : [`ਸ਼ੁਰੂ → ਪੂਰਾ ਖੇਤਰ`, `→ ਪਹਿਲੀ ਸ਼ਰਤ`, `→ ਅਗਲੀ ਲਾਜ਼ਮੀ ਸ਼ਰਤ`, `→ ਸਾਂਝਾ ਨਤੀਜਾ ${list(full)}`]);
}

export function generateNumCp014Localized(
  qlId: NumCp014PermanentQlId,
  seed: number,
  language: NumCp014LocalizedLanguage,
): NumCp014LocalizedPackage {
  const source = generateNumCp014Permanent(qlId, seed);
  const canonicalAnswer = localAnswer(source.canonicalAnswer, language);
  const options = Object.freeze(source.options.map((option) => Object.freeze({
    ...option,
    value: localAnswer(option.value, language),
  })));
  if (options[source.correctIndex]?.value !== canonicalAnswer || !options[source.correctIndex]?.isCorrect) {
    throw new Error(`${qlId}/${seed}/${language}: localized answer binding drift.`);
  }
  return Object.freeze({
    ...source,
    language,
    locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
    stem: localizedStem(source, language),
    options,
    canonicalAnswer,
    verifierAnswer: canonicalAnswer,
    ...(localizedRepresentation(source, language) ? { representationPayload: localizedRepresentation(source, language)! } : {}),
    explanation: localizedExplanation(source, language, canonicalAnswer),
    lifecycle: Object.freeze({
      ...source.lifecycle,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
    }),
  });
}
