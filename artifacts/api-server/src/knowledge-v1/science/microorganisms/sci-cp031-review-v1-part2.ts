import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp031ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp031ReviewSpec[] = [
  [
    3,
    "Medium",
    "Why does bread mould grow well on moist bread?",
    "Moisture and organic nutrients favour fungal growth",
    [
      "Dryness stimulates all fungi",
      "Bread has no nutrients",
      "Fungi require direct sunlight"
    ],
    "Fungi grow well where moisture and suitable organic nutrients are available.",
    [
      "MOULD-MOIST-BREAD"
    ]
  ],
  [
    3,
    "Medium",
    "Many fungi reproduce and spread using:",
    "Spores",
    [
      "Seeds",
      "Eggs only",
      "Red blood cells"
    ],
    "Fungal spores can disperse through air or other routes and grow when conditions become favourable.",
    [
      "FUNGI-SPORES"
    ]
  ],
  [
    3,
    "Hard",
    "A mould disappears from visible growth after food is dried but grows again when moisture returns. What best explains this?",
    "Fungal spores can survive and germinate when conditions improve",
    [
      "Drying creates new fungal genes instantly",
      "Fungi turn into bacteria during dryness",
      "Food begins producing mould cells itself"
    ],
    "Resistant or dormant spores may remain and later germinate when moisture and nutrients are suitable.",
    [
      "FUNGAL-SPORE-REASONING"
    ]
  ],
  [
    4,
    "Easy",
    "Amoeba belongs to the group:",
    "Protozoa",
    [
      "Fungi",
      "Bacteria",
      "Viruses"
    ],
    "Amoeba is a unicellular protozoan.",
    [
      "AMOEBA-PROTOZOA"
    ]
  ],
  [
    4,
    "Easy",
    "Paramecium moves using:",
    "Cilia",
    [
      "Roots",
      "Wings",
      "Hyphae"
    ],
    "Paramecium is covered with many tiny cilia that beat to move the cell.",
    [
      "PARAMECIUM-CILIA"
    ]
  ],
  [
    4,
    "Medium",
    "Amoeba moves and captures food using:",
    "Pseudopodia",
    [
      "Flagella only",
      "Hyphae",
      "Spores"
    ],
    "Amoeba extends temporary projections called pseudopodia for movement and feeding.",
    [
      "AMOEBA-PSEUDOPODIA"
    ]
  ],
  [
    4,
    "Medium",
    "Protozoa differ from bacteria because protozoa:",
    "Have a true nucleus",
    [
      "Have no genetic material",
      "Are always multicellular",
      "Cannot live in water"
    ],
    "Protozoa are eukaryotic cells with a membrane-bound nucleus, unlike bacteria.",
    [
      "PROTOZOA-EUKARYOTIC"
    ]
  ],
  [
    4,
    "Medium",
    "Which statement about protozoa is correct?",
    "Many are single-celled eukaryotes",
    [
      "All are plants",
      "All are bacteria",
      "All make their own food"
    ],
    "Protozoa are generally unicellular eukaryotic organisms with varied modes of life.",
    [
      "PROTOZOA-UNICELLULAR-EUKARYOTE"
    ]
  ],
  [
    4,
    "Hard",
    "A microscopic cell has a nucleus and changes shape by forming pseudopodia. Which organism is the best match?",
    "Amoeba",
    [
      "Lactobacillus",
      "Yeast with budding only",
      "Bacteriophage"
    ],
    "Amoeba is a nucleated protozoan that forms pseudopodia for movement and feeding.",
    [
      "AMOEBA-IDENTIFY"
    ]
  ],
  [
    5,
    "Easy",
    "Which pigment enables many algae to photosynthesize?",
    "Chlorophyll",
    [
      "Haemoglobin",
      "Melanin",
      "Keratin"
    ],
    "Many algae contain chlorophyll and can manufacture food by photosynthesis.",
    [
      "ALGAE-CHLOROPHYLL"
    ]
  ],
  [
    5,
    "Easy",
    "Viruses can reproduce only when they are:",
    "Inside suitable living host cells",
    [
      "In pure water alone",
      "On dry glass",
      "In soil without cells"
    ],
    "Viruses depend on the machinery of living host cells for replication.",
    [
      "VIRUS-HOST-CELL"
    ]
  ],
  [
    5,
    "Medium",
    "Cyanobacteria are often called blue-green algae in older school texts, but they are actually:",
    "Bacteria",
    [
      "Fungi",
      "Protozoa",
      "Viruses"
    ],
    "Cyanobacteria are photosynthetic prokaryotes and belong to the bacteria.",
    [
      "CYANOBACTERIA-BACTERIA"
    ]
  ],
  [
    5,
    "Medium",
    "Why are viruses described as acellular?",
    "They are not made of cells",
    [
      "They contain no genetic material",
      "They are always harmless",
      "They are larger than fungi"
    ],
    "Viruses consist of genetic material enclosed in a protein coat or related structure rather than a cellular body.",
    [
      "VIRUS-ACELLULAR"
    ]
  ],
  [
    5,
    "Medium",
    "A bacteriophage infects:",
    "Bacteria",
    [
      "Only plants",
      "Only fungi",
      "Only human red blood cells"
    ],
    "Bacteriophages are viruses whose hosts are bacterial cells.",
    [
      "BACTERIOPHAGE-BACTERIA"
    ]
  ],
  [
    5,
    "Hard",
    "An agent contains genetic material in a protein coat but cannot reproduce independently outside a host cell. It is most likely a:",
    "Virus",
    [
      "Bacterium",
      "Fungus",
      "Protozoan"
    ],
    "Dependence on host-cell machinery and an acellular structure are characteristic of viruses.",
    [
      "VIRUS-IDENTIFY"
    ]
  ]
] as const;
