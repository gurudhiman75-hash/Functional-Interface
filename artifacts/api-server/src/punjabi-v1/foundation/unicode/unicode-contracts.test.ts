import { strict as assert } from "node:assert";
import {
  classifyGurmukhiChar,
  GURMUKHI_DUTT_LETTERS,
  GURMUKHI_LAGAN,
  GURMUKHI_LAGAKHARS,
  GURMUKHI_NASAL_CONSONANTS,
  GURMUKHI_VOWEL_CARRIERS,
  hasGurmukhiScript,
  normalizeGurmukhi,
} from "./gurmukhi-normalizer";
import {
  CARRIER_LAGAN_MAP,
  tokenizeGurmukhiWord,
  validateGurmukhiWord,
} from "./grapheme-tokenizer";

console.log("Starting Gurmukhi Unicode & Grapheme contract tests...");

// 1. Script detection
assert.equal(hasGurmukhiScript("ਪੰਜਾਬੀ"), true);
assert.equal(hasGurmukhiScript("Hello 123"), false);

// 2. Nukta unification (decomposed nukta -> precomposed atomic NFC)
const decomposedSha = "\u0A38\u0A3C"; // ਸ + nukta
assert.equal(normalizeGurmukhi(decomposedSha), "ਸ਼");

const decomposedZha = "\u0A1C\u0A3C"; // ਜ + nukta
assert.equal(normalizeGurmukhi(decomposedZha), "ਜ਼");

const decomposedKha = "\u0A16\u0A3C"; // ਖ + nukta
assert.equal(normalizeGurmukhi(decomposedKha), "ਖ਼");

// 3. Lagan preceding Lagakhar swap invariant
// If someone writes Lagakhar before Matra: ਮ + ਂ (bindi) + ਾ (kanna) -> should normalize to ਮ + ਾ + ਂ
const reversedBindi = "\u0A2E\u0A02\u0A3E";
const normalizedBindi = normalizeGurmukhi(reversedBindi);
assert.equal(normalizedBindi, "ਮਾਂ");

// 4. Zero-width character stripping
const textWithZwsp = "ਪੰ\u200Bਜਾ\uFEFFਬੀ";
assert.equal(normalizeGurmukhi(textWithZwsp), "ਪੰਜਾਬੀ");

// 5. Vowel Carrier & Lagan Pairing Rules
// ੳ binds only with ਔਂਕੜ, ਦੁਲੈਂਕੜ, ਹੋੜਾ (3 ਲਗਾਂ)
assert.deepEqual(CARRIER_LAGAN_MAP["ੳ"], ["\u0A41", "\u0A42", "\u0A4B"]);

// ਅ binds with ਮੁਕਤਾ, ਕੰਨਾ, ਦੁਲਾਵਾਂ, ਕਨੌੜਾ (4 ਲਗਾਂ)
assert.deepEqual(CARRIER_LAGAN_MAP["ਅ"], ["", "\u0A3E", "\u0A48", "\u0A4C"]);

// ੲ binds with ਸਿਹਾਰੀ, ਬਿਹਾਰੀ, ਲਾਂ (3 ਲਗਾਂ)
assert.deepEqual(CARRIER_LAGAN_MAP["ੲ"], ["\u0A3F", "\u0A40", "\u0A47"]);

// 6. Carrier validation tests
// Valid: ਉਸਤਾਦ (ੳ + ੁ), ਆਵਾਜ਼ (ਅ + ਾ), ਇਕਬਾਲ (ੲ + ਿ), ਊਠ (ੳ + ੂ)
assert.equal(validateGurmukhiWord("ਉਸਤਾਦ").isValid, true);
assert.equal(validateGurmukhiWord("ਆਵਾਜ਼").isValid, true);
assert.equal(validateGurmukhiWord("ਇਕਬਾਲ").isValid, true);
assert.equal(validateGurmukhiWord("ਊਠ").isValid, true);

// Invalid: ੳ + ਾ (attaching kanna to oora is illegal)
const invalidOoraKanna = "\u0A73\u0A3E";
const validationRes1 = validateGurmukhiWord(invalidOoraKanna);
assert.equal(validationRes1.isValid, false);
assert.equal(validationRes1.errors.length, 1);

// Invalid: ੲ + ੁ (attaching aunkar to eeri is illegal)
const invalidEeriAunkar = "\u0A72\u0A41";
const validationRes2 = validateGurmukhiWord(invalidEeriAunkar);
assert.equal(validationRes2.isValid, false);

// 7. Tokenization of Dutt (pairin) letters
// e.g. ਪੜ੍ਹਨਾ: ਪ / ੜ੍ਹ / ਨਾ
const clusters = tokenizeGurmukhiWord("ਪੜ੍ਹਨਾ");
assert.equal(clusters.length, 3);
assert.equal(clusters[0]!.base, "ਪ");
assert.equal(clusters[1]!.base, "ੜ");
assert.equal(clusters[1]!.subjoined, "ਹ"); // pairin haha
assert.equal(clusters[2]!.base, "ਨ");
assert.equal(clusters[2]!.lagan, "\u0A3E"); // kanna

// 8. Character classification
assert.equal(classifyGurmukhiChar("ੳ"), "VOWEL_CARRIER");
assert.equal(classifyGurmukhiChar("ਕ"), "CONSONANT");
assert.equal(classifyGurmukhiChar("ਙ"), "NASAL_CONSONANT");
assert.equal(classifyGurmukhiChar("ਹ"), "DUTT_LETTER");
assert.equal(classifyGurmukhiChar("ਾ"), "LAGAN");
assert.equal(classifyGurmukhiChar("ਂ"), "LAGAKHAR");

console.log("All Gurmukhi Unicode & Grapheme contract tests passed successfully!");
