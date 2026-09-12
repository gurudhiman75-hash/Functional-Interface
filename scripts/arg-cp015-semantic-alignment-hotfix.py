from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

# QL001 Hindi queue-sufficiency family. This specific family must run before
# the broad complaint/evidence matcher because some queue-service surfaces also
# contain words such as "शिकायत" and "पर्याप्त".
hindi_reason = 'अधिक देर तक काउंटर खुला रखने से कतार कम हो सकती है, लेकिन केवल इसी उपाय को पर्याप्त मान लेना उचित नहीं है; मांग और सेवा-क्षमता भी महत्वपूर्ण हैं।'
hindi_rule = f'  if (/कतार/.test(argument) && /(?:पर्याप्त|काफ़ी|इसी उपाय)/.test(argument)) return "{hindi_reason}";\n'
hindi_complaint_anchor = '  if (/धोखाधड़ी|शिकायत|आरोप|संकेत|फ्लैग/.test(argument) && /प्रमाण|दोष|पर्याप्त/.test(argument)) return "शिकायत, संकेत या फ्लैग जाँच शुरू करने का आधार हो सकता है, लेकिन वह अपने-आप दोष का निर्णायक प्रमाण नहीं है।";\n'

if hindi_rule in source:
    source = source.replace(hindi_rule, "", 1)
count = source.count(hindi_complaint_anchor)
if count != 1:
    raise SystemExit(f"Hindi queue-sufficiency semantic repair: expected one complaint-evidence anchor, found {count}")
source = source.replace(hindi_complaint_anchor, hindi_rule + hindi_complaint_anchor, 1)

# QL001 Punjabi contact-sufficiency family: phrases such as "ਸ਼ਿਕਾਇਤ ਸੰਪਰਕ
# ਨੰਬਰ" contain the token for complaint, so the broad complaint/evidence rule
# must not misclassify them as guilt-evidence arguments.
punjabi_complaint_anchor = '  if (/ਧੋਖਾਧੜੀ|ਸ਼ਿਕਾਇਤ|ਸ਼ਿਕਾਇਤ|ਦੋਸ਼|ਦੋਸ਼|ਫਲੈਗ|ਸੰਕੇਤ/.test(argument) && /ਸਬੂਤ|ਦੋਸ਼|ਦੋਸ਼|ਕਾਫ਼ੀ/.test(argument)) return "ਸ਼ਿਕਾਇਤ, ਫਲੈਗ ਜਾਂ ਹੋਰ ਸੰਕੇਤ ਜਾਂਚ ਦਾ ਆਧਾਰ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਉਹ ਆਪਣੇ ਆਪ ਦੋਸ਼ ਦਾ ਫੈਸਲਾਕੁੰਨ ਸਬੂਤ ਨਹੀਂ ਹੈ।";\n'
punjabi_reason = 'ਸੰਪਰਕ ਨੰਬਰ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਇਕੱਲੇ ਇਸੇ ਸੰਪਰਕ ਨੂੰ ਹਰ ਸੇਵਾ ਜਾਂ ਭੁਗਤਾਨ-ਸਬੰਧੀ ਸਮੱਸਿਆ ਦੇ ਹੱਲ ਲਈ ਕਾਫ਼ੀ ਮੰਨਣਾ ਠੀਕ ਨਹੀਂ ਹੈ।'
punjabi_rule = f'  if (/(?:ਮਦਦ ਨੰਬਰ|ਹੈਲਪਲਾਈਨ|ਸੰਪਰਕ ਨੰਬਰ|ਸੰਪਰਕ)/.test(argument) && /(?:ਕਾਫ਼ੀ|ਇਸ ਸੰਪਰਕ|ਇਸੇ ਸੰਪਰਕ)/.test(argument)) return "{punjabi_reason}";\n'
if punjabi_rule in source:
    source = source.replace(punjabi_rule, "", 1)
count = source.count(punjabi_complaint_anchor)
if count != 1:
    raise SystemExit(f"Punjabi contact-sufficiency semantic repair: expected one complaint-evidence anchor, found {count}")
source = source.replace(punjabi_complaint_anchor, punjabi_rule + punjabi_complaint_anchor, 1)

