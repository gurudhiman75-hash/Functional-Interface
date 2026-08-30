import { tri } from "./editorial-v2-2-saturation-helpers.ts";
import type { StcV22Template } from "./editorial-v2-2-saturation-types.ts";

const T = tri;

export const STC_V22_QL005_TEMPLATES: readonly StcV22Template[] = [
  {
    id: "STC-V22-QL005-T01", qlId: "STC-QL-005", surfaceArchetype: "DIRECT_COMPARISON", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      [T("Branch A", "शाखा A", "ਸ਼ਾਖਾ A"), T("Branch C", "शाखा C", "ਸ਼ਾਖਾ C"), T("Service Centre E", "सेवा केंद्र E", "ਸੇਵਾ ਕੇਂਦਰ E"), T("Zone G", "क्षेत्र G", "ਜ਼ੋਨ G")],
      [T("Branch B", "शाखा B", "ਸ਼ਾਖਾ B"), T("Branch D", "शाखा D", "ਸ਼ਾਖਾ D"), T("Service Centre F", "सेवा केंद्र F", "ਸੇਵਾ ਕੇਂਦਰ F"), T("Zone H", "क्षेत्र H", "ਜ਼ੋਨ H")],
      [T("loan-recovery rate", "ऋण-वसूली दर", "ਕਰਜ਼ਾ-ਵਸੂਲੀ ਦਰ"), T("complaint-resolution rate", "शिकायत-निपटान दर", "ਸ਼ਿਕਾਇਤ-ਨਿਪਟਾਰਾ ਦਰ"), T("digital-adoption rate", "डिजिटल अपनाने की दर", "ਡਿਜ਼ਿਟਲ ਅਪਣਾਉਣ ਦਰ"), T("on-time completion rate", "समय पर पूर्णता दर", "ਸਮੇਂ ਸਿਰ ਪੂਰਨਤਾ ਦਰ")],
      [T("the latest quarterly review", "नवीनतम तिमाही समीक्षा", "ਤਾਜ਼ਾ ਤਿਮਾਹੀ ਸਮੀਖਿਆ"), T("the monthly performance report", "मासिक प्रदर्शन रिपोर्ट", "ਮਾਸਿਕ ਕਾਰਗੁਜ਼ਾਰੀ ਰਿਪੋਰਟ"), T("the year-end assessment", "वर्षांत आकलन", "ਸਾਲਾਨਾ ਅੰਤਲਾ ਮੁਲਾਂਕਣ"), T("the latest service audit", "नवीनतम सेवा ऑडिट", "ਤਾਜ਼ਾ ਸੇਵਾ ਆਡਿਟ")],
    ],
    statement: T("In {d}, {a} recorded a higher {c} than {b}, although {b} recorded a larger absolute count related to that measure because its underlying base was larger.", "{d} में {a} की {c} {b} से अधिक रही, हालांकि बड़े आधार के कारण संबंधित कुल संख्या {b} में अधिक रही।", "{d} ਵਿੱਚ {a} ਦੀ {c} {b} ਨਾਲੋਂ ਵੱਧ ਰਹੀ, ਹਾਲਾਂਕਿ ਵੱਡੇ ਅਧਾਰ ਕਰਕੇ ਸੰਬੰਧਿਤ ਕੁੱਲ ਗਿਣਤੀ {b} ਵਿੱਚ ਵੱਧ ਰਹੀ।"),
    conclusions: [T("{a} had the higher {c}.", "{a} की {c} अधिक थी।", "{a} ਦੀ {c} ਵੱਧ ਸੀ।"), T("{a} necessarily had the larger absolute count related to the measure.", "संबंधित कुल संख्या भी अनिवार्य रूप से {a} में अधिक थी।", "ਸੰਬੰਧਿਤ ਕੁੱਲ ਗਿਣਤੀ ਵੀ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ {a} ਵਿੱਚ ਵੱਧ ਸੀ।")],
    explanation: [T("The statement directly gives {a} the higher rate.", "कथन सीधे {a} की दर को अधिक बताता है।", "ਕਥਨ ਸਿੱਧੇ {a} ਦੀ ਦਰ ਨੂੰ ਵੱਧ ਦੱਸਦਾ ਹੈ।"), T("The statement explicitly gives the larger absolute count to {b}, showing that rate and volume need not rank alike.", "कथन संबंधित कुल संख्या {b} में अधिक बताता है; दर और कुल मात्रा का क्रम समान होना जरूरी नहीं।", "ਕਥਨ ਸੰਬੰਧਿਤ ਕੁੱਲ ਗਿਣਤੀ {b} ਵਿੱਚ ਵੱਧ ਦੱਸਦਾ ਹੈ; ਦਰ ਅਤੇ ਕੁੱਲ ਮਾਤਰਾ ਦਾ ਕ੍ਰਮ ਇੱਕੋ ਜਿਹਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ।")],
  },
  {
    id: "STC-V22-QL005-T02", qlId: "STC-QL-005", surfaceArchetype: "SURVEY_REPORT", difficulty: "MEDIUM", answerClass: "ONLY_II",
    dimensions: [
      [T("31", "31", "31"), T("34", "34", "34"), T("37", "37", "37"), T("40", "40", "40")],
      [T("52", "52", "52"), T("55", "55", "55"), T("58", "58", "58"), T("61", "61", "61")],
      [T("rural respondents", "ग्रामीण उत्तरदाताओं", "ਪੇਂਡੂ ਉੱਤਰਦਾਤਾਵਾਂ"), T("small-town respondents", "छोटे शहरों के उत्तरदाताओं", "ਛੋਟੇ ਸ਼ਹਿਰਾਂ ਦੇ ਉੱਤਰਦਾਤਾਵਾਂ"), T("respondents aged 50 and above", "50 वर्ष या अधिक आयु के उत्तरदाताओं", "50 ਸਾਲ ਜਾਂ ਇਸ ਤੋਂ ਵੱਧ ਉਮਰ ਦੇ ਉੱਤਰਦਾਤਾਵਾਂ"), T("first-time users", "पहली बार उपयोग करने वालों", "ਪਹਿਲੀ ਵਾਰ ਵਰਤੋਂ ਕਰਨ ਵਾਲਿਆਂ")],
      [T("urban respondents", "शहरी उत्तरदाताओं", "ਸ਼ਹਿਰੀ ਉੱਤਰਦਾਤਾਵਾਂ"), T("metro-city respondents", "महानगरीय उत्तरदाताओं", "ਮਹਾਂਨਗਰੀ ਉੱਤਰਦਾਤਾਵਾਂ"), T("respondents below 35", "35 वर्ष से कम आयु के उत्तरदाताओं", "35 ਸਾਲ ਤੋਂ ਘੱਟ ਉਮਰ ਦੇ ਉੱਤਰਦਾਤਾਵਾਂ"), T("regular users", "नियमित उपयोगकर्ताओं", "ਨਿਯਮਤ ਵਰਤੋਂਕਾਰਾਂ")],
    ],
    statement: T("A survey found weekly mobile-banking use among {a}% of {c} and {b}% of {d}.", "एक सर्वेक्षण में साप्ताहिक मोबाइल-बैंकिंग उपयोग {c} में {a}% और {d} में {b}% पाया गया।", "ਇੱਕ ਸਰਵੇਖਣ ਵਿੱਚ ਹਫ਼ਤਾਵਾਰੀ ਮੋਬਾਈਲ-ਬੈਂਕਿੰਗ ਵਰਤੋਂ {c} ਵਿੱਚ {a}% ਅਤੇ {d} ਵਿੱਚ {b}% ਮਿਲੀ।"),
    conclusions: [T("Weekly mobile-banking use was more common among {c}.", "साप्ताहिक मोबाइल-बैंकिंग उपयोग {c} में अधिक सामान्य था।", "ਹਫ਼ਤਾਵਾਰੀ ਮੋਬਾਈਲ-ਬੈਂਕਿੰਗ ਵਰਤੋਂ {c} ਵਿੱਚ ਵੱਧ ਆਮ ਸੀ।"), T("Weekly mobile-banking use was more common among {d}.", "साप्ताहिक मोबाइल-बैंकिंग उपयोग {d} में अधिक सामान्य था।", "ਹਫ਼ਤਾਵਾਰੀ ਮੋਬਾਈਲ-ਬੈਂਕਿੰਗ ਵਰਤੋਂ {d} ਵਿੱਚ ਵੱਧ ਆਮ ਸੀ।")],
    explanation: [T("{a}% is lower than {b}%.", "{a}% {b}% से कम है।", "{a}% {b}% ਨਾਲੋਂ ਘੱਟ ਹੈ।"), T("{b}% is greater than {a}%.", "{b}% {a}% से अधिक है।", "{b}% {a}% ਨਾਲੋਂ ਵੱਧ ਹੈ।")],
  },
  {
    id: "STC-V22-QL005-T03", qlId: "STC-QL-005", surfaceArchetype: "NUMERIC_SNAPSHOT", difficulty: "EASY", answerClass: "BOTH",
    dimensions: [
      [T("84", "84", "84"), T("86", "86", "86"), T("88", "88", "88"), T("90", "90", "90")],
      [T("71", "71", "71"), T("73", "73", "73"), T("75", "75", "75"), T("77", "77", "77")],
      [T("58", "58", "58"), T("60", "60", "60"), T("62", "62", "62"), T("64", "64", "64")],
      [T("service-quality index", "सेवा-गुणवत्ता सूचकांक", "ਸੇਵਾ-ਗੁਣਵੱਤਾ ਸੂਚਕਾਂਕ"), T("processing-efficiency score", "प्रसंस्करण-दक्षता अंक", "ਪ੍ਰਕਿਰਿਆ-ਦੱਖਲਤਾ ਸਕੋਰ"), T("customer-response index", "ग्राहक-प्रतिक्रिया सूचकांक", "ਗਾਹਕ-ਪ੍ਰਤੀਕਿਰਿਆ ਸੂਚਕਾਂਕ"), T("compliance score", "अनुपालन अंक", "ਅਨੁਪਾਲਨਾ ਸਕੋਰ")],
    ],
    statement: T("The latest report gives a {d} of {a} for Centre North, {b} for Centre Central and {c} for Centre South.", "नवीनतम रिपोर्ट में {d} केंद्र उत्तर के लिए {a}, केंद्र मध्य के लिए {b} और केंद्र दक्षिण के लिए {c} है।", "ਤਾਜ਼ਾ ਰਿਪੋਰਟ ਵਿੱਚ {d} ਕੇਂਦਰ ਉੱਤਰ ਲਈ {a}, ਕੇਂਦਰ ਮੱਧ ਲਈ {b} ਅਤੇ ਕੇਂਦਰ ਦੱਖਣ ਲਈ {c} ਹੈ।"),
    conclusions: [T("Centre North has a higher {d} than Centre Central.", "केंद्र उत्तर का {d} केंद्र मध्य से अधिक है।", "ਕੇਂਦਰ ਉੱਤਰ ਦਾ {d} ਕੇਂਦਰ ਮੱਧ ਨਾਲੋਂ ਵੱਧ ਹੈ।"), T("Centre Central has a higher {d} than Centre South.", "केंद्र मध्य का {d} केंद्र दक्षिण से अधिक है।", "ਕੇਂਦਰ ਮੱਧ ਦਾ {d} ਕੇਂਦਰ ਦੱਖਣ ਨਾਲੋਂ ਵੱਧ ਹੈ।")],
    explanation: [T("{a} is greater than {b}.", "{a}, {b} से अधिक है।", "{a}, {b} ਨਾਲੋਂ ਵੱਧ ਹੈ।"), T("{b} is greater than {c}.", "{b}, {c} से अधिक है।", "{b}, {c} ਨਾਲੋਂ ਵੱਧ ਹੈ।")],
  },
  {
    id: "STC-V22-QL005-T04", qlId: "STC-QL-005", surfaceArchetype: "CONTRAST_CONCESSION", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      [T("District X", "जिला X", "ਜ਼ਿਲ੍ਹਾ X"), T("District M", "जिला M", "ਜ਼ਿਲ੍ਹਾ M"), T("Zone R", "क्षेत्र R", "ਜ਼ੋਨ R"), T("Region U", "क्षेत्र U", "ਖੇਤਰ U")],
      [T("District Y", "जिला Y", "ਜ਼ਿਲ੍ਹਾ Y"), T("District N", "जिला N", "ਜ਼ਿਲ੍ਹਾ N"), T("Zone S", "क्षेत्र S", "ਜ਼ੋਨ S"), T("Region V", "क्षेत्र V", "ਖੇਤਰ V")],
      [T("vaccination coverage", "टीकाकरण कवरेज", "ਟੀਕਾਕਰਨ ਕਵਰੇਜ"), T("account-activation coverage", "खाता-सक्रियण कवरेज", "ਖਾਤਾ-ਸਰਗਰਮੀ ਕਵਰੇਜ"), T("inspection coverage", "निरीक्षण कवरेज", "ਜਾਂਚ ਕਵਰੇਜ"), T("beneficiary-registration coverage", "लाभार्थी-पंजीकरण कवरेज", "ਲਾਭਪਾਤਰੀ-ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਵਰੇਜ")],
      [T("its eligible population was larger", "उसकी पात्र आबादी अधिक थी", "ਉਸਦੀ ਯੋਗ ਅਬਾਦੀ ਵੱਧ ਸੀ"), T("its underlying customer base was larger", "उसका मूल ग्राहक आधार बड़ा था", "ਉਸਦਾ ਮੂਲ ਗਾਹਕ ਅਧਾਰ ਵੱਡਾ ਸੀ"), T("it had more units to inspect", "उसके पास निरीक्षण के लिए अधिक इकाइयाँ थीं", "ਉਸ ਕੋਲ ਜਾਂਚ ਲਈ ਵੱਧ ਇਕਾਈਆਂ ਸਨ"), T("its target register was larger", "उसका लक्ष्य रजिस्टर बड़ा था", "ਉਸਦਾ ਟਾਰਗੇਟ ਰਜਿਸਟਰ ਵੱਡਾ ਸੀ")],
    ],
    statement: T("{a} had a higher {c} rate than {b}, although {b} recorded a larger absolute count because {d}.", "{a} की {c} दर {b} से अधिक थी, हालांकि {d} इसलिए कुल संख्या {b} में अधिक रही।", "{a} ਦੀ {c} ਦਰ {b} ਨਾਲੋਂ ਵੱਧ ਸੀ, ਹਾਲਾਂਕਿ {d} ਇਸ ਲਈ ਕੁੱਲ ਗਿਣਤੀ {b} ਵਿੱਚ ਵੱਧ ਰਹੀ।"),
    conclusions: [T("{a} recorded the larger absolute count.", "कुल संख्या {a} में अधिक थी।", "ਕੁੱਲ ਗਿਣਤੀ {a} ਵਿੱਚ ਵੱਧ ਸੀ।"), T("A higher {c} rate always means a higher absolute count.", "अधिक {c} दर का अर्थ हमेशा अधिक कुल संख्या होता है।", "ਵੱਧ {c} ਦਰ ਦਾ ਅਰਥ ਹਮੇਸ਼ਾ ਵੱਧ ਕੁੱਲ ਗਿਣਤੀ ਹੁੰਦਾ ਹੈ।")],
    explanation: [T("The statement explicitly gives the larger absolute count to {b}.", "कथन कुल संख्या {b} में अधिक बताता है।", "ਕਥਨ ਕੁੱਲ ਗਿਣਤੀ {b} ਵਿੱਚ ਵੱਧ ਦੱਸਦਾ ਹੈ।"), T("The statement itself shows that rate and absolute count can move differently when bases differ.", "कथन स्वयं दिखाता है कि आधार अलग होने पर दर और कुल संख्या अलग क्रम में हो सकते हैं।", "ਕਥਨ ਆਪ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਅਧਾਰ ਵੱਖ ਹੋਣ ਤੇ ਦਰ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਵੱਖ ਕ੍ਰਮ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ।")],
  },
  {
    id: "STC-V22-QL005-T05", qlId: "STC-QL-005", surfaceArchetype: "EVERYDAY_OBSERVATION", difficulty: "MEDIUM", answerClass: "ONLY_I",
    dimensions: [
      [T("Queue A", "कतार A", "ਕਤਾਰ A"), T("Queue C", "कतार C", "ਕਤਾਰ C"), T("Counter Line E", "काउंटर पंक्ति E", "ਕਾਊਂਟਰ ਲਾਈਨ E"), T("Service Lane G", "सेवा लेन G", "ਸੇਵਾ ਲੇਨ G")],
      [T("Queue B", "कतार B", "ਕਤਾਰ B"), T("Queue D", "कतार D", "ਕਤਾਰ D"), T("Counter Line F", "काउंटर पंक्ति F", "ਕਾਊਂਟਰ ਲਾਈਨ F"), T("Service Lane H", "सेवा लेन H", "ਸੇਵਾ ਲੇਨ H")],
      [T("the ticket office", "टिकट कार्यालय", "ਟਿਕਟ ਦਫ਼ਤਰ"), T("the registration desk", "पंजीकरण डेस्क", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਡੈਸਕ"), T("the bank branch", "बैंक शाखा", "ਬੈਂਕ ਸ਼ਾਖਾ"), T("the service centre", "सेवा केंद्र", "ਸੇਵਾ ਕੇਂਦਰ")],
      [T("during the morning rush", "सुबह की भीड़ में", "ਸਵੇਰ ਦੀ ਭੀੜ ਦੌਰਾਨ"), T("at lunchtime", "दोपहर के समय", "ਦੁਪਹਿਰ ਵੇਲੇ"), T("during the evening peak", "शाम के व्यस्त समय में", "ਸ਼ਾਮ ਦੇ ਰੁਸ਼ ਸਮੇਂ"), T("during the audit observation", "ऑडिट अवलोकन के दौरान", "ਆਡਿਟ ਨਿਰੀਖਣ ਦੌਰਾਨ")],
    ],
    statement: T("At {c} {d}, {a} moved faster than {b}, but people in {b} waited for less time on average because that line was much shorter.", "{c} में {d} {a}, {b} से तेजी से आगे बढ़ी, लेकिन {b} छोटी होने के कारण वहाँ औसत प्रतीक्षा समय कम था।", "{c} ਵਿੱਚ {d} {a}, {b} ਨਾਲੋਂ ਤੇਜ਼ ਚੱਲੀ, ਪਰ {b} ਛੋਟੀ ਹੋਣ ਕਰਕੇ ਉੱਥੇ ਔਸਤ ਉਡੀਕ ਸਮਾਂ ਘੱਟ ਸੀ।"),
    conclusions: [T("{a} had the faster movement rate.", "{a} की आगे बढ़ने की दर अधिक थी।", "{a} ਦੀ ਅੱਗੇ ਵਧਣ ਦੀ ਦਰ ਵੱਧ ਸੀ।"), T("People in {a} necessarily had the shorter average wait.", "{a} में लोगों का औसत प्रतीक्षा समय अनिवार्य रूप से कम था।", "{a} ਵਿੱਚ ਲੋਕਾਂ ਦਾ ਔਸਤ ਉਡੀਕ ਸਮਾਂ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਘੱਟ ਸੀ।")],
    explanation: [T("The statement directly says {a} moved faster.", "कथन सीधे कहता है कि {a} तेजी से आगे बढ़ी।", "ਕਥਨ ਸਿੱਧੇ ਕਹਿੰਦਾ ਹੈ ਕਿ {a} ਤੇਜ਼ ਚੱਲੀ।"), T("The statement gives {b}, not {a}, the shorter average wait.", "कथन कम औसत प्रतीक्षा समय {b} को देता है, {a} को नहीं।", "ਕਥਨ ਘੱਟ ਔਸਤ ਉਡੀਕ ਸਮਾਂ {b} ਨੂੰ ਦਿੰਦਾ ਹੈ, {a} ਨੂੰ ਨਹੀਂ।")],
  },
  {
    id: "STC-V22-QL005-T06", qlId: "STC-QL-005", surfaceArchetype: "QUOTED_CLAIM", difficulty: "HARD", answerClass: "ONLY_II",
    dimensions: [
      [T("Unit R", "इकाई R", "ਇਕਾਈ R"), T("Team M", "टीम M", "ਟੀਮ M"), T("Desk P", "डेस्क P", "ਡੈਸਕ P"), T("Section U", "अनुभाग U", "ਸੈਕਸ਼ਨ U")],
      [T("Unit S", "इकाई S", "ਇਕਾਈ S"), T("Team N", "टीम N", "ਟੀਮ N"), T("Desk Q", "डेस्क Q", "ਡੈਸਕ Q"), T("Section V", "अनुभाग V", "ਸੈਕਸ਼ਨ V")],
      [T("files", "फाइलों", "ਫਾਈਲਾਂ"), T("claims", "दावों", "ਦਾਵਿਆਂ"), T("applications", "आवेदनों", "ਅਰਜ਼ੀਆਂ"), T("service requests", "सेवा अनुरोधों", "ਸੇਵਾ ਬੇਨਤੀਆਂ")],
      [T("the monthly review", "मासिक समीक्षा", "ਮਾਸਿਕ ਸਮੀਖਿਆ"), T("the audit period", "ऑडिट अवधि", "ਆਡਿਟ ਅਵਧੀ"), T("the last quarter", "पिछली तिमाही", "ਪਿਛਲੀ ਤਿਮਾਹੀ"), T("the latest performance check", "नवीनतम प्रदर्शन जाँच", "ਤਾਜ਼ਾ ਕਾਰਗੁਜ਼ਾਰੀ ਜਾਂਚ")],
    ],
    statement: T("The manager said, \"In {d}, {a} processed {c} faster than {b}, but {b} made fewer errors.\"", "प्रबंधक ने कहा, \"{d} में {a} ने {c} को {b} से तेज संसाधित किया, लेकिन {b} ने कम त्रुटियाँ कीं।\"", "ਮੈਨੇਜਰ ਨੇ ਕਿਹਾ, \"{d} ਵਿੱਚ {a} ਨੇ {c} ਨੂੰ {b} ਨਾਲੋਂ ਤੇਜ਼ ਪ੍ਰਕਿਰਿਆ ਕੀਤਾ, ਪਰ {b} ਨੇ ਘੱਟ ਗਲਤੀਆਂ ਕੀਤੀਆਂ।\""),
    conclusions: [T("{a} made fewer errors than {b}.", "{a} ने {b} से कम त्रुटियाँ कीं।", "{a} ਨੇ {b} ਨਾਲੋਂ ਘੱਟ ਗਲਤੀਆਂ ਕੀਤੀਆਂ।"), T("{b} performed better on the stated error measure.", "बताए गए त्रुटि-माप पर {b} का प्रदर्शन बेहतर था।", "ਦੱਸੀ ਗਲਤੀ-ਮਾਪ ਤੇ {b} ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਬਿਹਤਰ ਸੀ।")],
    explanation: [T("The manager says {b}, not {a}, made fewer errors.", "प्रबंधक के अनुसार कम त्रुटियाँ {b} ने कीं, {a} ने नहीं।", "ਮੈਨੇਜਰ ਮੁਤਾਬਕ ਘੱਟ ਗਲਤੀਆਂ {b} ਨੇ ਕੀਤੀਆਂ, {a} ਨੇ ਨਹੀਂ।"), T("Fewer errors gives {b} the stated accuracy advantage.", "कम त्रुटियाँ {b} को बताए गए शुद्धता-माप पर बढ़त देती हैं।", "ਘੱਟ ਗਲਤੀਆਂ {b} ਨੂੰ ਦੱਸੀ ਸ਼ੁੱਧਤਾ-ਮਾਪ ਤੇ ਬੜ੍ਹਤ ਦਿੰਦੀਆਂ ਹਨ।")],
  },
  {
    id: "STC-V22-QL005-T07", qlId: "STC-QL-005", surfaceArchetype: "RULE_ELIGIBILITY", difficulty: "MEDIUM", answerClass: "BOTH",
    dimensions: [
      [T("70", "70", "70"), T("72", "72", "72"), T("75", "75", "75"), T("80", "80", "80")],
      [T("30", "30", "30"), T("28", "28", "28"), T("25", "25", "25"), T("20", "20", "20")],
      [T("the written test", "लिखित परीक्षा", "ਲਿਖਤੀ ਪਰੀਖਿਆ"), T("the technical assessment", "तकनीकी आकलन", "ਤਕਨੀਕੀ ਮੁਲਾਂਕਣ"), T("the main examination", "मुख्य परीक्षा", "ਮੁੱਖ ਪਰੀਖਿਆ"), T("the skill test", "कौशल परीक्षा", "ਹੁਨਰ ਪਰੀਖਿਆ")],
      [T("the interview", "साक्षात्कार", "ਇੰਟਰਵਿਊ"), T("the viva", "मौखिक परीक्षा", "ਮੌਖਿਕ ਪਰੀਖਿਆ"), T("the personality test", "व्यक्तित्व परीक्षण", "ਵਿਅਕਤਿਤਵ ਟੈਸਟ"), T("the final interaction", "अंतिम संवाद", "ਅੰਤਿਮ ਸੰਵਾਦ")],
    ],
    statement: T("Under the composite-score rule, {c} carries {a}% weight and {d} carries {b}% weight; document verification is qualifying only and adds no score.", "समग्र अंक नियम में {c} का भार {a}% और {d} का भार {b}% है; दस्तावेज़ सत्यापन केवल अर्हकारी है और कोई अंक नहीं जोड़ता।", "ਕੁੱਲ ਸਕੋਰ ਨਿਯਮ ਵਿੱਚ {c} ਦਾ ਭਾਰ {a}% ਅਤੇ {d} ਦਾ ਭਾਰ {b}% ਹੈ; ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਸਿਰਫ਼ ਯੋਗਤਾ ਲਈ ਹੈ ਅਤੇ ਕੋਈ ਅੰਕ ਨਹੀਂ ਜੋੜਦੀ।"),
    conclusions: [T("{c} carries greater scoring weight than {d}.", "{c} का अंक-भार {d} से अधिक है।", "{c} ਦਾ ਸਕੋਰ ਭਾਰ {d} ਨਾਲੋਂ ਵੱਧ ਹੈ।"), T("Document verification does not itself add points to the composite score.", "दस्तावेज़ सत्यापन स्वयं समग्र अंक में अंक नहीं जोड़ता।", "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਆਪਣੇ ਆਪ ਕੁੱਲ ਸਕੋਰ ਵਿੱਚ ਅੰਕ ਨਹੀਂ ਜੋੜਦੀ।")],
    explanation: [T("{a}% is greater than {b}%.", "{a}% {b}% से अधिक है।", "{a}% {b}% ਨਾਲੋਂ ਵੱਧ ਹੈ।"), T("The rule explicitly says document verification is qualifying only and adds no score.", "नियम स्पष्ट रूप से कहता है कि दस्तावेज़ सत्यापन केवल अर्हकारी है और अंक नहीं जोड़ता।", "ਨਿਯਮ ਸਪਸ਼ਟ ਕਹਿੰਦਾ ਹੈ ਕਿ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਸਿਰਫ਼ ਯੋਗਤਾ ਲਈ ਹੈ ਅਤੇ ਅੰਕ ਨਹੀਂ ਜੋੜਦੀ।")],
  },
  {
    id: "STC-V22-QL005-T08", qlId: "STC-QL-005", surfaceArchetype: "EVENT_SEQUENCE", difficulty: "HARD", answerClass: "NEITHER",
    dimensions: [
      [T("Branch A", "शाखा A", "ਸ਼ਾਖਾ A"), T("Branch C", "शाखा C", "ਸ਼ਾਖਾ C"), T("Zone E", "क्षेत्र E", "ਜ਼ੋਨ E"), T("Unit G", "इकाई G", "ਇਕਾਈ G")],
      [T("Branch B", "शाखा B", "ਸ਼ਾਖਾ B"), T("Branch D", "शाखा D", "ਸ਼ਾਖਾ D"), T("Zone F", "क्षेत्र F", "ਜ਼ੋਨ F"), T("Unit H", "इकाई H", "ਇਕਾਈ H")],
      [T("approval rate", "स्वीकृति दर", "ਮਨਜ਼ੂਰੀ ਦਰ"), T("resolution rate", "निपटान दर", "ਨਿਪਟਾਰਾ ਦਰ"), T("collection rate", "संग्रह दर", "ਵਸੂਲੀ ਦਰ"), T("completion rate", "पूर्णता दर", "ਪੂਰਨਤਾ ਦਰ")],
      [T("a process change", "प्रक्रिया परिवर्तन", "ਪ੍ਰਕਿਰਿਆ ਬਦਲਾਅ"), T("a staffing change", "कर्मचारी बदलाव", "ਸਟਾਫ਼ ਬਦਲਾਅ"), T("a new workflow", "नई कार्यप्रणाली", "ਨਵਾਂ ਵਰਕਫ਼ਲੋ"), T("a revised screening rule", "संशोधित जाँच नियम", "ਸੋਧਿਆ ਜਾਂਚ ਨਿਯਮ")],
    ],
    statement: T("In the first review period, {a} had a higher {c} than {b}. In the next period, after {d}, {b} overtook {a} on that rate. No information is given about the absolute number of cases handled.", "पहली समीक्षा अवधि में {a} की {c} {b} से अधिक थी। अगली अवधि में {d} के बाद उसी दर पर {b}, {a} से आगे हो गया। कुल मामलों की संख्या नहीं दी गई है।", "ਪਹਿਲੀ ਸਮੀਖਿਆ ਅਵਧੀ ਵਿੱਚ {a} ਦੀ {c} {b} ਨਾਲੋਂ ਵੱਧ ਸੀ। ਅਗਲੀ ਅਵਧੀ ਵਿੱਚ {d} ਤੋਂ ਬਾਅਦ ਉਸੇ ਦਰ ਤੇ {b}, {a} ਤੋਂ ਅੱਗੇ ਨਿਕਲ ਗਿਆ। ਕੁੱਲ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।"),
    conclusions: [T("{a} still had the higher {c} in the second period.", "दूसरी अवधि में भी {a} की {c} अधिक थी।", "ਦੂਜੀ ਅਵਧੀ ਵਿੱਚ ਵੀ {a} ਦੀ {c} ਵੱਧ ਸੀ।"), T("{b} necessarily handled more cases in absolute terms in the second period.", "दूसरी अवधि में {b} ने कुल रूप से अनिवार्य रूप से अधिक मामले संभाले।", "ਦੂਜੀ ਅਵਧੀ ਵਿੱਚ {b} ਨੇ ਕੁੱਲ ਤੌਰ ਤੇ ਲਾਜ਼ਮੀ ਵੱਧ ਮਾਮਲੇ ਸੰਭਾਲੇ।")],
    explanation: [T("The statement says {b} overtook {a} on the rate in the second period.", "कथन कहता है कि दूसरी अवधि में दर पर {b}, {a} से आगे हो गया।", "ਕਥਨ ਕਹਿੰਦਾ ਹੈ ਕਿ ਦੂਜੀ ਅਵਧੀ ਵਿੱਚ ਦਰ ਤੇ {b}, {a} ਤੋਂ ਅੱਗੇ ਹੋ ਗਿਆ।"), T("A higher rate does not establish a larger absolute case count when the underlying totals are unknown.", "आधार संख्या अज्ञात होने पर अधिक दर से अधिक कुल मामलों की संख्या सिद्ध नहीं होती।", "ਅਧਾਰ ਗਿਣਤੀ ਅਣਜਾਣ ਹੋਣ ਤੇ ਵੱਧ ਦਰ ਨਾਲ ਵੱਧ ਕੁੱਲ ਮਾਮਲੇ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦੇ।")],
  },
] as const;
