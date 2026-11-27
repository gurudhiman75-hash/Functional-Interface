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

import { languageNeutralId } from "./persisted-native-review";
test("language tags inside question-language IDs are ignored", () => {
  assert.equal(languageNeutralId("MEN-CP-009:MEN-002-QL-120:en-IN:qs:0"), languageNeutralId("MEN-CP-009:MEN-002-QL-120:hi-IN:qs:0"));
  assert.equal(languageNeutralId("IOP-001-EN-IOP-QL-004-07b:Q1:en"), languageNeutralId("IOP-001-EN-IOP-QL-004-07b:Q1:hi"));
  assert.notEqual(languageNeutralId("MEN-QL-120:en-IN"), languageNeutralId("MEN-QL-121:hi-IN"));
});

import { alignLocalizedOptions } from "./persisted-native-review";
test("identical options in another order are put in English order; text options are never reordered", () => {
  const src = { options: ["1/3", "2/5", "3/5", "1/2"], correctIndex: 1 };
  const loc = { stem: "x", explanation: "y", options: ["3/5", "1/2", "2/5", "1/3"], correctIndex: 2 };
  const out = alignLocalizedOptions(src, loc);
  assert.deepEqual(out.options, src.options);
  assert.equal(out.correctIndex, 1);
  const words = { stem: "x", explanation: "y", options: ["क", "ख", "ग", "घ"], correctIndex: 3 };
  assert.equal(alignLocalizedOptions(src, words), words);
  const wrong = { ...loc, correctIndex: 0 };
  assert.equal(alignLocalizedOptions(src, wrong), wrong);
});

import { numbersCompatible } from "./persisted-native-review";
test("numbers: English numbers must all be present, extra translated labels are fine", () => {
  assert.equal(numbersCompatible("Match List I with List II. 75.84%, 846", "सूची-1 को सूची-2 से मिलाइए। 75.84%, 846"), true);
  assert.equal(numbersCompatible("120 metres, 3/4", "140 मीटर, 3/4"), false);
  assert.equal(numbersCompatible("120 and 3", "੧੨੦ ਅਤੇ ੩"), true);
});

test("options with translated units are matched by their unique numbers", () => {
  const src = { options: ["35 km", "36 km", "37 km", "38 km"], correctIndex: 1 };
  const loc = { stem: "x", explanation: "y", options: ["36 किमी", "38 किमी", "37 किमी", "35 किमी"], correctIndex: 0 };
  const out = alignLocalizedOptions(src, loc);
  assert.deepEqual(out.options, ["35 किमी", "36 किमी", "37 किमी", "38 किमी"]);
  assert.equal(out.correctIndex, 1);
  const dup = { options: ["5 km", "5 m", "6 km", "7 km"], correctIndex: 0 };
  const same = { stem: "x", explanation: "y", options: ["6 किमी", "5 मी", "5 किमी", "7 किमी"], correctIndex: 2 };
  assert.equal(alignLocalizedOptions(dup, same), same);
});
