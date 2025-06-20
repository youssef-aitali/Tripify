import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import type { AuthUser } from "@/features/authTypes";
import { updateProfile, type User } from "firebase/auth";

export const getPhotoUploadURL = async (photoFile: File) => {
  const storage = getStorage();
  const photoFileRef = ref(storage, photoFile.name);

  await uploadBytes(photoFileRef, photoFile);
  return await getDownloadURL(photoFileRef);
};

export const updateUserData = async (user: User, newUserData: AuthUser) => {
  await updateProfile(user, {
    displayName: newUserData.fullname,
    ...newUserData,
  });
  await setDoc(doc(db, "users", user.uid), { ...newUserData }, { merge: true });
};

export const markUserForDeletion = async (
  userId: string,
  deletionDate: Date
) => {
  await setDoc(
    doc(db, "users", userId),
    {
      pendingDeletion: {
        requestedAt: new Date(),
        scheduledFor: deletionDate,
      },
    },
    { merge: true }
  );
};

export const cancelUserDeletionMark = async (userId: string) => {
  await setDoc(
    doc(db, "users", userId),
    {
      pendingDeletion: null,
    },
    { merge: true }
  );
};
