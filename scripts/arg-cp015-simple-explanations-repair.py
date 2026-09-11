from pathlib import Path

ROOT = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001")
SOURCE_PATH = ROOT / "cp015-final-editorial-quality.ts"
PROOF_PATH = ROOT / "cp015-anti-gaming-grammar-proof.test.ts"

source = SOURCE_PATH.read_text(encoding="utf-8")
proof = PROOF_PATH.read_text(encoding="utf-8")


def replace_once(value: str, old: str, new: str, label: str) -> str:
    if new in value:
        return value
    count = value.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return value.replace(old, new, 1)


def insert_before_once(value: str, anchor: str, insertion: str, marker: str, label: str) -> str:
    if marker in value:
        return value
    count = value.count(anchor)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return value.replace(anchor, insertion + anchor, 1)


def insert_after_once(value: str, anchor: str, insertion: str, marker: str, label: str) -> str:
    if marker in value:
        return value
    count = value.count(anchor)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return value.replace(anchor, anchor + insertion, 1)


source = replace_once(
    source,
    'export const ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY = "ARG_CP015_FINAL_EDITORIAL_QUALITY_V7" as const;',
    'export const ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY = "ARG_CP015_FINAL_EDITORIAL_QUALITY_V8" as const;',
    "authority bump",
)

source = replace_once(
    source,
    '    .replace(/\\bmost candidate and centre\\b/gi, "most candidates and centres");',
    '    .replace(/\\bmost candidate and centre\\b/gi, "most candidates and centres")\n    .replace(/\\ba automatically renewed plan\\b/gi, "an automatically renewed plan");',
    "English renewal article",
)

source = insert_before_once(
    source,
    '  return englishFallback(argument);\n}',
    '''  if (/solve the queue problem on its own/i.test(argument)) return "Longer opening hours may reduce queues, but they cannot solve the whole queue problem by themselves; demand and service capacity still matter.";
  if (/guided rules session/i.test(argument) && /largely eliminated/i.test(argument)) return "A guided rules session can reduce confusion, but attendance alone does not show that unauthorised collaboration will be largely eliminated.";
  if (/nobody will ever choose an? automatically renewed plan/i.test(argument)) return "A reminder may influence some users, but it does not show that nobody would choose to continue the plan; informed choice can still be a legitimate objective.";
  if (/(?:rules session|guided rules session|briefing)/i.test(argument) && /(?:misunderstanding|violations|misconduct rules)/i.test(argument)) return "One rules session may reduce confusion, but it cannot be assumed to remove nearly all misunderstanding or rule violations by itself.";
''',
    "solve the queue problem on its own",
    "English specific reasons",
)

