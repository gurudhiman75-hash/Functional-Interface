import { ECO_CP001_REVIEW_V2 } from "../basic-economic-concepts/eco-cp001-review-generator-v2";
import { ECO_CP002_REVIEW_V2 } from "../economic-systems-sectors/eco-cp002-review-generator-v2";
import {
  ECO_LOCALIZATION_V1,
  type EcoLocaleV1,
  type EcoLocalizedQuestionV1,
} from "./eco-localization-types-v1";

type NativeLocale = Exclude<EcoLocaleV1, "en">;
type EnglishQuestion = (typeof ECO_CP001_REVIEW_V2)[number] | (typeof ECO_CP002_REVIEW_V2)[number];

type LocalePair = { hi: string; pa: string };
const lp = (hi: string, pa: string): LocalePair => ({ hi, pa });

const CP1_ATOM: Readonly<Record<string, LocalePair>> = Object.freeze({
  "Scarcity": lp("दुर्लभता", "ਦੁਲਭਤਾ"),
  "Opportunity cost": lp("अवसर लागत", "ਅਵਸਰ ਲਾਗਤ"),
  "Utility": lp("उपयोगिता", "ਉਪਯੋਗਤਾ"),
  "Production": lp("उत्पादन", "ਉਤਪਾਦਨ"),
  "Consumption": lp("उपभोग", "ਉਪਭੋਗ"),
  "Distribution": lp("वितरण", "ਵੰਡ"),
  "Demand": lp("मांग", "ਮੰਗ"),
  "Supply": lp("आपूर्ति", "ਪੂਰਤੀ"),
  "Market": lp("बाज़ार", "ਬਾਜ਼ਾਰ"),
  "Microeconomics": lp("सूक्ष्म अर्थशास्त्र", "ਸੂਖਮ ਅਰਥਸ਼ਾਸਤਰ"),
  "Macroeconomics": lp("समष्टि अर्थशास्त्र", "ਸਮੂਹਕ ਅਰਥਸ਼ਾਸਤਰ"),
  "Goods": lp("वस्तुएँ", "ਵਸਤੂਆਂ"),
  "Services": lp("सेवाएँ", "ਸੇਵਾਵਾਂ"),
  "limited resources require choices": lp("सीमित संसाधनों के कारण चुनाव की आवश्यकता", "ਸੀਮਿਤ ਸਰੋਤਾਂ ਕਰਕੇ ਚੋਣ ਦੀ ਲੋੜ"),
  "next best alternative forgone": lp("छोड़ा गया अगला सर्वोत्तम विकल्प", "ਛੱਡਿਆ ਗਿਆ ਅਗਲਾ ਸਭ ਤੋਂ ਵਧੀਆ ਵਿਕਲਪ"),
  "want-satisfying capacity": lp("इच्छा-संतुष्टि की क्षमता", "ਲੋੜ ਜਾਂ ਇੱਛਾ ਪੂਰੀ ਕਰਨ ਦੀ ਸਮਰੱਥਾ"),
  "creation of goods and services": lp("वस्तुओं और सेवाओं का सृजन", "ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਦੀ ਰਚਨਾ"),
  "use of goods and services to satisfy wants": lp("इच्छाओं की पूर्ति के लिए वस्तुओं और सेवाओं का उपयोग", "ਲੋੜਾਂ ਪੂਰੀਆਂ ਕਰਨ ਲਈ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਦੀ ਵਰਤੋਂ"),
  "allocation of the results of production": lp("उत्पादन के परिणामों का बँटवारा", "ਉਤਪਾਦਨ ਦੇ ਨਤੀਜਿਆਂ ਦੀ ਵੰਡ"),
  "willingness and ability to buy": lp("खरीदने की इच्छा और क्षमता", "ਖਰੀਦਣ ਦੀ ਇੱਛਾ ਅਤੇ ਸਮਰੱਥਾ"),
  "willingness and ability to offer for sale": lp("बिक्री के लिए पेश करने की इच्छा और क्षमता", "ਵਿਕਰੀ ਲਈ ਪੇਸ਼ ਕਰਨ ਦੀ ਇੱਛਾ ਅਤੇ ਸਮਰੱਥਾ"),
  "interaction of buyers and sellers": lp("खरीदारों और विक्रेताओं की परस्पर क्रिया", "ਖਰੀਦਦਾਰਾਂ ਅਤੇ ਵਿਕਰੇਤਿਆਂ ਦੀ ਆਪਸੀ ਕਿਰਿਆ"),
  "study of individual consumers, firms and markets": lp("व्यक्तिगत उपभोक्ताओं, फर्मों और बाज़ारों का अध्ययन", "ਵਿਅਕਤੀਗਤ ਖਪਤਕਾਰਾਂ, ਫਰਮਾਂ ਅਤੇ ਬਾਜ਼ਾਰਾਂ ਦਾ ਅਧਿਐਨ"),
  "study of the economy as a whole": lp("पूरी अर्थव्यवस्था का अध्ययन", "ਪੂਰੀ ਅਰਥਵਿਵਸਥਾ ਦਾ ਅਧਿਐਨ"),
  "tangible products": lp("मूर्त उत्पाद", "ਮੂਰਤ ਉਤਪਾਦ"),
  "intangible activities or benefits": lp("अमूर्त गतिविधियाँ या लाभ", "ਅਮੂਰਤ ਗਤੀਵਿਧੀਆਂ ਜਾਂ ਲਾਭ"),
  "Land": lp("भूमि", "ਜ਼ਮੀਨ"),
  "Labour": lp("श्रम", "ਕਿਰਤ"),
  "Capital": lp("पूंजी", "ਪੂੰਜੀ"),
  "Entrepreneurship": lp("उद्यमिता", "ਉਦਯਮਿਤਾ"),
  "Rent": lp("किराया", "ਕਿਰਾਇਆ"),
  "Wages": lp("मजदूरी", "ਮਜ਼ਦੂਰੀ"),
  "Interest": lp("ब्याज", "ਵਿਆਜ"),
  "Profit": lp("लाभ", "ਲਾਭ"),
  "Exchange": lp("विनिमय", "ਵਟਾਂਦਰਾ"),
  "Economic history": lp("आर्थिक इतिहास", "ਆਰਥਿਕ ਇਤਿਹਾਸ"),
  "Public administration": lp("लोक प्रशासन", "ਲੋਕ ਪ੍ਰਸ਼ਾਸਨ"),
  "I only": lp("केवल I", "ਸਿਰਫ਼ I"),
  "II only": lp("केवल II", "ਸਿਰਫ਼ II"),
  "Both I and II": lp("I और II दोनों", "I ਅਤੇ II ਦੋਵੇਂ"),
  "Neither I nor II": lp("न तो I, न II", "ਨਾ I, ਨਾ II"),
});

const CP1_EXAMPLES: Readonly<Record<string, LocalePair>> = Object.freeze({
  "farmland": lp("खेती की भूमि", "ਖੇਤੀ ਵਾਲੀ ਜ਼ਮੀਨ"),
  "a teacher's work": lp("एक शिक्षक का काम", "ਇੱਕ ਅਧਿਆਪਕ ਦਾ ਕੰਮ"),
  "a factory machine": lp("कारखाने की मशीन", "ਫੈਕਟਰੀ ਦੀ ਮਸ਼ੀਨ"),
  "a person who organises a new factory and bears its business risk": lp("वह व्यक्ति जो नया कारखाना संगठित करता है और उसका व्यावसायिक जोखिम उठाता है", "ਉਹ ਵਿਅਕਤੀ ਜੋ ਨਵੀਂ ਫੈਕਟਰੀ ਨੂੰ ਸੰਗਠਿਤ ਕਰਦਾ ਹੈ ਅਤੇ ਉਸਦਾ ਵਪਾਰਕ ਜੋਖਮ ਝੱਲਦਾ ਹੈ"),
});

