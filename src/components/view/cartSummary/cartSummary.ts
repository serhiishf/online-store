import { Cart, Discount } from '../../../types';
import { CartController } from '../../controller/cartController';

export class CartSummary {
  cart: Cart;
  thumb: HTMLElement;

  constructor(cartStorage: Cart) {
    this.cart = cartStorage;
    this.thumb = document.createElement('div');
    this.thumb.classList.add('cart__summary');
  }

  private onInputAction() {
    const inputEl = <HTMLInputElement>document.querySelector('.cart__summary-input');
    // const priceAfterDiscount = <HTMLElement>document.querySelector('.cart__summary-desc--after-discount');
    const addedDiscountListEl = <HTMLUListElement>document.querySelector('.cart__summary-discount-list');
    const actualDiscountEl = <HTMLElement>document.querySelector('.cart__summary-discount-to-add');

    actualDiscountEl.innerHTML = '';

    if (inputEl.value === Discount[20] || inputEl.value === Discount[10]) {
      console.log('object');
      const discountName = <'RS' | 'EPM'>inputEl.value;
      const text = discountName === 'RS' ? 'Rolling Scopes School' : 'EPAM Systems';

      const isDiscountActivated = addedDiscountListEl.querySelector(`.cart__summary-discount--${discountName}`);
      if (addedDiscountListEl.childElementCount === 0 || !isDiscountActivated) {
        const htmlString = CartSummary.createHTMLStrAddDiscount(discountName, text);
        actualDiscountEl.insertAdjacentHTML('beforeend', htmlString);
        (<HTMLButtonElement>document.querySelector('.cart__discount-add-btn')).addEventListener(
          'click',
          CartSummary.addDiscount
        );
      } else if (isDiscountActivated) {
        const htmlString = `<p>${text} - ${Discount[discountName]}%</p>`;
        actualDiscountEl.insertAdjacentHTML('beforeend', htmlString);
      }
    }
  }

  private static createHTMLStrAddDiscount(discountName: 'RS' | 'EPM', text: string) {
    return `<p>${text} - ${Discount[discountName]}%</p>
                             <button class="cart__discount-add-btn"
                                id='${discountName}'
                                type="button">
                                ADD
                             </button>`;
  }

  private static addDiscount(e: Event) {
    const addedDiscountListEl = <HTMLUListElement>document.querySelector('.cart__summary-discount-list');
    const targetElBtn = <HTMLElement>e.target;
    const discountName = <'RS' | 'EPM'>targetElBtn.id; //discount name: RS or EPM
    const text = discountName === 'RS' ? 'Rolling Scopes School' : 'EPAM Systems';

    //add title:
    if (!(<HTMLElement>document.querySelector('.cart__summary-discount-title'))) {
      addedDiscountListEl.insertAdjacentHTML(
        'beforebegin',
        `<h3 class="cart__summary-discount-title">Applied codes</h3>`
      );
    }
    //add discount:
    //add to Storage:
    CartController.setDiscount(Discount[discountName]);
    //reset opportunity to adding the same discount
    (<HTMLElement>targetElBtn.parentElement).innerHTML = `<p>${text} - ${Discount[discountName]}%</p>`;
    //add activated discount to list:
    addedDiscountListEl.insertAdjacentHTML(
      'beforeend',
      `<li
            class="cart__summary-discount--${discountName}">
            <p>${text} - ${Discount[discountName]}%</p>
            <button type="button">DROP</button>
          </li>`
    );
    //add storage:
    //.......

    targetElBtn.removeEventListener('click', this.addDiscount);
  }

  public draw() {
    const fragment = <DocumentFragment>document.createDocumentFragment();
    const template = <HTMLTemplateElement>document.querySelector('#cart-summary');

    const prodClone = <HTMLElement>template.content.cloneNode(true);
    const totalCountEl = <HTMLElement>prodClone.querySelector('.cart__summary-data--products');
    const totalPriceEl = <HTMLElement>prodClone.querySelector('.cart__summary-data--price');
    const discountInputEl = <HTMLInputElement>prodClone.querySelector('.cart__summary-input');

    totalCountEl.textContent = this.cart.totalCount.toString();
    totalPriceEl.textContent = this.cart.totalPrice.toString();

    discountInputEl.addEventListener('input', this.onInputAction);

    fragment.append(prodClone);
    this.thumb.append(fragment);
    return this.thumb;
  }
}
