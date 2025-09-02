import { Spinner, Text } from "@chakra-ui/react";
import type { Exercise } from "../../types/exercise";

interface StatusMessageProps {
  loading: boolean;
  error: string | null;
  exercise: Exercise | null;
}

function StatusMessage({ loading, error, exercise }: StatusMessageProps) {
  if (loading) return <Spinner mt={4} />;
  if (error) return <Text color="red" mt={2}>{error}</Text>;
  if (!exercise) return <Text mt={2}>Exercise not found</Text>;
  return null;
}

export default StatusMessage;