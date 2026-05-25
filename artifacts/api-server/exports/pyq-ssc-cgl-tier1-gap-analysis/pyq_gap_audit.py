from __future__ import annotations

import hashlib
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

from pypdf import PdfReader


ROOT = Path("ssc cgl tier 1 pyq")
OUT = Path("artifacts/api-server/exports/pyq-ssc-cgl-tier1-gap-analysis")


def norm(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = text.replace("\x00", "fi")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def file_hash(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def extract_text(path: Path) -> tuple[str, int, int]:
    reader = PdfReader(str(path))
    pages = len(reader.pages)
    texts: list[str] = []
    empty = 0
    for page in reader.pages:
        text = page.extract_text() or ""
        if not text.strip():
            empty += 1
        texts.append(text)
    return "\n".join(texts), pages, empty


def quant_slice(text: str) -> str:
    m = re.search(
        r"Quantitative Aptitude(?P<body>.*?)(English Comprehension|English Language|General English|Downloaded from Cracku\.in For MBA/CAT Courses:\s*\S+\s*22/|$)",
        text,
        flags=re.I | re.S,
    )
    if m:
        return m.group("body")
    return ""


def extract_questions(section: str) -> list[str]:
    section = re.sub(r"Downloaded from Cracku\.in.*?\d+/\d+", " ", section)
    starts = [m.start() for m in re.finditer(r"(?<!\d)(?:5[1-9]|6[0-9]|7[0-5])\.\s*", section)]
    blocks: list[str] = []
    for index, start in enumerate(starts):
        end = starts[index + 1] if index + 1 < len(starts) else len(section)
        block = norm(section[start:end])
        if len(block) > 25:
            blocks.append(block)
    return blocks


TOPIC_RULES: list[tuple[str, list[str]]] = [
    ("data_interpretation", ["bar graph", "pie chart", "table", "chart", "graph", "imports", "sales of", "branch", "following data"]),
    ("profit_loss_discount", ["profit", "loss", "shopkeeper", "bought", "sold", "selling price", "cost price", "marked price", "discount"]),
    ("simple_compound_interest", ["simple interest", "compound interest", "rate of interest", "per annum"]),
    ("percentage", ["percentage", "percent", "%"]),
    ("ratio_proportion", ["ratio", "proportion", "varies", "variation"]),
    ("average", ["average"]),
    ("time_work", ["complete a work", "complete it", "work in", "men and", "women can complete", "pipes", "cistern"]),
    ("speed_distance", ["speed", "km/h", "train", "boat", "stream", "distance", "policeman", "thief"]),
    ("geometry_mensuration", ["circle", "triangle", "cube", "cuboid", "cylinder", "cone", "sphere", "radius", "area", "volume", "tangent", "side", "cm"]),
    ("trigonometry", ["sin", "cos", "tan", "sec", "cosec", "cot", "θ", "alpha"]),
    ("number_system", ["remainder", "divisor", "quotient", "dividend", "divided by", "lcm", "hcf"]),
    ("algebra", ["equation", "value of", "x", " y ", "polynomial"]),
    ("simplification", ["simplify", "find the value", "using"]),
]


PL_FAMILY_RULES: list[tuple[str, list[str]]] = [
    ("pl_partial_inventory_allocation", ["one-fifth", "one-fourth", "remaining", "overall", "apples", "stock"]),
    ("pl_cp_sp_percent", ["bought", "sold", "profit", "loss"]),
    ("pl_mp_discount_to_sp", ["marked price", "discount", "sold for"]),
    ("pl_cp_mp_discount_to_percent", ["marked price", "discount", "profit", "loss"]),
    ("pl_successive_discounts", ["successive", "two discounts", "discounts"]),
    ("pl_equal_sp_profit_loss", ["sold for", "each", "one at", "other at"]),
    ("pl_dishonest_dealer_weight_fraud", ["kg", "gram", "weight", "weigh"]),
    ("pl_repair_overhead_cost", ["repair", "transport", "overhead"]),
]


PERCENT_FAMILY_RULES: list[tuple[str, list[str]]] = [
    ("di_percentage_comparison", ["bar graph", "graph", "table", "sales", "imports", "percentage"]),
    ("reverse_percentage", ["is what percentage", "what percentage of", "find the total"]),
    ("price_consumption", ["price", "consumption", "expenditure"]),
    ("pass_fail_marks", ["marks", "pass", "failed", "scored"]),
    ("population_growth", ["population"]),
    ("relation_chain", ["more than", "less than"]),
    ("taxation", ["tax", "taxable"]),
    ("commission", ["commission"]),
    ("venn_percentage", ["at least", "both", "neither"]),
]


def classify(block: str) -> str:
    text = block.lower()
    for topic, needles in TOPIC_RULES:
        if any(needle in text for needle in needles):
            return topic
    return "other_quant"


def classify_family(block: str, topic: str) -> str | None:
    text = block.lower()
    rules = PL_FAMILY_RULES if topic == "profit_loss_discount" else PERCENT_FAMILY_RULES
    for family, needles in rules:
        if any(needle in text for needle in needles):
            return family
    if topic == "profit_loss_discount":
        return "pl_other_or_unclassified"
    if topic in {"percentage", "data_interpretation"}:
        return "percentage_other_or_unclassified"
    return None


def opening(block: str) -> str:
    clean = re.sub(r"^\d+\.\s*", "", block)
    return norm(clean)[:220]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(ROOT.glob("*.pdf"))
    hash_groups: dict[str, list[str]] = defaultdict(list)
    for pdf in pdfs:
        hash_groups[file_hash(pdf)].append(pdf.name)

    docs = []
    questions = []
    extraction_issues = []

    for pdf in pdfs:
        try:
            text, pages, empty_pages = extract_text(pdf)
            qsec = quant_slice(text)
            qblocks = extract_questions(qsec)
            docs.append({
                "file": pdf.name,
                "pages": pages,
                "emptyPages": empty_pages,
                "chars": len(text),
                "quantChars": len(qsec),
                "quantQuestionsExtracted": len(qblocks),
            })
            if len(qblocks) < 15:
                extraction_issues.append({
                    "file": pdf.name,
                    "issue": "low_quant_question_extraction",
                    "count": len(qblocks),
                })
            for block in qblocks:
                topic = classify(block)
                family = classify_family(block, topic)
                questions.append({
                    "file": pdf.name,
                    "topic": topic,
                    "family": family,
                    "opening": opening(block),
                    "text": block[:1200],
                })
        except Exception as exc:  # keep audit resilient across odd PDFs
            extraction_issues.append({
                "file": pdf.name,
                "issue": type(exc).__name__,
                "message": str(exc),
            })

    topic_counts = Counter(q["topic"] for q in questions)
    family_counts = Counter(q["family"] for q in questions if q["family"])
    per_file_topic = defaultdict(Counter)
    for q in questions:
        per_file_topic[q["file"]][q["topic"]] += 1

    duplicate_files = [names for names in hash_groups.values() if len(names) > 1]
    percentage_like = [q for q in questions if q["topic"] in {"percentage", "data_interpretation"} or q["family"] in PERCENT_FAMILY_RULES]
    profit_like = [q for q in questions if q["topic"] == "profit_loss_discount"]

    gaps = [
        {
            "area": "Percentage mega-scale",
            "finding": "Current generated 2000Q Percentage audit failed at 617 clean items; PYQ set needs only ~few dozen percentage-like items per 56 shifts, but a future large corpus needs broader parameter/context pools.",
        },
        {
            "area": "Profit/Loss distractors",
            "finding": "Current generated 2000Q Profit/Loss audit failed at 1590 clean items, dominated by absurd option scale rejections; PYQ-like PL often uses inventory/remaining-stock and practical shopkeeper scenarios.",
        },
        {
            "area": "Quant topic coverage",
            "finding": "These PYQs are dominated by geometry/mensuration, trigonometry, algebra/number system, speed-distance, time-work, average, SI/CI, and DI; Percentage + Profit/Loss cover only a slice of SSC Quant.",
        },
        {
            "area": "DI-percentage hybrid",
            "finding": "SSC CGL often asks percentage comparison from bar/table graph data. Percentage V2 should eventually add lightweight DI-percentage single-question families if standalone Quant V2 is expected to cover these.",
        },
        {
            "area": "Profit/Loss inventory allocation",
            "finding": "The extracted sample includes partial stock sold at different profit/loss rates and a required final sale price for target overall profit; this family should stay high priority and receive more variants.",
        },
    ]

    summary = {
        "sourceFolder": str(ROOT),
        "pdfCount": len(pdfs),
        "duplicateFileGroups": duplicate_files,
        "documents": docs,
        "totalQuantQuestionsExtracted": len(questions),
        "topicCounts": dict(topic_counts.most_common()),
        "familyCounts": dict(family_counts.most_common()),
        "percentageLikeCount": len(percentage_like),
        "profitLossLikeCount": len(profit_like),
        "extractionIssues": extraction_issues,
        "perFileTopicCounts": {k: dict(v) for k, v in per_file_topic.items()},
        "gapFindings": gaps,
        "samplePercentageLike": percentage_like[:20],
        "sampleProfitLossLike": profit_like[:20],
    }

    (OUT / "pyq-gap-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    lines = [
        "# SSC CGL Tier 1 PYQ Gap Analysis",
        "",
        f"PDF files: {len(pdfs)}",
        f"Duplicate file groups: {len(duplicate_files)}",
        f"Quant questions extracted: {len(questions)}",
        f"Percentage-like questions: {len(percentage_like)}",
        f"Profit/Loss-like questions: {len(profit_like)}",
        "",
        "## Topic Counts",
    ]
    for topic, count in topic_counts.most_common():
        lines.append(f"- {topic}: {count}")
    lines.append("")
    lines.append("## Family Counts")
    for family, count in family_counts.most_common():
        lines.append(f"- {family}: {count}")
    lines.append("")
    lines.append("## Gap Findings")
    for gap in gaps:
        lines.append(f"- **{gap['area']}**: {gap['finding']}")
    lines.append("")
    lines.append("## Sample Profit/Loss PYQs")
    for q in profit_like[:10]:
        lines.append(f"- {q['file']}: {q['opening']}")
    lines.append("")
    lines.append("## Sample Percentage/DI PYQs")
    for q in percentage_like[:10]:
        lines.append(f"- {q['file']}: {q['opening']}")

    (OUT / "pyq-gap-report.md").write_text("\n".join(lines), encoding="utf-8")

    print(json.dumps({
        "pdfCount": len(pdfs),
        "duplicateFileGroups": len(duplicate_files),
        "totalQuantQuestionsExtracted": len(questions),
        "topicCounts": dict(topic_counts.most_common(12)),
        "familyCounts": dict(family_counts.most_common(12)),
        "percentageLikeCount": len(percentage_like),
        "profitLossLikeCount": len(profit_like),
        "extractionIssues": extraction_issues[:10],
        "output": str(OUT),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
