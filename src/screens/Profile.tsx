import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@hooks/useAuth";

const PHOTO_SIZE = 33;

const profileFormSchema = z
  .object({
    name: z.string().min(1, "Informe o nome"),
    email: z.string().email("Informe um e-mail válido"),
    old_password: z
      .string()
      .optional()
      .transform((value) => (value === "" ? null : value)),
    new_password: z
      .string()
      .optional()
      .transform((value) => (value === "" ? null : value)),
    new_password_confirm: z
      .string()
      .optional()
      .transform((value) => (value === "" ? null : value)),
  })
  .superRefine((data, ctx) => {
    if (data.new_password && data.new_password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["new_password"],
        message: "A senha deve ter pelo menos 6 dígitos.",
      });
    }

    if (data.new_password && !data.new_password_confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["new_password_confirm"],
        message: "Informe a confirmação da senha.",
      });
    }

    if (data.new_password && data.new_password !== data.new_password_confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["new_password_confirm"],
        message: "As senhas não conferem.",
      });
    }
  });

type ProfileFormData = z.infer<typeof profileFormSchema>;

export function Profile() {
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/yan-carlosif.png"
  );

  const toast = useToast();

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) return;

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        );

        const size = photoInfo.exists && photoInfo.size / 1024 / 1024;

        if (size && size > 5) {
          return toast.show({
            title: "A foto selecionada ultrapassa o limite de 5MB",
            placement: "top",
            bgColor: "red.500",
          });
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        "Foto de perfil",
        "Não foi possivel definir a foto de perfil"
      );
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: ProfileFormData) {
    try {
      console.log(data);
    } catch (error) {
      throw error;
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              startColor="gray.500"
              endColor="gray.400"
              rounded="full"
            />
          ) : (
            <UserPhoto size={PHOTO_SIZE} source={{ uri: userPhoto }} />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              mt={2}
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mb={8}
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                bg="gray.600"
                isDisabled
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading fontFamily="heading" color="gray.200" fontSize="md" mb={2}>
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                placeholder="Senha antiga"
                bg="gray.600"
                secureTextEntry
                errorMessage={errors.old_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="new_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Nova senha"
                onChangeText={onChange}
                bg="gray.600"
                secureTextEntry
                errorMessage={errors.new_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="new_password_confirm"
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                placeholder="Confirme a nova senha"
                bg="gray.600"
                secureTextEntry
                errorMessage={errors.new_password_confirm?.message}
              />
            )}
          />

          <Button
            onPress={handleSubmit(handleProfileUpdate)}
            title="Atualizar"
            mt={4}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
