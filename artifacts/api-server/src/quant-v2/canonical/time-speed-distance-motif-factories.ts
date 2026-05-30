import type {
  CanonicalTimeSpeedDistanceProblem,
  TimeSpeedDistanceAnswerKind,
  TimeSpeedDistanceAnswerUnit,
  TimeSpeedDistanceFamilyId,
  TimeSpeedDistanceMotifFactory,
  TsdExplanationStep,
  TsdLocalizedText,
  TsdSolverModel,
} from "./time-speed-distance-types";

export const TIME_SPEED_DISTANCE_FAMILY_IDS: readonly TimeSpeedDistanceFamilyId[] = [
  "tsd_average_speed_equal_distance",
  "tsd_average_speed_unequal_distance",
  "tsd_average_speed_equal_time",
  "tsd_fractional_speed_offset",
  "tsd_speed_ratio_time_ratio",
  "tsd_distance_ratio_speed_time",
  "tsd_variable_distance_ratio",
  "tsd_early_late_delta",
  "tsd_stoppage_time_penalty",
  "tsd_relative_speed_opposite_direction",
  "tsd_relative_speed_same_direction",
  "tsd_two_person_meet",
  "tsd_two_person_catch_up",
  "tsd_delayed_start_catch_up",
  "tsd_head_start_catch_up",
  "tsd_two_point_staggered_start",
  "tsd_meeting_point_distance_split",
  "tsd_return_journey_average_speed",
  "tsd_round_trip_speed",
  "tsd_partial_journey_speed_change",
  "tsd_speed_increase_decrease_time_saved",
  "tsd_speed_change_distance_fixed",
  "tsd_speed_change_arrival_early_late",
  "tsd_rest_time_included",
  "tsd_stoppage_average_speed",
  "tsd_scheduled_arrival_speed_required",
  "tsd_hidden_distance_from_time_gap",
  "tsd_hidden_speed_from_arrival_difference",
  "train_cross_platform",
  "train_cross_bridge",
  "train_cross_person_same_direction",
  "train_cross_person_opposite_direction",
  "train_two_trains_cross_opposite",
  "train_two_trains_cross_same_direction",
  "train_length_from_crossing_time",
  "train_speed_from_crossing_time",
  "train_platform_length_unknown",
  "train_bridge_length_unknown",
  "train_relative_speed_with_lengths",
  "train_overtake_another_train",
  "train_meet_between_stations",
  "train_time_gap_between_crossings",
  "train_dual_platform_length",
  "train_post_meeting_cross",
  "boat_downstream_upstream_basic",
  "boat_still_water_speed",
  "boat_stream_speed",
  "boat_up_down_time_given_distance",
  "boat_distance_from_up_down_times",
  "boat_equal_distance_up_down",
  "boat_round_trip_stream",
  "boat_speed_ratio_upstream_downstream",
  "boat_current_effect_time_difference",
  "boat_time_ratio",
  "boat_constant_distance_isolation",
  "race_basic_lead_distance",
  "race_basic_lead_time",
  "race_a_beats_b_by_distance",
  "race_a_beats_b_by_time",
  "race_time_deficit_mapping",
  "race_dead_heat_calibration",
  "race_two_stage_comparison",
  "race_start_delay",
  "circular_track_first_meeting_same_direction",
  "circular_track_first_meeting_opposite_direction",
  "circular_track_repeated_meetings",
  "circular_track_lap_difference",
  "circular_track_speed_ratio_meeting_point",
  "circular_track_two_runners_start_gap",
  "circular_track_three_runners_lcm_meeting",
  "escalator_steps_basic",
  "escalator_up_down_steps",
  "escalator_stationary_steps",
  "escalator_speed_from_steps",
  "escalator_step_count_scaling",
  "moving_walkway_relative_speed",
  "dog_chasing_hare_leaps",
  "tsd_clock_hands_angle",
  "tsd_clock_hands_coincidence",
  "tsd_clock_hands_opposite",
  "tsd_clock_hands_right_angle",
  "tsd_clock_hands_between_two_times",
  "tsd_clock_hands_gain_loss_minutes",
  "tsd_sound_delay_basic",
  "tsd_sound_echo_distance",
  "tsd_sound_train_whistle_observer",
  "tsd_sound_two_observers",
  "tsd_sound_reflection_between_walls",
  "tsd_variable_speed_arithmetic_sequence",
  "tsd_variable_speed_segment_sum",
  "tsd_variable_speed_each_hour_change",
  "tsd_variable_speed_distance_remaining",
  "tsd_acceleration_uniform_basic",
  "tsd_acceleration_average_speed",
  "tsd_acceleration_distance_from_rest",
  "tsd_polygon_perimeter_lap",
  "tsd_polygon_different_speed_sides",
  "tsd_square_track_overtake",
  "tsd_rectangle_track_opposite_meeting",
  "tsd_polygon_multi_side_speed_pattern",
  "tsd_geometric_polygon_perimeter_lap",
  "tsd_swimmer_river_cross_basic",
  "tsd_swimmer_downstream_drift_basic",
  "tsd_swimmer_minimum_time_crossing",
  "tsd_swimmer_shortest_path_crossing",
  "tsd_swimmer_resultant_drift_distance",
  "tsd_boat_angle_crossing_basic",
  "tsd_wind_drift_basic",
  "tsd_airplane_tailwind_headwind",
  "tsd_airplane_round_trip_wind",
  "tsd_relative_motion_wind_drift",
  "tsd_missile_interception_closing_vector",
  "tsd_pursuit_intersection_point",
  "tsd_two_vehicle_intercept_at_crossroad",
  "tsd_guard_patrol_interception",
  "tsd_rotating_wheel_linear_speed",
  "tsd_wheel_revolutions_distance",
  "tsd_two_wheels_revolution_ratio",
  "tsd_moving_walkway_reverse_direction",
  "tsd_escalator_find_total_steps_advanced",
  "tsd_escalator_two_people_step_rate",
  "tsd_escalator_direction_reversal",
  "tsd_average_speed_harmonic_proof",
  "tsd_average_speed_without_distance",
  "tsd_speed_ratio_from_time_difference",
] as const;

export const TIME_SPEED_DISTANCE_TODO_FAMILY_IDS = {
  phaseC: [],
} as const;

type Locale = "en" | "hi" | "pa";

type TsdGroup = "core" | "relative" | "train" | "boat" | "race" | "circular" | "escalator" | "advanced";

type MotifSpec = {
  id: TimeSpeedDistanceFamilyId;
  group: TsdGroup;
  difficulty: "easy" | "medium" | "hard";
  complexity: "easy" | "medium" | "hard" | "advanced";
  principle: TsdLocalizedText;
  formula: string;
  shortcut: TsdLocalizedText;
  traps: string[];
};

type Draft = {
  stem: TsdLocalizedText;
  model: TsdSolverModel;
  variables: Record<string, unknown>;
  answerKind: TimeSpeedDistanceAnswerKind;
  answerUnit: TimeSpeedDistanceAnswerUnit;
  steps: TsdExplanationStep[];
  shortcutMath: string;
};

const CORE_PRINCIPLE: TsdLocalizedText = {
  en: "Use distance = speed x time, with units kept consistent.",
  hi: "दूरी = गति x समय का उपयोग करें और इकाइयाँ समान रखें।",
  pa: "ਦੂਰੀ = ਗਤੀ x ਸਮਾਂ ਵਰਤੋ ਅਤੇ ਇਕਾਈਆਂ ਇੱਕੋ ਰੱਖੋ।",
};

const RELATIVE_PRINCIPLE: TsdLocalizedText = {
  en: "Use relative speed: add speeds in opposite directions and subtract in the same direction.",
  hi: "सापेक्ष गति लें: विपरीत दिशा में गति जोड़ें और समान दिशा में घटाएँ।",
  pa: "ਆਪਸੀ ਗਤੀ ਲਵੋ: ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਤੀਆਂ ਜੋੜੋ ਅਤੇ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਘਟਾਓ।",
};

const TRAIN_PRINCIPLE: TsdLocalizedText = {
  en: "A train crossing an object covers the combined effective length.",
  hi: "किसी वस्तु को पार करते समय ट्रेन प्रभावी कुल लंबाई तय करती है।",
  pa: "ਕਿਸੇ ਚੀਜ਼ ਨੂੰ ਪਾਰ ਕਰਦੇ ਸਮੇਂ ਰੇਲਗੱਡੀ ਕੁੱਲ ਪ੍ਰਭਾਵੀ ਲੰਬਾਈ ਤੈਅ ਕਰਦੀ ਹੈ।",
};

const BOAT_PRINCIPLE: TsdLocalizedText = {
  en: "Downstream speed is boat speed plus stream speed; upstream speed is boat speed minus stream speed.",
  hi: "धारा के अनुकूल गति = नाव की गति + धारा की गति, और प्रतिकूल गति = नाव की गति - धारा की गति।",
  pa: "ਧਾਰਾ ਦੇ ਨਾਲ ਗਤੀ = ਕਿਸ਼ਤੀ ਦੀ ਗਤੀ + ਧਾਰਾ ਦੀ ਗਤੀ, ਅਤੇ ਧਾਰਾ ਦੇ ਉਲਟ ਗਤੀ = ਕਿਸ਼ਤੀ ਦੀ ਗਤੀ - ਧਾਰਾ ਦੀ ਗਤੀ।",
};

const RACE_PRINCIPLE: TsdLocalizedText = {
  en: "In a race, distances covered in the same time are proportional to speeds.",
  hi: "दौड़ में समान समय में तय दूरियाँ गतियों के अनुपाती होती हैं।",
  pa: "ਦੌੜ ਵਿੱਚ ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਤੈਅ ਦੂਰੀਆਂ ਗਤੀਆਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦੀਆਂ ਹਨ।",
};

const CIRCULAR_PRINCIPLE: TsdLocalizedText = {
  en: "On a circular track, meeting time depends on the relative speed and lap length.",
  hi: "वृत्ताकार ट्रैक पर मिलने का समय आपसी गति और चक्कर की लंबाई पर निर्भर करता है।",
  pa: "ਗੋਲ ਟਰੈਕ ਉੱਤੇ ਮਿਲਣ ਦਾ ਸਮਾਂ ਆਪਸੀ ਗਤੀ ਅਤੇ ਚੱਕਰ ਦੀ ਲੰਬਾਈ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
};

const ESCALATOR_PRINCIPLE: TsdLocalizedText = {
  en: "On an escalator or walkway, combine the person's rate with the moving surface rate.",
  hi: "एस्केलेटर या चलती पटरी पर व्यक्ति की दर और चलती सतह की दर को मिलाएँ।",
  pa: "ਐਸਕੇਲੇਟਰ ਜਾਂ ਚੱਲਦੇ ਰਾਹ ਉੱਤੇ ਵਿਅਕਤੀ ਦੀ ਦਰ ਅਤੇ ਚੱਲਦੀ ਸਤਹ ਦੀ ਦਰ ਨੂੰ ਮਿਲਾਓ।",
};

const ADVANCED_PRINCIPLE: TsdLocalizedText = {
  en: "Use relative motion or proportional motion with clean exam-friendly values.",
  hi: "साफ मानों के साथ आपसी गति या अनुपाती गति का प्रयोग करें।",
  pa: "ਸਾਫ਼ ਮੁੱਲਾਂ ਨਾਲ ਆਪਸੀ ਗਤੀ ਜਾਂ ਅਨੁਪਾਤੀ ਗਤੀ ਵਰਤੋ।",
};

export const TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS = [
  "tsd_clock_hands_angle",
  "tsd_clock_hands_coincidence",
  "tsd_clock_hands_opposite",
  "tsd_clock_hands_right_angle",
  "tsd_clock_hands_between_two_times",
  "tsd_clock_hands_gain_loss_minutes",
  "tsd_sound_delay_basic",
  "tsd_sound_echo_distance",
  "tsd_sound_train_whistle_observer",
  "tsd_sound_two_observers",
  "tsd_sound_reflection_between_walls",
  "tsd_variable_speed_arithmetic_sequence",
  "tsd_variable_speed_segment_sum",
  "tsd_variable_speed_each_hour_change",
  "tsd_variable_speed_distance_remaining",
  "tsd_acceleration_uniform_basic",
  "tsd_acceleration_average_speed",
  "tsd_acceleration_distance_from_rest",
  "tsd_polygon_perimeter_lap",
  "tsd_polygon_different_speed_sides",
  "tsd_square_track_overtake",
  "tsd_rectangle_track_opposite_meeting",
  "tsd_polygon_multi_side_speed_pattern",
  "tsd_geometric_polygon_perimeter_lap",
  "tsd_swimmer_river_cross_basic",
  "tsd_swimmer_downstream_drift_basic",
  "tsd_swimmer_minimum_time_crossing",
  "tsd_swimmer_shortest_path_crossing",
  "tsd_swimmer_resultant_drift_distance",
  "tsd_boat_angle_crossing_basic",
  "tsd_wind_drift_basic",
  "tsd_airplane_tailwind_headwind",
  "tsd_airplane_round_trip_wind",
  "tsd_relative_motion_wind_drift",
  "tsd_missile_interception_closing_vector",
  "tsd_pursuit_intersection_point",
  "tsd_two_vehicle_intercept_at_crossroad",
  "tsd_guard_patrol_interception",
  "tsd_rotating_wheel_linear_speed",
  "tsd_wheel_revolutions_distance",
  "tsd_two_wheels_revolution_ratio",
  "tsd_moving_walkway_reverse_direction",
  "tsd_escalator_find_total_steps_advanced",
  "tsd_escalator_two_people_step_rate",
  "tsd_escalator_direction_reversal",
  "tsd_average_speed_harmonic_proof",
  "tsd_average_speed_without_distance",
  "tsd_speed_ratio_from_time_difference",
] as const satisfies readonly TimeSpeedDistanceFamilyId[];

const PHASE_C_SET = new Set<TimeSpeedDistanceFamilyId>(TIME_SPEED_DISTANCE_PHASE_C_FAMILY_IDS);

function spec(
  id: TimeSpeedDistanceFamilyId,
  group: TsdGroup,
  difficulty: "easy" | "medium" | "hard",
  formula: string,
  traps: string[],
): MotifSpec {
  const principle =
    group === "advanced" ? ADVANCED_PRINCIPLE :
      group === "train" ? TRAIN_PRINCIPLE :
      group === "boat" ? BOAT_PRINCIPLE :
        group === "race" ? RACE_PRINCIPLE :
          group === "circular" ? CIRCULAR_PRINCIPLE :
            group === "escalator" ? ESCALATOR_PRINCIPLE :
              group === "relative" ? RELATIVE_PRINCIPLE : CORE_PRINCIPLE;
  return {
    id,
    group,
    difficulty,
    complexity: difficulty,
    principle,
    formula,
    shortcut: {
      en: "Use the direct exam shortcut after setting units consistently.",
      hi: "इकाइयाँ समान रखकर सीधी परीक्षा-विधि लगाएँ।",
      pa: "ਇਕਾਈਆਂ ਇੱਕੋ ਰੱਖ ਕੇ ਸਿੱਧਾ ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ ਲਗਾਓ।",
    },
    traps,
  };
}

function groupOf(id: TimeSpeedDistanceFamilyId): TsdGroup {
  if (PHASE_C_SET.has(id)) return "advanced";
  if (id.startsWith("train_")) return "train";
  if (id.startsWith("boat_")) return "boat";
  if (id.startsWith("race_")) return "race";
  if (id.startsWith("circular_")) return "circular";
  if (id.startsWith("escalator_") || id.startsWith("moving_") || id.startsWith("dog_")) return "escalator";
  if (/relative|meet|catch|head_start|staggered|meeting_point/u.test(id)) return "relative";
  return "core";
}

function difficultyOf(id: TimeSpeedDistanceFamilyId): "easy" | "medium" | "hard" {
  if (PHASE_C_SET.has(id)) {
    if (/angle$|echo|delay_basic|drift_basic|perimeter_lap|wheel_revolutions|harmonic|without_distance|speed_ratio_from_time_difference/u.test(id)) return "easy";
    if (/between_two_times|reflection|shortest|interception|acceleration_distance|escalator_find|direction_reversal/u.test(id)) return "hard";
    return "medium";
  }
  if (/unequal|hidden|dual|post_meeting|time_gap|repeated|three|escalator|dead_heat|two_stage|constant_distance|staggered|partial|scheduled/u.test(id)) {
    return "hard";
  }
  if (/delayed|head_start|catch|boat|race|circular|same_direction|speed_change|platform|bridge|two_trains|length|stoppage|rest/u.test(id)) {
    return "medium";
  }
  return "easy";
}

export const TIME_SPEED_DISTANCE_MOTIF_SPECS: Record<TimeSpeedDistanceFamilyId, MotifSpec> =
  Object.fromEntries(
    TIME_SPEED_DISTANCE_FAMILY_IDS.map((id) => [
      id,
      spec(id, groupOf(id), difficultyOf(id), formulaFor(id), trapsFor(id)),
    ]),
  ) as Record<TimeSpeedDistanceFamilyId, MotifSpec>;

