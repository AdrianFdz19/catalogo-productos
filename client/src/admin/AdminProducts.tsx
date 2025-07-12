// src/pages/AdminProducts.tsx
import React, { useEffect, useState } from 'react';
import { MappedProduct } from '../types/products';
import { useAppContext } from '../context/AppProvider';
import { useNavigate } from 'react-router-dom';

const AdminProducts: React.FC = () => {
	const { apiUrl } = useAppContext();
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
	const limit = 5;
	const navigate = useNavigate();
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		visible: boolean;
		product: MappedProduct | null;
	}>({ x: 0, y: 0, visible: false, product: null });

	useEffect(() => {
		const handleClick = () => {
			if (contextMenu.visible) {
				setContextMenu((prev) => ({ ...prev, visible: false }));
			}
		};

		window.addEventListener('click', handleClick);
		return () => window.removeEventListener('click', handleClick);
	}, [contextMenu.visible]);


	const [products, setProducts] = useState<MappedProduct[]>([]);

	useEffect(() => {
		const fetchPaginatedProducts = async () => {
			try {
				const res = await fetch(`${apiUrl}/products/paginated?page=${page}&limit=${limit}&category=${selectedCategory}`);
				const data = await res.json();

				let mappedProducts = data.products.map((product: any) => ({
					id: product.id,
					name: product.name,
					description: product.description,
					category: product.category,
					price: Number(product.price),
					stock: product.stock,
					featured: product.featured,
					image: product.images?.[0]?.url || '',
				}));

				setProducts(mappedProducts);
				setTotal(data.total); // Puedes ajustar el total si usas paginación con filtros reales
			} catch (err) {
				console.error('❌ Error al obtener productos paginados:', err);
			}
		};

		fetchPaginatedProducts();
	}, [page, selectedCategory]);

	return (
		<section className="w-full px-4 py-10">


			<div className="max-w-6xl mx-auto">
				<h2 className="text-2xl font-bold mb-6 text-gray-800">Panel de productos</h2>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
					{/* Buscador y contador */}
					<div className="flex items-center gap-3 flex-wrap">
						<input
							type="text"
							placeholder="Buscar producto..."
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
						<p className="text-sm text-gray-500">
							Mostrando {products.length} productos
							{selectedCategory !== 'Todos' && ` en "${selectedCategory}"`}
						</p>
					</div>

					{/* Filtros y botón */}
					<div className="flex items-center gap-3 flex-wrap">
						<select
							value={selectedCategory}
							onChange={(e) => {
								setSelectedCategory(e.target.value);
								setPage(1); // Reiniciar a la primera página
							}}
							className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						>
							<option value="Todos">Todos los productos</option>
							<option value="Destacados">Destacados</option>
							<option value="Laptops">Laptops</option>
							<option value="Smart Home">Smart Home</option>
							<option value="Cameras">Cámaras</option>
							<option value="Accessories">Accesorios</option>
						</select>

						<button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
							onClick={() => navigate('/admin/products/add')}
						>
							+ Agregar producto
						</button>
					</div>
				</div>

				<div className="overflow-x-auto bg-white rounded-lg shadow">
					<table className="min-w-full table-auto border border-gray-200">
						<thead className="bg-gray-100">
							<tr className="text-left text-xs text-gray-700">
								<th className="px-4 py-1 border">ID</th>
								<th className="px-4 py-1 border">Imagen</th>
								<th className="px-4 py-1 border">Nombre</th>
								<th className="px-4 py-1 border">Descripción</th>
								<th className="px-4 py-1 border">Categoría</th>
								<th className="px-4 py-1 border cursor-pointer select-none" onClick={() =>
									setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
								}>
									Precio {sortOrder === 'asc' ? '▲' : '▼'}
								</th>
								<th className="px-4 py-1 border">Stock</th>
								<th className="px-4 py-1 border">Destacado</th>
								<th className="px-4 py-1 border">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{products
								.sort((a, b) =>
									sortOrder === 'asc' ? a.price - b.price : b.price - a.price
								)
								.map((prod) => (
									<tr key={prod.id}
										onContextMenu={(e) => {
											e.preventDefault();
											setContextMenu({
												x: e.pageX,
												y: e.pageY,
												visible: true,
												product: prod,
											});
										}}
										className="text-xs text-gray-800 hover:bg-gray-50 cursor-pointer">
										<td className="px-4 py-1 border">{prod.id}</td>
										<td className="px-4 py-1 border">
											{prod.image ? (
												<img
													src={prod.image}
													alt={prod.name}
													className="w-12 h-12 object-cover rounded"
												/>
											) : (
												<span className="text-gray-400 italic">Sin imagen</span>
											)}
										</td>
										<td className="px-4 py-1 border">{prod.name}</td>
										<td className="px-4 py-1 border max-w-[200px] truncate">
											{prod.description}
										</td>
										<td className="px-4 py-1 border">{prod.category}</td>
										<td className="px-4 py-1 border">${prod.price}</td>
										<td className="px-4 py-1 border">{prod.stock}</td>
										<td className="px-4 py-1 border">
											<span
												className={`text-xs px-2 py-[1px] rounded-full font-medium ${prod.featured
													? 'bg-green-100 text-green-700'
													: 'bg-gray-200 text-gray-600'
													}`}
											>
												{prod.featured ? 'Sí' : 'No'}
											</span>
										</td>
										<td className="px-4 py-1 border">
											<div className="flex gap-1">
												<button className="text-blue-600 hover:underline text-xs cursor-pointer">Ver</button>
												<button className="text-yellow-600 hover:underline text-xs cursor-pointer">Editar</button>
												<button className="text-red-600 hover:underline text-xs cursor-pointer">Eliminar</button>
											</div>
										</td>
									</tr>
								))}
						</tbody>

					</table>
					<div className="flex justify-end items-center gap-2 mt-4 text-sm">
						<button
							onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
							className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
							disabled={page === 1}
						>
							← Anterior
						</button>
						<span>Página {page}</span>
						<button
							onClick={() => setPage((prev) => (prev * limit < total ? prev + 1 : prev))}
							className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
							disabled={page * limit >= total}
						>
							Siguiente →
						</button>
					</div>
					{contextMenu.visible && contextMenu.product && (
						<ul
							className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg w-40 text-sm"
							style={{ top: contextMenu.y, left: contextMenu.x }}
						>
							<li
								className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
								onClick={() => navigate(`/product/${contextMenu.product?.id}`)}
							>
								👁 Ver
							</li>
							<li
								className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
								onClick={() => navigate(`/admin/products/edit/${contextMenu.product?.id}`)}
							>
								✏️ Editar
							</li>
							<li
								className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
								onClick={() => {
									// Aquí llamas tu función de eliminar
									alert(`Eliminar producto ${contextMenu.product?.name}`);
									setContextMenu({ ...contextMenu, visible: false });
								}}
							>
								🗑 Eliminar
							</li>
						</ul>
					)}

					{products.length === 0 && (
						<p className="p-4 text-center text-gray-500">No hay productos registrados.</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default AdminProducts;
