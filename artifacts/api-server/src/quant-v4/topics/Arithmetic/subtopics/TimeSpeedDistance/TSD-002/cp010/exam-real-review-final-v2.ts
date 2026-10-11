import type { TsdCp010ExecutableInput } from "./executable-types";
import {
  TSD_CP010_EXAM_REAL_ENGLISH_REVIEW as EN_V1,
  TSD_CP010_EXAM_REAL_HINDI_REVIEW as HI_V1,
  TSD_CP010_EXAM_REAL_PUNJABI_REVIEW as PA_V1,
  renderTsdCp010ExamRealStem,
  type TsdCp010ExamRealLanguage,
} from "./exam-real-review-final";

export type { TsdCp010ExamRealLanguage } from "./exam-real-review-final";

function refineEnglish(familyId: string, stem: string) {
  let out = stem;
  if (familyId === "116-B") out = out.replace("Find P's winning time.", "By how many seconds does P beat Q?");
  if (familyId === "117-B") out = out.replace("In the same race,", "In a race,");
  if (familyId === "118-D") out = out.replace(/Find the distance\.$/, "Find the race distance.");
  if (familyId === "119-B") out = out.replace("What time start should Q get for a dead heat?", "How many seconds before P should Q start so that both finish together?");
  if (familyId === "119-C") out = out.replace("so that neither wins?", "so that both finish together?");
  if (familyId === "119-D") out = out.replace(/Find the time handicap to be given against Ravi for an equal finish\.$/, "How many seconds later should Ravi start so that both finish together?");
  if (familyId === "120-B") out = out.replace("Find P's winning distance.", "By how many metres does P beat Q?");
  if (familyId === "121-A") out = out.replace(/^A beats B by (.+?) and B beats C by (.+?) in a (.+?) race\./, "In separate $3 races, A beats B by $1 and B beats C by $2.");
  if (familyId === "121-D") out = out.replace(/^In a (.+?) race, Ravi beats Sahil by (.+?); Sahil beats Vikas by (.+?)\./, "In separate $1 races, Ravi beats Sahil by $2 and Sahil beats Vikas by $3.");
  if (familyId === "121-E") out = out.replace("Find the Karan-Nitin winning margin.", "By how many metres does Karan beat Nitin?");
  if (familyId === "122-D") out = out.replace(/^The result of a (.+?) race is: Ravi beats Sahil by (.+?)\. For a (.+?) race, Sahil gets a (.+?) head start\. Find the final margin\.$/, "Ravi beats Sahil by $2 in a $1 race. In a $3 race, Sahil is given a start of $4. By how many metres does Ravi win?");
  if (familyId === "122-F") out = out.replace(/Deepak gets (.+?) start\./, "Deepak is given a start of $1.");
  if (familyId === "123-E") out = out.replace(/^In a (.+?) race, Mohan runs at (.+?) and loses (.+?) in rest time, while Karan runs continuously at (.+?)\./, "In a $1 race, Mohan runs at $2 but rests for a total of $3, while Karan runs continuously at $4.");
  if (familyId === "123-F") out = out.replace(/^Rohit gives Deepak a time start of (.+?) in a (.+?) race\./, "In a $2 race, Deepak starts $1 before Rohit.");
  if (familyId === "124-C") out = out.replace(/^The same Arun and Bharat race twice\. Arun wins (.+?) by (.+?) and (.+?) by (.+?)\./, "In a $1 race, Arun beats Bharat by $2; in a $3 race, Arun beats Bharat by $4.");
  if (familyId === "124-E") out = out.replace("Karan and Mohan keep the same speeds.", "Karan and Mohan keep their respective speeds unchanged.");
  return out;
}

