from pathlib import Path

path = Path("artifacts/api-server/src/quant-v4/topics/Probability/shared/exam-depth-remodeler.ts")
text = path.read_text()
replacements = {
    "satisfies both conditions?": "meets both conditions?",
    "satisfies exactly one condition?": "meets exactly one condition?",
    "satisfies neither condition?": "meets neither condition?",
}
changed = False
for old, new in replacements.items():
    if new in text:
        continue
    if old not in text:
        raise SystemExit(f"Could not find event wording: {old}")
    text = text.replace(old, new, 1)
    changed = True
if changed:
    path.write_text(text)
print("Probability event-algebra question wording updated.")
