import { useQueries } from "@tanstack/react-query";
import { fetchExerciseImage } from "../api/exerciseApi";
import type { Exercise } from "../types/exercise";

export const useExerciseImages = (exercises: Exercise[]) => {
  const results = useQueries({
    queries: exercises.map((ex) => ({
      queryKey: ["exerciseImage", ex.id],
      queryFn: async () => {
        try {
          return await fetchExerciseImage(360, ex.id);
        } catch {
          return "./exercise.jpg";
        }
      },
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    })),
  });

  const exerciseImages: Record<
    string,
    { url: string | null; isLoading: boolean; isError: boolean }
  > = {};

  exercises.forEach((ex, idx) => {
    const r = results[idx];
    exerciseImages[ex.id] = {
      url: r.data ?? null,
      isLoading: r.isLoading,
      isError: r.isError,
    };
  });

  return exerciseImages;
};
