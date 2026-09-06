import { createHash } from "node:crypto";

export const ARG_CP015_LOCALIZED_COMBO_RESIDUAL_POLISH_AUTHORITY = "ARG_CP015_LOCALIZED_COMBO_RESIDUAL_POLISH_V1" as const;

type Question = Readonly<Record<string, any>>;

const ROMAN = ["I", "II", "III", "IV"] as const;

function polishHindi(value: string): string {
  return value
    .replaceAll("स्थान ट्रैकिंग कौन-सा डेटा एकत्र करता है, क्यों करता है", "स्थान ट्रैकिंग कौन-सा डेटा एकत्र करती है, क्यों करती है")
    .replaceAll("स्थान ट्रैकिंग कौन-सा डेटा एकत्र करता है", "स्थान ट्रैकिंग कौन-सा डेटा एकत्र करती है")
    .replaceAll("स्थान ट्रैकिंग क्यों करता है", "स्थान ट्रैकिंग क्यों करती है")
    .replaceAll("लगातार स्क्रीन रिकॉर्डिंग कौन-सा डेटा एकत्र करता है, क्यों करता है", "लगातार स्क्रीन रिकॉर्डिंग कौन-सा डेटा एकत्र करती है, क्यों करती है")
    .replaceAll("लगातार स्क्रीन रिकॉर्डिंग कौन-सा डेटा एकत्र करता है", "लगातार स्क्रीन रिकॉर्डिंग कौन-सा डेटा एकत्र करती है")
    .replaceAll("लगातार स्क्रीन रिकॉर्डिंग क्यों करता है", "लगातार स्क्रीन रिकॉर्डिंग क्यों करती है")
    .replaceAll("स्थान ट्रैकिंग कैसे काम करता है", "स्थान ट्रैकिंग कैसे काम करती है")
    .replaceAll("लगातार स्क्रीन रिकॉर्डिंग कैसे काम करता है", "लगातार स्क्रीन रिकॉर्डिंग कैसे काम करती है");
}

function polishPunjabi(value: string): string {
  return value
    .replaceAll("ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ, ਕਿਉਂ ਕਰਦਾ ਹੈ", "ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦੀ ਹੈ, ਕਿਉਂ ਕਰਦੀ ਹੈ")
    .replaceAll("ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ", "ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦੀ ਹੈ")
    .replaceAll("ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ ਕਿਉਂ ਕਰਦਾ ਹੈ", "ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ ਕਿਉਂ ਕਰਦੀ ਹੈ")
    .replaceAll("ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ, ਕਿਉਂ ਕਰਦਾ ਹੈ", "ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦੀ ਹੈ, ਕਿਉਂ ਕਰਦੀ ਹੈ")
    .replaceAll("ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ", "ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦੀ ਹੈ")
    .replaceAll("ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਕਿਉਂ ਕਰਦਾ ਹੈ", "ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਕਿਉਂ ਕਰਦੀ ਹੈ")
    .replaceAll("ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ", "ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ")
    .replaceAll("ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ", "ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ");
}

function rebuildStem(locale: string, statement: string, argumentsList: readonly string[]): string {
  const statementLabel = locale === "hi-IN" ? "कथन" : "ਕਥਨ";
  const argumentsLabel = locale === "hi-IN" ? "तर्क" : "ਦਲੀਲਾਂ";
  return `${statementLabel}: ${statement}\n${argumentsLabel}:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
}

export function polishArgCp015ResidualLocalizedComboSurface(question: Question): Question {
  const locale = String(question.locale ?? "");
  if (locale !== "hi-IN" && locale !== "pa-IN") return question;
  const sourceArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  if (sourceArguments.length < 3) return question;

  const polish = locale === "hi-IN" ? polishHindi : polishPunjabi;
  const sourceStatement = String(question.statement ?? "");
  const sourceExplanation = String(question.explanation ?? "");
  const statement = polish(sourceStatement);
  const argumentsList = Object.freeze(sourceArguments.map((argument) => polish(String(argument))));
  const explanation = polish(sourceExplanation);

  const changed = statement !== sourceStatement
    || explanation !== sourceExplanation
    || argumentsList.some((argument, index) => argument !== String(sourceArguments[index] ?? ""));
  if (!changed) {
    return Object.freeze({
      ...question,
      localizedComboResidualPolishAuthority: ARG_CP015_LOCALIZED_COMBO_RESIDUAL_POLISH_AUTHORITY,
    });
  }

  const stem = rebuildStem(locale, statement, argumentsList);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_LOCALIZED_COMBO_RESIDUAL_POLISH_AUTHORITY,
    question.contentFingerprint,
    question.qlId,
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
    localizedComboResidualPolishAuthority: ARG_CP015_LOCALIZED_COMBO_RESIDUAL_POLISH_AUTHORITY,
    questionId: `ARG-001:${question.qlId}:${String(question.examProfile ?? "core")}:${locale}:CP015:${contentFingerprint.slice(0, 20)}`,
    contentFingerprint,
  });
}