source = insert_before_once(
    source,
    '  return hindiFallback(argument);\n}',
    '''  if (/लापरवाह/.test(argument)) return "सेवा माँगने वाले लोगों को लापरवाह मानना उनकी वास्तविक जरूरत का प्रमाण नहीं है; समय तय करते समय सेवा-आवश्यकता को ही देखना चाहिए।";
  if (/(?:हेल्पलाइन|मदद नंबर|संपर्क)/.test(argument) && /(?:पर्याप्त|इसी संपर्क)/.test(argument)) return "हेल्पलाइन उपयोगी हो सकती है, लेकिन केवल एक संपर्क हर सेवा-संबंधी समस्या हल कर देगा, यह मानना उचित नहीं है।";
  if (/(?:सत्र|ओरिएंटेशन|ब्रीफिंग)/.test(argument) && /(?:समाप्त|खत्म|काफी हद तक)/.test(argument)) return "एक सत्र कुछ भ्रम कम कर सकता है, लेकिन उससे लगभग सारी गलतफहमी या नियम-उल्लंघन समाप्त हो जाएँगे, यह निष्कर्ष उचित नहीं है।";
  if (/(?:वेबिनार|वीडियो मॉड्यूल)/.test(argument) && /(?:सारी क्षमता|खो देंगे|सारी उपयोगिता)/.test(argument)) return "रिकॉर्डेड सामग्री में कुछ सीमाएँ हो सकती हैं, लेकिन उससे सीखने या प्रक्रियाएँ समझने की सारी क्षमता समाप्त नहीं हो जाती।";
  if (/सत्यापन की एक असफल घटना|वेरिफिकेशन की एक असफल घटना/.test(argument)) return "सत्यापन की एक असफल घटना यह सिद्ध नहीं करती कि वैध उपयोगकर्ताओं के अधिकांश बदलाव भी विफल होंगे।";
  if (/डेस्कटॉप/.test(argument)) return "समय-स्लॉट या अपॉइंटमेंट के लिए हर आगंतुक का अपना महँगा कंप्यूटर होना जरूरी नहीं है; सहायता या अन्य बुकिंग विकल्प रखे जा सकते हैं।";
  if (/(?:कियोस्क|टर्मिनल)/.test(argument) && /(?:उपयोगी सेवा|कार्यान्वयन जोखिम|संभाल सकता|संभाल सकता है)/.test(argument)) return "स्वचालित सेवा की क्षमता सीमित हो सकती है, लेकिन बैकअप सहायता और चरणबद्ध बदलाव के साथ उसे पूरी तरह उपयोगहीन या जोखिम-मुक्त मानना दोनों गलत हैं।";
  if (/बिना किसी स्टाफ प्रशिक्षण|सीधे काम करेगा/.test(argument)) return "नई व्यवस्था के लिए प्रशिक्षण और संचालन की तैयारी जरूरी हो सकती है; केवल घोषणा से वह अपने-आप ठीक नहीं चलने लगती।";
  if (/एक ही कार्यशाला/.test(argument)) return "एक कार्यशाला कुछ मदद कर सकती है, लेकिन वह भविष्य की लगभग हर कठिनाई का अकेला समाधान नहीं बन जाती।";
  if (/भारी वाहन/.test(argument) && /(?:अधिकांश समय बंद|स्थायी रूप से खत्म|स्थायी रूप से बंद)/.test(argument)) return "सीमित समय का प्रतिबंध उपयोगी या हानिकारक हो सकता है, लेकिन उससे स्थायी प्रतिबंध या स्थायी स्थानीय नुकसान अपने-आप सिद्ध नहीं होता।";
  if (/कई वर्षों से चल रही/.test(argument) && /बदलाव/.test(argument)) return "किसी व्यवस्था का लंबे समय से चलना यह सिद्ध नहीं करता कि उसमें उचित बदलाव नहीं किया जा सकता।";
  if (/निगरानी से बचना/.test(argument)) return "निगरानी के बारे में सवाल पूछना यह सिद्ध नहीं करता कि कर्मचारी निगरानी से बचना चाहता है; यह बिना प्रमाण की धारणा है।";
  if (/अधिकांश मामले.*धोखाधड़ी|सर्वव्यापी अस्वीकार/.test(argument)) return "कुछ लेन-देन जोखिमपूर्ण हो सकते हैं, लेकिन अधिकांश मामलों को बिना जाँच धोखाधड़ी मानकर सबको रोक देना उचित नहीं है।";
  if (/स्थायी जाम|पूरे शहर/.test(argument)) return "एक सीमित मार्ग-प्रतिबंध से पूरे शहर में स्थायी जाम होगा, यह निष्कर्ष दिए गए कारणों से सिद्ध नहीं होता।";
  if (/बाद की.*शिकायत|बाद की अधिकांश शिकायत/.test(argument)) return "तुरंत स्थायी दंड न देना बाद की शिकायतों को अनदेखा करने के बराबर नहीं है; उनकी अलग से जाँच की जा सकती है।";
''',
    "if (/लापरवाह/.test(argument))",
    "Hindi specific reasons",
)

