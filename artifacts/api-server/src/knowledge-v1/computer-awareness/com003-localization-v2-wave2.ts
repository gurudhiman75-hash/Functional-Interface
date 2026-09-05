import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import { lookupCom003OptionTranslationV1, type Com003LocalizationLanguageV2 } from "./com003-localization-translation-memory-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2, type Com003ReviewQuestionV162 } from "./com003-review-synthesis-v16-2";
import type { Com003LocalizedQuestionV2 } from "./com003-localization-v2-wave1";

const QLS = ["COM-003-QL-005","COM-003-QL-006","COM-003-QL-007","COM-003-QL-008","COM-003-QL-009"] as const;
type L = Com003LocalizationLanguageV2;
type T = { hi: string; pa: string };

const X: Record<string,T> = {
  "com003-word-replace-purpose": {hi:"Replace निर्दिष्ट टेक्स्ट को खोजकर उसकी जगह नया टेक्स्ट रखता है। केवल खोजने के लिए Find उपयोग होता है।",pa:"Replace ਨਿਰਧਾਰਤ ਟੈਕਸਟ ਨੂੰ ਲੱਭ ਕੇ ਉਸਦੀ ਥਾਂ ਨਵਾਂ ਟੈਕਸਟ ਰੱਖਦਾ ਹੈ। ਸਿਰਫ਼ ਲੱਭਣ ਲਈ Find ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"},
  "com003-word-spelling-check": {hi:"Spelling Check संभावित वर्तनी त्रुटियों की पहचान करता है ताकि उनकी समीक्षा की जा सके।",pa:"Spelling Check ਸੰਭਾਵਿਤ ਸ਼ਬਦ-ਜੋੜ ਗਲਤੀਆਂ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ ਤਾਂ ਜੋ ਉਨ੍ਹਾਂ ਦੀ ਸਮੀਖਿਆ ਕੀਤੀ ਜਾ ਸਕੇ।"},
  "com003-word-find-purpose": {hi:"Find निर्दिष्ट टेक्स्ट को खोजता है, लेकिन उसे बदलता नहीं है। टेक्स्ट बदलना हो तो Replace उपयोग किया जाता है।",pa:"Find ਨਿਰਧਾਰਤ ਟੈਕਸਟ ਨੂੰ ਲੱਭਦਾ ਹੈ ਪਰ ਉਸਨੂੰ ਬਦਲਦਾ ਨਹੀਂ। ਟੈਕਸਟ ਬਦਲਣਾ ਹੋਵੇ ਤਾਂ Replace ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"},
  "com003-word-autocorrect-purpose": {hi:"AutoCorrect कॉन्फ़िगर किए गए या सामान्य टाइपिंग और capitalization पैटर्न को स्वतः ठीक करता है।",pa:"AutoCorrect ਕੰਫਿਗਰ ਕੀਤੇ ਜਾਂ ਆਮ ਟਾਈਪਿੰਗ ਅਤੇ capitalization ਪੈਟਰਨਾਂ ਨੂੰ ਆਪਣੇ ਆਪ ਠੀਕ ਕਰਦਾ ਹੈ।"},
  "com003-word-grammar-check": {hi:"Grammar Check संभावित व्याकरण संबंधी समस्याओं की पहचान करता है ताकि उनकी समीक्षा की जा सके।",pa:"Grammar Check ਸੰਭਾਵਿਤ ਵਿਆਕਰਨਕ ਸਮੱਸਿਆਵਾਂ ਦੀ ਪਛਾਣ ਕਰਦਾ ਹੈ ਤਾਂ ਜੋ ਉਨ੍ਹਾਂ ਦੀ ਸਮੀਖਿਆ ਕੀਤੀ ਜਾ ਸਕੇ।"},
  "com003-word-footer-role": {hi:"Footer पेज के निचले मार्जिन क्षेत्र से संबंधित सामग्री रखता है।",pa:"Footer ਪੇਜ ਦੇ ਹੇਠਲੇ ਮਾਰਜਿਨ ਖੇਤਰ ਨਾਲ ਸੰਬੰਧਿਤ ਸਮੱਗਰੀ ਰੱਖਦਾ ਹੈ।"},
  "com003-word-header-role": {hi:"Header पेज के ऊपरी मार्जिन क्षेत्र से संबंधित सामग्री रखता है।",pa:"Header ਪੇਜ ਦੇ ਉੱਪਰਲੇ ਮਾਰਜਿਨ ਖੇਤਰ ਨਾਲ ਸੰਬੰਧਿਤ ਸਮੱਗਰੀ ਰੱਖਦਾ ਹੈ।"},
  "com003-word-landscape-orientation": {hi:"Landscape orientation में पेज की चौड़ाई उसकी ऊँचाई से अधिक होती है।",pa:"Landscape orientation ਵਿੱਚ ਪੇਜ ਦੀ ਚੌੜਾਈ ਉਸਦੀ ਉਚਾਈ ਨਾਲੋਂ ਵੱਧ ਹੁੰਦੀ ਹੈ।"},
  "com003-word-page-number-header-footer": {hi:"Word में Page Number को Header या Footer के हिस्से के रूप में डाला जा सकता है।",pa:"Word ਵਿੱਚ Page Number ਨੂੰ Header ਜਾਂ Footer ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਸ਼ਾਮਲ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"},
  "com003-word-portrait-orientation": {hi:"Portrait orientation में पेज की ऊँचाई उसकी चौड़ाई से अधिक होती है।",pa:"Portrait orientation ਵਿੱਚ ਪੇਜ ਦੀ ਉਚਾਈ ਉਸਦੀ ਚੌੜਾਈ ਨਾਲੋਂ ਵੱਧ ਹੁੰਦੀ ਹੈ।"},
  "com003-word-mail-merge-data-source": {hi:"Data Source Mail Merge के लिए प्राप्तकर्ता-विशिष्ट रिकॉर्ड या मान उपलब्ध कराता है।",pa:"Data Source Mail Merge ਲਈ ਪ੍ਰਾਪਤਕਰਤਾ-ਵਿਸ਼ੇਸ਼ ਰਿਕਾਰਡ ਜਾਂ ਮੁੱਲ ਮੁਹੱਈਆ ਕਰਦਾ ਹੈ।"},
  "com003-word-mail-merge-main-document": {hi:"Main Document में वह सामान्य टेक्स्ट और लेआउट रहता है जो सभी merged documents में साझा होता है।",pa:"Main Document ਵਿੱਚ ਉਹ ਸਾਂਝਾ ਟੈਕਸਟ ਅਤੇ layout ਹੁੰਦਾ ਹੈ ਜੋ ਸਾਰੇ merged documents ਵਿੱਚ ਇੱਕੋ ਜਿਹਾ ਰਹਿੰਦਾ ਹੈ।"},
  "com003-word-mail-merge-merge-field": {hi:"Merge Field Main Document में उस स्थान को चिन्हित करता है जहाँ Data Source से मान डाले जाते हैं।",pa:"Merge Field Main Document ਵਿੱਚ ਉਸ ਥਾਂ ਨੂੰ ਨਿਸ਼ਾਨਿਤ ਕਰਦਾ ਹੈ ਜਿੱਥੇ Data Source ਤੋਂ ਮੁੱਲ ਪਾਏ ਜਾਂਦੇ ਹਨ।"},
  "com003-word-mail-merge-purpose": {hi:"Mail Merge Main Document को recipient data से जोड़कर व्यक्तिगत documents तैयार करता है।",pa:"Mail Merge Main Document ਨੂੰ recipient data ਨਾਲ ਜੋੜ ਕੇ ਵਿਅਕਤੀਗਤ documents ਤਿਆਰ ਕਰਦਾ ਹੈ।"},
  "com003-word-mail-merge-recipient-record": {hi:"Recipient Record में किसी एक प्राप्तकर्ता या merged item के सभी field values होते हैं।",pa:"Recipient Record ਵਿੱਚ ਕਿਸੇ ਇੱਕ ਪ੍ਰਾਪਤਕਰਤਾ ਜਾਂ merged item ਦੇ ਸਾਰੇ field values ਹੁੰਦੇ ਹਨ।"},
  "com003-excel-address-row-part": {hi:"B7 में संख्या 7 Row Number बताती है, जबकि B Column Label बताता है।",pa:"B7 ਵਿੱਚ ਅੰਕ 7 Row Number ਦਰਸਾਉਂਦਾ ਹੈ, ਜਦਕਿ B Column Label ਦਰਸਾਉਂਦਾ ਹੈ।"},
  "com003-excel-range-notation": {hi:"A1:A5, A1 से A5 तक की लगातार cell range को दर्शाता है।",pa:"A1:A5, A1 ਤੋਂ A5 ਤੱਕ ਦੀ ਲਗਾਤਾਰ cell range ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।"},
  "com003-excel-structure-cell": {hi:"Excel में Row और Column का intersection Cell कहलाता है।",pa:"Excel ਵਿੱਚ Row ਅਤੇ Column ਦਾ intersection Cell ਕਹਾਉਂਦਾ ਹੈ।"},
  "com003-excel-address-column-part": {hi:"B7 में अक्षर B Column Label बताता है, जबकि 7 Row Number बताता है।",pa:"B7 ਵਿੱਚ ਅੱਖਰ B Column Label ਦਰਸਾਉਂਦਾ ਹੈ, ਜਦਕਿ 7 Row Number ਦਰਸਾਉਂਦਾ ਹੈ।"},
  "com003-excel-structure-column": {hi:"Excel worksheet में cells की vertical line को Column कहा जाता है।",pa:"Excel worksheet ਵਿੱਚ cells ਦੀ vertical line ਨੂੰ Column ਕਿਹਾ ਜਾਂਦਾ ਹੈ।"},
  "com003-excel-structure-workbook": {hi:"Workbook एक Excel file है जिसमें एक या अधिक Worksheets हो सकती हैं।",pa:"Workbook ਇੱਕ Excel file ਹੈ ਜਿਸ ਵਿੱਚ ਇੱਕ ਜਾਂ ਵੱਧ Worksheets ਹੋ ਸਕਦੀਆਂ ਹਨ।"},
  "com003-excel-structure-row": {hi:"Excel worksheet में cells की horizontal line को Row कहा जाता है।",pa:"Excel worksheet ਵਿੱਚ cells ਦੀ horizontal line ਨੂੰ Row ਕਿਹਾ ਜਾਂਦਾ ਹੈ।"},
  "com003-excel-structure-worksheet": {hi:"Worksheet, Workbook के अंदर Rows और Columns से बनी spreadsheet sheet होती है।",pa:"Worksheet, Workbook ਦੇ ਅੰਦਰ Rows ਅਤੇ Columns ਨਾਲ ਬਣੀ spreadsheet sheet ਹੁੰਦੀ ਹੈ।"},
  "com003-excel-address-composition": {hi:"Excel cell address में Column Label और Row Number दोनों होते हैं; B7 में B column और 7 row बताता है।",pa:"Excel cell address ਵਿੱਚ Column Label ਅਤੇ Row Number ਦੋਵੇਂ ਹੁੰਦੇ ਹਨ; B7 ਵਿੱਚ B column ਅਤੇ 7 row ਦਰਸਾਉਂਦਾ ਹੈ।"},
  "com003-excel-formula-equals": {hi:"Excel में Formula सामान्यतः equal sign (=) से शुरू होता है।",pa:"Excel ਵਿੱਚ Formula ਆਮ ਤੌਰ 'ਤੇ equal sign (=) ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।"},
  "com003-excel-operator-addition": {hi:"Excel Formula में addition के लिए + operator उपयोग किया जाता है।",pa:"Excel Formula ਵਿੱਚ addition ਲਈ + operator ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"},
  "com003-excel-operator-division": {hi:"Excel Formula में division के लिए / operator उपयोग किया जाता है।",pa:"Excel Formula ਵਿੱਚ division ਲਈ / operator ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"},
  "com003-excel-operator-subtraction": {hi:"Excel Formula में subtraction के लिए - operator उपयोग किया जाता है।",pa:"Excel Formula ਵਿੱਚ subtraction ਲਈ - operator ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"},
  "com003-excel-operator-multiplication": {hi:"Excel Formula में multiplication के लिए * operator उपयोग किया जाता है।",pa:"Excel Formula ਵਿੱਚ multiplication ਲਈ * operator ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"}
};

const OVERRIDE: Record<L,Record<string,string>> = {
  hi:{Find:"Find (खोजें)",Replace:"Replace (बदलें)","combines a column label with a row number, for example B7":"कॉलम लेबल और पंक्ति संख्या को मिलाकर, जैसे B7"},
  pa:{Find:"Find (ਖੋਜ)",Replace:"Replace (ਬਦਲੋ)","combines a column label with a row number, for example B7":"ਕਾਲਮ ਲੇਬਲ ਅਤੇ ਕਤਾਰ ਨੰਬਰ ਨੂੰ ਜੋੜ ਕੇ, ਜਿਵੇਂ B7"}
};

const NAME: Record<string,string> = {
  "com003-word-replace-purpose":"Replace","com003-word-spelling-check":"Spelling Check","com003-word-find-purpose":"Find",
  "com003-word-autocorrect-purpose":"AutoCorrect","com003-word-grammar-check":"Grammar Check"
};
const PURPOSE: Record<string,T> = {
  "com003-word-spelling-check":{hi:"संभावित वर्तनी त्रुटियों की पहचान करने",pa:"ਸੰਭਾਵਿਤ ਸ਼ਬਦ-ਜੋੜ ਗਲਤੀਆਂ ਦੀ ਪਛਾਣ ਕਰਨ"},
  "com003-word-find-purpose":{hi:"निर्दिष्ट टेक्स्ट को बिना बदले खोजने",pa:"ਨਿਰਧਾਰਤ ਟੈਕਸਟ ਨੂੰ ਬਿਨਾਂ ਬਦਲੇ ਲੱਭਣ"},
  "com003-word-grammar-check":{hi:"संभावित व्याकरण संबंधी समस्याओं की पहचान करने",pa:"ਸੰਭਾਵਿਤ ਵਿਆਕਰਨਕ ਸਮੱਸਿਆਵਾਂ ਦੀ ਪਛਾਣ ਕਰਨ"}
};

