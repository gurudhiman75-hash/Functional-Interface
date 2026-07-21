import re
from pathlib import Path

path = Path(__file__).resolve().parent / "foundation/cp002-runtime.ts"
text = path.read_text(encoding="utf-8")
pattern = re.compile(r'(function cp002ResultLabel\(parameters: Avg001Parameters\) \{[\s\S]*?\n\})\n\n\1\n\nfunction renderCp002Explanation\(')
updated, count = pattern.subn(r'\1\n\nfunction renderCp002Explanation(', text, count=1)
if count != 1:
    raise SystemExit(f"Expected one duplicate helper pair; found {count}")
path.write_text(updated, encoding="utf-8")
