import { ModalWindow } from '../modalWindow/modalWindow'
import { Cart } from '../../../types';

export class CartSummary {
  cart: Cart;
  thumb: HTMLElement;

  constructor(cartStorage: Cart) {
    this.cart = cartStorage;
    this.thumb = document.createElement('div');
    this.thumb.classList.add('cart__summary');
  }

  public draw() {
    const fragment = <DocumentFragment>document.createDocumentFragment();
    const template = <HTMLTemplateElement>document.querySelector('#cart-summary');

    const prodClone = <HTMLElement>template.content.cloneNode(true);
    const totalCountEl = <HTMLElement>prodClone.querySelector('.cart__summary-data--products');
    const totalPriceEl = <HTMLElement>prodClone.querySelector('.cart__summary-data--price');
    const btnBuy = <HTMLElement>prodClone.querySelector('.cart__summary-btn');
    btnBuy.addEventListener('click', () => {
      const modalWindow = new ModalWindow().draw(() => {
        console.log('open modal window')
      });
      totalCountEl.after(modalWindow);
    })
    

    totalCountEl.textContent = this.cart.totalCount.toString();
    totalPriceEl.textContent = this.cart.totalPrice.toString();

    fragment.append(prodClone);
    this.thumb.append(fragment);
    return this.thumb;
  }
}
