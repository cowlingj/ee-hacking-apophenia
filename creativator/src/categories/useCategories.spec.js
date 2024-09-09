import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CategoriesProvider } from "./CategoriesContext";
import { useCategories } from "./useCategories";

// There's not much point testing these hooks separately from the UI since they're not being reused
// an older version of the hooks testing library called this out in the README:
// https://github.com/testing-library/react-hooks-testing-library?tab=readme-ov-file#when-not-to-use-this-library
// In this case I've added these tests to demonstrate testing hooks

it("renders with default values", () => {
  const { result } = renderHook(useCategories, { wrapper: CategoriesProvider });

  expect(result.current.categories).toEqual([
    { name: "Category 1", values: [] },
    { name: "Category 2", values: [] },
    { name: "Category 3", values: [] },
  ]);
});

it("Does nothing without context provider", () => {
  const { result } = renderHook(useCategories);

  expect(result.current.categories).toEqual([]);

  expect(() => {
    act(() => {
      result.current.addRow();
      result.current.deleteRow();
      result.current.renameCategory(0, "Renamed");
      result.current.renameValue(0, 0, "Renamed");
    });
  }).not.toThrowError();
});

describe("renames categories", () => {
  it.each([0, 1, 2])("renames category %d correctly", (i) => {
    // TODO: null, out of bounds, and different rows
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      result.current.renameCategory(i, "Renamed");
    });

    const expected = [
      { name: "Category 1", values: [] },
      { name: "Category 2", values: [] },
      { name: "Category 3", values: [] },
    ];
    expected[i].name = "Renamed";

    expect(result.current.categories).toEqual(expected);
  });

  it("does nothing if index is out of bounds", () => {
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      result.current.renameCategory(3, "Index out of bounds");
    });

    expect(result.current.categories).toEqual([
      { name: "Category 1", values: [] },
      { name: "Category 2", values: [] },
      { name: "Category 3", values: [] },
    ]);
  });

  it("renames with an empty string if name is undefined", () => {
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      result.current.renameCategory(0, undefined);
    });

    expect(result.current.categories).toEqual([
      { name: "", values: [] },
      { name: "Category 2", values: [] },
      { name: "Category 3", values: [] },
    ]);
  });
});

describe("rename value", () => {
  it("renames values at correct indicies", () => {
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      // setup by adding rows
      result.current.addRow();
      result.current.addRow();

      // test
      result.current.renameValue(0, 0, "a");
      result.current.renameValue(1, 0, "b");
      result.current.renameValue(2, 0, "c");
      result.current.renameValue(0, 1, "d");
      result.current.renameValue(1, 1, "e");
      result.current.renameValue(2, 1, "f");
    });

    const expected = [
      { name: "Category 1", values: ["a", "d"] },
      { name: "Category 2", values: ["b", "e"] },
      { name: "Category 3", values: ["c", "f"] },
    ];

    expect(result.current.categories).toEqual(expected);
  });

  it("does nothing if category or value index are out of bounds", () => {
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      // setup by adding rows
      result.current.addRow();
      result.current.addRow();

      // test
      result.current.renameValue(4, 0, "a");
      result.current.renameValue(0, 2, "b");
    });

    const expected = [
      { name: "Category 1", values: ["", ""] },
      { name: "Category 2", values: ["", ""] },
      { name: "Category 3", values: ["", ""] },
    ];

    expect(result.current.categories).toEqual(expected);
  });

  it("renames with an empty string if name is undefined", () => {
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      // setup by adding rows and renaming values
      result.current.addRow();
      result.current.renameValue(0, 0, "a");
      result.current.renameValue(1, 0, "b");
      result.current.renameValue(2, 0, "c");

      result.current.renameValue(0, 0, undefined);
    });

    expect(result.current.categories).toEqual([
      { name: "Category 1", values: [""] },
      { name: "Category 2", values: ["b"] },
      { name: "Category 3", values: ["c"] },
    ]);
  });
});

describe("add row", () => {
  it("appends a new row to all categories", () => {
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      // setup by adding rows and renaming values
      result.current.addRow();
      result.current.renameValue(0, 0, "a");
      result.current.renameValue(1, 0, "b");
      result.current.renameValue(2, 0, "c");

      // test
      result.current.addRow();
    });

    expect(result.current.categories).toEqual([
      { name: "Category 1", values: ["a", ""] },
      { name: "Category 2", values: ["b", ""] },
      { name: "Category 3", values: ["c", ""] },
    ]);
  });
});

describe("delete row", () => {
  it.each([0, 1])("removes row at index %d", (i) => {
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      // setup by adding rows and renaming values
      result.current.addRow();
      result.current.addRow();
      result.current.renameValue(0, 0, "a");
      result.current.renameValue(1, 0, "b");
      result.current.renameValue(2, 0, "c");
      result.current.renameValue(0, 1, "d");
      result.current.renameValue(1, 1, "e");
      result.current.renameValue(2, 1, "f");

      // test
      result.current.deleteRow(i);
    });

    const expected = [
      { name: "Category 1", values: ["a", "d"] },
      { name: "Category 2", values: ["b", "e"] },
      { name: "Category 3", values: ["c", "f"] },
    ];

    expected.forEach(({ values }) => values.splice(i, 1));

    expect(result.current.categories).toEqual(expected);
  });

  it("does nothing if index is out of bounds", () => {
    const { result } = renderHook(useCategories, {
      wrapper: CategoriesProvider,
    });

    act(() => {
      // setup by adding rows and renaming values
      result.current.addRow();
      result.current.addRow();
      result.current.renameValue(0, 0, "a");
      result.current.renameValue(1, 0, "b");
      result.current.renameValue(2, 0, "c");
      result.current.renameValue(0, 1, "d");
      result.current.renameValue(1, 1, "e");
      result.current.renameValue(2, 1, "f");

      // test
      result.current.deleteRow(3);
    });

    const expected = [
      { name: "Category 1", values: ["a", "d"] },
      { name: "Category 2", values: ["b", "e"] },
      { name: "Category 3", values: ["c", "f"] },
    ];

    expect(result.current.categories).toEqual(expected);
  });
});
