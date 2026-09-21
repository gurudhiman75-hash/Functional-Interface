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

export type SciCp001ReviewQuestion = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-001";
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

const SOURCE_IDS = Object.freeze(["NCERT-PHYSICS-XI-UNITS-MEASUREMENT", "NIOS-SECONDARY-SCIENCE-MEASUREMENT"]);

export const SCI_CP001_QL_NAMES_V1: Record<number, string> = {"1": "SI base quantity to unit", "2": "Common derived quantity to SI unit", "3": "Instrument to measured quantity", "4": "Scalar and vector classification", "5": "Basic unit conversion", "6": "Derived-unit relation", "7": "Instrument selection for a measurement task", "8": "Units and properties of common physical quantities", "9": "Statement I/II", "10": "Multi-fact and application synthesis"};

const REVIEW_SPECS: readonly ReviewSpec[] = Object.freeze([
  [1,"Easy","What is the SI base unit of length?","metre (m)",["kilogram (kg)","second (s)","ampere (A)"],"The SI base unit of length is the metre (m). It is the standard reference unit used for measuring length in the SI system.",["sci001-length-metre"]],
  [1,"Easy","What is the SI base unit of mass?","kilogram (kg)",["metre (m)","newton (N)","gram (g)"],"The SI base unit of mass is the kilogram (kg). Although grams are common in daily use, the kilogram is the SI base unit for mass.",["sci001-mass-kilogram"]],
  [1,"Easy","What is the SI base unit of time?","second (s)",["hour (h)","minute (min)","hertz (Hz)"],"The SI base unit of time is the second (s). Minutes and hours are convenient larger units, but the SI base unit remains the second.",["sci001-time-second"]],
  [1,"Easy","What is the SI base unit of electric current?","ampere (A)",["coulomb (C)","volt (V)","watt (W)"],"The SI base unit of electric current is the ampere (A). Electric current is one of the seven SI base quantities, and its unit is the ampere.",["sci001-current-ampere"]],
  [1,"Easy","What is the SI base unit of thermodynamic temperature?","kelvin (K)",["degree Celsius (°C)","joule (J)","candela (cd)"],"The SI base unit of thermodynamic temperature is the kelvin (K). Kelvin is used for absolute thermodynamic temperature and does not use a degree sign.",["sci001-temperature-kelvin"]],
  [1,"Easy","What is the SI base unit of amount of substance?","mole (mol)",["kilogram (kg)","candela (cd)","pascal (Pa)"],"The SI base unit of amount of substance is the mole (mol). One mole represents a fixed amount of particles and is the SI base unit for amount of substance.",["sci001-amount-mole"]],
  [2,"Easy","Which SI unit is used for force?","newton (N)",["joule (J)","pascal (Pa)","watt (W)"],"Force is measured in newtons (N) in SI. The unit is named after Isaac Newton and comes from the relation F = ma.",["sci001-force-newton"]],
  [2,"Easy","Pressure is measured in which SI unit?","pascal (Pa)",["newton (N)","joule (J)","tesla (T)"],"Pressure is measured in pascals (Pa). One pascal is one newton per square metre. This relation shows that pressure depends on both applied force and the area over which it acts.",["sci001-pressure-pascal"]],
  [2,"Easy","Which SI unit is used for work and energy?","joule (J)",["watt (W)","newton (N)","hertz (Hz)"],"Work and energy are measured in joules (J). Work transfers energy, so both quantities use the same SI unit. This equivalence is fundamental in mechanical energy calculations.",["sci001-energy-joule"]],
  [2,"Easy","Power is measured in which SI unit?","watt (W)",["joule (J)","pascal (Pa)","volt (V)"],"Power is measured in watts (W). One watt means one joule of energy transferred or used each second. It therefore measures a rate rather than a total amount of energy.",["sci001-power-watt"]],
  [2,"Easy","Which SI unit is used for frequency?","hertz (Hz)",["second (s)","newton (N)","coulomb (C)"],"Frequency is measured in hertz (Hz), meaning cycles per second. A frequency of 50 Hz therefore means 50 cycles occur every second.",["sci001-frequency-hertz"]],
  [2,"Easy","Electric charge is measured in which SI unit?","coulomb (C)",["ampere (A)","volt (V)","ohm (Ω)"],"Electric charge is measured in coulombs (C). One coulomb is the charge carried by a current of one ampere in one second.",["sci001-charge-coulomb"]],
  [3,"Easy","Which instrument is used to measure electric current in a circuit?","ammeter",["voltmeter","barometer","hydrometer"],"An ammeter is used to measure electric current in a circuit. In a circuit it is connected in series so the current passes through the instrument.",["sci001-ammeter-current"]],
  [3,"Easy","Which instrument is used to measure potential difference between two points?","voltmeter",["ammeter","thermometer","lactometer"],"A voltmeter measures potential difference between two points. A voltmeter is connected in parallel across the two points whose potential difference is required.",["sci001-voltmeter-voltage"]],
  [3,"Easy","Which instrument is used to measure atmospheric pressure?","barometer",["manometer","hydrometer","calorimeter"],"A barometer measures atmospheric pressure. Barometers are also useful in weather observation because atmospheric pressure changes with weather conditions. Forecasters track pressure changes when monitoring developing weather systems.",["sci001-barometer-pressure"]],
  [3,"Easy","Which instrument is used to measure relative density of a liquid?","hydrometer",["lactometer","barometer","ammeter"],"A hydrometer is used to measure the relative density of liquids. It floats at different depths depending on the density of the liquid being tested.",["sci001-hydrometer-density"]],
  [3,"Easy","Which instrument is used to measure relative density of milk?","lactometer",["hydrometer","calorimeter","voltmeter"],"A lactometer is used to check the relative density of milk. A lactometer is a specialized hydrometer designed specifically for milk.",["sci001-lactometer-milk"]],
  [3,"Easy","Which instrument is used to measure temperature?","thermometer",["barometer","ammeter","spring balance"],"A thermometer measures temperature. Different thermometers may use different sensors, but all are calibrated to indicate temperature. The calibrated scale converts the sensor response into a readable temperature.",["sci001-thermometer-temperature"]],
  [4,"Medium","Which of the following is a vector quantity?","velocity",["speed","distance","mass"],"Velocity has both magnitude and direction, so it is a vector quantity. Direction is essential to describe velocity completely, unlike speed which needs magnitude only.",["sci001-velocity-vector"]],
  [4,"Medium","Which of the following is a scalar quantity?","speed",["displacement","acceleration","force"],"Speed has magnitude only, so it is a scalar quantity. For example, a speed of 20 m/s is complete even without stating a direction.",["sci001-speed-scalar"]],
  [4,"Medium","A quantity has both magnitude and direction. Which example fits this description?","displacement",["distance","time","temperature"],"Displacement requires both magnitude and direction. Two equal displacements must have the same magnitude as well as the same direction.",["sci001-displacement-vector"]],
  [4,"Medium","Which pair contains only vector quantities?","velocity and acceleration",["speed and distance","mass and force","time and displacement"],"Velocity and acceleration both have magnitude and direction. Both quantities can change when direction changes even if the object's speed stays the same.",["sci001-velocity-vector","sci001-acceleration-vector"]],
  [4,"Medium","Which pair contains only scalar quantities?","distance and speed",["displacement and velocity","force and mass","acceleration and time"],"Distance and speed are both scalar quantities. Neither quantity requires a direction, so both can be fully described by magnitude alone.",["sci001-distance-scalar","sci001-speed-scalar"]],
  [4,"Medium","A student reports only the magnitude of a quantity and no direction is needed. Which of these could it be?","mass",["force","velocity","displacement"],"Mass is a scalar quantity; force, velocity and displacement require direction. Mass describes the amount of matter and does not need any directional information.",["sci001-mass-scalar"]],
  [5,"Medium","A car moves at 72 km/h. What is its speed in m/s?","20 m/s",["10 m/s","25 m/s","36 m/s"],"To convert km/h to m/s, multiply by 5/18. 72 × 5/18 = 20 m/s. The factor 5/18 converts kilometres per hour into metres per second.",["sci001-speed-conversion"]],
  [5,"Medium","A runner moves at 10 m/s. What is this speed in km/h?","36 km/h",["18 km/h","27 km/h","72 km/h"],"To convert m/s to km/h, multiply by 18/5. 10 × 18/5 = 36 km/h. The factor 18/5 converts metres per second into kilometres per hour.",["sci001-speed-conversion"]],
  [5,"Medium","How many metres are there in 2.5 km?","2500 m",["250 m","25,000 m","0.25 m"],"1 km = 1000 m, so 2.5 km = 2500 m. Multiplying kilometres by 1000 gives the same distance expressed in metres.",["sci001-length-conversion"]],
  [5,"Medium","5000 g is equal to how many kilograms?","5 kg",["0.5 kg","50 kg","500 kg"],"1000 g = 1 kg, so 5000 g = 5 kg. Dividing grams by 1000 converts the value into kilograms.",["sci001-mass-conversion"]],
  [5,"Medium","A time interval of 3 minutes is equal to:","180 s",["30 s","120 s","300 s"],"1 minute = 60 seconds, so 3 minutes = 180 seconds. Multiplying minutes by 60 converts the time interval into seconds.",["sci001-time-conversion"]],
  [5,"Medium","2.5 litres is equal to:","2500 mL",["250 mL","25 mL","25,000 mL"],"1 litre = 1000 millilitres, so 2.5 litres = 2500 mL. Multiplying litres by 1000 converts volume into millilitres. This is an exact conversion within the metric system.",["sci001-volume-conversion"]],
  [6,"Medium","Which relation correctly expresses one newton?","1 N = 1 kg·m/s²",["1 N = 1 kg·m/s","1 N = 1 kg/m²","1 N = 1 J/s"],"From F = ma, one newton equals one kilogram metre per second squared. This derived unit combines the SI base units of mass, length and time.",["sci001-force-newton-relation"]],
  [6,"Medium","One pascal is equal to:","1 N/m²",["1 N·m","1 J/s","1 kg·m/s"],"Pressure = force/area, so 1 Pa = 1 N/m². A pascal is therefore a very small pressure equal to one newton acting over one square metre.",["sci001-pressure-pascal-relation"]],
  [6,"Medium","Which relation is correct for the joule?","1 J = 1 N·m",["1 J = 1 N/m²","1 J = 1 kg/s","1 J = 1 A·s"],"Work = force × displacement, so 1 joule = 1 newton metre. This follows directly from the definition of work as force multiplied by displacement in the force direction.",["sci001-energy-joule-relation"]],
  [6,"Medium","One watt is equal to:","1 J/s",["1 J·s","1 N/m²","1 C/s²"],"Power is work done per unit time, so 1 W = 1 J/s. It shows that power measures how quickly work is done or energy is transferred.",["sci001-power-watt-relation"]],
  [6,"Medium","A frequency of 1 hertz means:","1 cycle per second",["1 cycle per minute","1 metre per second","1 joule per second"],"One hertz means one cycle or oscillation per second. Thus frequency counts repeated events or oscillations per unit time. A 1 Hz motion therefore has a period of one second.",["sci001-frequency-hertz-relation"]],
  [6,"Medium","Which relation correctly expresses one coulomb?","1 C = 1 A·s",["1 C = 1 A/s","1 C = 1 V·s","1 C = 1 J/s"],"Electric charge Q = current × time, so 1 C = 1 A·s. This relation links electric charge with current and the time for which the current flows.",["sci001-charge-coulomb-relation"]],
  [7,"Medium","Which instrument is most suitable for measuring the diameter of a thin wire?","screw gauge",["metre scale","measuring cylinder","spring balance"],"A screw gauge is used for very small thicknesses or diameters such as a thin wire. Its fine screw mechanism allows measurements much smaller than those possible with an ordinary ruler.",["sci001-screw-gauge"]],
  [7,"Medium","Which instrument can measure the internal diameter of a tube more accurately than a metre scale?","vernier calipers",["stopwatch","beam balance","thermometer"],"Vernier calipers can measure internal and external diameters accurately. Its inside jaws are designed for internal dimensions, while other jaws can measure external dimensions.",["sci001-vernier-calipers"]],
  [7,"Medium","Which instrument is best suited to measure the volume of a liquid in a school laboratory?","measuring cylinder",["beam balance","screw gauge","spring balance"],"A measuring cylinder is designed to measure liquid volume. Graduated markings on the cylinder allow the liquid level to be read as a volume.",["sci001-measuring-cylinder"]],
  [7,"Medium","Which instrument would you use to measure a short time interval in a race?","stopwatch",["barometer","hydrometer","vernier calipers"],"A stopwatch is used to measure short time intervals. It is designed to measure elapsed time much more precisely than an ordinary clock.",["sci001-stopwatch"]],
  [7,"Medium","Which instrument directly compares an object's mass with standard masses?","beam balance",["spring balance","ammeter","barometer"],"A beam balance compares the mass of an object with standard masses. At balance, the unknown mass equals the total value of the standard masses on the other side.",["sci001-beam-balance"]],
  [7,"Medium","Which instrument measures force or weight using the extension of a spring?","spring balance",["beam balance","lactometer","voltmeter"],"A spring balance measures force or weight from the extension of a spring. The spring stretches by an amount related to the applied force, allowing the force to be read from a scale.",["sci001-spring-balance"]],
  [8,"Medium","Which quantity has no unit because it is a ratio of two densities?","relative density",["density","pressure","force"],"Relative density is a ratio of two densities, so the units cancel. Because numerator and denominator have the same unit, their units cancel completely.",["sci001-relative-density-unitless"]],
  [8,"Medium","What is the SI unit of density?","kg/m³",["kg·m³","N/m²","g/m"],"Density is mass per unit volume, so its SI unit is kg/m³. Mass is measured in kilograms and volume in cubic metres, giving kg/m³.",["sci001-density-unit"]],
  [8,"Medium","Which SI unit belongs to acceleration?","m/s²",["m/s","m²/s","N·m"],"Acceleration is change in velocity per unit time, so its SI unit is m/s². Velocity has unit m/s, so dividing its change by time gives m/s².",["sci001-acceleration-unit"]],
  [8,"Medium","Which SI unit belongs to area?","m²",["m","m³","m/s"],"Area is the product of two lengths, so its SI unit is square metre (m²). Each dimension contributes a metre, so multiplying length by breadth gives square metres.",["sci001-area-unit"]],
  [8,"Medium","Which SI unit belongs to volume?","m³",["m²","L","kg/m³"],"The SI unit of volume is cubic metre (m³). Volume involves three length dimensions, which is why the SI unit is cubic metre.",["sci001-volume-unit"]],
  [8,"Medium","Which of the following has the same SI unit as speed?","velocity",["acceleration","force","power"],"Speed and velocity are both measured in metre per second (m/s). The two quantities differ in meaning, but both use metre per second as their SI unit.",["sci001-speed-velocity-unit"]],
  [9,"Hard","Consider the statements:\nI. Kilogram is an SI base unit.\nII. Newton is an SI base unit.\nWhich is correct?","I only",["II only","Both I and II","Neither I nor II"],"Kilogram is a base unit. Newton is a derived unit of force. Newton depends on base units kg, m and s, so it is classified as a derived unit.",["sci001-mass-kilogram","sci001-force-newton"]],
  [9,"Hard","Consider the statements:\nI. Speed is a scalar quantity.\nII. Velocity is a vector quantity.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Speed needs magnitude only, while velocity also requires direction. This is the basic distinction between scalar speed and vector velocity.",["sci001-speed-scalar","sci001-velocity-vector"]],
  [9,"Hard","Consider the statements:\nI. A barometer measures atmospheric pressure.\nII. A hydrometer measures electric current.\nWhich is correct?","I only",["II only","Both I and II","Neither I nor II"],"A barometer measures atmospheric pressure. A hydrometer measures relative density of liquids, not current. Electric current is measured by an ammeter, so the hydrometer statement is incorrect.",["sci001-barometer-pressure","sci001-hydrometer-density"]],
  [9,"Hard","Consider the statements:\nI. 1 watt = 1 joule per second.\nII. 1 pascal = 1 newton per square metre.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Both relations are correct: W = J/s and Pa = N/m². These definitions connect the named SI units directly with their derived-unit expressions.",["sci001-power-watt-relation","sci001-pressure-pascal-relation"]],
  [9,"Hard","Consider the statements:\nI. Relative density has no unit.\nII. Density has SI unit kg/m³.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Relative density is a ratio and is unitless; density has SI unit kg/m³. The first statement describes a ratio, while the second describes an actual physical quantity with dimensions.",["sci001-relative-density-unitless","sci001-density-unit"]],
  [9,"Hard","Consider the statements:\nI. A beam balance measures mass.\nII. A spring balance measures force or weight.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"A beam balance compares masses, while a spring balance measures force or weight. The two instruments measure different physical quantities even though both may use calibrated scales.",["sci001-beam-balance","sci001-spring-balance"]],
  [10,"Hard","How many of the following are SI base units?\n1. metre\n2. kilogram\n3. newton\n4. second","Three",["One","Two","Four"],"Metre, kilogram and second are base units. Newton is a derived unit. Only metre, kilogram and second are base units in this list; newton is derived from them.",["sci001-length-metre","sci001-mass-kilogram","sci001-time-second","sci001-force-newton"]],
  [10,"Hard","How many of the following are vector quantities?\n1. displacement\n2. velocity\n3. speed\n4. acceleration","Three",["One","Two","Four"],"Displacement, velocity and acceleration are vectors. Speed is a scalar. Speed is excluded because it has magnitude only and no direction.",["sci001-displacement-vector","sci001-velocity-vector","sci001-speed-scalar","sci001-acceleration-vector"]],
  [10,"Hard","Which set is correctly matched?\n1. Ammeter — current\n2. Barometer — atmospheric pressure\n3. Lactometer — relative density of milk","All three",["1 and 2 only","2 and 3 only","1 and 3 only"],"All three instrument–measurement pairs are correct. These are standard instrument–quantity matches frequently used in basic measurement questions. Together they cover electrical, atmospheric and liquid-density measurements.",["sci001-ammeter-current","sci001-barometer-pressure","sci001-lactometer-milk"]],
  [10,"Hard","A quantity is measured in kg·m/s². Which statement is correct?","It is force and its SI unit is newton.",["It is pressure and its SI unit is pascal.","It is power and its SI unit is watt.","It is energy and its SI unit is joule."],"kg·m/s² is the derived SI expression for force, called the newton. The expression comes from mass multiplied by acceleration, exactly matching the definition of force.",["sci001-force-newton-relation"]],
  [10,"Hard","A student needs to measure the internal diameter of a pipe and the diameter of a thin wire. Which pair of instruments is most suitable?","Vernier calipers and screw gauge",["Screw gauge and barometer","Metre scale and stopwatch","Beam balance and hydrometer"],"Vernier calipers are suitable for internal diameter; a screw gauge is suitable for a thin wire. Each instrument is chosen because its measuring range and precision suit the dimension being measured.",["sci001-vernier-calipers","sci001-screw-gauge"]],
  [10,"Hard","Which statement correctly compares density and relative density?","Density has a unit; relative density is unitless.",["Both are unitless.","Both have SI unit kg/m³.","Density is unitless; relative density has SI unit kg/m³."],"Density is mass per unit volume and has SI unit kg/m³. Relative density is a ratio, so it has no unit. This difference is important: density is a physical quantity with dimensions, while relative density is a dimensionless comparison.",["sci001-density-unit","sci001-relative-density-unitless"]],
] as const);

function positionAnswer(answer: string, distractors: readonly [string, string, string], target: number) {
  const options = [answer, ...distractors];
  [options[0], options[target]] = [options[target], options[0]];
  return options;
}

export function generateSciCp001ReviewBatchV1(): SciCp001ReviewQuestion[] {
  return REVIEW_SPECS.map((spec, index) => {
    const [ql, difficulty, stem, answer, distractors, explanation, factIds] = spec;
    const correctIndex = index % 4;
    return {
      questionId: `SCI-CP001-V1-${String(index + 1).padStart(3, "0")}`,
      chapterId: "SCI-001",
      cpId: "SCI-CP-001",
      qlId: `SCI-001-QL-${String(ql).padStart(3, "0")}`,
      qlName: SCI_CP001_QL_NAMES_V1[ql],
      difficulty,
      stem,
      options: positionAnswer(answer, distractors, correctIndex),
      correctIndex,
      canonicalAnswer: answer,
      explanation,
      sourceIds: [...SOURCE_IDS],
      sourceFactIds: [...factIds],
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
}

export const SCI_CP001_REVIEW_BATCH_V1 = Object.freeze(
  generateSciCp001ReviewBatchV1().map((question) => Object.freeze(question)),
);

export function auditSciCp001ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of SCI_CP001_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const semantic = `${question.stem}::${question.canonicalAnswer}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (/NCERT|NIOS|sourceFact|review-only|runtimeRegistered|generator/i.test(`${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)) issues.push(`META:${question.questionId}`);
  }

  if (SCI_CP001_REVIEW_BATCH_V1.length !== 60) issues.push(`COUNT:${SCI_CP001_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 60) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let ql = 1; ql <= 10; ql += 1) {
    const qlId = `SCI-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 12) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "15,15,15,15") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: SCI_CP001_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
  };
}
