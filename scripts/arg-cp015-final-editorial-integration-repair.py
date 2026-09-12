from pathlib import Path

ROOT = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001")
SOURCE_PATH = ROOT / "cp015-perceived-diversity-expansion.ts"
QUALITY_PATH = ROOT / "cp015-final-editorial-quality.ts"
source = SOURCE_PATH.read_text(encoding="utf-8")

import_line = 'import { finalizeArgCp015EditorialQuality } from "./cp015-final-editorial-quality.ts";\n'
import_anchor = 'import { naturalizeArgCp015ComboStatement } from "./cp015-combo-statement-naturalization.ts";\n'
if import_line not in source:
    count = source.count(import_anchor)
    if count != 1:
        raise SystemExit(f"final editorial import: expected exactly one anchor, found {count}")
    source = source.replace(import_anchor, import_anchor + import_line, 1)

old = '''    const debiased = debiasArgCp015AnswerCues(polished);
    const question = polishArgCp015AntiGamingGrammar(debiased);
    return { question, context: source.generationContext as Question };
'''
new = '''    const debiased = debiasArgCp015AnswerCues(polished);
    const grammarPolished = polishArgCp015AntiGamingGrammar(debiased);
    const question = finalizeArgCp015EditorialQuality(grammarPolished);
    return { question, context: source.generationContext as Question };
'''
if new not in source:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"two-argument final editorial integration: expected exactly one anchor, found {count}")
    source = source.replace(old, new, 1)

old = '''  const debiased = debiasArgCp015AnswerCues(residualPolished);
  const question = polishArgCp015AntiGamingGrammar(debiased);
  return { question, context: source.generationContext as Question };
'''
new = '''  const debiased = debiasArgCp015AnswerCues(residualPolished);
  const grammarPolished = polishArgCp015AntiGamingGrammar(debiased);
  const question = finalizeArgCp015EditorialQuality(grammarPolished);
  return { question, context: source.generationContext as Question };
'''
if new not in source:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"core/combo final editorial integration: expected exactly one anchor, found {count}")
    source = source.replace(old, new, 1)

# Guard against a future regression where the import survives but one path bypasses
# the final editorial layer.
if source.count("finalizeArgCp015EditorialQuality(grammarPolished)") != 2:
    raise SystemExit("CP015 must finalize both two-argument and core/combo candidate paths")

SOURCE_PATH.write_text(source, encoding="utf-8")

# Canonical final-mile rule for the English QL006 newly-added-device fraud
# overclaim. The contextual reason is installed by the generic-routing repair.
# Force this semantic family through specificReason even when an older broad
# reason already looks specific enough to bypass generic-fallback detection.
quality = QUALITY_PATH.read_text(encoding="utf-8")
required_reason = "Payments from a newly added device can be genuine, so treating most such payments as fraudulent does not establish that mandatory pre-authorisation is the only reasonable protection."
if required_reason not in quality:
    raise SystemExit("English QL006 new-device contextual reason is missing before final integration")

capitalization = '.replace(/\\b(Yes|No)\\.\\s+most instances?\\b/gi, "$1. Most instances")'
if capitalization not in quality:
    article_anchor = '.replace(/\\ba automatically renewed plan\\b/gi, "an automatically renewed plan")'
    count = quality.count(article_anchor)
    if count != 1:
        raise SystemExit(f"English QL006 capitalization: expected one repair anchor, found {count}")
    quality = quality.replace(article_anchor, article_anchor + '\n    ' + capitalization, 1)

# Final English naturalness repairs found in the certified human-review corpus.
english_naturalness_repairs = [
    ('.replace(/\\bin school closing time\\b/gi, "during school closing time")', 'school-closing-time preposition'),
    ('.replace(/\\bon the first week of each month\\b/gi, "in the first week of each month")', 'first-week preposition'),
    ('.replace(/\\bcitizens reaching near closing time\\b/gi, "citizens arriving near closing time")', 'closing-time arrival wording'),
]
for repair, label in english_naturalness_repairs:
    if repair not in quality:
        insert_anchor = capitalization if capitalization in quality else '.replace(/\\ba automatically renewed plan\\b/gi, "an automatically renewed plan")'
        count = quality.count(insert_anchor)
        if count != 1:
            raise SystemExit(f"English naturalness {label}: expected one repair anchor, found {count}")
        quality = quality.replace(insert_anchor, insert_anchor + '\n    ' + repair, 1)

old_block = '''      const forceHindiTimeSlotPermanence = language === "hi"
        && /समय-स्लॉट.*(?:स्थायी रूप से अव्यावहारिक|स्थायी रूप से अनुपलब्ध|सफलतापूर्वक देना स्थायी)/.test(deduped.arguments[index]!);
      if (strengths[index] === "WEAK" && (forceHindiTimeSlotPermanence || boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'''
new_block = '''      const forceHindiTimeSlotPermanence = language === "hi"
        && /समय-स्लॉट.*(?:स्थायी रूप से अव्यावहारिक|स्थायी रूप से अनुपलब्ध|सफलतापूर्वक देना स्थायी)/.test(deduped.arguments[index]!);
      const forceEnglishNewDeviceFraud = language === "en"
        && /payments from a newly added device/i.test(deduped.arguments[index]!)
        && /(?:most instances|fraudulent|treated as fraudulent)/i.test(deduped.arguments[index]!);
      if (strengths[index] === "WEAK" && (forceHindiTimeSlotPermanence || forceEnglishNewDeviceFraud || boilerplateReason(reason, language) || genericFallbackReason(reason, language))) return specificReason(deduped.arguments[index]!, language);'''
if new_block not in quality:
    count = quality.count(old_block)
    if count != 1:
        raise SystemExit(f"English QL006 forced rerouting: expected one finalizer block, found {count}")
    quality = quality.replace(old_block, new_block, 1)

QUALITY_PATH.write_text(quality, encoding="utf-8")
print("ARG-001 CP015 final editorial runtime integration and English QL006 routing applied")
