import { Box, Heading, Image, Text, VStack, Button } from "@chakra-ui/react";
import type { Exercise } from "../../types/exercise";

interface ExerciseDetailsMainProps {
  exercise: Exercise;
  savedExercises: string[];
  handleToggleSave: (exercise: Exercise) => void;
  isSignedIn: boolean;
}

function ExerciseDetailsMainPage({
  exercise,
  savedExercises,
  handleToggleSave,
  isSignedIn,
}: ExerciseDetailsMainProps) {
  return (
    <VStack align="start">
      <Heading>{exercise.name}</Heading>
      <Image src={exercise.gifUrl} alt={exercise.name} maxW="400px" />
      <Text>
        <strong>Body Part:</strong> {exercise.bodyPart}
      </Text>
      <Text>
        <strong>Target Muscle:</strong> {exercise.target}
      </Text>
      <Text>
        <strong>Equipment:</strong> {exercise.equipment}
      </Text>
      <Box>
        <Text fontWeight="bold">Instructions:</Text>
        <VStack align="start" mt={2}>
          {exercise.instructions.map((step, index) => (
            <Text key={index}>{`${index + 1}. ${step}`}</Text>
          ))}
        </VStack>
      </Box>
      {isSignedIn && (
        <Button
          mt={4}
          colorScheme="green"
          onClick={() => handleToggleSave(exercise)}
        >
          {savedExercises.includes(exercise.id)
            ? "Saved"
            : "Save to My Workouts"}
        </Button>
      )}
    </VStack>
  );
}

export default ExerciseDetailsMainPage;