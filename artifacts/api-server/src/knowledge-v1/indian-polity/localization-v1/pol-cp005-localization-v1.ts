import { applyPolityFinalEditorialStemPass } from "../pol-001-final-editorial-stem-pass-v1";
import {
  POL_CP005_ARTICLE39_CLAUSES_V1,
  POL_CP005_DPSP_ARTICLES_V1,
  POL_CP005_DUTIES_V1,
} from "../directive-principles-duties/pol-cp005-facts";
import { generatePolCp005ReviewBatchV3 } from "../directive-principles-duties/pol-cp005-review-generator-v3";
import { POL_LOCALIZATION_V1, type PolLocaleV1, type PolLocalizedQuestionV1 } from "./pol-localization-types-v1";
import { applyPolityPunjabiNativePassV1 } from "./pol-punjabi-native-pass-v1";

type NativeLocale = Exclude<PolLocaleV1,"en">;
type Pair = Readonly<{hi:string;pa:string}>;
const lp=(hi:string,pa:string):Pair=>({hi,pa});
const native=(p:Pair,l:NativeLocale)=>p[l];
const ARTICLE=(n:string,l:NativeLocale)=>l==="hi"?`अनुच्छेद ${n}`:`ਅਨੁਛੇਦ ${n}`;
const PART=(p:string,l:NativeLocale)=>l==="hi"?`भाग ${p}`:`ਭਾਗ ${p}`;

const ENGLISH=Object.freeze(generatePolCp005ReviewBatchV3().map((q)=>applyPolityFinalEditorialStemPass(q)));

const DPSP_SUBJECT:Readonly<Record<string,Pair>>=Object.freeze({
"36":lp("भाग IV के लिए राज्य की परिभाषा","ਭਾਗ IV ਲਈ ਰਾਜ ਦੀ ਪਰਿਭਾਸ਼ਾ"),
"37":lp("राज्य के नीति-निदेशक तत्वों का लागू होना","ਰਾਜ ਦੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਦੀ ਲਾਗੂਤਾ"),
"38":lp("लोक-कल्याण के लिए सामाजिक व्यवस्था और असमानताओं में कमी","ਲੋਕ-ਭਲਾਈ ਲਈ ਸਮਾਜਿਕ ਵਿਵਸਥਾ ਅਤੇ ਅਸਮਾਨਤਾਵਾਂ ਘਟਾਉਣਾ"),
"39":lp("राज्य की नीति के कुछ सिद्धांत","ਰਾਜ ਦੀ ਨੀਤੀ ਦੇ ਕੁਝ ਸਿਧਾਂਤ"),
"39A":lp("समान न्याय और निःशुल्क विधिक सहायता","ਸਮਾਨ ਨਿਆਂ ਅਤੇ ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ"),
"40":lp("ग्राम पंचायतों का संगठन","ਪਿੰਡ ਪੰਚਾਇਤਾਂ ਦੀ ਸਥਾਪਨਾ"),
"41":lp("कुछ मामलों में काम, शिक्षा और सार्वजनिक सहायता","ਕੁਝ ਮਾਮਲਿਆਂ ਵਿੱਚ ਕੰਮ, ਸਿੱਖਿਆ ਅਤੇ ਜਨਤਕ ਸਹਾਇਤਾ"),
"42":lp("काम की न्यायसंगत और मानवीय दशाएँ तथा प्रसूति सहायता","ਕੰਮ ਦੀਆਂ ਨਿਆਂਸੰਗਤ ਅਤੇ ਮਨੁੱਖੀ ਹਾਲਤਾਂ ਅਤੇ ਮਾਤ੍ਰਿਤਵ ਸਹਾਇਤਾ"),
"43":lp("कामगारों के लिए निर्वाह मजदूरी और सम्मानजनक जीवन-स्तर","ਮਜ਼ਦੂਰਾਂ ਲਈ ਜੀਵਨ-ਯੋਗ ਮਜ਼ਦੂਰੀ ਅਤੇ ਢੰਗ ਦਾ ਜੀਵਨ-ਮਿਆਰ"),
"43A":lp("उद्योगों के प्रबंधन में कामगारों की भागीदारी","ਉਦਯੋਗਾਂ ਦੇ ਪ੍ਰਬੰਧ ਵਿੱਚ ਮਜ਼ਦੂਰਾਂ ਦੀ ਭਾਗੀਦਾਰੀ"),
"43B":lp("सहकारी समितियों को बढ़ावा","ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਨੂੰ ਉਤਸ਼ਾਹ"),
"44":lp("समान नागरिक संहिता","ਸਮਾਨ ਨਾਗਰਿਕ ਸੰਹਿਤਾ"),
"45":lp("छह वर्ष से कम बच्चों की प्रारंभिक देखभाल और शिक्षा","6 ਸਾਲ ਤੋਂ ਘੱਟ ਬੱਚਿਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਦੇਖਭਾਲ ਅਤੇ ਸਿੱਖਿਆ"),
"46":lp("कमजोर वर्गों के शैक्षणिक और आर्थिक हित","ਕਮਜ਼ੋਰ ਵਰਗਾਂ ਦੇ ਵਿਦਿਅਕ ਅਤੇ ਆਰਥਿਕ ਹਿੱਤ"),
"47":lp("पोषण, जीवन-स्तर और लोक स्वास्थ्य","ਪੋਸ਼ਣ, ਜੀਵਨ-ਮਿਆਰ ਅਤੇ ਜਨ ਸਿਹਤ"),
"48":lp("कृषि और पशुपालन","ਖੇਤੀਬਾੜੀ ਅਤੇ ਪਸ਼ੂ ਪਾਲਣ"),
"48A":lp("पर्यावरण, वन और वन्यजीवों की रक्षा","ਵਾਤਾਵਰਣ, ਜੰਗਲ ਅਤੇ ਜੰਗਲੀ ਜੀਵਾਂ ਦੀ ਰੱਖਿਆ"),
"49":lp("राष्ट्रीय महत्व के स्मारकों की रक्षा","ਰਾਸ਼ਟਰੀ ਮਹੱਤਤਾ ਵਾਲੇ ਸਮਾਰਕਾਂ ਦੀ ਰੱਖਿਆ"),
"50":lp("न्यायपालिका को कार्यपालिका से अलग करना","ਨਿਆਂਪਾਲਿਕਾ ਨੂੰ ਕਾਰਜਪਾਲਿਕਾ ਤੋਂ ਵੱਖ ਕਰਨਾ"),
"51":lp("अंतरराष्ट्रीय शांति और सुरक्षा","ਅੰਤਰਰਾਸ਼ਟਰੀ ਸ਼ਾਂਤੀ ਅਤੇ ਸੁਰੱਖਿਆ"),
});

