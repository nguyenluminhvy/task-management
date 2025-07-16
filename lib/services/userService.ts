import { doc, setDoc, Timestamp } from 'firebase/firestore';
import {FirestoreCollection} from "@/lib/constants/firestore";
import {db} from "@/lib/config/firebaseConfig";

export const createUserProfile = async (
  uid: string,
  email: string,
  displayName?: string
) => {
  const userRef = doc(db, FirestoreCollection.Users, uid);

  const userProfile = {
    uid,
    email,
    displayName: displayName || '',
    createdAt: Timestamp.now(),
  };

  await setDoc(userRef, userProfile);
};
