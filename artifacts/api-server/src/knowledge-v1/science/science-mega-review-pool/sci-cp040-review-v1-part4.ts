import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp040ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp040ReviewSpec[] = [
  [
    8,
    "Medium",
    "A person with blood group O has which ABO antigens on red blood cells?",
    "Neither A nor B",
    [
      "A only",
      "B only",
      "both A and B"
    ],
    "In the ABO system, group O red blood cells lack both A and B surface antigens. Plasma typically contains antibodies against both A and B. This antigen pattern is why ABO compatibility matters in blood transfusion.",
    [
      "MEGA-ABO-O"
    ]
  ],
  [
    8,
    "Medium",
    "Variation within a species is important for natural selection because it:",
    "provides differences on which selection can act",
    [
      "makes all individuals identical",
      "prevents inheritance",
      "stops reproduction"
    ],
    "Natural selection requires heritable differences among individuals. Traits that improve reproductive success can become more common over generations. Without variation, natural selection would have little inherited diversity to favor.",
    [
      "MEGA-VARIATION-SELECTION"
    ]
  ],
  [
    8,
    "Hard",
    "A bacterial population becomes resistant after repeated antibiotic exposure. Which explanation is best?",
    "Resistant variants survive and reproduce more successfully",
    [
      "Every bacterium chooses to become resistant",
      "Antibiotics create identical mutations on demand",
      "Resistance is unrelated to selection"
    ],
    "Some bacteria may already carry resistance-conferring variation. Antibiotic exposure kills susceptible cells more readily, allowing resistant survivors to multiply. This is natural selection acting on a microbial population.",
    [
      "MEGA-RESISTANCE-SELECTION"
    ]
  ],
  [
    9,
    "Easy",
    "The ozone layer protects life by absorbing much of the Sun's:",
    "ultraviolet radiation",
    [
      "visible light",
      "radio waves",
      "sound"
    ],
    "Stratospheric ozone absorbs a large fraction of harmful ultraviolet radiation. This reduces UV exposure at Earth's surface. Ozone depletion therefore increases the amount of harmful UV reaching the surface.",
    [
      "MEGA-OZONE-UV"
    ]
  ],
  [
    9,
    "Medium",
    "Why are food chains usually short?",
    "Available energy decreases at higher trophic levels",
    [
      "Energy increases at each level",
      "Top predators create energy",
      "Producers contain no energy"
    ],
    "Only a fraction of energy passes from one trophic level to the next. Progressive energy loss limits how many higher levels can be supported. Energy pyramids remain upright because usable energy falls at each transfer.",
    [
      "MEGA-FOOD-CHAIN-LENGTH"
    ]
  ],
  [
    9,
    "Medium",
    "Which process removes carbon dioxide from the atmosphere and stores carbon in organic molecules?",
    "photosynthesis",
    [
      "respiration",
      "combustion",
      "denitrification"
    ],
    "Photosynthetic organisms take in carbon dioxide and convert its carbon into organic molecules using light energy. This transfers carbon from the atmosphere into biomass. Respiration and combustion return much of that carbon to the atmosphere.",
    [
      "MEGA-PHOTOSYNTHESIS-CARBON"
    ]
  ],
  [
    9,
    "Medium",
    "PCR is used in biotechnology to:",
    "make many copies of a selected DNA sequence",
    [
      "measure blood pressure",
      "grow whole plants directly",
      "separate sound frequencies"
    ],
    "Polymerase chain reaction amplifies a chosen DNA region through repeated cycles. It is useful when only a small amount of DNA is initially available. PCR is therefore valuable in diagnosis, research and forensic analysis.",
    [
      "MEGA-PCR"
    ]
  ],
  [
    9,
    "Hard",
    "A lake receives excess fertilizer, develops an algal bloom and later loses fish. What is the key link between the bloom and fish death?",
    "Decomposition of dead algae lowers dissolved oxygen",
    [
      "Algae turn water into acid instantly",
      "Fish stop using oxygen",
      "Fertilizer removes all water"
    ],
    "After a large bloom, dead algae are decomposed by microorganisms. Their respiration consumes dissolved oxygen, creating conditions that can kill fish. The key problem is not simply algae themselves but the later oxygen demand of decomposition.",
    [
      "MEGA-EUTROPHICATION"
    ]
  ],
  [
    9,
    "Hard",
    "Why can a genetically engineered bacterium produce a human protein such as insulin?",
    "The genetic code is nearly universal and the inserted gene can be expressed",
    [
      "Bacteria naturally contain every human gene",
      "Human proteins contain no genetic information",
      "DNA cannot function across species"
    ],
    "The genetic code is highly conserved, so bacterial cells can read many inserted human gene sequences. With suitable control elements, they can produce the encoded protein. Bacteria can act as biological factories when the gene is inserted and controlled correctly.",
    [
      "MEGA-RECOMBINANT-INSULIN"
    ]
  ],
  [
    10,
    "Easy",
    "Which scientist discovered the Raman effect?",
    "C. V. Raman",
    [
      "S. N. Bose",
      "Meghnad Saha",
      "J. C. Bose"
    ],
    "C. V. Raman discovered a change in wavelength when light is inelastically scattered by matter. The phenomenon is known as the Raman effect. His discovery became important for identifying molecular structure through Raman spectroscopy.",
    [
      "MEGA-RAMAN"
    ]
  ],
  [
    10,
    "Medium",
    "Which instrument should be used to measure humidity?",
    "hygrometer",
    [
      "barometer",
      "anemometer",
      "ammeter"
    ],
    "A hygrometer measures moisture in the air. A barometer measures pressure, an anemometer wind speed and an ammeter electric current. Humidity information is important in weather, comfort and evaporation studies.",
    [
      "MEGA-HYGROMETER"
    ]
  ],
  [
    10,
    "Medium",
    "Which statement is completely correct?",
    "Voltmeter measures potential difference and is connected in parallel",
    [
      "Ammeter measures voltage in parallel",
      "Barometer measures current",
      "Hygrometer measures pressure"
    ],
    "A voltmeter measures potential difference between two points and is connected in parallel. Its high resistance minimizes disturbance of the circuit. An ammeter, by contrast, measures current and is connected in series.",
    [
      "MEGA-VOLTMETER"
    ]
  ],
  [
    10,
    "Medium",
    "A person at high altitude finds that water boils earlier but food cooks more slowly. Why?",
    "Lower atmospheric pressure lowers the boiling temperature",
    [
      "Water gains extra heat",
      "Gravity becomes zero",
      "The boiling point rises sharply"
    ],
    "At high altitude, lower atmospheric pressure allows water to boil at a lower temperature. Boiling begins sooner, but the water is cooler, so cooking can take longer. Pressure changes with altitude, so boiling temperature changes as well.",
    [
      "MEGA-ALTITUDE-BOILING"
    ]
  ],
  [
    10,
    "Hard",
    "Which sequence correctly matches discovery or contribution?",
    "Thomson—electron; Rutherford—nucleus; Chadwick—neutron",
    [
      "Rutherford—electron; Thomson—neutron; Chadwick—nucleus",
      "Becquerel—X-rays; Röntgen—electron; Chadwick—radioactivity",
      "Bohr—penicillin; Fleming—atomic model; Jenner—neutron"
    ],
    "Thomson identified the electron, Rutherford's scattering work revealed the nucleus and Chadwick discovered the neutron. These are high-frequency atomic-structure associations. Keeping these three discoveries separate is a common atomic-structure revision point.",
    [
      "MEGA-ATOMIC-SCIENTISTS"
    ]
  ],
  [
    10,
    "Hard",
    "A student must identify one process from each field: energy transfer in ecosystems, immune protection after vaccination, and voltage measurement. Which set is correct?",
    "Trophic energy transfer → immune memory → voltmeter",
    [
      "Photosynthesis → antibiotics → ammeter",
      "Denitrification → red blood cells → hygrometer",
      "Respiration → platelets → barometer"
    ],
    "Energy moves through trophic levels in ecosystems, vaccination develops immune memory and a voltmeter measures potential difference. The set correctly spans ecology, biology and physics. The question deliberately combines three fields to test whether the core link in each is remembered.",
    [
      "MEGA-CROSS-DOMAIN-FINAL"
    ]
  ]
] as const;
