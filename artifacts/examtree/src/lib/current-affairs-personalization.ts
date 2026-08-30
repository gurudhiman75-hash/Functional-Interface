import { apiRequest } from "@/lib/api";

export type CurrentAffairsPersonalizationResponse = {
  preferences: {
    dailyQuestionTarget: number;
    preferredLanguage: "en" | "hi" | "pa";
    preferredExamFamily: "ssc" | "banking" | "punjab" | "railways" | "general";
    revisionSignalEnabled: boolean;
    dailyPackSignalEnabled: boolean;
    studyTargetSignalEnabled: boolean;
  };
  dailyProgress: {
    studied: number;
    target: number;
    remaining: number;
    complete: boolean;
    percent: number;
  };
  savedItems: Array<{
    id: string;
    targetType: "learning_resource" | "quiz_delivery_item";
    targetId: string;
    saveMode: "bookmark" | "revise_later";
    reviewAfter: string | null;
    updatedAt: string;
    publicCode: string;
    title: string;
    summary: string | null;
    languageCode: string;
    contentDate: string | null;
    examFamily: string;
    periodType: string;
    itemNumber: number | null;
    questionFamily: string | null;
    deepLink: string;
  }>;
  savedReviewDue: number;
  recommendations: Array<{
    key: string;
    type: "revision" | "saved_review" | "weak_category" | "daily_quiz";
    priority: number;
    title: string;
    body: string;
    deepLink: string;
  }>;
  signals: Array<{
    key: string;
    type: "revision_due" | "recovery_due" | "daily_target" | "daily_pack" | "saved_review";
    urgency: "high" | "normal";
    title: string;
    body: string;
    deepLink: string;
    count: number;
  }>;
  generatedAt: string;
};

export function getCurrentAffairsPersonalization() {
  return apiRequest<CurrentAffairsPersonalizationResponse>("/current-affairs/personalization");
}

export function updateCurrentAffairsPersonalizationPreferences(input: Partial<CurrentAffairsPersonalizationResponse["preferences"]>) {
  return apiRequest<{ preferences: CurrentAffairsPersonalizationResponse["preferences"]; updatedAt: string }>(
    "/current-affairs/personalization/preferences",
    { method: "PATCH", body: JSON.stringify(input) },
  );
}

export function saveCurrentAffairsItem(input: {
  targetType: "learning_resource" | "quiz_delivery_item";
  targetId: string;
  saveMode: "bookmark" | "revise_later";
  reviewAfter?: string | null;
}) {
  return apiRequest<{ id: string; targetType: string; targetId: string; saveMode: string; reviewAfter: string | null }>(
    "/current-affairs/saved-items",
    { method: "PUT", body: JSON.stringify(input) },
  );
}

export function deleteCurrentAffairsSavedItem(id: string) {
  return apiRequest<{ id: string; deleted: true }>(`/current-affairs/saved-items/${encodeURIComponent(id)}`, { method: "DELETE" });
}
