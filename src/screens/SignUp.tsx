import {
  Center,
  Heading,
  Image,
  Text,
  VStack,
  ScrollView,
  useToast,
} from "native-base";
import BackgroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const signUpFormSchema = z
  .object({
    name: z.string().min(1, "Informe o nome"),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 dígitos"),
    password_confirm: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 dígitos"),
  })
  .refine((data) => data.password === data.password_confirm, {
    path: ["password_confirm"],
    message: "As senhas não são iguais",
  });

type SignUpFormData = z.infer<typeof signUpFormSchema>;

export function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  });

  const toast = useToast();

  const { goBack } = useNavigation();

  const handleGoToSignIn = () => goBack();

  async function handleSignUp({ name, email, password }: SignUpFormData) {
    try {
      await api.post("/users", { name, email, password });
      reset();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar a conta. Tente novamente mais tarde.";

      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                errorMessage={errors.name?.message}
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                placeholder="Senha"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                placeholder="Confirme a senha"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            onPress={handleSubmit(handleSignUp)}
            title="Criar e acessar"
          />
        </Center>

        <Button
          mt={12}
          onPress={handleGoToSignIn}
          variant="outline"
          title="Voltar para o login"
        />
      </VStack>
    </ScrollView>
  );
}
