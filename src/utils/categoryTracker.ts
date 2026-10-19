// utils/categoryTracker.ts

const CATEGORY_TRACKER_KEY = "user_category_history";

export const trackCategoryVisit = (categoryId: string) => {
  if (!categoryId) return;

  try {
    const rawData = localStorage.getItem(CATEGORY_TRACKER_KEY);
    const history: Record<string, number> = rawData ? JSON.parse(rawData) : {};

    // কাউন্ট ১ বাড়িয়ে দেওয়া
    history[categoryId] = (history[categoryId] || 0) + 1;

    localStorage.setItem(CATEGORY_TRACKER_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to track category:", error);
  }
};

export const getMostFrequentCategory = (): string | null => {
  try {
    const rawData = localStorage.getItem(CATEGORY_TRACKER_KEY);
    if (!rawData) return null;

    const history: Record<string, number> = JSON.parse(rawData);

    // সবথেকে বেশি কাউন্ট থাকা ক্যাটাগরি বের করা
    let topCategory: string | null = null;
    let maxCount = 0;

    for (const [catId, count] of Object.entries(history)) {
      if (count > maxCount) {
        maxCount = count;
        topCategory = catId;
      }
    }

    return topCategory;
  } catch (error) {
    return null;
  }
};
