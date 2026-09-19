import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp035ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp035ReviewSpec[] = [
  [
    1,
    "Easy",
    "The use of living organisms, cells or biological processes to make useful products is called:",
    "Biotechnology",
    [
      "Taxonomy",
      "Ecology",
      "Anatomy"
    ],
    "Biotechnology uses biological systems or their components to develop useful products and processes.",
    [
      "BIOTECHNOLOGY-DEFINITION"
    ]
  ],
  [
    1,
    "Easy",
    "Which is a traditional example of biotechnology?",
    "Making curd with microorganisms",
    [
      "Measuring blood pressure",
      "Using a telescope",
      "Mining iron ore"
    ],
    "Fermentation by microorganisms has been used for centuries to make foods such as curd, bread and cheese.",
    [
      "TRADITIONAL-BIOTECH-CURD"
    ]
  ],
  [
    1,
    "Medium",
    "Modern biotechnology differs from traditional fermentation because it often involves:",
    "Direct manipulation of DNA or cells",
    [
      "Only heating food",
      "Only mechanical mixing",
      "No use of living systems"
    ],
    "Modern biotechnology can modify genes, cells or biological pathways in controlled ways.",
    [
      "MODERN-BIOTECH-DNA"
    ]
  ],
  [
    1,
    "Medium",
    "Which field combines biology with technology to produce medicines, crops and industrial products?",
    "Biotechnology",
    [
      "Astronomy",
      "Geology",
      "Meteorology"
    ],
    "Biotechnology applies biological knowledge to practical production and problem-solving.",
    [
      "BIOTECH-APPLICATIONS"
    ]
  ],
  [
    1,
    "Medium",
    "Why are microorganisms widely used in biotechnology?",
    "They grow rapidly and can produce useful substances",
    [
      "They contain no genes",
      "They never require nutrients",
      "They cannot be cultured"
    ],
    "Many microbes reproduce quickly and can be grown under controlled conditions to produce enzymes, medicines and other products.",
    [
      "MICROBES-BIOTECH-USE"
    ]
  ],
  [
    1,
    "Hard",
    "A process uses engineered bacteria to manufacture a human protein. Which feature makes this biotechnology rather than simple fermentation?",
    "The bacteria carry introduced genetic information for the human protein",
    [
      "The bacteria consume sugar",
      "The process uses a vessel",
      "The bacteria grow in liquid"
    ],
    "Engineering bacteria with a human gene is a modern biotechnology application based on recombinant DNA.",
    [
      "ENGINEERED-BACTERIA-BIOTECH"
    ]
  ],
  [
    2,
    "Easy",
    "The molecule that carries genetic information in most organisms is:",
    "DNA",
    [
      "Starch",
      "Cellulose",
      "Cholesterol"
    ],
    "DNA stores hereditary information in genes.",
    [
      "DNA-GENETIC-MATERIAL"
    ]
  ],
  [
    2,
    "Easy",
    "A segment of DNA that carries information for a trait or product is a:",
    "Gene",
    [
      "Tissue",
      "Hormone",
      "Mineral"
    ],
    "Genes are functional segments of DNA that carry hereditary information.",
    [
      "GENE-DNA-SEGMENT"
    ]
  ],
  [
    2,
    "Medium",
    "Genetic engineering involves:",
    "Deliberately modifying an organism's genetic material",
    [
      "Changing only its diet",
      "Changing only environmental temperature",
      "Classifying it into a kingdom"
    ],
    "Genetic engineering changes DNA to introduce, remove or alter genetic information.",
    [
      "GENETIC-ENGINEERING-DEFINITION"
    ]
  ],
  [
    2,
    "Medium",
    "Why can a gene from one organism sometimes function in another organism?",
    "The genetic code is nearly universal",
    [
      "All organisms have identical genomes",
      "Genes contain no chemical information",
      "Proteins are made without RNA"
    ],
    "Because the genetic code is highly conserved, many genes can be read and expressed in different organisms.",
    [
      "UNIVERSAL-GENETIC-CODE"
    ]
  ],
  [
    2,
    "Medium",
    "A gene inserted into a bacterium so the bacterium produces a new protein is called:",
    "A recombinant-DNA application",
    [
      "Natural selection only",
      "Taxonomic classification",
      "Ecological succession"
    ],
    "Introducing a foreign gene into a host is a standard recombinant-DNA technique.",
    [
      "GENE-INSERTION-RECOMBINANT"
    ]
  ],
  [
    2,
    "Hard",
    "A bacterium receives a human insulin gene and begins producing insulin. Which step most directly changed the bacterium's capability?",
    "Insertion of new genetic information",
    [
      "Changing its species name",
      "Adding more water",
      "Lowering the room light"
    ],
    "The introduced insulin gene provides instructions for making the human protein.",
    [
      "INSULIN-GENE-CAPABILITY"
    ]
  ],
  [
    3,
    "Easy",
    "Restriction enzymes are used in genetic engineering to:",
    "Cut DNA at specific sequences",
    [
      "Join DNA fragments",
      "Copy entire chromosomes by themselves",
      "Translate RNA into protein"
    ],
    "Restriction endonucleases recognize particular DNA sequences and cut the DNA.",
    [
      "RESTRICTION-ENZYME-CUT"
    ]
  ],
  [
    3,
    "Easy",
    "DNA ligase is used to:",
    "Join DNA fragments",
    [
      "Cut DNA",
      "Destroy plasmids",
      "Make ATP from light"
    ],
    "DNA ligase forms bonds that connect DNA fragments.",
    [
      "DNA-LIGASE-JOIN"
    ]
  ],
  [
    3,
    "Medium",
    "Recombinant DNA is DNA that:",
    "Contains genetic material combined from different sources",
    [
      "Contains no genes",
      "Is found only in viruses",
      "Cannot replicate"
    ],
    "Recombinant DNA is constructed by joining DNA sequences from different sources.",
    [
      "RECOMBINANT-DNA-DEFINITION"
    ]
  ]
] as const;
