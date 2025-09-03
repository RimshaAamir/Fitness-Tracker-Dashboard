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
import { saveExercise, removeExercise } from '../utils/savedExercises';
import Header from '../components/Dashboard/Header';
import Filters from '../components/Dashboard/Filters';
import Results from '../components/Dashboard/Results';
import Pagination from '../components/Dashboard/Pagination';
import { Box } from '@chakra-ui/react';
import type { Exercise } from '../types/exercise';
import { useUser } from '@clerk/clerk-react';
import { useColorMode } from '../components/ui/color-mode';

function Dashboard() {
  const { user } = useUser();
  const { setColorMode } = useColorMode();
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
              imageMap[ex.id] = "./exercise.jpg";
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
              imageMap[ex.id] = "./exercise.jpg";
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
    <Box p={6} bg="black" minH="100vh" color="white">
      <Header />
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
  );
}

export default Dashboard; 