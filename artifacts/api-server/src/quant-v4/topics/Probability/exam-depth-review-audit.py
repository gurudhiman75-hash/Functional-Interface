from __future__ import annotations

import csv
import re
from collections import Counter
from pathlib import Path
from statistics import mean

ROOT = Path(__file__).resolve().parent

EXPECTED = {
    "PRB-001": (75, "SSC_CGL_CHSL", 4),
    "PRB-002": (60, "BANKING_MAINS", 5),
}

DEPTH_MODES = {
    "findSimultaneousSameTypeProbability",
    "findSimultaneousDifferentTypeProbability",
    "findExactCompositionProbability",
    "findSelectionProbabilityUsingCombination",
    "findNoObjectOfTypeProbability",
    "findAtLeastOneObjectOfType",
    "findSuccessiveIndependentProbability",
    "findWithReplacementProbability",
    "findSuccessiveDependentProbability",
    "findWithoutReplacementProbability",
    "findOrderedDrawSequenceProbability",
    "findSameTypeInSuccessiveDraws",
    "findDifferentTypesInSuccessiveDraws",
    "findAtLeastOneAcrossIndependentStages",
    "findConditionalProbabilityByCounting",
    "findConditionalFromTwoWayTable",
    "findConditionalCardProbability",
    "findConditionalUrnProbability",
    "findReverseConditionalCount",
    "findSelectionProbabilityUsingCombination",
    "findCommitteeCompositionProbability",
    "findRestrictedSelectionProbability",
    "findReverseCountFromProbability",
    "findTogetherOrApartProbability",
    "findPositionRestrictionProbability",
    "findNumberFormationProbability",
    "findUnionProbability",
    "findIntersectionProbability",
    "findExactlyOneOfTwoEvents",
    "findMixedEventExpressionProbability",
    "findNeitherEventProbability",
    "findMissingIntersectionOrUnionProbability",
    "findMutuallyExclusiveUnion",
    "findIndependentIntersection",
}

DECISION_MARKERS = re.compile(
    r"because|since|use combinations|order does not matter|replacement|without replacement|"
    r"complement|restricted sample space|sample space|overlap|counted twice|one block|last digit|"
    r"mutually exclusive|independent|both orders|total number|possible selections|required people|"
    r"C\(|P\(|probability",
    re.IGNORECASE,
)

CONTEXT_FAMILIES = {
    "balls": re.compile(r"\bballs?\b", re.I),
    "marbles": re.compile(r"\bmarbles?\b", re.I),
    "pens": re.compile(r"\bpens?\b", re.I),
    "stones": re.compile(r"\bstones?\b", re.I),
    "lottery": re.compile(r"\blottery|tickets?\b", re.I),
    "quality-control": re.compile(r"\bbulbs?|defective|inspection\b", re.I),
    "workplace": re.compile(r"\bemployees?|company|bank|loan applications?\b", re.I),
    "candidates": re.compile(r"\bcandidates?|examination|shortlisted|qualified\b", re.I),
    "students": re.compile(r"\bstudents?|Mathematics|English|Reasoning|Quantitative Aptitude\b", re.I),
    "coins": re.compile(r"\bcoins?|heads?|tails?|H/T\b", re.I),
    "dice": re.compile(r"\bdie|dice\b", re.I),
    "cards": re.compile(r"\bcards?|deck|spade|heart|club|diamond|king|queen|jack|ace\b", re.I),
    "number-selection": re.compile(r"\binteger|numbered|divisible|prime|composite\b", re.I),
    "committee": re.compile(r"\bcommittee|men|women\b", re.I),
    "arrangement": re.compile(r"\bqueue|arrangement|adjacent|posts?|position\b", re.I),
    "event-algebra": re.compile(r"\bat least one subject|exactly one|neither|Section A|Section B|cricket|football\b", re.I),
    "spinner": re.compile(r"\bspinner|sectors?\b", re.I),
}


def load_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for package_id, (expected_count, profile, option_count) in EXPECTED.items():
        path = ROOT / package_id / "human-review-en.csv"
        package_rows = list(csv.DictReader(path.open(encoding="utf-8")))
        if len(package_rows) != expected_count:
            raise SystemExit(f"{package_id}: expected {expected_count} rows, found {len(package_rows)}")
        for row in package_rows:
            if row["examProfile"] != profile:
                raise SystemExit(f"{row['qlId']}: expected profile {profile}, found {row['examProfile']}")
            options = [row[f"option{letter}"] for letter in "ABCDE" if row[f"option{letter}"]]
            if len(options) != option_count or len(set(options)) != option_count:
                raise SystemExit(f"{row['qlId']}: invalid option set")
            if row["validationValid"] != "true" or row["mathematicalStatus"] != "AUTOMATED_PASS":
                raise SystemExit(f"{row['qlId']}: review row did not pass validation")
        rows.extend(package_rows)
    return rows


