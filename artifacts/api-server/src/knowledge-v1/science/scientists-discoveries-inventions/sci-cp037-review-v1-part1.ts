import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp037ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp037ReviewSpec[] = [
  [
    1,
    "Easy",
    "Who formulated the three laws of motion?",
    "Isaac Newton",
    [
      "Archimedes",
      "Blaise Pascal",
      "Galileo Galilei"
    ],
    "Newton formulated the three laws of motion that form the basis of classical mechanics. These laws explain how forces change the motion of objects and are still used for many everyday mechanical problems.",
    [
      "NEWTON-LAWS-OF-MOTION"
    ]
  ],
  [
    1,
    "Easy",
    "Who gave the principle of buoyancy?",
    "Archimedes",
    [
      "Isaac Newton",
      "Evangelista Torricelli",
      "Robert Boyle"
    ],
    "Archimedes' principle relates buoyant force to the weight of displaced fluid. It explains why objects appear lighter in water and why ships can float even though they are very heavy.",
    [
      "ARCHIMEDES-PRINCIPLE"
    ]
  ],
  [
    1,
    "Medium",
    "Pascal's law, used in hydraulic systems, was formulated by:",
    "Blaise Pascal",
    [
      "Daniel Bernoulli",
      "Michael Faraday",
      "James Watt"
    ],
    "Pascal stated that pressure applied to a confined fluid is transmitted throughout the fluid. This principle is used in hydraulic brakes, lifts and presses because pressure can be transmitted through a confined fluid.",
    [
      "PASCAL-LAW"
    ]
  ],
  [
    1,
    "Medium",
    "Who developed the mercury barometer?",
    "Evangelista Torricelli",
    [
      "Galileo Galilei",
      "Robert Hooke",
      "Christiaan Huygens"
    ],
    "Torricelli demonstrated atmospheric pressure using a mercury column and developed the barometer. The height of the mercury column changes with atmospheric pressure, which is why a barometer can measure pressure.",
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
    "Galileo's work on falling bodies helped establish the modern study of motion. His work showed that the motion of falling objects should be studied by experiment rather than by old assumptions alone.",
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
    "Newton formulated the laws of motion and the law of universal gravitation. Together, these ideas explain both ordinary motion on Earth and the motion of planets and other celestial bodies.",
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
    "Ohm's law relates voltage, current and resistance in an electrical conductor under suitable conditions. In simple form it is written as V = IR, making it one of the most basic relationships in electricity.",
    [
      "OHM-LAW"
    ]
  ],
  [
    2,
    "Easy",
    "Who developed the voltaic pile, an early electric battery?",
    "Alessandro Volta",
    [
      "Hans Christian Oersted",
      "James Clerk Maxwell",
      "Heinrich Hertz"
    ],
    "Volta developed the voltaic pile, an early source of continuous electric current. The device showed that chemical reactions could provide a steady electric current, unlike brief static-electric sparks.",
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
    "Oersted observed that an electric current deflects a magnetic compass needle. This observation provided clear evidence that electricity and magnetism are connected.",
    [
      "OERSTED-MAGNETIC-EFFECT-CURRENT"
    ]
  ],
  [
    2,
    "Medium",
    "Who discovered electromagnetic induction?",
    "Michael Faraday",
    [
      "Alessandro Volta",
      "Blaise Pascal",
      "J. J. Thomson"
    ],
    "Faraday showed that a changing magnetic environment can induce an electric current. This principle is the basis of electric generators, transformers and many modern electrical devices.",
    [
      "FARADAY-INDUCTION"
    ]
  ],
  [
    2,
    "Medium",
    "The SI unit ampere is named after a scientist noted for work on:",
    "Electric currents and their magnetic effects",
    [
      "Radioactivity only",
      "Plant genetics",
      "Atmospheric pressure"
    ],
    "André-Marie Ampère made major contributions to electrodynamics and the magnetic effects of current. His work helped describe how electric currents produce magnetic effects, and the ampere unit honours this contribution.",
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
    "Oersted linked current with magnetism, while Faraday established electromagnetic induction. The first showed that current creates a magnetic effect; the second showed that changing magnetism can produce electric current.",
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
    "Röntgen discovered X-rays while studying electrical discharges in vacuum tubes. X-rays can pass through soft tissue more easily than bone, which later made them very useful in medical imaging.",
    [
      "RONTGEN-XRAYS"
    ]
  ],
  [
    3,
    "Easy",
    "Who discovered natural radioactivity?",
    "Henri Becquerel",
    [
      "Marie Curie",
      "J. J. Thomson",
      "Albert Einstein"
    ],
    "Becquerel discovered spontaneous radiation from uranium salts. He found that the radiation was emitted naturally without needing an external light source.",
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
    "Thomson identified the electron through cathode-ray experiments. This showed that atoms contain smaller negatively charged particles and are not indivisible.",
    [
      "THOMSON-ELECTRON"
    ]
  ]
] as const;
