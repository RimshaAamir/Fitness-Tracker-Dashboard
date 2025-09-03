import { Box, Flex, Text, Link, Icon, Stack } from "@chakra-ui/react";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <Box bg="gray.900" color="gray.300" py={10} px={6} mt="auto">
      <Flex
        direction={["column", "row"]}
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
        gap={6}
      >
        {/* Info Section */}
        <Stack gap={2} textAlign={["center", "left"]}>
          <Text fontSize="lg" fontWeight="bold" color="white">
            Exercise Library
          </Text>
          <Text fontSize="sm" maxW="400px">
            A fitness companion to explore exercises, track progress, and stay motivated
            on your health journey.
          </Text>
        </Stack>

        {/* Social Links */}
        <Flex gap={5}>
          <Link href="https://github.com/RimshaAamir" isExternal>
            <Icon as={FaGithub} boxSize={6} _hover={{ color: "red.400" }} />
          </Link>
          <Link href="https://twitter.com" isExternal>
            <Icon as={FaTwitter} boxSize={6} _hover={{ color: "red.400" }} />
          </Link>
          <Link href="https://instagram.com" isExternal>
            <Icon as={FaInstagram} boxSize={6} _hover={{ color: "red.400" }} />
          </Link>
          <Link href="https://linkedin.com" isExternal>
            <Icon as={FaLinkedin} boxSize={6} _hover={{ color: "red.400" }} />
          </Link>
        </Flex>
      </Flex>

      {/* Bottom Line */}
      <Text
        fontSize="xs"
        textAlign="center"
        mt={8}
        borderTop="1px solid"
        borderColor="gray.700"
        pt={4}
        color="gray.500"
      >
        © {new Date().getFullYear()} Exercise Library. All rights reserved.
      </Text>
    </Box>
  );
}

export default Footer;
