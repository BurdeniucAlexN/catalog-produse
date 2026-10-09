import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { toProduct } from "../models/Product";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await getProducts();
        if (!cancelled) setProducts(data.map(toProduct));
      } catch {
        if (!cancelled) {
          setError("Nu s-au putut încărca produsele. Încearcă din nou.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount((count) => count + 1);
  };

  // POST
  const handleAdd = async ({ title, price, category }) => {
    setActionError(null);
    try {
      const created = await createProduct({ title, price, category });
      const product = {
        ...toProduct(created),
        id: `local-${Date.now()}`,
        isLocal: true,
      };
      setProducts((current) => [product, ...current]);
      return true;
    } catch {
      setActionError("Produsul nu a putut fi adăugat. Încearcă din nou.");
      return false;
    }
  };

  // PUT
  const handleUpdate = async (id, { title, price, category }) => {
    setActionError(null);
    const current = products.find((product) => product.id === id);

    try {
      let changes = { title, price, category };

      // Produsele adăugate local nu există pe server, deci nu apelăm API-ul
      if (!current.isLocal) {
        const updated = await updateProduct(id, changes);
        changes = {
          title: updated.title,
          price: updated.price,
          category: updated.category,
        };
      }

      setProducts((list) =>
        list.map((product) =>
          product.id === id ? { ...product, ...changes } : product
        )
      );
      setEditingId(null);
      return true;
    } catch {
      setActionError("Produsul nu a putut fi modificat. Încearcă din nou.");
      return false;
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest produs?")) return;

    setActionError(null);
    const current = products.find((product) => product.id === id);

    try {
      if (!current.isLocal) {
        await deleteProduct(id);
      }
      setProducts((list) => list.filter((product) => product.id !== id));
    } catch {
      setActionError("Produsul nu a putut fi șters. Încearcă din nou.");
    }
  };

  return (
    <section>
      <ProductForm onSubmit={handleAdd} />

      {actionError && <p className="error">{actionError}</p>}

      {loading && <p className="status">Se încarcă produsele...</p>}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={handleRetry}>Reîncearcă</button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="status">Nu există produse.</p>
      )}

      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) =>
            editingId === product.id ? (
              <ProductForm
                key={product.id}
                initialProduct={product}
                submitLabel="Salvează"
                onSubmit={(data) => handleUpdate(product.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={setEditingId}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
