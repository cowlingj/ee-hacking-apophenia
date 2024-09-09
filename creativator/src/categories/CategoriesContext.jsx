import { useState } from "react";
import { CategoryContext } from "./useCategories";
import { PropTypes } from "prop-types";

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([
    { name: "Category 1", values: [] },
    { name: "Category 2", values: [] },
    { name: "Category 3", values: [] },
  ]);
  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

CategoriesProvider.propTypes = {
  children: PropTypes.node,
};
