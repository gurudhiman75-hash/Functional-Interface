export type Avg001Cp004PilotLanguage = "hi" | "pa";
export type Avg001Cp004UnitKind =
  | "none" | "marks" | "currency" | "kg" | "years"
  | "units" | "runs" | "kmh" | "unitsPerHour";

export type Avg001Cp004PairLexicon = {
  first: string;
  second: string;
  firstMeasure: string;
  secondMeasure: string;
  result: string;
  secondCount: string;
  unit: Avg001Cp004UnitKind;
};

export type Avg001Cp004MultiLexicon = {
  groups: string;
  members: string;
  measure: string;
  result: string;
};

export type Avg001Cp004SpeedLexicon = {
  subject: string;
  result: string;
};
