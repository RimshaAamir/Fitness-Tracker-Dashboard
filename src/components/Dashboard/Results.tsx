import { SimpleGrid, Spinner, Text, Box, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import type { Exercise } from '../../types/exercise';

interface ResultsProps {
  loading: boolean;
  error: string | null;
  exercises: Exercise[];
  exerciseImages: Record<string, string>;
  savedExercises: string[];
  handleToggleSave: (exercise: Exercise) => void;
}

function Results({ loading, error, exercises, exerciseImages, savedExercises, handleToggleSave }: ResultsProps) {
  const { isSignedIn } = useAuth();

  return (
    <>
      {loading && <Spinner mt={6} size="xl" color="teal.400" />}
      {error && <Text color="red.500" mt={4}>{error}</Text>}
      {!loading && !error && exercises.length === 0 && (
        <Text mt={4} color="gray.500">No exercises found</Text>
      )}
      <SimpleGrid columns={[1, 2, 3]} mt={6}>
        {exercises.map((exercise) => (
          <Box
            key={exercise.id}
            p={4}
            rounded="2xl"
            shadow="md"
            borderWidth="1px"
            bg="white"
            _hover={{ shadow: "xl", transform: "scale(1.02)" }}
            transition="all 0.2s ease"
          >
            <Link to={`/exercise/${exercise.id}`}>
              {exerciseImages[exercise.id] && (
                <Image
                  src={exerciseImages[exercise.id] || "../../public/exercise.jpg"}
                  alt={exercise.name}
                  borderRadius="lg"
                  mb={3}
                  objectFit="cover"
                  h="180px"
                  w="100%"
                />
              )}
              <Text fontWeight="bold" fontSize="lg">{exercise.name}</Text>
              <Text color="gray.600">Body Part: {exercise.bodyPart}</Text>
              <Text color="gray.600">Target: {exercise.target}</Text>
              <Text color="gray.600">Equipment: {exercise.equipment}</Text>
            </Link>
            {isSignedIn && (
              <Button
                mt={3}
                size="sm"
                w="full"
                borderRadius="md"
                bg={savedExercises.includes(exercise.id) ? "gray.400" : "teal.400"}
                color="white"
                _hover={{ opacity: 0.9 }}
                onClick={() => handleToggleSave(exercise)}
              >
                {savedExercises.includes(exercise.id) ? 'Saved' : 'Save to My Workouts'}
              </Button>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
}

export default Results;