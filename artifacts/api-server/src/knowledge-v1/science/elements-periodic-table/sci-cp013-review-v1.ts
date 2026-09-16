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

export type SciCp013ReviewQuestion = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-013";
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
  "NCERT-SCIENCE-IX-ATOMS-MOLECULES",
  "NCERT-SCIENCE-X-PERIODIC-CLASSIFICATION-ELEMENTS",
  "NIOS-SECONDARY-SCIENCE-PERIODIC-CLASSIFICATION",
]);

export const SCI_CP013_QL_NAMES_V1: Record<number, string> = {
  1: "Element, compound and mixture distinction",
  2: "Common element symbols and compound formulae",
  3: "Basic periodic-table classification",
  4: "Groups, periods and table structure",
  5: "Important periodic families",
  6: "Electronic configuration to group/period",
  7: "Basic periodic trends",
  8: "Development of periodic classification",
  9: "Statement I/II",
  10: "Mixed periodic-table application",
};

const REVIEW_SPECS: readonly ReviewSpec[] = Object.freeze([
  [1, "Easy", "Which of the following is an element?", "oxygen", ["water", "carbon dioxide", "sodium chloride"], "Oxygen is an element because it contains only one kind of atom. Water, carbon dioxide and sodium chloride are compounds.", ["sci013-element-oxygen"]],
  [1, "Easy", "Which of the following is a compound?", "water", ["iron", "oxygen", "copper"], "Water is a compound made of hydrogen and oxygen chemically combined in a fixed ratio.", ["sci013-compound-water"]],
  [1, "Easy", "A pure substance made of only one kind of atom is called an:", "element", ["compound", "mixture", "solution"], "An element contains only one kind of atom and cannot be broken into simpler substances by ordinary chemical methods.", ["sci013-element-definition"]],
  [1, "Easy", "A substance formed when two or more elements combine chemically in a fixed ratio is a:", "compound", ["mixture", "element", "alloy only"], "A compound contains elements chemically joined in a definite proportion.", ["sci013-compound-definition"]],
  [1, "Easy", "Which statement best distinguishes a compound from a mixture?", "A compound has its components chemically combined in a fixed ratio", ["A compound can always be separated by filtration", "A mixture always contains only one element", "A mixture has a fixed chemical formula"], "Compounds have definite composition and chemical bonding. Mixtures can have variable composition and their components retain more of their individual properties.", ["sci013-compound-mixture-fixed-ratio"]],
  [1, "Easy", "Which of the following is not an element?", "carbon dioxide", ["carbon", "sulfur", "nitrogen"], "Carbon dioxide contains carbon and oxygen chemically combined, so it is a compound rather than an element.", ["sci013-carbon-dioxide-compound"]],

  [2, "Easy", "What is the chemical symbol for sodium?", "Na", ["S", "So", "Sd"], "The chemical symbol for sodium is Na, derived from its Latin name natrium.", ["sci013-symbol-na"]],
  [2, "Easy", "What is the chemical symbol for iron?", "Fe", ["Ir", "In", "I"], "Iron is represented by Fe, from the Latin name ferrum.", ["sci013-symbol-fe"]],
  [2, "Easy", "Which symbol represents potassium?", "K", ["P", "Po", "Pt"], "Potassium is represented by K, from the Latin name kalium.", ["sci013-symbol-k"]],
  [2, "Easy", "Which chemical formula represents water?", "H₂O", ["CO₂", "O₂", "H₂"], "A water molecule contains two hydrogen atoms and one oxygen atom, so its formula is H₂O.", ["sci013-formula-water"]],
  [2, "Easy", "Which formula represents carbon dioxide?", "CO₂", ["CO", "CaO", "C₂O"], "Carbon dioxide contains one carbon atom and two oxygen atoms per molecule, so its formula is CO₂.", ["sci013-formula-co2"]],
  [2, "Easy", "Which formula represents common salt, sodium chloride?", "NaCl", ["KCl", "Na₂CO₃", "CaCl₂"], "Common salt is sodium chloride, whose chemical formula is NaCl.", ["sci013-formula-nacl"]],

  [3, "Easy", "Most elements on the left side of the periodic table are:", "metals", ["noble gases", "halogens", "non-metals only"], "The left and central parts of the periodic table are occupied mainly by metals.", ["sci013-left-metals"]],
  [3, "Easy", "The elements along the zig-zag boundary between metals and non-metals are commonly called:", "metalloids", ["noble gases", "alkali metals", "lanthanides only"], "Metalloids have properties intermediate between typical metals and non-metals and lie near the zig-zag boundary.", ["sci013-metalloid-boundary"]],
  [3, "Easy", "Which of the following is a non-metal?", "sulfur", ["sodium", "magnesium", "aluminium"], "Sulfur is a non-metal. Sodium, magnesium and aluminium are metals.", ["sci013-sulfur-nonmetal"]],
  [3, "Easy", "Which of the following is a metalloid?", "silicon", ["sodium", "chlorine", "argon"], "Silicon is commonly classified as a metalloid because it shows properties between metals and non-metals.", ["sci013-silicon-metalloid"]],
  [3, "Easy", "Which of the following is a metal?", "calcium", ["oxygen", "chlorine", "sulfur"], "Calcium is an alkaline-earth metal. Oxygen, chlorine and sulfur are non-metals.", ["sci013-calcium-metal"]],
  [3, "Easy", "Which element is a noble gas?", "argon", ["chlorine", "sodium", "magnesium"], "Argon belongs to the noble-gas family in Group 18.", ["sci013-argon-noble-gas"]],

  [4, "Medium", "How many periods are there in the modern periodic table?", "7", ["8", "18", "16"], "The modern periodic table has seven horizontal rows called periods.", ["sci013-seven-periods"]],
  [4, "Medium", "How many groups are there in the modern periodic table?", "18", ["7", "8", "16"], "The modern periodic table has 18 vertical columns called groups.", ["sci013-eighteen-groups"]],
  [4, "Medium", "Horizontal rows in the periodic table are called:", "periods", ["groups", "families only", "blocks only"], "The horizontal rows are periods; the vertical columns are groups.", ["sci013-period-row"]],
  [4, "Medium", "Vertical columns in the periodic table are called:", "groups", ["periods", "series", "shells"], "The vertical columns of the modern periodic table are called groups.", ["sci013-group-column"]],
  [4, "Medium", "Elements placed in the same group generally have similar chemical properties mainly because they have similar:", "outer-shell electron arrangements", ["mass numbers", "numbers of neutron shells", "nuclear masses"], "Elements in a group commonly have the same number of valence electrons or a closely related outer-shell arrangement, giving similar chemical behaviour.", ["sci013-group-similar-valence"]],
  [4, "Medium", "For the first 20 elements, the period number generally tells the number of:", "occupied electron shells", ["neutrons", "isotopes", "protons in the nucleus"], "For these elements, the number of occupied electron shells corresponds to the period number.", ["sci013-period-shells"]],

  [5, "Medium", "Group 1 elements are commonly known as:", "alkali metals", ["halogens", "noble gases", "alkaline earth metals"], "Group 1 contains the alkali metals, such as lithium, sodium and potassium.", ["sci013-group1-alkali"]],
  [5, "Medium", "Group 2 elements are commonly known as:", "alkaline earth metals", ["alkali metals", "halogens", "noble gases"], "Group 2 contains the alkaline earth metals, including magnesium and calcium.", ["sci013-group2-alkaline-earth"]],
  [5, "Medium", "Group 17 elements are known as:", "halogens", ["noble gases", "alkali metals", "transition metals"], "The elements in Group 17 are called halogens; chlorine is a familiar example.", ["sci013-group17-halogens"]],
  [5, "Medium", "Group 18 elements are known as:", "noble gases", ["halogens", "alkali metals", "metalloids"], "Group 18 contains the noble gases, which have stable outer-shell configurations.", ["sci013-group18-noble"]],
  [5, "Medium", "Sodium and potassium belong to the same family because both are in:", "Group 1", ["Group 2", "Group 17", "Group 18"], "Sodium and potassium are alkali metals in Group 1 and each has one valence electron.", ["sci013-na-k-group1"]],
  [5, "Medium", "Chlorine and fluorine are placed in the same group because both belong to the:", "halogens", ["noble gases", "alkaline earth metals", "alkali metals"], "Fluorine and chlorine are Group 17 elements called halogens.", ["sci013-f-cl-halogens"]],

  [6, "Medium", "An element has electronic configuration 2, 8, 1. In which group is it placed?", "Group 1", ["Group 2", "Group 17", "Group 18"], "The configuration 2, 8, 1 has one valence electron. For this main-group element, that places it in Group 1.", ["sci013-config-281-group1"]],
  [6, "Medium", "An element has electronic configuration 2, 8, 7. In which group is it placed?", "Group 17", ["Group 1", "Group 2", "Group 18"], "Seven valence electrons identify a halogen among the first 20 elements, so the element is in Group 17.", ["sci013-config-287-group17"]],
  [6, "Medium", "An element has electronic configuration 2, 8, 8. In which group is it placed?", "Group 18", ["Group 8", "Group 17", "Group 1"], "A complete outer shell gives the stable noble-gas configuration, placing argon in Group 18.", ["sci013-config-288-group18"]],
  [6, "Medium", "An element has electronic configuration 2, 8, 2. In which period is it placed?", "Period 3", ["Period 2", "Period 4", "Period 1"], "The configuration uses three occupied shells, so the element lies in Period 3.", ["sci013-config-282-period3"]],
  [6, "Medium", "An element has electronic configuration 2, 8, 8, 1. In which period is it placed?", "Period 4", ["Period 1", "Period 2", "Period 3"], "There are four occupied shells in 2, 8, 8, 1, so the element is in Period 4.", ["sci013-config-2881-period4"]],
  [6, "Medium", "Which position matches an element with electronic configuration 2, 7?", "Period 2, Group 17", ["Period 2, Group 1", "Period 3, Group 17", "Period 1, Group 18"], "The element has two occupied shells, so it is in Period 2, and seven valence electrons, so it is in Group 17.", ["sci013-config-27-position"]],

  [7, "Medium", "Across a period from left to right, atomic size generally:", "decreases", ["increases", "remains exactly constant", "first becomes infinite"], "Across a period, nuclear charge increases while electrons are added to the same main shell, so atomic size generally decreases.", ["sci013-trend-size-across"]],
  [7, "Medium", "Down a group in the periodic table, atomic size generally:", "increases", ["decreases", "remains exactly constant", "becomes zero"], "A new electron shell is added on moving down a group, so atomic size generally increases.", ["sci013-trend-size-down"]],
  [7, "Medium", "Across a period from left to right, metallic character generally:", "decreases", ["increases", "remains unchanged for all elements", "has no relation to position"], "Across a period, the tendency to lose electrons generally decreases, so metallic character decreases.", ["sci013-trend-metallic-across"]],
  [7, "Medium", "Down a group, metallic character generally:", "increases", ["decreases", "remains exactly constant", "changes only in noble gases"], "Down a group, outer electrons are farther from the nucleus and are generally lost more easily, so metallic character tends to increase.", ["sci013-trend-metallic-down"]],
  [7, "Medium", "Among elements of the same period, non-metallic character generally becomes stronger toward the:", "right side", ["left side", "middle only", "bottom of the same column"], "Across a period, metallic character decreases and non-metallic character generally increases toward the right.", ["sci013-trend-nonmetal-right"]],
  [7, "Medium", "For main-group elements across a short period, valency typically changes from 1 to 4 and then:", "decreases toward 0", ["continues increasing without limit", "stays fixed at 4", "becomes equal to mass number"], "Across a short period, valency commonly rises from 1 to 4, then falls from 4 to 0 as the outer shell approaches completion.", ["sci013-trend-valency-period"]],

  [8, "Medium", "The modern periodic law is based on the periodic variation of properties with:", "atomic number", ["atomic mass only", "number of neutrons only", "mass number"], "The modern periodic law states that properties of elements are periodic functions of their atomic numbers.", ["sci013-modern-law-z"]],
  [8, "Medium", "Mendeleev arranged elements mainly in increasing order of:", "atomic mass", ["atomic number", "neutron number", "electron charge"], "Mendeleev's periodic table was based mainly on increasing atomic masses while grouping elements with similar properties.", ["sci013-mendeleev-mass"]],
  [8, "Medium", "A major strength of Mendeleev's periodic table was that he:", "left gaps for undiscovered elements", ["placed all noble gases before they were discovered", "used atomic number as the basis", "removed all elements with similar properties"], "Mendeleev left gaps and predicted properties of elements that had not yet been discovered.", ["sci013-mendeleev-gaps"]],
  [8, "Medium", "Newlands is associated with the classification called the Law of:", "Octaves", ["Triads", "Periods", "Conservation of mass"], "Newlands proposed the Law of Octaves, observing a repetition of properties at regular intervals in his arrangement.", ["sci013-newlands-octaves"]],
  [8, "Medium", "Döbereiner grouped certain elements into sets of three known as:", "triads", ["octaves", "periods", "isobars"], "Döbereiner identified groups of three chemically similar elements called triads.", ["sci013-dobereiner-triads"]],
  [8, "Medium", "Which change resolved important anomalies of arranging elements only by atomic mass?", "Using atomic number as the basis of the modern periodic table", ["Using only neutron number", "Removing groups from the table", "Arranging elements alphabetically"], "Ordering elements by atomic number gives the modern periodic arrangement and resolves mass-order anomalies seen in older tables.", ["sci013-modern-z-resolves"]],

  [9, "Hard", "Consider the statements:\nI. The modern periodic table has 18 groups.\nII. The modern periodic table has 7 periods.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "The modern periodic table contains 18 vertical groups and 7 horizontal periods.", ["sci013-groups-periods"]],
  [9, "Hard", "Consider the statements:\nI. Elements in the same group often have similar chemical properties.\nII. For main-group elements, this is related to their outer-shell electron arrangements.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Both statements are correct. Similar valence-shell arrangements lead to similar bonding behaviour and therefore related chemical properties.", ["sci013-group-properties-valence"]],
  [9, "Hard", "Consider the statements:\nI. Atomic size generally decreases across a period.\nII. Atomic size generally increases down a group.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Across a period, increasing nuclear charge pulls electrons closer; down a group, additional shells increase atomic size.", ["sci013-size-two-trends"]],
  [9, "Hard", "Consider the statements:\nI. Mendeleev's table was based mainly on atomic mass.\nII. The modern periodic table is based on atomic number.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Mendeleev used atomic mass as the main ordering basis, whereas the modern periodic law uses atomic number.", ["sci013-mendeleev-modern-basis"]],
  [9, "Hard", "Consider the statements:\nI. Group 17 contains the halogens.\nII. Group 18 contains the noble gases.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Group 17 is the halogen family and Group 18 is the noble-gas family.", ["sci013-group17-18"]],
  [9, "Hard", "Consider the statements:\nI. A compound has a fixed composition.\nII. The components of a mixture must always be chemically bonded.\nWhich is correct?", "I only", ["II only", "Both I and II", "Neither I nor II"], "Compounds have fixed composition. In a mixture, substances are physically combined and need not be chemically bonded.", ["sci013-compound-mixture-statements"]],

  [10, "Hard", "An element has electronic configuration 2, 8, 1. Which description is most appropriate?", "It is a Period 3, Group 1 element", ["It is a Period 1, Group 3 element", "It is a Period 3, Group 17 element", "It is a Period 2, Group 18 element"], "Three occupied shells place it in Period 3, and one valence electron places it in Group 1.", ["sci013-281-position"]],
  [10, "Hard", "An element lies in Period 3 and Group 17. Which electronic configuration matches it?", "2, 8, 7", ["2, 8, 1", "2, 8, 8", "2, 7"], "Period 3 means three occupied shells, while Group 17 corresponds to seven valence electrons for this main-group element: 2, 8, 7.", ["sci013-p3g17-config"]],
  [10, "Hard", "Two elements are in the same group, one below the other. Which change is generally expected in the lower element?", "larger atomic size", ["smaller atomic size", "fewer occupied shells", "exactly the same atomic radius"], "Moving down a group adds an occupied electron shell, so atomic size generally increases.", ["sci013-down-group-size"]],
  [10, "Hard", "An unknown element has three occupied shells and a complete outer shell. Which position best fits it?", "Period 3, Group 18", ["Period 3, Group 1", "Period 2, Group 18", "Period 4, Group 17"], "Three occupied shells indicate Period 3. A complete outer shell identifies a noble gas, so it belongs to Group 18.", ["sci013-three-shell-full-position"]],
  [10, "Hard", "Element X is in Group 1 and element Y is in Group 17 of the same period. Which statement is generally correct?", "X is more metallic than Y", ["Y is more metallic than X", "Both must be noble gases", "Both have the same number of valence electrons"], "Metallic character generally decreases from left to right across a period. Group 1 lies far to the left of Group 17.", ["sci013-g1-g17-metallic"]],
  [10, "Hard", "A sample has a fixed chemical formula and can be chemically broken into simpler substances. It is best classified as a:", "compound", ["element", "mixture", "noble gas"], "A compound has a fixed composition and can be decomposed chemically into its constituent elements or simpler substances.", ["sci013-compound-fixed-decompose"]],
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

export const SCI_CP013_REVIEW_V1: readonly SciCp013ReviewQuestion[] = Object.freeze(
  REVIEW_SPECS.map((spec, index) => {
    const [ql, difficulty, stem, answer, distractors, explanation, factIds] = spec;
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `SCI-CP-013-REV-${pad3(index + 1)}`,
      chapterId: "SCI-001" as const,
      cpId: "SCI-CP-013" as const,
      qlId: `SCI-013-QL-${pad3(ql)}`,
      qlName: SCI_CP013_QL_NAMES_V1[ql],
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

export type SciCp013Validation = {
  valid: boolean;
  errors: string[];
  totalQuestions: number;
  qlCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  answerPositionCounts: Record<string, number>;
};

export function validateSciCp013ReviewV1(): SciCp013Validation {
  const errors: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};
  const answerPositionCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  const seenIds = new Set<string>();
  const seenStems = new Set<string>();

  for (const question of SCI_CP013_REVIEW_V1) {
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

  if (SCI_CP013_REVIEW_V1.length !== 60) errors.push(`Expected 60 questions, found ${SCI_CP013_REVIEW_V1.length}`);

  for (let ql = 1; ql <= 10; ql += 1) {
    const qlId = `SCI-013-QL-${pad3(ql)}`;
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
    totalQuestions: SCI_CP013_REVIEW_V1.length,
    qlCounts,
    difficultyCounts,
    answerPositionCounts,
  };
}
