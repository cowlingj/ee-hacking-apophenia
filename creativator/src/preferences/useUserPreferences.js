import { createContext, useContext } from "react";

export const defaultPreferences = { prefersReduceMotion: true, darkMode: true };
export const UserPreferencesContext = createContext({
  preferences: defaultPreferences,
  setPreferences: () => {},
});

export function useUserPreferences() {
  const { preferences } = useContext(UserPreferencesContext);

  const setPrefersReducedMotion = () => {};
  const setDarkMode = () => {};

  return {
    ...preferences,
    setPrefersReducedMotion,
    setDarkMode,
  };
}
