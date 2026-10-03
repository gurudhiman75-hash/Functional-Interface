import type { AsmAnswerClass } from "./asm-001-authority";
import {
  ASM_001_SCENARIO_AUTHORITIES,
  asmLocalized,
  type AsmDifficulty,
  type AsmLanguage,
  type AsmScenarioAuthority,
} from "./asm-001-corpus";

export type AsmOptionProfile = "STANDARD_4" | "EXTENDED_5";

export interface GeneratedAsm001Question {
  readonly qlId: "ASM-QL-001";
  readonly checkpointId: "ASM-CP-001";
  readonly scenarioId: string;
  readonly language: AsmLanguage;
  readonly locale: "en-IN" | "hi-IN" | "pa-IN";
  readonly difficulty: AsmDifficulty;
  readonly optionProfile: AsmOptionProfile;
  readonly stem: string;
  readonly options: readonly string[];
  readonly optionSemantics: readonly AsmAnswerClass[];
  readonly correctIndex: number;
  readonly canonicalAnswer: AsmAnswerClass;
  readonly explanation: string;
  readonly proof: Readonly<{
    assertionTruth: boolean;
    reasonTruth: boolean;
    reasonExplainsAssertion: boolean;
    answerClass: AsmAnswerClass;
    semanticConsistency: true;
  }>;
  readonly metadata: Readonly<{
    sourceBackedFormat: true;
    curatedTruthAuthority: true;
    deterministic: true;
    reviewOnly: true;
  }>;
}

const ANSWER_ORDER: readonly AsmAnswerClass[] = [
  "BOTH_TRUE_REASON_EXPLAINS",
  "BOTH_TRUE_REASON_NOT_EXPLAINS",
  "ASSERTION_TRUE_REASON_FALSE",
  "ASSERTION_FALSE_REASON_TRUE",
  "BOTH_FALSE",
] as const;

const OPTION_COPY: Readonly<
  Record<AsmLanguage, Readonly<Record<AsmAnswerClass, string>>>
