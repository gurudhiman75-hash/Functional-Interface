from pathlib import Path

root = Path(__file__).resolve().parent
path = root / "foundation/cp003-runtime.ts"
text = path.read_text(encoding="utf-8")

old_shift = '  const shift = pick([2, 3, 4, 5], next);'
new_shift = '  let shift = pick([2, 3, 4, 5], next);'
if text.count(old_shift) != 1:
    raise SystemExit(f"Expected one shift declaration; found {text.count(old_shift)}")
text = text.replace(old_shift, new_shift)

old_block = '''  if (entry.scenarioVariant === "familyAgeElapsedTime") {
    const agedAverage = add(oldAverage, rational(elapsedYears));
    newCount = n + 1;
    newAverage = subtract(agedAverage, rational(3));
    addedValue = subtract(multiply(newAverage, rational(newCount)), multiply(agedAverage, rational(n)));
  } else if (entry.scenarioVariant === "newbornAfterElapsedYears") {
    const agedAverage = add(oldAverage, rational(elapsedYears));
    newCount = n + 1;
    newAverage = subtract(agedAverage, rational(3));
    addedValue = subtract(multiply(newAverage, rational(newCount)), multiply(agedAverage, rational(n)));
  } else if (entry.scenarioVariant === "memberLeavesAfterYears") {
    const agedAverage = add(oldAverage, rational(elapsedYears));
    newCount = n - 1;
    newAverage = add(agedAverage, rational(shift));
    removedValue = subtract(multiply(agedAverage, rational(n)), multiply(newAverage, rational(newCount)));
  } else if (entry.solveMode === "findNewAverageAfterAddition" || entry.solveMode === "findAddedMemberValueFromShift") {
    newCount = n + 1;
    newAverage = add(oldAverage, rational(shift));
    addedValue = subtract(multiply(newAverage, rational(newCount)), multiply(oldAverage, rational(n)));
  } else if (entry.solveMode === "findNewAverageAfterRemoval" || entry.solveMode === "findRemovedMemberValueFromShift") {
    newCount = n - 1;
    newAverage = add(oldAverage, rational(shift));
    removedValue = subtract(multiply(oldAverage, rational(n)), multiply(newAverage, rational(newCount)));
'''
new_block = '''  if (
    entry.scenarioVariant === "familyAgeElapsedTime" ||
    entry.scenarioVariant === "newbornAfterElapsedYears"
  ) {
    const agedAverage = add(oldAverage, rational(elapsedYears));
    const validShifts = [1, 2, 3, 4, 5].filter((candidate) => {
      const childAge = toNumber(agedAverage) - candidate * (n + 1);
      return childAge >= 1 && childAge <= 18;
    });
    if (!validShifts.length) {
      throw new Error(`No valid child-age construction for ${entry.qlId}`);
    }
    shift = pick(validShifts, next);
    newCount = n + 1;
    newAverage = subtract(agedAverage, rational(shift));
    addedValue = subtract(
      multiply(newAverage, rational(newCount)),
      multiply(agedAverage, rational(n)),
    );
  } else if (entry.scenarioVariant === "memberLeavesAfterYears") {
    const agedAverage = add(oldAverage, rational(elapsedYears));
    const validShifts = [1, 2, 3, 4, 5].filter((candidate) => {
      const leavingAge = toNumber(agedAverage) - candidate * (n - 1);
      return leavingAge >= 18 && leavingAge <= 90;
    });
    if (!validShifts.length) {
      throw new Error(`No valid leaving-age construction for ${entry.qlId}`);
    }
    shift = pick(validShifts, next);
    newCount = n - 1;
    newAverage = add(agedAverage, rational(shift));
    removedValue = subtract(
      multiply(agedAverage, rational(n)),
      multiply(newAverage, rational(newCount)),
    );
  } else if (
    entry.solveMode === "findNewAverageAfterAddition" ||
    entry.solveMode === "findAddedMemberValueFromShift"
  ) {
    newCount = n + 1;
    newAverage = add(oldAverage, rational(shift));
    addedValue = subtract(
      multiply(newAverage, rational(newCount)),
      multiply(oldAverage, rational(n)),
    );
  } else if (
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
    );
'''
if text.count(old_block) != 1:
    raise SystemExit(f"Expected one legacy CP-003 construction block; found {text.count(old_block)}")
text = text.replace(old_block, new_block)

old_options = '''  const answer = Number(solver.answer);
  const step = parameters.contextDomain === "Workplace" ? 1000 : 1;
  const candidates = [answer, answer - step, answer + step, answer + 2 * step].map(String);
  const unique = [...new Set(candidates)];
  if (unique.length !== 4 || Number(unique[0]) <= 0) throw new Error(`Invalid CP-003 options for ${parameters.questionLanguageId}`);
  const shift = hash(`${parameters.seed}:options`) % 4;
  const options = [...unique];
  for (let i = 0; i < shift; i += 1) options.push(options.shift()!);
  return { options, correctIndex: options.indexOf(solver.answer) };'''
new_options = '''  const answer = Number(solver.answer);
  const step = parameters.contextDomain === "Workplace" ? 1000 : 1;
  const unique = [String(answer)];
  for (const candidate of [
    answer - step,
    answer + step,
    answer + 2 * step,
    answer - 2 * step,
    answer + 3 * step,
  ]) {
    if (candidate <= 0) continue;
    const rendered = String(candidate);
    if (!unique.includes(rendered)) unique.push(rendered);
    if (unique.length === 4) break;
  }
  if (unique.length !== 4 || answer <= 0) {
    throw new Error(`Invalid CP-003 options for ${parameters.questionLanguageId}`);
  }
  const shift = hash(`${parameters.seed}:options`) % 4;
  const options = [...unique];
  for (let i = 0; i < shift; i += 1) options.push(options.shift()!);
  return { options, correctIndex: options.indexOf(solver.answer) };'''
if text.count(old_options) != 1:
    raise SystemExit(f"Expected one legacy CP-003 option block; found {text.count(old_options)}")
text = text.replace(old_options, new_options)

path.write_text(text, encoding="utf-8")
Path(__file__).unlink()
