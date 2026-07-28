import { generateDirectionQuestion } from "../chapter-registry";
import { asR, directionPa, turnSequencePa, type R } from "./punjabi-foundation";
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
    given: `ਦਿੱਤੀ ਜਾਣਕਾਰੀ: ${context}`,
    steps: ["ਹਰ ਚਾਲ ਜਾਂ ਸੰਬੰਧ ਨੂੰ ਇੱਕੋ ਪੱਕੇ ਦਿਸ਼ਾ-ਫਰੇਮ ਵਿੱਚ ਰੱਖੋ।", "ਫਿਰ ਪੁੱਛੇ ਗਏ ਦੋ ਬਿੰਦੂਆਂ ਜਾਂ ਹਾਲਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।"],
    resultLine: `ਗਿਣਤੀ ਦਾ ਨਤੀਜਾ: ${answerSentence}`,
    conclusion: /ਹੈ[।.]?$/.test(answer) ? `ਇਸ ਲਈ ਸਹੀ ਨਤੀਜਾ: ${answer}` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`,
    ...(diagram ? { diagram } : {}),
  };
  if (["DIR-QL-001", "DIR-QL-002", "DIR-QL-003"].includes(qlId)) {
    return { ...base, steps: [`ਹੁਕਮਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਲਾਗੂ ਕਰੋ: ${turnSequencePa(s.turns ?? []) || `${directionPa(s.initialFacing)} ਤੋਂ ${directionPa(s.finalFacing)}`}.`, "ਹਰ ਨਵਾਂ ਮੋੜ ਮੌਜੂਦਾ ਦਿਸ਼ਾ ਤੋਂ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ, ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ ਤੋਂ ਨਹੀਂ।"], resultLine: `ਲੋੜੀਂਦੀ ਦਿਸ਼ਾ ਜਾਂ ਹੁਕਮ: ${answerSentence}` };
  }
  if (["DIR-QL-004", "DIR-QL-005", "DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"].includes(qlId)) {
    return { ...base, steps: ["ਹਰ ਮੋੜ ਤੋਂ ਬਾਅਦ ਨਵੀਂ ਮੂੰਹ-ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ ਅਤੇ ਅਗਲੀ ਚਾਲ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਲਗਾਓ।", "ਪੂਰਬ-ਪੱਛਮ ਅਤੇ ਉੱਤਰ-ਦੱਖਣ ਦੀਆਂ ਸ਼ੁੱਧ ਚਾਲਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜੋੜੋ।", qlId === "DIR-QL-008" ? "ਕੁੱਲ ਤੈਅ ਦੂਰੀ ਅਤੇ ਸਿੱਧੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਵੱਖ-ਵੱਖ ਮਾਤਰਾਂ ਹਨ।" : "ਅੰਤਿਮ ਖਿਸਕਾਅ ਤੋਂ ਦਿਸ਼ਾ ਜਾਂ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਕੱਢੋ।"], resultLine: `ਰਸਤੇ ਦਾ ਸਹੀ ਨਤੀਜਾ: ${answerSentence}` };
  }
  if (["DIR-QL-011", "DIR-QL-012", "DIR-QL-013", "DIR-QL-014", "DIR-QL-015", "DIR-QL-036", "DIR-QL-037", "DIR-QL-044"].includes(qlId)) {
    return { ...base, steps: ["ਇੱਕ ਬਿੰਦੂ ਨੂੰ ਪੱਕਾ ਮੰਨ ਕੇ ਬਾਕੀ ਬਿੰਦੂ ਕ੍ਰਮਵਾਰ ਰੱਖੋ।", qlId === "DIR-QL-037" ? "ਹਰ ਵਾਧੂ ਕਥਨ ਨੂੰ ਵੱਖਰਾ ਹਟਾ ਕੇ ਬਾਕੀ ਬਣਤਰ ਦਾ ਮੇਲ ਜਾਂਚੋ।" : "ਵੱਖ-ਵੱਖ ਰਸਤਿਆਂ ਤੋਂ ਮਿਲੀਆਂ ਥਾਵਾਂ ਆਪਸ ਵਿੱਚ ਮੇਲ ਖਾਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।", "ਹੁਣ ਪੁੱਛੇ ਗਏ ਬਿੰਦੂਆਂ ਦਾ ਆਪਸੀ ਸੰਬੰਧ ਪੜ੍ਹੋ।"], resultLine: `ਬਣਤਰ ਤੋਂ ਮਿਲਿਆ ਉੱਤਰ: ${answerSentence}` };
  }
  if (["DIR-QL-016", "DIR-QL-017", "DIR-QL-018", "DIR-QL-019", "DIR-QL-020", "DIR-QL-021", "DIR-QL-022"].includes(qlId)) {
    return { ...base, steps: ["ਸਾਰੀਆਂ ਅੰਤਿਮ ਥਾਵਾਂ ਨੂੰ ਇੱਕੋ ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ-ਫਰੇਮ ਵਿੱਚ ਰੱਖੋ।", "ਸਵਾਲ ਅਨੁਸਾਰ ਦਿਸ਼ਾ, ਦੂਰੀ, ਸਭ ਤੋਂ ਅੱਗੇ/ਪਿੱਛੇ ਥਾਂ ਜਾਂ ਇੱਕੋ ਥਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।"], resultLine: `ਅੰਤਿਮ ਥਾਵਾਂ ਦੀ ਤੁਲਨਾ ਦਾ ਨਤੀਜਾ: ${answerSentence}` };
  }
  if (["DIR-QL-023", "DIR-QL-024", "DIR-QL-025", "DIR-QL-026", "DIR-QL-027", "DIR-QL-028", "DIR-QL-029"].includes(qlId)) {
    return { ...base, steps: ["ਚਿੰਨ੍ਹ ਵਾਲੇ ਕਥਨ ਨੂੰ ਪਹਿਲਾ ਨਾਮ–ਚਿੰਨ੍ਹ–ਦੂਜਾ ਨਾਮ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹੋ।", qlId === "DIR-QL-025" || qlId === "DIR-QL-028" ? "ਸੰਭਵ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜਾਂਚੋ ਅਤੇ ਸਿਰਫ਼ ਮੇਲ ਖਾਂਦਾ ਵਿਕਲਪ ਰੱਖੋ।" : "ਚਿੰਨ੍ਹਾਂ ਤੋਂ ਮਿਲੇ ਸੰਬੰਧਾਂ ਜਾਂ ਚਾਲਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਜੋੜੋ।"], resultLine: `ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਸਮਝਣ ਤੋਂ ਬਾਅਦ ਸਹੀ ਉੱਤਰ: ${answerSentence}` };
  }
  if (["DIR-QL-030", "DIR-QL-031", "DIR-QL-032", "DIR-QL-033", "DIR-QL-034", "DIR-QL-035"].includes(qlId)) {
    return { ...base, steps: ["ਪਹਿਲਾਂ ਸਮੇਂ ਤੋਂ ਸੂਰਜ ਅਤੇ ਪਰਛਾਂਵਾਂ ਦੀ ਅਸਲ ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ।", "ਫਿਰ ਵਿਅਕਤੀ ਦੇ ਮੂੰਹ ਦੇ ਹਿਸਾਬ ਨਾਲ ਖੱਬਾ, ਸੱਜਾ, ਸਾਹਮਣੇ ਜਾਂ ਪਿੱਛੇ ਵਾਲਾ ਸੰਬੰਧ ਲਗਾਓ।", qlId === "DIR-QL-034" ? "ਅੰਤ ਵਿੱਚ ਦਿੱਤੇ ਮੋੜ ਕ੍ਰਮਵਾਰ ਲਗਾਓ।" : "ਦਿੱਤੇ ਵਿਅਕਤੀ-ਸੰਬੰਧ ਤੋਂ ਅੰਤਿਮ ਮੂੰਹ-ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ।"], resultLine: `ਸੂਰਜ ਅਤੇ ਪਰਛਾਂਵਾਂ ਦੇ ਸੰਕੇਤ ਤੋਂ ਉੱਤਰ: ${answerSentence}` };
  }
  if (["DIR-QL-038", "DIR-QL-039", "DIR-QL-040"].includes(qlId)) {
    return { ...base, steps: ["ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਜਾਣੀਆਂ ਚਾਲਾਂ ਲਗਾਓ।", "ਹਰ ਸੰਭਵ ਦਿਸ਼ਾ, ਮੋੜ ਜਾਂ ਸ਼ੁਰੂਆਤੀ ਮੂੰਹ ਨੂੰ ਵੱਖ-ਵੱਖ ਪਰਖੋ।", "ਜੋ ਇਕੱਲਾ ਵਿਕਲਪ ਦਿੱਤੀ ਅੰਤਿਮ ਥਾਂ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ, ਉਹੀ ਸਹੀ ਹੈ।"], resultLine: `ਇਕੱਲਾ ਮੇਲ ਖਾਂਦਾ ਉੱਤਰ: ${answerSentence}` };
  }
  if (["DIR-QL-041", "DIR-QL-042", "DIR-QL-043"].includes(qlId)) {
    return { ...base, steps: ["ਪਹਿਲਾਂ ਸ਼ੁਰੂਆਤੀ ਥਾਂ ਜਾਂ ਚੌਕੀ ਦੇ ਹਿਸਾਬ ਨਾਲ ਸ਼ੁੱਧ ਲੰਬਕਾਰੀ ਅਤੇ ਅੱਡੇ ਹਿੱਸੇ ਕੱਢੋ।", qlId === "DIR-QL-043" ? "ਇਨ੍ਹਾਂ ਹਿੱਸਿਆਂ ਉੱਤੇ ਪਾਇਥਾਗੋਰਸ ਨਿਯਮ ਲਗਾ ਕੇ ਸਿੱਧੀ ਦੂਰੀ ਕੱਢੋ।" : "ਹਿੱਸਿਆਂ ਦੇ ਚਿੰਨ੍ਹਾਂ ਤੋਂ ਦਿਸ਼ਾ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਮਾਪ ਤੋਂ ਦੂਰੀ ਤੈਅ ਕਰੋ।"], resultLine: `ਸਾਂਝੀ ਗਿਣਤੀ ਦਾ ਨਤੀਜਾ: ${answerSentence}` };
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
