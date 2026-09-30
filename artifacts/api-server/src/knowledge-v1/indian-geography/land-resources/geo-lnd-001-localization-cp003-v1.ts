type CanonicalQuestion=Readonly<{questionId:string;options:readonly string[];correctIndex:number;}>;
type Lang="hi"|"pa";
type ExactRecord=Readonly<{stem:string;optionBySource:Readonly<Record<string,string>>;explanation:string}>;
const r=(stem:string,optionBySource:Record<string,string>,explanation:string):ExactRecord=>Object.freeze({stem,optionBySource:Object.freeze(optionBySource),explanation});

const HI:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-LND-001-CP003-Q001":r("मरुस्थलीकरण क्या है?",{
"Land degradation in dry areas leading to desert-like conditions":"शुष्क क्षेत्रों में भूमि क्षरण जिससे मरुस्थल जैसी परिस्थितियां बनती हैं","Expansion of ocean water":"समुद्री जल का विस्तार","Urban growth only":"केवल शहरी वृद्धि","Formation of glaciers":"हिमनदों का निर्माण"},"मरुस्थलीकरण से शुष्क और अर्ध-शुष्क क्षेत्रों में वनस्पति तथा भूमि की उत्पादकता घटती है।"),
"GEO-LND-001-CP003-Q002":r("कौन-सी मानवीय गतिविधि मरुस्थलीकरण को बढ़ावा दे सकती है?",{
"Overgrazing":"अत्यधिक चराई","Afforestation":"वनीकरण","Controlled irrigation":"नियंत्रित सिंचाई","Watershed treatment":"जलागम उपचार"},"वनस्पति के नष्ट होने से शुष्क भूमि की मिट्टी हवा और पानी के कटाव के प्रति अधिक संवेदनशील हो जाती है।"),
"GEO-LND-001-CP003-Q003":r("कौन-सी जलवायवीय स्थिति मरुस्थलीकरण का जोखिम बढ़ाती है?",{
"Prolonged drought":"लंबा सूखा","High year-round humidity":"पूरे वर्ष अधिक आर्द्रता","Permanent snow":"स्थायी हिम","Frequent flooding only":"केवल बार-बार बाढ़"},"लंबे समय तक सूखा रहने से वनस्पति कमजोर होती है और मिट्टी खुली पड़ जाती है।"),
"GEO-LND-001-CP003-Q004":r("कथनों पर विचार करें: I. मरुस्थलीकरण मौजूदा मरुस्थलों के बाहर भी हो सकता है। II. यह भूमि क्षरण का एक रूप है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"शुष्क भूमि का क्षरण अर्ध-शुष्क क्षेत्रों में भी मरुस्थल जैसी परिस्थितियां फैला सकता है।"),
"GEO-LND-001-CP003-Q005":r("एक अर्ध-शुष्क चरागाह में समय के साथ वनस्पति, मिट्टी और उत्पादकता घटती जाती है। कौन-सी प्रक्रिया हो सकती है?",{
"Desertification":"मरुस्थलीकरण","Glaciation":"हिमानीकरण","Urban agglomeration":"शहरी संकुलन","River rejuvenation":"नदी पुनर्यौवन"},"शुष्क भूमि का धीरे-धीरे क्षरण मरुस्थलीकरण कहलाता है।"),
"GEO-LND-001-CP003-Q006":r("बंजर अथवा अनुपयोगी भूमि से क्या आशय है?",{
"Land currently degraded or underused with low productive value":"ऐसी भूमि जो वर्तमान में क्षतिग्रस्त या कम उपयोग में है और जिसकी उत्पादकता कम है","All fertile cropland":"सारी उपजाऊ कृषि भूमि","All forest land":"सारी वन भूमि","All urban land":"सारी शहरी भूमि"},"ऐसी भूमि की वर्तमान उत्पादकता कम होती है, अक्सर क्षरण या कठिन प्राकृतिक परिस्थितियों के कारण।"),
"GEO-LND-001-CP003-Q007":r("बीहड़ भूमि के सुधार में कौन-सा उपाय सहायक हो सकता है?",{
"Gully control and vegetation":"गली कटाव नियंत्रण और वनस्पति","More uncontrolled runoff":"और अधिक अनियंत्रित बहाव","Removing all plants":"सभी पौधे हटाना","Deepening gullies":"गलियों को और गहरा करना"},"गलियों को स्थिर करना और वनस्पति पुनः स्थापित करना मृदा अपरदन कम कर सकता है।"),
"GEO-LND-001-CP003-Q008":r("लवणीय भूमि के सुधार में कौन-सा उपाय सहायक हो सकता है?",{
"Drainage and suitable soil-water management":"जल निकास और उचित मृदा-जल प्रबंधन","Adding more salt":"और अधिक नमक डालना","Blocking drains":"नालियां बंद करना","Over-irrigating continuously":"लगातार अत्यधिक सिंचाई करना"},"अच्छा जल निकास और उचित प्रबंधन मिट्टी में लवण के जमाव को कम कर सकता है।"),
"GEO-LND-001-CP003-Q009":r("कथनों पर विचार करें: I. कुछ अनुपयोगी भूमि का सुधार किया जा सकता है। II. सुधार की विधि भूमि क्षरण के कारण पर निर्भर करती है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"अलग-अलग प्रकार के भूमि क्षरण के लिए अलग-अलग पुनर्सुधार उपाय आवश्यक होते हैं।"),
"GEO-LND-001-CP003-Q010":r("एक क्षतिग्रस्त गलीदार क्षेत्र में चेक डैम और घास लगाई जाती है। इसका उद्देश्य क्या है?",{
"Land reclamation":"भूमि पुनर्सुधार","Urban expansion":"शहरी विस्तार","Mining intensification":"खनन तीव्रीकरण","Forest clearing":"वन सफाई"},"इन उपायों का उद्देश्य भूमि की उत्पादकता बहाल करना और अपरदन कम करना है।"),
"GEO-LND-001-CP003-Q011":r("सामुदायिक संपत्ति संसाधन क्या होते हैं?",{
"Resources used collectively by a community":"समुदाय द्वारा सामूहिक रूप से उपयोग किए जाने वाले संसाधन","Only privately owned factories":"केवल निजी स्वामित्व वाले कारखाने","Only central government offices":"केवल केंद्र सरकार के कार्यालय","Only individual houses":"केवल व्यक्तिगत मकान"},"गांव के चरागाह, तालाब और सामुदायिक वन साझा संसाधनों के उदाहरण हैं।"),
"GEO-LND-001-CP003-Q012":r("सामुदायिक संपत्ति संसाधन का उदाहरण कौन-सा है?",{
"Village grazing land":"गांव का चरागाह","Private house plot":"निजी मकान का प्लॉट","Individual factory site":"व्यक्तिगत कारखाना स्थल","Personal vehicle":"निजी वाहन"},"सामुदायिक चरागाह का उपयोग अनेक परिवार मिलकर करते हैं।"),
"GEO-LND-001-CP003-Q013":r("ग्रामीण क्षेत्रों में सामुदायिक संपत्ति संसाधन महत्वपूर्ण क्यों हैं?",{
"They support grazing, fuel, water and livelihoods":"वे चराई, ईंधन, पानी और आजीविका में सहायता करते हैं","They have no livelihood role":"उनकी आजीविका में कोई भूमिका नहीं","They are always unused":"वे हमेशा अनुपयोगी रहते हैं","They only support airports":"वे केवल हवाई अड्डों के काम आते हैं"},"साझा संसाधन विशेष रूप से गरीब परिवारों और पशुपालन की आजीविका में महत्वपूर्ण होते हैं।"),
"GEO-LND-001-CP003-Q014":r("कथनों पर विचार करें: I. अत्यधिक उपयोग से सामुदायिक भूमि क्षतिग्रस्त हो सकती है। II. सामुदायिक प्रबंधन टिकाऊ उपयोग में सुधार कर सकता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"सामूहिक नियम साझा भूमि के अनियंत्रित उपयोग और क्षरण को कम कर सकते हैं।"),
"GEO-LND-001-CP003-Q015":r("एक गांव कई परिवारों द्वारा उपयोग किए जाने वाले चरागाह का संयुक्त प्रबंधन करता है। यह किस प्रकार का संसाधन है?",{
"Common property resource":"सामुदायिक संपत्ति संसाधन","Private industrial land":"निजी औद्योगिक भूमि","Urban built-up land":"शहरी निर्मित भूमि","Net sown area only":"केवल शुद्ध बोया गया क्षेत्र"},"समुदाय द्वारा साझा उपयोग सामुदायिक संपत्ति संसाधन की मुख्य पहचान है।"),
"GEO-LND-001-CP003-Q016":r("टिकाऊ भूमि प्रबंधन क्या है?",{
"Using land while maintaining long-term productivity and ecological function":"भूमि का उपयोग करते हुए उसकी दीर्घकालीन उत्पादकता और पारिस्थितिक कार्य बनाए रखना","Maximising short-term extraction regardless of damage":"नुकसान की परवाह किए बिना अल्पकालीन दोहन अधिकतम करना","Removing all vegetation":"सारी वनस्पति हटाना","Ignoring soil loss":"मिट्टी के नुकसान की उपेक्षा करना"},"टिकाऊ प्रबंधन उपयोग और संरक्षण के बीच संतुलन बनाता है।"),
"GEO-LND-001-CP003-Q017":r("कौन-सा तरीका कृषि भूमि के टिकाऊ उपयोग में सहायक है?",{
"Crop rotation and soil conservation":"फसल चक्र और मृदा संरक्षण","Continuous erosion":"लगातार अपरदन","Overgrazing":"अत्यधिक चराई","Uncontrolled salinity":"अनियंत्रित लवणता"},"मिट्टी की संरचना और उर्वरता बनाए रखना दीर्घकालीन उत्पादकता के लिए आवश्यक है।"),
"GEO-LND-001-CP003-Q018":r("योजना में भूमि क्षमता महत्वपूर्ण क्यों है?",{
"Land should be used according to its physical suitability":"भूमि का उपयोग उसकी भौतिक उपयुक्तता के अनुसार होना चाहिए","Every land type is equally suitable for every use":"हर प्रकार की भूमि हर उपयोग के लिए समान रूप से उपयुक्त है","Steep slopes are ideal for all construction":"खड़ी ढालें सभी निर्माण के लिए आदर्श हैं","Wetlands should always be converted":"आर्द्रभूमि को हमेशा बदल देना चाहिए"},"भूमि की क्षमता के अनुरूप उपयोग करने से क्षरण और नुकसान कम होता है।"),
"GEO-LND-001-CP003-Q019":r("कथनों पर विचार करें: I. टिकाऊ भूमि उपयोग भविष्य की उत्पादकता को ध्यान में रखता है। II. यह पारिस्थितिक सीमाओं को भी ध्यान में रखता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं","Only I is correct":"केवल I सही है","Only II is correct":"केवल II सही है","Neither I nor II is correct":"न तो I और न ही II सही है"},"दीर्घकालीन भूमि उपयोग में संसाधनों की प्राकृतिक सीमाओं का सम्मान आवश्यक है।"),
"GEO-LND-001-CP003-Q020":r("अपरदन-प्रवण खड़ी ढाल को गहन खेती के बजाय वन के अधीन रखा जाता है। कौन-सा सिद्धांत अपनाया गया है?",{
"Land capability-based use":"भूमि क्षमता के अनुसार उपयोग","Maximum short-term extraction":"अधिकतम अल्पकालीन दोहन","Urban sprawl":"अनियंत्रित शहरी फैलाव","Mining-first planning":"खनन को प्राथमिकता देने वाला नियोजन"},"यहां भूमि उपयोग को उसकी भौतिक उपयुक्तता के अनुसार चुना गया है।"),
"GEO-LND-001-CP003-Q021":r("कौन-सा संयोजन भूमि क्षरण की सबसे अधिक संभावना पैदा करता है?",{
"Deforestation, overgrazing and erosion":"वनों की कटाई, अत्यधिक चराई और अपरदन","Afforestation, terracing and contour farming":"वनीकरण, सीढ़ीदार खेती और समोच्च खेती","Recharge, shelterbelts and drainage":"पुनर्भरण, वायु-रोधक वृक्ष-पट्टियां और जल निकास","Watershed treatment and grass cover":"जलागम उपचार और घास का आवरण"},"पहला संयोजन भूमि की सुरक्षा हटाता है और मिट्टी के नुकसान को तेज करता है।"),
"GEO-LND-001-CP003-Q022":r("शुष्क भूमि के क्षरण को कम करने वाला सबसे उपयुक्त संयोजन कौन-सा है?",{
"Shelterbelts, controlled grazing and water conservation":"वायु-रोधक वृक्ष-पट्टियां, नियंत्रित चराई और जल संरक्षण","Deforestation and overgrazing":"वनों की कटाई और अत्यधिक चराई","Unlimited groundwater pumping":"असीमित भूजल दोहन","Bare soil and high runoff":"खुली मिट्टी और तेज बहाव"},"वनस्पति की रक्षा और सावधानी से पानी का उपयोग अपरदन तथा मरुस्थलीकरण को कम करता है।"),
"GEO-LND-001-CP003-Q023":r("खेती की गई और परती भूमि में सही अंतर कौन-सा है?",{
"Net sown area is cultivated; current fallow is temporarily uncultivated":"शुद्ध बोया गया क्षेत्र खेती के अधीन है; वर्तमान परती अस्थायी रूप से बिना खेती है","Both are forests":"दोनों वन हैं","Both are permanently barren":"दोनों स्थायी रूप से बंजर हैं","Current fallow is urban land":"वर्तमान परती शहरी भूमि है"},"दोनों श्रेणियों में अंतर इस बात से है कि संदर्भ वर्ष में भूमि पर खेती हुई या नहीं।"),
"GEO-LND-001-CP003-Q024":r("जलभराव और लवणता में सही अंतर कौन-सा है?",{
"Waterlogging means excess water; salinity means excess salts":"जलभराव का अर्थ अतिरिक्त पानी है; लवणता का अर्थ अतिरिक्त लवण हैं","Both mean wind erosion":"दोनों का अर्थ पवन अपरदन है","Both mean afforestation":"दोनों का अर्थ वनीकरण है","Both mean urbanisation":"दोनों का अर्थ शहरीकरण है"},"दोनों समस्याएं साथ हो सकती हैं, लेकिन जलभराव और लवणता अलग स्थितियां हैं।"),
"GEO-LND-001-CP003-Q025":r("एक क्षेत्र में खड़ी ढालों पर वन बचाए जाते हैं, कम ढाल वाली भूमि पर खेती की जाती है और गलियों का सुधार किया जाता है। यह कौन-सा दृष्टिकोण है?",{
"Sustainable land management":"टिकाऊ भूमि प्रबंधन","Random land use":"अनियोजित भूमि उपयोग","Maximum extraction":"अधिकतम दोहन","Unplanned expansion":"बिना योजना का विस्तार"},"भूमि उपयोग को उसकी क्षमता और संरक्षण की आवश्यकता के अनुसार चुना जा रहा है।")
});

