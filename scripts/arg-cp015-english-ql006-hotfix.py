from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-final-editorial-quality.ts")
source = SOURCE_PATH.read_text(encoding="utf-8")

# This rule is injected by the generic fallback repair earlier in the CP015 stack.
# Assert it is present before forcing this semantic family through specificReason.
required_reason = "Payments from a newly added device can be genuine, so treating most such payments as fraudulent does not establish that mandatory pre-authorisation is the only reasonable protection."
if required_reason not in source:
    raise SystemExit("English QL006 new-device contextual reason is missing before forced rerouting")

# The final learner surface must capitalize a new sentence after Yes./No. The
# generic repair normally installs this; keep this hotfix safe if the canonical
# runtime is later consolidated and already contains it.
capitalization = '.replace(/\\b(Yes|No)\\.\\s+most instances?\\b/gi, "$1. Most instances")'
if capitalization not in source:
    article_anchor = '.replace(/\\ba automatically renewed plan\\b/gi, "an automatically renewed plan")'
    count = source.count(article_anchor)
    if count != 1:
        raise SystemExit(f"English QL006 capitalization: expected one repair anchor, found {count}")
    source = source.replace(article_anchor, article_anchor + '\n    ' + capitalization, 1)

old_block = '''      const forceHindiTimeSlotPermanence = language === "hi"
        && /समय-स्लॉट.*(?:स्थायी रूप से अव्यावहारिक|स्थायी रूप से अनुपलब्ध|सफलतापूर्वक देना स्थायी)/.test(deduped.arguments[index]!);
      if (strengths[index] === "WEAK" && (forceHindiTimeSlotPermanence || boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'''
new_block = '''      const forceHindiTimeSlotPermanence = language === "hi"
        && /समय-स्लॉट.*(?:स्थायी रूप से अव्यावहारिक|स्थायी रूप से अनुपलब्ध|सफलतापूर्वक देना स्थायी)/.test(deduped.arguments[index]!);
      const forceEnglishNewDeviceFraud = language === "en"
        && /payments from a newly added device/i.test(deduped.arguments[index]!)
        && /(?:most instances|fraudulent|treated as fraudulent)/i.test(deduped.arguments[index]!);
      if (strengths[index] === "WEAK" && (forceHindiTimeSlotPermanence || forceEnglishNewDeviceFraud || boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'''

if new_block not in source:
    count = source.count(old_block)
    if count != 1:
        raise SystemExit(f"English QL006 forced rerouting: expected one finalizer block, found {count}")
    source = source.replace(old_block, new_block, 1)

SOURCE_PATH.write_text(source, encoding="utf-8")
print("ARG-001 CP015 English QL006 capitalization and contextual rerouting hotfix applied")
