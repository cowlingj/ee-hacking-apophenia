import { createContext, useContext } from "react";

/**
 * @typedef Category
 * @type {Object}
 * @property {string} name
 * @property {string[]} values
 */

export const CategoryContext = createContext({
  categories: [],
  setCategories: () => {},
});

/**
 * @typedef UseCategoriesResult
 * @type {Object}
 * @property {() => void} addRow
 * @property {(i: number) => void} deleteRow
 * @property {Category[]} categories
 * @property {(i: number, name: string) => void} renameCategory
 * @property {(i: number, j: number, name: string) => void} renameValue
 */

/**
 *
 * @returns {UseCategoriesResult}
 */
export function useCategories() {
  const { categories, setCategories } = useContext(CategoryContext);

  /**
   *
   * @param {number} i index to rename
   * @param {string} name new name
   * @returns {void}
   */
  const renameCategory = (i, name) => {
    setCategories((current) => {
      if (i >= current.length) {
        return current;
      }

      const categoriesCopy = [...current];
      categoriesCopy.splice(i, 1, {
        name: name ?? "", // test Coverage
        values: current[i].values,
      });
      return categoriesCopy;
    });
  };

  const addRow = () => {
    setCategories((current) =>
      current.map((category) => ({
        name: category.name,
        values: [...category.values, ""],
      }))
    );
  };

  const deleteRow = (i) => {
    setCategories((current) => {
      if (i >= current[0].values.length) {
        return current;
      }
      return current.map((category) => {
        const values = [...category.values];
        values.splice(i, 1);
        return { name: category.name, values };
      });
    });
  };

  const renameValue = (i, j, name) => {
    setCategories((current) => {
      if (i >= current.length || j >= current[i].values.length) {
        return current;
      }
      const categoriesCopy = [...current];
      const values = [...current[i].values];
      values.splice(j, 1, name ?? "");
      categoriesCopy.splice(i, 1, {
        ...current[i],
        values: values,
      });
      return categoriesCopy;
    });
  };

  return {
    addRow,
    deleteRow,
    categories,
    renameCategory,
    renameValue,
  };
}
