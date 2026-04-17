import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { TrainingPlan, User, UserProfile } from "@/types";
import { authClient } from "@/lib/utils";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  plan: TrainingPlan | null;
  saveProfile: (
    profile: Omit<UserProfile, "userId" | "updatedAt">
  ) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [neonUser, setNeonUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);

  const isRefreshing = useRef(false);

  // ----------------------------
  // 1. Load session (auth only)
  // ----------------------------
  useEffect(() => {
    async function loadUser() {
      try {
        const result = await authClient.getSession();
        const user = result?.data?.user;

        if (user) {
          setNeonUser({
            ...user,
            createdAt:
              user.createdAt instanceof Date
                ? user.createdAt.toISOString()
                : user.createdAt,
            updatedAt:
              user.updatedAt instanceof Date
                ? user.updatedAt.toISOString()
                : user.updatedAt,
          });
        } else {
          setNeonUser(null);
        }
      } catch {
        setNeonUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  // ----------------------------
  // 2. Refresh user-dependent data
  // ----------------------------
  const refreshData = useCallback(async () => {
    if (!neonUser?.id || isRefreshing.current) return;

    isRefreshing.current = true;

    try {
      const planData = await api
        .getCurrentPlan(neonUser.id)
        .catch(() => null);

      if (planData?.planJson) {
        const data = planData.planJson;

        const weekly =
          data.weeklySchedule ?? data.weeklyschedule ?? [];

        setPlan({
          id: planData.id,
          userId: planData.userId,
          planJson: {
            overview: data.overview,
            weeklyschedule: weekly,
            progression: data.progression,
          },
          version: planData.version,
          createdAt: planData.createdAt ?? planData.created_at,
        } as TrainingPlan);
      }
    } catch (error) {
      console.error("Error while refreshing data:", error);
    } finally {
      isRefreshing.current = false;
    }
  }, [neonUser?.id]);

  // ----------------------------
  // 3. Trigger refresh on login
  // ----------------------------
  useEffect(() => {
    if (authLoading) return;

    if (neonUser?.id) {
      refreshData();
    } else {
      setPlan(null);
    }
  }, [authLoading, neonUser?.id, refreshData]);

  // ----------------------------
  // 4. Save profile
  // ----------------------------
  async function saveProfile(
    profile: Omit<UserProfile, "userId" | "updatedAt">
  ) {
    if (!neonUser) {
      throw new Error("User must be authenticated to save profile");
    }

    await api.saveProfile(neonUser.id, profile);
    await refreshData();
  }

  // ----------------------------
  // 5. Generate plan
  // ----------------------------
  async function generatePlan() {
    if (!neonUser) {
      throw new Error("User must be authenticated to generate plan");
    }

    await api.generatePlan(neonUser.id);
    await refreshData();
  }

  // ----------------------------
  // 6. Context value
  // ----------------------------
  return (
    <AuthContext.Provider
      value={{
        user: neonUser,
        isLoading: authLoading,
        plan,
        saveProfile,
        generatePlan,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ----------------------------
// 7. Hook
// ----------------------------
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within the AuthProvider");
  }

  return context;
}