import { Product } from './Product';

export interface UrlApi {
  base: string;
  goods: string;
  categories: string;
}

export interface JsonProducts {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export enum FiltersType {
  category = 'category',
  brand = 'brand',
  price = 'price',
  stock = 'stock',
}

export type MaxMin = {
  max: number;
  min: number;
}