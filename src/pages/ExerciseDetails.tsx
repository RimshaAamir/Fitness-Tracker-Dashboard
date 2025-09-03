import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExerciseById, fetchExercisesByTarget, fetchExerciseImage } from "../api/exerciseApi";
import { Box } from "@chakra-ui/react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { saveExercise, removeExercise, getSavedExercises } from "../utils/savedExercises";
import type { Exercise } from "../types/exercise";
import ExerciseDetailsMainPage from "../components/Exercises/ExerciseDetailsSection.tsx";
import SuggestedExercises from "../components/Exercises/SuggestedExercises.tsx";
import StatusMessage from "../components/Exercises/StatusMessage.tsx";

function ExerciseDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [exerciseImage, setExerciseImage] = useState<string>("");
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);
  const [suggestedImages, setSuggestedImages] = useState<Record<string, string>>({});
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
        try {
          const img = await fetchExerciseImage(360, exerciseData.id);
          setExerciseImage(img);
        } catch {
          setExerciseImage("/exercise.jpg");
        }

        // Suggested exercises
        const suggested = await fetchExercisesByTarget(exerciseData.target);
        const filteredSuggestions = suggested
          .filter((ex: Exercise) => ex.id !== id)
          .slice(0, 6);

        setSuggestedExercises(filteredSuggestions);
        const imageMap: Record<string, string> = {};
        await Promise.all(
          filteredSuggestions.map(async (ex: Exercise) => {
            try {
              const img = await fetchExerciseImage(360, ex.id);
              imageMap[ex.id] = img;
            } catch {
              imageMap[ex.id] = "/exercise.jpg";
            }
          })
        );
        setSuggestedImages(imageMap);

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
            exerciseImage={exerciseImage}
            savedExercises={savedExercises}
            handleToggleSave={handleToggleSave}
            isSignedIn={!!isSignedIn}
          />
          <SuggestedExercises
            suggestedExercises={suggestedExercises}
            suggestedImages={suggestedImages}
            savedExercises={savedExercises}
            handleToggleSave={handleToggleSave}
          />
        </>
      )}
    </Box>
  );
}

export default ExerciseDetails;
