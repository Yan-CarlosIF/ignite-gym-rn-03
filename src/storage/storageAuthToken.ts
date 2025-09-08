import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_STORAGE } from "./storageConfig";

type StorageAuthTokenProps = {
  token?: string;
  refresh_token?: string;
};

export async function storageAuthTokenSave({
  refresh_token,
  token,
}: StorageAuthTokenProps) {
  await AsyncStorage.setItem(
    TOKEN_STORAGE,
    JSON.stringify({ token, refresh_token })
  );
}

export async function storageAuthTokenGet() {
  const response = await AsyncStorage.getItem(TOKEN_STORAGE);

  const tokens: StorageAuthTokenProps = response ? JSON.parse(response) : {};

  return tokens;
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(TOKEN_STORAGE);
}
