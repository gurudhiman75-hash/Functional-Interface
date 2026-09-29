import {
  GEO_WAT_001_CP001_HINDI_LOCALIZATION_V1,
  GEO_WAT_001_CP001_PUNJABI_LOCALIZATION_V1,
} from "./water-resources/geo-wat-001-localization-cp001-v1";

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
    "rice":"चावल","wheat":"गेहूँ","maize":"मक्का","millets":"मोटे अनाज","cotton":"कपास","jute":"जूट","sugarcane":"गन्ना",
    "tea":"चाय","coffee":"कॉफी","rubber":"रबर","pulses":"दलहन","oilseeds":"तिलहन","Kharif":"खरीफ","Rabi":"रबी","Zaid":"जायद",
    "irrigation":"सिंचाई","groundwater":"भूजल","canal irrigation":"नहर सिंचाई","tank irrigation":"टैंक सिंचाई",
    "drip irrigation":"ड्रिप सिंचाई","sprinkler irrigation":"स्प्रिंकलर सिंचाई","rainwater harvesting":"वर्षा जल संचयन",
    "watershed management":"जलागम प्रबंधन","water scarcity":"जल की कमी","water conservation":"जल संरक्षण",
    "hydroelectric power":"जलविद्युत","multipurpose project":"बहुउद्देशीय परियोजना","river-valley project":"नदी-घाटी परियोजना",
    "Bhakra-Nangal":"भाखड़ा-नांगल","Hirakud":"हीराकुंड","Tehri":"टिहरी","Sardar Sarovar":"सरदार सरोवर",
    "Nagarjuna Sagar":"नागार्जुन सागर","Damodar Valley Project":"दामोदर घाटी परियोजना",
    "iron and steel industry":"लौह-इस्पात उद्योग","cotton textile industry":"सूती वस्त्र उद्योग","jute industry":"जूट उद्योग",
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
    "evergreen forest":"सदाबहार वन","deciduous forest":"पर्णपाती वन","thorn forest":"कांटेदार वन","mangrove forest":"मैंग्रोव वन",
    "wildlife sanctuary":"वन्यजीव अभयारण्य","national park":"राष्ट्रीय उद्यान","biosphere reserve":"जैवमंडल आरक्षित क्षेत्र",
    "biodiversity":"जैव विविधता","natural vegetation":"प्राकृतिक वनस्पति","forest":"वन","forests":"वन",
    "drainage basin":"अपवाह बेसिन","river basin":"नदी बेसिन","tributary":"सहायक नदी","delta":"डेल्टा","estuary":"मुहाना",
    "perennial river":"बारहमासी नदी","peninsular river":"प्रायद्वीपीय नदी","Himalayan river":"हिमालयी नदी",
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
    "flood":"ਹੜ੍ਹ","earthquake":"ਭੂਚਾਲ","landslide":"ਭੂਸਖਲਨ","tsunami":"ਸੁਨਾਮੀ","disaster management":"ਆਪਦਾ ਪ੍ਰਬੰਧਨ",
    "alluvial soil":"ਜਲੋੜ ਮਿੱਟੀ","black soil":"ਕਾਲੀ ਮਿੱਟੀ","red soil":"ਲਾਲ ਮਿੱਟੀ","laterite soil":"ਲੇਟਰਾਈਟ ਮਿੱਟੀ",
    "arid soil":"ਸੁੱਕੀ ਮਿੱਟੀ","forest soil":"ਜੰਗਲੀ ਮਿੱਟੀ","soil erosion":"ਮਿੱਟੀ ਕਟਾਅ","soil conservation":"ਮਿੱਟੀ ਸੰਭਾਲ",
    "rice":"ਚੌਲ","wheat":"ਕਣਕ","maize":"ਮੱਕੀ","millets":"ਮੋਟੇ ਅਨਾਜ","cotton":"ਕਪਾਹ","jute":"ਜੂਟ","sugarcane":"ਗੰਨਾ",
    "tea":"ਚਾਹ","coffee":"ਕੌਫੀ","rubber":"ਰਬਰ","pulses":"ਦਾਲਾਂ","oilseeds":"ਤਿਲਹਨ","Kharif":"ਖਰੀਫ","Rabi":"ਰਬੀ","Zaid":"ਜ਼ਾਇਦ",
    "irrigation":"ਸਿੰਚਾਈ","groundwater":"ਭੂਜਲ","canal irrigation":"ਨਹਿਰੀ ਸਿੰਚਾਈ","tank irrigation":"ਟੈਂਕ ਸਿੰਚਾਈ",
    "drip irrigation":"ਡ੍ਰਿਪ ਸਿੰਚਾਈ","sprinkler irrigation":"ਸਪ੍ਰਿੰਕਲਰ ਸਿੰਚਾਈ","rainwater harvesting":"ਵਰਖਾ ਜਲ ਸੰਭਾਲ",
    "watershed management":"ਜਲਾਗਮ ਪ੍ਰਬੰਧਨ","water scarcity":"ਪਾਣੀ ਦੀ ਘਾਟ","water conservation":"ਪਾਣੀ ਸੰਭਾਲ",
    "hydroelectric power":"ਜਲ-ਬਿਜਲੀ","multipurpose project":"ਬਹੁ-ਉਦੇਸ਼ੀ ਪਰਿਯੋਜਨਾ","river-valley project":"ਨਦੀ-ਘਾਟੀ ਪਰਿਯੋਜਨਾ",
    "Bhakra-Nangal":"ਭਾਖੜਾ-ਨੰਗਲ","Hirakud":"ਹੀਰਾਕੁਡ","Tehri":"ਟਿਹਰੀ","Sardar Sarovar":"ਸਰਦਾਰ ਸਰੋਵਰ",
    "Nagarjuna Sagar":"ਨਾਗਾਰਜੁਨ ਸਾਗਰ","Damodar Valley Project":"ਦਾਮੋਦਰ ਘਾਟੀ ਪਰਿਯੋਜਨਾ",
    "iron and steel industry":"ਲੋਹਾ-ਇਸਪਾਤ ਉਦਯੋਗ","cotton textile industry":"ਸੂਤੀ ਕਪੜਾ ਉਦਯੋਗ","jute industry":"ਜੂਟ ਉਦਯੋਗ",
    "sugar industry":"ਚੀਨੀ ਉਦਯੋਗ","information technology":"ਸੂਚਨਾ ਤਕਨਾਲੋਜੀ","petrochemical industry":"ਪੈਟਰੋ-ਰਸਾਇਣ ਉਦਯੋਗ",
    "industrial location":"ਉਦਯੋਗਿਕ ਟਿਕਾਣਾ","raw material":"ਕੱਚਾ ਮਾਲ","market":"ਬਾਜ਼ਾਰ","power supply":"ਬਿਜਲੀ ਸਪਲਾਈ",
    "railway":"ਰੇਲਮਾਰਗ","railways":"ਰੇਲਮਾਰਗ","road transport":"ਸੜਕ ਆਵਾਜਾਈ","national highway":"ਰਾਸ਼ਟਰੀ ਰਾਜਮਾਰਗ",
    "inland waterways":"ਅੰਦਰੂਨੀ ਜਲਮਾਰਗ","port":"ਬੰਦਰਗਾਹ","ports":"ਬੰਦਰਗਾਹ","air transport":"ਹਵਾਈ ਆਵਾਜਾਈ",
    "Golden Quadrilateral":"ਸੁਵਰਨ ਚਤੁਰਭੁਜ","North-South Corridor":"ਉੱਤਰ-ਦੱਖਣ ਗਲਿਆਰਾ","East-West Corridor":"ਪੂਰਬ-ਪੱਛਮ ਗਲਿਆਰਾ",
    "population density":"ਆਬਾਦੀ ਘਣਤਾ","population distribution":"ਆਬਾਦੀ ਵੰਡ","population growth":"ਆਬਾਦੀ ਵਾਧਾ",
    "sex ratio":"ਲਿੰਗ ਅਨੁਪਾਤ","literacy":"ਸਾਖਰਤਾ","urbanisation":"ਸ਼ਹਿਰੀਕਰਨ","migration":"ਪ੍ਰਵਾਸ","settlement":"ਬਸਤੀ",
    "rural settlement":"ਪਿੰਡੂ ਬਸਤੀ","urban settlement":"ਸ਼ਹਿਰੀ ਬਸਤੀ","census":"ਜਨਗਣਨਾ",
    "land degradation":"ਜ਼ਮੀਨ ਖ਼ਰਾਬੀ","land use":"ਜ਼ਮੀਨ ਦੀ ਵਰਤੋਂ","wasteland":"ਬੰਜਰ ਜ਼ਮੀਨ","forest cover":"ਜੰਗਲ ਕਵਰ",
    "regional planning":"ਖੇਤਰੀ ਯੋਜਨਾ","planning region":"ਯੋਜਨਾ ਖੇਤਰ","resource planning":"ਸਰੋਤ ਯੋਜਨਾ",
    "neighbouring country":"ਪੜੋਸੀ ਦੇਸ਼","international boundary":"ਅੰਤਰਰਾਸ਼ਟਰੀ ਸਰਹੱਦ","coastline":"ਸਮੁੰਦਰੀ ਤਟਰੇਖਾ",
    "latitudinal extent":"ਅਕਸ਼ਾਂਸ਼ੀ ਫੈਲਾਅ","longitudinal extent":"ਦੇਸ਼ਾਂਤਰ ਫੈਲਾਅ","Standard Meridian":"ਮਿਆਰੀ ਮੱਧਿਆਹਨ ਰੇਖਾ",
    "Tropic of Cancer":"ਕਰਕ ਰੇਖਾ","Indian Standard Time":"ਭਾਰਤੀ ਮਿਆਰੀ ਸਮਾਂ",
    "evergreen forest":"ਸਦਾਬਹਾਰ ਜੰਗਲ","deciduous forest":"ਪੱਤਝੜੀ ਜੰਗਲ","thorn forest":"ਕਾਂਟੇਦਾਰ ਜੰਗਲ","mangrove forest":"ਮੈਂਗਰੋਵ ਜੰਗਲ",
    "wildlife sanctuary":"ਜੰਗਲੀ ਜੀਵ ਅਭਿਆਰਣ","national park":"ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ","biosphere reserve":"ਜੀਵਮੰਡਲ ਰਾਖਵਾਂ ਖੇਤਰ",
    "biodiversity":"ਜੈਵ ਵਿਭਿੰਨਤਾ","natural vegetation":"ਕੁਦਰਤੀ ਬਨਸਪਤੀ","forest":"ਜੰਗਲ","forests":"ਜੰਗਲ",
    "drainage basin":"ਨਿਕਾਸੀ ਬੇਸਿਨ","river basin":"ਨਦੀ ਬੇਸਿਨ","tributary":"ਸਹਾਇਕ ਨਦੀ","delta":"ਡੈਲਟਾ","estuary":"ਮੁਹਾਨਾ",
    "perennial river":"ਸਦਾ ਵਗਣ ਵਾਲੀ ਨਦੀ","peninsular river":"ਪ੍ਰਾਇਦੀਪੀ ਨਦੀ","Himalayan river":"ਹਿਮਾਲਈ ਨਦੀ",
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
    ["Which state","ਕਿਹੜਾ ਰਾਜ"],["Which river","ਕਿਹੜੀ ਨਦੀ"],["Which project","ਕਿਹੜੀ ਪਰਿਯੋਜਨਾ"],
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
    "soil":"ਮਿੱਟੀ","crop":"ਫਸਲ","crops":"ਫਸਲਾਂ","agriculture":"ਖੇਤੀਬਾੜੀ","industry":"ਉਦਯੋਗ","industries":"ਉਦਯੋਗ","project":"ਪਰਿਯੋਜਨਾ","dam":"ਬੰਨ੍ਹ",
    "water":"ਪਾਣੀ","groundwater":"ਭੂਜਲ","rain":"ਵਰਖਾ","forest":"ਜੰਗਲ","population":"ਆਬਾਦੀ","density":"ਘਣਤਾ","transport":"ਆਵਾਜਾਈ",
    "road":"ਸੜਕ","roads":"ਸੜਕਾਂ","rail":"ਰੇਲ","route":"ਰਸਤਾ","routes":"ਰਸਤੇ","port":"ਬੰਦਰਗਾਹ","airport":"ਹਵਾਈ ਅੱਡਾ","city":"ਸ਼ਹਿਰ","cities":"ਸ਼ਹਿਰ",
    "north":"ਉੱਤਰ","south":"ਦੱਖਣ","east":"ਪੂਰਬ","west":"ਪੱਛਮ","northern":"ਉੱਤਰੀ","southern":"ਦੱਖਣੀ","eastern":"ਪੂਰਬੀ","western":"ਪੱਛਮੀ",
    "high":"ਉੱਚ","low":"ਘੱਟ","higher":"ਵੱਧ","lower":"ਘੱਟ","major":"ਮੁੱਖ","main":"ਮੁੱਖ","large":"ਵੱਡਾ","small":"ਛੋਟਾ","important":"ਮਹੱਤਵਪੂਰਨ",
    "season":"ਮੌਸਮ","summer":"ਗਰਮੀ","winter":"ਸਰਦੀ","annual":"ਸਾਲਾਨਾ","seasonal":"ਮੌਸਮੀ","climate":"ਜਲਵਾਯੂ","weather":"ਮੌਸਮ",
    "source":"ਸਰੋਤ","mouth":"ਮੁਹਾਨਾ","basin":"ਬੇਸਿਨ","drainage":"ਨਿਕਾਸੀ","flow":"ਵਹਾਅ","flows":"ਵਗਦੀ ਹੈ","origin":"ਉਦਗਮ","tributaries":"ਸਹਾਇਕ ਨਦੀਆਂ",
    "production":"ਉਤਪਾਦਨ","producer":"ਉਤਪਾਦਕ","cultivation":"ਖੇਤੀ","grown":"ਉਗਾਈ ਜਾਂਦੀ ਹੈ","growth":"ਵਾਧਾ","distribution":"ਵੰਡ",
    "located":"ਸਥਿਤ","found":"ਮਿਲਦਾ","linked":"ਜੁੜਿਆ","known":"ਜਾਣਿਆ","called":"ਕਿਹਾ","used":"ਵਰਤੋਂ","uses":"ਵਰਤਦਾ ਹੈ","provides":"ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ",
    "supply":"ਸਪਲਾਈ","power":"ਬਿਜਲੀ","floods":"ਹੜ੍ਹ","scarcity":"ਘਾਟ","conservation":"ਸੰਭਾਲ","erosion":"ਕਟਾਅ","degradation":"ਖ਼ਰਾਬੀ",
    "India":"ਭਾਰਤ","Indian":"ਭਾਰਤੀ","area":"ਖੇਤਰ","areas":"ਖੇਤਰ","system":"ਪ੍ਰਣਾਲੀ","systems":"ਪ੍ਰਣਾਲੀਆਂ","zone":"ਖੇਤਰ","zones":"ਖੇਤਰ",
  },
};

