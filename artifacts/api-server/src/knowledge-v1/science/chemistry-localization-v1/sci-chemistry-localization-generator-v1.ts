import { SCI_CP011_REVIEW_V1, type SciCp011ReviewQuestion } from "../matter-properties/sci-cp011-review-v1";
import { SCI_CP012_REVIEW_V1, type SciCp012ReviewQuestion } from "../atomic-structure/sci-cp012-review-v1";
import { SCI_CP013_REVIEW_V1, type SciCp013ReviewQuestion } from "../elements-periodic-table/sci-cp013-review-v1";
import { SCI_CP014_REVIEW_V1, type SciCp014ReviewQuestion } from "../chemical-reactions/sci-cp014-review-v1";
import { SCI_CP015_REVIEW_V1, type SciCp015ReviewQuestion } from "../acids-bases-salts/sci-cp015-review-v1";
import { SCI_CP016_REVIEW_V1, type SciCp016ReviewQuestion } from "../metals-nonmetals/sci-cp016-review-v1";
import { SCI_CP017_REVIEW_V1, type SciCp017ReviewQuestion } from "../carbon-compounds/sci-cp017-review-v1";
import { SCI_CP018_REVIEW_V1, type SciCp018ReviewQuestion } from "../everyday-chemistry/sci-cp018-review-v1";
import {
  SCI_CHEMISTRY_LOCALIZATION_V1,
  type ChemistryLocaleV1,
  type ChemistryLocalizedQuestionV1,
} from "./sci-chemistry-localization-types-v1";
import {
  SCI_CHEMISTRY_CP011_HI_V1,
  SCI_CHEMISTRY_CP011_PA_V1,
  type ChemistryNativeSpecV1,
} from "./sci-chemistry-cp011-localization-data-v1";
import {
  SCI_CHEMISTRY_CP012_HI_V1,
  SCI_CHEMISTRY_CP012_PA_V1,
} from "./sci-chemistry-cp012-localization-data-v1";
import {
  SCI_CHEMISTRY_CP013_HI_V1,
  SCI_CHEMISTRY_CP013_PA_V1,
} from "./sci-chemistry-cp013-localization-data-v1";
import {
  SCI_CHEMISTRY_CP014_HI_V1,
  SCI_CHEMISTRY_CP014_PA_V1,
} from "./sci-chemistry-cp014-localization-data-v1";
import {
  SCI_CHEMISTRY_CP015_HI_V1,
  SCI_CHEMISTRY_CP015_PA_V1,
} from "./sci-chemistry-cp015-localization-data-v1";
import {
  SCI_CHEMISTRY_CP016_HI_V1,
  SCI_CHEMISTRY_CP016_PA_V1,
} from "./sci-chemistry-cp016-localization-data-v1";
import {
  SCI_CHEMISTRY_CP017_HI_V1,
  SCI_CHEMISTRY_CP017_PA_V1,
} from "./sci-chemistry-cp017-localization-data-v1";
import {
  SCI_CHEMISTRY_CP018_HI_V1,
  SCI_CHEMISTRY_CP018_PA_V1,
} from "./sci-chemistry-cp018-localization-data-v1";

export type ChemistryLocalizedCpV1 = "SCI-CP-011" | "SCI-CP-012" | "SCI-CP-013" | "SCI-CP-014" | "SCI-CP-015" | "SCI-CP-016" | "SCI-CP-017" | "SCI-CP-018";
export type ChemistryWave1CpV1 = "SCI-CP-011" | "SCI-CP-012";
export type ChemistryWave2CpV1 = "SCI-CP-013" | "SCI-CP-014";
export type ChemistryWave3CpV1 = "SCI-CP-015" | "SCI-CP-016";
export type ChemistryWave4CpV1 = "SCI-CP-017" | "SCI-CP-018";

