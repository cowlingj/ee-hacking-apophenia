import { useState } from "react";
import { CategoriesProvider } from "./categories/CategoriesContext";
import { useCategories } from "./categories/useCategories";
import { UserPreferences } from "./preferences/UserPreferences";
import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";

const SHUFFLE_SPEED = 200;

function CategoryTitles() {
  const { categories, renameCategory } = useCategories();

  const [editMode, setEditMode] = useState(false);

  const categoryElements = categories.map((category, i) =>
    editMode ? (
      <Input
        value={category.name}
        key={`category ${i} name`}
        aria-label={`category ${i + 1} name`}
        className={`col-start-${i + 1} row-start-2`}
        onChange={(e) => renameCategory(i, e.target?.value)}
      />
    ) : (
      <p
        key={`category ${i} name`}
        aria-label={`category ${i + 1} name`}
        className={`col-start-${i + 1} row-start-2`}
      >
        {category.name}
      </p>
    )
  );

  categoryElements.push(
    <Button
      className="col-start-4 row-start-2"
      key="edit-mode"
      onClick={() => setEditMode((e) => !e)}
    >
      {editMode ? "Done" : "Edit Categories"}
    </Button>
  );

  return categoryElements;
}

function nonEmptyValueIndicies(categories) {
  return categories.map((category) =>
    category.values
      .map((value, i) => [value, i])
      .filter(([v]) => v)
      .map(([, i]) => i)
  );
}

function Categories() {
  const { categories, renameValue, deleteRow } = useCategories();
  const rows = categories[0].values.map((_, i) =>
    categories.map((category) => category.values[i])
  );

  const [choice, setChoice] = useState();
  // TODO: rename setInterval so I don't clash with window & btw test timers with https://vitest.dev/api/vi.html#vi-usefaketimers
  const [interval, setInterval] = useState();

  const handler = () => {
    if (interval) {
      // we call setChoice once more when stopping so the result is random and can't be timed
      setChoice(
        nonEmptyValueIndicies(categories).map(
          (values) => values[Math.floor(Math.random() * values.length)]
        )
      );
      window.clearInterval(interval);
      setInterval(undefined);
    } else {
      setInterval(
        window.setInterval(() => {
          setChoice(
            nonEmptyValueIndicies(categories).map(
              (values) => values[Math.floor(Math.random() * values.length)]
            )
          );
        }, SHUFFLE_SPEED)
      );
    }
  };

  const allColumnsHaveValues = nonEmptyValueIndicies(categories).every(
    (values) => values.length > 0
  );

  return (
    <>
      <table className="grid grid-cols-subgrid col-span-4 my-auto h-full">
        <tbody className="grid grid-cols-subgrid col-span-4 my-auto auto-rows-max overflow-x-hidden overflow-y-scroll h-full">
          {rows.map((row, i) => (
            <tr key={`row-${i}`} className="grid grid-cols-subgrid col-span-4">
              {row.map((cell, j) => (
                <td key={`cell-${j}`}>
                  <Input
                    value={cell}
                    aria-label={`row ${i + 1}, column ${j + 1} value`}
                    onChange={(e) => renameValue(j, i, e.target?.value)}
                    className={
                      choice && choice[j] === i ? "bg-red-600 text-white" : null
                    }
                  />
                </td>
              ))}
              <td>
                <Button onClick={() => deleteRow(i)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {allColumnsHaveValues ? null : (
        <p className="col-span-4 text-center">Column(s) cannot be empty</p>
      )}
      <div className="col-span-4 flex justify-around px-24 gap-48">
        <AddRowButton />
        <Button
          disabled={!allColumnsHaveValues}
          onClick={handler}
          className={"bg-red-600 flex-1"}
        >
          {interval ? "Stop" : "Spin!"}
        </Button>
      </div>
    </>
  );
}

function AddRowButton() {
  const { addRow } = useCategories();
  return (
    <Button className="flex-1" onClick={addRow}>
      Add Row
    </Button>
  );
}

function App() {
  return (
    <UserPreferences>
      <CategoriesProvider>
        <main className="h-svh w-dwh grid grid-cols-4 grid-cols-[1fr_1fr_1fr_minmax(160px,max-content)] grid-rows-[minmax(16px,max-content)_minmax(16px,max-content)_minmax(160px,80%)] gap-x-4 gap-y-8 p-2">
          <h1 className="text-3xl font-bold pb-8">The Creativator</h1>
          <CategoryTitles />
          <Categories />
        </main>
      </CategoriesProvider>
    </UserPreferences>
  );
}

export default App;