source = insert_before_once(
    source,
    '  return punjabiFallback(argument);\n}',
    '''  if (/(?:ਮਦਦ ਨੰਬਰ|ਹੈਲਪਲਾਈਨ|ਸੰਪਰਕ)/.test(argument) && /(?:ਕਾਫ਼ੀ|ਇਸ ਸੰਪਰਕ)/.test(argument)) return "ਮਦਦ ਨੰਬਰ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਇੱਕੋ ਸੰਪਰਕ ਹਰ ਸੇਵਾ-ਸਬੰਧੀ ਸਮੱਸਿਆ ਹੱਲ ਕਰ ਦੇਵੇਗਾ, ਇਹ ਮੰਨਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/(?:ਸੈਸ਼ਨ|ਸੈਸ਼ਨ|ਓਰੀਐਂਟੇਸ਼ਨ|ਓਰੀਐਂਟੇਸ਼ਨ|ਬ੍ਰੀਫਿੰਗ)/.test(argument) && /(?:ਖਤਮ|ਘਟ|ਕਾਫ਼ੀ ਹੱਦ)/.test(argument)) return "ਇੱਕ ਸੈਸ਼ਨ ਕੁਝ ਗਲਤਫਹਮੀ ਘਟਾ ਸਕਦਾ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਲਗਭਗ ਸਾਰੀ ਗਲਤਫਹਮੀ ਜਾਂ ਨਿਯਮ-ਉਲੰਘਣਾ ਖਤਮ ਹੋ ਜਾਵੇਗੀ, ਇਹ ਨਤੀਜਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/(?:ਕਾਲ-ਬੈਕ|ਤਸਦੀਕ)/.test(argument) && /(?:ਅਣਭਰੋਸੇਯੋਗ|ਨਾਕਾਮ|ਫੇਲ)/.test(argument)) return "ਇੱਕ ਅਸਫਲ ਤਸਦੀਕ ਜਾਂ ਕਾਲ-ਬੈਕ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ ਕਿ ਅਸਲੀ ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਇਹ ਤਰੀਕਾ ਆਮ ਤੌਰ 'ਤੇ ਅਣਭਰੋਸੇਯੋਗ ਹੈ।";
  if (/ਡੈਸਕਟਾਪ/.test(argument)) return "ਸਮਾਂ-ਸਲਾਟ ਜਾਂ ਅਪਾਇੰਟਮੈਂਟ ਲਈ ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਆਪਣਾ ਮਹਿੰਗਾ ਕੰਪਿਊਟਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਸਹਾਇਤਾ ਜਾਂ ਹੋਰ ਬੁਕਿੰਗ ਵਿਕਲਪ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ।";
  if (/(?:ਕਿਓਸਕ|ਟਰਮੀਨਲ)/.test(argument) && /(?:ਲਾਭਦਾਇਕ ਸੇਵਾ|ਜੋਖਮ|ਸੰਭਾਲ)/.test(argument)) return "ਆਟੋਮੈਟਿਕ ਸੇਵਾ ਦੀਆਂ ਹੱਦਾਂ ਹੋ ਸਕਦੀਆਂ ਹਨ, ਪਰ ਬੈਕਅੱਪ ਸਹਾਇਤਾ ਅਤੇ ਕ੍ਰਮਵਾਰ ਬਦਲਾਅ ਨਾਲ ਇਸ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੇਕਾਰ ਜਾਂ ਜੋਖਮ-ਰਹਿਤ ਮੰਨਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/ਅਪਾਇੰਟਮੈਂਟ ਸਲਾਟ/.test(argument) && /ਅਮਲ ਵਿੱਚ ਔਖਾ/.test(argument)) return "ਅਪਾਇੰਟਮੈਂਟ ਸਲਾਟ ਕੁਝ ਮੁਸ਼ਕਲ ਪੈਦਾ ਕਰ ਸਕਦੇ ਹਨ, ਪਰ ਇਸ ਨਾਲ ਸੇਵਾ ਲੰਬੇ ਸਮੇਂ ਲਈ ਅਮਲ ਵਿੱਚ ਅਸੰਭਵ ਨਹੀਂ ਹੋ ਜਾਂਦੀ।";
  if (/ਨਿੱਜੀ ਟੈਬਲੈਟ/.test(argument) && /ਗੈਰ-ਅਧਿਕਾਰਤ ਰਿਕਾਰਡਿੰਗ/.test(argument)) return "ਗੈਰ-ਅਧਿਕਾਰਤ ਰਿਕਾਰਡਿੰਗ ਦਾ ਜੋਖਮ ਨਿਯਮਾਂ ਨੂੰ ਜਾਇਜ਼ ਬਣਾ ਸਕਦਾ ਹੈ, ਪਰ ਹਰ ਵਾਜਬ ਅਪਵਾਦ ਨੂੰ ਰੱਦ ਕਰਨ ਦਾ ਆਧਾਰ ਨਹੀਂ ਬਣਦਾ।";
  if (/(?:ਸਦਾ ਲਈ ਖਤਮ|ਅਕਸਰ ਲਈ ਖਤਮ|ਸਦਾ ਲਈ ਬਰਬਾਦ|ਜ਼ਿਆਦਾਤਰ ਵੇਲੇ ਬੰਦ)/.test(argument)) return "ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਤੋਂ ਸਥਾਈ ਨੁਕਸਾਨ ਜਾਂ ਹਮੇਸ਼ਾਂ ਲਈ ਪਾਬੰਦੀ ਦੀ ਲੋੜ ਆਪਣੇ ਆਪ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦੀ।";
  if (/ਜ਼ਿਆਦਾਤਰ ਮਾਮਲੇ ਧੋਖਾਧੜੀ|ਕੇਵਲ ਆਟੋਮੈਟਿਕ ਬਲਾਕ/.test(argument)) return "ਕੁਝ ਲੈਣ-ਦੇਣ ਜੋਖਮ ਵਾਲੇ ਹੋ ਸਕਦੇ ਹਨ, ਪਰ ਜ਼ਿਆਦਾਤਰ ਮਾਮਲਿਆਂ ਨੂੰ ਬਿਨਾਂ ਜਾਂਚ ਧੋਖਾਧੜੀ ਮੰਨ ਕੇ ਸਭ ਨੂੰ ਰੋਕਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।";
  if (/ਲੰਬੇ ਸਮੇਂ ਦਾ ਜਾਮ|ਪੂਰੇ ਸ਼ਹਿਰ/.test(argument)) return "ਇੱਕ ਸੀਮਿਤ ਰਸਤਾ-ਪਾਬੰਦੀ ਨਾਲ ਪੂਰੇ ਸ਼ਹਿਰ ਵਿੱਚ ਲੰਬੇ ਸਮੇਂ ਦਾ ਜਾਮ ਪੈ ਜਾਵੇਗਾ, ਇਹ ਨਤੀਜਾ ਦਿੱਤੇ ਕਾਰਨਾਂ ਨਾਲ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ।";
  if (/ਬਾਅਦ ਦੀਆਂ [ਸ਼ਸ਼]ਿਕਾਇਤਾਂ/.test(argument)) return "ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਨਾ ਦੇਣਾ ਬਾਅਦ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨ ਦੇ ਬਰਾਬਰ ਨਹੀਂ; ਹਰ ਸ਼ਿਕਾਇਤ ਦੀ ਵੱਖਰੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।";
''',
    "ਮਦਦ ਨੰਬਰ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ",
    "Punjabi specific reasons",
)

