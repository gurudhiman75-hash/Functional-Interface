export type GeoReferenceLanguageV1="en"|"hi"|"pa";
type CanonicalQuestion=Readonly<{questionId:string;stem:string;options:readonly string[];correctIndex:number;canonicalAnswer:string;explanation:string;qlId:string;sourceFactIds:readonly string[]}>;
export type LocalizedGeoReferenceQuestionV1=Readonly<{stem:string;options:readonly string[];canonicalAnswer:string;explanation:string}>;

const TERMS:Record<"hi"|"pa",Record<string,string>>={
hi:{
"Jammu and Kashmir":"जम्मू और कश्मीर","Ladakh":"लद्दाख","Delhi":"दिल्ली","Puducherry":"पुदुचेरी","Chandigarh":"चंडीगढ़",
"Sikkim":"सिक्किम","Himachal Pradesh":"हिमाचल प्रदेश","Uttarakhand":"उत्तराखंड","Arunachal Pradesh":"अरुणाचल प्रदेश",
"Manipur":"मणिपुर","Odisha":"ओडिशा","Rajasthan":"राजस्थान","Kerala":"केरल","Maharashtra":"महाराष्ट्र","Karnataka":"कर्नाटक",
"Tamil Nadu":"तमिलनाडु","Andhra Pradesh":"आंध्र प्रदेश","Jharkhand":"झारखंड","Chhattisgarh":"छत्तीसगढ़","Madhya Pradesh":"मध्य प्रदेश",
"Gujarat":"गुजरात","Goa":"गोवा","West Bengal":"पश्चिम बंगाल","China":"चीन","Nepal":"नेपाल","Bhutan":"भूटान","Myanmar":"म्यांमार",
"Bangladesh":"बांग्लादेश","Sri Lanka":"श्रीलंका",
"Wular Lake":"वुलर झील","Wular":"वुलर","Dal Lake":"डल झील","Dal":"डल","Loktak Lake":"लोकटक झील","Loktak":"लोकटक",
"Chilika Lake":"चिलिका झील","Chilika":"चिलिका","Sambhar Lake":"सांभर झील","Sambhar":"सांभर","Vembanad Lake":"वेम्बनाड झील","Vembanad":"वेम्बनाड",
"Pulicat Lake":"पुलिकट झील","Pulicat":"पुलिकट","Kolleru Lake":"कोल्लेरू झील","Kolleru":"कोल्लेरू","Lonar Lake":"लोणार झील","Lonar":"लोणार",
"Pangong Tso":"पैंगोंग त्सो","Jog Falls":"जोग जलप्रपात","Jog":"जोग","Chitrakote Falls":"चित्रकोट जलप्रपात","Chitrakote":"चित्रकोट",
"Dhuandhar Falls":"धुआंधार जलप्रपात","Dhuandhar":"धुआंधार","Hundru Falls":"हुंडरू जलप्रपात","Hundru":"हुंडरू",
"Shivanasamudra Falls":"शिवनासमुद्र जलप्रपात","Shivanasamudra":"शिवनासमुद्र","Hogenakkal Falls":"होगेनक्कल जलप्रपात","Hogenakkal":"होगेनक्कल",
"Nathu La":"नाथू ला","Shipki La":"शिपकी ला","Zoji La":"जोजी ला","Rohtang Pass":"रोहतांग दर्रा","Rohtang":"रोहतांग",
"Lipulekh Pass":"लिपुलेख दर्रा","Lipulekh":"लिपुलेख","Bomdi La":"बोमडिला","Banihal Pass":"बनिहाल दर्रा","Banihal":"बनिहाल",
"Khardung La":"खारदुंग ला","Chang La":"चांग ला","Jelep La":"जेलेप ला",
"Kanchenjunga":"कंचनजंघा","Nanda Devi":"नंदा देवी","Anamudi":"अनामुडी","Guru Shikhar":"गुरु शिखर","Doddabetta":"डोड्डाबेट्टा",
"Srinagar":"श्रीनगर","Jaipur":"जयपुर","Bhopal":"भोपाल","Kochi":"कोच्चि","Ooty":"ऊटी","Mount Abu":"माउंट आबू","Leh":"लेह",
"Kashmir Valley":"कश्मीर घाटी","Nubra Valley":"नुब्रा घाटी","Kullu Valley":"कुल्लू घाटी","Lahaul-Spiti":"लाहौल-स्पीति",
"Jhelum":"झेलम","Godavari":"गोदावरी","Narmada":"नर्मदा","Mahanadi":"महानदी","Sharavathi":"शरावती","Indravati":"इंद्रावती",
"Subarnarekha":"स्वर्णरेखा","Kaveri":"कावेरी","Mandovi":"मांडवी","Sutlej":"सतलुज","Brahmaputra":"ब्रह्मपुत्र","Teesta":"तीस्ता","Krishna":"कृष्णा",
"Ganga":"गंगा","Tapi":"ताप्ती","Brahmani":"ब्राह्मणी",
"Bay of Bengal":"बंगाल की खाड़ी","Arabian Sea":"अरब सागर","Red Sea":"लाल सागर","Caspian Sea":"कैस्पियन सागर",
"Coromandel Coast":"कोरोमंडल तट","Konkan Coast":"कोंकण तट","Malabar Coast":"मालाबार तट","Kutch Coast":"कच्छ तट",
"Eastern Himalaya":"पूर्वी हिमालय","Western Ghats":"पश्चिमी घाट","Eastern Ghats":"पूर्वी घाट","Aravalli":"अरावली","Vindhya":"विंध्य",
"Shivalik":"शिवालिक","Himalaya":"हिमालय","Pir Panjal":"पीर पंजाल","Nilgiri Hills":"नीलगिरि पहाड़ियाँ","Chota Nagpur Plateau":"छोटानागपुर पठार",
"Deccan Plateau":"दक्कन का पठार","Shillong Plateau":"शिलांग पठार","Malwa Plateau":"मालवा पठार","Ladakh Plateau":"लद्दाख पठार",
"Keibul Lamjao National Park":"केइबुल लामजाओ राष्ट्रीय उद्यान","Kaziranga National Park":"काजीरंगा राष्ट्रीय उद्यान","Gir National Park":"गिर राष्ट्रीय उद्यान",
"Simlipal National Park":"सिमिलिपाल राष्ट्रीय उद्यान","Nanda Devi National Park":"नंदा देवी राष्ट्रीय उद्यान",
"Houseboats and floating gardens":"हाउसबोट और तैरते बगीचे","Salt extraction":"नमक उत्पादन","Coral reefs":"प्रवाल भित्तियाँ","Desert dunes":"रेतीले टीले",
"Phumdis":"फुमदी","Chars":"चार","Duns":"दून","Khadins":"खडीन","Salt production":"नमक उत्पादन","Tea cultivation":"चाय की खेती",
"Marine fishing":"समुद्री मत्स्य पालन","Hydropower generation":"जलविद्युत उत्पादन",
"Freshwater lake":"मीठे पानी की झील","Saline lake":"खारे पानी की झील","Coastal lagoon":"तटीय लैगून","Brackish coastal lagoon":"खारे-मीठे पानी वाला तटीय लैगून",
"High-altitude freshwater lake":"ऊँचाई पर स्थित मीठे पानी की झील","Freshwater glacial lake":"मीठे पानी की हिमानी झील","River oxbow lake":"गोखुर झील",
"Desert salt lake":"मरुस्थलीय खारी झील","High-altitude glacial lake":"ऊँचाई पर स्थित हिमानी झील","Coastal coral lagoon":"तटीय प्रवाल लैगून",
"Meteorite-impact crater":"उल्कापिंड प्रभाव से बना क्रेटर","River meander cutoff":"नदी के विसर्प के कटने से बनी झील","Coastal lagoon formation":"तटीय लैगून निर्माण","Glacial erosion":"हिमानी अपरदन",
"High-altitude endorheic lake":"ऊँचाई पर स्थित अंतःप्रवाही झील","Desert salt pan at sea level":"समुद्र तल पर मरुस्थलीय लवण क्षेत्र","River delta lake":"नदी डेल्टा झील",
"Tibet":"तिब्बत","India-China frontier":"भारत-चीन सीमा","India-China boundary":"भारत-चीन सीमा","Kailash-Mansarovar route":"कैलाश-मानसरोवर मार्ग",
"Srinagar-Leh route":"श्रीनगर-लेह मार्ग","Leh-Nubra":"लेह-नुब्रा","Leh-Pangong":"लेह-पैंगोंग","Gaddi":"गद्दी"
},
pa:{
"Jammu and Kashmir":"ਜੰਮੂ ਅਤੇ ਕਸ਼ਮੀਰ","Ladakh":"ਲੱਦਾਖ","Delhi":"ਦਿੱਲੀ","Puducherry":"ਪੁਡੁਚੇਰੀ","Chandigarh":"ਚੰਡੀਗੜ੍ਹ",
"Sikkim":"ਸਿੱਕਿਮ","Himachal Pradesh":"ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼","Uttarakhand":"ਉੱਤਰਾਖੰਡ","Arunachal Pradesh":"ਅਰੁਣਾਚਲ ਪ੍ਰਦੇਸ਼",
"Manipur":"ਮਣੀਪੁਰ","Odisha":"ਓਡੀਸ਼ਾ","Rajasthan":"ਰਾਜਸਥਾਨ","Kerala":"ਕੇਰਲ","Maharashtra":"ਮਹਾਰਾਸ਼ਟਰ","Karnataka":"ਕਰਨਾਟਕ",
"Tamil Nadu":"ਤਾਮਿਲਨਾਡੂ","Andhra Pradesh":"ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼","Jharkhand":"ਝਾਰਖੰਡ","Chhattisgarh":"ਛੱਤੀਸਗੜ੍ਹ","Madhya Pradesh":"ਮੱਧ ਪ੍ਰਦੇਸ਼",
"Gujarat":"ਗੁਜਰਾਤ","Goa":"ਗੋਆ","West Bengal":"ਪੱਛਮੀ ਬੰਗਾਲ","China":"ਚੀਨ","Nepal":"ਨੇਪਾਲ","Bhutan":"ਭੂਟਾਨ","Myanmar":"ਮਿਆਂਮਾਰ",
"Bangladesh":"ਬੰਗਲਾਦੇਸ਼","Sri Lanka":"ਸ੍ਰੀਲੰਕਾ",
"Wular Lake":"ਵੁਲਰ ਝੀਲ","Wular":"ਵੁਲਰ","Dal Lake":"ਡਲ ਝੀਲ","Dal":"ਡਲ","Loktak Lake":"ਲੋਕਤਕ ਝੀਲ","Loktak":"ਲੋਕਤਕ",
"Chilika Lake":"ਚਿਲਿਕਾ ਝੀਲ","Chilika":"ਚਿਲਿਕਾ","Sambhar Lake":"ਸਾਂਭਰ ਝੀਲ","Sambhar":"ਸਾਂਭਰ","Vembanad Lake":"ਵੇਂਬਨਾਡ ਝੀਲ","Vembanad":"ਵੇਂਬਨਾਡ",
"Pulicat Lake":"ਪੁਲਿਕਟ ਝੀਲ","Pulicat":"ਪੁਲਿਕਟ","Kolleru Lake":"ਕੋਲੇਰੂ ਝੀਲ","Kolleru":"ਕੋਲੇਰੂ","Lonar Lake":"ਲੋਣਾਰ ਝੀਲ","Lonar":"ਲੋਣਾਰ",
"Pangong Tso":"ਪੈਂਗੋਂਗ ਤਸੋ","Jog Falls":"ਜੋਗ ਝਰਨਾ","Jog":"ਜੋਗ","Chitrakote Falls":"ਚਿਤਰਕੋਟ ਝਰਨਾ","Chitrakote":"ਚਿਤਰਕੋਟ",
"Dhuandhar Falls":"ਧੁਆਂਧਾਰ ਝਰਨਾ","Dhuandhar":"ਧੁਆਂਧਾਰ","Hundru Falls":"ਹੁੰਡਰੂ ਝਰਨਾ","Hundru":"ਹੁੰਡਰੂ",
"Shivanasamudra Falls":"ਸ਼ਿਵਨਾਸਮੁਦ੍ਰਾ ਝਰਨਾ","Shivanasamudra":"ਸ਼ਿਵਨਾਸਮੁਦ੍ਰਾ","Hogenakkal Falls":"ਹੋਗੇਨੱਕਲ ਝਰਨਾ","Hogenakkal":"ਹੋਗੇਨੱਕਲ",
"Nathu La":"ਨਾਥੂ ਲਾ","Shipki La":"ਸ਼ਿਪਕੀ ਲਾ","Zoji La":"ਜ਼ੋਜੀ ਲਾ","Rohtang Pass":"ਰੋਹਤਾਂਗ ਦਰਰਾ","Rohtang":"ਰੋਹਤਾਂਗ",
"Lipulekh Pass":"ਲਿਪੁਲੇਖ ਦਰਰਾ","Lipulekh":"ਲਿਪੁਲੇਖ","Bomdi La":"ਬੋਮਡੀ ਲਾ","Banihal Pass":"ਬਨਿਹਾਲ ਦਰਰਾ","Banihal":"ਬਨਿਹਾਲ",
"Khardung La":"ਖਾਰਦੁੰਗ ਲਾ","Chang La":"ਚਾਂਗ ਲਾ","Jelep La":"ਜੇਲੇਪ ਲਾ",
"Kanchenjunga":"ਕੰਚਨਜੰਗਾ","Nanda Devi":"ਨੰਦਾ ਦੇਵੀ","Anamudi":"ਅਨਾਮੁਡੀ","Guru Shikhar":"ਗੁਰੂ ਸ਼ਿਖਰ","Doddabetta":"ਡੋਡਾਬੇਟਾ",
"Srinagar":"ਸ੍ਰੀਨਗਰ","Jaipur":"ਜੈਪੁਰ","Bhopal":"ਭੋਪਾਲ","Kochi":"ਕੋਚੀ","Ooty":"ਊਟੀ","Mount Abu":"ਮਾਊਂਟ ਆਬੂ","Leh":"ਲੇਹ",
"Kashmir Valley":"ਕਸ਼ਮੀਰ ਘਾਟੀ","Nubra Valley":"ਨੁਬਰਾ ਘਾਟੀ","Kullu Valley":"ਕੁੱਲੂ ਘਾਟੀ","Lahaul-Spiti":"ਲਾਹੌਲ-ਸਪੀਤੀ",
"Jhelum":"ਝੇਲਮ","Godavari":"ਗੋਦਾਵਰੀ","Narmada":"ਨਰਮਦਾ","Mahanadi":"ਮਹਾਨਦੀ","Sharavathi":"ਸ਼ਰਾਵਤੀ","Indravati":"ਇੰਦਰਾਵਤੀ",
"Subarnarekha":"ਸੁਵਰਨਰੇਖਾ","Kaveri":"ਕਾਵੇਰੀ","Mandovi":"ਮਾਂਡਵੀ","Sutlej":"ਸਤਲੁਜ","Brahmaputra":"ਬ੍ਰਹਮਪੁਤ੍ਰ","Teesta":"ਤੀਸਤਾ","Krishna":"ਕ੍ਰਿਸ਼ਨਾ",
"Ganga":"ਗੰਗਾ","Tapi":"ਤਾਪਤੀ","Brahmani":"ਬ੍ਰਾਹਮਣੀ",
"Bay of Bengal":"ਬੰਗਾਲ ਦੀ ਖਾੜੀ","Arabian Sea":"ਅਰਬ ਸਾਗਰ","Red Sea":"ਲਾਲ ਸਾਗਰ","Caspian Sea":"ਕੈਸਪੀਅਨ ਸਾਗਰ",
"Coromandel Coast":"ਕੋਰੋਮੰਡਲ ਤਟ","Konkan Coast":"ਕੋਂਕਣ ਤਟ","Malabar Coast":"ਮਾਲਾਬਾਰ ਤਟ","Kutch Coast":"ਕੱਛ ਤਟ",
"Eastern Himalaya":"ਪੂਰਬੀ ਹਿਮਾਲਿਆ","Western Ghats":"ਪੱਛਮੀ ਘਾਟ","Eastern Ghats":"ਪੂਰਬੀ ਘਾਟ","Aravalli":"ਅਰਾਵਲੀ","Vindhya":"ਵਿੰਧਿਆ",
"Shivalik":"ਸ਼ਿਵਾਲਿਕ","Himalaya":"ਹਿਮਾਲਿਆ","Pir Panjal":"ਪੀਰ ਪੰਜਾਲ","Nilgiri Hills":"ਨੀਲਗਿਰੀ ਪਹਾੜੀਆਂ","Chota Nagpur Plateau":"ਛੋਟਾਨਾਗਪੁਰ ਪਠਾਰ",
"Deccan Plateau":"ਦੱਖਣ ਦਾ ਪਠਾਰ","Shillong Plateau":"ਸ਼ਿਲਾਂਗ ਪਠਾਰ","Malwa Plateau":"ਮਾਲਵਾ ਪਠਾਰ","Ladakh Plateau":"ਲੱਦਾਖ ਪਠਾਰ",
"Keibul Lamjao National Park":"ਕੇਇਬੁਲ ਲਾਮਜਾਓ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ","Kaziranga National Park":"ਕਾਜ਼ੀਰੰਗਾ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ","Gir National Park":"ਗਿਰ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ",
"Simlipal National Park":"ਸਿਮਲੀਪਾਲ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ","Nanda Devi National Park":"ਨੰਦਾ ਦੇਵੀ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ",
"Houseboats and floating gardens":"ਹਾਊਸਬੋਟਾਂ ਅਤੇ ਤੈਰਦੇ ਬਾਗ","Salt extraction":"ਨਮਕ ਕੱਢਣਾ","Coral reefs":"ਪ੍ਰਵਾਲ ਭਿੱਟਾਂ","Desert dunes":"ਰੇਤਲੇ ਟਿੱਬੇ",
"Phumdis":"ਫੁਮਦੀ","Chars":"ਚਾਰ","Duns":"ਦੂਨ","Khadins":"ਖਡੀਨ","Salt production":"ਨਮਕ ਉਤਪਾਦਨ","Tea cultivation":"ਚਾਹ ਦੀ ਖੇਤੀ",
"Marine fishing":"ਸਮੁੰਦਰੀ ਮੱਛੀਪਾਲਣ","Hydropower generation":"ਜਲ-ਬਿਜਲੀ ਉਤਪਾਦਨ",
"Freshwater lake":"ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਝੀਲ","Saline lake":"ਖਾਰੇ ਪਾਣੀ ਦੀ ਝੀਲ","Coastal lagoon":"ਤਟੀ ਲੈਗੂਨ","Brackish coastal lagoon":"ਖਾਰੇ-ਮਿੱਠੇ ਪਾਣੀ ਵਾਲਾ ਤਟੀ ਲੈਗੂਨ",
"High-altitude freshwater lake":"ਉੱਚਾਈ ਵਾਲੀ ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਝੀਲ","Freshwater glacial lake":"ਮਿੱਠੇ ਪਾਣੀ ਦੀ ਹਿਮਾਨੀ ਝੀਲ","River oxbow lake":"ਗੋਖੁਰ ਝੀਲ",
"Desert salt lake":"ਮਾਰੂਥਲੀ ਖਾਰੀ ਝੀਲ","High-altitude glacial lake":"ਉੱਚਾਈ ਵਾਲੀ ਹਿਮਾਨੀ ਝੀਲ","Coastal coral lagoon":"ਤਟੀ ਪ੍ਰਵਾਲ ਲੈਗੂਨ",
"Meteorite-impact crater":"ਉਲਕਾਪਿੰਡ ਟੱਕਰ ਨਾਲ ਬਣਿਆ ਕ੍ਰੇਟਰ","River meander cutoff":"ਨਦੀ ਦੇ ਮੋੜ ਦੇ ਕੱਟਣ ਨਾਲ ਬਣੀ ਝੀਲ","Coastal lagoon formation":"ਤਟੀ ਲੈਗੂਨ ਬਣਤਰ","Glacial erosion":"ਹਿਮਾਨੀ ਕਟਾਅ",
"High-altitude endorheic lake":"ਉੱਚਾਈ ਵਾਲੀ ਅੰਦਰੂਨੀ ਨਿਕਾਸੀ ਝੀਲ","Desert salt pan at sea level":"ਸਮੁੰਦਰ ਤਲ ਉੱਤੇ ਮਾਰੂਥਲੀ ਲੂਣ ਖੇਤਰ","River delta lake":"ਨਦੀ ਡੈਲਟਾ ਝੀਲ",
"Tibet":"ਤਿਬੱਤ","India-China frontier":"ਭਾਰਤ-ਚੀਨ ਸਰਹੱਦ","India-China boundary":"ਭਾਰਤ-ਚੀਨ ਸਰਹੱਦ","Kailash-Mansarovar route":"ਕੈਲਾਸ਼-ਮਾਨਸਰੋਵਰ ਰਸਤਾ",
"Srinagar-Leh route":"ਸ੍ਰੀਨਗਰ-ਲੇਹ ਰਸਤਾ","Leh-Nubra":"ਲੇਹ-ਨੁਬਰਾ","Leh-Pangong":"ਲੇਹ-ਪੈਂਗੋਂਗ","Gaddi":"ਗੱਦੀ"
}};

