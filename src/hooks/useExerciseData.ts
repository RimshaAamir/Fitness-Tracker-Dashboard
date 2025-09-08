import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
  totalPages: number;
}

export const useExerciseData = (
  search: string,
  bodyPart: string,
  equipment: string,
  target: string,
  page: number,
  pageSize: number
): ExerciseData => {
  const queryKey = ["exercises", { search, bodyPart, equipment, target }];

  const { data = [], isLoading, isError, error } = useQuery<Exercise[]>({
    queryKey,
    queryFn: async () => {
      if (search) {
        return await fetchExercisesByName(search);
      } else if (bodyPart) {
        return await fetchExercisesByBodyPart(bodyPart);
      } else if (equipment) {
        return await fetchExercisesByEquipment(equipment);
      } else if (target) {
        return await fetchExercisesByTarget(target);
      } else {
        return await fetchAllExercises();
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev ?? [],
  });

  const paginatedExercises = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return {
    exercises: paginatedExercises,
    loading: isLoading,
    error: isError ? (error?.message ?? "Can't load exercises") : null,
    totalPages: Math.ceil(data.length / pageSize),
  };
};
