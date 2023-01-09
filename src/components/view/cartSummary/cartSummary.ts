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
  }
}
