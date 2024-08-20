import React, { Suspense, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const images = import.meta.glob(['./assets/images/*.jpg'])


function RandomImage({ index }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    Object.values(images)[Math.floor(Math.random() * Object.keys(images).length)]()
      .then((module) => setSrc(module.default))
  }, [setSrc, index]);

  if (src === null) {
    return <p>loading...</p>
  }

  return <img src={src} />
};

function App() {
  const [count, setCount] = useState(0)
  const [index, setIndex] = useState(null)

  return (
    <>
      <button
        onClick={() => {setIndex(Math.floor(Math.random() * Object.keys(images).length))}}
      >
        Random image
      </button>
      <br />
      {index && <RandomImage index={index} />}
    </>
  )
}

export default App
