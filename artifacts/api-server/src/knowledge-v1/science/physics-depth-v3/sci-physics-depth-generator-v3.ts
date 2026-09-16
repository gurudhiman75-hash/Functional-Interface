import type { KnowledgeV1Difficulty } from "../../types";

export type PhysicsDepthQuestionV3 = {
  questionId: string;
  chapterId: "SCI-001";
  cpId: `SCI-CP-${string}`;
  familyId: string;
  family: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  semanticKey: string;
  sourceIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

const SOURCE_IDS: Record<string, string[]> = {
  "SCI-CP-001": ["NCERT-PHYSICS-XI-UNITS-MEASUREMENT", "NIOS-SECONDARY-SCIENCE-MEASUREMENT"],
  "SCI-CP-002": ["NCERT-SCIENCE-IX-MOTION", "NCERT-SCIENCE-IX-FORCE-LAWS-MOTION"],
  "SCI-CP-003": ["NCERT-SCIENCE-IX-WORK-ENERGY", "NIOS-SECONDARY-SCIENCE-WORK-ENERGY-MACHINES"],
  "SCI-CP-004": ["NCERT-SCIENCE-IX-GRAVITATION", "NIOS-SECONDARY-SCIENCE-GRAVITATION-FLUIDS"],
};

function fmt(value: number, max = 4): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(max).replace(/0+$/, "").replace(/\.$/, "");
}

function withUnit(value: number, unit = "", max = 4): string {
  return `${fmt(value, max)}${unit ? ` ${unit}` : ""}`;
}

function placeAnswer(values: string[], answer: string, targetIndex: number): string[] {
  const unique = [...new Set(values.filter((value) => value !== answer))];
  const out = unique.slice(0, 3);
  while (out.length < 3) out.push(`None of ${out.length + 1}`);
  out.splice(targetIndex, 0, answer);
  return out;
}

