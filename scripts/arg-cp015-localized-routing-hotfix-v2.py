from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

punjabi_fallback_anchor = '  return punjabiFallback(argument);\n}'

# QL002 Punjabi: one failed check/verification is only one case; it cannot prove
# that most legitimate profile-change requests will be impractical. Accept both
# natural Punjabi terms used by the localized corpus: ਜਾਂਚ and ਤਸਦੀਕ.
ql002_reason = 'ਇੱਕ ਵਰਤੋਂਕਾਰ ਦਾ ਜਾਂਚ ਜਾਂ ਤਸਦੀਕ ਪੂਰੀ ਨਾ ਕਰ ਸਕਣਾ ਕੇਵਲ ਇੱਕ ਘਟਨਾ ਹੈ; ਇਸ ਤੋਂ ਇਹ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ ਕਿ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਜਾਂ ਵਾਜਬ ਬਦਲਾਅ ਦੀਆਂ ਬੇਨਤੀਆਂ ਵੀ ਅਮਲ ਵਿੱਚ ਔਖੀਆਂ ਹੋਣਗੀਆਂ।'
ql002_rule = f'  if (/ਇੱਕ ਵਰਤੋਂਕਾਰ.*(?:ਜਾਂਚ|ਤਸਦੀਕ).*(?:ਪੂਰੀ ਨਾ ਕਰ ਸਕਿਆ|ਪੂਰਾ.*ਨਾ|ਨਾਕਾਮ|ਅਸਫਲ).*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਅਸਲੀ|ਵਾਜਬ).*(?:ਬੇਨਤੀ|ਬਦਲਾਅ).*(?:ਅਮਲ ਵਿੱਚ ਔਖ|ਨਾਕਾਮ|ਅਸਫਲ)/.test(argument)) return "{ql002_reason}";\n'
if ql002_reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL002 Punjabi failed-check reason: expected exactly one Punjabi fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, ql002_rule + punjabi_fallback_anchor, 1)

# QL003 Punjabi: merely announcing a waste-separation rule does not make the
# implementation work without staff training and collection capacity. The corpus
# can place the "without" phrase either before or after those dependencies. Keep
# the two dependency word orders as separate regex checks so the generated
# TypeScript stays simple and syntactically unambiguous.
ql003_reason = 'ਸਟਾਫ ਟ੍ਰੇਨਿੰਗ ਅਤੇ ਕਲੈਕਸ਼ਨ ਸਮਰੱਥਾ ਬਿਨਾਂ ਨਿਯਮ ਸ਼ੁਰੂ ਕਰ ਦੇਣਾ ਇਹ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ ਕਿ ਕੂੜੇ ਦੀ ਵੰਡ ਆਪਣੇ ਆਪ ਠੀਕ ਕੰਮ ਕਰੇਗੀ; ਇਹ ਦੋਵੇਂ ਲਾਗੂ ਕਰਨ ਦੀਆਂ ਅਸਲ ਲੋੜਾਂ ਹਨ।'
ql003_rule = (
    '  if ((/(?:ਸਟਾਫ ਟ੍ਰੇਨਿੰਗ|ਕਲੈਕਸ਼ਨ ਸਮਰੱਥਾ).*(?:ਦੇ ਬਿਨਾਂ|ਬਿਨਾਂ ਕਿਸੇ)/.test(argument) || '
    '/(?:ਦੇ ਬਿਨਾਂ|ਬਿਨਾਂ ਕਿਸੇ).*(?:ਸਟਾਫ ਟ੍ਰੇਨਿੰਗ|ਕਲੈਕਸ਼ਨ ਸਮਰੱਥਾ)/.test(argument)) && '
    '/(?:ਸ਼ੁਰੂ ਹੋ ਸਕਦਾ|ਸ਼ੁਰੂ ਕੀਤਾ ਜਾ ਸਕਦਾ|ਲਾਗੂ).*(?:ਵੰਡ|ਕੂੜੇ).*(?:ਸਿੱਧੇ ਕੰਮ|ਆਪਣੇ ਆਪ.*ਕੰਮ)/.test(argument)) '
    f'return "{ql003_reason}";\n'
)
if ql003_reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL003 Punjabi implementation-capacity reason: expected exactly one Punjabi fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, ql003_rule + punjabi_fallback_anchor, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 QL002/QL003 Punjabi routing hotfix applied")
