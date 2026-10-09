import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import { getProducts, createProduct } from "../services/productService";
import { toProduct } from "../models/Product";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
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

  // Formular -> POST -> răspuns API -> actualizare interfață
  const handleAdd = async ({ title, price, category }) => {
    setActionError(null);
    try {
      const created = await createProduct({ title, price, category });
      // API-ul simulează crearea (returnează mereu același id), deci
      // folosim un id local unic pentru produsele adăugate în sesiune.
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductsPage;
