import { ECO_CP005_REVIEW_V1 } from "../inflation-price-concepts/eco-cp005-review-generator-v1";
import { ECO_CP006_REVIEW_V1 } from "../employment-unemployment-poverty/eco-cp006-review-generator-v1";
import {
  ECO_LOCALIZATION_V1,
  type EcoLocaleV1,
  type EcoLocalizedQuestionV1,
} from "./eco-localization-types-v1";

type NativeLocale = Exclude<EcoLocaleV1, "en">;
type Pair = Readonly<{ hi: string; pa: string }>;
const lp = (hi: string, pa: string): Pair => ({ hi, pa });

const T: Readonly<Record<string, Pair>> = Object.freeze({
  "Inflation": lp("मुद्रास्फीति", "ਮਹਿੰਗਾਈ"),
  "Deflation": lp("अपस्फीति", "ਮੁੱਲ-ਘਟਾਅ"),
  "Disinflation": lp("Disinflation", "Disinflation"),
  "Stagnation": lp("ठहराव", "ਠਹਿਰਾਅ"),
  "Demand-pull inflation": lp("Demand-pull inflation", "Demand-pull inflation"),
  "Cost-push inflation": lp("Cost-push inflation", "Cost-push inflation"),
  "Headline inflation": lp("Headline inflation", "Headline inflation"),
  "Core inflation": lp("Core inflation", "Core inflation"),
  "Purchasing power": lp("क्रय शक्ति", "ਖਰੀਦ ਸ਼ਕਤੀ"),
  "Base effect": lp("आधार प्रभाव", "ਅਧਾਰ ਪ੍ਰਭਾਵ"),
  "GDP deflator": lp("GDP deflator", "GDP deflator"),
  "Core CPI": lp("Core CPI", "Core CPI"),
  "Hyperinflation": lp("Hyperinflation", "Hyperinflation"),
  "Revaluation": lp("पुनर्मूल्यांकन", "ਮੁੜ-ਮੁੱਲਾਂਕਣ"),
  "WPI coverage": lp("WPI का दायरा", "WPI ਦਾ ਦਾਇਰਾ"),
  "Seasonal poverty": lp("मौसमी गरीबी", "ਮੌਸਮੀ ਗਰੀਬੀ"),
  "Absolute poverty only": lp("केवल निरपेक्ष गरीबी", "ਸਿਰਫ਼ ਨਿਰਪੇਖ ਗਰੀਬੀ"),
  "Relative poverty only": lp("केवल सापेक्ष गरीबी", "ਸਿਰਫ਼ ਸਾਪੇਖ ਗਰੀਬੀ"),
  "Cyclical poverty": lp("चक्रीय गरीबी", "ਚੱਕਰੀ ਗਰੀਬੀ"),
  "Price index": lp("मूल्य सूचकांक", "ਕੀਮਤ ਸੂਚਕ"),
  "a sustained rise in the general price level": lp("सामान्य मूल्य स्तर में लगातार वृद्धि", "ਆਮ ਕੀਮਤ ਪੱਧਰ ਵਿੱਚ ਲਗਾਤਾਰ ਵਾਧਾ"),
  "a sustained fall in the general price level": lp("सामान्य मूल्य स्तर में लगातार गिरावट", "ਆਮ ਕੀਮਤ ਪੱਧਰ ਵਿੱਚ ਲਗਾਤਾਰ ਘਟਾਅ"),
  "a fall in the inflation rate while the general price level may still be rising": lp("मुद्रास्फीति दर में कमी, जबकि सामान्य मूल्य स्तर फिर भी बढ़ सकता है", "ਮਹਿੰਗਾਈ ਦੀ ਦਰ ਵਿੱਚ ਘਟਾਅ, ਜਦੋਂ ਕਿ ਆਮ ਕੀਮਤ ਪੱਧਰ ਫਿਰ ਵੀ ਵੱਧ ਸਕਦਾ ਹੈ"),
  "the effect of the comparison-period price level on the measured inflation rate": lp("तुलना अवधि के मूल्य स्तर का मापी गई मुद्रास्फीति दर पर प्रभाव", "ਤੁਲਨਾ ਅਵਧੀ ਦੇ ਕੀਮਤ ਪੱਧਰ ਦਾ ਮਾਪੀ ਗਈ ਮਹਿੰਗਾਈ ਦਰ ਉੱਤੇ ਪ੍ਰਭਾਵ"),
  "Fall": lp("घटेगी", "ਘਟੇਗੀ"),
  "Rise": lp("बढ़ेगी", "ਵੱਧੇਗੀ"),
  "Stay unchanged": lp("अपरिवर्तित रहेगी", "ਬਦਲਾਅ ਨਹੀਂ ਹੋਵੇਗਾ"),
  "Stay exactly unchanged": lp("बिल्कुल अपरिवर्तित रहेगी", "ਬਿਲਕੁਲ ਬਦਲਾਅ ਨਹੀਂ ਹੋਵੇਗਾ"),
  "Double": lp("दोगुनी हो जाएगी", "ਦੁੱਗਣੀ ਹੋ ਜਾਵੇਗੀ"),
  "Become zero": lp("शून्य हो जाएगी", "ਸਿਫ਼ਰ ਹੋ ਜਾਵੇਗੀ"),
  "Become zero automatically": lp("अपने-आप शून्य हो जाएगी", "ਆਪਣੇ-ਆਪ ਸਿਫ਼ਰ ਹੋ ਜਾਵੇਗੀ"),
  "Equal the inflation rate": lp("मुद्रास्फीति दर के बराबर हो जाएगी", "ਮਹਿੰਗਾਈ ਦਰ ਦੇ ਬਰਾਬਰ ਹੋ ਜਾਵੇਗੀ"),
  "The fixed-income earner": lp("निश्चित आय वाला व्यक्ति", "ਨਿਸ਼ਚਿਤ ਆਮਦਨ ਵਾਲਾ ਵਿਅਕਤੀ"),
  "A fixed-rate borrower": lp("निश्चित ब्याज दर वाला उधारकर्ता", "ਨਿਸ਼ਚਿਤ ਵਿਆਜ ਦਰ ਵਾਲਾ ਕਰਜ਼ਦਾਰ"),
  "A seller whose price rises": lp("वह विक्रेता जिसकी कीमत बढ़ती है", "ਉਹ ਵਿਕਰੇਤਾ ਜਿਸਦੀ ਕੀਮਤ ਵੱਧਦੀ ਹੈ"),
  "No one": lp("कोई नहीं", "ਕੋਈ ਨਹੀਂ"),
  "The borrower": lp("उधारकर्ता", "ਕਰਜ਼ਦਾਰ"),
  "The lender": lp("ऋणदाता", "ਕਰਜ਼ ਦੇਣ ਵਾਲਾ"),
  "Both equally": lp("दोनों समान रूप से", "ਦੋਵੇਂ ਇਕਸਾਰ"),
  "Neither": lp("दोनों में से कोई नहीं", "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ"),
  "Lose in real terms": lp("वास्तविक रूप से नुकसान होगा", "ਅਸਲ ਮੁੱਲ ਵਿੱਚ ਨੁਕਸਾਨ ਹੋਵੇਗਾ"),
  "Gain in real terms": lp("वास्तविक रूप से लाभ होगा", "ਅਸਲ ਮੁੱਲ ਵਿੱਚ ਲਾਭ ਹੋਵੇਗਾ"),
  "Receive a higher real repayment automatically": lp("अपने-आप अधिक वास्तविक पुनर्भुगतान मिलेगा", "ਆਪਣੇ-ਆਪ ਵੱਧ ਅਸਲ ਵਾਪਸੀ ਮਿਲੇਗੀ"),
  "Be unaffected": lp("प्रभावित नहीं होगा", "ਪ੍ਰਭਾਵਿਤ ਨਹੀਂ ਹੋਵੇਗਾ"),
  "The borrower tends to gain and the lender tends to lose in real terms": lp("उधारकर्ता को वास्तविक रूप से लाभ और ऋणदाता को नुकसान होने की प्रवृत्ति रहती है", "ਕਰਜ਼ਦਾਰ ਨੂੰ ਅਸਲ ਰੂਪ ਵਿੱਚ ਲਾਭ ਅਤੇ ਕਰਜ਼ ਦੇਣ ਵਾਲੇ ਨੂੰ ਨੁਕਸਾਨ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਰਹਿੰਦੀ ਹੈ"),
  "The lender tends to gain and the borrower tends to lose in real terms": lp("ऋणदाता को वास्तविक रूप से लाभ और उधारकर्ता को नुकसान होने की प्रवृत्ति रहती है", "ਕਰਜ਼ ਦੇਣ ਵਾਲੇ ਨੂੰ ਅਸਲ ਰੂਪ ਵਿੱਚ ਲਾਭ ਅਤੇ ਕਰਜ਼ਦਾਰ ਨੂੰ ਨੁਕਸਾਨ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਰਹਿੰਦੀ ਹੈ"),
  "Both must gain equally": lp("दोनों को समान लाभ होना ही चाहिए", "ਦੋਵਾਂ ਨੂੰ ਇਕਸਾਰ ਲਾਭ ਹੋਣਾ ਹੀ ਚਾਹੀਦਾ ਹੈ"),
  "Inflation cannot affect fixed repayments in real terms": lp("मुद्रास्फीति निश्चित पुनर्भुगतान के वास्तविक मूल्य को प्रभावित नहीं कर सकती", "ਮਹਿੰਗਾਈ ਨਿਸ਼ਚਿਤ ਵਾਪਸੀ ਦੇ ਅਸਲ ਮੁੱਲ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਨਹੀਂ ਕਰ ਸਕਦੀ"),
  "WPI only": lp("केवल WPI", "ਸਿਰਫ਼ WPI"),
  "Core inflation excluding food and fuel": lp("Core inflation — खाद्य और ईंधन को छोड़कर", "Core inflation — ਖੁਰਾਕ ਅਤੇ ਇੰਧਨ ਨੂੰ ਛੱਡ ਕੇ"),
  "Neither measure": lp("दोनों में से कोई माप नहीं", "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਮਾਪ ਨਹੀਂ"),
  "GDP growth": lp("GDP वृद्धि", "GDP ਵਾਧਾ"),
  "To study underlying price pressure after excluding some volatile components": lp("कुछ अस्थिर घटकों को हटाकर अंतर्निहित मूल्य दबाव का अध्ययन करना", "ਕੁਝ ਅਸਥਿਰ ਘਟਕ ਹਟਾ ਕੇ ਅੰਦਰੂਨੀ ਕੀਮਤੀ ਦਬਾਅ ਦਾ ਅਧਿਐਨ ਕਰਨਾ"),
  "To measure only wholesale prices": lp("केवल थोक कीमतें मापना", "ਸਿਰਫ਼ ਥੋਕ ਕੀਮਤਾਂ ਮਾਪਣਾ"),
  "To remove all services from the price index": lp("मूल्य सूचकांक से सभी सेवाएँ हटाना", "ਕੀਮਤ ਸੂਚਕ ਤੋਂ ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ ਹਟਾਉਣਾ"),
  "To convert nominal GDP into GNP": lp("नाममात्र GDP को GNP में बदलना", "ਨਾਮਾਤਰ GDP ਨੂੰ GNP ਵਿੱਚ ਬਦਲਣਾ"),
  "CPI — household consumption prices": lp("CPI — घरेलू उपभोग की कीमतें", "CPI — ਘਰੇਲੂ ਖਪਤ ਦੀਆਂ ਕੀਮਤਾਂ"),
  "WPI — wholesale price movement": lp("WPI — थोक कीमतों की चाल", "WPI — ਥੋਕ ਕੀਮਤਾਂ ਦੀ ਚਾਲ"),
  "Core inflation — commonly excludes food and fuel": lp("Core inflation — सामान्यतः खाद्य और ईंधन को छोड़ती है", "Core inflation — ਆਮ ਤੌਰ ਤੇ ਖੁਰਾਕ ਅਤੇ ਇੰਧਨ ਨੂੰ ਬਾਹਰ ਰੱਖਦੀ ਹੈ"),
  "CPI — only wholesale prices": lp("CPI — केवल थोक कीमतें", "CPI — ਸਿਰਫ਼ ਥੋਕ ਕੀਮਤਾਂ"),
  "WPI — household services only": lp("WPI — केवल घरेलू सेवाएँ", "WPI — ਸਿਰਫ਼ ਘਰੇਲੂ ਸੇਵਾਵਾਂ"),
  "Deflation — a slower positive inflation rate": lp("अपस्फीति — धीमी सकारात्मक मुद्रास्फीति दर", "ਮੁੱਲ-ਘਟਾਅ — ਹੌਲੀ ਸਕਾਰਾਤਮਕ ਮਹਿੰਗਾਈ ਦਰ"),
  "I only": lp("केवल I", "ਸਿਰਫ਼ I"),
  "II only": lp("केवल II", "ਸਿਰਫ਼ II"),
  "Both I and II": lp("I और II दोनों", "I ਅਤੇ II ਦੋਵੇਂ"),
  "Neither I nor II": lp("न I, न II", "ਨਾ I, ਨਾ II"),

  "Labour force": lp("श्रम बल", "ਕਿਰਤ ਬਲ"),
  "Worker": lp("कामगार", "ਕਾਮਗਾਰ"),
  "Unemployed": lp("बेरोजगार", "ਬੇਰੋਜ਼ਗਾਰ"),
  "Total population": lp("कुल जनसंख्या", "ਕੁੱਲ ਆਬਾਦੀ"),
  "Employed persons only": lp("केवल नियोजित व्यक्ति", "ਸਿਰਫ਼ ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਵਿਅਕਤੀ"),
  "Working-age employers only": lp("केवल कार्य-आयु के नियोक्ता", "ਸਿਰਫ਼ ਕੰਮਕਾਜੀ ਉਮਰ ਦੇ ਨਿਯੋਤਾ"),
  "Self-employed": lp("स्व-नियोजित", "ਸਵੈ-ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ"),
  "Regular wage/salaried": lp("नियमित वेतन/वेतनभोगी", "ਨਿਯਮਿਤ ਮਜ਼ਦੂਰੀ/ਤਨਖਾਹਦਾਰ"),
  "Casual labour": lp("दिहाड़ी/आकस्मिक श्रमिक", "ਦਿਹਾੜੀ/ਆਕਸਮਿਕ ਮਜ਼ਦੂਰ"),
  "Seasonal unemployment": lp("मौसमी बेरोजगारी", "ਮੌਸਮੀ ਬੇਰੋਜ਼ਗਾਰੀ"),
  "Disguised unemployment": lp("प्रच्छन्न बेरोजगारी", "ਛੁਪੀ ਬੇਰੋਜ਼ਗਾਰੀ"),
  "Structural unemployment": lp("संरचनात्मक बेरोजगारी", "ਸੰਰਚਨਾਤਮਕ ਬੇਰੋਜ਼ਗਾਰੀ"),
  "Frictional unemployment": lp("घर्षणात्मक बेरोजगारी", "ਅੰਤਰਾਲੀ ਬੇਰੋਜ਼ਗਾਰੀ"),
  "Cyclical unemployment": lp("चक्रीय बेरोजगारी", "ਚੱਕਰੀ ਬੇਰੋਜ਼ਗਾਰੀ"),
  "Absolute poverty": lp("निरपेक्ष गरीबी", "ਨਿਰਪੇਖ ਗਰੀਬੀ"),
  "Relative poverty": lp("सापेक्ष गरीबी", "ਸਾਪੇਖ ਗਰੀਬੀ"),
  "Multidimensional poverty": lp("बहुआयामी गरीबी", "ਬਹੁ-ਆਯਾਮੀ ਗਰੀਬੀ"),
  "Poverty line": lp("गरीबी रेखा", "ਗਰੀਬੀ ਰੇਖਾ"),
  "Poverty headcount ratio": lp("Poverty headcount ratio", "Poverty headcount ratio"),
  "Headcount ratio": lp("Headcount ratio", "Headcount ratio"),
  "Unemployment rate": lp("बेरोजगारी दर", "ਬੇਰੋਜ਼ਗਾਰੀ ਦਰ"),
  "Worker population ratio": lp("कामगार-जनसंख्या अनुपात", "ਕਾਮਗਾਰ-ਆਬਾਦੀ ਅਨੁਪਾਤ"),
  "Labour force participation rate": lp("श्रम बल भागीदारी दर", "ਕਿਰਤ ਬਲ ਭਾਗੀਦਾਰੀ ਦਰ"),
  "Multidimensional poverty approach": lp("बहुआयामी गरीबी दृष्टिकोण", "ਬਹੁ-ਆਯਾਮੀ ਗਰੀਬੀ ਪਹੁੰਚ"),
  "Poverty headcount based only on one income threshold": lp("केवल एक आय सीमा पर आधारित Headcount ratio", "ਸਿਰਫ਼ ਇੱਕ ਆਮਦਨ ਹੱਦ ਉੱਤੇ ਆਧਾਰਿਤ Headcount ratio"),
  "To set a threshold for identifying the poor under a chosen method": lp("चुनी हुई पद्धति के तहत गरीबों की पहचान के लिए सीमा तय करना", "ਚੁਣੀ ਹੋਈ ਵਿਧੀ ਅਧੀਨ ਗਰੀਬਾਂ ਦੀ ਪਛਾਣ ਲਈ ਹੱਦ ਨਿਰਧਾਰਤ ਕਰਨਾ"),
  "To measure only unemployment": lp("केवल बेरोजगारी मापना", "ਸਿਰਫ਼ ਬੇਰੋਜ਼ਗਾਰੀ ਮਾਪਣਾ"),
  "To fix market prices": lp("बाज़ार कीमतें तय करना", "ਬਾਜ਼ਾਰ ਕੀਮਤਾਂ ਨਿਰਧਾਰਤ ਕਰਨਾ"),
  "To calculate GDP growth": lp("GDP वृद्धि की गणना करना", "GDP ਵਾਧੇ ਦੀ ਗਿਣਤੀ ਕਰਨਾ"),
  "MGNREGA": lp("MGNREGA", "MGNREGA"),
  "100 days": lp("100 दिन", "100 ਦਿਨ"),
  "50 days": lp("50 दिन", "50 ਦਿਨ"),
  "150 days": lp("150 दिन", "150 ਦਿਨ"),
  "365 days": lp("365 दिन", "365 ਦਿਨ"),
  "Economic growth plus targeted anti-poverty programmes": lp("आर्थिक वृद्धि के साथ लक्षित गरीबी-उन्मूलन कार्यक्रम", "ਆਰਥਿਕ ਵਾਧੇ ਨਾਲ ਨਿਸ਼ਾਨਾਬੱਧ ਗਰੀਬੀ-ਘਟਾਊ ਕਾਰਜਕ੍ਰਮ"),
  "Only higher taxes": lp("केवल अधिक कर", "ਸਿਰਫ਼ ਵੱਧ ਕਰ"),
  "Only price controls": lp("केवल मूल्य नियंत्रण", "ਸਿਰਫ਼ ਕੀਮਤ ਨਿਯੰਤਰਣ"),
  "Only foreign borrowing": lp("केवल विदेशी उधारी", "ਸਿਰਫ਼ ਵਿਦੇਸ਼ੀ ਕਰਜ਼ਾ"),
  "Y. K. Alagh Task Force": lp("Y. K. Alagh Task Force", "Y. K. Alagh Task Force"),
  "Lakdawala Expert Group": lp("Lakdawala Expert Group", "Lakdawala Expert Group"),
  "Tendulkar Expert Group": lp("Tendulkar Expert Group", "Tendulkar Expert Group"),
  "Rangarajan Expert Group": lp("Rangarajan Expert Group", "Rangarajan Expert Group"),
  "projections of minimum needs and effective consumption demand, including poverty-line estimation": lp("न्यूनतम आवश्यकताओं और प्रभावी उपभोग मांग के आकलन, जिसमें गरीबी रेखा का अनुमान भी शामिल है", "ਘੱਟੋ-ਘੱਟ ਲੋੜਾਂ ਅਤੇ ਪ੍ਰਭਾਵੀ ਖਪਤ ਮੰਗ ਦੇ ਅਨੁਮਾਨ, ਜਿਸ ਵਿੱਚ ਗਰੀਬੀ ਰੇਖਾ ਦਾ ਅੰਦਾਜ਼ਾ ਵੀ ਸ਼ਾਮਲ ਹੈ"),
  "estimation of the proportion and number of poor": lp("गरीबों के अनुपात और संख्या का अनुमान", "ਗਰੀਬਾਂ ਦੇ ਅਨੁਪਾਤ ਅਤੇ ਗਿਣਤੀ ਦਾ ਅੰਦਾਜ਼ਾ"),
  "review of the methodology for estimation of poverty": lp("गरीबी के अनुमान की पद्धति की समीक्षा", "ਗਰੀਬੀ ਦੇ ਅੰਦਾਜ਼ੇ ਦੀ ਵਿਧੀ ਦੀ ਸਮੀਖਿਆ"),
  "review of the methodology for measurement of poverty": lp("गरीबी मापन की पद्धति की समीक्षा", "ਗਰੀਬੀ ਮਾਪਣ ਦੀ ਵਿਧੀ ਦੀ ਸਮੀਖਿਆ"),
});

