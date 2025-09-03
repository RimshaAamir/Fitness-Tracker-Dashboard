
import { SignInButton, SignOutButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@chakra-ui/react";

function AuthButton() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <SignOutButton>
        <Button
          bg="red.500"
          color="white"
          borderRadius="full"
          px={6}
          py={2}
          fontWeight="bold"
          _hover={{ bg: "red.600", transform: "scale(1.05)" }}
          _active={{ bg: "red.700" }}
          transition="all 0.2s ease-in-out"
        >
          Sign Out
        </Button>
      </SignOutButton>
    );
  }

  return (
    <SignInButton mode="modal">
      <Button
        bg="red.500"
        color="white"
        borderRadius="full"
        px={6}
        py={2}
        fontWeight="bold"
        _hover={{ bg: "red.600", transform: "scale(1.05)" }}
        _active={{ bg: "red.700" }}
        transition="all 0.2s ease-in-out"
      >
        Sign In
      </Button>
    </SignInButton>
  );
}

export default AuthButton;
