// @ts-nocheck
//----Test File

import { Loader } from './loader';
//import { Products } from '../view/products/products';
import { FiltersType, FilterCollection, SortDirection } from '../../types/Filter';
import { Filter } from '../view/filter/filter';
import { StatusFilterItem, FilterOrRange } from '../../types/Filter';
import { FilterData } from '../controller/filterData';
import { rawDataMoc } from '../controller/testData';
import { parseRequestUrl } from '../controller/parseRequestUrl';
import { RenderFilters } from '../controller/renderAllFilters';
enum Url {
  base = 'https://dummyjson.com',
  goods = '/products?limit=100',
  categories = '/products/categories',
}
const test = new Loader(Url);
export async function testFunction() {
  //(document.querySelector('.filter__checkbox-input_disabled') as HTMLInputElement).disabled = true;

  //test filter render
  const filterSection = new Filter(FiltersType.brand);

  //get data from api, render carts with goods
  //await test.loadGoods();
  function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  await timeout(1000);

  const mocFilterChecked = [
    { type: FiltersType.category, keys: ['smartphones', 'fragrances'] },
    { type: FiltersType.brand, keys: ['Apple', 'OPPO'] },
    { type: FiltersType.price, keys: { min: 10, max: 1500 } },
  ];
  //get raw data
  // const arr = test.rawData;
  const arr = rawDataMoc;

  //get FilterItem for render
  const filterData = new FilterData();
  const categoryItemsForRender = filterData.getFilterItems(arr, mocFilterChecked, FiltersType.category);
  const brandItemsForRender = filterData.getFilterItems(arr, mocFilterChecked, FiltersType.brand);

  //render multiply filters with class
  const parentNodeFilters = document.querySelector('.filters');
  const mocDataArrFiltersAndRange: FilterOrRange[] = [
    { type: 'filter', name: FiltersType.category },
    { type: 'filter', name: FiltersType.brand },
    { type: 'range', name: FiltersType.price },
    { type: 'range', name: FiltersType.stock },
  ];
  if (parentNodeFilters) {
    const renderFiltersClass = new RenderFilters(<HTMLElement>parentNodeFilters, () => {
    const datasetData = [...document.querySelectorAll('[data-filterkey]')].map((elem) => elem.dataset.filterkey )
    console.log(datasetData)
    });
    renderFiltersClass.drawAll(arr, mocDataArrFiltersAndRange, mocFilterChecked);
  }


  //render filters manual
  /*     const categoryRender = new Filter(FiltersType.category).draw(categoryItemsForRender);
    const brandRender = new Filter(FiltersType.brand).draw(brandItemsForRender);
    document.querySelector('.filters')?.append(categoryRender, brandRender);
    
    const isParseUrl = parseRequestUrl;
    console.log(isParseUrl); */

  //get arr with category and brands (this data we can use for render filters)
  //console.log(test.getList(arr, FiltersType.category));
  //console.log(test.getList(arr, FiltersType.brand));

  //get diapazone max min
  //console.log(test.getMaxMin(arr, FiltersType.price));
  //console.log(test.getMaxMin(arr, FiltersType.stock));

  //filter raw arr
  //console.log(test.getFilterData(arr, FiltersType.category, 'smartphones'));
  //console.log(test.getFilterData(arr, FiltersType.price, { min: 25, max: 125 }));

  //faceted filter
  //console.log(test.facetedFilter(arr, [{type: FiltersType.category, keys: ['smartphones', 'fragrances', ]}, {type: FiltersType.price, keys: {min: 10, max: 1500}}]))

  //sort data
  //console.log(test.sortData(arr, FiltersType.title, SortDirection.down))

  //search data
  //console.log(test.getSearchedData(arr, ['ap', '8', '23']))
}
