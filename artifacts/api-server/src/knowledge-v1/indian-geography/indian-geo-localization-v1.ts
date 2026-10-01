import { localizeGeoSoi001ExactCp001PartA } from "./soils/geo-soi-001-localization-cp001-part-a-v1";
import { localizeGeoSoi001ExactCp001PartB } from "./soils/geo-soi-001-localization-cp001-part-b-v1";
import { localizeGeoSoi001ExactCp001PartC } from "./soils/geo-soi-001-localization-cp001-part-c-v1";
import { localizeGeoSoi001ExactCp002PartA } from "./soils/geo-soi-001-localization-cp002-part-a-v1";
import { localizeGeoSoi001ExactCp002PartB } from "./soils/geo-soi-001-localization-cp002-part-b-v1";
import { localizeGeoSoi001ExactCp002PartC } from "./soils/geo-soi-001-localization-cp002-part-c-v1";
import { localizeGeoSoi001ExactCp003PartA } from "./soils/geo-soi-001-localization-cp003-part-a-v1";
import { localizeGeoSoi001ExactCp003PartB } from "./soils/geo-soi-001-localization-cp003-part-b-v1";
import { localizeGeoSoi001ExactCp003PartC } from "./soils/geo-soi-001-localization-cp003-part-c-v1";
import {
  GEO_WAT_001_CP001_HINDI_LOCALIZATION_V1,
  GEO_WAT_001_CP001_PUNJABI_LOCALIZATION_V1,
} from "./water-resources/geo-wat-001-localization-cp001-v1";
import { localizeGeoWat001ExactCp002 } from "./water-resources/geo-wat-001-localization-cp002-v1";
import { localizeGeoWat001ExactCp003 } from "./water-resources/geo-wat-001-localization-cp003-v1";
import { localizeGeoWat001ExactCp004 } from "./water-resources/geo-wat-001-localization-cp004-v1";
import { localizeGeoLnd001ExactCp001 } from "./land-resources/geo-lnd-001-localization-cp001-v1";
import { localizeGeoLnd001ExactCp002 } from "./land-resources/geo-lnd-001-localization-cp002-v1";
import { localizeGeoLnd001ExactCp003 } from "./land-resources/geo-lnd-001-localization-cp003-v1";
import { localizeGeoHaz001ExactCp001 } from "./natural-hazards/geo-haz-001-localization-cp001-v1";
import { localizeGeoHaz001ExactCp002 } from "./natural-hazards/geo-haz-001-localization-cp002-v1";
import { localizeGeoHaz001ExactCp003 } from "./natural-hazards/geo-haz-001-localization-cp003-v1";
import { localizeGeoHaz001ExactCp004 } from "./natural-hazards/geo-haz-001-localization-cp004-v1";
import { localizeGeoPln001ExactCp001 } from "./regional-planning/geo-pln-001-localization-cp001-v1";
import { localizeGeoPln001ExactCp002 } from "./regional-planning/geo-pln-001-localization-cp002-v1";
import { localizeGeoPln001ExactCp003 } from "./regional-planning/geo-pln-001-localization-cp003-v1";
import { localizeGeoPop001ExactCp001PartA } from "./population-settlements/geo-pop-001-localization-cp001-part-a-v1";
import { localizeGeoPop001ExactCp001PartB } from "./population-settlements/geo-pop-001-localization-cp001-part-b-v1";
import { localizeGeoPop001ExactCp002PartA } from "./population-settlements/geo-pop-001-localization-cp002-part-a-v1";
import { localizeGeoPop001ExactCp002PartB } from "./population-settlements/geo-pop-001-localization-cp002-part-b-v1";
import { localizeGeoPop001ExactCp002PartC } from "./population-settlements/geo-pop-001-localization-cp002-part-c-v1";
import { localizeGeoPop001ExactCp002PartD } from "./population-settlements/geo-pop-001-localization-cp002-part-d-v1";
import { localizeGeoPop001ExactCp003PartA } from "./population-settlements/geo-pop-001-localization-cp003-part-a-v1";
import { localizeGeoPop001ExactCp003PartB } from "./population-settlements/geo-pop-001-localization-cp003-part-b-v1";
import { localizeGeoPop001ExactCp003PartC } from "./population-settlements/geo-pop-001-localization-cp003-part-c-v1";
import { localizeGeoPop001ExactCp004PartA } from "./population-settlements/geo-pop-001-localization-cp004-part-a-v1";
import { localizeGeoPop001ExactCp004PartB } from "./population-settlements/geo-pop-001-localization-cp004-part-b-v1";
import { localizeGeoPop001ExactCp004PartC } from "./population-settlements/geo-pop-001-localization-cp004-part-c-v1";
import { localizeGeoPop001ExactCp005PartA } from "./population-settlements/geo-pop-001-localization-cp005-part-a-v1";
import { localizeGeoPop001ExactCp005PartB } from "./population-settlements/geo-pop-001-localization-cp005-part-b-v1";
import { localizeGeoPop001ExactCp005PartC } from "./population-settlements/geo-pop-001-localization-cp005-part-c-v1";

export type IndianGeoLocalizationLanguageV1 = "en" | "hi" | "pa";
type CanonicalQuestion = Readonly<{
  questionId: string;
  qlId: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
}>;

export type IndianGeoLocalizedQuestionV1 = Readonly<{
  stem: string;
  options: readonly string[];
  canonicalAnswer: string;
  explanation: string;
}>;

const WATER_CP001_EXACT = {
  hi: new Map(GEO_WAT_001_CP001_HINDI_LOCALIZATION_V1.map((q) => [q.sourceQuestionId, q] as const)),
  pa: new Map(GEO_WAT_001_CP001_PUNJABI_LOCALIZATION_V1.map((q) => [q.sourceQuestionId, q] as const)),
} as const;

const EXACT: Record<"hi"|"pa", Record<string,string>> = {
  hi: {
    "Both I and II are correct":"I और II दोनों सही हैं",
    "Only I is correct":"केवल I सही है",
    "Only II is correct":"केवल II सही है",
    "Neither I nor II is correct":"न तो I और न ही II सही है",
    "All of the above":"उपरोक्त सभी",
    "None of the above":"उपरोक्त में से कोई नहीं",
    "I, II and III":"I, II और III",
    "I and II only":"केवल I और II",
    "II and III only":"केवल II और III",
    "I and III only":"केवल I और III",
    "All three are correct":"तीनों सही हैं",
  },
  pa: {
    "Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
    "Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
    "Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
    "Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ",
    "All of the above":"ਉਪਰੋਕਤ ਸਾਰੇ",
    "None of the above":"ਉਪਰੋਕਤ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ",
    "I, II and III":"I, II ਅਤੇ III",
    "I and II only":"ਕੇਵਲ I ਅਤੇ II",
    "II and III only":"ਕੇਵਲ II ਅਤੇ III",
    "I and III only":"ਕੇਵਲ I ਅਤੇ III",
    "All three are correct":"ਤਿੰਨੇ ਸਹੀ ਹਨ",
  },
};

const TERMS: Record<"hi"|"pa", Record<string,string>> = {
  hi: {
    "Jammu and Kashmir":"जम्मू और कश्मीर","Himachal Pradesh":"हिमाचल प्रदेश","Uttarakhand":"उत्तराखंड",
    "Arunachal Pradesh":"अरुणाचल प्रदेश","Andhra Pradesh":"आंध्र प्रदेश","Madhya Pradesh":"मध्य प्रदेश",
    "Uttar Pradesh":"उत्तर प्रदेश","West Bengal":"पश्चिम बंगाल","Tamil Nadu":"तमिलनाडु","Maharashtra":"महाराष्ट्र",
    "Chhattisgarh":"छत्तीसगढ़","Jharkhand":"झारखंड","Rajasthan":"राजस्थान","Gujarat":"गुजरात","Punjab":"पंजाब",
    "Haryana":"हरियाणा","Kerala":"केरल","Karnataka":"कर्नाटक","Odisha":"ओडिशा","Assam":"असम","Bihar":"बिहार",
    "Sikkim":"सिक्किम","Manipur":"मणिपुर","Meghalaya":"मेघालय","Mizoram":"मिजोरम","Nagaland":"नागालैंड",
    "Tripura":"त्रिपुरा","Goa":"गोवा","Telangana":"तेलंगाना","Ladakh":"लद्दाख","Delhi":"दिल्ली","Chandigarh":"चंडीगढ़",
    "Puducherry":"पुदुचेरी","Lakshadweep":"लक्षद्वीप","Andaman and Nicobar Islands":"अंडमान और निकोबार द्वीपसमूह",
    "Ganga":"गंगा","Yamuna":"यमुना","Brahmaputra":"ब्रह्मपुत्र","Indus":"सिंधु","Sutlej":"सतलुज","Beas":"ब्यास","Ravi":"रावी",
    "Chenab":"चिनाब","Jhelum":"झेलम","Narmada":"नर्मदा","Tapi":"ताप्ती","Godavari":"गोदावरी","Krishna":"कृष्णा",
    "Kaveri":"कावेरी","Mahanadi":"महानदी","Damodar":"दामोदर","Son":"सोन","Chambal":"चंबल","Luni":"लूनी","Teesta":"तीस्ता",
    "Sabarmati":"साबरमती","Periyar":"पेरियार","Tungabhadra":"तुंगभद्रा","Bhagirathi":"भागीरथी","Alaknanda":"अलकनंदा",
    "Himalaya":"हिमालय","Himalayas":"हिमालय","Western Ghats":"पश्चिमी घाट","Eastern Ghats":"पूर्वी घाट",
    "Aravalli":"अरावली","Vindhya":"विंध्य","Satpura":"सतपुड़ा","Nilgiri Hills":"नीलगिरि पहाड़ियाँ",
    "Deccan Plateau":"दक्कन का पठार","Chota Nagpur Plateau":"छोटानागपुर पठार","Malwa Plateau":"मालवा पठार",
    "Indo-Gangetic Plain":"सिंधु-गंगा का मैदान","Northern Plains":"उत्तरी मैदान","Coastal Plains":"तटीय मैदान",
    "Thar Desert":"थार मरुस्थल","Western Coastal Plain":"पश्चिमी तटीय मैदान","Eastern Coastal Plain":"पूर्वी तटीय मैदान",
    "Bay of Bengal":"बंगाल की खाड़ी","Arabian Sea":"अरब सागर","Indian Ocean":"हिंद महासागर",
    "Southwest Monsoon":"दक्षिण-पश्चिम मानसून","Northeast Monsoon":"उत्तर-पूर्व मानसून","retreating monsoon":"लौटता मानसून",
    "monsoon":"मानसून","rainfall":"वर्षा","temperature":"तापमान","humidity":"आर्द्रता","cyclone":"चक्रवात","drought":"सूखा",
    "flood":"बाढ़","earthquake":"भूकंप","landslide":"भूस्खलन","tsunami":"सुनामी","disaster management":"आपदा प्रबंधन",
    "alluvial soil":"जलोढ़ मिट्टी","black soil":"काली मिट्टी","red soil":"लाल मिट्टी","laterite soil":"लेटराइट मिट्टी",
    "arid soil":"शुष्क मिट्टी","forest soil":"वन मिट्टी","soil erosion":"मृदा अपरदन","soil conservation":"मृदा संरक्षण",
    "rice":"चावल","wheat":"गेहूँ","maize":"मक्का","millets":"मोटे अनाज","cotton":"कपास","jute":"जूट","sugarcane":"गन्ना","groundnut":"मूंगफली","mustard":"सरसों","soybean":"सोयाबीन","jowar":"ज्वार","bajra":"बाजरा","gram":"चना",
    "tea":"चाय","coffee":"कॉफी","rubber":"रबर","pulses":"दलहन","oilseeds":"तिलहन","Kharif":"खरीफ","Rabi":"रबी","Zaid":"जायद",
    "irrigation":"सिंचाई","groundwater":"भूजल","canal irrigation":"नहर सिंचाई","tank irrigation":"टैंक सिंचाई",
    "drip irrigation":"ड्रिप सिंचाई","sprinkler irrigation":"स्प्रिंकलर सिंचाई","rainwater harvesting":"वर्षा जल संचयन",
    "watershed management":"जलागम प्रबंधन","water scarcity":"जल की कमी","water conservation":"जल संरक्षण",
    "hydroelectric power":"जलविद्युत","multipurpose project":"बहुउद्देशीय परियोजना","river-valley project":"नदी-घाटी परियोजना",
    "Bhakra-Nangal":"भाखड़ा-नांगल","Hirakud":"हीराकुंड","Tehri":"टिहरी","Sardar Sarovar":"सरदार सरोवर",
    "Nagarjuna Sagar":"नागार्जुन सागर","Damodar Valley Project":"दामोदर घाटी परियोजना",
    "aluminium":"एल्यूमिनियम","alumina":"एल्यूमिना","port hinterland":"बंदरगाह पृष्ठप्रदेश","iron and steel industry":"लौह-इस्पात उद्योग","cotton textile industry":"सूती वस्त्र उद्योग","jute industry":"जूट उद्योग",
    "sugar industry":"चीनी उद्योग","information technology":"सूचना प्रौद्योगिकी","petrochemical industry":"पेट्रो-रसायन उद्योग",
    "industrial location":"औद्योगिक अवस्थिति","raw material":"कच्चा माल","market":"बाजार","power supply":"ऊर्जा आपूर्ति",
    "railway":"रेलमार्ग","railways":"रेलमार्ग","road transport":"सड़क परिवहन","national highway":"राष्ट्रीय राजमार्ग",
    "inland waterways":"अंतर्देशीय जलमार्ग","port":"बंदरगाह","ports":"बंदरगाह","air transport":"हवाई परिवहन",
    "Golden Quadrilateral":"स्वर्णिम चतुर्भुज","North-South Corridor":"उत्तर-दक्षिण गलियारा","East-West Corridor":"पूर्व-पश्चिम गलियारा",
    "population density":"जनसंख्या घनत्व","population distribution":"जनसंख्या वितरण","population growth":"जनसंख्या वृद्धि",
    "sex ratio":"लिंगानुपात","literacy":"साक्षरता","urbanisation":"शहरीकरण","migration":"प्रवास","settlement":"बस्ती",
    "rural settlement":"ग्रामीण बस्ती","urban settlement":"शहरी बस्ती","census":"जनगणना",
    "land degradation":"भूमि क्षरण","land use":"भूमि उपयोग","wasteland":"बंजर भूमि","forest cover":"वन आवरण",
    "regional planning":"क्षेत्रीय नियोजन","planning region":"नियोजन क्षेत्र","resource planning":"संसाधन नियोजन",
    "neighbouring country":"पड़ोसी देश","international boundary":"अंतरराष्ट्रीय सीमा","coastline":"समुद्र तटरेखा",
    "latitudinal extent":"अक्षांशीय विस्तार","longitudinal extent":"देशांतर विस्तार","Standard Meridian":"मानक मध्याह्न रेखा",
    "Tropic of Cancer":"कर्क रेखा","Indian Standard Time":"भारतीय मानक समय",
    "evergreen forest":"सदाबहार वन","deciduous forest":"पर्णपाती वन","thorn forest":"कांटेदार वन","mangrove forest":"मैंग्रोव वन","tropical evergreen forest":"उष्णकटिबंधीय सदाबहार वन","tropical deciduous forest":"उष्णकटिबंधीय पर्णपाती वन","tropical thorn forest":"उष्णकटिबंधीय कांटेदार वन","scrub":"झाड़ीदार वनस्पति","teak":"सागौन","sal":"साल","fir":"फर","spruce":"स्प्रूस","acacia":"बबूल","babool":"बबूल","Nilgai":"नीलगाय","Gir Forest":"गिर वन","Royal Bengal Tiger":"रॉयल बंगाल टाइगर",
    "wildlife sanctuary":"वन्यजीव अभयारण्य","national park":"राष्ट्रीय उद्यान","biosphere reserve":"जैवमंडल आरक्षित क्षेत्र",
    "biodiversity":"जैव विविधता","natural vegetation":"प्राकृतिक वनस्पति","forest":"वन","forests":"वन",
    "drainage basin":"अपवाह बेसिन","river basin":"नदी बेसिन","tributary":"सहायक नदी","delta":"डेल्टा","estuary":"मुहाना",
    "perennial river":"बारहमासी नदी","peninsular river":"प्रायद्वीपीय नदी","Himalayan river":"हिमालयी नदी","Tawa":"तवा","Guru Shikhar":"गुरु शिखर",
    "mineral":"खनिज","minerals":"खनिज","ore":"अयस्क","ores":"अयस्क","iron ore":"लौह अयस्क","manganese":"मैंगनीज","bauxite":"बॉक्साइट","mica":"अभ्रक","limestone":"चूना पत्थर","chromite":"क्रोमाइट","copper":"तांबा","lead":"सीसा","zinc":"जस्ता","gold":"सोना","silver":"चांदी","coal":"कोयला","lignite":"लिग्नाइट","petroleum":"पेट्रोलियम","natural gas":"प्राकृतिक गैस","uranium":"यूरेनियम","thorium":"थोरियम","atomic mineral":"परमाणु खनिज","metallic mineral":"धात्विक खनिज","non-metallic mineral":"अधात्विक खनिज","ferrous mineral":"लौह खनिज","non-ferrous mineral":"अलौह खनिज","energy resource":"ऊर्जा संसाधन","energy resources":"ऊर्जा संसाधन","conventional energy":"परंपरागत ऊर्जा","non-conventional energy":"गैर-परंपरागत ऊर्जा","renewable energy":"नवीकरणीय ऊर्जा","solar energy":"सौर ऊर्जा","wind energy":"पवन ऊर्जा","thermal power":"ताप विद्युत","nuclear power":"परमाणु ऊर्जा","hydel power":"जलविद्युत","coalfield":"कोयला क्षेत्र","coalfields":"कोयला क्षेत्र","oilfield":"तेल क्षेत्र","oil fields":"तेल क्षेत्र","refinery":"रिफाइनरी","refineries":"रिफाइनरियाँ","mining":"खनन","mine":"खदान","mines":"खदानें","reserve":"भंडार","reserves":"भंडार","deposit":"निक्षेप","deposits":"निक्षेप","belt":"पट्टी","mineral belt":"खनिज पट्टी","Gondwana coal":"गोंडवाना कोयला","Tertiary coal":"टर्शियरी कोयला","Jharia":"झरिया","Raniganj":"रानीगंज","Bokaro":"बोकारो","Korba":"कोरबा","Talcher":"तालचर","Singrauli":"सिंगरौली","Digboi":"डिगबोई","Mumbai High":"मुंबई हाई","Ankleshwar":"अंकलेश्वर","Neyveli":"नेवेली","Kudremukh":"कुद्रेमुख","Bailadila":"बैलाडीला","Singhbhum":"सिंहभूम","Sukinda":"सुकिंदा","Khetri":"खेतड़ी","Kolar":"कोलार","Hutti":"हुट्टी","Monazite":"मोनाज़ाइट","monazite":"मोनाज़ाइट","Ilmenite":"इल्मेनाइट","ilmenite":"इल्मेनाइट","beach sands":"तटीय बालू","mineral sands":"खनिज बालू",
  },
  pa: {
    "Jammu and Kashmir":"ਜੰਮੂ ਅਤੇ ਕਸ਼ਮੀਰ","Himachal Pradesh":"ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼","Uttarakhand":"ਉੱਤਰਾਖੰਡ",
    "Arunachal Pradesh":"ਅਰੁਣਾਚਲ ਪ੍ਰਦੇਸ਼","Andhra Pradesh":"ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼","Madhya Pradesh":"ਮੱਧ ਪ੍ਰਦੇਸ਼",
    "Uttar Pradesh":"ਉੱਤਰ ਪ੍ਰਦੇਸ਼","West Bengal":"ਪੱਛਮੀ ਬੰਗਾਲ","Tamil Nadu":"ਤਾਮਿਲਨਾਡੂ","Maharashtra":"ਮਹਾਰਾਸ਼ਟਰ",
    "Chhattisgarh":"ਛੱਤੀਸਗੜ੍ਹ","Jharkhand":"ਝਾਰਖੰਡ","Rajasthan":"ਰਾਜਸਥਾਨ","Gujarat":"ਗੁਜਰਾਤ","Punjab":"ਪੰਜਾਬ",
    "Haryana":"ਹਰਿਆਣਾ","Kerala":"ਕੇਰਲ","Karnataka":"ਕਰਨਾਟਕ","Odisha":"ਓਡੀਸ਼ਾ","Assam":"ਅਸਾਮ","Bihar":"ਬਿਹਾਰ",
    "Sikkim":"ਸਿੱਕਿਮ","Manipur":"ਮਣੀਪੁਰ","Meghalaya":"ਮੇਘਾਲਿਆ","Mizoram":"ਮਿਜ਼ੋਰਮ","Nagaland":"ਨਾਗਾਲੈਂਡ",
    "Tripura":"ਤ੍ਰਿਪੁਰਾ","Goa":"ਗੋਆ","Telangana":"ਤੇਲੰਗਾਨਾ","Ladakh":"ਲੱਦਾਖ","Delhi":"ਦਿੱਲੀ","Chandigarh":"ਚੰਡੀਗੜ੍ਹ",
    "Puducherry":"ਪੁਡੁਚੇਰੀ","Lakshadweep":"ਲਕਸ਼ਦਵੀਪ","Andaman and Nicobar Islands":"ਅੰਡਮਾਨ ਅਤੇ ਨਿਕੋਬਾਰ ਟਾਪੂ ਸਮੂਹ",
    "Ganga":"ਗੰਗਾ","Yamuna":"ਯਮੁਨਾ","Brahmaputra":"ਬ੍ਰਹਮਪੁਤ੍ਰ","Indus":"ਸਿੰਧੂ","Sutlej":"ਸਤਲੁਜ","Beas":"ਬਿਆਸ","Ravi":"ਰਾਵੀ",
    "Chenab":"ਚਿਨਾਬ","Jhelum":"ਝੇਲਮ","Narmada":"ਨਰਮਦਾ","Tapi":"ਤਾਪਤੀ","Godavari":"ਗੋਦਾਵਰੀ","Krishna":"ਕ੍ਰਿਸ਼ਨਾ",
    "Kaveri":"ਕਾਵੇਰੀ","Mahanadi":"ਮਹਾਨਦੀ","Damodar":"ਦਾਮੋਦਰ","Son":"ਸੋਨ","Chambal":"ਚੰਬਲ","Luni":"ਲੂਨੀ","Teesta":"ਤੀਸਤਾ",
    "Sabarmati":"ਸਾਬਰਮਤੀ","Periyar":"ਪੇਰੀਆਰ","Tungabhadra":"ਤੁੰਗਭਦਰਾ","Bhagirathi":"ਭਾਗੀਰਥੀ","Alaknanda":"ਅਲਕਨੰਦਾ",
    "Himalaya":"ਹਿਮਾਲਿਆ","Himalayas":"ਹਿਮਾਲਿਆ","Western Ghats":"ਪੱਛਮੀ ਘਾਟ","Eastern Ghats":"ਪੂਰਬੀ ਘਾਟ",
    "Aravalli":"ਅਰਾਵਲੀ","Vindhya":"ਵਿੰਧਿਆ","Satpura":"ਸਤਪੁੜਾ","Nilgiri Hills":"ਨੀਲਗਿਰੀ ਪਹਾੜੀਆਂ",
    "Deccan Plateau":"ਦੱਖਣ ਦਾ ਪਠਾਰ","Chota Nagpur Plateau":"ਛੋਟਾਨਾਗਪੁਰ ਪਠਾਰ","Malwa Plateau":"ਮਾਲਵਾ ਪਠਾਰ",
    "Indo-Gangetic Plain":"ਸਿੰਧੂ-ਗੰਗਾ ਮੈਦਾਨ","Northern Plains":"ਉੱਤਰੀ ਮੈਦਾਨ","Coastal Plains":"ਤਟੀ ਮੈਦਾਨ",
    "Thar Desert":"ਥਾਰ ਮਾਰੂਥਲ","Western Coastal Plain":"ਪੱਛਮੀ ਤਟੀ ਮੈਦਾਨ","Eastern Coastal Plain":"ਪੂਰਬੀ ਤਟੀ ਮੈਦਾਨ",
    "Bay of Bengal":"ਬੰਗਾਲ ਦੀ ਖਾੜੀ","Arabian Sea":"ਅਰਬ ਸਾਗਰ","Indian Ocean":"ਹਿੰਦ ਮਹਾਂਸਾਗਰ",
    "Southwest Monsoon":"ਦੱਖਣ-ਪੱਛਮੀ ਮਾਨਸੂਨ","Northeast Monsoon":"ਉੱਤਰ-ਪੂਰਬੀ ਮਾਨਸੂਨ","retreating monsoon":"ਵਾਪਸੀ ਮਾਨਸੂਨ",
    "monsoon":"ਮਾਨਸੂਨ","rainfall":"ਵਰਖਾ","temperature":"ਤਾਪਮਾਨ","humidity":"ਨਮੀ","cyclone":"ਚੱਕਰਵਾਤ","drought":"ਸੁੱਖਾ",
    "flood":"ਹੜ੍ਹ","earthquake":"ਭੂਚਾਲ","landslide":"ਭੂਸਖਲਨ","tsunami":"ਸੁਨਾਮੀ","disaster management":"ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ",
    "alluvial soil":"ਜਲੋੜ ਮਿੱਟੀ","black soil":"ਕਾਲੀ ਮਿੱਟੀ","red soil":"ਲਾਲ ਮਿੱਟੀ","laterite soil":"ਲੇਟਰਾਈਟ ਮਿੱਟੀ",
    "arid soil":"ਸੁੱਕੀ ਮਿੱਟੀ","forest soil":"ਜੰਗਲੀ ਮਿੱਟੀ","soil erosion":"ਮਿੱਟੀ ਕਟਾਅ","soil conservation":"ਮਿੱਟੀ ਸੰਭਾਲ",
    "rice":"ਝੋਨਾ","wheat":"ਕਣਕ","maize":"ਮੱਕੀ","millets":"ਮੋਟੇ ਅਨਾਜ","cotton":"ਕਪਾਹ","jute":"ਜੂਟ","sugarcane":"ਕਮਾਦ","groundnut":"ਮੂੰਗਫ਼ਲੀ","mustard":"ਸਰ੍ਹੋਂ","soybean":"ਸੋਇਆਬੀਨ","jowar":"ਜੂਆਰ","bajra":"ਬਾਜਰਾ","gram":"ਛੋਲੇ",
    "tea":"ਚਾਹ","coffee":"ਕੌਫੀ","rubber":"ਰਬਰ","pulses":"ਦਾਲਾਂ","oilseeds":"ਤੇਲ ਬੀਜ ਫ਼ਸਲਾਂ","Kharif":"ਖਰੀਫ","Rabi":"ਰਬੀ","Zaid":"ਜ਼ਾਇਦ",
    "irrigation":"ਸਿੰਚਾਈ","groundwater":"ਭੂਜਲ","canal irrigation":"ਨਹਿਰੀ ਸਿੰਚਾਈ","tank irrigation":"ਟੈਂਕ ਸਿੰਚਾਈ",
    "drip irrigation":"ਡ੍ਰਿਪ ਸਿੰਚਾਈ","sprinkler irrigation":"ਸਪ੍ਰਿੰਕਲਰ ਸਿੰਚਾਈ","rainwater harvesting":"ਮੀਂਹ ਦੇ ਪਾਣੀ ਦੀ ਸੰਭਾਲ",
    "watershed management":"ਵਾਟਰਸ਼ੈੱਡ ਪ੍ਰਬੰਧਨ","water scarcity":"ਪਾਣੀ ਦੀ ਘਾਟ","water conservation":"ਪਾਣੀ ਸੰਭਾਲ",
    "hydroelectric power":"ਜਲ-ਬਿਜਲੀ","multipurpose project":"ਬਹੁ-ਮੰਤਵੀ ਪ੍ਰਾਜੈਕਟ","river-valley project":"ਨਦੀ-ਘਾਟੀ ਪ੍ਰਾਜੈਕਟ",
    "Bhakra-Nangal":"ਭਾਖੜਾ-ਨੰਗਲ","Hirakud":"ਹੀਰਾਕੁਡ","Tehri":"ਟਿਹਰੀ","Sardar Sarovar":"ਸਰਦਾਰ ਸਰੋਵਰ",
    "Nagarjuna Sagar":"ਨਾਗਾਰਜੁਨ ਸਾਗਰ","Damodar Valley Project":"ਦਾਮੋਦਰ ਘਾਟੀ ਪ੍ਰਾਜੈਕਟ",
    "aluminium":"ਐਲੂਮੀਨੀਅਮ","alumina":"ਐਲੂਮੀਨਾ","port hinterland":"ਪਛੋਕੜੀ ਖੇਤਰ","iron and steel industry":"ਲੋਹਾ-ਇਸਪਾਤ ਉਦਯੋਗ","cotton textile industry":"ਸੂਤੀ ਕਪੜਾ ਉਦਯੋਗ","jute industry":"ਜੂਟ ਉਦਯੋਗ",
    "sugar industry":"ਚੀਨੀ ਉਦਯੋਗ","information technology":"ਸੂਚਨਾ ਤਕਨਾਲੋਜੀ","petrochemical industry":"ਪੈਟਰੋ-ਰਸਾਇਣ ਉਦਯੋਗ",
    "industrial location":"ਉਦਯੋਗਿਕ ਟਿਕਾਣਾ","raw material":"ਕੱਚਾ ਮਾਲ","market":"ਬਾਜ਼ਾਰ","power supply":"ਬਿਜਲੀ ਸਪਲਾਈ",
    "railway":"ਰੇਲਮਾਰਗ","railways":"ਰੇਲਮਾਰਗ","road transport":"ਸੜਕ ਆਵਾਜਾਈ","national highway":"ਰਾਸ਼ਟਰੀ ਰਾਜਮਾਰਗ",
    "inland waterways":"ਅੰਦਰੂਨੀ ਜਲਮਾਰਗ","port":"ਬੰਦਰਗਾਹ","ports":"ਬੰਦਰਗਾਹ","air transport":"ਹਵਾਈ ਆਵਾਜਾਈ",
    "Golden Quadrilateral":"ਸੁਵਰਨ ਚਤੁਰਭੁਜ","North-South Corridor":"ਉੱਤਰ-ਦੱਖਣ ਗਲਿਆਰਾ","East-West Corridor":"ਪੂਰਬ-ਪੱਛਮ ਗਲਿਆਰਾ",
    "population density":"ਆਬਾਦੀ ਦੀ ਘਣਤਾ","population distribution":"ਆਬਾਦੀ ਵੰਡ","population growth":"ਆਬਾਦੀ ਵਾਧਾ",
    "sex ratio":"ਲਿੰਗ ਅਨੁਪਾਤ","literacy":"ਸਾਖਰਤਾ","urbanisation":"ਸ਼ਹਿਰੀਕਰਨ","migration":"ਪਰਵਾਸ","settlement":"ਬਸਤੀ",
    "rural settlement":"ਪਿੰਡੂ ਬਸਤੀ","urban settlement":"ਸ਼ਹਿਰੀ ਬਸਤੀ","census":"ਜਨਗਣਨਾ",
    "land degradation":"ਜ਼ਮੀਨ ਖ਼ਰਾਬੀ","land use":"ਜ਼ਮੀਨ ਦੀ ਵਰਤੋਂ","wasteland":"ਬੰਜਰ ਜ਼ਮੀਨ","forest cover":"ਜੰਗਲਾਂ ਹੇਠਲਾ ਰਕਬਾ",
    "regional planning":"ਖੇਤਰੀ ਯੋਜਨਾਬੰਦੀ","planning region":"ਯੋਜਨਾਬੰਦੀ ਖੇਤਰ","resource planning":"ਸੰਸਾਧਨਾਂ ਦੀ ਯੋਜਨਾਬੰਦੀ",
    "neighbouring country":"ਪੜੋਸੀ ਦੇਸ਼","international boundary":"ਅੰਤਰਰਾਸ਼ਟਰੀ ਸਰਹੱਦ","coastline":"ਸਮੁੰਦਰੀ ਤਟਰੇਖਾ",
    "latitudinal extent":"ਅਕਸ਼ਾਂਸ਼ੀ ਫੈਲਾਅ","longitudinal extent":"ਦੇਸ਼ਾਂਤਰ ਫੈਲਾਅ","Standard Meridian":"ਮਿਆਰੀ ਦੇਸ਼ਾਂਤਰ ਰੇਖਾ",
    "Tropic of Cancer":"ਕਰਕ ਰੇਖਾ","Indian Standard Time":"ਭਾਰਤੀ ਮਿਆਰੀ ਸਮਾਂ",
    "evergreen forest":"ਸਦਾਬਹਾਰ ਜੰਗਲ","deciduous forest":"ਪੱਤਝੜੀ ਜੰਗਲ","thorn forest":"ਕਾਂਟੇਦਾਰ ਜੰਗਲ","mangrove forest":"ਮੈਂਗਰੋਵ ਜੰਗਲ","tropical evergreen forest":"ਉਸ਼ਣ ਸਦਾਬਹਾਰ ਵਣ","tropical deciduous forest":"ਊਸ਼ਣ-ਪੱਤਝੜੀ ਵਣ","tropical thorn forest":"ਉਸ਼ਣ ਕੰਡੇਦਾਰ ਵਣ","scrub":"ਝਾੜੀਦਾਰ ਬਨਸਪਤੀ","teak":"ਸਾਗਵਾਨ","sal":"ਸਾਲ","fir":"ਫਰ","spruce":"ਸਪ੍ਰੂਸ","acacia":"ਕਿੱਕਰ","babool":"ਬਬੂਲ","Nilgai":"ਨੀਲਗਾਇ","Gir Forest":"ਗਿਰ ਜੰਗਲ","Royal Bengal Tiger":"ਰੋਇਲ ਬੰਗਾਲ ਟਾਈਗਰ",
    "wildlife sanctuary":"ਜੰਗਲੀ ਜੀਵ ਰੱਖ","national park":"ਰਾਸ਼ਟਰੀ ਪਾਰਕ","biosphere reserve":"ਜੀਵਮੰਡਲ ਰਾਖਵਾਂ ਖੇਤਰ",
    "biodiversity":"ਜੈਵਿਕ ਵਿਭਿੰਨਤਾ","natural vegetation":"ਕੁਦਰਤੀ ਬਨਸਪਤੀ","forest":"ਜੰਗਲ","forests":"ਜੰਗਲ",
    "drainage basin":"ਜਲ-ਨਿਕਾਸ ਖੇਤਰ","river basin":"ਨਦੀ ਬੇਸਿਨ","tributary":"ਸਹਾਇਕ ਨਦੀ","delta":"ਡੈਲਟਾ","estuary":"ਮੁਹਾਨਾ",
    "perennial river":"ਸਦਾ ਵਗਣ ਵਾਲੀ ਨਦੀ","peninsular river":"ਪ੍ਰਾਇਦੀਪੀ ਨਦੀ","Himalayan river":"ਹਿਮਾਲਈ ਨਦੀ","Tawa":"ਤਵਾ","Guru Shikhar":"ਗੁਰੂ ਸ਼ਿਖਰ",
    "mineral":"ਖਣਿਜ","minerals":"ਖਣਿਜ","ore":"ਕੱਚੀ ਧਾਤ","ores":"ਕੱਚੀਆਂ ਧਾਤਾਂ","iron ore":"ਲੋਹੇ ਦੀ ਕੱਚੀ ਧਾਤ","manganese":"ਮੈਂਗਨੀਜ਼","bauxite":"ਬਾਕਸਾਈਟ","mica":"ਅਭਰਕ","limestone":"ਚੂਨਾ ਪੱਥਰ","chromite":"ਕ੍ਰੋਮਾਈਟ","copper":"ਤਾਂਬਾ","lead":"ਸੀਸਾ","zinc":"ਜ਼ਿੰਕ","gold":"ਸੋਨਾ","silver":"ਚਾਂਦੀ","coal":"ਕੋਇਲਾ","lignite":"ਲਿਗਨਾਈਟ","petroleum":"ਪੈਟਰੋਲਿਅਮ","natural gas":"ਕੁਦਰਤੀ ਗੈਸ","uranium":"ਯੂਰੇਨੀਅਮ","thorium":"ਥੋਰੀਅਮ","atomic mineral":"ਪਰਮਾਣੂ ਖਣਿਜ","metallic mineral":"ਧਾਤੂ ਖਣਿਜ","non-metallic mineral":"ਗੈਰ-ਧਾਤੂ ਖਣਿਜ","ferrous mineral":"ਲੋਹ-ਧਾਤੂ ਖਣਿਜ","non-ferrous mineral":"ਗੈਰ-ਲੋਹ ਧਾਤੂ ਖਣਿਜ","energy resource":"ਊਰਜਾ ਸਰੋਤ","energy resources":"ਊਰਜਾ ਸਰੋਤ","conventional energy":"ਪਰੰਪਰਾਗਤ ਊਰਜਾ","non-conventional energy":"ਗੈਰ-ਪਰੰਪਰਾਗਤ ਊਰਜਾ","renewable energy":"ਨਵੀਕਰਣਯੋਗ ਊਰਜਾ","solar energy":"ਸੂਰਜੀ ਊਰਜਾ","wind energy":"ਪਵਨ ਊਰਜਾ","thermal power":"ਤਾਪ ਬਿਜਲੀ","nuclear power":"ਪਰਮਾਣੂ ਊਰਜਾ","hydel power":"ਜਲ-ਬਿਜਲੀ","coalfield":"ਕੋਇਲਾ ਖੇਤਰ","coalfields":"ਕੋਇਲਾ ਖੇਤਰ","oilfield":"ਤੇਲ ਖੇਤਰ","oil fields":"ਤੇਲ ਖੇਤਰ","refinery":"ਰਿਫਾਇਨਰੀ","refineries":"ਰਿਫਾਇਨਰੀਆਂ","mining":"ਖਣਨ","mine":"ਖਾਣ","mines":"ਖਾਣਾਂ","reserve":"ਭੰਡਾਰ","reserves":"ਭੰਡਾਰ","deposit":"ਭੰਡਾਰ","deposits":"ਭੰਡਾਰ","belt":"ਪੱਟੀ","mineral belt":"ਖਣਿਜ ਪੱਟੀ","Gondwana coal":"ਗੋਂਡਵਾਨਾ ਕੋਇਲਾ","Tertiary coal":"ਟਰਸ਼ੀਅਰੀ ਕੋਇਲਾ","Jharia":"ਝਾਰੀਆ","Raniganj":"ਰਾਨੀਗੰਜ","Bokaro":"ਬੋਕਾਰੋ","Korba":"ਕੋਰਬਾ","Talcher":"ਤਾਲਚੇਰ","Singrauli":"ਸਿੰਗਰੌਲੀ","Digboi":"ਡਿਗਬੋਈ","Mumbai High":"ਮੁੰਬਈ ਹਾਈ","Ankleshwar":"ਅੰਕਲੇਸ਼ਵਰ","Neyveli":"ਨੇਵੈਲੀ","Kudremukh":"ਕੁਦਰੇਮੁਖ","Bailadila":"ਬੈਲਾਡੀਲਾ","Singhbhum":"ਸਿੰਘਭੂਮ","Sukinda":"ਸੁਕਿੰਦਾ","Khetri":"ਖੇਤੜੀ","Kolar":"ਕੋਲਾਰ","Hutti":"ਹੁੱਟੀ","Monazite":"ਮੋਨਾਜ਼ਾਈਟ","monazite":"ਮੋਨਾਜ਼ਾਈਟ","Ilmenite":"ਇਲਮੇਨਾਈਟ","ilmenite":"ਇਲਮੇਨਾਈਟ","beach sands":"ਤਟੀ ਰੇਤ","mineral sands":"ਖਣਿਜ ਰੇਤ",
  },
};

