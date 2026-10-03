import { strict as assert } from "node:assert";
import { assertSriReleaseLocks, SRI_CHAPTER_MANIFEST } from "../chapter-manifest";

assert.doesNotThrow(() => assertSriReleaseLocks());
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.discoveryOpen, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.multilingualFrozen, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionStudioDiscoverable, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionStudioGenerationEnabled, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionBankWritesEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.testEligibilityEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.publicPublicationEnabled, false);
