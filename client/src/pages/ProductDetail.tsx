import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import ImageViewer from '../components/ImageViewer';
import { FaHeart, FaWhatsapp } from 'react-icons/fa';
import SuccessToast from '../components/SuccessToast';

type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	images: string[];
	featured?: boolean;
	isFavorite?: boolean;
};

const ProductDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { apiUrl, user } = useAppContext();
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const [viewerIndex, setViewerIndex] = useState(0);
	const [isFavorite, setIsFavorite] = useState<boolean>(user?.role === 'admin' ? false : product?.isFavorite);
	const [showToast, setShowToast] = useState(false);

	const toggleFavorite = async (e: React.MouseEvent) => {
		e.stopPropagation(); // evita que se navegue al hacer click en el corazón
		try {
			const res = await fetch(
				`${apiUrl}/products/${isFavorite ? 'remove-favorites' : 'add-favorites'}`,
				{
					method: 'POST',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ productId: product.id })
				}
			);

			if (res.ok) {
				setIsFavorite(prev => !prev);
				if (!isFavorite) setShowToast(true);
			} else {
				const data = await res.json();
				console.error(data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const fetchProductById = async () => {
			try {
				const res = await fetch(`${apiUrl}/products/${id}`, {
					method: 'GET',
					credentials: 'include'
				});
				const data = await res.json();
				if (!data || !data.id) {
					setProduct(null);
				} else {
					setProduct(data);
					console.log(data);
				}
			} catch (err) {
				console.error(err);
				setProduct(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProductById();
	}, [id]);

	if (isLoading) {
		return (
			<section className="flex items-center justify-center h-[80vh]">
				<p className="text-gray-600 text-lg">Cargando producto...</p>
			</section>
		);
	}

	if (!product) {
		return (
			<section className="w-full px-4 py-8 h-[100vh]">
				<div className="max-w-3xl mx-auto text-center">
					<p className="text-gray-700 text-lg">Producto no encontrado.</p>
					<Link to="/" className="text-blue-600 underline mt-4 inline-block">
						Volver al catálogo
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full px-4 py-8 bg-gray-50 min-h-[100vh]">
			<div className="max-w-6xl mx-auto">
				{/* Botón de volver */}
				<div className="mb-6">
					<Link to="/" className="text-gray-700 hover:underline text-sm">
						← Volver al catálogo
					</Link>
				</div>

				{/* Contenido principal */}
				<div className="flex flex-col md:flex-row gap-10 bg-white rounded-lg shadow-sm p-8">
					{/* Imagen principal */}
					<div className="flex-1">
						<div className="w-full aspect-square">
							<img
								src={product.images[0]}
								alt={product.name}
								onClick={() => {
									setViewerIndex(0);
									setIsViewerOpen(true);
								}}
								className="w-full h-full rounded-lg shadow-md object-cover cursor-pointer"
							/>
						</div>
						{isViewerOpen && (
							<ImageViewer
								images={product.images}
								initialIndex={viewerIndex}
								onClose={() => setIsViewerOpen(false)}
							/>
						)}
					</div>

					{/* Detalles del producto */}
					<div className="flex-1 flex flex-col text-left">
						<h1 className="text-3xl font-semibold text-gray-900 mb-3">
							{product.name}
						</h1>

						<p className="text-gray-700 text-base mb-4 leading-relaxed">
							{product.description}
						</p>

						<p className="text-2xl text-gray-900 font-bold mb-2">
							${product.price}
						</p>
						<p className="text-sm text-gray-500 mb-2">
							Categoría: {product.category}
						</p>
						<p
							className={`text-sm font-semibold mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
								}`}
						>
							{product.stock > 0
								? `En stock: ${product.stock}`
								: 'Agotado'}
						</p>

						{/* Botones verticales */}
						<div className="flex flex-col gap-3 w-full max-w-xs">
							{user?.role === 'user' &&
								<>

									<button
										onClick={toggleFavorite}
										className="flex items-center justify-center gap-2 border border-gray-300 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-100 transition"
									>
										<FaHeart className="text-gray-700" />
										Agregar a favoritos
									</button>

									<a
										href={`https://wa.me/5212280000000?text=Hola, me interesa el producto "${product.name}"`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 border border-black text-black font-medium py-2 rounded-lg hover:bg-black hover:text-white transition"
									>
										<FaWhatsapp className="text-black" />
										Contactar vendedor
									</a>
								</>
							}

						</div>
					</div>
				</div>

				{/* Descripción ampliada */}
				<div className="mt-10 bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Detalles del producto
					</h2>
					<p className="text-gray-700 leading-relaxed">
						{product.description ||
							'Este producto no tiene una descripción adicional.'}
					</p>
				</div>
			</div>
			{showToast && (
				<SuccessToast
					message="Producto agregado a tus favoritos"
					onClose={() => setShowToast(false)}
					bgColor="#3b82f6" // azul
				/>
			)}
		</section>
	);
};

export default ProductDetail;
