import { Box, Text, SimpleGrid, Image, Button, Flex, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaUser, FaBullseye, FaDumbbell } from "react-icons/fa";
import type { Exercise } from "../../types/exercise";

interface SuggestedExercisesProps {
  suggestedExercises: Exercise[];
  suggestedImages: Record<string, string>;
  savedExercises: string[];
  handleToggleSave: (exercise: Exercise) => void;
}

function SuggestedExercises({
  suggestedExercises,
  suggestedImages,
  savedExercises,
  handleToggleSave,
}: SuggestedExercisesProps) {
  if (suggestedExercises.length === 0) return null;

  return (
    <Box mt={8} maxW="1200px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" color="white" mb={4}>
        Suggested Exercises
      </Text>
      <SimpleGrid columns={[1, 2, 3]} gap={6}>
        {suggestedExercises.map((ex) => (
          <Box
            key={ex.id}
            p={4}
            rounded="2xl"
            bg="gray.800"
            color="white"
            borderColor="gray.600"
            borderWidth="1px"
            _hover={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            <Link to={`/exercise/${ex.id}`}>
              <Image
                src={suggestedImages[ex.id] || "/exercise.jpg"}
                alt={ex.name}
                borderRadius="lg"
                mb={3}
                objectFit="cover"
                h="180px"
                w="100%"
              />
              <Text fontWeight="bold" fontSize="lg" color="white">
                {ex.name}
              </Text>
              <Flex align="center" mt={1}>
                <Icon as={FaUser} mr={2} color="red.500" />
                <Text color="gray.300">Body Part: {ex.bodyPart}</Text>
              </Flex>
              <Flex align="center" mt={1}>
                <Icon as={FaBullseye} mr={2} color="red.500" />
                <Text color="gray.300">Target: {ex.target}</Text>
              </Flex>
              <Flex align="center" mt={1}>
                <Icon as={FaDumbbell} mr={2} color="red.500" />
                <Text color="gray.300">Equipment: {ex.equipment}</Text>
              </Flex>
            </Link>
            <Button
              mt={3}
              size="sm"
              w="full"
              borderRadius="2xl"
              bg={savedExercises.includes(ex.id) ? "gray.600" : "red.500"}
              color="white"
              _hover={{ bg: savedExercises.includes(ex.id) ? "gray.700" : "red.600" }}
              _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
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