function pickOption(lang:L, english:string) {
  if (OVERRIDE[lang][english]) return OVERRIDE[lang][english]!;
  const m=lookupCom003OptionTranslationV1(lang,english);
  if(m.status!=="UNIQUE"||!m.selected) throw new Error(`COM003 W2 option ${lang}:${english}:${m.status}`);
  return m.selected;
}
function q5(q:Com003ReviewQuestionV162,lang:L){
  const n=NAME[q.targetFactId]!;
  if(q.surfaceMode==="PURPOSE_FROM_FEATURE"){
    if(q.examSurfaceFamily==="DIRECT_RECALL") return lang==="hi"?`Microsoft Word में ${n} का उपयोग किस कार्य के लिए किया जाता है?`:`Microsoft Word ਵਿੱਚ ${n} ਦੀ ਵਰਤੋਂ ਕਿਸ ਕੰਮ ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ?`;
    if(q.examSurfaceFamily==="FUNCTIONAL_APPLICATION") return lang==="hi"?`Microsoft Word में ${n} किस काम के लिए उपयोग होता है?`:`Microsoft Word ਵਿੱਚ ${n} ਕਿਸ ਕੰਮ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`;
    if(q.examSurfaceFamily==="EXAMPLE_RECOGNITION") return lang==="hi"?`Microsoft Word में ${n} क्या करता है?`:`Microsoft Word ਵਿੱਚ ${n} ਕੀ ਕਰਦਾ ਹੈ?`;
    return lang==="hi"?`Microsoft Word में ${n} का मुख्य कार्य क्या है?`:`Microsoft Word ਵਿੱਚ ${n} ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?`;
  }
  const p=PURPOSE[q.targetFactId]![lang];
  if(q.examSurfaceFamily==="DIRECT_RECALL") return lang==="hi"?`Microsoft Word में ${p} के लिए कौन-सी सुविधा उपयोग की जाती है?`:`Microsoft Word ਵਿੱਚ ${p} ਲਈ ਕਿਹੜੀ ਸੁਵਿਧਾ ਵਰਤੀ ਜਾਂਦੀ ਹੈ?`;
  if(q.examSurfaceFamily==="FUNCTIONAL_APPLICATION") return lang==="hi"?`यदि Word में ${p} की आवश्यकता हो, तो कौन-सी सुविधा उपयोग करेंगे?`:`ਜੇ Word ਵਿੱਚ ${p} ਦੀ ਲੋੜ ਹੋਵੇ, ਤਾਂ ਕਿਹੜੀ ਸੁਵਿਧਾ ਵਰਤੋਗੇ?`;
  return lang==="hi"?`${p} वाली Word सुविधा कौन-सी है?`:`${p} ਵਾਲੀ Word ਸੁਵਿਧਾ ਕਿਹੜੀ ਹੈ?`;
}
function q6(q:Com003ReviewQuestionV162,lang:L){
  const hi=lang==="hi", f=q.examSurfaceFamily;
  switch(q.targetFactId){
    case "com003-word-footer-role":
      if(f==="DIRECT_RECALL") return hi?"Word पेज के निचले मार्जिन क्षेत्र से संबंधित पेज एलिमेंट कौन-सा है?":"Word ਪੇਜ ਦੇ ਹੇਠਲੇ ਮਾਰਜਿਨ ਖੇਤਰ ਨਾਲ ਸੰਬੰਧਿਤ ਪੇਜ ਐਲੀਮੈਂਟ ਕਿਹੜਾ ਹੈ?";
      if(f==="FUNCTIONAL_APPLICATION") return hi?"हर पेज के निचले मार्जिन क्षेत्र में सामग्री रखनी हो, तो Word में कौन-सा पेज एलिमेंट उपयोग करेंगे?":"ਹਰ ਪੇਜ ਦੇ ਹੇਠਲੇ ਮਾਰਜਿਨ ਖੇਤਰ ਵਿੱਚ ਸਮੱਗਰੀ ਰੱਖਣੀ ਹੋਵੇ, ਤਾਂ Word ਵਿੱਚ ਕਿਹੜਾ ਪੇਜ ਐਲੀਮੈਂਟ ਵਰਤੋਗੇ?";
      if(f==="EXAMPLE_RECOGNITION") return hi?"Word पेज के निचले मार्जिन में रखी सामग्री किस पेज एलिमेंट का उदाहरण है?":"Word ਪੇਜ ਦੇ ਹੇਠਲੇ ਮਾਰਜਿਨ ਵਿੱਚ ਰੱਖੀ ਸਮੱਗਰੀ ਕਿਹੜੇ ਪੇਜ ਐਲੀਮੈਂਟ ਦੀ ਉਦਾਹਰਨ ਹੈ?";
      return hi?"Word पेज के ऊपर नहीं बल्कि नीचे वाले भाग से संबंधित पेज एलिमेंट कौन-सा है?":"Word ਪੇਜ ਦੇ ਉੱਪਰ ਨਹੀਂ ਸਗੋਂ ਹੇਠਲੇ ਹਿੱਸੇ ਨਾਲ ਸੰਬੰਧਿਤ ਪੇਜ ਐਲੀਮੈਂਟ ਕਿਹੜਾ ਹੈ?";
    case "com003-word-header-role": return f==="DIRECT_RECALL"?(hi?"Word पेज के ऊपरी मार्जिन क्षेत्र से संबंधित पेज एलिमेंट कौन-सा है?":"Word ਪੇਜ ਦੇ ਉੱਪਰਲੇ ਮਾਰਜਿਨ ਖੇਤਰ ਨਾਲ ਸੰਬੰਧਿਤ ਪੇਜ ਐਲੀਮੈਂਟ ਕਿਹੜਾ ਹੈ?"):(hi?"Word पेज के ऊपरी मार्जिन में रखी सामग्री किस पेज एलिमेंट का उदाहरण है?":"Word ਪੇਜ ਦੇ ਉੱਪਰਲੇ ਮਾਰਜਿਨ ਵਿੱਚ ਰੱਖੀ ਸਮੱਗਰੀ ਕਿਹੜੇ ਪੇਜ ਐਲੀਮੈਂਟ ਦੀ ਉਦਾਹਰਨ ਹੈ?");
    case "com003-word-page-number-header-footer": return f==="FUNCTIONAL_APPLICATION"?(hi?"Word के Header या Footer में इनमें से कौन-सी चीज़ डाली जा सकती है?":"Word ਦੇ Header ਜਾਂ Footer ਵਿੱਚ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕੀ ਸ਼ਾਮਲ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?"):(hi?"Microsoft Word में Header या Footer के हिस्से के रूप में कौन-सा पेज एलिमेंट डाला जा सकता है?":"Microsoft Word ਵਿੱਚ Header ਜਾਂ Footer ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਕਿਹੜਾ ਪੇਜ ਐਲੀਮੈਂਟ ਸ਼ਾਮਲ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?");
    case "com003-word-portrait-orientation": return f==="FUNCTIONAL_APPLICATION"?(hi?"यदि पेज की ऊँचाई उसकी चौड़ाई से अधिक हो, तो उसका orientation क्या कहलाता है?":"ਜੇ ਪੇਜ ਦੀ ਉਚਾਈ ਉਸਦੀ ਚੌੜਾਈ ਨਾਲੋਂ ਵੱਧ ਹੋਵੇ, ਤਾਂ ਉਸਦਾ orientation ਕੀ ਕਹਾਉਂਦਾ ਹੈ?"):(hi?"जब पेज की ऊँचाई उसकी चौड़ाई से अधिक हो, तो कौन-सा page orientation उपयोग होता है?":"ਜਦੋਂ ਪੇਜ ਦੀ ਉਚਾਈ ਉਸਦੀ ਚੌੜਾਈ ਨਾਲੋਂ ਵੱਧ ਹੋਵੇ, ਤਾਂ ਕਿਹੜਾ page orientation ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?");
    case "com003-word-landscape-orientation": return f==="DIRECT_RECALL"?(hi?"जब पेज की चौड़ाई उसकी ऊँचाई से अधिक हो, तो Word में कौन-सा orientation होता है?":"ਜਦੋਂ ਪੇਜ ਦੀ ਚੌੜਾਈ ਉਸਦੀ ਉਚਾਈ ਨਾਲੋਂ ਵੱਧ ਹੋਵੇ, ਤਾਂ Word ਵਿੱਚ ਕਿਹੜਾ orientation ਹੁੰਦਾ ਹੈ?"):(hi?"जब पेज की चौड़ाई उसकी ऊँचाई से अधिक हो, तो कौन-सा page orientation उपयोग होता है?":"ਜਦੋਂ ਪੇਜ ਦੀ ਚੌੜਾਈ ਉਸਦੀ ਉਚਾਈ ਨਾਲੋਂ ਵੱਧ ਹੋਵੇ, ਤਾਂ ਕਿਹੜਾ page orientation ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?");
  }
  throw new Error(`COM003 W2 q6:${q.targetFactId}`);
}
function q7(q:Com003ReviewQuestionV162,lang:L,ordinal:number){
  const hi=lang==="hi", f=q.examSurfaceFamily;
  switch(q.targetFactId){
    case "com003-word-mail-merge-data-source": return f==="DIRECT_RECALL"?(hi?"Mail Merge में प्राप्तकर्ताओं के रिकॉर्ड या उनके मान उपलब्ध कराने वाला घटक कौन-सा है?":"Mail Merge ਵਿੱਚ ਪ੍ਰਾਪਤਕਰਤਾਵਾਂ ਦੇ ਰਿਕਾਰਡ ਜਾਂ ਉਨ੍ਹਾਂ ਦੇ ਮੁੱਲ ਮੁਹੱਈਆ ਕਰਨ ਵਾਲਾ ਭਾਗ ਕਿਹੜਾ ਹੈ?"):(f==="EXAMPLE_RECOGNITION"?(hi?"Microsoft Word के Mail Merge में प्राप्तकर्ता रिकॉर्ड उपलब्ध कराने वाला घटक कौन-सा है?":"Microsoft Word ਦੇ Mail Merge ਵਿੱਚ recipient records ਮੁਹੱਈਆ ਕਰਨ ਵਾਲਾ ਭਾਗ ਕਿਹੜਾ ਹੈ?"):(hi?"Mail Merge के दौरान उपयोग होने वाले प्राप्तकर्ता रिकॉर्ड किस घटक से मिलते हैं?":"Mail Merge ਦੌਰਾਨ ਵਰਤੇ ਜਾਣ ਵਾਲੇ recipient records ਕਿਸ ਭਾਗ ਤੋਂ ਮਿਲਦੇ ਹਨ?"));
    case "com003-word-mail-merge-main-document": return hi?"Mail Merge में सभी merged documents के लिए समान टेक्स्ट और लेआउट किस घटक में रहता है?":"Mail Merge ਵਿੱਚ ਸਾਰੇ merged documents ਲਈ ਸਾਂਝਾ ਟੈਕਸਟ ਅਤੇ layout ਕਿਸ ਭਾਗ ਵਿੱਚ ਹੁੰਦਾ ਹੈ?";
    case "com003-word-mail-merge-merge-field": return f==="DIRECT_RECALL"?(hi?"Mail Merge में Data Source के मान Main Document में कहाँ डाले जाएँगे, यह कौन-सा घटक दर्शाता है?":"Mail Merge ਵਿੱਚ Data Source ਦੇ ਮੁੱਲ Main Document ਵਿੱਚ ਕਿੱਥੇ ਪਾਏ ਜਾਣਗੇ, ਇਹ ਕਿਹੜਾ ਭਾਗ ਦਰਸਾਉਂਦਾ ਹੈ?"):(hi?"Mail Merge में Data Source के मान Main Document में डालने की जगह को कौन-सा घटक चिन्हित करता है?":"Mail Merge ਵਿੱਚ Data Source ਦੇ ਮੁੱਲ Main Document ਵਿੱਚ ਪਾਉਣ ਦੀ ਥਾਂ ਨੂੰ ਕਿਹੜਾ ਭਾਗ ਨਿਸ਼ਾਨਿਤ ਕਰਦਾ ਹੈ?");
    case "com003-word-mail-merge-purpose": return f==="FUNCTIONAL_APPLICATION"?(hi?"कौन-सी Word सुविधा Main Document को प्राप्तकर्ता डेटा के साथ मिलाकर व्यक्तिगत दस्तावेज़ तैयार करती है?":"ਕਿਹੜੀ Word ਸੁਵਿਧਾ Main Document ਨੂੰ recipient data ਨਾਲ ਜੋੜ ਕੇ ਵਿਅਕਤੀਗਤ ਦਸਤਾਵੇਜ਼ ਬਣਾਉਂਦੀ ਹੈ?"):(hi?"Main Document और प्राप्तकर्ता डेटा को जोड़कर व्यक्तिगत दस्तावेज़ बनाने वाली Word सुविधा कौन-सी है?":"Main Document ਅਤੇ recipient data ਨੂੰ ਜੋੜ ਕੇ ਵਿਅਕਤੀਗਤ ਦਸਤਾਵੇਜ਼ ਬਣਾਉਣ ਵਾਲੀ Word ਸੁਵਿਧਾ ਕਿਹੜੀ ਹੈ?");
    case "com003-word-mail-merge-recipient-record":
      if(f==="FUNCTIONAL_APPLICATION") return hi?"Microsoft Word के Mail Merge में एक प्राप्तकर्ता के सभी मान किस घटक में होते हैं?":"Microsoft Word ਦੇ Mail Merge ਵਿੱਚ ਇੱਕ ਪ੍ਰਾਪਤਕਰਤਾ ਦੇ ਸਾਰੇ ਮੁੱਲ ਕਿਸ ਭਾਗ ਵਿੱਚ ਹੁੰਦੇ ਹਨ?";
      if(f==="EXAMPLE_RECOGNITION") return hi?"एक प्राप्तकर्ता से जुड़े फ़ील्ड मानों का पूरा सेट Mail Merge में क्या कहलाता है?":"ਇੱਕ ਪ੍ਰਾਪਤਕਰਤਾ ਨਾਲ ਸੰਬੰਧਿਤ field values ਦਾ ਪੂਰਾ ਸੈੱਟ Mail Merge ਵਿੱਚ ਕੀ ਕਹਾਉਂਦਾ ਹੈ?";
      return ordinal%2===0?(hi?"Mail Merge में केवल एक प्राप्तकर्ता के मान रखने वाला घटक कौन-सा है?":"Mail Merge ਵਿੱਚ ਸਿਰਫ਼ ਇੱਕ ਪ੍ਰਾਪਤਕਰਤਾ ਦੇ ਮੁੱਲ ਰੱਖਣ ਵਾਲਾ ਭਾਗ ਕਿਹੜਾ ਹੈ?"):(hi?"Mail Merge में किसी एक प्राप्तकर्ता के फ़ील्ड मानों के पूरे समूह को क्या कहते हैं?":"Mail Merge ਵਿੱਚ ਕਿਸੇ ਇੱਕ ਪ੍ਰਾਪਤਕਰਤਾ ਦੇ field values ਦੇ ਪੂਰੇ ਸਮੂਹ ਨੂੰ ਕੀ ਕਹਿੰਦੇ ਹਨ?");
  }
  throw new Error(`COM003 W2 q7:${q.targetFactId}`);
}
function q8(q:Com003ReviewQuestionV162,lang:L){
  const hi=lang==="hi", f=q.examSurfaceFamily;
  switch(q.targetFactId){
    case "com003-excel-address-row-part": return f==="DIRECT_RECALL"?(hi?"Excel के cell reference B7 में संख्या 7 क्या दर्शाती है?":"Excel ਦੇ cell reference B7 ਵਿੱਚ ਅੰਕ 7 ਕੀ ਦਰਸਾਉਂਦਾ ਹੈ?"):(hi?"Reference B7 में Row की पहचान कौन करता है—B या 7?":"Reference B7 ਵਿੱਚ Row ਦੀ ਪਛਾਣ ਕੌਣ ਕਰਦਾ ਹੈ—B ਜਾਂ 7?");
    case "com003-excel-range-notation": return hi?"A1 से A5 तक लगातार cell range को Excel में किस रूप में लिखा जाता है?":"A1 ਤੋਂ A5 ਤੱਕ ਲਗਾਤਾਰ cell range ਨੂੰ Excel ਵਿੱਚ ਕਿਵੇਂ ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ?";
    case "com003-excel-structure-cell": return hi?"Excel में Row और Column के मिलने वाले स्थान को क्या कहा जाता है?":"Excel ਵਿੱਚ Row ਅਤੇ Column ਦੇ ਮਿਲਣ ਵਾਲੇ ਸਥਾਨ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?";
    case "com003-excel-address-column-part": return hi?"Excel reference B7 में अक्षर B किस coordinate को दर्शाता है?":"Excel reference B7 ਵਿੱਚ ਅੱਖਰ B ਕਿਹੜੇ coordinate ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ?";
    case "com003-excel-structure-column": return hi?"Excel worksheet में cells की vertical line को क्या कहा जाता है?":"Excel worksheet ਵਿੱਚ cells ਦੀ vertical ਲਾਈਨ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?";
    case "com003-excel-structure-workbook": return hi?"Excel की वह file जिसमें एक या अधिक Worksheets हो सकती हैं, क्या कहलाती है?":"Excel ਦੀ ਉਹ file ਜਿਸ ਵਿੱਚ ਇੱਕ ਜਾਂ ਵੱਧ Worksheets ਹੋ ਸਕਦੀਆਂ ਹਨ, ਕੀ ਕਹਾਉਂਦੀ ਹੈ?";
    case "com003-excel-structure-row": return f==="EXAMPLE_RECOGNITION"?(hi?"Excel worksheet में cells की horizontal line को क्या कहा जाता है?":"Excel worksheet ਵਿੱਚ cells ਦੀ horizontal ਲਾਈਨ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?"):(hi?"Microsoft Excel में cells की horizontal line किस नाम से जानी जाती है?":"Microsoft Excel ਵਿੱਚ cells ਦੀ horizontal ਲਾਈਨ ਕਿਸ ਨਾਮ ਨਾਲ ਜਾਣੀ ਜਾਂਦੀ ਹੈ?");
    case "com003-excel-structure-worksheet": return hi?"Workbook के अंदर Rows और Columns से बनी sheet को Excel में क्या कहा जाता है?":"Workbook ਦੇ ਅੰਦਰ Rows ਅਤੇ Columns ਨਾਲ ਬਣੀ sheet ਨੂੰ Excel ਵਿੱਚ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?";
    case "com003-excel-address-composition": return f==="EXAMPLE_RECOGNITION"?(hi?"Excel में cell address किस प्रकार बनाया जाता है?":"Excel ਵਿੱਚ cell address ਕਿਵੇਂ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ?"):(hi?"Microsoft Excel में किसी cell का address लिखने का सही तरीका क्या है?":"Microsoft Excel ਵਿੱਚ ਕਿਸੇ cell ਦਾ address ਲਿਖਣ ਦਾ ਸਹੀ ਢੰਗ ਕੀ ਹੈ?");
  }
  throw new Error(`COM003 W2 q8:${q.targetFactId}`);
}
function q9(q:Com003ReviewQuestionV162,lang:L){
  const hi=lang==="hi", f=q.examSurfaceFamily;
  if(q.targetFactId==="com003-excel-formula-equals"){
    if(f==="DIRECT_RECALL") return hi?"Excel Formula सामान्यतः किस चिन्ह से शुरू होता है?":"Excel Formula ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜੇ ਚਿੰਨ੍ਹ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ?";
    if(f==="FUNCTIONAL_APPLICATION") return hi?"Excel Formula की शुरुआत सामान्यतः किस चिन्ह से होती है?":"Excel Formula ਦੀ ਸ਼ੁਰੂਆਤ ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜੇ ਚਿੰਨ੍ਹ ਨਾਲ ਹੁੰਦੀ ਹੈ?";
    return hi?"Excel Formula लिखते समय सबसे पहले कौन-सा चिन्ह टाइप किया जाता है?":"Excel Formula ਲਿਖਦੇ ਸਮੇਂ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਟਾਈਪ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?";
  }
  const op:Record<string,T>={
    "com003-excel-operator-addition":{hi:"जोड़",pa:"ਜੋੜ"},"com003-excel-operator-subtraction":{hi:"घटाव",pa:"ਘਟਾਓ"},
    "com003-excel-operator-multiplication":{hi:"गुणा",pa:"ਗੁਣਾ"},"com003-excel-operator-division":{hi:"भाग",pa:"ਭਾਗ"}
  };
  const word=op[q.targetFactId]![lang];
  if(f==="DIRECT_RECALL") return hi?`Excel Formula में ${word} के लिए कौन-सा चिन्ह उपयोग किया जाता है?`:`Excel Formula ਵਿੱਚ ${word} ਲਈ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`;
  if(f==="FUNCTIONAL_APPLICATION") return hi?`Excel में ${word} के लिए कौन-सा चिन्ह उपयोग होता है?`:`Excel ਵਿੱਚ ${word} ਲਈ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`;
  if(f==="EXAMPLE_RECOGNITION") return hi?`Excel में ${word} करने वाला operator कौन-सा है?`:`Excel ਵਿੱਚ ${word} ਕਰਨ ਵਾਲਾ operator ਕਿਹੜਾ ਹੈ?`;
  return hi?`Excel में ${word} के लिए कौन-सा arithmetic operator उपयोग किया जाता है?`:`Excel ਵਿੱਚ ${word} ਲਈ ਕਿਹੜਾ arithmetic operator ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?`;
}
function stem(q:Com003ReviewQuestionV162,lang:L,ordinal:number){
  if(q.qlId==="COM-003-QL-005") return q5(q,lang);
  if(q.qlId==="COM-003-QL-006") return q6(q,lang);
  if(q.qlId==="COM-003-QL-007") return q7(q,lang,ordinal);
  if(q.qlId==="COM-003-QL-008") return q8(q,lang);
  if(q.qlId==="COM-003-QL-009") return q9(q,lang);
  throw new Error(`COM003 W2 ql:${q.qlId}`);
}

