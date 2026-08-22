const CP008_ENGLISH_ANSWER_LABELS: Readonly<Record<string, string>> = Object.freeze({
  "NO SOLUTION": "No value of x is possible",
  "ONE RESIDUE CLASS": "Exactly one value is possible",
  "MULTIPLE RESIDUE CLASSES": "More than one value is possible",
  "ALL RESIDUES": "Every value is possible",
  "INCOMPATIBLE — NO INTEGER SOLUTION": "No integer satisfies all the conditions",
  "COMPATIBLE — UNIQUE MODULO THE PRODUCT": "A common solution exists; the pattern repeats after the product of the divisors",
  "COMPATIBLE — UNIQUE MODULO THE LCM": "A common solution exists; the pattern repeats after the LCM of the divisors",
  "COMPATIBLE — ONE CLASS MODULO THE PRODUCT": "A common solution exists; the pattern repeats after the product of the divisors",
  "COMPATIBLE — ONE CLASS MODULO THE LCM": "A common solution exists; the pattern repeats after the LCM of the divisors",
  "INDETERMINATE FROM THE GIVEN DATA": "It cannot be decided from the given information",
});

export function presentNumCp008EnglishAnswer(value: string): string {
  return CP008_ENGLISH_ANSWER_LABELS[value] ?? value;
}
