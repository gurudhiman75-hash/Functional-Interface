import { generateTrg002Mvp48Question } from "./mvp-runtime-48";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const seed = "trg002-mvp-difficulty-regression";
assert(generateTrg002Mvp48Question("TRG-002-QL-064", seed).difficulty === "Medium", "QL-064 must be Medium: known height gives two direct distances followed by subtraction.");
assert(generateTrg002Mvp48Question("TRG-002-QL-095", seed).difficulty === "Medium", "QL-095 must be Medium: two direct standard-angle heights followed by subtraction.");
assert(generateTrg002Mvp48Question("TRG-002-QL-096", seed).difficulty === "Hard", "QL-096 must remain Hard: inverse composite relation requires solving x(sqrt3-1)=given upper height.");

console.log("TRG-002 MVP difficulty regression locks QL-064/095 Medium and QL-096 Hard.");
