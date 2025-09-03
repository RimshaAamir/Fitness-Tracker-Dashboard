import { Flex, HStack, Text, Box, Link, Spacer, Icon } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaHome, FaDumbbell } from "react-icons/fa";
import AuthButton from "./AuthButton";

function Header() {
  return (
    <Box
      as="header"
      w="100%"
      bg="gray.900"
      color="white"
      px={{ base: 4, md: 8 }}
      py={4}
      boxShadow="md"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex align="center">
        {/* Logo / Brand */}
        <Text fontSize="2xl" fontWeight="bold" color="red.400">
          Exercise Library
        </Text>

        <Spacer />

        {/* Navigation + Auth */}
        <HStack gap={{ base: 4, md: 8 }} align="center">
          <Link
            as={NavLink}
            // @ts-ignore
            to="/"
            display="flex"
            alignItems="center"
            gap={2}
            _hover={{ color: "red.400" }}
            _activeLink={{ color: "red.500", fontWeight: "bold" }}
          >
            <Icon as={FaHome} boxSize={5} />
            <Text display={{ base: "none", md: "inline" }}>Home</Text>
          </Link>

          <Link
            as={NavLink}
            // @ts-ignore
            to="/workouts"
            display="flex"
            alignItems="center"
            gap={2}
            _hover={{ color: "red.400" }}
            _activeLink={{ color: "red.500", fontWeight: "bold" }}
          >
            <Icon as={FaDumbbell} boxSize={5} />
            <Text display={{ base: "none", md: "inline" }}>My Workouts</Text>
          </Link>

          {/* Auth Button */}
          <AuthButton />
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;
