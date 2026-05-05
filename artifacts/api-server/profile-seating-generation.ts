import {
  generateFromPattern,
} from "./src/lib/generator";
import {
  ALL_PATTERNS,
} from "./src/lib/patterns";

async function main() {
  const pattern =
    ALL_PATTERNS.find(
      (entry) =>
        entry.id ===
        "seating-hard-mixed",
    );

  if (!pattern) {
    throw new Error(
      "seating-hard-mixed pattern not found",
    );
  }

  const startedAt = Date.now();
  const result =
    await generateFromPattern(
      pattern,
      1,
      {},
    );

  const question =
    result.questions[0];

  console.log(
    JSON.stringify(
      {
        elapsedMs:
          Date.now() - startedAt,
        questionCount:
          result.questions.length,
        selectedMotif:
          question?.debugMetadata
            ?.selectedMotif,
        arrangementType:
          question?.debugMetadata
            ?.arrangementType,
        participantCount:
          question?.debugMetadata
            ?.participantCount,
        clueCount:
          question?.debugMetadata
            ?.clueCount,
        text: question?.text,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
