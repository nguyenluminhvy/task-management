import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User, sendEmailVerification,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import {sendPasswordResetEmail, signOut as firebaseSignOut} from "@firebase/auth";
import {createUserProfile} from "@/lib/services/userService";
import app from "@/lib/config/firebaseConfig";
import * as Notifications from "expo-notifications";


const auth = getAuth(app);

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setLoading: any;
  signIn: (email: string, password: string) => Promise<boolean | any>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  reSendEmailVerification: () => Promise<void>;
  sendEmailResetPassword: (email: string) => Promise<void>;
};

const defaultContext: AuthContextType = {
  user: null,
  loading: false,
  signIn: async () => false,
  signUp: async () => {
  },
  signOut: async () => {
  },
  reSendEmailVerification: async () => {
  },
  sendEmailResetPassword: async () => {
  },
  setLoading: async () => {
  }
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      if (firebaseUser) {
        setUser(firebaseUser);
      }
      setLoading(false);

      console.log('firebaseUser: ', firebaseUser)

    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        if (userCredential.user?.emailVerified) {
          setUser(userCredential.user);
          return true;
        } else {
          setUser(userCredential.user);
          return {
            code: -1,
            message: 'email is not verify'
          }
        }
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (user.uid) {
        await createUserProfile(user.uid, user.email ?? '', user.displayName ?? '');
        await sendEmailVerification(user)
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reSendEmailVerification = async () => {
    try {
      setLoading(true);
      user && await sendEmailVerification(user)
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  const sendEmailResetPassword = async (email: string) => {
    try {
      setLoading(true);
      auth && await sendPasswordResetEmail(auth, email)
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    try {
      setLoading(true);
      await Notifications.cancelAllScheduledNotificationsAsync()
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    setLoading,
    signIn,
    signUp,
    reSendEmailVerification,
    sendEmailResetPassword,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
