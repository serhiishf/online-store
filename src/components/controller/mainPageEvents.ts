import { Products } from '../../components/view/products';
import { Loader } from '../../components/controller/loader';
import { RenderFilters } from '../../components/controller/renderAllFilters';
//
import { Callback } from '../../types/Callbacks';
import { FilterCollection, FiltersType, FilterOrRange, SortDirection, SortType } from '../../types/Filter';
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
    this.setPageQueryParams('search', searchParamsForUrl);

    //parse data
    const urlParams = parseRequestUrl();
    
    const searchFormData = this.subHeaderFormData.getFormData();
  /*   if(urlParams.search !== undefined) {
      if(urlParams.search.search !== undefined) {
        const strKey = urlParams.search.search;
        console.log(true)
        if(typeof strKey === 'string'){
          console.log('tueere')
          console.log(strKey)
          searchFormData = this.parseSearchData(strKey);
          console.log(searchFormData);
        } 
      }
    } */


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

    //test
   
    //console.log(a);
  }

  filterDataToString(checkedFormData: FilterCollection) {
    const result = '';
    checkedFormData;
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
    console.log('parseSearchData')
    const allKeys = str.split('%26');
    const result: SubHeaderData = {
      sort: 'default',
      direction: SortDirection.up,
      searchData: [],
    };
    console.log(allKeys)
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
        console.log('worksssasdas')
      const searchKeys = allKeys[2].split('%7C');
      if (searchKeys.length !== 0) {
        result.searchData = searchKeys;
      }
    }
    console.log(result)
    return result;
  }

  public setPageQueryParams(key: string, value: string) {
    console.log('write url')
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState(null, '', url.toString());
  }
}
