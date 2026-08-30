import CurrentAffairsDashboardSection from "@/components/CurrentAffairsDashboardSection";
import CurrentAffairsPersonalizationPanel from "@/components/CurrentAffairsPersonalizationPanel";
import ActivityPage from "@/pages/activity";

export default function DashboardPage() {
  return (
    <>
      <ActivityPage />
      <div className="mx-auto w-full max-w-7xl pb-8">
        <CurrentAffairsDashboardSection />
        <CurrentAffairsPersonalizationPanel />
      </div>
    </>
  );
}