import { createContext, useContext, useEffect, useState } from "react";


const defaultPreferences = { prefersReduceMotion: true, darkMode: true };
const UserPreferencesContext = createContext({ preferences: defaultPreferences, setPreferences: () => {} });

export function UserPreferences({children}) {

    const [preferences, setPreferences] = useState(defaultPreferences);
    useEffect(() => {
        setPreferences(JSON.parse(localStorage.getItem('preferences')))
    }, [ setPreferences ]);

    useEffect(() => {
        const item = JSON.stringify(preferences)
        if (item === localStorage.getItem('preferences')) {
            return;
        }
        localStorage.setItem('preferences', JSON.stringify(preferences))
    }, [preferences]);

    return <UserPreferencesContext.Provider value={{ preferences, setPreferences}}>{children}</UserPreferencesContext.Provider>
}

export function useUserPreferences() {
    const { preferences, setPreferences } = useContext(UserPreferencesContext);

    const setPrefersReducedMotion = () => {};
    const setDarkMode = () => {};

    return {
        ...preferences,
        setPrefersReducedMotion,
        setDarkMode,
    }

}
