// Human content review revision 2
import { buildReasoningNoveltyReviewPackV1 } from "../shared/reasoning-novelty-review-pack-v1";

const pack = await buildReasoningNoveltyReviewPackV1({
  samplesPerProvider: 4,
  seed: 14000,
});

console.log(pack);
