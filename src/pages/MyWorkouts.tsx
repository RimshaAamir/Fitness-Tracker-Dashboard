import { Box, Heading, Text } from '@chakra-ui/react';
import { useAuth, useUser } from '@clerk/clerk-react';

function MyWorkouts() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Text>You need to be signed in to view this page.</Text>;
  }

  return (
    <Box p={4}>
      <Heading>My Workouts</Heading>
      <Text mt={2}>Welcome, {user?.firstName || 'User'}!</Text>
      <Text>This is your workouts page. Saved exercises will appear here.</Text>
    </Box>
  );
}

export default MyWorkouts;