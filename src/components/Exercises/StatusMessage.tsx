import { Spinner, Text } from "@chakra-ui/react";
import type { Exercise } from "../../types/exercise";

interface StatusMessageProps {
  loading: boolean;
  error: string | null;
  exercise: Exercise | null;
}

function StatusMessage({ loading, error, exercise }: StatusMessageProps) {
  if (loading) return <Spinner mt={6} size="xl" color="red.500" />;
  if (error) return <Text color="red.400" mt={6} fontSize="lg" textAlign="center">{error}</Text>;
  if (!exercise) return <Text mt={6} color="gray.300" fontSize="lg" textAlign="center">Exercise not found</Text>;
  return null;
}

export default StatusMessage;