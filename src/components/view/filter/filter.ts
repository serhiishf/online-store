import { FiltersType } from '../../../types/Loader';
import { FilterItem, StatusFilterItem } from '../../../types/Filter';

export class Filter {
    filterSection: HTMLElement;
    filterTitle: HTMLElement;
    filterList: HTMLElement;

    constructor(category: FiltersType) {
        this.filterSection = <HTMLElement>document.createElement('div');
        this.filterSection.classList.add(`filter__${category}`, 'filter');
        this.filterTitle = <HTMLElement>document.createElement('div');
        this.filterTitle.classList.add('filter__title');
        this.filterTitle.textContent = `${category}`;
        this.filterList = <HTMLElement>document.createElement('ul');
        this.filterList.classList.add('filter__list');
        this.filterSection.append(this.filterTitle, this.filterList);
    }

    draw(filterListData: FilterItem[]): HTMLElement {
        const itemCloneTemp = <HTMLTemplateElement>document.querySelector('#filter-item');
        const fragment = <DocumentFragment>document.createDocumentFragment();
        filterListData.forEach((item) => {
            const itemClone = <HTMLElement>itemCloneTemp.content.cloneNode(true);
            (<HTMLElement>itemClone.querySelector('.filter__text')).textContent = item.filterName;
            (<HTMLElement>itemClone.querySelector('.filter__amount')).textContent = `(${item.amount.toString()})`;
            if (item.status === StatusFilterItem.active) {
                (<HTMLInputElement>itemClone.querySelector('.filter__checkbox-input')).checked = true;
            } else if (item.status === StatusFilterItem.normal) {
                (<HTMLInputElement>itemClone.querySelector('.filter__checkbox-input')).checked = false;
            } else if (item.status === StatusFilterItem.disabled) {
                const checkBox = <HTMLInputElement>itemClone.querySelector('.filter__checkbox-input');
                checkBox.disabled = true;
                checkBox.classList.add('filter__checkbox-input_disabled');
                (<HTMLInputElement>itemClone.querySelector('.filter__item')).classList.add('filter__item_disabled');
            }
            fragment.append(itemClone);
        });
        this.filterList.innerHTML = '';
        this.filterList.append(fragment);
        return this.filterSection;
    }
}
