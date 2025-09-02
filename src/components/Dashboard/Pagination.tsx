import { Flex, Button, Text } from '@chakra-ui/react';

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

function Pagination({ page, setPage, totalPages }: PaginationProps) {
  return (
    totalPages > 1 && (
      <Flex justify="center" mt={8} gap={4} align="center">
        <Button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Text>
          Page {page} of {totalPages}
        </Text>
        <Button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </Flex>
    )
  );
}

export default Pagination;