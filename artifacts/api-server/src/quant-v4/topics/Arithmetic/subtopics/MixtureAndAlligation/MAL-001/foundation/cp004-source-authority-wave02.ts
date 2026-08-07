import type { MalCp004DiscoveryPrototypeId } from "./cp004-types";

export const MAL_CP004_WAVE02_SOURCE_EVIDENCE_KINDS = [
  "UPLOADED_TEXTBOOK_DIRECT_TASK",
  "UPLOADED_TEXTBOOK_FORMULA_EQUIVALENT_DIRECTION",
  "INTERNAL_RUNTIME_COLLISION",
  "UPLOADED_TEXTBOOK_BOUNDARY",
] as const;

export type MalCp004Wave02SourceEvidenceKind =
  (typeof MAL_CP004_WAVE02_SOURCE_EVIDENCE_KINDS)[number];

export type MalCp004Wave02OwnerVerdict =
  | "MAL-CP-004"
  | "MAL-CP-004_SOURCE_GAP"
  | "PCT-CP-006_MAL-CP-004_COLLISION"
  | "MAL-CP-001_CP004_BOUNDARY"
  | "MAL-CP-003_CP004_BOUNDARY";

export interface MalCp004Wave02SourceReference {
  sourceId: string;
  sourceTitle: string;
  editionOrArtifact: string;
  location: string;
  examTag: string | null;
  taskSummary: string;
  evidenceKind: MalCp004Wave02SourceEvidenceKind;
  ownerVerdict: MalCp004Wave02OwnerVerdict;
  prototypeIds: readonly MalCp004DiscoveryPrototypeId[];
  normalizedCaseIds: readonly string[];
}

