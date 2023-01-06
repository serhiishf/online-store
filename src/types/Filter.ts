export interface FilterItem {
    filterName: string;
    status: StatusFilterItem;
    amount: number;
}

export enum StatusFilterItem {
    active = 'active',
    normal = 'normal',
    disabled = 'disabled',
}

export enum FiltersType {
    category = 'category',
    brand = 'brand',
    price = 'price',
    stock = 'stock',
}

export enum RangeType {
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

export interface FilterOrRange {
    type: 'filter' | 'range';
    name: FiltersType;
}
