type CanonicalQuestion=Readonly<{questionId:string;options:readonly string[];correctIndex:number;}>;
type Lang="hi"|"pa";
type ExactRecord=Readonly<{stem:string;optionBySource:Readonly<Record<string,string>>;explanation:string}>;
const r=(stem:string,optionBySource:Record<string,string>,explanation:string):ExactRecord=>Object.freeze({stem,optionBySource:Object.freeze(optionBySource),explanation});

const HI:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-HAZ-001-CP004-Q001":r("NDMA का पूर्ण रूप क्या है?",{
"National Disaster Management Authority":"राष्ट्रीय आपदा प्रबंधन प्राधिकरण",
"National Development Mapping Agency":"राष्ट्रीय विकास मानचित्रण एजेंसी",
"National Drought Monitoring Authority":"राष्ट्रीय सूखा निगरानी प्राधिकरण",
"National Drainage Management Agency":"राष्ट्रीय जलनिकास प्रबंधन एजेंसी"},"NDMA भारत की राष्ट्रीय आपदा प्रबंधन संस्था है।"),
"GEO-HAZ-001-CP004-Q002":r("NDMA की मुख्य भूमिका क्या है?",{
"National policy and guidance for disaster management":"आपदा प्रबंधन के लिए राष्ट्रीय नीति और मार्गदर्शन",
"Railway operations":"रेल संचालन",
"Highway toll collection":"राजमार्ग टोल वसूली",
"Port dredging":"बंदरगाह की गहराई बढ़ाना"},"NDMA राष्ट्रीय स्तर पर आपदा प्रबंधन की दिशा, नीति और मार्गदर्शन प्रदान करता है।"),
"GEO-HAZ-001-CP004-Q003":r("आधिकारिक स्थान-आधारित आपदा चेतावनियां प्रसारित करने वाला राष्ट्रीय मंच कौन-सा है?",{
"SACHET":"SACHET",
"NHAI FASTag":"NHAI FASTag",
"IRCTC":"IRCTC",
"DigiLocker only":"केवल DigiLocker"},"SACHET NDMA का एकीकृत सार्वजनिक आपदा चेतावनी मंच है।"),
"GEO-HAZ-001-CP004-Q004":r("कथनों पर विचार करें: I. NDMA अनेक प्रकार की आपदाओं से संबंधित है। II. SACHET अधिकृत आपदा चेतावनियां प्रसारित करता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"दोनों कथन भारत की आपदा प्रबंधन व्यवस्था को सही बताते हैं।"),
"GEO-HAZ-001-CP004-Q005":r("राष्ट्रीय आपदा पोर्टल के माध्यम से नागरिकों को बहु-आपदा चेतावनी भेजी जाती है। यह किस प्राधिकरण से जुड़ी है?",{
"NDMA":"NDMA","NHAI":"NHAI","DFCCIL":"DFCCIL","Census of India":"भारत की जनगणना"},"SACHET चेतावनी व्यवस्था NDMA से जुड़ी है।"),

"GEO-HAZ-001-CP004-Q006":r("भारत में चक्रवात पूर्वानुमान के लिए प्रमुख एजेंसी कौन-सी है?",{
"India Meteorological Department":"भारत मौसम विज्ञान विभाग",
"NHAI":"NHAI",
"Census of India":"भारत की जनगणना",
"IWAI":"IWAI"},"भारत मौसम विज्ञान विभाग मौसम प्रणालियों की निगरानी करता है और चक्रवात पूर्वानुमान व चेतावनियां जारी करता है।"),
"GEO-HAZ-001-CP004-Q007":r("कौन-से खतरे सीधे भारत मौसम विज्ञान विभाग की मौसम चेतावनी भूमिका में आते हैं?",{
"Cyclones, heat waves and heavy rainfall":"चक्रवात, लू और भारी वर्षा",
"Earthquake plate motion only":"केवल भूकंपीय प्लेट गति",
"Rail accidents only":"केवल रेल दुर्घटनाएं",
"Dam construction only":"केवल बांध निर्माण"},"भारत मौसम विज्ञान विभाग प्रमुख मौसम संबंधी खतरों के लिए चेतावनियां जारी करता है।"),
"GEO-HAZ-001-CP004-Q008":r("चक्रवात के मार्ग का पूर्वानुमान महत्वपूर्ण क्यों है?",{
"They guide evacuation and preparedness":"वे निकासी और तैयारी में मार्गदर्शन करते हैं",
"They stop cyclones":"वे चक्रवात रोक देते हैं",
"They eliminate storm surge":"वे तूफानी समुद्री चढ़ाव समाप्त कर देते हैं",
"They deepen ports":"वे बंदरगाह गहरे करते हैं"},"पूर्वानुमान संभावित तट-प्रवेश क्षेत्र और समय बताकर तैयारी में मदद करता है।"),
"GEO-HAZ-001-CP004-Q009":r("कथनों पर विचार करें: I. IMD उष्णकटिबंधीय चक्रवातों की निगरानी करता है। II. यह लू की चेतावनी भी जारी करता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"दोनों भारत मौसम विज्ञान विभाग के प्रमुख मौसम चेतावनी कार्य हैं।"),
"GEO-HAZ-001-CP004-Q010":r("बंगाल की खाड़ी के एक तीव्र चक्रवात को तट पर पहुंचने से पहले ट्रैक किया जा रहा है। मुख्य मौसम चेतावनी कौन-सी एजेंसी जारी करती है?",{
"IMD":"IMD","CWC only":"केवल CWC","NHAI":"NHAI","BRO":"BRO"},"IMD भारत की प्रमुख मौसम और चक्रवात पूर्वानुमान एजेंसी है।"),

"GEO-HAZ-001-CP004-Q011":r("भारत में नदी बाढ़ पूर्वानुमान से निकटता से जुड़ी केंद्रीय एजेंसी कौन-सी है?",{
"Central Water Commission":"केंद्रीय जल आयोग",
"Airports Authority of India":"भारतीय विमानपत्तन प्राधिकरण",
"NHAI":"NHAI",
"ISRO only":"केवल ISRO"},"केंद्रीय जल आयोग अनेक स्थानों पर नदियों की निगरानी करता है और बाढ़ पूर्वानुमान प्रदान करता है।"),
"GEO-HAZ-001-CP004-Q012":r("बाढ़ पूर्वानुमान के लिए कौन-से आंकड़े महत्वपूर्ण हैं?",{
"River level, discharge and rainfall":"नदी का जलस्तर, प्रवाह और वर्षा",
"Railway fares":"रेल किराए",
"Airline schedules":"विमान समय-सारणी",
"Port customs data":"बंदरगाह सीमा-शुल्क आंकड़े"},"बाढ़ पूर्वानुमान जलवैज्ञानिक और वर्षा संबंधी प्रेक्षणों पर निर्भर करता है।"),
"GEO-HAZ-001-CP004-Q013":r("ऊपरी धारा के नदी मापक केंद्र उपयोगी क्यों होते हैं?",{
"They can provide advance information about downstream flood waves":"वे नीचे की ओर आने वाली बाढ़ के बारे में पहले से जानकारी दे सकते हैं",
"They stop rainfall":"वे वर्षा रोकते हैं",
"They eliminate rivers":"वे नदियां समाप्त कर देते हैं",
"They prevent all erosion":"वे सभी कटाव रोकते हैं"},"ऊपरी धारा के प्रेक्षण नीचे की ओर आने वाले प्रवाह के समय और मात्रा का अनुमान लगाने में मदद करते हैं।"),
"GEO-HAZ-001-CP004-Q014":r("कथनों पर विचार करें: I. CWC की बाढ़ पूर्वानुमान में भूमिका है। II. पूर्वानुमान निकासी और जलाशय संबंधी निर्णयों में मदद कर सकते हैं। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"बाढ़ पूर्वानुमान तैयारी और जल प्रबंधन संबंधी निर्णयों में सहायता करता है।"),
"GEO-HAZ-001-CP004-Q015":r("नीचे के जिलों को बाढ़ से पहले चेतावनी देने के लिए बढ़ते नदी स्तर की निगरानी की जाती है। यह कार्य किस एजेंसी से निकटता से जुड़ा है?",{
"Central Water Commission":"केंद्रीय जल आयोग",
"DFCCIL":"DFCCIL",
"AAI":"AAI",
"NHAI":"NHAI"},"केंद्रीय जल आयोग भारत की प्रमुख राष्ट्रीय बाढ़ पूर्वानुमान एजेंसियों में से एक है।"),

"GEO-HAZ-001-CP004-Q016":r("आपदा जोखिम के संदर्भ में 'खतरा' क्या है?",{
"A potentially damaging event or process":"ऐसी घटना या प्रक्रिया जो नुकसान पहुंचा सकती है",
"The same thing as population density":"जनसंख्या घनत्व के समान",
"Only a disaster after losses occur":"केवल नुकसान होने के बाद की आपदा",
"A transport route":"परिवहन मार्ग"},"खतरा ऐसी प्राकृतिक या मानवजनित घटना है जिसमें नुकसान पहुंचाने की क्षमता होती है।"),
"GEO-HAZ-001-CP004-Q017":r("आपदा जोखिम में 'एक्सपोजर' से क्या आशय है?",{
"People and assets located in hazard-prone areas":"खतरा-प्रवण क्षेत्रों में स्थित लोग और संपत्तियां",
"Only earthquake magnitude":"केवल भूकंप की तीव्रता",
"Only rainfall amount":"केवल वर्षा की मात्रा",
"Only warning time":"केवल चेतावनी का समय"},"एक्सपोजर बताता है कि खतरे की पहुंच में कौन-से लोग, संपत्तियां या प्रणालियां मौजूद हैं।"),
"GEO-HAZ-001-CP004-Q018":r("आपदा जोखिम में 'संवेदनशीलता' क्या है?",{
"Susceptibility to damage when exposed to a hazard":"खतरे के संपर्क में आने पर नुकसान होने की प्रवृत्ति",
"The hazard itself":"स्वयं खतरा",
"Only population size":"केवल जनसंख्या का आकार",
"Only river discharge":"केवल नदी प्रवाह"},"संवेदनशीलता बताती है कि खतरे के संपर्क में आए लोग या प्रणालियां कितनी आसानी से नुकसान झेल सकती हैं।"),
"GEO-HAZ-001-CP004-Q019":r("कथनों पर विचार करें: I. निर्जन क्षेत्र में शक्तिशाली खतरा भी बड़ी आपदा न बने, यह संभव है। II. अधिक एक्सपोजर और संवेदनशीलता से आपदा जोखिम बढ़ता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"आपदा जोखिम खतरे, एक्सपोजर और संवेदनशीलता के संयुक्त प्रभाव पर निर्भर करता है।"),
"GEO-HAZ-001-CP004-Q020":r("दो कस्बों में समान बाढ़ आती है, लेकिन एक कस्बे में मजबूत इमारतें और निकासी योजनाएं हैं। कौन-सा कस्बा कम संवेदनशील है?",{
"The better-prepared town":"बेहतर तैयारी वाला कस्बा",
"Both must have identical losses":"दोनों में समान नुकसान होना ही चाहिए",
"The less-prepared town":"कम तैयारी वाला कस्बा",
"Vulnerability cannot differ":"संवेदनशीलता में अंतर नहीं हो सकता"},"तैयारी और मजबूत आधारभूत संरचना संवेदनशीलता को कम करती है।"),

"GEO-HAZ-001-CP004-Q021":r("पूर्व चेतावनी प्रणाली का उद्देश्य क्या है?",{
"Provide timely information so people can act before impact":"समय पर जानकारी देना ताकि लोग प्रभाव पड़ने से पहले कार्रवाई कर सकें",
"Stop all hazards physically":"सभी खतरों को भौतिक रूप से रोक देना",
"Replace evacuation":"निकासी की आवश्यकता समाप्त करना",
"Eliminate weather":"मौसम को समाप्त करना"},"समय पर चेतावनी लोगों को सुरक्षा संबंधी कदम उठाने का अवसर देती है और नुकसान कम कर सकती है।"),
"GEO-HAZ-001-CP004-Q022":r("'लास्ट-माइल चेतावनी' का क्या अर्थ है?",{
"Warning reaches the people actually at risk":"चेतावनी वास्तव में खतरे में मौजूद लोगों तक पहुंचे",
"Warning stays only at national headquarters":"चेतावनी केवल राष्ट्रीय मुख्यालय तक रहे",
"Only scientists receive it":"केवल वैज्ञानिकों को चेतावनी मिले",
"No local communication occurs":"स्थानीय स्तर पर कोई सूचना न पहुंचे"},"चेतावनी तभी उपयोगी है जब खतरे में मौजूद समुदाय उसे प्राप्त करें और समझें।"),
"GEO-HAZ-001-CP004-Q023":r("प्रभावी पूर्व चेतावनी प्रणाली के लिए कौन-सा संयोजन आवश्यक है?",{
"Monitoring, forecasting, communication and response capacity":"निगरानी, पूर्वानुमान, संचार और प्रतिक्रिया क्षमता",
"Forecasting with no communication":"बिना संचार के केवल पूर्वानुमान",
"Alerts with no response plan":"प्रतिक्रिया योजना के बिना चेतावनी",
"No monitoring":"कोई निगरानी नहीं"},"पूर्व चेतावनी श्रृंखला के सभी हिस्सों का साथ काम करना जरूरी है।"),
"GEO-HAZ-001-CP004-Q024":r("कथनों पर विचार करें: I. केवल सही पूर्वानुमान पर्याप्त नहीं है। II. समुदायों को यह भी पता होना चाहिए कि प्रतिक्रिया कैसे करनी है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"तैयारी चेतावनी की जानकारी को वास्तविक सुरक्षा कार्रवाई में बदलती है।"),
"GEO-HAZ-001-CP004-Q025":r("चक्रवात की चेतावनी सही है, लेकिन तटीय गांवों तक पहुंचती ही नहीं। किस चरण में विफलता हुई?",{
"Last-mile communication":"अंतिम स्तर तक संचार",
"Cyclone formation":"चक्रवात का बनना",
"Ocean temperature":"समुद्री तापमान",
"River discharge":"नदी प्रवाह"},"चेतावनी खतरे में मौजूद लोगों तक नहीं पहुंची, इसलिए अंतिम स्तर का संचार विफल हुआ।")
});

const PA:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-HAZ-001-CP004-Q001":r("NDMA ਦਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?",{
"National Disaster Management Authority":"ਰਾਸ਼ਟਰੀ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਅਥਾਰਟੀ",
"National Development Mapping Agency":"ਰਾਸ਼ਟਰੀ ਵਿਕਾਸ ਨਕਸ਼ਾਬੰਦੀ ਏਜੰਸੀ",
"National Drought Monitoring Authority":"ਰਾਸ਼ਟਰੀ ਸੁੱਕਾ ਨਿਗਰਾਨੀ ਅਥਾਰਟੀ",
"National Drainage Management Agency":"ਰਾਸ਼ਟਰੀ ਨਿਕਾਸੀ ਪ੍ਰਬੰਧਨ ਏਜੰਸੀ"},"NDMA ਭਾਰਤ ਦੀ ਰਾਸ਼ਟਰੀ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਸੰਸਥਾ ਹੈ।"),
"GEO-HAZ-001-CP004-Q002":r("NDMA ਦੀ ਮੁੱਖ ਭੂਮਿਕਾ ਕੀ ਹੈ?",{
"National policy and guidance for disaster management":"ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਲਈ ਰਾਸ਼ਟਰੀ ਨੀਤੀ ਅਤੇ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼",
"Railway operations":"ਰੇਲਵੇ ਚਲਾਉਣਾ",
"Highway toll collection":"ਹਾਈਵੇ ਟੋਲ ਇਕੱਠਾ ਕਰਨਾ",
"Port dredging":"ਬੰਦਰਗਾਹ ਡੂੰਘਾ ਕਰਨਾ"},"NDMA ਰਾਸ਼ਟਰੀ ਪੱਧਰ ਉੱਤੇ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਲਈ ਨੀਤੀ ਅਤੇ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਦਿੰਦਾ ਹੈ।"),
"GEO-HAZ-001-CP004-Q003":r("ਅਧਿਕਾਰਤ ਸਥਾਨ-ਅਧਾਰਿਤ ਆਫ਼ਤ ਚੇਤਾਵਨੀਆਂ ਜਾਰੀ ਕਰਨ ਵਾਲਾ ਰਾਸ਼ਟਰੀ ਮੰਚ ਕਿਹੜਾ ਹੈ?",{
"SACHET":"SACHET",
"NHAI FASTag":"NHAI FASTag",
"IRCTC":"IRCTC",
"DigiLocker only":"ਕੇਵਲ DigiLocker"},"SACHET NDMA ਦਾ ਇਕੱਠਾ ਜਨਤਕ ਆਫ਼ਤ ਚੇਤਾਵਨੀ ਮੰਚ ਹੈ।"),
"GEO-HAZ-001-CP004-Q004":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. NDMA ਕਈ ਕਿਸਮ ਦੀਆਂ ਆਫ਼ਤਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ। II. SACHET ਅਧਿਕਾਰਤ ਆਫ਼ਤ ਚੇਤਾਵਨੀਆਂ ਜਾਰੀ ਕਰਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਦੋਵੇਂ ਕਥਨ ਭਾਰਤ ਦੀ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਪ੍ਰਣਾਲੀ ਨੂੰ ਸਹੀ ਦਰਸਾਉਂਦੇ ਹਨ।"),
"GEO-HAZ-001-CP004-Q005":r("ਰਾਸ਼ਟਰੀ ਆਫ਼ਤ ਪੋਰਟਲ ਰਾਹੀਂ ਨਾਗਰਿਕਾਂ ਨੂੰ ਕਈ ਕਿਸਮ ਦੀਆਂ ਆਫ਼ਤ ਚੇਤਾਵਨੀਆਂ ਭੇਜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਇਹ ਕਿਹੜੀ ਅਥਾਰਟੀ ਨਾਲ ਜੁੜਿਆ ਹੈ?",{
"NDMA":"NDMA","NHAI":"NHAI","DFCCIL":"DFCCIL","Census of India":"ਭਾਰਤ ਦੀ ਜਨਗਣਨਾ"},"SACHET ਚੇਤਾਵਨੀ ਪ੍ਰਣਾਲੀ NDMA ਨਾਲ ਜੁੜੀ ਹੈ।"),

"GEO-HAZ-001-CP004-Q006":r("ਭਾਰਤ ਵਿੱਚ ਚੱਕਰਵਾਤ ਦੀ ਭਵਿੱਖਬਾਣੀ ਲਈ ਮੁੱਖ ਏਜੰਸੀ ਕਿਹੜੀ ਹੈ?",{
"India Meteorological Department":"ਭਾਰਤ ਮੌਸਮ ਵਿਭਾਗ",
"NHAI":"NHAI","Census of India":"ਭਾਰਤ ਦੀ ਜਨਗਣਨਾ","IWAI":"IWAI"},"ਭਾਰਤ ਮੌਸਮ ਵਿਭਾਗ ਮੌਸਮੀ ਪ੍ਰਣਾਲੀਆਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰਦਾ ਹੈ ਅਤੇ ਚੱਕਰਵਾਤ ਦੀ ਭਵਿੱਖਬਾਣੀ ਤੇ ਚੇਤਾਵਨੀ ਜਾਰੀ ਕਰਦਾ ਹੈ।"),
"GEO-HAZ-001-CP004-Q007":r("ਕਿਹੜੇ ਖ਼ਤਰੇ ਸਿੱਧੇ ਭਾਰਤ ਮੌਸਮ ਵਿਭਾਗ ਦੀ ਮੌਸਮੀ ਚੇਤਾਵਨੀ ਭੂਮਿਕਾ ਵਿੱਚ ਆਉਂਦੇ ਹਨ?",{
"Cyclones, heat waves and heavy rainfall":"ਚੱਕਰਵਾਤ, ਲੂ ਅਤੇ ਭਾਰੀ ਵਰਖਾ",
"Earthquake plate motion only":"ਕੇਵਲ ਭੂਚਾਲੀ ਪਲੇਟ ਗਤੀ",
"Rail accidents only":"ਕੇਵਲ ਰੇਲ ਹਾਦਸੇ",
"Dam construction only":"ਕੇਵਲ ਬੰਨ੍ਹ ਨਿਰਮਾਣ"},"ਭਾਰਤ ਮੌਸਮ ਵਿਭਾਗ ਮੁੱਖ ਮੌਸਮੀ ਖ਼ਤਰਿਆਂ ਲਈ ਚੇਤਾਵਨੀਆਂ ਜਾਰੀ ਕਰਦਾ ਹੈ।"),
"GEO-HAZ-001-CP004-Q008":r("ਚੱਕਰਵਾਤ ਦੇ ਰਸਤੇ ਦੀ ਭਵਿੱਖਬਾਣੀ ਮਹੱਤਵਪੂਰਨ ਕਿਉਂ ਹੈ?",{
"They guide evacuation and preparedness":"ਇਹ ਨਿਕਾਸੀ ਅਤੇ ਤਿਆਰੀ ਵਿੱਚ ਦਿਸ਼ਾ ਦਿੰਦੀ ਹੈ",
"They stop cyclones":"ਇਹ ਚੱਕਰਵਾਤ ਰੋਕ ਦਿੰਦੀ ਹੈ",
"They eliminate storm surge":"ਇਹ ਤੂਫ਼ਾਨੀ ਸਮੁੰਦਰੀ ਚੜ੍ਹਾਅ ਖਤਮ ਕਰ ਦਿੰਦੀ ਹੈ",
"They deepen ports":"ਇਹ ਬੰਦਰਗਾਹ ਡੂੰਘੇ ਕਰਦੀ ਹੈ"},"ਭਵਿੱਖਬਾਣੀ ਸੰਭਾਵੀ ਤਟ-ਪ੍ਰਵੇਸ਼ ਸਥਾਨ ਅਤੇ ਸਮਾਂ ਦੱਸ ਕੇ ਤਿਆਰੀ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।"),
"GEO-HAZ-001-CP004-Q009":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. IMD ਉਸ਼ਣਕਟੀਬੰਧੀ ਚੱਕਰਵਾਤਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰਦਾ ਹੈ। II. ਇਹ ਲੂ ਦੀ ਚੇਤਾਵਨੀ ਵੀ ਜਾਰੀ ਕਰਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਦੋਵੇਂ ਭਾਰਤ ਮੌਸਮ ਵਿਭਾਗ ਦੇ ਮੁੱਖ ਮੌਸਮੀ ਚੇਤਾਵਨੀ ਕੰਮ ਹਨ।"),
"GEO-HAZ-001-CP004-Q010":r("ਬੰਗਾਲ ਦੀ ਖਾੜੀ ਦੇ ਇੱਕ ਤੀਬਰ ਚੱਕਰਵਾਤ ਨੂੰ ਤਟ ਉੱਤੇ ਪਹੁੰਚਣ ਤੋਂ ਪਹਿਲਾਂ ਟਰੈਕ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ। ਮੁੱਖ ਮੌਸਮੀ ਚੇਤਾਵਨੀ ਕਿਹੜੀ ਏਜੰਸੀ ਜਾਰੀ ਕਰਦੀ ਹੈ?",{
"IMD":"IMD","CWC only":"ਕੇਵਲ CWC","NHAI":"NHAI","BRO":"BRO"},"IMD ਭਾਰਤ ਦੀ ਮੁੱਖ ਮੌਸਮ ਅਤੇ ਚੱਕਰਵਾਤ ਭਵਿੱਖਬਾਣੀ ਏਜੰਸੀ ਹੈ।"),

"GEO-HAZ-001-CP004-Q011":r("ਭਾਰਤ ਵਿੱਚ ਨਦੀ ਹੜ੍ਹ ਦੀ ਭਵਿੱਖਬਾਣੀ ਨਾਲ ਨੇੜੇ ਤੌਰ ਤੇ ਜੁੜੀ ਕੇਂਦਰੀ ਏਜੰਸੀ ਕਿਹੜੀ ਹੈ?",{
"Central Water Commission":"ਕੇਂਦਰੀ ਜਲ ਆਯੋਗ",
"Airports Authority of India":"ਭਾਰਤੀ ਹਵਾਈ ਅੱਡਾ ਅਥਾਰਟੀ",
"NHAI":"NHAI","ISRO only":"ਕੇਵਲ ISRO"},"ਕੇਂਦਰੀ ਜਲ ਆਯੋਗ ਕਈ ਥਾਵਾਂ ਉੱਤੇ ਨਦੀਆਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰਦਾ ਹੈ ਅਤੇ ਹੜ੍ਹ ਭਵਿੱਖਬਾਣੀ ਦਿੰਦਾ ਹੈ।"),
"GEO-HAZ-001-CP004-Q012":r("ਹੜ੍ਹ ਦੀ ਭਵਿੱਖਬਾਣੀ ਲਈ ਕਿਹੜੇ ਅੰਕੜੇ ਮਹੱਤਵਪੂਰਨ ਹਨ?",{
"River level, discharge and rainfall":"ਨਦੀ ਦਾ ਪਾਣੀ ਪੱਧਰ, ਵਹਾਅ ਅਤੇ ਵਰਖਾ",
"Railway fares":"ਰੇਲ ਕਿਰਾਏ",
"Airline schedules":"ਹਵਾਈ ਉਡਾਣ ਸਮਾਂ-ਸਾਰਣੀ",
"Port customs data":"ਬੰਦਰਗਾਹ ਸ਼ੁਲਕ ਅੰਕੜੇ"},"ਹੜ੍ਹ ਦੀ ਭਵਿੱਖਬਾਣੀ ਪਾਣੀ ਅਤੇ ਵਰਖਾ ਨਾਲ ਜੁੜੇ ਨਿਰੀਖਣਾਂ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।"),
"GEO-HAZ-001-CP004-Q013":r("ਉੱਪਰਲੀ ਧਾਰਾ ਦੇ ਨਦੀ ਮਾਪ ਕੇਂਦਰ ਕਿਉਂ ਲਾਭਕਾਰੀ ਹੁੰਦੇ ਹਨ?",{
"They can provide advance information about downstream flood waves":"ਇਹ ਹੇਠਾਂ ਵੱਲ ਆਉਣ ਵਾਲੇ ਹੜ੍ਹ ਬਾਰੇ ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਦੇ ਸਕਦੇ ਹਨ",
"They stop rainfall":"ਇਹ ਵਰਖਾ ਰੋਕਦੇ ਹਨ",
"They eliminate rivers":"ਇਹ ਨਦੀਆਂ ਖਤਮ ਕਰ ਦਿੰਦੇ ਹਨ",
"They prevent all erosion":"ਇਹ ਹਰ ਕਿਸਮ ਦਾ ਕਟਾਅ ਰੋਕਦੇ ਹਨ"},"ਉੱਪਰਲੀ ਧਾਰਾ ਦੇ ਨਿਰੀਖਣ ਹੇਠਾਂ ਆਉਣ ਵਾਲੇ ਵਹਾਅ ਦੇ ਸਮੇਂ ਅਤੇ ਮਾਤਰਾ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ।"),
"GEO-HAZ-001-CP004-Q014":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. CWC ਦੀ ਹੜ੍ਹ ਭਵਿੱਖਬਾਣੀ ਵਿੱਚ ਭੂਮਿਕਾ ਹੈ। II. ਭਵਿੱਖਬਾਣੀ ਨਿਕਾਸੀ ਅਤੇ ਜਲਾਸ਼ਯ ਨਾਲ ਜੁੜੇ ਫੈਸਲਿਆਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਹੜ੍ਹ ਭਵਿੱਖਬਾਣੀ ਤਿਆਰੀ ਅਤੇ ਪਾਣੀ ਪ੍ਰਬੰਧ ਨਾਲ ਜੁੜੇ ਫੈਸਲਿਆਂ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।"),
"GEO-HAZ-001-CP004-Q015":r("ਹੇਠਲੇ ਜ਼ਿਲ੍ਹਿਆਂ ਨੂੰ ਹੜ੍ਹ ਤੋਂ ਪਹਿਲਾਂ ਚੇਤਾਵਨੀ ਦੇਣ ਲਈ ਵਧਦੇ ਨਦੀ ਪੱਧਰ ਦੀ ਨਿਗਰਾਨੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਇਹ ਕੰਮ ਕਿਹੜੀ ਏਜੰਸੀ ਨਾਲ ਜੁੜਿਆ ਹੈ?",{
"Central Water Commission":"ਕੇਂਦਰੀ ਜਲ ਆਯੋਗ","DFCCIL":"DFCCIL","AAI":"AAI","NHAI":"NHAI"},"ਕੇਂਦਰੀ ਜਲ ਆਯੋਗ ਭਾਰਤ ਦੀਆਂ ਮੁੱਖ ਰਾਸ਼ਟਰੀ ਹੜ੍ਹ ਭਵਿੱਖਬਾਣੀ ਏਜੰਸੀਆਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ।"),

"GEO-HAZ-001-CP004-Q016":r("ਆਫ਼ਤ ਖ਼ਤਰੇ ਦੇ ਸੰਦਰਭ ਵਿੱਚ 'ਖ਼ਤਰਾ' ਕੀ ਹੁੰਦਾ ਹੈ?",{
"A potentially damaging event or process":"ਅਜਿਹੀ ਘਟਨਾ ਜਾਂ ਪ੍ਰਕਿਰਿਆ ਜੋ ਨੁਕਸਾਨ ਪਹੁੰਚਾ ਸਕਦੀ ਹੈ",
"The same thing as population density":"ਆਬਾਦੀ ਘਣਤਾ ਦੇ ਬਰਾਬਰ",
"Only a disaster after losses occur":"ਕੇਵਲ ਨੁਕਸਾਨ ਹੋਣ ਤੋਂ ਬਾਅਦ ਦੀ ਆਫ਼ਤ",
"A transport route":"ਆਵਾਜਾਈ ਰਸਤਾ"},"ਖ਼ਤਰਾ ਅਜਿਹੀ ਕੁਦਰਤੀ ਜਾਂ ਮਨੁੱਖੀ ਘਟਨਾ ਹੈ ਜਿਸ ਵਿੱਚ ਨੁਕਸਾਨ ਪਹੁੰਚਾਉਣ ਦੀ ਸਮਰੱਥਾ ਹੁੰਦੀ ਹੈ।"),
"GEO-HAZ-001-CP004-Q017":r("ਆਫ਼ਤ ਖ਼ਤਰੇ ਵਿੱਚ 'ਐਕਸਪੋਜ਼ਰ' ਤੋਂ ਕੀ ਭਾਵ ਹੈ?",{
"People and assets located in hazard-prone areas":"ਖ਼ਤਰਾ-ਪ੍ਰਵਣ ਖੇਤਰਾਂ ਵਿੱਚ ਮੌਜੂਦ ਲੋਕ ਅਤੇ ਸੰਪਤੀਆਂ",
"Only earthquake magnitude":"ਕੇਵਲ ਭੂਚਾਲ ਦੀ ਤੀਬਰਤਾ",
"Only rainfall amount":"ਕੇਵਲ ਵਰਖਾ ਦੀ ਮਾਤਰਾ",
"Only warning time":"ਕੇਵਲ ਚੇਤਾਵਨੀ ਦਾ ਸਮਾਂ"},"ਐਕਸਪੋਜ਼ਰ ਦੱਸਦਾ ਹੈ ਕਿ ਖ਼ਤਰੇ ਦੀ ਪਹੁੰਚ ਵਿੱਚ ਕਿਹੜੇ ਲੋਕ, ਸੰਪਤੀਆਂ ਜਾਂ ਪ੍ਰਣਾਲੀਆਂ ਮੌਜੂਦ ਹਨ।"),
"GEO-HAZ-001-CP004-Q018":r("ਆਫ਼ਤ ਖ਼ਤਰੇ ਵਿੱਚ 'ਸੰਵੇਦਨਸ਼ੀਲਤਾ' ਕੀ ਹੈ?",{
"Susceptibility to damage when exposed to a hazard":"ਖ਼ਤਰੇ ਦੇ ਸੰਪਰਕ ਵਿੱਚ ਆਉਣ ਉੱਤੇ ਨੁਕਸਾਨ ਝੱਲਣ ਦੀ ਸੰਭਾਵਨਾ",
"The hazard itself":"ਖ਼ਤਰਾ ਆਪ",
"Only population size":"ਕੇਵਲ ਆਬਾਦੀ ਦਾ ਆਕਾਰ",
"Only river discharge":"ਕੇਵਲ ਨਦੀ ਦਾ ਵਹਾਅ"},"ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਦੱਸਦੀ ਹੈ ਕਿ ਖ਼ਤਰੇ ਦੇ ਸੰਪਰਕ ਵਿੱਚ ਆਏ ਲੋਕ ਜਾਂ ਪ੍ਰਣਾਲੀਆਂ ਕਿੰਨੀ ਆਸਾਨੀ ਨਾਲ ਨੁਕਸਾਨ ਝੱਲ ਸਕਦੀਆਂ ਹਨ।"),
"GEO-HAZ-001-CP004-Q019":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਬਿਨਾਂ ਆਬਾਦੀ ਵਾਲੇ ਖੇਤਰ ਵਿੱਚ ਵੱਡਾ ਖ਼ਤਰਾ ਵੀ ਵੱਡੀ ਆਫ਼ਤ ਨਾ ਬਣੇ, ਇਹ ਸੰਭਵ ਹੈ। II. ਵੱਧ ਐਕਸਪੋਜ਼ਰ ਅਤੇ ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਨਾਲ ਆਫ਼ਤ ਖ਼ਤਰਾ ਵਧਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਆਫ਼ਤ ਖ਼ਤਰਾ, ਐਕਸਪੋਜ਼ਰ ਅਤੇ ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਦੇ ਸਾਂਝੇ ਪ੍ਰਭਾਵ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।"),
"GEO-HAZ-001-CP004-Q020":r("ਦੋ ਕਸਬਿਆਂ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਹੜ੍ਹ ਆਉਂਦਾ ਹੈ, ਪਰ ਇੱਕ ਕਸਬੇ ਵਿੱਚ ਮਜ਼ਬੂਤ ਇਮਾਰਤਾਂ ਅਤੇ ਨਿਕਾਸੀ ਯੋਜਨਾਵਾਂ ਹਨ। ਕਿਹੜਾ ਕਸਬਾ ਘੱਟ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ?",{
"The better-prepared town":"ਵਧੀਆ ਤਿਆਰੀ ਵਾਲਾ ਕਸਬਾ",
"Both must have identical losses":"ਦੋਵਾਂ ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਨੁਕਸਾਨ ਹੋਣਾ ਹੀ ਚਾਹੀਦਾ ਹੈ",
"The less-prepared town":"ਘੱਟ ਤਿਆਰੀ ਵਾਲਾ ਕਸਬਾ",
"Vulnerability cannot differ":"ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਵਿੱਚ ਫਰਕ ਨਹੀਂ ਹੋ ਸਕਦਾ"},"ਤਿਆਰੀ ਅਤੇ ਮਜ਼ਬੂਤ ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਘਟਾਉਂਦੇ ਹਨ।"),

"GEO-HAZ-001-CP004-Q021":r("ਪੂਰਵ-ਚੇਤਾਵਨੀ ਪ੍ਰਣਾਲੀ ਦਾ ਮਕਸਦ ਕੀ ਹੈ?",{
"Provide timely information so people can act before impact":"ਸਮੇਂ ਸਿਰ ਜਾਣਕਾਰੀ ਦੇਣਾ ਤਾਂ ਜੋ ਲੋਕ ਪ੍ਰਭਾਵ ਪੈਣ ਤੋਂ ਪਹਿਲਾਂ ਕਾਰਵਾਈ ਕਰ ਸਕਣ",
"Stop all hazards physically":"ਸਾਰੇ ਖ਼ਤਰਿਆਂ ਨੂੰ ਭੌਤਿਕ ਤੌਰ ਤੇ ਰੋਕ ਦੇਣਾ",
"Replace evacuation":"ਨਿਕਾਸੀ ਦੀ ਲੋੜ ਖਤਮ ਕਰਨਾ",
"Eliminate weather":"ਮੌਸਮ ਨੂੰ ਖਤਮ ਕਰਨਾ"},"ਸਮੇਂ ਸਿਰ ਚੇਤਾਵਨੀ ਲੋਕਾਂ ਨੂੰ ਸੁਰੱਖਿਆ ਵਾਲੇ ਕਦਮ ਚੁੱਕਣ ਦਾ ਮੌਕਾ ਦਿੰਦੀ ਹੈ ਅਤੇ ਨੁਕਸਾਨ ਘਟਾ ਸਕਦੀ ਹੈ।"),
"GEO-HAZ-001-CP004-Q022":r("'ਲਾਸਟ-ਮਾਈਲ ਚੇਤਾਵਨੀ' ਦਾ ਕੀ ਅਰਥ ਹੈ?",{
"Warning reaches the people actually at risk":"ਚੇਤਾਵਨੀ ਅਸਲ ਵਿੱਚ ਖ਼ਤਰੇ ਵਿੱਚ ਮੌਜੂਦ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚੇ",
"Warning stays only at national headquarters":"ਚੇਤਾਵਨੀ ਕੇਵਲ ਰਾਸ਼ਟਰੀ ਮੁੱਖ ਦਫ਼ਤਰ ਤੱਕ ਰਹੇ",
"Only scientists receive it":"ਕੇਵਲ ਵਿਗਿਆਨੀਆਂ ਤੱਕ ਪਹੁੰਚੇ",
"No local communication occurs":"ਸਥਾਨਕ ਪੱਧਰ ਉੱਤੇ ਕੋਈ ਸੰਚਾਰ ਨਾ ਹੋਵੇ"},"ਚੇਤਾਵਨੀ ਤਦੋਂ ਹੀ ਲਾਭਕਾਰੀ ਹੈ ਜਦੋਂ ਖ਼ਤਰੇ ਵਿੱਚ ਮੌਜੂਦ ਲੋਕ ਉਸਨੂੰ ਪ੍ਰਾਪਤ ਕਰਨ ਅਤੇ ਸਮਝਣ।"),
"GEO-HAZ-001-CP004-Q023":r("ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਪੂਰਵ-ਚੇਤਾਵਨੀ ਪ੍ਰਣਾਲੀ ਲਈ ਕਿਹੜਾ ਜੋੜ ਲਾਜ਼ਮੀ ਹੈ?",{
"Monitoring, forecasting, communication and response capacity":"ਨਿਗਰਾਨੀ, ਭਵਿੱਖਬਾਣੀ, ਸੰਚਾਰ ਅਤੇ ਪ੍ਰਤੀਕਿਰਿਆ ਸਮਰੱਥਾ",
"Forecasting with no communication":"ਬਿਨਾਂ ਸੰਚਾਰ ਦੇ ਕੇਵਲ ਭਵਿੱਖਬਾਣੀ",
"Alerts with no response plan":"ਪ੍ਰਤੀਕਿਰਿਆ ਯੋਜਨਾ ਤੋਂ ਬਿਨਾਂ ਚੇਤਾਵਨੀ",
"No monitoring":"ਕੋਈ ਨਿਗਰਾਨੀ ਨਹੀਂ"},"ਪੂਰਵ-ਚੇਤਾਵਨੀ ਲੜੀ ਦੇ ਸਾਰੇ ਹਿੱਸਿਆਂ ਦਾ ਇਕੱਠੇ ਕੰਮ ਕਰਨਾ ਜ਼ਰੂਰੀ ਹੈ।"),
"GEO-HAZ-001-CP004-Q024":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਕੇਵਲ ਸਹੀ ਭਵਿੱਖਬਾਣੀ ਕਾਫ਼ੀ ਨਹੀਂ ਹੈ। II. ਸਮੁਦਾਇਆਂ ਨੂੰ ਇਹ ਵੀ ਪਤਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ਪ੍ਰਤੀਕਿਰਿਆ ਕਿਵੇਂ ਕਰਨੀ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਤਿਆਰੀ ਚੇਤਾਵਨੀ ਦੀ ਜਾਣਕਾਰੀ ਨੂੰ ਅਸਲ ਸੁਰੱਖਿਆ ਕਾਰਵਾਈ ਵਿੱਚ ਬਦਲਦੀ ਹੈ।"),
"GEO-HAZ-001-CP004-Q025":r("ਚੱਕਰਵਾਤ ਦੀ ਚੇਤਾਵਨੀ ਸਹੀ ਹੈ, ਪਰ ਤਟੀ ਪਿੰਡਾਂ ਤੱਕ ਪਹੁੰਚਦੀ ਹੀ ਨਹੀਂ। ਕਿਹੜਾ ਪੜਾਅ ਅਸਫਲ ਹੋਇਆ?",{
"Last-mile communication":"ਅੰਤਿਮ ਪੱਧਰ ਤੱਕ ਸੰਚਾਰ",
"Cyclone formation":"ਚੱਕਰਵਾਤ ਦਾ ਬਣਨਾ",
"Ocean temperature":"ਸਮੁੰਦਰੀ ਤਾਪਮਾਨ",
"River discharge":"ਨਦੀ ਦਾ ਵਹਾਅ"},"ਚੇਤਾਵਨੀ ਖ਼ਤਰੇ ਵਿੱਚ ਮੌਜੂਦ ਲੋਕਾਂ ਤੱਕ ਨਹੀਂ ਪਹੁੰਚੀ, ਇਸ ਲਈ ਅੰਤਿਮ ਪੱਧਰ ਦਾ ਸੰਚਾਰ ਅਸਫਲ ਹੋਇਆ।")
});

export function localizeGeoHaz001ExactCp004(question:CanonicalQuestion,language:Lang){
 const rec=(language==="hi"?HI:PA)[question.questionId];if(!rec)return null;
 const options=question.options.map(source=>{const t=rec.optionBySource[source];if(!t)throw new Error(`Missing GEO-HAZ-001 CP004 ${language} option translation for ${question.questionId}: ${source}`);return t;});
 return Object.freeze({stem:rec.stem,options:Object.freeze(options),canonicalAnswer:options[question.correctIndex]!,explanation:rec.explanation});
}
