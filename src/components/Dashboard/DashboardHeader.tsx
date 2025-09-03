import { Flex, Text, VStack, Image, Box } from "@chakra-ui/react";

function DashboardHeader() {
  return (
    <Box position="relative" w="100%" h="600px">
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
        px={10}
      >
        <VStack align="center" gap={4}>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="white"
            textShadow="0 0 5px rgba(0, 0, 0, 0.7)"
          >
            Exercise Library
          </Text>
          <Text
            fontSize="lg"
            color="gray.200"
            maxW="600px"
            textAlign="center"
          >
            Explore and track exercises to boost your fitness journey
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}

export default DashboardHeader;