# QL002 Punjabi approval family: repair grammatical agreement and route the
# failed-approval anecdote to the same one-case-does-not-prove-most logic used
# for verification/check wording.
repair_anchor = '    .replace(/ਪ੍ਰਾਪਤ ਕਰਨ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਸ਼ਾਇਦ ਗੁਆ ਦੇਣਗੇ/g, "ਹਾਸਲ ਕਰਨ ਦੀ ਆਪਣੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਗੁਆ ਸਕਦੇ ਹਨ")'
approval_repairs = [
    '    .replace(/ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਪੂਰਾ ਕਰਨਾ/g, "ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਦੇਣੀ")',
    '    .replace(/ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਇਹ ਰੋਕ ਸਕਦਾ ਹੈ/g, "ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਇਹ ਰੋਕ ਸਕਦੀ ਹੈ")',
    '    .replace(/ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਵਿੱਚ ਫੇਲ ਹੋਇਆ ਸੀ/g, "ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਪੂਰੀ ਨਹੀਂ ਕਰ ਸਕਿਆ ਸੀ")',
]
for repair in approval_repairs:
    if repair not in source:
        count = source.count(repair_anchor)
        if count != 1:
            raise SystemExit(f"Punjabi approval grammar repair: expected one repair anchor, found {count}")
        source = source.replace(repair_anchor, repair_anchor + '\n' + repair, 1)

punjabi_fallback_anchor = '  return punjabiFallback(argument);\n}'
approval_reason = 'ਇੱਕ ਵਰਤੋਂਕਾਰ ਦਾ ਇਨ-ਐਪ ਮਨਜ਼ੂਰੀ ਪੂਰੀ ਨਾ ਕਰ ਸਕਣਾ ਸਿਰਫ਼ ਇੱਕ ਘਟਨਾ ਹੈ; ਇਸ ਤੋਂ ਇਹ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ ਕਿ ਇਹ ਤਰੀਕਾ ਜ਼ਿਆਦਾਤਰ ਵਾਜਬ ਬਦਲਾਵਾਂ ਲਈ ਅਣਭਰੋਸੇਯੋਗ ਹੈ।'
approval_rule = f'  if (/ਇੱਕ ਵਰਤੋਂਕਾਰ.*(?:ਇਨ-ਐਪ )?ਮਨਜ਼ੂਰੀ.*(?:ਪੂਰੀ ਨਹੀਂ ਕਰ ਸਕਿਆ|ਫੇਲ|ਅਸਫਲ).*(?:ਵਾਜਬ|ਅਸਲੀ).*(?:ਬਦਲਾਵ|ਬਦਲਾਅ|ਬੇਨਤੀ)/.test(argument)) return "{approval_reason}";\n'
if approval_reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"Punjabi approval semantic repair: expected one fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, approval_rule + punjabi_fallback_anchor, 1)

# QL003 Punjabi digital-exam rollout family. Keep the weak claims logically weak,
# but render them in natural Punjabi rather than machine-translated agreement.
ql003_repairs = [
    '    .replace(/ਪੂਰੀ ਤਰ੍ਹਾਂ ਡਿਜ਼ਿਟਲ ਪ੍ਰੀਖਿਆ ਕੇਂਦਰ ਉੱਤੇ ਲਿਆਂਦਾ ਜਾਣਾ/g, "ਪੂਰੀ ਤਰ੍ਹਾਂ ਡਿਜ਼ਿਟਲ ਪ੍ਰੀਖਿਆ ਕੇਂਦਰਾਂ ਵਿੱਚ ਕਰਵਾਇਆ ਜਾਣਾ")',
    '    .replace(/ਸਥਿਰ ਕਨੈਕਟਿਵਿਟੀ ਜੋ ਵੀ ਹੋਣ/g, "ਭਾਵੇਂ ਸਥਿਰ ਕਨੈਕਟਿਵਿਟੀ ਉਪਲਬਧ ਹੋਵੇ")',
    '    .replace(/ਸੁਰੱਖਿਅਤ ਡਿਵਾਈਸ ਅਤੇ ਕੇਂਦਰ ਜੋ ਵੀ ਹੋਣ/g, "ਭਾਵੇਂ ਸੁਰੱਖਿਅਤ ਡਿਵਾਈਸ ਅਤੇ ਕੇਂਦਰ ਉਪਲਬਧ ਹੋਣ")',
    '    .replace(/ਜ਼ਿਆਦਾਤਰ ਥਾਂ ਦੋ ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਸਿੱਧੇ ਉਪਲਬਧ/g, "ਜ਼ਿਆਦਾਤਰ ਥਾਵਾਂ \'ਤੇ ਦੋ ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਆਪਣੇ ਆਪ ਉਪਲਬਧ")',
]
for repair in ql003_repairs:
    if repair not in source:
        count = source.count(repair_anchor)
        if count != 1:
            raise SystemExit(f"Punjabi QL003 digital-rollout repair: expected one repair anchor, found {count}")
        source = source.replace(repair_anchor, repair_anchor + '\n' + repair, 1)

