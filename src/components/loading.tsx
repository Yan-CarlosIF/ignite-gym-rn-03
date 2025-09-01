import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";

export function Loading() {
  return (
    <Center className="bg-gray-600 flex-1">
      <Spinner />
    </Center>
  );
}
