import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Heading, VStack, SectionList, Text, useToast } from "native-base";
import { useCallback, useState } from "react";
import { HistoryByDayDTO } from "src/dto/HistoryByDayDTO";

export function History() {
  const [isLoading, setIsLoading] = useState(true);

  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  const toast = useToast();

  async function fetchHistory() {
    try {
      setIsLoading(true);

      const { data } = await api.get("/history");

      setExercises(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar o histórico.";

      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item: history }) => <HistoryCard data={history} />}
          renderSectionHeader={({ section }) => (
            <Heading
              fontFamily="heading"
              color="gray.200"
              fontSize="md"
              mt={10}
              mb={3}
            >
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: "center" }
          }
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Nenhum exercício registrado ainda. {"\n"} Vamos fazer exercícios
              hoje?
            </Text>
          )}
        />
      )}
    </VStack>
  );
}
