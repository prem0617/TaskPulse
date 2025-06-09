import type { User } from "@/types/user.types";
import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AuthContextType {
  loading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>({
    email: "",
    name: "",
    id: "",
    role: "",
    username: "",
  });

  async function fetchUser() {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/getMe", {
        withCredentials: true,
      });
      //   console.log(response);
      setUser(response.data.user);
      if (response.status === 200) setLoading(false);
    } catch (error) {
      console.log(error);
      setUser(null); // 👈 ADD this
      setLoading(false); // 👈 FIX: Ensure loading stops even if error
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, user, setUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