function replaceTerms(text: string, language: "hi"|"pa") {
  let out = text;
  for (const [from,to] of Object.entries(TERMS[language]).sort((a,b)=>b[0].length-a[0].length)) {
    out = out.split(from).join(to);
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

const COMMON_ENGLISH = /\b(?:which|what|why|where|when|how|the|and|or|is|are|was|were|does|do|did|can|could|would|should|has|have|had|with|from|into|for|of|to|in|on|at|by|as|than|that|this|these|those|most|main|major|only|correct|statement|following)\b/gi;

function residueCount(text: string) {
  return (text.match(COMMON_ENGLISH) ?? []).length;
}

function cleanExplanation(source: string, answer: string, language: "hi"|"pa") {
  const translated = localizeText(source, language);
  if (residueCount(translated) <= 3) return translated;
  return language === "hi"
    ? `सही उत्तर ${answer} है। यह भारतीय भूगोल के संबंधित तथ्य को सही रूप से बताता है।`
    : `ਸਹੀ ਉੱਤਰ ${answer} ਹੈ। ਇਹ ਭਾਰਤੀ ਭੂਗੋਲ ਦੇ ਸੰਬੰਧਿਤ ਤੱਥ ਨੂੰ ਸਹੀ ਤਰ੍ਹਾਂ ਦਰਸਾਉਂਦਾ ਹੈ।`;
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

  if (packageId === "GEO-WAT-001") {
    const approved = WATER_CP001_EXACT[language].get(question.questionId);
    if (approved) {
      return Object.freeze({
        stem: approved.stem,
        options: Object.freeze([...approved.options]),
        canonicalAnswer: approved.canonicalAnswer,
        explanation: approved.explanation,
      });
    }
  }

  const options = Object.freeze(question.options.map((option) => localizeText(option, language)));
  const canonicalAnswer = options[question.correctIndex]!;
  const stem = localizeText(question.stem, language);
  const explanation = cleanExplanation(question.explanation, canonicalAnswer, language);
  return Object.freeze({ stem, options, canonicalAnswer, explanation });
}

export function auditIndianGeoLocalizationV1(
  questions: readonly CanonicalQuestion[],
  packageId?: string,
) {
  const issues: string[] = [];
  let hindiResidueCount = 0;
  let punjabiResidueCount = 0;
  for (const q of questions) {
    for (const language of ["hi","pa"] as const) {
      const localized = localizeIndianGeoQuestionV1(q, language, packageId);
      if (!localized.stem.trim() || !localized.explanation.trim()) issues.push(`${q.questionId}:${language}:EMPTY`);
      if (localized.options.length !== 4 || new Set(localized.options).size !== 4) issues.push(`${q.questionId}:${language}:OPTIONS`);
      if (localized.options[q.correctIndex] !== localized.canonicalAnswer) issues.push(`${q.questionId}:${language}:ANSWER`);
      if (language === "hi" && !/[\u0900-\u097F]/.test(localized.stem)) issues.push(`${q.questionId}:hi:NO_DEVANAGARI`);
      if (language === "pa" && !/[\u0A00-\u0A7F]/.test(localized.stem)) issues.push(`${q.questionId}:pa:NO_GURMUKHI`);
      const residue = residueCount(localized.stem);
      if (language === "hi") hindiResidueCount += residue;
      else punjabiResidueCount += residue;
    }
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    canonicalQuestionCount: questions.length,
    localizedVersionCount: questions.length * 3,
    hindiResidueCount,
    punjabiResidueCount,
    reviewRequired: true,
  });
}
