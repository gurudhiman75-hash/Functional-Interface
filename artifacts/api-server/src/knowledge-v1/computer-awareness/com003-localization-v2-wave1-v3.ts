import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1_V2,
  COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2,
  type Com003LocalizedQuestionV2,
} from "./com003-localization-v2-wave1-v2";

const QL_ORDER = [
  "COM-003-QL-001",
  "COM-003-QL-002",
  "COM-003-QL-003",
  "COM-003-QL-004",
] as const;

const HINDI_STEMS: Record<string, readonly string[]> = {
  "COM-003-QL-001": [
    "स्प्रेडशीट में डेटा व्यवस्थित करने और गणनाएँ करने के लिए मुख्य रूप से किस Microsoft Office एप्लिकेशन का उपयोग किया जाता है?",
    "Microsoft PowerPoint किस प्रकार के सॉफ्टवेयर की श्रेणी में आता है?",
    "Microsoft Word किस प्रकार के सॉफ्टवेयर की श्रेणी में आता है?",
    "दस्तावेज़ बनाने, संपादित करने और फ़ॉर्मैट करने के लिए किस Microsoft Office एप्लिकेशन का उपयोग किया जाता है?",
    "Microsoft Excel किस प्रकार का सॉफ्टवेयर है?",
    "स्लाइड-आधारित प्रेज़ेंटेशन बनाने के लिए किस Microsoft Office एप्लिकेशन का उपयोग किया जाता है?",
    "Microsoft Excel को किस सॉफ्टवेयर श्रेणी में रखा जाता है?",
    "स्लाइड-आधारित प्रेज़ेंटेशन तैयार करने के लिए कौन-सा Microsoft Office एप्लिकेशन उपयोग किया जाता है?",
    "दस्तावेज़ बनाने, संपादित करने और फ़ॉर्मैट करने के लिए मुख्य रूप से कौन-सा Office एप्लिकेशन प्रयोग होता है?",
    "Microsoft Excel निम्न में से किस प्रकार के सॉफ्टवेयर में आता है?",
    "स्लाइड-आधारित प्रेज़ेंटेशन बनाने के लिए मुख्य रूप से कौन-सा Office एप्लिकेशन प्रयोग किया जाता है?",
    "Microsoft Office सूट में Excel किस प्रकार का सॉफ्टवेयर है?",
  ],
  "COM-003-QL-002": [
    "आधुनिक Word दस्तावेज़ के लिए कौन-सा फ़ाइल एक्सटेंशन उपयोग किया जाता है?",
    "PowerPoint 97-2003 प्रेज़ेंटेशन का फ़ाइल एक्सटेंशन क्या है?",
    ".pptx एक्सटेंशन किस प्रकार की Office फ़ाइल की पहचान करता है?",
    ".ppsx एक्सटेंशन किस प्रकार की Office फ़ाइल के लिए उपयोग होता है?",
    "Excel 97-2003 वर्कबुक के लिए कौन-सा फ़ाइल एक्सटेंशन उपयोग किया जाता है?",
    "Word 97-2003 दस्तावेज़ किस फ़ाइल एक्सटेंशन का उपयोग करता है?",
    "Word 97-2003 दस्तावेज़ का सही फ़ाइल एक्सटेंशन कौन-सा है?",
    "Microsoft Office में Word 97-2003 दस्तावेज़ के लिए कौन-सा फ़ाइल एक्सटेंशन होता है?",
    ".pptx एक्सटेंशन वाली फ़ाइल किस प्रकार की Office फ़ाइल होती है?",
    ".xlsx एक्सटेंशन किस प्रकार की Office फ़ाइल के लिए उपयोग होता है?",
    "Slide Show के रूप में खुलने वाली PowerPoint Show फ़ाइल के लिए कौन-सा एक्सटेंशन उपयोग किया जाता है?",
    "Microsoft Office में .xlsx एक्सटेंशन किस प्रकार की फ़ाइल की पहचान करता है?",
  ],
  "COM-003-QL-003": [
    "Copy कमांड का मुख्य कार्य क्या है?",
    "सबसे हाल की समर्थित संपादन क्रिया को वापस करने के लिए कौन-सा Office कमांड उपयोग किया जाता है?",
    "Microsoft Office (Windows desktop) में Clipboard की सामग्री पेस्ट करने के लिए कौन-सा शॉर्टकट प्रयोग किया जाता है?",
    "वर्तमान फ़ाइल में निर्धारित टेक्स्ट या सामग्री खोजने के लिए कौन-सा कमांड उपयोग किया जाता है?",
    "Clipboard की सामग्री को वर्तमान स्थान पर डालने के लिए कौन-सा कमांड उपयोग किया जाता है?",
    "प्रिंटिंग विकल्प खोलने के लिए कौन-सा Office कमांड उपयोग किया जाता है?",
    "Save कमांड का कार्य क्या है?",
    "Microsoft Office (Windows desktop) में Ctrl+P का उपयोग किस कार्य के लिए किया जाता है?",
    "Microsoft Office (Windows desktop) में Ctrl+S का उपयोग किस कार्य के लिए किया जाता है?",
    "Cut कमांड का मुख्य कार्य क्या है?",
    "Microsoft Office (Windows desktop) में चयनित सामग्री कॉपी करने के लिए कौन-सा शॉर्टकट प्रयोग किया जाता है?",
    "Microsoft Office (Windows desktop) में वर्तमान दस्तावेज़ में टेक्स्ट या सामग्री खोजने के लिए कौन-सा शॉर्टकट प्रयोग किया जाता है?",
  ],
  "COM-003-QL-004": [
    "Microsoft Word में बनाए गए वर्ड-प्रोसेसिंग दस्तावेज़ को क्या कहा जाता है?",
    "Word में कौन-सा कमांड चयनित टेक्स्ट को हटाकर Clipboard पर रखता है, ताकि उसे दूसरी जगह ले जाया या पेस्ट किया जा सके?",
    "Word में कौन-सा कमांड Clipboard की सामग्री को insertion point पर डालता है?",
    "पैराग्राफ टेक्स्ट को बाएँ और दाएँ margins के बीच केंद्र में रखने के लिए कौन-सा alignment उपयोग किया जाता है?",
    "पैराग्राफ टेक्स्ट को बाएँ margin के साथ align करने के लिए कौन-सा alignment उपयोग किया जाता है?",
    "पैराग्राफ टेक्स्ट को बाएँ और दाएँ दोनों margins के साथ समान रूप से align करने के लिए कौन-सा alignment उपयोग किया जाता है?",
    "पैराग्राफ टेक्स्ट को दाएँ margin के साथ align करने के लिए कौन-सा alignment उपयोग किया जाता है?",
    "Word में कौन-सा कमांड चयनित टेक्स्ट की प्रतिलिपि बनाता है और मूल टेक्स्ट को नहीं हटाता?",
    "Word में चयनित टेक्स्ट को bold दिखाने के लिए कौन-सा फ़ॉर्मैटिंग विकल्प उपयोग किया जाता है?",
    "मूल टेक्स्ट को हटाए बिना चयनित टेक्स्ट की प्रतिलिपि बनाने के लिए Word में कौन-सा कमांड उपयोग किया जाता है?",
    "Clipboard की सामग्री को insertion point पर डालने वाला Word कमांड कौन-सा है?",
    "चयनित टेक्स्ट को Clipboard पर रखकर मूल स्थान से हटाने के लिए Word में कौन-सा कमांड उपयोग किया जाता है?",
  ],
};

