from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

# QL004: cover both the older "temporary restriction" phrasing and the newer
# anti-gaming surface that describes a "small limit on heavy vehicles" causing
# permanent destruction of most nearby activity.
old = '  if (/अस्थायी प्रतिबंध.*(?:आसपास|स्थानीय).*(?:अधिकांश|ज्यादातर).*(?:गतिविधि|गतिविधियों).*(?:स्थायी रूप से समाप्त|स्थायी रूप से खत्म|खत्म)/.test(argument)) return "अस्थायी भारी-वाहन प्रतिबंध से कुछ स्थानीय गतिविधि प्रभावित हो सकती है, लेकिन इससे आसपास की अधिकांश गतिविधियाँ स्थायी रूप से समाप्त हो जाएँगी, यह निष्कर्ष उचित नहीं है।";\n'
new = '  if (/(?:अस्थायी प्रतिबंध|भारी वाहनों की थोड़ी-सी सीमा).*?(?:आसपास|स्थानीय).*(?:अधिकांश|ज्यादातर).*(?:गतिविधि|गतिविधियों).*(?:स्थायी रूप से (?:समाप्त|खत्म|बर्बाद)|खत्म)/.test(argument)) return "अस्थायी या सीमित भारी-वाहन रोक से कुछ स्थानीय गतिविधि प्रभावित हो सकती है, लेकिन इससे आसपास की अधिकांश गतिविधि स्थायी रूप से बर्बाद हो जाएगी, यह निष्कर्ष उचित नहीं है।";\n'

if new not in source:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"QL004 Hindi activity routing hotfix: expected exactly one old rule, found {count}")
    source = source.replace(old, new, 1)

# QL006: first-time overseas card use is a risk signal, not proof that most such
# transactions are fraudulent. Keep the weak-argument explanation tied to the
# actual fraud-overreach instead of the generic localized fallback.
hindi_fallback_anchor = '  return hindiFallback(argument);\n}'
punjabi_fallback_anchor = '  return punjabiFallback(argument);\n}'

ql006_hindi_reason = 'पहली बार विदेश में कार्ड उपयोग असामान्य हो सकता है, लेकिन इससे अधिकांश ऐसी खरीद को धोखाधड़ी नहीं माना जा सकता; जोखिम-संकेत की जाँच और अनुपातिक पुष्टि अधिक उचित है।'
ql006_hindi_rule = f'  if (/पहली बार विदेश में कार्ड उपयोग.*(?:अधिकांश|ज्यादातर).*(?:घटना|लेन-देन|खरीद).*(?:धोखाधड़ी|फ्रॉड)/.test(argument)) return "{ql006_hindi_reason}";\n'
if ql006_hindi_reason not in source:
    count = source.count(hindi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL006 Hindi overseas-fraud reason: expected exactly one Hindi fallback anchor, found {count}")
    source = source.replace(hindi_fallback_anchor, ql006_hindi_rule + hindi_fallback_anchor, 1)

ql006_punjabi_reason = 'ਪਹਿਲੀ ਵਾਰ ਵਿਦੇਸ਼ ਵਿੱਚ ਕਾਰਡ ਵਰਤੋਂ ਅਸਧਾਰਣ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਕਰਕੇ ਜ਼ਿਆਦਾਤਰ ਅਜਿਹੀਆਂ ਖਰੀਦਾਂ ਨੂੰ ਧੋਖਾਧੜੀ ਨਹੀਂ ਮੰਨਿਆ ਜਾ ਸਕਦਾ; ਜੋਖਮ-ਸੰਕੇਤ ਦੀ ਜਾਂਚ ਅਤੇ ਅਨੁਪਾਤਿਕ ਪੁਸ਼ਟੀ ਵਧੇਰੇ ਉਚਿਤ ਹੈ।'
ql006_punjabi_rule = f'  if (/ਪਹਿਲੀ ਵਾਰ.*ਵਿਦੇਸ਼.*ਕਾਰਡ.*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਘਟਨਾ|ਲੈਣ-ਦੇਣ|ਖਰੀਦ).*(?:ਧੋਖਾਧੜੀ|ਫਰਾਡ)/.test(argument)) return "{ql006_punjabi_reason}";\n'
if ql006_punjabi_reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL006 Punjabi overseas-fraud reason: expected exactly one Punjabi fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, ql006_punjabi_rule + punjabi_fallback_anchor, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 localized QL004/QL006 routing hotfix applied")
