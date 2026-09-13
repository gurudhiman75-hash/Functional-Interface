export type EcoCp002SystemRow = {
  id: string;
  system: "Capitalist economy" | "Socialist economy" | "Mixed economy";
  coreFeature: string;
  compactMeaning: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp002ActivityRow = {
  id: string;
  activity: string;
  sector: "Primary sector" | "Secondary sector" | "Tertiary sector";
  reason: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp002OwnershipRow = {
  id: string;
  description: string;
  ownership: "Public sector" | "Private sector";
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EcoCp002WorkRow = {
  id: string;
  description: string;
  classification: "Organised sector" | "Unorganised sector";
  reason: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const systemsSource = ["NCERT-ECON-SYSTEMS"] as const;
const sectorsSource = ["NCERT-IED-SECTORS"] as const;

export const ECO_CP002_SYSTEM_ROWS_V1: readonly EcoCp002SystemRow[] = Object.freeze([
  {
    id: "capitalist",
    system: "Capitalist economy",
    coreFeature: "most productive resources are privately owned and economic decisions are largely guided by markets",
    compactMeaning: "private ownership with a major role for markets",
    sourceIds: systemsSource,
    sourceFactIds: ["eco-cp002-capitalist-core"],
  },
  {
    id: "socialist",
    system: "Socialist economy",
    coreFeature: "major productive resources are owned or controlled by the state and production decisions are largely planned",
    compactMeaning: "state ownership or control with planned production",
    sourceIds: systemsSource,
    sourceFactIds: ["eco-cp002-socialist-core"],
  },
  {
    id: "mixed",
    system: "Mixed economy",
    coreFeature: "public and private sectors operate together in the economy",
    compactMeaning: "coexistence of public and private sectors",
    sourceIds: systemsSource,
    sourceFactIds: ["eco-cp002-mixed-core"],
  },
]);

export const ECO_CP002_ACTIVITY_ROWS_V1: readonly EcoCp002ActivityRow[] = Object.freeze([
  {
    id: "crop-farming",
    activity: "growing wheat on a farm",
    sector: "Primary sector",
    reason: "it uses natural resources directly to produce an agricultural product",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-primary-farming"],
  },
  {
    id: "fishing",
    activity: "catching fish",
    sector: "Primary sector",
    reason: "it directly uses a natural resource",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-primary-fishing"],
  },
  {
    id: "mining",
    activity: "extracting coal from a mine",
    sector: "Primary sector",
    reason: "it extracts a natural resource",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-primary-mining"],
  },
  {
    id: "dairy",
    activity: "raising cattle for milk",
    sector: "Primary sector",
    reason: "it is an activity based directly on natural and biological resources",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-primary-dairy"],
  },
  {
    id: "textile-factory",
    activity: "making cloth in a textile factory",
    sector: "Secondary sector",
    reason: "it converts raw materials into a manufactured product",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-secondary-textile"],
  },
  {
    id: "sugar-mill",
    activity: "making sugar from sugarcane",
    sector: "Secondary sector",
    reason: "it processes a raw material into another product",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-secondary-sugar"],
  },
  {
    id: "construction",
    activity: "constructing a house",
    sector: "Secondary sector",
    reason: "construction creates a physical product and is part of the secondary sector",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-secondary-construction"],
  },
  {
    id: "steel",
    activity: "producing steel in a plant",
    sector: "Secondary sector",
    reason: "it is a manufacturing activity",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-secondary-steel"],
  },
  {
    id: "banking",
    activity: "providing banking services",
    sector: "Tertiary sector",
    reason: "banking provides a service rather than extracting or manufacturing a product",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-tertiary-banking"],
  },
  {
    id: "transport",
    activity: "transporting goods by truck",
    sector: "Tertiary sector",
    reason: "transport is a service activity",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-tertiary-transport"],
  },
  {
    id: "hospital",
    activity: "providing hospital treatment",
    sector: "Tertiary sector",
    reason: "health care is a service",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-tertiary-health"],
  },
  {
    id: "retail",
    activity: "selling goods in a retail shop",
    sector: "Tertiary sector",
    reason: "trade is a service that helps goods reach consumers",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-tertiary-retail"],
  },
]);

export const ECO_CP002_OWNERSHIP_ROWS_V1: readonly EcoCp002OwnershipRow[] = Object.freeze([
  {
    id: "government-owned-enterprise",
    description: "an enterprise owned and controlled by the government",
    ownership: "Public sector",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-public-government-owned"],
  },
  {
    id: "municipal-service",
    description: "a transport service owned by a municipal body",
    ownership: "Public sector",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-public-municipal"],
  },
  {
    id: "private-factory",
    description: "a factory owned by private individuals or a private company",
    ownership: "Private sector",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-private-factory"],
  },
  {
    id: "private-hospital",
    description: "a hospital owned by a private company or individuals",
    ownership: "Private sector",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-private-hospital"],
  },
]);

export const ECO_CP002_WORK_ROWS_V1: readonly EcoCp002WorkRow[] = Object.freeze([
  {
    id: "registered-factory-worker",
    description: "a worker in a registered factory with fixed service rules and recorded employment",
    classification: "Organised sector",
    reason: "the workplace follows formal rules and recorded conditions of employment",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-organised-factory"],
  },
  {
    id: "government-office-worker",
    description: "an employee in a government office with formal service conditions",
    classification: "Organised sector",
    reason: "employment is formal and governed by established rules",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-organised-government"],
  },
  {
    id: "casual-construction-worker",
    description: "a casual construction worker hired day to day without formal service benefits",
    classification: "Unorganised sector",
    reason: "the job lacks formal and secure service conditions",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-unorganised-construction"],
  },
  {
    id: "street-vendor",
    description: "a self-employed street vendor working outside a formal employment structure",
    classification: "Unorganised sector",
    reason: "the work is outside a formal employer-employee structure with regulated service conditions",
    sourceIds: sectorsSource,
    sourceFactIds: ["eco-cp002-unorganised-vendor"],
  },
]);
