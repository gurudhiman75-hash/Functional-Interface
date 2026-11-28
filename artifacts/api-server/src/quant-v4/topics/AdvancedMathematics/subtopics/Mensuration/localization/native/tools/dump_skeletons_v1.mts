// Lists every distinct English stem wording (with numbers replaced by {1}, {2}, ...) that the generator
// can produce, so a native Hindi/Punjabi template can be written for each one.
//
//   cd artifacts/api-server
//   NODE_OPTIONS=--max-old-space-size=3500 npx tsx <this file> [--seeds 60] [--prefix MEN-002,MEN-CP011] > todo.tsv
//
// Output (tab separated): key <TAB> slotCount <TAB> times seen <TAB> English skeleton
import { MENSURATION_QUESTION_STUDIO_PATTERNS } from "../../../mensuration-question-studio-selection-v2";
import { generateMensurationLocalizedQuestionV1 } from "../../mensuration-localization-runtime-v1";
import { extractMensurationStemSlotsV1, mensurationStemSkeletonV1 } from "../mensuration-native-stem-v1";

const args = process.argv.slice(2);
const flag = (name: string, fallback: string) => {
  const at = args.indexOf(name);
  return at >= 0 && args[at + 1] ? args[at + 1]! : fallback;
};
const seedCount = Number(flag("--seeds", "60"));
const prefixes = flag("--prefix", "MEN-").split(",");

const seen = new Map<string, { slots: number; count: number; skeleton: string }>();
for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS as Array<{ patternId: string }>) {
  if (!prefixes.some((prefix) => pattern.patternId.startsWith(prefix))) continue;
  const seeds = [...Array.from({ length: seedCount }, (_, i) => `s${i}`), ...["a", "b", "c", "d", "e", "f", "g", "h"]];
  for (const seed of seeds) {
    const q = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language: "en" });
    const skeleton = mensurationStemSkeletonV1(q.stem);
    const key = `${pattern.patternId}|${skeleton}`;
    const row = seen.get(key);
    if (row) row.count += 1;
    else seen.set(key, { slots: extractMensurationStemSlotsV1(q.stem).length, count: 1, skeleton });
  }
}
for (const [key, row] of [...seen].sort(([a], [b]) => a.localeCompare(b))) {
  console.log([key, row.slots, row.count, row.skeleton].join("\t"));
}
console.error(`${seen.size} distinct wordings from ${new Set([...seen.keys()].map((k) => k.split("|")[0])).size} patterns`);
