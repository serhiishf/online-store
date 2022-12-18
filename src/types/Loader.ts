import { Product } from './Product';

export type Callback<T> = (data: T) => void;

export interface JsonProducts {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface UrlApi {
    base: string;
    goods: string;
    categories: string;
}

export enum FiltersType {
  category = 'category',
  brand = 'brand',
}