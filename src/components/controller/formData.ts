import { RangeType, FilterCollection, FiltersType, MaxMin, MaxMinValue } from '../../types/Filter';

export class FormData {
  getFormData(entryDataKey: string) {
    const mainKeys = Array.from(
      document.querySelectorAll(`[data-${entryDataKey}]`),
      (item) => (<HTMLElement>item).dataset[`${entryDataKey}`]
    );
    const result: FilterCollection[] = [];
    mainKeys.forEach((key) => {
      if (key !== undefined) {
        if (FiltersType.price === key || FiltersType.stock === key) {
          const minRange = <HTMLInputElement>document.querySelector(`[data-${key}-min]`);
          const maxRange = <HTMLInputElement>document.querySelector(`[data-${key}-max]`);
          const min = minRange.getAttribute('min');
          const max = maxRange.getAttribute('max');
          const minValue = minRange.getAttribute('value');
          const maxValue = maxRange.getAttribute('value');
        //  console.log(minValue, maxValue, min, max);
          if (minValue !== min || maxValue !== max) {
            if (min !== undefined && max !== undefined) {
              const maxMinVal: MaxMinValue = {
                min: Number(min),
                max: Number(max),
                minValue: Number(minValue),
                maxValue: Number(maxValue),
              };
              const filterCollectionItem: FilterCollection = {
                type: key,
                keys: maxMinVal,
              };
              result.push(filterCollectionItem);
            }
          }
        } else {
          if (FiltersType.brand === key || FiltersType.category === key) {
            const checkedArr = Array.from(document.querySelectorAll(`[data-${key}]`)).filter(
              (item) => (<HTMLInputElement>item).checked === true
            );
            const subKeysRaw = checkedArr.map((item) => (<HTMLElement>item).dataset[`${key}`]);
            const subKeys: string[] = [];
            subKeysRaw.forEach((item) => {
              if (typeof item === 'string') {
                subKeys.push(item);
              }
            });
            if (subKeys.length !== 0) {
              const filterCollectionItem: FilterCollection = {
                type: key,
                keys: subKeys,
              };
              result.push(filterCollectionItem);
            }
          }
        }
      }
    });
    return result;
  }
}
