import { useEffect, useState  , useCallback } from 'react';
import {
  fetchAllExercises,
  fetchExercisesByName,
  fetchExercisesByBodyPart,
  fetchExercisesByEquipment,
  fetchEquipmentList,
  fetchTargetList,
  fetchBodyPartList,
  fetchExerciseImage,
  fetchExercisesByTarget,
} from '../api/exerciseApi';
import { saveExercise, removeExercise, getSavedExercises } from '../utils/savedExercises';
import Header from '../components/Dashboard/DashboardHeader.tsx';
import Filters from '../components/Dashboard/Filters.tsx';
import Results from '../components/Dashboard/CardsList.tsx';
import Pagination from '../components/Dashboard/Pagination.tsx';
import { Box } from '@chakra-ui/react';
import type { Exercise } from '../types/exercise';
import { useUser } from '@clerk/clerk-react';
import { useColorMode } from '../components/ui/color-mode';
import useDebounce from '../hooks/useDebounce.ts';

function Dashboard() {
  const { user } = useUser();
  const { setColorMode } = useColorMode();
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const {isSignedIn} = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
   const [exerciseImages, setExerciseImages] = useState<
    Record<string, { url: string | null; isLoading: boolean; isError: boolean }>
  >({});
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
  const debouncedSearch = useDebounce(search, 300); 

  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);

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
      const saved = getSavedExercises(user.id).map((ex) => ex.id);
      setSavedExercises(saved);
    }
  }, [isSignedIn, user]);

useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        let data;
        if (debouncedSearch) {
          console.log("📡 API Call → fetchExercisesByName with:", debouncedSearch);
          data = await fetchExercisesByName(debouncedSearch);
        } else if (bodyPart) {
          data = await fetchExercisesByBodyPart(bodyPart);
        } else if (equipment) {
          data = await fetchExercisesByEquipment(equipment);
        } else if (target) {
          data = await fetchExercisesByTarget(target);
        } else {
          data = await fetchAllExercises();
        }
        console.log("✅ API Response →", data.length, "items");
        setAllExercises(data);
        setError(null);
        const firstPageData = data.slice(0, pageSize);
        const imageMap: Record<string, { url: string | null; isLoading: boolean; isError: boolean }> = {};
        await Promise.all(
          firstPageData.map(async (ex: Exercise) => {
            try {
              setExerciseImages((prev) => ({
                ...prev,
                [ex.id]: { url: null, isLoading: true, isError: false },
              }));
              const img = await fetchExerciseImage(360, ex.id);
              imageMap[ex.id] = { url: img, isLoading: false, isError: false };
            } catch {
              imageMap[ex.id] = { url: "./exercise.jpg", isLoading: false, isError: true };
            }
          })
        );
        setExerciseImages((prev) => ({ ...prev, ...imageMap }));
      } catch {
        setError("Can't load exercises");
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, [debouncedSearch, bodyPart, equipment, target]);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentPageData = allExercises.slice(start, end);
    setExercises(currentPageData);
    const loadImages = async () => {
      const imageMap: Record<string, { url: string | null; isLoading: boolean; isError: boolean }> = {};
      await Promise.all(
        currentPageData.map(async (ex: Exercise) => {
          if (!exerciseImages[ex.id]) {
            try {
              setExerciseImages((prev) => ({
                ...prev,
                [ex.id]: { url: null, isLoading: true, isError: false },
              }));
              const img = await fetchExerciseImage(360, ex.id);
              imageMap[ex.id] = { url: img, isLoading: false, isError: false };
            } catch {
              imageMap[ex.id] = { url: "./exercise.jpg", isLoading: false, isError: true };
            }
          }
        })
      );
      setExerciseImages((prev) => ({ ...prev, ...imageMap }));
    };
    if (currentPageData.length > 0) loadImages();
  }, [page, allExercises]);

  const handleToggleSave = useCallback((exercise: Exercise) => {
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
  }, [user]);

  const totalPages = Math.ceil(allExercises.length / pageSize);

  return (
    <Box bg="black" minH="100vh" color="white">
      <Header />
      <Box p={6}>
      <Filters
        search={search}
        setSearch={setSearch}
        bodyPart={bodyPart}
        setBodyPart={setBodyPart}
        equipment={equipment}
        setEquipment={setEquipment}
        target={target}
        setTarget={setTarget}
        bodyPartList={bodyPartList}
        equipmentList={equipmentList}
        targetList={targetList}
      />
      <Results
        loading={loading}
        error={error}
        exercises={exercises}
        exerciseImages={exerciseImages}
        savedExercises={savedExercises}
        handleToggleSave={handleToggleSave}
      />
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </Box>
    </Box>
  );
}

export default Dashboard; 