> = Object.freeze({
  en: Object.freeze({
    BOTH_TRUE_REASON_EXPLAINS:
      "Both A and R are true, and R is the correct explanation of A.",
    BOTH_TRUE_REASON_NOT_EXPLAINS:
      "Both A and R are true, but R is not the correct explanation of A.",
    ASSERTION_TRUE_REASON_FALSE: "A is true, but R is false.",
    ASSERTION_FALSE_REASON_TRUE: "A is false, but R is true.",
    BOTH_FALSE: "Both A and R are false.",
  }),
  hi: Object.freeze({
    BOTH_TRUE_REASON_EXPLAINS:
      "A और R दोनों सही हैं तथा R, A की सही व्याख्या करता है।",
    BOTH_TRUE_REASON_NOT_EXPLAINS:
      "A और R दोनों सही हैं, लेकिन R, A की सही व्याख्या नहीं करता।",
    ASSERTION_TRUE_REASON_FALSE: "A सही है, लेकिन R गलत है।",
    ASSERTION_FALSE_REASON_TRUE: "A गलत है, लेकिन R सही है।",
    BOTH_FALSE: "A और R दोनों गलत हैं।",
  }),
  pa: Object.freeze({
    BOTH_TRUE_REASON_EXPLAINS:
      "A ਅਤੇ R ਦੋਵੇਂ ਸਹੀ ਹਨ ਅਤੇ R, A ਦੀ ਸਹੀ ਵਿਆਖਿਆ ਕਰਦਾ ਹੈ।",
    BOTH_TRUE_REASON_NOT_EXPLAINS:
      "A ਅਤੇ R ਦੋਵੇਂ ਸਹੀ ਹਨ, ਪਰ R, A ਦੀ ਸਹੀ ਵਿਆਖਿਆ ਨਹੀਂ ਕਰਦਾ।",
    ASSERTION_TRUE_REASON_FALSE: "A ਸਹੀ ਹੈ, ਪਰ R ਗਲਤ ਹੈ।",
    ASSERTION_FALSE_REASON_TRUE: "A ਗਲਤ ਹੈ, ਪਰ R ਸਹੀ ਹੈ।",
    BOTH_FALSE: "A ਅਤੇ R ਦੋਵੇਂ ਗਲਤ ਹਨ।",
  }),
});

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function localeFor(language: AsmLanguage): GeneratedAsm001Question["locale"] {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function t(language: AsmLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function expectedClass(scenario: AsmScenarioAuthority): AsmAnswerClass {
  if (scenario.assertionTruth && scenario.reasonTruth) {
    return scenario.reasonExplainsAssertion
      ? "BOTH_TRUE_REASON_EXPLAINS"
      : "BOTH_TRUE_REASON_NOT_EXPLAINS";
  }
  if (scenario.assertionTruth) return "ASSERTION_TRUE_REASON_FALSE";
  if (scenario.reasonTruth) return "ASSERTION_FALSE_REASON_TRUE";
  return "BOTH_FALSE";
}

function validateScenario(scenario: AsmScenarioAuthority): void {
  const expected = expectedClass(scenario);
  if (expected !== scenario.answerClass) {
    throw new Error(
      scenario.id +
        ": curated truth flags resolve to " +
        expected +
        " but answerClass is " +
        scenario.answerClass,
    );
  }
  if (
    scenario.reasonExplainsAssertion &&
    (!scenario.assertionTruth || !scenario.reasonTruth)
  ) {
    throw new Error(
      scenario.id +
        ": a false Assertion or false Reason cannot be marked as a correct explanation.",
    );
  }
}

for (const scenario of ASM_001_SCENARIO_AUTHORITIES) validateScenario(scenario);

function shuffledSemantics(
  semantics: readonly AsmAnswerClass[],
  seed: string,
): AsmAnswerClass[] {
  const values = [...semantics];
  let state = hash(seed) || 1;
  for (let i = values.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [values[i], values[j]] = [values[j]!, values[i]!];
  }
  return values;
}

function profileFor(
  scenario: AsmScenarioAuthority,
  seed: string,
): AsmOptionProfile {
  if (scenario.answerClass === "BOTH_FALSE") return "EXTENDED_5";
  return hash(seed + ":option-profile") % 4 === 0
    ? "EXTENDED_5"
    : "STANDARD_4";
}

function stemFor(
  scenario: AsmScenarioAuthority,
  language: AsmLanguage,
): string {
  const assertion = asmLocalized(scenario.assertion, language);
  const reason = asmLocalized(scenario.reason, language);
  return t(
    language,
    `Assertion (A): ${assertion}\nReason (R): ${reason}\nWhich of the following is correct?`,
    `अभिकथन (A): ${assertion}\nकारण (R): ${reason}\nनिम्नलिखित में से कौन-सा सही है?`,
    `ਅਭਿਕਥਨ (A): ${assertion}\nਕਾਰਨ (R): ${reason}\nਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਹੀ ਹੈ?`,
  );
}

function truthLine(
  scenario: AsmScenarioAuthority,
  language: AsmLanguage,
): string {
  const a = scenario.assertionTruth
    ? t(language, "true", "सही", "ਸਹੀ")
    : t(language, "false", "गलत", "ਗਲਤ");
  const r = scenario.reasonTruth
    ? t(language, "true", "सही", "ਸਹੀ")
    : t(language, "false", "गलत", "ਗਲਤ");

  if (language === "en") {
    return `First judge the two statements separately: A is ${a} and R is ${r}.`;
  }
  if (language === "hi") {
    return `पहले दोनों कथनों को अलग-अलग जाँचें: A ${a} है और R ${r} है।`;
  }
  return `ਪਹਿਲਾਂ ਦੋਵੇਂ ਬਿਆਨਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ: A ${a} ਹੈ ਅਤੇ R ${r} ਹੈ।`;
}

function relationLine(
  scenario: AsmScenarioAuthority,
  language: AsmLanguage,
): string {
  if (!(scenario.assertionTruth && scenario.reasonTruth)) return "";
  if (scenario.reasonExplainsAssertion) {
    return t(
      language,
      "Since both are true, check the link next: R directly explains why A is true.",
      "दोनों सही होने के बाद संबंध जाँचें: R सीधे बताता है कि A क्यों सही है।",
      "ਦੋਵੇਂ ਸਹੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਸੰਬੰਧ ਜਾਂਚੋ: R ਸਿੱਧੇ ਤੌਰ 'ਤੇ ਦੱਸਦਾ ਹੈ ਕਿ A ਕਿਉਂ ਸਹੀ ਹੈ।",
    );
  }
  return t(
    language,
    "Both are true, but the next check fails: R does not explain why A is true.",
    "दोनों सही हैं, लेकिन अगली जाँच में R, A के सही होने का कारण नहीं बताता।",
    "ਦੋਵੇਂ ਸਹੀ ਹਨ, ਪਰ ਅਗਲੀ ਜਾਂਚ ਵਿੱਚ R, A ਦੇ ਸਹੀ ਹੋਣ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਦਾ।",
  );
}

function answerLine(
  answerText: string,
  language: AsmLanguage,
): string {
  return t(
    language,
    "Therefore, the correct option is: " + answerText,
    "इसलिए सही विकल्प है: " + answerText,
    "ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: " + answerText,
  );
}

function scenarioPool(difficulty?: AsmDifficulty): readonly AsmScenarioAuthority[] {
  const pool = difficulty
    ? ASM_001_SCENARIO_AUTHORITIES.filter(
        (scenario) => scenario.difficulty === difficulty,
      )
    : ASM_001_SCENARIO_AUTHORITIES;
  if (pool.length === 0) {
    throw new Error(
      "ASM-001 has no curated scenarios for " + String(difficulty ?? "Mixed"),
    );
  }
  return pool;
}

export function generateAsm001Question(
  seed: string,
  language: AsmLanguage = "en",
  difficulty?: AsmDifficulty,
): GeneratedAsm001Question {
  if (!seed.trim()) throw new Error("ASM-001 seed must be non-empty.");
  const pool = scenarioPool(difficulty);
  const scenario = pool[hash(seed + ":scenario") % pool.length]!;
  const optionProfile = profileFor(scenario, seed);

  const semantics =
    optionProfile === "EXTENDED_5"
      ? ANSWER_ORDER
      : ANSWER_ORDER.filter((value) => value !== "BOTH_FALSE");

  if (!semantics.includes(scenario.answerClass)) {
    throw new Error(
      scenario.id +
        ": option profile " +
        optionProfile +
        " cannot represent answer class " +
        scenario.answerClass,
    );
  }

  const shuffled = shuffledSemantics(semantics, seed + ":option-order");
  const options = shuffled.map((semantic) => OPTION_COPY[language][semantic]);
  const correctIndex = shuffled.indexOf(scenario.answerClass);
  const answerText = options[correctIndex]!;

  const explanation = [
    truthLine(scenario, language),
    relationLine(scenario, language),
    asmLocalized(scenario.rationale, language),
    answerLine(answerText, language),
  ]
    .filter(Boolean)
    .join("\n\n");

  return Object.freeze({
    qlId: "ASM-QL-001",
    checkpointId: "ASM-CP-001",
    scenarioId: scenario.id,
    language,
    locale: localeFor(language),
    difficulty: scenario.difficulty,
    optionProfile,
    stem: stemFor(scenario, language),
    options: Object.freeze(options),
    optionSemantics: Object.freeze(shuffled),
    correctIndex,
    canonicalAnswer: scenario.answerClass,
    explanation,
    proof: Object.freeze({
      assertionTruth: scenario.assertionTruth,
      reasonTruth: scenario.reasonTruth,
      reasonExplainsAssertion: scenario.reasonExplainsAssertion,
      answerClass: expectedClass(scenario),
      semanticConsistency: true as const,
    }),
    metadata: Object.freeze({
      sourceBackedFormat: true as const,
      curatedTruthAuthority: true as const,
      deterministic: true as const,
      reviewOnly: true as const,
    }),
  });
}

export function asm001ScenarioCountByDifficulty(): Readonly<
  Record<AsmDifficulty, number>
> {
  return Object.freeze({
    Easy: ASM_001_SCENARIO_AUTHORITIES.filter((x) => x.difficulty === "Easy")
      .length,
    Medium: ASM_001_SCENARIO_AUTHORITIES.filter(
      (x) => x.difficulty === "Medium",
    ).length,
    Hard: ASM_001_SCENARIO_AUTHORITIES.filter((x) => x.difficulty === "Hard")
      .length,
  });
}
