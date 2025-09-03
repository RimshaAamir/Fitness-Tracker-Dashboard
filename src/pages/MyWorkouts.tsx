import { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Flex } from "@chakra-ui/react";
import { useAuth, useUser } from "@clerk/clerk-react";
import type { Exercise } from "../types/exercise";
import type { UserResource } from "@clerk/types"; 
import { getSavedExercises, removeExercise } from "../utils/savedExercises";
import { WorkoutContext } from "../context/WorkoutContext";
import WorkoutHeader from "../components/Workouts/WorkoutHeader.tsx";
import ExerciseCard from "../components/Workouts/ExerciseCard.tsx";

function MyWorkouts() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [formExerciseId, setFormExerciseId] = useState<string | null>(null);

  const refreshExercises = () => {
    if (isSignedIn && user?.id) {
      setExercises(getSavedExercises(user.id));
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
