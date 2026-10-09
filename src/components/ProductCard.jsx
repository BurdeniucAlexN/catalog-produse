function ProductCard({ product, onEdit, onDelete }) {
  const { id, title, price, category, thumbnail, isLocal } = product;

  return (
    <article className="product-card">
      {thumbnail && <img src={thumbnail} alt={title} />}
      <h3>{title}</h3>
      <p className="category">{category}</p>
      <p className="price">{price} USD</p>
      {isLocal && <span className="badge">adăugat local (simulat)</span>}
      <div className="actions">
        <button onClick={() => onEdit(id)}>Editează</button>
        <button className="danger" onClick={() => onDelete(id)}>
          Șterge
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
