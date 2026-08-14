import type { MalCp006SourceFixture } from "./cp006-types";

export const MAL_CP006_WAVE01_SOURCE_FIXTURES:
  readonly MalCp006SourceFixture[] = [
    {
      sourceId: "CAT-2019-S2-Q80-THREE-VESSEL-SALT-CYCLE",
      publisher: "CAT 2019 Slot 2 / Cracku public question archive",
      title: "Three 500 ml salt-solution vessels with A→B→C→A transfers",
      url: "https://cracku.in/14-the-strength-of-a-salt-solution-is-p-if-100-ml-of--x-cat-2019-slot-2-quantitative-aptitude",
      retrievedOn: "2026-08-13",
      disposition: "CP006_DIRECT",
      supportedPrototypeIds: [
        "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION",
      ],
      observedContract:
        "Track current composition through three distinct vessels; every later transfer samples the source vessel after its previous receipt.",
      ownershipReason:
        "The answer depends on stage-by-stage cross-vessel state, so a single weighted blend cannot replace the vessel ledger.",
    },
    {
      sourceId: "CAT-2022-S2-Q61-TWO-CONTAINER-ROUND-TRIP",
      publisher: "CAT 2022 Slot 2 / Cracku public question archive",
      title: "Sugar-syrup and milk containers with transfer, return and transfer",
      url: "https://cracku.in/61-there-are-two-containers-of-the-same-volume-first--x-cat-2022-slot-2",
      retrievedOn: "2026-08-13",
      disposition: "CP006_DIRECT",
      supportedPrototypeIds: [
        "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
      ],
      observedContract:
        "Transfer half of one container to the second, return half of the current second-container mixture, then transfer half of the current first-container mixture.",
      ownershipReason:
        "Current-composition sampling after receipt is essential and crosses between distinct vessels.",
    },
    {
      sourceId: "SSC-CGL-T2-2023-SPIRIT-WATER-RETRANSFER",
      publisher: "SSC CGL Tier II 26 Oct 2023 / Oliveboard PYQ archive",
      title: "Spirit-water transfer to B, water refill in A, then current A retransferred to B",
      url: "https://www.oliveboard.in/question-answer/pyq-80-litres-of-a-mixture-of-spirit-and-water-in-the-ratio-7-9-is",
      retrievedOn: "2026-08-13",
      disposition: "CP006_DIRECT",
      supportedPrototypeIds: [
        "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO",
      ],
      observedContract:
        "Destination B accumulates two samples from A, while A is altered by a pure-water refill between the samples.",
      ownershipReason:
        "The refill is a one-vessel submechanic, but the requested destination state cannot be solved without the cross-vessel accumulation ledger.",
    },
    {
      sourceId: "TESTBOOK-SIMULTANEOUS-EQUAL-EXCHANGE-12-18",
      publisher: "Testbook",
      title: "Equal quantity exchanged between 12 L and 18 L vessels until alcohol concentrations match",
      url: "https://testbook.com/question-answer/there-are-two-vessels-a-b-of-capacities-12-l--5c18db61624ec241c0b361b0",
      retrievedOn: "2026-08-13",
      disposition: "CP006_DIRECT",
      supportedPrototypeIds: [
        "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS",
        "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE",
      ],
      observedContract:
        "Withdraw equal quantities simultaneously from two differently concentrated vessels, cross-pour them, and force equal final concentration.",
      ownershipReason:
        "Both vessel states change simultaneously; the inverse exchange amount is a genuine two-vessel equalisation invariant.",
    },
    {
      sourceId: "TESTBOOK-RUM-WATER-25PCT-RETURN",
      publisher: "Testbook",
      title: "Equal-quantity rum-water vessels with 25% B→A and current A→B return",
      url: "https://testbook.com/question-answer/two-vessels-a-b-of-equal-quantity-contain-mi--5e78b97cf60d5d5e24dfd29d/amp",
      retrievedOn: "2026-08-13",
      disposition: "CP006_DIRECT",
      supportedPrototypeIds: [
        "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
      ],
      observedContract:
        "A percentage sample moves B→A, then the same percentage of the now-changed A mixture moves back to B.",
      ownershipReason:
        "The second transfer must sample A's current composition after the first receipt.",
    },
    {
      sourceId: "PREPP-PURE-MILK-WATER-CROSS-VESSEL-RATIO",
      publisher: "Prepp",
      title: "Pure milk A→B followed by current milk-water mixture B→A",
      url: "https://prepp.in/question/there-are-two-vessels-a-and-b-vessel-a-is-containi-6436fce4bc33b4565074bf5c",
      retrievedOn: "2026-08-13",
      disposition: "CP006_DIRECT",
      supportedPrototypeIds: [
        "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO",
      ],
      observedContract:
        "Start with pure milk and pure water in separate vessels, transfer milk to B, then return a sample of current B and compare a component in A with the complementary component in B.",
      ownershipReason:
        "The requested answer compares final component amounts in distinct vessels after a round trip.",
    },

    // Boundary / negative-control fixtures. They intentionally consume no CP-006 prototype.
    {
      sourceId: "MAL001-DESIGN-SIMPLE-COMBINATION-BOUNDARY",
      publisher: "ExamTree MAL-001 design authority",
      title: "Simple vessel combination belongs to CP-001 when no staged vessel ledger matters",
      url: "repository://MAL-001/MAL-001-END-TO-END-DESIGN.md",
      retrievedOn: "2026-08-13",
      disposition: "CP001_BOUNDARY",
      supportedPrototypeIds: [],
      observedContract:
        "Combine source quantities once and ask only the resulting weighted mean or composition.",
      ownershipReason:
        "A single weighted blend is sufficient; vessel naming alone does not create CP-006 ownership.",
    },
    {
      sourceId: "MAL001-CP003-CP006-DISTINCT-VESSEL-BOUNDARY",
      publisher: "ExamTree MAL-CP-003 source-policy authority",
      title: "CP-006 starts only when material moves between distinct vessels",
      url: "repository://MAL-001/foundation/cp003-source-policy-closure-wave11.ts",
      retrievedOn: "2026-08-13",
      disposition: "CP003_BOUNDARY",
      supportedPrototypeIds: [],
      observedContract:
        "Repeated remove-refill or stage switching entirely inside one vessel remains CP-003.",
      ownershipReason:
        "Cross-vessel movement is the hard ownership boundary.",
    },
    {
      sourceId: "MAL001-CP004-CONCENTRATION-BOUNDARY",
      publisher: "ExamTree MAL-001 design authority",
      title: "Conserved-solute transformation remains CP-004 without cross-vessel bookkeeping",
      url: "repository://MAL-001/MAL-001-END-TO-END-DESIGN.md",
      retrievedOn: "2026-08-13",
      disposition: "CP004_BOUNDARY",
      supportedPrototypeIds: [],
      observedContract:
        "Dilution, strengthening or evaporation in one vessel is governed by a conserved-solute relation.",
      ownershipReason:
        "Concentration vocabulary is not sufficient for CP-006; distinct-vessel state transition must be essential.",
    },
    {
      sourceId: "LEGACY-V2-SEVEN-VESSEL-LABELS-SINGLE-GENERATOR",
      publisher: "ExamTree Quant V2 repository",
      title: "All legacy vessel labels route through draftVessel single-vessel removal",
      url: "repository://quant-v2/canonical/mixture-alligation-motif-factories.ts",
      retrievedOn: "2026-08-13",
      disposition: "LEGACY_NOT_DIRECT_EVIDENCE",
      supportedPrototypeIds: [],
      observedContract:
        "The V2 vessel-group factory removes a sample from one milk-water vessel and asks how much milk remains, regardless of which vessel family label invoked it.",
      ownershipReason:
        "Legacy labels 59–65 cannot independently prove multi-vessel CP-006 task contracts.",
    },
  ] as const;

export const MAL_CP006_WAVE01_DIRECT_SOURCE_IDS = MAL_CP006_WAVE01_SOURCE_FIXTURES
  .filter((fixture) => fixture.disposition === "CP006_DIRECT")
  .map((fixture) => fixture.sourceId);
