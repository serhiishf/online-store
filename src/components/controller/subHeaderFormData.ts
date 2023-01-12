import { SubHeaderData } from '../../types/Subheader';
import { SortDirection, SortType } from '../../types/Filter';

export class SubHeaderFormData {
  getFormData(): SubHeaderData {
    const result: SubHeaderData = {
      sort: 'default',
      direction: SortDirection.up,
      searchData: [],
    };
    const sortTypeDir = (<HTMLSelectElement>document.querySelector('.subheader__sort'))?.value;
    if (sortTypeDir) {
      if (sortTypeDir === 'price-up') {
        result.sort = SortType.price;
        result.direction = SortDirection.up;
      } else if (sortTypeDir === 'price-down') {
        result.sort = SortType.price;
        result.direction = SortDirection.down;
      } else if (sortTypeDir === 'title-up') {
        result.sort = SortType.stock;
        result.direction = SortDirection.up;
      } else if (sortTypeDir === 'title-down') {
        result.sort = SortType.stock;
        result.direction = SortDirection.down;
      }
    }
    const searchParam = (<HTMLInputElement>document.querySelector('.subheader__search')).value;
    if (searchParam) {
      const searchParamArr = searchParam.split(' ').filter((item) => item.length !== 0);
      result.searchData = searchParamArr;
    }
    return result;
  }
}