const PA:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-LND-001-CP003-Q001":r("ਮਾਰੂਥਲੀਕਰਨ ਕੀ ਹੈ?",{
"Land degradation in dry areas leading to desert-like conditions":"ਸੁੱਕੇ ਖੇਤਰਾਂ ਵਿੱਚ ਜ਼ਮੀਨ ਦਾ ਖ਼ਰਾਬ ਹੋਣਾ, ਜਿਸ ਨਾਲ ਮਾਰੂਥਲ ਵਰਗੀਆਂ ਹਾਲਤਾਂ ਬਣਦੀਆਂ ਹਨ","Expansion of ocean water":"ਸਮੁੰਦਰੀ ਪਾਣੀ ਦਾ ਫੈਲਾਅ","Urban growth only":"ਕੇਵਲ ਸ਼ਹਿਰੀ ਵਾਧਾ","Formation of glaciers":"ਹਿਮਨਦਾਂ ਦਾ ਬਣਨਾ"},"ਮਾਰੂਥਲੀਕਰਨ ਨਾਲ ਸੁੱਕੇ ਅਤੇ ਅਰਧ-ਸੁੱਕੇ ਖੇਤਰਾਂ ਵਿੱਚ ਬਨਸਪਤੀ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਉਤਪਾਦਕਤਾ ਘਟਦੀ ਹੈ।"),
"GEO-LND-001-CP003-Q002":r("ਕਿਹੜੀ ਮਨੁੱਖੀ ਗਤੀਵਿਧੀ ਮਾਰੂਥਲੀਕਰਨ ਨੂੰ ਵਧਾ ਸਕਦੀ ਹੈ?",{
"Overgrazing":"ਜ਼ਿਆਦਾ ਚਰਾਈ","Afforestation":"ਰੁੱਖ ਲਗਾਉਣਾ","Controlled irrigation":"ਨਿਯੰਤਰਿਤ ਸਿੰਚਾਈ","Watershed treatment":"ਵਾਟਰਸ਼ੈੱਡ ਸੁਧਾਰ"},"ਬਨਸਪਤੀ ਦੇ ਨਸ਼ਟ ਹੋਣ ਨਾਲ ਸੁੱਕੀ ਜ਼ਮੀਨ ਦੀ ਮਿੱਟੀ ਹਵਾ ਅਤੇ ਪਾਣੀ ਦੇ ਕਟਾਅ ਲਈ ਹੋਰ ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਜਾਂਦੀ ਹੈ।"),
"GEO-LND-001-CP003-Q003":r("ਕਿਹੜੀ ਜਲਵਾਯੂ ਹਾਲਤ ਮਾਰੂਥਲੀਕਰਨ ਦਾ ਖ਼ਤਰਾ ਵਧਾਉਂਦੀ ਹੈ?",{
"Prolonged drought":"ਲੰਮਾ ਸੁੱਕਾ","High year-round humidity":"ਸਾਰਾ ਸਾਲ ਵੱਧ ਨਮੀ","Permanent snow":"ਸਥਾਈ ਬਰਫ਼","Frequent flooding only":"ਕੇਵਲ ਵਾਰ-ਵਾਰ ਹੜ੍ਹ"},"ਲੰਮੇ ਸਮੇਂ ਤੱਕ ਸੁੱਕਾ ਰਹਿਣ ਨਾਲ ਬਨਸਪਤੀ ਕਮਜ਼ੋਰ ਹੁੰਦੀ ਹੈ ਅਤੇ ਮਿੱਟੀ ਖੁੱਲ੍ਹੀ ਪੈ ਜਾਂਦੀ ਹੈ।"),
"GEO-LND-001-CP003-Q004":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਮਾਰੂਥਲੀਕਰਨ ਮੌਜੂਦਾ ਮਾਰੂਥਲਾਂ ਤੋਂ ਬਾਹਰ ਵੀ ਹੋ ਸਕਦਾ ਹੈ। II. ਇਹ ਜ਼ਮੀਨ ਦੇ ਖ਼ਰਾਬ ਹੋਣ ਦਾ ਇੱਕ ਰੂਪ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਸੁੱਕੀ ਜ਼ਮੀਨ ਦਾ ਖ਼ਰਾਬ ਹੋਣਾ ਅਰਧ-ਸੁੱਕੇ ਖੇਤਰਾਂ ਵਿੱਚ ਵੀ ਮਾਰੂਥਲ ਵਰਗੀਆਂ ਹਾਲਤਾਂ ਫੈਲਾ ਸਕਦਾ ਹੈ।"),
"GEO-LND-001-CP003-Q005":r("ਇੱਕ ਅਰਧ-ਸੁੱਕੇ ਚਰਾਗਾਹ ਵਿੱਚ ਸਮੇਂ ਨਾਲ ਬਨਸਪਤੀ, ਮਿੱਟੀ ਅਤੇ ਉਤਪਾਦਕਤਾ ਘਟਦੀ ਜਾਂਦੀ ਹੈ। ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਹੋ ਸਕਦੀ ਹੈ?",{
"Desertification":"ਮਾਰੂਥਲੀਕਰਨ","Glaciation":"ਹਿਮਾਨੀਕਰਨ","Urban agglomeration":"ਸ਼ਹਿਰੀ ਇਕੱਠ","River rejuvenation":"ਨਦੀ ਦਾ ਮੁੜ-ਜਵਾਨ ਹੋਣਾ"},"ਸੁੱਕੀ ਜ਼ਮੀਨ ਦਾ ਹੌਲੀ-ਹੌਲੀ ਖ਼ਰਾਬ ਹੋਣਾ ਮਾਰੂਥਲੀਕਰਨ ਹੈ।"),
"GEO-LND-001-CP003-Q006":r("ਬੰਜਰ ਜਾਂ ਘੱਟ ਵਰਤੀ ਜ਼ਮੀਨ ਤੋਂ ਕੀ ਭਾਵ ਹੈ?",{
"Land currently degraded or underused with low productive value":"ਅਜਿਹੀ ਜ਼ਮੀਨ ਜੋ ਇਸ ਵੇਲੇ ਖ਼ਰਾਬ ਜਾਂ ਘੱਟ ਵਰਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਜਿਸਦੀ ਉਤਪਾਦਕਤਾ ਘੱਟ ਹੈ","All fertile cropland":"ਸਾਰੀ ਉਪਜਾਊ ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ","All forest land":"ਸਾਰੀ ਜੰਗਲਾਤੀ ਜ਼ਮੀਨ","All urban land":"ਸਾਰੀ ਸ਼ਹਿਰੀ ਜ਼ਮੀਨ"},"ਅਜਿਹੀ ਜ਼ਮੀਨ ਦੀ ਮੌਜੂਦਾ ਉਤਪਾਦਕਤਾ ਘੱਟ ਹੁੰਦੀ ਹੈ, ਅਕਸਰ ਖ਼ਰਾਬੀ ਜਾਂ ਔਖੀਆਂ ਕੁਦਰਤੀ ਹਾਲਤਾਂ ਕਾਰਨ।"),
"GEO-LND-001-CP003-Q007":r("ਬੀਹੜ ਜਾਂ ਖੱਡਾਂ ਵਾਲੀ ਜ਼ਮੀਨ ਦੇ ਸੁਧਾਰ ਵਿੱਚ ਕਿਹੜਾ ਉਪਾਅ ਮਦਦਗਾਰ ਹੈ?",{
"Gully control and vegetation":"ਖੱਡਾਂ ਉੱਤੇ ਕਾਬੂ ਅਤੇ ਬਨਸਪਤੀ","More uncontrolled runoff":"ਹੋਰ ਬੇਕਾਬੂ ਪਾਣੀ ਵਹਾਅ","Removing all plants":"ਸਾਰੇ ਪੌਦੇ ਹਟਾਉਣਾ","Deepening gullies":"ਖੱਡਾਂ ਹੋਰ ਡੂੰਘੀਆਂ ਕਰਨਾ"},"ਖੱਡਾਂ ਨੂੰ ਥਿਰ ਕਰਨਾ ਅਤੇ ਬਨਸਪਤੀ ਮੁੜ ਲਗਾਉਣਾ ਮਿੱਟੀ ਕਟਾਅ ਘਟਾ ਸਕਦਾ ਹੈ।"),
"GEO-LND-001-CP003-Q008":r("ਲੂਣੀ ਜ਼ਮੀਨ ਦੇ ਸੁਧਾਰ ਵਿੱਚ ਕਿਹੜਾ ਉਪਾਅ ਮਦਦਗਾਰ ਹੈ?",{
"Drainage and suitable soil-water management":"ਪਾਣੀ ਨਿਕਾਸ ਅਤੇ ਢੁੱਕਵਾਂ ਮਿੱਟੀ-ਪਾਣੀ ਪ੍ਰਬੰਧ","Adding more salt":"ਹੋਰ ਲੂਣ ਪਾਉਣਾ","Blocking drains":"ਨਿਕਾਸ ਬੰਦ ਕਰਨਾ","Over-irrigating continuously":"ਲਗਾਤਾਰ ਬਹੁਤ ਵੱਧ ਸਿੰਚਾਈ ਕਰਨਾ"},"ਚੰਗਾ ਨਿਕਾਸ ਅਤੇ ਢੁੱਕਵਾਂ ਪ੍ਰਬੰਧ ਮਿੱਟੀ ਵਿੱਚ ਲੂਣ ਇਕੱਠਾ ਹੋਣਾ ਘਟਾ ਸਕਦਾ ਹੈ।"),
"GEO-LND-001-CP003-Q009":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਕੁਝ ਬੰਜਰ ਜਾਂ ਘੱਟ ਵਰਤੀ ਜ਼ਮੀਨ ਦਾ ਸੁਧਾਰ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ। II. ਸੁਧਾਰ ਦਾ ਢੰਗ ਜ਼ਮੀਨ ਖ਼ਰਾਬ ਹੋਣ ਦੇ ਕਾਰਨ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਵੱਖ-ਵੱਖ ਕਿਸਮ ਦੀ ਜ਼ਮੀਨੀ ਖ਼ਰਾਬੀ ਲਈ ਵੱਖਰੇ ਸੁਧਾਰ ਢੰਗ ਲੋੜੀਂਦੇ ਹੁੰਦੇ ਹਨ।"),
"GEO-LND-001-CP003-Q010":r("ਇੱਕ ਖ਼ਰਾਬ ਖੱਡਾਂ ਵਾਲੇ ਖੇਤਰ ਵਿੱਚ ਛੋਟੇ ਰੋਕ ਬੰਨ੍ਹ ਬਣਾਏ ਜਾਂਦੇ ਹਨ ਅਤੇ ਘਾਹ ਲਗਾਈ ਜਾਂਦੀ ਹੈ। ਇਸਦਾ ਮਕਸਦ ਕੀ ਹੈ?",{
"Land reclamation":"ਜ਼ਮੀਨ ਦਾ ਮੁੜ-ਸੁਧਾਰ","Urban expansion":"ਸ਼ਹਿਰੀ ਫੈਲਾਅ","Mining intensification":"ਖਣਨ ਵਧਾਉਣਾ","Forest clearing":"ਜੰਗਲ ਸਾਫ਼ ਕਰਨਾ"},"ਇਨ੍ਹਾਂ ਉਪਾਵਾਂ ਦਾ ਮਕਸਦ ਜ਼ਮੀਨ ਦੀ ਉਤਪਾਦਕਤਾ ਮੁੜ ਲਿਆਉਣਾ ਅਤੇ ਕਟਾਅ ਘਟਾਉਣਾ ਹੈ।"),
"GEO-LND-001-CP003-Q011":r("ਸਾਂਝੇ ਸਮੁਦਾਇਕ ਜ਼ਮੀਨੀ ਸਰੋਤ ਕੀ ਹੁੰਦੇ ਹਨ?",{
"Resources used collectively by a community":"ਸਮੁਦਾਇ ਵੱਲੋਂ ਸਾਂਝੇ ਤੌਰ ਤੇ ਵਰਤੇ ਜਾਂਦੇ ਸਰੋਤ","Only privately owned factories":"ਕੇਵਲ ਨਿੱਜੀ ਮਲਕੀਅਤ ਵਾਲੇ ਕਾਰਖਾਨੇ","Only central government offices":"ਕੇਵਲ ਕੇਂਦਰ ਸਰਕਾਰ ਦੇ ਦਫ਼ਤਰ","Only individual houses":"ਕੇਵਲ ਨਿੱਜੀ ਘਰ"},"ਪਿੰਡ ਦੇ ਚਰਾਗਾਹ, ਛੱਪੜ ਅਤੇ ਸਾਂਝੇ ਜੰਗਲ ਅਜਿਹੇ ਸਰੋਤਾਂ ਦੀਆਂ ਉਦਾਹਰਨਾਂ ਹਨ।"),
"GEO-LND-001-CP003-Q012":r("ਸਾਂਝੇ ਸਮੁਦਾਇਕ ਸਰੋਤ ਦੀ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?",{
"Village grazing land":"ਪਿੰਡ ਦਾ ਚਰਾਗਾਹ","Private house plot":"ਨਿੱਜੀ ਘਰ ਦਾ ਪਲਾਟ","Individual factory site":"ਨਿੱਜੀ ਕਾਰਖਾਨੇ ਦੀ ਥਾਂ","Personal vehicle":"ਨਿੱਜੀ ਵਾਹਨ"},"ਪਿੰਡ ਦੇ ਸਾਂਝੇ ਚਰਾਗਾਹ ਦੀ ਵਰਤੋਂ ਕਈ ਪਰਿਵਾਰ ਕਰਦੇ ਹਨ।"),
"GEO-LND-001-CP003-Q013":r("ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਸਾਂਝੇ ਸਮੁਦਾਇਕ ਸਰੋਤ ਮਹੱਤਵਪੂਰਨ ਕਿਉਂ ਹਨ?",{
"They support grazing, fuel, water and livelihoods":"ਇਹ ਚਰਾਈ, ਇੰਧਨ, ਪਾਣੀ ਅਤੇ ਰੋਜ਼ੀ-ਰੋਟੀ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ","They have no livelihood role":"ਇਨ੍ਹਾਂ ਦੀ ਰੋਜ਼ੀ-ਰੋਟੀ ਵਿੱਚ ਕੋਈ ਭੂਮਿਕਾ ਨਹੀਂ","They are always unused":"ਇਹ ਹਮੇਸ਼ਾਂ ਬੇਵਰਤੇ ਰਹਿੰਦੇ ਹਨ","They only support airports":"ਇਹ ਕੇਵਲ ਹਵਾਈ ਅੱਡਿਆਂ ਲਈ ਵਰਤੇ ਜਾਂਦੇ ਹਨ"},"ਸਾਂਝੇ ਸਰੋਤ ਖਾਸ ਕਰਕੇ ਗਰੀਬ ਪਰਿਵਾਰਾਂ ਅਤੇ ਪਸ਼ੂ ਪਾਲਣ ਦੀ ਰੋਜ਼ੀ-ਰੋਟੀ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੁੰਦੇ ਹਨ।"),
"GEO-LND-001-CP003-Q014":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਬਹੁਤ ਵੱਧ ਵਰਤੋਂ ਨਾਲ ਸਾਂਝੀ ਜ਼ਮੀਨ ਖ਼ਰਾਬ ਹੋ ਸਕਦੀ ਹੈ। II. ਸਮੁਦਾਇਕ ਪ੍ਰਬੰਧ ਟਿਕਾਊ ਵਰਤੋਂ ਸੁਧਾਰ ਸਕਦਾ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਸਾਂਝੇ ਨਿਯਮ ਖੁੱਲ੍ਹੀ ਅਤੇ ਬੇਕਾਬੂ ਵਰਤੋਂ ਨਾਲ ਹੋਣ ਵਾਲੀ ਖ਼ਰਾਬੀ ਨੂੰ ਘਟਾ ਸਕਦੇ ਹਨ।"),
"GEO-LND-001-CP003-Q015":r("ਇੱਕ ਪਿੰਡ ਕਈ ਪਰਿਵਾਰਾਂ ਵੱਲੋਂ ਵਰਤੇ ਜਾਂਦੇ ਚਰਾਗਾਹ ਦਾ ਮਿਲ ਕੇ ਪ੍ਰਬੰਧ ਕਰਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਸਰੋਤ ਹੈ?",{
"Common property resource":"ਸਾਂਝਾ ਸਮੁਦਾਇਕ ਸਰੋਤ","Private industrial land":"ਨਿੱਜੀ ਉਦਯੋਗਿਕ ਜ਼ਮੀਨ","Urban built-up land":"ਸ਼ਹਿਰੀ ਨਿਰਮਿਤ ਜ਼ਮੀਨ","Net sown area only":"ਕੇਵਲ ਸ਼ੁੱਧ ਬੀਜਿਆ ਖੇਤਰ"},"ਸਮੁਦਾਇ ਵੱਲੋਂ ਸਾਂਝੀ ਵਰਤੋਂ ਇਸ ਕਿਸਮ ਦੇ ਸਰੋਤ ਦੀ ਮੁੱਖ ਪਛਾਣ ਹੈ।"),
"GEO-LND-001-CP003-Q016":r("ਟਿਕਾਊ ਜ਼ਮੀਨ ਪ੍ਰਬੰਧ ਕੀ ਹੈ?",{
"Using land while maintaining long-term productivity and ecological function":"ਜ਼ਮੀਨ ਦੀ ਵਰਤੋਂ ਕਰਦਿਆਂ ਉਸਦੀ ਲੰਬੇ ਸਮੇਂ ਦੀ ਉਤਪਾਦਕਤਾ ਅਤੇ ਕੁਦਰਤੀ ਕਾਰਜ ਕਾਇਮ ਰੱਖਣਾ","Maximising short-term extraction regardless of damage":"ਨੁਕਸਾਨ ਦੀ ਪਰਵਾਹ ਬਿਨਾਂ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਵੱਧ ਤੋਂ ਵੱਧ ਦੋਹਣ ਕਰਨਾ","Removing all vegetation":"ਸਾਰੀ ਬਨਸਪਤੀ ਹਟਾਉਣਾ","Ignoring soil loss":"ਮਿੱਟੀ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨਾ"},"ਟਿਕਾਊ ਪ੍ਰਬੰਧ ਵਰਤੋਂ ਅਤੇ ਸੰਭਾਲ ਵਿਚਕਾਰ ਸੰਤੁਲਨ ਬਣਾਉਂਦਾ ਹੈ।"),
"GEO-LND-001-CP003-Q017":r("ਕਿਹੜਾ ਢੰਗ ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ ਦੀ ਟਿਕਾਊ ਵਰਤੋਂ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ?",{
"Crop rotation and soil conservation":"ਫਸਲ ਚੱਕਰ ਅਤੇ ਮਿੱਟੀ ਦੀ ਸੰਭਾਲ","Continuous erosion":"ਲਗਾਤਾਰ ਮਿੱਟੀ ਕਟਾਅ","Overgrazing":"ਜ਼ਿਆਦਾ ਚਰਾਈ","Uncontrolled salinity":"ਬੇਕਾਬੂ ਲੂਣਾਪਣ"},"ਮਿੱਟੀ ਦੀ ਬਣਤਰ ਅਤੇ ਉਪਜਾਊ ਸ਼ਕਤੀ ਕਾਇਮ ਰੱਖਣਾ ਲੰਬੇ ਸਮੇਂ ਦੀ ਉਤਪਾਦਕਤਾ ਲਈ ਜ਼ਰੂਰੀ ਹੈ।"),
"GEO-LND-001-CP003-Q018":r("ਯੋਜਨਾਬੰਦੀ ਵਿੱਚ ਜ਼ਮੀਨ ਦੀ ਸਮਰੱਥਾ ਮਹੱਤਵਪੂਰਨ ਕਿਉਂ ਹੈ?",{
"Land should be used according to its physical suitability":"ਜ਼ਮੀਨ ਦੀ ਵਰਤੋਂ ਉਸਦੀ ਭੌਤਿਕ ਯੋਗਤਾ ਅਨੁਸਾਰ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ","Every land type is equally suitable for every use":"ਹਰ ਕਿਸਮ ਦੀ ਜ਼ਮੀਨ ਹਰ ਵਰਤੋਂ ਲਈ ਇੱਕੋ ਜਿਹੀ ਯੋਗ ਹੈ","Steep slopes are ideal for all construction":"ਤਿੱਖੀਆਂ ਢਲਾਣਾਂ ਹਰ ਕਿਸਮ ਦੇ ਨਿਰਮਾਣ ਲਈ ਢੁੱਕਵੀਆਂ ਹਨ","Wetlands should always be converted":"ਜਲਥਲਾਂ ਨੂੰ ਹਮੇਸ਼ਾਂ ਬਦਲ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ"},"ਜ਼ਮੀਨ ਦੀ ਸਮਰੱਥਾ ਅਨੁਸਾਰ ਵਰਤੋਂ ਕਰਨ ਨਾਲ ਖ਼ਰਾਬੀ ਅਤੇ ਨੁਕਸਾਨ ਘਟਦਾ ਹੈ।"),
"GEO-LND-001-CP003-Q019":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਟਿਕਾਊ ਜ਼ਮੀਨ ਵਰਤੋਂ ਭਵਿੱਖ ਦੀ ਉਤਪਾਦਕਤਾ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦੀ ਹੈ। II. ਇਹ ਕੁਦਰਤੀ ਹੱਦਾਂ ਨੂੰ ਵੀ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦੀ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ","Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ","Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ","Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਲੰਬੇ ਸਮੇਂ ਦੀ ਜ਼ਮੀਨ ਵਰਤੋਂ ਵਿੱਚ ਸਰੋਤਾਂ ਦੀਆਂ ਕੁਦਰਤੀ ਹੱਦਾਂ ਦਾ ਧਿਆਨ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਹੈ।"),
"GEO-LND-001-CP003-Q020":r("ਮਿੱਟੀ ਕਟਾਅ ਲਈ ਸੰਵੇਦਨਸ਼ੀਲ ਤਿੱਖੀ ਢਲਾਣ ਨੂੰ ਗਹਿਰੀ ਖੇਤੀ ਦੀ ਬਜਾਇ ਜੰਗਲ ਹੇਠ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ। ਕਿਹੜਾ ਸਿਧਾਂਤ ਲਾਗੂ ਕੀਤਾ ਗਿਆ ਹੈ?",{
"Land capability-based use":"ਜ਼ਮੀਨ ਦੀ ਸਮਰੱਥਾ ਅਨੁਸਾਰ ਵਰਤੋਂ","Maximum short-term extraction":"ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਵੱਧ ਤੋਂ ਵੱਧ ਦੋਹਣ","Urban sprawl":"ਬੇਤਰਤੀਬ ਸ਼ਹਿਰੀ ਫੈਲਾਅ","Mining-first planning":"ਖਣਨ ਨੂੰ ਪਹਿਲ ਦੇਣ ਵਾਲੀ ਯੋਜਨਾਬੰਦੀ"},"ਇੱਥੇ ਜ਼ਮੀਨ ਦੀ ਵਰਤੋਂ ਉਸਦੀ ਭੌਤਿਕ ਯੋਗਤਾ ਅਨੁਸਾਰ ਚੁਣੀ ਗਈ ਹੈ।"),
"GEO-LND-001-CP003-Q021":r("ਕਿਹੜਾ ਜੋੜ ਜ਼ਮੀਨ ਦੇ ਖ਼ਰਾਬ ਹੋਣ ਦੀ ਸਭ ਤੋਂ ਵੱਧ ਸੰਭਾਵਨਾ ਪੈਦਾ ਕਰਦਾ ਹੈ?",{
"Deforestation, overgrazing and erosion":"ਜੰਗਲਾਂ ਦੀ ਕਟਾਈ, ਜ਼ਿਆਦਾ ਚਰਾਈ ਅਤੇ ਮਿੱਟੀ ਕਟਾਅ","Afforestation, terracing and contour farming":"ਰੁੱਖ ਲਗਾਉਣਾ, ਪੌੜੀਦਾਰ ਖੇਤੀ ਅਤੇ ਸਮਾਨ ਉਚਾਈ ਵਾਲੀਆਂ ਰੇਖਾਵਾਂ ਅਨੁਸਾਰ ਖੇਤੀ","Recharge, shelterbelts and drainage":"ਪੁਨਰਭਰਨ, ਹਵਾ ਰੋਕਣ ਵਾਲੀਆਂ ਰੁੱਖਾਂ ਦੀਆਂ ਕਤਾਰਾਂ ਅਤੇ ਪਾਣੀ ਨਿਕਾਸ","Watershed treatment and grass cover":"ਵਾਟਰਸ਼ੈੱਡ ਸੁਧਾਰ ਅਤੇ ਘਾਹ ਦਾ ਢੱਕਣ"},"ਪਹਿਲਾ ਜੋੜ ਜ਼ਮੀਨ ਦੀ ਰੱਖਿਆ ਘਟਾਉਂਦਾ ਹੈ ਅਤੇ ਮਿੱਟੀ ਦਾ ਨੁਕਸਾਨ ਤੇਜ਼ ਕਰਦਾ ਹੈ।"),
"GEO-LND-001-CP003-Q022":r("ਸੁੱਕੀ ਜ਼ਮੀਨ ਦੀ ਖ਼ਰਾਬੀ ਘਟਾਉਣ ਲਈ ਸਭ ਤੋਂ ਢੁੱਕਵਾਂ ਜੋੜ ਕਿਹੜਾ ਹੈ?",{
"Shelterbelts, controlled grazing and water conservation":"ਹਵਾ ਰੋਕਣ ਵਾਲੀਆਂ ਰੁੱਖਾਂ ਦੀਆਂ ਕਤਾਰਾਂ, ਨਿਯੰਤਰਿਤ ਚਰਾਈ ਅਤੇ ਪਾਣੀ ਦੀ ਸੰਭਾਲ","Deforestation and overgrazing":"ਜੰਗਲਾਂ ਦੀ ਕਟਾਈ ਅਤੇ ਜ਼ਿਆਦਾ ਚਰਾਈ","Unlimited groundwater pumping":"ਬੇਹਿਸਾਬ ਭੂਜਲ ਕੱਢਣਾ","Bare soil and high runoff":"ਖੁੱਲ੍ਹੀ ਮਿੱਟੀ ਅਤੇ ਤੇਜ਼ ਪਾਣੀ ਵਹਾਅ"},"ਬਨਸਪਤੀ ਦੀ ਰੱਖਿਆ ਅਤੇ ਸੰਭਲ ਕੇ ਪਾਣੀ ਦੀ ਵਰਤੋਂ ਮਿੱਟੀ ਕਟਾਅ ਅਤੇ ਮਾਰੂਥਲੀਕਰਨ ਘਟਾਉਂਦੀ ਹੈ।"),
"GEO-LND-001-CP003-Q023":r("ਖੇਤੀ ਕੀਤੀ ਅਤੇ ਪਰਤੀ ਜ਼ਮੀਨ ਵਿੱਚ ਸਹੀ ਫਰਕ ਕਿਹੜਾ ਹੈ?",{
"Net sown area is cultivated; current fallow is temporarily uncultivated":"ਸ਼ੁੱਧ ਬੀਜਿਆ ਖੇਤਰ ਖੇਤੀ ਹੇਠ ਹੈ; ਮੌਜੂਦਾ ਪਰਤੀ ਅਸਥਾਈ ਤੌਰ ਤੇ ਬਿਨਾਂ ਖੇਤੀ ਹੈ","Both are forests":"ਦੋਵੇਂ ਜੰਗਲ ਹਨ","Both are permanently barren":"ਦੋਵੇਂ ਸਥਾਈ ਤੌਰ ਤੇ ਬੰਜਰ ਹਨ","Current fallow is urban land":"ਮੌਜੂਦਾ ਪਰਤੀ ਸ਼ਹਿਰੀ ਜ਼ਮੀਨ ਹੈ"},"ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਫਰਕ ਇਸ ਗੱਲ ਨਾਲ ਹੈ ਕਿ ਸੰਦਰਭ ਸਾਲ ਵਿੱਚ ਜ਼ਮੀਨ ਉੱਤੇ ਖੇਤੀ ਹੋਈ ਜਾਂ ਨਹੀਂ।"),
"GEO-LND-001-CP003-Q024":r("ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨ ਅਤੇ ਮਿੱਟੀ ਦੇ ਲੂਣਾਪਣ ਵਿੱਚ ਸਹੀ ਫਰਕ ਕਿਹੜਾ ਹੈ?",{
"Waterlogging means excess water; salinity means excess salts":"ਪਾਣੀ ਖੜ੍ਹਨ ਦਾ ਭਾਵ ਵਾਧੂ ਪਾਣੀ ਹੈ; ਲੂਣਾਪਣ ਦਾ ਭਾਵ ਵਾਧੂ ਲੂਣ ਹਨ","Both mean wind erosion":"ਦੋਵਾਂ ਦਾ ਭਾਵ ਹਵਾ ਨਾਲ ਮਿੱਟੀ ਕਟਾਅ ਹੈ","Both mean afforestation":"ਦੋਵਾਂ ਦਾ ਭਾਵ ਰੁੱਖ ਲਗਾਉਣਾ ਹੈ","Both mean urbanisation":"ਦੋਵਾਂ ਦਾ ਭਾਵ ਸ਼ਹਿਰੀਕਰਨ ਹੈ"},"ਦੋਵੇਂ ਸਮੱਸਿਆਵਾਂ ਇਕੱਠੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ, ਪਰ ਪਾਣੀ ਖੜ੍ਹਨਾ ਅਤੇ ਲੂਣਾਪਣ ਵੱਖ ਹਾਲਤਾਂ ਹਨ।"),
"GEO-LND-001-CP003-Q025":r("ਇੱਕ ਖੇਤਰ ਵਿੱਚ ਤਿੱਖੀਆਂ ਢਲਾਣਾਂ ਉੱਤੇ ਜੰਗਲ ਬਚਾਏ ਜਾਂਦੇ ਹਨ, ਹੌਲੀਆਂ ਢਲਾਣਾਂ ਉੱਤੇ ਖੇਤੀ ਹੁੰਦੀ ਹੈ ਅਤੇ ਖੱਡਾਂ ਦਾ ਸੁਧਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਇਹ ਕਿਹੜਾ ਦ੍ਰਿਸ਼ਟੀਕੋਣ ਹੈ?",{
"Sustainable land management":"ਟਿਕਾਊ ਜ਼ਮੀਨ ਪ੍ਰਬੰਧ","Random land use":"ਬੇਤਰਤੀਬ ਜ਼ਮੀਨ ਵਰਤੋਂ","Maximum extraction":"ਵੱਧ ਤੋਂ ਵੱਧ ਦੋਹਣ","Unplanned expansion":"ਬਿਨਾਂ ਯੋਜਨਾ ਫੈਲਾਅ"},"ਜ਼ਮੀਨ ਦੀ ਵਰਤੋਂ ਉਸਦੀ ਸਮਰੱਥਾ ਅਤੇ ਸੰਭਾਲ ਦੀ ਲੋੜ ਅਨੁਸਾਰ ਚੁਣੀ ਜਾ ਰਹੀ ਹੈ।")
});

export function localizeGeoLnd001ExactCp003(question:CanonicalQuestion,language:Lang){
 const rec=(language==="hi"?HI:PA)[question.questionId];if(!rec)return null;
 const options=question.options.map(source=>{const t=rec.optionBySource[source];if(!t)throw new Error(`Missing GEO-LND-001 CP003 ${language} option translation for ${question.questionId}: ${source}`);return t;});
 return Object.freeze({stem:rec.stem,options:Object.freeze(options),canonicalAnswer:options[question.correctIndex]!,explanation:rec.explanation});
}
