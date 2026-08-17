export type MensurationLocalizedLanguage = "hi" | "pa";
export type MensurationLocalizedLocale = "hi-IN" | "pa-IN";
export type MensurationStudioLanguage = "en" | MensurationLocalizedLanguage;

export const MENSURATION_LOCALIZATION_AUTHORITY =
  "MENSURATION-HI-PA-NATIVE-LOCALIZATION-V2" as const;
export const MENSURATION_LOCALIZED_LANGUAGES = ["en", "hi", "pa"] as const;

export function localeForLanguage(language: MensurationStudioLanguage): "en-IN" | MensurationLocalizedLocale {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

type PhrasePair = readonly [string, string];
type TokenMap = Readonly<Record<string, string>>;

/*
 * V2 deliberately avoids sequential word replacement. Multi-word phrases are
 * replaced in one non-overlapping pass over the original protected text, then
 * remaining ASCII words are translated by exact-token lookup. This prevents
 * short tokens such as "a" from corrupting words such as "ready".
 */
const HI_PHRASES: readonly PhrasePair[] = [
  ["### 📌 Key Rule & Formula", "### 📌 मुख्य नियम और सूत्र"],
  ["### 📝 Step-by-Step Solution", "### 📝 चरण-दर-चरण हल"],
  ["### 💡 Exam Speed Shortcut", "### 💡 परीक्षा शॉर्टकट"],
  ["### ⚠️ Common Traps", "### ⚠️ सामान्य गलतियाँ"],
  ["⚡ Exam speed:", "⚡ परीक्षा शॉर्टकट:"],
  ["Common mistake:", "सामान्य गलती:"],
  ["Unit check:", "इकाई जाँच:"],
  ["Quick calculation route:", "त्वरित तरीका:"],
  ["Read the given values", "दिए गए मान पढ़ें"],
  ["Choose the formula", "उचित सूत्र चुनें"],
  ["Substitute and calculate", "मान रखकर गणना करें"],
  ["Check the result", "उत्तर की जाँच करें"],
  ["Check the requested quantity", "माँगी गई राशि की जाँच करें"],
  ["Find the exact cubic-centimetre volume", "घन सेंटीमीटर में ठीक आयतन निकालें"],
  ["Convert to litres", "लीटर में बदलें"],
  ["Identify the edge length", "किनारे की लंबाई पहचानें"],
  ["Multiply three equal dimensions", "तीनों बराबर आयामों को गुणा करें"],
  ["Calculate the area", "क्षेत्रफल निकालें"],
  ["Calculate the circumference", "परिधि निकालें"],
  ["Find the length", "लंबाई ज्ञात करें"],
  ["Find the width", "चौड़ाई ज्ञात करें"],
  ["Find the breadth", "चौड़ाई ज्ञात करें"],
  ["Find the height", "ऊँचाई ज्ञात करें"],
  ["Find the radius", "त्रिज्या ज्ञात करें"],
  ["Find the diameter", "व्यास ज्ञात करें"],
  ["Find the diagonal", "विकर्ण ज्ञात करें"],
  ["Find the slant height", "तिर्यक ऊँचाई ज्ञात करें"],
  ["Find the perpendicular height", "लम्बवत ऊँचाई ज्ञात करें"],
  ["Find the path area", "पथ का क्षेत्रफल ज्ञात करें"],
  ["Area of the outer figure", "बाहरी आकृति का क्षेत्रफल"],
  ["Area of the inner figure", "भीतरी आकृति का क्षेत्रफल"],
  ["Area of the rectangle", "आयत का क्षेत्रफल"],
  ["Area of the semicircle", "अर्धवृत्त का क्षेत्रफल"],
  ["Add the two areas", "दोनों क्षेत्रफल जोड़ें"],
  ["Find the semicircle's radius", "अर्धवृत्त की त्रिज्या ज्ञात करें"],
  ["Calculate outer area − inner area directly", "सीधे बाहरी क्षेत्रफल − भीतरी क्षेत्रफल निकालें"],
  ["Find the complete outer area first", "पहले पूरा बाहरी क्षेत्रफल निकालें"],
  ["Find the complete geometric measure first", "पहले पूरी ज्यामितीय माप निकालें"],
  ["Find the geometric area or boundary first", "पहले ज्यामितीय क्षेत्रफल या सीमा निकालें"],
  ["Find the full circle's area", "पहले पूरे वृत्त का क्षेत्रफल निकालें"],
  ["Start with the full-circle formula", "पहले पूरे वृत्त का सूत्र लगाएँ"],
  ["Standard circle benchmark:", "मानक वृत्त संदर्भ:"],
  ["Treat pi times radius squared as one circular-base block", "पाई गुणा त्रिज्या के वर्ग को वृत्ताकार आधार का एक ही भाग मानें"],
  ["Treat π times radius squared as one circular-base block", "पाई गुणा त्रिज्या के वर्ग को वृत्ताकार आधार का एक ही भाग मानें"],
  ["multiply by height only when the question asks for volume", "ऊँचाई से तभी गुणा करें जब प्रश्न में आयतन पूछा गया हो"],
  ["For radius", "त्रिज्या"],
  ["keep circumference", "परिधि"],
  ["and base area", "और आधार क्षेत्रफल"],
  ["ready; use only the quantity asked for", "याद रखें; केवल प्रश्न में माँगी गई राशि का प्रयोग करें"],
  ["Cancel factors before multiplying, then divide the final cubic-centimetre value by", "गुणा करने से पहले समान गुणक काटें, फिर अंतिम घन-सेंटीमीटर मान को"],
  ["Cancel the factor of", "गुणक"],
  ["before multiplying, and apply the rate only after selecting the correct surface", "को गुणा करने से पहले काटें और सही सतह चुनने के बाद ही दर लगाएँ"],
  ["Curved area equals circumference × height", "वक्र पृष्ठ क्षेत्रफल = परिधि × ऊँचाई"],
  ["Read the coefficient of", "का गुणांक लें"],
  ["divide by height, then square-root it", "उसे ऊँचाई से भाग दें और फिर वर्गमूल लें"],
  ["coefficient divided by", "गुणांक को भाग देने पर"],
  ["Height equals the", "ऊँचाई ="],
  ["Radius equals the", "त्रिज्या ="],
  ["Factor", "गुणनखंड करें"],
  ["and test positive factors of the TSA coefficient", "और TSA के गुणांक के धनात्मक गुणनखंड जाँचें"],
  ["When both areas are written as multiples of", "जब दोनों क्षेत्रफल"],
  ["work only with their coefficients", "के गुणज के रूप में हों, तो केवल उनके गुणांकों पर काम करें"],
  ["Subtract the area coefficients, halve, and square-root to get", "क्षेत्रफल के गुणांकों का अंतर लें, आधा करें और वर्गमूल लेकर"],
  ["then use", "फिर प्रयोग करें"],
  ["For both cylinders and cones", "बेलन और शंकु दोनों के लिए"],
  ["calculate", "गणना करें"],
  ["Then compare the result with", "फिर परिणाम की तुलना"],
  ["Form the ratio and cancel pi", "अनुपात बनाकर पाई का समान गुणक काटें"],
  ["Only radius and slant-height factors remain", "केवल त्रिज्या और तिर्यक ऊँचाई के गुणक बचते हैं"],
  ["this ratio or algebraic factor is unit-free because like dimensions cancel", "यह अनुपात या बीजीय गुणक इकाई-रहित है क्योंकि समान आयाम कट जाते हैं"],
  ["After multiplying, the new volume is", "गुणा करने पर नया आयतन मूल आयतन का"],
  ["times the original volume", "गुना होता है"],
  ["The exact", "ठीक"],
  ["factor appears on both sides", "गुणक दोनों पक्षों में है"],
  ["two length factors produce", "दो लंबाई गुणक मिलकर"],
  ["Convert units before multiplying, not after", "गुणा करने से पहले इकाइयाँ एक जैसी करें, बाद में नहीं"],
  ["Convert every linear measurement to one unit before using the formula", "सूत्र लगाने से पहले सभी रैखिक माप एक ही इकाई में बदलें"],
  ["Convert all lengths to one unit before using the formula", "सूत्र लगाने से पहले सभी लंबाइयाँ एक ही इकाई में करें"],
  ["keeping corresponding dimensions in the same order", "संबंधित आयामों का क्रम वही रखते हुए"],
  ["substituting it back into the same relation reproduces the stated measure or ratio", "इसे उसी संबंध में वापस रखने पर दिया गया माप या अनुपात फिर प्राप्त होता है"],
  ["the underlying source state independently satisfies the material-volume identity", "मूल गणितीय अवस्था पदार्थ-आयतन संबंध को स्वतंत्र रूप से संतुष्ट करती है"],
  ["Do not confuse vertical height with slant height", "लम्बवत ऊँचाई और तिर्यक ऊँचाई को न मिलाएँ"],
  ["Do not interchange vertical height and face slant height", "लम्बवत ऊँचाई और पृष्ठ की तिर्यक ऊँचाई को आपस में न बदलें"],
  ["Do not omit the one-third factor or the mixed frustum term", "एक-तिहाई गुणक या फ्रस्टम का मिश्रित पद न छोड़ें"],
  ["Do not omit the factor 1/3 or the frustum cross-term", "1/3 गुणक या फ्रस्टम का मिश्रित पद न छोड़ें"],
  ["Do not add surfaces that are not part of the requested measure", "जो सतहें माँगी गई माप का भाग नहीं हैं, उन्हें न जोड़ें"],
  ["Include only the surfaces or dimensions requested by the question", "केवल वही सतहें या आयाम शामिल करें जो प्रश्न में माँगे गए हैं"],
  ["For similar solids: lengths scale as k, areas as k² and volumes as k³", "समरूप ठोसों में लंबाइयाँ k, क्षेत्रफल k² और आयतन k³ के अनुसार बदलते हैं"],
  ["For a pyramid, remember volume is one-third of the matching prism; face area uses slant height, not vertical height", "पिरामिड का आयतन समान आधार-ऊँचाई वाले प्रिज्म का एक-तिहाई होता है; पृष्ठ क्षेत्रफल में तिर्यक ऊँचाई लगती है, लम्बवत ऊँचाई नहीं"],
  ["For a frustum, mark the larger and smaller corresponding dimensions first", "फ्रस्टम में पहले संबंधित बड़े और छोटे आयाम चिन्हित करें"],
  ["the sum usually appears in surface area and the cross-term appears in volume", "योग प्रायः पृष्ठ क्षेत्रफल में और मिश्रित पद आयतन में आता है"],
  ["Write total usable material volume first, then divide by the volume of one target unit", "पहले कुल उपयोगी पदार्थ का आयतन लिखें, फिर उसे एक लक्ष्य वस्तु के आयतन से भाग दें"],
  ["Use radius, not diameter, in both volume formulae", "दोनों आयतन सूत्रों में त्रिज्या का प्रयोग करें, व्यास का नहीं"],
  ["The sphere volume contains 4/3", "गोले के आयतन के सूत्र में 4/3 गुणक होता है"],
  ["Use the actual component volumes; a common joining face does not change volume", "वास्तविक घटकों के आयतन जोड़ें; साझा जोड़ने वाला पृष्ठ आयतन को नहीं बदलता"],
  ["A hemispherical cap contributes half a sphere, while two hemispheres make one sphere", "एक अर्धगोलीय सिरा आधे गोले के बराबर होता है, जबकि दो अर्धगोले मिलकर एक पूरा गोला बनाते हैं"],
  ["Decompose the solid, factor common constants such as pi, then add only non-overlapping component volumes", "ठोस को सरल भागों में बाँटें, पाई जैसे समान गुणक बाहर लें और केवल बिना ओवरलैप वाले घटकों के आयतन जोड़ें"],
  ["The two hemispherical ends make one complete sphere", "दो अर्धगोलीय सिरे मिलकर एक पूरा गोला बनाते हैं"],
  ["Multiplying one small sphere's volume by this count reconstructs the cylinder volume", "एक छोटे गोले के आयतन को इस संख्या से गुणा करने पर मूल बेलन का आयतन वापस मिलता है"],
  ["Multiply the side three times", "भुजा को तीन बार गुणा करें"],
  ["Do not multiply by the number of faces, because volume measures space rather than surface area", "फलकों की संख्या से गुणा न करें, क्योंकि आयतन स्थान को मापता है, पृष्ठ क्षेत्रफल को नहीं"],
  ["The cube has one repeated dimension", "घन में एक ही आयाम तीन बार आता है"],
  ["Use length × breadth × height; all three are equal for a cube", "लंबाई × चौड़ाई × ऊँचाई लगाएँ; घन में तीनों बराबर होते हैं"],
  ["Therefore, the required answer is", "अतः आवश्यक उत्तर है"],
  ["Therefore, the required area is", "अतः आवश्यक क्षेत्रफल है"],
  ["Therefore, the radius is", "अतः त्रिज्या है"],
  ["Therefore, the height is", "अतः ऊँचाई है"],
  ["Therefore, the volume is", "अतः आयतन है"],
  ["Therefore, path area =", "अतः पथ का क्षेत्रफल ="],
  ["Therefore, the new area is", "अतः नया क्षेत्रफल है"],
  ["The required difference =", "आवश्यक अंतर ="],
  ["The required answer is", "आवश्यक उत्तर है"],
  ["What is its area?", "उसका क्षेत्रफल क्या है?"],
  ["What is its volume?", "उसका आयतन क्या है?"],
  ["What is its surface area?", "उसका पृष्ठ क्षेत्रफल क्या है?"],
  ["What is the area of the complete plate?", "पूरी प्लेट का क्षेत्रफल क्या है?"],
  ["Find its area", "उसका क्षेत्रफल ज्ञात कीजिए"],
  ["Determine its area", "उसका क्षेत्रफल ज्ञात कीजिए"],
  ["Calculate its area", "उसका क्षेत्रफल निकालिए"],
  ["Find its perimeter", "उसका परिमाप ज्ञात कीजिए"],
  ["Find its circumference", "उसकी परिधि ज्ञात कीजिए"],
  ["Find its volume", "उसका आयतन ज्ञात कीजिए"],
  ["Calculate its volume", "उसका आयतन निकालिए"],
  ["Find its total surface area", "उसका कुल पृष्ठ क्षेत्रफल ज्ञात कीजिए"],
  ["Find its curved surface area", "उसका वक्र पृष्ठ क्षेत्रफल ज्ञात कीजिए"],
  ["Find its capacity in litres", "उसकी धारिता लीटर में ज्ञात कीजिए"],
  ["determine its capacity in litres", "उसकी धारिता लीटर में ज्ञात कीजिए"],
  ["Find the total area", "कुल क्षेत्रफल ज्ञात कीजिए"],
  ["Find the combined area", "संयुक्त क्षेत्रफल ज्ञात कीजिए"],
  ["Find the enclosed area", "घिरा हुआ क्षेत्रफल ज्ञात कीजिए"],
  ["Find the area of the path", "पथ का क्षेत्रफल ज्ञात कीजिए"],
  ["Find the area of the border", "किनारी का क्षेत्रफल ज्ञात कीजिए"],
  ["Find the area covered by the path", "पथ द्वारा ढका क्षेत्रफल ज्ञात कीजिए"],
  ["Find the total cost", "कुल लागत ज्ञात कीजिए"],
  ["Find the total flooring cost", "फर्श की कुल लागत ज्ञात कीजिए"],
  ["Find the total tile cost", "टाइलों की कुल लागत ज्ञात कीजिए"],
  ["Find the fencing cost", "बाड़ लगाने की लागत ज्ञात कीजिए"],
  ["How many tiles are required?", "कितनी टाइलें चाहिए?"],
  ["How many spheres can be made?", "कितने गोले बनाए जा सकते हैं?"],
  ["How many small cubes are obtained", "कितने छोटे घन प्राप्त होंगे"],
  ["How many small cubes are formed?", "कितने छोटे घन बनेंगे?"],
  ["How many complete revolutions does it make?", "यह कितने पूरे चक्कर लगाएगा?"],
  ["Find the number of tiles required", "आवश्यक टाइलों की संख्या ज्ञात कीजिए"],
  ["Find the width of the path", "पथ की चौड़ाई ज्ञात कीजिए"],
  ["Find the path width", "पथ की चौड़ाई ज्ञात कीजिए"],
  ["Find the gate width", "फाटक की चौड़ाई ज्ञात कीजिए"],
  ["Find the uncovered area", "बिना ढका क्षेत्रफल ज्ञात कीजिए"],
  ["Find the other side", "दूसरी भुजा ज्ञात कीजिए"],
  ["Find the other diagonal", "दूसरा विकर्ण ज्ञात कीजिए"],
  ["Find the other parallel side", "दूसरी समांतर भुजा ज्ञात कीजिए"],
  ["Find its vertical height", "उसकी लम्बवत ऊँचाई ज्ञात कीजिए"],
  ["Find the height of the cylinder", "बेलन की ऊँचाई ज्ञात कीजिए"],
  ["Find the cylinder height", "बेलन की ऊँचाई ज्ञात कीजिए"],
  ["Find the central angle", "केंद्रीय कोण ज्ञात कीजिए"],
  ["Find the corresponding arc length", "संबंधित चाप की लंबाई ज्ञात कीजिए"],
  ["Find the arc length", "चाप की लंबाई ज्ञात कीजिए"],
  ["Find the distance travelled", "तय की गई दूरी ज्ञात कीजिए"],
  ["Find the flooring rate per square metre", "प्रति वर्ग मीटर फर्श की दर ज्ञात कीजिए"],
  ["Express this length in metres", "इस लंबाई को मीटर में व्यक्त कीजिए"],
  ["Convert its length into centimetres", "इस लंबाई को सेंटीमीटर में बदलिए"],
  ["Use pi = 22/7", "पाई = 22/7 लें"],
  ["Use pi = 3.14", "पाई = 3.14 लें"],
  ["Leave the answer in terms of", "उत्तर को इसी रूप में रखें:"],
  ["Leave pi in exact form", "पाई को ठीक रूप में ही रखें"],
  ["correct to one decimal place", "एक दशमलव स्थान तक सही"],
  ["If there is no wastage", "यदि कोई पदार्थ नष्ट नहीं होता"],
  ["if no metal is lost", "यदि कोई धातु नष्ट नहीं होती"],
  ["is melted and recast into", "को पिघलाकर फिर ढालकर"],
  ["is melted to form", "को पिघलाकर"],
  ["are melted to form", "को पिघलाकर"],
  ["is recast into", "को फिर ढालकर"],
  ["without slipping", "बिना फिसले"],
  ["at each end", "प्रत्येक सिरे पर"],
  ["of the same radius", "उसी त्रिज्या का"],
  ["The total height of the toy is", "खिलौने की कुल ऊँचाई"],
  ["A solid toy consists of", "एक ठोस खिलौना बना है"],
  ["A decorative metal toy consists of", "एक सजावटी धातु का खिलौना बना है"],
  ["A decorative solid is formed by mounting", "एक सजावटी ठोस बनाया गया है जिसमें"],
  ["A capsule consists of", "एक कैप्सूल-आकार का ठोस बना है"],
  ["A right circular cone", "एक समवृत्त शंकु"],
  ["A right square pyramid", "एक समकोण वर्गाकार पिरामिड"],
  ["A right pyramid", "एक समकोण पिरामिड"],
  ["A solid cylinder", "एक ठोस बेलन"],
  ["A closed cylinder", "एक बंद बेलन"],
  ["A cylindrical vessel", "एक बेलनाकार पात्र"],
  ["A cylindrical tank", "एक बेलनाकार टंकी"],
  ["A cylindrical container", "एक बेलनाकार पात्र"],
  ["A solid sphere", "एक ठोस गोला"],
  ["A solid metallic sphere", "एक ठोस धातु का गोला"],
  ["A solid metal cube", "एक ठोस धातु का घन"],
  ["A metal cube", "एक धातु का घन"],
  ["A solid wooden cube", "एक ठोस लकड़ी का घन"],
  ["A closed cube-shaped storage block", "एक बंद घनाकार भंडारण ब्लॉक"],
  ["A cube-shaped storage block", "घनाकार भंडारण ब्लॉक"],
  ["A rectangular plot", "एक आयताकार भूखंड"],
  ["A rectangular park", "एक आयताकार पार्क"],
  ["A rectangular lawn", "एक आयताकार लॉन"],
  ["A rectangular garden", "एक आयताकार बगीचा"],
  ["A rectangular floor", "एक आयताकार फर्श"],
  ["A rectangular room", "एक आयताकार कमरा"],
  ["A rectangular courtyard", "एक आयताकार आँगन"],
  ["A rectangular enclosure", "एक आयताकार घेरा"],
  ["A rectangular wall", "एक आयताकार दीवार"],
  ["A rectangular metal sheet", "एक आयताकार धातु की चादर"],
  ["A rectangular photograph", "एक आयताकार फोटो"],
  ["A square lawn", "एक वर्गाकार लॉन"],
  ["A square courtyard", "एक वर्गाकार आँगन"],
  ["A square park", "एक वर्गाकार पार्क"],
  ["A triangular field", "एक त्रिभुजाकार खेत"],
  ["A triangular park", "एक त्रिभुजाकार पार्क"],
  ["A triangular plot", "एक त्रिभुजाकार भूखंड"],
  ["A triangular metal plate", "एक त्रिभुजाकार धातु की प्लेट"],
  ["A triangular glass pane", "एक त्रिभुजाकार काँच की पट्टी"],
  ["A triangular frame", "एक त्रिभुजाकार फ्रेम"],
  ["A triangular enclosure", "एक त्रिभुजाकार घेरा"],
  ["A circular track", "एक वृत्ताकार ट्रैक"],
  ["A circular plate", "एक वृत्ताकार प्लेट"],
  ["A circular wheel", "एक वृत्ताकार पहिया"],
  ["A circular garden", "एक वृत्ताकार बगीचा"],
  ["A circular park", "एक वृत्ताकार पार्क"],
  ["A circular lawn", "एक वृत्ताकार लॉन"],
  ["A circular field", "एक वृत्ताकार खेत"],
  ["A circular ring", "एक वृत्ताकार रिंग"],
  ["A circular path", "एक वृत्ताकार पथ"],
  ["A semicircular window", "एक अर्धवृत्ताकार खिड़की"],
  ["A semicircular boundary", "एक अर्धवृत्ताकार सीमा"],
  ["A parallelogram-shaped field", "एक समांतर चतुर्भुजाकार खेत"],
  ["A parallelogram-shaped panel", "एक समांतर चतुर्भुजाकार पैनल"],
  ["A rhombus-shaped field", "एक समचतुर्भुजाकार खेत"],
  ["A trapezium-shaped plot", "एक समलंबाकार भूखंड"],
  ["A trapezium-shaped metal plate", "एक समलंबाकार धातु की प्लेट"],
  ["A kite-shaped decorative panel", "एक पतंगाकार सजावटी पैनल"],
  ["A measuring tape", "एक मापने वाली फीता"],
  ["A pipe section", "पाइप का एक भाग"],
  ["A hollow cylindrical component", "एक खोखला बेलनाकार भाग"],
  ["The cross-section of", "का अनुप्रस्थ काट"],
  ["outer diameter", "बाहरी व्यास"],
  ["inside diameter", "भीतरी व्यास"],
  ["inner diameter", "भीतरी व्यास"],
  ["outside radius", "बाहरी त्रिज्या"],
  ["inside radius", "भीतरी त्रिज्या"],
  ["outer radius", "बाहरी त्रिज्या"],
  ["inner radius", "भीतरी त्रिज्या"],
  ["internal radius", "भीतरी त्रिज्या"],
  ["external radius", "बाहरी त्रिज्या"],
  ["vertical height", "लम्बवत ऊँचाई"],
  ["perpendicular height", "लम्बवत ऊँचाई"],
  ["slant height", "तिर्यक ऊँचाई"],
  ["curved surface area", "वक्र पृष्ठ क्षेत्रफल"],
  ["total surface area", "कुल पृष्ठ क्षेत्रफल"],
  ["lateral surface area", "पार्श्व पृष्ठ क्षेत्रफल"],
  ["surface area", "पृष्ठ क्षेत्रफल"],
  ["base area", "आधार क्षेत्रफल"],
  ["path area", "पथ का क्षेत्रफल"],
  ["outer area", "बाहरी क्षेत्रफल"],
  ["inner area", "भीतरी क्षेत्रफल"],
  ["complete outer area", "पूरा बाहरी क्षेत्रफल"],
  ["material volume", "पदार्थ का आयतन"],
  ["volume of solid material", "ठोस पदार्थ का आयतन"],
  ["volume occupied by the pipe wall", "पाइप की दीवार द्वारा घेरा आयतन"],
  ["volume of metal left", "बची धातु का आयतन"],
  ["same radius", "समान त्रिज्या"],
  ["same base", "समान आधार"],
  ["same height", "समान ऊँचाई"],
  ["per square metre", "प्रति वर्ग मीटर"],
  ["per metre", "प्रति मीटर"],
  ["in litres", "लीटर में"],
  ["in metres", "मीटर में"],
  ["into centimetres", "सेंटीमीटर में"],
  ["has a radius of", "की त्रिज्या"],
  ["has radius", "की त्रिज्या"],
  ["has a diameter of", "का व्यास"],
  ["has diameter", "का व्यास"],
  ["has area", "का क्षेत्रफल"],
  ["has volume", "का आयतन"],
  ["has length", "की लंबाई"],
  ["has height", "की ऊँचाई"],
  ["has side", "की भुजा"],
  ["has base", "का आधार"],
  ["and height", "और ऊँचाई"],
  ["and length", "और लंबाई"],
  ["and breadth", "और चौड़ाई"],
  ["and width", "और चौड़ाई"],
  ["and vertical height", "और लम्बवत ऊँचाई"],
  ["and central angle", "और केंद्रीय कोण"],
  ["and one diagonal", "और एक विकर्ण"],
  ["is made outside it", "उसके बाहर बनाया गया है"],
  ["is constructed outside it", "उसके बाहर बनाया गया है"],
  ["is laid outside it", "उसके बाहर बिछाया गया है"],
  ["runs uniformly inside its boundary", "उसकी सीमा के भीतर समान चौड़ाई में बना है"],
  ["along its inside boundary", "उसकी भीतरी सीमा के साथ"],
  ["right-angled triangle", "समकोण त्रिभुज"],
  ["right triangle", "समकोण त्रिभुज"],
  ["central angle", "केंद्रीय कोण"],
  ["full circle", "पूरा वृत्त"],
  ["complete revolutions", "पूरे चक्कर"],
];

const PA_PHRASES: readonly PhrasePair[] = HI_PHRASES.map(([source, hindi]) => [source, hindi] as const);
/* Punjabi overrides are kept explicit so Hindi never leaks into learner text. */
const PA_OVERRIDES: readonly PhrasePair[] = [
  ["### 📌 Key Rule & Formula", "### 📌 ਮੁੱਖ ਨਿਯਮ ਅਤੇ ਫਾਰਮੂਲਾ"],
  ["### 📝 Step-by-Step Solution", "### 📝 ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ"],
  ["### 💡 Exam Speed Shortcut", "### 💡 ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ"],
  ["### ⚠️ Common Traps", "### ⚠️ ਆਮ ਗਲਤੀਆਂ"],
  ["⚡ Exam speed:", "⚡ ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ:"],
  ["Common mistake:", "ਆਮ ਗਲਤੀ:"],
  ["Unit check:", "ਇਕਾਈ ਜਾਂਚ:"],
  ["Quick calculation route:", "ਤੇਜ਼ ਤਰੀਕਾ:"],
  ["Read the given values", "ਦਿੱਤੇ ਮੁੱਲ ਪੜ੍ਹੋ"],
  ["Choose the formula", "ਉਚਿਤ ਫਾਰਮੂਲਾ ਚੁਣੋ"],
  ["Substitute and calculate", "ਮੁੱਲ ਰੱਖ ਕੇ ਗਣਨਾ ਕਰੋ"],
  ["Check the result", "ਉੱਤਰ ਦੀ ਜਾਂਚ ਕਰੋ"],
  ["Check the requested quantity", "ਮੰਗੀ ਮਾਤਰਾ ਦੀ ਜਾਂਚ ਕਰੋ"],
  ["Treat pi times radius squared as one circular-base block", "ਪਾਈ ਗੁਣਾ ਅਰਧ-ਵਿਆਸ ਦੇ ਵਰਗ ਨੂੰ ਗੋਲ ਆਧਾਰ ਦਾ ਇੱਕੋ ਹਿੱਸਾ ਮੰਨੋ"],
  ["Treat π times radius squared as one circular-base block", "ਪਾਈ ਗੁਣਾ ਅਰਧ-ਵਿਆਸ ਦੇ ਵਰਗ ਨੂੰ ਗੋਲ ਆਧਾਰ ਦਾ ਇੱਕੋ ਹਿੱਸਾ ਮੰਨੋ"],
  ["multiply by height only when the question asks for volume", "ਉਚਾਈ ਨਾਲ ਤਦ ਹੀ ਗੁਣਾ ਕਰੋ ਜਦੋਂ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਆਇਤਨ ਪੁੱਛਿਆ ਗਿਆ ਹੋਵੇ"],
  ["For radius", "ਅਰਧ-ਵਿਆਸ"],
  ["keep circumference", "ਪਰਿਧੀ"],
  ["and base area", "ਅਤੇ ਆਧਾਰ ਖੇਤਰਫਲ"],
  ["ready; use only the quantity asked for", "ਯਾਦ ਰੱਖੋ; ਕੇਵਲ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੀ ਮਾਤਰਾ ਵਰਤੋ"],
  ["Cancel factors before multiplying, then divide the final cubic-centimetre value by", "ਗੁਣਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਂਝੇ ਗੁਣਕ ਕੱਟੋ, ਫਿਰ ਆਖਰੀ ਘਣ-ਸੈਂਟੀਮੀਟਰ ਮੁੱਲ ਨੂੰ"],
  ["Curved area equals circumference × height", "ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ = ਪਰਿਧੀ × ਉਚਾਈ"],
  ["Read the coefficient of", "ਦਾ ਗੁਣਾਂਕ ਲਵੋ"],
  ["divide by height, then square-root it", "ਇਸ ਨੂੰ ਉਚਾਈ ਨਾਲ ਭਾਗ ਦਿਓ ਅਤੇ ਫਿਰ ਵਰਗਮੂਲ ਲਵੋ"],
  ["coefficient divided by", "ਗੁਣਾਂਕ ਨੂੰ ਭਾਗ ਦੇਣ ਤੇ"],
  ["Height equals the", "ਉਚਾਈ ="],
  ["Radius equals the", "ਅਰਧ-ਵਿਆਸ ="],
  ["and test positive factors of the TSA coefficient", "ਅਤੇ TSA ਦੇ ਗੁਣਾਂਕ ਦੇ ਧਨਾਤਮਕ ਗੁਣਨਖੰਡ ਜਾਂਚੋ"],
  ["When both areas are written as multiples of", "ਜਦੋਂ ਦੋਵੇਂ ਖੇਤਰਫਲ"],
  ["work only with their coefficients", "ਦੇ ਗੁਣਜ ਵਜੋਂ ਲਿਖੇ ਹੋਣ, ਤਾਂ ਕੇਵਲ ਉਹਨਾਂ ਦੇ ਗੁਣਾਂਕਾਂ ਨਾਲ ਕੰਮ ਕਰੋ"],
  ["Subtract the area coefficients, halve, and square-root to get", "ਖੇਤਰਫਲ ਦੇ ਗੁਣਾਂਕਾਂ ਦਾ ਅੰਤਰ ਲਵੋ, ਅੱਧਾ ਕਰੋ ਅਤੇ ਵਰਗਮੂਲ ਲੈ ਕੇ"],
  ["For both cylinders and cones", "ਬੇਲਨ ਅਤੇ ਸ਼ੰਕੂ ਦੋਵਾਂ ਲਈ"],
  ["Then compare the result with", "ਫਿਰ ਨਤੀਜੇ ਦੀ ਤੁਲਨਾ"],
  ["Form the ratio and cancel pi", "ਅਨੁਪਾਤ ਬਣਾ ਕੇ ਪਾਈ ਦਾ ਸਾਂਝਾ ਗੁਣਕ ਕੱਟੋ"],
  ["Only radius and slant-height factors remain", "ਕੇਵਲ ਅਰਧ-ਵਿਆਸ ਅਤੇ ਤਿਰਛੀ ਉਚਾਈ ਦੇ ਗੁਣਕ ਬਚਦੇ ਹਨ"],
  ["this ratio or algebraic factor is unit-free because like dimensions cancel", "ਇਹ ਅਨੁਪਾਤ ਜਾਂ ਬੀਜਗਣਿਤੀ ਗੁਣਕ ਇਕਾਈ-ਰਹਿਤ ਹੈ ਕਿਉਂਕਿ ਇਕੋ ਮਾਪ ਕੱਟ ਜਾਂਦੇ ਹਨ"],
  ["After multiplying, the new volume is", "ਗੁਣਾ ਕਰਨ ਤੇ ਨਵਾਂ ਆਇਤਨ ਮੂਲ ਆਇਤਨ ਦਾ"],
  ["times the original volume", "ਗੁਣਾ ਹੁੰਦਾ ਹੈ"],
  ["factor appears on both sides", "ਗੁਣਕ ਦੋਵੇਂ ਪਾਸਿਆਂ ਤੇ ਹੈ"],
  ["two length factors produce", "ਦੋ ਲੰਬਾਈ ਗੁਣਕ ਮਿਲ ਕੇ"],
  ["Do not confuse vertical height with slant height", "ਲੰਬ ਉਚਾਈ ਅਤੇ ਤਿਰਛੀ ਉਚਾਈ ਨੂੰ ਨਾ ਮਿਲਾਓ"],
  ["Do not interchange vertical height and face slant height", "ਲੰਬ ਉਚਾਈ ਅਤੇ ਪਾਸੇ ਦੀ ਤਿਰਛੀ ਉਚਾਈ ਨੂੰ ਆਪਸ ਵਿੱਚ ਨਾ ਬਦਲੋ"],
  ["Do not omit the one-third factor or the mixed frustum term", "ਇੱਕ-ਤਿਹਾਈ ਗੁਣਕ ਜਾਂ ਫਰਸਟਮ ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਪਦ ਨਾ ਛੱਡੋ"],
  ["Do not omit the factor 1/3 or the frustum cross-term", "1/3 ਗੁਣਕ ਜਾਂ ਫਰਸਟਮ ਦਾ ਮਿਲਿਆ ਹੋਇਆ ਪਦ ਨਾ ਛੱਡੋ"],
  ["Do not add surfaces that are not part of the requested measure", "ਜਿਹੜੀਆਂ ਸਤ੍ਹਾਂ ਮੰਗੀ ਮਾਪ ਦਾ ਹਿੱਸਾ ਨਹੀਂ ਹਨ, ਉਹ ਨਾ ਜੋੜੋ"],
  ["Include only the surfaces or dimensions requested by the question", "ਕੇਵਲ ਉਹੀ ਸਤ੍ਹਾਂ ਜਾਂ ਮਾਪ ਸ਼ਾਮਲ ਕਰੋ ਜੋ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛੇ ਗਏ ਹਨ"],
  ["For similar solids: lengths scale as k, areas as k² and volumes as k³", "ਸਮਰੂਪ ਠੋਸਾਂ ਵਿੱਚ ਲੰਬਾਈਆਂ k, ਖੇਤਰਫਲ k² ਅਤੇ ਆਇਤਨ k³ ਅਨੁਸਾਰ ਬਦਲਦੇ ਹਨ"],
  ["For a pyramid, remember volume is one-third of the matching prism; face area uses slant height, not vertical height", "ਪਿਰਾਮਿਡ ਦਾ ਆਇਤਨ ਉਸੇ ਆਧਾਰ-ਉਚਾਈ ਵਾਲੇ ਪ੍ਰਿਜ਼ਮ ਦਾ ਇੱਕ-ਤਿਹਾਈ ਹੁੰਦਾ ਹੈ; ਪਾਸੇ ਦੇ ਖੇਤਰਫਲ ਲਈ ਤਿਰਛੀ ਉਚਾਈ ਲੱਗਦੀ ਹੈ, ਲੰਬ ਉਚਾਈ ਨਹੀਂ"],
  ["For a frustum, mark the larger and smaller corresponding dimensions first", "ਫਰਸਟਮ ਵਿੱਚ ਪਹਿਲਾਂ ਸੰਬੰਧਤ ਵੱਡੇ ਅਤੇ ਛੋਟੇ ਮਾਪ ਨਿਸ਼ਾਨਿਤ ਕਰੋ"],
  ["Write total usable material volume first, then divide by the volume of one target unit", "ਪਹਿਲਾਂ ਕੁੱਲ ਵਰਤਣਯੋਗ ਪਦਾਰਥ ਦਾ ਆਇਤਨ ਲਿਖੋ, ਫਿਰ ਇੱਕ ਲਕਸ਼ ਵਸਤੂ ਦੇ ਆਇਤਨ ਨਾਲ ਭਾਗ ਦਿਓ"],
  ["Use radius, not diameter, in both volume formulae", "ਦੋਵੇਂ ਆਇਤਨ ਫਾਰਮੂਲਿਆਂ ਵਿੱਚ ਅਰਧ-ਵਿਆਸ ਵਰਤੋ, ਵਿਆਸ ਨਹੀਂ"],
  ["The sphere volume contains 4/3", "ਗੋਲੇ ਦੇ ਆਇਤਨ ਦੇ ਫਾਰਮੂਲੇ ਵਿੱਚ 4/3 ਗੁਣਕ ਹੁੰਦਾ ਹੈ"],
  ["Use the actual component volumes; a common joining face does not change volume", "ਅਸਲ ਹਿੱਸਿਆਂ ਦੇ ਆਇਤਨ ਵਰਤੋ; ਸਾਂਝਾ ਜੋੜ ਵਾਲਾ ਪਾਸਾ ਆਇਤਨ ਨਹੀਂ ਬਦਲਦਾ"],
  ["A hemispherical cap contributes half a sphere, while two hemispheres make one sphere", "ਇੱਕ ਅਰਧਗੋਲੀ ਸਿਰਾ ਅੱਧੇ ਗੋਲੇ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ, ਜਦਕਿ ਦੋ ਅਰਧਗੋਲੇ ਮਿਲ ਕੇ ਇੱਕ ਪੂਰਾ ਗੋਲਾ ਬਣਦੇ ਹਨ"],
  ["Decompose the solid, factor common constants such as pi, then add only non-overlapping component volumes", "ਠੋਸ ਨੂੰ ਸਧਾਰਣ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡੋ, ਪਾਈ ਵਰਗੇ ਸਾਂਝੇ ਗੁਣਕ ਬਾਹਰ ਲਵੋ ਅਤੇ ਕੇਵਲ ਬਿਨਾਂ ਓਵਰਲੈਪ ਵਾਲੇ ਹਿੱਸਿਆਂ ਦੇ ਆਇਤਨ ਜੋੜੋ"],
  ["The two hemispherical ends make one complete sphere", "ਦੋ ਅਰਧਗੋਲੀ ਸਿਰੇ ਮਿਲ ਕੇ ਇੱਕ ਪੂਰਾ ਗੋਲਾ ਬਣਦੇ ਹਨ"],
  ["Multiply the side three times", "ਭੁਜਾ ਨੂੰ ਤਿੰਨ ਵਾਰ ਗੁਣਾ ਕਰੋ"],
  ["Do not multiply by the number of faces, because volume measures space rather than surface area", "ਪਾਸਿਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਨਾ ਕਰੋ, ਕਿਉਂਕਿ ਆਇਤਨ ਥਾਂ ਨੂੰ ਮਾਪਦਾ ਹੈ, ਸਤਹ ਖੇਤਰਫਲ ਨੂੰ ਨਹੀਂ"],
  ["Use length × breadth × height; all three are equal for a cube", "ਲੰਬਾਈ × ਚੌੜਾਈ × ਉਚਾਈ ਵਰਤੋ; ਘਣ ਵਿੱਚ ਤਿੰਨੋਂ ਬਰਾਬਰ ਹੁੰਦੇ ਹਨ"],
  ["Therefore, the required answer is", "ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ਹੈ"],
  ["Therefore, the required area is", "ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਖੇਤਰਫਲ ਹੈ"],
  ["Therefore, the radius is", "ਇਸ ਲਈ ਅਰਧ-ਵਿਆਸ ਹੈ"],
  ["Therefore, the height is", "ਇਸ ਲਈ ਉਚਾਈ ਹੈ"],
  ["Therefore, the volume is", "ਇਸ ਲਈ ਆਇਤਨ ਹੈ"],
  ["What is its area?", "ਇਸ ਦਾ ਖੇਤਰਫਲ ਕਿੰਨਾ ਹੈ?"],
  ["What is its volume?", "ਇਸ ਦਾ ਆਇਤਨ ਕਿੰਨਾ ਹੈ?"],
  ["Find its area", "ਇਸ ਦਾ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ"],
  ["Find its perimeter", "ਇਸ ਦਾ ਪਰਿਮਾਪ ਪਤਾ ਕਰੋ"],
  ["Find its circumference", "ਇਸ ਦੀ ਪਰਿਧੀ ਪਤਾ ਕਰੋ"],
  ["Find its volume", "ਇਸ ਦਾ ਆਇਤਨ ਪਤਾ ਕਰੋ"],
  ["Find its total surface area", "ਇਸ ਦਾ ਕੁੱਲ ਸਤਹ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ"],
  ["Find its curved surface area", "ਇਸ ਦਾ ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ"],
  ["Find its capacity in litres", "ਇਸ ਦੀ ਸਮਰੱਥਾ ਲੀਟਰ ਵਿੱਚ ਪਤਾ ਕਰੋ"],
  ["Find the total area", "ਕੁੱਲ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ"],
  ["Find the area of the path", "ਰਸਤੇ ਦਾ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ"],
  ["Find the total cost", "ਕੁੱਲ ਲਾਗਤ ਪਤਾ ਕਰੋ"],
  ["How many tiles are required?", "ਕਿੰਨੀਆਂ ਟਾਈਲਾਂ ਚਾਹੀਦੀਆਂ ਹਨ?"],
  ["How many spheres can be made?", "ਕਿੰਨੇ ਗੋਲੇ ਬਣ ਸਕਦੇ ਹਨ?"],
  ["How many small cubes are formed?", "ਕਿੰਨੇ ਛੋਟੇ ਘਣ ਬਣਣਗੇ?"],
  ["Find the width of the path", "ਰਸਤੇ ਦੀ ਚੌੜਾਈ ਪਤਾ ਕਰੋ"],
  ["Find the other side", "ਦੂਜੀ ਭੁਜਾ ਪਤਾ ਕਰੋ"],
  ["Find its vertical height", "ਇਸ ਦੀ ਲੰਬ ਉਚਾਈ ਪਤਾ ਕਰੋ"],
  ["Find the central angle", "ਕੇਂਦਰੀ ਕੋਣ ਪਤਾ ਕਰੋ"],
  ["Find the arc length", "ਚਾਪ ਦੀ ਲੰਬਾਈ ਪਤਾ ਕਰੋ"],
  ["Use pi = 22/7", "ਪਾਈ = 22/7 ਲਵੋ"],
  ["Use pi = 3.14", "ਪਾਈ = 3.14 ਲਵੋ"],
  ["If there is no wastage", "ਜੇ ਕੋਈ ਪਦਾਰਥ ਬਰਬਾਦ ਨਹੀਂ ਹੁੰਦਾ"],
  ["if no metal is lost", "ਜੇ ਕੋਈ ਧਾਤ ਬਰਬਾਦ ਨਹੀਂ ਹੁੰਦੀ"],
  ["is melted and recast into", "ਨੂੰ ਪਿਘਲਾ ਕੇ ਮੁੜ ਢਾਲ ਕੇ"],
  ["without slipping", "ਬਿਨਾਂ ਫਿਸਲੇ"],
  ["at each end", "ਹਰ ਸਿਰੇ ਉੱਤੇ"],
  ["of the same radius", "ਉਸੇ ਅਰਧ-ਵਿਆਸ ਦਾ"],
  ["A right circular cone", "ਇੱਕ ਲੰਬ ਗੋਲ ਸ਼ੰਕੂ"],
  ["A right square pyramid", "ਇੱਕ ਲੰਬ ਵਰਗ ਆਧਾਰ ਵਾਲਾ ਪਿਰਾਮਿਡ"],
  ["A solid cylinder", "ਇੱਕ ਠੋਸ ਬੇਲਨ"],
  ["A closed cylinder", "ਇੱਕ ਬੰਦ ਬੇਲਨ"],
  ["A cylindrical vessel", "ਇੱਕ ਬੇਲਨਾਕਾਰ ਭਾਂਡਾ"],
  ["A cylindrical tank", "ਇੱਕ ਬੇਲਨਾਕਾਰ ਟੈਂਕ"],
  ["A solid sphere", "ਇੱਕ ਠੋਸ ਗੋਲਾ"],
  ["A solid metallic sphere", "ਇੱਕ ਠੋਸ ਧਾਤ ਦਾ ਗੋਲਾ"],
  ["A solid metal cube", "ਇੱਕ ਠੋਸ ਧਾਤ ਦਾ ਘਣ"],
  ["A rectangular plot", "ਇੱਕ ਆਇਤਾਕਾਰ ਪਲਾਟ"],
  ["A rectangular park", "ਇੱਕ ਆਇਤਾਕਾਰ ਪਾਰਕ"],
  ["A rectangular lawn", "ਇੱਕ ਆਇਤਾਕਾਰ ਲਾਨ"],
  ["A rectangular garden", "ਇੱਕ ਆਇਤਾਕਾਰ ਬਾਗ"],
  ["A rectangular floor", "ਇੱਕ ਆਇਤਾਕਾਰ ਫਰਸ਼"],
  ["A rectangular room", "ਇੱਕ ਆਇਤਾਕਾਰ ਕਮਰਾ"],
  ["A triangular field", "ਇੱਕ ਤਿਕੋਣਾ ਖੇਤ"],
  ["A triangular park", "ਇੱਕ ਤਿਕੋਣਾ ਪਾਰਕ"],
  ["A triangular plot", "ਇੱਕ ਤਿਕੋਣਾ ਪਲਾਟ"],
  ["A circular track", "ਇੱਕ ਗੋਲ ਟਰੈਕ"],
  ["A circular plate", "ਇੱਕ ਗੋਲ ਪਲੇਟ"],
  ["A circular garden", "ਇੱਕ ਗੋਲ ਬਾਗ"],
  ["A circular park", "ਇੱਕ ਗੋਲ ਪਾਰਕ"],
  ["A circular lawn", "ਇੱਕ ਗੋਲ ਲਾਨ"],
  ["vertical height", "ਲੰਬ ਉਚਾਈ"],
  ["perpendicular height", "ਲੰਬ ਉਚਾਈ"],
  ["slant height", "ਤਿਰਛੀ ਉਚਾਈ"],
  ["curved surface area", "ਵਕਰ ਸਤਹ ਖੇਤਰਫਲ"],
  ["total surface area", "ਕੁੱਲ ਸਤਹ ਖੇਤਰਫਲ"],
  ["lateral surface area", "ਪਾਰਸ਼ਵ ਸਤਹ ਖੇਤਰਫਲ"],
  ["surface area", "ਸਤਹ ਖੇਤਰਫਲ"],
  ["base area", "ਆਧਾਰ ਖੇਤਰਫਲ"],
  ["outer radius", "ਬਾਹਰੀ ਅਰਧ-ਵਿਆਸ"],
  ["inner radius", "ਅੰਦਰਲਾ ਅਰਧ-ਵਿਆਸ"],
  ["outer diameter", "ਬਾਹਰੀ ਵਿਆਸ"],
  ["inner diameter", "ਅੰਦਰਲਾ ਵਿਆਸ"],
  ["per square metre", "ਪ੍ਰਤੀ ਵਰਗ ਮੀਟਰ"],
  ["per metre", "ਪ੍ਰਤੀ ਮੀਟਰ"],
  ["has radius", "ਦਾ ਅਰਧ-ਵਿਆਸ"],
  ["has a radius of", "ਦਾ ਅਰਧ-ਵਿਆਸ"],
  ["has diameter", "ਦਾ ਵਿਆਸ"],
  ["has area", "ਦਾ ਖੇਤਰਫਲ"],
  ["has volume", "ਦਾ ਆਇਤਨ"],
  ["has length", "ਦੀ ਲੰਬਾਈ"],
  ["has height", "ਦੀ ਉਚਾਈ"],
  ["and height", "ਅਤੇ ਉਚਾਈ"],
  ["and length", "ਅਤੇ ਲੰਬਾਈ"],
  ["and breadth", "ਅਤੇ ਚੌੜਾਈ"],
  ["and width", "ਅਤੇ ਚੌੜਾਈ"],
  ["right-angled triangle", "ਸਮਕੋਣ ਤਿਕੋਣ"],
  ["central angle", "ਕੇਂਦਰੀ ਕੋਣ"],
  ["complete revolutions", "ਪੂਰੇ ਚੱਕਰ"],
];

const HI_TOKENS: TokenMap = {
  a: "एक", an: "एक", the: "", of: "का", in: "में", on: "पर", at: "पर", by: "से", from: "से", into: "में",
  with: "के साथ", without: "बिना", and: "और", or: "या", if: "यदि", when: "जब", where: "जहाँ", then: "फिर", because: "क्योंकि",
  is: "है", are: "हैं", was: "था", were: "थे", has: "है", have: "हैं", this: "यह", that: "वह", its: "उसका", their: "उनका",
  find: "ज्ञात करें", calculate: "गणना करें", determine: "ज्ञात करें", compute: "गणना करें", use: "प्रयोग करें", apply: "लगाएँ", choose: "चुनें",
  identify: "पहचानें", write: "लिखें", substitute: "मान रखें", simplify: "सरल करें", multiply: "गुणा करें", divide: "भाग दें", subtract: "घटाएँ", add: "जोड़ें",
  convert: "बदलें", cancel: "काटें", compare: "तुलना करें", check: "जाँचें", keep: "रखें", remember: "याद रखें", select: "चुनें", selecting: "चुनने पर",
  radius: "त्रिज्या", diameter: "व्यास", circumference: "परिधि", perimeter: "परिमाप", area: "क्षेत्रफल", volume: "आयतन", capacity: "धारिता",
  length: "लंबाई", breadth: "चौड़ाई", width: "चौड़ाई", height: "ऊँचाई", diagonal: "विकर्ण", side: "भुजा", edge: "किनारा", base: "आधार",
  surface: "पृष्ठ", curved: "वक्र", lateral: "पार्श्व", vertical: "लम्बवत", perpendicular: "लम्बवत", slant: "तिर्यक", outer: "बाहरी", inner: "भीतरी",
  cylinder: "बेलन", cylinders: "बेलन", cone: "शंकु", cones: "शंकु", sphere: "गोला", spheres: "गोले", hemisphere: "अर्धगोला", hemispheres: "अर्धगोले",
  cube: "घन", cubes: "घन", cuboid: "घनाभ", prism: "प्रिज्म", pyramid: "पिरामिड", frustum: "फ्रस्टम", rectangle: "आयत", square: "वर्ग", triangle: "त्रिभुज",
  circle: "वृत्त", semicircle: "अर्धवृत्त", sector: "सेक्टर", arc: "चाप", quadrant: "चतुर्थांश", parallelogram: "समांतर चतुर्भुज", rhombus: "समचतुर्भुज", trapezium: "समलंब",
  solid: "ठोस", hollow: "खोखला", open: "खुला", closed: "बंद", material: "पदार्थ", metal: "धातु", wire: "तार", tile: "टाइल", tiles: "टाइलें",
  path: "पथ", border: "किनारी", floor: "फर्श", fencing: "बाड़", cost: "लागत", rate: "दर", distance: "दूरी", revolutions: "चक्कर", revolution: "चक्कर",
  litre: "लीटर", litres: "लीटर", metre: "मीटर", metres: "मीटर", centimetre: "सेंटीमीटर", centimetres: "सेंटीमीटर", millimetre: "मिलीमीटर", millimetres: "मिलीमीटर",
  total: "कुल", complete: "पूरा", same: "समान", equal: "बराबर", similar: "समरूप", larger: "बड़ा", smaller: "छोटा", largest: "सबसे बड़ा", smallest: "सबसे छोटा",
  one: "एक", two: "दो", three: "तीन", four: "चार", both: "दोनों", each: "प्रत्येक", every: "हर", only: "केवल", first: "पहले", directly: "सीधे", separately: "अलग-अलग",
  formula: "सूत्र", calculation: "गणना", answer: "उत्तर", result: "परिणाम", value: "मान", values: "मान", measure: "माप", measurement: "माप", measurements: "माप",
  dimension: "आयाम", dimensions: "आयाम", figure: "आकृति", region: "भाग", part: "भाग", parts: "भाग", factor: "गुणक", factors: "गुणक", coefficient: "गुणांक", coefficients: "गुणांक",
  ratio: "अनुपात", increase: "वृद्धि", decrease: "कमी", difference: "अंतर", exact: "ठीक", positive: "धनात्मक", required: "आवश्यक", requested: "माँगा गया", given: "दिया गया",
  ready: "तैयार", quantity: "राशि", asked: "पूछी", final: "अंतिम", cubic: "घन", original: "मूल", new: "नया", algebraic: "बीजीय", unit: "इकाई", free: "रहित",
  appears: "आता है", sides: "पक्ष", produce: "बनाते हैं", like: "समान", remain: "बचते हैं", work: "काम करें", written: "लिखे", multiples: "गुणज", form: "बनाएँ", test: "जाँचें",
  pi: "पाई", times: "गुना", squared: "वर्ग", square-root: "वर्गमूल", root: "मूल", coefficient: "गुणांक", divided: "भाग", equals: "बराबर", around: "चारों ओर",
};

const PA_TOKENS: TokenMap = {
  a: "ਇੱਕ", an: "ਇੱਕ", the: "", of: "ਦਾ", in: "ਵਿੱਚ", on: "ਉੱਤੇ", at: "ਉੱਤੇ", by: "ਨਾਲ", from: "ਤੋਂ", into: "ਵਿੱਚ",
  with: "ਦੇ ਨਾਲ", without: "ਬਿਨਾਂ", and: "ਅਤੇ", or: "ਜਾਂ", if: "ਜੇ", when: "ਜਦੋਂ", where: "ਜਿੱਥੇ", then: "ਫਿਰ", because: "ਕਿਉਂਕਿ",
  is: "ਹੈ", are: "ਹਨ", was: "ਸੀ", were: "ਸਨ", has: "ਹੈ", have: "ਹਨ", this: "ਇਹ", that: "ਉਹ", its: "ਇਸ ਦਾ", their: "ਉਹਨਾਂ ਦਾ",
  find: "ਪਤਾ ਕਰੋ", calculate: "ਗਣਨਾ ਕਰੋ", determine: "ਪਤਾ ਕਰੋ", compute: "ਗਣਨਾ ਕਰੋ", use: "ਵਰਤੋ", apply: "ਲਗਾਓ", choose: "ਚੁਣੋ",
  identify: "ਪਛਾਣੋ", write: "ਲਿਖੋ", substitute: "ਮੁੱਲ ਰੱਖੋ", simplify: "ਸਰਲ ਕਰੋ", multiply: "ਗੁਣਾ ਕਰੋ", divide: "ਭਾਗ ਦਿਓ", subtract: "ਘਟਾਓ", add: "ਜੋੜੋ",
  convert: "ਬਦਲੋ", cancel: "ਕੱਟੋ", compare: "ਤੁਲਨਾ ਕਰੋ", check: "ਜਾਂਚੋ", keep: "ਰੱਖੋ", remember: "ਯਾਦ ਰੱਖੋ", select: "ਚੁਣੋ", selecting: "ਚੁਣਨ ਤੋਂ ਬਾਅਦ",
  radius: "ਅਰਧ-ਵਿਆਸ", diameter: "ਵਿਆਸ", circumference: "ਪਰਿਧੀ", perimeter: "ਪਰਿਮਾਪ", area: "ਖੇਤਰਫਲ", volume: "ਆਇਤਨ", capacity: "ਸਮਰੱਥਾ",
  length: "ਲੰਬਾਈ", breadth: "ਚੌੜਾਈ", width: "ਚੌੜਾਈ", height: "ਉਚਾਈ", diagonal: "ਵਿਕਰਨ", side: "ਭੁਜਾ", edge: "ਕਿਨਾਰਾ", base: "ਆਧਾਰ",
  surface: "ਸਤਹ", curved: "ਵਕਰ", lateral: "ਪਾਰਸ਼ਵ", vertical: "ਲੰਬ", perpendicular: "ਲੰਬ", slant: "ਤਿਰਛੀ", outer: "ਬਾਹਰੀ", inner: "ਅੰਦਰਲਾ",
  cylinder: "ਬੇਲਨ", cylinders: "ਬੇਲਨ", cone: "ਸ਼ੰਕੂ", cones: "ਸ਼ੰਕੂ", sphere: "ਗੋਲਾ", spheres: "ਗੋਲੇ", hemisphere: "ਅਰਧਗੋਲਾ", hemispheres: "ਅਰਧਗੋਲੇ",
  cube: "ਘਣ", cubes: "ਘਣ", cuboid: "ਘਣਾਭ", prism: "ਪ੍ਰਿਜ਼ਮ", pyramid: "ਪਿਰਾਮਿਡ", frustum: "ਫਰਸਟਮ", rectangle: "ਆਇਤ", square: "ਵਰਗ", triangle: "ਤਿਕੋਣ",
  circle: "ਵ੍ਰਿਤ", semicircle: "ਅਰਧ-ਵ੍ਰਿਤ", sector: "ਸੈਕਟਰ", arc: "ਚਾਪ", quadrant: "ਚੌਥਾਈ ਵ੍ਰਿਤ", parallelogram: "ਸਮਾਂਤਰ ਚਤੁਰਭੁਜ", rhombus: "ਸਮਚਤੁਰਭੁਜ", trapezium: "ਸਮਲੰਬ",
  solid: "ਠੋਸ", hollow: "ਖੋਖਲਾ", open: "ਖੁੱਲ੍ਹਾ", closed: "ਬੰਦ", material: "ਪਦਾਰਥ", metal: "ਧਾਤ", wire: "ਤਾਰ", tile: "ਟਾਈਲ", tiles: "ਟਾਈਲਾਂ",
  path: "ਰਸਤਾ", border: "ਕਿਨਾਰੀ", floor: "ਫਰਸ਼", fencing: "ਵਾੜ", cost: "ਲਾਗਤ", rate: "ਦਰ", distance: "ਦੂਰੀ", revolutions: "ਚੱਕਰ", revolution: "ਚੱਕਰ",
  litre: "ਲੀਟਰ", litres: "ਲੀਟਰ", metre: "ਮੀਟਰ", metres: "ਮੀਟਰ", centimetre: "ਸੈਂਟੀਮੀਟਰ", centimetres: "ਸੈਂਟੀਮੀਟਰ", millimetre: "ਮਿਲੀਮੀਟਰ", millimetres: "ਮਿਲੀਮੀਟਰ",
  total: "ਕੁੱਲ", complete: "ਪੂਰਾ", same: "ਇੱਕੋ", equal: "ਬਰਾਬਰ", similar: "ਸਮਰੂਪ", larger: "ਵੱਡਾ", smaller: "ਛੋਟਾ", largest: "ਸਭ ਤੋਂ ਵੱਡਾ", smallest: "ਸਭ ਤੋਂ ਛੋਟਾ",
  one: "ਇੱਕ", two: "ਦੋ", three: "ਤਿੰਨ", four: "ਚਾਰ", both: "ਦੋਵੇਂ", each: "ਹਰ", every: "ਹਰ", only: "ਕੇਵਲ", first: "ਪਹਿਲਾਂ", directly: "ਸਿੱਧਾ", separately: "ਵੱਖ-ਵੱਖ",
  formula: "ਫਾਰਮੂਲਾ", calculation: "ਗਣਨਾ", answer: "ਉੱਤਰ", result: "ਨਤੀਜਾ", value: "ਮੁੱਲ", values: "ਮੁੱਲ", measure: "ਮਾਪ", measurement: "ਮਾਪ", measurements: "ਮਾਪ",
  dimension: "ਮਾਪ", dimensions: "ਮਾਪ", figure: "ਆਕ੍ਰਿਤੀ", region: "ਹਿੱਸਾ", part: "ਹਿੱਸਾ", parts: "ਹਿੱਸੇ", factor: "ਗੁਣਕ", factors: "ਗੁਣਕ", coefficient: "ਗੁਣਾਂਕ", coefficients: "ਗੁਣਾਂਕ",
  ratio: "ਅਨੁਪਾਤ", increase: "ਵਾਧਾ", decrease: "ਘਾਟ", difference: "ਅੰਤਰ", exact: "ਸਹੀ", positive: "ਧਨਾਤਮਕ", required: "ਲੋੜੀਂਦਾ", requested: "ਮੰਗਿਆ", given: "ਦਿੱਤਾ",
  ready: "ਤਿਆਰ", quantity: "ਮਾਤਰਾ", asked: "ਪੁੱਛੀ", final: "ਆਖਰੀ", cubic: "ਘਣ", original: "ਮੂਲ", new: "ਨਵਾਂ", algebraic: "ਬੀਜਗਣਿਤੀ", unit: "ਇਕਾਈ", free: "ਰਹਿਤ",
  appears: "ਆਉਂਦਾ ਹੈ", sides: "ਪਾਸੇ", produce: "ਬਣਾਉਂਦੇ ਹਨ", like: "ਇੱਕੋ", remain: "ਬਚਦੇ ਹਨ", work: "ਕੰਮ ਕਰੋ", written: "ਲਿਖੇ", multiples: "ਗੁਣਜ", form: "ਬਣਾਓ", test: "ਜਾਂਚੋ",
  pi: "ਪਾਈ", times: "ਗੁਣਾ", squared: "ਵਰਗ", root: "ਮੂਲ", divided: "ਭਾਗ", equals: "ਬਰਾਬਰ", around: "ਚਾਰੋਂ ਪਾਸੇ",
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function protectMathAndIds(text: string) {
  const values: string[] = [];
  const protect = (value: string) => {
    const token = `⟦P${values.length}⟧`;
    values.push(value);
    return token;
  };
  let result = text;
  const patterns: RegExp[] = [
    /\$\$[\s\S]*?\$\$/g,
    /\$[^$]*\$/g,
    /\\\([\s\S]*?\\\)/g,
    /\\frac\{[^{}]*\}\{[^{}]*\}/g,
    /\\sqrt\{[^{}]*\}/g,
    /\\text\{[^{}]*\}/g,
    /\\(?:pi|times|div|cdot|theta|ell|Delta|sqrt|frac)\b/g,
    /\[[A-Z0-9_:-]{3,}\]/g,
  ];
  for (const pattern of patterns) result = result.replace(pattern, protect);
  return { result, values };
}

function applyPhrasePass(text: string, pairs: readonly PhrasePair[]) {
  const map = new Map<string, string>();
  for (const [source, target] of pairs) map.set(source.toLowerCase(), target);
  const sources = [...map.keys()].filter((value) => value.length >= 3).sort((a, b) => b.length - a.length);
  if (!sources.length) return text;
  const pattern = new RegExp(sources.map(escapeRegex).join("|"), "gi");
  return text.replace(pattern, (match) => map.get(match.toLowerCase()) ?? match);
}

function applyTokenPass(text: string, map: TokenMap) {
  return text.replace(/[A-Za-z]+(?:-[A-Za-z]+)*/g, (word) => map[word.toLowerCase()] ?? word);
}

function restoreProtected(text: string, values: readonly string[]) {
  let result = text;
  values.forEach((value, index) => { result = result.replace(`⟦P${index}⟧`, value); });
  return result;
}

function normalizeLocalizedPunctuation(text: string, language: MensurationLocalizedLanguage) {
  let result = text
    .replace(/[ \t]+([,.;:?])/g, "$1")
    .replace(/ {2,}/g, " ")
    .replace(/\n +/g, "\n")
    .replace(/ +\n/g, "\n")
    .replace(/,\s*,/g, ",")
    .replace(/\s+\./g, ".")
    .trim();
  if (language === "hi") {
    result = result
      .replace(/एक है /g, "एक ")
      .replace(/ है है/g, " है")
      .replace(/ हैं हैं/g, " हैं")
      .replace(/का का/g, "का")
      .replace(/और और/g, "और")
      .replace(/ज्ञात करें कीजिए/g, "ज्ञात कीजिए");
  } else {
    result = result
      .replace(/ਇੱਕ ਹੈ /g, "ਇੱਕ ")
      .replace(/ ਹੈ ਹੈ/g, " ਹੈ")
      .replace(/ ਹਨ ਹਨ/g, " ਹਨ")
      .replace(/ਦਾ ਦਾ/g, "ਦਾ")
      .replace(/ਅਤੇ ਅਤੇ/g, "ਅਤੇ")
      .replace(/ਪਤਾ ਕਰੋ ਕਰੋ/g, "ਪਤਾ ਕਰੋ");
  }
  return result;
}

function punjabiPhrasePairs() {
  const override = new Map(PA_OVERRIDES.map(([source, target]) => [source.toLowerCase(), target]));
  return HI_PHRASES.map(([source, hindi]) => [source, override.get(source.toLowerCase()) ?? hindi] as const);
}

export function localizeMensurationProse(text: string, language: MensurationLocalizedLanguage) {
  if (!text) return text;
  const { result, values } = protectMathAndIds(text);
  const phrases = language === "hi" ? HI_PHRASES : punjabiPhrasePairs();
  const phraseTranslated = applyPhrasePass(result, phrases);
  const tokenTranslated = applyTokenPass(phraseTranslated, language === "hi" ? HI_TOKENS : PA_TOKENS);
  return normalizeLocalizedPunctuation(restoreProtected(tokenTranslated, values), language);
}

export function localizeMensurationOption(text: string, language: MensurationLocalizedLanguage) {
  const replacements: TokenMap = language === "hi"
    ? { litre: "लीटर", litres: "लीटर", tile: "टाइल", tiles: "टाइलें", revolution: "चक्कर", revolutions: "चक्कर", times: "गुना", sphere: "गोला", spheres: "गोले", brick: "ईंट", bricks: "ईंटें", block: "ब्लॉक", blocks: "ब्लॉक", cube: "घन", cubes: "घन", cylinder: "बेलन", cylinders: "बेलन", increase: "वृद्धि", decrease: "कमी" }
    : { litre: "ਲੀਟਰ", litres: "ਲੀਟਰ", tile: "ਟਾਈਲ", tiles: "ਟਾਈਲਾਂ", revolution: "ਚੱਕਰ", revolutions: "ਚੱਕਰ", times: "ਗੁਣਾ", sphere: "ਗੋਲਾ", spheres: "ਗੋਲੇ", brick: "ਇੱਟ", bricks: "ਇੱਟਾਂ", block: "ਬਲਾਕ", blocks: "ਬਲਾਕ", cube: "ਘਣ", cubes: "ਘਣ", cylinder: "ਬੇਲਨ", cylinders: "ਬੇਲਨ", increase: "ਵਾਧਾ", decrease: "ਘਾਟ" };
  return text.replace(/[A-Za-z]+/g, (word) => replacements[word.toLowerCase()] ?? word);
}

export function stripLearnerMisconceptionTag(text: string) {
  return text.replace(/\s*\[[A-Z0-9_:-]{3,}\]\s*$/g, "").trim();
}

export function hasHindiScript(text: string) { return /[\u0900-\u097F]/u.test(text); }
export function hasGurmukhiScript(text: string) { return /[\u0A00-\u0A7F]/u.test(text); }

const ALLOWED_LATIN_PROSE = new Set([
  "cm", "m", "mm", "km", "l", "r", "h", "b", "a", "d", "v", "s", "c", "p", "k", "n", "tsa", "csa", "lsa",
  "pi", "sqrt", "frac", "text", "div", "times", "rs", "inr",
]);

export function instructionalLatinLeaks(text: string) {
  const scrubbed = text
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$]*\$/g, " ")
    .replace(/\\\([\s\S]*?\\\)/g, " ")
    .replace(/\\frac\{[^{}]*\}\{[^{}]*\}/g, " ")
    .replace(/\\sqrt\{[^{}]*\}/g, " ")
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/\[[A-Z0-9_:-]{3,}\]/g, " ");
  return [...new Set((scrubbed.match(/[A-Za-z]+/g) ?? [])
    .map((token) => token.toLowerCase())
    .filter((token) => !ALLOWED_LATIN_PROSE.has(token)))].sort();
}
