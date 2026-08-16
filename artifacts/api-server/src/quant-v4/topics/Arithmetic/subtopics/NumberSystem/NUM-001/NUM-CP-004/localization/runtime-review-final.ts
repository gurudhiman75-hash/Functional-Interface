import type { NumCp004PermanentQlId } from "../permanent/allocation";
import { runNumCp004LocalizedFinalForQl } from "./runtime-final";
import type { NumCp004LocalizedQuestion, NumCp004TranslatedLanguage } from "./types";

type State = Readonly<Record<string, unknown>>;

function math(value: string | number): string {
  return `\\(${String(value)}\\)`;
}

function integer(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`Expected integer ${label}`);
  return value;
}

function integers(value: unknown, label: string): number[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`Expected integer array ${label}`);
  }
  return [...value] as number[];
}

function set(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function structuralStem(
  question: NumCp004LocalizedQuestion,
  language: NumCp004TranslatedLanguage,
): string {
  const state = question.hiddenState as State;
  const mode = typeof state.mode === "string" ? state.mode : "";
  const hi = language === "hi";

  if (mode === "FACTOR_TREE") {
    const root = integer(state.root, "root");
    const right = integer(state.right, "right");
    const [left, second] = integers(state.children, "children");
    if (left === undefined || second === undefined) throw new Error("Expected two factor-tree children");
    return hi
      ? `एक गुणनखंड वृक्ष में ${math(`${root} \\to m \\times ${right}`)} है और गायब नोड ${math(`${left} \\times ${second}`)} में बँटता है। ${math("m")} क्या है?`
      : `ਇੱਕ ਗੁਣਨਖੰਡ ਦਰੱਖਤ ਵਿੱਚ ${math(`${root} \\to m \\times ${right}`)} ਹੈ ਅਤੇ ਗੁੰਮ ਨੋਡ ${math(`${left} \\times ${second}`)} ਵਿੱਚ ਵੰਡਦਾ ਹੈ। ${math("m")} ਕੀ ਹੈ?`;
  }

  if (mode === "DATA_SUFFICIENCY") {
    const candidates = integers(state.candidates, "candidates");
    const statementI = integers(state.statementI, "statementI");
    const statementII = integers(state.statementII, "statementII");
    return hi
      ? `एक अभाज्य संख्या ${math("p")} ${set(candidates)} में से चुनी गई है।\n\nकथन I के बाद संभावित मान ${set(statementI)} हैं।\nकथन II के बाद संभावित मान ${set(statementII)} हैं।\n\n${math("p")} को एकमात्र रूप से तय करने के लिए कौन-सा पर्याप्तता निष्कर्ष सही है?`
      : `ਇੱਕ ਅਭਾਜ ਸੰਖਿਆ ${math("p")} ${set(candidates)} ਵਿੱਚੋਂ ਚੁਣੀ ਗਈ ਹੈ।\n\nਕਥਨ I ਤੋਂ ਬਾਅਦ ਸੰਭਵ ਮੁੱਲ ${set(statementI)} ਹਨ।\nਕਥਨ II ਤੋਂ ਬਾਅਦ ਸੰਭਵ ਮੁੱਲ ${set(statementII)} ਹਨ।\n\n${math("p")} ਨੂੰ ਇਕੋ ਤਰ੍ਹਾਂ ਨਿਰਧਾਰਤ ਕਰਨ ਲਈ ਕਿਹੜਾ ਪਰਯਾਪਤਾ ਨਤੀਜਾ ਸਹੀ ਹੈ?`;
  }

  return question.stem;
}

export function runNumCp004LocalizedReviewFinalForQl(
  questionLanguageId: NumCp004PermanentQlId,
  seed: number,
  language: NumCp004TranslatedLanguage,
): NumCp004LocalizedQuestion {
  const question = runNumCp004LocalizedFinalForQl(questionLanguageId, seed, language);
  return Object.freeze({
    ...question,
    stem: structuralStem(question, language)
      .replaceAll("पर्याप्तता", "पर्याप्त जानकारी")
      .replaceAll("ਪਰਯਾਪਤਾ", "ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ"),
  });
}
