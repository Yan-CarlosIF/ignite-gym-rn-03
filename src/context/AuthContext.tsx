import { createContext } from "react";
import { UserDTO } from "src/dto/UserDTO";

type AuthContextType = {
  user: UserDTO | null;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider
      value={{
        user: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
