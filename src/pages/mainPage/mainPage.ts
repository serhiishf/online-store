import TemplatePage from '../templatePage';
import { Loader } from '../../components/controller/loader';
import { Products } from '../../components/view/products';
import { RenderFilters } from '../../components/controller/renderAllFilters';
import { Callback } from '../../types/Callbacks';
import { FilterCollection, FiltersType, FilterOrRange } from '../../types/Filter';
import { Product } from '../../types/Product';
import { FormData } from '../../components/controller/formData';
import { FilterData } from '../../components/controller/filterData';

//test URL:    (later will be class to parse info from URL string)
enum Url {
  base = 'https://dummyjson.com',
  goods = '/products?limit=100',
  categories = '/products/categories',
}

class MainPage extends TemplatePage {
  loader: Loader;
  view: Products;

  static textObject = {
    mainThumb: 'main__thumb',
    filters: 'filters',
  };

  constructor(id: string) {
    super(id);
    //test loader:
    this.loader = new Loader(Url);
    this.view = new Products();
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

    const filtersContainer = this.createPageHTML(MainPage.textObject.filters);
    this.renderFilters(rawData, filtersContainer, [], () => {
      const formData = new FormData().getFormData('filterkey');
      this.formCallback(filtersContainer, formData);
      const dataProduct: Product[] = new FilterData().facetedFilter(rawData, formData);
      this.createProductsCards(dataProduct);
    });
    const products = await this.createProductsCards(rawData);

    thumb.append(filtersContainer, products);

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
  formCallback(parentNode: HTMLElement, checkedData: FilterCollection[]) {
    parentNode.innerHTML = '';
    const rawData = this.loader.rawData;
    this.renderFilters(rawData, parentNode, checkedData, () => {
      const formData = new FormData().getFormData('filterkey');
      this.formCallback(parentNode, formData);
      const dataProduct: Product[] = new FilterData().facetedFilter(rawData, formData);
      this.createProductsCards(dataProduct);
    });
  }
}

export default MainPage;
