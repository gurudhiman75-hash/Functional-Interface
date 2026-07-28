from __future__ import annotations

from pathlib import Path

ROOT = Path("artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/MEN-002")


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding="utf8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: {label}: expected one match, found {count}")
    path.write_text(text.replace(old, new, 1), encoding="utf8")
    print(f"patched: {label}")


def replace_all(path: Path, old: str, new: str, label: str, minimum: int = 1) -> None:
    text = path.read_text(encoding="utf8")
    count = text.count(old)
    if count < minimum:
        raise SystemExit(f"{path}: {label}: expected at least {minimum} matches, found {count}")
    path.write_text(text.replace(old, new), encoding="utf8")
    print(f"patched: {label} ({count})")


foundation = ROOT / "foundation/runtime.ts"
replace_once(
    foundation,
    "  formatExactMath,\n  formatWithUnit,",
    "  formatExactMath,\n  formatIndianInteger,\n  formatWithUnit,",
    "foundation formatter import",
)
replace_once(
    foundation,
    'state: makeState(prototypeId, seed, difficulty, "£", "painting-cost",',
    'state: makeState(prototypeId, seed, difficulty, "₹", "painting-cost",',
    "foundation rupee unit",
)
replace_once(
    foundation,
    'Painting costs $\\text{£}${rate}$ per square metre.',
    'Painting costs $\\text{₹}${formatIndianInteger(rate)}$ per square metre.',
    "foundation rate stem",
)
replace_once(
    foundation,
    'body: `Multiply by $\\text{£}${rate}$ for each square metre.`, equation: `$$Cost=${tsa}\\times\\text{£}${rate}=\\text{£}${tsa * rate}$$`',
    'body: `Multiply by $\\text{₹}${formatIndianInteger(rate)}$ for each square metre.`, equation: `$$Cost=${tsa}\\times\\text{₹}${formatIndianInteger(rate)}=\\text{₹}${formatIndianInteger(tsa * rate)}$$`',
    "foundation worked cost",
)
replace_once(
    foundation,
    'shortcut: `Calculate $lb+bh+hl$, double once, then multiply by the painting rate.`,',
    'shortcut: `Here $lb+bh+hl=${length * breadth}+${breadth * height}+${height * length}$, so the painted area is $${tsa}\\text{ m}^{2}$ and the cost is $${tsa}\\times\\text{₹}${formatIndianInteger(rate)}=\\text{₹}${formatIndianInteger(tsa * rate)}$.`,',
    "foundation numerical shortcut",
)

wave02 = ROOT / "gap-wave-02/runtime.ts"
replace_once(
    wave02,
    "  exactKey,\n  formatWithUnit,",
    "  exactKey,\n  formatIndianInteger,\n  formatWithUnit,",
    "wave02 formatter import",
)
replace_all(wave02, '"£/m²"', '"₹/m²"', "wave02 area-rate unit")
replace_all(wave02, '"£"', '"₹"', "wave02 cost unit")
replace_all(wave02, "\\text{£}", "\\text{₹}", "wave02 rupee MathJax", minimum=4)
replace_once(
    wave02,
    'costs $\\text{₹}${cost}$.',
    'costs $\\text{₹}${formatIndianInteger(cost)}$.',
    "wave02 painting cost stem grouping",
)
replace_once(
    wave02,
    'body: "Pounds divided by square metres gives pounds per square metre.", equation: `$$Rate=\\frac{\\text{₹}${cost}}{${tsa}\\text{ m}^{2}}=\\frac{\\text{₹}${rate}}{\\text{m}^{2}}$$`',
    'body: "Rupees divided by square metres gives rupees per square metre.", equation: `$$Rate=\\frac{\\text{₹}${formatIndianInteger(cost)}}{${tsa}\\text{ m}^{2}}=\\frac{\\text{₹}${formatIndianInteger(rate)}}{\\text{m}^{2}}$$`',
    "wave02 painting rate step",
)
replace_once(
    wave02,
    'shortcut: `Rate $=Cost/TSA$; do not stop after finding the area.`,',
    'shortcut: `For this box, $Rate=\\frac{\\text{₹}${formatIndianInteger(cost)}}{${tsa}\\text{ m}^{2}}=\\frac{\\text{₹}${formatIndianInteger(rate)}}{\\text{m}^{2}}$.`,',
    "wave02 painting rate numerical shortcut",
)
replace_once(
    wave02,
    'Material costs $\\text{₹}${rate}$ per cubic metre.',
    'Material costs $\\text{₹}${formatIndianInteger(rate)}$ per cubic metre.',
    "wave02 material rate stem",
)
replace_once(
    wave02,
    'body: `Multiply by $\\text{₹}${rate}$ for each cubic metre.`, equation: `$$Cost=${volume}\\times\\text{₹}${rate}=\\text{₹}${cost}$$`',
    'body: `Multiply by $\\text{₹}${formatIndianInteger(rate)}$ for each cubic metre.`, equation: `$$Cost=${volume}\\times\\text{₹}${formatIndianInteger(rate)}=\\text{₹}${formatIndianInteger(cost)}$$`',
    "wave02 material cost step",
)
replace_once(
    wave02,
    'shortcut: `Volume first, then multiply once by the £ per cubic metre rate.`,',
    'shortcut: `Here $V=${volume}\\text{ m}^{3}$, so $Cost=${volume}\\times\\text{₹}${formatIndianInteger(rate)}=\\text{₹}${formatIndianInteger(cost)}$.`,',
    "wave02 material numerical shortcut",
)

