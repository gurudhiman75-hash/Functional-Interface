import { PREFIX_ITEMS, SUFFIX_ITEMS } from "./CP008-authorities";

/**
 * V4 review quality is intentionally fail-closed.
 *
 * F05/F06 must never need unrelated fallback words. Every affix authority must
 * carry enough same-target genuine and spurious examples to build a complete
 * four-option item from its own reviewed family.
 */
export function assertCP008V4AuthorityDepth(): void {
  for (const item of [...PREFIX_ITEMS, ...SUFFIX_ITEMS]) {
    const validWords = new Set(item.validWords.map((word) => word.normalize("NFC").trim()));
    const spuriousWords = new Set(item.spuriousWords.map((word) => word.normalize("NFC").trim()));

    if (validWords.size < 3) {
      throw new Error(
        `CP008 V4 authority ${item.id} has only ${validWords.size} reviewed valid words; at least 3 are required.`
      );
    }

    if (spuriousWords.size < 3) {
      throw new Error(
        `CP008 V4 authority ${item.id} has only ${spuriousWords.size} target-family spurious words; at least 3 are required. Do not fall back to unrelated distractors.`
      );
    }

    for (const word of validWords) {
      if (spuriousWords.has(word)) {
        throw new Error(`CP008 V4 authority ${item.id} marks '${word}' as both valid and spurious.`);
      }
    }
  }
}
