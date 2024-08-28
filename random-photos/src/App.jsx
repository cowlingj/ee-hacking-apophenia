import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import './App.css'

const images = import.meta.glob(['./assets/images/*.jpg'])

function ImageAsset({ imageKey }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    images[imageKey]().then((module) => setSrc(module.default))
  }, [setSrc, imageKey]);

  if (src === null) {
    return <p>loading...</p>
  }

  return <img src={src} />
};

function NumberButton({ n, setCount, children, max = 5, ...rest }) {
  return <Button onClick={() => {setCount(n ?? Math.ceil(Math.random() * max))}} {...rest}>
    {children !== undefined ? children : `generate ${n} image${n !== 1 ? "s" : ""}`}
  </Button>
}

// Fisher-Yates shuffle
// https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [copy[i], copy[j]] = [copy[j], copy[i]]; 
  } 
  return copy; 
}

function App() {
  const [count, setCount] = useState(0);
  const [imageKeys, setImageKeys] = useState([]);

  useEffect(() => {
    setImageKeys(shuffle(Object.keys(images)).slice(0, count) )
  }, [count, setImageKeys]);

  return (
    <>
      <NumberButton n={1} setCount={(i) => { setCount(i); setImageKeys(shuffle(Object.keys(images)).slice(0, i))}} />
      <NumberButton n={2} setCount={(i) => { setCount(i); setImageKeys(shuffle(Object.keys(images)).slice(0, i))}} />
      <NumberButton n={3} setCount={(i) => { setCount(i); setImageKeys(shuffle(Object.keys(images)).slice(0, i))}} />
      <NumberButton n={4} setCount={(i) => { setCount(i); setImageKeys(shuffle(Object.keys(images)).slice(0, i))}} />
      <NumberButton n={5} setCount={(i) => { setCount(i); setImageKeys(shuffle(Object.keys(images)).slice(0, i))}} />
      <NumberButton setCount={(i) => { setCount(i); setImageKeys(shuffle(Object.keys(images)).slice(0, i))}} >
        Generate a random number of images
      </NumberButton>
      <br />
      { imageKeys.map(i => <ImageAsset key={i} imageKey={i} />) }
    </>
  )
}

export default App
