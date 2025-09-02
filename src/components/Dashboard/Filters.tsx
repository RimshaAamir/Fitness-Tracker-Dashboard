import { Flex, Input, Button } from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  bodyPart: string;
  setBodyPart: (value: string) => void;
  equipment: string;
  setEquipment: (value: string) => void;
  target: string;
  setTarget: (value: string) => void;
  bodyPartList: string[];
  equipmentList: string[];
  targetList: string[];
}

function Filters({
  search,
  setSearch,
  bodyPart,
  setBodyPart,
  equipment,
  setEquipment,
  target,
  setTarget,
  bodyPartList,
  equipmentList,
  targetList,
}: FiltersProps) {
  const { isSignedIn } = useAuth();

  return (
    <Flex wrap="wrap" gap={4}>
      <Input
        placeholder="Search exercises (e.g., pushups)"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setBodyPart("");
          setEquipment("");
          setTarget("");
        }}
        maxW="250px"
        borderRadius="lg"
        shadow="sm"
        _focus={{ borderColor: "teal.400", shadow: "md" }}
      />
      <Select
        placeholder="Filter by body part"
        value={bodyPart}
        onChange={(e) => {
          setBodyPart(e.target.value);
          setSearch("");
          setEquipment("");
          setTarget("");
        }}
        maxW="200px"
        borderRadius="lg"
      >
        {bodyPartList.map((part) => (
          <option key={part} value={part}>
            {part.charAt(0).toUpperCase() + part.slice(1)}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Filter by equipment"
        value={equipment}
        onChange={(e) => {
          setEquipment(e.target.value);
          setSearch("");
          setBodyPart("");
          setTarget("");
        }}
        maxW="200px"
        borderRadius="lg"
      >
        {equipmentList.map((equip) => (
          <option key={equip} value={equip}>
            {equip.charAt(0).toUpperCase() + equip.slice(1)}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Filter by target muscle"
        value={target}
        onChange={(e) => {
          setTarget(e.target.value);
          setSearch("");
          setBodyPart("");
          setEquipment("");
        }}
        maxW="200px"
        borderRadius="lg"
      >
        {targetList.map((muscle) => (
          <option key={muscle} value={muscle}>
            {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
          </option>
        ))}
      </Select>
      {isSignedIn && (
        <Link to="/workouts">
          <Button bgGradient="linear(to-r, teal.400, green.500)" color="white" _hover={{ opacity: 0.9 }}>
            My Workouts
          </Button>
        </Link>
      )}
    </Flex>
  );
}

export default Filters;