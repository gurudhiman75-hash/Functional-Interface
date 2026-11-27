import test from "node:test";
import assert from "node:assert/strict";
import { prepareNativeSnapshotFromCompanions } from "./persisted-native-review";

const en = {
  packageId: "TMW-001", language: "en", canonicalProblemId: "TMW-CP-001", questionLanguageId: "TMW-QL-013",
  stem: "A team finished 120 metres, 3/4 of the work. Find the total.",
  options: ["120", "160", "90", "480"], correctIndex: 1,
  explanation: "Divide 120 by 3/4.\nTotal is 160.",
};
const hi = {
  language: "hi", canonicalProblemId: "TMW-CP-001", questionLanguageId: "TMW-QL-013",
  stem: "एक टीम ने 120 मीटर काम किया, जो कुल का 3/4 है। कुल ज्ञात कीजिए।",
  options: ["120", "160", "90", "480"], correctIndex: 1, explanation: "120 को 3/4 से भाग दें।\nकुल 160 है।",
};
const pa = { ...hi, language: "pa", stem: "ਇੱਕ ਟੀਮ ਨੇ ੧੨੦ ਮੀਟਰ ਕੰਮ ਕੀਤਾ, ਜੋ ਕੁੱਲ ਦਾ 3/4 ਹੈ। ਕੁੱਲ ਲੱਭੋ।", explanation: "੧੨੦ ਨੂੰ 3/4 ਨਾਲ ਭਾਗ ਕਰੋ।\nਕੁੱਲ 160 ਹੈ।" };

test("aligned Hindi and Punjabi companions are verified (native digits accepted)", () => {
  const snap = prepareNativeSnapshotFromCompanions(en, ["hi", "pa"], { hi, pa });
  assert.deepEqual(snap?.variants.map((v) => `${v.language}:${v.status}`), ["hi:verified", "pa:verified"]);
});

test("companion with another answer position, checkpoint or numbers is blocked", () => {
  const snap = prepareNativeSnapshotFromCompanions(en, ["hi", "pa"], {
    hi: { ...hi, correctIndex: 2 },
    pa: { ...pa, stem: "ਇੱਕ ਟੀਮ ਨੇ 140 ਮੀਟਰ ਕੰਮ ਕੀਤਾ, ਜੋ ਕੁੱਲ ਦਾ 3/4 ਹੈ।" },
  });
  assert.deepEqual(snap?.variants.map((v) => `${v.language}:${v.status}`), ["hi:blocked", "pa:blocked"]);
  const other = prepareNativeSnapshotFromCompanions(en, ["hi"], { hi: { ...hi, canonicalProblemId: "TMW-CP-002" } });
  assert.equal(other?.variants[0]?.status, "blocked");
});

test("no companions means no snapshot", () => {
  assert.equal(prepareNativeSnapshotFromCompanions(en, ["hi", "pa"], {}), null);
});
