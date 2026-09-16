import type { KnowledgeV1Difficulty } from "../../types";

type ReviewSpec = readonly [
  ql: number,
  difficulty: KnowledgeV1Difficulty,
  stem: string,
  answer: string,
  distractors: readonly [string, string, string],
  explanation: string,
  factIds: readonly string[],
];

export type SciCp012ReviewQuestion = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-012";
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

const SOURCE_IDS = Object.freeze([
  "NCERT-SCIENCE-IX-STRUCTURE-ATOM",
  "NCERT-SCIENCE-IX-ATOMS-MOLECULES",
  "NIOS-SECONDARY-SCIENCE-ATOMIC-STRUCTURE",
]);

export const SCI_CP012_QL_NAMES_V1: Record<number, string> = {
  1: "Subatomic particles and charges",
  2: "Atomic number and mass number",
  3: "Basic atomic structure and electron shells",
  4: "Proton-neutron-electron calculation",
  5: "Electronic configuration of the first 20 elements",
  6: "Valency and simple ion formation",
  7: "Isotopes and isobars",
  8: "Atomic models and key discoveries",
  9: "Statement I/II",
  10: "Mixed atomic-structure application",
};

const REVIEW_SPECS: readonly ReviewSpec[] = Object.freeze([
  [1, "Easy", "Which subatomic particle carries a negative electric charge?", "electron", ["proton", "neutron", "nucleus"], "An electron carries one unit of negative charge. Protons are positive and neutrons are electrically neutral.", ["sci012-electron-negative"]],
  [1, "Easy", "Which subatomic particle carries a positive electric charge?", "proton", ["electron", "neutron", "photon"], "A proton carries one unit of positive charge and is found in the atomic nucleus.", ["sci012-proton-positive"]],
  [1, "Easy", "Which subatomic particle has no electric charge?", "neutron", ["electron", "proton", "positron"], "A neutron is electrically neutral and is present in the nucleus of most atoms.", ["sci012-neutron-neutral"]],
  [1, "Easy", "Which two particles are found in the nucleus of an ordinary atom?", "protons and neutrons", ["electrons and protons", "electrons and neutrons", "electrons only"], "The nucleus contains protons and neutrons, while electrons occupy the region around the nucleus.", ["sci012-nucleus-particles"]],
  [1, "Easy", "Which particle has a mass much smaller than that of a proton?", "electron", ["neutron", "alpha particle", "atomic nucleus"], "An electron has only about 1/1836 of the mass of a proton, so its mass is much smaller.", ["sci012-electron-small-mass"]],
  [1, "Easy", "Which particle determines the positive charge of an atomic nucleus?", "proton", ["electron", "neutron", "photon"], "Each proton contributes one positive charge to the nucleus. Neutrons have no charge.", ["sci012-nuclear-positive-charge"]],

  [2, "Easy", "The atomic number of an element is equal to the number of:", "protons in its nucleus", ["neutrons in its nucleus", "protons plus neutrons", "electron shells"], "Atomic number, written as Z, is defined by the number of protons in the nucleus.", ["sci012-atomic-number-protons"]],
  [2, "Easy", "The mass number of an atom is the total number of:", "protons and neutrons", ["protons and electrons", "electrons and neutrons", "electron shells and protons"], "Mass number, A, is the sum of the protons and neutrons in the nucleus.", ["sci012-mass-number-nucleons"]],
  [2, "Easy", "A neutral atom has the same number of electrons as:", "protons", ["neutrons", "shells", "nucleons"], "In a neutral atom, the positive charge of the protons is balanced by an equal number of electrons.", ["sci012-neutral-electrons-protons"]],
  [2, "Easy", "Which quantity uniquely identifies an element?", "atomic number", ["mass number", "number of neutrons", "number of isotopes"], "The atomic number fixes the number of protons. All atoms of a particular element have the same atomic number.", ["sci012-element-identity-atomic-number"]],
  [2, "Easy", "If an atom has 11 protons, what is its atomic number?", "11", ["22", "12", "10"], "Atomic number equals the number of protons. With 11 protons, the atomic number is 11.", ["sci012-z-11"]],
  [2, "Easy", "An atom contains 8 protons and 8 neutrons. What is its mass number?", "16", ["8", "10", "64"], "Mass number = protons + neutrons = 8 + 8 = 16.", ["sci012-a-oxygen16"]],

  [3, "Easy", "The central, positively charged part of an atom is called the:", "nucleus", ["electron shell", "valence shell", "orbital cloud only"], "The nucleus is the small central region containing protons and neutrons, so it carries the atom's positive nuclear charge.", ["sci012-nucleus-definition"]],
  [3, "Easy", "In the Bohr model, electrons are arranged around the nucleus in:", "shells or energy levels", ["protons", "neutrons", "mass numbers"], "The Bohr model places electrons in definite shells or energy levels around the nucleus.", ["sci012-bohr-shells"]],
  [3, "Easy", "What is the maximum number of electrons that the K shell can hold?", "2", ["8", "18", "32"], "The maximum capacity of the nth shell is 2n². For K, n = 1, so the capacity is 2 electrons.", ["sci012-k-shell-capacity"]],
  [3, "Easy", "What is the maximum number of electrons that the L shell can hold?", "8", ["2", "18", "32"], "For the L shell, n = 2. Using 2n² gives 2 × 2² = 8 electrons.", ["sci012-l-shell-capacity"]],
  [3, "Easy", "The outermost occupied electron shell of an atom is called the:", "valence shell", ["nucleus", "K shell in every atom", "neutron shell"], "The outermost occupied shell is the valence shell. Its electrons strongly influence chemical behaviour.", ["sci012-valence-shell"]],
  [3, "Easy", "Electrons present in the outermost shell are called:", "valence electrons", ["nucleons", "isotopes", "neutrons"], "Electrons in the outermost occupied shell are called valence electrons and are important in bonding and valency.", ["sci012-valence-electrons"]],

  [4, "Medium", "A neutral atom has atomic number 12. How many electrons does it contain?", "12", ["6", "10", "24"], "Atomic number 12 means 12 protons. A neutral atom has an equal number of electrons, so it has 12 electrons.", ["sci012-neutral-z12-electrons"]],
  [4, "Medium", "An atom has mass number 23 and atomic number 11. How many neutrons does it contain?", "12", ["11", "23", "34"], "Neutrons = mass number − atomic number = 23 − 11 = 12.", ["sci012-neutrons-na23"]],
  [4, "Medium", "An atom has 17 protons and 18 neutrons. What is its mass number?", "35", ["17", "18", "1"], "Mass number is the sum of protons and neutrons: 17 + 18 = 35.", ["sci012-a-35"]],
  [4, "Medium", "A neutral atom contains 9 electrons. How many protons are in its nucleus?", "9", ["18", "10", "8"], "A neutral atom has equal numbers of protons and electrons. Therefore 9 electrons correspond to 9 protons.", ["sci012-neutral-9-electrons-protons"]],
  [4, "Medium", "An atom has mass number 40 and contains 20 neutrons. What is its atomic number?", "20", ["40", "60", "10"], "Atomic number = number of protons = mass number − neutrons = 40 − 20 = 20.", ["sci012-z-ca40"]],
  [4, "Medium", "A neutral atom has 15 protons and 16 neutrons. Which set of values is correct?", "atomic number 15, mass number 31, electrons 15", ["atomic number 16, mass number 31, electrons 15", "atomic number 15, mass number 16, electrons 31", "atomic number 31, mass number 15, electrons 16"], "Atomic number equals protons, so Z = 15. Mass number = 15 + 16 = 31, and a neutral atom has 15 electrons.", ["sci012-z-protons", "sci012-a-pn", "sci012-neutral-pe"]],

  [5, "Medium", "What is the shell-wise electronic configuration of sodium (atomic number 11)?", "2, 8, 1", ["2, 7, 2", "2, 8, 8", "8, 2, 1"], "A neutral sodium atom has 11 electrons. Filling the shells gives 2 in K, 8 in L and 1 in M: 2, 8, 1.", ["sci012-config-na"]],
  [5, "Medium", "What is the shell-wise electronic configuration of magnesium (atomic number 12)?", "2, 8, 2", ["2, 6, 4", "2, 8, 1", "2, 8, 8"], "Magnesium has 12 electrons. They are arranged as 2, 8, 2 in the first three shells.", ["sci012-config-mg"]],
  [5, "Medium", "Which electronic configuration belongs to chlorine (atomic number 17)?", "2, 8, 7", ["2, 7, 8", "2, 8, 8", "2, 6, 9"], "A neutral chlorine atom has 17 electrons, arranged 2, 8, 7.", ["sci012-config-cl"]],
  [5, "Medium", "Which electronic configuration belongs to argon (atomic number 18)?", "2, 8, 8", ["2, 8, 7", "2, 8, 9", "2, 7, 9"], "Argon has 18 electrons. Its shell-wise configuration is 2, 8, 8, giving a complete outer shell.", ["sci012-config-ar"]],
  [5, "Medium", "A neutral atom has the configuration 2, 8, 1. What is its atomic number?", "11", ["10", "17", "19"], "The atom has 2 + 8 + 1 = 11 electrons. Because it is neutral, it also has 11 protons, so Z = 11.", ["sci012-config-to-z11"]],
  [5, "Medium", "A neutral atom has the configuration 2, 8, 8, 2. How many electrons does it contain?", "20", ["18", "22", "10"], "Adding the shell electrons gives 2 + 8 + 8 + 2 = 20 electrons.", ["sci012-config-ca-electrons"]],

  [6, "Medium", "A sodium atom has the configuration 2, 8, 1. What is its usual valency?", "1", ["2", "7", "8"], "Sodium can lose its one outermost electron to attain a stable configuration, so its usual valency is 1.", ["sci012-valency-na"]],
  [6, "Medium", "A magnesium atom has the configuration 2, 8, 2. What is its usual valency?", "2", ["1", "6", "8"], "Magnesium can lose two valence electrons to reach a stable outer shell, so its usual valency is 2.", ["sci012-valency-mg"]],
  [6, "Medium", "A chlorine atom has seven electrons in its outermost shell. What is its usual valency?", "1", ["7", "2", "0"], "Chlorine needs one more electron to complete an octet, so its usual valency is 1.", ["sci012-valency-cl"]],
  [6, "Medium", "How many electrons are present in a sodium ion, Na⁺, if sodium has atomic number 11?", "10", ["11", "12", "22"], "A neutral sodium atom has 11 electrons. Na⁺ forms by losing one electron, leaving 10.", ["sci012-na-plus-electrons"]],
  [6, "Medium", "How many electrons are present in a chloride ion, Cl⁻, if chlorine has atomic number 17?", "18", ["16", "17", "35"], "A neutral chlorine atom has 17 electrons. Cl⁻ forms by gaining one electron, so it has 18.", ["sci012-cl-minus-electrons"]],
  [6, "Medium", "Which species has 10 electrons?", "Mg²⁺ (atomic number 12)", ["Na atom (atomic number 11)", "O atom (atomic number 8)", "Cl⁻ (atomic number 17)"], "Mg²⁺ has lost two electrons from the 12 present in neutral magnesium, leaving 10 electrons.", ["sci012-mg2plus-10e"]],

  [7, "Medium", "Isotopes of an element have the same number of protons but different numbers of:", "neutrons", ["electrons in every ion", "protons", "atomic numbers"], "Isotopes belong to the same element, so they have the same atomic number, but their neutron numbers and mass numbers differ.", ["sci012-isotope-definition"]],
  [7, "Medium", "Which pair represents isotopes of the same element?", "chlorine-35 and chlorine-37", ["argon-40 and calcium-40", "sodium-23 and magnesium-24", "carbon-12 and nitrogen-14"], "Chlorine-35 and chlorine-37 have the same atomic number but different mass numbers, so they are isotopes.", ["sci012-cl-isotopes"]],
  [7, "Medium", "Isobars are atoms of different elements that have the same:", "mass number", ["atomic number", "number of protons", "chemical symbol"], "Isobars have the same mass number but different atomic numbers, so they are different elements.", ["sci012-isobar-definition"]],
  [7, "Medium", "Which pair is an example of isobars?", "argon-40 and calcium-40", ["chlorine-35 and chlorine-37", "hydrogen-1 and hydrogen-2", "carbon-12 and carbon-14"], "Argon-40 and calcium-40 have the same mass number, 40, but different atomic numbers, so they are isobars.", ["sci012-ar-ca-isobars"]],
  [7, "Medium", "Why do isotopes of an element usually show similar chemical properties?", "They have the same atomic number and similar electronic arrangement", ["They always have the same mass number", "They have different numbers of protons", "They are always electrically charged"], "Chemical behaviour depends mainly on electron arrangement. Isotopes have the same proton number and, as neutral atoms, the same electron arrangement.", ["sci012-isotopes-chemical-properties"]],
  [7, "Medium", "The three common isotopes protium, deuterium and tritium belong to which element?", "hydrogen", ["helium", "carbon", "oxygen"], "Protium, deuterium and tritium all have one proton, so they are isotopes of hydrogen.", ["sci012-hydrogen-isotopes"]],

  [8, "Medium", "The discovery of the electron is associated with:", "J. J. Thomson", ["James Chadwick", "Niels Bohr", "Ernest Rutherford"], "J. J. Thomson identified the electron through cathode-ray experiments.", ["sci012-thomson-electron"]],
  [8, "Medium", "Rutherford's alpha-particle scattering experiment showed that most of an atom is:", "empty space", ["filled uniformly with positive charge", "made only of neutrons", "occupied by a solid electron shell"], "Most alpha particles passed through the foil without deflection, showing that most of the atom is empty space.", ["sci012-rutherford-mostly-empty"]],
  [8, "Medium", "Rutherford's experiment provided strong evidence for a small, dense, positively charged:", "nucleus", ["electron", "outer shell", "neutron cloud"], "The few large deflections of alpha particles indicated that positive charge and most mass are concentrated in a tiny nucleus.", ["sci012-rutherford-nucleus"]],
  [8, "Medium", "Which scientist proposed that electrons occupy definite energy levels around the nucleus?", "Niels Bohr", ["J. J. Thomson", "James Chadwick", "John Dalton"], "Niels Bohr proposed an atomic model in which electrons occupy fixed shells or energy levels.", ["sci012-bohr-model"]],
  [8, "Medium", "The neutron was discovered by:", "James Chadwick", ["J. J. Thomson", "Niels Bohr", "Dmitri Mendeleev"], "James Chadwick discovered the neutron in 1932.", ["sci012-chadwick-neutron"]],
  [8, "Medium", "Which description best matches Thomson's early atomic model?", "Electrons embedded in a positively charged sphere", ["Electrons moving in fixed Bohr shells around a nucleus", "A tiny nucleus with the atom mostly empty", "A nucleus containing only neutrons"], "Thomson pictured the atom as a positively charged sphere with negatively charged electrons embedded in it.", ["sci012-thomson-model"]],

  [9, "Hard", "Consider the statements:\nI. Atomic number equals the number of protons.\nII. Mass number equals the number of protons plus neutrons.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Both are defining relations: Z = number of protons, while A = protons + neutrons.", ["sci012-z-protons", "sci012-a-nucleons"]],
  [9, "Hard", "Consider the statements:\nI. Isotopes have the same atomic number.\nII. Isotopes have the same mass number.\nWhich is correct?", "I only", ["II only", "Both I and II", "Neither I nor II"], "Isotopes are atoms of the same element, so their atomic number is the same. Their mass numbers differ because their neutron numbers differ.", ["sci012-isotope-za"]],
  [9, "Hard", "Consider the statements:\nI. A neutral atom has equal numbers of protons and electrons.\nII. A cation is formed when an atom gains electrons.\nWhich is correct?", "I only", ["II only", "Both I and II", "Neither I nor II"], "Statement I is correct. A cation is positively charged and is normally formed when an atom loses electrons, not gains them.", ["sci012-neutral-cation"]],
  [9, "Hard", "Consider the statements:\nI. Rutherford's model placed most positive charge in a small nucleus.\nII. Rutherford's scattering results suggested that most of the atom is empty space.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Both conclusions follow from the alpha-scattering experiment: rare large deflections reveal a compact positive nucleus, while most particles passing through reveal mostly empty space.", ["sci012-rutherford-two-conclusions"]],
  [9, "Hard", "Consider the statements:\nI. The K shell can hold a maximum of 2 electrons.\nII. The L shell can hold a maximum of 8 electrons.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Using the 2n² rule, K (n = 1) holds at most 2 electrons and L (n = 2) at most 8.", ["sci012-shell-capacities"]],
  [9, "Hard", "Consider the statements:\nI. Neutrons contribute to mass number.\nII. Neutrons determine the atomic number.\nWhich is correct?", "I only", ["II only", "Both I and II", "Neither I nor II"], "Neutrons are included in mass number, but atomic number is determined only by the number of protons.", ["sci012-neutrons-mass-not-z"]],

  [10, "Hard", "An ion has 11 protons and 10 electrons. What is its charge?", "+1", ["-1", "0", "+2"], "There is one more proton than electron, so the ion has one excess positive charge: +1.", ["sci012-ion-charge-11p10e"]],
  [10, "Hard", "An ion has 17 protons and 18 electrons. Which description is correct?", "It is a -1 ion", ["It is a +1 ion", "It is neutral", "It is a +2 ion"], "The ion has one more electron than proton, giving it one net negative charge.", ["sci012-ion-charge-17p18e"]],
  [10, "Hard", "An atom has atomic number 13 and mass number 27. Which set gives its proton, neutron and electron counts in the neutral atom?", "13 protons, 14 neutrons, 13 electrons", ["14 protons, 13 neutrons, 13 electrons", "13 protons, 27 neutrons, 14 electrons", "27 protons, 13 neutrons, 27 electrons"], "Protons = Z = 13. Neutrons = 27 − 13 = 14. A neutral atom therefore has 13 electrons.", ["sci012-al27-counts"]],
  [10, "Hard", "Two atoms have 6 protons each, but one has 6 neutrons and the other has 8 neutrons. They are:", "isotopes of the same element", ["isobars of different elements", "ions with different charges", "different elements with the same mass number"], "Both atoms have atomic number 6, so both are carbon. Their different neutron numbers give different mass numbers, making them isotopes.", ["sci012-carbon-isotopes-reason"]],
  [10, "Hard", "A neutral atom has electronic configuration 2, 8, 7. Which change would give it a stable outer shell most directly?", "gain one electron", ["lose seven protons", "gain seven neutrons", "lose all inner-shell electrons"], "The atom has seven valence electrons. Gaining one electron completes the outer shell with eight electrons.", ["sci012-config-287-gain"]],
  [10, "Hard", "A neutral atom has electronic configuration 2, 8, 2. If it forms its common ion by losing outer electrons, how many electrons will the ion have?", "10", ["12", "8", "14"], "The neutral atom has 12 electrons. Losing its two valence electrons gives a 2+ ion with 10 electrons.", ["sci012-config-282-ion"]],
]);

