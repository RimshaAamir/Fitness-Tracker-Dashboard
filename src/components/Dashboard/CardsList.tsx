import { SimpleGrid, Spinner, Text, Box, Image, Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FaUser, FaBullseye, FaDumbbell } from 'react-icons/fa';
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
    <Box bg="black" color="white" p={4}>
      {loading && <Spinner mt={6} size="xl" color="red.500" />}
      {error && <Text color="red.400" mt={4}>{error}</Text>}
      {!loading && !error && exercises.length === 0 && (
        <Text mt={4} color="gray.300">No exercises found</Text>
      )}
      <SimpleGrid columns={[1, 2, 3]} mt={6} gap={6}>
        {exercises.map((exercise) => (
          <Box
            key={exercise.id}
            p={4}
            rounded="2xl"
            bg="gray.800"
            color="white"
            borderColor="gray.600"
            borderWidth="1px"
            _hover={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
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
              <Text fontWeight="bold" fontSize="lg" color="white">{exercise.name}</Text>
              <Flex align="center" mt={1}>
                <Box mr={2} color={"red.500"}><FaUser /></Box>
                <Text color="gray.300">Body Part: {exercise.bodyPart}</Text>
              </Flex>
              <Flex align="center" mt={1}>
                <Box mr={2} color={"red.500"}><FaBullseye /></Box>
                <Text color="gray.300">Target: {exercise.target}</Text>
              </Flex>
              <Flex align="center" mt={1}>
                <Box mr={2} color={"red.500"}><FaDumbbell /></Box>
                <Text color="gray.300">Equipment: {exercise.equipment}</Text>
              </Flex>
            </Link>
            {isSignedIn && (
              <Button
                mt={3}
                size="sm"
                w="full"
                borderRadius="2xl"
                bg={savedExercises.includes(exercise.id) ? "gray.600" : "red.500"}
                color="white"
                _hover={{ bg: savedExercises.includes(exercise.id) ? "gray.700" : "red.600" }}
                _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
                onClick={() => handleToggleSave(exercise)}
              >
                {savedExercises.includes(exercise.id) ? 'Saved' : 'Save to My Workouts'}
              </Button>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Results;