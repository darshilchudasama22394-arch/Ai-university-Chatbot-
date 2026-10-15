export function getStoredTheme() {
  return localStorage.getItem("theme") === "light" ? "light" : "dark";
}

export function applyTheme(theme) {
  const selectedTheme = theme === "light" ? "light" : "dark";

  document.body.classList.remove("dark-mode", "light-mode");
  document.documentElement.classList.remove("dark-mode", "light-mode");
  document.body.classList.add(`${selectedTheme}-mode`);
  document.documentElement.classList.add(`${selectedTheme}-mode`);
  localStorage.setItem("theme", selectedTheme);
}
