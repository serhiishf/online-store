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