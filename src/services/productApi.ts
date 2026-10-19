// services/productApi.ts (Axios or Fetch Example)
import { getMostFrequentCategory } from "@/utils/categoryTracker";

export const fetchProducts = async (searchQuery: string, page = 1) => {
  // ১. সবথেকে বেশি ভিজিট করা ক্যাটাগরি আইডি নেওয়া
  const frequentCategory = getMostFrequentCategory();

  // ২. ইউআরএল প্যারামস তৈরি করা
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
    useAI: "true",
  });

  if (searchQuery) params.append("search", searchQuery);

  // 🎯 ৩. frequentCategory থাকলে ব্যাকএন্ডে পাঠানো
  if (frequentCategory) {
    params.append("userFrequentCategory", frequentCategory);
  }

  const response = await fetch(`/api/v1/products?${params.toString()}`);
  return response.json();
};
