import { tri } from "./editorial-v2-2-saturation-helpers.ts";
import type { StcV22Template } from "./editorial-v2-2-saturation-types.ts";

const T = tri;

export const STC_V22_QL003_TEMPLATES: readonly StcV22Template[] = [
  {
    id: "STC-V22-QL003-T01", qlId: "STC-QL-003", surfaceArchetype: "RULE_ELIGIBILITY", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      [T("the internship interview", "इंटर्नशिप साक्षात्कार", "ਇੰਟਰਨਸ਼ਿਪ ਇੰਟਰਵਿਊ"), T("the trainee selection interview", "प्रशिक्षु चयन साक्षात्कार", "ਟ੍ਰੇਨੀ ਚੋਣ ਇੰਟਰਵਿਊ"), T("the scholarship interview", "छात्रवृत्ति साक्षात्कार", "ਸਕਾਲਰਸ਼ਿਪ ਇੰਟਰਵਿਊ"), T("the fellowship interview", "फेलोशिप साक्षात्कार", "ਫੈਲੋਸ਼ਿਪ ਇੰਟਰਵਿਊ")],
      [T("at least 55% marks and age below 28 years", "कम से कम 55% अंक और आयु 28 वर्ष से कम", "ਘੱਟੋ-ਘੱਟ 55% ਅੰਕ ਅਤੇ ਉਮਰ 28 ਸਾਲ ਤੋਂ ਘੱਟ"), T("at least 60% marks and age below 29 years", "कम से कम 60% अंक और आयु 29 वर्ष से कम", "ਘੱਟੋ-ਘੱਟ 60% ਅੰਕ ਅਤੇ ਉਮਰ 29 ਸਾਲ ਤੋਂ ਘੱਟ"), T("at least 65% marks and age below 30 years", "कम से कम 65% अंक और आयु 30 वर्ष से कम", "ਘੱਟੋ-ਘੱਟ 65% ਅੰਕ ਅਤੇ ਉਮਰ 30 ਸਾਲ ਤੋਂ ਘੱਟ"), T("at least 70% marks and age below 31 years", "कम से कम 70% अंक और आयु 31 वर्ष से कम", "ਘੱਟੋ-ਘੱਟ 70% ਅੰਕ ਅਤੇ ਉਮਰ 31 ਸਾਲ ਤੋਂ ਘੱਟ")],
      [T("Meera", "मीरा", "ਮੀਰਾ"), T("Anita", "अनीता", "ਅਨੀਤਾ"), T("Rahul", "राहुल", "ਰਾਹੁਲ"), T("Karan", "करण", "ਕਰਨ")],
      [T("22 years old with 78% marks", "22 वर्ष की आयु और 78% अंक", "22 ਸਾਲ ਉਮਰ ਅਤੇ 78% ਅੰਕ"), T("23 years old with 82% marks", "23 वर्ष की आयु और 82% अंक", "23 ਸਾਲ ਉਮਰ ਅਤੇ 82% ਅੰਕ"), T("24 years old with 86% marks", "24 वर्ष की आयु और 86% अंक", "24 ਸਾਲ ਉਮਰ ਅਤੇ 86% ਅੰਕ"), T("25 years old with 90% marks", "25 वर्ष की आयु और 90% अंक", "25 ਸਾਲ ਉਮਰ ਅਤੇ 90% ਅੰਕ")],
    ],
    statement: T("A candidate is eligible for {a} if the candidate has {b}. {c} is {d}.", "यदि किसी अभ्यर्थी के पास {b} है तो वह {a} के लिए पात्र है। {c} की आयु और अंक {d} हैं।", "ਜੇ ਕਿਸੇ ਉਮੀਦਵਾਰ ਕੋਲ {b} ਹੈ ਤਾਂ ਉਹ {a} ਲਈ ਯੋਗ ਹੈ। {c} ਦੀ ਉਮਰ ਅਤੇ ਅੰਕ {d} ਹਨ।"),
    conclusions: [T("{c} satisfies the stated conditions for {a}.", "{c} {a} की बताई गई शर्तें पूरी करता/करती है।", "{c} {a} ਲਈ ਦੱਸੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦਾ/ਕਰਦੀ ਹੈ।"), T("{c} has already been finally selected.", "{c} का अंतिम चयन हो चुका है।", "{c} ਦੀ ਅੰਤਿਮ ਚੋਣ ਹੋ ਚੁੱਕੀ ਹੈ।")],
    explanation: [T("Every permitted profile in {d} exceeds the marks threshold and stays below the age limit in {b}.", "{d} में दिए हर अनुमत विवरण के अंक {b} की सीमा से अधिक और आयु सीमा से कम हैं।", "{d} ਵਿੱਚ ਦਿੱਤਾ ਹਰ ਮਨਜ਼ੂਰ ਵੇਰਵਾ {b} ਦੀ ਅੰਕ ਸੀਮਾ ਤੋਂ ਵੱਧ ਅਤੇ ਉਮਰ ਸੀਮਾ ਤੋਂ ਘੱਟ ਹੈ।"), T("Eligibility for interview does not establish final selection.", "साक्षात्कार की पात्रता अंतिम चयन सिद्ध नहीं करती।", "ਇੰਟਰਵਿਊ ਯੋਗਤਾ ਅੰਤਿਮ ਚੋਣ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।")],
  },
  {
    id: "STC-V22-QL003-T02", qlId: "STC-QL-003", surfaceArchetype: "ONE_LINE_FACT", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      [T("a performance bonus", "प्रदर्शन बोनस", "ਕਾਰਗੁਜ਼ਾਰੀ ਬੋਨਸ"), T("an annual incentive", "वार्षिक प्रोत्साहन", "ਸਾਲਾਨਾ ਪ੍ਰੋਤਸਾਹਨ"), T("a productivity award payment", "उत्पादकता पुरस्कार भुगतान", "ਉਤਪਾਦਕਤਾ ਇਨਾਮ ਭੁਗਤਾਨ"), T("a target-linked allowance", "लक्ष्य-आधारित भत्ता", "ਟੀਚਾ-ਅਧਾਰਿਤ ਭੱਤਾ")],
      [T("the annual profit target is met", "वार्षिक लाभ लक्ष्य पूरा हो", "ਸਾਲਾਨਾ ਮੁਨਾਫ਼ਾ ਟੀਚਾ ਪੂਰਾ ਹੋਵੇ"), T("the approved output target is achieved", "स्वीकृत उत्पादन लक्ष्य प्राप्त हो", "ਮਨਜ਼ੂਰ ਉਤਪਾਦਨ ਟੀਚਾ ਹਾਸਲ ਹੋਵੇ"), T("the service-quality benchmark is met", "सेवा-गुणवत्ता मानक पूरा हो", "ਸੇਵਾ-ਗੁਣਵੱਤਾ ਮਾਪਦੰਡ ਪੂਰਾ ਹੋਵੇ"), T("the yearly recovery target is achieved", "वार्षिक वसूली लक्ष्य प्राप्त हो", "ਸਾਲਾਨਾ ਵਸੂਲੀ ਟੀਚਾ ਹਾਸਲ ਹੋਵੇ")],
      [T("the company", "कंपनी", "ਕੰਪਨੀ"), T("the branch", "शाखा", "ਸ਼ਾਖਾ"), T("the production unit", "उत्पादन इकाई", "ਉਤਪਾਦਨ ਯੂਨਿਟ"), T("the department", "विभाग", "ਵਿਭਾਗ")],
      [T("this year", "इस वर्ष", "ਇਸ ਸਾਲ"), T("for the current cycle", "वर्तमान चक्र के लिए", "ਮੌਜੂਦਾ ਚੱਕਰ ਲਈ"), T("for the latest assessment period", "नवीनतम मूल्यांकन अवधि के लिए", "ਤਾਜ਼ਾ ਮੁਲਾਂਕਣ ਮਿਆਦ ਲਈ"), T("for the completed financial year", "समाप्त वित्त वर्ष के लिए", "ਮੁਕੰਮਲ ਵਿੱਤੀ ਸਾਲ ਲਈ")],
    ],
    statement: T("{a} is payable only if {b}. {c} paid {a} {d}.", "{a} तभी देय है जब {b}। {c} ने {d} {a} का भुगतान किया।", "{a} ਤਦ ਹੀ ਦੇਣਯੋਗ ਹੈ ਜਦੋਂ {b}। {c} ਨੇ {d} {a} ਦਾ ਭੁਗਤਾਨ ਕੀਤਾ।"),
    conclusions: [T("The stated condition {b} need not have been met.", "बताई गई शर्त कि {b}, पूरी होना आवश्यक नहीं था।", "ਦੱਸੀ ਸ਼ਰਤ ਕਿ {b}, ਪੂਰੀ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਸੀ।"), T("The stated necessary condition for paying {a} was met {d}.", "{a} के भुगतान की आवश्यक शर्त {d} पूरी हुई थी।", "{a} ਦੇ ਭੁਗਤਾਨ ਦੀ ਲਾਜ਼ਮੀ ਸ਼ਰਤ {d} ਪੂਰੀ ਹੋਈ ਸੀ।")],
    explanation: [T("An only-if rule makes {b} necessary for payment.", "'तभी जब' नियम {b} को भुगतान के लिए आवश्यक बनाता है।", "'ਤਦ ਹੀ ਜਦੋਂ' ਨਿਯਮ {b} ਨੂੰ ਭੁਗਤਾਨ ਲਈ ਲਾਜ਼ਮੀ ਬਣਾਉਂਦਾ ਹੈ।"), T("Because {a} was paid under that rule, its necessary condition was satisfied.", "क्योंकि {a} उस नियम के तहत दिया गया, आवश्यक शर्त पूरी हुई।", "ਕਿਉਂਕਿ {a} ਉਸ ਨਿਯਮ ਹੇਠ ਦਿੱਤਾ ਗਿਆ, ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਪੂਰੀ ਹੋਈ।")],
  },
  {
    id: "STC-V22-QL003-T03", qlId: "STC-QL-003", surfaceArchetype: "PUBLIC_NOTICE", difficulty: "MEDIUM", answerClass: "BOTH",
    dimensions: [
      [T("the river level", "नदी का स्तर", "ਦਰਿਆ ਦਾ ਪੱਧਰ"), T("the reservoir level", "जलाशय का स्तर", "ਜਲਾਸ਼ਯ ਦਾ ਪੱਧਰ"), T("the canal level", "नहर का स्तर", "ਨਹਿਰ ਦਾ ਪੱਧਰ"), T("the flood-monitoring gauge", "बाढ़ निगरानी गेज", "ਹੜ੍ਹ ਨਿਗਰਾਨੀ ਗੇਜ")],
      [T("the danger mark", "खतरे के निशान", "ਖਤਰੇ ਦੇ ਨਿਸ਼ਾਨ"), T("the notified red mark", "अधिसूचित लाल निशान", "ਸੂਚਿਤ ਲਾਲ ਨਿਸ਼ਾਨ"), T("the emergency threshold", "आपात सीमा", "ਐਮਰਜੈਂਸੀ ਸੀਮਾ"), T("the closure threshold", "बंद करने की सीमा", "ਬੰਦ ਕਰਨ ਦੀ ਸੀਮਾ")],
      [T("Gate 3 will be closed to traffic", "गेट 3 यातायात के लिए बंद किया जाएगा", "ਗੇਟ 3 ਆਵਾਜਾਈ ਲਈ ਬੰਦ ਕੀਤਾ ਜਾਵੇਗਾ"), T("the riverside road will be closed", "नदी किनारे की सड़क बंद की जाएगी", "ਦਰਿਆ-ਕਿਨਾਰੇ ਵਾਲੀ ਸੜਕ ਬੰਦ ਕੀਤੀ ਜਾਵੇਗੀ"), T("the low bridge will be closed", "निचला पुल बंद किया जाएगा", "ਨੀਵਾਂ ਪੁਲ ਬੰਦ ਕੀਤਾ ਜਾਵੇਗਾ"), T("the embankment route will be blocked", "तटबंध मार्ग बंद किया जाएगा", "ਬੰਨ੍ਹ ਵਾਲਾ ਰਸਤਾ ਬੰਦ ਕੀਤਾ ਜਾਵੇਗਾ")],
      [T("at 4 p.m.", "शाम 4 बजे", "ਸ਼ਾਮ 4 ਵਜੇ"), T("at 5 p.m.", "शाम 5 बजे", "ਸ਼ਾਮ 5 ਵਜੇ"), T("at 6 p.m.", "शाम 6 बजे", "ਸ਼ਾਮ 6 ਵਜੇ"), T("at 7 p.m.", "शाम 7 बजे", "ਸ਼ਾਮ 7 ਵਜੇ")],
    ],
    statement: T("Notice: If {a} crosses {b}, {c}. {a} crossed {b} {d}.", "सूचना: यदि {a} {b} को पार करता है, तो {c}। {a} ने {d} {b} को पार कर लिया।", "ਸੂਚਨਾ: ਜੇ {a} {b} ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ, ਤਾਂ {c}। {a} ਨੇ {d} {b} ਨੂੰ ਪਾਰ ਕਰ ਲਿਆ।"),
    conclusions: [T("The stated trigger involving {a} occurred {d}.", "{a} से जुड़ी बताई गई ट्रिगर शर्त {d} पूरी हुई।", "{a} ਨਾਲ ਜੁੜੀ ਦੱਸੀ ਟ੍ਰਿਗਰ ਸ਼ਰਤ {d} ਪੂਰੀ ਹੋਈ।"), T("Under the notice, {c}.", "सूचना के अनुसार, {c}।", "ਸੂਚਨਾ ਅਨੁਸਾਰ, {c}।")],
    explanation: [T("Crossing {b} is exactly the stated trigger.", "{b} को पार करना ठीक वही बताई गई शर्त है।", "{b} ਨੂੰ ਪਾਰ ਕਰਨਾ ਠੀਕ ਉਹੀ ਦੱਸੀ ਸ਼ਰਤ ਹੈ।"), T("The notice maps that satisfied trigger directly to the action: {c}.", "सूचना उस पूरी हुई शर्त को सीधे इस कार्रवाई से जोड़ती है: {c}।", "ਸੂਚਨਾ ਉਸ ਪੂਰੀ ਹੋਈ ਸ਼ਰਤ ਨੂੰ ਸਿੱਧੇ ਇਸ ਕਾਰਵਾਈ ਨਾਲ ਜੋੜਦੀ ਹੈ: {c}।")],
  },
  {
    id: "STC-V22-QL003-T04", qlId: "STC-QL-003", surfaceArchetype: "ADVICE_WARNING", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      [T("the packaging machine", "पैकेजिंग मशीन", "ਪੈਕਿੰਗ ਮਸ਼ੀਨ"), T("the cooling unit", "कूलिंग यूनिट", "ਕੂਲਿੰਗ ਯੂਨਿਟ"), T("the laboratory dryer", "प्रयोगशाला ड्रायर", "ਲੈਬ ਡਰਾਇਰ"), T("the processing motor", "प्रसंस्करण मोटर", "ਪ੍ਰੋਸੈਸਿੰਗ ਮੋਟਰ")],
      [T("80°C", "80°C", "80°C"), T("85°C", "85°C", "85°C"), T("90°C", "90°C", "90°C"), T("95°C", "95°C", "95°C")],
      [T("60°C", "60°C", "60°C"), T("65°C", "65°C", "65°C"), T("70°C", "70°C", "70°C"), T("75°C", "75°C", "75°C")],
      [T("during the morning check", "सुबह की जाँच में", "ਸਵੇਰ ਦੀ ਜਾਂਚ ਵਿੱਚ"), T("during the afternoon check", "दोपहर की जाँच में", "ਦੁਪਹਿਰ ਦੀ ਜਾਂਚ ਵਿੱਚ"), T("at the latest reading", "नवीनतम रीडिंग में", "ਤਾਜ਼ਾ ਰੀਡਿੰਗ ਵਿੱਚ"), T("during routine monitoring", "नियमित निगरानी में", "ਨਿਯਮਤ ਨਿਗਰਾਨੀ ਵਿੱਚ")],
    ],
    statement: T("The safety instruction for {a} says: if its temperature exceeds {b}, the alarm sounds. The recorded temperature {d} was {c}.", "{a} के सुरक्षा निर्देश में कहा है: यदि इसका तापमान {b} से अधिक होता है तो अलार्म बजता है। {d} दर्ज तापमान {c} था।", "{a} ਦੀ ਸੁਰੱਖਿਆ ਹਦਾਇਤ ਕਹਿੰਦੀ ਹੈ: ਜੇ ਇਸ ਦਾ ਤਾਪਮਾਨ {b} ਤੋਂ ਵੱਧ ਹੋਵੇ ਤਾਂ ਅਲਾਰਮ ਵੱਜਦਾ ਹੈ। {d} ਦਰਜ ਤਾਪਮਾਨ {c} ਸੀ।"),
    conclusions: [T("The alarm therefore definitely did not sound {d}.", "इसलिए {d} अलार्म निश्चित रूप से नहीं बजा।", "ਇਸ ਲਈ {d} ਅਲਾਰਮ ਯਕੀਨੀ ਤੌਰ ਤੇ ਨਹੀਂ ਵੱਜਿਆ।"), T("{a} was therefore completely safe {d}.", "इसलिए {a} {d} पूरी तरह सुरक्षित था।", "ਇਸ ਲਈ {a} {d} ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਸੀ।")],
    explanation: [T("A temperature below {b} only shows that this sufficient trigger was absent; it does not prove the alarm could not sound for another reason.", "{b} से कम तापमान केवल यह बताता है कि यह पर्याप्त ट्रिगर नहीं था; इससे यह सिद्ध नहीं होता कि अलार्म किसी अन्य कारण से नहीं बज सकता था।", "{b} ਤੋਂ ਘੱਟ ਤਾਪਮਾਨ ਕੇਵਲ ਇਹ ਦੱਸਦਾ ਹੈ ਕਿ ਇਹ ਕਾਫ਼ੀ ਟ੍ਰਿਗਰ ਨਹੀਂ ਸੀ; ਇਸ ਨਾਲ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਅਲਾਰਮ ਕਿਸੇ ਹੋਰ ਕਾਰਨ ਨਾਲ ਨਹੀਂ ਵੱਜ ਸਕਦਾ ਸੀ।"), T("The rule concerns one alarm trigger, not complete safety of {a}.", "नियम केवल एक अलार्म ट्रिगर के बारे में है, {a} की पूर्ण सुरक्षा के बारे में नहीं।", "ਨਿਯਮ ਕੇਵਲ ਇੱਕ ਅਲਾਰਮ ਟ੍ਰਿਗਰ ਬਾਰੇ ਹੈ, {a} ਦੀ ਪੂਰੀ ਸੁਰੱਖਿਆ ਬਾਰੇ ਨਹੀਂ।")],
  },
  {
    id: "STC-V22-QL003-T05", qlId: "STC-QL-003", surfaceArchetype: "QUOTED_CLAIM", difficulty: "HARD", answerClass: "ONLY_I",
    dimensions: [
      [T("The organiser", "आयोजक", "ਆਯੋਜਕ"), T("The programme coordinator", "कार्यक्रम समन्वयक", "ਪ੍ਰੋਗਰਾਮ ਕੋਆਰਡੀਨੇਟਰ"), T("The event manager", "कार्यक्रम प्रबंधक", "ਇਵੈਂਟ ਮੈਨੇਜਰ"), T("The school secretary", "विद्यालय सचिव", "ਸਕੂਲ ਸਕੱਤਰ")],
      [T("the sports programme", "खेल कार्यक्रम", "ਖੇਡ ਪ੍ਰੋਗਰਾਮ"), T("the cultural event", "सांस्कृतिक कार्यक्रम", "ਸੱਭਿਆਚਾਰਕ ਸਮਾਗਮ"), T("the public workshop", "सार्वजनिक कार्यशाला", "ਜਨਤਕ ਵਰਕਸ਼ਾਪ"), T("the school exhibition", "विद्यालय प्रदर्शनी", "ਸਕੂਲ ਪ੍ਰਦਰਸ਼ਨੀ")],
      [T("4:30 p.m.", "शाम 4:30 बजे", "ਸ਼ਾਮ 4:30 ਵਜੇ"), T("5 p.m.", "शाम 5 बजे", "ਸ਼ਾਮ 5 ਵਜੇ"), T("5:30 p.m.", "शाम 5:30 बजे", "ਸ਼ਾਮ 5:30 ਵਜੇ"), T("6 p.m.", "शाम 6 बजे", "ਸ਼ਾਮ 6 ਵਜੇ")],
      [T("3 p.m.", "दोपहर 3 बजे", "ਦੁਪਹਿਰ 3 ਵਜੇ"), T("3:30 p.m.", "दोपहर 3:30 बजे", "ਦੁਪਹਿਰ 3:30 ਵਜੇ"), T("4 p.m.", "शाम 4 बजे", "ਸ਼ਾਮ 4 ਵਜੇ"), T("4:15 p.m.", "शाम 4:15 बजे", "ਸ਼ਾਮ 4:15 ਵਜੇ")],
    ],
    statement: T("{a} said, “We will move {b} indoors if rain begins before {c}.” Rain began at {d}.", "{a} ने कहा, “यदि बारिश {c} से पहले शुरू होती है तो हम {b} को अंदर स्थानांतरित कर देंगे।” बारिश {d} शुरू हुई।", "{a} ਨੇ ਕਿਹਾ, “ਜੇ ਮੀਂਹ {c} ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ ਤਾਂ ਅਸੀਂ {b} ਨੂੰ ਅੰਦਰ ਕਰ ਦੇਵਾਂਗੇ।” ਮੀਂਹ {d} ਸ਼ੁਰੂ ਹੋਇਆ।"),
    conclusions: [T("The stated condition for moving {b} indoors was met.", "{b} को अंदर स्थानांतरित करने की बताई गई शर्त पूरी हुई।", "{b} ਨੂੰ ਅੰਦਰ ਕਰਨ ਦੀ ਦੱਸੀ ਸ਼ਰਤ ਪੂਰੀ ਹੋਈ।"), T("{b} was cancelled.", "{b} रद्द कर दिया गया।", "{b} ਰੱਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।")],
    explanation: [T("Every permitted rain time {d} is earlier than every permitted cutoff {c}.", "हर अनुमत वर्षा समय {d}, हर अनुमत समय सीमा {c} से पहले है।", "ਹਰ ਮਨਜ਼ੂਰ ਮੀਂਹ ਸਮਾਂ {d}, ਹਰ ਮਨਜ਼ੂਰ ਕੱਟਆਫ਼ {c} ਤੋਂ ਪਹਿਲਾਂ ਹੈ।"), T("The rule concerns moving {b} indoors, not cancellation.", "नियम {b} को अंदर ले जाने के बारे में है, रद्द करने के बारे में नहीं।", "ਨਿਯਮ {b} ਨੂੰ ਅੰਦਰ ਕਰਨ ਬਾਰੇ ਹੈ, ਰੱਦ ਕਰਨ ਬਾਰੇ ਨਹੀਂ।")],
  },
  {
    id: "STC-V22-QL003-T06", qlId: "STC-QL-003", surfaceArchetype: "CONDITIONAL_TRIGGER", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      [T("server load", "सर्वर लोड", "ਸਰਵਰ ਲੋਡ"), T("network traffic", "नेटवर्क ट्रैफिक", "ਨੈੱਟਵਰਕ ਟ੍ਰੈਫ਼ਿਕ"), T("processing demand", "प्रसंस्करण मांग", "ਪ੍ਰੋਸੈਸਿੰਗ ਮੰਗ"), T("system usage", "सिस्टम उपयोग", "ਸਿਸਟਮ ਵਰਤੋਂ")],
      [T("the safety limit", "सुरक्षा सीमा", "ਸੁਰੱਖਿਆ ਸੀਮਾ"), T("the automatic-switch threshold", "स्वचालित स्विच सीमा", "ਆਟੋਮੈਟਿਕ ਸਵਿੱਚ ਸੀਮਾ"), T("the overload threshold", "ओवरलोड सीमा", "ਓਵਰਲੋਡ ਸੀਮਾ"), T("the failover limit", "फेलओवर सीमा", "ਫੇਲਓਵਰ ਸੀਮਾ")],
      [T("a backup server", "बैकअप सर्वर", "ਬੈਕਅਪ ਸਰਵਰ"), T("the reserve node", "रिजर्व नोड", "ਰਿਜ਼ਰਵ ਨੋਡ"), T("the standby system", "स्टैंडबाय सिस्टम", "ਸਟੈਂਡਬਾਇ ਸਿਸਟਮ"), T("the failover unit", "फेलओवर यूनिट", "ਫੇਲਓਵਰ ਯੂਨਿਟ")],
      [T("at noon", "दोपहर 12 बजे", "ਦੁਪਹਿਰ 12 ਵਜੇ"), T("at 2 p.m.", "दोपहर 2 बजे", "ਦੁਪਹਿਰ 2 ਵਜੇ"), T("during the evening peak", "शाम के व्यस्त समय में", "ਸ਼ਾਮ ਦੇ ਪੀਕ ਸਮੇਂ"), T("during the latest monitoring cycle", "नवीनतम निगरानी चक्र में", "ਤਾਜ਼ਾ ਨਿਗਰਾਨੀ ਚੱਕਰ ਵਿੱਚ")],
    ],
    statement: T("If {a} crosses {b}, {c} starts automatically. {d}, {a} crossed {b} while the automatic rule was active.", "यदि {a} {b} को पार करता है तो {c} स्वतः शुरू हो जाता है। {d}, सक्रिय स्वचालित नियम के दौरान {a} ने {b} को पार किया।", "ਜੇ {a} {b} ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ ਤਾਂ {c} ਆਪਣੇ ਆਪ ਚਾਲੂ ਹੋ ਜਾਂਦਾ ਹੈ। {d}, ਸਰਗਰਮ ਆਟੋਮੈਟਿਕ ਨਿਯਮ ਦੌਰਾਨ {a} ਨੇ {b} ਨੂੰ ਪਾਰ ਕੀਤਾ।"),
    conclusions: [T("{c} did not start {d}.", "{c} {d} शुरू नहीं हुआ।", "{c} {d} ਚਾਲੂ ਨਹੀਂ ਹੋਇਆ।"), T("Under the stated rule, {c} was triggered {d}.", "बताए नियम के अनुसार {c} {d} सक्रिय हुआ।", "ਦੱਸੇ ਨਿਯਮ ਅਨੁਸਾਰ {c} {d} ਸਰਗਰਮ ਹੋਇਆ।")],
    explanation: [T("This conclusion contradicts the active rule and satisfied trigger.", "यह निष्कर्ष सक्रिय नियम और पूरी हुई ट्रिगर शर्त के विपरीत है।", "ਇਹ ਨਤੀਜਾ ਸਰਗਰਮ ਨਿਯਮ ਅਤੇ ਪੂਰੀ ਹੋਈ ਟ੍ਰਿਗਰ ਸ਼ਰਤ ਦੇ ਉਲਟ ਹੈ।"), T("{a} crossed {b} while the automatic rule was active, so {c} follows under the rule.", "सक्रिय नियम के दौरान {a} ने {b} को पार किया, इसलिए नियम के अनुसार {c} सक्रिय हुआ।", "ਸਰਗਰਮ ਨਿਯਮ ਦੌਰਾਨ {a} ਨੇ {b} ਨੂੰ ਪਾਰ ਕੀਤਾ, ਇਸ ਲਈ ਨਿਯਮ ਅਨੁਸਾਰ {c} ਸਰਗਰਮ ਹੋਇਆ।")],
  },
  {
    id: "STC-V22-QL003-T07", qlId: "STC-QL-003", surfaceArchetype: "SURVEY_REPORT", difficulty: "HARD", answerClass: "BOTH",
    dimensions: [
      [T("the survey protocol", "सर्वे प्रोटोकॉल", "ਸਰਵੇ ਪ੍ਰੋਟੋਕੋਲ"), T("the application-screening protocol", "आवेदन छँटाई प्रोटोकॉल", "ਅਰਜ਼ੀ ਸਕ੍ਰੀਨਿੰਗ ਪ੍ਰੋਟੋਕੋਲ"), T("the audit-sample protocol", "ऑडिट नमूना प्रोटोकॉल", "ਆਡਿਟ ਨਮੂਨਾ ਪ੍ਰੋਟੋਕੋਲ"), T("the data-validation protocol", "डेटा सत्यापन प्रोटोकॉल", "ਡਾਟਾ ਵੈਰੀਫਿਕੇਸ਼ਨ ਪ੍ਰੋਟੋਕੋਲ")],
      [T("all mandatory fields are complete", "सभी अनिवार्य फ़ील्ड पूर्ण हों", "ਸਾਰੇ ਲਾਜ਼ਮੀ ਫ਼ੀਲਡ ਪੂਰੇ ਹੋਣ"), T("all required declarations are present", "सभी आवश्यक घोषणाएँ मौजूद हों", "ਸਾਰੀਆਂ ਲੋੜੀਂਦੀਆਂ ਘੋਸ਼ਣਾਵਾਂ ਮੌਜੂਦ ਹੋਣ"), T("every compulsory check is passed", "हर अनिवार्य जाँच पास हो", "ਹਰ ਲਾਜ਼ਮੀ ਜਾਂਚ ਪਾਸ ਹੋਵੇ"), T("all required entries are validated", "सभी आवश्यक प्रविष्टियाँ सत्यापित हों", "ਸਾਰੀਆਂ ਲੋੜੀਂਦੀਆਂ ਐਂਟਰੀਆਂ ਵੈਰੀਫਾਈ ਹੋਣ")],
      [T("Response X", "प्रतिक्रिया X", "ਜਵਾਬ X"), T("Record Y", "रिकॉर्ड Y", "ਰਿਕਾਰਡ Y"), T("Application P", "आवेदन P", "ਅਰਜ਼ੀ P"), T("Sample R", "नमूना R", "ਨਮੂਨਾ R")],
      [T("the final dataset", "अंतिम डेटा सेट", "ਅੰਤਿਮ ਡਾਟਾਸੈੱਟ"), T("the approved list", "स्वीकृत सूची", "ਮਨਜ਼ੂਰ ਸੂਚੀ"), T("the final audit sample", "अंतिम ऑडिट नमूना", "ਅੰਤਿਮ ਆਡਿਟ ਨਮੂਨਾ"), T("the validated records set", "सत्यापित रिकॉर्ड सेट", "ਵੈਰੀਫਾਈ ਰਿਕਾਰਡ ਸੈੱਟ")],
    ],
    statement: T("Under {a}, an item is included in {d} only if {b}. {c} appears in {d}.", "{a} के अनुसार किसी मद को {d} में तभी शामिल किया जाता है जब {b}। {c} {d} में मौजूद है।", "{a} ਅਨੁਸਾਰ ਕਿਸੇ ਆਈਟਮ ਨੂੰ {d} ਵਿੱਚ ਤਦ ਹੀ ਸ਼ਾਮਲ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਜਦੋਂ {b}। {c} {d} ਵਿੱਚ ਮੌਜੂਦ ਹੈ।"),
    conclusions: [T("For {c}, the necessary condition that {b} was satisfied.", "{c} के लिए आवश्यक शर्त कि {b}, पूरी हुई।", "{c} ਲਈ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਕਿ {b}, ਪੂਰੀ ਹੋਈ।"), T("{c} met the stated inclusion condition of {a}.", "{c} ने {a} की बताई गई समावेशन शर्त पूरी की।", "{c} ਨੇ {a} ਦੀ ਦੱਸੀ ਸ਼ਾਮਲ ਕਰਨ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕੀਤੀ।")],
    explanation: [T("Inclusion in {d} requires {b}; {c} is included.", "{d} में शामिल होने के लिए {b} आवश्यक है और {c} शामिल है।", "{d} ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣ ਲਈ {b} ਲਾਜ਼ਮੀ ਹੈ ਅਤੇ {c} ਸ਼ਾਮਲ ਹੈ।"), T("Appearing in {d} establishes the stated necessary inclusion condition.", "{d} में मौजूद होना बताई गई आवश्यक समावेशन शर्त को सिद्ध करता है।", "{d} ਵਿੱਚ ਮੌਜੂਦ ਹੋਣਾ ਦੱਸੀ ਲਾਜ਼ਮੀ ਸ਼ਾਮਲ ਕਰਨ ਦੀ ਸ਼ਰਤ ਸਾਬਤ ਕਰਦਾ ਹੈ।")],
  },
  {
    id: "STC-V22-QL003-T08", qlId: "STC-QL-003", surfaceArchetype: "CONTRAST_CONCESSION", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      [T("a recruitment application", "भर्ती आवेदन", "ਭਰਤੀ ਅਰਜ਼ੀ"), T("a scholarship application", "छात्रवृत्ति आवेदन", "ਸਕਾਲਰਸ਼ਿਪ ਅਰਜ਼ੀ"), T("a tender submission", "निविदा आवेदन", "ਟੈਂਡਰ ਜਮ੍ਹਾਂਕਰਨ"), T("an examination form", "परीक्षा फॉर्म", "ਪਰੀਖਿਆ ਫਾਰਮ")],
      [T("the closing time", "अंतिम समय", "ਅੰਤਿਮ ਸਮਾਂ"), T("the notified deadline", "अधिसूचित समय सीमा", "ਸੂਚਿਤ ਅੰਤਿਮ ਮਿਆਦ"), T("the submission cutoff", "जमा करने की अंतिम सीमा", "ਜਮ੍ਹਾਂ ਕਰਨ ਦੀ ਕੱਟਆਫ਼"), T("the final filing time", "अंतिम दाखिला समय", "ਅੰਤਿਮ ਫ਼ਾਈਲਿੰਗ ਸਮਾਂ")],
      [T("a documented portal outage", "दस्तावेजित पोर्टल बाधा", "ਦਸਤਾਵੇਜ਼ੀ ਪੋਰਟਲ ਆਉਟੇਜ"), T("a certified server failure", "प्रमाणित सर्वर विफलता", "ਪ੍ਰਮਾਣਿਤ ਸਰਵਰ ਨਾਕਾਮੀ"), T("an officially recorded network failure", "आधिकारिक रूप से दर्ज नेटवर्क विफलता", "ਅਧਿਕਾਰਕ ਤੌਰ ਤੇ ਦਰਜ ਨੈੱਟਵਰਕ ਨਾਕਾਮੀ"), T("a notified payment-gateway outage", "अधिसूचित भुगतान-गेटवे बाधा", "ਸੂਚਿਤ ਭੁਗਤਾਨ-ਗੇਟਵੇ ਆਉਟੇਜ")],
      [T("Application Z", "आवेदन Z", "ਅਰਜ਼ੀ Z"), T("Submission Q", "जमा Q", "ਜਮ੍ਹਾਂਕਰਨ Q"), T("Form R", "फॉर्म R", "ਫਾਰਮ R"), T("Bid T", "बोली T", "ਬੋਲੀ T")],
    ],
    statement: T("Late {a} received after {b} are rejected unless the delay was caused by {c}. {d} was submitted late; nothing else is stated about it.", "{b} के बाद प्राप्त देर से आए {a} अस्वीकार किए जाते हैं, जब तक देरी {c} के कारण न हुई हो। {d} देर से जमा हुआ; इसके बारे में और कुछ नहीं बताया गया।", "{b} ਤੋਂ ਬਾਅਦ ਮਿਲੇ ਦੇਰ ਨਾਲ ਆਏ {a} ਰੱਦ ਕੀਤੇ ਜਾਂਦੇ ਹਨ, ਜਦ ਤੱਕ ਦੇਰੀ {c} ਕਾਰਨ ਨਾ ਹੋਵੇ। {d} ਦੇਰ ਨਾਲ ਜਮ੍ਹਾਂ ਹੋਇਆ; ਇਸ ਬਾਰੇ ਹੋਰ ਕੁਝ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।"),
    conclusions: [T("{d} was accepted.", "{d} स्वीकार किया गया।", "{d} ਸਵੀਕਾਰ ਕੀਤਾ ਗਿਆ।"), T("The delay in {d} was caused by {c}.", "{d} की देरी {c} के कारण हुई।", "{d} ਦੀ ਦੇਰੀ {c} ਕਾਰਨ ਹੋਈ।")],
    explanation: [T("Late submission alone does not establish that {d} was accepted.", "केवल देर से जमा होना यह सिद्ध नहीं करता कि {d} स्वीकार हुआ।", "ਕੇਵਲ ਦੇਰ ਨਾਲ ਜਮ੍ਹਾਂ ਹੋਣਾ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ ਕਿ {d} ਸਵੀਕਾਰ ਹੋਇਆ।"), T("No cause of the delay in {d} is stated.", "{d} की देरी का कारण नहीं बताया गया।", "{d} ਦੀ ਦੇਰੀ ਦਾ ਕਾਰਨ ਨਹੀਂ ਦੱਸਿਆ ਗਿਆ।")],
  },
] as const;
