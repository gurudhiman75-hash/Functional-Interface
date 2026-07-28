import { brotliDecompressSync } from "node:zlib";

import chunk0 from "./question-studio-review.library.chunk-0";
import chunk1 from "./question-studio-review.library.chunk-1";
import chunk2 from "./question-studio-review.library.chunk-2";
import chunk3 from "./question-studio-review.library.chunk-3";
import chunk4 from "./question-studio-review.library.chunk-4";
import chunk5 from "./question-studio-review.library.chunk-5";
import chunk6 from "./question-studio-review.library.chunk-6";

const COMPRESSED_LIBRARY_BASE64 = [
  chunk0,
  chunk1,
  chunk2,
  chunk3,
  chunk4,
  chunk5,
  chunk6,
].join("");

export const PNL_001_CANONICAL_REVIEW_LIBRARY = JSON.parse(
  brotliDecompressSync(
    Buffer.from(COMPRESSED_LIBRARY_BASE64, "base64"),
  ).toString("utf8"),
) as unknown;
