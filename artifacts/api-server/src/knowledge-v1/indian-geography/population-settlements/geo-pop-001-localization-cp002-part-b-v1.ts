type CanonicalQuestion=Readonly<{questionId:string;options:readonly string[];correctIndex:number;}>;
type Lang="hi"|"pa";
type ExactRecord=Readonly<{stem:string;optionBySource:Readonly<Record<string,string>>;explanation:string}>;
const r=(stem:string,optionBySource:Record<string,string>,explanation:string):ExactRecord=>Object.freeze({stem,optionBySource:Object.freeze(optionBySource),explanation});

const HI:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-POP-001-CP002-Q031":r("1981 के बाद भारत की जनसंख्या वृद्धि दर में क्या परिवर्तन आया?",{
"It began to decline gradually":"यह धीरे-धीरे घटने लगी",
"It rose without interruption":"यह बिना रुके बढ़ती रही",
"Population immediately declined":"जनसंख्या तुरंत घटने लगी",
"Births became zero":"जन्म शून्य हो गए"},"जनसंख्या बढ़ती रही, लेकिन उसकी वृद्धि दर धीरे-धीरे कम होने लगी।"),
"GEO-POP-001-CP002-Q032":r("1981 के बाद जनसंख्या वृद्धि दर घटने का एक प्रमुख कारण क्या है?",{
"Declining birth rates":"जन्म दर में गिरावट",
"Rising death rates everywhere":"हर जगह मृत्यु दर बढ़ना",
"End of all health services":"सभी स्वास्थ्य सेवाओं का अंत",
"No urbanisation":"शहरीकरण का अभाव"},"प्रजनन दर में गिरावट ने जन्म और मृत्यु के बीच अंतर कम किया।"),
"GEO-POP-001-CP002-Q033":r("कथनों पर विचार करें: I. 1981 के बाद भारत की कुल जनसंख्या बढ़ती रही। II. उसकी वृद्धि दर धीरे-धीरे घटी। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"वृद्धि दर घटने का अर्थ यह नहीं कि कुल जनसंख्या तुरंत घटने लगी।"),
"GEO-POP-001-CP002-Q034":r("भारत की जनसंख्या वृद्धि के इतिहास में कौन-सी जोड़ी सही है?",{
"After 1981 — slowing population growth rate":"1981 के बाद — जनसंख्या वृद्धि दर में मंदी",
"After 1981 — immediate population fall":"1981 के बाद — तुरंत जनसंख्या गिरावट",
"1901-1921 — rapid growth":"1901-1921 — तीव्र वृद्धि",
"1951-1981 — stagnant growth":"1951-1981 — स्थिर वृद्धि"},"1981 के बाद की अवधि जनसंख्या वृद्धि दर के क्रमिक मंद होने से पहचानी जाती है।"),
"GEO-POP-001-CP002-Q035":r("कौन-सा जनांकिकीय परिवर्तन प्राकृतिक जनसंख्या वृद्धि को सबसे सीधे कम करता है?",{
"Falling fertility":"प्रजनन दर में गिरावट",
"Higher birth rates":"ऊंची जन्म दर",
"Lower literacy":"कम साक्षरता",
"More births per woman":"प्रति महिला अधिक जन्म"},"प्रजनन दर घटने से कुल जन्मों की संख्या कम होती है और प्राकृतिक वृद्धि घटती है।"),
"GEO-POP-001-CP002-Q036":r("कुल जनसंख्या बढ़ती रहती है, लेकिन प्रत्येक दशक में अनुपातिक वृद्धि पहले से कम होती है। क्या हो रहा है?",{
"Growth rate is declining":"वृद्धि दर घट रही है",
"Population is necessarily shrinking":"जनसंख्या अवश्य घट रही है",
"Density is zero":"घनत्व शून्य है",
"Birth rate must be rising":"जन्म दर अवश्य बढ़ रही है"},"कुल जनसंख्या बढ़ सकती है, भले प्रतिशत वृद्धि दर घट रही हो।"),

"GEO-POP-001-CP002-Q037":r("आयु संरचना क्या दिखाती है?",{
"Distribution of population among different age groups":"विभिन्न आयु समूहों में जनसंख्या का वितरण",
"Only population density":"केवल जनसंख्या घनत्व",
"Only sex ratio":"केवल लिंगानुपात",
"Only state area":"केवल राज्य का क्षेत्रफल"},"आयु संरचना जनसंख्या को आयु समूहों में बांटकर उसकी जनांकिकीय बनावट दिखाती है।"),
"GEO-POP-001-CP002-Q038":r("आयु संरचना महत्वपूर्ण क्यों है?",{
"It indicates the balance of children, working-age people and elderly":"यह बच्चों, कार्यशील आयु के लोगों और वृद्धों के अनुपात का संकेत देती है",
"It measures rainfall":"यह वर्षा मापती है",
"It identifies ports":"यह बंदरगाहों की पहचान करती है",
"It gives road length":"यह सड़क की लंबाई बताती है"},"विभिन्न आयु समूहों की आर्थिक भूमिकाएं और जरूरतें अलग होती हैं।"),
"GEO-POP-001-CP002-Q039":r("कथनों पर विचार करें: I. बच्चे आश्रित आयु समूह का हिस्सा हैं। II. वृद्धों की भी आश्रित जरूरतें अधिक हो सकती हैं। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"आश्रितता का बोझ जनसंख्या की आयु संरचना से निकटता से जुड़ा है।"),
"GEO-POP-001-CP002-Q040":r("आयु संरचना की सही परिभाषा कौन-सी है?",{
"Age composition — population by age groups":"आयु संरचना — आयु समूहों के अनुसार जनसंख्या",
"Age composition — population per sq km":"आयु संरचना — प्रति वर्ग किलोमीटर जनसंख्या",
"Age composition — females per 1000 males":"आयु संरचना — प्रति हजार पुरुषों पर महिलाएं",
"Age composition — literacy percentage":"आयु संरचना — साक्षरता प्रतिशत"},"आयु संरचना जनसंख्या को विभिन्न आयु वर्गों के अनुसार दर्शाती है।"),
"GEO-POP-001-CP002-Q041":r("श्रम-बल आयु की जनसंख्या का मुख्य भाग कौन-सा समूह है?",{
"Working-age population":"कार्यशील आयु की जनसंख्या",
"Only infants":"केवल शिशु",
"Only elderly":"केवल वृद्ध",
"Only school children":"केवल स्कूली बच्चे"},"कार्यशील आयु समूह संभावित श्रम शक्ति का अधिकांश हिस्सा प्रदान करता है।"),
"GEO-POP-001-CP002-Q042":r("किसी जनसंख्या में बच्चों का हिस्सा बड़ा और कार्यशील आयु समूह छोटा है। कौन-सा बोझ अधिक होने की संभावना है?",{
"Dependency burden":"आश्रितता का बोझ",
"Port capacity":"बंदरगाह क्षमता",
"Rail density":"रेल घनत्व",
"Sea depth":"समुद्र की गहराई"},"आश्रित आयु समूह बड़ा होने पर कार्यशील आयु समूह पर सहारा देने का बोझ बढ़ता है।"),

"GEO-POP-001-CP002-Q043":r("भारतीय जनगणना में लिंगानुपात की परिभाषा क्या है?",{
"Number of females per 1000 males":"प्रति 1000 पुरुषों पर महिलाओं की संख्या",
"Males per 100 females":"प्रति 100 महिलाओं पर पुरुष",
"Children per household":"प्रति परिवार बच्चे",
"Workers per square kilometre":"प्रति वर्ग किलोमीटर श्रमिक"},"भारतीय जनगणना में लिंगानुपात प्रति 1000 पुरुषों पर महिलाओं की संख्या के रूप में व्यक्त किया जाता है।"),
"GEO-POP-001-CP002-Q044":r("जनगणना 2011 के अनुसार भारत का लिंगानुपात कितना था?",{
"943 females per 1000 males":"प्रति 1000 पुरुषों पर 943 महिलाएं",
"843 females per 1000 males":"प्रति 1000 पुरुषों पर 843 महिलाएं",
"1043 females per 1000 males":"प्रति 1000 पुरुषों पर 1043 महिलाएं",
"743 females per 1000 males":"प्रति 1000 पुरुषों पर 743 महिलाएं"},"जनगणना 2011 में भारत का लिंगानुपात प्रति 1000 पुरुषों पर 943 महिलाएं था।"),
"GEO-POP-001-CP002-Q045":r("कथनों पर विचार करें: I. भारत में लिंगानुपात प्रति 1000 पुरुषों पर महिलाओं की संख्या से व्यक्त होता है। II. जनगणना 2011 में राष्ट्रीय लिंगानुपात 943 था। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"परिभाषा और जनगणना 2011 का राष्ट्रीय आंकड़ा दोनों सही हैं।"),
"GEO-POP-001-CP002-Q046":r("लिंगानुपात की सही परिभाषा कौन-सी है?",{
"Sex ratio — females per 1000 males":"लिंगानुपात — प्रति 1000 पुरुषों पर महिलाएं",
"Sex ratio — persons per sq km":"लिंगानुपात — प्रति वर्ग किलोमीटर व्यक्ति",
"Sex ratio — births minus deaths":"लिंगानुपात — जन्म घटा मृत्यु",
"Sex ratio — literates per hundred":"लिंगानुपात — प्रति सौ साक्षर"},"लिंगानुपात महिला और पुरुष जनसंख्या के संख्यात्मक संतुलन को दर्शाता है।"),
"GEO-POP-001-CP002-Q047":r("यदि किसी क्षेत्र का लिंगानुपात 1000 से अधिक हो, तो इसका क्या अर्थ है?",{
"Females outnumber males":"महिलाओं की संख्या पुरुषों से अधिक है",
"Males outnumber females":"पुरुषों की संख्या महिलाओं से अधिक है",
"Population density is above 1000":"जनसंख्या घनत्व 1000 से अधिक है",
"Literacy is 100 percent":"साक्षरता 100 प्रतिशत है"},"प्रति 1000 पुरुषों पर 1000 से अधिक महिलाएं होने का अर्थ है कि महिलाएं संख्यात्मक रूप से अधिक हैं।"),
"GEO-POP-001-CP002-Q048":r("एक जनगणना तालिका प्रति 1000 पुरुषों पर 943 महिलाएं दिखाती है। कौन-सा संकेतक दर्शाया जा रहा है?",{
"Sex ratio":"लिंगानुपात",
"Population density":"जनसंख्या घनत्व",
"Decadal growth":"दशकीय वृद्धि",
"Literacy rate":"साक्षरता दर"},"प्रति 1000 पुरुषों पर महिलाओं की संख्या लिंगानुपात का मानक माप है।"),

"GEO-POP-001-CP002-Q049":r("साक्षरता दर क्या मापती है?",{
"Share of population meeting the census literacy criterion":"जनगणना के साक्षरता मानदंड को पूरा करने वाली जनसंख्या का हिस्सा",
"Population per square kilometre":"प्रति वर्ग किलोमीटर जनसंख्या",
"Births minus deaths":"जन्म घटा मृत्यु",
"Females per 1000 males":"प्रति 1000 पुरुषों पर महिलाएं"},"साक्षरता दर जनगणना की परिभाषा के अनुसार पढ़ने-लिखने और समझने में सक्षम पात्र जनसंख्या का अनुपात बताती है।"),
"GEO-POP-001-CP002-Q050":r("जनगणना 2011 के अनुसार भारत में साक्षरता के बारे में कौन-सा कथन सही है?",{
"Male literacy was higher than female literacy":"पुरुष साक्षरता महिला साक्षरता से अधिक थी",
"Female literacy was higher than male literacy nationally":"राष्ट्रीय स्तर पर महिला साक्षरता पुरुष साक्षरता से अधिक थी",
"Male and female literacy were exactly equal":"पुरुष और महिला साक्षरता बिल्कुल समान थी",
"No literacy gap existed":"साक्षरता में कोई अंतर नहीं था"},"जनगणना 2011 में राष्ट्रीय स्तर पर पुरुष और महिला साक्षरता में स्पष्ट अंतर था।"),
"GEO-POP-001-CP002-Q051":r("कथनों पर विचार करें: I. साक्षरता एक सामाजिक जनसंख्या विशेषता है। II. साक्षरता क्षेत्रों और सामाजिक समूहों के बीच अलग-अलग हो सकती है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"साक्षरता एक प्रमुख मानव-विकास संकेतक है जिसमें स्थानिक और सामाजिक अंतर पाए जाते हैं।"),
"GEO-POP-001-CP002-Q052":r("साक्षरता दर का सही वर्णन कौन-सा है?",{
"Literacy rate — educational population characteristic":"साक्षरता दर — जनसंख्या की शैक्षिक विशेषता",
"Literacy rate — population density":"साक्षरता दर — जनसंख्या घनत्व",
"Literacy rate — natural increase":"साक्षरता दर — प्राकृतिक वृद्धि",
"Literacy rate — sex ratio":"साक्षरता दर — लिंगानुपात"},"साक्षरता जनसंख्या की सामाजिक और शैक्षिक संरचना का भाग है।"),
"GEO-POP-001-CP002-Q053":r("कौन-सा परिवर्तन सामान्यतः साक्षरता बढ़ाने में सहायक है?",{
"Better access to schooling":"विद्यालयी शिक्षा तक बेहतर पहुंच",
"Closure of schools":"विद्यालय बंद करना",
"Greater educational exclusion":"शिक्षा से अधिक वंचित करना",
"Reduced access to teachers":"शिक्षकों तक पहुंच कम करना"},"शिक्षा तक पहुंच साक्षरता परिणामों का एक प्रमुख निर्धारक है।"),
"GEO-POP-001-CP002-Q054":r("एक जिले में विद्यालय और वयस्क शिक्षा का विस्तार होता है और बाद में पढ़ने-लिखने में सक्षम लोगों की संख्या बढ़ती है। कौन-सा संकेतक सुधरा?",{
"Literacy rate":"साक्षरता दर",
"Population density":"जनसंख्या घनत्व",
"Sea level":"समुद्र-स्तर",
"Road gradient":"सड़क ढाल"},"यह परिवर्तन सीधे साक्षरता से संबंधित है।"),

"GEO-POP-001-CP002-Q055":r("जनांकिकीय संकेतकों और उनके अर्थों का सही क्रम कौन-सा है?",{
"Density—persons per area; sex ratio—females per 1000 males; literacy—educational attainment":"घनत्व—प्रति क्षेत्र व्यक्ति; लिंगानुपात—प्रति 1000 पुरुषों पर महिलाएं; साक्षरता—शैक्षिक उपलब्धि",
"Density—births minus deaths; sex ratio—area; literacy—migration":"घनत्व—जन्म घटा मृत्यु; लिंगानुपात—क्षेत्रफल; साक्षरता—प्रवास",
"All three—road measures":"तीनों—सड़क संबंधी माप",
"All three—climate measures":"तीनों—जलवायु संबंधी माप"},"ये तीन संकेतक जनसंख्या के अलग-अलग आयाम मापते हैं।"),
"GEO-POP-001-CP002-Q056":r("कौन-सा संकेतक सीधे आयु समूहों से संबंधित है?",{
"Age composition":"आयु संरचना",
"Population density":"जनसंख्या घनत्व",
"Sex ratio":"लिंगानुपात",
"Road density":"सड़क घनत्व"},"आयु संरचना जनसंख्या को विभिन्न आयु समूहों के अनुसार दिखाती है।"),
"GEO-POP-001-CP002-Q057":r("कौन-सा संकेतक महिला और पुरुष जनसंख्या के संतुलन से सीधे संबंधित है?",{
"Sex ratio":"लिंगानुपात",
"Literacy rate":"साक्षरता दर",
"Population density":"जनसंख्या घनत्व",
"Natural increase":"प्राकृतिक वृद्धि"},"लिंगानुपात महिला और पुरुष जनसंख्या की संख्यात्मक तुलना करता है।"),
"GEO-POP-001-CP002-Q058":r("जनगणना मानदंड के अनुसार पढ़ने और लिखने की क्षमता से सीधे संबंधित संकेतक कौन-सा है?",{
"Literacy rate":"साक्षरता दर",
"Sex ratio":"लिंगानुपात",
"Population density":"जनसंख्या घनत्व",
"Natural increase":"प्राकृतिक वृद्धि"},"साक्षरता दर जनगणना की परिभाषा के अनुसार शैक्षिक उपलब्धि मापती है।"),
"GEO-POP-001-CP002-Q059":r("कौन-सी तुलना सही है?",{
"Density is spatial, while age composition is demographic-structural":"घनत्व स्थानिक है, जबकि आयु संरचना जनांकिकीय संरचना से संबंधित है",
"Both are rainfall measures":"दोनों वर्षा के माप हैं",
"Age composition is persons per sq km":"आयु संरचना प्रति वर्ग किलोमीटर व्यक्ति है",
"Density is a literacy measure":"घनत्व साक्षरता का माप है"},"घनत्व जनसंख्या को क्षेत्रफल से जोड़ता है, जबकि आयु संरचना जनसंख्या की आंतरिक बनावट बताती है।"),
"GEO-POP-001-CP002-Q060":r("एक तालिका में आयु समूह, साक्षरता और लिंगानुपात दिए गए हैं। यह किस प्रकार की जानकारी का सार प्रस्तुत करती है?",{
"Population composition":"जनसंख्या संरचना",
"Only transport geography":"केवल परिवहन भूगोल",
"Only climate":"केवल जलवायु",
"Only mineral resources":"केवल खनिज संसाधन"},"ये संकेतक जनसंख्या की जनांकिकीय और सामाजिक संरचना का वर्णन करते हैं।")
});

const PA:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-POP-001-CP002-Q031":r("1981 ਤੋਂ ਬਾਅਦ ਭਾਰਤ ਦੀ ਆਬਾਦੀ ਵਾਧਾ ਦਰ ਵਿੱਚ ਕੀ ਬਦਲਾਅ ਆਇਆ?",{
"It began to decline gradually":"ਇਹ ਹੌਲੀ-ਹੌਲੀ ਘਟਣ ਲੱਗੀ",
"It rose without interruption":"ਇਹ ਬਿਨਾਂ ਰੁਕੇ ਵਧਦੀ ਰਹੀ",
"Population immediately declined":"ਆਬਾਦੀ ਤੁਰੰਤ ਘਟਣ ਲੱਗੀ",
"Births became zero":"ਜਨਮ ਸਿਫ਼ਰ ਹੋ ਗਏ"},"ਆਬਾਦੀ ਵਧਦੀ ਰਹੀ, ਪਰ ਉਸਦੀ ਵਾਧਾ ਦਰ ਹੌਲੀ-ਹੌਲੀ ਘਟਣ ਲੱਗੀ।"),
"GEO-POP-001-CP002-Q032":r("1981 ਤੋਂ ਬਾਅਦ ਆਬਾਦੀ ਵਾਧਾ ਦਰ ਘਟਣ ਦਾ ਇੱਕ ਮੁੱਖ ਕਾਰਨ ਕੀ ਹੈ?",{
"Declining birth rates":"ਜਨਮ ਦਰ ਵਿੱਚ ਘਾਟ",
"Rising death rates everywhere":"ਹਰ ਥਾਂ ਮੌਤ ਦਰ ਵਧਣਾ",
"End of all health services":"ਸਾਰੀਆਂ ਸਿਹਤ ਸੇਵਾਵਾਂ ਦਾ ਅੰਤ",
"No urbanisation":"ਸ਼ਹਿਰੀਕਰਨ ਦਾ ਅਭਾਵ"},"ਪ੍ਰਜਨਨ ਦਰ ਘਟਣ ਨਾਲ ਜਨਮ ਅਤੇ ਮੌਤਾਂ ਵਿਚਕਾਰ ਫਰਕ ਘਟਿਆ।"),
"GEO-POP-001-CP002-Q033":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. 1981 ਤੋਂ ਬਾਅਦ ਭਾਰਤ ਦੀ ਕੁੱਲ ਆਬਾਦੀ ਵਧਦੀ ਰਹੀ। II. ਉਸਦੀ ਵਾਧਾ ਦਰ ਹੌਲੀ-ਹੌਲੀ ਘਟੀ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਵਾਧਾ ਦਰ ਘਟਣ ਦਾ ਅਰਥ ਇਹ ਨਹੀਂ ਕਿ ਕੁੱਲ ਆਬਾਦੀ ਤੁਰੰਤ ਘਟਣ ਲੱਗੀ।"),
"GEO-POP-001-CP002-Q034":r("ਭਾਰਤ ਦੀ ਆਬਾਦੀ ਵਾਧੇ ਦੇ ਇਤਿਹਾਸ ਵਿੱਚ ਕਿਹੜੀ ਜੋੜੀ ਸਹੀ ਹੈ?",{
"After 1981 — slowing population growth rate":"1981 ਤੋਂ ਬਾਅਦ — ਆਬਾਦੀ ਵਾਧਾ ਦਰ ਵਿੱਚ ਮੰਦਗੀ",
"After 1981 — immediate population fall":"1981 ਤੋਂ ਬਾਅਦ — ਤੁਰੰਤ ਆਬਾਦੀ ਘਟਾਅ",
"1901-1921 — rapid growth":"1901-1921 — ਤੇਜ਼ ਵਾਧਾ",
"1951-1981 — stagnant growth":"1951-1981 — ਠਹਿਰਿਆ ਵਾਧਾ"},"1981 ਤੋਂ ਬਾਅਦ ਦੀ ਮਿਆਦ ਆਬਾਦੀ ਵਾਧਾ ਦਰ ਦੇ ਹੌਲੀ-ਹੌਲੀ ਘਟਣ ਨਾਲ ਪਛਾਣੀ ਜਾਂਦੀ ਹੈ।"),
"GEO-POP-001-CP002-Q035":r("ਕਿਹੜਾ ਜਨਸੰਖਿਆਕ ਬਦਲਾਅ ਕੁਦਰਤੀ ਆਬਾਦੀ ਵਾਧੇ ਨੂੰ ਸਭ ਤੋਂ ਸਿੱਧੇ ਤੌਰ ਤੇ ਘਟਾਉਂਦਾ ਹੈ?",{
"Falling fertility":"ਪ੍ਰਜਨਨ ਦਰ ਵਿੱਚ ਘਾਟ",
"Higher birth rates":"ਉੱਚੀ ਜਨਮ ਦਰ",
"Lower literacy":"ਘੱਟ ਸਾਖਰਤਾ",
"More births per woman":"ਪ੍ਰਤੀ ਔਰਤ ਵੱਧ ਜਨਮ"},"ਪ੍ਰਜਨਨ ਦਰ ਘਟਣ ਨਾਲ ਕੁੱਲ ਜਨਮ ਘਟਦੇ ਹਨ ਅਤੇ ਕੁਦਰਤੀ ਵਾਧਾ ਹੌਲਾ ਹੁੰਦਾ ਹੈ।"),
"GEO-POP-001-CP002-Q036":r("ਕੁੱਲ ਆਬਾਦੀ ਵਧਦੀ ਰਹਿੰਦੀ ਹੈ, ਪਰ ਹਰ ਦਹਾਕੇ ਦਾ ਅਨੁਪਾਤਿਕ ਵਾਧਾ ਪਹਿਲਾਂ ਨਾਲੋਂ ਘੱਟ ਹੁੰਦਾ ਹੈ। ਕੀ ਹੋ ਰਿਹਾ ਹੈ?",{
"Growth rate is declining":"ਵਾਧਾ ਦਰ ਘਟ ਰਹੀ ਹੈ",
"Population is necessarily shrinking":"ਆਬਾਦੀ ਜ਼ਰੂਰ ਘਟ ਰਹੀ ਹੈ",
"Density is zero":"ਘਣਤਾ ਸਿਫ਼ਰ ਹੈ",
"Birth rate must be rising":"ਜਨਮ ਦਰ ਜ਼ਰੂਰ ਵਧ ਰਹੀ ਹੈ"},"ਕੁੱਲ ਆਬਾਦੀ ਵਧ ਸਕਦੀ ਹੈ, ਭਾਵੇਂ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਦਰ ਘਟ ਰਹੀ ਹੋਵੇ।"),

