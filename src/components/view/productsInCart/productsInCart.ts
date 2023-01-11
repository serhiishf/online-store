import { Cart, Product, ProductInCart as IProductInCart } from '../../../types';
import { CartController } from '../../controller/cartController';
import { HeaderController } from '../../controller/headerController';
import { LoaderSingleProduct } from '../../controller/loaderSingleProduct';
import { parseRequestUrl } from '../../controller/parseRequestUrl';
import { CartPageHeader } from '../cartPageHeader';
import { CartSummary } from '../cartSummary';

interface PageParams {
  page: number;
  limit: number;
}

export class ProductsInCart {
  protected items: IProductInCart[];
  protected listEl: HTMLUListElement;
  thumb: HTMLElement;
  headerEl: HTMLElement;
  summaryEl: HTMLElement;

  constructor(storageCart: Cart) {
    this.items = storageCart.products;
    this.thumb = document.createElement('div');
    this.thumb.classList.add('cart__sub-thumb');

    this.listEl = document.createElement('ol');
    this.listEl.classList.add('cart__product-list');
    this.headerEl = new CartPageHeader(storageCart).draw();
    this.summaryEl = new CartSummary(storageCart).draw();
  }

  private async getProducts(): Promise<Product[] | undefined> {
    try {
      const promises = this.items.map((el: IProductInCart) => LoaderSingleProduct.fetchProduct(el.id.toString()));
      const products: Product[] = await Promise.all(promises);
      return products;
    } catch (error) {
      let message: string = 'Restart the page!';
      if (typeof error === 'string') {
        message = error;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log(`Something went wrong! ${message}`);
    }
  }

  private addOrRemoveProdAction(parentEl: HTMLElement, prodId: number, prodPrice: number, inStock: number) {
    const incrBtnEl = <HTMLButtonElement>parentEl.querySelector('.cart__product-count-incr');
    const decrBtnEl = <HTMLButtonElement>parentEl.querySelector('.cart__product-count-decr');
    const countEl = <HTMLElement>parentEl.querySelector('.cart__product-count');
    const priceEl = <HTMLElement>parentEl.querySelector('.cart__product-price-quantity');

    const removeProduct = (): void => {
      const pageCount = <HTMLElement>this.headerEl.querySelector('.cart__sub-page-count');
      const prodQuantity = 1;

      incrBtnEl.disabled = false;
      CartController.removeOneProductOneType(prodId, prodPrice, prodQuantity);
      HeaderController.changeViewOnCartAction();

      countEl.textContent = `${Number(<string>countEl.textContent) - prodQuantity}`;
      priceEl.textContent = `${Number(<string>priceEl.textContent) - prodPrice * prodQuantity}`;

      //remove product item from list:
      if (countEl.textContent === '0') {
        const productItemEl = <HTMLElement>document.querySelector(`#product-id-${prodId}`);
        productItemEl.remove();
        ProductsInCart.onPaginationChange();

        const allProducts = document.querySelectorAll('.cart__product-item');
        const hiddenProducts = document.querySelectorAll('.cart__product-item.hidden');
        //change actual page if it is last page:
        const urlParams = parseRequestUrl();
        const cart = CartController.getCart() ? JSON.parse(<string>CartController.getCart()) : null;
        const oneTypeProductCount: number = cart?.oneTypeProductCount || 1;
        const limitOnPage = Number(urlParams.search.limit) || 2;
        const lastPage = Math.ceil(oneTypeProductCount / limitOnPage);
        const isLastPage = Number(pageCount.textContent) >= lastPage;
        if (isLastPage) {
          (<HTMLButtonElement>this.headerEl.querySelector('.cart__sub-page-btn-next')).disabled = true;
        }
        if (allProducts.length === hiddenProducts.length && isLastPage) {
          (<HTMLButtonElement>this.headerEl.querySelector('.cart__sub-page-btn-prev')).click();
        }
      }

      //clear cart page on empty cart:
      const cartStorage = CartController.getCart();
      if (cartStorage) {
        const cart: Cart = JSON.parse(cartStorage);
        if (cart.totalCount === 0) {
          const alternativeTxt = document.createElement('p');
          alternativeTxt.classList.add('alternative-txt');
          alternativeTxt.textContent = 'Your Cart is Empty';
          this.thumb.innerHTML = '';
          this.thumb.append(alternativeTxt);
        }
      }
    };

    const addProduct = (): void => {
      const prodQuantity = 1;
      CartController.addProduct(prodId, prodPrice, prodQuantity);
      HeaderController.changeViewOnCartAction();

      countEl.textContent = `${Number(<string>countEl.textContent) + prodQuantity}`;
      priceEl.textContent = `${Number(<string>priceEl.textContent) + prodPrice * prodQuantity}`;

      if (Number(countEl.textContent) === inStock) {
        incrBtnEl.disabled = true;
      }
    };

    incrBtnEl.addEventListener('click', addProduct);
    decrBtnEl.addEventListener('click', removeProduct);
  }

  private static showPageAndLimit(): PageParams {
    const URLparamsObj = parseRequestUrl();

    const page: PageParams['page'] = Number(URLparamsObj.search.page) || 1; //page from query params or first page
    const limit: PageParams['limit'] = Number(URLparamsObj.search.limit) || 2; //limit from query params or min 2 prod on page

    return {
      page,
      limit,
    };
  }

  private static startEndIndexOnPage(page: number, limit: number) {
    const firstIndex = (page - 1) * limit;
    const lastIndex = firstIndex + (limit - 1);
    return [firstIndex, lastIndex];
  }

  private static hideRedundantProduct(prodIndex: number, prodEl: HTMLElement) {
    const { page, limit } = ProductsInCart.showPageAndLimit();
    const [start, end] = ProductsInCart.startEndIndexOnPage(page, limit);
    if (end < prodIndex || prodIndex < start) {
      prodEl.classList.add('hidden');
    }
  }

  private static onPaginationChange() {
    const prodElCollection = document.querySelectorAll<HTMLElement>(`.cart__product-item`);
    prodElCollection.forEach((el) => el.classList.remove('hidden'));
    prodElCollection.forEach((el, i) => {
      ProductsInCart.hideRedundantProduct(i, el);
    });
  }

  public async draw() {
    //limit input action
    const limitInputElem = <HTMLInputElement>this.headerEl.querySelector('#limit-prod-on-page');
    limitInputElem.addEventListener('change', ProductsInCart.onPaginationChange);
    //prev btn el action
    const prevPageBtnEl = <HTMLButtonElement>this.headerEl.querySelector('.cart__sub-page-btn-prev');
    prevPageBtnEl.addEventListener('click', ProductsInCart.onPaginationChange);

    const nextPageBtnEl = <HTMLButtonElement>this.headerEl.querySelector('.cart__sub-page-btn-next');
    nextPageBtnEl.addEventListener('click', ProductsInCart.onPaginationChange);
    //===================================================
    const products = await this.getProducts();

    if (products) {
      const fragment = <DocumentFragment>document.createDocumentFragment();
      const template = <HTMLTemplateElement>document.querySelector('#product-in-cart');

      products.forEach((prod, index) => {
        const prodClone = <HTMLElement>template.content.cloneNode(true);

        const prodEl = <HTMLElement>prodClone.querySelector('.cart__product-item');
        ProductsInCart.hideRedundantProduct(index, prodEl);
        prodEl.setAttribute('id', `product-id-${prod.id}`);

        //product image:
        const imgEl = <HTMLImageElement>prodClone.querySelector('.cart__product-img');
        imgEl.setAttribute('src', prod.thumbnail);
        imgEl.setAttribute('alt', prod.title);
        //product info:
        (<HTMLElement>prodClone.querySelector('.cart__product-title')).textContent = prod.title;
        (<HTMLElement>prodClone.querySelector('.cart__product-desc')).textContent = prod.description;
        (<HTMLElement>prodClone.querySelector('.cart__product-inf--rating')).textContent = prod.rating.toString();
        (<HTMLElement>prodClone.querySelector('.cart__product-inf--discount')).textContent =
          prod.discountPercentage.toString();
        (<HTMLElement>prodClone.querySelector('.cart__inf--stock')).textContent = prod.stock.toString();
        //how many in cart:
        const count: number | undefined = this.items.find((el) => el.id === prod.id)?.count;
        const countEl = <HTMLElement>prodClone.querySelector('.cart__product-count');
        countEl.textContent = count ? count.toString() : '1';
        //total price for one product*product quantity:
        const priceEl = <HTMLElement>prodClone.querySelector('.cart__product-price-quantity');
        priceEl.textContent = count ? `${prod.price * count}` : `${prod.price}`;

        // + and - product in Cart
        this.addOrRemoveProdAction(prodClone, prod.id, prod.price, prod.stock);

        fragment.append(prodClone);
      });

      this.listEl.innerHTML = '';
      this.listEl.append(fragment);
    }

    this.thumb.append(this.headerEl, this.listEl, this.summaryEl);
    return this.thumb;
  }
}
