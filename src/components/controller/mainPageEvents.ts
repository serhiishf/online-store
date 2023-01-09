import { Products } from '../../components/view/products';
import { Loader } from '../../components/controller/loader';
import { RenderFilters } from '../../components/controller/renderAllFilters';
//
import { Callback } from '../../types/Callbacks';
import { FilterCollection, FiltersType, FilterOrRange, SortDirection } from '../../types/Filter';
import { Product } from '../../types/Product';
import { FormData } from '../../components/controller/formData';
import { FilterData } from '../../components/controller/filterData';
import { Subheader } from '../../components/view/subheader/subheader';
import { SubHeaderData } from '../../types/Subheader';
import { SubHeaderFormData } from '../../components/controller/subHeaderFormData';

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
}