technical_anchor = '.replace(/ਵਿਭਾਗੀ ਟੈਸਟ ਦਾ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸੀ/g, "ਵਿਭਾਗੀ ਟੈਸਟ ਦੇ ਜ਼ਿਆਦਾਤਰ ਉਮੀਦਵਾਰ ਅਤੇ ਕੇਂਦਰ ਪ੍ਰਭਾਵਿਤ ਸਨ")'
source = insert_after_once(
    source,
    technical_anchor,
    '\n    .replace(/ਸੁਤੰਤਰ ਜਾਂਚ ਇਕੱਲੇ ਸਮਝੌਤੇ ਵਾਲੀ ਹਮਲਾ-ਕੜੀ ਤੋੜਦੀ ਹੈ/g, "ਸੁਤੰਤਰ ਜਾਂਚ ਨਾਲ ਕੇਵਲ ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ ਵੇਰਵੇ ਬਦਲਾਅ ਲਈ ਕਾਫ਼ੀ ਨਹੀਂ ਰਹਿੰਦੇ")'
    + '\n    .replace(/ਇਹ ਨਿਯੰਤਰਣ ਦੀ ਅਸਲੀ ਡਿਜ਼ਾਇਨ-ਸ਼ਰਤ ਹੈ/g, "ਇਹ ਸੁਰੱਖਿਆ ਪ੍ਰਬੰਧ ਦੀ ਅਸਲੀ ਲੋੜ ਹੈ")',
    "ਸੁਤੰਤਰ ਜਾਂਚ ਨਾਲ ਕੇਵਲ ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ ਵੇਰਵੇ",
    "Punjabi technical-language cleanup",
)

proof = insert_after_once(
    proof,
    '    /\\breadily renewed plan\\b/i,',
    '\n    /The argument assumes that .*does not provide enough support/i,',
    "The argument assumes that .*does not provide enough support",
    "English fallback guard",
)
proof = insert_after_once(
    proof,
    '    /अधिकांश केंद्र का परिणाम/,',
    '\n    /यह तर्क मान लेता है कि/,',
    "यह तर्क मान लेता है कि",
    "Hindi fallback guard",
)
proof = insert_after_once(
    proof,
    '    /ਕੇਂਰ/,',
    '\n    /ਇਹ ਦਲੀਲ ਮੰਨ ਲੈਂਦੀ ਹੈ ਕਿ/,\n    /ਹਮਲਾ-ਕੜੀ/,\n    /ਡਿਜ਼ਾਇਨ-ਸ਼ਰਤ/,',
    "ਇਹ ਦਲੀਲ ਮੰਨ ਲੈਂਦੀ ਹੈ ਕਿ",
    "Punjabi fallback guard",
)

SOURCE_PATH.write_text(source, encoding="utf-8")
PROOF_PATH.write_text(proof, encoding="utf-8")
print("ARG-001 CP015 V8 simple-explanations patch applied")
