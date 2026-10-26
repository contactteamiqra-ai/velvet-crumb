import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ArrowDown,
  ShoppingBag,
  Menu,
  X,
  Plus,
  Minus,
  Leaf,
  Gift,
  Truck,
  Sparkles,
  Check,
} from "lucide-react";
import "./styles.css";
gsap.registerPlugin(ScrollTrigger);
const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );
import { products } from "./products";

import { Photo, Brand, Modal, ProductCard } from "./components";

function App() {
  const [menu, setMenu] = useState(false),
    [category, setCategory] = useState("All delights"),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [step, setStep] = useState(0),
    [request, setRequest] = useState(null);
  const [bag, setBag] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem("velvet-bag"));
      return Object.fromEntries(
        Object.entries(data || {}).filter(
          ([id, q]) =>
            products.some((p) => p.id === id) &&
            Number.isInteger(q) &&
            q > 0 &&
            q <= 99,
        ),
      );
    } catch {
      return {};
    }
  });
  const count = Object.values(bag).reduce((a, b) => a + b, 0),
    total = products.reduce((sum, p) => sum + p.price * (bag[p.id] || 0), 0);
  useEffect(() => {
    try {
      localStorage.setItem("velvet-bag", JSON.stringify(bag));
    } catch {}
  }, [bag]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-copy > *", {
        opacity: 0,
        y: 26,
        duration: 1,
        stagger: 0.13,
        ease: "power2.out",
      });
      gsap.utils.toArray(".reveal").forEach((el) =>
        gsap.from(el, {
          y: 35,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        }),
      );
      gsap.to(".hero-photo img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(".signature-photo img", {
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: ".signature",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
    return () => mm.revert();
  }, []);
  const add = (id) => {
    setBag((b) => ({ ...b, [id]: Math.min((b[id] || 0) + 1, 99) }));
    setToast("A little delight added to your bag");
  };
  const quantity = (id, delta) =>
    setBag((b) => {
      const next = { ...b, [id]: Math.min(99, (b[id] || 0) + delta) };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  function download() {
    const lines = [
      "VELVET CRUMB — REQUEST SUMMARY",
      "This is a request draft, not a confirmed order.",
      "",
      ...(request
        ? Object.entries(request).map(([k, v]) => `${k}: ${v}`)
        : products
            .filter((p) => bag[p.id])
            .map(
              (p) => `${bag[p.id]} × ${p.name} — ${money(p.price * bag[p.id])}`,
            )),
      ...(!request ? ["", `Estimated subtotal: ${money(total)}`] : []),
      "",
      "Delivery, availability and final pricing require bakery confirmation.",
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join("\n")], { type: "text/plain" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "velvet-crumb-request.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <div className="announcement">
        A little everyday luxury. A beautiful reason to celebrate.{" "}
        <span>✧</span>
      </div>
      <header>
        <Brand />
        <nav className={menu ? "nav open" : "nav"} aria-label="Main navigation">
          {[
            ["Our collection", "collection"],
            ["Our story", "story"],
            ["The art of baking", "craft"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="bag-button"
            onClick={() => {
              setRequest(null);
              setModal("bag");
            }}
            aria-label={`Open bag, ${count} items`}
          >
            <ShoppingBag size={19} />
            <span className="bag-count">{count}</span>
          </button>
          <button
            className="header-order"
            onClick={() => {
              setRequest(null);
              setModal("custom");
            }}
          >
            Order a cake <ArrowUpRight size={16} />
          </button>
          <button
            className="icon-button mobile-toggle"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
            aria-expanded={menu}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="tiny-star">✧</span> THE SWEET SIDE OF SLOW LIVING
            </div>
            <h1>
              A little crumb.
              <br />A little <em>magic.</em>
            </h1>
            <p>
              Beautifully baked cakes and little indulgences.
              <br className="desktop-break" /> Made for ordinary days and
              extraordinary moments.
            </p>
            <div className="hero-buttons">
              <a className="button dark" href="#collection">
                Explore desserts <ArrowUpRight size={18} />
              </a>
              <button
                className="text-button"
                onClick={() => {
                  setRequest(null);
                  setModal("custom");
                }}
              >
                Order your cake <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="hero-footnote">
              <span className="line-star">✧</span>
              <span>
                Thoughtfully made.
                <br />
                <strong>Joyfully savoured.</strong>
              </span>
            </div>
          </div>
          <div className="hero-photo">
            <Photo
              name="hero"
              eager
              alt="Chocolate celebration cake topped with piped chocolate cream"
            />
            <div className="photo-shade" />
            <div className="round-stamp">
              A LITTLE LUXURY<span>✧</span>IN EVERY LAYER
            </div>
            <div className="hero-image-caption">
              <span>THE ART OF SOMETHING SWEET</span>
              <span>01 — VELVET CRUMB</span>
            </div>
          </div>
          <a className="scroll-link" href="#story">
            <ArrowDown size={15} /> SCROLL TO SAVOUR
          </a>
        </section>
        <div className="values-ribbon">
          <span>Good ingredients</span>
          <i>✧</i>
          <span>Beautiful little details</span>
          <i>✧</i>
          <span>Baked with intention</span>
          <i>✧</i>
          <span>Made for your moments</span>
        </div>
        <section id="story" className="intro section-pad reveal">
          <span className="eyebrow">WELCOME TO VELVET CRUMB</span>
          <h2>
            Life is sweeter
            <br />
            with <em>something special.</em>
          </h2>
          <p>
            The first bite. The last crumb. The moment you wish would last a
            little longer. We believe a beautiful dessert can turn even the
            simplest day into an occasion.
          </p>
          <span className="signature-script">With love, Velvet Crumb</span>
        </section>
        <section className="signature" aria-labelledby="signature-title">
          <div className="signature-photo">
            <Photo
              name="chocolate"
              alt="Rich chocolate cake with smooth ganache and chocolate details"
            />
            <span className="image-note">RICH. SILKY. UNFORGETTABLE.</span>
          </div>
          <div className="signature-copy reveal">
            <span className="eyebrow">MEET OUR SIGNATURE · NO. 01</span>
            <h2 id="signature-title">
              Chocolate,
              <br />
              in its <em>finest form.</em>
            </h2>
            <p>
              Deep cocoa. Delicate layers. A slow, silky finish. The Velvet Noir
              is our love letter to chocolate — indulgent, beautifully balanced,
              and always worth another bite.
            </p>
            <div className="cake-details">
              <span>
                <strong>Dark cocoa</strong>
                <small>A beautifully rich sponge</small>
              </span>
              <span>
                <strong>Silky ganache</strong>
                <small>A melt-away finish</small>
              </span>
            </div>
            <button className="button dark" onClick={() => add("noir")}>
              Discover Velvet Noir · $48 <ArrowUpRight size={17} />
            </button>
          </div>
        </section>
        <section id="collection" className="collection section-pad">
          <div className="section-top reveal">
            <div>
              <span className="eyebrow">FIND YOUR LITTLE INDULGENCE</span>
              <h2>
                The sweetest <em>collection.</em>
              </h2>
            </div>
            <p>
              For the table. For the celebration.
              <br />
              Or simply, just for you.
            </p>
          </div>
          <div className="filters" aria-label="Filter desserts">
            {["All delights", "Cakes", "Pastries", "Cupcakes", "Cookies"].map(
              (c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ),
            )}
          </div>
          <div className="product-grid">
            {products
              .filter(
                (p) => category === "All delights" || p.category === category,
              )
              .map((p) => (
                <ProductCard product={p} onAdd={add} key={p.id} />
              ))}
          </div>
          <p className="collection-note">
            A thoughtfully imagined menu · Sample prices in USD · Allergen
            details available below
          </p>
        </section>
        <section id="craft" className="craft section-pad">
          <div className="craft-heading reveal">
            <span className="eyebrow">
              FROM SIMPLE THINGS, SOMETHING WONDERFUL
            </span>
            <h2>
              A little patience.
              <br />
              <em>A lot of pleasure.</em>
            </h2>
            <p>
              Follow the rhythm of the bake. From the first fold to the final
              flourish, every little detail has its moment.
            </p>
          </div>
          <div
            className="craft-stage"
            role="tabpanel"
            id="craft-panel"
            aria-label={["Mix & fold", "Rise & bake", "Frost & finish"][step]}
          >
            <Photo
              key={step}
              name={["chocolate", "croissant", "cupcake"][step]}
              alt={
                [
                  "Chocolate and cocoa textures",
                  "Golden layers of freshly baked pastry",
                  "Delicately finished frosting",
                ][step]
              }
            />
            <div className="craft-overlay" />
            <span className="craft-big-number">0{step + 1}</span>
            <div className="craft-caption">
              <small>THE VELVET CRUMB RITUAL</small>
              <h3>
                {
                  [
                    "Start with something good.",
                    "Let warmth work its magic.",
                    "Finish with a little flourish.",
                  ][step]
                }
              </h3>
            </div>
          </div>
          <div
            className="craft-tabs"
            role="tablist"
            aria-label="The baking ritual"
          >
            {[
              ["01", "Mix & fold", "Rich ingredients, brought together."],
              ["02", "Rise & bake", "Slow warmth. Golden perfection."],
              ["03", "Frost & finish", "The details make the difference."],
            ].map(([n, title, copy], i) => (
              <button
                aria-controls="craft-panel"
                role="tab"
                aria-selected={step === i}
                tabIndex={step === i ? 0 : -1}
                onKeyDown={(event) => {
                  const targets = {
                    ArrowRight: (i + 1) % 3,
                    ArrowLeft: (i + 2) % 3,
                    Home: 0,
                    End: 2,
                  };
                  if (event.key in targets) {
                    event.preventDefault();
                    const next = targets[event.key];
                    setStep(next);
                    event.currentTarget.parentElement.children[next].focus();
                  }
                }}
                key={n}
                className={step === i ? "active" : ""}
                onClick={() => setStep(i)}
              >
                <span>{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
        </section>
        <section className="best section-pad">
          <div className="best-copy reveal">
            <span className="eyebrow">THE ONES YOU'LL COME BACK FOR</span>
            <h2>
              Some things
              <br />
              are simply <em>irresistible.</em>
            </h2>
            <p>
              A golden, shattering crust. A soft, buttery centre. Our morning
              favourites make a beautiful ritual out of the everyday.
            </p>
            <button
              className="text-button"
              onClick={() => {
                setCategory("Pastries");
                document
                  .getElementById("collection")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Meet your new favourites <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="best-photo">
            <Photo name="croissant" alt="Golden, flaky croissants" />
            <span className="best-label">
              THE MORNING EDIT <span>FROM $5</span>
            </span>
          </div>
        </section>
        <section className="quality section-pad">
          <div className="quality-title">
            <span className="eyebrow">IT'S THE LITTLE THINGS</span>
            <h2>
              Beautiful inside. <em>And out.</em>
            </h2>
          </div>
          <div className="quality-grid">
            {[
              [
                Leaf,
                "Goodness comes first",
                "Real butter, rich cocoa, and thoughtfully chosen ingredients.",
              ],
              [
                Sparkles,
                "A taste of care",
                "Small details and carefully balanced flavours in every bite.",
              ],
              [
                Gift,
                "Dressed for the occasion",
                "Thoughtful finishes for gifts and celebrations.",
              ],
              [
                Truck,
                "Made for your moment",
                "Custom cake requests and delivery preferences, all in one place.",
              ],
            ].map(([Icon, title, copy]) => (
              <div key={title}>
                <Icon strokeWidth={1.2} size={30} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="celebrate section-pad reveal">
          <span className="eyebrow">
            YOUR OCCASION. OUR SWEETEST INSPIRATION.
          </span>
          <h2>
            Make a moment
            <br />
            <em>of it.</em>
          </h2>
          <p>
            Birthdays, big news, or a beautiful just-because.
            <br />
            Let's dream up something delicious.
          </p>
          <button
            className="button dark"
            onClick={() => {
              setRequest(null);
              setModal("custom");
            }}
          >
            Create your celebration cake <ArrowUpRight size={18} />
          </button>
          <span className="celebrate-star">✧</span>
        </section>
      </main>
      <footer>
        <div className="footer-main">
          <div>
            <Brand />
            <p>
              A little everyday luxury.
              <br />
              Down to the very last crumb.
            </p>
          </div>
          <div>
            <span className="eyebrow">EXPLORE</span>
            <a href="#collection">The collection</a>
            <a href="#story">Our story</a>
            <a href="#craft">The art of baking</a>
          </div>
          <div>
            <span className="eyebrow">GOOD TO KNOW</span>
            <button onClick={() => setModal("allergens")}>
              Ingredients & allergens
            </button>
            <button onClick={() => setModal("delivery")}>
              Ordering & delivery
            </button>
            <button
              onClick={() => {
                setRequest(null);
                setModal("custom");
              }}
            >
              Custom celebrations
            </button>
          </div>
          <div className="footer-note">
            <span>✧</span>
            <p>
              Life's little pleasures,
              <br />
              <em>beautifully baked.</em>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Velvet Crumb</span>
          <span>Concept bakery · Illustrative menu and prices</span>
          <a href="#home">BACK TO TOP ↑</a>
        </div>
      </footer>
      <div className="toast" role="status">
        {toast && (
          <>
            <Check size={17} />
            {toast}
          </>
        )}
      </div>
      {modal && (
        <Modal
          title={
            modal === "bag"
              ? "Your little luxuries"
              : modal === "custom"
                ? "A cake for your moment"
                : modal === "allergens"
                  ? "Ingredients & allergens"
                  : "Ordering & delivery"
          }
          onClose={() => setModal(null)}
        >
          {modal === "bag" ? (
            <>
              {count ? (
                <>
                  <div className="bag-items">
                    {products
                      .filter((p) => bag[p.id])
                      .map((p) => (
                        <div className="bag-item" key={p.id}>
                          <Photo name={p.image} alt={p.name} />
                          <div>
                            <h3>{p.name}</h3>
                            <span>{money(p.price)}</span>
                            <div className="quantity">
                              <button
                                aria-label={`Remove one ${p.name}`}
                                onClick={() => quantity(p.id, -1)}
                              >
                                <Minus size={14} />
                              </button>
                              <span>{bag[p.id]}</span>
                              <button
                                aria-label={`Add one ${p.name}`}
                                disabled={bag[p.id] >= 99}
                                onClick={() => quantity(p.id, 1)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <strong>{money(p.price * bag[p.id])}</strong>
                        </div>
                      ))}
                  </div>
                  <div className="subtotal">
                    <span>Estimated subtotal</span>
                    <strong>{money(total)}</strong>
                  </div>
                  <p className="form-note">
                    This concept store does not accept payments or submit
                    orders. Save your selection as a request draft. Delivery and
                    availability need bakery confirmation.
                  </p>
                  <button className="button dark wide" onClick={download}>
                    Download request summary <ArrowDown size={17} />
                  </button>
                </>
              ) : (
                <div className="empty-bag">
                  <ShoppingBag size={40} strokeWidth={1} />
                  <h3>A little room for something sweet.</h3>
                  <button
                    className="button dark"
                    onClick={() => {
                      setModal(null);
                      document.getElementById("collection").scrollIntoView();
                    }}
                  >
                    Explore the collection <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : modal === "custom" ? (
            request ? (
              <div className="request-ready">
                <Check size={35} />
                <h3>Your cake brief is ready.</h3>
                <p>
                  Download your brief to share with a bakery. Nothing has been
                  submitted and no order is confirmed.
                </p>
                <button className="button dark wide" onClick={download}>
                  Download your cake brief <ArrowDown size={17} />
                </button>
                <button
                  className="text-button"
                  onClick={() => setRequest(null)}
                >
                  Start a new brief
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRequest(Object.fromEntries(new FormData(e.currentTarget)));
                }}
              >
                <p>
                  Tell us what you're celebrating. Create a personal brief you
                  can save and share.
                </p>
                <label>
                  Your name
                  <input
                    name="Name"
                    required
                    autoComplete="name"
                    maxLength={100}
                  />
                </label>
                <div className="form-row">
                  <label>
                    Occasion
                    <select name="Occasion">
                      <option>Birthday</option>
                      <option>Anniversary</option>
                      <option>Wedding</option>
                      <option>Just because</option>
                    </select>
                  </label>
                  <label>
                    Preferred date
                    <input
                      type="date"
                      name="Date"
                      min={new Date(
                        Date.now() - new Date().getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .slice(0, 10)}
                      required
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Flavour
                    <select name="Flavour">
                      <option>Dark chocolate</option>
                      <option>Vanilla & berries</option>
                      <option>Salted caramel</option>
                    </select>
                  </label>
                  <label>
                    Servings
                    <select name="Servings">
                      <option>6–8 guests</option>
                      <option>10–14 guests</option>
                      <option>18–24 guests</option>
                    </select>
                  </label>
                </div>
                <label>
                  A little inspiration
                  <textarea
                    name="Notes"
                    placeholder="Colours, cake message, dietary needs…"
                    maxLength={1200}
                    rows={3}
                  />
                </label>
                <p className="form-note">
                  Your details stay in this browser session. This creates a
                  downloadable brief; it does not submit a booking.
                </p>
                <button className="button dark wide" type="submit">
                  Create my cake brief <ArrowUpRight size={17} />
                </button>
              </form>
            )
          ) : modal === "allergens" ? (
            <div className="info-copy">
              <p>
                The illustrative menu includes wheat, milk, eggs, soy and
                potential tree nuts. Images may show garnishes that differ from
                a final product.
              </p>
              <p>
                Recipe-specific allergen information has not been verified.
                Please confirm ingredients and cross-contact risks with your
                bakery before ordering. No item is represented as allergy-safe,
                gluten-free or vegan.
              </p>
            </div>
          ) : (
            <div className="info-copy">
              <p>
                Browse the collection, add favourites to your bag and download a
                request summary. For a custom celebration, create a cake brief
                with your preferred date, flavour and serving size.
              </p>
              <p>
                This concept storefront has no connected bakery fulfilment or
                payment service. Delivery areas, lead times, charges and
                availability must be confirmed before launch.
              </p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
export default App;
