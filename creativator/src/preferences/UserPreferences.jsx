import { useState, useEffect } from "react";
import {
  defaultPreferences,
  UserPreferencesContext,
} from "./useUserPreferences";
import { PropTypes } from "prop-types";

export function UserPreferences({ children }) {
  const [preferences, setPreferences] = useState(defaultPreferences);
  useEffect(() => {
    setPreferences(JSON.parse(localStorage.getItem("preferences")));
  }, [setPreferences]);

  useEffect(() => {
    const item = JSON.stringify(preferences);
    if (item === localStorage.getItem("preferences")) {
      return;
    }
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }, [preferences]);

  return (
    <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

UserPreferences.propTypes = {
  children: PropTypes.node,
};
