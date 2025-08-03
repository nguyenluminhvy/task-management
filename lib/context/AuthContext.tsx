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
} from 'firebase/auth';
import {sendPasswordResetEmail, signOut as firebaseSignOut} from "@firebase/auth";
import {createUserProfile} from "@/lib/services/userService";
import app from "@/lib/config/firebaseConfig";
import {useTasks} from "@/lib/hooks/useTasks";

const auth = getAuth(app);

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean | any>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  reSendEmailVerification: () => Promise<void>;
  sendEmailResetPassword: (email: string) => Promise<void>;
};

const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => false,
  signUp: async () => {
  },
  signOut: async () => {
  },
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { cancelAllScheduledNotifications, initScheduledNotifications } = useTasks()

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


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
      console.error('❌ Sign in error:', err);
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
      console.error('❌ Sign up error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reSendEmailVerification = async () => {
    user && await sendEmailVerification(user)
  }

  const sendEmailResetPassword = async (email: string) => {
    auth && await sendPasswordResetEmail(auth, email)
  }

  const signOut = async () => {
    try {
      await cancelAllScheduledNotifications();
      await firebaseSignOut(auth);
      setUser(null);
      alert('User signed out!');
    } catch (error) {
      alert(error.message);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    reSendEmailVerification,
    sendEmailResetPassword,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