function numericDistractors(answer: number): number[] {
  const delta = Math.abs(answer) >= 100 ? 10 : Math.abs(answer) >= 10 ? 2 : Math.abs(answer) >= 1 ? 0.5 : 0.1;
  const candidates = [answer * 2, answer / 2, answer + delta, Math.max(delta, answer - delta), answer * 1.5, answer * 0.75];
  const seen = new Set<string>();
  const out: number[] = [];
  for (const value of candidates) {
    const key = fmt(value);
    if (value > 0 && key !== fmt(answer) && !seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
    if (out.length === 3) break;
  }
  return out;
}

function pushNumeric(
  out: PhysicsDepthQuestionV3[],
  cpId: `SCI-CP-${string}`,
  familyId: string,
  family: string,
  difficulty: KnowledgeV1Difficulty,
  stem: string,
  answerValue: number,
  unit: string,
  explanation: string,
  semanticKey: string,
  maxDecimals = 4,
  customDistractors?: number[],
): void {
  const answer = withUnit(answerValue, unit, maxDecimals);
  const distractorValues = customDistractors ?? numericDistractors(answerValue);
  const rawOptions = [answer, ...distractorValues.map((value) => withUnit(value, unit, maxDecimals))];
  const targetIndex = out.length % 4;
  const options = placeAnswer(rawOptions, answer, targetIndex);
  out.push({
    questionId: `SCI-PHYS-V3-${cpId}-${familyId}-${String(out.length + 1).padStart(3, "0")}`,
    chapterId: "SCI-001",
    cpId,
    familyId,
    family,
    difficulty,
    stem,
    options,
    correctIndex: options.indexOf(answer),
    canonicalAnswer: answer,
    explanation,
    semanticKey: `${cpId}|${familyId}|${semanticKey}`,
    sourceIds: [...SOURCE_IDS[cpId]],
    reviewOnly: true,
    runtimeRegistered: false,
  });
}

function generateCp001(): PhysicsDepthQuestionV3[] {
  const out: PhysicsDepthQuestionV3[] = [];
  const cp = "SCI-CP-001" as const;

  for (const kmh of [18, 36, 54, 72, 90, 108, 126, 144]) {
    const ms = kmh * 5 / 18;
    pushNumeric(out, cp, "SPEED-CONVERT-KMH-MS", "unit conversion", "Easy", `${kmh} km/h is equal to:`, ms, "m/s", `${kmh} × 5/18 = ${fmt(ms)} m/s.`, `kmh=${kmh}`);
  }
  for (const ms of [5, 10, 15, 20, 25, 30, 35, 40]) {
    const kmh = ms * 18 / 5;
    pushNumeric(out, cp, "SPEED-CONVERT-MS-KMH", "unit conversion", "Easy", `${ms} m/s is equal to:`, kmh, "km/h", `${ms} × 18/5 = ${fmt(kmh)} km/h.`, `ms=${ms}`);
  }

  for (const main of [1.2, 2.1, 3.4, 4.6]) {
    for (const coincidence of [2, 4, 6, 8, 9]) {
      const lc = 0.01;
      const reading = main + coincidence * lc;
      pushNumeric(out, cp, "VERNIER-READING", "instrument reading", "Medium", `A vernier calipers shows ${fmt(main, 1)} cm on the main scale. The ${coincidence}th vernier division coincides and the least count is 0.01 cm. What is the reading?`, reading, "cm", `Reading = main-scale reading + coincidence × least count = ${fmt(main, 1)} + ${coincidence} × 0.01 = ${fmt(reading, 2)} cm.`, `main=${main}|coincidence=${coincidence}`, 2);
    }
  }

  for (const pitch of [0.5, 1]) {
    for (const divisions of [50, 100]) {
      const lc = pitch / divisions;
      pushNumeric(out, cp, "SCREW-GAUGE-LEAST-COUNT", "least count", "Medium", `A screw gauge has pitch ${pitch} mm and ${divisions} divisions on its circular scale. Its least count is:`, lc, "mm", `Least count = pitch / number of circular-scale divisions = ${pitch}/${divisions} = ${fmt(lc, 3)} mm.`, `pitch=${pitch}|divisions=${divisions}`, 3);
      pushNumeric(out, cp, "SCREW-GAUGE-DIVISIONS", "least count reverse calculation", "Hard", `A screw gauge has pitch ${pitch} mm and least count ${fmt(lc, 3)} mm. How many circular-scale divisions does it have?`, divisions, "divisions", `Number of divisions = pitch / least count = ${pitch}/${fmt(lc, 3)} = ${divisions}.`, `pitch=${pitch}|lc=${fmt(lc, 3)}`, 0);
    }
  }

  for (const main of [1, 2, 3, 4]) {
    for (const circular of [10, 20, 30, 40]) {
      const lc = 0.01;
      const reading = main + circular * lc;
      pushNumeric(out, cp, "SCREW-GAUGE-READING", "instrument reading", "Medium", `A screw gauge has main-scale reading ${main} mm, circular-scale reading ${circular}, and least count 0.01 mm. Ignoring zero error, the measured value is:`, reading, "mm", `Reading = ${main} + ${circular} × 0.01 = ${fmt(reading, 2)} mm.`, `main=${main}|circular=${circular}`, 2);
    }
  }

  for (const trueValue of [50, 100, 200, 500]) {
    for (const percent of [1, 2, 5, 10]) {
      const measured = trueValue * (1 + percent / 100);
      pushNumeric(out, cp, "PERCENT-ERROR", "measurement error", "Medium", `The true value is ${trueValue} units, but an instrument reads ${fmt(measured, 2)} units. What is the percentage error?`, percent, "%", `Percentage error = |measured − true|/true × 100 = ${fmt(measured - trueValue, 2)}/${trueValue} × 100 = ${percent}%.`, `true=${trueValue}|measured=${fmt(measured, 2)}`, 2, [percent / 2, percent * 2, percent + 5]);
    }
  }

  for (const density of [0.5, 1, 2, 4]) {
    for (const volume of [50, 100, 200, 250]) {
      const mass = density * volume;
      pushNumeric(out, cp, "DENSITY-FROM-MASS-VOLUME", "density calculation", "Medium", `A sample has mass ${fmt(mass)} g and volume ${volume} cm³. Its density is:`, density, "g/cm³", `Density = mass/volume = ${fmt(mass)}/${volume} = ${fmt(density)} g/cm³.`, `mass=${mass}|volume=${volume}`, 2);
      pushNumeric(out, cp, "MASS-FROM-DENSITY-VOLUME", "density reverse calculation", "Medium", `A substance has density ${density} g/cm³ and volume ${volume} cm³. Its mass is:`, mass, "g", `Mass = density × volume = ${density} × ${volume} = ${fmt(mass)} g.`, `density=${density}|volume=${volume}`, 2);
    }
  }

  for (const area of [0.25, 0.5, 1, 2, 2.5, 5, 10, 20]) {
    const cm2 = area * 10000;
    pushNumeric(out, cp, "AREA-CONVERSION", "area unit conversion", "Medium", `${area} m² is equal to:`, cm2, "cm²", `1 m² = 10,000 cm², so ${area} m² = ${fmt(cm2)} cm².`, `m2=${area}`, 0);
  }

  for (const litres of [0.25, 0.5, 1, 2]) {
    const cm3 = litres * 1000;
    pushNumeric(out, cp, "VOLUME-CONVERSION-L-CM3", "volume unit conversion", "Easy", `${litres} litre is equal to:`, cm3, "cm³", `1 litre = 1000 cm³, so ${litres} litre = ${fmt(cm3)} cm³.`, `L=${litres}`, 0);
    pushNumeric(out, cp, "VOLUME-CONVERSION-CM3-L", "volume unit conversion", "Easy", `${fmt(cm3)} cm³ is equal to:`, litres, "litre", `1000 cm³ = 1 litre, so ${fmt(cm3)} cm³ = ${litres} litre.`, `cm3=${cm3}`, 2);
  }
  return out;
}

function generateCp002(): PhysicsDepthQuestionV3[] {
  const out: PhysicsDepthQuestionV3[] = [];
  const cp = "SCI-CP-002" as const;

  for (const speed of [5, 10, 15, 20]) {
    for (const time of [5, 10, 20, 30]) {
      const distance = speed * time;
      pushNumeric(out, cp, "SPEED-FROM-DISTANCE-TIME", "speed calculation", "Easy", `An object covers ${distance} m in ${time} s at uniform speed. Its speed is:`, speed, "m/s", `Speed = distance/time = ${distance}/${time} = ${speed} m/s.`, `d=${distance}|t=${time}`);
      pushNumeric(out, cp, "DISTANCE-FROM-SPEED-TIME", "distance calculation", "Easy", `An object moves at ${speed} m/s for ${time} s. How far does it travel?`, distance, "m", `Distance = speed × time = ${speed} × ${time} = ${distance} m.`, `v=${speed}|t=${time}`);
    }
  }

  for (const u of [0, 5, 10, 15]) {
    for (const a of [1, 2, 3, 4]) {
      for (const time of [5, 10]) {
        const v = u + a * time;
        pushNumeric(out, cp, "ACCELERATION-FROM-VELOCITY-CHANGE", "acceleration calculation", "Medium", `A body's velocity changes uniformly from ${u} m/s to ${v} m/s in ${time} s. Its acceleration is:`, a, "m/s²", `a = (v − u)/t = (${v} − ${u})/${time} = ${a} m/s².`, `u=${u}|v=${v}|t=${time}`);
      }
    }
  }

  for (const mass of [1, 2, 3, 4, 5]) {
    for (const a of [2, 3, 4, 5]) {
      const force = mass * a;
      pushNumeric(out, cp, "FORCE-MA", "Newton second-law calculation", "Medium", `What net force is needed to accelerate a ${mass} kg body at ${a} m/s²?`, force, "N", `F = ma = ${mass} × ${a} = ${force} N.`, `m=${mass}|a=${a}`);
    }
  }

  for (const mass of [1, 2, 4, 5]) {
    for (const velocity of [5, 10, 15, 20]) {
      const momentum = mass * velocity;
      pushNumeric(out, cp, "MOMENTUM-MV", "momentum calculation", "Medium", `A ${mass} kg body moves at ${velocity} m/s. Its momentum is:`, momentum, "kg·m/s", `p = mv = ${mass} × ${velocity} = ${momentum} kg·m/s.`, `m=${mass}|v=${velocity}`);
    }
  }

  for (const force of [10, 20, 30, 50]) {
    for (const time of [1, 2, 5]) {
      const impulse = force * time;
      pushNumeric(out, cp, "IMPULSE-FT", "impulse calculation", "Medium", `A constant force of ${force} N acts for ${time} s. The impulse is:`, impulse, "N·s", `Impulse = force × time = ${force} × ${time} = ${impulse} N·s. It equals the change in momentum.`, `F=${force}|t=${time}`);
    }
  }

  for (const velocity of [5, 10, 15, 20]) {
    for (const time of [2, 4, 6]) {
      const displacement = velocity * time;
      pushNumeric(out, cp, "VELOCITY-TIME-AREA", "graph interpretation", "Medium", `A velocity-time graph is a horizontal line at ${velocity} m/s for ${time} s. The displacement represented by the area under the graph is:`, displacement, "m", `Area under a velocity-time graph gives displacement: ${velocity} × ${time} = ${displacement} m.`, `v=${velocity}|t=${time}`);
    }
  }

  for (const mass of [1, 2, 3]) {
    for (const velocity of [2, 4]) {
      for (const radius of [1, 2]) {
        const force = mass * velocity * velocity / radius;
        pushNumeric(out, cp, "CENTRIPETAL-FORCE", "circular-motion application", "Hard", `A ${mass} kg body moves in a circle of radius ${radius} m at ${velocity} m/s. The centripetal force is:`, force, "N", `F = mv²/r = ${mass} × ${velocity}²/${radius} = ${fmt(force)} N.`, `m=${mass}|v=${velocity}|r=${radius}`);
      }
    }
  }

  const equalDistancePairs: Array<[number, number]> = [[30,60],[20,30],[40,60],[45,90],[50,75],[60,90],[24,40],[36,60]];
  for (const [v1, v2] of equalDistancePairs) {
    const avg = 2 * v1 * v2 / (v1 + v2);
    pushNumeric(out, cp, "AVERAGE-SPEED-EQUAL-DISTANCE", "average-speed reasoning", "Hard", `A vehicle covers two equal distances at ${v1} km/h and ${v2} km/h. Its average speed for the whole journey is:`, avg, "km/h", `For equal distances, average speed = 2v₁v₂/(v₁+v₂) = 2×${v1}×${v2}/(${v1}+${v2}) = ${fmt(avg)} km/h.`, `v1=${v1}|v2=${v2}`, 2);
  }
  return out;
}

function generateCp003(): PhysicsDepthQuestionV3[] {
  const out: PhysicsDepthQuestionV3[] = [];
  const cp = "SCI-CP-003" as const;

  for (const force of [10, 20, 50, 100]) {
    for (const distance of [2, 5, 10, 20]) {
      const work = force * distance;
      pushNumeric(out, cp, "WORK-FS", "work calculation", "Easy", `A force of ${force} N moves an object ${distance} m in the direction of the force. The work done is:`, work, "J", `W = Fs = ${force} × ${distance} = ${work} J.`, `F=${force}|s=${distance}`);
    }
  }

  for (const work of [100, 200, 500, 1000]) {
    for (const time of [2, 5, 10, 20]) {
      const power = work / time;
      pushNumeric(out, cp, "POWER-WT", "power calculation", "Easy", `A machine does ${work} J of work in ${time} s. Its power is:`, power, "W", `P = W/t = ${work}/${time} = ${fmt(power)} W.`, `W=${work}|t=${time}`, 2);
    }
  }

  for (const mass of [2, 4, 6, 8]) {
    for (const velocity of [2, 4, 6, 8]) {
      const ke = 0.5 * mass * velocity * velocity;
      pushNumeric(out, cp, "KINETIC-ENERGY", "kinetic-energy calculation", "Medium", `What is the kinetic energy of a ${mass} kg body moving at ${velocity} m/s?`, ke, "J", `KE = ½mv² = ½ × ${mass} × ${velocity}² = ${fmt(ke)} J.`, `m=${mass}|v=${velocity}`);
    }
  }

  for (const mass of [2, 5, 10, 20]) {
    for (const height of [2, 5, 10, 20]) {
      const pe = mass * 10 * height;
      pushNumeric(out, cp, "POTENTIAL-ENERGY", "potential-energy calculation", "Medium", `Using g = 10 m/s², what gravitational potential energy does a ${mass} kg body gain when raised through ${height} m?`, pe, "J", `PE = mgh = ${mass} × 10 × ${height} = ${pe} J.`, `m=${mass}|h=${height}`);
    }
  }

  for (const input of [100, 200, 500, 1000]) {
    for (const efficiency of [50, 60, 75, 80]) {
      const output = input * efficiency / 100;
      pushNumeric(out, cp, "MACHINE-EFFICIENCY", "machine efficiency", "Medium", `A machine receives ${input} J and gives ${fmt(output)} J of useful output. Its efficiency is:`, efficiency, "%", `Efficiency = useful output/input × 100 = ${fmt(output)}/${input} × 100 = ${efficiency}%.`, `input=${input}|output=${output}`, 0, [100 - efficiency, Math.max(10, efficiency - 20), Math.min(95, efficiency + 10)]);
    }
  }

  for (const effort of [10, 20, 50, 100]) {
    for (const ratio of [2, 3, 4]) {
      const load = effort * ratio;
      pushNumeric(out, cp, "MECHANICAL-ADVANTAGE", "mechanical advantage", "Medium", `A machine lifts a ${load} N load with an effort of ${effort} N. Its mechanical advantage is:`, ratio, "", `MA = load/effort = ${load}/${effort} = ${ratio}.`, `load=${load}|effort=${effort}`);
    }
  }

  for (const loadDistance of [1, 2, 5]) {
    for (const ratio of [2, 3, 4, 5]) {
      const effortDistance = loadDistance * ratio;
      pushNumeric(out, cp, "VELOCITY-RATIO", "velocity ratio", "Medium", `In a machine, the effort moves ${effortDistance} m while the load moves ${loadDistance} m. The velocity ratio is:`, ratio, "", `VR = distance moved by effort / distance moved by load = ${effortDistance}/${loadDistance} = ${ratio}.`, `ed=${effortDistance}|ld=${loadDistance}`);
    }
  }

  const maVrPairs: Array<[number, number]> = [[2,4],[3,4],[4,5],[3,5],[2,5],[4,8],[5,10],[6,8],[6,10],[7,10],[8,10],[9,10]];
  for (const [ma, vr] of maVrPairs) {
    const efficiency = ma / vr * 100;
    pushNumeric(out, cp, "EFFICIENCY-MA-VR", "machine relation", "Hard", `A machine has mechanical advantage ${ma} and velocity ratio ${vr}. Its efficiency is:`, efficiency, "%", `Efficiency = MA/VR × 100 = ${ma}/${vr} × 100 = ${fmt(efficiency)}%.`, `ma=${ma}|vr=${vr}`, 2, [efficiency / 2, Math.min(100, efficiency + 10), Math.max(10, efficiency - 10)]);
  }

  for (const load of [100, 200, 300, 400]) {
    for (const loadArm of [1, 2]) {
      for (const effortArm of [4, 5]) {
        const effort = load * loadArm / effortArm;
        pushNumeric(out, cp, "LEVER-MOMENT", "lever equilibrium", "Hard", `A lever balances a ${load} N load ${loadArm} m from the fulcrum. If the effort is applied ${effortArm} m from the fulcrum, the required effort is:`, effort, "N", `For equilibrium, effort × effort arm = load × load arm. Effort = ${load}×${loadArm}/${effortArm} = ${fmt(effort)} N.`, `load=${load}|la=${loadArm}|ea=${effortArm}`, 2);
      }
    }
  }
  return out;
}

function generateCp004(): PhysicsDepthQuestionV3[] {
  const out: PhysicsDepthQuestionV3[] = [];
  const cp = "SCI-CP-004" as const;

  for (const mass of [1, 2, 5, 10, 20, 25, 50, 100]) {
    const weight = mass * 10;
    pushNumeric(out, cp, "WEIGHT-MG", "weight calculation", "Easy", `Using g = 10 m/s², the weight of a ${mass} kg body is:`, weight, "N", `W = mg = ${mass} × 10 = ${weight} N.`, `m=${mass}`);
  }

  for (const factor of [2, 3, 4, 5]) {
    const fraction = 1 / (factor * factor);
    pushNumeric(out, cp, "GRAVITY-DISTANCE-RATIO", "inverse-square reasoning", "Hard", `If the separation between two masses becomes ${factor} times while the masses stay unchanged, the gravitational force becomes what fraction of its original value?`, fraction, "of original", `Gravitational force varies as 1/r², so the new force is 1/${factor}² = ${fmt(fraction)} of the original.`, `rFactor=${factor}`, 4, [1/factor, 1/(factor*factor*factor), Math.min(1, 2*fraction)]);
  }
  for (const massFactor of [0.5, 2, 3, 4]) {
    pushNumeric(out, cp, "GRAVITY-MASS-RATIO", "gravitation proportionality", "Medium", `The distance and one mass are unchanged. If the other mass becomes ${massFactor} times, the gravitational force becomes:`, massFactor, "times", `Gravitational force is directly proportional to each mass, so it becomes ${massFactor} times.`, `massFactor=${massFactor}`, 2);
  }

  for (const density of [0.8, 1, 1.2, 2]) {
    for (const volume of [50, 100, 200, 500]) {
      const mass = density * volume;
      pushNumeric(out, cp, "DENSITY-FLUID", "density calculation", "Medium", `A material has mass ${fmt(mass)} g and volume ${volume} cm³. Its density is:`, density, "g/cm³", `Density = mass/volume = ${fmt(mass)}/${volume} = ${density} g/cm³.`, `m=${mass}|V=${volume}`, 2);
      pushNumeric(out, cp, "VOLUME-FROM-DENSITY", "density reverse calculation", "Medium", `A material has mass ${fmt(mass)} g and density ${density} g/cm³. Its volume is:`, volume, "cm³", `Volume = mass/density = ${fmt(mass)}/${density} = ${volume} cm³.`, `m=${mass}|rho=${density}`);
    }
  }

  for (const force of [100, 200, 500, 1000]) {
    for (const area of [1, 2, 4, 5]) {
      const pressure = force / area;
      pushNumeric(out, cp, "PRESSURE-FA", "pressure calculation", "Medium", `A normal force of ${force} N acts uniformly on an area of ${area} m². The pressure is:`, pressure, "Pa", `P = F/A = ${force}/${area} = ${fmt(pressure)} Pa.`, `F=${force}|A=${area}`);
    }
  }

  for (const density of [800, 1000]) {
    for (const depth of [1, 2, 5, 10]) {
      const pressure = density * 10 * depth;
      pushNumeric(out, cp, "HYDROSTATIC-PRESSURE", "liquid pressure", "Hard", `Using g = 10 m/s², what gauge pressure is produced at depth ${depth} m in a liquid of density ${density} kg/m³?`, pressure, "Pa", `P = ρgh = ${density} × 10 × ${depth} = ${pressure} Pa.`, `rho=${density}|h=${depth}`);
    }
  }

  for (const inputForce of [10, 20, 50, 100]) {
    for (const areaRatio of [2, 5, 10, 20]) {
      const outputForce = inputForce * areaRatio;
      pushNumeric(out, cp, "HYDRAULIC-FORCE", "Pascal-law calculation", "Hard", `In a hydraulic machine, the output-piston area is ${areaRatio} times the input-piston area. If the input force is ${inputForce} N, the ideal output force is:`, outputForce, "N", `Equal pressure gives F₂/A₂ = F₁/A₁. Hence F₂ = ${inputForce} × ${areaRatio} = ${outputForce} N.`, `F1=${inputForce}|ratio=${areaRatio}`);
      pushNumeric(out, cp, "HYDRAULIC-INPUT-FORCE", "Pascal-law reverse calculation", "Hard", `A hydraulic machine has output-piston area ${areaRatio} times the input area and must provide ${outputForce} N. Ignoring losses, the required input force is:`, inputForce, "N", `F₁ = F₂/(A₂/A₁) = ${outputForce}/${areaRatio} = ${inputForce} N.`, `F2=${outputForce}|ratio=${areaRatio}`);
    }
  }

  for (const litres of [1, 2, 5, 10, 20, 50, 100, 200]) {
    const buoyant = litres * 10;
    pushNumeric(out, cp, "BUOYANT-FORCE-WATER", "Archimedes calculation", "Medium", `An object displaces ${litres} litre of water. Using g = 10 m/s² and water density 1000 kg/m³, the buoyant force is:`, buoyant, "N", `Displaced mass = ${litres} kg because 1 litre of water has mass 1 kg. Upthrust = weight of displaced water = ${litres} × 10 = ${buoyant} N.`, `litres=${litres}`);
  }

  for (const density of [500, 800, 900, 1000, 1200, 1500, 2000, 2500]) {
    const rd = density / 1000;
    pushNumeric(out, cp, "RELATIVE-DENSITY", "relative-density calculation", "Medium", `A substance has density ${density} kg/m³. Taking water density as 1000 kg/m³, its relative density is:`, rd, "", `Relative density = ${density}/1000 = ${fmt(rd)}.`, `rho=${density}`, 2);
  }

  for (const density of [500, 600, 750, 800]) {
    const fraction = density / 1000 * 100;
    pushNumeric(out, cp, "FLOATING-SUBMERGED-FRACTION", "flotation application", "Hard", `A body of density ${density} kg/m³ floats in water of density 1000 kg/m³. Approximately what percentage of its volume is submerged?`, fraction, "%", `For floating equilibrium, submerged fraction = density of body/density of liquid = ${density}/1000 = ${fmt(fraction)}%.`, `rhoBody=${density}`, 1);
  }

  for (const areaFactor of [2, 3, 4, 5]) {
    const pressurePercent = 100 / areaFactor;
    pushNumeric(out, cp, "PRESSURE-AREA-CHANGE", "condition-change reasoning", "Medium", `The force on a surface stays the same, but the contact area becomes ${areaFactor} times. The new pressure is what percentage of the original?`, pressurePercent, "%", `Since P = F/A, multiplying area by ${areaFactor} divides pressure by ${areaFactor}. New pressure = 100/${areaFactor} = ${fmt(pressurePercent, 2)}% of the original.`, `areaFactor=${areaFactor}`, 2);
  }
  return out;
}

export const SCI_PHYSICS_DEPTH_V3_TARGETS = {
  "SCI-CP-001": 124,
  "SCI-CP-002": 144,
  "SCI-CP-003": 132,
  "SCI-CP-004": 128,
} as const;

export function generatePhysicsDepthCpV3(cpId: keyof typeof SCI_PHYSICS_DEPTH_V3_TARGETS): PhysicsDepthQuestionV3[] {
  if (cpId === "SCI-CP-001") return generateCp001();
  if (cpId === "SCI-CP-002") return generateCp002();
  if (cpId === "SCI-CP-003") return generateCp003();
  return generateCp004();
}

export function generatePhysicsDepthAllV3(): PhysicsDepthQuestionV3[] {
  return (Object.keys(SCI_PHYSICS_DEPTH_V3_TARGETS) as Array<keyof typeof SCI_PHYSICS_DEPTH_V3_TARGETS>)
    .flatMap((cpId) => generatePhysicsDepthCpV3(cpId));
}

export type PhysicsDepthAuditV3 = {
  valid: boolean;
  errors: string[];
  totalQuestions: number;
  cpCounts: Record<string, number>;
  cpFamilyCounts: Record<string, number>;
  cpAnswerPositions: Record<string, [number, number, number, number]>;
};

export function auditPhysicsDepthV3(): PhysicsDepthAuditV3 {
  const errors: string[] = [];
  const all = generatePhysicsDepthAllV3();
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const cpCounts: Record<string, number> = {};
  const cpFamilies: Record<string, Set<string>> = {};
  const cpAnswerPositions: Record<string, [number, number, number, number]> = {};

  for (const q of all) {
    if (ids.has(q.questionId)) errors.push(`duplicate questionId ${q.questionId}`);
    ids.add(q.questionId);
    if (semantics.has(q.semanticKey)) errors.push(`duplicate semanticKey ${q.semanticKey}`);
    semantics.add(q.semanticKey);
    if (q.options.length !== 4 || new Set(q.options).size !== 4) errors.push(`${q.questionId}: invalid options`);
    if (q.correctIndex < 0 || q.options[q.correctIndex] !== q.canonicalAnswer) errors.push(`${q.questionId}: invalid answer key`);
    if (!q.explanation.trim()) errors.push(`${q.questionId}: missing explanation`);
    if (!q.sourceIds.length) errors.push(`${q.questionId}: missing provenance`);
    if (!q.reviewOnly || q.runtimeRegistered) errors.push(`${q.questionId}: lifecycle lock broken`);
    cpCounts[q.cpId] = (cpCounts[q.cpId] ?? 0) + 1;
    cpFamilies[q.cpId] ??= new Set<string>();
    cpFamilies[q.cpId].add(q.familyId);
    cpAnswerPositions[q.cpId] ??= [0, 0, 0, 0];
    cpAnswerPositions[q.cpId][q.correctIndex] += 1;
  }

  const cpFamilyCounts: Record<string, number> = {};
  for (const [cpId, expected] of Object.entries(SCI_PHYSICS_DEPTH_V3_TARGETS)) {
    const actual = cpCounts[cpId] ?? 0;
    if (actual !== expected) errors.push(`${cpId}: expected ${expected} V3 questions, found ${actual}`);
    cpFamilyCounts[cpId] = cpFamilies[cpId]?.size ?? 0;
    if (cpFamilyCounts[cpId] < 8) errors.push(`${cpId}: expected at least 8 solver/application families, found ${cpFamilyCounts[cpId]}`);
    const positions = cpAnswerPositions[cpId] ?? [0, 0, 0, 0];
    if (expected % 4 === 0 && positions.some((n) => n !== expected / 4)) errors.push(`${cpId}: answer positions not balanced: ${positions.join("/")}`);
  }
  const targetTotal = Object.values(SCI_PHYSICS_DEPTH_V3_TARGETS).reduce((sum, n) => sum + n, 0);
  if (all.length !== targetTotal) errors.push(`V3 total must be ${targetTotal}; found ${all.length}`);
  return { valid: errors.length === 0, errors, totalQuestions: all.length, cpCounts, cpFamilyCounts, cpAnswerPositions };
}
