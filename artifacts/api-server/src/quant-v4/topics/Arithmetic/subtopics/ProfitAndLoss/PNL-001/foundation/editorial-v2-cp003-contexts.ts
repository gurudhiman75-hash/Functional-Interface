import type { LegacyEditorialContext } from "./editorial-v2-cp001-contexts";

export const CP003_CONTEXTS: readonly LegacyEditorialContext[] = [
  { family: "grain-lot inventory", item: "grain lots", actor: "grain wholesaler" },
  { family: "fruit-crate equal-price sale", item: "fruit crates", actor: "fruit merchant" },
  { family: "identical-machine equal-cost sale", item: "small machines", actor: "equipment dealer" },
  { family: "seasonal-apparel partial inventory", item: "garment pieces", actor: "garment retailer" },
  { family: "damaged-ceramic stock recovery", item: "ceramic sets", actor: "homeware seller" },
  { family: "promotional free-unit inventory", item: "packaged units", actor: "wholesaler" },
  { family: "book-lot weighted sale", item: "book bundles", actor: "book distributor" },
  { family: "dairy-stock target rate", item: "dairy cartons", actor: "dairy distributor" },
  { family: "spare-parts target quantity", item: "spare-part kits", actor: "parts wholesaler" },
  { family: "unsold-notebook pricing", item: "notebooks", actor: "stationery dealer" },
  { family: "leftover-tile target rate", item: "floor tiles", actor: "building-material seller" },
  { family: "spoiled-produce recovery", item: "produce crates", actor: "produce merchant" },
  { family: "equal-price special result", item: "two household appliances", actor: "appliance seller" },
  { family: "equal-price inverse rate", item: "two electronic items", actor: "electronics dealer" },
  { family: "warehouse total-sale planning", item: "warehouse stock", actor: "warehouse manager" },
  { family: "reverse total-cost recovery", item: "inventory lot", actor: "inventory controller" },
  { family: "fractional stock recovery", item: "clearance stock", actor: "clearance manager" },
  { family: "inventory-table analysis", item: "mixed inventory groups", actor: "inventory analyst" },
  { family: "warehouse caselet", item: "warehouse consignments", actor: "warehouse operator" },
  { family: "equal-price statement analysis", item: "two resale items", actor: "resale trader" },
  { family: "algebraic group-rate analysis", item: "inventory groups", actor: "commercial analyst" },
  { family: "remaining-stock data sufficiency", item: "remaining stock", actor: "stock manager" },
  { family: "multi-lot amount analysis", item: "purchase lots", actor: "bulk trader" },
  { family: "spoiled-stock break-even recovery", item: "spoiled food packs", actor: "food distributor" }
];
