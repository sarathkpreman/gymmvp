
import type { DaySchedule, Exercise } from "@/types";
import { Card } from "../ui/Card";
import { Dumbbell, Info } from "lucide-react";

interface PlanDisplayProps {
    weeklySchedule: DaySchedule[];
}


function ExerciseRow({exercise, index}: {exercise: Exercise, index: number} ) {
    return(
        <tr className="border-b color-border last:border-0">
            <td className="py-3 pr-4">
                <div className="flex items-start gap-3">
                    <span className="text-muted text-xs w-5">{index + 1}</span>
                    <div>
                        <p className="font-medium">{exercise.name}</p>
                        {exercise.notes && 
                          <p className="text-s text-muted mt-0.5 flex items-center gap-1">
                              <Info className="w-3 h-3"/>
                            {exercise.notes}
                          </p>
                        }
                    </div>
                </div>
            </td>


            <td className="py-3 px-4 text-center whitespace-nowrap">
                <span className="text-accent font-medium">{exercise.sets}</span>
                <span className="text-muted"> x </span>
                <span>{exercise.reps}</span>
            </td>


            <td className="py-3 px-4 text-center">
                <span className="text-muted">{exercise.rest}</span>
            </td>

            <td className="py-3 px-4 text-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium
                    ${exercise.rpe >= 8 ? 'bg-red-500/10 text-red-400' : 
                    exercise.rpe >=7 ? 'bg-yellow-500/10 text-yellow-400' : 
                    'bg-green-500/10 text-green-400' }
                    `}>{exercise.rpe}</span>
            </td>
        </tr>
    )
}

function DayCard({schedule}: {schedule: DaySchedule}) {
    // Note: Changed schedule.exercise to schedule.exercises
    return (
        <Card variant="bordered" className="overflow-hidden mb-4">
            <div className="flex items-center mb-4 justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{schedule.day}</h3>
                    <p className="text-sm text-accent">{schedule.focus}</p>
                </div>

                <div className="text-muted text-sm flex items-center gap-2">
                    <Dumbbell className="w-4 h-4"></Dumbbell>
                    <span>
                        {/* Fix property name here */}
                        {schedule.exercises?.length || 0} exercises
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-muted text-xs uppercase tracking-wider border-b border-border">
                            <th className="text-left py-2 pr-4 font-medium">Exercises</th>
                            <th className="py-2 px-4 font-medium text-center">Reps</th>
                            <th className="py-2 px-4 font-medium text-center">Rest</th>
                            <th className="py-2 px-4 font-medium text-center">RPE</th>
                        </tr>
                    </thead>

                  <tbody>
                    {/* Fix property name here */}
                    {schedule.exercises?.map((exercise, key) => (
                        <ExerciseRow exercise={exercise} index={key} key={key}/>
                    ))}
                  </tbody>
                </table>
            </div>
        </Card>
    )
}


export function PlanDisplay({ weeklySchedule }: PlanDisplayProps) {
    return (
        <div className="space-y-6 mb-8">
            {weeklySchedule?.map((schedule, key) => (
                <DayCard key={key} schedule={schedule} />
            ))}
        </div>
    )
}