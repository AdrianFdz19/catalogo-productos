import React from 'react';

type ProductsFilterProps = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
};


export default function ProductFilter({ categories, selectedCategory, setSelectedCategory }: ProductsFilterProps) {
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
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
