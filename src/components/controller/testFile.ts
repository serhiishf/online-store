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
    { type: FiltersType.price, keys: { min: 10, max: 15 } },
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
    const renderFiltersClass = new RenderFilters(<HTMLElement>parentNodeFilters, () => console.log('click'));
    renderFiltersClass.drawAll(arr, mocDataArrFiltersAndRange, mocFilterChecked);
  }

  // slider
  /*     function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
      const [from, to] = getParsed(fromInput, toInput);
      fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
      if (from > to) {
          fromSlider.value = to;
          fromInput.value = to;
      } else {
          fromSlider.value = from;
      }
  }
      
  function controlToInput(toSlider, fromInput, toInput, controlSlider) {
      const [from, to] = getParsed(fromInput, toInput);
      fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
      setToggleAccessible(toInput);
      if (from <= to) {
          toSlider.value = to;
          toInput.value = to;
      } else {
          toInput.value = from;
      }
  }
  
  function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    if (from > to) {
      fromSlider.value = to;
      fromInput.value = to;
    } else {
      fromInput.value = from;
    }
  }
  
  function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = to;
      toInput.value = to;
    } else {
      toInput.value = from;
      toSlider.value = from;
    }
  }
  
  function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }
  
  function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
      const rangeDistance = to.max-to.min;
      const fromPosition = from.value - to.min;
      const toPosition = to.value - to.min;
      controlSlider.style.background = `linear-gradient(
        to right,
        ${sliderColor} 0%,
        ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
        ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
        ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
        ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
        ${sliderColor} 100%)`;
  }
  
  function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0 ) {
      toSlider.style.zIndex = 2;
    } else {
      toSlider.style.zIndex = 0;
    }
  }
  
  const fromSlider = document.querySelector('#fromSlider');
  const toSlider = document.querySelector('#toSlider');
  const fromInput = document.querySelector('#fromInput');
  const toInput = document.querySelector('#toInput');
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider);
  
  fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
  toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
  fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
  toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);
   */

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
