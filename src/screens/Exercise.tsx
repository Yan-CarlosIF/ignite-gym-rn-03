import {
  Heading,
  HStack,
  Icon,
  VStack,
  Text,
  Image,
  Box,
  ScrollView,
  useToast,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";
import { ExerciseDTO } from "src/dto/ExerciseDTO";
import { useCallback, useState } from "react";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Loading } from "@components/Loading";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

type ExerciseScreenRouteParams = {
  exerciseId: string;
};

export function Exercise() {
  const { goBack, navigate } = useNavigation<AppNavigatorRoutesProps>();

  const toast = useToast();
  const { params } = useRoute();
  const { exerciseId } = params as ExerciseScreenRouteParams;

  const [isLoading, setIsLoading] = useState(true);
  const [sendingRegister, setSendingRegister] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDTO | null>(null);

  const handleGoBack = () => goBack();

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/exercises/${exerciseId}`);

      setExercise(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os detalhes do exercício.";

      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);
      await api.post("/history", { exercise_id: exerciseId });

      toast.show({
        title: "Parabéns! Exercício registrado no seu histórico.",
        placement: "top",
        bgColor: "green.700",
      });

      navigate("history");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível registrar o exercício.";

      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setSendingRegister(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchExerciseDetails();
    }, [exerciseId])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack justifyContent="space-between" mt={4} mb={8}>
          <Heading
            fontFamily="heading"
            color="gray.100"
            fontSize="lg"
            flexShrink={1}
          >
            {exercise?.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise?.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView>
        <VStack p={8}>
          <Box mb={3} rounded="lg" overflow="hidden">
            <Image
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
              }}
              alt="Imagem do exercício"
              w="full"
              h={80}
              resizeMode="cover"
              rounded="lg"
            />
          </Box>

          <Box bg="gray.600" rounded="md" pb={4} px={4}>
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb={6}
              mt={5}
            >
              <HStack>
                <SeriesSvg />

                <Text color="gray.200" fontSize="md" ml="2">
                  {exercise?.series} séries
                </Text>
              </HStack>

              <HStack>
                <RepsSvg />

                <Text color="gray.200" fontSize="md" ml="2">
                  {exercise?.repetitions} repetições
                </Text>
              </HStack>
            </HStack>

            <Button
              onPress={handleExerciseHistoryRegister}
              isLoading={sendingRegister}
              title="Marcar como realizado"
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
