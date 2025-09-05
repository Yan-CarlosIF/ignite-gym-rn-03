import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { Loading } from "@components/Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { FlatList, Heading, HStack, VStack, Text, useToast } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { ExerciseDTO } from "src/dto/ExerciseDTO";

export function Home() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);

  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState("");

  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

  function handleSelectGroup(group: string) {
    if (groupSelected === group) {
      setGroupSelected("");
    } else {
      setGroupSelected(group);
    }
  }

  async function fetchGroups() {
    try {
      const { data } = await api.get("/groups");

      setGroups(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os grupos musculares.";

      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/exercises/bygroup/${groupSelected}`);

      setExercises(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os exercícios.";

      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenExerciseDetails = (exerciseId: string) =>
    navigate("exercise", { exerciseId });

  useEffect(() => {
    fetchGroups();
  }, [groupSelected]);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected])
  );

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

      {isLoading ? (
        <Loading />
      ) : (
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: exercise }) => (
              <ExerciseCard
                onPress={() =>
                  handleOpenExerciseDetails(exercise.id.toString())
                }
                data={exercise}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  );
}