const PHRASES: Record<"hi"|"pa", readonly [string,string][]> = {
  hi: [
    ["Consider the statements:","निम्न कथनों पर विचार कीजिए:"],["Which is correct?","कौन-सा सही है?"],
    ["Which of the following","निम्नलिखित में से कौन-सा"],["Which statement","कौन-सा कथन"],["Which pair","कौन-सा युग्म"],
    ["Which combination","कौन-सा संयोजन"],["Which factor","कौन-सा कारक"],["Which region","कौन-सा क्षेत्र"],
    ["Which state","कौन-सा राज्य"],["Which river","कौन-सी नदी"],["Which project","कौन-सी परियोजना"],
    ["Which crop","कौन-सी फसल"],["Which soil","कौन-सी मिट्टी"],["Which industry","कौन-सा उद्योग"],
    ["Which method","कौन-सी विधि"],["Which feature","कौन-सी विशेषता"],["Which area","कौन-सा क्षेत्र"],
    ["What is the main","मुख्य"],["What is a major","एक प्रमुख"],["What is the","क्या है"],["What does","का क्या अर्थ है"],
    ["Why is","क्यों है"],["Why are","क्यों हैं"],["Why does","क्यों"],["Where is","कहाँ है"],["How does","कैसे"],
    ["is located in","में स्थित है"],["is located","स्थित है"],["lies in","में स्थित है"],["lies on","पर स्थित है"],
    ["is found in","में पाया जाता है"],["is associated with","से जुड़ा है"],["is linked with","से जुड़ा है"],
    ["is built on","पर बना है"],["is formed by","से बनता है"],["is known for","के लिए प्रसिद्ध है"],
    ["are known for","के लिए प्रसिद्ध हैं"],["is important for","के लिए महत्वपूर्ण है"],["is most suitable for","के लिए सबसे उपयुक्त है"],
    ["is most likely","सबसे अधिक संभावित है"],["is mainly found","मुख्यतः पाया जाता है"],["is best suited","सबसे उपयुक्त है"],
    ["most directly","सबसे सीधे"],["most closely","सबसे निकट"],["most important","सबसे महत्वपूर्ण"],
    ["mainly because","मुख्यतः क्योंकि"],["generally","सामान्यतः"],["commonly","आमतौर पर"],["primarily","मुख्यतः"],
    ["A major","एक प्रमुख"],["A large","एक बड़ा"],["A region","एक क्षेत्र"],["An area","एक क्षेत्र"],["A farmer","एक किसान"],
    ["The main reason","मुख्य कारण"],["the most","सबसे"],["the largest","सबसे बड़ा"],["the highest","सबसे अधिक"],["the lowest","सबसे कम"],
    ["correctly matched","सही सुमेलित"],["correctly identifies","सही पहचान करता है"],["correctly describes","सही वर्णन करता है"],
    ["supports","सहायता करता है"],["helps","मदद करता है"],["reduces","कम करता है"],["increases","बढ़ाता है"],
    ["because","क्योंकि"],["therefore","इसलिए"],["during","के दौरान"],["between","के बीच"],["across","भर में"],
  ],
  pa: [
    ["Consider the statements:","ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:"],["Which is correct?","ਕਿਹੜਾ ਸਹੀ ਹੈ?"],
    ["Which of the following","ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ"],["Which statement","ਕਿਹੜਾ ਕਥਨ"],["Which pair","ਕਿਹੜੀ ਜੋੜੀ"],
    ["Which combination","ਕਿਹੜਾ ਜੋੜ"],["Which factor","ਕਿਹੜਾ ਕਾਰਕ"],["Which region","ਕਿਹੜਾ ਖੇਤਰ"],
    ["Which state","ਕਿਹੜਾ ਰਾਜ"],["Which river","ਕਿਹੜੀ ਨਦੀ"],["Which project","ਕਿਹੜਾ ਪ੍ਰਾਜੈਕਟ"],
    ["Which crop","ਕਿਹੜੀ ਫਸਲ"],["Which soil","ਕਿਹੜੀ ਮਿੱਟੀ"],["Which industry","ਕਿਹੜਾ ਉਦਯੋਗ"],
    ["Which method","ਕਿਹੜੀ ਵਿਧੀ"],["Which feature","ਕਿਹੜੀ ਵਿਸ਼ੇਸ਼ਤਾ"],["Which area","ਕਿਹੜਾ ਖੇਤਰ"],
    ["What is the main","ਮੁੱਖ"],["What is a major","ਇੱਕ ਮੁੱਖ"],["What is the","ਕੀ ਹੈ"],["What does","ਦਾ ਕੀ ਅਰਥ ਹੈ"],
    ["Why is","ਕਿਉਂ ਹੈ"],["Why are","ਕਿਉਂ ਹਨ"],["Why does","ਕਿਉਂ"],["Where is","ਕਿੱਥੇ ਹੈ"],["How does","ਕਿਵੇਂ"],
    ["is located in","ਵਿੱਚ ਸਥਿਤ ਹੈ"],["is located","ਸਥਿਤ ਹੈ"],["lies in","ਵਿੱਚ ਸਥਿਤ ਹੈ"],["lies on","ਉੱਤੇ ਸਥਿਤ ਹੈ"],
    ["is found in","ਵਿੱਚ ਮਿਲਦਾ ਹੈ"],["is associated with","ਨਾਲ ਜੁੜਿਆ ਹੈ"],["is linked with","ਨਾਲ ਜੁੜਿਆ ਹੈ"],
    ["is built on","ਉੱਤੇ ਬਣਿਆ ਹੈ"],["is formed by","ਤੋਂ ਬਣਦਾ ਹੈ"],["is known for","ਲਈ ਮਸ਼ਹੂਰ ਹੈ"],
    ["are known for","ਲਈ ਮਸ਼ਹੂਰ ਹਨ"],["is important for","ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ"],["is most suitable for","ਲਈ ਸਭ ਤੋਂ ਉਚਿਤ ਹੈ"],
    ["is most likely","ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਹੈ"],["is mainly found","ਮੁੱਖ ਤੌਰ ਤੇ ਮਿਲਦਾ ਹੈ"],["is best suited","ਸਭ ਤੋਂ ਉਚਿਤ ਹੈ"],
    ["most directly","ਸਭ ਤੋਂ ਸਿੱਧੇ"],["most closely","ਸਭ ਤੋਂ ਨੇੜੇ"],["most important","ਸਭ ਤੋਂ ਮਹੱਤਵਪੂਰਨ"],
    ["mainly because","ਮੁੱਖ ਤੌਰ ਤੇ ਕਿਉਂਕਿ"],["generally","ਆਮ ਤੌਰ ਤੇ"],["commonly","ਆਮ ਤੌਰ ਤੇ"],["primarily","ਮੁੱਖ ਤੌਰ ਤੇ"],
    ["A major","ਇੱਕ ਮੁੱਖ"],["A large","ਇੱਕ ਵੱਡਾ"],["A region","ਇੱਕ ਖੇਤਰ"],["An area","ਇੱਕ ਖੇਤਰ"],["A farmer","ਇੱਕ ਕਿਸਾਨ"],
    ["The main reason","ਮੁੱਖ ਕਾਰਨ"],["the most","ਸਭ ਤੋਂ"],["the largest","ਸਭ ਤੋਂ ਵੱਡਾ"],["the highest","ਸਭ ਤੋਂ ਵੱਧ"],["the lowest","ਸਭ ਤੋਂ ਘੱਟ"],
    ["correctly matched","ਸਹੀ ਮਿਲਾਇਆ"],["correctly identifies","ਸਹੀ ਪਛਾਣ ਕਰਦਾ ਹੈ"],["correctly describes","ਸਹੀ ਵਰਣਨ ਕਰਦਾ ਹੈ"],
    ["supports","ਮਦਦ ਕਰਦਾ ਹੈ"],["helps","ਮਦਦ ਕਰਦਾ ਹੈ"],["reduces","ਘਟਾਉਂਦਾ ਹੈ"],["increases","ਵਧਾਉਂਦਾ ਹੈ"],
    ["because","ਕਿਉਂਕਿ"],["therefore","ਇਸ ਲਈ"],["during","ਦੇ ਦੌਰਾਨ"],["between","ਦੇ ਵਿਚਕਾਰ"],["across","ਭਰ ਵਿੱਚ"],
  ],
};

