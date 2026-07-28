import { generateDirectionQuestion } from "../chapter-registry";
import { asR, directionAnglePa, directionPa, reverseTurnCalculationStepsPa, turnCalculationStepsPa, type R } from "./punjabi-foundation";
import { localizeDiagramPunjabi, optionLabelPunjabi } from "./punjabi-editorial-overrides";
import { renderPunjabiStem } from "./punjabi-stems";
import type { LocalizedDirectionExplanationPunjabi, LocalizedDirectionOptionPunjabi, LocalizedDirectionQuestionPunjabi } from "./punjabi-types";

function renderExplanationPunjabi(english: R): LocalizedDirectionExplanationPunjabi {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  const answer = optionLabelPunjabi(asR(english.options?.[english.correctIndex] ?? {}));
  const answerSentence = /ਹੈ[।.]?$/.test(answer) ? answer : `${answer} ਹੈ।`;
  const diagram = localizeDiagramPunjabi(asR(english.explanation)?.diagram);
  const stem = renderPunjabiStem(english);
  const context = stem.replace(/[^।?]*\?$/, "").trim() || stem;
  const base: LocalizedDirectionExplanationPunjabi = {
    given: `ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਜਾਣਕਾਰੀ: ${context}`,
    steps: ["ਸਾਰੀ ਜਾਣਕਾਰੀ ਨੂੰ ਇੱਕੋ ਨਕਸ਼ੇ ਉੱਤੇ ਕ੍ਰਮਵਾਰ ਦਰਜ ਕਰੋ।", "ਫਿਰ ਪੁੱਛੇ ਗਏ ਦੋ ਬਿੰਦੂਆਂ ਜਾਂ ਦਿਸ਼ਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।"],
    resultLine: `ਗਿਣਤੀ ਤੋਂ ਮਿਲਿਆ ਨਤੀਜਾ: ${answerSentence}`,
    conclusion: /ਹੈ[।.]?$/.test(answer) ? `ਇਸ ਲਈ ਸਹੀ ਨਤੀਜਾ: ${answer}` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`,
    ...(diagram ? { diagram } : {}),
  };

  if (qlId === "DIR-QL-001") {
    return {
      ...base,
      steps: turnCalculationStepsPa(s.initialFacing, s.turns ?? []),
      resultLine: `ਸਾਰੇ ਮੋੜ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਮੂੰਹ ${answer} ਦਿਸ਼ਾ ਵੱਲ ਹੈ।`,
    };
  }

  if (qlId === "DIR-QL-002") {
    return {
      ...base,
      steps: reverseTurnCalculationStepsPa(s.finalFacing, s.turns ?? []),
      resultLine: `ਮੋੜਾਂ ਨੂੰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਵਾਪਸ ਲੈਣ ਉੱਤੇ ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ ${answer} ਮਿਲਦੀ ਹੈ।`,
    };
  }

  if (qlId === "DIR-QL-003") {
    const initialAngle = directionAnglePa(s.initialFacing);
    const finalAngle = directionAnglePa(s.finalFacing);
    return {
      ...base,
      steps: [
        `ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ ${directionPa(s.initialFacing)} ਹੈ, ਅਰਥਾਤ ${initialAngle}°।`,
        `ਅੰਤਿਮ ਦਿਸ਼ਾ ${directionPa(s.finalFacing)} ਹੈ, ਅਰਥਾਤ ${finalAngle}°।`,
        `ਇਨ੍ਹਾਂ ਦੋਨਾਂ ਦਿਸ਼ਾਵਾਂ ਵਿਚਕਾਰ ਲੋੜੀਂਦਾ ਮੋੜ ${answer} ਬਣਦਾ ਹੈ।`,
      ],
      resultLine: `ਇਸ ਲਈ ਲਿਆ ਗਿਆ ਮੋੜ ${answer} ਹੈ।`,
    };
  }

  if (["DIR-QL-004", "DIR-QL-005", "DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਹਰ ਮੋੜ ਤੋਂ ਬਾਅਦ ਮੂੰਹ ਦੀ ਨਵੀਂ ਦਿਸ਼ਾ ਲਿਖੋ ਅਤੇ ਅਗਲੀ ਚਾਲ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਦਰਜ ਕਰੋ।",
        "ਪੂਰਬ-ਪੱਛਮ ਵਾਲੀਆਂ ਦੂਰੀਆਂ ਅਤੇ ਉੱਤਰ-ਦੱਖਣ ਵਾਲੀਆਂ ਦੂਰੀਆਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜੋੜੋ।",
        qlId === "DIR-QL-008"
          ? "ਕੁੱਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਅੰਤਿਮ ਬਿੰਦੂ ਦੀ ਸਿੱਧੀ ਦੂਰੀ ਵੱਖ-ਵੱਖ ਹਨ।"
          : "ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਦੇ ਫ਼ਰਕ ਤੋਂ ਲੋੜੀਂਦੀ ਦਿਸ਼ਾ ਜਾਂ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਮਿਲਦੀ ਹੈ।",
      ],
      resultLine: `ਪੂਰੇ ਰਸਤੇ ਦੀ ਗਿਣਤੀ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-011", "DIR-QL-012", "DIR-QL-013", "DIR-QL-014", "DIR-QL-015", "DIR-QL-036", "DIR-QL-037", "DIR-QL-044"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਇੱਕ ਬਿੰਦੂ ਨੂੰ ਪੱਕਾ ਮੰਨ ਕੇ ਬਾਕੀ ਬਿੰਦੂ ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਅਨੁਸਾਰ ਨਕਸ਼ੇ ਉੱਤੇ ਰੱਖੋ।",
        qlId === "DIR-QL-037"
          ? "ਹਰ ਵਾਧੂ ਕਥਨ ਨੂੰ ਵਾਰੀ-ਵਾਰੀ ਜਾਂਚੋ; ਜੋ ਕਥਨ ਬਾਕੀ ਨਕਸ਼ੇ ਨਾਲ ਮੇਲ ਨਾ ਖਾਏ, ਉਹੀ ਗਲਤ ਹੈ।"
          : "ਵੱਖ-ਵੱਖ ਕਥਨਾਂ ਤੋਂ ਮਿਲੇ ਬਿੰਦੂ ਇੱਕੋ ਨਕਸ਼ੇ ਉੱਤੇ ਆਪਸ ਵਿੱਚ ਮੇਲ ਖਾਣੇ ਚਾਹੀਦੇ ਹਨ।",
        "ਹੁਣ ਸਵਾਲ ਵਿੱਚ ਪੁੱਛੇ ਦੋ ਬਿੰਦੂਆਂ ਦਾ ਆਪਸੀ ਸੰਬੰਧ ਪੜ੍ਹੋ।",
      ],
      resultLine: `ਤਿਆਰ ਨਕਸ਼ੇ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-016", "DIR-QL-017", "DIR-QL-018", "DIR-QL-019", "DIR-QL-020", "DIR-QL-021", "DIR-QL-022"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਹਰ ਵਿਅਕਤੀ ਦੀ ਚਾਲ ਕ੍ਰਮਵਾਰ ਲਗਾ ਕੇ ਉਸ ਦਾ ਅੰਤਿਮ ਬਿੰਦੂ ਨਕਸ਼ੇ ਉੱਤੇ ਨਿਸ਼ਾਨ ਲਗਾਓ।",
        "ਫਿਰ ਸਵਾਲ ਅਨੁਸਾਰ ਦਿਸ਼ਾ, ਦੂਰੀ, ਸਭ ਤੋਂ ਨੇੜੇ ਜਾਂ ਸਭ ਤੋਂ ਦੂਰ ਬਿੰਦੂ, ਜਾਂ ਇੱਕੋ ਬਿੰਦੂ ਉੱਤੇ ਪਹੁੰਚਣ ਵਾਲੀ ਜੋੜੀ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
      ],
      resultLine: `ਅੰਤਿਮ ਬਿੰਦੂਆਂ ਦੀ ਤੁਲਨਾ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-023", "DIR-QL-024", "DIR-QL-025", "DIR-QL-026", "DIR-QL-027", "DIR-QL-028", "DIR-QL-029"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਪਹਿਲਾਂ ਹਰ ਚਿੰਨ੍ਹ ਦਾ ਦਿੱਤਾ ਮਤਲਬ ਲਿਖੋ।",
        "ਫਿਰ ਹਰ ਕਥਨ ਨੂੰ ਪਹਿਲਾ ਨਾਮ–ਚਿੰਨ੍ਹ–ਦੂਜਾ ਨਾਮ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹ ਕੇ ਸਧਾਰਨ ਦਿਸ਼ਾ-ਸੰਬੰਧ ਜਾਂ ਚਾਲ ਵਿੱਚ ਬਦਲੋ।",
        qlId === "DIR-QL-025" || qlId === "DIR-QL-028"
          ? "ਸੰਭਵ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜਾਂਚੋ ਅਤੇ ਸਿਰਫ਼ ਉਹੀ ਚਿੰਨ੍ਹ ਰੱਖੋ ਜੋ ਸਾਰੀ ਜਾਣਕਾਰੀ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।"
          : "ਬਦਲੇ ਹੋਏ ਸੰਬੰਧਾਂ ਜਾਂ ਚਾਲਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਜੋੜ ਕੇ ਨਤੀਜਾ ਕੱਢੋ।",
      ],
      resultLine: `ਚਿੰਨ੍ਹਾਂ ਦਾ ਮਤਲਬ ਲਗਾਉਣ ਉੱਤੇ ਸਹੀ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-030", "DIR-QL-031", "DIR-QL-032", "DIR-QL-033", "DIR-QL-034", "DIR-QL-035"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਸਵੇਰੇ ਸੂਰਜ ਪੂਰਬ ਵੱਲ ਅਤੇ ਸ਼ਾਮ ਨੂੰ ਪੱਛਮ ਵੱਲ ਹੁੰਦਾ ਹੈ; ਪਰਛਾਂਵਾਂ ਇਸ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵੱਲ ਪੈਂਦੀ ਹੈ।",
        "ਵਿਅਕਤੀ ਦੇ ਮੂੰਹ ਦੇ ਹਿਸਾਬ ਨਾਲ ਖੱਬੇ, ਸੱਜੇ, ਸਾਹਮਣੇ ਜਾਂ ਪਿੱਛੇ ਵਾਲੀ ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ।",
        qlId === "DIR-QL-034"
          ? "ਅੰਤ ਵਿੱਚ ਦਿੱਤੇ ਮੋੜ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਮੌਜੂਦਾ ਦਿਸ਼ਾ ਤੋਂ ਲਗਾਓ।"
          : "ਦੋ ਵਿਅਕਤੀਆਂ ਬਾਰੇ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਹੋਵੇ ਤਾਂ ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਉਸੇ ਅਨੁਸਾਰ ਤੈਅ ਕਰੋ।",
      ],
      resultLine: `ਸੂਰਜ ਅਤੇ ਪਰਛਾਂਵਾਂ ਦੇ ਸੰਬੰਧ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-038", "DIR-QL-039", "DIR-QL-040"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਚਾਲਾਂ ਨੂੰ ਨਕਸ਼ੇ ਉੱਤੇ ਲਗਾਓ।",
        "ਜਿਸ ਦਿਸ਼ਾ, ਮੋੜ ਜਾਂ ਸ਼ੁਰੂਆਤੀ ਮੂੰਹ ਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿੱਤੀ ਗਈ, ਉਸ ਲਈ ਹਰ ਸੰਭਵ ਵਿਕਲਪ ਵਾਰੀ-ਵਾਰੀ ਅਜ਼ਮਾਓ।",
        "ਜੋ ਇਕੱਲਾ ਵਿਕਲਪ ਦਿੱਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ, ਉਹੀ ਸਹੀ ਹੈ।",
      ],
      resultLine: `ਦਿੱਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-041", "DIR-QL-042", "DIR-QL-043"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਜਾਂ ਚੌਕੀ ਤੋਂ ਉੱਤਰ-ਦੱਖਣ ਵਾਲਾ ਫ਼ਰਕ ਅਤੇ ਪੂਰਬ-ਪੱਛਮ ਵਾਲਾ ਫ਼ਰਕ ਕੱਢੋ।",
        qlId === "DIR-QL-043"
          ? "ਇਨ੍ਹਾਂ ਦੋ ਫ਼ਰਕਾਂ ਉੱਤੇ ਪਾਇਥਾਗੋਰਸ ਨਿਯਮ ਲਗਾ ਕੇ ਸਿੱਧੀ ਦੂਰੀ ਕੱਢੋ।"
          : "ਦੋਨਾਂ ਫ਼ਰਕਾਂ ਦੇ ਪਾਸੇ ਤੋਂ ਦਿਸ਼ਾ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਮਾਪ ਤੋਂ ਦੂਰੀ ਤੈਅ ਕਰੋ।",
      ],
      resultLine: `ਸਾਂਝੀ ਗਿਣਤੀ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  return base;
}

