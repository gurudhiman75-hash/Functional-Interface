import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp037ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp037ReviewSpec[] = [
  [
    1,
    "Easy",
    "The laws of motion are most closely associated with:",
    "Isaac Newton",
    [
      "Archimedes",
      "Blaise Pascal",
      "Galileo Galilei"
    ],
    "Newton formulated the three laws of motion that form the basis of classical mechanics.",
    [
      "NEWTON-LAWS-OF-MOTION"
    ]
  ],
  [
    1,
    "Easy",
    "The principle of buoyancy is associated with:",
    "Archimedes",
    [
      "Isaac Newton",
      "Evangelista Torricelli",
      "Robert Boyle"
    ],
    "Archimedes' principle relates buoyant force to the weight of displaced fluid.",
    [
      "ARCHIMEDES-PRINCIPLE"
    ]
  ],
  [
    1,
    "Medium",
    "Pascal's law, used in hydraulic systems, is associated with:",
    "Blaise Pascal",
    [
      "Daniel Bernoulli",
      "Michael Faraday",
      "James Watt"
    ],
    "Pascal stated that pressure applied to a confined fluid is transmitted throughout the fluid.",
    [
      "PASCAL-LAW"
    ]
  ],
  [
    1,
    "Medium",
    "The mercury barometer is historically associated with:",
    "Evangelista Torricelli",
    [
      "Galileo Galilei",
      "Robert Hooke",
      "Christiaan Huygens"
    ],
    "Torricelli demonstrated atmospheric pressure using a mercury column and developed the barometer.",
    [
      "TORRICELLI-BAROMETER"
    ]
  ],
  [
    1,
    "Medium",
    "Which scientist's experiments strongly challenged the old idea that heavier bodies must fall much faster than lighter ones?",
    "Galileo Galilei",
    [
      "Gregor Mendel",
      "Louis Pasteur",
      "J. J. Thomson"
    ],
    "Galileo's work on falling bodies helped establish the modern study of motion.",
    [
      "GALILEO-FALLING-BODIES"
    ]
  ],
  [
    1,
    "Hard",
    "A question mentions universal gravitation and the three laws of motion. Which scientist correctly matches both contributions?",
    "Isaac Newton",
    [
      "Archimedes",
      "Blaise Pascal",
      "Evangelista Torricelli"
    ],
    "Newton is associated with both the laws of motion and the law of universal gravitation.",
    [
      "NEWTON-MOTION-GRAVITATION"
    ]
  ],
  [
    2,
    "Easy",
    "Ohm's law is named after:",
    "Georg Simon Ohm",
    [
      "Alessandro Volta",
      "Michael Faraday",
      "André-Marie Ampère"
    ],
    "Ohm's law relates voltage, current and resistance in an electrical conductor under suitable conditions.",
    [
      "OHM-LAW"
    ]
  ],
  [
    2,
    "Easy",
    "The electric battery or voltaic pile is associated with:",
    "Alessandro Volta",
    [
      "Hans Christian Oersted",
      "James Clerk Maxwell",
      "Heinrich Hertz"
    ],
    "Volta developed the voltaic pile, an early source of continuous electric current.",
    [
      "VOLTA-BATTERY"
    ]
  ],
  [
    2,
    "Medium",
    "Who discovered the magnetic effect of electric current in a wire?",
    "Hans Christian Oersted",
    [
      "Michael Faraday",
      "Georg Ohm",
      "Thomas Edison"
    ],
    "Oersted observed that an electric current deflects a magnetic compass needle.",
    [
      "OERSTED-MAGNETIC-EFFECT-CURRENT"
    ]
  ],
  [
    2,
    "Medium",
    "Electromagnetic induction is most closely associated with:",
    "Michael Faraday",
    [
      "Alessandro Volta",
      "Blaise Pascal",
      "J. J. Thomson"
    ],
    "Faraday showed that a changing magnetic environment can induce an electric current.",
    [
      "FARADAY-INDUCTION"
    ]
  ],
  [
    2,
    "Medium",
    "The SI unit ampere is named after the scientist associated with the study of:",
    "Electric currents and their magnetic effects",
    [
      "Radioactivity only",
      "Plant genetics",
      "Atmospheric pressure"
    ],
    "André-Marie Ampère made major contributions to electrodynamics and the magnetic effects of current.",
    [
      "AMPERE-ELECTRODYNAMICS"
    ]
  ],
  [
    2,
    "Hard",
    "Which sequence correctly matches scientist and contribution?",
    "Oersted — current's magnetic effect; Faraday — electromagnetic induction",
    [
      "Volta — electromagnetic induction; Faraday — voltaic pile",
      "Ohm — radio waves; Hertz — resistance law",
      "Ampère — barometer; Torricelli — electric current"
    ],
    "Oersted linked current with magnetism, while Faraday established electromagnetic induction.",
    [
      "OERSTED-FARADAY-DISTINCTION"
    ]
  ],
  [
    3,
    "Easy",
    "X-rays were discovered by:",
    "Wilhelm Conrad Röntgen",
    [
      "Henri Becquerel",
      "Ernest Rutherford",
      "Niels Bohr"
    ],
    "Röntgen discovered X-rays while studying electrical discharges in vacuum tubes.",
    [
      "RONTGEN-XRAYS"
    ]
  ],
  [
    3,
    "Easy",
    "The discovery of natural radioactivity is associated with:",
    "Henri Becquerel",
    [
      "Marie Curie",
      "J. J. Thomson",
      "Albert Einstein"
    ],
    "Becquerel discovered spontaneous radiation from uranium salts.",
    [
      "BECQUEREL-RADIOACTIVITY"
    ]
  ],
  [
    3,
    "Medium",
    "The electron was discovered by:",
    "J. J. Thomson",
    [
      "Ernest Rutherford",
      "James Chadwick",
      "Niels Bohr"
    ],
    "Thomson identified the electron through cathode-ray experiments.",
    [
      "THOMSON-ELECTRON"
    ]
  ]
] as const;
