export type ApiProduct = {
  id: number;
  name: string;
  price: string;
  image_url: string;
  description: string;
  category: string;
};

import { Product } from '../models/product';

export const mapApiProductToProduct = (p: ApiProduct): Product => ({
  id: p.id,
  name: p.name,
  price: Number(p.price),
  imageUrl: p.image_url,
  description: p.description,
  category: p.category,
});

// Converts frontend Product (or partial for update) to Backend ApiProduct format
export const mapProductToApiProduct = (p: Partial<Product>): Partial<ApiProduct> => ({
  name: p.name,
  price: String(p.price), // Backend expects a string for the price
  image_url: p.imageUrl, // Backend expects image_url
  description: p.description,
  category: p.category,
});
