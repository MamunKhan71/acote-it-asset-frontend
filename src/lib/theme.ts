export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "theme";
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

export function applyTheme(theme: Theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && darkQuery.matches));
}

export function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    applyTheme(saved && THEMES.includes(saved) ? saved : "system");
}
