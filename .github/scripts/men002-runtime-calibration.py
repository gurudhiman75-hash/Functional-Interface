from __future__ import annotations

import re
from pathlib import Path

RUNTIME_PATH = Path(
    "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/"
    "subtopics/Mensuration/MEN-002/foundation/runtime.ts"
)
text = RUNTIME_PATH.read_text(encoding="utf8")


def literal(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 literal match, found {count}")
    text = text.replace(old, new, 1)


def regex(pattern: str, replacement: str, label: str, flags: int = 0) -> None:
    global text
    text, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 regex match, found {count}")


literal(
    'const DIFFICULTIES: readonly Men002Difficulty[] = ["Easy", "Medium", "Hard"];\n',
    "",
    "difficulty registry",
)
literal(
    '  const context = rng.pick(["cube", "cubical room", "cubical crate"] as const);',
    '  const context = rng.pick(["cube", "cubical crate", "cubical display box"] as const);',
    "cube context",
)
regex(
    r'''      \{ value: q\(side \*\* 2n\), misconceptionId: "TOOK_SQUARE_ROOT_INCORRECTLY"[^\n]*\n      \{ value: q\(3n \* side\), misconceptionId: "DIVIDED_BY_THREE"[^\n]*\n      \{ value: q\(side \+ 1n\), misconceptionId: "CUBE_ROOT_SLIP"[^\n]*\n''',
    '''      { value: exactFromSquaredLength(volume), misconceptionId: "TOOK_SQUARE_ROOT", explanation: `taking $\\sqrt{${volume}}$ as though the given cubic measure were an area` },
      { value: q(volume, 3n), misconceptionId: "DIVIDED_VOLUME_BY_THREE", explanation: `dividing $${volume}$ by $3$ instead of taking its cube root` },
      { value: q(side + 1n), misconceptionId: "CUBE_ROOT_SLIP", explanation: `choosing a nearby integer even though only $${side}^3=${volume}$ reconstructs the given volume` },
''',
    "cube inverse distractors",
)
literal(
    '{ value: q(2n * side), misconceptionId: "TREATED_AS_DIAMETER", explanation: "treating the space diagonal like a diameter and doubling the side" },',
    '{ value: surd(side, 3n, 2n), misconceptionId: "HALVED_AS_DIAMETER", explanation: "halving the given space diagonal as though it were a circle diameter" },',
    "diagonal inverse distractor",
)
literal(
    '{ value: q(2n * height), misconceptionId: "EXTRA_FACTOR_TWO", explanation: "introducing a surface-area factor of $2$ into a volume inverse" },',
    '{ value: q(height, 2n), misconceptionId: "EXTRA_FACTOR_TWO", explanation: "putting an unnecessary factor of $2$ in the denominator of $h=V/(lb)$" },',
    "height inverse distractor",
)

SCENARIOS = r'''const PERCENT_SCENARIOS = [
  {
    length: 20n, breadth: -10n, correct: 8n,
    wrong: [10n, 30n, 108n] as const,
    explanations: [
      "subtracting the stated percentages directly: $20-10=10$",
      "adding the percentage magnitudes: $20+10=30$",
      "reporting the final volume index $108$ instead of the $8\%$ increase",
    ] as const,
  },
  {
    length: 10n, breadth: 20n, correct: 32n,
    wrong: [30n, 10n, 132n] as const,
    explanations: [
      "adding the two increases directly: $10+20=30$",
      "subtracting the smaller increase from the larger: $20-10=10$",
      "reporting the final volume index $132$ instead of the $32\%$ increase",
    ] as const,
  },
  {
    length: 50n, breadth: -20n, correct: 20n,
    wrong: [30n, 70n, 120n] as const,
    explanations: [
      "combining the signed percentages directly: $50-20=30$",
      "adding the percentage magnitudes: $50+20=70$",
      "reporting the final volume index $120$ instead of the $20\%$ increase",
    ] as const,
  },
  {
    length: 25n, breadth: 20n, correct: 50n,
    wrong: [45n, 5n, 150n] as const,
    explanations: [
      "adding the two increases directly: $25+20=45$",
      "subtracting the smaller increase from the larger: $25-20=5$",
      "reporting the final volume index $150$ instead of the $50\%$ increase",
    ] as const,
  },
] as const;'''
regex(
    r"const PERCENT_SCENARIOS = \[.*?\n\] as const;",
    lambda _match: SCENARIOS,
    "percentage table",
    re.S,
)
regex(
    r'''      \{ value: q\(scenario\.wrong\[0\]\), misconceptionId: "ADDED_SIGNED_PERCENTAGES"[^\n]*\n      \{ value: q\(scenario\.wrong\[1\]\), misconceptionId: "IGNORED_DIRECTION"[^\n]*\n      \{ value: q\(scenario\.wrong\[2\]\), misconceptionId: "REPORTED_NEW_PERCENT"[^\n]*\n''',
    '''      { value: q(scenario.wrong[0]), misconceptionId: "DIRECT_PERCENTAGE_COMBINATION", explanation: scenario.explanations[0] },
      { value: q(scenario.wrong[1]), misconceptionId: "WRONG_PERCENTAGE_DIRECTION", explanation: scenario.explanations[1] },
      { value: q(scenario.wrong[2]), misconceptionId: "REPORTED_NEW_PERCENT", explanation: scenario.explanations[2] },
''',
    "percentage explanations",
)

CLASSIFIER = '''export function classifyMenCp007Difficulty(state: MenCp007CanonicalState): Men002Difficulty {
  const d = state.dimensions;
  let score = 0;
  switch (state.solveMode) {
    case "findCubeVolume":
    case "findCubeTotalSurfaceArea": score = d.side! >= 10n ? 1 : 0; break;
    case "findCubeSideFromVolume":
    case "findCubeSpaceDiagonal":
    case "findCubeSideFromSpaceDiagonal": score = 1 + (d.side! >= 10n ? 1 : 0); break;
    case "findCuboidVolume": score = d.length! >= 18n ? 1 : 0; break;
    case "findCuboidTotalSurfaceArea":
    case "findCuboidHeightFromVolume": score = 1 + (d.length! >= 18n ? 1 : 0); break;
    case "findCuboidSpaceDiagonal":
    case "findLongestRodInCuboid": score = 1 + (d.height! >= 20n ? 1 : 0); break;
    case "findTriangularPrismVolume": score = 1 + (d.prismLength! >= 15n ? 1 : 0); break;
    case "findPrismHeightFromVolumeAndBaseArea": score = 1 + (d.height! >= 12n ? 1 : 0); break;
    case "findSmallCubeCountFromCuboid": {
      const count = d.alongLength! * d.alongBreadth! * d.alongHeight!;
      score = 1 + (count >= 60n ? 1 : 0);
      break;
    }
    case "findOpenTopCuboidSheetArea": score = 1 + (d.length! >= 18n ? 1 : 0); break;
    case "findCubeVolumeScaleRatio": score = d.factor! >= 5n ? 1 : 0; break;
    case "findCuboidVolumePercentageChange": score = 1 + (d.lengthChange! * d.breadthChange! < 0n ? 1 : 0); break;
    case "convertCubicCentimetresToLitres": score = d.cubicCentimetres! >= 30_000n ? 1 : 0; break;
    case "findCuboidPaintingCost": score = 1 + (d.length! >= 18n || d.rate! >= 8n ? 1 : 0); break;
  }
  return score === 0 ? "Easy" : score === 1 ? "Medium" : "Hard";
}

'''
literal(
    "function generateDraft(prototypeId: MenCp007PrototypeId, seed: string): Draft {",
    CLASSIFIER + "function generateDraft(prototypeId: MenCp007PrototypeId, seed: string): Draft {",
    "classifier insertion",
)
literal(
    "  const difficulty = rng.pick(DIFFICULTIES);",
    '  const difficulty: Men002Difficulty = "Easy";',
    "difficulty selection",
)
literal(
    "  const draft = generateDraft(prototypeId, seed);\n  const verification = verifyDraft(draft);",
    "  const draft = generateDraft(prototypeId, seed);\n"
    "  draft.state.difficulty = classifyMenCp007Difficulty(draft.state);\n"
    "  const verification = verifyDraft(draft);",
    "difficulty application",
)

RUNTIME_PATH.write_text(text, encoding="utf8")
