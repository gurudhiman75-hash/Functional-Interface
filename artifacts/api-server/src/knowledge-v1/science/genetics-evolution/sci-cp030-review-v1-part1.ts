import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp030ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp030ReviewSpec[] = [
  [
    1,
    "Easy",
    "The transmission of traits from parents to offspring is called:",
    "Heredity",
    [
      "Respiration",
      "Digestion",
      "Excretion"
    ],
    "Heredity is the passing of biological traits from one generation to the next. This continuity of inherited information explains why offspring resemble their parents while still showing variation.",
    [
      "HEREDITY-DEFINITION"
    ]
  ],
  [
    1,
    "Easy",
    "The basic unit of heredity is the:",
    "Gene",
    [
      "Neuron",
      "Nephron",
      "Alveolus"
    ],
    "A gene is a unit of heredity located on DNA and influences a trait or biological function. Genes usually influence traits by directing the production or regulation of functional molecules in cells.",
    [
      "GENE-UNIT"
    ]
  ],
  [
    1,
    "Medium",
    "Genes are located on:",
    "Chromosomes",
    [
      "Ribosomes only",
      "Cell walls",
      "Lysosomes only"
    ],
    "Genes are segments of DNA arranged along chromosomes. Chromosomes therefore organize many genes into larger DNA-containing structures that can be copied and inherited.",
    [
      "GENES-CHROMOSOMES"
    ]
  ],
  [
    1,
    "Medium",
    "Chromosomes are found in the nucleus of most human body cells and are made largely of:",
    "DNA and proteins",
    [
      "Only carbohydrates",
      "Only fats",
      "Cellulose"
    ],
    "Chromosomes consist of DNA linked to proteins. Proteins help package and organize the long DNA molecule so it can fit within the nucleus.",
    [
      "GENETICS-CHROMOSOME-COMPOSITION"
    ]
  ],
  [
    1,
    "Medium",
    "Different forms of the same gene are called:",
    "Alleles",
    [
      "Antigens",
      "Enzymes",
      "Hormones"
    ],
    "Alleles are alternative versions of a gene at the same genetic locus. Different alleles can produce different versions or levels of a trait controlled by that gene.",
    [
      "ALLELES-DEFINITION"
    ]
  ],
  [
    1,
    "Hard",
    "Two siblings have the same parents but differ in several inherited traits. Which statement best explains this?",
    "They can inherit different combinations of parental alleles",
    [
      "All siblings receive identical allele combinations",
      "Inherited traits are decided only by diet",
      "Genes are absent in gametes"
    ],
    "Sexual reproduction produces different combinations of alleles, so siblings need not be genetically identical. Independent assortment and recombination help create a different genetic combination in each sibling.",
    [
      "SIBLING-VARIATION"
    ]
  ],
  [
    2,
    "Easy",
    "Gregor Mendel carried out his famous inheritance experiments on:",
    "Pea plants",
    [
      "Wheat only",
      "Fruit flies",
      "Bacteria"
    ],
    "Mendel used garden pea plants because they had clear contrasting traits and could be crossed in controlled ways. Pea flowers can also be self-pollinated or cross-pollinated, making controlled inheritance experiments practical.",
    [
      "MENDEL-PEA"
    ]
  ],
  [
    2,
    "Easy",
    "Mendel is commonly called the father of:",
    "Genetics",
    [
      "Ecology",
      "Anatomy",
      "Microbiology"
    ],
    "Mendel's experiments established basic laws of inheritance and earned him the title father of genetics. His conclusions later became the foundation for understanding genes, alleles and predictable inheritance patterns.",
    [
      "MENDEL-FATHER-GENETICS"
    ]
  ],
  [
    2,
    "Medium",
    "Why were pea plants useful for Mendel's experiments?",
    "They had easily distinguishable contrasting traits",
    [
      "They produced no offspring",
      "They had no chromosomes",
      "They could reproduce only asexually"
    ],
    "Traits such as tall versus dwarf were clear and easy to track across generations. Clear contrasting forms made it easier to count offspring and identify recurring inheritance ratios.",
    [
      "PEA-CONTRASTING-TRAITS"
    ]
  ],
  [
    2,
    "Medium",
    "In a monohybrid cross, Mendel studied inheritance of:",
    "One pair of contrasting traits",
    [
      "All traits at once",
      "Only sex chromosomes",
      "Only acquired characters"
    ],
    "A monohybrid cross focuses on one character with contrasting forms. Following only one character at a time made the inheritance pattern easier to recognize and analyse.",
    [
      "MONOHYBRID-DEFINITION"
    ]
  ],
  [
    2,
    "Medium",
    "Mendel's work showed that hereditary factors are passed:",
    "As discrete units rather than blending permanently",
    [
      "Only through food",
      "Only from the mother",
      "Only after birth"
    ],
    "Mendel's results supported particulate inheritance, now explained by genes and alleles. This explained why a recessive trait could disappear in one generation and reappear in the next.",
    [
      "MENDEL-DISCRETE-FACTORS"
    ]
  ],
  [
    2,
    "Hard",
    "Mendel crossed pure tall peas with pure dwarf peas and all F1 plants were tall. What did this indicate?",
    "Tallness was dominant over dwarfness",
    [
      "Dwarfness disappeared permanently from heredity",
      "Height was controlled only by soil",
      "The F1 plants had no dwarf allele"
    ],
    "The dwarf allele was still present in F1 plants but was masked by the dominant tall allele. Because the recessive allele remained present, it could be passed to the next generation despite being hidden.",
    [
      "MENDEL-F1-DOMINANCE"
    ]
  ],
  [
    3,
    "Easy",
    "A trait expressed in a heterozygous individual is called:",
    "Dominant",
    [
      "Recessive",
      "Acquired",
      "Vestigial"
    ],
    "A dominant allele can determine the phenotype even when only one copy is present. Dominance describes expression in the heterozygous condition, not whether an allele is common in a population.",
    [
      "DOMINANT-DEFINITION"
    ]
  ],
  [
    3,
    "Easy",
    "A recessive trait is expressed when:",
    "No dominant allele is present",
    [
      "At least one dominant allele is present",
      "Only environmental factors act",
      "Both chromosomes are absent"
    ],
    "In simple Mendelian inheritance, a recessive phenotype appears when both alleles are recessive. A single dominant allele would mask the recessive allele in the phenotype.",
    [
      "RECESSIVE-EXPRESSION"
    ]
  ],
  [
    3,
    "Medium",
    "If T is dominant for tallness and t is recessive for dwarfness, which genotype is heterozygous tall?",
    "Tt",
    [
      "TT",
      "tt",
      "T only"
    ],
    "Tt contains two different alleles and is tall because T is dominant. The genotype has one dominant and one recessive allele, so it is heterozygous rather than pure-breeding.",
    [
      "HETEROZYGOUS-TALL"
    ]
  ]
] as const;
