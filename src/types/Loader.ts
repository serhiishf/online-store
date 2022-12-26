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

export enum SortType {
    rating = 'rating',
    title = 'title',
}

export type MaxMin = {
    min: number;
    max: number;
};

export interface FilterCollection {
    type: FiltersType;
    keys: string[] | MaxMin;
}

export enum SortDirection {
    up,
    down,
}
