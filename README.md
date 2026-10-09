# Catalog produse

Aplicație Frontend (React + Vite) care comunică cu un API REST public:
afișează produse, adaugă, modifică și șterge produse.

## Pasul 1 — Identificarea API-ului

- **API folosit:** DummyJSON — https://dummyjson.com
- **Base URL:** `https://dummyjson.com`

| Metodă | Endpoint | Rol |
| ------ | -------- | --- |
| GET | `/products` | lista produselor (acceptă `limit`, `skip`, `select`) |
| GET | `/products/:id` | un singur produs |
| POST | `/products/add` | adaugă un produs (body JSON) |
| PUT | `/products/:id` | modifică un produs (body JSON) |
| DELETE | `/products/:id` | șterge un produs |

**Request body (POST/PUT):**
```json
{ "title": "Keyboard", "price": 700, "category": "accessories" }
```

**Important:** DummyJSON *simulează* operațiile de scriere. Serverul răspunde
corect (cu produsul creat/modificat/șters), dar nu salvează nimic, deci după
reîncărcarea paginii datele revin la cele inițiale.

## Pasul 2 — Testarea endpoint-ului

Înainte de integrare, endpoint-ul a fost verificat în browser:

- https://dummyjson.com/products — lista produselor
- https://dummyjson.com/products/1 — un singur produs

Răspunsul la `GET /products` este un obiect de forma:
```json
{ "products": [ ... ], "total": 194, "skip": 0, "limit": 30 }
```

## Rulare

```
npm install
npm run dev
```