const DPSP_RULE:Readonly<Record<string,Pair>>=Object.freeze({
"37":lp("अनुच्छेद 37 के अनुसार नीति-निदेशक तत्व न्यायालय द्वारा लागू नहीं कराए जा सकते, लेकिन देश के शासन में मूलभूत हैं और कानून बनाते समय राज्य को इन्हें लागू करना है।","ਅਨੁਛੇਦ 37 ਅਨੁਸਾਰ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ ਅਦਾਲਤ ਰਾਹੀਂ ਲਾਗੂ ਨਹੀਂ ਕਰਵਾਏ ਜਾ ਸਕਦੇ, ਪਰ ਦੇਸ਼ ਦੇ ਸ਼ਾਸਨ ਲਈ ਬੁਨਿਆਦੀ ਹਨ ਅਤੇ ਕਾਨੂੰਨ ਬਣਾਉਂਦਿਆਂ ਰਾਜ ਨੂੰ ਇਨ੍ਹਾਂ ਨੂੰ ਲਾਗੂ ਕਰਨਾ ਹੈ।"),
"40":lp("अनुच्छेद 40 राज्य को ग्राम पंचायतों का संगठन कर उन्हें स्वशासन की इकाइयों के रूप में आवश्यक शक्तियाँ देने का निर्देश देता है।","ਅਨੁਛੇਦ 40 ਰਾਜ ਨੂੰ ਪਿੰਡ ਪੰਚਾਇਤਾਂ ਬਣਾਉਣ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਸਵੈ-ਸ਼ਾਸਨ ਦੀਆਂ ਇਕਾਈਆਂ ਵਜੋਂ ਲੋੜੀਂਦੀਆਂ ਸ਼ਕਤੀਆਂ ਦੇਣ ਲਈ ਕਹਿੰਦਾ ਹੈ।"),
"44":lp("अनुच्छेद 44 राज्य को पूरे भारत में नागरिकों के लिए समान नागरिक संहिता सुनिश्चित करने का प्रयास करने को कहता है।","ਅਨੁਛੇਦ 44 ਰਾਜ ਨੂੰ ਸਾਰੇ ਭਾਰਤ ਦੇ ਨਾਗਰਿਕਾਂ ਲਈ ਸਮਾਨ ਨਾਗਰਿਕ ਸੰਹਿਤਾ ਲਿਆਉਣ ਲਈ ਯਤਨ ਕਰਨ ਨੂੰ ਕਹਿੰਦਾ ਹੈ।"),
"45":lp("अनुच्छेद 45 छह वर्ष की आयु पूरी करने तक सभी बच्चों के लिए प्रारंभिक बाल देखभाल और शिक्षा का प्रयास करने को कहता है।","ਅਨੁਛੇਦ 45 ਰਾਜ ਨੂੰ 6 ਸਾਲ ਦੀ ਉਮਰ ਪੂਰੀ ਹੋਣ ਤੱਕ ਹਰ ਬੱਚੇ ਲਈ ਸ਼ੁਰੂਆਤੀ ਦੇਖਭਾਲ ਅਤੇ ਸਿੱਖਿਆ ਦੇਣ ਦਾ ਯਤਨ ਕਰਨ ਨੂੰ ਕਹਿੰਦਾ ਹੈ।"),
"47":lp("अनुच्छेद 47 पोषण स्तर, जीवन-स्तर और लोक स्वास्थ्य सुधारने को राज्य के प्रमुख कर्तव्यों में रखता है।","ਅਨੁਛੇਦ 47 ਪੋਸ਼ਣ, ਜੀਵਨ-ਮਿਆਰ ਅਤੇ ਜਨ ਸਿਹਤ ਸੁਧਾਰਨ ਨੂੰ ਰਾਜ ਦੇ ਮੁੱਖ ਫ਼ਰਜ਼ਾਂ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।"),
"48":lp("अनुच्छेद 48 कृषि और पशुपालन को आधुनिक तथा वैज्ञानिक आधार पर व्यवस्थित करने का निर्देश देता है।","ਅਨੁਛੇਦ 48 ਖੇਤੀਬਾੜੀ ਅਤੇ ਪਸ਼ੂ ਪਾਲਣ ਨੂੰ ਆਧੁਨਿਕ ਤੇ ਵਿਗਿਆਨਕ ਢੰਗ ਨਾਲ ਚਲਾਉਣ ਲਈ ਕਹਿੰਦਾ ਹੈ।"),
"48A":lp("अनुच्छेद 48A राज्य को पर्यावरण की रक्षा और सुधार तथा वनों और वन्यजीवों की सुरक्षा का निर्देश देता है।","ਅਨੁਛੇਦ 48A ਰਾਜ ਨੂੰ ਵਾਤਾਵਰਣ ਦੀ ਰੱਖਿਆ ਤੇ ਸੁਧਾਰ ਅਤੇ ਜੰਗਲਾਂ ਤੇ ਜੰਗਲੀ ਜੀਵਾਂ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਕਹਿੰਦਾ ਹੈ।"),
"50":lp("अनुच्छेद 50 राज्य की लोक सेवाओं में न्यायपालिका को कार्यपालिका से अलग करने का निर्देश देता है।","ਅਨੁਛੇਦ 50 ਰਾਜ ਦੀਆਂ ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਵਿੱਚ ਨਿਆਂਪਾਲਿਕਾ ਨੂੰ ਕਾਰਜਪਾਲਿਕਾ ਤੋਂ ਵੱਖ ਕਰਨ ਲਈ ਕਹਿੰਦਾ ਹੈ।"),
"51":lp("अनुच्छेद 51 अंतरराष्ट्रीय शांति, सम्मानजनक संबंध, अंतरराष्ट्रीय कानून के सम्मान और मध्यस्थता से विवाद निपटाने को बढ़ावा देता है।","ਅਨੁਛੇਦ 51 ਅੰਤਰਰਾਸ਼ਟਰੀ ਸ਼ਾਂਤੀ, ਸਨਮਾਨਪੂਰਕ ਸੰਬੰਧ, ਅੰਤਰਰਾਸ਼ਟਰੀ ਕਾਨੂੰਨ ਦਾ ਆਦਰ ਅਤੇ ਮੱਧਸਥਤਾ ਰਾਹੀਂ ਵਿਵਾਦ ਨਿਪਟਾਉਣ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਦਾ ਹੈ।"),
});

const A39:Readonly<Record<string,Pair>>=Object.freeze({
"39(a)":lp("पुरुषों और महिलाओं के लिए समान रूप से पर्याप्त आजीविका के साधन","ਮਰਦਾਂ ਅਤੇ ਔਰਤਾਂ ਲਈ ਬਰਾਬਰ ਤੌਰ 'ਤੇ ਯੋਗ ਰੋਜ਼ੀ-ਰੋਟੀ ਦੇ ਸਾਧਨ"),
"39(b)":lp("भौतिक संसाधनों का वितरण सामूहिक हित के लिए","ਭੌਤਿਕ ਸਰੋਤਾਂ ਦੀ ਵੰਡ ਸਾਂਝੇ ਭਲੇ ਲਈ"),
"39(c)":lp("धन और उत्पादन के साधनों का अहितकारी केंद्रीकरण रोकना","ਧਨ ਅਤੇ ਉਤਪਾਦਨ ਦੇ ਸਾਧਨਾਂ ਦਾ ਨੁਕਸਾਨਦਾਇਕ ਕੇਂਦਰੀਕਰਨ ਰੋਕਣਾ"),
"39(d)":lp("पुरुषों और महिलाओं के लिए समान काम का समान वेतन","ਮਰਦਾਂ ਅਤੇ ਔਰਤਾਂ ਲਈ ਇੱਕੋ ਕੰਮ ਦਾ ਇੱਕੋ ਵੇਤਨ"),
"39(e)":lp("कामगारों के स्वास्थ्य और शक्ति की रक्षा तथा कम आयु के दुरुपयोग को रोकना","ਮਜ਼ਦੂਰਾਂ ਦੀ ਸਿਹਤ ਤੇ ਤਾਕਤ ਦੀ ਰੱਖਿਆ ਅਤੇ ਛੋਟੀ ਉਮਰ ਦੇ ਦੁਰਵਰਤੋਂ ਨੂੰ ਰੋਕਣਾ"),
"39(f)":lp("बच्चों का स्वस्थ विकास, गरिमा और शोषण से सुरक्षा","ਬੱਚਿਆਂ ਦਾ ਸਿਹਤਮੰਦ ਵਿਕਾਸ, ਮਰਯਾਦਾ ਅਤੇ ਸ਼ੋਸ਼ਣ ਤੋਂ ਸੁਰੱਖਿਆ"),
});

