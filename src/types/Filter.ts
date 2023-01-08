export interface FilterItem {
    filterName: string;
    status: StatusFilterItem;
    amount: number;
    maxAmount: number;
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
    price = 'price',
}

export interface MaxMin {
    min: number;
    max: number;
};

export interface MaxMinValue extends MaxMin {
  minValue: number;
  maxValue: number;
}

export interface FilterCollection {
    type: FiltersType;
    keys: string[] | MaxMinValue;
}

export enum SortDirection {
    up = 'up',
    down = 'down',
}

export interface FilterOrRange {
    type: 'filter' | 'range';
    name: FiltersType;
}