"GEO-POP-001-CP002-Q037":r("ਉਮਰ ਸੰਰਚਨਾ ਕੀ ਦਿਖਾਉਂਦੀ ਹੈ?",{
"Distribution of population among different age groups":"ਵੱਖ-ਵੱਖ ਉਮਰ ਸਮੂਹਾਂ ਵਿੱਚ ਆਬਾਦੀ ਦੀ ਵੰਡ",
"Only population density":"ਕੇਵਲ ਆਬਾਦੀ ਦੀ ਘਣਤਾ",
"Only sex ratio":"ਕੇਵਲ ਲਿੰਗ ਅਨੁਪਾਤ",
"Only state area":"ਕੇਵਲ ਰਾਜ ਦਾ ਖੇਤਰਫਲ"},"ਉਮਰ ਸੰਰਚਨਾ ਆਬਾਦੀ ਨੂੰ ਉਮਰ ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡ ਕੇ ਉਸਦੀ ਜਨਸੰਖਿਆਕ ਬਣਤਰ ਦਿਖਾਉਂਦੀ ਹੈ।"),
"GEO-POP-001-CP002-Q038":r("ਉਮਰ ਸੰਰਚਨਾ ਮਹੱਤਵਪੂਰਨ ਕਿਉਂ ਹੈ?",{
"It indicates the balance of children, working-age people and elderly":"ਇਹ ਬੱਚਿਆਂ, ਕੰਮਕਾਜੀ ਉਮਰ ਦੇ ਲੋਕਾਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਦੇ ਅਨੁਪਾਤ ਦਾ ਸੰਕੇਤ ਦਿੰਦੀ ਹੈ",
"It measures rainfall":"ਇਹ ਵਰਖਾ ਮਾਪਦੀ ਹੈ",
"It identifies ports":"ਇਹ ਬੰਦਰਗਾਹਾਂ ਦੀ ਪਛਾਣ ਕਰਦੀ ਹੈ",
"It gives road length":"ਇਹ ਸੜਕ ਦੀ ਲੰਬਾਈ ਦੱਸਦੀ ਹੈ"},"ਵੱਖ-ਵੱਖ ਉਮਰ ਸਮੂਹਾਂ ਦੀਆਂ ਆਰਥਿਕ ਭੂਮਿਕਾਵਾਂ ਅਤੇ ਲੋੜਾਂ ਵੱਖਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ।"),
"GEO-POP-001-CP002-Q039":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਬੱਚੇ ਨਿਰਭਰ ਉਮਰ ਸਮੂਹ ਦਾ ਹਿੱਸਾ ਹਨ। II. ਬਜ਼ੁਰਗਾਂ ਦੀਆਂ ਨਿਰਭਰਤਾ ਵਾਲੀਆਂ ਲੋੜਾਂ ਵੀ ਵੱਧ ਹੋ ਸਕਦੀਆਂ ਹਨ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਨਿਰਭਰਤਾ ਦਾ ਬੋਝ ਆਬਾਦੀ ਦੀ ਉਮਰ ਸੰਰਚਨਾ ਨਾਲ ਨੇੜੇ ਤੌਰ ਤੇ ਜੁੜਿਆ ਹੁੰਦਾ ਹੈ।"),
"GEO-POP-001-CP002-Q040":r("ਉਮਰ ਸੰਰਚਨਾ ਦੀ ਸਹੀ ਪਰਿਭਾਸ਼ਾ ਕਿਹੜੀ ਹੈ?",{
"Age composition — population by age groups":"ਉਮਰ ਸੰਰਚਨਾ — ਉਮਰ ਸਮੂਹਾਂ ਅਨੁਸਾਰ ਆਬਾਦੀ",
"Age composition — population per sq km":"ਉਮਰ ਸੰਰਚਨਾ — ਪ੍ਰਤੀ ਵਰਗ ਕਿਲੋਮੀਟਰ ਆਬਾਦੀ",
"Age composition — females per 1000 males":"ਉਮਰ ਸੰਰਚਨਾ — ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ ਔਰਤਾਂ",
"Age composition — literacy percentage":"ਉਮਰ ਸੰਰਚਨਾ — ਸਾਖਰਤਾ ਪ੍ਰਤੀਸ਼ਤ"},"ਉਮਰ ਸੰਰਚਨਾ ਆਬਾਦੀ ਨੂੰ ਵੱਖ-ਵੱਖ ਉਮਰ ਵਰਗਾਂ ਅਨੁਸਾਰ ਦਰਸਾਉਂਦੀ ਹੈ।"),
"GEO-POP-001-CP002-Q041":r("ਮਜ਼ਦੂਰ-ਸ਼ਕਤੀ ਵਾਲੀ ਉਮਰ ਦੀ ਆਬਾਦੀ ਦਾ ਮੁੱਖ ਹਿੱਸਾ ਕਿਹੜਾ ਸਮੂਹ ਹੈ?",{
"Working-age population":"ਕੰਮਕਾਜੀ ਉਮਰ ਦੀ ਆਬਾਦੀ",
"Only infants":"ਕੇਵਲ ਸ਼ਿਸ਼ੂ",
"Only elderly":"ਕੇਵਲ ਬਜ਼ੁਰਗ",
"Only school children":"ਕੇਵਲ ਸਕੂਲੀ ਬੱਚੇ"},"ਕੰਮਕਾਜੀ ਉਮਰ ਦੇ ਸਮੂਹ ਸੰਭਾਵੀ ਮਜ਼ਦੂਰ-ਸ਼ਕਤੀ ਦਾ ਵੱਡਾ ਹਿੱਸਾ ਦਿੰਦੇ ਹਨ।"),
"GEO-POP-001-CP002-Q042":r("ਕਿਸੇ ਆਬਾਦੀ ਵਿੱਚ ਬੱਚਿਆਂ ਦਾ ਹਿੱਸਾ ਵੱਡਾ ਅਤੇ ਕੰਮਕਾਜੀ ਉਮਰ ਦਾ ਹਿੱਸਾ ਛੋਟਾ ਹੈ। ਕਿਹੜਾ ਬੋਝ ਵੱਧ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ?",{
"Dependency burden":"ਨਿਰਭਰਤਾ ਦਾ ਬੋਝ",
"Port capacity":"ਬੰਦਰਗਾਹ ਸਮਰੱਥਾ",
"Rail density":"ਰੇਲ ਘਣਤਾ",
"Sea depth":"ਸਮੁੰਦਰ ਦੀ ਡੂੰਘਾਈ"},"ਨਿਰਭਰ ਉਮਰ ਸਮੂਹ ਵੱਡਾ ਹੋਣ ਉੱਤੇ ਕੰਮਕਾਜੀ ਉਮਰ ਦੇ ਲੋਕਾਂ ਉੱਤੇ ਸਹਾਰਾ ਦੇਣ ਦਾ ਬੋਝ ਵਧਦਾ ਹੈ।"),

