import {
  assertStaV4QuestionIntegrity,
  generateStaV4Question as generateStaV4R5Question,
} from "./exam-realness-v4-1-learner-r5-runtime.ts";
import type {
  GenerateStaV4QuestionInput,
  StaV4Language,
  StaV4Question,
} from "./exam-realness-v4-1-types.ts";

export * from "./exam-realness-v4-1-learner-r5-runtime.ts";

function finalHindi(text: string): string {
  return text
    .replace(/^सेवा का अनुमान है कि (“[^”]+”) अपनाने से “दोबारा आने की जरूरत कम होना” वाला परिणाम मिलेगा।$/u, "सेवा को उम्मीद है कि $1 अपनाने से दोबारा आने की जरूरत कम होगी।")
    .replace(/^सेवा का अनुमान है कि (“[^”]+”) अपनाने से (“[^”]+”) वाला परिणाम मिलेगा।$/u, "सेवा को उम्मीद है कि $1 अपनाने से सुधार होगा, जो $2 के रूप में दिखेगा।")
    .replace(/^प्रचारित (“[^”]+”) (“[^”]+”) उत्पन्न करने से संबंधित है।$/u, "प्रचारित $1 का उपयोग बताए गए लाभ—$2—से उचित रूप से जुड़ा है।")
    .replace(/^प्रचारित (“[^”]+”) का (“[^”]+”) से उचित संबंध है।$/u, "प्रचारित $1 का उपयोग बताए गए लाभ—$2—से उचित रूप से जुड़ा है।");
}

function finalPunjabi(text: string): string {
  return text
    .replace(/^ਸੇਵਾ ਦਾ ਅਨੁਮਾਨ ਹੈ ਕਿ (“[^”]+”) ਅਪਣਾਉਣ ਨਾਲ “ਮੁੜ ਆਉਣ ਦੀ ਲੋੜ ਘਟਣਾ” ਵਾਲਾ ਨਤੀਜਾ ਮਿਲੇਗਾ।$/u, "ਸੇਵਾ ਨੂੰ ਉਮੀਦ ਹੈ ਕਿ $1 ਅਪਣਾਉਣ ਨਾਲ ਮੁੜ ਆਉਣ ਦੀ ਲੋੜ ਘਟੇਗੀ।")
    .replace(/^ਸੇਵਾ ਦਾ ਅਨੁਮਾਨ ਹੈ ਕਿ (“[^”]+”) ਅਪਣਾਉਣ ਨਾਲ (“[^”]+”) ਵਾਲਾ ਨਤੀਜਾ ਮਿਲੇਗਾ।$/u, "ਸੇਵਾ ਨੂੰ ਉਮੀਦ ਹੈ ਕਿ $1 ਅਪਣਾਉਣ ਨਾਲ ਸੁਧਾਰ ਹੋਵੇਗਾ, ਜੋ $2 ਦੇ ਰੂਪ ਵਿੱਚ ਦਿਖੇਗਾ।")
    .replace(/^ਪ੍ਰਚਾਰਿਤ (“[^”]+”) (“[^”]+”) ਪੈਦਾ ਕਰਨ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।$/u, "ਪ੍ਰਚਾਰਿਤ $1 ਦੀ ਵਰਤੋਂ ਦੱਸੇ ਲਾਭ—$2—ਨਾਲ ਵਾਜਬ ਤੌਰ ਤੇ ਜੁੜੀ ਹੈ।")
    .replace(/^ਪ੍ਰਚਾਰਿਤ (“[^”]+”) ਦਾ (“[^”]+”) ਨਾਲ ਵਾਜਬ ਸੰਬੰਧ ਹੈ।$/u, "ਪ੍ਰਚਾਰਿਤ $1 ਦੀ ਵਰਤੋਂ ਦੱਸੇ ਲਾਭ—$2—ਨਾਲ ਵਾਜਬ ਤੌਰ ਤੇ ਜੁੜੀ ਹੈ।");
}

function finalPolish(text: string, language: StaV4Language): string {
  if (language === "hi") return finalHindi(text);
  if (language === "pa") return finalPunjabi(text);
  return text;
}

export function generateStaV4Question(input: GenerateStaV4QuestionInput): StaV4Question {
  const r5 = generateStaV4R5Question(input);
  if (r5.language === "en") return r5;

  const candidates = r5.candidates.map((candidate) => Object.freeze({
    ...candidate,
    text: finalPolish(candidate.text, r5.language),
  }));
  const question = Object.freeze({
    ...r5,
    statement: finalPolish(r5.statement, r5.language),
    candidates: Object.freeze(candidates),
    explanation: finalPolish(r5.explanation, r5.language),
  }) as StaV4Question;
  assertStaV4QuestionIntegrity(question);
  return question;
}
