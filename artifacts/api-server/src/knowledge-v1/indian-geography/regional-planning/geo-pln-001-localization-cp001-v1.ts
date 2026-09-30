type CanonicalQuestion=Readonly<{questionId:string;options:readonly string[];correctIndex:number;}>;
type Lang="hi"|"pa";
type ExactRecord=Readonly<{stem:string;optionBySource:Readonly<Record<string,string>>;explanation:string}>;
const r=(stem:string,optionBySource:Record<string,string>,explanation:string):ExactRecord=>Object.freeze({stem,optionBySource:Object.freeze(optionBySource),explanation});

const HI:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-PLN-001-CP001-Q001":r("भौगोलिक विकास के संदर्भ में नियोजन क्या है?",{
"Deliberate allocation of resources to achieve defined development goals":"निर्धारित विकास लक्ष्यों को प्राप्त करने के लिए संसाधनों का योजनाबद्ध आवंटन",
"Random use of resources":"संसाधनों का अनियमित उपयोग",
"Only map drawing":"केवल मानचित्र बनाना",
"Only population counting":"केवल जनसंख्या की गणना"},"नियोजन में विकास के लक्ष्यों, प्राथमिकताओं, संसाधनों और क्रियान्वयन को समन्वित किया जाता है।"),
"GEO-PLN-001-CP001-Q002":r("भारत में क्षेत्रीय नियोजन की आवश्यकता क्यों है?",{
"Different regions have different resources, problems and development levels":"विभिन्न क्षेत्रों के संसाधन, समस्याएं और विकास स्तर अलग-अलग हैं",
"All regions are identical":"सभी क्षेत्र एक जैसे हैं",
"Only cities need development":"केवल शहरों को विकास की आवश्यकता है",
"Physical geography never affects development":"भौतिक भूगोल का विकास पर कोई प्रभाव नहीं पड़ता"},"क्षेत्रीय भिन्नताओं के कारण एक समान विकास पद्धति हर क्षेत्र के लिए उपयुक्त नहीं होती।"),
"GEO-PLN-001-CP001-Q003":r("कथनों पर विचार करें: I. नियोजन में प्राथमिकताएं तय की जाती हैं। II. इसमें संसाधनों का आवंटन भी शामिल होता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"नियोजन में लक्ष्यों को संसाधनों के आवंटन और क्रियान्वयन से जोड़ा जाता है।"),
"GEO-PLN-001-CP001-Q004":r("नियोजन के तर्क को सही दर्शाने वाली जोड़ी कौन-सी है?",{
"Regional planning — development tailored to area-specific needs":"क्षेत्रीय नियोजन — क्षेत्र-विशिष्ट आवश्यकताओं के अनुसार विकास",
"Regional planning — same solution for all areas":"क्षेत्रीय नियोजन — सभी क्षेत्रों के लिए एक ही समाधान",
"Planning — no objectives":"नियोजन — कोई लक्ष्य नहीं",
"Planning — no resource allocation":"नियोजन — संसाधनों का कोई आवंटन नहीं"},"क्षेत्रीय नियोजन स्थानीय परिस्थितियों और आवश्यकताओं के अनुसार विकास उपाय तय करता है।"),
"GEO-PLN-001-CP001-Q005":r("सूखा-प्रवण जिले के लिए जल कमी और आजीविका जोखिम को ध्यान में रखकर विकास कार्यक्रम बनाया गया है। यह किसका उदाहरण है?",{
"Area-specific planning":"क्षेत्र-विशिष्ट नियोजन",
"Random investment":"अनियमित निवेश",
"Only national averaging":"केवल राष्ट्रीय औसत पर आधारित योजना",
"No planning":"कोई नियोजन नहीं"},"यह हस्तक्षेप क्षेत्र की विशेष समस्या को ध्यान में रखकर बनाया गया है।"),

"GEO-PLN-001-CP001-Q006":r("लक्षित-क्षेत्र नियोजन क्या है?",{
"Development planning focused on a specific problem region":"किसी विशेष समस्या वाले क्षेत्र पर केंद्रित विकास नियोजन",
"Planning only for individuals":"केवल व्यक्तियों के लिए नियोजन",
"Planning with no geographic focus":"बिना किसी भौगोलिक केंद्र के नियोजन",
"Only urban zoning":"केवल शहरी क्षेत्र-विभाजन"},"लक्षित-क्षेत्र कार्यक्रम किसी स्पष्ट भौगोलिक क्षेत्र की विशेष विकास समस्या पर केंद्रित होते हैं।"),
"GEO-PLN-001-CP001-Q007":r("लक्षित-क्षेत्र नियोजन का उदाहरण कौन-सा है?",{
"Drought-prone area development":"सूखा-प्रवण क्षेत्र विकास",
"Scholarship for one student":"एक छात्र के लिए छात्रवृत्ति",
"Individual pension only":"केवल व्यक्तिगत पेंशन",
"Private household budgeting":"निजी परिवार का बजट"},"सूखा-प्रवण क्षेत्र कार्यक्रम एक निश्चित भौगोलिक क्षेत्र को लक्षित करता है।"),
"GEO-PLN-001-CP001-Q008":r("पर्वतीय क्षेत्र कार्यक्रम लक्षित-क्षेत्र नियोजन के उदाहरण क्यों हैं?",{
"They focus on regions with specific physical constraints":"वे विशेष भौतिक बाधाओं वाले क्षेत्रों पर केंद्रित होते हैं",
"They target only one occupation":"वे केवल एक व्यवसाय को लक्षित करते हैं",
"They are unrelated to geography":"उनका भूगोल से कोई संबंध नहीं",
"They cover all regions equally":"वे सभी क्षेत्रों को समान रूप से शामिल करते हैं"},"पर्वतीय क्षेत्रों में पहुंच, ढाल और संसाधन उपयोग से जुड़ी विशिष्ट सीमाएं होती हैं।"),
"GEO-PLN-001-CP001-Q009":r("कथनों पर विचार करें: I. लक्षित-क्षेत्र नियोजन क्षेत्रों पर केंद्रित होता है। II. यह भौतिक या सामाजिक-आर्थिक पिछड़ेपन को संबोधित कर सकता है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"लक्षित-क्षेत्र नियोजन किसी निश्चित क्षेत्र की पहचानी गई विकास आवश्यकता पर केंद्रित होता है।"),
"GEO-PLN-001-CP001-Q010":r("एक कार्यक्रम केवल लंबे समय से सूखा प्रभावित जिलों के लिए बनाया गया है। इसमें कौन-सा नियोजन दृष्टिकोण अपनाया गया है?",{
"Target-area planning":"लक्षित-क्षेत्र नियोजन",
"Target-group planning":"लक्षित-समूह नियोजन",
"No planning":"कोई नियोजन नहीं",
"Only sectoral accounting":"केवल क्षेत्रीय लेखांकन"},"इस कार्यक्रम में भौगोलिक क्षेत्र ही हस्तक्षेप की मुख्य इकाई है।"),

"GEO-PLN-001-CP001-Q011":r("लक्षित-समूह नियोजन क्या है?",{
"Planning focused on a specific section of population":"जनसंख्या के किसी विशेष वर्ग पर केंद्रित नियोजन",
"Planning focused only on a river basin":"केवल नदी बेसिन पर केंद्रित नियोजन",
"Planning with no beneficiaries":"बिना लाभार्थियों वाला नियोजन",
"Only city master planning":"केवल शहर का मास्टर प्लान"},"लक्षित-समूह कार्यक्रम किसी स्पष्ट सामाजिक या आर्थिक समूह को ध्यान में रखकर बनाए जाते हैं।"),
"GEO-PLN-001-CP001-Q012":r("लक्षित-समूह नियोजन का उपयुक्त उदाहरण कौन-सा है?",{
"Programme for small and marginal farmers":"छोटे और सीमांत किसानों के लिए कार्यक्रम",
"Hill-area development programme":"पर्वतीय क्षेत्र विकास कार्यक्रम",
"Drought-prone area programme":"सूखा-प्रवण क्षेत्र कार्यक्रम",
"River-basin zoning":"नदी बेसिन क्षेत्र-विभाजन"},"छोटे और सीमांत किसान एक निश्चित लाभार्थी समूह हैं, न कि कोई एक भौगोलिक क्षेत्र।"),
"GEO-PLN-001-CP001-Q013":r("लक्षित-समूह नियोजन लक्षित-क्षेत्र नियोजन से कैसे भिन्न है?",{
"It focuses on people rather than a specific geographic region":"यह किसी विशेष भौगोलिक क्षेत्र के बजाय लोगों के समूह पर केंद्रित होता है",
"It has no beneficiaries":"इसमें कोई लाभार्थी नहीं होते",
"It ignores social groups":"यह सामाजिक समूहों की अनदेखी करता है",
"It always covers only mountains":"यह हमेशा केवल पर्वतीय क्षेत्रों को शामिल करता है"},"लक्षित-समूह नियोजन का आधार जनसंख्या समूह होता है, जबकि लक्षित-क्षेत्र नियोजन का आधार भू-भाग होता है।"),
"GEO-PLN-001-CP001-Q014":r("कथनों पर विचार करें: I. लक्षित-समूह नियोजन लाभार्थी वर्गों पर केंद्रित होता है। II. ऐसे समूह कई क्षेत्रों में फैले हो सकते हैं। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"सामाजिक या आर्थिक समूह एक से अधिक क्षेत्रों में फैला हो सकता है।"),
"GEO-PLN-001-CP001-Q015":r("कई जिलों में भूमिहीन मजदूरों को विशेष सहायता देने वाला कार्यक्रम किस दृष्टिकोण का उदाहरण है?",{
"Target-group planning":"लक्षित-समूह नियोजन",
"Target-area planning":"लक्षित-क्षेत्र नियोजन",
"Regional zoning only":"केवल क्षेत्रीय क्षेत्र-विभाजन",
"No planning":"कोई नियोजन नहीं"},"यहां कार्यक्रम का आधार लाभार्थी समूह है, कोई एक भौगोलिक क्षेत्र नहीं।"),

"GEO-PLN-001-CP001-Q016":r("पर्वतीय क्षेत्र नियोजन किस प्रमुख समस्या को संबोधित करता है?",{
"Development constraints caused by difficult terrain and fragile environments":"दुर्गम भूभाग और संवेदनशील पर्यावरण से उत्पन्न विकास बाधाएं",
"Only coastal flooding":"केवल तटीय बाढ़",
"Only urban traffic":"केवल शहरी यातायात",
"Only desert salinity":"केवल मरुस्थलीय लवणता"},"पर्वतीय क्षेत्रों में पहुंच, ढाल और पर्यावरणीय संवेदनशीलता विकास को कठिन बनाती है।"),
"GEO-PLN-001-CP001-Q017":r("टिकाऊ पर्वतीय विकास में कौन-सी गतिविधि महत्वपूर्ण है?",{
"Horticulture, forestry and soil conservation suited to slopes":"ढालों के अनुकूल बागवानी, वानिकी और मृदा संरक्षण",
"Uncontrolled deforestation":"अनियंत्रित वनों की कटाई",
"Large-scale slope clearing":"बड़े पैमाने पर ढालों की सफाई",
"Ignoring erosion":"मृदा अपरदन की अनदेखी"},"पर्वतीय विकास को स्थानीय पारिस्थितिकी और भूमि क्षमता के अनुरूप होना चाहिए।"),
"GEO-PLN-001-CP001-Q018":r("पर्वतीय क्षेत्रों में परिवहन सुधारना महत्वपूर्ण क्यों है?",{
"Difficult terrain can isolate settlements and markets":"दुर्गम भूभाग बस्तियों और बाजारों को अलग-थलग कर सकता है",
"Hill areas have no settlements":"पर्वतीय क्षेत्रों में बस्तियां नहीं होतीं",
"Transport worsens every livelihood":"परिवहन हर आजीविका को खराब करता है",
"Roads are unrelated to development":"सड़कें विकास से संबंधित नहीं हैं"},"बेहतर संपर्क से सेवाओं, बाजारों और रोजगार के अवसरों तक पहुंच आसान होती है।"),
"GEO-PLN-001-CP001-Q019":r("कथनों पर विचार करें: I. पर्वतीय विकास में पर्यावरणीय संवेदनशीलता का ध्यान रखना चाहिए। II. ढाल के अनुकूल भूमि उपयोग महत्वपूर्ण है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"पर्वतीय विकास में आजीविका और पर्यावरणीय स्थिरता के बीच संतुलन आवश्यक है।"),
"GEO-PLN-001-CP001-Q020":r("एक पर्वतीय कार्यक्रम बागवानी, सीढ़ीदार खेती और बेहतर संपर्क सड़कों को बढ़ावा देता है। यह किस प्रकार का नियोजन है?",{
"Hill-area development":"पर्वतीय क्षेत्र विकास",
"Coastal-zone planning":"तटीय क्षेत्र नियोजन",
"Desert irrigation only":"केवल मरुस्थलीय सिंचाई",
"Port planning":"बंदरगाह नियोजन"},"ये उपाय पर्वतीय क्षेत्र की विशेष परिस्थितियों के अनुरूप हैं।"),

"GEO-PLN-001-CP001-Q021":r("सूखा-प्रवण क्षेत्र नियोजन का प्रमुख उद्देश्य क्या है?",{
"Reduce vulnerability to chronic water scarcity":"लंबे समय तक रहने वाली जल कमी के प्रति संवेदनशीलता कम करना",
"Increase water wastage":"पानी की बर्बादी बढ़ाना",
"Promote floodplain settlement":"बाढ़ मैदानों में बसावट बढ़ाना",
"Ignore rainfall variability":"वर्षा की अनिश्चितता की अनदेखी करना"},"ऐसे कार्यक्रम बार-बार सूखा पड़ने वाले क्षेत्रों में आजीविका और जल सुरक्षा को स्थिर करने का प्रयास करते हैं।"),
"GEO-PLN-001-CP001-Q022":r("सूखा-प्रवण क्षेत्र में कौन-सा उपाय उपयुक्त है?",{
"Watershed development and water conservation":"वाटरशेड विकास और जल संरक्षण",
"Uncontrolled groundwater extraction":"अनियंत्रित भूजल दोहन",
"Removal of tanks":"तालाबों को हटाना",
"High-water crops everywhere":"हर जगह अधिक पानी वाली फसलें उगाना"},"जल संरक्षण स्थानीय जल सुरक्षा और सूखा-रोधी क्षमता बढ़ाता है।"),
"GEO-PLN-001-CP001-Q023":r("सूखा-प्रवण क्षेत्र नियोजन के लिए कौन-सी आजीविका रणनीति उपयुक्त है?",{
"Activities adapted to limited water availability":"सीमित जल उपलब्धता के अनुकूल गतिविधियां",
"Only water-intensive farming":"केवल अधिक पानी वाली खेती",
"No livelihood diversification":"आजीविका में कोई विविधता नहीं",
"Permanent fallow everywhere":"हर जगह स्थायी परती भूमि"},"ऐसे क्षेत्रों में आजीविका को सीमित जल उपलब्धता के अनुरूप होना चाहिए।"),
"GEO-PLN-001-CP001-Q024":r("कथनों पर विचार करें: I. सूखा-प्रवण क्षेत्र नियोजन लक्षित-क्षेत्र नियोजन है। II. इसमें जल संरक्षण का केंद्रीय महत्व है। सही विकल्प कौन-सा है?",{
"Both I and II are correct":"I और II दोनों सही हैं",
"Only I is correct":"केवल I सही है",
"Only II is correct":"केवल II सही है",
"Neither I nor II is correct":"न तो I और न ही II सही है"},"यह कार्यक्रम किसी निश्चित समस्या-ग्रस्त क्षेत्र को लक्षित करता है और उसकी मुख्य जल समस्या को संबोधित करता है।"),
"GEO-PLN-001-CP001-Q025":r("एक अर्ध-शुष्क जिले में बार-बार सूखा पड़ने के कारण वाटरशेड उपचार और आजीविका विविधीकरण किया जाता है। यह किस दृष्टिकोण का उदाहरण है?",{
"Drought-prone area planning":"सूखा-प्रवण क्षेत्र नियोजन",
"Port-led development":"बंदरगाह-आधारित विकास",
"Urban renewal only":"केवल शहरी नवीनीकरण",
"No regional planning":"कोई क्षेत्रीय नियोजन नहीं"},"यह कार्यक्रम क्षेत्र की बार-बार आने वाली सूखा समस्या के अनुसार बनाया गया है।")
});

const PA:Readonly<Record<string,ExactRecord>>=Object.freeze({
"GEO-PLN-001-CP001-Q001":r("ਭੂਗੋਲਿਕ ਵਿਕਾਸ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਯੋਜਨਾਬੰਦੀ ਕੀ ਹੈ?",{
"Deliberate allocation of resources to achieve defined development goals":"ਨਿਰਧਾਰਤ ਵਿਕਾਸ ਟੀਚਿਆਂ ਨੂੰ ਹਾਸਲ ਕਰਨ ਲਈ ਸਰੋਤਾਂ ਦੀ ਸੋਚ-ਸਮਝ ਕੇ ਵੰਡ",
"Random use of resources":"ਸਰੋਤਾਂ ਦੀ ਬੇਤਰਤੀਬ ਵਰਤੋਂ",
"Only map drawing":"ਕੇਵਲ ਨਕਸ਼ੇ ਬਣਾਉਣਾ",
"Only population counting":"ਕੇਵਲ ਆਬਾਦੀ ਦੀ ਗਿਣਤੀ"},"ਯੋਜਨਾਬੰਦੀ ਵਿੱਚ ਵਿਕਾਸ ਦੇ ਟੀਚੇ, ਤਰਜੀਹਾਂ, ਸਰੋਤ ਅਤੇ ਕਾਰਵਾਈਆਂ ਨੂੰ ਇਕੱਠੇ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q002":r("ਭਾਰਤ ਵਿੱਚ ਖੇਤਰੀ ਯੋਜਨਾਬੰਦੀ ਦੀ ਲੋੜ ਕਿਉਂ ਹੈ?",{
"Different regions have different resources, problems and development levels":"ਵੱਖ-ਵੱਖ ਖੇਤਰਾਂ ਦੇ ਸਰੋਤ, ਸਮੱਸਿਆਵਾਂ ਅਤੇ ਵਿਕਾਸ ਪੱਧਰ ਵੱਖਰੇ ਹਨ",
"All regions are identical":"ਸਾਰੇ ਖੇਤਰ ਇੱਕੋ ਜਿਹੇ ਹਨ",
"Only cities need development":"ਕੇਵਲ ਸ਼ਹਿਰਾਂ ਨੂੰ ਵਿਕਾਸ ਦੀ ਲੋੜ ਹੈ",
"Physical geography never affects development":"ਭੌਤਿਕ ਭੂਗੋਲ ਦਾ ਵਿਕਾਸ ਉੱਤੇ ਕੋਈ ਅਸਰ ਨਹੀਂ ਪੈਂਦਾ"},"ਖੇਤਰੀ ਅੰਤਰਾਂ ਕਾਰਨ ਇੱਕੋ ਜਿਹੀ ਵਿਕਾਸ ਪੱਧਤੀ ਹਰ ਖੇਤਰ ਲਈ ਢੁੱਕਵੀਂ ਨਹੀਂ ਹੁੰਦੀ।"),
"GEO-PLN-001-CP001-Q003":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਯੋਜਨਾਬੰਦੀ ਵਿੱਚ ਤਰਜੀਹਾਂ ਤੈਅ ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। II. ਇਸ ਵਿੱਚ ਸਰੋਤਾਂ ਦੀ ਵੰਡ ਵੀ ਸ਼ਾਮਲ ਹੁੰਦੀ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਯੋਜਨਾਬੰਦੀ ਵਿੱਚ ਟੀਚਿਆਂ ਨੂੰ ਸਰੋਤਾਂ ਦੀ ਵੰਡ ਅਤੇ ਅਮਲ ਨਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q004":r("ਯੋਜਨਾਬੰਦੀ ਦੇ ਤਰਕ ਨੂੰ ਸਹੀ ਦਰਸਾਉਣ ਵਾਲੀ ਜੋੜੀ ਕਿਹੜੀ ਹੈ?",{
"Regional planning — development tailored to area-specific needs":"ਖੇਤਰੀ ਯੋਜਨਾਬੰਦੀ — ਖੇਤਰ ਦੀਆਂ ਖਾਸ ਲੋੜਾਂ ਅਨੁਸਾਰ ਵਿਕਾਸ",
"Regional planning — same solution for all areas":"ਖੇਤਰੀ ਯੋਜਨਾਬੰਦੀ — ਸਾਰੇ ਖੇਤਰਾਂ ਲਈ ਇੱਕੋ ਹੱਲ",
"Planning — no objectives":"ਯੋਜਨਾਬੰਦੀ — ਕੋਈ ਟੀਚਾ ਨਹੀਂ",
"Planning — no resource allocation":"ਯੋਜਨਾਬੰਦੀ — ਸਰੋਤਾਂ ਦੀ ਕੋਈ ਵੰਡ ਨਹੀਂ"},"ਖੇਤਰੀ ਯੋਜਨਾਬੰਦੀ ਸਥਾਨਕ ਹਾਲਾਤਾਂ ਅਤੇ ਲੋੜਾਂ ਅਨੁਸਾਰ ਵਿਕਾਸ ਕਦਮ ਤੈਅ ਕਰਦੀ ਹੈ।"),
"GEO-PLN-001-CP001-Q005":r("ਸੁੱਕਾ-ਪ੍ਰਵਣ ਜ਼ਿਲ੍ਹੇ ਲਈ ਪਾਣੀ ਦੀ ਘਾਟ ਅਤੇ ਰੋਜ਼ੀ-ਰੋਟੀ ਦੇ ਖ਼ਤਰੇ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਵਿਕਾਸ ਪ੍ਰੋਗਰਾਮ ਬਣਾਇਆ ਗਿਆ ਹੈ। ਇਹ ਕਿਸ ਦੀ ਉਦਾਹਰਨ ਹੈ?",{
"Area-specific planning":"ਖੇਤਰ-ਵਿਸ਼ੇਸ਼ ਯੋਜਨਾਬੰਦੀ",
"Random investment":"ਬੇਤਰਤੀਬ ਨਿਵੇਸ਼",
"Only national averaging":"ਕੇਵਲ ਰਾਸ਼ਟਰੀ ਔਸਤ ਉੱਤੇ ਆਧਾਰਿਤ ਯੋਜਨਾ",
"No planning":"ਕੋਈ ਯੋਜਨਾਬੰਦੀ ਨਹੀਂ"},"ਇਹ ਦਖ਼ਲ ਖੇਤਰ ਦੀ ਖਾਸ ਸਮੱਸਿਆ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਬਣਾਇਆ ਗਿਆ ਹੈ।"),

"GEO-PLN-001-CP001-Q006":r("ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਕੀ ਹੈ?",{
"Development planning focused on a specific problem region":"ਕਿਸੇ ਖਾਸ ਸਮੱਸਿਆ ਵਾਲੇ ਖੇਤਰ ਉੱਤੇ ਕੇਂਦਰਿਤ ਵਿਕਾਸ ਯੋਜਨਾਬੰਦੀ",
"Planning only for individuals":"ਕੇਵਲ ਵਿਅਕਤੀਆਂ ਲਈ ਯੋਜਨਾਬੰਦੀ",
"Planning with no geographic focus":"ਬਿਨਾਂ ਕਿਸੇ ਭੂਗੋਲਿਕ ਕੇਂਦਰ ਦੇ ਯੋਜਨਾਬੰਦੀ",
"Only urban zoning":"ਕੇਵਲ ਸ਼ਹਿਰੀ ਖੇਤਰ-ਵੰਡ"},"ਟੀਚਾ-ਖੇਤਰ ਪ੍ਰੋਗਰਾਮ ਕਿਸੇ ਸਪਸ਼ਟ ਭੂਗੋਲਿਕ ਖੇਤਰ ਦੀ ਖਾਸ ਵਿਕਾਸ ਸਮੱਸਿਆ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੁੰਦੇ ਹਨ।"),
"GEO-PLN-001-CP001-Q007":r("ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਦੀ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?",{
"Drought-prone area development":"ਸੁੱਕਾ-ਪ੍ਰਵਣ ਖੇਤਰ ਵਿਕਾਸ",
"Scholarship for one student":"ਇੱਕ ਵਿਦਿਆਰਥੀ ਲਈ ਵਜ਼ੀਫ਼ਾ",
"Individual pension only":"ਕੇਵਲ ਨਿੱਜੀ ਪੈਨਸ਼ਨ",
"Private household budgeting":"ਨਿੱਜੀ ਘਰੇਲੂ ਬਜਟ"},"ਸੁੱਕਾ-ਪ੍ਰਵਣ ਖੇਤਰ ਪ੍ਰੋਗਰਾਮ ਇੱਕ ਨਿਰਧਾਰਤ ਭੂਗੋਲਿਕ ਖੇਤਰ ਨੂੰ ਟੀਚਾ ਬਣਾਉਂਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q008":r("ਪਹਾੜੀ ਖੇਤਰਾਂ ਦੇ ਪ੍ਰੋਗਰਾਮ ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਦੀਆਂ ਉਦਾਹਰਨਾਂ ਕਿਉਂ ਹਨ?",{
"They focus on regions with specific physical constraints":"ਉਹ ਖਾਸ ਭੌਤਿਕ ਰੁਕਾਵਟਾਂ ਵਾਲੇ ਖੇਤਰਾਂ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੁੰਦੇ ਹਨ",
"They target only one occupation":"ਉਹ ਕੇਵਲ ਇੱਕ ਪੇਸ਼ੇ ਨੂੰ ਟੀਚਾ ਬਣਾਉਂਦੇ ਹਨ",
"They are unrelated to geography":"ਉਨ੍ਹਾਂ ਦਾ ਭੂਗੋਲ ਨਾਲ ਕੋਈ ਸੰਬੰਧ ਨਹੀਂ",
"They cover all regions equally":"ਉਹ ਸਾਰੇ ਖੇਤਰਾਂ ਨੂੰ ਇੱਕੋ ਜਿਹਾ ਸ਼ਾਮਲ ਕਰਦੇ ਹਨ"},"ਪਹਾੜੀ ਖੇਤਰਾਂ ਵਿੱਚ ਪਹੁੰਚ, ਢਲਾਣ ਅਤੇ ਸਰੋਤ ਵਰਤੋਂ ਨਾਲ ਜੁੜੀਆਂ ਖਾਸ ਰੁਕਾਵਟਾਂ ਹੁੰਦੀਆਂ ਹਨ।"),
"GEO-PLN-001-CP001-Q009":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਖੇਤਰਾਂ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੁੰਦੀ ਹੈ। II. ਇਹ ਭੌਤਿਕ ਜਾਂ ਸਮਾਜਿਕ-ਆਰਥਿਕ ਪਿੱਛੜੇਪਣ ਨੂੰ ਸੰਬੋਧਿਤ ਕਰ ਸਕਦੀ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਕਿਸੇ ਨਿਰਧਾਰਤ ਖੇਤਰ ਦੀ ਪਛਾਣੀ ਗਈ ਵਿਕਾਸ ਲੋੜ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੁੰਦੀ ਹੈ।"),
"GEO-PLN-001-CP001-Q010":r("ਇੱਕ ਪ੍ਰੋਗਰਾਮ ਕੇਵਲ ਲੰਮੇ ਸਮੇਂ ਤੋਂ ਸੁੱਕੇ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਜ਼ਿਲ੍ਹਿਆਂ ਲਈ ਬਣਾਇਆ ਗਿਆ ਹੈ। ਕਿਹੜਾ ਯੋਜਨਾਬੰਦੀ ਦ੍ਰਿਸ਼ਟੀਕੋਣ ਵਰਤਿਆ ਗਿਆ ਹੈ?",{
"Target-area planning":"ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ",
"Target-group planning":"ਟੀਚਾ-ਸਮੂਹ ਯੋਜਨਾਬੰਦੀ",
"No planning":"ਕੋਈ ਯੋਜਨਾਬੰਦੀ ਨਹੀਂ",
"Only sectoral accounting":"ਕੇਵਲ ਖੇਤਰੀ ਲੇਖਾ-ਜੋਖਾ"},"ਇਸ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਭੂਗੋਲਿਕ ਖੇਤਰ ਹੀ ਦਖ਼ਲ ਦੀ ਮੁੱਖ ਇਕਾਈ ਹੈ।"),

"GEO-PLN-001-CP001-Q011":r("ਟੀਚਾ-ਸਮੂਹ ਯੋਜਨਾਬੰਦੀ ਕੀ ਹੈ?",{
"Planning focused on a specific section of population":"ਆਬਾਦੀ ਦੇ ਕਿਸੇ ਖਾਸ ਵਰਗ ਉੱਤੇ ਕੇਂਦਰਿਤ ਯੋਜਨਾਬੰਦੀ",
"Planning focused only on a river basin":"ਕੇਵਲ ਨਦੀ ਬੇਸਿਨ ਉੱਤੇ ਕੇਂਦਰਿਤ ਯੋਜਨਾਬੰਦੀ",
"Planning with no beneficiaries":"ਬਿਨਾਂ ਲਾਭਪਾਤਰੀਆਂ ਵਾਲੀ ਯੋਜਨਾਬੰਦੀ",
"Only city master planning":"ਕੇਵਲ ਸ਼ਹਿਰ ਦੀ ਮਾਸਟਰ ਯੋਜਨਾ"},"ਟੀਚਾ-ਸਮੂਹ ਪ੍ਰੋਗਰਾਮ ਕਿਸੇ ਸਪਸ਼ਟ ਸਮਾਜਿਕ ਜਾਂ ਆਰਥਿਕ ਸਮੂਹ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਬਣਾਏ ਜਾਂਦੇ ਹਨ।"),
"GEO-PLN-001-CP001-Q012":r("ਟੀਚਾ-ਸਮੂਹ ਯੋਜਨਾਬੰਦੀ ਲਈ ਢੁੱਕਵੀਂ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?",{
"Programme for small and marginal farmers":"ਛੋਟੇ ਅਤੇ ਸੀਮਾਂਤ ਕਿਸਾਨਾਂ ਲਈ ਪ੍ਰੋਗਰਾਮ",
"Hill-area development programme":"ਪਹਾੜੀ ਖੇਤਰ ਵਿਕਾਸ ਪ੍ਰੋਗਰਾਮ",
"Drought-prone area programme":"ਸੁੱਕਾ-ਪ੍ਰਵਣ ਖੇਤਰ ਪ੍ਰੋਗਰਾਮ",
"River-basin zoning":"ਨਦੀ ਬੇਸਿਨ ਖੇਤਰ-ਵੰਡ"},"ਛੋਟੇ ਅਤੇ ਸੀਮਾਂਤ ਕਿਸਾਨ ਇੱਕ ਨਿਰਧਾਰਤ ਲਾਭਪਾਤਰੀ ਸਮੂਹ ਹਨ, ਕੋਈ ਇੱਕ ਭੂਗੋਲਿਕ ਖੇਤਰ ਨਹੀਂ।"),
"GEO-PLN-001-CP001-Q013":r("ਟੀਚਾ-ਸਮੂਹ ਯੋਜਨਾਬੰਦੀ ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਤੋਂ ਕਿਵੇਂ ਵੱਖਰੀ ਹੈ?",{
"It focuses on people rather than a specific geographic region":"ਇਹ ਕਿਸੇ ਖਾਸ ਭੂਗੋਲਿਕ ਖੇਤਰ ਦੀ ਬਜਾਇ ਲੋਕਾਂ ਦੇ ਸਮੂਹ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੁੰਦੀ ਹੈ",
"It has no beneficiaries":"ਇਸ ਵਿੱਚ ਕੋਈ ਲਾਭਪਾਤਰੀ ਨਹੀਂ ਹੁੰਦੇ",
"It ignores social groups":"ਇਹ ਸਮਾਜਿਕ ਸਮੂਹਾਂ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਦੀ ਹੈ",
"It always covers only mountains":"ਇਹ ਹਮੇਸ਼ਾਂ ਕੇਵਲ ਪਹਾੜੀ ਖੇਤਰਾਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਦੀ ਹੈ"},"ਟੀਚਾ-ਸਮੂਹ ਯੋਜਨਾਬੰਦੀ ਦਾ ਆਧਾਰ ਆਬਾਦੀ ਦਾ ਸਮੂਹ ਹੁੰਦਾ ਹੈ, ਜਦਕਿ ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਦਾ ਆਧਾਰ ਭੂਗੋਲਿਕ ਖੇਤਰ ਹੁੰਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q014":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਟੀਚਾ-ਸਮੂਹ ਯੋਜਨਾਬੰਦੀ ਲਾਭਪਾਤਰੀ ਵਰਗਾਂ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੁੰਦੀ ਹੈ। II. ਅਜਿਹੇ ਸਮੂਹ ਕਈ ਖੇਤਰਾਂ ਵਿੱਚ ਫੈਲੇ ਹੋ ਸਕਦੇ ਹਨ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਸਮਾਜਿਕ ਜਾਂ ਆਰਥਿਕ ਸਮੂਹ ਕਈ ਭੂਗੋਲਿਕ ਖੇਤਰਾਂ ਵਿੱਚ ਫੈਲਿਆ ਹੋ ਸਕਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q015":r("ਕਈ ਜ਼ਿਲ੍ਹਿਆਂ ਵਿੱਚ ਬੇਜ਼ਮੀਨ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਖਾਸ ਸਹਾਇਤਾ ਦੇਣ ਵਾਲਾ ਪ੍ਰੋਗਰਾਮ ਕਿਹੜੇ ਦ੍ਰਿਸ਼ਟੀਕੋਣ ਦੀ ਉਦਾਹਰਨ ਹੈ?",{
"Target-group planning":"ਟੀਚਾ-ਸਮੂਹ ਯੋਜਨਾਬੰਦੀ",
"Target-area planning":"ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ",
"Regional zoning only":"ਕੇਵਲ ਖੇਤਰੀ ਖੇਤਰ-ਵੰਡ",
"No planning":"ਕੋਈ ਯੋਜਨਾਬੰਦੀ ਨਹੀਂ"},"ਇੱਥੇ ਪ੍ਰੋਗਰਾਮ ਦਾ ਆਧਾਰ ਲਾਭਪਾਤਰੀ ਸਮੂਹ ਹੈ, ਕੋਈ ਇੱਕ ਭੂਗੋਲਿਕ ਖੇਤਰ ਨਹੀਂ।"),

"GEO-PLN-001-CP001-Q016":r("ਪਹਾੜੀ ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਕਿਹੜੀ ਮੁੱਖ ਸਮੱਸਿਆ ਨੂੰ ਸੰਬੋਧਿਤ ਕਰਦੀ ਹੈ?",{
"Development constraints caused by difficult terrain and fragile environments":"ਦੁਸ਼ਵਾਰ ਭੂਮੀ ਅਤੇ ਸੰਵੇਦਨਸ਼ੀਲ ਵਾਤਾਵਰਣ ਕਾਰਨ ਪੈਦਾ ਹੋਣ ਵਾਲੀਆਂ ਵਿਕਾਸ ਰੁਕਾਵਟਾਂ",
"Only coastal flooding":"ਕੇਵਲ ਤਟੀ ਹੜ੍ਹ",
"Only urban traffic":"ਕੇਵਲ ਸ਼ਹਿਰੀ ਆਵਾਜਾਈ",
"Only desert salinity":"ਕੇਵਲ ਮਾਰੂਥਲੀ ਲੂਣਾਪਣ"},"ਪਹਾੜੀ ਖੇਤਰਾਂ ਵਿੱਚ ਪਹੁੰਚ, ਢਲਾਣ ਅਤੇ ਵਾਤਾਵਰਣੀ ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਵਿਕਾਸ ਨੂੰ ਔਖਾ ਬਣਾਉਂਦੀਆਂ ਹਨ।"),
"GEO-PLN-001-CP001-Q017":r("ਟਿਕਾਊ ਪਹਾੜੀ ਵਿਕਾਸ ਵਿੱਚ ਕਿਹੜੀ ਗਤੀਵਿਧੀ ਮਹੱਤਵਪੂਰਨ ਹੈ?",{
"Horticulture, forestry and soil conservation suited to slopes":"ਢਲਾਣਾਂ ਦੇ ਅਨੁਕੂਲ ਬਾਗਬਾਨੀ, ਜੰਗਲਾਤ ਅਤੇ ਮਿੱਟੀ ਦੀ ਸੰਭਾਲ",
"Uncontrolled deforestation":"ਬੇਕਾਬੂ ਜੰਗਲ ਕਟਾਈ",
"Large-scale slope clearing":"ਵੱਡੇ ਪੱਧਰ ਉੱਤੇ ਢਲਾਣਾਂ ਦੀ ਸਫ਼ਾਈ",
"Ignoring erosion":"ਮਿੱਟੀ ਕਟਾਅ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨਾ"},"ਪਹਾੜੀ ਵਿਕਾਸ ਨੂੰ ਸਥਾਨਕ ਕੁਦਰਤੀ ਹਾਲਾਤਾਂ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਸਮਰੱਥਾ ਦੇ ਅਨੁਕੂਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q018":r("ਪਹਾੜੀ ਖੇਤਰਾਂ ਵਿੱਚ ਆਵਾਜਾਈ ਸੁਧਾਰਨਾ ਮਹੱਤਵਪੂਰਨ ਕਿਉਂ ਹੈ?",{
"Difficult terrain can isolate settlements and markets":"ਦੁਸ਼ਵਾਰ ਭੂਮੀ ਬਸਤੀਆਂ ਅਤੇ ਬਾਜ਼ਾਰਾਂ ਨੂੰ ਇਕੱਲਾ ਕਰ ਸਕਦੀ ਹੈ",
"Hill areas have no settlements":"ਪਹਾੜੀ ਖੇਤਰਾਂ ਵਿੱਚ ਬਸਤੀਆਂ ਨਹੀਂ ਹੁੰਦੀਆਂ",
"Transport worsens every livelihood":"ਆਵਾਜਾਈ ਹਰ ਰੋਜ਼ੀ-ਰੋਟੀ ਨੂੰ ਖ਼ਰਾਬ ਕਰਦੀ ਹੈ",
"Roads are unrelated to development":"ਸੜਕਾਂ ਦਾ ਵਿਕਾਸ ਨਾਲ ਕੋਈ ਸੰਬੰਧ ਨਹੀਂ"},"ਚੰਗਾ ਸੰਪਰਕ ਸੇਵਾਵਾਂ, ਬਾਜ਼ਾਰਾਂ ਅਤੇ ਰੁਜ਼ਗਾਰ ਤੱਕ ਪਹੁੰਚ ਆਸਾਨ ਕਰਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q019":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਪਹਾੜੀ ਵਿਕਾਸ ਵਿੱਚ ਵਾਤਾਵਰਣੀ ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਦਾ ਧਿਆਨ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ। II. ਢਲਾਣ ਦੇ ਅਨੁਕੂਲ ਜ਼ਮੀਨ ਵਰਤੋਂ ਮਹੱਤਵਪੂਰਨ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਪਹਾੜੀ ਵਿਕਾਸ ਵਿੱਚ ਰੋਜ਼ੀ-ਰੋਟੀ ਅਤੇ ਵਾਤਾਵਰਣੀ ਸਥਿਰਤਾ ਵਿਚਕਾਰ ਸੰਤੁਲਨ ਜ਼ਰੂਰੀ ਹੈ।"),
"GEO-PLN-001-CP001-Q020":r("ਇੱਕ ਪਹਾੜੀ ਪ੍ਰੋਗਰਾਮ ਬਾਗਬਾਨੀ, ਪੌੜੀਦਾਰ ਖੇਤੀ ਅਤੇ ਚੰਗੀਆਂ ਸੰਪਰਕ ਸੜਕਾਂ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਦਾ ਹੈ। ਇਹ ਕਿਹੜੀ ਯੋਜਨਾਬੰਦੀ ਹੈ?",{
"Hill-area development":"ਪਹਾੜੀ ਖੇਤਰ ਵਿਕਾਸ",
"Coastal-zone planning":"ਤਟੀ ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ",
"Desert irrigation only":"ਕੇਵਲ ਮਾਰੂਥਲੀ ਸਿੰਚਾਈ",
"Port planning":"ਬੰਦਰਗਾਹ ਯੋਜਨਾਬੰਦੀ"},"ਇਹ ਕਦਮ ਪਹਾੜੀ ਖੇਤਰ ਦੀਆਂ ਖਾਸ ਹਾਲਤਾਂ ਦੇ ਅਨੁਕੂਲ ਹਨ।"),

"GEO-PLN-001-CP001-Q021":r("ਸੁੱਕਾ-ਪ੍ਰਵਣ ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਦਾ ਮੁੱਖ ਮਕਸਦ ਕੀ ਹੈ?",{
"Reduce vulnerability to chronic water scarcity":"ਲੰਮੇ ਸਮੇਂ ਦੀ ਪਾਣੀ ਘਾਟ ਪ੍ਰਤੀ ਸੰਵੇਦਨਸ਼ੀਲਤਾ ਘਟਾਉਣਾ",
"Increase water wastage":"ਪਾਣੀ ਦੀ ਬਰਬਾਦੀ ਵਧਾਉਣਾ",
"Promote floodplain settlement":"ਹੜ੍ਹ ਮੈਦਾਨਾਂ ਵਿੱਚ ਬਸਤੀ ਵਧਾਉਣਾ",
"Ignore rainfall variability":"ਵਰਖਾ ਦੀ ਅਨਿਸ਼ਚਿਤਤਾ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨਾ"},"ਅਜਿਹੇ ਪ੍ਰੋਗਰਾਮ ਵਾਰ-ਵਾਰ ਸੁੱਕਾ ਪੈਣ ਵਾਲੇ ਖੇਤਰਾਂ ਵਿੱਚ ਰੋਜ਼ੀ-ਰੋਟੀ ਅਤੇ ਪਾਣੀ ਸੁਰੱਖਿਆ ਨੂੰ ਸਥਿਰ ਕਰਨ ਦਾ ਯਤਨ ਕਰਦੇ ਹਨ।"),
"GEO-PLN-001-CP001-Q022":r("ਸੁੱਕਾ-ਪ੍ਰਵਣ ਖੇਤਰ ਵਿੱਚ ਕਿਹੜਾ ਉਪਾਅ ਢੁੱਕਵਾਂ ਹੈ?",{
"Watershed development and water conservation":"ਵਾਟਰਸ਼ੈੱਡ ਵਿਕਾਸ ਅਤੇ ਪਾਣੀ ਦੀ ਸੰਭਾਲ",
"Uncontrolled groundwater extraction":"ਬੇਕਾਬੂ ਭੂਜਲ ਕੱਢਣਾ",
"Removal of tanks":"ਟਾਲਾਬ ਹਟਾਉਣਾ",
"High-water crops everywhere":"ਹਰ ਥਾਂ ਵੱਧ ਪਾਣੀ ਵਾਲੀਆਂ ਫਸਲਾਂ ਉਗਾਉਣਾ"},"ਪਾਣੀ ਦੀ ਸੰਭਾਲ ਸਥਾਨਕ ਪਾਣੀ ਸੁਰੱਖਿਆ ਅਤੇ ਸੁੱਕੇ ਨਾਲ ਨਿਪਟਣ ਦੀ ਸਮਰੱਥਾ ਵਧਾਉਂਦੀ ਹੈ।"),
"GEO-PLN-001-CP001-Q023":r("ਸੁੱਕਾ-ਪ੍ਰਵਣ ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਲਈ ਕਿਹੜੀ ਰੋਜ਼ੀ-ਰੋਟੀ ਰਣਨੀਤੀ ਢੁੱਕਵੀਂ ਹੈ?",{
"Activities adapted to limited water availability":"ਸੀਮਿਤ ਪਾਣੀ ਉਪਲਬਧਤਾ ਦੇ ਅਨੁਕੂਲ ਗਤੀਵਿਧੀਆਂ",
"Only water-intensive farming":"ਕੇਵਲ ਵੱਧ ਪਾਣੀ ਵਾਲੀ ਖੇਤੀ",
"No livelihood diversification":"ਰੋਜ਼ੀ-ਰੋਟੀ ਵਿੱਚ ਕੋਈ ਵੱਖਰਾਪਣ ਨਹੀਂ",
"Permanent fallow everywhere":"ਹਰ ਥਾਂ ਸਥਾਈ ਪਰਤੀ ਜ਼ਮੀਨ"},"ਅਜਿਹੇ ਖੇਤਰਾਂ ਵਿੱਚ ਰੋਜ਼ੀ-ਰੋਟੀ ਨੂੰ ਸੀਮਿਤ ਪਾਣੀ ਉਪਲਬਧਤਾ ਦੇ ਅਨੁਕੂਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q024":r("ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: I. ਸੁੱਕਾ-ਪ੍ਰਵਣ ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਟੀਚਾ-ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ ਹੈ। II. ਇਸ ਵਿੱਚ ਪਾਣੀ ਦੀ ਸੰਭਾਲ ਕੇਂਦਰੀ ਮਹੱਤਤਾ ਰੱਖਦੀ ਹੈ। ਸਹੀ ਵਿਕਲਪ ਕਿਹੜਾ ਹੈ?",{
"Both I and II are correct":"I ਅਤੇ II ਦੋਵੇਂ ਸਹੀ ਹਨ",
"Only I is correct":"ਕੇਵਲ I ਸਹੀ ਹੈ",
"Only II is correct":"ਕੇਵਲ II ਸਹੀ ਹੈ",
"Neither I nor II is correct":"ਨਾ I ਅਤੇ ਨਾ ਹੀ II ਸਹੀ ਹੈ"},"ਇਹ ਪ੍ਰੋਗਰਾਮ ਇੱਕ ਨਿਰਧਾਰਤ ਸਮੱਸਿਆ-ਪ੍ਰਭਾਵਿਤ ਖੇਤਰ ਨੂੰ ਟੀਚਾ ਬਣਾਉਂਦਾ ਹੈ ਅਤੇ ਉਸਦੀ ਮੁੱਖ ਪਾਣੀ ਸਮੱਸਿਆ ਨੂੰ ਸੰਬੋਧਿਤ ਕਰਦਾ ਹੈ।"),
"GEO-PLN-001-CP001-Q025":r("ਇੱਕ ਅਰਧ-ਸੁੱਕੇ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਵਾਰ-ਵਾਰ ਸੁੱਕਾ ਪੈਣ ਕਾਰਨ ਵਾਟਰਸ਼ੈੱਡ ਸੁਧਾਰ ਅਤੇ ਰੋਜ਼ੀ-ਰੋਟੀ ਵਿੱਚ ਵੱਖਰਾਪਣ ਲਿਆਂਦਾ ਜਾਂਦਾ ਹੈ। ਇਹ ਕਿਹੜੇ ਦ੍ਰਿਸ਼ਟੀਕੋਣ ਦੀ ਉਦਾਹਰਨ ਹੈ?",{
"Drought-prone area planning":"ਸੁੱਕਾ-ਪ੍ਰਵਣ ਖੇਤਰ ਯੋਜਨਾਬੰਦੀ",
"Port-led development":"ਬੰਦਰਗਾਹ-ਆਧਾਰਿਤ ਵਿਕਾਸ",
"Urban renewal only":"ਕੇਵਲ ਸ਼ਹਿਰੀ ਨਵੀਨੀਕਰਨ",
"No regional planning":"ਕੋਈ ਖੇਤਰੀ ਯੋਜਨਾਬੰਦੀ ਨਹੀਂ"},"ਇਹ ਪ੍ਰੋਗਰਾਮ ਖੇਤਰ ਦੀ ਵਾਰ-ਵਾਰ ਆਉਣ ਵਾਲੀ ਸੁੱਕਾ ਸਮੱਸਿਆ ਦੇ ਅਨੁਸਾਰ ਬਣਾਇਆ ਗਿਆ ਹੈ।")
});

export function localizeGeoPln001ExactCp001(question:CanonicalQuestion,language:Lang){
 const rec=(language==="hi"?HI:PA)[question.questionId];if(!rec)return null;
 const options=question.options.map(source=>{const t=rec.optionBySource[source];if(!t)throw new Error(`Missing GEO-PLN-001 CP001 ${language} option translation for ${question.questionId}: ${source}`);return t;});
 return Object.freeze({stem:rec.stem,options:Object.freeze(options),canonicalAnswer:options[question.correctIndex]!,explanation:rec.explanation});
}
