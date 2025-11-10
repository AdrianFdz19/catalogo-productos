import { useEffect, useState } from 'react';
import { Category } from '../types/products';

type UseFetchCategoriesProps = {
  apiUrl: string;
};

export default function useFetchCategories({ apiUrl }: UseFetchCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/products/categories`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Error al cargar las categorías.');
        }

        const data = await response.json();
        console.log(data);
        setCategories(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al obtener categorías.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  return { categories, loading, error };
}
