import type { Exercise } from "../types/exercise";
export const saveExercise = (userId: string, exercise: Exercise) => {
  const savedExercises = getSavedExercises(userId);
  if (!savedExercises.find((ex) => ex.id === exercise.id)) {
    savedExercises.push(exercise);
    localStorage.setItem(`savedExercises_${userId}`, JSON.stringify(savedExercises));
  }
};
export const getSavedExercises = (userId: string): Exercise[] => {
  const data = localStorage.getItem(`savedExercises_${userId}`);
  return data ? JSON.parse(data) : [];
};

export const removeExercise = (userId: string, exerciseId: string) => {
  const savedExercises = getSavedExercises(userId);
  const updatedExercises = savedExercises.filter((ex) => ex.id !== exerciseId);
  localStorage.setItem(`savedExercises_${userId}`, JSON.stringify(updatedExercises));
};