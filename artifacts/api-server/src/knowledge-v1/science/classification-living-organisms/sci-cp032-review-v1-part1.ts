import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp032ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp032ReviewSpec[] = [
  [
    1,
    "Easy",
    "The science of naming and classifying organisms is called:",
    "Taxonomy",
    [
      "Physiology",
      "Ecology",
      "Anatomy"
    ],
    "Taxonomy deals with identification, naming and classification of organisms.",
    [
      "TAXONOMY-DEFINITION"
    ]
  ],
  [
    1,
    "Easy",
    "Which is the basic unit of biological classification?",
    "Species",
    [
      "Kingdom",
      "Phylum",
      "Class"
    ],
    "Species is the basic taxonomic unit and groups organisms that are most closely related.",
    [
      "SPECIES-BASIC-UNIT"
    ]
  ],
  [
    1,
    "Medium",
    "Which sequence shows the correct order from broader to more specific categories?",
    "Kingdom → Phylum → Class → Order → Family → Genus → Species",
    [
      "Species → Genus → Family → Order → Class → Phylum → Kingdom",
      "Kingdom → Class → Phylum → Family → Order → Genus → Species",
      "Phylum → Kingdom → Class → Order → Family → Species → Genus"
    ],
    "The standard hierarchy becomes progressively more specific from kingdom down to species.",
    [
      "TAXONOMIC-HIERARCHY"
    ]
  ],
  [
    1,
    "Medium",
    "In the scientific name Homo sapiens, Homo represents the:",
    "Genus",
    [
      "Species epithet only",
      "Family",
      "Order"
    ],
    "In binomial nomenclature, the first word is the genus name and the second is the specific epithet.",
    [
      "BINOMIAL-GENUS"
    ]
  ],
  [
    1,
    "Medium",
    "Why is binomial nomenclature useful?",
    "It gives each species a standardized scientific name",
    [
      "It replaces all classification levels",
      "It uses only local common names",
      "It groups all organisms into one genus"
    ],
    "Scientific names reduce confusion caused by different common names in different languages and regions.",
    [
      "BINOMIAL-USE"
    ]
  ],
  [
    1,
    "Hard",
    "Two organisms belong to the same genus but different species. What can be inferred?",
    "They are closely related but not the same species",
    [
      "They must be identical in all traits",
      "They belong to different kingdoms",
      "They cannot share any ancestry"
    ],
    "Sharing a genus indicates relatively close taxonomic relationship, but different species names show they are distinct species.",
    [
      "SAME-GENUS-DIFFERENT-SPECIES"
    ]
  ],
  [
    2,
    "Easy",
    "Who proposed the five-kingdom classification widely taught in school biology?",
    "R. H. Whittaker",
    [
      "Charles Darwin",
      "Gregor Mendel",
      "Robert Hooke"
    ],
    "R. H. Whittaker proposed the five-kingdom system in 1969.",
    [
      "WHITTAKER-FIVE-KINGDOM"
    ]
  ],
  [
    2,
    "Easy",
    "Which kingdom contains prokaryotic organisms in the five-kingdom system?",
    "Monera",
    [
      "Protista",
      "Fungi",
      "Animalia"
    ],
    "Monera includes prokaryotic organisms such as bacteria and cyanobacteria.",
    [
      "MONERA-PROKARYOTES"
    ]
  ],
  [
    2,
    "Medium",
    "Which kingdom contains many unicellular eukaryotes?",
    "Protista",
    [
      "Monera",
      "Plantae",
      "Animalia"
    ],
    "Protista includes many unicellular eukaryotic organisms such as Amoeba and Paramecium.",
    [
      "PROTISTA-UNICELLULAR-EUKARYOTES"
    ]
  ],
  [
    2,
    "Medium",
    "Which kingdom is characterized by absorptive heterotrophic nutrition and chitinous cell walls?",
    "Fungi",
    [
      "Plantae",
      "Animalia",
      "Monera only"
    ],
    "Fungi absorb nutrients from organic matter and generally have cell walls containing chitin.",
    [
      "FUNGI-KINGDOM-FEATURES"
    ]
  ],
  [
    2,
    "Medium",
    "Which feature most clearly separates Animalia from Plantae?",
    "Animals are heterotrophic and lack cell walls",
    [
      "Animals always have chlorophyll",
      "Plants lack cells",
      "Plants are all unicellular"
    ],
    "Animals obtain food from other organisms and their cells do not have rigid cell walls.",
    [
      "ANIMALIA-VS-PLANTAE"
    ]
  ],
  [
    2,
    "Hard",
    "An organism is multicellular, has cellulose cell walls and performs photosynthesis. In the five-kingdom system it belongs to:",
    "Plantae",
    [
      "Animalia",
      "Fungi",
      "Monera"
    ],
    "Multicellularity, cellulose cell walls and photosynthetic nutrition are characteristic of Plantae.",
    [
      "IDENTIFY-PLANTAE"
    ]
  ],
  [
    3,
    "Easy",
    "Bacteria are placed in Monera because they are:",
    "Prokaryotic",
    [
      "Multicellular animals",
      "Eukaryotic fungi",
      "Seed plants"
    ],
    "Bacteria lack a membrane-bound nucleus and are therefore prokaryotic.",
    [
      "MONERA-PROKARYOTIC"
    ]
  ],
  [
    3,
    "Easy",
    "Amoeba is commonly placed in:",
    "Protista",
    [
      "Monera",
      "Fungi",
      "Plantae"
    ],
    "Amoeba is a unicellular eukaryote and is traditionally placed in Protista.",
    [
      "AMOEBA-PROTISTA"
    ]
  ],
  [
    3,
    "Medium",
    "Which feature distinguishes Protista from Monera?",
    "Protists have a membrane-bound nucleus",
    [
      "Protists lack DNA",
      "Monerans are always multicellular",
      "Protists have no cell membrane"
    ],
    "Protists are eukaryotic, whereas monerans are prokaryotic.",
    [
      "PROTISTA-VS-MONERA"
    ]
  ]
] as const;
