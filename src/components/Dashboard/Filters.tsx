import { Flex, Input, Button, Box, Select, Portal, createListCollection } from '@chakra-ui/react';
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
  const bodyPartCollection = createListCollection({
    items: bodyPartList.map(part => ({
      label: part.charAt(0).toUpperCase() + part.slice(1),
      value: part
    }))
  });

  const equipmentCollection = createListCollection({
    items: equipmentList.map(equip => ({
      label: equip.charAt(0).toUpperCase() + equip.slice(1),
      value: equip
    }))
  });

  const targetCollection = createListCollection({
    items: targetList.map(muscle => ({
      label: muscle.charAt(0).toUpperCase() + muscle.slice(1),
      value: muscle
    }))
  });

  const selectControlStyles = {
    borderRadius: "2xl",
    bg: "gray.800",
    borderColor: "gray.600",
    _focus: { borderColor: "red.500", boxShadow: "0 0 0 1px red.500" },
    _hover: { borderColor: "red.400" },
  };

  const selectContentStyles = {
    bg: "gray.800",
    borderColor: "gray.600",
    borderRadius: "xl",
  };

  const selectItemStyles = {
    bg: "gray.800",
    color: "white",
    _hover: { bg: "red.500" },
    _focus: { bg: "red.500" },
    _selected: { bg: "red.600" },
  };

  return (
    <Box bg="black" color="white" p={6} w="100%">
      <Flex direction="column" align="center" gap={6} maxW="800px" mx="auto">
        {/* Search Bar Row*/}
        <Box w="100%" lg={{w: "50%"}} >
          <Input
            placeholder="Search exercises (e.g., pushups)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setBodyPart("");
              setEquipment("");
              setTarget("");
            }}
            size="lg"
            borderRadius="2xl"
            bg="gray.800"
            color="white"
            borderColor="gray.600"
            _focus={{ borderColor: "red.500", boxShadow: "0 0 0 1px red.500" }}
            _hover={{ borderColor: "red.400" }}
            _placeholder={{ color: "gray.400" }}
          />
        </Box>

        {/* Filters Row */}
        <Flex wrap="wrap" gap={4} justify="center" w="100%">
          {/* Body Part Filter */}
          <Select.Root 
            collection={bodyPartCollection} 
            size="md" 
            width="200px"
            value={[bodyPart]}
            onValueChange={(details) => {
              setBodyPart(details.value[0] || "");
              setSearch("");
              setEquipment("");
              setTarget("");
            }}
          >
            <Select.HiddenSelect />
            <Select.Control {...selectControlStyles}>
              <Select.Trigger>
                <Select.ValueText 
                  placeholder="Filter by body part" 
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator color="white" />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content {...selectContentStyles}>
                  {bodyPartCollection.items.map((item) => (
                    <Select.Item 
                      item={item} 
                      key={item.value}
                      {...selectItemStyles}
                    >
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          {/* Equipment Filter */}
          <Select.Root 
            collection={equipmentCollection} 
            size="md" 
            width="200px"
            value={[equipment]}
            onValueChange={(details) => {
              setEquipment(details.value[0] || "");
              setSearch("");
              setBodyPart("");
              setTarget("");
            }}
          >
            <Select.HiddenSelect />
            <Select.Control {...selectControlStyles}>
              <Select.Trigger>
                <Select.ValueText 
                  placeholder="Filter by equipment" 
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator color="white" />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content {...selectContentStyles}>
                  {equipmentCollection.items.map((item) => (
                    <Select.Item 
                      item={item} 
                      key={item.value}
                      {...selectItemStyles}
                    >
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          {/* Target Muscle Filter */}
          <Select.Root 
            collection={targetCollection} 
            size="md" 
            width="200px"
            value={[target]}
            onValueChange={(details) => {
              setTarget(details.value[0] || "");
              setSearch("");
              setBodyPart("");
              setEquipment("");
            }}
          >
            <Select.HiddenSelect />
            <Select.Control {...selectControlStyles}>
              <Select.Trigger>
                <Select.ValueText 
                  placeholder="Filter by target muscle" 
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator color="white" />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content {...selectContentStyles}>
                  {targetCollection.items.map((item) => (
                    <Select.Item 
                      item={item} 
                      key={item.value}
                      {...selectItemStyles}
                    >
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          {/* My Workouts Button */}
          {isSignedIn && (
            <Link to="/workouts">
              <Button
                bg="red.500"
                color="white"
                borderRadius="2xl"
                size="md"
                _hover={{ bg: "red.600", transform: "translateY(-1px)" }}
                _focus={{ boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.5)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
              >
                My Workouts
              </Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Filters;