import fs from "node:fs";

const QUESTION_HI_PATH = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.hi.json";
const QUESTION_PA_PATH = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.pa.json";
const QUESTION_EN_PATH = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-language.en.json";
const EXPLANATION_HI_PATH = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/explanation.hi.json";
const EXPLANATION_PA_PATH = "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/explanation.pa.json";

const hiTemplates = {
  "PCT-QL-001": "एक चुनाव में {baseValue} पंजीकृत मतदाताओं में से {percentageRate}% ने मतदान किया। कितने वोट डाले गए?",
  "PCT-QL-002": "एक मतदान केंद्र पर {baseValue} पंजीकृत मतदाता थे और उनमें से {percentageRate}% ने मतदान किया। कितने वोट पड़े?",
  "PCT-QL-003": "{percentageRate}% को उसके सरलतम भिन्न रूप में बदलें।",
  "PCT-QL-004": "{baseValue} का {value} कितने प्रतिशत है?",
  "PCT-QL-005": "A, B का {percentageRate}% है। यदि B = {baseValue}, तो A ज्ञात कीजिए।",
  "PCT-QL-006": "A, B से {percentageRate}% अधिक है। B, A से कितने प्रतिशत कम है?",
  "PCT-QL-007": "A, B से {percentageRate}% कम है। B, A से कितने प्रतिशत अधिक है?",
  "PCT-QL-008": "यदि A का {rate1}% , B के {rate2}% के बराबर है, तो A:B ज्ञात कीजिए।",
  "PCT-QL-009": "यदि किसी संख्या का {percentageRate}% = {value} है, तो वह संख्या क्या है?",
  "PCT-QL-101": "एक परीक्षा में किसी अभ्यर्थी ने कुल {baseValue} अंकों का {percentageRate}% प्राप्त किया। उसने कितने अंक प्राप्त किए?",
  "PCT-QL-102": "परिणाम-पत्र में अधिकतम अंक {baseValue} दिए गए हैं। यदि किसी अभ्यर्थी ने {percentageRate}% अंक प्राप्त किए, तो उसने कितने अंक पाए?",
  "PCT-QL-103": "{percentageRate}% को न्यूनतम रूप वाले भिन्न में व्यक्त कीजिए।",
  "PCT-QL-104": "किसी छात्र ने कुल {baseValue} अंकों में से {value} अंक प्राप्त किए। उसका प्रतिशत ज्ञात कीजिए।",
  "PCT-QL-105": "यदि B = {baseValue} और A, B का {percentageRate}% है, तो A ज्ञात कीजिए।",
  "PCT-QL-106": "यदि A, B से {percentageRate}% अधिक है, तो B, A से कितने प्रतिशत कम है?",
  "PCT-QL-107": "यदि A, B से {percentageRate}% कम है, तो B, A से कितने प्रतिशत अधिक है?",
  "PCT-QL-108": "यदि A का {rate1}% , B के {rate2}% के बराबर है, तो A:B ज्ञात कीजिए।",
  "PCT-QL-109": "किसी छात्र ने {value} अंक प्राप्त किए, जो अधिकतम अंकों का {percentageRate}% है। अधिकतम अंक ज्ञात कीजिए।",
  "PCT-QL-201": "किसी गाँव की {baseValue} जनसंख्या में से {percentageRate}% साक्षर हैं। कितने लोग साक्षर हैं?",
  "PCT-QL-202": "एक गाँव के साक्षरता सर्वेक्षण में {baseValue} लोग शामिल हैं। यदि उनमें से {percentageRate}% साक्षर हैं, तो कितने लोग साक्षर हैं?",
  "PCT-QL-203": "{percentageRate}% का समतुल्य भिन्न क्या है?",
  "PCT-QL-204": "कुल {baseValue} सेबों में से {value} सेब सड़े हुए थे। सड़े हुए सेबों का प्रतिशत ज्ञात कीजिए।",
  "PCT-QL-205": "B = {baseValue} है। A, B का {percentageRate}% है। A क्या है?",
  "PCT-QL-206": "A, B से {percentageRate}% अधिक है। ज्ञात कीजिए कि B, A से कितने प्रतिशत कम है।",
  "PCT-QL-207": "A, B से {percentageRate}% कम है। ज्ञात कीजिए कि B, A से कितने प्रतिशत अधिक है।",
  "PCT-QL-208": "A का {rate1}% , B के {rate2}% के बराबर है। A:B ज्ञात कीजिए।",
  "PCT-QL-209": "किसी व्यक्ति की मासिक आय का {percentageRate}% = Rs. {value} है। उसकी कुल मासिक आय क्या है?",
  "PCT-QL-301": "एक चिकित्सालय के पास मासिक संचालन अनुदान Rs. {baseValue} है। वह उसमें से {percentageRate}% दवाइयों पर खर्च करता है। दवाइयों पर होने वाला खर्च ज्ञात कीजिए।",
  "PCT-QL-302": "एक जिला संग्रहालय के पास वार्षिक रखरखाव निधि Rs. {baseValue} है। वह उसमें से {percentageRate}% पुनर्स्थापन कार्य पर खर्च करता है। पुनर्स्थापन व्यय ज्ञात कीजिए।",
  "PCT-QL-303": "{percentageRate}% को सरल भिन्न के रूप में लिखिए।",
  "PCT-QL-304": "कोई व्यक्ति अपनी कुल मासिक आय Rs. {baseValue} में से Rs. {value} बचाता है। उसकी बचत का प्रतिशत ज्ञात कीजिए।",
  "PCT-QL-305": "B का {percentageRate}% = A है। यदि B = {baseValue}, तो A ज्ञात कीजिए।",
  "PCT-QL-306": "A, B से {percentageRate}% अधिक है। B, A से कितने प्रतिशत कम है?",
  "PCT-QL-307": "A, B से {percentageRate}% कम है। B, A से कितने प्रतिशत अधिक है?",
  "PCT-QL-308": "यदि A का {rate1}% और B का {rate2}% बराबर है, तो A:B क्या होगा?",
  "PCT-QL-309": "एक विद्यालय में {value} छात्र क्रिकेट खेलते हैं, जो कुल संख्या का {percentageRate}% हैं। कुल छात्रों की संख्या ज्ञात कीजिए।",
  "PCT-QL-401": "किसी वस्तु का अंकित मूल्य Rs. {baseValue} है। यदि छूट {percentageRate}% है, तो छूट की राशि ज्ञात कीजिए।",
  "PCT-QL-402": "एक पुस्तक का अंकित मूल्य Rs. {baseValue} है। यदि उस पर {percentageRate}% की छूट दी जाती है, तो छूट की राशि ज्ञात कीजिए।",
  "PCT-QL-403": "{percentageRate}% को भिन्न के रूप में लिखिए।",
  "PCT-QL-404": "यदि {baseValue} वस्तुओं के एक बैच में {value} वस्तुएँ खराब हैं, तो खराबी की प्रतिशत दर क्या है?",
  "PCT-QL-405": "A, B का {percentageRate}% है। यदि B = {baseValue}, तो A का मान क्या होगा?",
  "PCT-QL-406": "यदि A, B से {percentageRate}% अधिक है, तो B, A से कितने प्रतिशत कम है?",
  "PCT-QL-407": "यदि A, B से {percentageRate}% कम है, तो B, A से कितने प्रतिशत अधिक है?",
  "PCT-QL-408": "जब A का {rate1}% , B के {rate2}% के बराबर हो, तो A:B ज्ञात कीजिए।",
  "PCT-QL-409": "अपना {percentageRate}% धन खर्च करने के बाद किसी व्यक्ति के पास Rs. {value} शेष बचते हैं। उसकी प्रारंभिक कुल राशि ज्ञात कीजिए।",
  "PCT-QL-501": "यदि कोई कारखाना प्रतिदिन {baseValue} इकाइयाँ बनाता है और उनमें से {percentageRate}% खराब हैं, तो प्रतिदिन कितनी खराब इकाइयाँ बनती हैं?",
  "PCT-QL-502": "दैनिक निरीक्षण पत्रक में {baseValue} उत्पादित इकाइयाँ दर्ज हैं, जिनमें से {percentageRate}% खराब हैं। कितनी खराब इकाइयाँ मिलीं?",
  "PCT-QL-503": "{percentageRate}% को उसके सरलतम भिन्न में बदलिए।",
  "PCT-QL-504": "एक चुनाव में किसी प्रत्याशी को कुल {baseValue} वैध मतों में से {value} मत मिले। उसने कितने प्रतिशत मत प्राप्त किए?",
  "PCT-QL-509": "एक दुकानदार ने {value} वस्तुएँ बेचीं, जो उसके कुल भंडार का {percentageRate}% थीं। उसका कुल भंडार कितना था?",
  "PCT-QL-601": "एक विद्यालय में {baseValue} छात्रों का {percentageRate}% लड़कियाँ हैं। कुल कितनी लड़कियाँ हैं?",
  "PCT-QL-602": "{baseValue} छात्रों की एक कक्षा में {percentageRate}% लड़कियाँ हैं। लड़कियों की संख्या ज्ञात कीजिए।",
  "PCT-QL-603": "{percentageRate}% के ठीक बराबर कौन-सा भिन्न है?",
  "PCT-QL-604": "किसी वस्तु का क्रय मूल्य Rs. {baseValue} है और लाभ Rs. {value} है। लाभ प्रतिशत ज्ञात कीजिए।",
  "PCT-QL-609": "यदि {percentageRate}% की छूट Rs. {value} के बराबर है, तो अंकित मूल्य क्या होगा?",
  "PCT-QL-701": "एक मिश्रण में {baseValue} लीटर द्रव है, जिसमें से {percentageRate}% पानी है। उसमें कितना पानी है?",
  "PCT-QL-702": "एक प्रयोगशाला विवरण में {baseValue} लीटर विलयन दर्ज है, जिसमें {percentageRate}% पानी है। उसमें कितने लीटर पानी है?",
  "PCT-QL-703": "प्रतिशत {percentageRate}% को भिन्न रूप में बदलिए।",
  "PCT-QL-704": "{baseValue} लीटर के मिश्रण में {value} लीटर दूध है। मिश्रण में दूध का प्रतिशत ज्ञात कीजिए।",
  "PCT-QL-709": "किसी वस्तु को बेचने पर प्राप्त लाभ Rs. {value} है, जो उसके क्रय मूल्य का {percentageRate}% है। क्रय मूल्य ज्ञात कीजिए।",
  "PCT-QL-801": "राहुल के पास Rs. {baseValue} हैं। वह उसका {percentageRate}% अपने मित्र को दे देता है। उसने कितनी राशि दी?",
  "PCT-QL-802": "नकद-बही में Rs. {baseValue} उपलब्ध दिखाए गए हैं। यदि उसका {percentageRate}% भुगतान कर दिया जाए, तो कितनी राशि दी जाएगी?",
  "PCT-QL-803": "{percentageRate}% को सरल भिन्न के रूप में लिखिए।",
  "PCT-QL-804": "{baseValue} छात्रों की एक कक्षा में {value} लड़कियाँ हैं। लड़कियों का प्रतिशत क्या है?",
  "PCT-QL-809": "यदि किसी नगर की जनसंख्या का {percentageRate}% = {value} है, तो कुल जनसंख्या ज्ञात कीजिए।",
  "PCT-QL-901": "किसी पुस्तक का अंकित मूल्य Rs. {baseValue} है। दुकानदार {percentageRate}% की छूट देता है। छूट की राशि क्या है?",
  "PCT-QL-902": "एक बिक्री-बिल में पुस्तक का अंकित मूल्य Rs. {baseValue} और छूट {percentageRate}% दी गई है। छूट की राशि क्या है?",
  "PCT-QL-903": "{percentageRate}% द्वारा निरूपित भिन्न ज्ञात कीजिए।",
  "PCT-QL-904": "यदि कुल {baseValue} किमी की यात्रा में से {value} किमी पूरी हो गई है, तो यात्रा का कितना प्रतिशत पूरा हुआ?",
  "PCT-QL-909": "एक कार के मूल्य में {percentageRate}% की कमी आती है, जो Rs. {value} के बराबर है। उसका मूल मूल्य ज्ञात कीजिए।",
  "PCT-QL-1001": "उपस्थिति रजिस्टर में {baseValue} छात्र दर्ज हैं और सोमवार को उनमें से {percentageRate}% उपस्थित थे। कक्षा में कितने छात्र उपस्थित हुए?",
  "PCT-QL-1002": "कक्षा की उपस्थिति सूची में {baseValue} नाम हैं और उनमें से {percentageRate}% उपस्थित थे। कितने छात्र उपस्थित हुए?",
  "PCT-QL-1003": "{percentageRate}% को न्यूनतम रूप वाले भिन्न में लिखिए।",
  "PCT-QL-1004": "एक दुकानदार ने Rs. {value} की छूट Rs. {baseValue} के अंकित मूल्य पर दी। छूट प्रतिशत ज्ञात कीजिए।",
  "PCT-QL-1009": "एक टंकी से {value} लीटर पानी निकल गया, जो उसकी कुल क्षमता का {percentageRate}% था। टंकी की कुल क्षमता क्या है?",
  "PCT-QL-1101": "एक फल विक्रेता के पास {baseValue} सेब थे। उसने उनमें से {percentageRate}% बेच दिए। बेचे गए सेबों की संख्या ज्ञात कीजिए।",
  "PCT-QL-1102": "फल भंडार रजिस्टर में {baseValue} सेब दर्ज हैं। यदि {percentageRate}% बिक गए, तो बिके हुए सेबों की संख्या ज्ञात कीजिए।",
  "PCT-QL-1103": "{percentageRate}% के बराबर कौन-सा भिन्न है?",
  "PCT-QL-1104": "{baseValue} की जनसंख्या में से {value} लोग साक्षर हैं। साक्षरता दर क्या है?",
  "PCT-QL-1109": "कोई व्यक्ति Rs. {value} आयकर देता है, जो उसके सकल वेतन का {percentageRate}% है। उसका सकल वेतन ज्ञात कीजिए।",
  "PCT-QL-1201": "किसी परीक्षा में उपस्थित {baseValue} अभ्यर्थियों में से {percentageRate}% पास हुए। कितने पास हुए?",
  "PCT-QL-1202": "एक परिणाम-सार में {baseValue} अभ्यर्थी हैं और उनमें से {percentageRate}% पास हुए। कितने अभ्यर्थी पास हुए?",
  "PCT-QL-1203": "{percentageRate}% का सबसे सरल भिन्न लिखिए।",
  "PCT-QL-1204": "कोई व्यक्ति अपने Rs. {baseValue} वेतन में से Rs. {value} किराए पर खर्च करता है। उसके वेतन का कितना प्रतिशत किराए में जाता है?",
  "PCT-QL-1209": "यदि किसी यात्रा का {percentageRate}% = {value} किमी है, तो कुल दूरी क्या है?",
  "PCT-QL-1301": "एक मिश्रधातु का कुल भार {baseValue} किग्रा है। यदि उसका {percentageRate}% ताँबा है, तो ताँबे का भार ज्ञात कीजिए।",
  "PCT-QL-1302": "कार्यशाला के सामग्री अभिलेख में {baseValue} किग्रा की एक मिश्रधातु दर्ज है। यदि उसका {percentageRate}% ताँबा है, तो ताँबे का भार ज्ञात कीजिए।",
  "PCT-QL-1303": "{percentageRate}% को समतुल्य भिन्न में बदलिए।",
  "PCT-QL-1304": "यदि किसी कारखाने का लक्ष्य {baseValue} इकाइयाँ था और उसने {value} इकाइयाँ बनाई, तो लक्ष्य का कितने प्रतिशत पूरा हुआ?",
  "PCT-QL-1309": "एक कक्षा में अनुपस्थित छात्रों की संख्या {value} है, जो कुल संख्या का {percentageRate}% है। कुल छात्रों की संख्या ज्ञात कीजिए।",
  "PCT-QL-1401": "यदि {baseValue} का {percentageRate}% = x है, तो x का मान क्या होगा?",
  "PCT-QL-1402": "एक कार्यपत्रक में {baseValue} का {percentageRate}% निकालने को कहा गया है। यदि वह मान x है, तो x ज्ञात कीजिए।",
  "PCT-QL-1403": "{percentageRate}% को भिन्न में बदलिए।",
  "PCT-QL-1404": "एक पुस्तक में {baseValue} पृष्ठ हैं और {value} पृष्ठ चित्रयुक्त हैं। पुस्तक का कितना प्रतिशत भाग चित्रयुक्त है?",
  "PCT-QL-1409": "यदि किसी मिश्रधातु में {value} किग्रा जस्ता है, जो उसके कुल भार का {percentageRate}% है, तो कुल भार क्या है?",
  "PCT-QL-1501": "एक पुस्तकालय में {baseValue} पुस्तकें हैं और उनमें से {percentageRate}% कथा-साहित्य की हैं। कथा-साहित्य की कितनी पुस्तकें हैं?",
  "PCT-QL-1502": "एक शेल्फ रजिस्टर में {baseValue} पुस्तकें दर्ज हैं और उनमें से {percentageRate}% कथा-साहित्य की हैं। कथा-साहित्य की कितनी पुस्तकें हैं?",
  "PCT-QL-1503": "{percentageRate}% के लिए भिन्न लिखिए।",
  "PCT-QL-1504": "अंकित मूल्य Rs. {baseValue} है और विक्रय मूल्य उससे Rs. {value} कम है। छूट प्रतिशत क्या है?",
  "PCT-QL-1509": "एक व्यापारी को Rs. {value} का नुकसान हुआ, जो उसके निवेश का {percentageRate}% है। उसका कुल निवेश ज्ञात कीजिए।",
  "PCT-QL-1601": "कोई व्यक्ति Rs. {baseValue} के वेतन का {percentageRate}% बचाता है। उसकी बचत ज्ञात कीजिए।",
  "PCT-QL-1602": "Rs. {baseValue} की मासिक आय में से {percentageRate}% बचाया जाता है। बचत ज्ञात कीजिए।",
  "PCT-QL-1603": "यदि कोई मान {percentageRate}% है, तो वह पूरे का कौन-सा भिन्न होगा?",
  "PCT-QL-1604": "{value} किग्रा ताँबा अन्य धातुओं के साथ मिलाकर {baseValue} किग्रा की मिश्रधातु बनाई गई। ताँबे का प्रतिशत ज्ञात कीजिए।",
  "PCT-QL-1609": "यदि किसी पुस्तक का {percentageRate}% भाग {value} चित्रयुक्त पृष्ठों के बराबर है, तो पुस्तक में कुल कितने पृष्ठ हैं?",
  "PCT-QL-1701": "{baseValue} पेड़ों वाले एक बगीचे में {percentageRate}% आम के पेड़ हैं। आम के कितने पेड़ हैं?",
  "PCT-QL-1702": "एक बागान अभिलेख में {baseValue} पेड़ दर्ज हैं, जिनमें से {percentageRate}% आम के पेड़ हैं। आम के कितने पेड़ हैं?",
  "PCT-QL-1703": "{percentageRate}% के बराबर सरलतम भिन्न ज्ञात कीजिए।",
  "PCT-QL-1704": "यदि कोई छात्र कुल {baseValue} कार्य-दिवसों में से {value} दिन विद्यालय जाता है, तो उसकी उपस्थिति प्रतिशत ज्ञात कीजिए।",
  "PCT-QL-1709": "किसी राशि पर प्राप्त ब्याज Rs. {value} है, जो मूलधन का {percentageRate}% है। मूलधन ज्ञात कीजिए।",
  "PCT-QL-1801": "एक पानी की टंकी में {baseValue} लीटर पानी है। उसमें से {percentageRate}% पानी उपयोग कर लिया गया। कितना पानी उपयोग हुआ?",
  "PCT-QL-1802": "आपूर्ति अभिलेख में {baseValue} लीटर पानी वाली एक टंकी दर्ज है। यदि उसका {percentageRate}% उपयोग हुआ, तो कितना पानी खर्च हुआ?",
  "PCT-QL-1803": "{percentageRate}% के समतुल्य भिन्न लिखिए।",
  "PCT-QL-1804": "{baseValue} लीटर क्षमता की एक टंकी में इस समय {value} लीटर पानी है। टंकी कितने प्रतिशत भरी हुई है?",
  "PCT-QL-1809": "{value} खराब वस्तुएँ दैनिक उत्पादन बैच का {percentageRate}% हैं। बैच का कुल आकार ज्ञात कीजिए।",
  "PCT-QL-1901": "एक निवेशक को Rs. {baseValue} पर {percentageRate}% का लाभ होता है। लाभ की राशि ज्ञात कीजिए।",
  "PCT-QL-1902": "एक व्यवसाय Rs. {baseValue} के निवेश पर {percentageRate}% लाभ कमाता है। लाभ ज्ञात कीजिए।",
  "PCT-QL-1903": "{percentageRate}% को भिन्न के रूप में व्यक्त कीजिए।",
  "PCT-QL-1904": "किसी परियोजना के लिए आवंटित Rs. {baseValue} में से Rs. {value} खर्च किए गए। कितने प्रतिशत खर्च हुए?",
  "PCT-QL-1909": "यदि किसी चुनाव में पड़े कुल मतों का {percentageRate}% = {value} था, तो कुल पड़े मत ज्ञात कीजिए।"
};

