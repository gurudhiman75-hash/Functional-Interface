import type { KnowledgeV1Difficulty } from "../../types";

type ReviewSpec = readonly [
  ql: number,
  difficulty: KnowledgeV1Difficulty,
  stem: string,
  answer: string,
  distractors: readonly [string, string, string],
  explanation: string,
  factIds: readonly string[],
];

export type SciCp011ReviewQuestion = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-011";
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

const SOURCE_IDS = Object.freeze([
  "NCERT-SCIENCE-IX-MATTER-SURROUNDINGS",
  "NIOS-SECONDARY-SCIENCE-MATTER",
]);

export const SCI_CP011_QL_NAMES_V1: Record<number, string> = {
  1: "Identify state of matter from basic property",
  2: "Compare properties of solids, liquids and gases",
  3: "Particle model of matter",
  4: "Change of state and temperature or pressure effect",
  5: "Latent heat and phase-change heating",
  6: "Evaporation, cooling and controlling factors",
  7: "Diffusion and particle motion",
  8: "Sublimation and familiar phase-change applications",
  9: "Statement I/II",
  10: "Mixed matter-properties application",
};

const REVIEW_SPECS: readonly ReviewSpec[] = Object.freeze([
  [1, "Easy", "Which state of matter has both a definite shape and a definite volume?", "solid", ["liquid", "gas", "vapour"], "A solid keeps both its own shape and its own volume because its particles are held closely in fixed positions.", ["sci011-solid-shape-volume"]],
  [1, "Easy", "Which state of matter has a definite volume but takes the shape of its container?", "liquid", ["solid", "gas", "plasma"], "A liquid keeps nearly the same volume but can flow, so it takes the shape of the part of the container it occupies.", ["sci011-liquid-volume-shape"]],
  [1, "Easy", "Which state of matter has neither a definite shape nor a definite volume?", "gas", ["solid", "liquid", "ice"], "A gas has no fixed shape or volume. It spreads out to fill the available space in its container.", ["sci011-gas-shape-volume"]],
  [1, "Easy", "At ordinary room temperature, oxygen is found mainly in which state?", "gas", ["solid", "liquid", "gel"], "Oxygen exists as a gas under ordinary room conditions.", ["sci011-oxygen-gas-room"]],
  [1, "Easy", "At ordinary room temperature, water is usually present in which state?", "liquid", ["solid", "gas", "plasma"], "Under ordinary room conditions, water is normally a liquid.", ["sci011-water-liquid-room"]],
  [1, "Easy", "An iron block at room temperature is an example of which state of matter?", "solid", ["liquid", "gas", "vapour"], "An iron block has a fixed shape and volume at room temperature, so it is a solid.", ["sci011-iron-solid-room"]],

  [2, "Easy", "Which state of matter is generally the least compressible?", "solid", ["gas", "vapour", "liquid"], "Solid particles are packed very closely, leaving very little empty space to reduce by compression.", ["sci011-solid-compressibility"]],
  [2, "Easy", "Which state of matter is highly compressible compared with the other common states?", "gas", ["solid", "liquid", "ice"], "Gases contain large spaces between particles, so their volume can be reduced greatly by applying pressure.", ["sci011-gas-compressibility"]],
  [2, "Easy", "Which property best describes a liquid?", "It flows but keeps a nearly fixed volume", ["It keeps a fixed shape and fixed volume", "It fills all available space", "It has no particle motion"], "A liquid can flow and change shape, but its volume remains nearly fixed under ordinary conditions.", ["sci011-liquid-flow-volume"]],
  [2, "Easy", "A gas placed in a closed container normally:", "spreads to fill the whole container", ["keeps its original shape", "settles with a fixed upper surface only", "keeps a fixed volume independent of the container"], "Gas particles move freely through the available space, so a gas expands to fill its container.", ["sci011-gas-fills-container"]],
  [2, "Easy", "Which state of matter is described as rigid under ordinary conditions?", "solid", ["liquid", "gas", "vapour"], "Solids resist changes in shape and are therefore described as rigid under ordinary conditions.", ["sci011-solid-rigid"]],
  [2, "Easy", "Which pair is correctly described as fluids because both can flow?", "liquids and gases", ["solids and liquids", "solids and gases", "solids and crystals"], "Liquids and gases are both fluids because their particles can move past one another and the substances can flow.", ["sci011-fluids-liquid-gas"]],

  [3, "Easy", "Which statement about particles of matter is correct?", "There are spaces between them", ["They have no mass", "They are completely motionless", "They exist only in gases"], "Particles of matter are separated by spaces. The amount of space is generally smallest in solids and greatest in gases.", ["sci011-particle-spaces"]],
  [3, "Easy", "Particles of matter are generally:", "in continuous motion", ["always at rest", "present only after heating", "without any attraction"], "Particles of matter are continuously moving. Their motion becomes more vigorous as temperature rises.", ["sci011-particle-motion"]],
  [3, "Easy", "In which common state is the attraction between particles generally strongest?", "solid", ["gas", "vapour", "liquid"], "Particles in a solid are held very close together by relatively strong attractive forces.", ["sci011-attraction-solid"]],
  [3, "Easy", "In which common state are intermolecular attractions generally weakest?", "gas", ["solid", "liquid", "ice"], "Gas particles are far apart and interact weakly compared with particles in solids and liquids.", ["sci011-attraction-gas"]],
  [3, "Easy", "What generally happens to particle motion when the temperature of a substance increases?", "Particles move faster", ["Particles stop moving", "Particle mass decreases", "Particles lose all spaces"], "Heating increases the kinetic energy of particles, so their average motion becomes faster.", ["sci011-temperature-particle-motion"]],
  [3, "Easy", "Why can a gas be compressed much more than a solid?", "Gas particles have much larger spaces between them", ["Gas particles have no mass", "Solid particles do not attract each other", "Gas particles are larger than solid particles"], "The large empty spaces between gas particles can be reduced by pressure, which makes gases highly compressible.", ["sci011-gas-particle-spacing"]],

  [4, "Medium", "The change of a solid into a liquid on heating is called:", "melting", ["freezing", "condensation", "sublimation"], "Melting is the change from solid to liquid when enough heat is supplied to overcome part of the attraction holding particles in fixed positions.", ["sci011-melting"]],
  [4, "Medium", "The change of a liquid into a solid on cooling is called:", "freezing", ["melting", "boiling", "evaporation"], "Freezing is the conversion of a liquid into a solid as the substance loses heat.", ["sci011-freezing"]],
  [4, "Medium", "The change of a gas or vapour into a liquid is known as:", "condensation", ["fusion", "sublimation", "evaporation"], "During condensation, gas particles lose energy and come closer together to form a liquid.", ["sci011-condensation"]],
  [4, "Medium", "At normal atmospheric pressure, pure water boils at approximately:", "100°C", ["0°C", "50°C", "273°C"], "At about one atmosphere of pressure, pure water boils at 100°C. Boiling temperature changes when external pressure changes.", ["sci011-water-boiling-point"]],
  [4, "Medium", "At normal atmospheric pressure, pure ice melts at approximately:", "0°C", ["32°C", "100°C", "273°C"], "At about one atmosphere, the melting point of pure ice is 0°C.", ["sci011-ice-melting-point"]],
  [4, "Medium", "Which combination is commonly used to liquefy a gas more easily?", "Increasing pressure and lowering temperature", ["Lowering pressure and raising temperature", "Increasing both temperature and volume", "Lowering pressure without cooling"], "High pressure pushes gas particles closer, while cooling reduces their kinetic energy. Together these changes favour liquefaction.", ["sci011-gas-liquefaction"]],

  [5, "Medium", "Heat absorbed by a solid at its melting point without a rise in temperature is called latent heat of:", "fusion", ["vaporization", "condensation", "compression"], "Latent heat of fusion is the heat needed to change a solid into a liquid at its melting point without changing the temperature.", ["sci011-latent-heat-fusion"]],
  [5, "Medium", "Heat required to change a liquid into vapour at its boiling point without changing temperature is latent heat of:", "vaporization", ["fusion", "freezing", "sublimation only"], "Latent heat of vaporization supplies the energy needed for liquid particles to separate into the gaseous state at the boiling point.", ["sci011-latent-heat-vaporization"]],
  [5, "Medium", "Why does the temperature remain constant while pure ice melts at its melting point?", "The supplied heat is used for the change of state", ["No heat is being absorbed", "The particles stop moving", "The thermometer cannot measure solids"], "During melting, the absorbed heat is used mainly to overcome intermolecular attraction rather than to raise temperature.", ["sci011-melting-temperature-constant"]],
  [5, "Medium", "Why can steam at 100°C cause a more severe burn than water at 100°C?", "Steam releases additional latent heat when it condenses", ["Steam has no particles", "Water at 100°C is already frozen", "Steam always has a lower temperature"], "Steam carries latent heat of vaporization. When it condenses on skin, that extra energy is released in addition to its sensible heat.", ["sci011-steam-burn-latent-heat"]],
  [5, "Medium", "Why can ice at 0°C cool a drink more effectively than water at 0°C?", "Ice absorbs latent heat while melting", ["Ice is always below 0°C", "Water cannot absorb heat at 0°C", "Ice has no thermal energy"], "Ice at 0°C must absorb latent heat of fusion to melt, so it removes additional heat from the drink without first increasing its own temperature.", ["sci011-ice-cooling-latent-heat"]],
  [5, "Medium", "Which contains more thermal energy under otherwise comparable conditions: steam at 100°C or water at 100°C?", "steam at 100°C", ["water at 100°C", "both necessarily contain exactly the same energy", "neither contains thermal energy"], "Steam at 100°C has absorbed latent heat of vaporization in addition to the energy present in liquid water at the same temperature.", ["sci011-steam-water-energy"]],

  [6, "Medium", "Which change generally increases the rate of evaporation from an open liquid surface?", "Increasing the surface area", ["Decreasing the surface area", "Increasing humidity", "Covering the surface completely"], "A larger surface exposes more liquid particles to air at the same time, so more particles can escape by evaporation.", ["sci011-evaporation-surface-area"]],
  [6, "Medium", "Evaporation becomes faster when the temperature of a liquid:", "increases", ["decreases", "remains at absolute zero", "has no effect under any condition"], "At a higher temperature, more surface particles have enough kinetic energy to escape into the vapour state.", ["sci011-evaporation-temperature"]],
  [6, "Medium", "Why do wet clothes usually dry faster on a windy day?", "Moving air removes water vapour from around the clothes", ["Wind raises the boiling point of water to 200°C", "Wind stops evaporation from the surface", "Moving air converts water directly into ice"], "Wind carries away humid air near the cloth, allowing more water molecules to escape from the wet surface.", ["sci011-evaporation-wind"]],
  [6, "Medium", "High humidity usually has what effect on evaporation?", "It slows evaporation", ["It always doubles evaporation", "It has the same effect as strong wind", "It converts evaporation into freezing"], "When the air already contains a large amount of water vapour, it can accept less additional vapour, so evaporation slows.", ["sci011-evaporation-humidity"]],
  [6, "Medium", "Why does evaporation produce a cooling effect?", "Higher-energy particles escape, lowering the average energy of the remaining liquid", ["Evaporation creates cold particles from nothing", "All particles stop moving after evaporation", "The liquid gains latent heat from the escaping particles"], "The faster, higher-energy surface particles are more likely to escape. The remaining liquid therefore has a lower average kinetic energy and cools.", ["sci011-evaporation-cooling"]],
  [6, "Medium", "Water kept in a porous earthen pot becomes cool mainly because:", "water evaporates through tiny pores in the pot", ["the clay continuously produces ice", "the pot prevents all heat transfer", "the water chemically changes into another substance"], "A small amount of water reaches the outer surface through pores and evaporates. The required latent heat is taken from the water and pot, causing cooling.", ["sci011-earthen-pot-cooling"]],

  [7, "Medium", "Diffusion occurs fastest in which common state of matter?", "gases", ["solids", "liquids", "all states at exactly the same rate"], "Gas particles move rapidly and have large spaces between them, so intermixing by diffusion is generally fastest in gases.", ["sci011-diffusion-fastest-gas"]],
  [7, "Medium", "The smell of perfume spreading across a room is mainly an example of:", "diffusion", ["freezing", "melting", "sedimentation"], "Perfume vapour particles move through air and mix with it, allowing the smell to spread through the room.", ["sci011-perfume-diffusion"]],
  [7, "Medium", "A drop of ink slowly spreads through still water even without stirring. This is due to:", "diffusion", ["sublimation", "freezing", "filtration"], "Ink and water particles are in continuous motion and gradually intermix, producing diffusion.", ["sci011-ink-water-diffusion"]],
  [7, "Medium", "What usually happens to diffusion when temperature is increased?", "It becomes faster", ["It always stops", "It becomes impossible in gases", "It changes directly into freezing"], "Higher temperature increases particle motion, so particles intermix more rapidly and diffusion generally becomes faster.", ["sci011-diffusion-temperature"]],
  [7, "Medium", "Which particle property is directly responsible for diffusion?", "continuous random motion of particles", ["complete absence of spaces", "fixed position of every particle", "zero kinetic energy"], "Diffusion occurs because particles are constantly moving and can enter the spaces between particles of another substance.", ["sci011-diffusion-particle-motion"]],
  [7, "Medium", "Why is diffusion in solids usually much slower than in gases?", "Solid particles are closely packed and have very limited movement", ["Solids contain no particles", "Gas particles have no motion", "Solids have infinite empty space"], "In solids, particles are tightly packed and mainly vibrate around fixed positions, so intermixing occurs very slowly.", ["sci011-diffusion-solid-slow"]],

  [8, "Medium", "The direct change of a solid into vapour without first becoming liquid is called:", "sublimation", ["condensation", "freezing", "fusion"], "Sublimation is a direct solid-to-gas change without passing through the liquid state under the given conditions.", ["sci011-sublimation-definition"]],
  [8, "Medium", "Which substance is commonly cited as undergoing sublimation?", "camphor", ["table salt", "copper wire", "sand"], "Camphor can change directly from solid to vapour, so it is a familiar example of sublimation.", ["sci011-camphor-sublimation"]],
  [8, "Medium", "Naphthalene balls gradually become smaller when left exposed because naphthalene:", "sublimes", ["freezes", "melts only", "changes into liquid water"], "Naphthalene can pass directly from solid to vapour, so exposed mothballs slowly lose mass by sublimation.", ["sci011-naphthalene-sublimation"]],
  [8, "Medium", "Dry ice changes directly from solid carbon dioxide to carbon dioxide gas. This change is:", "sublimation", ["freezing", "condensation", "melting"], "Dry ice normally changes directly from solid carbon dioxide to gas at ordinary atmospheric pressure, which is sublimation.", ["sci011-dry-ice-sublimation"]],
  [8, "Medium", "Water droplets appearing on the outside of a cold glass are mainly formed by:", "condensation of water vapour from air", ["water passing through the glass wall", "sublimation of glass", "melting of oxygen"], "Water vapour in the surrounding air cools near the cold glass and condenses into liquid droplets on its outer surface.", ["sci011-cold-glass-condensation"]],
  [8, "Medium", "Dew forms when water vapour in air:", "cools and condenses into liquid water", ["heats and becomes plasma", "freezes before any cooling occurs", "changes directly into salt"], "When moist air near a cool surface reaches a sufficiently low temperature, some water vapour condenses as liquid droplets called dew.", ["sci011-dew-condensation"]],

  [9, "Hard", "Consider the statements:\nI. Gas particles are farther apart than particles in solids.\nII. Gases are generally more compressible than solids.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Both statements describe the same particle-level idea: large spaces between gas particles make gases much easier to compress.", ["sci011-gas-particle-spacing", "sci011-gas-compressibility"]],
  [9, "Hard", "Consider the statements:\nI. Evaporation can occur below the boiling point.\nII. Evaporation occurs only from the surface of a liquid.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Evaporation is a surface phenomenon and can occur at temperatures below the boiling point; boiling is a bulk process at a characteristic temperature for a given pressure.", ["sci011-evaporation-below-boiling", "sci011-evaporation-surface"]],
  [9, "Hard", "Consider the statements:\nI. During melting at the melting point, a pure substance can absorb heat without a temperature rise.\nII. The absorbed heat is used in changing the state.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "At the phase-change temperature, latent heat is absorbed to loosen the particle arrangement, so the temperature remains constant until the change is complete.", ["sci011-melting-temperature-constant", "sci011-latent-heat-fusion"]],
  [9, "Hard", "Consider the statements:\nI. Increasing wind speed can increase evaporation.\nII. Increasing humidity generally increases evaporation.\nWhich is correct?", "I only", ["II only", "Both I and II", "Neither I nor II"], "Wind removes vapour-rich air from the surface and speeds evaporation. High humidity does the opposite because the air already contains more water vapour.", ["sci011-evaporation-wind", "sci011-evaporation-humidity"]],
  [9, "Hard", "Consider the statements:\nI. Diffusion is evidence that particles of matter are in motion.\nII. Diffusion is generally faster at higher temperature.\nWhich is correct?", "Both I and II", ["I only", "II only", "Neither I nor II"], "Diffusion results from particle motion, and heating usually increases that motion, making intermixing faster.", ["sci011-diffusion-particle-motion", "sci011-diffusion-temperature"]],
  [9, "Hard", "Consider the statements:\nI. A liquid has a definite shape.\nII. A liquid has a nearly definite volume under ordinary conditions.\nWhich is correct?", "II only", ["I only", "Both I and II", "Neither I nor II"], "A liquid changes shape to match its container, but its volume remains nearly fixed under ordinary conditions.", ["sci011-liquid-volume-shape"]],

  [10, "Hard", "A sealed syringe contains air and its nozzle is closed. The plunger can still be pushed inward some distance mainly because:", "there are large spaces between gas particles", ["air particles have no mass", "gas particles are fixed in position", "the syringe converts air into a solid immediately"], "Air is compressible because gas particles are far apart. Pushing the plunger reduces the empty space between them.", ["sci011-gas-compressibility", "sci011-gas-particle-spacing"]],
  [10, "Hard", "A student spreads the same amount of water in a plate and in a narrow glass. The water in the plate disappears faster. What is the main reason?", "The plate provides a larger surface area for evaporation", ["The plate raises the boiling point to 1000°C", "Water cannot evaporate from a glass", "The plate changes water into another compound"], "Evaporation occurs at the surface. Spreading water over a larger area exposes more particles that can escape into the air.", ["sci011-evaporation-surface-area"]],
  [10, "Hard", "Two identical wet cloths are placed in equally warm places. One is under a fan and the other is in still air. Why does the cloth under the fan usually dry first?", "Moving air carries away water vapour near the cloth", ["The fan freezes the water first", "Wind prevents water molecules from leaving", "The fan removes all latent heat from the air permanently"], "Airflow removes the moist layer of air close to the wet cloth. This maintains a stronger tendency for more water to evaporate.", ["sci011-evaporation-wind"]],
  [10, "Hard", "Equal masses of ice at 0°C and water at 0°C are used separately to cool identical drinks. Which should generally remove more heat before reaching the same final temperature?", "ice at 0°C", ["water at 0°C", "both must remove exactly the same heat in every case", "neither can absorb heat"], "The ice must first absorb latent heat of fusion to melt. It therefore removes additional heat before its temperature rises like the liquid water.", ["sci011-ice-cooling-latent-heat"]],
  [10, "Hard", "A gas is cooled while being compressed. Why does this combination favour conversion to a liquid?", "Cooling slows particles while pressure brings them closer together", ["Cooling removes all particle attraction", "Pressure makes particle spacing infinite", "Both changes always increase gas volume"], "Cooling reduces kinetic energy and compression reduces particle separation. These effects make intermolecular attraction more effective and favour liquefaction.", ["sci011-gas-liquefaction", "sci011-temperature-particle-motion"]],
  [10, "Hard", "A few drops of perfume are released at one side of a warm room and the smell later reaches the other side. Which two ideas best explain this?", "gas particles move continuously and diffuse through air", ["gas particles are fixed and air is a solid", "perfume freezes and slides across the floor", "the smell travels only because of melting"], "Perfume vapour particles are in continuous motion and mix with air by diffusion, allowing them to spread through the room.", ["sci011-particle-motion", "sci011-perfume-diffusion"]],
]);

function pad3(value: number): string {
  return String(value).padStart(3, "0");
}

function buildOptions(
  answer: string,
  distractors: readonly [string, string, string],
  correctIndex: number,
): string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return options;
}