const CP5_STEMS: Readonly<Record<string, Pair>> = Object.freeze({
  "A sustained rise in the general price level is called:": lp("सामान्य मूल्य स्तर में लगातार वृद्धि को क्या कहा जाता है?", "ਆਮ ਕੀਮਤ ਪੱਧਰ ਵਿੱਚ ਲਗਾਤਾਰ ਵਾਧੇ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),
  "A sustained fall in the general price level is called:": lp("सामान्य मूल्य स्तर में लगातार गिरावट को क्या कहा जाता है?", "ਆਮ ਕੀਮਤ ਪੱਧਰ ਵਿੱਚ ਲਗਾਤਾਰ ਘਟਾਅ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),
  "The inflation rate falls but remains positive. This is called:": lp("मुद्रास्फीति दर घटती है लेकिन सकारात्मक रहती है। इसे क्या कहा जाता है?", "ਮਹਿੰਗਾਈ ਦੀ ਦਰ ਘਟਦੀ ਹੈ ਪਰ ਸਕਾਰਾਤਮਕ ਰਹਿੰਦੀ ਹੈ। ਇਸਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"),
  "Prices of many goods and services keep rising over time. This situation is:": lp("कई वस्तुओं और सेवाओं की कीमतें समय के साथ लगातार बढ़ती रहें, तो यह स्थिति क्या कहलाती है?", "ਕਈ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਦੀਆਂ ਕੀਮਤਾਂ ਸਮੇਂ ਨਾਲ ਲਗਾਤਾਰ ਵਧਣ, ਤਾਂ ਇਹ ਸਥਿਤੀ ਕੀ ਕਹਾਉਂਦੀ ਹੈ?"),
  "Prices rise while money income stays unchanged. Purchasing power will:": lp("कीमतें बढ़ें और मौद्रिक आय समान रहे, तो क्रय शक्ति क्या होगी?", "ਕੀਮਤਾਂ ਵਧਣ ਅਤੇ ਨਕਦੀ ਆਮਦਨ ਇੱਕੋ ਰਹੇ, ਤਾਂ ਖਰੀਦ ਸ਼ਕਤੀ ਕੀ ਹੋਵੇਗੀ?"),
  "The general price level falls while money income stays unchanged. Purchasing power will:": lp("सामान्य मूल्य स्तर घटे और मौद्रिक आय समान रहे, तो क्रय शक्ति क्या होगी?", "ਆਮ ਕੀਮਤ ਪੱਧਰ ਘਟੇ ਅਤੇ ਨਕਦੀ ਆਮਦਨ ਇੱਕੋ ਰਹੇ, ਤਾਂ ਖਰੀਦ ਸ਼ਕਤੀ ਕੀ ਹੋਵੇਗੀ?"),
  "A pension stays fixed while prices keep rising. The pensioner's real purchasing power will generally:": lp("पेंशन स्थिर रहे और कीमतें बढ़ती रहें, तो पेंशनभोगी की वास्तविक क्रय शक्ति सामान्यतः क्या होगी?", "ਪੈਨਸ਼ਨ ਨਿਸ਼ਚਿਤ ਰਹੇ ਅਤੇ ਕੀਮਤਾਂ ਵਧਦੀਆਂ ਰਹਿਣ, ਤਾਂ ਪੈਨਸ਼ਨਰ ਦੀ ਅਸਲ ਖਰੀਦ ਸ਼ਕਤੀ ਆਮ ਤੌਰ ਤੇ ਕੀ ਹੋਵੇਗੀ?"),
  "Money income rises by less than the general price level. Real purchasing power will generally:": lp("मौद्रिक आय की वृद्धि सामान्य मूल्य स्तर की वृद्धि से कम हो, तो वास्तविक क्रय शक्ति सामान्यतः क्या होगी?", "ਨਕਦੀ ਆਮਦਨ ਦਾ ਵਾਧਾ ਆਮ ਕੀਮਤ ਪੱਧਰ ਦੇ ਵਾਧੇ ਤੋਂ ਘੱਟ ਹੋਵੇ, ਤਾਂ ਅਸਲ ਖਰੀਦ ਸ਼ਕਤੀ ਆਮ ਤੌਰ ਤੇ ਕੀ ਹੋਵੇਗੀ?"),
  "A fixed salary is not adjusted while unexpected inflation rises. Who is directly hurt?": lp("अप्रत्याशित मुद्रास्फीति बढ़े और निश्चित वेतन न बदले, तो सीधे किसे नुकसान होता है?", "ਅਚਾਨਕ ਮਹਿੰਗਾਈ ਵਧੇ ਅਤੇ ਨਿਸ਼ਚਿਤ ਤਨਖਾਹ ਨਾ ਬਦਲੇ, ਤਾਂ ਸਿੱਧਾ ਨੁਕਸਾਨ ਕਿਸ ਨੂੰ ਹੁੰਦਾ ਹੈ?"),
  "Unexpected inflation occurs after a fixed-rate loan is made. Other things equal, who tends to benefit?": lp("निश्चित दर का ऋण दिए जाने के बाद अप्रत्याशित मुद्रास्फीति हो, तो अन्य बातें समान रहने पर किसे लाभ होता है?", "ਨਿਸ਼ਚਿਤ ਦਰ ਦਾ ਕਰਜ਼ਾ ਹੋਣ ਤੋਂ ਬਾਅਦ ਅਚਾਨਕ ਮਹਿੰਗਾਈ ਆਵੇ, ਤਾਂ ਹੋਰ ਗੱਲਾਂ ਇੱਕੋ ਰਹਿਣ ਤੇ ਕਿਸ ਨੂੰ ਲਾਭ ਹੁੰਦਾ ਹੈ?"),
  "A lender will receive fixed rupee repayments. Unexpected inflation is higher than expected. The lender tends to:": lp("ऋणदाता को निश्चित रुपये में भुगतान मिलना है और अप्रत्याशित मुद्रास्फीति अपेक्षा से अधिक है। ऋणदाता पर क्या प्रभाव पड़ेगा?", "ਕਰਜ਼ ਦੇਣ ਵਾਲੇ ਨੂੰ ਨਿਸ਼ਚਿਤ ਰੁਪਏ ਵਿੱਚ ਵਾਪਸੀ ਮਿਲਣੀ ਹੈ ਅਤੇ ਅਚਾਨਕ ਮਹਿੰਗਾਈ ਉਮੀਦ ਤੋਂ ਵੱਧ ਹੈ। ਉਸ ਉੱਤੇ ਕੀ ਪ੍ਰਭਾਵ ਪਵੇਗਾ?"),
  "A fixed-rate loan is agreed before an unexpected rise in inflation. Which statement is most accurate?": lp("अप्रत्याशित मुद्रास्फीति बढ़ने से पहले निश्चित दर का ऋण तय हो चुका है। कौन-सा कथन सबसे सही है?", "ਅਚਾਨਕ ਮਹਿੰਗਾਈ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ ਨਿਸ਼ਚਿਤ ਦਰ ਦਾ ਕਰਜ਼ਾ ਤੈਅ ਹੋ ਚੁੱਕਾ ਹੈ। ਕਿਹੜਾ ਬਿਆਨ ਸਭ ਤੋਂ ਸਹੀ ਹੈ?"),
  "Which index tracks prices of a household consumption basket?": lp("घरेलू उपभोग टोकरी की कीमतों को कौन-सा सूचकांक मापता है?", "ਘਰੇਲੂ ਖਪਤ ਟੋਕਰੀ ਦੀਆਂ ਕੀਮਤਾਂ ਨੂੰ ਕਿਹੜਾ ਸੂਚਕ ਮਾਪਦਾ ਹੈ?"),
  "Which index tracks price movement at the wholesale level?": lp("थोक स्तर पर कीमतों की चाल को कौन-सा सूचकांक मापता है?", "ਥੋਕ ਪੱਧਰ ਉੱਤੇ ਕੀਮਤਾਂ ਦੀ ਚਾਲ ਨੂੰ ਕਿਹੜਾ ਸੂਚਕ ਮਾਪਦਾ ਹੈ?"),
  "Which measure covers price change for final goods and services included in GDP?": lp("GDP में शामिल अंतिम वस्तुओं और सेवाओं के मूल्य परिवर्तन को कौन-सा माप कवर करता है?", "GDP ਵਿੱਚ ਸ਼ਾਮਲ ਅੰਤਿਮ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਦੀ ਕੀਮਤ ਬਦਲਾਅ ਨੂੰ ਕਿਹੜਾ ਮਾਪ ਕਵਰ ਕਰਦਾ ਹੈ?"),
  "Which statement is correct about CPI, WPI and the GDP deflator?": lp("CPI, WPI और GDP deflator के बारे में कौन-सा कथन सही है?", "CPI, WPI ਅਤੇ GDP deflator ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?"),
  "Inflation measured using the full CPI basket is usually called:": lp("पूरी CPI टोकरी से मापी गई मुद्रास्फीति सामान्यतः क्या कहलाती है?", "ਪੂਰੀ CPI ਟੋਕਰੀ ਨਾਲ ਮਾਪੀ ਮਹਿੰਗਾਈ ਆਮ ਤੌਰ ਤੇ ਕੀ ਕਹਾਉਂਦੀ ਹੈ?"),
  "CPI inflation excluding food and fuel is commonly used as a measure of:": lp("खाद्य और ईंधन को छोड़कर CPI मुद्रास्फीति सामान्यतः किसका माप मानी जाती है?", "ਖੁਰਾਕ ਅਤੇ ਇੰਧਨ ਤੋਂ ਬਿਨਾਂ CPI ਮਹਿੰਗਾਈ ਆਮ ਤੌਰ ਤੇ ਕਿਸ ਦਾ ਮਾਪ ਮੰਨੀ ਜਾਂਦੀ ਹੈ?"),
  "Food prices jump sharply while other prices change little. Which measure is more directly affected?": lp("खाद्य कीमतें तेज़ी से बढ़ें और अन्य कीमतों में कम बदलाव हो, तो कौन-सा माप सीधे अधिक प्रभावित होगा?", "ਖੁਰਾਕ ਦੀਆਂ ਕੀਮਤਾਂ ਤੇਜ਼ੀ ਨਾਲ ਵਧਣ ਅਤੇ ਹੋਰ ਕੀਮਤਾਂ ਵਿੱਚ ਘੱਟ ਬਦਲਾਅ ਹੋਵੇ, ਤਾਂ ਕਿਹੜਾ ਮਾਪ ਸਿੱਧਾ ਵੱਧ ਪ੍ਰਭਾਵਿਤ ਹੋਵੇਗਾ?"),
  "Why is core inflation examined separately from headline inflation?": lp("Core inflation को Headline inflation से अलग क्यों देखा जाता है?", "Core inflation ਨੂੰ Headline inflation ਤੋਂ ਵੱਖ ਕਿਉਂ ਦੇਖਿਆ ਜਾਂਦਾ ਹੈ?"),
  "Which pair is correctly matched?": lp("कौन-सा युग्म सही सुमेलित है?", "ਕਿਹੜਾ ਜੋੜ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?"),
  "Inflation falls from 8% to 5%, but prices are still rising. This is:": lp("मुद्रास्फीति 8% से घटकर 5% हो जाए, लेकिन कीमतें अभी भी बढ़ रही हों, तो यह क्या है?", "ਮਹਿੰਗਾਈ 8% ਤੋਂ ਘਟ ਕੇ 5% ਹੋ ਜਾਵੇ ਪਰ ਕੀਮਤਾਂ ਅਜੇ ਵੀ ਵੱਧ ਰਹੀਆਂ ਹੋਣ, ਤਾਂ ਇਹ ਕੀ ਹੈ?"),
  "Which statement correctly distinguishes deflation from disinflation?": lp("अपस्फीति और मुद्रास्फीति-दर में कमी के बीच सही अंतर कौन-सा कथन बताता है?", "ਮੁੱਲ-ਘਟਾਅ ਅਤੇ ਮਹਿੰਗਾਈ ਦੀ ਦਰ ਵਿੱਚ ਕਮੀ ਵਿਚਲਾ ਸਹੀ ਫ਼ਰਕ ਕਿਹੜਾ ਬਿਆਨ ਦੱਸਦਾ ਹੈ?"),
  "A high inflation reading partly reflects an unusually low price level in the comparison period. This illustrates:": lp("ऊँची मुद्रास्फीति का आँकड़ा आंशिक रूप से तुलना अवधि के असामान्य रूप से कम मूल्य स्तर के कारण हो, तो यह किसे दर्शाता है?", "ਉੱਚੀ ਮਹਿੰਗਾਈ ਦਾ ਅੰਕੜਾ ਕੁਝ ਹੱਦ ਤੱਕ ਤੁਲਨਾ ਅਵਧੀ ਦੇ ਅਸਧਾਰਣ ਤੌਰ ਤੇ ਘੱਟ ਕੀਮਤ ਪੱਧਰ ਕਾਰਨ ਹੋਵੇ, ਤਾਂ ਇਹ ਕਿਸ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?"),
  "Two periods have the same current price increase but different inflation rates because their comparison bases differ. This is mainly due to:": lp("दो अवधियों में वर्तमान मूल्य वृद्धि समान हो, लेकिन तुलना आधार अलग होने से मुद्रास्फीति दर अलग हो, तो मुख्य कारण क्या है?", "ਦੋ ਅਵਧੀਆਂ ਵਿੱਚ ਮੌਜੂਦਾ ਕੀਮਤ ਵਾਧਾ ਇੱਕੋ ਹੋਵੇ ਪਰ ਤੁਲਨਾ ਅਧਾਰ ਵੱਖ ਹੋਣ ਕਰਕੇ ਮਹਿੰਗਾਈ ਦਰ ਵੱਖ ਹੋਵੇ, ਤਾਂ ਮੁੱਖ ਕਾਰਨ ਕੀ ਹੈ?"),
});

const CP5_SCENARIOS: Readonly<Record<string, Pair>> = Object.freeze({
  "Household and business spending rises strongly while output cannot increase quickly.": lp("घरेलू और व्यावसायिक खर्च तेज़ी से बढ़ता है, जबकि उत्पादन जल्दी नहीं बढ़ सकता।", "ਘਰੇਲੂ ਅਤੇ ਕਾਰੋਬਾਰੀ ਖਰਚ ਤੇਜ਼ੀ ਨਾਲ ਵਧਦਾ ਹੈ, ਜਦੋਂ ਕਿ ਉਤਪਾਦਨ ਜਲਦੀ ਨਹੀਂ ਵੱਧ ਸਕਦਾ।"),
  "Total demand rises sharply in an economy already operating near full capacity.": lp("लगभग पूर्ण क्षमता पर चल रही अर्थव्यवस्था में कुल मांग तेज़ी से बढ़ती है।", "ਲਗਭਗ ਪੂਰੀ ਸਮਰੱਥਾ ਉੱਤੇ ਚੱਲ ਰਹੀ ਅਰਥਵਿਵਸਥਾ ਵਿੱਚ ਕੁੱਲ ਮੰਗ ਤੇਜ਼ੀ ਨਾਲ ਵਧਦੀ ਹੈ।"),
  "Consumers and firms increase spending faster than producers can expand supply.": lp("उपभोक्ता और फर्में खर्च को उस गति से बढ़ाते हैं, जितनी जल्दी उत्पादक आपूर्ति नहीं बढ़ा सकते।", "ਖਪਤਕਾਰ ਅਤੇ ਫਰਮਾਂ ਖਰਚ ਉਸ ਗਤੀ ਨਾਲ ਵਧਾਉਂਦੀਆਂ ਹਨ ਜਿੰਨੀ ਜਲਦੀ ਉਤਪਾਦਕ ਪੂਰਤੀ ਨਹੀਂ ਵਧਾ ਸਕਦੇ।"),
  "Fuel and transport costs rise sharply, increasing production costs across many industries.": lp("ईंधन और परिवहन लागत तेज़ी से बढ़ती है, जिससे कई उद्योगों की उत्पादन लागत बढ़ती है।", "ਇੰਧਨ ਅਤੇ ਆਵਾਜਾਈ ਲਾਗਤ ਤੇਜ਼ੀ ਨਾਲ ਵਧਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਕਈ ਉਦਯੋਗਾਂ ਦੀ ਉਤਪਾਦਨ ਲਾਗਤ ਵਧਦੀ ਹੈ।"),
  "A supply disruption makes a key industrial input much more expensive.": lp("आपूर्ति बाधा से एक प्रमुख औद्योगिक इनपुट बहुत महँगा हो जाता है।", "ਪੂਰਤੀ ਵਿੱਚ ਰੁਕਾਵਟ ਨਾਲ ਇੱਕ ਮੁੱਖ ਉਦਯੋਗਿਕ ਇਨਪੁੱਟ ਬਹੁਤ ਮਹਿੰਗਾ ਹੋ ਜਾਂਦਾ ਹੈ।"),
  "Widespread input costs rise even though demand has not increased.": lp("मांग न बढ़ने के बावजूद व्यापक इनपुट लागत बढ़ती है।", "ਮੰਗ ਨਾ ਵਧਣ ਦੇ ਬਾਵਜੂਦ ਵਿਆਪਕ ਇਨਪੁੱਟ ਲਾਗਤ ਵਧਦੀ ਹੈ।"),
});

const CP5_STATEMENTS: Readonly<Record<string, Pair>> = Object.freeze({
  "Inflation reduces purchasing power if money income does not keep pace with prices.": lp("यदि मौद्रिक आय कीमतों के साथ नहीं बढ़ती, तो मुद्रास्फीति क्रय शक्ति घटाती है।", "ਜੇ ਨਕਦੀ ਆਮਦਨ ਕੀਮਤਾਂ ਦੇ ਨਾਲ ਨਹੀਂ ਵਧਦੀ, ਤਾਂ ਮਹਿੰਗਾਈ ਖਰੀਦ ਸ਼ਕਤੀ ਘਟਾਉਂਦੀ ਹੈ।"),
  "Deflation means a sustained fall in the general price level.": lp("अपस्फीति का अर्थ सामान्य मूल्य स्तर में लगातार गिरावट है।", "ਮੁੱਲ-ਘਟਾਅ ਦਾ ਅਰਥ ਆਮ ਕੀਮਤ ਪੱਧਰ ਵਿੱਚ ਲਗਾਤਾਰ ਘਟਾਅ ਹੈ।"),
  "Disinflation means inflation has slowed.": lp("Disinflation का अर्थ है कि मुद्रास्फीति की दर धीमी हुई है।", "Disinflation ਦਾ ਅਰਥ ਹੈ ਕਿ ਮਹਿੰਗਾਈ ਦੀ ਦਰ ਹੌਲੀ ਹੋਈ ਹੈ।"),
  "Disinflation necessarily means the general price level is falling.": lp("Disinflation का अर्थ हमेशा सामान्य मूल्य स्तर का गिरना है।", "Disinflation ਦਾ ਅਰਥ ਹਮੇਸ਼ਾਂ ਆਮ ਕੀਮਤ ਪੱਧਰ ਦਾ ਘਟਣਾ ਹੈ।"),
  "Cost-push inflation can follow a broad rise in input costs.": lp("इनपुट लागत में व्यापक वृद्धि से Cost-push inflation हो सकती है।", "ਇਨਪੁੱਟ ਲਾਗਤ ਵਿੱਚ ਵਿਆਪਕ ਵਾਧੇ ਨਾਲ Cost-push inflation ਹੋ ਸਕਦੀ ਹੈ।"),
  "Demand-pull inflation can arise when demand grows faster than available output.": lp("उपलब्ध उत्पादन से तेज़ मांग बढ़ने पर Demand-pull inflation हो सकती है।", "ਉਪਲਬਧ ਉਤਪਾਦਨ ਤੋਂ ਤੇਜ਼ ਮੰਗ ਵਧਣ ਤੇ Demand-pull inflation ਹੋ ਸਕਦੀ ਹੈ।"),
});

const CP5_LONG: Readonly<Record<string, Pair>> = Object.freeze({
  "CPI focuses on household consumption, WPI on wholesale prices, and the GDP deflator on output covered by GDP": lp("CPI घरेलू उपभोग, WPI थोक कीमतों और GDP deflator GDP में शामिल उत्पादन की कीमतों पर केंद्रित होता है", "CPI ਘਰੇਲੂ ਖਪਤ, WPI ਥੋਕ ਕੀਮਤਾਂ ਅਤੇ GDP deflator GDP ਵਿੱਚ ਸ਼ਾਮਲ ਉਤਪਾਦਨ ਦੀਆਂ ਕੀਮਤਾਂ ਉੱਤੇ ਕੇਂਦ੍ਰਿਤ ਹੁੰਦਾ ਹੈ"),
  "CPI measures only wholesale goods, while WPI measures household services": lp("CPI केवल थोक वस्तुएँ मापता है, जबकि WPI घरेलू सेवाएँ मापता है", "CPI ਸਿਰਫ਼ ਥੋਕ ਵਸਤੂਆਂ ਮਾਪਦਾ ਹੈ, ਜਦੋਂ ਕਿ WPI ਘਰੇਲੂ ਸੇਵਾਵਾਂ ਮਾਪਦਾ ਹੈ"),
  "WPI and GDP deflator always cover exactly the same basket": lp("WPI और GDP deflator हमेशा बिल्कुल एक ही टोकरी को कवर करते हैं", "WPI ਅਤੇ GDP deflator ਹਮੇਸ਼ਾਂ ਬਿਲਕੁਲ ਇੱਕੋ ਟੋਕਰੀ ਨੂੰ ਕਵਰ ਕਰਦੇ ਹਨ"),
  "GDP deflator measures only imported consumer goods": lp("GDP deflator केवल आयातित उपभोक्ता वस्तुएँ मापता है", "GDP deflator ਸਿਰਫ਼ ਆਯਾਤ ਕੀਤੀਆਂ ਖਪਤਕਾਰ ਵਸਤੂਆਂ ਮਾਪਦਾ ਹੈ"),
  "Deflation means the price level falls; disinflation means inflation slows": lp("अपस्फीति में मूल्य स्तर गिरता है; Disinflation में कीमतों की वृद्धि धीमी होती है", "ਮੁੱਲ-ਘਟਾਅ ਵਿੱਚ ਕੀਮਤ ਪੱਧਰ ਘਟਦਾ ਹੈ; Disinflation ਵਿੱਚ ਕੀਮਤਾਂ ਦਾ ਵਾਧਾ ਹੌਲਾ ਹੁੰਦਾ ਹੈ"),
  "Deflation and disinflation always mean the same thing": lp("अपस्फीति और Disinflation हमेशा एक ही बात हैं", "ਮੁੱਲ-ਘਟਾਅ ਅਤੇ Disinflation ਹਮੇਸ਼ਾਂ ਇੱਕੋ ਗੱਲ ਹਨ"),
  "Deflation means prices rise faster; disinflation means prices fall to zero": lp("अपस्फीति में कीमतें तेज़ बढ़ती हैं; Disinflation में कीमतें शून्य हो जाती हैं", "ਮੁੱਲ-ਘਟਾਅ ਵਿੱਚ ਕੀਮਤਾਂ ਤੇਜ਼ ਵਧਦੀਆਂ ਹਨ; Disinflation ਵਿੱਚ ਕੀਮਤਾਂ ਸਿਫ਼ਰ ਹੋ ਜਾਂਦੀਆਂ ਹਨ"),
  "Disinflation can occur only when inflation is negative": lp("Disinflation केवल नकारात्मक मुद्रास्फीति में हो सकती है", "Disinflation ਸਿਰਫ਼ ਨਕਾਰਾਤਮਕ ਮਹਿੰਗਾਈ ਵਿੱਚ ਹੋ ਸਕਦੀ ਹੈ"),
});

const CP6_STEMS: Readonly<Record<string, Pair>> = Object.freeze({
  "Employed persons plus unemployed persons available for work make up the:": lp("नियोजित व्यक्तियों और काम के लिए उपलब्ध बेरोजगार व्यक्तियों का कुल समूह क्या कहलाता है?", "ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਵਿਅਕਤੀਆਂ ਅਤੇ ਕੰਮ ਲਈ ਉਪਲਬਧ ਬੇਰੋਜ਼ਗਾਰ ਵਿਅਕਤੀਆਂ ਦਾ ਕੁੱਲ ਸਮੂਹ ਕੀ ਕਹਾਉਂਦਾ ਹੈ?"),
  "A person engaged in an economic activity for production of goods or services is a:": lp("वस्तुओं या सेवाओं के उत्पादन की आर्थिक गतिविधि में लगा व्यक्ति क्या कहलाता है?", "ਵਸਤੂਆਂ ਜਾਂ ਸੇਵਾਵਾਂ ਦੇ ਉਤਪਾਦਨ ਦੀ ਆਰਥਿਕ ਗਤੀਵਿਧੀ ਵਿੱਚ ਲੱਗਿਆ ਵਿਅਕਤੀ ਕੀ ਕਹਾਉਂਦਾ ਹੈ?"),
  "A person has no work but is available for work under the survey definition. The person is:": lp("सर्वेक्षण की परिभाषा के अनुसार किसी व्यक्ति के पास काम नहीं है लेकिन वह काम के लिए उपलब्ध है। वह क्या कहलाएगा?", "ਸਰਵੇਖਣ ਦੀ ਪਰਿਭਾਸ਼ਾ ਅਨੁਸਾਰ ਕਿਸੇ ਵਿਅਕਤੀ ਕੋਲ ਕੰਮ ਨਹੀਂ ਹੈ ਪਰ ਉਹ ਕੰਮ ਲਈ ਉਪਲਬਧ ਹੈ। ਉਹ ਕੀ ਕਹਾਏਗਾ?"),
  "Which group includes both employed and unemployed persons available for work?": lp("कौन-सा समूह नियोजित और काम के लिए उपलब्ध बेरोजगार दोनों को शामिल करता है?", "ਕਿਹੜਾ ਸਮੂਹ ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਅਤੇ ਕੰਮ ਲਈ ਉਪਲਬਧ ਬੇਰੋਜ਼ਗਾਰ ਦੋਵਾਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਦਾ ਹੈ?"),
  "The unemployment rate is calculated as unemployed persons divided by:": lp("बेरोजगारी दर में बेरोजगार व्यक्तियों की संख्या को किससे भाग दिया जाता है?", "ਬੇਰੋਜ਼ਗਾਰੀ ਦਰ ਵਿੱਚ ਬੇਰੋਜ਼ਗਾਰ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਕਿਸ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ?"),
  "A population has 60 persons in the labour force out of 100 persons. LFPR is:": lp("100 व्यक्तियों में 60 श्रम बल में हैं। LFPR कितना है?", "100 ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ 60 ਕਿਰਤ ਬਲ ਵਿੱਚ ਹਨ। LFPR ਕਿੰਨਾ ਹੈ?"),
  "Out of 100 persons, 55 are employed. WPR is:": lp("100 व्यक्तियों में 55 नियोजित हैं। WPR कितना है?", "100 ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ 55 ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਹਨ। WPR ਕਿੰਨਾ ਹੈ?"),
  "A labour force has 72 employed and 8 unemployed persons. The unemployment rate is:": lp("श्रम बल में 72 नियोजित और 8 बेरोजगार व्यक्ति हैं। बेरोजगारी दर कितनी है?", "ਕਿਰਤ ਬਲ ਵਿੱਚ 72 ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਅਤੇ 8 ਬੇਰੋਜ਼ਗਾਰ ਵਿਅਕਤੀ ਹਨ। ਬੇਰੋਜ਼ਗਾਰੀ ਦਰ ਕਿੰਨੀ ਹੈ?"),
  "A farm worker gets work during sowing and harvesting but remains without work in the off-season. This is:": lp("एक खेत मजदूर को बुवाई और कटाई के समय काम मिलता है, लेकिन ऑफ-सीजन में काम नहीं मिलता। यह कौन-सी बेरोजगारी है?", "ਇੱਕ ਖੇਤ ਮਜ਼ਦੂਰ ਨੂੰ ਬਿਜਾਈ ਅਤੇ ਕਟਾਈ ਵੇਲੇ ਕੰਮ ਮਿਲਦਾ ਹੈ ਪਰ ਆਫ਼-ਸੀਜ਼ਨ ਵਿੱਚ ਕੰਮ ਨਹੀਂ ਮਿਲਦਾ। ਇਹ ਕਿਹੜੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹੈ?"),
  "A worker in a seasonal sugar mill loses work when the crushing season ends. This is:": lp("मौसमी चीनी मिल में पेराई का मौसम खत्म होने पर कामगार का काम समाप्त हो जाता है। यह कौन-सी बेरोजगारी है?", "ਮੌਸਮੀ ਖੰਡ ਮਿੱਲ ਵਿੱਚ ਪੀੜਾਈ ਦਾ ਮੌਸਮ ਮੁੱਕਣ ਤੇ ਕਾਮਗਾਰ ਦਾ ਕੰਮ ਖਤਮ ਹੋ ਜਾਂਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹੈ?"),
  "A tourism worker regularly finds no work during the local off-season. Which type of unemployment best fits?": lp("पर्यटन कामगार को स्थानीय ऑफ-सीजन में नियमित रूप से काम नहीं मिलता। यह किस प्रकार की बेरोजगारी है?", "ਸੈਰ-ਸਪਾਟਾ ਕਾਮਗਾਰ ਨੂੰ ਸਥਾਨਕ ਆਫ਼-ਸੀਜ਼ਨ ਵਿੱਚ ਨਿਯਮਿਤ ਤੌਰ ਤੇ ਕੰਮ ਨਹੀਂ ਮਿਲਦਾ। ਇਹ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹੈ?"),
  "Six family members work on a small farm, but output would stay the same if two stopped working. This shows:": lp("छोटे खेत पर परिवार के छह सदस्य काम करते हैं, लेकिन दो के हटने पर भी उत्पादन समान रहेगा। यह क्या दर्शाता है?", "ਛੋਟੇ ਖੇਤ ਉੱਤੇ ਪਰਿਵਾਰ ਦੇ ਛੇ ਮੈਂਬਰ ਕੰਮ ਕਰਦੇ ਹਨ ਪਰ ਦੋ ਦੇ ਹਟਣ ਤੇ ਵੀ ਉਤਪਾਦਨ ਇੱਕੋ ਰਹੇਗਾ। ਇਹ ਕੀ ਦਰਸਾਉਂਦਾ ਹੈ?"),
  "A shop uses five family workers even though three can handle the same work without reducing output. This is:": lp("एक दुकान में परिवार के पाँच लोग काम करते हैं, जबकि तीन लोग भी बिना उत्पादन घटाए वही काम कर सकते हैं। यह क्या है?", "ਇੱਕ ਦੁਕਾਨ ਵਿੱਚ ਪਰਿਵਾਰ ਦੇ ਪੰਜ ਲੋਕ ਕੰਮ ਕਰਦੇ ਹਨ, ਜਦੋਂ ਕਿ ਤਿੰਨ ਲੋਕ ਵੀ ਬਿਨਾਂ ਉਤਪਾਦਨ ਘਟਾਏ ਉਹੀ ਕੰਮ ਕਰ ਸਕਦੇ ਹਨ। ਇਹ ਕੀ ਹੈ?"),
  "Workers appear employed, but the marginal contribution of some of them is effectively zero. Which unemployment type is indicated?": lp("कामगार नियोजित दिखते हैं, लेकिन उनमें से कुछ का सीमांत योगदान लगभग शून्य है। यह किस प्रकार की बेरोजगारी है?", "ਕਾਮਗਾਰ ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਦਿਖਦੇ ਹਨ ਪਰ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੁਝ ਦਾ ਸੀਮਾਂਤ ਯੋਗਦਾਨ ਲਗਭਗ ਸਿਫ਼ਰ ਹੈ। ਇਹ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹੈ?"),
  "A worker leaves one job and spends a short period searching for a better one. This is:": lp("एक कामगार नौकरी छोड़कर थोड़े समय तक बेहतर नौकरी खोजता है। यह कौन-सी बेरोजगारी है?", "ਇੱਕ ਕਾਮਗਾਰ ਨੌਕਰੀ ਛੱਡ ਕੇ ਕੁਝ ਸਮੇਂ ਲਈ ਵਧੀਆ ਨੌਕਰੀ ਲੱਭਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹੈ?"),
  "Factories adopt new technology, but some workers do not have the skills required for the new jobs. This is:": lp("कारखाने नई तकनीक अपनाते हैं, लेकिन कुछ कामगारों के पास नई नौकरियों के लिए आवश्यक कौशल नहीं हैं। यह कौन-सी बेरोजगारी है?", "ਫੈਕਟਰੀਆਂ ਨਵੀਂ ਤਕਨੀਕ ਅਪਣਾਉਂਦੀਆਂ ਹਨ ਪਰ ਕੁਝ ਕਾਮਗਾਰਾਂ ਕੋਲ ਨਵੀਆਂ ਨੌਕਰੀਆਂ ਲਈ ਲੋੜੀਂਦੇ ਹੁਨਰ ਨਹੀਂ ਹਨ। ਇਹ ਕਿਹੜੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹੈ?"),
  "A recession reduces overall demand and firms lay off workers across many industries. This is:": lp("मंदी से कुल मांग घटती है और कई उद्योगों में फर्में कामगारों को निकालती हैं। यह कौन-सी बेरोजगारी है?", "ਮੰਦੀ ਨਾਲ ਕੁੱਲ ਮੰਗ ਘਟਦੀ ਹੈ ਅਤੇ ਕਈ ਉਦਯੋਗਾਂ ਵਿੱਚ ਫਰਮਾਂ ਕਾਮਗਾਰਾਂ ਨੂੰ ਕੱਢਦੀਆਂ ਹਨ। ਇਹ ਕਿਹੜੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹੈ?"),
  "Jobs exist, but unemployed workers are trained for occupations that employers no longer need. Which type best fits?": lp("नौकरियाँ उपलब्ध हैं, लेकिन बेरोजगार कामगार उन पेशों के लिए प्रशिक्षित हैं जिनकी अब मांग नहीं है। कौन-सी बेरोजगारी सबसे उपयुक्त है?", "ਨੌਕਰੀਆਂ ਮੌਜੂਦ ਹਨ ਪਰ ਬੇਰੋਜ਼ਗਾਰ ਕਾਮਗਾਰ ਉਹਨਾਂ ਪੇਸ਼ਿਆਂ ਲਈ ਤਿਆਰ ਹਨ ਜਿਨ੍ਹਾਂ ਦੀ ਹੁਣ ਮੰਗ ਨਹੀਂ ਹੈ। ਕਿਹੜੀ ਬੇਰੋਜ਼ਗਾਰੀ ਸਭ ਤੋਂ ਠੀਕ ਹੈ?"),
  "Poverty judged against a minimum level needed for basic needs is:": lp("मूल आवश्यकताओं के लिए जरूरी न्यूनतम स्तर के आधार पर आँकी गई गरीबी क्या कहलाती है?", "ਮੁੱਢਲੀਆਂ ਲੋੜਾਂ ਲਈ ਲੋੜੀਂਦੇ ਘੱਟੋ-ਘੱਟ ਪੱਧਰ ਦੇ ਆਧਾਰ ਤੇ ਮਾਪੀ ਗਰੀਬੀ ਕੀ ਕਹਾਉਂਦੀ ਹੈ?"),
  "Poverty judged by comparing a person's resources with others in the same society is:": lp("उसी समाज के अन्य लोगों से संसाधनों की तुलना करके आँकी गई गरीबी क्या कहलाती है?", "ਉਸੇ ਸਮਾਜ ਦੇ ਹੋਰ ਲੋਕਾਂ ਨਾਲ ਸਰੋਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰਕੇ ਮਾਪੀ ਗਰੀਬੀ ਕੀ ਕਹਾਉਂਦੀ ਹੈ?"),
  "A poverty measure combines deprivations in health, education and living standards. This is:": lp("गरीबी का माप स्वास्थ्य, शिक्षा और जीवन स्तर की वंचनाओं को जोड़ता है। यह कौन-सी गरीबी है?", "ਗਰੀਬੀ ਦਾ ਮਾਪ ਸਿਹਤ, ਸਿੱਖਿਆ ਅਤੇ ਜੀਵਨ ਪੱਧਰ ਦੀਆਂ ਵੰਚਨਾਵਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਗਰੀਬੀ ਹੈ?"),
  "A threshold used to identify people or households considered poor under a chosen method is called:": lp("चुनी हुई पद्धति में गरीब माने जाने वाले लोगों या परिवारों की पहचान के लिए प्रयुक्त सीमा क्या कहलाती है?", "ਚੁਣੀ ਹੋਈ ਵਿਧੀ ਵਿੱਚ ਗਰੀਬ ਮੰਨੇ ਜਾਣ ਵਾਲੇ ਲੋਕਾਂ ਜਾਂ ਪਰਿਵਾਰਾਂ ਦੀ ਪਛਾਣ ਲਈ ਵਰਤੀ ਹੱਦ ਕੀ ਕਹਾਉਂਦੀ ਹੈ?"),
  "What is the main purpose of a poverty line?": lp("गरीबी रेखा का मुख्य उद्देश्य क्या है?", "ਗਰੀਬੀ ਰੇਖਾ ਦਾ ਮੁੱਖ ਉਦੇਸ਼ ਕੀ ਹੈ?"),
  "If 25 out of 100 people are identified as poor, the poverty headcount ratio is:": lp("100 में से 25 लोग गरीब पहचाने जाएँ, तो गरीबी Headcount ratio कितना है?", "100 ਵਿੱਚੋਂ 25 ਲੋਕ ਗਰੀਬ ਪਛਾਣੇ ਜਾਣ, ਤਾਂ ਗਰੀਬੀ Headcount ratio ਕਿੰਨਾ ਹੈ?"),
  "A poverty measure counts how many people fall below a chosen threshold but does not show how far below it they are. This describes the main limitation of the:": lp("एक गरीबी माप चुनी हुई सीमा से नीचे लोगों की संख्या बताता है, लेकिन यह नहीं बताता कि वे सीमा से कितने नीचे हैं। यह किस माप की मुख्य सीमा है?", "ਇੱਕ ਗਰੀਬੀ ਮਾਪ ਚੁਣੀ ਹੱਦ ਤੋਂ ਹੇਠਾਂ ਲੋਕਾਂ ਦੀ ਗਿਣਤੀ ਦੱਸਦਾ ਹੈ ਪਰ ਇਹ ਨਹੀਂ ਦੱਸਦਾ ਕਿ ਉਹ ਹੱਦ ਤੋਂ ਕਿੰਨੇ ਹੇਠਾਂ ਹਨ। ਇਹ ਕਿਸ ਮਾਪ ਦੀ ਮੁੱਖ ਸੀਮਾ ਹੈ?"),
  "Two households have the same income, but one also lacks schooling, sanitation and adequate nutrition. Which approach captures this broader deprivation better?": lp("दो परिवारों की आय समान है, लेकिन एक के पास शिक्षा, स्वच्छता और पर्याप्त पोषण की कमी भी है। इस व्यापक वंचना को कौन-सा दृष्टिकोण बेहतर मापता है?", "ਦੋ ਪਰਿਵਾਰਾਂ ਦੀ ਆਮਦਨ ਇੱਕੋ ਹੈ ਪਰ ਇੱਕ ਕੋਲ ਸਿੱਖਿਆ, ਸਫ਼ਾਈ ਅਤੇ ਯੋਗ ਪੋਸ਼ਣ ਦੀ ਘਾਟ ਵੀ ਹੈ। ਇਸ ਵਿਆਪਕ ਵੰਚਨਾ ਨੂੰ ਕਿਹੜੀ ਪਹੁੰਚ ਵਧੀਆ ਮਾਪਦੀ ਹੈ?"),
  "MGNREGA was enacted in:": lp("MGNREGA किस वर्ष अधिनियमित किया गया?", "MGNREGA ਕਿਹੜੇ ਸਾਲ ਕਾਨੂੰਨ ਬਣਿਆ?"),
  "MGNREGA provides a statutory guarantee of up to how many days of wage employment to an eligible rural household?": lp("MGNREGA पात्र ग्रामीण परिवार को अधिकतम कितने दिनों के मजदूरी रोजगार की वैधानिक गारंटी देता है?", "MGNREGA ਯੋਗ ਪਿੰਡੂ ਪਰਿਵਾਰ ਨੂੰ ਵੱਧ ਤੋਂ ਵੱਧ ਕਿੰਨੇ ਦਿਨਾਂ ਦੇ ਮਜ਼ਦੂਰੀ ਰੁਜ਼ਗਾਰ ਦੀ ਕਾਨੂੰਨੀ ਗਾਰੰਟੀ ਦਿੰਦਾ ਹੈ?"),
  "Which combination best describes a broad anti-poverty strategy discussed in NCERT?": lp("NCERT में बताई व्यापक गरीबी-उन्मूलन रणनीति को कौन-सा संयोजन सबसे अच्छा दर्शाता है?", "NCERT ਵਿੱਚ ਦੱਸੀ ਵਿਆਪਕ ਗਰੀਬੀ-ਘਟਾਊ ਰਣਨੀਤੀ ਨੂੰ ਕਿਹੜਾ ਜੋੜ ਸਭ ਤੋਂ ਵਧੀਆ ਦਰਸਾਉਂਦਾ ਹੈ?"),
  "Which statement best distinguishes seasonal from disguised unemployment?": lp("मौसमी और प्रच्छन्न बेरोजगारी में सही अंतर कौन-सा कथन बताता है?", "ਮੌਸਮੀ ਅਤੇ ਛੁਪੀ ਬੇਰੋਜ਼ਗਾਰੀ ਵਿਚਲਾ ਸਹੀ ਫ਼ਰਕ ਕਿਹੜਾ ਬਿਆਨ ਦੱਸਦਾ ਹੈ?"),
  "Which statement best distinguishes LFPR from WPR?": lp("LFPR और WPR में सही अंतर कौन-सा कथन बताता है?", "LFPR ਅਤੇ WPR ਵਿਚਲਾ ਸਹੀ ਫ਼ਰਕ ਕਿਹੜਾ ਬਿਆਨ ਦੱਸਦਾ ਹੈ?"),
  "Which statement best distinguishes absolute poverty from multidimensional poverty?": lp("निरपेक्ष और बहुआयामी गरीबी में सही अंतर कौन-सा कथन बताता है?", "ਨਿਰਪੇਖ ਅਤੇ ਬਹੁ-ਆਯਾਮੀ ਗਰੀਬੀ ਵਿਚਲਾ ਸਹੀ ਫ਼ਰਕ ਕਿਹੜਾ ਬਿਆਨ ਦੱਸਦਾ ਹੈ?"),
});

const CP6_SCENARIOS: Readonly<Record<string, Pair>> = Object.freeze({
  "A farmer works on land operated by the family and does not receive a fixed salary from an employer.": lp("एक किसान परिवार द्वारा संचालित भूमि पर काम करता है और किसी नियोक्ता से निश्चित वेतन नहीं लेता।", "ਇੱਕ ਕਿਸਾਨ ਪਰਿਵਾਰ ਵੱਲੋਂ ਚਲਾਈ ਜ਼ਮੀਨ ਉੱਤੇ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਕਿਸੇ ਨਿਯੋਤਾ ਤੋਂ ਨਿਸ਼ਚਿਤ ਤਨਖਾਹ ਨਹੀਂ ਲੈਂਦਾ।"),
  "A person runs her own small grocery shop.": lp("एक व्यक्ति अपनी छोटी किराना दुकान चलाती है।", "ਇੱਕ ਵਿਅਕਤੀ ਆਪਣੀ ਛੋਟੀ ਕਰਿਆਨੇ ਦੀ ਦੁਕਾਨ ਚਲਾਉਂਦੀ ਹੈ।"),
  "A clerk works for the same office and receives a regular monthly salary.": lp("एक क्लर्क उसी कार्यालय में काम करता है और नियमित मासिक वेतन पाता है।", "ਇੱਕ ਕਲਰਕ ਉਸੇ ਦਫ਼ਤਰ ਵਿੱਚ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਨਿਯਮਿਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ ਲੈਂਦਾ ਹੈ।"),
  "A teacher is employed by a school and receives a fixed monthly salary.": lp("एक शिक्षक स्कूल में नियोजित है और निश्चित मासिक वेतन पाता है।", "ਇੱਕ ਅਧਿਆਪਕ ਸਕੂਲ ਵਿੱਚ ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਹੈ ਅਤੇ ਨਿਸ਼ਚਿਤ ਮਹੀਨਾਵਾਰ ਤਨਖਾਹ ਲੈਂਦਾ ਹੈ।"),
  "A construction worker is hired and paid only for the days on which work is available.": lp("एक निर्माण कामगार को केवल उन दिनों के लिए रखा और भुगतान किया जाता है जब काम उपलब्ध हो।", "ਇੱਕ ਨਿਰਮਾਣ ਕਾਮਗਾਰ ਨੂੰ ਸਿਰਫ਼ ਉਹਨਾਂ ਦਿਨਾਂ ਲਈ ਰੱਖਿਆ ਅਤੇ ਭੁਗਤਾਨ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਜਦੋਂ ਕੰਮ ਉਪਲਬਧ ਹੋਵੇ।"),
  "A farm worker is hired for a few days during harvesting and paid daily wages.": lp("कटाई के दौरान खेत मजदूर को कुछ दिनों के लिए रखा जाता है और दैनिक मजदूरी दी जाती है।", "ਕਟਾਈ ਦੌਰਾਨ ਖੇਤ ਮਜ਼ਦੂਰ ਨੂੰ ਕੁਝ ਦਿਨਾਂ ਲਈ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਦਿਹਾੜੀ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।"),
});

const CP6_STATEMENTS: Readonly<Record<string, Pair>> = Object.freeze({
  "LFPR uses population as the denominator.": lp("LFPR में जनसंख्या हर होती है।", "LFPR ਵਿੱਚ ਆਬਾਦੀ ਹਰ ਹੁੰਦੀ ਹੈ।"),
  "The unemployment rate uses the labour force as the denominator.": lp("बेरोजगारी दर में श्रम बल हर होता है।", "ਬੇਰੋਜ਼ਗਾਰੀ ਦਰ ਵਿੱਚ ਕਿਰਤ ਬਲ ਹਰ ਹੁੰਦਾ ਹੈ।"),
  "In disguised unemployment, some workers can leave without reducing output.": lp("प्रच्छन्न बेरोजगारी में कुछ कामगार उत्पादन घटाए बिना काम छोड़ सकते हैं।", "ਛੁਪੀ ਬੇਰੋਜ਼ਗਾਰੀ ਵਿੱਚ ਕੁਝ ਕਾਮਗਾਰ ਉਤਪਾਦਨ ਘਟਾਏ ਬਿਨਾਂ ਕੰਮ ਛੱਡ ਸਕਦੇ ਹਨ।"),
  "Seasonal unemployment occurs because work is available only during parts of the year.": lp("मौसमी बेरोजगारी इसलिए होती है क्योंकि काम साल के कुछ हिस्सों में ही उपलब्ध होता है।", "ਮੌਸਮੀ ਬੇਰੋਜ਼ਗਾਰੀ ਇਸ ਲਈ ਹੁੰਦੀ ਹੈ ਕਿਉਂਕਿ ਕੰਮ ਸਾਲ ਦੇ ਕੁਝ ਹਿੱਸਿਆਂ ਵਿੱਚ ਹੀ ਉਪਲਬਧ ਹੁੰਦਾ ਹੈ।"),
  "Relative poverty compares resources with others in the same society.": lp("सापेक्ष गरीबी उसी समाज के अन्य लोगों से संसाधनों की तुलना करती है।", "ਸਾਪੇਖ ਗਰੀਬੀ ਉਸੇ ਸਮਾਜ ਦੇ ਹੋਰ ਲੋਕਾਂ ਨਾਲ ਸਰੋਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰਦੀ ਹੈ।"),
  "Multidimensional poverty is measured only by unemployment status.": lp("बहुआयामी गरीबी केवल बेरोजगारी स्थिति से मापी जाती है।", "ਬਹੁ-ਆਯਾਮੀ ਗਰੀਬੀ ਸਿਰਫ਼ ਬੇਰੋਜ਼ਗਾਰੀ ਦੀ ਸਥਿਤੀ ਨਾਲ ਮਾਪੀ ਜਾਂਦੀ ਹੈ।"),
  "Structural unemployment can result from a mismatch between worker skills and available jobs.": lp("कामगार कौशल और उपलब्ध नौकरियों के बीच असंगति से संरचनात्मक बेरोजगारी हो सकती है।", "ਕਾਮਗਾਰ ਹੁਨਰ ਅਤੇ ਉਪਲਬਧ ਨੌਕਰੀਆਂ ਵਿਚਲੀ ਅਣਮਿਲਤੋਂ ਸੰਰਚਨਾਤਮਕ ਬੇਰੋਜ਼ਗਾਰੀ ਹੋ ਸਕਦੀ ਹੈ।"),
  "Frictional unemployment always means workers' skills have become obsolete.": lp("घर्षणात्मक बेरोजगारी का अर्थ हमेशा कामगारों के कौशल का अप्रचलित हो जाना है।", "ਅੰਤਰਾਲੀ ਬੇਰੋਜ਼ਗਾਰੀ ਦਾ ਅਰਥ ਹਮੇਸ਼ਾਂ ਕਾਮਗਾਰਾਂ ਦੇ ਹੁਨਰ ਪੁਰਾਣੇ ਹੋ ਜਾਣਾ ਹੈ।"),
});

const CP6_LONG: Readonly<Record<string, Pair>> = Object.freeze({
  "Seasonal unemployment follows the time of year; disguised unemployment has more workers than needed": lp("मौसमी बेरोजगारी साल के समय से जुड़ी है; प्रच्छन्न बेरोजगारी में जरूरत से अधिक कामगार होते हैं", "ਮੌਸਮੀ ਬੇਰੋਜ਼ਗਾਰੀ ਸਾਲ ਦੇ ਸਮੇਂ ਨਾਲ ਜੁੜੀ ਹੈ; ਛੁਪੀ ਬੇਰੋਜ਼ਗਾਰੀ ਵਿੱਚ ਲੋੜ ਤੋਂ ਵੱਧ ਕਾਮਗਾਰ ਹੁੰਦੇ ਹਨ"),
  "Seasonal unemployment is always urban; disguised unemployment is always rural": lp("मौसमी बेरोजगारी हमेशा शहरी और प्रच्छन्न बेरोजगारी हमेशा ग्रामीण होती है", "ਮੌਸਮੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹਮੇਸ਼ਾਂ ਸ਼ਹਿਰੀ ਅਤੇ ਛੁਪੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹਮੇਸ਼ਾਂ ਪਿੰਡੂ ਹੁੰਦੀ ਹੈ"),
  "Seasonal unemployment means job search; disguised unemployment means recession": lp("मौसमी बेरोजगारी का अर्थ नौकरी खोज और प्रच्छन्न बेरोजगारी का अर्थ मंदी है", "ਮੌਸਮੀ ਬੇਰੋਜ਼ਗਾਰੀ ਦਾ ਅਰਥ ਨੌਕਰੀ ਖੋਜ ਅਤੇ ਛੁਪੀ ਬੇਰੋਜ਼ਗਾਰੀ ਦਾ ਅਰਥ ਮੰਦੀ ਹੈ"),
  "They are the same concept": lp("दोनों एक ही अवधारणा हैं", "ਦੋਵੇਂ ਇੱਕੋ ਧਾਰਣਾ ਹਨ"),
  "LFPR counts the labour force; WPR counts employed persons, both relative to population": lp("LFPR श्रम बल और WPR नियोजित व्यक्तियों को गिनता है; दोनों जनसंख्या के सापेक्ष हैं", "LFPR ਕਿਰਤ ਬਲ ਅਤੇ WPR ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਵਿਅਕਤੀਆਂ ਨੂੰ ਗਿਣਦਾ ਹੈ; ਦੋਵੇਂ ਆਬਾਦੀ ਦੇ ਸਾਪੇਖ ਹਨ"),
  "LFPR counts only the unemployed; WPR counts the labour force": lp("LFPR केवल बेरोजगारों और WPR श्रम बल को गिनता है", "LFPR ਸਿਰਫ਼ ਬੇਰੋਜ਼ਗਾਰਾਂ ਅਤੇ WPR ਕਿਰਤ ਬਲ ਨੂੰ ਗਿਣਦਾ ਹੈ"),
  "LFPR and WPR always have the same numerator": lp("LFPR और WPR का अंश हमेशा समान होता है", "LFPR ਅਤੇ WPR ਦਾ ਅੰਸ਼ ਹਮੇਸ਼ਾਂ ਇੱਕੋ ਹੁੰਦਾ ਹੈ"),
  "WPR uses only unemployed persons as its numerator": lp("WPR में केवल बेरोजगार व्यक्ति अंश होते हैं", "WPR ਵਿੱਚ ਸਿਰਫ਼ ਬੇਰੋਜ਼ਗਾਰ ਵਿਅਕਤੀ ਅੰਸ਼ ਹੁੰਦੇ ਹਨ"),
  "Absolute poverty uses a minimum-needs threshold; multidimensional poverty combines several kinds of deprivation": lp("निरपेक्ष गरीबी न्यूनतम आवश्यकताओं की सीमा का उपयोग करती है; बहुआयामी गरीबी कई प्रकार की वंचनाओं को जोड़ती है", "ਨਿਰਪੇਖ ਗਰੀਬੀ ਘੱਟੋ-ਘੱਟ ਲੋੜਾਂ ਦੀ ਹੱਦ ਵਰਤਦੀ ਹੈ; ਬਹੁ-ਆਯਾਮੀ ਗਰੀਬੀ ਕਈ ਕਿਸਮਾਂ ਦੀਆਂ ਵੰਚਨਾਵਾਂ ਨੂੰ ਜੋੜਦੀ ਹੈ"),
  "Absolute poverty measures only unemployment; multidimensional poverty measures only income": lp("निरपेक्ष गरीबी केवल बेरोजगारी और बहुआयामी गरीबी केवल आय मापती है", "ਨਿਰਪੇਖ ਗਰੀਬੀ ਸਿਰਫ਼ ਬੇਰੋਜ਼ਗਾਰੀ ਅਤੇ ਬਹੁ-ਆਯਾਮੀ ਗਰੀਬੀ ਸਿਰਫ਼ ਆਮਦਨ ਮਾਪਦੀ ਹੈ"),
  "Both concepts always use one identical monetary line": lp("दोनों अवधारणाएँ हमेशा एक ही मौद्रिक सीमा का उपयोग करती हैं", "ਦੋਵੇਂ ਧਾਰਣਾਵਾਂ ਹਮੇਸ਼ਾਂ ਇੱਕੋ ਮੌਦ੍ਰਿਕ ਹੱਦ ਵਰਤਦੀਆਂ ਹਨ"),
  "Multidimensional poverty ignores health and education": lp("बहुआयामी गरीबी स्वास्थ्य और शिक्षा की उपेक्षा करती है", "ਬਹੁ-ਆਯਾਮੀ ਗਰੀਬੀ ਸਿਹਤ ਅਤੇ ਸਿੱਖਿਆ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਦੀ ਹੈ"),
});

function tr(text: string, locale: NativeLocale): string {
  return T[text]?.[locale] ?? CP5_LONG[text]?.[locale] ?? CP6_LONG[text]?.[locale] ?? text;
}

function statementStem(text: string, locale: NativeLocale, map: Readonly<Record<string, Pair>>): string {
  const match = text.match(/^Consider the statements:\nI\. (.+)\nII\. (.+)\nWhich is correct\?$/s);
  if (!match) return text;
  const s1 = map[match[1]]?.[locale] ?? match[1];
  const s2 = map[match[2]]?.[locale] ?? match[2];
  return locale === "hi"
    ? `कथनों पर विचार कीजिए:\nI. ${s1}\nII. ${s2}\nकौन-सा सही है?`
    : `ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:\nI. ${s1}\nII. ${s2}\nਕਿਹੜਾ ਸਹੀ ਹੈ?`;
}

function cp5Stem(q: (typeof ECO_CP005_REVIEW_V1)[number], locale: NativeLocale): string {
  const exact = CP5_STEMS[q.stem]?.[locale];
  if (exact) return exact;
  const ql = Number(q.qlId.slice(-3));
  if (ql === 2) {
    const term = q.stem.match(/^What does (.+) mean\?$/)?.[1] ?? "";
    return locale === "hi" ? `${tr(term, locale)} का क्या अर्थ है?` : `${tr(term, locale)} ਦਾ ਕੀ ਅਰਥ ਹੈ?`;
  }
  if (ql === 3 || ql === 4) {
    const base = q.stem.replace(/ This mainly causes:$/, "");
    const localized = CP5_SCENARIOS[base]?.[locale] ?? base;
    return locale === "hi" ? `${localized} यह मुख्यतः किस प्रकार की मुद्रास्फीति पैदा करता है?` : `${localized} ਇਹ ਮੁੱਖ ਤੌਰ ਤੇ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਮਹਿੰਗਾਈ ਪੈਦਾ ਕਰਦਾ ਹੈ?`;
  }
  if (ql === 9) {
    const match = q.stem.match(/^A price index rises from (\d+) to (\d+)\. The inflation rate is:$/);
    if (match) return locale === "hi" ? `मूल्य सूचकांक ${match[1]} से बढ़कर ${match[2]} हो जाता है। मुद्रास्फीति दर कितनी है?` : `ਕੀਮਤ ਸੂਚਕ ${match[1]} ਤੋਂ ਵੱਧ ਕੇ ${match[2]} ਹੋ ਜਾਂਦਾ ਹੈ। ਮਹਿੰਗਾਈ ਦੀ ਦਰ ਕਿੰਨੀ ਹੈ?`;
    if (q.stem === "A price index is 150. If it rises by 8%, the new index is:") return locale === "hi" ? "मूल्य सूचकांक 150 है। इसमें 8% वृद्धि हो, तो नया सूचकांक कितना होगा?" : "ਕੀਮਤ ਸੂਚਕ 150 ਹੈ। ਇਸ ਵਿੱਚ 8% ਵਾਧਾ ਹੋਵੇ, ਤਾਂ ਨਵਾਂ ਸੂਚਕ ਕਿੰਨਾ ਹੋਵੇਗਾ?";
  }
  if (ql === 11) return statementStem(q.stem, locale, CP5_STATEMENTS);
  return q.stem;
}

function cp5Option(text: string, locale: NativeLocale): string {
  if (/^\d+(?:\.\d+)?%?$/.test(text)) return text;
  return tr(text, locale);
}

function cp5Explanation(q: (typeof ECO_CP005_REVIEW_V1)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  const ans = cp5Option(q.canonicalAnswer, locale);
  if (ql === 1 || ql === 2) return locale === "hi" ? `${ans} प्रश्न में दी गई मूल्य-स्थिति की सही आर्थिक अवधारणा है।` : `${ans} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਕੀਮਤ-ਸਥਿਤੀ ਦੀ ਸਹੀ ਆਰਥਿਕ ਧਾਰਣਾ ਹੈ।`;
  if (ql === 3) return locale === "hi" ? "जब कुल मांग उपलब्ध उत्पादन से तेज़ बढ़ती है, तो कीमतों पर ऊपर की ओर दबाव पड़ता है। इसे Demand-pull inflation कहते हैं।" : "ਜਦੋਂ ਕੁੱਲ ਮੰਗ ਉਪਲਬਧ ਉਤਪਾਦਨ ਤੋਂ ਤੇਜ਼ ਵਧਦੀ ਹੈ, ਤਾਂ ਕੀਮਤਾਂ ਉੱਤੇ ਉੱਪਰ ਵੱਲ ਦਬਾਅ ਪੈਂਦਾ ਹੈ। ਇਸਨੂੰ Demand-pull inflation ਕਹਿੰਦੇ ਹਨ।";
  if (ql === 4) return locale === "hi" ? "उत्पादन लागत बढ़ने पर फर्में बढ़ी लागत को कीमतों में स्थानांतरित कर सकती हैं। यह Cost-push inflation है।" : "ਉਤਪਾਦਨ ਲਾਗਤ ਵਧਣ ਤੇ ਫਰਮਾਂ ਵਧੀ ਲਾਗਤ ਨੂੰ ਕੀਮਤਾਂ ਵਿੱਚ ਪਾ ਸਕਦੀਆਂ ਹਨ। ਇਹ Cost-push inflation ਹੈ।";
  if (ql === 5) return locale === "hi" ? `क्रय शक्ति बताती है कि आय से कितनी वस्तुएँ और सेवाएँ खरीदी जा सकती हैं। यहाँ सही प्रभाव ${ans} है।` : `ਖਰੀਦ ਸ਼ਕਤੀ ਦੱਸਦੀ ਹੈ ਕਿ ਆਮਦਨ ਨਾਲ ਕਿੰਨੀਆਂ ਵਸਤੂਆਂ ਅਤੇ ਸੇਵਾਵਾਂ ਖਰੀਦੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ। ਇੱਥੇ ਸਹੀ ਪ੍ਰਭਾਵ ${ans} ਹੈ।`;
  if (ql === 6) return locale === "hi" ? "अप्रत्याशित मुद्रास्फीति निश्चित रुपये में होने वाले भुगतान का वास्तविक मूल्य घटाती है। इसलिए उधारकर्ता और ऋणदाता पर प्रभाव विपरीत हो सकता है।" : "ਅਚਾਨਕ ਮਹਿੰਗਾਈ ਨਿਸ਼ਚਿਤ ਰੁਪਏ ਵਿੱਚ ਹੋਣ ਵਾਲੀ ਵਾਪਸੀ ਦਾ ਅਸਲ ਮੁੱਲ ਘਟਾਉਂਦੀ ਹੈ। ਇਸ ਲਈ ਕਰਜ਼ਦਾਰ ਅਤੇ ਕਰਜ਼ ਦੇਣ ਵਾਲੇ ਉੱਤੇ ਪ੍ਰਭਾਵ ਉਲਟ ਹੋ ਸਕਦਾ ਹੈ।";
  if (ql === 7) return locale === "hi" ? `CPI घरेलू उपभोग कीमतों, WPI थोक कीमतों और GDP deflator GDP में शामिल अंतिम उत्पादन की कीमतों को अलग-अलग दायरे में मापते हैं। सही उत्तर ${ans} है।` : `CPI ਘਰੇਲੂ ਖਪਤ ਕੀਮਤਾਂ, WPI ਥੋਕ ਕੀਮਤਾਂ ਅਤੇ GDP deflator GDP ਵਿੱਚ ਸ਼ਾਮਲ ਅੰਤਿਮ ਉਤਪਾਦਨ ਦੀਆਂ ਕੀਮਤਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਦਾਇਰੇ ਵਿੱਚ ਮਾਪਦੇ ਹਨ। ਸਹੀ ਉੱਤਰ ${ans} ਹੈ।`;
  if (ql === 8) return locale === "hi" ? "Headline inflation पूरी चुनी हुई टोकरी को शामिल करती है, जबकि Core inflation में सामान्यतः खाद्य और ईंधन जैसे अस्थिर घटक हटाए जाते हैं।" : "Headline inflation ਪੂਰੀ ਚੁਣੀ ਟੋਕਰੀ ਨੂੰ ਸ਼ਾਮਲ ਕਰਦੀ ਹੈ, ਜਦੋਂ ਕਿ Core inflation ਵਿੱਚ ਆਮ ਤੌਰ ਤੇ ਖੁਰਾਕ ਅਤੇ ਇੰਧਨ ਵਰਗੇ ਅਸਥਿਰ ਘਟਕ ਹਟਾਏ ਜਾਂਦੇ ਹਨ।";
  if (ql === 9) return locale === "hi" ? `मुद्रास्फीति दर = सूचकांक में वृद्धि ÷ पुराना सूचकांक × 100। दिए गए आँकड़ों से सही उत्तर ${ans} है।` : `ਮਹਿੰਗਾਈ ਦਰ = ਸੂਚਕ ਵਿੱਚ ਵਾਧਾ ÷ ਪੁਰਾਣਾ ਸੂਚਕ × 100। ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ ਸਹੀ ਉੱਤਰ ${ans} ਹੈ।`;
  if (ql === 10) return locale === "hi" ? `${ans} सही सुमेलित युग्म है।` : `${ans} ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਜੋੜ ਹੈ।`;
  if (ql === 11) return locale === "hi" ? `दोनों कथनों को उनकी आर्थिक परिभाषाओं से मिलाकर जाँचने पर सही विकल्प ${ans} है।` : `ਦੋਵੇਂ ਬਿਆਨਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀਆਂ ਆਰਥਿਕ ਪਰਿਭਾਸ਼ਾਵਾਂ ਨਾਲ ਮਿਲਾ ਕੇ ਜਾਂਚਣ ਤੇ ਸਹੀ ਵਿਕਲਪ ${ans} ਹੈ।`;
  return locale === "hi" ? `${ans} सही है। यह निकट आर्थिक अवधारणाओं के बीच सही अंतर बताता है।` : `${ans} ਸਹੀ ਹੈ। ਇਹ ਨੇੜਲੀਆਂ ਆਰਥਿਕ ਧਾਰਣਾਵਾਂ ਵਿਚਲਾ ਸਹੀ ਫ਼ਰਕ ਦੱਸਦਾ ਹੈ।`;
}

function cp6Stem(q: (typeof ECO_CP006_REVIEW_V1)[number], locale: NativeLocale): string {
  const exact = CP6_STEMS[q.stem]?.[locale];
  if (exact) return exact;
  const ql = Number(q.qlId.slice(-3));
  if (ql === 3) {
    const base = q.stem.replace(/ This person is best classified as:$/, "");
    const localized = CP6_SCENARIOS[base]?.[locale] ?? base;
    return locale === "hi" ? `${localized} इस व्यक्ति को किस श्रेणी में रखा जाएगा?` : `${localized} ਇਸ ਵਿਅਕਤੀ ਨੂੰ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਵੇਗਾ?`;
  }
  if (ql === 9) {
    let match = q.stem.match(/^Which group is linked with poverty-estimation work in (\d+)\?$/);
    if (match) return locale === "hi" ? `${match[1]} के गरीबी-अनुमान कार्य से कौन-सा समूह जुड़ा है?` : `${match[1]} ਦੇ ਗਰੀਬੀ-ਅੰਦਾਜ਼ਾ ਕੰਮ ਨਾਲ ਕਿਹੜਾ ਸਮੂਹ ਜੁੜਿਆ ਹੈ?`;
    match = q.stem.match(/^(.+) is mainly associated with:$/);
    if (match) return locale === "hi" ? `${tr(match[1], locale)} मुख्यतः किससे जुड़ा है?` : `${tr(match[1], locale)} ਮੁੱਖ ਤੌਰ ਤੇ ਕਿਸ ਨਾਲ ਜੁੜਿਆ ਹੈ?`;
  }
  if (ql === 11) return statementStem(q.stem, locale, CP6_STATEMENTS);
  return q.stem;
}

function cp6Option(text: string, locale: NativeLocale): string {
  if (/^\d+(?:\.\d+)?%?$/.test(text)) return text;
  return tr(text, locale);
}

function cp6Explanation(q: (typeof ECO_CP006_REVIEW_V1)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  const ans = cp6Option(q.canonicalAnswer, locale);
  if (ql === 1) return locale === "hi" ? `${ans} प्रश्न में दी गई रोजगार-स्थिति की सही परिभाषा से मेल खाता है।` : `${ans} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਰੁਜ਼ਗਾਰ-ਸਥਿਤੀ ਦੀ ਸਹੀ ਪਰਿਭਾਸ਼ਾ ਨਾਲ ਮਿਲਦਾ ਹੈ।`;
  if (ql === 2) return locale === "hi" ? `संबंधित दर में सही अंश और हर का उपयोग करना जरूरी है। दिए गए आँकड़ों से सही उत्तर ${ans} है।` : `ਸੰਬੰਧਿਤ ਦਰ ਵਿੱਚ ਸਹੀ ਅੰਸ਼ ਅਤੇ ਹਰ ਵਰਤਣਾ ਲਾਜ਼ਮੀ ਹੈ। ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ ਸਹੀ ਉੱਤਰ ${ans} ਹੈ।`;
  if (ql === 3) return locale === "hi" ? `${ans} रोजगार संबंध की प्रकृति के आधार पर सही वर्गीकरण है।` : `${ans} ਰੁਜ਼ਗਾਰ ਸੰਬੰਧ ਦੀ ਪ੍ਰਕਿਰਤੀ ਦੇ ਆਧਾਰ ਤੇ ਸਹੀ ਵਰਗੀਕਰਨ ਹੈ।`;
  if (ql === 4) return locale === "hi" ? "जब काम केवल वर्ष के कुछ मौसमों में उपलब्ध हो, तो काम न मिलने की अवधि मौसमी बेरोजगारी कहलाती है।" : "ਜਦੋਂ ਕੰਮ ਸਾਲ ਦੇ ਕੁਝ ਮੌਸਮਾਂ ਵਿੱਚ ਹੀ ਉਪਲਬਧ ਹੋਵੇ, ਤਾਂ ਕੰਮ ਨਾ ਮਿਲਣ ਦੀ ਅਵਧੀ ਮੌਸਮੀ ਬੇਰੋਜ਼ਗਾਰੀ ਕਹਾਉਂਦੀ ਹੈ।";
  if (ql === 5) return locale === "hi" ? "जब जरूरत से अधिक लोग काम में लगे हों और कुछ के हटने पर भी उत्पादन न घटे, तो यह प्रच्छन्न बेरोजगारी है।" : "ਜਦੋਂ ਲੋੜ ਤੋਂ ਵੱਧ ਲੋਕ ਕੰਮ ਵਿੱਚ ਲੱਗੇ ਹੋਣ ਅਤੇ ਕੁਝ ਦੇ ਹਟਣ ਤੇ ਵੀ ਉਤਪਾਦਨ ਨਾ ਘਟੇ, ਤਾਂ ਇਹ ਛੁਪੀ ਬੇਰੋਜ਼ਗਾਰੀ ਹੈ।";
  if (ql === 6) return locale === "hi" ? `${ans} प्रश्न में बताए बेरोजगारी के कारण से मेल खाती है।` : `${ans} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦੱਸੇ ਬੇਰੋਜ਼ਗਾਰੀ ਦੇ ਕਾਰਨ ਨਾਲ ਮਿਲਦੀ ਹੈ।`;
  if (ql === 7) return locale === "hi" ? `${ans} प्रश्न में वर्णित गरीबी की प्रकृति को सही ढंग से दर्शाती है।` : `${ans} ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਵਰਣਿਤ ਗਰੀਬੀ ਦੀ ਪ੍ਰਕਿਰਤੀ ਨੂੰ ਸਹੀ ਢੰਗ ਨਾਲ ਦਰਸਾਉਂਦੀ ਹੈ।`;
  if (ql === 8) return locale === "hi" ? `${ans} सही है। गरीबी रेखा पहचान की सीमा है, जबकि Headcount ratio गरीब मानी गई जनसंख्या का प्रतिशत बताता है।` : `${ans} ਸਹੀ ਹੈ। ਗਰੀਬੀ ਰੇਖਾ ਪਛਾਣ ਦੀ ਹੱਦ ਹੈ, ਜਦੋਂ ਕਿ Headcount ratio ਗਰੀਬ ਮੰਨੀ ਗਈ ਆਬਾਦੀ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਦੱਸਦਾ ਹੈ।`;
  if (ql === 9) return locale === "hi" ? `${ans} भारत में गरीबी-अनुमान की ऐतिहासिक विशेषज्ञ-समूह प्रक्रिया से सही रूप से जुड़ा है।` : `${ans} ਭਾਰਤ ਵਿੱਚ ਗਰੀਬੀ-ਅੰਦਾਜ਼ੇ ਦੀ ਇਤਿਹਾਸਕ ਮਾਹਿਰ-ਸਮੂਹ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਸਹੀ ਤੌਰ ਤੇ ਜੁੜਿਆ ਹੈ।`;
  if (ql === 10) return locale === "hi" ? `${ans} सही है। MGNREGA 2005 का कानून है और पात्र ग्रामीण परिवारों को अधिकतम 100 दिनों के मजदूरी रोजगार की वैधानिक गारंटी देता है।` : `${ans} ਸਹੀ ਹੈ। MGNREGA 2005 ਦਾ ਕਾਨੂੰਨ ਹੈ ਅਤੇ ਯੋਗ ਪਿੰਡੂ ਪਰਿਵਾਰਾਂ ਨੂੰ ਵੱਧ ਤੋਂ ਵੱਧ 100 ਦਿਨਾਂ ਦੇ ਮਜ਼ਦੂਰੀ ਰੁਜ਼ਗਾਰ ਦੀ ਕਾਨੂੰਨੀ ਗਾਰੰਟੀ ਦਿੰਦਾ ਹੈ।`;
  if (ql === 11) return locale === "hi" ? `परिभाषाओं और दरों के सही संबंध से जाँचने पर सही विकल्प ${ans} है।` : `ਪਰਿਭਾਸ਼ਾਵਾਂ ਅਤੇ ਦਰਾਂ ਦੇ ਸਹੀ ਸੰਬੰਧ ਨਾਲ ਜਾਂਚਣ ਤੇ ਸਹੀ ਵਿਕਲਪ ${ans} ਹੈ।`;
  return locale === "hi" ? `${ans} सही है। यह संबंधित रोजगार या गरीबी अवधारणाओं के बीच सही अंतर बताता है।` : `${ans} ਸਹੀ ਹੈ। ਇਹ ਸੰਬੰਧਿਤ ਰੁਜ਼ਗਾਰ ਜਾਂ ਗਰੀਬੀ ਧਾਰਣਾਵਾਂ ਵਿਚਲਾ ਸਹੀ ਫ਼ਰਕ ਦੱਸਦਾ ਹੈ।`;
}

function localize005(q: (typeof ECO_CP005_REVIEW_V1)[number], locale: EcoLocaleV1): EcoLocalizedQuestionV1 {
  if (locale === "en") return { ...q, locale, localizationV1: { version: ECO_LOCALIZATION_V1, englishQuestionId: q.questionId, semanticInvariant: true, cpInvariant: true, qlInvariant: true, difficultyInvariant: true, sourceInvariant: true, optionOrderInvariant: true, correctIndexInvariant: true, reviewOnly: true } };
  const options = q.options.map((option) => cp5Option(option, locale));
  return {
    ...q,
    questionId: `${q.questionId}-${locale.toUpperCase()}`,
    stem: cp5Stem(q, locale),
    options,
    canonicalAnswer: options[q.correctIndex],
    explanation: cp5Explanation(q, locale),
    locale,
    localizationV1: { version: ECO_LOCALIZATION_V1, englishQuestionId: q.questionId, semanticInvariant: true, cpInvariant: true, qlInvariant: true, difficultyInvariant: true, sourceInvariant: true, optionOrderInvariant: true, correctIndexInvariant: true, reviewOnly: true },
  };
}

function localize006(q: (typeof ECO_CP006_REVIEW_V1)[number], locale: EcoLocaleV1): EcoLocalizedQuestionV1 {
  if (locale === "en") return { ...q, locale, localizationV1: { version: ECO_LOCALIZATION_V1, englishQuestionId: q.questionId, semanticInvariant: true, cpInvariant: true, qlInvariant: true, difficultyInvariant: true, sourceInvariant: true, optionOrderInvariant: true, correctIndexInvariant: true, reviewOnly: true } };
  const options = q.options.map((option) => cp6Option(option, locale));
  return {
    ...q,
    questionId: `${q.questionId}-${locale.toUpperCase()}`,
    stem: cp6Stem(q, locale),
    options,
    canonicalAnswer: options[q.correctIndex],
    explanation: cp6Explanation(q, locale),
    locale,
    localizationV1: { version: ECO_LOCALIZATION_V1, englishQuestionId: q.questionId, semanticInvariant: true, cpInvariant: true, qlInvariant: true, difficultyInvariant: true, sourceInvariant: true, optionOrderInvariant: true, correctIndexInvariant: true, reviewOnly: true },
  };
}

export function generateEcoCp005LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return ECO_CP005_REVIEW_V1.map((q) => localize005(q, locale));
}

export function generateEcoCp006LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return ECO_CP006_REVIEW_V1.map((q) => localize006(q, locale));
}

export function generateEcoCp005Cp006LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp005LocalizedReviewV1(locale), ...generateEcoCp006LocalizedReviewV1(locale)];
}

export const ECO_MULTILINGUAL_CP005_CP006_V1 = Object.freeze({
  en: generateEcoCp005Cp006LocalizedReviewV1("en"),
  hi: generateEcoCp005Cp006LocalizedReviewV1("hi"),
  pa: generateEcoCp005Cp006LocalizedReviewV1("pa"),
});