"GEO-POP-001-CP002-Q043":r("ਭਾਰਤੀ ਜਨਗਣਨਾ ਵਿੱਚ ਲਿੰਗ ਅਨੁਪਾਤ ਦੀ ਪਰਿਭਾਸ਼ਾ ਕੀ ਹੈ?",{
"Number of females per 1000 males":"ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ ਔਰਤਾਂ ਦੀ ਗਿਣਤੀ",
"Males per 100 females":"ਪ੍ਰਤੀ 100 ਔਰਤਾਂ ਪਿੱਛੇ ਮਰਦ",
"Children per household":"ਪ੍ਰਤੀ ਘਰ ਬੱਚੇ",
"Workers per square kilometre":"ਪ੍ਰਤੀ ਵਰਗ ਕਿਲੋਮੀਟਰ ਮਜ਼ਦੂਰ"},"ਭਾਰਤੀ ਜਨਗਣਨਾ ਵਿੱਚ ਲਿੰਗ ਅਨੁਪਾਤ ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ ਔਰਤਾਂ ਦੀ ਗਿਣਤੀ ਵਜੋਂ ਦਰਸਾਇਆ ਜਾਂਦਾ ਹੈ।"),
"GEO-POP-001-CP002-Q044":r("ਜਨਗਣਨਾ 2011 ਅਨੁਸਾਰ ਭਾਰਤ ਦਾ ਲਿੰਗ ਅਨੁਪਾਤ ਕਿੰਨਾ ਸੀ?",{
"943 females per 1000 males":"ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ 943 ਔਰਤਾਂ",
"843 females per 1000 males":"ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ 843 ਔਰਤਾਂ",
"1043 females per 1000 males":"ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ 1043 ਔਰਤਾਂ",
"743 females per 1000 males":"ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ 743 ਔਰਤਾਂ"},"ਜਨਗਣਨਾ 2011 ਵਿੱਚ ਭਾਰਤ ਦਾ ਲਿੰਗ ਅਨੁਪਾਤ ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ 943 ਔਰਤਾਂ ਸੀ।"),
"GEO-POP-001-CP002-Q045":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਭਾਰਤ ਵਿੱਚ ਲਿੰਗ ਅਨੁਪਾਤ ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ ਔਰਤਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਦਰਸਾਇਆ ਜਾਂਦਾ ਹੈ। II. ਜਨਗਣਨਾ 2011 ਵਿੱਚ ਰਾਸ਼ਟਰੀ ਲਿੰਗ ਅਨੁਪਾਤ 943 ਸੀ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਪਰਿਭਾਸ਼ਾ ਅਤੇ ਜਨਗਣਨਾ 2011 ਦਾ ਰਾਸ਼ਟਰੀ ਅੰਕ ਦੋਵੇਂ ਸਹੀ ਹਨ।"),
"GEO-POP-001-CP002-Q046":r("ਲਿੰਗ ਅਨੁਪਾਤ ਦੀ ਸਹੀ ਪਰਿਭਾਸ਼ਾ ਕਿਹੜੀ ਹੈ?",{
"Sex ratio — females per 1000 males":"ਲਿੰਗ ਅਨੁਪਾਤ — ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ ਔਰਤਾਂ",
"Sex ratio — persons per sq km":"ਲਿੰਗ ਅਨੁਪਾਤ — ਪ੍ਰਤੀ ਵਰਗ ਕਿਲੋਮੀਟਰ ਵਿਅਕਤੀ",
"Sex ratio — births minus deaths":"ਲਿੰਗ ਅਨੁਪਾਤ — ਜਨਮ ਘਟਾ ਮੌਤਾਂ",
"Sex ratio — literates per hundred":"ਲਿੰਗ ਅਨੁਪਾਤ — ਪ੍ਰਤੀ ਸੌ ਸਾਖਰ"},"ਲਿੰਗ ਅਨੁਪਾਤ ਔਰਤ ਅਤੇ ਮਰਦ ਆਬਾਦੀ ਦੇ ਸੰਖਿਆਤਮਕ ਸੰਤੁਲਨ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"),
"GEO-POP-001-CP002-Q047":r("ਜੇ ਕਿਸੇ ਖੇਤਰ ਦਾ ਲਿੰਗ ਅਨੁਪਾਤ 1000 ਤੋਂ ਵੱਧ ਹੋਵੇ, ਤਾਂ ਇਸਦਾ ਕੀ ਅਰਥ ਹੈ?",{
"Females outnumber males":"ਔਰਤਾਂ ਦੀ ਗਿਣਤੀ ਮਰਦਾਂ ਨਾਲੋਂ ਵੱਧ ਹੈ",
"Males outnumber females":"ਮਰਦਾਂ ਦੀ ਗਿਣਤੀ ਔਰਤਾਂ ਨਾਲੋਂ ਵੱਧ ਹੈ",
"Population density is above 1000":"ਆਬਾਦੀ ਦੀ ਘਣਤਾ 1000 ਤੋਂ ਵੱਧ ਹੈ",
"Literacy is 100 percent":"ਸਾਖਰਤਾ 100 ਪ੍ਰਤੀਸ਼ਤ ਹੈ"},"ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ 1000 ਤੋਂ ਵੱਧ ਔਰਤਾਂ ਹੋਣ ਦਾ ਅਰਥ ਹੈ ਕਿ ਔਰਤਾਂ ਸੰਖਿਆਤਮਕ ਤੌਰ ਤੇ ਵੱਧ ਹਨ।"),
"GEO-POP-001-CP002-Q048":r("ਇੱਕ ਜਨਗਣਨਾ ਸਾਰਣੀ ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ 943 ਔਰਤਾਂ ਦਿਖਾਉਂਦੀ ਹੈ। ਕਿਹੜਾ ਸੰਕੇਤਕ ਦਰਸਾਇਆ ਜਾ ਰਿਹਾ ਹੈ?",{
"Sex ratio":"ਲਿੰਗ ਅਨੁਪਾਤ",
"Population density":"ਆਬਾਦੀ ਦੀ ਘਣਤਾ",
"Decadal growth":"ਦਹਾਕਾਵਾਰ ਵਾਧਾ",
"Literacy rate":"ਸਾਖਰਤਾ ਦਰ"},"ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ ਔਰਤਾਂ ਦੀ ਗਿਣਤੀ ਲਿੰਗ ਅਨੁਪਾਤ ਦਾ ਮਿਆਰੀ ਮਾਪ ਹੈ।"),

