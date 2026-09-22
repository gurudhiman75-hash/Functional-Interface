import type { KnowledgeV1Difficulty } from "../types";
import {
  PGK_001_CP005_FACT_IDS,
  PGK_001_CP005_SOURCE_IDS,
} from "./pgk-001-cp005-facts";

export type Pgk001Cp005ReviewQuestion = Readonly<{
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}>;

export const PGK_001_CP005_QL_NAMES = Object.freeze({
  "PGK-001-QL-028": "Major dams and rivers",
  "PGK-001-QL-029": "Dam aliases, reservoirs and types",
  "PGK-001-QL-030": "Barrages and headworks",
  "PGK-001-QL-031": "Canal-headworks-river relations",
  "PGK-001-QL-032": "Major canal and water-conductor systems",
  "PGK-001-QL-033": "Multipurpose-project and location relations",
  "PGK-001-QL-034": "Dams-canals synthesis",
} as const);

type Row = Readonly<{
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  canonical: string;
  options: readonly string[];
  explanation: string;
  factIds: readonly string[];
  sourceIds: readonly string[];
}>;

const bhakraSource = [PGK_001_CP005_SOURCE_IDS.bbmbBhakra, PGK_001_CP005_SOURCE_IDS.bbmbIndusBasin] as const;
const pongSource = [PGK_001_CP005_SOURCE_IDS.bbmbPong, PGK_001_CP005_SOURCE_IDS.bbmbBeasProject] as const;
const rsdSource = [PGK_001_CP005_SOURCE_IDS.pspclRanjitSagar] as const;
const spkSource = [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi] as const;
const roparSource = [PGK_001_CP005_SOURCE_IDS.pudaRopar] as const;
const madhopurSource = [PGK_001_CP005_SOURCE_IDS.pspclShahpurkandi, PGK_001_CP005_SOURCE_IDS.pudaAmritsar] as const;
const harikeSource = [PGK_001_CP005_SOURCE_IDS.PunjabHarike] as const;
const nangalSource = [PGK_001_CP005_SOURCE_IDS.bbmbProjectsAtGlance] as const;

