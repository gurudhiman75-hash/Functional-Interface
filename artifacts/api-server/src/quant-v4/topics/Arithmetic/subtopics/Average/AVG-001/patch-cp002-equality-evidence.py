from pathlib import Path

root = Path(__file__).resolve().parent
path = root / "foundation/cp002-runtime.ts"
text = path.read_text(encoding="utf-8")
old = '''        line.includes("−"),'''
new = '''        line.includes("−") ||
        line.includes("="),'''
if text.count(old) != 1:
    raise SystemExit(f"Expected one arithmetic evidence tail; found {text.count(old)}")
path.write_text(text.replace(old, new), encoding="utf-8")
Path(__file__).unlink()
