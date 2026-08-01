import assert from "node:assert/strict";

import { buildAllNormalizedMultilingualEditorialLibraries } from "./foundation";

const libraries = buildAllNormalizedMultilingualEditorialLibraries();
const entryCount = libraries.reduce(
  (sum, library) => sum + library.entryCount,
  0,
);

assert.equal(
  libraries.length,
  12,
  "Expected six CP libraries in each language.",
);
assert.equal(entryCount, 372, "Expected all Hindi and Punjabi entries.");

const visible = JSON.stringify(libraries);
assert.doesNotMatch(visible, /व्यावसायिक क्रम/u);
assert.doesNotMatch(visible, /ਵਪਾਰਕ ਕ੍ਰਮ/u);
assert.doesNotMatch(visible, /अज्ञात समूह/u);

function nativeEntry(language: "hi" | "pa", qlId: string): string {
  const library = libraries.find(
    (item) => item.language === language && item.entries[qlId],
  );
  assert.ok(library, `${qlId}/${language}: missing native entry.`);
  return JSON.stringify(library.entries[qlId]);
}

assert.match(
  nativeEntry("hi", "PNL-QL-078"),
  /जिस समूह का प्रतिशत ज्ञात करना है/u,
);
assert.match(
  nativeEntry("pa", "PNL-QL-078"),
  /ਜਿਸ ਸਮੂਹ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰਨਾ ਹੈ/u,
);
assert.match(nativeEntry("hi", "PNL-QL-091"), /जिस समूह की दर नहीं दी गई है/u);
assert.match(nativeEntry("pa", "PNL-QL-091"), /ਜਿਸ ਸਮੂਹ ਦੀ ਦਰ ਨਹੀਂ ਦਿੱਤੀ ਗਈ/u);

console.log(
  JSON.stringify(
    {
      status: "PASS",
      libraries: libraries.length,
      entries: entryCount,
      removedHindiCommercialSequence: true,
      removedPunjabiCommercialSequence: true,
      removedHindiUnknownGroup: true,
    },
    null,
    2,
  ),
);
