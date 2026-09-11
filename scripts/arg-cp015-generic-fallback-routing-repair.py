from pathlib import Path

ROOT = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001")
SOURCE_PATH = ROOT / "cp015-final-editorial-quality.ts"
GRAMMAR_PATH = ROOT / "cp015-anti-gaming-grammar-polish.ts"
source = SOURCE_PATH.read_text(encoding="utf-8")
grammar = GRAMMAR_PATH.read_text(encoding="utf-8")

helper = '''function genericFallbackReason(reason: string, language: Language): boolean {
  if (language === "hi") return /^यह तर्क मान लेता है कि/.test(reason);
  if (language === "pa") return /^ਇਹ ਦਲੀਲ ਮੰਨ ਲੈਂਦੀ ਹੈ ਕਿ/.test(reason);
  return /^The argument assumes that .*does not provide enough support/i.test(reason);
}

'''
helper_anchor = "function duplicateReason(language: Language): string {"
if "function genericFallbackReason(" not in source:
    count = source.count(helper_anchor)
    if count != 1:
        raise SystemExit(f"generic fallback helper: expected exactly one anchor, found {count}")
    source = source.replace(helper_anchor, helper + helper_anchor, 1)

english_fallback_anchor = '  return englishFallback(argument);\n}'
hindi_fallback_anchor = '  return hindiFallback(argument);\n}'
punjabi_fallback_anchor = '  return punjabiFallback(argument);\n}'

# The V8 plain-language script historically inserted several English rules as one
# block. Make the renewal family independently idempotent so a pre-existing rule
# cannot accidentally suppress this one.
renewal_reason = 'A reminder may influence some users, but it does not show that nobody would choose to continue the plan; informed choice can still be a legitimate objective.'
renewal_rule = f'  if (/nobody will ever choose (?:a|an) automatically renewed plan/i.test(argument)) return "{renewal_reason}";\n'
if renewal_reason not in source:
    count = source.count(english_fallback_anchor)
    if count != 1:
        raise SystemExit(f"renewal-specific reason: expected exactly one English fallback anchor, found {count}")
    source = source.replace(english_fallback_anchor, renewal_rule + english_fallback_anchor, 1)

