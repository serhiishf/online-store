import TemplatePage from '../templatePage';
import { Loader } from '../../components/controller/loader';
import { Products } from '../../components/view/products';
import { RenderFilters } from '../../components/controller/renderAllFilters';
import { Callback } from '../../types/Callbacks';
import { FilterCollection, FiltersType, FilterOrRange, SortDirection } from '../../types/Filter';
import { Product } from '../../types/Product';
// import { FormData } from '../../components/controller/formData';
import { FilterData } from '../../components/controller/filterData';
import { Subheader } from '../../components/view/subheader/subheader';
import { SubHeaderData } from '../../types/Subheader';
// import { SubHeaderFormData } from '../../components/controller/subHeaderFormData';
import { MainPageEvent } from '../../components/controller/mainPageEvents';
import { parseRequestUrl } from '../../components/controller/parseRequestUrl';

//test URL:    (later will be class to parse info from URL string)
enum Url {
  base = 'https://dummyjson.com',
  goods = '/products?limit=30',
  categories = '/products/categories',
}

class MainPage extends TemplatePage {
  loader: Loader;
  view: Products;
  mainEvent: MainPageEvent;

  static textObject = {
    mainThumb: 'main__thumb',
    filters: 'filters',
  };

  constructor(id: string) {
    super(id);
    //test loader:
    this.loader = new Loader(Url);
    this.view = new Products();
    this.mainEvent = new MainPageEvent();
  }

  async loadData() {
    await this.loader.loadGoods();
  }
  async createProductsCards(goods: Product[]) {
    return this.view.draw(goods);
  }

  async render() {
    await this.loadData();
    const rawData = this.loader.rawData;

    //parse url
    let mocDataForSubHeader: SubHeaderData = {
      sort: 'default',
      direction: SortDirection.up,
      searchData: [],
    };

    let formData: FilterCollection[] = [];

    const urlParams = parseRequestUrl();

    if (urlParams.search !== undefined) {
      if (urlParams.search.search !== undefined) {
        const strKey = urlParams.search.search;
        if (typeof strKey === 'string') {
          mocDataForSubHeader = this.mainEvent.parseSearchData(strKey);
        }
      }
    }
    if (urlParams.search !== undefined) {
      if (urlParams.search.filter !== undefined) {
        const strKey = urlParams.search.filter;
        if (typeof strKey === 'string') {
          formData = this.mainEvent.parseFilterData(strKey);
        }
      }
    }

    //this.mainEvent

    //const rawData = rawDataMoc;
    const thumb = this.createPageHTML(MainPage.textObject.mainThumb);

    const subHeadContainer = this.createPageHTML('sub-header-container');
    const mainContainer = this.createPageHTML('main-container');

    //data for render

    const dataProduct = new FilterData().facetedFilter(rawData, formData);
    const dataAfterSearch = new FilterData().getSearchedData(dataProduct, mocDataForSubHeader.searchData);
    const dataOnlyAfterSearch = new FilterData().getSearchedData(rawData, mocDataForSubHeader.searchData);
    let dataAfterSort = dataAfterSearch;
    if (mocDataForSubHeader.sort !== 'default') {
      dataAfterSort = new FilterData().sortData(
        dataAfterSearch,
        mocDataForSubHeader.sort,
        mocDataForSubHeader.direction
      );
    }

    // render filters
    const filtersContainer = this.createPageHTML(MainPage.textObject.filters);

    this.renderFilters(dataOnlyAfterSearch, filtersContainer, formData, () => {
      this.mainEvent.handlerEvent(filtersContainer, subHeadContainer, mainContainer);
    });
    const products = await this.createProductsCards(dataAfterSort);
    // console.log(dataOnlyAfterSearch)
    //render search
    const subHeader = new Subheader().draw(mocDataForSubHeader, dataAfterSearch.length, () => {
      this.mainEvent.handlerEvent(filtersContainer, subHeadContainer, mainContainer);
    });
    subHeadContainer.append(subHeader);

    mainContainer.append(filtersContainer, products);
    thumb.append(subHeadContainer, mainContainer);
    //thumb.append(filtersContainer, products);

    this.container.append(thumb);
    return this.container;
  }

  renderFilters(goods: Product[], parentNode: HTMLElement, checkedData: FilterCollection[], callback: Callback) {
    parentNode;
    const renderFiltersObj = new RenderFilters(parentNode, callback);
    const mockFilterOrRange: FilterOrRange[] = [
      { type: 'filter', name: FiltersType.category },
      { type: 'filter', name: FiltersType.brand },
      { type: 'range', name: FiltersType.price },
      { type: 'range', name: FiltersType.stock },
    ];
    renderFiltersObj.drawAll(goods, mockFilterOrRange, checkedData);
  }

  renderSubHeader(parentNode: HTMLElement, mocDataForSubHeader: SubHeaderData, length: number, callback: Callback) {
    parentNode.innerHTML = '';
    const subHeader = new Subheader().draw(mocDataForSubHeader, length, () => {
      //callback()
      //const sortSearchFromData = new SubHeaderFormData().getFormData();
    });
    parentNode.append(subHeader);
  }
}

export default MainPage;
