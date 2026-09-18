import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp019ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_1: readonly SciCp019ReviewSpec[] = [
  [
    1,
    "Easy",
    "Who discovered cells while examining a thin slice of cork?",
    "Robert Hooke",
    [
      "Anton van Leeuwenhoek",
      "Robert Brown",
      "Theodor Schwann"
    ],
    "Robert Hooke observed box-like compartments in cork in 1665 and called them cells. His observation led to the use of the term 'cell' in biology.",
    [
      "CELL-DISCOVERY-HOOKE"
    ]
  ],
  [
    1,
    "Easy",
    "According to cell theory, which of the following statements is correct?",
    "All living organisms are made of cells",
    [
      "All cells contain chloroplasts",
      "Every cell has a cell wall",
      "Cells arise only in plants"
    ],
    "Cell theory states that living organisms are composed of cells and that the cell is the basic unit of life. It also recognizes that new cells arise from pre-existing cells.",
    [
      "CELL-THEORY-01"
    ]
  ],
  [
    1,
    "Medium",
    "A tissue is a group of:",
    "similar cells performing a common function",
    [
      "different organs forming a system",
      "organelles enclosed by one membrane",
      "unrelated cells with no shared role"
    ],
    "A tissue is formed when similar cells work together to perform a common function. Several tissues can combine to form an organ.",
    [
      "CELL-ORGANIZATION-TISSUE"
    ]
  ],
  [
    1,
    "Medium",
    "Which of the following shows the correct order of biological organization from simpler to more complex?",
    "Cell → Tissue → Organ → Organ system",
    [
      "Tissue → Cell → Organ system → Organ",
      "Cell → Organ → Tissue → Organ system",
      "Organ → Tissue → Cell → Organ system"
    ],
    "Cells form tissues, tissues form organs, and organs work together in organ systems. This is the usual order from simpler to more complex organization.",
    [
      "CELL-ORGANIZATION-ORDER"
    ]
  ],
  [
    1,
    "Medium",
    "Why is the cell called the structural and functional unit of life?",
    "Body structure and essential life processes are built around cells",
    [
      "Only cells contain water in living organisms",
      "Every cell can live independently outside the body",
      "Cells are larger than tissues and organs"
    ],
    "Living bodies are built from cells, and basic life processes such as respiration, transport and synthesis occur in or through cells. That is why the cell is both a structural and functional unit.",
    [
      "CELL-BASIC-UNIT"
    ]
  ],
  [
    1,
    "Hard",
    "Growth in an organism occurs through an increase in cell size and cell number. This best shows that:",
    "Cells are fundamental units of growth and organization",
    [
      "Only unicellular organisms can grow",
      "Growth occurs without any cellular change",
      "Organs are formed before cells"
    ],
    "Growth of an organism depends on cellular growth and cell division. This shows that changes at the cellular level underlie growth of tissues and organs.",
    [
      "CELL-GROWTH-UNIT"
    ]
  ],
  [
    2,
    "Easy",
    "Which of the following is absent in a typical prokaryotic cell?",
    "Membrane-bound nucleus",
    [
      "Cell membrane",
      "Ribosomes",
      "Cytoplasm"
    ],
    "Prokaryotic cells do not have a true nucleus enclosed by a nuclear membrane. Their genetic material lies in a nucleoid region, while cell membrane, cytoplasm and ribosomes are present.",
    [
      "PROK-NUCLEUS"
    ]
  ],
  [
    2,
    "Easy",
    "Bacteria are classified as prokaryotes because they lack:",
    "membrane-bound organelles",
    [
      "genetic material",
      "a plasma membrane",
      "ribosomes"
    ],
    "Bacteria contain DNA, ribosomes and a plasma membrane, but they lack membrane-bound organelles such as a nucleus and mitochondria. This is a defining prokaryotic feature.",
    [
      "PROK-ORGANELLES"
    ]
  ],
  [
    2,
    "Medium",
    "In a bacterial cell, the main genetic material is located in the:",
    "nucleoid",
    [
      "nucleolus",
      "Golgi apparatus",
      "mitochondrion"
    ],
    "A bacterial cell has no membrane-bound nucleus. Its main DNA molecule is concentrated in a region of the cytoplasm called the nucleoid.",
    [
      "PROK-NUCLEOID"
    ]
  ],
  [
    2,
    "Medium",
    "Which of the following is present in both prokaryotic and eukaryotic cells?",
    "Ribosomes",
    [
      "Nuclear membrane",
      "Mitochondria",
      "Golgi bodies"
    ],
    "Both prokaryotic and eukaryotic cells need ribosomes to make proteins. Membrane-bound organelles such as mitochondria and Golgi bodies occur only in eukaryotic cells.",
    [
      "PROK-EUK-RIBOSOME"
    ]
  ],
  [
    2,
    "Medium",
    "A cell has DNA, ribosomes, cytoplasm and a plasma membrane but no true nucleus. It is a:",
    "prokaryotic cell",
    [
      "plant eukaryotic cell",
      "animal eukaryotic cell",
      "fungal eukaryotic cell"
    ],
    "The absence of a true, membrane-bound nucleus is the key clue. A cell with DNA and ribosomes but no true nucleus is prokaryotic.",
    [
      "PROK-IDENTIFY"
    ]
  ],
  [
    2,
    "Hard",
    "A cell contains circular DNA and lacks membrane-bound organelles. Which other feature is expected?",
    "Its ribosomes are free in the cytoplasm",
    [
      "Its DNA is enclosed inside a nuclear envelope",
      "It contains chloroplasts with grana",
      "Its Golgi apparatus packages proteins"
    ],
    "Circular DNA and absence of membrane-bound organelles indicate a prokaryote. In such cells, ribosomes occur freely in the cytoplasm and carry out protein synthesis.",
    [
      "PROK-INTEGRATED"
    ]
  ],
  [
    3,
    "Easy",
    "Which cell structure regulates the movement of substances into and out of the cell?",
    "Plasma membrane",
    [
      "Nucleolus",
      "Centrosome",
      "Chromosome"
    ],
    "The plasma membrane forms the cell's selectively permeable boundary. It regulates the entry and exit of many substances.",
    [
      "MEMBRANE-SELECTIVE"
    ]
  ],
  [
    3,
    "Easy",
    "The plant cell wall is mainly composed of:",
    "cellulose",
    [
      "glycogen",
      "chitin only",
      "starch"
    ],
    "Plant cell walls are mainly composed of cellulose. The wall gives strength, support and shape to the cell.",
    [
      "CELL-WALL-CELLULOSE"
    ]
  ],
  [
    3,
    "Medium",
    "What happens when a raisin is kept in plain water for some time?",
    "It swells as water enters by osmosis",
    [
      "It shrinks as water leaves by osmosis",
      "It dissolves completely by diffusion",
      "It loses its cell wall"
    ],
    "Water moves into the raisin cells through a selectively permeable membrane by osmosis. As a result, the raisin swells.",
    [
      "OSMOSIS-RAISIN"
    ]
  ]
] as const;
