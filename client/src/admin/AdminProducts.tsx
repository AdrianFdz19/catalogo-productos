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
				const res = await fetch(`${apiUrl}/admin/products/paginated?page=${page}&limit=${limit}&category=${selectedCategory}`, {
					method: 'GET',
					credentials: 'include'
				});
				const data = await res.json();

				let mappedProducts = data.products.map((product: any) => ({
					id: product.id,
					name: product.name,
					description: product.description,
					category: product.category,
					price: Number(product.price),
					stock: product.stock,
					featured: product.featured,
					image: product.imageUrls?.[0] || '', // <-- Solo tomar la string directamente
				}));

				console.log(mappedProducts);


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

				{/* Filtros y acciones */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
					<div className="flex items-center gap-3 flex-wrap">
						<input
							type="text"
							placeholder="Buscar producto..."
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
						<p className="text-sm text-gray-500">
							Mostrando {products.length} productos
							{selectedCategory !== 'Todos' && ` en "${selectedCategory}"`}
						</p>
					</div>

					<div className="flex items-center gap-3 flex-wrap">
						<select
							value={selectedCategory}
							onChange={(e) => {
								setSelectedCategory(e.target.value);
								setPage(1);
							}}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
						>
							<option value="Todos">Todos los productos</option>
							<option value="Destacados">Destacados</option>
							<option value="Laptops">Laptops</option>
							<option value="Smart Home">Smart Home</option>
							<option value="Cameras">Cámaras</option>
							<option value="Accessories">Accesorios</option>
						</select>

						<button
							className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
							onClick={() => navigate('/admin/products/add')}
						>
							+ Agregar producto
						</button>
					</div>
				</div>

				{/* Encabezados */}
				<div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] px-6 py-2 text-sm font-semibold text-gray-600 bg-gray-100 border-y border-gray-200 rounded-t-lg">
					<span>Producto</span>
					<span>Descripción</span>
					<span>Precio</span>
					<span>Stock</span>
					<span>Estado</span>
					<span className="text-center">Acciones</span>
				</div>

				{/* Grid tipo filas */}
				<div className="space-y-3">
					{products
						.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price))
						.map((prod) => (
							<div
								key={prod.id}
								onContextMenu={(e) => {
									e.preventDefault();
									setContextMenu({
										x: e.pageX,
										y: e.pageY,
										visible: true,
										product: prod,
									});
								}}
								className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer sm:grid sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_auto]"
							>
								{/* Columna 1: Imagen y nombre */}
								<div className="flex items-center gap-4 min-w-0">
									<img
										src={prod.image || '/no-image.png'}
										alt={prod.name}
										className="w-14 h-14 rounded-md object-cover border border-gray-200"
									/>
									<div className="min-w-0">
										<h3 className="font-medium text-gray-800 truncate">{prod.name}</h3>
										<p className="text-xs text-gray-500 truncate">{prod.category}</p>
									</div>
								</div>

								{/* Columna 2: Descripción */}
								<p className="hidden sm:block text-sm text-gray-600 truncate max-w-[250px]">
									{prod.description}
								</p>

								{/* Columna 3: Precio */}
								<div className="text-gray-800 font-semibold text-sm">${prod.price}</div>

								{/* Columna 4: Stock */}
								<div className="text-gray-500 text-sm">Stock: {prod.stock}</div>

								{/* Columna 5: Estado */}
								<div className="hidden sm:block">
									<span
										className={`px-2 py-[2px] rounded-full text-xs font-medium ${prod.featured
												? 'bg-green-100 text-green-700'
												: 'bg-gray-100 text-gray-500'
											}`}
									>
										{prod.featured ? 'Destacado' : 'Normal'}
									</span>
								</div>

								{/* Columna 6: Acciones */}
								<div className="flex justify-center gap-2 text-sm">
									<button
										onClick={() => navigate(`/product/${prod.id}`)}
										className="text-gray-600 hover:text-blue-600"
									>
										👁
									</button>
									<button
										onClick={() => navigate(`/admin/products/edit/${prod.id}`)}
										className="text-gray-600 hover:text-yellow-600"
									>
										✏️
									</button>
									<button
										onClick={() => alert(`Eliminar producto ${prod.name}`)}
										className="text-gray-600 hover:text-red-600"
									>
										🗑
									</button>
								</div>
							</div>
						))}

					{products.length === 0 && (
						<p className="p-4 text-center text-gray-500">
							No hay productos registrados.
						</p>
					)}
				</div>

				{/* Context Menu */}
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
							onClick={() =>
								navigate(`/admin/products/edit/${contextMenu.product?.id}`)
							}
						>
							✏️ Editar
						</li>
						<li
							className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
							onClick={() => {
								alert(`Eliminar producto ${contextMenu.product?.name}`);
								setContextMenu({ ...contextMenu, visible: false });
							}}
						>
							🗑 Eliminar
						</li>
					</ul>
				)}

				{/* Paginación */}
				<div className="flex justify-end items-center gap-2 mt-8 text-sm">
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
			</div>
		</section>




	);
};

export default AdminProducts;