export const TIME_SPEED_DISTANCE_STEM_TEMPLATE_COVERAGE: Record<TsdGroup, number> = {
  core: 6,
  relative: 6,
  train: 6,
  boat: 5,
  race: 5,
  circular: 5,
  escalator: 5,
  advanced: 6,
};

export const TIME_SPEED_DISTANCE_FAMILY_STEM_BANK: Record<TimeSpeedDistanceFamilyId, TsdGroup> =
  Object.fromEntries(TIME_SPEED_DISTANCE_FAMILY_IDS.map((family) => [family, groupOf(family)])) as Record<TimeSpeedDistanceFamilyId, TsdGroup>;

function formulaFor(id: TimeSpeedDistanceFamilyId) {
  if (PHASE_C_SET.has(id)) return "advanced TSD relation with clean relative motion";
  if (id.startsWith("train_")) return "D=L_1+L_2, T=D/v_rel";
  if (id.startsWith("boat_")) return "v_d=b+s, v_u=b-s";
  if (id.startsWith("race_")) return "speed ratio = distance ratio for equal time";
  if (id.startsWith("circular_")) return "T=C/v_rel";
  if (id.startsWith("escalator_") || id.startsWith("moving_")) return "visible steps = person steps + escalator steps";
  if (id.startsWith("dog_")) return "T=head start/relative speed";
  if (/average_speed/u.test(id)) return "average speed = total distance/total time";
  if (/early_late|arrival/u.test(id)) return "D=uv/(v-u) x time gap";
  if (/stoppage/u.test(id)) return "stoppage=(S_without-S_with)/S_without x 60";
  return "D=vt";
}

function trapsFor(id: TimeSpeedDistanceFamilyId) {
  if (PHASE_C_SET.has(id)) {
    if (/clock/u.test(id)) return ["used minute-hand speed alone", "missed smaller angle", "ignored relative angular speed"];
    if (/sound/u.test(id)) return ["forgot echo double path", "used wrong sound speed", "seconds/minutes confusion"];
    if (/swimmer|wind|airplane|interception/u.test(id)) return ["used wrong relative speed", "ignored drift or medium speed", "used direct distance instead of component"];
    if (/wheel/u.test(id)) return ["used diameter instead of circumference", "forgot revolutions", "wrong pi value"];
    if (/escalator|walkway/u.test(id)) return ["ignored moving surface", "reversed with/against direction", "treated counted steps as total"];
  }
  if (id.startsWith("train_")) return ["forgot effective length", "wrong relative speed", "missed km/h to m/s conversion"];
  if (id.startsWith("boat_")) return ["treated downstream speed as boat speed", "used stream speed directly", "ignored equal distance"];
  if (id.startsWith("race_")) return ["used lead distance as time", "wrong speed ratio", "used full distance for both runners"];
  if (id.startsWith("circular_")) return ["used wrong relative speed", "missed lap length", "ignored repeated meeting logic"];
  if (id.startsWith("escalator_") || id.startsWith("moving_")) return ["treated moving steps as stationary", "wrong direction of moving surface", "confused counted steps with visible steps"];
  return ["arithmetic mean trap", "wrong time unit", "ignored head start or stoppage"];
}

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(values: readonly T[], seed: string): T {
  return values[hashText(seed) % values.length]!;
}

