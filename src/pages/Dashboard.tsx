import { useEffect, useState } from 'react';
import {
  fetchAllExercises,
  fetchExercisesByName,
  fetchExercisesByBodyPart,
  fetchExercisesByEquipment,
  fetchEquipmentList,
  fetchTargetList,
  fetchBodyPartList,
  fetchExerciseImage,
} from '../api/exerciseApi';
import {
  Box,
  Spinner,
  SimpleGrid,
  Text,
  Input,
  VStack,
  Button,
  Image,
  Flex,
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { Link } from 'react-router-dom';
import { SignInButton, SignOutButton, useAuth, useUser } from '@clerk/clerk-react';
import { saveExercise, removeExercise, getSavedExercises } from '../utils/savedExercises';
import type { Exercise } from '../types/exercise';

function Dashboard() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseImages, setExerciseImages] = useState<Record<string, string>>({});
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
  const [page, setPage] = useState(1);
  const pageSize = 9; 

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
      } catch {
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

        setAllExercises(data);
        setError(null);
        setPage(1); 
        const firstPageData = data.slice(0, pageSize);
        const imageMap: Record<string, string> = {};
        await Promise.all(
          firstPageData.map(async (ex: Exercise) => {
            try {
              const img = await fetchExerciseImage(360, ex.id);
              imageMap[ex.id] = img;
            } catch {
              imageMap[ex.id] = "";
            }
          })
        );
        setExerciseImages(imageMap);
      } catch {
        setError("Can't load exercises");
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, [search, bodyPart, equipment, target]);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentPageData = allExercises.slice(start, end);
    setExercises(currentPageData);
    const loadImages = async () => {
      const imageMap: Record<string, string> = {};
      await Promise.all(
        currentPageData.map(async (ex: Exercise) => {
          if (!exerciseImages[ex.id]) {
            try {
              const img = await fetchExerciseImage(360, ex.id);
              imageMap[ex.id] = img;
            } catch {
              imageMap[ex.id] = "";
            }
          }
        })
      );
      setExerciseImages(prev => ({ ...prev, ...imageMap }));
    };
    if (currentPageData.length > 0) loadImages();
  }, [page, allExercises]);

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

  const totalPages = Math.ceil(allExercises.length / pageSize);

  return (
    <Box p={6} bgGradient="linear(to-b, gray.50, white)" minH="100vh">
      {/* HEADER */}
      <VStack align="start">
        <Flex justify="space-between" w="100%" align="center">
          <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, teal.400, blue.500)" bgClip="text">
            Exercise Library
          </Text>
          {isSignedIn ? (
            <SignOutButton>
              <Button bgGradient="linear(to-r, red.400, red.600)" color="white" _hover={{ opacity: 0.9 }}>
                Sign Out
              </Button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <Button bgGradient="linear(to-r, blue.400, teal.500)" color="white" _hover={{ opacity: 0.9 }}>
                Sign In with Google
              </Button>
            </SignInButton>
          )}
        </Flex>

        {/* FILTERS */}
        <Flex wrap="wrap" gap={4}>
          <Input
            placeholder="Search exercises (e.g., pushups)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setBodyPart("");
              setEquipment("");
              setTarget("");
            }}
            maxW="250px"
            borderRadius="lg"
            shadow="sm"
            _focus={{ borderColor: "teal.400", shadow: "md" }}
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
            maxW="200px"
            borderRadius="lg"
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
            maxW="200px"
            borderRadius="lg"
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
            maxW="200px"
            borderRadius="lg"
          >
            {targetList.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </option>
            ))}
          </Select>
          {isSignedIn && (
            <Link to="/workouts">
              <Button bgGradient="linear(to-r, teal.400, green.500)" color="white" _hover={{ opacity: 0.9 }}>
                My Workouts
              </Button>
            </Link>
          )}
        </Flex>
      </VStack>

      {/* RESULTS */}
      {loading && <Spinner mt={6} size="xl" color="teal.400" />}
      {error && <Text color="red.500" mt={4}>{error}</Text>}
      {!loading && !error && exercises.length === 0 && (
        <Text mt={4} color="gray.500">No exercises found</Text>
      )}

      <SimpleGrid columns={[1, 2, 3]} mt={6}>
        {exercises.map((exercise) => (
          <Box
            key={exercise.id}
            p={4}
            rounded="2xl"
            shadow="md"
            borderWidth="1px"
            bg="white"
            _hover={{ shadow: "xl", transform: "scale(1.02)" }}
            transition="all 0.2s ease"
          >
            <Link to={`/exercise/${exercise.id}`}>
              {exerciseImages[exercise.id] && (
                <Image
                  src={exerciseImages[exercise.id]}
                  alt={exercise.name}
                  borderRadius="lg"
                  mb={3}
                  objectFit="cover"
                  h="180px"
                  w="100%"
                />
              )}
              <Text fontWeight="bold" fontSize="lg">{exercise.name}</Text>
              <Text color="gray.600">Body Part: {exercise.bodyPart}</Text>
              <Text color="gray.600">Target: {exercise.target}</Text>
              <Text color="gray.600">Equipment: {exercise.equipment}</Text>
            </Link>
            {isSignedIn && (
              <Button
                mt={3}
                size="sm"
                w="full"
                borderRadius="md"
                bg={savedExercises.includes(exercise.id) ? "gray.400" : "teal.400"}
                color="white"
                _hover={{ opacity: 0.9 }}
                onClick={() => handleToggleSave(exercise)}
              >
                {savedExercises.includes(exercise.id) ? 'Saved' : 'Save to My Workouts'}
              </Button>
            )}
          </Box>
        ))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Flex justify="center" mt={8} gap={4} align="center">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Text>
            Page {page} of {totalPages}
          </Text>
          <Button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </Flex>
      )}
    </Box>
  );
}

export default Dashboard;
