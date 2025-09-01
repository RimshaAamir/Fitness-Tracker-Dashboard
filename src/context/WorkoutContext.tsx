import { createContext, useContext } from "react";
import type { Exercise } from "../types/exercise";

interface WorkoutContextProps {
  userId: string;
  exercises: Exercise[];
  refreshExercises: () => void;
  formExerciseId: string | null;
  toggleForm: (exerciseId: string) => void;
}

export const WorkoutContext = createContext<WorkoutContextProps | null>(null);

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkoutContext must be used within WorkoutProvider");
  }
  return context;
};
