import type { SerV3NaturalExplanation } from "./ser-v3-natural-pedagogical";

const AWKWARD_STUDENT_PHRASES =
  /visible schedule|forward operation|direction of work|place numbers|supporting check|one-step error|is a may look|ordered (?:vowel|consonant) list|same-row|forward rule/i;

function polishLine(value: string): string {
  let result = value;

  result = result.replace(
    /^Start with the known part of the series\. The moves (.+) confirm the forward rule without using the missing first term\.$/,
    (_match, moves: string) => `Look only at the shown terms. ${moves} shows how the series moves forward.`,
  );

  result = result.replace(
    /^The forward jump is (.+), so finding the earlier term requires (.+): (.+)\.$/,
    (_match, forward: string, backward: string, calculation: string) =>
      `The series moves by ${forward} going forward. To go back, move by ${backward}: ${calculation}.`,
  );

  result = result.replace(
    /^The series advances by (.+?) (vowel|consonant) steps, so an earlier term requires (.+?) (?:vowel|consonant) steps within this letter list\.$/,
    (_match, forward: string, kind: string, backward: string) =>
      `The series moves forward by ${forward} ${kind} steps. To go back, move ${backward} ${kind} steps in the same list.`,
  );

  result = result.replace(
    "A previous-term question reverses the direction of work. Continuing the forward operation from the first known term produces the next term, not the missing earlier term.",
    "Here we need the term before the series, so move backward. Moving forward would give the next term instead.",
  );

  result = result.replace(
    /Choice ([1-4]) \((.+?)\) is a direction or one-step error; move backward instead\./g,
    "Choice $1 ($2) comes from moving the wrong way or by the wrong number of letters.",
  );

  result = result.replace(
    /Convert letters to (.+?) and increase the alphabet jump according to the visible schedule\./g,
    "Use $1. The letter jump gets bigger in the order shown by the series.",
  );

  result = result.replace(
    /^Write the ordered (vowel|consonant) list with place numbers: (.+?)\. The known terms show a jump of (.+?) (?:vowel|consonant) steps each time\.$/,
    (_match, kind: string, list: string, jump: string) =>
      `Write the ${kind} list: ${list}. Count only in this list. Move ${jump} ${kind} steps each time.`,
  );

  result = result.replace(
    /^Write the ordered (vowel|consonant) list with place numbers: (.+?)\. The known moves (.+) (?:establish|show|give) the forward jump\.$/,
    (_match, kind: string, list: string, moves: string) =>
      `Write the ${kind} list: ${list}. Count only in this list. The shown moves ${moves} give the rule.`,
  );

  result = result.replace(
    /^Write the allowed letter list once, then count inside that list while keeping standard positions .+ as a check\.$/,
    "Write the vowel or consonant list once and count directly in it.",
  );

  result = result.replace(
    "Count within the stated vowel or consonant set, not through every alphabet letter. Keep standard alphabet positions only as a supporting check.",
    "Use only the vowel or consonant list required by the rule. Do not count every letter of the alphabet.",
  );

  result = result
    .replace(/^at this place,/, "At this place,")
    .replace(/^check by moving forward:/, "Check by moving forward:")
    .replace(/same-row/g, "same row")
    .replace(/letter movement/g, "letter jump")
    .replace(/standard positions/g, "letter numbers")
    .replace(/forward rule/g, "rule for moving forward")
    .replace(/with a fixed change of/g, "and changes by")
    .replace(/The displayed term is/g, "The shown term is")
    .replace(/The corrected term links properly on both sides:/g, "After replacing it, check both sides:")
    .replace(/^the needed place is in (Odd|Even)-position row \([^)]*\), so use only that row's rule\.$/i,
      (_match, row: string) => `The blank is in the ${row.toLowerCase()}-position row, so follow only that row.`)
    .replace(/^the needed place is in (Odd|Even)-position row \((?:positions )?[^)]*\)\. Following that row's rule, position (.+?) should contain (.+?)\.$/i,
      (_match, row: string, position: string, answer: string) =>
        `The blank is in the ${row.toLowerCase()}-position row. In that row, position ${position} should be ${answer}.`)
    .replace(/The needed place belongs to/g, "The blank is in")
    .replace(/At position (.+?), the cycle requires/g, "At position $1, the correct letter is")
    .replace(/At position (.+?), the correct term is/g, "At position $1, the answer should be")
    .replace(/The known terms show/g, "The shown terms have")
    .replace(/The found value also connects correctly on the other side:/g, "Check the next term too:")
    .replace(/A forward check now gives/g, "Check by moving forward:")
    .replace(/so the found term fits the series\./g, "so the answer fits the series.")
    .replace(/the found term therefore fits/g, "the answer fits")
    .replace(/the recovered term therefore fits/g, "the answer fits")
    .replace(/(vowel|consonant) letter list/gi, "$1 list")
    .replace(/^At this place, continue inside the (vowel|consonant) list:/i, "Continue in the $1 list:")
    .replace(/This gives the expected-versus-displayed mismatch directly\./g,
      "This shows exactly where the shown series becomes wrong.");

  const cleaned = result.replace(/\s+/g, " ").trim();
  return cleaned.replace(/^[a-z]/, (letter) => letter.toUpperCase());
}

export function polishSerV3StudentEnglish(
  explanation: SerV3NaturalExplanation,
): SerV3NaturalExplanation {
  return {
    ...explanation,
    corePattern: polishLine(explanation.corePattern),
    derivation: explanation.derivation.map(polishLine),
    examSpeedShortcut: polishLine(explanation.examSpeedShortcut),
    commonTrap: {
      ...explanation.commonTrap,
      warning: polishLine(explanation.commonTrap.warning),
      optionWarnings: explanation.commonTrap.optionWarnings.map(polishLine),
    },
  };
}

export function hasAwkwardSerV3StudentPhrase(
  explanation: SerV3NaturalExplanation,
): boolean {
  const text = [
    explanation.corePattern,
    ...explanation.derivation,
    explanation.examSpeedShortcut,
    explanation.commonTrap.warning,
    ...explanation.commonTrap.optionWarnings,
  ].join(" ");
  return AWKWARD_STUDENT_PHRASES.test(text);
}