const CP1_SCENARIO: Readonly<Record<string, LocalePair>> = Object.freeze({
  "A farmer can grow wheat or mustard on the same field. He chooses wheat. What is the opportunity cost?": lp("एक किसान उसी खेत में गेहूँ या सरसों उगा सकता है। वह गेहूँ चुनता है। अवसर लागत क्या है?", "ਇੱਕ ਕਿਸਾਨ ਉਸੇ ਖੇਤ ਵਿੱਚ ਕਣਕ ਜਾਂ ਸਰੋਂ ਉਗਾ ਸਕਦਾ ਹੈ। ਉਹ ਕਣਕ ਚੁਣਦਾ ਹੈ। ਅਵਸਰ ਲਾਗਤ ਕੀ ਹੈ?"),
  "A student can study Economics or History tonight and chooses Economics. What is the opportunity cost?": lp("एक छात्र आज रात अर्थशास्त्र या इतिहास पढ़ सकता है और अर्थशास्त्र चुनता है। अवसर लागत क्या है?", "ਇੱਕ ਵਿਦਿਆਰਥੀ ਅੱਜ ਰਾਤ ਅਰਥਸ਼ਾਸਤਰ ਜਾਂ ਇਤਿਹਾਸ ਪੜ੍ਹ ਸਕਦਾ ਹੈ ਅਤੇ ਅਰਥਸ਼ਾਸਤਰ ਚੁਣਦਾ ਹੈ। ਅਵਸਰ ਲਾਗਤ ਕੀ ਹੈ?"),
  "A factory uses a machine to make tables instead of chairs. What is the opportunity cost?": lp("एक कारखाना मशीन से कुर्सियों के बजाय मेज़ बनाता है। अवसर लागत क्या है?", "ਇੱਕ ਫੈਕਟਰੀ ਮਸ਼ੀਨ ਨਾਲ ਕੁਰਸੀਆਂ ਦੀ ਥਾਂ ਮੇਜ਼ ਬਣਾਉਂਦੀ ਹੈ। ਅਵਸਰ ਲਾਗਤ ਕੀ ਹੈ?"),
  "A local body funds a water project instead of a road project. What is the opportunity cost?": lp("एक स्थानीय निकाय सड़क परियोजना के बजाय जल परियोजना को धन देता है। अवसर लागत क्या है?", "ਇੱਕ ਸਥਾਨਕ ਸੰਸਥਾ ਸੜਕ ਪ੍ਰੋਜੈਕਟ ਦੀ ਥਾਂ ਪਾਣੀ ਪ੍ਰੋਜੈਕਟ ਨੂੰ ਫੰਡ ਦਿੰਦੀ ਹੈ। ਅਵਸਰ ਲਾਗਤ ਕੀ ਹੈ?"),
  "A town has limited water but many uses for it. Which economic problem does this show?": lp("एक कस्बे में पानी सीमित है, लेकिन उसके उपयोग अनेक हैं। यह कौन-सी आर्थिक समस्या दर्शाता है?", "ਇੱਕ ਕਸਬੇ ਵਿੱਚ ਪਾਣੀ ਸੀਮਿਤ ਹੈ ਪਰ ਇਸਦੇ ਵਰਤੋਂ ਦੇ ਢੰਗ ਕਈ ਹਨ। ਇਹ ਕਿਹੜੀ ਆਰਥਿਕ ਸਮੱਸਿਆ ਦਰਸਾਉਂਦਾ ਹੈ?"),
  "A family has limited income but many wants. Which economic problem does this show?": lp("एक परिवार की आय सीमित है, लेकिन इच्छाएँ अनेक हैं। यह कौन-सी आर्थिक समस्या दर्शाता है?", "ਇੱਕ ਪਰਿਵਾਰ ਦੀ ਆਮਦਨ ਸੀਮਿਤ ਹੈ ਪਰ ਲੋੜਾਂ ਕਈ ਹਨ। ਇਹ ਕਿਹੜੀ ਆਰਥਿਕ ਸਮੱਸਿਆ ਦਰਸਾਉਂਦਾ ਹੈ?"),
  "A government cannot fund every proposed project. Which economic problem does this show?": lp("सरकार हर प्रस्तावित परियोजना को धन नहीं दे सकती। यह कौन-सी आर्थिक समस्या दर्शाता है?", "ਸਰਕਾਰ ਹਰ ਪ੍ਰਸਤਾਵਿਤ ਪ੍ਰੋਜੈਕਟ ਨੂੰ ਫੰਡ ਨਹੀਂ ਦੇ ਸਕਦੀ। ਇਹ ਕਿਹੜੀ ਆਰਥਿਕ ਸਮੱਸਿਆ ਦਰਸਾਉਂਦਾ ਹੈ?"),
  "A factory has limited labour and machines but can make several products. Which economic problem does this show?": lp("एक कारखाने के पास श्रम और मशीनें सीमित हैं, लेकिन वह कई उत्पाद बना सकता है। यह कौन-सी आर्थिक समस्या दर्शाता है?", "ਇੱਕ ਫੈਕਟਰੀ ਕੋਲ ਕਿਰਤ ਅਤੇ ਮਸ਼ੀਨਾਂ ਸੀਮਿਤ ਹਨ ਪਰ ਉਹ ਕਈ ਉਤਪਾਦ ਬਣਾ ਸਕਦੀ ਹੈ। ਇਹ ਕਿਹੜੀ ਆਰਥਿਕ ਸਮੱਸਿਆ ਦਰਸਾਉਂਦਾ ਹੈ?"),
  "A bakery converts flour into bread for sale. Which economic activity does this describe?": lp("एक बेकरी आटे को बिक्री के लिए ब्रेड में बदलती है। यह कौन-सी आर्थिक गतिविधि है?", "ਇੱਕ ਬੇਕਰੀ ਆਟੇ ਨੂੰ ਵਿਕਰੀ ਲਈ ਰੋਟੀ ਵਿੱਚ ਬਦਲਦੀ ਹੈ। ਇਹ ਕਿਹੜੀ ਆਰਥਿਕ ਗਤੀਵਿਧੀ ਹੈ?"),
  "A passenger uses a bus service to travel to work. Which economic activity does this describe?": lp("एक यात्री काम पर जाने के लिए बस सेवा का उपयोग करता है। यह कौन-सी आर्थिक गतिविधि है?", "ਇੱਕ ਯਾਤਰੀ ਕੰਮ ਤੇ ਜਾਣ ਲਈ ਬੱਸ ਸੇਵਾ ਵਰਤਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਆਰਥਿਕ ਗਤੀਵਿਧੀ ਹੈ?"),
  "Income generated by production is shared among the factors that helped produce the output. Which economic activity does this describe?": lp("उत्पादन से प्राप्त आय उन कारकों में बाँटी जाती है जिन्होंने उत्पादन में योगदान दिया। यह कौन-सी आर्थिक गतिविधि है?", "ਉਤਪਾਦਨ ਤੋਂ ਮਿਲੀ ਆਮਦਨ ਉਹਨਾਂ ਕਾਰਕਾਂ ਵਿੱਚ ਵੰਡੀ ਜਾਂਦੀ ਹੈ ਜਿਨ੍ਹਾਂ ਨੇ ਉਤਪਾਦਨ ਵਿੱਚ ਯੋਗਦਾਨ ਦਿੱਤਾ। ਇਹ ਕਿਹੜੀ ਆਰਥਿਕ ਗਤੀਵਿਧੀ ਹੈ?"),
  "A study examines how a rise in the price of tea affects the quantity of tea bought by consumers. Which branch of economics studies this?": lp("एक अध्ययन देखता है कि चाय की कीमत बढ़ने पर उपभोक्ताओं द्वारा खरीदी गई चाय की मात्रा कैसे बदलती है। इसे अर्थशास्त्र की कौन-सी शाखा पढ़ती है?", "ਇੱਕ ਅਧਿਐਨ ਵੇਖਦਾ ਹੈ ਕਿ ਚਾਹ ਦੀ ਕੀਮਤ ਵਧਣ ਨਾਲ ਖਪਤਕਾਰਾਂ ਵੱਲੋਂ ਖਰੀਦੀ ਚਾਹ ਦੀ ਮਾਤਰਾ ਕਿਵੇਂ ਬਦਲਦੀ ਹੈ। ਇਹ ਅਰਥਸ਼ਾਸਤਰ ਦੀ ਕਿਹੜੀ ਸ਼ਾਖਾ ਦਾ ਵਿਸ਼ਾ ਹੈ?"),
  "A study examines how one firm's production decision changes when its costs rise. Which branch of economics studies this?": lp("एक अध्ययन देखता है कि लागत बढ़ने पर किसी एक फर्म का उत्पादन निर्णय कैसे बदलता है। इसे अर्थशास्त्र की कौन-सी शाखा पढ़ती है?", "ਇੱਕ ਅਧਿਐਨ ਵੇਖਦਾ ਹੈ ਕਿ ਲਾਗਤ ਵਧਣ ਤੇ ਕਿਸੇ ਇੱਕ ਫਰਮ ਦਾ ਉਤਪਾਦਨ ਫੈਸਲਾ ਕਿਵੇਂ ਬਦਲਦਾ ਹੈ। ਇਹ ਅਰਥਸ਼ਾਸਤਰ ਦੀ ਕਿਹੜੀ ਸ਼ਾਖਾ ਦਾ ਵਿਸ਼ਾ ਹੈ?"),
  "A study examines the level of employment in the economy as a whole. Which branch of economics studies this?": lp("एक अध्ययन पूरी अर्थव्यवस्था में रोजगार के स्तर को देखता है। इसे अर्थशास्त्र की कौन-सी शाखा पढ़ती है?", "ਇੱਕ ਅਧਿਐਨ ਪੂਰੀ ਅਰਥਵਿਵਸਥਾ ਵਿੱਚ ਰੋਜ਼ਗਾਰ ਦੇ ਪੱਧਰ ਨੂੰ ਵੇਖਦਾ ਹੈ। ਇਹ ਅਰਥਸ਼ਾਸਤਰ ਦੀ ਕਿਹੜੀ ਸ਼ਾਖਾ ਦਾ ਵਿਸ਼ਾ ਹੈ?"),
});

