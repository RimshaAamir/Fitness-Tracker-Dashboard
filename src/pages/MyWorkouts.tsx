import { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Flex } from "@chakra-ui/react";
import { useAuth, useUser } from "@clerk/clerk-react";
import type { Exercise } from "../types/exercise";
import type { UserResource } from "@clerk/types";
import { getSavedExercises, removeExercise } from "../utils/savedExercises";
import { fetchExerciseImage } from "../api/exerciseApi";
import { WorkoutContext } from "../context/WorkoutContext";
import WorkoutHeader from "../components/Workouts/WorkoutHeader.tsx";
import ExerciseCard from "../components/Workouts/ExerciseCard.tsx";

function MyWorkouts() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseImages, setExerciseImages] = useState<Record<string, string>>({});
  const [formExerciseId, setFormExerciseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshExercises = () => {
    if (isSignedIn && user?.id) {
      const savedExercises = getSavedExercises(user.id);
      setExercises(savedExercises);
      const fetchImages = async () => {
        setLoading(true);
        try {
          const imageMap: Record<string, string> = {};
          await Promise.all(
            savedExercises.map(async (exercise: Exercise) => {
              try {
                const img = await fetchExerciseImage(360, exercise.id);
                imageMap[exercise.id] = img;
              } catch {
                imageMap[exercise.id] = "/exercise.jpg";
              }
            })
          );
          setExerciseImages(imageMap);
          setError(null);
        } catch (err) {
          setError("Failed to load exercise images");
        } finally {
          setLoading(false);
        }
      };
      fetchImages();
    }
  };

  useEffect(() => {
    refreshExercises();
  }, [isSignedIn, user]);

  const remove = (exerciseId: string) => {
    if (user?.id) {
      removeExercise(user.id, exerciseId);
      refreshExercises();
    }
  };

  const toggleForm = (exerciseId: string) => {
    setFormExerciseId(formExerciseId === exerciseId ? null : exerciseId);
  };

  if (!isSignedIn || !user?.id) {
    return (
      <Box p={6} bg="black" minH="100vh" color="white">
        <Text mt={4} color="gray.300" textAlign="center" fontSize="lg">
          No exercises saved. Add some from the Dashboard!
        </Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={6} bg="black" minH="100vh" color="white">
        <Text mt={4} color="gray.300" textAlign="center" fontSize="lg">
          Loading...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} bg="black" minH="100vh" color="white">
        <Text mt={4} color="red.500" textAlign="center" fontSize="lg">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <WorkoutContext.Provider
      value={{
        userId: user.id,
        exercises,
        refreshExercises,
        formExerciseId,
        toggleForm,
      }}
    >
      <Box bg="black" minH="100vh" color="white">
        <WorkoutHeader user={user as UserResource} />
        <Box p={6} >
          {exercises.length === 0 ? (
            <Text mt={6} color="gray.300" textAlign="center" fontSize="lg">
              No exercises saved. Add some from the Dashboard!
            </Text>
          ) : (
            <Flex justify="center">
              <SimpleGrid columns={[1, 2, 3]} mt={6} gap={6} maxW="1200px">
                {exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    userId={user.id}
                    formExerciseId={formExerciseId}
                    toggleForm={toggleForm}
                    remove={remove}
                    exerciseImage={exerciseImages[exercise.id] || "/exercise.jpg"}
                  />
                ))}
              </SimpleGrid>
            </Flex>
          )}
        </Box>
      </Box>
    </WorkoutContext.Provider>
  );
}

export default MyWorkouts;