export function localizeDirectionQuestionPunjabi(englishQuestion: unknown): LocalizedDirectionQuestionPunjabi {
  const english = asR(englishQuestion);
  const options: LocalizedDirectionOptionPunjabi[] = (english.options ?? []).map((option: R) => ({
    value: option.value,
    label: optionLabelPunjabi(option),
    errorLabel: option.errorLabel ?? null,
  }));
  if (options.length !== 4 || new Set(options.map((option) => option.label)).size !== 4) {
    throw new Error(`DIR Punjabi options must remain four and unique for ${english.qlId} seed ${english.seed}`);
  }
  const questionDiagram = localizeDiagramPunjabi(english.questionDiagram);
  return {
    locale: "pa-IN",
    qlId: String(english.qlId),
    checkpointId: String(english.checkpointId),
    ruleId: String(english.ruleId),
    seed: Number(english.seed),
    difficulty: english.difficulty,
    stem: renderPunjabiStem(english),
    structuredPrompt: english.structuredPrompt,
    ...(questionDiagram ? { questionDiagram } : {}),
    options,
    correctIndex: Number(english.correctIndex),
    correctAnswer: english.correctAnswer,
    explanation: renderExplanationPunjabi(english),
    metadata: {
      ...(english.metadata ?? {}),
      locale: "pa-IN",
      sourceLocale: "en-IN",
      localizationMode: "LANGUAGE_ADAPTED",
      answerParityVerified: true,
    },
  };
}

export function generateDirectionQuestionPunjabi(qlId: string, seed = 0): LocalizedDirectionQuestionPunjabi {
  return localizeDirectionQuestionPunjabi(generateDirectionQuestion(qlId, seed));
}
