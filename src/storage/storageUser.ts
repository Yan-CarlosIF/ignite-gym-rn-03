import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "src/dto/UserDTO";
import { USER_STORAGE } from "./storageConfi";

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
  const user = await AsyncStorage.getItem(USER_STORAGE);

  return user ? JSON.parse(user) : ({} as UserDTO);
}
