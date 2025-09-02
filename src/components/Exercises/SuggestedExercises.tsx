import { Box, Text, SimpleGrid, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { Exercise } from "../../types/exercise";

interface SuggestedExercisesProps {
  suggestedExercises: Exercise[];
  savedExercises: string[];
  handleToggleSave: (exercise: Exercise) => void;
}

function SuggestedExercises({
  suggestedExercises,
  savedExercises,
  handleToggleSave,
}: SuggestedExercisesProps) {
  if (suggestedExercises.length === 0) return null;

  return (
    <Box mt={6}>
      <Text fontSize="lg" fontWeight="bold">Suggested Exercises</Text>
      <SimpleGrid columns={[1, 2]} mt={2}>
        {suggestedExercises.map((ex) => (
          <Box key={ex.id} p={3} borderWidth="1px" rounded="md">
            <Link to={`/exercise/${ex.id}`}>
              <Text fontWeight="bold">{ex.name}</Text>
              <Text>Body Part: {ex.bodyPart}</Text>
              <Text>Target: {ex.target}</Text>
              <Text>Equipment: {ex.equipment}</Text>
            </Link>
            <Button
              mt={2}
              size="sm"
              colorScheme={savedExercises.includes(ex.id) ? "gray" : "green"}
              onClick={() => handleToggleSave(ex)}
            >
              {savedExercises.includes(ex.id) ? "Saved" : "Save to My Workouts"}
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default SuggestedExercises;