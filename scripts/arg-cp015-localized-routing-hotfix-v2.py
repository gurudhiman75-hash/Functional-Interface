from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

punjabi_fallback_anchor = '  return punjabiFallback(argument);\n}'

# QL002 Punjabi: one failed check/verification is only one case; it cannot prove
# that most legitimate profile-change requests will be impractical. Accept both
# natural Punjabi terms used by the localized corpus: ਜਾਂਚ and ਤਸਦੀਕ.
reason = 'ਇੱਕ ਵਰਤੋਂਕਾਰ ਦਾ ਜਾਂਚ ਜਾਂ ਤਸਦੀਕ ਪੂਰੀ ਨਾ ਕਰ ਸਕਣਾ ਕੇਵਲ ਇੱਕ ਘਟਨਾ ਹੈ; ਇਸ ਤੋਂ ਇਹ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ ਕਿ ਜ਼ਿਆਦਾਤਰ ਅਸਲੀ ਜਾਂ ਵਾਜਬ ਬਦਲਾਅ ਦੀਆਂ ਬੇਨਤੀਆਂ ਵੀ ਅਮਲ ਵਿੱਚ ਔਖੀਆਂ ਹੋਣਗੀਆਂ।'
rule = f'  if (/ਇੱਕ ਵਰਤੋਂਕਾਰ.*(?:ਜਾਂਚ|ਤਸਦੀਕ).*(?:ਪੂਰੀ ਨਾ ਕਰ ਸਕਿਆ|ਪੂਰਾ.*ਨਾ|ਨਾਕਾਮ|ਅਸਫਲ).*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਅਸਲੀ|ਵਾਜਬ).*(?:ਬੇਨਤੀ|ਬਦਲਾਅ).*(?:ਅਮਲ ਵਿੱਚ ਔਖ|ਨਾਕਾਮ|ਅਸਫਲ)/.test(argument)) return "{reason}";\n'
if reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL002 Punjabi failed-check reason: expected exactly one Punjabi fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, rule + punjabi_fallback_anchor, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 QL002 Punjabi failed-check routing hotfix applied")
