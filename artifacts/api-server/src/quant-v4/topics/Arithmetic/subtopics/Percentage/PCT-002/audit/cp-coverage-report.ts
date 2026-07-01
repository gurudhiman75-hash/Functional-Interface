import * as fs from "fs";
import * as path from "path";
import { implementedInventory, expectedInventory } from "./cp-inventory";

export function generateCoverageReport() {
  const exactMatches = implementedInventory.filter(c => c.classification === "EXACT");
  const mergedCPs = implementedInventory.filter(c => c.classification === "MERGED");
  const missingCPs = expectedInventory.filter(c => c.classification === "MISSING");
  const unexpectedCPs = implementedInventory.filter(c => c.classification === "UNEXPECTED");
  
  const coveragePercentage = (exactMatches.length + mergedCPs.length) / expectedInventory.length * 100;
  
  const report = `
Coverage Report for PCT-002
===========================
Implemented CP count: ${implementedInventory.length}
Expected CP count: ${expectedInventory.length}

Exact matches: ${exactMatches.length}
Merged CPs: ${mergedCPs.length}
Missing CPs: ${missingCPs.length}
Unexpected CPs: ${unexpectedCPs.length}

Coverage percentage: ${coveragePercentage.toFixed(2)}%
`;

  return report;
}

if (require.main === module) {
  const report = generateCoverageReport();
  fs.writeFileSync(path.join(__dirname, "cp-coverage-report.txt"), report);
  console.log(report);
}
