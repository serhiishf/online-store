import { Products } from '../../components/view/products';
import { Loader } from '../../components/controller/loader';
import { RenderFilters } from '../../components/controller/renderAllFilters';
//
import { Callback } from '../../types/Callbacks';
import { FilterCollection, FiltersType, FilterOrRange, SortDirection, SortType, MaxMinValue } from '../../types/Filter';
import { Product } from '../../types/Product';
import { FormData } from '../../components/controller/formData';
import { FilterData } from '../../components/controller/filterData';
import { Subheader } from '../../components/view/subheader/subheader';
import { SubHeaderData } from '../../types/Subheader';
import { SubHeaderFormData } from '../../components/controller/subHeaderFormData';
import { parseRequestUrl } from '../controller/parseRequestUrl';

enum Url {
  base = 'https://dummyjson.com',
  goods = '/products?limit=30',
  categories = '/products/categories',
}

export class MainPageEvent {
  view: Products;
  loader: Loader;
  filter: FilterData;
  subHeaderFormData: SubHeaderFormData;
  formData: FormData;
  filterOrRange: FilterOrRange[];
  subHeader: Subheader;

  constructor() {
    this.view = new Products();
    this.loader = new Loader(Url);
    this.filter = new FilterData();
    this.subHeaderFormData = new SubHeaderFormData();
    this.formData = new FormData();
    this.subHeader = new Subheader();
    this.filterOrRange = [
      { type: 'filter', name: FiltersType.category },
      { type: 'filter', name: FiltersType.brand },
      { type: 'range', name: FiltersType.price },
      { type: 'range', name: FiltersType.stock },
    ];
  }

  async loadData() {
    await this.loader.loadGoods();
  }

  async handlerEvent(parentFilterNode: HTMLElement, parentSearchNode: HTMLElement, parentMainNode: HTMLElement) {
    await this.loader.loadGoods();
    const rawData = this.loader.rawData;
    const checkedFormData = this.formData.getFormData('filterkey');
    const searchFormDataSave = this.subHeaderFormData.getFormData();
    const searchParamsForUrl = this.searchDataToString(searchFormDataSave);
    const filterParamsForUrl = this.filterDataToString(checkedFormData);
    this.setPageQueryParams('search', searchParamsForUrl);
    this.setPageQueryParams('filter', filterParamsForUrl);
    
    const searchFormData = this.subHeaderFormData.getFormData();

    const dataAfterFilter = this.filter.facetedFilter(rawData, checkedFormData);
    const dataOnlyAfterSearch = this.filter.getSearchedData(rawData, searchFormData.searchData);
    let dataAfterSearch = dataAfterFilter;
    if (searchFormData.searchData.length !== 0) {
      dataAfterSearch = this.filter.getSearchedData(dataAfterFilter, searchFormData.searchData);
    }
    let resultArr = dataAfterSearch;
    if (searchFormData.sort !== 'default') {
      resultArr = this.filter.sortData(dataAfterSearch, searchFormData.sort, searchFormData.direction);
    }

    //render main Container;
    parentMainNode.innerHTML = '';

    // render filters
    parentFilterNode.innerHTML = '';
    const renderFilters = new RenderFilters(parentFilterNode, () =>
      this.handlerEvent(parentFilterNode, parentSearchNode, parentMainNode)
    );
    renderFilters.drawAll(/* rawData  */ dataOnlyAfterSearch, this.filterOrRange, checkedFormData);

    //render search
    parentSearchNode.innerHTML = '';
    const renderSearch = this.subHeader.draw(searchFormData, dataAfterSearch.length, () => {
      this.handlerEvent(parentFilterNode, parentSearchNode, parentMainNode);
    });
    parentSearchNode.append(renderSearch);

    //render products
    const products = await this.view.draw(resultArr);
    parentMainNode.append(parentFilterNode, products);

  }

  filterDataToString(checkedFormData: FilterCollection[]) {
    let result = '';
    checkedFormData.forEach((filterColItem) => {
        result += '^^' + filterColItem.type + '&^&'
        if(filterColItem.type === FiltersType.brand || filterColItem.type === FiltersType.category) {
            if (Array.isArray(filterColItem.keys)) {
                const keysStr = filterColItem.keys.join('||');
                result += keysStr;
            }
        } else if(filterColItem.type === FiltersType.stock || filterColItem.type === FiltersType.price) {
            if(!Array.isArray(filterColItem.keys)) {
            result += filterColItem.keys.min.toString() + '||';
            result += filterColItem.keys.minValue.toString() + '||';
            result += filterColItem.keys.maxValue.toString() + '||';
            result += filterColItem.keys.max.toString();
            }
        }
    })
    console.log(result);
    return result;
  }
  parseFilterData(str: string) {
    const result: FilterCollection[] = [];
    const allKeysRaw = str.split('%5E%5E');
    const allKeys = allKeysRaw.filter(elem => elem.length !== 0);
    allKeys.forEach((strFilterCol) => {
        const keyStr = strFilterCol.split('%26%5E%26');
        if(keyStr[0] === FiltersType.brand || keyStr[0] === FiltersType.category) {
            const keysArrRaw = keyStr[1].split('%7C%7C');
            const keysArr = keysArrRaw.map(elem => {
                const replace26Arr = elem.split('%26');
                const replace26Str = replace26Arr.join('&');
                const replaceSpaceArr = replace26Str.split('+');
                const replaceSpaceStr = replaceSpaceArr.join(' ');
               return replaceSpaceStr;
            })
           
            const filterCollectionItem: FilterCollection = {
                type: keyStr[0],
                keys: keysArr,
            }
            result.push(filterCollectionItem);
        } else if(keyStr[0] === FiltersType.price || keyStr[0] === FiltersType.stock) {
            const maxMinValueItemRaw = keyStr[1].split('%7C%7C');
            const maxMinValueItem: MaxMinValue = {
                min: Number(maxMinValueItemRaw[0]),
                minValue: Number(maxMinValueItemRaw[1]),
                maxValue: Number(maxMinValueItemRaw[2]),
                max: Number(maxMinValueItemRaw[3]),
            }
            const filterCollectionItem: FilterCollection = {
                type: keyStr[0],
                keys: maxMinValueItem,
            }
            result.push(filterCollectionItem);
        }
    })

    return result;
  }

  searchDataToString(searchFormData: SubHeaderData) {
    let result = '';
    result += searchFormData.sort + '&';
    result += searchFormData.direction;
    if (searchFormData.searchData.length !== 0) {
      result += '&' + searchFormData.searchData.join('|');
    }
    return result;
  }

  parseSearchData(str: string) {
    const allKeys = str.split('%26');
    const result: SubHeaderData = {
      sort: 'default',
      direction: SortDirection.up,
      searchData: [],
    };
    if (allKeys.length === 2 || allKeys.length === 3) {
      if (allKeys[0] === 'stock') {
        result.sort = SortType.stock;
      } else if (allKeys[0] === 'price') {
        result.sort = SortType.price;
      }
      if (allKeys[1] === 'up') {
        result.direction = SortDirection.up;
      } else if (allKeys[1] === 'down') {
        result.direction = SortDirection.down;
      }
    }
    if (allKeys.length === 3) {
      const searchKeys = allKeys[2].split('%7C');
      if (searchKeys.length !== 0) {
        result.searchData = searchKeys;
      }
    }
    return result;
  }

  public setPageQueryParams(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState(null, '', url.toString());
  }
}
