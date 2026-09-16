import type { KnowledgeV1Difficulty } from "../../types";
import { SCI_PHYSICS_EXHAUSTIVE_CP_META_V2 } from "../physics-exhaustive-v2/sci-physics-exhaustive-domain-v2";

export type PhysicsDepthWave2QuestionV3 = {
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

const fmt = (value: number, max = 6): string => Number.isInteger(value)
  ? String(value)
  : value.toFixed(max).replace(/0+$/, "").replace(/\.$/, "");

const withUnit = (value: number, unit = "", max = 6): string => `${fmt(value, max)}${unit ? ` ${unit}` : ""}`;

function sourceIds(cpId: `SCI-CP-${string}`): string[] {
  const cp = SCI_PHYSICS_EXHAUSTIVE_CP_META_V2.find((entry) => entry.cpId === cpId);
  if (!cp) throw new Error(`Unknown Physics CP ${cpId}`);
  return [...cp.sourceIds];
}

function distinctDistractors(answerValue: number, custom: number[] = []): number[] {
  const delta = Math.abs(answerValue) >= 1000 ? 100 : Math.abs(answerValue) >= 100 ? 10 : Math.abs(answerValue) >= 10 ? 2 : Math.abs(answerValue) >= 1 ? 0.5 : 0.05;
  const pool = [...custom, answerValue * 2, answerValue / 2, answerValue * 1.5, answerValue * 0.75, answerValue + delta, Math.max(delta, answerValue - delta), answerValue * 3];
  const out: number[] = [];
  const seen = new Set<string>([fmt(answerValue)]);
  for (const value of pool) {
    if (!(value > 0)) continue;
    const key = fmt(value);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
    if (out.length === 3) break;
  }
  if (out.length !== 3) throw new Error(`Could not build numerical distractors for ${answerValue}`);
  return out;
}

function pushNumeric(
  out: PhysicsDepthWave2QuestionV3[],
  cpId: `SCI-CP-${string}`,
  familyId: string,
  family: string,
  difficulty: KnowledgeV1Difficulty,
  stem: string,
  answerValue: number,
  unit: string,
  explanation: string,
  semanticKey: string,
  maxDecimals = 6,
  customDistractors: number[] = [],
): void {
  const answer = withUnit(answerValue, unit, maxDecimals);
  const distractors = distinctDistractors(answerValue, customDistractors).map((value) => withUnit(value, unit, maxDecimals));
  const targetIndex = out.length % 4;
  const options = distractors.slice();
  options.splice(targetIndex, 0, answer);
  out.push({
    questionId: `SCI-PHYS-V3-${cpId}-${familyId}-${String(out.length + 1).padStart(3, "0")}`,
    chapterId: "SCI-001",
    cpId,
    familyId,
    family,
    difficulty,
    stem,
    options,
    correctIndex: targetIndex,
    canonicalAnswer: answer,
    explanation,
    semanticKey: `${cpId}|${familyId}|${semanticKey}`,
    sourceIds: sourceIds(cpId),
    reviewOnly: true,
    runtimeRegistered: false,
  });
}

function cp005(): PhysicsDepthWave2QuestionV3[] {
  const out: PhysicsDepthWave2QuestionV3[] = [];
  const cp = "SCI-CP-005" as const;

  for (const c of [-40, -20, 0, 20, 25, 37, 50, 100]) {
    const k = c + 273;
    pushNumeric(out, cp, "CELSIUS-KELVIN", "temperature-scale conversion", "Easy", `${c}°C is approximately equal to:`, k, "K", `K = °C + 273 = ${c} + 273 = ${k} K.`, `C=${c}`, 0, [c, k + 100, Math.max(1, k - 100)]);
  }
  for (const k of [233, 253, 273, 293, 298, 310, 323, 373]) {
    const c = k - 273;
    const answer = c === 0 ? 0.000001 : Math.abs(c);
    if (c >= 0) {
      pushNumeric(out, cp, "KELVIN-CELSIUS", "temperature-scale conversion", "Easy", `${k} K is approximately equal to:`, c || 0.000001, "°C", `°C = K − 273 = ${k} − 273 = ${c}°C.`, `K=${k}`, 0, [Math.abs(c) + 10, Math.abs(c) + 20, Math.abs(c) + 273]);
      const q = out[out.length - 1];
      if (c === 0) {
        const zeroAnswer = "0 °C";
        q.canonicalAnswer = zeroAnswer;
        q.options[q.correctIndex] = zeroAnswer;
      }
    } else {
      pushNumeric(out, cp, "KELVIN-CELSIUS-BELOW-ZERO", "temperature-scale conversion", "Medium", `${k} K is approximately how many degrees below 0°C?`, Math.abs(c), "°C below zero", `°C = ${k} − 273 = ${c}°C, which is ${Math.abs(c)}°C below zero.`, `K=${k}`);
    }
  }

  for (const mass of [0.5, 1, 2, 5]) {
    for (const deltaT of [5, 10, 20, 25]) {
      const q = mass * 4200 * deltaT;
      pushNumeric(out, cp, "HEAT-Q-MCDT", "specific-heat calculation", "Medium", `How much heat is needed to raise ${mass} kg of water by ${deltaT}°C? Take specific heat of water as 4200 J/kg°C.`, q, "J", `Q = mcΔT = ${mass} × 4200 × ${deltaT} = ${fmt(q)} J.`, `m=${mass}|dt=${deltaT}`);
      pushNumeric(out, cp, "SPECIFIC-HEAT-REVERSE", "specific-heat reverse calculation", "Hard", `A ${mass} kg sample requires ${fmt(q)} J to rise by ${deltaT}°C. Its specific heat capacity is:`, 4200, "J/kg°C", `c = Q/(mΔT) = ${fmt(q)}/(${mass}×${deltaT}) = 4200 J/kg°C.`, `m=${mass}|q=${q}|dt=${deltaT}`);
    }
  }

  for (const heatCapacity of [100, 200, 500, 1000]) {
    for (const deltaT of [2, 5, 10, 20]) {
      const q = heatCapacity * deltaT;
      pushNumeric(out, cp, "HEAT-CAPACITY", "heat-capacity calculation", "Medium", `A body needs ${q} J to increase its temperature by ${deltaT}°C. Its heat capacity is:`, heatCapacity, "J/°C", `Heat capacity = Q/ΔT = ${q}/${deltaT} = ${heatCapacity} J/°C.`, `Q=${q}|dt=${deltaT}`);
    }
  }

  const mixingPairs: Array<[number, number]> = [[10,30],[20,40],[20,60],[30,50],[40,80],[50,70],[60,100],[25,75]];
  for (const [t1, t2] of mixingPairs) {
    const finalT = (t1 + t2) / 2;
    pushNumeric(out, cp, "CALORIMETRY-EQUAL-WATER", "calorimetry mixing", "Hard", `Equal masses of water at ${t1}°C and ${t2}°C are mixed without heat loss. The final temperature is:`, finalT, "°C", `For equal masses of the same substance with no heat loss, final temperature = (${t1}+${t2})/2 = ${fmt(finalT)}°C.`, `t1=${t1}|t2=${t2}`);
  }

  for (const mass of [0.1, 0.2, 0.5, 1]) {
    const qIce = mass * 334;
    pushNumeric(out, cp, "LATENT-HEAT-FUSION", "latent-heat calculation", "Medium", `How much heat is needed to melt ${mass} kg of ice at 0°C? Take latent heat of fusion as 334 kJ/kg.`, qIce, "kJ", `Q = mL = ${mass} × 334 = ${fmt(qIce)} kJ.`, `m=${mass}|Lf=334`, 2);
    const qSteam = mass * 2260;
    pushNumeric(out, cp, "LATENT-HEAT-VAPORIZATION", "latent-heat calculation", "Medium", `How much heat is needed to convert ${mass} kg of water at its boiling point into steam? Take latent heat of vaporization as 2260 kJ/kg.`, qSteam, "kJ", `Q = mL = ${mass} × 2260 = ${fmt(qSteam)} kJ.`, `m=${mass}|Lv=2260`, 2);
  }

  for (const length of [1, 2, 5, 10]) {
    for (const deltaT of [10, 20, 50, 100]) {
      const expansionMm = 1e-5 * length * deltaT * 1000;
      pushNumeric(out, cp, "LINEAR-EXPANSION", "thermal-expansion calculation", "Hard", `A rod is ${length} m long. If its linear expansion coefficient is 1×10⁻⁵/°C and its temperature rises by ${deltaT}°C, its increase in length is:`, expansionMm, "mm", `ΔL = αLΔT = 1×10⁻⁵ × ${length} × ${deltaT} m = ${fmt(expansionMm)} mm.`, `L=${length}|dt=${deltaT}`, 3);
    }
  }
  return out;
}

function cp006(): PhysicsDepthWave2QuestionV3[] {
  const out: PhysicsDepthWave2QuestionV3[] = [];
  const cp = "SCI-CP-006" as const;
  const speed = 340;

  for (const frequency of [100, 200, 250, 340, 500, 680, 1000, 1700]) {
    const wavelength = speed / frequency;
    pushNumeric(out, cp, "WAVELENGTH-VF", "wave relation", "Medium", `Sound travels at 340 m/s with frequency ${frequency} Hz. Its wavelength is:`, wavelength, "m", `λ = v/f = 340/${frequency} = ${fmt(wavelength)} m.`, `f=${frequency}`, 4);
  }
  for (const wavelength of [0.2, 0.34, 0.5, 0.68, 1, 1.7, 2, 3.4]) {
    const frequency = speed / wavelength;
    pushNumeric(out, cp, "FREQUENCY-VLAMBDA", "wave relation", "Medium", `A sound wave travels at 340 m/s and has wavelength ${wavelength} m. Its frequency is:`, frequency, "Hz", `f = v/λ = 340/${wavelength} = ${fmt(frequency)} Hz.`, `lambda=${wavelength}`, 2);
  }

  for (const frequency of [10, 20, 25, 50, 100, 200, 500, 1000]) {
    const period = 1 / frequency;
    pushNumeric(out, cp, "TIME-PERIOD", "frequency-period relation", "Medium", `A vibration has frequency ${frequency} Hz. Its time period is:`, period, "s", `T = 1/f = 1/${frequency} = ${fmt(period)} s.`, `f=${frequency}`, 4);
    pushNumeric(out, cp, "FREQUENCY-FROM-PERIOD", "frequency-period reverse relation", "Medium", `A vibration has time period ${fmt(period, 4)} s. Its frequency is:`, frequency, "Hz", `f = 1/T = 1/${fmt(period, 4)} = ${frequency} Hz.`, `T=${fmt(period,4)}`);
  }

  for (const time of [0.1,0.2,0.3,0.4,0.5,0.6,0.8,1]) {
    const distance = speed * time / 2;
    pushNumeric(out, cp, "ECHO-DISTANCE", "echo calculation", "Medium", `An echo returns ${time} s after a sound is produced. Taking sound speed as 340 m/s, the reflecting surface is:`, distance, "m away", `Echo time is for the round trip, so distance = vt/2 = 340×${time}/2 = ${fmt(distance)} m.`, `t=${time}`);
  }
  for (const distance of [17,34,51,68,85,102,136,170]) {
    const time = 2 * distance / speed;
    pushNumeric(out, cp, "ECHO-TIME", "echo reverse calculation", "Medium", `A reflecting wall is ${distance} m away. Taking sound speed as 340 m/s, the echo returns after:`, time, "s", `Round-trip distance = 2×${distance} m, so t = 2d/v = ${2*distance}/340 = ${fmt(time)} s.`, `d=${distance}`, 3);
  }

  for (const time of [0.2,0.4,0.6,0.8,1,1.2,1.4,1.6]) {
    const depth = 1500 * time / 2;
    pushNumeric(out, cp, "SONAR-DEPTH", "SONAR calculation", "Hard", `A SONAR pulse in seawater returns after ${time} s. If sound speed in water is 1500 m/s, the depth is:`, depth, "m", `Depth = vt/2 = 1500×${time}/2 = ${fmt(depth)} m.`, `t=${time}`);
  }

  for (const baseFrequency of [100, 200]) {
    for (const factor of [2,3,4,5]) {
      const newFrequency = baseFrequency * factor;
      pushNumeric(out, cp, "PITCH-FREQUENCY-CHANGE", "pitch-frequency condition change", "Easy", `A tone has frequency ${baseFrequency} Hz. If its frequency becomes ${factor} times, the new frequency is:`, newFrequency, "Hz", `New frequency = ${baseFrequency} × ${factor} = ${newFrequency} Hz. Higher frequency means higher pitch.`, `f=${baseFrequency}|factor=${factor}`);
    }
  }

  for (const amplitudeFactor of [2,3,4,5]) {
    const intensityFactor = amplitudeFactor * amplitudeFactor;
    pushNumeric(out, cp, "INTENSITY-AMPLITUDE", "amplitude-intensity relation", "Hard", `If the amplitude of a sound wave becomes ${amplitudeFactor} times while other conditions stay the same, its intensity becomes approximately:`, intensityFactor, "times", `Intensity is proportional to amplitude², so it becomes ${amplitudeFactor}² = ${intensityFactor} times.`, `A-factor=${amplitudeFactor}`);
  }

  for (const [f1, f2] of [[256,260],[300,306],[440,448],[500,512]] as Array<[number,number]>) {
    const beat = Math.abs(f1 - f2);
    pushNumeric(out, cp, "BEAT-FREQUENCY", "beat-frequency calculation", "Hard", `Two tones of ${f1} Hz and ${f2} Hz are sounded together. Their beat frequency is:`, beat, "Hz", `Beat frequency = |f₂ − f₁| = |${f2} − ${f1}| = ${beat} Hz.`, `f1=${f1}|f2=${f2}`);
  }
  return out;
}

function cp007(): PhysicsDepthWave2QuestionV3[] {
  const out: PhysicsDepthWave2QuestionV3[] = [];
  const cp = "SCI-CP-007" as const;

  for (const focalCm of [10,20,25,50]) {
    const power = 100 / focalCm;
    pushNumeric(out, cp, "LENS-POWER-CONVEX", "lens power", "Medium", `A convex lens has focal length ${focalCm} cm. Its power is:`, power, "D", `P = 1/f(m) = 100/${focalCm} = ${fmt(power)} D. Convex-lens power is positive.`, `convex-f=${focalCm}`);
    pushNumeric(out, cp, "LENS-POWER-CONCAVE-MAGNITUDE", "lens power", "Medium", `A concave lens has focal-length magnitude ${focalCm} cm. What is the magnitude of its power?`, power, "D", `|P| = 1/|f(m)| = 100/${focalCm} = ${fmt(power)} D; the actual power is negative for a concave lens.`, `concave-f=${focalCm}`);
  }

  for (const power of [1,2,4,5]) {
    const focalCm = 100 / power;
    pushNumeric(out, cp, "FOCAL-LENGTH-FROM-POWER-CONVEX", "lens power reverse calculation", "Medium", `A convex lens has power +${power} D. Its focal length is:`, focalCm, "cm", `f(m) = 1/P, so f = 100/${power} = ${fmt(focalCm)} cm.`, `P=+${power}`);
    pushNumeric(out, cp, "FOCAL-LENGTH-FROM-POWER-CONCAVE", "lens power reverse calculation", "Medium", `A concave lens has power −${power} D. The magnitude of its focal length is:`, focalCm, "cm", `|f| = 1/|P|, so |f| = 100/${power} = ${fmt(focalCm)} cm.`, `P=-${power}`);
  }

  for (const radius of [10,20,30,40,50,60,80,100]) {
    const focal = radius / 2;
    pushNumeric(out, cp, "MIRROR-RADIUS-FOCAL", "spherical-mirror relation", "Easy", `A spherical mirror has radius of curvature ${radius} cm. The magnitude of its focal length is:`, focal, "cm", `For a spherical mirror, f = R/2 = ${radius}/2 = ${focal} cm.`, `R=${radius}`);
  }

  for (const speed of [1.5e8,2e8,2.4e8,2.5e8]) {
    const n = 3e8 / speed;
    pushNumeric(out, cp, "REFRACTIVE-INDEX", "refractive-index calculation", "Medium", `Light travels through a medium at ${fmt(speed)} m/s. Taking c = 300000000 m/s, the refractive index is:`, n, "", `n = c/v = 300000000/${fmt(speed)} = ${fmt(n)}.`, `v=${speed}`, 3);
  }
  for (const n of [1.2,1.25,1.5,2]) {
    const speed = 3e8 / n;
    pushNumeric(out, cp, "LIGHT-SPEED-IN-MEDIUM", "refractive-index reverse calculation", "Medium", `A medium has refractive index ${n}. Taking c = 300000000 m/s, light travels in it at:`, speed, "m/s", `v = c/n = 300000000/${n} = ${fmt(speed)} m/s.`, `n=${n}`, 0);
  }

  for (const objectHeight of [1,2,4,5]) {
    for (const magnification of [0.5,1,2,3]) {
      const imageHeight = objectHeight * magnification;
      pushNumeric(out, cp, "MAGNIFICATION-HEIGHT", "magnification calculation", "Medium", `An optical system forms an image ${fmt(imageHeight)} cm high from an object ${objectHeight} cm high. The magnitude of magnification is:`, magnification, "", `|m| = image height/object height = ${fmt(imageHeight)}/${objectHeight} = ${magnification}.`, `ho=${objectHeight}|hi=${imageHeight}`, 2);
    }
  }

  const powerPairs: Array<[number,number]> = [[1,1],[1,2],[2,2],[2,3],[3,4],[-1,2],[-2,3],[-1,4]];
  for (const [p1,p2] of powerPairs) {
    const total = p1 + p2;
    pushNumeric(out, cp, "LENSES-IN-CONTACT", "combined lens power", "Hard", `Two thin lenses in contact have powers ${p1 >= 0 ? "+" : ""}${p1} D and ${p2 >= 0 ? "+" : ""}${p2} D. Their combined power is:`, total, "D", `For lenses in contact, P = P₁ + P₂ = ${p1} + ${p2} = ${total} D.`, `p1=${p1}|p2=${p2}`, 2);
  }

  for (const distance of [5,10,15,20,25,30,40,50]) {
    pushNumeric(out, cp, "PLANE-MIRROR-DISTANCE", "plane-mirror image position", "Easy", `An object is ${distance} cm in front of a plane mirror. The image forms how far behind the mirror?`, distance, "cm", `A plane mirror forms the image as far behind the mirror as the object is in front, so the distance is ${distance} cm.`, `d=${distance}`);
  }
  return out;
}

function cp008(): PhysicsDepthWave2QuestionV3[] {
  const out: PhysicsDepthWave2QuestionV3[] = [];
  const cp = "SCI-CP-008" as const;

  for (const current of [1,2,5,10]) {
    for (const time of [2,5,10,20]) {
      const charge = current * time;
      pushNumeric(out, cp, "CURRENT-QT", "current calculation", "Easy", `${charge} C of charge passes a point in ${time} s. The current is:`, current, "A", `I = Q/t = ${charge}/${time} = ${current} A.`, `Q=${charge}|t=${time}`);
      pushNumeric(out, cp, "CHARGE-IT", "charge calculation", "Easy", `A current of ${current} A flows for ${time} s. The charge transferred is:`, charge, "C", `Q = It = ${current} × ${time} = ${charge} C.`, `I=${current}|t=${time}`);
    }
  }

  for (const work of [20,50,100,200]) {
    for (const charge of [2,5,10,20]) {
      const voltage = work / charge;
      pushNumeric(out, cp, "POTENTIAL-WQ", "potential-difference calculation", "Medium", `${work} J of work moves ${charge} C of charge between two points. The potential difference is:`, voltage, "V", `V = W/Q = ${work}/${charge} = ${fmt(voltage)} V.`, `W=${work}|Q=${charge}`, 2);
    }
  }

  for (const resistance of [2,5,10,20]) {
    for (const current of [1,2,5,10]) {
      const voltage = resistance * current;
      pushNumeric(out, cp, "OHMS-LAW-V", "Ohm-law calculation", "Medium", `A ${resistance} Ω resistor carries ${current} A. The potential difference across it is:`, voltage, "V", `V = IR = ${current} × ${resistance} = ${voltage} V.`, `R=${resistance}|I=${current}`);
      pushNumeric(out, cp, "OHMS-LAW-R", "Ohm-law reverse calculation", "Medium", `A conductor carries ${current} A when ${voltage} V is applied. Its resistance is:`, resistance, "Ω", `R = V/I = ${voltage}/${current} = ${resistance} Ω.`, `V=${voltage}|I=${current}`);
    }
  }

  for (const r1 of [1,2,5,10]) {
    for (const r2 of [2,5,10,20]) {
      const total = r1 + r2;
      pushNumeric(out, cp, "SERIES-RESISTANCE", "series-resistance calculation", "Medium", `Two resistors of ${r1} Ω and ${r2} Ω are connected in series. Their equivalent resistance is:`, total, "Ω", `In series, resistances add: R = ${r1} + ${r2} = ${total} Ω.`, `r1=${r1}|r2=${r2}`);
    }
  }

  for (const resistance of [2,4,6,8,10,20,50,100]) {
    const equivalent = resistance / 2;
    pushNumeric(out, cp, "PARALLEL-EQUAL-RESISTORS", "parallel-resistance calculation", "Medium", `Two identical ${resistance} Ω resistors are connected in parallel. Their equivalent resistance is:`, equivalent, "Ω", `Two equal resistors R in parallel give R/2 = ${resistance}/2 = ${fmt(equivalent)} Ω.`, `R=${resistance}`, 2);
  }

  for (const voltage of [12,24,120,240]) {
    for (const current of [1,2,5,10]) {
      const power = voltage * current;
      pushNumeric(out, cp, "ELECTRIC-POWER-VI", "electric-power calculation", "Medium", `An appliance uses ${current} A at ${voltage} V. Its electrical power is:`, power, "W", `P = VI = ${voltage} × ${current} = ${power} W.`, `V=${voltage}|I=${current}`);
    }
  }

  for (const resistance of [2,5,10,20]) {
    for (const current of [1,2,3,5]) {
      const power = current * current * resistance;
      pushNumeric(out, cp, "ELECTRIC-POWER-I2R", "electric-power calculation", "Hard", `A current of ${current} A flows through a ${resistance} Ω resistor. The power dissipated is:`, power, "W", `P = I²R = ${current}² × ${resistance} = ${power} W.`, `I=${current}|R=${resistance}`);
    }
  }

  for (const powerKw of [0.5,1,1.5,2]) {
    for (const hours of [1,2,4,5]) {
      const energy = powerKw * hours;
      pushNumeric(out, cp, "ELECTRICAL-ENERGY-KWH", "electrical-energy calculation", "Medium", `A ${powerKw} kW appliance runs for ${hours} h. It consumes:`, energy, "kWh", `Energy = power × time = ${powerKw} × ${hours} = ${fmt(energy)} kWh.`, `P=${powerKw}|h=${hours}`, 2);
    }
  }

  for (const tariff of [5,8,10,12]) {
    for (const units of [10,20,50,100]) {
      const cost = tariff * units;
      pushNumeric(out, cp, "ELECTRICITY-COST", "electricity-bill calculation", "Medium", `Electricity costs ₹${tariff} per unit. What is the energy charge for ${units} units?`, cost, "₹", `Cost = units × tariff = ${units} × ${tariff} = ₹${cost}.`, `tariff=${tariff}|units=${units}`);
    }
  }

  for (const current of [1,2,5]) {
    for (const resistance of [2,5]) {
      for (const time of [10,20]) {
        const heat = current * current * resistance * time;
        pushNumeric(out, cp, "JOULE-HEATING", "heating-effect calculation", "Hard", `A current of ${current} A flows through ${resistance} Ω for ${time} s. The heat produced is:`, heat, "J", `H = I²Rt = ${current}² × ${resistance} × ${time} = ${heat} J.`, `I=${current}|R=${resistance}|t=${time}`);
      }
    }
  }

  for (const factor of [2,3,4,5]) {
    pushNumeric(out, cp, "RESISTANCE-LENGTH-CHANGE", "resistance condition change", "Hard", `A wire's material and cross-sectional area stay unchanged. If its length becomes ${factor} times, its resistance becomes:`, factor, "times", `R ∝ L for fixed material and area, so resistance becomes ${factor} times.`, `Lfactor=${factor}`);
    pushNumeric(out, cp, "RESISTANCE-AREA-CHANGE", "resistance condition change", "Hard", `A wire's material and length stay unchanged. If its cross-sectional area becomes ${factor} times, its resistance becomes what fraction of the original?`, 1/factor, "of original", `R ∝ 1/A, so increasing area by ${factor} makes resistance 1/${factor} of the original.`, `Afactor=${factor}`, 4);
  }
  return out;
}

function cp009(): PhysicsDepthWave2QuestionV3[] {
  const out: PhysicsDepthWave2QuestionV3[] = [];
  const cp = "SCI-CP-009" as const;

  for (const primaryVoltage of [12,24,120,240]) {
    for (const turnsRatio of [0.5,2,5,10]) {
      const secondaryVoltage = primaryVoltage * turnsRatio;
      pushNumeric(out, cp, "TRANSFORMER-VOLTAGE", "transformer ratio", "Medium", `An ideal transformer has Ns/Np = ${turnsRatio}. If primary voltage is ${primaryVoltage} V, the secondary voltage is:`, secondaryVoltage, "V", `Vs/Vp = Ns/Np, so Vs = ${primaryVoltage} × ${turnsRatio} = ${fmt(secondaryVoltage)} V.`, `Vp=${primaryVoltage}|ratio=${turnsRatio}`);
      pushNumeric(out, cp, "TRANSFORMER-TURNS-RATIO", "transformer reverse relation", "Medium", `An ideal transformer changes ${primaryVoltage} V to ${fmt(secondaryVoltage)} V. The turns ratio Ns/Np is:`, turnsRatio, "", `Ns/Np = Vs/Vp = ${fmt(secondaryVoltage)}/${primaryVoltage} = ${turnsRatio}.`, `Vp=${primaryVoltage}|Vs=${secondaryVoltage}`, 2);
    }
  }

  for (const primaryCurrent of [1,2,5,10]) {
    for (const voltageRatio of [2,5,10]) {
      const secondaryCurrent = primaryCurrent / voltageRatio;
      pushNumeric(out, cp, "IDEAL-TRANSFORMER-CURRENT", "ideal transformer current relation", "Hard", `An ideal transformer steps voltage up by a factor of ${voltageRatio}. If primary current is ${primaryCurrent} A, the secondary current is:`, secondaryCurrent, "A", `For an ideal transformer VpIp = VsIs. If voltage rises ${voltageRatio} times, current falls by the same factor: ${primaryCurrent}/${voltageRatio} = ${fmt(secondaryCurrent)} A.`, `Ip=${primaryCurrent}|Vratio=${voltageRatio}`, 3);
    }
  }

  for (const powerKw of [1,2,5,10]) {
    for (const voltage of [100,200,500]) {
      const current = powerKw * 1000 / voltage;
      pushNumeric(out, cp, "TRANSMISSION-CURRENT", "power-transmission calculation", "Medium", `A line transmits ${powerKw} kW at ${voltage} V. Ignoring reactive effects, the current is:`, current, "A", `P = VI, so I = P/V = ${powerKw*1000}/${voltage} = ${fmt(current)} A.`, `Pkw=${powerKw}|V=${voltage}`, 2);
    }
  }

  for (const voltageFactor of [2,3,4,5]) {
    const lossFraction = 1 / (voltageFactor * voltageFactor);
    pushNumeric(out, cp, "TRANSMISSION-LOSS-RATIO", "transmission-loss reasoning", "Hard", `The same power is transmitted through the same line resistance, but transmission voltage is increased ${voltageFactor} times. The I²R loss becomes what fraction of the original?`, lossFraction, "of original", `For fixed power, current is inversely proportional to voltage. Increasing voltage ${voltageFactor} times makes current 1/${voltageFactor}; I²R loss becomes 1/${voltageFactor}² = ${fmt(lossFraction)}.`, `Vfactor=${voltageFactor}`, 4);
  }

  for (const turnsFactor of [1,2,3,4]) {
    for (const currentFactor of [1,2,3,4]) {
      const fieldFactor = turnsFactor * currentFactor;
      pushNumeric(out, cp, "SOLENOID-NI-RATIO", "solenoid field condition change", "Hard", `For the same solenoid length, the number of turns becomes ${turnsFactor} times and current becomes ${currentFactor} times. The magnetic field strength becomes approximately:`, fieldFactor, "times", `For a long solenoid, B ∝ NI/L. With L fixed, the factor is ${turnsFactor} × ${currentFactor} = ${fieldFactor}.`, `Nfactor=${turnsFactor}|Ifactor=${currentFactor}`);
    }
  }

  for (const factor of [2,3,4,5]) {
    pushNumeric(out, cp, "WIRE-FIELD-CURRENT", "magnetic-field condition change", "Medium", `At a fixed distance from a long straight current-carrying wire, the current becomes ${factor} times. The magnetic field becomes:`, factor, "times", `For a long straight wire at fixed distance, B ∝ I, so the field becomes ${factor} times.`, `Ifactor=${factor}`);
    pushNumeric(out, cp, "WIRE-FIELD-DISTANCE", "magnetic-field condition change", "Medium", `The current in a long straight wire stays unchanged, but observation distance becomes ${factor} times. The magnetic field becomes what fraction of the original?`, 1/factor, "of original", `For a long straight wire, B ∝ 1/r, so increasing distance ${factor} times makes the field 1/${factor}.`, `rfactor=${factor}`, 4);
  }

  for (const speedFactor of [2,3,4,5]) {
    pushNumeric(out, cp, "GENERATOR-FREQUENCY-SPEED", "generator condition change", "Medium", `A generator's number of poles is unchanged. If its rotational speed becomes ${speedFactor} times, the generated AC frequency becomes approximately:`, speedFactor, "times", `With pole number fixed, generator frequency is proportional to rotational speed, so it becomes ${speedFactor} times.`, `speedFactor=${speedFactor}`);
  }
  return out;
}

function cp010(): PhysicsDepthWave2QuestionV3[] {
  const out: PhysicsDepthWave2QuestionV3[] = [];
  const cp = "SCI-CP-010" as const;

  for (const initial of [80,160,320,640]) {
    for (const halfLives of [1,2,3,4]) {
      const remaining = initial / (2 ** halfLives);
      pushNumeric(out, cp, "HALF-LIFE-REMAINING", "radioactive-decay calculation", "Medium", `A radioactive sample starts with ${initial} g. How much remains after ${halfLives} half-${halfLives === 1 ? "life" : "lives"}?`, remaining, "g", `Remaining mass = initial/(2^n) = ${initial}/2^${halfLives} = ${fmt(remaining)} g.`, `initial=${initial}|n=${halfLives}`);
    }
  }

  for (const halfLife of [2,5,10,20]) {
    for (const n of [1,2,3,4]) {
      const elapsed = halfLife * n;
      pushNumeric(out, cp, "HALF-LIFE-ELAPSED-TIME", "half-life time relation", "Easy", `A nuclide has half-life ${halfLife} years. How much time passes in ${n} half-${n === 1 ? "life" : "lives"}?`, elapsed, "years", `Elapsed time = number of half-lives × half-life = ${n} × ${halfLife} = ${elapsed} years.`, `T=${halfLife}|n=${n}`);
    }
  }

  for (const fraction of [0.5,0.25,0.125,0.0625]) {
    const n = Math.log2(1/fraction);
    pushNumeric(out, cp, "HALF-LIVES-FROM-FRACTION", "radioactive-decay reverse reasoning", "Hard", `A radioactive sample falls to ${fmt(fraction*100)}% of its initial amount. How many half-lives have passed?`, n, "half-lives", `${fmt(fraction*100)}% = ${fmt(fraction)} of the original = 1/2^${n}, so ${n} half-lives have passed.`, `fraction=${fraction}`);
  }

  for (const frequency of [3e8,3e9,3e10,3e12]) {
    const wavelength = 3e8 / frequency;
    pushNumeric(out, cp, "EM-WAVELENGTH", "electromagnetic-wave calculation", "Medium", `An electromagnetic wave has frequency ${fmt(frequency)} Hz. Taking c = 300000000 m/s, its wavelength is:`, wavelength, "m", `λ = c/f = 300000000/${fmt(frequency)} = ${fmt(wavelength)} m.`, `f=${frequency}`, 6);
  }
  for (const wavelength of [1,0.1,0.01,0.0001]) {
    const frequency = 3e8 / wavelength;
    pushNumeric(out, cp, "EM-FREQUENCY", "electromagnetic-wave reverse calculation", "Medium", `An electromagnetic wave has wavelength ${wavelength} m. Taking c = 300000000 m/s, its frequency is:`, frequency, "Hz", `f = c/λ = 300000000/${wavelength} = ${fmt(frequency)} Hz.`, `lambda=${wavelength}`, 0);
  }

  for (const power of [100,200,500,1000]) {
    for (const hours of [1,2,5,10]) {
      const energyWh = power * hours;
      pushNumeric(out, cp, "SOLAR-PANEL-ENERGY", "solar-device energy calculation", "Medium", `A solar panel delivers ${power} W for ${hours} h at that output. The electrical energy produced is:`, energyWh, "Wh", `Energy = power × time = ${power} × ${hours} = ${energyWh} Wh.`, `P=${power}|h=${hours}`);
    }
  }

  for (const remaining of [10,20,40,80]) {
    for (const n of [1,2]) {
      const initial = remaining * (2 ** n);
      pushNumeric(out, cp, "HALF-LIFE-INITIAL-MASS", "radioactive-decay reverse calculation", "Hard", `After ${n} half-${n === 1 ? "life" : "lives"}, ${remaining} g of a sample remains. What was its initial mass?`, initial, "g", `Initial mass = remaining × 2^n = ${remaining} × 2^${n} = ${initial} g.`, `remaining=${remaining}|n=${n}`);
    }
  }

  const nuclei: Array<[number,number,string]> = [[12,6,"carbon-12"],[14,6,"carbon-14"],[16,8,"oxygen-16"],[23,11,"sodium-23"],[27,13,"aluminium-27"],[35,17,"chlorine-35"],[56,26,"iron-56"],[238,92,"uranium-238"]];
  for (const [massNumber, atomicNumber, name] of nuclei) {
    const neutrons = massNumber - atomicNumber;
    pushNumeric(out, cp, "NEUTRON-COUNT", "atomic-nucleus calculation", "Easy", `${name} has mass number ${massNumber} and atomic number ${atomicNumber}. Its number of neutrons is:`, neutrons, "", `Neutrons = mass number − atomic number = ${massNumber} − ${atomicNumber} = ${neutrons}.`, `A=${massNumber}|Z=${atomicNumber}`);
  }
  return out;
}

export const SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3 = {
  "SCI-CP-005": 96,
  "SCI-CP-006": 72,
  "SCI-CP-007": 64,
  "SCI-CP-008": 188,
  "SCI-CP-009": 88,
  "SCI-CP-010": 76,
} as const;

export function generatePhysicsDepthWave2CpV3(cpId: keyof typeof SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3): PhysicsDepthWave2QuestionV3[] {
  if (cpId === "SCI-CP-005") return cp005();
  if (cpId === "SCI-CP-006") return cp006();
  if (cpId === "SCI-CP-007") return cp007();
  if (cpId === "SCI-CP-008") return cp008();
  if (cpId === "SCI-CP-009") return cp009();
  return cp010();
}

export function generatePhysicsDepthWave2AllV3(): PhysicsDepthWave2QuestionV3[] {
  return (Object.keys(SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3) as Array<keyof typeof SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3>)
    .flatMap((cpId) => generatePhysicsDepthWave2CpV3(cpId));
}

export function auditPhysicsDepthWave2V3() {
  const errors: string[] = [];
  const all = generatePhysicsDepthWave2AllV3();
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const cpCounts: Record<string, number> = {};
  const familySets: Record<string, Set<string>> = {};
  const cpAnswerPositions: Record<string, [number,number,number,number]> = {};
  const difficulty: Record<string, Record<string, number>> = {};

  for (const q of all) {
    if (ids.has(q.questionId)) errors.push(`duplicate id ${q.questionId}`);
    ids.add(q.questionId);
    if (semantics.has(q.semanticKey)) errors.push(`duplicate semantic key ${q.semanticKey}`);
    semantics.add(q.semanticKey);
    if (q.options.length !== 4 || new Set(q.options).size !== 4) errors.push(`${q.questionId}: invalid options`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) errors.push(`${q.questionId}: answer mismatch`);
    if (!q.explanation.trim()) errors.push(`${q.questionId}: missing explanation`);
    if (!q.sourceIds.length) errors.push(`${q.questionId}: missing provenance`);
    if (!q.reviewOnly || q.runtimeRegistered) errors.push(`${q.questionId}: lifecycle lock broken`);
    cpCounts[q.cpId] = (cpCounts[q.cpId] ?? 0) + 1;
    familySets[q.cpId] ??= new Set<string>();
    familySets[q.cpId].add(q.familyId);
    cpAnswerPositions[q.cpId] ??= [0,0,0,0];
    cpAnswerPositions[q.cpId][q.correctIndex] += 1;
    difficulty[q.cpId] ??= {};
    difficulty[q.cpId][q.difficulty] = (difficulty[q.cpId][q.difficulty] ?? 0) + 1;
  }

  const cpFamilyCounts: Record<string, number> = {};
  for (const [cpId, expected] of Object.entries(SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3)) {
    if ((cpCounts[cpId] ?? 0) !== expected) errors.push(`${cpId}: expected ${expected}, found ${cpCounts[cpId] ?? 0}`);
    cpFamilyCounts[cpId] = familySets[cpId]?.size ?? 0;
    if (cpFamilyCounts[cpId] < 7) errors.push(`${cpId}: insufficient family diversity ${cpFamilyCounts[cpId]}`);
    const positions = cpAnswerPositions[cpId] ?? [0,0,0,0];
    if (positions.some((n) => n !== expected/4)) errors.push(`${cpId}: answer position drift ${positions.join("/")}`);
    if (!(difficulty[cpId]?.Easy > 0) || !(difficulty[cpId]?.Medium > 0) || !(difficulty[cpId]?.Hard > 0)) errors.push(`${cpId}: missing difficulty band`);
  }
  const expectedTotal = Object.values(SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3).reduce((sum,n) => sum+n,0);
  if (all.length !== expectedTotal) errors.push(`Wave 2 total expected ${expectedTotal}, found ${all.length}`);
  return { valid: errors.length === 0, errors, totalQuestions: all.length, cpCounts, cpFamilyCounts, cpAnswerPositions, difficulty };
}
