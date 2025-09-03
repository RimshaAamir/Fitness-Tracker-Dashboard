import { SignInButton, SignOutButton, useAuth } from '@clerk/clerk-react';
import { Flex, Text, Button, VStack, Image, Box } from '@chakra-ui/react';

function Header() {
  const { isSignedIn } = useAuth();

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
        justify="flex-end"
        align="center"
        w="100%"
        h="100%"
        pr={10}
      >
        <VStack align="end" gap={4} mr={20}>
          <Text fontSize="4xl" fontWeight="bold" color="white" textShadow="0 0 5px rgba(0, 0, 0, 0.7)">
            Exercise Library
          </Text>
          {isSignedIn ? (
            <SignOutButton>
              <Button
                bg="red.500"
                color="white"
                borderRadius="2xl"
                _hover={{ bg: "red.600" }}
                _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
              >
                Sign Out
              </Button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <Button
                bg="red.500"
                color="white"
                borderRadius="2xl"
                _hover={{ bg: "red.600" }}
                _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
              >
                Sign In with Google
              </Button>
            </SignInButton>
          )}
        </VStack>
      </Flex>
    </Box>
  );
}

export default Header;