# Give rollout-capacity weak arguments dimension-specific reasons. These rules
# must precede broader Punjabi reason matchers so connectivity/devices are not
# explained as a generic staffing or security issue.
punjabi_reason_function_anchor = 'function specificPunjabiReason(argument: string): string {\n'
connectivity_reason = 'ਕੇਵਲ ਫੈਸਲਾ ਘੋਸ਼ਿਤ ਕਰਨ ਨਾਲ ਲੋੜੀਂਦੀ ਸਥਿਰ ਕਨੈਕਟਿਵਿਟੀ ਆਪਣੇ ਆਪ ਉਪਲਬਧ ਨਹੀਂ ਹੋ ਜਾਂਦੀ; ਦੋ ਹਫ਼ਤਿਆਂ ਦੀ ਤਿਆਰੀ ਲਈ ਨੈੱਟਵਰਕ ਸਮਰੱਥਾ ਦੀ ਵੱਖਰੀ ਜਾਂਚ ਅਤੇ ਯੋਜਨਾ ਚਾਹੀਦੀ ਹੈ।'
connectivity_rule = f'  if (/ਫੈਸਲਾ ਘੋਸ਼ਿਤ.*ਕਨੈਕਟਿਵਿਟੀ.*(?:ਉਪਲਬਧ ਹੋ ਜਾਵੇਗੀ|ਉਪਲਬਧ ਹੋਵੇਗੀ)/.test(argument)) return "{connectivity_reason}";\n'
devices_reason = 'ਕੇਵਲ ਫੈਸਲਾ ਘੋਸ਼ਿਤ ਕਰਨ ਨਾਲ ਲੋੜੀਂਦੇ ਸੁਰੱਖਿਅਤ ਡਿਵਾਈਸ ਅਤੇ ਕੇਂਦਰ ਦੋ ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਆਪਣੇ ਆਪ ਤਿਆਰ ਨਹੀਂ ਹੋ ਜਾਂਦੇ; ਉਪਕਰਣ ਅਤੇ ਕੇਂਦਰ-ਸਮਰੱਥਾ ਦੀ ਵੱਖਰੀ ਯੋਜਨਾ ਚਾਹੀਦੀ ਹੈ।'
devices_rule = f'  if (/ਫੈਸਲਾ ਘੋਸ਼ਿਤ.*ਸੁਰੱਖਿਅਤ ਡਿਵਾਈਸ ਅਤੇ ਕੇਂਦਰ.*(?:ਉਪਲਬਧ ਹੋ ਜਾਣਗੇ|ਉਪਲਬਧ)/.test(argument)) return "{devices_reason}";\n'
for rule, reason in [(connectivity_rule, connectivity_reason), (devices_rule, devices_reason)]:
    if reason not in source:
        count = source.count(punjabi_reason_function_anchor)
        if count != 1:
            raise SystemExit(f"Punjabi QL003 rollout reason: expected one function anchor, found {count}")
        source = source.replace(punjabi_reason_function_anchor, punjabi_reason_function_anchor + rule, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 localized semantic-alignment, Punjabi approval and QL003 rollout hotfix applied")
