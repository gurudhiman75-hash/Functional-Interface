from pathlib import Path

SOURCE_PATH = Path("artifacts/api-server/src/reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-perceived-diversity-expansion.ts")
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
print("ARG-001 CP015 final editorial runtime integration applied")
