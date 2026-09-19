import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp035ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp035ReviewSpec[] = [
  [
    3,
    "Medium",
    "Why are restriction enzymes and ligase often used together?",
    "One cuts DNA and the other joins selected fragments",
    [
      "Both only copy DNA",
      "Both destroy all DNA",
      "One makes proteins and the other makes lipids"
    ],
    "Restriction enzymes create DNA fragments, and ligase can join compatible fragments into recombinant molecules.",
    [
      "RESTRICTION-LIGASE-COMPLEMENT"
    ]
  ],
  [
    3,
    "Medium",
    "Sticky ends produced by some restriction enzymes are useful because they:",
    "Can pair with complementary DNA ends before ligation",
    [
      "Prevent all DNA joining",
      "Contain no bases",
      "Always destroy genes"
    ],
    "Complementary overhangs can base-pair, helping compatible DNA fragments align for joining.",
    [
      "STICKY-ENDS"
    ]
  ],
  [
    3,
    "Hard",
    "A researcher cuts a plasmid and a target gene with the same restriction enzyme. Why does this help?",
    "It can create compatible DNA ends that can be joined",
    [
      "It guarantees the gene will express without a host",
      "It removes the need for ligase",
      "It converts DNA into protein"
    ],
    "Using the same enzyme can produce matching ends on vector and insert, making recombinant DNA formation easier.",
    [
      "SAME-RESTRICTION-ENZYME"
    ]
  ],
  [
    4,
    "Easy",
    "A small circular DNA molecule commonly found in bacteria is called a:",
    "Plasmid",
    [
      "Chromatid",
      "Ribosome",
      "Lysosome"
    ],
    "Plasmids are small circular DNA molecules separate from the main bacterial chromosome.",
    [
      "PLASMID-DEFINITION"
    ]
  ],
  [
    4,
    "Easy",
    "In genetic engineering, a vector is used to:",
    "Carry genetic material into a host cell",
    [
      "Measure temperature",
      "Destroy every host cell",
      "Classify species"
    ],
    "Vectors such as plasmids deliver selected DNA into host cells.",
    [
      "VECTOR-FUNCTION"
    ]
  ],
  [
    4,
    "Medium",
    "Why are plasmids useful as cloning vectors?",
    "They can replicate inside bacterial cells",
    [
      "They contain no DNA",
      "They are proteins",
      "They cannot enter cells"
    ],
    "Plasmids can be introduced into bacteria and copied as the host cells grow.",
    [
      "PLASMID-REPLICATION"
    ]
  ],
  [
    4,
    "Medium",
    "Which organism is commonly used as a host for recombinant plasmids?",
    "Bacterium such as Escherichia coli",
    [
      "Earthworm",
      "Mango tree only",
      "Human red blood cell"
    ],
    "E. coli is widely used because it grows rapidly and can carry recombinant plasmids.",
    [
      "ECOLI-HOST"
    ]
  ],
  [
    4,
    "Medium",
    "A selectable marker on a plasmid helps researchers:",
    "Identify cells that received the plasmid",
    [
      "Cut DNA at every base",
      "Make sunlight",
      "Remove all genes"
    ],
    "Selectable markers allow transformed cells to be distinguished from cells that did not take up the vector.",
    [
      "SELECTABLE-MARKER"
    ]
  ],
  [
    4,
    "Hard",
    "A recombinant plasmid enters only a few bacteria in a culture. Why is selection needed afterward?",
    "To distinguish transformed bacteria from those without the plasmid",
    [
      "To turn all bacteria into fungi",
      "To remove the inserted gene",
      "To stop plasmid replication"
    ],
    "Only some cells take up the vector, so a selectable marker helps identify those carrying it.",
    [
      "TRANSFORMATION-SELECTION"
    ]
  ],
  [
    5,
    "Easy",
    "PCR is used to:",
    "Make many copies of a selected DNA sequence",
    [
      "Translate proteins",
      "Measure blood pressure",
      "Destroy all DNA"
    ],
    "Polymerase chain reaction rapidly amplifies a chosen DNA region.",
    [
      "PCR-DEFINITION"
    ]
  ],
  [
    5,
    "Easy",
    "The full form of PCR is:",
    "Polymerase Chain Reaction",
    [
      "Protein Copying Reaction",
      "Plasmid Cell Replication",
      "Primary Chromosome Reading"
    ],
    "PCR stands for Polymerase Chain Reaction.",
    [
      "PCR-FULL-FORM"
    ]
  ],
  [
    5,
    "Medium",
    "Why is heat-stable DNA polymerase useful in PCR?",
    "It remains functional after repeated heating cycles",
    [
      "It works only at freezing temperature",
      "It cuts DNA like a restriction enzyme",
      "It prevents DNA copying"
    ],
    "PCR repeatedly heats DNA, so a thermostable polymerase can survive the cycles.",
    [
      "PCR-THERMOSTABLE-POLYMERASE"
    ]
  ],
  [
    5,
    "Medium",
    "What happens during the denaturation step of PCR?",
    "The two DNA strands separate",
    [
      "DNA fragments are joined by ligase",
      "Proteins are translated",
      "Bacteria divide"
    ],
    "Heating breaks the hydrogen bonds between complementary strands, separating them.",
    [
      "PCR-DENATURATION"
    ]
  ],
  [
    5,
    "Medium",
    "Why are primers required in PCR?",
    "They provide starting points for DNA synthesis",
    [
      "They digest proteins",
      "They replace DNA polymerase",
      "They destroy the template"
    ],
    "Primers bind to target sequences and give DNA polymerase a starting point.",
    [
      "PCR-PRIMERS"
    ]
  ],
  [
    5,
    "Hard",
    "A forensic sample contains only a tiny amount of DNA. Why is PCR useful before analysis?",
    "It can amplify the target DNA to detectable amounts",
    [
      "It changes the person's genotype",
      "It converts DNA into fingerprints directly without copying",
      "It removes all variation"
    ],
    "PCR can make millions of copies from a small starting quantity, enabling further testing.",
    [
      "PCR-FORENSIC-SMALL-SAMPLE"
    ]
  ]
] as const;
