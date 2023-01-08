import { Product } from '../../types/index';
import {
    FilterItem,
    StatusFilterItem,
    FiltersType,
    MaxMin,
    FilterCollection,
    SortDirection,
    SortType,
    MaxMinValue
} from '../../types/Filter';

export class FilterData {
    getFilterItems(goods: Product[], checkedItemsFilter: FilterCollection[], checkAvailable: FiltersType) {
        const filterListData: FilterItem[] = [];
        const allFilterList = this.getList(goods, checkAvailable);
        const excludedCheckedItemsFilter = checkedItemsFilter.filter((elem) => elem.type !== checkAvailable);
        const availableGoods = this.facetedFilter(goods, excludedCheckedItemsFilter);
        const finalGoodsArr = this.facetedFilter(goods, checkedItemsFilter);
        const availableFilterList = this.getList(availableGoods, checkAvailable);
        const checkedFilterList = checkedItemsFilter.filter(elem => elem.type === checkAvailable).shift()?.keys;
        allFilterList.forEach(title => {
          const result: FilterItem = {
            filterName: title.toString(),
            status: StatusFilterItem.disabled,
            amount: this.getFilterData(finalGoodsArr, checkAvailable,  title.toString()).length,
            maxAmount: this.getFilterData(goods, checkAvailable,  title.toString()).length,
          }
          if (availableFilterList.includes(title)) {
            result.status = StatusFilterItem.normal;
          }
          if (checkedFilterList && Array.isArray(checkedFilterList)) {
            if (checkedFilterList.includes(title.toString())) {
              result.status = StatusFilterItem.active;
            }
          }
          filterListData.push(result);
        })
      return filterListData;
    }

    getRangeItems(goods: Product[], checkedItemsFilter: FilterCollection[], checkRange: FiltersType.price | FiltersType.stock) {
      const excludedCheckedItemsFilter = checkedItemsFilter.filter((elem) => elem.type !== checkRange);
      const itemRange = checkedItemsFilter.find((elem) => elem.type === checkRange);
      const availableGoods = this.facetedFilter(goods, excludedCheckedItemsFilter);
      const maxMin: MaxMin = this.getMaxMin(availableGoods, checkRange);
      const maxMinValue: MaxMinValue = {
        min: maxMin.min,
        max: maxMin.max,
        minValue: maxMin.min,
        maxValue: maxMin.max,
      }
      if (itemRange && itemRange.type === checkRange && !Array.isArray(itemRange.keys)) {
        maxMinValue.minValue = itemRange.keys.minValue;
        maxMinValue.maxValue = itemRange.keys.maxValue;
      }
      return maxMinValue;
    }

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

    getFilterData(goods: Product[], filterType: FiltersType, param: string | MaxMinValue) {
        if (typeof param === 'string') {
            return goods.filter((elem) => elem[filterType] === param);
        } else {
            return goods.filter((elem) => elem[filterType] >= param.minValue && elem[filterType] <= param.maxValue);
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
