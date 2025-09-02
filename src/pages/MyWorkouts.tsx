import { useEffect, useState } from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { useAuth, useUser } from "@clerk/clerk-react";
import type { Exercise } from "../types/exercise";
import type { UserResource } from "@clerk/types"; 
import { getSavedExercises, removeExercise } from "../utils/savedExercises";
import { WorkoutContext } from "../context/WorkoutContext";
import WorkoutHeader from "../components/Workouts/WorkoutHeader";
import ExerciseCard from "../components/Workouts/ExerciseCard";

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
    return <Text mt={4}> No exercises saved. Add some from the Dashboard!</Text>;
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
      <Box>
        <WorkoutHeader user={user as UserResource} />
        {exercises.length === 0 ? (
              <Text mt={4}>No exercises saved. Add some from the Dashboard!</Text>
        ) : (
          <SimpleGrid columns={[1, 2]} mt={4}>
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
        )}
      </Box>
    </WorkoutContext.Provider>
  );
}

export default MyWorkouts;
