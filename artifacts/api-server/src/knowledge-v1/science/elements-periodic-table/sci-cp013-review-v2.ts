import { SCI_CP013_REVIEW_V1, type SciCp013ReviewQuestion } from "./sci-cp013-review-v1";

// Editorial V2: preserves every question semantic, answer and option.
// Only the explanation is extended with one short learner-facing sentence.
const EXPLANATION_ADDITIONS: readonly string[] = Object.freeze([
  " An element cannot be separated into simpler substances by ordinary chemical methods.",
  " Its hydrogen and oxygen are not just mixed; they are chemically bonded in a fixed proportion.",
  " Examples include oxygen, iron and carbon, each defined by one type of atom.",
  " Because the ratio is fixed, a pure compound has the same composition throughout.",
  " This fixed chemical composition is why a compound has its own properties, different from the separate elements.",
  " Carbon dioxide contains two different kinds of atoms, so it cannot be an element.",
  " Chemical symbols are short standard forms used everywhere, so sodium is written Na rather than S.",
  " The symbol comes from ferrum, which is why it does not begin with the English letter I.",
  " The symbol K comes from kalium, so the English name potassium does not determine its symbol.",
  " The subscript 2 tells us that each water molecule contains two hydrogen atoms for every one oxygen atom.",
  " The subscript 2 after O shows that each molecule contains two oxygen atoms for every carbon atom.",
  " Na represents sodium and Cl represents chlorine; together they form the formula NaCl.",
  " Typical metals such as sodium, magnesium and iron occupy the left and much of the centre of the table.",
  " Their intermediate position reflects their mixed properties, such as showing some metallic and some non-metallic behaviour.",
  " Sulfur lacks the typical metallic properties shown by the other listed elements.",
  " Silicon is a common example because it behaves neither like a typical metal nor like a typical non-metal in every respect.",
  " Calcium lies in Group 2 and shows the usual properties of a metal.",
  " Noble gases occupy Group 18 and have very stable outer-electron arrangements.",
  " Periods run from left to right. Each new period begins a new horizontal row.",
  " Groups run from top to bottom. Elements in the same group often show related chemical behaviour.",
  " Reading across a row means moving through a period.",
  " Reading downward in a column means moving through a group.",
  " Chemical reactions mainly involve valence electrons, so similar outer-shell arrangements produce similar reactions.",
  " For example, three occupied shells place an element in Period 3.",
  " These metals have one valence electron and commonly form +1 ions.",
  " These elements have two valence electrons and commonly form +2 ions.",
  " Halogens usually have seven valence electrons and tend to gain one electron in simple reactions.",
  " Their outer shells are complete, which is why they are generally very unreactive.",
  " Their similar one-electron outer arrangement explains their similar chemical properties.",
  " Both have seven valence electrons, which is characteristic of the halogen family.",
  " One outer electron is the key clue for Group 1 in these main-group elements.",
  " Seven outer electrons are the key clue for Group 17.",
  " A complete outer shell is the main clue for the noble gases in Group 18.",
  " Period number comes from the number of occupied shells, not from the number of valence electrons.",
  " Counting the entries gives four occupied shells, so the period is 4.",
  " Count shells for the period and outer electrons for the group: two shells and seven valence electrons.",
  " The stronger attraction from the increasingly positive nucleus pulls the electrons in the same shell closer.",
  " Each step down adds another electron shell, placing the outer electrons farther from the nucleus.",
  " Elements toward the right hold their electrons more strongly, so they are less likely to show metallic behaviour.",
  " The outer electrons become farther from the nucleus and more shielded, so they are lost more easily.",
  " This is why the right side of a period contains more non-metals, while the left side contains more metals.",
  " After four valence electrons, fewer electrons need to be gained to complete the shell, so the usual valency falls toward zero.",
  " Atomic number means proton number, and arranging elements by this value produces the repeating pattern used in the modern table.",
  " This older mass-based arrangement was highly successful but produced a few ordering difficulties.",
  " When those elements were later discovered, many of their properties were close to his predictions.",
  " He noticed that, in his sequence, every eighth element often showed properties similar to the first.",
  " In a triad, the three elements showed related properties, and the middle atomic mass was often close to the average of the other two.",
  " Atomic number gives the correct fundamental order of elements and removes several exceptions found in a purely mass-based arrangement.",
  " Groups are columns and periods are rows, so both numbers are basic structural facts of the modern table.",
  " The similar outer electrons are the practical reason elements of a group often react in similar ways.",
  " Across a period electrons enter the same main shell, while down a group a new shell is added; this produces the opposite size trends.",
  " This is the major difference between the older Mendeleev arrangement and the modern periodic law.",
  " Remember the neighbouring families: Group 17 = halogens and Group 18 = noble gases.",
  " Mixture components can often be separated by physical methods because no new fixed chemical substance is necessarily formed.",
  " The three occupied shells give Period 3, while the single valence electron gives Group 1.",
  " A Period 3 atom needs three occupied shells, and Group 17 requires seven electrons in the outer shell.",
  " The added shell is the main reason the lower atom is generally larger even though nuclear charge also increases.",
  " Three shells set the period; the full outer shell sets the noble-gas group.",
  " Group 1 elements readily lose an outer electron and show strong metallic character, whereas Group 17 elements are strongly non-metallic.",
  " That combination of fixed formula and chemical decomposition is characteristic of a compound, not an element or ordinary mixture."
]);

export const SCI_CP013_REVIEW_V2: readonly SciCp013ReviewQuestion[] = Object.freeze(
  SCI_CP013_REVIEW_V1.map((question, index) => Object.freeze({
    ...question,
    explanation: `${question.explanation}${EXPLANATION_ADDITIONS[index]}`,
  })),
);

export function validateSciCp013ExplanationV2(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (SCI_CP013_REVIEW_V2.length !== SCI_CP013_REVIEW_V1.length) errors.push("Question count changed");
  for (let i = 0; i < SCI_CP013_REVIEW_V1.length; i += 1) {
    const before = SCI_CP013_REVIEW_V1[i];
    const after = SCI_CP013_REVIEW_V2[i];
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
