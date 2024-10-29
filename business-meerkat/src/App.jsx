import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BadgeHelp } from "lucide-react";

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
    <div className="w-full flex gap-4 flex-col">
      <header className="flex-none flex gap-4 bg-primary text-white p-4 items-baseline">
        <h1 className="text-3xl font-bold">Business Meerkat</h1>
        <span className="flex-1" />
        <a href="https://equalexperts.com">
          <img src="/ee-logo.svg" className="h-6" />
        </a>
        <a href="#">
          <BadgeHelp />
        </a>
      </header>
      <main className="grid grid-cols-3 justify-items-center gap-4 p-4 flex-auto grid-rows-[max-content_1fr_max-content]">
        {dealt ? (
          <>
            <Button
              onClick={() => {
                setFlipped((cur) => [...cur].fill(false));
                setImageKeys(shuffle(CONFIG_CARDS).slice(0, flipped.length));
              }}
              className="col-span-3"
            >
              Deal Again
            </Button>
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
          </>
        ) : (
          <>
            <Button
              onClick={() => setDealt(true)}
              className="col-span-3 bg-primary hover:bg-primary/90"
            >
              Deal
            </Button>
            <div className="justify-self-stretch grid justify-items-center items-center">
              <div className="border rounded aspect-[421/703] max-h-[703px] w-full flex justify-center items-center">
                <p>Past</p>
              </div>
            </div>
            <div className="justify-self-stretch grid justify-items-center items-center">
              <div className="border rounded aspect-[421/703] max-h-[703px] w-full flex justify-center items-center">
                <p>Present</p>
              </div>
            </div>
            <div className="justify-self-stretch grid justify-items-center items-center">
              <div className="border rounded aspect-[421/703] max-h-[703px] w-full flex justify-center items-center">
                <p>Future</p>
              </div>
            </div>
          </>
        )}
        <p>
          This card is the perspective through which you should explain the
          history of the problem. Where did it come from and how did it evolve?
        </p>
        <p>
          This card is the current situation. Again, use the card for a
          perspective on why the problem is a problem now.
        </p>
        <p>
          This card represents the future. Use this perspective to say what
          night happen next.
        </p>
      </main>
    </div>
  );
}

export default App;
