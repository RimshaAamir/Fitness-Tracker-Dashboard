import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchAllExercises,
  fetchExercisesByName,
  fetchExercisesByBodyPart,
  fetchExercisesByEquipment,
  fetchExercisesByTarget,
} from '../api/exerciseApi';
import type { Exercise } from '../types/exercise';

interface ExerciseData {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}

export const useExerciseData = (
  search: string,
  bodyPart: string,
  equipment: string,
  target: string,
  page: number,
  pageSize: number
): ExerciseData & { totalPages: number } => {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      let data: Exercise[];
      if (search) {
        data = await fetchExercisesByName(search);
      } else if (bodyPart) {
        data = await fetchExercisesByBodyPart(bodyPart);
      } else if (equipment) {
        data = await fetchExercisesByEquipment(equipment);
      } else if (target) {
        data = await fetchExercisesByTarget(target);
      } else {
        data = await fetchAllExercises();
      }
      setAllExercises(data);
      setError(null);
    } catch {
      setError("Can't load exercises");
    } finally {
      setLoading(false);
    }
  }, [search, bodyPart, equipment, target]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allExercises.slice(start, start + pageSize);
  }, [allExercises, page, pageSize]);

  return {
    exercises: paginatedExercises,
    loading,
    error,
    totalPages: Math.ceil(allExercises.length / pageSize),
  };
};