const paTemplates = {
  "PCT-QL-001": "ਇੱਕ ਚੋਣ ਵਿੱਚ {baseValue} ਦਰਜ ਵੋਟਰਾਂ ਵਿੱਚੋਂ {percentageRate}% ਨੇ ਵੋਟ ਪਾਈ। ਕੁੱਲ ਕਿੰਨੀਆਂ ਵੋਟਾਂ ਪਈਆਂ?",
  "PCT-QL-002": "ਇੱਕ ਪੋਲਿੰਗ ਬੂਥ 'ਤੇ {baseValue} ਦਰਜ ਵੋਟਰ ਸਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਨੇ ਵੋਟ ਪਾਈ। ਕੁੱਲ ਕਿੰਨੀਆਂ ਵੋਟਾਂ ਪਈਆਂ?",
  "PCT-QL-003": "{percentageRate}% ਨੂੰ ਇਸਦੇ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਰੂਪ ਵਿੱਚ ਬਦਲੋ।",
  "PCT-QL-004": "{baseValue} ਦਾ {value} ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?",
  "PCT-QL-005": "A, B ਦਾ {percentageRate}% ਹੈ। ਜੇ B = {baseValue}, ਤਾਂ A ਪਤਾ ਕਰੋ।",
  "PCT-QL-006": "A, B ਨਾਲੋਂ {percentageRate}% ਵੱਧ ਹੈ। B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੈ?",
  "PCT-QL-007": "A, B ਨਾਲੋਂ {percentageRate}% ਘੱਟ ਹੈ। B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?",
  "PCT-QL-008": "ਜੇ A ਦਾ {rate1}% , B ਦੇ {rate2}% ਦੇ ਬਰਾਬਰ ਹੈ, ਤਾਂ A:B ਪਤਾ ਕਰੋ।",
  "PCT-QL-009": "ਜੇ ਕਿਸੇ ਸੰਖਿਆ ਦਾ {percentageRate}% = {value} ਹੈ, ਤਾਂ ਉਹ ਸੰਖਿਆ ਕੀ ਹੈ?",
  "PCT-QL-101": "ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਕਿਸੇ ਉਮੀਦਵਾਰ ਨੇ ਕੁੱਲ {baseValue} ਅੰਕਾਂ ਦਾ {percentageRate}% ਹਾਸਲ ਕੀਤਾ। ਉਸਨੇ ਕਿੰਨੇ ਅੰਕ ਲਏ?",
  "PCT-QL-102": "ਨਤੀਜਾ-ਪੱਤਰ ਵਿੱਚ ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ {baseValue} ਦਿੱਤੇ ਹੋਏ ਹਨ। ਜੇ ਕਿਸੇ ਉਮੀਦਵਾਰ ਨੇ {percentageRate}% ਅੰਕ ਲਏ, ਤਾਂ ਉਸਨੇ ਕਿੰਨੇ ਅੰਕ ਪ੍ਰਾਪਤ ਕੀਤੇ?",
  "PCT-QL-103": "{percentageRate}% ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
  "PCT-QL-104": "ਕਿਸੇ ਵਿਦਿਆਰਥੀ ਨੇ ਕੁੱਲ {baseValue} ਅੰਕਾਂ ਵਿੱਚੋਂ {value} ਅੰਕ ਲਏ। ਉਸਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-105": "ਜੇ B = {baseValue} ਅਤੇ A, B ਦਾ {percentageRate}% ਹੈ, ਤਾਂ A ਪਤਾ ਕਰੋ।",
  "PCT-QL-106": "ਜੇ A, B ਨਾਲੋਂ {percentageRate}% ਵੱਧ ਹੈ, ਤਾਂ B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੈ?",
  "PCT-QL-107": "ਜੇ A, B ਨਾਲੋਂ {percentageRate}% ਘੱਟ ਹੈ, ਤਾਂ B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?",
  "PCT-QL-108": "ਜੇ A ਦਾ {rate1}% , B ਦੇ {rate2}% ਦੇ ਬਰਾਬਰ ਹੈ, ਤਾਂ A:B ਪਤਾ ਕਰੋ।",
  "PCT-QL-109": "ਕਿਸੇ ਵਿਦਿਆਰਥੀ ਨੇ {value} ਅੰਕ ਲਏ, ਜੋ ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕਾਂ ਦਾ {percentageRate}% ਹਨ। ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ ਪਤਾ ਕਰੋ।",
  "PCT-QL-201": "ਕਿਸੇ ਪਿੰਡ ਦੀ {baseValue} ਆਬਾਦੀ ਵਿੱਚੋਂ {percentageRate}% ਸਾਖਰ ਹਨ। ਕਿੰਨੇ ਲੋਕ ਸਾਖਰ ਹਨ?",
  "PCT-QL-202": "ਇੱਕ ਪਿੰਡ ਦੇ ਸਾਖਰਤਾ ਸਰਵੇਖਣ ਵਿੱਚ {baseValue} ਲੋਕ ਸ਼ਾਮਲ ਹਨ। ਜੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਸਾਖਰ ਹਨ, ਤਾਂ ਕਿੰਨੇ ਲੋਕ ਸਾਖਰ ਹਨ?",
  "PCT-QL-203": "{percentageRate}% ਦਾ ਸਮਤੁੱਲ ਭਿੰਨ ਕੀ ਹੈ?",
  "PCT-QL-204": "ਕੁੱਲ {baseValue} ਸੇਬਾਂ ਵਿੱਚੋਂ {value} ਸੇਬ ਸੜੇ ਹੋਏ ਸਨ। ਸੜੇ ਹੋਏ ਸੇਬਾਂ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-205": "B = {baseValue} ਹੈ। A, B ਦਾ {percentageRate}% ਹੈ। A ਕੀ ਹੈ?",
  "PCT-QL-206": "A, B ਨਾਲੋਂ {percentageRate}% ਵੱਧ ਹੈ। ਪਤਾ ਕਰੋ ਕਿ B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੈ।",
  "PCT-QL-207": "A, B ਨਾਲੋਂ {percentageRate}% ਘੱਟ ਹੈ। ਪਤਾ ਕਰੋ ਕਿ B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ।",
  "PCT-QL-208": "A ਦਾ {rate1}% , B ਦੇ {rate2}% ਦੇ ਬਰਾਬਰ ਹੈ। A:B ਪਤਾ ਕਰੋ।",
  "PCT-QL-209": "ਕਿਸੇ ਵਿਅਕਤੀ ਦੀ ਮਾਸਿਕ ਆਮਦਨ ਦਾ {percentageRate}% = Rs. {value} ਹੈ। ਉਸਦੀ ਕੁੱਲ ਮਾਸਿਕ ਆਮਦਨ ਕੀ ਹੈ?",
  "PCT-QL-301": "ਇੱਕ ਕਲੀਨਿਕ ਕੋਲ Rs. {baseValue} ਦਾ ਮਾਸਿਕ ਚਾਲੂ ਅਨੁਦਾਨ ਹੈ। ਉਹ ਇਸਦਾ {percentageRate}% ਦਵਾਈਆਂ 'ਤੇ ਖਰਚ ਕਰਦਾ ਹੈ। ਦਵਾਈਆਂ ਦਾ ਖਰਚ ਪਤਾ ਕਰੋ।",
  "PCT-QL-302": "ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਅਜਾਇਬਘਰ ਕੋਲ Rs. {baseValue} ਦਾ ਸਾਲਾਨਾ ਰੱਖ-ਰਖਾਵ ਫੰਡ ਹੈ। ਉਹ ਇਸਦਾ {percentageRate}% ਮੁੜ-ਸੰਭਾਲ ਦੇ ਕੰਮ 'ਤੇ ਖਰਚ ਕਰਦਾ ਹੈ। ਉਹ ਖਰਚ ਪਤਾ ਕਰੋ।",
  "PCT-QL-303": "{percentageRate}% ਨੂੰ ਸਰਲ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
  "PCT-QL-304": "ਕੋਈ ਵਿਅਕਤੀ ਆਪਣੀ ਕੁੱਲ ਮਾਸਿਕ ਆਮਦਨ Rs. {baseValue} ਵਿੱਚੋਂ Rs. {value} ਬਚਾਂਦਾ ਹੈ। ਬਚਤ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-305": "B ਦਾ {percentageRate}% = A ਹੈ। ਜੇ B = {baseValue}, ਤਾਂ A ਪਤਾ ਕਰੋ।",
  "PCT-QL-306": "A, B ਨਾਲੋਂ {percentageRate}% ਵੱਧ ਹੈ। B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੈ?",
  "PCT-QL-307": "A, B ਨਾਲੋਂ {percentageRate}% ਘੱਟ ਹੈ। B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?",
  "PCT-QL-308": "ਜੇ A ਦਾ {rate1}% ਅਤੇ B ਦਾ {rate2}% ਬਰਾਬਰ ਹੈ, ਤਾਂ A:B ਕੀ ਹੋਵੇਗਾ?",
  "PCT-QL-309": "ਇੱਕ ਸਕੂਲ ਵਿੱਚ {value} ਵਿਦਿਆਰਥੀ ਕ੍ਰਿਕਟ ਖੇਡਦੇ ਹਨ, ਜੋ ਕੁੱਲ ਗਿਣਤੀ ਦਾ {percentageRate}% ਹਨ। ਕੁੱਲ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
  "PCT-QL-401": "ਕਿਸੇ ਵਸਤੂ ਦੀ ਦਰਜ ਕੀਮਤ Rs. {baseValue} ਹੈ। ਜੇ ਛੂਟ {percentageRate}% ਹੈ, ਤਾਂ ਛੂਟ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।",
  "PCT-QL-402": "ਇੱਕ ਕਿਤਾਬ ਦੀ ਦਰਜ ਕੀਮਤ Rs. {baseValue} ਹੈ। ਜੇ ਇਸ 'ਤੇ {percentageRate}% ਦੀ ਛੂਟ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ, ਤਾਂ ਛੂਟ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।",
  "PCT-QL-403": "{percentageRate}% ਨੂੰ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
  "PCT-QL-404": "ਜੇ {baseValue} ਵਸਤੂਆਂ ਵਾਲੇ ਇੱਕ ਬੈਚ ਵਿੱਚ {value} ਵਸਤੂਆਂ ਖਰਾਬ ਹਨ, ਤਾਂ ਖਰਾਬੀ ਦੀ ਪ੍ਰਤੀਸ਼ਤ ਦਰ ਕੀ ਹੈ?",
  "PCT-QL-405": "A, B ਦਾ {percentageRate}% ਹੈ। ਜੇ B = {baseValue}, ਤਾਂ A ਦਾ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?",
  "PCT-QL-406": "ਜੇ A, B ਨਾਲੋਂ {percentageRate}% ਵੱਧ ਹੈ, ਤਾਂ B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘੱਟ ਹੈ?",
  "PCT-QL-407": "ਜੇ A, B ਨਾਲੋਂ {percentageRate}% ਘੱਟ ਹੈ, ਤਾਂ B, A ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਹੈ?",
  "PCT-QL-408": "ਜਦੋਂ A ਦਾ {rate1}% , B ਦੇ {rate2}% ਦੇ ਬਰਾਬਰ ਹੋਵੇ, ਤਾਂ A:B ਪਤਾ ਕਰੋ।",
  "PCT-QL-409": "ਆਪਣਾ {percentageRate}% ਧਨ ਖਰਚ ਕਰਨ ਤੋਂ ਬਾਅਦ ਕਿਸੇ ਵਿਅਕਤੀ ਕੋਲ Rs. {value} ਬਚਦੇ ਹਨ। ਉਸਦੀ ਸ਼ੁਰੂਆਤੀ ਕੁੱਲ ਰਕਮ ਪਤਾ ਕਰੋ।",
  "PCT-QL-501": "ਜੇ ਕੋਈ ਫੈਕਟਰੀ ਹਰ ਰੋਜ਼ {baseValue} ਇਕਾਈਆਂ ਬਣਾਉਂਦੀ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਖਰਾਬ ਹਨ, ਤਾਂ ਹਰ ਰੋਜ਼ ਕਿੰਨੀ ਖਰਾਬ ਇਕਾਈਆਂ ਬਣਦੀਆਂ ਹਨ?",
  "PCT-QL-502": "ਰੋਜ਼ਾਨਾ ਜਾਂਚ-ਪੱਤਰ ਵਿੱਚ {baseValue} ਤਿਆਰ ਕੀਤੀਆਂ ਇਕਾਈਆਂ ਦਰਜ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਖਰਾਬ ਹਨ। ਕਿੰਨੀਆਂ ਖਰਾਬ ਇਕਾਈਆਂ ਮਿਲੀਆਂ?",
  "PCT-QL-503": "{percentageRate}% ਨੂੰ ਇਸਦੇ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਵਿੱਚ ਬਦਲੋ।",
  "PCT-QL-504": "ਇੱਕ ਚੋਣ ਵਿੱਚ ਕਿਸੇ ਉਮੀਦਵਾਰ ਨੂੰ ਕੁੱਲ {baseValue} ਵੈਧ ਵੋਟਾਂ ਵਿੱਚੋਂ {value} ਵੋਟਾਂ ਮਿਲੀਆਂ। ਉਸਨੇ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੋਟਾਂ ਪ੍ਰਾਪਤ ਕੀਤੀਆਂ?",
  "PCT-QL-509": "ਇੱਕ ਦੁਕानदार ਨੇ {value} ਵਸਤੂਆਂ ਵੇਚੀਆਂ, ਜੋ ਉਸਦੇ ਕੁੱਲ ਸਟਾਕ ਦਾ {percentageRate}% ਸਨ। ਉਸਦਾ ਕੁੱਲ ਸਟਾਕ ਕਿੰਨਾ ਸੀ?",
  "PCT-QL-601": "ਇੱਕ ਸਕੂਲ ਵਿੱਚ {baseValue} ਵਿਦਿਆਰਥੀਆਂ ਦਾ {percentageRate}% ਕੁੜੀਆਂ ਹਨ। ਕੁੱਲ ਕਿੰਨੀਆਂ ਕੁੜੀਆਂ ਹਨ?",
  "PCT-QL-602": "{baseValue} ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਇੱਕ ਕਲਾਸ ਵਿੱਚ {percentageRate}% ਕੁੜੀਆਂ ਹਨ। ਕੁੜੀਆਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
  "PCT-QL-603": "{percentageRate}% ਦੇ ਠੀਕ ਬਰਾਬਰ ਕਿਹੜਾ ਭਿੰਨ ਹੈ?",
  "PCT-QL-604": "ਕਿਸੇ ਵਸਤੂ ਦੀ ਲਾਗਤ ਕੀਮਤ Rs. {baseValue} ਹੈ ਅਤੇ ਲਾਭ Rs. {value} ਹੈ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-609": "ਜੇ {percentageRate}% ਦੀ ਛੂਟ Rs. {value} ਦੇ ਬਰਾਬਰ ਹੈ, ਤਾਂ ਦਰਜ ਕੀਮਤ ਕੀ ਹੋਵੇਗੀ?",
  "PCT-QL-701": "ਇੱਕ ਮਿਸ਼ਰਣ ਵਿੱਚ {baseValue} ਲੀਟਰ ਤਰਲ ਹੈ, ਜਿਸ ਵਿੱਚੋਂ {percentageRate}% ਪਾਣੀ ਹੈ। ਇਸ ਵਿੱਚ ਕਿੰਨਾ ਪਾਣੀ ਹੈ?",
  "PCT-QL-702": "ਇੱਕ ਲੈਬ ਨੋਟ ਵਿੱਚ {baseValue} ਲੀਟਰ ਘੋਲ ਦਰਜ ਹੈ, ਜਿਸ ਵਿੱਚ {percentageRate}% ਪਾਣੀ ਹੈ। ਇਸ ਵਿੱਚ ਕਿੰਨੇ ਲੀਟਰ ਪਾਣੀ ਹਨ?",
  "PCT-QL-703": "ਪ੍ਰਤੀਸ਼ਤ {percentageRate}% ਨੂੰ ਭਿੰਨ ਰੂਪ ਵਿੱਚ ਬਦਲੋ।",
  "PCT-QL-704": "{baseValue} ਲੀਟਰ ਦੇ ਮਿਸ਼ਰਣ ਵਿੱਚ {value} ਲੀਟਰ ਦੁੱਧ ਹੈ। ਮਿਸ਼ਰਣ ਵਿੱਚ ਦੁੱਧ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-709": "ਕਿਸੇ ਵਸਤੂ ਨੂੰ ਵੇਚਣ 'ਤੇ ਹੋਇਆ ਲਾਭ Rs. {value} ਹੈ, ਜੋ ਇਸਦੀ ਲਾਗਤ ਕੀਮਤ ਦਾ {percentageRate}% ਹੈ। ਲਾਗਤ ਕੀਮਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-801": "ਰਾਹੁਲ ਕੋਲ Rs. {baseValue} ਹਨ। ਉਹ ਇਸਦਾ {percentageRate}% ਆਪਣੇ ਦੋਸਤ ਨੂੰ ਦੇ ਦਿੰਦਾ ਹੈ। ਉਸਨੇ ਕਿੰਨੀ ਰਕਮ ਦਿੱਤੀ?",
  "PCT-QL-802": "ਨਕਦ-ਬਹੀ ਵਿੱਚ Rs. {baseValue} ਉਪਲਬਧ ਦਰਸਾਏ ਗਏ ਹਨ। ਜੇ ਇਸਦਾ {percentageRate}% ਅਦਾ ਕਰ ਦਿੱਤਾ ਜਾਵੇ, ਤਾਂ ਕਿੰਨੀ ਰਕਮ ਦਿੱਤੀ ਜਾਵੇਗੀ?",
  "PCT-QL-803": "{percentageRate}% ਨੂੰ ਸਰਲ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
  "PCT-QL-804": "{baseValue} ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਇੱਕ ਕਲਾਸ ਵਿੱਚ {value} ਕੁੜੀਆਂ ਹਨ। ਕੁੜੀਆਂ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕੀ ਹੈ?",
  "PCT-QL-809": "ਜੇ ਕਿਸੇ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ ਦਾ {percentageRate}% = {value} ਹੈ, ਤਾਂ ਕੁੱਲ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।",
  "PCT-QL-901": "ਕਿਸੇ ਕਿਤਾਬ ਦੀ ਦਰਜ ਕੀਮਤ Rs. {baseValue} ਹੈ। ਦੁਕानदार {percentageRate}% ਦੀ ਛੂਟ ਦਿੰਦਾ ਹੈ। ਛੂਟ ਦੀ ਰਕਮ ਕੀ ਹੈ?",
  "PCT-QL-902": "ਇੱਕ ਵੇਚ-ਬਿੱਲ ਵਿੱਚ ਕਿਤਾਬ ਦੀ ਦਰਜ ਕੀਮਤ Rs. {baseValue} ਅਤੇ ਛੂਟ {percentageRate}% ਦਿੱਤੀ ਗਈ ਹੈ। ਛੂਟ ਦੀ ਰਕਮ ਕੀ ਹੈ?",
  "PCT-QL-903": "{percentageRate}% ਨਾਲ ਦਰਸਾਇਆ ਭਿੰਨ ਪਤਾ ਕਰੋ।",
  "PCT-QL-904": "ਜੇ ਕੁੱਲ {baseValue} ਕਿਮੀ ਦੀ ਯਾਤਰਾ ਵਿੱਚੋਂ {value} ਕਿਮੀ ਪੂਰੀ ਹੋ ਚੁੱਕੀ ਹੈ, ਤਾਂ ਯਾਤਰਾ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਪੂਰਾ ਹੋਇਆ?",
  "PCT-QL-909": "ਇੱਕ ਕਾਰ ਦੀ ਕੀਮਤ ਵਿੱਚ {percentageRate}% ਦੀ ਕਮੀ ਆਉਂਦੀ ਹੈ, ਜੋ Rs. {value} ਦੇ ਬਰਾਬਰ ਹੈ। ਇਸਦਾ ਮੁੱਢਲਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1001": "ਹਾਜ਼ਰੀ ਰਜਿਸਟਰ ਵਿੱਚ {baseValue} ਵਿਦਿਆਰਥੀ ਦਰਜ ਹਨ ਅਤੇ ਸੋਮਵਾਰ ਨੂੰ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਹਾਜ਼ਰ ਸਨ। ਕਲਾਸ ਵਿੱਚ ਕਿੰਨੇ ਵਿਦਿਆਰਥੀ ਹਾਜ਼ਰ ਹੋਏ?",
  "PCT-QL-1002": "ਕਲਾਸ ਦੀ ਹਾਜ਼ਰੀ ਸੂਚੀ ਵਿੱਚ {baseValue} ਨਾਮ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਹਾਜ਼ਰ ਸਨ। ਕਿੰਨੇ ਵਿਦਿਆਰਥੀ ਹਾਜ਼ਰ ਹੋਏ?",
  "PCT-QL-1003": "{percentageRate}% ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
  "PCT-QL-1004": "ਇੱਕ ਦੁਕानदार ਨੇ Rs. {value} ਦੀ ਛੂਟ Rs. {baseValue} ਦੀ ਦਰਜ ਕੀਮਤ 'ਤੇ ਦਿੱਤੀ। ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1009": "ਇੱਕ ਟੈਂਕ ਵਿੱਚੋਂ {value} ਲੀਟਰ ਪਾਣੀ ਨਿਕਲ ਗਿਆ, ਜੋ ਇਸਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਦਾ {percentageRate}% ਸੀ। ਟੈਂਕ ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਕੀ ਹੈ?",
  "PCT-QL-1101": "ਇੱਕ ਫਲ ਵੇਚਣ ਵਾਲੇ ਕੋਲ {baseValue} ਸੇਬ ਸਨ। ਉਸਨੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਵੇਚ ਦਿੱਤੇ। ਵੇਚੇ ਗਏ ਸੇਬਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1102": "ਫਲ ਸਟਾਕ ਰਜਿਸਟਰ ਵਿੱਚ {baseValue} ਸੇਬ ਦਰਜ ਹਨ। ਜੇ {percentageRate}% ਵੇਚੇ ਗਏ, ਤਾਂ ਵੇਚੇ ਗਏ ਸੇਬਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1103": "{percentageRate}% ਦੇ ਬਰਾਬਰ ਕਿਹੜਾ ਭਿੰਨ ਹੈ?",
  "PCT-QL-1104": "{baseValue} ਦੀ ਆਬਾਦੀ ਵਿੱਚੋਂ {value} ਲੋਕ ਸਾਖਰ ਹਨ। ਸਾਖਰਤਾ ਦਰ ਕੀ ਹੈ?",
  "PCT-QL-1109": "ਕੋਈ ਵਿਅਕਤੀ Rs. {value} ਆਮਦਨੀ ਕਰ ਦੇਂਦਾ ਹੈ, ਜੋ ਉਸਦੀ ਕੁੱਲ ਤਨਖ਼ਾਹ ਦਾ {percentageRate}% ਹੈ। ਉਸਦੀ ਕੁੱਲ ਤਨਖ਼ਾਹ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1201": "ਕਿਸੇ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਸ਼ਾਮਲ {baseValue} ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ {percentageRate}% ਪਾਸ ਹੋਏ। ਕਿੰਨੇ ਪਾਸ ਹੋਏ?",
  "PCT-QL-1202": "ਇੱਕ ਨਤੀਜਾ-ਸਾਰ ਵਿੱਚ {baseValue} ਉਮੀਦਵਾਰ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਪਾਸ ਹੋਏ। ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਪਾਸ ਹੋਏ?",
  "PCT-QL-1203": "{percentageRate}% ਦਾ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਲਿਖੋ।",
  "PCT-QL-1204": "ਕੋਈ ਵਿਅਕਤੀ ਆਪਣੀ Rs. {baseValue} ਤਨਖ਼ਾਹ ਵਿੱਚੋਂ Rs. {value} ਕਿਰਾਏ 'ਤੇ ਖਰਚ ਕਰਦਾ ਹੈ। ਉਸਦੀ ਤਨਖ਼ਾਹ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਕਿਰਾਏ ਵਿੱਚ ਜਾਂਦਾ ਹੈ?",
  "PCT-QL-1209": "ਜੇ ਕਿਸੇ ਯਾਤਰਾ ਦਾ {percentageRate}% = {value} ਕਿਮੀ ਹੈ, ਤਾਂ ਕੁੱਲ ਦੂਰੀ ਕੀ ਹੈ?",
  "PCT-QL-1301": "ਇੱਕ ਮਿਸ਼ਰਧਾਤੂ ਦਾ ਕੁੱਲ ਭਾਰ {baseValue} ਕਿਲੋ ਹੈ। ਜੇ ਇਸਦਾ {percentageRate}% ਤਾਮਬਾ ਹੈ, ਤਾਂ ਤਾਮਬੇ ਦਾ ਭਾਰ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1302": "ਕਾਰਖਾਨੇ ਦੇ ਸਮੱਗਰੀ ਰਿਕਾਰਡ ਵਿੱਚ {baseValue} ਕਿਲੋ ਦੀ ਇੱਕ ਮਿਸ਼ਰਧਾਤੂ ਦਰਜ ਹੈ। ਜੇ ਇਸਦਾ {percentageRate}% ਤਾਮਬਾ ਹੈ, ਤਾਂ ਤਾਮਬੇ ਦਾ ਭਾਰ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1303": "{percentageRate}% ਨੂੰ ਸਮਤੁੱਲ ਭਿੰਨ ਵਿੱਚ ਬਦਲੋ।",
  "PCT-QL-1304": "ਜੇ ਕਿਸੇ ਫੈਕਟਰੀ ਦਾ ਲਕਸ਼ {baseValue} ਇਕਾਈਆਂ ਸੀ ਅਤੇ ਇਸਨੇ {value} ਇਕਾਈਆਂ ਤਿਆਰ ਕੀਤੀਆਂ, ਤਾਂ ਲਕਸ਼ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਪੂਰਾ ਹੋਇਆ?",
  "PCT-QL-1309": "ਇੱਕ ਕਲਾਸ ਵਿੱਚ ਗੈਰਹਾਜ਼ਰ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ {value} ਹੈ, ਜੋ ਕੁੱਲ ਦਾ {percentageRate}% ਹੈ। ਕੁੱਲ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1401": "ਜੇ {baseValue} ਦਾ {percentageRate}% = x ਹੈ, ਤਾਂ x ਦਾ ਮੁੱਲ ਕੀ ਹੋਵੇਗਾ?",
  "PCT-QL-1402": "ਇੱਕ ਵਰਕਸ਼ੀਟ ਵਿੱਚ {baseValue} ਦਾ {percentageRate}% ਕੱਢਣ ਲਈ ਕਿਹਾ ਗਿਆ ਹੈ। ਜੇ ਉਹ ਮੁੱਲ x ਹੈ, ਤਾਂ x ਪਤਾ ਕਰੋ।",
  "PCT-QL-1403": "{percentageRate}% ਨੂੰ ਭਿੰਨ ਵਿੱਚ ਬਦਲੋ।",
  "PCT-QL-1404": "ਇੱਕ ਕਿਤਾਬ ਵਿੱਚ {baseValue} ਸਫ਼ੇ ਹਨ ਅਤੇ {value} ਸਫ਼ੇ ਚਿੱਤਰਾਂ ਵਾਲੇ ਹਨ। ਕਿਤਾਬ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਭਾਗ ਚਿੱਤਰਯੁਕਤ ਹੈ?",
  "PCT-QL-1409": "ਜੇ ਕਿਸੇ ਮਿਸ਼ਰਧਾਤੂ ਵਿੱਚ {value} ਕਿਲੋ ਜ਼ਿੰਕ ਹੈ, ਜੋ ਇਸਦੇ ਕੁੱਲ ਭਾਰ ਦਾ {percentageRate}% ਹੈ, ਤਾਂ ਕੁੱਲ ਭਾਰ ਕੀ ਹੈ?",
  "PCT-QL-1501": "ਇੱਕ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ {baseValue} ਕਿਤਾਬਾਂ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਕਥਾ-ਸਾਹਿਤ ਦੀਆਂ ਹਨ। ਕਥਾ-ਸਾਹਿਤ ਦੀਆਂ ਕਿੰਨੀਆਂ ਕਿਤਾਬਾਂ ਹਨ?",
  "PCT-QL-1502": "ਇੱਕ ਸ਼ੈਲਫ਼ ਰਜਿਸਟਰ ਵਿੱਚ {baseValue} ਕਿਤਾਬਾਂ ਦਰਜ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਕਥਾ-ਸਾਹਿਤ ਦੀਆਂ ਹਨ। ਕਥਾ-ਸਾਹਿਤ ਦੀਆਂ ਕਿੰਨੀਆਂ ਕਿਤਾਬਾਂ ਹਨ?",
  "PCT-QL-1503": "{percentageRate}% ਲਈ ਭਿੰਨ ਲਿਖੋ।",
  "PCT-QL-1504": "ਦਰਜ ਕੀਮਤ Rs. {baseValue} ਹੈ ਅਤੇ ਵੇਚ ਕੀਮਤ ਇਸ ਤੋਂ Rs. {value} ਘੱਟ ਹੈ। ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ ਕੀ ਹੈ?",
  "PCT-QL-1509": "ਇੱਕ ਵਪਾਰੀ ਨੂੰ Rs. {value} ਦਾ ਨੁਕਸਾਨ ਹੋਇਆ, ਜੋ ਇਸਦੇ ਨਿਵੇਸ਼ ਦਾ {percentageRate}% ਹੈ। ਕੁੱਲ ਨਿਵੇਸ਼ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1601": "ਕੋਈ ਵਿਅਕਤੀ Rs. {baseValue} ਦੀ ਤਨਖ਼ਾਹ ਦਾ {percentageRate}% ਬਚਾਂਦਾ ਹੈ। ਬਚਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1602": "Rs. {baseValue} ਦੀ ਮਾਸਿਕ ਆਮਦਨ ਵਿੱਚੋਂ {percentageRate}% ਬਚਾਇਆ ਜਾਂਦਾ ਹੈ। ਬਚਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1603": "ਜੇ ਕੋਈ ਮੁੱਲ {percentageRate}% ਹੈ, ਤਾਂ ਇਹ ਪੂਰੇ ਦਾ ਕਿਹੜਾ ਭਿੰਨ ਹੋਵੇਗਾ?",
  "PCT-QL-1604": "{value} ਕਿਲੋ ਤਾਮਬੇ ਨੂੰ ਹੋਰ ਧਾਤਾਂ ਨਾਲ ਮਿਲਾਕੇ {baseValue} ਕਿਲੋ ਦੀ ਮਿਸ਼ਰਧਾਤੂ ਬਣਾਈ ਗਈ। ਤਾਮਬੇ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1609": "ਜੇ ਕਿਸੇ ਕਿਤਾਬ ਦਾ {percentageRate}% ਭਾਗ {value} ਚਿੱਤਰਯੁਕਤ ਸਫ਼ਿਆਂ ਦੇ ਬਰਾਬਰ ਹੈ, ਤਾਂ ਕਿਤਾਬ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਸਫ਼ੇ ਹਨ?",
  "PCT-QL-1701": "{baseValue} ਰੁੱਖਾਂ ਵਾਲੇ ਇੱਕ ਬਾਗ ਵਿੱਚ {percentageRate}% ਅੰਬ ਦੇ ਰੁੱਖ ਹਨ। ਅੰਬ ਦੇ ਕਿੰਨੇ ਰੁੱਖ ਹਨ?",
  "PCT-QL-1702": "ਇੱਕ ਬਾਗਬਾਨੀ ਰਿਕਾਰਡ ਵਿੱਚ {baseValue} ਰੁੱਖ ਦਰਜ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ {percentageRate}% ਅੰਬ ਦੇ ਰੁੱਖ ਹਨ। ਅੰਬ ਦੇ ਕਿੰਨੇ ਰੁੱਖ ਹਨ?",
  "PCT-QL-1703": "{percentageRate}% ਦੇ ਬਰਾਬਰ ਸਭ ਤੋਂ ਸਰਲ ਭਿੰਨ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1704": "ਜੇ ਕੋਈ ਵਿਦਿਆਰਥੀ ਕੁੱਲ {baseValue} ਕਾਰਜ ਦਿਨਾਂ ਵਿੱਚੋਂ {value} ਦਿਨ ਸਕੂਲ ਜਾਂਦਾ ਹੈ, ਤਾਂ ਉਸਦੀ ਹਾਜ਼ਰੀ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1709": "ਕਿਸੇ ਰਕਮ 'ਤੇ ਮਿਲਿਆ ਵਿਆਜ Rs. {value} ਹੈ, ਜੋ ਮੁੱਢ ਰਕਮ ਦਾ {percentageRate}% ਹੈ। ਮੁੱਢ ਰਕਮ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1801": "ਇੱਕ ਪਾਣੀ ਦੇ ਟੈਂਕ ਵਿੱਚ {baseValue} ਲੀਟਰ ਪਾਣੀ ਹੈ। ਇਸ ਵਿੱਚੋਂ {percentageRate}% ਪਾਣੀ ਵਰਤਿਆ ਗਿਆ। ਕਿੰਨਾ ਪਾਣੀ ਵਰਤਿਆ ਗਿਆ?",
  "PCT-QL-1802": "ਸਪਲਾਈ ਰਿਕਾਰਡ ਵਿੱਚ {baseValue} ਲੀਟਰ ਪਾਣੀ ਵਾਲਾ ਇੱਕ ਟੈਂਕ ਦਰਜ ਹੈ। ਜੇ ਇਸਦਾ {percentageRate}% ਵਰਤਿਆ ਗਿਆ, ਤਾਂ ਕਿੰਨਾ ਪਾਣੀ ਖਰਚ ਹੋਇਆ?",
  "PCT-QL-1803": "{percentageRate}% ਦੇ ਸਮਤੁੱਲ ਭਿੰਨ ਲਿਖੋ।",
  "PCT-QL-1804": "{baseValue} ਲੀਟਰ ਸਮਰੱਥਾ ਵਾਲੇ ਇੱਕ ਟੈਂਕ ਵਿੱਚ ਇਸ ਵੇਲੇ {value} ਲੀਟਰ ਪਾਣੀ ਹੈ। ਟੈਂਕ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਭਰਿਆ ਹੋਇਆ ਹੈ?",
  "PCT-QL-1809": "{value} ਖਰਾਬ ਵਸਤੂਆਂ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਬੈਚ ਦਾ {percentageRate}% ਹਨ। ਬੈਚ ਦਾ ਕੁੱਲ ਆਕਾਰ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1901": "ਇੱਕ ਨਿਵੇਸ਼ਕ ਨੂੰ Rs. {baseValue} 'ਤੇ {percentageRate}% ਲਾਭ ਹੁੰਦਾ ਹੈ। ਲਾਭ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1902": "ਇੱਕ ਕਾਰੋਬਾਰ Rs. {baseValue} ਦੇ ਨਿਵੇਸ਼ 'ਤੇ {percentageRate}% ਲਾਭ ਕਮਾਂਦਾ ਹੈ। ਲਾਭ ਪਤਾ ਕਰੋ।",
  "PCT-QL-1903": "{percentageRate}% ਨੂੰ ਭਿੰਨ ਦੇ ਰੂਪ ਵਿੱਚ ਦਰਸਾਓ।",
  "PCT-QL-1904": "ਕਿਸੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਰਾਖਵੇਂ Rs. {baseValue} ਵਿੱਚੋਂ Rs. {value} ਖਰਚ ਕੀਤੇ ਗਏ। ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਖਰਚ ਹੋਏ?",
  "PCT-QL-1909": "ਜੇ ਕਿਸੇ ਚੋਣ ਵਿੱਚ ਪਈਆਂ ਕੁੱਲ ਵੋਟਾਂ ਦਾ {percentageRate}% = {value} ਸੀ, ਤਾਂ ਕੁੱਲ ਪਈਆਂ ਵੋਟਾਂ ਪਤਾ ਕਰੋ।"
};