export const MAL_CP004_WAVE02_SOURCE_REFERENCES:
  readonly MalCp004Wave02SourceReference[] = [
    {
      sourceId: "RSA-QA-PCT-EX42-PURE-SALT-ADDITION",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage, solved example 42, printed pages 316-317",
      examTag: "MAT 2004",
      taskSummary:
        "Pure salt is added to 30 kg of a 2% salt solution to raise its concentration to 10%; find the pure salt added.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT_TASK",
      ownerVerdict: "MAL-CP-004",
      prototypeIds: [
        "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
        "MAL-CP004-PROT-COMPONENT-AMOUNT-FROM-CONCENTRATION",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-COMPONENT-AMOUNT-EX42",
        "MAL-CP004-SRC-CASE-PURE-ADDITION-EX42",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-EX43-EVAPORATION-ORIGINAL-MASS",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage, solved example 43, printed page 317",
      examTag: "SSC 2007",
      taskSummary:
        "After 25 kg of water evaporates from a 20% salt solution, the remaining solution is 30% salt; find the original solution weight.",
      evidenceKind: "UPLOADED_TEXTBOOK_FORMULA_EQUIVALENT_DIRECTION",
      ownerVerdict: "MAL-CP-004_SOURCE_GAP",
      prototypeIds: [
        "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-EVAPORATION-EX43-FORWARD",
        "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATION-EX43",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-Q325-FRESH-TO-DRY-MASS",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage exercise, question 325, printed page 338; solution on printed page 363",
      examTag: null,
      taskSummary:
        "Fresh fruit is 68% water and dry fruit is 20% water; find the dry-fruit mass from 100 kg of fresh fruit.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT_TASK",
      ownerVerdict: "MAL-CP-004",
      prototypeIds: [
        "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-FINAL-DRY-MASS-Q325",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-Q327-DRY-TO-FRESH-MASS",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage exercise, question 327, printed page 338; solution on printed page 363",
      examTag: "MAT 2007",
      taskSummary:
        "Dry grapes are 10% water and weigh 250 kg; recover the original fresh-grape mass when fresh grapes were 80% water.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT_TASK",
      ownerVerdict: "MAL-CP-004",
      prototypeIds: [
        "MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-INITIAL-FRESH-MASS-Q327",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-Q328-PURE-GOLD-ADDITION",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage exercise, question 328, printed page 338; solution on printed page 363",
      examTag: "SNAP 2010",
      taskSummary:
        "Pure gold is added to a 50 g alloy containing 80% gold to raise the gold percentage to 90%; find the gold added.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT_TASK",
      ownerVerdict: "MAL-CP-004",
      prototypeIds: [
        "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-PURE-ADDITION-Q328",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-Q330-KNOWN-EVAPORATION-STRENGTH",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage exercise, question 330, printed page 338",
      examTag: "RRB 2006",
      taskSummary:
        "One litre of water evaporates from 6 litres of 4% sugar solution; find the new sugar percentage.",
      evidenceKind: "UPLOADED_TEXTBOOK_FORMULA_EQUIVALENT_DIRECTION",
      ownerVerdict: "MAL-CP-004_SOURCE_GAP",
      prototypeIds: [
        "MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT",
        "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-CONCENTRATION-Q330",
        "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-EVAPORATION-Q330",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-Q331-WATER-ADDITION-TARGET",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage exercise, question 331, printed page 338",
      examTag: null,
      taskSummary:
        "Water is added to 9 ml of 50% alcohol lotion to reduce the alcohol strength to 30%; find the water added.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT_TASK",
      ownerVerdict: "MAL-CP-004",
      prototypeIds: [
        "MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-SOLVENT-ADDITION-Q331",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-Q332-KNOWN-DILUTION-STRENGTH",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage exercise, question 332, printed page 338",
      examTag: "SSC 2007",
      taskSummary:
        "One litre of water is added to 5 litres of 40% alcohol solution; find the new alcohol strength.",
      evidenceKind: "UPLOADED_TEXTBOOK_FORMULA_EQUIVALENT_DIRECTION",
      ownerVerdict: "MAL-CP-004_SOURCE_GAP",
      prototypeIds: [
        "MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT",
        "MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET",
      ],
      normalizedCaseIds: [
        "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-DILUTION-Q332",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-Q333-PURE-ALCOHOL-ADDITION",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage exercise, question 333, printed page 338",
      examTag: null,
      taskSummary:
        "Pure alcohol is added to 400 ml of 15% alcohol solution to raise its strength to 32%; find the pure alcohol added.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT_TASK",
      ownerVerdict: "MAL-CP-004",
      prototypeIds: [
        "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-PURE-ADDITION-Q333",
      ],
    },
    {
      sourceId: "ARUN-QA-CAT2001-FRESH-DRY-GRAPES",
      sourceTitle: "How to Prepare for Quantitative Aptitude for CAT",
      editionOrArtifact: "Arun Sharma, eighth edition, McGraw Hill Education, 2018",
      location: "Taste of the Exams—Blocks II and III, question 28, printed page III.187",
      examTag: "CAT 2001",
      taskSummary:
        "Fresh grapes are 90% water and dried grapes are 20% water; find dry grapes obtained from 20 kg fresh grapes.",
      evidenceKind: "UPLOADED_TEXTBOOK_DIRECT_TASK",
      ownerVerdict: "MAL-CP-004",
      prototypeIds: [
        "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT",
      ],
      normalizedCaseIds: [
        "MAL-CP004-SRC-CASE-FINAL-DRY-MASS-CAT2001",
      ],
    },
    {
      sourceId: "EXAMTREE-PCT-CP006-EVAPORATION-DRYING",
      sourceTitle: "ExamTree Percentage PCT-007 generated review exports",
      editionOrArtifact: "Internal Quant V4 Percentage runtime and duplicate audit",
      location: "PCT-CP-006 evaporationDryingCompositionApplication and PCT content duplicate audit",
      examTag: null,
      taskSummary:
        "Percentage currently generates evaporation and drying questions using the same conserved-component equations as MAL-CP-004.",
      evidenceKind: "INTERNAL_RUNTIME_COLLISION",
      ownerVerdict: "PCT-CP-006_MAL-CP-004_COLLISION",
      prototypeIds: [
        "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET",
        "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT",
        "MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT",
      ],
      normalizedCaseIds: [
        "MAL-CP004-COLLISION-PCT-CP006-CONSERVED-COMPONENT",
      ],
    },
    {
      sourceId: "RSA-QA-PCT-Q334-TWO-SOLUTION-BLEND",
      sourceTitle: "Quantitative Aptitude for Competitive Examinations",
      editionOrArtifact: "R.S. Aggarwal, revised and enlarged edition, 2017",
      location: "Percentage exercise, question 334, printed page 338",
      examTag: "MCA 2005",
      taskSummary:
        "Two alcohol solutions of known quantities and strengths are mixed; find the resultant strength.",
      evidenceKind: "UPLOADED_TEXTBOOK_BOUNDARY",
      ownerVerdict: "MAL-CP-001_CP004_BOUNDARY",
      prototypeIds: [],
      normalizedCaseIds: [],
    },
    {
      sourceId: "ARUN-QA-MIXTURE-REPLACE-WITH-DIFFERENT-STRENGTH",
      sourceTitle: "How to Prepare for Quantitative Aptitude for CAT",
      editionOrArtifact: "Arun Sharma, eighth edition, McGraw Hill Education, 2018",
      location: "Mixture practice set, replacement by a liquid having a different concentration",
      examTag: null,
      taskSummary:
        "Part of a mixture is removed and replaced by another mixture with its own concentration; determine the replaced fraction.",
      evidenceKind: "UPLOADED_TEXTBOOK_BOUNDARY",
      ownerVerdict: "MAL-CP-003_CP004_BOUNDARY",
      prototypeIds: [],
      normalizedCaseIds: [],
    },
  ] as const;

export const MAL_CP004_WAVE02_SOURCE_GAP_IDS = [
  "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATED-QUANTITY",
  "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-EVAPORATION",
  "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-SOLVENT-ADDITION",
] as const;

export type MalCp004Wave02SourceGapId =
  (typeof MAL_CP004_WAVE02_SOURCE_GAP_IDS)[number];

export const MAL_CP004_WAVE02_SOURCE_GAPS = [
  {
    gapId: "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATED-QUANTITY",
    sourceIds: ["RSA-QA-PCT-EX43-EVAPORATION-ORIGINAL-MASS"],
    recommendedDisposition: "ADD_OPEN_DISCOVERY_PROTOTYPE",
    reason:
      "The source asks for the initial total from an evaporated quantity and two concentrations; this inverse is not one of the seven Wave 01 requests.",
  },
  {
    gapId: "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-EVAPORATION",
    sourceIds: ["RSA-QA-PCT-Q330-KNOWN-EVAPORATION-STRENGTH"],
    recommendedDisposition: "ADD_REPRESENTATION_VARIANT_OR_PROTOTYPE",
    reason:
      "The source gives the evaporated quantity and asks for final strength rather than asking how much must evaporate.",
  },
  {
    gapId: "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-SOLVENT-ADDITION",
    sourceIds: ["RSA-QA-PCT-Q332-KNOWN-DILUTION-STRENGTH"],
    recommendedDisposition: "ADD_REPRESENTATION_VARIANT_OR_PROTOTYPE",
    reason:
      "The source gives the solvent addition and asks for final strength rather than asking for the solvent required to hit a target.",
  },
] as const;