const rowsByQl: Record<keyof typeof PGK_001_CP005_QL_NAMES, readonly Row[]> = {
  "PGK-001-QL-028": [
    {
      difficulty: "Easy",
      stem: "Bhakra Dam is built on which river?",
      canonical: "Sutlej",
      options: ["Sutlej", "Beas", "Ravi", "Ghaggar"],
      explanation: "Bhakra Dam is built across the Sutlej. It is the main storage structure of the Bhakra-Nangal system.",
      factIds: ["bhakra-dam"], sourceIds: bhakraSource,
    },
    {
      difficulty: "Easy",
      stem: "Pong Dam is built on which river?",
      canonical: "Beas",
      options: ["Beas", "Sutlej", "Ravi", "Chenab"],
      explanation: "Pong Dam is built across the Beas River. It is also known as the Beas Dam.",
      factIds: ["pong-dam"], sourceIds: pongSource,
    },
    {
      difficulty: "Easy",
      stem: "Ranjit Sagar Dam is situated on which river?",
      canonical: "Ravi",
      options: ["Ravi", "Beas", "Sutlej", "Ghaggar"],
      explanation: "Ranjit Sagar Dam is on the Ravi River. It is also known as Thein Dam.",
      factIds: ["ranjit-sagar-dam"], sourceIds: rsdSource,
    },
    {
      difficulty: "Easy",
      stem: "Shahpurkandi Dam is built on which river?",
      canonical: "Ravi",
      options: ["Ravi", "Sutlej", "Beas", "Jhelum"],
      explanation: "Shahpurkandi Dam is on the Ravi. It lies downstream of Ranjit Sagar Dam.",
      factIds: ["shahpurkandi-dam", "shahpurkandi-ravi-sequence"], sourceIds: spkSource,
    },
    {
      difficulty: "Medium",
      stem: "Which of the following dam-river pairs is correctly matched?",
      canonical: "Pong Dam — Beas",
      options: ["Pong Dam — Beas", "Bhakra Dam — Ravi", "Ranjit Sagar Dam — Sutlej", "Shahpurkandi Dam — Beas"],
      explanation: "Pong Dam is on the Beas. Bhakra is on the Sutlej, while Ranjit Sagar and Shahpurkandi are on the Ravi.",
      factIds: ["bhakra-dam", "pong-dam", "ranjit-sagar-dam", "shahpurkandi-dam"],
      sourceIds: [...bhakraSource, ...pongSource, ...rsdSource, ...spkSource],
    },
    {
      difficulty: "Medium",
      stem: "Which pair of dams is located on the Ravi River?",
      canonical: "Ranjit Sagar and Shahpurkandi",
      options: ["Ranjit Sagar and Shahpurkandi", "Bhakra and Pong", "Bhakra and Ranjit Sagar", "Pong and Shahpurkandi"],
      explanation: "Ranjit Sagar and Shahpurkandi are both on the Ravi. Shahpurkandi lies downstream of Ranjit Sagar.",
      factIds: ["ranjit-sagar-dam", "shahpurkandi-dam", "shahpurkandi-ravi-sequence"], sourceIds: spkSource,
    },
  ],
  "PGK-001-QL-029": [
    {
      difficulty: "Easy",
      stem: "Thein Dam is another name for:",
      canonical: "Ranjit Sagar Dam",
      options: ["Ranjit Sagar Dam", "Bhakra Dam", "Pong Dam", "Shahpurkandi Dam"],
      explanation: "Ranjit Sagar Dam is also called Thein Dam, after the village near the project site.",
      factIds: ["ranjit-sagar-dam"], sourceIds: rsdSource,
    },
    {
      difficulty: "Easy",
      stem: "Beas Dam is another name for:",
      canonical: "Pong Dam",
      options: ["Pong Dam", "Bhakra Dam", "Ranjit Sagar Dam", "Nangal Barrage"],
      explanation: "Pong Dam is also known as the Beas Dam because it is built across the Beas River.",
      factIds: ["pong-dam"], sourceIds: pongSource,
    },
    {
      difficulty: "Easy",
      stem: "Gobind Sagar reservoir is formed by which dam?",
      canonical: "Bhakra Dam",
      options: ["Bhakra Dam", "Pong Dam", "Ranjit Sagar Dam", "Shahpurkandi Dam"],
      explanation: "Bhakra Dam impounds the Sutlej to form the Gobind Sagar reservoir.",
      factIds: ["bhakra-dam"], sourceIds: bhakraSource,
    },
    {
      difficulty: "Easy",
      stem: "Maharana Pratap Sagar is the reservoir of which dam?",
      canonical: "Pong Dam",
      options: ["Pong Dam", "Bhakra Dam", "Ranjit Sagar Dam", "Nangal Barrage"],
      explanation: "The reservoir behind Pong Dam is known as Maharana Pratap Sagar.",
      factIds: ["pong-dam"], sourceIds: pongSource,
    },
    {
      difficulty: "Medium",
      stem: "Bhakra Dam is which type of dam?",
      canonical: "Concrete straight gravity dam",
      options: ["Concrete straight gravity dam", "Earth-core gravel-shell dam", "Arch dam", "Earthen embankment only"],
      explanation: "Bhakra is a concrete straight gravity dam. Its mass resists the pressure of the stored water.",
      factIds: ["bhakra-dam"], sourceIds: bhakraSource,
    },
    {
      difficulty: "Medium",
      stem: "Pong Dam is which type of dam?",
      canonical: "Earth-core gravel-shell dam",
      options: ["Earth-core gravel-shell dam", "Concrete straight gravity dam", "Masonry arch dam", "Mass-concrete barrage"],
      explanation: "Pong is an earth-core gravel-shell dam on the Beas River.",
      factIds: ["pong-dam"], sourceIds: pongSource,
    },
  ],
  "PGK-001-QL-030": [
    {
      difficulty: "Easy",
      stem: "Nangal is best classified as a:",
      canonical: "Mass-concrete barrage",
      options: ["Mass-concrete barrage", "Earth-core dam", "Canal distributary", "Natural lake"],
      explanation: "Nangal is a mass-concrete barrage in the Bhakra-Nangal system on the Sutlej.",
      factIds: ["nangal-barrage"], sourceIds: nangalSource,
    },
    {
      difficulty: "Medium",
      stem: "Ropar Headworks is located on which river?",
      canonical: "Sutlej",
      options: ["Sutlej", "Ravi", "Beas", "Ghaggar"],
      explanation: "Ropar Headworks is on the Sutlej. The Sirhind Canal takes off from this headworks.",
      factIds: ["ropar-headworks", "sirhind-canal-ropar"], sourceIds: roparSource,
    },
    {
      difficulty: "Medium",
      stem: "Madhopur Headworks is on which river?",
      canonical: "Ravi",
      options: ["Ravi", "Sutlej", "Beas", "Ghaggar"],
      explanation: "Madhopur Headworks is on the Ravi. The Upper Bari Doab Canal takes water from this headworks.",
      factIds: ["madhopur-headworks", "ubdc-madhopur"], sourceIds: madhopurSource,
    },
    {
      difficulty: "Medium",
      stem: "Harike Headworks is located at the confluence of which two rivers?",
      canonical: "Beas and Sutlej",
      options: ["Beas and Sutlej", "Ravi and Beas", "Ravi and Chenab", "Sutlej and Ghaggar"],
      explanation: "Harike lies where the Beas meets the Sutlej. The headworks regulates water into major downstream canal systems.",
      factIds: ["harike-headworks"], sourceIds: harikeSource,
    },
    {
      difficulty: "Medium",
      stem: "From which headworks does the Sirhind Canal take off?",
      canonical: "Ropar Headworks",
      options: ["Ropar Headworks", "Madhopur Headworks", "Harike Headworks", "Hussainiwala Headworks"],
      explanation: "The Sirhind Canal takes off from Ropar Headworks on the Sutlej.",
      factIds: ["ropar-headworks", "sirhind-canal-ropar"], sourceIds: roparSource,
    },
    {
      difficulty: "Medium",
      stem: "From which headworks does the Upper Bari Doab Canal take off?",
      canonical: "Madhopur Headworks",
      options: ["Madhopur Headworks", "Ropar Headworks", "Harike Headworks", "Nangal"],
      explanation: "The Upper Bari Doab Canal takes off from Madhopur Headworks on the Ravi.",
      factIds: ["madhopur-headworks", "ubdc-madhopur"], sourceIds: madhopurSource,
    },
  ],
  "PGK-001-QL-031": [
    {
      difficulty: "Medium",
      stem: "The Sirhind Canal takes off from which headworks?",
      canonical: "Ropar Headworks",
      options: ["Ropar Headworks", "Madhopur Headworks", "Harike Headworks", "Nangal"],
      explanation: "The Sirhind Canal begins at Ropar Headworks on the Sutlej.",
      factIds: ["sirhind-canal-ropar"], sourceIds: roparSource,
    },
    {
      difficulty: "Medium",
      stem: "The Upper Bari Doab Canal takes off from which headworks?",
      canonical: "Madhopur Headworks",
      options: ["Madhopur Headworks", "Ropar Headworks", "Harike Headworks", "Nangal"],
      explanation: "The Upper Bari Doab Canal takes off from Madhopur Headworks on the Ravi.",
      factIds: ["ubdc-madhopur"], sourceIds: madhopurSource,
    },
    {
      difficulty: "Medium",
      stem: "Kashmir Canal takes off from which headworks?",
      canonical: "Madhopur Headworks",
      options: ["Madhopur Headworks", "Harike Headworks", "Ropar Headworks", "Nangal"],
      explanation: "Kashmir Canal takes off from Madhopur Headworks on the Ravi system.",
      factIds: ["kashmir-canal-madhopur"], sourceIds: spkSource,
    },
    {
      difficulty: "Medium",
      stem: "Ferozepur Feeder takes off from which headworks?",
      canonical: "Harike Headworks",
      options: ["Harike Headworks", "Ropar Headworks", "Madhopur Headworks", "Nangal"],
      explanation: "Ferozepur Feeder is regulated from the Harike Headworks system at the Beas-Sutlej confluence.",
      factIds: ["ferozepur-feeder-harike"], sourceIds: harikeSource,
    },
    {
      difficulty: "Hard",
      stem: "Which canal-headworks pair is correctly matched?",
      canonical: "Sirhind Canal — Ropar Headworks",
      options: ["Sirhind Canal — Ropar Headworks", "Upper Bari Doab Canal — Harike Headworks", "Ferozepur Feeder — Madhopur Headworks", "Kashmir Canal — Ropar Headworks"],
      explanation: "Sirhind Canal takes off from Ropar Headworks. UBDC and Kashmir Canal take off from Madhopur, while Ferozepur Feeder takes off from Harike.",
      factIds: ["sirhind-canal-ropar", "ubdc-madhopur", "ferozepur-feeder-harike", "kashmir-canal-madhopur"],
      sourceIds: [...roparSource, ...madhopurSource, ...harikeSource],
    },
    {
      difficulty: "Hard",
      stem: "Which canal-river relation is incorrectly matched?",
      canonical: "Sirhind Canal — Ravi",
      options: ["Sirhind Canal — Ravi", "Upper Bari Doab Canal — Ravi", "Sirhind Canal — Sutlej", "Ferozepur Feeder — Beas-Sutlej confluence"],
      explanation: "Sirhind Canal takes off from Ropar Headworks on the Sutlej, not from the Ravi.",
      factIds: ["sirhind-canal-ropar", "ubdc-madhopur", "ferozepur-feeder-harike"],
      sourceIds: [...roparSource, ...madhopurSource, ...harikeSource],
    },
  ],
  "PGK-001-QL-032": [
    {
      difficulty: "Medium",
      stem: "Nangal Hydel Channel is part of which river system?",
      canonical: "Sutlej system",
      options: ["Sutlej system", "Ravi system", "Beas-only system", "Ghaggar system"],
      explanation: "Nangal Hydel Channel forms part of the Bhakra-Nangal water-conductor system on the Sutlej.",
      factIds: ["nangal-hydel-channel", "nangal-barrage"], sourceIds: nangalSource,
    },
    {
      difficulty: "Medium",
      stem: "The Beas-Sutlej Link transfers water from the Beas toward which river system?",
      canonical: "Sutlej",
      options: ["Sutlej", "Ravi", "Chenab", "Jhelum"],
      explanation: "The Beas-Sutlej Link diverts part of the Beas water toward the Sutlej system.",
      factIds: ["beas-sutlej-link"], sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbIndusBasin, PGK_001_CP005_SOURCE_IDS.bbmbBeasProject],
    },
    {
      difficulty: "Medium",
      stem: "Which system directly links the Beas with the Sutlej for water transfer?",
      canonical: "Beas-Sutlej Link",
      options: ["Beas-Sutlej Link", "Upper Bari Doab Canal", "Sirhind Canal", "Ferozepur Feeder"],
      explanation: "The Beas-Sutlej Link carries Beas water toward the Sutlej system.",
      factIds: ["beas-sutlej-link"], sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbBeasProject],
    },
    {
      difficulty: "Easy",
      stem: "UBDC is the common abbreviation for:",
      canonical: "Upper Bari Doab Canal",
      options: ["Upper Bari Doab Canal", "Upper Beas Diversion Canal", "Unified Bari Drainage Channel", "Upper Bhakra Distribution Canal"],
      explanation: "UBDC stands for Upper Bari Doab Canal. It takes off from Madhopur Headworks on the Ravi.",
      factIds: ["ubdc-madhopur"], sourceIds: madhopurSource,
    },
    {
      difficulty: "Medium",
      stem: "Which canal takes off from Madhopur Headworks on the Ravi?",
      canonical: "Upper Bari Doab Canal",
      options: ["Upper Bari Doab Canal", "Sirhind Canal", "Nangal Hydel Channel", "Ferozepur Feeder"],
      explanation: "The Upper Bari Doab Canal takes water from the Ravi at Madhopur Headworks.",
      factIds: ["ubdc-madhopur"], sourceIds: madhopurSource,
    },
    {
      difficulty: "Hard",
      stem: "Consider the following pairs:\nI. Nangal Hydel Channel — Sutlej system\nII. Upper Bari Doab Canal — Ravi system\nIII. Sirhind Canal — Sutlej system\nWhich of the pairs given above are correctly matched?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three are correct. Nangal Hydel Channel and Sirhind Canal belong to the Sutlej system, while UBDC takes off from the Ravi at Madhopur.",
      factIds: ["nangal-hydel-channel", "ubdc-madhopur", "sirhind-canal-ropar"],
      sourceIds: [...nangalSource, ...madhopurSource, ...roparSource],
    },
  ],
  "PGK-001-QL-033": [
    {
      difficulty: "Easy",
      stem: "Ranjit Sagar Dam is located in which district of Punjab?",
      canonical: "Pathankot",
      options: ["Pathankot", "Gurdaspur", "Rupnagar", "Ferozepur"],
      explanation: "Ranjit Sagar Dam is in Pathankot district on the Ravi River.",
      factIds: ["ranjit-sagar-dam"], sourceIds: rsdSource,
    },
    {
      difficulty: "Medium",
      stem: "The installed generating capacity of Ranjit Sagar Dam is:",
      canonical: "600 MW",
      options: ["600 MW", "206 MW", "396 MW", "990 MW"],
      explanation: "Ranjit Sagar Dam has four 150 MW generating units, giving a total installed capacity of 600 MW.",
      factIds: ["ranjit-sagar-dam"], sourceIds: rsdSource,
    },
    {
      difficulty: "Medium",
      stem: "Shahpurkandi lies between which two major Ravi-system points?",
      canonical: "Ranjit Sagar Dam and Madhopur Headworks",
      options: ["Ranjit Sagar Dam and Madhopur Headworks", "Bhakra Dam and Ropar Headworks", "Pong Dam and Harike Headworks", "Ropar Headworks and Harike Headworks"],
      explanation: "Shahpurkandi lies downstream of Ranjit Sagar Dam and upstream of Madhopur Headworks on the Ravi.",
      factIds: ["shahpurkandi-dam", "shahpurkandi-ravi-sequence", "madhopur-headworks"], sourceIds: spkSource,
    },
    {
      difficulty: "Medium",
      stem: "A major role of Shahpurkandi in the Ravi system is to:",
      canonical: "Regulate releases toward downstream canal systems",
      options: ["Regulate releases toward downstream canal systems", "Divert Sutlej water into the Ravi", "Create Gobind Sagar reservoir", "Serve as the headworks of Sirhind Canal"],
      explanation: "Shahpurkandi provides balancing regulation for releases from Ranjit Sagar toward downstream canal systems.",
      factIds: ["shahpurkandi-balancing"], sourceIds: spkSource,
    },
    {
      difficulty: "Medium",
      stem: "What is the designed generating capacity of Shahpurkandi Dam?",
      canonical: "206 MW",
      options: ["206 MW", "600 MW", "396 MW", "1,415 MW"],
      explanation: "Shahpurkandi's power component is designed for a total generating capacity of 206 MW.",
      factIds: ["shahpurkandi-dam"], sourceIds: spkSource,
    },
    {
      difficulty: "Hard",
      stem: "Arrange the following Ravi-system points from upstream to downstream: Ranjit Sagar Dam, Shahpurkandi Dam and Madhopur Headworks.",
      canonical: "Ranjit Sagar Dam → Shahpurkandi Dam → Madhopur Headworks",
      options: ["Ranjit Sagar Dam → Shahpurkandi Dam → Madhopur Headworks", "Madhopur Headworks → Shahpurkandi Dam → Ranjit Sagar Dam", "Shahpurkandi Dam → Ranjit Sagar Dam → Madhopur Headworks", "Ranjit Sagar Dam → Madhopur Headworks → Shahpurkandi Dam"],
      explanation: "On the Ravi, Shahpurkandi lies below Ranjit Sagar and above Madhopur Headworks.",
      factIds: ["ranjit-sagar-dam", "shahpurkandi-dam", "shahpurkandi-ravi-sequence", "madhopur-headworks"], sourceIds: spkSource,
    },
  ],
  "PGK-001-QL-034": [
    {
      difficulty: "Hard",
      stem: "Consider the following pairs:\nI. Bhakra Dam — Sutlej\nII. Pong Dam — Beas\nIII. Ranjit Sagar Dam — Ravi\nWhich of the pairs given above are correctly matched?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three are correctly matched: Bhakra is on the Sutlej, Pong on the Beas and Ranjit Sagar on the Ravi.",
      factIds: ["bhakra-dam", "pong-dam", "ranjit-sagar-dam"], sourceIds: [...bhakraSource, ...pongSource, ...rsdSource],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following pairs:\nI. Sirhind Canal — Ropar Headworks\nII. Upper Bari Doab Canal — Madhopur Headworks\nIII. Ferozepur Feeder — Harike Headworks\nWhich of the pairs given above are correctly matched?",
      canonical: "I, II and III",
      options: ["I only", "I and II only", "II and III only", "I, II and III"],
      explanation: "All three pairs are correct and represent three important canal-headworks relations in Punjab.",
      factIds: ["sirhind-canal-ropar", "ubdc-madhopur", "ferozepur-feeder-harike"], sourceIds: [...roparSource, ...madhopurSource, ...harikeSource],
    },
    {
      difficulty: "Hard",
      stem: "Which pair of reservoir and dam is correctly matched?",
      canonical: "Gobind Sagar — Bhakra Dam",
      options: ["Gobind Sagar — Bhakra Dam", "Maharana Pratap Sagar — Ranjit Sagar Dam", "Gobind Sagar — Pong Dam", "Maharana Pratap Sagar — Shahpurkandi Dam"],
      explanation: "Gobind Sagar is the reservoir behind Bhakra Dam. Maharana Pratap Sagar is the reservoir behind Pong Dam.",
      factIds: ["bhakra-dam", "pong-dam"], sourceIds: [...bhakraSource, ...pongSource],
    },
    {
      difficulty: "Hard",
      stem: "Which set is correctly matched?",
      canonical: "Bhakra — Sutlej — Gobind Sagar",
      options: ["Bhakra — Sutlej — Gobind Sagar", "Pong — Ravi — Maharana Pratap Sagar", "Ranjit Sagar — Beas — Thein", "Shahpurkandi — Sutlej — Pathankot"],
      explanation: "Bhakra is on the Sutlej and forms Gobind Sagar. Pong is on the Beas, while Ranjit Sagar and Shahpurkandi are on the Ravi.",
      factIds: ["bhakra-dam", "pong-dam", "ranjit-sagar-dam", "shahpurkandi-dam"], sourceIds: [...bhakraSource, ...pongSource, ...rsdSource, ...spkSource],
    },
    {
      difficulty: "Hard",
      stem: "Which combination correctly links a water-transfer system with the river receiving the diverted water?",
      canonical: "Beas-Sutlej Link — Sutlej",
      options: ["Beas-Sutlej Link — Sutlej", "Upper Bari Doab Canal — Sutlej", "Sirhind Canal — Ravi", "Ferozepur Feeder — Ravi"],
      explanation: "The Beas-Sutlej Link transfers Beas water toward the Sutlej system.",
      factIds: ["beas-sutlej-link"], sourceIds: [PGK_001_CP005_SOURCE_IDS.bbmbBeasProject],
    },
    {
      difficulty: "Hard",
      stem: "Consider the following statements:\nI. Ropar Headworks is on the Sutlej.\nII. Madhopur Headworks is on the Ravi.\nIII. Harike Headworks is at the Beas-Sutlej confluence.\nIV. Ranjit Sagar and Shahpurkandi are both on the Ravi.\nWhich of the statements given above are correct?",
      canonical: "I, II, III and IV",
      options: ["I and II only", "I, II and III only", "II, III and IV only", "I, II, III and IV"],
      explanation: "All four statements are correct. Together they connect Punjab's major headworks with the Sutlej, Ravi and Beas-Sutlej systems.",
      factIds: ["ropar-headworks", "madhopur-headworks", "harike-headworks", "ranjit-sagar-dam", "shahpurkandi-dam"],
      sourceIds: [...roparSource, ...madhopurSource, ...harikeSource, ...rsdSource, ...spkSource],
    },
  ],
};

