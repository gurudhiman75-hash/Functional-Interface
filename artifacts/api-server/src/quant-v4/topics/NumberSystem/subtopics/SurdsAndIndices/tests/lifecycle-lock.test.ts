import { strict as assert } from "node:assert";
import { assertSriReleaseLocks, SRI_CHAPTER_MANIFEST } from "../chapter-manifest";

assert.doesNotThrow(() => assertSriReleaseLocks());
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 0);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.discoveryOpen, true);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionStudioDiscoverable, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.questionBankWritesEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.testEligibilityEnabled, false);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.publicPublicationEnabled, false);
