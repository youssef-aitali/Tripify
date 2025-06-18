import type { AuthUser } from "@/features/auth/authTypes";
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const getPhotoUploadURL = async (photoFile: File) => {
  // Create a root reference
  const storage = getStorage();

  // Create a reference to 'mountains.jpg'
  const mountainsRef = ref(storage, photoFile.name);

  // Create a reference to 'images/mountains.jpg'
  const mountainImagesRef = ref(storage, `images/${photoFile.name}`);

  console.log(mountainsRef.fullPath);
  console.log(mountainImagesRef.fullPath);

  // 'file' comes from the Blob or File API
  await uploadBytes(mountainsRef, photoFile);
  return await getDownloadURL(mountainsRef);

  /*   await uploadBytes(mountainsRef, photoFile).then((snapshot) => {
    console.log(snapshot);
    getDownloadURL(mountainsRef).then((url) => {
      console.log(url);
    });
    console.log("Uploaded a blob or file!");
  }); */
};

export const updateUserData = async (userId: string, newUserData: AuthUser) => {
  await setDoc(doc(db, "users", userId), { ...newUserData }, { merge: true });
};
