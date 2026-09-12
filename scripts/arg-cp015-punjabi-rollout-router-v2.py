from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

reason = 'ਕੇਵਲ ਫੈਸਲਾ ਘੋਸ਼ਿਤ ਕਰਨ ਨਾਲ ਲੋੜੀਂਦੀ ਸਥਿਰ ਕਨੈਕਟਿਵਿਟੀ ਆਪਣੇ ਆਪ ਉਪਲਬਧ ਨਹੀਂ ਹੋ ਜਾਂਦੀ; ਦੋ ਹਫ਼ਤਿਆਂ ਦੀ ਤਿਆਰੀ ਲਈ ਨੈੱਟਵਰਕ ਸਮਰੱਥਾ ਦੀ ਵੱਖਰੀ ਜਾਂਚ ਅਤੇ ਯੋਜਨਾ ਚਾਹੀਦੀ ਹੈ।'
old_rule = f'  if (/ਫੈਸਲਾ ਘੋਸ਼ਿਤ.*ਕਨੈਕਟਿਵਿਟੀ.*(?:ਉਪਲਬਧ ਹੋ ਜਾਵੇਗੀ|ਉਪਲਬਧ ਹੋਵੇਗੀ)/.test(argument)) return "{reason}";'
new_rule = f'  if (/ਫੈਸਲਾ ਘੋਸ਼ਿਤ.*ਕਨੈਕਟਿਵਿਟੀ.*ਉਪਲਬਧ/.test(argument)) return "{reason}";'

if new_rule not in source:
    count = source.count(old_rule)
    if count != 1:
        raise SystemExit(f"Punjabi connectivity rollout router v2: expected one narrow rule, found {count}")
    source = source.replace(old_rule, new_rule, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 Punjabi connectivity rollout semantic matcher broadened")
