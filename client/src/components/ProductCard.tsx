import React, { useEffect, useState } from 'react';
import { Product } from '../types/products';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import SuccessToast from './SuccessToast';

interface ProductCardProps {
  product: Product;
  apiUrl: string;
  userRole: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, apiUrl, userRole }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState<boolean>(product.isFavorite);
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

  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col cursor-pointer relative"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* ❤️ Corazón de favoritos solo si NO es admin */}
      {userRole !== 'admin' && (
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 text-2xl z-10 cursor-pointer"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-red-500 transition" />
          )}
        </button>
      )}

      <div className="w-full aspect-square mb-4">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
      <p className="text-gray-600 text-sm">{product.description}</p>
      <p className="text-blue-600 font-bold mt-2">${product.price}</p>
      <p className="text-xs text-gray-400 mt-auto">Stock: {product.stock}</p>
      {showToast && (
        <SuccessToast
          message="Producto agregado a tus favoritos"
          onClose={() => setShowToast(false)}
          bgColor="#3b82f6" // azul
        />
      )}
    </div>
  );
};

export default ProductCard;
