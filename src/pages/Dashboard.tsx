import { useEffect, useState } from "react";
import { fetchAllExercises, fetchExercisesByName } from "../api/exerciseApi";
import { Box, Spinner, SimpleGrid, Text, Input } from "@chakra-ui/react";

interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
}

function Dashboard() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        let data;
        if(search){
          data = await fetchExercisesByName(search);
        } else{
          data = await fetchAllExercises();
        }
        setExercises(data.slice(0, 10));
        setError(null);
      } catch (err) {
        setError("Failed to fetch exercises");
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [search]);


  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Exercises
      </Text>
      <Input
        placeholder="Search for exercises (e.g., pushups)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mt={2}
        maxW="300px"
      />
      {loading && <Spinner mt={4} />}
      {error && <Text color="red" mt={2}>{error}</Text>}
      {!loading && !error && exercises.length === 0 && (
        <Text mt={2}>No exercises found</Text>
      )}
      <SimpleGrid columns={[1, 2]} mt={4}>
        {exercises.map((exercise) => (
          <Box key={exercise.id} p={4} borderWidth="1px" rounded="lg" shadow="md">
            <Text fontWeight="bold">{exercise.name}</Text>
            <Text>Target: {exercise.target}</Text>
            <Text>Equipment: {exercise.equipment}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard