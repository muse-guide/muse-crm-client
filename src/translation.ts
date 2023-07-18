import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next
    .use(initReactI18next)
    .use(HttpApi)
    .use(LanguageDetector)
    .init({
        supportedLngs: ["gb", "pl", "es"],
        fallbackLng: "gb",
        interpolation: {
            escapeValue: false,
        },
    });
export default i18next;
