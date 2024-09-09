import { useState } from "react";
import "./App.css";
import { CategoriesProvider } from "./categories/CategoriesContext";
import { useCategories } from "./categories/useCategories";
import { UserPreferences } from "./preferences/UserPreferences";

const SHUFFLE_SPEED = 200;

function CategoryTitles() {
  const { categories, renameCategory } = useCategories();

  return categories.map((category, i) => (
    <input
      value={category.name}
      key={`category ${i} name`}
      aria-label={`category ${i + 1} name`}
      onChange={(e) => renameCategory(i, e.target?.value)}
    />
  ));
}

function nonEmptyValueIndicies(categories) {
  return categories.map((category) =>
    category.values
      .map((value, i) => [value, i])
      .filter(([v]) => v)
      .map(([, i]) => i),
  );
}

function Categories() {
  const { categories, renameValue, deleteRow } = useCategories();
  const rows = categories[0].values.map((_, i) =>
    categories.map((category) => category.values[i]),
  );

  const [choice, setChoice] = useState();
  // TODO: rename setInterval so I don't clash with window & btw test timers with https://vitest.dev/api/vi.html#vi-usefaketimers
  const [interval, setInterval] = useState();

  const handler = () => {
    if (interval) {
      // we call setChoice once more when stopping so the result is random and can't be timed
      setChoice(
        nonEmptyValueIndicies(categories).map(
          (values) => values[Math.floor(Math.random() * values.length)],
        ),
      );
      window.clearInterval(interval);
      setInterval(undefined);
    } else {
      setInterval(
        window.setInterval(() => {
          setChoice(
            nonEmptyValueIndicies(categories).map(
              (values) => values[Math.floor(Math.random() * values.length)],
            ),
          );
        }, SHUFFLE_SPEED),
      );
    }
  };

  const allColumnsHaveValues = nonEmptyValueIndicies(categories).every(
    (values) => values.length > 0,
  );

  return (
    <>
      <table>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`row-${i}`}>
              {row.map((cell, j) => (
                <td key={`cell-${j}`}>
                  <input
                    value={cell}
                    aria-label={`row ${i + 1}, column ${j + 1} value`}
                    onChange={(e) => renameValue(j, i, e.target?.value)}
                    style={
                      choice && choice[j] === i
                        ? { backgroundColor: "red" }
                        : undefined
                    }
                  />
                </td>
              ))}
              <td>
                <button onClick={() => deleteRow(i)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {allColumnsHaveValues ? null : <p>Column(s) cannot be empty</p>}
      <button disabled={!allColumnsHaveValues} onClick={handler}>
        {interval ? "Stop" : "Shuffle"}
      </button>
    </>
  );
}

function AddRowButton() {
  const { addRow } = useCategories();
  return <button onClick={addRow}>Add Row</button>;
}

function App() {
  return (
    <UserPreferences>
      <CategoriesProvider>
        <CategoryTitles />
        <Categories />
        <AddRowButton />
      </CategoriesProvider>
    </UserPreferences>
  );
}

export default App;
