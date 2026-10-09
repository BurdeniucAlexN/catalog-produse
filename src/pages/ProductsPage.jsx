import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { toProduct } from "../models/Product";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Încărcarea produselor la afișarea paginii (și la „Reîncearcă")
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

  return (
    <section>
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