const PUNJABI_STEMS: Record<string, readonly string[]> = {
  "COM-003-QL-001": [
    "ਸਪ੍ਰੈੱਡਸ਼ੀਟ ਵਿੱਚ ਡਾਟਾ ਵਿਵਸਥਿਤ ਕਰਨ ਅਤੇ ਗਣਨਾਵਾਂ ਕਰਨ ਲਈ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ Microsoft Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
    "Microsoft PowerPoint ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?",
    "Microsoft Word ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?",
    "ਦਸਤਾਵੇਜ਼ ਬਣਾਉਣ, ਸੰਪਾਦਿਤ ਕਰਨ ਅਤੇ ਫਾਰਮੈਟ ਕਰਨ ਲਈ ਕਿਹੜੀ Microsoft Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
    "Microsoft Excel ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?",
    "ਸਲਾਈਡ-ਅਧਾਰਿਤ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਬਣਾਉਣ ਲਈ ਕਿਹੜੀ Microsoft Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
    "Microsoft Excel ਨੂੰ ਕਿਹੜੀ ਸਾਫਟਵੇਅਰ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ?",
    "ਸਲਾਈਡ-ਅਧਾਰਿਤ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਤਿਆਰ ਕਰਨ ਲਈ ਕਿਹੜੀ Microsoft Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
    "ਦਸਤਾਵੇਜ਼ ਬਣਾਉਣ, ਸੰਪਾਦਿਤ ਕਰਨ ਅਤੇ ਫਾਰਮੈਟ ਕਰਨ ਲਈ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
    "Microsoft Excel ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਕਿਸਮ ਦੇ ਸਾਫਟਵੇਅਰ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?",
    "ਸਲਾਈਡ-ਅਧਾਰਿਤ ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਬਣਾਉਣ ਲਈ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ Office ਐਪਲੀਕੇਸ਼ਨ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
    "Microsoft Office ਸੂਟ ਵਿੱਚ Excel ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?",
  ],
  "COM-003-QL-002": [
    "ਆਧੁਨਿਕ Word ਦਸਤਾਵੇਜ਼ ਲਈ ਕਿਹੜਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "PowerPoint 97-2003 ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਦਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਕੀ ਹੈ?",
    ".pptx ਐਕਸਟੈਂਸ਼ਨ ਕਿਹੜੀ ਕਿਸਮ ਦੀ Office ਫਾਈਲ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ?",
    ".ppsx ਐਕਸਟੈਂਸ਼ਨ ਕਿਹੜੀ ਕਿਸਮ ਦੀ Office ਫਾਈਲ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Excel 97-2003 ਵਰਕਬੁੱਕ ਲਈ ਕਿਹੜਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Word 97-2003 ਦਸਤਾਵੇਜ਼ ਕਿਹੜਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਵਰਤਦਾ ਹੈ?",
    "Word 97-2003 ਦਸਤਾਵੇਜ਼ ਦਾ ਸਹੀ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਕਿਹੜਾ ਹੈ?",
    "Microsoft Office ਵਿੱਚ Word 97-2003 ਦਸਤਾਵੇਜ਼ ਲਈ ਕਿਹੜਾ ਫਾਈਲ ਐਕਸਟੈਂਸ਼ਨ ਹੁੰਦਾ ਹੈ?",
    ".pptx ਐਕਸਟੈਂਸ਼ਨ ਵਾਲੀ ਫਾਈਲ ਕਿਹੜੀ ਕਿਸਮ ਦੀ Office ਫਾਈਲ ਹੁੰਦੀ ਹੈ?",
    ".xlsx ਐਕਸਟੈਂਸ਼ਨ ਕਿਹੜੀ ਕਿਸਮ ਦੀ Office ਫਾਈਲ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Slide Show ਵਜੋਂ ਖੁੱਲ੍ਹਣ ਵਾਲੀ PowerPoint Show ਫਾਈਲ ਲਈ ਕਿਹੜਾ ਐਕਸਟੈਂਸ਼ਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Microsoft Office ਵਿੱਚ .xlsx ਐਕਸਟੈਂਸ਼ਨ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਫਾਈਲ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ?",
  ],
  "COM-003-QL-003": [
    "Copy ਕਮਾਂਡ ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?",
    "ਸਭ ਤੋਂ ਹਾਲ ਦੀ ਸਮਰਥਿਤ ਸੰਪਾਦਨ ਕਿਰਿਆ ਨੂੰ ਵਾਪਸ ਕਰਨ ਲਈ ਕਿਹੜਾ Office ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Microsoft Office (Windows desktop) ਵਿੱਚ Clipboard ਦੀ ਸਮੱਗਰੀ ਪੇਸਟ ਕਰਨ ਲਈ ਕਿਹੜਾ ਸ਼ਾਰਟਕਟ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "ਮੌਜੂਦਾ ਫਾਈਲ ਵਿੱਚ ਨਿਰਧਾਰਤ ਟੈਕਸਟ ਜਾਂ ਸਮੱਗਰੀ ਖੋਜਣ ਲਈ ਕਿਹੜਾ ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ ਮੌਜੂਦਾ ਥਾਂ 'ਤੇ ਪਾਉਣ ਲਈ ਕਿਹੜਾ ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "ਪ੍ਰਿੰਟਿੰਗ ਵਿਕਲਪ ਖੋਲ੍ਹਣ ਲਈ ਕਿਹੜਾ Office ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Save ਕਮਾਂਡ ਦਾ ਕੰਮ ਕੀ ਹੈ?",
    "Microsoft Office (Windows desktop) ਵਿੱਚ Ctrl+P ਕਿਹੜੇ ਕੰਮ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Microsoft Office (Windows desktop) ਵਿੱਚ Ctrl+S ਕਿਹੜੇ ਕੰਮ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Cut ਕਮਾਂਡ ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?",
    "Microsoft Office (Windows desktop) ਵਿੱਚ ਚੁਣੀ ਸਮੱਗਰੀ ਕਾਪੀ ਕਰਨ ਲਈ ਕਿਹੜਾ ਸ਼ਾਰਟਕਟ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Microsoft Office (Windows desktop) ਵਿੱਚ ਮੌਜੂਦਾ ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਟੈਕਸਟ ਜਾਂ ਸਮੱਗਰੀ ਖੋਜਣ ਲਈ ਕਿਹੜਾ ਸ਼ਾਰਟਕਟ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
  ],
  "COM-003-QL-004": [
    "Microsoft Word ਵਿੱਚ ਬਣੇ ਵਰਡ-ਪ੍ਰੋਸੈਸਿੰਗ ਦਸਤਾਵੇਜ਼ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
    "Word ਵਿੱਚ ਕਿਹੜਾ ਕਮਾਂਡ ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ ਹਟਾ ਕੇ Clipboard 'ਤੇ ਰੱਖਦਾ ਹੈ, ਤਾਂ ਜੋ ਉਸਨੂੰ ਕਿਸੇ ਹੋਰ ਥਾਂ ਲਿਜਾਇਆ ਜਾਂ ਪੇਸਟ ਕੀਤਾ ਜਾ ਸਕੇ?",
    "Word ਵਿੱਚ ਕਿਹੜਾ ਕਮਾਂਡ Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ insertion point 'ਤੇ ਪਾਂਦਾ ਹੈ?",
    "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ ਅਤੇ ਸੱਜੇ margins ਦੇ ਵਿਚਕਾਰ ਕੇਂਦਰ ਵਿੱਚ ਰੱਖਣ ਲਈ ਕਿਹੜਾ alignment ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ margin ਨਾਲ align ਕਰਨ ਲਈ ਕਿਹੜਾ alignment ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਖੱਬੇ ਅਤੇ ਸੱਜੇ ਦੋਵੇਂ margins ਨਾਲ ਸਮਾਨ ਤੌਰ 'ਤੇ align ਕਰਨ ਲਈ ਕਿਹੜਾ alignment ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "ਪੈਰਾਗ੍ਰਾਫ ਟੈਕਸਟ ਨੂੰ ਸੱਜੇ margin ਨਾਲ align ਕਰਨ ਲਈ ਕਿਹੜਾ alignment ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Word ਵਿੱਚ ਕਿਹੜਾ ਕਮਾਂਡ ਚੁਣੇ ਟੈਕਸਟ ਦੀ ਨਕਲ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਮੂਲ ਟੈਕਸਟ ਨੂੰ ਨਹੀਂ ਹਟਾਉਂਦਾ?",
    "Word ਵਿੱਚ ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ bold ਦਿਖਾਉਣ ਲਈ ਕਿਹੜਾ ਫਾਰਮੈਟਿੰਗ ਵਿਕਲਪ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "ਮੂਲ ਟੈਕਸਟ ਨੂੰ ਹਟਾਏ ਬਿਨਾਂ ਚੁਣੇ ਟੈਕਸਟ ਦੀ ਨਕਲ ਬਣਾਉਣ ਲਈ Word ਵਿੱਚ ਕਿਹੜਾ ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "Clipboard ਦੀ ਸਮੱਗਰੀ ਨੂੰ insertion point 'ਤੇ ਪਾਉਣ ਵਾਲਾ Word ਕਮਾਂਡ ਕਿਹੜਾ ਹੈ?",
    "ਚੁਣੇ ਟੈਕਸਟ ਨੂੰ Clipboard 'ਤੇ ਰੱਖ ਕੇ ਮੂਲ ਥਾਂ ਤੋਂ ਹਟਾਉਣ ਲਈ Word ਵਿੱਚ ਕਿਹੜਾ ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
  ],
};