function pad3(value: number): string {
  return value.toString().padStart(3, "0");
}

function buildOptions(
  answer: string,
  distractors: readonly [string, string, string],
  correctIndex: number,
): string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return options;
}

export const SCI_CP012_REVIEW_V1: readonly SciCp012ReviewQuestion[] = Object.freeze(
  REVIEW_SPECS.map((spec, index) => {
    const [ql, difficulty, stem, answer, distractors, explanation, factIds] = spec;
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `SCI-CP-012-REV-${pad3(index + 1)}`,
      chapterId: "SCI-001" as const,
      cpId: "SCI-CP-012" as const,
      qlId: `SCI-012-QL-${pad3(ql)}`,
      qlName: SCI_CP012_QL_NAMES_V1[ql],
      difficulty,
      stem,
      options: buildOptions(answer, distractors, correctIndex),
      correctIndex,
      canonicalAnswer: answer,
      explanation,
      sourceIds: [...SOURCE_IDS],
      sourceFactIds: [...factIds],
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

export type SciCp012Validation = {
  valid: boolean;
  errors: string[];
  totalQuestions: number;
  qlCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  answerPositionCounts: Record<string, number>;
};

export function validateSciCp012ReviewV1(): SciCp012Validation {
  const errors: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};
  const answerPositionCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  const seenIds = new Set<string>();
  const seenStems = new Set<string>();

  for (const question of SCI_CP012_REVIEW_V1) {
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] = (difficultyCounts[question.difficulty] ?? 0) + 1;
    const position = ["A", "B", "C", "D"][question.correctIndex];
    answerPositionCounts[position] += 1;

    if (seenIds.has(question.questionId)) errors.push(`Duplicate questionId: ${question.questionId}`);
    seenIds.add(question.questionId);
    if (seenStems.has(question.stem)) errors.push(`Duplicate stem: ${question.stem}`);
    seenStems.add(question.stem);

    if (question.options.length !== 4) errors.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) errors.push(`${question.questionId}: options must be distinct`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) errors.push(`${question.questionId}: keyed answer mismatch`);
    if (!question.explanation.trim()) errors.push(`${question.questionId}: missing explanation`);
    if (question.sourceIds.length === 0 || question.sourceFactIds.length === 0) errors.push(`${question.questionId}: missing provenance`);
    if (!question.reviewOnly || question.runtimeRegistered) errors.push(`${question.questionId}: review lifecycle violation`);
  }

  if (SCI_CP012_REVIEW_V1.length !== 60) errors.push(`Expected 60 questions, found ${SCI_CP012_REVIEW_V1.length}`);

  for (let ql = 1; ql <= 10; ql += 1) {
    const qlId = `SCI-012-QL-${pad3(ql)}`;
    if (qlCounts[qlId] !== 6) errors.push(`${qlId}: expected 6 questions, found ${qlCounts[qlId] ?? 0}`);
  }

  const expectedDifficulty: Record<string, number> = { Easy: 18, Medium: 30, Hard: 12 };
  for (const [difficulty, expected] of Object.entries(expectedDifficulty)) {
    if (difficultyCounts[difficulty] !== expected) errors.push(`${difficulty}: expected ${expected}, found ${difficultyCounts[difficulty] ?? 0}`);
  }

  for (const position of ["A", "B", "C", "D"] as const) {
    if (answerPositionCounts[position] !== 15) errors.push(`${position}: expected 15 keyed answers, found ${answerPositionCounts[position]}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    totalQuestions: SCI_CP012_REVIEW_V1.length,
    qlCounts,
    difficultyCounts,
    answerPositionCounts,
  };
}
