export const getFirebaseErrorMessage = (code: string) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered!";
    case "auth/weak-password":
      return "Password should be at least 6 characters!";
    case "auth/invalid-email":
      return "Please enter a valid email!";
    case "firestore/permission-denied":
      return "Failed to create user profile!";
    default:
      return "Authentication failed. Please try again!";
  }
};
