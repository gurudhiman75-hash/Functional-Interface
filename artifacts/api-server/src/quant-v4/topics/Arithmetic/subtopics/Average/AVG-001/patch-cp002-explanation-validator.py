from pathlib import Path

root = Path(__file__).resolve().parent
path = root / "foundation/cp002-runtime.ts"
text = path.read_text(encoding="utf-8")
old = '''  addCheck(
    "explanation-depth",
    pkg.explanation.lines.length >= 6,
    "Explanation contains at least six meaningful moves",
  );'''
new = '''  addCheck(
    "explanation-depth",
    pkg.explanation.lines.length >= 4 &&
      pkg.explanation.lines.length <= 8,
    "Explanation contains 4–8 meaningful moves",
  );
  addCheck(
    "explanation-arithmetic",
    pkg.explanation.lines.some(
      (line) =>
        line.includes("\\\\times") ||
        line.includes("\\\\div") ||
        line.includes("÷") ||
        line.includes("+") ||
        line.includes("−"),
    ),
    "Explanation contains actual arithmetic",
  );
  addCheck(
    "explanation-answer",
    pkg.explanation.lines.some((line) => line.includes(pkg.answer)),
    "Explanation contains the final answer",
  );'''
if text.count(old) != 1:
    raise SystemExit(f"Expected one legacy explanation-depth block; found {text.count(old)}")
path.write_text(text.replace(old, new), encoding="utf-8")
Path(__file__).unlink()
