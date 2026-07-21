from pathlib import Path

root = Path(__file__).resolve().parent
path = root / "foundation/cp003-runtime.ts"
text = path.read_text(encoding="utf-8")

old_helper = '''function natural(value: Rational) {
  return formatRational(value, "EXACT_INTEGER");
}'''
new_helper = '''function natural(value: Rational) {
  return formatRational(value, "EXACT_INTEGER");
}

function groupIndianDigits(value: string) {
  const match = value.match(/^(-?)(\\d+)(\\.\\d+)?$/);
  if (!match) return value;
  const [, sign, integer, decimal = ""] = match;
  if (integer.length <= 3) return `${sign}${integer}${decimal}`;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3);
  const groupedLeading = leading.replace(/\\B(?=(\\d{2})+(?!\\d))/g, ",");
  return `${sign}${groupedLeading},${lastThree}${decimal}`;
}

function stemValue(entry: ReturnType<typeof getAvg001QuestionEntry>, value: Rational) {
  const rendered = natural(value);
  return entry.contextDomain === "Workplace"
    ? groupIndianDigits(rendered)
    : rendered;
}'''
if text.count(old_helper) != 1:
    raise SystemExit(f"Expected one natural helper; found {text.count(old_helper)}")
text = text.replace(old_helper, new_helper)

old_addition = '''  } else if (
    entry.solveMode === "findNewAverageAfterAddition" ||
    entry.solveMode === "findAddedMemberValueFromShift"
  ) {
    newCount = n + 1;
    newAverage = add(oldAverage, rational(shift));
    addedValue = subtract(
      multiply(newAverage, rational(newCount)),
      multiply(oldAverage, rational(n)),
    );'''
new_addition = '''  } else if (
    entry.solveMode === "findNewAverageAfterAddition" ||
    entry.solveMode === "findAddedMemberValueFromShift"
  ) {
    const shiftPool = entry.contextDomain === "Classroom"
      ? [1, 2, 3, 4, 5]
      : [2, 3, 4, 5];
    const validShifts = shiftPool.filter((candidate) => {
      const candidateValue = toNumber(oldAverage) + candidate * (n + 1);
      return entry.contextDomain !== "Classroom" || candidateValue <= 100;
    });
    if (!validShifts.length) {
      throw new Error(`No valid addition construction for ${entry.qlId}`);
    }
    shift = pick(validShifts, next);
    newCount = n + 1;
    newAverage = add(oldAverage, rational(shift));
    addedValue = subtract(
      multiply(newAverage, rational(newCount)),
      multiply(oldAverage, rational(n)),
    );'''
if text.count(old_addition) != 1:
    raise SystemExit(f"Expected one generic addition block; found {text.count(old_addition)}")
text = text.replace(old_addition, new_addition)

old_removal = '''  } else if (
    entry.solveMode === "findNewAverageAfterRemoval" ||
    entry.solveMode === "findRemovedMemberValueFromShift"
  ) {
    const minimumRemoved = entry.contextDomain === "Workplace" ? 10000 : 1;
    const maximumRemoved = entry.contextDomain === "Classroom" ? 100 : Number.POSITIVE_INFINITY;
    const validShifts = [1, 2, 3, 4, 5].filter((candidate) => {
      const candidateValue = toNumber(oldAverage) - candidate * (n - 1);
      return candidateValue >= minimumRemoved && candidateValue <= maximumRemoved;
    });
    if (!validShifts.length) {
      throw new Error(`No valid removal construction for ${entry.qlId}`);
    }
    shift = pick(validShifts, next);
    newCount = n - 1;
    newAverage = add(oldAverage, rational(shift));
    removedValue = subtract(
      multiply(oldAverage, rational(n)),
      multiply(newAverage, rational(newCount)),
    );'''
new_removal = '''  } else if (
    entry.solveMode === "findNewAverageAfterRemoval" ||
    entry.solveMode === "findRemovedMemberValueFromShift"
  ) {
    const minimumRemoved = entry.contextDomain === "Workplace" ? 10000 : 1;
    const maximumRemoved = entry.contextDomain === "Classroom" ? 100 : Number.POSITIVE_INFINITY;
    const shiftPool = entry.contextDomain === "Workplace"
      ? [500, 1000, 1500, 2000]
      : [1, 2, 3, 4, 5];
    const validShifts = shiftPool.filter((candidate) => {
      const candidateValue = toNumber(oldAverage) - candidate * (n - 1);
      return candidateValue >= minimumRemoved && candidateValue <= maximumRemoved;
    });
    if (!validShifts.length) {
      throw new Error(`No valid removal construction for ${entry.qlId}`);
    }
    shift = pick(validShifts, next);
    newCount = n - 1;
    newAverage = add(oldAverage, rational(shift));
    removedValue = subtract(
      multiply(oldAverage, rational(n)),
      multiply(newAverage, rational(newCount)),
    );'''
if text.count(old_removal) != 1:
    raise SystemExit(f"Expected one generic removal block; found {text.count(old_removal)}")
text = text.replace(old_removal, new_removal)

old_replacement = '''  } else if (entry.solveMode === "findNewAverageAfterReplacement" || entry.solveMode === "findReplacementValueFromShift") {
    newCount = n;
    newAverage = add(oldAverage, rational(shift));
    outgoingValue = subtract(oldAverage, rational(5));
    incomingValue = add(outgoingValue, multiply(rational(n), rational(shift)));'''
new_replacement = '''  } else if (
    entry.solveMode === "findNewAverageAfterReplacement" ||
    entry.solveMode === "findReplacementValueFromShift"
  ) {
    outgoingValue = subtract(oldAverage, rational(5));
    const validShifts = [1, 2, 3, 4, 5].filter((candidate) => {
      const candidateValue = toNumber(outgoingValue!) + n * candidate;
      return entry.contextDomain !== "Classroom" || candidateValue <= 100;
    });
    if (!validShifts.length) {
      throw new Error(`No valid replacement construction for ${entry.qlId}`);
    }
    shift = pick(validShifts, next);
    newCount = n;
    newAverage = add(oldAverage, rational(shift));
    incomingValue = add(outgoingValue, multiply(rational(n), rational(shift)));'''
if text.count(old_replacement) != 1:
    raise SystemExit(f"Expected one replacement block; found {text.count(old_replacement)}")
text = text.replace(old_replacement, new_replacement)

old_render = '''    oldAverage: natural(oldAverage),
    newAverage: natural(newAverage),
    oldTotal: natural(oldTotal),
    newTotal: natural(newTotal),'''
new_render = '''    oldAverage: stemValue(entry, oldAverage),
    newAverage: stemValue(entry, newAverage),
    oldTotal: stemValue(entry, oldTotal),
    newTotal: stemValue(entry, newTotal),'''
if text.count(old_render) != 1:
    raise SystemExit(f"Expected one render-value block; found {text.count(old_render)}")
text = text.replace(old_render, new_render)

for name in ["addedValue", "removedValue", "outgoingValue", "incomingValue"]:
    old = f'  if ({name}) renderVariables.{name} = natural({name});'
    new = f'  if ({name}) renderVariables.{name} = stemValue(entry, {name});'
    if text.count(old) != 1:
        raise SystemExit(f"Expected one {name} render line; found {text.count(old)}")
    text = text.replace(old, new)

path.write_text(text, encoding="utf-8")
Path(__file__).unlink()