function refineHindi(familyId: string, stem: string) {
  let out = stem
    .replaceAll("जीत का दूरी-अंतर", "जीत का अंतर")
    .replaceAll("दूरी-अंतर", "दूरी का अंतर")
    .replaceAll("जीत-अंतर", "जीत का अंतर")
    .replaceAll("समय-अंतर", "समय का अंतर");
  if (familyId === "115-E") out = out.replace("करण की जीत का अंतर ज्ञात कीजिए।", "करण, मोहन को कितने मीटर से हराएगा?");
  if (familyId === "116-B") out = out.replace("P की समय-बढ़त कितनी है?", "P, Q से कितने सेकंड पहले पहुँचेगा?");
  if (familyId === "117-F") out = out.replace(/^रोहित और दीपक समान दूरी दौड़ते हैं। रोहित का समय (.+?) है और जीत का समय का अंतर (.+?) है। गति-अनुपात ज्ञात कीजिए।$/, "रोहित वही दूरी $1 में पूरी करता है और दीपक, रोहित से $2 बाद पहुँचता है। उनकी गतियों का अनुपात ज्ञात कीजिए।");
  if (familyId === "118-D") out = out.replace(/दूरी ज्ञात कीजिए।$/, "दौड़ की दूरी ज्ञात कीजिए।");
  if (familyId === "119-C") out = out.replace("ताकि कोई न जीते?", "ताकि दोनों साथ पहुँचें?");
  if (familyId === "119-E") out = out.replace("मोहन कहाँ से शुरू करे", "मोहन कितने मीटर आगे से शुरू करे");
  if (familyId === "120-B") out = out.replace("जीत का अंतर ज्ञात कीजिए।", "P, Q को कितने मीटर से हराता है?");
  if (familyId === "121-A" || familyId === "121-D") out = out.replace(/^(.+? मीटर) की दौड़ में/, "$1 की अलग-अलग दौड़ों में");
  if (familyId === "121-B") out = out.replace("P की R पर जीत का अंतर ज्ञात कीजिए।", "P, R को कितने मीटर से हराएगा?");
  if (familyId === "121-E") out = out.replace("करण-नितिन जीत का अंतर ज्ञात कीजिए।", "करण, नितिन को कितने मीटर से हराएगा?");
  if (familyId === "122-B") out = out.replace("P की जीत का अंतर ज्ञात कीजिए।", "P कितने मीटर से जीतेगा?");
  if (familyId === "122-C") out = out.replace(/^अरुण, भारत को (.+?) की दौड़ में (.+?) से हरा सकता है। (.+?) की दौड़ में अरुण, भारत को (.+?) की शुरुआत देता है।/, "अरुण, भारत को $1 की दौड़ में $2 से हराता है। $3 की दौड़ में भारत को $4 आगे से शुरू कराया जाता है।");
  if (familyId === "122-D") out = out.replace("अंतिम अंतर ज्ञात कीजिए।", "रवि कितने मीटर से जीतेगा?");
  if (familyId === "122-F") out = out.replace("रोहित का जीत का अंतर ज्ञात कीजिए।", "रोहित कितने मीटर से जीतेगा?");
  if (familyId === "123-B") out = out.replace("P का जीत का अंतर ज्ञात कीजिए।", "P कितने मीटर से जीतेगा?");
  if (familyId === "123-D") out = out.replace("जीत का अंतर ज्ञात कीजिए।", "रवि कितने मीटर से जीतेगा?");
  if (familyId === "123-F") {
    out = out.replace(/^रोहित, दीपक को (.+?) की समय-शुरुआत देता है। /, "दीपक, रोहित से $1 पहले शुरू करता है। ");
    out = out.replace("रोहित का जीत का अंतर ज्ञात कीजिए।", "रोहित कितने मीटर से जीतेगा?");
  }
  if (familyId === "124-C") out = out.replace(/^अरुण और भारत दो दौड़ें दौड़ते हैं। अरुण, (.+?) में (.+?) से और (.+?) में (.+?) से जीतता है।/, "पहली $1 की दौड़ में अरुण, भारत को $2 से हराता है; दूसरी $3 की दौड़ में वह $4 से जीतता है।");
  if (familyId === "124-E") out = out.replace("करण और मोहन की गतियाँ दोनों दौड़ों में समान रहती हैं।", "करण और मोहन दोनों अपनी-अपनी गति नहीं बदलते।");
  return out;
}

