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
    "rice":"चावल","wheat":"गेहूँ","maize":"मक्का","millets":"मोटे अनाज","cotton":"कपास","jute":"जूट","sugarcane":"गन्ना","groundnut":"मूंगफली","mustard":"सरसों","soybean":"सोयाबीन","jowar":"ज्वार","bajra":"बाजरा","gram":"चना",
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
    "flood":"ਹੜ੍ਹ","earthquake":"ਭੂਚਾਲ","landslide":"ਭੂਸਖਲਨ","tsunami":"ਸੁਨਾਮੀ","disaster management":"ਆਪਦਾ ਪ੍ਰਬੰਧਨ",
    "alluvial soil":"ਜਲੋੜ ਮਿੱਟੀ","black soil":"ਕਾਲੀ ਮਿੱਟੀ","red soil":"ਲਾਲ ਮਿੱਟੀ","laterite soil":"ਲੇਟਰਾਈਟ ਮਿੱਟੀ",
    "arid soil":"ਸੁੱਕੀ ਮਿੱਟੀ","forest soil":"ਜੰਗਲੀ ਮਿੱਟੀ","soil erosion":"ਮਿੱਟੀ ਕਟਾਅ","soil conservation":"ਮਿੱਟੀ ਸੰਭਾਲ",
    "rice":"ਝੋਨਾ","wheat":"ਕਣਕ","maize":"ਮੱਕੀ","millets":"ਮੋਟੇ ਅਨਾਜ","cotton":"ਕਪਾਹ","jute":"ਜੂਟ","sugarcane":"ਕਮਾਦ","groundnut":"ਮੂੰਗਫ਼ਲੀ","mustard":"ਸਰ੍ਹੋਂ","soybean":"ਸੋਇਆਬੀਨ","jowar":"ਜੂਆਰ","bajra":"ਬਾਜਰਾ","gram":"ਛੋਲੇ",
    "tea":"ਚਾਹ","coffee":"ਕੌਫੀ","rubber":"ਰਬਰ","pulses":"ਦਾਲਾਂ","oilseeds":"ਤੇਲ ਬੀਜ ਫ਼ਸਲਾਂ","Kharif":"ਖਰੀਫ","Rabi":"ਰਬੀ","Zaid":"ਜ਼ਾਇਦ",
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
    "evergreen forest":"ਸਦਾਬਹਾਰ ਜੰਗਲ","deciduous forest":"ਪੱਤਝੜੀ ਜੰਗਲ","thorn forest":"ਕਾਂਟੇਦਾਰ ਜੰਗਲ","mangrove forest":"ਮੈਂਗਰੋਵ ਜੰਗਲ","tropical evergreen forest":"ਉਸ਼ਣ ਸਦਾਬਹਾਰ ਵਣ","tropical deciduous forest":"ਊਸ਼ਣ-ਪੱਤਝੜੀ ਵਣ","tropical thorn forest":"ਉਸ਼ਣ ਕੰਡੇਦਾਰ ਵਣ","scrub":"ਝਾੜੀਦਾਰ ਬਨਸਪਤੀ","teak":"ਸਾਗਵਾਨ","sal":"ਸਾਲ","fir":"ਫਰ","spruce":"ਸਪ੍ਰੂਸ","acacia":"ਕੀਕਰ","babool":"ਬਬੂਲ","Nilgai":"ਨੀਲਗਾਇ","Gir Forest":"ਗਿਰ ਜੰਗਲ","Royal Bengal Tiger":"ਰੋਇਲ ਬੰਗਾਲ ਟਾਈਗਰ",
    "wildlife sanctuary":"ਜੰਗਲੀ ਜੀਵ ਅਭਿਆਰਣ","national park":"ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ","biosphere reserve":"ਜੀਵਮੰਡਲ ਰਾਖਵਾਂ ਖੇਤਰ",
    "biodiversity":"ਜੈਵ ਵਿਭਿੰਨਤਾ","natural vegetation":"ਕੁਦਰਤੀ ਬਨਸਪਤੀ","forest":"ਜੰਗਲ","forests":"ਜੰਗਲ",
    "drainage basin":"ਨਿਕਾਸੀ ਬੇਸਿਨ","river basin":"ਨਦੀ ਬੇਸਿਨ","tributary":"ਸਹਾਇਕ ਨਦੀ","delta":"ਡੈਲਟਾ","estuary":"ਮੁਹਾਨਾ",
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

const COMMON_ENGLISH = /\b(?:which|what|why|where|when|how|the|and|or|is|are|was|were|does|do|did|can|could|would|should|has|have|had|with|from|into|for|of|to|in|on|at|by|as|than|that|this|these|those|most|main|major|only|correct|statement|following)\b/gi;

function residueCount(text: string) {
  return (text.match(COMMON_ENGLISH) ?? []).length;
}

function needsGenericExplanationFallback(source: string, language: "hi"|"pa") {
  return residueCount(localizeText(source, language)) > 3;
}

function cleanExplanation(source: string, answer: string, language: "hi"|"pa") {
  const translated = localizeText(source, language);
  if (!needsGenericExplanationFallback(source, language)) return translated;
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
        if (/[\u0A00-\u0A7F]/.test(localized.stem + " " + localized.options.join(" ") + " " + localized.explanation)) mixedScriptCount += 1;
      } else {
        punjabiStemResidueCount += stemResidue;
        punjabiOptionResidueCount += optionResidue;
        if (/[\u0900-\u097F]/.test(localized.stem + " " + localized.options.join(" ") + " " + localized.explanation)) mixedScriptCount += 1;
      }

      if (packageId !== "GEO-WAT-001" || !WATER_CP001_EXACT[language].has(q.questionId)) {
        if (needsGenericExplanationFallback(q.explanation, language)) genericExplanationFallbackCount += 1;
      }
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
