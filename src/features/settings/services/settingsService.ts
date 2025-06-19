import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import type { AuthUser } from "@/features/authTypes";

export const getPhotoUploadURL = async (photoFile: File) => {
  const storage = getStorage();
  const photoFileRef = ref(storage, photoFile.name);

  await uploadBytes(photoFileRef, photoFile);
  return await getDownloadURL(photoFileRef);
};

export const updateUserData = async (userId: string, newUserData: AuthUser) => {
  await setDoc(doc(db, "users", userId), { ...newUserData }, { merge: true });
};
