import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExerciseById, fetchExercisesByTarget } from "../api/exerciseApi";
import { Box, Heading, Text, Image, Spinner, VStack, SimpleGrid, Button} from "@chakra-ui/react";
import { useUser } from '@clerk/clerk-react';
import { saveExercise } from '../utils/savedExercises';

interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  bodyPart: string;
  gifUrl: string;
  instructions: string[];
}

function ExerciseDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, isSignedIn } = useUser();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSaveExercise = () => {
    if (isSignedIn && user?.id && exercise) {
      saveExercise(user.id, exercise);
      alert(`${exercise.name} saved to My Workouts!`);
    }
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
          <Button mt={4} colorScheme="green" onClick={handleSaveExercise}>
            Save to My Workouts
          </Button>
        )}
        {suggestedExercises.length > 0 && (
          <Box mt={6}>
            <Text fontSize="lg" fontWeight="bold">Suggested Exercises</Text>
            <SimpleGrid columns={[1, 2]} mt={2} >
              {suggestedExercises.map((ex) => (
                <Box key={ex.id} p={3} borderWidth="1px" rounded="md">
                  <Text fontWeight="bold">{ex.name}</Text>
                  <Text>Target: {ex.target}</Text>
                  <Text>Equipment: {ex.equipment}</Text>
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