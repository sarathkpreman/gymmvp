
export interface UserProfile {
    goal: string,
    experience: string,
    days_per_week: number;
    session_length: number;
    equipment: string,
    injuries?: string | null;
    preferedSplit: string
}

export interface PlanOverView {
    goal: string,
    freequency: string,
    split: string,
    notes: string,
}

export interface DaySchedule {
    day: string,
    focus: string,
    exercise: Exercise
}

export interface Exercise {
    name: string,
    sets: number,
    reps: string,
    rest: string,
    rpe: number,
    notes?: string,
    alternatives?: string[];
}

export interface TrainingPlan {
    id: string;
    userId: string;
    overview: PlanOverView;
    weeklyschedule: DaySchedule[];
    progression: string;
    version: number;
    createdAt: string
}