"GEO-POP-001-CP002-Q049":r("ਸਾਖਰਤਾ ਦਰ ਕੀ ਮਾਪਦੀ ਹੈ?",{
"Share of population meeting the census literacy criterion":"ਜਨਗਣਨਾ ਦੇ ਸਾਖਰਤਾ ਮਾਪਦੰਡ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੀ ਆਬਾਦੀ ਦਾ ਹਿੱਸਾ",
"Population per square kilometre":"ਪ੍ਰਤੀ ਵਰਗ ਕਿਲੋਮੀਟਰ ਆਬਾਦੀ",
"Births minus deaths":"ਜਨਮ ਘਟਾ ਮੌਤਾਂ",
"Females per 1000 males":"ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ ਔਰਤਾਂ"},"ਸਾਖਰਤਾ ਦਰ ਜਨਗਣਨਾ ਦੀ ਪਰਿਭਾਸ਼ਾ ਅਨੁਸਾਰ ਸਮਝ ਨਾਲ ਪੜ੍ਹਨ-ਲਿਖਣ ਦੇ ਯੋਗ ਲੋਕਾਂ ਦਾ ਅਨੁਪਾਤ ਦੱਸਦੀ ਹੈ।"),
"GEO-POP-001-CP002-Q050":r("ਜਨਗਣਨਾ 2011 ਅਨੁਸਾਰ ਭਾਰਤ ਵਿੱਚ ਸਾਖਰਤਾ ਬਾਰੇ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?",{
"Male literacy was higher than female literacy":"ਮਰਦ ਸਾਖਰਤਾ ਔਰਤ ਸਾਖਰਤਾ ਨਾਲੋਂ ਵੱਧ ਸੀ",
"Female literacy was higher than male literacy nationally":"ਰਾਸ਼ਟਰੀ ਪੱਧਰ ਉੱਤੇ ਔਰਤ ਸਾਖਰਤਾ ਮਰਦ ਸਾਖਰਤਾ ਨਾਲੋਂ ਵੱਧ ਸੀ",
"Male and female literacy were exactly equal":"ਮਰਦ ਅਤੇ ਔਰਤ ਸਾਖਰਤਾ ਬਿਲਕੁਲ ਇੱਕੋ ਸੀ",
"No literacy gap existed":"ਸਾਖਰਤਾ ਵਿੱਚ ਕੋਈ ਫਰਕ ਨਹੀਂ ਸੀ"},"ਜਨਗਣਨਾ 2011 ਵਿੱਚ ਰਾਸ਼ਟਰੀ ਪੱਧਰ ਉੱਤੇ ਮਰਦ ਅਤੇ ਔਰਤ ਸਾਖਰਤਾ ਵਿੱਚ ਸਪਸ਼ਟ ਫਰਕ ਸੀ।"),
"GEO-POP-001-CP002-Q051":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਸਾਖਰਤਾ ਇੱਕ ਸਮਾਜਿਕ ਆਬਾਦੀ ਵਿਸ਼ੇਸ਼ਤਾ ਹੈ। II. ਸਾਖਰਤਾ ਖੇਤਰਾਂ ਅਤੇ ਸਮਾਜਿਕ ਸਮੂਹਾਂ ਵਿਚਕਾਰ ਵੱਖਰੀ ਹੋ ਸਕਦੀ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਸਾਖਰਤਾ ਇੱਕ ਮੁੱਖ ਮਨੁੱਖੀ ਵਿਕਾਸ ਸੰਕੇਤਕ ਹੈ ਜਿਸ ਵਿੱਚ ਥਾਂ ਅਤੇ ਸਮਾਜ ਅਨੁਸਾਰ ਫਰਕ ਹੁੰਦਾ ਹੈ।"),
"GEO-POP-001-CP002-Q052":r("ਸਾਖਰਤਾ ਦਰ ਦਾ ਸਹੀ ਵੇਰਵਾ ਕਿਹੜਾ ਹੈ?",{
"Literacy rate — educational population characteristic":"ਸਾਖਰਤਾ ਦਰ — ਆਬਾਦੀ ਦੀ ਸਿੱਖਿਆ ਨਾਲ ਜੁੜੀ ਵਿਸ਼ੇਸ਼ਤਾ",
"Literacy rate — population density":"ਸਾਖਰਤਾ ਦਰ — ਆਬਾਦੀ ਦੀ ਘਣਤਾ",
"Literacy rate — natural increase":"ਸਾਖਰਤਾ ਦਰ — ਕੁਦਰਤੀ ਵਾਧਾ",
"Literacy rate — sex ratio":"ਸਾਖਰਤਾ ਦਰ — ਲਿੰਗ ਅਨੁਪਾਤ"},"ਸਾਖਰਤਾ ਆਬਾਦੀ ਦੀ ਸਮਾਜਿਕ ਅਤੇ ਸਿੱਖਿਆ ਸੰਬੰਧੀ ਬਣਤਰ ਦਾ ਹਿੱਸਾ ਹੈ।"),
"GEO-POP-001-CP002-Q053":r("ਕਿਹੜਾ ਬਦਲਾਅ ਆਮ ਤੌਰ ਤੇ ਸਾਖਰਤਾ ਵਧਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ?",{
"Better access to schooling":"ਸਕੂਲੀ ਸਿੱਖਿਆ ਤੱਕ ਵਧੀਆ ਪਹੁੰਚ",
"Closure of schools":"ਸਕੂਲ ਬੰਦ ਕਰਨਾ",
"Greater educational exclusion":"ਸਿੱਖਿਆ ਤੋਂ ਹੋਰ ਵੰਚਿਤ ਕਰਨਾ",
"Reduced access to teachers":"ਅਧਿਆਪਕਾਂ ਤੱਕ ਪਹੁੰਚ ਘਟਾਉਣਾ"},"ਸਿੱਖਿਆ ਤੱਕ ਪਹੁੰਚ ਸਾਖਰਤਾ ਦੇ ਨਤੀਜਿਆਂ ਦਾ ਇੱਕ ਮੁੱਖ ਕਾਰਕ ਹੈ।"),
"GEO-POP-001-CP002-Q054":r("ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਸਕੂਲਾਂ ਅਤੇ ਬਾਲਗ ਸਿੱਖਿਆ ਦਾ ਫੈਲਾਅ ਕਰਦਾ ਹੈ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਪੜ੍ਹਨ-ਲਿਖਣ ਦੇ ਯੋਗ ਲੋਕ ਵਧ ਜਾਂਦੇ ਹਨ। ਕਿਹੜਾ ਸੰਕੇਤਕ ਸੁਧਰਿਆ?",{
"Literacy rate":"ਸਾਖਰਤਾ ਦਰ",
"Population density":"ਆਬਾਦੀ ਦੀ ਘਣਤਾ",
"Sea level":"ਸਮੁੰਦਰ-ਪੱਧਰ",
"Road gradient":"ਸੜਕ ਢਲਾਣ"},"ਇਹ ਬਦਲਾਅ ਸਿੱਧੇ ਤੌਰ ਤੇ ਸਾਖਰਤਾ ਨਾਲ ਜੁੜਿਆ ਹੈ।"),

