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

  public static setPageQueryParams() {
    const pageCountEl = <HTMLElement>document.querySelector('.cart__sub-page-count');
    const url = new URL(window.location.href);
    url.searchParams.set('page', <string>pageCountEl.textContent);
    window.history.pushState(null, '', url.toString());
  }

  private static setLimitQueryParams(inputLimitEl: HTMLInputElement) {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', `${inputLimitEl.value}`);
    window.history.pushState(null, '', url.toString());
  }

  public static setActualLastPage(): number {
    const inputLimitEl = <HTMLInputElement>document.querySelector('#limit-prod-on-page');
    const cart = CartController.getCart() ? JSON.parse(<string>CartController.getCart()) : null;
    const oneTypeProductCount: number = cart?.oneTypeProductCount || 1;
    return Math.ceil(oneTypeProductCount / Number(inputLimitEl.value));
  }

  private onPrevPageBtnClick() {
    const prevPageButtonEl = <HTMLButtonElement>document.querySelector('.cart__sub-page-btn-prev');
    const nextPageButtonEl = <HTMLButtonElement>document.querySelector('.cart__sub-page-btn-next');
    const pageNumEl = <HTMLElement>document.querySelector('.cart__sub-page-count');

    nextPageButtonEl.disabled = false;
    pageNumEl.textContent = `${+(<string>pageNumEl.textContent) - 1}`;

    CartPageHeader.setPageQueryParams();

    const lastPage = CartPageHeader.setActualLastPage();
    if (pageNumEl.textContent === lastPage.toString()) {
      nextPageButtonEl.disabled = true;
    }

    if (pageNumEl.textContent === '1') {
      prevPageButtonEl.disabled = true;
    }
  }

  private onNextPageBtnClick() {
    const prevPageButtonEl = <HTMLButtonElement>document.querySelector('.cart__sub-page-btn-prev');
    const nextPageButtonEl = <HTMLButtonElement>document.querySelector('.cart__sub-page-btn-next');
    const pageNumEl = <HTMLElement>document.querySelector('.cart__sub-page-count');

    prevPageButtonEl.disabled = false;
    pageNumEl.textContent = `${+(<string>pageNumEl.textContent) + 1}`;
    CartPageHeader.setPageQueryParams();
    const lastPage = CartPageHeader.setActualLastPage();
    if (pageNumEl.textContent === lastPage.toString()) {
      nextPageButtonEl.disabled = true;
    }
  }

  private onLimitChange() {
    const limitEl = <HTMLInputElement>document.querySelector('#limit-prod-on-page');
    const pageCountEl = <HTMLElement>document.querySelector('.cart__sub-page-count');
    const nextBtnEl = <HTMLButtonElement>document.querySelector('.cart__sub-page-btn-next');
    const btnIncrLimitEl = <HTMLButtonElement>document.querySelector('.cart__limit-input-incr');
    const btnDecrLimitEl = <HTMLButtonElement>document.querySelector('.cart__limit-input-decr');

    CartPageHeader.setLimitQueryParams(limitEl);
    const lastPage = CartPageHeader.setActualLastPage();
    const cart = CartController.getCart() ? JSON.parse(<string>CartController.getCart()) : null;
    const oneTypeProductCount: number = cart?.oneTypeProductCount || 1;
    if (pageCountEl.textContent === lastPage.toString()) {
      nextBtnEl.disabled = true;
      pageCountEl.textContent = lastPage.toString();
      CartPageHeader.setPageQueryParams();
    } else {
      nextBtnEl.disabled = false;
    }

    if (limitEl.value === limitEl.min) {
      btnDecrLimitEl.disabled = true;
    }

    if (Number(limitEl.value) >= oneTypeProductCount) {
      btnIncrLimitEl.disabled = true;
    }
  }

  private incLimitPage() {
    const limitEl = <HTMLInputElement>document.querySelector('#limit-prod-on-page');
    const btnDecrLimitEl = <HTMLButtonElement>document.querySelector('.cart__limit-input-decr');

    btnDecrLimitEl.disabled = false;

    limitEl.value = `${parseInt(limitEl.value) + 1}`;
    const changeEvent = new Event('change');
    limitEl.dispatchEvent(changeEvent);
  }

  private decLimitPage() {
    const limitEl = <HTMLInputElement>document.querySelector('#limit-prod-on-page');
    const btnIncrLimitEl = <HTMLButtonElement>document.querySelector('.cart__limit-input-incr');
    btnIncrLimitEl.disabled = false;

    if (Number(limitEl.value) > Number(limitEl.min)) {
      limitEl.value = `${parseInt(limitEl.value) - 1}`;
      const changeEvent = new Event('change');
      limitEl.dispatchEvent(changeEvent);
    }
  }

  public draw() {
    const fragment = <DocumentFragment>document.createDocumentFragment();
    const template = <HTMLTemplateElement>document.querySelector('#cart-page-header');

    const prodClone = <HTMLElement>template.content.cloneNode(true);
    const inputLimitEl = <HTMLInputElement>prodClone.querySelector('#limit-prod-on-page');
    const btnIncLimitEl = <HTMLButtonElement>prodClone.querySelector('.cart__limit-input-incr');
    const btnDecrLimitEl = <HTMLButtonElement>prodClone.querySelector('.cart__limit-input-decr');

    const prevPageButtonEl = <HTMLButtonElement>prodClone.querySelector('.cart__sub-page-btn-prev');
    const nextPageButtonEl = <HTMLButtonElement>prodClone.querySelector('.cart__sub-page-btn-next');
    const pageNumEl = <HTMLElement>prodClone.querySelector('.cart__sub-page-count');

    //set limit actual value:
    inputLimitEl.max = this.cart?.oneTypeProductCount.toString() || '2';

    if (this.urlParams.search.limit) {
      inputLimitEl.value = this.urlParams.search.limit;
    }
    if (inputLimitEl.value === '2') {
      btnDecrLimitEl.disabled = true;
    }

    if (Number(inputLimitEl.value) >= <number>this.cart?.oneTypeProductCount) {
      btnIncLimitEl.disabled = true;
    }

    inputLimitEl.addEventListener('change', this.onLimitChange);
    btnIncLimitEl.addEventListener('click', this.incLimitPage);
    btnDecrLimitEl.addEventListener('click', this.decLimitPage);

    //get query params for render  actual page
    pageNumEl.textContent = this.urlParams.search.page ? this.urlParams.search.page.toString() : '1';
    if (pageNumEl.textContent === '1') {
      prevPageButtonEl.disabled = true;
    }
    if (this.lastPage <= Number(pageNumEl.textContent)) {
      nextPageButtonEl.disabled = true;
    }

    prevPageButtonEl.addEventListener('click', this.onPrevPageBtnClick);
    nextPageButtonEl.addEventListener('click', this.onNextPageBtnClick);

    fragment.append(prodClone);
    this.headerEl.append(fragment);
    return this.headerEl;
  }
}
