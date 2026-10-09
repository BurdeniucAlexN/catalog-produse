// Transformă obiectul primit de la API în forma folosită de aplicație.
export function toProduct(data) {
  return {
    id: data.id,
    title: data.title ?? "",
    price: Number(data.price) || 0,
    category: data.category ?? "",
    thumbnail: data.thumbnail ?? "",
    isLocal: false,
  };
}