const WORDS: Record<"hi"|"pa", Record<string,string>> = {
  hi: {
    "state":"राज्य","states":"राज्य","region":"क्षेत्र","regions":"क्षेत्र","river":"नदी","rivers":"नदियाँ","plain":"मैदान","plains":"मैदान",
    "plateau":"पठार","mountain":"पर्वत","mountains":"पर्वत","range":"श्रेणी","valley":"घाटी","coast":"तट","coastal":"तटीय","island":"द्वीप","islands":"द्वीप",
    "soil":"मिट्टी","crop":"फसल","crops":"फसलें","agriculture":"कृषि","industry":"उद्योग","industries":"उद्योग","project":"परियोजना","dam":"बांध",
    "water":"जल","groundwater":"भूजल","rain":"वर्षा","forest":"वन","population":"जनसंख्या","density":"घनत्व","transport":"परिवहन",
    "road":"सड़क","roads":"सड़कें","rail":"रेल","route":"मार्ग","routes":"मार्ग","port":"बंदरगाह","airport":"हवाई अड्डा","city":"शहर","cities":"शहर",
    "north":"उत्तर","south":"दक्षिण","east":"पूर्व","west":"पश्चिम","northern":"उत्तरी","southern":"दक्षिणी","eastern":"पूर्वी","western":"पश्चिमी",
    "high":"उच्च","low":"निम्न","higher":"अधिक","lower":"कम","major":"प्रमुख","main":"मुख्य","large":"बड़ा","small":"छोटा","important":"महत्वपूर्ण",
    "season":"ऋतु","summer":"ग्रीष्म","winter":"शीत","annual":"वार्षिक","seasonal":"मौसमी","climate":"जलवायु","weather":"मौसम",
    "source":"स्रोत","mouth":"मुहाना","basin":"बेसिन","drainage":"अपवाह","flow":"प्रवाह","flows":"बहती है","origin":"उद्गम","tributaries":"सहायक नदियाँ",
    "production":"उत्पादन","producer":"उत्पादक","cultivation":"खेती","grown":"उगाई जाती है","growth":"वृद्धि","distribution":"वितरण",
    "located":"स्थित","found":"पाया","linked":"जुड़ा","known":"जाना","called":"कहा","used":"उपयोग","uses":"उपयोग करता है","provides":"प्रदान करता है",
    "supply":"आपूर्ति","power":"बिजली","floods":"बाढ़","scarcity":"कमी","conservation":"संरक्षण","erosion":"अपरदन","degradation":"क्षरण",
    "India":"भारत","Indian":"भारतीय","area":"क्षेत्र","areas":"क्षेत्र","system":"प्रणाली","systems":"प्रणालियाँ","zone":"क्षेत्र","zones":"क्षेत्र",
  },
  pa: {
    "state":"ਰਾਜ","states":"ਰਾਜ","region":"ਖੇਤਰ","regions":"ਖੇਤਰ","river":"ਨਦੀ","rivers":"ਨਦੀਆਂ","plain":"ਮੈਦਾਨ","plains":"ਮੈਦਾਨ",
    "plateau":"ਪਠਾਰ","mountain":"ਪਹਾੜ","mountains":"ਪਹਾੜ","range":"ਲੜੀ","valley":"ਘਾਟੀ","coast":"ਤਟ","coastal":"ਤਟੀ","island":"ਟਾਪੂ","islands":"ਟਾਪੂ",
    "soil":"ਮਿੱਟੀ","crop":"ਫਸਲ","crops":"ਫਸਲਾਂ","agriculture":"ਖੇਤੀਬਾੜੀ","industry":"ਉਦਯੋਗ","industries":"ਉਦਯੋਗ","project":"ਪ੍ਰਾਜੈਕਟ","dam":"ਬੰਨ੍ਹ",
    "water":"ਪਾਣੀ","groundwater":"ਭੂਜਲ","rain":"ਵਰਖਾ","forest":"ਜੰਗਲ","population":"ਆਬਾਦੀ","density":"ਘਣਤਾ","transport":"ਆਵਾਜਾਈ",
    "road":"ਸੜਕ","roads":"ਸੜਕਾਂ","rail":"ਰੇਲ","route":"ਰਸਤਾ","routes":"ਰਸਤੇ","port":"ਬੰਦਰਗਾਹ","airport":"ਹਵਾਈ ਅੱਡਾ","city":"ਸ਼ਹਿਰ","cities":"ਸ਼ਹਿਰ",
    "north":"ਉੱਤਰ","south":"ਦੱਖਣ","east":"ਪੂਰਬ","west":"ਪੱਛਮ","northern":"ਉੱਤਰੀ","southern":"ਦੱਖਣੀ","eastern":"ਪੂਰਬੀ","western":"ਪੱਛਮੀ",
    "high":"ਉੱਚ","low":"ਘੱਟ","higher":"ਵੱਧ","lower":"ਘੱਟ","major":"ਮੁੱਖ","main":"ਮੁੱਖ","large":"ਵੱਡਾ","small":"ਛੋਟਾ","important":"ਮਹੱਤਵਪੂਰਨ",
    "season":"ਮੌਸਮ","summer":"ਗਰਮੀ","winter":"ਸਰਦੀ","annual":"ਸਾਲਾਨਾ","seasonal":"ਮੌਸਮੀ","climate":"ਜਲਵਾਯੂ","weather":"ਮੌਸਮ",
    "source":"ਸਰੋਤ","mouth":"ਮੁਹਾਨਾ","basin":"ਬੇਸਿਨ","drainage":"ਨਿਕਾਸੀ","flow":"ਵਹਾਅ","flows":"ਵਗਦੀ ਹੈ","origin":"ਉਦਗਮ","tributaries":"ਸਹਾਇਕ ਨਦੀਆਂ",
    "production":"ਉਤਪਾਦਨ","producer":"ਉਤਪਾਦਕ","cultivation":"ਕਾਸ਼ਤ","grown":"ਉਗਾਈ ਜਾਂਦੀ ਹੈ","growth":"ਵਾਧਾ","distribution":"ਵੰਡ",
    "located":"ਸਥਿਤ","found":"ਮਿਲਦਾ","linked":"ਜੁੜਿਆ","known":"ਜਾਣਿਆ","called":"ਕਿਹਾ","used":"ਵਰਤੋਂ","uses":"ਵਰਤਦਾ ਹੈ","provides":"ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ",
    "supply":"ਸਪਲਾਈ","power":"ਬਿਜਲੀ","floods":"ਹੜ੍ਹ","scarcity":"ਘਾਟ","conservation":"ਸੰਭਾਲ","erosion":"ਕਟਾਅ","degradation":"ਖ਼ਰਾਬੀ",
    "India":"ਭਾਰਤ","Indian":"ਭਾਰਤੀ","area":"ਖੇਤਰ","areas":"ਖੇਤਰ","system":"ਪ੍ਰਣਾਲੀ","systems":"ਪ੍ਰਣਾਲੀਆਂ","zone":"ਖੇਤਰ","zones":"ਖੇਤਰ",
  },
};

function replaceTerms(text: string, language: "hi"|"pa") {
  let out = text;
  for (const [from,to] of Object.entries(TERMS[language]).sort((a,b)=>b[0].length-a[0].length)) {
    out = out.replace(new RegExp(regexEscape(from), "gi"), to);
  }
  return out;
}

function regexEscape(value: string) {
  return value.replace(/[.*+?^$()|[\]{}\\]/g, "\\$&");
}

function replaceWords(text: string, language: "hi"|"pa") {
  let out = text;
  for (const [from,to] of Object.entries(WORDS[language]).sort((a,b)=>b[0].length-a[0].length)) {
    out = out.replace(new RegExp("\\b"+regexEscape(from)+"\\b","gi"), to);
  }
  return out;
}

function localizeText(text: string, language: "hi"|"pa") {
  const exact = EXACT[language][text];
  if (exact) return exact;
  let out = text;
  for (const [from,to] of PHRASES[language]) out = out.split(from).join(to);
  out = replaceTerms(out, language);
  out = replaceWords(out, language);
  return out.replace(/\s+/g," ").replace(/\s+([,.;:?])/g,"$1").trim();
}

function localizeFragment(text: string, language: "hi"|"pa") {
  return replaceWords(replaceTerms(text, language), language)
    .replace(/\s+/g, " ")
    .trim();
}

