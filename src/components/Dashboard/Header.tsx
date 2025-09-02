import { SignInButton, SignOutButton, useAuth } from '@clerk/clerk-react';
import { Flex, Text, Button, VStack } from '@chakra-ui/react';

function Header() {
  const { isSignedIn } = useAuth();

  return (
    <VStack align="start">
      <Flex justify="space-between" w="100%" align="center">
        <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, teal.400, blue.500)" bgClip="text">
          Exercise Library
        </Text>
        {isSignedIn ? (
          <SignOutButton>
            <Button bgGradient="linear(to-r, red.400, red.600)" color="white" _hover={{ opacity: 0.9 }}>
              Sign Out
            </Button>
          </SignOutButton>
        ) : (
          <SignInButton mode="modal">
            <Button bgGradient="linear(to-r, blue.400, teal.500)" color="white" _hover={{ opacity: 0.9 }}>
              Sign In with Google
            </Button>
          </SignInButton>
        )}
      </Flex>
    </VStack>
  );
}

export default Header;