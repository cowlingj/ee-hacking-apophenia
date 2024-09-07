import {describe, expect, it} from 'vitest'
import {act, render} from "@testing-library/react"
import { CategoriesProvider, useCategories } from './CategoriesContext';

it("renders with default values", () => {
    let categories
    const TestConsumer = () => {
        categories = useCategories().categories;    
        return null;
    }

    render(<CategoriesProvider><TestConsumer /></CategoriesProvider>);
    expect(categories).toEqual([
        { name: "Category 1", values: [] },
        { name: "Category 2", values: [] },
        { name: "Category 3", values: [] },
    ])
});

it("renames categories", () => { // TODO: null, out of bounds, and different rows
    let categories, renameCategory;
    const TestConsumer = () => {
        let c = useCategories();
        renameCategory = c.renameCategory;
        categories = c.categories;
        return null;
    }

    render(<CategoriesProvider><TestConsumer /></CategoriesProvider>);
    
    act(() => {
        renameCategory(1, "Renamed")
    });
    
    expect(categories).toEqual([
        { name: "Category 1", values: [] },
        { name: "Renamed", values: [] },
        { name: "Category 3", values: [] },
    ])
});

// TODO: add, delete, rename value, choose randomly

