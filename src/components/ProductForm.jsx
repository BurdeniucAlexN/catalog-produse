import { useState } from "react";

function ProductForm({
  initialProduct,
  submitLabel = "Adaugă",
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState(initialProduct?.title ?? "");
  const [price, setPrice] = useState(initialProduct?.price ?? "");
  const [category, setCategory] = useState(initialProduct?.category ?? "");
  const [validation, setValidation] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      setValidation("Completează denumirea produsului.");
      return;
    }

    const numericPrice = Number(price);
    if (price === "" || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setValidation("Prețul trebuie să fie un număr pozitiv.");
      return;
    }

    setValidation("");
    setSaving(true);
    const ok = await onSubmit({
      title: title.trim(),
      price: numericPrice,
      category: category.trim(),
    });
    setSaving(false);

    // La adăugare, golim câmpurile după succes
    if (ok && !initialProduct) {
      setTitle("");
      setPrice("");
      setCategory("");
    }
  };

  return (
    <form
      className={initialProduct ? "product-form card" : "product-form"}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Denumire"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        type="number"
        placeholder="Preț"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <input
        type="text"
        placeholder="Categorie"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      />
      <button type="submit" disabled={saving}>
        {saving ? "Se salvează..." : submitLabel}
      </button>
      {onCancel && (
        <button type="button" className="secondary" onClick={onCancel}>
          Anulează
        </button>
      )}
      {validation && <p className="validation">{validation}</p>}
    </form>
  );
}

export default ProductForm;
