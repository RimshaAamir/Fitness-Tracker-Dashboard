import { Box, Heading, Text, Image, Flex } from "@chakra-ui/react";
import type { UserResource } from "@clerk/types";

interface WorkoutHeaderProps {
  user: UserResource | null; 
}

function WorkoutHeader({ user }: WorkoutHeaderProps) {
  return (
    <Box position="relative" w="100%" h="300px" mb={6}>
      <Image
        src="/header.jpg"
        alt="Header Background"
        objectFit="cover"
        w="100%"
        h="100%"
        position="absolute"
        zIndex="0"
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bg="rgba(0, 0, 0, 0.6)"
        zIndex="1"
      />
      <Flex
        position="absolute"
        zIndex="2"
        justify="center"
        align="center"
        w="100%"
        h="100%"
        direction="column"
      >
        <Heading size="2xl" color="white" textShadow="0 0 5px rgba(0, 0, 0, 0.7)" mb={2}>
          My Workouts
        </Heading>
        <Text fontSize="lg" color="gray.300">
          Hello, {user?.firstName || "User"}! Track your progress here.
        </Text>
      </Flex>
    </Box>
  );
}

export default WorkoutHeader;