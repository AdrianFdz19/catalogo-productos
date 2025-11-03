export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrls: string[];
  featured?: boolean;
  isFavorite: boolean;
};

export type MappedProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  featured?: boolean;
};

export type ProductForm = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrls: (File | string)[];
  featured?: boolean;
  tags: string[];
};