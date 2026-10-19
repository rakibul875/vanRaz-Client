const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ShopVerificationInput {
  shopName: string;
  description: string;
  address: string;
  phone: string;
  logoUrl?: string;
  bannerUrl?: string;
  ownerName: string;
}

export interface VerificationEnhancedData {
  shopName: string;
  description: string;
  tags: string[];
}

export interface VerificationFeedback {
  reason: string;
  issuesFound: string[];
}

export interface VerificationResult {
  status: "approved" | "rejected" | "needs_review";
  trustScore: number;
  enhancedData: VerificationEnhancedData;
  feedback: VerificationFeedback;
}

export async function verifyShop(
  input: ShopVerificationInput,
): Promise<VerificationResult> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  const res = await fetch(`${API_URL}/shops/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Verification request failed");
  }

  const json = await res.json();
  return json.data;
}