function refinePunjabi(familyId: string, stem: string) {
  let out = stem
    .replaceAll("ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ", "ਜਿੱਤ ਦਾ ਅੰਤਰ")
    .replaceAll("ਦੂਰੀ-ਅੰਤਰ", "ਦੂਰੀ ਦਾ ਅੰਤਰ")
    .replaceAll("ਜਿੱਤ-ਅੰਤਰ", "ਜਿੱਤ ਦਾ ਅੰਤਰ")
    .replaceAll("ਸਮਾਂ-ਅੰਤਰ", "ਸਮੇਂ ਦਾ ਅੰਤਰ");
  if (familyId === "115-E") out = out.replace("ਕਰਨ ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "ਕਰਨ, ਮੋਹਨ ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?");
  if (familyId === "116-B") out = out.replace(/P ਦਾ ਸਮੇਂ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੈ\?/, "P, Q ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਪਹਿਲਾਂ ਪਹੁੰਚੇਗਾ?");
  if (familyId === "117-F") out = out.replace(/^ਰੋਹਿਤ ਅਤੇ ਦੀਪਕ ਇੱਕੋ ਦੂਰੀ ਦੌੜਦੇ ਹਨ। ਰੋਹਿਤ ਦਾ ਸਮਾਂ (.+?) ਹੈ ਅਤੇ ਜਿੱਤ ਦਾ ਸਮੇਂ ਦਾ ਅੰਤਰ (.+?) ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।$/, "ਰੋਹਿਤ ਉਹੀ ਦੂਰੀ $1 ਵਿੱਚ ਪੂਰੀ ਕਰਦਾ ਹੈ ਅਤੇ ਦੀਪਕ, ਰੋਹਿਤ ਤੋਂ $2 ਬਾਅਦ ਪਹੁੰਚਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।");
  if (familyId === "118-D") out = out.replace(/ਦੂਰੀ ਕੱਢੋ।$/, "ਦੌੜ ਦੀ ਦੂਰੀ ਕੱਢੋ।");
  if (familyId === "119-C") out = out.replace("ਤਾਂ ਜੋ ਕੋਈ ਨਾ ਜਿੱਤੇ?", "ਤਾਂ ਜੋ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ?");
  if (familyId === "120-B") out = out.replace("ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "P, Q ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ?");
  if (familyId === "121-A" || familyId === "121-D") out = out.replace(/^(.+? ਮੀਟਰ) ਦੀ ਦੌੜ ਵਿੱਚ/, "$1 ਦੀਆਂ ਵੱਖ-ਵੱਖ ਦੌੜਾਂ ਵਿੱਚ");
  if (familyId === "121-B") out = out.replace("P ਦੀ R ਉੱਤੇ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "P, R ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?");
  if (familyId === "121-E") out = out.replace("ਕਰਨ-ਨਿਤਿਨ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "ਕਰਨ, ਨਿਤਿਨ ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?");
  if (familyId === "122-B") out = out.replace("P ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "P ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?");
  if (familyId === "122-C") out = out.replace(/^ਅਰੁਣ, ਭਾਰਤ ਨੂੰ (.+?) ਦੀ ਦੌੜ ਵਿੱਚ (.+?) ਨਾਲ ਹਰਾ ਸਕਦਾ ਹੈ। (.+?) ਦੀ ਦੌੜ ਵਿੱਚ ਅਰੁਣ, ਭਾਰਤ ਨੂੰ (.+?) ਦੀ ਸ਼ੁਰੂਆਤ ਦਿੰਦਾ ਹੈ।/, "ਅਰੁਣ, ਭਾਰਤ ਨੂੰ $1 ਦੀ ਦੌੜ ਵਿੱਚ $2 ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। $3 ਦੀ ਦੌੜ ਵਿੱਚ ਭਾਰਤ ਨੂੰ $4 ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਂਦਾ ਹੈ।");
  if (familyId === "122-D") out = out.replace("ਅੰਤਲਾ ਅੰਤਰ ਕੱਢੋ।", "ਰਵੀ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?");
  if (familyId === "122-F") out = out.replace("ਰੋਹਿਤ ਦਾ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "ਰੋਹਿਤ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?");
  if (familyId === "123-B") out = out.replace("P ਦਾ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "P ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?");
  if (familyId === "123-D") out = out.replace("ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "ਰਵੀ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?");
  if (familyId === "123-F") {
    out = out.replace(/^ਰੋਹਿਤ, ਦੀਪਕ ਨੂੰ (.+?) ਦੀ ਸਮਾਂ-ਸ਼ੁਰੂਆਤ ਦਿੰਦਾ ਹੈ। /, "ਦੀਪਕ, ਰੋਹਿਤ ਤੋਂ $1 ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ");
    out = out.replace("ਰੋਹਿਤ ਦਾ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।", "ਰੋਹਿਤ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?");
  }
  if (familyId === "124-C") out = out.replace(/^ਅਰੁਣ ਅਤੇ ਭਾਰਤ ਦੋ ਦੌੜਾਂ ਦੌੜਦੇ ਹਨ। ਅਰੁਣ, (.+?) ਵਿੱਚ (.+?) ਨਾਲ ਅਤੇ (.+?) ਵਿੱਚ (.+?) ਨਾਲ ਜਿੱਤਦਾ ਹੈ।/, "ਪਹਿਲੀ $1 ਦੀ ਦੌੜ ਵਿੱਚ ਅਰੁਣ, ਭਾਰਤ ਨੂੰ $2 ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ; ਦੂਜੀ $3 ਦੀ ਦੌੜ ਵਿੱਚ ਉਹ $4 ਨਾਲ ਜਿੱਤਦਾ ਹੈ।");
  if (familyId === "124-E") out = out.replace("ਕਰਨ ਅਤੇ ਮੋਹਨ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਇੱਕੋ ਰਹਿੰਦੀਆਂ ਹਨ।", "ਕਰਨ ਅਤੇ ਮੋਹਨ ਦੋਵੇਂ ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੇ।");
  return out;
}

function refine(language: TsdCp010ExamRealLanguage, familyId: string, stem: string) {
  return language === "en" ? refineEnglish(familyId, stem) : language === "hi" ? refineHindi(familyId, stem) : refinePunjabi(familyId, stem);
}

export function renderTsdCp010ExamRealStemV2(language: TsdCp010ExamRealLanguage, familyId: string, input: TsdCp010ExecutableInput) {
  return refine(language, familyId, renderTsdCp010ExamRealStem(language, familyId, input));
}

export const TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW = Object.freeze(EN_V1.map((question) => Object.freeze({ ...question, stem: refineEnglish(question.familyId, question.stem) })));
export const TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW = Object.freeze(HI_V1.map((question) => Object.freeze({ ...question, stem: refineHindi(question.familyId, question.stem) })));
export const TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW = Object.freeze(PA_V1.map((question) => Object.freeze({ ...question, stem: refinePunjabi(question.familyId, question.stem) })));
