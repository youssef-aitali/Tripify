import type { AuthUser } from "@/features/auth/authTypes";
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const getPhotoUploadURL = async (photoFile: File) => {
  // Create a root reference
  const storage = getStorage();

  // Create a reference to 'mountains.jpg'
  const mountainsRef = ref(storage, photoFile.name);

  // 'file' comes from the Blob or File API
  await uploadBytes(mountainsRef, photoFile);
  return await getDownloadURL(mountainsRef);
};

export const updateUserData = async (userId: string, newUserData: AuthUser) => {
  await setDoc(doc(db, "users", userId), { ...newUserData }, { merge: true });
};
