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
    goods = '/products?limit=100',
    categories = '/products/categories',
  }

export class MainPageEvent {
    view: Products;
    loader: Loader;
    
    constructor() {
        this.view = new Products();
        this.loader = new Loader(Url);
    }
    

    handlerEvent() {
       //const renderFilters = new RenderFilters();
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
    
    renderSubHeader(parentNode: HTMLElement, mocDataForSubHeader: SubHeaderData, length: number) {
        parentNode.innerHTML = '';
        const subHeader = new Subheader().draw(mocDataForSubHeader, length, () => {
          const sortSearchFromData = new SubHeaderFormData().getFormData();
        })
        parentNode.append(subHeader);
    }
}