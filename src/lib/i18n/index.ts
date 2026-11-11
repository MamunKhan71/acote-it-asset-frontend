import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import bnAuth from "./locales/bn/auth.json";
import bnCommon from "./locales/bn/common.json";
import bnHistory from "./locales/bn/history.json";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enHistory from "./locales/en/history.json";

export const LANGUAGES = ["en", "bn"] as const;
export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = "language";

const isLanguage = (value: unknown): value is Language => LANGUAGES.includes(value as Language);

const saved = localStorage.getItem(STORAGE_KEY);

void i18n.use(initReactI18next).init({
    resources: {
        en: { common: enCommon, auth: enAuth, history: enHistory },
        bn: { common: bnCommon, auth: bnAuth, history: bnHistory },
    },
    lng: isLanguage(saved) ? saved : "en",
    fallbackLng: "en",
    supportedLngs: LANGUAGES,
    ns: ["common", "auth", "history"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
});

const persist = (language: string) => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
};

persist(i18n.language);
i18n.on("languageChanged", persist);

export default i18n;
