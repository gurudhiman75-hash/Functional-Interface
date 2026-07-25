import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";

export function applyAvg001Cp003LocalizedStemFinalPolish(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-003") return pkg;

  let stem = pkg.stem;
  if (language === "hi") {
    if (pkg.questionLanguageId === "AVG-QL-123") {
      stem = stem.replace(
        /एक नई संख्या ([\d,.]+) को समूह में जोड़ दिया जाता है।/,
        "समूह में $1 जोड़ दिया जाता है।",
      );
    }
    if (pkg.questionLanguageId === "AVG-QL-165") {
      stem = stem.replace(/औसत (₹[\d,.]+) हो जाता है/, "औसत दैनिक बिक्री $1 हो जाती है");
    }
    if (pkg.questionLanguageId === "AVG-QL-401" || pkg.questionLanguageId === "AVG-QL-405") {
      stem = stem.replace("रन का औसत", "टीम का औसत स्कोर");
    }
  } else {
    if (pkg.questionLanguageId === "AVG-QL-123") {
      stem = stem.replace(
        /ਇੱਕ ਨਵੀਂ ਸੰਖਿਆ ([\d,.]+) ਨੂੰ ਸਮੂਹ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।/,
        "ਸਮੂਹ ਵਿੱਚ $1 ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।",
      );
    }
    if (pkg.questionLanguageId === "AVG-QL-135") {
      stem = stem.replace("ਦਰਜ ਮੁੱਲਾਂ", "ਦਰਜ ਮਾਪਾਂ").replace("ਇੱਕ ਵਾਧੂ ਮੁੱਲ", "ਇੱਕ ਵਾਧੂ ਮਾਪ");
    }
    if (pkg.questionLanguageId === "AVG-QL-147") {
      stem = stem.replace("ਦਰਜ ਮੁੱਲਾਂ", "ਦਰਜ ਮਾਪਾਂ").replace("ਵਾਲਾ ਇੱਕ ਮੁੱਲ", "ਵਾਲਾ ਇੱਕ ਮਾਪ").replace("ਬਾਕੀ ਮੁੱਲਾਂ", "ਬਾਕੀ ਮਾਪਾਂ");
    }
    if (pkg.questionLanguageId === "AVG-QL-156") {
      stem = stem.replace(/([\d,.]+) ਦੀ ਗਲਤ ਦਰਜ ਕੀਤੀ ਕੀਮਤ ਦੀ ਥਾਂ ([\d,.]+) ਦਰਜ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।/, "$1 ਦਾ ਗਲਤ ਦਰਜ ਮਾਪ $2 ਨਾਲ ਠੀਕ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।");
    }
    if (pkg.questionLanguageId === "AVG-QL-160") {
      stem = stem.replace("ਦਰਜ ਮੁੱਲਾਂ", "ਦਰਜ ਮਾਪਾਂ").replace("ਵਾਲੇ ਮੁੱਲ ਨੂੰ", "ਵਾਲੇ ਮਾਪ ਨੂੰ");
    }
    if (pkg.questionLanguageId === "AVG-QL-165") {
      stem = stem.replace(/ਔਸਤ (₹[\d,.]+) ਹੋ ਜਾਂਦੀ ਹੈ/, "ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ $1 ਹੋ ਜਾਂਦੀ ਹੈ");
    }
    if (pkg.questionLanguageId === "AVG-QL-401" || pkg.questionLanguageId === "AVG-QL-405") {
      stem = stem.replace("ਦੌੜਾਂ ਦੀ ਔਸਤ", "ਟੀਮ ਦਾ ਔਸਤ ਸਕੋਰ");
    }
  }

  return stem === pkg.stem
    ? pkg
    : {
        ...pkg,
        stem,
        traceability: {
          ...pkg.traceability,
          cp003StemFinalPolish: "AVG-CP-003 manual language polish v2",
        },
      };
}
