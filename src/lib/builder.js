import data from "../../public/data.json";

export function getCategories() {
	const categories = [...new Set(data.map((item) => item.categoria))];
	return categories.filter((category) => category && category.trim() !== "");
}

export function getCategoriesSlug() {
	const categories = [...new Set(data.map((item) => item.categoria))];
	return categories
		.filter((category) => category && category.trim() !== "")
		.map((category) =>
			category
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "")
		);
}

export function getCategoriesWithSlug() {
	const categories = [...new Set(data.map((item) => item.categoria))];
	return categories
		.filter((category) => category && category.trim() !== "")
		.map((category) => ({
			name: category,
			slug: category
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, ""),
		}));
}

export function getProductsByCategory() {
	const categories = getCategoriesWithSlug();
	
	return categories.map((category) => ({
		...category,
		products: data.filter((item) => item.categoria === category.name),
	}));
}
