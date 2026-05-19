export const CLEAN_BASES = [
  100,
  120,
  200,
  240,
  360,
  480,
  600,
] as const;

export const CLEAN_PERCENTAGES = [
  5,
  10,
  12.5,
  20,
  25,
  33.3333,
  40,
  50,
] as const;

export const CLEAN_INTEGER_PERCENTAGES = [
  5,
  10,
  20,
  25,
  40,
  50,
] as const;

export const CLEAN_ELECTION_WINNER_PERCENTAGES = [
  55,
  60,
  62.5,
  65,
] as const;

export const CLEAN_MARK_PERCENTAGES = [
  30,
  35,
  40,
  45,
  50,
  60,
] as const;

export const CLEAN_MONEY_BASES = [
  4000,
  5000,
  6000,
  8000,
  10000,
  12000,
  15000,
] as const;

export const CLEAN_POPULATIONS = [
  10000,
  12000,
  20000,
  24000,
  36000,
  48000,
] as const;

export const CLEAN_MARGINS = [
  600,
  800,
  1000,
  1200,
  1500,
  1800,
  2400,
] as const;

export const CLEAN_MIXTURE_SETUPS = [
  { total: 100, initialPercent: 20, targetPercent: 40 },
  { total: 120, initialPercent: 25, targetPercent: 50 },
  { total: 150, initialPercent: 20, targetPercent: 50 },
  { total: 200, initialPercent: 25, targetPercent: 40 },
  { total: 240, initialPercent: 25, targetPercent: 50 },
  { total: 300, initialPercent: 20, targetPercent: 40 },
] as const;
