import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { FlatList, HStack, VStack } from "native-base";
import { useState } from "react";

const groups = ["costas", "bíceps", "tríceps", "ombro"];

export function Home() {
  const [groupSelected, setGroupSelected] = useState("costas");

  function handleSelectGroup(group: string) {
    if (groupSelected === group) {
      setGroupSelected("");
    } else {
      setGroupSelected(group);
    }
  }

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => handleSelectGroup(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
      />
    </VStack>
  );
}
