from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

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

old = 'if (strengths[index] === "WEAK" && boilerplateReason(reason, language)) return specificReason(deduped.arguments[index]!, language);'
new = 'if (strengths[index] === "WEAK" && (boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'
if new not in source:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"generic fallback routing: expected exactly one anchor, found {count}")
    source = source.replace(old, new, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 generic fallback routing repair applied")
