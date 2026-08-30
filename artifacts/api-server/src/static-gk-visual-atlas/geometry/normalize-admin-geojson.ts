import type {
  GeoJsonAreaGeometry,
  GeoJsonFeatureCollection,
  IndiaAdminFeatureCollection,
  IndiaAdminProperties,
} from "./geojson";

const INDIA_ADMIN_CODES: Record<string, string> = {
  "Andaman and Nicobar Islands": "AN",
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chandigarh: "CH",
  Chhattisgarh: "CG",
  "Dadra and Nagar Haveli and Daman and Diu": "DH",
  Delhi: "DL",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  "Jammu and Kashmir": "JK",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  Ladakh: "LA",
  Lakshadweep: "LD",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OD",
  Puducherry: "PY",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TG",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UK",
  "West Bengal": "WB",
};

const NORMALIZED_NAME_LOOKUP = new Map(
  Object.keys(INDIA_ADMIN_CODES).map((name) => [name.toLocaleLowerCase("en-IN"), name] as const),
);

const LEGACY_ALIASES: Record<string, string> = {
  orissa: "Odisha",
  uttaranchal: "Uttarakhand",
  "nct of delhi": "Delhi",
  "national capital territory of delhi": "Delhi",
  "andaman & nicobar islands": "Andaman and Nicobar Islands",
  "dadra & nagar haveli and daman & diu": "Dadra and Nagar Haveli and Daman and Diu",
  "dadra and nagar haveli & daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
};

export interface AdminNormalizationFields {
  stateNameField: string;
  districtNameField?: string;
  districtCodeField?: string;
}

function readString(properties: Record<string, unknown>, key: string | undefined): string | undefined {
  if (!key) return undefined;
  const value = properties[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

export function canonicalizeIndiaAdminName(rawName: string): { name: string; code: string } {
  const trimmed = rawName.trim().replace(/\s+/g, " ");
  const lookupKey = trimmed.toLocaleLowerCase("en-IN");
  const canonicalName = LEGACY_ALIASES[lookupKey] ?? NORMALIZED_NAME_LOOKUP.get(lookupKey);
  if (!canonicalName) throw new Error(`Unknown India state/UT name in official geometry: ${rawName}`);
  return { name: canonicalName, code: INDIA_ADMIN_CODES[canonicalName] };
}

export function normalizeIndiaAdminGeoJson(
  raw: GeoJsonFeatureCollection<GeoJsonAreaGeometry>,
  fields: AdminNormalizationFields,
): IndiaAdminFeatureCollection {
  if (raw.type !== "FeatureCollection") throw new Error("Expected a GeoJSON FeatureCollection");

  return {
    type: "FeatureCollection",
    features: raw.features.map((feature, index) => {
      const rawStateName = readString(feature.properties, fields.stateNameField);
      if (!rawStateName) throw new Error(`Feature ${index} is missing state field ${fields.stateNameField}`);
      const state = canonicalizeIndiaAdminName(rawStateName);
      const districtName = readString(feature.properties, fields.districtNameField);
      const districtCode = readString(feature.properties, fields.districtCodeField);
      const properties: IndiaAdminProperties = {
        ...feature.properties,
        stateName: state.name,
        stateCode: state.code,
        ...(districtName ? { districtName } : {}),
        ...(districtCode ? { districtCode } : {}),
      };
      return {
        type: "Feature",
        id: feature.id,
        properties,
        geometry: feature.geometry,
      };
    }),
  };
}

export const EXPECTED_INDIA_ADMIN_UNIT_COUNT = Object.keys(INDIA_ADMIN_CODES).length;
