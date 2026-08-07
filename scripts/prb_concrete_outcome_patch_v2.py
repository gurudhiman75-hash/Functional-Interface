from pathlib import Path

base_script_path = Path("scripts/prb_concrete_outcome_patch.py")
source = base_script_path.read_text()
source = source.replace(
    '  checks.push(check("contextual-explanation", !hasGenericExplanation(explanation), "The explanation states generic counts without explaining the question-specific reasoning."));',
    '  checks.push(check("contextual-explanation", !hasGenericExplanation(explanation), "The explanation states generic counts or uses unnatural instructional wording."));',
)
exec(compile(source, str(base_script_path), "exec"), {"__name__": "__main__"})

explanation_path = Path("artifacts/api-server/src/quant-v4/topics/Probability/shared/explanation-renderer.ts")
text = explanation_path.read_text()

old_exact_wording = '`The sequences with exactly ${heads} ${plural(heads, "head")} are ${sequenceList(matches)}.`'
new_exact_wording = '`For exactly ${heads === 1 ? "one head" : `${heads} heads`}, the favourable sequences are ${sequenceList(matches)}.`'
if new_exact_wording not in text:
    if old_exact_wording not in text:
        raise SystemExit("Could not patch exact-head coin wording")
    text = text.replace(old_exact_wording, new_exact_wording, 1)

start = '  if (mode === "findAtLeastOneUsingComplement") {'
end = '  if (mode === "findNoneProbability") {'
replacement = '''  if (mode === "findAtLeastOneUsingComplement") {
    const trials = n(parameters, "trials");
    const allTails = "T".repeat(trials);
    const noHeads = fraction(1, 2 ** trials);
    return [
      `The only sequence with no head is ${allTails}.`,
      `So P(at least one head) = 1 - P(${allTails}) = 1 - ${noHeads} = ${solved.exactDisplay}.`,
    ];
  }
'''
if replacement not in text:
    try:
        i = text.index(start)
        j = text.index(end, i)
    except ValueError as exc:
        raise SystemExit("Could not patch at-least-one coin explanation") from exc
    text = text[:i] + replacement + text[j:]
explanation_path.write_text(text)