function polish(items: readonly Com003LocalizedQuestionV2[], stems: Record<string, readonly string[]>, version: string) {
  const ordinalByQl = new Map<string, number>();
  return items.map((item) => {
    const ordinal = ordinalByQl.get(item.qlId) ?? 0;
    ordinalByQl.set(item.qlId, ordinal + 1);
    const qlStems = stems[item.qlId];
    const stem = qlStems?.[ordinal];
    if (!stem) throw new Error(`COM-003 Wave 1 Candidate 3 missing ${item.language} stem for ${item.qlId}/${ordinal + 1}`);
    return {
      ...item,
      localizationId: item.localizationId.replace("COM003-LOC-V2-W1R2-", `COM003-LOC-V2-W1${version}-`),
      stem,
    };
  });
}

export const COM003_HINDI_LOCALIZATION_V2_WAVE1_V3 = Object.freeze(
  polish(COM003_HINDI_LOCALIZATION_V2_WAVE1_V2, HINDI_STEMS, "R3"),
);
export const COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3 = Object.freeze(
  polish(COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2, PUNJABI_STEMS, "R3"),
);

for (const qlId of QL_ORDER) {
  if (HINDI_STEMS[qlId]?.length !== 12 || PUNJABI_STEMS[qlId]?.length !== 12) {
    throw new Error(`COM-003 Wave 1 Candidate 3 must contain 12 Hindi and 12 Punjabi stems for ${qlId}`);
  }
}

