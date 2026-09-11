from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

# QL004 Punjabi grammar: the generated phrase "ਅਕਸਰ ਲਈ ਖਤਮ" is not natural
# Punjabi. In this overclaim family the intended meaning is permanent loss, so
# render it as "ਹਮੇਸ਼ਾਂ ਲਈ ਖਤਮ".
repair_anchor = '.replace(/ਪ੍ਰਾਪਤ ਕਰਨ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਸ਼ਾਇਦ ਗੁਆ ਦੇਣਗੇ/g, "ਹਾਸਲ ਕਰਨ ਦੀ ਆਪਣੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਗੁਆ ਸਕਦੇ ਹਨ");'
repair_rule = '.replace(/ਅਕਸਰ ਲਈ ਖਤਮ/g, "ਹਮੇਸ਼ਾਂ ਲਈ ਖਤਮ")'
if repair_rule not in source:
    if repair_anchor not in source:
        # Earlier hotfixes may already have extended the chain; use the final
        # service-user repair as the next stable terminal anchor.
        alternatives = [
            '.replace(/ਵਰਤੋਂਕਾਰਾਂ ਅਕਸਰ/g, "ਵਰਤੋਂਕਾਰ ਅਕਸਰ");',
            '.replace(/ਅਰਜ਼ੀਕਾਰਾਂ ਅਕਸਰ/g, "ਅਰਜ਼ੀਕਾਰ ਅਕਸਰ");',
            '.replace(/ਲੋਕਾਂ ਅਕਸਰ/g, "ਲੋਕ ਅਕਸਰ");',
        ]
        matches = [a for a in alternatives if a in source]
        if len(matches) != 1:
            raise SystemExit(f"QL004 Punjabi grammar repair: expected one terminal anchor, found {len(matches)}")
        anchor = matches[0]
        source = source.replace(anchor, anchor[:-1] + '\n    ' + repair_rule + ';', 1)
    else:
        source = source.replace(repair_anchor, repair_anchor[:-1] + '\n    ' + repair_rule + ';', 1)

# QL004 Punjabi explanation: a temporary heavy-vehicle restriction may create
# costs, but it does not establish that most nearby businesses will close forever.
punjabi_fallback_anchor = '  return punjabiFallback(argument);\n}'
reason = 'ਅਸਥਾਈ ਭਾਰੀ-ਵਾਹਨ ਪਾਬੰਦੀ ਨਾਲ ਕੁਝ ਕਾਰੋਬਾਰਾਂ ਨੂੰ ਔਖ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਤੋਂ ਇਹ ਸਾਬਤ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਨੇੜਲੇ ਜ਼ਿਆਦਾਤਰ ਕਾਰੋਬਾਰ ਸਦਾ ਲਈ ਬੰਦ ਹੋ ਜਾਣਗੇ।'
rule = f'  if (/(?:ਕੋਈ ਵੀ )?ਅਸਥਾਈ ਪਾਬੰਦੀ.*(?:ਨੇੜਲੇ|ਆਲੇ-ਦੁਆਲੇ).*(?:ਜ਼ਿਆਦਾਤਰ).*(?:ਕਾਰੋਬਾਰ|ਵਪਾਰ).*(?:ਸਦਾ ਲਈ ਬੰਦ|ਹਮੇਸ਼ਾਂ ਲਈ ਬੰਦ)/.test(argument)) return "{reason}";\n'
if reason not in source:
    count = source.count(punjabi_fallback_anchor)
    if count != 1:
        raise SystemExit(f"QL004 Punjabi business-closure reason: expected exactly one Punjabi fallback anchor, found {count}")
    source = source.replace(punjabi_fallback_anchor, rule + punjabi_fallback_anchor, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 Punjabi QL004 grammar and explanation hotfix applied")
