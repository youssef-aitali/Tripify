// features/auth/services/firebaseAuth.ts
import { auth } from "@/lib/firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const registerWithEmailAndPassword = (
  email: string,
  password: string
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Error message ${errorMessage} with code ${errorCode}`);
    });
};

/* export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  // ... implementation
};

export const logout = async () => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}; */
