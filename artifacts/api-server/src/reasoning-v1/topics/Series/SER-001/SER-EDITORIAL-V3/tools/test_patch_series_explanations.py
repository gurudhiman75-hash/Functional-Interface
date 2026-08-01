from __future__ import annotations

import importlib.util
import pathlib
import unittest


MODULE_PATH = pathlib.Path(__file__).with_name("patch_series_explanations.py")
SPEC = importlib.util.spec_from_file_location("patch_series_explanations", MODULE_PATH)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
patch_series_explanations = MODULE.patch_series_explanations


class PatchSeriesExplanationsTest(unittest.TestCase):
    def test_standardises_headers(self) -> None:
        source = "#### 💡 Exam-Speed Shortcut\n#### 💡 परीक्षा शॉर्टकट\n#### 💡 ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ"
        patched = patch_series_explanations(source)
        self.assertIn("⚡ **Exam Speed Shortcut**", patched)
        self.assertIn("⚡ **परीक्षा शॉर्टकट**", patched)
        self.assertIn("⚡ **ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ**", patched)

    def test_converts_complete_plain_transition(self) -> None:
        self.assertEqual(
            patch_series_explanations("Q(17) (+2) S(19)"),
            "$Q(17) \\xrightarrow{+2} S(19)$",
        )

    def test_converts_complete_transition_already_inside_math(self) -> None:
        self.assertEqual(
            patch_series_explanations("$A(1) (−2) Y(25)$"),
            "$A(1) \\xrightarrow{-2} Y(25)$",
        )

    def test_preserves_parenthesised_equation(self) -> None:
        source = "$5+(2)=7$ and $a_0=17-(2)=15$"
        self.assertEqual(patch_series_explanations(source), source)

    def test_preserves_isolated_shift_token(self) -> None:
        source = "Reverse the operation (+2) before solving."
        self.assertEqual(patch_series_explanations(source), source)

    def test_rephrases_subset_jargon(self) -> None:
        vowel = "Move 2 places at a time through the ordered vowel list, cycling back to the beginning when needed."
        consonant = "Move 3 places at a time through the ordered consonant list, cycling back to the beginning when needed."
        self.assertIn("five English vowels", patch_series_explanations(vowel))
        self.assertIn("consonants in alphabetical order", patch_series_explanations(consonant))

    def test_is_idempotent(self) -> None:
        source = "Q(17) (+2) S(19)"
        once = patch_series_explanations(source)
        self.assertEqual(patch_series_explanations(once), once)


if __name__ == "__main__":
    unittest.main()
