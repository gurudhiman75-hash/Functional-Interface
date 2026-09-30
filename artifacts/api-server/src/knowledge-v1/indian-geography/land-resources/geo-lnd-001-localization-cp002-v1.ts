type CanonicalQuestion = Readonly<{
  questionId:string;
  options:readonly string[];
  correctIndex:number;
}>;
type Lang="hi"|"pa";
type ExactRecord=Readonly<{stem:string;optionBySource:Readonly<Record<string,string>>;explanation:string}>;
const r=(stem:string,optionBySource:Record<string,string>,explanation:string):ExactRecord=>Object.freeze({stem,optionBySource:Object.freeze(optionBySource),explanation});

const HI:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-LND-001-CP002-Q001":r("भूमि क्षरण क्या है?",{
"Decline in the productive quality of land":"भूमि की उत्पादक गुणवत्ता में गिरावट","Increase in soil fertility everywhere":"हर जगह मिट्टी की उर्वरता बढ़ना","Only urban growth":"केवल शहरी वृद्धि","Only rainfall change":"केवल वर्षा में परिवर्तन"},"भूमि क्षरण से कृषि, वनस्पति और अन्य उपयोगों को सहारा देने की भूमि की क्षमता घटती है।"),
"GEO-LND-001-CP002-Q002":r("कौन-सी गतिविधि भूमि क्षरण का कारण बन सकती है?",{
"Deforestation":"वनों की कटाई","Afforestation":"वनीकरण","Controlled grazing":"नियंत्रित चराई","Soil conservation":"मृदा संरक्षण"},"वनस्पति हटने से मिट्टी खुली पड़ जाती है, जिससे कटाव बढ़ सकता है और भूमि की गुणवत्ता घटती है।"),
"GEO-LND-001-CP002-Q003":r("शुष्क क्षेत्रों में भूमि क्षरण के साथ कौन-सी प्रक्रिया अक्सर जुड़ी होती है?",{
"Desertification":"मरुस्थलीकरण","Glaciation":"हिमानीकरण","Sea-floor spreading":"समुद्र-तल प्रसार","Urban agglomeration only":"केवल शहरी संकुलन"},"शुष्क भूमि का लगातार क्षरण मरुस्थल जैसी परिस्थितियां पैदा कर सकता है।"),
"GEO-LND-001-CP002-Q004":r("कथनों पर विचार करें: I. भूमि क्षरण मानवीय गतिविधियों से हो सकता है। II. प्राकृतिक प्रक्रियाएं भी इसमें योगदान दे सकती हैं। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"भूमि का गलत उपयोग और प्राकृतिक कटाव या शुष्कता, दोनों भूमि को क्षतिग्रस्त कर सकते हैं।"),
"GEO-LND-001-CP002-Q005":r("किसी चरागाह की वनस्पति नष्ट हो जाती है और मिट्टी खुली व अनुपजाऊ हो जाती है। यह क्या दर्शाता है?",{
"Land degradation":"भूमि क्षरण","Urbanisation":"शहरीकरण","Population growth":"जनसंख्या वृद्धि","Irrigation expansion":"सिंचाई विस्तार"},"वनस्पति और उत्पादकता का घट जाना भूमि क्षरण का संकेत है।"),
"GEO-LND-001-CP002-Q006":r("मृदा अपरदन भूमि को कैसे क्षतिग्रस्त करता है?",{
"It removes fertile topsoil":"यह उपजाऊ ऊपरी मिट्टी को हटा देता है","It adds humus":"यह ह्यूमस बढ़ाता है","It increases soil depth":"यह मिट्टी की गहराई बढ़ाता है","It always improves moisture":"यह हमेशा नमी में सुधार करता है"},"ऊपरी मिट्टी में अधिकांश पोषक तत्व और कार्बनिक पदार्थ होते हैं; इसके हटने से भूमि की उर्वरता घटती है।"),
"GEO-LND-001-CP002-Q007":r("ढालों पर जल अपरदन को कौन-सा कारक तेज कर सकता है?",{
"Removal of vegetation":"वनस्पति हटाना","Contour farming":"समोच्च खेती","Terracing":"सीढ़ीदार खेती","Grass cover":"घास का आवरण"},"खुली ढालों पर वर्षा का बहाव मिट्टी को अधिक तेजी से बहा ले जाता है।"),
"GEO-LND-001-CP002-Q008":r("शुष्क और रेतीले क्षेत्रों में कौन-सी प्रक्रिया सामान्य है?",{
"Wind erosion":"पवन अपरदन","Glacial deposition only":"केवल हिमानी निक्षेपण","Tidal erosion only":"केवल ज्वारीय अपरदन","River meandering only":"केवल नदी का घुमावदार बहाव"},"जहां वनस्पति कम हो, वहां तेज हवाएं ढीली और सूखी मिट्टी को उड़ा सकती हैं।"),
"GEO-LND-001-CP002-Q009":r("कथनों पर विचार करें: I. अपरदन मिट्टी की उर्वरता घटा सकता है। II. वनस्पति आवरण मिट्टी की रक्षा करता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"वनस्पति बहते पानी और हवा की गति कम करती है, जिससे मिट्टी का नुकसान घटता है।"),
"GEO-LND-001-CP002-Q010":r("भारी वर्षा के दौरान एक खुला खेत अपनी उपजाऊ ऊपरी मिट्टी खो देता है। भूमि क्षरण किस प्रक्रिया से हुआ?",{
"Soil erosion":"मृदा अपरदन","Groundwater recharge":"भूजल पुनर्भरण","Afforestation":"वनीकरण","Urban planning":"शहरी नियोजन"},"वर्षा का बहाव उपजाऊ ऊपरी मिट्टी को बहाकर ले गया है।"),
"GEO-LND-001-CP002-Q011":r("अत्यधिक चराई भूमि को कैसे क्षतिग्रस्त कर सकती है?",{
"It removes protective vegetation faster than it can recover":"यह सुरक्षात्मक वनस्पति को उसके पुनर्विकास से अधिक तेजी से हटा देती है","It always increases forest cover":"यह हमेशा वन क्षेत्र बढ़ाती है","It reduces erosion":"यह अपरदन कम करती है","It increases humus automatically":"यह अपने-आप ह्यूमस बढ़ाती है"},"अत्यधिक चराई मिट्टी को खुला छोड़ देती है और पौधों के पुनर्विकास को कमजोर करती है।"),
"GEO-LND-001-CP002-Q012":r("खनन भूमि को कैसे क्षतिग्रस्त कर सकता है?",{
"Excavation and waste dumps disturb soil and vegetation":"खुदाई और अपशिष्ट ढेर मिट्टी तथा वनस्पति को नुकसान पहुंचाते हैं","It always improves soil structure":"यह हमेशा मिट्टी की संरचना सुधारता है","It creates forests automatically":"यह अपने-आप वन बनाता है","It reduces all erosion":"यह सभी प्रकार के अपरदन को कम करता है"},"खनन से गड्ढे, मलबे के ढेर और प्रदूषित सतहें रह सकती हैं।"),
"GEO-LND-001-CP002-Q013":r("कथनों पर विचार करें: I. अत्यधिक चराई मिट्टी को खुला कर सकती है। II. सही पुनर्स्थापन न होने पर खनन बंजर भूमि छोड़ सकता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"बिना उचित प्रबंधन के अत्यधिक चराई और खनन दोनों भूमि को गंभीर रूप से क्षतिग्रस्त कर सकते हैं।"),
"GEO-LND-001-CP002-Q014":r("गतिविधि और भूमि पर उसके प्रभाव की सही जोड़ी कौन-सी है?",{
"Mining — surface disturbance":"खनन — भूमि सतह में व्यवधान","Afforestation — vegetation removal":"वनीकरण — वनस्पति हटाना","Contour ploughing — gully formation":"समोच्च जुताई — गली निर्माण","Check dams — wind erosion":"चेक डैम — पवन अपरदन"},"खनन सीधे भूमि की सतह को बदलता और क्षतिग्रस्त करता है।"),
"GEO-LND-001-CP002-Q015":r("एक शुष्क चरागाह में अत्यधिक पशु दबाव से वनस्पति समाप्त हो जाती है। भूमि क्षरण का मुख्य कारण क्या है?",{
"Overgrazing":"अत्यधिक चराई","Afforestation":"वनीकरण","Terracing":"सीढ़ीदार खेती","Rainwater harvesting":"वर्षा जल संचयन"},"अत्यधिक चराई वनस्पति को पुनः विकसित होने का समय नहीं देती।"),
"GEO-LND-001-CP002-Q016":r("अत्यधिक सिंचाई से जलभराव कैसे हो सकता है?",{
"Water table rises close to the surface":"भूजल स्तर सतह के बहुत निकट आ जाता है","Groundwater disappears instantly":"भूजल तुरंत समाप्त हो जाता है","Soil dries completely":"मिट्टी पूरी तरह सूख जाती है","Rainfall stops":"वर्षा रुक जाती है"},"खराब जल निकास और अधिक सिंचाई से जड़ क्षेत्र पानी से संतृप्त हो सकता है।"),
"GEO-LND-001-CP002-Q017":r("सिंचित शुष्क क्षेत्रों में लवणता कैसे बढ़ सकती है?",{
"Evaporation leaves dissolved salts in the soil":"वाष्पीकरण के बाद घुले हुए लवण मिट्टी में रह जाते हैं","Rain removes all salts permanently":"वर्षा सभी लवणों को स्थायी रूप से हटा देती है","Plants create sea water":"पौधे समुद्री जल बनाते हैं","Soil has no minerals":"मिट्टी में कोई खनिज नहीं होता"},"अधिक वाष्पीकरण और कमजोर जल निकास से मिट्टी में लवण जमा हो सकते हैं।"),
"GEO-LND-001-CP002-Q018":r("कथनों पर विचार करें: I. जलभराव फसलों को नुकसान पहुंचा सकता है। II. लवणता मिट्टी की उत्पादकता घटा सकती है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"जलभराव और लवणता दोनों सिंचाई से जुड़ी प्रमुख भूमि समस्याएं हैं।"),
"GEO-LND-001-CP002-Q019":r("कौन-सा उपाय सिंचाई से होने वाली लवणता को रोकने में मदद करता है?",{
"Adequate drainage":"पर्याप्त जल निकास","Unlimited flooding":"असीमित जल भराव","Blocking all drains":"सभी नालियां बंद करना","Over-irrigation":"अत्यधिक सिंचाई"},"अच्छा जल निकास जड़ क्षेत्र से अतिरिक्त पानी और लवण हटाने में मदद करता है।"),
"GEO-LND-001-CP002-Q020":r("सिंचित खेत की सतह पर सफेद लवण परत बन जाती है और फसल कमजोर हो जाती है। सबसे संभावित समस्या क्या है?",{
"Soil salinity":"मृदा लवणता","Afforestation":"वनीकरण","River deposition":"नदी निक्षेपण","Urbanisation":"शहरीकरण"},"सतह पर लवण जमा होना मृदा लवणता का स्पष्ट संकेत है।"),
"GEO-LND-001-CP002-Q021":r("ढालों पर मृदा अपरदन कम करने वाली पद्धति कौन-सी है?",{
"Terracing":"सीढ़ीदार खेती","Removing all vegetation":"सारी वनस्पति हटाना","Ploughing straight down steep slopes":"खड़ी ढाल पर सीधे नीचे की ओर जुताई","Overgrazing":"अत्यधिक चराई"},"सीढ़ियां ढाल की लंबाई कम करती हैं और पानी के बहाव की गति घटाती हैं।"),
"GEO-LND-001-CP002-Q022":r("पवन अपरदन कम करने में कौन-सी पद्धति सहायक है?",{
"Shelterbelts":"वायु-रोधक वृक्ष-पट्टियां","Bare fallow everywhere":"हर जगह खुली परती भूमि","Deforestation":"वनों की कटाई","Sand removal only":"केवल रेत हटाना"},"पेड़ों की कतारें भूमि के निकट हवा की गति कम करती हैं।"),
"GEO-LND-001-CP002-Q023":r("क्षतिग्रस्त भूमि को पुनः सुधारने में कौन-सी पद्धति सहायक है?",{
"Afforestation":"वनीकरण","Open-cast dumping without reclamation":"पुनर्सुधार के बिना खुली खदान का मलबा डालना","Overgrazing":"अत्यधिक चराई","Burning vegetation repeatedly":"वनस्पति को बार-बार जलाना"},"पेड़ और घास का आवरण मिट्टी को स्थिर करता है और भूमि की पारिस्थितिक क्षमता बहाल करने में मदद करता है।"),
"GEO-LND-001-CP002-Q024":r("कथनों पर विचार करें: I. समोच्च जुताई पानी के बहाव को धीमा करती है। II. वनीकरण मिट्टी को स्थिर करने में मदद करता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"दोनों मृदा और भूमि संरक्षण की प्रभावी पद्धतियां हैं।"),
"GEO-LND-001-CP002-Q025":r("किसान ढाल के सीधे नीचे की ओर जुताई करने के बजाय समोच्च रेखाओं के साथ जुताई करता है। यह कौन-सी संरक्षण पद्धति है?",{
"Contour ploughing":"समोच्च जुताई","Strip mining":"पट्टी खनन","Over-irrigation":"अत्यधिक सिंचाई","Urban zoning":"शहरी क्षेत्र निर्धारण"},"समोच्च रेखाओं के साथ जुताई करने से बहाव की गति और मिट्टी का नुकसान कम होता है।")
});

const PA:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-LND-001-CP002-Q001":r("ਜ਼ਮੀਨ ਦਾ ਖ਼ਰਾਬ ਹੋਣਾ ਕੀ ਹੈ?",{
"Decline in the productive quality of land":"ਜ਼ਮੀਨ ਦੀ ਉਤਪਾਦਕ ਗੁਣਵੱਤਾ ਘਟਣਾ","Increase in soil fertility everywhere":"ਹਰ ਥਾਂ ਮਿੱਟੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਧਣਾ","Only urban growth":"ਕੇਵਲ ਸ਼ਹਿਰੀ ਵਾਧਾ","Only rainfall change":"ਕੇਵਲ ਵਰਖਾ ਵਿੱਚ ਬਦਲਾਅ"},"ਜ਼ਮੀਨ ਦੀ ਗੁਣਵੱਤਾ ਘਟਣ ਨਾਲ ਖੇਤੀਬਾੜੀ, ਬਨਸਪਤੀ ਅਤੇ ਹੋਰ ਵਰਤੋਂਆਂ ਨੂੰ ਸਹਾਰਾ ਦੇਣ ਦੀ ਸਮਰੱਥਾ ਘਟਦੀ ਹੈ।"),
"GEO-LND-001-CP002-Q002":r("ਕਿਹੜੀ ਗਤੀਵਿਧੀ ਜ਼ਮੀਨ ਦੇ ਖ਼ਰਾਬ ਹੋਣ ਦਾ ਕਾਰਨ ਬਣ ਸਕਦੀ ਹੈ?",{
"Deforestation":"ਜੰਗਲਾਂ ਦੀ ਕਟਾਈ","Afforestation":"ਰੁੱਖ ਲਗਾਉਣਾ","Controlled grazing":"ਨਿਯੰਤਰਿਤ ਚਰਾਈ","Soil conservation":"ਮਿੱਟੀ ਦੀ ਸੰਭਾਲ"},"ਬਨਸਪਤੀ ਹਟਣ ਨਾਲ ਮਿੱਟੀ ਖੁੱਲ੍ਹੀ ਪੈ ਜਾਂਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਕਟਾਅ ਵਧ ਸਕਦਾ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਗੁਣਵੱਤਾ ਘਟਦੀ ਹੈ।"),
"GEO-LND-001-CP002-Q003":r("ਸੁੱਕੇ ਖੇਤਰਾਂ ਵਿੱਚ ਜ਼ਮੀਨ ਦੇ ਖ਼ਰਾਬ ਹੋਣ ਨਾਲ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਅਕਸਰ ਜੁੜੀ ਹੁੰਦੀ ਹੈ?",{
"Desertification":"ਮਾਰੂਥਲੀਕਰਨ","Glaciation":"ਹਿਮਾਨੀਕਰਨ","Sea-floor spreading":"ਸਮੁੰਦਰੀ ਤਲ ਦਾ ਫੈਲਾਅ","Urban agglomeration only":"ਕੇਵਲ ਸ਼ਹਿਰੀ ਇਕੱਠ"},"ਸੁੱਕੀ ਜ਼ਮੀਨ ਦਾ ਲਗਾਤਾਰ ਖ਼ਰਾਬ ਹੋਣਾ ਮਾਰੂਥਲ ਵਰਗੀਆਂ ਹਾਲਤਾਂ ਪੈਦਾ ਕਰ ਸਕਦਾ ਹੈ।"),
"GEO-LND-001-CP002-Q004":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਜ਼ਮੀਨ ਮਨੁੱਖੀ ਗਤੀਵਿਧੀਆਂ ਕਾਰਨ ਖ਼ਰਾਬ ਹੋ ਸਕਦੀ ਹੈ। II. ਕੁਦਰਤੀ ਪ੍ਰਕਿਰਿਆਵਾਂ ਵੀ ਇਸ ਵਿੱਚ ਯੋਗਦਾਨ ਪਾ ਸਕਦੀਆਂ ਹਨ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਜ਼ਮੀਨ ਦੀ ਗਲਤ ਵਰਤੋਂ ਅਤੇ ਕੁਦਰਤੀ ਕਟਾਅ ਜਾਂ ਸੁੱਕਾਪਣ, ਦੋਵੇਂ ਜ਼ਮੀਨ ਨੂੰ ਖ਼ਰਾਬ ਕਰ ਸਕਦੇ ਹਨ।"),
"GEO-LND-001-CP002-Q005":r("ਕਿਸੇ ਚਰਾਗਾਹ ਦੀ ਬਨਸਪਤੀ ਨਸ਼ਟ ਹੋ ਜਾਂਦੀ ਹੈ ਅਤੇ ਮਿੱਟੀ ਖੁੱਲ੍ਹੀ ਤੇ ਬੇਉਪਜ ਹੋ ਜਾਂਦੀ ਹੈ। ਇਹ ਕੀ ਦਰਸਾਉਂਦਾ ਹੈ?",{
"Land degradation":"ਜ਼ਮੀਨ ਦਾ ਖ਼ਰਾਬ ਹੋਣਾ","Urbanisation":"ਸ਼ਹਿਰੀਕਰਨ","Population growth":"ਆਬਾਦੀ ਵਾਧਾ","Irrigation expansion":"ਸਿੰਚਾਈ ਦਾ ਫੈਲਾਅ"},"ਬਨਸਪਤੀ ਅਤੇ ਉਤਪਾਦਕਤਾ ਦਾ ਘਟਣਾ ਜ਼ਮੀਨ ਦੇ ਖ਼ਰਾਬ ਹੋਣ ਦਾ ਸੰਕੇਤ ਹੈ।"),
"GEO-LND-001-CP002-Q006":r("ਮਿੱਟੀ ਕਟਾਅ ਜ਼ਮੀਨ ਨੂੰ ਕਿਵੇਂ ਖ਼ਰਾਬ ਕਰਦਾ ਹੈ?",{
"It removes fertile topsoil":"ਇਹ ਉਪਜਾਊ ਉੱਪਰੀ ਮਿੱਟੀ ਨੂੰ ਹਟਾ ਦਿੰਦਾ ਹੈ","It adds humus":"ਇਹ ਹਿਊਮਸ ਵਧਾਉਂਦਾ ਹੈ","It increases soil depth":"ਇਹ ਮਿੱਟੀ ਦੀ ਡੂੰਘਾਈ ਵਧਾਉਂਦਾ ਹੈ","It always improves moisture":"ਇਹ ਹਮੇਸ਼ਾਂ ਨਮੀ ਸੁਧਾਰਦਾ ਹੈ"},"ਉੱਪਰੀ ਮਿੱਟੀ ਵਿੱਚ ਬਹੁਤੇ ਪੋਸ਼ਕ ਤੱਤ ਅਤੇ ਜੈਵਿਕ ਪਦਾਰਥ ਹੁੰਦੇ ਹਨ; ਇਸ ਦੇ ਹਟਣ ਨਾਲ ਜ਼ਮੀਨ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਘਟਦੀ ਹੈ।"),
"GEO-LND-001-CP002-Q007":r("ਢਲਾਣਾਂ ਉੱਤੇ ਪਾਣੀ ਨਾਲ ਹੋਣ ਵਾਲੇ ਮਿੱਟੀ ਕਟਾਅ ਨੂੰ ਕਿਹੜਾ ਕਾਰਕ ਤੇਜ਼ ਕਰ ਸਕਦਾ ਹੈ?",{
"Removal of vegetation":"ਬਨਸਪਤੀ ਹਟਾਉਣਾ","Contour farming":"ਢਲਾਣ ਦੀ ਸਮਾਨ ਉਚਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਅਨੁਸਾਰ ਖੇਤੀ","Terracing":"ਪੌੜੀਦਾਰ ਖੇਤੀ","Grass cover":"ਘਾਹ ਦਾ ਢੱਕਣ"},"ਖੁੱਲ੍ਹੀਆਂ ਢਲਾਣਾਂ ਉੱਤੇ ਵਰਖਾ ਦਾ ਵਹਾਅ ਮਿੱਟੀ ਨੂੰ ਹੋਰ ਤੇਜ਼ੀ ਨਾਲ ਵਗਾ ਲੈ ਜਾਂਦਾ ਹੈ।"),
"GEO-LND-001-CP002-Q008":r("ਸੁੱਕੇ ਅਤੇ ਰੇਤਲੇ ਖੇਤਰਾਂ ਵਿੱਚ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਆਮ ਹੈ?",{
"Wind erosion":"ਹਵਾ ਨਾਲ ਮਿੱਟੀ ਕਟਾਅ","Glacial deposition only":"ਕੇਵਲ ਹਿਮਾਨੀ ਜਮਾਵ","Tidal erosion only":"ਕੇਵਲ ਜਵਾਰੀ ਕਟਾਅ","River meandering only":"ਕੇਵਲ ਨਦੀ ਦਾ ਵਕਰਦਾਰ ਵਹਾਅ"},"ਜਿੱਥੇ ਬਨਸਪਤੀ ਘੱਟ ਹੋਵੇ, ਉੱਥੇ ਤੇਜ਼ ਹਵਾਵਾਂ ਢਿੱਲੀ ਅਤੇ ਸੁੱਕੀ ਮਿੱਟੀ ਨੂੰ ਉਡਾ ਸਕਦੀਆਂ ਹਨ।"),
"GEO-LND-001-CP002-Q009":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਮਿੱਟੀ ਕਟਾਅ ਉਪਜਾਊ ਸ਼ਕਤੀ ਘਟਾ ਸਕਦਾ ਹੈ। II. ਬਨਸਪਤੀ ਦਾ ਢੱਕਣ ਮਿੱਟੀ ਦੀ ਰੱਖਿਆ ਕਰਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਬਨਸਪਤੀ ਪਾਣੀ ਦੇ ਵਹਾਅ ਅਤੇ ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ ਘਟਾਉਂਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਮਿੱਟੀ ਦਾ ਨੁਕਸਾਨ ਘਟਦਾ ਹੈ।"),
"GEO-LND-001-CP002-Q010":r("ਭਾਰੀ ਵਰਖਾ ਦੌਰਾਨ ਇੱਕ ਖੁੱਲ੍ਹਾ ਖੇਤ ਆਪਣੀ ਉਪਜਾਊ ਉੱਪਰੀ ਮਿੱਟੀ ਗੁਆ ਲੈਂਦਾ ਹੈ। ਜ਼ਮੀਨ ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਖ਼ਰਾਬ ਹੋਈ?",{
"Soil erosion":"ਮਿੱਟੀ ਕਟਾਅ","Groundwater recharge":"ਭੂਜਲ ਪੁਨਰਭਰਨ","Afforestation":"ਰੁੱਖ ਲਗਾਉਣਾ","Urban planning":"ਸ਼ਹਿਰੀ ਯੋਜਨਾਬੰਦੀ"},"ਵਰਖਾ ਦਾ ਵਹਾਅ ਉਪਜਾਊ ਉੱਪਰੀ ਮਿੱਟੀ ਨੂੰ ਵਗਾ ਕੇ ਲੈ ਗਿਆ ਹੈ।"),
"GEO-LND-001-CP002-Q011":r("ਜ਼ਿਆਦਾ ਚਰਾਈ ਜ਼ਮੀਨ ਨੂੰ ਕਿਵੇਂ ਖ਼ਰਾਬ ਕਰ ਸਕਦੀ ਹੈ?",{
"It removes protective vegetation faster than it can recover":"ਇਹ ਰੱਖਿਆ ਕਰਨ ਵਾਲੀ ਬਨਸਪਤੀ ਨੂੰ ਉਸਦੇ ਮੁੜ ਵਧਣ ਨਾਲੋਂ ਤੇਜ਼ੀ ਨਾਲ ਹਟਾ ਦਿੰਦੀ ਹੈ","It always increases forest cover":"ਇਹ ਹਮੇਸ਼ਾਂ ਜੰਗਲ ਖੇਤਰ ਵਧਾਉਂਦੀ ਹੈ","It reduces erosion":"ਇਹ ਕਟਾਅ ਘਟਾਉਂਦੀ ਹੈ","It increases humus automatically":"ਇਹ ਆਪਣੇ-ਆਪ ਹਿਊਮਸ ਵਧਾਉਂਦੀ ਹੈ"},"ਜ਼ਿਆਦਾ ਚਰਾਈ ਮਿੱਟੀ ਨੂੰ ਖੁੱਲ੍ਹਾ ਛੱਡ ਦਿੰਦੀ ਹੈ ਅਤੇ ਪੌਦਿਆਂ ਦੇ ਮੁੜ ਵਧਣ ਨੂੰ ਰੋਕਦੀ ਹੈ।"),
"GEO-LND-001-CP002-Q012":r("ਖਣਨ ਜ਼ਮੀਨ ਨੂੰ ਕਿਵੇਂ ਖ਼ਰਾਬ ਕਰ ਸਕਦਾ ਹੈ?",{
"Excavation and waste dumps disturb soil and vegetation":"ਖੁਦਾਈ ਅਤੇ ਕੂੜੇ-ਮਲਬੇ ਦੇ ਢੇਰ ਮਿੱਟੀ ਤੇ ਬਨਸਪਤੀ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾਉਂਦੇ ਹਨ","It always improves soil structure":"ਇਹ ਹਮੇਸ਼ਾਂ ਮਿੱਟੀ ਦੀ ਬਣਤਰ ਸੁਧਾਰਦਾ ਹੈ","It creates forests automatically":"ਇਹ ਆਪਣੇ-ਆਪ ਜੰਗਲ ਬਣਾਉਂਦਾ ਹੈ","It reduces all erosion":"ਇਹ ਹਰ ਕਿਸਮ ਦੇ ਕਟਾਅ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ"},"ਖਣਨ ਨਾਲ ਖੱਡਾਂ, ਮਲਬੇ ਦੇ ਢੇਰ ਅਤੇ ਪ੍ਰਦੂਸ਼ਿਤ ਸਤਹਾਂ ਰਹਿ ਸਕਦੀਆਂ ਹਨ।"),
"GEO-LND-001-CP002-Q013":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਜ਼ਿਆਦਾ ਚਰਾਈ ਮਿੱਟੀ ਨੂੰ ਖੁੱਲ੍ਹਾ ਕਰ ਸਕਦੀ ਹੈ। II. ਢੰਗ ਨਾਲ ਮੁੜ-ਸੁਧਾਰ ਨਾ ਹੋਵੇ ਤਾਂ ਖਣਨ ਬੰਜਰ ਜ਼ਮੀਨ ਛੱਡ ਸਕਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਬਿਨਾਂ ਢੰਗ ਦੇ ਪ੍ਰਬੰਧ ਦੇ ਜ਼ਿਆਦਾ ਚਰਾਈ ਅਤੇ ਖਣਨ ਦੋਵੇਂ ਜ਼ਮੀਨ ਨੂੰ ਗੰਭੀਰ ਤੌਰ ਤੇ ਖ਼ਰਾਬ ਕਰ ਸਕਦੇ ਹਨ।"),
"GEO-LND-001-CP002-Q014":r("ਗਤੀਵਿਧੀ ਅਤੇ ਜ਼ਮੀਨ ਉੱਤੇ ਉਸਦੇ ਪ੍ਰਭਾਵ ਦੀ ਸਹੀ ਜੋੜੀ ਕਿਹੜੀ ਹੈ?",{
"Mining — surface disturbance":"ਖਣਨ — ਜ਼ਮੀਨੀ ਸਤਹ ਵਿੱਚ ਵਿਗਾੜ","Afforestation — vegetation removal":"ਰੁੱਖ ਲਗਾਉਣਾ — ਬਨਸਪਤੀ ਹਟਾਉਣਾ","Contour ploughing — gully formation":"ਸਮਾਨ ਉਚਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਅਨੁਸਾਰ ਹਲ ਚਲਾਉਣਾ — ਖੱਡਾਂ ਬਣਨਾ","Check dams — wind erosion":"ਛੋਟੇ ਰੋਕ ਬੰਨ੍ਹ — ਹਵਾ ਨਾਲ ਮਿੱਟੀ ਕਟਾਅ"},"ਖਣਨ ਸਿੱਧੇ ਤੌਰ ਤੇ ਜ਼ਮੀਨ ਦੀ ਸਤਹ ਨੂੰ ਬਦਲਦਾ ਅਤੇ ਖ਼ਰਾਬ ਕਰਦਾ ਹੈ।"),
"GEO-LND-001-CP002-Q015":r("ਇੱਕ ਸੁੱਕੇ ਚਰਾਗਾਹ ਵਿੱਚ ਬਹੁਤ ਵੱਧ ਪਸ਼ੂ ਚਰਾਈ ਕਾਰਨ ਬਨਸਪਤੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ। ਜ਼ਮੀਨ ਖ਼ਰਾਬ ਹੋਣ ਦਾ ਮੁੱਖ ਕਾਰਨ ਕੀ ਹੈ?",{
"Overgrazing":"ਜ਼ਿਆਦਾ ਚਰਾਈ","Afforestation":"ਰੁੱਖ ਲਗਾਉਣਾ","Terracing":"ਪੌੜੀਦਾਰ ਖੇਤੀ","Rainwater harvesting":"ਮੀਂਹ ਦੇ ਪਾਣੀ ਦੀ ਸੰਭਾਲ"},"ਜ਼ਿਆਦਾ ਚਰਾਈ ਬਨਸਪਤੀ ਨੂੰ ਮੁੜ ਵਧਣ ਲਈ ਸਮਾਂ ਨਹੀਂ ਦਿੰਦੀ।"),
"GEO-LND-001-CP002-Q016":r("ਜ਼ਿਆਦਾ ਸਿੰਚਾਈ ਨਾਲ ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨ ਦੀ ਸਮੱਸਿਆ ਕਿਵੇਂ ਹੋ ਸਕਦੀ ਹੈ?",{
"Water table rises close to the surface":"ਭੂਜਲ ਪੱਧਰ ਸਤਹ ਦੇ ਬਹੁਤ ਨੇੜੇ ਆ ਜਾਂਦਾ ਹੈ","Groundwater disappears instantly":"ਭੂਜਲ ਤੁਰੰਤ ਖਤਮ ਹੋ ਜਾਂਦਾ ਹੈ","Soil dries completely":"ਮਿੱਟੀ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁੱਕ ਜਾਂਦੀ ਹੈ","Rainfall stops":"ਵਰਖਾ ਰੁਕ ਜਾਂਦੀ ਹੈ"},"ਖਰਾਬ ਨਿਕਾਸ ਅਤੇ ਵੱਧ ਸਿੰਚਾਈ ਨਾਲ ਜੜਾਂ ਵਾਲਾ ਖੇਤਰ ਪਾਣੀ ਨਾਲ ਭਰ ਸਕਦਾ ਹੈ।"),
"GEO-LND-001-CP002-Q017":r("ਸਿੰਚਾਈ ਵਾਲੇ ਸੁੱਕੇ ਖੇਤਰਾਂ ਵਿੱਚ ਮਿੱਟੀ ਦਾ ਲੂਣਾਪਣ ਕਿਵੇਂ ਵਧ ਸਕਦਾ ਹੈ?",{
"Evaporation leaves dissolved salts in the soil":"ਬਾਫ਼ ਬਣਨ ਤੋਂ ਬਾਅਦ ਘੁੱਲੇ ਲੂਣ ਮਿੱਟੀ ਵਿੱਚ ਰਹਿ ਜਾਂਦੇ ਹਨ","Rain removes all salts permanently":"ਵਰਖਾ ਸਾਰੇ ਲੂਣ ਸਦਾ ਲਈ ਹਟਾ ਦਿੰਦੀ ਹੈ","Plants create sea water":"ਪੌਦੇ ਸਮੁੰਦਰੀ ਪਾਣੀ ਬਣਾਉਂਦੇ ਹਨ","Soil has no minerals":"ਮਿੱਟੀ ਵਿੱਚ ਕੋਈ ਖਣਿਜ ਨਹੀਂ ਹੁੰਦਾ"},"ਵੱਧ ਬਾਫ਼ ਬਣਨ ਅਤੇ ਖਰਾਬ ਨਿਕਾਸ ਨਾਲ ਮਿੱਟੀ ਵਿੱਚ ਲੂਣ ਇਕੱਠੇ ਹੋ ਸਕਦੇ ਹਨ।"),
"GEO-LND-001-CP002-Q018":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨਾ ਫਸਲਾਂ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾ ਸਕਦਾ ਹੈ। II. ਲੂਣਾਪਣ ਮਿੱਟੀ ਦੀ ਉਤਪਾਦਕਤਾ ਘਟਾ ਸਕਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਪਾਣੀ ਖੜ੍ਹਨਾ ਅਤੇ ਲੂਣਾਪਣ ਦੋਵੇਂ ਸਿੰਚਾਈ ਨਾਲ ਜੁੜੀਆਂ ਮਹੱਤਵਪੂਰਨ ਜ਼ਮੀਨੀ ਸਮੱਸਿਆਵਾਂ ਹਨ।"),
"GEO-LND-001-CP002-Q019":r("ਕਿਹੜਾ ਉਪਾਅ ਸਿੰਚਾਈ ਕਾਰਨ ਮਿੱਟੀ ਵਿੱਚ ਲੂਣ ਵਧਣ ਤੋਂ ਰੋਕਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ?",{
"Adequate drainage":"ਢੁੱਕਵਾਂ ਪਾਣੀ ਨਿਕਾਸ","Unlimited flooding":"ਬੇਹਿਸਾਬ ਪਾਣੀ ਭਰਨਾ","Blocking all drains":"ਸਾਰੇ ਨਿਕਾਸ ਬੰਦ ਕਰਨਾ","Over-irrigation":"ਜ਼ਿਆਦਾ ਸਿੰਚਾਈ"},"ਚੰਗਾ ਨਿਕਾਸ ਜੜਾਂ ਵਾਲੇ ਖੇਤਰ ਤੋਂ ਵਾਧੂ ਪਾਣੀ ਅਤੇ ਲੂਣ ਹਟਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"),
"GEO-LND-001-CP002-Q020":r("ਸਿੰਚਾਈ ਵਾਲੇ ਖੇਤ ਦੀ ਸਤਹ ਉੱਤੇ ਚਿੱਟੀ ਲੂਣੀ ਪਰਤ ਬਣ ਜਾਂਦੀ ਹੈ ਅਤੇ ਫਸਲ ਕਮਜ਼ੋਰ ਹੋ ਜਾਂਦੀ ਹੈ। ਸਭ ਤੋਂ ਸੰਭਾਵੀ ਸਮੱਸਿਆ ਕੀ ਹੈ?",{
"Soil salinity":"ਮਿੱਟੀ ਦਾ ਲੂਣਾਪਣ","Afforestation":"ਰੁੱਖ ਲਗਾਉਣਾ","River deposition":"ਨਦੀ ਜਮਾਵ","Urbanisation":"ਸ਼ਹਿਰੀਕਰਨ"},"ਸਤਹ ਉੱਤੇ ਲੂਣ ਇਕੱਠਾ ਹੋਣਾ ਮਿੱਟੀ ਦੇ ਲੂਣਾਪਣ ਦਾ ਸਪਸ਼ਟ ਸੰਕੇਤ ਹੈ।"),
"GEO-LND-001-CP002-Q021":r("ਢਲਾਣਾਂ ਉੱਤੇ ਮਿੱਟੀ ਕਟਾਅ ਘਟਾਉਣ ਵਾਲਾ ਢੰਗ ਕਿਹੜਾ ਹੈ?",{
"Terracing":"ਪੌੜੀਦਾਰ ਖੇਤੀ","Removing all vegetation":"ਸਾਰੀ ਬਨਸਪਤੀ ਹਟਾਉਣਾ","Ploughing straight down steep slopes":"ਤਿੱਖੀ ਢਲਾਣ ਉੱਤੇ ਸਿੱਧਾ ਹੇਠਾਂ ਵੱਲ ਹਲ ਚਲਾਉਣਾ","Overgrazing":"ਜ਼ਿਆਦਾ ਚਰਾਈ"},"ਪੌੜੀਆਂ ਢਲਾਣ ਦੀ ਲੰਬਾਈ ਘਟਾਉਂਦੀਆਂ ਹਨ ਅਤੇ ਪਾਣੀ ਦੇ ਵਹਾਅ ਦੀ ਰਫ਼ਤਾਰ ਹੌਲੀ ਕਰਦੀਆਂ ਹਨ।"),
"GEO-LND-001-CP002-Q022":r("ਹਵਾ ਨਾਲ ਮਿੱਟੀ ਕਟਾਅ ਘਟਾਉਣ ਵਿੱਚ ਕਿਹੜਾ ਢੰਗ ਮਦਦਗਾਰ ਹੈ?",{
"Shelterbelts":"ਹਵਾ ਰੋਕਣ ਵਾਲੀਆਂ ਰੁੱਖਾਂ ਦੀਆਂ ਕਤਾਰਾਂ","Bare fallow everywhere":"ਹਰ ਥਾਂ ਖੁੱਲ੍ਹੀ ਪਰਤੀ ਜ਼ਮੀਨ","Deforestation":"ਜੰਗਲਾਂ ਦੀ ਕਟਾਈ","Sand removal only":"ਕੇਵਲ ਰੇਤ ਹਟਾਉਣਾ"},"ਰੁੱਖਾਂ ਦੀਆਂ ਕਤਾਰਾਂ ਜ਼ਮੀਨ ਦੇ ਨੇੜੇ ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ ਘਟਾਉਂਦੀਆਂ ਹਨ।"),
"GEO-LND-001-CP002-Q023":r("ਖ਼ਰਾਬ ਹੋਈ ਜ਼ਮੀਨ ਨੂੰ ਮੁੜ ਸੁਧਾਰਨ ਵਿੱਚ ਕਿਹੜਾ ਢੰਗ ਮਦਦਗਾਰ ਹੈ?",{
"Afforestation":"ਰੁੱਖ ਲਗਾਉਣਾ","Open-cast dumping without reclamation":"ਮੁੜ-ਸੁਧਾਰ ਤੋਂ ਬਿਨਾਂ ਖੁੱਲ੍ਹੀ ਖਾਣ ਦਾ ਮਲਬਾ ਸੁੱਟਣਾ","Overgrazing":"ਜ਼ਿਆਦਾ ਚਰਾਈ","Burning vegetation repeatedly":"ਬਨਸਪਤੀ ਨੂੰ ਵਾਰ-ਵਾਰ ਸਾੜਨਾ"},"ਰੁੱਖ ਅਤੇ ਘਾਹ ਦਾ ਢੱਕਣ ਮਿੱਟੀ ਨੂੰ ਥਿਰ ਕਰਦਾ ਹੈ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਕੁਦਰਤੀ ਸਮਰੱਥਾ ਮੁੜ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"),
"GEO-LND-001-CP002-Q024":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਢਲਾਣ ਦੀ ਸਮਾਨ ਉਚਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਅਨੁਸਾਰ ਹਲ ਚਲਾਉਣਾ ਪਾਣੀ ਦੇ ਵਹਾਅ ਨੂੰ ਹੌਲਾ ਕਰਦਾ ਹੈ। II. ਰੁੱਖ ਲਗਾਉਣਾ ਮਿੱਟੀ ਨੂੰ ਥਿਰ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਦੋਵੇਂ ਮਿੱਟੀ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਸੰਭਾਲ ਦੇ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਢੰਗ ਹਨ।"),
"GEO-LND-001-CP002-Q025":r("ਕਿਸਾਨ ਢਲਾਣ ਦੇ ਸਿੱਧੇ ਹੇਠਾਂ ਵੱਲ ਹਲ ਚਲਾਉਣ ਦੀ ਬਜਾਇ ਸਮਾਨ ਉਚਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਦੇ ਨਾਲ ਹਲ ਚਲਾਉਂਦਾ ਹੈ। ਇਹ ਕਿਹੜਾ ਸੰਭਾਲ ਢੰਗ ਹੈ?",{
"Contour ploughing":"ਸਮਾਨ ਉਚਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਅਨੁਸਾਰ ਹਲ ਚਲਾਉਣਾ","Strip mining":"ਪੱਟੀ ਖਣਨ","Over-irrigation":"ਜ਼ਿਆਦਾ ਸਿੰਚਾਈ","Urban zoning":"ਸ਼ਹਿਰੀ ਖੇਤਰ-ਵੰਡ"},"ਸਮਾਨ ਉਚਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਦੇ ਨਾਲ ਹਲ ਚਲਾਉਣ ਨਾਲ ਪਾਣੀ ਦਾ ਵਹਾਅ ਅਤੇ ਮਿੱਟੀ ਦਾ ਨੁਕਸਾਨ ਘਟਦਾ ਹੈ।")
});

export function localizeGeoLnd001ExactCp002(question:CanonicalQuestion,language:Lang){
 const rec=(language==="hi"?HI:PA)[question.questionId]; if(!rec)return null;
 const options=question.options.map(source=>{const t=rec.optionBySource[source];if(!t)throw new Error(`Missing GEO-LND-001 CP002 ${language} option translation for ${question.questionId}: ${source}`);return t;});
 return Object.freeze({stem:rec.stem,options:Object.freeze(options),canonicalAnswer:options[question.correctIndex]!,explanation:rec.explanation});
}