const localizedExplanations = {
  hi: {
    percentOf: {
      steps: [
        "हमें {baseValue} का {percentageRate}% ज्ञात करना है।",
        "{percentageRate}% का अर्थ {percentageRate}/100 होता है।",
        "इसलिए आवश्यक मान = {baseValue} x {percentageRate}/100 = {answer}।",
        "अब गणना को सरल करें।",
        "अतः उत्तर {answer} है।"
      ]
    },
    directRelation: {
      aliasOf: "percentOf"
    },
    percentToFraction: {
      steps: [
        "{percentageRate}% को भिन्न में बदलने के लिए उसे 100 के ऊपर लिखते हैं।",
        "इसलिए {percentageRate}% = {percentageRate}/100।",
        "अब इस भिन्न को सरल करें।",
        "सरल करने पर {answer} प्राप्त होता है।",
        "अतः प्रतिशत का भिन्न रूप {answer} है।"
      ]
    },
    valueAsPercent: {
      steps: [
        "हमें {value} को {baseValue} के प्रतिशत के रूप में लिखना है।",
        "प्रतिशत = {value} x 100 / {baseValue}।",
        "अब दिए गए मान रखकर गणना करें।",
        "गणना करने पर {answer} प्राप्त होता है।",
        "अतः आवश्यक प्रतिशत {answer} है।"
      ]
    },
    moreToLess: {
      steps: [
        "छोटे मान को 100 मान लेते हैं।",
        "तब बड़ा मान 100 + {percentageRate} होगा।",
        "अब अंतर को बड़े मान के आधार पर प्रतिशत में बदलते हैं।",
        "गणना करने पर {answer} प्राप्त होता है।",
        "अतः B, A से {answer} कम है।"
      ]
    },
    lessToMore: {
      steps: [
        "बड़े मान को 100 मान लेते हैं।",
        "तब छोटा मान 100 - {percentageRate} होगा।",
        "अब अंतर को छोटे मान के आधार पर प्रतिशत में बदलते हैं।",
        "गणना करने पर {answer} प्राप्त होता है।",
        "अतः B, A से {answer} अधिक है।"
      ]
    },
    ratioFromPercentEquality: {
      steps: [
        "A का {rate1}% , B के {rate2}% के बराबर दिया गया है।",
        "अब दोनों पक्षों को अनुपात के रूप में लिखते हैं।",
        "इसलिए A:B = {rate2}:{rate1}।",
        "सरल करने पर {answer} प्राप्त होता है।",
        "अतः आवश्यक अनुपात {answer} है।"
      ]
    },
    reversePercent: {
      steps: [
        "यहाँ {percentageRate}% = {value} दिया गया है।",
        "इसलिए 1% = {value} / {percentageRate} होगा।",
        "अब 100% ज्ञात करने के लिए 100 से गुणा करते हैं।",
        "इसलिए 100% = {value} x 100 / {percentageRate} = {answer}।",
        "अतः मूल मान {answer} है।"
      ]
    }
  },
  pa: {
    percentOf: {
      steps: [
        "ਸਾਨੂੰ {baseValue} ਦਾ {percentageRate}% ਪਤਾ ਕਰਨਾ ਹੈ।",
        "{percentageRate}% ਦਾ ਅਰਥ {percentageRate}/100 ਹੁੰਦਾ ਹੈ।",
        "ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਮੁੱਲ = {baseValue} x {percentageRate}/100 = {answer}।",
        "ਹੁਣ ਗਣਨਾ ਨੂੰ ਸਰਲ ਕਰੋ।",
        "ਅਤੇ ਇਸ ਲਈ ਉੱਤਰ {answer} ਹੈ।"
      ]
    },
    directRelation: {
      aliasOf: "percentOf"
    },
    percentToFraction: {
      steps: [
        "{percentageRate}% ਨੂੰ ਭਿੰਨ ਵਿੱਚ ਬਦਲਣ ਲਈ ਇਸ ਨੂੰ 100 ਦੇ ਉੱਪਰ ਲਿਖਦੇ ਹਾਂ।",
        "ਇਸ ਲਈ {percentageRate}% = {percentageRate}/100।",
        "ਹੁਣ ਇਸ ਭਿੰਨ ਨੂੰ ਸਰਲ ਕਰੋ।",
        "ਸਰਲ ਕਰਨ 'ਤੇ {answer} ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ।",
        "ਅਤੇ ਇਸ ਲਈ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਭਿੰਨ ਰੂਪ {answer} ਹੈ।"
      ]
    },
    valueAsPercent: {
      steps: [
        "ਸਾਨੂੰ {value} ਨੂੰ {baseValue} ਦੇ ਪ੍ਰਤੀਸ਼ਤ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖਣਾ ਹੈ।",
        "ਪ੍ਰਤੀਸ਼ਤ = {value} x 100 / {baseValue}।",
        "ਹੁਣ ਦਿੱਤੇ ਮੁੱਲ ਰੱਖ ਕੇ ਗਣਨਾ ਕਰੋ।",
        "ਗਣਨਾ ਕਰਨ 'ਤੇ {answer} ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ।",
        "ਅਤੇ ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ {answer} ਹੈ।"
      ]
    },
    moreToLess: {
      steps: [
        "ਛੋਟੇ ਮੁੱਲ ਨੂੰ 100 ਮੰਨ ਲੈਂਦੇ ਹਾਂ।",
        "ਤਦ ਵੱਡਾ ਮੁੱਲ 100 + {percentageRate} ਹੋਵੇਗਾ।",
        "ਹੁਣ ਅੰਤਰ ਨੂੰ ਵੱਡੇ ਮੁੱਲ ਦੇ ਆਧਾਰ 'ਤੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲਦੇ ਹਾਂ।",
        "ਗਣਨਾ ਕਰਨ 'ਤੇ {answer} ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ।",
        "ਅਤੇ ਇਸ ਲਈ B, A ਨਾਲੋਂ {answer} ਘੱਟ ਹੈ।"
      ]
    },
    lessToMore: {
      steps: [
        "ਵੱਡੇ ਮੁੱਲ ਨੂੰ 100 ਮੰਨ ਲੈਂਦੇ ਹਾਂ।",
        "ਤਦ ਛੋਟਾ ਮੁੱਲ 100 - {percentageRate} ਹੋਵੇਗਾ।",
        "ਹੁਣ ਅੰਤਰ ਨੂੰ ਛੋਟੇ ਮੁੱਲ ਦੇ ਆਧਾਰ 'ਤੇ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲਦੇ ਹਾਂ।",
        "ਗਣਨਾ ਕਰਨ 'ਤੇ {answer} ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ।",
        "ਅਤੇ ਇਸ ਲਈ B, A ਨਾਲੋਂ {answer} ਵੱਧ ਹੈ।"
      ]
    },
    ratioFromPercentEquality: {
      steps: [
        "A ਦਾ {rate1}% , B ਦੇ {rate2}% ਦੇ ਬਰਾਬਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
        "ਹੁਣ ਦੋਵੇਂ ਪਾਸਿਆਂ ਨੂੰ ਅਨੁਪਾਤ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖਦੇ ਹਾਂ।",
        "ਇਸ ਲਈ A:B = {rate2}:{rate1}।",
        "ਸਰਲ ਕਰਨ 'ਤੇ {answer} ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ।",
        "ਅਤੇ ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ {answer} ਹੈ।"
      ]
    },
    reversePercent: {
      steps: [
        "ਇੱਥੇ {percentageRate}% = {value} ਦਿੱਤਾ ਗਿਆ ਹੈ।",
        "ਇਸ ਲਈ 1% = {value} / {percentageRate} ਹੋਵੇਗਾ।",
        "ਹੁਣ 100% ਪਤਾ ਕਰਨ ਲਈ 100 ਨਾਲ ਗੁਣਾ ਕਰਦੇ ਹਾਂ।",
        "ਇਸ ਲਈ 100% = {value} x 100 / {percentageRate} = {answer}।",
        "ਅਤੇ ਇਸ ਲਈ ਅਸਲ ਮੁੱਲ {answer} ਹੈ।"
      ]
    }
  }
};

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

