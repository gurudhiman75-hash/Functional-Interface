import type { StcOrderScenarioAuthority } from "./types.ts";
import { orderClaim } from "./strict-order-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_CP003_ORDER_AUTHORITIES: readonly StcOrderScenarioAuthority[] = [
  {
    id: "STC-SC-017",
    qlId: "STC-QL-005",
    difficulty: "MEDIUM",
    statement: t("Ravi scored more marks than Aman, and Aman scored more marks than Karan.", "रवि ने अमन से अधिक अंक प्राप्त किए और अमन ने करण से अधिक अंक प्राप्त किए।", "ਰਵੀ ਨੇ ਅਮਨ ਨਾਲੋਂ ਵੱਧ ਅੰਕ ਲਏ ਅਤੇ ਅਮਨ ਨੇ ਕਰਨ ਨਾਲੋਂ ਵੱਧ ਅੰਕ ਲਏ।"),
    premises: [orderClaim("marks", "ravi", "aman"), orderClaim("marks", "aman", "karan")],
    candidates: [
      { id: "C1", claim: orderClaim("marks", "ravi", "karan"), text: t("Ravi scored more marks than Karan.", "रवि ने करण से अधिक अंक प्राप्त किए।", "ਰਵੀ ਨੇ ਕਰਨ ਨਾਲੋਂ ਵੱਧ ਅੰਕ ਲਏ।") },
      { id: "C2", claim: orderClaim("marks", "ravi", "aman"), text: t("Ravi scored more marks than Aman.", "रवि ने अमन से अधिक अंक प्राप्त किए।", "ਰਵੀ ਨੇ ਅਮਨ ਨਾਲੋਂ ਵੱਧ ਅੰਕ ਲਏ।") },
      { id: "C3", claim: orderClaim("marks", "karan", "ravi"), text: t("Karan scored more marks than Ravi.", "करण ने रवि से अधिक अंक प्राप्त किए।", "ਕਰਨ ਨੇ ਰਵੀ ਨਾਲੋਂ ਵੱਧ ਅੰਕ ਲਏ।"), defectIfNotEntailed: "REVERSED_ORDER" },
      { id: "C4", claim: orderClaim("marks", "meena", "aman"), text: t("Meena scored more marks than Aman.", "मीना ने अमन से अधिक अंक प्राप्त किए।", "ਮੀਨਾ ਨੇ ਅਮਨ ਨਾਲੋਂ ਵੱਧ ਅੰਕ ਲਏ।"), defectIfNotEntailed: "UNRELATED_ENTITY" },
    ],
  },
  {
    id: "STC-SC-018",
    qlId: "STC-QL-005",
    difficulty: "HARD",
    statement: t("Task P has higher processing priority than Task Q, while Task Q has higher priority than Task R.", "कार्य P की प्रसंस्करण प्राथमिकता कार्य Q से अधिक है, जबकि कार्य Q की प्राथमिकता कार्य R से अधिक है।", "ਟਾਸਕ P ਦੀ ਪ੍ਰੋਸੈਸਿੰਗ ਤਰਜੀਹ ਟਾਸਕ Q ਨਾਲੋਂ ਉੱਚੀ ਹੈ, ਜਦਕਿ ਟਾਸਕ Q ਦੀ ਤਰਜੀਹ ਟਾਸਕ R ਨਾਲੋਂ ਉੱਚੀ ਹੈ।"),
    premises: [orderClaim("priority", "p", "q"), orderClaim("priority", "q", "r")],
    candidates: [
      { id: "C1", claim: orderClaim("priority", "p", "r"), text: t("Task P has higher priority than Task R.", "कार्य P की प्राथमिकता कार्य R से अधिक है।", "ਟਾਸਕ P ਦੀ ਤਰਜੀਹ ਟਾਸਕ R ਨਾਲੋਂ ਉੱਚੀ ਹੈ।") },
      { id: "C2", claim: orderClaim("priority", "q", "r"), text: t("Task Q has higher priority than Task R.", "कार्य Q की प्राथमिकता कार्य R से अधिक है।", "ਟਾਸਕ Q ਦੀ ਤਰਜੀਹ ਟਾਸਕ R ਨਾਲੋਂ ਉੱਚੀ ਹੈ।") },
      { id: "C3", claim: orderClaim("priority", "r", "p"), text: t("Task R has higher priority than Task P.", "कार्य R की प्राथमिकता कार्य P से अधिक है।", "ਟਾਸਕ R ਦੀ ਤਰਜੀਹ ਟਾਸਕ P ਨਾਲੋਂ ਉੱਚੀ ਹੈ।"), defectIfNotEntailed: "REVERSED_ORDER" },
      { id: "C4", claim: orderClaim("speed", "p", "r"), text: t("Task P is processed faster than Task R.", "कार्य P का प्रसंस्करण कार्य R से तेज़ है।", "ਟਾਸਕ P ਦੀ ਪ੍ਰੋਸੈਸਿੰਗ ਟਾਸਕ R ਨਾਲੋਂ ਤੇਜ਼ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_RELATION" },
    ],
  },
  {
    id: "STC-SC-019",
    qlId: "STC-QL-005",
    difficulty: "MEDIUM",
    statement: t("Building A is taller than Building B, and Building B is taller than Building C.", "भवन A, भवन B से ऊँचा है और भवन B, भवन C से ऊँचा है।", "ਇਮਾਰਤ A, ਇਮਾਰਤ B ਨਾਲੋਂ ਉੱਚੀ ਹੈ ਅਤੇ ਇਮਾਰਤ B, ਇਮਾਰਤ C ਨਾਲੋਂ ਉੱਚੀ ਹੈ।"),
    premises: [orderClaim("height", "a", "b"), orderClaim("height", "b", "c")],
    candidates: [
      { id: "C1", claim: orderClaim("height", "a", "c"), text: t("Building A is taller than Building C.", "भवन A, भवन C से ऊँचा है।", "ਇਮਾਰਤ A, ਇਮਾਰਤ C ਨਾਲੋਂ ਉੱਚੀ ਹੈ।") },
      { id: "C2", claim: orderClaim("height", "b", "c"), text: t("Building B is taller than Building C.", "भवन B, भवन C से ऊँचा है।", "ਇਮਾਰਤ B, ਇਮਾਰਤ C ਨਾਲੋਂ ਉੱਚੀ ਹੈ।") },
      { id: "C3", claim: orderClaim("height", "c", "a"), text: t("Building C is taller than Building A.", "भवन C, भवन A से ऊँचा है।", "ਇਮਾਰਤ C, ਇਮਾਰਤ A ਨਾਲੋਂ ਉੱਚੀ ਹੈ।"), defectIfNotEntailed: "REVERSED_ORDER" },
      { id: "C4", claim: orderClaim("age", "a", "c"), text: t("Building A is older than Building C.", "भवन A, भवन C से पुराना है।", "ਇਮਾਰਤ A, ਇਮਾਰਤ C ਨਾਲੋਂ ਪੁਰਾਣੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_RELATION" },
    ],
  },
  {
    id: "STC-SC-020",
    qlId: "STC-QL-005",
    difficulty: "HARD",
    statement: t("Route X has a higher toll than Route Y, and Route Y has a higher toll than Route Z.", "मार्ग X का टोल मार्ग Y से अधिक है और मार्ग Y का टोल मार्ग Z से अधिक है।", "ਰੂਟ X ਦਾ ਟੋਲ ਰੂਟ Y ਨਾਲੋਂ ਵੱਧ ਹੈ ਅਤੇ ਰੂਟ Y ਦਾ ਟੋਲ ਰੂਟ Z ਨਾਲੋਂ ਵੱਧ ਹੈ।"),
    premises: [orderClaim("toll", "x", "y"), orderClaim("toll", "y", "z")],
    candidates: [
      { id: "C1", claim: orderClaim("toll", "x", "z"), text: t("Route X has a higher toll than Route Z.", "मार्ग X का टोल मार्ग Z से अधिक है।", "ਰੂਟ X ਦਾ ਟੋਲ ਰੂਟ Z ਨਾਲੋਂ ਵੱਧ ਹੈ।") },
      { id: "C2", claim: orderClaim("toll", "x", "y"), text: t("Route X has a higher toll than Route Y.", "मार्ग X का टोल मार्ग Y से अधिक है।", "ਰੂਟ X ਦਾ ਟੋਲ ਰੂਟ Y ਨਾਲੋਂ ਵੱਧ ਹੈ।") },
      { id: "C3", claim: orderClaim("toll", "z", "x"), text: t("Route Z has a higher toll than Route X.", "मार्ग Z का टोल मार्ग X से अधिक है।", "ਰੂਟ Z ਦਾ ਟੋਲ ਰੂਟ X ਨਾਲੋਂ ਵੱਧ ਹੈ।"), defectIfNotEntailed: "REVERSED_ORDER" },
      { id: "C4", claim: orderClaim("distance", "x", "z"), text: t("Route X is longer than Route Z.", "मार्ग X, मार्ग Z से लंबा है।", "ਰੂਟ X, ਰੂਟ Z ਨਾਲੋਂ ਲੰਮਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_RELATION" },
    ],
  },
] as const;
