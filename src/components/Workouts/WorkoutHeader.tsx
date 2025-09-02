import { Box, Heading, Text } from "@chakra-ui/react";
import type { UserResource } from "@clerk/types"; 
interface WorkoutHeaderProps {
  user: UserResource | null; 
}

function WorkoutHeader({ user }: WorkoutHeaderProps) {
  return (
    <Box p={4}>
      <Heading size="lg">My Workouts</Heading>
      <Text mt={2}>Hello, {user?.firstName || "User"}!</Text>
    </Box>
  );
}

export default WorkoutHeader;