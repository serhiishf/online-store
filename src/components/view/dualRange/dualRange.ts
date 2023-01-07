import { FiltersType } from '../../../types/Filter';
import { FilterItem, StatusFilterItem, MaxMin, MaxMinValue } from '../../../types/Filter';

export class DualRange {
  filterSection: HTMLElement;
  filterTitle: HTMLElement;
  category: FiltersType;
  sliderColor = '#C6C6C6';
  rangeColor = '#f1d627';

  constructor(category: FiltersType) {
    this.filterSection = <HTMLElement>document.createElement('div');
    this.filterSection.classList.add(`filter__${category}`, 'filter');
    this.filterSection.setAttribute('data-filterkey', category);
    this.filterTitle = <HTMLElement>document.createElement('div');
    this.filterTitle.classList.add('filter__title');
    this.filterTitle.textContent = `${category}`;
    this.filterSection.append(this.filterTitle);
    this.category = category;
  }

  draw(maxMin: MaxMinValue) {
    const min = maxMin.min.toString();
    const max = maxMin.max.toString();
    let minValue = maxMin.minValue.toString();
    let maxValue = maxMin.maxValue.toString();
    if(Number(minValue) === Number(maxValue)) {
      minValue = min;
      maxValue = max;
    }
    const itemCloneTemp = <HTMLTemplateElement>document.querySelector('#dual-range-item');
    const itemClone = <HTMLElement>itemCloneTemp.content.cloneNode(true);
    const sliderFrom = <HTMLInputElement>itemClone.querySelector('.range__slider_from');
    const sliderTo = <HTMLInputElement>itemClone.querySelector('.range__slider_to');
    const inputFrom = <HTMLInputElement>itemClone.querySelector('.range__num-input_from');
    const inputTo = <HTMLInputElement>itemClone.querySelector('.range__num-input_to');
    sliderFrom.setAttribute('min', min);
    sliderFrom.setAttribute('max', max);
    sliderFrom.setAttribute('value', minValue);
    sliderTo.setAttribute('min', min);
    sliderTo.setAttribute('max', max);
    sliderTo.setAttribute('value', maxValue);
    sliderFrom.setAttribute(`data-${this.category}-min`, sliderFrom.min);
    sliderTo.setAttribute(`data-${this.category}-max`, sliderTo.max);
    inputFrom.setAttribute('value', minValue);
    inputFrom.disabled = true;
    inputTo.disabled = true;
    inputTo.setAttribute('value', maxValue);
    this.fillSlider(sliderFrom, sliderTo, sliderTo);
    this.setToggleAccessible(sliderTo, sliderTo);

    sliderFrom.oninput = () => this.controlFromSlider(sliderFrom, sliderTo, inputFrom);
    sliderTo.oninput = () => this.controlToSlider(sliderFrom, sliderTo, inputTo);
    inputFrom.onchange = () => this.controlFromInput(sliderFrom, inputFrom, inputTo, sliderTo);
    inputTo.onchange = () => this.controlToInput(sliderTo, inputFrom, inputTo, sliderTo);

    this.filterSection.append(itemClone);
    return this.filterSection;
  }

  fillSlider(sliderFrom: HTMLInputElement, sliderTo: HTMLInputElement, controlSlider: HTMLInputElement) {
    const rangeDistance = Number(sliderTo.max) - Number(sliderTo.min);
    const fromPosition = Number(sliderFrom.value) - Number(sliderTo.min);
    const toPosition = Number(sliderTo.value) - Number(sliderTo.min);
    controlSlider.style.background = `linear-gradient(
        to right,
        ${this.sliderColor} ${(fromPosition / rangeDistance) * 100}%,
        ${this.sliderColor} 0%,
        ${this.rangeColor} ${(fromPosition / rangeDistance) * 100}%,
        ${this.rangeColor} ${(toPosition / rangeDistance) * 100}%, 
        ${this.sliderColor} ${(toPosition / rangeDistance) * 100}%, 
        ${this.sliderColor} 100%)`;
  }

  setToggleAccessible(currentTarget: HTMLInputElement, sliderTo: HTMLInputElement) {
    if (Number(currentTarget.value) <= 0) {
      sliderTo.style.zIndex = String(2);
    } else {
      sliderTo.style.zIndex = String(0);
    }
  }

  getParsed(currentFrom: HTMLInputElement, currentTo: HTMLInputElement) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }

  controlFromInput(
    sliderFrom: HTMLInputElement,
    inputFrom: HTMLInputElement,
    inputTo: HTMLInputElement,
    controlSlider: HTMLInputElement
  ) {
    const [from, to] = this.getParsed(inputFrom, inputTo);
    this.fillSlider(inputFrom, inputTo, controlSlider);
    if (from > to) {
      sliderFrom.value = to.toString();
      inputFrom.value = to.toString();
    } else {
      sliderFrom.value = from.toString();
    }
   
  }

  controlToInput(
    sliderTo: HTMLInputElement,
    inputFrom: HTMLInputElement,
    inputTo: HTMLInputElement,
    controlSlider: HTMLInputElement
  ) {
    const [from, to] = this.getParsed(inputFrom, inputTo);
    if (from <= to) {
      sliderTo.value = to.toString();
      inputTo.value = to.toString();
    } else {
      inputTo.value = from.toString();
    }
    this.fillSlider(inputFrom, inputTo, controlSlider);
    this.setToggleAccessible(inputTo, sliderTo);
  }

  controlFromSlider(sliderFrom: HTMLInputElement, sliderTo: HTMLInputElement, inputFrom: HTMLInputElement) {
    const [from, to] = this.getParsed(sliderFrom, sliderTo);
    this.fillSlider(sliderFrom, sliderTo, sliderTo);
    if (from > to) {
      sliderFrom.value = to.toString();
      inputFrom.value = to.toString();
    } else {
      inputFrom.value = from.toString();
    }
    sliderFrom.setAttribute(`value`, sliderFrom.value);
    sliderFrom.setAttribute(`data-${this.category}-min`, sliderFrom.value);
  }

  controlToSlider(sliderFrom: HTMLInputElement, sliderTo: HTMLInputElement, inputTo: HTMLInputElement) {
    const [from, to] = this.getParsed(sliderFrom, sliderTo);
    this.fillSlider(sliderFrom, sliderTo, sliderTo);
    this.setToggleAccessible(sliderTo, sliderTo);
    if (from <= to) {
      sliderTo.value = to.toString();
      inputTo.value = to.toString();
    } else {
      inputTo.value = from.toString();
      sliderTo.value = from.toString();
    }
    sliderTo.setAttribute(`value`, sliderTo.value);
    sliderTo.setAttribute(`data-${this.category}-max`, sliderTo.value);
  }
}
