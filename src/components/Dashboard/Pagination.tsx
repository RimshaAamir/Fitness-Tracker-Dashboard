import { Flex, Button, Text } from '@chakra-ui/react';

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

function Pagination({ page, setPage, totalPages }: PaginationProps) {
  return (
    totalPages > 1 && (
      <Flex justify="center" mt={8} gap={4} align="center" bg="black" color="white">
        <Button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          bg="red.500"
          color="white"
          borderRadius="2xl"
          _hover={{ bg: "red.600" }}
          _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
          _disabled={{ bg: "gray.600", cursor: "not-allowed" }}
        >
          Previous
        </Button>
        <Text color="white">
          Page {page} of {totalPages}
        </Text>
        <Button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          bg="red.500"
          color="white"
          borderRadius="2xl"
          _hover={{ bg: "red.600" }}
          _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
          _disabled={{ bg: "gray.600", cursor: "not-allowed" }}
        >
          Next
        </Button>
      </Flex>
    )
  );
}

export default Pagination;