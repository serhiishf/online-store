import { SubHeaderData } from '../../../types/Subheader';
import { Callback } from '../../../types/Callbacks';
import App from '../../../pages/app/app';

export class Subheader {
  draw(subHeaderData: SubHeaderData, length: number, callback: Callback) {
    const templateElem = <HTMLTemplateElement>document.querySelector('#subheader-main');
    const subHeaderElem: HTMLElement = <HTMLElement>templateElem.content.cloneNode(true);
    subHeaderElem.querySelector('.subheader__wrap')?.addEventListener('change', callback);
    if (subHeaderData.sort !== 'default') {
      console.log(subHeaderData.sort, subHeaderData.direction);
      (<HTMLOptionElement>subHeaderElem.querySelector(`.sort-${subHeaderData.sort}-${subHeaderData.direction}`)).selected = true;
    }
    
    if (subHeaderData.searchData.length !== 0) {
      const contentSearchInput: string = subHeaderData.searchData.join(' ');
      (<HTMLInputElement>subHeaderElem.querySelector('.subheader__search')).value = contentSearchInput;
    }
    
    const countItem = subHeaderElem.querySelector('.subheader__count_item');
    if (countItem) {
      countItem.textContent = `${length}`;
    }
    
    const btnCopy = subHeaderElem.querySelector('.subheader__btn_copy');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        btnCopy.textContent = 'Copied!';
        //document.execCommand('copy');
      });
    }
    
    const btnReset = subHeaderElem.querySelector('.subheader__btn_reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        const baseUrl = window.location.origin + '/';
        window.history.pushState('object or string', 'Title');
        const app = new App();
        app.run();
      });
    }
    const searchInput = <HTMLInputElement>subHeaderElem.querySelector('.subheader__search');
    if (searchInput) {
      searchInput.addEventListener('input', () => console.log(searchInput.value));
      searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          callback();
        }
      });
    }
    
    return subHeaderElem;
  }
}
