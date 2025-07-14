import React, { useEffect, useState } from 'react';
import { Product } from '../types/products';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppProvider';

const Products: React.FC = () => {

	const { apiUrl } = useAppContext();
	const [products, setProducts] = useState<Product[] | null>(null);

	/* Efecto para recibir todos los productos */
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch(`${apiUrl}/products/featured`);
				const result = await response.json();
				/* console.log('productos: ', result); */
				setProducts(result);
			} catch (err) {
				console.error(err);
			}
		};

		fetchProducts();
	}, []);

	return (
		<section className="w-full min-h-[100vh] px-4 py-8 bg-gray-50">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold mb-6 text-gray-800">Productos</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{Array.isArray(products) ? (
						products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))
					) : (
						<p className="text-gray-600 col-span-full">No se pudieron cargar los productos.</p>
					)}

				</div>
			</div>
		</section>
	);
};

export default Products;
