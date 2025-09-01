import { useEffect, useState } from 'react';
import { fetchAllExercises, fetchExercisesByName, fetchExercisesByBodyPart, fetchExercisesByEquipment, fetchEquipmentList, fetchTargetList, fetchBodyPartList } from '../api/exerciseApi';
import { Box, Spinner, SimpleGrid, Text, Input, VStack, Button } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { Link } from 'react-router-dom';
import { SignInButton, SignOutButton, useAuth, useUser } from '@clerk/clerk-react';
import { saveExercise, removeExercise, getSavedExercises } from '../utils/savedExercises';
import type { Exercise } from '../types/exercise';

function Dashboard() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [equipment, setEquipment] = useState("");
  const [target, setTarget] = useState("");
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [bodyPartList, setBodyPartList] = useState<string[]>([]);
  const [targetList, setTargetList] = useState<string[]>([]);
  const [savedExercises, setSavedExercises] = useState<string[]>([]);


  useEffect(() => {
  const loadFilterLists = async () => {
    try {
      const [equipments, bodyParts, targets] = await Promise.all([
        fetchEquipmentList(),
        fetchBodyPartList(),
        fetchTargetList(),
      ]);
      setEquipmentList(equipments);
      setBodyPartList(bodyParts);
      setTargetList(targets);
    } catch (err) {
      setError("Can't load filter options");
    }
  };
  loadFilterLists();
  }, []);

    useEffect(() => {
    if (isSignedIn && user?.id) {
      const saved = getSavedExercises(user.id).map(ex => ex.id);
      setSavedExercises(saved);
    }
  }, [isSignedIn, user]);


  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        let data;
        if (search) {
          data = await fetchExercisesByName(search);
        } else if (bodyPart) {
          data = await fetchExercisesByBodyPart(bodyPart);
        } else if (equipment) {
          data = await fetchExercisesByEquipment(equipment);
        } else if (target) {
        data = await fetchAllExercises();
        data = data.filter((exercise: Exercise) => exercise.target === target);
      } else {
          data = await fetchAllExercises();
        }
        setExercises(data.slice(0, 10));
        setError(null);
      } catch (err) {
        setError("Can't load exercises");
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, [search, bodyPart, equipment, target]);

  const handleToggleSave = (exercise: Exercise) => {
    if (!user?.id) return;
    setSavedExercises((prev) => {
      if (prev.includes(exercise.id)) {
        removeExercise(user.id, exercise.id);
        return prev.filter((id) => id !== exercise.id);
      } else {
        saveExercise(user.id, exercise);
        return [...prev, exercise.id];
      }
    });
  };

  return (
    <Box p={4}>
      <VStack align="start" >
        <Box display="flex" justifyContent="space-between" w="100%">
          <Text fontSize="xl" fontWeight="bold">
            Exercises
          </Text>
          {isSignedIn ? (
            <SignOutButton>
              <Button colorScheme="red">Sign Out</Button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <Button colorScheme="blue">Sign In with Google</Button>
            </SignInButton>
          )}
        </Box>
        <Input
          placeholder="Search for exercises (e.g., pushups)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setBodyPart("");
            setEquipment("");
            setTarget("");
          }}
          maxW="300px"
        />
        <Select
          placeholder="Filter by body part"
          value={bodyPart}
          onChange={(e) => {
            setBodyPart(e.target.value);
            setSearch("");
            setEquipment("");
            setTarget("");
          }}
          maxW="300px"
        >
          {bodyPartList.map((part) => (
            <option key={part} value={part}>
              {part.charAt(0).toUpperCase() + part.slice(1)}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Filter by equipment"
          value={equipment}
          onChange={(e) => {
            setEquipment(e.target.value);
            setSearch("");
            setBodyPart("");
            setTarget("");
          }}
          maxW="300px"
        >
          {equipmentList.map((equip) => (
            <option key={equip} value={equip}>
              {equip.charAt(0).toUpperCase() + equip.slice(1)}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Filter by target muscle"
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            setSearch("");
            setBodyPart("");
            setEquipment("");
          }}
          maxW="300px"
        >
          {targetList.map((muscle) => (
            <option key={muscle} value={muscle}>
              {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
            </option>
          ))}
        </Select>
        {isSignedIn && (
          <Link to="/workouts">
            <Button colorScheme="teal">Go to My Workouts</Button>
          </Link>
        )}
      </VStack>
      {loading && <Spinner mt={4} />}
      {error && <Text color="red" mt={2}>{error}</Text>}
      {!loading && !error && exercises.length === 0 && (
        <Text mt={2}>No exercises found</Text>
      )}
      <SimpleGrid columns={[1, 2]} mt={4}>
        {exercises.map((exercise) => (
          <Box key={exercise.id} p={3} borderWidth="1px" rounded="md">
            <Link to={`/exercise/${exercise.id}`}>
              <Text fontWeight="bold">{exercise.name}</Text>
              <Text>Body Part: {exercise.bodyPart}</Text>
              <Text>Target: {exercise.target}</Text>
              <Text>Equipment: {exercise.equipment}</Text>
            </Link>
            {isSignedIn && (
              <Button
                mt={2}
                size="sm"
                colorScheme={savedExercises.includes(exercise.id) ? 'gray' : 'green'}
                onClick={() => handleToggleSave(exercise)}
              >
                {savedExercises.includes(exercise.id) ? 'Saved' : 'Save to My Workouts'}
              </Button>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;