def audit() -> None:
    rows = load_rows()
    if len(rows) != 135:
        raise SystemExit(f"Expected 135 rows, found {len(rows)}")

    visible_keys = [(" ".join(row["stem"].lower().split()), row["answer"]) for row in rows]
    if len(set(visible_keys)) != len(visible_keys):
        duplicates = [key for key, count in Counter(visible_keys).items() if count > 1]
        raise SystemExit(f"Duplicate visible review questions: {duplicates[:3]}")

    banned = re.compile(r"\b(tokens?|counters?|selected files?)\b", re.I)
    for row in rows:
        if banned.search(row["stem"]):
            raise SystemExit(f"{row['qlId']}: artificial context remains in stem")

    context_rules = [
        (re.compile(r"\bpens?\b", re.I), re.compile(r"\bpens?\b", re.I), "pen"),
        (re.compile(r"\bmarbles?\b", re.I), re.compile(r"\bmarbles?\b", re.I), "marble"),
        (re.compile(r"\bcoloured stones?\b", re.I), re.compile(r"\bstones?\b", re.I), "stone"),
        (re.compile(r"\bballs?\b", re.I), re.compile(r"\bballs?\b", re.I), "ball"),
    ]
    for row in rows:
        for stem_pattern, explanation_pattern, label in context_rules:
            if stem_pattern.search(row["stem"]) and not explanation_pattern.search(row["explanation"]):
                raise SystemExit(f"{row['qlId']}: {label} context is missing from the explanation")

    explanation_lengths = [len(row["explanation"].split()) for row in rows]
    if mean(explanation_lengths) < 24:
        raise SystemExit(f"Average explanation length is only {mean(explanation_lengths):.1f} words; expected at least 24")

    medium_hard = [row for row in rows if row["difficulty"] in {"Medium", "Hard"}]
    medium_hard_lengths = [len(row["explanation"].split()) for row in medium_hard]
    if not medium_hard_lengths or mean(medium_hard_lengths) < 30:
        raise SystemExit(f"Medium/Hard explanation average is {mean(medium_hard_lengths):.1f}; expected at least 30")

    for row in rows:
        if row["solveMode"] in DEPTH_MODES:
            words = len(row["explanation"].split())
            if words < 22:
                raise SystemExit(f"{row['qlId']}: multi-step explanation is too short ({words} words)")
            if not DECISION_MARKERS.search(row["explanation"]):
                raise SystemExit(f"{row['qlId']}: explanation does not reveal the method decision")

    combined = "\n".join(row["stem"] for row in rows)
    represented = sorted(name for name, pattern in CONTEXT_FAMILIES.items() if pattern.search(combined))
    if len(represented) < 13:
        raise SystemExit(f"Only {len(represented)} context families are represented: {represented}")

    coin_rows = [row for row in rows if "coin" in row["stem"].lower()]
    if not coin_rows or not all(re.search(r"\b[HT]{2,5}\b", row["explanation"]) for row in coin_rows):
        raise SystemExit("Every coin review explanation must show a concrete H/T sequence")

    dice_rows = [row for row in rows if "two fair dice" in row["stem"].lower()]
    if dice_rows and not all(re.search(r"\(\d,\d\)|odd faces are|even faces are", row["explanation"], re.I) for row in dice_rows):
        raise SystemExit("Two-dice explanations must show ordered-pair or parity evidence")

    markdown = (ROOT / "PROBABILITY-REVIEW-QUESTIONS-AND-EXPLANATIONS.md").read_text(encoding="utf-8")
    checks = {
        "questions": markdown.count("\n#### Question "),
        "answers": markdown.count("\n**Correct answer:**"),
        "explanations": markdown.count("\n**Explanation:**"),
    }
    if checks != {"questions": 135, "answers": 135, "explanations": 135}:
        raise SystemExit(f"Review Markdown coverage mismatch: {checks}")

    print({
        "questions": len(rows),
        "unique": len(set(visible_keys)),
        "averageExplanationWords": round(mean(explanation_lengths), 1),
        "mediumHardAverageWords": round(mean(medium_hard_lengths), 1),
        "contextFamilies": represented,
    })


if __name__ == "__main__":
    audit()
