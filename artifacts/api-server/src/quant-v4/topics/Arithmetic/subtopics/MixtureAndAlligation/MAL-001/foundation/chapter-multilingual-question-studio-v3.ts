import { localizeMal001Text, type Mal001LocalizedLanguage } from "./chapter-multilingual-question-studio-v1";
import { applyMal001QuestionStudioLocalizationV2 } from "./chapter-multilingual-question-studio-v2";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V3 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V3",
  stemPolicy: "NATIVE_QL_TEMPLATE_REQUIRED",
  mathematicalAuthorityLanguage: "en" as const,
});

type StemResult = { text: string; matched: boolean };

function nativeStem(
  qlId: string,
  stem: string,
  language: Mal001LocalizedLanguage,
): StemResult {
  const t = (value: string) => localizeMal001Text(value, language);
  const hi = language === "hi";
  let m: RegExpExecArray | null;

  switch (qlId) {
    case "MAL-QL-001":
      m = /^An? (.+?) wants a mixture worth (.+?) from (.+?) at (.+?) and (.+?) at (.+?)\. What ratio of the two grades is required\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[3]!)} को ${t(m[4]!)} और ${t(m[5]!)} को ${t(m[6]!)} की दर से मिलाकर ${t(m[2]!)} मूल्य का मिश्रण बनाना चाहता है। दोनों को किस अनुपात में मिलाना चाहिए?`
        : `${t(m[1]!)} ${t(m[3]!)} ਨੂੰ ${t(m[4]!)} ਅਤੇ ${t(m[5]!)} ਨੂੰ ${t(m[6]!)} ਦੀ ਦਰ ਨਾਲ ਮਿਲਾ ਕੇ ${t(m[2]!)} ਮੁੱਲ ਦਾ ਮਿਸ਼ਰਣ ਬਣਾਉਣਾ ਚਾਹੁੰਦਾ ਹੈ। ਦੋਵੇਂ ਨੂੰ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਵੇ?` };
      break;
    case "MAL-QL-002":
      m = /^A (.+?) mixes (.+?) of (.+?) at (.+?) with (.+?) of (.+?) at (.+?)\. What is the resulting mixture's average price per kg\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} ${t(m[3]!)} को ${t(m[4]!)} की दर से और ${t(m[5]!)} ${t(m[6]!)} को ${t(m[7]!)} की दर से मिलाता है। बने मिश्रण का औसत मूल्य प्रति किग्रा कितना है?`
        : `${t(m[1]!)} ${t(m[2]!)} ${t(m[3]!)} ਨੂੰ ${t(m[4]!)} ਦੀ ਦਰ ਨਾਲ ਅਤੇ ${t(m[5]!)} ${t(m[6]!)} ਨੂੰ ${t(m[7]!)} ਦੀ ਦਰ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ। ਬਣੇ ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-003":
      m = /^A (.+?) uses (.+?) as the quantity ratio for two grades priced at (.+?) and (.+?)\. What will the mixed (.+?) cost per kg\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[3]!)} और ${t(m[4]!)} मूल्य वाले दो ग्रेड को ${t(m[2]!)} के मात्रा-अनुपात में मिलाता है। मिले हुए ${t(m[5]!)} का मूल्य प्रति किग्रा कितना होगा?`
        : `${t(m[1]!)} ${t(m[3]!)} ਅਤੇ ${t(m[4]!)} ਮੁੱਲ ਵਾਲੇ ਦੋ ਗ੍ਰੇਡਾਂ ਨੂੰ ${t(m[2]!)} ਦੇ ਮਾਤਰਾ-ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਂਦਾ ਹੈ। ਮਿਲੇ ਹੋਏ ${t(m[5]!)} ਦਾ ਮੁੱਲ ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ ਕਿੰਨਾ ਹੋਵੇਗਾ?` };
      break;
    case "MAL-QL-004":
      m = /^A (.+?) prepares a three-grade mixture using (.+?) of (.+?) at (.+?), (.+?) of (.+?) at (.+?), and (.+?) of (.+?) at (.+?)\. What is the mixture's average price per kg\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} ${t(m[3]!)} को ${t(m[4]!)}, ${t(m[5]!)} ${t(m[6]!)} को ${t(m[7]!)} और ${t(m[8]!)} ${t(m[9]!)} को ${t(m[10]!)} की दर से मिलाता है। मिश्रण का औसत मूल्य प्रति किग्रा कितना है?`
        : `${t(m[1]!)} ${t(m[2]!)} ${t(m[3]!)} ਨੂੰ ${t(m[4]!)}, ${t(m[5]!)} ${t(m[6]!)} ਨੂੰ ${t(m[7]!)} ਅਤੇ ${t(m[8]!)} ${t(m[9]!)} ਨੂੰ ${t(m[10]!)} ਦੀ ਦਰ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ। ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਪ੍ਰਤੀ ਕਿਲੋਗ੍ਰਾਮ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-005":
      m = /^After mixing (.+?) of (.+?) at (.+?) and (.+?) of (.+?), the mixture is valued at (.+?)\. What is the price of (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} को ${t(m[3]!)} की दर से और ${t(m[4]!)} ${t(m[5]!)} को मिलाने पर मिश्रण का मूल्य ${t(m[6]!)} है। ${t(m[7]!)} का मूल्य कितना है?`
        : `${t(m[1]!)} ${t(m[2]!)} ਨੂੰ ${t(m[3]!)} ਦੀ ਦਰ ਨਾਲ ਅਤੇ ${t(m[4]!)} ${t(m[5]!)} ਨੂੰ ਮਿਲਾਉਣ 'ਤੇ ਮਿਸ਼ਰਣ ਦਾ ਮੁੱਲ ${t(m[6]!)} ਹੈ। ${t(m[7]!)} ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-006":
      m = /^A (.+?) obtains a mixture worth (.+?) by using (.+?) and (.+?) in the ratio (.+?)\. Given the (.+?) price of (.+?), what is the price of (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[3]!)} और ${t(m[4]!)} को ${t(m[5]!)} के अनुपात में मिलाकर ${t(m[2]!)} मूल्य का मिश्रण बनाता है। यदि ${t(m[6]!)} का मूल्य ${t(m[7]!)} है, तो ${t(m[8]!)} का मूल्य कितना है?`
        : `${t(m[1]!)} ${t(m[3]!)} ਅਤੇ ${t(m[4]!)} ਨੂੰ ${t(m[5]!)} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾ ਕੇ ${t(m[2]!)} ਮੁੱਲ ਦਾ ਮਿਸ਼ਰਣ ਬਣਾਉਂਦਾ ਹੈ। ਜੇ ${t(m[6]!)} ਦਾ ਮੁੱਲ ${t(m[7]!)} ਹੈ, ਤਾਂ ${t(m[8]!)} ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-007":
      m = /^What quantity of (.+?) at (.+?) must be mixed with (.+?) of (.+?) at (.+?) to produce a mixture worth (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[4]!)} की ${t(m[3]!)} मात्रा, जिसकी दर ${t(m[5]!)} है, में ${t(m[2]!)} की दर वाला ${t(m[1]!)} कितना मिलाया जाए ताकि मिश्रण का मूल्य ${t(m[6]!)} हो?`
        : `${t(m[4]!)} ਦੀ ${t(m[3]!)} ਮਾਤਰਾ, ਜਿਸ ਦੀ ਦਰ ${t(m[5]!)} ਹੈ, ਵਿੱਚ ${t(m[2]!)} ਦੀ ਦਰ ਵਾਲਾ ${t(m[1]!)} ਕਿੰਨਾ ਮਿਲਾਇਆ ਜਾਵੇ ਤਾਂ ਕਿ ਮਿਸ਼ਰਣ ਦਾ ਮੁੱਲ ${t(m[6]!)} ਹੋਵੇ?` };
      break;
    case "MAL-QL-008":
      m = /^A three-grade mixture worth (.+?) contains (.+?) of (.+?) at (.+?) and (.+?) of (.+?) at (.+?), plus (.+?) at (.+?)\. What quantity of (.+?) is present\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} मूल्य वाले तीन-ग्रेड मिश्रण में ${t(m[2]!)} ${t(m[3]!)} @ ${t(m[4]!)}, ${t(m[5]!)} ${t(m[6]!)} @ ${t(m[7]!)} और ${t(m[8]!)} @ ${t(m[9]!)} है। ${t(m[10]!)} की मात्रा कितनी है?`
        : `${t(m[1]!)} ਮੁੱਲ ਵਾਲੇ ਤਿੰਨ-ਗ੍ਰੇਡ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[2]!)} ${t(m[3]!)} @ ${t(m[4]!)}, ${t(m[5]!)} ${t(m[6]!)} @ ${t(m[7]!)} ਅਤੇ ${t(m[8]!)} @ ${t(m[9]!)} ਹੈ। ${t(m[10]!)} ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?` };
      break;
    case "MAL-QL-009":
      m = /^The total quantity is (.+?), and its average price is (.+?)\. If the two grades cost (.+?) and (.+?), what are the quantities of (.+?) and (.+?), in that order\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `कुल मात्रा ${t(m[1]!)} और औसत मूल्य ${t(m[2]!)} है। दो ग्रेडों के मूल्य ${t(m[3]!)} और ${t(m[4]!)} हैं। क्रमशः ${t(m[5]!)} और ${t(m[6]!)} की मात्राएँ कितनी हैं?`
        : `ਕੁੱਲ ਮਾਤਰਾ ${t(m[1]!)} ਅਤੇ ਔਸਤ ਮੁੱਲ ${t(m[2]!)} ਹੈ। ਦੋ ਗ੍ਰੇਡਾਂ ਦੇ ਮੁੱਲ ${t(m[3]!)} ਅਤੇ ${t(m[4]!)} ਹਨ। ਕ੍ਰਮਵਾਰ ${t(m[5]!)} ਅਤੇ ${t(m[6]!)} ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕਿੰਨੀਆਂ ਹਨ?` };
      break;
    case "MAL-QL-010":
      m = /^A (.+?) combines (.+?) and (.+?) to obtain (.+?) at (.+?)\. Their prices are (.+?) and (.+?)\. What quantity of (.+?) is present\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} और ${t(m[3]!)} को मिलाकर ${t(m[4]!)} का मिश्रण ${t(m[5]!)} की औसत दर पर बनाता है। दोनों के मूल्य ${t(m[6]!)} और ${t(m[7]!)} हैं। ${t(m[8]!)} की मात्रा कितनी है?`
        : `${t(m[1]!)} ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ਨੂੰ ਮਿਲਾ ਕੇ ${t(m[4]!)} ਦਾ ਮਿਸ਼ਰਣ ${t(m[5]!)} ਦੀ ਔਸਤ ਦਰ 'ਤੇ ਬਣਾਉਂਦਾ ਹੈ। ਦੋਵੇਂ ਦੇ ਮੁੱਲ ${t(m[6]!)} ਅਤੇ ${t(m[7]!)} ਹਨ। ${t(m[8]!)} ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?` };
      break;
    case "MAL-QL-011":
      m = /^First, (.+?) of (.+?) at (.+?) are blended with (.+?) of (.+?) at (.+?)\. Next, a (.+?)-litre portion of that first mixture is mixed with (.+?) of (.+?) at (.+?)\. What is the final mixture's price per litre\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `पहले ${t(m[1]!)} ${t(m[2]!)} @ ${t(m[3]!)} को ${t(m[4]!)} ${t(m[5]!)} @ ${t(m[6]!)} के साथ मिलाया जाता है। फिर पहले मिश्रण के ${t(m[7]!)} लीटर को ${t(m[8]!)} ${t(m[9]!)} @ ${t(m[10]!)} के साथ मिलाया जाता है। अंतिम मिश्रण का मूल्य प्रति लीटर कितना है?`
        : `ਪਹਿਲਾਂ ${t(m[1]!)} ${t(m[2]!)} @ ${t(m[3]!)} ਨੂੰ ${t(m[4]!)} ${t(m[5]!)} @ ${t(m[6]!)} ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਫਿਰ ਪਹਿਲੇ ਮਿਸ਼ਰਣ ਦੇ ${t(m[7]!)} ਲੀਟਰ ਨੂੰ ${t(m[8]!)} ${t(m[9]!)} @ ${t(m[10]!)} ਨਾਲ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਮਿਸ਼ਰਣ ਦਾ ਮੁੱਲ ਪ੍ਰਤੀ ਲੀਟਰ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-012":
      m = /^A mixture contains (.+?) of (.+?) and (.+?) of (.+?)\. How many kg of (.+?) should be added so that the ratio of (.+?) to (.+?) becomes (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक मिश्रण में ${t(m[1]!)} ${t(m[2]!)} और ${t(m[3]!)} ${t(m[4]!)} है। ${t(m[6]!)} : ${t(m[7]!)} का अनुपात ${t(m[8]!)} करने के लिए ${t(m[5]!)} कितने किग्रा जोड़ें?`
        : `ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ${t(m[4]!)} ਹੈ। ${t(m[6]!)} : ${t(m[7]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[8]!)} ਕਰਨ ਲਈ ${t(m[5]!)} ਕਿੰਨੇ ਕਿਲੋਗ੍ਰਾਮ ਜੋੜੀਏ?` };
      break;
    case "MAL-QL-013":
      m = /^A mixture contains (.+?) of (.+?) and (.+?) of (.+?)\. How many kg of (.+?) should be removed so that the ratio of (.+?) to (.+?) becomes (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक मिश्रण में ${t(m[1]!)} ${t(m[2]!)} और ${t(m[3]!)} ${t(m[4]!)} है। ${t(m[6]!)} : ${t(m[7]!)} का अनुपात ${t(m[8]!)} करने के लिए ${t(m[5]!)} कितने किग्रा निकालें?`
        : `ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ${t(m[4]!)} ਹੈ। ${t(m[6]!)} : ${t(m[7]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[8]!)} ਕਰਨ ਲਈ ${t(m[5]!)} ਕਿੰਨੇ ਕਿਲੋਗ੍ਰਾਮ ਕੱਢੀਏ?` };
      break;
    case "MAL-QL-014":
      m = /^A vessel contains (.+?) of (.+?) and (.+?) of (.+?)\. If (.+?) of (.+?) is added to it, what is the new ratio of (.+?) to (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र में ${t(m[1]!)} ${t(m[2]!)} और ${t(m[3]!)} ${t(m[4]!)} है। यदि ${t(m[5]!)} ${t(m[6]!)} और जोड़ दिया जाए, तो ${t(m[7]!)} : ${t(m[8]!)} का नया अनुपात क्या होगा?`
        : `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ${t(m[4]!)} ਹੈ। ਜੇ ${t(m[5]!)} ${t(m[6]!)} ਹੋਰ ਜੋੜਿਆ ਜਾਵੇ, ਤਾਂ ${t(m[7]!)} : ${t(m[8]!)} ਦਾ ਨਵਾਂ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?` };
      break;
    case "MAL-QL-015":
      m = /^A mixture contains (.+?) of (.+?) and (.+?) of (.+?)\. If (.+?) of (.+?) is removed from it, what is the new ratio of (.+?) to (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक मिश्रण में ${t(m[1]!)} ${t(m[2]!)} और ${t(m[3]!)} ${t(m[4]!)} है। यदि ${t(m[5]!)} ${t(m[6]!)} निकाल दिया जाए, तो ${t(m[7]!)} : ${t(m[8]!)} का नया अनुपात क्या होगा?`
        : `ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ${t(m[4]!)} ਹੈ। ਜੇ ${t(m[5]!)} ${t(m[6]!)} ਕੱਢ ਦਿੱਤਾ ਜਾਵੇ, ਤਾਂ ${t(m[7]!)} : ${t(m[8]!)} ਦਾ ਨਵਾਂ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?` };
      break;
    case "MAL-QL-016":
      m = /^After adding (.+?) of (.+?), a vessel contains (.+?) of (.+?) and (.+?) of (.+?)\. What was the original ratio of (.+?) to (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} जोड़ने के बाद पात्र में ${t(m[3]!)} ${t(m[4]!)} और ${t(m[5]!)} ${t(m[6]!)} है। ${t(m[7]!)} : ${t(m[8]!)} का मूल अनुपात क्या था?`
        : `${t(m[1]!)} ${t(m[2]!)} ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਭਾਂਡੇ ਵਿੱਚ ${t(m[3]!)} ${t(m[4]!)} ਅਤੇ ${t(m[5]!)} ${t(m[6]!)} ਹੈ। ${t(m[7]!)} : ${t(m[8]!)} ਦਾ ਮੂਲ ਅਨੁਪਾਤ ਕੀ ਸੀ?` };
      break;
    case "MAL-QL-017":
      m = /^After removing (.+?) of (.+?), a mixture contains (.+?) of (.+?) and (.+?) of (.+?)\. What was the original ratio of (.+?) to (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} निकालने के बाद मिश्रण में ${t(m[3]!)} ${t(m[4]!)} और ${t(m[5]!)} ${t(m[6]!)} है। ${t(m[7]!)} : ${t(m[8]!)} का मूल अनुपात क्या था?`
        : `${t(m[1]!)} ${t(m[2]!)} ਕੱਢਣ ਤੋਂ ਬਾਅਦ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[3]!)} ${t(m[4]!)} ਅਤੇ ${t(m[5]!)} ${t(m[6]!)} ਹੈ। ${t(m[7]!)} : ${t(m[8]!)} ਦਾ ਮੂਲ ਅਨੁਪਾਤ ਕੀ ਸੀ?` };
      break;
    case "MAL-QL-018":
      m = /^A vessel has a total quantity of (.+?)\. It contains (.+?) and (.+?) in the ratio (.+?)\. What are their quantities in the same order\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र की कुल मात्रा ${t(m[1]!)} है। इसमें ${t(m[2]!)} और ${t(m[3]!)} का अनुपात ${t(m[4]!)} है। इसी क्रम में दोनों की मात्राएँ कितनी हैं?`
        : `ਇੱਕ ਭਾਂਡੇ ਦੀ ਕੁੱਲ ਮਾਤਰਾ ${t(m[1]!)} ਹੈ। ਇਸ ਵਿੱਚ ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[4]!)} ਹੈ। ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਦੋਵੇਂ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕਿੰਨੀਆਂ ਹਨ?` };
      break;
    case "MAL-QL-019":
      m = /^A vessel contains (.+?) of (.+?) and (.+?) of (.+?)\. A quantity of the well-mixed contents is removed once and replaced with the same quantity of (.+?)\. How many kg should be replaced so that the final ratio of (.+?) to (.+?) is (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र में ${t(m[1]!)} ${t(m[2]!)} और ${t(m[3]!)} ${t(m[4]!)} है। अच्छी तरह मिले मिश्रण की कुछ मात्रा एक बार निकालकर उतनी ही ${t(m[5]!)} डाली जाती है। अंतिम ${t(m[6]!)} : ${t(m[7]!)} अनुपात ${t(m[8]!)} करने के लिए कितने किग्रा बदलें?`
        : `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ${t(m[4]!)} ਹੈ। ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਦੀ ਕੁਝ ਮਾਤਰਾ ਇੱਕ ਵਾਰ ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ${t(m[5]!)} ਪਾਈ ਜਾਂਦੀ ਹੈ। ਅੰਤਿਮ ${t(m[6]!)} : ${t(m[7]!)} ਅਨੁਪਾਤ ${t(m[8]!)} ਕਰਨ ਲਈ ਕਿੰਨੇ ਕਿਲੋਗ੍ਰਾਮ ਬਦਲੇ ਜਾਣ?` };
      break;
    case "MAL-QL-020":
      m = /^The total amount of a mixture is (.+?), with (.+?) and (.+?) in the ratio (.+?)\. How much (.+?) must be added to make the ratio (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `मिश्रण की कुल मात्रा ${t(m[1]!)} है और ${t(m[2]!)} : ${t(m[3]!)} का अनुपात ${t(m[4]!)} है। अनुपात ${t(m[6]!)} करने के लिए कितना ${t(m[5]!)} जोड़ना होगा?`
        : `ਮਿਸ਼ਰਣ ਦੀ ਕੁੱਲ ਮਾਤਰਾ ${t(m[1]!)} ਹੈ ਅਤੇ ${t(m[2]!)} : ${t(m[3]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[4]!)} ਹੈ। ਅਨੁਪਾਤ ${t(m[6]!)} ਕਰਨ ਲਈ ਕਿੰਨਾ ${t(m[5]!)} ਜੋੜਨਾ ਪਵੇਗਾ?` };
      break;
    case "MAL-QL-021":
      m = /^The total amount of a mixture is (.+?), with (.+?) and (.+?) in the ratio (.+?)\. How much (.+?) must be removed to make the ratio (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `मिश्रण की कुल मात्रा ${t(m[1]!)} है और ${t(m[2]!)} : ${t(m[3]!)} का अनुपात ${t(m[4]!)} है। अनुपात ${t(m[6]!)} करने के लिए कितना ${t(m[5]!)} निकालना होगा?`
        : `ਮਿਸ਼ਰਣ ਦੀ ਕੁੱਲ ਮਾਤਰਾ ${t(m[1]!)} ਹੈ ਅਤੇ ${t(m[2]!)} : ${t(m[3]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[4]!)} ਹੈ। ਅਨੁਪਾਤ ${t(m[6]!)} ਕਰਨ ਲਈ ਕਿੰਨਾ ${t(m[5]!)} ਕੱਢਣਾ ਪਵੇਗਾ?` };
      break;
    case "MAL-QL-022":
      m = /^A mixture contains (.+?) and (.+?) in the ratio (.+?)\. Given that the quantity of (.+?) is (.+?), what quantity of (.+?) is present\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक मिश्रण में ${t(m[1]!)} और ${t(m[2]!)} का अनुपात ${t(m[3]!)} है। यदि ${t(m[4]!)} की मात्रा ${t(m[5]!)} है, तो ${t(m[6]!)} की मात्रा कितनी है?`
        : `ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[1]!)} ਅਤੇ ${t(m[2]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[3]!)} ਹੈ। ਜੇ ${t(m[4]!)} ਦੀ ਮਾਤਰਾ ${t(m[5]!)} ਹੈ, ਤਾਂ ${t(m[6]!)} ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?` };
      break;
    case "MAL-QL-023":
      m = /^(.+?) and (.+?) were initially in the ratio (.+?)\. After (.+?) of (.+?) was added, the ratio became (.+?)\. What was the original total quantity\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `शुरू में ${t(m[1]!)} और ${t(m[2]!)} का अनुपात ${t(m[3]!)} था। ${t(m[4]!)} ${t(m[5]!)} जोड़ने पर अनुपात ${t(m[6]!)} हो गया। मूल कुल मात्रा कितनी थी?`
        : `ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[1]!)} ਅਤੇ ${t(m[2]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[3]!)} ਸੀ। ${t(m[4]!)} ${t(m[5]!)} ਜੋੜਨ 'ਤੇ ਅਨੁਪਾਤ ${t(m[6]!)} ਹੋ ਗਿਆ। ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ ਕਿੰਨੀ ਸੀ?` };
      break;
    case "MAL-QL-024":
      m = /^(.+?) and (.+?) were initially in the ratio (.+?)\. After (.+?) of (.+?) was removed, the ratio became (.+?)\. What was the original total quantity\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `शुरू में ${t(m[1]!)} और ${t(m[2]!)} का अनुपात ${t(m[3]!)} था। ${t(m[4]!)} ${t(m[5]!)} निकालने पर अनुपात ${t(m[6]!)} हो गया। मूल कुल मात्रा कितनी थी?`
        : `ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[1]!)} ਅਤੇ ${t(m[2]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[3]!)} ਸੀ। ${t(m[4]!)} ${t(m[5]!)} ਕੱਢਣ 'ਤੇ ਅਨੁਪਾਤ ${t(m[6]!)} ਹੋ ਗਿਆ। ਮੂਲ ਕੁੱਲ ਮਾਤਰਾ ਕਿੰਨੀ ਸੀ?` };
      break;
    case "MAL-QL-025":
      m = /^A mixture contains (.+?)\. After removing (.+?) of the well-mixed contents and refilling the same amount with (.+?), what is the new ratio of (.+?) to (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक मिश्रण में ${t(m[1]!)} है। अच्छी तरह मिले मिश्रण में से ${t(m[2]!)} निकालकर उतनी ही मात्रा ${t(m[3]!)} से भर दी जाती है। अब ${t(m[4]!)} : ${t(m[5]!)} का नया अनुपात क्या है?`
        : `ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[1]!)} ਹੈ। ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ${t(m[2]!)} ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ਮਾਤਰਾ ${t(m[3]!)} ਨਾਲ ਭਰੀ ਜਾਂਦੀ ਹੈ। ਹੁਣ ${t(m[4]!)} : ${t(m[5]!)} ਦਾ ਨਵਾਂ ਅਨੁਪਾਤ ਕੀ ਹੈ?` };
      break;
    case "MAL-QL-026":
      m = /^A mixture contains (.+?) and (.+?) in the ratio (.+?)\. If (.+?) of the well-mixed mixture is taken out without replacement, what ratio is left behind\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक मिश्रण में ${t(m[1]!)} और ${t(m[2]!)} का अनुपात ${t(m[3]!)} है। यदि अच्छी तरह मिले मिश्रण में से ${t(m[4]!)} बिना वापस भरे निकाल दिया जाए, तो बचा हुआ अनुपात क्या होगा?`
        : `ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[1]!)} ਅਤੇ ${t(m[2]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[3]!)} ਹੈ। ਜੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ${t(m[4]!)} ਬਿਨਾਂ ਮੁੜ ਭਰੇ ਕੱਢ ਦਿੱਤਾ ਜਾਵੇ, ਤਾਂ ਬਚਿਆ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?` };
      break;
    case "MAL-QL-027":
      m = /^The quantities of (.+?) and (.+?) are (.+?) and (.+?)\. What one-item operation is needed to obtain the ratio (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} और ${t(m[2]!)} की मात्राएँ क्रमशः ${t(m[3]!)} और ${t(m[4]!)} हैं। अनुपात ${t(m[5]!)} करने के लिए केवल एक घटक पर कौन-सी क्रिया करनी होगी?`
        : `${t(m[1]!)} ਅਤੇ ${t(m[2]!)} ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕ੍ਰਮਵਾਰ ${t(m[3]!)} ਅਤੇ ${t(m[4]!)} ਹਨ। ਅਨੁਪਾਤ ${t(m[5]!)} ਕਰਨ ਲਈ ਕੇਵਲ ਇੱਕ ਘਟਕ 'ਤੇ ਕਿਹੜੀ ਕਿਰਿਆ ਕਰਨੀ ਪਵੇਗੀ?` };
      break;
    case "MAL-QL-028":
      m = /^(.+?), (.+?) and (.+?) are initially in the ratio (.+?)\. After adding (.+?) of (.+?) and (.+?) of (.+?), their ratio becomes (.+?)\. What is the final quantity of (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `शुरू में ${t(m[1]!)}, ${t(m[2]!)} और ${t(m[3]!)} का अनुपात ${t(m[4]!)} है। ${t(m[5]!)} ${t(m[6]!)} और ${t(m[7]!)} ${t(m[8]!)} जोड़ने पर अनुपात ${t(m[9]!)} हो जाता है। ${t(m[10]!)} की अंतिम मात्रा कितनी है?`
        : `ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[1]!)}, ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ਦਾ ਅਨੁਪਾਤ ${t(m[4]!)} ਹੈ। ${t(m[5]!)} ${t(m[6]!)} ਅਤੇ ${t(m[7]!)} ${t(m[8]!)} ਜੋੜਨ 'ਤੇ ਅਨੁਪਾਤ ${t(m[9]!)} ਹੋ ਜਾਂਦਾ ਹੈ। ${t(m[10]!)} ਦੀ ਅੰਤਿਮ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?` };
      break;
    case "MAL-QL-029":
      m = /^A container contains (.+?) of (.+?) in a total volume of (.+?)\. Each time, (.+?) of the well-mixed liquid are removed and replaced with (.+?)\. After (.+?) such operations, how much of the original (.+?) remains\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र का कुल आयतन ${t(m[3]!)} है, जिसमें ${t(m[1]!)} ${t(m[2]!)} है। हर बार अच्छी तरह मिले द्रव में से ${t(m[4]!)} निकालकर उतनी ही ${t(m[5]!)} भरी जाती है। ${t(m[6]!)} ऐसी क्रियाओं के बाद मूल ${t(m[7]!)} कितना बचेगा?`
        : `ਇੱਕ ਭਾਂਡੇ ਦਾ ਕੁੱਲ ਆਇਤਨ ${t(m[3]!)} ਹੈ, ਜਿਸ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਵਿੱਚੋਂ ${t(m[4]!)} ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ${t(m[5]!)} ਭਰੀ ਜਾਂਦੀ ਹੈ। ${t(m[6]!)} ਅਜਿਹੀਆਂ ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ${t(m[7]!)} ਕਿੰਨਾ ਬਚੇਗਾ?` };
      break;
    case "MAL-QL-030":
      m = /^A container has a fixed volume of (.+?)\. Each time, (.+?) of the well-mixed liquid are removed and replaced with (.+?)\. After (.+?) operations, (.+?) of the original (.+?) remains\. How much (.+?) was present initially\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र का निश्चित आयतन ${t(m[1]!)} है। हर बार अच्छी तरह मिले द्रव में से ${t(m[2]!)} निकालकर उतनी ही ${t(m[3]!)} भरी जाती है। ${t(m[4]!)} क्रियाओं के बाद मूल ${t(m[6]!)} की ${t(m[5]!)} मात्रा बचती है। शुरू में ${t(m[7]!)} कितना था?`
        : `ਇੱਕ ਭਾਂਡੇ ਦਾ ਨਿਰਧਾਰਤ ਆਇਤਨ ${t(m[1]!)} ਹੈ। ਹਰ ਵਾਰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਵਿੱਚੋਂ ${t(m[2]!)} ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ${t(m[3]!)} ਭਰੀ ਜਾਂਦੀ ਹੈ। ${t(m[4]!)} ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ਮੂਲ ${t(m[6]!)} ਦੀ ${t(m[5]!)} ਮਾਤਰਾ ਬਚਦੀ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[7]!)} ਕਿੰਨਾ ਸੀ?` };
      break;
    case "MAL-QL-031":
      m = /^A student records the following operation: a tank initially contains (.+?) of (.+?)\. The same quantity is drawn out and replaced with (.+?) in each of (.+?) operations\. After the last operation, (.+?) of the original (.+?) remains\. How many litres are drawn out in each operation\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक टंकी में शुरू में ${t(m[1]!)} ${t(m[2]!)} है। ${t(m[4]!)} बार हर बार समान मात्रा निकालकर उतनी ही ${t(m[3]!)} भरी जाती है। अंतिम क्रिया के बाद मूल ${t(m[6]!)} की ${t(m[5]!)} मात्रा बचती है। हर बार कितने लीटर निकाले गए?`
        : `ਇੱਕ ਟੈਂਕ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਹੈ। ${t(m[4]!)} ਵਾਰ ਹਰ ਵਾਰ ਇੱਕੋ ਮਾਤਰਾ ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ${t(m[3]!)} ਭਰੀ ਜਾਂਦੀ ਹੈ। ਅੰਤਿਮ ਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਮੂਲ ${t(m[6]!)} ਦੀ ${t(m[5]!)} ਮਾਤਰਾ ਬਚਦੀ ਹੈ। ਹਰ ਵਾਰ ਕਿੰਨੇ ਲੀਟਰ ਕੱਢੇ ਗਏ?` };
      break;
    case "MAL-QL-032":
      m = /^A container contains (.+?) of (.+?) in a total volume of (.+?)\. In each operation, (.+?) of the well-mixed liquid are replaced with (.+?)\. How many operations are needed for the original (.+?) to become (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र का कुल आयतन ${t(m[3]!)} है और उसमें ${t(m[1]!)} ${t(m[2]!)} है। हर क्रिया में अच्छी तरह मिले द्रव की ${t(m[4]!)} मात्रा को ${t(m[5]!)} से बदला जाता है। मूल ${t(m[6]!)} को ${t(m[7]!)} तक लाने के लिए कितनी क्रियाएँ चाहिए?`
        : `ਇੱਕ ਭਾਂਡੇ ਦਾ ਕੁੱਲ ਆਇਤਨ ${t(m[3]!)} ਹੈ ਅਤੇ ਇਸ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਹੈ। ਹਰ ਕਿਰਿਆ ਵਿੱਚ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਤਰਲ ਦੀ ${t(m[4]!)} ਮਾਤਰਾ ਨੂੰ ${t(m[5]!)} ਨਾਲ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ। ਮੂਲ ${t(m[6]!)} ਨੂੰ ${t(m[7]!)} ਤੱਕ ਲਿਆਉਣ ਲਈ ਕਿੰਨੀਆਂ ਕਿਰਿਆਵਾਂ ਚਾਹੀਦੀਆਂ ਹਨ?` };
      break;
    case "MAL-QL-033":
      m = /^A container of volume (.+?) contains (.+?) of (.+?)\. Successive well-mixed samples of (.+?) are removed, and the vessel is restored with (.+?) after every removal\. How much of the original (.+?) remains\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} आयतन वाले पात्र में ${t(m[2]!)} ${t(m[3]!)} है। क्रमशः ${t(m[4]!)} की अच्छी तरह मिली नमूना-मात्राएँ निकाली जाती हैं और हर बार पात्र को ${t(m[5]!)} से फिर पूरा भरा जाता है। मूल ${t(m[6]!)} कितना बचेगा?`
        : `${t(m[1]!)} ਆਇਤਨ ਵਾਲੇ ਭਾਂਡੇ ਵਿੱਚ ${t(m[2]!)} ${t(m[3]!)} ਹੈ। ਕ੍ਰਮਵਾਰ ${t(m[4]!)} ਦੀਆਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੀਆਂ ਨਮੂਨਾ-ਮਾਤਰਾਵਾਂ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ ਅਤੇ ਹਰ ਵਾਰ ਭਾਂਡੇ ਨੂੰ ${t(m[5]!)} ਨਾਲ ਮੁੜ ਪੂਰਾ ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਮੂਲ ${t(m[6]!)} ਕਿੰਨਾ ਬਚੇਗਾ?` };
      break;
    case "MAL-QL-034":
      m = /^A vessel initially contains (.+?) of liquid A\. First, (.+?) of the well-mixed contents are removed and replaced with liquid B\. Then (.+?) of the new well-mixed contents are removed and replaced with liquid C\. What are the final quantities of A, B and C, in that order\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र में शुरू में ${t(m[1]!)} द्रव A है। पहले अच्छी तरह मिले मिश्रण में से ${t(m[2]!)} निकालकर उतना ही द्रव B भरा जाता है। फिर नए मिश्रण में से ${t(m[3]!)} निकालकर उतना ही द्रव C भरा जाता है। अंत में A, B और C की मात्राएँ क्रमशः कितनी हैं?`
        : `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[1]!)} ਤਰਲ A ਹੈ। ਪਹਿਲਾਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ${t(m[2]!)} ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ ਤਰਲ B ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਫਿਰ ਨਵੇਂ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ${t(m[3]!)} ਕੱਢ ਕੇ ਉੱਨਾ ਹੀ ਤਰਲ C ਭਰਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ A, B ਅਤੇ C ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕ੍ਰਮਵਾਰ ਕਿੰਨੀਆਂ ਹਨ?` };
      break;
    case "MAL-QL-035":
      m = /^A (.+?) records this repeated operation: a can initially contains (.+?) of (.+?)\. Each time, (.+?) are drawn out and replaced with (.+?)\. After (.+?) replacements, what is the final ratio of (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक डिब्बे में शुरू में ${t(m[2]!)} ${t(m[3]!)} है। हर बार ${t(m[4]!)} निकालकर उतनी ही ${t(m[5]!)} भरी जाती है। ${t(m[6]!)} प्रतिस्थापनों के बाद ${t(m[7]!)} का अंतिम अनुपात क्या है?`
        : `ਇੱਕ ਡੱਬੇ ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[2]!)} ${t(m[3]!)} ਹੈ। ਹਰ ਵਾਰ ${t(m[4]!)} ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ${t(m[5]!)} ਭਰੀ ਜਾਂਦੀ ਹੈ। ${t(m[6]!)} ਬਦਲੀਆਂ ਤੋਂ ਬਾਅਦ ${t(m[7]!)} ਦਾ ਅੰਤਿਮ ਅਨੁਪਾਤ ਕੀ ਹੈ?` };
      break;
    case "MAL-QL-036":
      m = /^During an equal-replacement process, a vessel is initially full of (.+?)\. Each time, (.+?) are drawn out and replaced with (.+?)\. After (.+?) such operations, the ratio of (.+?) to (.+?) is (.+?)\. What is the capacity of the vessel\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र शुरू में ${t(m[1]!)} से पूरा भरा है। हर बार ${t(m[2]!)} निकालकर उतनी ही ${t(m[3]!)} भरी जाती है। ${t(m[4]!)} ऐसी क्रियाओं के बाद ${t(m[5]!)} : ${t(m[6]!)} = ${t(m[7]!)} है। पात्र की क्षमता कितनी है?`
        : `ਇੱਕ ਭਾਂਡਾ ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[1]!)} ਨਾਲ ਪੂਰਾ ਭਰਿਆ ਹੈ। ਹਰ ਵਾਰ ${t(m[2]!)} ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ${t(m[3]!)} ਭਰੀ ਜਾਂਦੀ ਹੈ। ${t(m[4]!)} ਅਜਿਹੀਆਂ ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ${t(m[5]!)} : ${t(m[6]!)} = ${t(m[7]!)} ਹੈ। ਭਾਂਡੇ ਦੀ ਸਮਰੱਥਾ ਕਿੰਨੀ ਹੈ?` };
      break;
    case "MAL-QL-037":
      m = /^A (.+?)-litre tank is full of (.+?)\. Every time, (.+?) are removed and replaced with (.+?)\. After at least how many operations will the quantity of (.+?) exceed the remaining (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} लीटर की टंकी ${t(m[2]!)} से पूरी भरी है। हर बार ${t(m[3]!)} निकालकर उतनी ही ${t(m[4]!)} भरी जाती है। कम-से-कम कितनी क्रियाओं के बाद ${t(m[5]!)} की मात्रा बचे हुए ${t(m[6]!)} से अधिक हो जाएगी?`
        : `${t(m[1]!)} ਲੀਟਰ ਦਾ ਟੈਂਕ ${t(m[2]!)} ਨਾਲ ਪੂਰਾ ਭਰਿਆ ਹੈ। ਹਰ ਵਾਰ ${t(m[3]!)} ਕੱਢ ਕੇ ਉੱਨੀ ਹੀ ${t(m[4]!)} ਭਰੀ ਜਾਂਦੀ ਹੈ। ਘੱਟੋ-ਘੱਟ ਕਿੰਨੀਆਂ ਕਿਰਿਆਵਾਂ ਤੋਂ ਬਾਅਦ ${t(m[5]!)} ਦੀ ਮਾਤਰਾ ਬਚੇ ਹੋਏ ${t(m[6]!)} ਤੋਂ ਵੱਧ ਹੋ ਜਾਵੇਗੀ?` };
      break;
    case "MAL-QL-038":
      m = /^A tank holds (.+?) of (.+?) of concentration (.+?)\. What is the amount of (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक टंकी में ${t(m[1]!)} ${t(m[2]!)} है, जिसकी सांद्रता ${t(m[3]!)} है। ${t(m[4]!)} की मात्रा कितनी है?`
        : `ਇੱਕ ਟੈਂਕ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਹੈ, ਜਿਸ ਦਾ ਸੰਘਣਾਪਣ ${t(m[3]!)} ਹੈ। ${t(m[4]!)} ਦੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?` };
      break;
    case "MAL-QL-039":
      m = /^A container contains (.+?) of (.+?) and (.+?) of (.+?)\. What is the concentration of (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र में ${t(m[1]!)} ${t(m[2]!)} और ${t(m[3]!)} ${t(m[4]!)} है। ${t(m[5]!)} की सांद्रता कितनी है?`
        : `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਅਤੇ ${t(m[3]!)} ${t(m[4]!)} ਹੈ। ${t(m[5]!)} ਦਾ ਸੰਘਣਾਪਣ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-040":
      m = /^The proportion of (.+?) in a can is (.+?)\. Given (.+?) of (.+?), what is the total mixture\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक डिब्बे में ${t(m[1]!)} का प्रतिशत ${t(m[2]!)} है। यदि ${t(m[4]!)} की मात्रा ${t(m[3]!)} है, तो कुल मिश्रण कितना है?`
        : `ਇੱਕ ਡੱਬੇ ਵਿੱਚ ${t(m[1]!)} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ${t(m[2]!)} ਹੈ। ਜੇ ${t(m[4]!)} ਦੀ ਮਾਤਰਾ ${t(m[3]!)} ਹੈ, ਤਾਂ ਕੁੱਲ ਮਿਸ਼ਰਣ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-041":
      m = /^The concentration of (.+?) in (.+?) of solution is (.+?)\. How much (.+?) should be added to change the concentration to (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[2]!)} घोल में ${t(m[1]!)} की सांद्रता ${t(m[3]!)} है। सांद्रता ${t(m[5]!)} करने के लिए कितना ${t(m[4]!)} जोड़ना चाहिए?`
        : `${t(m[2]!)} ਘੋਲ ਵਿੱਚ ${t(m[1]!)} ਦਾ ਸੰਘਣਾਪਣ ${t(m[3]!)} ਹੈ। ਸੰਘਣਾਪਣ ${t(m[5]!)} ਕਰਨ ਲਈ ਕਿੰਨਾ ${t(m[4]!)} ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ?` };
      break;
    case "MAL-QL-042":
      m = /^A (.+?)-litre solution is (.+?) (.+?) and (.+?) (.+?)\. How much pure (.+?) should be added to reach (.+?) (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} लीटर घोल में ${t(m[2]!)} ${t(m[3]!)} और ${t(m[4]!)} ${t(m[5]!)} है। ${t(m[3]!)} की सांद्रता ${t(m[7]!)} करने के लिए कितना शुद्ध ${t(m[6]!)} जोड़ें?`
        : `${t(m[1]!)} ਲੀਟਰ ਘੋਲ ਵਿੱਚ ${t(m[2]!)} ${t(m[3]!)} ਅਤੇ ${t(m[4]!)} ${t(m[5]!)} ਹੈ। ${t(m[3]!)} ਦਾ ਸੰਘਣਾਪਣ ${t(m[7]!)} ਕਰਨ ਲਈ ਕਿੰਨਾ ਸ਼ੁੱਧ ${t(m[6]!)} ਜੋੜੀਏ?` };
      break;
    case "MAL-QL-043":
      m = /^(.+?) of solution contain (.+?) (.+?)\. On evaporation of (.+?), its concentration rises to (.+?)\. What will be the final volume of the solution\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} घोल में ${t(m[2]!)} ${t(m[3]!)} है। ${t(m[4]!)} के वाष्पीकरण से इसकी सांद्रता ${t(m[5]!)} हो जाती है। घोल का अंतिम आयतन कितना होगा?`
        : `${t(m[1]!)} ਘੋਲ ਵਿੱਚ ${t(m[2]!)} ${t(m[3]!)} ਹੈ। ${t(m[4]!)} ਦੇ ਬਾਫ਼ ਬਣਨ ਨਾਲ ਇਸ ਦਾ ਸੰਘਣਾਪਣ ${t(m[5]!)} ਹੋ ਜਾਂਦਾ ਹੈ। ਘੋਲ ਦਾ ਅੰਤਿਮ ਆਇਤਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?` };
      break;
    case "MAL-QL-044":
      m = /^The initial (.+?) concentration in a container is (.+?) and the total volume is (.+?)\. (.+?) of (.+?) is added\. What is the final concentration\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक पात्र में ${t(m[1]!)} की प्रारंभिक सांद्रता ${t(m[2]!)} और कुल आयतन ${t(m[3]!)} है। इसमें ${t(m[4]!)} ${t(m[5]!)} जोड़ा जाता है। अंतिम सांद्रता कितनी है?`
        : `ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ ${t(m[1]!)} ਦਾ ਸ਼ੁਰੂਆਤੀ ਸੰਘਣਾਪਣ ${t(m[2]!)} ਅਤੇ ਕੁੱਲ ਆਇਤਨ ${t(m[3]!)} ਹੈ। ਇਸ ਵਿੱਚ ${t(m[4]!)} ${t(m[5]!)} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਿਮ ਸੰਘਣਾਪਣ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-045":
      m = /^During a solution-concentration check, only (.+?) evaporates from a (.+?) solution\. The concentration rises from (.+?) to (.+?) after (.+?) evaporate\. What was the starting volume\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `एक ${t(m[2]!)} घोल में केवल ${t(m[1]!)} वाष्पित होता है। ${t(m[5]!)} वाष्पित होने पर सांद्रता ${t(m[3]!)} से बढ़कर ${t(m[4]!)} हो जाती है। प्रारंभिक आयतन कितना था?`
        : `ਇੱਕ ${t(m[2]!)} ਘੋਲ ਵਿੱਚ ਕੇਵਲ ${t(m[1]!)} ਬਾਫ਼ ਬਣਦਾ ਹੈ। ${t(m[5]!)} ਬਾਫ਼ ਬਣਨ 'ਤੇ ਸੰਘਣਾਪਣ ${t(m[3]!)} ਤੋਂ ਵੱਧ ਕੇ ${t(m[4]!)} ਹੋ ਜਾਂਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਆਇਤਨ ਕਿੰਨਾ ਸੀ?` };
      break;
    case "MAL-QL-046":
      m = /^A (.+?) batch of fresh (.+?) contains (.+?) moisture\. After drying, the moisture content is (.+?)\. What is the final mass of the dry (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ताज़ा ${t(m[2]!)} में ${t(m[3]!)} नमी है। सुखाने के बाद नमी ${t(m[4]!)} रह जाती है। सूखे ${t(m[5]!)} का अंतिम भार कितना है?`
        : `${t(m[1]!)} ਤਾਜ਼ਾ ${t(m[2]!)} ਵਿੱਚ ${t(m[3]!)} ਨਮੀ ਹੈ। ਸੁਕਾਉਣ ਤੋਂ ਬਾਅਦ ਨਮੀ ${t(m[4]!)} ਰਹਿ ਜਾਂਦੀ ਹੈ। ਸੁੱਕੇ ${t(m[5]!)} ਦਾ ਅੰਤਿਮ ਭਾਰ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-047":
      m = /^After drying, a (.+?) batch of dried (.+?) contains (.+?) moisture\. The original wet (.+?) contained (.+?) moisture\. What was its initial mass\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `सुखाने के बाद ${t(m[1]!)} सूखे ${t(m[2]!)} में ${t(m[3]!)} नमी है। मूल गीले ${t(m[4]!)} में ${t(m[5]!)} नमी थी। उसका प्रारंभिक भार कितना था?`
        : `ਸੁਕਾਉਣ ਤੋਂ ਬਾਅਦ ${t(m[1]!)} ਸੁੱਕੇ ${t(m[2]!)} ਵਿੱਚ ${t(m[3]!)} ਨਮੀ ਹੈ। ਮੂਲ ਗਿੱਲੇ ${t(m[4]!)} ਵਿੱਚ ${t(m[5]!)} ਨਮੀ ਸੀ। ਉਸ ਦਾ ਸ਼ੁਰੂਆਤੀ ਭਾਰ ਕਿੰਨਾ ਸੀ?` };
      break;
    case "MAL-QL-048":
      m = /^A (.+?) adds (.+?) of (.+?) to (.+?) of pure (.+?) and sells the mixture at the cost price of pure (.+?)\. What is the profit percentage\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[4]!)} शुद्ध ${t(m[5]!)} में ${t(m[2]!)} ${t(m[3]!)} मिलाता है और मिश्रण को शुद्ध ${t(m[6]!)} के क्रय मूल्य पर बेचता है। लाभ प्रतिशत कितना है?`
        : `${t(m[1]!)} ${t(m[4]!)} ਸ਼ੁੱਧ ${t(m[5]!)} ਵਿੱਚ ${t(m[2]!)} ${t(m[3]!)} ਮਿਲਾਉਂਦਾ ਹੈ ਅਤੇ ਮਿਸ਼ਰਣ ਨੂੰ ਸ਼ੁੱਧ ${t(m[6]!)} ਦੇ ਖਰੀਦ ਮੁੱਲ 'ਤੇ ਵੇਚਦਾ ਹੈ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-049":
      m = /^A (.+?) sells a (.+?) mixture at the cost price of pure (.+?) and earns (.+?) profit\. In what ratio should pure (.+?) and (.+?) be mixed\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} को शुद्ध ${t(m[3]!)} के क्रय मूल्य पर बेचकर ${t(m[4]!)} लाभ कमाता है। शुद्ध ${t(m[5]!)} और ${t(m[6]!)} को किस अनुपात में मिलाना चाहिए?`
        : `${t(m[1]!)} ${t(m[2]!)} ਨੂੰ ਸ਼ੁੱਧ ${t(m[3]!)} ਦੇ ਖਰੀਦ ਮੁੱਲ 'ਤੇ ਵੇਚ ਕੇ ${t(m[4]!)} ਲਾਭ ਕਮਾਉਂਦਾ ਹੈ। ਸ਼ੁੱਧ ${t(m[5]!)} ਅਤੇ ${t(m[6]!)} ਨੂੰ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?` };
      break;
    case "MAL-QL-050":
      m = /^A (.+?) has (.+?) of pure (.+?)\. How much (.+?) should be added so that selling the mixture at the cost price of pure (.+?) gives (.+?) profit\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} के पास ${t(m[2]!)} शुद्ध ${t(m[3]!)} है। मिश्रण को शुद्ध ${t(m[5]!)} के क्रय मूल्य पर बेचकर ${t(m[6]!)} लाभ कमाने के लिए कितना ${t(m[4]!)} जोड़ना चाहिए?`
        : `${t(m[1]!)} ਕੋਲ ${t(m[2]!)} ਸ਼ੁੱਧ ${t(m[3]!)} ਹੈ। ਮਿਸ਼ਰਣ ਨੂੰ ਸ਼ੁੱਧ ${t(m[5]!)} ਦੇ ਖਰੀਦ ਮੁੱਲ 'ਤੇ ਵੇਚ ਕੇ ${t(m[6]!)} ਲਾਭ ਕਮਾਉਣ ਲਈ ਕਿੰਨਾ ${t(m[4]!)} ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ?` };
      break;
    case "MAL-QL-051":
      m = /^A (.+?) adds (.+?) of (.+?) to some pure (.+?) and sells the mixture at the cost price of pure (.+?), earning (.+?) profit\. How much pure (.+?) was used\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} कुछ शुद्ध ${t(m[4]!)} में ${t(m[2]!)} ${t(m[3]!)} मिलाता है और मिश्रण को शुद्ध ${t(m[5]!)} के क्रय मूल्य पर बेचकर ${t(m[6]!)} लाभ कमाता है। कितनी शुद्ध ${t(m[7]!)} ली गई थी?`
        : `${t(m[1]!)} ਕੁਝ ਸ਼ੁੱਧ ${t(m[4]!)} ਵਿੱਚ ${t(m[2]!)} ${t(m[3]!)} ਮਿਲਾਉਂਦਾ ਹੈ ਅਤੇ ਮਿਸ਼ਰਣ ਨੂੰ ਸ਼ੁੱਧ ${t(m[5]!)} ਦੇ ਖਰੀਦ ਮੁੱਲ 'ਤੇ ਵੇਚ ਕੇ ${t(m[6]!)} ਲਾਭ ਕਮਾਉਂਦਾ ਹੈ। ਕਿੰਨੀ ਸ਼ੁੱਧ ${t(m[7]!)} ਵਰਤੀ ਗਈ ਸੀ?` };
      break;
    case "MAL-QL-052":
      m = /^A (.+?) sells an adulterated (.+?) mixture at the cost price of pure (.+?) and earns (.+?) profit\. What percentage of the final mixture is (.+?)\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} मिलावटी ${t(m[2]!)} मिश्रण को शुद्ध ${t(m[3]!)} के क्रय मूल्य पर बेचकर ${t(m[4]!)} लाभ कमाता है। अंतिम मिश्रण में ${t(m[5]!)} कितने प्रतिशत है?`
        : `${t(m[1]!)} ਮਿਲਾਵਟੀ ${t(m[2]!)} ਮਿਸ਼ਰਣ ਨੂੰ ਸ਼ੁੱਧ ${t(m[3]!)} ਦੇ ਖਰੀਦ ਮੁੱਲ 'ਤੇ ਵੇਚ ਕੇ ${t(m[4]!)} ਲਾਭ ਕਮਾਉਂਦਾ ਹੈ। ਅੰਤਿਮ ਮਿਸ਼ਰਣ ਵਿੱਚ ${t(m[5]!)} ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?` };
      break;
    case "MAL-QL-053":
      m = /^(.+?) of a (.+?) mixture is (.+?)\. The mixture is sold at the cost price of pure (.+?)\. What is the profit percentage\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[2]!)} मिश्रण का ${t(m[1]!)} भाग ${t(m[3]!)} है। मिश्रण को शुद्ध ${t(m[4]!)} के क्रय मूल्य पर बेचा जाता है। लाभ प्रतिशत कितना है?`
        : `${t(m[2]!)} ਮਿਸ਼ਰਣ ਦਾ ${t(m[1]!)} ਹਿੱਸਾ ${t(m[3]!)} ਹੈ। ਮਿਸ਼ਰਣ ਨੂੰ ਸ਼ੁੱਧ ${t(m[4]!)} ਦੇ ਖਰੀਦ ਮੁੱਲ 'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-054":
      m = /^A (.+?) buys pure (.+?) at (.+?), mixes pure (.+?) and (.+?) in the ratio (.+?), and sells the mixture at (.+?)\. What is the profit percentage\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} शुद्ध ${t(m[2]!)} को ${t(m[3]!)} में खरीदता है, शुद्ध ${t(m[4]!)} और ${t(m[5]!)} को ${t(m[6]!)} के अनुपात में मिलाता है और मिश्रण को ${t(m[7]!)} में बेचता है। लाभ प्रतिशत कितना है?`
        : `${t(m[1]!)} ਸ਼ੁੱਧ ${t(m[2]!)} ਨੂੰ ${t(m[3]!)} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ, ਸ਼ੁੱਧ ${t(m[4]!)} ਅਤੇ ${t(m[5]!)} ਨੂੰ ${t(m[6]!)} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਂਦਾ ਹੈ ਅਤੇ ਮਿਸ਼ਰਣ ਨੂੰ ${t(m[7]!)} ਵਿੱਚ ਵੇਚਦਾ ਹੈ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-055":
      m = /^A (.+?) buys pure (.+?) at (.+?) and sells the adulterated mixture at (.+?)\. In what ratio should pure (.+?) and (.+?) be mixed to earn (.+?) profit\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} शुद्ध ${t(m[2]!)} को ${t(m[3]!)} में खरीदता है और मिलावटी मिश्रण को ${t(m[4]!)} में बेचता है। ${t(m[7]!)} लाभ के लिए शुद्ध ${t(m[5]!)} और ${t(m[6]!)} को किस अनुपात में मिलाना चाहिए?`
        : `${t(m[1]!)} ਸ਼ੁੱਧ ${t(m[2]!)} ਨੂੰ ${t(m[3]!)} ਵਿੱਚ ਖਰੀਦਦਾ ਹੈ ਅਤੇ ਮਿਲਾਵਟੀ ਮਿਸ਼ਰਣ ਨੂੰ ${t(m[4]!)} ਵਿੱਚ ਵੇਚਦਾ ਹੈ। ${t(m[7]!)} ਲਾਭ ਲਈ ਸ਼ੁੱਧ ${t(m[5]!)} ਅਤੇ ${t(m[6]!)} ਨੂੰ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?` };
      break;
    case "MAL-QL-056":
      m = /^Pure (.+?) costs (.+?)\. A (.+?) mixes pure (.+?) and (.+?) in the ratio (.+?)\. At what rate should the mixture be sold to earn (.+?) profit\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `शुद्ध ${t(m[1]!)} का मूल्य ${t(m[2]!)} है। ${t(m[3]!)} शुद्ध ${t(m[4]!)} और ${t(m[5]!)} को ${t(m[6]!)} के अनुपात में मिलाता है। ${t(m[7]!)} लाभ के लिए मिश्रण किस दर पर बेचना चाहिए?`
        : `ਸ਼ੁੱਧ ${t(m[1]!)} ਦਾ ਮੁੱਲ ${t(m[2]!)} ਹੈ। ${t(m[3]!)} ਸ਼ੁੱਧ ${t(m[4]!)} ਅਤੇ ${t(m[5]!)} ਨੂੰ ${t(m[6]!)} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਂਦਾ ਹੈ। ${t(m[7]!)} ਲਾਭ ਲਈ ਮਿਸ਼ਰਣ ਕਿਹੜੀ ਦਰ 'ਤੇ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ?` };
      break;
    case "MAL-QL-057":
      m = /^A (.+?) mixes (.+?) of pure (.+?) costing (.+?) with (.+?) of (.+?) costing (.+?)\. The mixture is sold at (.+?)\. What is the profit percentage\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} शुद्ध ${t(m[3]!)} @ ${t(m[4]!)} को ${t(m[5]!)} ${t(m[6]!)} @ ${t(m[7]!)} के साथ मिलाता है। मिश्रण ${t(m[8]!)} पर बेचा जाता है। लाभ प्रतिशत कितना है?`
        : `${t(m[1]!)} ${t(m[2]!)} ਸ਼ੁੱਧ ${t(m[3]!)} @ ${t(m[4]!)} ਨੂੰ ${t(m[5]!)} ${t(m[6]!)} @ ${t(m[7]!)} ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ। ਮਿਸ਼ਰਣ ${t(m[8]!)} 'ਤੇ ਵੇਚਿਆ ਜਾਂਦਾ ਹੈ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-058":
      m = /^A (.+?) mixes (.+?) costing (.+?) with (.+?) costing (.+?)\. The mixture is sold at (.+?) for a profit of (.+?)\. In what ratio should (.+?) and (.+?) be mixed\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} @ ${t(m[3]!)} को ${t(m[4]!)} @ ${t(m[5]!)} के साथ मिलाता है। मिश्रण ${t(m[6]!)} पर बेचने से ${t(m[7]!)} लाभ होता है। ${t(m[8]!)} और ${t(m[9]!)} को किस अनुपात में मिलाना चाहिए?`
        : `${t(m[1]!)} ${t(m[2]!)} @ ${t(m[3]!)} ਨੂੰ ${t(m[4]!)} @ ${t(m[5]!)} ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ। ਮਿਸ਼ਰਣ ${t(m[6]!)} 'ਤੇ ਵੇਚਣ ਨਾਲ ${t(m[7]!)} ਲਾਭ ਹੁੰਦਾ ਹੈ। ${t(m[8]!)} ਅਤੇ ${t(m[9]!)} ਨੂੰ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?` };
      break;
    case "MAL-QL-059":
      m = /^A (.+?) mixes (.+?) costing (.+?) and (.+?) costing (.+?) in the ratio (.+?)\. At what rate should the mixture be sold to earn (.+?) profit\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} @ ${t(m[3]!)} और ${t(m[4]!)} @ ${t(m[5]!)} को ${t(m[6]!)} के अनुपात में मिलाता है। ${t(m[7]!)} लाभ के लिए मिश्रण किस दर पर बेचना चाहिए?`
        : `${t(m[1]!)} ${t(m[2]!)} @ ${t(m[3]!)} ਅਤੇ ${t(m[4]!)} @ ${t(m[5]!)} ਨੂੰ ${t(m[6]!)} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਉਂਦਾ ਹੈ। ${t(m[7]!)} ਲਾਭ ਲਈ ਮਿਸ਼ਰਣ ਕਿਹੜੀ ਦਰ 'ਤੇ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ?` };
      break;
    case "MAL-QL-060":
      m = /^A (.+?) buys (.+?) of pure (.+?) at (.+?)\. He adulterates it by adding free (.+?) equal to (.+?) of the pure quantity and then sells the mixture at a rate (.+?) above the cost price per unit\. What is the total profit on the batch\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `${t(m[1]!)} ${t(m[2]!)} शुद्ध ${t(m[3]!)} को ${t(m[4]!)} की दर से खरीदता है। वह शुद्ध मात्रा के ${t(m[6]!)} के बराबर बिना लागत का ${t(m[5]!)} मिलाता है और मिश्रण को प्रति इकाई क्रय मूल्य से ${t(m[7]!)} अधिक दर पर बेचता है। पूरे बैच पर कुल लाभ कितना है?`
        : `${t(m[1]!)} ${t(m[2]!)} ਸ਼ੁੱਧ ${t(m[3]!)} ਨੂੰ ${t(m[4]!)} ਦੀ ਦਰ ਨਾਲ ਖਰੀਦਦਾ ਹੈ। ਉਹ ਸ਼ੁੱਧ ਮਾਤਰਾ ਦੇ ${t(m[6]!)} ਦੇ ਬਰਾਬਰ ਬਿਨਾਂ ਲਾਗਤ ਵਾਲਾ ${t(m[5]!)} ਮਿਲਾਉਂਦਾ ਹੈ ਅਤੇ ਮਿਸ਼ਰਣ ਨੂੰ ਪ੍ਰਤੀ ਇਕਾਈ ਖਰੀਦ ਮੁੱਲ ਤੋਂ ${t(m[7]!)} ਵੱਧ ਦਰ 'ਤੇ ਵੇਚਦਾ ਹੈ। ਪੂਰੇ ਬੈਚ 'ਤੇ ਕੁੱਲ ਲਾਭ ਕਿੰਨਾ ਹੈ?` };
      break;
    case "MAL-QL-061":
      m = /^Vessels A and B each contain (.+?) of a (.+?) solution\. A contains (.+?) (.+?) and B contains (.+?) (.+?)\. (.+?) are transferred from B to A\. After mixing A, (.+?) are transferred back to B\. What is the final ratio of (.+?) to (.+?) in B\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `पात्र A और B में प्रत्येक ${t(m[1]!)} ${t(m[2]!)} है। A में ${t(m[3]!)} ${t(m[4]!)} और B में ${t(m[5]!)} ${t(m[6]!)} है। B से A में ${t(m[7]!)} स्थानांतरित किए जाते हैं। A को मिलाने के बाद ${t(m[8]!)} वापस B में भेजे जाते हैं। अंत में B में ${t(m[9]!)} : ${t(m[10]!)} का अनुपात क्या है?`
        : `ਭਾਂਡੇ A ਅਤੇ B ਵਿੱਚ ਹਰ ਇੱਕ ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਹੈ। A ਵਿੱਚ ${t(m[3]!)} ${t(m[4]!)} ਅਤੇ B ਵਿੱਚ ${t(m[5]!)} ${t(m[6]!)} ਹੈ। B ਤੋਂ A ਵਿੱਚ ${t(m[7]!)} ਟ੍ਰਾਂਸਫਰ ਕੀਤੇ ਜਾਂਦੇ ਹਨ। A ਨੂੰ ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ ${t(m[8]!)} ਵਾਪਸ B ਵਿੱਚ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। ਅੰਤ ਵਿੱਚ B ਵਿੱਚ ${t(m[9]!)} : ${t(m[10]!)} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?` };
      break;
    case "MAL-QL-062":
      m = /^Two vessels contain (.+?) and (.+?) of the same (.+?) mixture, with (.+?) and (.+?) (.+?), respectively\. If equal quantities are swapped simultaneously, how much must be moved from each vessel so that both end with the same concentration\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `दो पात्रों में समान ${t(m[3]!)} मिश्रण की मात्राएँ क्रमशः ${t(m[1]!)} और ${t(m[2]!)} हैं, जिनमें ${t(m[6]!)} की सांद्रताएँ ${t(m[4]!)} और ${t(m[5]!)} हैं। यदि दोनों के बीच समान मात्रा एक साथ बदली जाए, तो दोनों की अंतिम सांद्रता समान करने के लिए प्रत्येक पात्र से कितनी मात्रा स्थानांतरित करनी होगी?`
        : `ਦੋ ਭਾਂਡਿਆਂ ਵਿੱਚ ਇੱਕੋ ${t(m[3]!)} ਮਿਸ਼ਰਣ ਦੀਆਂ ਮਾਤਰਾਵਾਂ ਕ੍ਰਮਵਾਰ ${t(m[1]!)} ਅਤੇ ${t(m[2]!)} ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚ ${t(m[6]!)} ਦੇ ਸੰਘਣਾਪਣ ${t(m[4]!)} ਅਤੇ ${t(m[5]!)} ਹਨ। ਜੇ ਦੋਵੇਂ ਵਿਚਕਾਰ ਇੱਕੋ ਮਾਤਰਾ ਇੱਕੋ ਸਮੇਂ ਬਦਲੀ ਜਾਵੇ, ਤਾਂ ਦੋਵੇਂ ਦਾ ਅੰਤਿਮ ਸੰਘਣਾਪਣ ਇੱਕੋ ਕਰਨ ਲਈ ਹਰ ਭਾਂਡੇ ਤੋਂ ਕਿੰਨੀ ਮਾਤਰਾ ਟ੍ਰਾਂਸਫਰ ਕਰਨੀ ਪਵੇਗੀ?` };
      break;
    case "MAL-QL-063":
      m = /^Three vessels contain equal quantities, (.+?) each, of (.+?), (.+?) and (.+?) (.+?) solution\. The same (.+?) is moved A→B, B→C and C→A, with mixing at every stage\. What percentage of (.+?) is finally in A\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `तीन पात्रों में प्रत्येक ${t(m[1]!)} समान मात्रा में क्रमशः ${t(m[2]!)}, ${t(m[3]!)} और ${t(m[4]!)} ${t(m[5]!)} घोल है। हर चरण में मिलाने के बाद समान ${t(m[6]!)} मात्रा A→B, B→C और C→A भेजी जाती है। अंत में A में ${t(m[7]!)} कितने प्रतिशत है?`
        : `ਤਿੰਨ ਭਾਂਡਿਆਂ ਵਿੱਚ ਹਰ ਇੱਕ ਵਿੱਚ ${t(m[1]!)} ਇੱਕੋ ਮਾਤਰਾ ਵਿੱਚ ਕ੍ਰਮਵਾਰ ${t(m[2]!)}, ${t(m[3]!)} ਅਤੇ ${t(m[4]!)} ${t(m[5]!)} ਘੋਲ ਹੈ। ਹਰ ਪੜਾਅ 'ਤੇ ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ ਇੱਕੋ ${t(m[6]!)} ਮਾਤਰਾ A→B, B→C ਅਤੇ C→A ਭੇਜੀ ਜਾਂਦੀ ਹੈ। ਅੰਤ ਵਿੱਚ A ਵਿੱਚ ${t(m[7]!)} ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?` };
      break;
    case "MAL-QL-064":
      m = /^A has (.+?) of a (.+?) mixture containing (.+?) (.+?)\. After (.+?) are sent to empty B, the same amount of pure (.+?) is added to A\. A is mixed and (.+?) are sent to B\. What is B's final (.+?)-to-(.+?) ratio\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `A में ${t(m[1]!)} ${t(m[2]!)} है, जिसमें ${t(m[3]!)} ${t(m[4]!)} है। ${t(m[5]!)} खाली B में भेजने के बाद A में उतनी ही शुद्ध ${t(m[6]!)} डाली जाती है। A को मिलाकर फिर ${t(m[7]!)} B में भेजे जाते हैं। अंत में B में ${t(m[8]!)} : ${t(m[9]!)} का अनुपात क्या है?`
        : `A ਵਿੱਚ ${t(m[1]!)} ${t(m[2]!)} ਹੈ, ਜਿਸ ਵਿੱਚ ${t(m[3]!)} ${t(m[4]!)} ਹੈ। ${t(m[5]!)} ਖਾਲੀ B ਵਿੱਚ ਭੇਜਣ ਤੋਂ ਬਾਅਦ A ਵਿੱਚ ਉੱਨੀ ਹੀ ਸ਼ੁੱਧ ${t(m[6]!)} ਪਾਈ ਜਾਂਦੀ ਹੈ। A ਨੂੰ ਮਿਲਾ ਕੇ ਫਿਰ ${t(m[7]!)} B ਵਿੱਚ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। ਅੰਤ ਵਿੱਚ B ਵਿੱਚ ${t(m[8]!)} : ${t(m[9]!)} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?` };
      break;
    case "MAL-QL-065":
      m = /^A starts with (.+?) pure (.+?) and B with (.+?) pure (.+?)\. Move (.+?) A→B, mix B, and return (.+?) B→A\. What is the ratio of final (.+?) in A to final (.+?) in B\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `A में शुरू में ${t(m[1]!)} शुद्ध ${t(m[2]!)} और B में ${t(m[3]!)} शुद्ध ${t(m[4]!)} है। ${t(m[5]!)} A→B भेजें, B को मिलाएँ और फिर ${t(m[6]!)} B→A वापस भेजें। अंत में A के ${t(m[7]!)} और B के ${t(m[8]!)} का अनुपात क्या है?`
        : `A ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${t(m[1]!)} ਸ਼ੁੱਧ ${t(m[2]!)} ਅਤੇ B ਵਿੱਚ ${t(m[3]!)} ਸ਼ੁੱਧ ${t(m[4]!)} ਹੈ। ${t(m[5]!)} A→B ਭੇਜੋ, B ਨੂੰ ਮਿਲਾਓ ਅਤੇ ਫਿਰ ${t(m[6]!)} B→A ਵਾਪਸ ਭੇਜੋ। ਅੰਤ ਵਿੱਚ A ਦੇ ${t(m[7]!)} ਅਤੇ B ਦੇ ${t(m[8]!)} ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?` };
      break;
    case "MAL-QL-066":
      m = /^A contains only (.+?) and B contains only (.+?), (.+?) in each tank\. A first moves (.+?) into B\. Once B is mixed uniformly, a different quantity is moved back\. The final ratio in A is (.+?)\. How many litres came back from B\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `A में केवल ${t(m[1]!)} और B में केवल ${t(m[2]!)} है; दोनों टंकियों में ${t(m[3]!)} मात्रा है। पहले A से ${t(m[4]!)} B में भेजे जाते हैं। B को अच्छी तरह मिलाने के बाद दूसरी मात्रा वापस A में भेजी जाती है। A में अंतिम अनुपात ${t(m[5]!)} है। B से कितने लीटर वापस आए?`
        : `A ਵਿੱਚ ਕੇਵਲ ${t(m[1]!)} ਅਤੇ B ਵਿੱਚ ਕੇਵਲ ${t(m[2]!)} ਹੈ; ਦੋਵੇਂ ਟੈਂਕਾਂ ਵਿੱਚ ${t(m[3]!)} ਮਾਤਰਾ ਹੈ। ਪਹਿਲਾਂ A ਤੋਂ ${t(m[4]!)} B ਵਿੱਚ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। B ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ ਵੱਖਰੀ ਮਾਤਰਾ ਵਾਪਸ A ਵਿੱਚ ਭੇਜੀ ਜਾਂਦੀ ਹੈ। A ਵਿੱਚ ਅੰਤਿਮ ਅਨੁਪਾਤ ${t(m[5]!)} ਹੈ। B ਤੋਂ ਕਿੰਨੇ ਲੀਟਰ ਵਾਪਸ ਆਏ?` };
      break;
    case "MAL-QL-067":
      m = /^A contains (.+?), B contains (.+?) of pure (.+?), and C is empty\. First, A transfers (.+?) of (.+?) to B\. Next, after mixing B well, (.+?) of B's contents are transferred to C\. C finally has (.+?) and (.+?) in the ratio (.+?)\. How much (.+?) is left in B\?$/u.exec(stem);
      if (m) return { matched: true, text: hi
        ? `A में ${t(m[1]!)} है, B में ${t(m[2]!)} शुद्ध ${t(m[3]!)} है और C खाली है। पहले A से ${t(m[4]!)} ${t(m[5]!)} B में भेजा जाता है। B को अच्छी तरह मिलाने के बाद उसके मिश्रण में से ${t(m[6]!)} C में भेजा जाता है। अंत में C में ${t(m[7]!)} : ${t(m[8]!)} = ${t(m[9]!)} है। B में ${t(m[10]!)} कितना बचा है?`
        : `A ਵਿੱਚ ${t(m[1]!)} ਹੈ, B ਵਿੱਚ ${t(m[2]!)} ਸ਼ੁੱਧ ${t(m[3]!)} ਹੈ ਅਤੇ C ਖਾਲੀ ਹੈ। ਪਹਿਲਾਂ A ਤੋਂ ${t(m[4]!)} ${t(m[5]!)} B ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। B ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਮਿਲਾਉਣ ਤੋਂ ਬਾਅਦ ਉਸ ਦੇ ਮਿਸ਼ਰਣ ਵਿੱਚੋਂ ${t(m[6]!)} C ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ। ਅੰਤ ਵਿੱਚ C ਵਿੱਚ ${t(m[7]!)} : ${t(m[8]!)} = ${t(m[9]!)} ਹੈ। B ਵਿੱਚ ${t(m[10]!)} ਕਿੰਨਾ ਬਚਿਆ ਹੈ?` };
      break;
  }

  return { matched: false, text: stem };
}

export function applyMal001QuestionStudioLocalizationV3<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  const localized = applyMal001QuestionStudioLocalizationV2(question, language);
  const stem = nativeStem(String(question.questionLanguageId ?? ""), String(question.stem ?? ""), language);
  return {
    ...localized,
    stem: stem.matched ? stem.text : localized.stem,
    traceability: {
      ...(localized.traceability ?? {}),
      localizationId: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V3.localizationId,
      localizationStemTemplateId: stem.matched
        ? `${question.questionLanguageId}-${language.toUpperCase()}-NATIVE-STEM-V1`
        : "FALLBACK",
      nativeStemTemplateMatched: stem.matched,
    },
  } as T;
}
