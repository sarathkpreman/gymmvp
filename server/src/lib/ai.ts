import OpenAI from "openai";
import dotenv from "dotenv";
import type { UserProfile, TrainingPlan } from "../../types";
import { json } from "node:stream/consumers";
import { error } from "node:console";

dotenv.config()

export async function generateTrainingPlan(profile: UserProfile | Record<string, any>): 
    Promise<Omit<TrainingPlan, 'id' | 'userId' | 'version' | 'createdAt'>> {
    // Normalize profile data
    const normalizedProfile: UserProfile = {
        goal: profile.goal || "bulk",
        experience: profile.experience || "intermediate",
        days_per_week: profile.days_per_week || 4,
        session_length: profile.session_length || 60,
        equipment: profile.equipment || "full_gym",
        injuries: profile.injuries || null,
        preferedSplit: profile.preferedSplit || "upper_lower",
    };

    const api_key = process.env.OPEN_ROUTER_KEY;

    if(!api_key) {
        throw Error("OPEN ROUTER API KEY is missing..");
    }

    const openai = new OpenAI({
        apiKey: api_key,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": "http://localhost:3001",
            "X-Title": "Iron Mind gym ai planner",
        },
    });

    const prompt = buildPrompt(normalizedProfile)

    try {
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert fitness trainer and program designer. You must respone with a valid JSON only. Do not include any markdown or extra text",
                },

                {
                    role: "user",
                    content: prompt,
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content

        if(!content) {
            console.error("[AI] no content in response:", JSON.stringify(completion, null, 2));
            throw new Error("No content in AI response");
        }

        const planData = JSON.parse(content);
            
        return formatPlanResponse(planData, normalizedProfile);

    } catch(error) {
        console.error("[AI] Error generating training plan", error);
        throw error;
    }
}

function formatPlanResponse(aiResponse: any, profile: UserProfile): Omit<TrainingPlan, 'id' | 'userId' | 'version' | 'createdAt'> {
    const plan: Omit<TrainingPlan, 'id' | 'userId' | 'version' | 'createdAt'> = {
        overview: {
            goal: aiResponse.overview?.goal || `Customized ${profile.goal} program`,
            frequency: aiResponse.overview?.frequency || `${profile.days_per_week} days per week`,
            split: aiResponse.overview?.split || profile.preferedSplit,
            notes: aiResponse.overview?.notes || 'Follow the program consistently for the best results.',
        },
        weeklyschedule: (aiResponse.weeklySchedule || []).map((day: any)=> ({
            day: day.day || "Day",
            focus: day.focus || "Full_Body",
            exercises: (day.exercises || []).map((ex: any)=> ({
                name: ex.name || "Exercise",
                sets: ex.sets || 3,
                reps: ex.reps || "8-12",
                rest: ex.rest || "60-90 sec",
                rpe: ex.rpe || 7,
                notes: ex.notes,
                alternatives: ex.alternatives
            }))
        })),
        progression: aiResponse.progression || 
        "Increase weight by 2.5-5 lbs when you can complete all sets with good form. Track your progress weekly.",

    };
    return plan;
}

function buildPrompt(profile: UserProfile): string {
    const goalMap: Record<string, string> = {
        bulk: "build muscle and gain size",
        cut: "lose fat and maintain muscle",
        recomp: "simultaneoulsy lose fat and build muscle",
        strength: "build maximum strength",
        endurence: "improve cardiovascular strength and stamina",
    };

    const experienceMap: Record<string, string> = {
        beginner: "beginner (0-1 years of training experience)",
        intermediate: "intermediate (1-3 years of training experience)",
        advanced: "advanced (3+ years of training experience)"
    };

    const equipementMap: Record<string, string> = {
        full_gym: "full gym access with all equipments",
        home: "home gym with limited equipments",
        dumbells: "only dumbells available"

    };

    const splitMap: Record<string, string> = {
        full_body: "full body workouts",
        upper_lower: "upper/lower splits",
        ppl: "push/pull/leg split",
        custom: "best split for their goals"
    };

    return `Create a personalized ${profile.days_per_week}-day per week training plan for someone with the following profile: 
    
    Goal: ${goalMap[profile.goal] || profile.goal}
    Experience Level: ${experienceMap[profile.experience] || profile.experience}
    Session Length: ${profile.session_length} minutes per session
    Equipment: ${equipementMap[profile.equipment] || profile.equipment}
    Preferred Split: ${splitMap[profile.preferedSplit] || profile.preferedSplit},
    ${profile.injuries ? `Injuries/Limitations: ${profile.injuries}` : ""}

     Generate a complete trainig  plan in JSON format with this exact structure: 
     {
        "overview": {
            "goal": "brief description of training goal"
            "freequency": "X days per week"
            "split": "training split name"
            "notes": "important notes about the program (2-3 sentences)"
        }

        "weeklySchedule": [
  {
    "day": "Monday",
    "focus": "muscle group",
    "exercises": [
      {
        "name": "Exercise Name",
        "sets": 4,
        "reps": "6-8",
        "rest": "2-3 min",
        "rpe": 8,
        "notes": "...",
        "alternatives": ["Alt1", "Alt2"]
      }
    ]
  }
],
        "progression" : "detailed progression strategy (2-3 sentences explaining how to progress)"
     }

        Requirements:
            - Create exactly ${profile.days_per_week} workout days
            - Each workout should fit within ${profile.session_length} minutes
            - Include 4-6 exercises per workout
            - RPE (Rate of percieved exertion) should be 6-9
            - Include compound movements for beginners/intermediate, advanced can have more isoloation
            - Match the preferred split type ${profile.preferedSplit}
            - ${profile.injuries ? `Avoid exercises that could aggravate: ${profile.injuries}` : ''}
            - Provide exercie alternatives where appropriate 
            - Make it progressive and suitable for ${experienceMap[profile.experience] || profile.experience} level
            
            Return ONLY the JSON object (no markdown, no extra text)
    `;
}