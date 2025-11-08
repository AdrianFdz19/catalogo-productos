import React, { useEffect, useState } from 'react';
import { Product } from '../types/products';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppProvider';
import SearchBar from '../components/SearchBar';
import ProductFilter from '../components/ProductFilter';

const Products: React.FC = () => {
  const { apiUrl, user } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {

    if (!user || !user.id || !user.role) return;

    const fetchProducts = async () => {

      setLoading(true);
      setErrorMsg(null);

      const userId = user ? user.id : 0;

      try {
        const response = await fetch(`${apiUrl}/products/?userId=${userId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Error HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
          throw new Error('Formato de respuesta inesperado');
        }
        console.log(result);
        setProducts(result);
      } catch (err: any) {
        console.error('Error cargando productos:', err);
        setErrorMsg(
          err.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor.'
            : err.message || 'Ocurrió un error al cargar los productos.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl, user]);

  // 🔍 Filtrado de productos
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? p.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  // 🔹 Mensaje mientras user se carga
  if (!user) {
    return (
      <section className="w-full min-h-[100vh] px-4 py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          Cargando información del usuario...
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-[100vh] px-4 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Productos</h2>

        {/* 🔹 Filtros y barra de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar search={search} setSearch={setSearch} />
          <ProductFilter
            categories={Array.from(new Set(products.map((p) => p.category)))}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* 🔹 Estado de carga o error */}
        {loading && (
          <p className="text-gray-600 text-center">Cargando productos...</p>
        )}

        {errorMsg && !loading && (
          <p className="text-red-500 text-center">{errorMsg}</p>
        )}

        {/* 🔹 Lista de productos */}
        {!loading && !errorMsg && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  apiUrl={apiUrl}
                  userRole={user?.role}
                />
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                No se encontraron productos que coincidan.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
