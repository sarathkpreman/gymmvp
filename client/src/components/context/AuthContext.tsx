import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { TrainingPlan, User, UserProfile } from "@/types";
import { authClient } from "@/lib/utils";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null
  isLoading: boolean
  plan: TrainingPlan | null
  saveProfile: (profile: Omit<UserProfile, 'userId' | 'updatedAt'>) => Promise<void>
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
  
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: { children: ReactNode }) {

  const [neonUser, setNeonUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isRefreshing = useRef(false)
  const [plan, setPlan] = useState<TrainingPlan | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const result = await authClient.getSession()

        if (result?.data?.user) {
          setNeonUser(result.data.user)
        } else {
          setNeonUser(null)
        }

      } catch {
        setNeonUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, []);

  // refresh the data using Memoization
  const refreshData = useCallback(async ()=> {
    if(!neonUser || isRefreshing.current) return;

    isRefreshing.current = true;

    try {
      // Fetch profile

      // Fetch plan
      const planData = await api.getCurrentPlan(neonUser.id).catch(()=>null)
      // AuthProvider.tsx inside refreshData()

if (planData) {
  // 1. Identify the data. 
  // Your log shows it's already in 'planJson' and already an object.
  const dataObject = planData.planJson;

  if (!dataObject) {
    console.error("planJson field is missing from planData");
    return;
  }

  setPlan({
    id: planData.id,
    userId: planData.userId, 
    planJson: {
      // Use the data directly from the object
      overview: dataObject.overview,
      // Map both possible casing for the schedule
      weeklyschedule: dataObject.weeklyschedule || dataObject.weeklySchedule || [], 
      progression: dataObject.progression,
    },
    version: planData.version,
    createdAt: planData.createdAt || planData.created_at,
  } as TrainingPlan);
}
    }catch(error) {
      console.error("Error while refreshing data : ", error);
    }finally {
      isRefreshing.current = false;
    }
  }, [neonUser?.id]);

  useEffect(()=> {
    if(!isLoading){
      if(neonUser?.id) {
        refreshData();
      } else {
        setPlan(null)
      }
      setIsLoading(false)
    }
  }, [neonUser?.id, isLoading, refreshData])


  async function saveProfile(profile: Omit<UserProfile, 'userId' | 'updatedAt'>) {
  if (!neonUser) {
    throw new Error("User must be authenticated to save profile");
  }

  await api.saveProfile(neonUser.id, profile);
  await refreshData();
}


async function generatePlan() {

    if (!neonUser) {
      throw new Error("User must be authenticated to generate plan")
    }
    await api.generatePlan(neonUser.id);
    await refreshData();
  }

  return (
    <AuthContext.Provider value={{ user: neonUser, isLoading, saveProfile, generatePlan, refreshData, plan }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within the AuthProvider')
  }

  return context
}