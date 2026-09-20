import { applyPolityFinalEditorialStemPass } from "../pol-001-final-editorial-stem-pass-v1";
import {
  POL_CP006_BASIC_STRUCTURE_CASES_V1,
  POL_CP006_BASIC_STRUCTURE_FEATURES_V1,
  POL_CP006_HIGH_YIELD_AMENDMENTS_V1,
  POL_CP006_RATIFICATION_AREAS_V1,
  POL_CP006_SCHEDULES_V1,
} from "../amendments-basic-structure-schedules/pol-cp006-facts";
import { generatePolCp006ReviewBatchV3 } from "../amendments-basic-structure-schedules/pol-cp006-review-generator-v3";
import { POL_LOCALIZATION_V1, type PolLocaleV1, type PolLocalizedQuestionV1 } from "./pol-localization-types-v1";
import { applyPolityPunjabiNativePassV1 } from "./pol-punjabi-native-pass-v1";

type NativeLocale=Exclude<PolLocaleV1,"en">;
type Pair=Readonly<{hi:string;pa:string}>;
const lp=(hi:string,pa:string):Pair=>({hi,pa});
const native=(p:Pair,l:NativeLocale)=>p[l];
const ARTICLE=(n:string,l:NativeLocale)=>l==="hi"?`अनुच्छेद ${n}`:`ਅਨੁਛੇਦ ${n}`;
const ENGLISH=Object.freeze(generatePolCp006ReviewBatchV3().map(q=>applyPolityFinalEditorialStemPass(q)));

const ARTICLE368_SUBJECT=lp("संविधान में संशोधन करने की संसद की शक्ति और उसकी प्रक्रिया","ਸੰਵਿਧਾਨ ਵਿੱਚ ਸੋਧ ਕਰਨ ਦੀ ਸੰਸਦ ਦੀ ਸ਼ਕਤੀ ਅਤੇ ਇਸ ਦੀ ਪ੍ਰਕਿਰਿਆ");

