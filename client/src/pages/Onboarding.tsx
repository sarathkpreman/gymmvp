import { useAuth } from "@/components/context/AuthContext";
import { Card, } from "@/components/ui/Card";
import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { Select } from "../components/ui/Select"
import React, { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Loader } from "lucide-react";
import type { UserProfile } from "@/types";
import { useNavigate } from "react-router-dom";

const goalOptions = [
    {value: "bulk", label: "Build Muscle (Bulk)"},
    {value: "cut", label: "Lose fat(Cut)"},
    {value: "recomp", label: "Body recomposition"},
];

const experinceOptions = [
     {value: "beginner", label: "Beginner (0-1 years)"},
    {value: "intermediate", label: "Intermediate (1-3 years)"},
    {value: "advanced", label: "Advanced 3+ years"},
];


const daysOptions = [
    {value: "2", label: "2 days per week"},
    {value: "3", label: "3 days per week"},
    {value: "4", label: "4 days per week"},
    {value: "5", label: "5 days per week"},
    {value: "6", label: "6 days per week"}
];

const sessionOptions = [
    {value: "30", label: "30 Minutes"},
    {value: "45", label: "45 Minutes"},
    {value: "60", label: "60 Minutes"},
    {value: "90", label: "90 Minutes"},
];

const equipmentOptions = [
    {value: "full_gym", label: "Fully Gym Access"},
    {value: "home", label: "Home Gym"},
    {value: "dubmbells", label: "Dumbells Only"},
];

const splitOptions = [
    {value: "full_body", label: "Full Body"},
    {value: "upper_lower", label: "Upper/Lower Split"},
    {value: "ppl", label: "Push/Pull/Legs"},
    {value: "custom", label: "Let AI decide"},
];

export default function nOnboarding() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user , saveProfile, generatePlan } = useAuth();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [formData, setFormData] = useState({
        goal: "bulk",
        experince: "intermediate",
        daysPerWeek: "4",
        sessionLength: "60",
        equipment: "full_gym",
        injuries: "",
        preferedSplit: "upper_lower"
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isGenerating, setIsGenerating] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isError, setIsError] =  useState("")
    

    function updateForm(field: string, value: string) {
        setFormData((prev)=> ({...prev, [field]: value}));
    }

    async function handleQuestionare(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const profile: Omit<UserProfile, 'userId' | 'updatedAt'> = {
        goal: formData.goal as UserProfile["goal"],
        experience: formData.experince as UserProfile["experience"],
        daysPerWeek: Number(formData.daysPerWeek) as UserProfile["daysPerWeek"],
        sessionLength: Number(formData.sessionLength) as UserProfile["sessionLength"],
        equipment: formData.equipment as UserProfile["equipment"],
        injuries: formData.injuries,
        preferedSplit: formData.preferedSplit as UserProfile["preferedSplit"]
    }

     try {
            await saveProfile(profile)
              setIsGenerating(true)
              await generatePlan()
              navigate("/profile")
        } catch(error) {
          setIsError(error instanceof Error? error.message: "Failed to save profile")
        } finally {
          setIsGenerating(false)
        }
}
    if(!user) {
        return <RedirectToSignIn />
    }

    return (
        <SignedIn>
            <div className="min-h-screen pt-24 pb-12 px-6">
                <div className="max-w-xl mx-auto">
                    {/*Progress indicator*/}

                    {/* Questionare*/}
                       {!isGenerating ? <Card variant="bordered">
                            <h1 className="text-2xl font-bold mb-2">Tell Us About Yourself</h1>
                            <p className="text-muted mb-6">Help us to create the perfect plan for you</p>
                             <form className="space-y-5" onSubmit={handleQuestionare}>

                            <Select id="goal" 
                            label="What's your primary goal" 
                            options={goalOptions} value={formData.goal} 
                            onChange={(e)=> {
                            updateForm('goal', e.target.value)
                            }}/>

                             <Select id="experience" 
                            label="Training experience" 
                            options={experinceOptions} value={formData.experince} 
                            onChange={(e)=> {
                            updateForm('experience', e.target.value)
                            }}/>

                            <div className="grid grid-cols-2 gap-4">
                                 <Select id="daysPerWeek" 
                            label="Days per week" 
                            options={daysOptions} value={formData.daysPerWeek} 
                            onChange={(e)=> {
                            updateForm('daysPerWeek', e.target.value)
                            }}/>

                             <Select id="sessionLength" 
                            label="Sessions length" 
                            options={sessionOptions} value={formData.sessionLength} 
                            onChange={(e)=> {
                            updateForm('sessionLength', e.target.value)
                            }}/>
                            </div>

                             <Select id="daysPerWeek" 
                            label="Days per week" 
                            options={daysOptions} value={formData.daysPerWeek} 
                            onChange={(e)=> {
                            updateForm('daysPerWeek', e.target.value)
                            }}/>

                             <Select id="sessionLength" 
                            label="Sessions length" 
                            options={sessionOptions} value={formData.sessionLength} 
                            onChange={(e)=> {
                            updateForm('sessionLength', e.target.value)
                            }}/>

                             <Select id="equipment" 
                            label="Equipment access" 
                            options={equipmentOptions} value={formData.equipment} 
                            onChange={(e)=> {
                            updateForm('equipment', e.target.value)
                            }}/>

                             <Select id="preferedSplit" 
                            label="Prefered training split" 
                            options={splitOptions} value={formData.preferedSplit} 
                            onChange={(e)=> {
                            updateForm('preferedSplit', e.target.value)
                            }}/>

                            <Textarea 
                            id="injuries"
                            label="Any injuries or limitations? (optional)"
                            placeholder="Eg: Lower back issues, Shoulder pain..."
                            rows={3}
                            value={formData.injuries}
                            onChange={(e)=> {
                                updateForm('injuries', e.target.value)
                            }}
                            />
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" className="flex-1 gap-2">
                                    Generate my plan <ArrowRight className="w-4 h-4"></ArrowRight>
                                </Button> 
                            </div>
                        </form>
                        </Card> : (
                        
                        <Card variant="bordered" className="text-center py-16">
                            {/* Generating*/}
                            <Loader className="w-12 h-12 text-accent mx-auto mb-6 animate-spin"/>
                            <h1 className="text-2xl mb-2 font-bold">Creating your Plan</h1>
                            <p className="text-muted">Our AI is building your personalized training program...</p>
                        </Card>
                        )}
    
                </div>
            </div>
        </SignedIn>
    )
}