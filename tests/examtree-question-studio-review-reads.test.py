import base64
import importlib.util
import io
import json
from email.message import Message
from urllib.error import HTTPError
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

    def test_token_freshness_checks_expiry_and_firebase_project(self):
        def jwt(claims):
            payload = base64.urlsafe_b64encode(json.dumps(claims).encode()).decode().rstrip("=")
            return "eyJhbGciOiJSUzI1NiJ9." + payload + ".signature"
        valid = {"aud": "sarbedutech",
                 "iss": "https://securetoken.google.com/sarbedutech",
                 "exp": 5000}
        self.assertTrue(mod.jwt_freshness(jwt(valid), now=1000)[0])
        self.assertFalse(mod.jwt_freshness(jwt(valid), now=4900)[0])
        self.assertFalse(mod.jwt_freshness(jwt({**valid, "aud": "other-project"}), now=1000)[0])
        self.assertFalse(mod.jwt_freshness("garbage.jwt.x", now=1000)[0])

    def test_safe_json_403_classification_is_allowlisted(self):
        headers = Message()
        headers["Content-Type"] = "application/json"
        headers["Server"] = "cloudflare"
        denied = HTTPError("https://examtree.in/api/x", 403, "Forbidden", headers,
                           io.BytesIO(b'{"error":"Administrator permission required","permission":"content.generation.read"}'))
        result = mod.safe_http_error(denied)
        self.assertIn("reason=admin-rbac-denied", result)
        self.assertIn("api_permission=content.generation.read", result)
        self.assertNotIn("Authorization", result)
        denied_other = HTTPError("https://examtree.in/api/x", 403, "Forbidden", headers,
                                 io.BytesIO(b'{"error":"secret user@example.com","details":"private auth data"}'))
        result2 = mod.safe_http_error(denied_other)
        self.assertNotIn("user@example.com", result2)
        self.assertNotIn("private auth data", result2)

    def test_default_pages_and_anonymous_probe_are_present(self):
        source = PATH.read_text()
        self.assertIn("https://functional-interface.pages.dev", source)
        self.assertIn("ANONYMOUS GATEWAY PROBE", source)
        self.assertIn('("Cloudflare custom domain", FRONTEND_ORIGIN)', source)
        self.assertIn('("Pages default domain", PAGES_ORIGIN)', source)

    def test_http_denials_redact_html_and_preserve_only_safe_codes(self):
        headers = Message()
        headers["Content-Type"] = "text/html"
        headers["Server"] = "cloudflare"
        headers["CF-Ray"] = "some-nonsecret-ray-id"
        html = b"<html><script>secret stuff</script></html>"
        denied = HTTPError("https://examtree.in/api/x", 403, "Forbidden", headers, io.BytesIO(html))
        summary = mod.safe_http_error(denied)
        self.assertIn("HTTP 403", summary)
        self.assertIn("cloudflare-edge-or-proxy", summary)
        self.assertNotIn("script", summary)
        self.assertNotIn("ray-id", summary)

        headers2 = Message()
        headers2["Content-Type"] = "application/json"
        denied_api = HTTPError("https://service.run.app", 401, "Unauthorized",
                               headers2, io.BytesIO(b'{"code":"AUTH_TOKEN_INVALID"}'))
        summary = mod.safe_http_error(denied_api)
        self.assertIn("AUTH_TOKEN_INVALID", summary)

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
