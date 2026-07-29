import type { AlpLocale, AlpQuestionLogic, GeneratedAlpQuestion } from "./types";
import { buildCp006 } from "./completion/cp006";
import { buildCp007 } from "./completion/cp007";
import { buildCp008 } from "./completion/cp008";
import { buildCp009 } from "./completion/cp009";
import { buildCp010 } from "./completion/cp010";
import { difficulty, options, tr, track, type C } from "./completion/shared";

function build(ql: AlpQuestionLogic, seed: number): C {
  switch (ql.checkpointId) {
    case "ALP-CP-006": return buildCp006(ql, seed);
    case "ALP-CP-007": return buildCp007(ql, seed);
    case "ALP-CP-008": return buildCp008(ql, seed);
    case "ALP-CP-009": return buildCp009(ql, seed);
    case "ALP-CP-010": return buildCp010(ql, seed);
    default: throw new Error("Not an ALP-001 completion checkpoint.");
  }
}

export function generateAlpCompletionQuestion(ql: AlpQuestionLogic, seed: number, locale: AlpLocale): GeneratedAlpQuestion {
  if (!Number.isInteger(seed)) throw new Error("ALP-001 completion seed must be an integer.");
  const completion = build(ql, seed);
  const builtOptions = options(completion.answer, completion.pool, ql, seed);
  const wrongIndices = builtOptions.out.map((_, index) => index).filter((index) => index !== builtOptions.correctIndex);
  const traps = [
    { en: "uses the source row before the stated operation is complete", hi: "दी गई क्रिया पूरी होने से पहले मूल पंक्ति पढ़ता है", pa: "ਦਿੱਤੀ ਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਮੂਲ ਕਤਾਰ ਪੜ੍ਹਦਾ ਹੈ" },
    { en: "counts from the opposite end or moves in the opposite direction", hi: "विपरीत सिरे से गिनता है या उलटी दिशा में चलता है", pa: "ਉਲਟ ਸਿਰੇ ਤੋਂ ਗਿਣਦਾ ਹੈ ਜਾਂ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਚਲਦਾ ਹੈ" },
    { en: "mixes the requested category, gap or final-position condition with a different rule", hi: "माँगी श्रेणी, अंतर या अंतिम-स्थान शर्त को अलग नियम से मिला देता है", pa: "ਮੰਗੀ ਸ਼੍ਰੇਣੀ, ਫਰਕ ਜਾਂ ਅੰਤਿਮ-ਥਾਂ ਸ਼ਰਤ ਨੂੰ ਵੱਖਰੇ ਨਿਯਮ ਨਾਲ ਮਿਲਾ ਦਿੰਦਾ ਹੈ" },
  ];
  const distractorAnalyses = wrongIndices.map((optionIndex, trapIndex) => ({
    optionIndex,
    optionValue: builtOptions.out[optionIndex]!.value,
    errorLabel: builtOptions.out[optionIndex]!.errorLabel!,
    explanation: tr(locale, {
      en: `${builtOptions.out[optionIndex]!.value} is wrong because it ${traps[trapIndex]!.en}.`,
      hi: `${builtOptions.out[optionIndex]!.value} गलत है क्योंकि यह ${traps[trapIndex]!.hi}।`,
      pa: `${builtOptions.out[optionIndex]!.value} ਗਲਤ ਹੈ ਕਿਉਂਕਿ ਇਹ ${traps[trapIndex]!.pa}।`,
    }),
  }));
  const original = completion.source.join(" ");
  const changed = (completion.changed ?? completion.source).join(" ");

  return {
    chapterId: "ALP-001",
    qlId: ql.qlId,
    checkpointId: ql.checkpointId,
    ruleId: ql.ruleId,
    solveMode: ql.solveMode,
    locale,
    seed,
    difficulty: difficulty(ql, seed),
    renderer: ql.renderer,
    presentationMode: ql.presentationMode,
    stem: tr(locale, {
      en: `Given ${original}. First ${completion.operation.en}; then ${completion.query.en}.`,
      hi: `दी गई पंक्ति ${original}। पहले ${completion.operation.hi}; फिर ${completion.query.hi}।`,
      pa: `ਦਿੱਤੀ ਕਤਾਰ ${original}। ਪਹਿਲਾਂ ${completion.operation.pa}; ਫਿਰ ${completion.query.pa}।`,
    }),
    structuredPrompt: {
      sequence: completion.source,
      ...(completion.changed ? { transformedSequence: completion.changed } : {}),
      ...(completion.word ? { word: completion.word } : {}),
      ...(completion.changedWord ? { transformedWord: completion.changedWord } : {}),
      positionTrack: track(completion.source),
    },
    options: builtOptions.out,
    correctIndex: builtOptions.correctIndex,
    answer: completion.answer,
    explanation: {
      schemaVersion: "ALP-001-PEDAGOGY-V2",
      coreConcept: tr(locale, {
        en: "This question uses one explicit token-position operation. Preserve the shown order, complete the stated rule and verify the requested result only from the final row.",
        hi: "यह प्रश्न एक स्पष्ट तत्त्व-स्थान क्रिया पर आधारित है। दिखाया क्रम बनाए रखें, दिया नियम पूरा करें और केवल अंतिम पंक्ति से माँगा परिणाम जाँचें।",
        pa: "ਇਹ ਪ੍ਰਸ਼ਨ ਇੱਕ ਸਪਸ਼ਟ ਤੱਤ-ਥਾਂ ਕਿਰਿਆ ਉੱਤੇ ਆਧਾਰਿਤ ਹੈ। ਦਿੱਤਾ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ, ਦੱਸਿਆ ਨਿਯਮ ਪੂਰਾ ਕਰੋ ਅਤੇ ਕੇਵਲ ਅੰਤਿਮ ਕਤਾਰ ਤੋਂ ਮੰਗਿਆ ਨਤੀਜਾ ਜਾਂਚੋ।",
      }),
      ruleStatement: tr(locale, {
        en: `Complete this explicit operation before reading the result: ${completion.operation.en}.`,
        hi: `परिणाम पढ़ने से पहले यह स्पष्ट क्रिया पूरी करें: ${completion.operation.hi}।`,
        pa: `ਨਤੀਜਾ ਪੜ੍ਹਨ ਤੋਂ ਪਹਿਲਾਂ ਇਹ ਸਪਸ਼ਟ ਕਿਰਿਆ ਪੂਰੀ ਕਰੋ: ${completion.operation.pa}।`,
      }),
      steps: [tr(locale, completion.query), tr(locale, completion.working)],
      visualWorking: [
        tr(locale, { en: `Given row: ${original}`, hi: `दी गई पंक्ति: ${original}`, pa: `ਦਿੱਤੀ ਕਤਾਰ: ${original}` }),
        tr(locale, { en: `Completed row: ${changed}`, hi: `पूरी बनी पंक्ति: ${changed}`, pa: `ਪੂਰੀ ਬਣੀ ਕਤਾਰ: ${changed}` }),
        tr(locale, { en: `Requested result: ${completion.answer}`, hi: `माँगा परिणाम: ${completion.answer}`, pa: `ਮੰਗਿਆ ਨਤੀਜਾ: ${completion.answer}` }),
      ],
      examShortcut: tr(locale, completion.shortcut),
      conclusion: tr(locale, { en: `Therefore, the correct answer is ${completion.answer}.`, hi: `इसलिए सही उत्तर ${completion.answer} है।`, pa: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${completion.answer} ਹੈ।` }),
      distractorAnalyses,
      closestTrapRejection: tr(locale, {
        en: `The closest wrong option fails the exact final-row condition; ${completion.answer} satisfies every stated step.`,
        hi: `सबसे निकट गलत विकल्प अंतिम पंक्ति की पूरी शर्त नहीं मानता; ${completion.answer} हर चरण पूरा करता है।`,
        pa: `ਸਭ ਤੋਂ ਨੇੜਲੀ ਗਲਤ ਚੋਣ ਅੰਤਿਮ ਕਤਾਰ ਦੀ ਪੂਰੀ ਸ਼ਰਤ ਨਹੀਂ ਮੰਨਦੀ; ${completion.answer} ਹਰ ਪੜਾਅ ਪੂਰਾ ਕਰਦਾ ਹੈ।`,
      }),
    },
    metadata: {
      runtimeVersion: "ALP-001-RUNTIME-V3",
      localeMode: "TRANSLATABLE",
      independentSolverVerified: true,
      ambiguityAudit: "EXPLICIT_OPERATION_UNIQUE",
      occurrenceAware: false,
    },
  };
}
