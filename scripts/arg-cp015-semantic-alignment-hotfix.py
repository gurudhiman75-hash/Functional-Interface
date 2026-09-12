from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

# Hindi QL001 queue-sufficiency family: a weak argument that longer opening
# hours alone are sufficient for the queue problem must not be routed to the
# generic implementation-obstacle explanation merely because it contains the
# word "कतार".
hindi_anchor = '  if (/समय-स्लॉट|कतार|पुनर्निर्माण/.test(argument)) return "यह तर्क प्रस्तावित व्यवस्था के लिए एक बड़े कार्यान्वयन अवरोध को बिना प्रमाण मान लेता है और कम-कठोर विकल्पों पर विचार नहीं करता।";\n'
hindi_reason = 'अधिक देर तक काउंटर खुला रखने से कतार कम हो सकती है, लेकिन केवल इसी उपाय को पर्याप्त मान लेना उचित नहीं है; मांग और सेवा-क्षमता भी महत्वपूर्ण हैं।'
hindi_rule = f'  if (/कतार/.test(argument) && /(?:पर्याप्त|काफ़ी|इसी उपाय)/.test(argument)) return "{hindi_reason}";\n'
if hindi_reason not in source:
    count = source.count(hindi_anchor)
    if count != 1:
        raise SystemExit(f"Hindi queue-sufficiency semantic repair: expected one broad queue anchor, found {count}")
    source = source.replace(hindi_anchor, hindi_rule + hindi_anchor, 1)

# Punjabi QL001 contact-sufficiency family: phrases such as "ਸ਼ਿਕਾਇਤ ਸੰਪਰਕ
# ਨੰਬਰ" contain the token for complaint, so the broad complaint/evidence rule
# used to misclassify them as guilt-evidence arguments. Give the concrete
# contact-sufficiency family precedence before that broad rule.
punjabi_complaint_anchor = '  if (/ਧੋਖਾਧੜੀ|ਸ਼ਿਕਾਇਤ|ਸ਼ਿਕਾਇਤ|ਦੋਸ਼|ਦੋਸ਼|ਫਲੈਗ|ਸੰਕੇਤ/.test(argument) && /ਸਬੂਤ|ਦੋਸ਼|ਦੋਸ਼|ਕਾਫ਼ੀ/.test(argument)) return "ਸ਼ਿਕਾਇਤ, ਫਲੈਗ ਜਾਂ ਹੋਰ ਸੰਕੇਤ ਜਾਂਚ ਦਾ ਆਧਾਰ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਉਹ ਆਪਣੇ ਆਪ ਦੋਸ਼ ਦਾ ਫੈਸਲਾਕੁੰਨ ਸਬੂਤ ਨਹੀਂ ਹੈ।";\n'
punjabi_reason = 'ਸੰਪਰਕ ਨੰਬਰ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਇਕੱਲੇ ਇਸੇ ਸੰਪਰਕ ਨੂੰ ਹਰ ਸੇਵਾ ਜਾਂ ਭੁਗਤਾਨ-ਸਬੰਧੀ ਸਮੱਸਿਆ ਦੇ ਹੱਲ ਲਈ ਕਾਫ਼ੀ ਮੰਨਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।'
punjabi_rule = f'  if (/(?:ਮਦਦ ਨੰਬਰ|ਹੈਲਪਲਾਈਨ|ਸੰਪਰਕ ਨੰਬਰ|ਸੰਪਰਕ)/.test(argument) && /(?:ਕਾਫ਼ੀ|ਇਸ ਸੰਪਰਕ|ਇਸੇ ਸੰਪਰਕ)/.test(argument)) return "{punjabi_reason}";\n'
if punjabi_reason not in source:
    count = source.count(punjabi_complaint_anchor)
    if count != 1:
        raise SystemExit(f"Punjabi contact-sufficiency semantic repair: expected one complaint-evidence anchor, found {count}")
    source = source.replace(punjabi_complaint_anchor, punjabi_rule + punjabi_complaint_anchor, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 localized semantic-alignment hotfix applied")
