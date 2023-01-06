import { Filter } from '../view/filter/filter';
import { Product } from '../../types/index';
import { FilterCollection, FilterOrRange, FiltersType } from '../../types/Filter';
import { FilterData } from './filterData';
import { Callback } from '../../types/Callbacks';
import { DualRange } from '../view/dualRange/dualRange';

export class RenderFilters {
  mainContainer: HTMLElement;
  form: HTMLElement;

  constructor(mainContainer: HTMLElement, callback: Callback) {
    this.mainContainer = mainContainer;
    this.form = document.createElement('form');
    this.form.classList.add('filters__form', 'form');
    this.form.addEventListener('change', callback);
    this.mainContainer.append(this.form);
  }

  drawAll(goods: Product[], arrFiltersAndRange: FilterOrRange[], checkedItemsFilter: FilterCollection[]) {
    this.form.innerHTML = '';
    const filterData= new FilterData()
    arrFiltersAndRange.forEach((section) => {
      if (section.type === 'filter') {
        const dataForRender = filterData.getFilterItems(goods, checkedItemsFilter, section.name);
        const renderSection = new Filter(section.name).draw(dataForRender);
        this.form.append(renderSection);
      } else if (section.type === 'range') {
        const filterArr = filterData.facetedFilter(goods, checkedItemsFilter)
        if(section.name === FiltersType.price || section.name === FiltersType.stock){
          const dataForRender = filterData.getMaxMin(filterArr, section.name);
          const renderSection = new DualRange(section.name).draw(dataForRender);
          this.form.append(renderSection);
        }
      }
    });
  }
}