function clean(value: number) {
  const rounded = Math.round(value * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return Math.round(rounded);
  return rounded;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function ratioText(a: number, b: number) {
  const g = gcd(Math.round(Math.abs(a)), Math.round(Math.abs(b)));
  return `${Math.round(a / g)}:${Math.round(b / g)}`;
}

function lcm(a: number, b: number) {
  return Math.abs(a * b) / gcd(a, b);
}

function answerText(value: number | string, unit: TimeSpeedDistanceAnswerUnit, language: Locale = "en") {
  if (typeof value === "string") return value;
  const formatted = String(clean(value));
  const units: Record<TimeSpeedDistanceAnswerUnit, Record<Locale, string>> = {
    kmph: { en: "km/h", hi: "किमी/घं", pa: "ਕਿਮੀ/ਘੰਟਾ" },
    mps: { en: "m/s", hi: "मी/से", pa: "ਮੀ/ਸੇ" },
    km: { en: "km", hi: "किमी", pa: "ਕਿਮੀ" },
    m: { en: "m", hi: "मीटर", pa: "ਮੀਟਰ" },
    hours: { en: "hours", hi: "घंटे", pa: "ਘੰਟੇ" },
    minutes: { en: "minutes", hi: "मिनट", pa: "ਮਿੰਟ" },
    seconds: { en: "seconds", hi: "सेकंड", pa: "ਸਕਿੰਟ" },
    ratio: { en: "", hi: "", pa: "" },
    steps: { en: "steps", hi: "सीढ़ियाँ", pa: "ਪੌੜੀਆਂ" },
    degrees: { en: "degrees", hi: "डिग्री", pa: "ਡਿਗਰੀ" },
    revolutions: { en: "revolutions", hi: "चक्कर", pa: "ਚੱਕਰ" },
    cm: { en: "cm", hi: "सेमी", pa: "ਸੈਮੀ" },
    none: { en: "", hi: "", pa: "" },
  };
  const suffix = units[unit][language];
  return suffix ? `${formatted} ${suffix}` : formatted;
}

function displayMath(value: string) {
  return `\\[\n${value}\n\\]`;
}

function step(key: string, en: string, hi: string, pa: string, math?: string, value?: number | string): TsdExplanationStep {
  return { key, text: { en, hi, pa }, math, value };
}

function ensureQuestionStem(stem: string) {
  const trimmed = stem.trim();
  if (/[?]\s*$/u.test(trimmed)) return trimmed;
  return `${trimmed.replace(/[।.]\s*$/u, "")}?`;
}

function buildExplanation(steps: readonly TsdExplanationStep[], answerValue: string, shortcutMath: string, language: Locale) {
  const heading = {
    en: "Shortcut / Exam Method:",
    hi: "शॉर्टकट / परीक्षा विधि:",
    pa: "ਛੋਟਾ ਤਰੀਕਾ / ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ:",
  }[language];
  const answerLabel = { en: "Answer", hi: "उत्तर", pa: "ਉੱਤਰ" }[language];
  const lines: string[] = [];
  for (const item of steps) {
    lines.push(item.text[language]);
    if (item.math) lines.push(displayMath(item.math));
  }
  lines.push(heading);
  lines.push(displayMath(shortcutMath));
  lines.push(`${answerLabel}: ${answerValue}`);
  return lines.join("\n");
}

function evaluateTsdSolverModel(model: TsdSolverModel): number | string {
  const n = (key: string) => Number(model.inputs[key] ?? 0);
  const arr = (key: string) => model.inputs[key] as number[];
  switch (model.kind) {
    case "average_speed": {
      const distances = arr("distances");
      const speeds = arr("speeds");
      const totalDistance = distances.reduce((sum, value) => sum + value, 0);
      const totalTime = distances.reduce((sum, value, index) => sum + value / speeds[index]!, 0);
      return clean(totalDistance / totalTime);
    }
    case "fractional_speed_offset":
      return clean(n("late") / (n("denominator") / n("numerator") - 1));
    case "ratio_result":
      return String(model.inputs.result);
    case "early_late_distance":
      return clean((n("slow") * n("fast") / (n("fast") - n("slow"))) * n("gapHours"));
    case "stoppage_minutes":
      return clean(((n("without") - n("with")) / n("without")) * 60);
    case "relative_time":
      return clean(n("distance") / n("relativeSpeed"));
    case "catch_up_time":
      return clean(n("headStart") / n("relativeSpeed"));
    case "meeting_distance":
      return clean(n("speed") * n("time"));
    case "journey_average":
      return clean(n("distance") / n("totalTime"));
    case "speed_change":
      return clean(n("distance") / n("time"));
    case "scheduled_speed":
      return clean(n("distance") / n("time"));
    case "train_crossing":
      return clean(n("distance") / n("relativeSpeed"));
    case "train_unknown_length":
      return clean(n("relativeSpeed") * n("time") - n("knownLength"));
    case "train_post_meeting":
      return ratioText(Math.round(Math.sqrt(n("time2")) * 100), Math.round(Math.sqrt(n("time1")) * 100));
    case "boat_speed":
      if (model.inputs.ask === "stream") return clean((n("down") - n("up")) / 2);
      return clean((n("down") + n("up")) / 2);
    case "boat_distance":
      return clean((n("down") * n("up") * n("timeGap")) / (n("down") - n("up")));
    case "race_speed":
      return clean(n("winnerSpeed") * (n("raceDistance") - n("lead")) / n("raceDistance"));
    case "race_time":
      return clean(n("lead") / n("speed"));
    case "circular_time":
      return clean(n("circumference") / n("relativeSpeed") * n("meetings"));
    case "escalator_steps":
      return clean(n("personSteps") + n("movingSteps"));
    case "dog_chase":
      return clean(n("headStart") / n("relativeSpeed"));
    case "clock_angle": {
      const raw = Math.abs(30 * n("hour") - 5.5 * n("minute"));
      return clean(Math.min(raw, 360 - raw));
    }
    case "clock_minutes":
      return String(model.inputs.answer);
    case "sound_distance":
      return clean(n("speed") * n("time") / n("divisor"));
    case "sequence_distance": {
      const speeds = arr("speeds");
      const time = n("time") || 1;
      return clean(speeds.reduce((sum, value) => sum + value * time, 0));
    }
    case "acceleration_value": {
      const mode = String(model.inputs.mode ?? "");
      if (mode === "final") return clean(n("u") + n("a") * n("t"));
      if (mode === "average") return clean((n("u") + n("v")) / 2);
      return clean(n("u") * n("t") + 0.5 * n("a") * n("t") * n("t"));
    }
    case "perimeter_time":
      return clean(n("perimeter") / n("relativeSpeed"));
    case "side_time_sum": {
      const sides = arr("sides");
      const speeds = arr("speeds");
      return clean(sides.reduce((sum, side, index) => sum + side / speeds[index]!, 0));
    }
    case "swimmer_value": {
      const mode = String(model.inputs.mode ?? "");
      if (mode === "drift") return clean(n("current") * n("width") / n("swimmer"));
      if (mode === "shortest") return clean(n("width") / Math.sqrt(n("swimmer") ** 2 - n("current") ** 2));
      if (mode === "resultant") return clean(Math.sqrt(n("width") ** 2 + n("drift") ** 2));
      return clean(n("width") / n("swimmer"));
    }
    case "wind_value": {
      const mode = String(model.inputs.mode ?? "");
      if (mode === "wind") return clean((n("with") - n("against")) / 2);
      if (mode === "plane") return clean((n("with") + n("against")) / 2);
      if (mode === "round") return clean(n("distance") / (n("plane") + n("wind")) + n("distance") / (n("plane") - n("wind")));
      return clean(n("driftSpeed") * n("time"));
    }
    case "interception_time":
      return clean(n("gap") / n("closingSpeed"));
    case "wheel_value": {
      const circumference = 2 * (22 / 7) * n("radius");
      const mode = String(model.inputs.mode ?? "");
      if (mode === "speed") return clean(n("rps") * circumference);
      if (mode === "ratio") return ratioText(n("radius2"), n("radius1"));
      return clean(n("revolutions") * circumference);
    }
    case "walkway_value": {
      const mode = String(model.inputs.mode ?? "");
      if (mode === "against") return clean(n("length") / (n("person") - n("belt")));
      if (mode === "totalSteps") return clean(n("counted") + n("beltSteps"));
      if (mode === "belt") return clean((n("with") - n("against")) / 2);
      return clean(n("length") / (n("person") + n("belt")));
    }
    default:
      throw new Error(`Unsupported TSD solver kind ${(model as any).kind}`);
  }
}

function makeOptions(answer: number | string, unit: TimeSpeedDistanceAnswerUnit, seed: string) {
  if (typeof answer === "string" && /minutes/u.test(answer)) {
    const options = [
      answer,
      answer.replace(/^\\\((\d+)/u, (_, value) => `\\(${Number(value) + 1}`),
      answer.replace(/^\\\((\d+)/u, (_, value) => `\\(${Math.max(1, Number(value) - 1)}`),
      answer.replace(/11/u, "22"),
    ];
    return [...new Set(options)].slice(0, 4);
  }
  const raw = typeof answer === "number"
    ? [
      answer,
      Math.max(1, clean(answer + pick([-6, -4, -2, 2, 4, 6], `${seed}:d1`))),
      Math.max(1, clean(answer * pick([0.75, 0.8, 1.2, 1.25], `${seed}:d2`))),
      Math.max(1, clean(answer + pick([8, 10, -8, -10], `${seed}:d3`))),
    ]
    : [answer, "1:2", "2:3", "3:4", "4:5", "5:6"];
  const values = raw.filter((value, index, list) => list.findIndex((item) => String(item) === String(value)) === index).slice(0, 4);
  while (values.length < 4 && typeof answer === "number") values.push(clean(Number(answer) + values.length * 3));
  return values.map((value) => answerText(value, unit));
}

function stemSkeleton(stem: string) {
  return stem
    .replace(/\d+(?:\.\d+)?/gu, "#")
    .replace(/\s+/gu, " ")
    .trim();
}

function numericSignature(variables: Record<string, unknown>) {
  return Object.entries(variables)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${Array.isArray(value) ? value.join(",") : String(value)}`)
    .join("|");
}

function realismFor(spec: MotifSpec, seed: string) {
  const jitter = hashText(`${seed}:realism`) % 5;
  if (spec.complexity === "easy") return 74 + jitter;
  if (spec.complexity === "medium") return 81 + jitter;
  if (spec.complexity === "hard") return 87 + jitter;
  return 91 + jitter;
}

function draftCore(spec: MotifSpec, seed: string): Draft {
  const family = spec.id;
  if (family === "tsd_average_speed_equal_distance" || family === "tsd_return_journey_average_speed" || family === "tsd_round_trip_speed") {
    const u = pick([30, 36, 40, 45, 48, 54, 60], `${seed}:u`);
    const v = pick([54, 60, 72, 80, 90, 108], `${seed}:v`);
    const d = pick([90, 120, 150, 180, 240, 300], `${seed}:d`);
    const model: TsdSolverModel = { kind: "average_speed", inputs: { distances: [d, d], speeds: [u, v] } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: {
        en: `A car travels from town A to town B at ${u} km/h and returns at ${v} km/h. What is the average speed for the whole journey?`,
        hi: `एक कार शहर A से शहर B तक ${u} किमी/घं की गति से जाती है और ${v} किमी/घं की गति से लौटती है। पूरी यात्रा की औसत गति कितनी है?`,
        pa: `ਇੱਕ ਕਾਰ ਸ਼ਹਿਰ A ਤੋਂ ਸ਼ਹਿਰ B ਤੱਕ ${u} ਕਿਮੀ/ਘੰਟਾ ਦੀ ਗਤੀ ਨਾਲ ਜਾਂਦੀ ਹੈ ਅਤੇ ${v} ਕਿਮੀ/ਘੰਟਾ ਦੀ ਗਤੀ ਨਾਲ ਵਾਪਸ ਆਉਂਦੀ ਹੈ। ਪੂਰੀ ਯਾਤਰਾ ਦੀ ਔਸਤ ਗਤੀ ਕਿੰਨੀ ਹੈ?`,
      },
      model,
      variables: { u, v, d },
      answerKind: "speed",
      answerUnit: "kmph",
      steps: [
        step("idea", "Since the distances are equal, use the equal-distance average speed formula.", "दूरी समान है, इसलिए समान-दूरी औसत गति सूत्र लगाएँ।", "ਦੂਰੀ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਇੱਕੋ-ਦੂਰੀ ਔਸਤ ਗਤੀ ਦਾ ਸੂਤਰ ਲਗਾਓ।", `S=\\frac{2uv}{u+v}`),
        step("substitution", "Put the onward and return speeds in the equal-distance formula.", "दोनों गतियाँ रखें।", "ਦੋਵੇਂ ਗਤੀਆਂ ਰੱਖੋ।", `S=\\frac{2\\times ${u}\\times ${v}}{${u}+${v}}`),
        step("result", "This gives the average speed for the complete return journey.", "औसत गति सरल करें।", "ਔਸਤ ਗਤੀ ਸਰਲ ਕਰੋ।", `S=${answer}`),
      ],
      shortcutMath: `S=\\frac{2uv}{u+v}`,
    };
  }
  if (family === "tsd_average_speed_unequal_distance" || family === "tsd_average_speed_equal_time" || family === "tsd_partial_journey_speed_change") {
    const d1 = pick([48, 60, 72, 90, 120, 150], `${seed}:d1`);
    const d2 = pick([90, 120, 150, 180, 210, 240], `${seed}:d2`);
    const u = pick([24, 30, 36, 40, 45, 48], `${seed}:u`);
    const v = pick([54, 60, 72, 80, 90, 108], `${seed}:v`);
    const model: TsdSolverModel = { kind: "average_speed", inputs: { distances: [d1, d2], speeds: [u, v] } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: {
        en: `A bus covers ${d1} km at ${u} km/h and then ${d2} km at ${v} km/h. What is its average speed for the whole journey?`,
        hi: `एक बस ${d1} किमी ${u} किमी/घं से और फिर ${d2} किमी ${v} किमी/घं से चलती है। पूरी यात्रा की औसत गति कितनी है?`,
        pa: `ਇੱਕ ਬੱਸ ${d1} ਕਿਮੀ ${u} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਅਤੇ ਫਿਰ ${d2} ਕਿਮੀ ${v} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਜਾਂਦੀ ਹੈ। ਪੂਰੀ ਯਾਤਰਾ ਦੀ ਔਸਤ ਗਤੀ ਕਿੰਨੀ ਹੈ?`,
      },
      model,
      variables: { d1, d2, u, v },
      answerKind: "speed",
      answerUnit: "kmph",
      steps: [
        step("idea", "For unequal distances, use total distance divided by total time.", "असमान दूरी में कुल दूरी को कुल समय से भाग दें।", "ਅਸਮਾਨ ਦੂਰੀ ਵਿੱਚ ਕੁੱਲ ਦੂਰੀ ਨੂੰ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।", `S=\\frac{D_1+D_2}{\\frac{D_1}{u}+\\frac{D_2}{v}}`),
        step("substitution", "Find the two travel times and combine them.", "दोनों यात्रा समय निकालकर जोड़ें।", "ਦੋਵੇਂ ਯਾਤਰਾ ਸਮੇਂ ਕੱਢ ਕੇ ਜੋੜੋ।", `S=\\frac{${d1}+${d2}}{\\frac{${d1}}{${u}}+\\frac{${d2}}{${v}}}`),
        step("result", "Divide the total distance by the combined travel time.", "इससे औसत गति मिलती है।", "ਇਸ ਨਾਲ ਔਸਤ ਗਤੀ ਮਿਲਦੀ ਹੈ।", `S=${answer}`),
      ],
      shortcutMath: `S_{\\text{avg}}=\\frac{D_1+D_2}{\\frac{D_1}{u}+\\frac{D_2}{v}}`,
    };
  }
  if (family === "tsd_fractional_speed_offset") {
    const numerator = pick([4, 5, 6, 7, 8, 9], `${seed}:n`);
    const denominator = numerator + 1;
    const late = pick([8, 10, 12, 15, 18, 20, 24], `${seed}:late`);
    const model: TsdSolverModel = { kind: "fractional_speed_offset", inputs: { numerator, denominator, late } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: {
        en: pick([
          `Walking at ${numerator}/${denominator} of his usual speed, a man reaches office ${late} minutes late. What is his usual time to reach the office?`,
          `A person walks to office at ${numerator}/${denominator} of his usual speed and reaches ${late} minutes late. What is his usual travel time?`,
          `When a man walks at ${numerator}/${denominator} of his normal speed, he is ${late} minutes late for office. How many minutes does he usually take?`,
          `A student reaches school ${late} minutes late after walking at ${numerator}/${denominator} of his usual speed. What is his usual time?`,
          `On reducing his walking speed to ${numerator}/${denominator} of the usual speed, a person is ${late} minutes late. What is the usual time for the journey?`,
          `A worker covers his route at ${numerator}/${denominator} of normal speed and reaches ${late} minutes late. What is his normal travel time?`,
          `At ${numerator}/${denominator} of his usual walking speed, a man reaches the station ${late} minutes late. What is his usual time to reach there?`,
          `A commuter walks at ${numerator}/${denominator} of his regular speed and reaches ${late} minutes late. What is his regular journey time?`,
        ], `${seed}:stem`),
        hi: `अपनी सामान्य गति के ${numerator}/${denominator} से चलने पर एक व्यक्ति कार्यालय ${late} मिनट देर से पहुँचता है। कार्यालय पहुँचने का उसका सामान्य समय कितना है?`,
        pa: `ਆਪਣੀ ਆਮ ਗਤੀ ਦੇ ${numerator}/${denominator} ਨਾਲ ਤੁਰਨ ਤੇ ਇੱਕ ਵਿਅਕਤੀ ਦਫ਼ਤਰ ${late} ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚਦਾ ਹੈ। ਦਫ਼ਤਰ ਪਹੁੰਚਣ ਦਾ ਉਸਦਾ ਆਮ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`,
      },
      model,
      variables: { numerator, denominator, late },
      answerKind: "time",
      answerUnit: "minutes",
      steps: [
        step("idea", "When speed is reduced by a fraction, time increases by the reciprocal fraction.", "गति भिन्न में घटे तो समय उसके उलटे अनुपात में बढ़ता है।", "ਗਤੀ ਭਿੰਨ ਵਿੱਚ ਘਟੇ ਤਾਂ ਸਮਾਂ ਉਲਟੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵਧਦਾ ਹੈ।", `T'=\\frac{${denominator}}{${numerator}}T`),
        step("gap", "The extra time equals the late time.", "अतिरिक्त समय ही देरी है।", "ਵਾਧੂ ਸਮਾਂ ਹੀ ਦੇਰੀ ਹੈ।", `T'-T=${late}`),
        step("result", "The late time is the extra time caused by reduced speed.", "सामान्य समय निकालें।", "ਆਮ ਸਮਾਂ ਕੱਢੋ।", `T=${answer}`),
      ],
      shortcutMath: `\\Delta T=\\left(\\frac{b}{a}-1\\right)T`,
    };
  }
  if (/ratio/u.test(family)) {
    const a = pick([2, 3, 4], `${seed}:a`);
    const b = pick([3, 4, 5], `${seed}:b`);
    const result = family === "tsd_speed_ratio_time_ratio" ? ratioText(b, a) : ratioText(a * b, (a + 1) * (b - 1 || 1));
    const model: TsdSolverModel = { kind: "ratio_result", inputs: { result } };
    return {
      stem: {
        en: pick([
          `Two cyclists cover the same distance. Their speeds are in the ratio ${a}:${b}. What is the ratio of their times?`,
          `A bus and a van travel equal distances with speeds in the ratio ${a}:${b}. What will be the ratio of their times?`,
          `Two walkers go from the market to the station over the same distance. Their speeds are in the ratio ${a}:${b}. What is the ratio of their times?`,
          `A car and a motorcycle cover equal distances at speeds in the ratio ${a}:${b}. What is the ratio of the time taken by them?`,
          `Two delivery riders travel the same route with speeds in the ratio ${a}:${b}. What is the ratio of their travel times?`,
          `Two trains cover equal distances and their speeds are in the ratio ${a}:${b}. What is the ratio of their times?`,
          `A runner and a cyclist cover the same distance with speeds in the ratio ${a}:${b}. What is the ratio of the time taken?`,
          `Two vehicles complete the same trip with speeds in the ratio ${a}:${b}. What is the corresponding time ratio?`,
        ], `${seed}:stem`),
        hi: `दो व्यक्ति समान दूरी तय करते हैं। उनकी गतियों का अनुपात ${a}:${b} है। समान दूरी के लिए उनके समय का अनुपात क्या होगा?`,
        pa: `ਦੋ ਵਿਅਕਤੀ ਇੱਕੋ ਦੂਰੀ ਤੈਅ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਤੀਆਂ ਦਾ ਅਨੁਪਾਤ ${a}:${b} ਹੈ। ਇੱਕੋ ਦੂਰੀ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੋਵੇਗਾ?`,
      },
      model,
      variables: { a, b, result },
      answerKind: "ratio",
      answerUnit: "ratio",
      steps: [
        step("idea", "For the same distance, time ratio is the inverse of speed ratio.", "समान दूरी में समय का अनुपात गति के अनुपात का उलटा होता है।", "ਇੱਕੋ ਦੂਰੀ ਵਿੱਚ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਗਤੀ ਦੇ ਅਨੁਪਾਤ ਦਾ ਉਲਟਾ ਹੁੰਦਾ ਹੈ।", `T_1:T_2=v_2:v_1`),
        step("substitution", "Reverse the given speed ratio.", "दिए गए गति-अनुपात को उलटें।", "ਦਿੱਤੇ ਗਤੀ-ਅਨੁਪਾਤ ਨੂੰ ਉਲਟੋ।", `T_1:T_2=${b}:${a}`),
        step("result", "This gives the required time ratio.", "यही आवश्यक समय-अनुपात है।", "ਇਹੀ ਲੋੜੀਂਦਾ ਸਮਾਂ-ਅਨੁਪਾਤ ਹੈ।", `T_1:T_2=${result}`),
      ],
      shortcutMath: `T_1:T_2=v_2:v_1`,
    };
  }
  if (/early_late|arrival|hidden_distance|hidden_speed/u.test(family)) {
    const slow = pick([4, 5, 6], `${seed}:slow`);
    const fast = slow + pick([1, 2], `${seed}:diff`);
    const late = pick([10, 12, 15], `${seed}:late`);
    const early = pick([5, 8, 10], `${seed}:early`);
    const gapHours = (late + early) / 60;
    const model: TsdSolverModel = { kind: "early_late_distance", inputs: { slow, fast, gapHours } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: {
        en: pick([
          `A student walking to school is ${late} minutes late at ${slow} km/h and ${early} minutes early at ${fast} km/h. What is the distance to his school?`,
          `A man reaches office ${late} minutes late at ${slow} km/h and ${early} minutes early at ${fast} km/h. How far is his office?`,
          `A cyclist reaches the coaching centre ${late} minutes late at ${slow} km/h. At ${fast} km/h, he reaches ${early} minutes early. What is the distance to the centre?`,
          `A delivery van reaches the market ${late} minutes late at ${slow} km/h and ${early} minutes early at ${fast} km/h. What is the distance to the market?`,
          `A worker walking to the factory is ${late} minutes late at ${slow} km/h but ${early} minutes early at ${fast} km/h. How far is the factory?`,
          `A student travelling to the station reaches ${late} minutes late at ${slow} km/h and ${early} minutes early at ${fast} km/h. What is the distance to the station?`,
          `At ${slow} km/h, a person reaches his office ${late} minutes late. At ${fast} km/h, he reaches ${early} minutes early. What is the office distance?`,
          `A school bus would be ${late} minutes late at ${slow} km/h and ${early} minutes early at ${fast} km/h. What distance is it scheduled to cover?`,
        ], `${seed}:stem`),
        hi: `यदि एक छात्र ${slow} किमी/घं से चलता है, तो वह स्कूल ${late} मिनट देर से पहुँचता है। यदि वह ${fast} किमी/घं से चलता है, तो ${early} मिनट पहले पहुँचता है। उसके स्कूल की दूरी कितनी है?`,
        pa: `ਜੇ ਇੱਕ ਵਿਦਿਆਰਥੀ ${slow} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਤੁਰਦਾ ਹੈ, ਤਾਂ ਉਹ ਸਕੂਲ ${late} ਮਿੰਟ ਦੇਰ ਨਾਲ ਪਹੁੰਚਦਾ ਹੈ। ਜੇ ਉਹ ${fast} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਤੁਰਦਾ ਹੈ, ਤਾਂ ${early} ਮਿੰਟ ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਉਸਦੇ ਸਕੂਲ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`,
      },
      model,
      variables: { slow, fast, late, early, gapHours },
      answerKind: "distance",
      answerUnit: "km",
      steps: [
        step("gap", "The total time gap is from late to early, so add both differences.", "देर और जल्दी के समयों को जोड़कर कुल अंतर लें।", "ਦੇਰੀ ਅਤੇ ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਵਾਲੇ ਸਮੇਂ ਜੋੜ ਕੇ ਕੁੱਲ ਅੰਤਰ ਲਵੋ।", `\\Delta T=${late}+${early}=\\frac{${late + early}}{60}`),
        step("formula", "Use the early-late distance relation.", "जल्दी-देर वाली दूरी का संबंध लगाएँ।", "ਜਲਦੀ-ਦੇਰੀ ਵਾਲਾ ਦੂਰੀ ਸੰਬੰਧ ਲਗਾਓ।", `D=\\frac{uv}{v-u}\\times \\Delta T`),
        step("result", "Put the two walking speeds and the total time gap in the relation.", "गतियाँ और समय-अंतर रखें।", "ਗਤੀਆਂ ਅਤੇ ਸਮਾਂ-ਅੰਤਰ ਰੱਖੋ।", `D=\\frac{${slow}\\times ${fast}}{${fast}-${slow}}\\times \\frac{${late + early}}{60}=${answer}`),
      ],
      shortcutMath: `D=\\frac{uv}{v-u}\\times \\Delta T`,
    };
  }
  if (/stoppage/u.test(family)) {
    const without = pick([54, 60, 72], `${seed}:without`);
    const withStop = without - pick([9, 12, 18], `${seed}:gap`);
    const model: TsdSolverModel = { kind: "stoppage_minutes", inputs: { without, with: withStop } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: {
        en: `Excluding stoppages, a bus runs at ${without} km/h. Including stoppages, its average speed is ${withStop} km/h. For how many minutes does it stop per hour?`,
        hi: `रुकने का समय हटाकर बस ${without} किमी/घं से चलती है। रुकने सहित औसत गति ${withStop} किमी/घं है। वह प्रति घंटे कितने मिनट रुकती है?`,
        pa: `ਰੁਕਣ ਦਾ ਸਮਾਂ ਹਟਾ ਕੇ ਬੱਸ ${without} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਚਲਦੀ ਹੈ। ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਗਤੀ ${withStop} ਕਿਮੀ/ਘੰਟਾ ਹੈ। ਉਹ ਹਰ ਘੰਟੇ ਕਿੰਨੇ ਮਿੰਟ ਰੁਕਦੀ ਹੈ?`,
      },
      model,
      variables: { without, withStop },
      answerKind: "time",
      answerUnit: "minutes",
      steps: [
        step("idea", "The bus covers less distance per hour because it stops.", "बस रुकने के कारण प्रति घंटे कम दूरी तय करती है।", "ਬੱਸ ਰੁਕਣ ਕਰਕੇ ਹਰ ਘੰਟੇ ਘੱਟ ਦੂਰੀ ਤੈਅ ਕਰਦੀ ਹੈ।", `T_s=\\frac{S_0-S_1}{S_0}\\times 60`),
        step("substitution", "Compare the speed without stoppage and the speed including stoppage.", "दोनों औसत गतियाँ रखें।", "ਦੋਵੇਂ ਔਸਤ ਗਤੀਆਂ ਰੱਖੋ।", `T_s=\\frac{${without}-${withStop}}{${without}}\\times 60`),
        step("result", "This gives stoppage per hour.", "इससे प्रति घंटे रुकने का समय मिलता है।", "ਇਸ ਨਾਲ ਹਰ ਘੰਟੇ ਰੁਕਣ ਦਾ ਸਮਾਂ ਮਿਲਦਾ ਹੈ।", `T_s=${answer}`),
      ],
      shortcutMath: `T_s=\\frac{S_0-S_1}{S_0}\\times 60`,
    };
  }
  const distance = pick([120, 150, 180, 240], `${seed}:distance`);
  const time = pick([3, 4, 5], `${seed}:time`);
  const rest = pick([0.5, 1], `${seed}:rest`);
  const model: TsdSolverModel = { kind: "journey_average", inputs: { distance, totalTime: time + rest } };
  const answer = Number(evaluateTsdSolverModel(model));
  return {
    stem: {
      en: `A car covers ${distance} km in ${time} hours of running time and rests for ${rest} hour on the way. What is the average speed including the rest?`,
      hi: `एक कार ${distance} किमी चलने में ${time} घंटे लगाती है और रास्ते में ${rest} घंटा रुकती है। रुकने सहित औसत गति कितनी है?`,
      pa: `ਇੱਕ ਕਾਰ ${distance} ਕਿਮੀ ਚਲਣ ਵਿੱਚ ${time} ਘੰਟੇ ਲਗਾਉਂਦੀ ਹੈ ਅਤੇ ਰਸਤੇ ਵਿੱਚ ${rest} ਘੰਟਾ ਰੁਕਦੀ ਹੈ। ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਗਤੀ ਕਿੰਨੀ ਹੈ?`,
    },
    model,
    variables: { distance, time, rest },
    answerKind: "speed",
    answerUnit: "kmph",
    steps: [
      step("time", "Include the rest time in total journey time.", "कुल यात्रा समय में रुकने का समय जोड़ें।", "ਕੁੱਲ ਯਾਤਰਾ ਸਮੇਂ ਵਿੱਚ ਰੁਕਣ ਦਾ ਸਮਾਂ ਜੋੜੋ।", `T=${time}+${rest}`),
      step("formula", "Use total distance over running time plus rest time.", "औसत गति = कुल दूरी / कुल समय।", "ਔਸਤ ਗਤੀ = ਕੁੱਲ ਦੂਰੀ / ਕੁੱਲ ਸਮਾਂ।", `S_{\\text{avg}}=\\frac{D}{T_{\\text{run}}+T_{\\text{rest}}}`),
      step("result", "Use the journey distance and the combined journey time.", "दूरी और कुल समय रखें।", "ਦੂਰੀ ਅਤੇ ਕੁੱਲ ਸਮਾਂ ਰੱਖੋ।", `S=\\frac{${distance}}{${time + rest}}=${answer}`),
    ],
    shortcutMath: `S_{\\text{avg}}=\\frac{D}{T_{\\text{run}}+T_{\\text{rest}}}`,
  };
}

function draftRelative(spec: MotifSpec, seed: string): Draft {
  const family = spec.id;
  const s1 = pick([18, 20, 24, 30, 36, 40, 45, 48], `${seed}:s1`);
  const s2 = s1 + pick([6, 10, 12, 15, 18, 20, 24], `${seed}:s2`);
  if (/opposite|meet|meeting_point|two_point/u.test(family)) {
    const distance = pick([90, 120, 150, 180, 210, 240, 300, 360], `${seed}:d`);
    const rel = s1 + s2;
    const model: TsdSolverModel = { kind: family === "tsd_meeting_point_distance_split" ? "meeting_distance" : "relative_time", inputs: family === "tsd_meeting_point_distance_split" ? { speed: s1, time: distance / rel } : { distance, relativeSpeed: rel } };
    const answer = evaluateTsdSolverModel(model);
    return {
      stem: {
        en: pick([
          `Two cyclists start from two towns ${distance} km apart and move towards each other at ${s1} km/h and ${s2} km/h. After how many hours will they meet?`,
          `Two riders leave opposite towns ${distance} km apart and travel towards each other at ${s1} km/h and ${s2} km/h. After how many hours will they meet?`,
          `A cyclist from town A and another from town B start towards each other. The towns are ${distance} km apart, and their speeds are ${s1} km/h and ${s2} km/h. In how many hours will they meet?`,
          `From two places ${distance} km apart, A and B start towards each other at ${s1} km/h and ${s2} km/h. After how many hours will they meet?`,
        ], `${seed}:stem`),
        hi: `दो साइकिल चालक ${distance} किमी दूर दो शहरों से एक-दूसरे की ओर ${s1} किमी/घं और ${s2} किमी/घं से चलते हैं। वे कितने घंटे बाद मिलेंगे?`,
        pa: `ਦੋ ਸਾਈਕਲ ਸਵਾਰ ${distance} ਕਿਮੀ ਦੂਰ ਦੋ ਸ਼ਹਿਰਾਂ ਤੋਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ${s1} ਕਿਮੀ/ਘੰਟਾ ਅਤੇ ${s2} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਚਲਦੇ ਹਨ। ਉਹ ਕਿੰਨੇ ਘੰਟਿਆਂ ਬਾਅਦ ਮਿਲਣਗੇ?`,
      },
      model: { kind: "relative_time", inputs: { distance, relativeSpeed: rel } },
      variables: { s1, s2, distance, rel },
      answerKind: "time",
      answerUnit: "hours",
      steps: [
        step("relative", "In opposite directions, add the speeds.", "विपरीत दिशा में गतियाँ जोड़ते हैं।", "ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਤੀਆਂ ਜੋੜਦੇ ਹਾਂ।", `v_r=${s1}+${s2}=${rel}`),
        step("time", "Meeting time is distance divided by relative speed.", "मिलने का समय = दूरी / आपसी गति।", "ਮਿਲਣ ਦਾ ਸਮਾਂ = ਦੂਰੀ / ਆਪਸੀ ਗਤੀ।", `T=\\frac{D}{v_r}`),
        step("result", "Use the given distance with the relative speed.", "दूरी और आपसी गति रखें।", "ਦੂਰੀ ਅਤੇ ਆਪਸੀ ਗਤੀ ਰੱਖੋ।", `T=\\frac{${distance}}{${rel}}=${clean(Number(evaluateTsdSolverModel({ kind: "relative_time", inputs: { distance, relativeSpeed: rel } })))}`),
      ],
      shortcutMath: `T=\\frac{D}{v_1+v_2}`,
    };
  }
  const delay = pick([1, 2, 3, 4], `${seed}:delay`);
  const headStart = s1 * delay;
  const rel = s2 - s1;
  const model: TsdSolverModel = { kind: "catch_up_time", inputs: { headStart, relativeSpeed: rel } };
  const answer = Number(evaluateTsdSolverModel(model));
  return {
    stem: {
      en: pick([
        `A starts from a town at ${s1} km/h. B starts ${delay} hours later from the same town at ${s2} km/h. After how many hours from B's start will B catch A?`,
        `A leaves a town at ${s1} km/h. After ${delay} hours, B leaves the same town at ${s2} km/h. In how many hours from B's start will B catch A?`,
        `A is travelling at ${s1} km/h. B starts from the same point ${delay} hours later at ${s2} km/h. After how many hours will B catch A?`,
        `A gets a head start of ${delay} hours while moving at ${s1} km/h. B follows at ${s2} km/h. In how many hours from B's start will B catch A?`,
        `A van leaves first at ${s1} km/h. A faster car leaves ${delay} hours later at ${s2} km/h. After how many hours from the car's start will it catch the van?`,
        `A cyclist starts at ${s1} km/h, and another cyclist starts ${delay} hours later at ${s2} km/h from the same point. In how many hours will the second cyclist catch the first?`,
        `A truck has already travelled for ${delay} hours at ${s1} km/h when a car starts behind it at ${s2} km/h. In how many hours will the car catch the truck?`,
        `A bus starts from a depot at ${s1} km/h. After ${delay} hours, a taxi starts on the same route at ${s2} km/h. After how many hours will the taxi catch the bus?`,
      ], `${seed}:stem`),
      hi: `A एक शहर से ${s1} किमी/घं से चलता है। B उसी शहर से ${delay} घंटे बाद ${s2} किमी/घं से चलता है। B अपने शुरू होने के कितने घंटे बाद A को पकड़ लेगा?`,
      pa: `A ਇੱਕ ਸ਼ਹਿਰ ਤੋਂ ${s1} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਚਲਦਾ ਹੈ। B ਉਸੇ ਸ਼ਹਿਰ ਤੋਂ ${delay} ਘੰਟੇ ਬਾਅਦ ${s2} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਚਲਦਾ ਹੈ। B ਆਪਣੇ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਕਿੰਨੇ ਘੰਟਿਆਂ ਬਾਅਦ A ਨੂੰ ਪਿੱਛੋਂ ਆ ਕੇ ਪਕੜੇਗਾ?`,
    },
    model,
    variables: { s1, s2, delay, headStart, rel },
    answerKind: "time",
    answerUnit: "hours",
    steps: [
      step("headstart", "B first has to cover the distance already gained by A.", "B को पहले A द्वारा बनाई दूरी पूरी करनी है।", "B ਨੂੰ ਪਹਿਲਾਂ A ਵੱਲੋਂ ਬਣਾਈ ਦੂਰੀ ਪੂਰੀ ਕਰਨੀ ਹੈ।", `D_h=${s1}\\times ${delay}=${headStart}`),
      step("relative", "In the same direction, subtract the speeds.", "समान दिशा में गतियाँ घटाते हैं।", "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਗਤੀਆਂ ਘਟਾਉਂਦੇ ਹਾਂ।", `v_r=${s2}-${s1}=${rel}`),
      step("result", "Catch-up time is head start divided by relative speed.", "पकड़ने का समय = शुरुआती दूरी / आपसी गति।", "ਪਕੜਣ ਦਾ ਸਮਾਂ = ਪਹਿਲਾਂ ਬਣੀ ਦੂਰੀ / ਫਰਕ ਵਾਲੀ ਗਤੀ।", `T=\\frac{${headStart}}{${rel}}=${answer}`),
    ],
    shortcutMath: `T=\\frac{D_h}{v_2-v_1}`,
  };
}

function draftTrain(spec: MotifSpec, seed: string): Draft {
  const family = spec.id;
  if (family === "train_post_meeting_cross") {
    const time1 = pick([9, 16, 25], `${seed}:t1`);
    const time2 = pick([16, 25, 36], `${seed}:t2`);
    const model: TsdSolverModel = { kind: "train_post_meeting", inputs: { time1, time2 } };
    const answer = evaluateTsdSolverModel(model);
    return {
      stem: {
        en: pick([
          `After two trains meet, the first train reaches the second train's starting station in ${time1} hours and the second reaches the first train's starting station in ${time2} hours. What is the ratio of their speeds?`,
          `Two trains meet between their starting stations. After meeting, one reaches the other's starting station in ${time1} hours and the other in ${time2} hours. What is their speed ratio?`,
          `After crossing each other, train A takes ${time1} hours to reach B's starting station, while train B takes ${time2} hours to reach A's starting station. What is the ratio of their speeds?`,
          `Two trains start from opposite stations and meet on the way. From the meeting point, they take ${time1} hours and ${time2} hours to reach the opposite stations. What is their speed ratio?`,
          `Train A and train B meet during the journey. After that, A takes ${time1} hours and B takes ${time2} hours to reach the opposite starting stations. What is the ratio of their speeds?`,
          `Two trains meet at a point between two stations. Their remaining times to the opposite stations are ${time1} hours and ${time2} hours. What is the ratio of their speeds?`,
        ], `${seed}:stem`),
        hi: `दो ट्रेनें मिलने के बाद पहली ट्रेन दूसरी के शुरुआती स्टेशन पर ${time1} घंटे में और दूसरी ट्रेन पहली के शुरुआती स्टेशन पर ${time2} घंटे में पहुँचती है। उनकी गतियों का अनुपात क्या है?`,
        pa: `ਦੋ ਰੇਲਗੱਡੀਆਂ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਪਹਿਲੀ ਰੇਲਗੱਡੀ ਦੂਜੀ ਦੇ ਸ਼ੁਰੂਆਤੀ ਸਟੇਸ਼ਨ ਤੇ ${time1} ਘੰਟਿਆਂ ਵਿੱਚ ਅਤੇ ਦੂਜੀ ਪਹਿਲੀ ਦੇ ਸ਼ੁਰੂਆਤੀ ਸਟੇਸ਼ਨ ਤੇ ${time2} ਘੰਟਿਆਂ ਵਿੱਚ ਪਹੁੰਚਦੀ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਤੀਆਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      },
      model,
      variables: { time1, time2 },
      answerKind: "ratio",
      answerUnit: "ratio",
      steps: [
        step("idea", "After meeting, the remaining times give the square-root speed ratio.", "मिलने के बाद बचे समयों से वर्गमूल गति-अनुपात मिलता है।", "ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਬਚੇ ਸਮਿਆਂ ਨਾਲ ਵਰਗਮੂਲ ਗਤੀ-ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।", `\\frac{S_1}{S_2}=\\sqrt{\\frac{T_2}{T_1}}`),
        step("substitution", "Use the two remaining journey times after the meeting.", "मिलने के बाद के दोनों समय रखें।", "ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਦੇ ਦੋਵੇਂ ਸਮੇਂ ਰੱਖੋ।", `\\frac{S_1}{S_2}=\\sqrt{\\frac{${time2}}{${time1}}}`),
        step("result", "Simplify the ratio.", "अनुपात सरल करें।", "ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", `S_1:S_2=${answer}`),
      ],
      shortcutMath: `\\frac{S_1}{S_2}=\\sqrt{\\frac{T_2}{T_1}}`,
    };
  }
  const trainLength = pick([90, 100, 120, 150, 180, 200, 240, 250, 300], `${seed}:l1`);
  const otherLength = /two_trains|overtake|relative_speed/u.test(family) ? pick([90, 100, 120, 150, 180, 200, 240], `${seed}:l2`) : pick([100, 150, 200, 250, 300, 350, 400, 450], `${seed}:p`);
  const speed = pick([15, 18, 20, 25, 30, 36], `${seed}:v`);
  const otherSpeed = pick([5, 6, 8, 10, 12, 15], `${seed}:ov`);
  const opposite = /opposite|meet_between/u.test(family);
  const same = /same_direction|overtake/u.test(family);
  const relativeSpeed = same ? speed - otherSpeed : opposite ? speed + otherSpeed : speed;
  const distance = /person/u.test(family) ? trainLength : trainLength + otherLength;
  if (/unknown|length_from|platform_length|bridge_length/u.test(family)) {
    const time = pick([8, 10, 12, 15, 18, 20, 24, 30], `${seed}:time`);
    const rel = pick([15, 18, 20, 25, 30, 36], `${seed}:rel`);
    const knownLength = pick([90, 100, 120, 150, 180, 200, 240], `${seed}:known`);
    const model: TsdSolverModel = { kind: "train_unknown_length", inputs: { relativeSpeed: rel, time, knownLength } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: {
        en: pick([
          `A train crosses a platform in ${time} seconds at ${rel} m/s. If the known train length is ${knownLength} m, what is the platform length?`,
          `A ${knownLength} m long train crosses a platform in ${time} seconds at ${rel} m/s. What is the length of the platform?`,
          `A train of length ${knownLength} m passes a platform in ${time} seconds at ${rel} m/s. Find the length of the platform?`,
          `A passenger train of length ${knownLength} m takes ${time} seconds to cross a platform at ${rel} m/s. What is the platform length?`,
          `An express train moves at ${rel} m/s and crosses a platform in ${time} seconds. If the train length is ${knownLength} m, what is the platform length?`,
          `A train moving at ${rel} m/s crosses a platform in ${time} seconds. Its length is ${knownLength} m. What is the platform length?`,
          `A railway coach formation ${knownLength} m long crosses a platform in ${time} seconds at ${rel} m/s. What is the platform length?`,
          `A train takes ${time} seconds to pass a platform while moving at ${rel} m/s. If its length is ${knownLength} m, what is the platform length?`,
          `At ${rel} m/s, a ${knownLength} m long train completely crosses a platform in ${time} seconds. What is the platform length?`,
          `The length of a train is ${knownLength} m. It crosses a platform in ${time} seconds at ${rel} m/s. What is the platform length?`,
          `A platform is crossed by a ${knownLength} m long train in ${time} seconds at ${rel} m/s. What is the length of the platform?`,
          `A train of ${knownLength} m length needs ${time} seconds to pass a platform at ${rel} m/s. What is the platform length?`,
          `A ${knownLength} m train runs past a platform at ${rel} m/s and clears it in ${time} seconds. What is the platform length?`,
        ], `${seed}:stem`),
        hi: `एक ट्रेन ${rel} मी/से की गति से ${time} सेकंड में प्लेटफॉर्म पार करती है। यदि ट्रेन की लंबाई ${knownLength} मीटर है, तो प्लेटफॉर्म की लंबाई कितनी है?`,
        pa: `ਇੱਕ ਰੇਲਗੱਡੀ ${rel} ਮੀ/ਸੇ ਦੀ ਗਤੀ ਨਾਲ ${time} ਸਕਿੰਟ ਵਿੱਚ ਪਲੇਟਫਾਰਮ ਪਾਰ ਕਰਦੀ ਹੈ। ਜੇ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ${knownLength} ਮੀਟਰ ਹੈ, ਤਾਂ ਪਲੇਟਫਾਰਮ ਦੀ ਲੰਬਾਈ ਕਿੰਨੀ ਹੈ?`,
      },
      model,
      variables: { rel, time, knownLength },
      answerKind: "length",
      answerUnit: "m",
      steps: [
        step("distance", "Crossing distance equals speed multiplied by time.", "पार करने की दूरी = गति x समय।", "ਪਾਰ ਕਰਨ ਦੀ ਦੂਰੀ = ਗਤੀ x ਸਮਾਂ।", `D=vt=${rel}\\times ${time}`),
        step("length", "Subtract the known train length from the crossing distance.", "पार दूरी में से ट्रेन की लंबाई घटाएँ।", "ਪਾਰ ਦੂਰੀ ਵਿੱਚੋਂ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ਘਟਾਓ।", `L_p=D-L_t`),
        step("result", "This gives the unknown length.", "इससे अज्ञात लंबाई मिलती है।", "ਇਸ ਨਾਲ ਅਣਜਾਣ ਲੰਬਾਈ ਮਿਲਦੀ ਹੈ।", `L_p=${rel * time}-${knownLength}=${answer}`),
      ],
      shortcutMath: `L_x=vt-L`,
    };
  }
  const model: TsdSolverModel = { kind: "train_crossing", inputs: { distance, relativeSpeed } };
  const answer = Number(evaluateTsdSolverModel(model));
  const object = family.includes("bridge") ? "bridge" : family.includes("platform") ? "platform" : /two_trains|overtake|relative_speed/u.test(family) ? "another train" : "a person";
  return {
    stem: {
      en: pick([
        `A ${trainLength} m long train crosses ${object} of effective length ${otherLength} m with relative speed ${relativeSpeed} m/s. In how many seconds will it complete the crossing?`,
        `A train of length ${trainLength} m has to cover an effective crossing length of ${otherLength} m. If the relative speed is ${relativeSpeed} m/s, in how many seconds will the crossing be completed?`,
        `A ${trainLength} m train passes ${object} whose effective length is ${otherLength} m. At a relative speed of ${relativeSpeed} m/s, how many seconds are required?`,
        `For a crossing, a ${trainLength} m train must also cover ${otherLength} m of external length. If its relative speed is ${relativeSpeed} m/s, in how many seconds will it cross completely?`,
      ], `${seed}:stem`),
      hi: `${trainLength} मीटर लंबी ट्रेन ${otherLength} मीटर प्रभावी लंबाई वाली वस्तु को ${relativeSpeed} मी/से की आपसी गति से पार करती है। पार करने में कितने सेकंड लगेंगे?`,
      pa: `${trainLength} ਮੀਟਰ ਲੰਬੀ ਰੇਲਗੱਡੀ ${otherLength} ਮੀਟਰ ਪ੍ਰਭਾਵੀ ਲੰਬਾਈ ਵਾਲੀ ਚੀਜ਼ ਨੂੰ ${relativeSpeed} ਮੀ/ਸੇ ਦੀ ਆਪਸੀ ਗਤੀ ਨਾਲ ਪਾਰ ਕਰਦੀ ਹੈ। ਪਾਰ ਕਰਨ ਵਿੱਚ ਕਿੰਨੇ ਸਕਿੰਟ ਲੱਗਣਗੇ?`,
    },
    model,
    variables: { trainLength, otherLength, relativeSpeed, distance },
    answerKind: "time",
    answerUnit: "seconds",
    steps: [
      step("distance", "The train covers the combined effective length.", "ट्रेन कुल प्रभावी लंबाई तय करती है।", "ਰੇਲਗੱਡੀ ਕੁੱਲ ਪ੍ਰਭਾਵੀ ਲੰਬਾਈ ਤੈਅ ਕਰਦੀ ਹੈ।", `D=L_1+L_2=${trainLength}+${otherLength}`),
      step("time", "Crossing time is distance divided by relative speed.", "पार करने का समय = दूरी / आपसी गति।", "ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ = ਦੂਰੀ / ਆਪਸੀ ਗਤੀ।", `T=\\frac{D}{v_r}`),
      step("result", "Use the effective crossing distance with the relative speed.", "पार दूरी और आपसी गति रखें।", "ਪਾਰ ਦੂਰੀ ਅਤੇ ਆਪਸੀ ਗਤੀ ਰੱਖੋ।", `T=\\frac{${distance}}{${relativeSpeed}}=${answer}`),
    ],
    shortcutMath: `T=\\frac{L_1+L_2}{v_r}`,
  };
}

function draftBoat(spec: MotifSpec, seed: string): Draft {
  const distance = pick([24, 30, 36, 48, 60, 72, 90, 120], `${seed}:d`);
  const downTime = pick([2, 3, 4, 5], `${seed}:dt`);
  const upTime = downTime + pick([1, 2, 3], `${seed}:ut`);
  const down = distance / downTime;
  const up = distance / upTime;
  const ask = spec.id.includes("stream") ? "stream" : "boat";
  const model: TsdSolverModel = { kind: "boat_speed", inputs: { down, up, ask } };
  const answer = Number(evaluateTsdSolverModel(model));
  return {
    stem: {
      en: pick([
        `A boat travels ${distance} km downstream in ${downTime} hours and ${distance} km upstream in ${upTime} hours. What is the ${ask === "stream" ? "speed of the stream" : "speed of the boat in still water"}?`,
        `A boat covers ${distance} km with the stream in ${downTime} hours and the same distance against the stream in ${upTime} hours. What is the ${ask === "stream" ? "stream speed" : "speed of the boat in still water"}?`,
        `Going downstream, a boat covers ${distance} km in ${downTime} hours. Going upstream, it covers ${distance} km in ${upTime} hours. What is the ${ask === "stream" ? "speed of the stream" : "still-water speed of the boat"}?`,
        `A motorboat takes ${downTime} hours downstream and ${upTime} hours upstream to cover ${distance} km each way. What is the ${ask === "stream" ? "speed of the current" : "speed of the boat in still water"}?`,
        `On a river, a boat goes ${distance} km downstream in ${downTime} hours and returns ${distance} km upstream in ${upTime} hours. What is the ${ask === "stream" ? "stream speed" : "boat's still-water speed"}?`,
        `For equal river distances of ${distance} km, a boat takes ${downTime} hours downstream and ${upTime} hours upstream. What is the ${ask === "stream" ? "speed of the stream" : "speed in still water"}?`,
        `A boat's downstream trip of ${distance} km takes ${downTime} hours, while its upstream trip of ${distance} km takes ${upTime} hours. What is the ${ask === "stream" ? "current speed" : "still-water boat speed"}?`,
        `A boat completes ${distance} km along the current in ${downTime} hours and ${distance} km against the current in ${upTime} hours. What is the ${ask === "stream" ? "speed of the current" : "speed of the boat in still water"}?`,
      ], `${seed}:stem`),
      hi: `एक नाव ${distance} किमी धारा के अनुकूल ${downTime} घंटे में और ${distance} किमी धारा के प्रतिकूल ${upTime} घंटे में चलती है। ${ask === "stream" ? "धारा की गति" : "शांत जल में नाव की गति"} कितनी है?`,
      pa: `ਇੱਕ ਕਿਸ਼ਤੀ ${distance} ਕਿਮੀ ਧਾਰਾ ਦੇ ਨਾਲ ${downTime} ਘੰਟਿਆਂ ਵਿੱਚ ਅਤੇ ${distance} ਕਿਮੀ ਧਾਰਾ ਦੇ ਉਲਟ ${upTime} ਘੰਟਿਆਂ ਵਿੱਚ ਜਾਂਦੀ ਹੈ। ${ask === "stream" ? "ਧਾਰਾ ਦੀ ਗਤੀ" : "ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਕਿਸ਼ਤੀ ਦੀ ਗਤੀ"} ਕਿੰਨੀ ਹੈ?`,
    },
    model,
    variables: { distance, downTime, upTime, down, up, ask },
    answerKind: "speed",
    answerUnit: "kmph",
    steps: [
      step("speeds", "Find downstream and upstream speeds from distance and time.", "दूरी और समय से अनुकूल और प्रतिकूल गतियाँ निकालें।", "ਦੂਰੀ ਅਤੇ ਸਮੇਂ ਤੋਂ ਨਾਲ ਅਤੇ ਉਲਟ ਗਤੀਆਂ ਕੱਢੋ।", `v_d=\\frac{${distance}}{${downTime}},\\quad v_u=\\frac{${distance}}{${upTime}}`),
      step("relation", "Boat and stream speeds are obtained by averaging or halving the difference.", "नाव और धारा की गति औसत या आधे अंतर से मिलती है।", "ਕਿਸ਼ਤੀ ਅਤੇ ਧਾਰਾ ਦੀ ਗਤੀ ਔਸਤ ਜਾਂ ਅੱਧੇ ਫਰਕ ਨਾਲ ਮਿਲਦੀ ਹੈ।", ask === "stream" ? `v_s=\\frac{v_d-v_u}{2}` : `v_b=\\frac{v_d+v_u}{2}`),
      step("result", "Use downstream and upstream speeds to isolate the requested speed.", "दोनों गतियाँ रखें।", "ਦੋਵੇਂ ਗਤੀਆਂ ਰੱਖੋ।", ask === "stream" ? `v_s=\\frac{${down}-${up}}{2}=${answer}` : `v_b=\\frac{${down}+${up}}{2}=${answer}`),
    ],
    shortcutMath: ask === "stream" ? `v_s=\\frac{v_d-v_u}{2}` : `v_b=\\frac{v_d+v_u}{2}`,
  };
}

