import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_STORAGE } from "./storageConfig";

export async function storageAuthTokenSave(token: string) {
  await AsyncStorage.setItem(TOKEN_STORAGE, token);
}

export async function storageAuthTokenGet() {
  return await AsyncStorage.getItem(TOKEN_STORAGE);
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(TOKEN_STORAGE);
}
