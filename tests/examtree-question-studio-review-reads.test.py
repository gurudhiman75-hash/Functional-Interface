import importlib.util
from pathlib import Path
import unittest

PATH = Path(__file__).resolve().parents[1] / "scripts/verify-examtree-question-studio-review-reads.py"
spec = importlib.util.spec_from_file_location("review_reads", PATH)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def sample(n=3):
    run = {
        "id": "5682e459-7b2d-46ba-b57b-778a3b2ce0b4",
        "publicCode": "GEN-20261011-635BA10F",
        "status": "review",
        "requestSnapshot": {"packageId": "NUM-001"},
        "reviewSummary": {"total": n, "unreviewed": n},
        "items": [],
    }
    for i in range(1, n + 1):
        run["items"].append({
            "id": "item-" + str(i),
            "itemNumber": i,
            "status": "unreviewed",
            "currentVersionNumber": 1,
            "versionId": "version-" + str(i),
            "payload": {
                "text": "Find the distance on the integer number line.",
                "explanation": "**Concept:** Use the absolute difference of the numbers.",
                "options": ["\\(1\\)", "\\(2\\)", "\\(3\\)", "\\(4\\)"],
                "correctIndex": 1,
            },
        })
    return {"runs": [run], "pagination": {"totalRuns": 1}}


class ReviewReadContractTests(unittest.TestCase):
    def validate(self, data):
        return mod.validate_review_page(data, "5682e459-7b2d-46ba-b57b-778a3b2ce0b4",
                                        "GEN-20261011-635BA10F", 3)

    def test_valid_admin_response(self):
        self.assertEqual(self.validate(sample()), (True,
            "review run, item versions, stems, four options, answer indices and explanations returned"))

    def test_missing_explanation_blocked(self):
        body = sample()
        body["runs"][0]["items"][1]["payload"]["explanation"] = ""
        self.assertFalse(self.validate(body)[0])

    def test_missing_version_blocked(self):
        body = sample()
        body["runs"][0]["items"][1]["versionId"] = None
        self.assertFalse(self.validate(body)[0])

    def test_missing_question_blocked(self):
        body = sample()
        body["runs"][0]["items"][0]["payload"]["text"] = ""
        self.assertFalse(self.validate(body)[0])

    def test_duplicate_item_number_blocked(self):
        body = sample()
        body["runs"][0]["items"][1]["itemNumber"] = 1
        self.assertFalse(self.validate(body)[0])

    def test_non_review_run_blocked(self):
        body = sample()
        body["runs"][0]["status"] = "approved"
        self.assertFalse(self.validate(body)[0])

    def test_missing_correct_index_blocked(self):
        body = sample()
        body["runs"][0]["items"][2]["payload"]["correctIndex"] = 5
        self.assertFalse(self.validate(body)[0])

    def test_no_auto_publish_code_and_only_safe_methods(self):
        source = PATH.read_text()
        self.assertIn('method="GET"', source)
        self.assertNotIn('method="POST"', source)
        self.assertIn("RejectRedirect", source)
        self.assertIn("getpass.getpass", source)
        self.assertIn("https://examtree.in", source)


if __name__ == "__main__":
    unittest.main()
