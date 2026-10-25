import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  Plus,
  Minus,
  X,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { priceFor, defaultSelection, options } from "./product.js";
gsap.registerPlugin(ScrollTrigger);
const Scene = lazy(() => import("./Scene.jsx"));
const chapterStarts = [0, 0.35];
const chapters = [
  [
    "THE SIGNATURE",
    "Pleasure,",
    "in every layer.",
    "Belgian chocolate. Three impossibly rich layers. One beautiful obsession.",
  ],
  [
    "THE REVEAL",
    "Made to be",
    "taken apart.",
    "A slice draws away. Dark sponge meets a silk-soft chocolate cream; every layer has its moment.",
  ],
  [
    "THE ELEMENTS",
    "Nothing extra.",
    "Nothing ordinary.",
    "Deep cocoa. Cultured butter. Cream. The quiet alchemy of exceptional ingredients.",
  ],
  [
    "THE RITUAL",
    "A beautiful",
    "coming together.",
    "A slow turn of the whisk. Chocolate becomes silk. The beginning of something extraordinary.",
  ],
  [
    "THE TRANSFORMATION",
    "Time. Warmth.",
    "A little wonder.",
    "From a delicate batter to a tender crumb. A transformation worth waiting for.",
  ],
  [
    "THE FINISH",
    "Layered with",
    "intention.",
    "Sponge, cream, ganache. Chocolate upon chocolate, finished with a generous scattering of curls.",
  ],
  [
    "THE CEREMONY",
    "Some things",
    "deserve a ribbon.",
    "A final flourish. A quiet statement. The pleasure of giving something truly considered.",
  ],
].slice(0, 2);
class SceneBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}
function Fallback() {
  return (
    <div className="fallback">
      <span>VC</span>
      <p>The signature chocolate cake</p>
      <small>
        Interactive 3D is unavailable on this device.
        <br />
        Explore the story and collection below.
      </small>
    </div>
  );
}
function App() {
  const story = useRef(),
    progress = useRef(0),
    [active, setActive] = useState(0),
    [loaded, setLoaded] = useState(false),
    [menu, setMenu] = useState(false),
    [selection, setSelection] = useState(defaultSelection),
    [bag, setBag] = useState([]),
    [bagOpen, setBagOpen] = useState(false),
    [notice, setNotice] = useState("");
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const total = priceFor(selection);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(q.matches);
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    progress.current = 0;
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        onUpdate: () => {
          const value = progress.current;
          setActive(
            Math.max(
              0,
              chapterStarts.findLastIndex((start) => value >= start),
            ),
          );
          document.documentElement.style.setProperty(
            "--journey",
            `${value * 100}%`,
          );
        },
        scrollTrigger: {
          trigger: story.current,
          start: "top top",
          end: "bottom bottom",
          scrub: reduced ? true : 0.7,
        },
      });
      timeline.to(progress, { current: 1, ease: "none", duration: 1 });
    }, story);
    setLoaded(true);
    return () => ctx.revert();
  }, [reduced]);
  useEffect(() => {
    if (!bagOpen) return;
    const prev = document.activeElement;
    const dialog = document.querySelector(".bag-panel");
    const focusable = () => [...dialog.querySelectorAll("button,a")];
    focusable()[0]?.focus();
    const handle = (e) => {
      if (e.key === "Escape") setBagOpen(false);
      if (e.key === "Tab") {
        const a = focusable(),
          first = a[0],
          last = a.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = old;
      prev?.focus();
    };
  }, [bagOpen]);
  const jump = (i) => {
    const top =
      story.current.offsetTop +
      (story.current.offsetHeight - window.innerHeight) *
        (chapterStarts[i] + 0.015);
    window.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
  };
  return (
    <main>
      <header className="topbar">
        <a href="#home" className="brand" aria-label="Velvet Crumb home">
          VELVET CRUMB<span>THE CHOCOLATE ATELIER</span>
        </a>
        <nav className={menu ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="#journey" onClick={() => setMenu(false)}>
            The experience
          </a>
          <a href="#collection" onClick={() => setMenu(false)}>
            The signature
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="bag-button"
            onClick={() => setBagOpen(true)}
            aria-label={`Open demo bag, ${bag.length} items`}
          >
            <ShoppingBag size={16} />
            <span>BAG ({bag.length})</span>
          </button>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label="Toggle navigation"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <section
        ref={story}
        id="home"
        className="journey"
        aria-label="The signature and cutting experience"
      >
        <div className="stage" id="journey">
          <div
            className="stage-art"
            aria-label="Scroll-controlled chocolate cake and baking study"
          >
            {loaded && (
              <SceneBoundary>
                <Suspense
                  fallback={
                    <div className="loading">
                      Preparing the chocolate atelier…
                    </div>
                  }
                >
                  <Scene progress={progress} reduced={reduced} />
                </Suspense>
              </SceneBoundary>
            )}
          </div>
          <div className="stage-grain" />
          <div className="chapter-top">
            <span>AN EXPLORATION IN CHOCOLATE</span>
            <span>SCROLL-DRIVEN STUDY · NO. 001</span>
          </div>
          <div className="chapter-copy" key={active}>
            <div className="eyebrow">
              <span className="short-line" />{" "}
              {String(active + 1).padStart(2, "0")} / {chapters[active][0]}
            </div>
            <h1>
              {chapters[active][1]}
              <br />
              <em>{chapters[active][2]}</em>
            </h1>
            <p>{chapters[active][3]}</p>
            {active === 0 ? (
              <button className="text-link" onClick={() => jump(1)}>
                DISCOVER WHAT’S INSIDE <ArrowUpRight size={16} />
              </button>
            ) : (
              <a className="text-link" href="#collection">
                MAKE IT YOURS <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <div className="product-note">
            <span className="star">✧</span>
            <div>
              THE BELGIAN
              <br />
              CHOCOLATE LAYER CAKE
              <small>RICH BY NATURE. VELVET BY DESIGN.</small>
            </div>
          </div>
          <div className="stage-bottom">
            <button
              className="scroll-invitation"
              onClick={() =>
                active < chapters.length - 1
                  ? jump(active + 1)
                  : document.getElementById("collection").scrollIntoView({
                      behavior: reduced ? "instant" : "smooth",
                    })
              }
            >
              <span className="scroll-circle">
                <ArrowDown size={17} />
              </span>
              <span>
                SCROLL TO SAVOUR<small>THE SIGNATURE / THE REVEAL</small>
              </span>
            </button>
            <div className="chapter-nav" aria-label="Journey chapters">
              {chapters.map((c, i) => (
                <button
                  key={c[0]}
                  className={active === i ? "current" : ""}
                  aria-label={`Chapter ${i + 1}: ${c[0]}`}
                  aria-current={active === i ? "step" : undefined}
                  onClick={() => jump(i)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
            <span className="vertical-note">SLOW DOWN. INDULGE.</span>
          </div>
          <div className="progress-track">
            <div />
          </div>
        </div>
        <div className="sr-only">
          {chapters.map((c, i) => (
            <section key={c[0]}>
              <h2>
                Chapter {i + 1}: {c[0]}
              </h2>
              <p>{c.slice(1).join(" ")}</p>
            </section>
          ))}
        </div>
      </section>
      <section className="manifesto">
        <span className="eyebrow">THE ART OF A LITTLE MORE</span>
        <h2>
          Some pleasures
          <br />
          are worth <em>slowing down for.</em>
        </h2>
        <p>
          Deeply chocolate. Delicately balanced. Made for the moments you want
          to keep.
        </p>
        <div className="ingredient-line">
          <span>01 / BELGIAN CHOCOLATE</span>
          <span>02 / CULTURED BUTTER</span>
          <span>03 / SILK-SOFT GANACHE</span>
        </div>
      </section>
      <section id="collection" className="collection">
        <div className="collection-intro">
          <span className="eyebrow">YOUR OWN LITTLE EXTRAORDINARY</span>
          <h2>
            The signature.
            <br />
            <em>Your way.</em>
          </h2>
          <p>Build your perfect chocolate moment.</p>
          <div className="seal">
            VC
            <span>
              THE SIGNATURE
              <br />
              NO. 001
            </span>
          </div>
          <p className="demo-note">
            An interactive portfolio concept.
            <br />
            All prices and bag actions are demonstrations.
            <br />
            No orders or payments are processed.
          </p>
        </div>
        <div className="customizer">
          {Object.entries(options).map(([key, values], i) => (
            <fieldset key={key}>
              <legend>
                <span>0{i + 1}</span> {key}
              </legend>
              <div className="choice-row">
                {values.map(({ name, price }) => (
                  <button
                    key={name}
                    aria-pressed={selection[key] === name}
                    className={selection[key] === name ? "selected" : ""}
                    onClick={() => {
                      setSelection((s) => ({ ...s, [key]: name }));
                      setNotice("");
                    }}
                  >
                    {name}
                    {price > 0 && <small>+${price}</small>}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="price-row">
            <div>
              <small>YOUR DEMO CREATION</small>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button
              className="primary"
              onClick={() => {
                setBag((b) => [
                  ...b,
                  { ...selection, price: total, id: crypto.randomUUID() },
                ]);
                setNotice("Your creation has been added to the demo bag.");
              }}
            >
              ADD TO DEMO BAG <Plus size={18} />
            </button>
          </div>
          <p className="live-notice" role="status">
            {notice || "Made to imagine. No checkout required."}
          </p>
        </div>
      </section>
      <footer>
        <div className="footer-top">
          <span>AN OBSESSION, BEAUTIFULLY LAYERED.</span>
          <a href="#home">
            BACK TO THE BEGINNING <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="footer-wordmark">
          VELVET CRUMB<span>®</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 · A CREATIVE PORTFOLIO STUDY</span>
          <span>CHOCOLATE, CONSIDERED.</span>
          <a
            href="https://github.com/contactteamiqra-ai/velvet-crumb"
            target="_blank"
            rel="noreferrer"
          >
            VIEW THE PROJECT ↗
          </a>
        </div>
      </footer>
      {bagOpen && (
        <div className="bag-backdrop" onClick={() => setBagOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            className="bag-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-bag"
              aria-label="Close bag"
              onClick={() => setBagOpen(false)}
            >
              <X />
            </button>
            <span className="eyebrow">THE COLLECTION</span>
            <h2 id="bag-title">Your demo bag.</h2>
            {bag.length === 0 ? (
              <p>Your next little pleasure is waiting.</p>
            ) : (
              <>
                <ul>
                  {bag.map((item) => (
                    <li key={item.id}>
                      <strong>
                        {item.Flavour} · {item.Size}
                      </strong>
                      <p>
                        {item.Frosting} / {item.Topping}
                      </p>
                      <div>
                        <span>${item.price.toFixed(2)}</span>
                        <button
                          onClick={() =>
                            setBag((b) => b.filter((x) => x.id !== item.id))
                          }
                          aria-label={`Remove ${item.Flavour} cake`}
                        >
                          <Minus size={14} /> Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="bag-total">
                  Demo total{" "}
                  <strong>
                    ${bag.reduce((a, b) => a + b.price, 0).toFixed(2)}
                  </strong>
                </div>
              </>
            )}
            <p className="demo-note">
              Portfolio demonstration only. Checkout is unavailable; nothing
              will be charged.
            </p>
            <button
              className="primary"
              onClick={() => {
                setBagOpen(false);
                document.getElementById("collection").scrollIntoView();
              }}
            >
              CONTINUE CREATING <ArrowUpRight size={16} />
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
export default App;
