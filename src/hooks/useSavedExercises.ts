import { useState, useEffect, useCallback } from "react";
import { saveExercise, removeExercise, getSavedExercises } from "../utils/savedExercises";
import type { Exercise } from "../types/exercise";
import type { UserResource } from "@clerk/types";

export const useSavedExercises = (user: UserResource | null | undefined) => {
  const [savedExercises, setSavedExercises] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      const saved = getSavedExercises(user.id).map((ex) => ex.id);
      setSavedExercises(saved);
    }
  }, [user]);

  const handleToggleSave = useCallback(
    (exercise: Exercise) => {
      if (!user?.id) return;
      setSavedExercises((prev) => {
        if (prev.includes(exercise.id)) {
          removeExercise(user.id, exercise.id);
          return prev.filter((id) => id !== exercise.id);
        } else {
          saveExercise(user.id, exercise);
          return [...prev, exercise.id];
        }
      });
    },
    [user]
  );

  return { savedExercises, handleToggleSave };
};
