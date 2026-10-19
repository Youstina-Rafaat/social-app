import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  userLogin: string | null;
  setUserLogin: Dispatch<SetStateAction<string | null>>;
  userId: string;
}

interface TokenPayload {
  user: string;
}

export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  setUserLogin: () => {},
  userId: "",
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userLogin, setUserLogin] = useState<string | null>(() =>
    localStorage.getItem("userToken"),
  );
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const { user } = jwtDecode<TokenPayload>(token);
      setUserId(user);
    } else {
      setUserId("");
    }
  }, [userLogin]);

  return (
    <AuthContext.Provider value={{ userLogin, setUserLogin, userId }}>
      {children}
    </AuthContext.Provider>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f7354201667d48a122dcbd0bdaebddde28c4ab37