const DUTY:Readonly<Record<string,Pair>>=Object.freeze({
"51A(a)":lp("संविधान का पालन करना और उसके आदर्शों व संस्थाओं, राष्ट्रीय ध्वज और राष्ट्रगान का सम्मान करना","ਸੰਵਿਧਾਨ ਦੀ ਪਾਲਣਾ ਕਰਨੀ ਅਤੇ ਇਸਦੇ ਆਦਰਸ਼ਾਂ ਤੇ ਸੰਸਥਾਵਾਂ, ਰਾਸ਼ਟਰੀ ਝੰਡੇ ਅਤੇ ਰਾਸ਼ਟਰੀ ਗੀਤ ਦਾ ਸਤਿਕਾਰ ਕਰਨਾ"),
"51A(b)":lp("स्वतंत्रता संग्राम को प्रेरित करने वाले महान आदर्शों को अपनाना और उनका पालन करना","ਆਜ਼ਾਦੀ ਦੀ ਲੜਾਈ ਨੂੰ ਪ੍ਰੇਰਿਤ ਕਰਨ ਵਾਲੇ ਉੱਚ ਆਦਰਸ਼ਾਂ ਨੂੰ ਸਾਂਭਣਾ ਅਤੇ ਉਨ੍ਹਾਂ 'ਤੇ ਚੱਲਣਾ"),
"51A(c)":lp("भारत की संप्रभुता, एकता और अखंडता की रक्षा करना","ਭਾਰਤ ਦੀ ਸੰਪ੍ਰਭੁਤਾ, ਏਕਤਾ ਅਤੇ ਅਖੰਡਤਾ ਦੀ ਰੱਖਿਆ ਕਰਨੀ"),
"51A(d)":lp("देश की रक्षा करना और बुलाए जाने पर राष्ट्रीय सेवा देना","ਦੇਸ਼ ਦੀ ਰੱਖਿਆ ਕਰਨੀ ਅਤੇ ਬੁਲਾਏ ਜਾਣ 'ਤੇ ਰਾਸ਼ਟਰੀ ਸੇਵਾ ਦੇਣੀ"),
"51A(e)":lp("सद्भाव और समान भ्रातृत्व की भावना बढ़ाना तथा महिलाओं की गरिमा के विरुद्ध प्रथाओं का त्याग करना","ਸਦਭਾਵਨਾ ਅਤੇ ਸਾਂਝੇ ਭਾਈਚਾਰੇ ਦੀ ਭਾਵਨਾ ਵਧਾਉਣੀ ਅਤੇ ਔਰਤਾਂ ਦੀ ਮਰਯਾਦਾ ਦੇ ਵਿਰੁੱਧ ਰਵਾਇਤਾਂ ਛੱਡਣੀਆਂ"),
"51A(f)":lp("भारत की समन्वित संस्कृति की समृद्ध विरासत का मूल्य समझना और उसे सुरक्षित रखना","ਭਾਰਤ ਦੀ ਸਾਂਝੀ ਸਭਿਆਚਾਰਕ ਵਿਰਾਸਤ ਦੀ ਕਦਰ ਕਰਨੀ ਅਤੇ ਉਸਨੂੰ ਸੰਭਾਲਣਾ"),
"51A(g)":lp("प्राकृतिक पर्यावरण की रक्षा और सुधार करना तथा जीव-जंतुओं के प्रति दया रखना","ਕੁਦਰਤੀ ਵਾਤਾਵਰਣ ਦੀ ਰੱਖਿਆ ਤੇ ਸੁਧਾਰ ਕਰਨਾ ਅਤੇ ਜੀਵ-ਜੰਤੂਆਂ ਲਈ ਦਇਆ ਰੱਖਣੀ"),
"51A(h)":lp("वैज्ञानिक दृष्टिकोण, मानवतावाद और जिज्ञासा व सुधार की भावना विकसित करना","ਵਿਗਿਆਨਕ ਸੋਚ, ਮਨੁੱਖਤਾਵਾਦ ਅਤੇ ਖੋਜ ਤੇ ਸੁਧਾਰ ਦੀ ਭਾਵਨਾ ਵਿਕਸਿਤ ਕਰਨੀ"),
"51A(i)":lp("सार्वजनिक संपत्ति की रक्षा करना और हिंसा से दूर रहना","ਜਨਤਕ ਸੰਪਤੀ ਦੀ ਰੱਖਿਆ ਕਰਨੀ ਅਤੇ ਹਿੰਸਾ ਤੋਂ ਦੂਰ ਰਹਿਣਾ"),
"51A(j)":lp("व्यक्तिगत और सामूहिक कार्य के सभी क्षेत्रों में उत्कृष्टता की ओर बढ़ना","ਵਿਅਕਤੀਗਤ ਅਤੇ ਸਾਂਝੇ ਕੰਮ ਦੇ ਹਰ ਖੇਤਰ ਵਿੱਚ ਉੱਤਮਤਾ ਲਈ ਯਤਨ ਕਰਨਾ"),
"51A(k)":lp("माता-पिता या अभिभावक के रूप में 6 से 14 वर्ष के बच्चे को शिक्षा के अवसर देना","ਮਾਤਾ-ਪਿਤਾ ਜਾਂ ਸਰਪ੍ਰਸਤ ਵਜੋਂ 6 ਤੋਂ 14 ਸਾਲ ਦੇ ਬੱਚੇ ਨੂੰ ਸਿੱਖਿਆ ਦੇ ਮੌਕੇ ਦੇਣੇ"),
});