function draftRace(spec: MotifSpec, seed: string): Draft {
  const raceDistance = pick([300, 400, 500, 600, 800, 1000], `${seed}:d`);
  const lead = pick([30, 40, 50, 60, 80, 100], `${seed}:lead`);
  const winnerSpeed = pick([6, 8, 10, 12, 15, 20], `${seed}:speed`);
  const model: TsdSolverModel = spec.id.includes("time") || spec.id.includes("deficit")
    ? { kind: "race_time", inputs: { lead, speed: winnerSpeed } }
    : { kind: "race_speed", inputs: { raceDistance, lead, winnerSpeed } };
  const answer = Number(evaluateTsdSolverModel(model));
  const asksTime = model.kind === "race_time";
  return {
    stem: {
      en: `In a ${raceDistance} m race, A beats B by ${lead} m. If A's speed is ${winnerSpeed} m/s, what is ${asksTime ? "the time by which B is behind" : "B's speed"}?`,
      hi: `${raceDistance} मीटर की दौड़ में A, B को ${lead} मीटर से हराता है। यदि A की गति ${winnerSpeed} मी/से है, तो ${asksTime ? "B कितने सेकंड पीछे है" : "B की गति कितनी है"}?`,
      pa: `${raceDistance} ਮੀਟਰ ਦੀ ਦੌੜ ਵਿੱਚ A, B ਨੂੰ ${lead} ਮੀਟਰ ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ A ਦੀ ਗਤੀ ${winnerSpeed} ਮੀ/ਸੇ ਹੈ, ਤਾਂ ${asksTime ? "B ਕਿੰਨੇ ਸਕਿੰਟ ਪਿੱਛੇ ਹੈ" : "B ਦੀ ਗਤੀ ਕਿੰਨੀ ਹੈ"}?`,
    },
    model,
    variables: { raceDistance, lead, winnerSpeed },
    answerKind: asksTime ? "time" : "speed",
    answerUnit: asksTime ? "seconds" : "mps",
    steps: [
      step("distance", "When A finishes, B has covered race distance minus lead.", "A के समाप्त करने पर B ने दौड़ दूरी में से बढ़त घटाकर दूरी तय की।", "A ਦੇ ਖਤਮ ਕਰਨ ਤੇ B ਨੇ ਦੌੜ ਦੀ ਦੂਰੀ ਵਿੱਚੋਂ ਲੀਡ ਘਟਾ ਕੇ ਦੂਰੀ ਤੈਅ ਕੀਤੀ।", `D_B=${raceDistance}-${lead}`),
      step("ratio", "For the same time, speed ratio equals distance ratio.", "समान समय में गति-अनुपात दूरी-अनुपात के बराबर है।", "ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਗਤੀ-ਅਨੁਪਾਤ ਦੂਰੀ-ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਹੈ।", `\\frac{v_B}{v_A}=\\frac{D_B}{D_A}`),
      step("result", "Use A's speed to get the required value.", "A की गति से आवश्यक मान निकालें।", "A ਦੀ ਗਤੀ ਨਾਲ ਲੋੜੀਂਦਾ ਮੁੱਲ ਕੱਢੋ।", asksTime ? `T=\\frac{${lead}}{${winnerSpeed}}=${answer}` : `v_B=${winnerSpeed}\\times \\frac{${raceDistance - lead}}{${raceDistance}}=${answer}`),
    ],
    shortcutMath: asksTime ? `T=\\frac{d_l}{v_A}` : `v_B=v_A\\times \\frac{D-l}{D}`,
  };
}

