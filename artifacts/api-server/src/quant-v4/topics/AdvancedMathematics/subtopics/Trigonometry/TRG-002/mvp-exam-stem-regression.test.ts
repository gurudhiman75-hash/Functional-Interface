import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const generated = TRG_002_MVP_48_IDS.map((qlId, index) =>
  generateFinalEditorialTrg002Mvp48Question(qlId, `trg002-exam-stem-${String(index + 1).padStart(2, "0")}`),
);

for (const question of generated) {
  const stem = question.stem;
  assert(stem.endsWith("?"), `${question.qlId}: exam-style stem must end as a direct question.`);
  assert(!/\bFind\b/.test(stem), `${question.qlId}: generator-like imperative 'Find' must be removed from the final stem.`);
  assert(!/\bfind\b/.test(stem), `${question.qlId}: generator-like imperative 'find' must be removed from the final stem.`);
  assert(!/seen at \d+° depression/.test(stem), `${question.qlId}: compressed 'seen at ... depression' phrasing is not acceptable.`);
  assert(!/seen at an elevation of/.test(stem), `${question.qlId}: avoid mechanical 'seen at an elevation of' wording in final exam stems.`);
  assert(stem.length >= 55, `${question.qlId}: remodeled stem is unexpectedly terse.`);
}

const q15 = generated.find((question) => question.qlId === "TRG-002-QL-015");
assert(q15, "QL-015 must be present in the 48-QL stem regression set.");
assert(
  /^From the top of a .+? m high building, the angle of depression of the top of a vertical pole is .+?°\. If the horizontal distance between the building and the pole is .+? m, what is the height of the pole\?$/.test(q15.stem),
  "QL-015 must use conventional exam wording with height, depression angle, horizontal distance and a direct ask.",
);

const q49 = generated.find((question) => question.qlId === "TRG-002-QL-049");
assert(q49, "QL-049 must be present in the 48-QL stem regression set.");
assert(q49.stem.includes("same straight line with the foot of a tower"), "QL-049 must explicitly preserve the collinear same-side geometry in exam-style wording.");
assert(q49.stem.includes("B is nearer the tower"), "QL-049 must retain nearer/farther assignment without ambiguity.");

const q88 = generated.find((question) => question.qlId === "TRG-002-QL-088");
assert(q88, "QL-088 must be present in the 48-QL stem regression set.");
assert(q88.stem.includes("same level ground"), "QL-088 must state the level-ground relationship explicitly.");
assert(q88.stem.includes("angle of depression of the foot") && q88.stem.includes("angle of elevation of its top"), "QL-088 must use standard elevation/depression terminology.");

console.log(`TRG-002 exam-style stem regression locked for ${generated.length} QLs.`);