const AMEND:Readonly<Record<string,Pair>>=Object.freeze({
"First Amendment":lp("1वाँ संविधान संशोधन","1ਲੀ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Seventh Amendment":lp("7वाँ संविधान संशोधन","7ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Twenty-fourth Amendment":lp("24वाँ संविधान संशोधन","24ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Forty-second Amendment":lp("42वाँ संविधान संशोधन","42ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Forty-fourth Amendment":lp("44वाँ संविधान संशोधन","44ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Fifty-second Amendment":lp("52वाँ संविधान संशोधन","52ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Sixty-first Amendment":lp("61वाँ संविधान संशोधन","61ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Seventy-third Amendment":lp("73वाँ संविधान संशोधन","73ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Seventy-fourth Amendment":lp("74वाँ संविधान संशोधन","74ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Eighty-sixth Amendment":lp("86वाँ संविधान संशोधन","86ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"Ninety-first Amendment":lp("91वाँ संविधान संशोधन","91ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"One Hundred and First Amendment":lp("101वाँ संविधान संशोधन","101ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"One Hundred and Third Amendment":lp("103वाँ संविधान संशोधन","103ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
"One Hundred and Sixth Amendment":lp("106वाँ संविधान संशोधन","106ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ"),
});

const CHANGE:Readonly<Record<string,Pair>>=Object.freeze({
"Inserted Articles 31A and 31B and added the Ninth Schedule among other changes":lp("अनुच्छेद 31A और 31B जोड़े तथा अन्य बदलावों के साथ नौवीं अनुसूची जोड़ी","ਅਨੁਛੇਦ 31A ਅਤੇ 31B ਜੋੜੇ ਅਤੇ ਹੋਰ ਬਦਲਾਵਾਂ ਨਾਲ 9ਵੀਂ ਅਨੁਸੂਚੀ ਜੋੜੀ"),
"Major constitutional changes connected with reorganisation of States":lp("राज्यों के पुनर्गठन से जुड़े बड़े संवैधानिक बदलाव","ਰਾਜਾਂ ਦੀ ਮੁੜ ਬਣਤਰ ਨਾਲ ਜੁੜੇ ਵੱਡੇ ਸੰਵਿਧਾਨਕ ਬਦਲਾਅ"),
"Affirmed Parliament's constituent power to amend the Constitution and made presidential assent to a duly passed amendment Bill mandatory":lp("संविधान में संशोधन करने की संसद की शक्ति की पुष्टि की और विधिवत पारित संशोधन विधेयक पर राष्ट्रपति की स्वीकृति अनिवार्य की","ਸੰਸਦ ਕੋਲ ਸੰਵਿਧਾਨ ਸੋਧਣ ਦੀ ਸ਼ਕਤੀ ਹੋਣ ਦੀ ਪੁਸ਼ਟੀ ਕੀਤੀ ਅਤੇ ਢੰਗ ਨਾਲ ਪਾਸ ਸੋਧ ਬਿੱਲ 'ਤੇ ਰਾਸ਼ਟਰਪਤੀ ਦੀ ਮਨਜ਼ੂਰੀ ਲਾਜ਼ਮੀ ਕੀਤੀ"),
"Wide-ranging amendment; added Socialist, Secular and Integrity to the Preamble, Fundamental Duties and several Directive Principle changes":lp("व्यापक संशोधन; प्रस्तावना में समाजवादी, पंथनिरपेक्ष और अखंडता से जुड़े बदलाव, मौलिक कर्तव्य तथा कई नीति-निदेशक बदलाव किए","ਵਿਆਪਕ ਸੋਧ; ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ਸਮਾਜਵਾਦੀ, ਧਰਮ ਨਿਰਪੱਖ ਅਤੇ ਅਖੰਡਤਾ ਨਾਲ ਜੁੜੇ ਬਦਲਾਅ, ਮੂਲ ਫ਼ਰਜ਼ ਅਤੇ ਕਈ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਬਦਲਾਅ ਕੀਤੇ"),
"Reversed or modified several Forty-second Amendment-era changes and shifted the right to property out of Fundamental Rights":lp("42वें संशोधन के कई बदलावों को पलटा या बदला और संपत्ति के अधिकार को मौलिक अधिकारों से बाहर किया","42ਵੀਂ ਸੋਧ ਦੇ ਕਈ ਬਦਲਾਅ ਵਾਪਸ ਕੀਤੇ ਜਾਂ ਬਦਲੇ ਅਤੇ ਸੰਪਤੀ ਦੇ ਅਧਿਕਾਰ ਨੂੰ ਮੂਲ ਅਧਿਕਾਰਾਂ ਤੋਂ ਬਾਹਰ ਕੀਤਾ"),
"Added the Tenth Schedule on anti-defection":lp("दल-बदल विरोधी प्रावधानों वाली दसवीं अनुसूची जोड़ी","ਦਲ-ਬਦਲ ਵਿਰੋਧੀ ਪ੍ਰਬੰਧਾਂ ਵਾਲੀ 10ਵੀਂ ਅਨੁਸੂਚੀ ਜੋੜੀ"),
"Reduced the voting age for Lok Sabha and State Assembly elections from 21 to 18 years":lp("लोकसभा और राज्य विधानसभा चुनावों की मतदान आयु 21 से घटाकर 18 वर्ष की","ਲੋਕ ਸਭਾ ਅਤੇ ਰਾਜ ਵਿਧਾਨ ਸਭਾ ਚੋਣਾਂ ਲਈ ਵੋਟ ਦੀ ਉਮਰ 21 ਤੋਂ ਘਟਾ ਕੇ 18 ਸਾਲ ਕੀਤੀ"),
"Added Part IX and the Eleventh Schedule for Panchayats":lp("पंचायतों के लिए भाग IX और ग्यारहवीं अनुसूची जोड़ी","ਪੰਚਾਇਤਾਂ ਲਈ ਭਾਗ IX ਅਤੇ 11ਵੀਂ ਅਨੁਸੂਚੀ ਜੋੜੀ"),
"Added Part IXA and the Twelfth Schedule for Municipalities":lp("नगरपालिकाओं के लिए भाग IXA और बारहवीं अनुसूची जोड़ी","ਨਗਰ ਪਾਲਿਕਾਵਾਂ ਲਈ ਭਾਗ IXA ਅਤੇ 12ਵੀਂ ਅਨੁਸੂਚੀ ਜੋੜੀ"),
"Inserted Article 21A, changed Article 45 and added Fundamental Duty 51A(k)":lp("अनुच्छेद 21A जोड़ा, अनुच्छेद 45 बदला और मौलिक कर्तव्य 51A(k) जोड़ा","ਅਨੁਛੇਦ 21A ਜੋੜਿਆ, ਅਨੁਛੇਦ 45 ਬਦਲਿਆ ਅਤੇ ਮੂਲ ਫ਼ਰਜ਼ 51A(k) ਜੋੜਿਆ"),
"Limited the size of Councils of Ministers and strengthened anti-defection-related provisions":lp("मंत्रिपरिषद के आकार पर सीमा लगाई और दल-बदल विरोधी प्रावधान मजबूत किए","ਮੰਤਰੀ ਮੰਡਲ ਦੇ ਆਕਾਰ 'ਤੇ ਹੱਦ ਲਾਈ ਅਤੇ ਦਲ-ਬਦਲ ਵਿਰੋਧੀ ਪ੍ਰਬੰਧ ਮਜ਼ਬੂਤ ਕੀਤੇ"),
"Introduced the constitutional framework for the Goods and Services Tax":lp("वस्तु एवं सेवा कर के लिए संवैधानिक ढाँचा लाया","ਵਸਤੂ ਅਤੇ ਸੇਵਾ ਕਰ ਲਈ ਸੰਵਿਧਾਨਕ ਢਾਂਚਾ ਲਿਆਂਦਾ"),
"Provided for reservation for economically weaker sections under the constitutional framework":lp("आर्थिक रूप से कमजोर वर्गों के आरक्षण का संवैधानिक प्रावधान किया","ਆਰਥਿਕ ਤੌਰ 'ਤੇ ਕਮਜ਼ੋਰ ਵਰਗਾਂ ਲਈ ਰਾਖਵੇਂਕਰਨ ਦਾ ਸੰਵਿਧਾਨਕ ਪ੍ਰਬੰਧ ਕੀਤਾ"),
"Provides for reservation of one-third of seats for women in the Lok Sabha, State Legislative Assemblies and the Legislative Assembly of the National Capital Territory of Delhi, subject to its constitutional commencement and delimitation framework":lp("लोकसभा, राज्य विधानसभाओं और दिल्ली विधानसभा में महिलाओं के लिए एक-तिहाई सीटों के आरक्षण का प्रावधान करता है, संवैधानिक प्रारंभ और परिसीमन व्यवस्था के अधीन","ਲੋਕ ਸਭਾ, ਰਾਜ ਵਿਧਾਨ ਸਭਾਵਾਂ ਅਤੇ ਦਿੱਲੀ ਵਿਧਾਨ ਸਭਾ ਵਿੱਚ ਔਰਤਾਂ ਲਈ ਇੱਕ-ਤਿਹਾਈ ਸੀਟਾਂ ਦੇ ਰਾਖਵੇਂਕਰਨ ਦਾ ਪ੍ਰਬੰਧ ਕਰਦਾ ਹੈ, ਸੰਵਿਧਾਨਕ ਲਾਗੂ ਹੋਣ ਅਤੇ ਹੱਦਬੰਦੀ ਦੀ ਪ੍ਰਕਿਰਿਆ ਦੇ ਅਧੀਨ"),
});

const SCHEDULE_NAME:Readonly<Record<string,Pair>>=Object.freeze({
"First Schedule":lp("पहली अनुसूची","1ਲੀ ਅਨੁਸੂਚੀ"),"Second Schedule":lp("दूसरी अनुसूची","2ਵੀਂ ਅਨੁਸੂਚੀ"),"Third Schedule":lp("तीसरी अनुसूची","3ਵੀਂ ਅਨੁਸੂਚੀ"),"Fourth Schedule":lp("चौथी अनुसूची","4ਥੀ ਅਨੁਸੂਚੀ"),"Fifth Schedule":lp("पाँचवीं अनुसूची","5ਵੀਂ ਅਨੁਸੂਚੀ"),"Sixth Schedule":lp("छठी अनुसूची","6ਵੀਂ ਅਨੁਸੂਚੀ"),"Seventh Schedule":lp("सातवीं अनुसूची","7ਵੀਂ ਅਨੁਸੂਚੀ"),"Eighth Schedule":lp("आठवीं अनुसूची","8ਵੀਂ ਅਨੁਸੂਚੀ"),"Ninth Schedule":lp("नौवीं अनुसूची","9ਵੀਂ ਅਨੁਸੂਚੀ"),"Tenth Schedule":lp("दसवीं अनुसूची","10ਵੀਂ ਅਨੁਸੂਚੀ"),"Eleventh Schedule":lp("ग्यारहवीं अनुसूची","11ਵੀਂ ਅਨੁਸੂਚੀ"),"Twelfth Schedule":lp("बारहवीं अनुसूची","12ਵੀਂ ਅਨੁਸੂਚੀ"),
});
const SCHEDULE_SUBJECT:Readonly<Record<string,Pair>>=Object.freeze({
"First Schedule":lp("राज्य और संघ राज्य क्षेत्र","ਰਾਜ ਅਤੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼"),
"Second Schedule":lp("कुछ संवैधानिक पदों के वेतन, भत्ते और विशेषाधिकार","ਕੁਝ ਸੰਵਿਧਾਨਕ ਅਹੁਦਿਆਂ ਦੇ ਵੇਤਨ, ਭੱਤੇ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਅਧਿਕਾਰ"),
"Third Schedule":lp("शपथ और प्रतिज्ञान के प्रारूप","ਸਹੁੰ ਅਤੇ ਪ੍ਰਤਿਗਿਆ ਦੇ ਰੂਪ"),
"Fourth Schedule":lp("राज्यसभा में सीटों का आवंटन","ਰਾਜ ਸਭਾ ਵਿੱਚ ਸੀਟਾਂ ਦੀ ਵੰਡ"),
"Fifth Schedule":lp("अनुसूचित क्षेत्रों और अनुसूचित जनजातियों का प्रशासन व नियंत्रण","ਅਨੁਸੂਚਿਤ ਖੇਤਰਾਂ ਅਤੇ ਅਨੁਸੂਚਿਤ ਜਨਜਾਤੀਆਂ ਦੇ ਪ੍ਰਸ਼ਾਸਨ ਤੇ ਨਿਯੰਤਰਣ"),
"Sixth Schedule":lp("असम, मेघालय, त्रिपुरा और मिजोरम के जनजातीय क्षेत्रों का प्रशासन","ਅਸਾਮ, ਮੇਘਾਲਿਆ, ਤ੍ਰਿਪੁਰਾ ਅਤੇ ਮਿਜ਼ੋਰਮ ਦੇ ਜਨਜਾਤੀ ਖੇਤਰਾਂ ਦਾ ਪ੍ਰਸ਼ਾਸਨ"),
"Seventh Schedule":lp("संघ, राज्य और समवर्ती सूचियाँ","ਸੰਘ, ਰਾਜ ਅਤੇ ਸਮਵਰਤੀ ਸੂਚੀਆਂ"),
"Eighth Schedule":lp("मान्यता प्राप्त भाषाएँ","ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਭਾਸ਼ਾਵਾਂ"),
"Ninth Schedule":lp("विशेष संवैधानिक अनुसूची में रखे अधिनियम और विनियम","ਖ਼ਾਸ ਸੰਵਿਧਾਨਕ ਅਨੁਸੂਚੀ ਵਿੱਚ ਰੱਖੇ ਕਾਨੂੰਨ ਅਤੇ ਨਿਯਮ"),
"Tenth Schedule":lp("दल-बदल विरोधी प्रावधान","ਦਲ-ਬਦਲ ਵਿਰੋਧੀ ਪ੍ਰਬੰਧ"),
"Eleventh Schedule":lp("पंचायतें","ਪੰਚਾਇਤਾਂ"),
"Twelfth Schedule":lp("नगरपालिकाएँ","ਨਗਰ ਪਾਲਿਕਾਵਾਂ"),
});

const BASIC:Readonly<Record<string,Pair>>=Object.freeze({
"Supremacy of the Constitution":lp("संविधान की सर्वोच्चता","ਸੰਵਿਧਾਨ ਦੀ ਸਰਵੋਚਤਾ"),
"Republican and democratic form of government":lp("गणतांत्रिक और लोकतांत्रिक शासन-प्रणाली","ਗਣਤੰਤਰੀ ਅਤੇ ਲੋਕਤੰਤਰੀ ਸ਼ਾਸਨ-ਪ੍ਰਣਾਲੀ"),
"Secular character of the Constitution":lp("संविधान का पंथनिरपेक्ष स्वरूप","ਸੰਵਿਧਾਨ ਦਾ ਧਰਮ ਨਿਰਪੱਖ ਸਰੂਪ"),
"Separation of powers":lp("शक्तियों का पृथक्करण","ਸ਼ਕਤੀਆਂ ਦੀ ਵੰਡ"),
"Federal character of the Constitution":lp("संविधान का संघीय स्वरूप","ਸੰਵਿਧਾਨ ਦਾ ਸੰਘੀ ਸਰੂਪ"),
"Judicial review":lp("न्यायिक समीक्षा","ਨਿਆਂਇਕ ਸਮੀਖਿਆ"),
"Limited amending power of Parliament":lp("संसद की सीमित संशोधन शक्ति","ਸੰਸਦ ਦੀ ਸੀਮਿਤ ਸੋਧ ਸ਼ਕਤੀ"),
"Harmony and balance between Fundamental Rights and Directive Principles":lp("मौलिक अधिकारों और नीति-निदेशक तत्वों के बीच सामंजस्य और संतुलन","ਮੂਲ ਅਧਿਕਾਰਾਂ ਅਤੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਵਿਚਕਾਰ ਤਾਲਮੇਲ ਅਤੇ ਸੰਤੁਲਨ"),
});

const CASE_NAME:Readonly<Record<string,Pair>>=Object.freeze({
"Kesavananda Bharati v. State of Kerala":lp("केशवानंद भारती बनाम केरल राज्य","ਕੇਸ਼ਵਾਨੰਦ ਭਾਰਤੀ ਬਨਾਮ ਕੇਰਲ ਰਾਜ"),
"Minerva Mills v. Union of India":lp("मिनर्वा मिल्स बनाम भारत संघ","ਮਿਨਰਵਾ ਮਿਲਜ਼ ਬਨਾਮ ਭਾਰਤ ਸੰਘ"),
"S. R. Bommai v. Union of India":lp("एस. आर. बोम्मई बनाम भारत संघ","ਐਸ. ਆਰ. ਬੋਮਮਈ ਬਨਾਮ ਭਾਰਤ ਸੰਘ"),
"I. R. Coelho v. State of Tamil Nadu":lp("आई. आर. कोएल्हो बनाम तमिलनाडु राज्य","ਆਈ. ਆਰ. ਕੋਏਲ੍ਹੋ ਬਨਾਮ ਤਮਿਲਨਾਡੂ ਰਾਜ"),
});
const CASE_PRINCIPLE:Readonly<Record<string,Pair>>=Object.freeze({
"Parliament may amend the Constitution, but it cannot destroy or damage its basic structure.":lp("संसद संविधान में संशोधन कर सकती है, लेकिन उसकी मूल संरचना को नष्ट या क्षतिग्रस्त नहीं कर सकती।","ਸੰਸਦ ਸੰਵਿਧਾਨ ਵਿੱਚ ਸੋਧ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਦੀ ਮੂਲ ਸੰਰਚਨਾ ਨੂੰ ਨਸ਼ਟ ਜਾਂ ਖ਼ਰਾਬ ਨਹੀਂ ਕਰ ਸਕਦੀ।"),
"Limited amending power and harmony between Fundamental Rights and Directive Principles are part of the basic structure.":lp("सीमित संशोधन शक्ति और मौलिक अधिकारों व नीति-निदेशक तत्वों के बीच संतुलन मूल संरचना का भाग हैं।","ਸੀਮਿਤ ਸੋਧ ਸ਼ਕਤੀ ਅਤੇ ਮੂਲ ਅਧਿਕਾਰਾਂ ਤੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਵਿਚਕਾਰ ਸੰਤੁਲਨ ਮੂਲ ਸੰਰਚਨਾ ਦਾ ਹਿੱਸਾ ਹਨ।"),
"Secularism is part of the basic structure of the Constitution.":lp("पंथनिरपेक्षता संविधान की मूल संरचना का भाग है।","ਧਰਮ ਨਿਰਪੱਖਤਾ ਸੰਵਿਧਾਨ ਦੀ ਮੂਲ ਸੰਰਚਨਾ ਦਾ ਹਿੱਸਾ ਹੈ।"),
"Post-24 April 1973 Ninth Schedule insertions remain open to basic-structure review where constitutionally relevant rights are damaged.":lp("24 अप्रैल 1973 के बाद नौवीं अनुसूची में जोड़े कानून, यदि संवैधानिक रूप से महत्वपूर्ण अधिकारों को क्षति पहुँचाते हैं, तो मूल-संरचना समीक्षा के अधीन रह सकते हैं।","24 ਅਪ੍ਰੈਲ 1973 ਤੋਂ ਬਾਅਦ 9ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਜੋੜੇ ਕਾਨੂੰਨ, ਜੇ ਸੰਵਿਧਾਨਕ ਤੌਰ 'ਤੇ ਮਹੱਤਵਪੂਰਨ ਅਧਿਕਾਰਾਂ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾਉਂਦੇ ਹਨ, ਤਾਂ ਮੂਲ-ਸੰਰਚਨਾ ਸਮੀਖਿਆ ਦੇ ਅਧੀਨ ਰਹਿ ਸਕਦੇ ਹਨ।"),
});

const RATIFY:Readonly<Record<string,Pair>>=Object.freeze({
"Election of the President under Articles 54 and 55":lp("अनुच्छेद 54 और 55 के तहत राष्ट्रपति का निर्वाचन","ਅਨੁਛੇਦ 54 ਅਤੇ 55 ਹੇਠ ਰਾਸ਼ਟਰਪਤੀ ਦੀ ਚੋਣ"),
"Extent of executive power of the Union and the States under Articles 73 and 162":lp("अनुच्छेद 73 और 162 के तहत संघ और राज्यों की कार्यपालिका शक्ति की सीमा","ਅਨੁਛੇਦ 73 ਅਤੇ 162 ਹੇਠ ਸੰਘ ਅਤੇ ਰਾਜਾਂ ਦੀ ਕਾਰਜਪਾਲਿਕਾ ਸ਼ਕਤੀ ਦੀ ਹੱਦ"),
"Specified Supreme Court and High Court provisions":lp("सर्वोच्च न्यायालय और उच्च न्यायालय से जुड़े निर्दिष्ट प्रावधान","ਸੁਪਰੀਮ ਕੋਰਟ ਅਤੇ ਹਾਈ ਕੋਰਟ ਨਾਲ ਜੁੜੇ ਨਿਰਧਾਰਤ ਪ੍ਰਬੰਧ"),
"Distribution of legislative powers between the Union and the States":lp("संघ और राज्यों के बीच विधायी शक्तियों का वितरण","ਸੰਘ ਅਤੇ ਰਾਜਾਂ ਵਿਚਕਾਰ ਕਾਨੂੰਨ ਬਣਾਉਣ ਦੀਆਂ ਸ਼ਕਤੀਆਂ ਦੀ ਵੰਡ"),
"Any of the Lists in the Seventh Schedule":lp("सातवीं अनुसूची की किसी सूची में परिवर्तन","7ਵੀਂ ਅਨੁਸੂਚੀ ਦੀ ਕਿਸੇ ਸੂਚੀ ਵਿੱਚ ਬਦਲਾਅ"),
"Representation of States in Parliament":lp("संसद में राज्यों का प्रतिनिधित्व","ਸੰਸਦ ਵਿੱਚ ਰਾਜਾਂ ਦੀ ਨੁਮਾਇੰਦਗੀ"),
"Article 368 itself":lp("स्वयं अनुच्छेद 368","ਅਨੁਛੇਦ 368 ਖੁਦ"),
});

const COMMON:Readonly<Record<string,Pair>>=Object.freeze({
"Power of Parliament to amend the Constitution and procedure therefor":ARTICLE368_SUBJECT,
"Emergency provisions":lp("आपातकालीन प्रावधान","ਐਮਰਜੈਂਸੀ ਪ੍ਰਬੰਧ"),
"Citizenship at commencement":lp("संविधान लागू होने के समय नागरिकता","ਸੰਵਿਧਾਨ ਲਾਗੂ ਹੋਣ ਵੇਲੇ ਨਾਗਰਿਕਤਾ"),
"Inter-State trade":lp("अंतर्राज्यीय व्यापार","ਅੰਤਰ-ਰਾਜੀ ਵਪਾਰ"),
"Either House of Parliament":lp("संसद के किसी भी सदन में","ਸੰਸਦ ਦੇ ਕਿਸੇ ਵੀ ਸਦਨ ਵਿੱਚ"),
"Lok Sabha only":lp("केवल लोकसभा में","ਸਿਰਫ਼ ਲੋਕ ਸਭਾ ਵਿੱਚ"),
"Rajya Sabha only":lp("केवल राज्यसभा में","ਸਿਰਫ਼ ਰਾਜ ਸਭਾ ਵਿੱਚ"),
"A State Legislature only":lp("केवल किसी राज्य विधानमंडल में","ਸਿਰਫ਼ ਕਿਸੇ ਰਾਜ ਵਿਧਾਨ ਮੰਡਲ ਵਿੱਚ"),
"A minister or a private member":lp("मंत्री या निजी सदस्य","ਮੰਤਰੀ ਜਾਂ ਗੈਰ-ਸਰਕਾਰੀ ਮੈਂਬਰ"),
"Only the Prime Minister":lp("केवल प्रधानमंत्री","ਸਿਰਫ਼ ਪ੍ਰਧਾਨ ਮੰਤਰੀ"),
"Only the Law Minister":lp("केवल विधि मंत्री","ਸਿਰਫ਼ ਕਾਨੂੰਨ ਮੰਤਰੀ"),
"Only the President":lp("केवल राष्ट्रपति","ਸਿਰਫ਼ ਰਾਸ਼ਟਰਪਤੀ"),
"It may be introduced in either House of Parliament.":lp("इसे संसद के किसी भी सदन में पेश किया जा सकता है।","ਇਹ ਸੰਸਦ ਦੇ ਕਿਸੇ ਵੀ ਸਦਨ ਵਿੱਚ ਪੇਸ਼ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"),
"It must begin in Lok Sabha.":lp("इसे लोकसभा से ही शुरू होना चाहिए।","ਇਹ ਲੋਕ ਸਭਾ ਤੋਂ ਹੀ ਸ਼ੁਰੂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।"),
"It must begin in Rajya Sabha.":lp("इसे राज्यसभा से ही शुरू होना चाहिए।","ਇਹ ਰਾਜ ਸਭਾ ਤੋਂ ਹੀ ਸ਼ੁਰੂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।"),
"It is introduced first in a State Legislature.":lp("इसे पहले राज्य विधानमंडल में पेश किया जाता है।","ਇਹ ਪਹਿਲਾਂ ਰਾਜ ਵਿਧਾਨ ਮੰਡਲ ਵਿੱਚ ਪੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"),
"A majority of the total membership plus at least two-thirds of members present and voting":lp("कुल सदस्य संख्या का बहुमत और उपस्थित व मतदान करने वाले सदस्यों का कम-से-कम दो-तिहाई","ਕੁੱਲ ਮੈਂਬਰ ਗਿਣਤੀ ਦਾ ਬਹੁਮਤ ਅਤੇ ਹਾਜ਼ਰ ਤੇ ਵੋਟ ਪਾਉਣ ਵਾਲੇ ਮੈਂਬਰਾਂ ਦਾ ਘੱਟੋ-ਘੱਟ ਦੋ-ਤਿਹਾਈ"),
"Members present and voting":lp("उपस्थित और मतदान करने वाले सदस्य","ਹਾਜ਼ਰ ਅਤੇ ਵੋਟ ਪਾਉਣ ਵਾਲੇ ਮੈਂਬਰ"),
"Special majority":lp("विशेष बहुमत","ਵਿਸ਼ੇਸ਼ ਬਹੁਮਤ"),
"Simple majority of members present and voting":lp("उपस्थित और मतदान करने वाले सदस्यों का साधारण बहुमत","ਹਾਜ਼ਰ ਅਤੇ ਵੋਟ ਪਾਉਣ ਵਾਲੇ ਮੈਂਬਰਾਂ ਦਾ ਸਧਾਰਣ ਬਹੁਮਤ"),
"Two-thirds of the total membership only":lp("केवल कुल सदस्य संख्या का दो-तिहाई","ਸਿਰਫ਼ ਕੁੱਲ ਮੈਂਬਰ ਗਿਣਤੀ ਦਾ ਦੋ-ਤਿਹਾਈ"),
"Unanimous approval of both Houses":lp("दोनों सदनों की सर्वसम्मत स्वीकृति","ਦੋਵੇਂ ਸਦਨਾਂ ਦੀ ਸਰਬਸੰਮਤੀ ਮਨਜ਼ੂਰੀ"),
"A change in the salary of a Union minister":lp("किसी केंद्रीय मंत्री के वेतन में बदलाव","ਕਿਸੇ ਕੇਂਦਰੀ ਮੰਤਰੀ ਦੇ ਵੇਤਨ ਵਿੱਚ ਬਦਲਾਅ"),
"Creation of a new district":lp("नए जिले का गठन","ਨਵਾਂ ਜ਼ਿਲ੍ਹਾ ਬਣਾਉਣਾ"),
"No":lp("नहीं","ਨਹੀਂ"),"Yes, in every case":lp("हाँ, हर मामले में","ਹਾਂ, ਹਰ ਮਾਮਲੇ ਵਿੱਚ"),"Only if the Rajya Sabha requests it":lp("केवल राज्यसभा के अनुरोध पर","ਸਿਰਫ਼ ਰਾਜ ਸਭਾ ਦੀ ਮੰਗ 'ਤੇ"),"Only during an emergency":lp("केवल आपातकाल के दौरान","ਸਿਰਫ਼ ਐਮਰਜੈਂਸੀ ਦੌਰਾਨ"),
"Shall give assent":lp("स्वीकृति देना अनिवार्य है","ਮਨਜ਼ੂਰੀ ਦੇਣੀ ਲਾਜ਼ਮੀ ਹੈ"),"May return it for reconsideration":lp("पुनर्विचार के लिए लौटा सकते हैं","ਮੁੜ ਵਿਚਾਰ ਲਈ ਵਾਪਸ ਭੇਜ ਸਕਦੇ ਹਨ"),"Must send it to the Supreme Court":lp("सर्वोच्च न्यायालय को भेजना होगा","ਸੁਪਰੀਮ ਕੋਰਟ ਨੂੰ ਭੇਜਣਾ ਲਾਜ਼ਮੀ ਹੈ"),"May withhold assent permanently":lp("स्थायी रूप से स्वीकृति रोक सकते हैं","ਹਮੇਸ਼ਾਂ ਲਈ ਮਨਜ਼ੂਰੀ ਰੋਕ ਸਕਦੇ ਹਨ"),
"There is no joint sitting for resolving disagreement between the Houses.":lp("सदनों के मतभेद को सुलझाने के लिए संयुक्त बैठक का प्रावधान नहीं है।","ਸਦਨਾਂ ਦੇ ਅਸਹਿਮਤੀ ਨੂੰ ਸੁਲਝਾਉਣ ਲਈ ਸਾਂਝੀ ਬੈਠਕ ਦਾ ਪ੍ਰਬੰਧ ਨਹੀਂ ਹੈ।"),
"Not deemed a constitutional amendment for Article 368 purposes":lp("अनुच्छेद 368 के उद्देश्य से संविधान संशोधन नहीं माना जाता","ਅਨੁਛੇਦ 368 ਲਈ ਸੰਵਿਧਾਨ ਸੋਧ ਨਹੀਂ ਮੰਨਿਆ ਜਾਂਦਾ"),
"Parliament by ordinary law after the required State Assembly resolution":lp("आवश्यक राज्य विधानसभा प्रस्ताव के बाद संसद के साधारण कानून से","ਲੋੜੀਂਦੇ ਰਾਜ ਵਿਧਾਨ ਸਭਾ ਪ੍ਰਸਤਾਵ ਤੋਂ ਬਾਅਦ ਸੰਸਦ ਦੇ ਸਧਾਰਣ ਕਾਨੂੰਨ ਰਾਹੀਂ"),
"Formation or alteration of States under Articles 2 to 4":lp("अनुच्छेद 2 से 4 के तहत राज्यों का गठन या परिवर्तन","ਅਨੁਛੇਦ 2 ਤੋਂ 4 ਹੇਠ ਰਾਜਾਂ ਦੀ ਰਚਨਾ ਜਾਂ ਬਦਲਾਅ"),
"Always an Article 368 amendment requiring State ratification":lp("हमेशा अनुच्छेद 368 का संशोधन, जिसमें राज्यों की पुष्टि जरूरी है","ਹਮੇਸ਼ਾਂ ਅਨੁਛੇਦ 368 ਦੀ ਸੋਧ, ਜਿਸ ਲਈ ਰਾਜਾਂ ਦੀ ਪੁਸ਼ਟੀ ਲਾਜ਼ਮੀ ਹੈ"),
"Possible only by referendum":lp("केवल जनमत-संग्रह से संभव","ਸਿਰਫ਼ ਜਨਮਤ ਸੰਗ੍ਰਹਿ ਰਾਹੀਂ ਸੰਭਵ"),
"Possible only through a joint sitting":lp("केवल संयुक्त बैठक से संभव","ਸਿਰਫ਼ ਸਾਂਝੀ ਬੈਠਕ ਰਾਹੀਂ ਸੰਭਵ"),
"May amend the Constitution but cannot destroy its basic structure":lp("संविधान में संशोधन कर सकती है, लेकिन उसकी मूल संरचना नष्ट नहीं कर सकती","ਸੰਵਿਧਾਨ ਵਿੱਚ ਸੋਧ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਦੀ ਮੂਲ ਸੰਰਚਨਾ ਨਸ਼ਟ ਨਹੀਂ ਕਰ ਸਕਦੀ"),
"Kesavananda Bharati v. State of Kerala":lp("केशवानंद भारती बनाम केरल राज्य","ਕੇਸ਼ਵਾਨੰਦ ਭਾਰਤੀ ਬਨਾਮ ਕੇਰਲ ਰਾਜ"),
"There is no single closed constitutional list of all basic-structure features.":lp("मूल संरचना की सभी विशेषताओं की कोई एक बंद संवैधानिक सूची नहीं है।","ਮੂਲ ਸੰਰਚਨਾ ਦੀਆਂ ਸਾਰੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੀ ਕੋਈ ਇੱਕ ਬੰਦ ਸੰਵਿਧਾਨਕ ਸੂਚੀ ਨਹੀਂ ਹੈ।"),
"Cannot amend any Fundamental Right":lp("किसी भी मौलिक अधिकार में संशोधन नहीं कर सकती","ਕਿਸੇ ਵੀ ਮੂਲ ਅਧਿਕਾਰ ਵਿੱਚ ਸੋਧ ਨਹੀਂ ਕਰ ਸਕਦੀ"),
"May destroy any constitutional feature by special majority":lp("विशेष बहुमत से किसी भी संवैधानिक विशेषता को समाप्त कर सकती है","ਵਿਸ਼ੇਸ਼ ਬਹੁਮਤ ਨਾਲ ਕਿਸੇ ਵੀ ਸੰਵਿਧਾਨਕ ਵਿਸ਼ੇਸ਼ਤਾ ਨੂੰ ਖਤਮ ਕਰ ਸਕਦੀ ਹੈ"),
"Can amend the Constitution only after a referendum":lp("केवल जनमत-संग्रह के बाद संविधान संशोधन कर सकती है","ਸਿਰਫ਼ ਜਨਮਤ ਸੰਗ੍ਰਹਿ ਤੋਂ ਬਾਅਦ ਸੰਵਿਧਾਨ ਵਿੱਚ ਸੋਧ ਕਰ ਸਕਦੀ ਹੈ"),
"A fixed number of Union ministers":lp("केंद्रीय मंत्रियों की निश्चित संख्या","ਕੇਂਦਰੀ ਮੰਤਰੀਆਂ ਦੀ ਨਿਰਧਾਰਤ ਗਿਣਤੀ"),
"A permanent ban on creating new States":lp("नए राज्य बनाने पर स्थायी रोक","ਨਵੇਂ ਰਾਜ ਬਣਾਉਣ 'ਤੇ ਸਥਾਈ ਰੋਕ"),
"A constitutional requirement for one national language":lp("एक राष्ट्रीय भाषा की संवैधानिक अनिवार्यता","ਇੱਕ ਰਾਸ਼ਟਰੀ ਭਾਸ਼ਾ ਦੀ ਸੰਵਿਧਾਨਕ ਲਾਜ਼ਮੀ ਸ਼ਰਤ"),
"Fundamental Rights and Directive Principles":lp("मौलिक अधिकार और नीति-निदेशक तत्व","ਮੂਲ ਅਧਿਕਾਰ ਅਤੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ"),
"An unlimited power to amend the Constitution would itself damage the basic structure.":lp("संविधान संशोधन की असीमित शक्ति स्वयं मूल संरचना को क्षति पहुँचाएगी।","ਸੰਵਿਧਾਨ ਸੋਧ ਦੀ ਬੇਹੱਦ ਸ਼ਕਤੀ ਖੁਦ ਮੂਲ ਸੰਰਚਨਾ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾਏਗੀ।"),
"Absolute supremacy of Directive Principles over all Fundamental Rights":lp("सभी मौलिक अधिकारों पर नीति-निदेशक तत्वों की पूर्ण सर्वोच्चता","ਸਾਰੇ ਮੂਲ ਅਧਿਕਾਰਾਂ ਉੱਤੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਦੀ ਪੂਰੀ ਸਰਵੋਚਤਾ"),
"Unlimited amending power":lp("असीमित संशोधन शक्ति","ਬੇਹੱਦ ਸੋਧ ਸ਼ਕਤੀ"),
"Removal of judicial review from constitutional amendments":lp("संविधान संशोधनों से न्यायिक समीक्षा हटाना","ਸੰਵਿਧਾਨੀ ਸੋਧਾਂ ਤੋਂ ਨਿਆਂਇਕ ਸਮੀਖਿਆ ਹਟਾਉਣਾ"),
"Secularism":lp("पंथनिरपेक्षता","ਧਰਮ ਨਿਰਪੱਖਤਾ"),
"Unlimited parliamentary sovereignty":lp("संसद की असीमित सर्वोच्चता","ਸੰਸਦ ਦੀ ਬੇਹੱਦ ਸਰਵੋਚਤਾ"),
"One-party government":lp("एक-दलीय सरकार","ਇੱਕ-ਪਾਰਟੀ ਸਰਕਾਰ"),
"A fixed territorial map of States":lp("राज्यों का स्थायी सीमाई नक्शा","ਰਾਜਾਂ ਦਾ ਸਥਾਈ ਹੱਦਬੰਦੀ ਨਕਸ਼ਾ"),
"Post-24 April 1973 insertions can face basic-structure review":lp("24 अप्रैल 1973 के बाद जोड़े प्रावधान मूल-संरचना समीक्षा के अधीन हो सकते हैं","24 ਅਪ੍ਰੈਲ 1973 ਤੋਂ ਬਾਅਦ ਜੋੜੇ ਪ੍ਰਬੰਧ ਮੂਲ-ਸੰਰਚਨਾ ਸਮੀਖਿਆ ਦੇ ਅਧੀਨ ਹੋ ਸਕਦੇ ਹਨ"),
"24 April 1973":lp("24 अप्रैल 1973","24 ਅਪ੍ਰੈਲ 1973"),
"Placement in the Ninth Schedule does not create complete immunity from basic-structure review for post-Kesavananda insertions.":lp("केशवानंद के बाद नौवीं अनुसूची में रखना मूल-संरचना समीक्षा से पूर्ण सुरक्षा नहीं देता।","ਕੇਸ਼ਵਾਨੰਦ ਤੋਂ ਬਾਅਦ 9ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਰੱਖਣਾ ਮੂਲ-ਸੰਰਚਨਾ ਸਮੀਖਿਆ ਤੋਂ ਪੂਰੀ ਛੂਟ ਨਹੀਂ ਦਿੰਦਾ।"),
"Every Ninth Schedule law is completely immune from judicial review":lp("नौवीं अनुसूची का हर कानून न्यायिक समीक्षा से पूरी तरह मुक्त है","9ਵੀਂ ਅਨੁਸੂਚੀ ਦਾ ਹਰ ਕਾਨੂੰਨ ਨਿਆਂਇਕ ਸਮੀਖਿਆ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਕਤ ਹੈ"),
"The Ninth Schedule was created by the Forty-fourth Amendment":lp("नौवीं अनुसूची 44वें संशोधन से बनी","9ਵੀਂ ਅਨੁਸੂਚੀ 44ਵੀਂ ਸੋਧ ਨਾਲ ਬਣੀ"),
"Only State laws can be placed in the Ninth Schedule":lp("केवल राज्य कानून नौवीं अनुसूची में रखे जा सकते हैं","ਸਿਰਫ਼ ਰਾਜ ਕਾਨੂੰਨ 9ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ"),
"Scheduled Areas and Scheduled Tribes":lp("अनुसूचित क्षेत्र और अनुसूचित जनजातियाँ","ਅਨੁਸੂਚਿਤ ਖੇਤਰ ਅਤੇ ਅਨੁਸੂਚਿਤ ਜਨਜਾਤੀਆਂ"),
"Assam, Meghalaya, Tripura and Mizoram":lp("असम, मेघालय, त्रिपुरा और मिजोरम","ਅਸਾਮ, ਮੇਘਾਲਿਆ, ਤ੍ਰਿਪੁਰਾ ਅਤੇ ਮਿਜ਼ੋਰਮ"),
"The Fifth deals broadly with Scheduled Areas and Scheduled Tribes; the Sixth has a special tribal-area framework for four northeastern States.":lp("पाँचवीं अनुसूची व्यापक रूप से अनुसूचित क्षेत्रों और जनजातियों से संबंधित है; छठी अनुसूची चार पूर्वोत्तर राज्यों के लिए विशेष जनजातीय ढाँचा देती है।","5ਵੀਂ ਅਨੁਸੂਚੀ ਵਿਆਪਕ ਤੌਰ 'ਤੇ ਅਨੁਸੂਚਿਤ ਖੇਤਰਾਂ ਅਤੇ ਜਨਜਾਤੀਆਂ ਬਾਰੇ ਹੈ; 6ਵੀਂ ਅਨੁਸੂਚੀ ਚਾਰ ਉੱਤਰ-ਪੂਰਬੀ ਰਾਜਾਂ ਲਈ ਖ਼ਾਸ ਜਨਜਾਤੀ ਢਾਂਚਾ ਦਿੰਦੀ ਹੈ।"),
"Union and State legislative lists":lp("संघ और राज्य की विधायी सूचियाँ","ਸੰਘ ਅਤੇ ਰਾਜ ਦੀਆਂ ਵਿਧਾਨਕ ਸੂਚੀਆਂ"),
"Anti-defection rules":lp("दल-बदल विरोधी नियम","ਦਲ-ਬਦਲ ਵਿਰੋਧੀ ਨਿਯਮ"),
"Municipal functions":lp("नगरपालिका कार्य","ਨਗਰ ਪਾਲਿਕਾ ਦੇ ਕੰਮ"),
"Recognised languages":lp("मान्यता प्राप्त भाषाएँ","ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਭਾਸ਼ਾਵਾਂ"),
"Anti-defection provisions":lp("दल-बदल विरोधी प्रावधान","ਦਲ-ਬਦਲ ਵਿਰੋਧੀ ਪ੍ਰਬੰਧ"),
"Panchayats":lp("पंचायतें","ਪੰਚਾਇਤਾਂ"),"Municipalities":lp("नगरपालिकाएँ","ਨਗਰ ਪਾਲਿਕਾਵਾਂ"),"Anti-defection":lp("दल-बदल विरोध","ਦਲ-ਬਦਲ ਵਿਰੋਧ"),
"None":lp("कोई नहीं","ਕੋਈ ਨਹੀਂ"),"Only one":lp("केवल एक","ਸਿਰਫ਼ ਇੱਕ"),"Only two":lp("केवल दो","ਸਿਰਫ਼ ਦੋ"),"All three":lp("तीनों","ਤਿੰਨੇ"),
"Forty-second — Fundamental Duties; Forty-fourth — right to property moved out of Fundamental Rights":lp("42वाँ—मौलिक कर्तव्य; 44वाँ—संपत्ति का अधिकार मौलिक अधिकारों से बाहर","42ਵੀਂ—ਮੂਲ ਫ਼ਰਜ਼; 44ਵੀਂ—ਸੰਪਤੀ ਦਾ ਅਧਿਕਾਰ ਮੂਲ ਅਧਿਕਾਰਾਂ ਤੋਂ ਬਾਹਰ"),
"Forty-second — voting age 18; Forty-fourth — anti-defection":lp("42वाँ—मतदान आयु 18; 44वाँ—दल-बदल विरोध","42ਵੀਂ—ਵੋਟ ਦੀ ਉਮਰ 18; 44ਵੀਂ—ਦਲ-ਬਦਲ ਵਿਰੋਧ"),
"Forty-second — GST; Forty-fourth — Panchayats":lp("42वाँ—जीएसटी; 44वाँ—पंचायतें","42ਵੀਂ—ਜੀਐਸਟੀ; 44ਵੀਂ—ਪੰਚਾਇਤਾਂ"),
"Forty-second — EWS reservation; Forty-fourth — Municipalities":lp("42वाँ—आर्थिक रूप से कमजोर वर्गों का आरक्षण; 44वाँ—नगरपालिकाएँ","42ਵੀਂ—ਆਰਥਿਕ ਤੌਰ 'ਤੇ ਕਮਜ਼ੋਰ ਵਰਗਾਂ ਦਾ ਰਾਖਵਾਂਕਰਨ; 44ਵੀਂ—ਨਗਰ ਪਾਲਿਕਾਵਾਂ"),
"Anti-defection under the Tenth Schedule":lp("दसवीं अनुसूची के तहत दल-बदल विरोध","10ਵੀਂ ਅਨੁਸੂਚੀ ਹੇਠ ਦਲ-ਬਦਲ ਵਿਰੋਧ"),
});

const STATEMENT:Readonly<Record<string,Pair>>=Object.freeze({
"Article 368 allows constitutional amendment by Parliament.":lp("अनुच्छेद 368 संसद को संविधान संशोधन की शक्ति देता है।","ਅਨੁਛੇਦ 368 ਸੰਸਦ ਨੂੰ ਸੰਵਿਧਾਨ ਸੋਧਣ ਦੀ ਸ਼ਕਤੀ ਦਿੰਦਾ ਹੈ।"),
"The basic structure doctrine limits the amending power.":lp("मूल संरचना सिद्धांत संशोधन शक्ति को सीमित करता है।","ਮੂਲ ਸੰਰਚਨਾ ਸਿਧਾਂਤ ਸੋਧ ਸ਼ਕਤੀ ਨੂੰ ਸੀਮਿਤ ਕਰਦਾ ਹੈ।"),
"The Seventh Schedule contains the Union, State and Concurrent Lists.":lp("सातवीं अनुसूची में संघ, राज्य और समवर्ती सूचियाँ हैं।","7ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਸੰਘ, ਰਾਜ ਅਤੇ ਸਮਵਰਤੀ ਸੂਚੀਆਂ ਹਨ।"),
"The Tenth Schedule concerns anti-defection.":lp("दसवीं अनुसूची दल-बदल विरोध से संबंधित है।","10ਵੀਂ ਅਨੁਸੂਚੀ ਦਲ-ਬਦਲ ਵਿਰੋਧ ਬਾਰੇ ਹੈ।"),
"The Eleventh Schedule concerns Panchayats.":lp("ग्यारहवीं अनुसूची पंचायतों से संबंधित है।","11ਵੀਂ ਅਨੁਸੂਚੀ ਪੰਚਾਇਤਾਂ ਬਾਰੇ ਹੈ।"),
"The Twelfth Schedule contains 29 Panchayat subjects.":lp("बारहवीं अनुसूची में पंचायतों के 29 विषय हैं।","12ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਪੰਚਾਇਤਾਂ ਦੇ 29 ਵਿਸ਼ੇ ਹਨ।"),
"Kesavananda Bharati is associated with the basic structure doctrine.":lp("केशवानंद भारती मूल संरचना सिद्धांत से जुड़ा है।","ਕੇਸ਼ਵਾਨੰਦ ਭਾਰਤੀ ਮੂਲ ਸੰਰਚਨਾ ਸਿਧਾਂਤ ਨਾਲ ਜੁੜਿਆ ਹੈ।"),
"Minerva Mills is associated with limited amending power.":lp("मिनर्वा मिल्स सीमित संशोधन शक्ति से जुड़ा है।","ਮਿਨਰਵਾ ਮਿਲਜ਼ ਸੀਮਿਤ ਸੋਧ ਸ਼ਕਤੀ ਨਾਲ ਜੁੜਿਆ ਹੈ।"),
"A joint sitting can resolve disagreement on a Constitution Amendment Bill.":lp("संविधान संशोधन विधेयक पर मतभेद संयुक्त बैठक से सुलझाया जा सकता है।","ਸੰਵਿਧਾਨ ਸੋਧ ਬਿੱਲ 'ਤੇ ਅਸਹਿਮਤੀ ਸਾਂਝੀ ਬੈਠਕ ਨਾਲ ਸੁਲਝਾਈ ਜਾ ਸਕਦੀ ਹੈ।"),
});

function amendByChange(v:string){return POL_CP006_HIGH_YIELD_AMENDMENTS_V1.find(x=>x.change===v)?.amendment;}
function scheduleBySubject(v:string){return POL_CP006_SCHEDULES_V1.find(x=>x.subject===v)?.schedule;}
function caseByPrinciple(v:string){return POL_CP006_BASIC_STRUCTURE_CASES_V1.find(x=>x.principle===v)?.caseName;}

function option(v:string,l:NativeLocale):string{
 const a=v.match(/^Article (\d+[A-Z]?)$/); if(a)return ARTICLE(a[1]!,l);
 if(v===POL_CP006_HIGH_YIELD_AMENDMENTS_V1[0]?.change||CHANGE[v])return native(CHANGE[v]!,l);
 if(AMEND[v])return native(AMEND[v]!,l);
 if(SCHEDULE_NAME[v])return native(SCHEDULE_NAME[v]!,l);
 const s=scheduleBySubject(v); if(s)return native(SCHEDULE_SUBJECT[s]!,l);
 if(BASIC[v])return native(BASIC[v]!,l);
 const c=caseByPrinciple(v); if(c)return native(CASE_PRINCIPLE[v]!,l);
 if(CASE_NAME[v])return native(CASE_NAME[v]!,l);
 if(RATIFY[v])return native(RATIFY[v]!,l);
 if(COMMON[v])return native(COMMON[v]!,l);
 if(/^\d+$/.test(v))return v;
 if(v.includes(" → ")){
   return v.split(" → ").map(x=>AMEND[x]?native(AMEND[x]!,l):x).join(" → ");
 }
 throw new Error(`Untranslated POL-CP-006 option: ${v}`);
}

function stem(q:(typeof ENGLISH)[number],l:NativeLocale):string{
 const ql=Number(q.qlId.slice(-3));
 if(ql===1){
   if(q.canonicalAnswer==="Article 368")return l==="hi"?"संविधान संशोधन की मुख्य प्रक्रिया किस अनुच्छेद में दी गई है?":"ਸੰਵਿਧਾਨ ਸੋਧ ਦੀ ਮੁੱਖ ਪ੍ਰਕਿਰਿਆ ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਦਿੱਤੀ ਗਈ ਹੈ?";
   return l==="hi"?"अनुच्छेद 368 मुख्य रूप से किससे संबंधित है?":"ਅਨੁਛੇਦ 368 ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਸ ਬਾਰੇ ਹੈ?";
 }
 if(ql===2){
   if(q.canonicalAnswer==="Either House of Parliament")return l==="hi"?"संविधान संशोधन विधेयक कहाँ पेश किया जा सकता है?":"ਸੰਵਿਧਾਨ ਸੋਧ ਬਿੱਲ ਕਿੱਥੇ ਪੇਸ਼ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?";
   if(q.canonicalAnswer==="A minister or a private member")return l==="hi"?"संविधान संशोधन विधेयक कौन पेश कर सकता है?":"ਸੰਵਿਧਾਨ ਸੋਧ ਬਿੱਲ ਕੌਣ ਪੇਸ਼ ਕਰ ਸਕਦਾ ਹੈ?";
   return l==="hi"?"संविधान संशोधन विधेयक पेश करने के बारे में कौन-सा कथन सही है?":"ਸੰਵਿਧਾਨ ਸੋਧ ਬਿੱਲ ਪੇਸ਼ ਕਰਨ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?";
 }
 if(ql===3){
   if(q.canonicalAnswer==="Members present and voting")return l==="hi"?"अनुच्छेद 368 के दो-तिहाई बहुमत की गणना में किन सदस्यों को गिना जाता है?":"ਅਨੁਛੇਦ 368 ਦੇ ਦੋ-ਤਿਹਾਈ ਬਹੁਮਤ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਕਿਹੜੇ ਮੈਂਬਰ ਗਿਣੇ ਜਾਂਦੇ ਹਨ?";
   if(q.canonicalAnswer==="Special majority")return l==="hi"?"अनुच्छेद 368 के संशोधन के लिए प्रत्येक सदन में सामान्यतः कौन-सा बहुमत चाहिए?":"ਅਨੁਛੇਦ 368 ਦੀ ਸੋਧ ਲਈ ਹਰ ਸਦਨ ਵਿੱਚ ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜਾ ਬਹੁਮਤ ਚਾਹੀਦਾ ਹੈ?";
   return l==="hi"?"अनुच्छेद 368 के विशेष बहुमत में कौन-सी शर्तें पूरी करनी होती हैं?":"ਅਨੁਛੇਦ 368 ਦੇ ਵਿਸ਼ੇਸ਼ ਬਹੁਮਤ ਲਈ ਕਿਹੜੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?";
 }
 if(ql===4)return l==="hi"?"अनुच्छेद 368 के तहत निम्न में से किस बदलाव के लिए कम-से-कम आधे राज्य विधानमंडलों की पुष्टि चाहिए?":"ਅਨੁਛੇਦ 368 ਅਨੁਸਾਰ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਬਦਲਾਅ ਲਈ ਘੱਟੋ-ਘੱਟ ਅੱਧੇ ਰਾਜ ਵਿਧਾਨ ਮੰਡਲਾਂ ਦੀ ਪੁਸ਼ਟੀ ਲੋੜੀਂਦੀ ਹੈ?";
 if(ql===5){
   if(q.canonicalAnswer==="No")return l==="hi"?"संविधान संशोधन विधेयक पर दोनों सदनों में मतभेद हो तो क्या संयुक्त बैठक हो सकती है?":"ਸੰਵਿਧਾਨ ਸੋਧ ਬਿੱਲ 'ਤੇ ਦੋਵੇਂ ਸਦਨਾਂ ਵਿੱਚ ਅਸਹਿਮਤੀ ਹੋਵੇ ਤਾਂ ਕੀ ਸਾਂਝੀ ਬੈਠਕ ਹੋ ਸਕਦੀ ਹੈ?";
   if(q.canonicalAnswer==="Shall give assent")return l==="hi"?"अनुच्छेद 368 के अनुसार विधिवत पारित संविधान संशोधन विधेयक पर राष्ट्रपति क्या करेंगे?":"ਅਨੁਛੇਦ 368 ਅਨੁਸਾਰ ਢੰਗ ਨਾਲ ਪਾਸ ਸੰਵਿਧਾਨ ਸੋਧ ਬਿੱਲ 'ਤੇ ਰਾਸ਼ਟਰਪਤੀ ਕੀ ਕਰਨਗੇ?";
   return l==="hi"?"अनुच्छेद 368 के संशोधन विधेयक के बारे में कौन-सा कथन सही है?":"ਅਨੁਛੇਦ 368 ਦੇ ਸੋਧ ਬਿੱਲ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?";
 }
 if(ql===6){
   if(q.canonicalAnswer.startsWith("Not deemed"))return l==="hi"?"अनुच्छेद 2 और 3 के तहत राज्य की सीमा या क्षेत्र बदलने वाला कानून अनुच्छेद 368 के संदर्भ में क्या माना जाता है?":"ਅਨੁਛੇਦ 2 ਅਤੇ 3 ਹੇਠ ਰਾਜ ਦੀ ਹੱਦ ਜਾਂ ਖੇਤਰ ਬਦਲਣ ਵਾਲਾ ਕਾਨੂੰਨ ਅਨੁਛੇਦ 368 ਲਈ ਕੀ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ?";
   if(q.canonicalAnswer.startsWith("Parliament by"))return l==="hi"?"अनुच्छेद 169 के तहत राज्य विधान परिषद बनाना या समाप्त करना सामान्यतः कैसे किया जाता है?":"ਅਨੁਛੇਦ 169 ਹੇਠ ਰਾਜ ਵਿਧਾਨ ਪਰਿਸ਼ਦ ਬਣਾਉਣਾ ਜਾਂ ਖਤਮ ਕਰਨਾ ਆਮ ਤੌਰ 'ਤੇ ਕਿਵੇਂ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?";
   return l==="hi"?"निम्न में से कौन-सा संवैधानिक बदलाव अनुच्छेद 368 की प्रक्रिया के बिना किया जा सकता है?":"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸੰਵਿਧਾਨਕ ਬਦਲਾਅ ਅਨੁਛੇਦ 368 ਦੀ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਿਨਾਂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?";
 }
 if(ql===7){
   const c=caseByPrinciple(q.canonicalAnswer)!;const row=POL_CP006_BASIC_STRUCTURE_CASES_V1.find(x=>x.caseName===c)!;
   return l==="hi"?`${native(CASE_NAME[c]!,l)} (${row.year}) मुख्यतः किस सिद्धांत से जुड़ा है?`:`${native(CASE_NAME[c]!,l)} (${row.year}) ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਸ ਸਿਧਾਂਤ ਨਾਲ ਜੁੜਿਆ ਹੈ?`;
 }
 if(ql===8){
   if(q.canonicalAnswer==="Kesavananda Bharati v. State of Kerala")return l==="hi"?"मूल संरचना सिद्धांत किस प्रमुख मामले में स्थापित हुआ?":"ਮੂਲ ਸੰਰਚਨਾ ਸਿਧਾਂਤ ਕਿਸ ਮੁੱਖ ਮਾਮਲੇ ਵਿੱਚ ਸਥਾਪਤ ਹੋਇਆ?";
   return l==="hi"?"मूल संरचना सिद्धांत के बारे में कौन-सा कथन सही है?":"ਮੂਲ ਸੰਰਚਨਾ ਸਿਧਾਂਤ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?";
 }
 if(ql===9)return l==="hi"?"निम्न में से किसे संविधान की मूल संरचना का भाग माना गया है?":"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਨੂੰ ਸੰਵਿਧਾਨ ਦੀ ਮੂਲ ਸੰਰਚਨਾ ਦਾ ਹਿੱਸਾ ਮੰਨਿਆ ਗਿਆ ਹੈ?";
 if(ql===10){
   if(q.canonicalAnswer==="Fundamental Rights and Directive Principles")return l==="hi"?"मिनर्वा मिल्स ने किन दो संवैधानिक भागों के बीच संतुलन पर जोर दिया?":"ਮਿਨਰਵਾ ਮਿਲਜ਼ ਨੇ ਕਿਹੜੇ ਦੋ ਸੰਵਿਧਾਨਕ ਹਿੱਸਿਆਂ ਵਿਚਕਾਰ ਸੰਤੁਲਨ 'ਤੇ ਜ਼ੋਰ ਦਿੱਤਾ?";
   if(q.canonicalAnswer==="Limited amending power of Parliament")return l==="hi"?"मिनर्वा मिल्स किस मूल-संरचना सिद्धांत से विशेष रूप से जुड़ा है?":"ਮਿਨਰਵਾ ਮਿਲਜ਼ ਕਿਹੜੇ ਮੂਲ-ਸੰਰਚਨਾ ਸਿਧਾਂਤ ਨਾਲ ਖ਼ਾਸ ਤੌਰ 'ਤੇ ਜੁੜਿਆ ਹੈ?";
   return l==="hi"?"मिनर्वा मिल्स के निर्णय को कौन-सा कथन सही दर्शाता है?":"ਮਿਨਰਵਾ ਮਿਲਜ਼ ਦੇ ਫ਼ੈਸਲੇ ਨੂੰ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਦਰਸਾਉਂਦਾ ਹੈ?";
 }
 if(ql===11){
   if(q.canonicalAnswer==="Secularism")return l==="hi"?"एस. आर. बोम्मई किस मूल विशेषता से विशेष रूप से जुड़ा है?":"ਐਸ. ਆਰ. ਬੋਮਮਈ ਕਿਹੜੀ ਮੂਲ ਵਿਸ਼ੇਸ਼ਤਾ ਨਾਲ ਖ਼ਾਸ ਤੌਰ 'ਤੇ ਜੁੜਿਆ ਹੈ?";
   if(q.canonicalAnswer==="Judicial review")return l==="hi"?"अदालतों के माध्यम से संवैधानिक संस्थाओं को कानूनी सीमाओं में रखने वाली मूल विशेषता कौन-सी है?":"ਅਦਾਲਤਾਂ ਰਾਹੀਂ ਸੰਵਿਧਾਨਕ ਸੰਸਥਾਵਾਂ ਨੂੰ ਕਾਨੂੰਨੀ ਹੱਦਾਂ ਵਿੱਚ ਰੱਖਣ ਵਾਲੀ ਮੂਲ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਹੜੀ ਹੈ?";
   return l==="hi"?"निम्न में से कौन-सी मान्य मूल विशेषता है?":"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਵਿਸ਼ੇਸ਼ਤਾ ਮੂਲ ਸੰਰਚਨਾ ਦਾ ਮੰਨਿਆ ਹੋਇਆ ਹਿੱਸਾ ਹੈ?";
 }
 if(ql===12){
   if(q.canonicalAnswer==="24 April 1973")return l==="hi"?"नौवीं अनुसूची की मूल-संरचना समीक्षा में महत्वपूर्ण कट-ऑफ तिथि क्या है?":"9ਵੀਂ ਅਨੁਸੂਚੀ ਦੀ ਮੂਲ-ਸੰਰਚਨਾ ਸਮੀਖਿਆ ਵਿੱਚ ਮਹੱਤਵਪੂਰਨ ਕਟ-ਆਫ਼ ਤਾਰੀਖ ਕਿਹੜੀ ਹੈ?";
   if(q.canonicalAnswer.startsWith("Post-24 April 1973"))return l==="hi"?"आई. आर. कोएल्हो के अनुसार 24 अप्रैल 1973 के बाद नौवीं अनुसूची में जोड़े कानूनों के बारे में क्या स्थिति है?":"ਆਈ. ਆਰ. ਕੋਏਲ੍ਹੋ ਅਨੁਸਾਰ 24 ਅਪ੍ਰੈਲ 1973 ਤੋਂ ਬਾਅਦ 9ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਜੋੜੇ ਕਾਨੂੰਨਾਂ ਬਾਰੇ ਕੀ ਸਥਿਤੀ ਹੈ?";
   return l==="hi"?"नौवीं अनुसूची और मूल-संरचना समीक्षा के बारे में कौन-सा कथन सही है?":"9ਵੀਂ ਅਨੁਸੂਚੀ ਅਤੇ ਮੂਲ-ਸੰਰਚਨਾ ਸਮੀਖਿਆ ਬਾਰੇ ਕਿਹੜਾ ਬਿਆਨ ਸਹੀ ਹੈ?";
 }
 if(ql===13){const s=scheduleBySubject(q.canonicalAnswer)!;return l==="hi"?`${native(SCHEDULE_NAME[s]!,l)} किस विषय से संबंधित है?`:`${native(SCHEDULE_NAME[s]!,l)} ਕਿਸ ਵਿਸ਼ੇ ਬਾਰੇ ਹੈ?`;}
 if(ql===14){
   const s=q.canonicalAnswer;
   if(s==="Second Schedule")return l==="hi"?"कुछ संवैधानिक पदों के वेतन, भत्ते और विशेषाधिकार किस अनुसूची में दिए गए हैं?":"ਕੁਝ ਸੰਵਿਧਾਨਕ ਅਹੁਦਿਆਂ ਦੇ ਵੇਤਨ, ਭੱਤੇ ਅਤੇ ਵਿਸ਼ੇਸ਼ ਅਧਿਕਾਰ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਹਨ?";
   if(s==="Seventh Schedule")return l==="hi"?"संघ, राज्य और समवर्ती सूचियाँ किस अनुसूची में दी गई हैं?":"ਸੰਘ, ਰਾਜ ਅਤੇ ਸਮਵਰਤੀ ਸੂਚੀਆਂ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ?";
   if(s==="Twelfth Schedule")return l==="hi"?"नगरपालिकाओं से जुड़े विषय किस अनुसूची में दिए गए हैं?":"ਨਗਰ ਪਾਲਿਕਾਵਾਂ ਨਾਲ ਜੁੜੇ ਵਿਸ਼ੇ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਹਨ?";
   if(s==="Fifth Schedule")return l==="hi"?"अनुसूचित क्षेत्रों और अनुसूचित जनजातियों के प्रशासन व नियंत्रण के प्रावधान किस अनुसूची में हैं?":"ਅਨੁਸੂਚਿਤ ਖੇਤਰਾਂ ਅਤੇ ਅਨੁਸੂਚਿਤ ਜਨਜਾਤੀਆਂ ਦੇ ਪ੍ਰਸ਼ਾਸਨ ਤੇ ਨਿਯੰਤਰਣ ਦੇ ਪ੍ਰਬੰਧ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਹਨ?";
   return l==="hi"?`${native(SCHEDULE_SUBJECT[s]!,l)} किस अनुसूची में दिया गया है?`:`${native(SCHEDULE_SUBJECT[s]!,l)} ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ ਹੈ?`;
 }
 if(ql===15){
   if(q.canonicalAnswer==="First Schedule")return l==="hi"?"राज्य और संघ राज्य क्षेत्र किस अनुसूची में सूचीबद्ध हैं?":"ਰਾਜ ਅਤੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਦਰਜ ਹਨ?";
   if(q.canonicalAnswer==="Fourth Schedule")return l==="hi"?"राज्यसभा की सीटों का आवंटन किस अनुसूची में है?":"ਰਾਜ ਸਭਾ ਦੀਆਂ ਸੀਟਾਂ ਦੀ ਵੰਡ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਹੈ?";
   return l==="hi"?"संघ, राज्य और समवर्ती सूचियाँ किस अनुसूची में हैं?":"ਸੰਘ, ਰਾਜ ਅਤੇ ਸਮਵਰਤੀ ਸੂਚੀਆਂ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਹਨ?";
 }
 if(ql===16){
   if(q.canonicalAnswer==="Scheduled Areas and Scheduled Tribes")return l==="hi"?"पाँचवीं अनुसूची मुख्यतः किससे संबंधित है?":"5ਵੀਂ ਅਨੁਸੂਚੀ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਸ ਬਾਰੇ ਹੈ?";
   if(q.canonicalAnswer==="Assam, Meghalaya, Tripura and Mizoram")return l==="hi"?"छठी अनुसूची किन राज्यों के निर्दिष्ट जनजातीय क्षेत्रों पर लागू होती है?":"6ਵੀਂ ਅਨੁਸੂਚੀ ਕਿਹੜੇ ਰਾਜਾਂ ਦੇ ਨਿਰਧਾਰਤ ਜਨਜਾਤੀ ਖੇਤਰਾਂ 'ਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ?";
   if(q.canonicalAnswer==="Sixth Schedule")return l==="hi"?"स्वायत्त जिला और क्षेत्रीय परिषदें विशेष रूप से किस अनुसूची से जुड़ी हैं?":"ਸਵੈ-ਸ਼ਾਸਿਤ ਜ਼ਿਲ੍ਹਾ ਅਤੇ ਖੇਤਰੀ ਕੌਂਸਲਾਂ ਖ਼ਾਸ ਤੌਰ 'ਤੇ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਨਾਲ ਜੁੜੀਆਂ ਹਨ?";
   return l==="hi"?"पाँचवीं और छठी अनुसूची के बीच सही अंतर कौन-सा है?":"5ਵੀਂ ਅਤੇ 6ਵੀਂ ਅਨੁਸੂਚੀ ਵਿਚਕਾਰ ਸਹੀ ਫ਼ਰਕ ਕਿਹੜਾ ਹੈ?";
 }
 if(ql===17){
   if(q.canonicalAnswer==="Recognised languages")return l==="hi"?"आठवीं अनुसूची किस विषय से संबंधित है?":"8ਵੀਂ ਅਨੁਸੂਚੀ ਕਿਸ ਵਿਸ਼ੇ ਬਾਰੇ ਹੈ?";
   if(q.canonicalAnswer==="22")return l==="hi"?"आठवीं अनुसूची में वर्तमान में कितनी भाषाएँ सूचीबद्ध हैं?":"8ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਇਸ ਵੇਲੇ ਕਿੰਨੀਆਂ ਭਾਸ਼ਾਵਾਂ ਦਰਜ ਹਨ?";
   return l==="hi"?"मान्यता प्राप्त संवैधानिक भाषाएँ किस अनुसूची में हैं?":"ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਸੰਵਿਧਾਨਕ ਭਾਸ਼ਾਵਾਂ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਹਨ?";
 }
 if(ql===18){
   if(q.canonicalAnswer==="Anti-defection provisions")return l==="hi"?"दसवीं अनुसूची किस विषय से संबंधित है?":"10ਵੀਂ ਅਨੁਸੂਚੀ ਕਿਸ ਵਿਸ਼ੇ ਬਾਰੇ ਹੈ?";
   if(q.canonicalAnswer==="Fifty-second Amendment")return l==="hi"?"दल-बदल विरोधी कानून किस संविधान संशोधन से जोड़ा गया?":"ਦਲ-ਬਦਲ ਵਿਰੋਧੀ ਕਾਨੂੰਨ ਕਿਹੜੀ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜਿਆ ਗਿਆ?";
   return l==="hi"?"दल-बदल के आधार पर अयोग्यता मुख्यतः किस अनुसूची में है?":"ਦਲ-ਬਦਲ ਦੇ ਆਧਾਰ 'ਤੇ ਅਯੋਗਤਾ ਮੁੱਖ ਤੌਰ 'ਤੇ ਕਿਹੜੀ ਅਨੁਸੂਚੀ ਵਿੱਚ ਹੈ?";
 }
 if(ql===19){
   if(q.canonicalAnswer==="29")return l==="hi"?"ग्यारहवीं अनुसूची में कितने विषय हैं?":"11ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਕਿੰਨੇ ਵਿਸ਼ੇ ਹਨ?";
   if(q.canonicalAnswer==="Seventy-third Amendment")return l==="hi"?"ग्यारहवीं अनुसूची किस संविधान संशोधन से जोड़ी गई?":"11ਵੀਂ ਅਨੁਸੂਚੀ ਕਿਹੜੀ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜੀ ਗਈ?";
   return l==="hi"?"ग्यारहवीं अनुसूची किससे जुड़ी है?":"11ਵੀਂ ਅਨੁਸੂਚੀ ਕਿਸ ਨਾਲ ਜੁੜੀ ਹੈ?";
 }
 if(ql===20){
   if(q.canonicalAnswer==="18")return l==="hi"?"बारहवीं अनुसूची में कितने विषय हैं?":"12ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਕਿੰਨੇ ਵਿਸ਼ੇ ਹਨ?";
   if(q.canonicalAnswer==="Seventy-fourth Amendment")return l==="hi"?"बारहवीं अनुसूची किस संविधान संशोधन से जोड़ी गई?":"12ਵੀਂ ਅਨੁਸੂਚੀ ਕਿਹੜੀ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਜੋੜੀ ਗਈ?";
   return l==="hi"?"बारहवीं अनुसूची किससे जुड़ी है?":"12ਵੀਂ ਅਨੁਸੂਚੀ ਕਿਸ ਨਾਲ ਜੁੜੀ ਹੈ?";
 }
 if(ql===21){const am=amendByChange(q.canonicalAnswer)!;const row=POL_CP006_HIGH_YIELD_AMENDMENTS_V1.find(x=>x.amendment===am)!;return l==="hi"?`${native(AMEND[am]!,l)} (${row.year}) किस बदलाव से जुड़ा है?`:`${native(AMEND[am]!,l)} (${row.year}) ਕਿਸ ਬਦਲਾਅ ਨਾਲ ਜੁੜੀ ਹੈ?`;}
 if(ql===22){return l==="hi"?`${native(CHANGE[POL_CP006_HIGH_YIELD_AMENDMENTS_V1.find(x=>x.amendment===q.canonicalAnswer)!.change]!,l)} — यह किस संविधान संशोधन से हुआ?`:`${native(CHANGE[POL_CP006_HIGH_YIELD_AMENDMENTS_V1.find(x=>x.amendment===q.canonicalAnswer)!.change]!,l)} — ਇਹ ਕਿਹੜੀ ਸੰਵਿਧਾਨ ਸੋਧ ਨਾਲ ਹੋਇਆ?`;}
 if(ql===23)return l==="hi"?"निम्न में से कौन-सा क्रम सबसे पुराने से सबसे नए तक सही है?":"ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕ੍ਰਮ ਸਭ ਤੋਂ ਪੁਰਾਣੀ ਤੋਂ ਸਭ ਤੋਂ ਨਵੀਂ ਸੋਧ ਤੱਕ ਸਹੀ ਹੈ?";
 if(ql===24){
   if(q.canonicalAnswer==="Forty-second Amendment")return l==="hi"?"प्रस्तावना में ‘समाजवादी’ और ‘पंथनिरपेक्ष’ शब्द किस संशोधन से जोड़े गए?":"ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ‘ਸਮਾਜਵਾਦੀ’ ਅਤੇ ‘ਧਰਮ ਨਿਰਪੱਖ’ ਸ਼ਬਦ ਕਿਹੜੀ ਸੋਧ ਨਾਲ ਜੋੜੇ ਗਏ?";
   if(q.canonicalAnswer==="Forty-fourth Amendment")return l==="hi"?"संपत्ति के अधिकार को मौलिक अधिकारों से बाहर किस संशोधन ने किया?":"ਸੰਪਤੀ ਦੇ ਅਧਿਕਾਰ ਨੂੰ ਮੂਲ ਅਧਿਕਾਰਾਂ ਤੋਂ ਬਾਹਰ ਕਿਹੜੀ ਸੋਧ ਨੇ ਕੀਤਾ?";
   if(q.canonicalAnswer.startsWith("Forty-second —"))return l==="hi"?"42वें और 44वें संविधान संशोधनों का कौन-सा जोड़ा सही सुमेलित है?":"42ਵੀਂ ਅਤੇ 44ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧਾਂ ਦਾ ਕਿਹੜਾ ਜੋੜ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
   return l==="hi"?"‘मिनी-कॉन्स्टिट्यूशन’ के नाम से प्रचलित व्यापक संशोधन कौन-सा है?":"‘ਮਿਨੀ-ਕਾਂਸਟਿਟਿਊਸ਼ਨ’ ਦੇ ਨਾਂ ਨਾਲ ਜਾਣੀ ਜਾਂਦੀ ਵਿਆਪਕ ਸੋਧ ਕਿਹੜੀ ਹੈ?";
 }
 if(ql===25){const am=amendByChange(q.canonicalAnswer)!;return l==="hi"?`${native(AMEND[am]!,l)} किस बदलाव से जुड़ा है?`:`${native(AMEND[am]!,l)} ਕਿਸ ਬਦਲਾਅ ਨਾਲ ਜੁੜੀ ਹੈ?`;}
 if(ql===26){
   const lines=q.stem.split("\n").slice(1,4).map(x=>x.replace(/^\d\. /,""));
   return [l==="hi"?"निम्न कथनों पर विचार कीजिए:":"ਹੇਠ ਲਿਖੇ ਬਿਆਨਾਂ 'ਤੇ ਵਿਚਾਰ ਕਰੋ:",...lines.map((x,i)=>`${i+1}. ${native(STATEMENT[x]!,l)}`),l==="hi"?"कितने कथन सही हैं?":"ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?"].join("\n");
 }
 throw new Error(`${q.questionId}: unsupported CP006 QL ${ql}`);
}

function explanation(q:(typeof ENGLISH)[number],l:NativeLocale):string{
 const ql=Number(q.qlId.slice(-3));const ans=option(q.canonicalAnswer,l).replace(/[।.]+$/u,"");
 if(ql===1)return l==="hi"?"अनुच्छेद 368 संविधान संशोधन की संसद की शक्ति और मुख्य प्रक्रिया देता है।":"ਅਨੁਛੇਦ 368 ਸੰਵਿਧਾਨ ਸੋਧਣ ਦੀ ਸੰਸਦ ਦੀ ਸ਼ਕਤੀ ਅਤੇ ਮੁੱਖ ਪ੍ਰਕਿਰਿਆ ਦਿੰਦਾ ਹੈ।";
 if(ql===2)return l==="hi"?"संविधान संशोधन विधेयक लोकसभा या राज्यसभा, किसी भी सदन में मंत्री या निजी सदस्य द्वारा पेश किया जा सकता है।":"ਸੰਵਿਧਾਨ ਸੋਧ ਬਿੱਲ ਲੋਕ ਸਭਾ ਜਾਂ ਰਾਜ ਸਭਾ, ਕਿਸੇ ਵੀ ਸਦਨ ਵਿੱਚ ਮੰਤਰੀ ਜਾਂ ਗੈਰ-ਸਰਕਾਰੀ ਮੈਂਬਰ ਵੱਲੋਂ ਪੇਸ਼ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।";
 if(ql===3)return l==="hi"?"अनुच्छेद 368 का विशेष बहुमत प्रत्येक सदन में कुल सदस्य संख्या के बहुमत और उपस्थित व मतदान करने वाले सदस्यों के कम-से-कम दो-तिहाई—दोनों शर्तें मांगता है।":"ਅਨੁਛੇਦ 368 ਦਾ ਵਿਸ਼ੇਸ਼ ਬਹੁਮਤ ਹਰ ਸਦਨ ਵਿੱਚ ਕੁੱਲ ਮੈਂਬਰ ਗਿਣਤੀ ਦਾ ਬਹੁਮਤ ਅਤੇ ਹਾਜ਼ਰ ਤੇ ਵੋਟ ਪਾਉਣ ਵਾਲਿਆਂ ਦਾ ਘੱਟੋ-ਘੱਟ ਦੋ-ਤਿਹਾਈ—ਦੋਵੇਂ ਸ਼ਰਤਾਂ ਮੰਗਦਾ ਹੈ।";
 if(ql===4)return l==="hi"?`कुछ संघीय प्रावधानों में बदलाव के लिए कम-से-कम आधे राज्यों की पुष्टि चाहिए। यहाँ सही विषय है: ${ans}।`:`ਕੁਝ ਸੰਘੀ ਪ੍ਰਬੰਧਾਂ ਵਿੱਚ ਬਦਲਾਅ ਲਈ ਘੱਟੋ-ਘੱਟ ਅੱਧੇ ਰਾਜਾਂ ਦੀ ਪੁਸ਼ਟੀ ਚਾਹੀਦੀ ਹੈ। ਇੱਥੇ ਸਹੀ ਵਿਸ਼ਾ: ${ans}।`;
 if(ql===5)return l==="hi"?"संविधान संशोधन विधेयक पर संयुक्त बैठक का प्रावधान नहीं है। विधिवत पारित विधेयक पर अनुच्छेद 368 के तहत राष्ट्रपति को स्वीकृति देनी होती है।":"ਸੰਵਿਧਾਨ ਸੋਧ ਬਿੱਲ ਲਈ ਸਾਂਝੀ ਬੈਠਕ ਦਾ ਪ੍ਰਬੰਧ ਨਹੀਂ ਹੈ। ਢੰਗ ਨਾਲ ਪਾਸ ਬਿੱਲ 'ਤੇ ਅਨੁਛੇਦ 368 ਹੇਠ ਰਾਸ਼ਟਰਪਤੀ ਨੂੰ ਮਨਜ਼ੂਰੀ ਦੇਣੀ ਹੁੰਦੀ ਹੈ।";
 if(ql===6)return l==="hi"?"हर संवैधानिक बदलाव अनुच्छेद 368 से नहीं होता। कुछ विषय संविधान के अनुसार साधारण संसदीय कानून से बदले जा सकते हैं।":"ਹਰ ਸੰਵਿਧਾਨਕ ਬਦਲਾਅ ਅਨੁਛੇਦ 368 ਰਾਹੀਂ ਨਹੀਂ ਹੁੰਦਾ। ਕੁਝ ਵਿਸ਼ੇ ਸੰਵਿਧਾਨ ਅਨੁਸਾਰ ਸਧਾਰਣ ਸੰਸਦੀ ਕਾਨੂੰਨ ਨਾਲ ਬਦਲੇ ਜਾ ਸਕਦੇ ਹਨ।";
 if(ql===7){const c=caseByPrinciple(q.canonicalAnswer)!;return l==="hi"?`${native(CASE_NAME[c]!,l)}: ${native(CASE_PRINCIPLE[q.canonicalAnswer]!,l)}`:`${native(CASE_NAME[c]!,l)}: ${native(CASE_PRINCIPLE[q.canonicalAnswer]!,l)}`;}
 if(ql===8)return l==="hi"?"मूल संरचना सिद्धांत संसद की संशोधन शक्ति को समाप्त नहीं करता; वह संविधान की मूल पहचान को नष्ट करने से रोकता है। केशवानंद भारती इसका प्रमुख निर्णय है।":"ਮੂਲ ਸੰਰਚਨਾ ਸਿਧਾਂਤ ਸੰਸਦ ਦੀ ਸੋਧ ਸ਼ਕਤੀ ਨੂੰ ਖਤਮ ਨਹੀਂ ਕਰਦਾ; ਇਹ ਸੰਵਿਧਾਨ ਦੀ ਮੂਲ ਪਛਾਣ ਨੂੰ ਨਸ਼ਟ ਕਰਨ ਤੋਂ ਰੋਕਦਾ ਹੈ। ਕੇਸ਼ਵਾਨੰਦ ਭਾਰਤੀ ਇਸ ਦਾ ਮੁੱਖ ਫ਼ੈਸਲਾ ਹੈ।";
 if(ql===9||ql===11)return l==="hi"?`${ans} को मूल-संरचना न्यायशास्त्र में मान्यता मिली है। मूल विशेषताओं की कोई एक बंद सूची नहीं है।`:`${ans} ਨੂੰ ਮੂਲ-ਸੰਰਚਨਾ ਨਿਆਂਇਕ ਸਿਧਾਂਤ ਵਿੱਚ ਮਾਨਤਾ ਮਿਲੀ ਹੈ। ਮੂਲ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੀ ਕੋਈ ਇੱਕ ਬੰਦ ਸੂਚੀ ਨਹੀਂ ਹੈ।`;
 if(ql===10)return l==="hi"?"मिनर्वा मिल्स ने सीमित संशोधन शक्ति तथा भाग III के मौलिक अधिकारों और भाग IV के नीति-निदेशक तत्वों के बीच संतुलन को महत्वपूर्ण माना।":"ਮਿਨਰਵਾ ਮਿਲਜ਼ ਨੇ ਸੀਮਿਤ ਸੋਧ ਸ਼ਕਤੀ ਅਤੇ ਭਾਗ III ਦੇ ਮੂਲ ਅਧਿਕਾਰਾਂ ਤੇ ਭਾਗ IV ਦੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਵਿਚਕਾਰ ਸੰਤੁਲਨ ਨੂੰ ਮਹੱਤਵਪੂਰਨ ਮੰਨਿਆ।";
 if(ql===12)return l==="hi"?"नौवीं अनुसूची न्यायिक समीक्षा से पूर्ण छूट नहीं देती। 24 अप्रैल 1973 के बाद जोड़े कानून मूल-संरचना कसौटी पर परखे जा सकते हैं।":"9ਵੀਂ ਅਨੁਸੂਚੀ ਨਿਆਂਇਕ ਸਮੀਖਿਆ ਤੋਂ ਪੂਰੀ ਛੂਟ ਨਹੀਂ ਦਿੰਦੀ। 24 ਅਪ੍ਰੈਲ 1973 ਤੋਂ ਬਾਅਦ ਜੋੜੇ ਕਾਨੂੰਨ ਮੂਲ-ਸੰਰਚਨਾ ਦੀ ਕਸੌਟੀ 'ਤੇ ਪਰਖੇ ਜਾ ਸਕਦੇ ਹਨ।";
 if(ql===13){
   const s=scheduleBySubject(q.canonicalAnswer)!;
   return l==="hi"
     ? `${native(SCHEDULE_NAME[s]!,l)} का विषय ${native(SCHEDULE_SUBJECT[s]!,l)} है।`
     : `${native(SCHEDULE_NAME[s]!,l)} ${native(SCHEDULE_SUBJECT[s]!,l)} ਬਾਰੇ ਹੈ।`;
 }
 if(ql===14||ql===15){
   const s=q.canonicalAnswer;
   return l==="hi"
     ? `सही उत्तर ${native(SCHEDULE_NAME[s]!,l)} है। यह अनुसूची ${native(SCHEDULE_SUBJECT[s]!,l)} से संबंधित है।`
     : `ਸਹੀ ਜਵਾਬ ${native(SCHEDULE_NAME[s]!,l)} ਹੈ। ਇਹ ਅਨੁਸੂਚੀ ${native(SCHEDULE_SUBJECT[s]!,l)} ਬਾਰੇ ਹੈ।`;
 }
 if(ql===16){
   if(q.canonicalAnswer==="Scheduled Areas and Scheduled Tribes")return l==="hi"?"पाँचवीं अनुसूची व्यापक रूप से अनुसूचित क्षेत्रों और अनुसूचित जनजातियों के प्रशासन से संबंधित है।":"5ਵੀਂ ਅਨੁਸੂਚੀ ਵਿਆਪਕ ਤੌਰ 'ਤੇ ਅਨੁਸੂਚਿਤ ਖੇਤਰਾਂ ਅਤੇ ਅਨੁਸੂਚਿਤ ਜਨਜਾਤੀਆਂ ਦੇ ਪ੍ਰਸ਼ਾਸਨ ਬਾਰੇ ਹੈ।";
   if(q.canonicalAnswer==="Assam, Meghalaya, Tripura and Mizoram")return l==="hi"?"छठी अनुसूची असम, मेघालय, त्रिपुरा और मिजोरम के निर्दिष्ट जनजातीय क्षेत्रों के लिए विशेष व्यवस्था देती है।":"6ਵੀਂ ਅਨੁਸੂਚੀ ਅਸਾਮ, ਮੇਘਾਲਿਆ, ਤ੍ਰਿਪੁਰਾ ਅਤੇ ਮਿਜ਼ੋਰਮ ਦੇ ਨਿਰਧਾਰਤ ਜਨਜਾਤੀ ਖੇਤਰਾਂ ਲਈ ਖ਼ਾਸ ਪ੍ਰਬੰਧ ਦਿੰਦੀ ਹੈ।";
   if(q.canonicalAnswer==="Sixth Schedule")return l==="hi"?"स्वायत्त जिला और क्षेत्रीय परिषदों की विशेष व्यवस्था छठी अनुसूची में है।":"ਸਵੈ-ਸ਼ਾਸਿਤ ਜ਼ਿਲ੍ਹਾ ਅਤੇ ਖੇਤਰੀ ਕੌਂਸਲਾਂ ਦੀ ਖ਼ਾਸ ਵਿਵਸਥਾ 6ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਹੈ।";
   return l==="hi"?"पाँचवीं अनुसूची अनुसूचित क्षेत्रों/जनजातियों के व्यापक प्रशासन से जुड़ी है, जबकि छठी अनुसूची चार पूर्वोत्तर राज्यों के निर्दिष्ट जनजातीय क्षेत्रों के लिए विशेष स्वायत्त व्यवस्था देती है।":"5ਵੀਂ ਅਨੁਸੂਚੀ ਅਨੁਸੂਚਿਤ ਖੇਤਰਾਂ ਅਤੇ ਜਨਜਾਤੀਆਂ ਦੇ ਵਿਆਪਕ ਪ੍ਰਸ਼ਾਸਨ ਬਾਰੇ ਹੈ, ਜਦਕਿ 6ਵੀਂ ਅਨੁਸੂਚੀ ਚਾਰ ਉੱਤਰ-ਪੂਰਬੀ ਰਾਜਾਂ ਦੇ ਨਿਰਧਾਰਤ ਜਨਜਾਤੀ ਖੇਤਰਾਂ ਲਈ ਖ਼ਾਸ ਸਵੈ-ਸ਼ਾਸਿਤ ਵਿਵਸਥਾ ਦਿੰਦੀ ਹੈ।";
 }
 if(ql===17)return l==="hi"?"आठवीं अनुसूची में 22 मान्यता प्राप्त भाषाएँ सूचीबद्ध हैं।":"8ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ 22 ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਭਾਸ਼ਾਵਾਂ ਦਰਜ ਹਨ।";
 if(ql===18)return l==="hi"?"दसवीं अनुसूची में दल-बदल विरोधी प्रावधान हैं। इसे 52वें संविधान संशोधन, 1985 से जोड़ा गया।":"10ਵੀਂ ਅਨੁਸੂਚੀ ਵਿੱਚ ਦਲ-ਬਦਲ ਵਿਰੋਧੀ ਪ੍ਰਬੰਧ ਹਨ। ਇਹ 52ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ, 1985 ਰਾਹੀਂ ਜੋੜੀ ਗਈ।";
 if(ql===19)return l==="hi"?"ग्यारहवीं अनुसूची पंचायतों से संबंधित है। इसे 73वें संविधान संशोधन से जोड़ा गया और इसमें 29 विषय हैं।":"11ਵੀਂ ਅਨੁਸੂਚੀ ਪੰਚਾਇਤਾਂ ਬਾਰੇ ਹੈ। ਇਹ 73ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਰਾਹੀਂ ਜੋੜੀ ਗਈ ਅਤੇ ਇਸ ਵਿੱਚ 29 ਵਿਸ਼ੇ ਹਨ।";
 if(ql===20)return l==="hi"?"बारहवीं अनुसूची नगरपालिकाओं से संबंधित है। इसे 74वें संविधान संशोधन से जोड़ा गया और इसमें 18 विषय हैं।":"12ਵੀਂ ਅਨੁਸੂਚੀ ਨਗਰ ਪਾਲਿਕਾਵਾਂ ਬਾਰੇ ਹੈ। ਇਹ 74ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ ਰਾਹੀਂ ਜੋੜੀ ਗਈ ਅਤੇ ਇਸ ਵਿੱਚ 18 ਵਿਸ਼ੇ ਹਨ।";
 if([21,22,25].includes(ql)){
   const am=q.canonicalAnswer in AMEND?q.canonicalAnswer:amendByChange(q.canonicalAnswer)!;const row=POL_CP006_HIGH_YIELD_AMENDMENTS_V1.find(x=>x.amendment===am)!;
   return l==="hi"?`${native(AMEND[am]!,l)} (${row.year}) का प्रमुख संबंध: ${native(CHANGE[row.change]!,l)}।`:`${native(AMEND[am]!,l)} (${row.year}) ਦਾ ਮੁੱਖ ਸੰਬੰਧ: ${native(CHANGE[row.change]!,l)}।`;
 }
 if(ql===23)return l==="hi"?`सही कालक्रम है: ${ans}। प्रमुख संशोधन वर्षों को आधार बनाकर क्रम तय करें।`:`ਸਹੀ ਕਾਲਕ੍ਰਮ: ${ans}। ਮੁੱਖ ਸੋਧਾਂ ਦੇ ਸਾਲਾਂ ਨੂੰ ਆਧਾਰ ਬਣਾ ਕੇ ਕ੍ਰਮ ਤੈਅ ਕਰੋ।`;
 if(ql===24)return l==="hi"?"42वें संविधान संशोधन (1976) ने व्यापक बदलाव किए, जिनमें मौलिक कर्तव्य और प्रस्तावना के बदलाव शामिल थे। 44वें संशोधन (1978) ने कई बदलाव पलटे या बदले और संपत्ति के अधिकार की स्थिति बदली।":"42ਵੀਂ ਸੰਵਿਧਾਨ ਸੋਧ (1976) ਨੇ ਵਿਆਪਕ ਬਦਲਾਅ ਕੀਤੇ, ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਮੂਲ ਫ਼ਰਜ਼ ਅਤੇ ਪ੍ਰਸਤਾਵਨਾ ਦੇ ਬਦਲਾਅ ਸ਼ਾਮਲ ਸਨ। 44ਵੀਂ ਸੋਧ (1978) ਨੇ ਕਈ ਬਦਲਾਅ ਵਾਪਸ ਕੀਤੇ ਜਾਂ ਬਦਲੇ ਅਤੇ ਸੰਪਤੀ ਦੇ ਅਧਿਕਾਰ ਦੀ ਸਥਿਤੀ ਬਦਲੀ।";
 if(ql===26)return l==="hi"?`सही उत्तर है: ${ans}। हर कथन को उसके अनुच्छेद, मूल-संरचना सिद्धांत या अनुसूची से मिलाकर देखें।`:`ਸਹੀ ਜਵਾਬ: ${ans}। ਹਰ ਬਿਆਨ ਨੂੰ ਉਸਦੇ ਅਨੁਛੇਦ, ਮੂਲ-ਸੰਰਚਨਾ ਸਿਧਾਂਤ ਜਾਂ ਅਨੁਸੂਚੀ ਨਾਲ ਮਿਲਾ ਕੇ ਵੇਖੋ।`;
 return l==="hi"?`सही उत्तर है: ${ans}।`:`ਸਹੀ ਜਵਾਬ: ${ans}।`;
}

function localize(q:(typeof ENGLISH)[number],locale:PolLocaleV1):PolLocalizedQuestionV1{
 if(locale==="en")return {...q,options:[...q.options],locale,localizationV1:{version:POL_LOCALIZATION_V1,englishQuestionId:q.questionId,semanticInvariant:true,cpInvariant:true,qlInvariant:true,difficultyInvariant:true,sourceInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,reviewOnly:true}};
 let options=q.options.map(x=>option(x,locale));let s=stem(q,locale),e=explanation(q,locale);
 if(locale==="pa"){options=options.map(applyPolityPunjabiNativePassV1);s=applyPolityPunjabiNativePassV1(s);e=applyPolityPunjabiNativePassV1(e);}
 return {...q,questionId:`${q.questionId}-${locale.toUpperCase()}`,stem:s,options,canonicalAnswer:options[q.correctIndex]!,explanation:e,locale,localizationV1:{version:POL_LOCALIZATION_V1,englishQuestionId:q.questionId,semanticInvariant:true,cpInvariant:true,qlInvariant:true,difficultyInvariant:true,sourceInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,reviewOnly:true}};
}
export function generatePolCp006LocalizedReviewV1(locale:PolLocaleV1):PolLocalizedQuestionV1[]{return ENGLISH.map(q=>localize(q,locale));}
export const POL_CP006_LOCALIZATION_V1_ENGLISH_COUNT=ENGLISH.length;
