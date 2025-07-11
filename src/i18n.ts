import i18n, { type LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import enCommon from "@/locales/en/common.json";
import enAuth from "@/locales/en/auth.json";
import enSettings from "@/locales/en/settings.json";
import frCommon from "@/locales/fr/common.json";
import frAuth from "@/locales/fr/auth.json";
import frSettings from "@/locales/fr/settings.json";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const firestoreLanguageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: async (callback: (lng: string) => void): Promise<undefined> => {
    // 1. Check localStorage first
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang) {
      callback(storedLang);
      return;
    }

    // 2. Fallback to Firestore (only if authenticated)
    if (auth.currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const firestoreLang = userDoc.data()?.preferences.language;
        if (firestoreLang) {
          callback(firestoreLang);
          localStorage.setItem("i18nextLng", firestoreLang);
          return;
        }
      } catch (error) {
        console.error("Firestore language fetch failed:", error);
        // Continue to browser fallback
      }
    }

    // 3. Final fallback to browser/default
    const browserLang = navigator.language.split("-")[0];
    const fallbackLang = ["en", "fr"].includes(browserLang)
      ? browserLang
      : "en";
    callback(fallbackLang);
  },

  // Cache handling with explicit typing
  cacheUserLanguage: (lng: string): void => {
    localStorage.setItem("i18nextLng", lng);
  },
};

i18n
  .use(firestoreLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    resources: {
      en: { common: enCommon, auth: enAuth, settings: enSettings },
      fr: { common: frCommon, auth: frAuth, settings: frSettings },
    },
  });

export default i18n;
