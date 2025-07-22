import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export const syncTheme = (userId: string, newTheme: string) => {
  const userPrefRef = doc(db, "users", userId);
  setDoc(
    userPrefRef,
    { preferences: { appearance: newTheme } },
    { merge: true }
  );
};
