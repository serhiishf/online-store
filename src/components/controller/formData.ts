import { RangeType, FilterCollection, FiltersType, MaxMin } from '../../types/Filter';

export class FormData {
  getFormData(entryDataKey: string, filtersType: FiltersType, rangeType: RangeType) {
    const mainKeys = Array.from(document.querySelectorAll(`[data-${entryDataKey}]`), item => (<HTMLElement>item).dataset[`${entryDataKey}`]);
    const result: FilterCollection[] = [];
    mainKeys.forEach((key) => {
      if(key !== undefined && Object.values(filtersType).includes(key)){
        if(Object.values(rangeType).includes(key)){
          if (FiltersType.price === key || FiltersType.stock === key) {
            const min = (<HTMLElement>document.querySelector(`[data-${key}-min]`)).dataset[`${key}Min`];
            const max = (<HTMLElement>document.querySelector(`[data-${key}-max]`)).dataset[`${key}Max`];
            if(min !== undefined && max !== undefined) {
              const maxMin: MaxMin = {
                min: Number(min),
                max: Number(max),
              }
              const filterCollectionItem: FilterCollection = {
                type: key,
                keys: maxMin,
              }
              result.push(filterCollectionItem);
            }
          }
        } else {
          if(FiltersType.brand === key || FiltersType.category === key) {
            const checkedArr = Array.from(document.querySelectorAll(`[data-${key}]`)).filter((item) => (<HTMLInputElement>item).checked === true)
            const subKeysRaw = checkedArr.map(item => (<HTMLElement>item).dataset[`${key}`]); 
            const subKeys: string[] = [];
            subKeysRaw.forEach((item) => {
              if (typeof item === 'string') {
                subKeys.push(item);
              }
            })
            if(subKeys.length !== 0) {
              const filterCollectionItem: FilterCollection = {
                type: key,
                keys: subKeys,
              }
              result.push(filterCollectionItem);
            }
          }
        }
      }
    })
    console.log(result)
    return result;
  }
}