type EnglishQuestion =
  | SciCp011ReviewQuestion
  | SciCp012ReviewQuestion
  | SciCp013ReviewQuestion
  | SciCp014ReviewQuestion
  | SciCp015ReviewQuestion
  | SciCp016ReviewQuestion
  | SciCp017ReviewQuestion
  | SciCp018ReviewQuestion;

const QL_NAMES = {
  "SCI-CP-011": {
    hi: ["पदार्थ की अवस्थाएँ और मूल भौतिक गुण","कण मॉडल और भौतिक परिवर्तन","शुद्ध पदार्थ, मिश्रण और घोल की मूल बातें","अवस्था परिवर्तन, गुप्त ऊष्मा और दाब","घोल, सांद्रता, संतृप्ति और घुलनशीलता","निलंबन, कोलॉइड और टिंडल प्रभाव","पृथक्करण की विधियाँ","वाष्पीकरण, विसरण, उर्ध्वपातन और स्फटीकरण","समेकित कथन-आधारित तर्क","पदार्थ और पृथक्करण का मिश्रित अनुप्रयोग"],
    pa: ["ਪਦਾਰਥ ਦੀਆਂ ਅਵਸਥਾਵਾਂ ਅਤੇ ਮੂਲ ਭੌਤਿਕ ਗੁਣ","ਕਣ ਮਾਡਲ ਅਤੇ ਭੌਤਿਕ ਬਦਲਾਅ","ਸ਼ੁੱਧ ਪਦਾਰਥ, ਮਿਸ਼ਰਣ ਅਤੇ ਘੋਲ ਦੀਆਂ ਮੂਲ ਗੱਲਾਂ","ਅਵਸਥਾ ਬਦਲਾਅ, ਗੁਪਤ ਊਰਜਾ ਅਤੇ ਦਬਾਅ","ਘੋਲ, ਸੰਕੇਂਦ੍ਰਤਾ, ਸੰਤ੍ਰਿਪਤਾ ਅਤੇ ਘੁਲਨਸ਼ੀਲਤਾ","ਨਿਲੰਬਨ, ਕੋਲਾਇਡ ਅਤੇ ਟਿੰਡਲ ਪ੍ਰਭਾਵ","ਵੱਖ ਕਰਨ ਦੀਆਂ ਵਿਧੀਆਂ","ਵਾਸ਼ਪੀਕਰਨ, ਵਿਸਰਨ, ਉਰਧਵਪਾਤਨ ਅਤੇ ਸਫ਼ਟੀਕਰਨ","ਇਕੱਠਾ ਬਿਆਨ-ਆਧਾਰਿਤ ਤਰਕ","ਪਦਾਰਥ ਅਤੇ ਵੱਖ ਕਰਨ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
  "SCI-CP-012": {
    hi: ["उपपरमाण्विक कण और नाभिक","परमाणु संख्या, द्रव्यमान संख्या और समस्थानिक","परमाणु, अणु और आयन","कण गणना, समस्थानिक और समभारिक","इलेक्ट्रॉन विन्यास और संयोजकता","रासायनिक सूत्र, सामान्य आयन और बंध","निश्चित अनुपात तथा परमाणु और आणविक द्रव्यमान","डाल्टन और प्रमुख परमाणु मॉडल","समेकित कथन-आधारित तर्क","परमाणु और अणु का मिश्रित अनुप्रयोग"],
    pa: ["ਉਪ-ਪਰਮਾਣੂ ਕਣ ਅਤੇ ਨਿਊਕਲੀਅਸ","ਪਰਮਾਣੂ ਸੰਖਿਆ, ਭਾਰ ਸੰਖਿਆ ਅਤੇ ਸਮਸਥਾਨਕ","ਪਰਮਾਣੂ, ਅਣੂ ਅਤੇ ਆਇਨ","ਕਣ ਗਿਣਤੀ, ਸਮਸਥਾਨਕ ਅਤੇ ਸਮਭਾਰਿਕ","ਇਲੈਕਟ੍ਰਾਨ ਬਣਤਰ ਅਤੇ ਸੰਯੋਜਕਤਾ","ਰਸਾਇਣਕ ਸੂਤਰ, ਆਮ ਆਇਨ ਅਤੇ ਬੰਧ","ਨਿਸ਼ਚਿਤ ਅਨੁਪਾਤ ਅਤੇ ਪਰਮਾਣੂ ਤੇ ਅਣੂ ਭਾਰ","ਡਾਲਟਨ ਅਤੇ ਮੁੱਖ ਪਰਮਾਣੂ ਮਾਡਲ","ਇਕੱਠਾ ਬਿਆਨ-ਆਧਾਰਿਤ ਤਰਕ","ਪਰਮਾਣੂ ਅਤੇ ਅਣੂ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
  "SCI-CP-013": {
    hi: ["तत्व और यौगिक का वर्गीकरण","सामान्य तत्व-प्रतीक और परिचित सूत्र","धातु, अधातु, उपधातु और सारणी के क्षेत्र","समूह, आवर्त और सारणी की संरचना","महत्वपूर्ण आवर्तीय परिवार","इलेक्ट्रॉन विन्यास और आवर्तीय स्थिति","मूल आवर्तीय प्रवृत्तियाँ","आवर्तीय वर्गीकरण का विकास","समेकित आवर्तीय तर्क","आवर्त सारणी का मिश्रित अनुप्रयोग"],
    pa: ["ਤੱਤ ਅਤੇ ਯੋਗਿਕ ਦਾ ਵਰਗੀਕਰਨ","ਆਮ ਤੱਤ-ਚਿੰਨ੍ਹ ਅਤੇ ਜਾਣੇ-ਪਛਾਣੇ ਸੂਤਰ","ਧਾਤਾਂ, ਅਧਾਤਾਂ, ਅਰਧ-ਧਾਤਾਂ ਅਤੇ ਸਾਰਣੀ ਦੇ ਖੇਤਰ","ਸਮੂਹ, ਆਵਰਤ ਅਤੇ ਸਾਰਣੀ ਦੀ ਬਣਤਰ","ਮਹੱਤਵਪੂਰਨ ਆਵਰਤੀ ਪਰਿਵਾਰ","ਇਲੈਕਟ੍ਰਾਨ ਬਣਤਰ ਅਤੇ ਆਵਰਤੀ ਸਥਿਤੀ","ਮੂਲ ਆਵਰਤੀ ਰੁਝਾਨ","ਆਵਰਤੀ ਵਰਗੀਕਰਨ ਦਾ ਵਿਕਾਸ","ਇਕੱਠਾ ਆਵਰਤੀ ਤਰਕ","ਆਵਰਤੀ ਸਾਰਣੀ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
  "SCI-CP-014": {
    hi: ["रासायनिक परिवर्तन के संकेत और पहचान","रासायनिक समीकरण और परमाणु संरक्षण","मूल अभिक्रिया-प्रकार की पहचान","सरल रासायनिक समीकरणों का संतुलन","संयोजन, अपघटन और ऊर्जा","विस्थापन, द्विविस्थापन और अवक्षेपण","ऑक्सीकरण, अपचयन और रेडॉक्स","ऊर्जा परिवर्तन, जंग और बासीपन","समेकित अभिक्रिया तर्क","रासायनिक अभिक्रियाओं का मिश्रित अनुप्रयोग"],
    pa: ["ਰਸਾਇਣਕ ਬਦਲਾਅ ਦੇ ਸੰਕੇਤ ਅਤੇ ਪਛਾਣ","ਰਸਾਇਣਕ ਸਮੀਕਰਨ ਅਤੇ ਪਰਮਾਣੂ ਸੰਰੱਖਣ","ਮੂਲ ਕ੍ਰਿਆ-ਕਿਸਮ ਦੀ ਪਛਾਣ","ਸਧਾਰਣ ਰਸਾਇਣਕ ਸਮੀਕਰਨਾਂ ਦਾ ਸੰਤੁਲਨ","ਸੰਯੋਜਨ, ਵਿਘਟਨ ਅਤੇ ਊਰਜਾ","ਵਿਸਥਾਪਨ, ਦੁਹਰਾ ਵਿਸਥਾਪਨ ਅਤੇ ਅਵਕਸ਼ੇਪਣ","ਆਕਸੀਕਰਨ, ਅਪਚਯਨ ਅਤੇ ਰੇਡਾਕਸ","ਊਰਜਾ ਬਦਲਾਅ, ਜੰਗ ਅਤੇ ਬਾਸੀਪਨ","ਇਕੱਠਾ ਕ੍ਰਿਆ ਤਰਕ","ਰਸਾਇਣਕ ਕ੍ਰਿਆਵਾਂ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
  "SCI-CP-015": {
    hi: ["अम्ल/क्षार आयन, प्रबलता और सांद्रता","सूचक और रंग परिवर्तन","pH और लवण का स्वभाव","अम्ल/क्षार की प्रमुख अभिक्रियाएँ","उदासीनीकरण और pH के उपयोग","साधारण नमक और क्लोर-क्षार रसायन","बेकिंग सोडा, वाशिंग सोडा और ब्लीचिंग पाउडर","क्रिस्टलीकरण-जल, जिप्सम और प्लास्टर ऑफ पेरिस","समेकित अम्ल-क्षार तर्क","अम्ल, क्षार और लवण का मिश्रित अनुप्रयोग"],
    pa: ["ਅਮਲ/ਖਾਰ ਆਇਨ, ਤਾਕਤ ਅਤੇ ਸੰਕੇਂਦ੍ਰਤਾ","ਸੂਚਕ ਅਤੇ ਰੰਗ ਬਦਲਾਅ","pH ਅਤੇ ਲਵਣ ਦਾ ਸੁਭਾਵ","ਅਮਲ/ਖਾਰ ਦੀਆਂ ਮੁੱਖ ਕ੍ਰਿਆਵਾਂ","ਉਦਾਸੀਨੀਕਰਨ ਅਤੇ pH ਦੇ ਵਰਤੋਂ","ਆਮ ਨਮਕ ਅਤੇ ਕਲੋਰ-ਐਲਕਲੀ ਰਸਾਇਣ","ਬੇਕਿੰਗ ਸੋਡਾ, ਵਾਸ਼ਿੰਗ ਸੋਡਾ ਅਤੇ ਬਲੀਚਿੰਗ ਪਾਊਡਰ","ਕ੍ਰਿਸਟਲੀਕਰਨ-ਪਾਣੀ, ਜਿਪਸਮ ਅਤੇ ਪਲਾਸਟਰ ਆਫ ਪੈਰਿਸ","ਇਕੱਠਾ ਅਮਲ-ਖਾਰ ਤਰਕ","ਅਮਲ, ਖਾਰ ਅਤੇ ਲਵਣ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
  "SCI-CP-016": {
    hi: ["भौतिक गुण और अपवाद","अभिक्रियाएँ और उभयधर्मी ऑक्साइड","अभिक्रियाशीलता श्रेणी और विस्थापन","आयनिक यौगिक और उनके गुण","प्रमुख अयस्क और धातु-अयस्क मिलान","धातुकर्म की शब्दावली और अयस्क उपचार","निष्कर्षण, शोधन और थर्माइट","संक्षारण और मिश्रधातुएँ","समेकित धातु/धातुकर्म तर्क","धातु और अधातु का मिश्रित अनुप्रयोग"],
    pa: ["ਭੌਤਿਕ ਗੁਣ ਅਤੇ ਅਪਵਾਦ","ਕ੍ਰਿਆਵਾਂ ਅਤੇ ਉਭਯਧਰਮੀ ਆਕਸਾਈਡ","ਕ੍ਰਿਆਸ਼ੀਲਤਾ ਲੜੀ ਅਤੇ ਵਿਸਥਾਪਨ","ਆਇਨਿਕ ਯੋਗਿਕ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਗੁਣ","ਮੁੱਖ ਅਯਸਕ ਅਤੇ ਧਾਤ-ਅਯਸਕ ਮਿਲਾਨ","ਧਾਤਕਰਮ ਦੀ ਸ਼ਬਦਾਵਲੀ ਅਤੇ ਅਯਸਕ ਇਲਾਜ","ਨਿਕਾਸ, ਸ਼ੁੱਧੀਕਰਨ ਅਤੇ ਥਰਮਾਈਟ","ਜੰਗ ਅਤੇ ਮਿਸ਼ਰਧਾਤਾਂ","ਇਕੱਠਾ ਧਾਤ/ਧਾਤਕਰਮ ਤਰਕ","ਧਾਤਾਂ ਅਤੇ ਅਧਾਤਾਂ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
  "SCI-CP-017": {
    hi: ["कार्बन बंध, चतुसंयोजकता और श्रृंखलन","अपररूप और कार्बन संरचनाएँ","संतृप्त और असंतृप्त हाइड्रोकार्बन","समजातीय श्रेणी, क्रियात्मक समूह और नामकरण","दहन, योग, प्रतिस्थापन और असंतृप्तता परीक्षण","एथेनॉल: गुण और अभिक्रियाएँ","एथेनोइक अम्ल, एस्टरीकरण और साबुनीकरण","साबुन, डिटर्जेंट और माइसेल","सूत्र, क्रियात्मक समूह और नामकरण का समेकित तर्क","कार्बन यौगिकों का मिश्रित अनुप्रयोग"],
    pa: ["ਕਾਰਬਨ ਬੰਧ, ਚਤੁਰਸੰਯੋਜਕਤਾ ਅਤੇ ਕੈਟੀਨੇਸ਼ਨ","ਅਪਰਰੂਪ ਅਤੇ ਕਾਰਬਨ ਬਣਤਰਾਂ","ਸੰਤ੍ਰਿਪਤ ਅਤੇ ਅਸੰਤ੍ਰਿਪਤ ਹਾਈਡ੍ਰੋਕਾਰਬਨ","ਸਮਜਾਤੀ ਲੜੀ, ਕ੍ਰਿਆਸ਼ੀਲ ਸਮੂਹ ਅਤੇ ਨਾਮਕਰਨ","ਦਹਨ, ਯੋਗ, ਪ੍ਰਤਿਸਥਾਪਨ ਅਤੇ ਅਸੰਤ੍ਰਿਪਤਾ ਟੈਸਟ","ਈਥੈਨੋਲ: ਗੁਣ ਅਤੇ ਕ੍ਰਿਆਵਾਂ","ਈਥੈਨੋਇਕ ਅਮਲ, ਐਸਟਰੀਕਰਨ ਅਤੇ ਸਾਬੁਨੀਕਰਨ","ਸਾਬਣ, ਡਿਟਰਜੈਂਟ ਅਤੇ ਮਾਈਸੈਲ","ਸੂਤਰ, ਕ੍ਰਿਆਸ਼ੀਲ ਸਮੂਹ ਅਤੇ ਨਾਮਕਰਨ ਦਾ ਇਕੱਠਾ ਤਰਕ","ਕਾਰਬਨ ਯੋਗਿਕਾਂ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
  "SCI-CP-018": {
    hi: ["सामान्य घरेलू और औद्योगिक रसायन","ईंधन और परिचित गैसें","उर्वरक और पौध पोषक तत्व","पॉलिमर, प्लास्टिक और कृत्रिम रेशे","सामान्य जलयोजित लवण और रासायनिक नाम","खाद्य रसायन और संरक्षण","जल कठोरता और उपचार","रबर, काँच, सीमेंट और सिरेमिक","दैनिक उपयोग की सामग्रियों का समेकित तर्क","दैनिक रसायन का मिश्रित अनुप्रयोग"],
    pa: ["ਆਮ ਘਰੇਲੂ ਅਤੇ ਉਦਯੋਗਿਕ ਰਸਾਇਣ","ਈਂਧਨ ਅਤੇ ਜਾਣੀਆਂ-ਪਛਾਣੀਆਂ ਗੈਸਾਂ","ਖਾਦਾਂ ਅਤੇ ਪੌਧ ਪੋਸ਼ਕ ਤੱਤ","ਪੌਲੀਮਰ, ਪਲਾਸਟਿਕ ਅਤੇ ਕ੍ਰਿਤ੍ਰਿਮ ਰੇਸ਼ੇ","ਆਮ ਜਲਯੋਜਿਤ ਲਵਣ ਅਤੇ ਰਸਾਇਣਕ ਨਾਮ","ਖਾਦ ਰਸਾਇਣ ਅਤੇ ਸੰਰੱਖਣ","ਪਾਣੀ ਦੀ ਕਠੋਰਤਾ ਅਤੇ ਇਲਾਜ","ਰਬਰ, ਕੱਚ, ਸੀਮੈਂਟ ਅਤੇ ਸਿਰੈਮਿਕ","ਰੋਜ਼ਾਨਾ ਸਮੱਗਰੀ ਦਾ ਇਕੱਠਾ ਤਰਕ","ਰੋਜ਼ਾਨਾ ਰਸਾਇਣ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
} as const;

function englishQuestions(cpId: ChemistryLocalizedCpV1): readonly EnglishQuestion[] {
  switch (cpId) {
    case "SCI-CP-011": return SCI_CP011_REVIEW_V1;
    case "SCI-CP-012": return SCI_CP012_REVIEW_V1;
    case "SCI-CP-013": return SCI_CP013_REVIEW_V1;
    case "SCI-CP-014": return SCI_CP014_REVIEW_V1;
    case "SCI-CP-015": return SCI_CP015_REVIEW_V1;
    case "SCI-CP-016": return SCI_CP016_REVIEW_V1;
    case "SCI-CP-017": return SCI_CP017_REVIEW_V1;
    case "SCI-CP-018": return SCI_CP018_REVIEW_V1;
  }
}

function nativeSpecs(cpId: ChemistryLocalizedCpV1, locale: Exclude<ChemistryLocaleV1, "en">): readonly ChemistryNativeSpecV1[] {
  switch (cpId) {
    case "SCI-CP-011": return locale === "hi" ? SCI_CHEMISTRY_CP011_HI_V1 : SCI_CHEMISTRY_CP011_PA_V1;
    case "SCI-CP-012": return locale === "hi" ? SCI_CHEMISTRY_CP012_HI_V1 : SCI_CHEMISTRY_CP012_PA_V1;
    case "SCI-CP-013": return locale === "hi" ? SCI_CHEMISTRY_CP013_HI_V1 : SCI_CHEMISTRY_CP013_PA_V1;
    case "SCI-CP-014": return locale === "hi" ? SCI_CHEMISTRY_CP014_HI_V1 : SCI_CHEMISTRY_CP014_PA_V1;
    case "SCI-CP-015": return locale === "hi" ? SCI_CHEMISTRY_CP015_HI_V1 : SCI_CHEMISTRY_CP015_PA_V1;
    case "SCI-CP-016": return locale === "hi" ? SCI_CHEMISTRY_CP016_HI_V1 : SCI_CHEMISTRY_CP016_PA_V1;
    case "SCI-CP-017": return locale === "hi" ? SCI_CHEMISTRY_CP017_HI_V1 : SCI_CHEMISTRY_CP017_PA_V1;
    case "SCI-CP-018": return locale === "hi" ? SCI_CHEMISTRY_CP018_HI_V1 : SCI_CHEMISTRY_CP018_PA_V1;
  }
}

function qlNumber(qlId: string): number {
  return Number(qlId.slice(-3));
}

function insertAnswer(answer: string, distractors: readonly [string,string,string], correctIndex: number): readonly string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

function metadata(englishQuestionId: string) {
  return Object.freeze({
    version: SCI_CHEMISTRY_LOCALIZATION_V1,
    englishQuestionId,
    semanticInvariant: true as const,
    cpInvariant: true as const,
    qlInvariant: true as const,
    difficultyInvariant: true as const,
    sourceInvariant: true as const,
    optionOrderInvariant: true as const,
    correctIndexInvariant: true as const,
    reviewOnly: true as const,
  });
}

function localizeNative(q: EnglishQuestion, locale: Exclude<ChemistryLocaleV1, "en">, spec: ChemistryNativeSpecV1): ChemistryLocalizedQuestionV1 {
  const [stem, answer, distractors, explanation] = spec;
  const options = insertAnswer(answer, distractors, q.correctIndex);
  const names = QL_NAMES[q.cpId as ChemistryLocalizedCpV1][locale];
  return Object.freeze({
    ...q,
    questionId: `${q.questionId}-${locale.toUpperCase()}`,
    qlName: names[qlNumber(q.qlId) - 1],
    stem,
    options,
    canonicalAnswer: options[q.correctIndex],
    explanation,
    sourceIds: Object.freeze([...q.sourceIds]),
    sourceFactIds: Object.freeze([...q.sourceFactIds]),
    locale,
    localizationV1: metadata(q.questionId),
  });
}

function localizeEnglish(q: EnglishQuestion): ChemistryLocalizedQuestionV1 {
  return Object.freeze({
    ...q,
    options: Object.freeze([...q.options]),
    sourceIds: Object.freeze([...q.sourceIds]),
    sourceFactIds: Object.freeze([...q.sourceFactIds]),
    locale: "en",
    localizationV1: metadata(q.questionId),
  });
}

export function generateChemistryLocalizedCpV1(cpId: ChemistryLocalizedCpV1, locale: ChemistryLocaleV1): readonly ChemistryLocalizedQuestionV1[] {
  const english = englishQuestions(cpId);
  if (locale === "en") return Object.freeze(english.map(localizeEnglish));
  const specs = nativeSpecs(cpId, locale);
  if (specs.length !== english.length) throw new Error(`${cpId}/${locale}: expected ${english.length} native surfaces, found ${specs.length}`);
  return Object.freeze(english.map((q, index) => localizeNative(q, locale, specs[index])));
}

export const SCI_CHEMISTRY_WAVE1_SUPPORTED_CPS_V1 = Object.freeze(["SCI-CP-011", "SCI-CP-012"] as const);
export const SCI_CHEMISTRY_WAVE2_SUPPORTED_CPS_V1 = Object.freeze(["SCI-CP-013", "SCI-CP-014"] as const);
export const SCI_CHEMISTRY_WAVE3_SUPPORTED_CPS_V1 = Object.freeze(["SCI-CP-015", "SCI-CP-016"] as const);
export const SCI_CHEMISTRY_WAVE4_SUPPORTED_CPS_V1 = Object.freeze(["SCI-CP-017", "SCI-CP-018"] as const);
export const SCI_CHEMISTRY_WAVE1_SUPPORTED_LOCALES_V1 = Object.freeze(["en", "hi", "pa"] as const);
export const SCI_CHEMISTRY_WAVE2_SUPPORTED_LOCALES_V1 = SCI_CHEMISTRY_WAVE1_SUPPORTED_LOCALES_V1;
export const SCI_CHEMISTRY_WAVE3_SUPPORTED_LOCALES_V1 = SCI_CHEMISTRY_WAVE1_SUPPORTED_LOCALES_V1;
export const SCI_CHEMISTRY_WAVE4_SUPPORTED_LOCALES_V1 = SCI_CHEMISTRY_WAVE1_SUPPORTED_LOCALES_V1;
