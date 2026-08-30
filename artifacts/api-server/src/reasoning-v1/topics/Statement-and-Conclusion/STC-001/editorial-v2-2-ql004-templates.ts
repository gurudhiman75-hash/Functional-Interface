import { tri } from "./editorial-v2-2-saturation-helpers.ts";
import type { StcV22Template } from "./editorial-v2-2-saturation-types.ts";

const T = tri;

export const STC_V22_QL004_TEMPLATES: readonly StcV22Template[] = [
  {
    id: "STC-V22-QL004-T01", qlId: "STC-QL-004", surfaceArchetype: "FORECAST_OUTLOOK", difficulty: "EASY", answerClass: "ONLY_I",
    dimensions: [
      [T("heavy rain", "भारी वर्षा", "ਭਾਰੀ ਮੀਂਹ"), T("dense fog", "घना कोहरा", "ਘਣੀ ਧੁੰਦ"), T("strong winds", "तेज़ हवाएँ", "ਤੇਜ਼ ਹਵਾਵਾਂ"), T("thunderstorms", "आंधी-तूफान", "ਗਰਜ-ਚਮਕ ਵਾਲੇ ਤੂਫ਼ਾਨ")],
      [T("likely", "संभावित", "ਸੰਭਾਵਿਤ"), T("quite possible", "काफी संभव", "ਕਾਫ਼ੀ ਸੰਭਵ"), T("expected", "अपेक्षित", "ਉਮੀਦ ਕੀਤੀ ਜਾ ਰਹੀ"), T("a realistic possibility", "एक वास्तविक संभावना", "ਇੱਕ ਹਕੀਕੀ ਸੰਭਾਵਨਾ")],
      [T("several parts of the district", "जिले के कई हिस्सों", "ਜ਼ਿਲ੍ਹੇ ਦੇ ਕਈ ਹਿੱਸਿਆਂ"), T("some northern blocks", "कुछ उत्तरी खंडों", "ਕੁਝ ਉੱਤਰੀ ਬਲਾਕਾਂ"), T("parts of the river belt", "नदी पट्टी के कुछ हिस्सों", "ਦਰਿਆਈ ਪੱਟੀ ਦੇ ਕੁਝ ਹਿੱਸਿਆਂ"), T("a few low-lying areas", "कुछ निचले इलाकों", "ਕੁਝ ਨੀਵੇਂ ਇਲਾਕਿਆਂ")],
      [T("tomorrow", "कल", "ਕੱਲ੍ਹ"), T("tonight", "आज रात", "ਅੱਜ ਰਾਤ"), T("during the next 24 hours", "अगले 24 घंटों में", "ਅਗਲੇ 24 ਘੰਟਿਆਂ ਦੌਰਾਨ"), T("later this evening", "आज शाम बाद में", "ਅੱਜ ਸ਼ਾਮ ਬਾਅਦ ਵਿੱਚ")],
    ],
    statement: T("The weather department says {a} is {b} in {c} {d}.", "मौसम विभाग का कहना है कि {d} {c} में {a} {b} है।", "ਮੌਸਮ ਵਿਭਾਗ ਮੁਤਾਬਕ {d} {c} ਵਿੱਚ {a} {b} ਹੈ।"),
    conclusions: [T("{a} is presented as a genuine possibility in at least part of the stated area {d}.", "{d} बताए गए क्षेत्र के कम-से-कम कुछ हिस्से में {a} को वास्तविक संभावना के रूप में बताया गया है।", "{d} ਦੱਸੇ ਖੇਤਰ ਦੇ ਘੱਟੋ-ਘੱਟ ਕੁਝ ਹਿੱਸੇ ਵਿੱਚ {a} ਨੂੰ ਹਕੀਕੀ ਸੰਭਾਵਨਾ ਵਜੋਂ ਦੱਸਿਆ ਗਿਆ ਹੈ।"), T("{a} is certain in every part of the stated area {d}.", "{d} बताए गए क्षेत्र के हर हिस्से में {a} निश्चित है।", "{d} ਦੱਸੇ ਖੇਤਰ ਦੇ ਹਰ ਹਿੱਸੇ ਵਿੱਚ {a} ਨਿਸ਼ਚਿਤ ਹੈ।")],
    explanation: [T("The wording '{b}' supports possibility, not certainty.", "'{b}' का शब्द-प्रयोग संभावना बताता है, निश्चितता नहीं।", "'{b}' ਵਾਲਾ ਸ਼ਬਦ ਸੰਭਾਵਨਾ ਦੱਸਦਾ ਹੈ, ਨਿਸ਼ਚਿਤਤਾ ਨਹੀਂ।"), T("The statement neither covers every part nor makes the event certain.", "कथन न तो हर हिस्से को शामिल करता है और न घटना को निश्चित बताता है।", "ਕਥਨ ਨਾ ਹਰ ਹਿੱਸੇ ਨੂੰ ਸ਼ਾਮਲ ਕਰਦਾ ਹੈ ਅਤੇ ਨਾ ਘਟਨਾ ਨੂੰ ਨਿਸ਼ਚਿਤ ਦੱਸਦਾ ਹੈ।")],
  },
  {
    id: "STC-V22-QL004-T02", qlId: "STC-QL-004", surfaceArchetype: "PUBLIC_NOTICE", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      [T("the examination schedule", "परीक्षा कार्यक्रम", "ਪਰੀਖਿਆ ਸਮਾਂ-ਸਾਰਣੀ"), T("the interview calendar", "साक्षात्कार कैलेंडर", "ਇੰਟਰਵਿਊ ਕੈਲੰਡਰ"), T("the counselling timetable", "काउंसलिंग समय-सारणी", "ਕਾਊਂਸਲਿੰਗ ਸਮਾਂ-ਸਾਰਣੀ"), T("the document-verification dates", "दस्तावेज़ सत्यापन तिथियाँ", "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਦੀਆਂ ਤਰੀਖਾਂ")],
      [T("revised", "संशोधित", "ਸੋਧਿਆ"), T("rescheduled", "पुनर्निर्धारित", "ਮੁੜ ਨਿਰਧਾਰਤ"), T("changed", "बदला", "ਬਦਲਿਆ"), T("partly rearranged", "आंशिक रूप से पुनर्व्यवस्थित", "ਅੰਸ਼ਿਕ ਤੌਰ ਤੇ ਮੁੜ ਵਿਵਸਥਿਤ")],
      [T("the court hearing affects the notified dates", "न्यायालय की सुनवाई अधिसूचित तिथियों को प्रभावित करती है", "ਅਦਾਲਤੀ ਸੁਣਵਾਈ ਸੂਚਿਤ ਤਰੀਖਾਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀ ਹੈ"), T("the venue becomes unavailable", "स्थान उपलब्ध नहीं रहता", "ਸਥਾਨ ਉਪਲਬਧ ਨਹੀਂ ਰਹਿੰਦਾ"), T("the declared holiday changes", "घोषित अवकाश में बदलाव होता है", "ਘੋਸ਼ਿਤ ਛੁੱਟੀ ਬਦਲਦੀ ਹੈ"), T("the recruitment board receives a binding direction", "भर्ती बोर्ड को बाध्यकारी निर्देश मिलता है", "ਭਰਤੀ ਬੋਰਡ ਨੂੰ ਬਾਧਕ ਹੁਕਮ ਮਿਲਦਾ ਹੈ")],
      [T("No final decision has been issued.", "अभी कोई अंतिम निर्णय जारी नहीं हुआ है।", "ਹਾਲੇ ਕੋਈ ਅੰਤਿਮ ਫ਼ੈਸਲਾ ਜਾਰੀ ਨਹੀਂ ਹੋਇਆ।"), T("The present dates remain in force for now.", "फिलहाल वर्तमान तिथियाँ लागू हैं।", "ਫਿਲਹਾਲ ਮੌਜੂਦਾ ਤਰੀਖਾਂ ਲਾਗੂ ਹਨ।"), T("No amended notice has yet been published.", "अभी तक कोई संशोधित सूचना प्रकाशित नहीं हुई है।", "ਹਾਲੇ ਤੱਕ ਕੋਈ ਸੋਧੀ ਸੂਚਨਾ ਜਾਰੀ ਨਹੀਂ ਹੋਈ।"), T("The board says the matter is still open.", "बोर्ड का कहना है कि मामला अभी खुला है।", "ਬੋਰਡ ਮੁਤਾਬਕ ਮਾਮਲਾ ਹਾਲੇ ਖੁੱਲ੍ਹਾ ਹੈ।")],
    ],
    statement: T("The board says {a} may be {b} if {c}. {d}", "बोर्ड का कहना है कि यदि {c}, तो {a} {b} जा सकता है। {d}", "ਬੋਰਡ ਕਹਿੰਦਾ ਹੈ ਕਿ ਜੇ {c}, ਤਾਂ {a} {b} ਜਾ ਸਕਦਾ ਹੈ। {d}"),
    conclusions: [T("{a} has already been {b}.", "{a} पहले ही {b} जा चुका है।", "{a} ਪਹਿਲਾਂ ਹੀ {b} ਜਾ ਚੁੱਕਾ ਹੈ।"), T("A {b} version of {a} remains possible under the stated condition.", "बताई गई शर्त में {a} का {b} रूप अभी भी संभव है।", "ਦੱਸੀ ਸ਼ਰਤ ਹੇਠ {a} ਦਾ {b} ਰੂਪ ਹਾਲੇ ਵੀ ਸੰਭਵ ਹੈ।")],
    explanation: [T("The notice describes only a possible future change and explicitly withholds a final decision.", "सूचना केवल संभावित भविष्य के बदलाव की बात करती है और अंतिम निर्णय नहीं बताती।", "ਸੂਚਨਾ ਸਿਰਫ਼ ਸੰਭਾਵਿਤ ਭਵਿੱਖੀ ਬਦਲਾਅ ਦੀ ਗੱਲ ਕਰਦੀ ਹੈ ਅਤੇ ਅੰਤਿਮ ਫ਼ੈਸਲਾ ਨਹੀਂ ਦੱਸਦੀ।"), T("The modal wording supports a possible change if {c}.", "संभावना वाला शब्द-प्रयोग {c} होने पर बदलाव का समर्थन करता है।", "ਸੰਭਾਵਨਾ ਵਾਲਾ ਸ਼ਬਦ {c} ਹੋਣ ਤੇ ਬਦਲਾਅ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।")],
  },
  {
    id: "STC-V22-QL004-T03", qlId: "STC-QL-004", surfaceArchetype: "QUOTED_CLAIM", difficulty: "MEDIUM", answerClass: "BOTH",
    dimensions: [
      [T("inflation", "महंगाई", "ਮਹਿੰਗਾਈ"), T("fuel demand", "ईंधन मांग", "ਇੰਧਨ ਮੰਗ"), T("loan growth", "ऋण वृद्धि", "ਕਰਜ਼ਾ ਵਾਧਾ"), T("food-price pressure", "खाद्य-मूल्य दबाव", "ਖਾਦ ਪਦਾਰਥਾਂ ਦੀ ਕੀਮਤ ਦਾ ਦਬਾਅ")],
      [T("ease further", "और कम हो सकता है", "ਹੋਰ ਘਟ ਸਕਦਾ ਹੈ"), T("rise moderately", "मध्यम रूप से बढ़ सकता है", "ਦਰਮਿਆਨੇ ਤੌਰ ਤੇ ਵੱਧ ਸਕਦਾ ਹੈ"), T("remain soft", "नरम बना रह सकता है", "ਨਰਮ ਰਹਿ ਸਕਦਾ ਹੈ"), T("strengthen slightly", "थोड़ा मजबूत हो सकता है", "ਥੋੜ੍ਹਾ ਮਜ਼ਬੂਤ ਹੋ ਸਕਦਾ ਹੈ")],
      [T("this quarter", "इस तिमाही", "ਇਸ ਤਿਮਾਹੀ"), T("over the next two months", "अगले दो महीनों में", "ਅਗਲੇ ਦੋ ਮਹੀਨਿਆਂ ਵਿੱਚ"), T("during the festive period", "त्योहारी अवधि में", "ਤਿਉਹਾਰੀ ਅਵਧੀ ਦੌਰਾਨ"), T("before the year-end review", "वर्षांत समीक्षा से पहले", "ਸਾਲਾਨਾ ਸਮੀਖਿਆ ਤੋਂ ਪਹਿਲਾਂ")],
      [T("the latest data are mixed", "नवीनतम आँकड़े मिश्रित हैं", "ਤਾਜ਼ਾ ਅੰਕੜੇ ਮਿਲੇ-ਜੁਲੇ ਹਨ"), T("the evidence is still limited", "साक्ष्य अभी सीमित हैं", "ਸਬੂਤ ਹਾਲੇ ਸੀਮਿਤ ਹਨ"), T("the trend is not yet stable", "रुझान अभी स्थिर नहीं है", "ਰੁਝਾਨ ਹਾਲੇ ਸਥਿਰ ਨਹੀਂ"), T("one more data release is awaited", "एक और आँकड़ा जारी होना बाकी है", "ਇੱਕ ਹੋਰ ਅੰਕੜਾ ਜਾਰੀ ਹੋਣਾ ਬਾਕੀ ਹੈ")],
    ],
    statement: T("An analyst said, \"{a} could {b} {c}, but {d}, so that outcome cannot yet be called certain.\"", "एक विश्लेषक ने कहा, \"{a} {c} {b}, लेकिन {d}; इसलिए इस परिणाम को अभी निश्चित नहीं कहा जा सकता।\"", "ਇੱਕ ਵਿਸ਼ਲੇਸ਼ਕ ਨੇ ਕਿਹਾ, \"{a} {c} {b}, ਪਰ {d}; ਇਸ ਲਈ ਇਸ ਨਤੀਜੇ ਨੂੰ ਹਾਲੇ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕਿਹਾ ਜਾ ਸਕਦਾ।\""),
    conclusions: [T("The stated movement in {a} is presented as possible {c}.", "{a} में बताया गया बदलाव {c} संभव बताया गया है।", "{a} ਵਿੱਚ ਦੱਸਿਆ ਬਦਲਾਅ {c} ਸੰਭਵ ਦੱਸਿਆ ਗਿਆ ਹੈ।"), T("The analyst does not present that movement as certain.", "विश्लेषक उस बदलाव को निश्चित नहीं बताता।", "ਵਿਸ਼ਲੇਸ਼ਕ ਉਸ ਬਦਲਾਅ ਨੂੰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਦੱਸਦਾ।")],
    explanation: [T("'Could' explicitly marks the movement as possible.", "'हो सकता है' स्पष्ट रूप से संभावना बताता है।", "'ਹੋ ਸਕਦਾ ਹੈ' ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਸੰਭਾਵਨਾ ਦੱਸਦਾ ਹੈ।"), T("The quotation expressly says certainty is not justified yet because {d}.", "उद्धरण स्पष्ट रूप से कहता है कि {d}, इसलिए अभी निश्चितता उचित नहीं है।", "ਕਥਨ ਸਪਸ਼ਟ ਕਹਿੰਦਾ ਹੈ ਕਿ {d}, ਇਸ ਲਈ ਹਾਲੇ ਨਿਸ਼ਚਿਤਤਾ ਠੀਕ ਨਹੀਂ।")],
  },
  {
    id: "STC-V22-QL004-T04", qlId: "STC-QL-004", surfaceArchetype: "SURVEY_REPORT", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      [T("digital transactions", "डिजिटल लेन-देन", "ਡਿਜ਼ਿਟਲ ਲੈਣ-ਦੇਣ"), T("online applications", "ऑनलाइन आवेदन", "ਆਨਲਾਈਨ ਅਰਜ਼ੀਆਂ"), T("mobile-service usage", "मोबाइल सेवा उपयोग", "ਮੋਬਾਈਲ ਸੇਵਾ ਵਰਤੋਂ"), T("electronic bill payments", "इलेक्ट्रॉनिक बिल भुगतान", "ਇਲੈਕਟ੍ਰਾਨਿਕ ਬਿੱਲ ਭੁਗਤਾਨ")],
      [T("the festival period", "त्योहारी अवधि", "ਤਿਉਹਾਰੀ ਅਵਧੀ"), T("the admission window", "प्रवेश अवधि", "ਦਾਖ਼ਲਾ ਅਵਧੀ"), T("the year-end week", "वर्षांत सप्ताह", "ਸਾਲਾਨਾ ਅੰਤਲਾ ਹਫ਼ਤਾ"), T("the next billing cycle", "अगले बिलिंग चक्र", "ਅਗਲੇ ਬਿਲਿੰਗ ਚੱਕਰ")],
      [T("15", "15", "15"), T("20", "20", "20"), T("25", "25", "25"), T("30", "30", "30")],
      [T("customers", "ग्राहक", "ਗਾਹਕ"), T("applicants", "आवेदक", "ਅਰਜ਼ੀਕਾਰ"), T("account holders", "खाताधारक", "ਖਾਤਾਧਾਰਕ"), T("registered users", "पंजीकृत उपयोगकर्ता", "ਰਜਿਸਟਰਡ ਵਰਤੋਂਕਾਰ")],
    ],
    statement: T("The report expects {a} to increase during {b}, but gives no estimate of the size of the increase.", "रिपोर्ट में {b} के दौरान {a} बढ़ने की अपेक्षा है, लेकिन वृद्धि के आकार का कोई अनुमान नहीं दिया गया है।", "ਰਿਪੋਰਟ ਵਿੱਚ {b} ਦੌਰਾਨ {a} ਵੱਧਣ ਦੀ ਉਮੀਦ ਹੈ, ਪਰ ਵਾਧੇ ਦੇ ਆਕਾਰ ਦਾ ਕੋਈ ਅੰਦਾਜ਼ਾ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।"),
    conclusions: [T("{a} will certainly rise by at least {c}% during {b}.", "{b} में {a} निश्चित रूप से कम-से-कम {c}% बढ़ेगा।", "{b} ਵਿੱਚ {a} ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਘੱਟੋ-ਘੱਟ {c}% ਵੱਧੇਗਾ।"), T("Every {d} will use the relevant digital channel during {b}.", "{b} में प्रत्येक {d} संबंधित डिजिटल माध्यम का उपयोग करेगा।", "{b} ਵਿੱਚ ਹਰ {d} ਸੰਬੰਧਿਤ ਡਿਜ਼ਿਟਲ ਮਾਧਿਅਮ ਵਰਤੇਗਾ।")],
    explanation: [T("No percentage or certainty is supplied.", "कोई प्रतिशत या निश्चितता नहीं दी गई है।", "ਕੋਈ ਪ੍ਰਤੀਸ਼ਤ ਜਾਂ ਨਿਸ਼ਚਿਤਤਾ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।"), T("An expected aggregate increase does not establish universal behaviour by every {d}.", "कुल वृद्धि की अपेक्षा प्रत्येक {d} के सार्वभौमिक व्यवहार को सिद्ध नहीं करती।", "ਕੁੱਲ ਵਾਧੇ ਦੀ ਉਮੀਦ ਹਰ {d} ਦੇ ਇਕਸਾਰ ਵਿਹਾਰ ਨੂੰ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।")],
  },
  {
    id: "STC-V22-QL004-T05", qlId: "STC-QL-004", surfaceArchetype: "ADVICE_WARNING", difficulty: "HARD", answerClass: "ONLY_I",
    dimensions: [
      [T("strong winds", "तेज़ हवाएँ", "ਤੇਜ਼ ਹਵਾਵਾਂ"), T("poor visibility", "कम दृश्यता", "ਘੱਟ ਦਿੱਖ"), T("high waves", "ऊँची लहरें", "ਉੱਚੀਆਂ ਲਹਿਰਾਂ"), T("dense fog", "घना कोहरा", "ਘਣੀ ਧੁੰਦ")],
      [T("ferry services", "फेरी सेवाएँ", "ਫੈਰੀ ਸੇਵਾਵਾਂ"), T("airport operations", "हवाई अड्डा संचालन", "ਹਵਾਈ ਅੱਡਾ ਕਾਰਵਾਈ"), T("highway traffic", "राजमार्ग यातायात", "ਹਾਈਵੇ ਟ੍ਰੈਫ਼ਿਕ"), T("river transport", "नदी परिवहन", "ਦਰਿਆਈ ਆਵਾਜਾਈ")],
      [T("tonight", "आज रात", "ਅੱਜ ਰਾਤ"), T("tomorrow morning", "कल सुबह", "ਕੱਲ੍ਹ ਸਵੇਰੇ"), T("during the evening peak", "शाम के व्यस्त समय में", "ਸ਼ਾਮ ਦੇ ਰੁਸ਼ ਸਮੇਂ"), T("over the next few hours", "अगले कुछ घंटों में", "ਅਗਲੇ ਕੁਝ ਘੰਟਿਆਂ ਵਿੱਚ")],
      [T("the latest advisory", "नवीनतम परामर्श", "ਤਾਜ਼ਾ ਸਲਾਹ"), T("the district warning", "जिला चेतावनी", "ਜ਼ਿਲ੍ਹਾ ਚੇਤਾਵਨੀ"), T("the safety bulletin", "सुरक्षा बुलेटिन", "ਸੁਰੱਖਿਆ ਬੁਲੇਟਿਨ"), T("the operations alert", "संचालन चेतावनी", "ਕਾਰਵਾਈ ਚੇਤਾਵਨੀ")],
    ],
    statement: T("According to {d}, {a} could disrupt {b} {c}.", "{d} के अनुसार {a} {c} {b} को बाधित कर सकती हैं।", "{d} ਅਨੁਸਾਰ {a} {c} {b} ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੇ ਹਨ।"),
    conclusions: [T("Disruption to {b} {c} is possible.", "{c} {b} में बाधा संभव है।", "{c} {b} ਵਿੱਚ ਰੁਕਾਵਟ ਸੰਭਵ ਹੈ।"), T("All {b} will definitely be cancelled or stopped {c}.", "{c} सभी {b} निश्चित रूप से रद्द या बंद होंगी।", "{c} ਸਾਰੀਆਂ {b} ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਰੱਦ ਜਾਂ ਬੰਦ ਹੋਣਗੀਆਂ।")],
    explanation: [T("'Could disrupt' establishes possibility.", "'बाधित कर सकती हैं' संभावना स्थापित करता है।", "'ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੇ ਹਨ' ਸੰਭਾਵਨਾ ਦੱਸਦਾ ਹੈ।"), T("Possible disruption is weaker than certain cancellation of every service.", "संभावित बाधा हर सेवा के निश्चित रद्द होने से कमजोर दावा है।", "ਸੰਭਾਵਿਤ ਰੁਕਾਵਟ ਹਰ ਸੇਵਾ ਦੇ ਨਿਸ਼ਚਿਤ ਰੱਦ ਹੋਣ ਨਾਲੋਂ ਕਮਜ਼ੋਰ ਦਾਅਵਾ ਹੈ।")],
  },
  {
    id: "STC-V22-QL004-T06", qlId: "STC-QL-004", surfaceArchetype: "CONTRAST_CONCESSION", difficulty: "HARD", answerClass: "ONLY_II",
    dimensions: [
      [T("extending the application deadline", "आवेदन की अंतिम तिथि बढ़ाने", "ਅਰਜ਼ੀ ਦੀ ਆਖਰੀ ਤਰੀਖ ਵਧਾਉਣ"), T("adding an extra counselling round", "एक अतिरिक्त काउंसलिंग दौर जोड़ने", "ਇੱਕ ਵਾਧੂ ਕਾਊਂਸਲਿੰਗ ਦੌਰ ਜੋੜਣ"), T("shifting the interview dates", "साक्षात्कार तिथियाँ बदलने", "ਇੰਟਰਵਿਊ ਤਰੀਖਾਂ ਬਦਲਣ"), T("opening a second verification window", "दूसरी सत्यापन अवधि खोलने", "ਦੂਜੀ ਜਾਂਚ ਅਵਧੀ ਖੋਲ੍ਹਣ")],
      [T("no decision has yet been approved", "अभी कोई निर्णय स्वीकृत नहीं हुआ है", "ਹਾਲੇ ਕੋਈ ਫ਼ੈਸਲਾ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੋਇਆ"), T("the proposal is still under examination", "प्रस्ताव अभी विचाराधीन है", "ਪ੍ਰਸਤਾਵ ਹਾਲੇ ਵਿਚਾਰ ਅਧੀਨ ਹੈ"), T("the competent authority has not signed off", "सक्षम प्राधिकारी ने अभी मंजूरी नहीं दी है", "ਸਮਰੱਥ ਅਧਿਕਾਰੀ ਨੇ ਹਾਲੇ ਮਨਜ਼ੂਰੀ ਨਹੀਂ ਦਿੱਤੀ"), T("the matter remains open", "मामला अभी खुला है", "ਮਾਮਲਾ ਹਾਲੇ ਖੁੱਲ੍ਹਾ ਹੈ")],
      [T("the recruitment board", "भर्ती बोर्ड", "ਭਰਤੀ ਬੋਰਡ"), T("the university", "विश्वविद्यालय", "ਯੂਨੀਵਰਸਿਟੀ"), T("the department", "विभाग", "ਵਿਭਾਗ"), T("the examination authority", "परीक्षा प्राधिकरण", "ਪਰੀਖਿਆ ਅਥਾਰਟੀ")],
      [T("after receiving candidate representations", "उम्मीदवारों के अभ्यावेदन मिलने के बाद", "ਉਮੀਦਵਾਰਾਂ ਦੀਆਂ ਅਰਜ਼ੀਆਂ ਮਿਲਣ ਤੋਂ ਬਾਅਦ"), T("because of portal complaints", "पोर्टल शिकायतों के कारण", "ਪੋਰਟਲ ਸ਼ਿਕਾਇਤਾਂ ਕਰਕੇ"), T("following a venue issue", "स्थान संबंधी समस्या के बाद", "ਸਥਾਨ ਸੰਬੰਧੀ ਸਮੱਸਿਆ ਤੋਂ ਬਾਅਦ"), T("after reviewing attendance constraints", "उपस्थिति संबंधी बाधाओं की समीक्षा के बाद", "ਹਾਜ਼ਰੀ ਸੰਬੰਧੀ ਪਾਬੰਦੀਆਂ ਦੀ ਸਮੀਖਿਆ ਤੋਂ ਬਾਅਦ")],
    ],
    statement: T("{c} is considering {a} {d}, but {b}.", "{c} {d} {a} पर विचार कर रहा है, लेकिन {b}।", "{c} {d} {a} ਬਾਰੇ ਵਿਚਾਰ ਕਰ ਰਿਹਾ ਹੈ, ਪਰ {b}।"),
    conclusions: [T("{a} has definitely been approved.", "{a} निश्चित रूप से स्वीकृत हो चुका है।", "{a} ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਮਨਜ਼ੂਰ ਹੋ ਚੁੱਕਾ ਹੈ।"), T("{a} remains under consideration rather than confirmed.", "{a} की स्थिति पुष्टि के बजाय अभी विचाराधीन है।", "{a} ਦੀ ਸਥਿਤੀ ਪੁਸ਼ਟੀ ਦੀ ਬਜਾਏ ਹਾਲੇ ਵਿਚਾਰ ਅਧੀਨ ਹੈ।")],
    explanation: [T("The statement explicitly says the decision is not final: {b}.", "कथन स्पष्ट करता है कि निर्णय अंतिम नहीं है: {b}।", "ਕਥਨ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ ਕਿ ਫ਼ੈਸਲਾ ਅੰਤਿਮ ਨਹੀਂ: {b}।"), T("Considering a proposal supports possibility, not completed approval.", "किसी प्रस्ताव पर विचार होना संभावना बताता है, पूर्ण स्वीकृति नहीं।", "ਕਿਸੇ ਪ੍ਰਸਤਾਵ ਤੇ ਵਿਚਾਰ ਹੋਣਾ ਸੰਭਾਵਨਾ ਦੱਸਦਾ ਹੈ, ਪੂਰੀ ਮਨਜ਼ੂਰੀ ਨਹੀਂ।")],
  },
  {
    id: "STC-V22-QL004-T07", qlId: "STC-QL-004", surfaceArchetype: "EVENT_SEQUENCE", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      [T("the bridge", "पुल", "ਪੁਲ"), T("the flyover", "फ्लाईओवर", "ਫ਼ਲਾਈਓਵਰ"), T("the tunnel", "सुरंग", "ਸੁਰੰਗ"), T("the river crossing", "नदी पार मार्ग", "ਦਰਿਆ ਪਾਰ ਮਾਰਗ")],
      [T("Monday", "सोमवार", "ਸੋਮਵਾਰ"), T("Tuesday", "मंगलवार", "ਮੰਗਲਵਾਰ"), T("Thursday", "गुरुवार", "ਵੀਰਵਾਰ"), T("Saturday", "शनिवार", "ਸ਼ਨੀਵਾਰ")],
      [T("reopen", "फिर खुल", "ਮੁੜ ਖੁੱਲ੍ਹ"), T("return to normal traffic", "सामान्य यातायात के लिए खुल", "ਸਧਾਰਣ ਟ੍ਰੈਫ਼ਿਕ ਲਈ ਖੁੱਲ੍ਹ"), T("resume public use", "जन उपयोग के लिए फिर शुरू", "ਜਨਤਕ ਵਰਤੋਂ ਲਈ ਮੁੜ ਸ਼ੁਰੂ"), T("be cleared for regular use", "नियमित उपयोग के लिए मंजूर", "ਨਿਯਮਤ ਵਰਤੋਂ ਲਈ ਮਨਜ਼ੂਰ")],
      [T("later in the week", "सप्ताह में बाद में", "ਹਫ਼ਤੇ ਵਿੱਚ ਬਾਅਦ"), T("the following day", "अगले दिन", "ਅਗਲੇ ਦਿਨ"), T("before the weekend", "सप्ताहांत से पहले", "ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਤੋਂ ਪਹਿਲਾਂ"), T("after a final safety check", "अंतिम सुरक्षा जाँच के बाद", "ਅੰਤਿਮ ਸੁਰੱਖਿਆ ਜਾਂਚ ਤੋਂ ਬਾਅਦ")],
    ],
    statement: T("Engineers will inspect {a} on {b}; if the inspection is satisfactory, it could {c} {d}. No reopening decision has yet been made.", "इंजीनियर {b} {a} का निरीक्षण करेंगे; निरीक्षण संतोषजनक होने पर यह {d} {c} सकता है। अभी कोई अंतिम पुनःखोलने का निर्णय नहीं हुआ है।", "ਇੰਜੀਨੀਅਰ {b} {a} ਦੀ ਜਾਂਚ ਕਰਨਗੇ; ਜਾਂਚ ਸੰਤੋਸ਼ਜਨਕ ਹੋਵੇ ਤਾਂ ਇਹ {d} {c} ਸਕਦਾ ਹੈ। ਹਾਲੇ ਕੋਈ ਅੰਤਿਮ ਮੁੜ ਖੋਲ੍ਹਣ ਦਾ ਫ਼ੈਸਲਾ ਨਹੀਂ ਹੋਇਆ।"),
    conclusions: [T("The stated return to use is a conditional possibility.", "बताया गया पुनःउपयोग एक शर्त पर आधारित संभावना है।", "ਦੱਸਿਆ ਮੁੜ ਵਰਤੋਂ ਦਾ ਮਾਮਲਾ ਇੱਕ ਸ਼ਰਤ ਵਾਲੀ ਸੰਭਾਵਨਾ ਹੈ।"), T("The statement does not present reopening as certain.", "कथन पुनःखोलने को निश्चित नहीं बताता।", "ਕਥਨ ਮੁੜ ਖੋਲ੍ਹਣ ਨੂੰ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਦੱਸਦਾ।")],
    explanation: [T("'Could' is explicitly tied to a satisfactory inspection.", "'सकता है' स्पष्ट रूप से संतोषजनक निरीक्षण की शर्त से जुड़ा है।", "'ਸਕਦਾ ਹੈ' ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਸੰਤੋਸ਼ਜਨਕ ਜਾਂਚ ਦੀ ਸ਼ਰਤ ਨਾਲ ਜੁੜਿਆ ਹੈ।"), T("The final sentence expressly says no reopening decision has yet been made.", "अंतिम वाक्य स्पष्ट करता है कि पुनःखोलने का निर्णय अभी नहीं हुआ है।", "ਆਖਰੀ ਵਾਕ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ ਕਿ ਮੁੜ ਖੋਲ੍ਹਣ ਦਾ ਫ਼ੈਸਲਾ ਹਾਲੇ ਨਹੀਂ ਹੋਇਆ।")],
  },
  {
    id: "STC-V22-QL004-T08", qlId: "STC-QL-004", surfaceArchetype: "ONE_LINE_FACT", difficulty: "MEDIUM", answerClass: "NEITHER",
    dimensions: [
      [T("hostel fees", "छात्रावास शुल्क", "ਹੋਸਟਲ ਫੀਸ"), T("library charges", "पुस्तकालय शुल्क", "ਲਾਇਬ੍ਰੇਰੀ ਫੀਸ"), T("transport fees", "परिवहन शुल्क", "ਆਵਾਜਾਈ ਫੀਸ"), T("laboratory charges", "प्रयोगशाला शुल्क", "ਲੈਬ ਫੀਸ")],
      [T("the next academic session", "अगले शैक्षणिक सत्र", "ਅਗਲੇ ਅਕਾਦਮਿਕ ਸੈਸ਼ਨ"), T("the next semester", "अगले सेमेस्टर", "ਅਗਲੇ ਸਮੈਸਟਰ"), T("the annual review", "वार्षिक समीक्षा", "ਸਾਲਾਨਾ ਸਮੀਖਿਆ"), T("the next fee cycle", "अगले शुल्क चक्र", "ਅਗਲੇ ਫੀਸ ਚੱਕਰ")],
      [T("the finance committee", "वित्त समिति", "ਵਿੱਤ ਕਮੇਟੀ"), T("the university notice", "विश्वविद्यालय सूचना", "ਯੂਨੀਵਰਸਿਟੀ ਸੂਚਨਾ"), T("the administrative office", "प्रशासनिक कार्यालय", "ਪ੍ਰਸ਼ਾਸਕੀ ਦਫ਼ਤਰ"), T("the governing body", "शासी निकाय", "ਪ੍ਰਬੰਧਕ ਸਰੀਰ")],
      [T("at present", "फिलहाल", "ਫਿਲਹਾਲ"), T("under current conditions", "वर्तमान परिस्थितियों में", "ਮੌਜੂਦਾ ਹਾਲਾਤਾਂ ਵਿੱਚ"), T("on the information available", "उपलब्ध जानकारी के आधार पर", "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ"), T("before the scheduled review", "निर्धारित समीक्षा से पहले", "ਨਿਰਧਾਰਤ ਸਮੀਖਿਆ ਤੋਂ ਪਹਿਲਾਂ")],
    ],
    statement: T("According to {c}, {a} are unlikely to be revised before {b} {d}.", "{c} के अनुसार {d} {a} में {b} से पहले संशोधन होने की संभावना कम है।", "{c} ਅਨੁਸਾਰ {d} {a} ਵਿੱਚ {b} ਤੋਂ ਪਹਿਲਾਂ ਸੋਧ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਘੱਟ ਹੈ।"),
    conclusions: [T("A revision of {a} before {b} is impossible.", "{b} से पहले {a} में संशोधन असंभव है।", "{b} ਤੋਂ ਪਹਿਲਾਂ {a} ਵਿੱਚ ਸੋਧ ਅਸੰਭਵ ਹੈ।"), T("{a} have already been revised for {b}.", "{a} पहले ही {b} के लिए संशोधित हो चुके हैं।", "{a} ਪਹਿਲਾਂ ਹੀ {b} ਲਈ ਸੋਧੇ ਜਾ ਚੁੱਕੇ ਹਨ।")],
    explanation: [T("'Unlikely' is weaker than 'impossible'.", "'संभावना कम' का अर्थ 'असंभव' नहीं होता।", "'ਸੰਭਾਵਨਾ ਘੱਟ' ਦਾ ਅਰਥ 'ਅਸੰਭਵ' ਨਹੀਂ ਹੁੰਦਾ।"), T("The statement gives no completed revision.", "कथन किसी पूर्ण हो चुके संशोधन की जानकारी नहीं देता।", "ਕਥਨ ਕਿਸੇ ਮੁਕੰਮਲ ਹੋ ਚੁੱਕੀ ਸੋਧ ਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿੰਦਾ।")],
  },
] as const;