const CP1_LONG_OPTION: Readonly<Record<string, LocalePair>> = Object.freeze({
  "The benefit from growing mustard": lp("सरसों उगाने से मिलने वाला लाभ", "ਸਰੋਂ ਉਗਾਉਣ ਤੋਂ ਮਿਲਣ ਵਾਲਾ ਲਾਭ"),
  "The cost of wheat seed": lp("गेहूँ के बीज की लागत", "ਕਣਕ ਦੇ ਬੀਜ ਦੀ ਲਾਗਤ"),
  "The value of all crops grown nearby": lp("आस-पास उगाई गई सभी फसलों का मूल्य", "ਨੇੜੇ ਉਗਾਈਆਂ ਸਾਰੀਆਂ ਫਸਲਾਂ ਦਾ ਮੁੱਲ"),
  "The rent of every field he owns": lp("उसके सभी खेतों का किराया", "ਉਸਦੇ ਸਾਰੇ ਖੇਤਾਂ ਦਾ ਕਿਰਾਇਆ"),
  "The benefit from studying History": lp("इतिहास पढ़ने से मिलने वाला लाभ", "ਇਤਿਹਾਸ ਪੜ੍ਹਨ ਤੋਂ ਮਿਲਣ ਵਾਲਾ ਲਾਭ"),
  "The price of the Economics book": lp("अर्थशास्त्र की पुस्तक की कीमत", "ਅਰਥਸ਼ਾਸਤਰ ਦੀ ਕਿਤਾਬ ਦੀ ਕੀਮਤ"),
  "All study time used during the year": lp("वर्ष भर में लगाया गया कुल अध्ययन समय", "ਸਾਲ ਭਰ ਵਰਤਿਆ ਗਿਆ ਕੁੱਲ ਪੜ੍ਹਾਈ ਸਮਾਂ"),
  "The student's total education cost": lp("छात्र की कुल शिक्षा लागत", "ਵਿਦਿਆਰਥੀ ਦੀ ਕੁੱਲ ਸਿੱਖਿਆ ਲਾਗਤ"),
  "The value of the chairs not produced": lp("न बनाई गई कुर्सियों का मूल्य", "ਨਾ ਬਣਾਈਆਂ ਗਈਆਂ ਕੁਰਸੀਆਂ ਦਾ ਮੁੱਲ"),
  "The original price of the machine": lp("मशीन की मूल कीमत", "ਮਸ਼ੀਨ ਦੀ ਮੂਲ ਕੀਮਤ"),
  "The wages of all factory workers": lp("कारखाने के सभी श्रमिकों की मजदूरी", "ਫੈਕਟਰੀ ਦੇ ਸਾਰੇ ਮਜ਼ਦੂਰਾਂ ਦੀ ਮਜ਼ਦੂਰੀ"),
  "The market value of all furniture": lp("सभी फर्नीचर का बाज़ार मूल्य", "ਸਾਰੇ ਫਰਨੀਚਰ ਦਾ ਬਾਜ਼ਾਰੀ ਮੁੱਲ"),
  "The benefit from the road project not chosen": lp("न चुनी गई सड़क परियोजना से मिलने वाला लाभ", "ਨਾ ਚੁਣੇ ਗਏ ਸੜਕ ਪ੍ਰੋਜੈਕਟ ਤੋਂ ਮਿਲਣ ਵਾਲਾ ਲਾਭ"),
  "The local body's full annual budget": lp("स्थानीय निकाय का पूरा वार्षिक बजट", "ਸਥਾਨਕ ਸੰਸਥਾ ਦਾ ਪੂਰਾ ਸਾਲਾਨਾ ਬਜਟ"),
  "Only employee salaries": lp("केवल कर्मचारियों के वेतन", "ਸਿਰਫ਼ ਕਰਮਚਾਰੀਆਂ ਦੀਆਂ ਤਨਖਾਹਾਂ"),
  "The cost of every road in the state": lp("राज्य की हर सड़क की लागत", "ਰਾਜ ਦੀ ਹਰ ਸੜਕ ਦੀ ਲਾਗਤ"),
  "Scarcity forces choices; opportunity cost is the next best option given up.": lp("दुर्लभता चुनाव करने को मजबूर करती है; अवसर लागत छोड़ा गया अगला सर्वोत्तम विकल्प है।", "ਦੁਲਭਤਾ ਚੋਣ ਕਰਨ ਲਈ ਮਜਬੂਰ ਕਰਦੀ ਹੈ; ਅਵਸਰ ਲਾਗਤ ਛੱਡਿਆ ਗਿਆ ਅਗਲਾ ਸਭ ਤੋਂ ਵਧੀਆ ਵਿਕਲਪ ਹੈ।"),
  "Scarcity means unlimited resources; opportunity cost means unlimited wants.": lp("दुर्लभता का अर्थ असीमित संसाधन है; अवसर लागत का अर्थ असीमित इच्छाएँ है।", "ਦੁਲਭਤਾ ਦਾ ਅਰਥ ਅਸੀਮਿਤ ਸਰੋਤ ਹਨ; ਅਵਸਰ ਲਾਗਤ ਦਾ ਅਰਥ ਅਸੀਮਿਤ ਲੋੜਾਂ ਹਨ।"),
  "Scarcity applies only to money; opportunity cost applies only to goods.": lp("दुर्लभता केवल धन पर लागू होती है; अवसर लागत केवल वस्तुओं पर लागू होती है।", "ਦੁਲਭਤਾ ਸਿਰਫ਼ ਪੈਸੇ ਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ; ਅਵਸਰ ਲਾਗਤ ਸਿਰਫ਼ ਵਸਤੂਆਂ ਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।"),
  "Scarcity and opportunity cost mean the same thing.": lp("दुर्लभता और अवसर लागत का अर्थ एक ही है।", "ਦੁਲਭਤਾ ਅਤੇ ਅਵਸਰ ਲਾਗਤ ਦਾ ਅਰਥ ਇੱਕੋ ਹੈ।"),
  "Demand is about buyers; supply is about sellers.": lp("मांग खरीदारों से संबंधित है; आपूर्ति विक्रेताओं से संबंधित है।", "ਮੰਗ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ; ਪੂਰਤੀ ਵਿਕਰੇਤਿਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।"),
  "Demand means production; supply means consumption.": lp("मांग का अर्थ उत्पादन है; आपूर्ति का अर्थ उपभोग है।", "ਮੰਗ ਦਾ ਅਰਥ ਉਤਪਾਦਨ ਹੈ; ਪੂਰਤੀ ਦਾ ਅਰਥ ਉਪਭੋਗ ਹੈ।"),
  "Demand applies only to services; supply applies only to goods.": lp("मांग केवल सेवाओं पर और आपूर्ति केवल वस्तुओं पर लागू होती है।", "ਮੰਗ ਸਿਰਫ਼ ਸੇਵਾਵਾਂ ਤੇ ਅਤੇ ਪੂਰਤੀ ਸਿਰਫ਼ ਵਸਤੂਆਂ ਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।"),
  "Demand and supply refer only to government purchases.": lp("मांग और आपूर्ति केवल सरकारी खरीद को दर्शाती हैं।", "ਮੰਗ ਅਤੇ ਪੂਰਤੀ ਸਿਰਫ਼ ਸਰਕਾਰੀ ਖਰੀਦ ਨੂੰ ਦਰਸਾਉਂਦੀਆਂ ਹਨ।"),
  "Microeconomics studies individual units; macroeconomics studies the economy as a whole.": lp("सूक्ष्म अर्थशास्त्र व्यक्तिगत इकाइयों का अध्ययन करता है; समष्टि अर्थशास्त्र पूरी अर्थव्यवस्था का अध्ययन करता है।", "ਸੂਖਮ ਅਰਥਸ਼ਾਸਤਰ ਵਿਅਕਤੀਗਤ ਇਕਾਈਆਂ ਦਾ ਅਧਿਐਨ ਕਰਦਾ ਹੈ; ਸਮੂਹਕ ਅਰਥਸ਼ਾਸਤਰ ਪੂਰੀ ਅਰਥਵਿਵਸਥਾ ਦਾ ਅਧਿਐਨ ਕਰਦਾ ਹੈ।"),
  "Microeconomics studies only government; macroeconomics studies only firms.": lp("सूक्ष्म अर्थशास्त्र केवल सरकार और समष्टि अर्थशास्त्र केवल फर्मों का अध्ययन करता है।", "ਸੂਖਮ ਅਰਥਸ਼ਾਸਤਰ ਸਿਰਫ਼ ਸਰਕਾਰ ਅਤੇ ਸਮੂਹਕ ਅਰਥਸ਼ਾਸਤਰ ਸਿਰਫ਼ ਫਰਮਾਂ ਦਾ ਅਧਿਐਨ ਕਰਦਾ ਹੈ।"),
  "Microeconomics deals only with money; macroeconomics deals only with goods.": lp("सूक्ष्म अर्थशास्त्र केवल धन और समष्टि अर्थशास्त्र केवल वस्तुओं से संबंधित है।", "ਸੂਖਮ ਅਰਥਸ਼ਾਸਤਰ ਸਿਰਫ਼ ਪੈਸੇ ਅਤੇ ਸਮੂਹਕ ਅਰਥਸ਼ਾਸਤਰ ਸਿਰਫ਼ ਵਸਤੂਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ।"),
  "There is no difference between them.": lp("दोनों में कोई अंतर नहीं है।", "ਦੋਹਾਂ ਵਿੱਚ ਕੋਈ ਅੰਤਰ ਨਹੀਂ ਹੈ।"),
});

