import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExerciseById, fetchExercisesByTarget } from "../api/exerciseApi";
import { Box } from "@chakra-ui/react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { saveExercise, removeExercise, getSavedExercises } from "../utils/savedExercises";
import type { Exercise } from "../types/exercise";
import ExerciseDetailsMainPage from "../components/exercises/ExerciseDetailsSection";
import SuggestedExercises from "../components/exercises/SuggestedExercises";
import StatusMessage from "../components/exercises/StatusMessage";

function ExerciseDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedExercises, setSavedExercises] = useState<string[]>([]);

  useEffect(() => {
    const loadExercise = async () => {
      if (!id) {
        setError("Invalid exercise ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const exerciseData = await fetchExerciseById(id);
        setExercise(exerciseData);
        const suggested = await fetchExercisesByTarget(exerciseData.target);
        // const suggested = await fetchAllExercises();
        const filteredSuggestions = suggested
          .filter((ex: Exercise) => ex.id !== id)
          .slice(0, 6);
        setSuggestedExercises(filteredSuggestions);
        setError(null);
      } catch (err) {
        setError("Failed to load exercise details");
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      const saved = getSavedExercises(user.id).map((ex) => ex.id);
      setSavedExercises(saved);
    }
  }, [isSignedIn, user]);

  const handleToggleSave = (exercise: Exercise) => {
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
  };

  return (
    <Box bg="black" minH="100vh" color="white" p={6}>
      <StatusMessage loading={loading} error={error} exercise={exercise} />
      {exercise && (
        <>
          <ExerciseDetailsMainPage
            exercise={exercise}
            savedExercises={savedExercises}
            handleToggleSave={handleToggleSave}
            isSignedIn={!!isSignedIn}
          />
          <SuggestedExercises
            suggestedExercises={suggestedExercises}
            savedExercises={savedExercises}
            handleToggleSave={handleToggleSave}
          />
        </>
      )}
    </Box>
  );
}

export default ExerciseDetails;