import { useState, useEffect, useCallback } from 'react';
import { fetchExerciseImage } from '../api/exerciseApi';
import type { Exercise } from '../types/exercise';

const imageCache: Record<string, string> = {};

export const useExerciseImages = (exercises: Exercise[]) => {
  const [exerciseImages, setExerciseImages] = useState<
    Record<string, { url: string | null; isLoading: boolean; isError: boolean }>
  >({});

  useEffect(() => {
    const newImageMap: Record<string, { url: string | null; isLoading: boolean; isError: boolean }> = {};
    exercises.forEach((ex) => {
      if (!exerciseImages[ex.id] && !imageCache[ex.id]) {
        newImageMap[ex.id] = { url: null, isLoading: true, isError: false };
      }
    });
    if (Object.keys(newImageMap).length > 0) {
      setExerciseImages((prev) => ({ ...prev, ...newImageMap }));
    }
  }, [exercises]);

  const fetchImages = useCallback(async () => {
    const imageMap: Record<string, { url: string | null; isLoading: boolean; isError: boolean }> = {};
    await Promise.all(
      exercises.map(async (ex) => {
        if (!exerciseImages[ex.id]?.url && !imageCache[ex.id]) {
          try {
            const img = await fetchExerciseImage(360, ex.id);
            imageCache[ex.id] = img; // Cache the image
            imageMap[ex.id] = { url: img, isLoading: false, isError: false };
          } catch {
            imageMap[ex.id] = { url: './exercise.jpg', isLoading: false, isError: true };
          }
        } else if (imageCache[ex.id]) {
          imageMap[ex.id] = { url: imageCache[ex.id], isLoading: false, isError: false };
        }
      })
    );
    if (Object.keys(imageMap).length > 0) {
      setExerciseImages((prev) => ({ ...prev, ...imageMap }));
    }
  }, [exercises]);

  useEffect(() => {
    if (exercises.length > 0) {
      fetchImages();
    }
  }, [fetchImages]);

  return exerciseImages;
};