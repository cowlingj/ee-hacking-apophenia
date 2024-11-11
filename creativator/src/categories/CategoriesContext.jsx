import { useEffect, useState } from "react";
import { CategoryContext } from "./useCategories";
import { PropTypes } from "prop-types";
import { useDebouncedCallback } from "use-debounce";
import { DEFAULT_CATEGORIES } from "./useCategories";

const savedCategories = JSON.parse(localStorage.getItem("categories"));
const initialCategories = validateCategories(savedCategories)
  ? savedCategories
  : DEFAULT_CATEGORIES;

function validateCategories(categories) {
  return (
    Array.isArray(categories) &&
    categories.length > 0 &&
    categories.every(
      (c) =>
        c &&
        typeof c.name === "string" &&
        Array.isArray(c.values) &&
        c.values.every((v) => typeof v === "string")
    )
  );
}

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(initialCategories);
  const save = useDebouncedCallback((c) => {
    localStorage.setItem("categories", JSON.stringify(c));
  }, 5000);

  useEffect(() => {
    if (JSON.stringify(categories) !== JSON.stringify(DEFAULT_CATEGORIES)) {
      save(categories);
    } else {
      localStorage.removeItem("categories");
    }
  }, [categories, save]);

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

CategoriesProvider.propTypes = {
  children: PropTypes.node,
};
