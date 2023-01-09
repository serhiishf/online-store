import TemplatePage from '../templatePage';
import { Loader } from '../../components/controller/loader';
import { Products } from '../../components/view/products';
import { RenderFilters } from '../../components/controller/renderAllFilters';
import { Callback } from '../../types/Callbacks';
import { FilterCollection, FiltersType, FilterOrRange, SortDirection } from '../../types/Filter';
import { Product } from '../../types/Product';
import { FormData } from '../../components/controller/formData';
import { FilterData } from '../../components/controller/filterData';
import { Subheader } from '../../components/view/subheader/subheader';
import { SubHeaderData } from '../../types/Subheader';
import { SubHeaderFormData } from '../../components/controller/subHeaderFormData';
import { MainPageEvent } from '../../components/controller/mainPageEvents';

//test URL:    (later will be class to parse info from URL string)
enum Url {
  base = 'https://dummyjson.com',
  goods = '/products?limit=10',
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

    //const rawData = rawDataMoc;
    const thumb = this.createPageHTML(MainPage.textObject.mainThumb);

    const subHeadContainer = this.createPageHTML('sub-header-container');
    const mainContainer = this.createPageHTML('main-container');

    //data for render
    const formData = new FormData().getFormData('filterkey');
    const dataProduct = new FilterData().facetedFilter(rawData, formData);
    const mocDataForSubHeader:SubHeaderData = {
      sort: 'default',
      direction: SortDirection.up,
      searchData: [],
    }

    // filters

    const filtersContainer = this.createPageHTML(MainPage.textObject.filters);

    this.mainEvent.handlerEvent(filtersContainer, subHeadContainer, mainContainer);
    this.renderFilters(rawData, filtersContainer, [], () => {
      this.mainEvent.handlerEvent(filtersContainer, subHeadContainer, mainContainer )
    });
    const products = await this.createProductsCards(rawData);
    
    //subheader
    const subHeader = new Subheader().draw(mocDataForSubHeader, length, () => {
      this.mainEvent.handlerEvent(filtersContainer, subHeadContainer, mainContainer);
    })

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
    })
    parentNode.append(subHeader);
  }

  /* formCallback(parentNode: HTMLElement, checkedData: FilterCollection[]) {
    parentNode.innerHTML = '';
    const rawData = this.loader.rawData;
    this.renderFilters(rawData, parentNode, checkedData, () => {
      const formData = new FormData().getFormData('filterkey');
      const searchData = new SubHeaderFormData().getFormData();
      this.formCallback(parentNode, formData);
      const dataProduct: Product[] = new FilterData().facetedFilter(rawData, formData);
      this.createProductsCards(dataProduct);

      const parentNodeForSubHEader = <HTMLElement>document.querySelector('.sub-header-container');
      if(parentNodeForSubHEader) {
        //this.renderSubHeader(parentNodeForSubHEader, searchData, dataProduct.length)
      }
    });
  } */

/*   searchCallback(parentNode: HTMLElement) {
    const checkedData = new FormData().getFormData('filterkey');
    const searchData = new SubHeaderFormData().getFormData();

    const rawData = this.loader.rawData;
    
    this.renderFilters(rawData, parentNode, checkedData, () => {
      const formData = new FormData().getFormData('filterkey');
      const searchData = new SubHeaderFormData().getFormData();
      this.formCallback(parentNode, formData);
      const dataProduct: Product[] = new FilterData().facetedFilter(rawData, formData);
      this.createProductsCards(dataProduct);

      const parentNodeForSubHEader = <HTMLElement>document.querySelector('.sub-header-container');
      if(parentNodeForSubHEader) {
        this.renderSubHeader(parentNodeForSubHEader, searchData, dataProduct.length)
      }
    });
  } */
}

export default MainPage;
