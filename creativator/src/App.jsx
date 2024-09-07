import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { CategoriesProvider, useCategories } from './CategoriesContext'
import { UserPreferences } from './UserPreferences'

function CategoryTitles() {
  const { categories, renameCategory } = useCategories();

  return categories.map((category, i) =>
      <input value={category.name} key={`category ${i} name`} aria-label={`category ${i + 1} name`} onChange={(e) => renameCategory(i, e.target?.value)} />
  );
}

function Categories() {
  const { categories, renameValue, deleteRow } = useCategories();
  const rows = categories[0].values.map((_, i) => categories.map(category => category.values[i]));

  const [ choice, setChoice ] = useState();
  const [ interval, setInterval ] = useState();

  const handler = () => {
    if (interval) { // FIXME: interval clearing race condition
      setTimeout(() => {
        window.clearInterval(interval)
        setInterval(undefined);
      }, Math.random() * 2000 + 3000);
    } else {
      setInterval(window.setInterval(() => {
        setChoice(categories.map(category => Math.floor(Math.random() * category.values.length)))
      }, 500))
    }
  }

  return <>
  <table>
    <tbody>
      {rows.map((row, i) => <tr key={`row-${i}`}>
        {row.map((cell, j) => <td key={`cell-${j}`}>
          <input
            value={cell}
            aria-label={`row ${i + 1}, column ${j + 1} value`}
            onChange={(e) => renameValue(j, i, e.target?.value)}
            style={ choice && choice[j] === i ? { backgroundColor: "red"} : undefined}
          />
        </td>)}
        <td>
          <button onClick={() => deleteRow(i)}>Delete</button>
        </td>
      </tr>)}
    </tbody>
  </table>
  <button onClick={handler}>{interval ? "Stop" : "Shuffle"}</button>
  </>
}

function AddRowButton() {
  const { addRow } = useCategories();
  return <button onClick={addRow}>Add Row</button>
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
  )
}

export default App
