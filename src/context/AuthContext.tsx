import { api } from "@services/api";
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from "@storage/storageUser";
import { createContext, useEffect, useState } from "react";
import { UserDTO } from "src/dto/UserDTO";

type AuthContextType = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoading, setIsLoading] = useState(true);

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user) {
        setUser(data.user);

        await storageUserSave(data.user);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);

      setUser({} as UserDTO);
      await storageUserRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();

      if (userLogged) {
        setUser(userLogged);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
