import { useContext } from "react";
import { AuthContext } from "./authContext";

export interface User {
  _id: string;
  username: string;
  email: string;
  repositories?: string[];
  followedUsers?: string[];
  starredRepositories?: string[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