function draftCircular(spec: MotifSpec, seed: string): Draft {
  const circumference = pick([300, 360, 400, 450, 500, 600, 720, 900], `${seed}:c`);
  const s1 = pick([5, 6, 7, 8, 9, 10, 12], `${seed}:s1`);
  const rawS2 = pick([2, 3, 4, 5, 6, 8], `${seed}:s2`);
  const s2 = rawS2 === s1 ? Math.max(2, rawS2 - 1) : rawS2;
  const opposite = spec.id.includes("opposite");
  const meetings = spec.id.includes("repeated") || spec.id.includes("three") ? pick([2, 3], `${seed}:m`) : 1;
  const relativeSpeed = opposite ? s1 + s2 : Math.abs(s1 - s2);
  const model: TsdSolverModel = { kind: "circular_time", inputs: { circumference, relativeSpeed, meetings } };
  const answer = Number(evaluateTsdSolverModel(model));
  return {
    stem: {
      en: pick([
        `A pair of runners start together on a circular track of ${circumference} m. Their speeds are ${s1} m/s and ${s2} m/s. After how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `A and B run on a circular track of ${circumference} m at ${s1} m/s and ${s2} m/s. Starting together, after how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `On a ${circumference} m circular track, two runners start together with speeds ${s1} m/s and ${s2} m/s. After how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `Two athletes begin together on a circular track of length ${circumference} m. Their speeds are ${s1} m/s and ${s2} m/s. In how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `On a ${circumference} m stadium track, A runs at ${s1} m/s and B runs at ${s2} m/s from the same point. After how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `Two cyclists start together on a ${circumference} m park track with speeds ${s1} m/s and ${s2} m/s. In how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `A runner moving at ${s1} m/s and another moving at ${s2} m/s start together on a ${circumference} m circular path. After how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `From the same point on a ${circumference} m track, A and B start running at ${s1} m/s and ${s2} m/s. In how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `A stadium lap is ${circumference} m. Two runners start together at ${s1} m/s and ${s2} m/s. After how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
        `On a circular park path of ${circumference} m, two people start together with speeds ${s1} m/s and ${s2} m/s. In how many seconds will they meet ${meetings > 1 ? `for the ${meetings}nd time` : "again"}?`,
      ], `${seed}:stem`),
      hi: `दो धावक ${circumference} मीटर के वृत्ताकार ट्रैक पर साथ शुरू करते हैं। उनकी गतियाँ ${s1} मी/से और ${s2} मी/से हैं। वे ${meetings > 1 ? `${meetings}वीं बार` : "फिर"} कितने सेकंड बाद मिलेंगे?`,
      pa: `ਦੋ ਦੌੜਾਕ ${circumference} ਮੀਟਰ ਦੇ ਗੋਲ ਟਰੈਕ ਤੇ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਤੀਆਂ ${s1} ਮੀ/ਸੇ ਅਤੇ ${s2} ਮੀ/ਸੇ ਹਨ। ਉਹ ${meetings > 1 ? `${meetings}ਵੀਂ ਵਾਰ` : "ਫਿਰ"} ਕਿੰਨੇ ਸਕਿੰਟਾਂ ਬਾਅਦ ਮਿਲਣਗੇ?`,
    },
    model,
    variables: { circumference, s1, s2, relativeSpeed, meetings },
    answerKind: "time",
    answerUnit: "seconds",
    steps: [
      step("relative", "For same direction on a circular track, use speed difference; for opposite direction, use speed sum.", "गोल ट्रैक पर समान दिशा में गति का अंतर और विपरीत दिशा में योग लें।", "ਗੋਲ ਟਰੈਕ ਤੇ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਗਤੀ ਦਾ ਫਰਕ ਅਤੇ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਜੋੜ ਲਵੋ।", `v_r=${relativeSpeed}`),
      step("lap", "One meeting gap equals one lap divided by relative speed.", "एक मिलने का अंतर = एक चक्कर / आपसी गति।", "ਇੱਕ ਮਿਲਣ ਦਾ ਅੰਤਰ = ਇੱਕ ਚੱਕਰ / ਆਪਸੀ ਗਤੀ।", `T_1=\\frac{C}{v_r}`),
      step("result", "Multiply by the required meeting count.", "आवश्यक मिलने की संख्या से गुणा करें।", "ਲੋੜੀਂਦੀ ਮਿਲਣ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ।", `T=${meetings}\\times \\frac{${circumference}}{${relativeSpeed}}=${answer}`),
    ],
    shortcutMath: `T=n\\times \\frac{C}{v_r}`,
  };
}

function draftEscalator(spec: MotifSpec, seed: string): Draft {
  const personSteps = pick([35, 40, 45, 50, 55, 60, 65, 70], `${seed}:p`);
  const movingSteps = pick([15, 20, 25, 30, 35, 40], `${seed}:m`);
  const model: TsdSolverModel = spec.id === "dog_chasing_hare_leaps"
    ? { kind: "dog_chase", inputs: { headStart: pick([40, 50, 60, 75, 90, 120], `${seed}:dh`), relativeSpeed: pick([8, 10, 12, 15, 20], `${seed}:dr`) } }
    : { kind: "escalator_steps", inputs: { personSteps, movingSteps } };
  const answer = Number(evaluateTsdSolverModel(model));
  if (spec.id === "dog_chasing_hare_leaps") {
    return {
      stem: {
        en: `A dog is ${model.inputs.headStart} m behind a hare and gains ${model.inputs.relativeSpeed} m every minute. In how many minutes will the dog catch the hare?`,
        hi: `एक कुत्ता खरगोश से ${model.inputs.headStart} मीटर पीछे है और हर मिनट ${model.inputs.relativeSpeed} मीटर की दूरी घटा देता है। कुत्ता कितने मिनट में खरगोश को पकड़ लेगा?`,
        pa: `ਇੱਕ ਕੁੱਤਾ ਖਰਗੋਸ਼ ਤੋਂ ${model.inputs.headStart} ਮੀਟਰ ਪਿੱਛੇ ਹੈ ਅਤੇ ਹਰ ਮਿੰਟ ${model.inputs.relativeSpeed} ਮੀਟਰ ਦੀ ਦੂਰੀ ਘਟਾ ਦਿੰਦਾ ਹੈ। ਕੁੱਤਾ ਕਿੰਨੇ ਮਿੰਟਾਂ ਵਿੱਚ ਖਰਗੋਸ਼ ਨੂੰ ਪਕੜ ਲਵੇਗਾ?`,
      },
      model,
      variables: { headStart: model.inputs.headStart, relativeSpeed: model.inputs.relativeSpeed },
      answerKind: "time",
      answerUnit: "minutes",
      steps: [
        step("lead", "The dog must cover the initial gap.", "कुत्ते को शुरुआती दूरी पूरी करनी है।", "ਕੁੱਤੇ ਨੂੰ ਪਹਿਲਾਂ ਬਣੀ ਦੂਰੀ ਪੂਰੀ ਕਰਨੀ ਹੈ।", `D_h=${model.inputs.headStart}`),
        step("relative", "Use the gain per minute as relative speed.", "हर मिनट घटती दूरी को आपसी गति मानें।", "ਹਰ ਮਿੰਟ ਘਟਦੀ ਦੂਰੀ ਨੂੰ ਆਪਸੀ ਗਤੀ ਮੰਨੋ।", `v_r=${model.inputs.relativeSpeed}`),
        step("result", "Catch-up time is gap divided by relative speed.", "पकड़ने का समय = दूरी / आपसी गति।", "ਪਕੜਣ ਦਾ ਸਮਾਂ = ਦੂਰੀ / ਆਪਸੀ ਗਤੀ।", `T=\\frac{${model.inputs.headStart}}{${model.inputs.relativeSpeed}}=${answer}`),
      ],
      shortcutMath: `T=\\frac{D_h}{v_r}`,
    };
  }
  return {
    stem: {
      en: `A man counts ${personSteps} steps while walking up a moving escalator. During the same time, the escalator carries him up by ${movingSteps} steps. How many visible steps are there on the escalator?`,
      hi: `एक व्यक्ति चलती एस्केलेटर पर चढ़ते समय ${personSteps} सीढ़ियाँ गिनता है। उसी समय एस्केलेटर उसे ${movingSteps} सीढ़ियाँ ऊपर ले जाती है। एस्केलेटर पर कुल कितनी दिखाई देने वाली सीढ़ियाँ हैं?`,
      pa: `ਇੱਕ ਵਿਅਕਤੀ ਚੱਲਦੇ ਐਸਕੇਲੇਟਰ ਤੇ ਚੜ੍ਹਦੇ ਹੋਏ ${personSteps} ਪੌੜੀਆਂ ਗਿਣਦਾ ਹੈ। ਉਸੇ ਸਮੇਂ ਐਸਕੇਲੇਟਰ ਉਸਨੂੰ ${movingSteps} ਪੌੜੀਆਂ ਉੱਪਰ ਲੈ ਜਾਂਦਾ ਹੈ। ਐਸਕੇਲੇਟਰ ਤੇ ਕੁੱਲ ਕਿੰਨੀਆਂ ਦਿਖਣ ਵਾਲੀਆਂ ਪੌੜੀਆਂ ਹਨ?`,
    },
    model,
    variables: { personSteps, movingSteps },
    answerKind: "steps",
    answerUnit: "steps",
    steps: [
      step("parts", "Visible steps are made up of counted steps plus escalator movement.", "दिखाई देने वाली सीढ़ियाँ = गिनी सीढ़ियाँ + एस्केलेटर से मिली सीढ़ियाँ।", "ਦਿਖਣ ਵਾਲੀਆਂ ਪੌੜੀਆਂ = ਗਿਣੀਆਂ ਪੌੜੀਆਂ + ਐਸਕੇਲੇਟਰ ਨਾਲ ਮਿਲੀਆਂ ਪੌੜੀਆਂ।", `N=N_p+N_e`),
      step("substitution", "Add the steps counted by the person and the steps moved by the escalator.", "दोनों सीढ़ी संख्याएँ रखें।", "ਦੋਵੇਂ ਪੌੜੀ ਗਿਣਤੀਆਂ ਰੱਖੋ।", `N=${personSteps}+${movingSteps}`),
      step("result", "This gives the visible steps.", "इससे दिखाई देने वाली सीढ़ियाँ मिलती हैं।", "ਇਸ ਨਾਲ ਦਿਖਣ ਵਾਲੀਆਂ ਪੌੜੀਆਂ ਮਿਲਦੀਆਂ ਹਨ।", `N=${answer}`),
    ],
    shortcutMath: `N=N_p+N_e`,
  };
}

function eleventhMinutes(totalElevenths: number) {
  const whole = Math.floor(totalElevenths / 11);
  const remainder = totalElevenths % 11;
  return remainder === 0 ? `${whole} minutes` : `\\(${whole}\\frac{${remainder}}{11}\\) minutes`;
}

function draftAdvanced(spec: MotifSpec, seed: string): Draft {
  const family = spec.id;
  if (/clock/u.test(family)) {
    if (family === "tsd_clock_hands_angle") {
      const pair = pick([[3, 30], [4, 20], [5, 10], [7, 20], [8, 40], [9, 10]] as const, `${seed}:clock`);
      const [hour, minute] = pair;
      const model: TsdSolverModel = { kind: "clock_angle", inputs: { hour, minute } };
      const answer = Number(evaluateTsdSolverModel(model));
      return {
        stem: {
          en: `At ${hour}:${String(minute).padStart(2, "0")}, what is the smaller angle between the hour hand and the minute hand of a clock?`,
          hi: `${hour}:${String(minute).padStart(2, "0")} बजे घड़ी की घंटे और मिनट की सुई के बीच छोटा कोण कितना है?`,
          pa: `${hour}:${String(minute).padStart(2, "0")} ਵਜੇ ਘੜੀ ਦੀ ਘੰਟੇ ਅਤੇ ਮਿੰਟ ਵਾਲੀ ਸੂਈ ਵਿਚਕਾਰ ਛੋਟਾ ਕੋਣ ਕਿੰਨਾ ਹੈ?`,
        },
        model,
        variables: { hour, minute },
        answerKind: "angle",
        answerUnit: "degrees",
        steps: [
          step("idea", "Use the standard clock-angle relation.", "घड़ी के कोण का मानक संबंध लगाएँ।", "ਘੜੀ ਦੇ ਕੋਣ ਦਾ ਮਿਆਰੀ ਸੰਬੰਧ ਲਗਾਓ।", `\\theta=\\left|30h-\\frac{11m}{2}\\right|`),
          step("value", "Take the smaller of the two possible angles.", "दो कोणों में से छोटा कोण लें।", "ਦੋ ਕੋਣਾਂ ਵਿੱਚੋਂ ਛੋਟਾ ਕੋਣ ਲਵੋ।", `\\theta=\\left|30\\times ${hour}-\\frac{11\\times ${minute}}{2}\\right|=${answer}`),
        ],
        shortcutMath: `\\theta=\\min\\left(x,360-x\\right)`,
      };
    }
    const hour = pick([2, 3, 4, 5, 7, 8], `${seed}:h`);
    const target = family.includes("opposite") ? 180 : family.includes("right") ? 90 : 0;
    const totalElevenths = family.includes("gain_loss") ? pick([22, 44, 66], `${seed}:gain`) : target === 0 ? 60 * hour : Math.abs(60 * hour - 2 * target);
    const answer = eleventhMinutes(totalElevenths);
    const label = family.includes("between") ? "between 2 o'clock and 3 o'clock" : `after ${hour} o'clock`;
    const ask = family.includes("opposite") ? "opposite" : family.includes("right") ? "at right angles" : family.includes("gain_loss") ? "gain the given angular gap" : "coincide";
    return {
      stem: {
        en: `At what time ${label} will the hands of a clock ${ask}?`,
        hi: `${label} घड़ी की दोनों सुइयाँ ${ask} कब होंगी?`,
        pa: `${label} ਘੜੀ ਦੀਆਂ ਦੋਵੇਂ ਸੂਈਆਂ ${ask} ਕਦੋਂ ਹੋਣਗੀਆਂ?`,
      },
      model: { kind: "clock_minutes", inputs: { answer } },
      variables: { hour, target, totalElevenths },
      answerKind: "time",
      answerUnit: "minutes",
      steps: [
        step("relative", "The minute hand gains on the hour hand at 5.5 degrees per minute.", "मिनट की सुई घंटे की सुई पर हर मिनट 5.5 डिग्री बढ़त बनाती है।", "ਮਿੰਟ ਵਾਲੀ ਸੂਈ ਘੰਟੇ ਵਾਲੀ ਸੂਈ ਤੇ ਹਰ ਮਿੰਟ 5.5 ਡਿਗਰੀ ਦੀ ਬੜ੍ਹਤ ਬਣਾਉਂਦੀ ਹੈ।", `v_r=6-0.5=5.5`),
        step("time", "Divide the required angular gap by the relative angular speed.", "आवश्यक कोणीय अंतर को आपसी कोणीय गति से भाग दें।", "ਲੋੜੀਂਦੇ ਕੋਣੀ ਫਰਕ ਨੂੰ ਆਪਸੀ ਕੋਣੀ ਗਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।", `T=\\frac{${totalElevenths / 2}}{5.5}`),
      ],
      shortcutMath: `T=\\frac{\\theta}{5.5}`,
    };
  }
  if (/sound/u.test(family)) {
    const speed = pick([320, 330, 340, 350], `${seed}:sound`);
    const time = pick([2, 3, 4, 5, 6, 8, 10], `${seed}:time`);
    const echo = /echo|reflection/u.test(family);
    const divisor = echo ? 2 : 1;
    const model: TsdSolverModel = { kind: "sound_distance", inputs: { speed, time, divisor } };
    const answer = Number(evaluateTsdSolverModel(model));
    const echoStem = pick([
      `A person hears an echo ${time} seconds after shouting. If sound travels at ${speed} m/s, how far is the reflecting wall?`,
      `A student shouts near a cliff and hears the echo after ${time} seconds. Taking the speed of sound as ${speed} m/s, what is the distance of the cliff?`,
      `A sound made near a large wall returns as an echo in ${time} seconds. If sound travels at ${speed} m/s, how far away is the wall?`,
      `Near a hill, a shout is heard again after ${time} seconds. At ${speed} m/s for sound, what is the distance of the hill?`,
    ], `${seed}:soundStem`);
    const delayStem = pick([
      `Thunder is heard ${time} seconds after lightning is seen. If sound travels at ${speed} m/s, how far away is the lightning?`,
      `A firework is seen first and its sound reaches after ${time} seconds. If sound travels at ${speed} m/s, how far away did it burst?`,
      `A blast is seen from a distance and heard ${time} seconds later. Taking sound speed as ${speed} m/s, what is the distance of the blast?`,
      `Lightning flashes and the thunder reaches an observer after ${time} seconds. If sound speed is ${speed} m/s, how far is the cloud?`,
    ], `${seed}:delayStem`);
    return {
      stem: {
        en: echo ? echoStem : delayStem,
        hi: echo ? `एक व्यक्ति चिल्लाने के ${time} सेकंड बाद प्रतिध्वनि सुनता है। ध्वनि की गति ${speed} मी/से है। परावर्तक दीवार कितनी दूर है?` : `बिजली चमकने के ${time} सेकंड बाद गर्जन सुनाई देता है। ध्वनि की गति ${speed} मी/से है। बिजली कितनी दूर है?`,
        pa: echo ? `ਇੱਕ ਵਿਅਕਤੀ ਬੋਲਣ ਤੋਂ ${time} ਸਕਿੰਟ ਬਾਅਦ ਗੂੰਜ ਸੁਣਦਾ ਹੈ। ਧੁਨੀ ਦੀ ਗਤੀ ${speed} ਮੀ/ਸੇ ਹੈ। ਪਰਾਵਰਤਕ ਕੰਧ ਕਿੰਨੀ ਦੂਰ ਹੈ?` : `ਬਿਜਲੀ ਚਮਕਣ ਤੋਂ ${time} ਸਕਿੰਟ ਬਾਅਦ ਗਰਜ ਸੁਣਾਈ ਦਿੰਦੀ ਹੈ। ਧੁਨੀ ਦੀ ਗਤੀ ${speed} ਮੀ/ਸੇ ਹੈ। ਬਿਜਲੀ ਕਿੰਨੀ ਦੂਰ ਹੈ?`,
      },
      model,
      variables: { speed, time, divisor },
      answerKind: "distance",
      answerUnit: "m",
      steps: [
        step("path", echo ? "In an echo, sound travels to the wall and returns." : "Sound covers distance during the delay time.", echo ? "प्रतिध्वनि में ध्वनि दीवार तक जाकर लौटती है।" : "देरी के समय में ध्वनि दूरी तय करती है।", echo ? "ਗੂੰਜ ਵਿੱਚ ਧੁਨੀ ਕੰਧ ਤੱਕ ਜਾ ਕੇ ਵਾਪਸ ਆਉਂਦੀ ਹੈ।" : "ਦੇਰੀ ਦੇ ਸਮੇਂ ਵਿੱਚ ਧੁਨੀ ਦੂਰੀ ਤੈਅ ਕਰਦੀ ਹੈ।", echo ? `D=\\frac{vt}{2}` : `D=vt`),
        step("value", "Use the sound speed and time delay.", "ध्वनि की गति और समय-अंतर का प्रयोग करें।", "ਧੁਨੀ ਦੀ ਗਤੀ ਅਤੇ ਸਮਾਂ-ਅੰਤਰ ਵਰਤੋ।", echo ? `D=\\frac{${speed}\\times ${time}}{2}=${answer}` : `D=${speed}\\times ${time}=${answer}`),
      ],
      shortcutMath: echo ? `D=\\frac{vt}{2}` : `D=vt`,
    };
  }
  if (/variable_speed|acceleration/u.test(family)) {
    if (/acceleration/u.test(family)) {
      const u = pick([0, 4, 6, 8], `${seed}:u`);
      const a = pick([2, 3, 4], `${seed}:a`);
      const t = pick([4, 5, 6], `${seed}:t`);
      const v = u + a * t;
      const mode = family.includes("average") ? "average" : family.includes("distance") ? "distance" : "final";
      const model: TsdSolverModel = { kind: "acceleration_value", inputs: { u, a, t, v, mode } };
      const answer = Number(evaluateTsdSolverModel(model));
      return {
        stem: {
          en: mode === "distance" ? `A vehicle starts at ${u} m/s and accelerates uniformly at ${a} m/s² for ${t} seconds. What distance in metres does it cover?` : `A vehicle changes speed uniformly from ${u} m/s to ${v} m/s. What is its average speed during this interval?`,
          hi: `एक वाहन ${u} मी/से से चलकर ${a} मी/से² के समान त्वरण से ${t} सेकंड चलता है। पूछा गया मान कितना है?`,
          pa: `ਇੱਕ ਵਾਹਨ ${u} ਮੀ/ਸੇ ਤੋਂ ${a} ਮੀ/ਸੇ² ਦੇ ਇਕਸਾਰ ਤਿਵਰਣ ਨਾਲ ${t} ਸਕਿੰਟ ਚਲਦਾ ਹੈ। ਪੁੱਛਿਆ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`,
        },
        model,
        variables: { u, a, t, v, mode },
        answerKind: mode === "distance" ? "distance" : "speed",
        answerUnit: mode === "distance" ? "m" : "mps",
        steps: [
          step("idea", mode === "distance" ? "Use the uniform-acceleration distance relation." : "For uniform acceleration, average speed is the mean of initial and final speeds.", "समान त्वरण का संबंध लगाएँ।", "ਇਕਸਾਰ ਤਿਵਰਣ ਦਾ ਸੰਬੰਧ ਲਗਾਓ।", mode === "distance" ? `s=ut+\\frac{1}{2}at^2` : `S_a=\\frac{u+v}{2}`),
          step("value", "Use the clean given values in that relation.", "दिए साफ मानों को संबंध में रखें।", "ਦਿੱਤੇ ਸਾਫ਼ ਮੁੱਲ ਸੰਬੰਧ ਵਿੱਚ ਰੱਖੋ।", mode === "distance" ? `s=${u}\\times ${t}+\\frac{1}{2}\\times ${a}\\times ${t}^2=${answer}` : `S_a=\\frac{${u}+${v}}{2}=${answer}`),
        ],
        shortcutMath: mode === "distance" ? `s=ut+\\frac{1}{2}at^2` : `S_a=\\frac{u+v}{2}`,
      };
    }
    const speeds = pick([[20, 30, 40], [24, 36, 48], [30, 45, 60], [36, 48, 60], [18, 36, 54], [40, 50, 60], [45, 60, 75], [30, 60, 90]] as const, `${seed}:speeds`);
    const time = pick([1, 2, 3], `${seed}:time`);
    const model: TsdSolverModel = { kind: "sequence_distance", inputs: { speeds: [...speeds], time } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: {
        en: pick([
          `A bus travels for ${time} hour each at speeds ${speeds.join(", ")} km/h in successive parts of a journey. What total distance does it cover?`,
          `A delivery van covers three successive time blocks of ${time} hour each at ${speeds.join(", ")} km/h. How many kilometres does it travel in all?`,
          `During three equal time intervals of ${time} hour, a car runs at ${speeds.join(", ")} km/h. What is the total distance covered?`,
          `A cyclist rides for ${time} hour at each of the speeds ${speeds.join(", ")} km/h. How far does he ride altogether?`,
        ], `${seed}:sequenceStem`),
        hi: `एक बस यात्रा के लगातार भागों में ${speeds.join(", ")} किमी/घं की गति से ${time} घंटे-घंटे चलती है। कुल दूरी कितनी है?`,
        pa: `ਇੱਕ ਬੱਸ ਯਾਤਰਾ ਦੇ ਲਗਾਤਾਰ ਹਿੱਸਿਆਂ ਵਿੱਚ ${speeds.join(", ")} ਕਿਮੀ/ਘੰਟਾ ਦੀ ਗਤੀ ਨਾਲ ${time} ਘੰਟਾ-ਘੰਟਾ ਚਲਦੀ ਹੈ। ਕੁੱਲ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`,
      },
      model,
      variables: { speeds: [...speeds], time },
      answerKind: "distance",
      answerUnit: "km",
      steps: [
        step("parts", "Add the distances covered in the successive parts.", "लगातार भागों में तय दूरियाँ जोड़ें।", "ਲਗਾਤਾਰ ਹਿੱਸਿਆਂ ਵਿੱਚ ਤੈਅ ਦੂਰੀਆਂ ਜੋੜੋ।", `D=t(v_1+v_2+v_3)`),
        step("value", "Use the speed sequence with the common time.", "गति-क्रम और समान समय का प्रयोग करें।", "ਗਤੀ-ਕ੍ਰਮ ਅਤੇ ਇੱਕੋ ਸਮਾਂ ਵਰਤੋ।", `D=${time}(${speeds.join("+")})=${answer}`),
      ],
      shortcutMath: `D=t\\sum v_i`,
    };
  }
  if (/polygon|square|rectangle/u.test(family)) {
    const perimeter = family.includes("rectangle") ? pick([360, 400, 500, 600], `${seed}:rectP`) : pick([240, 300, 360, 420, 480, 600, 720], `${seed}:p`);
    const v1 = pick([8, 10, 12, 15, 18, 20], `${seed}:v1`);
    const v2 = pick([3, 4, 5, 6, 8, 10], `${seed}:v2`);
    if (/different|multi_side/u.test(family)) {
      const rectangle = pick([
        { sides: [80, 120, 80, 120], speeds: [10, 12, 10, 12] },
        { sides: [60, 100, 60, 100], speeds: [6, 10, 6, 10] },
        { sides: [90, 150, 90, 150], speeds: [9, 15, 9, 15] },
        { sides: [120, 180, 120, 180], speeds: [12, 18, 12, 18] },
      ] as const, `${seed}:rect`);
      const sides = [...rectangle.sides];
      const speeds = [...rectangle.speeds];
      const [sideA, sideB] = sides;
      const [speedA, speedB] = speeds;
      const model: TsdSolverModel = { kind: "side_time_sum", inputs: { sides, speeds } };
      const answer = Number(evaluateTsdSolverModel(model));
      return {
        stem: { en: `A cyclist goes around a rectangular park with sides 80 m and 120 m, using speeds 10 m/s and 12 m/s on alternate sides. How many seconds are needed for one round?`, hi: `एक साइकिल चालक आयताकार पार्क का एक चक्कर अलग-अलग भुजाओं पर 10 मी/से और 12 मी/से से लगाता है। कितने सेकंड लगेंगे?`, pa: `ਇੱਕ ਸਾਈਕਲ ਸਵਾਰ ਆਯਾਤਾਕਾਰ ਪਾਰਕ ਦਾ ਇੱਕ ਚੱਕਰ ਵੱਖ-ਵੱਖ ਪਾਸਿਆਂ ਤੇ 10 ਮੀ/ਸੇ ਅਤੇ 12 ਮੀ/ਸੇ ਨਾਲ ਲਗਾਉਂਦਾ ਹੈ। ਕਿੰਨੇ ਸਕਿੰਟ ਲੱਗਣਗੇ?` },
        model, variables: { sides, speeds }, answerKind: "time", answerUnit: "seconds",
        steps: [step("sum", "For different side speeds, add the time for each side.", "हर भुजा का समय जोड़ें।", "ਹਰ ਪਾਸੇ ਦਾ ਸਮਾਂ ਜੋੜੋ।", `T=\\sum \\frac{s_i}{v_i}`), step("value", "Use the four side lengths and speeds.", "चारों भुजाओं और गतियों का प्रयोग करें।", "ਚਾਰਾਂ ਪਾਸਿਆਂ ਅਤੇ ਗਤੀਆਂ ਵਰਤੋ।", `T=\\frac{80}{10}+\\frac{120}{12}+\\frac{80}{10}+\\frac{120}{12}=${answer}`)],
        shortcutMath: `T=\\sum \\frac{s_i}{v_i}`,
      };
    }
    const relativeSpeed = family.includes("opposite") ? v1 + v2 : Math.abs(v1 - v2);
    const model: TsdSolverModel = { kind: "perimeter_time", inputs: { perimeter, relativeSpeed } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: { en: `Two runners move on a closed path of perimeter ${perimeter} m at ${v1} m/s and ${v2} m/s. After how many seconds will one complete relative lap?`, hi: `दो धावक ${perimeter} मीटर परिमाप वाले बंद पथ पर ${v1} मी/से और ${v2} मी/से से चलते हैं। आपसी एक चक्कर कितने सेकंड में पूरा होगा?`, pa: `ਦੋ ਦੌੜਾਕ ${perimeter} ਮੀਟਰ ਘੇਰੇ ਵਾਲੇ ਬੰਦ ਰਾਹ ਤੇ ${v1} ਮੀ/ਸੇ ਅਤੇ ${v2} ਮੀ/ਸੇ ਨਾਲ ਚਲਦੇ ਹਨ। ਆਪਸੀ ਇੱਕ ਚੱਕਰ ਕਿੰਨੇ ਸਕਿੰਟ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?` },
      model, variables: { perimeter, v1, v2, relativeSpeed }, answerKind: "time", answerUnit: "seconds",
      steps: [step("relative", "On a closed path, use perimeter divided by relative speed.", "बंद पथ पर परिमाप को आपसी गति से भाग दें।", "ਬੰਦ ਰਾਹ ਤੇ ਘੇਰੇ ਨੂੰ ਆਪਸੀ ਗਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।", `T=\\frac{P}{v_r}`), step("value", "Use the path perimeter and relative speed.", "परिमाप और आपसी गति का प्रयोग करें।", "ਘੇਰਾ ਅਤੇ ਆਪਸੀ ਗਤੀ ਵਰਤੋ।", `T=\\frac{${perimeter}}{${relativeSpeed}}=${answer}`)],
      shortcutMath: `T=\\frac{P}{v_r}`,
    };
  }
  if (/swimmer|boat_angle/u.test(family)) {
    const triple = pick([[5, 3, 4], [13, 5, 12], [17, 8, 15], [25, 7, 24]] as const, `${seed}:triple`);
    const [swimmer, current, across] = triple;
    const width = pick([100, 120, 150, 180, 200, 240, 300, 360, 480], `${seed}:width`);
    const mode = /shortest|angle/.test(family) ? "shortest" : /drift|downstream/.test(family) ? "drift" : "time";
    const model: TsdSolverModel = { kind: "swimmer_value", inputs: { mode, swimmer, current, width, drift: current * width / swimmer } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: { en: mode === "drift" ? pick([
        `A swimmer crosses a ${width} m wide river at ${swimmer} m/s while the current is ${current} m/s. If he aims straight across, how far downstream will he drift?`,
        `A man swims straight across a ${width} m wide river at ${swimmer} m/s, while the current flows at ${current} m/s. What downstream drift will he have?`,
        `A swimmer heads directly across a ${width} m wide river. His swimming speed is ${swimmer} m/s and the current speed is ${current} m/s. How far downstream will he land?`,
        `While crossing a ${width} m wide canal, a swimmer aims straight across at ${swimmer} m/s. The current is ${current} m/s. What is his drift?`,
      ], `${seed}:swimDriftStem`) : pick([
        `A swimmer can swim at ${swimmer} m/s in still water and the river current is ${current} m/s. For a river ${width} m wide, how many seconds are needed to land directly opposite?`,
        `A river is ${width} m wide. A swimmer's still-water speed is ${swimmer} m/s and the current is ${current} m/s. To reach the point directly opposite, how many seconds will he take?`,
        `A swimmer wants to cross a ${width} m wide river and land exactly opposite. If his speed in still water is ${swimmer} m/s and current speed is ${current} m/s, how much time is required?`,
        `For a ${width} m wide river, a swimmer has speed ${swimmer} m/s in still water and the stream speed is ${current} m/s. How many seconds will the shortest crossing take?`,
      ], `${seed}:swimTimeStem`), hi: `एक तैराक ${width} मीटर चौड़ी नदी पार करता है। शांत जल में गति ${swimmer} मी/से और धारा ${current} मी/से है। पूछा गया मान कितना है?`, pa: `ਇੱਕ ਤੈਰਾਕ ${width} ਮੀਟਰ ਚੌੜੀ ਨਦੀ ਪਾਰ ਕਰਦਾ ਹੈ। ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਗਤੀ ${swimmer} ਮੀ/ਸੇ ਅਤੇ ਧਾਰਾ ${current} ਮੀ/ਸੇ ਹੈ। ਪੁੱਛਿਆ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?` },
      model, variables: { mode, swimmer, current, width }, answerKind: mode === "drift" ? "distance" : "time", answerUnit: mode === "drift" ? "m" : "seconds",
      steps: [step("component", mode === "drift" ? "Aiming straight across, crossing time is width divided by swimmer speed." : "To land opposite, the across component is found from the clean triangle.", "नदी पार करने का घटक साफ त्रिभुज से लें।", "ਨਦੀ ਪਾਰ ਕਰਨ ਵਾਲਾ ਘਟਕ ਸਾਫ਼ ਤਿਕੋਣ ਤੋਂ ਲਵੋ।", mode === "drift" ? `T=\\frac{W}{v_s}` : `v_a=\\sqrt{v_s^2-v_r^2}`), step("value", "Use the river width and relevant component.", "नदी की चौड़ाई और सही घटक का प्रयोग करें।", "ਨਦੀ ਦੀ ਚੌੜਾਈ ਅਤੇ ਸਹੀ ਘਟਕ ਵਰਤੋ।", mode === "drift" ? `d=${current}\\times \\frac{${width}}{${swimmer}}=${answer}` : `T=\\frac{${width}}{${across}}=${answer}`)],
      shortcutMath: mode === "drift" ? `d=v_r\\frac{W}{v_s}` : `T=\\frac{W}{\\sqrt{v_s^2-v_r^2}}`,
    };
  }
  if (/wind|airplane/u.test(family)) {
    const windPair = pick([[80, 20], [90, 30], [100, 20], [120, 20], [150, 30], [180, 30]] as const, `${seed}:windPair`);
    const [plane, wind] = windPair;
    const baseDistance = lcm(plane + wind, plane - wind);
    const distance = baseDistance * pick([1, 2], `${seed}:dist`);
    const mode = family.includes("tailwind") ? "plane" : family.includes("round") ? "round" : family.includes("drift") ? "drift" : "wind";
    const model: TsdSolverModel = { kind: "wind_value", inputs: { mode, with: plane + wind, against: plane - wind, plane, wind, distance, driftSpeed: wind, time: 4 } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: { en: mode === "round" ? pick([
        `An airplane flies ${distance} km with the wind and returns against it. Its still-air speed is ${plane} km/h and wind speed is ${wind} km/h. What is the total time?`,
        `A plane covers ${distance} km with a tailwind and comes back through the same distance against the wind. If its still-air speed is ${plane} km/h and wind speed is ${wind} km/h, how many hours are needed?`,
        `A flight goes ${distance} km along the wind and returns the same route against it. With plane speed ${plane} km/h and wind speed ${wind} km/h, what is the round-trip time?`,
      ], `${seed}:windRoundStem`) : pick([
        `An airplane has effective speeds ${plane + wind} km/h with the wind and ${plane - wind} km/h against the wind. What is the ${mode === "plane" ? "speed of the airplane in still air" : "wind speed"}?`,
        `A plane travels at ${plane + wind} km/h with a tailwind and ${plane - wind} km/h against it. What is the ${mode === "plane" ? "still-air speed of the plane" : "speed of the wind"}?`,
        `With the wind a flight's speed is ${plane + wind} km/h, and against the wind it is ${plane - wind} km/h. Find the ${mode === "plane" ? "plane speed in still air" : "wind speed"}?`,
      ], `${seed}:windStem`), hi: `हवा के साथ और विपरीत उड़ान की साफ गतियों से पूछा गया मान निकालें।`, pa: `ਹਵਾ ਦੇ ਨਾਲ ਅਤੇ ਉਲਟ ਸਾਫ਼ ਗਤੀਆਂ ਤੋਂ ਪੁੱਛਿਆ ਮੁੱਲ ਕੱਢੋ।` },
      model, variables: { mode, plane, wind, distance }, answerKind: mode === "round" ? "time" : "speed", answerUnit: mode === "round" ? "hours" : "kmph",
      steps: [step("idea", "Tailwind increases effective speed and headwind decreases it.", "अनुकूल हवा गति बढ़ाती है और प्रतिकूल हवा घटाती है।", "ਨਾਲ ਵਾਲੀ ਹਵਾ ਗਤੀ ਵਧਾਉਂਦੀ ਹੈ ਅਤੇ ਉਲਟੀ ਹਵਾ ਘਟਾਉਂਦੀ ਹੈ।", `v_w=\\frac{v_+-v_-}{2}`), step("value", "Use the with-wind and against-wind speeds.", "हवा के साथ और विपरीत गतियाँ प्रयोग करें।", "ਹਵਾ ਦੇ ਨਾਲ ਅਤੇ ਉਲਟ ਗਤੀਆਂ ਵਰਤੋ।", mode === "round" ? `T=\\frac{${distance}}{${plane + wind}}+\\frac{${distance}}{${plane - wind}}=${answer}` : mode === "plane" ? `v_p=\\frac{${plane + wind}+${plane - wind}}{2}=${answer}` : `v_w=\\frac{${plane + wind}-${plane - wind}}{2}=${answer}`)],
      shortcutMath: mode === "round" ? `T=\\frac{D}{v_p+v_w}+\\frac{D}{v_p-v_w}` : `v_p=\\frac{v_++v_-}{2}`,
    };
  }
  if (/interception|pursuit|crossroad|patrol/u.test(family)) {
    const gap = pick([120, 150, 180, 200, 240, 300, 360, 480], `${seed}:gap`);
    const closingSpeed = pick([10, 15, 20, 24, 30, 40, 60], `${seed}:close`);
    const model: TsdSolverModel = { kind: "interception_time", inputs: { gap, closingSpeed } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: { en: pick([
        `A patrol vehicle is ${gap} m behind a target and closes the gap at ${closingSpeed} m/s. In how many seconds will it intercept the target?`,
        `A security jeep has to close a ${gap} m gap to catch a moving vehicle. If the closing speed is ${closingSpeed} m/s, after how many seconds will it catch it?`,
        `A pursuer is ${gap} m behind and gains ${closingSpeed} m every second. In how many seconds will the pursuer reach the target?`,
        `A guard starts ${gap} m behind a runner and reduces the gap at ${closingSpeed} m/s. How many seconds will he take to catch the runner?`,
      ], `${seed}:interceptStem`), hi: `एक गश्ती वाहन लक्ष्य से ${gap} मीटर पीछे है और ${closingSpeed} मी/से की दर से दूरी घटा रहा है। कितने सेकंड में पकड़ेगा?`, pa: `ਇੱਕ ਪੈਟਰੋਲ ਵਾਹਨ ਨਿਸ਼ਾਨੇ ਤੋਂ ${gap} ਮੀਟਰ ਪਿੱਛੇ ਹੈ ਅਤੇ ${closingSpeed} ਮੀ/ਸੇ ਨਾਲ ਦੂਰੀ ਘਟਾ ਰਿਹਾ ਹੈ। ਕਿੰਨੇ ਸਕਿੰਟ ਵਿੱਚ ਪਕੜੇਗਾ?` },
      model, variables: { gap, closingSpeed }, answerKind: "time", answerUnit: "seconds",
      steps: [step("close", "Interception time is initial gap divided by closing speed.", "पकड़ने का समय शुरुआती दूरी को घटती गति से भाग देने पर मिलता है।", "ਪਕੜਣ ਦਾ ਸਮਾਂ ਪਹਿਲਾਂ ਬਣੀ ਦੂਰੀ ਨੂੰ ਘਟਦੀ ਗਤੀ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਮਿਲਦਾ ਹੈ।", `T=\\frac{D_g}{v_c}`), step("value", "Use the gap and closing speed.", "दूरी और घटती गति का प्रयोग करें।", "ਦੂਰੀ ਅਤੇ ਘਟਦੀ ਗਤੀ ਵਰਤੋ।", `T=\\frac{${gap}}{${closingSpeed}}=${answer}`)],
      shortcutMath: `T=\\frac{D_g}{v_c}`,
    };
  }
  if (/wheel/u.test(family)) {
    const radius = pick([7, 14, 21, 28, 35, 42, 49], `${seed}:r`);
    const revolutions = pick([10, 15, 20, 25, 30, 40, 50, 60], `${seed}:rev`);
    const mode = family.includes("linear") ? "speed" : family.includes("ratio") ? "ratio" : "distance";
    const model: TsdSolverModel = { kind: "wheel_value", inputs: { mode, radius, radius1: radius, radius2: radius * 2, revolutions, rps: 5 } };
    const answer = evaluateTsdSolverModel(model);
    return {
      stem: { en: mode === "ratio" ? pick([
        `Two wheels have radii ${radius} cm and ${radius * 2} cm. If they cover the same distance, what is the ratio of their revolutions?`,
        `A small wheel has radius ${radius} cm and a larger wheel has radius ${radius * 2} cm. For equal distance covered, what will be the ratio of their revolutions?`,
        `Two wheels roll the same distance. Their radii are ${radius} cm and ${radius * 2} cm. What is the ratio of revolutions made by them?`,
      ], `${seed}:wheelRatioStem`) : pick([
        `A wheel of radius ${radius} cm makes ${revolutions} revolutions. How many centimetres does it cover?`,
        `A cycle wheel has radius ${radius} cm. If it turns ${revolutions} times, what distance is covered in centimetres?`,
        `A wheel rolls through ${revolutions} complete revolutions. Its radius is ${radius} cm. How many centimetres does it move?`,
        `A cart wheel of radius ${radius} cm completes ${revolutions} revolutions. What distance does the cart move?`,
      ], `${seed}:wheelStem`), hi: `पहिए की परिधि से दूरी या चक्कर का अनुपात निकालें।`, pa: `ਪਹੀਏ ਦੇ ਘੇਰੇ ਨਾਲ ਦੂਰੀ ਜਾਂ ਚੱਕਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।` },
      model, variables: { mode, radius, revolutions }, answerKind: mode === "ratio" ? "ratio" : "distance", answerUnit: mode === "ratio" ? "ratio" : "cm",
      steps: [step("circumference", "One revolution covers one circumference.", "एक चक्कर में एक परिधि चलती है।", "ਇੱਕ ਚੱਕਰ ਵਿੱਚ ਇੱਕ ਘੇਰਾ ਤੈਅ ਹੁੰਦਾ ਹੈ।", `C=2\\pi r`), step("value", "Use pi as 22 over 7 and multiply by revolutions.", "pi को 22/7 लेकर चक्करों से गुणा करें।", "pi ਨੂੰ 22/7 ਲੈ ਕੇ ਚੱਕਰਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।", mode === "ratio" ? `N_1:N_2=r_2:r_1=${answer}` : `D=${revolutions}\\times 2\\times \\frac{22}{7}\\times ${radius}=${answer}`)],
      shortcutMath: mode === "ratio" ? `N_1:N_2=r_2:r_1` : `D=N\\times 2\\pi r`,
    };
  }
  if (/walkway|escalator/u.test(family)) {
    const length = pick([120, 150, 180, 200, 240, 300], `${seed}:len`);
    const walkwayPair = pick([[3, 1], [4, 1], [4, 2], [5, 2], [6, 2], [6, 3]] as const, `${seed}:walkPair`);
    const [person, belt] = walkwayPair;
    const mode = family.includes("reverse") || family.includes("direction") ? "against" : family.includes("two_people") ? "belt" : "totalSteps";
    const model: TsdSolverModel = { kind: "walkway_value", inputs: { mode, length, person, belt, counted: 60, beltSteps: 30, with: person + belt, against: person - belt } };
    const answer = Number(evaluateTsdSolverModel(model));
    return {
      stem: { en: mode === "totalSteps" ? pick([
        `A person counts 60 steps on an escalator while the escalator adds 30 steps during the climb. How many visible steps are there?`,
        `While walking up an escalator, a person takes 60 steps and the moving escalator contributes 30 more steps. How many steps are visible on the escalator?`,
        `A man counts 60 steps on a moving escalator. During that time, the escalator itself moves 30 steps. What is the total number of visible steps?`,
      ], `${seed}:stepsStem`) : mode === "belt" ? pick([
        `A person moves at ${person + belt} m/s with a moving walkway and ${person - belt} m/s against it. What is the speed of the walkway?`,
        `With a moving walkway, a traveller's effective speed is ${person + belt} m/s; against it, it is ${person - belt} m/s. What is the walkway speed?`,
        `A moving walkway changes a person's speed to ${person + belt} m/s in one direction and ${person - belt} m/s in the opposite direction. Find the walkway speed?`,
      ], `${seed}:beltStem`) : pick([
        `A moving walkway is ${length} m long. A person walks at ${person} m/s and the walkway moves at ${belt} m/s. How many seconds are needed against the walkway?`,
        `A traveller walks against a ${length} m moving walkway. His walking speed is ${person} m/s and the walkway speed is ${belt} m/s. How much time will he take?`,
        `On a moving walkway of length ${length} m, a person walks opposite to the belt at ${person} m/s while the belt moves at ${belt} m/s. In how many seconds will he cross it?`,
      ], `${seed}:walkStem`), hi: `चलती पटरी या एस्केलेटर में व्यक्ति और पटरी की गति मिलाकर मान निकालें।`, pa: `ਚੱਲਦੇ ਰਾਹ ਜਾਂ ਐਸਕੇਲੇਟਰ ਵਿੱਚ ਵਿਅਕਤੀ ਅਤੇ ਪੱਟੀ ਦੀ ਗਤੀ ਮਿਲਾ ਕੇ ਮੁੱਲ ਕੱਢੋ।` },
      model, variables: { mode, length, person, belt }, answerKind: mode === "totalSteps" ? "steps" : mode === "belt" ? "speed" : "time", answerUnit: mode === "totalSteps" ? "steps" : mode === "belt" ? "mps" : "seconds",
      steps: [step("rate", "With the belt add speeds; against the belt subtract speeds.", "पटरी के साथ गति जोड़ें और विपरीत घटाएँ।", "ਪੱਟੀ ਦੇ ਨਾਲ ਗਤੀਆਂ ਜੋੜੋ ਅਤੇ ਉਲਟ ਘਟਾਓ।", `v_a=v_p-v_b`), step("value", "Use the moving-surface relation.", "चलती सतह का संबंध लगाएँ।", "ਚੱਲਦੀ ਸਤਹ ਦਾ ਸੰਬੰਧ ਲਗਾਓ।", mode === "totalSteps" ? `N=60+30=${answer}` : mode === "belt" ? `v_b=\\frac{${person + belt}-${person - belt}}{2}=${answer}` : `T=\\frac{${length}}{${person}-${belt}}=${answer}`)],
      shortcutMath: mode === "totalSteps" ? `N=n+e` : `T=\\frac{L}{v_p-v_b}`,
    };
  }
  const speedPair = pick([[30, 60], [36, 54], [40, 60], [45, 90], [48, 72], [60, 90]] as const, `${seed}:avgPair`);
  const [u, v] = speedPair;
  const model: TsdSolverModel = { kind: "average_speed", inputs: { distances: [120, 120], speeds: [u, v] } };
  const answer = Number(evaluateTsdSolverModel(model));
  return {
    stem: { en: pick([
      `A journey has equal-distance parts covered at ${u} km/h and ${v} km/h. Without knowing the actual distance, what is the average speed?`,
      `A car covers two equal stretches at ${u} km/h and ${v} km/h. What is its average speed for the whole trip?`,
      `For the same distance each way, a bus runs at ${u} km/h in one part and ${v} km/h in the other. What is the average speed?`,
      `A traveller covers equal distances at speeds ${u} km/h and ${v} km/h. What average speed does this give?`,
    ], `${seed}:avgStem`), hi: `एक यात्रा के समान दूरी वाले भाग ${u} किमी/घं और ${v} किमी/घं से तय होते हैं। वास्तविक दूरी जाने बिना औसत गति कितनी है?`, pa: `ਇੱਕ ਯਾਤਰਾ ਦੇ ਇੱਕੋ ਦੂਰੀ ਵਾਲੇ ਹਿੱਸੇ ${u} ਕਿਮੀ/ਘੰਟਾ ਅਤੇ ${v} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਤੈਅ ਹੁੰਦੇ ਹਨ। ਅਸਲ ਦੂਰੀ ਜਾਣੇ ਬਿਨਾ ਔਸਤ ਗਤੀ ਕਿੰਨੀ ਹੈ?` },
    model, variables: { u, v }, answerKind: "speed", answerUnit: "kmph",
    steps: [step("equal", "For equal distances, use the harmonic average of the two speeds.", "समान दूरी के लिए दो गतियों का हार्मोनिक औसत लें।", "ਇੱਕੋ ਦੂਰੀ ਲਈ ਦੋ ਗਤੀਆਂ ਦਾ ਹਾਰਮੋਨਿਕ ਔਸਤ ਲਵੋ।", `S_a=\\frac{2uv}{u+v}`), step("value", "Use the two speeds directly.", "दोनों गतियों का प्रयोग करें।", "ਦੋਵੇਂ ਗਤੀਆਂ ਵਰਤੋ।", `S_a=\\frac{2\\times ${u}\\times ${v}}{${u}+${v}}=${answer}`)],
    shortcutMath: `S_a=\\frac{2uv}{u+v}`,
  };
}

function draftFor(spec: MotifSpec, seed: string): Draft {
  if (spec.group === "advanced") return draftAdvanced(spec, seed);
  if (spec.group === "train") return draftTrain(spec, seed);
  if (spec.group === "boat") return draftBoat(spec, seed);
  if (spec.group === "race") return draftRace(spec, seed);
  if (spec.group === "circular") return draftCircular(spec, seed);
  if (spec.group === "escalator") return draftEscalator(spec, seed);
  if (spec.group === "relative") return draftRelative(spec, seed);
  return draftCore(spec, seed);
}

export function createTimeSpeedDistanceProblem(input: {
  seed: string;
  runId: string;
  difficulty: "easy" | "medium" | "hard";
  family?: TimeSpeedDistanceFamilyId;
}): CanonicalTimeSpeedDistanceProblem {
  const family = input.family ??
    pick(
      TIME_SPEED_DISTANCE_FAMILY_IDS.filter((candidate) => TIME_SPEED_DISTANCE_MOTIF_SPECS[candidate].difficulty === input.difficulty),
      `${input.seed}:family`,
    );
  const spec = TIME_SPEED_DISTANCE_MOTIF_SPECS[family];
  const draft = draftFor(spec, input.seed);
  let stems = {
    en: ensureQuestionStem(draft.stem.en),
    hi: ensureQuestionStem(draft.stem.hi),
    pa: ensureQuestionStem(draft.stem.pa),
  };
  if (
    (family === "tsd_polygon_different_speed_sides" || family === "tsd_polygon_multi_side_speed_pattern") &&
    Array.isArray((draft.variables as any).sides) &&
    Array.isArray((draft.variables as any).speeds)
  ) {
    const sides = (draft.variables as any).sides as number[];
    const speeds = (draft.variables as any).speeds as number[];
    const [sideA, sideB] = sides;
    const [speedA, speedB] = speeds;
    stems = {
      ...stems,
      en: ensureQuestionStem(family === "tsd_polygon_different_speed_sides"
        ? `A cyclist goes around a rectangular park with sides ${sideA} m and ${sideB} m, using speeds ${speedA} m/s and ${speedB} m/s on alternate sides. How many seconds are needed for one round?`
        : `A runner covers a rectangular track of sides ${sideA} m and ${sideB} m at ${speedA} m/s on one pair of sides and ${speedB} m/s on the other pair. How many seconds will one lap take?`),
    };
  } else if (
    family === "tsd_square_track_overtake" ||
    family === "tsd_rectangle_track_opposite_meeting" ||
    family === "tsd_polygon_perimeter_lap" ||
    family === "tsd_geometric_polygon_perimeter_lap"
  ) {
    const perimeter = Number((draft.variables as any).perimeter ?? 0);
    const v1 = Number((draft.variables as any).v1 ?? 0);
    const v2 = Number((draft.variables as any).v2 ?? 0);
    stems = {
      ...stems,
      en: ensureQuestionStem(
        family === "tsd_square_track_overtake"
          ? `Two runners move in the same direction on a square track of perimeter ${perimeter} m at ${v1} m/s and ${v2} m/s. After how many seconds will the faster runner overtake the other?`
          : family === "tsd_rectangle_track_opposite_meeting"
            ? `Two athletes start together on a rectangular track of perimeter ${perimeter} m and run in opposite directions at ${v1} m/s and ${v2} m/s. After how many seconds will they meet again?`
            : family === "tsd_geometric_polygon_perimeter_lap"
              ? `A cyclist and a runner move around a polygonal track of perimeter ${perimeter} m at ${v1} m/s and ${v2} m/s. In how many seconds will one relative lap be completed?`
              : `On a closed polygonal path of perimeter ${perimeter} m, two runners move at ${v1} m/s and ${v2} m/s. After how many seconds will one relative lap be completed?`,
      ),
    };
  }
  const answer = evaluateTsdSolverModel(draft.model);
  const answerString = answerText(answer, draft.answerUnit, "en");
  const options = makeOptions(answer, draft.answerUnit, `${input.seed}:options`);
  if (!options.includes(answerString)) options[0] = answerString;
  const correct = options.indexOf(answerString);
  const optionsHi = options.map((option) => option.replace(/km\/h/gu, "किमी/घं").replace(/m\/s/gu, "मी/से").replace(/hours/gu, "घंटे").replace(/minutes/gu, "मिनट").replace(/seconds/gu, "सेकंड").replace(/steps/gu, "सीढ़ियाँ").replace(/km\b/gu, "किमी").replace(/m\b/gu, "मीटर"));
  const optionsPa = options.map((option) => option.replace(/km\/h/gu, "ਕਿਮੀ/ਘੰਟਾ").replace(/m\/s/gu, "ਮੀ/ਸੇ").replace(/hours/gu, "ਘੰਟੇ").replace(/minutes/gu, "ਮਿੰਟ").replace(/seconds/gu, "ਸਕਿੰਟ").replace(/steps/gu, "ਪੌੜੀਆਂ").replace(/km\b/gu, "ਕਿਮੀ").replace(/m\b/gu, "ਮੀਟਰ"));
  const explanation = {
    en: buildExplanation(draft.steps, answerString, draft.shortcutMath, "en"),
    hi: buildExplanation(draft.steps, answerText(answer, draft.answerUnit, "hi"), draft.shortcutMath, "hi"),
    pa: buildExplanation(draft.steps, answerText(answer, draft.answerUnit, "pa"), draft.shortcutMath, "pa"),
  };
  const realismScore = realismFor(spec, input.seed);
  const numeric = numericSignature(draft.variables);
  return {
    id: `tsd:${family}:${hashText(input.seed)}`,
    topic: "time-speed-distance",
    motifId: family,
    family,
    topologyId: family,
    subtype: family,
    category: "time_speed_distance",
    principle: spec.principle,
    formulaModel: spec.formula,
    shortcut: spec.shortcut,
    commonTraps: spec.traps,
    variables: draft.variables,
    stemData: draft.variables,
    solverModel: draft.model,
    answer,
    answerText: answerString,
    answerKind: draft.answerKind,
    answerUnit: draft.answerUnit,
    options,
    correct,
    difficulty: spec.difficulty,
    complexity: spec.complexity,
    topology: {
      family: "time_speed_distance",
      variant: family,
    },
    traps: spec.traps,
    distractors: options.filter((_, index) => index !== correct),
    explanationSteps: draft.steps,
    localizationData: {
      stem: stems,
      explanation,
      options: { en: options, hi: optionsHi, pa: optionsPa },
    },
    auditMeta: {
      seed: input.seed,
      runId: input.runId,
      motifId: family,
      topologyId: family,
      stemSkeleton: stemSkeleton(stems.en),
      numericSignature: numeric,
      solverAnswer: answerString,
      explanationFinalAnswer: answerString,
      difficultyReason: `${spec.group} ${spec.difficulty} TSD motif`,
      realismScore,
      trapTypes: spec.traps,
    },
  };
}

export const TIME_SPEED_DISTANCE_MOTIF_FACTORIES: Record<TimeSpeedDistanceFamilyId, TimeSpeedDistanceMotifFactory> =
  Object.fromEntries(
    TIME_SPEED_DISTANCE_FAMILY_IDS.map((family) => [
      family,
      (input: { seed: string; runId: string; difficulty: "easy" | "medium" | "hard"; family: TimeSpeedDistanceFamilyId }) =>
        createTimeSpeedDistanceProblem({ ...input, family }),
    ]),
  ) as Record<TimeSpeedDistanceFamilyId, TimeSpeedDistanceMotifFactory>;

export { evaluateTsdSolverModel };
