import type { Avg001QuestionPackage } from "./types";

type PilotLanguage = "hi" | "pa";

export function applyAvg001LocalizedStemVariation(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-002") return pkg;
  const id = Number(pkg.questionLanguageId.slice(-3));
  let stem = pkg.stem;

  if (language === "hi") {
    if (id === 80) stem = stem.replace("उनका औसत क्या है?", "इन मानों का औसत निकालिए।");
    if (id === 116) stem = stem.replace("उनका औसत क्या है?", "औसत निर्धारित कीजिए।");
    if (id === 122) stem = stem.replace("उनका औसत क्या है?", "समूह का औसत बताइए।");
    if (id === 83) stem = stem.replace("सूची का औसत ज्ञात कीजिए।", "इन क्रमबद्ध मानों का औसत निकालिए।");
    if (id === 113) stem = stem.replace("सूची का औसत ज्ञात कीजिए।", "दिए गए क्रम का औसत निर्धारित कीजिए।");
    if (id === 119) stem = stem.replace("सूची का औसत ज्ञात कीजिए।", "सभी मानों का औसत बताइए।");
  } else {
    if (id === 80) stem = stem.replace("ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਕੀ ਹੈ?", "ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ਕੱਢੋ।");
    if (id === 116) stem = stem.replace("ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਕੀ ਹੈ?", "ਔਸਤ ਨਿਰਧਾਰਤ ਕਰੋ।");
    if (id === 122) stem = stem.replace("ਉਨ੍ਹਾਂ ਦੀ ਔਸਤ ਕੀ ਹੈ?", "ਸਮੂਹ ਦੀ ਔਸਤ ਦੱਸੋ।");
    if (id === 83) stem = stem.replace("ਸੂਚੀ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।", "ਇਨ੍ਹਾਂ ਤਰਤੀਬਵਾਰ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ਕੱਢੋ।");
    if (id === 113) stem = stem.replace("ਸੂਚੀ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।", "ਦਿੱਤੇ ਕ੍ਰਮ ਦੀ ਔਸਤ ਨਿਰਧਾਰਤ ਕਰੋ।");
    if (id === 119) stem = stem.replace("ਸੂਚੀ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।", "ਸਾਰੇ ਮੁੱਲਾਂ ਦੀ ਔਸਤ ਦੱਸੋ।");
  }

  return stem === pkg.stem ? pkg : { ...pkg, stem };
}
