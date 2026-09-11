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

# The V8 plain-language script historically inserted several English rules as one
# block. Make the renewal family independently idempotent so a pre-existing rule
# cannot accidentally suppress this one.
renewal_reason = 'A reminder may influence some users, but it does not show that nobody would choose to continue the plan; informed choice can still be a legitimate objective.'
renewal_rule = f'  if (/nobody will ever choose (?:a|an) automatically renewed plan/i.test(argument)) return "{renewal_reason}";\n'
english_fallback_anchor = '  return englishFallback(argument);\n}'
if renewal_reason not in source:
    count = source.count(english_fallback_anchor)
    if count != 1:
        raise SystemExit(f"renewal-specific reason: expected exactly one English fallback anchor, found {count}")
    source = source.replace(english_fallback_anchor, renewal_rule + english_fallback_anchor, 1)

# The finalizer already runs every argument through repairSurface before reason
# selection. Assert that V8's English article repair is present so the repaired
# argument exposed to the rule is grammatical as well as semantically specific.
article_repair = '.replace(/\\ba automatically renewed plan\\b/gi, "an automatically renewed plan")'
if article_repair not in source:
    raise SystemExit("renewal article repair missing after V8 plain-language repair")

old = 'if (strengths[index] === "WEAK" && boilerplateReason(reason, language)) return specificReason(deduped.arguments[index]!, language);'
new = 'if (strengths[index] === "WEAK" && (boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'
if new not in source:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"generic fallback routing: expected exactly one anchor, found {count}")
    source = source.replace(old, new, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 generic fallback routing repair applied")
