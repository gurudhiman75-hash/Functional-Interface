from pathlib import Path
import subprocess

OLD_BRANCH = "feat/quant-v4-statistics-central-tendency-p0"
OLD_DIR = "artifacts/api-server/src/quant-v4/topics/Statistics/STA-001"
NEW_DIR = Path("artifacts/api-server/src/quant-v4/topics/Statistics/STAT-001")
SHARED_DIR = Path("artifacts/api-server/src/quant-v4/topics/Statistics/shared")

subprocess.run(["git", "fetch", "origin", OLD_BRANCH, "--depth=1"], check=True)
NEW_DIR.mkdir(parents=True, exist_ok=True)
SHARED_DIR.mkdir(parents=True, exist_ok=True)

files = [
    "PHASE0-STATUS.md",
    "central-tendency.test.ts",
    "central-tendency.ts",
    "debug-generation-scan.ts",
    "independent-verifier.ts",
    "index.ts",
    "types.ts",
]

for name in files:
    text = subprocess.check_output(
        ["git", "show", f"FETCH_HEAD:{OLD_DIR}/{name}"],
        text=True,
    )
    for old, new in [
        ("STA-TEMP-", "STAT-TEMP-"),
        ("STA-001", "STAT-001"),
    ]:
        text = text.replace(old, new)
    (NEW_DIR / name).write_text(text)

shared = subprocess.check_output(
    [
        "git",
        "show",
        "FETCH_HEAD:artifacts/api-server/src/quant-v4/topics/Statistics/shared/exact.ts",
    ],
    text=True,
)
(SHARED_DIR / "exact.ts").write_text(shared)

runtime = NEW_DIR / "central-tendency.ts"
s = runtime.read_text()

old = '''  const shiftPerObservation = pick(random, [1, 2, 3, 4]);
  const direction = random() < 0.5 ? -1 : 1;
  const totalDifference = observationCount * shiftPerObservation * direction;
  const wrongValue = pick(random, [40, 50, 60, 70, 80]);
  const correctValue = wrongValue + totalDifference;
  if (correctValue <= 0) throw new Error("STAT-001 corrected-mean state must remain positive.");'''
new = '''  const shiftPerObservation = pick(random, [1, 2, 3, 4]);
  const direction = random() < 0.5 ? -1 : 1;
  const totalMagnitude = observationCount * shiftPerObservation;
  const totalDifference = totalMagnitude * direction;
  const positiveFloor = direction < 0 ? totalMagnitude + 20 : 40;
  const wrongValue = pick(random, [positiveFloor, positiveFloor + 20, positiveFloor + 40, positiveFloor + 60, positiveFloor + 80]);
  const correctValue = wrongValue + totalDifference;'''
if old not in s:
    raise SystemExit("corrected-mean construction target not found")
s = s.replace(old, new, 1)

old = '''  const lowerCentral = String(sorted[middle - 1]!);
  const upperCentral = String(sorted[middle]!);
  const wrongPair = sorted.length % 2 === 0
    ? formatExactNumber(sorted[middle - 2]! + sorted[middle + 1]!, 2)
    : formatExactNumber(sorted[middle - 1]! + sorted[middle + 1]!, 2);
  const meanValue = arithmeticMean(values);'''
