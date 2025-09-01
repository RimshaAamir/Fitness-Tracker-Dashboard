import { useEffect, useState } from 'react';
import { Box, Heading, Text, SimpleGrid, Button } from '@chakra-ui/react';
import { useAuth, useUser } from '@clerk/clerk-react';
import type { Exercise } from '../types/exercise';
import { getSavedExercises, removeExercise } from '../utils/savedExercises';

function MyWorkouts() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [savedExercises, setSavedExercises] = useState<Exercise[]>([]);

  useEffect(()=>{
    if (isSignedIn && user?.id){
      setSavedExercises(getSavedExercises(user.id));
    }
  },[isSignedIn, user]);

  const handleRemoveExercise = (exerciseId: string) => {
    if (user?.id) {
      removeExercise(user.id, exerciseId);
      setSavedExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
    }
  };

  if (!isSignedIn) {
    return <Text>You need to be signed in to view this page.</Text>;
}

  return (
    <Box p={4}>
      <Heading>My Workouts</Heading>
      <Text mt={2}>Welcome, {user?.firstName || 'User'}!</Text>
        {savedExercises.length === 0 ? (
          <Text mt={4}>No exercises saved yet. Add some from the Dashboard or Exercise Details!</Text>
        ) : (
          <SimpleGrid columns={[1, 2]} mt={4}>
            {savedExercises.map((exercise) => (
              <Box key={exercise.id} p={3} borderWidth="1px" rounded="md">
                <Text fontWeight="bold">{exercise.name}</Text>
                <Text>Body Part: {exercise.bodyPart}</Text>
                <Text>Target: {exercise.target}</Text>
                <Text>Equipment: {exercise.equipment}</Text>
                <Button
                  mt={2}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleRemoveExercise(exercise.id)}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    );
  }

export default MyWorkouts;