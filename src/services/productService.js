// Serviciul care comunică cu API-ul. Componentele nu apelează fetch direct.

const API_URL = "https://dummyjson.com/products";

async function request(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Eroare ${response.status}: cererea către server a eșuat`);
  }

  return response.json();
}

export async function getProducts(limit = 12) {
  const data = await request(
    `${API_URL}?limit=${limit}&select=title,price,category,thumbnail`
  );
  return data.products;
}

export async function createProduct(product) {
  return request(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, changes) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
}

export async function deleteProduct(id) {
  return request(`${API_URL}/${id}`, { method: "DELETE" });
}
