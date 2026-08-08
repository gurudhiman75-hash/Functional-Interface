from pathlib import Path

path = Path("artifacts/api-server/src/quant-v4/topics/Probability/shared/exam-depth-remodeler.ts")
text = path.read_text()
old = '${both === 1 ? "satisfies" : "satisfy"} both conditions'
new = '${both === 1 ? "meets" : "meet"} both conditions'
if new not in text:
    if old not in text:
        raise SystemExit("Could not find both-event wording in exam-depth remodeler")
    text = text.replace(old, new, 1)
    path.write_text(text)
print("Probability both-event wording updated.")
