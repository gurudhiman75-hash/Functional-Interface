import type { TmwLocalizedLanguage } from "./localization-types";

interface StemmedQuestion {
  stem: string;
}

function wrapBareFractions(value: string): string {
  const parts = value.split(/(\\\([\s\S]*?\\\))/g);
  return parts
    .map((part, index) => index % 2 === 1
      ? part
      : part.replace(/\b(\d+)\/(\d+)\b/g, "\\(\\frac{$1}{$2}\\)"))
    .join("");
}

function hindiOrdinal(value: string): string {
  const ordinals: Record<string, string> = {
    "1": "पहली",
    "2": "दूसरी",
    "3": "तीसरी",
    "4": "चौथी",
    "5": "पाँचवीं",
  };
  return ordinals[value] ?? `${value}वीं`;
}

function punjabiOrdinal(value: string): string {
  const ordinals: Record<string, string> = {
    "1": "ਪਹਿਲੀ",
    "2": "ਦੂਜੀ",
    "3": "ਤੀਜੀ",
    "4": "ਚੌਥੀ",
    "5": "ਪੰਜਵੀਂ",
  };
  return ordinals[value] ?? `${value}ਵੀਂ`;
}

function remediateHindiStem(qlId: string, source: string): string {
  let stem = wrapBareFractions(source)
    .replace(/दिया गया काम का/g, "दिए गए काम का")
    .replace(/क्लर्क 4/g, "क्लर्क D")
    .replace(/एक वाहन-पुर्ज़ा कारखाना में/g, "एक वाहन-पुर्ज़ा कारखाने में")
    .replace(/(\d+) फाइलें पूरे करने/g, "$1 फाइलें पूरी करने")
    .replace(/(\d+) आवेदन पूरे करने/g, "$1 आवेदन पूरे करने")
    .replace(/(\d+) फाइलें की तुलना/g, "$1 फाइलों की तुलना");

  switch (qlId) {
    case "TMW-QL-002":
      stem = stem.replace(/कुल उत्पादन (\d+) फाइलें है/, "कुल $1 फाइलें पूरी हुई हैं");
      break;
    case "TMW-QL-005":
      stem = stem.replace("एक ठेकेदार द्वारा एक दिन में दिए गए काम का", "एक ठेकेदार एक दिन में दिए गए काम का");
      break;
    case "TMW-QL-017":
      stem = stem.replace(/(\d+) फाइलें पूरी करने में (\d+) फाइलों की तुलना में/, "$1 फाइलें पूरी करने में $2 फाइलें पूरी करने की तुलना में");
      break;
    case "TMW-QL-027":
      stem = stem.replace("एक प्रक्रिया किए हुए काम को दोबारा काम के लिए वापस भेजती रहती है", "एक प्रक्रिया किए हुए काम का कुछ भाग दोबारा करने के लिए वापस भेजती रहती है");
      break;
    case "TMW-QL-049":
      stem = stem.replace("स्कूल भवन की पेंटिंग 6 दिनों में पूरा करते हैं", "स्कूल भवन की पेंटिंग 6 दिनों में पूरी करते हैं");
      break;
    case "TMW-QL-077":
      stem = stem.replace("उपकरण की पूरी मरम्मत अकेले पूरा करने में", "उपकरण की पूरी मरम्मत अकेले करने में");
      break;
    case "TMW-QL-115":
      stem = stem.replace("रंगाई का ठेका का केवल", "रंगाई के ठेके का केवल");
      break;
    case "TMW-QL-122":
      stem = stem.replace(/लंबाई (.+?) आयाम वाले खुदाई का गड्ढा को/, "लंबाई $1 आयाम वाले गड्ढे की खुदाई को");
      break;
    case "TMW-QL-127":
      stem = stem.replace("10 बोतल भरने वाली लाइनें 8 घंटे तक कार्यरत हैं", "बोतल भरने वाली 10 लाइनें 8 घंटे तक कार्यरत हैं");
      break;
    case "TMW-QL-128":
      stem = stem.replace("छपाई का ऑर्डर का समान भाग", "छपाई के ऑर्डर का समान भाग");
      break;
    case "TMW-QL-131":
      stem = stem.replace(/कितने भारी मशीनें चाहिए/, "कितनी भारी मशीनें चाहिए");
      break;
    case "TMW-QL-146":
      stem = stem.replace("बड़ा प्रेषण ऑर्डर के लिए", "बड़े प्रेषण ऑर्डर के लिए");
      break;
    case "TMW-QL-147":
      stem = stem.replace("रंगाई के ठेके के लिए कुल राशि", "रंगाई के ठेके की कुल राशि");
      break;
    case "TMW-QL-148":
      stem = stem.replace("बड़ा प्रेषण ऑर्डर पर", "बड़े प्रेषण ऑर्डर पर");
      break;
    case "TMW-QL-149":
      stem = stem.replace("रंगाई साइट पर तीन कर्मचारियों", "रंगाई स्थल पर तीन कर्मचारियों");
      break;
    case "TMW-QL-154":
      stem = stem.replace("₹3 प्रति इकाई", "₹3 प्रति वर्ग मीटर");
      break;
    case "TMW-QL-161":
    case "TMW-QL-162":
      stem = stem.replace("ज्ञात पाइप:", "दिए गए पाइपों की जानकारी:");
      break;
    case "TMW-QL-177":
      stem = stem
        .replace(/पहला अंतराल: (.+?) चलती है (\d+) घंटों तक।/, "पहले अंतराल में $1 $2 घंटे चलती है।")
        .replace(/दूसरा अंतराल: (.+?) चलते हैं (\d+) घंटों तक।/, "दूसरे अंतराल में $1 $2 घंटे चलते हैं।");
      break;
    case "TMW-QL-178":
      stem = stem.replace("भरने वाली पाइप A चलती है पहले 3 घंटों तक चलती है", "भरने वाली पाइप A पहले 3 घंटे चलती है");
      break;
    case "TMW-QL-180":
      stem = stem
        .replace("पहला अंतराल: निकासी पाइप A चलती है 2 घंटों तक", "पहले अंतराल में निकासी पाइप A 2 घंटे चलती है")
        .replace("दूसरा अंतराल: भरने वाली पाइप B चलती है 3 घंटों तक", "दूसरे अंतराल में भरने वाली पाइप B 3 घंटे चलती है");
      break;
    case "TMW-QL-181":
      stem = stem
        .replace("भरने वाली पाइप A चलती है तब तक चलती है", "भरने वाली पाइप A तब तक चलती है")
        .replace("सेंसर फिर व्यवस्था बदलकर भरने वाली पाइप B चलती है", "इसके बाद सेंसर व्यवस्था बदल देता है और भरने वाली पाइप B चलने लगती है");
      break;
    case "TMW-QL-187":
      stem = stem.replace(/अगली (\d+)वीं वापसी/g, (_, value: string) => `${hindiOrdinal(value)} वापसी`);
      break;
    case "TMW-QL-188":
      stem = stem
        .replace("स्वच्छ-जल जलाशय शुरू में \\(\\frac{2}{5}\\) भरी है", "स्वच्छ-जल जलाशय शुरू में \\(\\frac{2}{5}\\) भरा है")
        .replace(/पूरी भरी स्वच्छ-जल जलाशय/g, "पूरे भरे स्वच्छ-जल जलाशय");
      break;
    case "TMW-QL-193":
      stem = stem
        .replace("Priya", "प्रिया")
        .replace(/पुस्तिकाएँ पूरा करती है/g, "पुस्तिकाएँ पूरी करती है");
      break;
    case "TMW-QL-194":
      stem = stem
        .replace(/पेटियाँ पूरे होते हैं/g, "पेटियाँ पूरी होती हैं")
        .replace(/पेटियाँ पूरा होने/g, "पेटियाँ पूरी होने");
      break;
    case "TMW-QL-195":
      stem = stem
        .replace(/हर दिन 1 पुस्तिकाएँ घटता है/g, "हर दिन 1 पुस्तिका घटती है")
        .replace(/कुल (\d+) पुस्तिकाएँ है/g, "कुल $1 पुस्तिकाएँ हैं");
      break;
    case "TMW-QL-196":
      stem = stem
        .replace(/पेटियाँ पूरे हुए/g, "पेटियाँ पूरी हुईं")
        .replace(/कुल (\d+) पेटियाँ है/g, "कुल $1 पेटियाँ हैं");
      break;
    case "TMW-QL-197":
      stem = stem.replace(/पुस्तिकाएँ पूरे होते हैं/g, "पुस्तिकाएँ पूरी होती हैं");
      break;
    case "TMW-QL-198":
      stem = stem.replace(/पुर्ज़े पूरा होने/g, "पुर्ज़े पूरे होने");
      break;
    case "TMW-QL-199":
      stem = stem.replace(/कुल (\d+) फाइलें है/g, "कुल $1 फाइलें हैं");
      break;
    case "TMW-QL-200":
      stem = stem.replace(/कुल (\d+) पुर्ज़े है/g, "कुल $1 पुर्ज़े हैं");
      break;
    case "TMW-QL-201":
      stem = stem
        .replace(/सड़क के हिस्से/g, "सड़क-खंड")
        .replace(/सड़क-खंड पूरा होने/g, "सड़क-खंड पूरे होने");
      break;
    case "TMW-QL-203":
      stem = stem
        .replace(/फाइलें पूरे हुए/g, "फाइलें पूरी हुईं")
        .replace(/कुल (\d+) फाइलें हुआ/g, "कुल $1 फाइलें पूरी हुईं");
      break;
    case "TMW-QL-204":
      stem = stem.replace(/कार्टन पूरा करता है/g, "कार्टन पूरे करता है");
      break;
    case "TMW-QL-205":
      stem = stem.replace("Meera", "मीरा").replace("Rohan", "रोहन");
      break;
    case "TMW-QL-207":
      stem = stem
        .replace(/सड़क के हिस्से/g, "सड़क-खंड")
        .replace(/सड़क-खंड पूरा होने/g, "सड़क-खंड पूरे होने");
      break;
    case "TMW-QL-208":
      stem = stem.replace(/वह हर दिन (.+?) बढ़ता है/, "वह हर दिन $1 बढ़ती है");
      break;
    case "TMW-QL-209":
      stem = stem.replace(/फाइलें पूरे होते हैं/g, "फाइलें पूरी होती हैं");
      break;
    case "TMW-QL-210":
      stem = stem.replace(/फाइलें पूरा करता है/g, "फाइलें पूरी करता है");
      break;
    case "TMW-QL-211":
      stem = stem.replace(/कुल (\d+) पुर्ज़े हुआ/g, "कुल $1 पुर्ज़े बने");
      break;
  }
  return stem;
}

