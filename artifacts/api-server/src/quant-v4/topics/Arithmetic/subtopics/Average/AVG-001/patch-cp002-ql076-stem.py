import json
from pathlib import Path

root = Path(__file__).resolve().parent
path = root / "question-language.cp002.en.json"
data = json.loads(path.read_text(encoding="utf-8"))
matches = [entry for entry in data["entries"] if entry["qlId"] == "AVG-QL-076"]
if len(matches) != 1:
    raise SystemExit(f"Expected one AVG-QL-076 entry; found {len(matches)}")
matches[0]["template"] = "The first and last of {count} consecutive integers are {firstTerm} and {lastTerm}. Find the average of the set."
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
Path(__file__).unlink()