const AMEND:Readonly<Record<string,Pair>>=Object.freeze({
"Forty-second Amendment":lp("42वाँ संविधान संशोधन","42ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Forty-fourth Amendment":lp("44वाँ संविधान संशोधन","44ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Eighty-sixth Amendment":lp("86वाँ संविधान संशोधन","86ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Ninety-seventh Amendment":lp("97वाँ संविधान संशोधन","97ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
});

const ADDITIONS:Readonly<Record<string,Pair>>=Object.freeze({
"Articles 39A, 43A and 48A, and Part IVA containing the original ten Fundamental Duties":lp("अनुच्छेद 39A, 43A और 48A तथा मूल 10 मौलिक कर्तव्यों वाला भाग IVA","ਅਨੁਛੇਦ 39A, 43A ਅਤੇ 48A ਅਤੇ ਮੂਲ 10 ਮੂਲ ਫ਼ਰਜ਼ਾਂ ਵਾਲਾ ਭਾਗ IVA"),
"Present Article 45 on early childhood care and Fundamental Duty 51A(k)":lp("प्रारंभिक बाल देखभाल वाला वर्तमान अनुच्छेद 45 और मौलिक कर्तव्य 51A(k)","ਸ਼ੁਰੂਆਤੀ ਬਾਲ ਦੇਖਭਾਲ ਵਾਲਾ ਮੌਜੂਦਾ ਅਨੁਛੇਦ 45 ਅਤੇ ਮੂਲ ਫ਼ਰਜ਼ 51A(k)"),
"Article 43B on co-operative societies":lp("सहकारी समितियों पर अनुच्छेद 43B","ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਬਾਰੇ ਅਨੁਛੇਦ 43B"),
"Articles 44 and 50 on uniform civil code and separation of judiciary":lp("समान नागरिक संहिता और न्यायपालिका-कार्यपालिका पृथक्करण वाले अनुच्छेद 44 और 50","ਸਮਾਨ ਨਾਗਰਿਕ ਸੰਹਿਤਾ ਅਤੇ ਨਿਆਂਪਾਲਿਕਾ-ਕਾਰਜਪਾਲਿਕਾ ਵੱਖਰੇਪਣ ਵਾਲੇ ਅਨੁਛੇਦ 44 ਅਤੇ 50"),
});

const COMMON:Readonly<Record<string,Pair>>=Object.freeze({
"They are not enforceable by courts but are fundamental in governance.":lp("वे न्यायालयों द्वारा लागू नहीं कराए जा सकते, लेकिन शासन में मूलभूत हैं।","ਇਹ ਅਦਾਲਤਾਂ ਰਾਹੀਂ ਲਾਗੂ ਨਹੀਂ ਕਰਵਾਏ ਜਾ ਸਕਦੇ, ਪਰ ਸ਼ਾਸਨ ਲਈ ਬੁਨਿਆਦੀ ਹਨ।"),
"They are enforceable in the same way as Fundamental Rights.":lp("वे मौलिक अधिकारों की तरह लागू कराए जा सकते हैं।","ਇਹ ਮੂਲ ਅਧਿਕਾਰਾਂ ਵਾਂਗ ਅਦਾਲਤ ਰਾਹੀਂ ਲਾਗੂ ਕਰਵਾਏ ਜਾ ਸਕਦੇ ਹਨ।"),
"They apply only during a national emergency.":lp("वे केवल राष्ट्रीय आपातकाल में लागू होते हैं।","ਇਹ ਸਿਰਫ਼ ਰਾਸ਼ਟਰੀ ਐਮਰਜੈਂਸੀ ਦੌਰਾਨ ਲਾਗੂ ਹੁੰਦੇ ਹਨ।"),
"They are contained in Part III of the Constitution.":lp("वे संविधान के भाग III में हैं।","ਇਹ ਸੰਵਿਧਾਨ ਦੇ ਭਾਗ III ਵਿੱਚ ਹਨ।"),
"Non-justiciable but fundamental in the governance of the country":lp("न्यायालय से लागू न कराए जा सकने वाले, लेकिन देश के शासन में मूलभूत","ਅਦਾਲਤ ਰਾਹੀਂ ਲਾਗੂ ਨਾ ਕਰਵਾਏ ਜਾ ਸਕਣ ਵਾਲੇ, ਪਰ ਦੇਸ਼ ਦੇ ਸ਼ਾਸਨ ਲਈ ਬੁਨਿਆਦੀ"),
"Enforceable against every private person":lp("हर निजी व्यक्ति के विरुद्ध लागू","ਹਰ ਨਿੱਜੀ ਵਿਅਕਤੀ ਦੇ ਖ਼ਿਲਾਫ਼ ਲਾਗੂ"),
"Temporary principles that expire after ten years":lp("10 वर्ष बाद समाप्त होने वाले अस्थायी सिद्धांत","10 ਸਾਲ ਬਾਅਦ ਖਤਮ ਹੋਣ ਵਾਲੇ ਅਸਥਾਈ ਸਿਧਾਂਤ"),
"Judicial remedies enforceable only by the Supreme Court":lp("केवल सर्वोच्च न्यायालय से लागू न्यायिक उपचार","ਸਿਰਫ਼ ਸੁਪਰੀਮ ਕੋਰਟ ਰਾਹੀਂ ਲਾਗੂ ਨਿਆਂਇਕ ਉਪਾਅ"),
"A duty of the State":lp("राज्य का कर्तव्य","ਰਾਜ ਦਾ ਫ਼ਰਜ਼"),
"A duty only of the judiciary":lp("केवल न्यायपालिका का कर्तव्य","ਸਿਰਫ਼ ਨਿਆਂਪਾਲਿਕਾ ਦਾ ਫ਼ਰਜ਼"),
"Optional only for local governments":lp("केवल स्थानीय सरकारों के लिए वैकल्पिक","ਸਿਰਫ਼ ਸਥਾਨਕ ਸਰਕਾਰਾਂ ਲਈ ਚੋਣਵਾਂ"),
"A duty only during financial emergency":lp("केवल वित्तीय आपातकाल में कर्तव्य","ਸਿਰਫ਼ ਵਿੱਤੀ ਐਮਰਜੈਂਸੀ ਦੌਰਾਨ ਫ਼ਰਜ਼"),
"Vote in every election":lp("हर चुनाव में मतदान करना","ਹਰ ਚੋਣ ਵਿੱਚ ਵੋਟ ਪਾਉਣਾ"),
"Voting in every election":lp("हर चुनाव में मतदान करना","ਹਰ ਚੋਣ ਵਿੱਚ ਵੋਟ ਪਾਉਣਾ"),
"Pay every tax directly listed in the Constitution":lp("संविधान में सीधे लिखे हर कर का भुगतान करना","ਸੰਵਿਧਾਨ ਵਿੱਚ ਸਿੱਧੇ ਲਿਖੇ ਹਰ ਕਰ ਦੀ ਅਦਾਇਗੀ ਕਰਨੀ"),
"Paying taxes as an expressly listed Fundamental Duty":lp("कर देना स्पष्ट रूप से सूचीबद्ध मौलिक कर्तव्य है","ਕਰ ਦੇਣਾ ਸਪਸ਼ਟ ਤੌਰ 'ਤੇ ਦਰਜ ਮੂਲ ਫ਼ਰਜ਼ ਹੈ"),
"Join the armed forces for a fixed compulsory period":lp("निश्चित अनिवार्य अवधि के लिए सशस्त्र बलों में शामिल होना","ਨਿਰਧਾਰਤ ਲਾਜ਼ਮੀ ਮਿਆਦ ਲਈ ਸਸ਼ਸਤ੍ਰ ਬਲਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਣਾ"),
"Compulsory military service for every adult citizen":lp("हर वयस्क नागरिक के लिए अनिवार्य सैन्य सेवा","ਹਰ ਬਾਲਗ ਨਾਗਰਿਕ ਲਈ ਲਾਜ਼ਮੀ ਫੌਜੀ ਸੇਵਾ"),
"Both a State directive and a citizen duty":lp("राज्य के लिए नीति-निर्देश और नागरिक का कर्तव्य—दोनों","ਰਾਜ ਲਈ ਨੀਤੀ-ਨਿਰਦੇਸ਼ ਅਤੇ ਨਾਗਰਿਕ ਦਾ ਫ਼ਰਜ਼—ਦੋਵੇਂ"),
"Only a Fundamental Right":lp("केवल मौलिक अधिकार","ਸਿਰਫ਼ ਮੂਲ ਅਧਿਕਾਰ"),
"Only a State directive":lp("केवल राज्य के लिए नीति-निर्देश","ਸਿਰਫ਼ ਰਾਜ ਲਈ ਨੀਤੀ-ਨਿਰਦੇਸ਼"),
"Only a citizen duty":lp("केवल नागरिक का कर्तव्य","ਸਿਰਫ਼ ਨਾਗਰਿਕ ਦਾ ਫ਼ਰਜ਼"),
"A Directive Principle for the State":lp("राज्य के लिए नीति-निदेशक तत्व","ਰਾਜ ਲਈ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ"),
"A Fundamental Duty of every citizen":lp("हर नागरिक का मौलिक कर्तव्य","ਹਰ ਨਾਗਰਿਕ ਦਾ ਮੂਲ ਫ਼ਰਜ਼"),
"A Fundamental Right of citizens":lp("नागरिकों का मौलिक अधिकार","ਨਾਗਰਿਕਾਂ ਦਾ ਮੂਲ ਅਧਿਕਾਰ"),
"A constitutional duty of the Supreme Court":lp("सर्वोच्च न्यायालय का संवैधानिक कर्तव्य","ਸੁਪਰੀਮ ਕੋਰਟ ਦਾ ਸੰਵਿਧਾਨਕ ਫ਼ਰਜ਼"),
"A Fundamental Duty of citizens":lp("नागरिकों का मौलिक कर्तव्य","ਨਾਗਰਿਕਾਂ ਦਾ ਮੂਲ ਫ਼ਰਜ਼"),
"A Fundamental Right":lp("मौलिक अधिकार","ਮੂਲ ਅਧਿਕਾਰ"),
"A power of the President":lp("राष्ट्रपति की शक्ति","ਰਾਸ਼ਟਰਪਤੀ ਦੀ ਸ਼ਕਤੀ"),
"Free and compulsory education from six to fourteen years":lp("6 से 14 वर्ष तक निःशुल्क और अनिवार्य शिक्षा","6 ਤੋਂ 14 ਸਾਲ ਤੱਕ ਮੁਫ਼ਤ ਅਤੇ ਲਾਜ਼ਮੀ ਸਿੱਖਿਆ"),
"Village panchayats":lp("ग्राम पंचायतें","ਪਿੰਡ ਪੰਚਾਇਤਾਂ"),
"Social and economic principles":lp("सामाजिक और आर्थिक सिद्धांत","ਸਮਾਜਿਕ ਅਤੇ ਆਰਥਿਕ ਸਿਧਾਂਤ"),
"Gandhian principles":lp("गांधीवादी सिद्धांत","ਗਾਂਧੀਵਾਦੀ ਸਿਧਾਂਤ"),
"International peace and security":lp("अंतरराष्ट्रीय शांति और सुरक्षा","ਅੰਤਰਰਾਸ਼ਟਰੀ ਸ਼ਾਂਤੀ ਅਤੇ ਸੁਰੱਖਿਆ"),
"Fundamental Rights":lp("मौलिक अधिकार","ਮੂਲ ਅਧਿਕਾਰ"),
"Ireland":lp("आयरलैंड","ਆਇਰਲੈਂਡ"),
"United States":lp("संयुक्त राज्य अमेरिका","ਸੰਯੁਕਤ ਰਾਜ ਅਮਰੀਕਾ"),
"Canada":lp("कनाडा","ਕੈਨੇਡਾ"),
"Australia":lp("ऑस्ट्रेलिया","ਆਸਟ੍ਰੇਲੀਆ"),
"USSR":lp("पूर्व सोवियत संघ","ਸਾਬਕਾ ਸੋਵੀਅਤ ਸੰਘ"),
"France":lp("फ्रांस","ਫ਼ਰਾਂਸ"),
"Swaran Singh":lp("स्वर्ण सिंह","ਸਵਰਨ ਸਿੰਘ"),
"Sarkaria":lp("सरकारिया","ਸਰਕਾਰੀਆ"),
"Punchhi":lp("पुंछी","ਪੁੰਛੀ"),
"Balwant Rai Mehta":lp("बलवंत राय मेहता","ਬਲਵੰਤ ਰਾਏ ਮਹਿਤਾ"),
"None":lp("कोई नहीं","ਕੋਈ ਨਹੀਂ"),"Only one":lp("केवल एक","ਸਿਰਫ਼ ਇੱਕ"),"Only two":lp("केवल दो","ਸਿਰਫ਼ ਦੋ"),"All three":lp("तीनों","ਤਿੰਨੇ"),
});

const STATEMENT:Readonly<Record<string,Pair>>=Object.freeze({
"Article 40 concerns village panchayats.":lp("अनुच्छेद 40 ग्राम पंचायतों से संबंधित है।","ਅਨੁਛੇਦ 40 ਪਿੰਡ ਪੰਚਾਇਤਾਂ ਬਾਰੇ ਹੈ।"),
"Article 44 concerns a uniform civil code.":lp("अनुच्छेद 44 समान नागरिक संहिता से संबंधित है।","ਅਨੁਛੇਦ 44 ਸਮਾਨ ਨਾਗਰਿਕ ਸੰਹਿਤਾ ਬਾਰੇ ਹੈ।"),
"Article 50 concerns separation of judiciary from executive.":lp("अनुच्छेद 50 न्यायपालिका को कार्यपालिका से अलग करने से संबंधित है।","ਅਨੁਛੇਦ 50 ਨਿਆਂਪਾਲਿਕਾ ਨੂੰ ਕਾਰਜਪਾਲਿਕਾ ਤੋਂ ਵੱਖ ਕਰਨ ਬਾਰੇ ਹੈ।"),
"Article 39A concerns equal justice and free legal aid.":lp("अनुच्छेद 39A समान न्याय और निःशुल्क विधिक सहायता से संबंधित है।","ਅਨੁਛੇਦ 39A ਸਮਾਨ ਨਿਆਂ ਅਤੇ ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ ਬਾਰੇ ਹੈ।"),
"Article 43A concerns workers' participation in management.":lp("अनुच्छेद 43A प्रबंधन में कामगारों की भागीदारी से संबंधित है।","ਅਨੁਛੇਦ 43A ਪ੍ਰਬੰਧ ਵਿੱਚ ਮਜ਼ਦੂਰਾਂ ਦੀ ਭਾਗੀਦਾਰੀ ਬਾਰੇ ਹੈ।"),
"Article 48A concerns protection of environment, forests and wildlife.":lp("अनुच्छेद 48A पर्यावरण, वन और वन्यजीवों की रक्षा से संबंधित है।","ਅਨੁਛੇਦ 48A ਵਾਤਾਵਰਣ, ਜੰਗਲ ਅਤੇ ਜੰਗਲੀ ਜੀਵਾਂ ਦੀ ਰੱਖਿਆ ਬਾਰੇ ਹੈ।"),
"Article 47 concerns public health.":lp("अनुच्छेद 47 लोक स्वास्थ्य से संबंधित है।","ਅਨੁਛੇਦ 47 ਜਨ ਸਿਹਤ ਬਾਰੇ ਹੈ।"),
"Article 49 concerns monuments of national importance.":lp("अनुच्छेद 49 राष्ट्रीय महत्व के स्मारकों से संबंधित है।","ਅਨੁਛੇਦ 49 ਰਾਸ਼ਟਰੀ ਮਹੱਤਤਾ ਵਾਲੇ ਸਮਾਰਕਾਂ ਬਾਰੇ ਹੈ।"),
"Article 51 concerns international peace and security.":lp("अनुच्छेद 51 अंतरराष्ट्रीय शांति और सुरक्षा से संबंधित है।","ਅਨੁਛੇਦ 51 ਅੰਤਰਰਾਸ਼ਟਰੀ ਸ਼ਾਂਤੀ ਅਤੇ ਸੁਰੱਖਿਆ ਬਾਰੇ ਹੈ।"),
"Respect the National Flag and National Anthem is a Fundamental Duty.":lp("राष्ट्रीय ध्वज और राष्ट्रगान का सम्मान करना मौलिक कर्तव्य है।","ਰਾਸ਼ਟਰੀ ਝੰਡੇ ਅਤੇ ਰਾਸ਼ਟਰੀ ਗੀਤ ਦਾ ਸਤਿਕਾਰ ਕਰਨਾ ਮੂਲ ਫ਼ਰਜ਼ ਹੈ।"),
"Protect the natural environment is a Fundamental Duty.":lp("प्राकृतिक पर्यावरण की रक्षा करना मौलिक कर्तव्य है।","ਕੁਦਰਤੀ ਵਾਤਾਵਰਣ ਦੀ ਰੱਖਿਆ ਕਰਨੀ ਮੂਲ ਫ਼ਰਜ਼ ਹੈ।"),
"Develop scientific temper is a Fundamental Duty.":lp("वैज्ञानिक दृष्टिकोण विकसित करना मौलिक कर्तव्य है।","ਵਿਗਿਆਨਕ ਸੋਚ ਵਿਕਸਿਤ ਕਰਨੀ ਮੂਲ ਫ਼ਰਜ਼ ਹੈ।"),
"Safeguard public property is a Fundamental Duty.":lp("सार्वजनिक संपत्ति की रक्षा करना मौलिक कर्तव्य है।","ਜਨਤਕ ਸੰਪਤੀ ਦੀ ਰੱਖਿਆ ਕਰਨੀ ਮੂਲ ਫ਼ਰਜ਼ ਹੈ।"),
"Strive towards excellence is a Fundamental Duty.":lp("उत्कृष्टता की ओर प्रयास करना मौलिक कर्तव्य है।","ਉੱਤਮਤਾ ਲਈ ਯਤਨ ਕਰਨਾ ਮੂਲ ਫ਼ਰਜ਼ ਹੈ।"),
"Voting in every election is expressly listed as a Fundamental Duty.":lp("हर चुनाव में मतदान करना मौलिक कर्तव्य के रूप में स्पष्ट रूप से सूचीबद्ध है।","ਹਰ ਚੋਣ ਵਿੱਚ ਵੋਟ ਪਾਉਣਾ ਮੂਲ ਫ਼ਰਜ਼ ਵਜੋਂ ਸਪਸ਼ਟ ਤੌਰ 'ਤੇ ਦਰਜ ਹੈ।"),
"Article 51A(k) concerns education opportunities for children aged six to fourteen.":lp("अनुच्छेद 51A(k) 6 से 14 वर्ष के बच्चों की शिक्षा के अवसरों से संबंधित है।","ਅਨੁਛੇਦ 51A(k) 6 ਤੋਂ 14 ਸਾਲ ਦੇ ਬੱਚਿਆਂ ਲਈ ਸਿੱਖਿਆ ਦੇ ਮੌਕਿਆਂ ਬਾਰੇ ਹੈ।"),
"It was added by the Eighty-sixth Amendment.":lp("इसे 86वें संविधान संशोधन से जोड़ा गया।","ਇਹ 86ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜਿਆ ਗਿਆ।"),
"It was one of the original ten duties added in 1976.":lp("यह 1976 में जोड़े गए मूल 10 कर्तव्यों में से एक था।","ਇਹ 1976 ਵਿੱਚ ਜੋੜੇ ਮੂਲ 10 ਫ਼ਰਜ਼ਾਂ ਵਿੱਚੋਂ ਇੱਕ ਸੀ।"),
"Directive Principles are non-justiciable.":lp("नीति-निदेशक तत्व न्यायालय से लागू नहीं कराए जा सकते।","ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ ਅਦਾਲਤ ਰਾਹੀਂ ਲਾਗੂ ਨਹੀਂ ਕਰਵਾਏ ਜਾ ਸਕਦੇ।"),
"Fundamental Duties are in Part IVA.":lp("मौलिक कर्तव्य भाग IVA में हैं।","ਮੂਲ ਫ਼ਰਜ਼ ਭਾਗ IVA ਵਿੱਚ ਹਨ।"),
"Article 48A and Article 51A(g) both concern environmental protection.":lp("अनुच्छेद 48A और 51A(g) दोनों पर्यावरण संरक्षण से संबंधित हैं।","ਅਨੁਛੇਦ 48A ਅਤੇ 51A(g) ਦੋਵੇਂ ਵਾਤਾਵਰਣ ਦੀ ਰੱਖਿਆ ਬਾਰੇ ਹਨ।"),
"Article 45 deals with early childhood care below six years.":lp("अनुच्छेद 45 छह वर्ष से कम बच्चों की प्रारंभिक देखभाल से संबंधित है।","ਅਨੁਛੇਦ 45 6 ਸਾਲ ਤੋਂ ਘੱਟ ਬੱਚਿਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਦੇਖਭਾਲ ਬਾਰੇ ਹੈ।"),
"Both provisions were given their present form by the Eighty-sixth Amendment.":lp("दोनों प्रावधानों को वर्तमान रूप 86वें संविधान संशोधन से मिला।","ਦੋਵੇਂ ਪ੍ਰਬੰਧਾਂ ਨੂੰ ਮੌਜੂਦਾ ਰੂਪ 86ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਮਿਲਿਆ।"),
"Article 43B concerns co-operative societies.":lp("अनुच्छेद 43B सहकारी समितियों से संबंधित है।","ਅਨੁਛੇਦ 43B ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਬਾਰੇ ਹੈ।"),
"It was added by the Ninety-seventh Amendment.":lp("इसे 97वें संविधान संशोधन से जोड़ा गया।","ਇਹ 97ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜਿਆ ਗਿਆ।"),
"Fundamental Duties are contained in Part IV.":lp("मौलिक कर्तव्य भाग IV में हैं।","ਮੂਲ ਫ਼ਰਜ਼ ਭਾਗ IV ਵਿੱਚ ਹਨ।"),
});

function articleForSubject(v:string){return POL_CP005_DPSP_ARTICLES_V1.find(x=>x.subject===v)?.article;}
function clauseForDuty(v:string){return POL_CP005_DUTIES_V1.find(x=>x.duty===v)?.clause;}
function article39ForSubject(v:string){return POL_CP005_ARTICLE39_CLAUSES_V1.find(x=>x.subject===v)?.clause;}

function option(v:string,l:NativeLocale):string{
  const am=v.match(/^Article (\d+[A-Z]?(?:\([a-z]\))?)$/); if(am)return ARTICLE(am[1]!,l);
  const pm=v.match(/^Part (II|III|IV|IVA|V)$/); if(pm)return PART(pm[1]!,l);
  if(/^\d+$/.test(v))return v;
  if(DPSP_SUBJECT[articleForSubject(v)??""])return native(DPSP_SUBJECT[articleForSubject(v)!]!,l);
  if(A39[article39ForSubject(v)??""])return native(A39[article39ForSubject(v)!]!,l);
  if(DUTY[clauseForDuty(v)??""])return native(DUTY[clauseForDuty(v)!]!,l);
  if(/^51A\([a-k]\)$/.test(v))return v;
  if(AMEND[v])return native(AMEND[v]!,l);
  if(ADDITIONS[v])return native(ADDITIONS[v]!,l);
  if(COMMON[v])return native(COMMON[v]!,l);
  const pair=v.match(/^Article (\d+[A-Z]?) — (.+)$/);
  if(pair){
    const a=pair[1]!, subj=pair[2]!;
    return `${ARTICLE(a,l)} — ${option(subj,l)}`;
  }
  throw new Error(`Untranslated POL-CP-005 option: ${v}`);
}

function stem(q:(typeof ENGLISH)[number],l:NativeLocale):string{
  const ql=Number(q.qlId.slice(-3));
  if(ql===1||ql===7){const a=articleForSubject(q.canonicalAnswer)!;return l==="hi"?`${ARTICLE(a,l)} का मुख्य विषय क्या है?`:`${ARTICLE(a,l)} ਕਿਸ ਬਾਰੇ ਹੈ?`;}
  if(ql===2||ql===6){const a=q.canonicalAnswer.replace("Article ","");return l==="hi"?`${native(DPSP_SUBJECT[a]!,l)} किस अनुच्छेद में है?`:`${native(DPSP_SUBJECT[a]!,l)} ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ ਹੈ?`;}
  if(ql===3){
    if(q.canonicalAnswer==="A duty of the State")return l==="hi"?"अनुच्छेद 37 के अनुसार कानून बनाते समय नीति-निदेशक तत्व लागू करना किसका कर्तव्य है?":"ਅਨੁਛੇਦ 37 ਅਨੁਸਾਰ ਕਾਨੂੰਨ ਬਣਾਉਂਦਿਆਂ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ ਲਾਗੂ ਕਰਨਾ ਕਿਸ ਦਾ ਫ਼ਰਜ਼ ਹੈ?";
    if(q.stem.startsWith("Article 37"))return l==="hi"?"अनुच्छेद 37 नीति-निदेशक तत्वों की प्रकृति को कैसे बताता है?":"ਅਨੁਛੇਦ 37 ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਦੀ ਪ੍ਰਕਿਰਤੀ ਨੂੰ ਕਿਵੇਂ ਦਰਸਾਉਂਦਾ ਹੈ?";
    return l==="hi"?"राज्य के नीति-निदेशक तत्वों की प्रकृति के बारे में कौन-सा कथन सही है?":"ਰਾਜ ਦੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਦੀ ਪ੍ਰਕਿਰਤੀ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?";
  }
  if(ql===4){const c=article39ForSubject(q.canonicalAnswer)!;return l==="hi"?`${ARTICLE(c,l)} किस विषय से संबंधित है?`:`${ARTICLE(c,l)} ਕਿਸ ਵਿਸ਼ੇ ਬਾਰੇ ਹੈ?`;}
  if(ql===5)return l==="hi"?"निम्न में से कौन-सा अनुच्छेद–नीति-निदेशक तत्व सही सुमेलित है?":"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅਨੁਛੇਦ–ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  if(ql===8){const a=articleForSubject(q.stem.split(" was added")[0]??"");return l==="hi"?`${a?ARTICLE(a,l):"यह प्रावधान"} किस संविधान संशोधन से जोड़ा गया?`:`${a?ARTICLE(a,l):"ਇਹ ਪ੍ਰਬੰਧ"} ਕਿਹੜੀ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜਿਆ ਗਿਆ?`;}
  if(ql===9){const am=Object.keys(AMEND).find(x=>q.stem.startsWith(x))!;return l==="hi"?`${native(AMEND[am]!,l)} का सही संबंध किससे है?`:`${native(AMEND[am]!,l)} ਦਾ ਸਹੀ ਸੰਬੰਧ ਕਿਸ ਨਾਲ ਹੈ?`;}
  if(ql===10){
    if(q.canonicalAnswer==="Part IV")return l==="hi"?"राज्य के नीति-निदेशक तत्व संविधान के किस भाग में हैं?":"ਰਾਜ ਦੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ ਸੰਵਿਧਾਨ ਦੇ ਕਿਹੜੇ ਭਾਗ ਵਿੱਚ ਹਨ?";
    if(q.canonicalAnswer==="Part IVA")return l==="hi"?"मौलिक कर्तव्य संविधान के किस भाग में हैं?":"ਮੂਲ ਫ਼ਰਜ਼ ਸੰਵਿਧਾਨ ਦੇ ਕਿਹੜੇ ਭਾਗ ਵਿੱਚ ਹਨ?";
    return l==="hi"?"मौलिक कर्तव्य किस अनुच्छेद में सूचीबद्ध हैं?":"ਮੂਲ ਫ਼ਰਜ਼ ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਦਰਜ ਹਨ?";
  }
  if(ql===11){const c=clauseForDuty(q.canonicalAnswer)!;return l==="hi"?`${c} के तहत नागरिक का कर्तव्य क्या है?`:`${c} ਹੇਠ ਨਾਗਰਿਕ ਦਾ ਕਿਹੜਾ ਫ਼ਰਜ਼ ਹੈ?`;}
  if(ql===12){const c=q.canonicalAnswer;const dutyText=native(DUTY[c]!,l);return l==="hi"?`${dutyText} किस खंड में है?`:`${dutyText} ਕਿਹੜੇ ਖੰਡ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ ਹੈ?`;}
  if(ql===13)return l==="hi"?"निम्न में से कौन-सा मौलिक कर्तव्य है?":"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਮੂਲ ਫ਼ਰਜ਼ ਹੈ?";
  if(ql===14)return l==="hi"?"निम्न में से कौन-सा अनुच्छेद 51A में मौलिक कर्तव्य के रूप में स्पष्ट रूप से सूचीबद्ध नहीं है?":"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਅਨੁਛੇਦ 51A ਵਿੱਚ ਮੂਲ ਫ਼ਰਜ਼ ਵਜੋਂ ਸਪਸ਼ਟ ਤੌਰ 'ਤੇ ਦਰਜ ਨਹੀਂ ਹੈ?";
  if(ql===15){
    if(q.canonicalAnswer==="10")return l==="hi"?"42वें संविधान संशोधन से मूल रूप से कितने मौलिक कर्तव्य जोड़े गए थे?":"42ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਸ਼ੁਰੂ ਵਿੱਚ ਕਿੰਨੇ ਮੂਲ ਫ਼ਰਜ਼ ਜੋੜੇ ਗਏ ਸਨ?";
    if(q.canonicalAnswer==="Eighty-sixth Amendment")return l==="hi"?"11वाँ मौलिक कर्तव्य, अनुच्छेद 51A(k), किस संविधान संशोधन से जोड़ा गया?":"11ਵਾਂ ਮੂਲ ਫ਼ਰਜ਼, ਅਨੁਛੇਦ 51A(k), ਕਿਹੜੀ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜਿਆ ਗਿਆ?";
    return l==="hi"?"मौलिक कर्तव्य संविधान में किस संशोधन से जोड़े गए?":"ਮੂਲ ਫ਼ਰਜ਼ ਸੰਵਿਧਾਨ ਵਿੱਚ ਕਿਹੜੀ ਸੋਧ ਨਾਲ ਜੋੜੇ ਗਏ?";
  }
  if(ql===16){
    if(q.canonicalAnswer===DPSP_SUBJECT["45"]?.hi||q.canonicalAnswer==="Early childhood care and education below six years")return l==="hi"?"वर्तमान अनुच्छेद 45 किससे संबंधित है?":"ਮੌਜੂਦਾ ਅਨੁਛੇਦ 45 ਕਿਸ ਬਾਰੇ ਹੈ?";
    if(q.stem.startsWith("A parent's"))return l==="hi"?"6 से 14 वर्ष के बच्चे को शिक्षा का अवसर देना माता-पिता या अभिभावक का कर्तव्य किस अनुच्छेद में है?":"6 ਤੋਂ 14 ਸਾਲ ਦੇ ਬੱਚੇ ਨੂੰ ਸਿੱਖਿਆ ਦਾ ਮੌਕਾ ਦੇਣਾ ਮਾਤਾ-ਪਿਤਾ ਜਾਂ ਸਰਪ੍ਰਸਤ ਦਾ ਫ਼ਰਜ਼ ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਹੈ?";
    return l==="hi"?"86वें संविधान संशोधन ने अनुच्छेद 45 में बदलाव के साथ कौन-सा मौलिक कर्तव्य जोड़ा?":"86ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨੇ ਅਨੁਛੇਦ 45 ਵਿੱਚ ਬਦਲਾਅ ਦੇ ਨਾਲ ਕਿਹੜਾ ਮੂਲ ਫ਼ਰਜ਼ ਜੋੜਿਆ?";
  }
  if(ql===17){
    if(q.stem.startsWith("Protect"))return l==="hi"?"प्राकृतिक पर्यावरण की रक्षा और सुधार करना क्या है?":"ਕੁਦਰਤੀ ਵਾਤਾਵਰਣ ਦੀ ਰੱਖਿਆ ਅਤੇ ਸੁਧਾਰ ਕਰਨਾ ਕੀ ਹੈ?";
    if(q.stem.startsWith("Organise"))return l==="hi"?"ग्राम पंचायतों का संगठन करना क्या है?":"ਪਿੰਡ ਪੰਚਾਇਤਾਂ ਬਣਾਉਣਾ ਕੀ ਹੈ?";
    return l==="hi"?"वैज्ञानिक दृष्टिकोण विकसित करना क्या है?":"ਵਿਗਿਆਨਕ ਸੋਚ ਵਿਕਸਿਤ ਕਰਨੀ ਕੀ ਹੈ?";
  }
  if([18,19,20].includes(ql)){
    const lines=q.stem.split("\n").slice(1,4).map(x=>x.replace(/^\d\. /,""));
    return [l==="hi"?"निम्न कथनों पर विचार कीजिए:":"ਹੇਠ ਲਿਖੇ ਬਿਆਨਾਂ 'ਤੇ ਵਿਚਾਰ ਕਰੋ:",...lines.map((x,i)=>`${i+1}. ${native(STATEMENT[x]!,l)}`),l==="hi"?"कितने कथन सही हैं?":"ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?"].join("\n");
  }
  if(ql===21){
    const ans=q.canonicalAnswer;
    if(ans==="Social and economic principles")return l==="hi"?"अनुच्छेद 39(d) में समान काम का समान वेतन सामान्य वर्गीकरण में किस श्रेणी में रखा जाता है?":"ਅਨੁਛੇਦ 39(d) ਵਿੱਚ ਇੱਕੋ ਕੰਮ ਦਾ ਇੱਕੋ ਵੇਤਨ ਆਮ ਵਰਗੀਕਰਨ ਵਿੱਚ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ?";
    if(ans==="Gandhian principles")return l==="hi"?"अनुच्छेद 40 में ग्राम पंचायतों का संगठन सामान्यतः किस श्रेणी से जोड़ा जाता है?":"ਅਨੁਛੇਦ 40 ਵਿੱਚ ਪਿੰਡ ਪੰਚਾਇਤਾਂ ਦੀ ਸਥਾਪਨਾ ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਨਾਲ ਜੋੜੀ ਜਾਂਦੀ ਹੈ?";
    return l==="hi"?"अनुच्छेद 51 मुख्यतः किस प्रकार के सिद्धांतों से संबंधित है?":"ਅਨੁਛੇਦ 51 ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੇ ਕਿਸਮ ਦੇ ਸਿਧਾਂਤਾਂ ਬਾਰੇ ਹੈ?";
  }
  if(ql===22){
    if(q.canonicalAnswer==="Ireland")return l==="hi"?"भारतीय संविधान के नीति-निदेशक तत्वों का विचार किस देश के संविधान से प्रभावित था?":"ਭਾਰਤੀ ਸੰਵਿਧਾਨ ਦੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਦਾ ਵਿਚਾਰ ਕਿਹੜੇ ਦੇਸ਼ ਦੇ ਸੰਵਿਧਾਨ ਤੋਂ ਪ੍ਰਭਾਵਿਤ ਸੀ?";
    if(q.canonicalAnswer==="USSR")return l==="hi"?"भारतीय संविधान के मौलिक कर्तव्य किस पूर्व देश के संविधान से प्रभावित थे?":"ਭਾਰਤੀ ਸੰਵਿਧਾਨ ਦੇ ਮੂਲ ਫ਼ਰਜ਼ ਕਿਹੜੇ ਸਾਬਕਾ ਦੇਸ਼ ਦੇ ਸੰਵਿਧਾਨ ਤੋਂ ਪ੍ਰਭਾਵਿਤ ਸਨ?";
    return l==="hi"?"मौलिक कर्तव्यों की सिफारिश से जुड़ी समिति के अध्यक्ष कौन थे?":"ਮੂਲ ਫ਼ਰਜ਼ਾਂ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਨਾਲ ਜੁੜੀ ਕਮੇਟੀ ਦੇ ਮੁਖੀ ਕੌਣ ਸਨ?";
  }
  throw new Error(`${q.questionId}: unsupported CP005 QL ${ql}`);
}

function explanation(q:(typeof ENGLISH)[number],l:NativeLocale):string{
  const ql=Number(q.qlId.slice(-3));
  const ans=option(q.canonicalAnswer,l);
  if([1,2,6,7].includes(ql)){
    const a=q.canonicalAnswer.startsWith("Article ")?q.canonicalAnswer.replace("Article ",""):articleForSubject(q.canonicalAnswer);
    if(a&&DPSP_RULE[a])return native(DPSP_RULE[a]!,l);
    return l==="hi"?`${ARTICLE(a!,l)} का विषय ${native(DPSP_SUBJECT[a!]!,l)} है।`:`${ARTICLE(a!,l)} ${native(DPSP_SUBJECT[a!]!,l)} ਬਾਰੇ ਹੈ।`;
  }
  if(ql===3)return native(DPSP_RULE["37"]!,l);
  if(ql===4){const c=article39ForSubject(q.canonicalAnswer)!;return l==="hi"?`सही संबंध: ${ARTICLE(c,l)} — ${native(A39[c]!,l)}।`:`ਸਹੀ ਮਿਲਾਨ: ${ARTICLE(c,l)} — ${native(A39[c]!,l)}।`;}
  if(ql===5)return l==="hi"?`सही सुमेलित जोड़ी है: ${ans}।`:`ਸਹੀ ਮਿਲਾਨ: ${ans}।`;
  if(ql===8)return l==="hi"?`यह प्रावधान 42वें संविधान संशोधन से जोड़ा गया था।`:`ਇਹ ਪ੍ਰਬੰਧ 42ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜਿਆ ਗਿਆ ਸੀ।`;
  if(ql===9)return l==="hi"?`सही संबंध है: ${ans}।`:`ਸਹੀ ਸੰਬੰਧ: ${ans}।`;
  if(ql===10)return l==="hi"?`सही उत्तर है: ${ans}। नीति-निदेशक तत्व भाग IV में और मौलिक कर्तव्य भाग IVA के अनुच्छेद 51A में हैं।`:`ਸਹੀ ਜਵਾਬ: ${ans}। ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ ਭਾਗ IV ਵਿੱਚ ਹਨ ਅਤੇ ਮੂਲ ਫ਼ਰਜ਼ ਭਾਗ IVA ਦੇ ਅਨੁਛੇਦ 51A ਵਿੱਚ ਹਨ।`;
  if([11,12,13,14].includes(ql)){
    const c=clauseForDuty(q.canonicalAnswer)||q.canonicalAnswer;
    if(DUTY[c])return l==="hi"?`${c}: ${native(DUTY[c]!,l)}।`:`${c}: ${native(DUTY[c]!,l)}।`;
    return l==="hi"?`${ans} अनुच्छेद 51A में स्पष्ट रूप से सूचीबद्ध मौलिक कर्तव्य नहीं है।`:`${ans} ਅਨੁਛੇਦ 51A ਵਿੱਚ ਸਪਸ਼ਟ ਤੌਰ 'ਤੇ ਦਰਜ ਮੂਲ ਫ਼ਰਜ਼ ਨਹੀਂ ਹੈ।`;
  }
  if(ql===15)return l==="hi"?"42वें संविधान संशोधन से भाग IVA और मूल 10 मौलिक कर्तव्य जोड़े गए; 86वें संशोधन ने बाद में अनुच्छेद 51A(k) जोड़ा।":"42ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਭਾਗ IVA ਅਤੇ ਮੂਲ 10 ਮੂਲ ਫ਼ਰਜ਼ ਜੋੜੇ ਗਏ; 86ਵੀਂ ਸੋਧ ਨੇ ਬਾਅਦ ਵਿੱਚ ਅਨੁਛੇਦ 51A(k) ਜੋੜਿਆ।";
  if(ql===16)return l==="hi"?"86वें संविधान संशोधन ने अनुच्छेद 45 को प्रारंभिक बाल देखभाल पर केंद्रित किया और अनुच्छेद 51A(k) जोड़ा।":"86ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਨੇ ਅਨੁਛੇਦ 45 ਨੂੰ ਛੋਟੇ ਬੱਚਿਆਂ ਦੀ ਸ਼ੁਰੂਆਤੀ ਦੇਖਭਾਲ ਅਤੇ ਸਿੱਖਿਆ 'ਤੇ ਕੇਂਦਰਿਤ ਕੀਤਾ ਅਤੇ ਅਨੁਛੇਦ 51A(k) ਜੋੜਿਆ।";
  if(ql===17)return l==="hi"?`सही उत्तर है: ${ans}। राज्य के निर्देश और नागरिक के मौलिक कर्तव्य को अलग-अलग पहचानें।`:`ਸਹੀ ਜਵਾਬ: ${ans}। ਰਾਜ ਲਈ ਨੀਤੀ-ਨਿਰਦੇਸ਼ ਅਤੇ ਨਾਗਰਿਕ ਦੇ ਮੂਲ ਫ਼ਰਜ਼ ਨੂੰ ਵੱਖ-ਵੱਖ ਪਛਾਣੋ।`;
  if([18,19,20].includes(ql))return l==="hi"?`सही उत्तर है: ${ans}। हर कथन को उसके अनुच्छेद या मौलिक कर्तव्य से मिलाकर देखें।`:`ਸਹੀ ਜਵਾਬ: ${ans}। ਹਰ ਬਿਆਨ ਨੂੰ ਉਸਦੇ ਅਨੁਛੇਦ ਜਾਂ ਮੂਲ ਫ਼ਰਜ਼ ਨਾਲ ਮਿਲਾ ਕੇ ਵੇਖੋ।`;
  if(ql===21)return l==="hi"?`परंपरागत वर्गीकरण में सही श्रेणी है: ${ans}।`:`ਰਵਾਇਤੀ ਵਰਗੀਕਰਨ ਵਿੱਚ ਸਹੀ ਸ਼੍ਰੇਣੀ: ${ans}।`;
  if(ql===22)return l==="hi"?`सही उत्तर है: ${ans}।`:`ਸਹੀ ਜਵਾਬ: ${ans}।`;
  return l==="hi"?`सही उत्तर है: ${ans}।`:`ਸਹੀ ਜਵਾਬ: ${ans}।`;
}

function localize(q:(typeof ENGLISH)[number],locale:PolLocaleV1):PolLocalizedQuestionV1{
  if(locale==="en")return {...q,options:[...q.options],locale,localizationV1:{version:POL_LOCALIZATION_V1,englishQuestionId:q.questionId,semanticInvariant:true,cpInvariant:true,qlInvariant:true,difficultyInvariant:true,sourceInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,reviewOnly:true}};
  let options=q.options.map(x=>option(x,locale));
  let s=stem(q,locale),e=explanation(q,locale);
  if(locale==="pa"){options=options.map(applyPolityPunjabiNativePassV1);s=applyPolityPunjabiNativePassV1(s);e=applyPolityPunjabiNativePassV1(e);}
  return {...q,questionId:`${q.questionId}-${locale.toUpperCase()}`,stem:s,options,canonicalAnswer:options[q.correctIndex]!,explanation:e,locale,localizationV1:{version:POL_LOCALIZATION_V1,englishQuestionId:q.questionId,semanticInvariant:true,cpInvariant:true,qlInvariant:true,difficultyInvariant:true,sourceInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,reviewOnly:true}};
}

export function generatePolCp005LocalizedReviewV1(locale:PolLocaleV1):PolLocalizedQuestionV1[]{return ENGLISH.map(q=>localize(q,locale));}
export const POL_CP005_LOCALIZATION_V1_ENGLISH_COUNT=ENGLISH.length;