wave03 = ROOT / "gap-wave-03/runtime.ts"
replace_once(
    wave03,
    "  exactKey,\n  formatWithUnit,",
    "  exactKey,\n  formatIndianInteger,\n  formatWithUnit,",
    "wave03 formatter import",
)
replace_all(wave03, '"£/m"', '"₹/m"', "wave03 wire-rate unit")
replace_all(wave03, '"£"', '"₹"', "wave03 cost unit")
replace_all(wave03, "\\text{£}", "\\text{₹}", "wave03 rupee MathJax", minimum=5)
replace_once(
    wave03,
    'Wire costs $\\text{₹}${state.rate}$ per metre.',
    'Wire costs $\\text{₹}${formatIndianInteger(state.rate)}$ per metre.',
    "wave03 wire cost stem",
)
replace_once(
    wave03,
    'body: `Multiply by $\\text{₹}${state.rate}$ for each metre.`, equation: `$$Cost=${edgeLength}\\times\\text{₹}${state.rate}=\\text{₹}${cost}$$`',
    'body: `Multiply by $\\text{₹}${formatIndianInteger(state.rate)}$ for each metre.`, equation: `$$Cost=${edgeLength}\\times\\text{₹}${formatIndianInteger(state.rate)}=\\text{₹}${formatIndianInteger(cost)}$$`',
    "wave03 wire cost step",
)
replace_once(
    wave03,
    'shortcut: `Find $4(l+b+h)$ first; surface area is irrelevant to a wire frame.`,',
    'shortcut: `Here $4(l+b+h)=${edgeLength}\\text{ m}$, so the wire costs $${edgeLength}\\times\\text{₹}${formatIndianInteger(state.rate)}=\\text{₹}${formatIndianInteger(cost)}$.`,',
    "wave03 wire cost numerical shortcut",
)
replace_once(
    wave03,
    'costs $\\text{₹}${cost}$.',
    'costs $\\text{₹}${formatIndianInteger(cost)}$.',
    "wave03 rate stem grouping",
)
replace_once(
    wave03,
    'body: "Pounds divided by metres gives pounds per metre.", equation: `$$Rate=\\frac{\\text{₹}${cost}}{${edgeLength}\\text{ m}}=\\frac{\\text{₹}${state.rate}}{\\text{m}}$$`',
    'body: "Rupees divided by metres gives rupees per metre.", equation: `$$Rate=\\frac{\\text{₹}${formatIndianInteger(cost)}}{${edgeLength}\\text{ m}}=\\frac{\\text{₹}${formatIndianInteger(state.rate)}}{\\text{m}}$$`',
    "wave03 wire rate step",
)
replace_once(
    wave03,
    'shortcut: `Rate equals total cost divided by the twelve-edge wire length.`,',
    'shortcut: `The cube uses $12\\times${state.side}=${edgeLength}\\text{ m}$ of wire, so $Rate=\\frac{\\text{₹}${formatIndianInteger(cost)}}{${edgeLength}\\text{ m}}=\\frac{\\text{₹}${formatIndianInteger(state.rate)}}{\\text{m}}$.`,',
    "wave03 wire rate numerical shortcut",
)
