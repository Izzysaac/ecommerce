import {
	getCart,
	removeFromCart,
	updateQuantity,
	clearCart,
} from "@lib/cart.js";


// Configuración de Cloudinary Helper
const CLOUDINARY_CLOUD_NAME = "dr5knskbb";

const getCloudinaryImageUrl = (publicId, { w = 600, h = 600 } = {}) => {
	if (!publicId) return "";
	const encoded = encodeURIComponent(publicId).replace(/%2F/g, "/");
	return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_${w},h_${h},q_auto,f_auto/v1/${encoded}`;
};

// Referencias al DOM
const dialog = document.getElementById("cart-dialog");
const closeBtn = document.getElementById("cart-close");
const itemsEl = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");
const clearBtn = document.getElementById("cart-clear");



const formatPrice = (n) => {
	const num = Number(n) || 0;
	return `$${num.toLocaleString()}`;
};

const render = () => {
	const cart = getCart();

	// Calcula el total
	const total = cart.items.reduce(
		(acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0),
		0,
	);
	totalEl.textContent = formatPrice(total);

	// Si no hay items, muestra un mensaje
	if (!cart.items.length) {
		itemsEl.innerHTML = `<p class="empty">Tu carrito está vacío.</p>`;
		return;
	}

	// Renderiza los items
	itemsEl.innerHTML = cart.items
		.map(
			(it) => `
					<div class="cart-item" data-id="${it.id}">
						<img class="thumb" src="${getCloudinaryImageUrl(it.image, { w: 150, h: 150 })}" alt="${it.title}" width="50" height="50"/>
						<div class="meta">
							<div class="title">${it.title}</div>
							<div class="price">${formatPrice(it.price)}</div>
							<div class="qty">
								<button type="button" class="qty-btn" data-action="dec">-</button>
								<input class="qty-input" value="${it.quantity}" inputmode="numeric" />
								<button type="button" class="qty-btn" data-action="inc">+</button>
							</div>
						</div>
						<button type="button" class="remove" aria-label="Eliminar" data-action="remove">🗑</button>
					</div>
				`,
		)
		.join("");
};

/* === Eventos de interacción dentro del listado === */
const onClick = (e) => {
	const target = e.target;
	const row = target.closest(".cart-item");
	if (!row) return;

	const id = row.dataset.id;
	const action = target.dataset.action;

	if (action === "remove") {
		removeFromCart(id);
		window.dispatchEvent(new Event("cartUpdated"));
		render();
		return;
	}

	if (action === "inc" || action === "dec") {
		const cart = getCart();
		const item = cart.items.find((i) => i.id === id);
		if (!item) return;
		const nextQ =
			action === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
		updateQuantity(id, nextQ);
		window.dispatchEvent(new Event("cartUpdated"));
		render();
		return;
	}
};

// Cuando cambias el input en la cantidad
const onChange = (e) => {
	const input = e.target;
	if (!input.classList.contains("qty-input")) return;
	const row = input.closest(".cart-item");
	if (!row) return;
	const id = row.dataset.id;
	const q = Math.max(1, Number(input.value || 1));
	updateQuantity(id, q);
	window.dispatchEvent(new Event("cartUpdated"));
	render();
};

itemsEl.addEventListener("click", onClick);
itemsEl.addEventListener("change", onChange);

/* === Eventos de interacción fuera del listado (dialog) === */

dialog.addEventListener("click", (e) => {
	if (e.target === dialog) dialog.close();
});
closeBtn.addEventListener("click", () => dialog.close());

clearBtn.addEventListener("click", () => {
	clearCart();
	// Sincronización (misma pestaña + otras pestañas)
	window.dispatchEvent(new Event("cartUpdated"));
	render();
});

dialog.addEventListener("close", () => render());

window.addEventListener("cartUpdated", () => render());

window.addEventListener("storage", (ev) => {
	if (ev.key === "cart") render();
});

// Escuhe el evento que emite el navbar cart click para abrir el dialog
document.addEventListener("cart:open", () => {
	render();
	dialog.showModal();
});

// initial
render();