const EXACT:Record<"hi"|"pa",Record<string,string>>={
hi:{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है",
"I, II and III":"I, II और III","I and II only":"केवल I और II","II and III only":"केवल II और III","I and III only":"केवल I और III"
},
pa:{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ",
"I, II and III":"I, II ਅਤੇ III","I and II only":"ਕੇਵਲ I ਅਤੇ II","II and III only":"ਕੇਵਲ II ਅਤੇ III","I and III only":"ਕੇਵਲ I ਅਤੇ III"
}};

const PHRASES:Record<"hi"|"pa",readonly [string,string][]>={
hi:[
["Consider the statements:","निम्न कथनों पर विचार कीजिए:"],["Which is correct?","कौन-सा सही है?"],["Which one is it?","यह कौन-सा है?"],["Which lake is it?","यह कौन-सी झील है?"],["Which pass is it?","यह कौन-सा दर्रा है?"],["Which peak is it?","यह कौन-सी चोटी है?"],
["is located in which Union Territory of India?","भारत के किस केंद्र शासित प्रदेश में स्थित है?"],["is located in which Union Territory?","किस केंद्र शासित प्रदेश में स्थित है?"],["lies in which Union Territory?","किस केंद्र शासित प्रदेश में स्थित है?"],["is located in which state?","किस राज्य में स्थित है?"],["lies in which state?","किस राज्य में स्थित है?"],
["is located in which city?","किस शहर में स्थित है?"],["is formed by which river?","किस नदी से बनता है?"],["Which river is closely linked with","कौन-सी नदी इससे निकट रूप से जुड़ी है:"],["Which river enters India near the","कौन-सी नदी भारत में इसके पास प्रवेश करती है:"],
["Which mountain range contains","कौन-सी पर्वत श्रेणी में स्थित है:"],["Which mountain system contains","कौन-सी पर्वत प्रणाली में स्थित है:"],["Which hill range contains","कौन-सी पहाड़ी श्रेणी में स्थित है:"],["Which plateau region contains","कौन-से पठारी क्षेत्र में स्थित है:"],
["Which place is closely linked with","कौन-सा स्थान इससे निकट रूप से जुड़ा है:"],["Which region is closely linked with","कौन-सा क्षेत्र इससे निकट रूप से जुड़ा है:"],["Which national park is closely linked with","कौन-सा राष्ट्रीय उद्यान इससे निकट रूप से जुड़ा है:"],
["What type of lake is","किस प्रकार की झील है:"],["What type of water body is","किस प्रकार का जल निकाय है:"],["What is the origin of","की उत्पत्ति किस प्रकार हुई?"],["Which activity is strongly linked with","कौन-सी गतिविधि इससे प्रमुख रूप से जुड़ी है:"],
["lies along the coast of which two states?","किन दो राज्यों के तट पर स्थित है?"],["lies near which coast?","किस तट के निकट स्थित है?"],["lies between the deltas of which two rivers?","किन दो नदियों के डेल्टाओं के बीच स्थित है?"],["is a transboundary lake shared by India and which country?","भारत और किस देश के बीच फैली अंतरराष्ट्रीय झील है?"],
["Which broad setting describes","के लिए कौन-सा भौगोलिक परिवेश सही है:"],["lies on the route toward which neighbouring country?","किस पड़ोसी देश की ओर जाने वाले मार्ग पर स्थित है?"],["lies on India's boundary with which country?","भारत की किस देश के साथ सीमा पर स्थित है?"],
["connects the Kashmir Valley with which region?","कश्मीर घाटी को किस क्षेत्र से जोड़ता है?"],["connects Kullu Valley with which region?","कुल्लू घाटी को किस क्षेत्र से जोड़ता है?"],["provides access from Leh toward which valley?","लेह से किस घाटी की ओर जाने का मार्ग देता है?"],["lies on the route from Leh toward which lake region?","लेह से किस झील की ओर जाने वाले मार्ग पर स्थित है?"],
["Which pilgrimage route is closely linked with","कौन-सा तीर्थ मार्ग इससे जुड़ा है:"],["Which river forms major waterfalls at both","कौन-सी नदी इन दोनों स्थानों पर प्रमुख जलप्रपात बनाती है:"],
["Which set is correctly matched?","कौन-सा समूह सही सुमेलित है?"],["Which set correctly matches","कौन-सा समूह सही सुमेलित करता है"],["Which combination correctly identifies","कौन-सा संयोजन सही पहचान करता है"],["Which comparison correctly","कौन-सी तुलना सही रूप से"]
],
pa:[
["Consider the statements:","ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:"],["Which is correct?","ਕਿਹੜਾ ਸਹੀ ਹੈ?"],["Which one is it?","ਇਹ ਕਿਹੜਾ ਹੈ?"],["Which lake is it?","ਇਹ ਕਿਹੜੀ ਝੀਲ ਹੈ?"],["Which pass is it?","ਇਹ ਕਿਹੜਾ ਦਰਰਾ ਹੈ?"],["Which peak is it?","ਇਹ ਕਿਹੜੀ ਚੋਟੀ ਹੈ?"],
["is located in which Union Territory of India?","ਭਾਰਤ ਦੇ ਕਿਹੜੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਵਿੱਚ ਸਥਿਤ ਹੈ?"],["is located in which Union Territory?","ਕਿਹੜੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਵਿੱਚ ਸਥਿਤ ਹੈ?"],["lies in which Union Territory?","ਕਿਹੜੇ ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼ ਵਿੱਚ ਸਥਿਤ ਹੈ?"],["is located in which state?","ਕਿਹੜੇ ਰਾਜ ਵਿੱਚ ਸਥਿਤ ਹੈ?"],["lies in which state?","ਕਿਹੜੇ ਰਾਜ ਵਿੱਚ ਸਥਿਤ ਹੈ?"],
["is located in which city?","ਕਿਹੜੇ ਸ਼ਹਿਰ ਵਿੱਚ ਸਥਿਤ ਹੈ?"],["is formed by which river?","ਕਿਹੜੀ ਨਦੀ ਤੋਂ ਬਣਦਾ ਹੈ?"],["Which river is closely linked with","ਕਿਹੜੀ ਨਦੀ ਇਸ ਨਾਲ ਨੇੜੇ ਤੌਰ ਤੇ ਜੁੜੀ ਹੈ:"],["Which river enters India near the","ਕਿਹੜੀ ਨਦੀ ਇਸ ਖੇਤਰ ਦੇ ਨੇੜੇ ਭਾਰਤ ਵਿੱਚ ਦਾਖਲ ਹੁੰਦੀ ਹੈ:"],
["Which mountain range contains","ਕਿਹੜੀ ਪਹਾੜੀ ਲੜੀ ਵਿੱਚ ਸਥਿਤ ਹੈ:"],["Which mountain system contains","ਕਿਹੜੀ ਪਹਾੜੀ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਸਥਿਤ ਹੈ:"],["Which hill range contains","ਕਿਹੜੀ ਪਹਾੜੀ ਲੜੀ ਵਿੱਚ ਸਥਿਤ ਹੈ:"],["Which plateau region contains","ਕਿਹੜੇ ਪਠਾਰੀ ਖੇਤਰ ਵਿੱਚ ਸਥਿਤ ਹੈ:"],
["Which place is closely linked with","ਕਿਹੜਾ ਸਥਾਨ ਇਸ ਨਾਲ ਨੇੜੇ ਤੌਰ ਤੇ ਜੁੜਿਆ ਹੈ:"],["Which region is closely linked with","ਕਿਹੜਾ ਖੇਤਰ ਇਸ ਨਾਲ ਨੇੜੇ ਤੌਰ ਤੇ ਜੁੜਿਆ ਹੈ:"],["Which national park is closely linked with","ਕਿਹੜਾ ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ ਇਸ ਨਾਲ ਨੇੜੇ ਤੌਰ ਤੇ ਜੁੜਿਆ ਹੈ:"],
["What type of lake is","ਕਿਸ ਕਿਸਮ ਦੀ ਝੀਲ ਹੈ:"],["What type of water body is","ਕਿਸ ਕਿਸਮ ਦਾ ਜਲ-ਸਰੋਤ ਹੈ:"],["What is the origin of","ਦੀ ਉਤਪੱਤੀ ਕਿਵੇਂ ਹੋਈ?"],["Which activity is strongly linked with","ਕਿਹੜੀ ਗਤੀਵਿਧੀ ਇਸ ਨਾਲ ਖਾਸ ਤੌਰ ਤੇ ਜੁੜੀ ਹੈ:"],
["lies along the coast of which two states?","ਕਿਹੜੇ ਦੋ ਰਾਜਾਂ ਦੇ ਤਟ ਉੱਤੇ ਸਥਿਤ ਹੈ?"],["lies near which coast?","ਕਿਹੜੇ ਤਟ ਦੇ ਨੇੜੇ ਸਥਿਤ ਹੈ?"],["lies between the deltas of which two rivers?","ਕਿਹੜੀਆਂ ਦੋ ਨਦੀਆਂ ਦੇ ਡੈਲਟਿਆਂ ਵਿਚਕਾਰ ਸਥਿਤ ਹੈ?"],["is a transboundary lake shared by India and which country?","ਭਾਰਤ ਅਤੇ ਕਿਹੜੇ ਦੇਸ਼ ਵਿਚਕਾਰ ਫੈਲੀ ਸਰਹੱਦੀ ਝੀਲ ਹੈ?"],
["Which broad setting describes","ਲਈ ਕਿਹੜਾ ਭੂਗੋਲਿਕ ਪਰਿਵੇਸ਼ ਸਹੀ ਹੈ:"],["lies on the route toward which neighbouring country?","ਕਿਹੜੇ ਪੜੋਸੀ ਦੇਸ਼ ਵੱਲ ਜਾਣ ਵਾਲੇ ਰਸਤੇ ਉੱਤੇ ਸਥਿਤ ਹੈ?"],["lies on India's boundary with which country?","ਭਾਰਤ ਦੀ ਕਿਹੜੇ ਦੇਸ਼ ਨਾਲ ਸਰਹੱਦ ਉੱਤੇ ਸਥਿਤ ਹੈ?"],
["connects the Kashmir Valley with which region?","ਕਸ਼ਮੀਰ ਘਾਟੀ ਨੂੰ ਕਿਹੜੇ ਖੇਤਰ ਨਾਲ ਜੋੜਦਾ ਹੈ?"],["connects Kullu Valley with which region?","ਕੁੱਲੂ ਘਾਟੀ ਨੂੰ ਕਿਹੜੇ ਖੇਤਰ ਨਾਲ ਜੋੜਦਾ ਹੈ?"],["provides access from Leh toward which valley?","ਲੇਹ ਤੋਂ ਕਿਹੜੀ ਘਾਟੀ ਵੱਲ ਜਾਣ ਦਾ ਰਸਤਾ ਦਿੰਦਾ ਹੈ?"],["lies on the route from Leh toward which lake region?","ਲੇਹ ਤੋਂ ਕਿਹੜੀ ਝੀਲ ਵੱਲ ਜਾਣ ਵਾਲੇ ਰਸਤੇ ਉੱਤੇ ਸਥਿਤ ਹੈ?"],
["Which pilgrimage route is closely linked with","ਕਿਹੜਾ ਤੀਰਥ ਰਸਤਾ ਇਸ ਨਾਲ ਜੁੜਿਆ ਹੈ:"],["Which river forms major waterfalls at both","ਕਿਹੜੀ ਨਦੀ ਦੋਵੇਂ ਸਥਾਨਾਂ ਉੱਤੇ ਮੁੱਖ ਝਰਨੇ ਬਣਾਉਂਦੀ ਹੈ:"],
["Which set is correctly matched?","ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?"],["Which set correctly matches","ਕਿਹੜਾ ਸਮੂਹ ਸਹੀ ਤਰ੍ਹਾਂ ਮਿਲਾਉਂਦਾ ਹੈ"],["Which combination correctly identifies","ਕਿਹੜਾ ਜੋੜ ਸਹੀ ਪਛਾਣ ਕਰਦਾ ਹੈ"],["Which comparison correctly","ਕਿਹੜੀ ਤੁਲਨਾ ਸਹੀ ਤਰ੍ਹਾਂ"]
]};

