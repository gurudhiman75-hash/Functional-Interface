import { useLocation } from "wouter";
import { usePageMeta } from "@/components/PublicPage";

type MetaConfig = {
  title: string;
  description: string;
  robots?: string;
};

function resolveMeta(location: string): MetaConfig | null {
  if (location === "/") {
    return {
      title: "Mock Tests & Exam Preparation",
      description: "Browse ExamTree mock tests, exam practice, saved attempts, and supported multilingual question content from one student workspace.",
    };
  }
  if (location === "/tests" || location === "/exams") {
    return {
      title: "Online Mock Tests",
      description: "Browse published ExamTree mock tests and test series by exam, section, and topic, then review committed attempts in your student workspace.",
    };
  }
  if (location.startsWith("/category/")) {
    return {
      title: "Exam Mock Tests",
      description: "Browse ExamTree mock tests grouped by exam category, including available full-length, sectional, and topic-wise practice.",
    };
  }
  if (location.startsWith("/subcategory/")) {
    return {
      title: "Exam Preparation Tests",
      description: "Explore ExamTree mock tests and practice for this exam, including available full-length, sectional, and topic-wise tests.",
    };
  }
  if (location.startsWith("/published-tests/")) {
    return {
      title: "Opening Mock Test",
      description: "Opening the secure ExamTree test interface.",
      robots: "noindex,follow",
    };
  }
  if (
    location === "/login" ||
    location.startsWith("/login/") ||
    location === "/account-recovery" ||
    location === "/account-deletion" ||
    location === "/packages" ||
    location.startsWith("/packages/") ||
    location === "/my-packages"
  ) {
    return {
      title: "ExamTree Account",
      description: "ExamTree account and student utility page.",
      robots: "noindex,follow",
    };
  }
  return null;
}

function ApplyPublicMeta({ config }: { config: MetaConfig }) {
  usePageMeta(config.title, config.description, { robots: config.robots });
  return null;
}

export function PublicSeoFallback() {
  const [location] = useLocation();
  const config = resolveMeta(location);
  return config ? <ApplyPublicMeta config={config} /> : null;
}
