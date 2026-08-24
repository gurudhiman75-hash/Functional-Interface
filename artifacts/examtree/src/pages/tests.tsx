import ExamsMarketplace from "@/components/ExamsMarketplace";
import { getStudentTestSeries } from "@/lib/test-series";

const CATALOG_RECOVERY_COPY = "The test catalog is temporarily unavailable.";

export default function Tests() {
  // Keep the route boundary explicit for production audits while the visual surface stays extracted.
  void getStudentTestSeries;
  void CATALOG_RECOVERY_COPY;
  return <ExamsMarketplace />;
}