function remediatePunjabiStem(qlId: string, source: string): string {
  let stem = wrapBareFractions(source)
    .replace(/ਦਿੱਤਾ ਹੋਇਆ ਕੰਮ ਦਾ/g, "ਦਿੱਤੇ ਹੋਏ ਕੰਮ ਦਾ")
    .replace(/ਕਲਰਕ 4/g, "ਕਲਰਕ D")
    .replace(/(\d+) ਅਰਜ਼ੀਆਂ ਪੂਰੇ ਕਰਨ/g, "$1 ਅਰਜ਼ੀਆਂ ਪੂਰੀਆਂ ਕਰਨ")
    .replace(/(\d+) ਫਾਈਲਾਂ ਪੂਰੇ ਕਰਨ/g, "$1 ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਕਰਨ");

  switch (qlId) {
    case "TMW-QL-002":
      stem = stem.replace(/ਕੁੱਲ ਉਤਪਾਦਨ (\d+) ਫਾਈਲਾਂ ਹਨ/, "ਕੁੱਲ $1 ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੋਈਆਂ ਹਨ");
      break;
    case "TMW-QL-005":
      stem = stem.replace("ਇੱਕ ਠੇਕੇਦਾਰ ਵੱਲੋਂ ਇੱਕ ਦਿਨ ਵਿੱਚ ਦਿੱਤੇ ਹੋਏ ਕੰਮ ਦਾ", "ਇੱਕ ਠੇਕੇਦਾਰ ਇੱਕ ਦਿਨ ਵਿੱਚ ਦਿੱਤੇ ਹੋਏ ਕੰਮ ਦਾ");
      break;
    case "TMW-QL-017":
      stem = stem.replace(/(\d+) ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਕਰਨ ਵਿੱਚ (\d+) ਫਾਈਲਾਂ ਨਾਲੋਂ/, "$1 ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਕਰਨ ਵਿੱਚ $2 ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਕਰਨ ਨਾਲੋਂ");
      break;
    case "TMW-QL-027":
      stem = stem.replace("ਇੱਕ ਪ੍ਰਕਿਰਿਆ ਹੋਇਆ ਕੰਮ ਮੁੜ ਕੰਮ ਲਈ ਵਾਪਸ ਭੇਜਦੀ ਰਹਿੰਦੀ ਹੈ", "ਇੱਕ ਪ੍ਰਕਿਰਿਆ ਕੀਤੇ ਹੋਏ ਕੰਮ ਦਾ ਕੁਝ ਹਿੱਸਾ ਮੁੜ ਕਰਨ ਲਈ ਵਾਪਸ ਭੇਜਦੀ ਰਹਿੰਦੀ ਹੈ");
      break;
    case "TMW-QL-077":
      stem = stem.replace("ਉਪਕਰਣ ਦੀ ਪੂਰੀ ਮੁਰੰਮਤ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ", "ਉਪਕਰਣ ਦੀ ਪੂਰੀ ਮੁਰੰਮਤ ਇਕੱਲੇ ਕਰਨ ਲਈ");
      break;
    case "TMW-QL-092":
      stem = stem.replace("ਟੀਮ B ਇਕੱਲਾ ਸਾਰਾ ਕੰਮ", "ਟੀਮ B ਇਕੱਲੀ ਸਾਰਾ ਕੰਮ");
      break;
    case "TMW-QL-115":
      stem = stem.replace("ਰੰਗ ਕਰਨ ਦਾ ਠੇਕਾ ਦਾ ਸਿਰਫ਼", "ਰੰਗ ਕਰਨ ਦੇ ਠੇਕੇ ਦਾ ਸਿਰਫ਼");
      break;
    case "TMW-QL-122":
      stem = stem.replace(/ਲੰਬਾਈ (.+?) ਮਾਪ ਵਾਲੇ ਖੁਦਾਈ ਦਾ ਖੱਡਾ ਨੂੰ/, "ਲੰਬਾਈ $1 ਮਾਪ ਵਾਲੇ ਖੱਡੇ ਦੀ ਖੁਦਾਈ ਨੂੰ");
      break;
    case "TMW-QL-127":
      stem = stem.replace("10 ਬੋਤਲ ਭਰਨ ਵਾਲੀਆਂ ਲਾਈਨਾਂ 8 ਘੰਟੇ ਤੱਕ ਕੰਮ ਕਰ ਰਹੇ ਹਨ", "ਬੋਤਲ ਭਰਨ ਵਾਲੀਆਂ 10 ਲਾਈਨਾਂ 8 ਘੰਟੇ ਤੱਕ ਕੰਮ ਕਰ ਰਹੀਆਂ ਹਨ");
      break;
    case "TMW-QL-128":
      stem = stem.replace("ਛਪਾਈ ਦਾ ਆਰਡਰ ਦਾ ਇੱਕੋ ਹਿੱਸਾ", "ਛਪਾਈ ਦੇ ਆਰਡਰ ਦਾ ਇੱਕੋ ਹਿੱਸਾ");
      break;
    case "TMW-QL-131":
      stem = stem.replace(/ਕਿੰਨੇ ਭਾਰੀ ਮਸ਼ੀਨਾਂ ਚਾਹੀਦੇ ਹਨ/, "ਕਿੰਨੀਆਂ ਭਾਰੀ ਮਸ਼ੀਨਾਂ ਚਾਹੀਦੀਆਂ ਹਨ");
      break;
    case "TMW-QL-146":
      stem = stem.replace("ਵੱਡਾ ਡਿਸਪੈਚ ਆਰਡਰ ਲਈ", "ਵੱਡੇ ਡਿਸਪੈਚ ਆਰਡਰ ਲਈ");
      break;
    case "TMW-QL-147":
      stem = stem.replace("ਰੰਗਾਈ ਦਾ ਠੇਕਾ ਲਈ", "ਰੰਗਾਈ ਦੇ ਠੇਕੇ ਲਈ");
      break;
    case "TMW-QL-148":
      stem = stem.replace("ਵੱਡਾ ਡਿਸਪੈਚ ਆਰਡਰ ਉੱਤੇ", "ਵੱਡੇ ਡਿਸਪੈਚ ਆਰਡਰ ਉੱਤੇ");
      break;
    case "TMW-QL-154":
      stem = stem.replace("₹3 ਪ੍ਰਤੀ ਇਕਾਈ", "₹3 ਪ੍ਰਤੀ ਵਰਗ ਮੀਟਰ");
      break;
    case "TMW-QL-161":
    case "TMW-QL-162":
      stem = stem.replace("ਪਤਾ ਪਾਈਪ:", "ਦਿੱਤੀਆਂ ਪਾਈਪਾਂ ਦੀ ਜਾਣਕਾਰੀ:");
      break;
    case "TMW-QL-177":
      stem = stem
        .replace(/ਪਹਿਲਾ ਅੰਤਰਾਲ: (.+?) ਚੱਲਦੀ ਹੈ (\d+) ਘੰਟਿਆਂ ਲਈ।/, "ਪਹਿਲੇ ਅੰਤਰਾਲ ਵਿੱਚ $1 $2 ਘੰਟੇ ਚੱਲਦੀ ਹੈ।")
        .replace(/ਦੂਜਾ ਅੰਤਰਾਲ: (.+?) ਚੱਲਦੇ ਹਨ (\d+) ਘੰਟਿਆਂ ਲਈ।/, "ਦੂਜੇ ਅੰਤਰਾਲ ਵਿੱਚ $1 $2 ਘੰਟੇ ਚੱਲਦੇ ਹਨ।");
      break;
    case "TMW-QL-178":
      stem = stem.replace("ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਚੱਲਦੀ ਹੈ ਪਹਿਲਾਂ 3 ਘੰਟਿਆਂ ਲਈ ਚੱਲਦੀ ਹੈ", "ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਪਹਿਲਾਂ 3 ਘੰਟੇ ਚੱਲਦੀ ਹੈ");
      break;
    case "TMW-QL-180":
      stem = stem
        .replace("ਪਹਿਲਾ ਅੰਤਰਾਲ: ਨਿਕਾਸੀ ਪਾਈਪ A ਚੱਲਦੀ ਹੈ 2 ਘੰਟਿਆਂ ਲਈ", "ਪਹਿਲੇ ਅੰਤਰਾਲ ਵਿੱਚ ਨਿਕਾਸੀ ਪਾਈਪ A 2 ਘੰਟੇ ਚੱਲਦੀ ਹੈ")
        .replace("ਦੂਜਾ ਅੰਤਰਾਲ: ਭਰਨ ਵਾਲੀ ਪਾਈਪ B ਚੱਲਦੀ ਹੈ 3 ਘੰਟਿਆਂ ਲਈ", "ਦੂਜੇ ਅੰਤਰਾਲ ਵਿੱਚ ਭਰਨ ਵਾਲੀ ਪਾਈਪ B 3 ਘੰਟੇ ਚੱਲਦੀ ਹੈ");
      break;
    case "TMW-QL-181":
      stem = stem
        .replace("ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਚੱਲਦੀ ਹੈ ਤਦ ਤੱਕ ਚੱਲਦੀ ਹੈ", "ਭਰਨ ਵਾਲੀ ਪਾਈਪ A ਤਦ ਤੱਕ ਚੱਲਦੀ ਹੈ")
        .replace("ਸੈਂਸਰ ਫਿਰ ਵਿਵਸਥਾ ਬਦਲ ਕੇ ਭਰਨ ਵਾਲੀ ਪਾਈਪ B ਚੱਲਦੀ ਹੈ", "ਫਿਰ ਸੈਂਸਰ ਵਿਵਸਥਾ ਬਦਲ ਦਿੰਦਾ ਹੈ ਅਤੇ ਭਰਨ ਵਾਲੀ ਪਾਈਪ B ਚੱਲਣ ਲੱਗਦੀ ਹੈ");
      break;
    case "TMW-QL-187":
      stem = stem.replace(/ਅਗਲੀ (\d+)ਵੀਂ ਵਾਪਸੀ/g, (_, value: string) => `${punjabiOrdinal(value)} ਵਾਪਸੀ`);
      break;
    case "TMW-QL-188":
      stem = stem
        .replace("ਸਾਫ਼-ਪਾਣੀ ਜਲਾਸ਼ਯ ਸ਼ੁਰੂ ਵਿੱਚ \\(\\frac{2}{5}\\) ਭਰੀ ਹੈ", "ਸਾਫ਼-ਪਾਣੀ ਜਲਾਸ਼ਯ ਸ਼ੁਰੂ ਵਿੱਚ \\(\\frac{2}{5}\\) ਭਰਿਆ ਹੈ")
        .replace(/ਪੂਰੀ ਭਰੀ ਸਾਫ਼-ਪਾਣੀ ਜਲਾਸ਼ਯ/g, "ਪੂਰੇ ਭਰੇ ਸਾਫ਼-ਪਾਣੀ ਜਲਾਸ਼ਯ");
      break;
    case "TMW-QL-193":
      stem = stem.replace("Priya", "ਪ੍ਰਿਆ");
      break;
    case "TMW-QL-195":
      stem = stem
        .replace(/ਹਰ ਦਿਨ 1 ਪੁਸਤਿਕਾਵਾਂ ਘੱਟਦਾ ਹੈ/g, "ਹਰ ਦਿਨ 1 ਪੁਸਤਿਕਾ ਘੱਟਦੀ ਹੈ")
        .replace(/ਕੁੱਲ (\d+) ਪੁਸਤਿਕਾਵਾਂ ਹੈ/g, "ਕੁੱਲ $1 ਪੁਸਤਿਕਾਵਾਂ ਹਨ");
      break;
    case "TMW-QL-198":
      stem = stem
        .replace(/ਪੁਰਜ਼ੇ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ/g, "ਪੁਰਜ਼ੇ ਪੂਰੇ ਹੁੰਦੇ ਹਨ")
        .replace(/ਪੁਰਜ਼ੇ ਪੂਰੀਆਂ ਹੋਣ/g, "ਪੁਰਜ਼ੇ ਪੂਰੇ ਹੋਣ");
      break;
    case "TMW-QL-199":
      stem = stem.replace(/ਕੁੱਲ (\d+) ਫਾਈਲਾਂ ਹੈ/g, "ਕੁੱਲ $1 ਫਾਈਲਾਂ ਹਨ");
      break;
    case "TMW-QL-200":
      stem = stem
        .replace(/ਪੁਰਜ਼ੇ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ/g, "ਪੁਰਜ਼ੇ ਪੂਰੇ ਹੁੰਦੇ ਹਨ")
        .replace(/ਕੁੱਲ (\d+) ਪੁਰਜ਼ੇ ਹੈ/g, "ਕੁੱਲ $1 ਪੁਰਜ਼ੇ ਹਨ");
      break;
    case "TMW-QL-201":
      stem = stem
        .replace(/ਸੜਕ ਦੇ ਹਿੱਸੇ/g, "ਸੜਕ-ਖੰਡ")
        .replace(/ਸੜਕ-ਖੰਡ ਪੂਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ/g, "ਸੜਕ-ਖੰਡ ਪੂਰੇ ਹੁੰਦੇ ਹਨ")
        .replace(/ਸੜਕ-ਖੰਡ ਪੂਰੀਆਂ ਹੋਣ/g, "ਸੜਕ-ਖੰਡ ਪੂਰੇ ਹੋਣ");
      break;
    case "TMW-QL-202":
      stem = stem.replace(/ਕਾਰਟਨ ਪੂਰੀਆਂ ਹੋਈਆਂ/g, "ਕਾਰਟਨ ਪੂਰੇ ਹੋਏ");
      break;
    case "TMW-QL-203":
      stem = stem
        .replace(/ਕੁੱਲ (\d+) ਫਾਈਲਾਂ ਹੋਇਆ/g, "ਕੁੱਲ $1 ਫਾਈਲਾਂ ਪੂਰੀਆਂ ਹੋਈਆਂ");
      break;
    case "TMW-QL-204":
      stem = stem.replace(/ਕਾਰਟਨ ਪੂਰੀ ਕਰਦਾ ਹੈ/g, "ਕਾਰਟਨ ਪੂਰੇ ਕਰਦਾ ਹੈ");
      break;
    case "TMW-QL-205":
      stem = stem.replace("Meera", "ਮੀਰਾ").replace("Rohan", "ਰੋਹਨ");
      break;
    case "TMW-QL-206":
      stem = stem
        .replace(/ਪਹਿਲੇ ਦਿਨ (\d+) ਪੁਰਜ਼ੇ ਹੈ/g, "ਪਹਿਲੇ ਦਿਨ $1 ਪੁਰਜ਼ੇ ਹਨ");
      break;
    case "TMW-QL-207":
      stem = stem
        .replace(/ਸੜਕ ਦੇ ਹਿੱਸੇ/g, "ਸੜਕ-ਖੰਡ")
        .replace(/ਸੜਕ-ਖੰਡ ਪੂਰੀਆਂ ਹੋਣ/g, "ਸੜਕ-ਖੰਡ ਪੂਰੇ ਹੋਣ");
      break;
    case "TMW-QL-208":
      stem = stem.replace(/ਉਹ ਹਰ ਦਿਨ (.+?) ਵੱਧਦਾ ਹੈ/, "ਉਹ ਹਰ ਦਿਨ $1 ਵੱਧਦੀ ਹੈ");
      break;
    case "TMW-QL-211":
      stem = stem
        .replace(/ਪੁਰਜ਼ੇ ਪੂਰੀਆਂ ਹੋਈਆਂ/g, "ਪੁਰਜ਼ੇ ਪੂਰੇ ਹੋਏ")
        .replace(/ਕੁੱਲ (\d+) ਪੁਰਜ਼ੇ ਹੋਇਆ/g, "ਕੁੱਲ $1 ਪੁਰਜ਼ੇ ਬਣੇ");
      break;
  }
  return stem;
}

export function applyTmw001MultilingualStemRemediation<T extends StemmedQuestion>(
  question: T,
  qlId: string,
  language: TmwLocalizedLanguage,
): T {
  const stem = language === "hi"
    ? remediateHindiStem(qlId, question.stem)
    : remediatePunjabiStem(qlId, question.stem);
  return { ...question, stem };
}
