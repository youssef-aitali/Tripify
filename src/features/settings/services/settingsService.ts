import { db } from "@/lib/firebaseConfig";
import { updateProfile, type User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import type { AuthUser } from "@/features/authTypes";

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

export const toggleUserDeletionMark = async (
  userId: string,
  deletionDate?: Date | null
) => {
  await setDoc(
    doc(db, "users", userId),
    {
      pendingDeletion: deletionDate
        ? {
            requestedAt: new Date(),
            scheduledFor: deletionDate,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }
        : null,
    },
    { merge: true }
  );
};

export const updateUserPreferredLanguage = async (
  userId: string,
  preferredLanguage: string
) => {
  await setDoc(
    doc(db, "users", userId),
    {
      preferences: {
        language: preferredLanguage,
      },
    },
    { merge: true }
  );
};
