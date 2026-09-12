from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

# Punjabi QL005 monitoring/stereotype families were still carrying a translated
# oblique-subject construction: "X ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਜੋ ਵੀ ...". Convert it to a
# normal exam-Punjabi subject construction without changing the argument logic.
repair_anchor = '    .replace(/ਪ੍ਰਾਪਤ ਕਰਨ ਦੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਸ਼ਾਇਦ ਗੁਆ ਦੇਣਗੇ/g, "ਹਾਸਲ ਕਰਨ ਦੀ ਆਪਣੀ ਜ਼ਿਆਦਾਤਰ ਸਮਰੱਥਾ ਗੁਆ ਸਕਦੇ ਹਨ")'
repairs = [
    '    .replace(/ਦਫ਼ਤਰੀ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਜੋ ਵੀ/g, "ਕੋਈ ਵੀ ਦਫ਼ਤਰੀ ਕਰਮਚਾਰੀ ਜੋ")',
    '    .replace(/ਦੂਰਸਥ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਜੋ ਵੀ/g, "ਕੋਈ ਵੀ ਦੂਰਸਥ ਕਰਮਚਾਰੀ ਜੋ")',
    '    .replace(/ਰਿਮੋਟ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਜੋ ਵੀ/g, "ਕੋਈ ਵੀ ਰਿਮੋਟ ਕਰਮਚਾਰੀ ਜੋ")',
    '    .replace(/ਕੌਨਟ੍ਰੈਕਟ ਕਰਮਚਾਰੀਆਂ ਵਿੱਚ ਜੋ ਵੀ/g, "ਕੋਈ ਵੀ ਕੌਨਟ੍ਰੈਕਟ ਕਰਮਚਾਰੀ ਜੋ")',
]
for repair in repairs:
    if repair not in source:
        count = source.count(repair_anchor)
        if count != 1:
            raise SystemExit(f"Punjabi employee-subject naturalness repair: expected one repair anchor, found {count}")
        source = source.replace(repair_anchor, repair_anchor + '\n' + repair, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 Punjabi employee-subject naturalness hotfix applied")
