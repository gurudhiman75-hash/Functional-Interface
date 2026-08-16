import {
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  diagnoseSpatialFclQuartetCapacityV1,
} from "../foundation/spatial";

const diagnostics = Object.fromEntries(
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.map((propertyId) => [
    propertyId,
    diagnoseSpatialFclQuartetCapacityV1(propertyId),
  ]),
);

console.log(JSON.stringify({
  status: "REPORT_SPA_FND_001_FCL_STRICT_CATALOG_CAPACITY",
  diagnostics,
}, null, 2));