export const SCI_CP011_REVIEW_V1: readonly SciCp011ReviewQuestion[] = Object.freeze(
  REVIEW_SPECS.map((spec, index) => {
    const [ql, difficulty, stem, answer, distractors, explanation, factIds] = spec;
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `SCI-CP-011-REV-${pad3(index + 1)}`,
      chapterId: "SCI-001" as const,
      cpId: "SCI-CP-011" as const,
      qlId: `SCI-011-QL-${pad3(ql)}`,
      qlName: SCI_CP011_QL_NAMES_V1[ql],
      difficulty,
      stem,
      options: buildOptions(answer, distractors, correctIndex),
      correctIndex,
      canonicalAnswer: answer,
      explanation,
      sourceIds: [...SOURCE_IDS],
      sourceFactIds: [...factIds],
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

export type SciCp011Validation = {
  valid: boolean;
  errors: string[];
  totalQuestions: number;
  qlCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  answerPositionCounts: Record<string, number>;
};

export function validateSciCp011ReviewV1(): SciCp011Validation {
  const errors: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};
  const answerPositionCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  const seenIds = new Set<string>();
  const seenStems = new Set<string>();

  for (const question of SCI_CP011_REVIEW_V1) {
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] = (difficultyCounts[question.difficulty] ?? 0) + 1;
    const position = ["A", "B", "C", "D"][question.correctIndex];
    answerPositionCounts[position] += 1;

    if (seenIds.has(question.questionId)) errors.push(`Duplicate questionId: ${question.questionId}`);
    seenIds.add(question.questionId);
    if (seenStems.has(question.stem)) errors.push(`Duplicate stem: ${question.stem}`);
    seenStems.add(question.stem);

    if (question.options.length !== 4) errors.push(`${question.questionId}: expected four options`);
    if (new Set(question.options).size !== 4) errors.push(`${question.questionId}: options must be distinct`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) errors.push(`${question.questionId}: keyed answer mismatch`);
    if (!question.explanation.trim()) errors.push(`${question.questionId}: missing explanation`);
    if (question.sourceIds.length === 0 || question.sourceFactIds.length === 0) errors.push(`${question.questionId}: missing provenance`);
    if (!question.reviewOnly || question.runtimeRegistered) errors.push(`${question.questionId}: review lifecycle violation`);
  }

  if (SCI_CP011_REVIEW_V1.length !== 60) errors.push(`Expected 60 questions, found ${SCI_CP011_REVIEW_V1.length}`);

  for (let ql = 1; ql <= 10; ql += 1) {
    const qlId = `SCI-011-QL-${pad3(ql)}`;
    if (qlCounts[qlId] !== 6) errors.push(`${qlId}: expected 6 questions, found ${qlCounts[qlId] ?? 0}`);
  }

  const expectedDifficulty: Record<string, number> = { Easy: 18, Medium: 30, Hard: 12 };
  for (const [difficulty, expected] of Object.entries(expectedDifficulty)) {
    if (difficultyCounts[difficulty] !== expected) errors.push(`${difficulty}: expected ${expected}, found ${difficultyCounts[difficulty] ?? 0}`);
  }

  for (const position of ["A", "B", "C", "D"] as const) {
    if (answerPositionCounts[position] !== 15) errors.push(`${position}: expected 15 keyed answers, found ${answerPositionCounts[position]}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    totalQuestions: SCI_CP011_REVIEW_V1.length,
    qlCounts,
    difficultyCounts,
    answerPositionCounts,
  };
}