function buildQuestion(
  qlId: keyof typeof PGK_001_CP005_QL_NAMES,
  row: Row,
  index: number,
): Pgk001Cp005ReviewQuestion {
  const correctIndex = row.options.indexOf(row.canonical);
  if (correctIndex < 0) throw new Error(`${qlId} row ${index + 1} is missing its canonical answer`);
  return Object.freeze({
    questionId: `PGK-001-CP005-Q${String(index + 1).padStart(3, "0")}`,
    qlId,
    qlName: PGK_001_CP005_QL_NAMES[qlId],
    difficulty: row.difficulty,
    stem: row.stem,
    options: Object.freeze([...row.options]),
    correctIndex,
    canonicalAnswer: row.canonical,
    explanation: row.explanation,
    factIds: Object.freeze([...row.factIds]),
    sourceIds: Object.freeze([...row.sourceIds]),
    reviewOnly: true,
    runtimeRegistered: false,
  });
}

export const PGK_001_CP005_REVIEW_BATCH_V1: readonly Pgk001Cp005ReviewQuestion[] = Object.freeze(
  (Object.keys(PGK_001_CP005_QL_NAMES) as (keyof typeof PGK_001_CP005_QL_NAMES)[]).flatMap((qlId, qlIndex) =>
    rowsByQl[qlId].map((row, rowIndex) => buildQuestion(qlId, row, qlIndex * 6 + rowIndex)),
  ),
);