const EN=COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter(q=>(QLS as readonly string[]).includes(q.qlId));
function build(lang:L):readonly Com003LocalizedQuestionV2[]{
  const seen=new Map<string,number>();
  return Object.freeze(EN.map((q,i)=>{
    const key=`${q.targetFactId}:${q.examSurfaceFamily}`, ordinal=seen.get(key)??0; seen.set(key,ordinal+1);
    const options=q.options.map(o=>pickOption(lang,o)), explanation=X[q.targetFactId]?.[lang];
    if(!explanation) throw new Error(`COM003 W2 explanation ${q.targetFactId}`);
    return {
      localizationId:`COM003-LOC-V2-W2-${lang.toUpperCase()}-${String(i+1).padStart(3,"0")}`,sourceQuestionId:q.questionId,
      sourceEnglishAuthorityId:COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,qlId:q.qlId,cpId:q.cpId,examSurfaceFamily:q.examSurfaceFamily,
      surfaceMode:q.surfaceMode,targetFactId:q.targetFactId,language:lang,locale:lang==="hi"?"hi-IN":"pa-IN",stem:stem(q,lang,ordinal),options,
      correctIndex:q.correctIndex,canonicalAnswer:options[q.correctIndex]!,explanation,sourceIds:[...q.sourceIds],sourceFactIds:[...q.sourceFactIds],
      versionScoped:q.versionScoped,solverAuthority:q.solverAuthority,sourceEnglishFrozen:true,localizationReviewOnly:true,localizationFrozen:false,
      runtimeRegistered:false,productionReleased:false
    };
  }));
}
export const COM003_HINDI_LOCALIZATION_V2_WAVE2=build("hi");
export const COM003_PUNJABI_LOCALIZATION_V2_WAVE2=build("pa");
export const COM003_LOCALIZATION_V2_WAVE2_AUTHORITY=Object.freeze({
  authorityId:"COM-003-LOCALIZATION-V2-WAVE2-CANDIDATE-1" as const,chapterCode:"COM-003" as const,chapterTitle:"Office & Productivity Software" as const,
  sourceEnglishAuthorityId:COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,sourceEnglishCorpus:"COM003_ENGLISH_REVIEW_CORPUS_V16_2" as const,
  qlIds:QLS,qlCount:5,englishQuestionCount:EN.length,hindiQuestionCount:COM003_HINDI_LOCALIZATION_V2_WAVE2.length,
  punjabiQuestionCount:COM003_PUNJABI_LOCALIZATION_V2_WAVE2.length,localizedQuestionCount:120,questionsPerQlPerLanguage:12,
  governance:Object.freeze({localizationReviewOnly:true,localizationFrozen:false,questionStudioRuntimeAuthorized:false,questionBankWritesAuthorized:false,
    testEligibilityAuthorized:false,mockTestEligibilityAuthorized:false,automaticPublicationAuthorized:false,publiclyPublishable:false,productionReleased:false}),
  nextGate:"COM003_LOCALIZATION_V2_WAVE2_HUMAN_REVIEW" as const
});