"GEO-POP-001-CP002-Q055":r("ਜਨਸੰਖਿਆਕ ਸੰਕੇਤਕਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਅਰਥਾਂ ਦਾ ਸਹੀ ਜੋੜ ਕਿਹੜਾ ਹੈ?",{
"Density—persons per area; sex ratio—females per 1000 males; literacy—educational attainment":"ਘਣਤਾ—ਪ੍ਰਤੀ ਖੇਤਰ ਵਿਅਕਤੀ; ਲਿੰਗ ਅਨੁਪਾਤ—ਪ੍ਰਤੀ 1000 ਮਰਦਾਂ ਪਿੱਛੇ ਔਰਤਾਂ; ਸਾਖਰਤਾ—ਸਿੱਖਿਆਤਮਕ ਪ੍ਰਾਪਤੀ",
"Density—births minus deaths; sex ratio—area; literacy—migration":"ਘਣਤਾ—ਜਨਮ ਘਟਾ ਮੌਤਾਂ; ਲਿੰਗ ਅਨੁਪਾਤ—ਖੇਤਰਫਲ; ਸਾਖਰਤਾ—ਪਰਵਾਸ",
"All three—road measures":"ਤਿੰਨੇ—ਸੜਕ ਮਾਪ",
"All three—climate measures":"ਤਿੰਨੇ—ਜਲਵਾਯੂ ਮਾਪ"},"ਇਹ ਤਿੰਨ ਸੰਕੇਤਕ ਆਬਾਦੀ ਦੇ ਵੱਖ-ਵੱਖ ਪੱਖ ਮਾਪਦੇ ਹਨ।"),
"GEO-POP-001-CP002-Q056":r("ਕਿਹੜਾ ਸੰਕੇਤਕ ਸਿੱਧੇ ਉਮਰ ਸਮੂਹਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ?",{
"Age composition":"ਉਮਰ ਸੰਰਚਨਾ",
"Population density":"ਆਬਾਦੀ ਦੀ ਘਣਤਾ",
"Sex ratio":"ਲਿੰਗ ਅਨੁਪਾਤ",
"Road density":"ਸੜਕ ਘਣਤਾ"},"ਉਮਰ ਸੰਰਚਨਾ ਆਬਾਦੀ ਦੀ ਵੰਡ ਵੱਖ-ਵੱਖ ਉਮਰਾਂ ਅਨੁਸਾਰ ਦਿਖਾਉਂਦੀ ਹੈ।"),
"GEO-POP-001-CP002-Q057":r("ਕਿਹੜਾ ਸੰਕੇਤਕ ਔਰਤ ਅਤੇ ਮਰਦ ਆਬਾਦੀ ਦੇ ਸੰਤੁਲਨ ਨਾਲ ਸਿੱਧੇ ਤੌਰ ਤੇ ਸੰਬੰਧਿਤ ਹੈ?",{
"Sex ratio":"ਲਿੰਗ ਅਨੁਪਾਤ",
"Literacy rate":"ਸਾਖਰਤਾ ਦਰ",
"Population density":"ਆਬਾਦੀ ਦੀ ਘਣਤਾ",
"Natural increase":"ਕੁਦਰਤੀ ਵਾਧਾ"},"ਲਿੰਗ ਅਨੁਪਾਤ ਔਰਤ ਅਤੇ ਮਰਦ ਆਬਾਦੀ ਦੀ ਸੰਖਿਆਤਮਕ ਤੁਲਨਾ ਕਰਦਾ ਹੈ।"),
"GEO-POP-001-CP002-Q058":r("ਜਨਗਣਨਾ ਮਾਪਦੰਡ ਅਨੁਸਾਰ ਪੜ੍ਹਨ ਅਤੇ ਲਿਖਣ ਦੀ ਯੋਗਤਾ ਨਾਲ ਸਿੱਧੇ ਤੌਰ ਤੇ ਜੁੜਿਆ ਸੰਕੇਤਕ ਕਿਹੜਾ ਹੈ?",{
"Literacy rate":"ਸਾਖਰਤਾ ਦਰ",
"Sex ratio":"ਲਿੰਗ ਅਨੁਪਾਤ",
"Population density":"ਆਬਾਦੀ ਦੀ ਘਣਤਾ",
"Natural increase":"ਕੁਦਰਤੀ ਵਾਧਾ"},"ਸਾਖਰਤਾ ਦਰ ਜਨਗਣਨਾ ਦੀ ਪਰਿਭਾਸ਼ਾ ਅਨੁਸਾਰ ਸਿੱਖਿਆਤਮਕ ਪ੍ਰਾਪਤੀ ਮਾਪਦੀ ਹੈ।"),
"GEO-POP-001-CP002-Q059":r("ਕਿਹੜੀ ਤੁਲਨਾ ਸਹੀ ਹੈ?",{
"Density is spatial, while age composition is demographic-structural":"ਘਣਤਾ ਥਾਂ ਨਾਲ ਜੁੜੀ ਹੈ, ਜਦਕਿ ਉਮਰ ਸੰਰਚਨਾ ਆਬਾਦੀ ਦੀ ਅੰਦਰੂਨੀ ਬਣਤਰ ਨਾਲ ਜੁੜੀ ਹੈ",
"Both are rainfall measures":"ਦੋਵੇਂ ਵਰਖਾ ਦੇ ਮਾਪ ਹਨ",
"Age composition is persons per sq km":"ਉਮਰ ਸੰਰਚਨਾ ਪ੍ਰਤੀ ਵਰਗ ਕਿਲੋਮੀਟਰ ਵਿਅਕਤੀ ਹੈ",
"Density is a literacy measure":"ਘਣਤਾ ਸਾਖਰਤਾ ਦਾ ਮਾਪ ਹੈ"},"ਘਣਤਾ ਆਬਾਦੀ ਨੂੰ ਖੇਤਰ ਨਾਲ ਜੋੜਦੀ ਹੈ, ਜਦਕਿ ਉਮਰ ਸੰਰਚਨਾ ਆਬਾਦੀ ਦੀ ਬਣਤਰ ਦੱਸਦੀ ਹੈ।"),
"GEO-POP-001-CP002-Q060":r("ਇੱਕ ਸਾਰਣੀ ਵਿੱਚ ਉਮਰ ਸਮੂਹ, ਸਾਖਰਤਾ ਅਤੇ ਲਿੰਗ ਅਨੁਪਾਤ ਦਿੱਤੇ ਹਨ। ਇਹ ਕਿਸ ਕਿਸਮ ਦੀ ਜਾਣਕਾਰੀ ਦਾ ਸਾਰ ਹੈ?",{
"Population composition":"ਆਬਾਦੀ ਦੀ ਸੰਰਚਨਾ",
"Only transport geography":"ਕੇਵਲ ਆਵਾਜਾਈ ਭੂਗੋਲ",
"Only climate":"ਕੇਵਲ ਜਲਵਾਯੂ",
"Only mineral resources":"ਕੇਵਲ ਖਣਿਜ ਸਰੋਤ"},"ਇਹ ਸੰਕੇਤਕ ਆਬਾਦੀ ਦੀ ਜਨਸੰਖਿਆਕ ਅਤੇ ਸਮਾਜਿਕ ਬਣਤਰ ਦਾ ਵਰਣਨ ਕਰਦੇ ਹਨ।")
});

export function localizeGeoPop001ExactCp002PartB(question:CanonicalQuestion,language:Lang){
 const rec=(language==="hi"?HI:PA)[question.questionId];if(!rec)return null;
 const options=question.options.map(source=>{const t=rec.optionBySource[source];if(!t)throw new Error(`Missing GEO-POP-001 CP002B ${language} option translation for ${question.questionId}: ${source}`);return t;});
 return Object.freeze({stem:rec.stem,options:Object.freeze(options),canonicalAnswer:options[question.correctIndex]!,explanation:rec.explanation});
}
