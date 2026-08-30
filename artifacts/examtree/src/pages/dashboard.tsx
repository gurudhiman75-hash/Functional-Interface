import CurrentAffairsDashboardSection from "@/components/CurrentAffairsDashboardSection";
import ActivityPage from "@/pages/activity";

export default function DashboardPage() {
  return (
    <>
      <ActivityPage />
      <div className="mx-auto w-full max-w-7xl pb-8">
        <CurrentAffairsDashboardSection />
      </div>
    </>
  );
}
