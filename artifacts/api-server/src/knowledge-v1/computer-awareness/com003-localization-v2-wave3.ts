import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import { lookupCom003OptionTranslationV1, type Com003LocalizationLanguageV2 } from "./com003-localization-translation-memory-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2, type Com003ReviewQuestionV162 } from "./com003-review-synthesis-v16-2";
import type { Com003LocalizedQuestionV2 } from "./com003-localization-v2-wave1";

type L = Com003LocalizationLanguageV2;
type T = { hi: string; pa: string };

const QLS = ["COM-003-QL-010","COM-003-QL-011","COM-003-QL-012","COM-003-QL-013","COM-003-QL-014"] as const;

const STEMS: Record<string, { hi: readonly string[]; pa: readonly string[] }> = {
  "COM-003-QL-010": {
    hi: [
      "Excel में AutoSum सामान्यतः कौन-सा फ़ंक्शन insert करता है?",
      "कौन-सा Excel फ़ंक्शन संख्यात्मक मानों का अंकगणितीय माध्य लौटाता है?",
      "दिए गए set या range में सबसे बड़ा संख्यात्मक मान लौटाने के लिए Excel में कौन-सा फ़ंक्शन प्रयोग किया जाता है?",
      "Excel में किसी range का सबसे छोटा मान प्राप्त करने के लिए कौन-सा फ़ंक्शन उपयोग होता है?",
      "Microsoft Excel में cells या ranges के संख्यात्मक मान जोड़ने के लिए कौन-सा फ़ंक्शन है?",
      "कौन-सा Excel फ़ंक्शन संख्या वाले cells की गिनती करता है?",
      "Excel में केवल numeric entries वाले cells गिनने के लिए कौन-सा फ़ंक्शन उपयुक्त है?",
      "Microsoft Excel में numbers का औसत निकालने वाला फ़ंक्शन कौन-सा है?",
      "किस Excel फ़ंक्शन का उपयोग numbers वाले cells की संख्या जानने के लिए किया जाता है?",
      "Excel में numeric cells की count प्राप्त करने के लिए कौन-सा फ़ंक्शन चुना जाएगा?",
      "Microsoft Excel में किसी range का न्यूनतम मान लौटाने वाला फ़ंक्शन कौन-सा है?",
      "दिए गए numbers का average निकालने के लिए Excel में कौन-सा फ़ंक्शन प्रयोग किया जाता है?",
    ],
    pa: [
      "Excel ਵਿੱਚ AutoSum ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜਾ ਫੰਕਸ਼ਨ insert ਕਰਦਾ ਹੈ?",
      "ਕਿਹੜਾ Excel ਫੰਕਸ਼ਨ ਅੰਕੀ ਮੁੱਲਾਂ ਦਾ ਅੰਕਗਣਿਤੀ ਔਸਤ ਵਾਪਸ ਕਰਦਾ ਹੈ?",
      "ਦਿੱਤੇ set ਜਾਂ range ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ ਅੰਕੀ ਮੁੱਲ ਵਾਪਸ ਕਰਨ ਲਈ Excel ਵਿੱਚ ਕਿਹੜਾ ਫੰਕਸ਼ਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "Excel ਵਿੱਚ ਕਿਸੇ range ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ਲੈਣ ਲਈ ਕਿਹੜਾ ਫੰਕਸ਼ਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "Microsoft Excel ਵਿੱਚ cells ਜਾਂ ranges ਦੇ ਅੰਕੀ ਮੁੱਲ ਜੋੜਨ ਲਈ ਕਿਹੜਾ ਫੰਕਸ਼ਨ ਹੈ?",
      "ਕਿਹੜਾ Excel ਫੰਕਸ਼ਨ numbers ਵਾਲੇ cells ਦੀ ਗਿਣਤੀ ਕਰਦਾ ਹੈ?",
      "Excel ਵਿੱਚ ਸਿਰਫ਼ numeric entries ਵਾਲੇ cells ਗਿਣਨ ਲਈ ਕਿਹੜਾ ਫੰਕਸ਼ਨ ਠੀਕ ਹੈ?",
      "Microsoft Excel ਵਿੱਚ numbers ਦਾ ਔਸਤ ਕੱਢਣ ਵਾਲਾ ਫੰਕਸ਼ਨ ਕਿਹੜਾ ਹੈ?",
      "numbers ਵਾਲੇ cells ਦੀ ਗਿਣਤੀ ਜਾਣਨ ਲਈ ਕਿਹੜਾ Excel ਫੰਕਸ਼ਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "Excel ਵਿੱਚ numeric cells ਦੀ count ਲੈਣ ਲਈ ਕਿਹੜਾ ਫੰਕਸ਼ਨ ਚੁਣਿਆ ਜਾਵੇਗਾ?",
      "Microsoft Excel ਵਿੱਚ ਕਿਸੇ range ਦਾ ਘੱਟੋ-ਘੱਟ ਮੁੱਲ ਵਾਪਸ ਕਰਨ ਵਾਲਾ ਫੰਕਸ਼ਨ ਕਿਹੜਾ ਹੈ?",
      "ਦਿੱਤੇ numbers ਦਾ average ਕੱਢਣ ਲਈ Excel ਵਿੱਚ ਕਿਹੜਾ ਫੰਕਸ਼ਨ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    ],
  },
  "COM-003-QL-011": {
    hi: [
      "Excel में formula copy करने पर कौन-सा cell reference अपनी जगह पर स्थिर रहता है?",
      "पूरी तरह absolute cell reference का सही notation कौन-सा है?",
      "Formula copy करने पर नया स्थान मिलने के अनुसार कौन-सा cell reference बदल जाता है?",
      "Copied formula में किसी cell reference को fixed रखना हो तो किस reference type का उपयोग करना चाहिए?",
      "Cell A1 की column और row दोनों को lock करने के लिए कौन-सा notation सही है?",
      "Formula copy होने पर reference को नए स्थान के अनुसार adjust होना चाहिए। कौन-सा reference type चाहिए?",
      "Copy करने पर जो cell reference नहीं बदलता, वह किस प्रकार का reference है?",
      "निम्न में से fully absolute Excel cell reference का उदाहरण कौन-सा है?",
      "Formula copy करने पर बदलने वाला cell reference किस प्रकार का होता है?",
      "Relative reference के विपरीत, copy करने पर कौन-सा Excel reference fixed रहता है?",
      "कौन-सा notation column और row दोनों को lock करता है?",
      "Excel में किस reference notation में column और row दोनों fixed होते हैं?",
    ],
    pa: [
      "Excel ਵਿੱਚ formula copy ਕਰਨ 'ਤੇ ਕਿਹੜਾ cell reference ਆਪਣੀ ਥਾਂ 'ਤੇ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ?",
      "ਪੂਰੀ ਤਰ੍ਹਾਂ absolute cell reference ਦਾ ਸਹੀ notation ਕਿਹੜਾ ਹੈ?",
      "Formula copy ਕਰਨ 'ਤੇ ਨਵੀਂ ਥਾਂ ਅਨੁਸਾਰ ਕਿਹੜਾ cell reference ਬਦਲ ਜਾਂਦਾ ਹੈ?",
      "Copied formula ਵਿੱਚ ਕਿਸੇ cell reference ਨੂੰ fixed ਰੱਖਣਾ ਹੋਵੇ ਤਾਂ ਕਿਹੜਾ reference type ਵਰਤਣਾ ਚਾਹੀਦਾ ਹੈ?",
      "Cell A1 ਦੀ column ਅਤੇ row ਦੋਵੇਂ lock ਕਰਨ ਲਈ ਕਿਹੜਾ notation ਸਹੀ ਹੈ?",
      "Formula copy ਹੋਣ 'ਤੇ reference ਨੂੰ ਨਵੀਂ ਥਾਂ ਅਨੁਸਾਰ adjust ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਕਿਹੜਾ reference type ਚਾਹੀਦਾ ਹੈ?",
      "Copy ਕਰਨ 'ਤੇ ਜੋ cell reference ਨਹੀਂ ਬਦਲਦਾ, ਉਹ ਕਿਹੜੀ ਕਿਸਮ ਦਾ reference ਹੈ?",
      "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ fully absolute Excel cell reference ਦਾ ਉਦਾਹਰਨ ਕਿਹੜਾ ਹੈ?",
      "Formula copy ਕਰਨ 'ਤੇ ਬਦਲਣ ਵਾਲਾ cell reference ਕਿਹੜੀ ਕਿਸਮ ਦਾ ਹੁੰਦਾ ਹੈ?",
      "Relative reference ਦੇ ਉਲਟ, copy ਕਰਨ 'ਤੇ ਕਿਹੜਾ Excel reference fixed ਰਹਿੰਦਾ ਹੈ?",
      "ਕਿਹੜਾ notation column ਅਤੇ row ਦੋਵੇਂ ਨੂੰ lock ਕਰਦਾ ਹੈ?",
      "Excel ਵਿੱਚ ਕਿਹੜੇ reference notation ਵਿੱਚ column ਅਤੇ row ਦੋਵੇਂ fixed ਹੁੰਦੇ ਹਨ?",
    ],
  },
  "COM-003-QL-012": {
    hi: [
      "Excel में selected source cells के pattern या values के आधार पर adjacent cells भरने वाली feature कौन-सी है?",
      "Excel में values को छोटे से बड़े या A से Z क्रम में लगाने वाला sort order कौन-सा है?",
      "Excel में values को बड़े से छोटे या Z से A क्रम में लगाने वाला sort order कौन-सा है?",
      "Excel में Fill Handle का मुख्य उपयोग क्या है?",
      "Excel में Filter का क्या काम है?",
      "Microsoft Excel में pattern के अनुसार पास के cells भरने के लिए कौन-सी feature उपयोग होती है?",
      "Excel में चुनी हुई criteria के अनुसार rows दिखाने और बाकी rows छिपाने के लिए क्या उपयोग किया जाता है?",
      "Excel में Ascending Sort क्या करता है?",
      "Selected cells के pattern को आगे adjacent cells तक बढ़ाने वाली Excel feature कौन-सी है?",
      "Excel में AutoFill को आगे बढ़ाने के लिए किस feature को drag किया जाता है?",
      "Excel का Fill Handle किस कार्य के लिए उपयोग किया जाता है?",
      "Excel में AutoFill का उपयोग किस काम के लिए होता है?",
    ],
    pa: [
      "Excel ਵਿੱਚ selected source cells ਦੇ pattern ਜਾਂ values ਦੇ ਆਧਾਰ 'ਤੇ adjacent cells ਭਰਨ ਵਾਲੀ feature ਕਿਹੜੀ ਹੈ?",
      "Excel ਵਿੱਚ values ਨੂੰ ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਜਾਂ A ਤੋਂ Z ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਵਾਲਾ sort order ਕਿਹੜਾ ਹੈ?",
      "Excel ਵਿੱਚ values ਨੂੰ ਵੱਡੇ ਤੋਂ ਛੋਟੇ ਜਾਂ Z ਤੋਂ A ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਵਾਲਾ sort order ਕਿਹੜਾ ਹੈ?",
      "Excel ਵਿੱਚ Fill Handle ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?",
      "Excel ਵਿੱਚ Filter ਕੀ ਕਰਦਾ ਹੈ?",
      "Microsoft Excel ਵਿੱਚ pattern ਅਨੁਸਾਰ ਨਾਲ ਵਾਲੇ cells ਭਰਨ ਲਈ ਕਿਹੜੀ feature ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
      "Excel ਵਿੱਚ ਚੁਣੇ criteria ਅਨੁਸਾਰ rows ਦਿਖਾਉਣ ਅਤੇ ਬਾਕੀ rows ਲੁਕਾਉਣ ਲਈ ਕੀ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "Excel ਵਿੱਚ Ascending Sort ਕੀ ਕਰਦਾ ਹੈ?",
      "Selected cells ਦੇ pattern ਨੂੰ ਅੱਗੇ adjacent cells ਤੱਕ ਵਧਾਉਣ ਵਾਲੀ Excel feature ਕਿਹੜੀ ਹੈ?",
      "Excel ਵਿੱਚ AutoFill ਨੂੰ ਅੱਗੇ ਵਧਾਉਣ ਲਈ ਕਿਹੜੀ feature ਨੂੰ drag ਕੀਤਾ ਜਾਂਦਾ ਹੈ?",
      "Excel ਦਾ Fill Handle ਕਿਸ ਕੰਮ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "Excel ਵਿੱਚ AutoFill ਦੀ ਵਰਤੋਂ ਕਿਸ ਕੰਮ ਲਈ ਹੁੰਦੀ ਹੈ?",
    ],
  },
  "COM-003-QL-013": {
    hi: [
      "Excel में worksheet column की horizontal width किस option से नियंत्रित होती है?",
      "Worksheet में नई row जोड़ने के लिए कौन-सा operation उपयोग किया जाता है?",
      "Excel में worksheet row की vertical height किस setting से नियंत्रित होती है?",
      "Excel में selected row हटाने के लिए कौन-सी command उपयोग होती है?",
      "Microsoft Excel में column की width बदलने वाला option कौन-सा है?",
      "Microsoft Excel में row की height बदलने के लिए कौन-सा option है?",
      "Microsoft Excel में selected row हटाने के लिए कौन-सी command है?",
      "Microsoft Excel में नई row insert करने के लिए कौन-सी command है?",
      "Excel में column की चौड़ाई बदलने के लिए कौन-सा option प्रयोग किया जाता है?",
      "Excel में row की ऊँचाई बदलने के लिए कौन-सा option प्रयोग किया जाता है?",
      "Microsoft Excel में column width बदलने के लिए सही option कौन-सा है?",
      "Excel worksheet में नई row जोड़ने के लिए कौन-सी command उपयोग की जाती है?",
    ],
    pa: [
      "Excel ਵਿੱਚ worksheet column ਦੀ horizontal width ਕਿਹੜੇ option ਨਾਲ ਨਿਯੰਤਰਿਤ ਹੁੰਦੀ ਹੈ?",
      "Worksheet ਵਿੱਚ ਨਵੀਂ row ਜੋੜਨ ਲਈ ਕਿਹੜਾ operation ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "Excel ਵਿੱਚ worksheet row ਦੀ vertical height ਕਿਹੜੀ setting ਨਾਲ ਨਿਯੰਤਰਿਤ ਹੁੰਦੀ ਹੈ?",
      "Excel ਵਿੱਚ selected row ਹਟਾਉਣ ਲਈ ਕਿਹੜੀ command ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
      "Microsoft Excel ਵਿੱਚ column ਦੀ width ਬਦਲਣ ਵਾਲਾ option ਕਿਹੜਾ ਹੈ?",
      "Microsoft Excel ਵਿੱਚ row ਦੀ height ਬਦਲਣ ਲਈ ਕਿਹੜਾ option ਹੈ?",
      "Microsoft Excel ਵਿੱਚ selected row ਹਟਾਉਣ ਲਈ ਕਿਹੜੀ command ਹੈ?",
      "Microsoft Excel ਵਿੱਚ ਨਵੀਂ row insert ਕਰਨ ਲਈ ਕਿਹੜੀ command ਹੈ?",
      "Excel ਵਿੱਚ column ਦੀ ਚੌੜਾਈ ਬਦਲਣ ਲਈ ਕਿਹੜਾ option ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "Excel ਵਿੱਚ row ਦੀ ਉਚਾਈ ਬਦਲਣ ਲਈ ਕਿਹੜਾ option ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "Microsoft Excel ਵਿੱਚ column width ਬਦਲਣ ਲਈ ਸਹੀ option ਕਿਹੜਾ ਹੈ?",
      "Excel worksheet ਵਿੱਚ ਨਵੀਂ row ਜੋੜਨ ਲਈ ਕਿਹੜੀ command ਵਰਤੀ ਜਾਂਦੀ ਹੈ?",
    ],
  },
  "COM-003-QL-014": {
    hi: [
      "Excel में समय या किसी ordered interval के साथ trend दिखाने के लिए सामान्यतः कौन-सा chart उपयोग किया जाता है?",
      "अलग-अलग categories या items के values की तुलना के लिए Excel में कौन-सा chart सामान्यतः उपयोग होता है?",
      "एक total को उसके अलग-अलग हिस्सों के रूप में दिखाने के लिए Excel में कौन-सा chart उपयोग किया जाता है?",
      "कई product categories के values की तुलना करनी हो तो कौन-सा Excel chart उपयुक्त है?",
      "एक total में प्रत्येक category का share दिखाना हो तो कौन-सा Excel chart उपयुक्त है?",
      "किसी report में categories को एक ही total के हिस्सों के रूप में दिखाने के लिए कौन-सा chart चुनना चाहिए?",
      "यदि chart में हर category को एक total के share के रूप में दिखाया गया है, तो वह कौन-सा chart है?",
      "Values को parts of a whole के रूप में दिखाने वाला Excel chart कौन-सा है?",
      "एक data series को categories के अनुपातिक हिस्सों में बाँटकर दिखाने वाला chart कौन-सा है?",
      "Parts of a whole दिखाने के बजाय categories की तुलना के लिए कौन-सा chart अधिक उपयुक्त है?",
      "अलग-अलग items की तुलना करनी हो और total share नहीं दिखाना हो, तो कौन-सा Excel chart चुनेंगे?",
      "Basic category comparison के लिए Pie Chart की तुलना में कौन-सा chart अधिक उपयुक्त है?",
    ],
    pa: [
      "Excel ਵਿੱਚ ਸਮੇਂ ਜਾਂ ਕਿਸੇ ordered interval ਨਾਲ trend ਦਿਖਾਉਣ ਲਈ ਆਮ ਤੌਰ 'ਤੇ ਕਿਹੜਾ chart ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "ਵੱਖ-ਵੱਖ categories ਜਾਂ items ਦੇ values ਦੀ ਤੁਲਨਾ ਲਈ Excel ਵਿੱਚ ਕਿਹੜਾ chart ਆਮ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "ਇੱਕ total ਨੂੰ ਉਸਦੇ ਵੱਖ-ਵੱਖ ਹਿੱਸਿਆਂ ਵਜੋਂ ਦਿਖਾਉਣ ਲਈ Excel ਵਿੱਚ ਕਿਹੜਾ chart ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
      "ਕਈ product categories ਦੇ values ਦੀ ਤੁਲਨਾ ਕਰਨੀ ਹੋਵੇ ਤਾਂ ਕਿਹੜਾ Excel chart ਠੀਕ ਹੈ?",
      "ਇੱਕ total ਵਿੱਚ ਹਰ category ਦਾ share ਦਿਖਾਉਣਾ ਹੋਵੇ ਤਾਂ ਕਿਹੜਾ Excel chart ਠੀਕ ਹੈ?",
      "ਕਿਸੇ report ਵਿੱਚ categories ਨੂੰ ਇੱਕੋ total ਦੇ ਹਿੱਸਿਆਂ ਵਜੋਂ ਦਿਖਾਉਣ ਲਈ ਕਿਹੜਾ chart ਚੁਣਨਾ ਚਾਹੀਦਾ ਹੈ?",
      "ਜੇ chart ਵਿੱਚ ਹਰ category ਨੂੰ ਇੱਕ total ਦੇ share ਵਜੋਂ ਦਿਖਾਇਆ ਗਿਆ ਹੋਵੇ, ਤਾਂ ਉਹ ਕਿਹੜਾ chart ਹੈ?",
      "Values ਨੂੰ parts of a whole ਵਜੋਂ ਦਿਖਾਉਣ ਵਾਲਾ Excel chart ਕਿਹੜਾ ਹੈ?",
      "ਇੱਕ data series ਨੂੰ categories ਦੇ ਅਨੁਪਾਤਿਕ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡ ਕੇ ਦਿਖਾਉਣ ਵਾਲਾ chart ਕਿਹੜਾ ਹੈ?",
      "Parts of a whole ਦਿਖਾਉਣ ਦੀ ਬਜਾਇ categories ਦੀ ਤੁਲਨਾ ਲਈ ਕਿਹੜਾ chart ਵਧੀਆ ਹੈ?",
      "ਵੱਖ-ਵੱਖ items ਦੀ ਤੁਲਨਾ ਕਰਨੀ ਹੋਵੇ ਅਤੇ total share ਨਾ ਦਿਖਾਉਣਾ ਹੋਵੇ, ਤਾਂ ਕਿਹੜਾ Excel chart ਚੁਣੋਗੇ?",
      "Basic category comparison ਲਈ Pie Chart ਦੀ ਤੁਲਨਾ ਵਿੱਚ ਕਿਹੜਾ chart ਵਧੇਰੇ ਢੁੱਕਵਾਂ ਹੈ?",
    ],
  },
};

const EXPLANATION: Record<string,T> = {
  "com003-excel-autosum-sum": {hi:"AutoSum selected या detected range के लिए जल्दी से SUM formula insert करता है।",pa:"AutoSum selected ਜਾਂ detected range ਲਈ ਤੇਜ਼ੀ ਨਾਲ SUM formula insert ਕਰਦਾ ਹੈ।"},
  "com003-excel-function-average": {hi:"AVERAGE अपने numeric arguments का अंकगणितीय माध्य लौटाता है।",pa:"AVERAGE ਆਪਣੇ numeric arguments ਦਾ ਅੰਕਗਣਿਤੀ ਔਸਤ ਵਾਪਸ ਕਰਦਾ ਹੈ।"},
  "com003-excel-function-max": {hi:"MAX दिए गए set या range में सबसे बड़ा numeric value लौटाता है।",pa:"MAX ਦਿੱਤੇ set ਜਾਂ range ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ numeric value ਵਾਪਸ ਕਰਦਾ ਹੈ।"},
  "com003-excel-function-min": {hi:"MIN दिए गए set या range में सबसे छोटा numeric value लौटाता है।",pa:"MIN ਦਿੱਤੇ set ਜਾਂ range ਵਿੱਚ ਸਭ ਤੋਂ ਛੋਟਾ numeric value ਵਾਪਸ ਕਰਦਾ ਹੈ।"},
  "com003-excel-function-sum": {hi:"SUM numbers, cell references या ranges के रूप में दिए गए values को जोड़ता है।",pa:"SUM numbers, cell references ਜਾਂ ranges ਦੇ ਰੂਪ ਵਿੱਚ ਦਿੱਤੇ values ਨੂੰ ਜੋੜਦਾ ਹੈ।"},
  "com003-excel-function-count": {hi:"COUNT मूल numeric-count संदर्भ में numbers वाले cells या arguments की गिनती करता है।",pa:"COUNT ਮੂਲ numeric-count ਸੰਦਰਭ ਵਿੱਚ numbers ਵਾਲੇ cells ਜਾਂ arguments ਦੀ ਗਿਣਤੀ ਕਰਦਾ ਹੈ।"},
  "com003-excel-absolute-reference": {hi:"Absolute reference formula copy या fill करने पर fixed रहता है; इसलिए इसका उपयोग तब होता है जब referenced cell को बदलना नहीं चाहिए।",pa:"Absolute reference formula copy ਜਾਂ fill ਕਰਨ 'ਤੇ fixed ਰਹਿੰਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਉਸ ਵੇਲੇ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ ਜਦੋਂ referenced cell ਬਦਲਣਾ ਨਹੀਂ ਚਾਹੀਦਾ।"},
  "com003-excel-absolute-reference-notation": {hi:"$A$1 पूरी तरह absolute है क्योंकि dollar sign column A और row 1 दोनों से पहले लगा है।",pa:"$A$1 ਪੂਰੀ ਤਰ੍ਹਾਂ absolute ਹੈ ਕਿਉਂਕਿ dollar sign column A ਅਤੇ row 1 ਦੋਵਾਂ ਤੋਂ ਪਹਿਲਾਂ ਲੱਗਿਆ ਹੈ।"},
  "com003-excel-relative-reference": {hi:"Relative reference formula copy या fill होने पर formula के नए स्थान के अनुसार बदलता है।",pa:"Relative reference formula copy ਜਾਂ fill ਹੋਣ 'ਤੇ formula ਦੀ ਨਵੀਂ ਥਾਂ ਅਨੁਸਾਰ ਬਦਲਦਾ ਹੈ।"},
  "com003-excel-autofill-pattern": {hi:"AutoFill selected source cells के pattern या values के आधार पर adjacent cells भरता है।",pa:"AutoFill selected source cells ਦੇ pattern ਜਾਂ values ਦੇ ਆਧਾਰ 'ਤੇ adjacent cells ਭਰਦਾ ਹੈ।"},
  "com003-excel-sort-ascending": {hi:"Ascending Sort data type के अनुसार values को छोटे से बड़े या A से Z क्रम में लगाता है।",pa:"Ascending Sort data type ਅਨੁਸਾਰ values ਨੂੰ ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਜਾਂ A ਤੋਂ Z ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਂਦਾ ਹੈ।"},
  "com003-excel-sort-descending": {hi:"Descending Sort data type के अनुसार values को बड़े से छोटे या Z से A क्रम में लगाता है।",pa:"Descending Sort data type ਅਨੁਸਾਰ values ਨੂੰ ਵੱਡੇ ਤੋਂ ਛੋਟੇ ਜਾਂ Z ਤੋਂ A ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਂਦਾ ਹੈ।"},
  "com003-excel-fill-handle": {hi:"Fill Handle को drag करके AutoFill को adjacent worksheet cells तक बढ़ाया जाता है।",pa:"Fill Handle ਨੂੰ drag ਕਰਕੇ AutoFill ਨੂੰ adjacent worksheet cells ਤੱਕ ਵਧਾਇਆ ਜਾਂਦਾ ਹੈ।"},
  "com003-excel-filter-purpose": {hi:"Filter चुनी हुई criteria पूरी करने वाली rows दिखाता है और बाकी rows को छिपाता है; यह sorting से अलग कार्य है।",pa:"Filter ਚੁਣੀਆਂ criteria ਪੂਰੀਆਂ ਕਰਨ ਵਾਲੀਆਂ rows ਦਿਖਾਉਂਦਾ ਹੈ ਅਤੇ ਬਾਕੀ rows ਲੁਕਾਉਂਦਾ ਹੈ; ਇਹ sorting ਤੋਂ ਵੱਖਰਾ ਕੰਮ ਹੈ।"},
  "com003-excel-row-column-column-width": {hi:"Column Width worksheet column की horizontal चौड़ाई नियंत्रित करता है।",pa:"Column Width worksheet column ਦੀ horizontal ਚੌੜਾਈ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ।"},
  "com003-excel-row-column-insert-row": {hi:"Insert Row worksheet में नई row जोड़ता है और आवश्यकता के अनुसार मौजूदा worksheet structure को shift करता है।",pa:"Insert Row worksheet ਵਿੱਚ ਨਵੀਂ row ਜੋੜਦਾ ਹੈ ਅਤੇ ਲੋੜ ਅਨੁਸਾਰ ਮੌਜੂਦਾ worksheet structure ਨੂੰ shift ਕਰਦਾ ਹੈ।"},
  "com003-excel-row-column-row-height": {hi:"Row Height worksheet row की vertical ऊँचाई नियंत्रित करता है।",pa:"Row Height worksheet row ਦੀ vertical ਉਚਾਈ ਨਿਯੰਤਰਿਤ ਕਰਦਾ ਹੈ।"},
  "com003-excel-row-column-delete-row": {hi:"Delete Row selected worksheet row को हटाता है।",pa:"Delete Row selected worksheet row ਨੂੰ ਹਟਾਉਂਦਾ ਹੈ।"},
  "com003-excel-line-chart": {hi:"Line Chart क्रम में values को जोड़कर दिखाता है, इसलिए समय या अन्य ordered interval के साथ trend दिखाने के लिए यह सामान्य basic choice है।",pa:"Line Chart ਕ੍ਰਮ ਵਿੱਚ values ਨੂੰ ਜੋੜ ਕੇ ਦਿਖਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਸਮੇਂ ਜਾਂ ਹੋਰ ordered interval ਨਾਲ trend ਦਿਖਾਉਣ ਲਈ ਇਹ ਆਮ basic choice ਹੈ।"},
  "com003-excel-bar-chart": {hi:"Bar Chart अलग-अलग categories या individual items के magnitudes की तुलना के लिए सामान्यतः उपयोग किया जाता है।",pa:"Bar Chart ਵੱਖ-ਵੱਖ categories ਜਾਂ individual items ਦੇ magnitudes ਦੀ ਤੁਲਨਾ ਲਈ ਆਮ ਤੌਰ 'ਤੇ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"},
  "com003-excel-pie-chart": {hi:"Pie Chart एक total को proportional slices में दिखाता है, इसलिए इसका basic purpose parts of a whole दिखाना है।",pa:"Pie Chart ਇੱਕ total ਨੂੰ proportional slices ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਸਦਾ basic purpose parts of a whole ਦਿਖਾਉਣਾ ਹੈ।"},
};

function localizeOption(language:L, english:string){
  const memory=lookupCom003OptionTranslationV1(language,english);
  if(memory.status!=="UNIQUE" || !memory.selected) throw new Error(`COM-003 Wave3 option translation unresolved: ${language}:${english}:${memory.status}`);
  return memory.selected;
}

function build(language:L): Com003LocalizedQuestionV2[] {
  const perQl = new Map<string,number>();
  return COM003_ENGLISH_REVIEW_CORPUS_V16_2
    .filter(q => (QLS as readonly string[]).includes(q.qlId))
    .map(q => {
      const ordinal=perQl.get(q.qlId)??0; perQl.set(q.qlId,ordinal+1);
      const stem=STEMS[q.qlId]?.[language]?.[ordinal];
      const explanation=EXPLANATION[q.targetFactId]?.[language];
      if(!stem) throw new Error(`COM-003 Wave3 missing ${language} stem ${q.qlId}/${ordinal}`);
      if(!explanation) throw new Error(`COM-003 Wave3 missing ${language} explanation ${q.targetFactId}`);
      const options=q.options.map(option=>localizeOption(language,option));
      return {
        localizationId:`COM003-LOC-V2-W3-${language.toUpperCase()}-${q.qlId}-${String(ordinal+1).padStart(2,"0")}`,
        sourceQuestionId:q.questionId,
        sourceEnglishAuthorityId:COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
        qlId:q.qlId,cpId:q.cpId,examSurfaceFamily:q.examSurfaceFamily,surfaceMode:q.surfaceMode,targetFactId:q.targetFactId,
        language,locale:language==="hi"?"hi-IN":"pa-IN",stem,options,correctIndex:q.correctIndex,
        canonicalAnswer:options[q.correctIndex]!,explanation,sourceIds:[...q.sourceIds],sourceFactIds:[...q.sourceFactIds],versionScoped:q.versionScoped,
        solverAuthority:q.solverAuthority,sourceEnglishFrozen:true,localizationReviewOnly:true,localizationFrozen:false,runtimeRegistered:false,productionReleased:false,
      };
    });
}

export const COM003_HINDI_LOCALIZATION_V2_WAVE3=Object.freeze(build("hi"));
export const COM003_PUNJABI_LOCALIZATION_V2_WAVE3=Object.freeze(build("pa"));

export const COM003_LOCALIZATION_V2_WAVE3_AUTHORITY=Object.freeze({
  authorityId:"COM-003-LOCALIZATION-V2-WAVE3-CANDIDATE-1" as const,
  chapterCode:"COM-003" as const,chapterTitle:"Office & Productivity Software" as const,
  sourceEnglishAuthorityId:COM003_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,sourceEnglishCorpus:"COM003_ENGLISH_REVIEW_CORPUS_V16_2" as const,
  qlIds:QLS,qlCount:5,englishQuestionCount:60,hindiQuestionCount:COM003_HINDI_LOCALIZATION_V2_WAVE3.length,
  punjabiQuestionCount:COM003_PUNJABI_LOCALIZATION_V2_WAVE3.length,localizedQuestionCount:120,questionsPerQlPerLanguage:12,
  authoringBasis:"V16_2_EXACT_STEM_INTENT_PLUS_GOVERNED_OPTION_TRANSLATION_MEMORY" as const,
  governance:Object.freeze({localizationReviewOnly:true,localizationFrozen:false,questionStudioRuntimeAuthorized:false,questionBankWritesAuthorized:false,
    testEligibilityAuthorized:false,mockTestEligibilityAuthorized:false,automaticPublicationAuthorized:false,publiclyPublishable:false,productionReleased:false}),
  nextGate:"COM003_LOCALIZATION_V2_WAVE3_HUMAN_REVIEW" as const,
});
