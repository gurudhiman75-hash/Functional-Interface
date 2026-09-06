import { createHash } from "node:crypto";

export const ARG_CP015_LOCALIZED_TWO_ARGUMENT_POLISH_AUTHORITY = "ARG_CP015_LOCALIZED_TWO_ARGUMENT_SURFACE_POLISH_V1" as const;

type Question = Readonly<Record<string, any>>;

function polishHindi(value: string): string {
  return value
    .replaceAll("देर से पहुँचने वाले आवेदकों हमेशा", "देर से पहुँचने वाले आवेदक हमेशा")
    .replaceAll("हर प्रकार का अनजाने उल्लंघनों समाप्त होने की गारंटी", "हर प्रकार के अनजाने उल्लंघन समाप्त हो जाएँ, इसकी गारंटी")
    .replaceAll("डाक पता में", "डाक पते में");
}

function polishPunjabi(value: string): string {
  return value
    .replace(/ਮੁਲਾਂਕਣ-ਮਾਰਗਦਰਸ਼ਨ ਨੋਟਸ([^।.!?]*?)ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ/g, "ਮੁਲਾਂਕਣ-ਮਾਰਗਦਰਸ਼ਨ ਨੋਟਸ$1ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ")
    .replaceAll("ਡਾਕ ਪਤਾ ਵਿੱਚ", "ਡਾਕ ਪਤੇ ਵਿੱਚ");
}

function rebuildStem(locale: string, statement: string, argumentsList: readonly string[]): string {
  const statementLabel = locale === "hi-IN" ? "कथन" : "ਕਥਨ";
  const argumentsLabel = locale === "hi-IN" ? "तर्क" : "ਦਲੀਲਾਂ";
  return `${statementLabel}: ${statement}\n${argumentsLabel}:\nI. ${argumentsList[0]}\nII. ${argumentsList[1]}`;
}

export function polishArgCp015LocalizedTwoArgumentSurface(question: Question): Question {
  const locale = String(question.locale ?? "");
  if (locale !== "hi-IN" && locale !== "pa-IN") return question;
  const sourceArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (sourceArguments.length !== 2) return question;

  const polish = locale === "hi-IN" ? polishHindi : polishPunjabi;
  const sourceStatement = String(question.statement ?? "");
  const sourceExplanation = String(question.explanation ?? "");
  const statement = polish(sourceStatement);
  const argumentsList = Object.freeze(sourceArguments.map((argument) => polish(String(argument))));
  const explanation = polish(sourceExplanation);

  const changed = statement !== sourceStatement
    || explanation !== sourceExplanation
    || argumentsList.some((argument, index) => argument !== String(sourceArguments[index] ?? ""));
  if (!changed) return question;

  const stem = rebuildStem(locale, statement, argumentsList);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_LOCALIZED_TWO_ARGUMENT_POLISH_AUTHORITY,
    question.contentFingerprint,
    question.qlId,
    question.templateId,
    question.examProfile,
    locale,
    statement,
    argumentsList,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement,
    arguments: argumentsList,
    explanation,
    stem,
    text: stem,
    preLocalizedTwoArgumentPolishStatement: sourceStatement,
    preLocalizedTwoArgumentPolishExplanation: sourceExplanation,
    localizedTwoArgumentPolishAuthority: ARG_CP015_LOCALIZED_TWO_ARGUMENT_POLISH_AUTHORITY,
    questionId: `ARG-001:${question.qlId}:${String(question.examProfile ?? "core")}:${locale}:CP015:${contentFingerprint.slice(0, 20)}`,
    contentFingerprint,
  });
}
