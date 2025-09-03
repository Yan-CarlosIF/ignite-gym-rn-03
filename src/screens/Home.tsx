import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { FlatList, Heading, HStack, VStack, Text } from "native-base";
import { useState } from "react";

const groups = ["costas", "bíceps", "tríceps", "ombro"];
const exercises = [
  "Puxada frontal",
  "Remada curvada",
  "Remada unilateral",
  "Levantamento terra",
];

export function Home() {
  const [groupSelected, setGroupSelected] = useState("costas");
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();

  function handleSelectGroup(group: string) {
    if (groupSelected === group) {
      setGroupSelected("");
    } else {
      setGroupSelected(group);
    }
  }

  const handleOpenExerciseDetails = () => navigate("exercise");

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item: group }) => (
          <Group
            name={group}
            isActive={groupSelected.toUpperCase() === group.toUpperCase()}
            onPress={() => handleSelectGroup(group)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading fontFamily="heading" color="gray.200" fontSize="md">
            Exercícios
          </Heading>

          <Text color="gray.200" fontSize="md">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item: exercise }) => (
            <ExerciseCard
              onPress={handleOpenExerciseDetails}
              sets={3}
              reps={12}
              name={exercise}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
}
