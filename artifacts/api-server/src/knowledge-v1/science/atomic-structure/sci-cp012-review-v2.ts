import { SCI_CP012_REVIEW_V1, type SciCp012ReviewQuestion } from "./sci-cp012-review-v1";

// Editorial V2: preserves every question semantic, answer and option.
// Only the explanation is extended with one short learner-facing sentence.
const EXPLANATION_ADDITIONS: readonly string[] = Object.freeze([
  " This is the particle whose gain or loss changes the charge of an atom or ion.",
  " The number of protons is also the atomic number, so it identifies the element.",
  " Because it has no charge, changing the number of neutrons changes mass but not the element's atomic number.",
  " Nearly all of the atom's mass is concentrated in this tiny central region.",
  " This is why electron mass is usually ignored in simple mass-number calculations.",
  " So the total positive charge of the nucleus depends on how many protons it contains.",
  " Therefore, if the proton number changes, the element itself changes.",
  " These two nuclear particles are together called nucleons, so mass number counts the nucleons.",
  " Their opposite charges cancel each other, giving the atom no overall charge.",
  " Isotopes may have different masses, but they remain the same element because their atomic number is unchanged.",
  " No extra calculation is needed: proton count and atomic number are the same value.",
  " Both protons and neutrons contribute to mass number, so we simply add them.",
  " Electrons are outside the nucleus, so they do not give the nucleus its positive charge.",
  " These shells represent different energy levels available to electrons in the simple Bohr model.",
  " The K shell is the first shell, so putting n = 1 in 2n² gives only 2 places.",
  " The L shell is the second shell, so n = 2 and its maximum capacity becomes 8.",
  " The number of electrons in this shell is especially useful for understanding valency and chemical reactions.",
  " Atoms mainly gain, lose or share these outer electrons when they form chemical bonds.",
  " Neutral means total positive and negative charges are equal, so electron count must match proton count.",
  " Since atomic number gives the proton count, subtracting it from mass number leaves the neutron count.",
  " Mass number counts all protons and neutrons in the nucleus, so both values must be added.",
  " If the numbers were unequal, the atom would carry a net electric charge and would be an ion.",
  " First find protons by A − neutrons; that proton count is the atomic number.",
  " Each value comes from a different rule: Z = protons, A = protons + neutrons, and neutral electrons = protons.",
  " The first shell fills with 2 electrons, the second with 8, and the remaining electron goes into the third shell.",
  " After 2 electrons fill the first shell and 8 fill the second, 2 electrons remain for the third shell.",
  " After placing 2 and 8 electrons in the first two shells, 7 electrons remain in the third shell.",
  " With 8 electrons in its outer shell, argon has a stable noble-gas arrangement.",
  " For a neutral atom, total electrons equal total protons, so the electron total directly gives the atomic number.",
  " Adding all shell entries gives the total number of electrons in the atom.",
  " Losing one electron leaves sodium with a complete outer shell underneath, which is a more stable arrangement.",
  " Losing two outer electrons exposes the filled shell below, so magnesium commonly forms Mg²⁺.",
  " Instead of losing seven electrons, chlorine can gain just one electron to complete its outer shell.",
  " A positive ion has fewer electrons than the neutral atom because electrons have been lost.",
  " A negative ion has more electrons than the neutral atom because electrons have been gained.",
  " The 2+ charge means two electrons have been removed: 12 − 2 = 10.",
  " Same proton number means same element; different neutron number explains the different mass number.",
  " Both atoms are chlorine because their proton count is the same, but the different neutron counts give masses 35 and 37.",
  " Equal mass number does not make them the same element because their proton numbers are different.",
  " They both have mass number 40, but argon and calcium have different atomic numbers, so they are different elements.",
  " Chemical reactions mainly involve outer electrons, not neutrons in the nucleus.",
  " All three have atomic number 1; they differ only in neutron number and therefore in mass.",
  " Cathode rays were shown to contain negatively charged particles, which were later called electrons.",
  " If atoms were filled uniformly with matter, many more alpha particles would have been strongly deflected.",
  " The rare strong deflections could occur only if alpha particles sometimes came very close to a concentrated positive region.",
  " This model helped explain why electrons could exist in distinct shells rather than at any arbitrary energy.",
  " The neutron explained how nuclei could contain extra mass without adding extra positive charge.",
  " It is often called the 'plum-pudding' model: negative electrons were imagined inside a spread-out positive charge.",
  " The two quantities are related but not identical: atomic number counts only protons, while mass number counts protons and neutrons.",
  " The first statement keeps the atoms in the same element; the second is false because different mass numbers are what distinguish isotopes.",
  " Losing negative electrons leaves an excess positive charge, so that process forms a cation.",
  " Together, the two observations led to the nuclear model: a tiny dense nucleus surrounded by mostly empty space.",
  " These are the capacities of the first two shells in the simple 2n² rule used at this level.",
  " Changing neutron number can create an isotope, but the element stays the same as long as proton number stays unchanged.",
  " Net charge = protons − electrons = 11 − 10 = +1.",
  " There is one extra electron compared with protons, so the net charge is −1.",
  " Use the three basic rules in order: protons = Z, neutrons = A − Z, and neutral electrons = protons.",
  " Their proton number fixes both as carbon; only the neutron count changes, which is exactly the isotope condition.",
  " One gained electron changes 2, 8, 7 into 2, 8, 8, completing the outer shell.",
  " The two lost electrons are the two valence electrons, leaving the stable 2, 8 arrangement."
]);

export const SCI_CP012_REVIEW_V2: readonly SciCp012ReviewQuestion[] = Object.freeze(
  SCI_CP012_REVIEW_V1.map((question, index) => Object.freeze({
    ...question,
    explanation: `${question.explanation}${EXPLANATION_ADDITIONS[index]}`,
  })),
);

export function validateSciCp012ExplanationV2(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (SCI_CP012_REVIEW_V2.length !== SCI_CP012_REVIEW_V1.length) errors.push("Question count changed");
  for (let i = 0; i < SCI_CP012_REVIEW_V1.length; i += 1) {
    const before = SCI_CP012_REVIEW_V1[i];
    const after = SCI_CP012_REVIEW_V2[i];
    if (before.questionId !== after.questionId) errors.push(`${before.questionId}: id changed`);
    if (before.stem !== after.stem) errors.push(`${before.questionId}: stem changed`);
    if (before.canonicalAnswer !== after.canonicalAnswer) errors.push(`${before.questionId}: answer changed`);
    if (before.correctIndex !== after.correctIndex) errors.push(`${before.questionId}: correct index changed`);
    if (JSON.stringify(before.options) !== JSON.stringify(after.options)) errors.push(`${before.questionId}: options changed`);
    if (before.difficulty !== after.difficulty) errors.push(`${before.questionId}: difficulty changed`);
    if (before.qlId !== after.qlId) errors.push(`${before.questionId}: QL changed`);
    if (!after.explanation.startsWith(before.explanation)) errors.push(`${before.questionId}: base explanation not preserved`);
    if (after.explanation.length <= before.explanation.length) errors.push(`${before.questionId}: explanation not expanded`);
  }
  return { valid: errors.length === 0, errors };
}
