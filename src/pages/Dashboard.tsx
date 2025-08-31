import { useEffect, useState } from "react";
import { fetchAllExercises } from "../api/exerciseApi";
import { Box, Spinner, SimpleGrid, Text } from "@chakra-ui/react";

interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  gifUrl: string;
}

function Dashboard() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchAllExercises();
        setExercises(data.slice(0, 20));
      } catch (err) {
        setError("Failed to fetch exercises");
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Exercises
      </Text>

      <SimpleGrid columns={[1, 2, 3]}>
        {exercises.map((ex) => (
          <Box key={ex.id} p={4} borderWidth="1px" rounded="lg" shadow="md">
            <Text fontWeight="bold">{ex.name}</Text>
            <Text>Target: {ex.target}</Text>
            <Text>Equipment: {ex.equipment}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard