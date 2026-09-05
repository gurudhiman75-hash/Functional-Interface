import type { Com003LocalizedQuestionV2 } from "./com003-localization-v2-wave1";

type L = "hi" | "pa";
type LocalizedExplanationSet = Readonly<{ hi: readonly string[]; pa: readonly string[] }>;

const EXPLANATION_DIVERSITY: Readonly<Record<string, LocalizedExplanationSet>> = Object.freeze({
  "COM-003-QL-011": Object.freeze({
    hi: Object.freeze([
      "Absolute reference को copy या fill करने पर उसका cell address नहीं बदलता, इसलिए fixed cell के लिए यही reference type सही है।",
      "$A$1 में column A और row 1 दोनों से पहले dollar sign है, इसलिए यह fully absolute reference का मानक notation है।",
      "Relative reference formula की नई position के अनुसार row और column को adjust करता है, इसलिए copy करने पर address बदल सकता है।",
      "जब copied formula में किसी एक source cell को हर जगह वही रखना हो, तो absolute reference उस address को स्थिर रखता है।",
      "A1 की column और row दोनों lock करने के लिए $A$1 लिखा जाता है; दोनों dollar signs दोनों coordinates को fixed बनाते हैं।",
      "यदि reference को formula के साथ नई जगह पर shift होना चाहिए, तो relative reference उपयोग किया जाता है क्योंकि वह position के अनुसार बदलता है।",
      "Copy करने के बाद भी जिस reference का address जस का तस रहता है, वह absolute reference होता है।",
      "$A$1 fully absolute example है: पहला dollar sign column को और दूसरा dollar sign row को lock करता है।",
      "Formula को दूसरी cell में copy करते समय जो reference नई location के अनुसार बदलता है, वह relative reference कहलाता है।",
      "Relative reference move के साथ adjust होता है, जबकि absolute reference fixed रहता है; इसलिए fixed case में absolute reference सही है।",
      "Column और row दोनों को lock करने के लिए dollar sign दोनों के आगे लगाया जाता है, जैसे $A$1।",
      "Fully fixed reference में column letter और row number दोनों absolute होते हैं; Excel में इसका सामान्य रूप $A$1 है।",
    ]),
    pa: Object.freeze([
      "Absolute reference ਨੂੰ copy ਜਾਂ fill ਕਰਨ 'ਤੇ ਉਸਦਾ cell address ਨਹੀਂ ਬਦਲਦਾ, ਇਸ ਲਈ fixed cell ਲਈ ਇਹੀ reference type ਸਹੀ ਹੈ।",
      "$A$1 ਵਿੱਚ column A ਅਤੇ row 1 ਦੋਵਾਂ ਤੋਂ ਪਹਿਲਾਂ dollar sign ਹੈ, ਇਸ ਲਈ ਇਹ fully absolute reference ਦਾ ਮਿਆਰੀ notation ਹੈ।",
      "Relative reference formula ਦੀ ਨਵੀਂ position ਅਨੁਸਾਰ row ਅਤੇ column ਨੂੰ adjust ਕਰਦਾ ਹੈ, ਇਸ ਲਈ copy ਕਰਨ 'ਤੇ address ਬਦਲ ਸਕਦਾ ਹੈ।",
      "ਜਦੋਂ copied formula ਵਿੱਚ ਕਿਸੇ ਇੱਕ source cell ਨੂੰ ਹਰ ਥਾਂ ਉਹੀ ਰੱਖਣਾ ਹੋਵੇ, absolute reference ਉਸ address ਨੂੰ ਸਥਿਰ ਰੱਖਦਾ ਹੈ।",
      "A1 ਦੀ column ਅਤੇ row ਦੋਵੇਂ lock ਕਰਨ ਲਈ $A$1 ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ; ਦੋਵੇਂ dollar signs ਦੋਵੇਂ coordinates ਨੂੰ fixed ਕਰਦੇ ਹਨ।",
      "ਜੇ reference ਨੂੰ formula ਨਾਲ ਨਵੀਂ ਥਾਂ ਵੱਲ shift ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, relative reference ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ ਕਿਉਂਕਿ ਇਹ position ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ।",
      "Copy ਕਰਨ ਤੋਂ ਬਾਅਦ ਵੀ ਜਿਸ reference ਦਾ address ਜਿਉਂ ਦਾ ਤਿਉਂ ਰਹਿੰਦਾ ਹੈ, ਉਹ absolute reference ਹੁੰਦਾ ਹੈ।",
      "$A$1 fully absolute example ਹੈ: ਪਹਿਲਾ dollar sign column ਨੂੰ ਅਤੇ ਦੂਜਾ dollar sign row ਨੂੰ lock ਕਰਦਾ ਹੈ।",
      "Formula ਨੂੰ ਦੂਜੇ cell ਵਿੱਚ copy ਕਰਦੇ ਸਮੇਂ ਜੋ reference ਨਵੀਂ location ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ, ਉਹ relative reference ਕਹਾਉਂਦਾ ਹੈ।",
      "Relative reference move ਨਾਲ adjust ਹੁੰਦਾ ਹੈ, ਜਦਕਿ absolute reference fixed ਰਹਿੰਦਾ ਹੈ; ਇਸ ਲਈ fixed case ਵਿੱਚ absolute reference ਸਹੀ ਹੈ।",
      "Column ਅਤੇ row ਦੋਵੇਂ lock ਕਰਨ ਲਈ dollar sign ਦੋਵਾਂ ਦੇ ਅੱਗੇ ਲਾਇਆ ਜਾਂਦਾ ਹੈ, ਜਿਵੇਂ $A$1।",
      "Fully fixed reference ਵਿੱਚ column letter ਅਤੇ row number ਦੋਵੇਂ absolute ਹੁੰਦੇ ਹਨ; Excel ਵਿੱਚ ਇਸਦਾ ਆਮ ਰੂਪ $A$1 ਹੈ।",
    ]),
  }),
  "COM-003-QL-014": Object.freeze({
    hi: Object.freeze([
      "Line Chart ordered points को जोड़कर trend स्पष्ट करता है, इसलिए समय या क्रमिक intervals के साथ बदलाव दिखाने के लिए यह उपयुक्त है।",
      "Bar Chart अलग-अलग categories के magnitudes को साथ रखकर तुलना आसान बनाता है; category comparison इसका सामान्य उपयोग है।",
      "Pie Chart एक total को proportional slices में बाँटता है, इसलिए whole के अलग-अलग shares दिखाने के लिए इसे चुना जाता है।",
      "कई product categories के values compare करने हों तो Bar Chart लंबाई के आधार पर अंतर साफ दिखाता है।",
      "जब हर category का हिस्सा एक ही total के भीतर दिखाना हो, Pie Chart proportional share को slices के रूप में प्रस्तुत करता है।",
      "एक ही total के हिस्सों को report में visually बाँटना हो तो Pie Chart parts-of-a-whole relationship दिखाता है।",
      "यदि प्रत्येक category total का share दर्शाती है, तो Pie Chart उसी proportional composition को circle slices में दिखाता है।",
      "Parts of a whole का अर्थ एक total के अंदर अनुपात दिखाना है, और Pie Chart इसी उद्देश्य के लिए बनाया गया basic chart है।",
      "एक data series को proportional category shares में दिखाने पर Pie Chart हर share को total के हिस्से के रूप में प्रदर्शित करता है।",
      "Categories के absolute values की तुलना करनी हो, न कि total share दिखाना हो, तो Bar Chart अधिक सीधी comparison देता है।",
      "अलग-अलग items की तुलना के लिए Bar Chart उपयुक्त है क्योंकि उसकी bars के lengths से values का अंतर तुरंत दिखता है।",
      "Basic category comparison में Bar Chart values को अलग bars में दिखाता है, जबकि Pie Chart मुख्यतः whole के shares के लिए उपयोग होता है।",
    ]),
    pa: Object.freeze([
      "Line Chart ordered points ਨੂੰ ਜੋੜ ਕੇ trend ਸਪੱਸ਼ਟ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ ਸਮੇਂ ਜਾਂ ਕ੍ਰਮਵਾਰ intervals ਨਾਲ ਬਦਲਾਅ ਦਿਖਾਉਣ ਲਈ ਇਹ ਢੁੱਕਵਾਂ ਹੈ।",
      "Bar Chart ਵੱਖ-ਵੱਖ categories ਦੇ magnitudes ਨੂੰ ਇਕੱਠੇ ਰੱਖ ਕੇ ਤੁਲਨਾ ਆਸਾਨ ਕਰਦਾ ਹੈ; category comparison ਇਸਦਾ ਆਮ ਵਰਤੋਂ-ਖੇਤਰ ਹੈ।",
      "Pie Chart ਇੱਕ total ਨੂੰ proportional slices ਵਿੱਚ ਵੰਡਦਾ ਹੈ, ਇਸ ਲਈ whole ਦੇ ਵੱਖ-ਵੱਖ shares ਦਿਖਾਉਣ ਲਈ ਇਹ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।",
      "ਕਈ product categories ਦੇ values compare ਕਰਨੇ ਹੋਣ ਤਾਂ Bar Chart ਲੰਬਾਈ ਦੇ ਆਧਾਰ 'ਤੇ ਫਰਕ ਸਾਫ਼ ਦਿਖਾਉਂਦਾ ਹੈ।",
      "ਜਦੋਂ ਹਰ category ਦਾ ਹਿੱਸਾ ਇੱਕੋ total ਵਿੱਚ ਦਿਖਾਉਣਾ ਹੋਵੇ, Pie Chart proportional share ਨੂੰ slices ਵਜੋਂ ਪੇਸ਼ ਕਰਦਾ ਹੈ।",
      "ਇੱਕੋ total ਦੇ ਹਿੱਸਿਆਂ ਨੂੰ report ਵਿੱਚ visually ਵੰਡਣਾ ਹੋਵੇ ਤਾਂ Pie Chart parts-of-a-whole relationship ਦਿਖਾਉਂਦਾ ਹੈ।",
      "ਜੇ ਹਰ category total ਦਾ share ਦਰਸਾਉਂਦੀ ਹੈ, Pie Chart ਉਸ proportional composition ਨੂੰ circle slices ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ।",
      "Parts of a whole ਦਾ ਮਤਲਬ ਇੱਕ total ਦੇ ਅੰਦਰ ਅਨੁਪਾਤ ਦਿਖਾਉਣਾ ਹੈ, ਅਤੇ Pie Chart ਇਸੇ basic purpose ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
      "ਇੱਕ data series ਨੂੰ proportional category shares ਵਿੱਚ ਦਿਖਾਉਣ 'ਤੇ Pie Chart ਹਰ share ਨੂੰ total ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਪੇਸ਼ ਕਰਦਾ ਹੈ।",
      "Categories ਦੇ absolute values ਦੀ ਤੁਲਨਾ ਕਰਨੀ ਹੋਵੇ, total share ਨਹੀਂ, ਤਾਂ Bar Chart ਹੋਰ ਸਿੱਧੀ comparison ਦਿੰਦਾ ਹੈ।",
      "ਵੱਖ-ਵੱਖ items ਦੀ ਤੁਲਨਾ ਲਈ Bar Chart ਢੁੱਕਵਾਂ ਹੈ ਕਿਉਂਕਿ bars ਦੀ length ਨਾਲ values ਦਾ ਫਰਕ ਤੁਰੰਤ ਦਿਖਦਾ ਹੈ।",
      "Basic category comparison ਵਿੱਚ Bar Chart values ਨੂੰ ਵੱਖ bars ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ, ਜਦਕਿ Pie Chart ਮੁੱਖ ਤੌਰ 'ਤੇ whole ਦੇ shares ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
    ]),
  }),
  "COM-003-QL-017": Object.freeze({
    hi: Object.freeze([
      "PowerPoint में numerical data को graphical form में दिखाने के लिए Chart object insert किया जाता है।",
      "Slide पर photograph या दूसरी image जोड़ने के लिए Picture object उपयोग किया जाता है।",
      "Rows और columns में व्यवस्थित information दिखाने के लिए Table object सही PowerPoint object है।",
      "Data को bars, lines या अन्य graphical representation में प्रस्तुत करना हो तो slide पर Chart object insert किया जाता है।",
      "Photograph जैसी visual image को slide में लाने के लिए Picture object चुना जाता है, Chart या Table नहीं।",
      "जब data को row-column grid में दिखाना हो, PowerPoint का Table object उस tabular structure को बनाता है।",
      "Graphical data display के लिए Chart object data को visual chart form में प्रस्तुत करता है।",
      "Slide पर insert की गई photograph Picture object का उदाहरण है क्योंकि वह image content है।",
      "Numerical values का graphical comparison या trend दिखाने के लिए Chart object उपयोग किया जा सकता है।",
      "यदि आवश्यकता image दिखाने की है, tabular या charted data की नहीं, तो Picture object उपयुक्त है।",
      "Chart और Table data structures के लिए हैं; सामान्य picture content जोड़ने के लिए Picture object चुना जाता है।",
      "Rows, columns या plotted values के बजाय visual image content चाहिए तो PowerPoint में Picture object insert किया जाता है।",
    ]),
    pa: Object.freeze([
      "PowerPoint ਵਿੱਚ numerical data ਨੂੰ graphical form ਵਿੱਚ ਦਿਖਾਉਣ ਲਈ Chart object insert ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
      "Slide ਉੱਤੇ photograph ਜਾਂ ਹੋਰ image ਜੋੜਨ ਲਈ Picture object ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
      "Rows ਅਤੇ columns ਵਿੱਚ ਵਿਵਸਥਿਤ information ਦਿਖਾਉਣ ਲਈ Table object ਸਹੀ PowerPoint object ਹੈ।",
      "Data ਨੂੰ bars, lines ਜਾਂ ਹੋਰ graphical representation ਵਿੱਚ ਪੇਸ਼ ਕਰਨਾ ਹੋਵੇ ਤਾਂ slide ਉੱਤੇ Chart object insert ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
      "Photograph ਵਰਗੀ visual image ਨੂੰ slide ਵਿੱਚ ਲਿਆਉਣ ਲਈ Picture object ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ, Chart ਜਾਂ Table ਨਹੀਂ।",
      "ਜਦੋਂ data ਨੂੰ row-column grid ਵਿੱਚ ਦਿਖਾਉਣਾ ਹੋਵੇ, PowerPoint ਦਾ Table object ਉਹ tabular structure ਬਣਾਉਂਦਾ ਹੈ।",
      "Graphical data display ਲਈ Chart object data ਨੂੰ visual chart form ਵਿੱਚ ਪੇਸ਼ ਕਰਦਾ ਹੈ।",
      "Slide ਉੱਤੇ insert ਕੀਤੀ photograph Picture object ਦਾ ਉਦਾਹਰਨ ਹੈ ਕਿਉਂਕਿ ਉਹ image content ਹੈ।",
      "Numerical values ਦੀ graphical comparison ਜਾਂ trend ਦਿਖਾਉਣ ਲਈ Chart object ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
      "ਜੇ ਲੋੜ image ਦਿਖਾਉਣ ਦੀ ਹੈ, tabular ਜਾਂ charted data ਦੀ ਨਹੀਂ, ਤਾਂ Picture object ਢੁੱਕਵਾਂ ਹੈ।",
      "Chart ਅਤੇ Table data structures ਲਈ ਹਨ; ਆਮ picture content ਜੋੜਨ ਲਈ Picture object ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।",
      "Rows, columns ਜਾਂ plotted values ਦੀ ਬਜਾਇ visual image content ਚਾਹੀਦਾ ਹੋਵੇ ਤਾਂ PowerPoint ਵਿੱਚ Picture object insert ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
    ]),
  }),
  "COM-003-QL-019": Object.freeze({
    hi: Object.freeze([
      "Windows desktop PowerPoint में F5 slide show को first slide से शुरू करता है; beginning से presentation चलाने के लिए यही key है।",
      "Shift+F5 current slide से slide show शुरू करता है, इसलिए selected slide से presentation चलाने के लिए यह shortcut सही है।",
      "First slide से slide show शुरू करने की standard Windows desktop PowerPoint key F5 है।",
      "Presenter यदि current slide से शुरू करना चाहता है तो Shift+F5 दबाता है; F5 उसे beginning से शुरू कर देता।",
      "Beginning यानी first slide से presentation चलाने के लिए F5 उपयोग होता है, जबकि Shift+F5 current slide के लिए है।",
      "Currently selected slide से show शुरू करने वाला shortcut Shift+F5 है, इसलिए बीच की slide से rehearsal में यही उपयोगी है।",
      "F5 का action slide show को beginning से launch करना है; इसलिए F5 — first slide सही shortcut-action pair है।",
      "Shift+F5 का action current slide से show शुरू करना है; यह F5 के beginning वाले action से अलग है।",
      "PowerPoint में first slide से slide show start करना F5 key का standard action है।",
      "Beginning को छोड़कर वर्तमान slide से show चलाना हो तो Windows desktop PowerPoint में Shift+F5 उपयोग किया जाता है।",
      "Current slide के बजाय शुरुआत से show चलाने के लिए F5 दबाया जाता है; यह presentation को first slide पर ले जाता है।",
      "F5 beginning से और Shift+F5 current slide से शुरू करता है, इसलिए current-slide case में Shift+F5 सही विकल्प है।",
    ]),
    pa: Object.freeze([
      "Windows desktop PowerPoint ਵਿੱਚ F5 slide show ਨੂੰ first slide ਤੋਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ; beginning ਤੋਂ presentation ਚਲਾਉਣ ਲਈ ਇਹੀ key ਹੈ।",
      "Shift+F5 current slide ਤੋਂ slide show ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ selected slide ਤੋਂ presentation ਚਲਾਉਣ ਲਈ ਇਹ shortcut ਸਹੀ ਹੈ।",
      "First slide ਤੋਂ slide show ਸ਼ੁਰੂ ਕਰਨ ਦੀ standard Windows desktop PowerPoint key F5 ਹੈ।",
      "Presenter ਜੇ current slide ਤੋਂ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੇ ਤਾਂ Shift+F5 ਦਬਾਉਂਦਾ ਹੈ; F5 ਉਸਨੂੰ beginning ਤੋਂ ਸ਼ੁਰੂ ਕਰੇਗਾ।",
      "Beginning ਅਰਥਾਤ first slide ਤੋਂ presentation ਚਲਾਉਣ ਲਈ F5 ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ, ਜਦਕਿ Shift+F5 current slide ਲਈ ਹੈ।",
      "Currently selected slide ਤੋਂ show ਸ਼ੁਰੂ ਕਰਨ ਵਾਲਾ shortcut Shift+F5 ਹੈ, ਇਸ ਲਈ ਵਿਚਕਾਰਲੀ slide ਤੋਂ rehearsal ਲਈ ਇਹੀ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
      "F5 ਦਾ action slide show ਨੂੰ beginning ਤੋਂ launch ਕਰਨਾ ਹੈ; ਇਸ ਲਈ F5 — first slide ਸਹੀ shortcut-action pair ਹੈ।",
      "Shift+F5 ਦਾ action current slide ਤੋਂ show ਸ਼ੁਰੂ ਕਰਨਾ ਹੈ; ਇਹ F5 ਦੇ beginning ਵਾਲੇ action ਤੋਂ ਵੱਖਰਾ ਹੈ।",
      "PowerPoint ਵਿੱਚ first slide ਤੋਂ slide show start ਕਰਨਾ F5 key ਦਾ standard action ਹੈ।",
      "Beginning ਦੀ ਬਜਾਇ ਮੌਜੂਦਾ slide ਤੋਂ show ਚਲਾਉਣਾ ਹੋਵੇ ਤਾਂ Windows desktop PowerPoint ਵਿੱਚ Shift+F5 ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
      "Current slide ਦੀ ਬਜਾਇ ਸ਼ੁਰੂ ਤੋਂ show ਚਲਾਉਣ ਲਈ F5 ਦਬਾਇਆ ਜਾਂਦਾ ਹੈ; ਇਹ presentation ਨੂੰ first slide ਤੋਂ ਚਲਾਉਂਦਾ ਹੈ।",
      "F5 beginning ਤੋਂ ਅਤੇ Shift+F5 current slide ਤੋਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ, ਇਸ ਲਈ current-slide case ਵਿੱਚ Shift+F5 ਸਹੀ ਚੋਣ ਹੈ।",
    ]),
  }),
});