# QL004 residual weak families exposed only after final editorial quality was wired
# into the actual CP015 generator path. Keep these reasons direct and exam-like.
ql004_business_reason = 'A temporary traffic restriction may inconvenience some businesses, but it does not show that most nearby businesses will permanently close.'
ql004_business_rule = f'  if (/temporary restriction on heavy vehicles/i.test(argument) && /most nearby business(?:es)? permanently/i.test(argument)) return "{ql004_business_reason}";\n'
if ql004_business_reason not in source:
    count = source.count(english_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL004 business-closure reason: expected exactly one English fallback anchor, found {count}")
    source = source.replace(english_fallback_anchor, ql004_business_rule + english_fallback_anchor, 1)

ql004_legacy_reason = 'A long-standing traffic pattern is not automatically fair or untouchable; the argument gives no reason why a limited change would itself be unfair.'
ql004_legacy_rule = f'  if (/existing traffic pattern has been in place for years/i.test(argument) && /changing it would readily be unfair/i.test(argument)) return "{ql004_legacy_reason}";\n'
if ql004_legacy_reason not in source:
    count = source.count(english_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL004 long-standing-pattern reason: expected exactly one English fallback anchor, found {count}")
    source = source.replace(english_fallback_anchor, ql004_legacy_rule + english_fallback_anchor, 1)

# QL006 can express the same fraud-overreach trap through several transaction
# contexts. Keep each explanation tied to the actual transaction category rather
# than allowing the generic weak-argument fallback to leak into learner copy.
ql006_overseas_reason = 'First-time overseas card use can be legitimate travel or emergency spending, so treating most such transactions as fraud does not justify automatic blocking in every case.'
ql006_overseas_rule = f'  if (/first-time overseas card use/i.test(argument) && /(?:most instances|treated as fraudulent)/i.test(argument)) return "{ql006_overseas_reason}";\n'
if ql006_overseas_reason not in source:
    count = source.count(english_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL006 first-time-overseas reason: expected exactly one English fallback anchor, found {count}")
    source = source.replace(english_fallback_anchor, ql006_overseas_rule + english_fallback_anchor, 1)

# QL001 localized anti-gaming rewrites turn the old absolute "every item is
# useless" distractor into a softer "most information is useless" claim. Give
# that exact claim a contextual reason in both localized surfaces rather than
# routing it to the generic weak-argument fallback.
ql001_hindi_reason = 'प्रक्रिया पूरी होने के बाद भी शिकायत, परिणाम या सुधार से जुड़ी जानकारी उपयोगी रह सकती है; केवल प्रक्रिया समाप्त हो जाने से वह जानकारी बेकार नहीं हो जाती।'
ql001_hindi_rule = f'  if (/प्रक्रिया पूरी होते ही.*अधिकांश जानकारी.*(?:सीधे )?बेकार हो जाती है/.test(argument)) return "{ql001_hindi_reason}";\n'
if ql001_hindi_reason not in source:
    count = source.count(hindi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL001 Hindi post-process reason: expected exactly one Hindi fallback anchor, found {count}")
    source = source.replace(hindi_fallback_anchor, ql001_hindi_rule + hindi_fallback_anchor, 1)

ql001_punjabi_reason = 'ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਵੀ ਸ਼ਿਕਾਇਤ, ਨਤੀਜੇ ਜਾਂ ਸੁਧਾਰ ਨਾਲ ਜੁੜੀ ਜਾਣਕਾਰੀ ਲਾਭਦਾਇਕ ਰਹਿ ਸਕਦੀ ਹੈ; ਕੇਵਲ ਪ੍ਰਕਿਰਿਆ ਖਤਮ ਹੋਣ ਨਾਲ ਉਹ ਜਾਣਕਾਰੀ ਬੇਕਾਰ ਨਹੀਂ ਹੋ ਜਾਂਦੀ।'
ql001_punjabi_rule = f'  if (/ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ.*ਜ਼ਿਆਦਾਤਰ ਜਾਣਕਾਰੀ.*(?:ਸਿੱਧੇ )?ਬੇਕਾਰ ਹੋ ਜਾਂਦੀ ਹੈ/.test(argument)) return "{ql001_punjabi_reason}";\n'
if ql001_punjabi_reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL001 Punjabi post-process reason: expected exactly one Punjabi fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, ql001_punjabi_rule + punjabi_fallback_anchor, 1)

# QL002's recorded/self-paced training family has a valid implementation trade-off,
# but the weak distractor overstates it by claiming that replacing live sessions
# destroys virtually all learning capacity. Explain that concrete flaw directly in
# Hindi and Punjabi instead of falling back to a generic "insufficient support" line.
ql002_hindi_reason = 'स्व-गति या रिकॉर्डेड मॉड्यूल में लाइव मार्गदर्शन की कुछ कमी हो सकती है, लेकिन इससे कर्मचारियों की सीखने या प्रशिक्षण से लाभ लेने की सारी क्षमता खत्म नहीं हो जाती।'
ql002_hindi_rule = f'  if (/(?:स्व-गति स्लाइड मॉड्यूल|रिकॉर्ड किए वीडियो मॉड्यूल|स्वचालित ट्यूटोरियल|पूर्व-रिकॉर्ड वेबिनार)/.test(argument) && /(?:सारी क्षमता|क्षमता.*खो देंगे)/.test(argument)) return "{ql002_hindi_reason}";\n'
if ql002_hindi_reason not in source:
    count = source.count(hindi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL002 Hindi self-paced-training reason: expected exactly one Hindi fallback anchor, found {count}")
    source = source.replace(hindi_fallback_anchor, ql002_hindi_rule + hindi_fallback_anchor, 1)

ql002_punjabi_reason = 'ਸਵੈ-ਗਤੀ ਜਾਂ ਰਿਕਾਰਡ ਕੀਤੇ ਮੋਡੀਊਲਾਂ ਵਿੱਚ ਲਾਈਵ ਮਾਰਗਦਰਸ਼ਨ ਦੀ ਕੁਝ ਕਮੀ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਕਰਮਚਾਰੀਆਂ ਦੀ ਸਿੱਖਣ ਜਾਂ ਟ੍ਰੇਨਿੰਗ ਤੋਂ ਲਾਭ ਲੈਣ ਦੀ ਸਾਰੀ ਸਮਰੱਥਾ ਖਤਮ ਨਹੀਂ ਹੋ ਜਾਂਦੀ।'
ql002_punjabi_rule = f'  if (/(?:ਸਵੈ-ਗਤੀ ਸਲਾਈਡ ਮੋਡੀਊਲ|ਰਿਕਾਰਡ ਕੀਤੇ ਵੀਡੀਓ ਮੋਡੀਊਲ|ਆਟੋਮੈਟਿਕ ਟਿਊਟੋਰਿਅਲ|ਪਹਿਲਾਂ ਰਿਕਾਰਡ ਵੈਬਿਨਾਰ)/.test(argument) && /(?:ਸਾਰੀ ਸਮਰੱਥਾ|ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ|ਸਮਰੱਥਾ.*ਗੁਆ)/.test(argument)) return "{ql002_punjabi_reason}";\n'
if ql002_punjabi_reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL002 Punjabi self-paced-training reason: expected exactly one Punjabi fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, ql002_punjabi_rule + punjabi_fallback_anchor, 1)

# QL002 also contains a verification-overclaim distractor. CP015 deliberately
# softens the historical absolute "every fraud attempt is impossible" wording,
# but "most future fraud becomes impractical" is still too broad to be a strong
# argument. Explain that exact overreach directly in both localized surfaces.
ql002_verification_hindi_reason = 'अतिरिक्त सत्यापन धोखाधड़ी का जोखिम घटा सकता है, लेकिन केवल एक दूसरा सत्यापन कदम भविष्य की अधिकांश धोखाधड़ी रोक देगा, यह निष्कर्ष उचित नहीं है।'
ql002_verification_hindi_rule = f'  if (/कोई भी दूसरा सत्यापन कदम.*(?:भविष्य की )?(?:अधिकांश|ज्यादातर) धोखाधड़ी.*(?:अव्यावहारिक|रोक)/.test(argument)) return "{ql002_verification_hindi_reason}";\n'
if ql002_verification_hindi_reason not in source:
    count = source.count(hindi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL002 Hindi verification-overclaim reason: expected exactly one Hindi fallback anchor, found {count}")
    source = source.replace(hindi_fallback_anchor, ql002_verification_hindi_rule + hindi_fallback_anchor, 1)

ql002_verification_punjabi_reason = 'ਵਾਧੂ ਤਸਦੀਕ ਧੋਖਾਧੜੀ ਦਾ ਜੋਖਮ ਘਟਾ ਸਕਦੀ ਹੈ, ਪਰ ਕੇਵਲ ਇੱਕ ਹੋਰ ਤਸਦੀਕੀ ਕਦਮ ਨਾਲ ਭਵਿੱਖ ਦੀ ਜ਼ਿਆਦਾਤਰ ਧੋਖਾਧੜੀ ਰੁਕ ਜਾਵੇਗੀ, ਇਹ ਨਤੀਜਾ ਠੀਕ ਨਹੀਂ ਹੈ।'
ql002_verification_punjabi_rule = f'  if (/ਕੋਈ ਵੀ ਦੂਜਾ ਤਸਦੀਕੀ ਕਦਮ.*(?:ਭਵਿੱਖ ਦੀ )?ਜ਼ਿਆਦਾਤਰ ਧੋਖਾਧੜੀ.*(?:ਅਮਲ ਵਿੱਚ ਔਖਾ|ਰੁਕ)/.test(argument)) return "{ql002_verification_punjabi_reason}";\n'
if ql002_verification_punjabi_reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL002 Punjabi verification-overclaim reason: expected exactly one Punjabi fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, ql002_verification_punjabi_rule + punjabi_fallback_anchor, 1)

# The finalizer already runs every argument through repairSurface before reason
# selection. Assert that V8's English article repair is present so the repaired
# argument exposed to the rule is grammatical as well as semantically specific.
article_repair = '.replace(/\\ba automatically renewed plan\\b/gi, "an automatically renewed plan")'
if article_repair not in source:
    raise SystemExit("renewal article repair missing after V8 plain-language repair")

# The preceding V8 grammar repair pluralizes "instance". Capitalize both the
# singular source form and the pluralized form after Yes./No. so the final exam
# surface never contains "Yes. most instances ...".
old_capitalization = '.replace(/\\b(Yes|No)\\.\\s+most instance\\b/gi, "$1. Most instances")'
new_capitalization = '.replace(/\\b(Yes|No)\\.\\s+most instances?\\b/gi, "$1. Most instances")'
if new_capitalization not in grammar:
    count = grammar.count(old_capitalization)
    if count != 1:
        raise SystemExit(f"most-instances capitalization: expected exactly one anchor, found {count}")
    grammar = grammar.replace(old_capitalization, new_capitalization, 1)

old = 'if (strengths[index] === "WEAK" && boilerplateReason(reason, language)) return specificReason(deduped.arguments[index]!, language);'
new = 'if (strengths[index] === "WEAK" && (boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'
if new not in source:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"generic fallback routing: expected exactly one anchor, found {count}")
    source = source.replace(old, new, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
GRAMMAR_PATH.write_text(grammar, encoding="utf-8")
print("ARG-001 CP015 generic fallback routing and localized QL001/QL002 verification repair applied")
