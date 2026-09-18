import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp019ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_4: readonly SciCp019ReviewSpec[] = [
  [
    8,
    "Medium",
    "Before a cell divides by mitosis, its DNA is copied mainly so that:",
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
    "Which statement correctly compares mitosis and meiosis?",
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
    "A species has 20 chromosomes in each body cell. How many chromosomes would normally be present in one gamete?",
    "10",
    [
      "20",
      "30",
      "40"
    ],
    "Gametes are produced by meiosis and normally contain half the diploid chromosome number. Half of 20 is 10.",
    [
      "MEIOSIS-COUNT"
    ]
  ],
  [
    9,
    "Easy",
    "Which structure is found in both a typical plant cell and a typical animal cell?",
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
    "A cell contains chloroplasts, a cellulose wall and a large central vacuole. It is most likely a:",
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
    "A cell makes many digestive enzymes and exports them outside the cell. Which organelles would be especially well developed?",
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
    "A cell is unable to produce enough ATP even though glucose and oxygen are available. Which organelle is most likely malfunctioning?",
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
    "A plant cell can synthesize proteins normally but cannot package them into vesicles for secretion. Which organelle is most likely defective?",
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
    "A cell has ribosomes, DNA and a plasma membrane, but lacks both mitochondria and a membrane-bound nucleus. Which classification best fits it?",
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
    "Which instrument made the discovery and detailed study of cells possible?",
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
    "Amoeba performs nutrition, respiration and excretion within a single cell. This shows that:",
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
    "Why are most cells microscopic rather than extremely large?",
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
    "Which observation best distinguishes a eukaryotic cell from a prokaryotic cell under a suitable microscope?",
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
    "A student observes four cells. Only one has a cell wall, chloroplasts and a membrane-bound nucleus. Which type is it?",
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
    "A cell's ribosomes are suddenly inactivated while its DNA and membranes remain intact. Which immediate effect is most likely?",
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
