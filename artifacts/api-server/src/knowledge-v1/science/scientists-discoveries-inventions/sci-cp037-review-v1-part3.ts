import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp037ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp037ReviewSpec[] = [
  [
    6,
    "Easy",
    "The theory of evolution by natural selection is most closely associated with:",
    "Charles Darwin",
    [
      "Gregor Mendel",
      "Louis Pasteur",
      "Edward Jenner"
    ],
    "Darwin developed the theory of evolution by natural selection, with Alfred Russel Wallace independently reaching a similar idea.",
    [
      "DARWIN-NATURAL-SELECTION"
    ]
  ],
  [
    6,
    "Easy",
    "Gregor Mendel is known for experiments on:",
    "Inheritance in pea plants",
    [
      "X-rays",
      "Electric current",
      "Vaccination"
    ],
    "Mendel's pea experiments established basic principles of inheritance.",
    [
      "MENDEL-PEA-INHERITANCE"
    ]
  ],
  [
    6,
    "Medium",
    "Who independently developed the idea of natural selection at about the same time as Darwin?",
    "Alfred Russel Wallace",
    [
      "Robert Hooke",
      "James Chadwick",
      "John Dalton"
    ],
    "Wallace independently formulated natural selection, prompting the joint presentation of their ideas.",
    [
      "WALLACE-NATURAL-SELECTION"
    ]
  ],
  [
    6,
    "Medium",
    "The double-helix model of DNA was proposed by:",
    "James Watson and Francis Crick",
    [
      "Gregor Mendel and Charles Darwin",
      "Robert Hooke and Leeuwenhoek",
      "Banting and Best"
    ],
    "Watson and Crick proposed the double-helix model using crucial experimental evidence from several researchers.",
    [
      "WATSON-CRICK-DOUBLE-HELIX"
    ]
  ],
  [
    6,
    "Medium",
    "Rosalind Franklin's X-ray diffraction work contributed importantly to understanding the:",
    "Structure of DNA",
    [
      "Law of motion",
      "Periodic table",
      "Smallpox vaccine"
    ],
    "Franklin's diffraction data provided key evidence about DNA's helical structure and dimensions.",
    [
      "FRANKLIN-DNA-XRAY"
    ]
  ],
  [
    6,
    "Hard",
    "Which statement best reflects the history of the DNA double-helix model?",
    "Watson and Crick proposed the model using evidence that included Franklin's X-ray diffraction data",
    [
      "Franklin alone invented DNA",
      "Mendel proposed the double helix from pea plants",
      "Darwin discovered DNA using fossils"
    ],
    "The model was proposed by Watson and Crick, while Franklin's experimental work was a crucial part of the evidence base.",
    [
      "DNA-ATTRIBUTION-NUANCE"
    ]
  ],
  [
    7,
    "Easy",
    "The first successful smallpox vaccine is associated with:",
    "Edward Jenner",
    [
      "Alexander Fleming",
      "Robert Koch",
      "William Harvey"
    ],
    "Jenner demonstrated vaccination against smallpox using material related to cowpox.",
    [
      "JENNER-SMALLPOX-VACCINE"
    ]
  ],
  [
    7,
    "Easy",
    "Penicillin was discovered by:",
    "Alexander Fleming",
    [
      "Edward Jenner",
      "Louis Pasteur",
      "Karl Landsteiner"
    ],
    "Fleming observed the antibacterial effect of Penicillium mould, leading to the discovery of penicillin.",
    [
      "FLEMING-PENICILLIN"
    ]
  ],
  [
    7,
    "Medium",
    "The circulation of blood through the body was described systematically by:",
    "William Harvey",
    [
      "Robert Hooke",
      "John Dalton",
      "Michael Faraday"
    ],
    "Harvey demonstrated that the heart pumps blood through a circulatory system.",
    [
      "HARVEY-BLOOD-CIRCULATION"
    ]
  ],
  [
    7,
    "Medium",
    "The ABO blood-group system was discovered by:",
    "Karl Landsteiner",
    [
      "Alexander Fleming",
      "Jonas Salk",
      "Edward Jenner"
    ],
    "Landsteiner identified the ABO blood groups, making safer transfusion matching possible.",
    [
      "LANDSTEINER-ABO"
    ]
  ],
  [
    7,
    "Medium",
    "The discovery and early therapeutic development of insulin is closely associated with Frederick Banting and:",
    "Charles Best",
    [
      "James Watt",
      "Robert Boyle",
      "Niels Bohr"
    ],
    "Banting and Best played central roles in the work that led to insulin treatment, with important contributions from their Toronto colleagues.",
    [
      "BANTING-BEST-INSULIN"
    ]
  ],
  [
    7,
    "Hard",
    "Which pair is correctly matched with a medical contribution?",
    "Landsteiner — ABO blood groups; Fleming — penicillin",
    [
      "Jenner — insulin; Banting — smallpox vaccine",
      "Harvey — X-rays; Röntgen — circulation",
      "Koch — periodic table; Mendeleev — tuberculosis bacterium"
    ],
    "Landsteiner identified ABO blood groups, while Fleming discovered penicillin's antibacterial effect.",
    [
      "MEDICAL-SCIENTIST-DISTINCTION"
    ]
  ],
  [
    8,
    "Easy",
    "The telephone is historically associated with:",
    "Alexander Graham Bell",
    [
      "Guglielmo Marconi",
      "John Logie Baird",
      "James Watt"
    ],
    "Bell is widely credited with key development and patenting of the telephone.",
    [
      "BELL-TELEPHONE"
    ]
  ],
  [
    8,
    "Easy",
    "Practical radio communication is closely associated with:",
    "Guglielmo Marconi",
    [
      "Alexander Graham Bell",
      "John Logie Baird",
      "Alfred Nobel"
    ],
    "Marconi developed and demonstrated practical wireless telegraphy systems.",
    [
      "MARCONI-RADIO"
    ]
  ],
  [
    8,
    "Medium",
    "Early practical television development is associated with:",
    "John Logie Baird",
    [
      "Thomas Edison",
      "James Watt",
      "Michael Faraday"
    ],
    "Baird demonstrated an early working television system using mechanical scanning.",
    [
      "BAIRD-TELEVISION"
    ]
  ]
] as const;
