import { useState } from "react";
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { addLog } from "../../utils/progressLogs";
import { useWorkoutContext } from "../../context/WorkoutContext";

function ProgressForm() {
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [weight, setWeight] = useState("");

  const { userId, formExerciseId, toggleForm, refreshExercises } =
    useWorkoutContext();

  if (!formExerciseId) return null;

  const handleSave = () => {
    if (reps && sets && weight) {
      addLog(userId, formExerciseId, Number(reps), Number(sets), Number(weight));
      refreshExercises();
      toggleForm(formExerciseId);
    }
  };

  return (
    <VStack mt={4} align="start">
      <Input
        type="number"
        placeholder="Sets (e.g., 3)"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Reps (e.g., 10)"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Weight (kg, e.g., 20)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <Box>
        <Button
          size="sm"
          colorScheme="green"
          onClick={handleSave}
          disabled={!reps || !sets || !weight}
        >
          Save
        </Button>
        <Button size="sm" ml={2} onClick={() => toggleForm(formExerciseId)}>
          Cancel
        </Button>
      </Box>
    </VStack>
  );
}

export default ProgressForm;
