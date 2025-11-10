import React from 'react';
import { Category } from '../types/products';

type ProductsFilterProps = {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
};


export default function ProductFilter({
  categories,
  selectedCategory,
  setSelectedCategory
}: ProductsFilterProps) {

  return (
    <div className="flex gap-3 flex-wrap justify-center mb-6">
      <button
        onClick={() => setSelectedCategory('')}
        className={`px-4 py-2 rounded-full border ${selectedCategory === '' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.slug)}
          className={`px-4 py-2 rounded-full border ${selectedCategory === cat.slug
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-100'}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
