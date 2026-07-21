import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent
patch = json.loads((root / "editorial-patch.cp002.json").read_text(encoding="utf-8"))
by_id = {entry["qlId"]: entry for entry in patch["entries"]}

for filename in ["question-language.cp002.en.json", "task-registry.cp002.library.json"]:
    path = root / filename
    data = json.loads(path.read_text(encoding="utf-8"))
    seen = set()
    for entry in data["entries"]:
        update = by_id.get(entry["qlId"])
        if not update:
            continue
        entry["explanationStrategyId"] = update["explanationStrategyId"]
        if filename == "question-language.cp002.en.json":
            entry["template"] = update["template"]
        seen.add(entry["qlId"])
    missing = sorted(set(by_id) - seen)
    if missing:
        raise SystemExit(f"Missing QLs in {filename}: {missing}")
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

runtime = root / "foundation/cp002-runtime.ts"
text = runtime.read_text(encoding="utf-8")
renderer = (root / "cp002-renderer.editorial.txt").read_text(encoding="utf-8").rstrip()
pattern = re.compile(r"function renderCp002Explanation\([\s\S]*?\nfunction formatOption\(")
updated, count = pattern.subn(renderer + "\n\nfunction formatOption(", text, count=1)
if count != 1:
    raise SystemExit(f"Could not replace CP-002 renderer; matches={count}")
runtime.write_text(updated, encoding="utf-8")
