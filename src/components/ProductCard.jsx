function ProductCard({ product }) {
  const { title, price, category, thumbnail } = product;

  return (
    <article className="product-card">
      {thumbnail && <img src={thumbnail} alt={title} />}
      <h3>{title}</h3>
      <p className="category">{category}</p>
      <p className="price">{price} USD</p>
    </article>
  );
}

export default ProductCard;
