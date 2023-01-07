import { Cart, UrlParams } from '../../../types';
import { CartController } from '../../controller/cartController';
import { parseRequestUrl } from '../../controller/parseRequestUrl';

export class CartPageHeader {
  headerEl: HTMLElement;
  cart: Cart | null;
  urlParams: UrlParams;
  lastPage: number;

  constructor() {
    this.headerEl = document.createElement('div');
    this.headerEl.classList.add('cart__header-thumb');
    this.cart = CartController.getCart() ? JSON.parse(<string>CartController.getCart()) : null;
    this.urlParams = parseRequestUrl();
    const lastPageMath = (): number => {
      const oneTypeProductCount: number = this.cart?.oneTypeProductCount || 1;
      const limitOnPage = Number(this.urlParams.search.limit) || 2; //like in html templ
      return Math.ceil(oneTypeProductCount / limitOnPage);
    };
    this.lastPage = lastPageMath();
  }

  private setPageQueryParams(pageCountEl: HTMLElement) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', <string>pageCountEl.textContent);
    window.history.pushState(null, '', url.toString());
  }
  private setLimitQueryParams(inputLimitEl: HTMLInputElement) {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', `${inputLimitEl.value}`);
    window.history.pushState(null, '', url.toString());
  }
  private setActualLastPage(): number {
    const inputLimitEl = <HTMLInputElement>document.querySelector('#limit-prod-on-page');
    const cart = CartController.getCart() ? JSON.parse(<string>CartController.getCart()) : null;
    const oneTypeProductCount: number = cart?.oneTypeProductCount || 1;
    return Math.ceil(oneTypeProductCount / Number(inputLimitEl.value));
  }

  private onPrevPageBtnClick(prevBtnEl: HTMLButtonElement, pageCountEl: HTMLElement, nextBtnEl: HTMLButtonElement) {
    nextBtnEl.disabled = false;
    pageCountEl.textContent = `${+(<string>pageCountEl.textContent) - 1}`;

    this.setPageQueryParams(pageCountEl);
    //?
    const lastPage = this.setActualLastPage();
    if (pageCountEl.textContent === lastPage.toString()) {
      nextBtnEl.disabled = true;
    }
    //?
    if (pageCountEl.textContent === '1') {
      prevBtnEl.disabled = true;
    }
  }

  private onNextPageBtnClick(prevBtnEl: HTMLButtonElement, pageCountEl: HTMLElement, nextBtnEl: HTMLButtonElement) {
    prevBtnEl.disabled = false;
    pageCountEl.textContent = `${+(<string>pageCountEl.textContent) + 1}`;
    this.setPageQueryParams(pageCountEl);
    const lastPage = this.setActualLastPage();
    if (pageCountEl.textContent === lastPage.toString()) {
      nextBtnEl.disabled = true;
    }
  }

  private onLimitChange(inputLimitEl: HTMLInputElement, pageCountEl: HTMLElement, nextBtnEl: HTMLButtonElement) {
    this.setLimitQueryParams(inputLimitEl);
    const lastPage = this.setActualLastPage();
    if (pageCountEl.textContent === lastPage.toString()) {
      nextBtnEl.disabled = true;
      pageCountEl.textContent = lastPage.toString();
      this.setPageQueryParams(pageCountEl);
    } else {
      nextBtnEl.disabled = false;
    }
  }

  public draw() {
    const fragment = <DocumentFragment>document.createDocumentFragment();
    const template = <HTMLTemplateElement>document.querySelector('#cart-page-header');

    const prodClone = <HTMLElement>template.content.cloneNode(true);
    const inputLimitEl = <HTMLInputElement>prodClone.querySelector('#limit-prod-on-page');
    const prevPageButtonEl = <HTMLButtonElement>prodClone.querySelector('.cart__sub-page-btn-prev');
    const nextPageButtonEl = <HTMLButtonElement>prodClone.querySelector('.cart__sub-page-btn-next');
    const pageNumEl = <HTMLElement>prodClone.querySelector('.cart__sub-page-count');
    //set limit actual value:
    if (this.urlParams.search.limit) {
      inputLimitEl.value = this.urlParams.search.limit;
    }

    inputLimitEl.max = this.cart?.oneTypeProductCount.toString() || '2';
    inputLimitEl.addEventListener('change', () => this.onLimitChange(inputLimitEl, pageNumEl, nextPageButtonEl));

    //get query params for render  actual page
    pageNumEl.textContent = this.urlParams.search.page ? this.urlParams.search.page.toString() : '1';
    if (pageNumEl.textContent === '1') {
      prevPageButtonEl.disabled = true;
    }
    if (this.lastPage <= Number(pageNumEl.textContent)) {
      nextPageButtonEl.disabled = true;
    }
    prevPageButtonEl.addEventListener('click', () =>
      this.onPrevPageBtnClick(prevPageButtonEl, pageNumEl, nextPageButtonEl)
    );
    nextPageButtonEl.addEventListener('click', () =>
      this.onNextPageBtnClick(prevPageButtonEl, pageNumEl, nextPageButtonEl)
    );

    fragment.append(prodClone);
    this.headerEl.append(fragment);
    return this.headerEl;
  }
}
