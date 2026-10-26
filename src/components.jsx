import React, { useEffect, useRef, useId } from "react";
import { X, Plus } from "lucide-react";
const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );
export function Photo({ name, alt, className = "", eager = false }) {
  return (
    <img
      className={className}
      src={`/images/${name}.jpg`}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
export function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Velvet Crumb home">
      <span>
        velvet crumb<span className="brand-dot">✧</span>
      </span>
      <small>PÂTISSERIE & LITTLE PLEASURES</small>
    </a>
  );
}
export function Modal({ title, onClose, children }) {
  const ref = useRef();
  const titleId = useId();
  useEffect(() => {
    const old = document.activeElement;
    ref.current.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      old?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="modal"
    >
      <div className="modal-heading">
        <h2 id={titleId}>{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-photo">
        <Photo name={product.image} alt={product.name} />
        <span className="product-tag">{product.tag}</span>
        <button
          className="add-product"
          aria-label={`Add ${product.name} to bag`}
          onClick={() => onAdd(product.id)}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="product-heading">
        <h3>{product.name}</h3>
        <span>{money(product.price)}</span>
      </div>
      <p>{product.description}</p>
    </article>
  );
}
