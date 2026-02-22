const navbar = document.getElementById("navbar");
const openButton = document.getElementById("open-sidebar-button");
const closeButton = document.getElementById("close-sidebar-button");
const overlay = document.getElementById("overlay");


const openMenu = () => {
	navbar.classList.add("show");
	overlay.classList.add("show-overlay");
	// openButton.setAttribute("aria-expanded", "true");
	// navbar.removeAttribute("inert");
}

const closeMenu = () => {
	navbar.classList.remove("show");
	overlay.classList.remove("show-overlay");
	// openButton.setAttribute("aria-expanded", "false");
	// navbar.setAttribute("inert", "");
}

closeButton.addEventListener("click", () => closeMenu());
overlay.addEventListener("click", () => closeMenu());
openButton.addEventListener("click", () => openMenu());


/* ========= Cart functions ========= */

const openCartButton = document.getElementById("open-cart-button");
const cartBadge = document.getElementById("cart-badge");

// Calcula y pinta el contador
const updateCartBadge = async () => {
	if (!cartBadge) return;
	try {
		const mod = await import("../lib/cart.js");
		const count = mod.getCartCount();
		cartBadge.textContent = String(count);
		cartBadge.style.display = count > 0 ? "inline-block" : "none";
	} catch {
		cartBadge.textContent = "0";
		cartBadge.style.display = "none";
	}
};

openCartButton.addEventListener("click", () => {
	document.dispatchEvent(new Event("cart:open"));
});

/* === Mantener el badge sincronizado (sin recargar) === */
// Escucha evento cartUpdated para actualizar el badge
window.addEventListener("cartUpdated", () => {
	updateCartBadge();
});

/* === Sincronización entre pestañas === */
// Escucha evento storage para actualizar el badge cuando cambia el carrito en otra pestaña
window.addEventListener("storage", (ev) => {
	if (ev.key === "cart") updateCartBadge();
});

updateCartBadge();