"""Conservative migration helpers for legacy SER explanation exports.

The deterministic TypeScript renderer is the source of truth. This utility only
repairs already-exported Markdown and intentionally refuses to rewrite an
isolated ``(+n)`` or ``(-n)`` because that token may be part of a valid equation.
"""

from __future__ import annotations

import re


_TERM = r"(?:[A-Z]\(\d{1,2}\)|-?\d+(?:\.\d+)?)"
_IN_MATH_TRANSITION = re.compile(
    rf"\$(?P<left>{_TERM})\s*\((?P<sign>[+−-])(?P<amount>\d+)\)\s*(?P<right>{_TERM})\$"
)
_PLAIN_TRANSITION = re.compile(
    rf"(?<![$\w])(?P<left>{_TERM})\s*\((?P<sign>[+−-])(?P<amount>\d+)\)\s*(?P<right>{_TERM})(?![$\w])"
)


def _arrow(match: re.Match[str]) -> str:
    """Render one complete source-shift-target transition as inline MathJax."""
    sign = "-" if match.group("sign") in {"-", "−"} else "+"
    return (
        f"${match.group('left')} "
        f"\\xrightarrow{{{sign}{match.group('amount')}}} "
        f"{match.group('right')}$"
    )


def patch_series_explanations(text: str) -> str:
    """Repair safe, recognisable legacy Series presentation patterns.

    The transformation is idempotent and preserves ordinary parenthesised
    arithmetic such as ``5 + (2) = 7``.
    """
    header_replacements = {
        "#### 💡 Exam-Speed Shortcut": "⚡ **Exam Speed Shortcut**",
        "#### 💡 परीक्षा शॉर्टकट": "⚡ **परीक्षा शॉर्टकट**",
        "#### 💡 ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ": "⚡ **ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ**",
    }
    for old, new in header_replacements.items():
        text = text.replace(old, new)

    # Convert only complete source → shift → target expressions. Never replace
    # a standalone (+n)/(-n), because it may belong to a valid equation.
    text = _IN_MATH_TRANSITION.sub(_arrow, text)
    text = _PLAIN_TRANSITION.sub(_arrow, text)

    text = re.sub(
        r"Move (\d+) places at a time through the ordered vowel list, cycling back to the beginning when needed\.",
        r"Cycle through the five English vowels $\{A,E,I,O,U\}$, moving $+\1$ vowel positions each time and wrapping within that subset.",
        text,
    )
    text = re.sub(
        r"Move (\d+) places at a time through the ordered consonant list, cycling back to the beginning when needed\.",
        r"Move through consonants in alphabetical order, skipping $A,E,I,O,U$, by $+\1$ consonant positions each time and wrapping within that subset.",
        text,
    )

    return text