new = '''  const lowerCentral = String(sorted[middle - 1]!);
  const upperCentral = String(sorted[middle]!);
  const nextCentral = String(sorted[middle + 1]!);
  const wrongPair = formatExactNumber(sorted[middle - 2]! + sorted[middle + 1]!, 2);
  const meanValue = arithmeticMean(values);
  const midrange = formatExactNumber(sorted[0]! + sorted[sorted.length - 1]!, 2);
  const medianCandidates: readonly Candidate[] = sorted.length % 2 === 0
    ? [
        { text: lowerCentral, misconceptionId: "USE_LOWER_CENTRAL_ONLY", derivation: "Uses only the lower of the two central ordered values instead of averaging both central positions." },
        { text: upperCentral, misconceptionId: "USE_UPPER_CENTRAL_ONLY", derivation: "Uses only the upper of the two central ordered values instead of averaging both central positions." },
        { text: wrongPair, misconceptionId: "AVERAGE_WRONG_CENTRAL_PAIR", derivation: "Averages values outside the two true central positions and therefore uses the wrong positional pair." },
        { text: meanValue, misconceptionId: "CALCULATE_MEAN_INSTEAD", derivation: "Calculates the arithmetic mean instead of locating the middle position after ordering the data." },
        { text: midrange, misconceptionId: "USE_MIDRANGE", derivation: "Averages the minimum and maximum values instead of the two central ordered observations." },
      ]
    : [
        { text: lowerCentral, misconceptionId: "USE_PREVIOUS_ORDERED_VALUE", derivation: "Chooses the observation immediately below the unique central position in the ordered data." },
        { text: nextCentral, misconceptionId: "USE_NEXT_ORDERED_VALUE", derivation: "Chooses the observation immediately above the unique central position in the ordered data." },
        { text: meanValue, misconceptionId: "CALCULATE_MEAN_INSTEAD", derivation: "Calculates the arithmetic mean instead of taking the unique central ordered observation." },
        { text: midrange, misconceptionId: "USE_MIDRANGE", derivation: "Averages the minimum and maximum values instead of selecting the central ordered observation." },
        { text: String(sorted[1]!), misconceptionId: "USE_LOWER_POSITION", derivation: "Selects a lower ordered position rather than the unique central position required for an odd-sized data set." },
      ];'''
if old not in s:
    raise SystemExit("median construction target 1 not found")
s = s.replace(old, new, 1)

old = '''    candidates: [
      { text: lowerCentral, misconceptionId: "USE_LOWER_CENTRAL_ONLY", derivation: "Selects the lower central ordered value without applying the correct odd/even median rule." },
      { text: upperCentral, misconceptionId: "USE_UPPER_CENTRAL_ONLY", derivation: "Selects the upper central ordered value instead of applying the full median rule." },
      { text: wrongPair, misconceptionId: "AVERAGE_WRONG_CENTRAL_PAIR", derivation: "Averages values surrounding the true centre but uses the wrong central positions." },
      { text: meanValue, misconceptionId: "CALCULATE_MEAN_INSTEAD", derivation: "Calculates the arithmetic mean instead of locating the middle position after ordering the data." },
    ],'''
if old not in s:
    raise SystemExit("median construction target 2 not found")
s = s.replace(old, "    candidates: medianCandidates,", 1)
runtime.write_text(s)

status = NEW_DIR / "PHASE0-STATUS.md"
status.write_text(
    status.read_text()
    + "\n## Namespace correction\n\n"
    + "`STAT-001` is the Quant V4 Statistics package ID. `STA-001` is already owned globally by the frozen Reasoning Statement & Assumption package and must not be reused.\n"
)

Path(".github/workflows/quant-v4-statistics-central-tendency-stat-p0.yml").write_text('''name: Quant V4 Statistics central tendency STAT P0

on:
  push:
    branches:
      - feat/quant-v4-statistics-central-tendency-stat-p0
    paths:
      - "artifacts/api-server/src/quant-v4/topics/Statistics/STAT-001/**"
      - "artifacts/api-server/src/quant-v4/topics/Statistics/shared/**"
  pull_request:
    branches:
      - New-main
    paths:
      - "artifacts/api-server/src/quant-v4/topics/Statistics/STAT-001/**"
      - "artifacts/api-server/src/quant-v4/topics/Statistics/shared/**"
  workflow_dispatch:

concurrency:
  group: quant-v4-statistics-stat-p0-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  statistics-central-tendency:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Generation and option scan
        run: npx -y tsx artifacts/api-server/src/quant-v4/topics/Statistics/STAT-001/debug-generation-scan.ts
      - name: Central tendency deterministic proof
        run: npx -y tsx artifacts/api-server/src/quant-v4/topics/Statistics/STAT-001/central-tendency.test.ts
      - name: Patch hygiene
        run: git diff --check
''')
