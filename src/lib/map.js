export async function mapExcelData() {
  try {
    const response = await fetch(
      "https://opensheet.elk.sh/1oicYVDp3z8KORWBzFOFY4oHvvBHvqWeaZXSkAX3HL3Q/catalogo",
    );
    const data = await response.json();

    return data.map((item) => ({
      categoria: item.CATEGORIA,
      nombre: item.NOMBRE,
      descripcion: item.DESCRIPCION,
      precio: parseInt(item.PRECIO) || 0,
      media: item.MEDIA
        ? item.MEDIA.split(";")
            .map((m) => m.trim())
            .filter((m) => m)
        : [],
      estado: item.ESTADO || "inactivo",
    }));
  } catch (error) {
    console.error("Error fetching Excel data:", error);
    return [];
  }
}
