import { SimpleGrid, Spinner, Text, Box } from '@chakra-ui/react';
import type { Exercise } from '../../types/exercise';
import ExerciseCard from './ExerciseCard';

interface ResultsProps {
  loading: boolean;
  error: string | null;
  exercises: Exercise[];
  exerciseImages: Record<string, { url: string | null; isLoading: boolean; isError: boolean }>;
  savedExercises: string[];
  handleToggleSave: (exercise: Exercise) => void;
}

function Results({ loading, error, exercises, exerciseImages, savedExercises, handleToggleSave }: ResultsProps) {
  return (
    <Box bg="black" color="white" p={4}>
      {loading && <Spinner mt={6} size="xl" color="red.500" />}
      {error && <Text color="red.400" mt={4}>{error}</Text>}
      {!loading && !error && exercises.length === 0 && (
        <Text mt={4} color="gray.300">No exercises found</Text>
      )}
      <SimpleGrid columns={[1, 2, 3]} mt={6} gap={6}>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            image={exerciseImages[exercise.id]?.url || null}
            isImageLoading={exerciseImages[exercise.id]?.isLoading || false}
            isImageError={exerciseImages[exercise.id]?.isError || false}
            isSaved={savedExercises.includes(exercise.id)}
            handleToggleSave={handleToggleSave}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Results;
