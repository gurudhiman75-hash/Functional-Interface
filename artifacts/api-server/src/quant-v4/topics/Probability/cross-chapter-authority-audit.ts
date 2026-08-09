import { listPrb001QuestionEntries } from "./PRB-001";
import { listPrb002QuestionEntries } from "./PRB-002";
const entries=[...listPrb001QuestionEntries(),...listPrb002QuestionEntries()];
const countingModes=new Set(["findSelectionProbabilityUsingCombination","findCommitteeCompositionProbability","findRestrictedSelectionProbability","findReverseCountFromProbability","findRandomArrangementPropertyProbability","findTogetherOrApartProbability","findPositionRestrictionProbability","findNumberFormationProbability"]);
const misplacedCountingAuthority=entries.filter((entry)=>countingModes.has(entry.solveMode)&&entry.cpId!=="PRB-CP-005"&&entry.cpId!=="PRB-CP-008");
const rawCountingOnlyTasks=entries.filter((entry)=>entry.taskKind==="RAW_PERMUTATION"||entry.taskKind==="RAW_COMBINATION");
if(misplacedCountingAuthority.length||rawCountingOnlyTasks.length)throw new Error(`Authority boundary failed: misplaced=${misplacedCountingAuthority.length}, rawCounting=${rawCountingOnlyTasks.length}`);
console.log(JSON.stringify({entries:entries.length,countingAuthority:"PNC-001 via quant-v4/shared/counting",probabilityOwnership:"event ratio, conditional universe and probability interpretation",misplacedCountingAuthority:0,rawCountingOnlyTasks:0}));
