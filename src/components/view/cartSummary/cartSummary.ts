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
    const actualDiscountEl = <HTMLElement>document.querySelector('.cart__summary-discount-to-add');

    actualDiscountEl.innerHTML = '';

    if (inputEl.value === Discount[20] || inputEl.value === Discount[10]) {
      const discountName = <'RS' | 'EPM'>inputEl.value;
      const text = discountName === 'RS' ? 'Rolling Scopes School' : 'EPAM Systems';

      const cartStorage: Cart = JSON.parse(<string>CartController.getCart());

      const isDiscountActive = cartStorage.activeDiscountCodes.find((el) => el[discountName]);
      if (cartStorage.activeDiscountCodes.length === 0 || !isDiscountActive) {
        const htmlString = CartSummary.createHTMLStrAddDiscount(discountName, text);
        actualDiscountEl.insertAdjacentHTML('beforeend', htmlString);
        (<HTMLButtonElement>document.querySelector('.cart__discount-add-btn')).addEventListener(
          'click',
          CartSummary.addDiscount
        );
      } else if (isDiscountActive) {
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
    const discountListEl = <HTMLUListElement>document.querySelector('.cart__summary-discount-list');
    const totalAfterPriceThumbEl = <HTMLElement>document.querySelector('.cart__summary-desc--after');
    const totalAfterPriceEl = <HTMLElement>document.querySelector('.cart__summary-data--price-after');
    const totalPriceEl = <HTMLElement>document.querySelector('.cart__summary-desc--before');

    const targetElBtn = <HTMLElement>e.target;
    const discountName = <'RS' | 'EPM'>targetElBtn.id; //discount name: RS or EPM
    const text = discountName === 'RS' ? 'Rolling Scopes School' : 'EPAM Systems';
    const cartStorage: Cart = JSON.parse(<string>CartController.getCart());
    const isDiscountActive = cartStorage.activeDiscountCodes.find((el) => el[discountName]);
    //add title:
    if (cartStorage.activeDiscountCodes.length === 0) {
      discountListEl.insertAdjacentHTML('beforebegin', `<h3 class="cart__summary-discount-title">Applied codes</h3>`);
    }
    if (!isDiscountActive) {
      //add to Storage:
      CartController.setDiscount(discountName, Discount[discountName]);
      //reset opportunity to adding the same discount
      (<HTMLElement>targetElBtn.parentElement).innerHTML = `<p>${text} - ${Discount[discountName]}%</p>`;
      //add activated discount to list:
      discountListEl.insertAdjacentHTML(
        'beforeend',
        `<li
            class="cart__summary-discount-item ${discountName}">
            <p>${text} - ${Discount[discountName]}%</p>
            <button type="button" class="cart__discount-remove-btn">DROP</button>
          </li>`
      );

      totalAfterPriceThumbEl.classList.remove('hidden');

      totalAfterPriceEl.textContent = (<number>CartController.getTotalPriceAfterDiscount()).toString();
      totalPriceEl.classList.add('cross-out');
      //add listener on new btn
      const newCreatedEl = document.querySelector(`.cart__summary-discount-item.${discountName}`);
      if (newCreatedEl) {
        (<HTMLButtonElement>newCreatedEl.querySelector('.cart__discount-remove-btn')).addEventListener(
          'click',
          CartSummary.removeDiscount
        );
      }
    }

    targetElBtn.removeEventListener('click', CartSummary.addDiscount);
  }

  private static removeDiscount(e: Event) {
    const inputEl = <HTMLInputElement>document.querySelector('.cart__summary-input');
    const totalAfterThumbEl = <HTMLElement>document.querySelector('.cart__summary-desc--after');
    const totalAfterPriceEl = <HTMLElement>document.querySelector('.cart__summary-data--price-after');
    const totalPriceEl = <HTMLElement>document.querySelector('.cart__summary-desc--before');

    const targetElBtn = <HTMLElement>e.target;
    const discountName = <'RS' | 'EPM'>targetElBtn.parentElement?.classList.toString().split(' ')[1];

    const cartStorage: Cart = JSON.parse(<string>CartController.getCart());
    const isDiscountActive = cartStorage.activeDiscountCodes.find((el) => el[discountName]);

    if (isDiscountActive) {
      targetElBtn.parentElement?.remove();

      CartController.removeDiscount(discountName, Discount[discountName]);

      const newCartStorage: Cart = JSON.parse(<string>CartController.getCart());
      totalAfterPriceEl.textContent = (<number>newCartStorage.totalPriceAfterDiscount).toString();
      //if list empty = remove title:
      if (newCartStorage.activeDiscountCodes.length === 0) {
        document.querySelector('.cart__summary-discount-title')?.remove();
        totalAfterThumbEl.classList.add('hidden');
        totalPriceEl.classList.remove('cross-out');
      }
    }

    //activate input event for rerender propose discount:
    const inputEvent = new Event('input');
    inputEl.dispatchEvent(inputEvent);

    targetElBtn.removeEventListener('click', CartSummary.removeDiscount);
  }

  public draw() {
    const fragment = <DocumentFragment>document.createDocumentFragment();
    const template = <HTMLTemplateElement>document.querySelector('#cart-summary');

    const prodClone = <HTMLElement>template.content.cloneNode(true);
    const totalCountEl = <HTMLElement>prodClone.querySelector('.cart__summary-data--products');

    const totalPriceThumbEl = <HTMLElement>prodClone.querySelector('.cart__summary-desc--before');
    const totalPriceEl = <HTMLElement>prodClone.querySelector('.cart__summary-data--price');

    const discountInputEl = <HTMLInputElement>prodClone.querySelector('.cart__summary-input');

    const totalAfterThumbEl = <HTMLElement>prodClone.querySelector('.cart__summary-desc--after');
    const totalAfterPriceEl = <HTMLElement>prodClone.querySelector('.cart__summary-data--price-after');
    const discountListEl = <HTMLUListElement>prodClone.querySelector('.cart__summary-discount-list');

    totalCountEl.textContent = this.cart.totalCount.toString();
    totalPriceEl.textContent = this.cart.totalPrice.toString();

    if (this.cart.activeDiscountCodes.length > 0) {
      totalPriceThumbEl.classList.add('cross-out');
      totalAfterThumbEl.classList.remove('hidden');
      totalAfterPriceEl.textContent = this.cart.totalPriceAfterDiscount?.toString() || '';

      this.cart.activeDiscountCodes.forEach((el) => {
        const discountName = <'RS' | 'EPM'>Object.keys(el)[0];
        const text = discountName === 'RS' ? 'Rolling Scopes School' : 'EPAM Systems';
        const liEl = document.createElement('li');
        liEl.classList.add('cart__summary-discount-item');
        liEl.classList.add(discountName);
        const pEl = document.createElement('p');
        pEl.textContent = `${text} - ${Discount[discountName]}%`;
        const btnEl = document.createElement('button');
        btnEl.classList.add('cart__discount-remove-btn');
        btnEl.textContent = 'DROP';
        btnEl.addEventListener('click', CartSummary.removeDiscount);
        liEl.append(pEl, btnEl);
        discountListEl.append(liEl);
      });
    }

    discountInputEl.addEventListener('input', this.onInputAction);

    fragment.append(prodClone);
    this.thumb.append(fragment);
    return this.thumb;
  }
}