export const COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V3 = Object.freeze({
  ...COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2,
  authorityId: "COM-003-LOCALIZATION-V2-WAVE1-CANDIDATE-3" as const,
  supersedesCandidateAuthorityId: COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.authorityId,
  editorialBasis: "RENDERED_TRI_LANGUAGE_REVIEW_OF_CANDIDATE_1_PLUS_CANDIDATE_2_DIRECTION_FIXES" as const,
  remediation: Object.freeze({
    questionDirectionRepairsRetained: true,
    hindiInfinitivePostpositionGrammarRepaired: true,
    punjabiInfinitivePostpositionGrammarRepaired: true,
    ql002PpsxFileTypeWordingRepaired: true,
    ql003EnglishAnswerLeakIntoStemRemoved: true,
    ql004EffectPlusWalaConstructionRemoved: true,
    ql004AlignmentWordingNaturalized: true,
    changedFields: Object.freeze(["localizationId", "stem"] as const),
    optionsAnswersExplanationsProvenanceUnchanged: true,
  }),
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_V2_WAVE1_V3.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3.length,
  localizedQuestionCount: COM003_HINDI_LOCALIZATION_V2_WAVE1_V3.length + COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V3.length,
  nextGate: "COM003_LOCALIZATION_V2_WAVE1_V3_HUMAN_EDITORIAL_PARITY_REVIEW" as const,
});
