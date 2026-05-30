import type { DifficultyLabel } from "../../lib/core/generator-engine";

export type TimeSpeedDistanceFamilyId =
  | "tsd_average_speed_equal_distance"
  | "tsd_average_speed_unequal_distance"
  | "tsd_average_speed_equal_time"
  | "tsd_fractional_speed_offset"
  | "tsd_speed_ratio_time_ratio"
  | "tsd_distance_ratio_speed_time"
  | "tsd_variable_distance_ratio"
  | "tsd_early_late_delta"
  | "tsd_stoppage_time_penalty"
  | "tsd_relative_speed_opposite_direction"
  | "tsd_relative_speed_same_direction"
  | "tsd_two_person_meet"
  | "tsd_two_person_catch_up"
  | "tsd_delayed_start_catch_up"
  | "tsd_head_start_catch_up"
  | "tsd_two_point_staggered_start"
  | "tsd_meeting_point_distance_split"
  | "tsd_return_journey_average_speed"
  | "tsd_round_trip_speed"
  | "tsd_partial_journey_speed_change"
  | "tsd_speed_increase_decrease_time_saved"
  | "tsd_speed_change_distance_fixed"
  | "tsd_speed_change_arrival_early_late"
  | "tsd_rest_time_included"
  | "tsd_stoppage_average_speed"
  | "tsd_scheduled_arrival_speed_required"
  | "tsd_hidden_distance_from_time_gap"
  | "tsd_hidden_speed_from_arrival_difference"
  | "train_cross_platform"
  | "train_cross_bridge"
  | "train_cross_person_same_direction"
  | "train_cross_person_opposite_direction"
  | "train_two_trains_cross_opposite"
  | "train_two_trains_cross_same_direction"
  | "train_length_from_crossing_time"
  | "train_speed_from_crossing_time"
  | "train_platform_length_unknown"
  | "train_bridge_length_unknown"
  | "train_relative_speed_with_lengths"
  | "train_overtake_another_train"
  | "train_meet_between_stations"
  | "train_time_gap_between_crossings"
  | "train_dual_platform_length"
  | "train_post_meeting_cross"
  | "boat_downstream_upstream_basic"
  | "boat_still_water_speed"
  | "boat_stream_speed"
  | "boat_up_down_time_given_distance"
  | "boat_distance_from_up_down_times"
  | "boat_equal_distance_up_down"
  | "boat_round_trip_stream"
  | "boat_speed_ratio_upstream_downstream"
  | "boat_current_effect_time_difference"
  | "boat_time_ratio"
  | "boat_constant_distance_isolation"
  | "race_basic_lead_distance"
  | "race_basic_lead_time"
  | "race_a_beats_b_by_distance"
  | "race_a_beats_b_by_time"
  | "race_time_deficit_mapping"
  | "race_dead_heat_calibration"
  | "race_two_stage_comparison"
  | "race_start_delay"
  | "circular_track_first_meeting_same_direction"
  | "circular_track_first_meeting_opposite_direction"
  | "circular_track_repeated_meetings"
  | "circular_track_lap_difference"
  | "circular_track_speed_ratio_meeting_point"
  | "circular_track_two_runners_start_gap"
  | "circular_track_three_runners_lcm_meeting"
  | "escalator_steps_basic"
  | "escalator_up_down_steps"
  | "escalator_stationary_steps"
  | "escalator_speed_from_steps"
  | "escalator_step_count_scaling"
  | "moving_walkway_relative_speed"
  | "dog_chasing_hare_leaps"
  | "tsd_clock_hands_angle"
  | "tsd_clock_hands_coincidence"
  | "tsd_clock_hands_opposite"
  | "tsd_clock_hands_right_angle"
  | "tsd_clock_hands_between_two_times"
  | "tsd_clock_hands_gain_loss_minutes"
  | "tsd_sound_delay_basic"
  | "tsd_sound_echo_distance"
  | "tsd_sound_train_whistle_observer"
  | "tsd_sound_two_observers"
  | "tsd_sound_reflection_between_walls"
  | "tsd_variable_speed_arithmetic_sequence"
  | "tsd_variable_speed_segment_sum"
  | "tsd_variable_speed_each_hour_change"
  | "tsd_variable_speed_distance_remaining"
  | "tsd_acceleration_uniform_basic"
  | "tsd_acceleration_average_speed"
  | "tsd_acceleration_distance_from_rest"
  | "tsd_polygon_perimeter_lap"
  | "tsd_polygon_different_speed_sides"
  | "tsd_square_track_overtake"
  | "tsd_rectangle_track_opposite_meeting"
  | "tsd_polygon_multi_side_speed_pattern"
  | "tsd_geometric_polygon_perimeter_lap"
  | "tsd_swimmer_river_cross_basic"
  | "tsd_swimmer_downstream_drift_basic"
  | "tsd_swimmer_minimum_time_crossing"
  | "tsd_swimmer_shortest_path_crossing"
  | "tsd_swimmer_resultant_drift_distance"
  | "tsd_boat_angle_crossing_basic"
  | "tsd_wind_drift_basic"
  | "tsd_airplane_tailwind_headwind"
  | "tsd_airplane_round_trip_wind"
  | "tsd_relative_motion_wind_drift"
  | "tsd_missile_interception_closing_vector"
  | "tsd_pursuit_intersection_point"
  | "tsd_two_vehicle_intercept_at_crossroad"
  | "tsd_guard_patrol_interception"
  | "tsd_rotating_wheel_linear_speed"
  | "tsd_wheel_revolutions_distance"
  | "tsd_two_wheels_revolution_ratio"
  | "tsd_moving_walkway_reverse_direction"
  | "tsd_escalator_find_total_steps_advanced"
  | "tsd_escalator_two_people_step_rate"
  | "tsd_escalator_direction_reversal"
  | "tsd_average_speed_harmonic_proof"
  | "tsd_average_speed_without_distance"
  | "tsd_speed_ratio_from_time_difference";

