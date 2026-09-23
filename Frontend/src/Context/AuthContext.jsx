import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  createContext,
  useEffect,
  useState,
} from "react";

import { auth } from "../Firebase/firebase.js";
import axios from "axios";

export const AuthContext =
  createContext();

export default function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);
  const [role, setRole] = useState("");

  const [dbUser, setDbUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (currentUser?.email) {
          try {
            const res = await axios.get(
              `http://localhost:5000/api/users/${currentUser.email}`
            );

            // setRole(res.data.role);
            setRole(res.data?.role || "patient");
            setDbUser(res.data);
          } catch (error) {
            console.log(error);
          }
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
    dbUser,
    loading,
  };

  return (
    <AuthContext.Provider
      value={authInfo}
    >
      {children}
    </AuthContext.Provider>
  );
}