const CP2_ATOM: Readonly<Record<string, LocalePair>> = Object.freeze({
  "Capitalist economy": lp("पूंजीवादी अर्थव्यवस्था", "ਪੂੰਜੀਵਾਦੀ ਅਰਥਵਿਵਸਥਾ"),
  "Socialist economy": lp("समाजवादी अर्थव्यवस्था", "ਸਮਾਜਵਾਦੀ ਅਰਥਵਿਵਸਥਾ"),
  "Mixed economy": lp("मिश्रित अर्थव्यवस्था", "ਮਿਸ਼ਰਤ ਅਰਥਵਿਵਸਥਾ"),
  "Traditional economy": lp("पारंपरिक अर्थव्यवस्था", "ਰਵਾਇਤੀ ਅਰਥਵਿਵਸਥਾ"),
  "private ownership with a major role for markets": lp("निजी स्वामित्व और बाज़ारों की प्रमुख भूमिका", "ਨਿੱਜੀ ਮਲਕੀਅਤ ਅਤੇ ਬਾਜ਼ਾਰਾਂ ਦੀ ਮੁੱਖ ਭੂਮਿਕਾ"),
  "state ownership or control with planned production": lp("राज्य स्वामित्व या नियंत्रण के साथ योजनाबद्ध उत्पादन", "ਰਾਜ ਦੀ ਮਲਕੀਅਤ ਜਾਂ ਨਿਯੰਤਰਣ ਨਾਲ ਯੋਜਨਾਬੱਧ ਉਤਪਾਦਨ"),
  "coexistence of public and private sectors": lp("सार्वजनिक और निजी क्षेत्रों का सह-अस्तित्व", "ਸਰਕਾਰੀ ਅਤੇ ਨਿੱਜੀ ਖੇਤਰਾਂ ਦਾ ਇਕੱਠੇ ਮੌਜੂਦ ਹੋਣਾ"),
  "ownership is unrelated to economic decisions": lp("स्वामित्व का आर्थिक निर्णयों से कोई संबंध नहीं है", "ਮਲਕੀਅਤ ਦਾ ਆਰਥਿਕ ਫੈਸਲਿਆਂ ਨਾਲ ਕੋਈ ਸੰਬੰਧ ਨਹੀਂ ਹੈ"),
  "Primary sector": lp("प्राथमिक क्षेत्र", "ਪ੍ਰਾਥਮਿਕ ਖੇਤਰ"),
  "Secondary sector": lp("द्वितीयक क्षेत्र", "ਦੁਤੀਆ ਖੇਤਰ"),
  "Tertiary sector": lp("तृतीयक क्षेत्र", "ਤ੍ਰਿਤੀਆ ਖੇਤਰ"),
  "Cannot be determined from the activity given": lp("दी गई गतिविधि से निर्धारित नहीं किया जा सकता", "ਦਿੱਤੀ ਗਤੀਵਿਧੀ ਤੋਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
  "Public sector": lp("सार्वजनिक क्षेत्र", "ਸਰਕਾਰੀ ਖੇਤਰ"),
  "Private sector": lp("निजी क्षेत्र", "ਨਿੱਜੀ ਖੇਤਰ"),
  "Both public and private sectors": lp("सार्वजनिक और निजी दोनों क्षेत्र", "ਸਰਕਾਰੀ ਅਤੇ ਨਿੱਜੀ ਦੋਵੇਂ ਖੇਤਰ"),
  "Cannot be determined from ownership information": lp("स्वामित्व की जानकारी से निर्धारित नहीं किया जा सकता", "ਮਲਕੀਅਤ ਦੀ ਜਾਣਕਾਰੀ ਤੋਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
  "Organised sector": lp("संगठित क्षेत्र", "ਸੰਗਠਿਤ ਖੇਤਰ"),
  "Unorganised sector": lp("असंगठित क्षेत्र", "ਅਸੰਗਠਿਤ ਖੇਤਰ"),
  "Both organised and unorganised sectors": lp("संगठित और असंगठित दोनों क्षेत्र", "ਸੰਗਠਿਤ ਅਤੇ ਅਸੰਗਠਿਤ ਦੋਵੇਂ ਖੇਤਰ"),
  "Cannot be determined from the employment conditions given": lp("दी गई रोजगार शर्तों से निर्धारित नहीं किया जा सकता", "ਦਿੱਤੀਆਂ ਰੋਜ਼ਗਾਰ ਸ਼ਰਤਾਂ ਤੋਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
  "I only": lp("केवल I", "ਸਿਰਫ਼ I"),
  "II only": lp("केवल II", "ਸਿਰਫ਼ II"),
  "Both I and II": lp("I और II दोनों", "I ਅਤੇ II ਦੋਵੇਂ"),
  "Neither I nor II": lp("न तो I, न II", "ਨਾ I, ਨਾ II"),
});

const CP2_ACTIVITY: Readonly<Record<string, LocalePair>> = Object.freeze({
  "growing wheat on a farm": lp("खेत में गेहूँ उगाना", "ਖੇਤ ਵਿੱਚ ਕਣਕ ਉਗਾਉਣਾ"),
  "catching fish": lp("मछली पकड़ना", "ਮੱਛੀ ਫੜਨਾ"),
  "extracting coal from a mine": lp("खदान से कोयला निकालना", "ਖਾਣ ਤੋਂ ਕੋਇਲਾ ਕੱਢਣਾ"),
  "raising cattle for milk": lp("दूध के लिए पशुपालन करना", "ਦੁੱਧ ਲਈ ਪਸ਼ੂ ਪਾਲਣਾ"),
  "making cloth in a textile factory": lp("कपड़ा कारखाने में कपड़ा बनाना", "ਕੱਪੜਾ ਫੈਕਟਰੀ ਵਿੱਚ ਕੱਪੜਾ ਬਣਾਉਣਾ"),
  "making sugar from sugarcane": lp("गन्ने से चीनी बनाना", "ਗੰਨੇ ਤੋਂ ਚੀਨੀ ਬਣਾਉਣਾ"),
  "constructing a house": lp("मकान बनाना", "ਘਰ ਬਣਾਉਣਾ"),
  "producing steel in a plant": lp("संयंत्र में इस्पात बनाना", "ਪਲਾਂਟ ਵਿੱਚ ਸਟੀਲ ਬਣਾਉਣਾ"),
  "providing banking services": lp("बैंकिंग सेवाएँ देना", "ਬੈਂਕਿੰਗ ਸੇਵਾਵਾਂ ਦੇਣਾ"),
  "transporting goods by truck": lp("ट्रक से माल ढोना", "ਟਰੱਕ ਰਾਹੀਂ ਸਮਾਨ ਢੋਣਾ"),
  "providing hospital treatment": lp("अस्पताल में उपचार देना", "ਹਸਪਤਾਲ ਵਿੱਚ ਇਲਾਜ ਦੇਣਾ"),
  "selling goods in a retail shop": lp("खुदरा दुकान में वस्तुएँ बेचना", "ਖੁਦਰਾ ਦੁਕਾਨ ਵਿੱਚ ਵਸਤੂਆਂ ਵੇਚਣਾ"),
});

const CP2_DESCRIPTION: Readonly<Record<string, LocalePair>> = Object.freeze({
  "an enterprise owned and controlled by the government": lp("सरकार के स्वामित्व और नियंत्रण वाला उद्यम", "ਸਰਕਾਰ ਦੀ ਮਲਕੀਅਤ ਅਤੇ ਨਿਯੰਤਰਣ ਵਾਲਾ ਉਦਯੋਗ"),
  "a transport service owned by a municipal body": lp("नगर निकाय के स्वामित्व वाली परिवहन सेवा", "ਨਗਰ ਨਿਕਾਇ ਦੀ ਮਲਕੀਅਤ ਵਾਲੀ ਆਵਾਜਾਈ ਸੇਵਾ"),
  "a factory owned by private individuals or a private company": lp("निजी व्यक्तियों या निजी कंपनी के स्वामित्व वाला कारखाना", "ਨਿੱਜੀ ਵਿਅਕਤੀਆਂ ਜਾਂ ਨਿੱਜੀ ਕੰਪਨੀ ਦੀ ਮਲਕੀਅਤ ਵਾਲੀ ਫੈਕਟਰੀ"),
  "a hospital owned by a private company or individuals": lp("निजी कंपनी या व्यक्तियों के स्वामित्व वाला अस्पताल", "ਨਿੱਜੀ ਕੰਪਨੀ ਜਾਂ ਵਿਅਕਤੀਆਂ ਦੀ ਮਲਕੀਅਤ ਵਾਲਾ ਹਸਪਤਾਲ"),
  "a worker in a registered factory with fixed service rules and recorded employment": lp("पंजीकृत कारखाने का श्रमिक, जहाँ सेवा नियम तय हैं और रोजगार दर्ज है", "ਰਜਿਸਟਰਡ ਫੈਕਟਰੀ ਦਾ ਮਜ਼ਦੂਰ, ਜਿੱਥੇ ਸੇਵਾ ਨਿਯਮ ਨਿਰਧਾਰਤ ਹਨ ਅਤੇ ਰੋਜ਼ਗਾਰ ਦਰਜ ਹੈ"),
  "an employee in a government office with formal service conditions": lp("औपचारिक सेवा शर्तों वाला सरकारी कार्यालय का कर्मचारी", "ਰਸਮੀ ਸੇਵਾ ਸ਼ਰਤਾਂ ਵਾਲਾ ਸਰਕਾਰੀ ਦਫ਼ਤਰ ਦਾ ਕਰਮਚਾਰੀ"),
  "a casual construction worker hired day to day without formal service benefits": lp("बिना औपचारिक सेवा लाभ के रोज़ाना काम पर रखा गया निर्माण श्रमिक", "ਰਸਮੀ ਸੇਵਾ ਲਾਭਾਂ ਤੋਂ ਬਿਨਾਂ ਦਿਨ-ਦਿਹਾੜੇ ਰੱਖਿਆ ਗਿਆ ਨਿਰਮਾਣ ਮਜ਼ਦੂਰ"),
  "a self-employed street vendor working outside a formal employment structure": lp("औपचारिक रोजगार ढाँचे से बाहर काम करने वाला स्वरोज़गार सड़क विक्रेता", "ਰਸਮੀ ਰੋਜ਼ਗਾਰ ਢਾਂਚੇ ਤੋਂ ਬਾਹਰ ਕੰਮ ਕਰਨ ਵਾਲਾ ਸਵੈ-ਰੋਜ਼ਗਾਰ ਰੇਹੜੀ-ਫੜੀ ਵਿਕਰੇਤਾ"),
});

const CP2_LONG_OPTION: Readonly<Record<string, LocalePair>> = Object.freeze({
  "Primary, secondary and tertiary classify the type of activity; public and private classify ownership.": lp("प्राथमिक, द्वितीयक और तृतीयक गतिविधि के प्रकार को वर्गीकृत करते हैं; सार्वजनिक और निजी स्वामित्व को।", "ਪ੍ਰਾਥਮਿਕ, ਦੁਤੀਆ ਅਤੇ ਤ੍ਰਿਤੀਆ ਗਤੀਵਿਧੀ ਦੀ ਕਿਸਮ ਦੱਸਦੇ ਹਨ; ਸਰਕਾਰੀ ਅਤੇ ਨਿੱਜੀ ਮਲਕੀਅਤ ਦੱਸਦੇ ਹਨ।"),
  "Primary and public mean the same thing.": lp("प्राथमिक और सार्वजनिक का अर्थ एक ही है।", "ਪ੍ਰਾਥਮਿਕ ਅਤੇ ਸਰਕਾਰੀ ਦਾ ਅਰਥ ਇੱਕੋ ਹੈ।"),
  "Tertiary and private mean the same thing.": lp("तृतीयक और निजी का अर्थ एक ही है।", "ਤ੍ਰਿਤੀਆ ਅਤੇ ਨਿੱਜੀ ਦਾ ਅਰਥ ਇੱਕੋ ਹੈ।"),
  "Ownership decides whether an activity is primary, secondary or tertiary.": lp("स्वामित्व तय करता है कि गतिविधि प्राथमिक, द्वितीयक या तृतीयक है।", "ਮਲਕੀਅਤ ਤੈਅ ਕਰਦੀ ਹੈ ਕਿ ਗਤੀਵਿਧੀ ਪ੍ਰਾਥਮਿਕ, ਦੁਤੀਆ ਜਾਂ ਤ੍ਰਿਤੀਆ ਹੈ।"),
  "A service can belong to either the public sector or the private sector.": lp("एक सेवा सार्वजनिक या निजी, किसी भी क्षेत्र में हो सकती है।", "ਇੱਕ ਸੇਵਾ ਸਰਕਾਰੀ ਜਾਂ ਨਿੱਜੀ, ਕਿਸੇ ਵੀ ਖੇਤਰ ਵਿੱਚ ਹੋ ਸਕਦੀ ਹੈ।"),
  "Every service belongs to the public sector.": lp("हर सेवा सार्वजनिक क्षेत्र में होती है।", "ਹਰ ਸੇਵਾ ਸਰਕਾਰੀ ਖੇਤਰ ਵਿੱਚ ਹੁੰਦੀ ਹੈ।"),
  "Every private activity belongs to the secondary sector.": lp("हर निजी गतिविधि द्वितीयक क्षेत्र में होती है।", "ਹਰ ਨਿੱਜੀ ਗਤੀਵਿਧੀ ਦੁਤੀਆ ਖੇਤਰ ਵਿੱਚ ਹੁੰਦੀ ਹੈ।"),
  "Every government activity belongs to the primary sector.": lp("हर सरकारी गतिविधि प्राथमिक क्षेत्र में होती है।", "ਹਰ ਸਰਕਾਰੀ ਗਤੀਵਿਧੀ ਪ੍ਰਾਥਮਿਕ ਖੇਤਰ ਵਿੱਚ ਹੁੰਦੀ ਹੈ।"),
  "Employment conditions and the degree of formality of work.": lp("रोजगार की शर्तें और काम की औपचारिकता का स्तर।", "ਰੋਜ਼ਗਾਰ ਦੀਆਂ ਸ਼ਰਤਾਂ ਅਤੇ ਕੰਮ ਦੀ ਰਸਮੀਅਤ ਦਾ ਪੱਧਰ।"),
  "Whether output is agricultural or industrial.": lp("उत्पादन कृषि से संबंधित है या उद्योग से।", "ਉਤਪਾਦਨ ਖੇਤੀ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ ਜਾਂ ਉਦਯੋਗ ਨਾਲ।"),
  "Whether an enterprise is publicly or privately owned.": lp("उद्यम सार्वजनिक स्वामित्व में है या निजी में।", "ਉਦਯੋਗ ਸਰਕਾਰੀ ਮਲਕੀਅਤ ਵਿੱਚ ਹੈ ਜਾਂ ਨਿੱਜੀ ਵਿੱਚ।"),
  "Whether an activity produces goods or services.": lp("गतिविधि वस्तुएँ पैदा करती है या सेवाएँ।", "ਗਤੀਵਿਧੀ ਵਸਤੂਆਂ ਪੈਦਾ ਕਰਦੀ ਹੈ ਜਾਂ ਸੇਵਾਵਾਂ।"),
});

function native(map: Readonly<Record<string, LocalePair>>, key: string, locale: NativeLocale): string | undefined {
  return map[key]?.[locale];
}

function atomCp1(text: string, locale: NativeLocale): string {
  return native(CP1_ATOM, text, locale) ?? native(CP1_EXAMPLES, text, locale) ?? native(CP1_LONG_OPTION, text, locale) ?? text;
}

function atomCp2(text: string, locale: NativeLocale): string {
  return native(CP2_ATOM, text, locale) ?? native(CP2_ACTIVITY, text, locale) ?? native(CP2_DESCRIPTION, text, locale) ?? native(CP2_LONG_OPTION, text, locale) ?? text;
}

function translatePair(text: string, locale: NativeLocale, atom: (text: string, locale: NativeLocale) => string): string {
  const exact = atom(text, locale);
  if (exact !== text) return exact;
  if (text.includes(" — ")) {
    return text.split(" — ").map((part) => atom(part, locale)).join(" — ");
  }
  if (text.includes("; ")) {
    return text.split("; ").map((part) => atom(part, locale)).join("; ");
  }
  return text;
}

function cp1Option(text: string, locale: NativeLocale): string {
  return translatePair(text, locale, atomCp1);
}

function cp1Stem(q: (typeof ECO_CP001_REVIEW_V2)[number], locale: NativeLocale): string {
  const scenario = native(CP1_SCENARIO, q.stem, locale);
  if (scenario) return scenario;
  const ql = Number(q.qlId.slice(-3));
  if (ql === 1) {
    const meaning = q.stem.match(/^Which term means (.+)\?$/)?.[1] ?? "";
    return locale === "hi" ? `कौन-सा शब्द ${atomCp1(meaning, locale)} को दर्शाता है?` : `ਕਿਹੜਾ ਸ਼ਬਦ ${atomCp1(meaning, locale)} ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?`;
  }
  if (ql === 2) {
    const term = q.stem.match(/^What does (.+) mean\?$/)?.[1] ?? "";
    return locale === "hi" ? `${atomCp1(term, locale)} का क्या अर्थ है?` : `${atomCp1(term, locale)} ਦਾ ਕੀ ਅਰਥ ਹੈ?`;
  }
  if (ql === 3) {
    const example = q.stem.match(/^(.+) is an example of which factor of production\?$/)?.[1] ?? "";
    return locale === "hi" ? `${atomCp1(example, locale)} उत्पादन के किस कारक का उदाहरण है?` : `${atomCp1(example, locale)} ਉਤਪਾਦਨ ਦੇ ਕਿਹੜੇ ਕਾਰਕ ਦੀ ਉਦਾਹਰਨ ਹੈ?`;
  }
  if (ql === 4) {
    const factor = q.stem.match(/^What is the reward for (.+)\?$/)?.[1] ?? "";
    return locale === "hi" ? `${atomCp1(capitalise(factor), locale)} का प्रतिफल क्या है?` : `${atomCp1(capitalise(factor), locale)} ਦਾ ਪ੍ਰਤੀਫਲ ਕੀ ਹੈ?`;
  }
  if (ql === 5) {
    const reward = q.stem.match(/^Which factor of production earns (.+)\?$/)?.[1] ?? "";
    return locale === "hi" ? `${atomCp1(capitalise(reward), locale)} उत्पादन के किस कारक का प्रतिफल है?` : `${atomCp1(capitalise(reward), locale)} ਉਤਪਾਦਨ ਦੇ ਕਿਹੜੇ ਕਾਰਕ ਦਾ ਪ੍ਰਤੀਫਲ ਹੈ?`;
  }
  if (ql === 10) return locale === "hi" ? "कौन-सा युग्म सही सुमेलित है?" : "ਕਿਹੜਾ ਜੋੜ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  if (ql === 11) {
    const m = q.stem.match(/^Consider the statements:\nI\. (.+?) means (.+?)\.\nII\. (.+?) means (.+?)\.\nWhich is correct\?$/s);
    if (!m) throw new Error(`${q.questionId}: statement stem not parsed`);
    const [, t1, m1, t2, m2] = m;
    return locale === "hi"
      ? `कथनों पर विचार कीजिए:\nI. ${atomCp1(t1, locale)} का अर्थ है: ${atomCp1(m1, locale)}।\nII. ${atomCp1(t2, locale)} का अर्थ है: ${atomCp1(m2, locale)}।\nकौन-सा विकल्प सही है?`
      : `ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:\nI. ${atomCp1(t1, locale)} ਦਾ ਅਰਥ ਹੈ: ${atomCp1(m1, locale)}।\nII. ${atomCp1(t2, locale)} ਦਾ ਅਰਥ ਹੈ: ${atomCp1(m2, locale)}।\nਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?`;
  }
  const q12: Readonly<Record<string, LocalePair>> = {
    "Which statement about scarcity and opportunity cost is correct?": lp("दुर्लभता और अवसर लागत के बारे में कौन-सा कथन सही है?", "ਦੁਲਭਤਾ ਅਤੇ ਅਵਸਰ ਲਾਗਤ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?"),
    "Which statement about demand and supply is correct?": lp("मांग और आपूर्ति के बारे में कौन-सा कथन सही है?", "ਮੰਗ ਅਤੇ ਪੂਰਤੀ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?"),
    "Which statement about microeconomics and macroeconomics is correct?": lp("सूक्ष्म और समष्टि अर्थशास्त्र के बारे में कौन-सा कथन सही है?", "ਸੂਖਮ ਅਤੇ ਸਮੂਹਕ ਅਰਥਸ਼ਾਸਤਰ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?"),
  };
  return native(q12, q.stem, locale) ?? q.stem;
}

function cp1Explanation(q: (typeof ECO_CP001_REVIEW_V2)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  if ([1, 2, 10].includes(ql)) {
    const answer = cp1Option(q.canonicalAnswer, locale);
    if (q.canonicalAnswer.includes(" — ")) return locale === "hi" ? `${answer} सही सुमेलित युग्म है।` : `${answer} ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਜੋੜ ਹੈ।`;
    const meaning = ql === 1 ? q.stem.match(/^Which term means (.+)\?$/)?.[1] : q.canonicalAnswer;
    const term = ql === 1 ? q.canonicalAnswer : q.stem.match(/^What does (.+) mean\?$/)?.[1];
    return locale === "hi" ? `${atomCp1(term ?? "", locale)} का अर्थ ${atomCp1(meaning ?? "", locale)} है।` : `${atomCp1(term ?? "", locale)} ਦਾ ਅਰਥ ${atomCp1(meaning ?? "", locale)} ਹੈ।`;
  }
  if (ql === 3) return locale === "hi" ? `यह ${cp1Option(q.canonicalAnswer, locale)} का उदाहरण है, क्योंकि यह उत्पादन में प्रयुक्त उसी प्रकार के संसाधन या प्रयास को दर्शाता है।` : `ਇਹ ${cp1Option(q.canonicalAnswer, locale)} ਦੀ ਉਦਾਹਰਨ ਹੈ, ਕਿਉਂਕਿ ਇਹ ਉਤਪਾਦਨ ਵਿੱਚ ਵਰਤੇ ਉਸੇ ਕਿਸਮ ਦੇ ਸਰੋਤ ਜਾਂ ਯਤਨ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।`;
  if (ql === 4 || ql === 5) return locale === "hi" ? `${cp1Option(q.canonicalAnswer, locale)} इस कारक-वर्गीकरण में सही उत्तर है। कारक और उसके प्रतिफल का संबंध याद रखना चाहिए।` : `${cp1Option(q.canonicalAnswer, locale)} ਇਸ ਕਾਰਕ-ਵਰਗੀਕਰਨ ਵਿੱਚ ਸਹੀ ਉੱਤਰ ਹੈ। ਕਾਰਕ ਅਤੇ ਉਸਦੇ ਪ੍ਰਤੀਫਲ ਦਾ ਸੰਬੰਧ ਯਾਦ ਰੱਖੋ।`;
  if (ql === 6) return locale === "hi" ? `अवसर लागत वह अगला सर्वोत्तम विकल्प है जिसे चुनाव करते समय छोड़ दिया जाता है। यहाँ सही उत्तर ${cp1Option(q.canonicalAnswer, locale)} है।` : `ਅਵਸਰ ਲਾਗਤ ਉਹ ਅਗਲਾ ਸਭ ਤੋਂ ਵਧੀਆ ਵਿਕਲਪ ਹੈ ਜੋ ਚੋਣ ਕਰਦੇ ਸਮੇਂ ਛੱਡਿਆ ਜਾਂਦਾ ਹੈ। ਇੱਥੇ ਸਹੀ ਉੱਤਰ ${cp1Option(q.canonicalAnswer, locale)} ਹੈ।`;
  if (ql === 7) return locale === "hi" ? "संसाधन सीमित हैं जबकि उनके उपयोग या इच्छाएँ अधिक हैं। यही दुर्लभता की स्थिति है।" : "ਸਰੋਤ ਸੀਮਿਤ ਹਨ ਜਦਕਿ ਉਨ੍ਹਾਂ ਦੀਆਂ ਵਰਤੋਂਆਂ ਜਾਂ ਲੋੜਾਂ ਵੱਧ ਹਨ। ਇਹੀ ਦੁਲਭਤਾ ਦੀ ਸਥਿਤੀ ਹੈ।";
  if (ql === 8) return locale === "hi" ? `यह स्थिति ${cp1Option(q.canonicalAnswer, locale)} को दर्शाती है। वर्गीकरण इस बात पर निर्भर करता है कि वस्तु या सेवा बनाई, उपयोग की या उत्पादन के परिणाम बाँटे जा रहे हैं।` : `ਇਹ ਸਥਿਤੀ ${cp1Option(q.canonicalAnswer, locale)} ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ। ਵਰਗੀਕਰਨ ਇਸ ਗੱਲ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ ਕਿ ਵਸਤੂ ਜਾਂ ਸੇਵਾ ਬਣਾਈ, ਵਰਤੀ ਜਾਂ ਉਤਪਾਦਨ ਦੇ ਨਤੀਜੇ ਵੰਡੇ ਜਾ ਰਹੇ ਹਨ।`;
  if (ql === 9) return q.canonicalAnswer === "Microeconomics"
    ? (locale === "hi" ? "सूक्ष्म अर्थशास्त्र व्यक्तिगत उपभोक्ताओं, फर्मों और विशेष बाज़ारों का अध्ययन करता है।" : "ਸੂਖਮ ਅਰਥਸ਼ਾਸਤਰ ਵਿਅਕਤੀਗਤ ਖਪਤਕਾਰਾਂ, ਫਰਮਾਂ ਅਤੇ ਖਾਸ ਬਾਜ਼ਾਰਾਂ ਦਾ ਅਧਿਐਨ ਕਰਦਾ ਹੈ।")
    : (locale === "hi" ? "समष्टि अर्थशास्त्र पूरी अर्थव्यवस्था और व्यापक आर्थिक समष्टियों का अध्ययन करता है।" : "ਸਮੂਹਕ ਅਰਥਸ਼ਾਸਤਰ ਪੂਰੀ ਅਰਥਵਿਵਸਥਾ ਅਤੇ ਵਿਆਪਕ ਆਰਥਿਕ ਸਮੂਹਾਂ ਦਾ ਅਧਿਐਨ ਕਰਦਾ ਹੈ।");
  if (ql === 11) return locale === "hi" ? `सही विकल्प ${cp1Option(q.canonicalAnswer, locale)} है। प्रत्येक कथन को संबंधित आर्थिक अवधारणा की परिभाषा से मिलाकर जाँचना चाहिए।` : `ਸਹੀ ਵਿਕਲਪ ${cp1Option(q.canonicalAnswer, locale)} ਹੈ। ਹਰ ਬਿਆਨ ਨੂੰ ਸੰਬੰਧਿਤ ਆਰਥਿਕ ਧਾਰਣਾ ਦੀ ਪਰਿਭਾਸ਼ਾ ਨਾਲ ਮਿਲਾ ਕੇ ਜਾਂਚੋ।`;
  return locale === "hi" ? `${cp1Option(q.canonicalAnswer, locale)} सही है। यह विकल्प दोनों संबंधित अवधारणाओं के बीच सही अंतर बताता है।` : `${cp1Option(q.canonicalAnswer, locale)} ਸਹੀ ਹੈ। ਇਹ ਵਿਕਲਪ ਦੋਹਾਂ ਸੰਬੰਧਿਤ ਧਾਰਣਾਵਾਂ ਵਿਚਲਾ ਸਹੀ ਅੰਤਰ ਦੱਸਦਾ ਹੈ।`;
}

function cp2Option(text: string, locale: NativeLocale): string {
  return translatePair(text, locale, atomCp2);
}

function cp2Stem(q: (typeof ECO_CP002_REVIEW_V2)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  if (ql === 1) {
    const feature = q.stem.match(/^Which economic system is characterised by (.+)\?$/)?.[1] ?? "";
    return locale === "hi" ? `${atomCp2(feature, locale)} किस आर्थिक व्यवस्था की विशेषता है?` : `${atomCp2(feature, locale)} ਕਿਹੜੀ ਆਰਥਿਕ ਵਿਵਸਥਾ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਹੈ?`;
  }
  if (ql === 2) {
    const system = q.stem.match(/^What is a main feature of a (.+)\?$/)?.[1] ?? "";
    const key = Object.keys(CP2_ATOM).find((candidate) => candidate.toLowerCase() === system.toLowerCase()) ?? system;
    return locale === "hi" ? `${atomCp2(key, locale)} की मुख्य विशेषता क्या है?` : `${atomCp2(key, locale)} ਦੀ ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾ ਕੀ ਹੈ?`;
  }
  if (ql === 3) {
    const activity = q.stem.match(/^Which sector includes (.+)\?$/)?.[1] ?? "";
    return locale === "hi" ? `${atomCp2(activity, locale)} किस क्षेत्र में आता है?` : `${atomCp2(activity, locale)} ਕਿਹੜੇ ਖੇਤਰ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`;
  }
  if (ql === 4) {
    const description = q.stem.match(/^Which ownership category applies to (.+)\?$/)?.[1] ?? "";
    return locale === "hi" ? `${atomCp2(description, locale)} किस स्वामित्व श्रेणी में आता है?` : `${atomCp2(description, locale)} ਕਿਹੜੀ ਮਲਕੀਅਤ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਆਉਂਦਾ ਹੈ?`;
  }
  if (ql === 5) {
    const description = q.stem.match(/^How is (.+) classified by employment conditions\?$/)?.[1] ?? "";
    return locale === "hi" ? `रोजगार की शर्तों के आधार पर ${atomCp2(description, locale)} को कैसे वर्गीकृत किया जाएगा?` : `ਰੋਜ਼ਗਾਰ ਦੀਆਂ ਸ਼ਰਤਾਂ ਦੇ ਆਧਾਰ ਤੇ ${atomCp2(description, locale)} ਨੂੰ ਕਿਵੇਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਜਾਵੇਗਾ?`;
  }
  if (ql === 6) {
    const m = q.stem.match(/^A (government-owned|privately owned) unit is (.+)\. Which classification is correct\?$/);
    if (!m) throw new Error(`${q.questionId}: CP002 QL006 stem not parsed`);
    const owner = m[1] === "government-owned"
      ? (locale === "hi" ? "सरकारी स्वामित्व वाली" : "ਸਰਕਾਰੀ ਮਲਕੀਅਤ ਵਾਲੀ")
      : (locale === "hi" ? "निजी स्वामित्व वाली" : "ਨਿੱਜੀ ਮਲਕੀਅਤ ਵਾਲੀ");
    return locale === "hi" ? `एक ${owner} इकाई ${atomCp2(m[2], locale)} का काम करती है। सही वर्गीकरण कौन-सा है?` : `ਇੱਕ ${owner} ਇਕਾਈ ${atomCp2(m[2], locale)} ਦਾ ਕੰਮ ਕਰਦੀ ਹੈ। ਸਹੀ ਵਰਗੀਕਰਨ ਕਿਹੜਾ ਹੈ?`;
  }
  if (ql === 7) return locale === "hi" ? "कौन-सा युग्म सही सुमेलित है?" : "ਕਿਹੜਾ ਜੋੜ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  if (ql === 8) return locale === "hi" ? "कौन-सा युग्म गलत सुमेलित है?" : "ਕਿਹੜਾ ਜੋੜ ਗਲਤ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  if (ql === 9) {
    const m = q.stem.match(/^Consider the statements\. I\. (.+) belongs to the (.+)\. II\. (.+) belongs to the (.+)\. Which option is correct\?$/);
    if (!m) throw new Error(`${q.questionId}: CP002 QL009 stem not parsed`);
    return locale === "hi"
      ? `कथनों पर विचार कीजिए। I. ${atomCp2(m[1], locale)} ${atomCp2(capitalise(m[2]), locale)} में आता है। II. ${atomCp2(m[3], locale)} ${atomCp2(capitalise(m[4]), locale)} में आता है। कौन-सा विकल्प सही है?`
      : `ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ। I. ${atomCp2(m[1], locale)} ${atomCp2(capitalise(m[2]), locale)} ਵਿੱਚ ਆਉਂਦਾ ਹੈ। II. ${atomCp2(m[3], locale)} ${atomCp2(capitalise(m[4]), locale)} ਵਿੱਚ ਆਉਂਦਾ ਹੈ। ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?`;
  }
  const map: Readonly<Record<string, LocalePair>> = {
    "Which statement correctly distinguishes activity from ownership classification?": lp("कौन-सा कथन गतिविधि और स्वामित्व वर्गीकरण में सही अंतर बताता है?", "ਕਿਹੜਾ ਬਿਆਨ ਗਤੀਵਿਧੀ ਅਤੇ ਮਲਕੀਅਤ ਵਰਗੀਕਰਨ ਵਿਚਲਾ ਸਹੀ ਅੰਤਰ ਦੱਸਦਾ ਹੈ?"),
    "Which statement about service activities and ownership is correct?": lp("सेवा गतिविधियों और स्वामित्व के बारे में कौन-सा कथन सही है?", "ਸੇਵਾ ਗਤੀਵਿਧੀਆਂ ਅਤੇ ਮਲਕੀਅਤ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?"),
    "What do organised and unorganised sectors mainly classify?": lp("संगठित और असंगठित क्षेत्र मुख्य रूप से किसका वर्गीकरण करते हैं?", "ਸੰਗਠਿਤ ਅਤੇ ਅਸੰਗਠਿਤ ਖੇਤਰ ਮੁੱਖ ਤੌਰ ਤੇ ਕਿਸਦਾ ਵਰਗੀਕਰਨ ਕਰਦੇ ਹਨ?"),
  };
  return native(map, q.stem, locale) ?? q.stem;
}

function cp2Explanation(q: (typeof ECO_CP002_REVIEW_V2)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  if ([1, 2].includes(ql)) return locale === "hi" ? `${cp2Option(q.canonicalAnswer, locale)} सही है। आर्थिक व्यवस्था की पहचान स्वामित्व, बाज़ार की भूमिका और योजना की प्रकृति से की जाती है।` : `${cp2Option(q.canonicalAnswer, locale)} ਸਹੀ ਹੈ। ਆਰਥਿਕ ਵਿਵਸਥਾ ਦੀ ਪਛਾਣ ਮਲਕੀਅਤ, ਬਾਜ਼ਾਰ ਦੀ ਭੂਮਿਕਾ ਅਤੇ ਯੋਜਨਾ ਦੀ ਪ੍ਰਕਿਰਤੀ ਤੋਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`;
  if (ql === 3) return locale === "hi" ? `${cp2Option(q.canonicalAnswer, locale)} सही है। प्राथमिक क्षेत्र प्राकृतिक संसाधनों से सीधे जुड़ा होता है, द्वितीयक क्षेत्र निर्माण/प्रसंस्करण से और तृतीयक क्षेत्र सेवाओं से।` : `${cp2Option(q.canonicalAnswer, locale)} ਸਹੀ ਹੈ। ਪ੍ਰਾਥਮਿਕ ਖੇਤਰ ਕੁਦਰਤੀ ਸਰੋਤਾਂ ਨਾਲ ਸਿੱਧਾ ਜੁੜਿਆ ਹੁੰਦਾ ਹੈ, ਦੁਤੀਆ ਖੇਤਰ ਨਿਰਮਾਣ/ਪ੍ਰਸੰਸਕਰਨ ਨਾਲ ਅਤੇ ਤ੍ਰਿਤੀਆ ਖੇਤਰ ਸੇਵਾਵਾਂ ਨਾਲ।`;
  if (ql === 4) return locale === "hi" ? `${cp2Option(q.canonicalAnswer, locale)} इस बात से तय होता है कि उद्यम का स्वामित्व या नियंत्रण किसके पास है।` : `${cp2Option(q.canonicalAnswer, locale)} ਇਸ ਗੱਲ ਤੋਂ ਤੈਅ ਹੁੰਦਾ ਹੈ ਕਿ ਉਦਯੋਗ ਦੀ ਮਲਕੀਅਤ ਜਾਂ ਨਿਯੰਤਰਣ ਕਿਸ ਕੋਲ ਹੈ।`;
  if (ql === 5) return locale === "hi" ? `${cp2Option(q.canonicalAnswer, locale)} रोजगार की औपचारिकता, सेवा नियमों और सुरक्षा जैसी शर्तों के आधार पर तय किया जाता है।` : `${cp2Option(q.canonicalAnswer, locale)} ਰੋਜ਼ਗਾਰ ਦੀ ਰਸਮੀਅਤ, ਸੇਵਾ ਨਿਯਮਾਂ ਅਤੇ ਸੁਰੱਖਿਆ ਵਰਗੀਆਂ ਸ਼ਰਤਾਂ ਦੇ ਆਧਾਰ ਤੇ ਤੈਅ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।`;
  if (ql === 6) return locale === "hi" ? `${cp2Option(q.canonicalAnswer, locale)} सही है। गतिविधि-आधारित क्षेत्र और स्वामित्व-आधारित क्षेत्र दो अलग वर्गीकरण हैं।` : `${cp2Option(q.canonicalAnswer, locale)} ਸਹੀ ਹੈ। ਗਤੀਵਿਧੀ-ਅਧਾਰਿਤ ਖੇਤਰ ਅਤੇ ਮਲਕੀਅਤ-ਅਧਾਰਿਤ ਖੇਤਰ ਦੋ ਵੱਖ ਵਰਗੀਕਰਨ ਹਨ।`;
  if (ql === 7 || ql === 8) return locale === "hi" ? `${cp2Option(q.canonicalAnswer, locale)} प्रश्न में माँगा गया सही युग्म है। क्षेत्र का निर्धारण गतिविधि की प्रकृति से होता है।` : `${cp2Option(q.canonicalAnswer, locale)} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗਿਆ ਗਿਆ ਸਹੀ ਜੋੜ ਹੈ। ਖੇਤਰ ਦਾ ਨਿਰਧਾਰਨ ਗਤੀਵਿਧੀ ਦੀ ਪ੍ਰਕਿਰਤੀ ਤੋਂ ਹੁੰਦਾ ਹੈ।`;
  if (ql === 9) return locale === "hi" ? `सही विकल्प ${cp2Option(q.canonicalAnswer, locale)} है। प्रत्येक गतिविधि को उसके वास्तविक क्षेत्र से मिलाकर दोनों कथनों की जाँच करनी चाहिए।` : `ਸਹੀ ਵਿਕਲਪ ${cp2Option(q.canonicalAnswer, locale)} ਹੈ। ਹਰ ਗਤੀਵਿਧੀ ਨੂੰ ਉਸਦੇ ਅਸਲ ਖੇਤਰ ਨਾਲ ਮਿਲਾ ਕੇ ਦੋਹਾਂ ਬਿਆਨਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।`;
  return locale === "hi" ? `${cp2Option(q.canonicalAnswer, locale)} सही है। गतिविधि, स्वामित्व और रोजगार-शर्तों के वर्गीकरण को एक-दूसरे से अलग रखना चाहिए।` : `${cp2Option(q.canonicalAnswer, locale)} ਸਹੀ ਹੈ। ਗਤੀਵਿਧੀ, ਮਲਕੀਅਤ ਅਤੇ ਰੋਜ਼ਗਾਰ-ਸ਼ਰਤਾਂ ਦੇ ਵਰਗੀਕਰਨ ਨੂੰ ਇੱਕ-ਦੂਜੇ ਤੋਂ ਵੱਖ ਰੱਖੋ।`;
}

function capitalise(value: string): string {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;
}

function localizedBase(q: EnglishQuestion, locale: EcoLocaleV1, stem: string, options: string[], canonicalAnswer: string, explanation: string): EcoLocalizedQuestionV1 {
  return {
    ...q,
    questionId: locale === "en" ? q.questionId : `${q.questionId}-${locale.toUpperCase()}`,
    stem,
    options,
    canonicalAnswer,
    explanation,
    locale,
    localizationV1: {
      version: ECO_LOCALIZATION_V1,
      englishQuestionId: q.questionId,
      semanticInvariant: true,
      cpInvariant: true,
      qlInvariant: true,
      difficultyInvariant: true,
      sourceInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
      reviewOnly: true,
    },
  };
}

function localizeCp001(q: (typeof ECO_CP001_REVIEW_V2)[number], locale: EcoLocaleV1): EcoLocalizedQuestionV1 {
  if (locale === "en") return localizedBase(q, locale, q.stem, [...q.options], q.canonicalAnswer, q.explanation);
  const options = q.options.map((option) => cp1Option(option, locale));
  return localizedBase(q, locale, cp1Stem(q, locale), options, options[q.correctIndex], cp1Explanation(q, locale));
}

function localizeCp002(q: (typeof ECO_CP002_REVIEW_V2)[number], locale: EcoLocaleV1): EcoLocalizedQuestionV1 {
  if (locale === "en") return localizedBase(q, locale, q.stem, [...q.options], q.canonicalAnswer, q.explanation);
  const options = q.options.map((option) => cp2Option(option, locale));
  return localizedBase(q, locale, cp2Stem(q, locale), options, options[q.correctIndex], cp2Explanation(q, locale));
}

export const ECO_CP001_CP002_LOCALIZATION_V1_SUPPORTED_CPS = ["ECO-CP-001", "ECO-CP-002"] as const;
export const ECO_CP001_CP002_LOCALIZATION_V1_SUPPORTED_LOCALES = ["en", "hi", "pa"] as const;

export function generateEcoCp001LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return ECO_CP001_REVIEW_V2.map((q) => localizeCp001(q, locale));
}

export function generateEcoCp002LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return ECO_CP002_REVIEW_V2.map((q) => localizeCp002(q, locale));
}

export function generateEcoCp001Cp002LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp001LocalizedReviewV1(locale), ...generateEcoCp002LocalizedReviewV1(locale)];
}
