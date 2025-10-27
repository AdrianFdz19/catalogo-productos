import React from 'react';

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="flex justify-center mb-4">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>
  );
}
