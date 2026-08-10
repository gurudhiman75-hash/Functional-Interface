export const FREE_ADULTERANT_CASES = [
  { actor:"milk seller", product:"milk", adulterant:"water", unit:"litres", pure:40, adulterantQty:4, pureCost:40 },
  { actor:"dairyman", product:"milk", adulterant:"water", unit:"litres", pure:32, adulterantQty:4, pureCost:48 },
  { actor:"milk vendor", product:"milk", adulterant:"water", unit:"litres", pure:30, adulterantQty:5, pureCost:60 },
  { actor:"dairy seller", product:"milk", adulterant:"water", unit:"litres", pure:25, adulterantQty:5, pureCost:50 },
  { actor:"shopkeeper", product:"milk", adulterant:"water", unit:"litres", pure:24, adulterantQty:6, pureCost:64 },
  { actor:"milkman", product:"milk", adulterant:"water", unit:"litres", pure:20, adulterantQty:6, pureCost:72 },
  { actor:"dairy vendor", product:"milk", adulterant:"water", unit:"litres", pure:16, adulterantQty:6, pureCost:80 },
  { actor:"milk seller", product:"milk", adulterant:"water", unit:"litres", pure:25, adulterantQty:10, pureCost:56 },
  { actor:"dairyman", product:"milk", adulterant:"water", unit:"litres", pure:20, adulterantQty:10, pureCost:44 },
  { actor:"milk vendor", product:"milk", adulterant:"water", unit:"litres", pure:15, adulterantQty:9, pureCost:36 },
  { actor:"dairy seller", product:"milk", adulterant:"water", unit:"litres", pure:18, adulterantQty:3, pureCost:54 },
  { actor:"shopkeeper", product:"milk", adulterant:"water", unit:"litres", pure:28, adulterantQty:7, pureCost:68 },
] as const;

export const FREE_SELLING_CASES = [
  { actor:"dairyman", product:"milk", adulterant:"water", unit:"litres", pure:10, adulterantQty:1, pureCostN:64, pureCostD:1, sellingN:80, sellingD:1 },
  { actor:"milk seller", product:"milk", adulterant:"water", unit:"litres", pure:4, adulterantQty:1, pureCostN:50, pureCostD:1, sellingN:55, sellingD:1 },
  { actor:"milk vendor", product:"milk", adulterant:"water", unit:"litres", pure:5, adulterantQty:1, pureCostN:60, pureCostD:1, sellingN:60, sellingD:1 },
  { actor:"dairy seller", product:"milk", adulterant:"water", unit:"litres", pure:3, adulterantQty:1, pureCostN:48, pureCostD:1, sellingN:45, sellingD:1 },
  { actor:"shopkeeper", product:"milk", adulterant:"water", unit:"litres", pure:4, adulterantQty:1, pureCostN:40, pureCostD:1, sellingN:40, sellingD:1 },
  { actor:"milkman", product:"milk", adulterant:"water", unit:"litres", pure:5, adulterantQty:1, pureCostN:72, pureCostD:1, sellingN:72, sellingD:1 },
  { actor:"dairy vendor", product:"milk", adulterant:"water", unit:"litres", pure:3, adulterantQty:1, pureCostN:80, pureCostD:1, sellingN:75, sellingD:1 },
  { actor:"milk seller", product:"milk", adulterant:"water", unit:"litres", pure:5, adulterantQty:2, pureCostN:56, pureCostD:1, sellingN:50, sellingD:1 },
  { actor:"dairyman", product:"milk", adulterant:"water", unit:"litres", pure:2, adulterantQty:1, pureCostN:45, pureCostD:1, sellingN:40, sellingD:1 },
  { actor:"milk vendor", product:"milk", adulterant:"water", unit:"litres", pure:7, adulterantQty:1, pureCostN:48, pureCostD:1, sellingN:48, sellingD:1 },
] as const;

export const CHEAPER_IMPURITY_CASES = [
  { actor:"tea dealer", product:"premium tea", adulterant:"lower-grade tea", unit:"kg", pure:3, adulterantQty:1, pureCost:80, adulterantCost:40, selling:84 },
  { actor:"ghee seller", product:"pure ghee", adulterant:"cheaper fat", unit:"kg", pure:2, adulterantQty:1, pureCost:90, adulterantCost:60, selling:100 },
  { actor:"oil dealer", product:"mustard oil", adulterant:"cheaper oil", unit:"litres", pure:2, adulterantQty:2, pureCost:72, adulterantCost:48, selling:72 },
  { actor:"coffee seller", product:"premium coffee", adulterant:"chicory", unit:"kg", pure:1, adulterantQty:2, pureCost:120, adulterantCost:60, selling:100 },
  { actor:"tea merchant", product:"premium tea", adulterant:"ordinary tea", unit:"kg", pure:1, adulterantQty:1, pureCost:96, adulterantCost:48, selling:90 },
  { actor:"spice dealer", product:"premium spice", adulterant:"cheaper spice", unit:"kg", pure:3, adulterantQty:2, pureCost:60, adulterantCost:30, selling:60 },
  { actor:"grain seller", product:"premium grain", adulterant:"lower-grade grain", unit:"kg", pure:1, adulterantQty:2, pureCost:75, adulterantCost:45, selling:66 },
  { actor:"oil seller", product:"pure oil", adulterant:"cheaper oil", unit:"litres", pure:2, adulterantQty:3, pureCost:100, adulterantCost:50, selling:84 },
  { actor:"tea dealer", product:"premium tea", adulterant:"ordinary tea", unit:"kg", pure:3, adulterantQty:1, pureCost:70, adulterantCost:30, selling:72 },
  { actor:"coffee dealer", product:"premium coffee", adulterant:"chicory", unit:"kg", pure:3, adulterantQty:2, pureCost:100, adulterantCost:40, selling:95 },
] as const;