export function auditPgk001Cp005ReviewBatchV1() {
  const issues: string[] = [];
  const validFactIds = new Set(PGK_001_CP005_FACT_IDS);
  const stems = new Set<string>();
  const qlCounts = new Map<string, number>();
  const bannedLearnerPhrases = [
    "according to",
    "government of punjab",
    "bbmb",
    "pspcl",
    "puda",
    "department of water resources",
    "master plan",
    "report",
    "website",
    "source",
    "the correct answer is",
    "the correct option",
    "the other options",
    "this question tests",
    "review batch",
    "generator",
    "identify it",
  ];

  for (const question of PGK_001_CP005_REVIEW_BATCH_V1) {
    const normalizedStem = question.stem.trim().toLowerCase().replace(/\s+/g, " ");
    const learnerText = `${question.stem}\n${question.explanation}`.toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`${question.questionId}: duplicate stem`);
    stems.add(normalizedStem);
    qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);

    if (question.options.length !== 4) issues.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: canonical answer/index mismatch`);
    if (!question.explanation.trim()) issues.push(`${question.questionId}: missing explanation`);
    if (question.sourceIds.length === 0) issues.push(`${question.questionId}: missing source authority`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${question.questionId}: lifecycle guard broken`);

    for (const factId of question.factIds) {
      if (!validFactIds.has(factId)) issues.push(`${question.questionId}: unknown fact id ${factId}`);
    }
    for (const phrase of bannedLearnerPhrases) {
      if (learnerText.includes(phrase)) issues.push(`${question.questionId}: banned learner-facing phrase: ${phrase}`);
    }
    if (question.explanation.split(/(?<=[.!?])\s+/).length > 3) issues.push(`${question.questionId}: explanation too long`);
  }

  for (const qlId of Object.keys(PGK_001_CP005_QL_NAMES)) {
    if (qlCounts.get(qlId) !== 6) issues.push(`${qlId}: expected six review questions`);
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: PGK_001_CP005_REVIEW_BATCH_V1.length,
  });
}