export type TimeSpeedDistanceAnswerKind =
  | "speed"
  | "time"
  | "distance"
  | "length"
  | "ratio"
  | "steps"
  | "angle"
  | "number";

export type TimeSpeedDistanceAnswerUnit =
  | "kmph"
  | "mps"
  | "km"
  | "m"
  | "hours"
  | "minutes"
  | "seconds"
  | "ratio"
  | "steps"
  | "degrees"
  | "revolutions"
  | "cm"
  | "none";

export type TsdLocalizedText = {
  en: string;
  hi: string;
  pa: string;
};

export type TsdExplanationStep = {
  key: string;
  text: TsdLocalizedText;
  math?: string;
  value?: number | string;
};

export type TsdSolverKind =
  | "average_speed"
  | "fractional_speed_offset"
  | "ratio_result"
  | "early_late_distance"
  | "stoppage_minutes"
  | "relative_time"
  | "catch_up_time"
  | "meeting_distance"
  | "journey_average"
  | "speed_change"
  | "scheduled_speed"
  | "train_crossing"
  | "train_unknown_length"
  | "train_post_meeting"
  | "boat_speed"
  | "boat_distance"
  | "race_speed"
  | "race_time"
  | "circular_time"
  | "escalator_steps"
  | "dog_chase"
  | "clock_angle"
  | "clock_minutes"
  | "sound_distance"
  | "sequence_distance"
  | "acceleration_value"
  | "perimeter_time"
  | "side_time_sum"
  | "swimmer_value"
  | "wind_value"
  | "interception_time"
  | "wheel_value"
  | "walkway_value";

export type TsdSolverModel = {
  kind: TsdSolverKind;
  inputs: Record<string, unknown>;
};

export type TsdAuditMeta = {
  seed: string;
  runId: string;
  motifId: TimeSpeedDistanceFamilyId;
  topologyId: TimeSpeedDistanceFamilyId;
  stemSkeleton: string;
  numericSignature: string;
  solverAnswer: string;
  explanationFinalAnswer: string;
  difficultyReason: string;
  realismScore: number;
  trapTypes: string[];
};

export type CanonicalTimeSpeedDistanceProblem = {
  id: string;
  topic: "time-speed-distance";
  motifId: TimeSpeedDistanceFamilyId;
  family: TimeSpeedDistanceFamilyId;
  topologyId: TimeSpeedDistanceFamilyId;
  subtype: TimeSpeedDistanceFamilyId;
  category: "time_speed_distance";
  principle: TsdLocalizedText;
  formulaModel: string;
  shortcut: TsdLocalizedText;
  commonTraps: string[];
  variables: Record<string, unknown>;
  stemData: Record<string, unknown>;
  solverModel: TsdSolverModel;
  answer: number | string;
  answerText: string;
  answerKind: TimeSpeedDistanceAnswerKind;
  answerUnit: TimeSpeedDistanceAnswerUnit;
  options: string[];
  correct: number;
  difficulty: Lowercase<DifficultyLabel>;
  complexity: "easy" | "medium" | "hard" | "advanced";
  topology: {
    family: "time_speed_distance";
    variant: TimeSpeedDistanceFamilyId;
  };
  traps: string[];
  distractors: string[];
  explanationSteps: TsdExplanationStep[];
  localizationData: {
    stem: TsdLocalizedText;
    explanation: TsdLocalizedText;
    options: {
      en: string[];
      hi: string[];
      pa: string[];
    };
  };
  auditMeta: TsdAuditMeta;
};

export type TimeSpeedDistanceMotifFactory = (input: {
  seed: string;
  runId: string;
  difficulty: Lowercase<DifficultyLabel>;
  family: TimeSpeedDistanceFamilyId;
}) => CanonicalTimeSpeedDistanceProblem;
