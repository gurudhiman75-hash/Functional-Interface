from pathlib import Path

path = Path("artifacts/api-server/src/quant-v4/topics/Probability/shared/exam-depth-remodeler.ts")
text = path.read_text()
old = "  if (objectModes.includes(mode)) return tidy(renderObjectStem(entry, parameters, baseStem));"
new = "  if (objectModes.includes(mode) && (mode !== \"findSelectionProbabilityUsingCombination\" || entry.cpId === \"PRB-CP-005\")) return tidy(renderObjectStem(entry, parameters, baseStem));"
if new not in text:
    if old not in text:
        raise SystemExit("Could not find object-mode routing line")
    text = text.replace(old, new, 1)
    path.write_text(text)
print("Shared selection mode scoped to PRB-CP-005 object rendering.")
