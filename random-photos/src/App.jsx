import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PropTypes } from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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

ImageAsset.propTypes = {
  imageKey: PropTypes.string.isRequired,
};

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

NumberButton.propTypes = {
  n: PropTypes.number,
  setCount: PropTypes.func.isRequired,
  children: PropTypes.node,
  max: PropTypes.number,
};

const buttonLabels = ["One", "Two", "Three", "Four", "Five"];
function ButtonPanel({ setCount }) {
  const buttons = buttonLabels.map((label, i) => (
    <NumberButton
      key={label}
      n={i + 1}
      setCount={setCount}
      className="bg-secondary hover:bg-secondary/90"
    >
      {label}
    </NumberButton>
  ));

  buttons.push(
    <NumberButton
      key={"surprise"}
      setCount={setCount}
      className="text-foreground bg-accent hover:bg-accent/90"
    >
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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setImageKeys(shuffle(Object.keys(images)).slice(0, count));
  }, [count, setImageKeys]);

  return (
    <Dialog>
      <DialogContent className="p-0">
        <VisuallyHidden asChild>
          <DialogTitle>Viewing Image</DialogTitle>
        </VisuallyHidden>
        {selectedImage !== null ? (
          <ImageAsset imageKey={selectedImage} />
        ) : (
          "loading..."
        )}
      </DialogContent>
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
            {imageKeys.map((k) => (
              <DialogTrigger key={k} asChild>
                <div onClick={() => setSelectedImage(k)}>
                  <ImageAsset imageKey={k} />
                </div>
              </DialogTrigger>
            ))}
          </main>
          <aside className="col-span-full flex justify-center px-4 pb-4">
            <NumberButton
              n={0}
              setCount={setCount}
              className="text-foreground bg-accent hover:bg-accent/90"
            >
              Play Again
            </NumberButton>
          </aside>
        </>
      ) : null}
    </Dialog>
  );
}

export default App;
