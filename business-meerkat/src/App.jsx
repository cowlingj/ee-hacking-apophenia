import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [flipped, setFlipped] = useState([false, false, false]);
  const [imageKeys, setImageKeys] = useState(
    shuffle(CONFIG_CARDS).slice(0, flipped.length)
  );
  const [dealt, setDealt] = useState(false);

  return (
    <>
      <header className="flex-none flex gap-4 bg-primary p-4 items-baseline">
        <h1 className="text-3xl font-bold text-white">Business Meerkat</h1>
        <span className="flex-1" />
        <img src="/ee-logo.svg" className="h-6" />
      </header>
      <br />
      <main className="grid grid-cols-3 justify-items-center gap-4 p-4">
        {dealt ? (
          <>
            <p>Past</p>
            <p>Present</p>
            <p>Future</p>
            {flipped.map((f, i) => (
              <button
                key={i}
                disabled={flipped[i]}
                onClick={() =>
                  setFlipped((cur) => cur.map((v, j) => (i == j ? !v : v)))
                }
                className="grid items-center"
              >
                <img
                  src={f ? imageKeys[i] : "/card-back.png"}
                  className="m-auto row-start-1 col-start-1 peer"
                />
                {flipped[i] ? null : (
                  <p className="md:opacity-0 peer-hover:opacity-100 hover:opacity-100 row-start-1 col-start-1 m-2 text-foreground bg-accent rounded">
                    Turn
                  </p>
                )}
              </button>
            ))}
            <Button
              onClick={() => {
                setFlipped((cur) => [...cur].fill(false));
                setImageKeys(shuffle(CONFIG_CARDS).slice(0, flipped.length));
              }}
              className="col-span-3"
            >
              Deal Again
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setDealt(true)}
            className="col-span-3 text-foreground bg-accent hover:bg-accent/90"
          >
            Deal
          </Button>
        )}
      </main>
    </>
  );
}

export default App;
