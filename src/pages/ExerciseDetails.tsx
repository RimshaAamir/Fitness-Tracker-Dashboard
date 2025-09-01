import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchExerciseById, fetchExercisesByTarget } from "../api/exerciseApi";
import { Box, Heading, Text, Image, Spinner, VStack, SimpleGrid, Button} from "@chakra-ui/react";
import { useAuth, useUser } from '@clerk/clerk-react';
import { saveExercise, removeExercise, getSavedExercises } from '../utils/savedExercises';
import type { Exercise } from "../types/exercise";

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
        const filteredSuggestions = suggested
          .filter((ex: Exercise) => ex.id !== id)
          .slice(0, 10);
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
      const saved = getSavedExercises(user.id).map(ex => ex.id);
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

  if (loading) return <Spinner mt={4} />;
  if (error) return <Text color="red" mt={2}>{error}</Text>;
  if (!exercise) return <Text mt={2}>Exercise not found</Text>;

  return (
    <Box p={4}>
      <VStack align="start" >
        <Heading>{exercise.name}</Heading>
        <Image src={exercise.gifUrl} alt={exercise.name} maxW="400px" />
        <Text><strong>Body Part:</strong> {exercise.bodyPart}</Text>
        <Text><strong>Target Muscle:</strong> {exercise.target}</Text>
        <Text><strong>Equipment:</strong> {exercise.equipment}</Text>
        <Box>
          <Text fontWeight="bold">Instructions:</Text>
          <VStack align="start" mt={2}>
            {exercise.instructions.map((step, index) => (
              <Text key={index}>{`${index + 1}. ${step}`}</Text>
            ))}
          </VStack>
        </Box>
        {isSignedIn && (
          <Button mt={4} colorScheme="green" onClick={() => handleToggleSave(exercise)}
          >
          {savedExercises.includes(exercise.id) ? 'Saved' : 'Save to My Workouts'}
                    </Button>
        )}
        {suggestedExercises.length > 0 && (
          <Box mt={6}>
            <Text fontSize="lg" fontWeight="bold">Suggested Exercises</Text>
            <SimpleGrid columns={[1, 2]} mt={2} >
              {suggestedExercises.map((ex) => (
                  <Box key={ex.id} p={3} borderWidth="1px" rounded="md">
                    <Link to={`/exercise/${ex.id}`}>
                      <Text fontWeight="bold">{ex.name}</Text>
                      <Text>Body Part: {ex.bodyPart}</Text>
                      <Text>Target: {ex.target}</Text>
                      <Text>Equipment: {ex.equipment}</Text>
                    </Link>
                    {isSignedIn && (
                      <Button
                        mt={2}
                        size="sm"
                        colorScheme={savedExercises.includes(ex.id) ? 'gray' : 'green'}
                        onClick={() => handleToggleSave(ex)}
                      >
                        {savedExercises.includes(ex.id) ? 'Saved' : 'Save to My Workouts'}
                      </Button>
                    )}
                  </Box>
                ))}
            </SimpleGrid>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default ExerciseDetails;