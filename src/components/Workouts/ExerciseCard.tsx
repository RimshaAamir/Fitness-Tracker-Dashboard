import { Box, Text, Button, Flex, Icon } from "@chakra-ui/react";
import { FaUser, FaBullseye, FaDumbbell } from "react-icons/fa";
import type { Exercise } from "../../types/exercise";
import { getLogs } from "../../utils/progressLogs";
import ProgressForm from "../Workouts/ProgressForm";

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
    <Box
      p={4}
      rounded="2xl"
      bg="gray.800"
      color="white"
      borderColor="gray.600"
      borderWidth="1px"
      _hover={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500", transform: "translateY(-2px)" }}
      transition="all 0.2s"
      maxW="400px" 
    >
      <Text fontWeight="bold" fontSize="lg" color="white" mb={3}>
        {exercise.name}
      </Text>
      <Flex align="center" mt={1}>
        <Icon as={FaUser} mr={2} color="red.500" />
        <Text color="gray.300">Body Part: {exercise.bodyPart}</Text>
      </Flex>
      <Flex align="center" mt={1}>
        <Icon as={FaBullseye} mr={2} color="red.500" />
        <Text color="gray.300">Target: {exercise.target}</Text>
      </Flex>
      <Flex align="center" mt={1}>
        <Icon as={FaDumbbell} mr={2} color="red.500" />
        <Text color="gray.300">Equipment: {exercise.equipment}</Text>
      </Flex>
      {logs.length > 0 && (
        <Box mt={3}>
          <Text fontWeight="semibold" color="white">Progress Logs:</Text>
          {logs.map((log, index) => (
            <Text key={index} fontSize="sm" ml={2} color="gray.300">
              {log.sets} sets, {log.reps} reps, {log.weight} kg
            </Text>
          ))}
        </Box>
      )}
      <Flex mt={3} gap={2} wrap="wrap">
        <Button
          size="sm"
          flex="1"
          minW="120px"
          borderRadius="2xl"
          bg={formExerciseId === exercise.id ? "gray.600" : "red.500"}
          color="white"
          _hover={{ bg: formExerciseId === exercise.id ? "gray.700" : "red.600" }}
          _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
          onClick={() => toggleForm(exercise.id)}
        >
          {formExerciseId === exercise.id ? "Hide Form" : "Log Progress"}
        </Button>
        <Button
          size="sm"
          flex="1"
          minW="120px"
          borderRadius="2xl"
          bg="gray.600"
          color="white"
          _hover={{ bg: "gray.700" }}
          _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
          onClick={() => remove(exercise.id)}
        >
          Remove
        </Button>
      </Flex>
      {formExerciseId === exercise.id && <ProgressForm />}
    </Box>
  );
}

export default ExerciseCard;