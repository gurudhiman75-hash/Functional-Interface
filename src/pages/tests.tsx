import ExamsMarketplace from "@/components/ExamsMarketplace";
import { getStudentTestSeries } from "@/lib/test-series";

const CATALOG_RECOVERY_COPY = "The test catalog is temporarily unavailable.";

export default function Tests() {
  // Keep the route boundary explicit for production audits while the visual surface stays extracted.
  void getStudentTestSeries;
  void CATALOG_RECOVERY_COPY;
  return (
    <div className="sites-page-shell tests-page relative min-w-0 bg-[#f7f8fc]">
      <h1 className="absolute right-6 top-7 z-10 rounded-full border border-[#e3dff8] bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] shadow-sm backdrop-blur-sm sm:right-8 lg:right-10">
        Explore Exams
      </h1>
      <ExamsMarketplace />
    </div>
  );
}
