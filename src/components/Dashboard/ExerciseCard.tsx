import { Box, Image, Button, Flex, Text, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { FaUser, FaBullseye, FaDumbbell } from 'react-icons/fa';
import { memo } from 'react';
import type { Exercise } from '../../types/exercise';

const cardStyles = {
  container: {
    p: 4,
    rounded: "2xl",
    bg: "gray.800",
    color: "white",
    borderColor: "gray.600",
    borderWidth: "1px",
    _hover: { borderColor: "red.500", boxShadow: "0 0 0 1px red.500" },
  },
  image: {
    borderRadius: "lg",
    mb: 3,
    objectFit: "cover",
    h: "180px",
    w: "100%",
  },
    button: {
    mt: 3,
    w: "full",
    borderRadius: "2xl",
    bg: "red.500",
    color: "white",
    _hover: { bg: "red.600" },
    _focus: { boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" },
  },
};

interface ExerciseCardProps {
  exercise: Exercise;
  image: string | null;
  isImageLoading: boolean;
  isImageError: boolean;
  isSaved: boolean;
  handleToggleSave: (exercise: Exercise) => void;
}

const ExerciseCard = memo(
  ({ exercise, image, isImageLoading, isImageError, isSaved, handleToggleSave }: ExerciseCardProps) => {
    const { isSignedIn } = useAuth();

    return (
      <Box {...cardStyles.container}>
        <Link to={`/exercise/${exercise.id}`}>
          {isImageLoading && (
            <Spinner
              size="lg"
              color="red.500"
              display="block"
              mx="auto"
              mb={3}
              h="180px"
            />
          )}
          {!isImageLoading && (
            <Image
              src={isImageError ? "../../public/exercise.jpg" : image || "../../public/exercise.jpg"}
              alt={exercise.name}
              {...cardStyles.image}
              loading="lazy"
            />
          )}
          <Text fontWeight="bold" fontSize="lg" color="white">{exercise.name}</Text>
          <Flex align="center" mt={1}>
            <Box mr={2} color="red.500"><FaUser /></Box>
            <Text color="gray.300">Body Part: {exercise.bodyPart}</Text>
          </Flex>
          <Flex align="center" mt={1}>
            <Box mr={2} color="red.500"><FaBullseye /></Box>
            <Text color="gray.300">Target: {exercise.target}</Text>
          </Flex>
          <Flex align="center" mt={1}>
            <Box mr={2} color="red.500"><FaDumbbell /></Box>
            <Text color="gray.300">Equipment: {exercise.equipment}</Text>
          </Flex>
        </Link>
        {isSignedIn && (
        <Button
            size="sm"
            {...cardStyles.button}
            bg={isSaved ? "gray.600" : "red.500"}
            _hover={{ bg: isSaved ? "gray.700" : "red.600" }}
            onClick={() => handleToggleSave(exercise)}
            >
            {isSaved ? 'Saved' : 'Save to My Workouts'}
        </Button>

        )}
      </Box>
    );
  }
);

export default ExerciseCard;