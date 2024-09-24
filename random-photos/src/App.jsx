import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PropTypes } from "prop-types";

const images = import.meta.glob(["./assets/images/*.jpg"]);

function ImageAsset({ imageKey }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    images[imageKey]().then((module) => setSrc(module.default));
  }, [setSrc, imageKey]);

  if (src === null) {
    return <p>loading...</p>;
  }

  return (
    <div className="bg-slate-200 flex justify-center content-center">
      <img src={src} />
    </div>
  );
}

function NumberButton({ n, setCount, children, max = 5, ...rest }) {
  return (
    <Button
      onClick={() => {
        setCount(n ?? Math.ceil(Math.random() * max));
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}

const buttonLabels = ["One", "Two", "Three", "Four", "Five"];
function ButtonPanel({ setCount }) {
  const buttons = buttonLabels.map((label, i) => (
    <NumberButton key={label} n={i + 1} setCount={setCount}>
      {label}
    </NumberButton>
  ));

  buttons.push(
    <NumberButton key={"surprise"} setCount={setCount}>
      Surprise Me!
    </NumberButton>
  );

  return (
    <main className="grid lg:grid-cols-3 gap-4 p-4">
      <h1 className="col-span-full text-center">
        How many random images would you like?
      </h1>
      {buttons}
    </main>
  );
}

ButtonPanel.propTypes = {
  setCount: PropTypes.func.isRequired,
};

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
    setImageKeys(shuffle(Object.keys(images)).slice(0, count));
  }, [count, setImageKeys]);

  return (
    <>
      <header className="flex-none flex gap-4 bg-primary p-4 items-baseline">
        <h1 className="text-3xl font-bold text-white">Random Photos</h1>
        <span className="flex-1" />
        <img src="/ee-logo.svg" className="h-6" />
      </header>
      {count === 0 ? <ButtonPanel setCount={setCount} /> : null}
      <br />

      {count !== 0 ? (
        <>
          <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 justify-items-strech align-items-strech">
            {imageKeys.map((i) => (
              <ImageAsset key={i} imageKey={i} />
            ))}
          </main>
          <aside className="col-span-full flex justify-center px-4 pb-4">
            <NumberButton
              n={0}
              setCount={(i) => {
                setCount(i);
                setImageKeys([]);
              }}
            >
              Play Again
            </NumberButton>
          </aside>
        </>
      ) : null}
    </>
  );
}

export default App;
