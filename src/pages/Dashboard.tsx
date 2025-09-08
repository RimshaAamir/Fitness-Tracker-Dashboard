import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '../components/Dashboard/DashboardHeader.tsx';
import Filters from '../components/Dashboard/Filters.tsx';
import Results from '../components/Dashboard/CardsList.tsx';
import Pagination from '../components/Dashboard/Pagination.tsx';
import { useUser } from '@clerk/clerk-react';
import { useColorMode } from '../components/ui/color-mode';
import useDebounce from '../hooks/useDebounce.ts';
import { useExerciseData } from '../hooks/useExerciseData';
import { useExerciseImages } from '../hooks/useExerciseImages';
import { useFilterLists } from '../hooks/useFilterLists';
import { useSavedExercises } from '../hooks/useSavedExercises';

function Dashboard() {
  const { user } = useUser();
  const { setColorMode } = useColorMode();

  const [filters, setFilters] = useState({
    search: '',
    bodyPart: '',
    equipment: '',
    target: '',
  });

  const [page, setPage] = useState(1);
  const pageSize = 9;
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);

  const { equipmentList, bodyPartList, targetList, error: filterError } = useFilterLists();

  const { exercises, loading, error: exerciseError, totalPages } = useExerciseData(
    debouncedSearch,
    filters.bodyPart,
    filters.equipment,
    filters.target,
    page,
    pageSize
  );

  const exerciseImages = useExerciseImages(exercises);

  const { savedExercises, handleToggleSave } = useSavedExercises(user);

  return (
    <Box bg="black" minH="100vh" color="white">
      <Header />
      <Box p={6}>
        <Filters
          search={filters.search}
          setSearch={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          bodyPart={filters.bodyPart}
          setBodyPart={(val) => setFilters((prev) => ({ ...prev, bodyPart: val }))}
          equipment={filters.equipment}
          setEquipment={(val) => setFilters((prev) => ({ ...prev, equipment: val }))}
          target={filters.target}
          setTarget={(val) => setFilters((prev) => ({ ...prev, target: val }))}
          bodyPartList={bodyPartList}
          equipmentList={equipmentList}
          targetList={targetList}
        />
        <Results
          loading={loading && exercises.length === 0} 
          error={exerciseError || filterError}
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