function localizeNaturalStem(text: string, language: "hi"|"pa", packageId?: string) {
  const f = (value: string) => localizeFragment(value, language);
  const hi = language === "hi";

  if (packageId === "GEO-RIV-001") {
    let m = text.match(/^River (.+?) rises near which of the following places\?$/);
    if (m) return hi ? `नदी ${f(m[1])} का उद्गम निम्नलिखित में से किस स्थान के निकट है?` : `ਨਦੀ ${f(m[1])} ਦਾ ਉਦਗਮ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੇ ਸਥਾਨ ਦੇ ਨੇੜੇ ਹੈ?`;

    m = text.match(/^Which west-flowing river originates near (.+?) in the (.+?)\?$/);
    if (m) return hi ? `${f(m[1])} के निकट ${f(m[2])} में किस पश्चिमवाहिनी नदी का उद्गम होता है?` : `${f(m[2])} ਵਿੱਚ ${f(m[1])} ਦੇ ਨੇੜੇ ਕਿਹੜੀ ਪੱਛਮ ਵੱਲ ਵਗਣ ਵਾਲੀ ਨਦੀ ਦਾ ਉਦਗਮ ਹੁੰਦਾ ਹੈ?`;

    m = text.match(/^River (.+?) is a tributary of which river\?$/);
    if (m) return hi ? `नदी ${f(m[1])} किस नदी की सहायक नदी है?` : `ਨਦੀ ${f(m[1])} ਕਿਹੜੀ ਨਦੀ ਦੀ ਸਹਾਇਕ ਨਦੀ ਹੈ?`;

    m = text.match(/^Which of the following cities is situated on (River .+?)\?$/);
    if (m) return hi ? `निम्नलिखित में से कौन-सा शहर ${f(m[1])} के तट पर स्थित है?` : `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਹਿਰ ${f(m[1])} ਦੇ ਕੰਢੇ ਸਥਿਤ ਹੈ?`;

    m = text.match(/^Which river is associated with (.+?)\?$/);
    if (m) return hi ? `${f(m[1])} किस नदी के तट पर स्थित है?` : `${f(m[1])} ਕਿਹੜੀ ਨਦੀ ਦੇ ਕੰਢੇ ਸਥਿਤ ਹੈ?`;

    m = text.match(/^Which pair of cities is correctly associated with (River .+?)\?$/);
    if (m) return hi ? `शहरों का कौन-सा युग्म ${f(m[1])} से सही रूप से जुड़ा है?` : `ਸ਼ਹਿਰਾਂ ਦੀ ਕਿਹੜੀ ਜੋੜੀ ${f(m[1])} ਨਾਲ ਸਹੀ ਤਰ੍ਹਾਂ ਜੁੜੀ ਹੈ?`;

    m = text.match(/^Which river has its Indian main course through the following state set: (.+?)\?$/);
    if (m) return hi ? `कौन-सी नदी भारत में मुख्यतः इन राज्यों से होकर बहती है: ${f(m[1])}?` : `ਕਿਹੜੀ ਨਦੀ ਭਾਰਤ ਵਿੱਚ ਮੁੱਖ ਤੌਰ ਤੇ ਇਨ੍ਹਾਂ ਰਾਜਾਂ ਵਿੱਚੋਂ ਵਗਦੀ ਹੈ: ${f(m[1])}?`;

    m = text.match(/^Which river's course in India passes through only the following states: (.+?)\?$/);
    if (m) return hi ? `भारत में कौन-सी नदी केवल इन राज्यों से होकर बहती है: ${f(m[1])}?` : `ਭਾਰਤ ਵਿੱਚ ਕਿਹੜੀ ਨਦੀ ਕੇਵਲ ਇਨ੍ਹਾਂ ਰਾਜਾਂ ਵਿੱਚੋਂ ਵਗਦੀ ਹੈ: ${f(m[1])}?`;

    m = text.match(/^The (.+?) (?:rises|originates) in which state\?$/);
    if (m) return hi ? `${f(m[1])} का उद्गम किस राज्य में होता है?` : `${f(m[1])} ਦਾ ਉਦਗਮ ਕਿਹੜੇ ਰਾਜ ਵਿੱਚ ਹੁੰਦਾ ਹੈ?`;
  }

  if (packageId === "GEO-CLI-001") {
    let m = text.match(/^What is a key feature of India's monsoon climate\?$/);
    if (m) return hi ? "भारत की मानसूनी जलवायु की प्रमुख विशेषता क्या है?" : "ਭਾਰਤ ਦੀ ਮਾਨਸੂਨੀ ਜਲਵਾਯੂ ਦੀ ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾ ਕੀ ਹੈ?";

    m = text.match(/^Which pair correctly links a climate control with its main effect in India\?$/);
    if (m) return hi ? "कौन-सा युग्म भारत में किसी जलवायु नियंत्रक कारक को उसके प्रमुख प्रभाव से सही रूप से जोड़ता है?" : "ਕਿਹੜੀ ਜੋੜੀ ਭਾਰਤ ਵਿੱਚ ਕਿਸੇ ਜਲਵਾਯੂ ਨਿਯੰਤਰਕ ਕਾਰਕ ਨੂੰ ਉਸਦੇ ਮੁੱਖ ਪ੍ਰਭਾਵ ਨਾਲ ਸਹੀ ਤਰ੍ਹਾਂ ਜੋੜਦੀ ਹੈ?";

    m = text.match(/^A place is very hot in May, receives sudden heavy rain in June, and becomes drier by October\. Which sequence fits this change\?$/);
    if (m) return hi ? "किसी स्थान पर मई में बहुत गर्मी, जून में अचानक भारी वर्षा और अक्टूबर तक शुष्कता बढ़ती है। यह परिवर्तन किस मौसमी क्रम को दर्शाता है?" : "ਕਿਸੇ ਥਾਂ ਮਈ ਵਿੱਚ ਬਹੁਤ ਗਰਮੀ, ਜੂਨ ਵਿੱਚ ਅਚਾਨਕ ਭਾਰੀ ਵਰਖਾ ਅਤੇ ਅਕਤੂਬਰ ਤੱਕ ਸੁੱਕਾਪਣ ਵਧਦਾ ਹੈ। ਇਹ ਬਦਲਾਅ ਕਿਹੜੇ ਮੌਸਮੀ ਕ੍ਰਮ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?";

    m = text.match(/^Which combination best supports the onset of the southwest monsoon over India\?$/);
    if (m) return hi ? "भारत में दक्षिण-पश्चिम मानसून के आगमन के लिए कौन-सा संयोजन सबसे अधिक अनुकूल है?" : "ਭਾਰਤ ਵਿੱਚ ਦੱਖਣ-ਪੱਛਮੀ ਮਾਨਸੂਨ ਦੇ ਆਗਮਨ ਲਈ ਕਿਹੜਾ ਜੋੜ ਸਭ ਤੋਂ ਵੱਧ ਅਨੁਕੂਲ ਹੈ?";

    m = text.match(/^Which region is most likely to receive heavy monsoon rain because moist winds rise against the Western Ghats\?$/);
    if (m) return hi ? "पश्चिमी घाट से टकराकर नम हवाओं के ऊपर उठने के कारण किस क्षेत्र में भारी मानसूनी वर्षा होने की संभावना सबसे अधिक है?" : "ਪੱਛਮੀ ਘਾਟ ਨਾਲ ਟਕਰਾ ਕੇ ਨਮੀ ਵਾਲੀਆਂ ਹਵਾਵਾਂ ਦੇ ਉੱਪਰ ਚੜ੍ਹਨ ਕਾਰਨ ਕਿਹੜੇ ਖੇਤਰ ਵਿੱਚ ਭਾਰੀ ਮਾਨਸੂਨੀ ਵਰਖਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਸਭ ਤੋਂ ਵੱਧ ਹੈ?";

    m = text.match(/^Which pairing correctly links a weather system with its main Indian climate effect\?$/);
    if (m) return hi ? "कौन-सा युग्म किसी मौसम प्रणाली को भारत पर उसके प्रमुख जलवायु प्रभाव से सही रूप से जोड़ता है?" : "ਕਿਹੜੀ ਜੋੜੀ ਕਿਸੇ ਮੌਸਮੀ ਪ੍ਰਣਾਲੀ ਨੂੰ ਭਾਰਤ ਉੱਤੇ ਉਸਦੇ ਮੁੱਖ ਜਲਵਾਯੂ ਪ੍ਰਭਾਵ ਨਾਲ ਸਹੀ ਤਰ੍ਹਾਂ ਜੋੜਦੀ ਹੈ?";

    m = text.match(/^Which set of region–climate links is correctly matched\?$/);
    if (m) return hi ? "क्षेत्र और जलवायु संबंधों का कौन-सा समूह सही सुमेलित है?" : "ਖੇਤਰ ਅਤੇ ਜਲਵਾਯੂ ਸੰਬੰਧਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";

    m = text.match(/^Which cause–effect pair correctly explains a common Indian climate pattern\?$/);
    if (m) return hi ? "कौन-सा कारण–प्रभाव युग्म भारत की एक सामान्य जलवायु विशेषता को सही रूप से समझाता है?" : "ਕਿਹੜੀ ਕਾਰਨ–ਪ੍ਰਭਾਵ ਜੋੜੀ ਭਾਰਤ ਦੀ ਇੱਕ ਆਮ ਜਲਵਾਯੂ ਵਿਸ਼ੇਸ਼ਤਾ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ?";

    m = text.match(/^Which route best describes western disturbances before they reach northwestern India\?$/);
    if (m) return hi ? "उत्तर-पश्चिम भारत पहुँचने से पहले पश्चिमी विक्षोभों का मार्ग कौन-सा है?" : "ਉੱਤਰ-ਪੱਛਮੀ ਭਾਰਤ ਪਹੁੰਚਣ ਤੋਂ ਪਹਿਲਾਂ ਪੱਛਮੀ ਵਿਘਨਾਂ ਦਾ ਰਸਤਾ ਕਿਹੜਾ ਹੈ?";

    m = text.match(/^Western disturbances generally enter India from which side of the country\?$/);
    if (m) return hi ? "पश्चिमी विक्षोभ सामान्यतः भारत में किस दिशा से प्रवेश करते हैं?" : "ਪੱਛਮੀ ਵਿਘਨ ਆਮ ਤੌਰ ਤੇ ਭਾਰਤ ਵਿੱਚ ਕਿਹੜੀ ਦਿਸ਼ਾ ਤੋਂ ਦਾਖਲ ਹੁੰਦੇ ਹਨ?";
  }

  if (packageId === "GEO-SOI-001") {
    let m = text.match(/^Which parent material is most closely linked with the formation of (.+?) in peninsular India\?$/);
    if (m) return hi ? `प्रायद्वीपीय भारत में ${f(m[1])} के निर्माण से कौन-सा मूल पदार्थ सबसे अधिक जुड़ा है?` : `ਪ੍ਰਾਇਦੀਪੀ ਭਾਰਤ ਵਿੱਚ ${f(m[1])} ਦੇ ਬਣਨ ਨਾਲ ਕਿਹੜਾ ਮੂਲ ਪਦਾਰਥ ਸਭ ਤੋਂ ਵੱਧ ਜੁੜਿਆ ਹੈ?`;

    m = text.match(/^A soil map shows a continuous belt across (.+?)\. Which soil is being shown\?$/);
    if (m) return hi ? `${f(m[1])} में फैली लगातार पट्टी मानचित्र पर किस मिट्टी को दर्शाती है?` : `${f(m[1])} ਵਿੱਚ ਫੈਲੀ ਲਗਾਤਾਰ ਪੱਟੀ ਨਕਸ਼ੇ ਉੱਤੇ ਕਿਹੜੀ ਮਿੱਟੀ ਦਰਸਾਉਂਦੀ ਹੈ?`;

    m = text.match(/^Which combination is most typical of (.+?) occurrence\?$/);
    if (m) return hi ? `${f(m[1])} की उपस्थिति के लिए कौन-सा संयोजन सबसे सामान्य है?` : `${f(m[1])} ਦੀ ਮੌਜੂਦਗੀ ਲਈ ਕਿਹੜਾ ਜੋੜ ਸਭ ਤੋਂ ਆਮ ਹੈ?`;

    m = text.match(/^Which statement best distinguishes soil erosion from soil formation\?$/);
    if (m) return hi ? "मृदा अपरदन और मृदा निर्माण के बीच अंतर को कौन-सा कथन सबसे सही बताता है?" : "ਮਿੱਟੀ ਕਟਾਅ ਅਤੇ ਮਿੱਟੀ ਬਣਨ ਵਿਚਲਾ ਫਰਕ ਕਿਹੜਾ ਕਥਨ ਸਭ ਤੋਂ ਸਹੀ ਦੱਸਦਾ ਹੈ?";

    m = text.match(/^Which set of soil-formation pairs is fully correct\?$/);
    if (m) return hi ? "मिट्टी और उसके निर्माण की प्रक्रियाओं का कौन-सा समूह पूरी तरह सही है?" : "ਮਿੱਟੀ ਅਤੇ ਉਸਦੀ ਬਣਤਰ ਦੀਆਂ ਪ੍ਰਕਿਰਿਆਵਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹੀ ਹੈ?";
  }

  if (packageId === "GEO-AGR-001") {
    let m = text.match(/^A crop is sown soon after monsoon rain arrives and harvested after the rainy season\. Which crop season does this describe\?$/);
    if (m) return hi ? "मानसूनी वर्षा शुरू होने के बाद बोई और वर्षा ऋतु के बाद काटी जाने वाली फसल किस मौसम की होती है?" : "ਮਾਨਸੂਨੀ ਵਰਖਾ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਬੀਜੀ ਅਤੇ ਵਰਖਾ ਰੁੱਤ ਤੋਂ ਬਾਅਦ ਕੱਟੀ ਜਾਣ ਵਾਲੀ ਫਸਲ ਕਿਹੜੇ ਮੌਸਮ ਦੀ ਹੁੰਦੀ ਹੈ?";

    m = text.match(/^Which rainfall condition naturally favours (.+?) without heavy irrigation support\?$/);
    if (m) return hi ? `अधिक सिंचाई के बिना ${f(m[1])} की खेती के लिए कौन-सी वर्षा स्थिति स्वाभाविक रूप से अनुकूल है?` : `ਵੱਧ ਸਿੰਚਾਈ ਤੋਂ ਬਿਨਾਂ ${f(m[1])} ਦੀ ਖੇਤੀ ਲਈ ਕਿਹੜੀ ਵਰਖਾ ਸਥਿਤੀ ਕੁਦਰਤੀ ਤੌਰ ਤੇ ਅਨੁਕੂਲ ਹੈ?`;

    m = text.match(/^Which crop should be removed from (.+?) to leave an oilseed-only set\?$/);
    if (m) return hi ? `केवल तिलहन फसलें बचाने के लिए ${f(m[1])} में से किस फसल को हटाना होगा?` : `ਕੇਵਲ ਤਿਲਹਨ ਫਸਲਾਂ ਛੱਡਣ ਲਈ ${f(m[1])} ਵਿੱਚੋਂ ਕਿਹੜੀ ਫਸਲ ਹਟਾਉਣੀ ਹੋਵੇਗੀ?`;

    m = text.match(/^Which irrigation source depends directly on groundwater stored below the surface\?$/);
    if (m) return hi ? "भूमि के नीचे संग्रहित भूजल पर सीधे निर्भर सिंचाई स्रोत कौन-सा है?" : "ਜ਼ਮੀਨ ਹੇਠਾਂ ਇਕੱਠੇ ਭੂਜਲ ਉੱਤੇ ਸਿੱਧਾ ਨਿਰਭਰ ਸਿੰਚਾਈ ਸਰੋਤ ਕਿਹੜਾ ਹੈ?";

    m = text.match(/^Which weather pattern would create the greatest stress for a (.+?) plantation\?$/);
    if (m) return hi ? `${f(m[1])} के बागान के लिए कौन-सी मौसम स्थिति सबसे अधिक प्रतिकूल होगी?` : `${f(m[1])} ਦੇ ਬਾਗ ਲਈ ਕਿਹੜੀ ਮੌਸਮੀ ਸਥਿਤੀ ਸਭ ਤੋਂ ਵੱਧ ਪ੍ਰਤੀਕੂਲ ਹੋਵੇਗੀ?`;

    m = text.match(/^Which crop change is most logical when a field shifts from reliable flooding to limited rain and no irrigation\?$/);
    if (m) return hi ? "यदि खेत में नियमित जलभराव की जगह कम वर्षा हो और सिंचाई न हो, तो कौन-सा फसल परिवर्तन सबसे उचित है?" : "ਜੇ ਖੇਤ ਵਿੱਚ ਨਿਯਮਿਤ ਪਾਣੀ ਭਰਨ ਦੀ ਥਾਂ ਘੱਟ ਵਰਖਾ ਹੋਵੇ ਅਤੇ ਸਿੰਚਾਈ ਨਾ ਹੋਵੇ, ਤਾਂ ਕਿਹੜਾ ਫਸਲ ਬਦਲਾਅ ਸਭ ਤੋਂ ਉਚਿਤ ਹੈ?";

    m = text.match(/^The zaid season falls between which two major crop seasons\?$/i);
    if (m) return hi ? "जायद ऋतु किन दो प्रमुख फसल ऋतुओं के बीच आती है?" : "ਜ਼ਾਇਦ ਰੁੱਤ ਕਿਹੜੀਆਂ ਦੋ ਮੁੱਖ ਫਸਲੀ ਰੁੱਤਾਂ ਦੇ ਵਿਚਕਾਰ ਆਉਂਦੀ ਹੈ?";
  }

  if (packageId === "GEO-VEG-001") {
    let m = text.match(/^Which feature most clearly separates natural vegetation from a cultivated plant community\?$/);
    if (m) return hi ? "प्राकृतिक वनस्पति को मनुष्य द्वारा उगाई गई वनस्पति से सबसे स्पष्ट रूप से कौन-सी विशेषता अलग करती है?" : "ਕੁਦਰਤੀ ਬਨਸਪਤੀ ਨੂੰ ਮਨੁੱਖ ਵੱਲੋਂ ਉਗਾਈ ਬਨਸਪਤੀ ਤੋਂ ਸਭ ਤੋਂ ਸਪਸ਼ਟ ਤੌਰ ਤੇ ਕਿਹੜੀ ਵਿਸ਼ੇਸ਼ਤਾ ਵੱਖ ਕਰਦੀ ਹੈ?";

    m = text.match(/^A warm region receives more than 200 cm of rain and has no long dry season\. Which natural vegetation is most likely\?$/);
    if (m) return hi ? "किसी गर्म क्षेत्र में 200 सेमी से अधिक वर्षा होती है और लंबी शुष्क ऋतु नहीं होती। वहाँ कौन-सी प्राकृतिक वनस्पति सबसे अधिक संभावित है?" : "ਕਿਸੇ ਗਰਮ ਖੇਤਰ ਵਿੱਚ 200 ਸੈਂਟੀਮੀਟਰ ਤੋਂ ਵੱਧ ਵਰਖਾ ਹੁੰਦੀ ਹੈ ਅਤੇ ਲੰਬਾ ਸੁੱਕਾ ਮੌਸਮ ਨਹੀਂ ਹੁੰਦਾ। ਉੱਥੇ ਕਿਹੜੀ ਕੁਦਰਤੀ ਬਨਸਪਤੀ ਸਭ ਤੋਂ ਵੱਧ ਸੰਭਾਵੀ ਹੈ?";

    m = text.match(/^Which adaptation helps deciduous trees survive seasonal water shortage\?$/);
    if (m) return hi ? "मौसमी जल की कमी में पर्णपाती वृक्षों को जीवित रहने में कौन-सा अनुकूलन मदद करता है?" : "ਮੌਸਮੀ ਪਾਣੀ ਦੀ ਘਾਟ ਵਿੱਚ ਪੱਤਝੜੀ ਰੁੱਖਾਂ ਨੂੰ ਜੀਊਣ ਵਿੱਚ ਕਿਹੜਾ ਅਨੁਕੂਲਨ ਮਦਦ ਕਰਦਾ ਹੈ?";

    m = text.match(/^Acacia, babool and thorny shrubs are characteristic of which vegetation type\?$/);
    if (m) return hi ? "कीकर, बबूल और कांटेदार झाड़ियाँ किस प्रकार की वनस्पति की विशेषता हैं?" : "ਕੀਕਰ, ਬਬੂਲ ਅਤੇ ਕਾਂਟੇਦਾਰ ਝਾੜੀਆਂ ਕਿਹੜੀ ਕਿਸਮ ਦੀ ਬਨਸਪਤੀ ਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਹਨ?";

    m = text.match(/^Which Indian forest is the natural home of the Asiatic lion\?$/);
    if (m) return hi ? "एशियाई सिंह का प्राकृतिक आवास भारत का कौन-सा वन है?" : "ਏਸ਼ੀਆਈ ਸ਼ੇਰ ਦਾ ਕੁਦਰਤੀ ਆਵਾਸ ਭਾਰਤ ਦਾ ਕਿਹੜਾ ਜੰਗਲ ਹੈ?";

    m = text.match(/^Which famous predator is strongly linked with the Sundarbans mangrove region\?$/);
    if (m) return hi ? "सुंदरबन के मैंग्रोव क्षेत्र से कौन-सा प्रसिद्ध शिकारी जीव विशेष रूप से जुड़ा है?" : "ਸੁੰਦਰਬਨ ਦੇ ਮੈਂਗਰੋਵ ਖੇਤਰ ਨਾਲ ਕਿਹੜਾ ਮਸ਼ਹੂਰ ਸ਼ਿਕਾਰੀ ਜੀਵ ਖਾਸ ਤੌਰ ਤੇ ਜੁੜਿਆ ਹੈ?";

    m = text.match(/^Which vegetation type is best suited to tidal mud and brackish water\?$/);
    if (m) return hi ? "ज्वारीय कीचड़ और खारे-मीठे पानी के लिए कौन-सी वनस्पति सबसे उपयुक्त है?" : "ਜਵਾਰੀ ਕੀਚੜ ਅਤੇ ਖਾਰੇ-ਮਿੱਠੇ ਪਾਣੀ ਲਈ ਕਿਹੜੀ ਬਨਸਪਤੀ ਸਭ ਤੋਂ ਉਚਿਤ ਹੈ?";

    m = text.match(/^Which root adaptation helps mangrove plants obtain oxygen from waterlogged soil\?$/);
    if (m) return hi ? "जलभराव वाली मिट्टी से ऑक्सीजन लेने में मैंग्रोव पौधों की कौन-सी जड़ अनुकूलन मदद करती है?" : "ਪਾਣੀ ਨਾਲ ਭਰੀ ਮਿੱਟੀ ਵਿੱਚੋਂ ਆਕਸੀਜਨ ਲੈਣ ਲਈ ਮੈਂਗਰੋਵ ਪੌਦਿਆਂ ਦੀ ਕਿਹੜੀ ਜੜ ਅਨੁਕੂਲਤਾ ਮਦਦ ਕਰਦੀ ਹੈ?";
  }

  if (packageId === "GEO-IND-001") {
    let m = text.match(/^Which industry directly depends on large (.+?) deposits\?$/);
    if (m) return hi ? `कौन-सा उद्योग ${f(m[1])} के बड़े भंडारों पर सीधे निर्भर है?` : `ਕਿਹੜਾ ਉਦਯੋਗ ${f(m[1])} ਦੇ ਵੱਡੇ ਭੰਡਾਰਾਂ ਉੱਤੇ ਸਿੱਧਾ ਨਿਰਭਰ ਹੈ?`;

    m = text.match(/^Which ore is the principal raw material for (.+?) production\?$/);
    if (m) return hi ? `${f(m[1])} उत्पादन के लिए प्रमुख कच्चा माल कौन-सा अयस्क है?` : `${f(m[1])} ਦੇ ਉਤਪਾਦਨ ਲਈ ਮੁੱਖ ਕੱਚਾ ਮਾਲ ਕਿਹੜੀ ਕੱਚੀ ਧਾਤ ਹੈ?`;

    m = text.match(/^Which factor most directly explains the location of a (.+?) inside a (.+?)\?$/);
    if (m) return hi ? `${f(m[2])} के भीतर ${f(m[1])} की अवस्थिति को कौन-सा कारक सबसे सीधे समझाता है?` : `${f(m[2])} ਦੇ ਅੰਦਰ ${f(m[1])} ਦੇ ਟਿਕਾਣੇ ਨੂੰ ਕਿਹੜਾ ਕਾਰਕ ਸਭ ਤੋਂ ਸਿੱਧੇ ਤੌਰ ਤੇ ਸਮਝਾਉਂਦਾ ਹੈ?`;

    m = text.match(/^Which coastal steel plant has an important port-location advantage\?$/);
    if (m) return hi ? "कौन-सा तटीय इस्पात संयंत्र बंदरगाह के निकट होने का महत्वपूर्ण लाभ प्राप्त करता है?" : "ਕਿਹੜੇ ਤਟੀ ਇਸਪਾਤ ਪਲਾਂਟ ਨੂੰ ਬੰਦਰਗਾਹ ਦੇ ਨੇੜੇ ਹੋਣ ਦਾ ਮਹੱਤਵਪੂਰਨ ਲਾਭ ਮਿਲਦਾ ਹੈ?";

    m = text.match(/^Which state contains the (.+?) industrial region\?$/);
    if (m) return hi ? `${f(m[1])} औद्योगिक क्षेत्र किस राज्य में स्थित है?` : `${f(m[1])} ਉਦਯੋਗਿਕ ਖੇਤਰ ਕਿਹੜੇ ਰਾਜ ਵਿੱਚ ਸਥਿਤ ਹੈ?`;

    m = text.match(/^Which factors helped (.+?) become a major industrial region\?$/);
    if (m) return hi ? `${f(m[1])} को प्रमुख औद्योगिक क्षेत्र बनने में किन कारकों ने सहायता की?` : `${f(m[1])} ਨੂੰ ਮੁੱਖ ਉਦਯੋਗਿਕ ਖੇਤਰ ਬਣਨ ਵਿੱਚ ਕਿਹੜੇ ਕਾਰਕਾਂ ਨੇ ਮਦਦ ਕੀਤੀ?`;

    m = text.match(/^A plant receives crude oil, separates and converts it into fuels and petrochemical feedstocks\. Which industry is this\?$/);
    if (m) return hi ? "एक संयंत्र कच्चे तेल को अलग-अलग ईंधनों और पेट्रो-रासायनिक कच्चे माल में बदलता है। यह कौन-सा उद्योग है?" : "ਇੱਕ ਪਲਾਂਟ ਕੱਚੇ ਤੇਲ ਨੂੰ ਵੱਖ-ਵੱਖ ਇੰਧਨਾਂ ਅਤੇ ਪੈਟਰੋ-ਰਸਾਇਣਕ ਕੱਚੇ ਮਾਲ ਵਿੱਚ ਬਦਲਦਾ ਹੈ। ਇਹ ਕਿਹੜਾ ਉਦਯੋਗ ਹੈ?";

    m = text.match(/^Which measure most directly reduces particulate emissions from industrial exhaust\?$/);
    if (m) return hi ? "औद्योगिक धुएँ से निकलने वाले सूक्ष्म कणों को कम करने का सबसे सीधा उपाय कौन-सा है?" : "ਉਦਯੋਗਿਕ ਧੂੰਏਂ ਵਿੱਚੋਂ ਨਿਕਲਣ ਵਾਲੇ ਬਰੀਕ ਕਣਾਂ ਨੂੰ ਘਟਾਉਣ ਦਾ ਸਭ ਤੋਂ ਸਿੱਧਾ ਉਪਾਅ ਕਿਹੜਾ ਹੈ?";
  }

  if (packageId === "GEO-TRN-001") {
    let m = text.match(/^Which roads connect major cities, state capitals, ports and important economic centres across states\?$/);
    if (m) return hi ? "राज्यों के बीच प्रमुख शहरों, राज्य राजधानियों, बंदरगाहों और महत्वपूर्ण आर्थिक केंद्रों को कौन-सी सड़कें जोड़ती हैं?" : "ਰਾਜਾਂ ਵਿਚਕਾਰ ਮੁੱਖ ਸ਼ਹਿਰਾਂ, ਰਾਜਧਾਨੀਆਂ, ਬੰਦਰਗਾਹਾਂ ਅਤੇ ਮਹੱਤਵਪੂਰਨ ਆਰਥਿਕ ਕੇਂਦਰਾਂ ਨੂੰ ਕਿਹੜੀਆਂ ਸੜਕਾਂ ਜੋੜਦੀਆਂ ਹਨ?";

    m = text.match(/^Which roads primarily connect important places within a state\?$/);
    if (m) return hi ? "किसी राज्य के भीतर महत्वपूर्ण स्थानों को मुख्य रूप से कौन-सी सड़कें जोड़ती हैं?" : "ਕਿਸੇ ਰਾਜ ਦੇ ਅੰਦਰ ਮਹੱਤਵਪੂਰਨ ਥਾਵਾਂ ਨੂੰ ਮੁੱਖ ਤੌਰ ਤੇ ਕਿਹੜੀਆਂ ਸੜਕਾਂ ਜੋੜਦੀਆਂ ਹਨ?";

    m = text.match(/^Which transport mode is especially suitable for moving large volumes of passengers and bulk freight over long distances on land\?$/);
    if (m) return hi ? "भूमि पर लंबी दूरी तक बड़ी संख्या में यात्रियों और भारी माल के परिवहन के लिए कौन-सा साधन विशेष रूप से उपयुक्त है?" : "ਜ਼ਮੀਨ ਉੱਤੇ ਲੰਬੀ ਦੂਰੀ ਤੱਕ ਵੱਡੀ ਗਿਣਤੀ ਵਿੱਚ ਯਾਤਰੀਆਂ ਅਤੇ ਭਾਰੀ ਮਾਲ ਦੀ ਆਵਾਜਾਈ ਲਈ ਕਿਹੜਾ ਸਾਧਨ ਖਾਸ ਤੌਰ ਤੇ ਉਚਿਤ ਹੈ?";

    m = text.match(/^Why are railways important to India's economy\?$/);
    if (m) return hi ? "भारत की अर्थव्यवस्था के लिए रेलमार्ग क्यों महत्वपूर्ण हैं?" : "ਭਾਰਤ ਦੀ ਅਰਥਵਿਵਸਥਾ ਲਈ ਰੇਲਵੇ ਕਿਉਂ ਮਹੱਤਵਪੂਰਨ ਹੈ?";

    m = text.match(/^What is the main transport function of a seaport\?$/);
    if (m) return hi ? "समुद्री बंदरगाह का मुख्य परिवहन कार्य क्या है?" : "ਸਮੁੰਦਰੀ ਬੰਦਰਗਾਹ ਦਾ ਮੁੱਖ ਆਵਾਜਾਈ ਕੰਮ ਕੀ ਹੈ?";

    m = text.match(/^What is a port hinterland\?$/);
    if (m) return hi ? "बंदरगाह का पृष्ठप्रदेश क्या होता है?" : "ਬੰਦਰਗਾਹ ਦਾ ਪਛੋਕੜੀ ਖੇਤਰ ਕੀ ਹੁੰਦਾ ਹੈ?";

    m = text.match(/^What is the greatest transport advantage of air travel over long distances\?$/);
    if (m) return hi ? "लंबी दूरी की यात्रा में हवाई परिवहन का सबसे बड़ा लाभ क्या है?" : "ਲੰਬੀ ਦੂਰੀ ਦੀ ਯਾਤਰਾ ਵਿੱਚ ਹਵਾਈ ਆਵਾਜਾਈ ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਲਾਭ ਕੀ ਹੈ?";

    m = text.match(/^Which type of cargo is especially suited to air transport\?$/);
    if (m) return hi ? "किस प्रकार का माल हवाई परिवहन के लिए विशेष रूप से उपयुक्त है?" : "ਕਿਸ ਕਿਸਮ ਦਾ ਮਾਲ ਹਵਾਈ ਆਵਾਜਾਈ ਲਈ ਖਾਸ ਤੌਰ ਤੇ ਉਚਿਤ ਹੈ?";

    m = text.match(/^What is the main purpose of a communication network\?$/);
    if (m) return hi ? "संचार नेटवर्क का मुख्य उद्देश्य क्या है?" : "ਸੰਚਾਰ ਜਾਲ ਦਾ ਮੁੱਖ ਮਕਸਦ ਕੀ ਹੈ?";

    m = text.match(/^Which system is used primarily to transmit information rather than transport physical cargo\?$/);
    if (m) return hi ? "भौतिक माल ढोने के बजाय मुख्य रूप से सूचना भेजने के लिए किस प्रणाली का उपयोग होता है?" : "ਭੌਤਿਕ ਮਾਲ ਲਿਜਾਣ ਦੀ ਬਜਾਇ ਮੁੱਖ ਤੌਰ ਤੇ ਜਾਣਕਾਰੀ ਭੇਜਣ ਲਈ ਕਿਹੜੀ ਪ੍ਰਣਾਲੀ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?";
  }

  if (packageId === "GEO-POP-001") {
    let m = text.match(/^Which pair is correctly matched in population geography\?$/);
    if (m) return hi ? "जनसंख्या भूगोल में कौन-सा युग्म सही सुमेलित है?" : "ਆਬਾਦੀ ਭੂਗੋਲ ਵਿੱਚ ਕਿਹੜੀ ਜੋੜੀ ਸਹੀ ਮਿਲਾਈ ਗਈ ਹੈ?";

    m = text.match(/^Which pattern is most typical of India's population distribution\?$/);
    if (m) return hi ? "भारत में जनसंख्या वितरण का सबसे सामान्य स्वरूप कौन-सा है?" : "ਭਾਰਤ ਵਿੱਚ ਆਬਾਦੀ ਦੀ ਵੰਡ ਦਾ ਸਭ ਤੋਂ ਆਮ ਰੂਪ ਕਿਹੜਾ ਹੈ?";

    m = text.match(/^A map shows very high population concentration in some plains and cities but low concentration in mountains and deserts\. What does it show\?$/);
    if (m) return hi ? "मानचित्र में कुछ मैदानों और शहरों में बहुत अधिक, जबकि पर्वतों और मरुस्थलों में कम जनसंख्या दिखाई गई है। यह क्या दर्शाता है?" : "ਨਕਸ਼ੇ ਵਿੱਚ ਕੁਝ ਮੈਦਾਨਾਂ ਅਤੇ ਸ਼ਹਿਰਾਂ ਵਿੱਚ ਬਹੁਤ ਵੱਧ, ਪਰ ਪਹਾੜਾਂ ਅਤੇ ਮਾਰੂਥਲਾਂ ਵਿੱਚ ਘੱਟ ਆਬਾਦੀ ਦਿਖਾਈ ਗਈ ਹੈ। ਇਹ ਕੀ ਦਰਸਾਉਂਦਾ ਹੈ?";

    m = text.match(/^Which term describes the place from which a migrant moves\?$/);
    if (m) return hi ? "जिस स्थान से कोई प्रवासी जाता है, उसे क्या कहा जाता है?" : "ਜਿਸ ਥਾਂ ਤੋਂ ਕੋਈ ਪਰਵਾਸੀ ਜਾਂਦਾ ਹੈ, ਉਸ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?";

    m = text.match(/^Which term describes the place to which a migrant moves\?$/);
    if (m) return hi ? "जिस स्थान पर कोई प्रवासी पहुँचता है, उसे क्या कहा जाता है?" : "ਜਿਸ ਥਾਂ ਉੱਤੇ ਕੋਈ ਪਰਵਾਸੀ ਪਹੁੰਚਦਾ ਹੈ, ਉਸ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?";

    m = text.match(/^What distinguishes a settlement from an isolated agricultural field\?$/);
    if (m) return hi ? "किस विशेषता से बस्ती को एक अलग-थलग कृषि खेत से पहचाना जा सकता है?" : "ਕਿਹੜੀ ਵਿਸ਼ੇਸ਼ਤਾ ਬਸਤੀ ਨੂੰ ਇਕੱਲੇ ਖੇਤੀਬਾੜੀ ਖੇਤ ਤੋਂ ਵੱਖ ਕਰਦੀ ਹੈ?";

    m = text.match(/^Which change would directly raise work participation rate\?$/);
    if (m) return hi ? "कौन-सा परिवर्तन कार्य भागीदारी दर को सीधे बढ़ाएगा?" : "ਕਿਹੜਾ ਬਦਲਾਅ ਕੰਮ ਵਿੱਚ ਭਾਗੀਦਾਰੀ ਦੀ ਦਰ ਨੂੰ ਸਿੱਧੇ ਤੌਰ ਤੇ ਵਧਾਏਗਾ?";

    m = text.match(/^A district has many employed adults relative to its total population\. Which indicator is likely to be high\?$/);
    if (m) return hi ? "किसी जिले की कुल जनसंख्या की तुलना में रोजगार प्राप्त वयस्कों की संख्या अधिक है। कौन-सा सूचक अधिक होने की संभावना है?" : "ਕਿਸੇ ਜ਼ਿਲ੍ਹੇ ਦੀ ਕੁੱਲ ਆਬਾਦੀ ਦੇ ਮੁਕਾਬਲੇ ਰੁਜ਼ਗਾਰਸ਼ੁਦਾ ਬਾਲਗਾਂ ਦੀ ਗਿਣਤੀ ਵੱਧ ਹੈ। ਕਿਹੜਾ ਸੂਚਕ ਵੱਧ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ?";
  }

  if (packageId === "GEO-WAT-001") {
    let m = text.match(/^Which factor can make water availability seasonal\?$/);
    if (m) return hi ? "जल उपलब्धता को मौसमी बनाने वाला प्रमुख कारक कौन-सा है?" : "ਪਾਣੀ ਦੀ ਉਪਲਬਧਤਾ ਨੂੰ ਮੌਸਮੀ ਬਣਾਉਣ ਵਾਲਾ ਮੁੱਖ ਕਾਰਕ ਕਿਹੜਾ ਹੈ?";

    m = text.match(/^A district receives little rainfall and has no perennial river\. What problem is most likely\?$/);
    if (m) return hi ? "किसी जिले में कम वर्षा होती है और कोई बारहमासी नदी नहीं है। वहाँ सबसे संभावित समस्या क्या होगी?" : "ਕਿਸੇ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਘੱਟ ਵਰਖਾ ਹੁੰਦੀ ਹੈ ਅਤੇ ਕੋਈ ਸਦਾ ਵਗਣ ਵਾਲੀ ਨਦੀ ਨਹੀਂ ਹੈ। ਉੱਥੇ ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਸਮੱਸਿਆ ਕੀ ਹੋਵੇਗੀ?";

    m = text.match(/^Which states are strongly linked with the Bhakra-Nangal irrigation-power system\?$/);
    if (m) return hi ? "भाखड़ा-नांगल सिंचाई और विद्युत प्रणाली से कौन-से राज्य प्रमुख रूप से जुड़े हैं?" : "ਭਾਖੜਾ-ਨੰਗਲ ਸਿੰਚਾਈ ਅਤੇ ਬਿਜਲੀ ਪ੍ਰਣਾਲੀ ਨਾਲ ਕਿਹੜੇ ਰਾਜ ਮੁੱਖ ਤੌਰ ਤੇ ਜੁੜੇ ਹਨ?";

    m = text.match(/^Which function is important at Bhakra-Nangal\?$/);
    if (m) return hi ? "भाखड़ा-नांगल परियोजना का कौन-सा कार्य महत्वपूर्ण है?" : "ਭਾਖੜਾ-ਨੰਗਲ ਪ੍ਰਾਜੈਕਟ ਦਾ ਕਿਹੜਾ ਕੰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ?";

    m = text.match(/^Which set correctly matches irrigation methods\?$/);
    if (m) return hi ? "सिंचाई विधियों का कौन-सा समूह सही सुमेलित है?" : "ਸਿੰਚਾਈ ਦੇ ਢੰਗਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";

    m = text.match(/^Which set correctly matches conservation measures\?$/);
    if (m) return hi ? "जल-संरक्षण उपायों का कौन-सा समूह सही सुमेलित है?" : "ਪਾਣੀ ਸੰਭਾਲ ਦੇ ਉਪਾਵਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  }

  if (packageId === "GEO-LND-001") {
    let m = text.match(/^A region faces rising demand for farms, housing and roads on the same finite area\. What issue does this illustrate\?$/);
    if (m) return hi ? "एक सीमित भू-क्षेत्र पर खेती, आवास और सड़कों की बढ़ती मांग किस समस्या को दर्शाती है?" : "ਇੱਕ ਸੀਮਿਤ ਜ਼ਮੀਨੀ ਖੇਤਰ ਉੱਤੇ ਖੇਤੀ, ਰਿਹਾਇਸ਼ ਅਤੇ ਸੜਕਾਂ ਦੀ ਵੱਧਦੀ ਮੰਗ ਕਿਹੜੀ ਸਮੱਸਿਆ ਦਰਸਾਉਂਦੀ ਹੈ?";

    m = text.match(/^Which pair correctly identifies a land resource function\?$/);
    if (m) return hi ? "भूमि संसाधन के उपयोग का कौन-सा युग्म सही है?" : "ਜ਼ਮੀਨੀ ਸਰੋਤ ਦੀ ਵਰਤੋਂ ਵਾਲੀ ਕਿਹੜੀ ਜੋੜੀ ਸਹੀ ਹੈ?";

    m = text.match(/^Which set correctly matches degradation and cause\?$/);
    if (m) return hi ? "भूमि क्षरण और उसके कारणों का कौन-सा समूह सही सुमेलित है?" : "ਜ਼ਮੀਨ ਦੇ ਖ਼ਰਾਬ ਹੋਣ ਅਤੇ ਉਸਦੇ ਕਾਰਨਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";

    m = text.match(/^Which set correctly matches land concepts\?$/);
    if (m) return hi ? "भूमि संबंधी अवधारणाओं का कौन-सा समूह सही सुमेलित है?" : "ਜ਼ਮੀਨ ਨਾਲ ਸੰਬੰਧਿਤ ਧਾਰਣਾਵਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  }

  if (packageId === "GEO-LOC-001") {
    let m = text.match(/^India lies in which two hemispheres\?$/);
    if (m) return hi ? "भारत किन दो गोलार्धों में स्थित है?" : "ਭਾਰਤ ਕਿਹੜੇ ਦੋ ਗੋਲਾਰਧਾਂ ਵਿੱਚ ਸਥਿਤ ਹੈ?";

    m = text.match(/^Which value is a longitude used for national time rather than a latitude\?$/);
    if (m) return hi ? "निम्न में से कौन-सा मान अक्षांश नहीं बल्कि राष्ट्रीय समय के लिए प्रयुक्त देशांतर है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਮਾਨ ਅਕਸ਼ਾਂਸ਼ ਨਹੀਂ, ਸਗੋਂ ਰਾਸ਼ਟਰੀ ਸਮੇਂ ਲਈ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਦੇਸ਼ਾਂਤਰ ਹੈ?";

    m = text.match(/^Which group contains only India's land neighbours\?$/);
    if (m) return hi ? "कौन-सा समूह केवल भारत के स्थलीय पड़ोसी देशों का है?" : "ਕਿਹੜੇ ਸਮੂਹ ਵਿੱਚ ਕੇਵਲ ਭਾਰਤ ਦੇ ਜ਼ਮੀਨੀ ਪੜੋਸੀ ਦੇਸ਼ ਹਨ?";

    m = text.match(/^Which pair contains one land neighbour and one maritime neighbour of India\?$/);
    if (m) return hi ? "कौन-से युग्म में भारत का एक स्थलीय और एक समुद्री पड़ोसी देश है?" : "ਕਿਹੜੀ ਜੋੜੀ ਵਿੱਚ ਭਾਰਤ ਦਾ ਇੱਕ ਜ਼ਮੀਨੀ ਅਤੇ ਇੱਕ ਸਮੁੰਦਰੀ ਪੜੋਸੀ ਦੇਸ਼ ਹੈ?";

    m = text.match(/^Which state is crossed by the Tropic of Cancer\?$/);
    if (m) return hi ? "कर्क रेखा किस राज्य से होकर गुजरती है?" : "ਕਰਕ ਰੇਖਾ ਕਿਹੜੇ ਰਾਜ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ?";

    m = text.match(/^Which north-to-south order is correct for (.+?)\?$/);
    if (m) return hi ? `${f(m[1])} का उत्तर से दक्षिण सही क्रम कौन-सा है?` : `${f(m[1])} ਦਾ ਉੱਤਰ ਤੋਂ ਦੱਖਣ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?`;
  }

  if (packageId === "GEO-PLN-001") {
    let m = text.match(/^What is target-area planning\?$/);
    if (m) return hi ? "लक्षित-क्षेत्र नियोजन क्या है?" : "ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਕੀ ਹੈ?";

    m = text.match(/^Which is an example of target-area planning\?$/);
    if (m) return hi ? "लक्षित-क्षेत्र नियोजन का उदाहरण कौन-सा है?" : "ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਦੀ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?";

    m = text.match(/^Why are hill-area programmes examples of target-area planning\?$/);
    if (m) return hi ? "पर्वतीय क्षेत्र कार्यक्रम लक्षित-क्षेत्र नियोजन के उदाहरण क्यों हैं?" : "ਪਹਾੜੀ ਖੇਤਰਾਂ ਦੇ ਪ੍ਰੋਗਰਾਮ ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਦੀਆਂ ਉਦਾਹਰਨਾਂ ਕਿਉਂ ਹਨ?";

    m = text.match(/^Which set correctly matches regional cases\?$/);
    if (m) return hi ? "क्षेत्रीय नियोजन के उदाहरणों का कौन-सा समूह सही सुमेलित है?" : "ਖੇਤਰੀ ਯੋਜਨਾਬੰਦੀ ਦੇ ਉਦਾਹਰਣਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";

    m = text.match(/^Which set correctly matches planning issues\?$/);
    if (m) return hi ? "नियोजन समस्याओं का कौन-सा समूह सही सुमेलित है?" : "ਯੋਜਨਾਬੰਦੀ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  }

  if (packageId === "GEO-HAZ-001") {
    let m = text.match(/^Why is the Himalayan region earthquake-prone\?$/);
    if (m) return hi ? "हिमालयी क्षेत्र में भूकंप का खतरा अधिक क्यों है?" : "ਹਿਮਾਲਈ ਖੇਤਰ ਵਿੱਚ ਭੂਚਾਲ ਦਾ ਖ਼ਤਰਾ ਵੱਧ ਕਿਉਂ ਹੈ?";

    m = text.match(/^Which other Indian region has significant seismic risk\?$/);
    if (m) return hi ? "भारत का कौन-सा अन्य क्षेत्र महत्वपूर्ण भूकंपीय जोखिम वाला है?" : "ਭਾਰਤ ਦਾ ਕਿਹੜਾ ਹੋਰ ਖੇਤਰ ਮਹੱਤਵਪੂਰਨ ਭੂਚਾਲੀ ਖ਼ਤਰੇ ਵਾਲਾ ਹੈ?";

    m = text.match(/^Which Indian region is highly vulnerable to landslides\?$/);
    if (m) return hi ? "भारत का कौन-सा क्षेत्र भूस्खलन के प्रति अत्यधिक संवेदनशील है?" : "ਭਾਰਤ ਦਾ ਕਿਹੜਾ ਖੇਤਰ ਭੂਸਖਲਨ ਲਈ ਬਹੁਤ ਜ਼ਿਆਦਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ?";

    m = text.match(/^A steep Himalayan slope fails after days of heavy monsoon rain\. Which hazard occurred\?$/);
    if (m) return hi ? "कई दिनों की भारी मानसूनी वर्षा के बाद हिमालयी ढाल खिसक गई। यह कौन-सी आपदा है?" : "ਕਈ ਦਿਨਾਂ ਦੀ ਭਾਰੀ ਮਾਨਸੂਨੀ ਵਰਖਾ ਤੋਂ ਬਾਅਦ ਹਿਮਾਲਈ ਢਲਾਣ ਖਿਸਕ ਗਈ। ਇਹ ਕਿਹੜੀ ਆਫ਼ਤ ਹੈ?";

    m = text.match(/^Which set correctly matches hazard and vulnerable region\?$/);
    if (m) return hi ? "आपदा और संवेदनशील क्षेत्र का कौन-सा समूह सही सुमेलित है?" : "ਆਫ਼ਤ ਅਤੇ ਸੰਵੇਦਨਸ਼ੀਲ ਖੇਤਰ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";

    m = text.match(/^Which set correctly matches mitigation measures\?$/);
    if (m) return hi ? "आपदा-न्यूनीकरण उपायों का कौन-सा समूह सही सुमेलित है?" : "ਆਫ਼ਤ ਘਟਾਉਣ ਦੇ ਉਪਾਵਾਂ ਦਾ ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  }

  if (packageId === "GEO-MIN-001") {
    let m = text.match(/^An aluminium smelter depends on which mineral raw material before refining and electrolysis\?$/);
    if (m) return hi ? "एल्यूमिनियम गलाने से पहले शोधन और विद्युत अपघटन के लिए कौन-सा खनिज कच्चा माल आवश्यक है?" : "ਐਲੂਮੀਨੀਅਮ ਗਲਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁੱਧੀਕਰਨ ਅਤੇ ਬਿਜਲੀ-ਅਪਘਟਨ ਲਈ ਕਿਹੜਾ ਖਣਿਜ ਕੱਚਾ ਮਾਲ ਲੋੜੀਂਦਾ ਹੈ?";

    m = text.match(/^Which coal type is widely used in industry and includes many coking-coal varieties\?$/);
    if (m) return hi ? "उद्योगों में व्यापक रूप से प्रयुक्त और अनेक कोकिंग-कोयला किस्मों वाला कोयला कौन-सा है?" : "ਉਦਯੋਗਾਂ ਵਿੱਚ ਵੱਡੇ ਪੱਧਰ ਤੇ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਅਤੇ ਕਈ ਕੋਕਿੰਗ ਕੋਇਲੇ ਦੀਆਂ ਕਿਸਮਾਂ ਵਾਲਾ ਕੋਇਲਾ ਕਿਹੜਾ ਹੈ?";

    m = text.match(/^Which coal is commonly called brown coal because of its lower rank and higher moisture\?$/);
    if (m) return hi ? "कम श्रेणी और अधिक नमी के कारण किस कोयले को सामान्यतः भूरा कोयला कहा जाता है?" : "ਘੱਟ ਦਰਜੇ ਅਤੇ ਵੱਧ ਨਮੀ ਕਾਰਨ ਕਿਹੜੇ ਕੋਇਲੇ ਨੂੰ ਆਮ ਤੌਰ ਤੇ ਭੂਰਾ ਕੋਇਲਾ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?";

    m = text.match(/^Arrange these from lower to higher coal rank: (.+?)\. Which sequence is correct\?$/);
    if (m) return hi ? `कोयले की निम्न से उच्च श्रेणी का सही क्रम कौन-सा है: ${f(m[1])}?` : `ਕੋਇਲੇ ਦੇ ਘੱਟ ਤੋਂ ਉੱਚ ਦਰਜੇ ਦਾ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ: ${f(m[1])}?`;

    m = text.match(/^A coal sample is hard, lustrous and has very high carbon content\. Which type is it\?$/);
    if (m) return hi ? "कोयले का एक नमूना कठोर, चमकीला और बहुत अधिक कार्बन वाला है। यह किस प्रकार का कोयला है?" : "ਕੋਇਲੇ ਦਾ ਇੱਕ ਨਮੂਨਾ ਸਖ਼ਤ, ਚਮਕੀਲਾ ਅਤੇ ਬਹੁਤ ਵੱਧ ਕਾਰਬਨ ਵਾਲਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਕੋਇਲਾ ਹੈ?";

    m = text.match(/^Why are porous reservoir rocks important in petroleum occurrence\?$/);
    if (m) return hi ? "पेट्रोलियम के संचय में छिद्रयुक्त भंडार शैलें क्यों महत्वपूर्ण हैं?" : "ਪੈਟਰੋਲਿਅਮ ਦੇ ਇਕੱਠ ਵਿੱਚ ਛਿਦਰਦਾਰ ਭੰਡਾਰ ਚੱਟਾਨਾਂ ਕਿਉਂ ਮਹੱਤਵਪੂਰਨ ਹਨ?";

    m = text.match(/^An oilfield is discovered in porous sandstone beneath an impermeable shale layer\. What is the shale doing\?$/);
    if (m) return hi ? "अभेद्य शेल परत के नीचे छिद्रयुक्त बलुआ पत्थर में तेल मिला है। शेल परत क्या कार्य कर रही है?" : "ਅਭੇਦ ਸ਼ੇਲ ਪਰਤ ਹੇਠਾਂ ਛਿਦਰਦਾਰ ਰੇਤਲੀ ਚੱਟਾਨ ਵਿੱਚ ਤੇਲ ਮਿਲਿਆ ਹੈ। ਸ਼ੇਲ ਪਰਤ ਕੀ ਕੰਮ ਕਰ ਰਹੀ ਹੈ?";

    m = text.match(/^Why are many large thermal stations located near coalfields\?$/);
    if (m) return hi ? "कई बड़े ताप विद्युत केंद्र कोयला क्षेत्रों के निकट क्यों स्थापित किए जाते हैं?" : "ਕਈ ਵੱਡੇ ਤਾਪ ਬਿਜਲੀ ਘਰ ਕੋਇਲਾ ਖੇਤਰਾਂ ਦੇ ਨੇੜੇ ਕਿਉਂ ਲਗਾਏ ਜਾਂਦੇ ਹਨ?";

    m = text.match(/^Which process releases energy in a conventional nuclear power reactor\?$/);
    if (m) return hi ? "परंपरागत परमाणु विद्युत रिएक्टर में ऊर्जा किस प्रक्रिया से निकलती है?" : "ਰਵਾਇਤੀ ਪਰਮਾਣੂ ਬਿਜਲੀ ਰਿਐਕਟਰ ਵਿੱਚ ਊਰਜਾ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਨਿਕਲਦੀ ਹੈ?";

    m = text.match(/^Which part of India is especially favourable for large solar projects because of high sunshine and arid conditions\?$/);
    if (m) return hi ? "अधिक धूप और शुष्क परिस्थितियों के कारण भारत का कौन-सा भाग बड़े सौर ऊर्जा प्रकल्पों के लिए विशेष रूप से अनुकूल है?" : "ਵੱਧ ਧੁੱਪ ਅਤੇ ਸੁੱਕੀਆਂ ਹਾਲਤਾਂ ਕਾਰਨ ਭਾਰਤ ਦਾ ਕਿਹੜਾ ਭਾਗ ਵੱਡੇ ਸੂਰਜੀ ਊਰਜਾ ਪ੍ਰਾਜੈਕਟਾਂ ਲਈ ਖਾਸ ਤੌਰ ਤੇ ਅਨੁਕੂਲ ਹੈ?";

    m = text.match(/^Which combination is correctly matched with (.+?)\?$/);
    if (m) return hi ? `${f(m[1])} के साथ कौन-सा संसाधन समूह सही सुमेलित है?` : `${f(m[1])} ਨਾਲ ਕਿਹੜਾ ਸਰੋਤ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?`;

    m = text.match(/^Which pair is incorrectly matched in Eastern mineral belt integration\?$/);
    if (m) return hi ? "पूर्वी खनिज पट्टी से संबंधित कौन-सा युग्म गलत सुमेलित है?" : "ਪੂਰਬੀ ਖਣਿਜ ਪੱਟੀ ਨਾਲ ਸੰਬੰਧਿਤ ਕਿਹੜੀ ਜੋੜੀ ਗਲਤ ਮਿਲਾਈ ਗਈ ਹੈ?";

    m = text.match(/^Which set correctly matches (.+?) with their minerals\?$/);
    if (m) return hi ? `${f(m[1])} को उनके खनिजों से सही मिलाने वाला समूह कौन-सा है?` : `${f(m[1])} ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਖਣਿਜਾਂ ਨਾਲ ਸਹੀ ਮਿਲਾਉਣ ਵਾਲਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`;

    m = text.match(/^Which set correctly matches (.+?) with their energy resources\?$/);
    if (m) return hi ? `${f(m[1])} को उनके ऊर्जा संसाधनों से सही मिलाने वाला समूह कौन-सा है?` : `${f(m[1])} ਨੂੰ ਉਨ੍ਹਾਂ ਦੇ ਊਰਜਾ ਸਰੋਤਾਂ ਨਾਲ ਸਹੀ ਮਿਲਾਉਣ ਵਾਲਾ ਸਮੂਹ ਕਿਹੜਾ ਹੈ?`;
  }

  if (packageId === "GEO-PHY-001") {
    let m = text.match(/^Which range extends from (.+?) towards (.+?) in a (.+?) direction\?$/);
    if (m) return hi ? `कौन-सी पर्वत श्रेणी ${f(m[1])} से ${f(m[2])} की ओर ${f(m[3])} दिशा में फैली है?` : `ਕਿਹੜੀ ਪਹਾੜੀ ਲੜੀ ${f(m[1])} ਤੋਂ ${f(m[2])} ਵੱਲ ${f(m[3])} ਦਿਸ਼ਾ ਵਿੱਚ ਫੈਲੀ ਹੈ?`;

    m = text.match(/^Which range is known for (.+?)\?$/);
    if (m) return hi ? `कौन-सी पर्वत श्रेणी ${f(m[1])} के लिए जानी जाती है?` : `ਕਿਹੜੀ ਪਹਾੜੀ ਲੜੀ ${f(m[1])} ਲਈ ਜਾਣੀ ਜਾਂਦੀ ਹੈ?`;

    m = text.match(/^(.+?) is the highest peak of which range\?$/);
    if (m) return hi ? `${f(m[1])} किस पर्वत श्रेणी की सबसे ऊँची चोटी है?` : `${f(m[1])} ਕਿਹੜੀ ਪਹਾੜੀ ਲੜੀ ਦੀ ਸਭ ਤੋਂ ਉੱਚੀ ਚੋਟੀ ਹੈ?`;

    m = text.match(/^(.+?) is located in which state\?$/);
    if (m) return hi ? `${f(m[1])} किस राज्य में स्थित है?` : `${f(m[1])} ਕਿਹੜੇ ਰਾਜ ਵਿੱਚ ਸਥਿਤ ਹੈ?`;

    m = text.match(/^Which peak is associated with the (.+?) area\?$/);
    if (m) return hi ? `${f(m[1])} क्षेत्र से कौन-सी चोटी जुड़ी है?` : `${f(m[1])} ਖੇਤਰ ਨਾਲ ਕਿਹੜੀ ਚੋਟੀ ਜੁੜੀ ਹੈ?`;

    m = text.match(/^Which region is (.+?)\?$/);
    if (m) return hi ? `कौन-सा क्षेत्र ${f(m[1])}?` : `ਕਿਹੜਾ ਖੇਤਰ ${f(m[1])}?`;

    m = text.match(/^Which coastal plain lies along the (.+?)\?$/);
    if (m) return hi ? `${f(m[1])} के किनारे कौन-सा तटीय मैदान स्थित है?` : `${f(m[1])} ਦੇ ਨਾਲ ਕਿਹੜਾ ਤਟੀ ਮੈਦਾਨ ਸਥਿਤ ਹੈ?`;

    m = text.match(/^Which island group lies in the (.+?) near the (.+?)\?$/);
    if (m) return hi ? `${f(m[2])} के निकट ${f(m[1])} में कौन-सा द्वीप समूह स्थित है?` : `${f(m[2])} ਦੇ ਨੇੜੇ ${f(m[1])} ਵਿੱਚ ਕਿਹੜਾ ਟਾਪੂ ਸਮੂਹ ਸਥਿਤ ਹੈ?`;

    m = text.match(/^Which statement correctly compares the (.+?) and (.+?)\?$/);
    if (m) return hi ? `${f(m[1])} और ${f(m[2])} की सही तुलना कौन-सा कथन करता है?` : `${f(m[1])} ਅਤੇ ${f(m[2])} ਦੀ ਸਹੀ ਤੁਲਨਾ ਕਿਹੜਾ ਕਥਨ ਕਰਦਾ ਹੈ?`;
  }

  return null;
}

const DEVANAGARI_SCRIPT = /[\u0904-\u0963\u0966-\u097F]/;
const GURMUKHI_SCRIPT = /[\u0A01-\u0A03\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A3C-\u0A4C\u0A59-\u0A5E\u0A66-\u0A75]/;

const COMMON_ENGLISH = /\b(?:which|what|why|where|when|how|the|and|or|is|are|was|were|does|do|did|can|could|would|should|has|have|had|with|from|into|for|of|to|in|on|at|by|as|than|that|this|these|those|most|main|major|only|correct|statement|following)\b/gi;

function residueCount(text: string) {
  return (text.match(COMMON_ENGLISH) ?? []).length;
}

function needsGenericExplanationFallback(source: string, language: "hi"|"pa") {
  return residueCount(localizeText(source, language)) > 3;
}

function isGenericExplanationFallback(text:string, language:"hi"|"pa") {
  return language === "hi"
    ? text.includes("यह भारतीय भूगोल के संबंधित तथ्य को सही रूप से बताता है।")
    : text.includes("ਇਹ ਭਾਰਤੀ ਭੂਗੋਲ ਦੇ ਸੰਬੰਧਿਤ ਤੱਥ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਦਰਸਾਉਂਦਾ ਹੈ।");
}

function cleanExplanation(source: string, answer: string, language: "hi"|"pa") {
  const translated = localizeText(source, language);
  if (!needsGenericExplanationFallback(source, language)) return translated;
  return language === "hi"
    ? `सही उत्तर ${answer} है। यह भारतीय भूगोल के संबंधित तथ्य को सही रूप से बताता है।`
    : `ਸਹੀ ਉੱਤਰ ${answer} ਹੈ। ਇਹ ਭਾਰਤੀ ਭੂਗੋਲ ਦੇ ਸੰਬੰਧਿਤ ਤੱਥ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਦਰਸਾਉਂਦਾ ਹੈ।`;
}


function polishGeoSoiBulkTextV1(text:string, language:"hi"|"pa") {
  const hi:[string,string][] = [
    ["red and yellow soil","लाल और पीली मिट्टी"],["red soil","लाल मिट्टी"],["yellow soil","पीली मिट्टी"],
    ["laterite soil","लैटेराइट मिट्टी"],["arid soil","शुष्क मिट्टी"],["forest and mountain soil","वन और पर्वतीय मिट्टी"],
    ["forest soil","वन मिट्टी"],["mountain soil","पर्वतीय मिट्टी"],["alluvial soil","जलोढ़ मिट्टी"],["black soil","काली मिट्टी"],
    ["crystalline igneous rocks","स्फटिकीय आग्नेय चट्टानें"],["crystalline igneous rock","स्फटिकीय आग्नेय चट्टान"],
    ["igneous rocks","आग्नेय चट्टानें"],["parent rock","मूल चट्टान"],["parent material","मूल पदार्थ"],
    ["low rainfall","कम वर्षा"],["heavy rainfall","भारी वर्षा"],["high temperature","उच्च तापमान"],
    ["iron compounds","लौह यौगिक"],["iron diffusion","लौह का प्रसार"],["hydration","जलयोजन"],
    ["red colour","लाल रंग"],["yellow colour","पीला रंग"],["soil colour","मिट्टी का रंग"],
    ["eastern and southern Deccan","पूर्वी और दक्षिणी दक्कन"],["Deccan plateau","दक्कन का पठार"],
    ["middle Ganga plain","मध्य गंगा मैदान"],["Western Ghats","पश्चिमी घाट"],["piedmont","पर्वतपदीय क्षेत्र"],
    ["red loamy soil","लाल दोमट मिट्टी"],["loamy soil","दोमट मिट्टी"],["loamy","दोमट"],["silty","गादयुक्त"],
    ["intense leaching","तीव्र निक्षालन"],["leaching","निक्षालन"],["humus","ह्यूमस"],["fertility","उर्वरता"],
    ["soil improvement","मिट्टी सुधार"],["fertiliser","उर्वरक"],["fertilizers","उर्वरक"],["manure","खाद"],
    ["tea","चाय"],["coffee","कॉफी"],["cashew","काजू"],["sandy texture","रेतीली बनावट"],["sandy","रेतीली"],
    ["salinity","लवणता"],["common salt","साधारण नमक"],["rapid evaporation","तेज वाष्पीकरण"],["evaporation","वाष्पीकरण"],
    ["low moisture","कम नमी"],["kankar layer","कंकड़ परत"],["kankar","कंकड़"],["calcium","कैल्शियम"],
    ["lower horizons","निचले मृदा-क्षितिज"],["infiltration","जल-प्रवेश"],["restricted infiltration","सीमित जल-प्रवेश"],
    ["irrigation","सिंचाई"],["cultivable","खेती योग्य"],["cultivation","खेती"],["cultivability","खेती योग्यता"],
    ["mountain environment","पर्वतीय पर्यावरण"],["mountain slopes","पर्वतीय ढालें"],["upper slopes","ऊपरी ढालें"],
    ["coarse-grained","मोटे कणों वाली"],["denudation","अनाच्छादन"],["snow-covered","हिमाच्छादित"],["acidic","अम्लीय"],
    ["lower valleys","निचली घाटियाँ"],["terraces","सीढ़ीनुमा सतहें"],["alluvial fans","जलोढ़ पंख"],
    ["distribution","वितरण"],["northern plains","उत्तरी मैदान"],["western corridor","पश्चिमी पट्टी"],
    ["eastern coastal deltas","पूर्वी तटीय डेल्टा"],["coastal deltas","तटीय डेल्टा"],
    ["Godavari-Krishna valleys","गोदावरी-कृष्णा घाटियाँ"],["western and central Deccan","पश्चिमी और मध्य दक्कन"],
    ["western India","पश्चिमी भारत"],["forest setting","वन क्षेत्र"],["soil profile","मृदा-प्रोफ़ाइल"],["soil distribution","मिट्टी का वितरण"],
    ["soil erosion","मृदा अपरदन"],["gully erosion","अवनालिका अपरदन"],["sheet erosion","पर्त अपरदन"],["wind erosion","पवन अपरदन"],["contour ploughing","समोच्च जुताई"],["terrace cultivation","सीढ़ीदार खेती"],["strip cropping","पट्टीदार खेती"],["shelter belts","रक्षक वृक्ष-पट्टियाँ"],["shelter belt","रक्षक वृक्ष-पट्टी"],["dune stabilisation","बालू-टीला स्थिरीकरण"],["deforestation","वनों की कटाई"],["overgrazing","अतिचराई"],["ravines","बीहड़"],["crop suitability","फसल उपयुक्तता"],["sugarcane","गन्ना"],["paddy","धान"],["cereals","अनाज"],["moisture retention","नमी-धारण क्षमता"],["workability","कार्यशीलता"],["soil conservation","मृदा संरक्षण"],["erosion","अपरदन"],["Odisha","ओडिशा"],["Chhattisgarh","छत्तीसगढ़"],["Karnataka","कर्नाटक"],["Kerala","केरल"],["Tamil Nadu","तमिलनाडु"],
    ["Madhya Pradesh","मध्य प्रदेश"],["Assam","असम"],["Rajasthan","राजस्थान"],["Gujarat","गुजरात"],["Punjab","पंजाब"],["Haryana","हरियाणा"],
    ["formation","निर्माण"],["formed","बनी"],["developed","विकसित"],["develops","विकसित होती है"],["weathering","अपक्षय"],
    ["rainfall","वर्षा"],["temperature","तापमान"],["moisture","नमी"],["texture","बनावट"],["colour","रंग"],["color","रंग"],
    ["region","क्षेत्र"],["areas","क्षेत्र"],["area","क्षेत्र"],["soil","मिट्टी"],["rocks","चट्टानें"],["rock","चट्टान"],
    ["iron","लोहा"],["water","पानी"],["high","उच्च"],["low","कम"],["deep","गहरी"],["upper","ऊपरी"],["lower","निचली"],
    ["dry","शुष्क"],["wet","गीली"],["fine","महीन"],["coarse","मोटा"],["fertile","उपजाऊ"],["poor","कम"],["rich","समृद्ध"],
    ["plateau","पठार"],["foothill","पर्वतपदीय"],["receives","प्राप्त करता है"],["relatively","अपेक्षाकृत"],
    ["more likely","अधिक संभावित"],["likely","संभावित"],["lateritic","लैटेराइटी"],["laterite","लैटेराइट"],
    ["immediately east","तुरंत पूर्व"],["east","पूर्व"],["material","पदार्थ"],["soil group","मृदा समूह"],["group","समूह"],
    ["belongs to","से संबंधित है"],["belong to","से संबंधित"],["map","मानचित्र"],["marks","दर्शाता है"],["highlights","दर्शाता है"],
    ["narrow","संकरी"],["along","के साथ"],["rather than","के बजाय"],["legend","मानचित्र संकेत"],["says","बताता है"],
    ["family","वर्ग"],["key","संकेत"],["use","प्रयोग करे"],["relationship","संबंध"],["effect","प्रभाव"],["role","भूमिका"],
    ["feature","विशेषता"],["prove","सिद्ध करना"],["different origins","भिन्न उत्पत्ति"],["origin","उत्पत्ति"],["profile","प्रोफ़ाइल"],
    ["strongly","तीव्र रूप से"],["washed","धुली"],["process","प्रक्रिया"],["best explains","सबसे अच्छी तरह समझाती है"],["explains","समझाती है"],
    ["change","परिवर्तन"],["two","दो"],["warm","गर्म"],["similar","समान"],["one","एक"],["much heavier","बहुत अधिक"],
    ["show","दिखाना"],["stronger","अधिक तीव्र"],["hot","गर्म"],["rapid decomposition","तेज अपघटन"],["decomposition","अपघटन"],
    ["plant litter","पौध-अवशेष"],["organic matter","जैविक पदार्थ"],["surface material","सतही पदार्थ"],["surface","सतह"],
    ["explanation","व्याख्या"],["fits","उपयुक्त है"],["southern state","दक्षिणी राज्य"],["important","महत्वपूर्ण"],
    ["estate","बागान"],["management step","प्रबंधन उपाय"],["management","प्रबंधन"],["address","सुधारना"],["natural weakness","प्राकृतिक कमी"],
    ["coastal upland","तटीय ऊँचाई वाला"],["district","जिला"],["plans","योजना बनाता है"],["tree crop","वृक्ष फसल"],
    ["standard geographical match","मानक भौगोलिक मेल"],["clue","संकेत"],["support","समर्थन करना"],["arid","शुष्क"],
    ["climatic","जलवायवीय"],["connects","जोड़ती है"],["layer","परत"],["saline","लवणीय"],["hard","कठोर"],["below","नीचे"],
    ["diagnosis","पहचान"],["consistent","संगत"],["highland","ऊँचा भूभाग"],["steep slopes","तीखी ढालें"],["steep","तीखी"],
    ["regular","नियमित"],["extensive","विस्तृत"],["forest cover","वन आवरण"],["valleys","घाटियाँ"],["valley","घाटी"],
    ["wind erosion","पवन अपरदन"],["summits","शिखर"],["slope position","ढाल की स्थिति"],["slope","ढाल"],["thick","मोटी"],
    ["shallow","उथली"],["helped create","बनाने में सहायक रही"],["Himalayan","हिमालयी"],["frequent removal","बार-बार हटना"],
    ["soil loss","मिट्टी का ह्रास"],["acidity","अम्लता"],["altitude","ऊँचाई"],["local conditions","स्थानीय दशाएँ"],
    ["every","हर"],["chemistry","रासायनिक प्रकृति"],["tendency","प्रवृत्ति"],["expected","अपेक्षित"],["east-coast","पूर्वी तट"],
    ["even though","यद्यपि"],["far","दूर"],["eastern state","पूर्वी राज्य"],["scattered upland","बिखरे ऊँचे भूभाग"],
    ["across these areas","इन क्षेत्रों में"],["wooded slopes","वनाच्छादित ढालें"],["high-altitude valleys","ऊँची घाटियाँ"],
    ["depositional plain","निक्षेपी मैदान"],["has","है"],["have","हैं"],["had","था"],["would","होगा"],["should","चाहिए"],["be","होना"],
    ["Which","कौन-सा"],["which","कौन-सा"],["What","क्या"],["what","क्या"],["Why","क्यों"],["why","क्यों"],["Where","कहाँ"],["where","कहाँ"],
    ["How","कैसे"],["how","कैसे"],["When","कब"],["when","कब"],["the",""],["and","और"],["or","या"],["is","है"],["are","हैं"],
    ["was","था"],["were","थे"],["does","करता है"],["do","करते हैं"],["did","किया"],["can","सकता है"],["could","सकता था"],
    ["with","के साथ"],["from","से"],["into","में"],["for","के लिए"],["of","का"],["to","को"],["in","में"],["on","पर"],["at","पर"],
    ["by","द्वारा"],["as","के रूप में"],["than","की तुलना में"],["that","कि"],["this","यह"],["these","ये"],["those","वे"],
    ["most","सबसे"],["main","मुख्य"],["major","प्रमुख"],["only","केवल"],["correct","सही"],["statement","कथन"],["following","निम्नलिखित"]
  ];
  const pa:[string,string][] = [
    ["red and yellow soil","ਲਾਲ ਅਤੇ ਪੀਲੀ ਮਿੱਟੀ"],["red soil","ਲਾਲ ਮਿੱਟੀ"],["yellow soil","ਪੀਲੀ ਮਿੱਟੀ"],
    ["laterite soil","ਲੈਟਰਾਈਟ ਮਿੱਟੀ"],["arid soil","ਸੁੱਕੀ ਮਿੱਟੀ"],["forest and mountain soil","ਜੰਗਲੀ ਅਤੇ ਪਹਾੜੀ ਮਿੱਟੀ"],
    ["forest soil","ਜੰਗਲੀ ਮਿੱਟੀ"],["mountain soil","ਪਹਾੜੀ ਮਿੱਟੀ"],["alluvial soil","ਜਲੋਢ ਮਿੱਟੀ"],["black soil","ਕਾਲੀ ਮਿੱਟੀ"],
    ["crystalline igneous rocks","ਸਫ਼ਟਿਕੀ ਆਗਨੇਯ ਚੱਟਾਨਾਂ"],["crystalline igneous rock","ਸਫ਼ਟਿਕੀ ਆਗਨੇਯ ਚੱਟਾਨ"],
    ["igneous rocks","ਆਗਨੇਯ ਚੱਟਾਨਾਂ"],["parent rock","ਮੂਲ ਚੱਟਾਨ"],["parent material","ਮੂਲ ਪਦਾਰਥ"],
    ["low rainfall","ਘੱਟ ਵਰਖਾ"],["heavy rainfall","ਭਾਰੀ ਵਰਖਾ"],["high temperature","ਉੱਚ ਤਾਪਮਾਨ"],
    ["iron compounds","ਲੋਹੇ ਦੇ ਯੋਗਿਕ"],["iron diffusion","ਲੋਹੇ ਦਾ ਫੈਲਾਅ"],["hydration","ਜਲਯੋਜਨ"],
    ["red colour","ਲਾਲ ਰੰਗ"],["yellow colour","ਪੀਲਾ ਰੰਗ"],["soil colour","ਮਿੱਟੀ ਦਾ ਰੰਗ"],
    ["eastern and southern Deccan","ਪੂਰਬੀ ਅਤੇ ਦੱਖਣੀ ਦੱਖਣ"],["Deccan plateau","ਦੱਖਣ ਦਾ ਪਠਾਰ"],
    ["middle Ganga plain","ਮੱਧ ਗੰਗਾ ਮੈਦਾਨ"],["Western Ghats","ਪੱਛਮੀ ਘਾਟ"],["piedmont","ਪਹਾੜ-ਪੈਰ ਖੇਤਰ"],
    ["red loamy soil","ਲਾਲ ਦੋਮਟ ਮਿੱਟੀ"],["loamy soil","ਦੋਮਟ ਮਿੱਟੀ"],["loamy","ਦੋਮਟ"],["silty","ਗਾਦ ਵਾਲੀ"],
    ["intense leaching","ਤੀਬਰ ਧੁਲਾਈ"],["leaching","ਧੁਲਾਈ"],["humus","ਹਿਊਮਸ"],["fertility","ਉਪਜਾਊਪਣ"],
    ["soil improvement","ਮਿੱਟੀ ਸੁਧਾਰ"],["fertiliser","ਖਾਦ"],["fertilizers","ਖਾਦਾਂ"],["manure","ਜੈਵਿਕ ਖਾਦ"],
    ["tea","ਚਾਹ"],["coffee","ਕੌਫੀ"],["cashew","ਕਾਜੂ"],["sandy texture","ਰੇਤੀਲੀ ਬਣਤਰ"],["sandy","ਰੇਤੀਲੀ"],
    ["salinity","ਲੂਣਾਪਣ"],["common salt","ਸਧਾਰਣ ਲੂਣ"],["rapid evaporation","ਤੇਜ਼ ਵਾਸਪੀਕਰਨ"],["evaporation","ਵਾਸਪੀਕਰਨ"],
    ["low moisture","ਘੱਟ ਨਮੀ"],["kankar layer","ਕੰਕਰ ਪਰਤ"],["kankar","ਕੰਕਰ"],["calcium","ਕੈਲਸ਼ੀਅਮ"],
    ["lower horizons","ਹੇਠਲੀਆਂ ਮਿੱਟੀ ਪਰਤਾਂ"],["infiltration","ਪਾਣੀ ਦਾ ਰਿਸਾਅ"],["restricted infiltration","ਸੀਮਿਤ ਪਾਣੀ ਰਿਸਾਅ"],
    ["irrigation","ਸਿੰਚਾਈ"],["cultivable","ਖੇਤੀਯੋਗ"],["cultivation","ਖੇਤੀ"],["cultivability","ਖੇਤੀਯੋਗਤਾ"],
    ["mountain environment","ਪਹਾੜੀ ਵਾਤਾਵਰਣ"],["mountain slopes","ਪਹਾੜੀ ਢਲਾਣਾਂ"],["upper slopes","ਉੱਪਰੀ ਢਲਾਣਾਂ"],
    ["coarse-grained","ਮੋਟੇ ਕਣਾਂ ਵਾਲੀ"],["denudation","ਅਨਾਛਾਦਨ"],["snow-covered","ਬਰਫ਼-ਢੱਕਿਆ"],["acidic","ਅਮਲੀ"],
    ["lower valleys","ਹੇਠਲੀਆਂ ਘਾਟੀਆਂ"],["terraces","ਛੱਜੀਆਂ"],["alluvial fans","ਜਲੋਢ ਪੱਖੇ"],
    ["distribution","ਵੰਡ"],["northern plains","ਉੱਤਰੀ ਮੈਦਾਨ"],["western corridor","ਪੱਛਮੀ ਪੱਟੀ"],
    ["eastern coastal deltas","ਪੂਰਬੀ ਤਟੀ ਡੈਲਟੇ"],["coastal deltas","ਤਟੀ ਡੈਲਟੇ"],
    ["Godavari-Krishna valleys","ਗੋਦਾਵਰੀ-ਕ੍ਰਿਸ਼ਨਾ ਘਾਟੀਆਂ"],["western and central Deccan","ਪੱਛਮੀ ਅਤੇ ਮੱਧ ਦੱਖਣ"],
    ["western India","ਪੱਛਮੀ ਭਾਰਤ"],["forest setting","ਜੰਗਲੀ ਖੇਤਰ"],["soil profile","ਮਿੱਟੀ-ਪ੍ਰੋਫ਼ਾਈਲ"],["soil distribution","ਮਿੱਟੀ ਦੀ ਵੰਡ"],
    ["soil erosion","ਮਿੱਟੀ ਕਟਾਅ"],["gully erosion","ਖੱਡੀ ਕਟਾਅ"],["sheet erosion","ਪਰਤੀ ਕਟਾਅ"],["wind erosion","ਹਵਾ ਕਟਾਅ"],["contour ploughing","ਸਮੋਚ ਜੋਤਾਈ"],["terrace cultivation","ਪੌੜੀਦਾਰ ਖੇਤੀ"],["strip cropping","ਪੱਟੀਦਾਰ ਖੇਤੀ"],["shelter belts","ਰੱਖਿਆ ਰੁੱਖ-ਪੱਟੀਆਂ"],["shelter belt","ਰੱਖਿਆ ਰੁੱਖ-ਪੱਟੀ"],["dune stabilisation","ਰੇਤਲੇ ਟਿੱਬਿਆਂ ਦੀ ਸਥਿਰਤਾ"],["deforestation","ਜੰਗਲਾਂ ਦੀ ਕਟਾਈ"],["overgrazing","ਅਤਿ-ਚਰਾਈ"],["ravines","ਬੀਹੜ"],["crop suitability","ਫਸਲ ਉਚਿਤਤਾ"],["sugarcane","ਗੰਨਾ"],["paddy","ਧਾਨ"],["cereals","ਅਨਾਜ"],["moisture retention","ਨਮੀ-ਸੰਭਾਲ ਸਮਰੱਥਾ"],["workability","ਕੰਮਯੋਗਤਾ"],["soil conservation","ਮਿੱਟੀ ਸੰਰੱਖਣ"],["erosion","ਕਟਾਅ"],["Odisha","ਓਡੀਸ਼ਾ"],["Chhattisgarh","ਛੱਤੀਸਗੜ੍ਹ"],["Karnataka","ਕਰਨਾਟਕ"],["Kerala","ਕੇਰਲ"],["Tamil Nadu","ਤਮਿਲਨਾਡੂ"],
    ["Madhya Pradesh","ਮੱਧ ਪ੍ਰਦੇਸ਼"],["Assam","ਅਸਾਮ"],["Rajasthan","ਰਾਜਸਥਾਨ"],["Gujarat","ਗੁਜਰਾਤ"],["Punjab","ਪੰਜਾਬ"],["Haryana","ਹਰਿਆਣਾ"],
    ["formation","ਬਣਤਰ"],["formed","ਬਣੀ"],["developed","ਵਿਕਸਿਤ"],["develops","ਵਿਕਸਿਤ ਹੁੰਦੀ ਹੈ"],["weathering","ਅਪਖੰਡਨ"],
    ["rainfall","ਵਰਖਾ"],["temperature","ਤਾਪਮਾਨ"],["moisture","ਨਮੀ"],["texture","ਬਣਤਰ"],["colour","ਰੰਗ"],["color","ਰੰਗ"],
    ["region","ਖੇਤਰ"],["areas","ਖੇਤਰ"],["area","ਖੇਤਰ"],["soil","ਮਿੱਟੀ"],["rocks","ਚੱਟਾਨਾਂ"],["rock","ਚੱਟਾਨ"],
    ["iron","ਲੋਹਾ"],["water","ਪਾਣੀ"],["high","ਉੱਚ"],["low","ਘੱਟ"],["deep","ਡੂੰਘੀ"],["upper","ਉੱਪਰੀ"],["lower","ਹੇਠਲੀ"],
    ["dry","ਸੁੱਕੀ"],["wet","ਗੀਲੀ"],["fine","ਬਰੀਕ"],["coarse","ਮੋਟਾ"],["fertile","ਉਪਜਾਊ"],["poor","ਘੱਟ"],["rich","ਭਰਪੂਰ"],
    ["plateau","ਪਠਾਰ"],["foothill","ਪਹਾੜ-ਪੈਰ"],["receives","ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ"],["relatively","ਤੁਲਨਾਤਮਕ ਤੌਰ ਤੇ"],
    ["more likely","ਵੱਧ ਸੰਭਾਵੀ"],["likely","ਸੰਭਾਵੀ"],["lateritic","ਲੈਟਰਾਈਟੀ"],["laterite","ਲੈਟਰਾਈਟ"],
    ["immediately east","ਤੁਰੰਤ ਪੂਰਬ"],["east","ਪੂਰਬ"],["material","ਪਦਾਰਥ"],["soil group","ਮਿੱਟੀ ਦੀ ਕਿਸਮ"],["group","ਸਮੂਹ"],
    ["belongs to","ਨਾਲ ਸਬੰਧਿਤ ਹੈ"],["belong to","ਨਾਲ ਸਬੰਧਿਤ"],["map","ਨਕਸ਼ਾ"],["marks","ਦਰਸਾਉਂਦਾ ਹੈ"],["highlights","ਦਰਸਾਉਂਦਾ ਹੈ"],
    ["narrow","ਸੰਕਰੀ"],["along","ਦੇ ਨਾਲ"],["rather than","ਦੀ ਬਜਾਇ"],["legend","ਨਕਸ਼ਾ-ਸੰਕੇਤ"],["says","ਦੱਸਦਾ ਹੈ"],
    ["family","ਵਰਗ"],["key","ਸੰਕੇਤ"],["use","ਵਰਤੇ"],["relationship","ਸਬੰਧ"],["effect","ਪ੍ਰਭਾਵ"],["role","ਭੂਮਿਕਾ"],
    ["feature","ਵਿਸ਼ੇਸ਼ਤਾ"],["prove","ਸਾਬਤ ਕਰਨਾ"],["different origins","ਵੱਖਰੀ ਉਤਪੱਤੀ"],["origin","ਉਤਪੱਤੀ"],["profile","ਪ੍ਰੋਫ਼ਾਈਲ"],
    ["strongly","ਤੀਬਰ ਤੌਰ ਤੇ"],["washed","ਧੁੱਲੀ"],["process","ਪ੍ਰਕਿਰਿਆ"],["best explains","ਸਭ ਤੋਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਮਝਾਉਂਦੀ ਹੈ"],["explains","ਸਮਝਾਉਂਦੀ ਹੈ"],
    ["change","ਬਦਲਾਅ"],["two","ਦੋ"],["warm","ਗਰਮ"],["similar","ਇੱਕੋ ਜਿਹੇ"],["one","ਇੱਕ"],["much heavier","ਬਹੁਤ ਵੱਧ"],
    ["show","ਦਿਖਾਉਣਾ"],["stronger","ਵੱਧ ਤੀਬਰ"],["hot","ਗਰਮ"],["rapid decomposition","ਤੇਜ਼ ਵਿਘਟਨ"],["decomposition","ਵਿਘਟਨ"],
    ["plant litter","ਪੌਧਾ-ਅਵਸ਼ੇਸ਼"],["organic matter","ਜੈਵਿਕ ਪਦਾਰਥ"],["surface material","ਸਤਹੀ ਪਦਾਰਥ"],["surface","ਸਤਹ"],
    ["explanation","ਵਿਆਖਿਆ"],["fits","ਢੁੱਕਵੀਂ ਹੈ"],["southern state","ਦੱਖਣੀ ਰਾਜ"],["important","ਮਹੱਤਵਪੂਰਨ"],
    ["estate","ਬਾਗ਼ਾਨ"],["management step","ਪ੍ਰਬੰਧਨ ਉਪਾਅ"],["management","ਪ੍ਰਬੰਧਨ"],["address","ਸੁਧਾਰਨਾ"],["natural weakness","ਕੁਦਰਤੀ ਘਾਟ"],
    ["coastal upland","ਤਟੀ ਉੱਚਭੂਮੀ"],["district","ਜ਼ਿਲ੍ਹਾ"],["plans","ਯੋਜਨਾ ਬਣਾਉਂਦਾ ਹੈ"],["tree crop","ਰੁੱਖੀ ਫਸਲ"],
    ["standard geographical match","ਮਿਆਰੀ ਭੂਗੋਲਿਕ ਮੇਲ"],["clue","ਸੰਕੇਤ"],["support","ਸਮਰਥਨ ਕਰਨਾ"],["arid","ਸੁੱਕਾ"],
    ["climatic","ਜਲਵਾਯੂ ਸੰਬੰਧੀ"],["connects","ਜੋੜਦੀ ਹੈ"],["layer","ਪਰਤ"],["saline","ਲੂਣੀ"],["hard","ਸਖ਼ਤ"],["below","ਹੇਠਾਂ"],
    ["diagnosis","ਪਛਾਣ"],["consistent","ਸੰਗਤ"],["highland","ਉੱਚਭੂਮੀ"],["steep slopes","ਤੇਜ਼ ਢਲਾਣਾਂ"],["steep","ਤੇਜ਼"],
    ["regular","ਨਿਯਮਿਤ"],["extensive","ਵਿਸ਼ਾਲ"],["forest cover","ਜੰਗਲ ਆਵਰਨ"],["valleys","ਘਾਟੀਆਂ"],["valley","ਘਾਟੀ"],
    ["wind erosion","ਹਵਾ ਦੁਆਰਾ ਕਟਾਅ"],["summits","ਚੋਟੀਆਂ"],["slope position","ਢਲਾਣ ਦੀ ਸਥਿਤੀ"],["slope","ਢਲਾਣ"],["thick","ਮੋਟੀ"],
    ["shallow","ਥੋੜ੍ਹੀ ਡੂੰਘੀ"],["helped create","ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕੀਤੀ"],["Himalayan","ਹਿਮਾਲਈ"],["frequent removal","ਵਾਰ-ਵਾਰ ਹਟਣਾ"],
    ["soil loss","ਮਿੱਟੀ ਦਾ ਨੁਕਸਾਨ"],["acidity","ਅਮਲਤਾ"],["altitude","ਉਚਾਈ"],["local conditions","ਸਥਾਨਕ ਹਾਲਤਾਂ"],
    ["every","ਹਰ"],["chemistry","ਰਸਾਇਣਕ ਸੁਭਾਅ"],["tendency","ਰੁਝਾਨ"],["expected","ਉਮੀਦ ਕੀਤੀ"],["east-coast","ਪੂਰਬੀ ਤਟ"],
    ["even though","ਭਾਵੇਂ"],["far","ਦੂਰ"],["eastern state","ਪੂਰਬੀ ਰਾਜ"],["scattered upland","ਛਿੱਟੇ ਉੱਚਭੂਮੀ ਖੇਤਰ"],
    ["across these areas","ਇਨ੍ਹਾਂ ਖੇਤਰਾਂ ਵਿੱਚ"],["wooded slopes","ਜੰਗਲ-ਢੱਕੀਆਂ ਢਲਾਣਾਂ"],["high-altitude valleys","ਉੱਚੀਆਂ ਘਾਟੀਆਂ"],
    ["depositional plain","ਨਿਕਸ਼ੇਪੀ ਮੈਦਾਨ"],["has","ਹੈ"],["have","ਹਨ"],["had","ਸੀ"],["would","ਹੋਵੇਗਾ"],["should","ਚਾਹੀਦਾ"],["be","ਹੋਣਾ"],
    ["Which","ਕਿਹੜਾ"],["which","ਕਿਹੜਾ"],["What","ਕੀ"],["what","ਕੀ"],["Why","ਕਿਉਂ"],["why","ਕਿਉਂ"],["Where","ਕਿੱਥੇ"],["where","ਕਿੱਥੇ"],
    ["How","ਕਿਵੇਂ"],["how","ਕਿਵੇਂ"],["When","ਕਦੋਂ"],["when","ਕਦੋਂ"],["the",""],["and","ਅਤੇ"],["or","ਜਾਂ"],["is","ਹੈ"],["are","ਹਨ"],
    ["was","ਸੀ"],["were","ਸਨ"],["does","ਕਰਦਾ ਹੈ"],["do","ਕਰਦੇ ਹਨ"],["did","ਕੀਤਾ"],["can","ਸਕਦਾ ਹੈ"],["could","ਸਕਦਾ ਸੀ"],
    ["with","ਨਾਲ"],["from","ਤੋਂ"],["into","ਵਿੱਚ"],["for","ਲਈ"],["of","ਦਾ"],["to","ਨੂੰ"],["in","ਵਿੱਚ"],["on","ਉੱਤੇ"],["at","ਉੱਤੇ"],
    ["by","ਦੁਆਰਾ"],["as","ਵਜੋਂ"],["than","ਨਾਲੋਂ"],["that","ਕਿ"],["this","ਇਹ"],["these","ਇਹ"],["those","ਉਹ"],
    ["most","ਸਭ ਤੋਂ"],["main","ਮੁੱਖ"],["major","ਮੁੱਖ"],["only","ਕੇਵਲ"],["correct","ਸਹੀ"],["statement","ਕਥਨ"],["following","ਹੇਠ ਲਿਖੇ"]
  ];
  let out=text;
  const pairs=language==="hi"?hi:pa;
  const esc=(s:string)=>s.replace(/[.*+?^$()|[\]\\{}]/g,(ch)=>"\\\\"+ch);
  for(const [a,b] of pairs.sort((x,y)=>y[0].length-x[0].length)) out=out.replace(new RegExp("\\b"+esc(a)+"\\b","gi"),b);
  return out.replace(/\s{2,}/g," ").replace(/\s+([,.;:?!])/g,"$1").trim();
}
function localizeGeoTrnBulkV1(question:CanonicalQuestion,language:"hi"|"pa"){
  if(!/^GEO-TRN-001-CP00[1-5]-Q/.test(question.questionId)) return null;
  const local=(s:string)=>polishGeoTrnBulkTextV1(localizeText(s,language),language);
  const stemBase=localizeNaturalStem(question.stem,language,"GEO-TRN-001") ?? localizeText(question.stem,language);
  const stem=polishGeoTrnBulkTextV1(stemBase,language);
  const options=Object.freeze(question.options.map(local));
  const canonicalAnswer=options[question.correctIndex]!;
  const explanation=local(question.explanation);
  return Object.freeze({stem,options,canonicalAnswer,explanation});
}
function localizeGeoSoiBulkCp004Cp008V1(question:CanonicalQuestion, language:"hi"|"pa") {
  if (!/^GEO-SOI-001-CP(?:00[4-9]|01[0-2])-Q/.test(question.questionId)) return null;
  const safe = (source:string) => {
    const exact=EXACT[language][source];
    if (exact) return exact;
    let out=source;
    for (const [from,to] of PHRASES[language]) out=out.split(from).join(to);
    for (const [from,to] of Object.entries(TERMS[language]).sort((a,b)=>b[0].length-a[0].length)) {
      out=out.replace(new RegExp("(?<![A-Za-z])"+regexEscape(from)+"(?![A-Za-z])","gi"),to);
    }
    out=replaceWords(out,language);
    return polishGeoSoiBulkTextV1(out,language);
  };
  const stem=safe(question.stem);
  const options=Object.freeze(question.options.map(safe));
  const canonicalAnswer=options[question.correctIndex]!;
  const explanation=safe(question.explanation);
  return Object.freeze({stem,options,canonicalAnswer,explanation});
}

function polishGeoTrnBulkTextV1(text:string, language:"hi"|"pa") {
  const hi:[string,string][] = [
    ["National Highways","राष्ट्रीय राजमार्ग"],["National Highway","राष्ट्रीय राजमार्ग"],["State Highways","राज्य राजमार्ग"],["State Highway","राज्य राजमार्ग"],
    ["rural roads","ग्रामीण सड़कें"],["rural road","ग्रामीण सड़क"],["expressways","एक्सप्रेसवे"],["expressway","एक्सप्रेसवे"],
    ["access-controlled","नियंत्रित-प्रवेश"],["controlled access","नियंत्रित प्रवेश"],["road transport","सड़क परिवहन"],["road network","सड़क नेटवर्क"],
    ["Border Roads Organisation","सीमा सड़क संगठन"],["strategic roads","सामरिक सड़कें"],["strategic road","सामरिक सड़क"],["last-mile connectivity","अंतिम-मील संपर्क"],
    ["Golden Quadrilateral","स्वर्णिम चतुर्भुज"],["North-South Corridor","उत्तर-दक्षिण गलियारा"],["East-West Corridor","पूर्व-पश्चिम गलियारा"],
    ["Bharatmala Pariyojana","भारतमाला परियोजना"],["economic corridors","आर्थिक गलियारे"],["feeder roads","फीडर सड़कें"],
    ["railway network","रेल नेटवर्क"],["rail transport","रेल परिवहन"],["railways","रेलमार्ग"],["railway","रेलमार्ग"],["broad gauge","ब्रॉड गेज"],
    ["railway electrification","रेल विद्युतीकरण"],["Dedicated Freight Corridors","समर्पित माल गलियारे"],["Dedicated Freight Corridor","समर्पित माल गलियारा"],
    ["Eastern DFC","पूर्वी डीएफसी"],["Western DFC","पश्चिमी डीएफसी"],["Konkan Railway","कोंकण रेलवे"],["mountain railways","पर्वतीय रेलमार्ग"],
    ["freight","माल ढुलाई"],["passenger","यात्री"],["traction","कर्षण"],["railway zones","रेलवे जोन"],["trunk routes","मुख्य रेल मार्ग"],
    ["seaport","समुद्री बंदरगाह"],["port hinterland","बंदरगाह पृष्ठप्रदेश"],["ports","बंदरगाह"],["port","बंदरगाह"],["harbour","बंदरगाह"],
    ["natural harbour","प्राकृतिक बंदरगाह"],["artificial harbour","कृत्रिम बंदरगाह"],["coastal shipping","तटीय नौवहन"],["inland water transport","अंतर्देशीय जल परिवहन"],
    ["National Waterway","राष्ट्रीय जलमार्ग"],["waterway","जलमार्ग"],["Sagarmala","सागरमाला"],["port-led development","बंदरगाह-आधारित विकास"],
    ["air transport","हवाई परिवहन"],["airport management","हवाईअड्डा प्रबंधन"],["airports","हवाईअड्डे"],["airport","हवाईअड्डा"],["AAI","एएआई"],
    ["domestic air connectivity","घरेलू हवाई संपर्क"],["international air connectivity","अंतरराष्ट्रीय हवाई संपर्क"],["UDAN","उड़ान"],
    ["pipeline transport","पाइपलाइन परिवहन"],["oil pipeline","तेल पाइपलाइन"],["natural gas pipeline","प्राकृतिक गैस पाइपलाइन"],["gas pipeline","गैस पाइपलाइन"],
    ["multimodal transport","बहु-माध्यम परिवहन"],["logistics hubs","लॉजिस्टिक्स केंद्र"],["freight terminals","माल टर्मिनल"],["transfer points","स्थानांतरण केंद्र"],
    ["communication networks","संचार नेटवर्क"],["communication network","संचार नेटवर्क"],["mobile communication","मोबाइल संचार"],["telephone","टेलीफोन"],
    ["optical-fibre","ऑप्टिकल फाइबर"],["optical fibre","ऑप्टिकल फाइबर"],["internet","इंटरनेट"],["data connectivity","डेटा संपर्क"],["satellite communication","उपग्रह संचार"],
    ["postal network","डाक नेटवर्क"],["postal communication","डाक संचार"],["mass communication","जनसंचार"],["broadcasting","प्रसारण"],
    ["digital connectivity","डिजिटल संपर्क"],["network resilience","नेटवर्क लचीलापन"],["redundancy","वैकल्पिक व्यवस्था"],
    ["connectivity","संपर्क"],["corridor","गलियारा"],["network","नेटवर्क"],["transport","परिवहन"],["communication","संचार"],
    ["major cities","प्रमुख शहर"],["state capitals","राज्य राजधानियाँ"],["economic centres","आर्थिक केंद्र"],["border regions","सीमावर्ती क्षेत्र"],["remote regions","दूरस्थ क्षेत्र"],
    ["markets","बाजार"],["market","बाजार"],["route","मार्ग"],["routes","मार्ग"],["movement","आवागमन"],["traffic","यातायात"],
    ["high-speed","उच्च गति"],["high capacity","उच्च क्षमता"],["high-capacity","उच्च क्षमता"],["long-distance","लंबी दूरी"],["inter-state","अंतर्राज्यीय"],
    ["which","कौन-सा"],["what","क्या"],["why","क्यों"],["where","कहाँ"],["when","कब"],["how","कैसे"],["the",""],["and","और"],["or","या"],
    ["is","है"],["are","हैं"],["was","था"],["were","थे"],["does","करता है"],["do","करते हैं"],["did","किया"],["can","सकता है"],["could","सकता था"],
    ["would","होगा"],["should","चाहिए"],["has","है"],["have","हैं"],["had","था"],["with","के साथ"],["from","से"],["into","में"],["for","के लिए"],
    ["of","का"],["to","को"],["in","में"],["on","पर"],["at","पर"],["by","द्वारा"],["as","के रूप में"],["than","की तुलना में"],["that","कि"],
    ["this","यह"],["these","ये"],["those","वे"],["most","सबसे"],["main","मुख्य"],["major","प्रमुख"],["only","केवल"],["correct","सही"],
    ["statement","कथन"],["following","निम्नलिखित"],["important","महत्वपूर्ण"],["connect","जोड़ना"],["connects","जोड़ता है"],["linked","जुड़ा"],["link","जोड़ना"]
  ];
  const pa:[string,string][] = [
    ["National Highways","ਰਾਸ਼ਟਰੀ ਰਾਜਮਾਰਗ"],["National Highway","ਰਾਸ਼ਟਰੀ ਰਾਜਮਾਰਗ"],["State Highways","ਰਾਜ ਰਾਜਮਾਰਗ"],["State Highway","ਰਾਜ ਰਾਜਮਾਰਗ"],
    ["rural roads","ਪੇਂਡੂ ਸੜਕਾਂ"],["rural road","ਪੇਂਡੂ ਸੜਕ"],["expressways","ਐਕਸਪ੍ਰੈਸਵੇ"],["expressway","ਐਕਸਪ੍ਰੈਸਵੇ"],
    ["access-controlled","ਨਿਯੰਤਰਿਤ-ਪ੍ਰਵੇਸ਼"],["controlled access","ਨਿਯੰਤਰਿਤ ਪ੍ਰਵੇਸ਼"],["road transport","ਸੜਕ ਆਵਾਜਾਈ"],["road network","ਸੜਕ ਜਾਲ"],
    ["Border Roads Organisation","ਸੀਮਾ ਸੜਕ ਸੰਗਠਨ"],["strategic roads","ਰਣਨੀਤਕ ਸੜਕਾਂ"],["strategic road","ਰਣਨੀਤਕ ਸੜਕ"],["last-mile connectivity","ਆਖਰੀ-ਮੀਲ ਜੋੜ"],
    ["Golden Quadrilateral","ਸੁਵਰਨ ਚਤੁਰਭੁਜ"],["North-South Corridor","ਉੱਤਰ-ਦੱਖਣ ਗਲਿਆਰਾ"],["East-West Corridor","ਪੂਰਬ-ਪੱਛਮ ਗਲਿਆਰਾ"],
    ["Bharatmala Pariyojana","ਭਾਰਤਮਾਲਾ ਪਰਿਯੋਜਨਾ"],["economic corridors","ਆਰਥਿਕ ਗਲਿਆਰੇ"],["feeder roads","ਫੀਡਰ ਸੜਕਾਂ"],
    ["railway network","ਰੇਲ ਜਾਲ"],["rail transport","ਰੇਲ ਆਵਾਜਾਈ"],["railways","ਰੇਲਵੇ"],["railway","ਰੇਲਵੇ"],["broad gauge","ਬ੍ਰਾਡ ਗੇਜ"],
    ["railway electrification","ਰੇਲ ਵਿਦਿਉਤੀਕਰਨ"],["Dedicated Freight Corridors","ਸਮਰਪਿਤ ਮਾਲ ਗਲਿਆਰੇ"],["Dedicated Freight Corridor","ਸਮਰਪਿਤ ਮਾਲ ਗਲਿਆਰਾ"],
    ["Eastern DFC","ਪੂਰਬੀ ਡੀਐਫਸੀ"],["Western DFC","ਪੱਛਮੀ ਡੀਐਫਸੀ"],["Konkan Railway","ਕੋਂਕਣ ਰੇਲਵੇ"],["mountain railways","ਪਹਾੜੀ ਰੇਲਵੇ"],
    ["freight","ਮਾਲ ਢੁਆਈ"],["passenger","ਯਾਤਰੀ"],["traction","ਕਰਸ਼ਣ"],["railway zones","ਰੇਲਵੇ ਜੋਨ"],["trunk routes","ਮੁੱਖ ਰੇਲ ਮਾਰਗ"],
    ["seaport","ਸਮੁੰਦਰੀ ਬੰਦਰਗਾਹ"],["port hinterland","ਬੰਦਰਗਾਹ ਪਿਛਲਾ ਖੇਤਰ"],["ports","ਬੰਦਰਗਾਹ"],["port","ਬੰਦਰਗਾਹ"],["harbour","ਬੰਦਰਗਾਹ"],
    ["natural harbour","ਕੁਦਰਤੀ ਬੰਦਰਗਾਹ"],["artificial harbour","ਕ੍ਰਿਤ੍ਰਿਮ ਬੰਦਰਗਾਹ"],["coastal shipping","ਤਟੀ ਜਹਾਜ਼ਰਾਨੀ"],["inland water transport","ਅੰਦਰੂਨੀ ਜਲ ਆਵਾਜਾਈ"],
    ["National Waterway","ਰਾਸ਼ਟਰੀ ਜਲਮਾਰਗ"],["waterway","ਜਲਮਾਰਗ"],["Sagarmala","ਸਾਗਰਮਾਲਾ"],["port-led development","ਬੰਦਰਗਾਹ-ਅਧਾਰਿਤ ਵਿਕਾਸ"],
    ["air transport","ਹਵਾਈ ਆਵਾਜਾਈ"],["airport management","ਹਵਾਈ ਅੱਡਾ ਪ੍ਰਬੰਧਨ"],["airports","ਹਵਾਈ ਅੱਡੇ"],["airport","ਹਵਾਈ ਅੱਡਾ"],["AAI","ਏਏਆਈ"],
    ["domestic air connectivity","ਘਰੇਲੂ ਹਵਾਈ ਜੋੜ"],["international air connectivity","ਅੰਤਰਰਾਸ਼ਟਰੀ ਹਵਾਈ ਜੋੜ"],["UDAN","ਉਡਾਨ"],
    ["pipeline transport","ਪਾਈਪਲਾਈਨ ਆਵਾਜਾਈ"],["oil pipeline","ਤੇਲ ਪਾਈਪਲਾਈਨ"],["natural gas pipeline","ਕੁਦਰਤੀ ਗੈਸ ਪਾਈਪਲਾਈਨ"],["gas pipeline","ਗੈਸ ਪਾਈਪਲਾਈਨ"],
    ["multimodal transport","ਬਹੁ-ਮਾਧਿਅਮ ਆਵਾਜਾਈ"],["logistics hubs","ਲਾਜਿਸਟਿਕ ਕੇਂਦਰ"],["freight terminals","ਮਾਲ ਟਰਮੀਨਲ"],["transfer points","ਤਬਾਦਲਾ ਕੇਂਦਰ"],
    ["communication networks","ਸੰਚਾਰ ਜਾਲ"],["communication network","ਸੰਚਾਰ ਜਾਲ"],["mobile communication","ਮੋਬਾਈਲ ਸੰਚਾਰ"],["telephone","ਟੈਲੀਫੋਨ"],
    ["optical-fibre","ਆਪਟੀਕਲ ਫਾਈਬਰ"],["optical fibre","ਆਪਟੀਕਲ ਫਾਈਬਰ"],["internet","ਇੰਟਰਨੈੱਟ"],["data connectivity","ਡਾਟਾ ਜੋੜ"],["satellite communication","ਉਪਗ੍ਰਹਿ ਸੰਚਾਰ"],
    ["postal network","ਡਾਕ ਜਾਲ"],["postal communication","ਡਾਕ ਸੰਚਾਰ"],["mass communication","ਜਨਸੰਚਾਰ"],["broadcasting","ਪ੍ਰਸਾਰਣ"],
    ["digital connectivity","ਡਿਜਿਟਲ ਜੋੜ"],["network resilience","ਜਾਲ ਲਚੀਲਾਪਣ"],["redundancy","ਵਿਕਲਪਿਕ ਪ੍ਰਬੰਧ"],
    ["connectivity","ਜੋੜ"],["corridor","ਗਲਿਆਰਾ"],["network","ਜਾਲ"],["transport","ਆਵਾਜਾਈ"],["communication","ਸੰਚਾਰ"],
    ["major cities","ਮੁੱਖ ਸ਼ਹਿਰ"],["state capitals","ਰਾਜਧਾਨੀਆਂ"],["economic centres","ਆਰਥਿਕ ਕੇਂਦਰ"],["border regions","ਸਰਹੱਦੀ ਖੇਤਰ"],["remote regions","ਦੂਰਲੇ ਖੇਤਰ"],
    ["markets","ਬਾਜ਼ਾਰ"],["market","ਬਾਜ਼ਾਰ"],["route","ਮਾਰਗ"],["routes","ਮਾਰਗ"],["movement","ਆਵਾਜਾਈ"],["traffic","ਆਵਾਜਾਈ"],
    ["high-speed","ਉੱਚ ਗਤੀ"],["high capacity","ਉੱਚ ਸਮਰੱਥਾ"],["high-capacity","ਉੱਚ ਸਮਰੱਥਾ"],["long-distance","ਲੰਬੀ ਦੂਰੀ"],["inter-state","ਅੰਤਰ-ਰਾਜੀ"],
    ["which","ਕਿਹੜਾ"],["what","ਕੀ"],["why","ਕਿਉਂ"],["where","ਕਿੱਥੇ"],["when","ਕਦੋਂ"],["how","ਕਿਵੇਂ"],["the",""],["and","ਅਤੇ"],["or","ਜਾਂ"],
    ["is","ਹੈ"],["are","ਹਨ"],["was","ਸੀ"],["were","ਸਨ"],["does","ਕਰਦਾ ਹੈ"],["do","ਕਰਦੇ ਹਨ"],["did","ਕੀਤਾ"],["can","ਸਕਦਾ ਹੈ"],["could","ਸਕਦਾ ਸੀ"],
    ["would","ਹੋਵੇਗਾ"],["should","ਚਾਹੀਦਾ ਹੈ"],["has","ਹੈ"],["have","ਹਨ"],["had","ਸੀ"],["with","ਨਾਲ"],["from","ਤੋਂ"],["into","ਵਿੱਚ"],["for","ਲਈ"],
    ["of","ਦਾ"],["to","ਨੂੰ"],["in","ਵਿੱਚ"],["on","ਉੱਤੇ"],["at","ਉੱਤੇ"],["by","ਦੁਆਰਾ"],["as","ਵਜੋਂ"],["than","ਨਾਲੋਂ"],["that","ਕਿ"],
    ["this","ਇਹ"],["these","ਇਹ"],["those","ਉਹ"],["most","ਸਭ ਤੋਂ"],["main","ਮੁੱਖ"],["major","ਮੁੱਖ"],["only","ਕੇਵਲ"],["correct","ਸਹੀ"],
    ["statement","ਕਥਨ"],["following","ਹੇਠ ਲਿਖੇ"],["important","ਮਹੱਤਵਪੂਰਨ"],["connect","ਜੋੜਨਾ"],["connects","ਜੋੜਦਾ ਹੈ"],["linked","ਜੁੜਿਆ"],["link","ਜੋੜਨਾ"]
  ];
  let out=text;
  const pairs=language==="hi"?hi:pa;
  const bs=String.fromCharCode(92);
  const esc=(s:string)=>Array.from(s).map((ch)=>".^$*+?()[]{}|".includes(ch)?bs+ch:ch).join("");
  for(const [a,b] of pairs.sort((x,y)=>y[0].length-x[0].length)) out=out.replace(new RegExp(bs+"b"+esc(a)+bs+"b","gi"),b);
  return out.replace(/\s{2,}/g," ").replace(/\s+([,.;:?!])/g,"$1").trim();
}


function polishGeoVegBulkTextV1(text:string, language:"hi"|"pa") {
  const hi:[string,string][] = [
    ["natural vegetation","प्राकृतिक वनस्पति"],["virgin vegetation","अक्षत प्राकृतिक वनस्पति"],["cultivated vegetation","कृषित वनस्पति"],
    ["flora","वनस्पति-जगत"],["fauna","जीव-जगत"],["indigenous","देशज"],["endemic","स्थानिक"],["exotic","विदेशी"],
    ["relief","स्थलरूप"],["land controls","स्थलीय नियंत्रण"],["soil controls","मृदा नियंत्रण"],["photoperiod","प्रकाश-अवधि"],
    ["precipitation","वर्षण"],["rainfall","वर्षा"],["temperature","तापमान"],["climate","जलवायु"],["moisture","नमी"],
    ["tropical evergreen forest","उष्णकटिबंधीय सदाबहार वन"],["tropical evergreen forests","उष्णकटिबंधीय सदाबहार वन"],
    ["evergreen forest","सदाबहार वन"],["evergreen forests","सदाबहार वन"],["semi-evergreen forest","अर्ध-सदाबहार वन"],["semi-evergreen forests","अर्ध-सदाबहार वन"],
    ["tropical deciduous forest","उष्णकटिबंधीय पर्णपाती वन"],["tropical deciduous forests","उष्णकटिबंधीय पर्णपाती वन"],
    ["moist deciduous forest","आर्द्र पर्णपाती वन"],["moist deciduous forests","आर्द्र पर्णपाती वन"],
    ["dry deciduous forest","शुष्क पर्णपाती वन"],["dry deciduous forests","शुष्क पर्णपाती वन"],
    ["thorn forest","कांटेदार वन"],["thorn forests","कांटेदार वन"],["thorn and scrub","कांटेदार एवं झाड़ीदार वनस्पति"],["scrub","झाड़ीदार वनस्पति"],
    ["montane vegetation","पर्वतीय वनस्पति"],["montane forest","पर्वतीय वन"],["montane forests","पर्वतीय वन"],
    ["wet temperate broadleaf forests","आर्द्र शीतोष्ण चौड़ी-पत्ती वन"],["temperate conifer forests","शीतोष्ण शंकुधारी वन"],
    ["conifer forests","शंकुधारी वन"],["alpine vegetation","अल्पाइन वनस्पति"],["alpine meadows","अल्पाइन घासभूमियाँ"],
    ["tree line","वृक्ष-रेखा"],["mosses","काई"],["lichens","लाइकेन"],["moss","काई"],["lichen","लाइकेन"],
    ["mangrove vegetation","मैंग्रोव वनस्पति"],["mangrove forest","मैंग्रोव वन"],["mangrove forests","मैंग्रोव वन"],["mangroves","मैंग्रोव"],
    ["tidal forest","ज्वारीय वन"],["tidal forests","ज्वारीय वन"],["tidal","ज्वारीय"],["waterlogging","जलभराव"],["salinity","लवणता"],
    ["pneumatophores","श्वसन-मूल"],["stilt roots","सहारा-जड़ें"],["Sundari","सुंदरी"],["Sundarbans","सुंदरबन"],
    ["Western Ghats","पश्चिमी घाट"],["Northeast India","पूर्वोत्तर भारत"],["Andaman and Nicobar","अंडमान और निकोबार"],
    ["east-coast deltas","पूर्वी तटीय डेल्टा"],["coastal mangroves","तटीय मैंग्रोव"],["central India","मध्य भारत"],["western India","पश्चिमी भारत"],
    ["Himalayan","हिमालयी"],["Himalayas","हिमालय"],["windward","पवनाभिमुख"],["leeward","वर्षाछाया-पक्ष"],
    ["forest structure","वन संरचना"],["forest type","वन प्रकार"],["forest types","वन प्रकार"],["forest cover","वन आवरण"],
    ["species","प्रजातियाँ"],["species identification","प्रजाति पहचान"],["characteristic species","विशिष्ट प्रजातियाँ"],
    ["ebony","आबनूस"],["mahogany","महोगनी"],["rosewood","शीशम"],["rubber","रबर"],["cinchona","सिनकोना"],
    ["teak","सागौन"],["sal","साल"],["shisham","शीशम"],["sandalwood","चंदन"],["khair","खैर"],["palas","पलाश"],
    ["acacia","बबूल"],["babool","बबूल"],["cactus","कैक्टस"],["date palm","खजूर"],["deodar","देवदार"],["fir","फर"],["spruce","स्प्रूस"],["pine","चीड़"],
    ["oak","ओक"],["chestnut","चेस्टनट"],["birch","भोजपत्र"],["juniper","जूनिपर"],["rhododendron","बुरांश"],
    ["wildlife","वन्यजीव"],["habitat","आवास"],["habitats","आवास"],["grassland","घासभूमि"],["grasslands","घासभूमियाँ"],
    ["swampy grasslands","दलदली घासभूमियाँ"],["wetland","आर्द्रभूमि"],["wetlands","आर्द्रभूमियाँ"],["riverine","नदीतटीय"],
    ["Asiatic lion","एशियाई सिंह"],["Gir","गिर"],["one-horned rhinoceros","एक-सींग वाला गैंडा"],["rhinoceros","गैंडा"],
    ["Asian elephant","एशियाई हाथी"],["elephant","हाथी"],["tiger","बाघ"],["camel","ऊँट"],["wild ass","जंगली गधा"],["blackbuck","काला हिरण"],
    ["snow leopard","हिम तेंदुआ"],["yak","याक"],["musk deer","कस्तूरी मृग"],["hangul","हंगुल"],["barasingha","बारहसिंगा"],
    ["gharial","घड़ियाल"],["crocodile","मगरमच्छ"],["reptiles","सरीसृप"],["herbivores","शाकाहारी जीव"],
    ["biodiversity","जैव विविधता"],["genetic diversity","आनुवंशिक विविधता"],["species diversity","प्रजातीय विविधता"],["ecosystem diversity","पारिस्थितिकी तंत्र विविधता"],
    ["habitat loss","आवास हानि"],["biodiversity threats","जैव विविधता के खतरे"],["conservation","संरक्षण"],["biodiversity conservation","जैव विविधता संरक्षण"],
    ["in-situ conservation","स्थल-स्थित संरक्षण"],["ex-situ conservation","बाह्य-स्थल संरक्षण"],["protected area","संरक्षित क्षेत्र"],["protected areas","संरक्षित क्षेत्र"],
    ["national park","राष्ट्रीय उद्यान"],["national parks","राष्ट्रीय उद्यान"],["wildlife sanctuary","वन्यजीव अभयारण्य"],["wildlife sanctuaries","वन्यजीव अभयारण्य"],
    ["biosphere reserve","जैवमंडल आरक्षित क्षेत्र"],["biosphere reserves","जैवमंडल आरक्षित क्षेत्र"],["zoo","चिड़ियाघर"],["botanical garden","वनस्पति उद्यान"],
    ["seed bank","बीज बैंक"],["endangered","संकटग्रस्त"],["extinct","विलुप्त"],["vulnerable","असुरक्षित"],["rare","दुर्लभ"],
    ["community participation","समुदाय की भागीदारी"],["habitat restoration","आवास पुनर्स्थापन"],["restoration","पुनर्स्थापन"],
    ["forest conservation","वन संरक्षण"],["poaching","अवैध शिकार"],["deforestation","वनों की कटाई"],["fragmentation","खंडीकरण"],
    ["rainfall gradient","वर्षा प्रवणता"],["moisture gradient","नमी प्रवणता"],["altitude","ऊँचाई"],["high altitude","अधिक ऊँचाई"],
    ["comparison","तुलना"],["identification","पहचान"],["distribution","वितरण"],["adaptation","अनुकूलन"],["adaptations","अनुकूलन"],
    ["broad leaves","चौड़ी पत्तियाँ"],["small leaves","छोटी पत्तियाँ"],["thorns","कांटे"],["deep roots","गहरी जड़ें"],["thick bark","मोटी छाल"],
    ["dense canopy","घना छत्र"],["multi-layered","बहु-स्तरीय"],["leaf fall","पर्णपात"],["dry season","शुष्क ऋतु"],["wet season","आर्द्र ऋतु"],
    ["hot wet forests","उष्ण आर्द्र वन"],["open forest","खुले वन"],["open forests","खुले वन"],["mixed forest","मिश्रित वन"],["mixed forests","मिश्रित वन"],
    ["animal and habitat","जीव और आवास"],["forest and region","वन और क्षेत्र"],["species and forest","प्रजाति और वन"],
    ["Which","कौन-सा"],["which","कौन-सा"],["What","क्या"],["what","क्या"],["Why","क्यों"],["why","क्यों"],["Where","कहाँ"],["where","कहाँ"],["When","कब"],["when","कब"],["How","कैसे"],["how","कैसे"],
    ["the",""],["and","और"],["or","या"],["is","है"],["are","हैं"],["was","था"],["were","थे"],["does","करता है"],["do","करते हैं"],["did","किया"],["can","सकता है"],["could","सकता था"],["would","होगा"],["should","चाहिए"],["has","है"],["have","हैं"],["had","था"],
    ["with","के साथ"],["from","से"],["into","में"],["for","के लिए"],["of","का"],["to","को"],["in","में"],["on","पर"],["at","पर"],["by","द्वारा"],["as","के रूप में"],["than","की तुलना में"],["that","कि"],["this","यह"],["these","ये"],["those","वे"],
    ["most","सबसे"],["main","मुख्य"],["major","प्रमुख"],["only","केवल"],["correct","सही"],["statement","कथन"],["following","निम्नलिखित"]
  ];
  const pa:[string,string][] = [
    ["natural vegetation","ਕੁਦਰਤੀ ਬਨਸਪਤੀ"],["virgin vegetation","ਅਛੁਤੀ ਕੁਦਰਤੀ ਬਨਸਪਤੀ"],["cultivated vegetation","ਖੇਤੀ ਕੀਤੀ ਬਨਸਪਤੀ"],
    ["flora","ਬਨਸਪਤੀ-ਜਗਤ"],["fauna","ਜੀਵ-ਜਗਤ"],["indigenous","ਦੇਸੀ"],["endemic","ਸਥਾਨਕ"],["exotic","ਵਿਦੇਸ਼ੀ"],
    ["relief","ਭੂ-ਆਕ੍ਰਿਤੀ"],["land controls","ਭੂਮੀ ਨਿਯੰਤਰਣ"],["soil controls","ਮਿੱਟੀ ਨਿਯੰਤਰਣ"],["photoperiod","ਪ੍ਰਕਾਸ਼-ਅਵਧੀ"],
    ["precipitation","ਵਰਖਾ"],["rainfall","ਵਰਖਾ"],["temperature","ਤਾਪਮਾਨ"],["climate","ਜਲਵਾਯੂ"],["moisture","ਨਮੀ"],
    ["tropical evergreen forest","ਉਸ਼ਣਕਟੀਬੰਧੀ ਸਦਾਬਹਾਰ ਜੰਗਲ"],["tropical evergreen forests","ਉਸ਼ਣਕਟੀਬੰਧੀ ਸਦਾਬਹਾਰ ਜੰਗਲ"],
    ["evergreen forest","ਸਦਾਬਹਾਰ ਜੰਗਲ"],["evergreen forests","ਸਦਾਬਹਾਰ ਜੰਗਲ"],["semi-evergreen forest","ਅਰਧ-ਸਦਾਬਹਾਰ ਜੰਗਲ"],["semi-evergreen forests","ਅਰਧ-ਸਦਾਬਹਾਰ ਜੰਗਲ"],
    ["tropical deciduous forest","ਉਸ਼ਣਕਟੀਬੰਧੀ ਪੱਤਝੜ ਜੰਗਲ"],["tropical deciduous forests","ਉਸ਼ਣਕਟੀਬੰਧੀ ਪੱਤਝੜ ਜੰਗਲ"],
    ["moist deciduous forest","ਨਮੀ ਵਾਲੇ ਪੱਤਝੜ ਜੰਗਲ"],["moist deciduous forests","ਨਮੀ ਵਾਲੇ ਪੱਤਝੜ ਜੰਗਲ"],
    ["dry deciduous forest","ਸੁੱਕੇ ਪੱਤਝੜ ਜੰਗਲ"],["dry deciduous forests","ਸੁੱਕੇ ਪੱਤਝੜ ਜੰਗਲ"],
    ["thorn forest","ਕਾਂਟੇਦਾਰ ਜੰਗਲ"],["thorn forests","ਕਾਂਟੇਦਾਰ ਜੰਗਲ"],["thorn and scrub","ਕਾਂਟੇਦਾਰ ਅਤੇ ਝਾੜੀਦਾਰ ਬਨਸਪਤੀ"],["scrub","ਝਾੜੀਦਾਰ ਬਨਸਪਤੀ"],
    ["montane vegetation","ਪਹਾੜੀ ਬਨਸਪਤੀ"],["montane forest","ਪਹਾੜੀ ਜੰਗਲ"],["montane forests","ਪਹਾੜੀ ਜੰਗਲ"],
    ["wet temperate broadleaf forests","ਨਮੀ ਵਾਲੇ ਸਮਸ਼ੀਤੋਸ਼ਣ ਚੌੜੇ-ਪੱਤੇ ਜੰਗਲ"],["temperate conifer forests","ਸਮਸ਼ੀਤੋਸ਼ਣ ਸ਼ੰਕੂਧਾਰੀ ਜੰਗਲ"],
    ["conifer forests","ਸ਼ੰਕੂਧਾਰੀ ਜੰਗਲ"],["alpine vegetation","ਅਲਪਾਈਨ ਬਨਸਪਤੀ"],["alpine meadows","ਅਲਪਾਈਨ ਘਾਹ-ਮੈਦਾਨ"],
    ["tree line","ਰੁੱਖ-ਰੇਖਾ"],["mosses","ਕਾਈ"],["lichens","ਲਾਈਕਨ"],["moss","ਕਾਈ"],["lichen","ਲਾਈਕਨ"],
    ["mangrove vegetation","ਮੈਂਗਰੋਵ ਬਨਸਪਤੀ"],["mangrove forest","ਮੈਂਗਰੋਵ ਜੰਗਲ"],["mangrove forests","ਮੈਂਗਰੋਵ ਜੰਗਲ"],["mangroves","ਮੈਂਗਰੋਵ"],
    ["tidal forest","ਜਵਾਰੀ ਜੰਗਲ"],["tidal forests","ਜਵਾਰੀ ਜੰਗਲ"],["tidal","ਜਵਾਰੀ"],["waterlogging","ਜਲਭਰਾਅ"],["salinity","ਲੂਣਾਪਣ"],
    ["pneumatophores","ਸਾਹ-ਜੜਾਂ"],["stilt roots","ਸਹਾਰਾ-ਜੜਾਂ"],["Sundari","ਸੁੰਦਰੀ"],["Sundarbans","ਸੁੰਦਰਬਨ"],
    ["Western Ghats","ਪੱਛਮੀ ਘਾਟ"],["Northeast India","ਉੱਤਰ-ਪੂਰਬੀ ਭਾਰਤ"],["Andaman and Nicobar","ਅੰਡਮਾਨ ਅਤੇ ਨਿਕੋਬਾਰ"],
    ["east-coast deltas","ਪੂਰਬੀ ਤਟੀ ਡੈਲਟੇ"],["coastal mangroves","ਤਟੀ ਮੈਂਗਰੋਵ"],["central India","ਮੱਧ ਭਾਰਤ"],["western India","ਪੱਛਮੀ ਭਾਰਤ"],
    ["Himalayan","ਹਿਮਾਲਈ"],["Himalayas","ਹਿਮਾਲਿਆ"],["windward","ਪਵਨ-ਮੁਖੀ"],["leeward","ਵਰਖਾ-ਛਾਂ ਪਾਸਾ"],
    ["forest structure","ਜੰਗਲ ਬਣਤਰ"],["forest type","ਜੰਗਲ ਕਿਸਮ"],["forest types","ਜੰਗਲ ਕਿਸਮਾਂ"],["forest cover","ਜੰਗਲ ਆਵਰਨ"],
    ["species","ਪ੍ਰਜਾਤੀਆਂ"],["species identification","ਪ੍ਰਜਾਤੀ ਪਛਾਣ"],["characteristic species","ਖਾਸ ਪ੍ਰਜਾਤੀਆਂ"],
    ["ebony","ਆਬਨੂਸ"],["mahogany","ਮਹੋਗਨੀ"],["rosewood","ਸ਼ੀਸ਼ਮ"],["rubber","ਰਬਰ"],["cinchona","ਸਿਨਕੋਨਾ"],
    ["teak","ਸਾਗਵਾਨ"],["sal","ਸਾਲ"],["shisham","ਸ਼ੀਸ਼ਮ"],["sandalwood","ਚੰਦਨ"],["khair","ਖੈਰ"],["palas","ਪਲਾਸ਼"],
    ["acacia","ਬਬੂਲ"],["babool","ਬਬੂਲ"],["cactus","ਕੈਕਟਸ"],["date palm","ਖਜੂਰ"],["deodar","ਦੇਵਦਾਰ"],["fir","ਫਰ"],["spruce","ਸਪ੍ਰੂਸ"],["pine","ਚੀੜ"],
    ["oak","ਓਕ"],["chestnut","ਚੈਸਟਨਟ"],["birch","ਭੋਜਪੱਤਰ"],["juniper","ਜੂਨੀਪਰ"],["rhododendron","ਬੁਰਾਂਸ਼"],
    ["wildlife","ਜੰਗਲੀ ਜੀਵ"],["habitat","ਆਵਾਸ"],["habitats","ਆਵਾਸ"],["grassland","ਘਾਹ-ਮੈਦਾਨ"],["grasslands","ਘਾਹ-ਮੈਦਾਨ"],["swampy grasslands","ਦਲਦਲੀ ਘਾਹ-ਮੈਦਾਨ"],
    ["wetland","ਆਰਦ੍ਰਭੂਮੀ"],["wetlands","ਆਰਦ੍ਰਭੂਮੀਆਂ"],["riverine","ਨਦੀ-ਕਿਨਾਰੇ"],["Asiatic lion","ਏਸ਼ੀਆਈ ਸ਼ੇਰ"],["Gir","ਗਿਰ"],
    ["one-horned rhinoceros","ਇੱਕ-ਸਿੰਗ ਵਾਲਾ ਗੈਂਡਾ"],["rhinoceros","ਗੈਂਡਾ"],["Asian elephant","ਏਸ਼ੀਆਈ ਹਾਥੀ"],["elephant","ਹਾਥੀ"],["tiger","ਬਾਘ"],
    ["camel","ਊਠ"],["wild ass","ਜੰਗਲੀ ਖੋਤਾ"],["blackbuck","ਕਾਲਾ ਹਿਰਨ"],["snow leopard","ਬਰਫ਼ੀਲਾ ਤਿੰਦੂਆ"],["yak","ਯਾਕ"],["musk deer","ਕਸਤੂਰੀ ਹਿਰਨ"],["hangul","ਹੰਗੁਲ"],["barasingha","ਬਾਰਾਂਸਿੰਗਾ"],
    ["gharial","ਘੜਿਆਲ"],["crocodile","ਮਗਰਮੱਛ"],["reptiles","ਸਰੀਸ੍ਰਪ"],["herbivores","ਸ਼ਾਕਾਹਾਰੀ ਜੀਵ"],
    ["biodiversity","ਜੈਵ-ਵਿਭਿੰਨਤਾ"],["genetic diversity","ਆਨੁਵੰਸ਼ਿਕ ਵਿਭਿੰਨਤਾ"],["species diversity","ਪ੍ਰਜਾਤੀ ਵਿਭਿੰਨਤਾ"],["ecosystem diversity","ਪਰਿਸਥਿਤਕੀ ਤੰਤਰ ਵਿਭਿੰਨਤਾ"],
    ["habitat loss","ਆਵਾਸ ਹਾਨੀ"],["biodiversity threats","ਜੈਵ-ਵਿਭਿੰਨਤਾ ਲਈ ਖਤਰੇ"],["conservation","ਸੰਰੱਖਣ"],["biodiversity conservation","ਜੈਵ-ਵਿਭਿੰਨਤਾ ਸੰਰੱਖਣ"],
    ["in-situ conservation","ਥਾਂ-ਉੱਤੇ ਸੰਰੱਖਣ"],["ex-situ conservation","ਥਾਂ-ਤੋਂ-ਬਾਹਰ ਸੰਰੱਖਣ"],["protected area","ਸੁਰੱਖਿਅਤ ਖੇਤਰ"],["protected areas","ਸੁਰੱਖਿਅਤ ਖੇਤਰ"],
    ["national park","ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ"],["national parks","ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ"],["wildlife sanctuary","ਜੰਗਲੀ ਜੀਵ ਅਭਿਆਰਣ"],["wildlife sanctuaries","ਜੰਗਲੀ ਜੀਵ ਅਭਿਆਰਣ"],
    ["biosphere reserve","ਜੈਵਮੰਡਲ ਰਾਖਵਾਂ ਖੇਤਰ"],["biosphere reserves","ਜੈਵਮੰਡਲ ਰਾਖਵੇਂ ਖੇਤਰ"],["zoo","ਚਿੜਿਆਘਰ"],["botanical garden","ਬੋਟੈਨਿਕਲ ਬਾਗ਼"],
    ["seed bank","ਬੀਜ ਬੈਂਕ"],["endangered","ਸੰਕਟਗ੍ਰਸਤ"],["extinct","ਵਿਲੁਪਤ"],["vulnerable","ਅਸੁਰੱਖਿਅਤ"],["rare","ਦੁਲਭ"],
    ["community participation","ਸਮੁਦਾਇਕ ਭਾਗੀਦਾਰੀ"],["habitat restoration","ਆਵਾਸ ਮੁੜ-ਬਹਾਲੀ"],["restoration","ਮੁੜ-ਬਹਾਲੀ"],
    ["forest conservation","ਜੰਗਲ ਸੰਰੱਖਣ"],["poaching","ਗੈਰਕਾਨੂੰਨੀ ਸ਼ਿਕਾਰ"],["deforestation","ਜੰਗਲ ਕਟਾਈ"],["fragmentation","ਖੰਡਨ"],
    ["rainfall gradient","ਵਰਖਾ ਢਲਾਣ"],["moisture gradient","ਨਮੀ ਢਲਾਣ"],["altitude","ਉਚਾਈ"],["high altitude","ਵੱਧ ਉਚਾਈ"],
    ["comparison","ਤੁਲਨਾ"],["identification","ਪਛਾਣ"],["distribution","ਵੰਡ"],["adaptation","ਅਨੁਕੂਲਨ"],["adaptations","ਅਨੁਕੂਲਨ"],
    ["broad leaves","ਚੌੜੇ ਪੱਤੇ"],["small leaves","ਛੋਟੇ ਪੱਤੇ"],["thorns","ਕਾਂਟੇ"],["deep roots","ਡੂੰਘੀਆਂ ਜੜਾਂ"],["thick bark","ਮੋਟੀ ਛਾਲ"],
    ["dense canopy","ਘਣਾ ਛੱਤਰ"],["multi-layered","ਬਹੁ-ਪਰਤੀ"],["leaf fall","ਪੱਤਝੜ"],["dry season","ਸੁੱਕਾ ਮੌਸਮ"],["wet season","ਨਮੀ ਵਾਲਾ ਮੌਸਮ"],
    ["hot wet forests","ਗਰਮ ਨਮੀ ਵਾਲੇ ਜੰਗਲ"],["open forest","ਖੁੱਲ੍ਹਾ ਜੰਗਲ"],["open forests","ਖੁੱਲ੍ਹੇ ਜੰਗਲ"],["mixed forest","ਮਿਸ਼ਰਤ ਜੰਗਲ"],["mixed forests","ਮਿਸ਼ਰਤ ਜੰਗਲ"],
    ["animal and habitat","ਜੀਵ ਅਤੇ ਆਵਾਸ"],["forest and region","ਜੰਗਲ ਅਤੇ ਖੇਤਰ"],["species and forest","ਪ੍ਰਜਾਤੀ ਅਤੇ ਜੰਗਲ"],
    ["Which","ਕਿਹੜਾ"],["which","ਕਿਹੜਾ"],["What","ਕੀ"],["what","ਕੀ"],["Why","ਕਿਉਂ"],["why","ਕਿਉਂ"],["Where","ਕਿੱਥੇ"],["where","ਕਿੱਥੇ"],["When","ਕਦੋਂ"],["when","ਕਦੋਂ"],["How","ਕਿਵੇਂ"],["how","ਕਿਵੇਂ"],
    ["the",""],["and","ਅਤੇ"],["or","ਜਾਂ"],["is","ਹੈ"],["are","ਹਨ"],["was","ਸੀ"],["were","ਸਨ"],["does","ਕਰਦਾ ਹੈ"],["do","ਕਰਦੇ ਹਨ"],["did","ਕੀਤਾ"],["can","ਸਕਦਾ ਹੈ"],["could","ਸਕਦਾ ਸੀ"],["would","ਹੋਵੇਗਾ"],["should","ਚਾਹੀਦਾ ਹੈ"],["has","ਹੈ"],["have","ਹਨ"],["had","ਸੀ"],
    ["with","ਨਾਲ"],["from","ਤੋਂ"],["into","ਵਿੱਚ"],["for","ਲਈ"],["of","ਦਾ"],["to","ਨੂੰ"],["in","ਵਿੱਚ"],["on","ਉੱਤੇ"],["at","ਉੱਤੇ"],["by","ਦੁਆਰਾ"],["as","ਵਜੋਂ"],["than","ਨਾਲੋਂ"],["that","ਕਿ"],["this","ਇਹ"],["these","ਇਹ"],["those","ਉਹ"],
    ["most","ਸਭ ਤੋਂ"],["main","ਮੁੱਖ"],["major","ਮੁੱਖ"],["only","ਕੇਵਲ"],["correct","ਸਹੀ"],["statement","ਕਥਨ"],["following","ਹੇਠ ਲਿਖੇ"]
  ];
  let out=text;
  const pairs=language==="hi"?hi:pa;
  for(const [from,to] of pairs.sort((a,b)=>b[0].length-a[0].length)){
    out=out.replace(new RegExp("(?<![A-Za-z])"+regexEscape(from)+"(?![A-Za-z])","gi"),to);
  }
  return out.replace(/\s{2,}/g," ").replace(/\s+([,.;:?!])/g,"$1").trim();
}

function localizeGeoVegBulkV1(question:CanonicalQuestion, language:"hi"|"pa") {
  if(!/^GEO-VEG-001-CP0(?:0[1-9]|1[0-2])-Q/.test(question.questionId)) return null;
  const local=(source:string)=>polishGeoVegBulkTextV1(localizeText(source,language),language);
  const stemBase=localizeNaturalStem(question.stem,language,"GEO-VEG-001") ?? localizeText(question.stem,language);
  const stem=polishGeoVegBulkTextV1(stemBase,language);
  const options=Object.freeze(question.options.map(local));
  const canonicalAnswer=options[question.correctIndex]!;
  const explanation=local(question.explanation);
  return Object.freeze({stem,options,canonicalAnswer,explanation});
}

export function localizeIndianGeoQuestionV1(
  question: CanonicalQuestion,
  language: IndianGeoLocalizationLanguageV1,
  packageId?: string,
): IndianGeoLocalizedQuestionV1 {
  if (language === "en") {
    return Object.freeze({
      stem: question.stem,
      options: Object.freeze([...question.options]),
      canonicalAnswer: question.canonicalAnswer,
      explanation: question.explanation,
    });
  }

  if (packageId === "GEO-TRN-001") {
    const bulk = localizeGeoTrnBulkV1(question, language);
    if (bulk) return bulk;
  }

  if (packageId === "GEO-VEG-001") {
    const bulk = localizeGeoVegBulkV1(question, language);
    if (bulk) return bulk;
  }

  if (packageId === "GEO-SOI-001") {
    const approved =
      localizeGeoSoi001ExactCp001PartA(question, language) ??
      localizeGeoSoi001ExactCp001PartB(question, language) ??
      localizeGeoSoi001ExactCp001PartC(question, language) ??
      localizeGeoSoi001ExactCp002PartA(question, language) ??
      localizeGeoSoi001ExactCp002PartB(question, language) ??
      localizeGeoSoi001ExactCp002PartC(question, language) ??
      localizeGeoSoi001ExactCp003PartA(question, language) ??
      localizeGeoSoi001ExactCp003PartB(question, language) ??
      localizeGeoSoi001ExactCp003PartC(question, language);
    if (approved) return approved;
    const bulk = localizeGeoSoiBulkCp004Cp008V1(question, language);
    if (bulk) return bulk;
  }

  if (packageId === "GEO-WAT-001") {
    const approvedCp001 = WATER_CP001_EXACT[language].get(question.questionId);
    if (approvedCp001) {
      return Object.freeze({
        stem: approvedCp001.stem,
        options: Object.freeze([...approvedCp001.options]),
        canonicalAnswer: approvedCp001.canonicalAnswer,
        explanation: approvedCp001.explanation,
      });
    }
    const approved =
      localizeGeoWat001ExactCp002(question, language) ??
      localizeGeoWat001ExactCp003(question, language) ??
      localizeGeoWat001ExactCp004(question, language);
    if (approved) return approved;
  }

  if (packageId === "GEO-LND-001") {
    const approved =
      localizeGeoLnd001ExactCp001(question, language) ??
      localizeGeoLnd001ExactCp002(question, language) ??
      localizeGeoLnd001ExactCp003(question, language);
    if (approved) return approved;
  }

  if (packageId === "GEO-HAZ-001") {
    const approved =
      localizeGeoHaz001ExactCp001(question, language) ??
      localizeGeoHaz001ExactCp002(question, language) ??
      localizeGeoHaz001ExactCp003(question, language) ??
      localizeGeoHaz001ExactCp004(question, language);
    if (approved) return approved;
  }

  if (packageId === "GEO-PLN-001") {
    const approved =
      localizeGeoPln001ExactCp001(question, language) ??
      localizeGeoPln001ExactCp002(question, language) ??
      localizeGeoPln001ExactCp003(question, language);
    if (approved) return approved;
  }

  if (packageId === "GEO-POP-001") {
    const approved =
      localizeGeoPop001ExactCp001PartA(question, language) ??
      localizeGeoPop001ExactCp001PartB(question, language) ??
      localizeGeoPop001ExactCp002PartA(question, language) ??
      localizeGeoPop001ExactCp002PartB(question, language) ??
      localizeGeoPop001ExactCp002PartC(question, language) ??
      localizeGeoPop001ExactCp002PartD(question, language) ??
      localizeGeoPop001ExactCp003PartA(question, language) ??
      localizeGeoPop001ExactCp003PartB(question, language) ??
      localizeGeoPop001ExactCp003PartC(question, language) ??
      localizeGeoPop001ExactCp004PartA(question, language) ??
      localizeGeoPop001ExactCp004PartB(question, language) ??
      localizeGeoPop001ExactCp004PartC(question, language) ??
      localizeGeoPop001ExactCp005PartA(question, language) ??
      localizeGeoPop001ExactCp005PartB(question, language) ??
      localizeGeoPop001ExactCp005PartC(question, language);
    if (approved) return approved;
  }

  const options = Object.freeze(question.options.map((option) => localizeText(option, language)));
  const canonicalAnswer = options[question.correctIndex]!;
  const stem = localizeNaturalStem(question.stem, language, packageId) ?? localizeText(question.stem, language);
  const explanation = cleanExplanation(question.explanation, canonicalAnswer, language);
  return Object.freeze({ stem, options, canonicalAnswer, explanation });
}

export function auditIndianGeoLocalizationV1(
  questions: readonly CanonicalQuestion[],
  packageId?: string,
) {
  const issues: string[] = [];
  let hindiStemResidueCount = 0;
  let punjabiStemResidueCount = 0;
  let hindiOptionResidueCount = 0;
  let punjabiOptionResidueCount = 0;
  let genericExplanationFallbackCount = 0;
  let mixedScriptCount = 0;

  for (const q of questions) {
    for (const language of ["hi","pa"] as const) {
      const localized = localizeIndianGeoQuestionV1(q, language, packageId);
      if (!localized.stem.trim() || !localized.explanation.trim()) issues.push(`${q.questionId}:${language}:EMPTY`);
      if (localized.options.length !== 4 || new Set(localized.options).size !== 4) issues.push(`${q.questionId}:${language}:OPTIONS`);
      if (localized.options[q.correctIndex] !== localized.canonicalAnswer) issues.push(`${q.questionId}:${language}:ANSWER`);
      if (language === "hi" && !/[\u0900-\u097F]/.test(localized.stem)) issues.push(`${q.questionId}:hi:NO_DEVANAGARI`);
      if (language === "pa" && !/[\u0A00-\u0A7F]/.test(localized.stem)) issues.push(`${q.questionId}:pa:NO_GURMUKHI`);

      const stemResidue = residueCount(localized.stem);
      const optionResidue = localized.options.reduce((sum, option) => sum + residueCount(option), 0);
      if (language === "hi") {
        hindiStemResidueCount += stemResidue;
        hindiOptionResidueCount += optionResidue;
        if (GURMUKHI_SCRIPT.test(localized.stem + " " + localized.options.join(" ") + " " + localized.explanation)) mixedScriptCount += 1;
      } else {
        punjabiStemResidueCount += stemResidue;
        punjabiOptionResidueCount += optionResidue;
        if (DEVANAGARI_SCRIPT.test(localized.stem + " " + localized.options.join(" ") + " " + localized.explanation)) mixedScriptCount += 1;
      }

      if (isGenericExplanationFallback(localized.explanation, language)) genericExplanationFallbackCount += 1;
    }
  }

  const structuralValid = issues.length === 0;
  const qualityReadyForFreeze =
    structuralValid &&
    hindiStemResidueCount === 0 &&
    punjabiStemResidueCount === 0 &&
    hindiOptionResidueCount === 0 &&
    punjabiOptionResidueCount === 0 &&
    genericExplanationFallbackCount === 0 &&
    mixedScriptCount === 0;

  return Object.freeze({
    valid: structuralValid,
    structuralValid,
    qualityReadyForFreeze,
    issues: Object.freeze(issues),
    canonicalQuestionCount: questions.length,
    localizedVersionCount: questions.length * 3,
    hindiResidueCount: hindiStemResidueCount,
    punjabiResidueCount: punjabiStemResidueCount,
    hindiStemResidueCount,
    punjabiStemResidueCount,
    hindiOptionResidueCount,
    punjabiOptionResidueCount,
    genericExplanationFallbackCount,
    mixedScriptCount,
    reviewRequired: !qualityReadyForFreeze,
  });
}
