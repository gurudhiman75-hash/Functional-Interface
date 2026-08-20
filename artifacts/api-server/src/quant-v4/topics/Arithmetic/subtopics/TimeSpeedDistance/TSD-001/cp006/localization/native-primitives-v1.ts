import type { Rational } from "../../foundation/rational";
import { formatExamNumber } from "../../cp003/generation-support";

export type TsdCp006NativeLanguage = "hi" | "pa";
export type TsdCp006NativePair = Readonly<{ hi: string; pa: string }>;
const pair = (hi: string, pa: string): TsdCp006NativePair => Object.freeze({ hi, pa });
export const pickCp006Native = (language: TsdCp006NativeLanguage, value: TsdCp006NativePair): string => value[language];

const OBJECTS: Readonly<Record<string, TsdCp006NativePair>> = Object.freeze({
  Runner: pair("धावक", "ਧਾਵਕ"),
  Athlete: pair("एथलीट", "ਐਥਲੀਟ"),
  Cadet: pair("कैडेट", "ਕੈਡੇਟ"),
  Trainee: pair("प्रशिक्षु", "ਪ੍ਰਸ਼ਿਕਸ਼ੂ"),
  Jogger: pair("जॉगर", "ਜੌਗਰ"),
  Walker: pair("वॉकर", "ਵਾਕਰ"),
  Competitor: pair("प्रतियोगी", "ਮੁਕਾਬਲੇਬਾਜ਼"),
  Participant: pair("प्रतिभागी", "ਭਾਗੀਦਾਰ"),
  Recruit: pair("भर्ती प्रशिक्षु", "ਭਰਤੀ ਪ੍ਰਸ਼ਿਕਸ਼ੂ"),
  Player: pair("खिलाड़ी", "ਖਿਡਾਰੀ"),
  Student: pair("विद्यार्थी", "ਵਿਦਿਆਰਥੀ"),
  Racer: pair("रेसर", "ਰੇਸਰ"),
  "Club runner": pair("क्लब धावक", "ਕਲੱਬ ਧਾਵਕ"),
  "Track athlete": pair("ट्रैक एथलीट", "ਟਰੈਕ ਐਥਲੀਟ"),
  "Academy trainee": pair("अकादमी प्रशिक्षु", "ਅਕੈਡਮੀ ਪ੍ਰਸ਼ਿਕਸ਼ੂ"),
  "Fitness walker": pair("फिटनेस वॉकर", "ਫਿਟਨੈੱਸ ਵਾਕਰ"),
  "Sports cadet": pair("खेल कैडेट", "ਖੇਡ ਕੈਡੇਟ"),
  "Practice runner": pair("अभ्यास धावक", "ਅਭਿਆਸ ਧਾਵਕ"),
});

const ROUTES: Readonly<Record<string, TsdCp006NativePair>> = Object.freeze({
  "circular track": pair("वृत्ताकार ट्रैक", "ਗੋਲ ਟਰੈਕ"),
  "closed running track": pair("बंद रनिंग ट्रैक", "ਬੰਦ ਦੌੜ ਟਰੈਕ"),
  "stadium loop": pair("स्टेडियम लूप", "ਸਟੇਡੀਅਮ ਲੂਪ"),
  "circular practice track": pair("वृत्ताकार अभ्यास ट्रैक", "ਗੋਲ ਅਭਿਆਸ ਟਰੈਕ"),
  "closed training loop": pair("बंद प्रशिक्षण लूप", "ਬੰਦ ਟ੍ਰੇਨਿੰਗ ਲੂਪ"),
  "athletics loop": pair("एथलेटिक्स लूप", "ਐਥਲੈਟਿਕਸ ਲੂਪ"),
});

export const cp006Num = (value: Rational): string => formatExamNumber(value);
export const cp006Metres = (value: Rational): string => `${cp006Num(value)} m`;
export const cp006Speed = (value: Rational): string => `${cp006Num(value)} m/min`;
export const cp006Minutes = (value: Rational, language: TsdCp006NativeLanguage): string => `${cp006Num(value)} ${language === "hi" ? "मिनट" : "ਮਿੰਟ"}`;

export function cp006NativeActor(objectFamily: string, body: "A" | "B" | "C", language: TsdCp006NativeLanguage): string {
  const value = OBJECTS[objectFamily];
  if (!value) throw new Error(`CP006 native object mapping missing: ${objectFamily}`);
  return `${pickCp006Native(language, value)} ${body}`;
}

export function cp006NativeRoute(routeFamily: string, language: TsdCp006NativeLanguage): string {
  const value = ROUTES[routeFamily];
  if (!value) throw new Error(`CP006 native route mapping missing: ${routeFamily}`);
  return pickCp006Native(language, value);
}

export function localizeCp006Choice(text: string, language: TsdCp006NativeLanguage): string {
  if (language === "hi") {
    return text.replace(/\bminutes?\b/g, "मिनट").replace(/\blaps?\b/g, "चक्कर");
  }
  return text.replace(/\bminutes?\b/g, "ਮਿੰਟ").replace(/\blaps?\b/g, "ਚੱਕਰ");
}

export function assertTsdCp006NativeText(text: string, language: TsdCp006NativeLanguage, label: string): void {
  if (!text.trim()) throw new Error(`${label}: native text is empty`);
  if (/\{[^}]+\}/u.test(text)) throw new Error(`${label}: unresolved placeholder remains`);
  if (language === "hi" && /[\u0A00-\u0A7F]/u.test(text)) throw new Error(`${label}: Punjabi script leaked into Hindi`);
  if (language === "pa" && /[\u0900-\u097F]/u.test(text)) throw new Error(`${label}: Devanagari leaked into Punjabi`);
}
