import { useAuth } from "@/components/context/AuthContext"
import { PlanDisplay } from "@/components/plan/PlanDisplay";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Calendar, Dumbbell, RefreshCcw, Target, TrendingUp, } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Profile() {

    const { user, isLoading, plan, generatePlan } = useAuth();

    if(!user && !isLoading) {
        return <Navigate to="/auth/sign-in" replace/>
    }
     
    if(!plan) {
        return <Navigate to="/onboarding" replace/>
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const details = plan.planJson

    return (<div className="min-h-screen pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Your Training Plan</h1>
                            <p className="text-muted">version {plan.version} . Created {formatDate(plan.createdAt)}</p>
                        </div>

                        <Button variant="secondary" className="gap-2" onClick={async ()=> await generatePlan()}>
                            <RefreshCcw  className="w-4 h-4"/>
                            Regenerate Plan
                        </Button>
                    </div>
                   
                    <div className="grid md:grid-cols-4 gap-4 mb-8 ">
                        <Card variant="bordered" className="flex items-center gap-3" >
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Target className="text-accent w-5 h-5"/>
                        </div>
                        <div>
                            <p className="text-muted text-xs">Goal</p>
                            <p className="font-medium text-sm">{details.overview.goal}</p>
                        </div>
                        </Card>

                        <Card variant="bordered" className="flex items-center gap-3" >
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Calendar className="text-accent w-5 h-5"/>
                        </div>
                        <div>
                            <p className="text-muted text-xs">Frequency</p>
                            <p className="font-medium text-sm">{details.overview.frequency}</p>
                        </div>
                        </Card>

                        <Card variant="bordered" className="flex items-center gap-3" >
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Dumbbell className="text-accent w-5 h-5"/>
                        </div>
                        <div>
                            <p className="text-muted text-xs">Split</p>
                            <p className="font-medium text-sm">{details.overview.split}</p>
                        </div>
                        </Card>

                        <Card variant="bordered" className="flex items-center gap-3" >
                        <div className="w-10 h-10 flex items-center justify-center">
                            <TrendingUp className="text-accent w-5 h-5"/>
                        </div>
                        <div>
                            <p className="text-muted text-xs">Version</p>
                            <p className="font-medium text-sm">{plan.version}</p>
                        </div>
                        </Card>
                    </div>

                    {/* Plan notes */}
                    <Card variant="bordered" className="mb-8">
                        <h2 className="font-semibold text-lg mb-2">Program Notes</h2>
                        <p className="text-muted text-sm leading-relaxed">{details.overview.notes}</p>
                    </Card>

                    {/* weekly Schedule */}
                    <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
                    <PlanDisplay weeklySchedule={plan.planJson.weeklyschedule}/>


                    <Card variant="bordered" className="mb-8">
                        <h2 className="font-semibold text-lg mb-2">Progression</h2>
                        <p className="text-muted text-sm leading-relaxed">{details.progression}</p>
                    </Card> 
                </div>
            </div>
            )

            
}