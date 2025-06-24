import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import enCommon from "@/locales/en/common.json";
import enAuth from "@/locales/en/auth.json";
import enSettings from "@/locales/en/settings.json";
import frCommon from "@/locales/fr/common.json";
import frAuth from "@/locales/fr/auth.json";
import frSettings from "@/locales/fr/settings.json";

i18n
  .use(LanguageDetector)
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
    detection: {
      order: ["navigator", "htmlTag", "localStorage"],
      caches: ["localStorage"],
    },
  });

export default i18n;
