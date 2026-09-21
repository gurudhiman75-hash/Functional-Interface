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

export type SciCp003ReviewQuestion = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: "SCI-CP-003";
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
  "NCERT-SCIENCE-IX-WORK-ENERGY",
  "NIOS-SECONDARY-SCIENCE-WORK-ENERGY-MACHINES",
]);

export const SCI_CP003_QL_NAMES_V1: Record<number, string> = {
  1: "Work definition and sign/zero-work conditions",
  2: "Unit and basic work calculation",
  3: "Energy forms and transformations",
  4: "Kinetic-energy relation and calculation",
  5: "Gravitational potential-energy relation and calculation",
  6: "Conservation of energy and mechanical-energy applications",
  7: "Power relation, watt and calculation",
  8: "Simple machines and mechanical advantage",
  9: "Statement I/II synthesis",
  10: "Mixed work-energy-power application",
};

const REVIEW_SPECS: readonly ReviewSpec[] = Object.freeze([
  [1,"Easy","In physics, work is done on an object when a force causes:","displacement in the direction of the force",["an increase in mass","a change in colour","a rise in temperature only"],"Mechanical work is done when an applied force produces displacement in its direction or has a component along the displacement. If the object does not move, mechanical work is zero even when a force is applied.",["sci003-work-condition"]],
  [1,"Easy","A person pushes a wall, but the wall does not move. What is the mechanical work done on the wall?","zero",["positive","negative","maximum"],"There is no displacement of the wall, so the mechanical work done on it is zero. The applied force may be large, but without displacement no mechanical work is transferred to the wall.",["sci003-zero-work-no-displacement"]],
  [1,"Easy","A porter holds a suitcase stationary above the ground. The mechanical work done on the suitcase is:","zero",["positive","negative","equal to its weight"],"The suitcase has no displacement while it is being held stationary, so the mechanical work done on it is zero. Muscles may use chemical energy, but the mechanical work on the stationary suitcase is zero.",["sci003-zero-work-stationary"]],
  [1,"Easy","When force and displacement are in the same direction, the work done by the force is generally:","positive",["negative","zero","undefined"],"Work is positive when the force has a component in the same direction as the displacement. This happens because force and displacement have components in the same direction.",["sci003-positive-work"]],
  [1,"Easy","When a force acts exactly opposite to the displacement, the work done by that force is:","negative",["positive","zero","always maximum"],"Work is negative when the force acts opposite to the displacement, as friction often does. Friction often does negative work because its force acts against the direction of motion.",["sci003-negative-work"]],
  [1,"Easy","A force acts perpendicular to the displacement of an object. The work done by that force is:","zero",["positive","negative","equal to force × displacement"],"For a force perpendicular to displacement, cos 90° = 0, so the work done is zero. The perpendicular force can change direction of motion without transferring energy through work.",["sci003-perpendicular-zero-work"]],

  [2,"Easy","What is the SI unit of work?","joule (J)",["watt (W)","newton (N)","pascal (Pa)"],"The SI unit of work is the joule (J). One joule is one newton metre. The joule is a derived unit equal to one newton metre.",["sci003-work-unit-joule"]],
  [2,"Easy","A force of 10 N moves an object 3 m in the direction of the force. How much work is done?","30 J",["13 J","3 J","300 J"],"Work = force × displacement = 10 × 3 = 30 J. Because force and displacement are parallel, the simple product F × s can be used directly.",["sci003-work-formula"]],
  [2,"Easy","A 5 N force moves an object 4 m in its direction. The work done is:","20 J",["9 J","1.25 J","40 J"],"Work = 5 N × 4 m = 20 J. The force acts through four metres, so multiplying the two quantities gives the transferred energy.",["sci003-work-formula"]],
  [2,"Easy","If 50 J of work is done by a constant 10 N force in its direction, the displacement is:","5 m",["0.2 m","40 m","500 m"],"Displacement = work ÷ force = 50 ÷ 10 = 5 m. Rearranging W = Fs gives displacement = work divided by force.",["sci003-work-formula"]],
  [2,"Easy","One joule is equal to:","1 N·m",["1 N/m","1 J/s","1 kg/m³"],"One joule is the work done when a force of one newton causes a displacement of one metre in its direction. This definition connects the unit of energy directly with force and displacement.",["sci003-joule-relation"]],
  [2,"Easy","A 20 N horizontal force moves a box 2 m in the same direction. Work done by the force is:","40 J",["10 J","22 J","400 J"],"Work = force × displacement = 20 × 2 = 40 J. The force and motion are in the same direction, so all of the force contributes to the work.",["sci003-work-formula"]],

  [3,"Easy","The energy possessed by a moving object is called:","kinetic energy",["potential energy","chemical energy","nuclear energy"],"Kinetic energy is the energy an object has because of its motion. A faster object generally has more kinetic energy if its mass remains the same.",["sci003-kinetic-definition"]],
  [3,"Easy","The energy stored in an object because of its position or configuration is called:","potential energy",["kinetic energy","sound energy","electrical current"],"Potential energy is stored energy linked to position or configuration. Gravitational and elastic energy are common examples of potential energy.",["sci003-potential-definition"]],
  [3,"Easy","A stretched bow stores:","potential energy",["kinetic energy","sound energy","light energy"],"A stretched bow stores elastic potential energy because of its deformation. Releasing the bow converts much of this stored energy into kinetic energy of the arrow.",["sci003-elastic-potential"]],
  [3,"Easy","As a stone falls freely from a height, its gravitational potential energy is converted into:","kinetic energy",["chemical energy","nuclear energy","magnetic energy"],"During free fall, gravitational potential energy decreases while kinetic energy increases. Ignoring air resistance, the loss of potential energy appears as an equal gain in kinetic energy.",["sci003-pe-to-ke"]],
  [3,"Easy","In an electric fan, electrical energy is converted into:","mechanical energy",["chemical energy","nuclear energy","gravitational potential energy"],"The motor in a fan converts electrical energy into mechanical rotational energy. The rotating blades are the visible mechanical output produced from electrical input energy.",["sci003-fan-energy-conversion"]],
  [3,"Easy","Food is a source of which form of stored energy?","chemical energy",["sound energy","magnetic energy","gravitational energy only"],"Food stores chemical energy that the body can convert into other useful forms. During metabolism, this chemical energy is released and used for movement, heat and other body functions.",["sci003-chemical-energy-food"]],

  [4,"Medium","Which expression gives the kinetic energy of a body of mass m moving with speed v?","½mv²",["mv","mgh","Fv"],"The kinetic energy of a body is KE = ½mv². The square on speed means changes in speed have a strong effect on kinetic energy.",["sci003-ke-formula"]],
  [4,"Medium","A 2 kg object moves at 3 m/s. Its kinetic energy is:","9 J",["6 J","18 J","3 J"],"KE = ½mv² = ½ × 2 × 3² = 9 J. Substituting the given values into ½mv² gives the result directly.",["sci003-ke-formula"]],
  [4,"Medium","If the speed of an object doubles while its mass stays the same, its kinetic energy becomes:","four times",["two times","half","eight times"],"Kinetic energy is proportional to v². Doubling speed makes kinetic energy 2² = 4 times. This square relationship is why doubling speed increases kinetic energy much more than doubling mass.",["sci003-ke-speed-square"]],
  [4,"Medium","If the mass of a moving object doubles while its speed remains unchanged, its kinetic energy becomes:","two times",["four times","half","unchanged"],"KE = ½mv², so at constant speed kinetic energy is directly proportional to mass. At fixed speed, kinetic energy changes in the same proportion as mass.",["sci003-ke-mass"]],
  [4,"Medium","Two objects have the same mass. One moves at 2 m/s and the other at 4 m/s. The second has how much kinetic energy compared with the first?","four times as much",["twice as much","the same","eight times as much"],"For equal masses, KE ∝ v². (4/2)² = 4. Doubling speed from 2 to 4 m/s multiplies the speed-squared term by four.",["sci003-ke-speed-square"]],
  [4,"Medium","A 4 kg object has 32 J of kinetic energy. Its speed is:","4 m/s",["2 m/s","8 m/s","16 m/s"],"32 = ½ × 4 × v² = 2v², so v² = 16 and v = 4 m/s. Solving the kinetic-energy equation for v gives the positive speed of 4 m/s.",["sci003-ke-formula"]],

  [5,"Medium","Near Earth's surface, gravitational potential energy is commonly calculated using:","mgh",["½mv²","F/t","mv"],"Gravitational potential energy near Earth's surface is PE = mgh. The reference level for height must be stated because gravitational potential energy depends on position.",["sci003-pe-formula"]],
  [5,"Medium","A 2 kg object is raised through 5 m. Taking g = 10 m/s², the gain in gravitational potential energy is:","100 J",["20 J","50 J","250 J"],"PE = mgh = 2 × 10 × 5 = 100 J. The calculation uses the gain in height, not the total path followed while lifting.",["sci003-pe-formula"]],
  [5,"Medium","If an object's height above the reference level doubles while mass and g remain unchanged, its gravitational potential energy becomes:","two times",["four times","half","unchanged"],"PE = mgh, so gravitational potential energy is directly proportional to height. With m and g fixed, the height term is the only changing factor.",["sci003-pe-height"]],
  [5,"Medium","A 5 kg load is lifted 2 m. Taking g = 10 m/s², the increase in potential energy is:","100 J",["25 J","50 J","250 J"],"PE = 5 × 10 × 2 = 100 J. Raising the load increases its stored gravitational energy by 100 joules.",["sci003-pe-formula"]],
  [5,"Medium","Two objects are at the same height. If one has twice the mass of the other, its gravitational potential energy is:","twice as large",["four times as large","half as large","the same"],"At the same height and g, PE = mgh is directly proportional to mass. At equal height and gravity, doubling mass doubles gravitational potential energy.",["sci003-pe-mass"]],
  [5,"Medium","A 10 kg object gains 500 J of gravitational potential energy. Taking g = 10 m/s², it was raised by:","5 m",["0.5 m","50 m","500 m"],"h = PE/(mg) = 500/(10 × 10) = 5 m. Rearranging PE = mgh gives height = PE divided by mg.",["sci003-pe-formula"]],

  [6,"Medium","The law of conservation of energy states that energy can:","change form but the total amount is conserved",["be created from nothing","be destroyed completely","increase without any energy input"],"Energy may be transformed from one form to another, but the total energy of an isolated system remains conserved. Energy can move between forms such as kinetic, potential, thermal and electrical without being created or destroyed.",["sci003-conservation-energy"]],
  [6,"Medium","Ignoring air resistance, as a freely falling object loses potential energy it gains:","kinetic energy",["mass","electric charge","temperature only"],"In free fall, gravitational potential energy is converted into kinetic energy. This conversion explains why a falling object speeds up as its height decreases.",["sci003-mechanical-energy-fall"]],
  [6,"Medium","At the highest point of a vertically thrown ball, which statement is correct if air resistance is ignored?","its kinetic energy is minimum and potential energy is maximum",["both kinetic and potential energy are zero","kinetic energy is maximum","potential energy is minimum"],"At the top, the speed is momentarily zero, so kinetic energy is minimum while gravitational potential energy is maximum. The ball still has gravitational potential energy at the top even though its instantaneous speed is zero.",["sci003-vertical-throw-energy"]],
  [6,"Medium","A pendulum bob moves from an extreme position toward its lowest point. Its energy changes from:","potential energy to kinetic energy",["kinetic energy to chemical energy","heat to potential energy","electrical energy to nuclear energy"],"As the bob descends, gravitational potential energy is converted into kinetic energy. At the lowest point, the pendulum's speed and kinetic energy are greatest in the ideal case.",["sci003-pendulum-energy"]],
  [6,"Medium","In an ideal frictionless system, the sum of kinetic and potential energy remains:","constant",["zero","continuously increasing","continuously decreasing"],"With no dissipative forces, total mechanical energy remains constant. Energy continuously shifts between kinetic and potential forms while their total stays unchanged.",["sci003-mechanical-energy-conservation"]],
  [6,"Medium","When a moving bicycle is stopped by brakes, much of its mechanical energy is converted into:","heat",["mass","electric charge","gravitational potential energy"],"Friction in the brakes converts mechanical energy into thermal energy. The heating of brake surfaces is evidence of this energy conversion.",["sci003-friction-energy-heat"]],

  [7,"Medium","Power is defined as:","work done per unit time",["force per unit area","mass × acceleration","energy stored per unit mass"],"Power measures how quickly work is done: P = W/t. A more powerful machine can perform the same work in less time.",["sci003-power-definition"]],
  [7,"Medium","What is the SI unit of power?","watt (W)",["joule (J)","newton (N)","pascal (Pa)"],"The SI unit of power is the watt. One watt equals one joule per second. The watt is therefore a rate unit rather than an amount of energy.",["sci003-power-watt"]],
  [7,"Medium","A machine does 600 J of work in 3 s. Its power is:","200 W",["1800 W","603 W","20 W"],"Power = work/time = 600/3 = 200 W. Dividing the work by the time gives the rate of energy transfer.",["sci003-power-formula"]],
  [7,"Medium","A 100 W device transfers energy at the rate of:","100 J each second",["100 J each minute","1 J each 100 seconds","100 N each metre"],"1 W = 1 J/s, so 100 W means 100 joules of energy transferred each second. Power tells how many joules are transferred during each second.",["sci003-watt-relation"]],
  [7,"Medium","Two machines do the same amount of work. The machine that finishes in less time has:","greater power",["less power","the same power in every case","zero power"],"For the same work, P = W/t; less time means greater power. For equal work, reducing the time increases the value of W/t.",["sci003-power-time"]],
  [7,"Medium","A motor has a power of 500 W and runs for 4 s. The work done is:","2000 J",["125 J","504 J","20,000 J"],"Work = power × time = 500 × 4 = 2000 J. Using W = Pt, multiplying 500 watts by 4 seconds gives 2000 joules.",["sci003-power-formula"]],

  [8,"Medium","The mechanical advantage of a machine is defined as:","load ÷ effort",["effort ÷ load","work ÷ time","distance ÷ speed"],"Mechanical advantage = load/effort. A value greater than one means the machine provides a larger load force than the applied effort.",["sci003-mechanical-advantage"]],
  [8,"Medium","A machine lifts a 200 N load with an effort of 50 N. Its mechanical advantage is:","4",["2","50","250"],"Mechanical advantage = load/effort = 200/50 = 4. The load force is four times the effort in this example. A mechanical advantage of four means the machine multiplies the effort force fourfold.",["sci003-mechanical-advantage"]],
  [8,"Medium","An inclined plane helps lift a load by:","reducing the force needed by increasing the distance over which it acts",["creating energy","removing the weight of the load","increasing the load's mass"],"An inclined plane lets the same gain in height be achieved with a smaller force acting over a longer distance. The machine trades a longer movement distance for a smaller required force.",["sci003-inclined-plane"]],
  [8,"Medium","In an ideal machine, the work output is:","equal to the work input",["greater than the work input","always zero","independent of the work input"],"An ideal machine has no energy loss, so work output equals work input. Real machines have losses, so their useful output work is lower than their input work.",["sci003-ideal-machine"]],
  [8,"Medium","Which statement best describes what a simple machine can do?","change the magnitude or direction of a force",["create extra energy","eliminate all work","increase mass without energy"],"A simple machine can make a task more convenient by changing force magnitude or direction, but it does not create energy. The convenience may come from force multiplication, direction change or a better point of application.",["sci003-simple-machine-role"]],
  [8,"Medium","A fixed pulley is commonly useful because it can:","change the direction of the applied force",["create mechanical energy","reduce the load's mass","make output work exceed input work"],"An ideal fixed pulley changes the direction of the effort, making lifting more convenient. It does not reduce the ideal force magnitude, but pulling downward can make lifting easier.",["sci003-fixed-pulley"]],

  [9,"Hard","Consider the statements:\nI. Work can be zero even when a force acts on an object.\nII. Work can be negative when force acts opposite to displacement.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Both are correct. Work is zero if there is no displacement or if force is perpendicular to displacement; it is negative when force opposes displacement. The sign and value of work depend on the relative directions of force and displacement.",["sci003-zero-work-no-displacement","sci003-negative-work"]],
  [9,"Hard","Consider the statements:\nI. Doubling speed doubles kinetic energy.\nII. Doubling mass at constant speed doubles kinetic energy.\nWhich is correct?","II only",["I only","Both I and II","Neither I nor II"],"KE = ½mv². Doubling speed makes KE four times, while doubling mass makes KE twice. The formula shows why speed has a squared effect while mass has only a linear effect.",["sci003-ke-speed-square","sci003-ke-mass"]],
  [9,"Hard","Consider the statements:\nI. Power tells how fast work is done.\nII. One watt equals one joule per second.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Both statements follow from P = W/t and the definition 1 W = 1 J/s. Both statements describe the same power relation in words and in SI units.",["sci003-power-definition","sci003-watt-relation"]],
  [9,"Hard","Consider the statements:\nI. An ideal machine can have work output greater than work input.\nII. A simple machine can change the direction of an applied force.\nWhich is correct?","II only",["I only","Both I and II","Neither I nor II"],"An ideal machine conserves work, so output cannot exceed input. A simple machine can change force direction. Changing force direction does not create energy, so output work cannot exceed input work in an ideal machine.",["sci003-ideal-machine","sci003-simple-machine-role"]],
  [9,"Hard","Consider the statements:\nI. At the highest point of a vertically thrown ball, its speed is momentarily zero.\nII. Ignoring air resistance, its gravitational potential energy is maximum there.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"At the highest point, the ball is momentarily at rest and has its maximum gravitational potential energy. At that instant all of the initial upward kinetic energy has been converted into gravitational potential energy.",["sci003-vertical-throw-energy"]],
  [9,"Hard","Consider the statements:\nI. Relative to the same reference level, gravitational potential energy depends on mass and height.\nII. Kinetic energy depends on mass and the square of speed.\nWhich is correct?","Both I and II",["I only","II only","Neither I nor II"],"Near Earth's surface PE = mgh, while KE = ½mv². These two formulas show the different roles of mass, height and speed in stored and motion energy.",["sci003-pe-formula","sci003-ke-formula"]],

  [10,"Hard","A 2 kg object is dropped from a height where it has 200 J of gravitational potential energy. Ignoring air resistance, just before reaching the ground its kinetic energy is approximately:","200 J",["100 J","400 J","0 J"],"By conservation of mechanical energy, the lost gravitational potential energy becomes kinetic energy, so KE is about 200 J. This result assumes negligible air resistance so mechanical energy is conserved during the fall.",["sci003-conservation-energy","sci003-mechanical-energy-fall"]],
  [10,"Hard","A machine does 1200 J of work in 6 s. Another does the same work in 4 s. Which is correct?","the second machine is more powerful",["the first machine is more powerful","both have the same power","power cannot be compared without their masses"],"For equal work, the machine taking less time has greater power. Their powers are 200 W and 300 W respectively. Power comparison depends on work and time, so the shorter completion time gives the larger power.",["sci003-power-formula","sci003-power-time"]],
  [10,"Hard","A 1 kg object moving at 4 m/s and a 4 kg object moving at 2 m/s are compared. Their kinetic energies are:","equal",["greater for the 1 kg object","greater for the 4 kg object","both zero"],"First KE = ½×1×4² = 8 J. Second KE = ½×4×2² = 8 J, so they are equal. Different masses and speeds can still produce the same kinetic energy because speed is squared.",["sci003-ke-formula"]],
  [10,"Hard","A 100 N load is lifted vertically by 2 m in 4 s. Ignoring losses, the average power used is:","50 W",["25 W","100 W","200 W"],"Work = 100 × 2 = 200 J. Power = 200/4 = 50 W. The calculation first finds the work against the load and then divides by the lifting time.",["sci003-work-formula","sci003-power-formula"]],
  [10,"Hard","A frictionless machine has mechanical advantage 5. If the load is 500 N, the required effort is:","100 N",["2500 N","505 N","5 N"],"Mechanical advantage = load/effort. Effort = 500/5 = 100 N. Mechanical advantage rearranges to effort = load divided by mechanical advantage.",["sci003-mechanical-advantage"]],
  [10,"Hard","A ball rolls down a smooth slope from rest. Which sequence best describes its energy change?","potential energy decreases while kinetic energy increases",["both potential and kinetic energy continuously increase","kinetic energy decreases while potential energy increases","both become zero before the bottom"],"As the ball moves downward on a smooth slope, gravitational potential energy is converted into kinetic energy. With no frictional loss, the decrease in potential energy appears as an equal increase in kinetic energy.",["sci003-pe-to-ke","sci003-conservation-energy"]],
]);

export function generateSciCp003ReviewBatchV1(): SciCp003ReviewQuestion[] {
  return REVIEW_SPECS.map((spec, index) => {
    const [ql, difficulty, stem, answer, distractors, explanation, factIds] = spec;
    const base = [answer, ...distractors];
    const shift = index % 4;
    const options = [...base.slice(shift), ...base.slice(0, shift)];
    return {
      questionId: `SCI-CP003-V1-${String(index + 1).padStart(3, "0")}`,
      chapterId: "SCI-001",
      cpId: "SCI-CP-003",
      qlId: `SCI-003-QL-${String(ql).padStart(3, "0")}`,
      qlName: SCI_CP003_QL_NAMES_V1[ql],
      difficulty,
      stem,
      options,
      correctIndex: options.indexOf(answer),
      canonicalAnswer: answer,
      explanation,
      sourceIds: [...SOURCE_IDS],
      sourceFactIds: [...factIds],
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
}

export const SCI_CP003_REVIEW_BATCH_V1 = Object.freeze(
  generateSciCp003ReviewBatchV1().map((question) => Object.freeze(question)),
);

export function auditSciCp003ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of SCI_CP003_REVIEW_BATCH_V1) {
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
    if (/generator|sourceFact|review-only|runtimeRegistered|qualification gate/i.test(`${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)) issues.push(`META:${question.questionId}`);
  }

  if (SCI_CP003_REVIEW_BATCH_V1.length !== 60) issues.push(`COUNT:${SCI_CP003_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 60) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let i = 1; i <= 10; i += 1) {
    const qlId = `SCI-003-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (answerPositions.join(",") !== "15,15,15,15") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 12) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: SCI_CP003_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
  };
}
