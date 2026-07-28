from __future__ import annotations

from pathlib import Path

ROOT = Path("artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002")


def patch(path: Path, replacements: list[tuple[str, str]]) -> None:
    text = path.read_text(encoding="utf8")
    for old, new in replacements:
        text = text.replace(old, new)
    if "£" in text or "€" in text or "¥" in text:
        raise SystemExit(f"{path}: foreign currency remains after hardening")
    if "formatIndianInteger" not in text:
        raise SystemExit(f"{path}: Indian number formatter was not imported or used")
    path.write_text(text, encoding="utf8")
    print(f"hardened {path}")


patch(
    ROOT / "foundation/runtime.ts",
    [
        ("  formatExactMath,\n  formatWithUnit,", "  formatExactMath,\n  formatIndianInteger,\n  formatWithUnit,"),
        ('"£"', '"₹"'),
        ("\\text{£}", "\\text{₹}"),
        ("${rate}$ per square metre", "${formatIndianInteger(rate)}$ per square metre"),
        ("${rate}$ for each square metre", "${formatIndianInteger(rate)}$ for each square metre"),
        ("\\text{₹}${tsa * rate}", "\\text{₹}${formatIndianInteger(tsa * rate)}"),
        (
            "shortcut: `Calculate $lb+bh+hl$, double once, then multiply by the painting rate.`,",
            "shortcut: `Here $lb+bh+hl=${length * breadth}+${breadth * height}+${height * length}$, so the painted area is $${tsa}\\text{ m}^{2}$ and the cost is $${tsa}\\times\\text{₹}${formatIndianInteger(rate)}=\\text{₹}${formatIndianInteger(tsa * rate)}$.`,",
        ),
    ],
)

patch(
    ROOT / "gap-wave-02/runtime.ts",
    [
        ("  exactKey,\n  formatWithUnit,", "  exactKey,\n  formatIndianInteger,\n  formatWithUnit,"),
        ('"£/m²"', '"₹/m²"'),
        ('"£/m³"', '"₹/m³"'),
        ('"£"', '"₹"'),
        ("\\text{£}", "\\text{₹}"),
        ("Pounds divided by square metres gives pounds per square metre.", "Rupees divided by square metres gives rupees per square metre."),
        ("${cost}$.", "${formatIndianInteger(cost)}$."),
        ("${cost}}", "${formatIndianInteger(cost)}}"),
        ("${rate}$ per cubic metre", "${formatIndianInteger(rate)}$ per cubic metre"),
        ("${rate}$ for each cubic metre", "${formatIndianInteger(rate)}$ for each cubic metre"),
        ("${rate}}", "${formatIndianInteger(rate)}}"),
        (
            "shortcut: `Rate $=Cost/TSA$; do not stop after finding the area.`,",
            "shortcut: `For this box, $Rate=\\frac{\\text{₹}${formatIndianInteger(cost)}}{${tsa}\\text{ m}^{2}}=\\frac{\\text{₹}${formatIndianInteger(rate)}}{\\text{m}^{2}}$.`,",
        ),
        (
            "shortcut: `Volume first, then multiply once by the ₹ per cubic metre rate.`,",
            "shortcut: `Here $V=${volume}\\text{ m}^{3}$, so $Cost=${volume}\\times\\text{₹}${formatIndianInteger(rate)}=\\text{₹}${formatIndianInteger(cost)}$.`,",
        ),
    ],
)

patch(
    ROOT / "gap-wave-03/runtime.ts",
    [
        ("  exactKey,\n  formatWithUnit,", "  exactKey,\n  formatIndianInteger,\n  formatWithUnit,"),
        ('"£/m"', '"₹/m"'),
        ('"£"', '"₹"'),
        ("\\text{£}", "\\text{₹}"),
        ("Pounds divided by metres gives pounds per metre.", "Rupees divided by metres gives rupees per metre."),
        ("${state.rate}$ per metre", "${formatIndianInteger(state.rate)}$ per metre"),
        ("${state.rate}$ for each metre", "${formatIndianInteger(state.rate)}$ for each metre"),
        ("${state.rate}}", "${formatIndianInteger(state.rate)}}"),
        ("${cost}$.", "${formatIndianInteger(cost)}$."),
        ("${cost}}", "${formatIndianInteger(cost)}}"),
        (
            "shortcut: `Find $4(l+b+h)$ first; surface area is irrelevant to a wire frame.`,",
            "shortcut: `Here $4(l+b+h)=${edgeLength}\\text{ m}$, so the wire costs $${edgeLength}\\times\\text{₹}${formatIndianInteger(state.rate)}=\\text{₹}${formatIndianInteger(cost)}$.`,",
        ),
        (
            "shortcut: `Rate equals total cost divided by the twelve-edge wire length.`,",
            "shortcut: `The cube uses $12\\times${state.side}=${edgeLength}\\text{ m}$ of wire, so $Rate=\\frac{\\text{₹}${formatIndianInteger(cost)}}{${edgeLength}\\text{ m}}=\\frac{\\text{₹}${formatIndianInteger(state.rate)}}{\\text{m}}$.`,",
        ),
    ],
)
