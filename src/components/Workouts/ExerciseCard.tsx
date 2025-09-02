import { Box, Text, Button } from "@chakra-ui/react";
import type { Exercise } from "../../types/exercise";
import { getLogs } from "../../utils/progressLogs";
import ProgressForm from "../../components/ProgressForm";

interface ExerciseCardProps {
  exercise: Exercise;
  userId: string;
  formExerciseId: string | null;
  toggleForm: (exerciseId: string) => void;
  remove: (exerciseId: string) => void;
}

function ExerciseCard({ exercise, userId, formExerciseId, toggleForm, remove }: ExerciseCardProps) {
  const logs = getLogs(userId, exercise.id);

  return (
    <Box p={3} borderWidth="1px" rounded="md">
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
          {formExerciseId === exercise.id ? "Hide Form" : "Log Progress"}
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
}

export default ExerciseCard;