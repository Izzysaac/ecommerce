🛒 Prompt — Implementar Cart en Astro SSG (HTML + CSS + Vanilla JS)
Contexto del proyecto

Estoy trabajando en un proyecto Astro SSG (sin SSR y sin backend).

Estructura actual:

/src/pages/catalog/[slug].astro → Página de detalle de producto

Botón "Agregar al carrito" existe SOLO en [slug].astro

El carrito será un dialog/modal ubicado en:
/src/components/cart/CartDialog.astro

Restricciones:

No usar React, Vue, Solid ni ninguna librería

No usar backend

No usar fetch

Todo debe funcionar 100% client-side

Persistencia con localStorage

Mantener arquitectura limpia y modular

🎯 Objetivo

Implementar un sistema de carrito persistente usando:

HTML

CSS

JavaScript vanilla

localStorage

Astro SSG

1️⃣ Crear módulo de lógica del carrito

Crear archivo:

/src/lib/cart.js

Debe exportar funciones puras:

export function getCart()
export function addToCart(product)
export function removeFromCart(id)
export function updateQuantity(id, quantity)
export function clearCart()
export function getCartCount()
📦 Estructura del carrito en localStorage

Clave: "cart"

{
  "items": [
    {
      "id": "product-slug",
      "title": "Product Name",
      "price": 99.99,
      "image": "/img/product.jpg",
      "quantity": 1
    }
  ],
  "updatedAt": 1700000000000
}
Reglas de comportamiento

Si no existe carrito → inicializarlo

Si el producto ya existe → incrementar quantity

Nunca duplicar productos

Persistir después de cada modificación

Manejar errores si localStorage está vacío o corrupto

2️⃣ Botón "Agregar al carrito" en [slug].astro

En /catalog/[slug].astro:

Agregar botón con data-* attributes:

data-id

data-title

data-price

data-image

Ejemplo conceptual:

<button 
  id="add-to-cart"
  data-id={product.slug}
  data-title={product.title}
  data-price={product.price}
  data-image={product.image}
>
  Agregar al carrito
</button>

Agregar <script> vanilla que:

Escuche click

Construya objeto producto

Llame addToCart(product)

Actualice badge del carrito

No recargue la página

3️⃣ Implementar CartDialog

Ubicación:

/src/components/cart/CartDialog.astro

Debe:

Usar <dialog>

Renderizar contenido dinámicamente con JS

Leer carrito al abrir

Mostrar:

Imagen

Título

Precio

Controles + / -

Botón eliminar

Total general

Comportamiento del Dialog

Al abrir:

Leer localStorage

Renderizar items dinámicamente

Calcular total

Permitir:

Aumentar cantidad

Disminuir cantidad

Eliminar producto

Persistir cambios inmediatamente

4️⃣ Badge del carrito en navbar

Debe mostrar:

getCartCount()

Debe actualizarse cuando:

Se agrega producto

Se elimina producto

Se modifica cantidad

Usar:

window.addEventListener("storage", ...)

Para sincronizar entre pestañas.

Opcional: disparar window.dispatchEvent(new Event("cartUpdated"))
para actualizar UI sin recargar.

5️⃣ Reglas de implementación

No usar librerías externas

No usar frameworks frontend

No usar estado global complejo

Código modular y limpio

No sobreingeniería

Mantener SSG intacto

6️⃣ Flujo esperado

Usuario entra a /catalog/producto-x

Hace click en "Agregar al carrito"

Producto se guarda en localStorage

Badge se actualiza

Usuario abre dialog

Ve productos, modifica cantidades

Cambios persisten tras refresh

Funciona entre distintas páginas

7️⃣ Resultado final esperado

Carrito completamente funcional

Persistente

100% client-side

Compatible con Astro SSG

Escalable para futura integración con backend