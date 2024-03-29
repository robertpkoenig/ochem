import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import firebaseClient from "../firebaseClient";
import { useRouter } from "next/router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import User from "../persistence-model/User";
import { USERS } from "../persistence-model/FirebaseConstants";

/**
 * Users in the application are authenticated with this component.
 * This component wraps all other app components.
 * This component also tracks whether or not login has been attempted.
 */

type authContextType = {
  user: User;
  setUser: (user: User) => void;
  loginAttempted: boolean;
  setLoginAttempted: (loginAttempted: boolean) => void;
};

const authContextDefaultValues: authContextType = {
  user: null,
  setUser: null,
  loginAttempted: false,
  setLoginAttempted: null,
};

export const AuthContext = createContext<authContextType>(
  authContextDefaultValues
);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const pagesNotRequiringAuth = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/auth/reset-password",
    "/student/invitation/[moduleId]",
  ];

  const [user, setUser] = useState<User | null>(null);
  const [loginAttempted, setLoginAttempted] = useState<boolean>(false);

  firebaseClient();
  const db = getFirestore();

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    if (!user) {
      onAuthStateChanged(auth, (loggedInUser) => {
        // if there is no user in the auth
        if (!loggedInUser) {
          // if this page does not require auth, simply
          // tell downstream components that auth has been attempted
          if (pagesNotRequiringAuth.includes(router.pathname)) {
            setLoginAttempted(true);
          }
          // If this page requires auth, and user is not logged in
          // go back to the home page
          else {
            router.push("/");
          }
        }

        if (loggedInUser) {
          const docRef = doc(db, USERS, loggedInUser.uid);
          getDoc(docRef).then((docSnap) => {
            const dbUser = docSnap.data();
            setUser(dbUser as User);
            setLoginAttempted(true);
          });
        }
      });
    }
  });

  const authContext = {
    user,
    setUser,
    loginAttempted,
    setLoginAttempted,
  };

  return (
    <>
      <AuthContext.Provider value={authContext}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