function replaceAllTerms(text:string,language:"hi"|"pa"){
 let out=text;
 for(const [from,to] of Object.entries(TERMS[language]).sort((a,b)=>b[0].length-a[0].length))out=out.split(from).join(to);
 return out;
}
function localizeText(text:string,language:"hi"|"pa"){
 const exact=EXACT[language][text]; if(exact)return exact;
 let out=text;
 for(const [from,to] of PHRASES[language])out=out.split(from).join(to);
 out=replaceAllTerms(out,language);
 out=out.replace(/\bFalls\b/g,language==="hi"?"जलप्रपात":"ਝਰਨਾ")
        .replace(/\bLake\b/g,language==="hi"?"झील":"ਝੀਲ")
        .replace(/\bPass\b/g,language==="hi"?"दर्रा":"ਦਰਰਾ")
        .replace(/\bValley\b/g,language==="hi"?"घाटी":"ਘਾਟੀ")
        .replace(/\bPlateau\b/g,language==="hi"?"पठार":"ਪਠਾਰ")
        .replace(/\bNational Park\b/g,language==="hi"?"राष्ट्रीय उद्यान":"ਰਾਸ਼ਟਰੀ ਉਦਿਆਨ");
 return out.trim();
}
function genericExplanation(answer:string,language:"hi"|"pa",qlId:string){
 if(language==="hi")return `सही उत्तर ${answer} है। यह ${qlId.startsWith("GEO-LAK")?"झील/जलप्रपात":"दर्रा/चोटी"} के स्थान या भौगोलिक संबंध को सही रूप से पहचानता है।`;
 return `ਸਹੀ ਉੱਤਰ ${answer} ਹੈ। ਇਹ ${qlId.startsWith("GEO-LAK")?"ਝੀਲ/ਝਰਨੇ":"ਦਰਰੇ/ਚੋਟੀ"} ਦੇ ਸਥਾਨ ਜਾਂ ਭੂਗੋਲਿਕ ਸੰਬੰਧ ਦੀ ਸਹੀ ਪਛਾਣ ਕਰਦਾ ਹੈ।`;
}
export function localizeGeoReferenceQuestionV1(question:CanonicalQuestion,language:GeoReferenceLanguageV1):LocalizedGeoReferenceQuestionV1{
 if(language==="en")return Object.freeze({stem:question.stem,options:Object.freeze([...question.options]),canonicalAnswer:question.canonicalAnswer,explanation:question.explanation});
 const options=Object.freeze(question.options.map(o=>localizeText(o,language)));
 const canonicalAnswer=options[question.correctIndex]!;
 const stem=localizeText(question.stem,language);
 const translatedExplanation=localizeText(question.explanation,language);
 const latinResidue=/\b(?:is|are|which|what|the|and|with|in|on|from|near|lies|located|formed|major|river|state|region|correct|lake|falls|pass|peak)\b/i.test(translatedExplanation);
 const explanation=latinResidue?genericExplanation(canonicalAnswer,language,question.qlId):translatedExplanation;
 return Object.freeze({stem,options,canonicalAnswer,explanation});
}
export function auditGeoReferenceLocalizationV1(questions:readonly CanonicalQuestion[]){
 const issues:string[]=[];
 for(const q of questions)for(const language of ["hi","pa"] as const){
  const l=localizeGeoReferenceQuestionV1(q,language);
  if(!l.stem.trim()||!l.explanation.trim())issues.push(`${q.questionId}:${language}:EMPTY`);
  if(l.options.length!==4||new Set(l.options).size!==4)issues.push(`${q.questionId}:${language}:OPTIONS`);
  if(l.options[q.correctIndex]!==l.canonicalAnswer)issues.push(`${q.questionId}:${language}:ANSWER`);
  if(language==="hi"&&!/[\u0900-\u097F]/.test(l.stem))issues.push(`${q.questionId}:hi:NO_DEVANAGARI`);
  if(language==="pa"&&!/[\u0A00-\u0A7F]/.test(l.stem))issues.push(`${q.questionId}:pa:NO_GURMUKHI`);
 }
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),canonicalQuestionCount:questions.length,localizedVersionCount:questions.length*3});
}