const questionEn = readJson(QUESTION_EN_PATH);
const questionHi = readJson(QUESTION_HI_PATH);
const questionPa = readJson(QUESTION_PA_PATH);
const explanationHi = readJson(EXPLANATION_HI_PATH);
const explanationPa = readJson(EXPLANATION_PA_PATH);

const englishCp001Families = questionEn["PCT-CP-001"]?.families ?? {};
const englishIds = Object.keys(englishCp001Families);

if (englishIds.length !== 120) {
  throw new Error(`Expected 120 English CP-001 QLs, found ${englishIds.length}.`);
}

if (Object.keys(hiTemplates).length !== englishIds.length) {
  throw new Error(`Hindi template count mismatch: ${Object.keys(hiTemplates).length} !== ${englishIds.length}`);
}

if (Object.keys(paTemplates).length !== englishIds.length) {
  throw new Error(`Punjabi template count mismatch: ${Object.keys(paTemplates).length} !== ${englishIds.length}`);
}

questionHi["PCT-CP-001"] = {
  ...(questionHi["PCT-CP-001"] ?? {}),
  families: Object.fromEntries(
    englishIds.map((qlId) => [
      qlId,
      {
        template: hiTemplates[qlId],
        difficulty: englishCp001Families[qlId].difficulty,
      },
    ]),
  ),
};

questionPa["PCT-CP-001"] = {
  ...(questionPa["PCT-CP-001"] ?? {}),
  families: Object.fromEntries(
    englishIds.map((qlId) => [
      qlId,
      {
        template: paTemplates[qlId],
        difficulty: englishCp001Families[qlId].difficulty,
      },
    ]),
  ),
};

explanationHi["PCT-CP-001"] = {
  ...(explanationHi["PCT-CP-001"] ?? {}),
  explanationId: "PCT-ES-001",
  taskExplanations: localizedExplanations.hi,
};

explanationPa["PCT-CP-001"] = {
  ...(explanationPa["PCT-CP-001"] ?? {}),
  explanationId: "PCT-ES-001",
  taskExplanations: localizedExplanations.pa,
};

writeJson(QUESTION_HI_PATH, questionHi);
writeJson(QUESTION_PA_PATH, questionPa);
writeJson(EXPLANATION_HI_PATH, explanationHi);
writeJson(EXPLANATION_PA_PATH, explanationPa);

console.log("Localized PCT-001 CP-001 question-language and explanation files updated.");
