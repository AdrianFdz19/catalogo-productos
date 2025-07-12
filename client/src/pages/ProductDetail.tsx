import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import ImageViewer from '../components/ImageViewer';

type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	images: string[];
	featured?: boolean;
};

const ProductDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { apiUrl } = useAppContext();
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const [viewerIndex, setViewerIndex] = useState(0);

	useEffect(() => {
		const fetchProductById = async () => {
			try {
				const res = await fetch(`${apiUrl}/products/${id}`);
				const data = await res.json();
				console.log(data);
				if (!data || !data.id) {
					setProduct(null);
				} else {
					setProduct(data);
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

	useEffect(() => {
		console.log(product);
	}, [product]);

	if (isLoading) {
		<p>Cargando...</p>
	}

	if (!isLoading) {
		if (!product) {
			return (
				<section className="w-full px-4 py-8 h-[100vh]">
					<div className="max-w-3xl mx-auto text-center">
						<p className="text-gray-700 text-lg">Producto no encontrado.</p>
						<Link to="/" className="text-blue-600 underline mt-4 inline-block">Volver al catálogo</Link>
					</div>
				</section>
			)
		} else {
			return (
				<section className="w-full px-4 py-8 bg-gray-50 min-h-[100vh]">
					<div className="max-w-6xl mx-auto">
						{/* Botón de volver */}
						<div className="mb-6">
							<Link to="/" className="text-blue-600 hover:underline text-sm">
								← Volver al catálogo
							</Link>
						</div>

						{/* Contenido */}
						<div className="flex flex-col md:flex-row gap-8">
							{/* Imagen */}
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

							{/* Detalles */}
							<div className="flex-1 text-left">
								<h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
								<p className="text-gray-700 text-base mb-4">{product.description}</p>

								<p className="text-xl text-blue-600 font-bold mb-2">${product.price}</p>
								<p className="text-sm text-gray-500 mb-2">Categoría: {product.category}</p>
								<p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
									{product.stock > 0 ? `En stock: ${product.stock}` : 'Agotado'}
								</p>
							</div>
						</div>
					</div>
				</section>
			)
		}
	}
};

export default ProductDetail;
