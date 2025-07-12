import React from 'react';
import { Product } from '../types/products';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition flex flex-col cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <div className="w-full aspect-square mb-4">
                <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
            </h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">${product.price}</p>
            <p className="text-xs text-gray-400 mt-auto">Stock: {product.stock}</p>
        </div>
    );
};

export default ProductCard;
