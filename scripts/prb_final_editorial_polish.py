from pathlib import Path

ROOT = Path("artifacts/api-server/src/quant-v4/topics/Probability")
path = ROOT / "shared/exam-depth-remodeler.ts"
text = path.read_text(encoding="utf-8")

old = '''  if (cardModes.has(mode)) {
    return "Use the standard 52-card deck counts, and count any card belonging to two required groups only once.";
  }'''
new = '''  if (mode === "findConditionalCardProbability") {
    return "Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.";
  }
  if (cardModes.has(mode)) {
    return "Use the standard 52-card deck counts, and count any card belonging to two required groups only once.";
  }'''
if old not in text:
    raise SystemExit("Could not prioritise conditional-card method")
text = text.replace(old, new, 1)

old = '''  if (mode === "findConditionalCardProbability") {
    return "Use only the cards allowed by the given condition as the sample space; cards outside that restricted set are no longer possible.";
  }
  if (conditionalModes.has(mode)) {'''
new = '''  if (conditionalModes.has(mode)) {'''
if old not in text:
    raise SystemExit("Could not remove duplicate conditional-card branch")
text = text.replace(old, new, 1)

old = '''  if (arrangementModes.has(mode)) {
    return "Count all equally likely arrangements first, then count only those satisfying the stated position, adjacency or last-digit restriction.";
  }'''
new = '''  if (mode === "findRandomArrangementPropertyProbability") {
    return "Use symmetry: in a random queue, every candidate is equally likely to occupy the first position.";
  }
  if (mode === "findTogetherOrApartProbability") {
    return "Count all queue arrangements, treat the two specified candidates as one block to count adjacent arrangements, and subtract from the total.";
  }
  if (mode === "findPositionRestrictionProbability") {
    return "Count all arrangements first, then count the arrangements in which the specified person occupies one of the allowed positions.";
  }
  if (mode === "findNumberFormationProbability") {
    return "Count all admissible digit arrangements, then count those whose final digit satisfies the required number property.";
  }'''
if old not in text:
    raise SystemExit("Could not specialise arrangement methods")
text = text.replace(old, new, 1)

old = '''  if (conditionalModes.has(mode)) return "The condition changes the denominator: outcomes outside the restricted group cannot be selected.";'''
new = '''  if (mode === "findConditionalUrnProbability") return "After the known first draw, the second draw is made only from the remaining objects, so both remaining counts must be used.";
  if (mode === "findConditionalCardProbability") return "Once the card type is known, that restricted card group—not the full deck—becomes the denominator.";
  if (mode === "findConditionalNumberProbability") return "Only numbers satisfying the given divisibility condition belong to the denominator.";
  if (mode === "findReverseConditionalCount") return "The shortlisted group is the complete sample space here, so its size is the denominator of the probability relation.";
  if (conditionalModes.has(mode)) return "The group named in the condition becomes the new sample space and therefore the new denominator.";'''
if old not in text:
    raise SystemExit("Could not specialise conditional key points")
text = text.replace(old, new, 1)

old = '''  const raw = `${favourable}/${total}`;
  if (core.some((line) => line.includes(raw) && line.includes(solved.exactDisplay))) return null;'''
new = '''  if (core.some((line) => line.includes(solved.exactDisplay))) return null;
  const raw = `${favourable}/${total}`;'''
if old not in text:
    raise SystemExit("Could not suppress redundant simplification")
text = text.replace(old, new, 1)

old = '''  return cleaned.length === 0 ? cleaned : `${cleaned[0]!.toUpperCase()}${cleaned.slice(1)}`;'''
new = '''  if (/^[a-z]\\s*=/.test(cleaned)) return cleaned;
  return cleaned.length === 0 ? cleaned : `${cleaned[0]!.toUpperCase()}${cleaned.slice(1)}`;'''
if old not in text:
    raise SystemExit("Could not preserve lowercase algebraic variables")
text = text.replace(old, new, 1)

path.write_text(text, encoding="utf-8")
