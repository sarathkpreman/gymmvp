import type { UserProfile } from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL || "https://gymmvp.onrender.com";

async function post(path: string, body: object) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Request failed");
  }

  return res.json();
}

async function get(path: string) {
  const res = await fetch(`${BASE_URL}/api${path}`);

  if (!res.ok) {
    let errorMessage = "Request failed";

    try {
      const data = await res.json();
      errorMessage = data?.error || data?.message || errorMessage;
    } catch {
      // response is not JSON, keep default message
    }

    throw new Error(errorMessage);
  }

  return res.json();
}

export const api = {
  saveProfile(
    userId: string,
    profile: Omit<UserProfile, "userId" | "updatedAt">
  ) {
    return post("/profile", { userId, ...profile });
  },

  generatePlan: (userId: string) => {
    return post("/plan/generate", { userId });
  },

  getCurrentPlan: (userId: string) => {
    return get(`/plan/current_plan?userId=${userId}`);
  }
};