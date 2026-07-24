import { STORAGE_KEYS } from "./constants";
import { loadString, saveString } from "./localStorage";

export function loadTheme() {
  const savedTheme = loadString(STORAGE_KEYS.THEME, "dark");

  document.documentElement.setAttribute("data-theme", savedTheme);

  return savedTheme;
}

export function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);

  saveString(STORAGE_KEYS.THEME, newTheme);
}