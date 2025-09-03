import { Box, Heading, Image, Text, VStack, Button, Flex, Icon, HStack } from "@chakra-ui/react";
import { FaUser, FaBullseye, FaDumbbell } from "react-icons/fa";
import type { Exercise } from "../../types/exercise";

interface ExerciseDetailsMainProps {
  exercise: Exercise;
  exerciseImage: string;
  savedExercises: string[];
  handleToggleSave: (exercise: Exercise) => void;
  isSignedIn: boolean;
}

function ExerciseDetailsMainPage({
  exercise,
  exerciseImage,
  savedExercises,
  handleToggleSave,
  isSignedIn,
}: ExerciseDetailsMainProps) {
  return (
    <Box
      w="100%"
      maxW="1200px"
      mx="auto"
      mb={8}
      p={6}
      bg="gray.800"
      borderRadius="2xl"
      borderColor="gray.600"
      borderWidth="1px"
      _hover={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
    >
      <VStack align="center" gap={6} color="white">
        <Heading size="2xl" textShadow="0 0 5px rgba(0, 0, 0, 0.7)" textAlign="center">
          {exercise.name}
        </Heading>
        <Image
          src={exerciseImage || "/exercise.jpg"}
          alt={exercise.name}
          w="100%"
          maxH="600px"
          borderRadius="lg"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.4)"
          objectFit="contain"
        />
        <HStack wrap="wrap" justify="center" gap={6} p={4} bg="gray.700" borderRadius="xl" w="full">
          <Flex align="center" minW="200px">
            <Icon as={FaUser} mr={2} color="red.500" boxSize={5} />
            <Text fontSize="md" color="gray.300">
              <strong>Body Part:</strong> {exercise.bodyPart}
            </Text>
          </Flex>
          <Flex align="center" minW="200px">
            <Icon as={FaBullseye} mr={2} color="red.500" boxSize={5} />
            <Text fontSize="md" color="gray.300">
              <strong>Target Muscle:</strong> {exercise.target}
            </Text>
          </Flex>
          <Flex align="center" minW="200px">
            <Icon as={FaDumbbell} mr={2} color="red.500" boxSize={5} />
            <Text fontSize="md" color="gray.300">
              <strong>Equipment:</strong> {exercise.equipment}
            </Text>
          </Flex>
        </HStack>

        {/* Instructions */}
        <Box w="full" p={4} bg="gray.700" borderRadius="xl">
          <Text fontWeight="bold" fontSize="lg" mb={3} color="white">
            Instructions
          </Text>
          <VStack align="start" gap={3}>
            {exercise.instructions.map((step, index) => (
              <HStack key={index} align="start" gap={3}>
                <Text fontWeight="bold" color="red.500" minW="20px">
                  {index + 1}.
                </Text>
                <Text color="gray.300" fontSize="md">
                  {step}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Save Button */}
        {isSignedIn && (
          <Button
            size="lg"
            borderRadius="2xl"
            bg={savedExercises.includes(exercise.id) ? "gray.600" : "red.500"}
            color="white"
            _hover={{ bg: savedExercises.includes(exercise.id) ? "gray.700" : "red.600" }}
            _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
            px={8}
            onClick={() => handleToggleSave(exercise)}
          >
            {savedExercises.includes(exercise.id) ? "Saved" : "Save to My Workouts"}
          </Button>
        )}
      </VStack>
    </Box>
  );
}

export default ExerciseDetailsMainPage;