export function applyCom003LocalizationExplanationDiversityV2(
  items: readonly Com003LocalizedQuestionV2[],
  language: L,
): Com003LocalizedQuestionV2[] {
  const perQl = new Map<string, number>();
  return items.map((item) => {
    const ordinal = perQl.get(item.qlId) ?? 0;
    perQl.set(item.qlId, ordinal + 1);
    const override = EXPLANATION_DIVERSITY[item.qlId]?.[language]?.[ordinal];
    return override ? { ...item, explanation: override } : { ...item };
  });
}

export const COM003_LOCALIZATION_V2_EXPLANATION_DIVERSITY_AUTHORITY = Object.freeze({
  authorityId: "COM-003-LOCALIZATION-V2-EXPLANATION-DIVERSITY-1" as const,
  qlIds: Object.freeze(["COM-003-QL-011", "COM-003-QL-014", "COM-003-QL-017", "COM-003-QL-019"] as const),
  questionsPerQlPerLanguage: 12,
  languages: Object.freeze(["hi", "pa"] as const),
  purpose: "QUESTION_SPECIFIC_LOCALIZED_EXPLANATION_DIVERSITY" as const,
  governance: Object.freeze({
    changesSourceFacts: false,
    changesAnswers: false,
    changesOptions: false,
    changesStems: false,
    localizationReviewOnly: true,
    localizationFrozen: false,
    runtimeAuthorized: false,
  }),
});
