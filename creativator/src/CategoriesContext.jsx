import { createContext, useContext, useState } from "react";


/*
  [
    { name: "Category 1", values: [ "value 1.1", "value 1.2", ... ] },
    { name: "Category 2", values: [ "value 2.1", "value 2.2", ... ] },
    ...
  ]
*/
const CategoryContext = createContext({ categories: [], setCategories: () => {} });

export function CategoriesProvider({children}) {
    const [categories, setCategories] = useState([
        { name: "Category 1", values: [] },
        { name: "Category 2", values: [] },
        { name: "Category 3", values: [] },
    ]);
    return <CategoryContext.Provider value={{categories, setCategories}}>{children}</CategoryContext.Provider>
}

export function useCategories() {
    const {categories, setCategories} = useContext(CategoryContext);

    const renameCategory = (i, name) => {
        setCategories((current) => {
            const categoriesCopy = [...current];
            categoriesCopy.splice(i, 1, { name: name ?? "", values: current[i]?.values ?? [] });
            return categoriesCopy;
        });
    };

    const addRow = () => {
        setCategories((current) => 
            current.map(category => ({ name: category.name, values: [...category.values, ""] }))
        );
    }

    const deleteRow = (i) => {
        setCategories((current) => 
            current.map(category => {
                const values = [...category.values];
                values.splice(i, 1);
                return { name: category.name, values };
            })
        );
    }

    const renameValue = (i, j, name) => {
        setCategories((current) => {
            const categoriesCopy = [...current];
            const values = [...current[i]?.values ?? []]
            values.splice(j, 1, name ?? "");
            categoriesCopy.splice(i, 1, { name: current[i]?.name ?? "", values: values });
            return categoriesCopy;
        });
    }

    return {
        addRow,
        deleteRow,
        categories,
        renameCategory,
        renameValue,
    }
}
