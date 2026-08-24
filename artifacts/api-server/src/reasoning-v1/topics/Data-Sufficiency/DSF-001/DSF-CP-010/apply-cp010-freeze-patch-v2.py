from pathlib import Path

source = Path(__file__).with_name("apply-cp010-freeze-patch.py")
code = source.read_text()

old = '''def replace_once(text: str, old: str, new: str, label: str) -> str:\n    count = text.count(old)\n    if count != 1:\n        raise RuntimeError(f"{label}: expected exactly one match, found {count}")\n    return text.replace(old, new, 1)\n'''
new = '''def replace_once(text: str, old: str, new: str, label: str) -> str:\n    count = text.count(old)\n    # The DsfReviewPackage and DsfReviewStatus interfaces intentionally contain the\n    # same CP-009 localization fragment. The first replacement upgrades the package\n    # interface and the second sequential replacement upgrades status.\n    expected = 2 if label == "client package CP010 fields" else 1\n    if count != expected:\n        raise RuntimeError(f"{label}: expected exactly {expected} match(es), found {count}")\n    return text.replace(old, new, 1)\n'''

if code.count(old) != 1:
    raise RuntimeError("Unable to locate CP010 patch helper for v2 hardening")
code = code.replace(old, new, 1)

namespace = {
    "__file__": str(source),
    "__name__": "__main__",
}
exec(compile(code, str(source), "exec"), namespace)
