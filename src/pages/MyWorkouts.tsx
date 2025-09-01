import { useEffect, useState } from "react";
import { Box, Heading, Text, SimpleGrid, Button } from "@chakra-ui/react";
import { useAuth, useUser } from "@clerk/clerk-react";
import type { Exercise } from "../types/exercise";
import { getSavedExercises, removeExercise } from "../utils/savedExercises";
import { getLogs } from "../utils/progressLogs";
import ProgressForm from "../components/ProgressForm";
import { WorkoutContext } from "../context/WorkoutContext";

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
    return <Text>Please sign in to view your workouts.</Text>;
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
      <Box p={4}>
        <Heading size="lg">My Workouts</Heading>
        <Text mt={2}>Hello, {user.firstName || "User"}!</Text>
        {exercises.length === 0 ? (
          <Text mt={4}>No exercises saved. Add some from the Dashboard!</Text>
        ) : (
          <SimpleGrid columns={[1, 2]} mt={4}>
            {exercises.map((exercise) => {
              const logs = getLogs(user.id, exercise.id);

              return (
                <Box key={exercise.id} p={3} borderWidth="1px" rounded="md">
                  <Text fontWeight="bold">{exercise.name}</Text>
                  <Text>Body Part: {exercise.bodyPart}</Text>
                  <Text>Target: {exercise.target}</Text>
                  <Text>Equipment: {exercise.equipment}</Text>
                  {logs.length > 0 && (
                    <Box mt={2}>
                      <Text fontWeight="semibold">Progress Logs:</Text>
                      {logs.map((log, index) => (
                        <Text key={index} fontSize="sm" ml={2}>
                          {log.sets} sets, {log.reps} reps, {log.weight} kg
                        </Text>
                      ))}
                    </Box>
                  )}

                  <Box mt={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => toggleForm(exercise.id)}
                    >
                      {formExerciseId === exercise.id
                        ? "Hide Form"
                        : "Log Progress"}
                    </Button>
                    <Button
                      size="sm"
                      ml={2}
                      colorScheme="red"
                      onClick={() => remove(exercise.id)}
                    >
                      Remove
                    </Button>
                  </Box>

                  {formExerciseId === exercise.id && <ProgressForm />}
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Box>
    </WorkoutContext.Provider>
  );
}

export default MyWorkouts;
