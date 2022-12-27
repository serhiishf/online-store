import { Product } from '../../types/index';
import {
    FilterItem,
    StatusFilterItem,
    FiltersType,
    MaxMin,
    FilterCollection,
    SortDirection,
    SortType,
} from '../../types/Filter';

export class FilterData {
    goods: Product[];

    constructor(goods: Product[]) {
        this.goods = goods;
    }

    getFilterItems(goods: Product[], checkedItemsFilter: FilterCollection[]) {}

    getList(goods: Product[], filtersType: FiltersType) {
        return Array.from(new Set(goods.map((elem) => elem[filtersType])));
    }

    getMaxMin(goods: Product[], filtersType: FiltersType.price | FiltersType.stock) {
        const result: MaxMin = {
            min: 0,
            max: 0,
        };
        result.max = Math.max(...(this.getList(goods, filtersType) as number[]));
        result.min = Math.min(...(this.getList(goods, filtersType) as number[]));
        return result;
    }

    getFilterData(goods: Product[], filterType: FiltersType, param: string | MaxMin) {
        if (typeof param === 'string') {
            return goods.filter((elem) => elem[filterType] === param);
        } else {
            return goods.filter((elem) => elem[filterType] >= param.min && elem[filterType] <= param.max);
        }
    }

    facetedFilter(goods: Product[], data: FilterCollection[]) {
        let result: Product[] = goods;
        data.forEach((elem) => {
            let accum: Product[] = [];
            if (Array.isArray(elem.keys)) {
                elem.keys.forEach((key) => {
                    const tempArr = this.getFilterData(result, elem.type, key);
                    accum = [...accum, ...tempArr];
                });
            } else {
                const tempArr = this.getFilterData(result, elem.type, elem.keys);
                accum = [...accum, ...tempArr];
            }
            result = accum;
        });
        return result;
    }

    sortData(goods: Product[], sortType: SortType, direction: SortDirection) {
        return goods.sort((a, b) => {
            if (a[sortType] > b[sortType]) {
                if (direction === SortDirection.up) {
                    return 1;
                } else if (direction === SortDirection.down) {
                    return -1;
                }
            }
            if (a[sortType] < b[sortType]) {
                if (direction === SortDirection.up) {
                    return -1;
                } else if (direction === SortDirection.down) {
                    return 1;
                }
            }
            return 0;
        });
    }

    getSearchedData(goods: Product[], keys: string[]) {
        let result: Product[] = goods;
        keys.forEach((key) => {
            const accum: Product[] = [];
            const keyNormalize = key.toString().toLowerCase();
            const regExp = new RegExp(`${keyNormalize}`);
            result.forEach((item) => {
                for (const prop in item) {
                    if (regExp.test(item[prop as keyof Product].toString().toLowerCase())) {
                        return accum.push(item);
                    }
                }
            });
            result = accum;
        });
        return result;
    }
}
