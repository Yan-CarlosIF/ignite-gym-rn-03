import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type ButtonProps = IButtonProps & {
  title: string;
  variant?: "solid" | "outline";
};

export function Button({ title, variant = "solid", ...rest }: ButtonProps) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      rounded="sm"
      bg={variant === "outline" ? "transparent" : "green.700"}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor="green.500"
      _pressed={{
        bg: variant === "outline" ? "green.50" : "green.500",
      }}
      {...rest}
    >
      <Text
        color={variant === "outline" ? "green.500" : "white"}
        fontSize="sm"
        fontFamily="heading"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
