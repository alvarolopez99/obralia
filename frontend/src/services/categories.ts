const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/api/categories`, { 
    next: { revalidate: 60 },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
} 