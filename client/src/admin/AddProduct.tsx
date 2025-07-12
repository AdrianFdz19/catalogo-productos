import React, { useRef, useState } from 'react';
import { ProductForm } from '../types/products';
import AddFiles from './AddFiles';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import { uploadImage } from '../utils/uploadImage';
import SuccessToast from '../components/SuccessToast';

const AddProduct: React.FC = () => {
	const { apiUrl } = useAppContext();
	const [showToast, setShowToast] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const nameInputRef = useRef<HTMLInputElement>(null);
	const [formData, setFormData] = useState<ProductForm>({
		id: 'preview', // id temporal
		name: '',
		description: '',
		price: 0,
		category: '',
		stock: 0,
		imageUrls: [],
		featured: false,
		tags: []
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;

		const isCheckbox = type === 'checkbox';
		const inputValue = isCheckbox
			? (e.target as HTMLInputElement).checked // 👈 Cast seguro
			: name === 'price' || name === 'stock'
				? Number(value)
				: value;

		setFormData((prev) => ({
			...prev,
			[name]: inputValue,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			/* Subir primero las imagenes a cloudinary-multer */
			let uploadedUrls: string[] = [];

			if (formData.imageUrls.length > 0) {
				uploadedUrls = await Promise.all(
					formData.imageUrls.map(async (file: File) => {
						return await uploadImage(file);
					})
				);
			}

			console.log('✅ URLs subidas:', uploadedUrls);
			// Aquí terminaría la lógica por ahora

			/* Subir el articulo completo con la URL de las imagenes */
			const productToSend = {
				...formData,
				imageUrls: uploadedUrls,
			};

			const response = await fetch(`${apiUrl}/products`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productToSend),
			});

			const data = await response.json();
			console.log('🎉 Producto guardado:', data);
			setShowToast(true);
			setFormData({
				id: 'preview',
				name: '',
				description: '',
				price: 0,
				category: '',
				stock: 0,
				imageUrls: [],
				featured: false,
				tags: [],
			});
			nameInputRef.current?.focus();

		} catch (err) {
			console.error('❌ Error subiendo imágenes:', err);
		}
	};

	const nextImage = () => {
		if (!formData.imageUrls.length) return;
		setCurrentImageIndex((prev) =>
			prev < formData.imageUrls.length - 1 ? prev + 1 : 0
		);
	};

	const prevImage = () => {
		if (!formData.imageUrls.length) return;
		setCurrentImageIndex((prev) =>
			prev > 0 ? prev - 1 : formData.imageUrls.length - 1
		);
	};

	return (
		<section className="w-full px-4 py-10 bg-white">
			<div className="max-w-4xl mx-auto">
				<h2 className="text-3xl font-bold mb-8 text-gray-900">Agregar nuevo producto</h2>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Columna izquierda: formulario */}
					<form onSubmit={handleSubmit} className="flex-1 space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
							<input
								type="text"
								ref={nameInputRef}
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md p-2"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								rows={3}
								className="w-full border border-gray-300 rounded-md p-2"
								required
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
								<input
									type="number"
									name="price"
									value={formData.price}
									onChange={handleChange}
									className="w-full border border-gray-300 rounded-md p-2"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
								<input
									type="number"
									name="stock"
									value={formData.stock}
									onChange={handleChange}
									className="w-full border border-gray-300 rounded-md p-2"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
							<select
								name="category"
								value={formData.category}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-md p-2"
								required
							>
								<option value="">Selecciona una categoría</option>
								<option value="Laptops">Laptops</option>
								<option value="Smart Home">Hogar inteligente</option>
								<option value="Cameras">Cámaras</option>
								<option value="Accessories">Accesorios</option>
							</select>
						</div>

						<AddFiles
							onImagesChange={(imgs) =>
								setFormData((prev) => ({
									...prev,
									imageUrls: imgs,
								}))
							}
						/>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								name="featured"
								checked={formData.featured}
								onChange={handleChange}
								className="h-4 w-4 text-blue-600 border-gray-300 rounded"
							/>
							<label className="text-sm text-gray-700">Producto destacado</label>
						</div>

						{/* TAGS */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Etiquetas (tags)</label>

							<div className="w-full border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 bg-white min-h-[44px]">
								{formData.tags?.map((tag, index) => (
									<span
										key={index}
										className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full flex items-center gap-1"
									>
										{tag}
										<button
											type="button"
											className='hover:bg-red-100 hover:text-red-600'
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													tags: prev.tags.filter((_, i) => i !== index),
												}))
											}
										>
											×
										</button>
									</span>
								))}

								<input
									type="text"
									onKeyDown={(e) => {
										const value = e.currentTarget.value.trim();
										if (
											(e.key === 'Enter' || e.key === ',' || e.key === ' ') &&
											value &&
											!formData.tags.includes(value)
										) {
											e.preventDefault();
											setFormData((prev) => ({
												...prev,
												tags: [...prev.tags, value],
											}));
											e.currentTarget.value = '';
										}
									}}
									className="flex-1 min-w-[120px] border-none focus:outline-none text-sm"
									placeholder="Escribe y presiona espacio"
								/>
							</div>
						</div>

						<button
							type="submit"
							className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
						>
							Guardar producto
						</button>
					</form>

					{/* Columna derecha: vista previa */}
					<div className="flex-1">
						<p className="text-sm text-gray-600 mb-2">Vista previa</p>
						<div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col">
							<div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
								<img
									src={formData.imageUrls[currentImageIndex] ? URL.createObjectURL(formData.imageUrls[currentImageIndex]) : ''}
									alt={formData.name}
									className="w-full h-full object-cover transition-all"
								/>

								{formData.imageUrls.length > 1 && (
									<>
										<button
											onClick={prevImage}
											className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white transition 
											cursor-pointer"
										>
											<ChevronLeft size={20} />
										</button>

										<button
											onClick={nextImage}
											className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-white transition
											cursor-pointer"
										>
											<ChevronRight size={20} />
										</button>
									</>
								)}
							</div>

							<h3 className="text-lg font-semibold text-gray-900">
								{formData.name}
							</h3>
							<p
								className="text-gray-600 text-sm break-words whitespace-pre-wrap"
							>
								{formData.description.length > 200
									? formData.description.slice(0, 200) + '...'
									: formData.description}
							</p>
							<p className="text-blue-600 font-bold mt-2">${formData.price}</p>
							<p className="text-xs text-gray-400 mt-auto">Stock: {formData.stock}</p>
						</div>
					</div>
				</div>
			</div>
			{showToast && (
				<SuccessToast message="Producto agregado exitosamente" onClose={() => setShowToast(false)} />
			)}
		</section>
	);
};

export default AddProduct;
