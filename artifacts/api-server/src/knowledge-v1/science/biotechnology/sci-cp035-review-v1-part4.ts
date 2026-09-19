import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp035ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp035ReviewSpec[] = [
  [
    8,
    "Medium",
    "Why are sterile conditions important in tissue culture?",
    "To prevent bacteria and fungi from overgrowing the culture",
    [
      "To remove all nutrients",
      "To stop plant cells dividing",
      "To increase dust"
    ],
    "Microbial contamination can quickly outgrow or damage the desired plant tissue.",
    [
      "TISSUE-CULTURE-STERILE"
    ]
  ],
  [
    8,
    "Medium",
    "Micropropagation is especially useful when growers need:",
    "Large numbers of uniform plants in a short time",
    [
      "Only one seed per year",
      "Plants with no cells",
      "Natural mutation in every plant"
    ],
    "Micropropagation can rapidly multiply selected plant material with similar characteristics.",
    [
      "MICROPROPAGATION"
    ]
  ],
  [
    8,
    "Hard",
    "A rare disease-free banana plant is multiplied into thousands of plants from small tissue pieces. Which technique is being used?",
    "Plant tissue culture or micropropagation",
    [
      "Natural selection",
      "Binomial nomenclature",
      "Nitrogen fixation"
    ],
    "Tissue culture allows rapid clonal multiplication from small pieces of selected plant tissue.",
    [
      "BANANA-MICROPROPAGATION"
    ]
  ],
  [
    9,
    "Easy",
    "DNA fingerprinting is used to compare:",
    "Patterns in DNA",
    [
      "Bone length only",
      "Blood pressure",
      "Soil pH"
    ],
    "DNA fingerprinting examines variable DNA regions to compare biological samples.",
    [
      "DNA-FINGERPRINTING-DEFINITION"
    ]
  ],
  [
    9,
    "Medium",
    "A biological sample from a crime scene is compared with samples from several individuals. Which biotechnology method is designed for this type of identification?",
    "DNA fingerprinting",
    [
      "Tissue culture",
      "Fermentation",
      "Nitrogen fixation"
    ],
    "DNA fingerprinting compares variable DNA patterns and is widely used to match biological samples in forensic investigations.",
    [
      "DNA-FINGERPRINTING-FORENSIC"
    ]
  ],
  [
    9,
    "Medium",
    "Why can DNA fingerprinting distinguish most unrelated people?",
    "Certain DNA regions vary among individuals",
    [
      "Everyone has exactly the same DNA sequence",
      "DNA contains no inherited variation",
      "Only proteins differ"
    ],
    "Variable regions of DNA create characteristic profiles that usually differ among unrelated individuals.",
    [
      "DNA-FINGERPRINTING-VARIATION"
    ]
  ],
  [
    9,
    "Medium",
    "DNA fingerprinting can help establish biological relationships because:",
    "DNA patterns are inherited from parents",
    [
      "DNA is determined by diet",
      "Fingerprints change DNA",
      "Only environmental traits are compared"
    ],
    "Children inherit DNA from both parents, so shared markers can support relationship testing.",
    [
      "DNA-PARENTAGE"
    ]
  ],
  [
    9,
    "Hard",
    "A crime-scene sample is degraded and contains little DNA. Which combination is most useful before DNA-profile comparison?",
    "PCR amplification followed by DNA analysis",
    [
      "Taxonomic naming followed by microscopy",
      "Fermentation followed by composting",
      "Photosynthesis followed by respiration"
    ],
    "PCR can amplify small amounts of DNA so variable regions can be analysed.",
    [
      "PCR-DNA-FINGERPRINT-COMBINATION"
    ]
  ],
  [
    9,
    "Hard",
    "Identical twins are difficult to distinguish with standard DNA fingerprinting because they:",
    "Have nearly identical inherited DNA profiles",
    [
      "Have no DNA",
      "Belong to different species",
      "Always have different blood groups"
    ],
    "Identical twins originate from the same zygote and therefore share nearly the same nuclear DNA sequence.",
    [
      "IDENTICAL-TWINS-DNA"
    ]
  ],
  [
    10,
    "Easy",
    "Which biotechnology tool–function pair is correctly matched?",
    "DNA ligase — joins DNA fragments",
    [
      "Restriction enzyme — joins DNA fragments",
      "PCR — destroys DNA",
      "Plasmid — protein enzyme"
    ],
    "DNA ligase joins DNA fragments by forming phosphodiester bonds.",
    [
      "MATCH-LIGASE-JOIN"
    ]
  ],
  [
    10,
    "Medium",
    "Which sequence best represents a simple recombinant-DNA workflow?",
    "Cut DNA → join target gene to vector → introduce vector into host → select transformed cells",
    [
      "Translate protein → remove DNA → classify host → cut vector",
      "Join cells → remove genes → stop growth → add sunlight",
      "PCR → composting → pollination → cloning"
    ],
    "A typical workflow cuts DNA, constructs a recombinant vector, transfers it to a host and identifies transformed cells.",
    [
      "RECOMBINANT-WORKFLOW"
    ]
  ],
  [
    10,
    "Medium",
    "Why is a vector needed when producing a recombinant protein in bacteria?",
    "It carries the target gene into the bacterial host",
    [
      "It supplies sunlight",
      "It replaces all bacterial DNA",
      "It measures protein mass"
    ],
    "The vector delivers the gene so the host can replicate and potentially express it.",
    [
      "VECTOR-TARGET-GENE-HOST"
    ]
  ],
  [
    10,
    "Medium",
    "Which technique is most directly used when many copies of a specific DNA segment are needed quickly?",
    "PCR",
    [
      "Tissue culture",
      "Fermentation only",
      "Microscopy"
    ],
    "PCR selectively amplifies a chosen DNA sequence.",
    [
      "PCR-CHOICE"
    ]
  ],
  [
    10,
    "Hard",
    "A plasmid carries the desired gene but lacks a suitable promoter for expression in the host. What problem is most likely?",
    "The gene may be present but poorly expressed or not expressed",
    [
      "The plasmid must become a chromosome",
      "DNA ligase will stop existing",
      "The host automatically becomes a plant"
    ],
    "A promoter is needed to initiate transcription; without a suitable promoter, gene expression may fail.",
    [
      "PROMOTER-EXPRESSION-REASONING"
    ]
  ],
  [
    10,
    "Hard",
    "A farmer wants many genetically uniform, disease-free copies of an elite plant, while a laboratory wants millions of copies of one DNA fragment. Which techniques fit respectively?",
    "Tissue culture and PCR",
    [
      "PCR and tissue culture",
      "DNA fingerprinting and fermentation",
      "Restriction digestion and composting"
    ],
    "Tissue culture multiplies plant material, while PCR amplifies a selected DNA sequence.",
    [
      "TISSUE-CULTURE-VS-PCR"
    ]
  ]
] as const;
