import { useEffect, useMemo, useState } from "react";
import { CategoriesProvider } from "./categories/CategoriesContext";
import { useCategories } from "./categories/useCategories";
import { UserPreferences } from "./preferences/UserPreferences";
import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { BadgeHelp } from "lucide-react";

const SHUFFLE_SPEED = 200;
const SHUFFLE_DURATION = 3000;

function CategoryTitles() {
  const { categories, renameCategory } = useCategories();

  const [editMode, setEditMode] = useState(false);

  const categoryElements = categories.map((category, i) =>
    editMode ? (
      <Input
        value={category.name}
        key={`category ${i} name`}
        aria-label={`category ${i + 1} name`}
        className={`col-start-${i + 1}`}
        onChange={(e) => renameCategory(i, e.target?.value)}
      />
    ) : (
      <p
        key={`category ${i} name`}
        aria-label={`category ${i + 1} name`}
        className={`col-start-${i + 1} self-baseline text-foreground`}
      >
        {category.name}
      </p>
    )
  );

  categoryElements.push(
    <Button
      className="col-start-4 self-baseline"
      key="edit-mode"
      onClick={() => setEditMode((e) => !e)}
      variant="secondary"
    >
      {editMode ? "Done" : "Edit Categories"}
    </Button>
  );

  return categoryElements;
}

/**
 *
 * @param {import("./categories/useCategories").Category[]} categories
 * @returns {number[][]}
 */

function nonEmptyValueIndicies(categories) {
  return categories.map((category) =>
    category.values
      .map((value, i) => [value, i])
      .filter(([v]) => v)
      .map(([, i]) => i)
  );
}

// Fisher-Yates shuffle
// https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
/**
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function arrayEquals(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  return a.every((value, index) => value === b[index]);
}

/**
 *
 * @param {import("./categories/useCategories").Category[]} categories
 * @param {number[][] | undefined} filters
 * @returns {number[][]}
 */
function toChoices(categories, filters = []) {
  const [first, ...rest] = categories;

  if (!first) {
    return [];
  }

  /** @type {[string, number][][]} */
  const cartesianProduct = rest.reduce(
    (/** @type {[string, number][][]} */ prev, cur) =>
      cur.values.flatMap((v, i) => prev.map((row) => [...row, [v, i]])),
    first.values.map((v, i) => [[v, i]])
  );

  return cartesianProduct
    .filter(
      (row) => row.every(([value]) => value) // remove combinations with empty strings
    )
    .map(
      (row) => row.map(([, i]) => i) // get indecies
    )
    .filter(
      (row) => !filters.some((filter) => arrayEquals(filter, row)) // remove rows matching filters
    );
}

function Categories() {
  const { categories, renameValue, deleteRow } = useCategories();
  const [choice, setChoice] = useState({ index: undefined, value: undefined });
  const [previousChoice, setPreviousChoice] = useState({
    index: undefined,
    value: undefined,
  });
  const [spinning, setSpinning] = useState(false);

  const choices = useMemo(
    () =>
      shuffle(
        toChoices(
          categories,
          previousChoice.value ? [previousChoice.value] : []
        )
      ),
    [categories, previousChoice]
  );

  // if spinning set choices randomly
  useEffect(() => {
    if (!spinning) {
      return;
    }

    const interval = window.setInterval(() => {
      if (choices.length === 0) {
        return;
      }
      setChoice(({ index }) => {
        const newIndex = index !== undefined ? (index + 1) % choices.length : 0;
        return {
          index: newIndex,
          value: choices[newIndex],
        };
      });
    }, SHUFFLE_SPEED);

    return () => {
      clearInterval(interval);
      if (choices.length === 0) {
        return;
      }
      const i = Math.floor(Math.random() * choices.length);
      setChoice({ index: i, value: choices[i] });
      setPreviousChoice({ index: i, value: choices[i] });
    };
  }, [choices, spinning]);

  const handler = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), SHUFFLE_DURATION);
  };

  const allColumnsHaveValues = nonEmptyValueIndicies(categories).every(
    (values) => values.length > 0
  );

  return (
    <>
      <div className="grid h-full grid-cols-subgrid grid-auto-cols grid-flow-col col-span-4 my-auto h-full overflow-x-hidden overflow-y-scroll gap-y-2 content-start">
        {categories.flatMap((category, i) =>
          category.values.map((cell, j) => (
            <Input
              key={`category ${i + 1}, row ${j + 1}`}
              value={cell}
              aria-label={`row ${i + 1}, column ${j + 1} value`}
              onChange={(e) => renameValue(i, j, e.target?.value)}
              className={
                choice.value && choice.value[i] === j
                  ? `col-start-${i + 1} bg-ee-secondary`
                  : `col-start-${i + 1}`
              }
            />
          ))
        )}
        {categories[0].values.map((_, i) => (
          <Button
            variant="ghost"
            key={`delete row ${i}`}
            className="col-start-4  text-foreground"
            onClick={() => deleteRow(i)}
          >
            Delete
          </Button>
        ))}
      </div>

      {allColumnsHaveValues ? (
        <span className="col-span-4" />
      ) : (
        <p className="col-span-4 text-center">Column(s) cannot be empty</p>
      )}
      <div className="col-span-4 flex justify-around px-24 gap-4 lg:gap-48">
        <AddRowButton />
        <Button
          disabled={!allColumnsHaveValues || spinning}
          onClick={handler}
          className="bg-accent hover:bg-accent/80 text-accent-foreground flex-1"
        >
          {spinning ? "Spinning" : "Spin!"}
        </Button>
      </div>
    </>
  );
}

function AddRowButton() {
  const { addRow } = useCategories();
  return (
    <Button className="flex-1" onClick={addRow} variant="secondary">
      Add Row
    </Button>
  );
}

function App() {
  return (
    <UserPreferences>
      <CategoriesProvider>
        <div className="h-svh flex flex-col">
          <header className="flex-none flex gap-4 bg-primary text-white p-4 items-baseline">
            <h1 className="text-3xl font-bold">The Creativator</h1>
            <span className="flex-1" />
            <a href="https://equalexperts.com">
              <img src="/ee-logo.svg" className="h-6" />
            </a>
            <a href="#">
              <BadgeHelp />
            </a>
          </header>
          <main className="overflow-hidden pt-8 flex-1 w-dwh grid grid-cols-4 grid-cols-[1fr_1fr_1fr_min-content] grid-rows-[minmax(16px,max-content)_minmax(160px,80%)] auto-rows-[minmax(24px,max-content)] gap-x-2 lg:gap-x-4 gap-y-8 p-2">
            <CategoryTitles />
            <Categories />
          </main>
        </div>
      </CategoriesProvider>
    </UserPreferences>
  );
}

export default App;
