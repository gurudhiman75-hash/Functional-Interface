from __future__ import annotations

from pathlib import Path

ROOT = Path("artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002")

RUNTIMES = [
    (ROOT / "foundation/runtime.ts", 'import { polishMenCp007English } from "./editorial";'),
    (ROOT / "gap-wave-01/runtime.ts", 'import { polishMenCp007English } from "../foundation/editorial";'),
    (ROOT / "gap-wave-02/runtime.ts", 'import { polishMenCp007English } from "../foundation/editorial";'),
    (ROOT / "gap-wave-03/runtime.ts", 'import { polishMenCp007English } from "../foundation/editorial";'),
]


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def patch_runtime(path: Path, editorial_import: str) -> None:
    text = path.read_text(encoding="utf8")
    if editorial_import not in text:
        exact_import_end = '} from "./exact";' if path.parent.name == "foundation" else '} from "../foundation/exact";'
        text = replace_once(text, exact_import_end, f"{exact_import_end}\n{editorial_import}", f"{path} editorial import")

    if "const polished = polishMenCp007English" not in text:
        if path.parent.name == "foundation":
            anchor = "  const { options, traps } = buildOptions(draft, optionRng);"
        else:
            prototype = path.parent.name.replace("gap-wave-", "Wave0")
            anchor = f"  const {{ options, traps }} = buildOptions(draft, createSeededRandom(`${{prototypeId}}:${{seed}}:options`));"
        polished_block = anchor + "\n" + """  const polished = polishMenCp007English({
    stem: draft.stem,
    options,
    keyRule: draft.keyRule,
    steps: draft.steps,
    shortcut: draft.shortcut,
    traps,
  });"""
        text = replace_once(text, anchor, polished_block, f"{path} polished block")

    text = replace_once(text, "    stem: draft.stem,", "    stem: polished.stem,", f"{path} polished stem")
    text = replace_once(text, "    options,\n    correctIndex,", "    options: polished.options,\n    correctIndex,", f"{path} polished options")
    text = replace_once(text, "    answer: options[correctIndex]!.display,", "    answer: polished.options[correctIndex]!.display,", f"{path} polished answer")

    multiline_explanation = """    explanation: {
      keyRule: draft.keyRule,
      steps: draft.steps,
      shortcut: draft.shortcut,
      traps,
    },"""
    polished_multiline = """    explanation: {
      keyRule: polished.explanation.keyRule,
      steps: polished.explanation.steps,
      shortcut: polished.explanation.shortcut,
      traps: polished.explanation.traps,
    },"""
    one_line_explanation = "    explanation: { keyRule: draft.keyRule, steps: draft.steps, shortcut: draft.shortcut, traps },"
    polished_one_line = "    explanation: polished.explanation,"
    if multiline_explanation in text:
        text = replace_once(text, multiline_explanation, polished_multiline, f"{path} multiline explanation")
    elif one_line_explanation in text:
        text = replace_once(text, one_line_explanation, polished_one_line, f"{path} one-line explanation")
    elif polished_multiline not in text and polished_one_line not in text:
        raise SystemExit(f"{path}: explanation block not found")

    path.write_text(text, encoding="utf8")
    print(f"patched {path}")


for runtime, editorial_import in RUNTIMES:
    patch_runtime(runtime, editorial_import)


audit = ROOT / "MEN-CP-007/men-cp-007-production-audit.ts"
text = audit.read_text(encoding="utf8")
if "ungroupedVisibleNumberPattern" not in text:
    text = replace_once(
        text,
        "const ungroupedRupeePattern = /\\\\text\\{₹\\}(\\d{4,})(?![,\\d])/g;",
        "const ungroupedRupeePattern = /\\\\text\\{₹\\}(\\d{4,})(?![,\\d])/g;\n"
        "const ungroupedVisibleNumberPattern = /(?<![\\d,])\\d{4,}(?![\\d,])/;\n"
        "const difficultVocabularyPattern = /\\b(?:multiplicatively|conserved|congruent|reconstruct(?:s|ed|ing)?|recover(?:s|ed|ing)?|semiperimeter|axis-aligned|coefficient|successive change|dimension-wise|cross-sectional)\\b/i;",
        "production audit easy-English patterns",
    )

if "contains an ungrouped large learner-visible number" not in text:
    anchor = "      assert.equal(hiddenControlPattern.test(text), false, `${prototypeId} ${seed} contains a hidden control character.`);"
    additions = anchor + "\n" + """      assert.equal(ungroupedVisibleNumberPattern.test(text), false, `${prototypeId} ${seed} contains an ungrouped large learner-visible number.`);
      assert.equal(difficultVocabularyPattern.test(text), false, `${prototypeId} ${seed} contains unnecessarily difficult English.`);"""
    text = replace_once(text, anchor, additions, "production audit learner-language gates")

if "must begin with the easy-English label" not in text:
    anchor = "      assert.ok(question.explanation.shortcut.trim().length >= 24, `${prototypeId} ${seed} has an underdeveloped shortcut.`);"
    additions = anchor + "\n" + """      assert.ok(question.explanation.shortcut.startsWith("Quick way:"), `${prototypeId} ${seed} shortcut must begin with the easy-English label.`);
      assert.ok(/\\d/.test(question.explanation.shortcut), `${prototypeId} ${seed} shortcut must use numbers from the question.`);"""
    text = replace_once(text, anchor, additions, "production audit numerical shortcut gates")

audit.write_text(text, encoding="utf8")
print(f"patched {audit}")
