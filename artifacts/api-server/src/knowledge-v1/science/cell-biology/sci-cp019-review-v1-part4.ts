import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp019ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_4: readonly SciCp019ReviewSpec[] = [
  [
    8,
    "Medium",
    "Why is DNA replicated before mitosis?",
    "each daughter cell can receive a complete set of genetic information",
    [
      "the cell wall can become chlorophyll",
      "ribosomes can turn into chromosomes",
      "water can enter by osmosis"
    ],
    "DNA replication produces a copy of the genetic material before nuclear division. This allows each daughter cell to receive a complete set of chromosomes.",
    [
      "DNA-BEFORE-DIVISION"
    ]
  ],
  [
    8,
    "Medium",
    "Which statement correctly distinguishes mitosis from meiosis?",
    "Mitosis usually maintains chromosome number, while meiosis reduces it by half",
    [
      "Both always reduce chromosome number by half",
      "Mitosis forms gametes only, while meiosis repairs tissues",
      "Meiosis always produces two identical daughter cells"
    ],
    "Mitosis generally preserves chromosome number in body cells, whereas meiosis reduces the number by half when gametes are formed. Their biological roles are therefore different.",
    [
      "MITOSIS-MEIOSIS-COMPARE"
    ]
  ],
  [
    8,
    "Hard",
    "If a species has 20 chromosomes in each body cell, how many chromosomes will normally be present in a gamete?",
    "10",
    [
      "20",
      "30",
      "40"
    ],
    "Gametes are produced by meiosis and normally contain half the diploid chromosome number. Half of 20 is 10. This halving allows fertilization to restore the normal diploid chromosome number.",
    [
      "MEIOSIS-COUNT"
    ]
  ],
  [
    9,
    "Easy",
    "Which organelle is commonly present in both plant and animal cells?",
    "Mitochondrion",
    [
      "Cellulose cell wall",
      "Chloroplast",
      "Large central vacuole only"
    ],
    "Both plant and animal cells are eukaryotic and commonly contain mitochondria. Cellulose walls and chloroplasts are characteristic of plant cells.",
    [
      "PLANT-ANIMAL-SHARED"
    ]
  ],
  [
    9,
    "Medium",
    "A cell has chloroplasts, a cellulose cell wall and a large central vacuole. It is a:",
    "plant cell",
    [
      "animal cell",
      "typical bacterial cell",
      "mammalian red blood cell"
    ],
    "Chloroplasts and a cellulose cell wall are strong indicators of a plant cell. A large central vacuole is another common plant-cell feature.",
    [
      "PLANT-IDENTIFY"
    ]
  ],
  [
    9,
    "Medium",
    "A cell actively produces and secretes large amounts of protein enzymes. Which organelles would be especially well developed?",
    "Rough ER and Golgi apparatus",
    [
      "Cell wall and chloroplasts",
      "Centrosome and chromosome only",
      "Large vacuole and nucleolus only"
    ],
    "Protein enzymes for secretion are made on ribosomes of rough ER and then modified and packaged by the Golgi apparatus. Cells specialized for protein secretion therefore have extensive rough ER and Golgi.",
    [
      "SECRETORY-CELL"
    ]
  ],
  [
    9,
    "Medium",
    "A cell has adequate glucose and oxygen but produces very little ATP. Which organelle is most likely defective?",
    "Mitochondrion",
    [
      "Golgi apparatus",
      "Nucleolus",
      "Cell wall"
    ],
    "Aerobic respiration that generates most cellular ATP occurs in mitochondria. A mitochondrial defect can therefore reduce ATP production despite adequate glucose and oxygen.",
    [
      "MITO-MALFUNCTION"
    ]
  ],
  [
    9,
    "Hard",
    "A plant cell synthesizes proteins normally but cannot package them into vesicles for secretion. Which organelle is defective?",
    "Golgi apparatus",
    [
      "Ribosome",
      "Chloroplast",
      "Cell wall"
    ],
    "Normal protein synthesis indicates that ribosomes are functioning. Failure in modification and vesicle packaging points most directly to the Golgi apparatus.",
    [
      "GOLGI-INFERENCE"
    ]
  ],
  [
    9,
    "Hard",
    "A cell contains DNA, ribosomes and a plasma membrane but lacks mitochondria and a membrane-bound nucleus. It is a:",
    "Prokaryotic cell",
    [
      "Plant eukaryotic cell",
      "Animal eukaryotic cell",
      "Fungal eukaryotic cell"
    ],
    "The absence of a membrane-bound nucleus and mitochondria is characteristic of prokaryotes. Prokaryotic cells still contain DNA, ribosomes and a plasma membrane.",
    [
      "PROK-INFERENCE"
    ]
  ],
  [
    10,
    "Easy",
    "Which instrument is used to observe cells that cannot be seen clearly with the naked eye?",
    "Microscope",
    [
      "Barometer",
      "Calorimeter",
      "Ammeter"
    ],
    "Most cells are too small to be seen clearly with the unaided eye. Microscopes provide the magnification needed to observe cellular structures.",
    [
      "MICROSCOPE-CELL"
    ]
  ],
  [
    10,
    "Medium",
    "Amoeba carries out nutrition, respiration and excretion within a single cell. This shows that:",
    "one cell can carry out all essential life processes",
    [
      "all organisms are unicellular",
      "unicellular organisms have no genetic material",
      "cells cannot function independently"
    ],
    "Amoeba is unicellular, so one cell performs all the functions needed for its survival. This demonstrates that a single cell can be a complete living organism.",
    [
      "UNICELLULAR-AMOEBA"
    ]
  ],
  [
    10,
    "Medium",
    "Why are most cells microscopic rather than very large?",
    "A smaller size helps maintain an effective surface-area-to-volume relationship",
    [
      "Large cells cannot contain DNA",
      "Only small cells can have a plasma membrane",
      "Mitochondria exist only in microscopic cells"
    ],
    "As a cell becomes larger, its volume increases faster than its surface area. Smaller cells generally exchange materials with their surroundings more efficiently relative to their volume.",
    [
      "SA-VOL"
    ]
  ],
  [
    10,
    "Medium",
    "Which feature best distinguishes a eukaryotic cell from a prokaryotic cell?",
    "A nucleus enclosed by a membrane",
    [
      "Presence of cytoplasm",
      "Presence of a plasma membrane",
      "Presence of ribosomes"
    ],
    "Both cell types have cytoplasm, a plasma membrane and ribosomes. A membrane-bound nucleus is a defining feature of eukaryotic cells.",
    [
      "MICRO-EUK"
    ]
  ],
  [
    10,
    "Hard",
    "A cell has a cell wall, chloroplasts and a membrane-bound nucleus. It is a:",
    "Plant eukaryotic cell",
    [
      "Animal eukaryotic cell",
      "Typical bacterial cell",
      "Mammalian red blood cell"
    ],
    "A membrane-bound nucleus shows the cell is eukaryotic, while chloroplasts and a cell wall identify it as plant. The combination of all three features is characteristic of a plant eukaryotic cell.",
    [
      "MIXED-IDENTIFY"
    ]
  ],
  [
    10,
    "Hard",
    "If ribosomes in a cell stop functioning, which immediate effect will occur?",
    "New protein synthesis will stop",
    [
      "Osmosis through the plasma membrane will stop completely",
      "Existing DNA will disappear at once",
      "The cell wall will instantly dissolve"
    ],
    "Ribosomes are the sites where amino acids are assembled into proteins. If ribosomes stop functioning, production of new proteins is directly halted.",
    [
      "RIBOSOME-INACT"
    ]
  ]
] as const;
