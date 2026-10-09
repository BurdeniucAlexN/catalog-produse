# Catalog produse

Aplicație Frontend (React + Vite) care comunică cu un API REST public:
afișează produse, adaugă, modifică și șterge produse.

## Funcționalități

- listarea produselor la încărcarea paginii (GET)
- adăugarea unui produs printr-un formular (POST)
- modificarea unui produs (PUT)
- ștergerea unui produs, cu confirmare (DELETE)
- stările **LOADING / SUCCESS / ERROR** pentru încărcarea listei, cu buton „Reîncearcă”
- verificarea `response.ok` și mesaje de eroare clare pentru utilizator
- validarea formularului (denumire completată, preț pozitiv)

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

Produsele adăugate din aplicație primesc un id local unic și sunt marcate cu
„adăugat local (simulat)”. Pentru ele, editarea și ștergerea se fac doar în
interfață, pentru că produsul nu există de fapt pe server.

## Pasul 2 — Testarea endpoint-ului

Endpoint-ul a fost verificat în browser înainte de integrare:

- https://dummyjson.com/products
- https://dummyjson.com/products/1

Răspunsul la `GET /products`:
```json
{ "products": [ ... ], "total": 194, "skip": 0, "limit": 30 }
```

## Arhitectura

```
src/
├── components/
│   ├── ProductCard.jsx   # afișează un produs (UI)
│   └── ProductForm.jsx   # formular de adăugare / editare (UI)
├── pages/
│   └── ProductsPage.jsx  # coordonează pagina: stare, loading, erori
├── services/
│   └── productService.js # singurul loc care comunică cu API-ul (fetch)
├── models/
│   └── Product.js        # transformă răspunsul API în obiectul aplicației
├── App.jsx
└── main.jsx
```

- **Component** → se ocupă doar de interfață
- **Page** → coordonează pagina (starea, apelurile către service)
- **Service** → comunică cu API-ul
- **API** → furnizează datele

## Gestionarea stărilor și a erorilor

- `loading` — se afișează „Se încarcă produsele...”
- `error` — dacă `response.ok` este fals sau cererea eșuează, se afișează
  „Nu s-au putut încărca produsele. Încearcă din nou.” și butonul „Reîncearcă”
- `success` — produsele sunt afișate într-o grilă

Coduri HTTP relevante: 200 OK, 201 Created, 400 Bad Request, 404 Not Found,
500 Internal Server Error. Orice răspuns în afara intervalului 200–299 este
tratat ca eroare în `productService.js`.

## Rulare

```
npm install
npm run dev
```
