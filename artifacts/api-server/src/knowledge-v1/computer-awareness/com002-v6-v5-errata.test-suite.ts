async function runStage(label: string, loader: () => Promise<unknown>) {
  try {
    await loader();
    console.log(`[com002-v6-v5-errata] PASS: ${label}`);
  } catch (error) {
    console.error(`[com002-v6-v5-errata] FAIL: ${label}`);
    throw error;
  }
}

await runStage("English V6 editorial errata candidate", () => import("./com002-review-synthesis-v6.test"));
await runStage("Hindi/Punjabi Localization V5 editorial errata candidate", () => import("./com002-localization-v5.test"));
await runStage("Hindi/Punjabi Localization V5 exact review sampler", () => import("./com002-localization-human-review-v5.test"));

console.log("COM-002 V6/V5 editorial errata suite passed.");
