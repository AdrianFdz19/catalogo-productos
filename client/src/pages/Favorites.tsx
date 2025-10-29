import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/products';

const Favorites: React.FC = () => {
  const { apiUrl } = useAppContext();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritesList = async () => {
      try {
        const res = await fetch(`${apiUrl}/products/favorites`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          console.log('✅ Favoritos recibidos:', data);
          setFavorites(data.favorites); // <-- aquí el cambio
        } else {
          console.error('❌ Error al obtener favoritos');
        }
      } catch (err) {
        console.error('❌ Error en fetchFavoritesList:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritesList();
  }, [apiUrl]);

  if (loading) return <p className="text-center mt-6">Cargando favoritos...</p>;

  return (
    <section className="w-full min-h-[100vh] px-4 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Favoritos</h2>

        {favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} apiUrl={apiUrl} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-6">
            Aún no tienes productos favoritos.
          </p>
        )}
      </div>
    </section>
  );
};

export default Favorites;
